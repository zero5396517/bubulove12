# bubulove12 仓库结构参考

## 常用入口与配置

- `App.uvue` — 应用根组件
- `pages.json` — 页面与窗口、tab 等路由配置
- `manifest.json` — 应用 id、版本、各端与 `uni-app-x` 开关
- `store/index.uts` — 若需全局状态，与项目现有模式对齐（非 pinia）

## 目录速览

- `pages/` — 业务与子包页面（大量内置组件示例页并存）
- `windows/` — `left-window` / `top-window` 等
- `uni_modules/` — 官方与第三方 UTS 插件、easycom 组件（如 `uts-eventbus`、`native-button`、`CalendarPicker` 等）
- `uniCloud-alipay/` — 云函数与 `database` 下 schema
- `harmony-configs/` — 鸿蒙相关资源配置
- `workers/` — worker 脚本目录（见 `manifest.json` 的 `workers`）

## 与本 skill 的配合

- 修改业务逻辑前，先确认是否已有同名页面或 `uni_modules` 可复用。
- 新增云函数或改 schema 时，同时检查 `uniCloud-alipay/cloudfunctions` 与 `database` 命名是否与现有服务一致。
