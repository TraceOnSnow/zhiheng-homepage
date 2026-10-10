import { getUI } from '@/lib/ui/server'
export async function generateMetadata() { return { title: (await getUI()).t.credits } }
export default async function Credits() {
  const { language, t } = await getUI()
  return <section className="card"><h1>{t.credits}</h1>
    <p>{language === 'zh' ? '作品资料与封面来自各作品页面标注的外部来源，个人评分与感想由站点作者填写。' : 'Metadata and covers come from the providers identified on each work page. Ratings and reactions are personal.'}</p>
    <a href="https://www.themoviedb.org"><img src="/assets/providers/tmdb.svg" alt="TMDB" width="110" height="40" /></a>
    <p lang="en">This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
  </section>
}
