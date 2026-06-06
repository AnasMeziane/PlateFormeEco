<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\Page;
use Illuminate\Http\Request;

class ShopController extends Controller
{
    /**
     * Resolve current locale from Accept-Language header (fallback fr).
     */
    protected function getLocale(Request $request): string
    {
        $lang = strtolower(substr($request->header('Accept-Language', 'fr'), 0, 2));
        return in_array($lang, ['fr', 'ar']) ? $lang : 'fr';
    }

    /**
     * Apply locale to a collection of products (and their nested categories).
     */
    protected function localizeProducts($products, string $locale)
    {
        $products->each(function ($p) use ($locale) {
            $p->applyLocale($locale);
            if ($p->category) {
                $p->category->applyLocale($locale);
            }
        });
        return $products;
    }

    /**
     * Homepage data: featured products & categories
     */
    public function home(Request $request)
    {
        $locale = $this->getLocale($request);

        $categories = Category::withCount('products')->get()
            ->each(fn ($c) => $c->applyLocale($locale));

        $featured = Product::with(['images', 'category'])
            ->where('is_active', true)
            ->latest()
            ->take(8)
            ->get();
        $this->localizeProducts($featured, $locale);

        return response()->json([
            'categories' => $categories,
            'featured_products' => $featured,
        ]);
    }

    /**
     * Shop page: all products with filters
     */
    public function products(Request $request)
    {
        $locale = $this->getLocale($request);

        $query = Product::with(['images', 'category', 'attributes'])
            ->where('is_active', true);

        if ($request->has('category_id') && $request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('search') && $request->search) {
            $term = '%' . $request->search . '%';
            $query->where(function ($q) use ($term) {
                $q->where('name', 'like', $term)
                  ->orWhere('name_ar', 'like', $term);
            });
        }

        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        $products = $query->latest()->paginate(12);
        $this->localizeProducts($products->getCollection(), $locale);

        return response()->json($products);
    }

    /**
     * Single product detail
     */
    public function product(Product $product, Request $request)
    {
        $locale = $this->getLocale($request);

        $product->load(['images', 'category', 'attributes']);
        $product->applyLocale($locale);
        if ($product->category) {
            $product->category->applyLocale($locale);
        }

        $related = Product::with(['images'])
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->where('is_active', true)
            ->take(4)
            ->get();
        $this->localizeProducts($related, $locale);

        return response()->json([
            'product' => $product,
            'related' => $related,
        ]);
    }

    /**
     * All categories
     */
    public function categories(Request $request)
    {
        $locale = $this->getLocale($request);
        $categories = Category::withCount('products')->get()
            ->each(fn ($c) => $c->applyLocale($locale));
        return response()->json($categories);
    }

    /**
     * Get a CMS page by slug
     */
    public function page($slug)
    {
        $page = Page::where('slug', $slug)->firstOrFail();
        return response()->json($page);
    }
}
