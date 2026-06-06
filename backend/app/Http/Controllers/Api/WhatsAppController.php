<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\WhatsAppOrder;
use Illuminate\Http\Request;

class WhatsAppController extends Controller
{
    /**
     * Submit a WhatsApp order from the client side
     */
    public function submitOrder(Request $request)
    {
        $request->validate([
            'full_name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
            'city' => 'required|string|max:255',
            'address' => 'nullable|string',
            'product_ids' => 'required|array|min:1',
            'product_ids.*' => 'exists:products,id',
            'message' => 'nullable|string',
        ]);

        // Find or create the customer
        $customer = Customer::firstOrCreate(
            ['phone_number' => $request->phone_number],
            [
                'full_name' => $request->full_name,
                'city' => $request->city,
                'address' => $request->address,
            ]
        );

        // Update customer info if already exists
        $customer->update([
            'full_name' => $request->full_name,
            'city' => $request->city,
            'address' => $request->address,
        ]);

        // Create the order
        $order = WhatsAppOrder::create([
            'customer_id' => $customer->id,
            'order_date' => now(),
            'status' => 'pending',
            'message_sent' => $request->message,
        ]);

        // Attach products
        foreach ($request->product_ids as $productId) {
            $order->products()->attach($productId, ['quantity' => 1]);
        }

        return response()->json([
            'message' => 'Commande enregistrée avec succès.',
            'order' => $order->load(['customer', 'products']),
        ], 201);
    }
}
