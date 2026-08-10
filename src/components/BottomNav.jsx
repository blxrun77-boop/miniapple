import { Link, useLocation } from 'react-router-dom'
import { Home, ShoppingBag, ShoppingCart, User, Users } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext.jsx'
import { useCart } from '../context/CartContext.jsx'

export default function BottomNav() {
  const location = useLocation()
  const { lang } = useLanguage()
  const { count } = useCart()

  const navItems = [
    { path: '/', label: lang === 'en' ? 'Home' : 'Главная', icon: Home },
    { path: '/catalog', label: lang === 'en' ? 'Catalog' : 'Каталог', icon: ShoppingBag },
    { path: '/cart', label: lang === 'en' ? 'Cart' : 'Корзина', icon: ShoppingCart },
    { path: '/contacts', label: lang === 'en' ? 'Contacts' : 'Контакты', icon: Users },
    { path: '/profile', label: lang === 'en' ? 'Profile' : 'Профиль', icon: User }
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-3 pt-2 px-4 bg-gradient-to-t from-[#040817] via-[#09122c]/90 to-transparent backdrop-blur-md">
      <div className="flex w-full max-w-md sm:max-w-xl md:max-w-2xl items-center justify-around rounded-3xl border border-cyan-400/30 bg-[#09122c]/90 p-2 shadow-[0_0_25px_rgba(56,189,248,0.2)]">
        {navItems.map((item) => {
          const IconComponent = item.icon
          const isActive = location.pathname === item.path
          const isCart = item.path === '/cart'
          const hasCartItems = isCart && count > 0

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex flex-col items-center gap-1 rounded-2xl px-3 py-1.5 transition-all duration-300 ${
                hasCartItems
                  ? 'gold-cart-animated text-amber-300 font-bold'
                  : isActive
                  ? 'text-cyan-300 bg-cyan-400/10 [text-shadow:0_0_10px_rgba(56,189,248,0.6)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative z-10 flex items-center justify-center">
                <IconComponent
                  size={20}
                  className={
                    hasCartItems
                      ? 'text-amber-300 scale-105'
                      : isActive
                      ? 'drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]'
                      : ''
                  }
                />
                {isCart && count > 0 && (
                  <span className="absolute -top-2 -right-3 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 px-1 text-[10px] font-black text-slate-950 border border-amber-200">
                    {count > 99 ? '99+' : count}
                  </span>
                )}
              </div>
              <span className={`relative z-10 text-[10px] ${hasCartItems ? 'font-bold text-amber-200' : 'font-medium'}`}>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
