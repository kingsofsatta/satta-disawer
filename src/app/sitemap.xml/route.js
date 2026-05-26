import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const baseUrl = process.env.SITE_URL || 'https://example.com'
    const pagesDir = path.join(process.cwd(), 'src', 'app')
    const urls = []

    function walk(dir) {
      const items = fs.readdirSync(dir, { withFileTypes: true })
      for (const it of items) {
        if (it.name === 'api') continue
        const full = path.join(dir, it.name)
        if (it.isDirectory()) {
          // skip grouping folders like (admin)
          if (it.name.startsWith('(')) {
            walk(full)
            continue
          }
          walk(full)
        } else if (it.isFile() && it.name === 'page.js') {
          const rel = path.relative(pagesDir, dir)
          // ignore dynamic routes with [
          if (rel.includes('[')) continue
          const segments = rel.split(path.sep).filter(Boolean).map(s => s.replace(/\(.+\)/g, '').replace(/\[|\]/g, ''))
          const urlPath = '/' + segments.join('/')
          const final = urlPath === '/(root)' || urlPath === '/(root)/' ? '/' : urlPath.replace('/(root)', '')
          urls.push(final === '' ? '/' : final)
        }
      }
    }

    walk(pagesDir)

    // ensure unique and add root if missing
    const unique = Array.from(new Set(urls))
    if (!unique.includes('/')) unique.unshift('/')

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      unique.map(u => {
        return `  <url>\n    <loc>${baseUrl.replace(/\/$/, '')}${u}</loc>\n  </url>`
      }).join('\n') +
      `\n</urlset>`

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400'
      }
    })
  } catch (err) {
    return new Response('Error generating sitemap', { status: 500 })
  }
}
