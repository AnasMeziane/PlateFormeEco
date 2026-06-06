import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Check, ArrowUpRight } from 'lucide-react';

const STORAGE_URL = 'http://localhost:8000/storage/';

export default function ProductCard({ product }) {
  const { addToCart, isInCart } = useCart();
  const inCart = isInCart(product.id);

  const mainImage = product.images?.find((img) => img.is_main) || product.images?.[0];
  const imageUrl = mainImage
    ? STORAGE_URL + mainImage.image_url
    : null;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden hover:shadow-luxury transition-all duration-300 hover:-translate-y-1">
      {/* Image */}
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden bg-cream-dark aspect-square">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-16 h-16 fill-royal-200">
              <path d="M5 16L2 6l4.5 3L12 3l5.5 6L22 6l-3 10H5zm2.5 2h9a1 1 0 010 2h-9a1 1 0 010-2z"/>
            </svg>
          </div>
        )}
        {/* Quick view overlay */}
        <div className="absolute inset-0 bg-dark/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="bg-white text-dark text-xs font-bold px-4 py-2 rounded-pill flex items-center gap-1.5">
            Voir <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs font-bold text-royal-400 uppercase tracking-wider mb-1.5">{product.category?.name}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-bold text-dark text-sm leading-snug line-clamp-2 hover:text-royal-500 transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between mt-4">
          <span className="text-lg font-extrabold text-royal-500">
            {parseFloat(product.price).toFixed(2)}
            <span className="text-sm font-semibold text-dark/40 ml-1">DH</span>
          </span>
          <button
            onClick={() => addToCart(product)}
            disabled={inCart}
            title={inCart ? 'Ajouté' : 'Ajouter au panier'}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              inCart
                ? 'bg-green-100 text-green-600'
                : 'bg-royal-500 hover:bg-royal-600 text-white shadow-sm'
            }`}
          >
            {inCart ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
