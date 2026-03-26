# 布布与一二 (JKVideo) - React Native 项目总结文档

> **项目类型**: Bilibili 第三方客户端（视频 + 直播）  
> **版本**: 1.0.16  
> **开发框架**: Expo SDK 55 + React Native 0.83.2

---

## 一、项目概述

本项目是一个功能完整的 Bilibili 第三方客户端，支持视频播放、直播观看、弹幕互动、视频下载等核心功能。采用现代 React Native 技术栈，实现 iOS、Android、Web 三端统一代码库。

### 核心功能
- 视频播放（支持 DASH/HLS/MP4 多格式，240P-4K 清晰度切换）
- 直播观看（HLS/FLV 双协议，8个直播分区）
- 弹幕系统（实时弹幕、历史弹幕、多种显示模式）
- 视频下载（断点续传、后台下载、本地播放）
- 用户登录（二维码扫码登录、Cookie 管理）
- 局域网分享（本地 HTTP 服务器共享视频）

---

## 二、技术栈

| 层级 | 技术选型 | 说明 |
|------|----------|------|
| **框架** | Expo SDK 55 + React Native 0.83.2 | 跨平台开发框架 |
| **路由** | Expo Router ~55.0.4 | 文件系统路由 |
| **状态管理** | Zustand ^5.0.11 | 轻量级状态管理 |
| **网络请求** | Axios ^1.13.6 | HTTP 客户端 |
| **视频播放** | react-native-video ^6.19.0 | 原生视频播放器 |
| **错误监控** | @sentry/react-native ~7.11.0 | 线上错误追踪 |
| **弹幕解压** | pako ^2.1.0 | gzip 解压 |
| **存储** | AsyncStorage + Expo SecureStore | 数据持久化 |
| **UI 图标** | @expo/vector-icons (Ionicons) | 图标库 |

---

## 三、目录结构

```
rn-app/
├── app/                          # Expo Router 页面路由
│   ├── _layout.tsx              # 根布局（全局 Stack 导航）
│   ├── index.tsx                # 首页（热门/直播 Tab）
│   ├── video/
│   │   ├── _layout.tsx          # 视频页布局
│   │   └── [bvid].tsx           # 视频详情页（动态路由）
│   ├── live/
│   │   ├── _layout.tsx          # 直播页布局
│   │   └── [roomId].tsx         # 直播间（动态路由）
│   ├── creator/
│   │   ├── _layout.tsx          # UP 主页布局
│   │   └── [mid].tsx            # 创作者主页（动态路由）
│   ├── search.tsx               # 搜索页面
│   ├── settings.tsx             # 设置页面
│   └── downloads.tsx            # 下载管理页面
│
├── components/                   # UI 组件库（17 个组件）
│   ├── VideoPlayer.tsx          # 视频播放器容器
│   ├── NativeVideoPlayer.tsx    # 原生视频播放器
│   ├── LivePlayer.tsx           # 直播播放器
│   ├── VideoCard.tsx            # 视频卡片
│   ├── BigVideoCard.tsx         # 大视频卡片（自动播放）
│   ├── LiveCard.tsx             # 直播间卡片
│   ├── CommentItem.tsx          # 评论项
│   ├── DanmakuList.tsx          # 弹幕列表
│   ├── DanmakuOverlay.tsx       # 弹幕层叠组件
│   ├── MiniPlayer.tsx           # 视频小窗播放器
│   ├── LiveMiniPlayer.tsx       # 直播小窗播放器
│   ├── LoginModal.tsx           # 登录弹窗（二维码）
│   ├── DownloadSheet.tsx        # 下载选项面板
│   ├── DownloadProgressBtn.tsx  # 下载进度按钮
│   ├── FollowedLiveStrip.tsx    # 关注直播条
│   ├── LanShareModal.tsx        # 局域网分享
│   └── LivePulse.tsx            # 直播脉冲动画
│
├── hooks/                        # 自定义 Hooks（10 个）
│   ├── useVideoList.ts          # 视频列表数据
│   ├── useVideoDetail.ts        # 视频详情数据
│   ├── useLiveList.ts           # 直播列表数据
│   ├── useLiveDetail.ts         # 直播详情数据
│   ├── useComments.ts           # 评论数据
│   ├── useRelatedVideos.ts      # 相关视频
│   ├── useSearch.ts             # 搜索功能
│   ├── useDownload.ts           # 下载功能
│   ├── useCheckUpdate.ts        # 检查更新
│   └── useLiveDanmaku.ts        # 直播弹幕
│
├── store/                        # Zustand 状态管理（5 个 store）
│   ├── authStore.ts             # 用户认证状态
│   ├── videoStore.ts            # 视频播放状态
│   ├── liveStore.ts             # 直播状态
│   ├── settingsStore.ts         # 应用设置（暗黑模式/省流）
│   └── downloadStore.ts         # 下载任务状态
│
├── services/                     # API 服务层
│   ├── bilibili.ts              # B站 API 封装（500+ 行）
│   └── types.ts                 # TypeScript 类型定义
│
├── utils/                        # 工具函数
│   ├── theme.ts                 # 主题/暗黑模式
│   ├── format.ts                # 格式化工具
│   ├── imageUrl.ts              # 图片代理
│   ├── danmaku.ts               # 弹幕解析
│   ├── dash.ts                  # DASH 流媒体
│   ├── buildMpd.ts              # MPD 构建
│   ├── wbi.ts                   # WBI 签名算法
│   ├── cache.ts                 # 缓存管理
│   ├── secureStorage.ts         # 安全存储封装
│   ├── lanServer.ts             # 局域网服务
│   └── videoRows.ts             # 视频列表布局
│
├── shims/                        # Web 端兼容层（9 个 shim）
│   ├── react-native-pager-view.web.tsx
│   ├── react-native-video.web.tsx
│   ├── react-native-static-server.web.ts
│   ├── expo-file-system.web.ts
│   ├── expo-network.web.ts
│   ├── expo-clipboard.web.ts
│   ├── expo-intent-launcher.web.ts
│   └── sentry-react-native.web.tsx
│
├── assets/                       # 静态资源
│   ├── icon.png                 # App 图标
│   ├── splash-icon.png          # 启动图
│   ├── favicon.png              # Web favicon
│   └── android-icon-*.png       # Android 自适应图标
│
├── scripts/                      # 脚本工具
│   └── bump-version.js          # 版本号自动递增
│
├── .github/                      # GitHub 配置
│   ├── workflows/               # CI/CD（release.yml）
│   ├── ISSUE_TEMPLATE/          # Issue 模板
│   └── PULL_REQUEST_TEMPLATE.md
│
├── app.json                      # Expo 配置
├── package.json                  # 依赖管理
├── tsconfig.json                 # TypeScript 配置
├── metro.config.js               # Metro 打包配置（Web shim）
├── eas.json                      # EAS 构建配置
├── dev-proxy.js                  # 开发代理服务器
└── build-apk.ps1                 # APK 构建脚本
```

---

## 四、架构设计

### 4.1 路由架构（Expo Router）

采用文件系统路由，页面结构即路由结构：

| 文件路径 | 路由路径 | 说明 |
|----------|----------|------|
| `app/index.tsx` | `/` | 首页（热门/直播 Tab） |
| `app/video/[bvid].tsx` | `/video/BVxxxx` | 视频详情页 |
| `app/live/[roomId].tsx` | `/live/12345` | 直播间 |
| `app/creator/[mid].tsx` | `/creator/12345` | UP 主主页 |
| `app/search.tsx` | `/search` | 搜索页 |
| `app/settings.tsx` | `/settings` | 设置页 |

### 4.2 分层架构

```
┌─────────────────────────────────────┐
│           页面层（Pages）            │  app/*.tsx
├─────────────────────────────────────┤
│           组件层（Components）       │  components/*.tsx
├─────────────────────────────────────┤
│           Hooks 层                   │  hooks/*.ts
├─────────────────────────────────────┤
│           状态层（Store）            │  store/*.ts
├─────────────────────────────────────┤
│           服务层（Services）         │  services/bilibili.ts
└─────────────────────────────────────┘
```

### 4.3 状态管理（Zustand）

| Store | 职责 | 持久化 |
|-------|------|--------|
| `authStore` | 用户认证、Cookie 管理 | SecureStore |
| `videoStore` | 视频播放状态、播放历史 | AsyncStorage |
| `liveStore` | 直播状态、关注列表 | AsyncStorage |
| `settingsStore` | 应用设置（暗黑模式/省流模式） | AsyncStorage |
| `downloadStore` | 下载任务、进度管理 | AsyncStorage |

### 4.4 跨平台兼容（Web Shim）

通过 `metro.config.js` 实现 Web 端模块降级：

```javascript
const WEB_SHIMS = {
  'react-native-video': 'shims/react-native-video.web.tsx',
  'expo-file-system': 'shims/expo-file-system.web.ts',
  'expo-secure-store': 'shims/expo-secure-store.web.ts',
  // ...
};
```

Web 端使用原生 `<video>` 标签替换原生播放器，确保三端统一代码库。

---

## 五、核心功能模块

### 5.1 视频播放模块

**文件**: `components/VideoPlayer.tsx`, `components/NativeVideoPlayer.tsx`

| 功能 | 说明 |
|------|------|
| 播放格式 | DASH / HLS / MP4 |
| 清晰度 | 240P / 360P / 480P / 720P / 1080P / 4K / 杜比视界 |
| 全屏播放 | 支持屏幕旋转锁定/解锁 |
| 弹幕显示 | 弹幕叠加渲染 |
| 手势控制 | 双击暂停、滑动快进 |

### 5.2 直播模块

**文件**: `components/LivePlayer.tsx`, `app/live/[roomId].tsx`

| 功能 | 说明 |
|------|------|
| 直播协议 | HLS / FLV 双协议支持 |
| 分区筛选 | 网游 / 手游 / 单机 / 娱乐 / 电台 / 虚拟主播 / 生活 / 知识（8 个分区） |
| 关注主播 | 关注列表快速进入 |
| 弹幕互动 | 实时弹幕 + 历史弹幕 |

### 5.3 弹幕系统

**文件**: `components/DanmakuOverlay.tsx`, `utils/danmaku.ts`

| 功能 | 说明 |
|------|------|
| 弹幕格式 | XML 格式（pako gzip 解压） |
| 显示模式 | 滚动 / 顶部固定 / 底部固定 |
| 样式 | 颜色、大小自定义 |
| 性能 | 虚拟列表渲染优化 |

### 5.4 下载管理

**文件**: `store/downloadStore.ts`, `hooks/useDownload.ts`

| 功能 | 说明 |
|------|------|
| 多清晰度 | 支持多种清晰度下载 |
| 断点续传 | 网络中断恢复下载 |
| 后台下载 | 应用后台继续下载 |
| 本地播放 | 已下载视频本地播放 |

### 5.5 用户认证

**文件**: `store/authStore.ts`, `components/LoginModal.tsx`

| 功能 | 说明 |
|------|------|
| 登录方式 | 二维码扫码登录 |
| 会话管理 | SESSDATA Cookie 管理 |
| 安全存储 | SecureStore（Keychain/Keystore） |

### 5.6 局域网分享

**文件**: `utils/lanServer.ts`, `components/LanShareModal.tsx`

| 功能 | 说明 |
|------|------|
| 本地服务 | HTTP 服务器 |
| 视频共享 | 局域网内设备访问 |

---

## 六、API 服务层

**文件**: `services/bilibili.ts`（500+ 行）

封装了 Bilibili 主要 API：

| API | 功能 |
|-----|------|
| `getPopularVideos` | 热门视频列表 |
| `getVideoDetail` | 视频详情 |
| `getVideoStream` | 视频流地址 |
| `getLiveList` | 直播列表 |
| `getLiveStream` | 直播流地址 |
| `getComments` | 评论列表 |
| `getRelatedVideos` | 相关视频 |
| `searchVideos` | 视频搜索 |
| `getUserInfo` | 用户信息 |
| `getFollowedLives` | 关注直播列表 |

### 优化特性

- **请求去重**: 相同请求合并，避免重复调用
- **WBI 签名**: 缓存签名，12 小时 TTL
- **Cookie 自动注入**: 登录状态自动携带

---

## 七、性能优化

| 优化点 | 实现方式 |
|--------|----------|
| 列表虚拟化 | FlatList（windowSize / maxToRenderPerBatch） |
| 分页加载 | 视频列表分页 |
| 图片懒加载 | expo-image 组件 |
| 移除裁剪视图 | `removeClippedSubviews={true}` |
| 视频播放优化 | 自动暂停不可见视频 |
| 状态订阅优化 | Zustand 选择器精准订阅 |

---

## 八、安全设计

| 安全措施 | 实现 |
|----------|------|
| 敏感数据存储 | SecureStore（Keychain/Keystore） |
| 错误监控 | Sentry React Native（生产环境） |
| 隐私保护 | 用户数据本地存储，不上传服务器 |
| Cookie 安全 | HttpOnly 等属性处理 |

---

## 九、CI/CD 配置

**文件**: `.github/workflows/release.yml`

自动化构建流程：

1. 代码提交触发 Action
2. EAS Build 云构建（iOS/Android）
3. 自动发布 GitHub Release
4. APK 自动上传附件

---

## 十、项目亮点

1. **三端统一** - iOS/Android/Web 共享一套代码库
2. **功能完整** - 视频、直播、弹幕、下载一体化
3. **跨平台兼容** - Web shim 层设计巧妙，降低平台差异
4. **现代技术栈** - Expo + Zustand + TypeScript
5. **工程化完善** - CI/CD、错误监控、版本自动化
6. **性能优化** - 虚拟列表、懒加载、订阅优化
7. **安全可靠** - 安全存储、错误监控、隐私保护

---

## 十一、开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npx expo start

# 构建 APK（本地）
npm run build:apk

# 版本号自增
npm run bump

# 开发代理（Web 跨域）
node dev-proxy.js
```

---

## 十二、总结

这是一个**架构清晰、功能完善、工程化程度高**的 React Native 视频类应用。采用现代技术栈，实现了三端统一开发，具有良好的可维护性和扩展性。项目代码结构清晰，组件化程度高，适合作为 React Native 视频类应用的参考架构。

### 核心数据

| 指标 | 数值 |
|------|------|
| 页面数量 | 6 个主要页面 |
| 组件数量 | 17 个 UI 组件 |
| 自定义 Hooks | 10 个 |
| 状态 Store | 5 个 |
| Web Shim | 9 个兼容层 |
| API 封装 | 500+ 行 |
| 总代码量 | ~8000+ 行 |

---

*文档生成时间: 2026-03-26*  
*项目版本: 1.0.16*
