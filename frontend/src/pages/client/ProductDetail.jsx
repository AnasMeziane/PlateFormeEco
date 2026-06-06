import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import API from '../../api/axios';
import { ChevronLeft, MessageCircle, Package, Star, Tag } from 'lucide-react';
import ProductCard from '../../components/ProductCard';

const STORAGE_URL = 'http://localhost:8000/storage/';

export default function ProductDetail() {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    API.get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data.product);
        setRelated(res.data.related);
        setSelectedImage(0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, i18n.language]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="animate-pulse grid md:grid-cols-2 gap-10">
          <div className="aspect-square bg-gray-200 rounded-xl" />
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-8 bg-gray-200 rounded w-2/3" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return <div className="text-center py-20 text-gray-500">{t('product.notFound')}</div>;

  const images = product.images || [];
  const currentImage = images[selectedImage];
  const imageUrl = currentImage ? STORAGE_URL + currentImage.image_url : null;

  const handleBooking = () => {
    navigate('/order', { state: { product } });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/shop" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-6">
        <ChevronLeft className="w-4 h-4 rtl-flip" /> {t('product.backToShop')}
      </Link>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4">
            <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === i ? 'border-primary-500' : 'border-transparent'
                  }`}
                >
                  <img src={STORAGE_URL + img.image_url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-sm text-primary-600 font-medium mb-2">{product.category?.name}</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
          <p className="text-3xl font-bold text-primary-700 mb-6">{parseFloat(product.price).toFixed(2)} DH</p>

          <div className="prose prose-sm text-gray-600 mb-6" dangerouslySetInnerHTML={{ __html: product.description }} />

          {/* Attributes */}
          {product.attributes?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">{t('product.characteristics')}</h3>
              <div className="space-y-2">
                {product.attributes.map((attr) => (
                  <div key={attr.id} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">{attr.attribute_name}</span>
                    <span className="text-sm font-medium text-gray-900">{attr.attribute_value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stock */}
          <p className={`text-sm mb-6 ${product.stock_quantity > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {product.stock_quantity > 0 ? `✓ ${t('shop.inStock')} (${t('shop.available', { count: product.stock_quantity })})` : `✕ ${t('shop.outOfStock')}`}
          </p>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleBooking}
              disabled={product.stock_quantity === 0}
              className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white transition-all shadow-lg shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MessageCircle className="w-5 h-5" />
              {t('product.orderViaWhatsApp')}
            </button>
            {product.stock_quantity === 0 && (
              <p className="text-center text-sm text-red-500">{t('shop.outOfStock')}</p>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('product.relatedProducts')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
