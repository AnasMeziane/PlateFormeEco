import { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { Share2, Facebook, Instagram, Save, ExternalLink, ToggleLeft, ToggleRight } from 'lucide-react';

// TikTok icon component
const TikTokIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const platformConfig = {
  facebook: {
    name: 'Facebook',
    icon: Facebook,
    color: 'bg-[#1877F2]',
    placeholder: 'https://www.facebook.com/votre-page',
  },
  instagram: {
    name: 'Instagram',
    icon: Instagram,
    color: 'bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737]',
    placeholder: 'https://www.instagram.com/votre-compte',
  },
  tiktok: {
    name: 'TikTok',
    icon: TikTokIcon,
    color: 'bg-black',
    placeholder: 'https://www.tiktok.com/@votre-compte',
  },
};

export default function SocialLinks() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const res = await API.get('/admin/social-links');
      setLinks(res.data);
    } catch (err) {
      toast.error('Erreur lors du chargement des liens');
    } finally {
      setLoading(false);
    }
  };

  const handleUrlChange = (id, url) => {
    setLinks(prev => prev.map(link => 
      link.id === id ? { ...link, url } : link
    ));
  };

  const handleToggleActive = (id) => {
    setLinks(prev => prev.map(link => 
      link.id === id ? { ...link, is_active: !link.is_active } : link
    ));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await API.put('/admin/social-links', {
        links: links.map(link => ({
          id: link.id,
          url: link.url || null,
          is_active: link.is_active,
          sort_order: link.sort_order,
        })),
      });
      toast.success('Liens sociaux mis à jour avec succès');
    } catch (err) {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-navy-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-500">Liens de Réseaux Sociaux</h1>
          <p className="text-slate-500 text-sm mt-1">
            Gérez vos liens de réseaux sociaux affichés dans le pied de page
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>

      {/* Links Grid */}
      <div className="grid gap-4">
        {links.map((link) => {
          const config = platformConfig[link.platform];
          if (!config) return null;
          const Icon = config.icon;

          return (
            <div
              key={link.id}
              className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all ${
                !link.is_active ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-center gap-4 p-5">
                {/* Platform Icon */}
                <div className={`w-12 h-12 ${config.color} rounded-xl flex items-center justify-center shrink-0`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Platform Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-navy-500 text-lg">{config.name}</h3>
                    {link.url && (
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-copper-500 hover:text-copper-600"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <input
                    type="url"
                    value={link.url || ''}
                    onChange={(e) => handleUrlChange(link.id, e.target.value)}
                    placeholder={config.placeholder}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-copper-400 focus:border-copper-400 outline-none transition-all"
                  />
                </div>

                {/* Toggle Active */}
                <button
                  onClick={() => handleToggleActive(link.id)}
                  className={`p-2 rounded-xl transition-all ${
                    link.is_active
                      ? 'text-green-500 bg-green-50 hover:bg-green-100'
                      : 'text-slate-400 bg-slate-100 hover:bg-slate-200'
                  }`}
                  title={link.is_active ? 'Actif - Cliquer pour désactiver' : 'Inactif - Cliquer pour activer'}
                >
                  {link.is_active ? (
                    <ToggleRight className="w-6 h-6" />
                  ) : (
                    <ToggleLeft className="w-6 h-6" />
                  )}
                </button>
              </div>

              {/* Status Bar */}
              <div className={`px-5 py-2 text-xs font-medium ${
                link.is_active && link.url
                  ? 'bg-green-50 text-green-600'
                  : link.is_active && !link.url
                  ? 'bg-amber-50 text-amber-600'
                  : 'bg-slate-50 text-slate-500'
              }`}>
                {link.is_active && link.url && '✓ Actif et visible sur le site'}
                {link.is_active && !link.url && '⚠ Actif mais aucune URL définie (icône désactivée)'}
                {!link.is_active && '○ Désactivé - Non visible sur le site'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Box */}
      <div className="bg-copper-50 border border-copper-200 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-copper-100 rounded-xl flex items-center justify-center shrink-0">
            <Share2 className="w-5 h-5 text-copper-600" />
          </div>
          <div>
            <h4 className="font-bold text-copper-700 mb-1">Comment ça marche ?</h4>
            <ul className="text-sm text-copper-600 space-y-1">
              <li>• Les liens actifs avec une URL sont affichés dans le pied de page du site</li>
              <li>• Les liens actifs sans URL affichent une icône grisée (ex: TikTok "Bientôt disponible")</li>
              <li>• Les liens désactivés ne sont pas visibles du tout sur le site</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
