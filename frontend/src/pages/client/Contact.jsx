import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { Send, MapPin, Phone, Mail } from 'lucide-react';
import { useSiteSettings, formatDisplayPhone } from '../../hooks/useSiteSettings';

export default function Contact() {
  const { t, i18n } = useTranslation();
  const settings = useSiteSettings();
  const [page, setPage] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    API.get('/pages/contact').then((res) => setPage(res.data)).catch(console.error);
  }, [i18n.language]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await API.post('/contact', form);
      toast.success(res.data.message);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast.error(t('contactPage.errorSend'));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-12">{t('contactPage.title')}</h1>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div>
          <div className="card p-8">
            {page && (
              <div className="prose prose-sm mb-8" dangerouslySetInnerHTML={{ __html: page.content }} />
            )}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-primary-50 p-2.5 rounded-lg">
                  <MapPin className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{t('contactPage.addressLabel')}</h3>
                  <p className="text-sm text-gray-500">{t('contactPage.addressValue')}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary-50 p-2.5 rounded-lg">
                  <Phone className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{t('contactPage.phoneLabel')}</h3>
                  <p className="text-sm text-gray-500">{formatDisplayPhone(settings.whatsapp_number)}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary-50 p-2.5 rounded-lg">
                  <Mail className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{t('contactPage.emailLabel')}</h3>
                  <p className="text-sm text-gray-500">{settings.contact_email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="card p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('contactPage.formTitle')}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('contactPage.fullName')}</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('contactPage.email')}</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('contactPage.subject')}</label>
              <input
                type="text"
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('contactPage.message')}</label>
              <textarea
                rows={5}
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="input-field resize-none"
              />
            </div>
            <button type="submit" disabled={sending} className="btn-primary w-full flex items-center justify-center gap-2">
              <Send className="w-4 h-4" />
              {sending ? t('contactPage.sending') : t('contactPage.submit')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
