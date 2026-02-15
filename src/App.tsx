import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import ProductsPage from '@/pages/ProductsPage';
import ProductAddPage from '@/pages/ProductAddPage';
import ProductEditPage from '@/pages/ProductEditPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import UsersPage from '@/pages/UsersPage';
import SettingsPage from '@/pages/SettingsPage';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/common/ThemeProvider';
import MainLayout from '@/components/layout/MainLayout';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Routes>
        <Route path="/login" element={<LoginPage />} />


        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<DashboardPage />} />


            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/add" element={<ProductAddPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/products/:id/edit" element={<ProductEditPage />} />


            <Route path="/users" element={<UsersPage />} />


            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>


        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
