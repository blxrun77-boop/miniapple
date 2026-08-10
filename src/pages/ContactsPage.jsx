import { useEffect, useState } from 'react'
import api from '../api/client'
import PageShell from '../components/PageShell.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import {
  ExternalLink,
  ShieldCheck,
  MessageSquare,
  Megaphone,
  Copy,
  Check,
  Clock,
  Send,
  AlertTriangle,
  UserCheck,
  Headphones,
  Zap,
  Sparkles,
  Building2,
  Globe2,
  Landmark
} from 'lucide-react'

const OFFICIAL_COMPANY_REGISTRY_URL = 'https://find-and-update.company-information.service.gov.uk/company/10549229'

const DEFAULT_CONTACTS = [
  { id: 1, title: 'Официальный канал', title_en: 'Official Channel', link: 'https://t.me/mediabuy_lab', kind: 'channel' },
  { id: 2, title: 'Главный Админ', title_en: 'Main Admin', link: 'https://t.me/mediabuy_adm', kind: 'person' },
  { id: 3, title: 'Менеджер Сергей', title_en: 'Manager Sergey', link: 'https://t.me/sergey_mediabuy', kind: 'person' },
  { id: 4, title: 'Менеджер Антон', title_en: 'Manager Anton', link: 'https://t.me/Anton_mediabuy', kind: 'person' },
  { id: 5, title: 'Менеджер Виктория', title_en: 'Manager Victoria', link: 'https://t.me/Victorys_mediabuy', kind: 'person' },
]

export default function ContactsPage() {
  const { lang } = useLanguage()
  const [contacts, setContacts] = useState(DEFAULT_CONTACTS)
  const [copiedId, setCopiedId] = useState(null)
  const [supportTopic, setSupportTopic] = useState('accounts')
  const [supportText, setSupportText] = useState('')

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const { data } = await api.get('/content/contacts')
        if (data && data.length > 0) {
          const cleaned = data.map((c) => ({
            ...c,
            title: c.title ? c.title.replace(/^[^\w\sа-яА-ЯёЁ]+/g, '').trim() : c.title,
            title_en: c.title_en ? c.title_en.replace(/^[^\w\sа-яА-ЯёЁ]+/g, '').trim() : c.title_en,
          }))
          setContacts(cleaned)
        }
      } catch (err) {
        console.error('Failed to fetch contacts, using defaults', err)
      }
    }
    fetchContacts()
  }, [])

  const handleCopyHandle = (e, link, id) => {
    e.preventDefault()
    e.stopPropagation()
    const handle = link.replace('https://t.me/', '@')
    navigator.clipboard.writeText(handle)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleOpenDirectMessage = (e) => {
    e.preventDefault()
    const topicLabels = {
      accounts: lang === 'en' ? 'Account Inquiry / Order' : 'Вопрос по аккаунтам / Заказ',
      replacement: lang === 'en' ? 'Account Replacement Request' : 'Запрос на замену аккаунта',
      launch: lang === 'en' ? 'Turnkey Ad Launch Consultation' : 'Консультация по запуску рекламы',
      training: lang === 'en' ? 'Media Buying Training' : 'Обучение арбитражу трафика',
      wholesale: lang === 'en' ? 'Wholesale & B2B Inquiry' : 'Оптовый заказ / Сотрудничество',
    }

    const prefilled = encodeURIComponent(
      `👋 ${topicLabels[supportTopic] || 'Запрос в поддержку'}\n${supportText ? `\nДетали: ${supportText}` : ''}`
    )
    window.open(`https://t.me/mediabuy_adm?text=${prefilled}`, '_blank')
  }

  return (
    <PageShell title={lang === 'en' ? 'Official Contacts & Support' : 'Контакты и Служба Поддержки'}>
      <div className="space-y-5">
        {/* HERO SECURITY BANNER */}
        <div className="relative overflow-hidden rounded-3xl border border-cyan-400/40 bg-gradient-to-br from-[#0c234a] via-[#09122c] to-[#040817] p-5 shadow-[0_0_30px_rgba(56,189,248,0.2)]">
          <div className="flex items-start gap-3.5 relative z-10">
            <ShieldCheck size={26} className="text-slate-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-emerald-400/40 bg-emerald-950 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-300">
                  {lang === 'en' ? 'Verified Official Contacts' : 'Верифицированные Контакты'}
                </span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <h3 className="text-base font-black text-white leading-snug">
                {lang === 'en' ? 'Anti-Phishing & Verified Team Safety' : 'Защита от подделок и безопасность сделок'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {lang === 'en'
                  ? 'All account purchases, consultations, and turnkey ad launches are conducted exclusively through our verified Telegram accounts below.'
                  : 'Покупка аккаунтов, поддержка, консультации и оформление услуг осуществляются строго через официальные Telegram-контакты нашей команды.'}
              </p>
            </div>
          </div>
        </div>

        {/* OFFICIAL COMPANY REGISTRATION BANNER */}
        <div className="relative overflow-hidden rounded-3xl border border-amber-400/50 bg-gradient-to-r from-[#211a08] via-[#14122e] to-[#081330] p-4 shadow-[0_0_25px_rgba(251,191,36,0.2)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
            <div className="flex items-center gap-3.5">
              <Building2 size={26} className="text-slate-400 shrink-0" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="rounded bg-amber-950 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-amber-300 border border-amber-400/40">
                    {lang === 'en' ? 'Official Company Registration' : 'Официальная Регистрация'}
                  </span>
                </div>
                <h3 className="mt-1 text-sm font-black text-white">
                  {lang === 'en' ? 'We are an officially registered company' : 'Мы официальная компания'}
                </h3>
                <p className="mt-0.5 text-xs text-slate-300">
                  {lang === 'en'
                    ? 'Officially registered in the UK Government Companies House database (№ 10549229).'
                    : 'Официально зарегистрированы в гос. реестре Великобритании Companies House (№ 10549229).'}
                </p>
              </div>
            </div>

            <a
              href={OFFICIAL_COMPANY_REGISTRY_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 px-4 py-2.5 text-xs font-black text-slate-950 shadow-[0_0_15px_rgba(251,191,36,0.4)] transition hover:opacity-95 active:scale-95 shrink-0"
            >
              <Globe2 size={16} />
              <span>{lang === 'en' ? 'Verify in Companies House' : 'Реестр Companies House'}</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* WORK HOURS & SLA METRICS */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="rounded-2xl border border-cyan-400/25 bg-[#09122c]/90 p-3 text-center">
            <UserCheck size={18} className="mx-auto text-emerald-400 mb-1" />
            <p className="text-[10px] text-slate-400 font-bold uppercase">{lang === 'en' ? 'Work Schedule' : 'Режим работы'}</p>
            <p className="text-xs font-black text-white mt-0.5">24 / 7 {lang === 'en' ? 'Online' : 'Онлайн'}</p>
          </div>

          <div className="rounded-2xl border border-cyan-400/25 bg-[#09122c]/90 p-3 text-center">
            <Zap size={18} className="mx-auto text-amber-400 mb-1" />
            <p className="text-[10px] text-slate-400 font-bold uppercase">{lang === 'en' ? 'Guarantees' : 'Замена & Гарантия'}</p>
            <p className="text-xs font-black text-white mt-0.5">24 {lang === 'en' ? 'Hours Replacement' : 'Часа на проверку'}</p>
          </div>
        </div>

        {/* CONTACT CARDS LIST */}
        <div className="space-y-3">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
            <Headphones size={15} className="text-cyan-400" />
            <span>{lang === 'en' ? 'Official Team & Support Channels' : 'Официальная команда и саппорт'}</span>
          </h4>

          <div className="grid grid-cols-1 gap-2.5">
            {contacts.map((contact) => {
              const isChannel = contact.kind === 'channel'
              const titleLower = (contact.title || '').toLowerCase()
              const isAdm = titleLower.includes('админ') || titleLower.includes('admin')
              const handle = contact.link.replace('https://t.me/', '@')
              const isCopied = copiedId === contact.id

              return (
                <div
                  key={contact.id}
                  className="group relative flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-cyan-400/30 bg-gradient-to-r from-[#0d214a] via-[#09122c] to-[#040817] p-4 shadow-md transition hover:border-cyan-300 hover:shadow-[0_0_20px_rgba(56,189,248,0.25)] gap-3"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="shrink-0 text-slate-400">
                      {isChannel ? (
                        <Megaphone size={24} />
                      ) : isAdm ? (
                        <ShieldCheck size={24} />
                      ) : (
                        <MessageSquare size={24} />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-white group-hover:text-cyan-200 transition">
                          {(lang === 'en' && contact.title_en) ? contact.title_en : contact.title}
                        </h4>
                        {isChannel ? (
                          <span className="rounded bg-cyan-950 px-2 py-0.5 text-[9px] font-extrabold text-cyan-300 border border-cyan-400/30">
                            {lang === 'en' ? 'Official Channel' : 'Официальный Канал'}
                          </span>
                        ) : isAdm ? (
                          <span className="rounded bg-emerald-950 px-2 py-0.5 text-[9px] font-extrabold text-emerald-300 border border-emerald-400/30">
                            {lang === 'en' ? 'Main Admin' : 'Главный Админ'}
                          </span>
                        ) : (
                          <span className="rounded bg-slate-900 px-2 py-0.5 text-[9px] font-bold text-slate-300 border border-slate-700">
                            {lang === 'en' ? 'Manager' : 'Менеджер'}
                          </span>
                        )}
                      </div>

                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-cyan-300">{handle}</span>
                        <button
                          onClick={(e) => handleCopyHandle(e, contact.link, contact.id)}
                          className="flex items-center gap-1 rounded bg-black/50 px-1.5 py-0.5 text-[10px] font-bold text-slate-300 border border-slate-800 hover:border-cyan-400/50 hover:text-cyan-300 transition"
                          title="Copy Telegram Handle"
                        >
                          {isCopied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                          <span>{isCopied ? (lang === 'en' ? 'Copied!' : 'Скопировано!') : (lang === 'en' ? 'Copy' : 'Копировать')}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <a
                    href={contact.link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-cyan-400/40 bg-cyan-950/80 px-4 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-900 hover:border-cyan-300 active:scale-95 transition"
                  >
                    <span>
                      {isChannel
                        ? (lang === 'en' ? 'Open Telegram Channel' : 'Перейти в Telegram Channel')
                        : (lang === 'en' ? 'Open Chat' : 'Написать в Telegram')}
                    </span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              )
            })}
          </div>
        </div>

        {/* QUICK DIRECT MESSAGE ASSISTANT FORM */}
        <div className="rounded-3xl border border-cyan-400/35 bg-gradient-to-br from-[#0e1f48] via-[#09122c] to-[#040817] p-5 shadow-lg space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-cyan-300" />
            <h4 className="text-sm font-black text-white">
              {lang === 'en' ? 'Quick Support Request' : 'Быстрое обращение в поддержку'}
            </h4>
          </div>
          <p className="text-xs text-slate-300">
            {lang === 'en'
              ? 'Select your topic and click below to open a prefilled chat with our main administrator:'
              : 'Выберите тему обращения для отправки готового запроса главному администратору в Telegram:'}
          </p>

          <div className="space-y-2">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                {lang === 'en' ? 'Select Subject / Topic:' : 'Тема обращения:'}
              </label>
              <select
                value={supportTopic}
                onChange={(e) => setSupportTopic(e.target.value)}
                className="w-full rounded-xl border border-cyan-500/30 bg-[#040817] px-3 py-2 text-xs font-bold text-cyan-300 focus:border-cyan-300 focus:outline-none"
              >
                <option value="accounts">{lang === 'en' ? '🛒 Account Purchase / Selection' : '🛒 Покупка и подбор аккаунтов'}</option>
                <option value="replacement">{lang === 'en' ? '🛡️ Account Replacement Request' : '🛡️ Замена / Проблема с аккаунтом'}</option>
                <option value="launch">{lang === 'en' ? '🚀 Turnkey Ad Launch Setup' : '🚀 Запуск рекламы под ключ'}</option>
                <option value="training">{lang === 'en' ? '🎓 Media Buying Training' : '🎓 Обучение арбитражу трафика'}</option>
                <option value="wholesale">{lang === 'en' ? '💼 Wholesale / B2B Partnership' : '💼 Оптовые закупки и сотрудничество'}</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                {lang === 'en' ? 'Additional Details (Optional):' : 'Дополнительные детали (по желанию):'}
              </label>
              <input
                type="text"
                value={supportText}
                onChange={(e) => setSupportText(e.target.value)}
                placeholder={lang === 'en' ? 'e.g., Needed 10 FB King accounts with cookies...' : 'например, нужно 10 штук FB King с прогретыми пикселями...'}
                className="w-full rounded-xl border border-cyan-500/30 bg-[#040817] px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-300 focus:outline-none"
              />
            </div>

            <button
              onClick={handleOpenDirectMessage}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 py-3 text-xs font-black text-slate-950 shadow-[0_0_15px_rgba(56,189,248,0.35)] hover:opacity-90 active:scale-95 transition"
            >
              <Send size={15} />
              <span>{lang === 'en' ? 'Send Message via Telegram' : 'Отправить сообщение в Telegram'}</span>
            </button>
          </div>
        </div>

        {/* ANTI-SCAM RULES & GUIDELINES */}
        <div className="rounded-2xl border border-amber-500/40 bg-amber-950/20 p-4 space-y-2">
          <div className="flex items-center gap-2 text-amber-300 font-extrabold text-xs">
            <AlertTriangle size={18} className="shrink-0" />
            <span>{lang === 'en' ? 'Official Security Warning & Anti-Scam Rules' : 'Правила безопасности и защита от мошенников'}</span>
          </div>

          <ul className="text-[11px] text-amber-200/90 space-y-1.5 list-disc pl-4 leading-relaxed">
            <li>
              {lang === 'en'
                ? 'Always verify the exact Telegram handle in username info. Main Admin: @mediabuy_adm'
                : 'Всегда проверяйте точный username в профиле собеседника. Главный Админ: @mediabuy_adm'}
            </li>
            <li>
              {lang === 'en'
                ? 'Our team will NEVER message you first offering crypto transfers or manual payments outside the app.'
                : 'Наши менеджеры никогда не пишут первыми с предложением перевести деньги на сторонние реквизиты.'}
            </li>
            <li>
              {lang === 'en'
                ? 'Use only our official Telegram bot and Mini App for order generation and automated verification.'
                : 'Используйте только наш официальный Telegram Mini App для генерации счетов и автоматической проверки.'}
            </li>
          </ul>
        </div>
      </div>
    </PageShell>
  )
}
