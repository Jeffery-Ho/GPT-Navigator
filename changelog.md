# Changelog

## 2026-06-07

- 文档：README 改为 GitHub 展示用的最简版本，补充按平台 Marker 类型过滤、liquid glass 和滚轮命中区优化。
- 版本：文档更新到 `0.10.2 build 38`。
- 调整：设置菜单控件参考 Arco Design 风格，统一 input、checkbox、重置按钮、间距和文字层级。
- 实现：新增 Arco-like 颜色变量，保留 liquid glass 外层菜单，同时让表单控件使用浅灰背景、浅边框、蓝色选中态和轻量 hover。
- 版本：修复更新到 `0.10.1 build 37`。
- 功能：设置菜单新增按当前平台过滤 marker 类型，可独立控制 H1/H2/H3。
- 实现：新增 `enabledLevelsByPlatform` 同步配置，ChatGPT、豆包、Kimi、千问、元宝分别保存启用级别，并防止关闭最后一个级别。
- 版本：功能更新到 `0.10.0 build 36`。
- 优化：marker 列表滚轮命中区域扩大到右侧插件最大宽度，不再需要精确滚到 marker pill 上。
- 实现：新增非点击拦截的 wheel 捕获检测，只在 marker 列表可视纵向范围和右侧插件宽度内转发滚动到列表。
- 版本：修复更新到 `0.9.9 build 35`。

## 2026-06-05

- 调整：设置输入框聚焦态去掉黄色边框。
- 调整：重置按钮去掉玻璃态 1px 描边。
- 版本：修复更新到 `0.9.8 build 34`。
- 调整：设置按钮去掉玻璃态 1px 描边。
- 调整：设置输入框和重置按钮默认背景改为 `#f5f5f5`。
- 调整：设置菜单面板加强 blur、saturate 和玻璃阴影，提升液态玻璃效果。
- 版本：修复更新到 `0.9.7 build 33`。
- 修复：marker 列表内容右边缘和收起按钮右边缘对齐。
- 实现：列表滚动区域改为右侧外扩阴影缓冲，marker 内容边缘保持在导航 root 右侧。
- 版本：修复更新到 `0.9.6 build 32`。
- 调整：设置按钮 hover/focus 颜色改为和收起按钮一致的淡蓝玻璃态。
- 版本：修复更新到 `0.9.5 build 31`。
- 调整：inactive marker 默认背景从灰色玻璃改为白色半透明玻璃，更贴合 liquid glass 视觉。
- 版本：修复更新到 `0.9.4 build 30`。
- 调整：设置菜单面板和设置输入框加入 liquid glass 材质，视觉上和 marker/button 的液态玻璃保持一致。
- 实现：将 `.gpt-paragraph-nav__settings-menu` 和设置输入框加入 per-element filter pipeline，并使用独立玻璃背景变量。
- 版本：修复更新到 `0.9.3 build 29`。
- 修复：右侧 marker 列表滚动容器不再截断 marker 玻璃阴影。
- 实现：为列表滚动区域增加阴影缓冲 padding，并用负 margin 抵消布局尺寸变化。
- 版本：修复更新到 `0.9.2 build 28`。
- 调整：liquid glass 改为参考 `nikdelvin/liquid-glass` 的 data-URL SVG displacement filter 方案。
- 实现：按每个 marker/button 的尺寸和圆角生成 `feImage` + `feDisplacementMap` filter，并用 `ResizeObserver` 在尺寸变化时重算 CSS 变量。
- 版本：修复更新到 `0.9.1 build 27`。
- 功能：玻璃材质新增本地 JS 注入 SVG filter 的 liquid glass 增强。
- 实现：在导航 root 内幂等注入隐藏 SVG filter，使用 `feTurbulence`、`feDisplacementMap` 和 `feGaussianBlur`，CSS 在支持时叠加 `url("#gpt-paragraph-nav-liquid-glass")`，并保留纯 CSS fallback。
- 版本：功能更新到 `0.9.0 build 26`。
- 调整：统一去掉 marker、底部悬浮 active marker 和收起按钮玻璃态上的灰色描边，保留玻璃阴影和模糊材质。
- 版本：修复更新到 `0.8.1 build 25`。
- 功能：marker、底部悬浮 active marker、设置按钮、收起按钮和重置按钮新增纯 CSS 玻璃材质。
- 实现：使用半透明背景、`backdrop-filter` / `-webkit-backdrop-filter`、玻璃边框和内高光，不引入 JS/SVG filter 或第三方库。
- 版本：功能更新到 `0.8.0 build 24`。
- 调整：设置菜单重置按钮 hover/focus 改为参考 marker hover 的浅蓝背景，避免浅色菜单中不可见。
- 版本：修复更新到 `0.7.8 build 23`。
- 修复：点击 marker 或底部悬浮 active marker 后，右侧列表会短时间持续校正到 active marker，避免网页自身滚动或重排打断定位。
- 版本：修复更新到 `0.7.7 build 22`。
- 调整：移除 inactive marker 的位置透明度渐变，默认灰色背景保持一致；hover 和 active 颜色不变。
- 版本：修复更新到 `0.7.6 build 21`。
- 调整：点击底部悬浮 active marker 时保留平滑滚动效果，同时继续先触发正文定位，避免影响一键到位。
- 版本：修复更新到 `0.7.5 build 20`。
- 修复：点击底部悬浮 active marker 时先即时定位正文锚点，再滚回右侧选中 marker，避免需要多次点击才到位。
- 版本：修复更新到 `0.7.4 build 19`。
- 修复：点击底部悬浮 active marker 时，右侧列表滚回选中 marker，并同步把正文页面锚点定位到对应 heading。
- 版本：修复更新到 `0.7.3 build 18`。
- 修复：点击 marker 后 active 蓝色高亮不再因为焦点变化被清除，选中 marker 离开屏幕时固定到可视列表底部上方 20pt。
- 版本：修复更新到 `0.7.2 build 17`。
- 修复：滚动 marker 列表后，点击过的 marker 不再和当前 active marker 同时显示高亮。
- 实现：active 状态改为由点击的 marker 持久驱动，并使用内部唯一 marker key 匹配，避免重复 DOM id 造成多个 marker 同时高亮；active marker 完全离开屏幕可视区时才在可视 marker 列表底部上方 20pt 显示可点击的悬浮副本。
- 版本：修复更新到 `0.7.1 build 16`。

## 2026-06-04

- 需求：将右侧 marker 列表默认位置改为从页面 header 下方开始向下展示。
- 实现：浮层改为顶部对齐，列表高度预留顶部 controls 区域，并移除新增标题后自动滚到底部的逻辑。
- 版本：功能更新到 `0.7.0 build 15`。
- 需求：开始支持千问页面 assistant 正文的 H1-H3 标题导航，并支持千问视频列表首个视频标题 marker。
- 实现：Manifest 增加 `www.qianwen.com` 和 `qianwen.com` 注入范围，内容脚本新增千问 assistant Markdown 容器识别和视频列表首标题收集逻辑。
- 版本：功能更新到 `0.6.0 build 14`。
- 需求：开始支持 Kimi 页面 assistant 正文的 H1-H2 标题导航。
- 实现：Manifest 增加 `www.kimi.com` 和 `kimi.com` 注入范围，内容脚本新增 Kimi assistant Markdown 容器识别，并限制 Kimi 只渲染正文 H1-H2 marker。
- 版本：功能更新到 `0.5.0 build 13`。
- 需求：开始支持元宝页面的 H1-H2 标题导航，并支持元宝视频大卡标题 marker。
- 实现：Manifest 增加 `yb.tencent.com` 和 `yuanbao.tencent.com` 注入范围，内容脚本新增元宝 AI 容器、H1-H2 层级限制和视频卡标题收集逻辑。
- 版本：功能更新到 `0.4.0 build 12`。
- 修复：设置菜单增加透明 hover 判定区域，鼠标从“设置”按钮移向左侧空白区域或下方菜单时不再立刻关闭。
- 版本：修复更新到 `0.3.2 build 11`。

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
