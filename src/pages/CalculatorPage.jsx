import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'
import PageShell from '../components/PageShell.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import {
  Calculator,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  ShoppingCart,
  Send,
  BarChart3,
  TrendingUp,
  Target,
  DollarSign,
  Layers,
  Check
} from 'lucide-react'

function TelegramLogo({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
    </svg>
  )
}

function TikTokLogo({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 1 0 5.55 6.29V9a8.27 8.27 0 0 0 4.77 1.51V7.06a4.85 4.85 0 0 1-1.00-.37z"/>
    </svg>
  )
}

function FacebookLogo({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H7.5v-3H10V9.5C10 7.01 11.49 5.6 13.78 5.6c1.1 0 2.22.2 2.22.2v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 3h-2.33v6.8c4.56-.93 8-4.96 8-9.8z"/>
    </svg>
  )
}

function GoogleLogo({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.761H12.545z"/>
    </svg>
  )
}

function YandexLogo({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm2.2 14.5h-1.9l-2.1-5.1h-.4v5.1H7.7V7.5h3.4c1.8 0 2.8.9 2.8 2.4 0 1.4-.6 2.1-1.8 3.1l2.1 3.5zm-.9-6.3c0-.7-.5-1.1-1.3-1.1h-.5v2.2h.5c.8 0 1.3-.4 1.3-1.1z"/>
    </svg>
  )
}

function TwitterXLogo({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )
}

const PLATFORMS = [
  { id: 'Facebook', name: 'Facebook / Meta', renderIcon: (cls) => <FacebookLogo className={cls} />, cpm: 8.0, ctr: 1.8, minAccounts: 3 },
  { id: 'TikTok', name: 'TikTok Ads', renderIcon: (cls) => <TikTokLogo className={cls} />, cpm: 4.5, ctr: 2.2, minAccounts: 2 },
  { id: 'Google', name: 'Google Ads', renderIcon: (cls) => <GoogleLogo className={cls} />, cpm: 12.0, ctr: 3.0, minAccounts: 2 },
  { id: 'Яндекс', name: 'Яндекс Директ', renderIcon: (cls) => <YandexLogo className={cls} />, cpm: 6.5, ctr: 2.5, minAccounts: 2 },
  { id: 'Twitter (X)', name: 'Twitter (X)', renderIcon: (cls) => <TwitterXLogo className={cls} />, cpm: 5.0, ctr: 1.5, minAccounts: 2 }
]

const NICHES = [
  { id: 'crypto', name: 'Крипта / Web3 / FinTech', convRate: 2.5, avgCpa: 45 },
  { id: 'gambling', name: 'Гемблинг / Беттинг', convRate: 3.0, avgCpa: 35 },
  { id: 'nutra', name: 'Нутра / Здоровье', convRate: 4.0, avgCpa: 18 },
  { id: 'ecom', name: 'E-commerce / Товарка', convRate: 5.5, avgCpa: 12 },
  { id: 'leadgen', name: 'Услуги / LeadGen', convRate: 6.0, avgCpa: 15 },
  { id: 'infobiz', name: 'Инфобизнес / Курсы', convRate: 4.5, avgCpa: 22 }
]

export default function CalculatorPage() {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { t, lang } = useLanguage()

  const [selectedPlatform, setSelectedPlatform] = useState(PLATFORMS[0].id)
  const [selectedNiche, setSelectedNiche] = useState(NICHES[0].id)
  const [budget, setBudget] = useState(1000) // $1000
  const [targetCpa, setTargetCpa] = useState(15) // $15 per lead (min $1)
  const [marginPerSale, setMarginPerSale] = useState(60) // $60 margin

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const currentPlatformObj = useMemo(() => PLATFORMS.find(p => p.id === selectedPlatform) || PLATFORMS[0], [selectedPlatform])
  const currentNicheObj = useMemo(() => NICHES.find(n => n.id === selectedNiche) || NICHES[0], [selectedNiche])

  // Calculations
  const metrics = useMemo(() => {
    const cpm = currentPlatformObj.cpm
    const ctr = currentPlatformObj.ctr
    
    // Impressions = (Budget / CPM) * 1000
    const impressions = Math.round((budget / cpm) * 1000)
    // Clicks = Impressions * (CTR / 100)
    const clicks = Math.round(impressions * (ctr / 100))
    // Cost Per Click (CPC) = Budget / Clicks
    const cpc = clicks > 0 ? budget / clicks : 0

    // Leads = Budget / targetCpa
    const safeTargetCpa = Math.max(1, targetCpa)
    const leads = Math.max(1, Math.round(budget / safeTargetCpa))
    
    // Revenue = Leads * marginPerSale
    const estimatedRevenue = Math.round(leads * marginPerSale)
    // Profit = Revenue - Budget
    const estimatedProfit = estimatedRevenue - budget
    // ROI % = (Profit / Budget) * 100
    const roiPercent = budget > 0 ? Math.round((estimatedProfit / budget) * 100) : 0

    // Recommended accounts calculation
    const dailySpend = budget / 30
    const safeDailyLimit = selectedPlatform === 'Facebook' ? 75 : selectedPlatform === 'TikTok' ? 100 : selectedPlatform === 'Google' ? 120 : 100
    const neededAccounts = Math.max(currentPlatformObj.minAccounts, Math.ceil(dailySpend / safeDailyLimit))
    const neededBMs = Math.max(1, Math.ceil(neededAccounts / 2))

    return {
      impressions,
      clicks,
      cpc: cpc.toFixed(2),
      leads,
      estimatedRevenue,
      estimatedProfit,
      roiPercent,
      neededAccounts,
      neededBMs,
      dailySpend: dailySpend.toFixed(0)
    }
  }, [budget, targetCpa, marginPerSale, currentPlatformObj, currentNicheObj, selectedPlatform])

  // Recommended Accounts Bundle from Catalog based on calculations
  const recommendedBundle = useMemo(() => {
    let title = `${selectedPlatform} Farm Account (Aged 14+ Days)`
    let price = 26.0
    if (selectedPlatform === 'Facebook') {
      title = 'Facebook King Farm + 3 BM'
      price = 28.0
    } else if (selectedPlatform === 'TikTok') {
      title = 'TikTok Ads Agency Account + Farm'
      price = 22.0
    } else if (selectedPlatform === 'Google') {
      title = 'Google Ads Farm (EU / Spend History)'
      price = 35.0
    } else if (selectedPlatform === 'Яндекс') {
      title = 'Яндекс Директ (Прогретый кабинет)'
      price = 24.0
    } else if (selectedPlatform === 'Twitter (X)') {
      title = 'Twitter (X) Premium Verified Account'
      price = 20.0
    }

    return {
      id: `calc_bundle_${selectedPlatform}`,
      platform: selectedPlatform,
      title,
      quantity: metrics.neededAccounts,
      unitPrice: price,
      totalPrice: price * metrics.neededAccounts
    }
  }, [selectedPlatform, metrics.neededAccounts])

  const handleAddBundleToCart = () => {
    for (let i = 0; i < recommendedBundle.quantity; i++) {
      addToCart({
        id: selectedPlatform === 'Facebook' ? 5 : selectedPlatform === 'TikTok' ? 2 : selectedPlatform === 'Google' ? 4 : selectedPlatform === 'Яндекс' ? 7 : 6,
        platform: selectedPlatform,
        title: recommendedBundle.title,
        price: recommendedBundle.unitPrice
      })
    }
    navigate('/cart')
  }

  const handleSendCalculationToAdmin = async () => {
    setIsSubmitting(true)
    try {
      await api.post('/requests/launch-ads', {
        project_url: `[Расчет Калькулятора] Ниша: ${currentNicheObj.name}, Платформа: ${selectedPlatform}`,
        planned_budget: `$${budget} (CPA: $${targetCpa}, Лидов: ~${metrics.leads}, Прогноз ROI: ${metrics.roiPercent}%, Необходимый фарм: ${metrics.neededAccounts} акк.)`
      })
      setSubmitSuccess(true)
    } catch (e) {
      console.error(e)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PageShell title={lang === 'en' ? 'Ad Budget Calculator' : 'Калькулятор бюджета'}>
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-400/40 bg-gradient-to-br from-[#0c1a3a] via-[#09122c] to-[#040817] p-5 shadow-[0_0_30px_rgba(56,189,248,0.2)]">
        <div className="flex items-center gap-3">
          <Calculator size={26} className="text-slate-400 shrink-0" />
          <div>
            <span className="rounded-full border border-cyan-400/40 bg-cyan-950/90 px-2.5 py-0.5 text-[9px] font-black tracking-widest text-cyan-300 uppercase">
              ROI & BUDGET ENGINE
            </span>
            <h1 className="mt-1 text-lg font-black text-white">
              {lang === 'en' ? 'Ad Budget & Account Calculator' : 'Калькулятор рекламного бюджета'}
            </h1>
          </div>
        </div>
        <p className="mt-2 text-xs text-slate-300 leading-relaxed">
          {lang === 'en'
            ? 'Calculate target ROI, expected leads, click volume and exact amount of farmed accounts required for safe scaling.'
            : 'Рассчитайте необходимый рекламный бюджет, прогнозируемый ROI, кол-во лидов и требуемое количество аккаунтов под вашу нишу.'}
        </p>
      </div>

      {/* FORM CONTROLS */}
      <section className="mt-4 space-y-4 rounded-3xl border border-cyan-400/30 bg-[#09122c]/90 p-5 shadow-xl backdrop-blur-md">
        {/* PLATFORM SELECTOR */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-cyan-300 mb-2">
            1. Выберите рекламную платформу
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {PLATFORMS.map((p) => {
              const isSelected = selectedPlatform === p.id
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPlatform(p.id)}
                  className={[
                    'flex items-center gap-2.5 rounded-xl border p-2.5 text-xs font-bold transition text-left',
                    isSelected
                      ? 'border-cyan-400 bg-cyan-950/90 text-white shadow-[0_0_15px_rgba(56,189,248,0.3)]'
                      : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  ].join(' ')}
                >
                  <div className={isSelected ? 'text-cyan-300' : 'text-slate-400'}>
                    {p.renderIcon('w-4 h-4 shrink-0')}
                  </div>
                  <span className="truncate">{p.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* NICHE SELECTOR */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-cyan-300 mb-2">
            2. Выберите нишу / вертикаль
          </label>
          <div className="grid grid-cols-2 gap-2">
            {NICHES.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => setSelectedNiche(n.id)}
                className={[
                  'rounded-xl border p-2.5 text-xs font-bold transition text-left truncate',
                  selectedNiche === n.id
                    ? 'border-indigo-400 bg-indigo-950/90 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                    : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                ].join(' ')}
              >
                {n.name}
              </button>
            ))}
          </div>
        </div>

        {/* SLIDER: BUDGET */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-200">3. Рекламный бюджет:</span>
            <span className="text-base font-black text-cyan-300">${budget.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="100"
            max="25000"
            step="100"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-950 accent-cyan-400"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
            <span>$100</span>
            <span>$5,000</span>
            <span>$10,000</span>
            <span>$25,000+</span>
          </div>
        </div>

        {/* SLIDER: TARGET CPA */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-200">4. Целевая стоимость лида (CPA):</span>
            <span className="text-base font-black text-indigo-300">${targetCpa}</span>
          </div>
          <input
            type="range"
            min="1"
            max="150"
            step="1"
            value={targetCpa}
            onChange={(e) => setTargetCpa(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-950 accent-indigo-400"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
            <span>$1</span>
            <span>$25</span>
            <span>$50</span>
            <span>$100</span>
            <span>$150+</span>
          </div>
        </div>

        {/* SLIDER: MARGIN */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-200">5. Чистая прибыль/LTV с лида:</span>
            <span className="text-base font-black text-emerald-300">${marginPerSale}</span>
          </div>
          <input
            type="range"
            min="5"
            max="500"
            step="5"
            value={marginPerSale}
            onChange={(e) => setMarginPerSale(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-950 accent-emerald-400"
          />
        </div>
      </section>

      {/* LIVE RESULTS DASHBOARD */}
      <section className="mt-4 space-y-3">
        <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-cyan-300 px-1">
          <BarChart3 size={18} className="text-cyan-400" />
          <span>Результаты расчета и прогноза</span>
        </h2>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="rounded-2xl border border-cyan-400/30 bg-[#09122c]/90 p-3.5 text-center shadow-lg">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Ожидаемые лиды</p>
            <p className="mt-1 text-2xl font-black text-cyan-300">~{metrics.leads}</p>
            <p className="mt-0.5 text-[10px] text-slate-400">заявок / покупок</p>
          </div>

          <div className="rounded-2xl border border-indigo-400/30 bg-[#09122c]/90 p-3.5 text-center shadow-lg">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Прогноз ROI</p>
            <p className={`mt-1 text-2xl font-black ${metrics.roiPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {metrics.roiPercent > 0 ? `+${metrics.roiPercent}%` : `${metrics.roiPercent}%`}
            </p>
            <p className="mt-0.5 text-[10px] text-slate-400">окупаемость</p>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-[#09122c]/90 p-3.5 text-center shadow-lg">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Ожидаемая выручка</p>
            <p className="mt-1 text-xl font-black text-white">${metrics.estimatedRevenue.toLocaleString()}</p>
            <p className="mt-0.5 text-[10px] text-emerald-400 font-semibold">Прибыль: +${metrics.estimatedProfit.toLocaleString()}</p>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-[#09122c]/90 p-3.5 text-center shadow-lg">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Охваты & Клики</p>
            <p className="mt-1 text-xl font-black text-white">~{metrics.clicks.toLocaleString()} кл.</p>
            <p className="mt-0.5 text-[10px] text-slate-400">~CPC: ${metrics.cpc}</p>
          </div>
        </div>

        {/* ACCOUNTS NEEDED CARD */}
        <div className="rounded-2xl border border-amber-400/40 bg-gradient-to-r from-[#1d160a] via-[#120d20] to-[#0a112e] p-4 shadow-[0_0_20px_rgba(251,191,36,0.15)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="rounded bg-amber-950 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-400/40 uppercase">
                Необходимая инфраструктура
              </span>
              <h3 className="mt-1.5 text-sm font-bold text-white">
                Для спенда ${metrics.dailySpend}/день требуется:
              </h3>
              <ul className="mt-2 space-y-1 text-xs text-slate-200">
                <li className="flex items-center gap-1.5">
                  <Check size={14} className="text-amber-400 shrink-0" />
                  <span><b>{metrics.neededAccounts} фарм-аккаунтов</b> ({selectedPlatform}) для ротации</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check size={14} className="text-amber-400 shrink-0" />
                  <span><b>{metrics.neededBMs} Business Manager / Кабинета</b> под масштабирование</span>
                </li>
              </ul>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400">Комплект из каталога:</p>
              <p className="text-lg font-black text-amber-300">${recommendedBundle.totalPrice.toFixed(2)}</p>
            </div>
          </div>

          <button
            onClick={handleAddBundleToCart}
            className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 py-2.5 text-xs font-black text-slate-950 shadow-[0_0_15px_rgba(251,191,36,0.4)] transition hover:bg-amber-300 active:scale-[0.99]"
          >
            <ShoppingCart size={16} /> Добавить фарм-сетап ({metrics.neededAccounts} шт.) в корзину
          </button>
        </div>

        {/* SUBMIT CALCULATION TO TEAM */}
        <div className="rounded-2xl border border-cyan-400/30 bg-[#09122c] p-4 text-center">
          {submitSuccess ? (
            <div className="py-2 text-emerald-400">
              <CheckCircle2 size={32} className="mx-auto mb-1 text-emerald-400" />
              <p className="text-sm font-bold">Расчет передан команде баеров!</p>
              <p className="mt-0.5 text-xs text-slate-300">Менеджер свяжется с вами в Telegram для согласования запуска.</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-slate-300 mb-2">
                Хотите запустить рекламу под этот расчет под ключ? Наша команда возьмет сетап и связки на себя.
              </p>
              <button
                onClick={handleSendCalculationToAdmin}
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 py-3 text-xs font-bold text-slate-950 shadow-[0_0_15px_rgba(56,189,248,0.3)] transition hover:opacity-95 disabled:opacity-50"
              >
                <Send size={16} /> {isSubmitting ? 'Отправка...' : 'Заказать запуск по этому расчету'}
              </button>
            </>
          )}
        </div>
      </section>
    </PageShell>
  )
}
