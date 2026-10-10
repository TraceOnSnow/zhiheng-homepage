import { getUI } from '@/lib/ui/server'
import { uiLabel } from '@/lib/ui/dictionary'
import { cms, pageNumber, publicQuery } from '@/lib/cms'
import { Cover, Pagination, Tags } from '@/components/content'
export async function generateMetadata() { return { title: (await getUI()).t.projects } }
export default async function Projects({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { t, language } = await getUI()
  const projects = await (await cms()).find({ collection: 'projects', ...publicQuery, sort: 'order', limit: 24, page: pageNumber((await searchParams).page), depth: 1 })
  return <><h1>{t.projects}</h1><div className="project-grid">{projects.docs.map(project => <article className="card" key={project.id}>
    <Cover media={project.cover} alt={project.title} className="hero-cover" /><span className="muted">{uiLabel(language, project.category)} · {uiLabel(language, project.status)}</span>
    <h2>{project.title}</h2><p>{project.description}</p><Tags tags={project.techStack} />
    <div className="project-links">{(project.visitUrl || project.liveDemo) && <a href={project.visitUrl || project.liveDemo || ''}>{t.visit}</a>}{project.sourceCode && <a href={project.sourceCode}>{t.sourceCode}</a>}</div>
  </article>)}</div>{!projects.totalDocs && <p className="empty">{t.emptyProjects}</p>}<Pagination page={projects.page || 1} totalPages={projects.totalPages} path="/projects" /></>
}
