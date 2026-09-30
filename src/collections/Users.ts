import type { CollectionConfig } from 'payload'
import { authenticated } from './shared'

export const Users: CollectionConfig = {
  slug: 'users', auth: true,
  admin: { useAsTitle: 'email' },
  access: { admin: authenticated, create: authenticated, read: authenticated, update: authenticated, delete: authenticated },
  fields: [{ name: 'name', type: 'text' }],
}
