<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'images', 'attributes']);

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $products = $query->latest()->paginate(15);

        return response()->json($products);
    }

    public function store(Request $request)
    {
        $rawAttrs = $request->input('attributes');
        if (is_string($rawAttrs)) {
            $request->merge(['attributes' => json_decode($rawAttrs, true) ?? []]);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'name_ar' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'category_id' => 'required|exists:categories,id',
            'is_active' => 'boolean',
            'images' => 'nullable|array',
            'images.*' => 'mimes:jpg,jpeg,png,gif,webp,bmp|max:5120',
            'attributes' => 'nullable|array',
            'attributes.*.attribute_name' => 'required|string',
            'attributes.*.attribute_value' => 'required|string',
        ]);

        return DB::transaction(function () use ($request) {
            $product = Product::create($request->only([
                'name', 'name_ar', 'description', 'description_ar', 'price', 'stock_quantity', 'category_id', 'is_active'
            ]));

            // Handle images
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $index => $image) {
                    $path = $image->store('products', 'public');
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_url' => $path,
                        'is_main' => $index === 0,
                    ]);
                }
            }

            // Handle attributes
            $attrs = $request->input('attributes', []);
            if (is_array($attrs)) {
                foreach ($attrs as $attr) {
                    $product->attributes()->create([
                        'attribute_name' => $attr['attribute_name'],
                        'attribute_value' => $attr['attribute_value'],
                    ]);
                }
            }

            return response()->json($product->load(['images', 'attributes', 'category']), 201);
        });
    }

    public function show(Product $product)
    {
        $product->load(['images', 'attributes', 'category']);
        return response()->json($product);
    }

    public function update(Request $request, Product $product)
    {
        $rawAttrs = $request->input('attributes');
        if (is_string($rawAttrs)) {
            $request->merge(['attributes' => json_decode($rawAttrs, true) ?? []]);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'name_ar' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'category_id' => 'required|exists:categories,id',
            'is_active' => 'boolean',
            'images' => 'nullable|array',
            'images.*' => 'mimes:jpg,jpeg,png,gif,webp,bmp|max:5120',
            'attributes' => 'nullable|array',
        ]);

        return DB::transaction(function () use ($request, $product) {
            $product->update($request->only([
                'name', 'name_ar', 'description', 'description_ar', 'price', 'stock_quantity', 'category_id', 'is_active'
            ]));

            // Handle new images
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('products', 'public');
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_url' => $path,
                        'is_main' => $product->images()->count() === 0,
                    ]);
                }
            }

            // Handle attributes
            $attrs = $request->input('attributes', []);
            if (is_array($attrs)) {
                $product->attributes()->delete();
                foreach ($attrs as $attr) {
                    $product->attributes()->create([
                        'attribute_name' => $attr['attribute_name'],
                        'attribute_value' => $attr['attribute_value'],
                    ]);
                }
            }

            return response()->json($product->load(['images', 'attributes', 'category']));
        });
    }

    public function destroy(Product $product)
    {
        // Delete associated images from storage
        foreach ($product->images as $image) {
            Storage::disk('public')->delete($image->image_url);
        }
        $product->delete();

        return response()->json(['message' => 'Produit supprimé.']);
    }

    /**
     * Delete a specific product image
     */
    public function deleteImage(ProductImage $image)
    {
        Storage::disk('public')->delete($image->image_url);
        $image->delete();

        return response()->json(['message' => 'Image supprimée.']);
    }

    /**
     * Set main image for a product
     */
    public function setMainImage(Product $product, ProductImage $image)
    {
        $product->images()->update(['is_main' => false]);
        $image->update(['is_main' => true]);

        return response()->json(['message' => 'Image principale définie.']);
    }
}
