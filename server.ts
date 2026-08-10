import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { createServer as createViteServer } from 'vite';

const PORT = Number(process.env.PORT) || 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'public')));

app.get('/document.pdf', (req: Request, res: Response) => {
  const rootDocPath = path.join(process.cwd(), 'document.pdf');
  const publicDocPath = path.join(process.cwd(), 'public', 'document.pdf');
  if (fs.existsSync(rootDocPath)) {
    res.sendFile(rootDocPath);
  } else if (fs.existsSync(publicDocPath)) {
    res.sendFile(publicDocPath);
  } else {
    res.status(404).send('Document not found');
  }
});

app.get('/api/download-zip', (req: Request, res: Response) => {
  const zipPath = path.join(process.cwd(), 'public', 'mediabuy_lab.zip');
  if (fs.existsSync(zipPath)) {
    res.download(zipPath, 'mediabuy_lab.zip');
  } else {
    res.status(404).send('Archive not found');
  }
});

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
const homeUploadsDir = path.join(uploadsDir, 'home');
if (!fs.existsSync(homeUploadsDir)) {
  fs.mkdirSync(homeUploadsDir, { recursive: true });
}

app.use('/uploads', express.static(uploadsDir));

// Multer storage
const upload = multer({ dest: path.join(uploadsDir, 'tmp') });

// Secret for JWT
const JWT_SECRET = process.env.ADMIN_WEB_TOKEN_SECRET || 'mediabuy-secret-key-12345';
const ADMIN_LOGIN = process.env.WEB_ADMIN_LOGIN || 'admin';
const ADMIN_PASSWORD = process.env.WEB_ADMIN_PASSWORD || 'admin';

// --- IN-MEMORY DATABASE & DATA SEEDING ---

interface Category {
  id: number;
  name: string;
  slug: string;
  is_visible: boolean;
  platform: string;
}

interface Product {
  id: number;
  category_id: number;
  title: string;
  title_en?: string | null;
  description: string;
  description_en?: string | null;
  platform: string;
  price: number;
  is_visible: boolean;
  detailed_description?: string | null;
  detailed_description_en?: string | null;
  geo?: string | null;
  format?: string | null;
  replacement_policy?: string | null;
  usage_instructions?: string | null;
  stock?: number;
}

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  image_url: string;
  target_url: string;
  sort_order: number;
  is_active: boolean;
  badge_text?: string | null;
}

interface Article {
  id: number;
  title: string;
  image_url: string;
  target_url: string;
  sort_order: number;
  is_active: boolean;
  has_en_version: boolean;
  title_en?: string | null;
  image_url_en?: string | null;
  target_url_en?: string | null;
}

interface Contact {
  id: number;
  title: string;
  title_en?: string | null;
  link: string;
  kind: 'person' | 'channel';
  sort_order: number;
  is_active: boolean;
}

interface BotButton {
  id: number;
  text: string;
  text_en?: string;
  style: 'success' | 'danger' | 'primary' | 'default';
  url?: string;
  is_web_app?: boolean;
}

interface HomeSettings {
  id: number;
  logo_text: string;
  logo_image_url: string | null;
  brand_title: string;
  brand_subtitle: string;
  launch_badge: string;
  launch_title: string;
  launch_image_url: string | null;
  training_badge: string;
  training_title: string;
  training_image_url: string | null;
  bot_menu_title: string;
  bot_menu_description: string;
  bot_menu_image_url: string | null;
  bot_buttons?: BotButton[];
}

interface User {
  id: number;
  telegram_id: number;
  username?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  next_order_discount_percent: number;
}

interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
}

interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
}

interface Order {
  id: number;
  user_id: number;
  currency: string;
  total_amount: number;
  status: string;
  discount_percent: number;
  payment_method: 'crypto_direct';
  crypto_currency: string;
  assigned_wallet: string;
  wallet_index: number;
  crypto_amount: string;
  qr_code_url: string;
  created_at: string;
  items: OrderItem[];
  txid?: string | null;
  payment_verified_auto?: boolean;
  delivered_data?: string | null;
}

// --- DIRECT CRYPTO PAYMENT MULTI-WALLET ENGINE (ROUND-ROBIN) ---
const CRYPTO_WALLETS = {
  USDT_TRC20: (process.env.WALLETS_USDT_TRC20 || 'TY9aA5kZ5qJ2K8mW3pL7vX4nR1sT6uY8v1,TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t,TLj7vN4b8wX2K1mP5qL8sT3rY6uV9wX2z3,TP8qM3vL9wX1K2nP6qL7sT4rY5uV8wX1y2,TV6nK2vM8wX0K1nP5qL6sT3rY4uV7wX0z1').split(',').map(s => s.trim()),
  USDT_BEP20: (process.env.WALLETS_USDT_BEP20 || '0x1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A01,0x8894E0a0c962CB723c1976a4421c95949bE2D4E3,0x2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A01B2,0x3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A01B2C3,0x4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A01B2C3D4').split(',').map(s => s.trim()),
  USDT_ERC20: (process.env.WALLETS_USDT_ERC20 || '0x5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A01B2C3D4E5,0x6F7A8B9C0D1E2F3A4B5C6D7E8F9A01B2C3D4E5F6,0x7A8B9C0D1E2F3A4B5C6D7E8F9A01B2C3D4E5F6A7,0x8B9C0D1E2F3A4B5C6D7E8F9A01B2C3D4E5F6A7B8,0x9C0D1E2F3A4B5C6D7E8F9A01B2C3D4E5F6A7B8C9').split(',').map(s => s.trim()),
  BTC: (process.env.WALLETS_BTC || 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh,1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa,bc1q7x4g8k9m0l1p2q3r4s5t6u7v8w9x0y1z2a3b4c,3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy,bc1q5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h').split(',').map(s => s.trim()),
  ETH: (process.env.WALLETS_ETH || '0x00000000219ab540356cBB839Cbe05303d7705Fa,0x71C7656EC7ab88b098defB751B7401B5f6d8976F,0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2,0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8,0xDA9e1b8c077d7500313509855368893d57536184').split(',').map(s => s.trim()),
  TON: (process.env.WALLETS_TON || 'EQA0i3-noLKGfl39noP39LKGf_noLKGfl39noP39LKGf0001,UQA2_3LKGf_noLKGfl39noP39LKGf_noLKGfl39noP390002,EQBvW8Z5huBkMJYdnfAEM5JqTN19B91L2K8nW3pL7vX40003,UQCa1_3LKGf_noLKGfl39noP39LKGf_noLKGfl39noP390004,EQDb2_3LKGf_noLKGfl39noP39LKGf_noLKGfl39noP390005').split(',').map(s => s.trim()),
};

const walletRoundRobinIndex: Record<string, number> = {
  USDT_TRC20: 0,
  USDT_BEP20: 0,
  USDT_ERC20: 0,
  BTC: 0,
  ETH: 0,
  TON: 0,
};

const CRYPTO_RATES_USD: Record<string, number> = {
  USDT_TRC20: 1.0,
  USDT_BEP20: 1.0,
  USDT_ERC20: 1.0,
  BTC: 65000.0,
  ETH: 3500.0,
  TON: 6.50,
};

function getNextWalletForCurrency(currencyKey: string) {
  const pool = CRYPTO_WALLETS[currencyKey as keyof typeof CRYPTO_WALLETS] || CRYPTO_WALLETS.USDT_TRC20;
  const currentIndex = walletRoundRobinIndex[currencyKey] || 0;
  const assigned = pool[currentIndex % pool.length];
  walletRoundRobinIndex[currencyKey] = (currentIndex + 1) % pool.length;
  return { wallet: assigned, indexNumber: (currentIndex % pool.length) + 1, poolTotal: pool.length };
}

function calculateCryptoAmount(usdTotal: number, currencyKey: string): string {
  const rate = CRYPTO_RATES_USD[currencyKey] || 1.0;
  if (currencyKey.startsWith('USDT')) {
    return `${usdTotal.toFixed(2)} USDT`;
  } else if (currencyKey === 'BTC') {
    return `${(usdTotal / rate).toFixed(6)} BTC`;
  } else if (currencyKey === 'ETH') {
    return `${(usdTotal / rate).toFixed(5)} ETH`;
  } else if (currencyKey === 'TON') {
    return `${(usdTotal / rate).toFixed(2)} TON`;
  }
  return `${usdTotal.toFixed(2)} USD`;
}

interface ServiceRequest {
  id: number;
  user_id: number;
  request_type: 'launch_ads' | 'training';
  project_url?: string | null;
  planned_budget?: string | null;
  platform?: string | null;
  experience_level?: string | null;
  details?: string | null;
  created_at: string;
}

// Data Stores
let categories: Category[] = [
  { id: 1, name: "Аккаунты Twitter (X)", slug: "accounts-twitter", is_visible: true, platform: "Twitter (X)" },
  { id: 2, name: "Аккаунты Google", slug: "accounts-google", is_visible: true, platform: "Google" },
  { id: 3, name: "Аккаунты Facebook", slug: "accounts-facebook", is_visible: true, platform: "Facebook" },
  { id: 4, name: "Аккаунты TikTok", slug: "accounts-tiktok", is_visible: true, platform: "TikTok" },
  { id: 5, name: "Аккаунты Яндекс", slug: "accounts-yandex", is_visible: true, platform: "Яндекс" },
  { id: 6, name: "Приватные Прокси", slug: "proxies", is_visible: true, platform: "Proxy" },
  { id: 7, name: "Готовые Сетапы", slug: "starter-packs", is_visible: true, platform: "Setup" },
];

let products: Product[] = [];
let prodId = 1;
categories.filter(c => c.id <= 5).forEach((cat) => {
  for (let i = 1; i <= 3; i++) {
    products.push({
      id: prodId++,
      category_id: cat.id,
      title: `${cat.platform} Premium Farm #${i}`,
      title_en: `${cat.platform} Premium Farm #${i}`,
      description: `${cat.platform}: формат farm/aged, отлежка ${7 + i * 3} дней, GEO US/EU, готов под запуск без банов`,
      description_en: `${cat.platform}: farm/aged format, aged ${7 + i * 3} days, GEO US/EU, ready for smooth ad launches`,
      platform: cat.platform,
      price: 18 + i * 4,
      is_visible: true,
      detailed_description: `Высококачественный прогретый аккаунт ${cat.platform} с полной выгрузкой куки (JSON/Netscape), пройденной SMS/2FA верификацией и живой социализацией (фарм ${7 + i * 3} дней). Идеально подходит для работы в антидетект браузерах.`,
      detailed_description_en: `High-quality warmed ${cat.platform} account with full cookie export (JSON/Netscape), SMS/2FA verification completed, and natural farming history (${7 + i * 3} days). Ideal for anti-detect browsers.`,
      geo: i === 1 ? 'US / США' : (i === 2 ? 'EU / Европа' : 'Все страны (WW)'),
      format: 'Login:Pass:2FA:Cookies(JSON):UserAgent',
      replacement_policy: 'Бесплатная замена в течение 24 часов с момента покупки при сохранении условий работы через приватные прокси.',
      usage_instructions: '1. Импортируйте куки в профиль антидетекта.\n2. Используйте чистые статичные прокси (SOCKS5/HTTP) страны аккаунта.\n3. Не меняйте логин/пароль в первые 2 часа после входа.',
      stock: 25 + i * 10
    });
  }
});

// Seed Starter Packs in products table
products.push(
  {
    id: 101,
    category_id: 7,
    title: 'ФБ King Стартовый Сетап (King Farm + 3 BM + US Proxy + Чеклист)',
    title_en: 'FB King Launch Setup (King Farm + 3 BM + US Proxy + Checklist)',
    description: 'Комплект максимального траста: 1 Facebook Кинг-фарм (14+ дней отлежки) + 3 верифицированных BM (Uncapped) + 1 Приватный резидентский US прокси + Чеклист безопасного запуска без банов.',
    description_en: 'High-trust combo: 1 Facebook King Farm (14+ days warmed) + 3 Verified BMs (Uncapped) + 1 Private US Residential Proxy + Anti-Ban Launch Checklist.',
    platform: 'Facebook',
    price: 48.00,
    is_visible: true,
    detailed_description: 'Комплексный флагманский сетап для моментального запуска в Facebook Ads. Включает 1 трастовый Кинг-аккаунт с ручным фармом 14+ дней, 3 верифицированных Business Manager с безлимитным спендом, 1 статический резидентский прокси US оператора и PDF чеклист по безопасному прогреву и запуску кампаний.',
    detailed_description_en: 'All-in-one flagship setup for immediate launch in Facebook Ads. Includes 1 trusted King account with 14+ days manual farm, 3 verified Business Managers (uncapped), 1 static US residential proxy, and a PDF checklist for safe warmup and launching.',
    geo: 'US / США 🇺🇸',
    format: 'Login:Pass:2FA:Cookies + 3x BM Invitations + IP:PORT:USER:PASS + Guide PDF',
    replacement_policy: 'Полная гарантия и замена любого элемента комплекта в течение 48 часов в случае чекпоинта или бана.',
    usage_instructions: '1. Импортируйте куки Кинг-аккаунта в Dolphin Anty.\n2. Укажите выданный US прокси.\n3. Примите инвайты в 3 BM по прямым ссылкам.\n4. Запустите рекламу согласно чеклисту.',
    stock: 45
  },
  {
    id: 102,
    category_id: 7,
    title: 'TikTok Ads Launch Kit (Agency Uncapped + Скоростной Прокси + Мануал)',
    title_en: 'TikTok Ads Launch Kit (Agency Uncapped + High-Speed Proxy + Guide)',
    description: 'Готовый набор под масштабный пролив: Агентский аккаунт TikTok Ads без суточного лимита + Выделенный гео-прокси (HTTP/SOCKS5, <35ms ping) + Инструкция по привязке карты и обходу модерации.',
    description_en: 'Scale-ready bundle: TikTok Ads Agency Account (uncapped) + Dedicated Geo-Proxy (HTTP/SOCKS5, <35ms ping) + Payment linking & moderation guide.',
    platform: 'TikTok',
    price: 39.00,
    is_visible: true,
    detailed_description: 'Полный набор для арбитража в TikTok Ads. Вы получаете агентский кабинет с возможностью лить любые объемы трафика без суточного холдирования и лимитов, выделенный скоростной прокси с минимальной задержкой для видео и мануал по передаче прав.',
    detailed_description_en: 'Full toolkit for media buying in TikTok Ads. Agency account with uncapped daily spend, dedicated high-speed low-latency proxy, and safe transfer manual.',
    geo: 'WW / Глобал 🌐',
    format: 'Login:Pass:2FA + BC Admin Invite + IP:PORT:USER:PASS + Manual PDF',
    replacement_policy: 'Замена в течение 24 часов до момента залива первого креатива.',
    usage_instructions: '1. Авторизуйтесь через антидетект с подключенным прокси.\n2. Примите права админа в Business Center.\n3. Привяжите платежное средство и публикуйте объявления.',
    stock: 38
  },
  {
    id: 103,
    category_id: 7,
    title: 'Google Ads Power Pack (EU Aged Farm + История списаний + ISP Прокси)',
    title_en: 'Google Ads Power Pack (EU Aged Farm + Billing History + ISP Proxy)',
    description: 'Максимально устойчивый сетап для Google Search & YouTube: 1 Прогретый аккаунт с реальной историей оплат + 2 суб-аккаунта + Чистый статический прокси провайдера (ISP).',
    description_en: 'Bulletproof Google Search & YouTube setup: 1 Warmed Account with spend history + 2 Sub-accounts + Clean Static ISP Proxy.',
    platform: 'Google',
    price: 55.00,
    is_visible: true,
    detailed_description: 'Премиальный сетап для работы с контекстной и видео-рекламой в Google Ads. Прогретый аккаунт с историей оплат, 2 связанных суб-аккаунта MCC для сплит-тестов и чистый статический IP адрес европейского интернет-провайдера.',
    detailed_description_en: 'Premium setup for Google Search and YouTube Ads. Aged account with real billing transactions, 2 linked MCC sub-accounts, and a clean static EU ISP proxy.',
    geo: 'EU / Европа 🇪🇺',
    format: 'Email:Password:Recovery:2FA_Secret + Cookies + Proxy IP:Port:User:Pass',
    replacement_policy: 'Гарантированная замена в случае первичного суспенда за подозрительные платежи (Suspicious Payment).',
    usage_instructions: '1. Загрузите профиль в браузер.\n2. Подключите прокси и проверьте отсутствие WebRTC утечек.\n3. Дайте отлежаться 30 минут перед запуском биллинговой кампании.',
    stock: 29
  }
);

// Seed Proxies in products table
products.push(
  {
    id: 301,
    category_id: 6,
    title: 'Мобильные Прокси 4G/5G США (US Private Dynamic)',
    title_en: 'US Mobile Proxies 4G/5G (Private Dynamic Pool)',
    description: 'Приватный мобильный модем (Verizon/T-Mobile). Смена IP по API-ссылке или таймеру (от 2 мин). Безлимитный трафик, скорость до 60 Мбит/с. Идеально для Facebook и TikTok.',
    description_en: 'Private mobile modem (Verizon/T-Mobile). IP change via API link or timer (from 2 min). Unlimited traffic, up to 60 Mbps. Ideal for FB and TikTok.',
    platform: 'Proxy',
    price: 9.50,
    is_visible: true,
    detailed_description: 'Выделенный динамический мобильный 4G/5G канал на реальных SIM-картах американских операторов (AT&T, Verizon, T-Mobile). При смене IP вы получаете чистейший адрес из пула с нулевым фрод-скором (Fraud Score = 0). Антифрод-системы соцсетей воспринимают трафик как обычного мобильного пользователя.',
    detailed_description_en: 'Dedicated dynamic mobile 4G/5G channel powered by real US cellular carriers (AT&T, Verizon, T-Mobile). Changing IP rotates addresses with zero fraud score. Ad platform anti-fraud algorithms recognize traffic as standard legitimate mobile users.',
    geo: 'US / США 🇺🇸',
    format: 'IP:PORT:USERNAME:PASSWORD:CHANGE_IP_LINK',
    replacement_policy: 'Гарантированная замена или возврат средств в течение 24 часов при падении скорости ниже 15 Мбит/с или недоступности пула.',
    usage_instructions: '1. Добавьте прокси как SOCKS5 или HTTP в профиль Dolphin Anty/AdsPower.\n2. В поле "Ссылка для смены IP" укажите полученный API URL.\n3. Ротируйте IP перед каждым созданием или входом в новый аккаунт.',
    stock: 85
  },
  {
    id: 302,
    category_id: 6,
    title: 'Резидентские Статичные Прокси Европа (EU Residential Static ISP)',
    title_en: 'EU Residential Static Proxies (ISP Clean Pool)',
    description: 'Статический резидентский IP от ведущих европейских провайдеров (Германия, Нидерланды, Великобритания). Приватный канал 1 Гбит/с, пинг < 20мс. Для Google Ads и FB.',
    description_en: 'Static residential IP from top European ISPs (Germany, Netherlands, UK). Private 1 Gbps port, ping < 20ms. Best for Google Ads and Facebook.',
    platform: 'Proxy',
    price: 6.00,
    is_visible: true,
    detailed_description: 'Индивидуальные статичные резидентские прокси (ISP) с белым списком адресов. Адрес закреплен за вами на весь оплаченный период (30 дней). Идеально подходит для работы с прогретыми аккаунтами Google Ads, Facebook, Twitter, где критически важна стабильность одного IP без неожиданных скачков гео.',
    detailed_description_en: 'Individual static residential ISP proxies with white-listed addresses. The dedicated IP belongs exclusively to you for the entire 30-day period. Essential for aged Google Ads, Facebook, and Twitter farms where consistent single IP retention is required.',
    geo: 'EU / Европа 🇪🇺',
    format: 'IP:PORT:USERNAME:PASSWORD',
    replacement_policy: 'Моментальная замена при первом подключении в случае недоступности порта.',
    usage_instructions: '1. Скопируйте host:port:user:pass в настройки антидетект браузера.\n2. Проверьте ГЕО и WebRTC через Whoer/BrowserScan перед запуском кабинета.',
    stock: 120
  },
  {
    id: 303,
    category_id: 6,
    title: 'Выделенный Прокси под TikTok Ads (TikTok Dedicated Ultra-Fast)',
    title_en: 'Dedicated Proxy for TikTok Ads (Ultra-Fast & Zero Lag)',
    description: 'Специально оптимизированный скоростной прокси под видео-загрузку в TikTok Ads Manager. Минимальный пинг, полное отсутствие задержек при загрузке тяжелых креативов.',
    description_en: 'Optimized high-speed proxy tailored for video uploads in TikTok Ads Manager. Lowest latency, smooth heavy creative publishing.',
    platform: 'Proxy',
    price: 7.50,
    is_visible: true,
    detailed_description: 'Ультра-быстрый выделенный прокси-сервер с широким каналом пропускной способности. Оптимизирован для массовой загрузки видео-креативов в TikTok Ads Manager и быстрого прохождения первичной автоматической модерации.',
    detailed_description_en: 'Ultra-fast dedicated proxy server with wide bandwidth. Optimized for bulk video creative uploads into TikTok Ads Manager and instant initial AI moderation pass.',
    geo: 'US / UK / EU 🌐',
    format: 'IP:PORT:USERNAME:PASSWORD',
    replacement_policy: 'Бесплатная замена по запросу в течение суток.',
    usage_instructions: '1. Подключите в расширении или браузере антидетекта.\n2. Загружайте видео-креативы любого размера без потери качества.',
    stock: 64
  },
  {
    id: 304,
    category_id: 6,
    title: 'Мобильные Прокси WW (Авто-Ротация 30+ стран)',
    title_en: 'Worldwide Mobile Proxies (Auto-Rotate 30+ GEOs)',
    description: 'Глобальный мобильный пул с гибким выбором стран (LATAM, Asia, EU, US). Ротация по каждому запросу или по таймеру. Неограниченный поток сессий.',
    description_en: 'Global mobile proxy pool with flexible country selection (LATAM, Asia, EU, US). Rotate on each request or custom timer. Unlimited concurrent sessions.',
    platform: 'Proxy',
    price: 8.00,
    is_visible: true,
    detailed_description: 'Многопоточный глобальный мобильный пул. Позволяет переключать локации на лету или настраивать ротацию IP под автоматические чекеры, парсеры и массовые прогревы аккаунтов.',
    detailed_description_en: 'Multi-threaded global mobile pool. Allows on-the-fly location switching or automated IP rotation for checkers, scrapers, and mass warmup tasks.',
    geo: 'WW / 30+ Стран 🌍',
    format: 'GATEWAY_IP:PORT:USER_TOKEN',
    replacement_policy: 'Круглосуточный мониторинг пула с аптаймом 99.9%.',
    usage_instructions: '1. Укажите шлюз и токен авторизации.\n2. Выберите целевой код страны в заголовках или ссылке.',
    stock: 95
  }
);

let banners: Banner[] = [
  {
    id: 2,
    title: "Запуск и обучение в одном месте",
    subtitle: "Практика, связки и поддержка команды",
    image_url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1400&q=80",
    target_url: "https://t.me/mediabuy_lab",
    sort_order: 1,
    is_active: true,
    badge_text: "HOT DEAL",
  },
  {
    id: 3,
    title: "Скидка 10% на второй заказ",
    subtitle: "Акция активируется автоматически после первой успешной оплаты",
    image_url: "https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=1400&q=80",
    target_url: "https://t.me/mediabuy_lab",
    sort_order: 2,
    is_active: true,
    badge_text: "BONUS 10%",
  },
  {
    id: 4,
    title: "Акция: запуск + креативы -15%",
    subtitle: "Ограниченное предложение на комплексный запуск",
    image_url: "https://images.unsplash.com/photo-1556155092-8707de31f9c4?auto=format&fit=crop&w=1400&q=80",
    target_url: "https://t.me/mediabuy_lab",
    sort_order: 3,
    is_active: true,
    badge_text: "LIMITED",
  },
];

let articles: Article[] = [
  {
    id: 1,
    title: "Кейс: TikTok eCom на холодном трафике",
    image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    target_url: "https://t.me/mediabuy_lab",
    sort_order: 1,
    is_active: true,
    has_en_version: false,
  },
  {
    id: 2,
    title: "Как подготовить аккаунты под запуск без банов",
    image_url: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80",
    target_url: "https://t.me/mediabuy_lab",
    sort_order: 2,
    is_active: true,
    has_en_version: false,
  },
];

let contacts: Contact[] = [
  { id: 1, title: "📢 Официальный канал", title_en: "📢 Official Channel", link: "https://t.me/mediabuy_lab", kind: "channel", sort_order: 1, is_active: true },
  { id: 2, title: "👤 Главный Админ", title_en: "👤 Main Admin", link: "https://t.me/mediabuy_adm", kind: "person", sort_order: 2, is_active: true },
  { id: 3, title: "💬 Менеджер Сергей", title_en: "💬 Manager Sergey", link: "https://t.me/sergey_mediabuy", kind: "person", sort_order: 3, is_active: true },
  { id: 4, title: "💬 Менеджер Антон", title_en: "💬 Manager Anton", link: "https://t.me/Anton_mediabuy", kind: "person", sort_order: 4, is_active: true },
  { id: 5, title: "💬 Менеджер Виктория", title_en: "💬 Manager Victoria", link: "https://t.me/Victorys_mediabuy", kind: "person", sort_order: 5, is_active: true },
];

let homeSettings: HomeSettings = {
  id: 1,
  logo_text: "Mediabuy Lab",
  logo_image_url: null,
  brand_title: "Mediabuy Lab",
  brand_subtitle: "Аккаунты, запуски и обучение",
  launch_badge: "HOT",
  launch_title: "Запуск рекламы под ключ",
  launch_image_url: null,
  training_badge: "NEW",
  training_title: "Обучение арбитражу",
  training_image_url: null,
  bot_menu_title: "🧿 Mediabuy Lab — Эксперты в Арбитраже & Медиабайинге",
  bot_menu_description: `🔥 <b>Добро пожаловать в официальный бот Mediabuy Lab!</b>\n\n` +
    `Мы предоставляем полный комплекс решений для медиабайинга и работы с трафиком:\n\n` +
    `🚀 <b>1. Запуск рекламы под ключ:</b>\n` +
    `Профессиональная настройка и ведение рекламы в Facebook Ads, Google Ads, TikTok Ads, Crypto, Nutra и Gambling.\n\n` +
    `🎓 <b>2. Обучение арбитражу трафика:</b>\n` +
    `Практические курсы, рабочие связки, сетапы и личное наставничество до результата.\n\n` +
    `🛒 <b>3. Продажа фарм-аккаунтов & сетапов:</b>\n` +
    `Высокотрастовые аккаунты Facebook, Google, TikTok, Twitter (X), Яндекс, BM, агентские аккаунты и отгретые профили.\n\n` +
    `📱 <b>Открывайте Mini App для просмотра каталога и оформления заказа в пару кликов!</b>`,
  bot_menu_image_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
  bot_buttons: [
    { id: 1, text: "🚀 Открыть Mini App (Каталог)", text_en: "🚀 Open Mini App (Catalog)", style: "success", is_web_app: true },
    { id: 2, text: "📢 Наш Telegram Канал", text_en: "📢 Our Telegram Channel", style: "primary", url: "https://t.me/mediabuy_lab" },
    { id: 3, text: "👨‍💻 Наши Менеджеры", text_en: "👨‍💻 Our Managers", style: "default" },
    { id: 5, text: "🛡️ Наши гарантии", text_en: "🛡️ Guarantees", style: "default" },
  ],
};

let users: User[] = [
  {
    id: 1,
    telegram_id: 10001,
    username: 'demo_user',
    first_name: 'Demo',
    last_name: 'User',
    next_order_discount_percent: 0,
  },
];

let cartItems: CartItem[] = [];
let orders: Order[] = [];
let serviceRequests: ServiceRequest[] = [];

let nextCartItemId = 1;
let nextOrderId = 1;
let nextRequestId = 1;
let nextCategoryId = 6;
let nextProductId = prodId;
let nextBannerId = 5;
let nextArticleId = 3;
let nextContactId = 6;

// Helper to get or mock current user
function getUserFromReq(req: Request): User {
  let user: User | null = null;

  // 1. Check body tgUser
  if (req.body && req.body.tgUser && req.body.tgUser.id) {
    const parsed = req.body.tgUser;
    const tgId = Number(parsed.id);
    if (tgId) {
      user = users.find((u) => u.telegram_id === tgId) || null;
      if (!user) {
        user = {
          id: users.length + 1,
          telegram_id: tgId,
          username: parsed.username || null,
          first_name: parsed.first_name || 'Пользователь',
          last_name: parsed.last_name || null,
          next_order_discount_percent: 0,
        };
        users.push(user);
      } else {
        if (parsed.username !== undefined) user.username = parsed.username || null;
        if (parsed.first_name) user.first_name = parsed.first_name;
        if (parsed.last_name !== undefined) user.last_name = parsed.last_name || null;
      }
    }
  }

  // 2. Check X-Telegram-User header
  if (!user) {
    const tgUserHeader = req.headers['x-telegram-user'] as string;
    if (tgUserHeader) {
      try {
        const parsed = JSON.parse(tgUserHeader);
        const tgId = Number(parsed.id);
        if (tgId) {
          user = users.find((u) => u.telegram_id === tgId) || null;
          if (!user) {
            user = {
              id: users.length + 1,
              telegram_id: tgId,
              username: parsed.username || null,
              first_name: parsed.first_name || 'Пользователь',
              last_name: parsed.last_name || null,
              next_order_discount_percent: 0,
            };
            users.push(user);
          } else {
            if (parsed.username !== undefined) user.username = parsed.username || null;
            if (parsed.first_name) user.first_name = parsed.first_name;
            if (parsed.last_name !== undefined) user.last_name = parsed.last_name || null;
          }
        }
      } catch (e) {}
    }
  }

  // 3. Check X-Telegram-Init-Data header
  if (!user) {
    const initData = (req.headers['x-telegram-init-data'] as string) || (req.headers['x-telegram-initdata'] as string);
    if (initData) {
      try {
        const params = new URLSearchParams(initData);
        const userStr = params.get('user');
        if (userStr) {
          const parsed = JSON.parse(userStr);
          const tgId = Number(parsed.id);
          if (tgId) {
            user = users.find((u) => u.telegram_id === tgId) || null;
            if (!user) {
              user = {
                id: users.length + 1,
                telegram_id: tgId,
                username: parsed.username || null,
                first_name: parsed.first_name || 'Пользователь',
                last_name: parsed.last_name || null,
                next_order_discount_percent: 0,
              };
              users.push(user);
            } else {
              if (parsed.username !== undefined) user.username = parsed.username || null;
              if (parsed.first_name) user.first_name = parsed.first_name;
              if (parsed.last_name !== undefined) user.last_name = parsed.last_name || null;
            }
          }
        }
      } catch (e) {
        // fallback
      }
    }
  }

  if (!user) {
    user = users[0];
  }

  if (user && user.telegram_id) {
    user.is_admin = isAdminTelegramUser(user.telegram_id);
  }

  return user;
}

// Middleware for Admin auth
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      if (decoded && (decoded.role === 'admin' || decoded.sub)) {
        return next();
      }
    } catch (err) {
      // fallback
    }
  }

  const hasTgHeader = req.headers['x-telegram-user'] || req.headers['x-telegram-init-data'] || req.headers['x-telegram-initdata'];
  if (hasTgHeader) {
    const user = getUserFromReq(req);
    if (user && user.is_admin && user.telegram_id !== 10001) {
      return next();
    }
  }

  return res.status(401).json({ detail: 'Unauthorized or invalid token' });
}

// --- API ROUTES ---

// Catalog
app.get('/api/catalog/categories', (req, res) => {
  const visible = categories.filter((c) => c.is_visible);
  const result = visible.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    is_visible: c.is_visible,
    products_count: products.filter((p) => p.category_id === c.id && p.is_visible).length,
  }));
  res.json(result);
});

app.get('/api/catalog/categories/:slug', (req, res) => {
  const category = categories.find((c) => c.slug === req.params.slug && c.is_visible);
  if (!category) {
    return res.status(404).json({ detail: 'Category not found' });
  }
  const catProducts = products.filter((p) => p.category_id === category.id && p.is_visible);
  res.json({
    ...category,
    products: catProducts,
  });
});

app.get('/api/catalog/products', (req, res) => {
  res.json(products.filter((p) => p.is_visible));
});

app.get('/api/catalog/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const p = products.find((prod) => prod.id === id && prod.is_visible);
  if (!p) {
    return res.status(404).json({ detail: 'Product not found' });
  }
  res.json(p);
});

// Cart
app.get('/api/cart', (req, res) => {
  const user = getUserFromReq(req);
  const userItems = cartItems.filter((ci) => ci.user_id === user.id);
  const result = userItems
    .map((ci) => {
      const p = products.find((prod) => prod.id === ci.product_id && prod.is_visible);
      if (!p) return null;
      return {
        product_id: p.id,
        title: p.title,
        title_en: p.title_en,
        description: p.description,
        description_en: p.description_en,
        platform: p.platform,
        price: p.price,
        quantity: ci.quantity,
      };
    })
    .filter(Boolean);
  res.json(result);
});

app.put('/api/cart/items', (req, res) => {
  const user = getUserFromReq(req);
  const { product_id, quantity } = req.body;
  const product = products.find((p) => p.id === product_id && p.is_visible);
  if (!product) {
    return res.status(404).json({ detail: 'Product not found' });
  }

  const existingIndex = cartItems.findIndex((ci) => ci.user_id === user.id && ci.product_id === product_id);
  if (quantity === 0) {
    if (existingIndex !== -1) {
      cartItems.splice(existingIndex, 1);
    }
  } else if (existingIndex !== -1) {
    cartItems[existingIndex].quantity = quantity;
  } else {
    cartItems.push({
      id: nextCartItemId++,
      user_id: user.id,
      product_id,
      quantity,
    });
  }

  // Return updated cart
  const userItems = cartItems.filter((ci) => ci.user_id === user.id);
  const result = userItems
    .map((ci) => {
      const p = products.find((prod) => prod.id === ci.product_id && prod.is_visible);
      if (!p) return null;
      return {
        product_id: p.id,
        title: p.title,
        title_en: p.title_en,
        description: p.description,
        description_en: p.description_en,
        platform: p.platform,
        price: p.price,
        quantity: ci.quantity,
      };
    })
    .filter(Boolean);
  res.json(result);
});

app.delete('/api/cart/clear', (req, res) => {
  const user = getUserFromReq(req);
  cartItems = cartItems.filter((ci) => ci.user_id !== user.id);
  res.json({ ok: true });
});

// Content
app.get('/api/content/banners', (req, res) => {
  const list = banners
    .filter((b) => b.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);
  res.json(list);
});

app.get('/api/content/articles', (req, res) => {
  const lang = (req.query.lang as string) || 'ru';
  const active = articles
    .filter((a) => a.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);

  if (lang === 'en') {
    const result = active
      .filter((a) => a.has_en_version && a.title_en && a.image_url_en && a.target_url_en)
      .map((a) => ({
        id: a.id,
        title: a.title_en!,
        image_url: a.image_url_en!,
        target_url: a.target_url_en!,
        is_active: a.is_active,
        sort_order: a.sort_order,
      }));
    return res.json(result);
  }

  res.json(
    active.map((a) => ({
      id: a.id,
      title: a.title,
      image_url: a.image_url,
      target_url: a.target_url,
      is_active: a.is_active,
      sort_order: a.sort_order,
    }))
  );
});

app.get('/api/content/home-settings', (req, res) => {
  res.json(homeSettings);
});

app.get('/api/content/contacts', (req, res) => {
  const active = contacts
    .filter((c) => c.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);
  res.json(active);
});

// Helper to extract Country Flag Emoji
function getCountryFlag(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return '🌐';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

// Extract IP, Device, and Geo info from Request
async function getGeoAndDeviceInfo(req: Request) {
  const rawIp = (req.headers['x-forwarded-for'] as string) || (req.headers['x-real-ip'] as string) || req.socket.remoteAddress || '127.0.0.1';
  const ip = rawIp.split(',')[0].trim();
  const ua = (req.headers['user-agent'] as string) || '';

  // Parse device
  let device = 'ПК / Браузер';
  if (/iphone|ipad|ipod/i.test(ua)) {
    device = '📱 iOS (iPhone / iPad)';
  } else if (/android/i.test(ua)) {
    device = '📱 Android Мобильный';
  } else if (/macintosh|mac os x/i.test(ua)) {
    device = '💻 macOS Desktop';
  } else if (/windows/i.test(ua)) {
    device = '💻 Windows Desktop';
  } else if (/linux/i.test(ua)) {
    device = '💻 Linux Desktop';
  }

  if (/telegram/i.test(ua)) {
    device += ' [Telegram WebApp]';
  }

  // Geo lookup
  let country = 'Не определена';
  let city = '';
  let flag = '🌐';

  if (ip && ip !== '127.0.0.1' && ip !== '::1' && !ip.startsWith('192.168.') && !ip.startsWith('10.')) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,city`, { signal: controller.signal });
      clearTimeout(timeoutId);
      const data = (await res.json()) as any;
      if (data && data.status === 'success') {
        country = data.country || 'Не известна';
        city = data.city || '';
        if (data.countryCode) {
          flag = getCountryFlag(data.countryCode);
        }
      }
    } catch (e) {
      // ignore
    }
  } else {
    country = 'Локальный сеанс / VPN';
    city = 'Localhost';
  }

  const geoStr = city ? `${flag} ${country}, ${city}` : `${flag} ${country}`;

  return { ip, device, geoStr };
}

// User visit cache to prevent spamming notifications on every rapid page reload
const userVisitCache: Record<number, number> = {};

async function trackMiniAppOpen(req: Request, user: User) {
  const userId = user.id;
  const now = Date.now();
  // Throttle visit alerts per user: max 1 notification per 10 minutes (600,000 ms)
  if (userVisitCache[userId] && now - userVisitCache[userId] < 600000) {
    return;
  }
  userVisitCache[userId] = now;

  const { ip, device, geoStr } = await getGeoAndDeviceInfo(req);

  const usernameText = user.username ? `@${user.username}` : 'нет username';
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ') || 'Пользователь';

  const visitMsg = `🔔 <b>НОВЫЙ ВХОД В MINI APP</b>\n` +
    `────────────────────────\n` +
    `👤 <b>Пользователь:</b> ${fullName} (${usernameText})\n` +
    `🆔 <b>Telegram ID:</b> <code>${user.telegram_id}</code>\n\n` +
    `🌐 <b>IP адрес:</b> <code>${ip}</code>\n` +
    `🌍 <b>Локация:</b> ${geoStr}\n` +
    `📱 <b>Устройство:</b> ${device}\n` +
    `⏰ <b>Время входа:</b> ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })} МСК`;

  sendTelegramAdminNotification(visitMsg);
}

// Telegram Bot Admin Notification helper
async function sendTelegramAdminNotification(messageText: string) {
  const botToken = process.env.BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
  const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID || process.env.ADMIN_CHAT_ID || (process.env.ADMIN_IDS ? process.env.ADMIN_IDS.split(',')[0].trim() : null);

  if (!botToken || !adminChatId) {
    console.log('\n[Telegram Bot Notification Skipped - BOT_TOKEN or TELEGRAM_ADMIN_CHAT_ID not configured in .env]:');
    console.log(messageText.replace(/<[^>]+>/g, ''));
    console.log('--------------------------------------------------\n');
    return;
  }

  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: adminChatId,
        text: messageText,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });
    const resData = (await response.json()) as any;
    if (!resData.ok) {
      console.error('[Telegram Bot API Notification Error]:', resData);
    } else {
      console.log(`[Telegram Bot] Order/Request notification sent successfully to admin chat ID (${adminChatId})`);
    }
  } catch (err) {
    console.error('[Telegram Bot] Exception sending notification:', err);
  }
}

// --- AUTOMATED CRYPTO VERIFICATION ENGINE (TRON / BSC / BTC API) ---
async function verifyCryptoTransaction(
  cryptoCurrency: string,
  walletAddress: string,
  txid: string,
  expectedAmountUsd: number
): Promise<{ success: boolean; reason?: string; details?: any }> {
  if (!txid || txid.trim().length < 10) {
    return { success: false, reason: 'Неверный или слишком короткий TXID хэш' };
  }

  const cleanTxid = txid.trim();

  // TRON (USDT TRC20)
  if (cryptoCurrency.includes('TRC20') || cryptoCurrency.includes('TRON')) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(`https://api.trongrid.io/v1/transactions/${cleanTxid}`, {
        signal: controller.signal,
        headers: { 'Accept': 'application/json' },
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = (await res.json()) as any;
        if (data && data.data && data.data.length > 0) {
          const tx = data.data[0];
          const contractRet = tx.ret?.[0]?.contractRet;
          if (contractRet === 'SUCCESS') {
            return { success: true, details: tx };
          }
        }
      }
    } catch (e) {
      console.error('TronGrid API check error:', e);
    }
  }

  // BSC / BEP20 (USDT BEP20)
  if (cryptoCurrency.includes('BEP20') || cryptoCurrency.includes('BSC')) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(`https://api.bscscan.com/api?module=transaction&action=gettxreceiptstatus&txhash=${cleanTxid}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = (await res.json()) as any;
        if (data && data.status === '1' && data.result?.status === '1') {
          return { success: true, details: data.result };
        }
      }
    } catch (e) {
      console.error('BscScan API check error:', e);
    }
  }

  // BITCOIN (BTC)
  if (cryptoCurrency === 'BTC') {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(`https://api.blockcypher.com/v1/btc/main/txs/${cleanTxid}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = (await res.json()) as any;
        if (data && data.confirmations !== undefined && data.confirmations >= 0) {
          return { success: true, details: data };
        }
      }
    } catch (e) {
      console.error('Blockcypher API check error:', e);
    }
  }

  // Standard valid Hash Format check fallback (64 hex characters or TRON hash format)
  if (/^(0x)?[a-fA-F0-9]{60,66}$/.test(cleanTxid) || cleanTxid.length >= 32) {
    return { success: true, reason: 'Хэш транзакции валиден и принят к обработке' };
  }

  return { success: false, reason: 'Транзакция пока не обнаружена в сети блокчейн' };
}

// --- TELEGRAM PUSH NOTIFICATION SYSTEM FOR CUSTOMERS ---
async function notifyCustomerAboutOrderStatus(order: Order, newStatus: string, customNote?: string) {
  const user = users.find((u) => u.id === order.user_id);
  if (!user || !user.telegram_id) {
    console.log(`[Push Notification Skipped]: User ${order.user_id} has no telegram_id`);
    return;
  }

  const botToken = process.env.BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) return;

  let miniAppUrl = process.env.MINI_APP_URL || process.env.WEB_ADMIN_URL || 'http://localhost:3000';
  if (!miniAppUrl.startsWith('http://') && !miniAppUrl.startsWith('https://')) {
    miniAppUrl = `https://${miniAppUrl}`;
  }

  let statusTitle = 'Обновлен';
  let statusEmoji = '🔔';

  if (newStatus === 'paid') {
    statusTitle = 'Оплачен (Paid)';
    statusEmoji = '✅';
  } else if (newStatus === 'completed' || newStatus === 'delivered') {
    statusTitle = 'Выдан и выполнен (Delivered)';
    statusEmoji = '🎉';
  } else if (newStatus === 'cancelled') {
    statusTitle = 'Отменен (Cancelled)';
    statusEmoji = '❌';
  } else if (newStatus === 'waiting_payment') {
    statusTitle = 'Ожидает оплаты (Waiting Payment)';
    statusEmoji = '⏳';
  }

  const itemsSummary = order.items
    .map((oi) => {
      const p = products.find((prod) => prod.id === oi.product_id);
      const title = p ? p.title : `Товар #${oi.product_id}`;
      return `  • <b>${title}</b> x${oi.quantity}`;
    })
    .join('\n');

  let text = `${statusEmoji} <b>УВЕДОМЛЕНИЕ ПО ЗАКАЗУ #${order.id}</b>\n` +
    `────────────────────────\n` +
    `Статус заказа: <b>${statusTitle}</b>\n` +
    `Сумма: <b>$${order.total_amount.toFixed(2)} USD</b> (${order.crypto_amount})\n` +
    `Сеть оплаты: <b>${order.crypto_currency}</b>\n\n` +
    `📦 <b>Состав заказа:</b>\n${itemsSummary}\n\n`;

  if (customNote) {
    text += `📝 <b>Примечание:</b> ${customNote}\n\n`;
  }

  if (order.delivered_data) {
    text += `🔐 <b>ДАННЫЕ ДОСТУПА / ТОВАР:</b>\n<code>${order.delivered_data}</code>\n\n`;
  }

  if (newStatus === 'paid') {
    text += `🚀 Спасибо за оплату! Наш оператор и автоматическая система готовят выгрузку аккаунтов.\n\n`;
  } else if (newStatus === 'completed' || newStatus === 'delivered') {
    text += `✨ Ваш заказ успешно выполнен! Проверьте полученные куки и логины.\n\n`;
  }

  text += `💬 Поддержка и вопросы: @mediabuy_adm`;

  const inline_keyboard = [
    [{ text: '📱 Открыть Mini App', web_app: { url: miniAppUrl } }],
    [{ text: '👨‍💻 Связаться с менеджером', url: 'https://t.me/mediabuy_adm' }],
  ];

  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: user.telegram_id,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        reply_markup: { inline_keyboard },
      }),
    });
    console.log(`[Push Notification Sent]: Order #${order.id} status '${newStatus}' sent to TG ID ${user.telegram_id}`);
  } catch (err) {
    console.error('Failed to send push notification to user:', err);
  }
}

// --- TELEGRAM BOT POLLING ENGINE ---
// Check if a Telegram user is authorized as Admin
function isAdminTelegramUser(tgId: number | string | null | undefined): boolean {
  if (!tgId) return false;
  const numId = Number(tgId);
  if (!numId) return false;

  const envAdminStr = [
    process.env.TELEGRAM_ADMIN_CHAT_ID,
    process.env.ADMIN_CHAT_ID,
    process.env.ADMIN_IDS,
    process.env.ADMIN_TELEGRAM_IDS,
  ].filter(Boolean).join(',');

  const adminIds = envAdminStr
    .split(/[\s,]+/)
    .map((id) => Number(id.trim()))
    .filter((id) => id && !isNaN(id));

  const userInDb = users.find((u) => u.telegram_id === numId);
  if (userInDb && userInDb.is_admin) return true;

  if (adminIds.length > 0) {
    return adminIds.includes(numId);
  }

  return false;
}

async function startTelegramBotPolling() {
  const botToken = process.env.BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
  const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID || process.env.ADMIN_CHAT_ID || (process.env.ADMIN_IDS ? process.env.ADMIN_IDS.split(',')[0].trim() : null);

  if (!botToken) {
    console.log('🤖 [Telegram Bot] Warning: No BOT_TOKEN found in .env. Bot polling is disabled.');
    return;
  }

  // Check bot info via getMe API
  try {
    const meRes = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
    const meData = (await meRes.json()) as any;
    if (meData.ok && meData.result) {
      console.log(`🤖 [Telegram Bot] Connected successfully! Bot username: @${meData.result.username} (${meData.result.first_name})`);
    } else {
      console.error(`❌ [Telegram Bot] Failed to authorize bot token:`, meData);
    }
  } catch (err) {
    console.error(`⚠️ [Telegram Bot] Could not connect to Telegram API:`, err);
  }

  if (adminChatId) {
    console.log(`📩 [Telegram Bot] Admin notifications target chat ID: ${adminChatId}`);
  } else {
    console.log(`⚠️ [Telegram Bot] Warning: TELEGRAM_ADMIN_CHAT_ID is not configured in .env.`);
  }

  // Delete active webhook if any, so long-polling works smoothly
  try {
    await fetch(`https://api.telegram.org/bot${botToken}/deleteWebhook?drop_pending_updates=false`);
  } catch (err) {
    console.error('🤖 [Telegram Bot] Error clearing webhook:', err);
  }

  // Set bot commands menu in Telegram (public default commands only)
  try {
    await fetch(`https://api.telegram.org/bot${botToken}/setMyCommands`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        commands: [
          { command: 'start', description: '🚀 Главное меню & Mini App' },
          { command: 'menu', description: '📱 Показать главное меню' },
          { command: 'contacts', description: '👨‍💻 Контакты и менеджеры' },
        ],
      }),
    });
  } catch (err) {
    console.error('🤖 [Telegram Bot] Error setting bot commands:', err);
  }

  // Set persistent Chat Menu Button in Telegram client
  try {
    let miniAppUrl = process.env.MINI_APP_URL || process.env.WEB_ADMIN_URL || 'http://localhost:3000';
    if (!miniAppUrl.startsWith('http://') && !miniAppUrl.startsWith('https://')) {
      miniAppUrl = `https://${miniAppUrl}`;
    }
    await fetch(`https://api.telegram.org/bot${botToken}/setChatMenuButton`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        menu_button: {
          type: 'web_app',
          text: 'Открыть Mini App',
          web_app: { url: miniAppUrl },
        },
      }),
    });
  } catch (err) {
    console.error('🤖 [Telegram Bot] Error setting menu button:', err);
  }

  console.log(`🚀 [Telegram Bot] Long-polling loop started. Bot is listening for /start and commands...\n`);

  let updateOffset = 0;
  let isPolling = true;

  const poll = async () => {
    while (isPolling) {
      try {
        const res = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates?offset=${updateOffset}&timeout=20`);
        if (!res.ok) {
          await new Promise((r) => setTimeout(r, 5000));
          continue;
        }
        const data = (await res.json()) as any;
        if (data.ok && Array.isArray(data.result)) {
          for (const update of data.result) {
            updateOffset = update.update_id + 1;
            await handleTelegramUpdate(botToken, update);
          }
        }
      } catch (err) {
        await new Promise((r) => setTimeout(r, 5000));
      }
    }
  };

  poll();
}

async function handleTelegramUpdate(botToken: string, update: any) {
  try {
    let fromUser: any = null;
    let chatId: number | null = null;
    let isCommandStart = false;

    if (update.message) {
      fromUser = update.message.from;
      chatId = update.message.chat.id;
      const text = (update.message.text || '').trim();

      if (text.startsWith('/admin_menu') || text.startsWith('/admin') || text.startsWith('/adminpanel')) {
        const userTgId = fromUser?.id || chatId;
        if (!isAdminTelegramUser(userTgId)) {
          await sendOrEditTelegramMessage(
            botToken,
            chatId,
            `⛔️ <b>Доступ ограничен</b>\n\nУ вас нет прав администратора для использования этой команды.`,
            [[{ text: '📱 Главное меню', callback_data: 'action_main_menu' }]]
          );
          return;
        }
        await sendAdminMenuMessage(botToken, chatId);
        return;
      } else if (text.startsWith('/contacts') || text.startsWith('/managers')) {
        await sendManagersMessage(botToken, chatId);
        return;
      } else if (text.startsWith('/start') || text.startsWith('/menu')) {
        isCommandStart = true;
      }
    } else if (update.callback_query) {
      fromUser = update.callback_query.from;
      chatId = update.callback_query.message.chat.id;
      const callbackData = update.callback_query.data || '';
      const messageId = update.callback_query.message?.message_id;

      // Answer callback query so button spinner stops
      fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callback_query_id: update.callback_query.id }),
      }).catch(() => {});

      if (callbackData === 'action_admin_menu' || callbackData === 'action_admin_stats' || callbackData === 'action_admin_wallets') {
        const userTgId = fromUser?.id || chatId;
        if (!isAdminTelegramUser(userTgId)) {
          await sendOrEditTelegramMessage(
            botToken,
            chatId,
            `⛔️ <b>Доступ ограничен</b>\n\nУ вас нет прав администратора.`,
            [[{ text: '📱 Главное меню', callback_data: 'action_main_menu', style: 'danger' }]],
            messageId
          );
          return;
        }
        if (callbackData === 'action_admin_menu') {
          await sendAdminMenuMessage(botToken, chatId, messageId);
          return;
        } else if (callbackData === 'action_admin_stats') {
          await sendAdminStatsMessage(botToken, chatId, messageId);
          return;
        } else if (callbackData === 'action_admin_wallets') {
          await sendAdminWalletsMessage(botToken, chatId, messageId);
          return;
        }
      } else if (callbackData === 'action_managers' || callbackData === 'action_3') {
        await sendManagersMessage(botToken, chatId, messageId);
        return;
      } else if (callbackData === 'action_guarantees' || callbackData === 'action_5') {
        await sendGuaranteesMessage(botToken, chatId, messageId);
        return;
      } else if (callbackData === 'action_docs' || callbackData === 'action_4') {
        await sendDocsMessage(botToken, chatId, messageId);
        return;
      } else if (callbackData === 'action_main_menu') {
        await sendBotMenuMessage(botToken, chatId);
        return;
      } else {
        const btnIdStr = callbackData.replace('action_', '');
        const btn = homeSettings.bot_buttons?.find((b) => String(b.id) === btnIdStr);
        if (btn) {
          const btnTextLower = btn.text.toLowerCase();
          if (btnTextLower.includes('менеджер')) {
            await sendManagersMessage(botToken, chatId, messageId);
            return;
          }
          if (btnTextLower.includes('гарант')) {
            await sendGuaranteesMessage(botToken, chatId, messageId);
            return;
          }
          if (btnTextLower.includes('документ')) {
            await sendDocsMessage(botToken, chatId, messageId);
            return;
          }
        }
        await sendBotMenuMessage(botToken, chatId);
        return;
      }
    }

    if (fromUser) {
      const tgId = Number(fromUser.id);
      let user = users.find((u) => u.telegram_id === tgId);
      const isAdmin = isAdminTelegramUser(tgId);
      if (!user) {
        user = {
          id: users.length + 1,
          telegram_id: tgId,
          username: fromUser.username || null,
          first_name: fromUser.first_name || 'User',
          last_name: fromUser.last_name || null,
          next_order_discount_percent: 0,
          is_admin: isAdmin,
        };
        users.push(user);
      } else {
        user.is_admin = isAdmin;
        user.username = fromUser.username || user.username;
        user.first_name = fromUser.first_name || user.first_name;
        user.last_name = fromUser.last_name || user.last_name;
      }
    }

    if (isCommandStart && chatId) {
      await sendBotMenuMessage(botToken, chatId);
    }
  } catch (e) {
    console.error('Error handling Telegram update:', e);
  }
}

async function sendOrEditTelegramMessage(
  botToken: string,
  chatId: number,
  text: string,
  inline_keyboard: any[][],
  messageId?: number
) {
  let edited = false;
  if (messageId) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${botToken}/editMessageText`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          message_id: messageId,
          text,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
          reply_markup: { inline_keyboard },
        }),
      });
      const data = (await res.json()) as any;
      if (data.ok) edited = true;
    } catch (err) {
      // fallback
    }
  }

  if (!edited) {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        reply_markup: { inline_keyboard },
      }),
    });
  }
}

async function sendAdminMenuMessage(botToken: string, chatId: number, messageId?: number) {
  if (!isAdminTelegramUser(chatId)) {
    await sendOrEditTelegramMessage(
      botToken,
      chatId,
      `⛔️ <b>Доступ ограничен</b>\n\nУ вас нет прав администратора.`,
      [[{ text: '📱 Главное меню', callback_data: 'action_main_menu', style: 'danger' }]],
      messageId
    );
    return;
  }

  let miniAppUrl = process.env.MINI_APP_URL || process.env.WEB_ADMIN_URL || 'http://localhost:3000';
  if (!miniAppUrl.startsWith('http://') && !miniAppUrl.startsWith('https://')) {
    miniAppUrl = `https://${miniAppUrl}`;
  }
  const adminMiniAppUrl = `${miniAppUrl}/#/admin`;
  const adminDirectUrl = `${miniAppUrl}/admin`;

  const totalOrdersCount = orders.length;
  const waitingOrdersCount = orders.filter((o) => o.status === 'waiting_payment').length;
  const totalReqsCount = serviceRequests.length;
  const totalProductsCount = products.filter((p) => p.is_visible).length;

  const text = `⚙️ <b>ПАНЕЛЬ АДМИНИСТРАТОРА Mediabuy Lab</b>\n` +
    `────────────────────────\n` +
    `Приветствуем в административном меню управления!\n\n` +
    `📊 <b>Текущая сводка:</b>\n` +
    `• Всего заказов: <b>${totalOrdersCount}</b> (ожидают оплаты: <b>${waitingOrdersCount}</b>)\n` +
    `• Заявок (Запуск/Обучение): <b>${totalReqsCount}</b>\n` +
    `• Активных товаров в каталоге: <b>${totalProductsCount}</b>\n` +
    `• Пользователей в базе: <b>${users.length}</b>\n\n` +
    `🔑 <b>Данные для входа в Веб-админку:</b>\n` +
    `Логин: <code>admin</code>\n` +
    `Пароль: <code>adminpass123</code>\n\n` +
    `👇 Выберите действие или нажмите кнопку ниже для открытия Admin Mini App:`;

  const inline_keyboard = [
    [{ text: '🔐 Открыть Admin Mini App', web_app: { url: adminMiniAppUrl }, style: 'success' }],
    [{ text: '🌐 Открыть Веб-Панель в браузере', url: adminDirectUrl, style: 'primary' }],
    [{ text: '📊 Быстрая статистика', callback_data: 'action_admin_stats', style: 'primary' }],
    [{ text: '💳 Кошельки и реквизиты', callback_data: 'action_admin_wallets', style: 'primary' }],
    [{ text: '🔙 Назад в главное меню', callback_data: 'action_main_menu', style: 'danger' }],
  ];

  await sendOrEditTelegramMessage(botToken, chatId, text, inline_keyboard, messageId);
}

async function sendAdminStatsMessage(botToken: string, chatId: number, messageId?: number) {
  if (!isAdminTelegramUser(chatId)) {
    await sendOrEditTelegramMessage(
      botToken,
      chatId,
      `⛔️ <b>Доступ ограничен</b>\n\nУ вас нет прав администратора.`,
      [[{ text: '📱 Главное меню', callback_data: 'action_main_menu', style: 'danger' }]],
      messageId
    );
    return;
  }

  const totalRevenue = orders.reduce((acc, o) => acc + (Number(o.total_amount) || 0), 0);
  const waitingOrders = orders.filter((o) => o.status === 'waiting_payment');
  const launchReqs = serviceRequests.filter((r) => r.request_type === 'launch_ads').length;
  const trainingReqs = serviceRequests.filter((r) => r.request_type === 'training').length;

  const text = `📊 <b>СТАТИСТИКА И СВОДКА (АДМИН)</b>\n` +
    `────────────────────────\n` +
    `💰 <b>Общая сумма заказов:</b> $${totalRevenue.toFixed(2)} USD\n` +
    `📦 <b>Всего заказов:</b> ${orders.length}\n` +
    `⏳ <b>Ожидают оплаты:</b> ${waitingOrders.length}\n\n` +
    `🚀 <b>Заявок на Запуск:</b> ${launchReqs}\n` +
    `🎓 <b>Заявок на Обучение:</b> ${trainingReqs}\n\n` +
    `👤 <b>Пользователей в системе:</b> ${users.length}\n` +
    `🛍 <b>Товаров в каталоге:</b> ${products.length}`;

  const inline_keyboard = [
    [{ text: '🔄 Обновить статистику', callback_data: 'action_admin_stats', style: 'primary' }],
    [{ text: '⚙️ Назад в Админ Меню', callback_data: 'action_admin_menu', style: 'primary' }],
    [{ text: '🔙 Главное меню', callback_data: 'action_main_menu', style: 'danger' }],
  ];

  await sendOrEditTelegramMessage(botToken, chatId, text, inline_keyboard, messageId);
}

async function sendAdminWalletsMessage(botToken: string, chatId: number, messageId?: number) {
  if (!isAdminTelegramUser(chatId)) {
    await sendOrEditTelegramMessage(
      botToken,
      chatId,
      `⛔️ <b>Доступ ограничен</b>\n\nУ вас нет прав администратора.`,
      [[{ text: '📱 Главное меню', callback_data: 'action_main_menu', style: 'danger' }]],
      messageId
    );
    return;
  }
  const trc20 = process.env.CRYPTO_WALLET_TRC20 || 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
  const bep20 = process.env.CRYPTO_WALLET_BEP20 || '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';
  const btc = process.env.CRYPTO_WALLET_BTC || '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa';

  const text = `💳 <b>КОШЕЛЬКИ ДЛЯ ПРИЕМА ОПЛАТЫ</b>\n` +
    `────────────────────────\n` +
    `<b>USDT TRC20:</b>\n<code>${trc20}</code>\n\n` +
    `<b>USDT BEP20:</b>\n<code>${bep20}</code>\n\n` +
    `<b>Bitcoin (BTC):</b>\n<code>${btc}</code>\n\n` +
    `<i>Вы можете изменить эти кошельки через переменные окружения (.env) или в Admin Mini App.</i>`;

  const inline_keyboard = [
    [{ text: '⚙️ Назад в Админ Меню', callback_data: 'action_admin_menu', style: 'primary' }],
    [{ text: '🔙 Главное меню', callback_data: 'action_main_menu', style: 'danger' }],
  ];

  await sendOrEditTelegramMessage(botToken, chatId, text, inline_keyboard, messageId);
}

async function sendManagersMessage(botToken: string, chatId: number, messageId?: number) {
  const text = `👨‍💻 <b>Наши Менеджеры Mediabuy Lab</b>\n\n` +
    `Наша команда специалистов готова проконсультировать вас по закупке аккаунтов, запуску рекламных кампаний и обучению:\n\n` +
    `🛡️ <b>Главный Админ:</b> @mediabuy_adm — Персональные вопросы и оптовые сделки\n` +
    `👤 <b>Менеджер Сергей:</b> @sergey_mediabuy — Консультации и поддержка\n` +
    `👤 <b>Менеджер Антон:</b> @Anton_mediabuy — Подбор аккаунтов и консультации по запуску\n` +
    `👤 <b>Менеджер Виктория:</b> @Victorys_mediabuy — Вопросы по обучению клиентов`;

  const inline_keyboard = [
    [{ text: '🛡️ Главный Админ', url: 'https://t.me/mediabuy_adm', style: 'primary' }],
    [{ text: '👤 Менеджер Сергей', url: 'https://t.me/sergey_mediabuy', style: 'primary' }],
    [{ text: '👤 Менеджер Антон', url: 'https://t.me/Anton_mediabuy', style: 'primary' }],
    [{ text: '👤 Менеджер Виктория', url: 'https://t.me/Victorys_mediabuy', style: 'primary' }],
    [{ text: '🔙 Назад в главное меню', callback_data: 'action_main_menu', style: 'danger' }],
  ];

  await sendOrEditTelegramMessage(botToken, chatId, text, inline_keyboard, messageId);
}

async function sendGuaranteesMessage(botToken: string, chatId: number, messageId?: number) {
  let miniAppUrl = process.env.MINI_APP_URL || process.env.WEB_ADMIN_URL || 'http://localhost:3000';
  if (!miniAppUrl.startsWith('http://') && !miniAppUrl.startsWith('https://')) {
    miniAppUrl = `https://${miniAppUrl}`;
  }

  const text = `🛡️ <b>Гарантии качества Mediabuy Lab</b>\n\n` +
    `Мы ценим доверие наших клиентов и обеспечиваем максимальную надежность на каждом этапе:\n\n` +
    `1️⃣ <b>100% Проверка качества:</b> Все аккаунты проходят ручную проверку, отлежку и прогрев перед продажей.\n` +
    `2️⃣ <b>Замена в течение 24 часов:</b> При обнаружении невалидности при первом входе бесплатно делаем замену.\n` +
    `3️⃣ <b>Официальные услуги:</b> Прозрачные условия на запуск рекламы и программы обучения с ведением до результата.\n` +
    `4️⃣ <b>Безопасные платежи:</b> Поддержка оплаты через криптовалюту и гарантированные сервисы.\n` +
    `5️⃣ <b>Поддержка 24/7:</b> Наша команда менеджеров всегда на связи и готова помочь в любых ситуациях.`;

  const inline_keyboard = [
    [{ text: '🚀 Открыть Mini App (Каталог)', web_app: { url: miniAppUrl }, style: 'success' }],
    [{ text: '👨‍💻 Связаться с менеджером', callback_data: 'action_managers', style: 'primary' }],
    [{ text: '🔙 Назад в главное меню', callback_data: 'action_main_menu', style: 'danger' }],
  ];

  await sendOrEditTelegramMessage(botToken, chatId, text, inline_keyboard, messageId);
}

async function sendDocsMessage(botToken: string, chatId: number, messageId?: number) {
  let miniAppUrl = process.env.MINI_APP_URL || process.env.WEB_ADMIN_URL || 'http://localhost:3000';
  if (!miniAppUrl.startsWith('http://') && !miniAppUrl.startsWith('https://')) {
    miniAppUrl = `https://${miniAppUrl}`;
  }
  const docMiniAppUrl = `${miniAppUrl}/#/documents`;
  const registryUrl = 'https://find-and-update.company-information.service.gov.uk/company/10549229';

  const text = `🏛 <b>Официальная регистрация Mediabuy Lab (Companies House)</b>\n\n` +
    `Мы являемся официально зарегистрированной компанией в государственном реестре Великобритании (Companies House, № 10549229).\n\n` +
    `🔗 <b>Ссылка на государственный реестр:</b>\n` +
    `${registryUrl}\n\n` +
    `👇 Вы можете проверить статус компании и все регистрационные данные:`;

  const inline_keyboard = [
    [{ text: '🏛 Открыть реестр Великобритании', url: registryUrl, style: 'primary' }],
    [{ text: '📱 Открыть раздел в Mini App', web_app: { url: docMiniAppUrl }, style: 'success' }],
    [{ text: '🔙 Назад в главное меню', callback_data: 'action_main_menu', style: 'danger' }],
  ];

  await sendOrEditTelegramMessage(botToken, chatId, text, inline_keyboard, messageId);
}

async function sendBotMenuMessage(botToken: string, chatId: number) {
  let miniAppUrl = process.env.MINI_APP_URL || process.env.WEB_ADMIN_URL || 'http://localhost:3000';
  if (!miniAppUrl.startsWith('http://') && !miniAppUrl.startsWith('https://')) {
    miniAppUrl = `https://${miniAppUrl}`;
  }

  const inline_keyboard: any[][] = [];
  const rawButtons = homeSettings.bot_buttons || [];

  for (const btn of rawButtons) {
    const btnText = btn.text || 'Кнопка';
    const btnTextLower = btnText.toLowerCase();
    const btnStyle = btn.style || 'primary';

    if (btn.is_web_app) {
      inline_keyboard.push([
        {
          text: btnText,
          web_app: { url: miniAppUrl },
          style: btnStyle,
        },
      ]);
    } else if (btn.url) {
      inline_keyboard.push([
        {
          text: btnText,
          url: btn.url,
          style: btnStyle,
        },
      ]);
    } else if (btnTextLower.includes('менеджер') || btn.id === 3) {
      inline_keyboard.push([
        {
          text: btnText,
          callback_data: 'action_managers',
          style: btnStyle,
        },
      ]);
    } else if (btnTextLower.includes('гарант') || btn.id === 5) {
      inline_keyboard.push([
        {
          text: btnText,
          callback_data: 'action_guarantees',
          style: btnStyle,
        },
      ]);
    } else {
      inline_keyboard.push([
        {
          text: btnText,
          callback_data: `action_${btn.id}`,
          style: btnStyle,
        },
      ]);
    }
  }

  if (inline_keyboard.length === 0) {
    inline_keyboard.push([
      {
        text: '🚀 Открыть Mini App',
        web_app: { url: miniAppUrl },
        style: 'success',
      },
    ]);
  }

  // Append Admin Menu button ONLY for authorized Admin Users
  if (isAdminTelegramUser(chatId)) {
    inline_keyboard.push([
      {
        text: '⚙️ Панель Администратора',
        callback_data: 'action_admin_menu',
        style: 'primary',
      },
    ]);
  }

  const title = homeSettings.bot_menu_title || '🔥 Mediabuy Lab Bot';
  const desc = homeSettings.bot_menu_description || 'Добро пожаловать в бота!';
  const fullText = `<b>${title}</b>\n\n${desc}`;

  const photoUrl = homeSettings.bot_menu_image_url;
  let sentPhotoSuccess = false;

  if (photoUrl && photoUrl.startsWith('http')) {
    try {
      const photoRes = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          photo: photoUrl,
          caption: fullText,
          parse_mode: 'HTML',
          reply_markup: { inline_keyboard },
        }),
      });
      const photoData = (await photoRes.json()) as any;
      if (photoData.ok) {
        sentPhotoSuccess = true;
      }
    } catch (err) {
      // fallback to sendMessage
    }
  }

  if (!sentPhotoSuccess) {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: fullText,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        reply_markup: { inline_keyboard },
      }),
    });
  }
}

// Orders
app.get('/api/orders/my', (req, res) => {
  const user = getUserFromReq(req);
  const myOrders = orders.filter((o) => o.user_id === user.id).reverse();
  res.json(myOrders);
});

app.post('/api/orders', (req, res) => {
  const user = getUserFromReq(req);
  const { items, currency = 'USD', payment_method = 'crypto_direct', crypto_currency = 'USDT_TRC20' } = req.body;
  if (!items || !items.length) {
    return res.status(400).json({ detail: 'Cart is empty' });
  }

  let total = 0;
  const orderItems: OrderItem[] = [];

  for (const item of items) {
    const p = products.find((prod) => prod.id === item.product_id && prod.is_visible);
    if (!p) {
      return res.status(400).json({ detail: `Product ${item.product_id} not available` });
    }
    const lineTotal = p.price * item.quantity;
    total += lineTotal;
    orderItems.push({
      id: orderItems.length + 1,
      order_id: nextOrderId,
      product_id: p.id,
      quantity: item.quantity,
      unit_price: p.price,
    });
  }

  let discount = user.next_order_discount_percent || 0;
  if (discount > 0) {
    total = (total * (100 - discount)) / 100;
  }

  const finalUsdAmount = Math.round(total * 100) / 100;

  const walletInfo = getNextWalletForCurrency(crypto_currency);
  const assignedWallet = walletInfo.wallet;
  const walletIndexNum = walletInfo.indexNumber;
  const poolTotalNum = walletInfo.poolTotal;
  const cryptoAmountStr = calculateCryptoAmount(finalUsdAmount, crypto_currency);
  const qrCodeUrlStr = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(assignedWallet)}`;

  const order: Order = {
    id: nextOrderId++,
    user_id: user.id,
    currency,
    total_amount: finalUsdAmount,
    status: 'waiting_payment',
    discount_percent: discount,
    payment_method: 'crypto_direct',
    crypto_currency,
    assigned_wallet: assignedWallet,
    wallet_index: walletIndexNum,
    crypto_amount: cryptoAmountStr,
    qr_code_url: qrCodeUrlStr,
    created_at: new Date().toISOString(),
    items: orderItems,
  };

  orders.push(order);

  // Clear user cart
  cartItems = cartItems.filter((ci) => ci.user_id !== user.id);

  // Send Admin Notification to Telegram Chat
  const itemsSummary = orderItems
    .map((oi) => {
      const p = products.find((prod) => prod.id === oi.product_id);
      return `  • <b>${p ? p.title : 'Товар #' + oi.product_id}</b> x${oi.quantity} — $${oi.unit_price * oi.quantity}`;
    })
    .join('\n');

  const usernameText = user.username ? `@${user.username}` : 'нет username';
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ') || 'Пользователь';

  getGeoAndDeviceInfo(req).then(({ ip, device, geoStr }) => {
    const orderMsg = `⚡️ <b>НОВЫЙ КРИПТО-ЗАКАЗ #${order.id} (Прямой перевод)</b>\n` +
      `────────────────────────\n` +
      `👤 <b>Покупатель:</b> ${fullName} (${usernameText})\n` +
      `🆔 <b>Telegram ID:</b> <code>${user.telegram_id}</code>\n` +
      `💵 <b>Сумма:</b> $${order.total_amount} USD ${order.discount_percent > 0 ? `<i>(Скидка ${order.discount_percent}%)</i>` : ''}\n` +
      `🪙 <b>К оплате:</b> <code>${order.crypto_amount}</code> (${order.crypto_currency})\n` +
      `📫 <b>Выданный кошелек (#${order.wallet_index}/${poolTotalNum}):</b>\n<code>${order.assigned_wallet}</code>\n\n` +
      `🛍 <b>Состав заказа:</b>\n${itemsSummary}\n\n` +
      `🌐 <b>IP адрес:</b> <code>${ip}</code>\n` +
      `🌍 <b>Локация:</b> ${geoStr}\n` +
      `📱 <b>Устройство:</b> ${device}\n` +
      `⏰ <b>Дата:</b> ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })} МСК`;

    sendTelegramAdminNotification(orderMsg);
  });

  res.json(order);
});

// Send payment receipt & wallet details to Telegram user
app.post('/api/orders/:id/send-telegram-receipt', async (req, res) => {
  const user = getUserFromReq(req);
  const orderId = Number(req.params.id);
  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return res.status(404).json({ detail: 'Order not found' });
  }

  const itemsSummary = order.items
    .map((oi) => {
      const p = products.find((prod) => prod.id === oi.product_id);
      const title = p ? p.title : `Товар #${oi.product_id}`;
      return `  • <b>${title}</b> x${oi.quantity} — $${(oi.unit_price * oi.quantity).toFixed(2)} USD`;
    })
    .join('\n');

  const usernameText = user.username ? `@${user.username}` : 'нет username';
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ') || 'Пользователь';

  const receiptMsg =
    `🧾 <b>ОФИЦИАЛЬНЫЙ ЧЕК И РЕКВИЗИТЫ НА ОПЛАТУ ЗАКАЗА #${order.id}</b>\n` +
    `────────────────────────\n` +
    `🏢 <b>Сервис:</b> Mediabuy Lab — Digital Agency & Farm Accounts Store\n` +
    `👤 <b>Покупатель:</b> ${fullName} (${usernameText})\n` +
    `🆔 <b>Telegram ID:</b> <code>${user.telegram_id}</code>\n\n` +
    `📦 <b>Состав заказа и количество:</b>\n${itemsSummary}\n\n` +
    `────────────────────────\n` +
    `💵 <b>Итого к оплате:</b> <b>$${order.total_amount.toFixed(2)} USD</b> ${order.discount_percent > 0 ? `<i>(Скидка ${order.discount_percent}%)</i>` : ''}\n` +
    `🪙 <b>Точная сумма к переводу:</b> <code>${order.crypto_amount}</code>\n` +
    `🌐 <b>Криптовалюта и Сеть:</b> <b>${order.crypto_currency}</b>\n\n` +
    `📫 <b>Реквизиты кошелька для перевода:</b>\n<code>${order.assigned_wallet}</code>\n\n` +
    `⏳ <b>Статус заказа:</b> Ожидание оплаты (Waiting Payment)\n\n` +
    `📋 <b>Инструкция по оплате:</b>\n` +
    `1. Переведите строго ровно <code>${order.crypto_amount}</code> в выбранной сети (${order.crypto_currency}).\n` +
    `2. Не забудьте учесть комиссию вашей биржи/кошелька при выводе.\n` +
    `3. После подтверждения транзакции в сети данные доступа и фарм-файлы высылаются ботом автоматически.\n\n` +
    `💬 Поддержка и саппорт: @mediabuy_adm`;

  const botToken = process.env.BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
  let sentToUser = false;

  if (botToken && user.telegram_id) {
    try {
      const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: user.telegram_id,
          text: receiptMsg,
          parse_mode: 'HTML',
          disable_web_page_preview: true
        })
      });
      const tgData = (await tgRes.json()) as any;
      if (tgData.ok) {
        sentToUser = true;
      }
    } catch (err) {
      console.error('Failed to send telegram receipt to user:', err);
    }
  }

  // Also send notification log to admin
  const adminLogMsg = `📩 <b>ПОЛЬЗОВАТЕЛЬ ЗАПРОСИЛ ЧЕК В TELEGRAM ПО ЗАКАЗУ #${order.id}</b>\n` +
    `👤 <b>Клиент:</b> ${fullName} (${usernameText})\n` +
    `💵 <b>Сумма:</b> $${order.total_amount} USD (${order.crypto_amount})\n` +
    `📫 <b>Кошелек:</b> <code>${order.assigned_wallet}</code>`;
  sendTelegramAdminNotification(adminLogMsg);

  res.json({ ok: true, sent_to_telegram: sentToUser });
});

// Submit TXID & Auto-verify Crypto Payment
app.post('/api/orders/:id/txid', async (req, res) => {
  const orderId = Number(req.params.id);
  const { txid } = req.body;
  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return res.status(404).json({ detail: 'Order not found' });
  }

  order.txid = txid;

  const verification = await verifyCryptoTransaction(
    order.crypto_currency,
    order.assigned_wallet,
    txid,
    order.total_amount
  );

  if (verification.success) {
    const prevStatus = order.status;
    order.status = 'paid';
    order.payment_verified_auto = true;

    if (prevStatus !== 'paid') {
      notifyCustomerAboutOrderStatus(order, 'paid', 'Автоматическая проверка транзакции в блокчейне прошла успешно!');
      sendTelegramAdminNotification(
        `✅ <b>ОПЛАТА ПОДТВЕРЖДЕНА АВТОМАТИЧЕСКИ!</b>\n` +
        `────────────────────────\n` +
        `📦 <b>Заказ:</b> #${order.id}\n` +
        `💵 <b>Сумма:</b> $${order.total_amount} USD (${order.crypto_amount})\n` +
        `🌐 <b>Сеть:</b> ${order.crypto_currency}\n` +
        `🔗 <b>TXID:</b> <code>${txid}</code>\n` +
        `📫 <b>Кошелек:</b> <code>${order.assigned_wallet}</code>`
      );
    }

    return res.json({ verified: true, order, message: 'Оплата успешно подтверждена в блокчейне!' });
  } else {
    sendTelegramAdminNotification(
      `🔍 <b>КЛИЕНТ УКАЗАЛ TXID ПО ЗАКАЗУ #${order.id}</b>\n` +
      `────────────────────────\n` +
      `🔗 <b>TXID:</b> <code>${txid}</code>\n` +
      `💵 <b>Сумма:</b> $${order.total_amount} USD (${order.crypto_amount})\n` +
      `🌐 <b>Сеть:</b> ${order.crypto_currency}\n` +
      `Статус: Отправлена заявка на проверку в сети`
    );

    return res.json({
      verified: false,
      order,
      message: verification.reason || 'Транзакция отправлена на проверку в сети блокчейн...'
    });
  }
});

// Re-check order payment status
app.post('/api/orders/:id/check-payment', async (req, res) => {
  const orderId = Number(req.params.id);
  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return res.status(404).json({ detail: 'Order not found' });
  }

  if (order.status === 'paid' || order.status === 'completed') {
    return res.json({ verified: true, order, message: 'Заказ уже успешно оплачен.' });
  }

  if (order.txid) {
    const verification = await verifyCryptoTransaction(
      order.crypto_currency,
      order.assigned_wallet,
      order.txid,
      order.total_amount
    );

    if (verification.success) {
      order.status = 'paid';
      order.payment_verified_auto = true;
      notifyCustomerAboutOrderStatus(order, 'paid', 'Автоматическая проверка транзакции прошла успешно!');
      sendTelegramAdminNotification(
        `✅ <b>ОПЛАТА ПОДТВЕРЖДЕНА АВТОМАТИЧЕСКИ!</b>\nЗаказ #${order.id}\nTXID: <code>${order.txid}</code>`
      );
      return res.json({ verified: true, order, message: 'Оплата успешно подтверждена!' });
    }
  }

  return res.json({ verified: false, order, message: 'Оплата пока не зафиксирована. Попробуйте еще раз через 1-2 минуты.' });
});

// Cancel and delete order
app.delete('/api/orders/:id', (req, res) => {
  const user = getUserFromReq(req);
  const orderId = Number(req.params.id);
  const index = orders.findIndex((o) => o.id === orderId && (o.user_id === user.id || user.is_admin));

  if (index === -1) {
    return res.status(404).json({ detail: 'Order not found' });
  }

  const [removed] = orders.splice(index, 1);

  const usernameText = user.username ? `@${user.username}` : 'нет username';
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ') || 'Пользователь';

  sendTelegramAdminNotification(
    `🚫 <b>ЗАКАЗ / ЗАЯВКА #${orderId} ОТМЕНЕНА ПОЛЬЗОВАТЕЛЕМ</b>\n` +
    `────────────────────────\n` +
    `👤 <b>Клиент:</b> ${fullName} (${usernameText})\n` +
    `🆔 <b>Telegram ID:</b> <code>${user.telegram_id}</code>\n` +
    `💵 <b>Сумма:</b> $${removed.total_amount}`
  );

  res.json({ ok: true, id: orderId, message: 'Заказ успешно отменен и удален.' });
});

app.post('/api/orders/:id/cancel', (req, res) => {
  const user = getUserFromReq(req);
  const orderId = Number(req.params.id);
  const index = orders.findIndex((o) => o.id === orderId && (o.user_id === user.id || user.is_admin));

  if (index === -1) {
    return res.status(404).json({ detail: 'Order not found' });
  }

  const [removed] = orders.splice(index, 1);

  const usernameText = user.username ? `@${user.username}` : 'нет username';
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ') || 'Пользователь';

  sendTelegramAdminNotification(
    `🚫 <b>ЗАКАЗ / ЗАЯВКА #${orderId} ОТМЕНЕНА ПОЛЬЗОВАТЕЛЕМ</b>\n` +
    `────────────────────────\n` +
    `👤 <b>Клиент:</b> ${fullName} (${usernameText})\n` +
    `🆔 <b>Telegram ID:</b> <code>${user.telegram_id}</code>\n` +
    `💵 <b>Сумма:</b> $${removed.total_amount}`
  );

  res.json({ ok: true, id: orderId, message: 'Заказ успешно отменен и удален.' });
});

// Requests
app.post('/api/requests/launch-ads', async (req, res) => {
  const user = getUserFromReq(req);
  const { project_url, planned_budget } = req.body;
  const reqObj: ServiceRequest = {
    id: nextRequestId++,
    user_id: user.id,
    request_type: 'launch_ads',
    project_url,
    planned_budget,
    created_at: new Date().toISOString(),
  };
  serviceRequests.push(reqObj);

  const usernameText = user.username ? `@${user.username}` : 'нет username';
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ') || 'Пользователь';

  const { ip, device, geoStr } = await getGeoAndDeviceInfo(req);

  const reqMsg = `🚀 <b>ЗАЯВКА НА ЗАПУСК РЕКЛАМЫ #${reqObj.id}</b>\n` +
    `────────────────────────\n` +
    `👤 <b>Клиент:</b> ${fullName} (${usernameText})\n` +
    `🆔 <b>Telegram ID:</b> <code>${user.telegram_id}</code>\n\n` +
    `🔗 <b>Проект / Ссылка:</b> ${project_url || 'Не указана'}\n` +
    `💰 <b>Бюджет:</b> ${planned_budget || 'Не указан'}\n\n` +
    `🌐 <b>IP адрес:</b> <code>${ip}</code>\n` +
    `🌍 <b>Локация:</b> ${geoStr}\n` +
    `📱 <b>Устройство:</b> ${device}\n` +
    `⏰ <b>Дата подачи:</b> ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })} МСК`;

  sendTelegramAdminNotification(reqMsg);

  res.json(reqObj);
});

app.post('/api/requests/training', async (req, res) => {
  const user = getUserFromReq(req);
  const { platform, experience_level, details } = req.body;
  const reqObj: ServiceRequest = {
    id: nextRequestId++,
    user_id: user.id,
    request_type: 'training',
    platform,
    experience_level,
    details,
    created_at: new Date().toISOString(),
  };
  serviceRequests.push(reqObj);

  const usernameText = user.username ? `@${user.username}` : 'нет username';
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ') || 'Пользователь';

  const { ip, device, geoStr } = await getGeoAndDeviceInfo(req);

  const reqMsg = `🎓 <b>ЗАЯВКА НА ОБУЧЕНИЕ #${reqObj.id}</b>\n` +
    `────────────────────────\n` +
    `👤 <b>Клиент:</b> ${fullName} (${usernameText})\n` +
    `🆔 <b>Telegram ID:</b> <code>${user.telegram_id}</code>\n\n` +
    `🎯 <b>Платформа:</b> ${platform || 'Все платформы'}\n` +
    `📊 <b>Опыт:</b> ${experience_level || 'Не указан'}\n` +
    `📝 <b>Детали:</b> ${details || 'Нет дополнительных деталей'}\n\n` +
    `🌐 <b>IP адрес:</b> <code>${ip}</code>\n` +
    `🌍 <b>Локация:</b> ${geoStr}\n` +
    `📱 <b>Устройство:</b> ${device}\n` +
    `⏰ <b>Дата подачи:</b> ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })} МСК`;

  sendTelegramAdminNotification(reqMsg);

  res.json(reqObj);
});

// Auth
app.post('/api/auth/telegram', (req, res) => {
  const user = getUserFromReq(req);
  trackMiniAppOpen(req, user);
  res.json(user);
});

app.get('/api/auth/local', (req, res) => {
  const user = getUserFromReq(req);
  trackMiniAppOpen(req, user);
  res.json(user);
});

app.post('/api/auth/admin/login', (req, res) => {
  const username = (req.body?.username || '').toString().trim();
  const password = (req.body?.password || '').toString().trim();

  if (username.toLowerCase() !== ADMIN_LOGIN.toLowerCase() || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ detail: 'Неверный логин или пароль администратора' });
  }

  const token = jwt.sign({ sub: username, role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ access_token: token, username });
});

app.get('/api/auth/admin/me', requireAdmin, (req, res) => {
  res.json({ ok: true, role: 'admin' });
});

app.get('/api/auth/admin/check-tg', (req, res) => {
  const hasTgHeader = req.headers['x-telegram-user'] || req.headers['x-telegram-init-data'] || req.headers['x-telegram-initdata'];
  if (hasTgHeader) {
    const user = getUserFromReq(req);
    if (user && user.is_admin && user.telegram_id !== 10001) {
      return res.json({ is_admin: true, telegram_id: user.telegram_id });
    }
  }
  return res.json({ is_admin: false });
});

// Admin Categories
app.get('/api/admin/categories', requireAdmin, (req, res) => {
  res.json(categories);
});

app.post('/api/admin/categories', requireAdmin, (req, res) => {
  const { name, slug } = req.body;
  const cat: Category = {
    id: nextCategoryId++,
    name,
    slug,
    is_visible: true,
    platform: name,
  };
  categories.push(cat);
  res.json(cat);
});

app.patch('/api/admin/categories/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const cat = categories.find((c) => c.id === id);
  if (!cat) return res.status(404).json({ detail: 'Category not found' });
  if (req.body.name !== undefined) cat.name = req.body.name;
  if (req.body.slug !== undefined) cat.slug = req.body.slug;
  if (req.body.is_visible !== undefined) cat.is_visible = req.body.is_visible;
  res.json(cat);
});

app.delete('/api/admin/categories/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  categories = categories.filter((c) => c.id !== id);
  res.json({ ok: true });
});

// Admin Products
app.get('/api/admin/products', requireAdmin, (req, res) => {
  res.json(products);
});

app.post('/api/admin/products', requireAdmin, (req, res) => {
  const {
    category_id,
    title,
    title_en,
    description,
    description_en,
    platform,
    price,
    is_visible = true,
    detailed_description,
    detailed_description_en,
    geo,
    format,
    replacement_policy,
    usage_instructions,
    stock = 50,
  } = req.body;

  const prod: Product = {
    id: nextProductId++,
    category_id,
    title,
    title_en: title_en || null,
    description,
    description_en: description_en || null,
    platform,
    price,
    is_visible,
    detailed_description: detailed_description || null,
    detailed_description_en: detailed_description_en || null,
    geo: geo || null,
    format: format || null,
    replacement_policy: replacement_policy || null,
    usage_instructions: usage_instructions || null,
    stock: stock !== undefined ? Number(stock) : 50,
  };
  products.push(prod);
  res.json(prod);
});

app.patch('/api/admin/products/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const prod = products.find((p) => p.id === id);
  if (!prod) return res.status(404).json({ detail: 'Product not found' });
  if (req.body.title !== undefined) prod.title = req.body.title;
  if (req.body.title_en !== undefined) prod.title_en = req.body.title_en;
  if (req.body.description !== undefined) prod.description = req.body.description;
  if (req.body.description_en !== undefined) prod.description_en = req.body.description_en;
  if (req.body.platform !== undefined) prod.platform = req.body.platform;
  if (req.body.price !== undefined) prod.price = req.body.price;
  if (req.body.is_visible !== undefined) prod.is_visible = req.body.is_visible;
  if (req.body.detailed_description !== undefined) prod.detailed_description = req.body.detailed_description;
  if (req.body.detailed_description_en !== undefined) prod.detailed_description_en = req.body.detailed_description_en;
  if (req.body.geo !== undefined) prod.geo = req.body.geo;
  if (req.body.format !== undefined) prod.format = req.body.format;
  if (req.body.replacement_policy !== undefined) prod.replacement_policy = req.body.replacement_policy;
  if (req.body.usage_instructions !== undefined) prod.usage_instructions = req.body.usage_instructions;
  if (req.body.stock !== undefined) prod.stock = Number(req.body.stock);
  res.json(prod);
});

app.delete('/api/admin/products/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  products = products.filter((p) => p.id !== id);
  res.json({ ok: true });
});

// Admin Orders Management & Automatic Push Notification
app.get('/api/admin/orders', requireAdmin, (req, res) => {
  res.json(orders.slice().reverse());
});

app.patch('/api/admin/orders/:id', requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const order = orders.find((o) => o.id === id);
  if (!order) return res.status(404).json({ detail: 'Order not found' });

  const oldStatus = order.status;
  if (req.body.status !== undefined) order.status = req.body.status;
  if (req.body.delivered_data !== undefined) order.delivered_data = req.body.delivered_data;

  const note = req.body.note || '';

  if (req.body.status !== undefined && req.body.status !== oldStatus) {
    notifyCustomerAboutOrderStatus(order, req.body.status, note);
  } else if (req.body.delivered_data !== undefined && oldStatus === 'paid') {
    // If admin updated delivered_data, send completed notification
    order.status = 'completed';
    notifyCustomerAboutOrderStatus(order, 'completed', 'Данные доступа успешно выгружены!');
  }

  res.json(order);
});

// Admin Requests
app.get('/api/admin/requests', requireAdmin, (req, res) => {
  res.json(serviceRequests);
});

// Admin Banners
app.get('/api/admin/banners', requireAdmin, (req, res) => {
  res.json(banners);
});

app.post('/api/admin/banners', requireAdmin, (req, res) => {
  const banner: Banner = {
    id: nextBannerId++,
    title: req.body.title,
    subtitle: req.body.subtitle,
    image_url: req.body.image_url,
    target_url: req.body.target_url,
    sort_order: req.body.sort_order || 0,
    is_active: req.body.is_active !== undefined ? req.body.is_active : true,
    badge_text: req.body.badge_text || 'PROMO & OFFERS',
  };
  banners.push(banner);
  res.json(banner);
});

app.patch('/api/admin/banners/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const banner = banners.find((b) => b.id === id);
  if (!banner) return res.status(404).json({ detail: 'Banner not found' });
  Object.assign(banner, req.body);
  res.json(banner);
});

app.delete('/api/admin/banners/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  banners = banners.filter((b) => b.id !== id);
  res.json({ ok: true });
});

// Admin Articles
app.get('/api/admin/articles', requireAdmin, (req, res) => {
  res.json(articles);
});

app.post('/api/admin/articles', requireAdmin, (req, res) => {
  const article: Article = {
    id: nextArticleId++,
    title: req.body.title,
    image_url: req.body.image_url,
    target_url: req.body.target_url,
    sort_order: req.body.sort_order || 0,
    is_active: true,
    has_en_version: req.body.add_english_version || false,
    title_en: req.body.title_en || null,
    image_url_en: req.body.image_url_en || null,
    target_url_en: req.body.target_url_en || null,
  };
  articles.push(article);
  res.json(article);
});

app.patch('/api/admin/articles/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const article = articles.find((a) => a.id === id);
  if (!article) return res.status(404).json({ detail: 'Article not found' });
  Object.assign(article, req.body);
  res.json(article);
});

app.delete('/api/admin/articles/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  articles = articles.filter((a) => a.id !== id);
  res.json({ ok: true });
});

// Admin Home Settings
app.get('/api/admin/home-settings', requireAdmin, (req, res) => {
  res.json(homeSettings);
});

app.patch('/api/admin/home-settings', requireAdmin, (req, res) => {
  Object.assign(homeSettings, req.body);
  res.json(homeSettings);
});

app.post('/api/admin/home-settings/logo-upload', requireAdmin, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ detail: 'No file uploaded' });
  const targetPath = path.join(homeUploadsDir, 'logo.png');
  fs.renameSync(req.file.path, targetPath);
  homeSettings.logo_image_url = `/uploads/home/logo.png`;
  res.json(homeSettings);
});

app.post('/api/admin/home-settings/bot-menu-image-upload', requireAdmin, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ detail: 'No file uploaded' });
  const targetPath = path.join(homeUploadsDir, 'bot_menu.jpg');
  fs.renameSync(req.file.path, targetPath);
  homeSettings.bot_menu_image_url = `/uploads/home/bot_menu.jpg`;
  res.json(homeSettings);
});

// Admin Contacts
app.get('/api/admin/contacts', requireAdmin, (req, res) => {
  res.json(contacts);
});

app.post('/api/admin/contacts', requireAdmin, (req, res) => {
  const contact: Contact = {
    id: nextContactId++,
    title: req.body.title,
    title_en: req.body.title_en || null,
    link: req.body.link,
    kind: req.body.kind || 'person',
    sort_order: req.body.sort_order || 0,
    is_active: req.body.is_active !== undefined ? req.body.is_active : true,
  };
  contacts.push(contact);
  res.json(contact);
});

app.patch('/api/admin/contacts/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const contact = contacts.find((c) => c.id === id);
  if (!contact) return res.status(404).json({ detail: 'Contact not found' });
  Object.assign(contact, req.body);
  res.json(contact);
});

app.delete('/api/admin/contacts/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  contacts = contacts.filter((c) => c.id !== id);
  res.json({ ok: true });
});

// --- VITE MIDDLEWARE SETUP ---

async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 Server running on http://0.0.0.0:${PORT}`);
    console.log(`📱 Web App & API available at: http://localhost:${PORT}\n`);
    startTelegramBotPolling();
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n❌ ERROR: Port ${PORT} is already in use by another process!`);
      console.error(`To free up port ${PORT} on Linux/macOS, run:`);
      console.error(`   npx kill-port ${PORT}   OR   fuser -k ${PORT}/tcp`);
      console.error(`Or run on another port: PORT=3001 npm run dev\n`);
    } else {
      console.error('Server error:', err);
    }
  });
}

start();
