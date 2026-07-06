import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, MessageCircle, ShoppingBag, ArrowRight, Facebook, Instagram } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useSiteSettings, formatDisplayPhone } from '../hooks/useSiteSettings';
import API from '../api/axios';

// TikTok icon component (not available in Lucide)
const TikTokIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

export default function ClientLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [socialLinks, setSocialLinks] = useState([]);
  const { cartItems } = useCart();
  const location = useLocation();
  const { t } = useTranslation();
  const settings = useSiteSettings();

  // Fetch social media links
  useEffect(() => {
    API.get('/social-links')
      .then(res => setSocialLinks(res.data))
      .catch(() => {
        // Fallback to default links if API fails
        setSocialLinks([
          { platform: 'facebook', url: 'https://www.facebook.com/CHRI.LIYA.0680573571', is_active: true },
          { platform: 'instagram', url: 'https://www.instagram.com/chri_liya_officiele?igsh=bW9peXBkNHMyOGsx', is_active: true },
          { platform: 'tiktok', url: '', is_active: true },
        ]);
      });
  }, []);

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/shop', label: t('nav.shop') },
    { to: '/about', label: t('nav.about') },
    { to: '/contact', label: t('nav.contact') },
    { to: '/faq', label: t('nav.faq') },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      {/* ─── Header ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur-md border-b border-[#E2DAD0]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-18 py-4">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 bg-copper-400 rounded-full flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform relative">
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-copper-400"></div>
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                  <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-base font-extrabold tracking-tight text-dark leading-tight">CHRI LIYA <span className="text-copper-400">STORE</span></span>
                <span className="text-[10px] text-dark/40 font-medium tracking-wider">ONLINE SHOPPING</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const active = location.pathname === link.to ||
                  (link.to !== '/' && location.pathname.startsWith(link.to));
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`px-4 py-2 rounded-pill text-sm font-semibold transition-all ${
                      active
                        ? 'bg-dark text-cream'
                        : 'text-dark/60 hover:text-dark hover:bg-cream-dark'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* CTA + Mobile */}
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <Link to="/order" className="relative hidden sm:flex btn-primary text-sm py-2.5 px-5">
                <MessageCircle className="w-4 h-4" />
                {t('nav.order')}
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-royal-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {cartItems.length}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2.5 rounded-xl bg-cream-dark text-dark"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden bg-cream border-t border-[#E2DAD0] px-6 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  location.pathname === link.to
                    ? 'bg-dark text-cream'
                    : 'text-dark/60 hover:text-dark hover:bg-cream-dark'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/order" onClick={() => setMobileOpen(false)} className="btn-primary w-full justify-center mt-3">
              <MessageCircle className="w-4 h-4" /> {t('nav.order')}
            </Link>
            <div className="pt-2 flex justify-center">
              <LanguageSwitcher />
            </div>
          </div>
        )}
      </header>

      {/* ─── Main ───────────────────────────────────────────── */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* ─── Footer ─────────────────────────────────────────── */}
      <footer className="bg-dark text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-10 h-10 bg-copper-400 rounded-full flex items-center justify-center relative">
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-copper-400"></div>
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-extrabold text-white leading-tight">CHRI LIYA <span className="text-copper-400">STORE</span></span>
                  <span className="text-[10px] text-white/40 font-medium tracking-wider">ONLINE SHOPPING</span>
                </div>
              </div>
              <p className="text-white/50 text-sm leading-relaxed max-w-xs">
                {t('footer.tagline')}
              </p>
              <Link to="/order" className="btn-primary mt-6 text-sm py-2.5 px-5">
                <MessageCircle className="w-4 h-4" /> {t('footer.orderWhatsApp')}
              </Link>
            </div>

            {/* Links */}
            <div>
              <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">{t('footer.navigation')}</h3>
              <ul className="space-y-3">
                {navLinks.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-white/50 text-sm hover:text-gold-400 transition-colors font-medium">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">{t('footer.contact')}</h3>
              <ul className="space-y-3 text-sm text-white/50">
                <li className="flex items-start gap-2"><span>📍</span> Casablanca, Maroc</li>
                <li className="flex items-start gap-2"><span>📞</span> {formatDisplayPhone(settings.whatsapp_number)}</li>
                <li className="flex items-start gap-2"><span>✉️</span> {settings.contact_email}</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-white/30 text-sm">© {new Date().getFullYear()} CHRI LIYA STORE. {t('footer.rights')}</p>
            
            {/* Social Media Icons */}
            <div className="flex items-center gap-4">
              {socialLinks.filter(link => link.is_active).map((link) => {
                const iconProps = "w-5 h-5";
                let Icon;
                let brandColor;
                
                switch (link.platform) {
                  case 'facebook':
                    Icon = Facebook;
                    brandColor = 'hover:text-[#1877F2]';
                    break;
                  case 'instagram':
                    Icon = Instagram;
                    brandColor = 'hover:text-[#E4405F]';
                    break;
                  case 'tiktok':
                    Icon = TikTokIcon;
                    brandColor = 'hover:text-white';
                    break;
                  default:
                    return null;
                }
                
                // If no URL, render disabled icon
                if (!link.url) {
                  return (
                    <span 
                      key={link.platform}
                      className="text-white/20 cursor-not-allowed"
                      title={`${link.platform} - Bientôt disponible`}
                    >
                      <Icon className={iconProps} />
                    </span>
                  );
                }
                
                return (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-white/40 ${brandColor} transition-colors`}
                    title={link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
                  >
                    <Icon className={iconProps} />
                  </a>
                );
              })}
            </div>

            <div className="flex gap-6">
              <Link to="/faq" className="text-white/30 text-sm hover:text-white/60 transition-colors">{t('footer.terms')}</Link>
              <Link to="/faq" className="text-white/30 text-sm hover:text-white/60 transition-colors">{t('footer.privacy')}</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
