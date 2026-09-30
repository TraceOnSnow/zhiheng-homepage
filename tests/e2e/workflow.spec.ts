import { expect, test } from '@playwright/test'

test('admin creates a game via search, publishes a related post, and serves both publicly', async ({ page, request }) => {
  expect((await request.get('/api/metadata/games?q=TUNIC')).status()).toBe(401)
  await page.goto('/admin')
  await page.locator('#field-email').fill('owner@example.test')
  await page.locator('#field-password').fill('browser-test-password-123')
  const ready = page.waitForResponse(response => response.url().endsWith('/admin/create-first-user') && response.request().method() === 'POST' && response.ok())
  await page.locator('#field-confirm-password').fill('browser-test-password-123')
  await page.locator('#field-confirm-password').blur()
  await ready
  await page.getByRole('button', { name: 'Create', exact: true }).click()
  await expect(page).toHaveURL(/\/admin$/)
  await page.goto('/admin/collections/works/create')
  // Only the external search response is mocked. Form rendering, save, authentication,
  // relationships, database and public rendering all use the real application.
  await page.route('**/api/metadata/games?q=TUNIC', route => route.fulfill({ json: {
    candidates: [{ provider: 'igdb', externalId: '12', title: 'TUNIC', aliases: ['TUNIC', '小狐狸'], creators: ['Andrew Shouldice'], platforms: ['PC'], releaseDate: '2022-03-16T00:00:00.000Z', description: 'An adventure game.', source: { provider: 'igdb', externalId: '12', url: 'https://www.igdb.com/games/tunic', fetchedAt: '2026-09-29T00:00:00.000Z' } }],
    providers: [{ provider: 'igdb', state: 'ok' }, { provider: 'rawg', state: 'unavailable', message: '服务端尚未配置凭据。' }],
  } }))
  await page.getByLabel('搜索游戏', { exact: true }).fill('TUNIC')
  await page.getByRole('button', { name: '搜索', exact: true }).click()
  await page.getByRole('button', { name: '选择 TUNIC', exact: true }).click()
  await expect(page.getByRole('status').filter({ hasText: '已填入' })).toBeVisible()
  await expect(page.locator('#field-title')).toHaveValue('TUNIC')
  await page.locator('#field-rating').fill('9.5')
  await page.locator('#field-note').fill('A memorable adventure.')
  await page.getByRole('button', { name: 'Save', exact: true }).click()
  await expect(page).toHaveURL(/\/admin\/collections\/works\/\d+$/)
  const response = await request.get('/api/works?where[slug][equals]=tunic')
  const work = (await response.json()).docs[0]
  expect(work.rating).toBe(9.5)
  expect(work.aliases).toContain('小狐狸')
  expect(work.sources[0].externalId).toBe('12')
  expect(work.creators).toEqual(['Andrew Shouldice'])

  await page.goto('/admin/collections/posts/create')
  await page.locator('#field-title').fill('Playing TUNIC')
  await page.locator('[contenteditable="true"]').first().fill('TUNIC is worth exploring.')
  await page.locator('#field-relatedWorks').click()
  await page.getByText('TUNIC', { exact: true }).last().click()
  await page.getByRole('button', { name: 'Save Draft', exact: true }).click()
  await expect(page).toHaveURL(/\/admin\/collections\/posts\/\d+$/)
  expect((await (await request.get('/api/posts')).json()).totalDocs).toBe(0)
  await page.getByRole('button', { name: 'Publish changes', exact: true }).click()
  await expect(page.getByText('Published', { exact: true }).first()).toBeVisible()

  await page.goto('/works/tunic')
  await expect(page.getByRole('heading', { name: 'TUNIC', exact: true })).toBeVisible()
  await expect(page.getByText('9.5 / 10', { exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Playing TUNIC' })).toBeVisible()
  await page.screenshot({ path: 'test-results/works-tunic-desktop.png', fullPage: true })
  await page.getByRole('link', { name: 'Playing TUNIC' }).click()
  await expect(page.getByText('TUNIC is worth exploring.')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'TUNIC', exact: true })).toBeVisible()
  await page.setViewportSize({ width: 390, height: 844 })
  for (const route of ['/', '/posts', '/works', '/works/tunic', '/projects']) {
    await page.goto(route)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
    if (route === '/works/tunic') await page.screenshot({ path: 'test-results/works-tunic-mobile.png', fullPage: true })
  }
  await page.screenshot({ path: 'test-results/mobile-projects.png', fullPage: true })
})
