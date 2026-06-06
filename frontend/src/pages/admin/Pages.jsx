import { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { FileText, Pencil, X, Save } from 'lucide-react';

export default function Pages() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', content: '' });
  const [saving, setSaving] = useState(false);

  const fetchPages = () => {
    setLoading(true);
    API.get('/admin/pages')
      .then((res) => setPages(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPages(); }, []);

  const openEdit = (page) => {
    setEditing(page);
    setForm({ title: page.title, content: page.content });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.put(`/admin/pages/${editing.id}`, form);
      toast.success('Page mise à jour.');
      setEditing(null);
      fetchPages();
    } catch (err) {
      toast.error('Erreur.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pages CMS</h1>
        <p className="text-gray-500 text-sm mt-1">Modifiez le contenu des pages statiques</p>
      </div>

      {editing ? (
        <div className="card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Modifier : {editing.title}</h2>
            <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contenu (HTML)</label>
              <textarea
                rows={15}
                required
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="input-field resize-none font-mono text-sm"
              />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Aperçu</h3>
              <div className="border rounded-lg p-4 prose prose-sm max-w-none bg-gray-50" dangerouslySetInnerHTML={{ __html: form.content }} />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setEditing(null)} className="btn-secondary flex-1">Annuler</button>
              <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                <Save className="w-4 h-4" />
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-4">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-1/3 mb-3" />
                <div className="h-4 bg-gray-200 rounded w-full" />
              </div>
            ))
          ) : (
            pages.map((page) => (
              <div key={page.id} className="card p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary-50 p-2.5 rounded-lg">
                      <FileText className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{page.title}</h3>
                      <p className="text-sm text-gray-400">/{page.slug}</p>
                    </div>
                  </div>
                  <button onClick={() => openEdit(page)} className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-3 text-sm text-gray-500 line-clamp-2" dangerouslySetInnerHTML={{ __html: page.content }} />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
