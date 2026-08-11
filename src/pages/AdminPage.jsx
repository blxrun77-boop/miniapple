import { useEffect, useState } from 'react'
import api from '../api/client'
import PageShell from '../components/PageShell.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import {
  LayoutDashboard,
  Image as ImageIcon,
  ShoppingBag,
  BookOpen,
  Users,
  Settings,
  Plus,
  Trash2,
  Save,
  Eye,
  EyeOff,
  ExternalLink,
  Upload,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Tag,
  ShieldCheck,
  LogOut,
  FileText,
  AlertCircle
} from 'lucide-react'

export default function AdminPage() {
  const { user } = useAuth()
  const { t, lang } = useLanguage()
  const [activeTab, setActiveTab] = useState('overview')
  const [logoFile, setLogoFile] = useState(null)
  const [botMenuImageFile, setBotMenuImageFile] = useState(null)
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [contacts, setContacts] = useState([])
  const [banners, setBanners] = useState([])
  const [articles, setArticles] = useState([])
  const [orders, setOrders] = useState([])
  const [homeSettings, setHomeSettings] = useState(null)
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all')

  const [newCategory, setNewCategory] = useState({ name: '', slug: '' })
  const [newProduct, setNewProduct] = useState({
    category_id: '',
    title: '',
    title_en: '',
    description: '',
    description_en: '',
    detailed_description: '',
    detailed_description_en: '',
    geo: 'US / EU / WW',
    format: 'Login:Pass:2FA:Cookies(JSON)',
    replacement_policy: 'Бесплатная замена 24 часа',
    usage_instructions: 'Работа через антидетект браузер и статичные прокси',
    platform: 'Facebook',
    price: 0,
    stock: 50
  })
  const [newProxyProduct, setNewProxyProduct] = useState({
    category_id: '',
    title: '',
    title_en: '',
    description: '',
    description_en: '',
    detailed_description: '',
    detailed_description_en: '',
    geo: 'US / EU / WW',
    format: 'IP:PORT:USER:PASS:CHANGE_URL',
    replacement_policy: 'Гарантированная замена 24 часа',
    usage_instructions: 'Настройте прокси в антидетект браузере и проверьте IP',
    platform: 'Proxy',
    price: 0,
    stock: 50
  })
  const [newSetupProduct, setNewSetupProduct] = useState({
    category_id: '',
    title: '',
    title_en: '',
    description: '',
    description_en: '',
    detailed_description: '',
    detailed_description_en: '',
    geo: 'WW / Global',
    format: 'Login:Pass:2FA:Cookies + Proxy + Checklist',
    replacement_policy: 'Замена любого элемента комплекта в течение 48 часов',
    usage_instructions: 'Действуйте согласно чеклисту запуска и используйте чистый прокси',
    platform: 'Setup',
    price: 0,
    stock: 20
  })
  const [newContact, setNewContact] = useState({ title: '', title_en: '', link: '', kind: 'person', sort_order: 0 })
  const [newBanner, setNewBanner] = useState({
    title: '',
    subtitle: '',
    image_url: '',
    target_url: '',
    badge_text: 'PROMO & OFFERS',
    sort_order: 0
  })
  const [newArticle, setNewArticle] = useState({
    title: '',
    image_url: '',
    target_url: '',
    sort_order: 0,
    add_english_version: false,
    title_en: '',
    image_url_en: '',
    target_url_en: ''
  })

  const [status, setStatus] = useState('')
  const [statusType, setStatusType] = useState('info') // 'info' | 'success' | 'error'
  const [webAdminAuthorized, setWebAdminAuthorized] = useState(false)
  const [authChecking, setAuthChecking] = useState(true)
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [authError, setAuthError] = useState('')

  const hasAdminAccess = webAdminAuthorized

  // Create post states
  const [channelId, setChannelId] = useState('-1002061825930')
  const [postImageFile, setPostImageFile] = useState(null)
  const [postText, setPostText] = useState('')
  const [postTextEn, setPostTextEn] = useState('')
  // buttons array: supports multiple inline buttons, style and web app flag
  const [buttons, setButtons] = useState([
    { text: 'Открыть Mini App (Каталог)', text_en: 'Open Mini App (Catalog)', url: '', style: 'success', is_web_app: true },
    { text: 'Наш Telegram Канал', text_en: 'Our Telegram Channel', url: 'https://t.me/mediabuy_lab', style: 'primary', is_web_app: false },
    { text: 'Наши Менеджеры', text_en: 'Our Managers', url: '', style: 'default', is_web_app: false },
    { text: 'Наши гарантии', text_en: 'Guarantees', url: '', style: 'default', is_web_app: false }
  ])
  const [previewResult, setPreviewResult] = useState(null)
  const [scheduleAt, setScheduleAt] = useState('')
  const [scheduleChoice, setScheduleChoice] = useState('now') // 'now' or 'pick'
  const [channelTitle, setChannelTitle] = useState(lang === 'en' ? 'Post in Public Channel' : 'Пост в Public Channel')
  const [channelSubscribers, setChannelSubscribers] = useState(1130)
  const [showChannelId, setShowChannelId] = useState(false)

  const showStatus = (msg, type = 'info') => {
    setStatus(msg)
    setStatusType(type)
    setTimeout(() => {
      setStatus('')
    }, 4000)
  }

  const tabs = [
    { id: 'overview', label: t('admin.tabs.overview') || 'Overview', icon: LayoutDashboard },
    { id: 'orders', label: lang === 'en' ? 'Orders & TXID' : 'Заказы и выдача', icon: ShieldCheck },
    { id: 'banners', label: t('admin.tabs.banners') || 'Banners', icon: ImageIcon },
    { id: 'catalog', label: t('admin.tabs.catalog') || 'Catalog', icon: ShoppingBag },
    { id: 'articles', label: t('admin.tabs.articles') || 'Articles', icon: BookOpen },
    { id: 'home', label: t('admin.tabs.home') || 'Showcase', icon: Settings },
    { id: 'contacts', label: t('admin.tabs.contacts') || 'Contacts', icon: Users },
    { id: 'create_post', label: lang === 'en' ? 'Create Post' : 'Создать пост', icon: Plus }
  ]

  const loadAdminData = async () => {
    try {
      const [
        categoriesRes,
        productsRes,
        contactsRes,
        bannersRes,
        articlesRes,
        ordersRes,
        homeRes
      ] = await Promise.all([
        api.get('/admin/categories'),
        api.get('/admin/products'),
        api.get('/admin/contacts'),
        api.get('/admin/banners'),
        api.get('/admin/articles'),
        api.get('/admin/orders').catch(() => ({ data: [] })),
        api.get('/admin/home-settings')
      ])
      setCategories(categoriesRes.data || [])
      setProducts(productsRes.data || [])
      setContacts(contactsRes.data || [])
      setBanners(bannersRes.data || [])
      setArticles(articlesRes.data || [])
      setOrders(ordersRes.data || [])
      setHomeSettings(homeRes.data || null)
    } catch (err) {
      showStatus(lang === 'en' ? 'Failed to load admin data' : 'Не удалось загрузить админ-данные', 'error')
    }
  }

  useEffect(() => {
    const checkWebAdminSession = async () => {
      setAuthChecking(true)

      const token = localStorage.getItem('mb_admin_token')
      if (token) {
        try {
          await api.get('/auth/admin/me')
          setWebAdminAuthorized(true)
          setAuthChecking(false)
          return
        } catch {
          localStorage.removeItem('mb_admin_token')
          setWebAdminAuthorized(false)
        }
      }

      try {
        const { data } = await api.get('/auth/admin/check-tg')
        if (data && data.is_admin) {
          setWebAdminAuthorized(true)
          setAuthChecking(false)
          return
        }
      } catch {
        // ignore
      }

      setWebAdminAuthorized(false)
      setAuthChecking(false)
    }

    checkWebAdminSession()
  }, [])

  useEffect(() => {
    if (hasAdminAccess) {
      loadAdminData()
      loadChannelId()
    }
  }, [hasAdminAccess])

  const loadChannelId = async () => {
    try {
      const res = await api.get('/admin/channel-id')
      setChannelId(res.data.channel_id || '')
    } catch (e) {
      // ignore
    }
  }

  const createPostDraft = async () => {
    try {
      const form = new FormData()
      form.append('text', postText)
      form.append('text_en', postTextEn)
      form.append('buttons', JSON.stringify(buttons))
      form.append('previewLanguage', lang)
      if (scheduleChoice === 'pick' && scheduleAt) form.append('scheduleAt', scheduleAt)
      if (postImageFile) form.append('image', postImageFile)
      else form.append('use_public_image', '1')
      if (channelTitle) form.append('channel_title', channelTitle)

      const res = await api.post('/admin/posts/draft', form)
      if (res.data && res.data.token) {
        setPreviewResult(res.data)
        showStatus(lang === 'en' ? 'Draft created' : 'Драфт создан', 'success')
      } else {
        showStatus(lang === 'en' ? 'Failed to create draft' : 'Ошибка создания драфта', 'error')
      }
    } catch (err) {
      console.error(err)
      showStatus(lang === 'en' ? 'Failed to create draft' : 'Ошибка создания драфта', 'error')
    }
  }

  const getButtonClass = (style) => {
    switch (style) {
      case 'success': return 'bg-emerald-500 hover:bg-emerald-600 text-white';
      case 'primary': return 'bg-blue-500 hover:bg-blue-600 text-white';
      case 'danger': return 'bg-rose-500 hover:bg-rose-600 text-white';
      default: return 'bg-slate-800 text-white';
    }
  }

  // Create Post: manage inline buttons (copied/adapted from Showcase bot settings)
  const addPostButton = () => {
    const newBtn = { id: Date.now(), text: '✨ Новая кнопка', text_en: '✨ New Button', style: 'success', url: 'https://t.me/mediabuy_lab', is_web_app: false }
    setButtons((prev) => [...prev, newBtn])
  }

  const updatePostButton = (btnId, updatedFields) => {
    setButtons((prev) => prev.map(b => (b.id === btnId || b.id === undefined && String(b) === String(btnId)) ? { ...b, ...updatedFields } : b))
  }

  const deletePostButton = (btnId) => {
    setButtons((prev) => prev.filter(b => !(b.id === btnId || (b.id === undefined && String(b) === String(btnId)))))
  }

  const publishDraftNow = async () => {
    try {
      if (!previewResult || !previewResult.token) return showStatus('No draft', 'error')
      // publish now ignores scheduleAt and forces immediate publish
      const res = await api.post('/admin/posts/publish', { token: previewResult.token, publishNow: '1', channel_chat_id: channelId })
      if (res.data && res.data.ok) {
        showStatus(lang === 'en' ? 'Published' : 'Опубликовано', 'success')
        setPreviewResult(null)
      } else {
        showStatus(lang === 'en' ? 'Publish failed' : 'Ошибка публикации', 'error')
      }
    } catch (err) {
      console.error(err)
      showStatus(lang === 'en' ? 'Publish failed' : 'Ошибка публикации', 'error')
    }
  }

  const scheduleDraft = async () => {
    try {
      if (!previewResult || !previewResult.token) return showStatus('No draft', 'error')
      // if scheduleChoice is pick, use scheduleAt; otherwise treat as now
      if (scheduleChoice !== 'pick') return showStatus(lang === 'en' ? 'Select time first' : 'Сначала выберите время', 'error')
      const res = await api.post('/admin/posts/publish', { token: previewResult.token, publishNow: '0', scheduleAt, channel_chat_id: channelId })
      if (res.data && res.data.scheduled) {
        showStatus(lang === 'en' ? 'Scheduled' : 'Запланировано', 'success')
        setPreviewResult(null)
      } else {
        showStatus(lang === 'en' ? 'Schedule failed' : 'Ошибка планирования', 'error')
      }
    } catch (err) {
      console.error(err)
      showStatus(lang === 'en' ? 'Schedule failed' : 'Ошибка планирования', 'error')
    }
  }

  const loginWebAdmin = async () => {
    try {
      const { data } = await api.post('/auth/admin/login', loginForm)
      localStorage.setItem('mb_admin_token', data.access_token)
      setWebAdminAuthorized(true)
      setAuthError('')
      showStatus(lang === 'en' ? 'Web Admin Authorized' : 'Вход в Web Admin выполнен', 'success')
      await loadAdminData()
    } catch (error) {
      const detail = error?.response?.data?.detail
      setAuthError(typeof detail === 'string' ? detail : (lang === 'en' ? 'Invalid credentials' : 'Неверный логин или пароль'))
    }
  }

  const logoutWebAdmin = () => {
    localStorage.removeItem('mb_admin_token')
    setWebAdminAuthorized(false)
    setLoginForm({ username: '', password: '' })
    showStatus(lang === 'en' ? 'Logged out' : 'Выход выполнен', 'info')
  }

  const updateHomeSettings = async () => {
    try {
      await api.patch('/admin/home-settings', homeSettings)
      showStatus(lang === 'en' ? 'Showcase settings saved' : 'Настройки витрины сохранены', 'success')
    } catch {
      showStatus(lang === 'en' ? 'Failed to update showcase settings' : 'Ошибка сохранения настроек', 'error')
    }
  }

  const uploadHomeLogo = async () => {
    if (!logoFile) {
      showStatus(lang === 'en' ? 'Please select a PNG logo file' : 'Выберите PNG файл логотипа', 'error')
      return
    }

    const formData = new FormData()
    formData.append('file', logoFile)
    try {
      const { data } = await api.post('/admin/home-settings/logo-upload', formData)
      setHomeSettings(data)
      setLogoFile(null)
      showStatus(lang === 'en' ? 'Logo uploaded successfully' : 'Логотипа загружен и применен', 'success')
    } catch {
      showStatus(lang === 'en' ? 'Logo upload failed' : 'Ошибка загрузки логотипа', 'error')
    }
  }

  const uploadBotMenuImage = async () => {
    if (!botMenuImageFile) {
      showStatus(lang === 'en' ? 'Select an image for bot background' : 'Выберите файл фона меню бота', 'error')
      return
    }

    const formData = new FormData()
    formData.append('file', botMenuImageFile)
    try {
      const { data } = await api.post('/admin/home-settings/bot-menu-image-upload', formData)
      setHomeSettings(data)
      setBotMenuImageFile(null)
      showStatus(lang === 'en' ? 'Bot menu background updated' : 'Фон меню бота обновлен', 'success')
    } catch {
      showStatus(lang === 'en' ? 'Failed to upload bot menu image' : 'Ошибка загрузки фона бота', 'error')
    }
  }

  const createCategory = async () => {
    if (!newCategory.name) return
    try {
      await api.post('/admin/categories', newCategory)
      setNewCategory({ name: '', slug: '' })
      await loadAdminData()
      showStatus(lang === 'en' ? 'Category created' : 'Категория добавлена', 'success')
    } catch {
      showStatus(lang === 'en' ? 'Failed to create category' : 'Ошибка создания категории', 'error')
    }
  }

  const updateCategory = async (category) => {
    try {
      await api.patch(`/admin/categories/${category.id}`, {
        name: category.name,
        slug: category.slug,
        is_visible: category.is_visible
      })
      showStatus(lang === 'en' ? `Category #${category.id} saved` : `Категория #${category.id} обновлена`, 'success')
    } catch {
      showStatus(lang === 'en' ? 'Failed to update category' : 'Ошибка обновления категории', 'error')
    }
  }

  const deleteCategory = async (id) => {
    if (!window.confirm(lang === 'en' ? 'Delete this category?' : 'Удалить эту категорию?')) return
    try {
      await api.delete(`/admin/categories/${id}`)
      await loadAdminData()
      showStatus(lang === 'en' ? 'Category deleted' : 'Категория удалена', 'info')
    } catch {
      showStatus(lang === 'en' ? 'Failed to delete category' : 'Ошибка удаления категории', 'error')
    }
  }

  const createProduct = async () => {
    if (!newProduct.title || !newProduct.category_id) {
      showStatus(lang === 'en' ? 'Select category and product title' : 'Укажите категорию и название товара', 'error')
      return
    }
    try {
      await api.post('/admin/products', {
        ...newProduct,
        category_id: Number(newProduct.category_id),
        price: Number(newProduct.price) || 0,
        stock: Number(newProduct.stock) || 50
      })
      setNewProduct({
        category_id: '',
        title: '',
        title_en: '',
        description: '',
        description_en: '',
        detailed_description: '',
        detailed_description_en: '',
        geo: 'US / EU / WW',
        format: 'Login:Pass:2FA:Cookies(JSON)',
        replacement_policy: 'Бесплатная замена 24 часа',
        usage_instructions: 'Работа через антидетект браузер и статичные прокси',
        platform: 'Facebook',
        price: 0,
        stock: 50
      })
      await loadAdminData()
      showStatus(lang === 'en' ? 'Product created' : 'Товар успешно добавлен', 'success')
    } catch {
      showStatus(lang === 'en' ? 'Failed to create product' : 'Ошибка создания товара', 'error')
    }
  }

  const updateProduct = async (product) => {
    try {
      await api.patch(`/admin/products/${product.id}`, {
        title: product.title,
        title_en: product.title_en,
        description: product.description,
        description_en: product.description_en,
        detailed_description: product.detailed_description,
        detailed_description_en: product.detailed_description_en,
        geo: product.geo,
        format: product.format,
        replacement_policy: product.replacement_policy,
        usage_instructions: product.usage_instructions,
        platform: product.platform,
        price: Number(product.price),
        stock: Number(product.stock),
        is_visible: product.is_visible
      })
      showStatus(lang === 'en' ? `Product #${product.id} updated` : `Товар #${product.id} обновлен`, 'success')
    } catch {
      showStatus(lang === 'en' ? 'Failed to update product' : 'Ошибка обновления товара', 'error')
    }
  }

  const updateOrderStatus = async (orderId, status, deliveredData = '') => {
    try {
      await api.patch(`/admin/orders/${orderId}`, { status, delivered_data: deliveredData })
      await loadAdminData()
      showStatus(lang === 'en' ? `Order #${orderId} updated to ${status}` : `Заказ #${orderId} переведен в статус: ${status}`, 'success')
    } catch {
      showStatus(lang === 'en' ? 'Failed to update order' : 'Ошибка обновления заказа', 'error')
    }
  }

  const triggerCheckPayment = async (orderId) => {
    try {
      showStatus(lang === 'en' ? 'Verifying payment in TRON/BSC blockchain...' : 'Проверка транзакции в сети TRON/BSC...', 'info')
      const res = await api.post(`/orders/${orderId}/check-payment`)
      await loadAdminData()
      if (res.data.verified) {
        showStatus(lang === 'en' ? 'Payment confirmed by API!' : 'Оплата подтверждена автоматической API проверкой!', 'success')
      } else {
        showStatus(lang === 'en' ? 'Transaction not found in blockchain yet.' : 'Транзакция пока не найдена в блокчейне.', 'error')
      }
    } catch (err) {
      showStatus(lang === 'en' ? 'API verification error' : 'Ошибка при автоматической проверке', 'error')
    }
  }

  const deleteProduct = async (id) => {
    if (!window.confirm(lang === 'en' ? 'Delete this product?' : 'Удалить этот товар?')) return
    try {
      await api.delete(`/admin/products/${id}`)
      await loadAdminData()
      showStatus(lang === 'en' ? 'Product deleted' : 'Товар удален', 'info')
    } catch {
      showStatus(lang === 'en' ? 'Failed to delete product' : 'Ошибка удаления товара', 'error')
    }
  }

  const addBotButton = () => {
    if (!homeSettings) return
    const newBtn = {
      id: Date.now(),
      text: '✨ Новая кнопка',
      text_en: '✨ New Button',
      style: 'success',
      url: 'https://t.me/mediabuy_lab',
      is_web_app: false
    }
    const currentBtns = homeSettings.bot_buttons || []
    setHomeSettings({ ...homeSettings, bot_buttons: [...currentBtns, newBtn] })
  }

  const updateBotButton = (btnId, updatedFields) => {
    if (!homeSettings) return
    const currentBtns = homeSettings.bot_buttons || []
    const newBtns = currentBtns.map(b => b.id === btnId ? { ...b, ...updatedFields } : b)
    setHomeSettings({ ...homeSettings, bot_buttons: newBtns })
  }

  const deleteBotButton = (btnId) => {
    if (!homeSettings) return
    const currentBtns = homeSettings.bot_buttons || []
    setHomeSettings({ ...homeSettings, bot_buttons: currentBtns.filter(b => b.id !== btnId) })
  }

  const createContact = async () => {
    if (!newContact.title || !newContact.link) return
    try {
      await api.post('/admin/contacts', {
        ...newContact,
        sort_order: Number(newContact.sort_order) || 0
      })
      setNewContact({ title: '', title_en: '', link: '', kind: 'person', sort_order: 0 })
      await loadAdminData()
      showStatus(lang === 'en' ? 'Contact added' : 'Контакт добавлен', 'success')
    } catch {
      showStatus(lang === 'en' ? 'Failed to add contact' : 'Ошибка добавления контакта', 'error')
    }
  }

  const updateContact = async (contact) => {
    try {
      await api.patch(`/admin/contacts/${contact.id}`, {
        title: contact.title,
        title_en: contact.title_en || null,
        link: contact.link,
        kind: contact.kind,
        is_active: contact.is_active,
        sort_order: Number(contact.sort_order) || 0
      })
      showStatus(lang === 'en' ? `Contact #${contact.id} saved` : `Контакт #${contact.id} обновлен`, 'success')
    } catch {
      showStatus(lang === 'en' ? 'Failed to update contact' : 'Ошибка обновления контакта', 'error')
    }
  }

  const deleteContact = async (id) => {
    if (!window.confirm(lang === 'en' ? 'Delete contact?' : 'Удалить контакт?')) return
    try {
      await api.delete(`/admin/contacts/${id}`)
      await loadAdminData()
      showStatus(lang === 'en' ? 'Contact deleted' : 'Контакт удален', 'info')
    } catch {
      showStatus(lang === 'en' ? 'Failed to delete contact' : 'Ошибка удаления контакта', 'error')
    }
  }

  const createBanner = async () => {
    if (!newBanner.title || !newBanner.image_url) {
      showStatus(lang === 'en' ? 'Banner title and image URL are required' : 'Укажите название и URL картинки баннера', 'error')
      return
    }
    try {
      await api.post('/admin/banners', {
        ...newBanner,
        badge_text: newBanner.badge_text || 'PROMO & OFFERS',
        sort_order: Number(newBanner.sort_order) || 0
      })
      setNewBanner({ title: '', subtitle: '', image_url: '', target_url: '', badge_text: 'PROMO & OFFERS', sort_order: 0 })
      await loadAdminData()
      showStatus(lang === 'en' ? 'New banner added' : 'Баннер успешно добавлен', 'success')
    } catch {
      showStatus(lang === 'en' ? 'Failed to create banner' : 'Ошибка добавления баннера', 'error')
    }
  }

  const updateBanner = async (banner) => {
    try {
      await api.patch(`/admin/banners/${banner.id}`, {
        title: banner.title,
        subtitle: banner.subtitle,
        image_url: banner.image_url,
        target_url: banner.target_url,
        badge_text: banner.badge_text,
        sort_order: Number(banner.sort_order) || 0,
        is_active: banner.is_active
      })
      showStatus(lang === 'en' ? `Banner #${banner.id} saved` : `Баннер #${banner.id} обновлен`, 'success')
    } catch {
      showStatus(lang === 'en' ? 'Failed to update banner' : 'Ошибка обновления баннера', 'error')
    }
  }

  const deleteBanner = async (id) => {
    if (!window.confirm(lang === 'en' ? 'Delete banner?' : 'Удалить баннер?')) return
    try {
      await api.delete(`/admin/banners/${id}`)
      await loadAdminData()
      showStatus(lang === 'en' ? 'Banner deleted' : 'Баннер удален', 'info')
    } catch {
      showStatus(lang === 'en' ? 'Failed to delete banner' : 'Ошибка удаления баннера', 'error')
    }
  }

  const createArticle = async () => {
    if (!newArticle.title || !newArticle.image_url) {
      showStatus(lang === 'en' ? 'Title and image URL required' : 'Укажите название и обложку статьи', 'error')
      return
    }
    try {
      await api.post('/admin/articles', {
        ...newArticle,
        sort_order: Number(newArticle.sort_order) || 0
      })
      setNewArticle({
        title: '',
        image_url: '',
        target_url: '',
        sort_order: 0,
        add_english_version: false,
        title_en: '',
        image_url_en: '',
        target_url_en: ''
      })
      await loadAdminData()
      showStatus(lang === 'en' ? 'Article published' : 'Статья создана', 'success')
    } catch {
      showStatus(lang === 'en' ? 'Failed to create article' : 'Ошибка создания статьи', 'error')
    }
  }

  const updateArticle = async (article) => {
    try {
      await api.patch(`/admin/articles/${article.id}`, {
        title: article.title,
        image_url: article.image_url,
        target_url: article.target_url,
        sort_order: Number(article.sort_order) || 0,
        is_active: article.is_active,
        add_english_version: article.has_en_version,
        title_en: article.has_en_version ? article.title_en : null,
        image_url_en: article.has_en_version ? article.image_url_en : null,
        target_url_en: article.has_en_version ? article.target_url_en : null
      })
      showStatus(lang === 'en' ? `Article #${article.id} saved` : `Статья #${article.id} обновлена`, 'success')
    } catch {
      showStatus(lang === 'en' ? 'Failed to update article' : 'Ошибка обновления статьи', 'error')
    }
  }

  const deleteArticle = async (id) => {
    if (!window.confirm(lang === 'en' ? 'Delete article?' : 'Удалить статью?')) return
    try {
      await api.delete(`/admin/articles/${id}`)
      await loadAdminData()
      showStatus(lang === 'en' ? 'Article deleted' : 'Статья удалена', 'info')
    } catch {
      showStatus(lang === 'en' ? 'Failed to delete article' : 'Ошибка удаления статьи', 'error')
    }
  }

  if (authChecking) {
    return (
      <PageShell title={t('admin.title')}>
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
        </div>
      </PageShell>
    )
  }

  if (!hasAdminAccess) {
    return (
      <PageShell title={t('admin.title')}>
        <section className="mx-auto max-w-md rounded-3xl border border-cyan-400/40 bg-gradient-to-b from-[#0e1a3e] via-[#09122c] to-[#040817] p-6 shadow-[0_0_35px_rgba(56,189,248,0.2)]">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-950 text-cyan-300 border border-cyan-400/40">
              <ShieldCheck size={26} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Mediabuy Control Panel</h2>
              <p className="text-xs text-slate-300">
                {lang === 'en' ? 'Enter admin login & password to open Web Admin' : 'Введите логин и пароль администратора для входа в панель'}
              </p>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              loginWebAdmin()
            }}
            className="mt-6 space-y-4"
          >
            <div>
              <label className="text-xs font-semibold text-slate-300">{lang === 'en' ? 'Admin Username' : 'Логин администратора'}</label>
              <input
                value={loginForm.username}
                onChange={(e) => setLoginForm((prev) => ({ ...prev, username: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-cyan-500/30 bg-black/50 px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
                placeholder="admin"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300">{lang === 'en' ? 'Password' : 'Пароль'}</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-cyan-500/30 bg-black/50 px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 py-3 text-sm font-bold text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.4)] transition hover:opacity-90"
            >
              {lang === 'en' ? 'Sign In to Admin' : 'Войти в панель'}
            </button>

            {authError && <p className="text-center text-xs text-rose-400 font-medium">{authError}</p>}

            <div className="pt-2 text-center">
              <span className="inline-block rounded-lg border border-cyan-500/20 bg-cyan-950/40 px-3 py-1 text-[11px] text-cyan-300">
                🔑 {lang === 'en' ? 'Default credentials: admin / admin' : 'Логин по умолчанию: admin / admin'}
              </span>
            </div>
          </form>
        </section>
      </PageShell>
    )
  }

  const filteredProducts = selectedCategoryFilter === 'all'
    ? products
    : products.filter(p => String(p.category_id) === String(selectedCategoryFilter))

  return (
    <PageShell title={t('admin.title')}>
      {/* HEADER ACTION BAR & STATUS TOAST */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-cyan-400/30 bg-[#09122c]/90 p-3.5 shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-400/30">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              Mediabuy Lab Admin <span className="rounded bg-cyan-400/20 px-1.5 py-0.5 text-[10px] font-mono text-cyan-300 border border-cyan-400/30">v2.4</span>
            </h2>
            <p className="text-[11px] text-slate-400">
              {lang === 'en' ? 'Central Management & Content Editor' : 'Центральная панель управления контентом'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadAdminData}
            title={lang === 'en' ? 'Refresh data' : 'Обновить данные'}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-cyan-500/30 bg-black/40 text-cyan-300 hover:border-cyan-400"
          >
            <RefreshCw size={14} />
          </button>
          <button
            onClick={logoutWebAdmin}
            className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-950/40 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:border-rose-400"
          >
            <LogOut size={13} /> {lang === 'en' ? 'Logout' : 'Выход'}
          </button>
        </div>
      </div>

      {status && (
        <div className={`mb-4 flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold shadow-lg ${
          statusType === 'error'
            ? 'border-rose-500/40 bg-rose-950/80 text-rose-200'
            : statusType === 'success'
            ? 'border-emerald-500/40 bg-emerald-950/80 text-emerald-200'
            : 'border-cyan-500/40 bg-cyan-950/80 text-cyan-200'
        }`}>
          {statusType === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          <span>{status}</span>
        </div>
      )}

      {/* NAVIGATION TABS */}
      <div className="mb-5 flex overflow-x-auto gap-2 pb-1 scrollbar-none">
        {tabs.map((tab) => {
          const IconComponent = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex shrink-0 items-center gap-2 rounded-2xl border px-3.5 py-2.5 text-xs font-bold transition ${
                isActive
                  ? 'border-cyan-400 bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-indigo-500/20 text-cyan-300 shadow-[0_0_15px_rgba(56,189,248,0.25)]'
                  : 'border-cyan-500/20 bg-[#09122c]/60 text-slate-300 hover:border-cyan-500/40 hover:text-white'
              }`}
            >
              <IconComponent size={15} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* STAT METRICS CARDS */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-[#0e1a3e] to-[#060b1e] p-4 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-cyan-300">{lang === 'en' ? 'Banners' : 'Баннеры'}</span>
                <ImageIcon size={16} className="text-cyan-400" />
              </div>
              <p className="mt-2 text-2xl font-black text-white">{banners.length}</p>
              <p className="text-[10px] text-slate-400">{banners.filter(b => b.is_active).length} {lang === 'en' ? 'active' : 'активных'}</p>
            </div>

            <div className="rounded-2xl border border-indigo-400/30 bg-gradient-to-br from-[#10193e] to-[#070d24] p-4 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-indigo-300">{lang === 'en' ? 'Products' : 'Товары'}</span>
                <ShoppingBag size={16} className="text-indigo-400" />
              </div>
              <p className="mt-2 text-2xl font-black text-white">{products.length}</p>
              <p className="text-[10px] text-slate-400">{categories.length} {lang === 'en' ? 'categories' : 'категорий'}</p>
            </div>

            <div className="rounded-2xl border border-purple-400/30 bg-gradient-to-br from-[#16123e] to-[#090724] p-4 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-purple-300">{lang === 'en' ? 'Articles' : 'Статьи'}</span>
                <BookOpen size={16} className="text-purple-400" />
              </div>
              <p className="mt-2 text-2xl font-black text-white">{articles.length}</p>
              <p className="text-[10px] text-slate-400">{articles.filter(a => a.has_en_version).length} EN {lang === 'en' ? 'переведено' : 'translated'}</p>
            </div>

            <div className="rounded-2xl border border-emerald-400/30 bg-gradient-to-br from-[#0a1f1b] to-[#040d0c] p-4 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-emerald-300">{lang === 'en' ? 'Orders' : 'Заказы'}</span>
                <ShieldCheck size={16} className="text-emerald-400" />
              </div>
              <p className="mt-2 text-2xl font-black text-white">{orders.length}</p>
              <p className="text-[10px] text-slate-400">{orders.filter(o => o.status === 'paid' || o.status === 'completed').length} {lang === 'en' ? 'paid/completed' : 'оплаченных'}</p>
            </div>
          </div>

          <section className="rounded-3xl border border-cyan-400/30 bg-[#09122c]/80 p-5 shadow-lg backdrop-blur-md">
            <h3 className="text-base font-bold text-white mb-2">{t('admin.overviewTitle')}</h3>
            <div className="space-y-2 text-xs text-slate-300">
              {t('admin.overviewItems').map((line, index) => (
                <div key={index} className="flex items-start gap-2 rounded-xl bg-black/30 p-3 border border-cyan-500/10">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-400/20 text-[10px] font-bold text-cyan-300">
                    {index + 1}
                  </span>
                  <p>{line}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ORDERS MANAGEMENT TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">
              {lang === 'en' ? 'Customer Orders & Blockchain Payment Tracker' : 'Заказы клиентов и авто-проверка оплаты'}
            </h3>
            <span className="rounded-full bg-cyan-950 px-3 py-1 text-xs font-bold text-cyan-300 border border-cyan-400/30">
              Всего: {orders.length}
            </span>
          </div>

          {!orders.length ? (
            <div className="rounded-2xl border border-cyan-400/30 bg-[#09122c] p-6 text-center text-xs text-slate-400">
              {lang === 'en' ? 'No orders recorded yet.' : 'Заказов пока нет.'}
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl border border-cyan-400/30 bg-gradient-to-b from-[#0e1a3e] to-[#060c1d] p-4 shadow-lg space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-400/20 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-cyan-300">Заказ #{order.order_number || order.id}</span>
                      <span className="text-xs text-slate-400">
                        ({new Date(order.created_at).toLocaleString()})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase border ${
                          order.status === 'paid' || order.status === 'completed'
                            ? 'border-emerald-400/50 bg-emerald-950 text-emerald-300'
                            : order.status === 'cancelled'
                            ? 'border-rose-400/50 bg-rose-950 text-rose-300'
                            : 'border-amber-400/50 bg-amber-950 text-amber-300'
                        }`}
                      >
                        {order.status}
                      </span>
                      <span className="text-sm font-black text-white">${Number(order.total_amount).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* ORDER PAYMENT DETAILS & TXID */}
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-xs">
                    <div className="rounded-xl border border-slate-800 bg-black/40 p-2.5">
                      <p className="text-[10px] font-bold uppercase text-slate-400">Способ / Кошелек:</p>
                      <p className="font-mono text-cyan-200 mt-0.5 truncate">{order.crypto_currency} ({order.assigned_wallet})</p>
                      <p className="text-[10px] text-slate-400 mt-1">Сумма в крипте: <span className="font-bold text-emerald-300 font-mono">{order.crypto_amount}</span></p>
                      <p className="text-[10px] text-slate-400 mt-1">Order # <span className="font-bold text-white">{order.order_number || order.id}</span></p>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-black/40 p-2.5">
                      <p className="text-[10px] font-bold uppercase text-slate-400">Хэш транзакции (TXID):</p>
                      <p className="font-mono text-cyan-300 mt-0.5 truncate font-bold">
                        {order.txid || (lang === 'en' ? 'Not submitted yet' : 'Еще не введен покупателем')}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">Telegram User ID: <span className="font-bold text-white">{order.telegram_user_id || 'N/A'}</span></p>
                    </div>
                  </div>

                  {/* DELIVERED DATA IF ANY */}
                  {order.delivered_data && (
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-2.5 text-xs">
                      <p className="text-[10px] font-bold uppercase text-emerald-400">Выданные данные аккаунта:</p>
                      <pre className="mt-1 font-mono text-[11px] text-emerald-200 whitespace-pre-wrap break-all bg-black/50 p-2 rounded-lg border border-emerald-500/20">
                        {order.delivered_data}
                      </pre>
                    </div>
                  )}

                  {/* ACTION BUTTONS */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      onClick={() => triggerCheckPayment(order.id)}
                      className="rounded-xl border border-cyan-400/40 bg-cyan-950 px-3 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-900 active:scale-95"
                    >
                      ⚡ Проверить TXID в сети TRON/BSC
                    </button>

                    <button
                      onClick={() => updateOrderStatus(order.id, 'paid')}
                      className="rounded-xl border border-emerald-400/40 bg-emerald-950 px-3 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-900 active:scale-95"
                    >
                      ✔ Подтвердить оплату
                    </button>

                    <div className="flex flex-wrap gap-1.5 w-full mt-2 pt-2 border-t border-slate-800">
                      <span className="text-[10px] text-slate-400 font-bold uppercase w-full">Ручная выдача товара:</span>
                      
                      <button
                        onClick={() => {
                          const defaultAcc = `АККАУНТ:\nlogin_ad_user@gmail.com:Pass9981a$:JBSWY3DPEHPK3PXP\nCookies: [{"name":"c_user","value":"10008471"}]\nИнструкция: Заходить с чистого профиля через антидетект.`
                          const data = window.prompt('Выдача данных аккаунта (Login:Pass:2FA:Cookies):', order.delivered_data || defaultAcc)
                          if (data !== null) {
                            updateOrderStatus(order.id, 'completed', data)
                          }
                        }}
                        className="rounded-lg border border-cyan-400/40 bg-cyan-950/80 px-2.5 py-1 text-[11px] font-bold text-cyan-300 hover:bg-cyan-900 active:scale-95"
                      >
                        👤 Выдать Аккаунт
                      </button>

                      <button
                        onClick={() => {
                          const defaultProxy = `ПРИВАТНЫЙ ПРОКСИ:\nIP:PORT: 194.26.29.112:8000\nUser: proxy_user_${order.id}\nPass: Sec9921_x\nПротокол: HTTP / SOCKS5\nСсылка смены IP: https://change-ip.io/api/rotate/${order.id}`
                          const data = window.prompt('Выдача данных прокси (IP:Port:User:Pass:RotateUrl):', order.delivered_data || defaultProxy)
                          if (data !== null) {
                            updateOrderStatus(order.id, 'completed', data)
                          }
                        }}
                        className="rounded-lg border border-emerald-400/40 bg-emerald-950/80 px-2.5 py-1 text-[11px] font-bold text-emerald-300 hover:bg-emerald-900 active:scale-95"
                      >
                        🔌 Выдать Прокси
                      </button>

                      <button
                        onClick={() => {
                          const defaultBundle = `ГОТОВЫЙ СЕТАП ПОД КЛЮЧ:\n1. Кинг Фарм: king_ad_${order.id}@fb.com:PassKing881:2FA_SECRET\n2. 3x BM Invitations:\n - https://business.facebook.com/invite/bm1_${order.id}\n - https://business.facebook.com/invite/bm2_${order.id}\n - https://business.facebook.com/invite/bm3_${order.id}\n3. Приватный прокси: 185.122.90.14:9000:usr:pass\n4. Чеклист запуска: https://t.me/mediabuy_lab/doc_launch.pdf`
                          const data = window.prompt('Выдача полного сетапа (Bundle items):', order.delivered_data || defaultBundle)
                          if (data !== null) {
                            updateOrderStatus(order.id, 'completed', data)
                          }
                        }}
                        className="rounded-lg border border-amber-400/40 bg-amber-950/80 px-2.5 py-1 text-[11px] font-bold text-amber-300 hover:bg-amber-900 active:scale-95"
                      >
                        📦 Выдать Сетап
                      </button>
                    </div>

                    <button
                      onClick={() => updateOrderStatus(order.id, 'cancelled')}
                      className="rounded-xl border border-rose-400/40 bg-rose-950 px-3 py-1.5 text-xs font-bold text-rose-300 hover:bg-rose-900 active:scale-95"
                    >
                      ❌ Отменить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* BANNERS MANAGEMENT TAB */}
      {activeTab === 'banners' && (
        <div className="space-y-5">
          {/* CREATE BANNER FORM */}
          <section className="rounded-3xl border border-cyan-400/35 bg-gradient-to-br from-[#0e1a3e] via-[#09122c] to-[#040817] p-5 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <Plus size={18} className="text-cyan-300" />
              <h3 className="text-base font-bold text-white">{lang === 'en' ? 'Create Promo Banner' : 'Добавить баннер / акцию'}</h3>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="text-[11px] font-semibold text-slate-300">{lang === 'en' ? 'Badge Text' : 'Текст плашки (Badge)'}</label>
                <input
                  value={newBanner.badge_text}
                  onChange={(e) => setNewBanner({ ...newBanner, badge_text: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-cyan-500/30 bg-black/50 px-3 py-2 text-xs text-cyan-300 focus:border-cyan-400 focus:outline-none"
                  placeholder="PROMO & OFFERS"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300">{lang === 'en' ? 'Sort Order' : 'Порядок сортировки'}</label>
                <input
                  type="number"
                  value={newBanner.sort_order}
                  onChange={(e) => setNewBanner({ ...newBanner, sort_order: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-cyan-500/30 bg-black/50 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  placeholder="0"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-semibold text-slate-300">{lang === 'en' ? 'Banner Title' : 'Заголовок баннера'}</label>
                <input
                  value={newBanner.title}
                  onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-cyan-500/30 bg-black/50 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  placeholder={lang === 'en' ? 'e.g. 10% Discount on First Order' : 'Например: Скидка 10% на первый заказ'}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-semibold text-slate-300">{lang === 'en' ? 'Subtitle' : 'Подзаголовок'}</label>
                <input
                  value={newBanner.subtitle}
                  onChange={(e) => setNewBanner({ ...newBanner, subtitle: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-cyan-500/30 bg-black/50 px-3 py-2 text-xs text-slate-200 focus:border-cyan-400 focus:outline-none"
                  placeholder={lang === 'en' ? 'Short promo description' : 'Краткое описание предложения'}
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300">{lang === 'en' ? 'Image URL' : 'Ссылка на изображение (URL)'}</label>
                <input
                  value={newBanner.image_url}
                  onChange={(e) => setNewBanner({ ...newBanner, image_url: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-cyan-500/30 bg-black/50 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  placeholder="https://images.unsplash.com/photo-..."
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300">{lang === 'en' ? 'Target Link (URL)' : 'Ссылка перехода'}</label>
                <input
                  value={newBanner.target_url}
                  onChange={(e) => setNewBanner({ ...newBanner, target_url: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-cyan-500/30 bg-black/50 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  placeholder="https://t.me/mediabuy_lab"
                />
              </div>
            </div>

            {/* LIVE PREVIEW BOX */}
            {newBanner.image_url && (
              <div className="mt-3 rounded-2xl border border-cyan-400/30 overflow-hidden bg-black/40 p-2">
                <p className="text-[10px] font-bold text-cyan-300 mb-1 px-1 uppercase">{lang === 'en' ? 'Live Preview' : 'Предпросмотр баннера'}</p>
                <div className="relative h-28 w-full overflow-hidden rounded-xl bg-slate-900">
                  <img src={newBanner.image_url} alt="Banner Preview" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 flex flex-col justify-end">
                    <span className="self-start rounded bg-cyan-400/90 px-2 py-0.5 text-[9px] font-black text-slate-950">{newBanner.badge_text || 'PROMO'}</span>
                    <h4 className="text-xs font-bold text-white truncate">{newBanner.title || 'Banner Title'}</h4>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={createBanner}
              className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-[0_0_15px_rgba(56,189,248,0.3)] transition hover:opacity-90"
            >
              <Plus size={16} /> {lang === 'en' ? 'Publish Banner' : 'Добавить баннер'}
            </button>
          </section>

          {/* BANNERS LIST */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ImageIcon size={16} className="text-cyan-400" />
              {lang === 'en' ? 'Existing Banners' : 'Существующие баннеры'} ({banners.length})
            </h3>

            {banners.map((banner) => (
              <article key={banner.id} className="rounded-2xl border border-cyan-400/25 bg-[#09122c]/80 p-4 shadow-md backdrop-blur-md">
                <div className="flex flex-col md:flex-row gap-3">
                  {/* PREVIEW THUMBNAIL */}
                  <div className="relative h-24 w-full md:w-36 shrink-0 overflow-hidden rounded-xl bg-slate-900 border border-cyan-500/20">
                    {banner.image_url ? (
                      <img src={banner.image_url} alt={banner.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-600"><ImageIcon size={24} /></div>
                    )}
                    <span className="absolute top-1 left-1 rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-mono text-cyan-300 border border-cyan-400/30">
                      ID #{banner.id}
                    </span>
                  </div>

                  {/* EDIT FIELDS */}
                  <div className="flex-1 space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        value={banner.badge_text || ''}
                        onChange={(e) => setBanners(prev => prev.map(b => b.id === banner.id ? { ...b, badge_text: e.target.value } : b))}
                        className="rounded-lg border border-cyan-500/30 bg-black/50 px-2.5 py-1.5 text-xs font-bold text-cyan-300"
                        placeholder="Badge Text"
                      />
                      <input
                        value={banner.title || ''}
                        onChange={(e) => setBanners(prev => prev.map(b => b.id === banner.id ? { ...b, title: e.target.value } : b))}
                        className="rounded-lg border border-cyan-500/30 bg-black/50 px-2.5 py-1.5 text-xs font-bold text-white"
                        placeholder="Title"
                      />
                      <input
                        value={banner.subtitle || ''}
                        onChange={(e) => setBanners(prev => prev.map(b => b.id === banner.id ? { ...b, subtitle: e.target.value } : b))}
                        className="rounded-lg border border-cyan-500/30 bg-black/50 px-2.5 py-1.5 text-xs text-slate-300"
                        placeholder="Subtitle"
                      />
                      <input
                        value={banner.image_url || ''}
                        onChange={(e) => setBanners(prev => prev.map(b => b.id === banner.id ? { ...b, image_url: e.target.value } : b))}
                        className="rounded-lg border border-cyan-500/30 bg-black/50 px-2.5 py-1.5 text-xs text-slate-300"
                        placeholder="Image URL"
                      />
                      <input
                        value={banner.target_url || ''}
                        onChange={(e) => setBanners(prev => prev.map(b => b.id === banner.id ? { ...b, target_url: e.target.value } : b))}
                        className="rounded-lg border border-cyan-500/30 bg-black/50 px-2.5 py-1.5 text-xs text-slate-300"
                        placeholder="Target URL"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400">Sort Order:</span>
                        <input
                          type="number"
                          value={banner.sort_order}
                          onChange={(e) => setBanners(prev => prev.map(b => b.id === banner.id ? { ...b, sort_order: e.target.value } : b))}
                          className="w-16 rounded-lg border border-cyan-500/30 bg-black/50 px-2 py-1 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => setBanners(prev => prev.map(b => b.id === banner.id ? { ...b, is_active: !b.is_active } : b))}
                        className={`flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-bold ${
                          banner.is_active
                            ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300'
                            : 'border-slate-600 bg-slate-900 text-slate-400'
                        }`}
                      >
                        {banner.is_active ? <Eye size={12} /> : <EyeOff size={12} />}
                        {banner.is_active ? (lang === 'en' ? 'Active' : 'Активен') : (lang === 'en' ? 'Hidden' : 'Скрыт')}
                      </button>

                      <button
                        onClick={() => updateBanner(banner)}
                        className="flex items-center gap-1 rounded-lg border border-cyan-400/40 bg-cyan-950/40 px-3 py-1 text-[11px] font-bold text-cyan-300 hover:border-cyan-300"
                      >
                        <Save size={12} /> {lang === 'en' ? 'Save' : 'Сохранить'}
                      </button>

                      <button
                        onClick={() => deleteBanner(banner.id)}
                        className="flex items-center gap-1 rounded-lg border border-rose-500/40 bg-rose-950/40 px-2.5 py-1 text-[11px] font-bold text-rose-300 hover:border-rose-400"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* CATALOG & PRODUCTS TAB */}
      {activeTab === 'catalog' && (
        <div className="space-y-5">
          {/* CATEGORIES SECTION */}
          <section className="rounded-3xl border border-cyan-400/30 bg-[#09122c]/80 p-5 shadow-lg">
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <Tag size={18} className="text-cyan-300" />
              {lang === 'en' ? 'Account Categories' : 'Категории аккаунтов'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4 p-3 rounded-2xl bg-black/40 border border-cyan-500/20">
              <input
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="rounded-xl border border-cyan-500/30 bg-black/50 px-3 py-2 text-xs text-white"
                placeholder={lang === 'en' ? 'Category Name (e.g., Facebook)' : 'Название категории'}
              />
              <input
                value={newCategory.slug}
                onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                className="rounded-xl border border-cyan-500/30 bg-black/50 px-3 py-2 text-xs text-white"
                placeholder="Slug (e.g., facebook)"
              />
              <button
                onClick={createCategory}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 text-xs font-bold text-slate-950"
              >
                <Plus size={14} /> {lang === 'en' ? 'Add Category' : 'Добавить'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center gap-2 rounded-xl border border-cyan-500/20 bg-black/30 p-2.5">
                  <input
                    value={cat.name}
                    onChange={(e) => setCategories(prev => prev.map(c => c.id === cat.id ? { ...c, name: e.target.value } : c))}
                    className="flex-1 rounded-lg border border-cyan-500/20 bg-black/50 px-2.5 py-1 text-xs font-bold text-white"
                  />
                  <input
                    value={cat.slug}
                    onChange={(e) => setCategories(prev => prev.map(c => c.id === cat.id ? { ...c, slug: e.target.value } : c))}
                    className="w-24 rounded-lg border border-cyan-500/20 bg-black/50 px-2.5 py-1 text-xs text-slate-300"
                  />
                  <button
                    onClick={() => updateCategory(cat)}
                    className="rounded-lg border border-cyan-400/40 bg-cyan-950/40 p-1.5 text-cyan-300 hover:border-cyan-300"
                  >
                    <Save size={13} />
                  </button>
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    className="rounded-lg border border-rose-500/40 bg-rose-950/40 p-1.5 text-rose-300 hover:border-rose-400"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* PRODUCTS SECTION */}
          <section className="rounded-3xl border border-cyan-400/30 bg-[#09122c]/80 p-5 shadow-lg">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShoppingBag size={18} className="text-cyan-300" />
                {lang === 'en' ? 'Products & Accounts' : 'Товары и аккаунты'} ({filteredProducts.length})
              </h3>

              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="rounded-xl border border-cyan-500/30 bg-black/50 px-3 py-1.5 text-xs text-cyan-300 font-bold"
              >
                <option value="all">{lang === 'en' ? 'All Categories' : 'Все категории'}</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* CREATE PRODUCT FORM */}
            <div className="mb-5 p-4 rounded-2xl bg-black/40 border border-cyan-500/20 space-y-3">
              <p className="text-xs font-bold text-cyan-300 uppercase tracking-wide">{lang === 'en' ? 'Add New Product Card' : 'Создать карточку товара'}</p>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <select
                  value={newProduct.category_id}
                  onChange={(e) => setNewProduct({ ...newProduct, category_id: e.target.value })}
                  className="rounded-xl border border-cyan-500/30 bg-black/50 px-3 py-2 text-xs text-white"
                >
                  <option value="">-- {lang === 'en' ? 'Select Category' : 'Выберите категорию'} --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>

                <select
                  value={newProduct.platform}
                  onChange={(e) => setNewProduct({ ...newProduct, platform: e.target.value })}
                  className="rounded-xl border border-cyan-500/30 bg-black/50 px-3 py-2 text-xs text-white"
                >
                  <option value="Facebook">Facebook</option>
                  <option value="Google">Google Ads</option>
                  <option value="TikTok">TikTok</option>
                  <option value="Telegram">Telegram</option>
                  <option value="Twitter">Twitter / X</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Other">Other</option>
                </select>

                <input
                  type="number"
                  step="0.1"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="rounded-xl border border-cyan-500/30 bg-black/50 px-3 py-2 text-xs text-white"
                  placeholder="Price ($)"
                />

                <input
                  type="number"
                  value={newProduct.stock !== undefined ? newProduct.stock : 50}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                  className="rounded-xl border border-cyan-500/30 bg-black/50 px-3 py-2 text-xs text-emerald-300 font-bold"
                  placeholder={lang === 'en' ? 'Stock (pcs)' : 'Остаток (шт)'}
                />
              </div>

              <div className="space-y-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400">{lang === 'en' ? 'Title (RU)' : 'Название (RU)'}</label>
                  <input
                    value={newProduct.title}
                    onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                    className="w-full rounded-xl border border-cyan-500/30 bg-black/50 px-3 py-2 text-xs text-white"
                    placeholder="Название товара (например, FB King Авторег с фармом)"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-cyan-300">{lang === 'en' ? 'Title (EN / English)' : 'Название (EN / Английская версия)'}</label>
                  <input
                    value={newProduct.title_en || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, title_en: e.target.value })}
                    className="w-full rounded-xl border border-cyan-500/30 bg-black/50 px-3 py-2 text-xs text-cyan-200"
                    placeholder="Product title (e.g. FB King Unlimited BM)"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400">{lang === 'en' ? 'Description (RU)' : 'Описание (RU)'}</label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="w-full h-14 rounded-xl border border-cyan-500/30 bg-black/50 px-3 py-2 text-xs text-slate-200"
                    placeholder="Описание товара, гео, формат куки, отлежка, фарм..."
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-cyan-300">{lang === 'en' ? 'Description (EN / English)' : 'Описание (EN / Английская версия)'}</label>
                  <textarea
                    value={newProduct.description_en || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, description_en: e.target.value })}
                    className="w-full h-14 rounded-xl border border-cyan-500/30 bg-black/50 px-3 py-2 text-xs text-slate-200"
                    placeholder="Detailed account specs, cookies, country, limits in English..."
                  />
                </div>
              </div>

              <button
                onClick={createProduct}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-2 text-xs font-bold text-slate-950"
              >
                <Plus size={15} /> {lang === 'en' ? 'Add Product Card' : 'Добавить товар'}
              </button>
            </div>

            {/* PRODUCT CARDS LIST */}
            <div className="space-y-3">
              {filteredProducts.map((p) => (
                <div key={p.id} className="rounded-2xl border border-cyan-400/20 bg-black/30 p-3.5 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded bg-cyan-950 px-2 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-400/30">
                      ID #{p.id} • {p.platform || 'Account'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-cyan-300">${Number(p.price).toFixed(2)}</span>
                      <button
                        onClick={() => setProducts(prev => prev.map(prod => prod.id === p.id ? { ...prod, is_visible: !prod.is_visible } : prod))}
                        className={`rounded px-2 py-0.5 text-[10px] font-bold ${p.is_visible ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}
                      >
                        {p.is_visible ? (lang === 'en' ? 'Visible' : 'Виден') : (lang === 'en' ? 'Hidden' : 'Скрыт')}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="sm:col-span-2 space-y-1">
                      <input
                        value={p.title || ''}
                        onChange={(e) => setProducts(prev => prev.map(prod => prod.id === p.id ? { ...prod, title: e.target.value } : prod))}
                        className="w-full rounded-lg border border-cyan-500/30 bg-black/50 px-2.5 py-1.5 text-xs font-bold text-white"
                        placeholder="Название (RU)"
                      />
                      <input
                        value={p.title_en || ''}
                        onChange={(e) => setProducts(prev => prev.map(prod => prod.id === p.id ? { ...prod, title_en: e.target.value } : prod))}
                        className="w-full rounded-lg border border-cyan-500/30 bg-black/50 px-2.5 py-1.5 text-xs text-cyan-200"
                        placeholder="Title (EN / English)"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="grid grid-cols-3 gap-1.5">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-bold text-slate-400">Цена ($):</span>
                          <input
                            type="number"
                            step="0.1"
                            value={p.price}
                            onChange={(e) => setProducts(prev => prev.map(prod => prod.id === p.id ? { ...prod, price: e.target.value } : prod))}
                            className="w-full rounded-lg border border-cyan-500/30 bg-black/50 px-2 py-1 text-xs text-white"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] font-bold text-emerald-400">Остаток (шт):</span>
                          <input
                            type="number"
                            value={p.stock !== undefined ? p.stock : 50}
                            onChange={(e) => setProducts(prev => prev.map(prod => prod.id === p.id ? { ...prod, stock: Number(e.target.value) } : prod))}
                            className="w-full rounded-lg border border-cyan-500/30 bg-black/50 px-2 py-1 text-xs font-black text-emerald-300"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] font-bold text-slate-400">Платформа:</span>
                          <input
                            value={p.platform || ''}
                            onChange={(e) => setProducts(prev => prev.map(prod => prod.id === p.id ? { ...prod, platform: e.target.value } : prod))}
                            className="w-full rounded-lg border border-cyan-500/30 bg-black/50 px-2 py-1 text-xs text-slate-300"
                            placeholder="Platform"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <textarea
                      value={p.description || ''}
                      onChange={(e) => setProducts(prev => prev.map(prod => prod.id === p.id ? { ...prod, description: e.target.value } : prod))}
                      className="w-full h-12 rounded-lg border border-cyan-500/30 bg-black/50 px-2.5 py-1.5 text-xs text-slate-300"
                      placeholder="Описание (RU)"
                    />
                    <textarea
                      value={p.description_en || ''}
                      onChange={(e) => setProducts(prev => prev.map(prod => prod.id === p.id ? { ...prod, description_en: e.target.value } : prod))}
                      className="w-full h-12 rounded-lg border border-cyan-500/30 bg-black/50 px-2.5 py-1.5 text-xs text-slate-300"
                      placeholder="Description (EN / English)"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => updateProduct(p)}
                      className="flex items-center gap-1 rounded-lg border border-cyan-400/40 bg-cyan-950/40 px-3 py-1 text-xs font-bold text-cyan-300"
                    >
                      <Save size={12} /> {lang === 'en' ? 'Save' : 'Сохранить'}
                    </button>
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="flex items-center gap-1 rounded-lg border border-rose-500/40 bg-rose-950/40 px-2.5 py-1 text-xs font-bold text-rose-300"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ARTICLES TAB */}
      {activeTab === 'articles' && (
        <div className="space-y-5">
          {/* CREATE ARTICLE FORM */}
          <section className="rounded-3xl border border-cyan-400/35 bg-[#09122c]/80 p-5 shadow-lg">
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <BookOpen size={18} className="text-cyan-300" />
              {lang === 'en' ? 'Publish Case Study / Article' : 'Опубликовать кейс или статью'}
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-[11px] font-semibold text-slate-300">{lang === 'en' ? 'Title (RU)' : 'Заголовок статьи (RU)'}</label>
                <input
                  value={newArticle.title}
                  onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-cyan-500/30 bg-black/50 px-3 py-2 text-xs text-white"
                  placeholder="Как запустить FB без банов в 2026..."
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300">{lang === 'en' ? 'Cover Image URL' : 'Ссылка на обложку (Image URL)'}</label>
                <input
                  value={newArticle.image_url}
                  onChange={(e) => setNewArticle({ ...newArticle, image_url: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-cyan-500/30 bg-black/50 px-3 py-2 text-xs text-white"
                  placeholder="https://images.unsplash.com/photo-..."
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300">{lang === 'en' ? 'Target Post URL' : 'Ссылка на пост в канале'}</label>
                <input
                  value={newArticle.target_url}
                  onChange={(e) => setNewArticle({ ...newArticle, target_url: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-cyan-500/30 bg-black/50 px-3 py-2 text-xs text-white"
                  placeholder="https://t.me/mediabuy_lab/123"
                />
              </div>

              {/* MULTILINGUAL TOGGLE */}
              <div className="sm:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-cyan-300">
                  <input
                    type="checkbox"
                    checked={newArticle.add_english_version}
                    onChange={(e) => setNewArticle({ ...newArticle, add_english_version: e.target.checked })}
                    className="rounded border-cyan-500"
                  />
                  <span>{lang === 'en' ? 'Include English translation version' : 'Добавить английский вариант статьи'}</span>
                </label>
              </div>

              {newArticle.add_english_version && (
                <>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-semibold text-slate-300">Article Title (EN)</label>
                    <input
                      value={newArticle.title_en}
                      onChange={(e) => setNewArticle({ ...newArticle, title_en: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-cyan-500/30 bg-black/50 px-3 py-2 text-xs text-white"
                      placeholder="How to run FB ads without bans in 2026..."
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300">Cover Image URL (EN)</label>
                    <input
                      value={newArticle.image_url_en}
                      onChange={(e) => setNewArticle({ ...newArticle, image_url_en: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-cyan-500/30 bg-black/50 px-3 py-2 text-xs text-white"
                      placeholder="https://images.unsplash.com/photo-..."
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300">Target URL (EN)</label>
                    <input
                      value={newArticle.target_url_en}
                      onChange={(e) => setNewArticle({ ...newArticle, target_url_en: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-cyan-500/30 bg-black/50 px-3 py-2 text-xs text-white"
                      placeholder="https://t.me/mediabuy_lab/124"
                    />
                  </div>
                </>
              )}
            </div>

            <button
              onClick={createArticle}
              className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-[0_0_15px_rgba(56,189,248,0.3)]"
            >
              <Plus size={16} /> {lang === 'en' ? 'Publish Article' : 'Опубликовать статью'}
            </button>
          </section>

          {/* ARTICLES LIST */}
          <div className="space-y-3">
            {articles.map((art) => (
              <article key={art.id} className="rounded-2xl border border-cyan-400/25 bg-[#09122c]/80 p-4 shadow-md backdrop-blur-md">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative h-24 w-full md:w-36 shrink-0 overflow-hidden rounded-xl bg-slate-900 border border-cyan-500/20">
                    {art.image_url ? (
                      <img src={art.image_url} alt={art.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-600"><BookOpen size={24} /></div>
                    )}
                    {art.has_en_version && (
                      <span className="absolute top-1 right-1 rounded bg-indigo-500 px-1.5 py-0.5 text-[9px] font-bold text-white">EN</span>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <input
                      value={art.title || ''}
                      onChange={(e) => setArticles(prev => prev.map(a => a.id === art.id ? { ...a, title: e.target.value } : a))}
                      className="w-full rounded-lg border border-cyan-500/30 bg-black/50 px-2.5 py-1.5 text-xs font-bold text-white"
                      placeholder="Title (RU)"
                    />
                    <input
                      value={art.target_url || ''}
                      onChange={(e) => setArticles(prev => prev.map(a => a.id === art.id ? { ...a, target_url: e.target.value } : a))}
                      className="w-full rounded-lg border border-cyan-500/30 bg-black/50 px-2.5 py-1.5 text-xs text-slate-300"
                      placeholder="Target URL (RU)"
                    />

                    {art.has_en_version && (
                      <div className="p-2 rounded-xl bg-indigo-950/30 border border-indigo-500/20 space-y-1.5">
                        <input
                          value={art.title_en || ''}
                          onChange={(e) => setArticles(prev => prev.map(a => a.id === art.id ? { ...a, title_en: e.target.value } : a))}
                          className="w-full rounded-lg border border-indigo-500/30 bg-black/50 px-2.5 py-1 text-xs text-indigo-200 font-bold"
                          placeholder="Title (EN)"
                        />
                        <input
                          value={art.target_url_en || ''}
                          onChange={(e) => setArticles(prev => prev.map(a => a.id === art.id ? { ...a, target_url_en: e.target.value } : a))}
                          className="w-full rounded-lg border border-indigo-500/30 bg-black/50 px-2.5 py-1 text-xs text-slate-300"
                          placeholder="Target URL (EN)"
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => setArticles(prev => prev.map(a => a.id === art.id ? { ...a, is_active: !a.is_active } : a))}
                        className={`flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-bold ${
                          art.is_active ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300' : 'border-slate-600 bg-slate-900 text-slate-400'
                        }`}
                      >
                        {art.is_active ? (lang === 'en' ? 'Active' : 'Активна') : (lang === 'en' ? 'Hidden' : 'Скрыта')}
                      </button>

                      <button
                        onClick={() => updateArticle(art)}
                        className="flex items-center gap-1 rounded-lg border border-cyan-400/40 bg-cyan-950/40 px-3 py-1 text-[11px] font-bold text-cyan-300"
                      >
                        <Save size={12} /> {lang === 'en' ? 'Save' : 'Сохранить'}
                      </button>

                      <button
                        onClick={() => deleteArticle(art.id)}
                        className="flex items-center gap-1 rounded-lg border border-rose-500/40 bg-rose-950/40 px-2.5 py-1 text-[11px] font-bold text-rose-300"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* SHOWCASE & HOME SETTINGS TAB */}
      {activeTab === 'home' && homeSettings && (
        <div className="space-y-6">
          <section className="rounded-3xl border border-cyan-400/35 bg-[#09122c]/80 p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Settings size={18} className="text-cyan-300" />
              {lang === 'en' ? 'Showcase & Branding' : 'Настройки витрины и бренда'}
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="text-[11px] font-semibold text-slate-300">{lang === 'en' ? 'Brand Title' : 'Заголовок бренда'}</label>
                <input
                  value={homeSettings.brand_title || ''}
                  onChange={(e) => setHomeSettings({ ...homeSettings, brand_title: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-cyan-500/30 bg-black/50 px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300">{lang === 'en' ? 'Brand Subtitle' : 'Подзаголовок бренда'}</label>
                <input
                  value={homeSettings.brand_subtitle || ''}
                  onChange={(e) => setHomeSettings({ ...homeSettings, brand_subtitle: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-cyan-500/30 bg-black/50 px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300">{lang === 'en' ? 'CTA 1 Badge' : 'Бейдж карточки №1'}</label>
                <input
                  value={homeSettings.launch_badge || ''}
                  onChange={(e) => setHomeSettings({ ...homeSettings, launch_badge: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-cyan-500/30 bg-black/50 px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300">{lang === 'en' ? 'CTA 1 Title' : 'Заголовок карточки №1'}</label>
                <input
                  value={homeSettings.launch_title || ''}
                  onChange={(e) => setHomeSettings({ ...homeSettings, launch_title: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-cyan-500/30 bg-black/50 px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300">{lang === 'en' ? 'CTA 2 Badge' : 'Бейдж карточки №2'}</label>
                <input
                  value={homeSettings.training_badge || ''}
                  onChange={(e) => setHomeSettings({ ...homeSettings, training_badge: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-cyan-500/30 bg-black/50 px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300">{lang === 'en' ? 'CTA 2 Title' : 'Заголовок карточки №2'}</label>
                <input
                  value={homeSettings.training_title || ''}
                  onChange={(e) => setHomeSettings({ ...homeSettings, training_title: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-cyan-500/30 bg-black/50 px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            {/* UPLOAD LOGO FILE */}
            <div className="rounded-2xl border border-cyan-500/20 bg-black/40 p-4 space-y-2">
              <p className="text-xs font-bold text-cyan-300 uppercase">{lang === 'en' ? 'App Logo Upload' : 'Загрузка логотипа приложения'}</p>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/png"
                  onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                  className="text-xs text-slate-300 file:mr-2 file:rounded-xl file:border-0 file:bg-cyan-950 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-cyan-300"
                />
                <button
                  onClick={uploadHomeLogo}
                  className="flex items-center gap-1 rounded-xl bg-cyan-400 px-3 py-1.5 text-xs font-bold text-slate-950"
                >
                  <Upload size={13} /> {lang === 'en' ? 'Upload PNG' : 'Загрузить PNG'}
                </button>
              </div>
            </div>
          </section>

          {/* TELEGRAM BOT MENU & STYLING SECTION */}
          <section className="rounded-3xl border border-emerald-500/40 bg-gradient-to-b from-[#0d214a] via-[#09122c] to-[#040817] p-5 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles size={20} className="text-emerald-400" />
                {lang === 'en' ? 'Telegram Bot /start Menu & Inline Keyboard Style' : 'Настройка меню бота Telegram и цветных кнопок'}
              </h3>
              <span className="rounded-full bg-emerald-950 px-3 py-1 text-[10px] font-black uppercase text-emerald-300 border border-emerald-500/30">
                Bot API Style
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* EDITING FORM */}
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300">{lang === 'en' ? 'Bot Welcome Message Title' : 'Заголовок при приветствии (/start)'}</label>
                  <input
                    value={homeSettings.bot_menu_title || ''}
                    onChange={(e) => setHomeSettings({ ...homeSettings, bot_menu_title: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-cyan-500/30 bg-black/50 px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300">{lang === 'en' ? 'Bot Welcome Message Text' : 'Текст приветственного сообщения'}</label>
                  <textarea
                    rows={3}
                    value={homeSettings.bot_menu_description || ''}
                    onChange={(e) => setHomeSettings({ ...homeSettings, bot_menu_description: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-cyan-500/30 bg-black/50 px-3 py-2 text-xs text-white"
                  />
                </div>

                {/* BOT BACKGROUND IMAGE UPLOAD */}
                <div className="rounded-2xl border border-cyan-500/20 bg-black/40 p-3 space-y-2">
                  <p className="text-xs font-bold text-cyan-300 uppercase">{lang === 'en' ? 'Pinned Photo Banner After /start' : 'Закрепленное изображение после /start'}</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setBotMenuImageFile(e.target.files?.[0] || null)}
                      className="text-xs text-slate-300 file:mr-2 file:rounded-xl file:border-0 file:bg-cyan-950 file:px-3 file:py-1 file:text-xs file:font-bold file:text-cyan-300"
                    />
                    <button
                      onClick={uploadBotMenuImage}
                      className="flex items-center gap-1 rounded-xl bg-cyan-400 px-3 py-1.5 text-xs font-bold text-slate-950 shrink-0"
                    >
                      <Upload size={12} /> {lang === 'en' ? 'Upload' : 'Загрузить'}
                    </button>
                  </div>
                </div>

                {/* INLINE BUTTONS CONFIGURATOR */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-200">
                      {lang === 'en' ? 'Inline Keyboard Buttons & Colors (style field)' : 'Кнопки Inline-клавиатуры и их Цвета (параметр style)'}
                    </p>
                    <button
                      onClick={addBotButton}
                      className="flex items-center gap-1 rounded-xl bg-emerald-500/20 border border-emerald-400/40 px-2.5 py-1 text-[11px] font-bold text-emerald-300 hover:bg-emerald-500/30 transition"
                    >
                      <Plus size={13} /> {lang === 'en' ? 'Add Button' : 'Добавить кнопку'}
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {(homeSettings.bot_buttons || []).map((btn) => (
                      <div key={btn.id} className="rounded-2xl border border-cyan-500/20 bg-black/40 p-3 space-y-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] text-slate-400">{lang === 'en' ? 'Button Text (RU)' : 'Текст кнопки (RU)'}</label>
                            <input
                              value={btn.text}
                              onChange={(e) => updateBotButton(btn.id, { text: e.target.value })}
                              className="mt-0.5 w-full rounded-lg border border-cyan-500/30 bg-black/60 px-2.5 py-1 text-xs text-white font-medium"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400">{lang === 'en' ? 'Button Text (EN)' : 'Текст кнопки (EN)'}</label>
                            <input
                              value={btn.text_en || ''}
                              onChange={(e) => updateBotButton(btn.id, { text_en: e.target.value })}
                              className="mt-0.5 w-full rounded-lg border border-indigo-500/30 bg-black/60 px-2.5 py-1 text-xs text-indigo-200 font-medium"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                          <div>
                            <label className="text-[10px] text-slate-400">{lang === 'en' ? 'Button Color / Style' : 'Стиль / Цвет кнопки'}</label>
                            <select
                              value={btn.style || 'default'}
                              onChange={(e) => updateBotButton(btn.id, { style: e.target.value })}
                              className="mt-0.5 w-full rounded-lg border border-cyan-500/30 bg-black/60 px-2 py-1 text-xs text-white font-bold"
                            >
                              <option value="success">🟢 Green (success)</option>
                              <option value="danger">🔴 Red (danger)</option>
                              <option value="primary">🔵 Blue (primary)</option>
                              <option value="default">⚪ Gray (default)</option>
                            </select>
                          </div>

                          <div className="sm:col-span-2 flex items-center justify-between gap-2 pt-3">
                            <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-bold text-cyan-300">
                              <input
                                type="checkbox"
                                checked={btn.is_web_app || false}
                                onChange={(e) => updateBotButton(btn.id, { is_web_app: e.target.checked })}
                                className="rounded bg-black border-cyan-400 text-cyan-500"
                              />
                              {lang === 'en' ? 'Open Mini App' : 'Открывает Web App'}
                            </label>

                            <button
                              onClick={() => deleteBotButton(btn.id)}
                              className="rounded-lg border border-rose-500/40 bg-rose-950/40 p-1.5 text-rose-300 hover:bg-rose-900/60"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* LIVE TELEGRAM BOT PREVIEW */}
              <div className="rounded-3xl border border-slate-700 bg-[#17212b] p-4 flex flex-col justify-between shadow-2xl relative">
                <div className="space-y-3">
                  {/* TELEGRAM HEADER */}
                  <div className="flex items-center gap-2.5 border-b border-slate-700/80 pb-3">
                    <div className="h-9 w-9 rounded-full bg-cyan-600 flex items-center justify-center font-black text-white text-sm shadow">
                      ML
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1">
                        Mediabuy Lab Bot <span className="text-[10px] text-cyan-400 font-normal">bot</span>
                      </h4>
                      <p className="text-[10px] text-slate-400">{lang === 'en' ? 'Official Telegram Bot' : 'Официальный бот'}</p>
                    </div>
                  </div>

                  {/* CHAT MESSAGE BUBBLE */}
                  <div className="rounded-2xl bg-[#1e2c3a] p-3 border border-slate-700 space-y-2 max-w-sm">
                    {/* PINNED PHOTO */}
                    {homeSettings.bot_menu_image_url ? (
                      <img
                        src={homeSettings.bot_menu_image_url}
                        alt="Bot Header"
                        className="w-full h-32 object-cover rounded-xl border border-slate-600/50"
                      />
                    ) : (
                      <div className="w-full h-28 rounded-xl bg-gradient-to-r from-cyan-900 to-blue-900 flex items-center justify-center border border-cyan-500/30 text-center p-2">
                        <span className="text-xs font-bold text-cyan-200">
                          {lang === 'en' ? '📌 Pinned Banner Image' : '📌 Закрепленное фото после /start'}
                        </span>
                      </div>
                    )}

                    <div className="text-xs text-slate-100 space-y-1">
                      <p className="font-bold text-white">{homeSettings.bot_menu_title || '🔥 Mediabuy Lab Bot'}</p>
                      <p className="whitespace-pre-line text-slate-200 leading-relaxed text-[11px]">
                        {homeSettings.bot_menu_description || 'Добро пожаловать в бота!'}
                      </p>
                    </div>

                    {/* INLINE KEYBOARD PREVIEW WITH REAL COLORS */}
                    <div className="pt-2 space-y-1.5">
                      {(homeSettings.bot_buttons || []).map((b) => {
                        let btnStyleClasses = 'bg-slate-700/80 text-slate-100 border-slate-600 hover:bg-slate-600'
                        if (b.style === 'success') {
                          btnStyleClasses = 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400 shadow-[0_0_10px_rgba(34,197,94,0.3)]'
                        } else if (b.style === 'danger') {
                          btnStyleClasses = 'bg-rose-600 hover:bg-rose-500 text-white border-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                        } else if (b.style === 'primary') {
                          btnStyleClasses = 'bg-blue-600 hover:bg-blue-500 text-white border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                        }

                        return (
                          <div
                            key={b.id}
                            className={`w-full py-2 px-3 rounded-xl border text-center text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${btnStyleClasses}`}
                          >
                            <span>{lang === 'en' && b.text_en ? b.text_en : b.text}</span>
                            {b.is_web_app && <span className="text-[9px] opacity-80 uppercase font-black px-1 rounded bg-black/30">Mini App</span>}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Telegram Bot API 2026</span>
                  <span className="text-emerald-400 font-mono font-bold">InlineKeyboardButton style: success | danger | primary</span>
                </div>
              </div>
            </div>
          </section>

          <button
            onClick={updateHomeSettings}
            className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 text-xs font-bold text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.3)] w-full sm:w-auto"
          >
            <Save size={16} /> {lang === 'en' ? 'Save All Showcase & Bot Settings' : 'Сохранить настройки витрины и бота'}
          </button>
        </div>
      )}

      {/* CONTACTS TAB */}
      {activeTab === 'contacts' && (
        <section className="rounded-3xl border border-cyan-400/30 bg-[#09122c]/80 p-5 shadow-lg space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Users size={18} className="text-cyan-300" />
            {lang === 'en' ? 'Public Contacts & Admin Handles (Bilingual RU / EN)' : 'Публичные контакты и каналы (На 2-х языках)'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 p-3 rounded-2xl bg-black/40 border border-cyan-500/20">
            <input
              value={newContact.title}
              onChange={(e) => setNewContact({ ...newContact, title: e.target.value })}
              className="rounded-xl border border-cyan-500/30 bg-black/50 px-3 py-2 text-xs text-white"
              placeholder={lang === 'en' ? 'Title (RU)' : 'Название RU (например, Менеджер Сергей)'}
            />
            <input
              value={newContact.title_en || ''}
              onChange={(e) => setNewContact({ ...newContact, title_en: e.target.value })}
              className="rounded-xl border border-indigo-500/30 bg-black/50 px-3 py-2 text-xs text-indigo-200"
              placeholder={lang === 'en' ? 'Title (EN)' : 'Название EN (e.g. Manager Sergey)'}
            />
            <input
              value={newContact.link}
              onChange={(e) => setNewContact({ ...newContact, link: e.target.value })}
              className="rounded-xl border border-cyan-500/30 bg-black/50 px-3 py-2 text-xs text-white"
              placeholder="https://t.me/sergey_mediabuy"
            />
            <select
              value={newContact.kind}
              onChange={(e) => setNewContact({ ...newContact, kind: e.target.value })}
              className="rounded-xl border border-cyan-500/30 bg-black/50 px-3 py-2 text-xs text-white"
            >
              <option value="person">person (Менеджер/Админ)</option>
              <option value="channel">channel (Канал)</option>
            </select>
            <button
              onClick={createContact}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 text-xs font-bold text-slate-950"
            >
              <Plus size={14} /> {lang === 'en' ? 'Add Contact' : 'Добавить'}
            </button>
          </div>

          <div className="space-y-2.5">
            {contacts.map((contact) => (
              <div key={contact.id} className="flex flex-col sm:flex-row items-center gap-2 rounded-2xl border border-cyan-400/20 bg-black/30 p-3">
                <div className="w-full sm:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase">RU Title</label>
                    <input
                      value={contact.title || ''}
                      onChange={(e) => setContacts(prev => prev.map(c => c.id === contact.id ? { ...c, title: e.target.value } : c))}
                      className="mt-0.5 w-full rounded-lg border border-cyan-500/20 bg-black/50 px-2.5 py-1.5 text-xs font-bold text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-indigo-400 uppercase">EN Title</label>
                    <input
                      value={contact.title_en || ''}
                      onChange={(e) => setContacts(prev => prev.map(c => c.id === contact.id ? { ...c, title_en: e.target.value } : c))}
                      className="mt-0.5 w-full rounded-lg border border-indigo-500/20 bg-black/50 px-2.5 py-1.5 text-xs text-indigo-200"
                    />
                  </div>
                </div>

                <div className="w-full sm:flex-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Telegram Link</label>
                  <input
                    value={contact.link || ''}
                    onChange={(e) => setContacts(prev => prev.map(c => c.id === contact.id ? { ...c, link: e.target.value } : c))}
                    className="mt-0.5 w-full rounded-lg border border-cyan-500/20 bg-black/50 px-2.5 py-1.5 text-xs text-slate-300"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2 sm:pt-4">
                  <button
                    onClick={() => updateContact(contact)}
                    className="flex items-center gap-1 rounded-lg border border-cyan-400/40 bg-cyan-950/40 px-3 py-1.5 text-xs font-bold text-cyan-300"
                  >
                    <Save size={13} /> {lang === 'en' ? 'Save' : 'Сохранить'}
                  </button>
                  <button
                    onClick={() => deleteContact(contact.id)}
                    className="rounded-lg border border-rose-500/40 bg-rose-950/40 px-2.5 py-1.5 text-xs font-bold text-rose-300"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

        {/* CREATE POST TAB */}
        {activeTab === 'create_post' && (
          <section className="rounded-3xl border border-cyan-400/30 bg-gradient-to-br from-[#071025] via-[#071426] to-[#040814] p-5 shadow-xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-3 mb-3">
              <Plus size={18} className="text-cyan-300" /> {lang === 'en' ? 'Create Channel Post' : 'Создать пост в канал'}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* LEFT: form */}
              <div className="lg:col-span-2 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400">{lang === 'en' ? 'Target Channel' : 'Целевой канал'}</label>
                    <div className="w-full rounded-xl border border-slate-700 bg-[#04101a] px-3 py-2 text-white text-sm flex items-center justify-between">
                      <div>
                        <div className="text-sm font-bold">Public Channel</div>
                        <div className="text-xs text-slate-300">{channelSubscribers} {lang === 'en' ? 'subscribers' : 'подписчиков'}</div>
                      </div>
                      <div className="text-xs text-slate-400">
                        {showChannelId ? channelId : 'ID скрыт'}
                        <button onClick={() => setShowChannelId(s => !s)} className="ml-3 text-[11px] px-2 py-1 rounded bg-slate-800 text-slate-200">{showChannelId ? (lang === 'en' ? 'Hide' : 'Скрыть') : (lang === 'en' ? 'Show' : 'Показать')}</button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">{lang === 'en' ? 'Channel Title (public)' : 'Заголовок для паблик канала'}</label>
                    <input value={channelTitle} onChange={(e) => setChannelTitle(e.target.value)} placeholder={lang === 'en' ? 'Optional header for public channel' : 'Опциональный заголовок для канала'} className="w-full rounded-xl border border-slate-700 bg-[#04101a] px-3 py-2 text-white text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">{lang === 'en' ? 'Schedule (optional)' : 'Запланировать (опционально)'}</label>
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setScheduleChoice('now'); setScheduleAt(''); }} className={`px-3 py-2 rounded-xl text-sm font-bold ${scheduleChoice === 'now' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300'}`}>{lang === 'en' ? 'Now' : 'Сейчас'}</button>
                      <button onClick={() => setScheduleChoice('pick')} className={`px-3 py-2 rounded-xl text-sm font-bold ${scheduleChoice === 'pick' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300'}`}>{lang === 'en' ? 'Pick time' : 'Указать время'}</button>
                      {scheduleChoice === 'pick' && (
                        <input type="datetime-local" value={scheduleAt} onChange={(e) => setScheduleAt(e.target.value)} className="ml-2 rounded-xl border border-slate-700 bg-[#04101a] px-3 py-2 text-white text-sm" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400">{lang === 'en' ? 'Post text (RU)' : 'Текст поста (RU)'}</label>
                    <textarea value={postText} onChange={(e) => setPostText(e.target.value)} rows={6} className="w-full rounded-2xl border border-slate-700 bg-[#03101a] px-3 py-2 text-white text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">{lang === 'en' ? 'Post text (EN)' : 'Текст поста (EN)'}</label>
                    <textarea value={postTextEn} onChange={(e) => setPostTextEn(e.target.value)} rows={6} className="w-full rounded-2xl border border-slate-700 bg-[#03101a] px-3 py-2 text-white text-sm" />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-700 bg-[#021019] p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">{lang === 'en' ? 'Inline buttons' : 'Кнопки Inline-клавиатуры'}</h4>
                    <button onClick={addPostButton} className="text-xs bg-cyan-600 px-3 py-1 rounded-full font-bold">{lang === 'en' ? 'Add button' : 'Добавить кнопку'}</button>
                  </div>

                  <div className="space-y-3">
                    {buttons.map((btn, idx) => (
                      <div key={idx} className="grid grid-cols-1 lg:grid-cols-12 gap-2 items-center">
                        <div className="lg:col-span-4">
                          <input value={btn.text} onChange={(e) => updatePostButton(btn.id ?? idx, { text: e.target.value })} placeholder={lang === 'en' ? 'Text (RU)' : 'Текст (RU)'} className="w-full rounded-xl border border-slate-700 bg-[#011018] px-3 py-2 text-white text-sm" />
                        </div>
                        <div className="lg:col-span-4">
                          <input value={btn.text_en || ''} onChange={(e) => updatePostButton(btn.id ?? idx, { text_en: e.target.value })} placeholder={lang === 'en' ? 'Text (EN)' : 'Текст (EN)'} className="w-full rounded-xl border border-slate-700 bg-[#011018] px-3 py-2 text-white text-sm" />
                        </div>
                        <div className="lg:col-span-2">
                          <input value={btn.url} onChange={(e) => updatePostButton(btn.id ?? idx, { url: e.target.value })} placeholder="URL" className="w-full rounded-xl border border-slate-700 bg-[#011018] px-3 py-2 text-white text-sm" />
                        </div>
                        <div className="lg:col-span-1">
                          <select value={btn.style || 'default'} onChange={(e) => updatePostButton(btn.id ?? idx, { style: e.target.value })} className="w-full rounded-xl border border-slate-700 bg-[#011018] px-3 py-2 text-white text-sm">
                            <option value="success">Green (success)</option>
                            <option value="primary">Blue (primary)</option>
                            <option value="danger">Red (danger)</option>
                            <option value="default">Gray (default)</option>
                          </select>
                        </div>
                        <div className="lg:col-span-1 flex items-center gap-2">
                          <label className="flex items-center gap-2 text-xs text-slate-300"><input type="checkbox" checked={!!btn.is_web_app} onChange={(e) => updatePostButton(btn.id ?? idx, { is_web_app: e.target.checked })} /> Mini App</label>
                          <button onClick={() => deletePostButton(btn.id ?? idx)} className="rounded-full bg-rose-600 px-3 py-1 text-xs font-bold">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                  <div>
                    <label className="text-xs text-slate-400">{lang === 'en' ? 'Attach image (optional)' : 'Прикрепить изображение (опционально)'}</label>
                    <input type="file" accept="image/*" onChange={(e) => setPostImageFile(e.target.files && e.target.files[0])} className="w-full mt-2" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={createPostDraft} className="rounded-2xl bg-cyan-600 px-4 py-2 text-sm font-bold">{lang === 'en' ? 'Create Draft & Preview' : 'Создать драфт и предпросмотр'}</button>
                    {previewResult && (
                      <>
                        <button onClick={publishDraftNow} className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-bold">{lang === 'en' ? 'Publish Now' : 'Опубликовать сейчас'}</button>
                        <button onClick={scheduleDraft} className="rounded-2xl bg-yellow-600 px-4 py-2 text-sm font-bold">{lang === 'en' ? 'Schedule' : 'Запланировать'}</button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT: preview panel */}
              <div className="lg:col-span-1">
                <div className="rounded-2xl border border-cyan-500/20 bg-[#071623] p-4">
                  <div className="rounded-xl bg-gradient-to-r from-[#0b2540] to-[#05223a] p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-cyan-800 flex items-center justify-center font-bold text-white">ML</div>
                      <div>
                        <div className="text-sm font-bold text-white">Mediabuy Lab — Эксперты в Арбитраже & Медиабайнинге</div>
                        <div className="text-xs text-slate-300">Официальный бот</div>
                      </div>
                    </div>
                    <div className="mt-3 rounded-lg overflow-hidden border bg-black/40">
                      {previewResult && previewResult.previewImageUrl ? (
                        <img src={previewResult.previewImageUrl} alt="preview" className="w-full h-32 object-cover" />
                      ) : (
                        <div className="h-32 bg-gradient-to-r from-cyan-700 to-blue-600 flex items-center justify-center text-white font-bold">Preview Image</div>
                      )}
                      <div className="p-3">
                        <div className="text-xs text-slate-300 whitespace-pre-wrap">{previewResult ? previewResult.previewText : lang === 'en' ? 'Preview will appear here' : 'Здесь появится предпросмотр'}</div>
                        <div className="mt-3 space-y-2">
                          {buttons.map((b, i) => (
                            <div key={i} className={`flex items-center justify-between rounded-xl px-3 py-2 ${getButtonClass(b.style)}`}>
                              <div className="flex items-center gap-2">
                                {b.is_web_app && <span className="text-[10px] px-2 py-0.5 bg-black/30 rounded text-white font-black">MINI APP</span>}
                                <span className="text-sm font-bold">{lang === 'en' ? (b.text_en || b.text) : b.text}</span>
                              </div>
                              <div className="text-xs opacity-80">{b.url || ''}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 text-[10px] text-slate-400">Telegram Bot API · InlineKeyboardButton style: success | danger | primary</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
    </PageShell>
  )
}
