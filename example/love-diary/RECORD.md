# 恋爱日记移动端 WEBAPP - UI/UX 设计稿记录

日期：2026-03-25  
来源：`docs/移动端WEBAPP需求文档.md`（恋爱日记模块）  
视觉参考：`example/ui.html`（暗色 + 霓虹风格与移动端布局骨架）

## 1. 交付内容

本次交付为**纯 HTML + CSS** 的 UI/UX 设计稿（每个页面一个文件），不接入后端数据与业务逻辑。页面之间通过**相对链接**串联，底部导航为全局一致组件样式（本地展示态）。

## 2. 通用样式与交互规范

- 通用样式入口：`example/love-diary/styles.css`
- Mobile First：禁止横向溢出，布局以竖屏 360x720 预览为基准
- 触控热区：按钮/图标/可点击控件最低满足 `min-height: 44px`
- 安全区域：适配 `env(safe-area-inset-*)`（顶部/底部补偿）
- 焦点态：为 `:focus-visible` 增加高对比描边，提升可访问性
- 图片与预览：使用 `:target` 实现弹层预览 UI 状态（不依赖 JS）

## 3. 页面清单（全部为独立 HTML）

### 首页与告白
- 首页：`example/love-diary/home.html`
- 爱的告白：`example/love-diary/confession.html`

### 恋爱日记
- 恋爱日记列表/筛选：`example/love-diary/diaries-list.html`
- 新建日记：`example/love-diary/diaries-new.html`
- 编辑日记：`example/love-diary/diaries-edit.html`
- 日记详情（含图片预览/语音播放 UI 态）：`example/love-diary/diaries-detail.html`

### 爱的相册
- 相册列表/创建弹层：`example/love-diary/albums-list.html`
- 相册详情（上传权限提示/拖拽排序态/封面与分享 UI）：`example/love-diary/albums-detail.html`

### 相爱里程碑
- 里程碑时间线：`example/love-diary/milestones-timeline.html`
- 新建里程碑：`example/love-diary/milestones-new.html`
- 编辑里程碑：`example/love-diary/milestones-edit.html`
- 里程碑详情（倒计时展示/提醒状态 UI）：`example/love-diary/milestones-detail.html`

## 4. 预览方式

1. 使用浏览器打开对应 HTML 文件（例如直接打开 `example/love-diary/home.html`）
2. 通过页面内顶部返回/底部导航跳转到其他页面
3. 图片预览/分享/弹层等：通过页面中链接 `#targetId` 触发 `:target` 预览态（无需后端）

## 5. 备注

- 当前为 UI/UX 展示稿：表单控件、上传/权限引导、拖拽排序、语音录制/播放等均以**界面态**呈现。
- 如进入下一阶段接入 `localStorage/IndexedDB` 并实现真实数据流，可在此记录基础上逐页替换为可运行版本。

