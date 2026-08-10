import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/client'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const tgWebApp = window.Telegram?.WebApp
        if (tgWebApp) {
          try {
            tgWebApp.ready()
            tgWebApp.expand()
          } catch (e) {}
        }

        const tgUser = tgWebApp?.initDataUnsafe?.user

        const { data } = await api.post('/auth/telegram', {
          tgUser,
          initData: tgWebApp?.initData
        })

        if (data && data.telegram_id && data.telegram_id !== 10001) {
          setUser(data)
        } else if (tgUser && tgUser.id) {
          setUser({
            id: tgUser.id,
            telegram_id: tgUser.id,
            first_name: tgUser.first_name || 'Пользователь',
            last_name: tgUser.last_name || '',
            username: tgUser.username || '',
            next_order_discount_percent: 0,
          })
        } else {
          setUser(data)
        }
      } catch (err) {
        console.error('Auth error:', err)
        const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user
        if (tgUser && tgUser.id) {
          setUser({
            id: tgUser.id,
            telegram_id: tgUser.id,
            first_name: tgUser.first_name || 'Пользователь',
            last_name: tgUser.last_name || '',
            username: tgUser.username || '',
            next_order_discount_percent: 0,
          })
        }
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
