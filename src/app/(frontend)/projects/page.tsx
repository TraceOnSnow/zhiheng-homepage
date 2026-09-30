import { cms, pageNumber, publicQuery } from '@/lib/cms'
import { Cover, Pagination, Tags } from '@/components/content'
export const metadata = { title: 'Projects' }
export default async function Projects({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const projects = await (await cms()).find({ collection: 'projects', ...publicQuery, sort: 'order', limit: 24, page: pageNumber((await searchParams).page), depth: 1 })
  return <><h1>Projects</h1><div className="project-grid">{projects.docs.map(project => <article className="card" key={project.id}>
    <Cover media={project.cover} alt={project.title} className="hero-cover" /><span className="muted">{project.category} · {project.status}</span>
    <h2>{project.title}</h2><p>{project.description}</p><Tags tags={project.techStack} />
    <div className="project-links">{(project.visitUrl || project.liveDemo) && <a href={project.visitUrl || project.liveDemo || ''}>访问项目 ↗</a>}{project.sourceCode && <a href={project.sourceCode}>源码 ↗</a>}</div>
  </article>)}</div>{!projects.totalDocs && <p className="empty">暂无项目。</p>}<Pagination page={projects.page || 1} totalPages={projects.totalPages} path="/projects" /></>
}
