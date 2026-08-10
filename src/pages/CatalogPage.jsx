import { useEffect, useState, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import api from '../api/client'
import PageShell from '../components/PageShell.jsx'
import SocialProductTile from '../components/SocialProductTile.jsx'
import StarterPacksSection from '../components/StarterPacksSection.jsx'
import ProxiesSection from '../components/ProxiesSection.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import {
  PackageCheck,
  Globe,
  Layers,
  Filter,
  Search,
  X,
  ArrowUpDown,
  Sparkles,
  CheckCircle2,
  SlidersHorizontal,
  Grid,
  ListFilter
} from 'lucide-react'

const defaultCategories = [
  { id: 1, name: 'Twitter (X)', slug: 'accounts-twitter' },
  { id: 2, name: 'Google', slug: 'accounts-google' },
  { id: 3, name: 'Facebook', slug: 'accounts-facebook' },
  { id: 4, name: 'TikTok', slug: 'accounts-tiktok' },
  { id: 5, name: 'Яндекс', slug: 'accounts-yandex' },
  { id: 6, name: 'Приватные Прокси', slug: 'proxies' },
  { id: 7, name: 'Готовые Сетапы', slug: 'starter-packs' }
]

const fallbackProducts = [
  {
    id: 1,
    category_id: 4,
    title: 'TikTok Ads Agency Account (US/EU)',
    title_en: 'TikTok Ads Agency Account (US/EU)',
    description: 'Агентский аккаунт TikTok Ads с прогретым профилем, готовый к запуску рекламы без лимитов и банов.',
    description_en: 'TikTok Ads Agency account with warmed profile, ready for ad launch without limits or bans.',
    platform: 'TikTok',
    geo: 'US / EU 🌐',
    format: 'Login:Pass:2FA:Cookies',
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
    format: 'Login:Pass:2FA:Cookies',
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
    format: 'Admin Invite + Login:Pass',
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
    format: 'Email:Pass:2FA:Cookies',
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
    format: 'Login:Pass:2FA:Cookies(JSON)',
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
    format: 'Login:Pass:AuthToken:Cookies',
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
    format: 'Login:Pass:Secret',
    price: 24.00,
    is_visible: true
  }
]

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { t, lang } = useLanguage()
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGeo, setSelectedGeo] = useState('all')
  const [sortBy, setSortBy] = useState('default') // 'default' | 'price_asc' | 'price_desc'

  useEffect(() => {
    const filterQuery = searchParams.get('filter')
    if (filterQuery === 'proxies' || filterQuery === '6') {
      setSelectedCategory('proxies')
    } else if (filterQuery === 'bundles' || filterQuery === 'starter-packs' || filterQuery === 'setups' || filterQuery === '7') {
      setSelectedCategory('bundles')
    }
  }, [searchParams])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get('/catalog/categories').catch(() => ({ data: [] })),
          api.get('/catalog/products').catch(() => ({ data: [] }))
        ])
        setCategories(catRes.data?.length ? catRes.data : defaultCategories)
        setProducts(prodRes.data?.length ? prodRes.data : fallbackProducts)
      } catch (err) {
        console.error(err)
        setCategories(defaultCategories)
        setProducts(fallbackProducts)
      }
    }
    fetchData()
  }, [])

  const allItems = products.length ? products : fallbackProducts

  // Filter products based on selected category tab, search query, and GEO filter
  const filteredProducts = useMemo(() => {
    return allItems.filter((p) => {
      // Category filter
      if (selectedCategory === 'bundles') {
        if (!(p.category_id === 7 || p.id === 101 || p.id === 102 || p.id === 103)) return false
      } else if (selectedCategory === 'proxies') {
        if (!(p.category_id === 6 || p.platform === 'Proxy' || (p.id >= 301 && p.id <= 304))) return false
      } else if (selectedCategory !== 'all') {
        if (String(p.category_id) !== String(selectedCategory)) return false
      } else {
        // In 'all', exclude starter packs from regular card grid (as they are shown in StarterPacksSection)
        if (p.category_id === 7 || p.id === 101 || p.id === 102 || p.id === 103) return false
      }

      // Geo filter
      if (selectedGeo !== 'all') {
        const itemGeo = (p.geo || '').toLowerCase()
        if (selectedGeo === 'us' && !itemGeo.includes('us')) return false
        if (selectedGeo === 'eu' && !itemGeo.includes('eu')) return false
        if (selectedGeo === 'ww' && !itemGeo.includes('ww') && !itemGeo.includes('все') && !itemGeo.includes('глобал')) return false
        if (selectedGeo === 'ru' && !itemGeo.includes('ru') && !itemGeo.includes('cis') && !itemGeo.includes('рф')) return false
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const matchTitle = (p.title || '').toLowerCase().includes(query) || (p.title_en || '').toLowerCase().includes(query)
        const matchDesc = (p.description || '').toLowerCase().includes(query) || (p.description_en || '').toLowerCase().includes(query)
        const matchPlatform = (p.platform || '').toLowerCase().includes(query)
        const matchGeo = (p.geo || '').toLowerCase().includes(query)
        if (!matchTitle && !matchDesc && !matchPlatform && !matchGeo) return false
      }

      return true
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return Number(a.price) - Number(b.price)
      if (sortBy === 'price_desc') return Number(b.price) - Number(a.price)
      return 0
    })
  }, [allItems, selectedCategory, selectedGeo, searchQuery, sortBy])

  // Count items per category
  const getCategoryCount = (catId) => {
    if (catId === 'all') return allItems.filter(p => p.category_id !== 7 && p.id !== 101 && p.id !== 102 && p.id !== 103).length
    if (catId === 'bundles') return 3
    if (catId === 'proxies') return 4
    return allItems.filter(p => String(p.category_id) === String(catId)).length
  }

  const handleResetFilters = () => {
    setSelectedCategory('all')
    setSearchQuery('')
    setSelectedGeo('all')
    setSortBy('default')
  }

  return (
    <PageShell title={t('catalog.title') || (lang === 'en' ? 'Accounts & Consumables Catalog' : 'Каталог аккаунтов и расходников')}>
      {/* SEARCH AND FILTER TOOLBAR */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-3 space-y-2"
      >
        {/* Search Bar with clear button */}
        <div className="relative flex items-center">
          <div className="pointer-events-none absolute left-3 text-cyan-400">
            <Search size={15} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              lang === 'en'
                ? 'Search accounts, TikTok, Google, proxies, US, EU...'
                : 'Поиск по названию, TikTok, Google, прокси, US, EU...'
            }
            className="w-full rounded-2xl border border-cyan-500/30 bg-[#07112b]/90 py-2.5 pl-9 pr-8 text-xs font-semibold text-white placeholder-slate-400 shadow-inner backdrop-blur-md outline-none transition focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(56,189,248,0.25)]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-slate-300 hover:text-white"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* SUB-FILTERS: GEO & SORT ROW */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs">
          {/* GEO FILTER PILLS */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
            <span className="text-[10px] font-black uppercase text-slate-400 shrink-0 mr-0.5">GEO:</span>
            {[
              { id: 'all', label: lang === 'en' ? 'All' : 'Все' },
              { id: 'us', label: 'US 🇺🇸' },
              { id: 'eu', label: 'EU 🇪🇺' },
              { id: 'ww', label: 'WW 🌐' },
              { id: 'ru', label: 'RU 🇷🇺' }
            ].map((geo) => (
              <button
                key={geo.id}
                onClick={() => setSelectedGeo(geo.id)}
                className={`shrink-0 rounded-xl px-2 py-0.5 text-[10px] font-bold transition ${
                  selectedGeo === geo.id
                    ? 'border border-cyan-400 bg-cyan-400/25 text-cyan-200 shadow-sm'
                    : 'border border-cyan-500/20 bg-black/40 text-slate-400 hover:border-cyan-400/30'
                }`}
              >
                {geo.label}
              </button>
            ))}
          </div>

          {/* SORT DROPDOWN */}
          <div className="flex items-center gap-1 shrink-0">
            <ArrowUpDown size={12} className="text-cyan-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-cyan-500/30 bg-[#07112b] px-2 py-1 text-[10px] font-bold text-cyan-300 outline-none cursor-pointer"
            >
              <option value="default">{lang === 'en' ? 'Sort: Popular' : 'Сортировка: Топ'}</option>
              <option value="price_asc">{lang === 'en' ? 'Price: Low to High' : 'Сначала дешевле'}</option>
              <option value="price_desc">{lang === 'en' ? 'Price: High to Low' : 'Сначала дороже'}</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* CATEGORY FILTER CHIPS WITH MOTION */}
      <div className="mb-4 flex overflow-x-auto gap-1.5 pb-1 scrollbar-none">
        {/* ALL TAB */}
        <button
          onClick={() => setSelectedCategory('all')}
          className={`shrink-0 flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-black transition ${
            selectedCategory === 'all'
              ? 'border-cyan-400 bg-cyan-400/20 text-cyan-300 shadow-[0_0_12px_rgba(56,189,248,0.35)]'
              : 'border-cyan-500/20 bg-[#09122c]/60 text-slate-300 hover:border-cyan-400/40'
          }`}
        >
          <Layers size={13} />
          <span>{lang === 'en' ? 'All Items' : 'Все товары'}</span>
          <span className="text-[9px] rounded-full bg-cyan-950 px-1.5 py-0.2 border border-cyan-400/30">
            {getCategoryCount('all')}
          </span>
        </button>

        {/* STARTER PACKS (BUNDLES) TAB */}
        <button
          onClick={() => setSelectedCategory('bundles')}
          className={`shrink-0 flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-black transition ${
            selectedCategory === 'bundles'
              ? 'border-amber-400 bg-amber-400/25 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.4)]'
              : 'border-amber-500/30 bg-amber-950/40 text-amber-300 hover:border-amber-400/50'
          }`}
        >
          <PackageCheck size={13} className="text-amber-400" />
          <span>{lang === 'en' ? '📦 Ready Setups' : '📦 Готовые Сетапы'}</span>
          <span className="text-[9px] rounded-full bg-amber-950 px-1.5 py-0.2 border border-amber-400/30 text-amber-300">
            3
          </span>
        </button>

        {/* PROXIES TAB */}
        <button
          onClick={() => setSelectedCategory('proxies')}
          className={`shrink-0 flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-black transition ${
            selectedCategory === 'proxies'
              ? 'border-emerald-400 bg-emerald-400/25 text-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.4)]'
              : 'border-emerald-500/30 bg-emerald-950/40 text-emerald-300 hover:border-emerald-400/50'
          }`}
        >
          <Globe size={13} className="text-emerald-400" />
          <span>{lang === 'en' ? '🔌 Private Proxies' : '🔌 Приватные Прокси'}</span>
          <span className="text-[9px] rounded-full bg-emerald-950 px-1.5 py-0.2 border border-emerald-400/30 text-emerald-300">
            4
          </span>
        </button>

        {/* REGULAR SOCIAL CATEGORIES */}
        {categories
          .filter((cat) => cat.slug !== 'proxies' && cat.slug !== 'starter-packs' && cat.id !== 6 && cat.id !== 7)
          .map((cat) => {
            const catName = (lang === 'en' && cat.name_en)
              ? cat.name_en
              : (lang === 'en' && cat.name === 'Яндекс' ? 'Yandex' : (lang === 'en' && cat.name?.startsWith('Аккаунты ') ? cat.name.replace('Аккаунты ', '') : cat.name))

            const isSelected = String(selectedCategory) === String(cat.id)

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`shrink-0 flex items-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-400/20 text-cyan-300 shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                    : 'border-cyan-500/20 bg-[#09122c]/60 text-slate-300 hover:border-cyan-400/40'
                }`}
              >
                <span>{catName}</span>
                <span className={`text-[9px] rounded-full px-1.5 ${isSelected ? 'bg-cyan-950 text-cyan-200 border border-cyan-400/30' : 'bg-black/40 text-slate-400'}`}>
                  {getCategoryCount(cat.id)}
                </span>
              </button>
            )
          })}
      </div>

      {/* ACTIVE FILTERS SUMMARY (IF ANY) */}
      {(searchQuery || selectedGeo !== 'all' || selectedCategory !== 'all') && (
        <div className="mb-3 flex items-center justify-between rounded-xl bg-cyan-950/40 px-3 py-1.5 border border-cyan-500/20 text-[11px]">
          <div className="flex items-center gap-1.5 text-cyan-300 font-semibold truncate">
            <Sparkles size={12} className="text-cyan-400 shrink-0" />
            <span className="truncate">
              {lang === 'en' ? 'Found' : 'Найдено'}: <strong className="text-white">{filteredProducts.length}</strong> {lang === 'en' ? 'items' : 'товаров'}
            </span>
          </div>
          <button
            onClick={handleResetFilters}
            className="text-[10px] font-bold text-rose-300 hover:text-rose-200 underline shrink-0 ml-2"
          >
            {lang === 'en' ? 'Reset all' : 'Сбросить фильтры'}
          </button>
        </div>
      )}

      {/* RENDER STARTER PACKS IF 'all' OR 'bundles' IS ACTIVE */}
      {(selectedCategory === 'all' || selectedCategory === 'bundles') && !searchQuery && selectedGeo === 'all' && (
        <div className="mb-4">
          <StarterPacksSection standaloneInCatalog={selectedCategory === 'bundles'} />
        </div>
      )}

      {/* RENDER PROXIES SECTION IF 'all' OR 'proxies' IS ACTIVE */}
      {(selectedCategory === 'all' || selectedCategory === 'proxies') && !searchQuery && (
        <div className="mb-4">
          <ProxiesSection standaloneInCatalog={selectedCategory === 'proxies'} initialExpanded={selectedCategory === 'proxies'} />
        </div>
      )}

      {/* SINGLE ACCOUNTS / PRODUCTS GRID */}
      {selectedCategory !== 'bundles' && selectedCategory !== 'proxies' && (
        <section className="mt-2 min-w-0">
          <div className="mb-2.5 flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
              <Filter size={15} className="text-cyan-400" />
              <span>
                {selectedCategory === 'all'
                  ? (lang === 'en' ? 'Direct Accounts & Farms' : 'Одиночные аккаунты и фармы')
                  : (lang === 'en' ? 'Selected Category Accounts' : 'Аккаунты выбранной категории')}
              </span>
            </h3>
            <span className="text-[11px] font-bold text-slate-400">
              {filteredProducts.filter(p => p.platform !== 'Proxy').length} {lang === 'en' ? 'items' : 'товаров'}
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedCategory}-${searchQuery}-${selectedGeo}-${sortBy}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-3.5 min-w-0"
            >
              {filteredProducts
                .filter(p => p.platform !== 'Proxy' && p.category_id !== 6 && p.category_id !== 7)
                .map((product, idx) => (
                  <SocialProductTile
                    key={product.id}
                    product={product}
                    index={idx}
                  />
                ))}
            </motion.div>
          </AnimatePresence>
        </section>
      )}

      {/* EMPTY SEARCH / FILTER STATE */}
      {filteredProducts.length === 0 && selectedCategory !== 'bundles' && selectedCategory !== 'proxies' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="my-8 flex flex-col items-center justify-center rounded-2xl border border-cyan-500/20 bg-[#07112b]/60 p-6 text-center shadow-md"
        >
          <Search size={36} className="text-slate-500 mb-2" />
          <h4 className="text-sm font-bold text-white mb-1">
            {lang === 'en' ? 'No matching products found' : 'По вашему запросу ничего не найдено'}
          </h4>
          <p className="text-xs text-slate-400 mb-3 max-w-sm">
            {lang === 'en'
              ? 'Try changing your search terms or reset the GEO filter.'
              : 'Попробуйте изменить поисковый запрос или сбросить фильтр по ГЕО.'}
          </p>
          <button
            onClick={handleResetFilters}
            className="rounded-xl border border-cyan-400/40 bg-cyan-950/80 px-4 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-900 transition"
          >
            {lang === 'en' ? 'Reset Filters' : 'Сбросить все фильтры'}
          </button>
        </motion.div>
      )}
    </PageShell>
  )
}
