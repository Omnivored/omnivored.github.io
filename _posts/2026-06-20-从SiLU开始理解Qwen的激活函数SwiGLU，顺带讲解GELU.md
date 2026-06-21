---
layout:     post
title:      "深度学习基础系列"
subtitle:   " \"从SiLU开始理解Qwen的激活函数SwiGLU，顺带讲解GELU\""
date:       2026-06-20 12:55:00
author:     "Omnivored"
header-img: "img/Swish/GLU门控激活函数结构.png"
tags:
    - 激活函数
---
Qwen2.5和Qwen3的transformer block结构都是：**归一化 + 多头自注意力 Multi-Head Attention （+Norm&残差）+ FFN（+Norm&残差）** ，其中FFN是一个MLP全连接层，为了引入非线性需要使用激活函数。注意力管上下文关联，MLP 管语义理解与知识存储。
大模型绝大多数算力都耗在MLP上，所以它的结构以及最重要的激活函数有很多研究。对于Qwen3等较新的基座模型，流行使用将激活函数作为门控信号的门控网络，比如SwiGLU。本文从最基础的SiLU开始解释这是怎么一回事。

> **【最重要的前提】**
> **GLU和SwiGLU**并不是激活函数，而是一种**门控网络**，它将激活函数的输出作为门控信号。GLU使用的是sigmoid激活函数，而SwiGLU使用的是Swish激活函数。如图所示：Swish激活函数是指"Act"部分，而**SwiGLU**包含上面的两个Linear、Act以及**逐位乘**操作。

![GLU门控激活函数结构](/img/Swish/GLU门控激活函数结构.png)

# 一、Swish系列

LLM模型比如qwen3在FFN层使用SwiGLU激活函数，从基础函数开始讲解。

## 1.1 SiLU函数(Sigmoid Linear Unit)

$$SiLU(x) = x \cdot sigmoid(x)$$

![SiLU函数曲线](/img/Swish/image-9.png)

连续、平滑且可导，**Swish-1**（Swish 激活的一种特例，β=1），"允许负值信息泄漏"+"整体平滑可导"特性，会带来更好的梯度传播和优化稳定性。

Swish 函数可以理解为**对输入 x 进行"自门控"的机制**：输入 x 乘以其经过 Sigmoid 函数的值，相当于让 x 自己决定通过的比例。**当 x 较大时，σ(x) 趋近于1，此时 Swish 函数近似为 x；当 x 较小时，σ(x) 会使 x 被适当缩放，从而调整激活值。**

**Swish 具体的设计目标：**

- 在 x 很大的时候，像线性函数一样（不过不完全等于恒等映射）；
- 在 x 在 0 附近的时候，表现得像"**温和渐变**版本的 ReLU"，不过比 ReLU 更平滑；
- 在 x 为负的时候，不是直接砍掉（像 ReLU 那样变成 0），而是允许一小部分负值继续通过，从而保留信息。
- 非单调性：SiLU 的曲线是轻微非单调的，也就是说在小于 0 的区域附近，函数值会先比线性更低一点点，然后才慢慢上升。这一点跟 ReLU 完全不同。这段"**轻微下凹**"的区域给了网络更灵活的表示能力：网络可以在小负值区间里学到"**某些特征最好是被稍微抑制但不要彻底抹掉**"。这种软抑制，可以被视为一种**自适应门控行为**。

SiLU的**导数**非常重要：它**完全连续**，没有像 ReLU 在 0 点那种"折痕"（不可导点）。这种平滑梯度，往往能让网络训练得更**稳定**，尤其是**深层网络或者混合注意力/卷积网络**。

![SiLU导数曲线](/img/Swish/image-8.png)

## 1.2 Swish

$$Swish(βx) = x \cdot σ(βx)$$

β 可以是常数，也可以是可学习的参数。在一般开源代码中，β就取1，即SiLU，比如在Qwen2.5和Qwen3 的MLP部分使用的激活函数是Silu，从源代码中可以看到，`config.hidden_act==silu`。针对各自的任务场景和数据可能需要对β进行调参实验对比。

## 1.3 GLU

SwiGLU是Swish与GLU的结合，因此先讲解GLU。

先看公式：$GLU(x) = \sigma(W_1 x) \otimes (W_2 x)$

配合结构图：

![GLU门控激活函数结构](/img/Swish/GLU门控激活函数结构.png)

**流程说明：** 输入x分别输入两个线性层Linear升维，左边$Linear_1(x)$经过激活函数（对于GLU激活函数是sigmoid  $\sigma()$），然后与右边的$Linear_2(x)$逐元素相乘，结果再经过Linear层降维还原。

**为什么叫门控？**

门控机制：**一个数值（门权重）动态决定另一个数据流的流通强弱**，对于GLU，用$\sigma(W_1 x)$系数，对另一路原始特征做缩放、筛选、抑制或增强。

**为什么用门控？**

传统单激活只是固定非线性变换；门控是动态自适应调制，更容易建模复杂逻辑、长依赖、知识关联

## 1.4 SwiGLU

结构图与GLU一模一样，只是激活函数变成Swish，即$SwiGLU(x) = Swish(W_1 x) \otimes (W_2 x)$

![SwiGLU函数曲线](/img/Swish/image-10.png)

# 二、GELU

GELU(Gaussian Error Linear Unit，高斯误差线性单元)也是一种通过**门控机制来调整其输出值**的激活函数，看字母与GLU很像，但和GLU不是一回事，反而**和 Swish 函数比较类似**。

**应用：** Qwen2.5-VL的视觉编码器部分的VisionMLP部分使用的激活函数是QuickGELU（是GELU的近似实现，不算新函数）；许多 GPT/BERT/Transformer变体默认使用 GELU。

**公式**：$\operatorname{GELU}(x) = x \cdot \Phi(x)$

其中，$\Phi(x)$ 是**标准正态分布的累积分布函数**，表示一个标准正态随机变量小于 $x$ 的概率。

可以发现它和Swish的结构一样，所以他也是一种自门控式的激活函数，连续可导，负区间有微小值。

GELU 函数的核心思想是"概率性激活"：将输入 x 与其"被激活"的概率（由正态累积分布 Φ(x) 表示）相乘。这意味着，一个神经元的激活不仅依赖于输入的大小，还依赖于**该输入在统计意义上有多大可能被视为"正向贡献"。**

**函数曲线**：

![GELU函数曲线](/img/Swish/GELU.jpeg)

$\mu, \sigma$ 为超参数，一般设 $\mu = 0,\, \sigma = 1$ 即可。由于高斯分布的累积分布函数为 S 型函数，因此 GELU 函数可以用 Tanh 函数或 Logistic 函数来近似，

为了便于计算，实际应用中常使用以下近似公式：

$$\operatorname{GELU}(x) \approx 0.5x\left[1+\tanh\left(\sqrt{\frac{2}{\pi}}\left(x+0.044715x^3\right)\right)\right].$$

或者近似于Swish函数结构，相当于β =1.702的 Swish 函数，一般称其为QuickGELU

$$\operatorname{QuickGELU}(x) \approx x\sigma(1.702x).$$

# 三、GELU vs Swish

你可能发现，这两个激活函数的曲线看着一样啊，实则不然，下面是函数和梯度的曲线对比。从ReLU/GELU/QuickGELU到Swish(β=1)，函数曲线和梯度曲线**越来越平滑**，越平滑就意味着训练越稳定。但对于不同任务不是越平滑越好，具体问题具体分析。

![函数和梯度曲线对比](/img/Swish/Figure_1.png)

![函数和梯度曲线对比](/img/Swish/Figure_2.png)
