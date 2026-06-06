import { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { ShoppingCart, Trash2, Eye, X } from 'lucide-react';

const statusLabels = {
  pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-700' },
  confirmed: { label: 'Confirmée', color: 'bg-green-100 text-green-700' },
  completed: { label: 'Complétée', color: 'bg-blue-100 text-blue-700' },
  cancelled: { label: 'Annulée', color: 'bg-red-100 text-red-700' },
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchOrders = (page = 1) => {
    setLoading(true);
    const params = { page };
    if (filter) params.status = filter;
    API.get('/admin/whatsapp-orders', { params })
      .then((res) => {
        setOrders(res.data.data);
        setLastPage(res.data.last_page);
        setCurrentPage(res.data.current_page);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, [filter]);

  const updateStatus = async (orderId, status) => {
    try {
      await API.put(`/admin/whatsapp-orders/${orderId}/status`, { status });
      toast.success('Statut mis à jour.');
      fetchOrders(currentPage);
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status });
      }
    } catch {
      toast.error('Erreur.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette commande ?')) return;
    try {
      await API.delete(`/admin/whatsapp-orders/${id}`);
      toast.success('Commande supprimée.');
      fetchOrders(currentPage);
    } catch {
      toast.error('Erreur.');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Commandes WhatsApp</h1>
          <p className="text-gray-500 text-sm mt-1">Suivi des demandes clients</p>
        </div>
        <select
          value={filter}
          onChange={(e) => { setFilter(e.target.value); setCurrentPage(1); }}
          className="input-field w-auto"
        >
          <option value="">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="confirmed">Confirmée</option>
          <option value="completed">Complétée</option>
          <option value="cancelled">Annulée</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">#</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Client</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Téléphone</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Ville</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Statut</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b"><td colSpan={7} className="py-4 px-4"><div className="h-4 bg-gray-200 rounded animate-pulse" /></td></tr>
                ))
              ) : orders.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-gray-500">Aucune commande.</td></tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-500">#{order.id}</td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{order.customer?.full_name}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{order.customer?.phone_number}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{order.customer?.city}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{new Date(order.order_date).toLocaleDateString('fr-FR')}</td>
                    <td className="py-3 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${statusLabels[order.status]?.color}`}
                      >
                        <option value="pending">En attente</option>
                        <option value="confirmed">Confirmée</option>
                        <option value="completed">Complétée</option>
                        <option value="cancelled">Annulée</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => setSelectedOrder(order)} className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(order.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {lastPage > 1 && (
          <div className="flex justify-center gap-2 py-4 border-t">
            {[...Array(lastPage)].map((_, i) => (
              <button key={i} onClick={() => fetchOrders(i + 1)} className={`w-9 h-9 rounded-lg text-sm font-medium ${currentPage === i + 1 ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>{i + 1}</button>
            ))}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Commande #{selectedOrder.id}</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Client</h3>
                <p className="text-sm"><strong>Nom:</strong> {selectedOrder.customer?.full_name}</p>
                <p className="text-sm"><strong>Tél:</strong> {selectedOrder.customer?.phone_number}</p>
                <p className="text-sm"><strong>Ville:</strong> {selectedOrder.customer?.city}</p>
                {selectedOrder.customer?.address && <p className="text-sm"><strong>Adresse:</strong> {selectedOrder.customer.address}</p>}
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Produits</h3>
                {selectedOrder.products?.map((p) => (
                  <p key={p.id} className="text-sm">• {p.name} — {parseFloat(p.price).toFixed(2)} DH</p>
                ))}
              </div>
              {selectedOrder.message_sent && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Message WhatsApp</h3>
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">{selectedOrder.message_sent}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
