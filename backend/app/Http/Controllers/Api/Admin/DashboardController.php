<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\Customer;
use App\Models\WhatsAppOrder;

class DashboardController extends Controller
{
    /**
     * Dashboard statistics
     */
    public function stats()
    {
        return response()->json([
            'total_products' => Product::count(),
            'total_categories' => Category::count(),
            'total_customers' => Customer::count(),
            'total_orders' => WhatsAppOrder::count(),
            'pending_orders' => WhatsAppOrder::where('status', 'pending')->count(),
            'confirmed_orders' => WhatsAppOrder::where('status', 'confirmed')->count(),
            'recent_orders' => WhatsAppOrder::with(['customer', 'products'])
                ->latest('order_date')
                ->take(5)
                ->get(),
            'low_stock_products' => Product::where('stock_quantity', '<=', 5)
                ->where('is_active', true)
                ->take(5)
                ->get(),
        ]);
    }
}
