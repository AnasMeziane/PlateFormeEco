import { useState } from 'react';
import { ChevronDown, MessageCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSiteSettings } from '../../hooks/useSiteSettings';

function AccordionItem({ title, content, isOpen, onToggle }) {
  return (
    <div className={`rounded-2xl overflow-hidden transition-all duration-200 ${isOpen ? 'bg-dark shadow-luxury' : 'bg-white'}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 text-left gap-4"
      >
        <span className={`font-bold text-base leading-snug ${isOpen ? 'text-white' : 'text-dark'}`}>{title}</span>
        <ChevronDown className={`w-5 h-5 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-gold-400' : 'text-dark/40'}`} />
      </button>
      {isOpen && (
        <div className="px-6 pb-6">
          <p className="text-white/60 leading-relaxed text-sm">{content}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  const { t } = useTranslation();
  const settings = useSiteSettings();
  const faqItems = t('faqPage.items', { returnObjects: true });
  const termsItems = t('faqPage.terms', { returnObjects: true });
  const [openFaq, setOpenFaq] = useState(0);
  const [openTerms, setOpenTerms] = useState(null);

  return (
    <div className="bg-cream">

      {/* ── Hero ── */}
      <section className="bg-dark text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gold-400/10 to-royal-500/20" />
        <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
          <span className="label-pill mb-6 inline-flex">{t('faqPage.badgeHelp')}</span>
          <h1 className="text-display-md font-extrabold text-white leading-tight mt-4 mb-4">
            {t('faqPage.heroTitle')}<br />
            <span className="text-gold-400">{t('faqPage.heroAccent')}</span>
          </h1>
          <p className="text-white/50 text-lg max-w-lg leading-relaxed">
            {t('faqPage.heroDesc')}
          </p>
          <Link to="/contact" className="btn-primary mt-8 inline-flex">
            <MessageCircle className="w-4 h-4" /> {t('faqPage.contactUs')}
          </Link>
        </div>
      </section>

      {/* ── FAQ Accordion ── */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-14">
            <span className="label-pill mb-4 inline-flex">{t('faqPage.badgeFaq')}</span>
            <h2 className="text-display-sm font-extrabold text-dark mt-4">{t('faqPage.sectionTitle')}</h2>
          </div>
          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <AccordionItem
                key={i}
                title={item.q}
                content={item.a}
                isOpen={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── WhatsApp CTA ── */}
      <section className="bg-cream-dark py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <MessageCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-extrabold text-dark mb-3">{t('faqPage.ctaTitle')}</h2>
          <p className="text-dark/50 text-sm mb-6 leading-relaxed max-w-md mx-auto">
            {t('faqPage.ctaDesc')}
          </p>
          <a
            href={`https://wa.me/${settings.whatsapp_number}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp inline-flex"
          >
            <MessageCircle className="w-5 h-5" /> {t('faqPage.ctaWhatsApp')}
          </a>
        </div>
      </section>

      {/* ── Conditions Générales ── */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-14">
            <span className="label-pill mb-4 inline-flex">{t('faqPage.badgeLegal')}</span>
            <h2 className="text-display-sm font-extrabold text-dark mt-4">{t('faqPage.termsTitle')}</h2>
            <p className="text-dark/40 text-sm mt-3">{t('faqPage.lastUpdate')}</p>
          </div>
          <div className="space-y-3">
            {termsItems.map((item, i) => (
              <AccordionItem
                key={i}
                title={item.title}
                content={item.content}
                isOpen={openTerms === i}
                onToggle={() => setOpenTerms(openTerms === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
