import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Package, Eye } from 'lucide-react';

const STORAGE_URL = 'http://localhost:8000/storage/';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchProducts = (page = 1) => {
    setLoading(true);
    API.get('/admin/products', { params: { page } })
      .then((res) => {
        setProducts(res.data.data);
        setLastPage(res.data.last_page);
        setCurrentPage(res.data.current_page);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce produit ?')) return;
    try {
      await API.delete(`/admin/products/${id}`);
      toast.success('Produit supprimé.');
      fetchProducts(currentPage);
    } catch (err) {
      toast.error('Erreur lors de la suppression.');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Produits</h1>
          <p className="text-gray-500 text-sm mt-1">Gérez votre catalogue</p>
        </div>
        <Link to="/admin/products/create" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nouveau Produit
        </Link>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Produit</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Catégorie</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Prix</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Stock</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Statut</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b">
                    <td colSpan={6} className="py-4 px-4"><div className="h-4 bg-gray-200 rounded animate-pulse" /></td>
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500">Aucun produit trouvé.</td>
                </tr>
              ) : (
                products.map((product) => {
                  const mainImg = product.images?.find((i) => i.is_main) || product.images?.[0];
                  return (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={mainImg ? STORAGE_URL + mainImg.image_url : 'https://via.placeholder.com/40'}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <span className="text-sm font-medium text-gray-900">{product.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">{product.category?.name}</td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{parseFloat(product.price).toFixed(2)} DH</td>
                      <td className="py-3 px-4">
                        <span className={`text-sm font-medium ${product.stock_quantity <= 5 ? 'text-red-500' : 'text-gray-900'}`}>
                          {product.stock_quantity}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          product.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {product.is_active ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-end gap-1">
                          <Link to={`/admin/products/${product.id}/edit`} className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg">
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button onClick={() => handleDelete(product.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {lastPage > 1 && (
          <div className="flex justify-center gap-2 py-4 border-t">
            {[...Array(lastPage)].map((_, i) => (
              <button
                key={i}
                onClick={() => fetchProducts(i + 1)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === i + 1 ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
