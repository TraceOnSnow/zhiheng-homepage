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

### VS Code 一键启动

完成上面的依赖安装和 `setup` 后，用 VS Code 的 WSL 窗口打开本项目。在“运行和调试”（`Ctrl+Shift+D`）选择 `TraceOnSnow：开发（首页）` 或 `TraceOnSnow：开发（Admin）`，按 `F5`。服务就绪后自动打开对应页面；无需浏览器调试扩展。

终端输出同时写入 `storage/dev.log`，每次启动覆盖上次记录，文件不入 Git。测试后可以直接让 Codex 读取该文件；浏览器日志可补充查看 `.next/dev/logs/next-development.log`。这两个文件都不保证保留浏览器控制台的全部历史。修改 `.env` 后停止并重新启动；停止按钮或启动终端中的 `Ctrl+C` 可结束服务。启动前先停止已有的 `npm run dev`，两个启动项是同一服务的不同入口，不能同时运行。

“终端 → 运行任务”中另有 `TraceOnSnow：检查（lint + types + tests）`，顺序执行 lint、类型检查和单元测试；生产构建可按 `Ctrl+Shift+B`。这些检查不阻塞日常开发启动。集成测试和端到端测试仍使用下方列出的专用命令。

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

## 界面语言

前台导航栏的 `English / 中文` 按钮切换 UI 语言，默认中文，使用一年有效期的 cookie 记住选择；刷新、跳转和重新打开网站都会保留语言。切换不改变 URL、分类或分页参数。导航、按钮、状态、分类、空状态与日期格式支持中英，文章、作品资料、笔记与项目描述始终展示原文，不增加翻译字段。

Payload 后台在右上角账户页面（`/admin/account`）的 Language / 语言中选择 English 或 中文。后台语言由 Payload 单独管理，集合、字段、选项及自定义游戏搜索也随之切换。前台 UI 字典位于 `src/lib/ui/dictionary.ts`，无需额外前台 i18n 库或多语言内容迁移。

## 作品资料来源

在 `/admin → Works → Create New` 中选择类型，输入标题（书籍也支持 ISBN），搜索并选择结果。选择后自动补充封面、创作者、简介、日期和来源信息；评分、状态、笔记、tags 及上传封面保持不变。封面仍使用外部 URL，上传封面优先。

| 类型 | 来源 | 服务端配置 |
| --- | --- | --- |
| game | IGDB / RAWG | 原有 IGDB / RAWG 凭据 |
| book | Google Books / Open Library / 微信读书 | Google key 可选；微信读书需要 `WEREAD_API_KEY` |
| movie / tv | TMDB | `TMDB_API_READ_ACCESS_TOKEN` 或 `TMDB_API_KEY` |
| anime / manga | Bangumi | 公共搜索无需 token；`BANGUMI_ACCESS_TOKEN` 可选 |
| comic | Google Books / Open Library | 同书籍；这两个来源不会保证结果都是美漫，请自行确认 |
| boardgame | BoardGameGeek | `BGG_API_TOKEN` |

配置项见 `.env.example`，填入 `.env` 后重启服务。所有凭据仅用于服务端；没有配置的来源显示未配置，其他来源独立工作。前台评分始终是自己的评分，不导入来源的社区分数。

- 微信读书使用 [Tencent 官方 API 契约](https://github.com/Tencent/WeChatReading)，当前适配版本 1.0.5；到 <https://weread.qq.com/r/weread-skills> 获取 API key，不使用登录 cookie。该来源使用独立 IPv4 连接池，避免部分网络下 Node 自动选择地址族导致的超时，不修改全局 DNS 或其他来源。只调用 `/store/search` 和 `/book/info`，不导入书架、阅读历史或笔记。收到 `upgrade_info` 后暂停该来源至适配器升级并重启。
- BGG 使用标准 XML 解析，搜索只获取候选，选择时获取封面、简介和设计师；单进程请求间隔至少 5 秒，首次选中结果可能需要等待。202 / 429 返回明确的稍后重试状态。
- TMDB 搜索区分电影/电视剧，同数字 ID 不会混淆；选择时读取导演或剧集创作者。名称优先取中文，保留原名别名。
- 不通过相同标题自动合并不同来源或版本。来源 ID 与获取时间保存在 `sources` 中。
- 发行日期只在来源提供完整有效日期时填入。只给年份或月份的资料不虚构月日，因此 Open Library 和 BGG 的日期通常留空。
- 查询有五分钟、有大小上限的进程内缓存，并合并相同并发请求；来源错误不会抹掉其他结果。详情失败时保留已搜到的基础资料并显示提示。

代码入口：`src/lib/metadata/types.ts` 定义统一接口，`providers/` 下每个来源独立实现，`search.ts` 负责路由、缓存及错误隔离，`apply.ts` 负责 Payload 字段映射。认证接口为 `/api/metadata/search?type=book&q=三体` 和 `/api/metadata/details`；旧 `/api/metadata/games` 保留兼容。详情只接受服务端搜到的候选 ID，不接收任意远端 URL。
