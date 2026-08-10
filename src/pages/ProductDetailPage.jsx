import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ShoppingCart,
  CheckCircle,
  ShieldAlert,
  Globe,
  FileText,
  Cpu,
  MessageSquare,
  Zap,
  Server,
  RefreshCw,
  Gauge,
  Layers,
  Sparkles,
  Check,
  BookOpen,
  ShieldCheck,
  Download,
  KeyRound,
  ExternalLink,
  HelpCircle,
  Star
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { useCart } from '../context/CartContext'
import { PlatformIcon } from '../components/SocialProductTile'
import SmartCrossSell from '../components/SmartCrossSell'
import { STARTER_PACKS, PROXY_PRODUCTS } from '../data/starterPacks'

const defaultProducts = [
  {
    id: 1,
    category_id: 4,
    title: 'TikTok Ads Agency Account (US/EU)',
    title_en: 'TikTok Ads Agency Account (US/EU)',
    description: 'Агентский аккаунт TikTok Ads с прогретым профилем, готовый к запуску рекламы без лимитов и банов.',
    description_en: 'TikTok Ads Agency account with warmed profile, ready for ad launch without limits or bans.',
    platform: 'TikTok',
    price: 22.00,
    is_visible: true,
    geo: 'US / EU 🌐',
    format: 'Login:Pass:2FA:Cookies',
    detailed_description: 'Премиальный трастовый аккаунт TikTok Ads с пройденной верификацией и готовой привязкой платежек.',
    replacement_policy: 'Гарантия замены в течение 24 часов.',
    usage_instructions: '1. Импортируйте куки в антидетект.\n2. Используйте чистый резидентский прокси.\n3. Запустите тестовую кампанию.'
  },
  {
    id: 2,
    category_id: 4,
    title: 'TikTok Farm Aged 14+ Days',
    title_en: 'TikTok Farm Aged 14+ Days',
    description: 'Фарм-аккаунт TikTok с отлежкой от 14 дней, высокой степенью доверия трафика, куки в комплекте.',
    description_en: 'TikTok farm account aged 14+ days with high trust score, cookies included.',
    platform: 'TikTok',
    price: 26.00,
    is_visible: true,
    geo: 'US / EU 🌐',
    format: 'Login:Pass:2FA:Cookies',
    detailed_description: 'Ручной фарм с отлежкой от двух недель. Живая активность профиля.',
    replacement_policy: 'Гарантия замены в течение 24 часов.',
    usage_instructions: '1. Импортируйте куки в профиль антидетекта.\n2. Работайте строго через гео-прокси.'
  },
  {
    id: 3,
    category_id: 4,
    title: 'TikTok Business Center (Uncapped)',
    title_en: 'TikTok Business Center (Uncapped)',
    description: 'Верифицированный Business Center TikTok с привязанным рекламным кабинетом для масштабного захода.',
    description_en: 'Verified TikTok Business Center with attached ad account for large scaling.',
    platform: 'TikTok',
    price: 30.00,
    is_visible: true,
    geo: 'WW / Глобал 🌐',
    format: 'BC Admin Invite + Login:Pass',
    detailed_description: 'Бизнес Центр с правами администратора без дневного лимита спенда.',
    replacement_policy: 'Гарантия передачи прав 100%.',
    usage_instructions: '1. Примите приглашение по почте.\n2. Добавьте свои рекламные кабинеты.'
  },
  {
    id: 4,
    category_id: 2,
    title: 'Google Ads Farm (EU / Spend History)',
    title_en: 'Google Ads Farm (EU / Spend History)',
    description: 'Прогретый аккаунт Google Ads с историей списаний, гео Европа, 2FA подключен.',
    description_en: 'Warmed Google Ads account with spend history, EU GEO, 2FA enabled.',
    platform: 'Google',
    price: 35.00,
    is_visible: true,
    geo: 'EU / Европа 🇪🇺',
    format: 'Email:Pass:2FA_Secret:Cookies',
    detailed_description: 'Google Ads с реальными списаниями и историей активности. Высочайший траст.',
    replacement_policy: 'Замена при чекпоинте до первого залива.',
    usage_instructions: '1. Войдите по куки через статический ISP прокси Европы.'
  },
  {
    id: 5,
    category_id: 3,
    title: 'Facebook King Farm + 3 BM',
    title_en: 'Facebook King Farm + 3 BM',
    description: 'Кинг-аккаунт Facebook + 3 верифицированных Business Manager с прогретыми пикселями.',
    description_en: 'Facebook King account + 3 verified Business Managers with warmed pixels.',
    platform: 'Facebook',
    price: 28.00,
    is_visible: true,
    geo: 'US / США 🇺🇸',
    format: 'Login:Pass:2FA:Cookies(JSON)',
    detailed_description: 'Кинг-аккаунт Facebook с пройденным ПЗРД и 3 верифицированными BM.',
    replacement_policy: 'Бесплатная замена в течение 24 часов.',
    usage_instructions: '1. Загрузите профиль в Dolphin/AdsPower.\n2. Используйте мобильный прокси США.'
  },
  {
    id: 6,
    category_id: 1,
    title: 'Twitter (X) Premium Verified Account',
    title_en: 'Twitter (X) Premium Verified Account',
    description: 'Старый аккаунт Twitter (X) с отлежкой 2021+ года, готов под арбитраж и крипто-проекты.',
    description_en: 'Aged Twitter (X) account 2021+, ready for affiliate marketing & crypto projects.',
    platform: 'Twitter (X)',
    price: 20.00,
    is_visible: true,
    geo: 'WW / Все страны 🌐',
    format: 'Login:Pass:AuthToken:Cookies',
    detailed_description: 'Аккаунт Twitter с многолетней отлежкой и высоким трастом.',
    replacement_policy: 'Замена при невалиде на момент выдачи.',
    usage_instructions: '1. Авторизуйтесь через Auth Token в браузере.'
  },
  {
    id: 7,
    category_id: 5,
    title: 'Яндекс Директ (Прогретый кабинет)',
    title_en: 'Yandex Direct (Warmed Account)',
    description: 'Аккаунт Яндекс Директ с пройденной модерацией и баллами для белого и серого трафика.',
    description_en: 'Yandex Direct account with passed moderation and ad points for white/gray traffic.',
    platform: 'Яндекс',
    price: 24.00,
    is_visible: true,
    geo: 'RU / CIS 🇷🇺',
    format: 'Login:Pass:Secret',
    detailed_description: 'Кабинет Директа с историей модерации и накопленным трастом.',
    replacement_policy: 'Гарантия входа и валидности.',
    usage_instructions: '1. Используйте резидентские прокси РФ.'
  }
]

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { lang } = useLanguage()
  const { items, addToCart, updateQuantity } = useCart()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedQty, setSelectedQty] = useState(1)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/catalog/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Product not found in API')
        return res.json()
      })
      .then((data) => {
        setProduct(data)
        setLoading(false)
      })
      .catch(() => {
        // Search in local collections: STARTER_PACKS, PROXY_PRODUCTS, defaultProducts
        const allItems = [
          ...STARTER_PACKS,
          ...PROXY_PRODUCTS,
          ...defaultProducts
        ]
        const fallback = allItems.find((p) => String(p.id) === String(id))
        if (fallback) {
          setProduct(fallback)
          setError(null)
        } else {
          setError('Product not found')
        }
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-4 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent mb-3" />
        <p className="text-sm font-semibold text-cyan-300">
          {lang === 'en' ? 'Loading product details...' : 'Загрузка характеристик товара...'}
        </p>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
        <ShieldAlert size={48} className="text-rose-400 mb-3" />
        <h2 className="text-lg font-bold text-white mb-1">
          {lang === 'en' ? 'Product Not Found' : 'Товар не найден'}
        </h2>
        <p className="text-xs text-slate-400 mb-4">
          {lang === 'en' ? 'The requested product is unavailable or removed.' : 'Запрашиваемый товар временно недоступен или удален из каталога.'}
        </p>
        <button
          onClick={() => navigate('/catalog')}
          className="rounded-xl bg-cyan-500/20 px-4 py-2 text-xs font-bold text-cyan-300 border border-cyan-400/40 hover:bg-cyan-500/30"
        >
          {lang === 'en' ? 'Return to Catalog' : 'Вернуться в каталог'}
        </button>
      </div>
    )
  }

  const isProxy = product.platform === 'Proxy' || String(product.category_id) === '6' || (product.id >= 300 && product.id < 400)
  const isSetup = product.platform === 'Setup' || String(product.category_id) === '7' || (product.id >= 100 && product.id < 200) || Array.isArray(product.items)

  const title = (lang === 'en' && product.title_en) ? product.title_en : product.title
  const description = (lang === 'en' && product.description_en) ? product.description_en : product.description
  const detailedDesc = (lang === 'en' && product.detailed_description_en) ? product.detailed_description_en : (product.detailed_description || description)

  const cartItem = items?.find((i) => i.id === product.id)
  const quantityInCart = cartItem ? cartItem.quantity : 0

  const handleAddToCart = () => {
    if (quantityInCart > 0) {
      updateQuantity(product.id, quantityInCart + selectedQty)
    } else {
      addToCart(product, selectedQty)
    }
  }

  const handleBuyInstant = () => {
    if (quantityInCart === 0) {
      addToCart(product, selectedQty)
    }
    navigate('/cart')
  }

  return (
    <div className="mx-auto w-full max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-4xl px-3 sm:px-6 pb-28 pt-4 text-white">
      {/* Top Back Navigation Bar */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-400/30 bg-cyan-950/60 px-3 py-1.5 text-xs font-bold text-cyan-300 transition hover:border-cyan-300 hover:bg-cyan-900/80 active:scale-95"
        >
          <ArrowLeft size={14} />
          <span>{lang === 'en' ? 'Back' : 'Назад'}</span>
        </button>

        <span className="text-[11px] font-bold text-slate-400">
          {isSetup ? (lang === 'en' ? 'Ready Starter Setup' : 'Готовый Бандл') : isProxy ? (lang === 'en' ? 'Dedicated Proxy' : 'Приватный Прокси') : (lang === 'en' ? 'Verified Account' : 'Проверенный Аккаунт')}
        </span>
      </div>

      {/* Main Product Header Card */}
      <div className={`mb-4 rounded-2xl sm:rounded-3xl border p-4 sm:p-6 shadow-2xl ${
        isProxy
          ? 'border-emerald-400/50 bg-gradient-to-b from-[#06241b] via-[#071726] to-[#030a14] shadow-[0_0_30px_rgba(52,211,153,0.2)]'
          : isSetup
          ? 'border-amber-400/50 bg-gradient-to-b from-[#241a05] via-[#0f1738] to-[#040817] shadow-[0_0_30px_rgba(251,191,36,0.25)]'
          : 'border-cyan-400/40 bg-gradient-to-b from-[#0e224e] via-[#09122c] to-[#040817]'
      }`}>
        {/* Top Tag Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-xl bg-black/60 px-3 py-1 border border-cyan-400/30">
              <PlatformIcon platform={product.platform} title={title} size={18} />
              <span className={`text-xs font-black uppercase tracking-wider ${
                isProxy ? 'text-emerald-300' : isSetup ? 'text-amber-300' : 'text-cyan-300'
              }`}>
                {isProxy ? (product.proxy_type || 'Private Proxy') : isSetup ? (lang === 'en' ? 'Flagship Launch Setup' : 'Готовый Сетап Под Ключ') : (product.platform || 'Account')}
              </span>
            </div>

            {isSetup && (
              <span className="flex items-center gap-1 rounded-lg bg-amber-500/20 px-2 py-0.5 text-[10px] font-extrabold text-amber-300 border border-amber-400/30">
                <Star size={11} className="fill-amber-400 text-amber-400" /> {product.rating || '5.0'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-black text-emerald-300 border border-emerald-500/30">
              {lang === 'en' ? `In stock: ${product.stock || 50} pcs.` : `В наличии: ${product.stock || 50} шт.`}
            </span>
          </div>
        </div>

        <h1 className="text-base sm:text-xl md:text-2xl font-black text-white mb-2 leading-snug">{title}</h1>
        <p className="text-xs sm:text-sm text-slate-300 mb-4 leading-relaxed">{description}</p>

        {/* IF SETUP: RENDER FULL ITEMIZED BUNDLE BREAKDOWN */}
        {isSetup && product.items && (
          <div className="rounded-2xl border border-amber-400/35 bg-black/60 p-3.5 sm:p-4 mb-4 space-y-2.5 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Sparkles size={13} className="text-amber-400" />
                {lang === 'en' ? 'Full Setup Kit Contents (Ready to Launch):' : 'Состав комплекта (Все включено для старта):'}
              </p>
              <span className="text-[10px] font-bold text-emerald-400">100% Verified</span>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-200">
              {product.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-amber-950/30 p-2.5 rounded-xl border border-amber-500/20">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300 mt-0.5 border border-emerald-400/30">
                    <Check size={12} className="stroke-[3]" />
                  </div>
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* IF PROXY: RENDER SPEC PILLS */}
        {isProxy && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 rounded-2xl bg-black/50 p-3 mb-4 border border-emerald-500/30 text-xs">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-slate-400 uppercase">Протокол:</span>
              <span className="font-bold text-emerald-300">{product.protocol || 'HTTP & SOCKS5'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-slate-400 uppercase">Скорость:</span>
              <span className="font-bold text-amber-300">{product.speed || 'До 60 Мбит/с'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-slate-400 uppercase">Пинг:</span>
              <span className="font-bold text-cyan-300">{product.ping || '15-35 ms'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-slate-400 uppercase">Ротация:</span>
              <span className="font-bold text-teal-300">{product.rotation || 'По ссылке / Таймер'}</span>
            </div>
          </div>
        )}

        {/* PRICE & QUANTITY SELECTOR ROW */}
        <div className="flex items-baseline justify-between border-t border-cyan-400/20 pt-3.5">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              {lang === 'en' ? 'Bundle / Item Price' : 'Цена за комплект / товар'}
            </span>
            <div className="flex items-center gap-2">
              {product.oldPrice && (
                <span className="text-xs sm:text-sm text-slate-400 line-through font-semibold font-mono">
                  ${product.oldPrice.toFixed(2)}
                </span>
              )}
              <span className={`text-xl sm:text-2xl font-black font-mono ${
                isProxy ? 'text-emerald-300' : isSetup ? 'text-amber-300' : 'text-cyan-300'
              }`}>
                ${Number(product.price).toFixed(2)} USD
              </span>

              {product.oldPrice && (
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-black text-emerald-300 border border-emerald-400/30">
                  {lang === 'en' ? `Save $${(product.oldPrice - product.price).toFixed(2)}` : `Скидка $${(product.oldPrice - product.price).toFixed(2)}`}
                </span>
              )}
            </div>
          </div>

          {/* Quantity selector */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setSelectedQty(Math.max(1, selectedQty - 1))}
              className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg border border-cyan-400/30 bg-cyan-950 text-sm font-bold text-cyan-300 hover:bg-cyan-900 active:scale-90"
            >
              -
            </button>
            <span className="w-6 text-center text-sm font-extrabold text-white">{selectedQty}</span>
            <button
              onClick={() => setSelectedQty(selectedQty + 1)}
              className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg border border-cyan-400/30 bg-cyan-950 text-sm font-bold text-cyan-300 hover:bg-cyan-900 active:scale-90"
            >
              +
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-2 rounded-2xl border border-cyan-400/50 bg-cyan-950/80 py-3 text-xs sm:text-sm font-bold text-cyan-300 transition hover:bg-cyan-900 active:scale-95"
          >
            <ShoppingCart size={16} />
            <span>
              {quantityInCart > 0
                ? (lang === 'en' ? `In Cart (${quantityInCart} pcs.) + Add` : `В корзине (${quantityInCart} шт.) + Добавить`)
                : (lang === 'en' ? 'Add to Cart' : 'Добавить в корзину')}
            </span>
          </button>

          <button
            onClick={handleBuyInstant}
            className={`flex items-center justify-center gap-2 rounded-2xl py-3 text-xs sm:text-sm font-black text-slate-950 shadow-lg transition active:scale-95 ${
              isProxy
                ? 'bg-gradient-to-r from-emerald-400 to-teal-400 shadow-[0_0_20px_rgba(52,211,153,0.4)] hover:opacity-95'
                : isSetup
                ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 shadow-[0_0_20px_rgba(251,191,36,0.4)] hover:opacity-95'
                : 'bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_20px_rgba(56,189,248,0.4)] hover:opacity-95'
            }`}
          >
            <Zap size={16} />
            <span>{lang === 'en' ? 'Buy Now in 1-Click' : 'Купить в 1 клик'}</span>
          </button>
        </div>
      </div>

      {/* Characteristics Grid */}
      <div className="mb-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <div className="rounded-2xl border border-cyan-400/30 bg-[#09122c]/90 p-3.5">
          <div className="flex items-center gap-2 text-cyan-300 mb-1">
            <Globe size={15} />
            <span className="text-xs font-bold uppercase">{lang === 'en' ? 'GEO / Target Location' : 'ГЕО / Локация'}</span>
          </div>
          <p className="text-xs font-semibold text-slate-200">{product.geo || 'US / EU / WW (Все страны)'}</p>
        </div>

        <div className="rounded-2xl border border-cyan-400/30 bg-[#09122c]/90 p-3.5">
          <div className="flex items-center gap-2 text-cyan-300 mb-1">
            <FileText size={15} />
            <span className="text-xs font-bold uppercase">{lang === 'en' ? 'Delivery Format' : 'Формат выдачи'}</span>
          </div>
          <p className="text-xs font-mono font-semibold text-slate-200">
            {product.format || (isSetup ? 'Account_Data + Proxy_Data + Setup_Guide' : isProxy ? 'IP:PORT:USER:PASS:ROTATE_URL' : 'Login:Pass:2FA:Cookies(JSON)')}
          </p>
        </div>
      </div>

      {/* IF SETUP: STEP-BY-STEP SETUP & LAUNCH GUIDE ACCORDION */}
      {isSetup && (
        <div className="rounded-2xl border border-amber-400/35 bg-[#171105]/95 p-4 mb-4 space-y-3">
          <h3 className="flex items-center gap-2 text-xs sm:text-sm font-black text-amber-300 uppercase">
            <BookOpen size={16} />
            <span>{lang === 'en' ? 'Step-by-Step Launch Sequence:' : 'Пошаговый алгоритм запуска данного сетапа:'}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="bg-black/50 p-3 rounded-xl border border-amber-500/20">
              <span className="font-bold text-amber-300 block mb-1">1. Создание профиля в антидетекте</span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Создайте профиль в Dolphin Anty / AdsPower / Octo, выберите ОС (Windows/macOS) и User-Agent.
              </p>
            </div>

            <div className="bg-black/50 p-3 rounded-xl border border-amber-500/20">
              <span className="font-bold text-amber-300 block mb-1">2. Подключение приватного прокси</span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Вставьте параметры полученного SOCKS5/HTTP прокси и ссылку на смену IP. Проверьте пинг.
              </p>
            </div>

            <div className="bg-black/50 p-3 rounded-xl border border-amber-500/20">
              <span className="font-bold text-amber-300 block mb-1">3. Импорт JSON Cookies & 2FA</span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Импортируйте куки в профиль. При запросе кода входа сгенерируйте 2FA через встроенный генератор.
              </p>
            </div>

            <div className="bg-black/50 p-3 rounded-xl border border-amber-500/20">
              <span className="font-bold text-amber-300 block mb-1">4. Привязка карты & Запуск</span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Привяжите трастовую карту (БИН PST/EPN/Brocard), прогрейте пиксель и запускайте тестовую кампанию.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SMART CROSS-SELL (RECOMMENDED CONSUMABLES) */}
      <SmartCrossSell />

      {/* Detailed Info Blocks */}
      <div className="space-y-3 mt-4">
        {/* Full Description */}
        <div className="rounded-2xl border border-cyan-400/30 bg-[#09122c]/90 p-4">
          <h3 className="flex items-center gap-2 text-xs font-bold text-cyan-300 uppercase mb-2">
            <Cpu size={16} />
            <span>{lang === 'en' ? 'Detailed Specifications & Parameters' : 'Подробные характеристики и параметры товара'}</span>
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
            {detailedDesc}
          </p>
        </div>

        {/* Anti-Detect Browser Setup Guide for Proxies & Accounts */}
        <div className="rounded-2xl border border-emerald-400/30 bg-[#07181f]/90 p-4">
          <h3 className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase mb-2">
            <ShieldCheck size={16} />
            <span>{lang === 'en' ? 'Anti-Detect Setup & Anti-Ban Rules' : 'Правила безопасного запуска без банов'}</span>
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
            {product.usage_instructions || (
              isProxy
                ? '1. Скопируйте host:port:username:password в настройки прокси профиля.\n2. В поле "Ссылка для смены IP" укажите полученный API URL для ротации.\n3. Проверьте ГЕО и отсутствие WebRTC утечек перед запуском рекламного кабинета.'
                : '1. Импортируйте куки в профиль антидетект-браузера.\n2. Используйте чистые резидентские/мобильные прокси под ГЕО аккаунта.\n3. Не меняйте логин/пароль в первые 2 часа после первого входа.'
            )}
          </p>
        </div>

        {/* Replacement Policy */}
        <div className="rounded-2xl border border-amber-400/30 bg-[#171105]/90 p-4">
          <h3 className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase mb-2">
            <ShieldAlert size={16} />
            <span>{lang === 'en' ? 'Guarantee & Replacement Policy' : 'Гарантии и правила замены'}</span>
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {product.replacement_policy || 'Бесплатная замена в течение 24 часов с момента покупки при сохранении правил работы через приватные прокси.'}
          </p>
        </div>

        {/* Direct Contact Manager Button */}
        <a
          href="https://t.me/mediabuy_adm"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex items-center justify-center gap-2 rounded-2xl border border-cyan-400/40 bg-gradient-to-r from-cyan-950 to-blue-950 p-3.5 text-xs font-bold text-cyan-200 transition hover:border-cyan-300 hover:text-white shadow-lg"
        >
          <MessageSquare size={16} className="text-cyan-400" />
          <span>
            {lang === 'en'
              ? 'Have questions about this item? Contact Manager'
              : 'Задать вопрос менеджеру по этому товару'}
          </span>
        </a>
      </div>
    </div>
  )
}
