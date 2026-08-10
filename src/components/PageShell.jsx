import { Link } from 'react-router-dom'
import { User } from 'lucide-react'
import LanguageSwitcher from './LanguageSwitcher.jsx'
import MediabuyLogo from './MediabuyLogo.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'

export default function PageShell({ title, children, hideTitle = false, hideTopSwitcher = false }) {
  const { lang } = useLanguage()

  return (
    <div className="mx-auto w-full max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl px-3.5 sm:px-6 pb-28 pt-[max(calc(env(safe-area-inset-top,0px)+18px),22px)] sm:pt-6 transition-all duration-300">
      {!hideTopSwitcher && (
        <header className="mb-4 sm:mb-5 flex items-center justify-between rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-[#07132e]/90 via-[#0a1638]/90 to-[#07132e]/90 px-3.5 py-3 sm:py-3.5 shadow-sm backdrop-blur-md">
          <Link to="/" className="flex items-center gap-2.5 group">
            <MediabuyLogo size="sm" className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl border border-cyan-400/40 transition group-hover:scale-105 shadow-[0_0_10px_rgba(56,189,248,0.25)]" />
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-black text-white tracking-wide group-hover:text-cyan-300 transition">MEDIABUY</span>
              <span className="text-[8px] sm:text-[9px] font-semibold text-cyan-400 tracking-wider">LAB AGENCY</span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
          </div>
        </header>
      )}
      {!hideTitle && <h1 className="mb-4 text-xl sm:text-2xl font-black text-white [text-shadow:0_0_14px_rgba(56,189,248,0.5)]">{title}</h1>}
      {children}
    </div>
  )
}

