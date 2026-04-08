# 恋爱日记移动端 WEBAPP - UI/UX 设计稿记录

日期：2026-03-25  
最后更新设计说明：2026-04-08  

来源：`docs/移动端WEBAPP需求文档.md`（恋爱日记模块）  
视觉参考：`example/ui.html`（暗色 + 霓虹风格与移动端布局骨架）

---

## 1. 交付内容

本次交付为**纯 HTML + CSS** 的 UI/UX 设计稿（每个页面一个文件），不接入后端数据与业务逻辑。页面之间通过**相对链接**串联，底部导航为全局一致组件样式（本地展示态）。

---

## 2. 设计体系概览

### 2.1 视觉方向

- **基调**：深色背景 + 霓虹粉青绿点缀，偏「夜间手记 / 电子相册」气质，避免泛用的紫色大渐变套路。
- **层次**：主色 `--primary`（粉）为行动与强调；`--neon-blue` / `--neon-green` / `--neon-yellow` 作功能分区与状态色。
- **质感**：页面级 **SVG 噪点叠加**（`body::before`）、机框 **内描边高光**、卡片 **内阴影 + 细边框**，增强实体设备预览感。

### 2.2 字体与排版

- **展示/标题**：Fraunces（Google Fonts），用于导航标题、Hero 大标题、里程碑标题、杂志体标题等。
- **界面正文**：Manrope，用于按钮、表单、列表说明等。
- **图标**：Material Icons（外链）。
- **中文**：以上西文字体与系统中文回退搭配；标题通过字重与字距（负 `letter-spacing`）强化杂志感。

### 2.3 布局与设备框

- **预览尺寸**：竖屏 **360×720** 的 `.screen` 容器，带圆角与重阴影，模拟手机外壳。
- **Mobile First**：禁止横向溢出；内容区可滚动，底栏固定于 `.screen` 底部。
- **触控**：可点击控件 `min-height: 44px` 级别热区。

### 2.4 动效与无障碍

- **入场**：带 `.screen-intro` 的页面中，顶栏与内容子项 **错开上浮**（`rise-in` + `animation-delay`）。
- **组件**：底栏当前项 **高亮块**、卡片/入口在支持 `hover` 的设备上 **轻悬停**、时间线 **渐变竖线呼吸**、语音条 **错频缩放**、Hero **慢速光晕** 等。
- **系统设置**：`prefers-reduced-motion: reduce` 时 **缩短/关闭** 动画与杂志纵向 `scroll-snap`。
- **焦点**：`:focus-visible` 粉系描边，沉浸式顶栏下为浅色描边适配。
- **系统**：`color-scheme: dark`；`::selection` 粉色半透明高亮。

### 2.5 全局组件要点

- **顶栏**：默认半透明渐变 + 毛玻璃；标题 Fraunces。
- **底栏**：磨砂玻璃、顶部分割线、当前 Tab **圆角背景块**。
- **卡片 / 列表 / 标签 / 搜索 / Chips**：统一圆角、边框与霓虹激活态。
- **弹层**：`:target` 驱动 `.modal`，无需 JS；背景压暗 + 可选 `backdrop-filter`。

### 2.6 署名（设计稿约定）

- 各页 `.screen` 内右下角有 **Deerflow** 轻量文字链（`https://deerflow.tech`），不抢主界面视觉。

---

## 3. 杂志内页模式（告白 / 相册详情）

以下两页采用 **「一屏一主视觉」** 的编辑/杂志排版，类名与样式集中在 `styles.css` 的 Magazine 段落。

### 3.1 通用机制

- **容器**：`.magazine-content` 挂在 `.content` 上；子块为 `.mag-spread`，`min-height: 100%` 占满**当前可视内容区**高度，并启用纵向 **`scroll-snap-type: y proximity`**（减少动效时关闭）。
- **出血**：`.mag-bleed` 抵消左右内边距，使主图通栏。

### 3.2 `confession.html`（爱的告白）

- **第一屏**：通栏摄影主图 + 渐变罩 + 小字刊头（`LETTERS`）+ **大号衬线标题** + 一句 lead。
- **第二屏**：左侧 **品红色竖线** 编辑区（`.mag-editorial-block`）；标题/正文为 **底划线式** 轻量输入（`.mag-input` / `.mag-textarea`）；标签与可见性仍为 Chips；底部主 CTA。
- **第三屏**：「过往投递」**大标题 + 序号 01–03** 的信函式列表（`.mag-letter`）；预览弹层顶部带条图强化「内页」感。
- **沉浸式顶栏**：根节点含 **`mag-immersive`**（见下节）。

### 3.3 `albums-detail.html`（相册详情）

- **第一屏**：整版 **封面主视觉**（`.mag-album-hero`），刊头 `ALBUM · NO. xx`、**两行大标题**、元信息与 **叠在图上的双按钮**（封面 secondary / 分享 primary 高亮）；说明文案在图下。
- **第二屏**：单块 **上传面板**（大图标 + 说明 + 相册/拍摄双入口 + 权限说明区）。
- **第三屏**：**拼贴栅格**：左侧竖长主图 + 右侧两格，拖拽手柄为装饰态；底部删除与 UI 说明。
- **沉浸式顶栏**：同样使用 **`mag-immersive`**。

### 3.4 沉浸式顶栏（`mag-immersive`）

- 在 **`confession.html`** 与 **`albums-detail.html`** 的 `.screen` 上增加 class **`mag-immersive`**。
- **顶栏**改为 **`position: absolute`** 叠在第一屏封面上：上深下浅渐变 + 毛玻璃；标题与图标 **反白** + 阴影；图标按钮 **深色半透明底**。
- **内容区**高度改为 **`calc(100% - 80px)`**（仅扣除底栏），**`padding-top: 0`**，首屏图上缘与机身顶对齐。
- **告白**：主图 **仅下圆角**；刊头垂直位置 **`calc(env(safe-area-inset-top) + 54px)`** 避开状态栏与顶栏；scrim 加强 **顶部暗角**。
- **相册**：首屏 `.mag-album-hero` **左右负边距满宽**，**顶无圆角、仅底部大圆角**。

---

## 4. 通用样式与交互规范（工程约束）

- 通用样式入口：`example/love-diary/styles.css`
- Mobile First：禁止横向溢出，布局以竖屏 360×720 预览为基准
- 触控热区：按钮/图标/可点击控件最低满足 `min-height: 44px`
- 安全区域：适配 `env(safe-area-inset-*)`（顶部/底部补偿）
- 焦点态：为 `:focus-visible` 增加高对比描边，提升可访问性
- 图片与预览：使用 `:target` 实现弹层预览 UI 状态（不依赖 JS）

---

## 5. 页面清单（全部为独立 HTML）

### 首页与告白

- 首页：`example/love-diary/home.html`
- 爱的告白：`example/love-diary/confession.html`（杂志内页 + `mag-immersive`）

### 恋爱日记

- 恋爱日记列表/筛选：`example/love-diary/diaries-list.html`
- 新建日记：`example/love-diary/diaries-new.html`
- 编辑日记：`example/love-diary/diaries-edit.html`
- 日记详情（含图片预览/语音播放 UI 态）：`example/love-diary/diaries-detail.html`

### 爱的相册

- 相册列表/创建弹层：`example/love-diary/albums-list.html`
- 相册详情（上传权限提示/拖拽排序态/封面与分享 UI）：`example/love-diary/albums-detail.html`（杂志内页 + `mag-immersive`）

### 相爱里程碑

- 里程碑时间线：`example/love-diary/milestones-timeline.html`
- 新建里程碑：`example/love-diary/milestones-new.html`
- 编辑里程碑：`example/love-diary/milestones-edit.html`
- 里程碑详情（倒计时展示/提醒状态 UI）：`example/love-diary/milestones-detail.html`

---

## 6. 预览方式

1. 使用浏览器打开对应 HTML 文件（例如直接打开 `example/love-diary/home.html`）
2. 通过页面内顶部返回/底部导航跳转到其他页面
3. 图片预览/分享/弹层等：通过页面中链接 `#targetId` 触发 `:target` 预览态（无需后端）

---

## 7. 备注

- 当前为 UI/UX 展示稿：表单控件、上传/权限引导、拖拽排序、语音录制/播放等均以**界面态**呈现。
- 如进入下一阶段接入 `localStorage/IndexedDB` 并实现真实数据流，可在此记录基础上逐页替换为可运行版本。
- 若后续需「离开首屏后顶栏变为实底导航条」等滚动联动，可在 `mag-immersive` 上扩展 JS 或 `scroll-driven` 动画，当前仍为纯 CSS 稿。
