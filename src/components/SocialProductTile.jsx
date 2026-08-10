import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { ShoppingCart, Check, Zap, Eye } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { useCart } from '../context/CartContext'

export function GoogleLogo({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`shrink-0 ${className}`}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
    </svg>
  )
}

export function TikTokLogo({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`shrink-0 ${className}`}>
      <path
        d="M19.5 7.05a5.5 5.5 0 0 1-3.6-1.55v9.1a5.6 5.6 0 1 1-5.6-5.6c.38 0 .74.04 1.1.12v3.13a2.5 2.5 0 1 0 1.5 2.35V2h3a5.5 5.5 0 0 0 3.6 4.05v1z"
        fill="#25F4EE"
      />
      <path
        d="M18.8 6.5a5.5 5.5 0 0 1-3.6-1.55v9.1a5.6 5.6 0 1 1-5.6-5.6c.38 0 .74.04 1.1.12V11.7a2.5 2.5 0 1 0 1.5 2.35V1.5h3a5.5 5.5 0 0 0 3.6 4.05v.95z"
        fill="#FE2C55"
      />
      <path
        d="M19.15 6.75a5.5 5.5 0 0 1-3.6-1.55v9.1a5.6 5.6 0 1 1-5.6-5.6c.38 0 .74.04 1.1.12v3.13a2.5 2.5 0 1 0 1.5 2.35V1.75h3a5.5 5.5 0 0 0 3.6 4.05v.95z"
        fill="#FFFFFF"
      />
    </svg>
  )
}

export function FacebookLogo({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`shrink-0 ${className}`}>
      <path
        d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2z"
        fill="#1877F2"
      />
    </svg>
  )
}

export function TwitterLogo({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`shrink-0 ${className}`}>
      <path
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
        fill="#38bdf8"
      />
    </svg>
  )
}

export function YandexLogo({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`shrink-0 ${className}`}>
      <path
        d="M14.5 3h-3.5c-3.5 0-5.5 2-5.5 5 0 2.8 1.4 4.3 3.8 6.2L4.5 21h4.2l4.4-6.2h.9V21H18V3h-3.5zm-.5 8.2h-1c-1.6 0-2.6-.9-2.6-2.2 0-1.4 1-2.2 2.6-2.2h1v4.4z"
        fill="#FC3F1D"
      />
    </svg>
  )
}

export function ProxyLogo({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`shrink-0 ${className}`}>
      <path d="M4 6h16M4 12h16M4 18h16" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
      <circle cx="7" cy="6" r="2" fill="#10b981" />
      <circle cx="17" cy="12" r="2" fill="#10b981" />
      <circle cx="9" cy="18" r="2" fill="#10b981" />
    </svg>
  )
}

export function SetupBundleLogo({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`shrink-0 ${className}`}>
      <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#fbbf24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="#fbbf24" fillOpacity="0.2" />
      <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="#fbbf24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function DefaultSocialLogo({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`shrink-0 ${className}`}>
      <path d="M12 4v16m-8-8h16" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function PlatformIcon({ platform = '', title = '', size = 16, className = '' }) {
  const str = (platform + ' ' + title).toLowerCase()
  if (str.includes('proxy') || str.includes('прокси') || str.includes('socks') || str.includes('residential') || str.includes('mobile proxy')) {
    return <ProxyLogo size={size} className={className} />
  }
  if (str.includes('setup') || str.includes('сетап') || str.includes('bundle') || str.includes('бандл') || str.includes('пакет') || str.includes('pack')) {
    return <SetupBundleLogo size={size} className={className} />
  }
  if (str.includes('tiktok')) return <TikTokLogo size={size} className={className} />
  if (str.includes('google')) return <GoogleLogo size={size} className={className} />
  if (str.includes('facebook') || str.includes('fb')) return <FacebookLogo size={size} className={className} />
  if (str.includes('twitter') || str.includes('x')) return <TwitterLogo size={size} className={className} />
  if (str.includes('яндекс') || str.includes('yandex')) return <YandexLogo size={size} className={className} />
  return <DefaultSocialLogo size={size} className={className} />
}

export default function SocialProductTile({ product, onClick, compact = false, index = 0 }) {
  const navigate = useNavigate()
  const { lang } = useLanguage()
  const { items, addToCart, updateQuantity } = useCart()

  const cartItem = items?.find((i) => i.id === product.id)
  const quantityInCart = cartItem ? cartItem.quantity : 0

  const title = (lang === 'en' && product.title_en) ? product.title_en : product.title
  const description = (lang === 'en' && product.description_en) ? product.description_en : product.description

  const handleTileClick = () => {
    if (onClick) {
      onClick()
    } else {
      navigate(`/product/${product.id}`)
    }
  }

  const isProxy = product.platform === 'Proxy' || String(product.category_id) === '6'
  const isSetup = product.platform === 'Setup' || String(product.category_id) === '7'

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, delay: index * 0.04 }}
        whileHover={{ y: -2 }}
        onClick={handleTileClick}
        className="group cursor-pointer flex flex-col items-center justify-between rounded-2xl border border-cyan-400/30 bg-gradient-to-b from-[#0d214a] via-[#09122c] to-[#040817] p-2.5 text-center shadow-md transition hover:border-cyan-300 hover:shadow-[0_0_15px_rgba(56,189,248,0.25)] relative w-full min-w-0 overflow-hidden"
      >
        {/* Platform icon & label without bounding box */}
        <div className="mb-1 flex items-center justify-center gap-1.5 w-full min-w-0">
          <PlatformIcon platform={product.platform} title={title} size={15} />
          <span className="text-[10px] font-black text-cyan-300 truncate">
            {product.platform || 'Account'}
          </span>
        </div>

        <h4 className="line-clamp-2 text-[11px] font-bold text-white group-hover:text-cyan-200 my-1 leading-snug break-words min-w-0 w-full text-center">
          {title}
        </h4>

        <div className="mt-1 flex flex-col items-center w-full min-w-0">
          <p className="text-xs font-black text-cyan-300 font-mono">${Number(product.price).toFixed(2)}</p>
          {quantityInCart > 0 ? (
            <div
              onClick={(e) => e.stopPropagation()}
              className="mt-1 flex items-center justify-between w-full rounded-lg border border-cyan-400/40 bg-cyan-950 px-1 py-0.5"
            >
              <button
                onClick={(e) => { e.stopPropagation(); updateQuantity(product.id, quantityInCart - 1); }}
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-cyan-400/20 text-xs font-black text-cyan-300 hover:bg-cyan-400/40 active:scale-90"
              >
                -
              </button>
              <span className="text-[10px] font-extrabold text-white truncate px-0.5">
                {quantityInCart}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); updateQuantity(product.id, quantityInCart + 1); }}
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-cyan-400/20 text-xs font-black text-cyan-300 hover:bg-cyan-400/40 active:scale-90"
              >
                +
              </button>
            </div>
          ) : (
            <span className="mt-1 text-[9px] font-bold text-slate-400 group-hover:text-cyan-300 transition truncate w-full">
              {lang === 'en' ? '+ Add' : '+ В корзину'}
            </span>
          )}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.4) }}
      whileHover={{ y: -3 }}
      onClick={handleTileClick}
      className={`group cursor-pointer flex flex-col justify-between rounded-2xl border p-3 sm:p-3.5 shadow-md transition duration-200 w-full min-w-0 overflow-hidden break-words ${
        isProxy
          ? 'border-emerald-500/35 bg-gradient-to-b from-[#06241b] via-[#071726] to-[#030a14] hover:border-emerald-400 hover:shadow-[0_0_18px_rgba(52,211,153,0.22)]'
          : isSetup
          ? 'border-amber-500/35 bg-gradient-to-b from-[#1c1404] via-[#0d1633] to-[#040817] hover:border-amber-400 hover:shadow-[0_0_18px_rgba(251,191,36,0.22)]'
          : 'border-cyan-400/30 bg-gradient-to-b from-[#0d214a] via-[#09122c] to-[#040817] hover:border-cyan-300 hover:shadow-[0_0_18px_rgba(56,189,248,0.22)]'
      }`}
    >
      <div className="min-w-0">
        {/* Top badge row with clean frameless platform icon */}
        <div className="flex items-center justify-between gap-1.5 mb-2 min-w-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <PlatformIcon platform={product.platform} title={title} size={16} />
            <span className="text-[11px] font-black uppercase text-cyan-200 tracking-wider truncate min-w-0">
              {product.platform || 'Account'}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {product.geo && (
              <span className="rounded-md bg-black/40 px-1.5 py-0.5 text-[9px] font-semibold text-slate-300 border border-slate-700/50">
                {product.geo.split(' ')[0]}
              </span>
            )}
            <span className="text-xs sm:text-sm font-black text-cyan-300 font-mono">
              ${Number(product.price).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Title */}
        <h4 className="text-xs sm:text-[13px] font-black text-white group-hover:text-cyan-300 transition line-clamp-2 mb-1 leading-snug break-words">
          {title}
        </h4>

        {/* Description */}
        <p className="text-[10px] sm:text-[11px] text-slate-300 line-clamp-2 mb-3 leading-relaxed break-words">
          {description}
        </p>
      </div>

      {/* Action bottom row */}
      {quantityInCart > 0 ? (
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex w-full min-w-0 items-center justify-between rounded-xl border border-cyan-400/40 bg-cyan-950/90 p-1"
        >
          <button
            onClick={(e) => { e.stopPropagation(); updateQuantity(product.id, quantityInCart - 1); }}
            className="flex h-7 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-400/20 text-sm font-black text-cyan-300 hover:bg-cyan-400/30 active:scale-90 transition"
          >
            -
          </button>
          <span className="text-xs font-black text-white px-1 truncate">
            {quantityInCart} {lang === 'en' ? 'pcs' : 'шт.'}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); updateQuantity(product.id, quantityInCart + 1); }}
            className="flex h-7 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-400/20 text-sm font-black text-cyan-300 hover:bg-cyan-400/30 active:scale-90 transition"
          >
            +
          </button>
        </div>
      ) : (
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={(e) => { e.stopPropagation(); addToCart(product, 1); }}
          className="flex w-full min-w-0 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 py-1.5 sm:py-2 text-xs font-black text-slate-950 shadow-[0_0_12px_rgba(56,189,248,0.25)] transition hover:opacity-95"
        >
          <ShoppingCart size={13} className="shrink-0" />
          <span className="truncate">{lang === 'en' ? 'Add to cart' : 'В корзину'}</span>
        </motion.button>
      )}
    </motion.div>
  )
}

