import Link from 'next/link'
import { cms, publicQuery } from '@/lib/cms'
import { PostCard, WorkCard } from '@/components/content'

export default async function Home() {
  const payload = await cms()
  const [posts, works, projects] = await Promise.all([
    payload.find({ collection: 'posts', ...publicQuery, limit: 3, sort: '-publishedAt', depth: 1 }),
    payload.find({ collection: 'works', ...publicQuery, limit: 4, sort: '-updatedAt', depth: 1 }),
    payload.find({ collection: 'projects', ...publicQuery, where: { featured: { equals: true } }, limit: 3, sort: 'order' }),
  ])
  return <>
    <section className="card profile"><img className="avatar" src="/assets/brand/avatar.png" alt="Zhiheng Wang" width="112" height="112" />
      <div><h1>Zhiheng Wang</h1><p className="profile-role">AI Engineer · Rice CS</p>
        <p>关注 Agent Systems、模型编排与多模态知识图谱。这里记录软件工程、项目实践，以及玩过、看过和读过的作品。</p>
        <div className="profile-links"><a href="https://github.com/TraceOnSnow">GitHub ↗</a><a href="https://www.linkedin.com/in/zhihengwang02/">LinkedIn ↗</a><a href="mailto:zhihengw02@outlook.com">Email ↗</a></div>
      </div>
    </section>
    <div className="section-heading"><h2>最近文章</h2><Link href="/posts">全部文章 →</Link></div>
    <div className="stack">{posts.docs.length ? posts.docs.map(post => <PostCard key={post.id} post={post} />) : <p className="empty">暂无已发布文章。</p>}</div>
    <div className="section-heading"><h2>作品记录</h2><Link href="/works">全部记录 →</Link></div>
    <div className="work-grid">{works.docs.map(work => <WorkCard key={work.id} work={work} />)}</div>
    {projects.docs.length > 0 && <><div className="section-heading"><h2>Projects</h2><Link href="/projects">全部项目 →</Link></div>
      <div className="project-grid">{projects.docs.map(project => <article className="card" key={project.id}><h3>{project.title}</h3><p>{project.description}</p></article>)}</div></>}
  </>
}
