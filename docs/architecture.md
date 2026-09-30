# Phase 1 架构与边界

`src/app/(frontend)` 是公开 Next.js 页面，`src/app/(payload)` 是 Payload 原生 Admin / REST。`src/payload.config.ts` 统一配置 SQLite、Lexical、认证与 Collections。Payload Local API 是唯一 CRUD 入口；公开查询统一传 `overrideAccess: false`、匿名用户和 `draft: false`。

- Users：登录用户均为站点管理员，没有 SaaS 角色层级。首次通过 Payload 创建管理员，之后匿名用户不能创建账户。
- Posts：Lexical content、原生版本/草稿、publishedAt、多个 relatedWorks。首次发布自动补日期，未来日期不会提前公开。
- Works：一个 Collection 管理八种 type；个人 0–10 评分、状态、tags、note 和重复 experiences。默认公开，可设 private。上传封面优先于外部 coverUrl。
- Works.relatedPosts：Payload join，指向 Posts.relatedWorks。前台反向列表通过同一个 relationship 条件分页查询，遵守 Posts 发布权限。
- Projects：沿用 trace-blog 的真实字段，增加顺序和显示开关。
- Media：公开图片素材，上传、修改、删除仅管理员；10 MB，允许 JPEG/PNG/WebP/GIF/AVIF。不用于私密附件。

游戏搜索：Admin 自定义 UI → 带登录 Cookie 的 `/api/metadata/games` → IGDB/RAWG → 统一候选 → 填入未保存表单 → Payload Save。凭据只在服务端。每个请求有 8 秒超时、来源隔离、5 分钟有界缓存、相同搜索去重及 429 冷却；Twitch token 缓存至过期前。结果不凭标题跨来源自动合并，显示原始 provider 和 ID。RAWG 搜索不提供 developer 时留空。

保留 Mizuki hue 240、浅色背景/卡片、1rem 圆角、文章卡片和移动布局思路，使用本地头像；React/CSS 重写，不运行 Astro 组件。系统深浅色为基础适配，没有主题控制台与动画框架。

`legacy/` 保存旧 Contentlayer 页面、组件、样式、构建配置，已排除在编译之外。原 `data/` 与 `public/static/` 保留以便内容迁移。旧依赖、newsletter、Contentlayer 搜索与 RSS 构建链不再运行。后续内容迁移结束后可独立删除 legacy 和无用素材，当前不破坏用户原文。

本阶段不含全量内容迁移、正文 Work Card、其他 provider、分类型独立路由、Dashboard/Profile/Page Builder。分类目前是 `/works?type=game` 等。
