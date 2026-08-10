import { createContext, useContext, useMemo, useState } from 'react'

const LanguageContext = createContext(null)
const ENGLISH_ENABLED = true

const translations = {
  ru: {
    lang: { ru: 'RU', en: 'EN' },
    nav: {
      home: 'Главная',
      catalog: 'Каталог',
      cart: 'Корзина',
      contacts: 'Контакты',
      profile: 'Профиль'
    },
    shell: {
      language: 'Язык'
    },
    home: {
      heroSubtitle: '3D Performance Hub',
      ctaLaunchBadge: 'Реклама',
      ctaLaunchTitle: 'Заказать запуск рекламы',
      ctaTrainingBadge: 'Обучение',
      ctaTrainingTitle: 'Обучиться запуску рекламы',
      accounts: 'Аккаунты',
      autoScroll: '3 карточки / 10 сек',
      promos: 'Акции',
      articles: 'Статьи и кейсы',
      bubbleLaunch: 'Заказать рекламу',
      bubbleTraining: 'Обучиться запуску рекламы',
      defaultBannerSubtitle: 'Связки под ваш бюджет и нишу',
      defaultPromoTitle1: 'Запуск и обучение в одном месте',
      defaultPromoSub1: 'Практика, связки и поддержка команды',
      defaultPromoTitle2: 'Скидка 10% на второй заказ',
      defaultPromoSub2: 'Акция активируется автоматически после первой успешной оплаты'
    },
    catalog: {
      title: 'Каталог',
      loading: 'Загрузка...',
      choose: 'Выберите соцсеть. На этом шаге цены скрыты.',
      productsCount: 'товаров',
      back: 'Назад к категориям'
    },
    contacts: {
      title: 'Контакты',
      empty: 'Контакты пока не добавлены.',
      channel: 'Официальный канал',
      admin: 'Администратор'
    },
    admin: {
      title: 'Админ-панель',
      denied: 'Доступ только для администраторов.',
      tabs: {
        overview: 'Обзор',
        home: 'Витрина',
        catalog: 'Каталог',
        contacts: 'Контакты',
        banners: 'Баннеры',
        articles: 'Статьи'
      },
      overviewTitle: 'Управление проектом Mediabuy Lab',
      overviewItems: [
        'Главная: логотип, заголовок, баннеры и промо-предложения.',
        'Каталог: категории аккаунтов, карточки товаров, цены и наборы.',
        'Контакты: публичные ссылки администраторов и официальных каналов.',
        'Баннеры: визуальные акции, изображения, бейджи и ссылки.',
        'Статьи: публикации, кейсы и разборы с мультиязычностью.'
      ]
    },
    launch: {
      title: 'Запуск рекламы',
      heading: 'Запуск рекламы под ключ',
      price: 'Цена: от $X (Индивидуально)',
      projectUrl: 'Ссылка на проект (необязательно)',
      budget: 'Планируемый рекламный бюджет',
      submit: 'Отправить заявку',
      sending: 'Отправка заявки...',
      ok: 'Заявка на запуск рекламы отправлена',
      fail: 'Не удалось отправить заявку'
    },
    training: {
      title: 'Обучение',
      heading: 'Обучение запуску рекламы',
      subtitle: 'Запуск рекламы, клоакинг, воронки',
      details: 'Дополнительные детали',
      submit: 'Отправить на обучение',
      sending: 'Отправка заявки...',
      ok: 'Заявка на обучение отправлена',
      fail: 'Не удалось отправить заявку',
      exp: {
        novice: 'Новичок',
        basic: 'Есть базовый опыт',
        pro: 'Профессионал',
        other: 'Другое'
      }
    },
    cart: {
      title: 'Корзина',
      empty: 'В корзине пока нет товаров.',
      emptySub: 'Перейдите в каталог, чтобы добавить аккаунты.',
      total: 'Итого',
      checkout: 'Оформить и оплатить',
      remove: 'Удалить',
      emptyWarn: 'Корзина пуста',
      creating: 'Формирование заказа...',
      fail: 'Ошибка при создании заказа. Попробуйте снова.',
      createdSuccess: 'Заказ #{id} успешно создан!',
      createdInvoice: 'ОФИЦИАЛЬНЫЙ СЧЕТ MEDIABUY LAB',
      createdTitle: 'Заказ #{id} успешно сформирован!',
      orderAmount: 'Сумма заказа:',
      paymentDetails: 'Реквизиты для оплаты ({currency})',
      walletIndex: 'Кошелек #{index}',
      scanQr: 'Отсканируйте QR в вашем крипто-кошельке',
      exactAmount: 'Точная сумма к переводу:',
      copied: 'Скопировано',
      copy: 'Скопировать',
      walletAddress: 'Адрес кошелька ({currency}):',
      addressCopied: 'Адрес скопирован в буфер!',
      copyAddress: 'Скопировать адрес кошелька',
      sendTelegramReceipt: 'Отправить реквизиты и чек в Telegram',
      sendingTelegram: 'Отправка в Telegram...',
      networkNotice: 'Переводите строго указанную валюту в правильной сети. Транзакция отслеживается автоматически нашей системой.',
      txidTitle: 'Авто-проверка оплаты по TXID (TRON / BSC)',
      noOperator: 'Без участия оператора',
      txidSubtitle: 'Вставьте хэш транзакции (TXID) из вашего кошелька для моментального подтверждения и получения данных аккаунта:',
      txidPlaceholder: 'Вставьте TXID (например, d719e... или 0x...)',
      verify: 'Проверить',
      verifying: 'Проверка...',
      iPaid: 'Я оплатил транзакцию',
      paymentNotified: '✔ Уведомление об оплате отправлено оператору! Доступ к аккаунтам высылается в Telegram.',
      selectCryptoNetwork: 'Выберите криптовалюту и сеть для оплаты:',
      checkoutBtn: 'Сформировать заказ и получить кошелек',
      amountPayable: 'Итого к оплате:',
      discountApplied: 'Применена скидка {percent}%',
      payWithOxaPay: 'Прямой перевод на крипто-кошелек',
      returnToStore: 'Вернуться в магазин',
      secureCheckout: 'Прямой перевод на крипто-кошелек',
      processing: 'Обработка...',
      cryptoBadge: 'USDT / Crypto'
    },
    profile: {
      title: 'Профиль',
      loading: 'Загрузка...',
      user: 'Арбитражник',
      loyaltyProgram: 'Программа лояльности',
      discountTitle: 'Скидка 10% на следующий заказ',
      discount: 'Персональная скидка',
      discountLine: 'Прогресс скидки',
      adminOpen: 'Панель управления (Admin)',
      adminOpenDesc: 'Управление товарами, баннерами и контактами',
      ordersHistory: 'История заказов',
      noOrders: 'У вас пока нет оформленных заказов',
      order: 'Заказ #',
      statusWaiting: 'Ожидает оплаты',
      statusPaid: 'Оплачен',
      discountAppliedTag: 'Скидка',
      payNow: 'Реквизиты оплаты',
      supportSection: 'Поддержка и связь',
      contactAdmin: 'Связаться с Администратором',
      contactAdminDesc: '@mediabuy_adm — ответы по заказам и связкам',
      officialChannel: 'Официальный Telegram Канал',
      officialChannelDesc: 'Кейсы, новости и обновления сервиса',
      verifiedUser: 'Верифицированный пользователь'
    },
    articleList: {
      openPost: 'Открыть пост в канале',
      readArticle: 'Читать статью'
    },
    common: {
      save: 'Сохранить',
      add: 'Добавить',
      delete: 'Удалить',
      show: 'Показать',
      hide: 'Скрыть',
      on: 'Включить',
      off: 'Выключить',
      loading: 'Загрузка...',
      edit: 'Редактировать',
      cancel: 'Отмена',
      active: 'Активен',
      inactive: 'Неактивен'
    }
  },
  en: {
    lang: { ru: 'RU', en: 'EN' },
    nav: {
      home: 'Home',
      catalog: 'Catalog',
      cart: 'Cart',
      contacts: 'Contacts',
      profile: 'Profile'
    },
    shell: {
      language: 'Language'
    },
    home: {
      heroSubtitle: '3D Performance Hub',
      ctaLaunchBadge: 'Ads',
      ctaLaunchTitle: 'Launch Advertising',
      ctaTrainingBadge: 'Training',
      ctaTrainingTitle: 'Learn Ad Launch',
      accounts: 'Accounts',
      autoScroll: '3 cards / 10 sec',
      promos: 'Promotions',
      articles: 'Articles & Cases',
      bubbleLaunch: 'Order Ads Launch',
      bubbleTraining: 'Learn Ad Launch',
      defaultBannerSubtitle: 'Custom strategies for your budget and niche',
      defaultPromoTitle1: 'Turnkey launch & training in one place',
      defaultPromoSub1: 'Hands-on funnels and team support',
      defaultPromoTitle2: '10% discount on second order',
      defaultPromoSub2: 'Automatically activated after your first successful payment'
    },
    catalog: {
      title: 'Catalog',
      loading: 'Loading...',
      choose: 'Choose a social platform. Prices are hidden at this step.',
      productsCount: 'items',
      back: 'Back to categories'
    },
    contacts: {
      title: 'Contacts',
      empty: 'No contacts added yet.',
      channel: 'Official Channel',
      admin: 'Administrator'
    },
    admin: {
      title: 'Admin Panel',
      denied: 'Access is restricted to administrators.',
      tabs: {
        overview: 'Overview',
        home: 'Showcase',
        catalog: 'Catalog',
        contacts: 'Contacts',
        banners: 'Banners',
        articles: 'Articles'
      },
      overviewTitle: 'Mediabuy Lab Project Management',
      overviewItems: [
        'Home: logo, header, banners, and promotional offers.',
        'Catalog: account categories, product cards, pricing, and bundles.',
        'Contacts: public admin handles and official channel links.',
        'Banners: visual promotions, images, custom badges, and URLs.',
        'Articles: publications, cases, and multilingual breakdowns.'
      ]
    },
    launch: {
      title: 'Ads Launch',
      heading: 'Turnkey Ad Launch',
      price: 'Price: from $X (custom)',
      projectUrl: 'Project URL (optional)',
      budget: 'Planned ad budget',
      submit: 'Submit Request',
      sending: 'Submitting request...',
      ok: 'Ads launch request submitted',
      fail: 'Failed to submit request'
    },
    training: {
      title: 'Training',
      heading: 'Ad Launch Training',
      subtitle: 'Ad launch, cloaking, funnels',
      details: 'Additional details',
      submit: 'Submit for Training',
      sending: 'Submitting request...',
      ok: 'Training request submitted',
      fail: 'Failed to submit request',
      exp: {
        novice: 'Beginner',
        basic: 'Basic Experience',
        pro: 'Professional',
        other: 'Other'
      }
    },
    cart: {
      title: 'Cart',
      empty: 'Your cart is empty.',
      emptySub: 'Go to the catalog to add accounts.',
      total: 'Total',
      checkout: 'Checkout & Pay',
      remove: 'Remove',
      emptyWarn: 'Cart is empty',
      creating: 'Generating order...',
      fail: 'Failed to create order. Please try again.',
      createdSuccess: 'Order #{id} created successfully!',
      createdInvoice: 'MEDIABUY LAB OFFICIAL INVOICE',
      createdTitle: 'Order #{id} generated successfully!',
      orderAmount: 'Order amount:',
      paymentDetails: 'Payment Details ({currency})',
      walletIndex: 'Round-Robin Wallet #{index}',
      scanQr: 'Scan QR code in your crypto wallet',
      exactAmount: 'Exact amount to transfer:',
      copied: 'Copied',
      copy: 'Copy',
      walletAddress: 'Wallet address ({currency}):',
      addressCopied: 'Address copied to clipboard!',
      copyAddress: 'Copy wallet address',
      sendTelegramReceipt: 'Send payment details and receipt to Telegram',
      sendingTelegram: 'Sending to Telegram...',
      networkNotice: 'Transfer strictly the specified currency on the correct network. Transactions are automatically tracked by our system.',
      txidTitle: 'Auto-verify payment via TXID (TRON / BSC)',
      noOperator: 'Automated verification',
      txidSubtitle: 'Paste transaction hash (TXID) from your wallet for instant verification and account delivery:',
      txidPlaceholder: 'Paste TXID (e.g. d719e... or 0x...)',
      verify: 'Verify',
      verifying: 'Verifying...',
      iPaid: 'I have completed the payment',
      paymentNotified: '✔ Payment notification sent! Account access will be delivered via Telegram.',
      selectCryptoNetwork: 'Select cryptocurrency and network for payment:',
      checkoutBtn: 'Generate order & get wallet',
      amountPayable: 'Total amount payable:',
      discountApplied: 'Discount applied {percent}%',
      payWithOxaPay: 'Direct Crypto Wallet Transfer',
      returnToStore: 'Return to Store',
      secureCheckout: 'Direct Crypto Transfer',
      processing: 'Processing...',
      cryptoBadge: 'USDT / Crypto'
    },
    profile: {
      title: 'Profile',
      loading: 'Loading...',
      user: 'Media Buyer',
      loyaltyProgram: 'Loyalty Program',
      discountTitle: '10% Discount on Next Order',
      discount: 'Personal Discount',
      discountLine: 'Discount Progress',
      adminOpen: 'Admin Control Panel',
      adminOpenDesc: 'Manage products, banners, and contacts',
      ordersHistory: 'Order History',
      noOrders: 'You have no placed orders yet',
      order: 'Order #',
      statusWaiting: 'Awaiting Payment',
      statusPaid: 'Paid',
      discountAppliedTag: 'Discount',
      payNow: 'Payment Details',
      supportSection: 'Support & Contact',
      contactAdmin: 'Contact Administrator',
      contactAdminDesc: '@mediabuy_adm — support for orders & funnels',
      officialChannel: 'Official Telegram Channel',
      officialChannelDesc: 'Cases, news, and service updates',
      verifiedUser: 'Verified Mini App User'
    },
    articleList: {
      openPost: 'Open post in channel',
      readArticle: 'Read article'
    },
    common: {
      save: 'Save',
      add: 'Add',
      delete: 'Delete',
      show: 'Show',
      hide: 'Hide',
      on: 'Enable',
      off: 'Disable',
      loading: 'Loading...',
      edit: 'Edit',
      cancel: 'Cancel',
      active: 'Active',
      inactive: 'Inactive'
    }
  }
}

const getValue = (obj, path) =>
  path.split('.').reduce((acc, key) => (acc && key in acc ? acc[key] : null), obj)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const storedLang = localStorage.getItem('mb_lang') || 'ru'
    if (!ENGLISH_ENABLED && storedLang === 'en') {
      return 'ru'
    }
    return storedLang
  })

  const value = useMemo(() => {
    const t = (key) => {
      const selected = getValue(translations[lang], key)
      if (selected !== null && selected !== undefined) return selected
      const fallback = getValue(translations.ru, key)
      return fallback ?? key
    }

    const changeLanguage = (nextLang) => {
      if (!ENGLISH_ENABLED && nextLang === 'en') {
        return
      }
      setLang(nextLang)
      localStorage.setItem('mb_lang', nextLang)
    }

    return { lang, t, changeLanguage }
  }, [lang])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return ctx
}
