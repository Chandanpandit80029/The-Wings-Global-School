import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

// Base path for deployment
const basename = '/'
import { Toaster } from '@/components/ui/Toast'
import { ToastProvider, ToastViewport } from '@/components/ui/Toast'
import { AuthProvider } from '@/context/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'

// Layouts
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AdminLayout from '@/components/layout/AdminLayout'

// Public Pages
import Home from '@/pages/Home'
import About from '@/pages/About'
import Academics from '@/pages/Academics'
import Faculty from '@/pages/Faculty'
import Gallery from '@/pages/Gallery'
import NewsEvents from '@/pages/NewsEvents'
import Downloads from '@/pages/Downloads'
import Admissions from '@/pages/Admissions'
import Contact from '@/pages/Contact'
import PrivacyPolicy from '@/pages/PrivacyPolicy'
import TermsOfService from '@/pages/TermsOfService'

// Admin Pages
import Login from '@/pages/admin/Login'
import Dashboard from '@/pages/admin/Dashboard'
import CRUDPage from '@/pages/admin/CRUDPage'
import SubmissionsPage from '@/pages/admin/SubmissionsPage'
import AdminHeroSlider from '@/pages/admin/AdminHeroSlider'
import SliderManagement from '@/pages/admin/SliderManagement'

// Layout wrapper for public pages
function PublicLayout({ children }) {
  return (
    <>
      <Header />
      <main className="pt-16">{children}</main>
      <Footer />
    </>
  )
}

// Toast wrapper component
function ToastWrapper({ children }) {
  return (
    <ToastProvider>
      {children}
      <ToastViewport />
    </ToastProvider>
  )
}

function App() {
  return (
    <ToastWrapper>
      <AuthProvider>
        <Router basename={basename}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
            <Route path="/academics" element={<PublicLayout><Academics /></PublicLayout>} />
            <Route path="/faculty" element={<PublicLayout><Faculty /></PublicLayout>} />
            <Route path="/gallery" element={<PublicLayout><Gallery /></PublicLayout>} />
            <Route path="/news-events" element={<PublicLayout><NewsEvents /></PublicLayout>} />
            <Route path="/downloads" element={<PublicLayout><Downloads /></PublicLayout>} />
            <Route path="/admissions" element={<PublicLayout><Admissions /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
            <Route path="/privacy-policy" element={<PublicLayout><PrivacyPolicy /></PublicLayout>} />
            <Route path="/terms-of-service" element={<PublicLayout><TermsOfService /></PublicLayout>} />

            {/* Admin Login */}
            <Route path="/admin/login" element={<Login />} />

            {/* Admin Routes (Protected) */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              
              {/* CRUD Routes */}
              <Route path="announcements" element={<CRUDPage collection="announcements" />} />
              <Route path="announcements/:action" element={<CRUDPage collection="announcements" />} />
              <Route path="announcements/:action/:id" element={<CRUDPage collection="announcements" />} />
              
              <Route path="news" element={<CRUDPage collection="news" />} />
              <Route path="news/:action" element={<CRUDPage collection="news" />} />
              <Route path="news/:action/:id" element={<CRUDPage collection="news" />} />
              
              <Route path="events" element={<CRUDPage collection="events" />} />
              <Route path="events/:action" element={<CRUDPage collection="events" />} />
              <Route path="events/:action/:id" element={<CRUDPage collection="events" />} />
              
              <Route path="faculty" element={<CRUDPage collection="faculty" />} />
              <Route path="faculty/:action" element={<CRUDPage collection="faculty" />} />
              <Route path="faculty/:action/:id" element={<CRUDPage collection="faculty" />} />
              
              <Route path="gallery" element={<CRUDPage collection="gallery" />} />
              <Route path="gallery/:action" element={<CRUDPage collection="gallery" />} />
              <Route path="gallery/:action/:id" element={<CRUDPage collection="gallery" />} />
              
              <Route path="downloads" element={<CRUDPage collection="downloads" />} />
              <Route path="downloads/:action" element={<CRUDPage collection="downloads" />} />
              <Route path="downloads/:action/:id" element={<CRUDPage collection="downloads" />} />

              <Route path="slider" element={<SliderManagement />} />
              <Route path="hero-slider" element={<AdminHeroSlider />} />

              {/* Submissions Routes */}
              <Route path="admissions" element={<SubmissionsPage type="admissions" />} />
              <Route path="messages" element={<SubmissionsPage type="messages" />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ToastWrapper>
  )
}

export default App