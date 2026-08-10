import { useEffect } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import AnimatedBackground from './components/AnimatedBackground.jsx'
import BottomNav from './components/BottomNav.jsx'
import AdminPage from './pages/AdminPage.jsx'
import CalculatorPage from './pages/CalculatorPage.jsx'
import CartPage from './pages/CartPage.jsx'
import CatalogPage from './pages/CatalogPage.jsx'
import ContactsPage from './pages/ContactsPage.jsx'
import DocumentPage from './pages/DocumentPage.jsx'
import BuyerToolsPage from './pages/BuyerToolsPage.jsx'
import HomePage from './pages/HomePage.jsx'
import LaunchAdsPage from './pages/LaunchAdsPage.jsx'
import ProductDetailPage from './pages/ProductDetailPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import TrainingPage from './pages/TrainingPage.jsx'

export default function App() {
  const navigate = useNavigate()

  useEffect(() => {
    // Handle Telegram WebApp start_param or URL query param redirects
    const tgWebApp = window.Telegram?.WebApp
    const startParam = tgWebApp?.initDataUnsafe?.start_param || ''
    const urlParams = new URLSearchParams(window.location.search)
    const pageParam = urlParams.get('page') || urlParams.get('startapp') || ''

    if (startParam === 'admin' || pageParam === 'admin' || window.location.pathname.includes('/admin')) {
      navigate('/admin', { replace: true })
    } else if (
      startParam === 'docs' ||
      startParam === 'documents' ||
      pageParam === 'docs' ||
      pageParam === 'documents' ||
      window.location.pathname.includes('/document')
    ) {
      navigate('/documents', { replace: true })
    }
  }, [navigate])

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <div className="relative z-10">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/launch-ads" element={<LaunchAdsPage />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/training" element={<TrainingPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/documents" element={<DocumentPage />} />
          <Route path="/document" element={<DocumentPage />} />
          <Route path="/pdf" element={<DocumentPage />} />
          <Route path="/tools" element={<BuyerToolsPage />} />
          <Route path="/buyer-tools" element={<BuyerToolsPage />} />
          <Route path="/knowledge" element={<BuyerToolsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <BottomNav />
    </div>
  )
}
