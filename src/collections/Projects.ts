import { dictionaries } from '@/lib/ui/dictionary'
import type { CollectionConfig } from 'payload'
import { cover, httpURL, slug, tags, writes } from './shared'

export const Projects: CollectionConfig = {
  labels: { singular: {zh: '项目', en: 'Projects'}, plural: {zh: '项目', en: 'Projects'} },
  slug: 'projects', admin: { useAsTitle: 'title' },
  access: { read: ({ req }) => req.user ? true : { visible: { equals: true } }, ...writes },
  fields: [
    { name: 'title', label: {zh: '标题', en: 'Title'}, type: 'text', required: true }, slug,
    { name: 'description', label: {zh: '简介', en: 'Description'}, type: 'textarea', required: true }, cover,
    { name: 'category', label: {zh: '分类', en: 'Category'}, type: 'select', options: (['web', 'mobile', 'desktop', 'other'] as const).map(value => ({ value, label: { zh: dictionaries.zh[value], en: dictionaries.en[value] } })), defaultValue: 'web' },
    { name: 'techStack', label: {zh: '技术栈', en: 'Tech stack'}, type: 'text', hasMany: true },
    { name: 'status', label: {zh: '状态', en: 'Status'}, type: 'select', options: (['completed', 'in-progress', 'planned'] as const).map(value => ({ value, label: { zh: dictionaries.zh[value], en: dictionaries.en[value] } })), defaultValue: 'in-progress' },
    ...['liveDemo', 'sourceCode', 'visitUrl'].map((name) => ({ name, label: { zh: name === 'liveDemo' ? '演示链接' : name === 'sourceCode' ? '源码链接' : '访问链接', en: name === 'liveDemo' ? 'Live demo' : name === 'sourceCode' ? 'Source code' : 'Visit URL' }, type: 'text' as const, validate: httpURL })),
    { name: 'startDate', label: {zh: '开始日期', en: 'Start date'}, type: 'date' }, { name: 'endDate', label: {zh: '结束日期', en: 'End date'}, type: 'date' },
    { name: 'featured', label: {zh: '精选', en: 'Featured'}, type: 'checkbox', defaultValue: false }, tags,
    { name: 'order', label: {zh: '排序', en: 'Order'}, type: 'number', defaultValue: 0 },
    { name: 'visible', label: {zh: '公开显示', en: 'Visible'}, type: 'checkbox', defaultValue: true },
  ],
}
