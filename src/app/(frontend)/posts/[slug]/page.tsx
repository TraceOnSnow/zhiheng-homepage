import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { cms, publicQuery } from '@/lib/cms'
import { Cover, Tags, WorkCard, dateLabel } from '@/components/content'

async function getPost(slug: string) {
  const result = await (await cms()).find({ collection: 'posts', ...publicQuery, where: { slug: { equals: slug } }, limit: 1, depth: 2 })
  return result.docs[0]
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const post = await getPost((await params).slug)
  return { title: post?.title || '文章不存在', description: post?.excerpt || undefined }
}
export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const post = await getPost((await params).slug)
  if (!post) notFound()
  const works = (post.relatedWorks || []).filter(work => typeof work === 'object' && work !== null)
  return <>
    <article className="card article"><header><time className="muted">{dateLabel(post.publishedAt)}</time><h1>{post.title}</h1><Tags tags={post.tags} /></header>
      <Cover media={post.cover} alt={post.title} className="hero-cover" />
      <RichText data={post.content} className="prose" />
    </article>
    {works.length > 0 && <><div className="section-heading"><h2>相关作品</h2></div><div className="work-grid">{works.map(work => <WorkCard key={work.id} work={work} />)}</div></>}
  </>
}
