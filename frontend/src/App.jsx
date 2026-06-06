import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast';

// Layouts
import ClientLayout from './layouts/ClientLayout';
import AdminLayout from './layouts/AdminLayout';

// Client Pages
import Home from './pages/client/Home';
import Shop from './pages/client/Shop';
import ProductDetail from './pages/client/ProductDetail';
import About from './pages/client/About';
import Contact from './pages/client/Contact';
import FAQ from './pages/client/FAQ';
import WhatsAppOrder from './pages/client/WhatsAppOrder';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import Categories from './pages/admin/Categories';
import Products from './pages/admin/Products';
import ProductForm from './pages/admin/ProductForm';
import Orders from './pages/admin/Orders';
import Customers from './pages/admin/Customers';
import Pages from './pages/admin/Pages';
import Settings from './pages/admin/Settings';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Toaster position="top-right" />
        <Routes>
          {/* Client Routes */}
          <Route element={<ClientLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/order" element={<WhatsAppOrder />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="categories" element={<Categories />} />
            <Route path="products" element={<Products />} />
            <Route path="products/create" element={<ProductForm />} />
            <Route path="products/:id/edit" element={<ProductForm />} />
            <Route path="orders" element={<Orders />} />
            <Route path="customers" element={<Customers />} />
            <Route path="pages" element={<Pages />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
