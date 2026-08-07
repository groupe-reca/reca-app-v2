# 08-Contracts-and-Measurement.md

# RECA
## Contrats et outil de mesure

Version : 1.0  
Projet : RECA App V2  
Dépôt recommandé : `reca-app-v2`  
Statut : Spécification métier, fonctionnelle et opérationnelle officielle  

---

# 1. Objectif du document

Ce document définit le fonctionnement officiel du module Contrats et de l’outil de mesure des surfaces de déneigement dans RECA App V2.

Il décrit :

- le rôle du Contrat;
- ses relations;
- ses statuts;
- ses données;
- son processus de création;
- son processus de modification;
- ses clauses;
- ses modalités de paiement;
- ses documents;
- ses versions;
- son historique;
- l’outil de localisation;
- l’outil de tracé;
- les zones de déneigement;
- la géométrie unifiée;
- la zone GPS opérationnelle;
- la validation géographique;
- la migration des données existantes;
- l’intégration avec Routes, Missions et RECA Opérateur;
- les règles Desktop, Tablette et Mobile;
- les permissions;
- les transactions;
- les tests;
- les critères de réussite.

Ce document complète notamment :

```text
00-Vision.md
01-Design-System.md
02-Information-Architecture.md
03-Application-Architecture.md
04-Data-Architecture.md
05-Authentication-Roles-Permissions.md
06-Operations-Center-Dashboard.md
07-Leads-Quotes-Clients.md
```

---

# 2. Vision du module Contrats

Le Contrat est le point de jonction entre :

```text
La vente
La propriété
Le service
La surface
Les obligations
La facturation
Les Routes
Les Missions
RECA Opérateur
```

Le Contrat ne doit pas être conçu comme un simple formulaire administratif.

Il représente :

- l’engagement avec le Client;
- la propriété à desservir;
- les services convenus;
- les modalités;
- la tarification;
- les clauses;
- les zones à déneiger;
- les informations utiles au terrain;
- la source opérationnelle utilisée pour préparer les Routes et Missions.

---

# 3. Principe fondamental

Le Contrat est une entité permanente.

La Mission est une exécution réelle.

```text
Contrat permanent
      ↓
Route permanente
      ↓
Mission réelle
      ↓
MissionItem figé
```

Une modification future du Contrat ne doit jamais réécrire silencieusement une Mission passée.

---

# 4. Distinction Soumission et Contrat

Une Soumission représente une proposition commerciale.

Un Contrat représente un engagement officiel.

```text
Soumission
- prix proposé
- validité
- acceptation en attente

Contrat
- Client officiel
- propriété
- saison
- clauses
- services
- surface
- modalités
- échéancier
- données terrain
```

La création d’un Contrat ne doit pas être utilisée comme remplacement du module Soumissions.

---

# 5. Responsabilités du module Contrats

Le module doit permettre de :

- créer un Contrat;
- sélectionner ou créer un Client;
- confirmer l’adresse de service;
- localiser la propriété;
- tracer une ou plusieurs zones;
- calculer la superficie;
- définir les services;
- définir les obligations;
- définir la tarification;
- définir l’échéancier;
- générer les clauses;
- générer les Factures lorsque prévu;
- générer un document;
- suivre la signature;
- activer le Contrat;
- suspendre ou annuler;
- modifier les informations;
- versionner les changements importants;
- consulter l’historique;
- préparer le Contrat pour une Route;
- fournir les données nécessaires aux Missions.

---

# 6. Routes recommandées

```text
/contracts
/contracts/new
/contracts/:contractId
/contracts/:contractId/edit
/contracts/:contractId/measurement
/contracts/settings
```

L’éditeur de mesure peut être :

- une étape plein écran du Wizard;
- une route imbriquée;
- un flow plein écran.

La direction recommandée est un flow plein écran contrôlé par le routeur.

---

# 7. Création sur page dédiée

La création d’un Contrat utilise une page dédiée.

Elle ne doit pas utiliser une modale depuis la liste.

Route :

```text
/contracts/new
```

Contexte possible :

```text
/contracts/new?clientId=:clientId
```

```text
/contracts/new?quoteId=:quoteId
```

---

# 8. Chargement du contexte

Lorsqu’un `clientId` ou `quoteId` est fourni :

1. charger l’entité;
2. valider son existence;
3. valider les permissions;
4. préremplir les données;
5. rendre le Wizard utilisable.

La création ne doit pas continuer avec un contexte partiellement chargé.

---

# 9. Wizard officiel

Structure recommandée :

```text
1. Client et propriété
2. Analyse et zones
3. Services et obligations
4. Modalités de paiement
5. Validation
```

Une version plus compacte peut fusionner certaines étapes.

Le nombre final d’étapes doit être validé dans les maquettes.

---

# 10. Étape 1 — Client et propriété

Cette étape doit permettre de :

- rechercher un Client;
- sélectionner un Client;
- créer rapidement un Client dans le contexte;
- choisir l’adresse de service;
- confirmer le type;
- confirmer la langue;
- confirmer le statut du Client;
- afficher une carte ou un aperçu;
- détecter une adresse non localisée.

---

# 11. ClientSearchPicker

Le sélecteur doit afficher :

- numéro;
- nom ou entreprise;
- type;
- téléphone;
- adresse;
- statut.

Il doit permettre :

- recherche;
- sélection;
- création rapide;
- reprise du Wizard sans perte de saisie.

---

# 12. Adresse de service

Le Contrat doit conserver une adresse de service stable.

Il peut référencer une adresse Client.

Il doit aussi pouvoir conserver un snapshot lorsque nécessaire.

Données recommandées :

```text
street
city
province
postal_code
country
latitude
longitude
formatted_address
geocoding_source
```

---

# 13. Géocodage

Le géocodage doit être best-effort.

Flux :

```text
Adresse
  ↓
Géocodage
  ↓
Coordonnées obtenues
```

En cas d’échec :

- ne pas perdre les données;
- ne pas supprimer le Client;
- ne pas inventer une position;
- signaler que la propriété doit être localisée;
- bloquer seulement les fonctions qui exigent réellement les coordonnées.

---

# 14. Adresse non localisée

État recommandé :

```text
Adresse non localisée

La propriété est enregistrée, mais sa position doit être confirmée avant l’utilisation de l’outil de mesure.

[Situer la propriété]
```

---

# 15. Étape 2 — Analyse et zones

Cette étape représente l’éditeur de surface.

Elle doit permettre :

- localiser;
- cadrer;
- tracer;
- modifier;
- mesurer;
- valider;
- sauvegarder.

Elle ne doit pas dépendre d’un cadre fixe.

---

# 16. Décision officielle sur l’outil de mesure

L’outil de mesure doit être conservé.

Il ne doit pas être supprimé.

La surface est une donnée importante pour :

- la compréhension de la propriété;
- le calcul de superficie;
- la tarification;
- les statistiques;
- la préparation des Routes;
- la création des MissionItems;
- la stabilité de RECA Opérateur;
- les transitions GPS;
- les futures fonctions d’optimisation.

---

# 17. Problème historique du cadre

Le problème principal de l’ancien outil vient du cadrage.

Le cadre rouge pouvait :

- couper un stationnement;
- donner l’impression que le dessin était limité;
- empêcher de représenter une entrée longue;
- cacher une zone secondaire;
- produire une capture incomplète;
- réduire la fiabilité opérationnelle.

La nouvelle application doit découpler :

```text
Vue de capture
Zone de déneigement
Zone GPS
```

---

# 18. Trois concepts distincts

## 18.1 Vue de capture

Aide visuelle affichée à l’utilisateur.

Elle peut être :

- déplacée;
- zoomée;
- redimensionnée;
- recentrée;
- modifiée;
- capturée.

Elle ne représente pas la donnée métier principale.

## 18.2 Zone de déneigement

Géométrie exacte du travail prévu.

Elle représente :

- entrée;
- stationnement;
- passage;
- zone devant garage;
- plusieurs surfaces;
- formes irrégulières.

## 18.3 Zone GPS opérationnelle

Géométrie dérivée destinée à la détection terrain.

Elle peut être :

- simplifiée;
- élargie;
- bufferisée;
- adaptée à la précision GPS;
- recalculée;
- versionnée.

---

# 19. Workflow de mesure officiel

```text
Localiser
  ↓
Ajuster la vue
  ↓
Tracer les zones
  ↓
Modifier les zones
  ↓
Valider
  ↓
Calculer la superficie
  ↓
Dériver la géométrie unifiée
  ↓
Préparer la zone GPS
  ↓
Sauvegarder
```

---

# 20. Étape Localiser

L’utilisateur doit pouvoir :

- voir la propriété;
- zoomer;
- dézoomer;
- déplacer la carte;
- recentrer;
- corriger la position;
- changer le style;
- confirmer l’adresse.

---

# 21. Styles cartographiques

Minimum recommandé :

```text
Satellite
Plan
```

La bascule est utile lorsque :

- des arbres cachent la surface;
- l’imagerie est ancienne;
- le contraste est faible;
- les limites de rue sont plus claires sur le plan.

---

# 22. Ajustement de la vue

Le cadrage initial doit inclure une marge.

Valeur initiale recommandée :

```text
30 %
```

Plage configurable :

```text
20 % à 40 %
```

Cette marge concerne l’affichage.

Elle ne limite jamais le dessin.

---

# 23. Dessin libre

L’utilisateur doit pouvoir :

- tracer hors du cadrage initial;
- déplacer la carte pendant le travail;
- agrandir la zone;
- ajouter un polygone;
- déplacer un sommet;
- supprimer un sommet;
- supprimer une zone;
- recommencer;
- annuler la dernière action.

---

# 24. Plusieurs surfaces

Le système doit supporter plusieurs zones.

Exemples :

```text
Entrée principale
Stationnement secondaire
Passage latéral
Zone devant garage
```

Dans la couche d’édition :

```text
N lignes contract_zones
```

Dans la représentation unifiée :

```text
MultiPolygon
```

---

# 25. ContractZone

Structure conceptuelle :

```ts
type ContractZone = {
  id: ContractZoneId
  contractId: ContractId
  label: string
  type: ContractZoneType
  geometry: GeoJSON.Polygon
  areaSquareMeters: number
  order: number
  source: GeometrySource
  partiallyHidden: boolean
  version: number
  createdAt: string
  updatedAt: string
  deletedAt?: string
}
```

---

# 26. Types de zones

Types initiaux possibles :

```text
DRIVEWAY
PARKING
GARAGE_FRONT
SIDE_PASSAGE
WALKWAY
MANEUVERING_AREA
OTHER
```

La liste finale doit être confirmée selon le besoin réel.

---

# 27. Nom de zone

Chaque zone peut avoir :

- type;
- libellé automatique;
- libellé personnalisé.

Exemple :

```text
Stationnement principal
```

---

# 28. Couleurs des zones

Les couleurs servent à distinguer les zones.

Elles ne doivent pas représenter un statut critique.

Chaque type peut posséder :

- couleur de remplissage;
- contour;
- opacité;
- état sélectionné.

---

# 29. Surface cachée

Chaque zone peut posséder :

```text
partially_hidden = true
```

Utilité :

- arbres;
- neige;
- image floue;
- ombre;
- bâtiment;
- donnée estimée manuellement.

---

# 30. Surface partiellement cachée

Texte recommandé :

```text
Une partie de cette surface est cachée sur l’imagerie.
Le tracé a été ajusté manuellement.
```

Ce statut n’invalide pas automatiquement la zone.

---

# 31. Photo terrain

Une photo terrain peut être ajoutée dans une phase future.

Elle ne doit pas bloquer la V1.

La structure Document doit permettre de lier une photo à :

- Contrat;
- Zone;
- MissionItem;
- Problème.

---

# 32. Exclusions

Exemples :

- îlot;
- plate-bande;
- zone non déneigée;
- bâtiment;
- obstacle permanent.

La structure doit permettre des trous ou exclusions plus tard.

La première version ne doit pas nécessairement fournir une interface d’exclusion.

---

# 33. Édition non destructive

Une modification doit :

- conserver l’ancienne version utile;
- incrémenter la version;
- enregistrer l’auteur;
- enregistrer la date;
- produire un événement;
- ne pas modifier une Mission passée.

---

# 34. Annulation

L’utilisateur doit pouvoir quitter l’éditeur sans sauvegarder.

Le système doit avertir seulement si des modifications non enregistrées existent.

---

# 35. Reprise de brouillon

Le Wizard doit permettre de reprendre :

- Client sélectionné;
- adresse;
- zones;
- étapes;
- modalités;
- notes.

La stratégie de brouillon doit être définie avant l’implémentation finale.

---

# 36. Capture d’image

Une capture peut être conservée pour :

- document;
- aperçu;
- audit;
- référence visuelle.

Elle ne remplace pas la géométrie.

---

# 37. Cadrage de capture

Avant la capture :

1. calculer la bounding box de toutes les zones;
2. ajouter une marge;
3. recadrer temporairement;
4. capturer;
5. restaurer la vue.

La capture doit inclure toutes les zones.

---

# 38. Capture sans zone

Si aucune zone existe :

- utiliser un cadrage raisonnable autour du point;
- ne pas produire une image trompeuse;
- indiquer que la surface n’est pas définie.

---

# 39. Géométrie unifiée

Le Contrat peut posséder :

```text
snow_geometry
```

Type recommandé :

```text
GeoJSON MultiPolygon
```

Cette géométrie représente l’union logique des zones actives.

---

# 40. SnowRemovalGeometry

Structure conceptuelle :

```ts
type SnowRemovalGeometry = {
  geometryType: 'POLYGON' | 'MULTIPOLYGON'
  coordinates: unknown
  areaSquareMeters: number
  source: 'MANUAL' | 'MIGRATED' | 'IMPORTED'
  version: number
  updatedAt: string
}
```

---

# 41. Source de géométrie

Valeurs :

```text
MANUAL
MIGRATED
IMPORTED
```

## MANUAL

Tracée ou corrigée par un utilisateur.

## MIGRATED

Créée depuis les anciennes données.

## IMPORTED

Importée d’une source externe.

---

# 42. GeometryStatus

Valeurs officielles recommandées :

```text
VALID
NEEDS_REVIEW
MISSING
MIGRATED
INVALID
```

---

# 43. Signification GeometryStatus

## VALID

- géométrie enregistrée;
- validations principales réussies;
- utilisable.

## NEEDS_REVIEW

- géométrie existante;
- avertissement;
- migration;
- doute;
- validation humaine requise.

## MISSING

- aucune zone.

## MIGRATED

- valeur héritée convertie;
- peut être combinée avec un état de révision selon le modèle final.

## INVALID

- structure ou validation bloquante échouée.

---

# 44. Recommandation de statut migré

Direction recommandée :

```text
geometry_source = MIGRATED
geometry_status = NEEDS_REVIEW
```

Cette combinaison est plus claire qu’un statut unique `MIGRATED`.

---

# 45. Versionnement

Le Contrat doit posséder :

```text
geometry_version
```

Règle :

```text
Incrémenter à chaque sauvegarde modifiant réellement la géométrie.
```

---

# 46. Comparaison de géométrie

Le système doit éviter d’incrémenter la version lorsque :

- seul un texte change;
- la carte est déplacée sans modifier les zones;
- la capture est régénérée à l’identique;
- l’utilisateur ouvre et referme sans modification.

---

# 47. GeometryHistory

Structure future possible :

```ts
type GeometryHistoryEntry = {
  id: string
  contractId: ContractId
  version: number
  snowGeometry: GeoJSON.MultiPolygon
  gpsGeometry?: GeoJSON.Polygon | GeoJSON.MultiPolygon
  areaSquareMeters: number
  source: GeometrySource
  status: GeometryStatus
  changedBy: UserId
  changedAt: string
  reason?: string
}
```

---

# 48. Zone GPS

Le Contrat peut posséder :

```text
gps_geometry
```

Elle est distincte de `snow_geometry`.

---

# 49. Dérivation GPS

Processus conceptuel :

```text
snow_geometry
  ↓
Nettoyage
  ↓
Simplification
  ↓
Buffer
  ↓
Validation
  ↓
gps_geometry
```

---

# 50. Paramètres GPS

Paramètres possibles :

```text
simplificationTolerance
bufferMeters
minimumArea
maximumDistanceFromAddress
algorithmVersion
```

Ils doivent être :

- centralisés;
- versionnés;
- testables;
- compatibles avec RECA Opérateur.

---

# 51. Seam avec RECA Opérateur

Dans la première reconstruction, la base doit préparer :

```text
contracts.gps_geometry
contracts.geometry_version
```

La dérivation finale doit être validée avec RECA Opérateur.

Ne pas figer un algorithme sans test réel sur le terrain.

---

# 52. MissionItem

Lors de la création d’une Mission :

```text
Contrat
  ↓
Copie de snow_geometry
  ↓
Copie de gps_geometry
  ↓
Copie de geometry_version
  ↓
MissionItem
```

---

# 53. Snapshot opérationnel

Le MissionItem doit conserver :

- géométrie exacte utilisée;
- géométrie GPS utilisée;
- version;
- surface;
- adresse;
- instructions.

Une modification ultérieure du Contrat ne change pas cette copie.

---

# 54. Contrat sans géométrie

Un Contrat peut être créé sans zone seulement si la règle métier le permet.

Le système doit alors afficher :

```text
Surface manquante
```

et produire :

```text
ContractReadiness.isReadyForRoute = false
```

ou un avertissement selon la décision finale.

---

# 55. Contrat actif sans zone

Direction recommandée :

- activation commerciale possible;
- ajout à une Route possible avec avertissement ou blocage;
- création d’une Mission bloquée si la géométrie est requise par RECA Opérateur.

La règle finale doit être confirmée.

---

# 56. Validation géographique

Le système doit valider :

- format GeoJSON;
- type;
- coordonnées;
- polygone fermé;
- minimum de points;
- surface non nulle;
- absence d’auto-intersection lorsque possible;
- proximité de l’adresse;
- superficie plausible;
- union valide;
- compatibilité MultiPolygon.

---

# 57. Erreurs bloquantes

Exemples :

```text
Le polygone n’est pas fermé.
La zone contient moins de trois sommets.
La géométrie est invalide.
La surface est nulle.
Les coordonnées sont hors limites.
```

---

# 58. Avertissements

Exemples :

```text
La zone semble éloignée de l’adresse.
La superficie semble exceptionnellement grande.
Une partie de la surface est cachée.
La géométrie provient d’une migration.
```

Un avertissement ne bloque pas nécessairement la sauvegarde.

---

# 59. Avertissement de distance

Exemple :

```text
La zone semble très éloignée de l’adresse.
Vérifiez le positionnement avant de sauvegarder.
```

---

# 60. Surface plausible

Les seuils doivent être configurables.

Le système ne doit pas rejeter automatiquement une propriété commerciale simplement parce qu’elle dépasse une moyenne résidentielle.

Utiliser :

- avertissement;
- type de Client;
- type de service;
- contexte.

---

# 61. Calcul de superficie

La superficie officielle doit être calculée à partir de la géométrie.

Unité de stockage :

```text
mètres carrés
```

Affichage possible :

```text
m²
pi²
```

---

# 62. Conversion d’unité

La conversion vers pieds carrés est une présentation.

La source autoritative demeure :

```text
area_square_meters
```

---

# 63. Superficie totale

```text
superficie totale = somme ou union géodésique des zones actives
```

Le calcul doit éviter le double comptage lorsque des zones se chevauchent.

Direction recommandée :

```text
Union MultiPolygon
  ↓
Calcul de surface
```

---

# 64. Turf.js

La couche applicative peut utiliser Turf.js pour :

- area;
- union;
- simplify;
- buffer;
- bbox;
- kinks;
- center;
- distance.

Les fonctions doivent être isolées dans des utilitaires purs.

---

# 65. PostGIS

PostGIS peut être évalué pour :

- validation;
- union;
- index spatial;
- requêtes de proximité;
- migration;
- projections.

La première version peut conserver du GeoJSON JSONB si cela respecte l’existant.

La décision doit être prise après analyse de la base réelle.

---

# 66. Étape Validation de la surface

Avant sauvegarde, afficher :

- adresse;
- aperçu;
- zones;
- superficie totale;
- nombre de zones;
- statut;
- avertissements;
- zone GPS;
- version;
- bouton de correction.

---

# 67. Aperçu final

L’aperçu doit distinguer visuellement :

```text
Zone exacte
Zone GPS
```

Exemple :

- zone exacte : remplissage principal;
- zone GPS : contour pointillé.

---

# 68. Sauvegarde

La sauvegarde doit être transactionnelle autant que possible.

Elle doit :

1. valider les zones;
2. enregistrer `contract_zones`;
3. dériver `snow_geometry`;
4. calculer la superficie;
5. mettre à jour `geometry_version`;
6. mettre à jour `geometry_source`;
7. mettre à jour `geometry_status`;
8. enregistrer la capture;
9. créer un événement;
10. retourner le Contrat mis à jour.

---

# 69. Échec de sauvegarde

Si la sauvegarde échoue :

- conserver l’état du formulaire;
- afficher une erreur;
- ne pas perdre les zones;
- permettre de réessayer;
- ne pas incrémenter la version partiellement.

---

# 70. Écriture atomique

Éviter :

```text
Sauvegarder Contrat
Puis zones
Puis capture
Puis version
```

dans des mutations navigateur non coordonnées.

Privilégier :

- RPC;
- transaction PostgreSQL;
- orchestration serveur contrôlée.

Le fichier de capture peut nécessiter une stratégie compensatoire.

---

# 71. Capture et transaction

La capture Storage ne peut pas toujours participer à la transaction SQL.

Stratégie possible :

1. téléverser un fichier temporaire;
2. exécuter la transaction DB;
3. promouvoir ou référencer le fichier;
4. nettoyer en cas d’échec.

---

# 72. Étape 3 — Services et obligations

Cette étape définit :

- services inclus;
- seuil d’intervention;
- délais;
- dépôt de neige;
- obligations;
- responsabilités;
- restrictions;
- particularités;
- informations destinées à l’opérateur.

---

# 73. Services

Exemples possibles :

```text
Déneigement d’entrée
Déneigement de stationnement
Déglaçage
Épandage
Passage après charrue
Service prioritaire
Autre
```

La liste finale vient des paramètres de l’organisation.

---

# 74. Paramètres par défaut

Des paramètres de Wizard peuvent fournir :

- saison;
- date de début;
- date de fin;
- services actifs;
- seuil d’intervention;
- heure limite;
- dépôt de neige;
- mode de conclusion.

Ces valeurs sont des valeurs par défaut.

Le Contrat doit conserver son propre snapshot.

---

# 75. Obligations

Les obligations doivent être structurées.

Elles ne doivent pas reposer uniquement sur un long champ texte.

Exemples :

- accès libre;
- véhicules déplacés;
- obstacles;
- portail;
- balises;
- animaux;
- dépôt de neige;
- responsabilité du Client.

---

# 76. Clauses générées

Les réponses structurées peuvent produire les clauses.

Flux :

```text
Réponses métier
  ↓
Génération
  ↓
Clauses
  ↓
Aperçu
  ↓
Document
```

---

# 77. Clauses finales

Le Contrat doit conserver les clauses réellement utilisées.

Une modification future du générateur ne doit pas réécrire les anciens Contrats.

---

# 78. Édition des clauses

La V1 peut utiliser :

- clauses générées;
- clauses personnalisables;
- clause supplémentaire.

Toute modification après signature doit produire une nouvelle version ou un avenant.

---

# 79. Informations opérateur

Séparer :

```text
Notes internes
Instructions opérateur
Clauses Client
```

Ces concepts ne doivent pas partager un seul champ.

---

# 80. Instructions opérateur

Exemples :

- emplacement de dépôt;
- obstacle;
- portail;
- véhicule;
- particularité;
- priorité;
- zone non visible;
- consigne de sécurité.

Elles peuvent être copiées dans MissionItem.

---

# 81. Étape 4 — Modalités de paiement

Cette étape doit permettre :

- prix;
- taxes;
- mode de paiement;
- échéancier;
- notes financières;
- génération des Factures selon règle.

---

# 82. Prix

Le Contrat doit conserver :

- sous-total;
- taxes;
- total;
- devise;
- configuration de taxes utilisée.

---

# 83. Taxes

Les taux doivent provenir des paramètres de l’organisation.

Au Québec, la configuration existante peut inclure :

```text
TPS 5 %
TVQ 9,975 %
```

Le Contrat doit conserver les valeurs utilisées.

---

# 84. Échéancier

Exemples :

```text
Paiement complet
Deux versements
Trois versements
Échéancier personnalisé
```

Chaque entrée possède :

- description;
- type;
- valeur;
- date;
- ordre.

---

# 85. Validation de l’échéancier

Le total des versements doit correspondre au total du Contrat.

Exemple :

```text
50 %
50 %
= 100 %
```

ou :

```text
500 $
500 $
= 1 000 $
```

---

# 86. Génération de Factures

Lorsque le Contrat est finalisé selon le flux :

```text
Contrat
  ↓
Échéancier
  ↓
Factures brouillon
```

La génération doit être transactionnelle.

---

# 87. Modification de l’échéancier

Avant émission des Factures :

- modification possible;
- régénération contrôlée.

Après émission ou Paiement :

- modification limitée;
- ajustement ou nouvelle Facture;
- audit obligatoire.

---

# 88. Mode de paiement

Valeurs possibles :

```text
CASH
CHEQUE
E_TRANSFER
CARD
ONLINE
OTHER
```

La liste doit être configurable ou limitée selon l’organisation.

---

# 89. Étape 5 — Validation

L’écran final doit présenter :

- Client;
- propriété;
- adresse;
- carte;
- surface;
- services;
- obligations;
- prix;
- taxes;
- échéancier;
- clauses;
- notes;
- statut final;
- actions.

---

# 90. Actions de validation

Actions possibles :

```text
Enregistrer comme brouillon
Créer à signer
Activer
```

Les actions disponibles dépendent :

- des permissions;
- de la complétude;
- du mode de conclusion;
- de la signature;
- de la géométrie;
- des paramètres.

---

# 91. ContractReadiness

Projection conceptuelle :

```ts
type ContractReadiness = {
  contractId?: ContractId
  isReadyForSignature: boolean
  isReadyForActivation: boolean
  isReadyForRoute: boolean
  hasClient: boolean
  hasServiceAddress: boolean
  hasGeometry: boolean
  hasValidGeometry: boolean
  hasServices: boolean
  hasPrice: boolean
  hasPaymentSchedule: boolean
  hasClauses: boolean
  missingRequirements: string[]
  warnings: string[]
}
```

---

# 92. Statuts Contract recommandés

```text
DRAFT
SIGNATURE_PENDING
ACTIVE
SUSPENDED
COMPLETED
CANCELLED
ARCHIVED
```

---

# 93. Signification des statuts

## DRAFT

- création incomplète ou non finalisée;
- non opérationnel.

## SIGNATURE_PENDING

- prêt ou envoyé;
- signature attendue;
- non actif selon le mode de conclusion.

## ACTIVE

- engagement actif;
- utilisable dans les opérations.

## SUSPENDED

- temporairement non utilisable;
- historique conservé.

## COMPLETED

- saison ou service terminé.

## CANCELLED

- annulé;
- historique conservé.

## ARCHIVED

- retiré des listes courantes;
- historique conservé.

---

# 94. Transitions Contract

Flux principal :

```text
DRAFT
  ↓
SIGNATURE_PENDING
  ↓
ACTIVE
  ↓
COMPLETED
  ↓
ARCHIVED
```

Branches :

```text
ACTIVE → SUSPENDED
SUSPENDED → ACTIVE
DRAFT → CANCELLED
SIGNATURE_PENDING → CANCELLED
ACTIVE → CANCELLED
```

---

# 95. Activation

L’activation doit vérifier :

- Client valide;
- adresse;
- prix;
- dates;
- services;
- clauses;
- échéancier;
- permissions;
- signature selon le mode;
- géométrie selon la règle.

---

# 96. Mode de conclusion

Exemples :

```text
SIGNATURE_REQUIRED
MANUAL_APPROVAL
AUTO_ACTIVATE
```

La valeur doit venir des paramètres ou du Contrat.

---

# 97. Signature

La signature électronique complète peut être une phase future.

La structure doit permettre :

- statut;
- date;
- signataire;
- document;
- version;
- méthode;
- preuve.

---

# 98. Document Contract

Le document final doit contenir :

- identité RECA;
- numéro;
- Client;
- propriété;
- services;
- clauses;
- dates;
- prix;
- taxes;
- total;
- échéancier;
- signatures;
- informations légales.

---

# 99. PDF

La génération PDF doit utiliser un moteur de document dédié.

Le fichier doit conserver :

- texte sélectionnable;
- version;
- chemin Storage;
- date;
- auteur;
- statut.

---

# 100. Chargement différé PDF

La librairie PDF volumineuse doit être chargée dynamiquement.

Le module Contrats ne doit pas alourdir le bundle initial.

---

# 101. Version Contract

Un Contrat doit pouvoir posséder une version.

Exemple :

```text
contract_version
```

La version change lorsque des éléments importants sont modifiés.

---

# 102. Modifications importantes

Exemples :

- prix;
- services;
- clauses;
- échéancier;
- propriété;
- géométrie;
- dates;
- mode de conclusion.

---

# 103. Modification après activation

Une modification importante après activation doit :

- afficher un avertissement;
- demander une raison;
- incrémenter la version;
- générer un événement;
- éventuellement produire un nouveau document;
- préserver l’ancienne version.

---

# 104. Modification après Mission

Si un Contrat a déjà été utilisé dans une Mission :

- modification permise pour le futur;
- Mission passée inchangée;
- Mission future utilise la nouvelle version.

---

# 105. Avenant

Une future fonction d’avenant peut être ajoutée.

Elle devra :

- référencer le Contrat;
- décrire le changement;
- conserver l’ancienne version;
- être signée;
- produire un document.

Hors périmètre initial.

---

# 106. Fiche Contract

Structure officielle :

```text
En-tête
Statistiques essentielles
Onglets
Informations
Client
Propriété
Carte
Services
Clauses
Paiements
Documents
Notes
Historique
```

---

# 107. En-tête Contract

Afficher :

```text
CTR-000056 · Jean Tremblay
[ACTIF]
```

Informations secondaires :

- saison;
- adresse;
- type;
- version.

Action primaire contextuelle :

```text
Modifier
```

ou :

```text
Finaliser
```

ou :

```text
Ajouter à une Route
```

Menu :

- Dupliquer;
- Suspendre;
- Annuler;
- Archiver.

---

# 108. EntityHeader

L’en-tête doit respecter :

- une action primaire;
- actions secondaires neutres;
- destructif dans le menu;
- statut visible;
- numéro visible;
- identité réelle.

Ne jamais afficher simplement :

```text
Détail
```

---

# 109. Statistiques Contract

Statistiques utiles :

```text
Total
Superficie
Facturé
Payé
Solde
```

Ces statistiques doivent rester compactes.

---

# 110. Onglets Contract

Structure recommandée :

```text
Informations
Surface
Services & clauses
Facturation
Documents
Historique
```

La V1 peut conserver cinq onglets si cela simplifie la navigation.

---

# 111. Onglet Informations

Afficher :

- Client;
- adresse;
- contact;
- saison;
- dates;
- statut;
- type;
- notes;
- informations opérateur;
- Route liée.

---

# 112. Onglet Surface

Afficher :

- carte;
- zones;
- superficie;
- source;
- statut;
- version;
- date;
- zone GPS;
- avertissements;
- action Modifier.

---

# 113. Carte Contract

La carte doit permettre :

- voir la propriété;
- voir les zones exactes;
- voir la zone GPS;
- agrandir;
- changer le style;
- afficher les détails.

---

# 114. Onglet Services & clauses

Afficher :

- services;
- obligations;
- clauses;
- instructions;
- particularités;
- version du document.

---

# 115. Onglet Facturation

Afficher :

- prix;
- taxes;
- total;
- échéancier;
- Factures;
- Paiements;
- solde.

---

# 116. Onglet Documents

Afficher :

- Contrat PDF;
- version;
- date;
- statut;
- signature;
- téléchargement;
- régénération contrôlée.

---

# 117. Onglet Historique

Afficher :

- création;
- modifications;
- statuts;
- géométrie;
- versions;
- documents;
- Factures;
- Route;
- Missions;
- annulation;
- archivage.

---

# 118. Notes Contract

Les notes internes doivent être distinctes des instructions opérateur.

Chaque note possède :

- auteur;
- date;
- modification;
- suppression logique.

---

# 119. Liste Contracts

La liste doit permettre :

- recherche;
- filtre par statut;
- filtre par saison;
- filtre par Client;
- filtre par type;
- filtre par géométrie;
- filtre par paiement;
- filtre par Route;
- tri;
- mode compact.

---

# 120. Recherche Contracts

Champs :

- numéro;
- Client;
- entreprise;
- téléphone;
- adresse;
- ville;
- saison;
- Route.

---

# 121. Résumé Contracts

Statistiques compactes :

```text
Actifs
À signer
Brouillons
Suspendus
Sans zone
En retard de paiement
```

---

# 122. En retard de paiement

Le retard de paiement est un état financier calculé.

Il ne remplace pas le statut du Contrat.

Afficher séparément :

```text
ACTIF
PAIEMENT EN RETARD
```

---

# 123. Ligne Contract Desktop

Contenu recommandé :

```text
Numéro
Client
Adresse
Saison
Statut
Superficie
Total
Paiement
Route
```

---

# 124. Carte Contract Mobile

Afficher :

- numéro;
- Client;
- statut;
- adresse;
- saison;
- total;
- badge paiement;
- surface;
- chevron.

---

# 125. Duplication

La duplication peut servir à :

- nouvelle saison;
- propriété similaire;
- renouvellement.

Elle doit demander :

- nouvelle saison;
- nouvelles dates;
- clauses;
- prix;
- échéancier;
- géométrie;
- statut initial.

---

# 126. Renouvellement

Une future fonction de renouvellement peut être bâtie sur la duplication.

Elle ne doit pas modifier l’ancien Contrat.

---

# 127. Archivage

Archiver ne doit pas supprimer :

- Client;
- Factures;
- Paiements;
- Documents;
- géométrie;
- historique;
- Missions.

---

# 128. Annulation

L’annulation doit demander :

- raison;
- date;
- impact financier;
- impact sur Route;
- impact sur Missions futures.

---

# 129. Suspension

Une suspension doit :

- conserver le Contrat;
- empêcher son inclusion future selon règles;
- signaler les Routes concernées;
- ne pas modifier les Missions passées.

---

# 130. Route liée

Le Contrat peut appartenir à :

- aucune Route;
- une Route principale;
- plusieurs Routes selon modèle futur.

La V1 actuelle semble utiliser une relation RouteItem.

---

# 131. Ajout à une Route

Avant l’ajout :

- Contrat actif;
- adresse valide;
- coordonnées;
- géométrie selon règle;
- absence de doublon;
- permission.

---

# 132. Contrat dans plusieurs Routes

La règle doit être confirmée.

Direction initiale recommandée :

```text
Un Contrat actif appartient à une seule Route opérationnelle principale.
```

Une exception peut exister pour :

- services distincts;
- reprises;
- opérations spéciales.

---

# 133. ContractReadiness pour Route

Exemple :

```ts
type ContractRouteReadiness = {
  contractId: ContractId
  canAddToRoute: boolean
  isActive: boolean
  hasCoordinates: boolean
  hasGeometry: boolean
  hasOperatorInstructions: boolean
  conflicts: string[]
  warnings: string[]
}
```

---

# 134. Création de Mission

Le Contrat n’est pas lu directement par RECA Opérateur.

Flux :

```text
Contrat
  ↓
RouteItem
  ↓
Mission
  ↓
MissionItem snapshot
  ↓
RECA Opérateur
```

---

# 135. Informations copiées dans MissionItem

Minimum :

- contractId;
- numéro;
- Client affiché;
- adresse;
- coordonnées;
- ordre;
- zones;
- zone GPS;
- geometryVersion;
- instructions;
- alertes;
- surface.

---

# 136. Contrat modifié pendant Mission

La Mission active conserve son snapshot.

Une modification du Contrat produit un avertissement possible :

```text
Cette modification s’appliquera aux prochaines Missions.
```

---

# 137. Permissions Contract

Permissions recommandées :

```text
contract.read
contract.create
contract.update
contract.activate
contract.suspend
contract.cancel
contract.archive
contract.measure
contract.edit_geometry
contract.generate_document
contract.read_financial
contract.manage_billing
```

---

# 138. Permissions outil de mesure

Modifier la surface doit exiger :

```text
contract.edit_geometry
```

Créer un Contrat peut inclure cette permission selon rôle.

---

# 139. Sales Representative

Accès recommandé :

- créer;
- modifier brouillon;
- mesurer;
- préparer;
- soumettre à signature.

Activation finale selon permission.

---

# 140. Dispatcher

Accès recommandé :

- lecture;
- géométrie;
- informations opérateur;
- préparation Route;
- avertissements.

Modification commerciale limitée.

---

# 141. Accounting

Accès recommandé :

- lecture;
- prix;
- échéancier;
- Factures;
- Paiements.

Aucune modification de géométrie.

---

# 142. Operator

Aucun accès à la fiche Contrat complète.

Il reçoit les snapshots utiles dans MissionItem.

---

# 143. RLS Contracts

Lecture :

- même organisation;
- permission.

Écriture :

- même organisation;
- permission;
- statut compatible.

---

# 144. RLS ContractZones

Les zones héritent de l’autorisation du Contrat.

Une écriture doit vérifier :

- `contract.edit_geometry`;
- organisation;
- Contrat non archivé;
- transaction contrôlée.

---

# 145. Storage

Buckets possibles :

```text
contract-captures
contract-documents
contract-attachments
```

---

# 146. Chemins Storage

Exemple :

```text
organizations/{organizationId}/contracts/{contractId}/captures/{geometryVersion}.png
```

```text
organizations/{organizationId}/contracts/{contractId}/documents/{documentVersion}.pdf
```

---

# 147. Signed URLs

Ne pas stocker une URL signée.

Stocker :

- bucket;
- path;
- version;
- type.

---

# 148. Événements Contract

Exemples :

```text
ContractCreated
ContractUpdated
ContractActivated
ContractSuspended
ContractResumed
ContractCancelled
ContractArchived
ContractGeometryUpdated
ContractGeometryMigrated
ContractDocumentGenerated
ContractAddedToRoute
ContractRemovedFromRoute
```

---

# 149. ContractGeometryUpdated

Payload minimal :

```text
old_version
new_version
old_area
new_area
source
status
reason
```

Ne pas copier automatiquement toute la géométrie dans l’événement si une table d’historique existe.

---

# 150. Audit

Les changements critiques doivent conserver :

- acteur;
- date;
- ancienne valeur;
- nouvelle valeur;
- raison;
- version;
- source.

---

# 151. Migration de l’ancien outil

La migration doit être additive.

Elle ne doit jamais écraser les anciennes zones.

---

# 152. Faits d’ancrage de l’ancien modèle

Le modèle existant utilise :

```text
N lignes contract_zones
Chaque zone = Polygon
Surface calculée
Somme dans contracts.superficie
```

Le dessin était techniquement possible au-delà du cadre.

La limite ressentie provenait surtout :

- cadrage serré;
- boîte visuelle fixe;
- masque;
- capture du viewport.

---

# 153. Phase A — Cadrage

Objectif :

- supprimer l’effet de limite;
- permettre le dessin libre;
- recadrer selon les zones;
- capturer toutes les zones;
- ajouter satellite/plan;
- conserver le schéma existant.

Cette phase est purement visuelle et comportementale.

---

# 154. Phase B — Géométrie unifiée

Ajouter de manière additive :

```text
contract_zones.source
contract_zones.version
contract_zones.partially_hidden

contracts.snow_geometry
contracts.gps_geometry
contracts.geometry_version
contracts.geometry_source
contracts.geometry_status
contracts.geometry_updated_at
```

---

# 155. Backfill

Pour les Contrats possédant des zones :

```text
Construire une représentation MultiPolygon
geometry_source = MIGRATED
geometry_status = NEEDS_REVIEW
```

Pour les Contrats sans zone :

```text
geometry_status = MISSING
```

---

# 156. Backfill non destructif

Le backfill ne doit pas :

- modifier les anciens GeoJSON;
- modifier la superficie historique;
- supprimer une zone;
- produire une zone GPS fictive;
- marquer automatiquement toutes les données valides.

---

# 157. GPS Geometry pendant migration

Direction recommandée :

```text
gps_geometry = null
```

jusqu’à :

- ouverture;
- validation;
- sauvegarde;
- dérivation dans le sprint opérateur.

---

# 158. Rapport de migration

Le rapport doit identifier :

- nombre de Contrats;
- avec zones;
- sans zone;
- migrés;
- invalides;
- à réviser;
- surfaces extrêmes;
- zones éloignées;
- erreurs.

---

# 159. Contrats existants

La fiche doit afficher un badge :

```text
SURFACE À VÉRIFIER
```

avec action :

```text
Vérifier la surface
```

---

# 160. Feature flag

Le nouvel éditeur peut être contrôlé par :

```text
new_contract_measurement_editor
```

Il doit être temporaire et retiré après stabilisation.

---

# 161. Retour arrière

Les migrations additives permettent au code précédent d’ignorer les nouvelles colonnes.

Aucune donnée existante ne doit être détruite.

---

# 162. Compatibilité ancienne RECA App

Pendant la transition :

- l’ancienne application continue d’utiliser les anciennes zones;
- RECA App V2 utilise les adapters;
- les nouvelles colonnes sont additives;
- aucun changement destructif;
- les deux systèmes doivent écrire de manière contrôlée.

---

# 163. Double écriture

La double écriture doit être centralisée.

Exemple :

```text
Sauvegarder contract_zones
  ↓
Dériver snow_geometry
  ↓
Mettre à jour Contract
```

Elle ne doit pas être dupliquée dans plusieurs pages.

---

# 164. Compatibilité RECA Opérateur

Avant d’activer la consommation de `gps_geometry`, vérifier :

- schéma;
- version;
- format;
- Polygon/MultiPolygon;
- taille;
- précision;
- fallback point/rayon;
- comportement hors ligne;
- MissionItem snapshot.

---

# 165. Fallback Operator

Pendant la migration, RECA Opérateur peut utiliser :

```text
gps_geometry
```

sinon :

```text
point + rayon
```

La stratégie exacte doit être définie dans `12-Operator-Integration-and-Synchronization.md`.

---

# 166. Desktop — Wizard

Le Wizard Desktop doit utiliser :

- viewport stable;
- progression;
- carte large;
- panneau d’outils;
- résumé latéral;
- actions collantes;
- scroll local contrôlé.

---

# 167. Desktop — éditeur de mesure

Structure recommandée :

```text
┌──────────────────────────────────────────────┐
│ Étape · Adresse · Surface · Actions          │
├──────────────────────────────┬───────────────┤
│ Carte principale             │ Zones         │
│                              │ Outils         │
│                              │ Avertissements │
├──────────────────────────────┴───────────────┤
│ Retour · Enregistrer · Continuer             │
└──────────────────────────────────────────────┘
```

---

# 168. Tablette

La Tablette peut utiliser :

- carte presque plein écran;
- panneau latéral repliable;
- bottom sheet pour zones;
- gros contrôles tactiles;
- barre d’actions fixe.

---

# 169. Mobile

Le mobile doit rester utilisable.

Cependant, le dessin précis de grandes surfaces est mieux adapté à Desktop ou Tablette.

La V1 Mobile doit permettre :

- consulter;
- corriger simplement;
- ajouter une zone;
- déplacer;
- valider;
- sauvegarder.

---

# 170. Mobile — flow plein écran

Pendant la mesure :

- masquer Bottom Navigation;
- afficher titre réel;
- afficher retour;
- afficher action;
- respecter safe area;
- carte plein écran;
- outils flottants.

---

# 171. Mobile — contrôles

Les contrôles doivent avoir :

```text
44 × 44 px minimum
```

---

# 172. Mobile — liste des zones

La liste peut utiliser un bottom sheet :

```text
2 zones
- Stationnement principal
- Passage latéral
```

---

# 173. Mobile — avertissements

Les avertissements doivent être visibles avant la sauvegarde.

Ne pas les cacher uniquement dans un panneau fermé.

---

# 174. Design visuel

L’éditeur utilise :

- carte dominante;
- panneaux flottants;
- surfaces premium;
- contraste;
- peu de rouge;
- contours clairs;
- icônes simples;
- états distincts.

---

# 175. Utilisation du rouge

Le rouge RECA sert à :

- action primaire;
- marque;
- erreur;
- suppression.

La zone dessinée peut utiliser une autre couleur fonctionnelle pour éviter la confusion.

---

# 176. États de chargement

Prévoir :

- géocodage;
- carte;
- zones;
- capture;
- sauvegarde;
- dérivation;
- PDF.

---

# 177. Carte indisponible

État :

```text
Impossible de charger la carte.

Les informations du Contrat restent disponibles.
[Réessayer]
```

Ne pas supprimer les zones locales déjà dessinées.

---

# 178. Échec géocodage

État :

```text
Adresse non localisée.

Vous pouvez repositionner manuellement la propriété.
```

---

# 179. Échec capture

La capture est secondaire.

Si la géométrie est sauvegardée mais que la capture échoue :

- conserver la géométrie;
- signaler l’échec;
- permettre de régénérer la capture.

---

# 180. Performance

Objectifs :

- carte chargée en différé;
- outils fluides;
- pas de recalcul excessif;
- surface recalculée après édition;
- capture optimisée;
- historique limité;
- validation non bloquante lorsque possible.

---

# 181. Simplification d’affichage

Pour les aperçus non éditables, utiliser une géométrie simplifiée si nécessaire.

La géométrie autoritative demeure inchangée.

---

# 182. Tests unitaires Contract

Tester :

- statuts;
- transitions;
- activation;
- Readiness;
- échéancier;
- taxes;
- génération de clauses;
- version;
- archivage;
- suspension;
- annulation.

---

# 183. Tests unitaires Geometry

Tester :

- Polygon;
- plusieurs zones;
- MultiPolygon;
- union;
- surface;
- bbox;
- buffer;
- simplification;
- auto-intersection;
- distance;
- version;
- absence de changement.

---

# 184. Tests d’intégration

Tester :

- création Contract;
- création zones;
- sauvegarde;
- dérivation;
- version;
- Storage;
- PDF;
- Factures;
- Route;
- migration;
- RLS;
- events.

---

# 185. Tests E2E — création complète

```text
Sélectionner Client
  ↓
Localiser propriété
  ↓
Tracer deux zones
  ↓
Valider surface
  ↓
Choisir services
  ↓
Définir prix
  ↓
Créer échéancier
  ↓
Créer Contract
  ↓
Générer Factures
  ↓
Ouvrir fiche
```

---

# 186. Tests E2E — cadre dépassé

```text
Propriété avec stationnement long
  ↓
Tracer hors cadrage initial
  ↓
Recadrage automatique
  ↓
Capture complète
  ↓
Sauvegarde
```

---

# 187. Tests E2E — surface cachée

```text
Bascule satellite / plan
  ↓
Tracer manuellement
  ↓
Marquer partiellement cachée
  ↓
Validation avec avertissement
  ↓
Sauvegarde
```

---

# 188. Tests E2E — migration

```text
Ouvrir Contrat ancien
  ↓
Source MIGRATED
  ↓
Status NEEDS_REVIEW
  ↓
Vérifier
  ↓
Corriger
  ↓
Sauvegarder
  ↓
Source MANUAL
  ↓
Nouvelle version
```

---

# 189. Tests E2E — Mission snapshot

```text
Créer Mission
  ↓
Copier géométrie version 3
  ↓
Modifier Contract version 4
  ↓
MissionItem conserve version 3
```

---

# 190. Tests responsive

Tester :

```text
375 px
390 px
414 px
768 px
834 px
1024 px
1280 px
1440 px
1920 px
```

---

# 191. Fixtures

Prévoir :

```text
Contrat résidentiel simple
Contrat commercial
Contrat sans zone
Contrat avec deux zones
Entrée longue
Propriété en coin
Zones chevauchantes
Surface cachée
Géométrie migrée
Géométrie invalide
Soumission convertie
Contrat suspendu
Contrat avec Factures
Contrat déjà utilisé en Mission
```

---

# 192. Master UI

Le module doit dériver de deux Master UI.

## Fiche commerciale

Utilisée pour la fiche Contract.

## Formulaire complexe

Utilisé pour le Wizard.

L’éditeur de mesure constitue un flow spécialisé.

---

# 193. Validation avant implémentation

Avant le code :

- valider le Wizard;
- valider le nombre d’étapes;
- valider le flow mesure;
- valider les types de zone;
- valider le mode de conclusion;
- valider l’activation sans zone;
- valider les paramètres GPS;
- valider les statuts;
- valider l’intégration Factures;
- valider l’intégration RECA Opérateur.

---

# 194. Hors périmètre initial

Ne pas bloquer la V1 avec :

- signature électronique avancée;
- avenants complets;
- exclusions complexes;
- import cadastral;
- modèle 3D;
- calcul IA de surface;
- détection automatique de stationnement;
- photo aérienne alternative payante;
- historique visuel comparatif complet;
- édition collaborative temps réel;
- optimisation GPS automatique non testée;
- portail Client complet.

---

# 195. Décisions à confirmer

Avant l’implémentation finale, confirmer :

- nombre exact d’étapes;
- analyse et zones obligatoire ou facultative;
- activation sans zone;
- ajout à une Route sans zone;
- types de zones;
- exclusions;
- stockage GeoJSON ou PostGIS;
- dérivation GPS;
- paramètres de buffer;
- versionnement Contract;
- signature;
- mode de conclusion;
- Factures automatiques;
- modification après activation;
- modèle de renouvellement;
- relation Contract–Route;
- stratégie de brouillon;
- modèle de capture;
- permissions Sales;
- permissions Dispatcher sur géométrie.

Toutes les décisions confirmées doivent être ajoutées dans `memory.md`.

---

# 196. Règles non négociables

Ne jamais supprimer l’outil de mesure.

Ne jamais limiter la géométrie au cadre visuel.

Ne jamais utiliser la capture comme source de vérité.

Ne jamais fusionner zone exacte et zone GPS sans distinction.

Ne jamais modifier une Mission passée depuis un Contrat actuel.

Ne jamais écraser une géométrie migrée sans confirmation.

Ne jamais inventer une zone GPS pendant un backfill.

Ne jamais réécrire silencieusement un document déjà signé ou envoyé.

Ne jamais générer des Factures partielles sans transaction.

Ne jamais afficher toutes les actions au même niveau.

Ne jamais permettre à l’Operator d’accéder à la fiche Contract complète.

Ne jamais perdre les zones en cas d’erreur de sauvegarde.

---

# 197. Diagramme principal

```text
Client
  ↓
Contract
  ├── Adresse de service
  ├── Services
  ├── Clauses
  ├── Paiement
  ├── Documents
  ├── Notes
  └── ContractZones
         ↓
      snow_geometry
         ↓
      gps_geometry
         ↓
      Route
         ↓
      Mission
         ↓
      MissionItem snapshot
         ↓
      RECA Opérateur
```

---

# 198. Flux de création officiel

```text
Client ou Soumission
      ↓
Nouveau Contract
      ↓
Client et propriété
      ↓
Localisation
      ↓
Analyse et zones
      ↓
Services et obligations
      ↓
Modalités de paiement
      ↓
Validation
      ↓
Création transactionnelle
      ↓
Factures
      ↓
Document
      ↓
Fiche Contract
```

---

# 199. Flux de modification géométrique

```text
Ouvrir éditeur
      ↓
Charger zones version N
      ↓
Modifier
      ↓
Valider
      ↓
Dériver snow_geometry
      ↓
Préparer gps_geometry
      ↓
Incrémenter version N+1
      ↓
Sauvegarder
      ↓
Créer événement
      ↓
Appliquer aux futures Missions
```

---

# 200. Résumé officiel

Le Contrat relie le Client, la propriété, les services, les clauses, les modalités, la surface et les opérations.

Le Contrat est permanent.

La Mission est un événement réel.

L’outil de mesure est conservé et reconstruit comme un véritable éditeur de surface.

La vue de capture, la zone exacte et la zone GPS sont trois concepts distincts.

Les zones sont éditables librement.

Le dessin ne doit jamais être limité par un cadre.

Plusieurs zones sont supportées.

La géométrie est versionnée.

Les données migrées sont conservées et marquées à vérifier.

La superficie est calculée en mètres carrés.

Les MissionItems conservent un snapshot de la géométrie utilisée.

Les Factures peuvent être générées depuis l’échéancier.

Les documents conservent leurs versions.

L’objectif est de transformer le Contrat en une source de vérité commerciale et opérationnelle fiable pour l’ensemble de l’écosystème RECA.
