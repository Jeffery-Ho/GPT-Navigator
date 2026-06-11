# Design Guideline

## BoomBranch-like Glass Theme

- 全局扩展控件使用亮色/暗色自适应 glass 视觉。
- 暗色模式使用接近 BoomBranch 的深色半透明背景、`white/10` 级别细描边、柔和暗色阴影和轻内高光。
- 亮色模式沿用此前 Polaris 浅白玻璃背景，保留低对比描边和柔和阴影。
- marker、悬浮 active marker、设置按钮、收起按钮、设置菜单、输入框、选项和重置按钮必须优先继承共享 glass 变量。
- active marker 使用 cyan/blue 强调色；inactive 和 hover 状态保持安静的玻璃质感。

## Verification

- 检查暗色模式下 marker、设置菜单和按钮为深色玻璃，不再混用浅白玻璃和深色按钮。
- 检查亮色模式下控件仍保持清晰文字、轻描边和白色玻璃背景。
- 检查 tooltip 在暗色和亮色模式下均有足够对比。
- 检查 tooltip 文本在当前提示宽度内换行展示，长英文或连续字符不再显示省略号。
- 检查过滤后没有可见 marker 时，右侧仍保留“收起全部”和“设置”入口。
