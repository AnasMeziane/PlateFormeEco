import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Package, FolderTree, Users, ShoppingCart, AlertTriangle, Clock } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/dashboard')
      .then((res) => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
              <div className="h-8 bg-gray-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Produits', value: stats?.total_products, icon: Package, color: 'bg-blue-50 text-blue-600' },
    { label: 'Catégories', value: stats?.total_categories, icon: FolderTree, color: 'bg-purple-50 text-purple-600' },
    { label: 'Clients', value: stats?.total_customers, icon: Users, color: 'bg-green-50 text-green-600' },
    { label: 'Commandes', value: stats?.total_orders, icon: ShoppingCart, color: 'bg-orange-50 text-orange-600' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Aperçu de votre boutique</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div key={card.label} className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500">{card.label}</span>
              <div className={`p-2.5 rounded-lg ${card.color}`}>
                <card.icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{card.value || 0}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Order Status */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-400" /> Statut des Commandes
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-yellow-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-yellow-600">{stats?.pending_orders || 0}</p>
              <p className="text-sm text-yellow-700 mt-1">En attente</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-600">{stats?.confirmed_orders || 0}</p>
              <p className="text-sm text-green-700 mt-1">Confirmées</p>
            </div>
          </div>
        </div>

        {/* Low Stock */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" /> Stock Faible
          </h2>
          {stats?.low_stock_products?.length > 0 ? (
            <div className="space-y-3">
              {stats.low_stock_products.map((p) => (
                <div key={p.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm text-gray-700">{p.name}</span>
                  <span className="text-sm font-medium text-red-500">{p.stock_quantity} restants</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Aucun produit en stock faible.</p>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Commandes Récentes</h2>
        {stats?.recent_orders?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Client</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Produits</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Statut</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">{order.customer?.full_name}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{new Date(order.order_date).toLocaleDateString('fr-FR')}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{order.products?.length || 0} article(s)</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        order.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        order.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {order.status === 'pending' ? 'En attente' :
                         order.status === 'confirmed' ? 'Confirmée' :
                         order.status === 'completed' ? 'Complétée' : 'Annulée'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Aucune commande récente.</p>
        )}
      </div>
    </div>
  );
}
