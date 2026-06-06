<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;

class CustomerController extends Controller
{
    public function index()
    {
        $customers = Customer::withCount('whatsappOrders')->latest()->paginate(15);
        return response()->json($customers);
    }

    public function show(Customer $customer)
    {
        $customer->load('whatsappOrders.products');
        return response()->json($customer);
    }

    public function destroy(Customer $customer)
    {
        $customer->delete();
        return response()->json(['message' => 'Client supprimé.']);
    }
}
