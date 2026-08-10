var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_config = require("dotenv/config");
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_cors = __toESM(require("cors"), 1);
var import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);
var import_multer = __toESM(require("multer"), 1);
var import_vite = require("vite");
var PORT = Number(process.env.PORT) || 3e3;
var app = (0, import_express.default)();
app.use((0, import_cors.default)());
app.use(import_express.default.json());
app.use(import_express.default.static(import_path.default.join(process.cwd(), "public")));
app.get("/document.pdf", (req, res) => {
  const rootDocPath = import_path.default.join(process.cwd(), "document.pdf");
  const publicDocPath = import_path.default.join(process.cwd(), "public", "document.pdf");
  if (import_fs.default.existsSync(rootDocPath)) {
    res.sendFile(rootDocPath);
  } else if (import_fs.default.existsSync(publicDocPath)) {
    res.sendFile(publicDocPath);
  } else {
    res.status(404).send("Document not found");
  }
});
app.get("/api/download-zip", (req, res) => {
  const zipPath = import_path.default.join(process.cwd(), "public", "mediabuy_lab.zip");
  if (import_fs.default.existsSync(zipPath)) {
    res.download(zipPath, "mediabuy_lab.zip");
  } else {
    res.status(404).send("Archive not found");
  }
});
var uploadsDir = import_path.default.join(process.cwd(), "uploads");
var homeUploadsDir = import_path.default.join(uploadsDir, "home");
if (!import_fs.default.existsSync(homeUploadsDir)) {
  import_fs.default.mkdirSync(homeUploadsDir, { recursive: true });
}
app.use("/uploads", import_express.default.static(uploadsDir));
var upload = (0, import_multer.default)({ dest: import_path.default.join(uploadsDir, "tmp") });
var JWT_SECRET = process.env.ADMIN_WEB_TOKEN_SECRET || "mediabuy-secret-key-12345";
var ADMIN_LOGIN = process.env.WEB_ADMIN_LOGIN || "admin";
var ADMIN_PASSWORD = process.env.WEB_ADMIN_PASSWORD || "admin";
var CRYPTO_WALLETS = {
  USDT_TRC20: (process.env.WALLETS_USDT_TRC20 || "TY9aA5kZ5qJ2K8mW3pL7vX4nR1sT6uY8v1,TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t,TLj7vN4b8wX2K1mP5qL8sT3rY6uV9wX2z3,TP8qM3vL9wX1K2nP6qL7sT4rY5uV8wX1y2,TV6nK2vM8wX0K1nP5qL6sT3rY4uV7wX0z1").split(",").map((s) => s.trim()),
  USDT_BEP20: (process.env.WALLETS_USDT_BEP20 || "0x1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A01,0x8894E0a0c962CB723c1976a4421c95949bE2D4E3,0x2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A01B2,0x3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A01B2C3,0x4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A01B2C3D4").split(",").map((s) => s.trim()),
  USDT_ERC20: (process.env.WALLETS_USDT_ERC20 || "0x5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A01B2C3D4E5,0x6F7A8B9C0D1E2F3A4B5C6D7E8F9A01B2C3D4E5F6,0x7A8B9C0D1E2F3A4B5C6D7E8F9A01B2C3D4E5F6A7,0x8B9C0D1E2F3A4B5C6D7E8F9A01B2C3D4E5F6A7B8,0x9C0D1E2F3A4B5C6D7E8F9A01B2C3D4E5F6A7B8C9").split(",").map((s) => s.trim()),
  BTC: (process.env.WALLETS_BTC || "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh,1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa,bc1q7x4g8k9m0l1p2q3r4s5t6u7v8w9x0y1z2a3b4c,3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy,bc1q5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h").split(",").map((s) => s.trim()),
  ETH: (process.env.WALLETS_ETH || "0x00000000219ab540356cBB839Cbe05303d7705Fa,0x71C7656EC7ab88b098defB751B7401B5f6d8976F,0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2,0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8,0xDA9e1b8c077d7500313509855368893d57536184").split(",").map((s) => s.trim()),
  TON: (process.env.WALLETS_TON || "EQA0i3-noLKGfl39noP39LKGf_noLKGfl39noP39LKGf0001,UQA2_3LKGf_noLKGfl39noP39LKGf_noLKGfl39noP390002,EQBvW8Z5huBkMJYdnfAEM5JqTN19B91L2K8nW3pL7vX40003,UQCa1_3LKGf_noLKGfl39noP39LKGf_noLKGfl39noP390004,EQDb2_3LKGf_noLKGfl39noP39LKGf_noLKGfl39noP390005").split(",").map((s) => s.trim())
};
var walletRoundRobinIndex = {
  USDT_TRC20: 0,
  USDT_BEP20: 0,
  USDT_ERC20: 0,
  BTC: 0,
  ETH: 0,
  TON: 0
};
var CRYPTO_RATES_USD = {
  USDT_TRC20: 1,
  USDT_BEP20: 1,
  USDT_ERC20: 1,
  BTC: 65e3,
  ETH: 3500,
  TON: 6.5
};
function getNextWalletForCurrency(currencyKey) {
  const pool = CRYPTO_WALLETS[currencyKey] || CRYPTO_WALLETS.USDT_TRC20;
  const currentIndex = walletRoundRobinIndex[currencyKey] || 0;
  const assigned = pool[currentIndex % pool.length];
  walletRoundRobinIndex[currencyKey] = (currentIndex + 1) % pool.length;
  return { wallet: assigned, indexNumber: currentIndex % pool.length + 1, poolTotal: pool.length };
}
function calculateCryptoAmount(usdTotal, currencyKey) {
  const rate = CRYPTO_RATES_USD[currencyKey] || 1;
  if (currencyKey.startsWith("USDT")) {
    return `${usdTotal.toFixed(2)} USDT`;
  } else if (currencyKey === "BTC") {
    return `${(usdTotal / rate).toFixed(6)} BTC`;
  } else if (currencyKey === "ETH") {
    return `${(usdTotal / rate).toFixed(5)} ETH`;
  } else if (currencyKey === "TON") {
    return `${(usdTotal / rate).toFixed(2)} TON`;
  }
  return `${usdTotal.toFixed(2)} USD`;
}
var categories = [
  { id: 1, name: "\u0410\u043A\u043A\u0430\u0443\u043D\u0442\u044B Twitter (X)", slug: "accounts-twitter", is_visible: true, platform: "Twitter (X)" },
  { id: 2, name: "\u0410\u043A\u043A\u0430\u0443\u043D\u0442\u044B Google", slug: "accounts-google", is_visible: true, platform: "Google" },
  { id: 3, name: "\u0410\u043A\u043A\u0430\u0443\u043D\u0442\u044B Facebook", slug: "accounts-facebook", is_visible: true, platform: "Facebook" },
  { id: 4, name: "\u0410\u043A\u043A\u0430\u0443\u043D\u0442\u044B TikTok", slug: "accounts-tiktok", is_visible: true, platform: "TikTok" },
  { id: 5, name: "\u0410\u043A\u043A\u0430\u0443\u043D\u0442\u044B \u042F\u043D\u0434\u0435\u043A\u0441", slug: "accounts-yandex", is_visible: true, platform: "\u042F\u043D\u0434\u0435\u043A\u0441" },
  { id: 6, name: "\u041F\u0440\u0438\u0432\u0430\u0442\u043D\u044B\u0435 \u041F\u0440\u043E\u043A\u0441\u0438", slug: "proxies", is_visible: true, platform: "Proxy" },
  { id: 7, name: "\u0413\u043E\u0442\u043E\u0432\u044B\u0435 \u0421\u0435\u0442\u0430\u043F\u044B", slug: "starter-packs", is_visible: true, platform: "Setup" }
];
var products = [];
var prodId = 1;
categories.filter((c) => c.id <= 5).forEach((cat) => {
  for (let i = 1; i <= 3; i++) {
    products.push({
      id: prodId++,
      category_id: cat.id,
      title: `${cat.platform} Premium Farm #${i}`,
      title_en: `${cat.platform} Premium Farm #${i}`,
      description: `${cat.platform}: \u0444\u043E\u0440\u043C\u0430\u0442 farm/aged, \u043E\u0442\u043B\u0435\u0436\u043A\u0430 ${7 + i * 3} \u0434\u043D\u0435\u0439, GEO US/EU, \u0433\u043E\u0442\u043E\u0432 \u043F\u043E\u0434 \u0437\u0430\u043F\u0443\u0441\u043A \u0431\u0435\u0437 \u0431\u0430\u043D\u043E\u0432`,
      description_en: `${cat.platform}: farm/aged format, aged ${7 + i * 3} days, GEO US/EU, ready for smooth ad launches`,
      platform: cat.platform,
      price: 18 + i * 4,
      is_visible: true,
      detailed_description: `\u0412\u044B\u0441\u043E\u043A\u043E\u043A\u0430\u0447\u0435\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0439 \u043F\u0440\u043E\u0433\u0440\u0435\u0442\u044B\u0439 \u0430\u043A\u043A\u0430\u0443\u043D\u0442 ${cat.platform} \u0441 \u043F\u043E\u043B\u043D\u043E\u0439 \u0432\u044B\u0433\u0440\u0443\u0437\u043A\u043E\u0439 \u043A\u0443\u043A\u0438 (JSON/Netscape), \u043F\u0440\u043E\u0439\u0434\u0435\u043D\u043D\u043E\u0439 SMS/2FA \u0432\u0435\u0440\u0438\u0444\u0438\u043A\u0430\u0446\u0438\u0435\u0439 \u0438 \u0436\u0438\u0432\u043E\u0439 \u0441\u043E\u0446\u0438\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u0435\u0439 (\u0444\u0430\u0440\u043C ${7 + i * 3} \u0434\u043D\u0435\u0439). \u0418\u0434\u0435\u0430\u043B\u044C\u043D\u043E \u043F\u043E\u0434\u0445\u043E\u0434\u0438\u0442 \u0434\u043B\u044F \u0440\u0430\u0431\u043E\u0442\u044B \u0432 \u0430\u043D\u0442\u0438\u0434\u0435\u0442\u0435\u043A\u0442 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0430\u0445.`,
      detailed_description_en: `High-quality warmed ${cat.platform} account with full cookie export (JSON/Netscape), SMS/2FA verification completed, and natural farming history (${7 + i * 3} days). Ideal for anti-detect browsers.`,
      geo: i === 1 ? "US / \u0421\u0428\u0410" : i === 2 ? "EU / \u0415\u0432\u0440\u043E\u043F\u0430" : "\u0412\u0441\u0435 \u0441\u0442\u0440\u0430\u043D\u044B (WW)",
      format: "Login:Pass:2FA:Cookies(JSON):UserAgent",
      replacement_policy: "\u0411\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u0430\u044F \u0437\u0430\u043C\u0435\u043D\u0430 \u0432 \u0442\u0435\u0447\u0435\u043D\u0438\u0435 24 \u0447\u0430\u0441\u043E\u0432 \u0441 \u043C\u043E\u043C\u0435\u043D\u0442\u0430 \u043F\u043E\u043A\u0443\u043F\u043A\u0438 \u043F\u0440\u0438 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0438 \u0443\u0441\u043B\u043E\u0432\u0438\u0439 \u0440\u0430\u0431\u043E\u0442\u044B \u0447\u0435\u0440\u0435\u0437 \u043F\u0440\u0438\u0432\u0430\u0442\u043D\u044B\u0435 \u043F\u0440\u043E\u043A\u0441\u0438.",
      usage_instructions: "1. \u0418\u043C\u043F\u043E\u0440\u0442\u0438\u0440\u0443\u0439\u0442\u0435 \u043A\u0443\u043A\u0438 \u0432 \u043F\u0440\u043E\u0444\u0438\u043B\u044C \u0430\u043D\u0442\u0438\u0434\u0435\u0442\u0435\u043A\u0442\u0430.\n2. \u0418\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0439\u0442\u0435 \u0447\u0438\u0441\u0442\u044B\u0435 \u0441\u0442\u0430\u0442\u0438\u0447\u043D\u044B\u0435 \u043F\u0440\u043E\u043A\u0441\u0438 (SOCKS5/HTTP) \u0441\u0442\u0440\u0430\u043D\u044B \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0430.\n3. \u041D\u0435 \u043C\u0435\u043D\u044F\u0439\u0442\u0435 \u043B\u043E\u0433\u0438\u043D/\u043F\u0430\u0440\u043E\u043B\u044C \u0432 \u043F\u0435\u0440\u0432\u044B\u0435 2 \u0447\u0430\u0441\u0430 \u043F\u043E\u0441\u043B\u0435 \u0432\u0445\u043E\u0434\u0430.",
      stock: 25 + i * 10
    });
  }
});
products.push(
  {
    id: 101,
    category_id: 7,
    title: "\u0424\u0411 King \u0421\u0442\u0430\u0440\u0442\u043E\u0432\u044B\u0439 \u0421\u0435\u0442\u0430\u043F (King Farm + 3 BM + US Proxy + \u0427\u0435\u043A\u043B\u0438\u0441\u0442)",
    title_en: "FB King Launch Setup (King Farm + 3 BM + US Proxy + Checklist)",
    description: "\u041A\u043E\u043C\u043F\u043B\u0435\u043A\u0442 \u043C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u043E\u0433\u043E \u0442\u0440\u0430\u0441\u0442\u0430: 1 Facebook \u041A\u0438\u043D\u0433-\u0444\u0430\u0440\u043C (14+ \u0434\u043D\u0435\u0439 \u043E\u0442\u043B\u0435\u0436\u043A\u0438) + 3 \u0432\u0435\u0440\u0438\u0444\u0438\u0446\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0445 BM (Uncapped) + 1 \u041F\u0440\u0438\u0432\u0430\u0442\u043D\u044B\u0439 \u0440\u0435\u0437\u0438\u0434\u0435\u043D\u0442\u0441\u043A\u0438\u0439 US \u043F\u0440\u043E\u043A\u0441\u0438 + \u0427\u0435\u043A\u043B\u0438\u0441\u0442 \u0431\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u043E\u0433\u043E \u0437\u0430\u043F\u0443\u0441\u043A\u0430 \u0431\u0435\u0437 \u0431\u0430\u043D\u043E\u0432.",
    description_en: "High-trust combo: 1 Facebook King Farm (14+ days warmed) + 3 Verified BMs (Uncapped) + 1 Private US Residential Proxy + Anti-Ban Launch Checklist.",
    platform: "Facebook",
    price: 48,
    is_visible: true,
    detailed_description: "\u041A\u043E\u043C\u043F\u043B\u0435\u043A\u0441\u043D\u044B\u0439 \u0444\u043B\u0430\u0433\u043C\u0430\u043D\u0441\u043A\u0438\u0439 \u0441\u0435\u0442\u0430\u043F \u0434\u043B\u044F \u043C\u043E\u043C\u0435\u043D\u0442\u0430\u043B\u044C\u043D\u043E\u0433\u043E \u0437\u0430\u043F\u0443\u0441\u043A\u0430 \u0432 Facebook Ads. \u0412\u043A\u043B\u044E\u0447\u0430\u0435\u0442 1 \u0442\u0440\u0430\u0441\u0442\u043E\u0432\u044B\u0439 \u041A\u0438\u043D\u0433-\u0430\u043A\u043A\u0430\u0443\u043D\u0442 \u0441 \u0440\u0443\u0447\u043D\u044B\u043C \u0444\u0430\u0440\u043C\u043E\u043C 14+ \u0434\u043D\u0435\u0439, 3 \u0432\u0435\u0440\u0438\u0444\u0438\u0446\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0445 Business Manager \u0441 \u0431\u0435\u0437\u043B\u0438\u043C\u0438\u0442\u043D\u044B\u043C \u0441\u043F\u0435\u043D\u0434\u043E\u043C, 1 \u0441\u0442\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u0440\u0435\u0437\u0438\u0434\u0435\u043D\u0442\u0441\u043A\u0438\u0439 \u043F\u0440\u043E\u043A\u0441\u0438 US \u043E\u043F\u0435\u0440\u0430\u0442\u043E\u0440\u0430 \u0438 PDF \u0447\u0435\u043A\u043B\u0438\u0441\u0442 \u043F\u043E \u0431\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u043E\u043C\u0443 \u043F\u0440\u043E\u0433\u0440\u0435\u0432\u0443 \u0438 \u0437\u0430\u043F\u0443\u0441\u043A\u0443 \u043A\u0430\u043C\u043F\u0430\u043D\u0438\u0439.",
    detailed_description_en: "All-in-one flagship setup for immediate launch in Facebook Ads. Includes 1 trusted King account with 14+ days manual farm, 3 verified Business Managers (uncapped), 1 static US residential proxy, and a PDF checklist for safe warmup and launching.",
    geo: "US / \u0421\u0428\u0410 \u{1F1FA}\u{1F1F8}",
    format: "Login:Pass:2FA:Cookies + 3x BM Invitations + IP:PORT:USER:PASS + Guide PDF",
    replacement_policy: "\u041F\u043E\u043B\u043D\u0430\u044F \u0433\u0430\u0440\u0430\u043D\u0442\u0438\u044F \u0438 \u0437\u0430\u043C\u0435\u043D\u0430 \u043B\u044E\u0431\u043E\u0433\u043E \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u0430 \u043A\u043E\u043C\u043F\u043B\u0435\u043A\u0442\u0430 \u0432 \u0442\u0435\u0447\u0435\u043D\u0438\u0435 48 \u0447\u0430\u0441\u043E\u0432 \u0432 \u0441\u043B\u0443\u0447\u0430\u0435 \u0447\u0435\u043A\u043F\u043E\u0438\u043D\u0442\u0430 \u0438\u043B\u0438 \u0431\u0430\u043D\u0430.",
    usage_instructions: "1. \u0418\u043C\u043F\u043E\u0440\u0442\u0438\u0440\u0443\u0439\u0442\u0435 \u043A\u0443\u043A\u0438 \u041A\u0438\u043D\u0433-\u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0430 \u0432 Dolphin Anty.\n2. \u0423\u043A\u0430\u0436\u0438\u0442\u0435 \u0432\u044B\u0434\u0430\u043D\u043D\u044B\u0439 US \u043F\u0440\u043E\u043A\u0441\u0438.\n3. \u041F\u0440\u0438\u043C\u0438\u0442\u0435 \u0438\u043D\u0432\u0430\u0439\u0442\u044B \u0432 3 BM \u043F\u043E \u043F\u0440\u044F\u043C\u044B\u043C \u0441\u0441\u044B\u043B\u043A\u0430\u043C.\n4. \u0417\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u0435 \u0440\u0435\u043A\u043B\u0430\u043C\u0443 \u0441\u043E\u0433\u043B\u0430\u0441\u043D\u043E \u0447\u0435\u043A\u043B\u0438\u0441\u0442\u0443.",
    stock: 45
  },
  {
    id: 102,
    category_id: 7,
    title: "TikTok Ads Launch Kit (Agency Uncapped + \u0421\u043A\u043E\u0440\u043E\u0441\u0442\u043D\u043E\u0439 \u041F\u0440\u043E\u043A\u0441\u0438 + \u041C\u0430\u043D\u0443\u0430\u043B)",
    title_en: "TikTok Ads Launch Kit (Agency Uncapped + High-Speed Proxy + Guide)",
    description: "\u0413\u043E\u0442\u043E\u0432\u044B\u0439 \u043D\u0430\u0431\u043E\u0440 \u043F\u043E\u0434 \u043C\u0430\u0441\u0448\u0442\u0430\u0431\u043D\u044B\u0439 \u043F\u0440\u043E\u043B\u0438\u0432: \u0410\u0433\u0435\u043D\u0442\u0441\u043A\u0438\u0439 \u0430\u043A\u043A\u0430\u0443\u043D\u0442 TikTok Ads \u0431\u0435\u0437 \u0441\u0443\u0442\u043E\u0447\u043D\u043E\u0433\u043E \u043B\u0438\u043C\u0438\u0442\u0430 + \u0412\u044B\u0434\u0435\u043B\u0435\u043D\u043D\u044B\u0439 \u0433\u0435\u043E-\u043F\u0440\u043E\u043A\u0441\u0438 (HTTP/SOCKS5, <35ms ping) + \u0418\u043D\u0441\u0442\u0440\u0443\u043A\u0446\u0438\u044F \u043F\u043E \u043F\u0440\u0438\u0432\u044F\u0437\u043A\u0435 \u043A\u0430\u0440\u0442\u044B \u0438 \u043E\u0431\u0445\u043E\u0434\u0443 \u043C\u043E\u0434\u0435\u0440\u0430\u0446\u0438\u0438.",
    description_en: "Scale-ready bundle: TikTok Ads Agency Account (uncapped) + Dedicated Geo-Proxy (HTTP/SOCKS5, <35ms ping) + Payment linking & moderation guide.",
    platform: "TikTok",
    price: 39,
    is_visible: true,
    detailed_description: "\u041F\u043E\u043B\u043D\u044B\u0439 \u043D\u0430\u0431\u043E\u0440 \u0434\u043B\u044F \u0430\u0440\u0431\u0438\u0442\u0440\u0430\u0436\u0430 \u0432 TikTok Ads. \u0412\u044B \u043F\u043E\u043B\u0443\u0447\u0430\u0435\u0442\u0435 \u0430\u0433\u0435\u043D\u0442\u0441\u043A\u0438\u0439 \u043A\u0430\u0431\u0438\u043D\u0435\u0442 \u0441 \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u044C\u044E \u043B\u0438\u0442\u044C \u043B\u044E\u0431\u044B\u0435 \u043E\u0431\u044A\u0435\u043C\u044B \u0442\u0440\u0430\u0444\u0438\u043A\u0430 \u0431\u0435\u0437 \u0441\u0443\u0442\u043E\u0447\u043D\u043E\u0433\u043E \u0445\u043E\u043B\u0434\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F \u0438 \u043B\u0438\u043C\u0438\u0442\u043E\u0432, \u0432\u044B\u0434\u0435\u043B\u0435\u043D\u043D\u044B\u0439 \u0441\u043A\u043E\u0440\u043E\u0441\u0442\u043D\u043E\u0439 \u043F\u0440\u043E\u043A\u0441\u0438 \u0441 \u043C\u0438\u043D\u0438\u043C\u0430\u043B\u044C\u043D\u043E\u0439 \u0437\u0430\u0434\u0435\u0440\u0436\u043A\u043E\u0439 \u0434\u043B\u044F \u0432\u0438\u0434\u0435\u043E \u0438 \u043C\u0430\u043D\u0443\u0430\u043B \u043F\u043E \u043F\u0435\u0440\u0435\u0434\u0430\u0447\u0435 \u043F\u0440\u0430\u0432.",
    detailed_description_en: "Full toolkit for media buying in TikTok Ads. Agency account with uncapped daily spend, dedicated high-speed low-latency proxy, and safe transfer manual.",
    geo: "WW / \u0413\u043B\u043E\u0431\u0430\u043B \u{1F310}",
    format: "Login:Pass:2FA + BC Admin Invite + IP:PORT:USER:PASS + Manual PDF",
    replacement_policy: "\u0417\u0430\u043C\u0435\u043D\u0430 \u0432 \u0442\u0435\u0447\u0435\u043D\u0438\u0435 24 \u0447\u0430\u0441\u043E\u0432 \u0434\u043E \u043C\u043E\u043C\u0435\u043D\u0442\u0430 \u0437\u0430\u043B\u0438\u0432\u0430 \u043F\u0435\u0440\u0432\u043E\u0433\u043E \u043A\u0440\u0435\u0430\u0442\u0438\u0432\u0430.",
    usage_instructions: "1. \u0410\u0432\u0442\u043E\u0440\u0438\u0437\u0443\u0439\u0442\u0435\u0441\u044C \u0447\u0435\u0440\u0435\u0437 \u0430\u043D\u0442\u0438\u0434\u0435\u0442\u0435\u043A\u0442 \u0441 \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u043D\u044B\u043C \u043F\u0440\u043E\u043A\u0441\u0438.\n2. \u041F\u0440\u0438\u043C\u0438\u0442\u0435 \u043F\u0440\u0430\u0432\u0430 \u0430\u0434\u043C\u0438\u043D\u0430 \u0432 Business Center.\n3. \u041F\u0440\u0438\u0432\u044F\u0436\u0438\u0442\u0435 \u043F\u043B\u0430\u0442\u0435\u0436\u043D\u043E\u0435 \u0441\u0440\u0435\u0434\u0441\u0442\u0432\u043E \u0438 \u043F\u0443\u0431\u043B\u0438\u043A\u0443\u0439\u0442\u0435 \u043E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u044F.",
    stock: 38
  },
  {
    id: 103,
    category_id: 7,
    title: "Google Ads Power Pack (EU Aged Farm + \u0418\u0441\u0442\u043E\u0440\u0438\u044F \u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0439 + ISP \u041F\u0440\u043E\u043A\u0441\u0438)",
    title_en: "Google Ads Power Pack (EU Aged Farm + Billing History + ISP Proxy)",
    description: "\u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u043E \u0443\u0441\u0442\u043E\u0439\u0447\u0438\u0432\u044B\u0439 \u0441\u0435\u0442\u0430\u043F \u0434\u043B\u044F Google Search & YouTube: 1 \u041F\u0440\u043E\u0433\u0440\u0435\u0442\u044B\u0439 \u0430\u043A\u043A\u0430\u0443\u043D\u0442 \u0441 \u0440\u0435\u0430\u043B\u044C\u043D\u043E\u0439 \u0438\u0441\u0442\u043E\u0440\u0438\u0435\u0439 \u043E\u043F\u043B\u0430\u0442 + 2 \u0441\u0443\u0431-\u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0430 + \u0427\u0438\u0441\u0442\u044B\u0439 \u0441\u0442\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u043F\u0440\u043E\u043A\u0441\u0438 \u043F\u0440\u043E\u0432\u0430\u0439\u0434\u0435\u0440\u0430 (ISP).",
    description_en: "Bulletproof Google Search & YouTube setup: 1 Warmed Account with spend history + 2 Sub-accounts + Clean Static ISP Proxy.",
    platform: "Google",
    price: 55,
    is_visible: true,
    detailed_description: "\u041F\u0440\u0435\u043C\u0438\u0430\u043B\u044C\u043D\u044B\u0439 \u0441\u0435\u0442\u0430\u043F \u0434\u043B\u044F \u0440\u0430\u0431\u043E\u0442\u044B \u0441 \u043A\u043E\u043D\u0442\u0435\u043A\u0441\u0442\u043D\u043E\u0439 \u0438 \u0432\u0438\u0434\u0435\u043E-\u0440\u0435\u043A\u043B\u0430\u043C\u043E\u0439 \u0432 Google Ads. \u041F\u0440\u043E\u0433\u0440\u0435\u0442\u044B\u0439 \u0430\u043A\u043A\u0430\u0443\u043D\u0442 \u0441 \u0438\u0441\u0442\u043E\u0440\u0438\u0435\u0439 \u043E\u043F\u043B\u0430\u0442, 2 \u0441\u0432\u044F\u0437\u0430\u043D\u043D\u044B\u0445 \u0441\u0443\u0431-\u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0430 MCC \u0434\u043B\u044F \u0441\u043F\u043B\u0438\u0442-\u0442\u0435\u0441\u0442\u043E\u0432 \u0438 \u0447\u0438\u0441\u0442\u044B\u0439 \u0441\u0442\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0439 IP \u0430\u0434\u0440\u0435\u0441 \u0435\u0432\u0440\u043E\u043F\u0435\u0439\u0441\u043A\u043E\u0433\u043E \u0438\u043D\u0442\u0435\u0440\u043D\u0435\u0442-\u043F\u0440\u043E\u0432\u0430\u0439\u0434\u0435\u0440\u0430.",
    detailed_description_en: "Premium setup for Google Search and YouTube Ads. Aged account with real billing transactions, 2 linked MCC sub-accounts, and a clean static EU ISP proxy.",
    geo: "EU / \u0415\u0432\u0440\u043E\u043F\u0430 \u{1F1EA}\u{1F1FA}",
    format: "Email:Password:Recovery:2FA_Secret + Cookies + Proxy IP:Port:User:Pass",
    replacement_policy: "\u0413\u0430\u0440\u0430\u043D\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u0430\u044F \u0437\u0430\u043C\u0435\u043D\u0430 \u0432 \u0441\u043B\u0443\u0447\u0430\u0435 \u043F\u0435\u0440\u0432\u0438\u0447\u043D\u043E\u0433\u043E \u0441\u0443\u0441\u043F\u0435\u043D\u0434\u0430 \u0437\u0430 \u043F\u043E\u0434\u043E\u0437\u0440\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0435 \u043F\u043B\u0430\u0442\u0435\u0436\u0438 (Suspicious Payment).",
    usage_instructions: "1. \u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u0435 \u043F\u0440\u043E\u0444\u0438\u043B\u044C \u0432 \u0431\u0440\u0430\u0443\u0437\u0435\u0440.\n2. \u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0438\u0442\u0435 \u043F\u0440\u043E\u043A\u0441\u0438 \u0438 \u043F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u043E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0438\u0435 WebRTC \u0443\u0442\u0435\u0447\u0435\u043A.\n3. \u0414\u0430\u0439\u0442\u0435 \u043E\u0442\u043B\u0435\u0436\u0430\u0442\u044C\u0441\u044F 30 \u043C\u0438\u043D\u0443\u0442 \u043F\u0435\u0440\u0435\u0434 \u0437\u0430\u043F\u0443\u0441\u043A\u043E\u043C \u0431\u0438\u043B\u043B\u0438\u043D\u0433\u043E\u0432\u043E\u0439 \u043A\u0430\u043C\u043F\u0430\u043D\u0438\u0438.",
    stock: 29
  }
);
products.push(
  {
    id: 301,
    category_id: 6,
    title: "\u041C\u043E\u0431\u0438\u043B\u044C\u043D\u044B\u0435 \u041F\u0440\u043E\u043A\u0441\u0438 4G/5G \u0421\u0428\u0410 (US Private Dynamic)",
    title_en: "US Mobile Proxies 4G/5G (Private Dynamic Pool)",
    description: "\u041F\u0440\u0438\u0432\u0430\u0442\u043D\u044B\u0439 \u043C\u043E\u0431\u0438\u043B\u044C\u043D\u044B\u0439 \u043C\u043E\u0434\u0435\u043C (Verizon/T-Mobile). \u0421\u043C\u0435\u043D\u0430 IP \u043F\u043E API-\u0441\u0441\u044B\u043B\u043A\u0435 \u0438\u043B\u0438 \u0442\u0430\u0439\u043C\u0435\u0440\u0443 (\u043E\u0442 2 \u043C\u0438\u043D). \u0411\u0435\u0437\u043B\u0438\u043C\u0438\u0442\u043D\u044B\u0439 \u0442\u0440\u0430\u0444\u0438\u043A, \u0441\u043A\u043E\u0440\u043E\u0441\u0442\u044C \u0434\u043E 60 \u041C\u0431\u0438\u0442/\u0441. \u0418\u0434\u0435\u0430\u043B\u044C\u043D\u043E \u0434\u043B\u044F Facebook \u0438 TikTok.",
    description_en: "Private mobile modem (Verizon/T-Mobile). IP change via API link or timer (from 2 min). Unlimited traffic, up to 60 Mbps. Ideal for FB and TikTok.",
    platform: "Proxy",
    price: 9.5,
    is_visible: true,
    detailed_description: "\u0412\u044B\u0434\u0435\u043B\u0435\u043D\u043D\u044B\u0439 \u0434\u0438\u043D\u0430\u043C\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u043C\u043E\u0431\u0438\u043B\u044C\u043D\u044B\u0439 4G/5G \u043A\u0430\u043D\u0430\u043B \u043D\u0430 \u0440\u0435\u0430\u043B\u044C\u043D\u044B\u0445 SIM-\u043A\u0430\u0440\u0442\u0430\u0445 \u0430\u043C\u0435\u0440\u0438\u043A\u0430\u043D\u0441\u043A\u0438\u0445 \u043E\u043F\u0435\u0440\u0430\u0442\u043E\u0440\u043E\u0432 (AT&T, Verizon, T-Mobile). \u041F\u0440\u0438 \u0441\u043C\u0435\u043D\u0435 IP \u0432\u044B \u043F\u043E\u043B\u0443\u0447\u0430\u0435\u0442\u0435 \u0447\u0438\u0441\u0442\u0435\u0439\u0448\u0438\u0439 \u0430\u0434\u0440\u0435\u0441 \u0438\u0437 \u043F\u0443\u043B\u0430 \u0441 \u043D\u0443\u043B\u0435\u0432\u044B\u043C \u0444\u0440\u043E\u0434-\u0441\u043A\u043E\u0440\u043E\u043C (Fraud Score = 0). \u0410\u043D\u0442\u0438\u0444\u0440\u043E\u0434-\u0441\u0438\u0441\u0442\u0435\u043C\u044B \u0441\u043E\u0446\u0441\u0435\u0442\u0435\u0439 \u0432\u043E\u0441\u043F\u0440\u0438\u043D\u0438\u043C\u0430\u044E\u0442 \u0442\u0440\u0430\u0444\u0438\u043A \u043A\u0430\u043A \u043E\u0431\u044B\u0447\u043D\u043E\u0433\u043E \u043C\u043E\u0431\u0438\u043B\u044C\u043D\u043E\u0433\u043E \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F.",
    detailed_description_en: "Dedicated dynamic mobile 4G/5G channel powered by real US cellular carriers (AT&T, Verizon, T-Mobile). Changing IP rotates addresses with zero fraud score. Ad platform anti-fraud algorithms recognize traffic as standard legitimate mobile users.",
    geo: "US / \u0421\u0428\u0410 \u{1F1FA}\u{1F1F8}",
    format: "IP:PORT:USERNAME:PASSWORD:CHANGE_IP_LINK",
    replacement_policy: "\u0413\u0430\u0440\u0430\u043D\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u0430\u044F \u0437\u0430\u043C\u0435\u043D\u0430 \u0438\u043B\u0438 \u0432\u043E\u0437\u0432\u0440\u0430\u0442 \u0441\u0440\u0435\u0434\u0441\u0442\u0432 \u0432 \u0442\u0435\u0447\u0435\u043D\u0438\u0435 24 \u0447\u0430\u0441\u043E\u0432 \u043F\u0440\u0438 \u043F\u0430\u0434\u0435\u043D\u0438\u0438 \u0441\u043A\u043E\u0440\u043E\u0441\u0442\u0438 \u043D\u0438\u0436\u0435 15 \u041C\u0431\u0438\u0442/\u0441 \u0438\u043B\u0438 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u043E\u0441\u0442\u0438 \u043F\u0443\u043B\u0430.",
    usage_instructions: '1. \u0414\u043E\u0431\u0430\u0432\u044C\u0442\u0435 \u043F\u0440\u043E\u043A\u0441\u0438 \u043A\u0430\u043A SOCKS5 \u0438\u043B\u0438 HTTP \u0432 \u043F\u0440\u043E\u0444\u0438\u043B\u044C Dolphin Anty/AdsPower.\n2. \u0412 \u043F\u043E\u043B\u0435 "\u0421\u0441\u044B\u043B\u043A\u0430 \u0434\u043B\u044F \u0441\u043C\u0435\u043D\u044B IP" \u0443\u043A\u0430\u0436\u0438\u0442\u0435 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u043D\u044B\u0439 API URL.\n3. \u0420\u043E\u0442\u0438\u0440\u0443\u0439\u0442\u0435 IP \u043F\u0435\u0440\u0435\u0434 \u043A\u0430\u0436\u0434\u044B\u043C \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u0435\u043C \u0438\u043B\u0438 \u0432\u0445\u043E\u0434\u043E\u043C \u0432 \u043D\u043E\u0432\u044B\u0439 \u0430\u043A\u043A\u0430\u0443\u043D\u0442.',
    stock: 85
  },
  {
    id: 302,
    category_id: 6,
    title: "\u0420\u0435\u0437\u0438\u0434\u0435\u043D\u0442\u0441\u043A\u0438\u0435 \u0421\u0442\u0430\u0442\u0438\u0447\u043D\u044B\u0435 \u041F\u0440\u043E\u043A\u0441\u0438 \u0415\u0432\u0440\u043E\u043F\u0430 (EU Residential Static ISP)",
    title_en: "EU Residential Static Proxies (ISP Clean Pool)",
    description: "\u0421\u0442\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u0440\u0435\u0437\u0438\u0434\u0435\u043D\u0442\u0441\u043A\u0438\u0439 IP \u043E\u0442 \u0432\u0435\u0434\u0443\u0449\u0438\u0445 \u0435\u0432\u0440\u043E\u043F\u0435\u0439\u0441\u043A\u0438\u0445 \u043F\u0440\u043E\u0432\u0430\u0439\u0434\u0435\u0440\u043E\u0432 (\u0413\u0435\u0440\u043C\u0430\u043D\u0438\u044F, \u041D\u0438\u0434\u0435\u0440\u043B\u0430\u043D\u0434\u044B, \u0412\u0435\u043B\u0438\u043A\u043E\u0431\u0440\u0438\u0442\u0430\u043D\u0438\u044F). \u041F\u0440\u0438\u0432\u0430\u0442\u043D\u044B\u0439 \u043A\u0430\u043D\u0430\u043B 1 \u0413\u0431\u0438\u0442/\u0441, \u043F\u0438\u043D\u0433 < 20\u043C\u0441. \u0414\u043B\u044F Google Ads \u0438 FB.",
    description_en: "Static residential IP from top European ISPs (Germany, Netherlands, UK). Private 1 Gbps port, ping < 20ms. Best for Google Ads and Facebook.",
    platform: "Proxy",
    price: 6,
    is_visible: true,
    detailed_description: "\u0418\u043D\u0434\u0438\u0432\u0438\u0434\u0443\u0430\u043B\u044C\u043D\u044B\u0435 \u0441\u0442\u0430\u0442\u0438\u0447\u043D\u044B\u0435 \u0440\u0435\u0437\u0438\u0434\u0435\u043D\u0442\u0441\u043A\u0438\u0435 \u043F\u0440\u043E\u043A\u0441\u0438 (ISP) \u0441 \u0431\u0435\u043B\u044B\u043C \u0441\u043F\u0438\u0441\u043A\u043E\u043C \u0430\u0434\u0440\u0435\u0441\u043E\u0432. \u0410\u0434\u0440\u0435\u0441 \u0437\u0430\u043A\u0440\u0435\u043F\u043B\u0435\u043D \u0437\u0430 \u0432\u0430\u043C\u0438 \u043D\u0430 \u0432\u0435\u0441\u044C \u043E\u043F\u043B\u0430\u0447\u0435\u043D\u043D\u044B\u0439 \u043F\u0435\u0440\u0438\u043E\u0434 (30 \u0434\u043D\u0435\u0439). \u0418\u0434\u0435\u0430\u043B\u044C\u043D\u043E \u043F\u043E\u0434\u0445\u043E\u0434\u0438\u0442 \u0434\u043B\u044F \u0440\u0430\u0431\u043E\u0442\u044B \u0441 \u043F\u0440\u043E\u0433\u0440\u0435\u0442\u044B\u043C\u0438 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0430\u043C\u0438 Google Ads, Facebook, Twitter, \u0433\u0434\u0435 \u043A\u0440\u0438\u0442\u0438\u0447\u0435\u0441\u043A\u0438 \u0432\u0430\u0436\u043D\u0430 \u0441\u0442\u0430\u0431\u0438\u043B\u044C\u043D\u043E\u0441\u0442\u044C \u043E\u0434\u043D\u043E\u0433\u043E IP \u0431\u0435\u0437 \u043D\u0435\u043E\u0436\u0438\u0434\u0430\u043D\u043D\u044B\u0445 \u0441\u043A\u0430\u0447\u043A\u043E\u0432 \u0433\u0435\u043E.",
    detailed_description_en: "Individual static residential ISP proxies with white-listed addresses. The dedicated IP belongs exclusively to you for the entire 30-day period. Essential for aged Google Ads, Facebook, and Twitter farms where consistent single IP retention is required.",
    geo: "EU / \u0415\u0432\u0440\u043E\u043F\u0430 \u{1F1EA}\u{1F1FA}",
    format: "IP:PORT:USERNAME:PASSWORD",
    replacement_policy: "\u041C\u043E\u043C\u0435\u043D\u0442\u0430\u043B\u044C\u043D\u0430\u044F \u0437\u0430\u043C\u0435\u043D\u0430 \u043F\u0440\u0438 \u043F\u0435\u0440\u0432\u043E\u043C \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0438 \u0432 \u0441\u043B\u0443\u0447\u0430\u0435 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u043E\u0441\u0442\u0438 \u043F\u043E\u0440\u0442\u0430.",
    usage_instructions: "1. \u0421\u043A\u043E\u043F\u0438\u0440\u0443\u0439\u0442\u0435 host:port:user:pass \u0432 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0430\u043D\u0442\u0438\u0434\u0435\u0442\u0435\u043A\u0442 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0430.\n2. \u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u0413\u0415\u041E \u0438 WebRTC \u0447\u0435\u0440\u0435\u0437 Whoer/BrowserScan \u043F\u0435\u0440\u0435\u0434 \u0437\u0430\u043F\u0443\u0441\u043A\u043E\u043C \u043A\u0430\u0431\u0438\u043D\u0435\u0442\u0430.",
    stock: 120
  },
  {
    id: 303,
    category_id: 6,
    title: "\u0412\u044B\u0434\u0435\u043B\u0435\u043D\u043D\u044B\u0439 \u041F\u0440\u043E\u043A\u0441\u0438 \u043F\u043E\u0434 TikTok Ads (TikTok Dedicated Ultra-Fast)",
    title_en: "Dedicated Proxy for TikTok Ads (Ultra-Fast & Zero Lag)",
    description: "\u0421\u043F\u0435\u0446\u0438\u0430\u043B\u044C\u043D\u043E \u043E\u043F\u0442\u0438\u043C\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0439 \u0441\u043A\u043E\u0440\u043E\u0441\u0442\u043D\u043E\u0439 \u043F\u0440\u043E\u043A\u0441\u0438 \u043F\u043E\u0434 \u0432\u0438\u0434\u0435\u043E-\u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0443 \u0432 TikTok Ads Manager. \u041C\u0438\u043D\u0438\u043C\u0430\u043B\u044C\u043D\u044B\u0439 \u043F\u0438\u043D\u0433, \u043F\u043E\u043B\u043D\u043E\u0435 \u043E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0438\u0435 \u0437\u0430\u0434\u0435\u0440\u0436\u0435\u043A \u043F\u0440\u0438 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0435 \u0442\u044F\u0436\u0435\u043B\u044B\u0445 \u043A\u0440\u0435\u0430\u0442\u0438\u0432\u043E\u0432.",
    description_en: "Optimized high-speed proxy tailored for video uploads in TikTok Ads Manager. Lowest latency, smooth heavy creative publishing.",
    platform: "Proxy",
    price: 7.5,
    is_visible: true,
    detailed_description: "\u0423\u043B\u044C\u0442\u0440\u0430-\u0431\u044B\u0441\u0442\u0440\u044B\u0439 \u0432\u044B\u0434\u0435\u043B\u0435\u043D\u043D\u044B\u0439 \u043F\u0440\u043E\u043A\u0441\u0438-\u0441\u0435\u0440\u0432\u0435\u0440 \u0441 \u0448\u0438\u0440\u043E\u043A\u0438\u043C \u043A\u0430\u043D\u0430\u043B\u043E\u043C \u043F\u0440\u043E\u043F\u0443\u0441\u043A\u043D\u043E\u0439 \u0441\u043F\u043E\u0441\u043E\u0431\u043D\u043E\u0441\u0442\u0438. \u041E\u043F\u0442\u0438\u043C\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u043D \u0434\u043B\u044F \u043C\u0430\u0441\u0441\u043E\u0432\u043E\u0439 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u0432\u0438\u0434\u0435\u043E-\u043A\u0440\u0435\u0430\u0442\u0438\u0432\u043E\u0432 \u0432 TikTok Ads Manager \u0438 \u0431\u044B\u0441\u0442\u0440\u043E\u0433\u043E \u043F\u0440\u043E\u0445\u043E\u0436\u0434\u0435\u043D\u0438\u044F \u043F\u0435\u0440\u0432\u0438\u0447\u043D\u043E\u0439 \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u043E\u0439 \u043C\u043E\u0434\u0435\u0440\u0430\u0446\u0438\u0438.",
    detailed_description_en: "Ultra-fast dedicated proxy server with wide bandwidth. Optimized for bulk video creative uploads into TikTok Ads Manager and instant initial AI moderation pass.",
    geo: "US / UK / EU \u{1F310}",
    format: "IP:PORT:USERNAME:PASSWORD",
    replacement_policy: "\u0411\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u0430\u044F \u0437\u0430\u043C\u0435\u043D\u0430 \u043F\u043E \u0437\u0430\u043F\u0440\u043E\u0441\u0443 \u0432 \u0442\u0435\u0447\u0435\u043D\u0438\u0435 \u0441\u0443\u0442\u043E\u043A.",
    usage_instructions: "1. \u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0438\u0442\u0435 \u0432 \u0440\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u0438\u0438 \u0438\u043B\u0438 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0435 \u0430\u043D\u0442\u0438\u0434\u0435\u0442\u0435\u043A\u0442\u0430.\n2. \u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0439\u0442\u0435 \u0432\u0438\u0434\u0435\u043E-\u043A\u0440\u0435\u0430\u0442\u0438\u0432\u044B \u043B\u044E\u0431\u043E\u0433\u043E \u0440\u0430\u0437\u043C\u0435\u0440\u0430 \u0431\u0435\u0437 \u043F\u043E\u0442\u0435\u0440\u0438 \u043A\u0430\u0447\u0435\u0441\u0442\u0432\u0430.",
    stock: 64
  },
  {
    id: 304,
    category_id: 6,
    title: "\u041C\u043E\u0431\u0438\u043B\u044C\u043D\u044B\u0435 \u041F\u0440\u043E\u043A\u0441\u0438 WW (\u0410\u0432\u0442\u043E-\u0420\u043E\u0442\u0430\u0446\u0438\u044F 30+ \u0441\u0442\u0440\u0430\u043D)",
    title_en: "Worldwide Mobile Proxies (Auto-Rotate 30+ GEOs)",
    description: "\u0413\u043B\u043E\u0431\u0430\u043B\u044C\u043D\u044B\u0439 \u043C\u043E\u0431\u0438\u043B\u044C\u043D\u044B\u0439 \u043F\u0443\u043B \u0441 \u0433\u0438\u0431\u043A\u0438\u043C \u0432\u044B\u0431\u043E\u0440\u043E\u043C \u0441\u0442\u0440\u0430\u043D (LATAM, Asia, EU, US). \u0420\u043E\u0442\u0430\u0446\u0438\u044F \u043F\u043E \u043A\u0430\u0436\u0434\u043E\u043C\u0443 \u0437\u0430\u043F\u0440\u043E\u0441\u0443 \u0438\u043B\u0438 \u043F\u043E \u0442\u0430\u0439\u043C\u0435\u0440\u0443. \u041D\u0435\u043E\u0433\u0440\u0430\u043D\u0438\u0447\u0435\u043D\u043D\u044B\u0439 \u043F\u043E\u0442\u043E\u043A \u0441\u0435\u0441\u0441\u0438\u0439.",
    description_en: "Global mobile proxy pool with flexible country selection (LATAM, Asia, EU, US). Rotate on each request or custom timer. Unlimited concurrent sessions.",
    platform: "Proxy",
    price: 8,
    is_visible: true,
    detailed_description: "\u041C\u043D\u043E\u0433\u043E\u043F\u043E\u0442\u043E\u0447\u043D\u044B\u0439 \u0433\u043B\u043E\u0431\u0430\u043B\u044C\u043D\u044B\u0439 \u043C\u043E\u0431\u0438\u043B\u044C\u043D\u044B\u0439 \u043F\u0443\u043B. \u041F\u043E\u0437\u0432\u043E\u043B\u044F\u0435\u0442 \u043F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0430\u0442\u044C \u043B\u043E\u043A\u0430\u0446\u0438\u0438 \u043D\u0430 \u043B\u0435\u0442\u0443 \u0438\u043B\u0438 \u043D\u0430\u0441\u0442\u0440\u0430\u0438\u0432\u0430\u0442\u044C \u0440\u043E\u0442\u0430\u0446\u0438\u044E IP \u043F\u043E\u0434 \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0435 \u0447\u0435\u043A\u0435\u0440\u044B, \u043F\u0430\u0440\u0441\u0435\u0440\u044B \u0438 \u043C\u0430\u0441\u0441\u043E\u0432\u044B\u0435 \u043F\u0440\u043E\u0433\u0440\u0435\u0432\u044B \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u043E\u0432.",
    detailed_description_en: "Multi-threaded global mobile pool. Allows on-the-fly location switching or automated IP rotation for checkers, scrapers, and mass warmup tasks.",
    geo: "WW / 30+ \u0421\u0442\u0440\u0430\u043D \u{1F30D}",
    format: "GATEWAY_IP:PORT:USER_TOKEN",
    replacement_policy: "\u041A\u0440\u0443\u0433\u043B\u043E\u0441\u0443\u0442\u043E\u0447\u043D\u044B\u0439 \u043C\u043E\u043D\u0438\u0442\u043E\u0440\u0438\u043D\u0433 \u043F\u0443\u043B\u0430 \u0441 \u0430\u043F\u0442\u0430\u0439\u043C\u043E\u043C 99.9%.",
    usage_instructions: "1. \u0423\u043A\u0430\u0436\u0438\u0442\u0435 \u0448\u043B\u044E\u0437 \u0438 \u0442\u043E\u043A\u0435\u043D \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0438\u0438.\n2. \u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0446\u0435\u043B\u0435\u0432\u043E\u0439 \u043A\u043E\u0434 \u0441\u0442\u0440\u0430\u043D\u044B \u0432 \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u0430\u0445 \u0438\u043B\u0438 \u0441\u0441\u044B\u043B\u043A\u0435.",
    stock: 95
  }
);
var banners = [
  {
    id: 2,
    title: "\u0417\u0430\u043F\u0443\u0441\u043A \u0438 \u043E\u0431\u0443\u0447\u0435\u043D\u0438\u0435 \u0432 \u043E\u0434\u043D\u043E\u043C \u043C\u0435\u0441\u0442\u0435",
    subtitle: "\u041F\u0440\u0430\u043A\u0442\u0438\u043A\u0430, \u0441\u0432\u044F\u0437\u043A\u0438 \u0438 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0430 \u043A\u043E\u043C\u0430\u043D\u0434\u044B",
    image_url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1400&q=80",
    target_url: "https://t.me/mediabuy_lab",
    sort_order: 1,
    is_active: true,
    badge_text: "HOT DEAL"
  },
  {
    id: 3,
    title: "\u0421\u043A\u0438\u0434\u043A\u0430 10% \u043D\u0430 \u0432\u0442\u043E\u0440\u043E\u0439 \u0437\u0430\u043A\u0430\u0437",
    subtitle: "\u0410\u043A\u0446\u0438\u044F \u0430\u043A\u0442\u0438\u0432\u0438\u0440\u0443\u0435\u0442\u0441\u044F \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438 \u043F\u043E\u0441\u043B\u0435 \u043F\u0435\u0440\u0432\u043E\u0439 \u0443\u0441\u043F\u0435\u0448\u043D\u043E\u0439 \u043E\u043F\u043B\u0430\u0442\u044B",
    image_url: "https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=1400&q=80",
    target_url: "https://t.me/mediabuy_lab",
    sort_order: 2,
    is_active: true,
    badge_text: "BONUS 10%"
  },
  {
    id: 4,
    title: "\u0410\u043A\u0446\u0438\u044F: \u0437\u0430\u043F\u0443\u0441\u043A + \u043A\u0440\u0435\u0430\u0442\u0438\u0432\u044B -15%",
    subtitle: "\u041E\u0433\u0440\u0430\u043D\u0438\u0447\u0435\u043D\u043D\u043E\u0435 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u043D\u0430 \u043A\u043E\u043C\u043F\u043B\u0435\u043A\u0441\u043D\u044B\u0439 \u0437\u0430\u043F\u0443\u0441\u043A",
    image_url: "https://images.unsplash.com/photo-1556155092-8707de31f9c4?auto=format&fit=crop&w=1400&q=80",
    target_url: "https://t.me/mediabuy_lab",
    sort_order: 3,
    is_active: true,
    badge_text: "LIMITED"
  }
];
var articles = [
  {
    id: 1,
    title: "\u041A\u0435\u0439\u0441: TikTok eCom \u043D\u0430 \u0445\u043E\u043B\u043E\u0434\u043D\u043E\u043C \u0442\u0440\u0430\u0444\u0438\u043A\u0435",
    image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    target_url: "https://t.me/mediabuy_lab",
    sort_order: 1,
    is_active: true,
    has_en_version: false
  },
  {
    id: 2,
    title: "\u041A\u0430\u043A \u043F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u0438\u0442\u044C \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u044B \u043F\u043E\u0434 \u0437\u0430\u043F\u0443\u0441\u043A \u0431\u0435\u0437 \u0431\u0430\u043D\u043E\u0432",
    image_url: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80",
    target_url: "https://t.me/mediabuy_lab",
    sort_order: 2,
    is_active: true,
    has_en_version: false
  }
];
var contacts = [
  { id: 1, title: "\u{1F4E2} \u041E\u0444\u0438\u0446\u0438\u0430\u043B\u044C\u043D\u044B\u0439 \u043A\u0430\u043D\u0430\u043B", title_en: "\u{1F4E2} Official Channel", link: "https://t.me/mediabuy_lab", kind: "channel", sort_order: 1, is_active: true },
  { id: 2, title: "\u{1F464} \u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0410\u0434\u043C\u0438\u043D", title_en: "\u{1F464} Main Admin", link: "https://t.me/mediabuy_adm", kind: "person", sort_order: 2, is_active: true },
  { id: 3, title: "\u{1F4AC} \u041C\u0435\u043D\u0435\u0434\u0436\u0435\u0440 \u0421\u0435\u0440\u0433\u0435\u0439", title_en: "\u{1F4AC} Manager Sergey", link: "https://t.me/sergey_mediabuy", kind: "person", sort_order: 3, is_active: true },
  { id: 4, title: "\u{1F4AC} \u041C\u0435\u043D\u0435\u0434\u0436\u0435\u0440 \u0410\u043D\u0442\u043E\u043D", title_en: "\u{1F4AC} Manager Anton", link: "https://t.me/Anton_mediabuy", kind: "person", sort_order: 4, is_active: true },
  { id: 5, title: "\u{1F4AC} \u041C\u0435\u043D\u0435\u0434\u0436\u0435\u0440 \u0412\u0438\u043A\u0442\u043E\u0440\u0438\u044F", title_en: "\u{1F4AC} Manager Victoria", link: "https://t.me/Victorys_mediabuy", kind: "person", sort_order: 5, is_active: true }
];
var homeSettings = {
  id: 1,
  logo_text: "Mediabuy Lab",
  logo_image_url: null,
  brand_title: "Mediabuy Lab",
  brand_subtitle: "\u0410\u043A\u043A\u0430\u0443\u043D\u0442\u044B, \u0437\u0430\u043F\u0443\u0441\u043A\u0438 \u0438 \u043E\u0431\u0443\u0447\u0435\u043D\u0438\u0435",
  launch_badge: "HOT",
  launch_title: "\u0417\u0430\u043F\u0443\u0441\u043A \u0440\u0435\u043A\u043B\u0430\u043C\u044B \u043F\u043E\u0434 \u043A\u043B\u044E\u0447",
  launch_image_url: null,
  training_badge: "NEW",
  training_title: "\u041E\u0431\u0443\u0447\u0435\u043D\u0438\u0435 \u0430\u0440\u0431\u0438\u0442\u0440\u0430\u0436\u0443",
  training_image_url: null,
  bot_menu_title: "\u{1F9FF} Mediabuy Lab \u2014 \u042D\u043A\u0441\u043F\u0435\u0440\u0442\u044B \u0432 \u0410\u0440\u0431\u0438\u0442\u0440\u0430\u0436\u0435 & \u041C\u0435\u0434\u0438\u0430\u0431\u0430\u0439\u0438\u043D\u0433\u0435",
  bot_menu_description: `\u{1F525} <b>\u0414\u043E\u0431\u0440\u043E \u043F\u043E\u0436\u0430\u043B\u043E\u0432\u0430\u0442\u044C \u0432 \u043E\u0444\u0438\u0446\u0438\u0430\u043B\u044C\u043D\u044B\u0439 \u0431\u043E\u0442 Mediabuy Lab!</b>

\u041C\u044B \u043F\u0440\u0435\u0434\u043E\u0441\u0442\u0430\u0432\u043B\u044F\u0435\u043C \u043F\u043E\u043B\u043D\u044B\u0439 \u043A\u043E\u043C\u043F\u043B\u0435\u043A\u0441 \u0440\u0435\u0448\u0435\u043D\u0438\u0439 \u0434\u043B\u044F \u043C\u0435\u0434\u0438\u0430\u0431\u0430\u0439\u0438\u043D\u0433\u0430 \u0438 \u0440\u0430\u0431\u043E\u0442\u044B \u0441 \u0442\u0440\u0430\u0444\u0438\u043A\u043E\u043C:

\u{1F680} <b>1. \u0417\u0430\u043F\u0443\u0441\u043A \u0440\u0435\u043A\u043B\u0430\u043C\u044B \u043F\u043E\u0434 \u043A\u043B\u044E\u0447:</b>
\u041F\u0440\u043E\u0444\u0435\u0441\u0441\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u0430\u044F \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430 \u0438 \u0432\u0435\u0434\u0435\u043D\u0438\u0435 \u0440\u0435\u043A\u043B\u0430\u043C\u044B \u0432 Facebook Ads, Google Ads, TikTok Ads, Crypto, Nutra \u0438 Gambling.

\u{1F393} <b>2. \u041E\u0431\u0443\u0447\u0435\u043D\u0438\u0435 \u0430\u0440\u0431\u0438\u0442\u0440\u0430\u0436\u0443 \u0442\u0440\u0430\u0444\u0438\u043A\u0430:</b>
\u041F\u0440\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0435 \u043A\u0443\u0440\u0441\u044B, \u0440\u0430\u0431\u043E\u0447\u0438\u0435 \u0441\u0432\u044F\u0437\u043A\u0438, \u0441\u0435\u0442\u0430\u043F\u044B \u0438 \u043B\u0438\u0447\u043D\u043E\u0435 \u043D\u0430\u0441\u0442\u0430\u0432\u043D\u0438\u0447\u0435\u0441\u0442\u0432\u043E \u0434\u043E \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u0430.

\u{1F6D2} <b>3. \u041F\u0440\u043E\u0434\u0430\u0436\u0430 \u0444\u0430\u0440\u043C-\u0430\u043A\u043A\u0430\u0443\u043D\u0442\u043E\u0432 & \u0441\u0435\u0442\u0430\u043F\u043E\u0432:</b>
\u0412\u044B\u0441\u043E\u043A\u043E\u0442\u0440\u0430\u0441\u0442\u043E\u0432\u044B\u0435 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u044B Facebook, Google, TikTok, Twitter (X), \u042F\u043D\u0434\u0435\u043A\u0441, BM, \u0430\u0433\u0435\u043D\u0442\u0441\u043A\u0438\u0435 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u044B \u0438 \u043E\u0442\u0433\u0440\u0435\u0442\u044B\u0435 \u043F\u0440\u043E\u0444\u0438\u043B\u0438.

\u{1F4F1} <b>\u041E\u0442\u043A\u0440\u044B\u0432\u0430\u0439\u0442\u0435 Mini App \u0434\u043B\u044F \u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440\u0430 \u043A\u0430\u0442\u0430\u043B\u043E\u0433\u0430 \u0438 \u043E\u0444\u043E\u0440\u043C\u043B\u0435\u043D\u0438\u044F \u0437\u0430\u043A\u0430\u0437\u0430 \u0432 \u043F\u0430\u0440\u0443 \u043A\u043B\u0438\u043A\u043E\u0432!</b>`,
  bot_menu_image_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
  bot_buttons: [
    { id: 1, text: "\u{1F680} \u041E\u0442\u043A\u0440\u044B\u0442\u044C Mini App (\u041A\u0430\u0442\u0430\u043B\u043E\u0433)", text_en: "\u{1F680} Open Mini App (Catalog)", style: "success", is_web_app: true },
    { id: 2, text: "\u{1F4E2} \u041D\u0430\u0448 Telegram \u041A\u0430\u043D\u0430\u043B", text_en: "\u{1F4E2} Our Telegram Channel", style: "primary", url: "https://t.me/mediabuy_lab" },
    { id: 3, text: "\u{1F468}\u200D\u{1F4BB} \u041D\u0430\u0448\u0438 \u041C\u0435\u043D\u0435\u0434\u0436\u0435\u0440\u044B", text_en: "\u{1F468}\u200D\u{1F4BB} Our Managers", style: "default" },
    { id: 5, text: "\u{1F6E1}\uFE0F \u041D\u0430\u0448\u0438 \u0433\u0430\u0440\u0430\u043D\u0442\u0438\u0438", text_en: "\u{1F6E1}\uFE0F Guarantees", style: "default" }
  ]
};
var users = [
  {
    id: 1,
    telegram_id: 10001,
    username: "demo_user",
    first_name: "Demo",
    last_name: "User",
    next_order_discount_percent: 0
  }
];
var cartItems = [];
var orders = [];
var serviceRequests = [];
var nextCartItemId = 1;
var nextOrderId = 1;
var nextRequestId = 1;
var nextCategoryId = 6;
var nextProductId = prodId;
var nextBannerId = 5;
var nextArticleId = 3;
var nextContactId = 6;
function getUserFromReq(req) {
  let user = null;
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
          first_name: parsed.first_name || "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C",
          last_name: parsed.last_name || null,
          next_order_discount_percent: 0
        };
        users.push(user);
      } else {
        if (parsed.username !== void 0) user.username = parsed.username || null;
        if (parsed.first_name) user.first_name = parsed.first_name;
        if (parsed.last_name !== void 0) user.last_name = parsed.last_name || null;
      }
    }
  }
  if (!user) {
    const tgUserHeader = req.headers["x-telegram-user"];
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
              first_name: parsed.first_name || "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C",
              last_name: parsed.last_name || null,
              next_order_discount_percent: 0
            };
            users.push(user);
          } else {
            if (parsed.username !== void 0) user.username = parsed.username || null;
            if (parsed.first_name) user.first_name = parsed.first_name;
            if (parsed.last_name !== void 0) user.last_name = parsed.last_name || null;
          }
        }
      } catch (e) {
      }
    }
  }
  if (!user) {
    const initData = req.headers["x-telegram-init-data"] || req.headers["x-telegram-initdata"];
    if (initData) {
      try {
        const params = new URLSearchParams(initData);
        const userStr = params.get("user");
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
                first_name: parsed.first_name || "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C",
                last_name: parsed.last_name || null,
                next_order_discount_percent: 0
              };
              users.push(user);
            } else {
              if (parsed.username !== void 0) user.username = parsed.username || null;
              if (parsed.first_name) user.first_name = parsed.first_name;
              if (parsed.last_name !== void 0) user.last_name = parsed.last_name || null;
            }
          }
        }
      } catch (e) {
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
function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    try {
      const decoded = import_jsonwebtoken.default.verify(token, JWT_SECRET);
      if (decoded && (decoded.role === "admin" || decoded.sub)) {
        return next();
      }
    } catch (err) {
    }
  }
  const hasTgHeader = req.headers["x-telegram-user"] || req.headers["x-telegram-init-data"] || req.headers["x-telegram-initdata"];
  if (hasTgHeader) {
    const user = getUserFromReq(req);
    if (user && user.is_admin && user.telegram_id !== 10001) {
      return next();
    }
  }
  return res.status(401).json({ detail: "Unauthorized or invalid token" });
}
app.get("/api/catalog/categories", (req, res) => {
  const visible = categories.filter((c) => c.is_visible);
  const result = visible.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    is_visible: c.is_visible,
    products_count: products.filter((p) => p.category_id === c.id && p.is_visible).length
  }));
  res.json(result);
});
app.get("/api/catalog/categories/:slug", (req, res) => {
  const category = categories.find((c) => c.slug === req.params.slug && c.is_visible);
  if (!category) {
    return res.status(404).json({ detail: "Category not found" });
  }
  const catProducts = products.filter((p) => p.category_id === category.id && p.is_visible);
  res.json({
    ...category,
    products: catProducts
  });
});
app.get("/api/catalog/products", (req, res) => {
  res.json(products.filter((p) => p.is_visible));
});
app.get("/api/catalog/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const p = products.find((prod) => prod.id === id && prod.is_visible);
  if (!p) {
    return res.status(404).json({ detail: "Product not found" });
  }
  res.json(p);
});
app.get("/api/cart", (req, res) => {
  const user = getUserFromReq(req);
  const userItems = cartItems.filter((ci) => ci.user_id === user.id);
  const result = userItems.map((ci) => {
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
      quantity: ci.quantity
    };
  }).filter(Boolean);
  res.json(result);
});
app.put("/api/cart/items", (req, res) => {
  const user = getUserFromReq(req);
  const { product_id, quantity } = req.body;
  const product = products.find((p) => p.id === product_id && p.is_visible);
  if (!product) {
    return res.status(404).json({ detail: "Product not found" });
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
      quantity
    });
  }
  const userItems = cartItems.filter((ci) => ci.user_id === user.id);
  const result = userItems.map((ci) => {
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
      quantity: ci.quantity
    };
  }).filter(Boolean);
  res.json(result);
});
app.delete("/api/cart/clear", (req, res) => {
  const user = getUserFromReq(req);
  cartItems = cartItems.filter((ci) => ci.user_id !== user.id);
  res.json({ ok: true });
});
app.get("/api/content/banners", (req, res) => {
  const list = banners.filter((b) => b.is_active).sort((a, b) => a.sort_order - b.sort_order);
  res.json(list);
});
app.get("/api/content/articles", (req, res) => {
  const lang = req.query.lang || "ru";
  const active = articles.filter((a) => a.is_active).sort((a, b) => a.sort_order - b.sort_order);
  if (lang === "en") {
    const result = active.filter((a) => a.has_en_version && a.title_en && a.image_url_en && a.target_url_en).map((a) => ({
      id: a.id,
      title: a.title_en,
      image_url: a.image_url_en,
      target_url: a.target_url_en,
      is_active: a.is_active,
      sort_order: a.sort_order
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
      sort_order: a.sort_order
    }))
  );
});
app.get("/api/content/home-settings", (req, res) => {
  res.json(homeSettings);
});
app.get("/api/content/contacts", (req, res) => {
  const active = contacts.filter((c) => c.is_active).sort((a, b) => a.sort_order - b.sort_order);
  res.json(active);
});
function getCountryFlag(countryCode) {
  if (!countryCode || countryCode.length !== 2) return "\u{1F310}";
  const codePoints = countryCode.toUpperCase().split("").map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
async function getGeoAndDeviceInfo(req) {
  const rawIp = req.headers["x-forwarded-for"] || req.headers["x-real-ip"] || req.socket.remoteAddress || "127.0.0.1";
  const ip = rawIp.split(",")[0].trim();
  const ua = req.headers["user-agent"] || "";
  let device = "\u041F\u041A / \u0411\u0440\u0430\u0443\u0437\u0435\u0440";
  if (/iphone|ipad|ipod/i.test(ua)) {
    device = "\u{1F4F1} iOS (iPhone / iPad)";
  } else if (/android/i.test(ua)) {
    device = "\u{1F4F1} Android \u041C\u043E\u0431\u0438\u043B\u044C\u043D\u044B\u0439";
  } else if (/macintosh|mac os x/i.test(ua)) {
    device = "\u{1F4BB} macOS Desktop";
  } else if (/windows/i.test(ua)) {
    device = "\u{1F4BB} Windows Desktop";
  } else if (/linux/i.test(ua)) {
    device = "\u{1F4BB} Linux Desktop";
  }
  if (/telegram/i.test(ua)) {
    device += " [Telegram WebApp]";
  }
  let country = "\u041D\u0435 \u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0435\u043D\u0430";
  let city = "";
  let flag = "\u{1F310}";
  if (ip && ip !== "127.0.0.1" && ip !== "::1" && !ip.startsWith("192.168.") && !ip.startsWith("10.")) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2e3);
      const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,city`, { signal: controller.signal });
      clearTimeout(timeoutId);
      const data = await res.json();
      if (data && data.status === "success") {
        country = data.country || "\u041D\u0435 \u0438\u0437\u0432\u0435\u0441\u0442\u043D\u0430";
        city = data.city || "";
        if (data.countryCode) {
          flag = getCountryFlag(data.countryCode);
        }
      }
    } catch (e) {
    }
  } else {
    country = "\u041B\u043E\u043A\u0430\u043B\u044C\u043D\u044B\u0439 \u0441\u0435\u0430\u043D\u0441 / VPN";
    city = "Localhost";
  }
  const geoStr = city ? `${flag} ${country}, ${city}` : `${flag} ${country}`;
  return { ip, device, geoStr };
}
var userVisitCache = {};
async function trackMiniAppOpen(req, user) {
  const userId = user.id;
  const now = Date.now();
  if (userVisitCache[userId] && now - userVisitCache[userId] < 6e5) {
    return;
  }
  userVisitCache[userId] = now;
  const { ip, device, geoStr } = await getGeoAndDeviceInfo(req);
  const usernameText = user.username ? `@${user.username}` : "\u043D\u0435\u0442 username";
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ") || "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C";
  const visitMsg = `\u{1F514} <b>\u041D\u041E\u0412\u042B\u0419 \u0412\u0425\u041E\u0414 \u0412 MINI APP</b>
\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
\u{1F464} <b>\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C:</b> ${fullName} (${usernameText})
\u{1F194} <b>Telegram ID:</b> <code>${user.telegram_id}</code>

\u{1F310} <b>IP \u0430\u0434\u0440\u0435\u0441:</b> <code>${ip}</code>
\u{1F30D} <b>\u041B\u043E\u043A\u0430\u0446\u0438\u044F:</b> ${geoStr}
\u{1F4F1} <b>\u0423\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u043E:</b> ${device}
\u23F0 <b>\u0412\u0440\u0435\u043C\u044F \u0432\u0445\u043E\u0434\u0430:</b> ${(/* @__PURE__ */ new Date()).toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })} \u041C\u0421\u041A`;
  sendTelegramAdminNotification(visitMsg);
}
async function sendTelegramAdminNotification(messageText) {
  const botToken = process.env.BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
  const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID || process.env.ADMIN_CHAT_ID || (process.env.ADMIN_IDS ? process.env.ADMIN_IDS.split(",")[0].trim() : null);
  if (!botToken || !adminChatId) {
    console.log("\n[Telegram Bot Notification Skipped - BOT_TOKEN or TELEGRAM_ADMIN_CHAT_ID not configured in .env]:");
    console.log(messageText.replace(/<[^>]+>/g, ""));
    console.log("--------------------------------------------------\n");
    return;
  }
  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: adminChatId,
        text: messageText,
        parse_mode: "HTML",
        disable_web_page_preview: true
      })
    });
    const resData = await response.json();
    if (!resData.ok) {
      console.error("[Telegram Bot API Notification Error]:", resData);
    } else {
      console.log(`[Telegram Bot] Order/Request notification sent successfully to admin chat ID (${adminChatId})`);
    }
  } catch (err) {
    console.error("[Telegram Bot] Exception sending notification:", err);
  }
}
async function verifyCryptoTransaction(cryptoCurrency, walletAddress, txid, expectedAmountUsd) {
  if (!txid || txid.trim().length < 10) {
    return { success: false, reason: "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0438\u043B\u0438 \u0441\u043B\u0438\u0448\u043A\u043E\u043C \u043A\u043E\u0440\u043E\u0442\u043A\u0438\u0439 TXID \u0445\u044D\u0448" };
  }
  const cleanTxid = txid.trim();
  if (cryptoCurrency.includes("TRC20") || cryptoCurrency.includes("TRON")) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6e3);
      const res = await fetch(`https://api.trongrid.io/v1/transactions/${cleanTxid}`, {
        signal: controller.signal,
        headers: { "Accept": "application/json" }
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (data && data.data && data.data.length > 0) {
          const tx = data.data[0];
          const contractRet = tx.ret?.[0]?.contractRet;
          if (contractRet === "SUCCESS") {
            return { success: true, details: tx };
          }
        }
      }
    } catch (e) {
      console.error("TronGrid API check error:", e);
    }
  }
  if (cryptoCurrency.includes("BEP20") || cryptoCurrency.includes("BSC")) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6e3);
      const res = await fetch(`https://api.bscscan.com/api?module=transaction&action=gettxreceiptstatus&txhash=${cleanTxid}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (data && data.status === "1" && data.result?.status === "1") {
          return { success: true, details: data.result };
        }
      }
    } catch (e) {
      console.error("BscScan API check error:", e);
    }
  }
  if (cryptoCurrency === "BTC") {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6e3);
      const res = await fetch(`https://api.blockcypher.com/v1/btc/main/txs/${cleanTxid}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (data && data.confirmations !== void 0 && data.confirmations >= 0) {
          return { success: true, details: data };
        }
      }
    } catch (e) {
      console.error("Blockcypher API check error:", e);
    }
  }
  if (/^(0x)?[a-fA-F0-9]{60,66}$/.test(cleanTxid) || cleanTxid.length >= 32) {
    return { success: true, reason: "\u0425\u044D\u0448 \u0442\u0440\u0430\u043D\u0437\u0430\u043A\u0446\u0438\u0438 \u0432\u0430\u043B\u0438\u0434\u0435\u043D \u0438 \u043F\u0440\u0438\u043D\u044F\u0442 \u043A \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u043A\u0435" };
  }
  return { success: false, reason: "\u0422\u0440\u0430\u043D\u0437\u0430\u043A\u0446\u0438\u044F \u043F\u043E\u043A\u0430 \u043D\u0435 \u043E\u0431\u043D\u0430\u0440\u0443\u0436\u0435\u043D\u0430 \u0432 \u0441\u0435\u0442\u0438 \u0431\u043B\u043E\u043A\u0447\u0435\u0439\u043D" };
}
async function notifyCustomerAboutOrderStatus(order, newStatus, customNote) {
  const user = users.find((u) => u.id === order.user_id);
  if (!user || !user.telegram_id) {
    console.log(`[Push Notification Skipped]: User ${order.user_id} has no telegram_id`);
    return;
  }
  const botToken = process.env.BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) return;
  let miniAppUrl = process.env.MINI_APP_URL || process.env.WEB_ADMIN_URL || "http://localhost:3000";
  if (!miniAppUrl.startsWith("http://") && !miniAppUrl.startsWith("https://")) {
    miniAppUrl = `https://${miniAppUrl}`;
  }
  let statusTitle = "\u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D";
  let statusEmoji = "\u{1F514}";
  if (newStatus === "paid") {
    statusTitle = "\u041E\u043F\u043B\u0430\u0447\u0435\u043D (Paid)";
    statusEmoji = "\u2705";
  } else if (newStatus === "completed" || newStatus === "delivered") {
    statusTitle = "\u0412\u044B\u0434\u0430\u043D \u0438 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D (Delivered)";
    statusEmoji = "\u{1F389}";
  } else if (newStatus === "cancelled") {
    statusTitle = "\u041E\u0442\u043C\u0435\u043D\u0435\u043D (Cancelled)";
    statusEmoji = "\u274C";
  } else if (newStatus === "waiting_payment") {
    statusTitle = "\u041E\u0436\u0438\u0434\u0430\u0435\u0442 \u043E\u043F\u043B\u0430\u0442\u044B (Waiting Payment)";
    statusEmoji = "\u23F3";
  }
  const itemsSummary = order.items.map((oi) => {
    const p = products.find((prod) => prod.id === oi.product_id);
    const title = p ? p.title : `\u0422\u043E\u0432\u0430\u0440 #${oi.product_id}`;
    return `  \u2022 <b>${title}</b> x${oi.quantity}`;
  }).join("\n");
  let text = `${statusEmoji} <b>\u0423\u0412\u0415\u0414\u041E\u041C\u041B\u0415\u041D\u0418\u0415 \u041F\u041E \u0417\u0410\u041A\u0410\u0417\u0423 #${order.id}</b>
\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
\u0421\u0442\u0430\u0442\u0443\u0441 \u0437\u0430\u043A\u0430\u0437\u0430: <b>${statusTitle}</b>
\u0421\u0443\u043C\u043C\u0430: <b>$${order.total_amount.toFixed(2)} USD</b> (${order.crypto_amount})
\u0421\u0435\u0442\u044C \u043E\u043F\u043B\u0430\u0442\u044B: <b>${order.crypto_currency}</b>

\u{1F4E6} <b>\u0421\u043E\u0441\u0442\u0430\u0432 \u0437\u0430\u043A\u0430\u0437\u0430:</b>
${itemsSummary}

`;
  if (customNote) {
    text += `\u{1F4DD} <b>\u041F\u0440\u0438\u043C\u0435\u0447\u0430\u043D\u0438\u0435:</b> ${customNote}

`;
  }
  if (order.delivered_data) {
    text += `\u{1F510} <b>\u0414\u0410\u041D\u041D\u042B\u0415 \u0414\u041E\u0421\u0422\u0423\u041F\u0410 / \u0422\u041E\u0412\u0410\u0420:</b>
<code>${order.delivered_data}</code>

`;
  }
  if (newStatus === "paid") {
    text += `\u{1F680} \u0421\u043F\u0430\u0441\u0438\u0431\u043E \u0437\u0430 \u043E\u043F\u043B\u0430\u0442\u0443! \u041D\u0430\u0448 \u043E\u043F\u0435\u0440\u0430\u0442\u043E\u0440 \u0438 \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u0441\u0438\u0441\u0442\u0435\u043C\u0430 \u0433\u043E\u0442\u043E\u0432\u044F\u0442 \u0432\u044B\u0433\u0440\u0443\u0437\u043A\u0443 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u043E\u0432.

`;
  } else if (newStatus === "completed" || newStatus === "delivered") {
    text += `\u2728 \u0412\u0430\u0448 \u0437\u0430\u043A\u0430\u0437 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D! \u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u043D\u044B\u0435 \u043A\u0443\u043A\u0438 \u0438 \u043B\u043E\u0433\u0438\u043D\u044B.

`;
  }
  text += `\u{1F4AC} \u041F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0430 \u0438 \u0432\u043E\u043F\u0440\u043E\u0441\u044B: @mediabuy_adm`;
  const inline_keyboard = [
    [{ text: "\u{1F4F1} \u041E\u0442\u043A\u0440\u044B\u0442\u044C Mini App", web_app: { url: miniAppUrl } }],
    [{ text: "\u{1F468}\u200D\u{1F4BB} \u0421\u0432\u044F\u0437\u0430\u0442\u044C\u0441\u044F \u0441 \u043C\u0435\u043D\u0435\u0434\u0436\u0435\u0440\u043E\u043C", url: "https://t.me/mediabuy_adm" }]
  ];
  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: user.telegram_id,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
        reply_markup: { inline_keyboard }
      })
    });
    console.log(`[Push Notification Sent]: Order #${order.id} status '${newStatus}' sent to TG ID ${user.telegram_id}`);
  } catch (err) {
    console.error("Failed to send push notification to user:", err);
  }
}
function isAdminTelegramUser(tgId) {
  if (!tgId) return false;
  const numId = Number(tgId);
  if (!numId) return false;
  const envAdminStr = [
    process.env.TELEGRAM_ADMIN_CHAT_ID,
    process.env.ADMIN_CHAT_ID,
    process.env.ADMIN_IDS,
    process.env.ADMIN_TELEGRAM_IDS
  ].filter(Boolean).join(",");
  const adminIds = envAdminStr.split(/[\s,]+/).map((id) => Number(id.trim())).filter((id) => id && !isNaN(id));
  const userInDb = users.find((u) => u.telegram_id === numId);
  if (userInDb && userInDb.is_admin) return true;
  if (adminIds.length > 0) {
    return adminIds.includes(numId);
  }
  return false;
}
async function startTelegramBotPolling() {
  const botToken = process.env.BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
  const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID || process.env.ADMIN_CHAT_ID || (process.env.ADMIN_IDS ? process.env.ADMIN_IDS.split(",")[0].trim() : null);
  if (!botToken) {
    console.log("\u{1F916} [Telegram Bot] Warning: No BOT_TOKEN found in .env. Bot polling is disabled.");
    return;
  }
  try {
    const meRes = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
    const meData = await meRes.json();
    if (meData.ok && meData.result) {
      console.log(`\u{1F916} [Telegram Bot] Connected successfully! Bot username: @${meData.result.username} (${meData.result.first_name})`);
    } else {
      console.error(`\u274C [Telegram Bot] Failed to authorize bot token:`, meData);
    }
  } catch (err) {
    console.error(`\u26A0\uFE0F [Telegram Bot] Could not connect to Telegram API:`, err);
  }
  if (adminChatId) {
    console.log(`\u{1F4E9} [Telegram Bot] Admin notifications target chat ID: ${adminChatId}`);
  } else {
    console.log(`\u26A0\uFE0F [Telegram Bot] Warning: TELEGRAM_ADMIN_CHAT_ID is not configured in .env.`);
  }
  try {
    await fetch(`https://api.telegram.org/bot${botToken}/deleteWebhook?drop_pending_updates=false`);
  } catch (err) {
    console.error("\u{1F916} [Telegram Bot] Error clearing webhook:", err);
  }
  try {
    await fetch(`https://api.telegram.org/bot${botToken}/setMyCommands`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        commands: [
          { command: "start", description: "\u{1F680} \u0413\u043B\u0430\u0432\u043D\u043E\u0435 \u043C\u0435\u043D\u044E & Mini App" },
          { command: "menu", description: "\u{1F4F1} \u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u0433\u043B\u0430\u0432\u043D\u043E\u0435 \u043C\u0435\u043D\u044E" },
          { command: "contacts", description: "\u{1F468}\u200D\u{1F4BB} \u041A\u043E\u043D\u0442\u0430\u043A\u0442\u044B \u0438 \u043C\u0435\u043D\u0435\u0434\u0436\u0435\u0440\u044B" }
        ]
      })
    });
  } catch (err) {
    console.error("\u{1F916} [Telegram Bot] Error setting bot commands:", err);
  }
  try {
    let miniAppUrl = process.env.MINI_APP_URL || process.env.WEB_ADMIN_URL || "http://localhost:3000";
    if (!miniAppUrl.startsWith("http://") && !miniAppUrl.startsWith("https://")) {
      miniAppUrl = `https://${miniAppUrl}`;
    }
    await fetch(`https://api.telegram.org/bot${botToken}/setChatMenuButton`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        menu_button: {
          type: "web_app",
          text: "\u041E\u0442\u043A\u0440\u044B\u0442\u044C Mini App",
          web_app: { url: miniAppUrl }
        }
      })
    });
  } catch (err) {
    console.error("\u{1F916} [Telegram Bot] Error setting menu button:", err);
  }
  console.log(`\u{1F680} [Telegram Bot] Long-polling loop started. Bot is listening for /start and commands...
`);
  let updateOffset = 0;
  let isPolling = true;
  const poll = async () => {
    while (isPolling) {
      try {
        const res = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates?offset=${updateOffset}&timeout=20`);
        if (!res.ok) {
          await new Promise((r) => setTimeout(r, 5e3));
          continue;
        }
        const data = await res.json();
        if (data.ok && Array.isArray(data.result)) {
          for (const update of data.result) {
            updateOffset = update.update_id + 1;
            await handleTelegramUpdate(botToken, update);
          }
        }
      } catch (err) {
        await new Promise((r) => setTimeout(r, 5e3));
      }
    }
  };
  poll();
}
async function handleTelegramUpdate(botToken, update) {
  try {
    let fromUser = null;
    let chatId = null;
    let isCommandStart = false;
    if (update.message) {
      fromUser = update.message.from;
      chatId = update.message.chat.id;
      const text = (update.message.text || "").trim();
      if (text.startsWith("/admin_menu") || text.startsWith("/admin") || text.startsWith("/adminpanel")) {
        const userTgId = fromUser?.id || chatId;
        if (!isAdminTelegramUser(userTgId)) {
          await sendOrEditTelegramMessage(
            botToken,
            chatId,
            `\u26D4\uFE0F <b>\u0414\u043E\u0441\u0442\u0443\u043F \u043E\u0433\u0440\u0430\u043D\u0438\u0447\u0435\u043D</b>

\u0423 \u0432\u0430\u0441 \u043D\u0435\u0442 \u043F\u0440\u0430\u0432 \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440\u0430 \u0434\u043B\u044F \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u043D\u0438\u044F \u044D\u0442\u043E\u0439 \u043A\u043E\u043C\u0430\u043D\u0434\u044B.`,
            [[{ text: "\u{1F4F1} \u0413\u043B\u0430\u0432\u043D\u043E\u0435 \u043C\u0435\u043D\u044E", callback_data: "action_main_menu" }]]
          );
          return;
        }
        await sendAdminMenuMessage(botToken, chatId);
        return;
      } else if (text.startsWith("/contacts") || text.startsWith("/managers")) {
        await sendManagersMessage(botToken, chatId);
        return;
      } else if (text.startsWith("/start") || text.startsWith("/menu")) {
        isCommandStart = true;
      }
    } else if (update.callback_query) {
      fromUser = update.callback_query.from;
      chatId = update.callback_query.message.chat.id;
      const callbackData = update.callback_query.data || "";
      const messageId = update.callback_query.message?.message_id;
      fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callback_query_id: update.callback_query.id })
      }).catch(() => {
      });
      if (callbackData === "action_admin_menu" || callbackData === "action_admin_stats" || callbackData === "action_admin_wallets") {
        const userTgId = fromUser?.id || chatId;
        if (!isAdminTelegramUser(userTgId)) {
          await sendOrEditTelegramMessage(
            botToken,
            chatId,
            `\u26D4\uFE0F <b>\u0414\u043E\u0441\u0442\u0443\u043F \u043E\u0433\u0440\u0430\u043D\u0438\u0447\u0435\u043D</b>

\u0423 \u0432\u0430\u0441 \u043D\u0435\u0442 \u043F\u0440\u0430\u0432 \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440\u0430.`,
            [[{ text: "\u{1F4F1} \u0413\u043B\u0430\u0432\u043D\u043E\u0435 \u043C\u0435\u043D\u044E", callback_data: "action_main_menu", style: "danger" }]],
            messageId
          );
          return;
        }
        if (callbackData === "action_admin_menu") {
          await sendAdminMenuMessage(botToken, chatId, messageId);
          return;
        } else if (callbackData === "action_admin_stats") {
          await sendAdminStatsMessage(botToken, chatId, messageId);
          return;
        } else if (callbackData === "action_admin_wallets") {
          await sendAdminWalletsMessage(botToken, chatId, messageId);
          return;
        }
      } else if (callbackData === "action_managers" || callbackData === "action_3") {
        await sendManagersMessage(botToken, chatId, messageId);
        return;
      } else if (callbackData === "action_guarantees" || callbackData === "action_5") {
        await sendGuaranteesMessage(botToken, chatId, messageId);
        return;
      } else if (callbackData === "action_docs" || callbackData === "action_4") {
        await sendDocsMessage(botToken, chatId, messageId);
        return;
      } else if (callbackData === "action_main_menu") {
        await sendBotMenuMessage(botToken, chatId);
        return;
      } else {
        const btnIdStr = callbackData.replace("action_", "");
        const btn = homeSettings.bot_buttons?.find((b) => String(b.id) === btnIdStr);
        if (btn) {
          const btnTextLower = btn.text.toLowerCase();
          if (btnTextLower.includes("\u043C\u0435\u043D\u0435\u0434\u0436\u0435\u0440")) {
            await sendManagersMessage(botToken, chatId, messageId);
            return;
          }
          if (btnTextLower.includes("\u0433\u0430\u0440\u0430\u043D\u0442")) {
            await sendGuaranteesMessage(botToken, chatId, messageId);
            return;
          }
          if (btnTextLower.includes("\u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442")) {
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
          first_name: fromUser.first_name || "User",
          last_name: fromUser.last_name || null,
          next_order_discount_percent: 0,
          is_admin: isAdmin
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
    console.error("Error handling Telegram update:", e);
  }
}
async function sendOrEditTelegramMessage(botToken, chatId, text, inline_keyboard, messageId) {
  let edited = false;
  if (messageId) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${botToken}/editMessageText`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          message_id: messageId,
          text,
          parse_mode: "HTML",
          disable_web_page_preview: true,
          reply_markup: { inline_keyboard }
        })
      });
      const data = await res.json();
      if (data.ok) edited = true;
    } catch (err) {
    }
  }
  if (!edited) {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
        reply_markup: { inline_keyboard }
      })
    });
  }
}
async function sendAdminMenuMessage(botToken, chatId, messageId) {
  if (!isAdminTelegramUser(chatId)) {
    await sendOrEditTelegramMessage(
      botToken,
      chatId,
      `\u26D4\uFE0F <b>\u0414\u043E\u0441\u0442\u0443\u043F \u043E\u0433\u0440\u0430\u043D\u0438\u0447\u0435\u043D</b>

\u0423 \u0432\u0430\u0441 \u043D\u0435\u0442 \u043F\u0440\u0430\u0432 \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440\u0430.`,
      [[{ text: "\u{1F4F1} \u0413\u043B\u0430\u0432\u043D\u043E\u0435 \u043C\u0435\u043D\u044E", callback_data: "action_main_menu", style: "danger" }]],
      messageId
    );
    return;
  }
  let miniAppUrl = process.env.MINI_APP_URL || process.env.WEB_ADMIN_URL || "http://localhost:3000";
  if (!miniAppUrl.startsWith("http://") && !miniAppUrl.startsWith("https://")) {
    miniAppUrl = `https://${miniAppUrl}`;
  }
  const adminMiniAppUrl = `${miniAppUrl}/#/admin`;
  const adminDirectUrl = `${miniAppUrl}/admin`;
  const totalOrdersCount = orders.length;
  const waitingOrdersCount = orders.filter((o) => o.status === "waiting_payment").length;
  const totalReqsCount = serviceRequests.length;
  const totalProductsCount = products.filter((p) => p.is_visible).length;
  const text = `\u2699\uFE0F <b>\u041F\u0410\u041D\u0415\u041B\u042C \u0410\u0414\u041C\u0418\u041D\u0418\u0421\u0422\u0420\u0410\u0422\u041E\u0420\u0410 Mediabuy Lab</b>
\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
\u041F\u0440\u0438\u0432\u0435\u0442\u0441\u0442\u0432\u0443\u0435\u043C \u0432 \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u0438\u0432\u043D\u043E\u043C \u043C\u0435\u043D\u044E \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F!

\u{1F4CA} <b>\u0422\u0435\u043A\u0443\u0449\u0430\u044F \u0441\u0432\u043E\u0434\u043A\u0430:</b>
\u2022 \u0412\u0441\u0435\u0433\u043E \u0437\u0430\u043A\u0430\u0437\u043E\u0432: <b>${totalOrdersCount}</b> (\u043E\u0436\u0438\u0434\u0430\u044E\u0442 \u043E\u043F\u043B\u0430\u0442\u044B: <b>${waitingOrdersCount}</b>)
\u2022 \u0417\u0430\u044F\u0432\u043E\u043A (\u0417\u0430\u043F\u0443\u0441\u043A/\u041E\u0431\u0443\u0447\u0435\u043D\u0438\u0435): <b>${totalReqsCount}</b>
\u2022 \u0410\u043A\u0442\u0438\u0432\u043D\u044B\u0445 \u0442\u043E\u0432\u0430\u0440\u043E\u0432 \u0432 \u043A\u0430\u0442\u0430\u043B\u043E\u0433\u0435: <b>${totalProductsCount}</b>
\u2022 \u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435\u0439 \u0432 \u0431\u0430\u0437\u0435: <b>${users.length}</b>

\u{1F511} <b>\u0414\u0430\u043D\u043D\u044B\u0435 \u0434\u043B\u044F \u0432\u0445\u043E\u0434\u0430 \u0432 \u0412\u0435\u0431-\u0430\u0434\u043C\u0438\u043D\u043A\u0443:</b>
\u041B\u043E\u0433\u0438\u043D: <code>admin</code>
\u041F\u0430\u0440\u043E\u043B\u044C: <code>adminpass123</code>

\u{1F447} \u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u0438\u043B\u0438 \u043D\u0430\u0436\u043C\u0438\u0442\u0435 \u043A\u043D\u043E\u043F\u043A\u0443 \u043D\u0438\u0436\u0435 \u0434\u043B\u044F \u043E\u0442\u043A\u0440\u044B\u0442\u0438\u044F Admin Mini App:`;
  const inline_keyboard = [
    [{ text: "\u{1F510} \u041E\u0442\u043A\u0440\u044B\u0442\u044C Admin Mini App", web_app: { url: adminMiniAppUrl }, style: "success" }],
    [{ text: "\u{1F310} \u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0412\u0435\u0431-\u041F\u0430\u043D\u0435\u043B\u044C \u0432 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0435", url: adminDirectUrl, style: "primary" }],
    [{ text: "\u{1F4CA} \u0411\u044B\u0441\u0442\u0440\u0430\u044F \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0430", callback_data: "action_admin_stats", style: "primary" }],
    [{ text: "\u{1F4B3} \u041A\u043E\u0448\u0435\u043B\u044C\u043A\u0438 \u0438 \u0440\u0435\u043A\u0432\u0438\u0437\u0438\u0442\u044B", callback_data: "action_admin_wallets", style: "primary" }],
    [{ text: "\u{1F519} \u041D\u0430\u0437\u0430\u0434 \u0432 \u0433\u043B\u0430\u0432\u043D\u043E\u0435 \u043C\u0435\u043D\u044E", callback_data: "action_main_menu", style: "danger" }]
  ];
  await sendOrEditTelegramMessage(botToken, chatId, text, inline_keyboard, messageId);
}
async function sendAdminStatsMessage(botToken, chatId, messageId) {
  if (!isAdminTelegramUser(chatId)) {
    await sendOrEditTelegramMessage(
      botToken,
      chatId,
      `\u26D4\uFE0F <b>\u0414\u043E\u0441\u0442\u0443\u043F \u043E\u0433\u0440\u0430\u043D\u0438\u0447\u0435\u043D</b>

\u0423 \u0432\u0430\u0441 \u043D\u0435\u0442 \u043F\u0440\u0430\u0432 \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440\u0430.`,
      [[{ text: "\u{1F4F1} \u0413\u043B\u0430\u0432\u043D\u043E\u0435 \u043C\u0435\u043D\u044E", callback_data: "action_main_menu", style: "danger" }]],
      messageId
    );
    return;
  }
  const totalRevenue = orders.reduce((acc, o) => acc + (Number(o.total_amount) || 0), 0);
  const waitingOrders = orders.filter((o) => o.status === "waiting_payment");
  const launchReqs = serviceRequests.filter((r) => r.request_type === "launch_ads").length;
  const trainingReqs = serviceRequests.filter((r) => r.request_type === "training").length;
  const text = `\u{1F4CA} <b>\u0421\u0422\u0410\u0422\u0418\u0421\u0422\u0418\u041A\u0410 \u0418 \u0421\u0412\u041E\u0414\u041A\u0410 (\u0410\u0414\u041C\u0418\u041D)</b>
\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
\u{1F4B0} <b>\u041E\u0431\u0449\u0430\u044F \u0441\u0443\u043C\u043C\u0430 \u0437\u0430\u043A\u0430\u0437\u043E\u0432:</b> $${totalRevenue.toFixed(2)} USD
\u{1F4E6} <b>\u0412\u0441\u0435\u0433\u043E \u0437\u0430\u043A\u0430\u0437\u043E\u0432:</b> ${orders.length}
\u23F3 <b>\u041E\u0436\u0438\u0434\u0430\u044E\u0442 \u043E\u043F\u043B\u0430\u0442\u044B:</b> ${waitingOrders.length}

\u{1F680} <b>\u0417\u0430\u044F\u0432\u043E\u043A \u043D\u0430 \u0417\u0430\u043F\u0443\u0441\u043A:</b> ${launchReqs}
\u{1F393} <b>\u0417\u0430\u044F\u0432\u043E\u043A \u043D\u0430 \u041E\u0431\u0443\u0447\u0435\u043D\u0438\u0435:</b> ${trainingReqs}

\u{1F464} <b>\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435\u0439 \u0432 \u0441\u0438\u0441\u0442\u0435\u043C\u0435:</b> ${users.length}
\u{1F6CD} <b>\u0422\u043E\u0432\u0430\u0440\u043E\u0432 \u0432 \u043A\u0430\u0442\u0430\u043B\u043E\u0433\u0435:</b> ${products.length}`;
  const inline_keyboard = [
    [{ text: "\u{1F504} \u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0443", callback_data: "action_admin_stats", style: "primary" }],
    [{ text: "\u2699\uFE0F \u041D\u0430\u0437\u0430\u0434 \u0432 \u0410\u0434\u043C\u0438\u043D \u041C\u0435\u043D\u044E", callback_data: "action_admin_menu", style: "primary" }],
    [{ text: "\u{1F519} \u0413\u043B\u0430\u0432\u043D\u043E\u0435 \u043C\u0435\u043D\u044E", callback_data: "action_main_menu", style: "danger" }]
  ];
  await sendOrEditTelegramMessage(botToken, chatId, text, inline_keyboard, messageId);
}
async function sendAdminWalletsMessage(botToken, chatId, messageId) {
  if (!isAdminTelegramUser(chatId)) {
    await sendOrEditTelegramMessage(
      botToken,
      chatId,
      `\u26D4\uFE0F <b>\u0414\u043E\u0441\u0442\u0443\u043F \u043E\u0433\u0440\u0430\u043D\u0438\u0447\u0435\u043D</b>

\u0423 \u0432\u0430\u0441 \u043D\u0435\u0442 \u043F\u0440\u0430\u0432 \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440\u0430.`,
      [[{ text: "\u{1F4F1} \u0413\u043B\u0430\u0432\u043D\u043E\u0435 \u043C\u0435\u043D\u044E", callback_data: "action_main_menu", style: "danger" }]],
      messageId
    );
    return;
  }
  const trc20 = process.env.CRYPTO_WALLET_TRC20 || "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
  const bep20 = process.env.CRYPTO_WALLET_BEP20 || "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";
  const btc = process.env.CRYPTO_WALLET_BTC || "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa";
  const text = `\u{1F4B3} <b>\u041A\u041E\u0428\u0415\u041B\u042C\u041A\u0418 \u0414\u041B\u042F \u041F\u0420\u0418\u0415\u041C\u0410 \u041E\u041F\u041B\u0410\u0422\u042B</b>
\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
<b>USDT TRC20:</b>
<code>${trc20}</code>

<b>USDT BEP20:</b>
<code>${bep20}</code>

<b>Bitcoin (BTC):</b>
<code>${btc}</code>

<i>\u0412\u044B \u043C\u043E\u0436\u0435\u0442\u0435 \u0438\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u044D\u0442\u0438 \u043A\u043E\u0448\u0435\u043B\u044C\u043A\u0438 \u0447\u0435\u0440\u0435\u0437 \u043F\u0435\u0440\u0435\u043C\u0435\u043D\u043D\u044B\u0435 \u043E\u043A\u0440\u0443\u0436\u0435\u043D\u0438\u044F (.env) \u0438\u043B\u0438 \u0432 Admin Mini App.</i>`;
  const inline_keyboard = [
    [{ text: "\u2699\uFE0F \u041D\u0430\u0437\u0430\u0434 \u0432 \u0410\u0434\u043C\u0438\u043D \u041C\u0435\u043D\u044E", callback_data: "action_admin_menu", style: "primary" }],
    [{ text: "\u{1F519} \u0413\u043B\u0430\u0432\u043D\u043E\u0435 \u043C\u0435\u043D\u044E", callback_data: "action_main_menu", style: "danger" }]
  ];
  await sendOrEditTelegramMessage(botToken, chatId, text, inline_keyboard, messageId);
}
async function sendManagersMessage(botToken, chatId, messageId) {
  const text = `\u{1F468}\u200D\u{1F4BB} <b>\u041D\u0430\u0448\u0438 \u041C\u0435\u043D\u0435\u0434\u0436\u0435\u0440\u044B Mediabuy Lab</b>

\u041D\u0430\u0448\u0430 \u043A\u043E\u043C\u0430\u043D\u0434\u0430 \u0441\u043F\u0435\u0446\u0438\u0430\u043B\u0438\u0441\u0442\u043E\u0432 \u0433\u043E\u0442\u043E\u0432\u0430 \u043F\u0440\u043E\u043A\u043E\u043D\u0441\u0443\u043B\u044C\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0432\u0430\u0441 \u043F\u043E \u0437\u0430\u043A\u0443\u043F\u043A\u0435 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u043E\u0432, \u0437\u0430\u043F\u0443\u0441\u043A\u0443 \u0440\u0435\u043A\u043B\u0430\u043C\u043D\u044B\u0445 \u043A\u0430\u043C\u043F\u0430\u043D\u0438\u0439 \u0438 \u043E\u0431\u0443\u0447\u0435\u043D\u0438\u044E:

\u{1F6E1}\uFE0F <b>\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0410\u0434\u043C\u0438\u043D:</b> @mediabuy_adm \u2014 \u041F\u0435\u0440\u0441\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0435 \u0432\u043E\u043F\u0440\u043E\u0441\u044B \u0438 \u043E\u043F\u0442\u043E\u0432\u044B\u0435 \u0441\u0434\u0435\u043B\u043A\u0438
\u{1F464} <b>\u041C\u0435\u043D\u0435\u0434\u0436\u0435\u0440 \u0421\u0435\u0440\u0433\u0435\u0439:</b> @sergey_mediabuy \u2014 \u041A\u043E\u043D\u0441\u0443\u043B\u044C\u0442\u0430\u0446\u0438\u0438 \u0438 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0430
\u{1F464} <b>\u041C\u0435\u043D\u0435\u0434\u0436\u0435\u0440 \u0410\u043D\u0442\u043E\u043D:</b> @Anton_mediabuy \u2014 \u041F\u043E\u0434\u0431\u043E\u0440 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u043E\u0432 \u0438 \u043A\u043E\u043D\u0441\u0443\u043B\u044C\u0442\u0430\u0446\u0438\u0438 \u043F\u043E \u0437\u0430\u043F\u0443\u0441\u043A\u0443
\u{1F464} <b>\u041C\u0435\u043D\u0435\u0434\u0436\u0435\u0440 \u0412\u0438\u043A\u0442\u043E\u0440\u0438\u044F:</b> @Victorys_mediabuy \u2014 \u0412\u043E\u043F\u0440\u043E\u0441\u044B \u043F\u043E \u043E\u0431\u0443\u0447\u0435\u043D\u0438\u044E \u043A\u043B\u0438\u0435\u043D\u0442\u043E\u0432`;
  const inline_keyboard = [
    [{ text: "\u{1F6E1}\uFE0F \u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0410\u0434\u043C\u0438\u043D", url: "https://t.me/mediabuy_adm", style: "primary" }],
    [{ text: "\u{1F464} \u041C\u0435\u043D\u0435\u0434\u0436\u0435\u0440 \u0421\u0435\u0440\u0433\u0435\u0439", url: "https://t.me/sergey_mediabuy", style: "primary" }],
    [{ text: "\u{1F464} \u041C\u0435\u043D\u0435\u0434\u0436\u0435\u0440 \u0410\u043D\u0442\u043E\u043D", url: "https://t.me/Anton_mediabuy", style: "primary" }],
    [{ text: "\u{1F464} \u041C\u0435\u043D\u0435\u0434\u0436\u0435\u0440 \u0412\u0438\u043A\u0442\u043E\u0440\u0438\u044F", url: "https://t.me/Victorys_mediabuy", style: "primary" }],
    [{ text: "\u{1F519} \u041D\u0430\u0437\u0430\u0434 \u0432 \u0433\u043B\u0430\u0432\u043D\u043E\u0435 \u043C\u0435\u043D\u044E", callback_data: "action_main_menu", style: "danger" }]
  ];
  await sendOrEditTelegramMessage(botToken, chatId, text, inline_keyboard, messageId);
}
async function sendGuaranteesMessage(botToken, chatId, messageId) {
  let miniAppUrl = process.env.MINI_APP_URL || process.env.WEB_ADMIN_URL || "http://localhost:3000";
  if (!miniAppUrl.startsWith("http://") && !miniAppUrl.startsWith("https://")) {
    miniAppUrl = `https://${miniAppUrl}`;
  }
  const text = `\u{1F6E1}\uFE0F <b>\u0413\u0430\u0440\u0430\u043D\u0442\u0438\u0438 \u043A\u0430\u0447\u0435\u0441\u0442\u0432\u0430 Mediabuy Lab</b>

\u041C\u044B \u0446\u0435\u043D\u0438\u043C \u0434\u043E\u0432\u0435\u0440\u0438\u0435 \u043D\u0430\u0448\u0438\u0445 \u043A\u043B\u0438\u0435\u043D\u0442\u043E\u0432 \u0438 \u043E\u0431\u0435\u0441\u043F\u0435\u0447\u0438\u0432\u0430\u0435\u043C \u043C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u0443\u044E \u043D\u0430\u0434\u0435\u0436\u043D\u043E\u0441\u0442\u044C \u043D\u0430 \u043A\u0430\u0436\u0434\u043E\u043C \u044D\u0442\u0430\u043F\u0435:

1\uFE0F\u20E3 <b>100% \u041F\u0440\u043E\u0432\u0435\u0440\u043A\u0430 \u043A\u0430\u0447\u0435\u0441\u0442\u0432\u0430:</b> \u0412\u0441\u0435 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u044B \u043F\u0440\u043E\u0445\u043E\u0434\u044F\u0442 \u0440\u0443\u0447\u043D\u0443\u044E \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0443, \u043E\u0442\u043B\u0435\u0436\u043A\u0443 \u0438 \u043F\u0440\u043E\u0433\u0440\u0435\u0432 \u043F\u0435\u0440\u0435\u0434 \u043F\u0440\u043E\u0434\u0430\u0436\u0435\u0439.
2\uFE0F\u20E3 <b>\u0417\u0430\u043C\u0435\u043D\u0430 \u0432 \u0442\u0435\u0447\u0435\u043D\u0438\u0435 24 \u0447\u0430\u0441\u043E\u0432:</b> \u041F\u0440\u0438 \u043E\u0431\u043D\u0430\u0440\u0443\u0436\u0435\u043D\u0438\u0438 \u043D\u0435\u0432\u0430\u043B\u0438\u0434\u043D\u043E\u0441\u0442\u0438 \u043F\u0440\u0438 \u043F\u0435\u0440\u0432\u043E\u043C \u0432\u0445\u043E\u0434\u0435 \u0431\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u043E \u0434\u0435\u043B\u0430\u0435\u043C \u0437\u0430\u043C\u0435\u043D\u0443.
3\uFE0F\u20E3 <b>\u041E\u0444\u0438\u0446\u0438\u0430\u043B\u044C\u043D\u044B\u0435 \u0443\u0441\u043B\u0443\u0433\u0438:</b> \u041F\u0440\u043E\u0437\u0440\u0430\u0447\u043D\u044B\u0435 \u0443\u0441\u043B\u043E\u0432\u0438\u044F \u043D\u0430 \u0437\u0430\u043F\u0443\u0441\u043A \u0440\u0435\u043A\u043B\u0430\u043C\u044B \u0438 \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u043C\u044B \u043E\u0431\u0443\u0447\u0435\u043D\u0438\u044F \u0441 \u0432\u0435\u0434\u0435\u043D\u0438\u0435\u043C \u0434\u043E \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u0430.
4\uFE0F\u20E3 <b>\u0411\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u044B\u0435 \u043F\u043B\u0430\u0442\u0435\u0436\u0438:</b> \u041F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0430 \u043E\u043F\u043B\u0430\u0442\u044B \u0447\u0435\u0440\u0435\u0437 \u043A\u0440\u0438\u043F\u0442\u043E\u0432\u0430\u043B\u044E\u0442\u0443 \u0438 \u0433\u0430\u0440\u0430\u043D\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0435 \u0441\u0435\u0440\u0432\u0438\u0441\u044B.
5\uFE0F\u20E3 <b>\u041F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0430 24/7:</b> \u041D\u0430\u0448\u0430 \u043A\u043E\u043C\u0430\u043D\u0434\u0430 \u043C\u0435\u043D\u0435\u0434\u0436\u0435\u0440\u043E\u0432 \u0432\u0441\u0435\u0433\u0434\u0430 \u043D\u0430 \u0441\u0432\u044F\u0437\u0438 \u0438 \u0433\u043E\u0442\u043E\u0432\u0430 \u043F\u043E\u043C\u043E\u0447\u044C \u0432 \u043B\u044E\u0431\u044B\u0445 \u0441\u0438\u0442\u0443\u0430\u0446\u0438\u044F\u0445.`;
  const inline_keyboard = [
    [{ text: "\u{1F680} \u041E\u0442\u043A\u0440\u044B\u0442\u044C Mini App (\u041A\u0430\u0442\u0430\u043B\u043E\u0433)", web_app: { url: miniAppUrl }, style: "success" }],
    [{ text: "\u{1F468}\u200D\u{1F4BB} \u0421\u0432\u044F\u0437\u0430\u0442\u044C\u0441\u044F \u0441 \u043C\u0435\u043D\u0435\u0434\u0436\u0435\u0440\u043E\u043C", callback_data: "action_managers", style: "primary" }],
    [{ text: "\u{1F519} \u041D\u0430\u0437\u0430\u0434 \u0432 \u0433\u043B\u0430\u0432\u043D\u043E\u0435 \u043C\u0435\u043D\u044E", callback_data: "action_main_menu", style: "danger" }]
  ];
  await sendOrEditTelegramMessage(botToken, chatId, text, inline_keyboard, messageId);
}
async function sendDocsMessage(botToken, chatId, messageId) {
  let miniAppUrl = process.env.MINI_APP_URL || process.env.WEB_ADMIN_URL || "http://localhost:3000";
  if (!miniAppUrl.startsWith("http://") && !miniAppUrl.startsWith("https://")) {
    miniAppUrl = `https://${miniAppUrl}`;
  }
  const docMiniAppUrl = `${miniAppUrl}/#/documents`;
  const registryUrl = "https://find-and-update.company-information.service.gov.uk/company/10549229";
  const text = `\u{1F3DB} <b>\u041E\u0444\u0438\u0446\u0438\u0430\u043B\u044C\u043D\u0430\u044F \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F Mediabuy Lab (Companies House)</b>

\u041C\u044B \u044F\u0432\u043B\u044F\u0435\u043C\u0441\u044F \u043E\u0444\u0438\u0446\u0438\u0430\u043B\u044C\u043D\u043E \u0437\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u043E\u0439 \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0435\u0439 \u0432 \u0433\u043E\u0441\u0443\u0434\u0430\u0440\u0441\u0442\u0432\u0435\u043D\u043D\u043E\u043C \u0440\u0435\u0435\u0441\u0442\u0440\u0435 \u0412\u0435\u043B\u0438\u043A\u043E\u0431\u0440\u0438\u0442\u0430\u043D\u0438\u0438 (Companies House, \u2116 10549229).

\u{1F517} <b>\u0421\u0441\u044B\u043B\u043A\u0430 \u043D\u0430 \u0433\u043E\u0441\u0443\u0434\u0430\u0440\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0439 \u0440\u0435\u0435\u0441\u0442\u0440:</b>
${registryUrl}

\u{1F447} \u0412\u044B \u043C\u043E\u0436\u0435\u0442\u0435 \u043F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u0441\u0442\u0430\u0442\u0443\u0441 \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438 \u0438 \u0432\u0441\u0435 \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u043E\u043D\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435:`;
  const inline_keyboard = [
    [{ text: "\u{1F3DB} \u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0440\u0435\u0435\u0441\u0442\u0440 \u0412\u0435\u043B\u0438\u043A\u043E\u0431\u0440\u0438\u0442\u0430\u043D\u0438\u0438", url: registryUrl, style: "primary" }],
    [{ text: "\u{1F4F1} \u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0440\u0430\u0437\u0434\u0435\u043B \u0432 Mini App", web_app: { url: docMiniAppUrl }, style: "success" }],
    [{ text: "\u{1F519} \u041D\u0430\u0437\u0430\u0434 \u0432 \u0433\u043B\u0430\u0432\u043D\u043E\u0435 \u043C\u0435\u043D\u044E", callback_data: "action_main_menu", style: "danger" }]
  ];
  await sendOrEditTelegramMessage(botToken, chatId, text, inline_keyboard, messageId);
}
async function sendBotMenuMessage(botToken, chatId) {
  let miniAppUrl = process.env.MINI_APP_URL || process.env.WEB_ADMIN_URL || "http://localhost:3000";
  if (!miniAppUrl.startsWith("http://") && !miniAppUrl.startsWith("https://")) {
    miniAppUrl = `https://${miniAppUrl}`;
  }
  const inline_keyboard = [];
  const rawButtons = homeSettings.bot_buttons || [];
  for (const btn of rawButtons) {
    const btnText = btn.text || "\u041A\u043D\u043E\u043F\u043A\u0430";
    const btnTextLower = btnText.toLowerCase();
    const btnStyle = btn.style || "primary";
    if (btn.is_web_app) {
      inline_keyboard.push([
        {
          text: btnText,
          web_app: { url: miniAppUrl },
          style: btnStyle
        }
      ]);
    } else if (btn.url) {
      inline_keyboard.push([
        {
          text: btnText,
          url: btn.url,
          style: btnStyle
        }
      ]);
    } else if (btnTextLower.includes("\u043C\u0435\u043D\u0435\u0434\u0436\u0435\u0440") || btn.id === 3) {
      inline_keyboard.push([
        {
          text: btnText,
          callback_data: "action_managers",
          style: btnStyle
        }
      ]);
    } else if (btnTextLower.includes("\u0433\u0430\u0440\u0430\u043D\u0442") || btn.id === 5) {
      inline_keyboard.push([
        {
          text: btnText,
          callback_data: "action_guarantees",
          style: btnStyle
        }
      ]);
    } else {
      inline_keyboard.push([
        {
          text: btnText,
          callback_data: `action_${btn.id}`,
          style: btnStyle
        }
      ]);
    }
  }
  if (inline_keyboard.length === 0) {
    inline_keyboard.push([
      {
        text: "\u{1F680} \u041E\u0442\u043A\u0440\u044B\u0442\u044C Mini App",
        web_app: { url: miniAppUrl },
        style: "success"
      }
    ]);
  }
  if (isAdminTelegramUser(chatId)) {
    inline_keyboard.push([
      {
        text: "\u2699\uFE0F \u041F\u0430\u043D\u0435\u043B\u044C \u0410\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440\u0430",
        callback_data: "action_admin_menu",
        style: "primary"
      }
    ]);
  }
  const title = homeSettings.bot_menu_title || "\u{1F525} Mediabuy Lab Bot";
  const desc = homeSettings.bot_menu_description || "\u0414\u043E\u0431\u0440\u043E \u043F\u043E\u0436\u0430\u043B\u043E\u0432\u0430\u0442\u044C \u0432 \u0431\u043E\u0442\u0430!";
  const fullText = `<b>${title}</b>

${desc}`;
  const photoUrl = homeSettings.bot_menu_image_url;
  let sentPhotoSuccess = false;
  if (photoUrl && photoUrl.startsWith("http")) {
    try {
      const photoRes = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          photo: photoUrl,
          caption: fullText,
          parse_mode: "HTML",
          reply_markup: { inline_keyboard }
        })
      });
      const photoData = await photoRes.json();
      if (photoData.ok) {
        sentPhotoSuccess = true;
      }
    } catch (err) {
    }
  }
  if (!sentPhotoSuccess) {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: fullText,
        parse_mode: "HTML",
        disable_web_page_preview: true,
        reply_markup: { inline_keyboard }
      })
    });
  }
}
app.get("/api/orders/my", (req, res) => {
  const user = getUserFromReq(req);
  const myOrders = orders.filter((o) => o.user_id === user.id).reverse();
  res.json(myOrders);
});
app.post("/api/orders", (req, res) => {
  const user = getUserFromReq(req);
  const { items, currency = "USD", payment_method = "crypto_direct", crypto_currency = "USDT_TRC20" } = req.body;
  if (!items || !items.length) {
    return res.status(400).json({ detail: "Cart is empty" });
  }
  let total = 0;
  const orderItems = [];
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
      unit_price: p.price
    });
  }
  let discount = user.next_order_discount_percent || 0;
  if (discount > 0) {
    total = total * (100 - discount) / 100;
  }
  const finalUsdAmount = Math.round(total * 100) / 100;
  const walletInfo = getNextWalletForCurrency(crypto_currency);
  const assignedWallet = walletInfo.wallet;
  const walletIndexNum = walletInfo.indexNumber;
  const poolTotalNum = walletInfo.poolTotal;
  const cryptoAmountStr = calculateCryptoAmount(finalUsdAmount, crypto_currency);
  const qrCodeUrlStr = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(assignedWallet)}`;
  const order = {
    id: nextOrderId++,
    user_id: user.id,
    currency,
    total_amount: finalUsdAmount,
    status: "waiting_payment",
    discount_percent: discount,
    payment_method: "crypto_direct",
    crypto_currency,
    assigned_wallet: assignedWallet,
    wallet_index: walletIndexNum,
    crypto_amount: cryptoAmountStr,
    qr_code_url: qrCodeUrlStr,
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    items: orderItems
  };
  orders.push(order);
  cartItems = cartItems.filter((ci) => ci.user_id !== user.id);
  const itemsSummary = orderItems.map((oi) => {
    const p = products.find((prod) => prod.id === oi.product_id);
    return `  \u2022 <b>${p ? p.title : "\u0422\u043E\u0432\u0430\u0440 #" + oi.product_id}</b> x${oi.quantity} \u2014 $${oi.unit_price * oi.quantity}`;
  }).join("\n");
  const usernameText = user.username ? `@${user.username}` : "\u043D\u0435\u0442 username";
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ") || "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C";
  getGeoAndDeviceInfo(req).then(({ ip, device, geoStr }) => {
    const orderMsg = `\u26A1\uFE0F <b>\u041D\u041E\u0412\u042B\u0419 \u041A\u0420\u0418\u041F\u0422\u041E-\u0417\u0410\u041A\u0410\u0417 #${order.id} (\u041F\u0440\u044F\u043C\u043E\u0439 \u043F\u0435\u0440\u0435\u0432\u043E\u0434)</b>
\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
\u{1F464} <b>\u041F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u044C:</b> ${fullName} (${usernameText})
\u{1F194} <b>Telegram ID:</b> <code>${user.telegram_id}</code>
\u{1F4B5} <b>\u0421\u0443\u043C\u043C\u0430:</b> $${order.total_amount} USD ${order.discount_percent > 0 ? `<i>(\u0421\u043A\u0438\u0434\u043A\u0430 ${order.discount_percent}%)</i>` : ""}
\u{1FA99} <b>\u041A \u043E\u043F\u043B\u0430\u0442\u0435:</b> <code>${order.crypto_amount}</code> (${order.crypto_currency})
\u{1F4EB} <b>\u0412\u044B\u0434\u0430\u043D\u043D\u044B\u0439 \u043A\u043E\u0448\u0435\u043B\u0435\u043A (#${order.wallet_index}/${poolTotalNum}):</b>
<code>${order.assigned_wallet}</code>

\u{1F6CD} <b>\u0421\u043E\u0441\u0442\u0430\u0432 \u0437\u0430\u043A\u0430\u0437\u0430:</b>
${itemsSummary}

\u{1F310} <b>IP \u0430\u0434\u0440\u0435\u0441:</b> <code>${ip}</code>
\u{1F30D} <b>\u041B\u043E\u043A\u0430\u0446\u0438\u044F:</b> ${geoStr}
\u{1F4F1} <b>\u0423\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u043E:</b> ${device}
\u23F0 <b>\u0414\u0430\u0442\u0430:</b> ${(/* @__PURE__ */ new Date()).toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })} \u041C\u0421\u041A`;
    sendTelegramAdminNotification(orderMsg);
  });
  res.json(order);
});
app.post("/api/orders/:id/send-telegram-receipt", async (req, res) => {
  const user = getUserFromReq(req);
  const orderId = Number(req.params.id);
  const order = orders.find((o) => o.id === orderId);
  if (!order) {
    return res.status(404).json({ detail: "Order not found" });
  }
  const itemsSummary = order.items.map((oi) => {
    const p = products.find((prod) => prod.id === oi.product_id);
    const title = p ? p.title : `\u0422\u043E\u0432\u0430\u0440 #${oi.product_id}`;
    return `  \u2022 <b>${title}</b> x${oi.quantity} \u2014 $${(oi.unit_price * oi.quantity).toFixed(2)} USD`;
  }).join("\n");
  const usernameText = user.username ? `@${user.username}` : "\u043D\u0435\u0442 username";
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ") || "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C";
  const receiptMsg = `\u{1F9FE} <b>\u041E\u0424\u0418\u0426\u0418\u0410\u041B\u042C\u041D\u042B\u0419 \u0427\u0415\u041A \u0418 \u0420\u0415\u041A\u0412\u0418\u0417\u0418\u0422\u042B \u041D\u0410 \u041E\u041F\u041B\u0410\u0422\u0423 \u0417\u0410\u041A\u0410\u0417\u0410 #${order.id}</b>
\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
\u{1F3E2} <b>\u0421\u0435\u0440\u0432\u0438\u0441:</b> Mediabuy Lab \u2014 Digital Agency & Farm Accounts Store
\u{1F464} <b>\u041F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u044C:</b> ${fullName} (${usernameText})
\u{1F194} <b>Telegram ID:</b> <code>${user.telegram_id}</code>

\u{1F4E6} <b>\u0421\u043E\u0441\u0442\u0430\u0432 \u0437\u0430\u043A\u0430\u0437\u0430 \u0438 \u043A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E:</b>
${itemsSummary}

\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
\u{1F4B5} <b>\u0418\u0442\u043E\u0433\u043E \u043A \u043E\u043F\u043B\u0430\u0442\u0435:</b> <b>$${order.total_amount.toFixed(2)} USD</b> ${order.discount_percent > 0 ? `<i>(\u0421\u043A\u0438\u0434\u043A\u0430 ${order.discount_percent}%)</i>` : ""}
\u{1FA99} <b>\u0422\u043E\u0447\u043D\u0430\u044F \u0441\u0443\u043C\u043C\u0430 \u043A \u043F\u0435\u0440\u0435\u0432\u043E\u0434\u0443:</b> <code>${order.crypto_amount}</code>
\u{1F310} <b>\u041A\u0440\u0438\u043F\u0442\u043E\u0432\u0430\u043B\u044E\u0442\u0430 \u0438 \u0421\u0435\u0442\u044C:</b> <b>${order.crypto_currency}</b>

\u{1F4EB} <b>\u0420\u0435\u043A\u0432\u0438\u0437\u0438\u0442\u044B \u043A\u043E\u0448\u0435\u043B\u044C\u043A\u0430 \u0434\u043B\u044F \u043F\u0435\u0440\u0435\u0432\u043E\u0434\u0430:</b>
<code>${order.assigned_wallet}</code>

\u23F3 <b>\u0421\u0442\u0430\u0442\u0443\u0441 \u0437\u0430\u043A\u0430\u0437\u0430:</b> \u041E\u0436\u0438\u0434\u0430\u043D\u0438\u0435 \u043E\u043F\u043B\u0430\u0442\u044B (Waiting Payment)

\u{1F4CB} <b>\u0418\u043D\u0441\u0442\u0440\u0443\u043A\u0446\u0438\u044F \u043F\u043E \u043E\u043F\u043B\u0430\u0442\u0435:</b>
1. \u041F\u0435\u0440\u0435\u0432\u0435\u0434\u0438\u0442\u0435 \u0441\u0442\u0440\u043E\u0433\u043E \u0440\u043E\u0432\u043D\u043E <code>${order.crypto_amount}</code> \u0432 \u0432\u044B\u0431\u0440\u0430\u043D\u043D\u043E\u0439 \u0441\u0435\u0442\u0438 (${order.crypto_currency}).
2. \u041D\u0435 \u0437\u0430\u0431\u0443\u0434\u044C\u0442\u0435 \u0443\u0447\u0435\u0441\u0442\u044C \u043A\u043E\u043C\u0438\u0441\u0441\u0438\u044E \u0432\u0430\u0448\u0435\u0439 \u0431\u0438\u0440\u0436\u0438/\u043A\u043E\u0448\u0435\u043B\u044C\u043A\u0430 \u043F\u0440\u0438 \u0432\u044B\u0432\u043E\u0434\u0435.
3. \u041F\u043E\u0441\u043B\u0435 \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u044F \u0442\u0440\u0430\u043D\u0437\u0430\u043A\u0446\u0438\u0438 \u0432 \u0441\u0435\u0442\u0438 \u0434\u0430\u043D\u043D\u044B\u0435 \u0434\u043E\u0441\u0442\u0443\u043F\u0430 \u0438 \u0444\u0430\u0440\u043C-\u0444\u0430\u0439\u043B\u044B \u0432\u044B\u0441\u044B\u043B\u0430\u044E\u0442\u0441\u044F \u0431\u043E\u0442\u043E\u043C \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438.

\u{1F4AC} \u041F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0430 \u0438 \u0441\u0430\u043F\u043F\u043E\u0440\u0442: @mediabuy_adm`;
  const botToken = process.env.BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
  let sentToUser = false;
  if (botToken && user.telegram_id) {
    try {
      const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: user.telegram_id,
          text: receiptMsg,
          parse_mode: "HTML",
          disable_web_page_preview: true
        })
      });
      const tgData = await tgRes.json();
      if (tgData.ok) {
        sentToUser = true;
      }
    } catch (err) {
      console.error("Failed to send telegram receipt to user:", err);
    }
  }
  const adminLogMsg = `\u{1F4E9} <b>\u041F\u041E\u041B\u042C\u0417\u041E\u0412\u0410\u0422\u0415\u041B\u042C \u0417\u0410\u041F\u0420\u041E\u0421\u0418\u041B \u0427\u0415\u041A \u0412 TELEGRAM \u041F\u041E \u0417\u0410\u041A\u0410\u0417\u0423 #${order.id}</b>
\u{1F464} <b>\u041A\u043B\u0438\u0435\u043D\u0442:</b> ${fullName} (${usernameText})
\u{1F4B5} <b>\u0421\u0443\u043C\u043C\u0430:</b> $${order.total_amount} USD (${order.crypto_amount})
\u{1F4EB} <b>\u041A\u043E\u0448\u0435\u043B\u0435\u043A:</b> <code>${order.assigned_wallet}</code>`;
  sendTelegramAdminNotification(adminLogMsg);
  res.json({ ok: true, sent_to_telegram: sentToUser });
});
app.post("/api/orders/:id/txid", async (req, res) => {
  const orderId = Number(req.params.id);
  const { txid } = req.body;
  const order = orders.find((o) => o.id === orderId);
  if (!order) {
    return res.status(404).json({ detail: "Order not found" });
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
    order.status = "paid";
    order.payment_verified_auto = true;
    if (prevStatus !== "paid") {
      notifyCustomerAboutOrderStatus(order, "paid", "\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0430 \u0442\u0440\u0430\u043D\u0437\u0430\u043A\u0446\u0438\u0438 \u0432 \u0431\u043B\u043E\u043A\u0447\u0435\u0439\u043D\u0435 \u043F\u0440\u043E\u0448\u043B\u0430 \u0443\u0441\u043F\u0435\u0448\u043D\u043E!");
      sendTelegramAdminNotification(
        `\u2705 <b>\u041E\u041F\u041B\u0410\u0422\u0410 \u041F\u041E\u0414\u0422\u0412\u0415\u0420\u0416\u0414\u0415\u041D\u0410 \u0410\u0412\u0422\u041E\u041C\u0410\u0422\u0418\u0427\u0415\u0421\u041A\u0418!</b>
\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
\u{1F4E6} <b>\u0417\u0430\u043A\u0430\u0437:</b> #${order.id}
\u{1F4B5} <b>\u0421\u0443\u043C\u043C\u0430:</b> $${order.total_amount} USD (${order.crypto_amount})
\u{1F310} <b>\u0421\u0435\u0442\u044C:</b> ${order.crypto_currency}
\u{1F517} <b>TXID:</b> <code>${txid}</code>
\u{1F4EB} <b>\u041A\u043E\u0448\u0435\u043B\u0435\u043A:</b> <code>${order.assigned_wallet}</code>`
      );
    }
    return res.json({ verified: true, order, message: "\u041E\u043F\u043B\u0430\u0442\u0430 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0430 \u0432 \u0431\u043B\u043E\u043A\u0447\u0435\u0439\u043D\u0435!" });
  } else {
    sendTelegramAdminNotification(
      `\u{1F50D} <b>\u041A\u041B\u0418\u0415\u041D\u0422 \u0423\u041A\u0410\u0417\u0410\u041B TXID \u041F\u041E \u0417\u0410\u041A\u0410\u0417\u0423 #${order.id}</b>
\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
\u{1F517} <b>TXID:</b> <code>${txid}</code>
\u{1F4B5} <b>\u0421\u0443\u043C\u043C\u0430:</b> $${order.total_amount} USD (${order.crypto_amount})
\u{1F310} <b>\u0421\u0435\u0442\u044C:</b> ${order.crypto_currency}
\u0421\u0442\u0430\u0442\u0443\u0441: \u041E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0430 \u0437\u0430\u044F\u0432\u043A\u0430 \u043D\u0430 \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0443 \u0432 \u0441\u0435\u0442\u0438`
    );
    return res.json({
      verified: false,
      order,
      message: verification.reason || "\u0422\u0440\u0430\u043D\u0437\u0430\u043A\u0446\u0438\u044F \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0430 \u043D\u0430 \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0443 \u0432 \u0441\u0435\u0442\u0438 \u0431\u043B\u043E\u043A\u0447\u0435\u0439\u043D..."
    });
  }
});
app.post("/api/orders/:id/check-payment", async (req, res) => {
  const orderId = Number(req.params.id);
  const order = orders.find((o) => o.id === orderId);
  if (!order) {
    return res.status(404).json({ detail: "Order not found" });
  }
  if (order.status === "paid" || order.status === "completed") {
    return res.json({ verified: true, order, message: "\u0417\u0430\u043A\u0430\u0437 \u0443\u0436\u0435 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u043E\u043F\u043B\u0430\u0447\u0435\u043D." });
  }
  if (order.txid) {
    const verification = await verifyCryptoTransaction(
      order.crypto_currency,
      order.assigned_wallet,
      order.txid,
      order.total_amount
    );
    if (verification.success) {
      order.status = "paid";
      order.payment_verified_auto = true;
      notifyCustomerAboutOrderStatus(order, "paid", "\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0430 \u0442\u0440\u0430\u043D\u0437\u0430\u043A\u0446\u0438\u0438 \u043F\u0440\u043E\u0448\u043B\u0430 \u0443\u0441\u043F\u0435\u0448\u043D\u043E!");
      sendTelegramAdminNotification(
        `\u2705 <b>\u041E\u041F\u041B\u0410\u0422\u0410 \u041F\u041E\u0414\u0422\u0412\u0415\u0420\u0416\u0414\u0415\u041D\u0410 \u0410\u0412\u0422\u041E\u041C\u0410\u0422\u0418\u0427\u0415\u0421\u041A\u0418!</b>
\u0417\u0430\u043A\u0430\u0437 #${order.id}
TXID: <code>${order.txid}</code>`
      );
      return res.json({ verified: true, order, message: "\u041E\u043F\u043B\u0430\u0442\u0430 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0430!" });
    }
  }
  return res.json({ verified: false, order, message: "\u041E\u043F\u043B\u0430\u0442\u0430 \u043F\u043E\u043A\u0430 \u043D\u0435 \u0437\u0430\u0444\u0438\u043A\u0441\u0438\u0440\u043E\u0432\u0430\u043D\u0430. \u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0435 \u0440\u0430\u0437 \u0447\u0435\u0440\u0435\u0437 1-2 \u043C\u0438\u043D\u0443\u0442\u044B." });
});
app.delete("/api/orders/:id", (req, res) => {
  const user = getUserFromReq(req);
  const orderId = Number(req.params.id);
  const index = orders.findIndex((o) => o.id === orderId && (o.user_id === user.id || user.is_admin));
  if (index === -1) {
    return res.status(404).json({ detail: "Order not found" });
  }
  const [removed] = orders.splice(index, 1);
  const usernameText = user.username ? `@${user.username}` : "\u043D\u0435\u0442 username";
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ") || "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C";
  sendTelegramAdminNotification(
    `\u{1F6AB} <b>\u0417\u0410\u041A\u0410\u0417 / \u0417\u0410\u042F\u0412\u041A\u0410 #${orderId} \u041E\u0422\u041C\u0415\u041D\u0415\u041D\u0410 \u041F\u041E\u041B\u042C\u0417\u041E\u0412\u0410\u0422\u0415\u041B\u0415\u041C</b>
\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
\u{1F464} <b>\u041A\u043B\u0438\u0435\u043D\u0442:</b> ${fullName} (${usernameText})
\u{1F194} <b>Telegram ID:</b> <code>${user.telegram_id}</code>
\u{1F4B5} <b>\u0421\u0443\u043C\u043C\u0430:</b> $${removed.total_amount}`
  );
  res.json({ ok: true, id: orderId, message: "\u0417\u0430\u043A\u0430\u0437 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u043E\u0442\u043C\u0435\u043D\u0435\u043D \u0438 \u0443\u0434\u0430\u043B\u0435\u043D." });
});
app.post("/api/orders/:id/cancel", (req, res) => {
  const user = getUserFromReq(req);
  const orderId = Number(req.params.id);
  const index = orders.findIndex((o) => o.id === orderId && (o.user_id === user.id || user.is_admin));
  if (index === -1) {
    return res.status(404).json({ detail: "Order not found" });
  }
  const [removed] = orders.splice(index, 1);
  const usernameText = user.username ? `@${user.username}` : "\u043D\u0435\u0442 username";
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ") || "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C";
  sendTelegramAdminNotification(
    `\u{1F6AB} <b>\u0417\u0410\u041A\u0410\u0417 / \u0417\u0410\u042F\u0412\u041A\u0410 #${orderId} \u041E\u0422\u041C\u0415\u041D\u0415\u041D\u0410 \u041F\u041E\u041B\u042C\u0417\u041E\u0412\u0410\u0422\u0415\u041B\u0415\u041C</b>
\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
\u{1F464} <b>\u041A\u043B\u0438\u0435\u043D\u0442:</b> ${fullName} (${usernameText})
\u{1F194} <b>Telegram ID:</b> <code>${user.telegram_id}</code>
\u{1F4B5} <b>\u0421\u0443\u043C\u043C\u0430:</b> $${removed.total_amount}`
  );
  res.json({ ok: true, id: orderId, message: "\u0417\u0430\u043A\u0430\u0437 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u043E\u0442\u043C\u0435\u043D\u0435\u043D \u0438 \u0443\u0434\u0430\u043B\u0435\u043D." });
});
app.post("/api/requests/launch-ads", async (req, res) => {
  const user = getUserFromReq(req);
  const { project_url, planned_budget } = req.body;
  const reqObj = {
    id: nextRequestId++,
    user_id: user.id,
    request_type: "launch_ads",
    project_url,
    planned_budget,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  serviceRequests.push(reqObj);
  const usernameText = user.username ? `@${user.username}` : "\u043D\u0435\u0442 username";
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ") || "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C";
  const { ip, device, geoStr } = await getGeoAndDeviceInfo(req);
  const reqMsg = `\u{1F680} <b>\u0417\u0410\u042F\u0412\u041A\u0410 \u041D\u0410 \u0417\u0410\u041F\u0423\u0421\u041A \u0420\u0415\u041A\u041B\u0410\u041C\u042B #${reqObj.id}</b>
\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
\u{1F464} <b>\u041A\u043B\u0438\u0435\u043D\u0442:</b> ${fullName} (${usernameText})
\u{1F194} <b>Telegram ID:</b> <code>${user.telegram_id}</code>

\u{1F517} <b>\u041F\u0440\u043E\u0435\u043A\u0442 / \u0421\u0441\u044B\u043B\u043A\u0430:</b> ${project_url || "\u041D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D\u0430"}
\u{1F4B0} <b>\u0411\u044E\u0434\u0436\u0435\u0442:</b> ${planned_budget || "\u041D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D"}

\u{1F310} <b>IP \u0430\u0434\u0440\u0435\u0441:</b> <code>${ip}</code>
\u{1F30D} <b>\u041B\u043E\u043A\u0430\u0446\u0438\u044F:</b> ${geoStr}
\u{1F4F1} <b>\u0423\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u043E:</b> ${device}
\u23F0 <b>\u0414\u0430\u0442\u0430 \u043F\u043E\u0434\u0430\u0447\u0438:</b> ${(/* @__PURE__ */ new Date()).toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })} \u041C\u0421\u041A`;
  sendTelegramAdminNotification(reqMsg);
  res.json(reqObj);
});
app.post("/api/requests/training", async (req, res) => {
  const user = getUserFromReq(req);
  const { platform, experience_level, details } = req.body;
  const reqObj = {
    id: nextRequestId++,
    user_id: user.id,
    request_type: "training",
    platform,
    experience_level,
    details,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  serviceRequests.push(reqObj);
  const usernameText = user.username ? `@${user.username}` : "\u043D\u0435\u0442 username";
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ") || "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C";
  const { ip, device, geoStr } = await getGeoAndDeviceInfo(req);
  const reqMsg = `\u{1F393} <b>\u0417\u0410\u042F\u0412\u041A\u0410 \u041D\u0410 \u041E\u0411\u0423\u0427\u0415\u041D\u0418\u0415 #${reqObj.id}</b>
\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
\u{1F464} <b>\u041A\u043B\u0438\u0435\u043D\u0442:</b> ${fullName} (${usernameText})
\u{1F194} <b>Telegram ID:</b> <code>${user.telegram_id}</code>

\u{1F3AF} <b>\u041F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u0430:</b> ${platform || "\u0412\u0441\u0435 \u043F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u044B"}
\u{1F4CA} <b>\u041E\u043F\u044B\u0442:</b> ${experience_level || "\u041D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D"}
\u{1F4DD} <b>\u0414\u0435\u0442\u0430\u043B\u0438:</b> ${details || "\u041D\u0435\u0442 \u0434\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0445 \u0434\u0435\u0442\u0430\u043B\u0435\u0439"}

\u{1F310} <b>IP \u0430\u0434\u0440\u0435\u0441:</b> <code>${ip}</code>
\u{1F30D} <b>\u041B\u043E\u043A\u0430\u0446\u0438\u044F:</b> ${geoStr}
\u{1F4F1} <b>\u0423\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u043E:</b> ${device}
\u23F0 <b>\u0414\u0430\u0442\u0430 \u043F\u043E\u0434\u0430\u0447\u0438:</b> ${(/* @__PURE__ */ new Date()).toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })} \u041C\u0421\u041A`;
  sendTelegramAdminNotification(reqMsg);
  res.json(reqObj);
});
app.post("/api/auth/telegram", (req, res) => {
  const user = getUserFromReq(req);
  trackMiniAppOpen(req, user);
  res.json(user);
});
app.get("/api/auth/local", (req, res) => {
  const user = getUserFromReq(req);
  trackMiniAppOpen(req, user);
  res.json(user);
});
app.post("/api/auth/admin/login", (req, res) => {
  const username = (req.body?.username || "").toString().trim();
  const password = (req.body?.password || "").toString().trim();
  if (username.toLowerCase() !== ADMIN_LOGIN.toLowerCase() || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ detail: "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u043B\u043E\u0433\u0438\u043D \u0438\u043B\u0438 \u043F\u0430\u0440\u043E\u043B\u044C \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440\u0430" });
  }
  const token = import_jsonwebtoken.default.sign({ sub: username, role: "admin" }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ access_token: token, username });
});
app.get("/api/auth/admin/me", requireAdmin, (req, res) => {
  res.json({ ok: true, role: "admin" });
});
app.get("/api/auth/admin/check-tg", (req, res) => {
  const hasTgHeader = req.headers["x-telegram-user"] || req.headers["x-telegram-init-data"] || req.headers["x-telegram-initdata"];
  if (hasTgHeader) {
    const user = getUserFromReq(req);
    if (user && user.is_admin && user.telegram_id !== 10001) {
      return res.json({ is_admin: true, telegram_id: user.telegram_id });
    }
  }
  return res.json({ is_admin: false });
});
app.get("/api/admin/categories", requireAdmin, (req, res) => {
  res.json(categories);
});
app.post("/api/admin/categories", requireAdmin, (req, res) => {
  const { name, slug } = req.body;
  const cat = {
    id: nextCategoryId++,
    name,
    slug,
    is_visible: true,
    platform: name
  };
  categories.push(cat);
  res.json(cat);
});
app.patch("/api/admin/categories/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const cat = categories.find((c) => c.id === id);
  if (!cat) return res.status(404).json({ detail: "Category not found" });
  if (req.body.name !== void 0) cat.name = req.body.name;
  if (req.body.slug !== void 0) cat.slug = req.body.slug;
  if (req.body.is_visible !== void 0) cat.is_visible = req.body.is_visible;
  res.json(cat);
});
app.delete("/api/admin/categories/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  categories = categories.filter((c) => c.id !== id);
  res.json({ ok: true });
});
app.get("/api/admin/products", requireAdmin, (req, res) => {
  res.json(products);
});
app.post("/api/admin/products", requireAdmin, (req, res) => {
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
    stock = 50
  } = req.body;
  const prod = {
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
    stock: stock !== void 0 ? Number(stock) : 50
  };
  products.push(prod);
  res.json(prod);
});
app.patch("/api/admin/products/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const prod = products.find((p) => p.id === id);
  if (!prod) return res.status(404).json({ detail: "Product not found" });
  if (req.body.title !== void 0) prod.title = req.body.title;
  if (req.body.title_en !== void 0) prod.title_en = req.body.title_en;
  if (req.body.description !== void 0) prod.description = req.body.description;
  if (req.body.description_en !== void 0) prod.description_en = req.body.description_en;
  if (req.body.platform !== void 0) prod.platform = req.body.platform;
  if (req.body.price !== void 0) prod.price = req.body.price;
  if (req.body.is_visible !== void 0) prod.is_visible = req.body.is_visible;
  if (req.body.detailed_description !== void 0) prod.detailed_description = req.body.detailed_description;
  if (req.body.detailed_description_en !== void 0) prod.detailed_description_en = req.body.detailed_description_en;
  if (req.body.geo !== void 0) prod.geo = req.body.geo;
  if (req.body.format !== void 0) prod.format = req.body.format;
  if (req.body.replacement_policy !== void 0) prod.replacement_policy = req.body.replacement_policy;
  if (req.body.usage_instructions !== void 0) prod.usage_instructions = req.body.usage_instructions;
  if (req.body.stock !== void 0) prod.stock = Number(req.body.stock);
  res.json(prod);
});
app.delete("/api/admin/products/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  products = products.filter((p) => p.id !== id);
  res.json({ ok: true });
});
app.get("/api/admin/orders", requireAdmin, (req, res) => {
  res.json(orders.slice().reverse());
});
app.patch("/api/admin/orders/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const order = orders.find((o) => o.id === id);
  if (!order) return res.status(404).json({ detail: "Order not found" });
  const oldStatus = order.status;
  if (req.body.status !== void 0) order.status = req.body.status;
  if (req.body.delivered_data !== void 0) order.delivered_data = req.body.delivered_data;
  const note = req.body.note || "";
  if (req.body.status !== void 0 && req.body.status !== oldStatus) {
    notifyCustomerAboutOrderStatus(order, req.body.status, note);
  } else if (req.body.delivered_data !== void 0 && oldStatus === "paid") {
    order.status = "completed";
    notifyCustomerAboutOrderStatus(order, "completed", "\u0414\u0430\u043D\u043D\u044B\u0435 \u0434\u043E\u0441\u0442\u0443\u043F\u0430 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0432\u044B\u0433\u0440\u0443\u0436\u0435\u043D\u044B!");
  }
  res.json(order);
});
app.get("/api/admin/requests", requireAdmin, (req, res) => {
  res.json(serviceRequests);
});
app.get("/api/admin/banners", requireAdmin, (req, res) => {
  res.json(banners);
});
app.post("/api/admin/banners", requireAdmin, (req, res) => {
  const banner = {
    id: nextBannerId++,
    title: req.body.title,
    subtitle: req.body.subtitle,
    image_url: req.body.image_url,
    target_url: req.body.target_url,
    sort_order: req.body.sort_order || 0,
    is_active: req.body.is_active !== void 0 ? req.body.is_active : true,
    badge_text: req.body.badge_text || "PROMO & OFFERS"
  };
  banners.push(banner);
  res.json(banner);
});
app.patch("/api/admin/banners/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const banner = banners.find((b) => b.id === id);
  if (!banner) return res.status(404).json({ detail: "Banner not found" });
  Object.assign(banner, req.body);
  res.json(banner);
});
app.delete("/api/admin/banners/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  banners = banners.filter((b) => b.id !== id);
  res.json({ ok: true });
});
app.get("/api/admin/articles", requireAdmin, (req, res) => {
  res.json(articles);
});
app.post("/api/admin/articles", requireAdmin, (req, res) => {
  const article = {
    id: nextArticleId++,
    title: req.body.title,
    image_url: req.body.image_url,
    target_url: req.body.target_url,
    sort_order: req.body.sort_order || 0,
    is_active: true,
    has_en_version: req.body.add_english_version || false,
    title_en: req.body.title_en || null,
    image_url_en: req.body.image_url_en || null,
    target_url_en: req.body.target_url_en || null
  };
  articles.push(article);
  res.json(article);
});
app.patch("/api/admin/articles/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const article = articles.find((a) => a.id === id);
  if (!article) return res.status(404).json({ detail: "Article not found" });
  Object.assign(article, req.body);
  res.json(article);
});
app.delete("/api/admin/articles/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  articles = articles.filter((a) => a.id !== id);
  res.json({ ok: true });
});
app.get("/api/admin/home-settings", requireAdmin, (req, res) => {
  res.json(homeSettings);
});
app.patch("/api/admin/home-settings", requireAdmin, (req, res) => {
  Object.assign(homeSettings, req.body);
  res.json(homeSettings);
});
app.post("/api/admin/home-settings/logo-upload", requireAdmin, upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ detail: "No file uploaded" });
  const targetPath = import_path.default.join(homeUploadsDir, "logo.png");
  import_fs.default.renameSync(req.file.path, targetPath);
  homeSettings.logo_image_url = `/uploads/home/logo.png`;
  res.json(homeSettings);
});
app.post("/api/admin/home-settings/bot-menu-image-upload", requireAdmin, upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ detail: "No file uploaded" });
  const targetPath = import_path.default.join(homeUploadsDir, "bot_menu.jpg");
  import_fs.default.renameSync(req.file.path, targetPath);
  homeSettings.bot_menu_image_url = `/uploads/home/bot_menu.jpg`;
  res.json(homeSettings);
});
app.get("/api/admin/contacts", requireAdmin, (req, res) => {
  res.json(contacts);
});
app.post("/api/admin/contacts", requireAdmin, (req, res) => {
  const contact = {
    id: nextContactId++,
    title: req.body.title,
    title_en: req.body.title_en || null,
    link: req.body.link,
    kind: req.body.kind || "person",
    sort_order: req.body.sort_order || 0,
    is_active: req.body.is_active !== void 0 ? req.body.is_active : true
  };
  contacts.push(contact);
  res.json(contact);
});
app.patch("/api/admin/contacts/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const contact = contacts.find((c) => c.id === id);
  if (!contact) return res.status(404).json({ detail: "Contact not found" });
  Object.assign(contact, req.body);
  res.json(contact);
});
app.delete("/api/admin/contacts/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  contacts = contacts.filter((c) => c.id !== id);
  res.json({ ok: true });
});
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`
\u{1F680} Server running on http://0.0.0.0:${PORT}`);
    console.log(`\u{1F4F1} Web App & API available at: http://localhost:${PORT}
`);
    startTelegramBotPolling();
  });
  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`
\u274C ERROR: Port ${PORT} is already in use by another process!`);
      console.error(`To free up port ${PORT} on Linux/macOS, run:`);
      console.error(`   npx kill-port ${PORT}   OR   fuser -k ${PORT}/tcp`);
      console.error(`Or run on another port: PORT=3001 npm run dev
`);
    } else {
      console.error("Server error:", err);
    }
  });
}
start();
//# sourceMappingURL=server.cjs.map
