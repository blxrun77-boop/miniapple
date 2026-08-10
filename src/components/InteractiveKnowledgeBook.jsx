import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Bookmark,
  Zap,
  KeyRound,
  CreditCard,
  Layers,
  ArrowRight,
  Copy,
  Check
} from 'lucide-react'

const BOOK_CHAPTERS = [
  {
    id: 'ch1',
    chapterNum: 1,
    icon: KeyRound,
    color: 'from-cyan-400 to-blue-500',
    borderColor: 'border-cyan-400/40',
    bgBadge: 'bg-cyan-950/80 text-cyan-300 border-cyan-400/40',
    title: 'Фарминг Facebook & Вход по 2FA',
    title_en: 'Facebook Farming & Safe 2FA Login',
    subtitle: 'Как входить в аккаунты без вылета на селфи и чекпоинты',
    subtitle_en: 'How to log into accounts without triggering selfie checkpoints',
    readingTime: '3 мин',
    readingTime_en: '3 min read',
    takeaways: [
      'Импортируйте куки в антидетект перед первым открытием браузера',
      'Генерируйте 6-значный 2FA код через наш генератор по TOTP ключу',
      'Дайте отлежаться профилю 1-2 часа перед привязкой карт и БМ',
      'Используйте мобильные или статические резидентские прокси того же гео'
    ],
    takeaways_en: [
      'Import JSON cookies into anti-detect before launching browser session',
      'Generate instant 6-digit 2FA codes via our built-in TOTP generator',
      'Let the profile rest 1-2 hours before attaching bank cards or BMs',
      'Strictly use mobile or static ISP proxies matching account GEO'
    ],
    proTip: 'Никогда не меняйте пароль в первые сутки после покупки — это 100% триггер фрода.',
    proTip_en: 'Never change password in the first 24 hours — this triggers instant security flags.',
    toolLink: '/tools?tab=2fa',
    toolName: 'Генератор 2FA',
    toolName_en: '2FA Generator'
  },
  {
    id: 'ch2',
    chapterNum: 2,
    icon: CreditCard,
    color: 'from-emerald-400 to-teal-500',
    borderColor: 'border-emerald-400/40',
    bgBadge: 'bg-emerald-950/80 text-emerald-300 border-emerald-400/40',
    title: 'Подбор БИНов Карт & Платежки',
    title_en: 'Card BIN Selection & Payment Setups',
    subtitle: 'Устранение ошибки Suspicious Payment и Risk Payment',
    subtitle_en: 'Eliminating Suspicious Payment and Risk Payment errors',
    readingTime: '4 мин',
    readingTime_en: '4 min read',
    takeaways: [
      'Проверяйте БИН через Чекер БИНов перед выпуском виртуальной карты',
      'Для аккаунтов US лучше всего подходят БИНы 415609 (PST) и 440802 (EPN)',
      'Для Европы и TikTok используйте Brocard (559900) и Wallester (532959)',
      'Устанавливайте лимит на карте на $1-$2 выше суммы тестового списания'
    ],
    takeaways_en: [
      'Verify card BIN through our BIN Checker before issuing virtual cards',
      'For US accounts, BINs 415609 (PST) and 440802 (EPN) deliver top pass rates',
      'For Europe & TikTok use Brocard (559900) or Wallester (532959)',
      'Set card spending limits $1-$2 higher than initial auth transaction'
    ],
    proTip: 'БИН карты должен соответствовать гео биллинга или быть универсальным коммерческим кредитным.',
    proTip_en: 'Card BIN must match the billing country or belong to universal commercial credit pool.',
    toolLink: '/tools?tab=bins',
    toolName: 'Чекер БИНов',
    toolName_en: 'BIN Checker'
  },
  {
    id: 'ch3',
    chapterNum: 3,
    icon: Layers,
    color: 'from-amber-400 to-orange-500',
    borderColor: 'border-amber-400/40',
    bgBadge: 'bg-amber-950/80 text-amber-300 border-amber-400/40',
    title: 'Настройка Прокси в Dolphin & AdsPower',
    title_en: 'Proxy Setup in Dolphin & AdsPower',
    subtitle: 'Конфигурация HTTP/SOCKS5 и ротация IP без утечек WebRTC',
    subtitle_en: 'Configuring HTTP/SOCKS5 & IP rotation with zero WebRTC leaks',
    readingTime: '3 мин',
    readingTime_en: '3 min read',
    takeaways: [
      'Используйте протокол SOCKS5 для минимального пинга и стабильности сокетов',
      'Вставляйте ссылку для смены IP в поле «Change IP URL» в браузере',
      'Проверяйте профиль на pixelscan.net — показатель должен быть 100% Trust',
      'Не используйте бесплатные VPN и датацентровые прокси для соцсетей'
    ],
    takeaways_en: [
      'Prefer SOCKS5 protocol for low latency and socket stability',
      'Insert rotation API endpoint into "Change IP URL" field in browser profile',
      'Test fingerprint on pixelscan.net — aim for 100% Trust score',
      'Never use free VPNs or datacenter IPs on tier-1 ad platforms'
    ],
    proTip: 'Ротируйте IP перед каждым открытием нового рекламного кабинета.',
    proTip_en: 'Rotate IP before switching between different ad accounts.',
    toolLink: '/catalog?filter=proxies',
    toolName: 'Купить Прокси',
    toolName_en: 'Buy Proxies'
  },
  {
    id: 'ch4',
    chapterNum: 4,
    icon: Sparkles,
    color: 'from-purple-400 to-pink-500',
    borderColor: 'border-purple-400/40',
    bgBadge: 'bg-purple-950/80 text-purple-300 border-purple-400/40',
    title: 'TikTok Ads Agency & Uncapped Спенд',
    title_en: 'TikTok Ads Agency & Uncapped Scaling',
    subtitle: 'Запуск рекламы без суточных холдов и передача прав в BC',
    subtitle_en: 'Launching without daily hold limits and BC permission transfer',
    readingTime: '5 мин',
    readingTime_en: '5 min read',
    takeaways: [
      'Принимайте инвайт в Business Center строго через чистый гео-прокси',
      'Назначайте права администратора на рабочий профиль TikTok',
      'Прогревайте видео-креативы плавным поднятием суточного бюджета',
      'Используйте локальные часовые пояса для синхронизации расписания показа'
    ],
    takeaways_en: [
      'Accept Business Center invitation strictly through matching dedicated proxy',
      'Assign Administrator rights to your warmed TikTok management profile',
      'Warm video creatives with gradual budget increases over 48 hours',
      'Set target timezone to match creative schedule delivery'
    ],
    proTip: 'Агентские аккаунты не подвержены холдам $20/день и стартуют сразу на полном объеме.',
    proTip_en: 'Agency accounts bypass $20/day limits and scale to full volume immediately.',
    toolLink: '/product/102',
    toolName: 'TikTok Launch Kit',
    toolName_en: 'TikTok Launch Kit'
  },
  {
    id: 'ch5',
    chapterNum: 5,
    icon: ShieldCheck,
    color: 'from-rose-400 to-amber-500',
    borderColor: 'border-rose-400/40',
    bgBadge: 'bg-rose-950/80 text-rose-300 border-rose-400/40',
    title: 'Прохождение ПЗРД & Шаблоны Апелляций',
    title_en: 'PZRD Unban Algorithms & Support Appeals',
    subtitle: 'Готовые скрипты общения с поддержкой и разбан кабинетов',
    subtitle_en: 'Ready support dialogue scripts and account unban procedures',
    readingTime: '4 мин',
    readingTime_en: '4 min read',
    takeaways: [
      'Используйте качественные фото документов с естественным освещением',
      'Имя в документе должно на 100% совпадать с ФИО в профиле аккаунта',
      'Подавайте тикет строго с того же антидетект профиля и IP',
      'Используйте нейтральный вежливый тон без агрессии в переписке'
    ],
    takeaways_en: [
      'Use high resolution photo documents with natural soft lighting',
      'Document full name must match account profile details exactly',
      'Submit appeal ticket strictly from the original browser profile & IP',
      'Use polite, professional tone when responding to support agents'
    ],
    proTip: 'Текст апелляции: «Здравствуйте! Кабинет заблокирован автоматическим алгоритмом по ошибке. Рекламная деятельность ведется строго по правилам. Прошу провести ручную проверку.»',
    proTip_en: 'Appeal template: "Hello! My account was flagged in error by automated filters. All campaigns strictly comply with policy. Please conduct a manual review."',
    toolLink: '/tools?tab=knowledge',
    toolName: 'Шаблоны Апелляций',
    toolName_en: 'Appeal Templates'
  }
]

export default function InteractiveKnowledgeBook({ initialExpanded = false }) {
  const navigate = useNavigate()
  const { lang } = useLanguage()
  const [activeChapterIndex, setActiveChapterIndex] = useState(0)
  const [copiedTip, setCopiedTip] = useState(false)
  const [bookmarkedChapters, setBookmarkedChapters] = useState({})
  const [isExpanded, setIsExpanded] = useState(initialExpanded)

  const chapter = BOOK_CHAPTERS[activeChapterIndex]

  const handleCopyTip = (text) => {
    navigator.clipboard.writeText(text)
    setCopiedTip(true)
    setTimeout(() => setCopiedTip(false), 2000)
  }

  const toggleBookmark = (id) => {
    setBookmarkedChapters((prev) => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  return (
    <section className="my-5 min-w-0">
      {/* SECTION HEADER */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <BookOpen size={20} className="text-slate-400 shrink-0" />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base md:text-lg font-black text-white tracking-tight truncate">
                {lang === 'en' ? 'Interactive Media Buying Book' : 'Интерактивная Книга Арбитража'}
              </h3>
              <span className="hidden xs:inline-flex rounded-full bg-cyan-400/20 px-2 py-0.5 text-[9px] font-black text-cyan-300 border border-cyan-400/40 shrink-0">
                5 {lang === 'en' ? 'Chapters' : 'Глав'}
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 truncate">
              {lang === 'en'
                ? 'Practical cheat-sheets, anti-ban algorithms & setups'
                : 'Чеклисты, алгоритмы защиты от банов и мануалы'}
            </p>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 rounded-xl border border-cyan-400/40 bg-cyan-950/70 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-900 transition active:scale-95 shadow-sm"
          >
            <span>
              {isExpanded
                ? (lang === 'en' ? 'Collapse' : 'Свернуть')
                : (lang === 'en' ? 'Open Book' : 'Читать книгу')}
            </span>
            {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>

          <button
            onClick={() => navigate('/tools')}
            className="hidden md:flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-cyan-300 transition"
          >
            <span>{lang === 'en' ? 'Knowledge Hub' : 'Вся база'}</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* COMPACT VIEW (WHEN COLLAPSED) */}
      {!isExpanded && (
        <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-[#071329] via-[#091838] to-[#050e1f] p-3 sm:p-3.5 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* 5 CHAPTER QUICK PILLS */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {BOOK_CHAPTERS.map((ch, idx) => (
                <button
                  key={ch.id}
                  onClick={() => {
                    setActiveChapterIndex(idx)
                    setIsExpanded(true)
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-black/50 px-2.5 py-1.5 border border-cyan-500/20 hover:border-cyan-400/60 hover:bg-cyan-950/60 transition shrink-0"
                >
                  <span className="flex h-4 w-4 items-center justify-center rounded bg-cyan-400 text-slate-950 text-[9px] font-black">
                    {ch.chapterNum}
                  </span>
                  <span className="text-[11px] font-bold text-slate-200 truncate max-w-[130px]">
                    {lang === 'en' ? ch.title_en.split('&')[0] : ch.title.split('&')[0]}
                  </span>
                </button>
              ))}
            </div>

            {/* EXPAND ACTION */}
            <button
              onClick={() => setIsExpanded(true)}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-cyan-500/20 px-3 py-1.5 text-xs font-bold text-cyan-300 border border-cyan-400/30 hover:bg-cyan-500/30 transition shrink-0"
            >
              <Sparkles size={13} className="text-cyan-400" />
              <span>{lang === 'en' ? 'Read Chapters & Pro-Tips' : 'Открыть мануалы и фишки'}</span>
              <ChevronDown size={14} />
            </button>
          </div>
        </div>
      )}

      {/* FULL EXPANDED 3D BOOK CONTAINER */}
      {isExpanded && (
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-[#06132b] via-[#091538] to-[#04091a] p-4 sm:p-5 shadow-[0_0_30px_rgba(56,189,248,0.15)] animate-in fade-in duration-300">
          {/* AMBIENT BACKGROUND GLOW */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />

          {/* TOP CHAPTER TABS */}
          <div className="relative z-10 mb-4 flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-cyan-500/20">
            {BOOK_CHAPTERS.map((ch, idx) => {
              const isActive = idx === activeChapterIndex
              const isBookmarked = bookmarkedChapters[ch.id]

              return (
                <button
                  key={ch.id}
                  onClick={() => setActiveChapterIndex(idx)}
                  className={`shrink-0 flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-cyan-400/20 text-cyan-200 border border-cyan-400/50 shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                      : 'bg-black/40 text-slate-400 border border-slate-800 hover:border-cyan-500/30 hover:text-slate-200'
                  }`}
                >
                  <span className={`flex h-4 w-4 items-center justify-center rounded text-[10px] font-black ${
                    isActive ? 'bg-cyan-400 text-slate-950' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {ch.chapterNum}
                  </span>
                  <span className="hidden sm:inline">
                    {lang === 'en' ? ch.title_en : ch.title}
                  </span>
                  <span className="sm:hidden">
                    {lang === 'en' ? `Ch. ${ch.chapterNum}` : `Гл. ${ch.chapterNum}`}
                  </span>
                  {isBookmarked && (
                    <Bookmark size={11} className="fill-amber-400 text-amber-400" />
                  )}
                </button>
              )
            })}
          </div>

          {/* ACTIVE CHAPTER CONTENT */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* LEFT COLUMN: CHAPTER COVER / METADATA */}
            <div className="lg:col-span-4 rounded-xl border border-cyan-400/25 bg-black/50 p-3.5 sm:p-4 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-wider border ${chapter.bgBadge}`}>
                    <Sparkles size={11} />
                    {lang === 'en' ? `Chapter ${chapter.chapterNum}` : `Глава ${chapter.chapterNum}`}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 font-semibold">
                      {lang === 'en' ? chapter.readingTime_en : chapter.readingTime}
                    </span>
                    <button
                      onClick={() => toggleBookmark(chapter.id)}
                      title={lang === 'en' ? 'Bookmark chapter' : 'Добавить в закладки'}
                      className="p-1 rounded hover:bg-white/10 transition"
                    >
                      <Bookmark
                        size={13}
                        className={bookmarkedChapters[chapter.id] ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}
                      />
                    </button>
                  </div>
                </div>

                <h4 className="text-sm sm:text-base font-black text-white leading-snug break-words">
                  {lang === 'en' ? chapter.title_en : chapter.title}
                </h4>

                <p className="mt-1 text-xs text-slate-300 leading-relaxed break-words">
                  {lang === 'en' ? chapter.subtitle_en : chapter.subtitle}
                </p>
              </div>

              {/* QUICK PRO-TIP IN LEFT COL */}
              <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1">
                    <Zap size={12} className="text-amber-400" />
                    {lang === 'en' ? 'Pro-Tip:' : 'Лайфхак арбитражника:'}
                  </span>
                  <button
                    onClick={() => handleCopyTip(lang === 'en' ? chapter.proTip_en : chapter.proTip)}
                    className="flex items-center gap-1 text-[10px] font-bold text-amber-400 hover:text-amber-300"
                  >
                    {copiedTip ? <Check size={11} /> : <Copy size={11} />}
                    <span>{copiedTip ? (lang === 'en' ? 'Copied' : 'Скопировано') : (lang === 'en' ? 'Copy' : 'Копия')}</span>
                  </button>
                </div>
                <p className="text-[11px] text-amber-100/90 leading-relaxed break-words">
                  {lang === 'en' ? chapter.proTip_en : chapter.proTip}
                </p>
              </div>

              {/* LINK TO RELEVANT TOOL */}
              <button
                onClick={() => navigate(chapter.toolLink)}
                className="flex items-center justify-between w-full rounded-xl border border-cyan-400/40 bg-cyan-950/60 px-3 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-900 transition"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <ExternalLink size={13} className="text-cyan-400 shrink-0" />
                  <span className="truncate">{lang === 'en' ? chapter.toolName_en : chapter.toolName}</span>
                </div>
                <ArrowRight size={13} className="shrink-0" />
              </button>
            </div>

            {/* RIGHT COLUMN: ACTIONABLE TAKEAWAYS */}
            <div className="lg:col-span-8 rounded-xl border border-cyan-400/25 bg-black/40 p-3.5 sm:p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
                <span className="text-xs font-black uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-cyan-400" />
                  {lang === 'en' ? 'Key Action Steps & Anti-Ban Rules:' : 'Ключевые правила и чеклист главы:'}
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  {activeChapterIndex + 1} / {BOOK_CHAPTERS.length}
                </span>
              </div>

              <div className="space-y-2">
                {(lang === 'en' ? chapter.takeaways_en : chapter.takeaways).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 rounded-lg bg-cyan-950/20 p-2 sm:p-2.5 border border-cyan-500/10 text-xs sm:text-sm text-slate-200"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-cyan-400/20 text-cyan-300 text-[10px] font-black mt-0.5 border border-cyan-400/30">
                      {idx + 1}
                    </span>
                    <span className="leading-snug break-words">{item}</span>
                  </div>
                ))}
              </div>

              {/* BOTTOM NAVIGATION (PREV / NEXT CHAPTER) */}
              <div className="flex items-center justify-between pt-2 border-t border-cyan-500/20">
                <button
                  onClick={() => setActiveChapterIndex((prev) => (prev > 0 ? prev - 1 : BOOK_CHAPTERS.length - 1))}
                  className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900/80 px-2.5 py-1.5 text-xs font-bold text-slate-300 hover:border-cyan-400 hover:text-cyan-300 transition"
                >
                  <ChevronLeft size={14} />
                  <span>{lang === 'en' ? 'Prev Chapter' : 'Пред. глава'}</span>
                </button>

                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-xs font-bold text-slate-400 hover:text-cyan-300 transition px-2 py-1"
                >
                  {lang === 'en' ? 'Collapse' : 'Свернуть'}
                </button>

                <button
                  onClick={() => setActiveChapterIndex((prev) => (prev + 1) % BOOK_CHAPTERS.length)}
                  className="flex items-center gap-1 rounded-lg border border-cyan-400/40 bg-cyan-950/80 px-2.5 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-900 transition"
                >
                  <span>{lang === 'en' ? 'Next Chapter' : 'След. глава'}</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
