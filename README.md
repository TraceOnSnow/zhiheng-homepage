# traceonsnow.com

A lightweight personal Internet home for Zhiheng Wang.

The site intentionally contains no local blog or project content system. It introduces the owner
and points visitors to the independently maintained sites that contain the actual content.

## Development

```bash
npm install
npm run dev
```

The VS Code launch configuration can start the same development server.

## Editing content

- Personal links and destinations: `data/portal.ts`
- English and Chinese copy: `lib/i18n.ts`
- Page structure: `app/Main.tsx`
- Visual styles: `css/tailwind.css`
- SEO metadata: `data/siteMetadata.js`

## Validation

```bash
npm run lint
npm run typecheck
npm run format:check
npm run build
```
