import type { Access, Field, PayloadRequest, Where } from 'payload'
import { slugField } from 'payload'
import { slugify } from '../lib/slug'

export const authenticated = ({ req }: { req: PayloadRequest }): boolean => Boolean(req.user)
export const publicRead: Access = () => true
export const publishedRead: Access = ({ req }): boolean | Where => req.user ? true : {
  and: [{ _status: { equals: 'published' } }, { publishedAt: { less_than_equal: new Date().toISOString() } }],
}
export const writes = { create: authenticated, update: authenticated, delete: authenticated }
export const slug: Field = slugField({
  slugify: ({ valueToSlugify }) => slugify(String(valueToSlugify || '')),
  overrides: (row) => {
    const field = row.fields[1]
    if (field.type === 'text') field.hooks = {
      beforeValidate: [({ value, data, originalDoc }) => value || originalDoc?.slug || slugify(data?.title || '')],
    }
    return row
  },
})
export const tags: Field = { name: 'tags', type: 'text', hasMany: true }
export const cover: Field = { name: 'cover', type: 'upload', relationTo: 'media' }
export const httpURL = (value: unknown) => {
  if (!value) return true
  try { return ['http:', 'https:'].includes(new URL(String(value)).protocol) || '请输入 HTTP(S) URL。' }
  catch { return '请输入有效 URL。' }
}
