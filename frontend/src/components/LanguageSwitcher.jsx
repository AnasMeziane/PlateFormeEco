import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';
import { Globe, Check } from 'lucide-react';

const languages = [
  { code: 'fr', label: 'FR', name: 'Français' },
  { code: 'ar', label: 'AR', name: 'العربية' },
];

export default function LanguageSwitcher({ variant = 'light' }) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLang = languages.find((l) => l.code === i18n.language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLang = (code) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  const isDark = variant === 'dark';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-pill text-xs font-bold transition-all ${
          isDark
            ? 'bg-white/10 hover:bg-white/20 text-white'
            : 'bg-cream-dark hover:bg-[#D8D2C7] text-dark'
        }`}
        aria-label="Change language"
      >
        <Globe className="w-3.5 h-3.5" />
        <span>{currentLang.label}</span>
      </button>

      {open && (
        <div className={`absolute top-full mt-2 ${i18n.language === 'ar' ? 'left-0' : 'right-0'} min-w-[160px] bg-white rounded-xl shadow-luxury border border-gray-100 overflow-hidden z-50`}>
          {languages.map((lang) => {
            const active = lang.code === i18n.language;
            return (
              <button
                key={lang.code}
                onClick={() => changeLang(lang.code)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                  active ? 'bg-gold-100 text-gold-600' : 'text-dark hover:bg-cream'
                }`}
              >
                <span>{lang.name}</span>
                {active && <Check className="w-4 h-4" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
