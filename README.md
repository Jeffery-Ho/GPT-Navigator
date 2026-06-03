# Polaris for Web

一个用于 ChatGPT 和豆包网页版的段落导航扩展。它会识别 assistant 回复里的 `H1` 到 `H3` 标题，在页面右侧显示段落点；鼠标移入显示标题文字，点击后滚动到对应标题位置。

## 安装

1. 打开 Chrome 或 Edge 的扩展管理页面。
2. 开启开发者模式。
3. 选择“加载已解压的扩展程序”。
4. 选择本目录：`/Users/hexianji/Downloads/Polaris-for-Web`。
5. 打开或刷新 `https://chatgpt.com/` 或 `https://www.doubao.com/chat/...`。

## 行为

- 仅在 `chatgpt.com`、`chat.openai.com` 和 `www.doubao.com` 注入。
- 只识别 ChatGPT 和豆包回复区域内的 `h1`、`h2`、`h3`。
- 读取主体按当前站点自动适配，不需要手动切换 ChatGPT 或豆包。
- 页面内容变化时会自动重新扫描，适配流式输出的新标题。
- 右侧段落点按标题在整页中的位置分布，当前阅读位置会高亮。
- 右上角提供“设置”入口，鼠标移入后可调整顶部间距、右侧间距、最大显示数量和提示宽度。
- 前台设置会保存到 `chrome.storage.sync` 并即时生效；同一浏览器账号、同一扩展 ID 下可跨设备同步。
- 首次升级到同步配置时，如果同步区为空，会自动迁移当前站点已有的旧 `localStorage` 配置；扩展源码里的 CSS/JS 改动仍需要重新加载扩展后生效。

## 排查

如果在 Tabbit 或其他 Chromium 浏览器里看不到段落点：

1. 确认扩展管理页里插件已启用，并且加载的是本目录。
2. 刷新 ChatGPT 或豆包页面。
3. 打开开发者工具 Console，查看是否有 `[Polaris for Web] loaded`。
4. 在 Elements 面板搜索 `data-gpt-paragraph-nav`。

如果属性值是 `loaded:0`，说明插件已经注入，但当前页面没有识别到 `H1-H3` 标题。可以让 ChatGPT 或豆包输出包含 Markdown 标题，例如：

```markdown
# 一级标题
## 二级标题
### 三级标题
```
