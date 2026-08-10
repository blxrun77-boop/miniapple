import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { PROXY_PRODUCTS } from '../data/starterPacks'
import { useCart } from '../context/CartContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import {
  Globe,
  Zap,
  Check,
  RefreshCw,
  Gauge,
  Server,
  ArrowRight,
  Info,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Sparkles,
  LayoutGrid,
  SlidersHorizontal,
  ShieldCheck
} from 'lucide-react'
import { PlatformIcon } from './SocialProductTile.jsx'

export default function ProxiesSection({ standaloneInCatalog = false, initialExpanded = false }) {
  const navigate = useNavigate()
  const { addToCart, items } = useCart()
  const { lang } = useLanguage()
  const [addedIds, setAddedIds] = useState({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [viewMode, setViewMode] = useState('carousel') // 'carousel' | 'grid'
  const [isExpanded, setIsExpanded] = useState(standaloneInCatalog ? true : initialExpanded)

  // Touch swipe handling
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const proxies = PROXY_PRODUCTS

  // Auto-rotate carousel every 6 seconds (unless paused by hover or touch)
  useEffect(() => {
    if (viewMode !== 'carousel' || isPaused || proxies.length <= 1 || !isExpanded) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % proxies.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [viewMode, isPaused, proxies.length, isExpanded])

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % proxies.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + proxies.length) % proxies.length)
  }

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX
  }

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return
    const distance = touchStartX.current - touchEndX.current
    const minSwipeDistance = 40
    if (distance > minSwipeDistance) {
      handleNext()
    } else if (distance < -minSwipeDistance) {
      handlePrev()
    }
    touchStartX.current = 0
    touchEndX.current = 0
  }

  const handleAddProxy = (proxy, e) => {
    if (e) e.stopPropagation()
    addToCart({
      id: proxy.id,
      title: proxy.title,
      title_en: proxy.title_en,
      description: proxy.description,
      description_en: proxy.description_en,
      platform: 'Proxy',
      price: proxy.price
    })

    setAddedIds((prev) => ({ ...prev, [proxy.id]: true }))
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [proxy.id]: false }))
    }, 2000)
  }

  const activeProxy = proxies[currentIndex] || proxies[0]

  return (
    <section
      className="my-3 sm:my-4 min-w-0"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* HEADER WITH CONTROLS */}
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Globe size={18} className="text-slate-400 shrink-0" />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-white tracking-tight truncate">
                {lang === 'en' ? 'Private Dedicated Proxies' : 'Приватные Прокси (Мобильные & ISP)'}
              </h3>
              <span className="hidden xs:inline-flex rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-black text-emerald-300 border border-emerald-400/40 shrink-0">
                ⚡ 99.9% Uptime
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 truncate">
              {lang === 'en'
                ? 'Clean IP pools for Dolphin, AdsPower & Octo'
                : 'Чистые пулы под Dolphin, AdsPower и Octo'}
            </p>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Carousel Arrows */}
          {viewMode === 'carousel' && isExpanded && (
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrev}
                className="flex h-7 w-7 items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/80 active:scale-90 transition"
                title={lang === 'en' ? 'Previous Proxy' : 'Предыдущий прокси'}
                aria-label="Previous proxy"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                onClick={handleNext}
                className="flex h-7 w-7 items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/80 active:scale-90 transition"
                title={lang === 'en' ? 'Next Proxy' : 'Следующий прокси'}
                aria-label="Next proxy"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          )}

          {/* Toggle View Mode */}
          {isExpanded && (
            <button
              onClick={() => setViewMode((m) => (m === 'carousel' ? 'grid' : 'carousel'))}
              className="hidden sm:flex items-center gap-1 rounded-xl border border-emerald-400/30 bg-emerald-950/40 px-2 py-1 text-[11px] font-bold text-emerald-300 hover:bg-emerald-900/50 transition"
              title={viewMode === 'carousel' ? (lang === 'en' ? 'Grid view' : 'Сетка') : (lang === 'en' ? 'Slider' : 'Слайдер')}
            >
              {viewMode === 'carousel' ? <LayoutGrid size={13} /> : <SlidersHorizontal size={13} />}
              <span>{viewMode === 'carousel' ? (lang === 'en' ? 'Grid' : 'Сетка') : (lang === 'en' ? 'Slider' : 'Слайдер')}</span>
            </button>
          )}

          {!standaloneInCatalog && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 rounded-xl border border-emerald-500/40 bg-emerald-950/70 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-900 transition shadow-sm"
            >
              <span>
                {isExpanded
                  ? (lang === 'en' ? 'Collapse' : 'Свернуть')
                  : (lang === 'en' ? '4 Tariffs' : '4 тарифа')}
              </span>
              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          )}

          {!standaloneInCatalog && (
            <button
              onClick={() => navigate('/catalog?filter=proxies')}
              className="hidden md:flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-emerald-300 transition"
            >
              <span>{lang === 'en' ? 'All Proxies' : 'В каталог'}</span>
              <ArrowRight size={13} />
            </button>
          )}
        </div>
      </div>

      {/* COMPACT PREVIEW BAR (WHEN COLLAPSED) */}
      {!isExpanded && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-[#051c15] via-[#07241c] to-[#041210] p-2.5 sm:p-3 shadow-md"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-1.5 sm:gap-2">
              {proxies.map((proxy) => (
                <div
                  key={proxy.id}
                  onClick={() => navigate(`/product/${proxy.id}`)}
                  className="flex items-center justify-between sm:justify-start gap-1.5 rounded-xl bg-black/50 px-2.5 py-1.5 border border-emerald-500/20 hover:border-emerald-400/50 cursor-pointer transition"
                >
                  <div className="flex items-center gap-1 truncate">
                    <span className="text-[11px]">{proxy.geo.split(' ')[0]}</span>
                    <span className="text-[10px] font-bold text-slate-200 truncate">{proxy.title.split(' ')[0]}</span>
                  </div>
                  <span className="text-[10px] font-mono font-black text-emerald-400 shrink-0">
                    ${proxy.price.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setIsExpanded(true)}
              className="flex items-center justify-center gap-1 rounded-xl bg-emerald-500/20 px-3 py-1.5 text-xs font-bold text-emerald-300 border border-emerald-400/30 hover:bg-emerald-500/30 transition shrink-0"
            >
              <Sparkles size={12} className="text-emerald-400" />
              <span>{lang === 'en' ? 'Show Specs' : 'Характеристики & Пинг'}</span>
              <ChevronDown size={13} />
            </button>
          </div>
        </motion.div>
      )}

      {/* EXPANDED CONTENT: HORIZONTAL SLIDER OR FULL GRID */}
      {isExpanded && (
        <div>
          {viewMode === 'carousel' ? (
            /* ================= HORIZONTAL PROXY BANNER SLIDER ================= */
            <div
              className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-emerald-400/40 bg-gradient-to-br from-[#041d15] via-[#06241e] to-[#030d09] shadow-[0_0_25px_rgba(52,211,153,0.18)]"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* SLIDE CONTENT */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProxy.id}
                  initial={{ opacity: 0, x: 25 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -25 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  onClick={() => navigate(`/product/${activeProxy.id}`)}
                  className="group relative cursor-pointer p-3.5 sm:p-5"
                >
                  {/* Subtle Background Glows */}
                  <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-emerald-500/15 blur-3xl" />
                  <div className="pointer-events-none absolute -left-10 -bottom-10 h-36 w-36 rounded-full bg-teal-500/15 blur-3xl" />

                  <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center">
                    {/* LEFT / TOP: TYPE, TITLE & SPECS */}
                    <div className="md:col-span-7 space-y-2 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Clean Frameless Platform Icon & Label */}
                        <div className="flex items-center gap-1.5">
                          <PlatformIcon platform="Proxy" title={activeProxy.title} size={18} />
                          <span className="text-[11px] sm:text-xs font-black uppercase text-emerald-300 tracking-wider">
                            {activeProxy.proxy_type}
                          </span>
                        </div>

                        <span className="rounded-full bg-emerald-950/80 px-2 py-0.5 text-[9px] font-black text-emerald-200 border border-emerald-400/40">
                          {activeProxy.geo}
                        </span>

                        <span className="rounded-full bg-teal-950/80 px-2 py-0.5 text-[9px] font-black text-teal-300 border border-teal-400/40">
                          {activeProxy.protocol}
                        </span>
                      </div>

                      <h4 className="text-sm sm:text-base md:text-lg font-black text-white group-hover:text-emerald-300 transition-colors leading-tight">
                        {lang === 'en' ? activeProxy.title_en : activeProxy.title}
                      </h4>

                      <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed line-clamp-2">
                        {lang === 'en' ? activeProxy.description_en : activeProxy.description}
                      </p>

                      {/* TECH SPECS PILLS */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
                        <div className="flex items-center gap-1.5 rounded-lg bg-black/50 px-2 py-1 border border-emerald-500/20 text-[10px] text-slate-200">
                          <Zap size={11} className="text-amber-400 shrink-0" />
                          <span className="truncate">{activeProxy.speed}</span>
                        </div>
                        <div className="flex items-center gap-1.5 rounded-lg bg-black/50 px-2 py-1 border border-emerald-500/20 text-[10px] text-slate-200">
                          <Gauge size={11} className="text-cyan-400 shrink-0" />
                          <span className="truncate">Ping: {activeProxy.ping}</span>
                        </div>
                        <div className="flex items-center gap-1.5 rounded-lg bg-black/50 px-2 py-1 border border-emerald-500/20 text-[10px] text-slate-200">
                          <Server size={11} className="text-emerald-400 shrink-0" />
                          <span className="truncate">{activeProxy.protocol}</span>
                        </div>
                        <div className="flex items-center gap-1.5 rounded-lg bg-black/50 px-2 py-1 border border-emerald-500/20 text-[10px] text-slate-200">
                          <RefreshCw size={11} className="text-teal-400 shrink-0" />
                          <span className="truncate">{activeProxy.rotation.split('/')[0]}</span>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT / BOTTOM: PRICE, CTA & DETAIL BUTTON */}
                    <div className="md:col-span-5 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 pt-2 md:pt-0 border-t md:border-t-0 md:border-l border-emerald-500/20 md:pl-4">
                      <div className="text-left md:text-right">
                        <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">
                          {lang === 'en' ? 'Tariff Price' : 'Стоимость тарифа'}
                        </span>
                        <div className="flex items-baseline md:justify-end gap-1">
                          <span className="text-base sm:text-xl md:text-2xl font-black text-emerald-300 font-mono">
                            ${activeProxy.price.toFixed(2)}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">
                            USD
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/product/${activeProxy.id}`)
                          }}
                          className="flex items-center gap-1 rounded-xl border border-emerald-400/30 bg-emerald-950/60 px-2.5 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-900 transition"
                          title={lang === 'en' ? 'View Details' : 'Детали прокси'}
                        >
                          <Info size={13} />
                          <span className="hidden sm:inline">{lang === 'en' ? 'Details' : 'Детали'}</span>
                        </button>

                        <motion.button
                          whileTap={{ scale: 0.92 }}
                          onClick={(e) => handleAddProxy(activeProxy, e)}
                          className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-black shadow-md transition ${
                            addedIds[activeProxy.id] || items.some((i) => i.id === activeProxy.id)
                              ? 'bg-emerald-400 text-slate-950 shadow-[0_0_12px_rgba(52,211,153,0.6)]'
                              : 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 hover:opacity-95'
                          }`}
                        >
                          {addedIds[activeProxy.id] ? (
                            <>
                              <Check size={13} className="stroke-[3]" />
                              <span>{lang === 'en' ? 'Added!' : 'Взят!'}</span>
                            </>
                          ) : (
                            <>
                              <Zap size={13} />
                              <span>{lang === 'en' ? 'Buy Proxy' : 'Купить прокси'}</span>
                            </>
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* BOTTOM INDICATOR BAR WITH PAGINATION PILLS */}
              <div className="flex items-center justify-between border-t border-emerald-500/20 bg-black/40 px-3.5 py-1.5">
                <div className="flex items-center gap-1.5">
                  {proxies.map((p, idx) => (
                    <button
                      key={p.id}
                      onClick={(e) => {
                        e.stopPropagation()
                        setCurrentIndex(idx)
                      }}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === currentIndex
                          ? 'w-6 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                          : 'w-2 bg-emerald-400/30 hover:bg-emerald-400/60'
                      }`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold">
                  <span className="hidden xs:inline">
                    {lang === 'en' ? 'Swipe left / right or use arrows' : 'Листайте свайпом или стрелками'}
                  </span>
                  <span className="text-emerald-300 font-mono font-bold">
                    {currentIndex + 1} / {proxies.length}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* ================= GRID VIEW ================= */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 min-w-0">
              {proxies.map((proxy) => {
                const isAdded = addedIds[proxy.id]
                const inCart = items.some((item) => item.id === proxy.id)

                return (
                  <motion.div
                    key={proxy.id}
                    whileHover={{ y: -3 }}
                    onClick={() => navigate(`/product/${proxy.id}`)}
                    className="group relative flex flex-col justify-between rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-[#06241b]/90 via-[#071726]/90 to-[#030a14] p-3 sm:p-3.5 shadow-md backdrop-blur-md transition hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(52,211,153,0.2)] cursor-pointer"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5">
                          <PlatformIcon platform="Proxy" title={proxy.title} size={15} />
                          <span className="text-[10px] font-extrabold text-emerald-300">
                            {proxy.proxy_type}
                          </span>
                        </div>

                        <span className="rounded-lg bg-emerald-950/80 px-2 py-0.5 text-[9px] font-black text-emerald-200 border border-emerald-400/30">
                          {proxy.geo}
                        </span>
                      </div>

                      <h4 className="text-xs sm:text-sm font-black text-white leading-snug group-hover:text-emerald-300 transition-colors break-words">
                        {lang === 'en' ? proxy.title_en : proxy.title}
                      </h4>

                      <div className="grid grid-cols-2 gap-1 rounded-xl bg-black/50 p-2 border border-emerald-500/20 text-[9px]">
                        <div className="flex items-center gap-1 text-slate-300">
                          <Zap size={10} className="text-amber-400 shrink-0" />
                          <span className="truncate">{proxy.speed}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-300">
                          <Gauge size={10} className="text-cyan-400 shrink-0" />
                          <span className="truncate">Ping: {proxy.ping}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-300">
                          <Server size={10} className="text-emerald-400 shrink-0" />
                          <span className="truncate">{proxy.protocol}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-300">
                          <RefreshCw size={10} className="text-teal-400 shrink-0" />
                          <span className="truncate">{proxy.rotation.split('/')[0]}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-emerald-500/20 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[8px] font-bold text-slate-400 block uppercase tracking-wider">
                          {lang === 'en' ? 'Price' : 'Цена'}
                        </span>
                        <div className="text-xs sm:text-sm font-black text-emerald-300 font-mono">
                          ${proxy.price.toFixed(2)} USD
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/product/${proxy.id}`)
                          }}
                          className="flex h-7 w-7 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900 transition"
                        >
                          <Info size={13} />
                        </button>

                        <motion.button
                          whileTap={{ scale: 0.92 }}
                          onClick={(e) => handleAddProxy(proxy, e)}
                          className={`flex items-center gap-1 rounded-xl px-2.5 py-1 text-[11px] font-black shadow-md transition ${
                            isAdded || inCart
                              ? 'bg-emerald-400 text-slate-950'
                              : 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 hover:opacity-95'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check size={12} className="stroke-[3]" />
                              <span>{lang === 'en' ? 'Added' : 'Взят'}</span>
                            </>
                          ) : (
                            <>
                              <Zap size={12} />
                              <span>{lang === 'en' ? 'Buy' : 'Купить'}</span>
                            </>
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
