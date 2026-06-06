import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { Save, ArrowLeft, Plus, X, Image } from 'lucide-react';

const STORAGE_URL = 'http://localhost:8000/storage/';

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: '', name_ar: '', description: '', description_ar: '', price: '', stock_quantity: '', category_id: '', is_active: true,
  });
  const [categories, setCategories] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    API.get('/admin/categories').then((res) => setCategories(res.data)).catch(console.error);

    if (isEdit) {
      API.get(`/admin/products/${id}`)
        .then((res) => {
          const p = res.data;
          setForm({
            name: p.name, name_ar: p.name_ar || '',
            description: p.description || '', description_ar: p.description_ar || '',
            price: p.price,
            stock_quantity: p.stock_quantity, category_id: p.category_id, is_active: p.is_active,
          });
          setAttributes(p.attributes || []);
          setExistingImages(p.images || []);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const addAttribute = () => {
    setAttributes([...attributes, { attribute_name: '', attribute_value: '' }]);
  };

  const removeAttribute = (index) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const updateAttribute = (index, field, value) => {
    const updated = [...attributes];
    updated[index][field] = value;
    setAttributes(updated);
  };

  const removeExistingImage = async (imageId) => {
    try {
      await API.delete(`/admin/product-images/${imageId}`);
      setExistingImages(existingImages.filter((img) => img.id !== imageId));
      toast.success('Image supprimée.');
    } catch {
      toast.error('Erreur.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('name_ar', form.name_ar || '');
    formData.append('description', form.description);
    formData.append('description_ar', form.description_ar || '');
    formData.append('price', form.price);
    formData.append('stock_quantity', form.stock_quantity);
    formData.append('category_id', form.category_id);
    formData.append('is_active', form.is_active ? '1' : '0');

    // Attributes as JSON
    const validAttrs = attributes.filter((a) => a.attribute_name && a.attribute_value);
    formData.append('attributes', JSON.stringify(validAttrs));

    // New images
    for (const file of newImages) {
      formData.append('images[]', file);
    }

    try {
      if (isEdit) {
        formData.append('_method', 'PUT');
        await API.post(`/admin/products/${id}`, formData);
        toast.success('Produit modifié.');
      } else {
        await API.post('/admin/products', formData);
        toast.success('Produit créé.');
      }
      navigate('/admin/products');
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        Object.values(errors).flat().forEach((msg) => toast.error(msg));
      } else {
        toast.error('Erreur.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div></div>;
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/admin/products')} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Modifier le Produit' : 'Nouveau Produit'}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6 space-y-4">
              <h2 className="font-semibold text-gray-900">Informations Générales</h2>

              {/* French */}
              <div className="border border-gray-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-royal-500 bg-royal-50 px-2 py-0.5 rounded">FR</span>
                  <span className="text-sm font-medium text-gray-600">Français</span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit *</label>
                  <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field resize-none" />
                </div>
              </div>

              {/* Arabic */}
              <div className="border border-gray-200 rounded-xl p-4 space-y-3" dir="rtl">
                <div className="flex items-center gap-2" dir="ltr">
                  <span className="text-xs font-bold uppercase tracking-wider text-gold-600 bg-gold-100 px-2 py-0.5 rounded">AR</span>
                  <span className="text-sm font-medium text-gray-600">العربية</span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">اسم المنتج</label>
                  <input type="text" value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} className="input-field" style={{ fontFamily: 'Cairo, sans-serif' }} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
                  <textarea rows={4} value={form.description_ar} onChange={(e) => setForm({ ...form, description_ar: e.target.value })} className="input-field resize-none" style={{ fontFamily: 'Cairo, sans-serif' }} />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="card p-6">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Image className="w-5 h-5" /> Images
              </h2>
              {existingImages.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-4">
                  {existingImages.map((img) => (
                    <div key={img.id} className="relative group">
                      <img src={STORAGE_URL + img.image_url} alt="" className="w-24 h-24 object-cover rounded-lg border" />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(img.id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      {img.is_main && (
                        <span className="absolute bottom-1 left-1 bg-primary-600 text-white text-xs px-1.5 py-0.5 rounded">Principal</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setNewImages([...e.target.files])}
                className="input-field text-sm"
              />
              <p className="text-xs text-gray-400 mt-2">La première image sera l'image principale.</p>
            </div>

            {/* Attributes */}
            <div className="card p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-gray-900">Attributs</h2>
                <button type="button" onClick={addAttribute} className="text-sm text-primary-600 hover:underline flex items-center gap-1">
                  <Plus className="w-4 h-4" /> Ajouter
                </button>
              </div>
              <div className="space-y-3">
                {attributes.map((attr, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <input
                      type="text"
                      placeholder="Nom (ex: Couleur)"
                      value={attr.attribute_name}
                      onChange={(e) => updateAttribute(index, 'attribute_name', e.target.value)}
                      className="input-field flex-1"
                    />
                    <input
                      type="text"
                      placeholder="Valeur (ex: Rouge)"
                      value={attr.attribute_value}
                      onChange={(e) => updateAttribute(index, 'attribute_value', e.target.value)}
                      className="input-field flex-1"
                    />
                    <button type="button" onClick={() => removeAttribute(index)} className="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {attributes.length === 0 && <p className="text-sm text-gray-400">Aucun attribut ajouté.</p>}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="card p-6 space-y-4">
              <h2 className="font-semibold text-gray-900">Détails</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
                <select
                  required
                  value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  className="input-field"
                >
                  <option value="">Sélectionner...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix (DH) *</label>
                <input type="number" required step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantité en stock *</label>
                <input type="number" required min="0" value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })} className="input-field" />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="w-4 h-4 text-primary-600 rounded"
                  id="is_active"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Produit actif</label>
              </div>
            </div>

            <button type="submit" disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
              <Save className="w-4 h-4" />
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
