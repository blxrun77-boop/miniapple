import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import SocialBrandIcon from './SocialBrandIcon'
import { useLanguage } from '../context/LanguageContext'
import { Sparkles, ArrowRight, ExternalLink } from 'lucide-react'

export default function HomeBannerCarousel({ banners }) {
  const [active, setActive] = useState(0)
  const { lang } = useLanguage()

  const safeBanners = Array.isArray(banners) && banners.length > 0 ? banners : [
    {
      id: 2,
      title: 'Запуск и обучение в одном месте',
      title_en: 'Launch & Training in One Place',
      subtitle: 'Практика, связки и поддержка команды 24/7',
      subtitle_en: 'Hands-on practice & 24/7 team support',
      image_url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80',
      target_url: 'https://t.me/mediabuy_lab',
      badge_text: 'HOT DEAL',
      badge_text_en: 'HOT DEAL'
    },
    {
      id: 3,
      title: 'Скидка 10% на второй заказ',
      title_en: '10% Discount on Second Order',
      subtitle: 'Авто-активация бонуса после первой оплаты',
      subtitle_en: 'Auto-activated after your first successful payment',
      image_url: 'https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=1200&q=80',
      target_url: 'https://t.me/mediabuy_lab',
      badge_text: 'BONUS 10%',
      badge_text_en: 'BONUS 10%'
    },
    {
      id: 4,
      title: 'Чистые резидентские прокси для FB & TikTok',
      title_en: 'Clean Residential Proxies for FB & TikTok',
      subtitle: 'Низкий пинг, ротация по ссылке, 99.9% аптайм',
      subtitle_en: 'Low ping, API rotation, 99.9% uptime guaranteed',
      image_url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80',
      target_url: 'https://t.me/mediabuy_lab',
      badge_text: 'PROXIES POOL',
      badge_text_en: 'PROXIES POOL'
    }
  ]

  // Auto-rotate banners every 6 seconds
  useEffect(() => {
    if (safeBanners.length <= 1) return
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % safeBanners.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [safeBanners.length])

  const current = safeBanners[active] || safeBanners[0]

  const title = lang === 'en' && current.title_en ? current.title_en : current.title
  const subtitle = lang === 'en' && current.subtitle_en ? current.subtitle_en : current.subtitle
  const badgeText = lang === 'en' && current.badge_text_en ? current.badge_text_en : (current.badge_text || 'SPECIAL OFFER')

  return (
    <section className="relative my-2 sm:my-3 min-w-0">
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-cyan-400/35 bg-[#070e24] shadow-[0_0_25px_rgba(56,189,248,0.18)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id || active}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            onClick={() => window.open(current.target_url || 'https://t.me/mediabuy_lab', '_blank')}
            className="group relative block h-36 sm:h-44 md:h-48 w-full cursor-pointer overflow-hidden p-3 sm:p-5 text-left"
          >
            {/* Dynamic background with parallax subtle zoom on hover */}
            {current.image_url && (
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                style={{ backgroundImage: `url(${current.image_url})` }}
              />
            )}

            {/* Gradient Cyber Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#040817] via-[#09122c]/85 to-[#0b1430]/60" />
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#040817]/40 to-[#040817]" />

            {/* Ambient Corner Glows */}
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-500/20 blur-2xl" />
            <div className="pointer-events-none absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-blue-500/20 blur-2xl" />

            {/* Watermark platform logos */}
            <div className="pointer-events-none absolute inset-0 opacity-15">
              <div className="absolute left-3 top-3"><SocialBrandIcon platform="Facebook" mono size={20} className="text-cyan-300" /></div>
              <div className="absolute right-3 top-3"><SocialBrandIcon platform="Twitter (X)" mono size={18} className="text-cyan-200" /></div>
              <div className="absolute left-5 bottom-3"><SocialBrandIcon platform="TikTok" mono size={18} className="text-indigo-300" /></div>
              <div className="absolute right-5 bottom-3"><SocialBrandIcon platform="Google" mono size={20} className="text-cyan-300" /></div>
            </div>

            {/* Banner Content */}
            <div className="relative z-10 flex h-full flex-col justify-between min-w-0">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/40 bg-cyan-950/80 px-2 sm:px-2.5 py-0.5 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] text-cyan-300 backdrop-blur-md shadow-[0_0_10px_rgba(56,189,248,0.3)]">
                  <Sparkles size={10} className="text-cyan-400" />
                  <span>{badgeText}</span>
                </span>

                <span className="flex items-center gap-1 text-[10px] font-bold text-cyan-300/80 group-hover:text-cyan-200 transition">
                  <span className="hidden xs:inline">{lang === 'en' ? 'Open' : 'Открыть'}</span>
                  <ExternalLink size={12} />
                </span>
              </div>

              <div className="min-w-0">
                <h2 className="text-sm sm:text-base md:text-lg font-black tracking-tight text-white line-clamp-1 [text-shadow:0_0_12px_rgba(0,0,0,0.8)]">
                  {title}
                </h2>
                <p className="mt-0.5 text-[11px] sm:text-xs text-slate-200/90 line-clamp-2 [text-shadow:0_0_10px_rgba(0,0,0,0.9)] max-w-xl">
                  {subtitle}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel indicator dots */}
        {safeBanners.length > 1 && (
          <div className="absolute bottom-2 right-3 z-20 flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm border border-cyan-500/20">
            {safeBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation()
                  setActive(idx)
                }}
                className={`h-1 rounded-full transition-all duration-300 ${
                  idx === active
                    ? 'w-4 bg-cyan-300 shadow-[0_0_8px_rgba(56,189,248,0.8)]'
                    : 'w-1 bg-cyan-300/30 hover:bg-cyan-300/60'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
