# TraceOnSnow

个人网站：Next.js 16.3.7 + Payload 3.90.2 + SQLite。博客、作品记录、Projects 与 `/admin` 在同一个应用中。

## 本地启动

要求 Node.js 22+（本次验证 Node 24）、npm。

```sh
npm ci
npm run setup
npm run dev
```

打开 http://localhost:3000/admin，首次创建管理员。`setup` 只在 `.env` 不存在时写入随机 secret，不覆盖现有配置。数据保存在 `storage/payload.db`，上传保存在 `storage/media`，均不入 Git。首次初始化需在本机完成，再向公网开放。所有登录账户都是管理员，不开放用户注册。

游戏搜索需要在 `.env` 中配置至少一个来源，然后重启服务：

```dotenv
IGDB_CLIENT_ID=
IGDB_CLIENT_SECRET=
RAWG_API_KEY=
```

IGDB 使用 Twitch Client Credentials；RAWG 使用 API key。禁止给这些变量加 `NEXT_PUBLIC_`。没有凭据时后台明确显示来源未配置，仍可手动记录作品。程序不会读取其他仓库的私密配置。

## 日常操作

1. `/admin → Works → Create New`，type 选择 game，搜索 `TUNIC`。
2. 选择带来源标签的结果，检查标题/封面/日期/来源，填写 rating、status、感想，Save。
3. 打开 `/works/tunic`。如果修改了 slug，使用对应 URL。
4. `/admin → Posts → Create New`，填写标题与正文，在 Related Works 中选 TUNIC，Save Draft 或 Publish。
5. 发布后出现在 `/posts`，作品页显示相关文章。保存新草稿不会替换访客看到的已发布版本。

评分为 0–10，可留空。Work 默认为公开，设 private 后访客不可见。Media 是公开素材，不能存私密附件。文章 publishedAt 为空时首次发布自动补时间；未来日期在到达前不会公开。账号找回邮件尚未接入邮件服务，本阶段保管好管理员凭据。

公开路由：`/`、`/posts`、`/posts/[slug]`、`/works`、`/works/[slug]`、`/projects`。分类使用 `/works?type=game` 等。后台为 `/admin`，原生 REST 为 `/api/*`。

## Projects 导入与历史内容

```sh
npm run import:projects -- ../trace-blog/src/data/projects.ts
npm run import:projects -- ../trace-blog/src/data/projects.ts --apply
```

先预览再导入，重复执行跳过已有 slug。脚本使用受信任的本地 TS 模块。详见 [迁移策略](docs/migration.md) 和 [架构边界](docs/architecture.md)。尚未批量导入历史文章或媒体库；`legacy/` 与原 `data/` 保留，不参加新应用构建。

## 验证

```sh
npm run lint
npm run typecheck
npm test
npm run test:integration
npx playwright install chromium
npm run test:e2e
npm run build
# 可选：在生产 build 与生产 migrations 上跑同一浏览器流程
E2E_PRODUCTION=1 npm run test:e2e
```

集成测试使用独立临时 SQLite。浏览器测试使用 127.0.0.1:3100 与临时数据库，测试后删除；仅 provider 返回结果被模拟，登录、表单保存、发布、关联和前台查询都是真实应用。浏览器测试和 build 不应同时运行，因为共用 `.next`。

依赖审计已修复所有 high 项；目前剩余 5 个 moderate 条目来自 Drizzle Kit → 旧 esbuild 的同一上游依赖链，npm 暂无兼容修复。应用没有启动 esbuild 的开发服务器。`overrides` 仅将 Payload 固定的 undici 替换为同主版本安全补丁。

## Schema 与生产运行

```sh
npm run generate:types
npm run generate:importmap
npm run db:migration -- describe_change
# 在生产配置及已备份的目标数据库上：
NODE_ENV=production npm run db:migrate
npm run build
npm start
```

开发环境由 Payload 自动同步 schema，生产必须执行已提交的 migrations。不要对已有开发 push 数据库直接叠加初始迁移；部署使用新库或经过核实的 schema baseline。生产 `DATABASE_URL` 与 `MEDIA_DIR` 指向持久化位置，设置随机 `PAYLOAD_SECRET` 与真实 `SERVER_URL=https://traceonsnow.com`。备份 SQLite 时用 backup API（包括 WAL 一致性），同时备份 Media 文件。

本地 SQLite + 文件上传需要持久化服务器/磁盘；现有 Vercel 临时文件系统不能直接承载它。若仍部署 Vercel，后续改远程数据库与对象存储。本阶段没有部署或修改域名。

## 来源

视觉基于现有 trace-blog/Mizuki 的配色与布局，游戏 metadata 映射基于 HayakuShelf。保留根 LICENSE 及原代码，未引入 Astro 运行时。Payload 集成遵循其官方 [安装结构](https://payloadcms.com/docs/getting-started/installation)。
