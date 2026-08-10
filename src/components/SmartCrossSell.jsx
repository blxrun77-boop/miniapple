import { useState } from 'react'
import { CROSS_SELL_ITEMS } from '../data/starterPacks'
import { useCart } from '../context/CartContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { Plus, Check, Zap, Sparkles } from 'lucide-react'

export default function SmartCrossSell() {
  const { addToCart, items } = useCart()
  const { lang } = useLanguage()
  const [addedIds, setAddedIds] = useState({})

  const handleAddCrossSell = (item) => {
    addToCart({
      id: item.id,
      title: item.title,
      title_en: item.title_en,
      description: item.description,
      description_en: item.description_en,
      platform: item.platform,
      price: item.price
    })

    setAddedIds((prev) => ({ ...prev, [item.id]: true }))
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [item.id]: false }))
    }, 2000)
  }

  return (
    <div className="rounded-3xl border border-cyan-400/30 bg-gradient-to-br from-[#0a1636] via-[#09122c] to-[#040817] p-4.5 shadow-md my-4 space-y-3">
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2.5">
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-slate-400 shrink-0" />
          <h3 className="text-xs font-black uppercase tracking-wider text-cyan-300">
            {lang === 'en' ? 'Smart Cross-Sell Add-ons (1-Click)' : 'Рекомендуемые расходники в 1 клик'}
          </h3>
        </div>
        <span className="text-[10px] font-bold text-slate-400">
          {lang === 'en' ? 'Boost Launch Success' : 'Увеличьте проходимость'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {CROSS_SELL_ITEMS.map((item) => {
          const isAdded = addedIds[item.id]
          const inCart = items.some((cartItem) => cartItem.id === item.id)

          return (
            <div
              key={item.id}
              className="flex items-center justify-between gap-2.5 rounded-2xl border border-cyan-500/20 bg-[#040817]/90 p-3 hover:border-cyan-400/50 transition"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-xl shrink-0">{item.icon}</span>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">
                    {lang === 'en' ? item.title_en : item.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 line-clamp-1">
                    {lang === 'en' ? item.description_en : item.description}
                  </p>
                  <p className="text-xs font-black text-cyan-300 font-mono mt-0.5">
                    ${item.price.toFixed(2)} USD
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleAddCrossSell(item)}
                className={`shrink-0 flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-bold transition active:scale-95 ${
                  isAdded || inCart
                    ? 'bg-emerald-400 text-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                    : 'bg-cyan-950 text-cyan-300 border border-cyan-400/50 hover:bg-cyan-900'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check size={14} />
                    <span>{lang === 'en' ? 'Added' : 'Добавлено'}</span>
                  </>
                ) : inCart ? (
                  <>
                    <Check size={14} />
                    <span>{lang === 'en' ? 'In Cart' : 'В корзине'}</span>
                  </>
                ) : (
                  <>
                    <Plus size={14} />
                    <span>{lang === 'en' ? 'Add' : 'Добавить'}</span>
                  </>
                )}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
