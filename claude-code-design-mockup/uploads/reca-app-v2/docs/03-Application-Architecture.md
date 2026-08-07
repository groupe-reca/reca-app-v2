# 03-Application-Architecture.md

# RECA
## Architecture de l’application

Version : 1.0  
Projet : RECA App V2  
Dépôt recommandé : `reca-app-v2`  
Statut : Architecture technique officielle  

---

# 1. Objectif du document

Ce document définit l’architecture technique officielle de RECA App V2.

Il traduit la vision produit et l’architecture de l’information en une structure logicielle :

- modulaire;
- compréhensible;
- testable;
- sécuritaire;
- évolutive;
- compatible avec l’existant;
- adaptée aux opérations de Groupe RECA;
- intégrée proprement à RECA Opérateur.

Il couvre notamment :

- les responsabilités de l’application;
- les frontières entre modules;
- les couches architecturales;
- la structure du dépôt;
- la direction des dépendances;
- la gestion des données;
- les services;
- les repositories;
- la gestion d’état;
- les routes;
- les permissions;
- Supabase;
- le temps réel;
- les erreurs;
- les tests;
- l’observabilité;
- la compatibilité avec l’ancienne application;
- les contrats partagés avec RECA Opérateur.

Ce document ne définit pas encore :

- le schéma détaillé de chaque table;
- les migrations finales;
- toutes les politiques RLS;
- les règles détaillées de chaque module métier;
- la stratégie complète de migration.

Ces sujets seront approfondis dans les documents suivants.

---

# 2. Principe fondamental

L’architecture doit représenter le métier.

Elle ne doit pas être organisée principalement autour de :

- pages React;
- tables Supabase;
- composants visuels;
- endpoints;
- anciens dossiers;
- écrans isolés;
- besoins temporaires.

La direction officielle est :

```text
Métier
  ↓
Cas d’utilisation
  ↓
Contrats applicatifs
  ↓
Infrastructure
  ↓
Interface
```

L’interface consomme les décisions du domaine.

Elle ne doit pas devenir l’endroit où les règles métier sont inventées.

---

# 3. Rôle de RECA App V2

RECA App V2 est le centre de commandement du système.

Elle doit permettre de :

- préparer les données;
- planifier les opérations;
- créer les routes;
- créer les missions;
- assigner les ressources;
- superviser l’exécution;
- traiter les problèmes;
- gérer les clients et contrats;
- gérer les finances;
- consulter l’historique;
- administrer le système;
- communiquer avec RECA Opérateur.

Elle ne doit pas exécuter les responsabilités terrain propres à RECA Opérateur.

---

# 4. Frontières entre les applications

## 4.1 RECA App actuelle

Projet :

```text
reca-app
```

Statut :

- référence fonctionnelle;
- source de règles existantes;
- source de schémas;
- source de migrations;
- système temporairement actif;
- application en lecture et comparaison pour Claude.

RECA App V2 ne doit jamais dépendre directement de son code à l’exécution.

Aucun import entre les deux dépôts ne doit être requis pour démarrer la nouvelle application.

---

## 4.2 RECA App V2

Projet :

```text
reca-app-v2
```

Statut :

- nouvelle application officielle;
- nouvelle architecture;
- nouvelle interface;
- nouvelle source de vérité frontend;
- système de planification et supervision.

---

## 4.3 RECA Opérateur

Projet :

```text
reca-operateur
```

Statut :

- application terrain;
- exécution locale des missions;
- GPS;
- mode hors ligne;
- synchronisation;
- événements opérationnels.

RECA App V2 ne doit pas importer directement le code React de RECA Opérateur.

Les deux applications doivent communiquer par :

- contrats de données;
- types partagés ou générés;
- événements;
- tables;
- RPC;
- API;
- conventions versionnées.

---

# 5. Architecture générale

```text
┌──────────────────────────────────────────────┐
│                Présentation                  │
│ Pages · Layouts · Composants · Formulaires  │
└─────────────────────┬────────────────────────┘
                      │
┌─────────────────────▼────────────────────────┐
│                 Application                  │
│ Cas d’utilisation · Orchestration · Queries │
│ Commands · Permissions · Navigation métier  │
└─────────────────────┬────────────────────────┘
                      │
┌─────────────────────▼────────────────────────┐
│                    Domaine                   │
│ Entités · Valeurs · Règles · Invariants     │
│ Statuts · Calculs · Décisions               │
└─────────────────────┬────────────────────────┘
                      │
┌─────────────────────▼────────────────────────┐
│                Infrastructure                │
│ Supabase · Repositories · Realtime · Storage│
│ Géocodage · Cartes · PDF · Notifications    │
└──────────────────────────────────────────────┘
```

Les dépendances doivent pointer vers le domaine, jamais l’inverse.

---

# 6. Style architectural

Le projet utilise une architecture :

```text
Feature-first
+ couches internes
+ contrats explicites
+ infrastructure remplaçable
```

Chaque module métier possède ses propres :

- types;
- schémas;
- domaine;
- cas d’utilisation;
- services;
- repositories;
- hooks;
- composants;
- pages;
- tests.

Les éléments réellement transversaux vivent dans des dossiers partagés.

---

# 7. Stack technique recommandée

La stack recommandée reprend les technologies déjà éprouvées dans l’écosystème RECA.

## 7.1 Frontend

```text
React
Vite
TypeScript strict
React Router
TanStack Query
React Hook Form
Zod
Tailwind CSS
```

## 7.2 Backend

```text
Supabase
PostgreSQL
Supabase Auth
Supabase Storage
Supabase Realtime
Edge Functions lorsque nécessaire
PostGIS lorsque nécessaire
```

## 7.3 Cartographie

```text
Mapbox GL JS
Turf.js
Sources d’imagerie configurables
```

## 7.4 Tests

```text
Vitest
Testing Library
Playwright
Tests SQL/RLS lorsque possible
```

Les versions exactes seront verrouillées au moment de l’initialisation du dépôt.

---

# 8. Critère de choix technologique

Une technologie doit être retenue seulement si elle :

- répond à un besoin réel;
- est maintenue;
- est compatible TypeScript;
- est testable;
- respecte la sécurité;
- s’intègre à l’architecture;
- ne crée pas un couplage inutile;
- ne duplique pas une capacité existante.

Le projet ne doit pas accumuler des bibliothèques pour résoudre des problèmes locaux mineurs.

---

# 9. Structure recommandée du dépôt

```text
reca-app-v2/
├── docs/
├── public/
├── src/
│   ├── app/
│   ├── routes/
│   ├── layouts/
│   ├── features/
│   ├── domain/
│   ├── infrastructure/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── config/
│   ├── styles/
│   ├── assets/
│   ├── types/
│   └── test/
├── supabase/
│   ├── functions/
│   ├── migrations/
│   ├── seed/
│   └── tests/
├── scripts/
├── tests/
│   ├── integration/
│   ├── e2e/
│   └── fixtures/
├── CLAUDE.md
├── README.md
├── tasks.md
├── plans.md
├── file-index.md
├── memory.md
├── package.json
└── vite.config.ts
```

La structure exacte pourra évoluer, mais les responsabilités doivent demeurer explicites.

---

# 10. Dossier `src/app`

Responsabilités :

- démarrage de l’application;
- providers globaux;
- configuration du routeur;
- configuration de TanStack Query;
- gestion du thème;
- gestion de la session;
- Error Boundary racine;
- initialisation de l’observabilité;
- composition des dépendances.

Exemple :

```text
src/app/
├── App.tsx
├── AppProviders.tsx
├── AppErrorBoundary.tsx
├── queryClient.ts
├── dependencies.ts
└── bootstrap.ts
```

Aucune règle métier spécifique ne doit vivre dans `src/app`.

---

# 11. Dossier `src/features`

Chaque domaine fonctionnel important possède un module.

```text
src/features/
├── dashboard/
├── leads/
├── quotes/
├── clients/
├── contracts/
├── routes/
├── missions/
├── employees/
├── equipments/
├── invoices/
├── payments/
├── search/
├── activity/
├── notifications/
├── settings/
└── auth/
```

Chaque feature peut contenir :

```text
feature/
├── domain/
├── application/
├── infrastructure/
├── components/
├── pages/
├── hooks/
├── schemas/
├── types/
├── utils/
└── tests/
```

Tous les sous-dossiers ne sont pas obligatoires.

Ils doivent exister seulement lorsqu’ils représentent une responsabilité réelle.

---

# 12. Modules métier officiels

## 12.1 Dashboard

Responsabilités :

- vue consolidée;
- opérations du jour;
- à traiter;
- alertes;
- activité;
- progression;
- raccourcis.

Le Dashboard ne possède pas les règles métier des autres modules.

Il orchestre des projections de lecture provenant de plusieurs modules.

---

## 12.2 Leads

Responsabilités :

- acquisition;
- qualification;
- statuts;
- rappels;
- notes;
- conversion vers Soumission.

---

## 12.3 Soumissions

Responsabilités :

- proposition;
- prix;
- échéance;
- statut;
- conversion vers Client ou Contrat selon le flux validé.

---

## 12.4 Clients

Responsabilités :

- identité;
- coordonnées;
- adresses;
- type résidentiel ou commercial;
- relations;
- notes;
- historique;
- contrats;
- factures.

---

## 12.5 Contrats

Responsabilités :

- engagement;
- services;
- zones;
- géométrie;
- clauses;
- modalités;
- échéancier;
- documents;
- informations terrain;
- versionnement.

---

## 12.6 Routes

Responsabilités :

- modèle permanent;
- ordre des contrats;
- affectations par défaut;
- secteurs;
- préparation des missions.

---

## 12.7 Missions

Responsabilités :

- événement réel;
- MissionItems;
- affectations;
- progression;
- problèmes;
- supervision;
- historique;
- synchronisation opérateur.

---

## 12.8 Employés

Responsabilités :

- identité;
- rôle;
- disponibilité;
- compétences;
- relation avec un compte;
- affectations.

---

## 12.9 Équipements

Responsabilités :

- inventaire opérationnel;
- type;
- statut;
- disponibilité;
- affectations;
- historique d’utilisation;
- informations nécessaires aux missions.

---

## 12.10 Factures

Responsabilités :

- création;
- statut;
- échéance;
- taxes;
- solde;
- relation avec Client et Contrat.

---

## 12.11 Paiements

Responsabilités :

- enregistrement;
- annulation;
- application aux factures;
- recalcul des soldes;
- historique.

---

## 12.12 Paramètres

Responsabilités :

- organisation;
- modules;
- valeurs par défaut;
- taxes;
- préférences;
- intégrations;
- sécurité administrative.

---

# 13. Direction des dépendances

La direction générale est :

```text
Présentation
      ↓
Application
      ↓
Domaine
```

L’infrastructure implémente les contrats demandés par l’application et le domaine.

```text
Application
      ↓
Port / Interface
      ↑
Repository Supabase
```

Le domaine ne doit jamais importer :

- React;
- React Router;
- TanStack Query;
- Supabase;
- Mapbox;
- Tailwind;
- navigateur;
- Storage;
- API externe.

---

# 14. Dépendances entre modules

Les dépendances métier doivent suivre une direction contrôlée.

```text
Leads
  ↓
Soumissions
  ↓
Clients
  ↓
Contrats
  ↓
Routes
  ↓
Missions
```

Les modules en aval peuvent référencer les identifiants ou contrats publics des modules en amont.

Ils ne doivent pas importer leurs composants internes arbitrairement.

---

# 15. API publique d’un module

Chaque module doit exposer une surface publique limitée.

Exemple :

```text
src/features/contracts/index.ts
```

Peut exporter :

- types publics;
- composants explicitement réutilisables;
- hooks publics;
- routes;
- ports;
- cas d’utilisation publics.

Les autres modules ne doivent pas importer profondément :

```ts
import { something } from '@/features/contracts/components/internal/...'
```

Ils doivent utiliser :

```ts
import { ContractStatusBadge } from '@/features/contracts'
```

Cette règle réduit le couplage et facilite les refontes.

---

# 16. Domaine partagé

Certains concepts sont réellement transversaux.

Ils peuvent vivre dans :

```text
src/domain/
```

Exemples :

- identifiants;
- date et heure;
- argent;
- adresse;
- coordonnées;
- géométrie;
- organisation;
- utilisateur;
- rôle;
- événement;
- pagination;
- résultat;
- erreurs.

Le domaine partagé doit rester petit.

Il ne doit pas devenir un dossier où tout est placé faute de décision.

---

# 17. Entités et Value Objects

Les entités importantes doivent utiliser des types explicites.

Exemple :

```ts
type MissionId = string

type MissionStatus =
  | 'PLANNED'
  | 'READY'
  | 'IN_PROGRESS'
  | 'PAUSED'
  | 'COMPLETED'
  | 'CANCELLED'
```

Les concepts complexes peuvent devenir des Value Objects :

```text
Money
PhoneNumber
EmailAddress
PostalAddress
GeoPoint
SnowRemovalGeometry
DateRange
Percentage
```

Les Value Objects doivent :

- valider leur structure;
- centraliser leurs règles;
- réduire les chaînes libres;
- être sérialisables lorsque nécessaire.

---

# 18. Statuts

Les statuts sont des contrats métier.

Ils ne doivent pas être inventés directement dans un composant.

Chaque statut doit posséder :

- valeur stable;
- libellé français;
- catégorie visuelle;
- transitions permises;
- permissions;
- signification documentée.

Exemple :

```ts
const missionStatusMeta = {
  PLANNED: {
    label: 'Planifiée',
    tone: 'neutral',
  },
  IN_PROGRESS: {
    label: 'En cours',
    tone: 'success',
  },
}
```

La métadonnée visuelle ne remplace pas les règles de transition.

---

# 19. Couche Domaine

La couche Domaine contient :

- entités;
- types métier;
- invariants;
- fonctions pures;
- calculs;
- politiques;
- transitions;
- erreurs métier.

Exemples :

```text
calculateMissionProgress()
canAssignEquipment()
canCreateMissionFromRoute()
deriveContractReadiness()
calculateInvoiceBalance()
validateSnowRemovalGeometry()
```

Cette couche doit être testable sans navigateur ni Supabase.

---

# 20. Couche Application

La couche Application orchestre les cas d’utilisation.

Exemples :

```text
CreateClient
CreateContract
CreateMissionFromRoute
AssignOperatorToMission
ResolveMissionProblem
RecordPayment
ArchiveClient
```

Un cas d’utilisation peut :

- charger des données;
- vérifier des permissions;
- appeler le domaine;
- exécuter une transaction;
- publier des événements;
- invalider des lectures;
- produire un résultat.

Il ne doit pas rendre de JSX.

---

# 21. Commands et Queries

L’application distingue conceptuellement :

```text
Command
Modifie l’état

Query
Lit une projection
```

Exemples de Commands :

```text
CreateMission
AssignEquipment
UpdateContractGeometry
RecordPayment
CancelInvoice
```

Exemples de Queries :

```text
GetOperationsDashboard
ListActiveMissions
GetClientDetail
SearchGlobalEntities
```

Cette distinction ne nécessite pas obligatoirement une infrastructure CQRS complexe.

Elle sert d’abord à clarifier les responsabilités.

---

# 22. Résultat des cas d’utilisation

Les cas d’utilisation ne doivent pas signaler toutes les erreurs uniquement par exceptions génériques.

Structure recommandée :

```ts
type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E }
```

Exemple :

```ts
type AssignEquipmentError =
  | { code: 'MISSION_NOT_FOUND' }
  | { code: 'EQUIPMENT_UNAVAILABLE' }
  | { code: 'FORBIDDEN' }
```

Les erreurs inattendues demeurent des exceptions techniques.

---

# 23. Ports et adapters

Les dépendances externes doivent être décrites par des interfaces.

Exemple :

```ts
interface MissionRepository {
  getById(id: MissionId): Promise<Mission | null>
  save(mission: Mission): Promise<void>
}
```

Implémentation :

```text
SupabaseMissionRepository
```

Autres ports possibles :

- Clock;
- IdGenerator;
- FileStorage;
- GeocodingService;
- MapSnapshotService;
- NotificationPublisher;
- AuditLogger;
- OperatorGateway.

---

# 24. Repositories

Les repositories représentent l’accès aux données métier.

Ils doivent :

- cacher les détails Supabase;
- convertir les lignes DB en modèles;
- valider les résultats;
- appliquer les filtres de suppression logique;
- centraliser les sélections;
- gérer les erreurs techniques;
- exposer des méthodes orientées métier.

Interdit dans un composant :

```ts
supabase.from('missions').select('*')
```

Recommandé :

```ts
missionRepository.listActiveForDate(date)
```

---

# 25. Services Supabase

Les services Supabase doivent être isolés dans l’infrastructure.

Exemple :

```text
src/infrastructure/supabase/
├── client.ts
├── auth/
├── repositories/
├── realtime/
├── storage/
├── rpc/
└── mappers/
```

Le client Supabase ne doit pas être importé directement dans les pages.

---

# 26. Mappers

La base de données utilise souvent :

```text
snake_case
```

Le code TypeScript utilise :

```text
camelCase
```

La conversion doit être centralisée.

Exemple :

```ts
function mapMissionRow(row: MissionRow): Mission
```

Les mappers doivent aussi :

- normaliser les valeurs nulles;
- convertir les dates;
- construire les références;
- appliquer les valeurs par défaut légitimes;
- refuser les données invalides.

Ils ne doivent pas cacher silencieusement une corruption importante.

---

# 27. Validation aux frontières

Toute donnée externe doit être validée.

Sources :

- Supabase;
- formulaires;
- query params;
- localStorage;
- URL;
- Edge Functions;
- Realtime;
- fichiers;
- services externes;
- ancien schéma.

Zod peut être utilisé pour valider :

- lignes;
- DTO;
- formulaires;
- configurations;
- réponses API.

Le typage TypeScript seul ne valide aucune donnée à l’exécution.

---

# 28. DTO et modèles du domaine

Les lignes de base de données ne doivent pas devenir automatiquement les modèles utilisés partout dans l’application.

Exemple :

```text
MissionRow
Structure Supabase

MissionDto
Contrat d’échange

Mission
Modèle métier

MissionViewModel
Projection pour l’interface
```

Toutes ces couches ne sont pas obligatoires pour chaque entité simple.

Elles doivent être introduites lorsqu’elles réduisent réellement le couplage.

---

# 29. Gestion d’état

Le projet distingue quatre catégories d’état.

## 29.1 État serveur

Géré principalement avec TanStack Query.

Exemples :

- clients;
- missions;
- contrats;
- factures;
- routes.

---

## 29.2 État de formulaire

Géré avec React Hook Form et Zod.

---

## 29.3 État local d’interface

Géré avec `useState`, `useReducer` ou hooks spécialisés.

Exemples :

- onglet actif;
- drawer;
- filtre local non partagé;
- sélection visuelle.

---

## 29.4 État applicatif transversal

Utilisé seulement lorsque nécessaire.

Exemples :

- session;
- organisation active;
- thème;
- permissions résolues;
- préférences;
- centre de commandes.

Le projet ne doit pas créer un store global contenant toutes les données métier.

---

# 30. TanStack Query

TanStack Query est la couche officielle de gestion des données serveur côté client.

Chaque module doit définir des clés structurées.

Exemple :

```ts
const missionKeys = {
  all: ['missions'] as const,
  lists: () => [...missionKeys.all, 'list'] as const,
  list: (filters: MissionFilters) =>
    [...missionKeys.lists(), filters] as const,
  detail: (id: string) =>
    [...missionKeys.all, 'detail', id] as const,
}
```

Les mutations doivent invalider ou mettre à jour uniquement les projections concernées.

---

# 31. Optimistic updates

Les mises à jour optimistes sont permises seulement lorsque :

- l’action est facilement réversible;
- le risque de conflit est faible;
- l’utilisateur bénéficie réellement de l’immédiateté;
- l’état précédent est conservé;
- un rollback est prévu.

Exemples possibles :

- réorganisation visuelle;
- favori;
- préférence;
- certains changements de statut simples.

Exemples à éviter sans garanties supplémentaires :

- paiement;
- suppression;
- finalisation de contrat;
- création de mission;
- modification de géométrie;
- opération financière.

---

# 32. Formulaires

Tous les formulaires métier doivent :

- utiliser un schéma;
- afficher les erreurs par champ;
- afficher les erreurs globales;
- préserver les données lors d’une erreur;
- protéger contre la double soumission;
- distinguer création et édition;
- documenter les valeurs par défaut.

Les formulaires complexes utilisent :

- étapes;
- sections;
- onglets;
- résumé;
- sauvegarde de brouillon lorsque justifiée.

---

# 33. Navigation et routeur

React Router est responsable de :

- hiérarchie des routes;
- layouts;
- breadcrumbs;
- guards;
- données de route;
- erreurs de route;
- liens profonds;
- navigation après mutation.

La route doit représenter l’entité réelle.

Exemples :

```text
/operations
/missions
/missions/:missionId
/routes/:routeId
/clients/:clientId
/contracts/:contractId
```

---

# 34. Métadonnées de route

Chaque route peut déclarer :

- titre;
- breadcrumb;
- module;
- permission;
- navigation mobile;
- layout;
- mode immersif;
- action principale;
- contexte.

Exemple conceptuel :

```ts
{
  path: 'missions/:missionId',
  handle: {
    module: 'missions',
    breadcrumb: 'Mission',
    permission: 'mission.read',
  },
}
```

Le routeur ne doit pas devenir un endroit où toute la logique métier est codée.

---

# 35. Layouts

Layouts principaux :

```text
PublicLayout
DesktopAppLayout
MobileAppLayout
TabletAppLayout
FullscreenFlowLayout
PrintLayout
```

Les pages ne doivent pas recréer leur propre navigation principale.

Les layouts contrôlent :

- sidebar;
- header;
- navigation mobile;
- largeur;
- safe areas;
- scroll;
- surfaces globales.

---

# 36. Pages

Une page doit principalement :

- lire les paramètres de route;
- appeler les hooks applicatifs;
- gérer les états de chargement;
- composer les composants;
- brancher les actions;
- gérer la navigation.

Une page ne doit pas :

- contenir les requêtes Supabase brutes;
- calculer les règles métier;
- dupliquer les mappers;
- construire des transactions;
- inventer des permissions.

---

# 37. Composants

Catégories :

## 37.1 Composants du Design System

```text
Button
Input
Select
Card
Badge
Modal
BottomSheet
Table
Tabs
```

## 37.2 Composants de layout

```text
PageHeader
EntityHeader
ModuleShell
ListToolbar
DetailTabsShell
```

## 37.3 Composants métier

```text
MissionProgressCard
ContractGeometryPreview
RouteAssignmentPanel
InvoiceBalanceSummary
```

Un composant métier appartient à son module.

---

# 38. Hooks

Les hooks sont divisés selon leur rôle.

## Hooks de données

```text
useMission()
useMissions()
useCreateMission()
```

## Hooks d’interface

```text
useBreakpoint()
useDisclosure()
useKeyboardShortcut()
```

## Hooks d’orchestration

```text
useContractWizard()
useMissionDispatch()
```

Un hook ne doit pas cacher une dépendance métier importante sous un nom générique.

---

# 39. Permissions

Les permissions doivent être vérifiées à plusieurs niveaux.

```text
Interface
Route
Cas d’utilisation
Base de données / RLS
```

Masquer un bouton n’est pas une sécurité.

Exemple :

```text
mission.update
route.manage
invoice.record_payment
settings.manage_users
```

Les rôles regroupent des permissions.

Le code ne doit pas multiplier les comparaisons directes :

```ts
user.role === 'administrateur'
```

lorsqu’une permission explicite est plus appropriée.

---

# 40. Organisation active

L’architecture doit être compatible avec une organisation active, même si Groupe RECA est la première organisation.

Toute donnée métier importante doit être associée explicitement ou implicitement à une organisation.

Le contexte d’organisation doit être résolu avant les requêtes métier.

Les services ne doivent pas accepter aveuglément un `organizationId` fourni par l’interface sans validation de session.

---

# 41. Authentification

L’authentification repose sur Supabase Auth.

L’application doit distinguer :

- identité Auth;
- profil utilisateur;
- employé;
- opérateur;
- rôle;
- permissions;
- organisation.

Ces concepts ne doivent pas être fusionnés dans une seule table ou un seul type sans justification.

---

# 42. Session

La session applicative doit exposer une projection stable.

Exemple :

```ts
type AppSession = {
  authUserId: string
  userId: string
  organizationId: string
  displayName: string
  roles: string[]
  permissions: string[]
  theme: 'light' | 'dark' | 'system'
}
```

La session ne doit pas transporter toutes les données d’employé ou d’organisation.

---

# 43. Supabase RLS

RLS demeure une protection obligatoire.

Chaque table doit définir explicitement :

- lecture;
- insertion;
- modification;
- suppression ou archivage;
- restrictions par organisation;
- restrictions par rôle;
- restrictions par affectation.

Les politiques doivent être testées avec plusieurs profils.

---

# 44. Soft delete

La suppression logique est recommandée pour les entités métier importantes.

Exemples :

- clients;
- contrats;
- routes;
- factures;
- équipements;
- employés.

Champs possibles :

```text
deleted_at
deleted_by
archive_reason
```

L’interface doit utiliser les termes appropriés :

- Archiver;
- Annuler;
- Désactiver;
- Supprimer définitivement.

Ces actions ne sont pas équivalentes.

---

# 45. Transactions

Les opérations multi-étapes critiques doivent être atomiques.

Exemples :

```text
Créer un contrat
+ créer ses zones
+ générer son échéancier
```

```text
Créer une mission
+ copier les MissionItems
+ figer les géométries
+ enregistrer les affectations
```

```text
Enregistrer un paiement
+ recalculer le solde
+ mettre à jour le statut
```

Ces opérations doivent utiliser selon le cas :

- fonction PostgreSQL;
- RPC;
- transaction serveur;
- Edge Function;
- procédure contrôlée.

Elles ne doivent pas être simulées par une série fragile de mutations indépendantes côté navigateur.

---

# 46. Événements métier

Les événements importants doivent être représentés explicitement.

Exemples :

```text
ClientCreated
ContractActivated
ContractGeometryUpdated
RouteReordered
MissionCreated
MissionStarted
MissionProblemReported
PaymentRecorded
```

Un événement peut servir à :

- journaliser;
- notifier;
- actualiser le Dashboard;
- déclencher une intégration;
- synchroniser RECA Opérateur;
- produire une statistique.

Le projet n’a pas besoin d’un bus distribué complexe pour commencer.

Une table d’événements et des points d’écriture contrôlés peuvent suffire.

---

# 47. Audit et historique

Les événements d’audit doivent contenir selon le besoin :

- organisation;
- acteur;
- type;
- entité;
- identifiant;
- date originale;
- source;
- payload minimal;
- corrélation;
- version.

Ils ne doivent pas contenir inutilement :

- secrets;
- jetons;
- données sensibles complètes;
- captures massives.

---

# 48. Realtime

Supabase Realtime peut être utilisé pour :

- progression de mission;
- problèmes;
- changements de statut;
- synchronisation;
- activité;
- affectations.

Realtime ne doit pas devenir la seule source de vérité.

Flux recommandé :

```text
Événement Realtime
      ↓
Identifier l’entité affectée
      ↓
Mettre à jour ou invalider la query
      ↓
Relire l’état autoritatif
```

Une connexion Realtime interrompue ne doit pas figer silencieusement l’interface.

---

# 49. Indicateur de fraîcheur

Les écrans opérationnels doivent pouvoir afficher :

- dernière mise à jour;
- état en direct;
- connexion interrompue;
- opérateur hors ligne;
- opérations en attente;
- donnée potentiellement périmée.

L’interface ne doit pas afficher « en temps réel » lorsque la dernière donnée date de plusieurs minutes.

---

# 50. Intégration avec RECA Opérateur

L’intégration doit être explicitement versionnée.

Contrats principaux :

```text
Mission
MissionItem
MissionStatus
MissionItemStatus
Operator
Equipment
Problem
Alert
StateTransition
SynchronizationStatus
SnowRemovalGeometry
```

La compatibilité doit être assurée par :

- types partagés;
- schéma généré;
- validation;
- version;
- tests de contrat.

---

# 51. Paquet partagé

Deux options sont permises.

## Option A — Package partagé

```text
@reca/contracts
```

Contient :

- types d’échange;
- enums stables;
- schémas Zod;
- codes d’erreur;
- versions.

## Option B — Génération

Les types sont générés à partir :

- SQL;
- OpenAPI;
- JSON Schema;
- contrats versionnés.

Le choix final sera effectué après analyse des deux dépôts.

Il est interdit de copier manuellement les mêmes enums dans deux applications sans contrôle de divergence.

---

# 52. Anti-corruption layer

L’ancienne base et l’ancien code peuvent contenir :

- noms historiques;
- statuts hérités;
- champs ambigus;
- conventions différentes.

RECA App V2 doit utiliser une couche d’adaptation.

Exemple :

```text
Ancien statut DB : en_attente
      ↓
LegacyContractMapper
      ↓
Nouveau concept : SIGNATURE_PENDING
```

Cette couche évite de contaminer toute la nouvelle application avec les anciens détails.

---

# 53. Compatibilité avec l’ancienne base

La nouvelle application peut utiliser la même base Supabase pendant la migration.

Elle doit cependant :

- encapsuler les tables existantes;
- documenter les champs hérités;
- ajouter des vues ou RPC lorsque utile;
- utiliser des migrations additives;
- prévoir les nouveaux contrats;
- éviter les changements destructifs prématurés.

La migration complète sera détaillée dans `15-Migration-Strategy.md`.

---

# 54. Feature flags

Les fonctionnalités importantes peuvent être activées progressivement.

Exemples :

```text
new_operations_dashboard
new_contract_editor
new_route_dispatch
new_global_search
```

Les feature flags doivent être :

- centralisés;
- typés;
- associés à l’organisation;
- documentés;
- retirés après stabilisation.

Ils ne doivent pas devenir une accumulation permanente de branches mortes.

---

# 55. Configuration

La configuration doit être centralisée.

Exemple :

```text
src/config/
├── env.ts
├── features.ts
├── routes.ts
├── modules.ts
└── defaults.ts
```

Les variables d’environnement doivent être validées au démarrage.

Exemples :

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_MAPBOX_TOKEN
VITE_APP_ENV
```

Aucun secret serveur ne doit être exposé dans une variable `VITE_*`.

---

# 56. Services externes

Tout service externe doit posséder un adapter.

Exemples :

- Mapbox;
- MapTiler;
- géocodage;
- génération PDF;
- courriel;
- IA;
- stockage;
- notifications.

Un changement de fournisseur ne doit pas nécessiter de réécrire les pages métier.

---

# 57. Cartographie

Les composants cartographiques doivent être isolés.

Architecture recommandée :

```text
Map Engine / adapter
      ↓
Layers
      ↓
Sources
      ↓
Contrôles
      ↓
Composants métier
```

La carte ne doit pas décider :

- si une mission peut commencer;
- si une route est valide;
- si un contrat est actif;
- si une géométrie peut être sauvegardée.

Elle affiche et capture des interactions.

Le domaine décide.

---

# 58. Géométrie

Les géométries doivent utiliser un contrat officiel.

Exemples :

```text
GeoJSON Polygon
GeoJSON MultiPolygon
GeoPoint
BoundingBox
```

Les calculs doivent être centralisés :

- surface;
- union;
- buffer;
- simplification;
- validation;
- proximité;
- centre;
- bounds.

Les unités doivent être explicites.

---

# 59. Fichiers et Storage

Les fichiers doivent être référencés par métadonnées.

Exemples :

- chemin Storage;
- bucket;
- type;
- taille;
- propriétaire;
- organisation;
- date;
- version.

Le code ne doit pas conserver des URL signées comme données permanentes.

Les URL signées sont temporaires et doivent être générées à la demande.

---

# 60. Documents et PDF

La génération de documents doit séparer :

```text
Données du document
Template
Rendu HTML
Rendu PDF
Stockage
Historique
```

Les composants d’interface ne doivent pas être utilisés directement comme unique moteur PDF sans contrat clair.

Le document historique doit pouvoir conserver la version générée.

---

# 61. Recherche globale

La recherche globale doit utiliser un service dédié.

Exemple :

```ts
interface GlobalSearchService {
  search(query: string, context: SearchContext): Promise<SearchResult[]>
}
```

La V1 peut utiliser :

- recherche PostgreSQL;
- RPC;
- vues;
- trigrammes;
- index spécialisés.

Le composant de recherche ne doit pas interroger chaque table directement.

---

# 62. Dashboard et projections

Le Dashboard doit consommer des projections optimisées.

Il ne doit pas lancer des dizaines de requêtes indépendantes non coordonnées pour reconstruire l’état du système.

Options :

- RPC;
- vues SQL;
- fonctions;
- endpoints agrégés;
- requêtes parallèles contrôlées.

Les projections doivent préciser leur fraîcheur.

---

# 63. Notifications

Les notifications doivent être produites à partir d’événements ou de règles explicites.

Catégories possibles :

- opérationnelle;
- commerciale;
- financière;
- système;
- sécurité.

Elles doivent posséder :

- type;
- priorité;
- destination;
- statut;
- lien;
- date;
- expiration;
- déduplication.

---

# 64. Erreurs

Les erreurs sont séparées en catégories.

## Erreur métier

Exemple :

```text
Équipement indisponible
```

## Erreur de validation

Exemple :

```text
La date de fin précède la date de début
```

## Erreur d’autorisation

Exemple :

```text
Permission insuffisante
```

## Erreur technique

Exemple :

```text
Supabase indisponible
```

## Erreur inattendue

Exemple :

```text
État impossible non prévu
```

Chaque catégorie possède un traitement approprié.

---

# 65. Codes d’erreur

Les erreurs importantes utilisent des codes stables.

Exemples :

```text
MISSION_EQUIPMENT_UNAVAILABLE
CONTRACT_GEOMETRY_INVALID
PAYMENT_EXCEEDS_BALANCE
FORBIDDEN
LOCAL_CONFIGURATION_INVALID
```

L’interface peut traduire un code en message français.

La logique ne doit pas dépendre du texte affiché.

---

# 66. Error Boundaries

Prévoir :

- Error Boundary racine;
- Error Boundary par grande route lorsque pertinent;
- fallback cartographique;
- fallback pour les widgets opérationnels;
- rapport d’erreur;
- possibilité de réessayer.

Une erreur Mapbox ne doit pas faire disparaître toute l’application.

---

# 67. Logs

Les logs doivent être structurés.

Champs possibles :

- environnement;
- module;
- événement;
- niveau;
- utilisateur;
- organisation;
- entité;
- corrélation;
- durée;
- code d’erreur.

Ne jamais journaliser :

- mot de passe;
- jeton;
- clé;
- informations sensibles inutiles;
- contenu complet de documents privés.

---

# 68. Corrélation

Les opérations complexes doivent posséder un identifiant de corrélation.

Exemple :

```text
CreateMission
      ↓
Mission
MissionItems
Events
Notifications
```

Tous les logs peuvent partager :

```text
correlationId
```

Cela facilite l’analyse d’un incident.

---

# 69. Performance

Les objectifs principaux :

- chargement initial rapide;
- navigation immédiate;
- listes fluides;
- carte stable;
- requêtes contrôlées;
- faible duplication;
- cache pertinent.

Mesures :

- route-level code splitting;
- lazy loading;
- pagination;
- virtualisation lorsque nécessaire;
- sélection minimale;
- mémorisation raisonnée;
- préchargement des routes probables.

---

# 70. Code splitting

Les grands modules doivent être chargés par route.

Exemples :

- contrats;
- cartes;
- missions;
- rapports;
- paramètres.

Les composants essentiels du shell restent disponibles immédiatement.

---

# 71. Listes importantes

Les listes volumineuses doivent utiliser :

- pagination serveur;
- filtres serveur;
- tri serveur;
- recherche debouncée;
- cache;
- éventuellement virtualisation.

Le navigateur ne doit pas charger des milliers d’entités uniquement pour les filtrer localement.

---

# 72. Accessibilité architecturale

L’accessibilité ne dépend pas seulement du CSS.

L’architecture doit permettre :

- navigation clavier;
- focus restauré après navigation;
- titres de page;
- landmarks;
- annonces d’erreur;
- modals avec focus trap;
- composants sémantiques;
- actions accessibles sans souris.

---

# 73. Internationalisation

La première langue est le français canadien.

Les chaînes d’interface doivent être centralisées suffisamment pour permettre :

- cohérence;
- correction;
- traduction future;
- formatage local.

Le code utilise des identifiants anglais.

L’interface utilise le français.

---

# 74. Dates et fuseaux horaires

Les dates doivent distinguer :

- date métier locale;
- instant UTC;
- fuseau de l’organisation;
- heure affichée;
- date originale d’un événement terrain.

Les timestamps sont stockés en UTC lorsque ce sont des instants.

Les dates de saison ou d’échéance peuvent être des dates sans heure.

---

# 75. Argent

Les montants doivent utiliser une représentation sûre.

Éviter les calculs financiers approximatifs avec des flottants sans convention.

Privilégier :

- cents entiers;
- type Money;
- calculs centralisés;
- arrondi documenté;
- taxes configurées.

---

# 76. Tests unitaires

Priorité :

- domaine;
- calculs;
- permissions;
- transitions;
- taxes;
- soldes;
- géométrie;
- projections;
- mappers.

Les fonctions pures doivent être faciles à tester.

---

# 77. Tests d’intégration

Couvrir :

- repositories;
- RPC;
- mappers;
- Supabase;
- RLS;
- Storage;
- Realtime;
- cas d’utilisation critiques.

Les tests ne doivent pas dépendre uniquement de mocks lorsque la vraie intégration constitue le risque principal.

---

# 78. Tests composants

Couvrir :

- états;
- interactions;
- accessibilité;
- validation;
- permissions visuelles;
- erreurs;
- chargement.

---

# 79. Tests end-to-end

Scénarios prioritaires :

```text
Lead → Soumission → Client → Contrat
Contrat → Route → Mission
Mission → RECA Opérateur → Progression
Facture → Paiement → Solde
Modification de zone → nouvelle mission figée
```

Les scénarios E2E doivent créer et nettoyer leurs données de test.

---

# 80. Tests de contrat entre applications

Créer des tests qui vérifient que :

- RECA App V2 produit un payload valide;
- RECA Opérateur peut le lire;
- les statuts sont compatibles;
- les champs obligatoires existent;
- les versions sont supportées;
- les événements remontent correctement.

---

# 81. Environnements

Prévoir :

```text
development
test
staging
production
```

Les environnements doivent avoir :

- configurations distinctes;
- clés distinctes;
- données distinctes;
- logs distincts;
- intégrations contrôlées.

Le développement ne doit pas dépendre en permanence de la base de production.

---

# 82. CI

Chaque contribution doit pouvoir exécuter :

```text
format
lint
typecheck
unit tests
integration tests ciblés
build
```

Les branches importantes peuvent aussi exécuter :

- tests E2E;
- tests RLS;
- analyse de bundle;
- vérification de migrations.

---

# 83. Déploiement

Le déploiement doit être reproductible.

Flux recommandé :

```text
Pull Request
      ↓
CI
      ↓
Preview
      ↓
Staging
      ↓
Validation
      ↓
Production
```

Une migration et un frontend incompatible ne doivent pas être déployés dans le mauvais ordre.

---

# 84. Migrations compatibles

Les migrations doivent suivre, lorsque possible :

```text
Expand
      ↓
Migrate
      ↓
Switch
      ↓
Contract
```

Exemple :

1. ajouter une nouvelle colonne;
2. remplir les données;
3. déployer le nouveau code;
4. vérifier;
5. retirer l’ancien champ plus tard.

---

# 85. Récupération

Prévoir des procédures pour :

- migration échouée;
- déploiement frontend cassé;
- fournisseur externe indisponible;
- donnée invalide;
- événement Realtime perdu;
- intégration opérateur retardée.

La récupération doit être documentée.

---

# 86. Système de mémoire

Le projet maintient obligatoirement :

```text
tasks.md
plans.md
file-index.md
memory.md
```

Ces fichiers font partie de l’architecture de développement.

Ils ne sont pas facultatifs.

---

# 87. Accès aux projets de référence

Claude possède accès à :

```text
reca-app
reca-operateur
```

Avant de concevoir ou modifier un module important, Claude doit :

1. lire la mémoire de RECA App V2;
2. lire la documentation concernée;
3. consulter `file-index.md`;
4. consulter le module équivalent dans `reca-app`;
5. consulter le contrat correspondant dans `reca-operateur` si nécessaire;
6. identifier ce qui doit être conservé;
7. identifier ce qui ne doit pas être copié;
8. documenter la décision.

---

# 88. Interdiction de modification implicite des anciens projets

Par défaut, le travail sur RECA App V2 ne doit pas modifier :

```text
reca-app
reca-operateur
```

Une modification externe exige :

- une demande explicite;
- un plan;
- une analyse d’impact;
- une mise à jour de la documentation des deux projets;
- des tests de compatibilité.

---

# 89. Composition des dépendances

Les adapters concrets doivent être assemblés dans un endroit central.

Exemple :

```ts
export const dependencies = {
  missionRepository: new SupabaseMissionRepository(),
  clock: new SystemClock(),
  idGenerator: new CryptoIdGenerator(),
}
```

Les cas d’utilisation reçoivent leurs dépendances.

Cette approche facilite :

- tests;
- remplacement;
- simulation;
- staging;
- évolution.

---

# 90. Horloge

Les règles temporelles utilisent une abstraction.

```ts
interface Clock {
  now(): Date
}
```

Cela permet de tester :

- échéances;
- saisons;
- durées;
- activités;
- délais;
- expiration;
- progression.

---

# 91. Génération d’identifiants

Les identifiants techniques et visibles sont distincts.

```text
UUID interne
Numéro humain lisible
```

Exemples :

```text
CTR-000056
FAC-000081
MIS-2026-0009
```

La génération doit être centralisée et sécurisée contre les doublons.

---

# 92. Numéros visibles

Les numéros visibles ne doivent pas servir comme seules clés relationnelles.

Ils peuvent être modifiés ou reformatés.

Les relations utilisent les identifiants techniques stables.

---

# 93. Conventions de mutations

Une mutation suit le flux :

```text
Action utilisateur
      ↓
Validation locale
      ↓
Permission
      ↓
Cas d’utilisation
      ↓
Transaction
      ↓
Événement
      ↓
Mise à jour des projections
      ↓
Confirmation
```

L’interface ne doit pas afficher un succès avant que l’état autoritatif soit confirmé, sauf stratégie optimiste explicite.

---

# 94. Confirmations

Les confirmations sont requises pour :

- annulation;
- archivage important;
- suppression;
- paiement;
- finalisation;
- modification irréversible;
- remplacement de géométrie;
- fermeture de mission.

Les confirmations ne doivent pas être utilisées pour chaque petite action.

---

# 95. Command Palette

La Command Palette doit utiliser des commandes enregistrées.

Exemple :

```ts
type AppCommand = {
  id: string
  label: string
  permission?: Permission
  execute(): void
}
```

Les modules peuvent déclarer leurs propres commandes.

La palette centrale les agrège.

---

# 96. Navigation après mutation

Les cas d’utilisation peuvent retourner une destination recommandée.

Exemples :

```text
Créer Client
      ↓
Fiche Client
```

```text
Créer Mission
      ↓
Fiche Mission
```

```text
Enregistrer paiement
      ↓
Rester sur Facture
```

La navigation ne doit pas être dispersée dans plusieurs callbacks incohérents.

---

# 97. Pratiques interdites

Il est interdit de :

- appeler Supabase directement dans un composant;
- mettre une règle métier dans une page;
- utiliser `any` sans justification;
- dupliquer un statut dans plusieurs modules;
- importer profondément l’interne d’une autre feature;
- considérer une ligne DB comme modèle universel;
- faire une transaction critique en plusieurs mutations navigateur fragiles;
- stocker une URL signée comme URL permanente;
- masquer une erreur de données avec une valeur fictive;
- modifier un ancien projet sans demande explicite;
- copier aveuglément l’ancienne architecture;
- créer un store global contenant toute l’application;
- utiliser Realtime comme seule source de vérité;
- faire dépendre la sécurité uniquement de l’interface;
- créer une migration destructive sans stratégie;
- terminer une tâche avec la documentation obsolète.

---

# 98. Décisions à confirmer avant l’initialisation

Avant le premier sprint de code, confirmer :

- version exacte de React;
- version exacte de Vite;
- stratégie du package partagé;
- environnement Supabase de développement;
- méthode de génération des types DB;
- plateforme de déploiement;
- solution d’observabilité;
- stratégie de feature flags;
- stratégie de tests SQL;
- solution de génération PDF.

Ces décisions doivent être ajoutées dans `memory.md`.

---

# 99. Critères de réussite

L’architecture est réussie si :

- chaque module possède une responsabilité claire;
- les dépendances sont contrôlées;
- les règles métier sont testables sans React;
- l’interface n’accède pas directement à Supabase;
- les transactions critiques sont atomiques;
- les permissions sont appliquées à plusieurs niveaux;
- l’ancienne base peut être adaptée progressivement;
- RECA Opérateur possède des contrats stables;
- les modules peuvent évoluer sans casser tout le produit;
- la documentation correspond au code;
- le système de mémoire permet de reprendre le travail sans perdre les décisions;
- le Dashboard peut agréger les opérations efficacement;
- les erreurs sont traçables;
- les tests couvrent les flux réels.

---

# 100. Flux architectural de référence

```text
Utilisateur
    ↓
Page
    ↓
Hook applicatif
    ↓
Command / Query
    ↓
Cas d’utilisation
    ↓
Domaine
    ↓
Port
    ↓
Repository / Adapter Supabase
    ↓
PostgreSQL / Storage / Realtime
```

Retour :

```text
PostgreSQL
    ↓
Mapper
    ↓
Modèle
    ↓
Projection
    ↓
TanStack Query
    ↓
Composant
    ↓
Utilisateur
```

---

# 101. Résumé officiel

RECA App V2 utilise une architecture modulaire orientée métier.

Les features représentent les domaines réels de Groupe RECA.

La logique est séparée entre :

```text
Présentation
Application
Domaine
Infrastructure
```

Supabase est encapsulé derrière des services et repositories.

Les composants ne décident pas des règles métier.

Les transactions critiques doivent être exécutées atomiquement.

RECA App V2 et RECA Opérateur communiquent par des contrats versionnés.

L’ancienne RECA App demeure une référence fonctionnelle, jamais une dépendance d’exécution.

La documentation et le système de mémoire font partie intégrante de l’architecture.

L’objectif n’est pas seulement de produire une application qui fonctionne.

L’objectif est de produire un système que Groupe RECA pourra comprendre, maintenir et faire évoluer pendant plusieurs années.
