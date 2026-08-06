import projectsData from '@/data/projectsData'
import Card from '@/components/Card'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Projects' })

export default function Projects() {
  return (
    <div className="pb-8 sm:pb-12">
      <header className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 px-6 py-12 shadow-[0_24px_80px_-44px_rgba(88,80,180,0.5)] backdrop-blur-xl sm:px-10 dark:border-white/10 dark:bg-gray-900/70">
        <div className="anime-grid absolute inset-0 -z-10 opacity-45" />
        <div className="absolute -top-20 -right-20 -z-10 h-56 w-56 rounded-full bg-pink-200/55 blur-3xl dark:bg-pink-500/10" />
        <p className="section-kicker">Playground</p>
        <h1 className="section-title text-4xl sm:text-5xl">Projects</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-300">
          Experiments, side projects, and useful things built along the way.
        </p>
      </header>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {projectsData.map((project) => (
          <Card key={project.title} {...project} />
        ))}
      </div>
    </div>
  )
}
