import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { Save, User, Mail, Lock, Eye, EyeOff, MessageCircle, Globe } from 'lucide-react';
import { refreshSiteSettings } from '../../hooks/useSiteSettings';

export default function Settings() {
  const { user, setUser } = useAuth();

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [siteForm, setSiteForm] = useState({ whatsapp_number: '', contact_email: '' });
  const [savingSite, setSavingSite] = useState(false);
  const [loadingSite, setLoadingSite] = useState(true);

  useEffect(() => {
    API.get('/site-settings')
      .then((res) => setSiteForm({
        whatsapp_number: res.data?.whatsapp_number || '',
        contact_email: res.data?.contact_email || '',
      }))
      .catch(() => {})
      .finally(() => setLoadingSite(false));
  }, []);

  const handleSiteSave = async (e) => {
    e.preventDefault();
    setSavingSite(true);
    try {
      // Normalize: strip non-digits from phone
      const payload = {
        whatsapp_number: siteForm.whatsapp_number.replace(/\D/g, ''),
        contact_email: siteForm.contact_email,
      };
      const res = await API.put('/admin/site-settings', payload);
      setSiteForm({
        whatsapp_number: res.data?.whatsapp_number || '',
        contact_email: res.data?.contact_email || '',
      });
      await refreshSiteSettings();
      toast.success('Paramètres du site mis à jour !');
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        Object.values(errors).flat().forEach((msg) => toast.error(msg));
      } else {
        toast.error('Erreur lors de la mise à jour des paramètres du site.');
      }
    } finally {
      setSavingSite(false);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await API.put('/user/profile', {
        name: profileForm.name,
        email: profileForm.email,
      });
      if (setUser) setUser(res.data);
      toast.success('Profil mis à jour avec succès !');
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        Object.values(errors).flat().forEach((msg) => toast.error(msg));
      } else {
        toast.error('Erreur lors de la mise à jour.');
      }
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (passwordForm.new_password !== passwordForm.new_password_confirmation) {
      toast.error('Les nouveaux mots de passe ne correspondent pas.');
      return;
    }
    setSavingPassword(true);
    try {
      await API.put('/user/profile', {
        name: profileForm.name,
        email: profileForm.email,
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
        new_password_confirmation: passwordForm.new_password_confirmation,
      });
      toast.success('Mot de passe modifié avec succès !');
      setPasswordForm({ current_password: '', new_password: '', new_password_confirmation: '' });
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        Object.values(errors).flat().forEach((msg) => toast.error(msg));
      } else {
        toast.error('Mot de passe actuel incorrect.');
      }
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Paramètres du Compte</h1>
        <p className="text-gray-500 text-sm mt-1">Gérez vos informations personnelles et votre sécurité</p>
      </div>

      {/* Avatar */}
      <div className="card p-6 mb-6 flex items-center gap-5">
        <div className="w-16 h-16 bg-royal-500 rounded-2xl flex items-center justify-center text-2xl font-extrabold text-white shrink-0">
          {user?.name?.charAt(0)?.toUpperCase()}
        </div>
        <div>
          <p className="font-bold text-gray-900 text-lg">{user?.name}</p>
          <p className="text-gray-400 text-sm">{user?.email}</p>
          <span className="inline-block mt-1 text-xs font-semibold bg-royal-50 text-royal-600 px-2 py-0.5 rounded-full">Administrateur</span>
        </div>
      </div>

      {/* Site Settings */}
      <div className="card p-6 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
            <Globe className="w-4 h-4 text-green-600" />
          </div>
          <h2 className="font-semibold text-gray-900">Paramètres du Site</h2>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          Numéro WhatsApp où les commandes sont envoyées et email de contact affiché sur le site.
        </p>
        <form onSubmit={handleSiteSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5" /> Numéro WhatsApp (commandes) *
            </label>
            <input
              type="text"
              required
              disabled={loadingSite}
              value={siteForm.whatsapp_number}
              onChange={(e) => setSiteForm({ ...siteForm, whatsapp_number: e.target.value })}
              className="input-field"
              placeholder="212671869919"
            />
            <p className="text-xs text-gray-400 mt-1">
              Format international sans le « + » (ex : <span className="font-mono">212671869919</span> pour 0671869919).
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" /> Email de contact *
            </label>
            <input
              type="email"
              required
              disabled={loadingSite}
              value={siteForm.contact_email}
              onChange={(e) => setSiteForm({ ...siteForm, contact_email: e.target.value })}
              className="input-field"
              placeholder="contact@exemple.com"
            />
          </div>
          <div className="pt-2">
            <button type="submit" disabled={savingSite || loadingSite} className="btn-primary flex items-center gap-2 bg-green-600 hover:bg-green-700">
              <Save className="w-4 h-4" />
              {savingSite ? 'Enregistrement...' : 'Sauvegarder les paramètres'}
            </button>
          </div>
        </form>
      </div>

      {/* Profile Info */}
      <div className="card p-6 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 bg-royal-50 rounded-lg flex items-center justify-center">
            <User className="w-4 h-4 text-royal-600" />
          </div>
          <h2 className="font-semibold text-gray-900">Informations Personnelles</h2>
        </div>
        <form onSubmit={handleProfileSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
            <input
              type="text"
              required
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              className="input-field"
              placeholder="Votre nom"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" /> Adresse email *
            </label>
            <input
              type="email"
              required
              value={profileForm.email}
              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              className="input-field"
              placeholder="email@exemple.com"
            />
          </div>
          <div className="pt-2">
            <button type="submit" disabled={savingProfile} className="btn-primary flex items-center gap-2">
              <Save className="w-4 h-4" />
              {savingProfile ? 'Enregistrement...' : 'Sauvegarder le profil'}
            </button>
          </div>
        </form>
      </div>

      {/* Password */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
            <Lock className="w-4 h-4 text-amber-600" />
          </div>
          <h2 className="font-semibold text-gray-900">Changer le Mot de Passe</h2>
        </div>
        <form onSubmit={handlePasswordSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe actuel *</label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                required
                value={passwordForm.current_password}
                onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                className="input-field pr-10"
                placeholder="Mot de passe actuel"
              />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe *</label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                required
                minLength={8}
                value={passwordForm.new_password}
                onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                className="input-field pr-10"
                placeholder="Minimum 8 caractères"
              />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le nouveau mot de passe *</label>
            <input
              type="password"
              required
              value={passwordForm.new_password_confirmation}
              onChange={(e) => setPasswordForm({ ...passwordForm, new_password_confirmation: e.target.value })}
              className="input-field"
              placeholder="Répétez le nouveau mot de passe"
            />
          </div>
          <div className="pt-2">
            <button type="submit" disabled={savingPassword} className="btn-primary flex items-center gap-2 bg-amber-500 hover:bg-amber-600">
              <Lock className="w-4 h-4" />
              {savingPassword ? 'Modification...' : 'Modifier le mot de passe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
