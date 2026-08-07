# 04-Data-Architecture.md

# RECA
## Architecture des données

Version : 1.0  
Projet : RECA App V2  
Dépôt recommandé : `reca-app-v2`  
Statut : Architecture officielle des données  

---

# 1. Objectif du document

Ce document définit l’architecture officielle des données de RECA App V2.

Il décrit :

- les entités principales;
- les relations;
- les sources de vérité;
- les identifiants;
- les statuts;
- les données historiques;
- les snapshots;
- les événements;
- les règles de suppression;
- les règles de versionnement;
- les contraintes d’organisation;
- les responsabilités entre RECA App V2 et RECA Opérateur;
- les principes de migration depuis l’ancienne RECA App;
- les conventions Supabase/PostgreSQL;
- les projections nécessaires au Dashboard;
- les règles de synchronisation opérationnelle.

Ce document ne représente pas encore le SQL final.

Il définit le modèle conceptuel et logique à respecter avant la création ou la modification des migrations.

---

# 2. Principe fondamental

Les données doivent représenter la réalité métier.

Le modèle ne doit pas être conçu uniquement pour faciliter un écran ou un formulaire.

La chaîne centrale est :

```text
Organisation
    ↓
Client
    ↓
Contrat
    ↓
Zone de déneigement
    ↓
Route
    ↓
Mission
    ↓
MissionItem
    ↓
Exécution terrain
    ↓
Événements
    ↓
Historique et statistiques
```

Les entités permanentes et les événements réels doivent être clairement séparés.

---

# 3. Source de vérité

## 3.1 Supabase/PostgreSQL

Supabase/PostgreSQL demeure la source de vérité principale pour :

- organisations;
- utilisateurs;
- clients;
- contrats;
- routes;
- missions;
- factures;
- paiements;
- historiques;
- configurations;
- projections persistées;
- données synchronisées depuis RECA Opérateur.

---

## 3.2 RECA Opérateur

RECA Opérateur est une source temporaire locale pendant l’exécution terrain.

Il peut conserver hors ligne :

- Mission;
- MissionItems;
- transitions;
- temps;
- problèmes;
- notes;
- opérations de synchronisation;
- état de mission.

Une fois synchronisées, les données autoritatives doivent être reflétées dans Supabase.

---

## 3.3 Ancienne RECA App

L’ancienne RECA App n’est pas une nouvelle source de vérité.

Elle continue temporairement d’utiliser les données existantes.

Elle sert à :

- confirmer les structures;
- identifier les conventions;
- comprendre les données historiques;
- valider les migrations;
- comparer les comportements.

---

# 4. Organisation

Toute donnée métier importante doit appartenir à une organisation.

Entité conceptuelle :

```ts
type Organization = {
  id: OrganizationId
  name: string
  legalName?: string
  status: OrganizationStatus
  timezone: string
  locale: string
  currency: string
  createdAt: string
  updatedAt: string
}
```

Valeurs recommandées :

```text
timezone = America/Toronto
locale = fr-CA
currency = CAD
```

Même si Groupe RECA est la seule organisation initiale, le modèle doit éviter les données globales sans propriétaire.

---

# 5. Identifiants

## 5.1 Identifiants techniques

Les relations utilisent des identifiants techniques stables.

Recommandation :

```text
UUID
```

Exemple :

```ts
type ContractId = string
```

---

## 5.2 Identifiants visibles

Les utilisateurs peuvent voir des numéros lisibles.

Exemples :

```text
LED-000125
SOU-000078
CLI-000053
CTR-000056
RTE-000014
MIS-2026-0009
FAC-000081
PAI-000104
```

Les numéros visibles ne doivent pas servir de clé relationnelle principale.

---

## 5.3 Génération

La génération des numéros visibles doit être centralisée.

Elle doit éviter :

- doublons;
- réutilisation après suppression;
- collisions entre organisations;
- dépendance au navigateur.

Solutions possibles :

- séquence PostgreSQL;
- RPC;
- fonction transactionnelle;
- compteur par organisation.

---

# 6. Colonnes communes

Les entités importantes doivent idéalement posséder :

```text
id
organization_id
created_at
created_by
updated_at
updated_by
deleted_at
deleted_by
version
```

Toutes les tables n’ont pas besoin de tous ces champs.

Leur présence doit être justifiée par :

- audit;
- synchronisation;
- versionnement;
- suppression logique;
- historique;
- concurrence.

---

# 7. Dates et heures

## 7.1 Instants

Les événements réels utilisent des timestamps UTC.

Exemples :

- mission démarrée;
- résidence terminée;
- paiement enregistré;
- synchronisation reçue.

Type recommandé :

```text
timestamptz
```

---

## 7.2 Dates métier

Les dates sans heure utilisent un type date.

Exemples :

- date de début de saison;
- date d’échéance;
- date de contrat;
- date de mission planifiée lorsque l’heure n’est pas encore fixée.

Type recommandé :

```text
date
```

---

## 7.3 Fuseau

L’affichage utilise le fuseau de l’organisation.

Le système doit conserver :

- timestamp UTC;
- fuseau de l’organisation;
- date originale de l’événement;
- éventuellement le décalage si nécessaire pour l’audit.

---

# 8. Argent

Les montants financiers doivent utiliser une convention unique.

Recommandation :

```text
Stockage en cents entiers
```

Exemple :

```ts
type Money = {
  amountCents: number
  currency: 'CAD'
}
```

Si l’ancien schéma utilise `numeric`, la couche d’adaptation doit assurer :

- arrondi;
- conversion;
- validation;
- absence de flottants imprécis côté domaine.

---

# 9. Statuts et enums

Les statuts doivent être :

- limités;
- documentés;
- versionnés;
- contrôlés par contrainte;
- mappés vers un libellé français;
- compatibles avec RECA Opérateur lorsque partagé.

Éviter les champs texte libres pour les états métier.

Exemple conceptuel :

```ts
type MissionStatus =
  | 'PLANNED'
  | 'READY'
  | 'IN_PROGRESS'
  | 'PAUSED'
  | 'COMPLETED'
  | 'CANCELLED'
```

La valeur DB peut temporairement conserver une convention héritée.

Une couche d’adaptation doit alors convertir vers le nouveau modèle.

---

# 10. Authentification et profils

Le modèle doit distinguer :

```text
auth.users
Identité technique Supabase Auth

users
Profil applicatif

employees
Personne employée par l’organisation

operators
Capacité ou profil opérationnel terrain
```

Selon le besoin final, `operator` peut être :

- un rôle d’employé;
- une projection;
- une table spécialisée;
- une combinaison de permissions.

La décision finale sera détaillée dans `05-Authentication-Roles-Permissions.md`.

---

# 11. Entité User

Structure conceptuelle :

```ts
type User = {
  id: UserId
  authUserId: string
  organizationId: OrganizationId
  displayName: string
  email: string
  status: UserStatus
  theme: 'light' | 'dark' | 'system'
  createdAt: string
  updatedAt: string
}
```

Ne pas stocker :

- mot de passe;
- jeton;
- secret;
- clé de session.

---

# 12. Entité Role

Un rôle regroupe des permissions.

Exemples :

```text
ADMINISTRATOR
DISPATCHER
SALES_REPRESENTATIVE
ACCOUNTING
MANAGER
OPERATOR
```

Le rôle ne remplace pas les permissions.

Un utilisateur peut éventuellement posséder plusieurs rôles.

---

# 13. Entité Permission

Exemples :

```text
client.read
client.create
client.update
contract.manage
route.manage
mission.dispatch
mission.supervise
invoice.manage
payment.record
settings.manage
```

Le modèle peut utiliser :

- table `roles`;
- table `permissions`;
- table `role_permissions`;
- table `user_roles`.

Une première version plus simple est possible si les permissions demeurent centralisées et évolutives.

---

# 14. Entité Lead

Le Lead représente un prospect avant la création d’un Client.

Structure conceptuelle :

```ts
type Lead = {
  id: LeadId
  organizationId: OrganizationId
  number: string
  firstName?: string
  lastName?: string
  companyName?: string
  phone?: string
  email?: string
  address?: PostalAddress
  source?: LeadSource
  requestedService?: string
  message?: string
  status: LeadStatus
  assignedTo?: UserId
  nextReminderAt?: string
  createdAt: string
  updatedAt: string
}
```

Relations :

```text
Lead
  ├── Notes
  ├── Rappels
  ├── Événements
  └── Soumissions
```

---

# 15. Statuts Lead

Exemple conceptuel :

```text
NEW
CONTACTED
QUALIFIED
QUOTE_PREPARED
QUOTE_SENT
WON
LOST
ARCHIVED
```

Les valeurs finales doivent respecter les flux validés de l’ancienne application.

---

# 16. Entité Quote

La Soumission représente une proposition commerciale.

Structure conceptuelle :

```ts
type Quote = {
  id: QuoteId
  organizationId: OrganizationId
  number: string
  leadId?: LeadId
  clientId?: ClientId
  status: QuoteStatus
  subtotalCents: number
  taxTotalCents: number
  totalCents: number
  validUntil?: string
  notes?: string
  createdAt: string
  updatedAt: string
}
```

Relations :

```text
Quote
  ├── Lead
  ├── Client
  ├── Items
  ├── Documents
  ├── Events
  └── Conversion
```

---

# 17. Entité Client

Le Client représente une personne ou une entreprise.

Structure conceptuelle :

```ts
type Client = {
  id: ClientId
  organizationId: OrganizationId
  number: string
  type: 'RESIDENTIAL' | 'COMMERCIAL'
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED'
  language: 'FR' | 'EN'
  firstName?: string
  lastName?: string
  companyName?: string
  phone: string
  email?: string
  billingAddress?: PostalAddress
  createdAt: string
  updatedAt: string
}
```

---

# 18. Adresses Client

Un Client peut éventuellement posséder plusieurs adresses.

Modèle recommandé à moyen terme :

```text
client_addresses
```

Types possibles :

```text
BILLING
SERVICE
MAILING
OTHER
```

Pour la migration initiale, l’adresse principale existante peut être conservée sur `clients` si nécessaire.

La nouvelle architecture ne doit pas empêcher l’évolution vers plusieurs adresses.

---

# 19. Notes Client

Les notes doivent être une entité distincte.

```ts
type ClientNote = {
  id: ClientNoteId
  clientId: ClientId
  message: string
  authorId: UserId
  createdAt: string
  updatedAt?: string
  deletedAt?: string
}
```

Une note n’est pas un événement d’audit.

Les deux concepts peuvent apparaître dans la même timeline, mais doivent rester distincts.

---

# 20. Entité Contract

Le Contrat représente l’engagement permanent avec le client.

Structure conceptuelle :

```ts
type Contract = {
  id: ContractId
  organizationId: OrganizationId
  number: string
  clientId: ClientId
  serviceAddressId?: ClientAddressId
  status: ContractStatus
  season: string
  startDate: string
  endDate: string
  serviceType: ContractServiceType
  priceCents: number
  priceTaxMode: PriceTaxMode
  paymentMode: PaymentMode
  snowRemovalAreaSquareMeters?: number
  geometryVersion: number
  createdAt: string
  updatedAt: string
}
```

Le Contrat doit aussi référencer :

- clauses;
- modalités;
- services;
- zones;
- notes;
- documents;
- informations opérateur;
- échéancier;
- événements.

---

# 21. Statuts Contract

Exemple conceptuel :

```text
DRAFT
SIGNATURE_PENDING
ACTIVE
SUSPENDED
COMPLETED
CANCELLED
ARCHIVED
```

Un contrat suspendu peut demeurer dans une Route permanente.

Il doit être ignoré lors de la création d’une Mission si la règle métier le confirme.

---

# 22. Services Contract

Les services peuvent être stockés selon deux approches.

## Approche simple

```text
jsonb
```

Appropriée si :

- nombre de services limité;
- structure stable;
- peu de requêtes croisées.

## Approche relationnelle

```text
contract_services
```

Appropriée si :

- services réutilisables;
- tarification détaillée;
- statistiques;
- clauses;
- options par zone.

La décision finale sera prise après analyse du schéma existant.

---

# 23. Modalités de paiement

L’échéancier doit être structuré.

```ts
type PaymentScheduleEntry = {
  id: string
  description: string
  type: 'PERCENTAGE' | 'FIXED_AMOUNT'
  value: number
  dueDate: string
  order: number
}
```

Il doit permettre :

- génération de factures;
- historique;
- validation du total;
- règles de taxes;
- modification contrôlée.

---

# 24. Clauses Contract

Les clauses doivent être historisées.

Une modification des paramètres par défaut ne doit pas réécrire un ancien contrat.

Approches possibles :

```text
contracts.clauses_snapshot jsonb
```

ou :

```text
contract_clauses
```

Le contrat final doit conserver le texte ou la structure réellement accepté.

---

# 25. Informations terrain

Les informations destinées à l’opérateur doivent être séparées des notes internes générales.

Exemples :

- obstacles connus;
- consignes spéciales;
- message opérateur;
- emplacement de dépôt de neige;
- restrictions;
- accès;
- animaux;
- portail;
- priorité.

Ces données peuvent être copiées dans un MissionItem lors de la création de Mission.

---

# 26. Entité ContractZone

La zone représente une surface précise à déneiger.

Structure conceptuelle :

```ts
type ContractZone = {
  id: ContractZoneId
  contractId: ContractId
  type: ContractZoneType
  label: string
  geometry: GeoJSON.Polygon
  areaSquareMeters: number
  order: number
  source: GeometrySource
  partiallyHidden: boolean
  version: number
  capturedImagePath?: string
  createdAt: string
  updatedAt: string
  deletedAt?: string
}
```

---

# 27. Types de zone

Exemples :

```text
DRIVEWAY
PARKING
SIDEWALK
STAIRS
MANEUVERING_AREA
TERRACE
OTHER
```

Les types doivent être confirmés selon le modèle existant.

---

# 28. Géométrie Contract

Le Contrat peut posséder une représentation unifiée.

```ts
type SnowRemovalGeometry = {
  type: 'MultiPolygon'
  coordinates: number[][][][]
}
```

Cette géométrie représente l’union logique des zones actives.

Elle peut être stockée dans :

```text
contracts.snow_geometry
```

ou générée à partir de `contract_zones`.

Le choix dépendra :

- des performances;
- de la migration;
- des besoins RECA Opérateur;
- des capacités PostGIS;
- du versionnement.

---

# 29. Zone GPS

La zone GPS opérationnelle est distincte de la géométrie exacte.

```ts
type GpsGeometry = {
  geometry: GeoJSON.Polygon | GeoJSON.MultiPolygon
  sourceGeometryVersion: number
  algorithmVersion: string
  bufferMeters?: number
}
```

Elle peut être :

- simplifiée;
- élargie;
- adaptée à la précision GPS;
- recalculée.

Elle doit toujours indiquer la version de géométrie source.

---

# 30. Versionnement de géométrie

Chaque changement significatif doit incrémenter :

```text
geometry_version
```

Objectifs :

- savoir quelle géométrie a été utilisée;
- figer les MissionItems;
- détecter une divergence;
- faciliter les migrations;
- permettre un recalcul.

---

# 31. Statut de géométrie

Exemple :

```text
VALID
NEEDS_REVIEW
MISSING
MIGRATED
INVALID
```

Un contrat sans géométrie peut être actif si la règle métier l’autorise.

Le système doit toutefois pouvoir le signaler comme incomplet.

---

# 32. Entité Route

Une Route est un modèle permanent.

```ts
type Route = {
  id: RouteId
  organizationId: OrganizationId
  number: string
  name: string
  status: RouteStatus
  sector?: string
  defaultOperatorId?: EmployeeId
  defaultEquipmentId?: EquipmentId
  notes?: string
  createdAt: string
  updatedAt: string
}
```

---

# 33. RouteItem

L’ordre des Contrats appartient à une entité dédiée.

```ts
type RouteItem = {
  id: RouteItemId
  routeId: RouteId
  contractId: ContractId
  order: number
  status: RouteItemStatus
  priority?: number
  notes?: string
  createdAt: string
  updatedAt: string
}
```

Éviter de stocker une liste d’identifiants dans un tableau JSON si l’ordre doit être édité, filtré et historisé.

---

# 34. Statuts Route

Exemple :

```text
DRAFT
ACTIVE
INACTIVE
ARCHIVED
```

---

# 35. Affectations Route

Une Route peut posséder des affectations par défaut.

Ces affectations ne remplacent pas celles d’une Mission.

```text
route.default_operator_id
route.default_equipment_id
```

ou table dédiée si l’historique est requis.

---

# 36. Entité Mission

Une Mission représente une exécution réelle.

```ts
type Mission = {
  id: MissionId
  organizationId: OrganizationId
  number: string
  routeId?: RouteId
  scheduledDate: string
  scheduledStartAt?: string
  operatorId?: EmployeeId
  equipmentId?: EquipmentId
  status: MissionStatus
  startedAt?: string
  completedAt?: string
  pausedAt?: string
  notes?: string
  sourceRouteVersion?: number
  createdAt: string
  updatedAt: string
}
```

---

# 37. Mission créée à partir d’une Route

Flux officiel :

```text
Route active
      ↓
RouteItems ordonnés
      ↓
Contrats actifs seulement
      ↓
Création Mission
      ↓
Création MissionItems figés
```

Les contrats suspendus ou inactifs doivent être ignorés selon les règles métier.

---

# 38. MissionItem

Un MissionItem est une copie opérationnelle d’un Contrat.

```ts
type MissionItem = {
  id: MissionItemId
  missionId: MissionId
  contractId?: ContractId
  order: number
  status: MissionItemStatus

  contractNumber: string
  clientName: string
  serviceAddress: PostalAddress
  location: GeoPoint

  snowGeometry?: GeoJSON.MultiPolygon
  gpsGeometry?: GeoJSON.Polygon | GeoJSON.MultiPolygon
  geometryVersion?: number

  operatorMessage?: string
  knownObstacles?: string
  specialInstructions?: string

  travelStartedAt?: string
  approachStartedAt?: string
  workStartedAt?: string
  completedAt?: string

  travelDurationSeconds?: number
  workDurationSeconds?: number

  problemCode?: string
  problemNotes?: string

  createdAt: string
  updatedAt: string
}
```

---

# 39. Pourquoi figer MissionItem

Une Mission passée doit conserver :

- l’adresse utilisée;
- l’ordre;
- les instructions;
- la géométrie;
- le client affiché;
- le contrat source;
- les paramètres opérationnels.

Une modification du Contrat après la création de Mission ne doit pas modifier silencieusement le travail déjà planifié.

---

# 40. Statuts Mission

Exemple officiel à confirmer avec RECA Opérateur :

```text
ASSIGNED
READY
IN_PROGRESS
PAUSED
COMPLETED
CANCELLED
```

Le mapping avec les valeurs historiques de l’ancienne base doit être documenté.

---

# 41. Statuts MissionItem

Exemple officiel :

```text
WAITING
EN_ROUTE
APPROACHING
IN_PROGRESS
COMPLETED
PROBLEM
SKIPPED
CANCELLED
```

Ces valeurs doivent être partagées ou générées entre les deux applications.

---

# 42. Une seule résidence active

Invariance opérationnelle :

```text
Une Mission ne doit jamais avoir plus d’un MissionItem actif.
```

États considérés actifs :

```text
EN_ROUTE
APPROACHING
IN_PROGRESS
```

Cette règle doit être protégée :

- dans le domaine;
- dans les transactions;
- dans les tests;
- éventuellement dans une contrainte ou une procédure DB.

---

# 43. Transition State

Les transitions doivent être historisées.

```ts
type MissionItemTransition = {
  id: string
  missionId: MissionId
  missionItemId: MissionItemId
  fromStatus: MissionItemStatus
  toStatus: MissionItemStatus
  source: TransitionSource
  occurredAt: string
  receivedAt: string
  operatorId?: EmployeeId
  deviceId?: string
  correlationId?: string
  metadata?: Record<string, unknown>
}
```

---

# 44. Source de transition

Exemples :

```text
GPS
OPERATOR
DISPATCHER
SYSTEM
SYNC_RECOVERY
ADJACENT_RESIDENCE_FALLBACK
```

Le système doit distinguer une transition automatique d’une correction manuelle.

---

# 45. Temps original et temps reçu

Pour les événements hors ligne, conserver :

```text
occurred_at
received_at
```

`occurred_at` :

- moment réel sur le terrain.

`received_at` :

- moment de synchronisation serveur.

Ne pas remplacer l’heure originale par l’heure de réception.

---

# 46. Entité Problem

Un problème doit être une entité structurée.

```ts
type MissionProblem = {
  id: MissionProblemId
  organizationId: OrganizationId
  missionId: MissionId
  missionItemId?: MissionItemId
  contractId?: ContractId
  code: ProblemCode
  severity: ProblemSeverity
  status: ProblemStatus
  description?: string
  reportedBy?: UserId
  reportedAt: string
  resolvedBy?: UserId
  resolvedAt?: string
  resolutionNotes?: string
}
```

---

# 47. Codes de problème

Exemples :

```text
ACCESS_BLOCKED
VEHICLE_PRESENT
SNOW_DEPOSIT_UNAVAILABLE
PROPERTY_NOT_FOUND
DANGEROUS_CONDITION
EQUIPMENT_PROBLEM
CLIENT_REQUEST
OTHER
```

Les codes doivent être configurables ou versionnés selon le besoin.

---

# 48. Alert

Une alerte est une information à présenter avant ou pendant l’exécution.

```ts
type MissionAlert = {
  id: MissionAlertId
  missionId?: MissionId
  missionItemId?: MissionItemId
  contractId?: ContractId
  type: AlertType
  priority: AlertPriority
  message: string
  validFrom?: string
  validUntil?: string
  acknowledgedAt?: string
}
```

Une alerte n’est pas nécessairement un problème.

---

# 49. Employee

```ts
type Employee = {
  id: EmployeeId
  organizationId: OrganizationId
  userId?: UserId
  firstName: string
  lastName: string
  phone?: string
  email?: string
  status: EmployeeStatus
  canOperate: boolean
  createdAt: string
  updatedAt: string
}
```

---

# 50. Equipment

```ts
type Equipment = {
  id: EquipmentId
  organizationId: OrganizationId
  number: string
  name: string
  type: EquipmentType
  status: EquipmentStatus
  make?: string
  model?: string
  year?: number
  plate?: string
  notes?: string
  createdAt: string
  updatedAt: string
}
```

---

# 51. Statuts Equipment

Exemple :

```text
AVAILABLE
ASSIGNED
IN_USE
MAINTENANCE
OUT_OF_SERVICE
ARCHIVED
```

Le statut ne doit pas être automatiquement déduit uniquement d’une assignation historique.

---

# 52. Affectations

Une affectation opérationnelle doit conserver son contexte.

```ts
type ResourceAssignment = {
  id: string
  organizationId: OrganizationId
  employeeId: EmployeeId
  equipmentId?: EquipmentId
  routeId?: RouteId
  missionId?: MissionId
  startsAt?: string
  endsAt?: string
  status: AssignmentStatus
}
```

La V1 peut utiliser des champs directs sur Route/Mission.

La table dédiée devient pertinente si :

- historique;
- chevauchement;
- disponibilité;
- plusieurs affectations;
- planification avancée.

---

# 53. Invoice

```ts
type Invoice = {
  id: InvoiceId
  organizationId: OrganizationId
  number: string
  clientId: ClientId
  contractId?: ContractId
  status: InvoiceStatus
  issuedDate: string
  dueDate: string
  subtotalCents: number
  taxTotalCents: number
  totalCents: number
  paidCents: number
  balanceCents: number
  createdAt: string
  updatedAt: string
}
```

---

# 54. Statuts Invoice

Exemple :

```text
DRAFT
ISSUED
PARTIALLY_PAID
PAID
OVERDUE
CANCELLED
```

Le statut doit être calculé ou mis à jour de manière transactionnelle.

---

# 55. InvoiceItem

```ts
type InvoiceItem = {
  id: InvoiceItemId
  invoiceId: InvoiceId
  description: string
  quantity: number
  unitPriceCents: number
  subtotalCents: number
  taxCode?: string
  order: number
}
```

---

# 56. Payment

```ts
type Payment = {
  id: PaymentId
  organizationId: OrganizationId
  number: string
  clientId: ClientId
  invoiceId: InvoiceId
  amountCents: number
  method: PaymentMethod
  receivedAt: string
  reference?: string
  status: PaymentStatus
  recordedBy: UserId
  cancelledAt?: string
  cancelledBy?: UserId
  cancellationReason?: string
}
```

---

# 57. Enregistrement de Payment

L’opération doit être atomique :

```text
Insérer Payment
      ↓
Recalculer paidCents
      ↓
Recalculer balanceCents
      ↓
Mettre à jour InvoiceStatus
      ↓
Créer Event
```

---

# 58. Payment non modifiable

Une fois enregistré, un paiement ne doit pas être modifié arbitrairement.

Actions permises :

- enregistrer;
- annuler;
- recréer correctement.

Cette règle conserve un historique financier fiable.

---

# 59. Document

Les documents doivent avoir une table de métadonnées.

```ts
type Document = {
  id: DocumentId
  organizationId: OrganizationId
  entityType: DocumentEntityType
  entityId: string
  type: DocumentType
  storagePath: string
  fileName: string
  mimeType: string
  sizeBytes: number
  version: number
  createdAt: string
  createdBy: UserId
}
```

---

# 60. Storage

Les buckets doivent être privés par défaut pour les documents sensibles.

Exemples :

```text
contract-captures
contract-documents
client-documents
mission-photos
equipment-documents
```

Le chemin doit inclure :

- organisation;
- entité;
- identifiant;
- type;
- version.

---

# 61. Signed URLs

Une URL signée est temporaire.

Elle ne doit jamais être stockée comme URL permanente.

Stocker :

```text
bucket
storage_path
```

Générer l’URL à la demande.

---

# 62. Note

Les notes peuvent suivre un modèle générique ou par domaine.

Option générique :

```ts
type Note = {
  id: NoteId
  organizationId: OrganizationId
  entityType: NoteEntityType
  entityId: string
  message: string
  authorId: UserId
  createdAt: string
  updatedAt?: string
  deletedAt?: string
}
```

Option spécialisée :

```text
client_notes
contract_notes
mission_notes
```

Le choix final dépendra :

- des politiques RLS;
- des requêtes;
- des besoins de relation;
- de la migration.

---

# 63. Event

Le système doit posséder un journal d’événements unifié ou compatible.

```ts
type DomainEventRecord = {
  id: EventId
  organizationId: OrganizationId
  entityType: string
  entityId: string
  eventType: string
  actorId?: UserId
  source: EventSource
  occurredAt: string
  receivedAt: string
  correlationId?: string
  payload?: Record<string, unknown>
}
```

---

# 64. Event source

Exemples :

```text
RECA_APP_V2
RECA_OPERATOR
LEGACY_RECA_APP
SYSTEM
EDGE_FUNCTION
MIGRATION
```

---

# 65. Payload Event

Le payload doit être minimal.

Il peut contenir :

- ancien statut;
- nouveau statut;
- identifiant lié;
- raison;
- version;
- métadonnées utiles.

Ne pas copier automatiquement une entité complète dans chaque événement.

---

# 66. Audit

Les changements critiques doivent conserver :

- acteur;
- date;
- source;
- ancienne valeur utile;
- nouvelle valeur utile;
- corrélation.

Exemples :

- statut de contrat;
- géométrie;
- affectation;
- mission;
- paiement;
- rôle;
- paramètres;
- annulation.

---

# 67. Settings

Les paramètres doivent être structurés.

Approches possibles :

```text
settings
organization_settings
module_settings
```

Catégories :

- entreprise;
- taxes;
- modules;
- contrat;
- missions;
- notifications;
- IA;
- cartes;
- identité visuelle;
- intégrations.

Éviter un seul objet JSONB géant sans schéma ni version.

---

# 68. Configuration versionnée

Chaque configuration JSON importante doit posséder :

```text
schema_version
updated_at
updated_by
```

Les schémas Zod doivent valider la configuration à la lecture.

---

# 69. Feature Flags

Structure conceptuelle :

```ts
type FeatureFlag = {
  key: string
  organizationId: OrganizationId
  enabled: boolean
  configuration?: Record<string, unknown>
  updatedAt: string
}
```

---

# 70. Search Index

La recherche globale doit pouvoir indexer :

- numéros;
- noms;
- adresses;
- téléphones;
- courriels;
- routes;
- missions;
- équipements.

Solutions possibles :

- colonnes normalisées;
- `pg_trgm`;
- `tsvector`;
- vue matérialisée;
- RPC de recherche;
- table d’index consolidée.

La décision sera approfondie dans `14-Search-Notifications-and-History.md`.

---

# 71. Projections du Dashboard

Le Dashboard ne doit pas reconstruire tout le système côté navigateur.

Projections recommandées :

```text
operations_today
mission_progress_summary
open_problems_summary
resource_assignment_summary
sync_health_summary
financial_attention_summary
recent_activity
```

Implémentation possible :

- vues;
- vues matérialisées;
- fonctions SQL;
- RPC;
- requêtes agrégées.

---

# 72. Fraîcheur des projections

Chaque projection doit fournir :

```text
generated_at
source_updated_at
```

L’interface doit pouvoir distinguer :

- direct;
- presque direct;
- agrégé;
- potentiellement périmé.

---

# 73. Realtime

Les tables pertinentes peuvent publier :

- Mission;
- MissionItem;
- Problem;
- Event;
- Assignment;
- SyncStatus.

Le client doit ensuite relire la donnée autoritative.

---

# 74. SynchronizationOperation

Pour les opérations provenant de RECA Opérateur :

```ts
type SynchronizationOperation = {
  id: string
  organizationId: OrganizationId
  deviceId: string
  missionId: MissionId
  operationType: string
  entityType: string
  entityId: string
  sequence: number
  idempotencyKey: string
  occurredAt: string
  receivedAt?: string
  status: SyncOperationStatus
  retryCount: number
  payload: Record<string, unknown>
  errorCode?: string
}
```

---

# 75. Idempotence

Toute opération synchronisée doit posséder :

```text
idempotency_key
```

Le serveur doit refuser ou reconnaître les doublons sans reproduire l’effet.

---

# 76. Séquence

Les opérations d’une Mission peuvent posséder un numéro de séquence.

Objectifs :

- détecter une opération manquante;
- conserver l’ordre;
- diagnostiquer;
- résoudre les conflits.

---

# 77. Statuts de synchronisation

Exemple :

```text
PENDING
PROCESSING
APPLIED
REJECTED
CONFLICT
FAILED
```

---

# 78. Device

Les appareils terrain peuvent être enregistrés.

```ts
type Device = {
  id: DeviceId
  organizationId: OrganizationId
  userId?: UserId
  platform: 'IOS' | 'ANDROID'
  appVersion: string
  lastSeenAt?: string
  status: DeviceStatus
}
```

Ne jamais stocker des identifiants publicitaires inutiles.

---

# 79. Sync Health

Une projection peut résumer :

- dernière synchronisation;
- opérations en attente;
- conflits;
- version application;
- mission;
- appareil;
- opérateur.

---

# 80. Concurrence

Les entités sensibles doivent utiliser un contrôle de concurrence.

Approches :

```text
version integer
updated_at
etag logique
```

Exemple :

```sql
UPDATE contracts
SET ..., version = version + 1
WHERE id = :id
  AND version = :expected_version
```

Une modification concurrente doit produire un conflit explicite.

---

# 81. Snapshots

Les données qui doivent rester historiques utilisent un snapshot.

Exemples :

- MissionItem;
- contrat signé;
- facture émise;
- document PDF;
- échéancier;
- géométrie utilisée;
- instructions opérateur.

Le snapshot ne doit pas être recalculé à partir de données actuelles lorsqu’on consulte un événement passé.

---

# 82. Historique Contract

Le Contrat peut conserver :

- versions;
- événements;
- documents;
- géométries;
- notes.

Une table possible :

```text
contract_versions
```

Chaque version peut stocker un snapshot JSON validé.

La V1 peut utiliser une approche plus légère si les événements et documents suffisent.

---

# 83. Historique Route

Le changement d’ordre peut être enregistré.

Exemples :

```text
RouteItemAdded
RouteItemRemoved
RouteItemReordered
RouteAssignmentChanged
```

Une Mission conserve son ordre figé même si la Route change ensuite.

---

# 84. Historique Mission

La Mission doit conserver :

- création;
- assignations;
- démarrage;
- pauses;
- reprises;
- problèmes;
- transitions;
- fin;
- corrections;
- synchronisation.

---

# 85. Suppression logique

Entités généralement archivées :

- Client;
- Contract;
- Route;
- Employee;
- Equipment;
- Invoice.

Entités généralement annulées :

- Mission;
- Payment;
- Quote.

Entités pouvant être supprimées logiquement :

- Note;
- Zone;
- Document metadata.

---

# 86. Suppression physique

La suppression physique doit être rare.

Permise principalement pour :

- données de test;
- fichiers temporaires;
- données jamais publiées;
- erreurs de migration contrôlées;
- exigences légales validées.

Elle ne doit pas être accessible directement depuis les écrans métier ordinaires.

---

# 87. RLS par organisation

Politique conceptuelle :

```text
La ligne est accessible seulement si
organization_id appartient à l’utilisateur courant
et si la permission nécessaire est accordée.
```

---

# 88. RLS par affectation

Exemple RECA Opérateur :

```text
Un opérateur peut lire et mettre à jour
uniquement la Mission qui lui est assignée
et ses MissionItems.
```

Les règles détaillées seront définies dans `05-Authentication-Roles-Permissions.md`.

---

# 89. Données sensibles

Catégories sensibles :

- coordonnées client;
- courriel;
- téléphone;
- adresses;
- documents;
- factures;
- paiements;
- position opérateur;
- journaux de mission;
- informations utilisateur.

L’accès doit être limité au besoin réel.

---

# 90. Rétention

Une politique de rétention doit être définie pour :

- positions GPS brutes;
- logs;
- photos terrain;
- événements;
- documents;
- appareils;
- opérations de synchronisation.

Les positions GPS brutes ne doivent pas être conservées indéfiniment sans besoin explicite.

---

# 91. GPS brut contre données métier

Distinguer :

```text
GPS brut
Positions fréquentes

Événement métier
Entrée dans zone
Début intervention
Fin intervention
```

Les statistiques normales doivent reposer principalement sur les événements métier.

Le GPS brut peut être conservé temporairement pour :

- diagnostic;
- tests;
- litige;
- amélioration.

---

# 92. Qualité des données

Chaque module doit pouvoir détecter les données incomplètes.

Exemples :

- Client sans téléphone;
- Contrat sans zone;
- Route sans contrat;
- Mission sans opérateur;
- Mission sans équipement;
- Equipment indisponible;
- Invoice sans échéance;
- géométrie invalide.

---

# 93. Readiness

Des projections de préparation peuvent être calculées.

Exemple Contract :

```ts
type ContractReadiness = {
  contractId: ContractId
  isReadyForRoute: boolean
  missingFields: string[]
  warnings: string[]
}
```

Exemple Mission :

```ts
type MissionReadiness = {
  missionId: MissionId
  isReadyToDispatch: boolean
  hasOperator: boolean
  hasEquipment: boolean
  hasItems: boolean
  hasValidGeometry: boolean
}
```

---

# 94. Validation des données externes

Toute ligne provenant de Supabase doit être validée ou mappée explicitement.

Les réponses de :

- Edge Functions;
- IA;
- services cartographiques;
- géocodage;
- anciennes tables;
- RECA Opérateur;

doivent être validées.

---

# 95. Conventions SQL

Recommandations :

```text
snake_case
uuid
timestamptz
numeric ou bigint pour argent
jsonb uniquement avec schéma clair
check constraints
foreign keys
indexes explicites
```

---

# 96. Foreign Keys

Les relations doivent utiliser des clés étrangères lorsque possible.

Exemples :

```text
contracts.client_id → clients.id
route_items.route_id → routes.id
route_items.contract_id → contracts.id
missions.route_id → routes.id
mission_items.mission_id → missions.id
mission_items.contract_id → contracts.id
```

Un snapshot peut conserver une référence nullable vers une entité archivée.

---

# 97. Contraintes

Exemples :

```text
order >= 0
area_square_meters >= 0
amount_cents >= 0
end_date >= start_date
paid_cents <= total_cents
version >= 1
```

Les contraintes métier complexes restent dans les fonctions transactionnelles et le domaine.

---

# 98. Indexes

Indexes probables :

```text
organization_id
status
deleted_at
number
client_id
contract_id
route_id
mission_id
operator_id
equipment_id
scheduled_date
due_date
occurred_at
idempotency_key
```

Indexes de recherche :

```text
lower(name)
normalized_phone
normalized_email
postal_code
trigram address
```

---

# 99. Unique constraints

Exemples :

```text
organization_id + number
idempotency_key
route_id + contract_id + deleted_at condition
mission_id + order
```

La présence de doublons métier doit être évaluée explicitement.

---

# 100. Vues

Les vues peuvent simplifier les lectures.

Exemples :

```text
active_clients
active_contracts
mission_progress_view
invoice_balance_view
route_contract_summary
operator_sync_status_view
```

Les vues ne doivent pas cacher une logique métier critique impossible à tester.

---

# 101. RPC

Les RPC sont recommandées pour les transactions critiques.

Exemples :

```text
create_contract_with_schedule
create_mission_from_route
record_payment
cancel_payment
reorder_route_items
apply_operator_sync_batch
```

---

# 102. Edge Functions

Utiliser une Edge Function lorsque :

- un secret serveur est requis;
- un fournisseur externe est appelé;
- un traitement ne doit pas être exposé au navigateur;
- une transaction dépasse les capacités simples du client;
- un document doit être généré;
- une analyse IA doit être exécutée.

Ne pas utiliser une Edge Function pour contourner une fonction SQL simple et atomique.

---

# 103. Migrations

Chaque migration doit être :

- ordonnée;
- documentée;
- idempotente lorsque pertinent;
- testée;
- compatible avec l’ancien frontend;
- additive autant que possible.

---

# 104. Stratégie Expand-Migrate-Contract

```text
1. Ajouter la nouvelle structure
2. Écrire dans les deux formats si nécessaire
3. Migrer les données
4. Basculer les lectures
5. Vérifier
6. Retirer l’ancien format plus tard
```

---

# 105. Legacy mappings

Un fichier de documentation doit lister :

```text
Ancienne table
Ancien champ
Nouveau concept
Nouvelle structure
Stratégie de migration
```

Exemple :

```text
contracts.statut = en_attente
      ↓
ContractStatus = SIGNATURE_PENDING
```

---

# 106. Anti-corruption layer

Les adapters hérités doivent vivre dans un emplacement identifiable.

Exemple :

```text
src/infrastructure/legacy/
├── legacyContractMapper.ts
├── legacyMissionMapper.ts
└── legacyStatusMappings.ts
```

Ils doivent être retirés lorsque la migration est terminée.

---

# 107. Double écriture

La double écriture est risquée.

Elle doit être utilisée seulement si :

- nécessaire pour la transition;
- centralisée;
- transactionnelle;
- surveillée;
- temporaire;
- documentée.

Éviter d’écrire séparément dans deux tables depuis le navigateur.

---

# 108. Backfill

Tout backfill doit :

- préserver l’existant;
- produire un rapport;
- identifier les erreurs;
- être relançable;
- éviter les valeurs inventées;
- marquer les données nécessitant une révision.

Exemple :

```text
geometry_status = NEEDS_REVIEW
```

---

# 109. Données de test

Les données de test doivent être identifiables.

Exemples :

```text
test_run_id
email avec domaine réservé
préfixe E2E
organisation de test
```

Elles doivent être nettoyées automatiquement lorsque possible.

---

# 110. Seed

Le seed doit fournir :

- organisation de développement;
- utilisateurs de rôles différents;
- clients;
- contrats;
- routes;
- missions;
- équipements;
- factures;
- problèmes;
- cas limites.

Les seeds ne doivent pas contenir de vraies données personnelles.

---

# 111. Environnement de développement

Le développement doit idéalement utiliser :

- projet Supabase distinct;
- base locale;
- ou environnement staging.

L’utilisation directe de la production doit être évitée.

---

# 112. Génération des types DB

Les types Supabase doivent être générés.

Exemple :

```text
database.types.ts
```

Ils représentent le schéma DB.

Ils ne remplacent pas les types du domaine.

---

# 113. Contrats partagés

Les contrats entre applications doivent être versionnés.

Exemple :

```ts
type OperatorMissionPayloadV1 = {
  schemaVersion: 1
  mission: OperatorMission
  items: OperatorMissionItem[]
}
```

---

# 114. Compatibilité de version

RECA App V2 doit connaître :

- version minimale supportée de RECA Opérateur;
- version du schéma de Mission;
- version de géométrie;
- version d’algorithme GPS.

---

# 115. Migration RECA Opérateur

Une modification de Mission ou MissionItem exige :

1. mise à jour du contrat;
2. compatibilité descendante;
3. test des deux applications;
4. déploiement ordonné;
5. documentation.

---

# 116. Données calculées

Certaines données ne doivent pas être stockées si elles sont facilement dérivables.

Exemples :

- nom complet;
- pourcentage de progression simple;
- solde si recalcul transactionnel possible;
- `hasOverdueInvoice`.

Mais une donnée calculée peut être persistée comme projection pour performance, à condition de préciser :

- source;
- méthode;
- fréquence;
- stratégie de recalcul.

---

# 117. Données dupliquées volontairement

Les snapshots contiennent volontairement des données dupliquées.

Exemple MissionItem :

```text
contract_number
client_name
service_address
operator_message
gps_geometry
```

Cette duplication est justifiée par l’historique et l’autonomie terrain.

---

# 118. Correction manuelle

Une correction d’événement opérationnel doit produire :

- nouvelle valeur;
- acteur;
- raison;
- date;
- événement d’audit.

Ne pas modifier silencieusement un temps historique sans trace.

---

# 119. Statistiques

Les statistiques peuvent utiliser :

- vues;
- agrégats;
- événements;
- snapshots;
- tables analytiques.

Elles doivent préciser :

- définition;
- population;
- période;
- unité;
- exclusions;
- fraîcheur.

---

# 120. Données analytiques futures

La structure doit permettre plus tard :

```text
mission_metrics
route_metrics
operator_metrics
equipment_metrics
contract_metrics
```

Ne pas créer ces tables avant d’avoir défini les indicateurs.

---

# 121. Vie privée

Le système doit minimiser :

- données GPS;
- données personnelles;
- données copiées dans les logs;
- accès inutile;
- conservation excessive.

Les rapports ne doivent pas exposer les données personnelles sans besoin.

---

# 122. Export

Les exports doivent respecter :

- permissions;
- organisation;
- filtres;
- données sensibles;
- format;
- audit.

Un export important peut produire un événement.

---

# 123. Import

Tout import doit :

- valider;
- prévisualiser;
- détecter les doublons;
- produire un rapport;
- être relançable;
- associer une source;
- journaliser l’auteur.

---

# 124. Critères de réussite

L’architecture des données est réussie si :

- les entités permanentes et opérationnelles sont séparées;
- les Missions conservent des snapshots fiables;
- les MissionItems sont compatibles avec RECA Opérateur;
- les géométries sont versionnées;
- les transitions conservent le temps original;
- les opérations synchronisées sont idempotentes;
- les paiements sont auditables;
- les routes demeurent permanentes;
- les missions demeurent historiques;
- les données appartiennent à une organisation;
- les suppressions ne détruisent pas l’historique;
- les transactions critiques sont atomiques;
- la migration depuis l’ancien schéma est possible sans interruption;
- les projections du Dashboard sont efficaces;
- les données sensibles sont protégées;
- les types partagés évitent les divergences.

---

# 125. Diagramme conceptuel principal

```text
Organization
 ├── Users
 ├── Employees
 ├── Equipment
 ├── Leads
 │    └── Quotes
 ├── Clients
 │    ├── Contracts
 │    │    ├── ContractZones
 │    │    ├── Documents
 │    │    ├── Notes
 │    │    └── Events
 │    ├── Invoices
 │    │    └── Payments
 │    └── Notes
 ├── Routes
 │    └── RouteItems
 │         └── Contract
 └── Missions
      ├── MissionItems
      │    ├── Contract snapshot
      │    ├── Geometry snapshot
      │    ├── Problems
      │    └── Transitions
      ├── Operator
      ├── Equipment
      └── Events
```

---

# 126. Flux de création d’une Mission

```text
Route
  ↓
Lire RouteItems actifs
  ↓
Lire Contrats actifs
  ↓
Valider MissionReadiness
  ↓
Créer Mission
  ↓
Copier les données utiles
  ↓
Créer MissionItems
  ↓
Figer ordre et géométries
  ↓
Créer événement MissionCreated
  ↓
Rendre disponible à RECA Opérateur
```

---

# 127. Flux de synchronisation opérateur

```text
Action terrain
  ↓
Écriture locale
  ↓
SyncOperation
  ↓
Envoi au serveur
  ↓
Validation idempotencyKey
  ↓
Application transactionnelle
  ↓
Transition / Problem / Event
  ↓
Mise à jour Mission
  ↓
Projection Dashboard
  ↓
Confirmation opérateur
```

---

# 128. Flux financier

```text
Contrat
  ↓
Échéancier
  ↓
Facture
  ↓
Paiement
  ↓
Recalcul solde
  ↓
Statut facture
  ↓
Événement financier
```

---

# 129. Règles non négociables

Ne pas modifier une Mission passée depuis les données actuelles du Contrat.

Ne pas modifier un paiement existant sans annulation traçable.

Ne pas stocker une URL signée comme donnée permanente.

Ne pas utiliser un texte libre pour un statut critique.

Ne pas accepter une opération synchronisée sans idempotence.

Ne pas écraser l’heure réelle terrain avec l’heure de réception.

Ne pas créer une donnée sans `organization_id` lorsque son appartenance est métier.

Ne pas supprimer physiquement une entité historique depuis l’interface ordinaire.

Ne pas copier aveuglément le schéma historique dans le nouveau domaine.

Ne pas modifier les contrats partagés sans version.

---

# 130. Décisions à confirmer dans les prochains documents

Les points suivants doivent être finalisés ultérieurement :

- modèle exact Role/Permission;
- organisation multi-tenant complète;
- table spécialisée Operator ou rôle Employee;
- structure relationnelle des services de Contrat;
- approche Note générique ou spécialisée;
- stockage `snow_geometry` calculé ou dérivé;
- utilisation de PostGIS;
- modèle d’événements unifié;
- stratégie de projection Dashboard;
- package partagé entre les deux applications;
- durée de conservation du GPS brut;
- structure finale des documents;
- stratégie de version Contract;
- environnement Supabase de développement.

Ces décisions doivent être reportées dans `memory.md` lorsqu’elles sont confirmées.

---

# 131. Résumé officiel

RECA App V2 utilise un modèle de données orienté métier.

Les concepts permanents sont :

```text
Client
Contrat
Zone
Route
Employé
Équipement
```

Les concepts événementiels sont :

```text
Mission
MissionItem
Transition
Problème
Paiement
Événement
```

Une Route est permanente.

Une Mission est une exécution réelle.

Un MissionItem est un snapshot opérationnel.

La géométrie exacte et la zone GPS sont distinctes.

Les données terrain conservent l’heure originale.

La synchronisation utilise l’idempotence.

Les entités critiques conservent un historique.

La base existante peut être réutilisée, mais elle doit être encapsulée et migrée progressivement.

L’objectif est de garantir que chaque donnée conserve sa signification, son propriétaire, son historique et sa compatibilité avec l’ensemble du système RECA.
