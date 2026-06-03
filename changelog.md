# Changelog

## 2026-06-03

- 需求：将扩展显示名称从 GPT-Voyager/ChatGPT Paragraph Navigator 改为 Polaris for Web。
- 实现：更新 Manifest、README、guideline 标题和运行时 Console/aria 文案，保留内部 DOM/CSS 前缀不变。
- 需求：支持豆包 chat 页面里的 H1-H3 标题导航标记。
- 实现：在扩展注入范围中加入 `https://www.doubao.com/*`，并允许图标资源在豆包页面加载。
- 实现：内容脚本按当前站点自动选择回复区域，新增豆包回复区域选择器，并保留通用 Markdown 容器兜底扫描。
- 调整：标题识别范围统一为 H1-H3，不再记录 H4。
- 需求：让前台设置支持通过 `chrome.storage.sync` 跨设备同步。
- 实现：新增 `storage` 权限，将配置持久化迁移到 `chrome.storage.sync`，并在同步区为空时自动迁移旧 `localStorage` 配置。
- 需求：开始创建并记录 build 号。
- 实现：新增 `builds.md`，使用 `1-999` 数字 build 号记录构建，并在 Manifest 中写入 `version_name`。
- 需求：在设置菜单展示 `chrome.storage.sync` 是否已启用。
- 实现：设置菜单顶部新增同步状态行，读写同步存储成功时显示绿点“同步已启用”，不可用或失败时显示灰点“同步未启用”。
- 规则：每次代码或文档修改都必须新增 build；bug 修复更新版本号最后一位，功能更新更新中间一位，大更新更新第一位；版本类型由用户手动声明，每次 build 后需要确认 build 号和版本号。
- 修复：提高设置菜单层级，避免菜单被右侧 marker 覆盖。
- 需求：在设置菜单中展示当前插件版本和 build。
- 实现：从 Manifest 读取 `version_name` 并在设置菜单中只读展示，用于确认当前加载版本。
- 调整：将版本/build 小字移动到“同步已启用”右侧，间距为 `12pt`。
- 需求：发布到 GitHub、打包 zip，并明确开源协议。
- 实现：新增 MIT `LICENSE`，build 更新到 `7`，准备通过 GitHub Release 发布 `Polaris-for-Web-build-7.zip`。

## 2026-06-02

- 需求：将“收起全部”按钮更新为插件图标、文字和右侧箭头组合。
- 实现：按钮内嵌 32px 插件图标外壳，实际加载 96px 三倍图资源，保留展开/收起文字，并增加右侧 chevron。
- 需求：参考 `Voyager-icon.png` 风格生成可用于 Chrome 扩展商店的标准图标。
- 实现：新增 `icons/gpt-voyager-icon-*` 多尺寸 PNG 图标，主符号使用 `P`，外层画布透明但保留圆角矩形底，并在 `manifest.json` 中配置 16、32、48、128 尺寸。
- 需求：希望不进入扩展程序管理页，也能在 ChatGPT 前台调整导航浮层配置。
- 实现：在“收起全部”左侧新增“设置”入口，鼠标移入或键盘聚焦时弹出配置菜单。
- 实现：支持即时调整顶部间距、右侧间距、最大显示数量和提示宽度，并使用 `localStorage` 持久化。
- 修复：右侧导航容器使用全宽布局，避免 tooltip 被列表宽度裁剪；透明布局区域不拦截正文点击。
