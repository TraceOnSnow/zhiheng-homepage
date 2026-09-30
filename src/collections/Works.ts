import type { CollectionConfig } from 'payload'
import { cover, httpURL, slug, tags, writes } from './shared'

export const workTypes = ['game', 'anime', 'book', 'movie', 'tv', 'manga', 'comic', 'boardgame'] as const
const statuses = ['planned', 'in-progress', 'completed', 'on-hold', 'dropped']

export const Works: CollectionConfig = {
  slug: 'works', admin: { useAsTitle: 'title', defaultColumns: ['title', 'type', 'rating', 'status'] },
  access: { read: ({ req }) => req.user ? true : { visibility: { equals: 'public' } }, ...writes },
  fields: [
    { name: 'type', type: 'select', required: true, defaultValue: 'game', options: [...workTypes] },
    { name: 'metadataSearch', type: 'ui', admin: {
      condition: (data) => data.type === 'game',
      components: { Field: '/components/admin/MetadataSearch#MetadataSearch' },
    } },
    { name: 'title', type: 'text', required: true }, slug,
    { name: 'aliases', type: 'text', hasMany: true }, cover,
    { name: 'coverUrl', type: 'text', validate: httpURL, admin: { description: '外部封面；上传封面优先。' } },
    { name: 'releaseDate', type: 'date' },
    { name: 'creators', type: 'text', hasMany: true },
    { name: 'platforms', type: 'text', hasMany: true },
    { name: 'description', type: 'textarea', label: '作品简介' },
    { name: 'sources', type: 'array', fields: [
      { name: 'provider', type: 'text', required: true },
      { name: 'externalId', type: 'text', required: true },
      { name: 'url', type: 'text', validate: httpURL },
      { name: 'fetchedAt', type: 'date' },
    ] },
    { name: 'rating', type: 'number', min: 0, max: 10, admin: { step: 0.1, description: '个人评分，0–10；未评分时留空。' } },
    { name: 'status', type: 'select', options: statuses, defaultValue: 'planned' }, tags,
    { name: 'note', type: 'textarea', label: '感想 / 笔记' },
    { name: 'experiences', type: 'array', fields: [
      { name: 'status', type: 'select', options: statuses, defaultValue: 'completed' },
      { name: 'startedOn', type: 'date' }, { name: 'endedOn', type: 'date' },
      { name: 'platform', type: 'text' }, { name: 'progress', type: 'text' }, { name: 'note', type: 'textarea' },
    ] },
    { name: 'visibility', type: 'select', required: true, defaultValue: 'public', options: ['public', 'private'], admin: { position: 'sidebar' } },
    { name: 'relatedPosts', type: 'join', collection: 'posts', on: 'relatedWorks' },
  ],
}
