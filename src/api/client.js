import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api'
})

api.interceptors.request.use((config) => {
  const initData = window.Telegram?.WebApp?.initData
  if (initData) {
    config.headers['X-Telegram-Init-Data'] = initData
  }

  const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user
  if (tgUser) {
    config.headers['X-Telegram-User'] = JSON.stringify(tgUser)
  }

  const adminToken = localStorage.getItem('mb_admin_token')
  if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`
  }

  return config
})

export default api
