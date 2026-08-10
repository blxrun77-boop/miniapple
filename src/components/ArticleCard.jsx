import { useLanguage } from '../context/LanguageContext'

export default function ArticleCard({ article }) {
  const { t } = useLanguage()

  return (
    <button
      onClick={() => window.open(article.target_url, '_blank')}
      className="group overflow-hidden rounded-2xl border border-white/15 bg-[#101733] text-left transition hover:border-cyan-300/60 active:scale-[0.99]"
    >
      <img src={article.image_url} alt={article.title} className="h-32 w-full object-cover transition group-hover:scale-[1.02]" />
      <div className="p-3">
        <p className="line-clamp-2 text-sm font-semibold text-slate-100">{article.title}</p>
        <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-cyan-300 transition-colors group-hover:text-cyan-200">
          <span>{t('articleList.openPost') || 'Открыть пост в канале'}</span>
          <span>→</span>
        </p>
      </div>
    </button>
  )
}
