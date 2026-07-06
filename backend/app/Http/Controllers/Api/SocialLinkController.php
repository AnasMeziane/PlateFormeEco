<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SocialLink;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SocialLinkController extends Controller
{
    /**
     * Public endpoint - returns all active social links
     */
    public function index()
    {
        $links = SocialLink::active()->ordered()->get();
        return response()->json($links);
    }

    /**
     * Admin endpoint - returns all social links
     */
    public function adminIndex()
    {
        $links = SocialLink::ordered()->get();
        return response()->json($links);
    }

    /**
     * Admin endpoint - update a social link
     */
    public function update(Request $request, SocialLink $socialLink)
    {
        $validated = $request->validate([
            'url' => ['nullable', 'url', 'max:500'],
            'is_active' => ['boolean'],
            'sort_order' => ['integer', 'min:0'],
        ]);

        $socialLink->update($validated);

        return response()->json([
            'message' => 'Lien social mis à jour avec succès.',
            'social_link' => $socialLink,
        ]);
    }

    /**
     * Admin endpoint - bulk update social links
     */
    public function bulkUpdate(Request $request)
    {
        $validated = $request->validate([
            'links' => ['required', 'array'],
            'links.*.id' => ['required', 'exists:social_links,id'],
            'links.*.url' => ['nullable', 'url', 'max:500'],
            'links.*.is_active' => ['boolean'],
            'links.*.sort_order' => ['integer', 'min:0'],
        ]);

        foreach ($validated['links'] as $linkData) {
            $link = SocialLink::find($linkData['id']);
            if ($link) {
                $link->update([
                    'url' => $linkData['url'] ?? $link->url,
                    'is_active' => $linkData['is_active'] ?? $link->is_active,
                    'sort_order' => $linkData['sort_order'] ?? $link->sort_order,
                ]);
            }
        }

        return response()->json([
            'message' => 'Liens sociaux mis à jour avec succès.',
            'social_links' => SocialLink::ordered()->get(),
        ]);
    }

    /**
     * Admin endpoint - create a new social link
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'platform' => ['required', 'string', Rule::in(SocialLink::$platforms), 'unique:social_links,platform'],
            'url' => ['nullable', 'url', 'max:500'],
            'is_active' => ['boolean'],
            'sort_order' => ['integer', 'min:0'],
        ]);

        $socialLink = SocialLink::create($validated);

        return response()->json([
            'message' => 'Lien social créé avec succès.',
            'social_link' => $socialLink,
        ], 201);
    }

    /**
     * Admin endpoint - delete a social link
     */
    public function destroy(SocialLink $socialLink)
    {
        $socialLink->delete();

        return response()->json([
            'message' => 'Lien social supprimé avec succès.',
        ]);
    }
}
