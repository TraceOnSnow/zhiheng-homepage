import assert from 'node:assert/strict'
import { mkdtemp, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import type { Payload } from 'payload'

test('real SQLite CRUD, publication access, native reverse relationship and authentication', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'trace-cms-test-'))
  // Standalone tests must not attach a persistent HMR socket to a running dev server.
  process.env.DISABLE_PAYLOAD_HMR = 'true'
  process.env.DATABASE_URL = `file:${directory}/test.db`
  process.env.MEDIA_DIR = `${directory}/media`
  process.env.PAYLOAD_SECRET = 'integration-test-secret-not-for-production'
  let payload: Payload | undefined
  try {
    const { getPayload } = await import('payload')
    const { default: config } = await import('../../src/payload.config')
    payload = await getPayload({ config })
    const owner = await payload.create({ collection: 'users', data: { email: 'owner@example.test', password: 'test-password-123' } })
    const user = { ...owner, collection: 'users' as const }
    const publicAccess = { overrideAccess: false, user: null } as const
    const { default: sharp } = await import('sharp')
    const image = await sharp({ create: { width: 800, height: 1000, channels: 3, background: '#557799' } }).png().toBuffer()
    const media = await payload.create({ collection: 'media', user, overrideAccess: false, data: { alt: 'Test cover' }, file: { data: image, mimetype: 'image/png', name: 'cover.png', size: image.length } })
    assert.ok(media.url)
    assert.ok(media.sizes?.card?.url)
    assert.equal((await payload.find({ collection: 'media', ...publicAccess })).totalDocs, 1)
    await payload.create({ collection: 'projects', user, data: { title: 'Project test', slug: 'project-test', description: 'Example', visible: true } })
    await payload.create({ collection: 'projects', user, data: { title: 'Hidden project', slug: 'hidden-project', description: 'Private', visible: false } })
    assert.equal((await payload.find({ collection: 'projects', ...publicAccess })).totalDocs, 1)
    const content = { root: { type: 'root', children: [{ type: 'paragraph', version: 1, children: [{ type: 'text', text: 'TUNIC review', version: 1, format: 0, mode: 'normal', style: '', detail: 0 }], direction: null, format: '', indent: 0 }], direction: null, format: '' as const, indent: 0, version: 1 } }
    const work = await payload.create({ collection: 'works', overrideAccess: false, user, data: { title: 'TUNIC', slug: '', type: 'game', rating: 9.5, visibility: 'public', sources: [{ provider: 'igdb', externalId: '12' }], experiences: [{ status: 'completed', note: '完成一周目' }] } })
    assert.equal(work.slug, 'tunic')
    const post = await payload.create({ collection: 'posts', overrideAccess: false, user, draft: true, data: { title: 'TUNIC review', slug: '', content, relatedWorks: [work.id] } })
    assert.equal((await payload.find({ collection: 'posts', ...publicAccess })).totalDocs, 0)
    await payload.update({ collection: 'posts', id: post.id, overrideAccess: false, user, data: { _status: 'published' } })
    const publicPosts = await payload.find({ collection: 'posts', ...publicAccess, depth: 2 })
    assert.equal(publicPosts.totalDocs, 1)
    assert.ok(publicPosts.docs[0].publishedAt)
    assert.equal(typeof publicPosts.docs[0].relatedWorks?.[0], 'object')
    const reverse = await payload.findByID({ collection: 'works', id: work.id, ...publicAccess, depth: 1, joins: { relatedPosts: { limit: 10 } } })
    assert.equal(reverse.relatedPosts?.docs?.length, 1)
    // New drafts must not replace the published revision seen by anonymous visitors.
    await payload.update({ collection: 'posts', id: post.id, user, draft: true, data: { title: 'Unpublished revision', _status: 'draft' } })
    assert.equal((await payload.findByID({ collection: 'posts', id: post.id, ...publicAccess })).title, 'TUNIC review')
    await payload.create({ collection: 'posts', user, data: { title: 'Future post', slug: 'future-post', content, _status: 'published', publishedAt: '2099-01-01T00:00:00Z', relatedWorks: [work.id] } })
    assert.equal((await payload.find({ collection: 'posts', ...publicAccess, draft: true })).totalDocs, 0)
    await payload.update({ collection: 'works', id: work.id, user, data: { visibility: 'private' } })
    assert.equal((await payload.find({ collection: 'works', ...publicAccess })).totalDocs, 0)
    const hiddenRelationship = (await payload.find({ collection: 'posts', ...publicAccess, depth: 1 })).docs[0].relatedWorks
    assert.ok(!hiddenRelationship?.some(value => typeof value === 'object'))
    await assert.rejects(payload.create({ collection: 'works', ...publicAccess, data: { title: 'Unauthorized', slug: 'unauthorized', type: 'game', visibility: 'public' } }))
    await assert.rejects(payload.create({ collection: 'users', ...publicAccess, data: { email: 'intruder@example.test', password: 'password-123' } }))
    await assert.rejects(payload.find({ collection: 'users', ...publicAccess }))
    const login = await payload.login({ collection: 'users', data: { email: 'owner@example.test', password: 'test-password-123' } })
    assert.ok(login.token)
    await assert.rejects(payload.create({ collection: 'works', user, data: { title: 'Bad rating', slug: 'bad-rating', type: 'game', visibility: 'public', rating: 11 } }))
    await assert.rejects(payload.create({ collection: 'works', user, data: { title: 'Bad URL', slug: 'bad-url', type: 'game', visibility: 'public', coverUrl: 'javascript:alert(1)' } }))
  } finally {
    await payload?.destroy()
    await rm(directory, { recursive: true, force: true })
  }
})
