import type { CollectionConfig } from 'payload'
import { cover, publishedRead, slug, tags, writes } from './shared'

export const Posts: CollectionConfig = {
  labels: { singular: {zh: '文章', en: 'Posts'}, plural: {zh: '文章', en: 'Posts'} },
  slug: 'posts', admin: { useAsTitle: 'title', defaultColumns: ['title', '_status', 'publishedAt'] },
  access: { read: publishedRead, ...writes },
  versions: { drafts: true, maxPerDoc: 30 },
  hooks: { beforeChange: [({ data }) => {
    if (data._status === 'published' && !data.publishedAt) data.publishedAt = new Date().toISOString()
    return data
  }] },
  fields: [
    { name: 'title', label: {zh: '标题', en: 'Title'}, type: 'text', required: true }, slug,
    { name: 'excerpt', label: {zh: '摘要', en: 'Excerpt'}, type: 'textarea' }, cover,
    { name: 'content', label: {zh: '正文', en: 'Content'}, type: 'richText', required: true }, tags,
    { name: 'publishedAt', label: {zh: '发布时间', en: 'Published at'}, type: 'date', admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'relatedWorks', label: {zh: '相关作品', en: 'Related works'}, type: 'relationship', relationTo: 'works', hasMany: true },
  ],
}
