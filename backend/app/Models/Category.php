<?php

namespace App\Models;

use App\Traits\Translatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    use Translatable;

    protected $fillable = ['name', 'name_ar', 'description', 'description_ar', 'image'];

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}
