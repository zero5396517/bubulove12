---
name: bubulove12-uni-app-x
description: Develops and maintains the bubulove12 uni-app x app (UTS + uvue, Vue 3, optional Vapor). Use when adding or changing pages, components, UTS modules, uni_modules integration, uniCloud (Alipay space), styling, or platform-specific behavior in this repository; or when the user mentions bubulove12, uni-app x, uvue, or UTS in this project.
---

# bubulove12 — uni-app x 开发

## 优先读取的规范（本仓库）

实现前先阅读对应规则文件（细则以规则为准，本 skill 不重复长篇约束）：

| 主题 | 路径 |
|------|------|
| UTS 语言约束 | `.cursor/rules/uts.mdc` |
| uvue / Vue3 | `.cursor/rules/uvue.mdc` |
| 样式 ucss | `.cursor/rules/ucss.mdc` |
| API 与插件 | `.cursor/rules/Uni-App-X-api.mdc` |
| 条件编译 | `.cursor/rules/Uni-App-X-conditional-compilation.mdc` |
| 工作流与 DoD | `.cursor/rules/core.mdc` |
| 通用实践 | `.cursor/rules/Best-practices-for-uni-app-x.mdc` |

## 项目事实

- **应用名**：`bubulove12`（见 `manifest.json`）。
- **框架**：uni-app x；`manifest.json` 中 `uni-app-x.vapor` 为 `true`，`vueVersion` 为 `3`。
- **页面/组件**：`.uvue` + `<script>` 侧 **UTS**（强类型，与 TS 不同）。
- **状态**：不使用 pinia / vuex / i18n；跨页通信优先 **eventbus**（项目含 `uni_modules/uts-eventbus`）。
- **云**：存在 `uniCloud-alipay/`（支付宝云空间相关云函数与数据库 schema）。

## 编码约定（摘要）

- 新页面优先 **组合式 API**；组件尽量 **easycom**；非 easycom 自定义组件上调用方法用 **`$callMethod`**。
- 对象模型类型用 **`type`** 定义；避免 UTS 禁止的 TS 特性（见 `uts.mdc`）。
- 布局仅 **flex / 绝对定位**；样式仅用 **类选择器**；文本样式只在 **`<text>` / `<button>`** 上设置（见 `ucss.mdc`）。
- 可滚动内容放在 **`scroll-view` / `list-view` / `waterflow`** 等容器；App 上按 `Best-practices-for-uni-app-x.mdc` 处理一级滚动容器。
- 平台或版本专用代码用 **条件编译** 包裹或放到平台目录。

## 新页面 / 新路由

1. 在 `pages/` 下新增 `.uvue`。
2. 在 **`pages.json`** 中注册路径（本项目 `pages.json` 体量很大，注意条件编译块与现有分组风格）。
3. 需要 tab 或窗口时，对齐现有 `tabBar`、`leftWindow`、`topWindow` 等配置方式。

## 原生能力与插件

- 通过 **MCP `user-uni-app-x`** 查询本项目已安装的 easycom / 插件能力（调用前查看该 server 的工具描述与参数）。
- 系统级 API 优先在 **uts 插件** 中封装，页面侧少直接堆原生调用（见 `Uni-App-X-api.mdc`）。

## HBuilderX / CLI

- **禁止臆造** HBuilderX CLI 命令。若需 CLI 格式，按 `core.mdc` 要求从官方文档确认后再使用。

## 更详细的项目结构

见同目录 [reference.md](reference.md)。
