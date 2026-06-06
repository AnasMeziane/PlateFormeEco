<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class WhatsAppOrder extends Model
{
    protected $table = 'whatsapp_orders';

    protected $fillable = ['customer_id', 'order_date', 'status', 'message_sent'];

    protected $casts = [
        'order_date' => 'datetime',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'whatsapp_order_product', 'whatsapp_order_id', 'product_id')
                     ->withPivot('quantity')
                     ->withTimestamps();
    }
}
