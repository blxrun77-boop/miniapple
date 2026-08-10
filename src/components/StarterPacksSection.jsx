import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { STARTER_PACKS } from '../data/starterPacks'
import { useCart } from '../context/CartContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import {
  PackageCheck,
  Zap,
  Check,
  Plus,
  ArrowRight,
  Info,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Layers,
  LayoutGrid,
  SlidersHorizontal
} from 'lucide-react'
import { PlatformIcon } from './SocialProductTile.jsx'

export default function StarterPacksSection({ standaloneInCatalog = false, initialExpanded = true }) {
  const navigate = useNavigate()
  const { addToCart, items } = useCart()
  const { lang } = useLanguage()
  const [addedIds, setAddedIds] = useState({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [viewMode, setViewMode] = useState('carousel') // 'carousel' | 'grid'
  const [isExpanded, setIsExpanded] = useState(initialExpanded)

  // Touch swipe handling
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const packs = STARTER_PACKS

  // Auto-scroll carousel every 6 seconds (unless paused by hover or touch)
  useEffect(() => {
    if (viewMode !== 'carousel' || isPaused || packs.length <= 1) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % packs.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [viewMode, isPaused, packs.length])

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % packs.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + packs.length) % packs.length)
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
      // Swiped left -> Next
      handleNext()
    } else if (distance < -minSwipeDistance) {
      // Swiped right -> Prev
      handlePrev()
    }
    touchStartX.current = 0
    touchEndX.current = 0
  }

  const handleAddPack = (pack, e) => {
    if (e) e.stopPropagation()
    const packPrice = Number(pack.price ?? pack.bundlePrice ?? 0)
    addToCart({
      id: pack.id,
      title: pack.title,
      title_en: pack.title_en,
      description: pack.description,
      description_en: pack.description_en,
      platform: pack.platform,
      price: packPrice,
      isBundle: true,
      bundleItems: pack.items
    })

    setAddedIds((prev) => ({ ...prev, [pack.id]: true }))
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [pack.id]: false }))
    }, 2000)
  }

  const activePack = packs[currentIndex] || packs[0]

  return (
    <section
      className="my-3 sm:my-4 min-w-0"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* SECTION HEADER */}
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <PackageCheck size={18} className="text-amber-400 shrink-0" />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-white tracking-tight truncate">
                {lang === 'en' ? 'Turnkey Ready Setups' : 'Готовые Сетапы & Бандлы'}
              </h3>
              <span className="inline-flex rounded-full bg-amber-400/20 px-1.5 py-0.5 text-[9px] font-black text-amber-300 border border-amber-400/40 shrink-0">
                1-Click Launch
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 truncate">
              {lang === 'en'
                ? 'Account + Proxy + Cookie + 2FA configured for instant work'
                : 'Аккаунт + Прокси + Куки + 2FA для быстрого старта'}
            </p>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Carousel Arrows */}
          {viewMode === 'carousel' && isExpanded && (
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrev}
                className="flex h-7 w-7 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-950/60 text-amber-300 hover:bg-amber-900/80 active:scale-90 transition"
                title={lang === 'en' ? 'Previous Setup' : 'Предыдущий сетап'}
                aria-label="Previous setup"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                onClick={handleNext}
                className="flex h-7 w-7 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-950/60 text-amber-300 hover:bg-amber-900/80 active:scale-90 transition"
                title={lang === 'en' ? 'Next Setup' : 'Следующий сетап'}
                aria-label="Next setup"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          )}

          {/* Toggle View Mode Button */}
          <button
            onClick={() => setViewMode((m) => (m === 'carousel' ? 'grid' : 'carousel'))}
            className="hidden sm:flex items-center gap-1 rounded-xl border border-amber-400/30 bg-amber-950/40 px-2 py-1 text-[11px] font-bold text-amber-300 hover:bg-amber-900/50 transition"
            title={viewMode === 'carousel' ? (lang === 'en' ? 'Grid view' : 'Сетка') : (lang === 'en' ? 'Slider' : 'Слайдер')}
          >
            {viewMode === 'carousel' ? <LayoutGrid size={13} /> : <SlidersHorizontal size={13} />}
            <span>{viewMode === 'carousel' ? (lang === 'en' ? 'Grid' : 'Сетка') : (lang === 'en' ? 'Slider' : 'Слайдер')}</span>
          </button>

          {!standaloneInCatalog && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 rounded-xl border border-amber-400/30 bg-amber-950/60 px-2.5 py-1 text-xs font-bold text-amber-300 hover:bg-amber-900 transition"
            >
              <span>{isExpanded ? (lang === 'en' ? 'Collapse' : 'Свернуть') : (lang === 'en' ? 'Open' : 'Развернуть')}</span>
              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          )}

          {!standaloneInCatalog && (
            <button
              onClick={() => navigate('/catalog?filter=bundles')}
              className="hidden md:flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-amber-300 transition"
            >
              <span>{lang === 'en' ? 'All Setups' : 'В каталог'}</span>
              <ArrowRight size={13} />
            </button>
          )}
        </div>
      </div>

      {/* QUICK MOBILE TABS (FAST SWITCHING ON PHONES) */}
      {isExpanded && viewMode === 'carousel' && (
        <div className="mb-2 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {packs.map((p, idx) => {
            const pPrice = Number(p.price ?? p.bundlePrice ?? 0)
            const isActive = idx === currentIndex
            return (
              <button
                key={p.id}
                onClick={() => setCurrentIndex(idx)}
                className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? 'border border-amber-400 bg-gradient-to-r from-amber-500/25 to-orange-500/25 text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.3)]'
                    : 'border border-slate-800 bg-[#09112a]/70 text-slate-400 hover:text-slate-200'
                }`}
              >
                <PlatformIcon platform={p.platform} title={p.title} size={14} />
                <span>{p.platform}</span>
                <span className="font-mono text-[11px] font-black text-amber-400">${pPrice.toFixed(0)}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* COMPACT PREVIEW BAR (WHEN COLLAPSED) */}
      {!isExpanded && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-[#1f1504] via-[#1a1104] to-[#0d0902] p-2.5 sm:p-3 shadow-md"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {packs.map((p) => {
                const pPrice = Number(p.price ?? p.bundlePrice ?? 0)
                return (
                  <button
                    key={p.id}
                    onClick={() => navigate(`/product/${p.id}`)}
                    className="flex items-center gap-1.5 rounded-xl bg-black/50 px-2.5 py-1.5 border border-amber-500/20 hover:border-amber-400/60 transition shrink-0"
                  >
                    <PlatformIcon platform={p.platform} title={p.title} size={14} />
                    <span className="text-[11px] font-bold text-slate-200 truncate max-w-[120px]">{p.title.split(' ')[0]}</span>
                    <span className="text-[10px] font-mono font-black text-amber-400">${pPrice.toFixed(2)}</span>
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => setIsExpanded(true)}
              className="flex items-center justify-center gap-1 rounded-xl bg-amber-500/20 px-3 py-1.5 text-xs font-bold text-amber-300 border border-amber-400/30 hover:bg-amber-500/30 transition shrink-0"
            >
              <Sparkles size={12} className="text-amber-400" />
              <span>{lang === 'en' ? 'Show Setups' : 'Развернуть сетапы'}</span>
              <ChevronDown size={13} />
            </button>
          </div>
        </motion.div>
      )}

      {/* EXPANDED CONTENT: BANNER-CAROUSEL OR GRID */}
      {isExpanded && activePack && (
        <div>
          {viewMode === 'carousel' ? (
            /* ================= HORIZONTAL BANNER SLIDER / CAROUSEL ================= */
            <div
              className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-amber-400/40 bg-gradient-to-br from-[#1c1203] via-[#0d1630] to-[#050a1c] shadow-[0_0_25px_rgba(251,191,36,0.18)]"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* SLIDE CONTENT */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePack.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="p-3.5 sm:p-5 space-y-3.5"
                >
                  {/* TOP ROW: PLATFORM + BADGES + SAVINGS */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <div className="flex items-center gap-1.5 rounded-xl bg-black/60 px-2.5 py-1 border border-amber-400/30">
                        <PlatformIcon platform={activePack.platform} title={activePack.title} size={16} />
                        <span className="text-xs font-black uppercase text-amber-300 tracking-wider">
                          {activePack.platform} {lang === 'en' ? 'Setup' : 'Сетап'}
                        </span>
                      </div>

                      <span className="rounded-xl bg-amber-950/90 px-2.5 py-1 text-[10px] font-black text-amber-300 border border-amber-400/40 shadow-sm">
                        {lang === 'en' && activePack.badgeEn ? activePack.badgeEn : (activePack.badge || activePack.discountBadge || 'PRO PACK')}
                      </span>

                      {(activePack.savings || activePack.oldPrice) && (
                        <span className="rounded-xl bg-emerald-950/90 px-2.5 py-1 text-[10px] font-black text-emerald-300 border border-emerald-400/40 shadow-sm">
                          {lang === 'en' ? 'Save' : 'Экономия'} ${activePack.savings || Math.max(0, Math.round((activePack.oldPrice || activePack.originalPrice || 0) - (activePack.price || activePack.bundlePrice || 0)))}
                        </span>
                      )}
                    </div>

                    {activePack.geo && (
                      <span className="text-[11px] font-bold text-slate-300 bg-slate-900/80 px-2.5 py-1 rounded-xl border border-slate-800">
                        {activePack.geo}
                      </span>
                    )}
                  </div>

                  {/* TITLE & DESCRIPTION */}
                  <div className="space-y-1">
                    <h4
                      onClick={() => navigate(`/product/${activePack.id}`)}
                      className="text-sm sm:text-base md:text-lg font-black text-white hover:text-amber-300 transition-colors leading-snug cursor-pointer"
                    >
                      {lang === 'en' && activePack.title_en ? activePack.title_en : activePack.title}
                    </h4>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {lang === 'en' && activePack.description_en ? activePack.description_en : activePack.description}
                    </p>
                  </div>

                  {/* BUNDLE INCLUDED ITEMS (FULL READABLE CHECKLIST ON ALL SCREENS) */}
                  {Array.isArray(activePack.items) && (
                    <div className="rounded-xl sm:rounded-2xl border border-amber-500/25 bg-black/60 p-3 sm:p-3.5 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-black text-amber-300 uppercase tracking-wider">
                        <span>{lang === 'en' ? 'Included in Bundle (All-in-One):' : 'Состав комплекта (Все включено):'}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{activePack.items.length} {lang === 'en' ? 'items' : 'элемента'}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {activePack.items.map((item, i) => {
                          const itemText = typeof item === 'string' ? item : (lang === 'en' && item.name_en ? item.name_en : (item.name || item.name_en))
                          return (
                            <div
                              key={i}
                              className="flex items-start gap-2 rounded-lg bg-[#0a1226]/80 p-2 border border-cyan-500/15 text-[11px] sm:text-xs text-slate-200 leading-snug"
                            >
                              <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/40">
                                <Check size={11} className="stroke-[3]" />
                              </div>
                              <span className="font-medium break-words">{itemText}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* PRICING & ACTION BUTTONS BAR */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-amber-500/20">
                    <div className="flex items-baseline gap-2">
                      <div>
                        {(activePack.oldPrice || activePack.originalPrice) && (
                          <span className="text-[11px] font-bold text-slate-400 line-through block font-mono">
                            ${Number(activePack.oldPrice ?? activePack.originalPrice ?? 0).toFixed(2)} USD
                          </span>
                        )}
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xl sm:text-2xl font-black text-amber-300 font-mono tracking-tight">
                            ${Number(activePack.price ?? activePack.bundlePrice ?? 0).toFixed(2)}
                          </span>
                          <span className="text-[11px] font-bold text-slate-400 uppercase">
                            USD
                          </span>
                        </div>
                      </div>

                      {activePack.stock && (
                        <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-400/30">
                          {lang === 'en' ? `In Stock (${activePack.stock})` : `В наличии: ${activePack.stock} шт`}
                        </span>
                      )}
                    </div>

                    {/* ACTION BUTTONS (BIG & TOUCH FRIENDLY) */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/product/${activePack.id}`)
                        }}
                        className="flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl border border-amber-400/40 bg-amber-950/70 px-3 py-2 text-xs font-bold text-amber-300 hover:bg-amber-900 transition active:scale-95 shrink-0"
                        title={lang === 'en' ? 'View Details' : 'Детали сетапа'}
                      >
                        <Info size={14} />
                        <span>{lang === 'en' ? 'Details' : 'Подробнее'}</span>
                      </button>

                      <motion.button
                        whileTap={{ scale: 0.94 }}
                        onClick={(e) => handleAddPack(activePack, e)}
                        className={`flex min-h-[40px] flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-black shadow-md transition ${
                          addedIds[activePack.id] || items.some((i) => i.id === activePack.id)
                            ? 'bg-amber-400 text-slate-950 shadow-[0_0_15px_rgba(251,191,36,0.6)]'
                            : 'bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 hover:opacity-95 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                        }`}
                      >
                        {addedIds[activePack.id] ? (
                          <>
                            <Check size={15} className="stroke-[3]" />
                            <span>{lang === 'en' ? 'Added to Cart!' : 'Добавлен в корзину!'}</span>
                          </>
                        ) : (
                          <>
                            <Zap size={15} />
                            <span>{lang === 'en' ? 'Buy Turnkey Setup' : 'Купить готовый сетап'}</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* BOTTOM INDICATOR BAR WITH PAGINATION PILLS */}
              <div className="flex items-center justify-between border-t border-amber-500/20 bg-black/50 px-3.5 py-2">
                <div className="flex items-center gap-1.5">
                  {packs.map((p, idx) => (
                    <button
                      key={p.id}
                      onClick={(e) => {
                        e.stopPropagation()
                        setCurrentIndex(idx)
                      }}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx === currentIndex
                          ? 'w-7 bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                          : 'w-2.5 bg-amber-400/30 hover:bg-amber-400/60'
                      }`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold">
                  <span className="hidden xs:inline">
                    {lang === 'en' ? 'Swipe left / right to change setup' : 'Листайте свайпом или переключайте'}
                  </span>
                  <span className="text-amber-300 font-mono font-bold">
                    {currentIndex + 1} / {packs.length}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* ================= GRID VIEW ================= */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 min-w-0">
              {packs.map((pack) => {
                const isAdded = addedIds[pack.id]
                const inCart = items.some((item) => item.id === pack.id)
                const packPrice = Number(pack.price ?? pack.bundlePrice ?? 0)
                const packOldPrice = Number(pack.oldPrice ?? pack.originalPrice ?? 0)
                const packSavings = pack.savings || (packOldPrice > packPrice ? Math.round(packOldPrice - packPrice) : 0)

                return (
                  <motion.div
                    key={pack.id}
                    whileHover={{ y: -3 }}
                    className="group relative flex flex-col justify-between rounded-2xl border border-amber-400/30 bg-gradient-to-b from-[#1c1404] via-[#0e1631] to-[#050a19] p-3.5 shadow-md transition hover:border-amber-400 hover:shadow-[0_0_20px_rgba(251,191,36,0.2)]"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1.5 mb-2">
                        <div className="flex items-center gap-1.5">
                          <PlatformIcon platform={pack.platform} title={pack.title} size={16} />
                          <span className="text-[11px] font-black uppercase text-amber-300">
                            {pack.platform}
                          </span>
                        </div>
                        {packSavings > 0 && (
                          <span className="rounded-lg bg-emerald-500/20 px-2 py-0.5 text-[9px] font-black text-emerald-300 border border-emerald-400/30">
                            {lang === 'en' ? 'Save' : 'Выгода'} ${packSavings}
                          </span>
                        )}
                      </div>

                      <h4
                        onClick={() => navigate(`/product/${pack.id}`)}
                        className="text-xs sm:text-sm font-black text-white group-hover:text-amber-300 transition-colors leading-snug cursor-pointer"
                      >
                        {lang === 'en' && pack.title_en ? pack.title_en : pack.title}
                      </h4>

                      <p className="mt-1 text-[11px] sm:text-xs text-slate-300 leading-relaxed">
                        {lang === 'en' && pack.description_en ? pack.description_en : pack.description}
                      </p>

                      {Array.isArray(pack.items) && (
                        <div className="my-2.5 space-y-1.5 rounded-xl bg-black/50 p-2.5 border border-amber-500/20 text-[11px]">
                          {pack.items.map((item, i) => {
                            const itemText = typeof item === 'string' ? item : (lang === 'en' && item.name_en ? item.name_en : (item.name || item.name_en))
                            return (
                              <div key={i} className="flex items-start gap-1.5 text-slate-200">
                                <Check size={12} className="text-amber-400 shrink-0 mt-0.5 stroke-[2.5]" />
                                <span className="leading-snug">{itemText}</span>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>

                    <div className="mt-2 pt-2.5 border-t border-amber-500/20 flex items-center justify-between gap-2">
                      <div>
                        {packOldPrice > 0 && (
                          <span className="text-[9px] font-bold text-slate-400 line-through block font-mono">
                            ${packOldPrice.toFixed(2)}
                          </span>
                        )}
                        <div className="text-sm sm:text-base font-black text-amber-300 font-mono">
                          ${packPrice.toFixed(2)} USD
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => navigate(`/product/${pack.id}`)}
                          className="flex h-8 w-8 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-950/40 text-amber-300 hover:bg-amber-900 transition"
                          title={lang === 'en' ? 'Details' : 'Детали'}
                        >
                          <Info size={14} />
                        </button>
                        <motion.button
                          whileTap={{ scale: 0.92 }}
                          onClick={(e) => handleAddPack(pack, e)}
                          className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-black shadow-md transition ${
                            isAdded || inCart
                              ? 'bg-amber-400 text-slate-950'
                              : 'bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 hover:opacity-95'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check size={13} className="stroke-[3]" />
                              <span>{lang === 'en' ? 'Added' : 'Взят'}</span>
                            </>
                          ) : (
                            <>
                              <Zap size={13} />
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
