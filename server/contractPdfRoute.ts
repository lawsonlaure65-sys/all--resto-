import express from 'express';

export function setupContractPdfRoute(app: express.Express) {
  app.get('/api/contract/pdf', (req, res) => {
    const contractContent = `================================================================================
CONTRAT DE PARTENARIAT COMMERCIAL & NOTE COMMERCIALE
ALLÔRESTO NIGER (NIAMEY) - SERVICE OFFICIEL BILLO EXPRESS
================================================================================

Entre :
La Société ALLÔRESTO NIGER, plateforme de commande et livraison de repas à Niamey
Et :
Le Restaurant Partenaire : ____________________________________________________
Représenté par M./Mme : _____________________________________________________
Téléphone / WhatsApp : ______________________________________________________
Quartier / Ville : ___________________________________________________________

--------------------------------------------------------------------------------
ARTICLE 1 : OBJET DU CONTRAT
--------------------------------------------------------------------------------
Le présent contrat définit les conditions dans lesquelles le Restaurant sera
référencé et pourra recevoir des commandes en direct via la plateforme Allôresto
avec acheminement par la flotte motorisée Billo Express.

--------------------------------------------------------------------------------
ARTICLE 2 : AVANTAGES POUR LE RESTAURANT
--------------------------------------------------------------------------------
1. Augmentation des ventes (30 à 50% en moyenne sans frais de salle additionnels)
2. Visibilité auprès de milliers de clients actifs (ministères, banques, ambassades)
3. Flotte de livraison Billo Express incluse (aucune moto ni coursier à votre charge)
4. Dashboard de gestion des commandes en temps réel avec signaux sonores
5. Marketing et publicité offerts (réseaux sociaux, push notifications)
6. Sécurité des paiements garantie (Mobile Money : Airtel, Moov, Flooz & espèces)

--------------------------------------------------------------------------------
ARTICLE 3 : FORMULES TARIFAIRES AU CHOIX
--------------------------------------------------------------------------------

[OPTION 1 : TARIF UNIQUE DE LANCEMENT]
- Abonnement mensuel : 75 000 FCFA / mois
- Commission sur les commandes : 0% (le restaurant garde 100% du prix des plats)
- Frais de livraison : 1 000 à 2 000 FCFA (payés par le client final)

[OPTION 2 : GRILLE À 3 NIVEAUX]
A. Standard (Starter) : 50 000 FCFA / mois + 15% de commission
   Idéal pour fast-foods, sandwicheries et petits maquis.

B. Premium (Populaire) : 75 000 FCFA / mois + 10% de commission
   ⭐ Choisi par 60% des partenaires : mise en avant accueil et bannières.

C. VIP / Traiteur : 150 000 FCFA / mois + 0% DE COMMISSION
   Rentabilité maximale pour gros volumes de vente et traiteurs.

--------------------------------------------------------------------------------
ARTICLE 4 : ENGAGEMENTS OPÉRATIONNELS DU RESTAURANT
--------------------------------------------------------------------------------
- Préparation des commandes sous 15 à 25 minutes dès réception.
- Respect rigoureux des règles d'hygiène alimentaire et chaîne du chaud/froid.
- Emballage soigné et étanche adapté au transport moto.
- Parité stricte des tarifs avec la carte sur place.

--------------------------------------------------------------------------------
ARTICLE 5 : DURÉE & RÉSILIATION
--------------------------------------------------------------------------------
Contrat initial de 6 mois renouvelable par tacite reconduction mensuelle.
Résiliable avec un préavis d'un (1) mois par notification écrite. En cas de
non-paiement de l'abonnement mensuel : suspension automatique de la visibilité
jusqu'à régularisation.

--------------------------------------------------------------------------------
SIGNATURES DES PARTIES
--------------------------------------------------------------------------------
Fait à Niamey, le ______________________ en deux exemplaires originaux.

Pour ALLÔRESTO NIGER :                   Pour le Restaurant Partenaire :
(Cachet & Signature)                    (Mention manuscrite "Lu et approuvé" + Signature)


________________________________        ________________________________
`;

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="contrat-alloresto-restaurant.txt"');
    res.send(contractContent);
  });
}
