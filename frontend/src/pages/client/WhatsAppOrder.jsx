import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../context/CartContext';
import API from '../../api/axios';
import { STORAGE_BASE_URL } from '../../api/baseUrl';
import toast from 'react-hot-toast';
import { MessageCircle, User, Phone, MapPin, Home, ChevronLeft, Package, Trash2 } from 'lucide-react';
import { useSiteSettings } from '../../hooks/useSiteSettings';

export default function WhatsAppOrder() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, removeFromCart, clearCart } = useCart();
  const settings = useSiteSettings();
  
  // Single product from ProductDetail page OR use cart items
  const singleProduct = location.state?.product || null;
  const products = singleProduct ? [singleProduct] : cartItems;
  const isSingleMode = !!singleProduct;

  const [form, setForm] = useState({ full_name: '', phone_number: '', city: '', address: '' });
  const [quantities, setQuantities] = useState(() => {
    const q = {};
    products.forEach(p => q[p.id] = 1);
    return q;
  });
  const [sending, setSending] = useState(false);

  const totalPrice = products.reduce((sum, p) => sum + parseFloat(p.price) * (quantities[p.id] || 1), 0).toFixed(2);

  // Detect iOS device
  const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
           (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  };

  // Build WhatsApp URL with proper scheme handling for iOS
  const buildWhatsAppUrl = (phoneNumber, message) => {
    const encodedMessage = encodeURIComponent(message);
    
    // iOS handles whatsapp:// scheme more reliably for instant opening
    if (isIOS()) {
      // Use universal link for iOS - more reliable for immediate opening
      return `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
    }
    
    // Standard wa.me link for other platforms
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (products.length === 0) {
      toast.error(t('order.noProductSelected'));
      return;
    }
    setSending(true);

    const productLines = products.map(p => 
      `• ${p.name} x${quantities[p.id] || 1} — ${(parseFloat(p.price) * (quantities[p.id] || 1)).toFixed(2)} DH`
    ).join('\n');

    const message =
      `🛒 *Nouvelle Commande — CHRI LIYA STORE*\n\n` +
      `📦 *Produits:*\n${productLines}\n\n` +
      `💵 *Total:* ${totalPrice} DH\n\n` +
      `👤 *Nom:* ${form.full_name}\n` +
      `📞 *Téléphone:* ${form.phone_number}\n` +
      `🏙️ *Ville:* ${form.city}\n` +
      `📍 *Adresse:* ${form.address || 'Non précisée'}`;

    const whatsappUrl = buildWhatsAppUrl(settings.whatsapp_number, message);

    // iOS-specific optimization: Open WhatsApp FIRST for immediate response
    // This prevents iOS from blocking the popup due to async delay
    if (isIOS()) {
      // On iOS, open WhatsApp immediately before any async operations
      // This is crucial because iOS Safari blocks popups that aren't
      // directly triggered by user interaction
      const whatsappWindow = window.open(whatsappUrl, '_blank');
      
      // Fallback: If popup was blocked, use location redirect
      if (!whatsappWindow || whatsappWindow.closed) {
        window.location.href = whatsappUrl;
      }

      // Save order in background (non-blocking)
      API.post('/whatsapp-order', {
        full_name: form.full_name,
        phone_number: form.phone_number,
        city: form.city,
        address: form.address,
        product_ids: products.map(p => p.id),
        message: message,
      }).then(() => {
        toast.success(t('order.successSaved'));
        if (!isSingleMode) {
          clearCart();
        }
      }).catch((err) => {
        console.error('Order save error:', err);
        // Don't show error - WhatsApp already opened successfully
      }).finally(() => {
        setSending(false);
      });
      
      return;
    }

    // Standard flow for non-iOS devices
    try {
      // Save order to backend first
      await API.post('/whatsapp-order', {
        full_name: form.full_name,
        phone_number: form.phone_number,
        city: form.city,
        address: form.address,
        product_ids: products.map(p => p.id),
        message: message,
      });

      // Open WhatsApp
      window.open(whatsappUrl, '_blank');
      toast.success(t('order.successSaved'));
      
      if (!isSingleMode) {
        clearCart();
      }
    } catch (err) {
      console.error(err);
      toast.error(t('order.errorSaving'));
    } finally {
      setSending(false);
    }
  };

  if (products.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">{t('order.noProductSelected')}</h2>
        <p className="text-gray-500 mb-6">{t('order.noProductDesc')}</p>
        <Link to="/shop" className="inline-flex items-center gap-2 bg-dark text-white px-6 py-3 rounded-xl font-semibold hover:bg-dark/90 transition-all">
          {t('order.browseShop')}
        </Link>
      </div>
    );
  }

  const updateQuantity = (productId, value) => {
    setQuantities(prev => ({ ...prev, [productId]: Math.max(1, parseInt(value) || 1) }));
  };

  const totalItems = Object.values(quantities).reduce((sum, q) => sum + q, 0);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-8">
        <ChevronLeft className="w-4 h-4 rtl-flip" /> {t('common.back')}
      </button>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-[#25D366]/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <MessageCircle className="w-7 h-7 text-[#25D366]" />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900">{t('order.title')}</h1>
        <p className="text-gray-500 text-sm mt-1">{t('order.subtitle')}</p>
      </div>

      {/* Products List */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 shadow-sm space-y-3">
        <h2 className="font-bold text-gray-900 text-sm flex items-center gap-2">
          <Package className="w-4 h-4" /> {t('order.yourProducts')} ({products.length})
        </h2>
        {products.map((product) => {
          const productImage = product.images?.find((i) => i.is_main) || product.images?.[0];
          const price = parseFloat(product.price);
          const qty = quantities[product.id] || 1;
          return (
            <div key={product.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              {productImage ? (
                <img src={STORAGE_BASE_URL + productImage.image_url} alt={product.name} className="w-16 h-16 object-cover rounded-lg shrink-0" />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center shrink-0">
                  <Package className="w-6 h-6 text-gray-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{product.category?.name}</p>
                <h3 className="font-semibold text-gray-900 text-sm truncate">{product.name}</h3>
                <p className="text-sm font-bold text-[#25D366]">{price.toFixed(2)} DH</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  value={qty}
                  onChange={(e) => updateQuantity(product.id, e.target.value)}
                  className="w-14 h-9 text-center border border-gray-200 rounded-lg text-sm font-medium"
                />
                {!isSingleMode && (
                  <button
                    type="button"
                    onClick={() => removeFromCart(product.id)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
        <h2 className="font-bold text-gray-900 text-base mb-1">{t('order.yourInfo')}</h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> {t('order.fullName')} *
            </label>
            <input
              type="text" required
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="input-field"
              placeholder="Ahmed El Mansouri"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" /> {t('order.phone')} *
            </label>
            <input
              type="tel" required
              value={form.phone_number}
              onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
              className="input-field"
              placeholder="06 XX XX XX XX"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" /> {t('order.city')} *
          </label>
          <input
            type="text" required
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="input-field"
            placeholder="Casablanca"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5" /> {t('order.address')}
          </label>
          <textarea
            rows={2}
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="input-field resize-none"
            placeholder={t('order.addressPlaceholder')}
          />
        </div>

        {/* Total */}
        <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">{t('order.total')} ({totalItems} {totalItems > 1 ? t('order.items_plural') : t('order.items')})</span>
          <span className="text-xl font-extrabold text-gray-900">{totalPrice} DH</span>
        </div>

        <button
          type="submit"
          disabled={sending}
          className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white transition-all shadow-lg shadow-green-100 disabled:opacity-60"
        >
          <MessageCircle className="w-5 h-5" />
          {sending ? t('order.sending') : t('order.submit')}
        </button>

        <p className="text-center text-xs text-gray-400">
          {t('order.redirectNote')}
        </p>
      </form>
    </div>
  );
}
