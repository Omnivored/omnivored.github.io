Run actions/jekyll-build-pages@v1

9
/usr/bin/docker run --name ghcrioactionsjekyllbuildpagesv1013_ca5399 --label 1a3705 --workdir /github/workspace --rm -e "INPUT_SOURCE" -e "INPUT_DESTINATION" -e "INPUT_FUTURE" -e "INPUT_BUILD_REVISION" -e "INPUT_VERBOSE" -e "INPUT_TOKEN" -e "HOME" -e "GITHUB_JOB" -e "GITHUB_REF" -e "GITHUB_SHA" -e "GITHUB_REPOSITORY" -e "GITHUB_REPOSITORY_OWNER" -e "GITHUB_REPOSITORY_OWNER_ID" -e "GITHUB_RUN_ID" -e "GITHUB_RUN_NUMBER" -e "GITHUB_RETENTION_DAYS" -e "GITHUB_RUN_ATTEMPT" -e "GITHUB_ACTOR_ID" -e "GITHUB_ACTOR" -e "GITHUB_WORKFLOW" -e "GITHUB_HEAD_REF" -e "GITHUB_BASE_REF" -e "GITHUB_EVENT_NAME" -e "GITHUB_SERVER_URL" -e "GITHUB_API_URL" -e "GITHUB_GRAPHQL_URL" -e "GITHUB_REF_NAME" -e "GITHUB_REF_PROTECTED" -e "GITHUB_REF_TYPE" -e "GITHUB_WORKFLOW_REF" -e "GITHUB_WORKFLOW_SHA" -e "GITHUB_REPOSITORY_ID" -e "GITHUB_TRIGGERING_ACTOR" -e "GITHUB_WORKSPACE" -e "GITHUB_ACTION" -e "GITHUB_EVENT_PATH" -e "GITHUB_ACTION_REPOSITORY" -e "GITHUB_ACTION_REF" -e "GITHUB_PATH" -e "GITHUB_ENV" -e "GITHUB_STEP_SUMMARY" -e "GITHUB_STATE" -e "GITHUB_OUTPUT" -e "RUNNER_OS" -e "RUNNER_ARCH" -e "RUNNER_NAME" -e "RUNNER_ENVIRONMENT" -e "RUNNER_TOOL_CACHE" -e "RUNNER_TEMP" -e "RUNNER_WORKSPACE" -e "ACTIONS_RUNTIME_URL" -e "ACTIONS_RUNTIME_TOKEN" -e "ACTIONS_CACHE_URL" -e "ACTIONS_ID_TOKEN_REQUEST_URL" -e "ACTIONS_ID_TOKEN_REQUEST_TOKEN" -e "ACTIONS_RESULTS_URL" -e "ACTIONS_ORCHESTRATION_ID" -e GITHUB_ACTIONS=true -e CI=true -v "/var/run/docker.sock":"/var/run/docker.sock" -v "/home/runner/work/_temp":"/github/runner_temp" -v "/home/runner/work/_temp/_github_home":"/github/home" -v "/home/runner/work/_temp/_github_workflow":"/github/workflow" -v "/home/runner/work/_temp/_runner_file_commands":"/github/file_commands" -v "/home/runner/work/omnivored.github.io/omnivored.github.io":"/github/workspace" ghcr.io/actions/jekyll-build-pages:v1.0.13

10
       Deprecation: The 'gems' configuration option has been renamed to 'plugins'. Please update your config file accordingly.

11
To use retry middleware with Faraday v2.0+, install `faraday-retry` gem

12
    Liquid Warning: Liquid syntax error (line 50): Unexpected character & in "site.duoshuo_share && site.duoshuo_username" in /_layouts/post.html

13
    Liquid Warning: Liquid syntax error (line 125): Unexpected character { in "tag[1].size > {{site.featured-condition-size}}" in /_layouts/post.html

14
    Liquid Warning: Liquid syntax error (line 50): Unexpected character & in "site.duoshuo_share && site.duoshuo_username" in /_layouts/post.html

15
    Liquid Warning: Liquid syntax error (line 125): Unexpected character { in "tag[1].size > {{site.featured-condition-size}}" in /_layouts/post.html

16
    Liquid Warning: Liquid syntax error (line 50): Unexpected character & in "site.duoshuo_share && site.duoshuo_username" in /_layouts/post.html

17
    Liquid Warning: Liquid syntax error (line 125): Unexpected character { in "tag[1].size > {{site.featured-condition-size}}" in /_layouts/post.html

18
    Liquid Warning: Liquid syntax error (line 58): Unexpected character & in "site.duoshuo_share && site.duoshuo_username" in /_layouts/keynote.html

19
    Liquid Warning: Liquid syntax error (line 133): Unexpected character { in "tag[1].size > {{site.featured-condition-size}}" in /_layouts/keynote.html

20
    Liquid Warning: Liquid syntax error (line 50): Unexpected character & in "site.duoshuo_share && site.duoshuo_username" in /_layouts/post.html

21
    Liquid Warning: Liquid syntax error (line 125): Unexpected character { in "tag[1].size > {{site.featured-condition-size}}" in /_layouts/post.html

22
    Liquid Warning: Liquid syntax error (line 38): Unexpected character { in "tag[1].size > {{site.featured-condition-size}}" in /_layouts/page.html

23
    Liquid Warning: Liquid syntax error (line 87): Unexpected character { in "tag[1].size > {{site.featured-condition-size}}" in /_layouts/page.html

24
    Liquid Warning: Liquid syntax error (line 38): Unexpected character { in "tag[1].size > {{site.featured-condition-size}}" in /_layouts/page.html

25
    Liquid Warning: Liquid syntax error (line 87): Unexpected character { in "tag[1].size > {{site.featured-condition-size}}" in /_layouts/page.html

26
  Liquid Exception: Liquid syntax error (line 235): 'if' tag was never closed in README.zh.md

27
/usr/local/bundle/gems/liquid-4.0.4/lib/liquid/block.rb:63:in `block in parse_body': Liquid syntax error (line 235): 'if' tag was never closed (Liquid::SyntaxError)

28
	from /usr/local/bundle/gems/liquid-4.0.4/lib/liquid/block_body.rb:52:in `parse'

29
	from /usr/local/bundle/gems/liquid-4.0.4/lib/liquid/block.rb:58:in `parse_body'

30
	from /usr/local/bundle/gems/liquid-4.0.4/lib/liquid/tags/if.rb:30:in `parse'

31
	from /usr/local/bundle/gems/liquid-4.0.4/lib/liquid/tag.rb:10:in `parse'

32
	from /usr/local/bundle/gems/liquid-4.0.4/lib/liquid/block_body.rb:34:in `parse'

33
	from /usr/local/bundle/gems/liquid-4.0.4/lib/liquid/document.rb:10:in `parse'

34
	from /usr/local/bundle/gems/liquid-4.0.4/lib/liquid/document.rb:5:in `parse'

35
	from /usr/local/bundle/gems/liquid-4.0.4/lib/liquid/template.rb:130:in `parse'

36
	from /usr/local/bundle/gems/liquid-4.0.4/lib/liquid/template.rb:114:in `parse'

37
	from /usr/local/bundle/gems/jekyll-3.10.0/lib/jekyll/liquid_renderer/file.rb:13:in `block in parse'

38
	from /usr/local/bundle/gems/jekyll-3.10.0/lib/jekyll/liquid_renderer/file.rb:49:in `measure_time'

39
	from /usr/local/bundle/gems/jekyll-3.10.0/lib/jekyll/liquid_renderer/file.rb:12:in `parse'

40
	from /usr/local/bundle/gems/jekyll-3.10.0/lib/jekyll/renderer.rb:121:in `render_liquid'

41
	from /usr/local/bundle/gems/jekyll-3.10.0/lib/jekyll/renderer.rb:79:in `render_document'

42
	from /usr/local/bundle/gems/jekyll-3.10.0/lib/jekyll/renderer.rb:62:in `run'

43
	from /usr/local/bundle/gems/jekyll-3.10.0/lib/jekyll/site.rb:479:in `render_regenerated'

44
	from /usr/local/bundle/gems/jekyll-3.10.0/lib/jekyll/site.rb:472:in `block in render_pages'

45
	from /usr/local/bundle/gems/jekyll-3.10.0/lib/jekyll/site.rb:471:in `each'

46
	from /usr/local/bundle/gems/jekyll-3.10.0/lib/jekyll/site.rb:471:in `render_pages'

47
	from /usr/local/bundle/gems/jekyll-3.10.0/lib/jekyll/site.rb:192:in `render'

48
	from /usr/local/bundle/gems/jekyll-3.10.0/lib/jekyll/site.rb:71:in `process'

49
	from /usr/local/bundle/gems/jekyll-3.10.0/lib/jekyll/command.rb:28:in `process_site'

50
	from /usr/local/bundle/gems/jekyll-3.10.0/lib/jekyll/commands/build.rb:65:in `build'

51
	from /usr/local/bundle/gems/jekyll-3.10.0/lib/jekyll/commands/build.rb:36:in `process'

52
	from /usr/local/bundle/gems/github-pages-232/bin/github-pages:70:in `block (3 levels) in <top (required)>'

53
	from /usr/local/bundle/gems/mercenary-0.3.6/lib/mercenary/command.rb:220:in `block in execute'

54
	from /usr/local/bundle/gems/mercenary-0.3.6/lib/mercenary/command.rb:220:in `each'

55
	from /usr/local/bundle/gems/mercenary-0.3.6/lib/mercenary/command.rb:220:in `execute'

56
	from /usr/local/bundle/gems/mercenary-0.3.6/lib/mercenary/program.rb:42:in `go'

57
	from /usr/local/bundle/gems/mercenary-0.3.6/lib/mercenary.rb:19:in `program'

58
	from /usr/local/bundle/gems/github-pages-232/bin/github-pages:6:in `<top (required)>'

59
	from /usr/local/bundle/bin/github-pages:25:in `load'

60
	from /usr/local/bundle/bin/github-pages:25:in `<main>'

61
Error:  Logging at level: debug Configuration file: /github/workspace/./_config.yml GitHub Pages: github-pages v232 GitHub Pages: jekyll v3.10.0 Theme: jekyll-theme-primer Theme source: /usr/local/bundle/gems/jekyll-theme-primer-0.6.0 Requiring: jekyll-github-metadata Requiring: jekyll-seo-tag Requiring: jekyll-paginate Requiring: jekyll-coffeescript Requiring: jekyll-commonmark-ghpages Requiring: jekyll-gist Requiring: jekyll-github-metadata Requiring: jekyll-relative-links Requiring: jekyll-optional-front-matter Requiring: jekyll-readme-index Requiring: jekyll-default-layout Requiring: jekyll-titles-from-headings GitHub Metadata: Initializing... Source: /github/workspace/. Destination: /github/workspace/./_site Incremental build: disabled. Enable with --incremental Generating... EntryFilter: excluded /package.json EntryFilter: excluded /Gruntfile.js EntryFilter: excluded /less EntryFilter: excluded /README.md Reading: _posts/2014-01-29-hello-2015.markdown Reading: _posts/2015-04-14-unix-linux-note.markdown Reading: _posts/2015-05-25-js-module-loader.markdown Reading: _posts/2015-07-09-js-module-7day.markdown Reading: _posts/2015-09-22-js-version.markdown Generating: JekyllOptionalFrontMatter::Generator finished in 0.000141357 seconds. Generating: JekyllReadmeIndex::Generator finished in 4.6958e-05 seconds. Generating: Jekyll::Paginate::Pagination finished in 0.00030097 seconds. Generating: JekyllRelativeLinks::Generator finished in 0.000682601 seconds. Generating: JekyllDefaultLayout::Generator finished in 0.001228098 seconds. Requiring: kramdown-parser-gfm Generating: JekyllTitlesFromHeadings::Generator finished in 0.006620713 seconds. Rendering: _posts/2014-01-29-hello-2015.markdown Pre-Render Hooks: _posts/2014-01-29-hello-2015.markdown Rendering Markup: _posts/2014-01-29-hello-2015.markdown Rendering Layout: _posts/2014-01-29-hello-2015.markdown Layout source: site Rendering: _posts/2015-04-14-unix-linux-note.markdown Pre-Render Hooks: _posts/2015-04-14-unix-linux-note.markdown Rendering Markup: _posts/2015-04-14-unix-linux-note.markdown Rendering Layout: _posts/2015-04-14-unix-linux-note.markdown Layout source: site Rendering: _posts/2015-05-25-js-module-loader.markdown Pre-Render Hooks: _posts/2015-05-25-js-module-loader.markdown Rendering Markup: _posts/2015-05-25-js-module-loader.markdown Rendering Layout: _posts/2015-05-25-js-module-loader.markdown Layout source: site Rendering: _posts/2015-07-09-js-module-7day.markdown Pre-Render Hooks: _posts/2015-07-09-js-module-7day.markdown Rendering Markup: _posts/2015-07-09-js-module-7day.markdown Rendering Layout: _posts/2015-07-09-js-module-7day.markdown Layout source: site Rendering: _posts/2015-09-22-js-version.markdown Pre-Render Hooks: _posts/2015-09-22-js-version.markdown Rendering Markup: _posts/2015-09-22-js-version.markdown Rendering Layout: _posts/2015-09-22-js-version.markdown Layout source: site Rendering: 404.html Pre-Render Hooks: 404.html Rendering Liquid: 404.html Rendering Markup: 404.html Rendering Layout: 404.html Layout source: site Rendering: about.html Pre-Render Hooks: about.html Rendering Liquid: about.html Rendering Markup: about.html Rendering Layout: about.html Layout source: site Rendering: feed.xml Pre-Render Hooks: feed.xml Rendering Liquid: feed.xml Rendering Markup: feed.xml Rendering Layout: feed.xml Rendering: index.html Pre-Render Hooks: index.html Rendering Liquid: index.html Rendering Markup: index.html Rendering Layout: index.html Layout source: site Rendering: tags.html Pre-Render Hooks: tags.html Rendering Liquid: tags.html Rendering Markup: tags.html Rendering Layout: tags.html Layout source: site Rendering: assets/css/style.scss Pre-Render Hooks: assets/css/style.scss Rendering Markup: assets/css/style.scss Rendering: README.zh.md Pre-Render Hooks: README.zh.md Rendering Liquid: README.zh.md github-pages 232 | Error: Liquid syntax error (line 235): 'if' tag was never closed 