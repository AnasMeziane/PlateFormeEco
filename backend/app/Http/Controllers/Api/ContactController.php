<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    /**
     * Handle contact form submission
     */
    public function send(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        // For now, just return success. Can be extended with Mail later.
        return response()->json([
            'message' => 'Votre message a été envoyé avec succès. Nous vous répondrons bientôt.',
        ]);
    }
}
