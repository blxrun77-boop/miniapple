import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client'
import PageShell from '../components/PageShell.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import {
  User as UserIcon,
  ShieldCheck,
  Tag,
  ShoppingBag,
  ExternalLink,
  MessageSquare,
  Send,
  Zap,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Trash2,
  Building2,
  Globe2,
  Landmark,
  BookOpen,
  KeyRound
} from 'lucide-react'

const OFFICIAL_COMPANY_REGISTRY_URL = 'https://find-and-update.company-information.service.gov.uk/company/10549229'

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const { t, lang } = useLanguage()

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm(lang === 'en' ? 'Are you sure you want to cancel payment and delete this request?' : 'Вы уверены, что хотите отменить оплату и удалить эту заявку?')) {
      return
    }
    try {
      await api.post(`/orders/${orderId}/cancel`)
    } catch {
      try {
        await api.delete(`/orders/${orderId}`)
      } catch {
        // local fallback
      }
    }
    setOrders((prev) => prev.filter((o) => o.id !== orderId))
  }

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const { data } = await api.get('/orders/my')
        setOrders(data || [])
      } catch {
        setOrders([])
      } finally {
        setOrdersLoading(false)
      }
    }

    if (user) {
      loadOrders()
    } else {
      setOrdersLoading(false)
    }
  }, [user])

  if (loading) {
    return (
      <PageShell title={t('profile.title')}>
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
        </div>
      </PageShell>
    )
  }

  const discountPercent = user?.next_order_discount_percent || 0
  const isEligibleForDiscount = discountPercent > 0 || orders.length > 0

  return (
    <PageShell title={t('profile.title')}>
      {/* USER IDENTITY CARD */}
      <section className="relative overflow-hidden rounded-3xl border border-cyan-400/40 bg-gradient-to-br from-[#0e1a3e] via-[#0b1430] to-[#060b1e] p-5 shadow-[0_0_30px_rgba(56,189,248,0.2)]">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-cyan-500/10 blur-2xl pointer-events-none" />
        <div className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-4">
          <div className="shrink-0 text-slate-400">
            <UserIcon size={36} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-lg font-bold text-white">
                {[user?.first_name, user?.last_name].filter(Boolean).join(' ') || t('profile.user')}
              </h2>
              {user?.is_admin && (
                <span className="rounded-full bg-cyan-400/20 px-2 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-400/40">
                  ADMIN
                </span>
              )}
            </div>
            {user?.username && <p className="text-xs text-slate-300">@{user.username}</p>}
            <div className="mt-1 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-black/40 px-2 py-0.5 text-[10px] font-mono font-medium text-cyan-300 border border-cyan-500/30">
                ID: #{user?.telegram_id || '—'}
              </span>
              <span className="text-[10px] font-medium text-slate-400">
                • {t('profile.verifiedUser') || 'Verified Mini App User'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* LOYALTY & DISCOUNT CARD */}
      <section className="mt-4 rounded-2xl border border-indigo-400/35 bg-gradient-to-r from-[#111938] via-[#0d1633] to-[#070e24] p-4 shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <Tag size={20} className="text-slate-400 shrink-0" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-indigo-300">
                {t('profile.loyaltyProgram') || 'Программа лояльности'}
              </p>
              <h3 className="text-sm font-bold text-white">
                {isEligibleForDiscount
                  ? (t('profile.discountTitle') || 'Скидка 10% на следующий заказ')
                  : (t('profile.discount') || 'Персональная скидка')}
              </h3>
            </div>
          </div>
          <span className="rounded-full bg-gradient-to-r from-cyan-400 to-indigo-400 px-2.5 py-1 text-xs font-black text-slate-950 shadow">
            {isEligibleForDiscount ? '10% OFF' : '0%'}
          </span>
        </div>

        <div className="mt-3">
          <div className="flex justify-between text-xs text-slate-300 mb-1">
            <span>{t('profile.discountLine') || 'Прогресс скидки'}</span>
            <span>{orders.length > 0 ? '100% (Active)' : '0%'}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-900 border border-indigo-900">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 transition-all duration-500 shadow-[0_0_10px_rgba(56,189,248,0.8)]"
              style={{ width: orders.length > 0 ? '100%' : '20%' }}
            />
          </div>
        </div>
      </section>

      {/* ORDERS HISTORY SECTION */}
      <section className="mt-5">
        <div className="mb-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-cyan-300" />
            <h3 className="text-base font-bold text-white">{t('profile.ordersHistory') || 'История заказов'}</h3>
          </div>
          <span className="text-xs text-slate-400">{orders.length} {t('catalog.productsCount') || 'заказов'}</span>
        </div>

        <div className="space-y-3">
          {ordersLoading ? (
            <div className="rounded-2xl border border-cyan-400/20 bg-[#09122c]/60 p-4 text-center text-xs text-slate-400">
              {t('common.loading') || 'Загрузка...'}
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-2xl border border-cyan-400/20 bg-[#09122c]/60 p-6 text-center">
              <ShoppingBag size={32} className="mx-auto text-slate-500 mb-2 opacity-60" />
              <p className="text-sm font-semibold text-slate-300">{t('profile.noOrders') || 'У вас пока нет оформленных заказов'}</p>
            </div>
          ) : (
            orders.map((order) => {
              const isWaiting = order.status === 'waiting_payment'
              return (
                <article
                  key={order.id}
                  className="rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-[#09122c] to-[#060b1e] p-4 shadow-md transition hover:border-cyan-400/60"
                >
                  <div className="flex items-start justify-between border-b border-cyan-500/20 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">
                          {t('profile.order') || 'Заказ #'} {order.id}
                        </span>
                        {isWaiting ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/40">
                            <Clock size={10} /> {t('profile.statusWaiting') || 'Ожидает оплаты'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/40">
                            <CheckCircle2 size={10} /> {t('profile.statusPaid') || 'Оплачен'}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-[11px] text-slate-400">
                        {new Date(order.created_at || Date.now()).toLocaleString('ru-RU')}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-base font-black text-cyan-300">${Number(order.total_amount).toFixed(2)}</p>
                      {order.discount_percent > 0 && (
                        <span className="text-[10px] text-emerald-400 font-semibold">
                          {t('profile.discountAppliedTag') || 'Скидка'} {order.discount_percent}%
                        </span>
                      )}
                    </div>
                  </div>

                  {order.items && order.items.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-xs text-slate-300">
                          <span>
                            {item.quantity}x {item.title || `Item #${item.product_id}`}
                          </span>
                          <span className="text-slate-400">${(item.unit_price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* DELIVERED GOODS DATA DISPLAY */}
                  {order.delivered_data && (
                    <div className="mt-3.5 rounded-xl border border-emerald-500/40 bg-[#041d14] p-3 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-emerald-300 flex items-center gap-1.5">
                          <CheckCircle2 size={14} /> {lang === 'en' ? 'Delivered Goods / Access Details:' : 'Выданные товары / Доступы:'}
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(order.delivered_data)
                            alert(lang === 'en' ? 'Credentials copied to clipboard!' : 'Данные скопированы в буфер обмена!')
                          }}
                          className="rounded-lg bg-emerald-500/20 px-2 py-1 text-[10px] font-bold text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40"
                        >
                          {lang === 'en' ? 'Copy All' : 'Скопировать'}
                        </button>
                      </div>
                      <pre className="p-2.5 rounded-lg bg-black/80 border border-emerald-900/60 font-mono text-[11px] text-emerald-200 whitespace-pre-wrap break-all select-all">
                        {order.delivered_data}
                      </pre>
                    </div>
                  )}

                  {isWaiting && (
                    <div className="mt-3.5 space-y-2 pt-2 border-t border-cyan-500/20">
                      {order.assigned_wallet && (
                        <div className="rounded-xl border border-cyan-500/30 bg-[#060c20] p-3 text-xs space-y-1.5">
                          <div className="flex justify-between items-center text-slate-300">
                            <span className="font-semibold">{t('cart.amountPayable') || 'Сумма к оплате'}:</span>
                            <span className="font-extrabold text-emerald-300 font-mono">
                              {order.crypto_amount || `$${Number(order.total_amount).toFixed(2)} USD`}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-slate-300">
                            <span className="font-semibold">Сеть:</span>
                            <span className="font-mono text-[10px] text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                              {order.crypto_currency || 'USDT_TRC20'}
                            </span>
                          </div>
                          <div className="p-2 rounded-lg bg-black/60 border border-slate-800 font-mono text-[10px] text-cyan-200 break-all select-all">
                            {order.assigned_wallet}
                          </div>
                        </div>
                      )}
                      <div className="flex flex-col sm:flex-row gap-2 pt-1">
                        <button
                          onClick={async () => {
                            try {
                              await api.post(`/orders/${order.id}/send-telegram-receipt`)
                              alert('✔ Реквизиты и чек высланы вам в Telegram!')
                            } catch {
                              alert('✔ Запрос на чек выслан менеджеру в Telegram!')
                            }
                          }}
                          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-cyan-400/50 bg-[#0c1a3e] py-2 px-3 text-xs font-bold text-cyan-300 shadow-md transition hover:bg-cyan-950 active:scale-95"
                        >
                          <Send size={14} /> {lang === 'en' ? 'Send Receipt in Telegram' : 'Отправить реквизиты в Telegram'}
                        </button>
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-rose-500/50 bg-rose-950/50 py-2 px-3 text-xs font-bold text-rose-300 shadow-md transition hover:bg-rose-900/80 active:scale-95"
                          title={lang === 'en' ? 'Cancel payment and delete request' : 'Отменить оплату и удалить заявку'}
                        >
                          <XCircle size={14} className="text-rose-400 shrink-0" />
                          <span>{lang === 'en' ? 'Cancel Payment' : 'Отменить оплату'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {!isWaiting && (
                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex justify-end">
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-rose-400 transition"
                      >
                        <Trash2 size={13} /> {lang === 'en' ? 'Delete request' : 'Удалить заявку'}
                      </button>
                    </div>
                  )}
                </article>
              )
            })
          )}
        </div>
      </section>

      {/* QUICK ACTIONS & SUPPORT */}
      <section className="mt-5 space-y-2.5">
        <h3 className="text-base font-bold text-white mb-2">{t('profile.supportSection') || 'Поддержка и связь'}</h3>

        <Link
          to="/tools"
          className="flex items-center justify-between rounded-2xl border border-emerald-400/40 bg-gradient-to-r from-[#07241a] via-[#051c14] to-[#09122c] p-3.5 text-white transition hover:border-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
        >
          <div className="flex items-center gap-3">
            <BookOpen size={20} className="text-slate-400 shrink-0" />
            <div>
              <p className="text-sm font-bold text-emerald-200">{lang === 'en' ? 'Buyer Tools & Knowledge Base' : 'Утилиты медиабайера & База знаний'}</p>
              <p className="text-xs text-slate-300">{lang === 'en' ? '2FA Generator, BIN Checker, Checklists' : 'Генератор 2FA, чекер БИНов, чек-листы запуска'}</p>
            </div>
          </div>
          <ExternalLink size={16} className="text-emerald-400" />
        </Link>

        <a
          href={OFFICIAL_COMPANY_REGISTRY_URL}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between rounded-2xl border border-amber-400/40 bg-gradient-to-r from-[#211a08] via-[#120e26] to-[#09122c] p-3.5 text-white transition hover:border-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.15)]"
        >
          <div className="flex items-center gap-3">
            <Building2 size={20} className="text-slate-400 shrink-0" />
            <div>
              <p className="text-sm font-bold text-amber-200">{lang === 'en' ? 'We are an official company' : 'Мы официальная компания'}</p>
              <p className="text-xs text-slate-300">{lang === 'en' ? 'UK Companies House Registry (#10549229)' : 'Гос. реестр Великобритании Companies House (#10549229)'}</p>
            </div>
          </div>
          <ExternalLink size={16} className="text-amber-400" />
        </a>

        <a
          href="https://t.me/mediabuy_adm"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between rounded-2xl border border-cyan-400/30 bg-[#09122c]/80 p-3.5 text-white transition hover:border-cyan-300"
        >
          <div className="flex items-center gap-3">
            <MessageSquare size={20} className="text-slate-400 shrink-0" />
            <div>
              <p className="text-sm font-bold">{t('profile.contactAdmin') || 'Связаться с Администратором'}</p>
              <p className="text-xs text-slate-400">{t('profile.contactAdminDesc') || '@mediabuy_adm — ответы по заказам и связкам'}</p>
            </div>
          </div>
          <Send size={16} className="text-cyan-400" />
        </a>

        <a
          href="https://t.me/mediabuy_lab"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between rounded-2xl border border-indigo-400/30 bg-[#0c1433]/80 p-3.5 text-white transition hover:border-indigo-300"
        >
          <div className="flex items-center gap-3">
            <ExternalLink size={20} className="text-slate-400 shrink-0" />
            <div>
              <p className="text-sm font-bold">{t('profile.officialChannel') || 'Официальный Telegram Канал'}</p>
              <p className="text-xs text-slate-400">{t('profile.officialChannelDesc') || 'Кейсы, новости и обновления сервиса'}</p>
            </div>
          </div>
          <Send size={16} className="text-indigo-400" />
        </a>

        {user?.is_admin && (
          <Link
            to="/admin"
            className="flex items-center justify-between rounded-2xl border border-amber-400/40 bg-amber-950/40 p-3.5 text-amber-200 transition hover:border-amber-300"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck size={20} className="text-slate-400 shrink-0" />
              <div>
                <p className="text-sm font-bold">{t('profile.adminOpen') || 'Панель управления (Admin)'}</p>
                <p className="text-xs text-amber-300/80">{t('profile.adminOpenDesc') || 'Управление товарами, баннерами и контактами'}</p>
              </div>
            </div>
            <ExternalLink size={16} className="text-amber-300" />
          </Link>
        )}
      </section>
    </PageShell>
  )
}
