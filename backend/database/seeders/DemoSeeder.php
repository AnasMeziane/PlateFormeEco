<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Vêtements',      'description' => 'Mode et habillement pour homme et femme'],
            ['name' => 'Chaussures',     'description' => 'Sneakers, mocassins, bottes et sandales'],
            ['name' => 'Électronique',   'description' => 'Smartphones, accessoires et gadgets tech'],
            ['name' => 'Maison & Déco',  'description' => 'Décoration, mobilier et accessoires maison'],
            ['name' => 'Beauté & Soin',  'description' => 'Cosmétiques, parfums et soins du corps'],
            ['name' => 'Sport & Loisirs','description' => 'Équipements sportifs et articles de loisirs'],
        ];

        foreach ($categories as $cat) {
            Category::firstOrCreate(['name' => $cat['name']], $cat);
        }

        $products = [
            // Vêtements
            ['name' => 'T-Shirt Premium Blanc', 'category' => 'Vêtements', 'price' => 149, 'stock' => 50,
             'description' => 'T-shirt en coton pima 100% biologique, coupe ajustée, col rond renforcé. Confort et style au quotidien.'],
            ['name' => 'Veste en Jean Slim', 'category' => 'Vêtements', 'price' => 399, 'stock' => 25,
             'description' => 'Veste en denim de haute qualité, coupe slim moderne, finitions soignées. Parfaite pour toutes occasions.'],
            ['name' => 'Hoodie Essential Noir', 'category' => 'Vêtements', 'price' => 299, 'stock' => 35,
             'description' => 'Sweat à capuche en coton molletonné premium. Doux, chaud et stylé pour l\'automne et l\'hiver.'],
            ['name' => 'Pantalon Chino Beige', 'category' => 'Vêtements', 'price' => 249, 'stock' => 20,
             'description' => 'Pantalon chino élégant en coton stretch, coupe droite moderne. Idéal pour le casual ou le bureau.'],

            // Chaussures
            ['name' => 'Sneakers Urban Blanc', 'category' => 'Chaussures', 'price' => 549, 'stock' => 30,
             'description' => 'Baskets lifestyle en cuir synthétique premium, semelle EVA ultra-confortable. Le choix lifestyle par excellence.'],
            ['name' => 'Mocassins Cuir Marron', 'category' => 'Chaussures', 'price' => 699, 'stock' => 15,
             'description' => 'Mocassins en cuir véritable artisanal, doublure en cuir, semelle souple. Élégance italienne au quotidien.'],
            ['name' => 'Boots Chelsea Noir', 'category' => 'Chaussures', 'price' => 799, 'stock' => 18,
             'description' => 'Bottines Chelsea en cuir pleine fleur avec élastiques latéraux. Style britannique intemporel et robuste.'],

            // Électronique
            ['name' => 'Écouteurs Bluetooth Pro', 'category' => 'Électronique', 'price' => 499, 'stock' => 40,
             'description' => 'Écouteurs True Wireless avec réduction de bruit active, 30h d\'autonomie, son haute définition. Compatible iOS et Android.'],
            ['name' => 'Chargeur Rapide USB-C 65W', 'category' => 'Électronique', 'price' => 189, 'stock' => 60,
             'description' => 'Chargeur GaN compact 65W, charge 3 appareils simultanément. Compatible MacBook, iPad, Samsung, Xiaomi.'],
            ['name' => 'Montre Connectée Sport', 'category' => 'Électronique', 'price' => 899, 'stock' => 22,
             'description' => 'Smartwatch avec GPS intégré, capteur cardiaque, 15 modes sport, étanche 50m, autonomie 7 jours.'],
            ['name' => 'Support Téléphone Voiture', 'category' => 'Électronique', 'price' => 99, 'stock' => 80,
             'description' => 'Support magnétique universel pour tableau de bord. Compatible tous smartphones de 4 à 7 pouces.'],

            // Maison & Déco
            ['name' => 'Coussin Velours Royal Bleu', 'category' => 'Maison & Déco', 'price' => 129, 'stock' => 45,
             'description' => 'Coussin décoratif en velours de qualité, rembourrage microfibre. Apporte une touche royale à votre salon.'],
            ['name' => 'Lampe de Bureau LED', 'category' => 'Maison & Déco', 'price' => 259, 'stock' => 28,
             'description' => 'Lampe LED ajustable avec 3 températures de couleur, intensité variable, port USB de recharge intégré.'],
            ['name' => 'Vase Céramique Moderne', 'category' => 'Maison & Déco', 'price' => 179, 'stock' => 33,
             'description' => 'Vase artisanal en céramique peinte à la main, design épuré. Parfait pour fleurs séchées ou naturelles.'],

            // Beauté & Soin
            ['name' => 'Parfum Oud Marocain', 'category' => 'Beauté & Soin', 'price' => 349, 'stock' => 20,
             'description' => 'Eau de parfum aux notes de bois de oud, rose et ambre. Fragrance orientale intense et envoûtante. 50ml.'],
            ['name' => 'Crème Hydratante Argan', 'category' => 'Beauté & Soin', 'price' => 149, 'stock' => 55,
             'description' => 'Crème de nuit à l\'huile d\'argan 100% naturelle du Maroc. Hydrate en profondeur et régénère la peau.'],

            // Sport & Loisirs
            ['name' => 'Sac de Sport Premium', 'category' => 'Sport & Loisirs', 'price' => 299, 'stock' => 38,
             'description' => 'Sac de sport 40L en polyester résistant, compartiment chaussures séparé, bretelles ergonomiques rembourrées.'],
            ['name' => 'Gants de Fitness', 'category' => 'Sport & Loisirs', 'price' => 119, 'stock' => 50,
             'description' => 'Gants de musculation en néoprène, rembourrage gel, poignet ajustable. Idéal pour la salle de sport.'],
        ];

        foreach ($products as $p) {
            $cat = Category::where('name', $p['category'])->first();
            if ($cat) {
                Product::firstOrCreate(
                    ['name' => $p['name']],
                    [
                        'category_id'    => $cat->id,
                        'description'    => $p['description'],
                        'price'          => $p['price'],
                        'stock_quantity' => $p['stock'],
                        'is_active'      => true,
                    ]
                );
            }
        }
    }
}
