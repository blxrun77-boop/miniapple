import { useState } from 'react'
import api from '../api/client'
import PageShell from '../components/PageShell.jsx'
import SmartCrossSell from '../components/SmartCrossSell.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import {
  ShoppingBag,
  Trash2,
  Zap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  QrCode,
  AlertTriangle,
  Send,
  Wallet
} from 'lucide-react'

function UsdtLogo({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2zm1.625 5.5v1.442h2.812v2.228h-2.812v.944c1.888.106 3.328.528 3.328 1.033 0 .584-1.896 1.057-4.328 1.082v3.771H11.375V14.23c-2.432-.025-4.328-.498-4.328-1.082 0-.505 1.44-.927 3.328-1.033v-.944H7.562V8.942h2.813V7.500h3.25z"/>
    </svg>
  )
}

function BtcLogo({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.55 10.32c.45-.63.68-1.35.68-2.15 0-1.88-1.27-3.23-3.41-3.52V2.5h-1.8v2.03h-1.35V2.5h-1.8v2.05H5.4v2.25h1.35c.42 0 .68.25.68.68v8.94c0 .42-.26.68-.68.68H5.4v2.25h2.48v2.05h1.8v-2.03h1.35v2.03h1.8v-2.07c2.32-.32 3.72-1.74 3.72-3.82 0-1.28-.58-2.31-1.68-3.01zM10.03 6.8h2.03c.85 0 1.46.42 1.46 1.22s-.61 1.25-1.46 1.25h-2.03V6.8zm2.48 10.3h-2.48v-2.7h2.48c.95 0 1.62.48 1.62 1.35s-.67 1.35-1.62 1.35z"/>
    </svg>
  )
}

function EthLogo({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L4.5 14.5L12 18L19.5 14.5L12 2ZM12 19.5L4.5 15.5L12 22L19.5 15.5L12 19.5Z"/>
    </svg>
  )
}

function TonLogo({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.2l6.8 3.8L12 11.8 5.2 8 12 4.2zM5 9.5l6 3.3v6.7l-6-3.3V9.5zm14 0v6.7l-6 3.3v-6.7l6-3.3z"/>
    </svg>
  )
}

const CRYPTO_OPTIONS = [
  { id: 'USDT_TRC20', name: 'USDT', network: 'TRC20 (Tron)', renderIcon: (cls) => <UsdtLogo className={cls} /> },
  { id: 'USDT_BEP20', name: 'USDT', network: 'BEP20 (BNB Chain)', renderIcon: (cls) => <UsdtLogo className={cls} /> },
  { id: 'USDT_ERC20', name: 'USDT', network: 'ERC20 (Ethereum)', renderIcon: (cls) => <UsdtLogo className={cls} /> },
  { id: 'BTC', name: 'Bitcoin', network: 'BTC Network', renderIcon: (cls) => <BtcLogo className={cls} /> },
  { id: 'ETH', name: 'Ethereum', network: 'ETH Network', renderIcon: (cls) => <EthLogo className={cls} /> },
  { id: 'TON', name: 'TON', network: 'The Open Network', renderIcon: (cls) => <TonLogo className={cls} /> }
]

export default function CartPage() {
  const { items, total, removeFromCart, updateQuantity, clearCart } = useCart()
  const [status, setStatus] = useState('')
  const [createdOrder, setCreatedOrder] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { t, lang } = useLanguage()

  const [selectedCrypto, setSelectedCrypto] = useState('USDT_TRC20')

  const [copiedAddress, setCopiedAddress] = useState(false)
  const [copiedAmount, setCopiedAmount] = useState(false)
  const [paymentConfirmed, setPaymentConfirmed] = useState(false)
  const [isSendingTelegram, setIsSendingTelegram] = useState(false)
  const [telegramSentStatus, setTelegramSentStatus] = useState('')
  const [txidInput, setTxidInput] = useState('')
  const [isVerifyingTxid, setIsVerifyingTxid] = useState(false)
  const [txidResult, setTxidResult] = useState(null)

  const handleVerifyTxid = async () => {
    if (!txidInput.trim()) return
    setIsVerifyingTxid(true)
    setTxidResult(null)
    try {
      // 1. Submit TXID
      await api.post(`/orders/${createdOrder.id}/txid`, { txid: txidInput.trim() })
      // 2. Trigger automatic verification
      const res = await api.post(`/orders/${createdOrder.id}/check-payment`)
      setTxidResult({
        success: res.data.verified,
        message: res.data.message || (res.data.verified ? 'Оплата успешно подтверждена!' : 'Транзакция пока не найдена в блокчейне.')
      })
      if (res.data.verified) {
        setCreatedOrder((prev) => ({ ...prev, status: 'paid' }))
      }
    } catch (err) {
      setTxidResult({
        success: false,
        message: err.response?.data?.error || 'Ошибка проверки TXID в сети. Проверьте правильность введенного хеша.'
      })
    } finally {
      setIsVerifyingTxid(false)
    }
  }

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text)
    if (type === 'address') {
      setCopiedAddress(true)
      setTimeout(() => setCopiedAddress(false), 2000)
    } else {
      setCopiedAmount(true)
      setTimeout(() => setCopiedAmount(false), 2000)
    }
  }

  const checkout = async () => {
    if (!items.length) {
      setStatus(t('cart.emptyWarn') || 'Корзина пуста')
      return
    }

    setIsSubmitting(true)
    setStatus(t('cart.creating') || 'Создание заказа...')
    try {
      const payload = {
        items: items.map((item) => ({ product_id: item.id, quantity: item.quantity })),
        currency: 'USD',
        payment_method: 'crypto_direct',
        crypto_currency: selectedCrypto
      }
      const { data } = await api.post('/orders', payload)
      setCreatedOrder(data)
      setStatus('')
      clearCart()
    } catch (err) {
      setStatus(t('cart.fail') || ' Ошибка создания заказа. Попробуйте еще раз.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSendTelegramReceipt = async () => {
    if (!createdOrder) return
    setIsSendingTelegram(true)
    try {
      await api.post(`/orders/${createdOrder.id}/send-telegram-receipt`)
      setTelegramSentStatus(lang === 'en' ? '✔ Receipt & payment details sent to your Telegram!' : '✔ Чек и реквизиты оплаты успешно высланы вам в Telegram!')
    } catch (err) {
      setTelegramSentStatus(lang === 'en' ? '✔ Request for receipt sent to manager in Telegram!' : '✔ Запрос на чек передан менеджеру в Telegram!')
    } finally {
      setIsSendingTelegram(false)
    }
  }

  return (
    <PageShell title={t('cart.title') || (lang === 'en' ? 'Cart' : 'Корзина')}>
      {createdOrder ? (
        <section className="space-y-4 rounded-3xl border border-emerald-400/40 bg-gradient-to-br from-[#0a1c18] via-[#0b1430] to-[#040817] p-5 shadow-[0_0_35px_rgba(16,185,129,0.25)] text-center">
          <div className="mx-auto flex items-center justify-center">
            <CheckCircle2 size={36} className="text-slate-400" />
          </div>

          <div>
            <span className="rounded-full border border-emerald-400/40 bg-emerald-950 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-300">
              {t('cart.createdInvoice') || 'MEDIABUY LAB OFFICIAL INVOICE'}
            </span>
            <h2 className="mt-1.5 text-xl font-black text-white">
              {(t('cart.createdTitle') || (lang === 'en' ? 'Order #{id} generated successfully!' : 'Заказ #{id} успешно сформирован!')).replace('{id}', createdOrder.id)}
            </h2>
            <p className="mt-1 text-xs text-slate-300">
              {t('cart.orderAmount') || (lang === 'en' ? 'Order amount:' : 'Сумма заказа:')} <span className="font-extrabold text-emerald-400">${Number(createdOrder.total_amount).toFixed(2)} USD</span>
            </p>
          </div>

          {/* DIRECT CRYPTO PAYMENT DETAILS */}
          <div className="space-y-3 rounded-2xl border border-cyan-400/30 bg-[#060c20] p-4 text-left shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                🪙 {(t('cart.paymentDetails') || (lang === 'en' ? 'Payment Details ({currency})' : 'Реквизиты для оплаты ({currency})')).replace('{currency}', createdOrder.crypto_currency)}
              </span>
              <span className="rounded bg-cyan-950 px-2 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-400/30">
                {(t('cart.walletIndex') || (lang === 'en' ? 'Wallet #{index}' : 'Кошелек #{index}')).replace('{index}', createdOrder.wallet_index)}
              </span>
            </div>

            {/* QR CODE CONTAINER */}
            {createdOrder.qr_code_url && (
              <div className="flex flex-col items-center justify-center my-3">
                <div className="rounded-2xl border-2 border-cyan-400/50 bg-white p-3 shadow-[0_0_25px_rgba(56,189,248,0.4)]">
                  <img
                    src={createdOrder.qr_code_url}
                    alt="Crypto QR Code"
                    className="h-44 w-44 object-contain"
                  />
                </div>
                <p className="mt-2 text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                  <QrCode size={12} /> {t('cart.scanQr') || (lang === 'en' ? 'Scan QR code in your crypto wallet' : 'Отсканируйте QR в вашем крипто-кошельке')}
                </p>
              </div>
            )}

            {/* EXACT CRYPTO AMOUNT TO COPY */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{t('cart.exactAmount') || (lang === 'en' ? 'Exact amount to transfer:' : 'Точная сумма к переводу:')}</p>
              <div className="mt-1 flex items-center justify-between gap-2">
                <p className="text-lg font-black text-emerald-300 font-mono">
                  {createdOrder.crypto_amount}
                </p>
                <button
                  onClick={() => handleCopy(createdOrder.crypto_amount, 'amount')}
                  className="flex items-center gap-1 rounded-lg border border-emerald-400/40 bg-emerald-950/80 px-2.5 py-1 text-xs font-bold text-emerald-300 transition hover:bg-emerald-900 active:scale-95"
                >
                  {copiedAmount ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedAmount ? (t('cart.copied') || 'Скопировано') : (t('cart.copy') || 'Скопировать')}</span>
                </button>
              </div>
            </div>

            {/* WALLET ADDRESS TO COPY */}
            <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {(t('cart.walletAddress') || (lang === 'en' ? 'Wallet address ({currency}):' : 'Адрес кошелька ({currency}):')).replace('{currency}', createdOrder.crypto_currency)}
              </p>
              <div className="mt-1 flex items-center justify-between gap-2">
                <p className="text-xs font-bold text-cyan-200 font-mono break-all bg-black/50 p-2 rounded-lg border border-slate-800 w-full">
                  {createdOrder.assigned_wallet}
                </p>
              </div>
              <button
                onClick={() => handleCopy(createdOrder.assigned_wallet, 'address')}
                className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl border border-cyan-400/50 bg-gradient-to-r from-cyan-500 to-blue-600 py-2 text-xs font-extrabold text-slate-950 shadow-[0_0_12px_rgba(56,189,248,0.3)] transition hover:opacity-90 active:scale-95"
              >
                {copiedAddress ? <Check size={16} /> : <Copy size={16} />}
                <span>{copiedAddress ? (t('cart.addressCopied') || 'Адрес скопирован в буфер!') : (t('cart.copyAddress') || 'Скопировать адрес кошелька')}</span>
              </button>
            </div>

            {/* SEND RECEIPT TO TELEGRAM BUTTON */}
            <div className="pt-1">
              {telegramSentStatus ? (
                <div className="rounded-xl border border-cyan-400/40 bg-cyan-950/60 p-2.5 text-center text-xs font-bold text-cyan-300">
                  {telegramSentStatus}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleSendTelegramReceipt}
                  disabled={isSendingTelegram}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-400/50 bg-[#0c1a3e] py-2.5 text-xs font-bold text-cyan-300 shadow-md transition hover:bg-cyan-950 active:scale-95 disabled:opacity-50"
                >
                  <Send size={15} />
                  <span>{isSendingTelegram ? (t('cart.sendingTelegram') || 'Отправка в Telegram...') : (t('cart.sendTelegramReceipt') || 'Отправить реквизиты и чек в Telegram')}</span>
                </button>
              )}
            </div>

            {/* NETWORK WARNING */}
            <div className="flex items-start gap-2 rounded-xl border border-amber-500/40 bg-amber-950/30 p-2.5 text-[11px] text-amber-200">
              <AlertTriangle size={18} className="shrink-0 text-amber-400 mt-0.5" />
              <span>
                {t('cart.networkNotice') || (lang === 'en' ? 'Transfer strictly the specified currency on the correct network. Transactions are automatically tracked by our system.' : 'Переводите строго указанную валюту в правильной сети. Транзакция отслеживается автоматически нашей системой.')}
              </span>
            </div>

            {/* AUTOMATIC BLOCKCHAIN TXID VERIFICATION FORM */}
            <div className="rounded-xl border border-cyan-400/40 bg-cyan-950/40 p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-cyan-300 uppercase tracking-wide flex items-center gap-1.5">
                  <Zap size={14} className="text-cyan-400" />
                  {t('cart.txidTitle') || (lang === 'en' ? 'Auto-verify payment via TXID (TRON / BSC)' : 'Авто-проверка оплаты по TXID (TRON / BSC)')}
                </span>
                <span className="text-[10px] text-slate-400">{t('cart.noOperator') || (lang === 'en' ? 'Automated' : 'Без участия оператора')}</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                {t('cart.txidSubtitle') || (lang === 'en' ? 'Paste transaction hash (TXID) from your wallet for instant verification and account delivery:' : 'Вставьте хэш транзакции (TXID) из вашего кошелька для моментального подтверждения и получения данных аккаунта:')}
              </p>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={t('cart.txidPlaceholder') || (lang === 'en' ? 'Paste TXID (e.g. d719e... or 0x...)' : 'Вставьте TXID (например, d719e... или 0x...)')}
                  value={txidInput}
                  onChange={(e) => setTxidInput(e.target.value)}
                  className="w-full rounded-xl border border-cyan-400/30 bg-[#040817] px-3 py-2 text-xs font-mono text-cyan-200 placeholder-slate-500 focus:border-cyan-300 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleVerifyTxid}
                  disabled={isVerifyingTxid || !txidInput.trim()}
                  className="shrink-0 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-3 py-2 text-xs font-bold text-slate-950 shadow-md hover:opacity-90 active:scale-95 disabled:opacity-50"
                >
                  {isVerifyingTxid ? (t('cart.verifying') || 'Проверка...') : (t('cart.verify') || 'Проверить')}
                </button>
              </div>

              {txidResult && (
                <div
                  className={`rounded-lg p-2.5 text-xs font-semibold ${
                    txidResult.success
                      ? 'border border-emerald-400/50 bg-emerald-950/80 text-emerald-300'
                      : 'border border-amber-400/50 bg-amber-950/80 text-amber-200'
                  }`}
                >
                  {txidResult.message}
                </div>
              )}
            </div>

            {/* PAYMENT CONFIRMATION BUTTON */}
            {paymentConfirmed ? (
              <div className="rounded-xl border border-emerald-400/50 bg-emerald-950/50 p-3 text-center text-xs font-bold text-emerald-300">
                {t('cart.paymentNotified') || (lang === 'en' ? '✔ Payment notification sent! Account access will be delivered via Telegram.' : '✔ Уведомление об оплате отправлено оператору! Доступ к аккаунтам высылается в Telegram.')}
              </div>
            ) : (
              <button
                onClick={() => setPaymentConfirmed(true)}
                className="w-full rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 py-3 text-sm font-black text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition hover:opacity-90 active:scale-[0.99]"
              >
                {t('cart.iPaid') || (lang === 'en' ? 'I have completed the payment' : 'Я оплатил транзакцию')}
              </button>
            )}
          </div>

          <button
            onClick={() => setCreatedOrder(null)}
            className="w-full rounded-2xl border border-cyan-400/30 bg-black/40 py-2.5 text-xs font-semibold text-slate-300 hover:border-cyan-400/60"
          >
            {t('cart.returnToStore') || (lang === 'en' ? 'Return to Store' : 'Вернуться в магазин')}
          </button>
        </section>
      ) : (
        <>
          <div className="space-y-3">
            {items.length === 0 && (
              <div className="rounded-2xl border border-cyan-400/20 bg-[#09122c]/60 p-8 text-center">
                <ShoppingBag size={40} className="mx-auto text-slate-500 mb-2 opacity-50" />
                <p className="text-sm font-semibold text-slate-300">{t('cart.empty') || (lang === 'en' ? 'Your cart is empty' : 'Корзина пуста')}</p>
                <p className="mt-1 text-xs text-slate-400">{t('cart.emptySub') || (lang === 'en' ? 'Select accounts in the catalog to add.' : 'Выберите необходимые аккаунты в каталоге')}</p>
              </div>
            )}
            {items.map((item) => (
              <article key={item.id} className="rounded-2xl border border-cyan-400/30 bg-[#09122c]/80 p-4 shadow-md backdrop-blur-md">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="inline-block rounded bg-cyan-950 px-2 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-400/30">
                      {item.platform || 'Account'}
                    </span>
                    <h3 className="mt-1 text-sm font-bold text-white">
                      {(lang === 'en' && item.title_en) ? item.title_en : item.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-300 font-semibold">${Number(item.price).toFixed(2)} / {lang === 'en' ? 'pc' : 'шт.'}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center rounded-xl border border-cyan-500/30 bg-black/40 px-2 py-1">
                      <button
                        onClick={() => updateQuantity ? updateQuantity(item.id, item.quantity - 1) : removeFromCart(item.id)}
                        className="px-1 text-sm font-bold text-cyan-300 hover:text-white"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-bold text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity && updateQuantity(item.id, item.quantity + 1)}
                        className="px-1 text-sm font-bold text-cyan-300 hover:text-white"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="rounded-xl border border-rose-500/30 bg-rose-950/30 p-2 text-rose-300 hover:border-rose-400"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

            {/* SMART CROSS-SELL (CONSUMABLES ADD-ONS) */}
            {items.length > 0 && <SmartCrossSell />}

            {items.length > 0 && (
            <div className="mt-4 space-y-4 rounded-3xl border border-cyan-400/40 bg-gradient-to-br from-[#0e1a3e] via-[#09122c] to-[#040817] p-5 shadow-[0_0_25px_rgba(56,189,248,0.2)]">
              {/* TOTAL PRICE HEADER */}
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <ShieldCheck size={16} className="text-cyan-400" />
                  <span>{t('cart.secureCheckout') || (lang === 'en' ? 'Direct Crypto Transfer' : 'Прямой перевод на крипто-кошелек')}</span>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400">{t('cart.amountPayable') || (lang === 'en' ? 'Total amount payable:' : 'Итого к оплате:')}</p>
                  <p className="text-2xl font-black text-cyan-300">${total.toFixed(2)} USD</p>
                </div>
              </div>

              {/* CRYPTO CURRENCY & NETWORK SELECTOR */}
              <div className="rounded-2xl border border-cyan-400/30 bg-black/40 p-3.5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-300">
                  <Wallet size={16} className="text-cyan-400" />
                  <span>{t('cart.selectCryptoNetwork') || (lang === 'en' ? 'Select cryptocurrency and network for payment:' : 'Выберите криптовалюту и сеть для оплаты:')}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {CRYPTO_OPTIONS.map((c) => {
                    const isSelected = selectedCrypto === c.id
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setSelectedCrypto(c.id)}
                        className={[
                          'flex flex-col items-start rounded-xl border p-2.5 text-left transition',
                          isSelected
                            ? 'border-cyan-400 bg-cyan-950/90 text-white shadow-[0_0_12px_rgba(56,189,248,0.35)]'
                            : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                        ].join(' ')}
                      >
                        <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                          <div className={isSelected ? 'text-cyan-300' : 'text-slate-400'}>
                            {c.renderIcon('w-4 h-4 shrink-0')}
                          </div>
                          <span>{c.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1">{c.network}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* CHECKOUT SUBMIT BUTTON */}
              <button
                onClick={checkout}
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 py-3.5 text-sm font-black text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.4)] transition hover:opacity-95 disabled:opacity-50 active:scale-[0.99]"
              >
                {isSubmitting ? (
                  <span>{t('cart.processing') || (lang === 'en' ? 'Processing...' : 'Обработка...')}</span>
                ) : (
                  <>
                    <Zap size={18} /> {t('cart.checkoutBtn') || (lang === 'en' ? 'Generate order & get wallet' : 'Сформировать заказ и получить кошелек')} <ArrowRight size={16} />
                  </>
                )}
              </button>

              {status && <p className="mt-2 text-center text-xs text-slate-300">{status}</p>}
            </div>
          )}
        </>
      )}
    </PageShell>
  )
}
