import { useState } from 'react'
import api from '../api/client'
import PageShell from '../components/PageShell.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { Rocket, CheckCircle2, Send, ShieldCheck } from 'lucide-react'

export default function LaunchAdsPage() {
  const [launchBudget, setLaunchBudget] = useState('')
  const [launchUrl, setLaunchUrl] = useState('')
  const [status, setStatus] = useState('')
  const [submittedRequest, setSubmittedRequest] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { t } = useLanguage()

  const submitLaunchAds = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus(t('launch.sending'))
    try {
      const { data } = await api.post('/requests/launch-ads', {
        project_url: launchUrl || null,
        planned_budget: launchBudget
      })
      setSubmittedRequest(data)
      setStatus('')
      setLaunchBudget('')
      setLaunchUrl('')
    } catch {
      setStatus(t('launch.fail'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PageShell title={t('launch.title')}>
      {submittedRequest ? (
        <section className="rounded-3xl border border-cyan-400/40 bg-gradient-to-br from-[#0e1a3e] via-[#09122c] to-[#040817] p-6 text-center shadow-[0_0_35px_rgba(56,189,248,0.25)]">
          <div className="mx-auto flex items-center justify-center">
            <CheckCircle2 size={36} className="text-slate-400" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-white">Заявка #{submittedRequest.id} отправлена!</h2>
          <p className="mt-2 text-xs text-slate-300">
            Наш менеджер зафиксировал ваши данные по запуску рекламы (бюджет: <span className="text-cyan-300 font-bold">{submittedRequest.planned_budget}</span>).
          </p>

          <div className="mt-6 space-y-3">
            <a
              href="https://t.me/mediabuy_adm"
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 py-3 text-sm font-bold text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.4)] transition hover:opacity-90"
            >
              <Send size={18} /> Написать администратору (@mediabuy_adm)
            </a>
            <button
              onClick={() => setSubmittedRequest(null)}
              className="w-full rounded-2xl border border-cyan-400/30 bg-black/40 py-2.5 text-xs font-semibold text-slate-300 hover:border-cyan-400/60"
            >
              Отправить еще одну заявку
            </button>
          </div>
        </section>
      ) : (
        <section className="rounded-3xl border border-cyan-400/40 bg-gradient-to-br from-[#0e1a3e] via-[#09122c] to-[#040817] p-5 shadow-[0_0_30px_rgba(56,189,248,0.2)]">
          <div className="flex items-center gap-3">
            <Rocket size={26} className="text-slate-400 shrink-0" />
            <div>
              <h2 className="text-lg font-bold text-white">{t('launch.heading')}</h2>
              <p className="text-xs text-cyan-300 font-medium">{t('launch.price')}</p>
            </div>
          </div>

          <form onSubmit={submitLaunchAds} className="mt-5 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Ссылка на оффер / проект (необязательно)</label>
              <input
                value={launchUrl}
                onChange={(e) => setLaunchUrl(e.target.value)}
                placeholder="https://t.me/... или URL сайта"
                className="w-full rounded-xl border border-cyan-500/30 bg-black/40 px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Планируемый рекламный бюджет *</label>
              <input
                value={launchBudget}
                onChange={(e) => setLaunchBudget(e.target.value)}
                placeholder="например: $500 - $1000 / мес"
                className="w-full rounded-xl border border-cyan-500/30 bg-black/40 px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                required
              />
            </div>

            <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/30 p-3 text-xs text-slate-300/90">
              <ShieldCheck size={16} className="inline mr-1 text-cyan-400" />
              Команда Mediabuy Lab подберет фарма-аккаунты, прокси и протестированные связки под вашу нишу.
            </div>

            <button
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 py-3 text-sm font-bold text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.4)] transition hover:opacity-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Отправка...' : t('launch.submit')}
            </button>
          </form>

          {status && <p className="mt-3 text-center text-xs text-slate-300">{status}</p>}
        </section>
      )}
    </PageShell>
  )
}
