import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider } from './context/AdminAuthContext';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminMenuPage from './pages/AdminMenuPage';
import AdminCategoriesPage from './pages/AdminCategoriesPage';
import AdminReservationsPage from './pages/AdminReservationsPage';
import AdminInfoPage from './pages/AdminInfoPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import AdminTestimonialsPage from './pages/AdminTestimonialsPage';
import AdminErrorBoundary from './components/AdminErrorBoundary';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './admin-style.css';

function AdminApp() {
  return (
    <AdminErrorBoundary>
      <AdminAuthProvider>
        <Routes>
          {/* Public Admin Routes */}
          <Route path="login" element={<AdminLoginPage />} />

          {/* Protected Admin Routes */}
          <Route 
            path="/" 
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="menu" element={<AdminMenuPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="bookings" element={<AdminReservationsPage />} />
            <Route path="testimonials" element={<AdminTestimonialsPage />} />
            <Route path="info" element={<AdminInfoPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          {/* Fallback within /admin */}
          <Route path="*" element={<Navigate to="." replace />} />
        </Routes>
        <ToastContainer 
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
        />
      </AdminAuthProvider>
    </AdminErrorBoundary>
  );
}

export default AdminApp;
