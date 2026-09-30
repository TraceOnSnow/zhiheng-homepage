import 'dotenv/config'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import type { Project } from '../src/payload-types'

const args = process.argv.slice(2)
const source = args.find(arg => !arg.startsWith('--'))
if (!source) throw new Error('Usage: npm run import:projects -- ../trace-blog/src/data/projects.ts [--apply]')
// This imports a trusted local TS module, never an uploaded or remote module.
const { projectsData } = await import(pathToFileURL(path.resolve(source)).href)
type Input = { id: string; title: string; description: string; category?: Project['category']; techStack?: string[]; status?: Project['status']; liveDemo?: string; sourceCode?: string; visitUrl?: string; startDate?: string; endDate?: string; featured?: boolean; tags?: string[]; image?: string }
if (!Array.isArray(projectsData)) throw new Error('Source must export projectsData[]')
const projects = (projectsData as Input[]).map((project, order) => {
  if (!project.id || !project.title || !project.description) throw new Error('Each project needs id, title, description')
  if (project.image) throw new Error(`Project ${project.id} has an image. Import its Media first; this script does not discard images.`)
  return { title: project.title, slug: project.id, generateSlug: false, description: project.description,
    category: project.category, techStack: project.techStack, status: project.status,
    liveDemo: project.liveDemo, sourceCode: project.sourceCode, visitUrl: project.visitUrl,
    startDate: project.startDate ? new Date(project.startDate).toISOString() : undefined,
    endDate: project.endDate ? new Date(project.endDate).toISOString() : undefined,
    featured: project.featured, tags: project.tags, order, visible: true }
})
if (!args.includes('--apply')) {
  console.log(JSON.stringify({ mode: 'preview (no database connection)', projects }, null, 2))
} else {
  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload.config')
  const payload = await getPayload({ config })
  try {
    for (const data of projects) {
      const existing = await payload.find({ collection: 'projects', where: { slug: { equals: data.slug } }, limit: 1 })
      if (existing.totalDocs) { console.log(`Skipped existing: ${data.slug}`); continue }
      await payload.create({ collection: 'projects', data })
      console.log(`Imported: ${data.slug}`)
    }
  } finally { await payload.destroy() }
}
