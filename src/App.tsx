import { HashRouter, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import Layout from './components/layout/Layout';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import ChatWidget from './components/chat/ChatWidget';
import { NotificationProvider } from './context/NotificationContext';
import NotificationHost from './components/notifications/NotificationHost';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import ScrollToTop from './components/layout/ScrollToTop';
import CheckoutPage from './pages/CheckoutPage';

// We no longer need GoogleOAuthProvider or the googleClientId here
// const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID; // <-- REMOVED

function App() {
  // We no longer need the check for googleClientId
  // if (!googleClientId) { ... } // <-- REMOVED

  return (
    // <GoogleOAuthProvider clientId={googleClientId}> // <-- REMOVED WRAPPER
      <ThemeProvider>
        <NotificationProvider>
          <AuthProvider>
            <CartProvider>
              <HashRouter>
                <ScrollToTop />
                <Layout>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products/:category" element={<ProductsPage />} />
                    <Route path="/products/all" element={<ProductsPage />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={
                      <ProtectedRoute>
                        <CheckoutPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    
                    {/* Protected Admin Routes */}
                    <Route path="/admin" element={
                      <ProtectedRoute adminOnly={true}>
                        <AdminDashboardPage />
                      </ProtectedRoute>
                    } />
                     <Route path="/admin/products" element={
                      <ProtectedRoute adminOnly={true}>
                        <AdminProductsPage />
                      </ProtectedRoute>
                    } />

                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </Layout>
                <NotificationHost />
                <ChatWidget />
              </HashRouter>
            </CartProvider>
          </AuthProvider>
        </NotificationProvider>
      </ThemeProvider>
    // </GoogleOAuthProvider> // <-- REMOVED WRAPPER
  );
}

export default App;
