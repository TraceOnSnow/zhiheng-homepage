# Phase 1 内容迁移

## 已检查的源

- `trace-blog/src/content.config.ts`、`src/loaders/post-loader.ts`、`docs/CONTENT_RENDERING.md`、`docs/CONTENT_REPOSITORY.md` 和真实文章。
- 当前 `src/content/posts` 共 18 篇 Markdown，0 篇 MDX。共同 frontmatter 为 `title/published/tags/category/draft/lang/description`；2 篇原文含 Wiki Link 语法（可能也出现在语法示例中，迁移时须区分）。
- `trace-blog/src/data/projects.ts` 有 5 个真实项目，当前均无图片。
- HayakuShelf 的 `src/db/schema.ts`、`src/lib/metadata/*`、`src/lib/rating.ts`、`docs/data-portability.md`。只读盘点当前 `data/shelf.db`：作品、来源、别名、精细评分和体验记录表均为 0 行。未来以实际迁移时的快照为准。
- 当前主页的 `data/authors/default.mdx`、`data/siteMetadata.js`。源站仍有 Contentlayer 文章；这些原文件与用户未提交的修改均保留。

## Projects：已有可执行导入

```sh
npm run import:projects -- ../trace-blog/src/data/projects.ts
npm run import:projects -- ../trace-blog/src/data/projects.ts --apply
```

第一次只预览，不连接数据库；第二次按原 `id` → `slug` 新增，已有 slug 跳过，不覆盖后台修改。保留 description、category、techStack、status、链接、日期、featured、tags 和原顺序。脚本只加载受信任的本地 TS 文件。遇到图片会中止，要求先导入 Media，避免静默丢失。

## Posts：原文备份 → 转换预览 → 草稿 → 人工检查 → 发布

| 源 | Payload |
| --- | --- |
| title | title |
| 内容目录名 / 原 permalink | slug，另生成旧 URL 重定向清单 |
| published | publishedAt；纯日期统一解释为 UTC 日期并记录原精度 |
| description | excerpt |
| tags | tags |
| draft | `_status`；首次迁移建议全部导入草稿 |
| image、正文相对图片 | 先复制并导入 Media，再改为 upload reference |
| Markdown / MDX 正文 | 转换为 Lexical JSON；不执行来源中的 JSX |
| category / lang / updated / sourceLink 等 | 迁移清单完整保存，确认需求后加字段，不能无声丢弃 |

导入前保存 Git revision、原始文件、SHA-256、原 URL 与目标 ID 映射。使用 Payload Lexical 的 Markdown 转换工具，逐项检查表格、代码块、数学公式、Wiki Link、Callout 与自定义组件；不支持的语法必须报告，不能直接变成纯文本冒充迁移成功。加密文章保持草稿且不上传私密附件，单独处理访问需求。当前 Media 是公开素材库。

图片先用文件 hash 去重；文章按源路径/固定 slug 去重；重复运行默认只新增，不能覆盖后台编辑。正文与 `relatedWorks` 的关联在 Works 导入并建立 ID 映射后写入。Phase 1 没有自动猜测文章与作品关系，也没有批量导入旧文章。

## HayakuShelf：从一致性 SQLite 备份导入

旧 Native JSON v1 / CSV **不能完整恢复** `normalized_rating` 和多次 experiences，不能作为无损迁移源。使用 SQLite backup API 取得一致性副本，并复制 `data/uploads/covers`；不能在 WAL 活跃时仅复制主 `.db` 文件。

| 源表/字段 | 目标 |
| --- | --- |
| media_items.title/type | Works.title/type；film→movie、tv_show→tv、board_game→boardgame |
| original_title + media_item_aliases | aliases，去重但保留原拼写 |
| creators/platforms JSON | creators/platforms 文本多值字段 |
| release_year | 只知道年份时不能伪造 1 月 1 日；加 releaseYear / precision 后再导入 |
| media_item_sources | sources(provider, externalId, url)，保留每个来源 |
| media_item_ratings.normalized_rating | rating = normalized_rating / 100（旧范围 0–1000，新范围 0–10） |
| media_items.rating | 仅没有 normalized_rating 时回退到旧 0–10 值 |
| media_item_tags + tags | tags |
| impression + notes | note，显式分段，保留两者 |
| personal_experiences | experiences；日期精度、自定义 status、ongoing 先在预览报告中列出，补充目标字段后导入，不能静默降级 |
| cover_url | 外部 URL → coverUrl；本地文件 → Media upload reference |

先用 `(provider, external_id)` 识别重复；标题相同不能自动合并版本。建立旧 UUID → 新 Payload ID 映射，slug 冲突加确定性后缀并报告。每批导入前备份，默认 private；确认后公开。当前 sources 保存来源但不提供跨 Works 的全局唯一约束，批量导入器必须报告重复身份。未知 type、自定义 status、profile/shelf/section 配置保留在原始备份与迁移清单，不强塞到新模型。

## 后续边界

- Work Card block 可用 Lexical BlocksFeature + relationship 实现。新增时要统一维护反向引用索引，避免只有 relatedWorks 才显示反向文章；当前仅 relatedWorks，未做正文 block。
- 当前只迁移游戏 provider；中文多路检索、自动跨来源合并和其他 provider 暂不迁移。
- 上线切换域名前准备旧 `/blog/*`、博客子域路径和 permalink 重定向；本阶段不修改 DNS、不下线旧站。
- SQLite + 本地上传要求持久化磁盘；若继续 Vercel，先替换成远程数据库与对象存储，并测试迁移，不把本地 SQLite 部署到临时文件系统。
