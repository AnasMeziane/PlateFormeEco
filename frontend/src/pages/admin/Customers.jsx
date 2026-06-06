import { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { Users, Trash2, Eye, X } from 'lucide-react';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchCustomers = (page = 1) => {
    setLoading(true);
    API.get('/admin/customers', { params: { page } })
      .then((res) => {
        setCustomers(res.data.data);
        setLastPage(res.data.last_page);
        setCurrentPage(res.data.current_page);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCustomers(); }, []);

  const viewCustomer = async (id) => {
    try {
      const res = await API.get(`/admin/customers/${id}`);
      setSelectedCustomer(res.data);
    } catch {
      toast.error('Erreur.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce client ?')) return;
    try {
      await API.delete(`/admin/customers/${id}`);
      toast.success('Client supprimé.');
      fetchCustomers(currentPage);
    } catch {
      toast.error('Erreur.');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
        <p className="text-gray-500 text-sm mt-1">Liste des clients ayant commandé via WhatsApp</p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Nom</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Téléphone</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Ville</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Commandes</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b"><td colSpan={5} className="py-4 px-4"><div className="h-4 bg-gray-200 rounded animate-pulse" /></td></tr>
                ))
              ) : customers.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-gray-500">Aucun client.</td></tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{c.full_name}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{c.phone_number}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{c.city}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{c.whatsapp_orders_count} commande(s)</td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => viewCustomer(c.id)} className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(c.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
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
              <button key={i} onClick={() => fetchCustomers(i + 1)} className={`w-9 h-9 rounded-lg text-sm font-medium ${currentPage === i + 1 ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>{i + 1}</button>
            ))}
          </div>
        )}
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">{selectedCustomer.full_name}</h2>
              <button onClick={() => setSelectedCustomer(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3 mb-6">
              <p className="text-sm"><strong>Tél:</strong> {selectedCustomer.phone_number}</p>
              <p className="text-sm"><strong>Ville:</strong> {selectedCustomer.city}</p>
              {selectedCustomer.address && <p className="text-sm"><strong>Adresse:</strong> {selectedCustomer.address}</p>}
            </div>
            <h3 className="font-medium text-gray-900 mb-3">Historique des Commandes</h3>
            {selectedCustomer.whatsapp_orders?.length > 0 ? (
              <div className="space-y-3">
                {selectedCustomer.whatsapp_orders.map((order) => (
                  <div key={order.id} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Commande #{order.id}</span>
                      <span className="text-xs text-gray-500">{new Date(order.order_date).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <p className="text-xs text-gray-500">{order.products?.map((p) => p.name).join(', ')}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Aucune commande.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
