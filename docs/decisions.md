# Décisions métier par défaut

Points que le cahier des charges v1.0 (8 octobre 2026) ne tranche pas ou qui posent une contrainte technique. Chaque valeur est appliquée dans le code et modifiable ; les montants et délais se règlent dans la table `platform_settings` sans redéploiement.

| # | Sujet | Décision appliquée | Où |
|---|---|---|---|
| 1 | Périmètre | Rôles Hôte et Pro uniquement. Le parcours B2C (clients finaux, rendez-vous) est hors MVP. | Schéma |
| 2 | Plateformes | Web d'abord ; toute la logique métier est en base pour que l'application mobile réutilise le même back-end. | Architecture |
| 3 | Caution | Location de 4 jours ou moins : empreinte bancaire posée la veille du début, libérée 48 h après la fin. Au-delà : carte enregistrée, débitée seulement si un incident est validé (une empreinte expire au bout d'environ 7 jours). | `quote_booking`, `deposits` |
| 4 | Versement à l'hôte | 24 h après le début (CDC §6). Semaine et mois : un versement par tranche de 7 jours, chacun 24 h après le début de la tranche. | `schedule_booking_money` |
| 5 | Calcul du prix | Heure × nombre d'heures ; demi-journée = 4 h ; journées consécutives ; semaine = 7 jours ; mois calendaire. Le pro choisit la durée. | `quote_booking` |
| 6 | Majoration week-end | Pourcentage fixé par l'hôte, appliqué aux samedis et dimanches (heure, demi-journée, jour). Pas de majoration à la semaine ou au mois. | `quote_booking` |
| 7 | Frais en cas d'annulation | Annulation par l'hôte, l'admin ou expiration : tout est remboursé, frais compris. Annulation par le pro : remboursement d'une part du prix selon la règle choisie ; les frais de service du pro restent acquis. | `cancellation_refund_cents` |
| 8 | Annulation tardive par le pro | L'hôte perçoit la part non remboursée, nette de sa commission. | `cancel_booking` |
| 9 | Mode de réservation | « Sur demande » par défaut ; l'hôte peut passer chaque poste en réservation instantanée. | `stations.booking_mode` |
| 10 | Règle d'annulation par défaut | Modérée. | `stations.cancellation_policy` |
| 11 | KYC hôte | Publication impossible sans pièce d'identité, SIRET et assurance du local validés, ni compte Stripe Connect finalisé. | `station_integrity` |
| 12 | KYC pro | Réservation impossible sans identité, SIRET et RC pro valides. Tatouage : formation hygiène et déclaration ARS en plus. Un document expiré retire le badge « Vérifié ». | `is_verified`, `create_booking` |
| 13 | Publication d'un poste | Exige aussi au moins une photo et un créneau de disponibilité. | `station_integrity` |
| 14 | Caution maximale | 500 €. | `platform_settings.max_deposit_cents` |
| 15 | Rétention du créneau pendant le paiement | 15 minutes. | `platform_settings.payment_hold_minutes` |
| 16 | Litiges | Ouverture possible jusqu'à 48 h après la fin ; gèle les versements à venir. | `open_dispute` |
| 17 | Administration | L'accès admin exige la double authentification (TOTP). | `is_admin` |
| 18 | Contraste du corail | Le blanc sur #FF6B55 n'atteint que 2,8:1 (WCAG AA exige 4,5:1). Les boutons corail gardent leur fond mais portent un texte encre #252A31 (5,2:1) ; les liens corail utilisent la teinte #C2412F (5,1:1). Pour un texte blanc, il faudrait foncer le fond des boutons. | `globals.css` |
| 19 | Logo | Symbole redessiné en SVG d'après l'image fournie (`docs/brand`). À remplacer par le fichier vectoriel du designer. | `Logo.tsx` |
| 20 | Mot de passe | 10 caractères minimum, au moins une lettre et un chiffre ; e-mail confirmé obligatoire. | `validation/auth.ts` |

## À valider par un professionnel

- **Facturation (comptable)** : prix affichés TTC ; facture de location émise par Fauteo au nom de l'hôte (mandat de facturation dans les CGU), TVA à 20 % si l'hôte est assujetti, sinon mention « art. 293 B du CGI » ; frais Fauteo à 20 % de TVA.
- **Déclaration des revenus (DAC7)** : date de naissance, adresse et numéro fiscal de l'hôte sont prévus dans `host_profiles`.
- **Contrat de mise à disposition (juriste)** : modèle à fournir ; la signature électronique simple (horodatage, IP, empreinte du PDF) est prévue dans `contracts`.
