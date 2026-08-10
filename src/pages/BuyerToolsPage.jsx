import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { generateTOTP, getSecondsRemaining } from '../utils/totp.js'
import { checkBinInfo, KNOWN_BINS } from '../utils/binChecker.js'
import {
  BookOpen,
  KeyRound,
  CreditCard,
  Copy,
  Check,
  Search,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Zap,
  Info,
  CheckSquare,
  Square,
  RotateCcw,
  Plus,
  Trash2
} from 'lucide-react'

const KNOWLEDGE_GUIDES = [
  {
    id: 'bm-transfer',
    title: 'Передача прав Business Manager (BM) без риска бана',
    title_en: 'Safe Business Manager (BM) Ownership Transfer',
    category: 'Facebook Ads',
    summary: 'Пошаговый алгоритм передачи БМ с Кинга на рабочий фарм без триггера системы безопасности.',
    summary_en: 'Step-by-step procedure to transfer BM from King farm to worker profile without security checkpoints.',
    steps: [
      'Откройте настройки компании (Business Settings) -> вкладка «Люди» -> нажать «Добавить».',
      'Укажите email второго аккаунта (рабочего фарма) и назначьте полные права Администратора.',
      'Откройте ссылку приглашения в антидетект-браузере (AdsPower / Dolphin {anty}) строго в чистом профиле с резидентским прокси.',
      'Подтвердите приглашение и дайте отлежаться аккаунту 24 часа перед созданием пикселей и добавлением карт.',
      'Привяжите резервного администратора на случай случайного вылета основного фарма.'
    ],
    steps_en: [
      'Open Business Settings -> People -> Click "Add".',
      'Enter the email of the secondary worker farm account and assign Full Admin access.',
      'Open the invitation URL in the anti-detect browser (AdsPower / Dolphin) with a dedicated residential proxy.',
      'Accept the invite and let the account rest for 24h before creating pixels or attaching cards.',
      'Attach a backup administrator in case the primary farm hits a checkpoint.'
    ]
  },
  {
    id: 'cookies-import',
    title: 'Импорт Cookies в Anti-Detect браузеры (AdsPower, Dolphin)',
    title_en: 'Cookie Import & Anti-Detect Browser Setup (AdsPower, Dolphin)',
    category: 'Setup & Farming',
    summary: 'Инструкция по загрузке файлов куки (JSON / Netscape) и настройке отпечатка браузера.',
    summary_en: 'Manual on loading cookie files (JSON / Netscape) and configuring browser fingerprints.',
    steps: [
      'Скачайте полученный при покупке файл cookies (.json или .txt формат).',
      'В Dolphin {anty} или AdsPower нажмите «Создать профиль» -> раздел «Cookies / Куки».',
      'Вставьте текстовое содержимое файла или перетащите файл в поле импорта.',
      'Укажите тип прокси (HTTP / SOCKS5) и проверьте соединение («Check Proxy»).',
      'Запустите профиль и перейдите на mbasic.facebook.com или facebook.com без ручного ввода логина/пароля.'
    ],
    steps_en: [
      'Download the purchased cookies file (.json or .txt format).',
      'In Dolphin {anty} or AdsPower click "Create Profile" -> "Cookies".',
      'Paste the text content or drop the JSON file into the import area.',
      'Set proxy type (HTTP/SOCKS5) and click "Check Proxy" to ensure low fraud score.',
      'Start profile and navigate directly to facebook.com/mbasic without typing credentials.'
    ]
  },
  {
    id: 'fanpage-warmup',
    title: 'Правильный прогрев FanPage & Пикселя (3-дневный план)',
    title_en: 'Proper FanPage & Pixel Warmup (3-Day Step Plan)',
    category: 'Facebook & TikTok',
    summary: '3-дневный прогрев страницы и пикселя для предотвращения микро-банов при первом спенде.',
    summary_en: '3-day structured warmup strategy for new FanPages and Pixels to avoid micro-bans on first billings.',
    steps: [
      'День 1: Заполните описание, аватар и обложку FP. Опубликуйте 3 нейтральных поста с фото.',
      'День 2: Запустите кампанию «Вовлеченность для публикации» на $1-$2 в сутки на нейтральный пост.',
      'День 3: Создайте Pixel в Events Manager, установите код на WhitePage/лендинг и сделайте 5-10 тестовых кликов.',
      'День 4: После первого успешного биллинга ($2-$5) переходите к запуску целевой конверсионной кампании.'
    ],
    steps_en: [
      'Day 1: Fill out bio, avatar, and cover image. Publish 3 neutral niche posts with photos.',
      'Day 2: Launch an "Engagement / Page Likes" campaign at $1-$2/day targeting a neutral post.',
      'Day 3: Create Pixel in Events Manager, install code on WhitePage, simulate 5-10 test events.',
      'Day 4: Once the first auto-bill of $2-$5 clears smoothly, scale into target Conversion ads.'
    ]
  },
  {
    id: 'unban-pzrd',
    title: 'Алгоритм прохождения ПЗРД и шаблоны апелляций',
    title_en: 'PZRD Unban Algorithm & Support Appeal Templates',
    category: 'Appeals & Unban',
    summary: 'Шаблоны официальных обращений в саппорт и правила генерации селфи/документов.',
    summary_en: 'Official support appeal templates and photo ID verification guidelines.',
    steps: [
      'Используйте качественный генератор ID/паспорта с натуральными тенями и мягкими углами.',
      'Имя в документе должно на 100% совпадать с именем в профиле соцсети.',
      'Подавайте форму проверки строго с того же резидентского прокси и браузерного профиля.',
      'Текст апелляции: «Здравствуйте! Мой аккаунт заблокирован по ошибке автоматического алгоритма. Я строго следую политике рекламы и прошу проверить документы вручную.»'
    ],
    steps_en: [
      'Use high quality document generators with natural shadows and realistic metadata.',
      'The name on the document must exactly match the full name on the social account.',
      'Submit the review appeal strictly through the original dedicated residential proxy.',
      'Appeal text: "Hello! My ad account was restricted due to automated system error. I strictly adhere to all ad policies. Please conduct a manual review of my verification documents."'
    ]
  }
]

const PREFLIGHT_CHECKLIST = [
  { id: 'c1', title: 'Прокси подключен и проверен на Whoer/Pixelscan (Fraud Score < 15%)', title_en: 'Proxy connected & verified on Whoer/Pixelscan (Fraud score < 15%)' },
  { id: 'c2', title: 'Куки импортированы без ошибок, сессия в аккаунте активна', title_en: 'Cookies imported properly, active session confirmed' },
  { id: 'c3', title: '2FA секретный ключ проверен в генераторе и резервные коды сохранены', title_en: '2FA secret key verified in generator & backup codes saved' },
  { id: 'c4', title: 'FanPage создана, оформлена и имеет минимум 2 публикации', title_en: 'FanPage created, styled and contains at least 2 posts' },
  { id: 'c5', title: 'БИН банковской карты проверен и совместим с выбранным гео кабинета', title_en: 'Card BIN checked and verified compatible with account GEO' },
  { id: 'c6', title: 'WhitePage и домен проверены на соответствие правилам рекламы', title_en: 'WhitePage & domain verified compliant with ad policy' }
]

export default function BuyerToolsPage() {
  const { lang } = useLanguage()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    const tabParam = params.get('tab')
    if (tabParam === '2fa' || tabParam === 'bins' || tabParam === 'knowledge') {
      return tabParam
    }
    return 'knowledge'
  })

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const tabParam = params.get('tab')
    if (tabParam && (tabParam === '2fa' || tabParam === 'bins' || tabParam === 'knowledge')) {
      setActiveTab(tabParam)
    }
  }, [location.search])

  // Interactive Checklist State
  const [checkedSteps, setCheckedSteps] = useState({})
  const [preflightState, setPreflightState] = useState({})

  // 2FA TOTP State
  const [secretInput, setSecretInput] = useState('')
  const [totpCode, setTotpCode] = useState('')
  const [secondsLeft, setSecondsLeft] = useState(30)
  const [copiedTotp, setCopiedTotp] = useState(false)
  const [savedKeys, setSavedKeys] = useState(() => {
    try {
      const stored = localStorage.getItem('mediabuy_saved_2fa_keys')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (k) => k && k.key && k.key !== 'JBSWY3DPEHPK3PXP' && k.key !== 'HXDMVJECJJWSRB3H'
          )
        }
      }
      return []
    } catch {
      return []
    }
  })
  const [newKeyName, setNewKeyName] = useState('')
  const [newKeyValue, setNewKeyValue] = useState('')
  const [showAddKey, setShowAddKey] = useState(false)

  // BIN Checker State
  const [binInput, setBinInput] = useState('415609')
  const [binResult, setBinResult] = useState(null)

  // Expanded Guides State
  const [expandedGuideId, setExpandedGuideId] = useState('bm-transfer')

  // Effect for 2FA TOTP code generator timer
  useEffect(() => {
    let timer

    const updateTOTP = async () => {
      const remaining = getSecondsRemaining(30)
      setSecondsLeft(remaining)
      if (secretInput.trim()) {
        const code = await generateTOTP(secretInput.trim())
        if (code) setTotpCode(code)
      } else {
        setTotpCode('')
      }
    }

    updateTOTP()
    timer = setInterval(updateTOTP, 1000)

    return () => clearInterval(timer)
  }, [secretInput])

  // Effect for BIN lookup
  useEffect(() => {
    if (binInput) {
      const res = checkBinInfo(binInput)
      setBinResult(res)
    } else {
      setBinResult(null)
    }
  }, [binInput])

  const handleCopyTotp = () => {
    if (!totpCode) return
    navigator.clipboard.writeText(totpCode)
    setCopiedTotp(true)
    setTimeout(() => setCopiedTotp(false), 2000)
  }

  const toggleStep = (guideId, stepIdx) => {
    const key = `${guideId}-${stepIdx}`
    setCheckedSteps((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const togglePreflight = (id) => {
    setPreflightState((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleSaveNewKey = () => {
    if (!newKeyName.trim() || !newKeyValue.trim()) return
    const updated = [...savedKeys, { name: newKeyName.trim(), key: newKeyValue.trim() }]
    setSavedKeys(updated)
    localStorage.setItem('mediabuy_saved_2fa_keys', JSON.stringify(updated))
    setNewKeyName('')
    setNewKeyValue('')
    setShowAddKey(false)
  }

  const handleDeleteKey = (idx) => {
    const updated = savedKeys.filter((_, i) => i !== idx)
    setSavedKeys(updated)
    localStorage.setItem('mediabuy_saved_2fa_keys', JSON.stringify(updated))
  }

  const preflightCompletedCount = Object.values(preflightState).filter(Boolean).length

  return (
    <PageShell title={lang === 'en' ? 'Value-Add Buyer Tools & Knowledge' : 'База Знаний & Инструменты Байера'}>
      <div className="space-y-4">
        {/* TOP TAB NAVIGATION */}
        <div className="grid grid-cols-3 gap-1.5 rounded-2xl border border-cyan-400/30 bg-[#060c20] p-1.5 shadow-md">
          <button
            onClick={() => setActiveTab('knowledge')}
            className={`flex items-center justify-center gap-1.5 rounded-xl py-2 px-1 text-center text-xs font-black transition ${
              activeTab === 'knowledge'
                ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-[0_0_15px_rgba(56,189,248,0.35)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen size={15} />
            <span className="truncate">{lang === 'en' ? 'Guides & Checklists' : 'Гайды & Чеклисты'}</span>
          </button>

          <button
            onClick={() => setActiveTab('2fa')}
            className={`flex items-center justify-center gap-1.5 rounded-xl py-2 px-1 text-center text-xs font-black transition ${
              activeTab === '2fa'
                ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-[0_0_15px_rgba(56,189,248,0.35)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <KeyRound size={15} />
            <span className="truncate">{lang === 'en' ? '2FA Generator' : 'Генератор 2FA'}</span>
          </button>

          <button
            onClick={() => setActiveTab('bin')}
            className={`flex items-center justify-center gap-1.5 rounded-xl py-2 px-1 text-center text-xs font-black transition ${
              activeTab === 'bin'
                ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-[0_0_15px_rgba(56,189,248,0.35)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CreditCard size={15} />
            <span className="truncate">{lang === 'en' ? 'BIN Checker' : 'Чекер БИН карт'}</span>
          </button>
        </div>

        {/* TAB 1: KNOWLEDGE BASE & INTERACTIVE GUIDES */}
        {activeTab === 'knowledge' && (
          <div className="space-y-4">
            {/* HERO BANNER */}
            <div className="rounded-3xl border border-cyan-400/40 bg-gradient-to-r from-[#0d214a] via-[#09122c] to-[#040817] p-4.5 shadow-lg">
              <div className="flex items-start gap-3">
                <BookOpen size={24} className="text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-base font-black text-white">
                    {lang === 'en' ? 'Media Buying Knowledge Base & Safe Launch Manuals' : 'База Знаний и Интерактивные Чеклисты Прогрева'}
                  </h3>
                  <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                    {lang === 'en'
                      ? 'Step-by-step guides for BM ownership transfer, anti-detect cookie imports (AdsPower, Dolphin{anty}), FanPage warming, and PZRD unbans. Complete checklists to eliminate launch bans!'
                      : 'Пошаговые мануалы по передаче прав BM, импорту куки в браузеры (AdsPower, Dolphin{anty}), 3-дневному прогреву FanPage и прохождению ПЗРД. Отмечайте чекбоксы по ходу запуска!'}
                  </p>
                </div>
              </div>
            </div>

            {/* PRE-FLIGHT CHECKLIST COMPONENT */}
            <div className="rounded-3xl border border-emerald-400/40 bg-gradient-to-br from-[#061e16] via-[#0a1738] to-[#040817] p-4.5 shadow-md space-y-3">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-400/40 text-xs font-black">
                    ✓
                  </span>
                  <h4 className="text-xs font-black uppercase tracking-wider text-emerald-300">
                    {lang === 'en' ? 'Pre-Flight Ad Launch Checklist' : 'Интерактивный Чек-лист перед запуском'}
                  </h4>
                </div>
                <span className="rounded-full bg-emerald-950 px-2.5 py-0.5 text-[10px] font-black text-emerald-300 border border-emerald-400/30">
                  {preflightCompletedCount} / {PREFLIGHT_CHECKLIST.length} {lang === 'en' ? 'done' : 'готово'}
                </span>
              </div>

              <div className="space-y-2">
                {PREFLIGHT_CHECKLIST.map((item) => {
                  const isChecked = !!preflightState[item.id]
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => togglePreflight(item.id)}
                      className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition active:scale-[0.99] ${
                        isChecked
                          ? 'border-emerald-400/50 bg-emerald-950/40 text-white shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                          : 'border-slate-800 bg-black/40 text-slate-300 hover:border-emerald-500/30'
                      }`}
                    >
                      <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border transition ${
                        isChecked ? 'bg-emerald-400 text-slate-950 border-emerald-300' : 'border-slate-600 bg-slate-900'
                      }`}>
                        {isChecked && <Check size={14} strokeWidth={3} />}
                      </div>
                      <span className={`text-xs ${isChecked ? 'font-bold text-emerald-200 line-through opacity-90' : 'font-medium'}`}>
                        {lang === 'en' ? item.title_en : item.title}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* EXPANDABLE STEP-BY-STEP GUIDES */}
            <div className="space-y-3">
              {KNOWLEDGE_GUIDES.map((guide) => {
                const isExpanded = expandedGuideId === guide.id
                return (
                  <div
                    key={guide.id}
                    className="overflow-hidden rounded-3xl border border-cyan-400/30 bg-[#09122c]/95 transition hover:border-cyan-400/60 shadow-md"
                  >
                    <button
                      onClick={() => setExpandedGuideId(isExpanded ? null : guide.id)}
                      className="flex w-full items-center justify-between p-4 text-left"
                    >
                      <div className="space-y-1.5 pr-2">
                        <span className="rounded-md bg-cyan-950 px-2 py-0.5 text-[9px] font-black uppercase text-cyan-300 border border-cyan-400/30">
                          {guide.category}
                        </span>
                        <h4 className="text-sm font-extrabold text-white leading-snug">
                          {lang === 'en' ? guide.title_en : guide.title}
                        </h4>
                        <p className="text-xs text-slate-300">{lang === 'en' ? guide.summary_en : guide.summary}</p>
                      </div>
                      <div className="flex shrink-0 items-center justify-center text-slate-400">
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="border-t border-cyan-500/20 bg-[#040817] p-4.5 space-y-3 text-xs">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-cyan-300 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                            <Sparkles size={12} />
                            {lang === 'en' ? 'Interactive Step-by-Step Algorithm:' : 'Интерактивный пошаговый алгоритм:'}
                          </p>
                          <span className="text-[10px] text-slate-400">
                            {lang === 'en' ? 'Click step to check off' : 'Кликните пункт для отметки'}
                          </span>
                        </div>

                        <div className="space-y-2">
                          {(lang === 'en' ? guide.steps_en : guide.steps).map((step, idx) => {
                            const stepKey = `${guide.id}-${idx}`
                            const isStepChecked = !!checkedSteps[stepKey]

                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => toggleStep(guide.id, idx)}
                                className={`flex w-full items-start gap-2.5 rounded-2xl border p-3 text-left transition ${
                                  isStepChecked
                                    ? 'border-emerald-400/40 bg-emerald-950/30 text-emerald-200'
                                    : 'border-slate-800 bg-[#081024] text-slate-200 hover:border-slate-700'
                                }`}
                              >
                                <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] font-black ${
                                  isStepChecked
                                    ? 'bg-emerald-400 text-slate-950'
                                    : 'bg-cyan-950 text-cyan-300 border border-cyan-500/30'
                                }`}>
                                  {isStepChecked ? <Check size={12} strokeWidth={3} /> : idx + 1}
                                </span>
                                <span className={`leading-relaxed text-xs ${isStepChecked ? 'line-through opacity-80' : ''}`}>
                                  {step}
                                </span>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* TAB 2: 2FA TOTP GENERATOR */}
        {activeTab === '2fa' && (
          <div className="space-y-4">
            <div className="rounded-3xl border border-cyan-400/40 bg-gradient-to-br from-[#0e1a3e] via-[#09122c] to-[#040817] p-5 shadow-lg space-y-4">
              <div className="flex items-center gap-3">
                <KeyRound size={24} className="text-slate-400 shrink-0" />
                <div>
                  <h3 className="text-base font-black text-white">
                    {lang === 'en' ? 'Online 2FA Code Generator (TOTP / RFC 6238)' : 'Онлайн Генератор 2FA-кодов (TOTP)'}
                  </h3>
                  <p className="text-xs text-slate-300 leading-snug">
                    {lang === 'en'
                      ? 'Generate 6-digit one-time authorization codes for purchased Facebook, Google & TikTok accounts in real-time.'
                      : 'Мгновенная генерация 6-значных кодов авторизации для купленных аккаунтов прямо в приложении.'}
                  </p>
                </div>
              </div>

              {/* INPUT FORM */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  {lang === 'en' ? '2FA Secret Key (Base32):' : 'Вставьте секретный 2FA ключ (Base32):'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={secretInput}
                    onChange={(e) => setSecretInput(e.target.value.replace(/\s+/g, '').toUpperCase())}
                    placeholder={
                      lang === 'en'
                        ? 'e.g. JBSWY3DPEHPK3PXP (from your account data)'
                        : 'Например, JBSWY3DPEHPK3PXP (из строки купленного аккаунта)'
                    }
                    className="w-full rounded-2xl border border-cyan-500/30 bg-[#040817] px-4 py-3 text-xs font-mono font-bold text-cyan-200 placeholder-slate-600 focus:border-cyan-300 focus:outline-none shadow-inner"
                  />
                  {secretInput && (
                    <button
                      onClick={() => setSecretInput('')}
                      className="shrink-0 rounded-2xl border border-slate-700 bg-slate-900 px-3 py-3 text-xs font-bold text-slate-300 hover:border-cyan-400"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* GENERATED TOTP DISPLAY CARD */}
              <div className="rounded-3xl border border-emerald-400/40 bg-gradient-to-br from-[#061d15] via-[#091533] to-[#040817] p-6 text-center space-y-3 relative overflow-hidden shadow-xl">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                  {lang === 'en' ? 'Current 6-Digit 2FA Security Code' : 'Текущий 6-значный код безопасности 2FA'}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-widest drop-shadow-[0_0_20px_rgba(16,185,129,0.6)] select-all">
                    {totpCode ? `${totpCode.slice(0, 3)} ${totpCode.slice(3)}` : '------'}
                  </span>

                  {totpCode ? (
                    <button
                      onClick={handleCopyTotp}
                      className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 px-5 py-3 text-xs font-black text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:opacity-95 active:scale-95 transition"
                    >
                      {copiedTotp ? <Check size={18} strokeWidth={3} /> : <Copy size={18} />}
                      <span>{copiedTotp ? (lang === 'en' ? 'Copied!' : 'Скопировано!') : (lang === 'en' ? 'Copy Code' : 'Скопировать код')}</span>
                    </button>
                  ) : (
                    <span className="text-xs font-medium text-slate-400 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800">
                      {lang === 'en' ? 'Waiting for 2FA key...' : 'Ожидание ввода ключа...'}
                    </span>
                  )}
                </div>

                {!totpCode && (
                  <p className="text-xs text-slate-400 pt-1">
                    {lang === 'en'
                      ? 'Paste your account 2FA secret key in the field above to start generating authorization codes.'
                      : 'Вставьте секретный Base32 2FA-ключ из данных вашего аккаунта выше, чтобы генерировать разовые коды.'}
                  </p>
                )}

                {/* COUNTDOWN TIMER */}
                {totpCode ? (
                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                      <span className="flex items-center gap-1">
                        <Clock size={13} className="text-emerald-400" />
                        {lang === 'en' ? 'Next code rotation in:' : 'Обновление кода через:'}
                      </span>
                      <span className="text-emerald-300 font-mono font-extrabold">{secondsLeft}s</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 transition-all duration-1000"
                        style={{ width: `${(secondsLeft / 30) * 100}%` }}
                      />
                    </div>
                  </div>
                ) : null}
              </div>

              {/* SAVED KEYS / PRESETS */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-black uppercase tracking-wider text-cyan-300">
                    {lang === 'en' ? 'Saved Account 2FA Keys:' : 'Сохраненные 2FA ключи аккаунтов:'}
                  </p>
                  <button
                    onClick={() => setShowAddKey(!showAddKey)}
                    className="flex items-center gap-1 rounded-xl bg-cyan-950 px-2.5 py-1 text-[10px] font-bold text-cyan-300 border border-cyan-400/40 hover:bg-cyan-900"
                  >
                    <Plus size={13} /> {lang === 'en' ? 'Add Key' : 'Добавить ключ'}
                  </button>
                </div>

                {showAddKey && (
                  <div className="rounded-2xl border border-cyan-400/40 bg-black/60 p-3.5 space-y-2.5">
                    <input
                      type="text"
                      placeholder={lang === 'en' ? 'Account label (e.g. FB Farm #3)' : 'Название аккаунта (например, FB Farm #3)'}
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-[#040817] px-3 py-2 text-xs text-white"
                    />
                    <input
                      type="text"
                      placeholder={lang === 'en' ? 'Secret Key (Base32)' : 'Секретный ключ (Base32)'}
                      value={newKeyValue}
                      onChange={(e) => setNewKeyValue(e.target.value.replace(/\s+/g, '').toUpperCase())}
                      className="w-full rounded-xl border border-slate-800 bg-[#040817] px-3 py-2 text-xs font-mono text-cyan-200"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveNewKey}
                        className="flex-1 rounded-xl bg-cyan-400 py-2 text-xs font-black text-slate-950 hover:bg-cyan-300"
                      >
                        {lang === 'en' ? 'Save Key' : 'Сохранить ключ'}
                      </button>
                      <button
                        onClick={() => setShowAddKey(false)}
                        className="rounded-xl border border-slate-700 px-3 py-2 text-xs text-slate-400"
                      >
                        {lang === 'en' ? 'Cancel' : 'Отмена'}
                      </button>
                    </div>
                  </div>
                )}

                {savedKeys.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-800 bg-[#040817]/60 p-4 text-center">
                    <p className="text-xs text-slate-400">
                      {lang === 'en'
                        ? 'No saved 2FA keys. Click "+ Add Key" to save secret keys for quick one-click code generation.'
                        : 'У вас пока нет сохраненных 2FA ключей. Нажмите «+ Добавить ключ», чтобы сохранить секретные ключи ваших аккаунтов для быстрого доступа.'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {savedKeys.map((item, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center justify-between rounded-2xl border p-3 transition ${
                          secretInput === item.key
                            ? 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_12px_rgba(56,189,248,0.2)]'
                            : 'border-slate-800 bg-[#040817] hover:border-cyan-400/40'
                        }`}
                      >
                        <button
                          onClick={() => setSecretInput(item.key)}
                          className="text-left min-w-0 flex-1"
                        >
                          <p className="text-xs font-bold text-white truncate">{item.name}</p>
                          <p className="text-[10px] font-mono text-cyan-400 truncate">{item.key}</p>
                        </button>
                        <button
                          onClick={() => handleDeleteKey(idx)}
                          className="ml-2 p-1.5 text-slate-500 hover:text-rose-400"
                          title={lang === 'en' ? 'Delete' : 'Удалить'}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BIN CHECKER */}
        {activeTab === 'bin' && (
          <div className="space-y-4">
            <div className="rounded-3xl border border-cyan-400/40 bg-gradient-to-br from-[#0e1a3e] via-[#09122c] to-[#040817] p-5 shadow-lg space-y-4">
              <div className="flex items-center gap-3">
                <CreditCard size={24} className="text-slate-400 shrink-0" />
                <div>
                  <h3 className="text-base font-black text-white">
                    {lang === 'en' ? 'Media Buying Card BIN Checker & Compatibility' : 'Чекер БИН карт для арбитража трафика'}
                  </h3>
                  <p className="text-xs text-slate-300 leading-snug">
                    {lang === 'en'
                      ? 'Instant verification of first 6 digits of virtual bank cards. Check compatibility with Facebook, Google, TikTok Ads & anti-ban rating.'
                      : 'Быстрая проверка первых 6 цифр карты на совместимость с Facebook, Google, TikTok Ads и проходимость биллинга без Risk Payment.'}
                  </p>
                </div>
              </div>

              {/* BIN INPUT */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  {lang === 'en' ? 'Enter First 6 Digits of Card (BIN):' : 'Внесите первые 6 цифр карты (БИН):'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={binInput}
                    onChange={(e) => setBinInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 415609"
                    className="w-full rounded-2xl border border-cyan-500/30 bg-[#040817] px-4 py-3 text-sm font-mono font-extrabold text-cyan-200 placeholder-slate-600 focus:border-cyan-300 focus:outline-none"
                  />
                  <div className="flex gap-1">
                    {['415609', '559900', '532959', '440802'].map((preset) => (
                      <button
                        key={preset}
                        onClick={() => setBinInput(preset)}
                        className="rounded-xl border border-slate-800 bg-black/40 px-2.5 py-2 text-[10px] font-mono font-bold text-slate-300 hover:border-cyan-400 active:scale-95"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* BIN RESULT CARD */}
              {binResult && (
                <div className="rounded-3xl border border-cyan-400/50 bg-[#040817] p-4.5 space-y-3.5 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{binResult.flag}</span>
                      <div>
                        <h4 className="text-base font-black text-white">{binResult.bank}</h4>
                        <p className="text-xs text-slate-400">{binResult.countryName} ({binResult.country})</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block rounded-lg bg-cyan-950 px-2.5 py-1 text-xs font-extrabold text-cyan-300 border border-cyan-400/40">
                        {binResult.brand} {binResult.type}
                      </span>
                      <p className="text-[10px] text-amber-300 font-bold mt-1">Рейтинг: {binResult.rating}</p>
                    </div>
                  </div>

                  {/* PLATFORM COMPATIBILITY METRICS */}
                  <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
                    <div className="rounded-2xl border border-cyan-500/20 bg-[#08132e] p-3 space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Facebook Ads</p>
                      <p className="text-xs font-black text-emerald-400">
                        {binResult.fb ? '✔ Высокий проход' : '⚠ Средний'}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-cyan-500/20 bg-[#08132e] p-3 space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Google Ads</p>
                      <p className="text-xs font-black text-emerald-400">
                        {binResult.google ? '✔ Высокий проход' : '⚠ Требует 3DS'}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-cyan-500/20 bg-[#08132e] p-3 space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">TikTok Ads</p>
                      <p className="text-xs font-black text-emerald-400">
                        {binResult.tiktok ? '✔ Высокий проход' : '⚠ Средний'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* POPULAR MEDIA BUYING BINS DIRECTORY */}
              <div className="space-y-2.5 pt-2">
                <p className="text-xs font-black uppercase tracking-wider text-cyan-300">
                  {lang === 'en' ? 'Verified Arbitrage Virtual Card Issuers & BINs:' : 'Проверенные сервисы платежек и БИНы:'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {KNOWN_BINS.map((b) => (
                    <button
                      key={b.bin}
                      onClick={() => setBinInput(b.bin)}
                      className="flex items-center justify-between rounded-2xl border border-slate-800 bg-[#040817] p-3 text-left hover:border-cyan-400/50 transition active:scale-[0.99]"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-xl shrink-0">{b.flag}</span>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">{b.bank}</p>
                          <p className="text-[10px] font-mono text-cyan-300">BIN: {b.bin} ({b.brand})</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-amber-300 shrink-0">{b.rating}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  )
}
