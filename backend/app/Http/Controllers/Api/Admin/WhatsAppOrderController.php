<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\WhatsAppOrder;
use Illuminate\Http\Request;

class WhatsAppOrderController extends Controller
{
    public function index(Request $request)
    {
        $query = WhatsAppOrder::with(['customer', 'products']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $orders = $query->latest('order_date')->paginate(15);

        return response()->json($orders);
    }

    public function show(WhatsAppOrder $whatsappOrder)
    {
        $whatsappOrder->load(['customer', 'products']);
        return response()->json($whatsappOrder);
    }

    public function updateStatus(Request $request, WhatsAppOrder $whatsappOrder)
    {
        $request->validate([
            'status' => 'required|in:pending,confirmed,cancelled,completed',
        ]);

        $whatsappOrder->update(['status' => $request->status]);

        return response()->json($whatsappOrder->load(['customer', 'products']));
    }

    public function destroy(WhatsAppOrder $whatsappOrder)
    {
        $whatsappOrder->delete();
        return response()->json(['message' => 'Commande supprimée.']);
    }
}
