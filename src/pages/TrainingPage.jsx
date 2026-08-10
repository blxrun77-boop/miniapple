import { useState } from 'react'
import api from '../api/client'
import PageShell from '../components/PageShell.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { GraduationCap, CheckCircle2, Send, BookOpen } from 'lucide-react'

export default function TrainingPage() {
  const { t } = useLanguage()
  const trainingPlatforms = ['Facebook', 'Google', 'TikTok', 'Яндекс', 'Twitter (X)', t('training.exp.other')]
  const experienceLevels = [t('training.exp.novice'), t('training.exp.basic'), t('training.exp.pro')]
  const [platform, setPlatform] = useState(trainingPlatforms[0])
  const [experience, setExperience] = useState(experienceLevels[0])
  const [details, setDetails] = useState('')
  const [status, setStatus] = useState('')
  const [submittedRequest, setSubmittedRequest] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submitTraining = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus(t('training.sending'))
    try {
      const { data } = await api.post('/requests/training', {
        platform,
        experience_level: experience,
        details: details || null
      })
      setSubmittedRequest(data)
      setStatus('')
      setDetails('')
    } catch {
      setStatus(t('training.fail'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PageShell title={t('training.title')}>
      {submittedRequest ? (
        <section className="rounded-3xl border border-indigo-400/40 bg-gradient-to-br from-[#12183b] via-[#0b1430] to-[#040817] p-6 text-center shadow-[0_0_35px_rgba(99,102,241,0.25)]">
          <div className="mx-auto flex items-center justify-center">
            <CheckCircle2 size={36} className="text-slate-400" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-white">Заявка #{submittedRequest.id} отправлена!</h2>
          <p className="mt-2 text-xs text-slate-300">
            Заявка на обучение по направлению <span className="text-indigo-300 font-bold">{submittedRequest.platform}</span> зарегистрирована.
          </p>

          <div className="mt-6 space-y-3">
            <a
              href="https://t.me/mediabuy_adm"
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-400 to-cyan-400 py-3 text-sm font-bold text-slate-950 shadow-[0_0_20px_rgba(99,102,241,0.4)] transition hover:opacity-90"
            >
              <Send size={18} /> Связаться с ментором (@mediabuy_adm)
            </a>
            <button
              onClick={() => setSubmittedRequest(null)}
              className="w-full rounded-2xl border border-indigo-400/30 bg-black/40 py-2.5 text-xs font-semibold text-slate-300 hover:border-indigo-400/60"
            >
              Отправить еще одну заявку
            </button>
          </div>
        </section>
      ) : (
        <section className="rounded-3xl border border-indigo-400/40 bg-gradient-to-br from-[#12183b] via-[#0b1430] to-[#040817] p-5 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
          <div className="flex items-center gap-3">
            <GraduationCap size={26} className="text-slate-400 shrink-0" />
            <div>
              <h2 className="text-lg font-bold text-white">{t('training.heading')}</h2>
              <p className="text-xs text-indigo-300 font-medium">{t('training.subtitle')}</p>
            </div>
          </div>

          <form onSubmit={submitTraining} className="mt-5 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Платформа / Источник трафика *</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full rounded-xl border border-indigo-500/30 bg-[#091024] px-3 py-2.5 text-sm text-white focus:border-indigo-400 focus:outline-none"
              >
                {trainingPlatforms.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Ваш текущий уровень опыта *</label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full rounded-xl border border-indigo-500/30 bg-[#091024] px-3 py-2.5 text-sm text-white focus:border-indigo-400 focus:outline-none"
              >
                {experienceLevels.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Пожелания / Вопросы к обучению</label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                placeholder={t('training.details')}
                className="w-full rounded-xl border border-indigo-500/30 bg-black/40 px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-400 focus:outline-none"
              />
            </div>

            <div className="rounded-xl border border-indigo-500/20 bg-indigo-950/30 p-3 text-xs text-slate-300/90">
              <BookOpen size={16} className="inline mr-1 text-indigo-400" />
              Обучение включает разбор практических кейсов, сетапы антидетект-браузеров, платежек и прямое сопровождение.
            </div>

            <button
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 py-3 text-sm font-bold text-slate-950 shadow-[0_0_20px_rgba(99,102,241,0.4)] transition hover:opacity-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Отправка...' : t('training.submit')}
            </button>
          </form>

          {status && <p className="mt-3 text-center text-xs text-slate-300">{status}</p>}
        </section>
      )}
    </PageShell>
  )
}
