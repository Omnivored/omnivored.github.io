/**
 * 游戏截图备注编辑器
 * ====================
 * 
 * 工作流程：
 * 1. 扫描本地 img/games/ 目录，自动发现所有截图
 * 2. 读取现有 _data/notes.yml 中的备注
 * 3. 启动本地 Web 编辑器，可视化填写备注
 * 4. 保存后自动更新 _data/notes.yml
 * 5. git push 即可发布
 * 
 * 使用方法：
 *   1. 运行编辑器:    node tools/notes-editor/server.js
 *   2. 浏览器打开:    http://localhost:3456
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const { execSync } = require('child_process');
const yaml = require('js-yaml');

// ============================================================
// 配置
// ============================================================
const CONFIG_PATH = path.join(__dirname, 'config.json');
const NOTES_PATH = path.resolve(__dirname, '../../_data/notes.yml');
const PORT = 3456;

function loadConfig() {
  const defaults = {
    rcloneRemote: 'r2',
    rcloneBucket: 'game-screenshots',
    publicUrlPrefix: 'https://pub-xxxxx.r2.dev',
    games: ['nikki', 'ff14']
  };
  try {
    const user = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    return { ...defaults, ...user };
  } catch {
    return defaults;
  }
}

// ============================================================
// 本地图片扫描 — 扫描 img/games/ 目录下的所有图片
// ============================================================
const PROJECT_ROOT = path.resolve(__dirname, '../../');

function scanLocalImages(config) {
  const allImages = {};
  for (const game of config.games) {
    const gameDir = path.join(PROJECT_ROOT, 'img', 'games', game);
    try {
      const files = fs.readdirSync(gameDir);
      const images = files
        .filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f))
        .map(f => ({
          filename: f,
          src: `/img/games/${game}/${f}`,
          size: fs.statSync(path.join(gameDir, f)).size
        }));
      if (images.length > 0) {
        allImages[game] = images;
        console.log(`   ${game}/: ${images.length} 张`);
      } else {
        console.log(`   ${game}/: (空目录)`);
      }
    } catch (e) {
      console.log(`   ${game}/: 目录不存在 (img/games/${game})`);
    }
  }
  return allImages;
}

// ============================================================
// YAML 备注读写
// ============================================================
function readNotes() {
  try {
    const doc = yaml.load(fs.readFileSync(NOTES_PATH, 'utf-8'));
    return doc || {};
  } catch {
    return {};
  }
}

function writeNotes(data) {
  // 自定义序列化，保持 YAML 格式整洁
  const lines = ['# 游戏截图备注文件', '# 在本地编辑此文件，上传后网站自动读取并关联到对应图片', '# 每个游戏一个子项，键为图片文件名，值为 4 个备注字段', '# 省略的字段默认为 null', ''];
  const gameIds = Object.keys(data).sort();
  for (const gameId of gameIds) {
    const images = data[gameId];
    const filenames = Object.keys(images).sort();
    if (filenames.length === 0) continue;
    lines.push(`${gameId}:`);
    for (const fname of filenames) {
      const note = images[fname];
      lines.push(`  "${fname}":`);
      lines.push(`    outfitCode: ${note.outfitCode ? JSON.stringify(note.outfitCode) : '""'}`);
      lines.push(`    cameraParams: ${note.cameraParams ? JSON.stringify(note.cameraParams) : '""'}`);
      lines.push(`    themeWords: ${note.themeWords ? JSON.stringify(note.themeWords) : '""'}`);
      lines.push(`    customNotes: ${note.customNotes ? JSON.stringify(note.customNotes) : '""'}`);
      lines.push('');
    }
  }
  fs.writeFileSync(NOTES_PATH, lines.join('\n'), 'utf-8');
  console.log(`\n✅ 已保存到 _data/notes.yml`);
}

// ============================================================
// HTTP 服务器 — 前端界面
// ============================================================
function serveHTML(config, r2Images, existingNotes) {
  // 合并 R2 图片与现有备注
  const games = {};
  const allGameIds = [...new Set([...config.games, ...Object.keys(r2Images), ...Object.keys(existingNotes)])];
  for (const gameId of allGameIds) {
    const images = r2Images[gameId] || [];
    const notes = existingNotes[gameId] || {};
    games[gameId] = images.map(img => {
      const note = notes[img.filename] || {};
      return {
        filename: img.filename,
        src: img.src,
        outfitCode: note.outfitCode || '',
        cameraParams: note.cameraParams || '',
        themeWords: note.themeWords || '',
        customNotes: note.customNotes || ''
      };
    });
  }

  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>游戏截图备注编辑器</title>
<style>
:root {
  --primary: #2c3e50;
  --accent: #e74c3c;
  --bg: #f5f5f5;
  --card: #fff;
  --border: #e0e0e0;
  --text: #333;
  --text-light: #888;
  --radius: 10px;
  --shadow: 0 2px 8px rgba(0,0,0,0.08);
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: var(--bg);
  color: var(--text);
  padding: 0;
}
header {
  background: var(--primary);
  color: #fff;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0,0,0,0.15);
}
header h1 { font-size: 18px; font-weight: 600; }
header .actions { display: flex; gap: 10px; align-items: center; }
header .actions .hint { font-size: 12px; opacity: 0.8; }
.btn {
  padding: 8px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-primary { background: #e74c3c; color: #fff; }
.btn-primary:hover { background: #c0392b; }
.btn-secondary { background: rgba(255,255,255,0.15); color: #fff; }
.btn-secondary:hover { background: rgba(255,255,255,0.25); }
.btn-success {
  background: #27ae60;
  color: #fff;
  padding: 10px 28px;
  font-size: 15px;
}
.btn-success:hover { background: #219a52; }
.btn-success:disabled { opacity: 0.5; cursor: not-allowed; }

/* 游戏标签 */
.game-tabs {
  display: flex;
  gap: 6px;
  padding: 16px 24px 0;
  flex-wrap: wrap;
}
.game-tab {
  padding: 8px 20px;
  border-radius: 8px 8px 0 0;
  border: 1px solid var(--border);
  border-bottom: none;
  background: #eee;
  color: var(--text-light);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}
.game-tab.active { background: var(--card); color: var(--text); font-weight: 600; }
.game-tab:hover:not(.active) { background: #e0e0e0; }
.game-tab .badge {
  display: inline-block;
  background: var(--accent);
  color: #fff;
  font-size: 11px;
  padding: 1px 7px;
  border-radius: 10px;
  margin-left: 5px;
}

/* 图片网格 */
.game-content {
  display: none;
  padding: 20px 24px;
}
.game-content.active { display: block; }
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 20px;
}
.gallery-card {
  background: var(--card);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
  transition: box-shadow 0.2s;
}
.gallery-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.12); }
.gallery-card .img-wrap {
  width: 100%;
  height: 200px;
  background: #1a1a2e;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.gallery-card .img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.gallery-card .img-wrap .load-error {
  color: #999;
  font-size: 13px;
  text-align: center;
  padding: 20px;
}
.notes-area {
  padding: 14px 16px 16px;
}
.notes-area .filename {
  font-size: 12px;
  color: var(--text-light);
  margin-bottom: 10px;
  word-break: break-all;
  font-family: monospace;
}
.note-field { margin-bottom: 10px; }
.note-field:last-child { margin-bottom: 0; }
.note-field label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-light);
  margin-bottom: 3px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}
.note-field input,
.note-field textarea {
  width: 100%;
  padding: 7px 10px;
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s;
  font-family: inherit;
  background: #fafafa;
}
.note-field input:focus,
.note-field textarea:focus {
  border-color: var(--accent);
  background: #fff;
}
.note-field textarea { resize: vertical; min-height: 40px; }

/* 保存提示 */
.toast {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%) translateY(100px);
  background: #27ae60;
  color: #fff;
  padding: 12px 28px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  opacity: 0;
  transition: all 0.4s;
  z-index: 999;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
}
.toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
.toast.error { background: #e74c3c; }

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #aaa;
  font-size: 14px;
  line-height: 2;
}

/* 响应式 */
@media (max-width: 768px) {
  .gallery-grid { grid-template-columns: 1fr; }
  header h1 { font-size: 15px; }
  .game-tabs { padding: 12px 12px 0; }
  .game-content { padding: 12px; }
}

/* 加载动画 */
.loading {
  text-align: center;
  padding: 60px;
  color: #aaa;
}
.spinner {
  display: inline-block;
  width: 32px;
  height: 32px;
  border: 3px solid #eee;
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
</head>
<body>

<header>
  <h1>🎮 游戏截图备注编辑器</h1>
  <div class="actions">
    <span class="hint">编辑后点击保存 → 自动更新 _data/notes.yml</span>
    <button class="btn btn-secondary" onclick="saveAll()">💾 保存到 YAML</button>
  </div>
</header>

<div class="game-tabs" id="gameTabs"></div>

<div id="gameContents"></div>

<div class="toast" id="toast"></div>

<script>
// ------------------------------------------------------------
// 数据 — 由后端注入
// ------------------------------------------------------------
var GAMES = ${JSON.stringify(games, null, 2)};
var GAME_IDS = ${JSON.stringify(allGameIds)};

// ------------------------------------------------------------
// 渲染
// ------------------------------------------------------------
function render() {
  var tabHtml = '';
  var contentHtml = '';

  GAME_IDS.forEach(function(id, idx) {
    var images = GAMES[id] || [];
    var active = idx === 0 ? ' active' : '';

    tabHtml += '<div class="game-tab' + active + '" data-game="' + id + '">' + cap(id) + ' <span class="badge">' + images.length + '</span></div>';
  });

  GAME_IDS.forEach(function(id, idx) {
    var images = GAMES[id] || [];
    var active = idx === 0 ? ' active' : '';

    contentHtml += '<div class="game-content' + active + '" id="content-' + id + '">';

    if (images.length === 0) {
      contentHtml += '<div class="empty-state">📭 暂无截图<br>请先将图片上传到 R2 的 ' + id + '/ 目录</div>';
    } else {
      contentHtml += '<div class="gallery-grid">';
      images.forEach(function(img) {
        contentHtml += '<div class="gallery-card" data-filename="' + escAttr(img.filename) + '">';
        contentHtml += '  <div class="img-wrap">';
        contentHtml += '    <img src="' + escAttr(img.src) + '" alt="' + escAttr(img.filename) + '" loading="lazy" onerror="handleImgError(this)" />';
        contentHtml += '  </div>';
        contentHtml += '  <div class="notes-area">';
        contentHtml += '    <div class="filename">' + escHtml(img.filename) + '</div>';
        contentHtml += '    <div class="note-field"><label>🎀 搭配码</label><input type="text" class="note-input" data-field="outfitCode" value="' + escAttr(img.outfitCode) + '" placeholder="输入搭配码" /></div>';
        contentHtml += '    <div class="note-field"><label>📷 镜头参数</label><input type="text" class="note-input" data-field="cameraParams" value="' + escAttr(img.cameraParams) + '" placeholder="输入镜头参数" /></div>';
        contentHtml += '    <div class="note-field"><label>🏷️ 主题词</label><input type="text" class="note-input" data-field="themeWords" value="' + escAttr(img.themeWords) + '" placeholder="输入主题词" /></div>';
        contentHtml += '    <div class="note-field"><label>📝 自定义备注</label><textarea class="note-input" data-field="customNotes" rows="2" placeholder="输入自定义备注">' + escHtml(img.customNotes) + '</textarea></div>';
        contentHtml += '  </div>';
        contentHtml += '</div>';
      });
      contentHtml += '</div>';
    }
    contentHtml += '</div>';
  });

  document.getElementById('gameTabs').innerHTML = tabHtml;
  document.getElementById('gameContents').innerHTML = contentHtml;

  // 绑定标签点击事件
  document.querySelectorAll('.game-tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      switchGame(this.getAttribute('data-game'));
    });
  });
}

function switchGame(id) {
  document.querySelectorAll('.game-tab').forEach(function(t) { t.classList.toggle('active', t.dataset.game === id); });
  document.querySelectorAll('.game-content').forEach(function(c) { c.classList.toggle('active', c.id === 'content-' + id); });
}

function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function escAttr(s) { return String(s).replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function escHtml(s) { return String(s).replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function handleImgError(img) { img.onerror = null; img.parentElement.innerHTML = '<div class=load-error>⚠️ 加载失败: ' + escHtml(img.alt) + '</div>'; }

// ------------------------------------------------------------
// 保存
// ------------------------------------------------------------
function collectData() {
  var data = {};
  GAME_IDS.forEach(function(gameId) {
    data[gameId] = {};
    var cards = document.querySelectorAll('#content-' + gameId + ' .gallery-card');
    cards.forEach(function(card) {
      var filename = card.dataset.filename;
      var note = { outfitCode: '', cameraParams: '', themeWords: '', customNotes: '' };
      card.querySelectorAll('.note-input').forEach(function(el) {
        note[el.dataset.field] = el.value;
      });
      data[gameId][filename] = note;
    });
  });
  return data;
}

function saveAll() {
  var btn = document.querySelector('.btn-secondary');
  btn.disabled = true;
  btn.textContent = '⏳ 保存中...';

  var data = collectData();
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/api/save', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = function() {
    btn.disabled = false;
    btn.textContent = '💾 保存到 YAML';
    if (xhr.status === 200) {
      showToast('✅ 已保存到 _data/notes.yml，可以执行 git push 了！', false);
    } else {
      showToast('❌ 保存失败: ' + xhr.responseText, true);
    }
  };
  xhr.onerror = function() {
    btn.disabled = false;
    btn.textContent = '💾 保存到 YAML';
    showToast('❌ 网络错误，请重试', true);
  };
  xhr.send(JSON.stringify(data));
}

function showToast(msg, isError) {
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show' + (isError ? ' error' : '');
  setTimeout(function() { t.classList.remove('show'); }, 3000);
}

// 页面加载时自动保存的快捷键 Ctrl+S
document.addEventListener('keydown', function(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    saveAll();
  }
});

render();
</script>
</body>
</html>`;

  return html;
}

// ============================================================
// 主流程
// ============================================================
function main() {
  console.log('🎮 游戏截图备注编辑器\n');

  const config = loadConfig();

  // 扫描本地 img/games/ 目录
  console.log(`🔍 扫描本地目录 img/games/...`);
  const localImages = scanLocalImages(config);
  const totalImages = Object.values(localImages).reduce((sum, arr) => sum + arr.length, 0);
  console.log(`   共发现 ${totalImages} 张截图`);

  // 读取现有备注
  console.log(`\n📖 读取 _data/notes.yml...`);
  const existingNotes = readNotes();
  const noteCount = Object.values(existingNotes).reduce((sum, obj) => sum + Object.keys(obj).length, 0);
  console.log(`   已有 ${noteCount} 条备注`);

  // 生成前端 HTML
  const html = serveHTML(config, localImages, existingNotes);

  // 启动服务器
  const server = http.createServer((req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    if (req.method === 'POST' && req.url === '/api/save') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const data = JSON.parse(body);
          // 只保留有备注的图片（至少有一个字段非空）
          const cleaned = {};
          for (const [gameId, images] of Object.entries(data)) {
            const gameNotes = {};
            for (const [fname, note] of Object.entries(images)) {
              const hasContent = note.outfitCode || note.cameraParams || note.themeWords || note.customNotes;
              if (hasContent) {
                gameNotes[fname] = note;
              }
            }
            if (Object.keys(gameNotes).length > 0) {
              cleaned[gameId] = gameNotes;
            }
          }
          writeNotes(cleaned);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true }));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.end(e.message);
        }
      });
      return;
    }

    if (req.method === 'GET' && req.url.startsWith('/img/')) {
      // 提供静态文件（图片）
      const filePath = path.join(PROJECT_ROOT, req.url);
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        const mime = {
          '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
          '.png': 'image/png', '.gif': 'image/gif',
          '.webp': 'image/webp'
        };
        res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
        fs.createReadStream(filePath).pipe(res);
        return;
      }
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    // 提供前端页面
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
  });

  server.listen(PORT, () => {
    const url = `http://localhost:${PORT}`;
    console.log(`\n🚀 编辑器已启动: ${url}`);
    console.log('💡 按 Ctrl+C 退出\n');
    
    // 尝试自动打开浏览器
    try {
      execSync(`start ${url}`, { stdio: 'ignore' });
    } catch {}
  });
}

main();