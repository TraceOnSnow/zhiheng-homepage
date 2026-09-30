# Phase 1 验证记录

- ESLint、TypeScript：通过。
- 单元测试 4 项：IGDB 映射与 token/cache、RAWG 部分成功与 429 隔离、无凭据/非法查询、保留个人字段。
- SQLite 集成测试 2 项：真实管理员登录、匿名写入隔离、上传与缩略图、Projects 显示权限、草稿/已发布版本隔离、未来发布时间、私有作品、关系与反向 join；生产 migrations 从空库执行并可重复运行。
- Playwright：开发服务器和生产 build 均通过完整链路：首次管理员 → 搜索 TUNIC → 自动填充 → 评分保存 → 新文章关联 → 草稿不公开 → 发布 → 双向前台展示；390px 宽度检查无横向溢出。
- `npm run build`：六个公开路由、Payload Admin、原生 REST 均成功构建。
- Projects 导入：五个原始项目成功写入本地库；第二次全部跳过。未创建正式管理员，未向本地库填入测试作品/文章。

测试中的外部搜索响应为显式 fixture；provider HTTP 交互在单元测试中注入 fetch 模拟。本次未取得用户的 IGDB/RAWG 凭据，因此未声称已完成真实上游联网验证。自行配置 `.env` 后可搜索 TUNIC 验证实时数据。

Next.js 开发模式的独立 React debug WebSocket 通道在认证重定向中出现过负数时间戳报错，现设置 `experimental.reactDebugChannel: false`，仅改变开发调试信息传输。生产模式无此调试路径。
