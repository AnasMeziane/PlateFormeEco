<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Page;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        User::firstOrCreate(
            ['email' => 'admin@ecommerce.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('password'),
            ]
        );

        // Create default CMS pages
        $pages = [
            [
                'slug' => 'about',
                'title' => 'À Propos',
                'content' => '<h2>Bienvenue dans notre boutique</h2><p>Nous sommes une boutique en ligne passionnée par la qualité et le service client. Notre mission est de vous offrir les meilleurs produits au meilleur prix.</p><p>Fondée en 2024, notre boutique s\'engage à satisfaire chaque client avec des produits soigneusement sélectionnés.</p>',
            ],
            [
                'slug' => 'contact',
                'title' => 'Contactez-nous',
                'content' => '<h2>Nos Coordonnées</h2><p><strong>Email:</strong> contact@ecommerce.com</p><p><strong>Téléphone:</strong> +212 6 00 00 00 00</p><p><strong>Adresse:</strong> Casablanca, Maroc</p><p><strong>Horaires:</strong> Lun-Ven 9h-18h</p>',
            ],
            [
                'slug' => 'faq',
                'title' => 'Questions Fréquentes',
                'content' => '<h2>FAQ</h2><h3>Comment commander ?</h3><p>Sélectionnez vos produits et cliquez sur le bouton WhatsApp pour passer votre commande.</p><h3>Quels sont les délais de livraison ?</h3><p>La livraison se fait sous 2 à 5 jours ouvrables.</p><h3>Comment puis-je suivre ma commande ?</h3><p>Vous recevrez des mises à jour via WhatsApp.</p>',
            ],
            [
                'slug' => 'terms',
                'title' => 'Mentions Légales & Conditions',
                'content' => '<h2>Conditions Générales de Vente</h2><p>En passant commande sur notre site, vous acceptez les présentes conditions générales de vente.</p><h3>Livraison</h3><p>Les produits sont livrés à l\'adresse indiquée lors de la commande.</p><h3>Retours</h3><p>Les retours sont acceptés dans un délai de 7 jours suivant la réception.</p>',
            ],
        ];

        foreach ($pages as $page) {
            Page::firstOrCreate(['slug' => $page['slug']], $page);
        }
    }
}
