# 15-Migration-Strategy.md

# RECA
## Stratégie de migration vers RECA App V2

Version : 1.0  
Projet cible : `reca-app-v2`  
Application historique : `reca-app`  
Application terrain : `reca-operateur`  
Statut : Stratégie officielle de migration fonctionnelle, technique et opérationnelle  

---

# 1. Objectif du document

Ce document définit la stratégie officielle pour migrer progressivement de l’application historique `reca-app` vers `reca-app-v2`, sans interrompre les opérations de Groupe RECA et sans modifier ou supprimer prématurément les systèmes existants.

Il décrit :

- le rôle de chaque dépôt;
- la hiérarchie des sources de vérité;
- les principes de migration;
- les inventaires requis;
- la migration du frontend;
- la migration des données;
- la migration des statuts;
- la migration des permissions;
- la migration des documents;
- la migration des géométries;
- la migration des Routes et Missions;
- la migration financière;
- l’intégration avec `reca-operateur`;
- les mécanismes de compatibilité;
- les feature flags;
- les validations;
- les stratégies de bascule;
- les plans de retour arrière;
- les critères de retrait de l’ancienne application;
- les responsabilités de Claude;
- les tests;
- les critères de réussite.

Ce document complète notamment :

```text
00-Vision.md
02-Information-Architecture.md
03-Application-Architecture.md
04-Data-Architecture.md
05-Authentication-Roles-Permissions.md
08-Contracts-and-Measurement.md
09-Routes-Missions-and-Dispatch.md
11-Finance-and-Payments.md
12-Operator-Integration-and-Synchronization.md
14-Search-Notifications-and-History.md
```

---

# 2. Vision générale

La migration ne doit pas être un remplacement brutal.

Elle doit suivre une progression contrôlée :

```text
Comprendre
  ↓
Stabiliser
  ↓
Ajouter
  ↓
Migrer
  ↓
Comparer
  ↓
Basculer
  ↓
Observer
  ↓
Retirer
```

`reca-app-v2` doit devenir progressivement la nouvelle source de vérité applicative, sans casser les données, les usages ou l’intégration avec `reca-operateur`.

---

# 3. Rôle officiel des trois dépôts

## 3.1 `reca-app`

Rôle :

```text
Application historique
Référence fonctionnelle temporaire
Source d’inventaire métier
Système encore utilisable pendant la migration
```

Règles :

- ne pas supprimer;
- ne pas réécrire massivement;
- ne pas modifier sans demande explicite;
- consulter pour comprendre les comportements existants;
- conserver tant que la bascule n’est pas validée;
- utiliser comme point de comparaison.

## 3.2 `reca-app-v2`

Rôle :

```text
Nouvelle application officielle
Nouveau centre des opérations
Nouvelle architecture applicative
Nouvelle source de vérité frontend
```

Règles :

- nouveau dépôt;
- architecture propre;
- documentation officielle;
- migrations additives;
- compatibilité temporaire;
- nouveaux modules construits progressivement;
- aucune dépendance runtime directe à `reca-app`.

## 3.3 `reca-operateur`

Rôle :

```text
Application terrain officielle
Exécution des Missions
Fonctionnement hors ligne
Synchronisation opérationnelle
```

Règles :

- ne pas casser les payloads existants;
- maintenir la compatibilité pendant la transition;
- versionner les contrats;
- valider chaque modification d’intégration;
- ne pas utiliser `reca-operateur` comme environnement de test destructif.

---

# 4. Hiérarchie des sources de vérité

Pendant la migration :

```text
Données métier actuelles
Base Supabase existante

Comportements historiques
reca-app

Comportements terrain
reca-operateur

Architecture cible
Documentation de reca-app-v2

Décisions confirmées
memory.md
```

Lorsqu’une contradiction existe :

1. vérifier le comportement réel;
2. vérifier les données;
3. identifier la décision métier;
4. documenter la divergence;
5. obtenir une validation;
6. mettre à jour `memory.md`;
7. seulement ensuite implémenter.

---

# 5. Principes non négociables

La migration doit respecter les principes suivants :

1. aucune suppression prématurée;
2. aucune migration destructive sans retour arrière;
3. aucune modification de statut sans mapping explicite;
4. aucune donnée historique inventée;
5. aucune double écriture dispersée;
6. aucune bascule sans comparaison;
7. aucune modification de `reca-operateur` sans contrat versionné;
8. aucune perte de documents;
9. aucune perte de géométrie;
10. aucune perte d’historique;
11. aucune perte d’identifiants;
12. aucune perte de relation Client–Contrat–Route–Mission;
13. aucune migration financière sans vérification des soldes;
14. aucune modification de permissions sans test RLS;
15. aucune désactivation de l’ancienne application sans période d’observation.

---

# 6. Objectifs de la migration

La migration doit permettre de :

- reconstruire le frontend proprement;
- conserver les données;
- améliorer l’expérience;
- sécuriser les permissions;
- standardiser les statuts;
- fiabiliser les transactions;
- clarifier les relations métier;
- centraliser les contrats d’intégration;
- préserver les Missions historiques;
- préserver les données financières;
- préparer les évolutions futures;
- réduire progressivement la dépendance à l’ancien code.

---

# 7. Non-objectifs initiaux

La migration ne doit pas automatiquement :

- remplacer tous les services externes;
- réécrire toute la base;
- convertir toutes les tables en même temps;
- imposer PostGIS immédiatement;
- migrer tous les documents historiques vers un nouveau format;
- modifier `reca-operateur` en profondeur;
- introduire toutes les fonctions futures;
- supprimer tous les champs legacy;
- faire une migration big bang.

---

# 8. Stratégie générale

La stratégie officielle suit :

```text
Expand
  ↓
Migrate
  ↓
Compare
  ↓
Switch
  ↓
Observe
  ↓
Contract
```

---

# 9. Phase Expand

Objectif :

- ajouter les nouvelles structures;
- conserver les anciennes;
- éviter les changements destructifs;
- permettre la compatibilité.

Exemples :

```text
Ajouter geometry_version
Ajouter geometry_status
Ajouter user_roles
Ajouter events
Ajouter nouvelles vues
Ajouter RPC transactionnelles
```

Ne pas supprimer immédiatement :

```text
users.role
anciennes colonnes de statut
anciens champs de géométrie
anciens chemins de document
```

---

# 10. Phase Migrate

Objectif :

- copier;
- transformer;
- normaliser;
- relier;
- marquer les données ambiguës;
- générer des rapports.

Chaque migration doit être :

- relançable;
- idempotente;
- observable;
- testable;
- documentée.

---

# 11. Phase Compare

Objectif :

- comparer ancien et nouveau;
- mesurer les différences;
- corriger;
- valider.

Comparaisons :

```text
Nombre d’entités
Statuts
Montants
Soldes
Relations
Géométries
Documents
Permissions
Missions
MissionItems
```

---

# 12. Phase Switch

Objectif :

- basculer un module;
- changer la route d’accès;
- activer la nouvelle interface;
- conserver un fallback.

La bascule doit être :

- limitée;
- réversible;
- mesurée;
- communiquée.

---

# 13. Phase Observe

Objectif :

- surveiller;
- comparer;
- collecter les erreurs;
- mesurer l’usage;
- valider les données;
- confirmer l’adoption.

---

# 14. Phase Contract

Objectif :

- retirer progressivement les anciens champs;
- retirer les anciens écrans;
- retirer les feature flags;
- retirer les mappings temporaires;
- retirer la double écriture.

Cette phase ne commence que lorsque la nouvelle version est stable.

---

# 15. Inventaire initial obligatoire

Avant tout développement majeur, créer un inventaire complet de `reca-app`.

L’inventaire doit couvrir :

```text
Routes React
Pages
Composants
Hooks
Services
Queries
Mutations
Supabase calls
Tables
Views
RPC
RLS
Storage
Documents
Statuts
Permissions
Feature flags
Dépendances
Intégrations
Cron jobs
Edge Functions
```

---

# 16. Inventaire des modules

Créer une matrice :

| Module | Ancienne route | Tables | Statuts | Mutations | RLS | Documents | Migration |
|---|---|---|---|---|---|---|---|
| Leads | À inventorier | À inventorier | À inventorier | À inventorier | À inventorier | Non | À planifier |
| Quotes | À inventorier | À inventorier | À inventorier | À inventorier | À inventorier | Oui | À planifier |
| Clients | À inventorier | À inventorier | À inventorier | À inventorier | À inventorier | Oui | À planifier |
| Contracts | À inventorier | À inventorier | À inventorier | À inventorier | À inventorier | Oui | Critique |
| Routes | À inventorier | À inventorier | À inventorier | À inventorier | À inventorier | Non | Critique |
| Missions | À inventorier | À inventorier | À inventorier | À inventorier | À inventorier | Non | Critique |
| Employees | À inventorier | À inventorier | À inventorier | À inventorier | À inventorier | Oui | À planifier |
| Equipment | À inventorier | À inventorier | À inventorier | À inventorier | À inventorier | Oui | À planifier |
| Invoices | À inventorier | À inventorier | À inventorier | À inventorier | À inventorier | Oui | Critique |
| Payments | À inventorier | À inventorier | À inventorier | À inventorier | À inventorier | Oui | Critique |

---

# 17. Inventaire des statuts

Créer un registre officiel :

```text
Entité
Ancienne valeur
Nouveau statut
Confiance
Transformation
Révision requise
Date de retrait
```

Exemple :

| Entité | Ancien statut | Nouveau statut | Confiance | Action |
|---|---|---|---|---|
| Lead | `soumission_envoyee` | `QUOTE_SENT` | Haute | Automatique |
| Client | `actif` | `ACTIVE` | Haute | Automatique |
| Client | `inactif` | `INACTIVE` | Haute | Automatique |
| User | `operateur` | `OPERATOR` | Moyenne | Vérifier permissions |

---

# 18. Valeurs inconnues

Toute valeur inconnue doit être :

```text
NEEDS_REVIEW
```

dans le rapport de migration.

Elle ne doit pas être transformée silencieusement.

---

# 19. Inventaire des identifiants

Pour chaque entité, identifier :

- UUID;
- numéro visible;
- ancien ID;
- relation externe;
- relation Storage;
- relation Operator;
- relation document.

La migration doit préserver :

```text
legacy_id
```

ou une table de correspondance si nécessaire.

---

# 20. Table de correspondance

Structure conceptuelle :

```ts
type LegacyIdMapping = {
  id: string
  entityType: string
  legacyId: string
  newId: string
  migratedAt: string
  migrationBatchId: string
}
```

---

# 21. Identifiants visibles

Les numéros visibles existants doivent être préservés lorsque fiables.

Exemples :

```text
CLI-000053
CTR-000056
RTE-000014
FAC-000081
```

Ne pas les régénérer sans besoin.

---

# 22. Inventaire des relations

Vérifier :

```text
Lead → Quote
Quote → Client
Client → Contract
Contract → ContractZones
Contract → RouteItem
Route → RouteItems
Route → Missions
Mission → MissionItems
Mission → Operator
Mission → Equipment
Invoice → Payments
```

---

# 23. Données orphelines

Identifier :

- Quote sans Lead ni Client;
- Contract sans Client;
- RouteItem sans Contract;
- Mission sans Route;
- MissionItem sans Mission;
- Payment sans Invoice;
- document sans entité;
- User sans profil;
- Employee sans User;
- Operator sans permission.

---

# 24. Traitement des orphelins

Chaque cas doit être classé :

```text
Réparable automatiquement
Réparable avec règle
Révision humaine
Historique seulement
Impossible à récupérer
```

---

# 25. Rapport de qualité initial

Le rapport doit inclure :

- total par entité;
- statuts inconnus;
- données manquantes;
- doublons;
- relations cassées;
- montants incohérents;
- géométries invalides;
- documents manquants;
- utilisateurs sans rôle;
- Missions incomplètes;
- conflits d’organisation.

---

# 26. Migration du frontend

Le frontend doit être reconstruit dans `reca-app-v2`.

Il ne doit pas être créé en copiant tout le code de `reca-app`.

---

# 27. Réutilisation contrôlée

Peuvent être repris après analyse :

- utilitaires purs;
- schémas validés;
- types fiables;
- fonctions de formatage;
- composants accessibles;
- assets officiels;
- comportements métier confirmés.

---

# 28. Éléments à ne pas copier automatiquement

Ne pas copier aveuglément :

- architecture de dossiers;
- pages entières;
- composants dupliqués;
- accès Supabase directs;
- logique dispersée;
- styles ad hoc;
- routes historiques;
- statuts non centralisés;
- grandes cartes génériques;
- formulaires en modale;
- code legacy non testé.

---

# 29. Anti-corruption layer

RECA App V2 doit utiliser des adapters pour lire les données legacy.

Exemple :

```text
LegacyClientRow
  ↓
LegacyClientMapper
  ↓
ClientDomainModel
```

---

# 30. Adapter legacy

Responsabilités :

- mapping de noms;
- mapping de statuts;
- normalisation;
- conversion de dates;
- conversion de montants;
- gestion des valeurs null;
- gestion des champs anciens;
- journalisation des anomalies.

---

# 31. Domaine cible

Les composants ne doivent pas connaître les colonnes legacy.

Ils utilisent :

```text
Client
Contract
Route
Mission
Invoice
Payment
```

selon les modèles cibles.

---

# 32. Migration module par module

Ordre recommandé :

```text
1. Shell, Auth, Design System
2. Clients
3. Leads et Soumissions
4. Contrats
5. Employés et Équipements
6. Routes
7. Missions
8. Centre des opérations
9. Factures et Paiements
10. Recherche, notifications et historique
11. Paramètres
12. Retrait progressif legacy
```

L’ordre exact peut être ajusté selon les dépendances.

---

# 33. Pourquoi Clients tôt

Clients est une dépendance importante pour :

- Contracts;
- Invoices;
- Quotes;
- Search;
- Documents;
- History.

---

# 34. Pourquoi Missions après Routes

Missions dépend de :

- Routes;
- Contract snapshots;
- Employees;
- Equipment;
- Operator integration.

---

# 35. Pourquoi Dashboard après projections

Le Centre des opérations doit être alimenté par des modules réels.

Un Dashboard purement simulé ne doit pas devenir la source de logique.

---

# 36. Migration de l’authentification

Étapes :

1. inventorier `auth.users`;
2. inventorier profils applicatifs;
3. inventorier rôles;
4. inventorier Employee links;
5. ajouter modèle de permissions;
6. migrer les comptes;
7. conserver rôle legacy temporairement;
8. tester RLS;
9. invalider les sessions si nécessaire;
10. basculer V2.

---

# 37. Rôle legacy

Pendant la transition :

```text
users.role
```

peut rester disponible pour `reca-app`.

RECA App V2 doit utiliser :

```text
roles
permissions
user_roles
role_permissions
```

ou une couche compatible.

---

# 38. Synchronisation des rôles

Éviter une double écriture depuis plusieurs frontends.

Direction :

```text
Fonction serveur unique
  ↓
Mettre à jour nouveau modèle
  ↓
Mettre à jour projection legacy
```

---

# 39. Migration des permissions

Pour chaque rôle :

- lister les accès actuels;
- lister les accès attendus;
- identifier les écarts;
- créer la matrice;
- tester les routes;
- tester les RPC;
- tester RLS.

---

# 40. RLS en mode compatibilité

Pendant la transition, les politiques peuvent devoir accepter :

- anciens rôles;
- nouvelles permissions;
- anciennes applications.

Toute politique temporaire doit être documentée.

---

# 41. Interdiction d’élargissement silencieux

Ne jamais rendre une politique plus permissive uniquement pour simplifier la migration.

---

# 42. Migration des Clients

Étapes :

1. inventorier les colonnes;
2. normaliser noms;
3. normaliser téléphone;
4. normaliser courriel;
5. mapper type;
6. mapper statut;
7. mapper langue;
8. vérifier adresses;
9. conserver géocodage;
10. détecter doublons;
11. migrer notes;
12. migrer documents;
13. comparer totaux.

---

# 43. Doublons Clients

Ne pas fusionner automatiquement.

Créer un rapport :

```text
Match téléphone
Match courriel
Match adresse
Match nom + adresse
```

---

# 44. Migration des Leads

Étapes :

- mapper statuts;
- conserver source;
- conserver assignation;
- conserver rappels;
- conserver notes;
- conserver Quotes liées;
- conserver raisons de perte;
- normaliser contact.

---

# 45. Migration des Soumissions

Étapes :

- mapper statuts;
- conserver items;
- conserver montants;
- conserver taxes;
- conserver expiration;
- conserver documents;
- conserver envois;
- conserver liens Lead et Client;
- identifier versions.

---

# 46. Migration des Contracts

La migration des Contracts est critique.

Elle doit préserver :

- Client;
- adresse;
- saison;
- services;
- clauses;
- prix;
- taxes;
- échéancier;
- documents;
- signature;
- zones;
- Route;
- Factures;
- historique.

---

# 47. Contract legacy adapter

Le mapper doit produire :

```text
ContractDomainModel
ContractReadiness
ContractFinancialSummary
ContractGeometrySummary
```

---

# 48. Migration de l’outil de mesure

Le modèle existant utilise :

```text
contract_zones
N lignes
Chaque ligne = Polygon
```

La migration doit préserver ces lignes.

---

# 49. Ajouts géométriques

Ajouter de manière additive :

```text
contracts.snow_geometry
contracts.gps_geometry
contracts.geometry_version
contracts.geometry_source
contracts.geometry_status
contracts.geometry_updated_at
```

et selon besoin :

```text
contract_zones.source
contract_zones.version
contract_zones.partially_hidden
```

---

# 50. Backfill snow_geometry

Pour chaque Contract avec zones :

1. charger les Polygons;
2. valider;
3. construire MultiPolygon ou union;
4. calculer la superficie;
5. comparer à la superficie existante;
6. marquer `MIGRATED`;
7. marquer `NEEDS_REVIEW`;
8. conserver les anciennes zones.

---

# 51. Backfill gps_geometry

Direction initiale :

```text
gps_geometry = null
```

jusqu’à une validation ou dérivation contrôlée.

Ne pas inventer une géométrie GPS.

---

# 52. Migration des captures

Les captures existantes doivent être :

- inventoriées;
- reliées au Contract;
- conservées;
- marquées legacy;
- régénérées seulement si nécessaire.

---

# 53. Migration des Routes

Étapes :

1. inventorier Routes;
2. inventorier RouteItems;
3. conserver ordre;
4. conserver Contract links;
5. conserver ressources par défaut;
6. mapper statuts;
7. calculer Readiness;
8. conserver Missions historiques;
9. détecter doublons;
10. détecter Contracts invalides.

---

# 54. Migration des RouteItems

Vérifier :

- ordre unique;
- Contract existant;
- Route existante;
- statut;
- doublon;
- secteur;
- historique.

---

# 55. Migration des Missions

Étapes :

1. inventorier Missions;
2. mapper statuts;
3. inventorier MissionItems;
4. conserver timestamps;
5. conserver Operator;
6. conserver Equipment;
7. conserver Problems;
8. conserver transitions;
9. conserver progression;
10. conserver source legacy.

---

# 56. Missions historiques

Les Missions historiques doivent rester lisibles même si :

- Contract supprimé;
- géométrie absente;
- Operator archivé;
- Equipment archivé;
- Route modifiée;
- données incomplètes.

---

# 57. Backfill MissionItem snapshots

Lorsque les snapshots n’existent pas :

- utiliser les données historiques disponibles;
- ne pas utiliser automatiquement les données actuelles sans marquage;
- ajouter `source = LEGACY`;
- documenter les limites;
- conserver l’incertitude.

---

# 58. MissionItem et géométrie

Si la géométrie historique est inconnue :

```text
geometrySource = LEGACY_UNKNOWN
```

Ne pas prétendre que la géométrie actuelle était celle utilisée.

---

# 59. Migration des Problems

Étapes :

- mapper codes;
- mapper sévérité;
- mapper statut;
- conserver date;
- conserver auteur;
- conserver MissionItem;
- conserver résolution;
- identifier les textes libres non structurés.

---

# 60. Migration des Employees

Étapes :

- préserver Employee;
- lier User;
- mapper statut;
- mapper `can_operate`;
- mapper rôle;
- préserver Missions;
- préserver disponibilité connue;
- identifier incohérences.

---

# 61. Migration des Equipment

Étapes :

- mapper type;
- mapper statut;
- préserver identifiants;
- préserver Missions;
- préserver affectations;
- préserver maintenance;
- détecter doublons;
- identifier équipements archivés encore assignés.

---

# 62. Migration des Invoices

La migration financière doit préserver :

- numéro;
- Client;
- Contract;
- items;
- sous-total;
- taxes;
- total;
- date;
- échéance;
- statut;
- PDF;
- Paiements;
- solde;
- historique.

---

# 63. Migration des Payments

Préserver :

- montant;
- date;
- méthode;
- référence;
- Invoice;
- Client;
- statut;
- annulation;
- acteur.

---

# 64. Recalcul financier

Avant bascule :

```text
totalCents
paidCents
creditedCents
balanceCents
status
```

doivent être recalculés et comparés.

---

# 65. Tolérance financière

Direction recommandée :

```text
Aucune différence silencieuse
```

Toute différence doit être rapportée.

Les écarts d’arrondi doivent être identifiés séparément.

---

# 66. Migration des documents

Inventorier :

- bucket;
- path;
- entité;
- type;
- version;
- date;
- taille;
- statut;
- accessibilité.

---

# 67. Documents orphelins

Créer un rapport pour :

- fichier sans DB;
- DB sans fichier;
- mauvais bucket;
- mauvais chemin;
- entité inexistante;
- document inaccessible.

---

# 68. Migration Storage

La migration Storage doit être :

- additive;
- vérifiée par checksum lorsque possible;
- relançable;
- non destructive;
- journalisée.

---

# 69. Signed URLs

Ne jamais migrer une Signed URL comme donnée permanente.

Migrer :

```text
bucket
path
metadata
```

---

# 70. Migration des Notes

Préserver :

- auteur;
- date;
- entité;
- contenu;
- modification;
- suppression logique.

---

# 71. Migration de l’historique

Les événements existants peuvent être :

- structurés;
- semi-structurés;
- texte libre;
- absents.

---

# 72. Événements texte libre

Conserver :

```text
eventType = LEGACY_EVENT
source = LEGACY_RECA_APP
description = texte original
```

Ne pas inventer un événement précis.

---

# 73. Migration Search

Après migration d’un module :

- reconstruire son index;
- comparer résultats;
- tester permissions;
- tester adresse;
- tester téléphone;
- tester numéro;
- tester archive.

---

# 74. Migration Notifications

Les notifications historiques peuvent ne pas toutes être utiles.

Préserver prioritairement :

- incidents;
- conflits;
- actions non résolues;
- sécurité.

---

# 75. AttentionItems

Les AttentionItems doivent être recalculés depuis l’état actuel.

Ne pas migrer aveuglément un item déjà résolu.

---

# 76. Compatibilité avec `reca-operateur`

La migration doit éviter toute rupture.

Stratégie :

```text
Serveur compatible ancien payload
+ nouveau payload versionné
+ période de double support
```

---

# 77. Contrats Operator

Pour chaque version :

- schéma;
- enums;
- payload;
- transition;
- erreur;
- date de support;
- date de retrait.

---

# 78. Mission payload legacy

Le serveur peut continuer à produire l’ancien payload pour les versions anciennes de `reca-operateur`.

---

# 79. Mission payload V2

Le nouveau payload doit être activé par :

```text
operator_contracts_v1
```

ou mécanisme équivalent.

---

# 80. Déploiement Operator

Ordre :

1. déployer compatibilité serveur;
2. tester ancien Operator;
3. déployer nouveau Operator;
4. vérifier adoption;
5. mesurer;
6. retirer l’ancien contrat plus tard.

---

# 81. Double support

La période de double support doit être limitée.

Elle doit afficher :

- versions actives;
- nombre d’appareils;
- nombre de Missions;
- erreurs;
- date de retrait.

---

# 82. Migration des environnements

Environnements :

```text
Development
Staging
Production
```

Chaque environnement doit posséder :

- base distincte;
- Storage distinct;
- secrets distincts;
- URL distincte;
- logs distincts;
- feature flags distincts.

---

# 83. Staging réaliste

Le staging doit contenir :

- structure complète;
- données anonymisées ou fictives;
- Missions;
- ContractZones;
- Invoices;
- Payments;
- Operator test;
- documents de test.

---

# 84. Données de production en staging

Ne pas copier les données personnelles sans contrôle.

Préférer :

- anonymisation;
- génération;
- échantillon autorisé;
- masquage.

---

# 85. Stratégie de branches

Direction recommandée :

```text
main
staging
feature/*
migration/*
hotfix/*
```

La stratégie finale dépend du workflow Git retenu.

---

# 86. Migrations SQL

Chaque migration SQL doit :

- avoir un nom;
- avoir une description;
- être additive si possible;
- être testée;
- avoir une stratégie rollback;
- être idempotente lorsque possible;
- être reliée à un sprint.

---

# 87. Nommage des migrations

Exemple :

```text
20260806_001_add_contract_geometry_columns.sql
```

---

# 88. Backfills séparés

Les backfills importants doivent être séparés des changements de schéma.

Exemple :

```text
Migration 1
Ajouter colonnes

Migration 2
Backfill

Migration 3
Ajouter contraintes
```

---

# 89. Contraintes après backfill

Ne pas ajouter immédiatement `NOT NULL` si les données ne sont pas prêtes.

Ordre :

```text
Ajouter nullable
  ↓
Backfill
  ↓
Valider
  ↓
Ajouter contrainte
```

---

# 90. Index

Créer les index :

- après analyse;
- avant montée en charge;
- avec vérification de performance;
- sans bloquer inutilement la production.

---

# 91. Longues migrations

Une longue migration doit être :

- découpée;
- batchée;
- observable;
- interruptible;
- relançable.

---

# 92. MigrationBatch

Structure conceptuelle :

```ts
type MigrationBatch = {
  id: string
  name: string
  entityType: string
  startedAt: string
  completedAt?: string
  status: 'PLANNED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'ROLLED_BACK'
  processedCount: number
  successCount: number
  warningCount: number
  errorCount: number
}
```

---

# 93. MigrationRecord

Structure conceptuelle :

```ts
type MigrationRecord = {
  id: string
  batchId: string
  entityType: string
  legacyId: string
  newId?: string
  status: 'SUCCESS' | 'WARNING' | 'ERROR' | 'SKIPPED'
  message?: string
}
```

---

# 94. Journal de migration

Chaque migration doit produire :

- début;
- fin;
- durée;
- nombre;
- erreurs;
- warnings;
- IDs;
- version;
- acteur ou job.

---

# 95. Idempotence

Relancer un backfill ne doit pas :

- créer des doublons;
- changer un résultat valide;
- générer plusieurs documents;
- incrémenter une version inutilement.

---

# 96. Dry run

Toute migration critique doit supporter :

```text
dry-run
```

Le dry-run produit :

- compte;
- transformations;
- erreurs;
- écarts;
- aucun changement.

---

# 97. Sauvegarde avant migration

Avant chaque migration critique :

- backup base;
- backup Storage si nécessaire;
- export des tables concernées;
- validation du backup;
- point de retour documenté.

---

# 98. Rollback

Un rollback peut être :

- applicatif;
- feature flag;
- SQL;
- restauration de backup;
- désactivation de nouvelle route;
- retour à l’ancien frontend.

---

# 99. Rollback préférentiel

Direction :

```text
Feature flag
ou
route switch
```

avant restauration complète de base.

---

# 100. Quand restaurer la base

Seulement si :

- corruption;
- migration irréversible;
- perte;
- incohérence majeure;
- impossibilité de corriger.

---

# 101. Stratégie de feature flags

Feature flags recommandés :

```text
new_clients_workspace
new_quotes_workspace
new_contracts_workspace
new_measurement_editor
new_routes_workspace
new_missions_workspace
new_finance_workspace
global_search_v2
notifications_center_v2
operator_contracts_v1
```

---

# 102. Portée des feature flags

Un flag peut être :

- global;
- par organisation;
- par rôle;
- par User;
- par environnement.

---

# 103. Flag et sécurité

Un feature flag ne remplace pas une permission.

---

# 104. Bascule par module

Exemple Clients :

```text
/clients
  ↓
flag désactivé
  ↓
ancienne application

/clients
  ↓
flag activé
  ↓
RECA App V2
```

La stratégie de routing exacte dépend du déploiement.

---

# 105. Strangler pattern

Direction recommandée :

```text
Ancienne application
  ↓
Modules remplacés progressivement
  ↓
Nouvelle application
```

Chaque module peut être migré indépendamment lorsque les dépendances sont prêtes.

---

# 106. Proxy ou navigation croisée

Pendant la transition, les applications peuvent utiliser :

- liens explicites;
- sous-domaines;
- reverse proxy;
- routes distinctes.

La navigation croisée doit être visible.

Exemple :

```text
Ouvrir dans l’ancienne application
```

et non une redirection invisible.

---

# 107. Auth partagée

Les deux applications peuvent partager Supabase Auth.

Vérifier :

- domaine;
- redirect URLs;
- session;
- logout;
- refresh;
- cookies;
- Storage;
- rôle.

---

# 108. Déconnexion croisée

Une déconnexion doit idéalement fermer l’accès aux deux applications.

Le comportement doit être testé.

---

# 109. Liens temporaires legacy

Les liens vers l’ancienne application doivent :

- être étiquetés;
- être suivis;
- avoir une date de retrait;
- ne pas devenir permanents.

---

# 110. Critères de bascule d’un module

Un module peut basculer si :

- données compatibles;
- fonctions critiques complètes;
- permissions testées;
- RLS testées;
- responsive validé;
- migration validée;
- comparaison terminée;
- logs actifs;
- rollback prêt;
- utilisateurs pilotes formés.

---

# 111. Critères de retrait de l’ancien module

Un ancien module peut être retiré si :

- nouvelle version stable;
- aucune fonction manquante critique;
- données comparées;
- erreurs maîtrisées;
- adoption confirmée;
- période d’observation terminée;
- fallback inutile;
- documentation à jour.

---

# 112. Période d’observation

Direction initiale :

```text
2 à 4 semaines par module critique
```

ou au moins un cycle opérationnel complet.

Pour Missions :

```text
plusieurs événements de neige réels
```

---

# 113. Pilote

Le pilote doit utiliser :

- peu d’utilisateurs;
- données réelles contrôlées;
- module précis;
- support disponible;
- rollback rapide.

---

# 114. Utilisateurs pilotes

Exemples :

- Administrator;
- Dispatcher;
- Sales Representative;
- Accounting;
- Operator test.

---

# 115. Formation

Pour chaque module :

- guide court;
- changements;
- actions principales;
- erreurs;
- retour arrière;
- support.

---

# 116. Communication

Avant bascule :

- date;
- module;
- changement;
- impact;
- contact;
- procédure de problème.

---

# 117. Support pendant migration

Prévoir :

- canal de support;
- journal des incidents;
- réponse rapide;
- personne responsable;
- procédure de rollback.

---

# 118. Incident de migration

Catégories :

```text
DATA_MISMATCH
PERMISSION_ERROR
MISSING_FEATURE
SYNC_ERROR
DOCUMENT_ERROR
FINANCIAL_ERROR
PERFORMANCE_ERROR
UX_BLOCKER
```

---

# 119. Severity

```text
LOW
MEDIUM
HIGH
CRITICAL
```

---

# 120. Incident critique

Exemples :

- Payment incorrect;
- Mission perdue;
- Operator bloqué;
- accès non autorisé;
- document manquant;
- géométrie corrompue;
- suppression de données.

---

# 121. Réponse à incident

```text
Détecter
  ↓
Stopper
  ↓
Désactiver flag
  ↓
Revenir à ancien module
  ↓
Analyser
  ↓
Corriger
  ↓
Rejouer
  ↓
Documenter
```

---

# 122. Comparaison automatisée

Créer des scripts de comparaison pour :

- counts;
- IDs;
- statuts;
- montants;
- relations;
- géométries;
- documents;
- permissions.

---

# 123. Rapport de comparaison

Exemple :

```text
Clients legacy : 1 248
Clients V2 : 1 248
Différences : 0

Contracts legacy : 986
Contracts V2 : 986
Geometry warnings : 42
```

---

# 124. Shadow read

Une fonction V2 peut lire les données en parallèle et comparer sans être visible.

Exemple :

```text
Ancienne projection
Nouvelle projection
Diff
```

---

# 125. Shadow write

À éviter pour les données financières et opérationnelles.

Si nécessaire :

- centralisée;
- temporaire;
- observée;
- transactionnelle.

---

# 126. Read-after-write verification

Après une mutation critique :

- lire l’état;
- comparer;
- vérifier projection;
- journaliser l’écart.

---

# 127. Migration financière contrôlée

Avant bascule :

- vérifier chaque solde;
- vérifier taxes;
- vérifier documents;
- vérifier Payments;
- vérifier annulations;
- vérifier statut.

---

# 128. Migration Missions contrôlée

Avant bascule :

- créer Mission test;
- publier Operator;
- travailler hors ligne;
- synchroniser;
- résoudre problème;
- terminer;
- comparer historique.

---

# 129. Migration Géométrie contrôlée

Avant bascule :

- Contract avec une zone;
- plusieurs zones;
- entrée longue;
- zone cachée;
- géométrie migrée;
- capture;
- Mission snapshot.

---

# 130. Migration RLS contrôlée

Tester avec :

- Administrator;
- Manager;
- Dispatcher;
- Sales;
- Accounting;
- Operator assigné;
- Operator non assigné;
- User autre organisation;
- User suspendu.

---

# 131. Migration Search contrôlée

Tester :

- numéro exact;
- adresse;
- téléphone;
- accent;
- archive;
- permission;
- module désactivé.

---

# 132. Tests de non-régression

La nouvelle application doit conserver les comportements confirmés.

Exemples :

- création sur page dédiée;
- Client commercial avec entreprise obligatoire;
- téléphone Client obligatoire selon règle actuelle;
- géocodage non bloquant;
- module désactivé inaccessible;
- Operator non assigné refusé;
- historique préservé;
- Contract lié au Client;
- Invoice liée au Client.

---

# 133. Performance avant bascule

Mesurer :

- temps de chargement;
- requêtes;
- taille payload;
- latence RPC;
- carte;
- listes;
- Search;
- Dashboard;
- Operator sync.

---

# 134. Budget d’erreurs

Un module ne doit pas basculer si :

- erreurs critiques non résolues;
- incohérences données;
- permissions instables;
- rollback non testé;
- performance insuffisante.

---

# 135. Observabilité de migration

Mesurer :

- utilisateurs sur V2;
- erreurs par module;
- retour vers legacy;
- mutations échouées;
- différences de données;
- durée;
- support;
- adoption.

---

# 136. Télémétrie minimale

Événements possibles :

```text
v2_module_opened
v2_module_action_completed
v2_module_action_failed
legacy_link_opened
migration_mismatch_detected
feature_flag_disabled
```

---

# 137. Vie privée

Ne pas journaliser :

- contenu complet;
- téléphone complet;
- courriel complet;
- adresses;
- détails financiers;
- tokens;
- secrets.

---

# 138. Documentation de migration

Créer dans le dépôt :

```text
docs/migration/
  inventory.md
  status-mappings.md
  data-quality-report.md
  module-cutover-plan.md
  rollback-plan.md
  operator-compatibility.md
```

---

# 139. Memory protocol

Toutes les décisions importantes doivent être ajoutées à :

```text
memory.md
```

Toutes les actions à faire :

```text
tasks.md
```

Tous les plans :

```text
plans.md
```

Tous les fichiers :

```text
file-index.md
```

---

# 140. Responsabilités de Claude

Claude doit :

1. lire `CLAUDE.md`;
2. lire les fichiers mémoire;
3. consulter `reca-app`;
4. consulter `reca-operateur`;
5. inventorier avant de modifier;
6. proposer un plan;
7. documenter;
8. implémenter seulement dans `reca-app-v2` sauf instruction;
9. écrire les migrations additives;
10. mettre à jour la mémoire.

---

# 141. Interdictions pour Claude

Claude ne doit jamais :

- supprimer `reca-app`;
- supprimer `reca-operateur`;
- modifier un ancien dépôt sans instruction;
- appliquer une migration destructive;
- modifier une RLS réelle sans plan;
- désactiver un User réel;
- recalculer des finances sans rapport;
- inventer un mapping;
- supprimer une donnée ambiguë;
- modifier un Contrat Operator sans version.

---

# 142. Revue de code migration

Chaque PR de migration doit vérifier :

- schéma;
- backfill;
- rollback;
- tests;
- performance;
- RLS;
- idempotence;
- logs;
- documentation;
- compatibilité.

---

# 143. CI migration

La CI doit exécuter :

- lint;
- typecheck;
- tests;
- migration sur base vide;
- migration sur snapshot de test;
- tests RLS;
- tests contracts;
- build;
- détection de secrets.

---

# 144. Snapshot de base de test

Créer un snapshot anonymisé représentatif.

Il doit contenir :

- Clients;
- Contracts;
- zones;
- Routes;
- Missions;
- MissionItems;
- Employees;
- Equipment;
- Invoices;
- Payments;
- documents;
- statuts legacy.

---

# 145. Tests migration sur snapshot

Tester :

```text
État legacy
  ↓
Appliquer migrations
  ↓
Appliquer backfills
  ↓
Valider rapports
  ↓
Démarrer V2
  ↓
Comparer
```

---

# 146. Tests E2E migration Clients

```text
Client legacy
  ↓
Mapper
  ↓
Ouvrir dans V2
  ↓
Modifier
  ↓
Voir dans legacy si compatibilité requise
```

---

# 147. Tests E2E migration Contracts

```text
Contract legacy avec zones
  ↓
Backfill snow_geometry
  ↓
V2 affiche NEEDS_REVIEW
  ↓
Corriger
  ↓
Nouvelle version
```

---

# 148. Tests E2E migration Missions

```text
Mission historique
  ↓
V2 affiche snapshot
  ↓
Route actuelle modifiée
  ↓
Mission historique inchangée
```

---

# 149. Tests E2E migration Finance

```text
Invoice legacy
  ↓
Payments migrés
  ↓
Solde recalculé
  ↓
Aucune différence
```

---

# 150. Tests E2E migration Auth

```text
User legacy
  ↓
Rôle migré
  ↓
Connexion V2
  ↓
Permissions correctes
  ↓
Ancienne app encore fonctionnelle
```

---

# 151. Tests E2E migration Operator

```text
Mission créée V2
  ↓
Ancien Operator reçoit ancien payload
  ↓
Nouveau Operator reçoit nouveau payload
  ↓
Les deux fonctionnent pendant la transition
```

---

# 152. Checklists par module

Chaque module doit posséder une checklist :

```text
Inventaire terminé
Mapping terminé
Migration SQL prête
Backfill prêt
Dry-run réussi
Tests réussis
RLS validée
UI validée
Rollback testé
Pilote réussi
Bascule approuvée
Observation terminée
Legacy retiré
```

---

# 153. Definition of Ready — migration

Une migration est prête si :

- objectif clair;
- source identifiée;
- cible identifiée;
- mapping défini;
- ambiguïtés listées;
- rollback défini;
- test défini;
- owner défini.

---

# 154. Definition of Done — migration

Une migration est terminée si :

- données migrées;
- rapport sans erreur critique;
- comparaisons validées;
- tests réussis;
- monitoring actif;
- documentation mise à jour;
- support informé;
- rollback disponible;
- période d’observation complétée.

---

# 155. Bascule du shell

Première bascule possible :

- Auth;
- thème;
- navigation;
- profil;
- recherche;
- accès aux modules legacy.

---

# 156. Bascule progressive de navigation

RECA App V2 peut devenir le nouveau shell avant que tous les modules soient migrés.

Les modules non migrés peuvent ouvrir l’ancienne application avec un lien explicite.

---

# 157. Risque de shell hybride

Le shell hybride doit être temporaire.

Risques :

- confusion;
- double navigation;
- sessions;
- style différent;
- contexte perdu.

Il doit avoir une date de retrait.

---

# 158. Bascule finale

La bascule finale peut avoir lieu lorsque :

- tous les modules critiques sont V2;
- Operator compatible;
- données validées;
- finances validées;
- RLS validées;
- documents validés;
- utilisateurs formés;
- période d’observation réussie.

---

# 159. Mode lecture seule legacy

Avant retrait :

```text
reca-app
  ↓
lecture seule
```

permet de :

- consulter;
- comparer;
- récupérer;
- éviter de nouvelles divergences.

---

# 160. Passage en lecture seule

Ne doit pas être fait avant :

- couverture fonctionnelle complète;
- communications;
- tests;
- plan de secours.

---

# 161. Archivage du dépôt legacy

Après retrait :

- tag final;
- branche archive;
- README explicite;
- dépendances figées;
- secrets retirés;
- accès limité;
- sauvegarde.

---

# 162. Retrait de la base legacy

La base peut rester la même si le schéma cible l’utilise.

Le retrait concerne surtout :

- colonnes inutiles;
- vues anciennes;
- RPC anciennes;
- policies temporaires;
- tables obsolètes.

---

# 163. Contract phase DB

Pour supprimer un champ legacy :

1. confirmer aucune lecture;
2. confirmer aucune écriture;
3. confirmer aucun rapport;
4. confirmer aucun Operator;
5. confirmer aucun document;
6. déployer sans dépendance;
7. observer;
8. supprimer.

---

# 164. Retrait des feature flags

Un flag doit être retiré lorsqu’il est :

- activé pour tous;
- stable;
- sans besoin de rollback;
- documenté;
- remplacé par comportement normal.

---

# 165. Risques principaux

## 165.1 Données inconnues

Risque :

- mapping incorrect.

Réponse :

- rapport;
- révision;
- pas d’invention.

## 165.2 Double écriture

Risque :

- divergence.

Réponse :

- centralisation;
- monitoring;
- période courte.

## 165.3 RLS

Risque :

- accès trop large ou blocage.

Réponse :

- tests matriciels.

## 165.4 Finance

Risque :

- solde incorrect.

Réponse :

- comparaison transactionnelle.

## 165.5 Operator

Risque :

- Mission terrain bloquée.

Réponse :

- double support;
- tests réels;
- rollback.

## 165.6 Géométrie

Risque :

- surface ou GPS incorrect.

Réponse :

- non destructif;
- NEEDS_REVIEW;
- validation terrain.

---

# 166. Matrice de risque

| Domaine | Impact | Probabilité | Priorité |
|---|---:|---:|---:|
| Auth/RLS | Critique | Moyenne | Critique |
| Finance | Critique | Moyenne | Critique |
| Missions | Critique | Moyenne | Critique |
| Operator Sync | Critique | Moyenne | Critique |
| Géométrie | Élevé | Élevée | Critique |
| Documents | Élevé | Moyenne | Élevée |
| Search | Moyen | Moyenne | Moyenne |
| UI | Moyen | Élevée | Moyenne |

---

# 167. Stratégie de réduction des risques

- migrations additives;
- dry-run;
- backups;
- feature flags;
- pilotes;
- shadow reads;
- comparaison;
- logs;
- rollback;
- périodes d’observation;
- tests réels.

---

# 168. Ordre recommandé des sprints de migration

## Phase 0 — Préparation

- dépôt;
- docs;
- mémoire;
- CI;
- environnement;
- inventaire.

## Phase 1 — Fondation

- Auth;
- permissions;
- shell;
- design system;
- adapters.

## Phase 2 — Clients et commercial

- Leads;
- Quotes;
- Clients.

## Phase 3 — Contracts et mesure

- Contracts;
- ContractZones;
- documents;
- géométrie.

## Phase 4 — Ressources

- Employees;
- Equipment;
- affectations.

## Phase 5 — Routes et Missions

- Routes;
- Mission snapshots;
- Dispatch;
- Problems.

## Phase 6 — Operator

- contrats;
- sync;
- Devices;
- conflits.

## Phase 7 — Finance

- Invoices;
- Payments;
- soldes;
- rapports.

## Phase 8 — Search et historique

- Search;
- Notifications;
- Activity;
- Audit.

## Phase 9 — Bascule

- pilotes;
- flags;
- lecture seule legacy;
- retrait progressif.

---

# 169. Estimation et calendrier

La stratégie de migration ne doit pas promettre un calendrier avant :

- inventaire;
- volume;
- qualité des données;
- complexité Operator;
- contraintes de saison.

Les estimations doivent être produites après la Phase 0.

---

# 170. Saison de déneigement

Les changements critiques de Missions ou Operator doivent éviter :

- veille de tempête;
- Mission active;
- période de forte activité;
- absence de support.

---

# 171. Fenêtres de déploiement

Direction :

- changements administratifs hors heures critiques;
- changements Operator avant période calme;
- validation avec opérateur test;
- plan de retour immédiat.

---

# 172. Données actives pendant migration

Une migration doit distinguer :

```text
Données historiques
Données actives
Données en cours de modification
Données temps réel
```

---

# 173. Verrouillage temporaire

Pour certaines migrations critiques :

- courte fenêtre de lecture seule;
- blocage de mutation;
- message utilisateur;
- reprise contrôlée.

---

# 174. Migration sans interruption

Privilégier :

- colonnes additives;
- compatibilité;
- backfill progressif;
- aucun downtime.

---

# 175. Quand accepter une interruption

Seulement si :

- transaction critique;
- cohérence impossible autrement;
- durée courte;
- communication;
- backup;
- rollback.

---

# 176. Critères de réussite métier

La migration est réussie si :

- les utilisateurs accomplissent leur travail;
- aucune donnée métier n’est perdue;
- les Missions continuent;
- les Operators continuent;
- les Factures et Payments sont fiables;
- les documents restent accessibles;
- les historiques restent compréhensibles;
- l’ancienne application peut être retirée.

---

# 177. Critères de réussite technique

La migration doit :

- être additive;
- être observable;
- être réversible;
- être idempotente;
- être testée;
- préserver les IDs;
- préserver les relations;
- respecter RLS;
- versionner Operator;
- produire des rapports.

---

# 178. Critères de réussite UX

Les utilisateurs doivent :

- comprendre quelle application utiliser;
- retrouver leurs données;
- retrouver leurs habitudes principales;
- constater les améliorations;
- ne pas perdre le contexte;
- ne pas subir de doubles interfaces plus longtemps que nécessaire.

---

# 179. Critères de retrait de `reca-app`

`reca-app` peut être retirée lorsque :

- aucun module critique n’en dépend;
- aucune mutation n’y est nécessaire;
- les utilisateurs sont sur V2;
- les données sont validées;
- l’intégration Operator est stable;
- les documents sont accessibles;
- les finances sont validées;
- la période de lecture seule est terminée;
- l’archive est prête.

---

# 180. Hors périmètre initial

Ne pas bloquer la migration avec :

- refonte complète de tous les services externes;
- microservices;
- multi-région;
- nouvelle base séparée obligatoire;
- événementiel complet;
- data warehouse;
- BI avancée;
- remplacement immédiat de Supabase;
- application native complète;
- automatisation IA;
- réécriture simultanée de `reca-operateur`.

---

# 181. Décisions à confirmer

Avant l’implémentation finale, confirmer :

- même base ou base distincte;
- stratégie de routing hybride;
- durée de double support;
- ordre des modules;
- rôles pilotes;
- périodes d’observation;
- statut lecture seule legacy;
- stratégie Storage;
- stratégie documents;
- stratégie géométrie;
- stratégie Finance;
- stratégie Operator;
- technologie des feature flags;
- plan de backup;
- plan de rollback;
- fenêtre de déploiement;
- critères de retrait.

Toutes les décisions confirmées doivent être ajoutées à `memory.md`.

---

# 182. Règles non négociables

Ne jamais supprimer `reca-app` avant la fin de la migration.

Ne jamais modifier `reca-operateur` sans contrat versionné.

Ne jamais faire une migration big bang.

Ne jamais supprimer une colonne avant la phase Contract.

Ne jamais inventer une donnée historique.

Ne jamais fusionner automatiquement des Clients sans confirmation.

Ne jamais recalculer silencieusement une Facture émise.

Ne jamais migrer une Signed URL comme donnée permanente.

Ne jamais écraser des ContractZones existantes.

Ne jamais basculer un module sans rollback.

Ne jamais élargir une RLS pour contourner un problème.

Ne jamais appliquer une migration critique sans dry-run et backup.

Ne jamais retirer un feature flag avant stabilisation.

Ne jamais laisser le shell hybride devenir permanent.

---

# 183. Diagramme général

```text
reca-app
  ↓
Inventaire
  ↓
Adapters legacy
  ↓
Schéma additif
  ↓
Backfills
  ↓
Comparaisons
  ↓
reca-app-v2
  ↓
Pilotes
  ↓
Bascule par module
  ↓
Observation
  ↓
Legacy lecture seule
  ↓
Retrait contrôlé
```

---

# 184. Flux de migration d’un module

```text
Inventorier
  ↓
Documenter
  ↓
Mapper
  ↓
Ajouter le schéma
  ↓
Créer adapter
  ↓
Backfill
  ↓
Comparer
  ↓
Tester
  ↓
Piloter
  ↓
Basculer
  ↓
Observer
  ↓
Retirer legacy
```

---

# 185. Flux de rollback

```text
Incident détecté
  ↓
Désactiver feature flag
  ↓
Revenir à ancienne route
  ↓
Bloquer nouvelles mutations V2
  ↓
Comparer les données
  ↓
Corriger
  ↓
Rejouer si nécessaire
  ↓
Documenter
```

---

# 186. Résumé officiel

`reca-app` demeure l’application historique et la référence fonctionnelle temporaire.

`reca-app-v2` devient progressivement la nouvelle application officielle.

`reca-operateur` demeure l’application terrain.

La migration suit :

```text
Expand
Migrate
Compare
Switch
Observe
Contract
```

Les migrations sont additives, idempotentes, observables et réversibles.

Les données historiques ne sont jamais inventées.

Les identifiants, relations, documents, géométries, Missions et données financières sont préservés.

Les modules basculent un par un.

Les feature flags permettent un retour rapide.

L’ancienne application passe en lecture seule avant son retrait.

Les contrats avec RECA Opérateur sont versionnés et supportés en parallèle pendant une période contrôlée.

L’objectif est de reconstruire RECA sur une architecture solide sans interrompre les opérations, sans perdre les données et sans imposer une transition brutale aux utilisateurs.
