import { Target, Heart, Award, Users, Truck, ShieldCheck, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation();

  const stats = [
    { value: '10 000+', label: t('about.stat1') },
    { value: '500+',    label: t('about.stat2') },
    { value: '5',       label: t('about.stat3') },
    { value: '5★',      label: t('about.stat4') },
  ];

  const values = [
    { icon: Award,       title: t('about.value1Title'), desc: t('about.value1Desc') },
    { icon: Heart,       title: t('about.value2Title'), desc: t('about.value2Desc') },
    { icon: ShieldCheck, title: t('about.value3Title'), desc: t('about.value3Desc') },
    { icon: Truck,       title: t('about.value4Title'), desc: t('about.value4Desc') },
  ];

    return (
    <div className="bg-cream">

      {/* ── Hero Banner ── */}
      <section className="bg-dark text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-royal-500/20 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
          <span className="label-pill mb-6 inline-flex">{t('about.badgeStory')}</span>
          <h1 className="text-display-md font-extrabold text-white leading-tight mt-4 mb-6">
            {t('about.heroTitle')}<br />
            <span className="text-copper-400">{t('about.heroAccent')}</span>
          </h1>
          <p className="text-white/50 text-lg max-w-xl leading-relaxed">
            {t('about.heroDesc')}
          </p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-royal-500 py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map(({ value, label }) => (
              <div key={label}>
                <p className="text-3xl md:text-4xl font-extrabold text-white">{value}</p>
                <p className="text-white/50 text-sm mt-1 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Story ── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="label-pill mb-5 inline-flex">{t('about.badgeWho')}</span>
              <h2 className="text-display-sm font-extrabold text-dark mt-4 mb-6">
                {t('about.storyTitle')}
              </h2>
              <div className="space-y-4 text-dark/60 leading-relaxed">
                <p>{t('about.storyP1')}</p>
                <p>{t('about.storyP2')}</p>
                <p>{t('about.storyP3')}</p>
              </div>
              <Link to="/shop" className="btn-primary mt-8 inline-flex">
                {t('about.discoverShop')} <ArrowRight className="w-4 h-4 rtl-flip" />
              </Link>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=700&h=500&fit=crop"
                alt="Notre boutique"
                className="rounded-3xl shadow-luxury-lg w-full object-cover aspect-[4/3]"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-luxury p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-copper-100 rounded-xl flex items-center justify-center shrink-0">
                  <Star className="w-6 h-6 text-copper-500 fill-copper-400" />
                </div>
                <div>
                  <p className="font-extrabold text-dark text-lg">4.9 / 5</p>
                  <p className="text-dark/40 text-xs font-medium">{t('about.reviews')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-24 bg-cream-dark">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-14">
            <span className="label-pill mb-4 inline-flex">{t('about.badgeValues')}</span>
            <h2 className="text-display-sm font-extrabold text-dark mt-4">{t('about.valuesTitle')}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-7 shadow-luxury hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-12 h-12 bg-royal-100 rounded-xl flex items-center justify-center mb-5 group-hover:bg-royal-500 transition-colors">
                  <Icon className="w-6 h-6 text-royal-500 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-extrabold text-dark text-base mb-2">{title}</h3>
                <p className="text-dark/50 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-14">
            <span className="label-pill mb-4 inline-flex">{t('about.badgeTeam')}</span>
            <h2 className="text-display-sm font-extrabold text-dark mt-4">{t('about.teamTitle')}</h2>
          </div>
          {/* Team philosophy section */}
          <div className="max-w-2xl mx-auto text-center bg-white rounded-3xl p-10 shadow-luxury">
            <div className="w-16 h-16 bg-copper-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-copper-500" />
            </div>
            <p className="text-dark/60 leading-relaxed text-base">
              {t('about.teamPhilosophy', 'Chez CHRI LIYA STORE, nous sommes une équipe passionnée et dévouée, unie par notre amour pour la mode et notre engagement envers l\'excellence du service client. Chaque membre de notre équipe contribue à créer une expérience shopping unique et mémorable pour vous.')}
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="bg-dark rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-60 h-60 bg-copper-400/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-royal-500/20 rounded-full blur-3xl" />
            <div className="relative z-10">
              <p className="text-copper-400 font-bold text-sm uppercase tracking-widest mb-4">{t('about.ctaSmall')}</p>
              <h2 className="text-4xl font-extrabold text-white mb-6">{t('about.ctaTitle')}</h2>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/shop" className="btn-primary">{t('about.ctaShop')} <ArrowRight className="w-4 h-4 rtl-flip" /></Link>
                <Link to="/contact" className="btn-secondary">{t('about.ctaContact')}</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
