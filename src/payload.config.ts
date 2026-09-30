import 'dotenv/config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Works } from './collections/Works'
import { Projects } from './collections/Projects'
import { searchEndpoint } from './lib/metadata/endpoint'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || '',
  serverURL: process.env.SERVER_URL || 'http://localhost:3000',
  admin: { user: 'users', importMap: { baseDir: dirname } },
  collections: [Users, Posts, Works, Projects, Media],
  editor: lexicalEditor(), sharp,
  db: sqliteAdapter({
    client: { url: process.env.DATABASE_URL || 'file:./storage/payload.db' },
    migrationDir: path.resolve(dirname, 'migrations'),
    push: process.env.NODE_ENV !== 'production',
  }),
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  upload: { limits: { fileSize: 10_000_000 } },
  endpoints: [searchEndpoint],
})
