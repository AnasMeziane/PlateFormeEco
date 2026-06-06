import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import API from '../../api/axios';
import ProductCard from '../../components/ProductCard';
import { Search, SlidersHorizontal } from 'lucide-react';

export default function Shop() {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    API.get('/categories').then((res) => setCategories(res.data)).catch(console.error);
  }, [i18n.language]);

  useEffect(() => {
    setLoading(true);
    const params = { page: currentPage };
    if (selectedCategory) params.category_id = selectedCategory;
    if (search) params.search = search;

    API.get('/products', { params })
      .then((res) => {
        setProducts(res.data.data);
        setLastPage(res.data.last_page);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [currentPage, selectedCategory, search, i18n.language]);

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    setCurrentPage(1);
    if (catId) {
      setSearchParams({ category: catId });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('shop.title')}</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:w-64 shrink-0">
          <div className="card p-5 sticky top-24">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" /> {t('shop.filters')}
            </h3>

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('common.search') + '...'}
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="input-field pl-10 text-sm"
              />
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">{t('shop.categories')}</h4>
              <div className="space-y-1">
                <button
                  onClick={() => handleCategoryChange('')}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    !selectedCategory ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {t('common.all')}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(String(cat.id))}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === String(cat.id) ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {cat.name} ({cat.products_count})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="aspect-square bg-gray-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">{t('shop.noProducts')}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {lastPage > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {[...Array(lastPage)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === i + 1
                          ? 'bg-primary-600 text-white'
                          : 'bg-white text-gray-600 border hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
