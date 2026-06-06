import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import API from '../../api/axios';
import ProductCard from '../../components/ProductCard';
import { ArrowRight, MessageCircle, Star, Zap, Shield, Truck, ChevronLeft, ChevronRight } from 'lucide-react';

const heroSlides = [
  {
    url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&h=1100&fit=crop',
    label: 'Mode & Style',
    sub:   'Collections exclusives',
  },
  {
    url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&h=1100&fit=crop',
    label: 'Tendances 2025',
    sub:   'Nouveautés chaque semaine',
  },
  {
    url: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=900&h=1100&fit=crop',
    label: 'Shopping Premium',
    sub:   'Qualité garantie',
  },
  {
    url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=900&h=1100&fit=crop',
    label: 'Livraison Rapide',
    sub:   'Partout au Maroc',
  },
];

function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback((idx) => {
    if (animating) return;
    setAnimating(true);
    setCurrent(idx);
    setTimeout(() => setAnimating(false), 600);
  }, [animating]);

  const next = useCallback(() => goTo((current + 1) % heroSlides.length), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + heroSlides.length) % heroSlides.length), [current, goTo]);

  useEffect(() => {
    const t = setInterval(next, 4500);
    return () => clearInterval(t);
  }, [next]);

  return (
    <div className="hidden lg:flex relative h-full min-h-[88vh] overflow-hidden bg-dark-card">
      {/* Slides */}
      {heroSlides.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 2 : 1 }}
        >
          <img
            src={slide.url}
            alt={slide.label}
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-transparent to-dark/20" />
          {/* Slide label */}
          <div className="absolute bottom-24 left-8 z-10">
            <p className="text-gold-400 text-xs font-bold uppercase tracking-widest mb-1">{slide.sub}</p>
            <p className="text-white text-2xl font-extrabold">{slide.label}</p>
          </div>
        </div>
      ))}

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all"
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all"
      >
        <ChevronRight className="w-5 h-5 text-white" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-300 rounded-full ${
              i === current ? 'w-8 h-2 bg-gold-400' : 'w-2 h-2 bg-white/30 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute top-8 right-8 z-10 text-white/30 text-sm font-bold tabular-nums">
        {String(current + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}
      </div>
    </div>
  );
}

export default function Home() {
  const { i18n } = useTranslation();
  const [data, setData] = useState({ categories: [], featured_products: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/home')
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [i18n.language]);

  return (
    <div className="bg-cream">

      {/* ═══════════════════════════════════════════════════
          HERO — Dark block, massive type, product image
      ═══════════════════════════════════════════════════ */}
      <section className="bg-dark text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-0 min-h-[88vh] items-center">

            {/* Left — Text */}
            <div className="py-20 lg:py-0 pr-0 lg:pr-16">
              <div className="inline-flex items-center gap-2 bg-white/10 text-gold-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-pill mb-8">
                <Star className="w-3 h-3 fill-gold-400" /> Collection Premium 2025
              </div>
              <h1 className="text-display-lg font-extrabold leading-none tracking-tight mb-6">
                Le Style<br />
                <span className="text-gold-400">Redéfini</span><br />
                Pour Vous.
              </h1>
              <p className="text-white/50 text-lg leading-relaxed max-w-sm mb-10">
                Des produits premium sélectionnés avec soin. Commandez en quelques secondes via WhatsApp.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/shop" className="btn-primary text-base">
                  Explorer la boutique <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/order" className="btn-whatsapp text-base">
                  <MessageCircle className="w-5 h-5" /> Commander
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-10 mt-14 pt-10 border-t border-white/10">
                {[['500+', 'Produits'], ['10K+', 'Clients'], ['5★', 'Note Moyenne']].map(([val, lbl]) => (
                  <div key={lbl}>
                    <p className="text-2xl font-extrabold text-white">{val}</p>
                    <p className="text-xs text-white/40 mt-1 font-medium uppercase tracking-wider">{lbl}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — HD Carousel */}
            <HeroCarousel />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FEATURES BAR
      ═══════════════════════════════════════════════════ */}
      <section className="bg-royal-500">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/20">
            {[
              { icon: Truck,   label: 'Livraison Partout au Maroc', sub: '2 à 5 jours ouvrés' },
              { icon: Shield,  label: 'Paiement à la Livraison',    sub: 'Zéro risque pour vous' },
              { icon: Zap,     label: 'Commande en 1 Clic',         sub: 'Via WhatsApp directement' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-4 py-4 md:py-0 px-0 md:px-8 first:pl-0">
                <div className="bg-white/10 p-2.5 rounded-xl shrink-0">
                  <Icon className="w-5 h-5 text-gold-300" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{label}</p>
                  <p className="text-white/50 text-xs mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          CATEGORIES
      ═══════════════════════════════════════════════════ */}
      {data.categories.length > 0 && (
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="flex justify-between items-end mb-12">
              <div>
                <span className="label-pill mb-4">Catalogue</span>
                <h2 className="text-display-sm font-extrabold text-dark mt-4">Nos Catégories</h2>
              </div>
              <Link to="/shop" className="hidden md:flex items-center gap-2 text-sm font-bold text-dark/50 hover:text-dark transition-colors">
                Tout voir <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {data.categories.map((cat, i) => (
                <Link
                  key={cat.id}
                  to={`/shop?category=${cat.id}`}
                  className="group relative bg-cream-dark rounded-2xl p-6 overflow-hidden hover:shadow-luxury transition-all duration-300 hover:-translate-y-1"
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: i % 2 === 0 ? 'linear-gradient(135deg,#1B3A6B08,#1B3A6B14)' : 'linear-gradient(135deg,#F5A62308,#F5A62314)' }}
                  />
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${i % 2 === 0 ? 'bg-royal-100' : 'bg-gold-100'}`}>
                    <svg viewBox="0 0 24 24" className={`w-6 h-6 ${i % 2 === 0 ? 'fill-royal-500' : 'fill-gold-500'}`}>
                      <path d="M5 16L2 6l4.5 3L12 3l5.5 6L22 6l-3 10H5zm2.5 2h9a1 1 0 010 2h-9a1 1 0 010-2z"/>
                    </svg>
                  </div>
                  <h3 className="font-bold text-dark text-base">{cat.name}</h3>
                  <p className="text-dark/40 text-sm mt-1 font-medium">{cat.products_count} produits</p>
                  <ArrowRight className="w-4 h-4 text-dark/30 group-hover:text-dark/60 mt-4 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════
          FEATURED PRODUCTS
      ═══════════════════════════════════════════════════ */}
      <section className="py-24 bg-cream-dark">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="label-pill mb-4">Sélection</span>
              <h2 className="text-display-sm font-extrabold text-dark mt-4">Produits Vedettes</h2>
            </div>
            <Link to="/shop" className="hidden md:flex items-center gap-2 text-sm font-bold text-dark/50 hover:text-dark transition-colors">
              Voir tout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl animate-pulse">
                  <div className="h-56 bg-cream rounded-t-2xl" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-cream rounded w-3/4" />
                    <div className="h-4 bg-cream rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {data.featured_products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/shop" className="btn-royal text-base">
              Voir toute la boutique <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          CTA BANNER
      ═══════════════════════════════════════════════════ */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="bg-dark rounded-3xl px-10 py-16 md:py-20 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative">
            <div className="absolute -right-10 -top-10 w-64 h-64 bg-gold-400/10 rounded-full blur-3xl" />
            <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-royal-500/20 rounded-full blur-3xl" />
            <div className="relative z-10">
              <p className="text-gold-400 font-bold text-sm uppercase tracking-widest mb-3">Commandez maintenant</p>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
                Prêt à Découvrir<br />Votre Style ?
              </h2>
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row gap-4">
              <Link to="/shop" className="btn-primary text-base">
                Voir la boutique <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/order" className="btn-whatsapp text-base">
                <MessageCircle className="w-5 h-5" /> WhatsApp
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
