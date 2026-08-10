import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { generateTOTP, getSecondsRemaining } from '../utils/totp.js'
import { checkBinInfo, KNOWN_BINS } from '../utils/binChecker.js'
import {
  KeyRound,
  CreditCard,
  BookOpen,
  Copy,
  Check,
  Zap,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Search,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

export default function HomeToolsBanners({ initialExpanded = false }) {
  const navigate = useNavigate()
  const { lang } = useLanguage()
  const [isExpanded, setIsExpanded] = useState(initialExpanded)

  // 2FA LIVE MINI-STATE
  const [userSavedKeys] = useState(() => {
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

  const [secretKey, setSecretKey] = useState('')
  const [totpCode, setTotpCode] = useState('')
  const [secondsLeft, setSecondsLeft] = useState(30)
  const [copiedTotp, setCopiedTotp] = useState(false)

  // BIN CHECKER LIVE MINI-STATE
  const [binInput, setBinInput] = useState('415609')
  const [binResult, setBinResult] = useState(null)

  // Mobile active tab when in single view
  const [activeTab, setActiveTab] = useState('2fa') // '2fa' | 'bin' | 'checklist'

  // Generate 2FA code and countdown timer
  useEffect(() => {
    let isMounted = true

    const updateCode = async () => {
      if (secretKey && secretKey.trim()) {
        const code = await generateTOTP(secretKey.trim())
        if (isMounted) {
          setTotpCode(code || '')
          setSecondsLeft(getSecondsRemaining())
        }
      } else {
        if (isMounted) {
          setTotpCode('')
          setSecondsLeft(30)
        }
      }
    }

    updateCode()
    const interval = setInterval(() => {
      const remaining = getSecondsRemaining()
      if (isMounted) {
        setSecondsLeft(remaining)
        if (remaining === 30 || remaining === 29) {
          updateCode()
        }
      }
    }, 1000)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [secretKey])

  // Update BIN result
  useEffect(() => {
    if (binInput.length >= 6) {
      setBinResult(checkBinInfo(binInput))
    } else {
      setBinResult(null)
    }
  }, [binInput])

  const handleCopyTotp = () => {
    if (totpCode && totpCode !== '------') {
      navigator.clipboard.writeText(totpCode)
      setCopiedTotp(true)
      setTimeout(() => setCopiedTotp(false), 2000)
    }
  }

  return (
    <section className="my-5 min-w-0">
      {/* SECTION TITLE */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <Zap size={20} className="text-slate-400 shrink-0" />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base md:text-lg font-black text-white tracking-tight truncate">
                {lang === 'en' ? 'Professional Media Buyer Suite' : 'Утилиты Арбитражника & Чекеры'}
              </h3>
              <span className="hidden xs:inline-flex rounded-full bg-cyan-400/20 px-2 py-0.5 text-[9px] font-black text-cyan-300 border border-cyan-400/40 shrink-0">
                100% Free
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 truncate">
              {lang === 'en'
                ? 'Instant 2FA generator, live card BIN checker & launch manual'
                : 'Генератор 2FA, чекер БИНов и чеклисты залива'}
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
                : (lang === 'en' ? 'Open Suite (3 Tools)' : 'Открыть утилиты (3 шт)')}
            </span>
            {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>

          <button
            onClick={() => navigate('/tools')}
            className="hidden md:flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-cyan-300 transition"
          >
            <span>{lang === 'en' ? 'Full Suite' : 'Все утилиты'}</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* COMPACT PREVIEW BAR (WHEN COLLAPSED) */}
      {!isExpanded && (
        <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-[#061833] via-[#081f3d] to-[#040f21] p-3 sm:p-3.5 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* 3 QUICK TOOLS PILLS */}
            <div className="grid grid-cols-1 sm:flex sm:items-center gap-2">
              {/* 2FA PREVIEW PILL */}
              <button
                onClick={() => {
                  setActiveTab('2fa')
                  setIsExpanded(true)
                }}
                className="flex items-center justify-between sm:justify-start gap-2 rounded-xl bg-black/50 px-3 py-1.5 border border-cyan-500/30 hover:border-cyan-400 transition"
              >
                <div className="flex items-center gap-1.5">
                  <KeyRound size={13} className="text-cyan-400" />
                  <span className="text-xs font-bold text-slate-200">2FA Generator</span>
                </div>
                <span className="font-mono text-xs font-black text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-400/30">
                  {totpCode || '------'}
                </span>
              </button>

              {/* BIN CHECKER PREVIEW PILL */}
              <button
                onClick={() => {
                  setActiveTab('bin')
                  setIsExpanded(true)
                }}
                className="flex items-center justify-between sm:justify-start gap-2 rounded-xl bg-black/50 px-3 py-1.5 border border-emerald-500/30 hover:border-emerald-400 transition"
              >
                <div className="flex items-center gap-1.5">
                  <CreditCard size={13} className="text-emerald-400" />
                  <span className="text-xs font-bold text-slate-200">BIN Checker</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-400/30">
                  415609 (US)
                </span>
              </button>

              {/* CHECKLIST PREVIEW PILL */}
              <button
                onClick={() => {
                  setActiveTab('checklist')
                  setIsExpanded(true)
                }}
                className="flex items-center justify-between sm:justify-start gap-2 rounded-xl bg-black/50 px-3 py-1.5 border border-amber-500/30 hover:border-amber-400 transition"
              >
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-amber-400" />
                  <span className="text-xs font-bold text-slate-200">{lang === 'en' ? 'Preflight Check' : 'Чек-лист залива'}</span>
                </div>
                <span className="text-[10px] font-bold text-amber-300">6 {lang === 'en' ? 'steps' : 'шагов'}</span>
              </button>
            </div>

            {/* EXPAND ACTION */}
            <button
              onClick={() => setIsExpanded(true)}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-cyan-500/20 px-3 py-1.5 text-xs font-bold text-cyan-300 border border-cyan-400/30 hover:bg-cyan-500/30 transition shrink-0"
            >
              <Sparkles size={13} className="text-cyan-400" />
              <span>{lang === 'en' ? 'Open Live Tools' : 'Развернуть онлайн чекеры'}</span>
              <ChevronDown size={14} />
            </button>
          </div>
        </div>
      )}

      {/* FULL EXPANDED 3 BANNERS GRID */}
      {isExpanded && (
        <div className="space-y-3">
          {/* MOBILE TAB SELECTOR */}
          <div className="flex sm:hidden items-center gap-1 bg-black/40 p-1 rounded-xl border border-cyan-500/20">
            <button
              onClick={() => setActiveTab('2fa')}
              className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg transition ${
                activeTab === '2fa' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40' : 'text-slate-400'
              }`}
            >
              2FA
            </button>
            <button
              onClick={() => setActiveTab('bin')}
              className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg transition ${
                activeTab === 'bin' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40' : 'text-slate-400'
              }`}
            >
              BIN Checker
            </button>
            <button
              onClick={() => setActiveTab('checklist')}
              className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg transition ${
                activeTab === 'checklist' ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40' : 'text-slate-400'
              }`}
            >
              {lang === 'en' ? 'Checklist' : 'Чек-лист'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 min-w-0 animate-in fade-in duration-300">
            {/* BANNER 1: 2FA TOTP GENERATOR */}
            <div className={`relative overflow-hidden rounded-2xl border border-cyan-400/40 bg-gradient-to-br from-[#061833] via-[#091838] to-[#040a1c] p-4 shadow-[0_0_20px_rgba(56,189,248,0.15)] flex flex-col justify-between transition duration-200 hover:border-cyan-300 ${
              activeTab !== '2fa' ? 'hidden sm:flex' : 'flex'
            }`}>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <KeyRound size={18} className="text-slate-400 shrink-0" />
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-wider text-cyan-400 block">
                        {lang === 'en' ? 'Live Utility' : 'Онлайн Утилита'}
                      </span>
                      <h4 className="text-xs sm:text-sm font-black text-white leading-tight">
                        {lang === 'en' ? '2FA Code Generator' : 'Генератор кодов 2FA'}
                      </h4>
                    </div>
                  </div>

                  <span className="rounded-full bg-cyan-950 px-2 py-0.5 text-[9px] font-black text-cyan-300 border border-cyan-400/30">
                    TOTP 30s
                  </span>
                </div>

                <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
                  {lang === 'en'
                    ? 'Instant 6-digit codes for Facebook, Google and TikTok accounts.'
                    : 'Мгновенная генерация 6-значных кодов подтверждения по TOTP ключу.'}
                </p>

                {/* LIVE CODE DISPLAY BOX */}
                <div className="rounded-xl border border-cyan-400/30 bg-black/60 p-3 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                      <Clock size={11} className="text-cyan-400" /> {lang === 'en' ? 'Refresh in:' : 'Обновление:'}{' '}
                      {totpCode ? `${secondsLeft}с` : '30с'}
                    </span>
                    {totpCode ? (
                      <div className="h-1.5 w-14 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-1000"
                          style={{ width: `${(secondsLeft / 30) * 100}%` }}
                        />
                      </div>
                    ) : null}
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="font-mono text-xl sm:text-2xl font-black tracking-widest text-cyan-300 [text-shadow:0_0_12px_rgba(56,189,248,0.6)] select-all">
                      {totpCode ? `${totpCode.slice(0, 3)} ${totpCode.slice(3)}` : '------'}
                    </div>

                    {totpCode ? (
                      <button
                        onClick={handleCopyTotp}
                        className="flex items-center gap-1 rounded-xl bg-cyan-400/20 px-2.5 py-1.5 text-xs font-bold text-cyan-300 border border-cyan-400/40 hover:bg-cyan-400/30 transition active:scale-95"
                      >
                        {copiedTotp ? (
                          <>
                            <Check size={13} className="text-emerald-400" />
                            <span>{lang === 'en' ? 'Copied' : 'Скопировано'}</span>
                          </>
                        ) : (
                          <>
                            <Copy size={13} />
                            <span>{lang === 'en' ? 'Copy' : 'Код'}</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="text-[10px] font-semibold text-slate-400 bg-slate-900/90 px-2 py-1 rounded-lg border border-slate-800">
                        {lang === 'en' ? 'Enter key' : 'Введите ключ'}
                      </span>
                    )}
                  </div>

                  {/* QUICK INPUT FOR 2FA KEY */}
                  <div className="space-y-1.5 pt-0.5">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={secretKey}
                        onChange={(e) => setSecretKey(e.target.value.replace(/\s+/g, '').toUpperCase())}
                        placeholder={lang === 'en' ? 'Paste Base32 2FA Key...' : 'Вставьте 2FA ключ...'}
                        className="w-full rounded-lg border border-cyan-500/30 bg-[#040817] px-2.5 py-1.5 text-[11px] font-mono font-bold text-cyan-200 placeholder-slate-600 focus:border-cyan-300 focus:outline-none"
                      />
                      {secretKey && (
                        <button
                          onClick={() => setSecretKey('')}
                          className="shrink-0 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-[10px] font-bold text-slate-300 hover:border-cyan-400"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* USER SAVED KEYS IF ANY */}
                    {userSavedKeys.length > 0 ? (
                      <div className="flex flex-wrap items-center gap-1 pt-1 text-[10px] text-slate-400">
                        <span className="text-[9px] uppercase font-bold">{lang === 'en' ? 'My keys:' : 'Мои:'}</span>
                        {userSavedKeys.slice(0, 3).map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSecretKey(item.key)}
                            className={`px-1.5 py-0.5 rounded border text-[10px] max-w-[90px] truncate ${
                              secretKey === item.key
                                ? 'border-cyan-400 bg-cyan-950 text-cyan-300'
                                : 'border-slate-800 bg-black/40 hover:text-white'
                            }`}
                            title={item.name}
                          >
                            {item.name}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10px] text-slate-500 leading-tight">
                        {lang === 'en' ? 'Each user has their own 2FA key.' : 'У каждого пользователя свой личный 2FA ключ.'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/tools?tab=2fa')}
                className="mt-3 flex items-center justify-center gap-1 w-full rounded-xl border border-cyan-400/40 bg-cyan-950/80 py-2 text-xs font-bold text-cyan-200 hover:bg-cyan-900 transition active:scale-95"
              >
                <span>{lang === 'en' ? 'Open 2FA Tool' : 'Открыть генератор 2FA'}</span>
                <ExternalLink size={12} />
              </button>
            </div>

            {/* BANNER 2: CARD BIN CHECKER */}
            <div className={`relative overflow-hidden rounded-2xl border border-emerald-400/40 bg-gradient-to-br from-[#041d15] via-[#07241c] to-[#020d09] p-4 shadow-[0_0_20px_rgba(16,185,129,0.15)] flex flex-col justify-between transition duration-200 hover:border-emerald-300 ${
              activeTab !== 'bin' ? 'hidden sm:flex' : 'flex'
            }`}>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <CreditCard size={18} className="text-slate-400 shrink-0" />
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-wider text-emerald-400 block">
                        {lang === 'en' ? 'Card Validator' : 'Чекер БИНов Карт'}
                      </span>
                      <h4 className="text-xs sm:text-sm font-black text-white leading-tight">
                        {lang === 'en' ? 'Ad BIN Checker' : 'Проверка БИНа для Рекламы'}
                      </h4>
                    </div>
                  </div>

                  <span className="rounded-full bg-emerald-950 px-2 py-0.5 text-[9px] font-black text-emerald-300 border border-emerald-400/30">
                    FB / TT / Google
                  </span>
                </div>

                <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
                  {lang === 'en'
                    ? 'Check bank, card type & ad platform pass rate to prevent Risk Payment.'
                    : 'Проверка банка и проходимости в кабинетах без риска Risk Payment.'}
                </p>

                {/* LIVE BIN SEARCH INPUT & RESULT */}
                <div className="rounded-xl border border-emerald-400/30 bg-black/60 p-3 space-y-2">
                  <div className="flex items-center gap-2 rounded-lg bg-black/80 border border-emerald-500/30 px-2.5 py-1">
                    <Search size={13} className="text-emerald-400 shrink-0" />
                    <input
                      type="text"
                      maxLength={6}
                      value={binInput}
                      onChange={(e) => setBinInput(e.target.value.replace(/\D/g, ''))}
                      placeholder="415609"
                      className="w-full bg-transparent font-mono text-xs font-bold text-white placeholder-slate-500 focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-400 font-mono">6 {lang === 'en' ? 'digits' : 'цифр'}</span>
                  </div>

                  {/* RESULT BADGE */}
                  {binResult ? (
                    <div className="flex items-center justify-between rounded-lg bg-emerald-950/70 p-1.5 border border-emerald-500/30 text-xs">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-sm">{binResult.flag}</span>
                        <div className="min-w-0">
                          <span className="font-bold text-emerald-200 block truncate text-[11px]">{binResult.bank}</span>
                          <span className="text-[9px] text-slate-400">{binResult.brand} • {binResult.type}</span>
                        </div>
                      </div>
                      <span className="shrink-0 rounded bg-emerald-500/20 px-1 py-0.5 text-[9px] font-black text-emerald-300">
                        100% Траст
                      </span>
                    </div>
                  ) : (
                    <div className="text-[10px] text-slate-400 py-0.5 text-center">
                      {lang === 'en' ? 'Enter first 6 digits of card' : 'Введите первые 6 цифр карты'}
                    </div>
                  )}

                  {/* QUICK BIN TAGS */}
                  <div className="flex items-center gap-1 pt-0.5 text-[10px]">
                    <span className="text-[9px] uppercase font-bold text-slate-400">БИН:</span>
                    {['415609', '559900', '532959'].map((b) => (
                      <button
                        key={b}
                        onClick={() => setBinInput(b)}
                        className="px-1.5 py-0.5 rounded border border-emerald-500/30 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900 font-mono text-[10px]"
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/tools?tab=bins')}
                className="mt-3 flex items-center justify-center gap-1 w-full rounded-xl border border-emerald-400/40 bg-emerald-950/80 py-2 text-xs font-bold text-emerald-200 hover:bg-emerald-900 transition active:scale-95"
              >
                <span>{lang === 'en' ? 'Open BIN Checker' : 'Открыть чекер БИНов'}</span>
                <ExternalLink size={12} />
              </button>
            </div>

            {/* BANNER 3: ARBITRAGE PLAYBOOK & PRE-FLIGHT CHECKLIST */}
            <div className={`relative overflow-hidden rounded-2xl border border-amber-400/40 bg-gradient-to-br from-[#241703] via-[#1a1204] to-[#0a0702] p-4 shadow-[0_0_20px_rgba(251,191,36,0.15)] flex flex-col justify-between transition duration-200 hover:border-amber-300 md:col-span-2 lg:col-span-1 ${
              activeTab !== 'checklist' ? 'hidden sm:flex' : 'flex'
            }`}>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <BookOpen size={18} className="text-slate-400 shrink-0" />
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-wider text-amber-400 block">
                        {lang === 'en' ? 'Knowledge Hub' : 'База Знаний & Чеклисты'}
                      </span>
                      <h4 className="text-xs sm:text-sm font-black text-white leading-tight">
                        {lang === 'en' ? 'Anti-Ban Playbooks' : 'Мануалы & Чеклист Запуска'}
                      </h4>
                    </div>
                  </div>

                  <span className="rounded-full bg-amber-950 px-2 py-0.5 text-[9px] font-black text-amber-300 border border-amber-400/30">
                    PDF + Scripts
                  </span>
                </div>

                <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
                  {lang === 'en'
                    ? 'Step-by-step instructions for BM transfer, cookies, pixels & support appeals.'
                    : 'Пошаговые алгоритмы передачи БМ, импорта куки, прогрева и апелляций.'}
                </p>

                {/* CHECKLIST HIGHLIGHT PREVIEW */}
                <div className="rounded-xl border border-amber-400/30 bg-black/60 p-3 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase text-amber-300 tracking-wider">
                    <span className="flex items-center gap-1">
                      <ShieldCheck size={12} className="text-emerald-400" />
                      {lang === 'en' ? 'Preflight Checklist' : 'Чек-лист перед заливом'}
                    </span>
                    <span className="text-emerald-400">6 {lang === 'en' ? 'Steps' : 'Пунктов'}</span>
                  </div>

                  <ul className="space-y-1 text-[10px] sm:text-[11px] text-slate-200">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                      <span className="truncate">{lang === 'en' ? 'Dedicated proxy & Whoer trust test' : 'Прокси подключен и проверен'}</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                      <span className="truncate">{lang === 'en' ? '2FA secret key verified in generator' : '2FA секрет проверен в генераторе'}</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                      <span className="truncate">{lang === 'en' ? 'Card BIN matched with ad country' : 'БИН карты проверен под гео'}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <button
                onClick={() => navigate('/tools?tab=knowledge')}
                className="mt-3 flex items-center justify-center gap-1 w-full rounded-xl border border-amber-400/40 bg-amber-950/80 py-2 text-xs font-bold text-amber-200 hover:bg-amber-900 transition active:scale-95"
              >
                <span>{lang === 'en' ? 'Read Knowledge Base' : 'Читать Базу Знаний'}</span>
                <ExternalLink size={12} />
              </button>
            </div>
          </div>

          <div className="flex justify-center pt-1">
            <button
              onClick={() => setIsExpanded(false)}
              className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-cyan-300 transition py-1 px-3"
            >
              <span>{lang === 'en' ? 'Collapse suite' : 'Свернуть блок утилит'}</span>
              <ChevronUp size={14} />
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
