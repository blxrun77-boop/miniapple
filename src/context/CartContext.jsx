import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import api from '../api/client'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { user, loading: authLoading } = useAuth()
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('mb_cart')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Keep localStorage synced with state
  useEffect(() => {
    try {
      localStorage.setItem('mb_cart', JSON.stringify(items))
    } catch (e) {
      console.error(e)
    }
  }, [items])

  useEffect(() => {
    if (authLoading) {
      return
    }

    let cancelled = false

    const loadCart = async () => {
      try {
        const { data } = await api.get('/cart')
        if (cancelled) {
          return
        }
        if (Array.isArray(data) && data.length > 0) {
          const serverItems = data.map((item) => ({
            id: item.product_id,
            title: item.title,
            title_en: item.title_en,
            description: item.description,
            description_en: item.description_en,
            platform: item.platform,
            price: item.price,
            quantity: item.quantity
          }))
          setItems(serverItems)
        } else if (items.length > 0 && user) {
          // Sync existing local items to backend database
          for (const item of items) {
            await api.put('/cart/items', { product_id: item.id, quantity: item.quantity }).catch(() => {})
          }
        }
      } catch (error) {
        console.error('Cart load error:', error)
      }
    }

    loadCart()

    return () => {
      cancelled = true
    }
  }, [user, authLoading])

  const syncItemQuantity = async (productId, quantity) => {
    if (!user) {
      return
    }
    try {
      await api.put('/cart/items', { product_id: productId, quantity })
    } catch (error) {
      console.error(error)
    }
  }

  const addToCart = (product, delta = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      const nextQuantity = existing ? existing.quantity + delta : delta
      syncItemQuantity(product.id, nextQuantity)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: nextQuantity } : item
        )
      }
      return [...prev, { ...product, quantity: delta }]
    })
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    syncItemQuantity(productId, quantity)
    setItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const removeFromCart = (productId) => {
    syncItemQuantity(productId, 0)
    setItems((prev) => prev.filter((item) => item.id !== productId))
  }

  const clearCart = () => {
    try {
      localStorage.removeItem('mb_cart')
    } catch (e) {
      console.error(e)
    }
    if (user) {
      api.delete('/cart/clear').catch((error) => console.error(error))
    }
    setItems([])
  }

  const count = items.reduce((acc, item) => acc + item.quantity, 0)
  const total = items.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0)

  const value = useMemo(
    () => ({ items, addToCart, updateQuantity, removeFromCart, clearCart, count, total }),
    [items, count, total]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
