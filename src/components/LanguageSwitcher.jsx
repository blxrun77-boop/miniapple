import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronDown, Check } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function LanguageSwitcher() {
  const { lang, changeLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  const languages = [
    { code: 'ru', label: 'RU', name: 'Русский', flag: '🇷🇺' },
    { code: 'en', label: 'EN', name: 'English', flag: '🇺🇸' }
  ]

  const activeLang = languages.find((item) => item.code === lang) || languages[0]

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (code) => {
    changeLanguage(code)
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className="relative inline-block text-left z-50">
      {/* Single compact toggle button with large touch target */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex min-h-[38px] sm:min-h-[40px] items-center gap-1.5 sm:gap-2 rounded-xl sm:rounded-2xl border border-cyan-400/40 bg-[#070e24]/95 px-3 sm:px-3.5 py-2 text-xs font-bold text-slate-200 shadow-[0_0_16px_rgba(56,189,248,0.2)] backdrop-blur-md transition hover:border-cyan-400/70 hover:text-white"
        aria-label="Select Language"
      >
        <span className="text-base leading-none">{activeLang.flag}</span>
        <span className="tracking-wider uppercase text-cyan-200 text-xs sm:text-xs font-black">{activeLang.label}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={14} className="text-cyan-400" />
        </motion.div>
      </motion.button>

      {/* Dropdown Popup Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -6 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-40 overflow-hidden rounded-2xl border border-cyan-400/50 bg-[#070f2b]/98 p-1.5 shadow-[0_12px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(56,189,248,0.25)] backdrop-blur-xl z-[99]"
          >
            <div className="space-y-1">
              {languages.map((item) => {
                const isActive = lang === item.code
                return (
                  <motion.button
                    key={item.code}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSelect(item.code)}
                    className={[
                      'flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold transition-all',
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500/25 to-blue-600/25 text-cyan-200 border border-cyan-400/40 shadow-sm'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    ].join(' ')}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg leading-none">{item.flag}</span>
                      <span className="font-semibold">{item.name}</span>
                    </div>
                    {isActive && <Check size={15} className="text-cyan-400 stroke-[3]" />}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
