<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SiteSettingController extends Controller
{
    private const FILE = 'site_settings.json';

    private function defaults(): array
    {
        return [
            'whatsapp_number' => '212671869919',
            'contact_email'   => 'Tijara.shop00@gmail.com',
        ];
    }

    private function load(): array
    {
        if (Storage::disk('local')->exists(self::FILE)) {
            $data = json_decode(Storage::disk('local')->get(self::FILE), true);
            if (is_array($data)) {
                return array_merge($this->defaults(), $data);
            }
        }
        return $this->defaults();
    }

    /**
     * Public endpoint - returns site settings for client display.
     */
    public function index()
    {
        return response()->json($this->load());
    }

    /**
     * Admin endpoint - update site settings.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'whatsapp_number' => ['required', 'string', 'max:20', 'regex:/^[0-9+]+$/'],
            'contact_email'   => ['required', 'email', 'max:255'],
        ]);

        // Normalize whatsapp number: strip leading + and any non-digits
        $validated['whatsapp_number'] = preg_replace('/\D/', '', $validated['whatsapp_number']);

        $merged = array_merge($this->load(), $validated);
        Storage::disk('local')->put(self::FILE, json_encode($merged, JSON_PRETTY_PRINT));

        return response()->json($merged);
    }
}
