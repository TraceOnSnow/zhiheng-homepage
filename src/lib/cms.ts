import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'

export const cms = cache(() => getPayload({ config }))
// Local API bypasses access by default. Every public query must use these options.
export const publicQuery = { overrideAccess: false, user: null, draft: false } as const
export const pageNumber = (value?: string) => Math.max(1, Math.min(10000, Number.parseInt(value || '1', 10) || 1))
