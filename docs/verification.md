# 当前验证记录

- ESLint、TypeScript：通过。
- 单元测试 12 项：IGDB token/cache、RAWG 错误隔离、无凭据/非法查询、保留个人字段；六个新增来源的映射、部分日期、微信读书请求与版本升级提示、TMDB 电影/剧集 ID、BGG XML 和限流间隔、Open Library 短中文查询、详情失败回退、微信读书专用连接池隔离。
- SQLite 集成测试 2 项：真实管理员登录、匿名写入隔离、上传与缩略图、Projects 显示权限、草稿/已发布版本隔离、未来发布时间、私有作品、关系与反向 join；生产 migrations 从空库执行并可重复运行。
- Playwright：原 Phase 1 开发/生产链路通过；本轮生产模式验证首次管理员 → 搜索 TUNIC → 自动填充 → 评分保存 → 新文章关联 → 草稿不公开 → 发布 → 双向前台展示，并覆盖六个新增来源及 tv / manga / comic、中文 slug、封面、个人字段保留和中英文 UI 切换。390px 宽度检查无横向溢出。
- `npm run build`：公开路由（含 TMDB 署名页 `/credits`）、Payload Admin、原生 REST 均成功构建。
- Projects 导入：五个原始项目成功写入本地库；第二次全部跳过。未创建正式管理员，未向本地库填入测试作品/文章。

自动化测试中的外部搜索响应为显式 fixture；provider HTTP 交互在单元测试中注入 fetch 模拟，浏览器测试使用真实 Payload 表单、临时 SQLite 和公开页面。配置凭据后，八个来源均通过实时搜索和封面请求；支持详情请求的来源也通过详情验证。覆盖 TMDB 电影/剧集、Bangumi 动画/漫画、Google Books 与 Open Library 的书籍/Comic。微信读书适配到官方 1.0.5，并使用仅限该来源的 IPv4 连接池，修复默认 Node 连接超时；真实“三体”查询取得 8 个候选，详情和封面均返回成功。

独立 SQLite 集成测试禁用 Payload HMR，避免连接正在运行的本地 Next.js 开发服务器而阻止测试进程退出。

## 服务器部署配置验证

- 官方 Compose 2.39.4 工具解析配置通过，验证 loopback 端口、数据库 / media bind mounts 和 tools profile 中的一次性迁移服务。检查使用临时占位环境文件，没有展开真实密钥。
- Lint、TypeScript 通过。在 `/tmp` 中准备不含 `.env`、历史内容或本地数据的隔离目录，使用占位构建配置完成生产构建（有编译警告，退出码 0）。测试复用已安装的 node_modules；不等同于镜像里的 `npm ci`。
- 隔离生产迁移从空库成功执行。使用正式域名形式的 SERVER_URL 和 localhost 浏览器连接，验证首次管理员初始化、登录、上传图片、保存作品、停止进程、生成内容备份、重启进程及作品 / 图片继续返回 200。
- 新部署文件未包含本地 `.env` 的已配置密钥；`deploy/.env.production` 和 `deploy/backups/` 已被 Git 忽略。
- 当前 WSL 无可用 Docker Engine / Nginx，未执行实际镜像构建、容器挂载重建或 `nginx -t`，也没有配置服务器、证书或域名。这些步骤需在服务器按 `docs/deployment.md` 执行。

Next.js 开发模式的独立 React debug WebSocket 通道在认证重定向中出现过负数时间戳报错，现设置 `experimental.reactDebugChannel: false`，仅改变开发调试信息传输。生产模式无此调试路径。
