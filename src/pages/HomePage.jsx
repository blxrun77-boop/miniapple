import { useEffect, useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import api from '../api/client'
import ArticleCard from '../components/ArticleCard.jsx'
import HomeBannerCarousel from '../components/HomeBannerCarousel.jsx'
import PageShell from '../components/PageShell.jsx'
import SocialProductTile, { PlatformIcon } from '../components/SocialProductTile.jsx'
import MediabuyLogo from '../components/MediabuyLogo.jsx'
import LanguageSwitcher from '../components/LanguageSwitcher.jsx'
import StarterPacksSection from '../components/StarterPacksSection.jsx'
import ProxiesSection from '../components/ProxiesSection.jsx'
import HomeToolsBanners from '../components/HomeToolsBanners.jsx'
import InteractiveKnowledgeBook from '../components/InteractiveKnowledgeBook.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import {
  Rocket,
  GraduationCap,
  Calculator,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  User,
  BookOpen,
  KeyRound,
  Sparkles,
  Zap,
  Tag,
  ArrowRight,
  SlidersHorizontal,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Gift,
  ExternalLink
} from 'lucide-react'

export default function HomePage() {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { t, lang } = useLanguage()
  const [banners, setBanners] = useState([])
  const [articles, setArticles] = useState([])
  const [products, setProducts] = useState([])
  const [homeSettings, setHomeSettings] = useState(null)
  const [accountsPage, setAccountsPage] = useState(0)
  const [activePlatformFilter, setActivePlatformFilter] = useState('all')

  const defaultProducts = [
    {
      id: 1,
      category_id: 4,
      title: 'TikTok Ads Agency Account (US/EU)',
      title_en: 'TikTok Ads Agency Account (US/EU)',
      description: 'Агентский аккаунт TikTok Ads с прогретым профилем, готовый к запуску рекламы без лимитов и банов.',
      description_en: 'TikTok Ads Agency account with warmed profile, ready for ad launch without limits or bans.',
      platform: 'TikTok',
      geo: 'US / EU 🌐',
      price: 22.00,
      is_visible: true
    },
    {
      id: 2,
      category_id: 4,
      title: 'TikTok Farm Aged 14+ Days',
      title_en: 'TikTok Farm Aged 14+ Days',
      description: 'Фарм-аккаунт TikTok с отлежкой от 14 дней, высокой степенью доверия трафика, куки в комплекте.',
      description_en: 'TikTok farm account aged 14+ days with high trust score, cookies included.',
      platform: 'TikTok',
      geo: 'US / EU 🌐',
      price: 26.00,
      is_visible: true
    },
    {
      id: 3,
      category_id: 4,
      title: 'TikTok Business Center (Uncapped)',
      title_en: 'TikTok Business Center (Uncapped)',
      description: 'Верифицированный Business Center TikTok с привязанным рекламным кабинетом для масштабного захода.',
      description_en: 'Verified TikTok Business Center with attached ad account for large scaling.',
      platform: 'TikTok',
      geo: 'WW 🌐',
      price: 30.00,
      is_visible: true
    },
    {
      id: 4,
      category_id: 2,
      title: 'Google Ads Farm (EU / Spend History)',
      title_en: 'Google Ads Farm (EU / Spend History)',
      description: 'Прогретый аккаунт Google Ads с историей списаний, гео Европа, 2FA подключен.',
      description_en: 'Warmed Google Ads account with spend history, EU GEO, 2FA enabled.',
      platform: 'Google',
      geo: 'EU 🇪🇺',
      price: 35.00,
      is_visible: true
    },
    {
      id: 5,
      category_id: 3,
      title: 'Facebook King Farm + 3 BM',
      title_en: 'Facebook King Farm + 3 BM',
      description: 'Кинг-аккаунт Facebook + 3 верифицированных Business Manager с прогретыми пикселями.',
      description_en: 'Facebook King account + 3 verified Business Managers with warmed pixels.',
      platform: 'Facebook',
      geo: 'US 🇺🇸',
      price: 28.00,
      is_visible: true
    },
    {
      id: 6,
      category_id: 1,
      title: 'Twitter (X) Premium Verified Account',
      title_en: 'Twitter (X) Premium Verified Account',
      description: 'Старый аккаунт Twitter (X) с отлежкой 2021+ года, готов под арбитраж и крипто-проекты.',
      description_en: 'Aged Twitter (X) account 2021+, ready for affiliate marketing & crypto projects.',
      platform: 'Twitter (X)',
      geo: 'WW 🌐',
      price: 20.00,
      is_visible: true
    },
    {
      id: 7,
      category_id: 5,
      title: 'Яндекс Директ (Прогретый кабинет)',
      title_en: 'Yandex Direct (Warmed Account)',
      description: 'Аккаунт Яндекс Директ с пройденной модерацией и баллами для белого и серого трафика.',
      description_en: 'Yandex Direct account with passed moderation and ad points for white/gray traffic.',
      platform: 'Яндекс',
      geo: 'RU 🇷🇺',
      price: 24.00,
      is_visible: true
    }
  ]

  useEffect(() => {
    const loadHome = async () => {
      try {
        const [bannersRes, articlesRes, productsRes] = await Promise.all([
          api.get('/content/banners').catch(() => ({ data: [] })),
          api.get('/content/articles', { params: { lang } }).catch(() => ({ data: [] })),
          api.get('/catalog/products').catch(() => ({ data: [] }))
        ])
        setBanners(bannersRes.data?.length ? bannersRes.data : [])
        setArticles(articlesRes.data?.length ? articlesRes.data : [])
        setProducts(productsRes.data?.length ? productsRes.data : defaultProducts)
        
        try {
          const homeSettingsRes = await api.get('/content/home-settings')
          if (homeSettingsRes.data) {
            setHomeSettings(homeSettingsRes.data)
          }
        } catch (e) {
          // ignore
        }
      } catch (error) {
        console.error(error)
        setProducts(defaultProducts)
      }
    }

    loadHome()
  }, [lang])

  const displayProducts = products.length ? products : defaultProducts

  // Filter accounts for the carousel grid
  const filteredAccounts = useMemo(() => {
    return displayProducts.filter((p) => {
      if (p.platform === 'Proxy' || p.category_id === 6 || p.category_id === 7) return false
      if (activePlatformFilter === 'all') return true
      const plat = (p.platform || '').toLowerCase()
      return plat.includes(activePlatformFilter.toLowerCase())
    })
  }, [displayProducts, activePlatformFilter])

  const productsPerPage = 6
  const accountPages = useMemo(() => {
    const pages = []
    for (let i = 0; i < filteredAccounts.length; i += productsPerPage) {
      pages.push(filteredAccounts.slice(i, i + productsPerPage))
    }
    return pages
  }, [filteredAccounts])

  const visibleProducts = accountPages[accountsPage] || []

  // Reset page when filter changes
  useEffect(() => {
    setAccountsPage(0)
  }, [activePlatformFilter])

  // Fallback articles
  const defaultArticles = [
    {
      id: 1,
      title: lang === 'en' ? 'Case: TikTok Cold Traffic Setup' : 'Кейс: TikTok на холодном трафике',
      image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      target_url: 'https://t.me/mediabuy_lab'
    },
    {
      id: 2,
      title: lang === 'en' ? 'How to prepare accounts without bans' : 'Как подготовить аккаунты под запуск без банов',
      image_url: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80',
      target_url: 'https://t.me/mediabuy_lab'
    }
  ]

  const displayArticles = articles.length ? articles : defaultArticles

  const defaultPromos = [
    {
      id: 2,
      title: lang === 'en' ? 'Turnkey launch & training' : 'Запуск и обучение в одном месте',
      subtitle: lang === 'en' ? 'Hands-on practice & team support' : 'Практика, связки и поддержка команды 24/7',
      image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
      target_url: 'https://t.me/mediabuy_lab',
      badge: 'HOT DEAL'
    },
    {
      id: 3,
      title: lang === 'en' ? '10% discount on second order' : 'Скидка 10% на второй заказ',
      subtitle: lang === 'en' ? 'Auto-activated after first payment' : 'Акция активируется автоматически после первой успешной оплаты',
      image_url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
      target_url: 'https://t.me/mediabuy_lab',
      badge: 'BONUS 10%'
    }
  ]

  const promoBanners = banners.length ? banners.slice(0, 4) : defaultPromos

  const platformChips = [
    { id: 'all', label: lang === 'en' ? 'All' : 'Все', count: displayProducts.filter(p => p.category_id !== 6 && p.category_id !== 7).length },
    { id: 'tiktok', label: 'TikTok', count: displayProducts.filter(p => (p.platform || '').toLowerCase().includes('tiktok')).length },
    { id: 'google', label: 'Google', count: displayProducts.filter(p => (p.platform || '').toLowerCase().includes('google')).length },
    { id: 'facebook', label: 'FB', count: displayProducts.filter(p => (p.platform || '').toLowerCase().includes('facebook') || (p.platform || '').toLowerCase().includes('fb')).length },
    { id: 'twitter', label: 'X (Twitter)', count: displayProducts.filter(p => (p.platform || '').toLowerCase().includes('twitter') || (p.platform || '').toLowerCase().includes('x')).length },
    { id: 'яндекс', label: lang === 'en' ? 'Yandex' : 'Яндекс', count: displayProducts.filter(p => (p.platform || '').toLowerCase().includes('яндекс') || (p.platform || '').toLowerCase().includes('yandex')).length },
  ]

  return (
    <PageShell title="Mediabuy Lab" hideTitle hideTopSwitcher>
      {/* 1. HEADER SECTION */}
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-3.5 sm:mb-4 flex items-center justify-between rounded-2xl sm:rounded-3xl border border-cyan-500/25 bg-gradient-to-r from-[#07132e]/95 via-[#0c1a42]/95 to-[#07132e]/95 px-3.5 sm:px-4 py-3 sm:py-3.5 shadow-md backdrop-blur-xl"
      >
        <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group">
          {homeSettings?.logo_image_url ? (
            <img
              src={homeSettings.logo_image_url}
              alt="Mediabuy Lab Logo"
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl border border-cyan-400/50 bg-[#09122c] object-contain p-1 shadow-[0_0_14px_rgba(56,189,248,0.4)] transition group-hover:scale-105"
            />
          ) : (
            <MediabuyLogo size="sm" className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl border border-cyan-400/40 transition group-hover:scale-105 shadow-[0_0_12px_rgba(56,189,248,0.3)]" />
          )}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm sm:text-base font-black tracking-tight text-white group-hover:text-cyan-300 transition">
                {homeSettings?.brand_title || 'MEDIABUY'}
              </h1>
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.9)]" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[8px] sm:text-[9px] font-black text-cyan-400 tracking-wider">
                PERFORMANCE HUB
              </span>
              <span className="text-[8px] text-slate-500">•</span>
              <span className="text-[8px] font-semibold text-emerald-400">
                {lang === 'en' ? 'Instant 24/7' : 'Выдача 24/7'}
              </span>
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/catalog')}
            className="hidden sm:flex items-center gap-1.5 rounded-xl border border-cyan-400/30 bg-cyan-950/70 px-3 py-1.5 text-xs font-bold text-cyan-300 hover:border-cyan-300 transition active:scale-95 shadow-sm"
          >
            <Layers size={14} />
            <span>{lang === 'en' ? 'Catalog' : 'Каталог'}</span>
          </button>

          <LanguageSwitcher />
        </div>
      </motion.header>

      {/* 2. TOP PROMO BANNER CAROUSEL */}
      <HomeBannerCarousel banners={banners} />

      {/* 3. QUICK LAUNCH & ESSENTIALS BAR */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="my-2.5 sm:my-3 grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5 min-w-0"
      >
        {/* 1. CALCULATOR */}
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate('/calculator')}
          className="group relative overflow-hidden rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-[#091733] to-[#040c1c] p-2.5 sm:p-3 text-left shadow-sm transition hover:border-cyan-300"
        >
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <Calculator size={20} className="text-slate-400 group-hover:text-slate-200 transition shrink-0" />
            <div className="min-w-0">
              <span className="text-[8px] sm:text-[9px] font-black tracking-wider text-cyan-300 uppercase block truncate">
                {lang === 'en' ? 'ROI & BUDGET' : 'КАЛЬКУЛЯТОР'}
              </span>
              <p className="text-xs sm:text-sm font-black text-white truncate group-hover:text-cyan-200 transition">
                {lang === 'en' ? 'Ad Budget' : 'Расчет окупаемости'}
              </p>
            </div>
          </div>
        </motion.button>

        {/* 2. BUYER TOOLS */}
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate('/tools')}
          className="group relative overflow-hidden rounded-2xl border border-emerald-400/30 bg-gradient-to-br from-[#06241b] to-[#03120d] p-2.5 sm:p-3 text-left shadow-sm transition hover:border-emerald-300"
        >
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <BookOpen size={20} className="text-slate-400 group-hover:text-slate-200 transition shrink-0" />
            <div className="min-w-0">
              <span className="text-[8px] sm:text-[9px] font-black tracking-wider text-emerald-300 uppercase block truncate">
                {lang === 'en' ? '2FA & TOOLS' : '2FA & ЧЕКЕРЫ'}
              </span>
              <p className="text-xs sm:text-sm font-black text-white truncate group-hover:text-emerald-200 transition">
                {lang === 'en' ? 'Buyer Suite' : 'База & Утилиты'}
              </p>
            </div>
          </div>
        </motion.button>

        {/* 3. ORDER ADS */}
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate('/launch-ads')}
          className="group relative overflow-hidden rounded-2xl border border-blue-400/30 bg-gradient-to-br from-[#0a2048] to-[#051126] p-2.5 sm:p-3 text-left shadow-sm transition hover:border-blue-300"
        >
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <Rocket size={20} className="text-slate-400 group-hover:text-slate-200 transition shrink-0" />
            <div className="min-w-0">
              <span className="text-[8px] sm:text-[9px] font-black tracking-wider text-blue-300 uppercase block truncate">
                {lang === 'en' ? 'TURNKEY ADS' : 'ЗАПУСК'}
              </span>
              <p className="text-xs sm:text-sm font-black text-white truncate group-hover:text-blue-200 transition">
                {lang === 'en' ? 'Order Ads' : 'Заказать рекламу'}
              </p>
            </div>
          </div>
        </motion.button>

        {/* 4. TRAINING */}
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate('/training')}
          className="group relative overflow-hidden rounded-2xl border border-indigo-400/30 bg-gradient-to-br from-[#151c45] to-[#090e24] p-2.5 sm:p-3 text-left shadow-sm transition hover:border-indigo-300"
        >
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <GraduationCap size={20} className="text-slate-400 group-hover:text-slate-200 transition shrink-0" />
            <div className="min-w-0">
              <span className="text-[8px] sm:text-[9px] font-black tracking-wider text-indigo-300 uppercase block truncate">
                {lang === 'en' ? 'PRACTICE' : 'ОБУЧЕНИЕ'}
              </span>
              <p className="text-xs sm:text-sm font-black text-white truncate group-hover:text-indigo-200 transition">
                {lang === 'en' ? 'Media Buying' : 'Обучение заливу'}
              </p>
            </div>
          </div>
        </motion.button>
      </motion.section>

      {/* 4. STARTER PACKS (READY SETUPS) BUNDLES SECTION (CAROUSEL BANNER SLIDER) */}
      <StarterPacksSection initialExpanded={true} />

      {/* 5. PROMOS / SPECIAL OFFERS SECTION (INSERTED BETWEEN SETUPS & PROXIES AS REQUESTED) */}
      <section className="my-3 sm:my-4 min-w-0">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gift size={18} className="text-slate-400 shrink-0" />
            <h3 className="text-sm sm:text-base font-black text-white tracking-tight">
              {t('home.promos') || (lang === 'en' ? 'Hot Promos & Special Offers' : 'Горячие Акции и Скидки')}
            </h3>
          </div>
          <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-400/30">
            {promoBanners.length} {lang === 'en' ? 'Deals' : 'Предложения'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 min-w-0">
          {promoBanners.map((promo, idx) => {
            const promoTitle = lang === 'en' && promo.title_en ? promo.title_en : promo.title
            const promoSubtitle = lang === 'en' && promo.subtitle_en ? promo.subtitle_en : (promo.subtitle || promo.description)

            return (
              <motion.button
                key={promo.id || idx}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.open(promo.target_url || 'https://t.me/mediabuy_lab', '_blank')}
                className="group relative overflow-hidden rounded-2xl border border-cyan-400/30 bg-[#091024] text-left transition hover:border-cyan-300/60 shadow-md min-w-0"
              >
                <div
                  className="h-24 sm:h-28 w-full bg-cover bg-center transition duration-300 group-hover:scale-105"
                  style={{ backgroundImage: `url(${promo.image_url})` }}
                />
                <div className="bg-[#0b132c] p-2.5 sm:p-3 min-w-0 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-black text-white break-words group-hover:text-cyan-200 transition truncate">
                      {promoTitle}
                    </p>
                    {promoSubtitle && (
                      <p className="mt-0.5 text-[10px] sm:text-[11px] text-slate-300 break-words line-clamp-1">
                        {promoSubtitle}
                      </p>
                    )}
                  </div>
                  <ExternalLink size={14} className="text-cyan-400 shrink-0 group-hover:text-cyan-200 transition" />
                </div>
              </motion.button>
            )
          })}
        </div>
      </section>

      {/* 6. DEDICATED PROXIES SECTION (CAROUSEL BANNER SLIDER) */}
      <ProxiesSection initialExpanded={false} />

      {/* 7. ARTICLES & KNOWLEDGE SECTION (MOVED HIGHER AS REQUESTED) */}
      <section className="my-3 sm:my-4 min-w-0">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-slate-400 shrink-0" />
            <h3 className="text-sm sm:text-base font-black text-white tracking-tight">
              {t('home.articles') || (lang === 'en' ? 'Media Buying Articles & Cases' : 'Статьи, Кейсы & Мануалы')}
            </h3>
          </div>
          <button
            onClick={() => navigate('/tools')}
            className="flex items-center gap-1 text-[11px] font-bold text-emerald-300 hover:text-emerald-200 transition"
          >
            <span>{lang === 'en' ? 'All Guides' : 'Все статьи'}</span>
            <ArrowRight size={12} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 min-w-0">
          {displayArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* 8. INTERACTIVE MEDIA BUYING BOOK (5 CHAPTERS COMPACT ACCORDION) */}
      <InteractiveKnowledgeBook initialExpanded={false} />

      {/* 9. ACCOUNTS SECTION WITH INTERACTIVE CHIPS & SMOOTH CAROUSEL (MOVED LOWER AS REQUESTED) */}
      <section className="my-3 sm:my-4 min-w-0">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <Zap size={18} className="text-slate-400 shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-white tracking-tight">
                  {t('home.accounts') || (lang === 'en' ? 'Social & Search Accounts' : 'Рекламные Аккаунты')}
                </h3>
                <span className="rounded-full bg-cyan-950 px-1.5 py-0.5 text-[9px] font-bold text-cyan-300 border border-cyan-400/30">
                  {filteredAccounts.length}
                </span>
              </div>
            </div>
          </div>

          {/* Page Controls (Prev/Next) */}
          <div className="flex items-center gap-1.5">
            {accountPages.length > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setAccountsPage((prev) => (prev > 0 ? prev - 1 : accountPages.length - 1))}
                  className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg border border-cyan-400/40 bg-cyan-950/80 text-cyan-300 transition hover:bg-cyan-800 active:scale-90"
                  title={lang === 'en' ? 'Previous page' : 'Предыдущие аккаунты'}
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="text-[10px] font-bold text-slate-400 px-1">
                  {accountsPage + 1}/{accountPages.length}
                </span>
                <button
                  onClick={() => setAccountsPage((prev) => (prev + 1) % accountPages.length)}
                  className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg border border-cyan-400/40 bg-cyan-950/80 text-cyan-300 transition hover:bg-cyan-800 active:scale-90"
                  title={lang === 'en' ? 'Next page' : 'Следующие аккаунты'}
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            )}

            <button
              onClick={() => navigate('/catalog')}
              className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-cyan-300 hover:text-cyan-200 transition shrink-0 ml-1"
            >
              <span>{lang === 'en' ? 'All' : 'Все'}</span>
              <ChevronRight size={13} />
            </button>
          </div>
        </div>

        {/* PLATFORM QUICK FILTER PILLS */}
        <div className="mb-2.5 flex overflow-x-auto gap-1.5 pb-1 scrollbar-none">
          {platformChips.map((chip) => {
            const isActive = activePlatformFilter === chip.id
            return (
              <button
                key={chip.id}
                onClick={() => setActivePlatformFilter(chip.id)}
                className={`shrink-0 flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-[11px] font-bold transition duration-150 ${
                  isActive
                    ? 'border border-cyan-400 bg-cyan-400/20 text-cyan-200 shadow-[0_0_10px_rgba(56,189,248,0.35)]'
                    : 'border border-cyan-500/20 bg-[#09122c]/60 text-slate-300 hover:border-cyan-400/40'
                }`}
              >
                {chip.id !== 'all' && (
                  <PlatformIcon platform={chip.id} size={14} />
                )}
                <span>{chip.label}</span>
                {chip.count > 0 && (
                  <span className={`text-[9px] px-1 rounded-full ${isActive ? 'bg-cyan-400/30 text-cyan-200' : 'bg-black/40 text-slate-400'}`}>
                    {chip.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* ACCOUNTS GRID */}
        <div className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activePlatformFilter}-${accountsPage}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-2.5 min-w-0"
            >
              {visibleProducts.map((product, idx) => (
                <SocialProductTile
                  key={product.id}
                  product={product}
                  compact
                  index={idx}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {visibleProducts.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-400">
              {lang === 'en' ? 'No accounts found for this platform' : 'В данной категории пока нет аккаунтов'}
            </div>
          )}

          {accountPages.length > 1 && (
            <div className="mt-2 flex items-center justify-center gap-1.5">
              {accountPages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setAccountsPage(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === accountsPage
                      ? 'w-4 bg-cyan-300 shadow-[0_0_8px_rgba(56,189,248,0.8)]'
                      : 'w-1.5 bg-cyan-300/30 hover:bg-cyan-300/60'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 10. PROFESSIONAL MEDIA BUYER SUITE (2FA GENERATOR, BIN CHECKER, CHECKLIST) */}
      <HomeToolsBanners initialExpanded={false} />
    </PageShell>
  )
}
