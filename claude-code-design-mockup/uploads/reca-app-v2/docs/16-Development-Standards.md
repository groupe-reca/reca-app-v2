# 16-Development-Standards.md

# RECA
## Standards de développement

Version : 1.0  
Projet : RECA App V2  
Dépôt : `reca-app-v2`  
Statut : Référence technique officielle pour le développement  

---

# 1. Objectif du document

Ce document définit les standards obligatoires de développement de RECA App V2.

Il sert de référence pour :

- l’architecture du dépôt;
- l’organisation du code;
- TypeScript;
- React;
- React Router;
- TanStack Query;
- React Hook Form;
- Zod;
- Tailwind CSS;
- Supabase;
- PostgreSQL;
- RLS;
- les migrations;
- les contrats partagés;
- les tests;
- l’accessibilité;
- la performance;
- la sécurité;
- l’observabilité;
- les revues de code;
- la documentation;
- le travail de Claude;
- la livraison des sprints.

Ce document complète notamment :

```text
00-Vision.md
01-Design-System.md
02-Information-Architecture.md
03-Application-Architecture.md
04-Data-Architecture.md
05-Authentication-Roles-Permissions.md
12-Operator-Integration-and-Synchronization.md
13-Mobile-and-Responsive-Experience.md
15-Migration-Strategy.md
```

---

# 2. Principe fondamental

Le code doit représenter clairement le métier RECA.

La priorité est :

```text
Exactitude métier
  ↓
Sécurité des données
  ↓
Lisibilité
  ↓
Testabilité
  ↓
Maintenabilité
  ↓
Performance
  ↓
Vitesse d’implémentation
```

La vitesse ne doit jamais justifier :

- une perte de données;
- une permission contournée;
- une règle métier dupliquée;
- une mutation non transactionnelle;
- une migration destructive;
- un composant impossible à maintenir;
- une absence de tests sur un flux critique.

---

# 3. Stack technique de référence

Base recommandée :

```text
React
Vite
TypeScript strict
React Router
TanStack Query
React Hook Form
Zod
Tailwind CSS
Supabase
PostgreSQL
Supabase Auth
Supabase Storage
Supabase Realtime
Supabase Edge Functions
Mapbox
Turf.js
Vitest
Testing Library
Playwright
```

Les versions exactes doivent être choisies pendant le bootstrap technique et consignées dans :

```text
memory.md
package.json
lockfile
```

---

# 4. Politique de versions

Toujours utiliser :

- un lockfile versionné;
- des versions compatibles;
- des mises à jour contrôlées;
- des changelogs vérifiés;
- des tests avant mise à jour majeure.

Éviter :

```json
"*"
```

pour les dépendances de production.

---

# 5. Gestionnaire de paquets

Choisir un seul gestionnaire de paquets pour tout le dépôt.

Direction recommandée :

```text
pnpm
```

Une fois choisi :

- versionner le lockfile;
- ne pas ajouter un second lockfile;
- définir la version dans le projet;
- documenter les commandes dans `README.md`.

---

# 6. Commandes officielles

Le dépôt doit offrir des scripts cohérents.

Exemple :

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "check": "pnpm lint && pnpm typecheck && pnpm test && pnpm build"
  }
}
```

Les outils exacts peuvent varier, mais les capacités doivent exister.

---

# 7. Structure du dépôt

Structure recommandée :

```text
reca-app-v2/
├── CLAUDE.md
├── README.md
├── tasks.md
├── plans.md
├── file-index.md
├── memory.md
├── docs/
├── public/
├── src/
├── supabase/
├── tests/
├── package.json
├── tsconfig.json
├── vite.config.ts
└── playwright.config.ts
```

---

# 8. Structure de `src`

```text
src/
├── app/
├── assets/
├── components/
├── config/
├── features/
├── hooks/
├── infrastructure/
├── layouts/
├── lib/
├── routes/
├── styles/
├── types/
└── main.tsx
```

---

# 9. Structure Feature-first

Chaque domaine métier doit être isolé.

Exemple :

```text
src/features/missions/
├── application/
├── components/
├── domain/
├── infrastructure/
├── pages/
├── schemas/
├── types/
├── hooks/
├── index.ts
└── tests/
```

---

# 10. Couches internes d’une feature

## Domain

Contient :

- entités;
- Value Objects;
- enums;
- invariants;
- fonctions métier pures;
- erreurs métier;
- interfaces de repository.

## Application

Contient :

- use cases;
- Commands;
- Queries;
- orchestration;
- permissions contextuelles;
- résultats.

## Infrastructure

Contient :

- Supabase;
- mappers;
- repositories;
- DTO;
- services externes;
- Storage;
- Realtime.

## Presentation

Contient :

- pages;
- composants;
- hooks UI;
- view models;
- formulaires;
- routing local.

---

# 11. Direction des dépendances

Direction obligatoire :

```text
Presentation
  ↓
Application
  ↓
Domain

Infrastructure
  ↑
Application par interfaces
```

Le Domain ne doit pas importer :

- React;
- Supabase;
- TanStack Query;
- Tailwind;
- Mapbox;
- navigateur.

---

# 12. API publique des features

Chaque feature expose uniquement son API publique dans :

```text
index.ts
```

Exemple :

```ts
export { MissionDetailPage } from './pages/MissionDetailPage'
export { useMissionDetail } from './hooks/useMissionDetail'
export type { MissionSummary } from './types'
```

Éviter les imports profonds entre features.

---

# 13. Imports interdits

Exemple à éviter :

```ts
import { mapMissionRow } from '@/features/missions/infrastructure/internal/mapMissionRow'
```

depuis une autre feature.

Utiliser l’API publique ou un contrat partagé.

---

# 14. Alias

Utiliser un alias unique :

```text
@/
```

Exemple :

```ts
import { Button } from '@/components/ui/Button'
```

Éviter les chemins relatifs profonds :

```text
../../../../components
```

---

# 15. TypeScript strict

Activer au minimum :

```json
{
  "strict": true,
  "noUncheckedIndexedAccess": true,
  "exactOptionalPropertyTypes": true,
  "noImplicitOverride": true,
  "noFallthroughCasesInSwitch": true,
  "useUnknownInCatchVariables": true
}
```

Les exceptions doivent être justifiées.

---

# 16. Interdiction de `any`

`any` est interdit par défaut.

Utiliser :

```text
unknown
types génériques
unions
schémas Zod
types Supabase générés
```

Une exception doit contenir :

- commentaire;
- raison;
- périmètre minimal;
- tâche de retrait si temporaire.

---

# 17. Assertions de type

Éviter :

```ts
value as Mission
```

Privilégier :

```ts
MissionSchema.parse(value)
```

ou un mapper validé.

---

# 18. Non-null assertion

Éviter :

```ts
value!
```

Privilégier :

- guard;
- invariant;
- early return;
- validation;
- type narrowing.

---

# 19. Types nommés

Préférer les types métier explicites :

```ts
type MissionId = string
type ContractId = string
type MoneyCents = number
```

Pour les IDs critiques, une marque nominale peut être utilisée.

---

# 20. Branded types

Exemple optionnel :

```ts
type Brand<T, TBrand extends string> = T & { readonly __brand: TBrand }

type MissionId = Brand<string, 'MissionId'>
type ContractId = Brand<string, 'ContractId'>
```

Le choix doit rester ergonomique.

---

# 21. Enums

Préférer les unions littérales partagées ou enums générés.

Exemple :

```ts
type MissionStatus =
  | 'PLANNED'
  | 'READY'
  | 'IN_PROGRESS'
  | 'PAUSED'
  | 'COMPLETED'
  | 'CANCELLED'
```

Ne pas disperser des chaînes arbitraires.

---

# 22. Exhaustivité

Utiliser des vérifications exhaustives.

```ts
function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${String(value)}`)
}
```

---

# 23. Dates et heures

Règles :

- stocker les timestamps en UTC;
- afficher dans le fuseau de l’organisation;
- stocker les dates métier sans heure en `YYYY-MM-DD`;
- ne pas parser implicitement les dates locales;
- utiliser une abstraction de temps.

---

# 24. Clock abstraction

Les use cases critiques doivent dépendre d’une horloge.

```ts
interface Clock {
  now(): Date
}
```

Avantages :

- tests;
- jobs;
- retards;
- transitions;
- échéances;
- synchronisation.

---

# 25. Argent

Stocker les montants en cents entiers.

```ts
type MoneyCents = number
```

Interdiction :

```ts
const total = 10.1 + 20.2
```

pour des montants persistés.

---

# 26. Quantités décimales

Pour :

- taxes;
- superficies;
- coordonnées;
- quantités;

utiliser une précision explicitement définie.

---

# 27. Valeurs nulles

Distinguer :

```text
undefined
Valeur non fournie dans l’objet ou formulaire

null
Absence persistée explicite
```

Les mappers doivent gérer cette conversion.

---

# 28. Nommage TypeScript

Conventions :

```text
PascalCase
Types, composants, classes

camelCase
Fonctions, variables, propriétés

UPPER_SNAKE_CASE
Constantes globales stables seulement

kebab-case
Fichiers de routes ou documents si convention choisie
```

---

# 29. Nommage des fichiers

Direction recommandée :

```text
MissionDetailPage.tsx
MissionStatusBadge.tsx
useMissionDetail.ts
mission.schemas.ts
mission.types.ts
mission.repository.ts
mission.mapper.ts
```

---

# 30. Taille des fichiers

Un fichier doit avoir une responsabilité claire.

Un fichier très long doit être évalué.

Indicateurs de refactor :

- plusieurs concepts;
- plusieurs formulaires;
- plusieurs mutations;
- logique métier et UI mélangées;
- conditions difficiles à suivre;
- tests difficiles.

Il ne faut pas fractionner artificiellement un fichier lisible.

---

# 31. Fonctions

Préférer :

- fonctions courtes;
- noms explicites;
- early returns;
- arguments structurés;
- fonctions pures pour le métier.

Éviter :

- fonctions de plusieurs centaines de lignes;
- booléens ambigus;
- effets secondaires cachés.

---

# 32. Paramètres booléens

Éviter :

```ts
createMission(true, false, true)
```

Utiliser :

```ts
createMission({
  publish: true,
  notifyOperator: false,
  validateGeometry: true,
})
```

---

# 33. Résultats applicatifs

Les use cases peuvent retourner :

```ts
type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E }
```

Les erreurs métier attendues ne doivent pas toutes devenir des exceptions génériques.

---

# 34. Erreurs

Catégories recommandées :

```text
ValidationError
AuthorizationError
NotFoundError
ConflictError
DomainRuleError
InfrastructureError
NetworkError
UnknownError
```

---

# 35. Codes d’erreur

Utiliser des codes stables.

Exemples :

```text
MISSION_NOT_READY
ASSIGNMENT_CONFLICT
INVOICE_OVERPAYMENT
OPERATOR_NOT_ELIGIBLE
GEOMETRY_INVALID
```

Le texte utilisateur est localisé séparément.

---

# 36. React

Utiliser :

- composants fonctionnels;
- hooks;
- composition;
- props typées;
- composants contrôlés lorsque pertinent.

Éviter :

- logique métier dans JSX;
- effets multiples non nécessaires;
- state global pour tout;
- prop drilling excessif;
- composants gigantesques.

---

# 37. Responsabilité des composants

Un composant doit idéalement faire l’une de ces choses :

- présenter;
- composer;
- capturer une interaction;
- connecter à un hook;
- isoler une primitive.

---

# 38. Pages

Une page :

- lit les paramètres de route;
- orchestre les hooks;
- gère les grands états;
- compose le layout;
- ne contient pas les détails d’infrastructure.

---

# 39. Composants conteneurs et présentation

Direction possible :

```text
MissionDetailPage
  ↓
useMissionDetail
  ↓
MissionDetailView
```

Cela facilite :

- tests;
- fixtures;
- responsive;
- Storybook futur;
- réutilisation.

---

# 40. Props

Éviter de passer un objet DB complet à tous les composants.

Créer des view models ciblés.

---

# 41. Hooks

Un hook custom doit :

- commencer par `use`;
- avoir une responsabilité;
- respecter les règles React;
- ne pas cacher une mutation critique sans nom clair.

---

# 42. `useEffect`

`useEffect` est réservé aux synchronisations avec un système externe.

Éviter de l’utiliser pour :

- calculer une valeur dérivée;
- copier des props dans state;
- orchestrer une mutation métier complexe;
- remplacer un event handler.

---

# 43. Valeurs dérivées

Utiliser :

```ts
const balance = total - paid
```

plutôt qu’un state et un effect.

---

# 44. Mémoïsation

Utiliser `useMemo` et `useCallback` seulement lorsqu’il existe :

- un coût réel;
- une identité requise;
- une mesure;
- un composant mémoïsé.

Ne pas les ajouter automatiquement partout.

---

# 45. Keys React

Utiliser des IDs stables.

Interdiction d’utiliser l’index pour une liste réordonnable.

---

# 46. Error Boundaries

Prévoir des Error Boundaries pour :

- shell;
- routes;
- carte;
- documents;
- widgets critiques.

Une erreur secondaire ne doit pas toujours faire tomber toute l’application.

---

# 47. Suspense

Peut être utilisé pour :

- code splitting;
- routes;
- modules lourds.

Il ne doit pas masquer les erreurs ni remplacer tous les états de chargement métier.

---

# 48. React Router

Les routes doivent être centralisées et typées autant que possible.

Structure :

```text
PublicRoutes
AuthenticatedRoutes
ModuleRoutes
FullscreenRoutes
```

---

# 49. Métadonnées de route

Chaque route peut définir :

```ts
type RouteMeta = {
  title: string
  requiredPermission?: PermissionKey
  requiredModule?: string
  layout: 'APP' | 'FULLSCREEN' | 'PUBLIC'
  breadcrumb?: BreadcrumbFactory
}
```

---

# 50. Guards

Guards recommandés :

```text
RequireAuth
RequireOrganization
RequirePermission
RequireModule
RequireFeatureFlag
```

Ils améliorent l’UX.

Ils ne remplacent pas RLS.

---

# 51. Paramètres de route

Valider les paramètres.

```ts
const MissionIdSchema = z.string().uuid()
```

Ne pas transmettre un ID non validé aux repositories.

---

# 52. Query parameters

Les filtres, onglets et vues peuvent être dans l’URL.

Exemples :

```text
?status=ACTIVE
?tab=history
?date=2026-08-06
```

Ils doivent être parsés par un schéma.

---

# 53. Navigation après mutation

Chaque mutation doit définir le résultat de navigation.

Exemples :

```text
Create → Detail
Archive → List
Convert → New entity detail
Update → Stay
```

---

# 54. TanStack Query

TanStack Query est la source de vérité du state serveur côté frontend.

Utiliser pour :

- queries;
- cache;
- invalidation;
- mutations;
- retry;
- stale time;
- prefetch.

---

# 55. Query Keys

Chaque feature possède une factory.

```ts
export const missionKeys = {
  all: ['missions'] as const,
  lists: () => [...missionKeys.all, 'list'] as const,
  list: (filters: MissionFilters) =>
    [...missionKeys.lists(), filters] as const,
  details: () => [...missionKeys.all, 'detail'] as const,
  detail: (id: MissionId) =>
    [...missionKeys.details(), id] as const,
}
```

---

# 56. Query functions

Les query functions :

- appellent un service applicatif ou repository;
- valident les résultats;
- retournent des modèles ou DTO adaptés;
- ne manipulent pas le DOM;
- ne déclenchent pas de toast.

---

# 57. Stale times

Définir selon la nature :

```text
Mission active
Court

Client
Moyen

Paramètres stables
Long

Historique
Moyen à long

Search
Court
```

Éviter un `staleTime` global arbitraire.

---

# 58. Retry Query

Retenter :

- erreurs réseau;
- timeout;
- indisponibilité temporaire.

Ne pas retenter automatiquement :

- 401;
- 403;
- validation;
- not found;
- conflit métier.

---

# 59. Invalidation

Invalider seulement les clés concernées.

Éviter :

```ts
queryClient.invalidateQueries()
```

sans filtre.

---

# 60. Optimistic updates

Permis pour des actions simples et réversibles.

À éviter pour :

- Payments;
- géométrie;
- création Mission;
- assignation critique;
- transitions;
- permissions;
- annulation.

---

# 61. Mutations

Une mutation doit gérer :

- loading;
- erreur;
- succès;
- invalidation;
- navigation;
- idempotence si nécessaire;
- double clic.

---

# 62. React Hook Form

Utiliser pour les formulaires.

Chaque formulaire important doit posséder :

- schéma Zod;
- type d’entrée;
- valeurs par défaut;
- mapper;
- composant;
- mutation;
- tests.

---

# 63. Zod

Zod sert à valider :

- formulaires;
- paramètres;
- query params;
- réponses externes;
- payloads Operator;
- variables d’environnement;
- imports.

---

# 64. Schémas DB vs Form

Ne pas utiliser directement le schéma DB comme schéma de formulaire.

Exemple :

```text
ClientRowSchema
ClientDomainSchema
ClientFormSchema
```

peuvent être distincts.

---

# 65. Valeurs par défaut

Centraliser les valeurs par défaut.

Ne pas disperser :

```ts
status: 'ACTIVE'
```

dans plusieurs pages.

---

# 66. Form mapping

Séparer :

```text
FormValues
  ↓
CommandInput
  ↓
Domain
  ↓
Repository
```

---

# 67. Erreurs serveur dans les formulaires

Mapper les erreurs connues vers :

- champ;
- section;
- message global.

---

# 68. Boutons de formulaire

Pendant la soumission :

- désactiver le double clic;
- afficher l’état;
- conserver les données;
- ne pas naviguer avant confirmation.

---

# 69. Formulaires complexes

Utiliser un Wizard avec :

- état central;
- validation par étape;
- validation finale;
- sauvegarde brouillon si nécessaire;
- reprise;
- garde de sortie.

---

# 70. Tailwind CSS

Tailwind sert à appliquer les tokens du Design System.

Éviter :

- valeurs arbitraires répétées;
- couleurs codées dans les pages;
- styles inline;
- classes dupliquées;
- variantes incohérentes.

---

# 71. Tokens

Les tokens doivent définir :

- couleurs;
- espacements;
- rayons;
- ombres;
- typographie;
- hauteurs;
- z-index;
- breakpoints;
- safe areas.

---

# 72. Couleurs

Utiliser des noms sémantiques.

```text
bg-surface
text-primary
border-subtle
bg-status-success
text-status-warning
```

Éviter :

```text
bg-[#131E33]
```

dans les pages.

---

# 73. Variants

Utiliser une stratégie de variants centralisée.

Exemple :

```text
Button
Badge
Alert
Card
Input
```

Les composants ne doivent pas reconstruire leurs styles dans chaque feature.

---

# 74. `cn`

Utiliser un helper unique pour composer les classes.

---

# 75. Responsive

Les changements visuels simples utilisent CSS.

Les changements structurels peuvent utiliser des composants spécialisés.

La logique métier reste partagée.

---

# 76. Z-index

Définir une échelle.

Exemple :

```text
base
sticky
dropdown
drawer
modal
toast
critical
```

Éviter les valeurs arbitraires comme `z-[99999]`.

---

# 77. Composants UI officiels

Le dossier UI doit contenir des primitives stables.

Exemples :

```text
Button
IconButton
Input
Textarea
Select
Checkbox
Radio
Switch
Badge
Alert
Card
Dialog
BottomSheet
Drawer
DropdownMenu
Tabs
Table
Tooltip
Toast
Skeleton
EmptyState
ErrorState
```

---

# 78. Composants métier partagés

Exemples :

```text
EntityHeader
EntityNumber
StatusBadge
MoneyValue
DateValue
PhoneLink
EmailLink
AddressLink
Timeline
AttentionList
ResourcePicker
MapWorkspace
```

---

# 79. Accessibilité des primitives

Chaque primitive doit gérer :

- focus;
- clavier;
- labels;
- disabled;
- loading;
- aria;
- contraste;
- touch target;
- reduced motion.

---

# 80. Supabase

Supabase est isolé dans `infrastructure`.

Les pages et composants ne doivent pas appeler directement :

```ts
supabase.from(...)
```

---

# 81. Client Supabase

Créer un client unique par environnement.

Aucune clé `service_role` dans le frontend.

---

# 82. Types DB générés

Générer les types Supabase.

Exemple :

```text
src/infrastructure/supabase/database.types.ts
```

Ne pas modifier manuellement le fichier généré.

---

# 83. DTO et Domain

Ne pas confondre :

```text
Database Row
DTO
Domain Model
View Model
```

---

# 84. Mappers

Chaque mapper important doit :

- gérer null;
- mapper statuts;
- valider;
- normaliser;
- lever une erreur explicite en cas d’incompatibilité.

---

# 85. Repositories

Les repositories exposent des interfaces métier.

Exemple :

```ts
interface MissionRepository {
  getById(id: MissionId): Promise<Mission>
  list(filters: MissionFilters): Promise<Paginated<MissionSummary>>
}
```

---

# 86. Sélection SQL

Sélectionner seulement les colonnes nécessaires.

Éviter :

```text
select *
```

dans les requêtes importantes.

---

# 87. Pagination serveur

Obligatoire pour les listes pouvant croître :

- Clients;
- Contracts;
- Missions;
- Invoices;
- Payments;
- Events;
- Audit.

---

# 88. Transactions

Les opérations critiques doivent utiliser :

- RPC PostgreSQL;
- transaction serveur;
- Edge Function avec transaction DB.

Ne pas orchestrer plusieurs écritures critiques indépendantes depuis le navigateur.

---

# 89. Opérations transactionnelles critiques

Exemples :

```text
CreateMissionFromRoute
RecordPayment
CancelPayment
ConvertQuoteToClient
ReorderRouteItems
SaveContractGeometry
AssignMissionResources
ApplyOperatorSyncBatch
```

---

# 90. RPC

Une RPC doit :

- avoir un nom métier;
- valider l’acteur;
- valider l’organisation;
- vérifier les permissions;
- vérifier les invariants;
- être transactionnelle;
- retourner un résultat structuré;
- créer l’audit si nécessaire.

---

# 91. Edge Functions

Utiliser pour :

- fournisseurs externes;
- génération complexe;
- fichiers;
- secrets;
- webhook;
- orchestration hors DB.

Ne pas utiliser une Edge Function lorsque la transaction SQL suffit.

---

# 92. RLS

RLS est obligatoire pour les données métier sensibles.

Chaque table doit définir :

- SELECT;
- INSERT;
- UPDATE;
- DELETE ou interdiction;
- organisation;
- permissions;
- scopes.

---

# 93. RLS et tests

Toute nouvelle policy doit avoir des tests pour :

- accès autorisé;
- accès refusé;
- autre organisation;
- rôle limité;
- User suspendu;
- Operator assigné;
- Operator non assigné.

---

# 94. Soft delete

Utiliser :

```text
deleted_at
archived_at
status
```

selon l’entité.

Ne pas utiliser la suppression physique comme action métier normale.

---

# 95. Migrations SQL

Règles :

- fichiers versionnés;
- migrations additives;
- nom clair;
- une responsabilité;
- commentaire;
- test;
- rollback ou stratégie de récupération.

---

# 96. Backfills

Séparer les changements de schéma et les backfills importants.

Un backfill doit être :

- relançable;
- idempotent;
- batché;
- observable;
- testable;
- compatible dry-run si critique.

---

# 97. Contraintes DB

Utiliser les contraintes pour protéger :

- unicité;
- références;
- montants;
- statuts;
- séquences;
- versions;
- un seul item actif si possible.

Le domaine et la DB doivent se compléter.

---

# 98. Index

Ajouter des index selon :

- filtres;
- relations;
- recherches;
- tri;
- RLS;
- performances mesurées.

---

# 99. Storage

Stocker :

- bucket;
- path;
- metadata.

Ne jamais stocker une URL signée.

---

# 100. Nommage Storage

Exemple :

```text
organizations/{organizationId}/contracts/{contractId}/documents/{version}.pdf
```

---

# 101. Uploads

Les uploads doivent vérifier :

- type;
- taille;
- permission;
- checksum si nécessaire;
- entité;
- organisation;
- statut.

---

# 102. Realtime

Realtime sert à accélérer l’actualisation.

Il ne remplace pas :

- la query autoritative;
- la transaction;
- la synchronisation;
- le refetch.

---

# 103. Pattern Realtime

```text
Événement Realtime
  ↓
Identifier la query
  ↓
Invalider
  ↓
Relire
```

---

# 104. Abonnements

Toujours :

- limiter les filtres;
- fermer au démontage;
- éviter les doublons;
- gérer la reconnexion;
- gérer les erreurs.

---

# 105. Contrats Operator

Les contrats partagés doivent être :

- versionnés;
- validés;
- testés dans les deux projets;
- compatibles;
- documentés.

---

# 106. Idempotence

Les opérations suivantes exigent une clé d’idempotence :

- création Mission;
- Payment;
- sync Operator;
- envoi externe;
- génération en batch;
- import.

---

# 107. Sécurité

Règles minimales :

- aucun secret frontend;
- validation serveur;
- permissions serveur;
- RLS;
- logs minimisés;
- uploads contrôlés;
- redirections validées;
- HTML échappé;
- dépendances surveillées.

---

# 108. Variables d’environnement

Toutes les variables doivent être validées au démarrage.

Exemple :

```ts
const EnvSchema = z.object({
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1),
})
```

---

# 109. Secrets

Les secrets doivent exister uniquement dans :

- plateforme de déploiement;
- Supabase secrets;
- CI sécurisée;
- gestionnaire de secrets.

Jamais dans :

- Git;
- fichier client;
- logs;
- documentation partagée.

---

# 110. Journalisation

Utiliser des logs structurés.

Champs possibles :

```text
event
entityType
entityId
userId
organizationId
correlationId
duration
result
errorCode
```

---

# 111. Données interdites dans les logs

Ne pas journaliser :

- mot de passe;
- token;
- secret;
- données bancaires;
- contenu complet de note;
- payload Client complet;
- géométrie complète par défaut;
- GPS brut inutile.

---

# 112. Correlation ID

Utiliser un `correlationId` pour :

- mutation;
- RPC;
- Edge Function;
- événements;
- sync;
- incident.

---

# 113. Observabilité

Mesurer :

- erreurs;
- latence;
- RPC;
- queries;
- sync;
- migrations;
- Realtime;
- uploads;
- documents;
- actions critiques.

---

# 114. Performance frontend

Règles :

- code splitting;
- lazy loading;
- pagination;
- sélection minimale;
- cache;
- préchargement ciblé;
- éviter les rerenders inutiles;
- images optimisées.

---

# 115. Modules lourds

Charger en différé :

- Mapbox;
- PDF;
- graphiques;
- outil de mesure;
- audit;
- exports.

---

# 116. Bundle

Le build doit pouvoir analyser la taille des chunks.

Une dépendance volumineuse doit être justifiée.

---

# 117. Performance DB

Évaluer :

- plans de requêtes;
- index;
- N+1;
- jointures;
- agrégats;
- pagination;
- RLS;
- vues.

---

# 118. N+1

Éviter de charger une relation dans une boucle.

Utiliser :

- join;
- RPC;
- batch;
- projection.

---

# 119. Accessibilité

Objectif :

```text
WCAG 2.2 AA
```

---

# 120. Exigences d’accessibilité

- navigation clavier;
- focus visible;
- labels;
- erreurs annoncées;
- contraste;
- touch targets;
- alternative carte;
- reduced motion;
- structure de titres;
- statut non dépendant de la couleur.

---

# 121. Internationalisation

Langues initiales :

```text
fr-CA
en-CA
```

Même si l’interface initiale est principalement française, les clés doivent être structurées.

---

# 122. Texte métier

Stocker des clés stables pour :

- statuts;
- événements;
- notifications;
- erreurs.

Éviter de stocker uniquement une phrase traduite lorsque la donnée est structurée.

---

# 123. Formatage

Centraliser :

- monnaie;
- date;
- heure;
- durée;
- téléphone;
- adresse;
- superficie;
- pourcentage.

---

# 124. Tests unitaires

Tester les fonctions pures :

- calculs;
- transitions;
- Readiness;
- mappers;
- permissions;
- statuts;
- validations;
- formatage critique;
- idempotence.

---

# 125. Tests composants

Tester :

- rendu;
- loading;
- erreur;
- vide;
- permissions;
- action;
- accessibilité;
- responsive lorsque pertinent.

---

# 126. Tests d’intégration

Tester :

- repositories;
- RPC;
- RLS;
- Storage;
- Realtime;
- formulaires;
- transactions;
- contrats Operator.

---

# 127. Tests E2E

Tester les parcours critiques :

```text
Lead → Quote → Client → Contract
Contract → Route → Mission
Mission → Operator → Sync → Complete
Invoice → Payment
```

---

# 128. Tests de contrat

Obligatoires pour `reca-app-v2` et `reca-operateur`.

---

# 129. Tests de migration

Exécuter sur :

- base vide;
- snapshot legacy;
- données invalides;
- relance;
- rollback;
- dry-run.

---

# 130. Tests visuels

Créer des snapshots pour les Master UI :

- Desktop;
- Mobile;
- clair;
- sombre;
- états critiques;
- états vides.

---

# 131. Tests d’accessibilité automatisés

Ajouter un outil comme axe dans les tests composants ou E2E.

Les tests automatiques ne remplacent pas une revue manuelle.

---

# 132. Couverture

La couverture ne doit pas devenir une métrique vide.

Priorité :

- règles critiques;
- transactions;
- permissions;
- mappers;
- synchronisation;
- finance.

---

# 133. Données de test

Utiliser :

- factories;
- fixtures;
- builders;
- IDs déterministes;
- clock contrôlée.

---

# 134. Factories

Exemple :

```ts
const mission = buildMission({
  status: 'IN_PROGRESS',
})
```

---

# 135. Mocks

Mocker seulement les frontières :

- repository;
- service externe;
- clock;
- UUID;
- réseau.

Éviter de mocker toute la logique interne.

---

# 136. Playwright

Playwright doit couvrir :

- Auth;
- navigation;
- formulaires;
- responsive;
- permissions;
- flux critiques;
- migration;
- Operator contract si environnement disponible.

---

# 137. Tests RLS automatisés

Ils doivent exécuter de vraies requêtes sous différents Users.

---

# 138. Qualité avant commit

Avant un commit important :

```text
format
lint
typecheck
tests ciblés
```

Avant une PR :

```text
check complet
```

---

# 139. Git

Commits recommandés :

```text
feat(missions): add readiness projection
fix(payments): prevent overpayment
docs(architecture): document route snapshots
refactor(clients): isolate legacy mapper
test(rls): cover operator mission access
```

---

# 140. Taille des commits

Un commit doit représenter une unité logique.

Éviter :

- un commit énorme sans séparation;
- plusieurs sujets sans lien;
- modifications de formatage mélangées à une migration métier.

---

# 141. Branches

Direction :

```text
feature/*
fix/*
migration/*
docs/*
hotfix/*
```

---

# 142. Pull Requests

Une PR doit contenir :

- objectif;
- contexte;
- solution;
- captures si UI;
- migrations;
- tests;
- risques;
- rollback;
- documentation modifiée.

---

# 143. Checklist PR

```text
[ ] Le code compile
[ ] Les types passent
[ ] Les tests passent
[ ] Les permissions sont vérifiées
[ ] RLS est testée
[ ] Les migrations sont additives
[ ] Le responsive est testé
[ ] L’accessibilité est vérifiée
[ ] Les erreurs sont gérées
[ ] La documentation est mise à jour
[ ] memory.md est mis à jour si décision
```

---

# 144. Revue de code

La revue doit vérifier :

- règle métier;
- sécurité;
- architecture;
- types;
- transactions;
- UX;
- tests;
- performances;
- migration;
- lisibilité.

---

# 145. Commentaires de code

Écrire un commentaire pour expliquer :

- pourquoi;
- contrainte métier;
- workaround;
- compatibilité;
- limite temporaire.

Éviter les commentaires qui répètent le code.

---

# 146. TODO

Un TODO doit contenir :

- raison;
- contexte;
- issue ou tâche;
- condition de retrait.

Exemple :

```ts
// TODO(RECA-142): retirer ce mapping après la fin du support du statut legacy.
```

---

# 147. Documentation technique

Chaque feature importante doit documenter :

- rôle;
- données;
- use cases;
- permissions;
- routes;
- événements;
- tests;
- migrations.

---

# 148. README du dépôt

Le README doit contenir :

- objectif;
- prérequis;
- installation;
- variables;
- commandes;
- environnements;
- architecture;
- liens vers docs;
- déploiement;
- sécurité.

---

# 149. `CLAUDE.md`

`CLAUDE.md` doit imposer :

- lecture des fichiers mémoire;
- respect des docs;
- plan avant changement;
- interdiction de modifier les anciens dépôts;
- tests;
- mise à jour de la mémoire;
- limitation du scope.

---

# 150. Protocole mémoire

Avant un travail significatif, Claude doit lire :

```text
CLAUDE.md
tasks.md
plans.md
file-index.md
memory.md
```

Après le travail, Claude doit mettre à jour les fichiers pertinents.

---

# 151. `tasks.md`

Contient :

- travail à faire;
- statut;
- priorité;
- dépendances;
- critères d’acceptation.

---

# 152. `plans.md`

Contient :

- plans actifs;
- décisions proposées;
- séquence;
- risques;
- validations.

---

# 153. `file-index.md`

Contient :

- fichiers importants;
- rôle;
- propriétaire;
- liens;
- statut.

---

# 154. `memory.md`

Contient uniquement les décisions confirmées et durables.

Ne pas y mettre :

- hypothèses;
- idées non validées;
- détails temporaires;
- historique complet de conversation.

---

# 155. Workflow obligatoire de Claude

```text
1. Lire les instructions
2. Lire la mémoire
3. Lire la documentation concernée
4. Inspecter le code réel
5. Résumer les constats
6. Proposer un plan
7. Modifier un scope limité
8. Tester
9. Comparer
10. Mettre à jour la documentation
11. Mettre à jour la mémoire
```

---

# 156. Inspection des anciens dépôts

Claude peut lire :

```text
reca-app
reca-operateur
```

Il ne doit pas les modifier sans instruction explicite.

---

# 157. Référence fonctionnelle

Lorsqu’un comportement existe dans `reca-app` :

- l’inventorier;
- vérifier son intention;
- vérifier les données;
- décider s’il doit être conservé;
- ne pas le copier automatiquement.

---

# 158. Référence Operator

Lorsqu’un changement touche :

- Missions;
- MissionItems;
- statuts;
- géométrie;
- sync;
- Operator;

Claude doit inspecter `reca-operateur`.

---

# 159. Limitation du scope

Une tâche doit modifier seulement ce qui est nécessaire.

Éviter les refactors non demandés dans une PR métier.

---

# 160. Interdictions pour Claude

Claude ne doit jamais :

- supprimer les anciens dépôts;
- modifier les données réelles sans plan;
- exécuter une migration destructive;
- inventer un statut;
- inventer une colonne existante;
- contourner une RLS;
- mettre un secret dans le code;
- désactiver des tests;
- masquer une erreur;
- déclarer terminé sans validation.

---

# 161. Décisions incertaines

Lorsqu’une décision n’est pas confirmée :

- la documenter dans `plans.md`;
- utiliser un TODO clair si nécessaire;
- ne pas la transformer en vérité dans `memory.md`.

---

# 162. Architecture Decision Records

Pour les décisions importantes, utiliser :

```text
docs/adr/
```

Exemples :

```text
ADR-001-package-manager.md
ADR-002-operator-contracts.md
ADR-003-postgis.md
ADR-004-role-model.md
```

---

# 163. Structure ADR

```text
Contexte
Décision
Options
Conséquences
Statut
Date
```

---

# 164. Déploiement

Le déploiement doit être automatisé.

Étapes :

```text
Install
Lint
Typecheck
Tests
Build
Migrations contrôlées
Deploy
Smoke tests
Monitoring
```

---

# 165. Environnements

Minimum :

```text
development
staging
production
```

---

# 166. Configuration par environnement

Ne pas utiliser de conditions dispersées :

```ts
if (window.location.hostname === ...)
```

Utiliser une configuration validée.

---

# 167. Preview deployments

Les PR UI peuvent avoir un environnement preview.

Les données doivent être fictives ou isolées.

---

# 168. Production

Les migrations production doivent être :

- approuvées;
- sauvegardées;
- observées;
- réversibles;
- exécutées dans une fenêtre adaptée.

---

# 169. Smoke tests

Après déploiement :

- Auth;
- Dashboard;
- Client;
- Contract;
- Mission;
- Invoice;
- Search;
- permission;
- Operator contract.

---

# 170. Feature flags

Un flag doit :

- avoir un propriétaire;
- avoir une date;
- être observable;
- être documenté;
- être retiré.

---

# 171. Tests de feature flags

Tester :

- activé;
- désactivé;
- permission;
- route directe;
- migration.

---

# 172. Sécurité CI

La CI doit :

- masquer les secrets;
- limiter les permissions;
- utiliser des environnements protégés;
- détecter les secrets;
- signer ou vérifier les artefacts si nécessaire.

---

# 173. Dépendances

Évaluer une dépendance selon :

- maintenance;
- licence;
- poids;
- sécurité;
- compatibilité;
- besoin réel;
- qualité TypeScript;
- accessibilité.

---

# 174. Nouvelle dépendance

Une PR ajoutant une dépendance importante doit expliquer :

- problème;
- alternatives;
- taille;
- risque;
- stratégie de retrait.

---

# 175. Licences

Vérifier la compatibilité des licences.

---

# 176. Vulnérabilités

Les vulnérabilités critiques doivent être traitées rapidement.

Ne pas appliquer automatiquement une mise à jour majeure sans tests.

---

# 177. Formatage

Utiliser un outil unique.

Le formatage ne doit pas être sujet à débat en revue.

---

# 178. ESLint

Règles recommandées :

- TypeScript;
- React Hooks;
- import order;
- no floating promises;
- no explicit any;
- exhaustive deps;
- accessibility.

---

# 179. Promesses

Toute Promise doit être :

- awaited;
- retournée;
- gérée;
- explicitement ignorée avec raison.

---

# 180. Gestion des erreurs async

Ne pas écrire :

```ts
try {
  await save()
} catch {
  // rien
}
```

Toute erreur doit être :

- affichée;
- journalisée;
- transformée;
- ou explicitement ignorée avec justification.

---

# 181. UI et erreurs

Les erreurs importantes doivent être persistantes.

Un toast seul est insuffisant pour :

- sync bloquée;
- Payment échoué;
- Mission invalide;
- géométrie perdue;
- permission critique.

---

# 182. Messages utilisateur

Ils doivent être :

- précis;
- actionnables;
- non techniques;
- localisés.

Exemple :

```text
Le montant dépasse le solde de la Facture.
```

plutôt que :

```text
Constraint violation 23514
```

---

# 183. Codes techniques

Les détails peuvent être accessibles dans :

- logs;
- diagnostic;
- support;
- correlationId.

---

# 184. Accessibilité des erreurs

Les erreurs doivent être :

- annoncées;
- liées au champ;
- visibles;
- non uniquement colorées.

---

# 185. Performance budgets

Budgets initiaux à confirmer :

```text
Shell visible rapidement
Route principale sous 2 s dans les conditions normales
Carte chargée séparément
Aucun bundle racine inutilement lourd
Listes paginées
```

---

# 186. Mesure avant optimisation

Ne pas optimiser au hasard.

Mesurer :

- bundle;
- React Profiler;
- Network;
- DB plans;
- Core Web Vitals;
- logs.

---

# 187. Code mort

Retirer :

- imports;
- fonctions;
- flags;
- composants;
- branches;
- adapters;

lorsqu’ils ne sont plus nécessaires et que la migration le permet.

---

# 188. Dépréciation

Une API interne dépréciée doit indiquer :

- remplacement;
- date;
- tâche;
- version de retrait.

---

# 189. Compatibilité legacy

Les adapters legacy doivent être isolés.

Ils ne doivent pas devenir la nouvelle architecture permanente.

---

# 190. Definition of Ready

Une tâche est prête lorsque :

- objectif clair;
- scope clair;
- dépendances identifiées;
- docs lues;
- données vérifiées;
- permissions connues;
- critères d’acceptation définis;
- risques identifiés.

---

# 191. Definition of Done

Une tâche est terminée lorsque :

- code implémenté;
- types passent;
- lint passe;
- tests passent;
- responsive vérifié;
- accessibilité vérifiée;
- permissions vérifiées;
- erreurs gérées;
- documentation mise à jour;
- mémoire mise à jour;
- aucun TODO caché critique.

---

# 192. Critères de réussite du code

Le code doit être :

- lisible;
- prévisible;
- typé;
- testé;
- sécurisé;
- modulaire;
- compatible;
- documenté;
- observable.

---

# 193. Ce qui doit être évité

Ne pas :

- appeler Supabase dans les composants;
- utiliser `any` pour gagner du temps;
- dupliquer les statuts;
- stocker l’argent en flottants;
- créer une mutation critique non transactionnelle;
- contourner RLS;
- charger toutes les données puis filtrer;
- utiliser Realtime comme source unique;
- écrire une migration destructive sans plan;
- cacher une erreur;
- utiliser un composant géant pour tout;
- copier l’ancien code sans analyse;
- mélanger plusieurs responsabilités dans une PR.

---

# 194. Hors périmètre initial

Ce document ne fixe pas encore définitivement :

- versions exactes des packages;
- fournisseur de monitoring;
- fournisseur de courriels;
- plateforme d’hébergement finale;
- stratégie de monorepo;
- Storybook;
- PostGIS;
- générateur de contrats partagés;
- outil exact de feature flags.

Ces décisions doivent être prises au bootstrap et documentées.

---

# 195. Décisions à confirmer

Avant l’initialisation complète du dépôt, confirmer :

- gestionnaire de paquets;
- versions;
- ESLint;
- Prettier;
- structure exacte;
- branded types;
- package partagé Operator;
- monitoring;
- analytics;
- feature flags;
- Storybook;
- stratégie i18n;
- PostGIS;
- génération types DB;
- CI;
- déploiement;
- environnements;
- politique de couverture;
- conventions Git.

Les décisions confirmées doivent être ajoutées à `memory.md` et, si nécessaire, à un ADR.

---

# 196. Règles non négociables

TypeScript strict est obligatoire.

Les composants ne doivent pas appeler Supabase directement.

Les règles métier critiques doivent être testées.

Les opérations critiques doivent être transactionnelles.

RLS doit protéger les données.

Les contrats Operator doivent être versionnés.

Les montants doivent être stockés de manière sûre.

Les migrations doivent être additives et réversibles autant que possible.

Le code legacy doit être isolé derrière des adapters.

Les erreurs ne doivent pas être ignorées.

Les décisions durables doivent être documentées.

Claude doit lire la mémoire avant un travail significatif.

Claude ne doit pas modifier `reca-app` ou `reca-operateur` sans instruction explicite.

---

# 197. Diagramme de développement

```text
Documentation
  ↓
Décision
  ↓
Domain
  ↓
Application
  ↓
Infrastructure
  ↓
Presentation
  ↓
Tests
  ↓
Review
  ↓
Deployment
  ↓
Monitoring
  ↓
Memory update
```

---

# 198. Flux d’une fonctionnalité

```text
Besoin métier
  ↓
Lire les docs
  ↓
Inspecter les données et le legacy
  ↓
Définir le Domain
  ↓
Définir le use case
  ↓
Définir le repository
  ↓
Implémenter l’infrastructure
  ↓
Construire l’UI
  ↓
Tester
  ↓
Documenter
  ↓
Livrer
```

---

# 199. Flux d’une migration

```text
Inventaire
  ↓
Mapping
  ↓
Migration additive
  ↓
Backfill
  ↓
Validation
  ↓
Comparaison
  ↓
Feature flag
  ↓
Bascule
  ↓
Observation
```

---

# 200. Résumé officiel

RECA App V2 utilise une architecture Feature-first organisée en Domain, Application, Infrastructure et Presentation.

TypeScript strict est obligatoire.

Les composants React ne communiquent pas directement avec Supabase.

Les règles métier sont centralisées et testées.

TanStack Query gère le state serveur.

React Hook Form et Zod gèrent les formulaires.

Tailwind applique les tokens du Design System.

Supabase est protégé par RLS.

Les opérations critiques utilisent des transactions.

Les migrations sont additives, observables et réversibles.

Les contrats avec RECA Opérateur sont versionnés.

Les tests couvrent le domaine, l’intégration, RLS, les parcours E2E et le responsive.

La documentation et les fichiers mémoire font partie du travail de développement.

L’objectif est de produire un système fiable, lisible et durable, capable de soutenir les opérations réelles de Groupe RECA sans recréer les fragilités de l’ancienne application.
