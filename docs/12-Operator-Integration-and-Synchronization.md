# 12-Operator-Integration-and-Synchronization.md

# RECA
## Intégration avec RECA Opérateur et synchronisation

Version : 1.0  
Projet : RECA App V2  
Dépôt : `reca-app-v2`  
Application terrain : `reca-operateur`  
Statut : Spécification officielle d’intégration et de synchronisation  

---

# 1. Objectif du document

Ce document définit l’intégration officielle entre RECA App V2 et RECA Opérateur.

Il couvre :

- les responsabilités de chaque application;
- les contrats de données partagés;
- la publication des Missions;
- le téléchargement terrain;
- le fonctionnement hors ligne;
- la file d’opérations locale;
- l’idempotence;
- les séquences;
- les transitions;
- les problèmes;
- les positions GPS;
- la réconciliation;
- les conflits;
- les versions;
- les réassignations;
- la reprise après incident;
- la sécurité;
- l’observabilité;
- les tests;
- le déploiement progressif.

Ce document complète notamment :

```text
00-Vision.md
03-Application-Architecture.md
04-Data-Architecture.md
05-Authentication-Roles-Permissions.md
06-Operations-Center-Dashboard.md
08-Contracts-and-Measurement.md
09-Routes-Missions-and-Dispatch.md
10-Employees-and-Equipment.md
```

---

# 2. Vision générale

RECA App V2 est le centre de planification, de répartition et de supervision.

RECA Opérateur est l’application terrain utilisée pour exécuter une Mission.

```text
RECA App V2
Planifie, prépare, assigne et supervise
```

```text
RECA Opérateur
Exécute, enregistre et synchronise
```

Aucune application ne doit prendre silencieusement les responsabilités de l’autre.

---

# 3. Chaîne opérationnelle officielle

```text
Contrats
  ↓
Routes
  ↓
Missions
  ↓
MissionItems
  ↓
RECA Opérateur
  ↓
Synchronisation
  ↓
Historique
  ↓
Statistiques
```

RECA Opérateur consomme les Missions et MissionItems. Il ne consomme jamais directement les Routes pour exécuter le travail.

---

# 4. Principes non négociables

1. RECA Opérateur doit continuer à fonctionner temporairement sans connexion.
2. Une opération terrain ne doit jamais être perdue.
3. Une même opération ne doit jamais être appliquée deux fois.
4. L’heure terrain doit être conservée séparément de l’heure de réception.
5. Une Mission passée doit rester fidèle à son snapshot.
6. Une modification de Route ou Contrat ne doit pas modifier silencieusement une Mission active.
7. La base serveur demeure l’autorité finale après synchronisation.
8. L’état local demeure temporairement autoritatif pour les opérations non synchronisées.
9. Les conflits doivent être visibles et résolus explicitement.
10. Les contrats d’échange doivent être versionnés.

---

# 5. Responsabilité de RECA App V2

RECA App V2 doit :

- créer les Missions;
- créer les MissionItems;
- figer les données opérationnelles;
- assigner l’opérateur;
- assigner l’équipement;
- vérifier la préparation;
- publier la Mission;
- recevoir les opérations terrain;
- appliquer les transitions;
- superviser;
- résoudre les problèmes;
- gérer les réassignations;
- afficher la santé de synchronisation;
- conserver l’historique;
- calculer les projections;
- protéger les données.

---

# 6. Responsabilité de RECA Opérateur

RECA Opérateur doit :

- authentifier l’opérateur;
- charger uniquement sa Mission assignée;
- conserver la Mission localement;
- fonctionner hors ligne;
- guider l’opérateur;
- enregistrer les transitions;
- enregistrer les problèmes;
- enregistrer les temps;
- envoyer les opérations au serveur;
- reprendre les envois;
- afficher l’état de synchronisation;
- recevoir les mises à jour administratives compatibles;
- protéger le cache local.

---

# 7. Données interdites dans RECA Opérateur

RECA Opérateur ne doit pas charger inutilement :

- tous les Clients;
- tous les Contrats;
- toutes les Routes;
- toutes les Factures;
- tous les Paiements;
- les prix;
- les clauses commerciales complètes;
- les notes internes non pertinentes;
- les données d’autres opérateurs.

---

# 8. Contrats partagés

Les principaux contrats partagés sont :

```text
OperatorMission
OperatorMissionItem
OperatorIdentity
OperatorEquipment
MissionStatus
MissionItemStatus
MissionProblem
MissionAlert
MissionTransition
SyncOperation
SyncAcknowledgement
SyncConflict
OperatorAppCompatibility
```

---

# 9. Package partagé recommandé

Direction recommandée :

```text
@reca/contracts
```

Ce package peut contenir :

- types TypeScript;
- schémas Zod;
- enums stables;
- codes d’erreur;
- versions de payload;
- fixtures de contrat;
- utilitaires sans dépendance UI.

Il ne doit pas contenir :

- composants React;
- accès Supabase;
- logique cartographique;
- logique propre à une application;
- secrets;
- configuration d’environnement.

---

# 10. Alternative par génération

Une alternative acceptable est la génération depuis :

- JSON Schema;
- OpenAPI;
- schéma SQL;
- contrats versionnés.

Le choix final doit être confirmé après analyse des trois dépôts.

---

# 11. Interdiction de duplication manuelle

Il est interdit de conserver séparément dans les deux applications des enums non contrôlés comme :

```text
MissionStatus
MissionItemStatus
ProblemCode
TransitionSource
```

sans test automatique de compatibilité.

---

# 12. Version de schéma

Chaque payload majeur doit inclure :

```ts
schemaVersion: number
```

Exemple :

```ts
type OperatorMissionPayloadV1 = {
  schemaVersion: 1
  generatedAt: string
  mission: OperatorMissionV1
  items: OperatorMissionItemV1[]
}
```

---

# 13. Versions distinctes

Le système doit distinguer :

```text
schemaVersion
Structure du payload

missionVersion
État administratif de la Mission

geometryVersion
Version de la géométrie source

operatorAppVersion
Version de l’application terrain

algorithmVersion
Version de dérivation GPS
```

---

# 14. Compatibilité descendante

RECA App V2 doit connaître :

- la version minimale supportée de RECA Opérateur;
- la version recommandée;
- les versions bloquées;
- les schémas acceptés;
- la stratégie de migration locale.

Structure conceptuelle :

```ts
type OperatorAppCompatibility = {
  minimumSupportedVersion: string
  recommendedVersion: string
  blockedVersions: string[]
  supportedSchemaVersions: number[]
}
```

---

# 15. Version non supportée

Si l’application est trop ancienne :

```text
Cette version de RECA Opérateur n’est plus compatible.
Mettez l’application à jour avant de démarrer une nouvelle Mission.
```

Une Mission déjà active hors ligne doit suivre une stratégie de sécurité distincte.

---

# 16. Mission publiable

Une Mission peut être publiée à RECA Opérateur seulement si :

- son statut est `READY`;
- elle possède un opérateur;
- l’opérateur est admissible;
- elle possède un équipement valide selon la règle;
- elle possède au moins un MissionItem;
- ses MissionItems sont valides;
- ses données respectent le schéma;
- aucun conflit bloquant n’existe.

---

# 17. Mission disponible

Une Mission assignée devient disponible lorsque :

```text
mission.operator_id = employeeId de l’opérateur
et
mission.status ∈ {READY, IN_PROGRESS, PAUSED}
```

---

# 18. OperatorMission

Structure conceptuelle :

```ts
type OperatorMission = {
  id: MissionId
  number: string
  status: MissionStatus
  scheduledDate: string
  scheduledStartAt?: string

  operator: {
    employeeId: EmployeeId
    displayName: string
  }

  equipment?: {
    equipmentId: EquipmentId
    number: string
    name: string
    type: EquipmentType
  }

  route?: {
    routeId: RouteId
    number: string
    name: string
    sourceVersion?: number
  }

  totalItems: number
  missionVersion: number
  schemaVersion: number
  startedAt?: string
  pausedAt?: string
  completedAt?: string
  instructions?: string
  publishedAt: string
}
```

---

# 19. OperatorMissionItem

Structure conceptuelle :

```ts
type OperatorMissionItem = {
  id: MissionItemId
  missionId: MissionId
  contractId?: ContractId
  order: number
  status: MissionItemStatus

  contractNumber: string
  clientDisplayName: string
  clientPhone?: string

  serviceAddress: PostalAddress
  location: GeoPoint

  snowGeometry?: GeoJSON.MultiPolygon
  gpsGeometry?: GeoJSON.Polygon | GeoJSON.MultiPolygon
  geometryVersion?: number
  areaSquareMeters?: number

  operatorMessage?: string
  knownObstacles?: string
  specialInstructions?: string
  alerts: OperatorMissionAlert[]

  travelStartedAt?: string
  approachStartedAt?: string
  workStartedAt?: string
  completedAt?: string

  travelDurationSeconds?: number
  approachDurationSeconds?: number
  workDurationSeconds?: number

  problemCount: number
  itemVersion: number
}
```

---

# 20. Minimisation des données

Le payload doit contenir seulement les informations utiles au terrain.

Il peut contenir :

- téléphone si l’appel est autorisé;
- nom d’affichage;
- adresse;
- instructions;
- zones;
- alertes.

Il ne doit pas contenir :

- total du Contrat;
- solde Client;
- taxes;
- Soumissions;
- notes commerciales internes;
- informations financières.

---

# 21. Snapshot MissionItem

Le MissionItem doit figer :

- identité affichée;
- adresse;
- coordonnées;
- ordre;
- géométrie;
- version;
- superficie;
- instructions;
- alertes;
- références utiles.

---

# 22. Contrat modifié après publication

Une modification du Contrat ne change pas automatiquement un MissionItem publié.

Le Dispatcher doit voir :

```text
Le Contrat a été modifié depuis la création de la Mission.
```

Actions futures possibles :

- conserver le snapshot;
- appliquer certains changements;
- recréer la Mission;
- modifier manuellement avant départ.

---

# 23. Mises à jour avant démarrage

Avant `IN_PROGRESS`, certaines modifications peuvent être synchronisées :

- opérateur;
- équipement;
- ordre;
- retrait d’un MissionItem;
- ajout d’un MissionItem;
- instructions;
- alertes;
- heure planifiée.

Toute modification doit incrémenter `missionVersion`.

---

# 24. Mises à jour après démarrage

Après démarrage, les modifications administratives doivent être limitées.

Permises selon besoin :

- problème;
- alerte urgente;
- réassignation;
- équipement;
- pause;
- annulation;
- correction contrôlée.

À éviter :

- remplacement complet de la liste;
- changement silencieux d’adresse;
- changement silencieux de géométrie;
- réorganisation massive.

---

# 25. ChangeSet

Structure conceptuelle :

```ts
type MissionChangeSet = {
  missionId: MissionId
  fromVersion: number
  toVersion: number
  changes: MissionChange[]
  createdAt: string
  createdBy: UserId
}
```

Types de changement possibles :

```text
OPERATOR_CHANGED
EQUIPMENT_CHANGED
ITEM_ADDED
ITEM_REMOVED
ITEM_REORDERED
ALERT_ADDED
MISSION_PAUSED
MISSION_CANCELLED
```

---

# 26. Téléchargement initial

Flux officiel :

```text
Connexion Operator
      ↓
Résoudre User
      ↓
Résoudre Employee
      ↓
Vérifier permissions
      ↓
Chercher Mission assignée
      ↓
Télécharger payload
      ↓
Valider schéma
      ↓
Écrire localement
      ↓
Confirmer préparation locale
```

---

# 27. Atomicité locale

Le payload initial doit être enregistré localement de manière atomique.

Éviter :

- Mission enregistrée sans MissionItems;
- moitié de Mission;
- ancien cache mélangé au nouveau;
- suppression de l’ancien cache avant validation du nouveau.

---

# 28. Cache local

Le cache local doit être séparé par :

```text
authUserId
employeeId
missionId
schemaVersion
```

Il peut contenir :

- Mission;
- MissionItems;
- état local;
- transitions;
- problèmes;
- alertes;
- positions temporaires;
- opérations de synchronisation;
- métadonnées de version;
- dernière confirmation serveur.

---

# 29. Logout

Au logout :

- fermer les abonnements;
- supprimer la session;
- supprimer les données sensibles;
- conserver uniquement ce qui est requis pour une reprise contrôlée si la politique le permet;
- ne jamais mélanger deux utilisateurs.

---

# 30. Mode hors ligne

RECA Opérateur doit pouvoir continuer une Mission déjà chargée lorsque :

- la session était valide au téléchargement;
- la Mission était assignée;
- la période de grâce est valide;
- le cache local est valide;
- aucune révocation connue n’existe.

---

# 31. Limites du mode hors ligne

Le mode hors ligne permet :

- exécuter;
- enregistrer;
- progresser;
- signaler un problème;
- terminer localement.

Il ne permet pas nécessairement :

- télécharger une nouvelle Mission;
- changer d’organisation;
- réassigner;
- modifier le compte;
- charger des données administratives.

---

# 32. Période de grâce

Une période de grâce hors ligne peut être définie.

Exemple initial à confirmer :

```text
24 heures à partir de la dernière validation serveur
```

Elle doit être :

- configurable;
- liée à la Mission;
- liée à l’appareil;
- liée à l’opérateur;
- vérifiée au retour réseau.

---

# 33. Base locale

La technologie exacte dépend de l’implémentation actuelle de RECA Opérateur.

Elle doit fournir :

- persistance durable;
- transactions;
- requêtes;
- index;
- migrations de schéma;
- isolation par utilisateur;
- résistance aux fermetures.

---

# 34. File d’opérations

Chaque action terrain crée une opération locale.

```ts
type SyncOperation = {
  id: string
  idempotencyKey: string
  missionId: MissionId
  entityType: SyncEntityType
  entityId: string
  operationType: SyncOperationType
  sequence: number
  payload: Record<string, unknown>
  occurredAt: string
  createdAt: string
  status: SyncOperationStatus
  retryCount: number
  lastAttemptAt?: string
  errorCode?: string
}
```

---

# 35. SyncOperationStatus

```text
PENDING
SENDING
ACKNOWLEDGED
RETRY
CONFLICT
REJECTED
FAILED
```

---

# 36. IdempotencyKey

Chaque opération possède une clé unique stable.

Exemple :

```text
deviceId:missionId:sequence
```

ou UUID généré localement.

Le serveur doit appliquer une contrainte unique.

---

# 37. Séquence

Chaque Mission ou appareil possède une séquence croissante.

La séquence permet :

- conserver l’ordre;
- détecter un trou;
- détecter un doublon;
- diagnostiquer;
- résoudre les reprises.

Direction recommandée : appliquer les opérations dans l’ordre de `sequence`.

---

# 38. Batch de synchronisation

```ts
type OperatorSyncBatch = {
  schemaVersion: number
  deviceId: DeviceId
  operatorId: EmployeeId
  missionId: MissionId
  firstSequence: number
  lastSequence: number
  operations: SyncOperationPayload[]
  sentAt: string
}
```

Le nombre d’opérations et la taille du batch doivent être limités.

---

# 39. Application transactionnelle d’un batch

Le serveur doit :

1. authentifier;
2. vérifier l’opérateur;
3. vérifier la Mission;
4. vérifier l’affectation;
5. valider le schéma;
6. dédupliquer;
7. vérifier les séquences;
8. appliquer les opérations;
9. créer les événements;
10. recalculer les projections;
11. retourner les acknowledgements.

---

# 40. SyncAcknowledgement

```ts
type SyncAcknowledgement = {
  operationId: string
  idempotencyKey: string
  sequence: number
  status: 'APPLIED' | 'ALREADY_APPLIED' | 'REJECTED' | 'CONFLICT'
  serverReceivedAt: string
  serverEntityVersion?: number
  errorCode?: string
  message?: string
}
```

---

# 41. Déduplication

Si la même opération est reçue deux fois :

```text
ALREADY_APPLIED
```

Le serveur ne reproduit pas l’effet.

Une opération locale ne doit pas être supprimée avant acknowledgement.

---

# 42. Retry

Une opération échouée temporairement doit être réessayée avec backoff progressif et jitter.

Exemple conceptuel :

```text
5 s
15 s
30 s
1 min
5 min
```

Erreurs temporaires :

```text
NETWORK_UNAVAILABLE
TIMEOUT
SERVER_UNAVAILABLE
RATE_LIMITED
```

---

# 43. Erreurs permanentes

Exemples :

```text
MISSION_NOT_ASSIGNED
MISSION_CANCELLED
SCHEMA_NOT_SUPPORTED
OPERATION_INVALID
USER_DISABLED
```

Résultat :

```text
REJECTED
```

---

# 44. Conflits

Un conflit signifie que l’opération est valide en soi, mais incompatible avec l’état serveur.

Exemples :

- Mission réassignée;
- Mission annulée;
- MissionItem déjà terminé;
- changement de version;
- transition hors ordre;
- équipement remplacé;
- correction administrative concurrente.

---

# 45. SyncConflict

```ts
type SyncConflict = {
  id: string
  missionId: MissionId
  operationId: string
  type: SyncConflictType
  localState?: Record<string, unknown>
  serverState?: Record<string, unknown>
  createdAt: string
  status: 'OPEN' | 'RESOLVED' | 'DISMISSED'
  resolution?: SyncConflictResolution
  resolvedAt?: string
  resolvedBy?: UserId
}
```

---

# 46. Résolution des conflits

Résolution automatique permise seulement pour des cas simples et sûrs.

Résolution manuelle requise pour :

- transitions divergentes;
- Mission réassignée;
- Mission terminée sur deux appareils;
- opération après annulation;
- changement d’ordre pendant exécution;
- horodatages incohérents importants.

Résolutions possibles :

```text
KEEP_SERVER
APPLY_LOCAL
MERGE
DISCARD_LOCAL
RETRY
ADMINISTRATIVE_CORRECTION
```

---

# 47. Centre de conflits

RECA App V2 doit afficher un espace de supervision permettant de voir :

- Mission;
- opérateur;
- appareil;
- opération;
- état local;
- état serveur;
- heure;
- recommandation;
- action.

Une résolution doit conserver :

- acteur;
- date;
- choix;
- raison;
- ancienne valeur;
- nouvelle valeur;
- événements produits.

---

# 48. Machine d’état Mission

```text
PLANNED
  ↓
READY
  ↓
IN_PROGRESS
  ↓
PAUSED
  ↓
IN_PROGRESS
  ↓
COMPLETED
```

Annulation selon les règles de `09-Routes-Missions-and-Dispatch.md`.

---

# 49. Machine d’état MissionItem

```text
WAITING
  ↓
EN_ROUTE
  ↓
APPROACHING
  ↓
IN_PROGRESS
  ↓
COMPLETED
```

Branches :

```text
WAITING → SKIPPED
WAITING → CANCELLED
EN_ROUTE → PROBLEM
APPROACHING → PROBLEM
IN_PROGRESS → PROBLEM
```

---

# 50. Une seule résidence active

Le serveur doit garantir :

```text
maximum un MissionItem dans
EN_ROUTE, APPROACHING ou IN_PROGRESS
```

---

# 51. Transitions GPS

RECA Opérateur peut produire des transitions selon les règles validées :

```text
Approche à 250 m
Intervention à 30 m avec délai
Complétion après sortie à plus de 50 m
```

Les seuils doivent être centralisés et versionnés.

---

# 52. Cap et orientation

La rotation selon le cap doit être appliquée seulement après une stabilité suffisante.

Direction validée :

```text
2 à 3 secondes de stabilité
```

Cette logique reste dans RECA Opérateur. Le serveur n’a pas besoin de recevoir chaque variation de cap.

---

# 53. Géométrie GPS

RECA Opérateur utilise en priorité :

```text
MissionItem.gpsGeometry
```

Fallback temporaire possible :

```text
point + rayon
```

La méthode utilisée doit être identifiable :

```text
GPS_GEOMETRY
POINT_RADIUS
MANUAL
DISABLED
```

---

# 54. Géométrie invalide

Si la géométrie est absente ou invalide :

- afficher un avertissement;
- utiliser un fallback seulement si autorisé;
- ne pas inventer une géométrie;
- remonter un problème de préparation;
- enregistrer la méthode utilisée.

---

# 55. Position de supervision

Les positions GPS de supervision sont distinctes des transitions métier.

```ts
type OperatorPositionUpdate = {
  missionId: MissionId
  employeeId: EmployeeId
  deviceId: DeviceId
  latitude: number
  longitude: number
  accuracyMeters?: number
  heading?: number
  speedMetersPerSecond?: number
  recordedAt: string
  sentAt: string
}
```

---

# 56. Fréquence et rétention GPS

La fréquence doit dépendre :

- du mouvement;
- du premier plan;
- de la batterie;
- de la connexion;
- de la précision;
- de la Mission active.

La dernière position peut être conservée pour la supervision. L’historique brut doit avoir une rétention limitée. Les événements métier sont conservés durablement.

---

# 57. Précision GPS

Une position doit inclure `accuracyMeters` lorsque disponible.

Une précision insuffisante doit pouvoir empêcher une transition automatique.

---

# 58. Transition manuelle

L’opérateur peut corriger ou déclencher certaines transitions manuellement.

La source doit être :

```text
OPERATOR
```

Une correction administrative utilise :

```text
DISPATCHER
```

ou :

```text
ADMINISTRATIVE_CORRECTION
```

---

# 59. MissionItemTransition

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
  deviceId?: DeviceId
  sequence?: number
  correlationId?: string
  metadata?: Record<string, unknown>
}
```

---

# 60. Timers

Les durées doivent être calculées depuis les transitions.

Exemples :

```text
travelDurationSeconds
approachDurationSeconds
workDurationSeconds
pauseDurationSeconds
```

Pendant une coupure réseau, RECA Opérateur continue le timer local et envoie les transitions originales au retour.

---

# 61. Décalage d’horloge

Si l’horloge de l’appareil est incorrecte :

- détecter l’écart;
- conserver l’heure originale;
- enregistrer l’écart estimé;
- appliquer une correction contrôlée si nécessaire;
- signaler le conflit.

```ts
type ClockSkewInfo = {
  deviceTime: string
  serverTime: string
  estimatedSkewSeconds: number
}
```

---

# 62. Problèmes terrain

Un problème est synchronisé comme opération structurée.

```ts
type OperatorProblemPayload = {
  problemId: string
  missionId: MissionId
  missionItemId?: MissionItemId
  code: ProblemCode
  severity: ProblemSeverity
  description?: string
  occurredAt: string
  photoOperationIds?: string[]
}
```

---

# 63. Photos de problème

Une photo doit être téléversée dans un flux résilient.

Elle doit posséder :

- identifiant local;
- Mission;
- MissionItem;
- Problem;
- taille;
- type;
- checksum;
- statut d’upload.

Flux recommandé :

```text
Créer Problem local
  ↓
Synchroniser Problem
  ↓
Obtenir destination sécurisée
  ↓
Téléverser fichier
  ↓
Confirmer
  ↓
Lier au Problem
```

---

# 64. Photo en attente

Un Problem peut être reçu avant sa photo.

L’interface doit afficher :

```text
Photo en attente de synchronisation
```

Les images doivent être compressées selon une politique définie.

---

# 65. Réassignation d’opérateur

Flux officiel :

```text
Dispatcher réassigne
      ↓
MissionVersion incrémentée
      ↓
Ancien Operator perd l’accès
      ↓
Nouvel Operator reçoit la Mission
      ↓
Anciennes opérations non synchronisées vérifiées
      ↓
Conflit éventuel
```

---

# 66. Handoff

```ts
type MissionHandoff = {
  id: string
  missionId: MissionId
  fromOperatorId: EmployeeId
  toOperatorId: EmployeeId
  activeMissionItemId?: MissionItemId
  occurredAt: string
  createdBy: UserId
  reason: string
  pendingOperationCount: number
  status: 'PENDING' | 'COMPLETED' | 'CONFLICT'
}
```

Après le handoff :

- refuser les nouvelles opérations normales de l’ancien opérateur;
- accepter ou examiner les opérations antérieures à l’heure de transfert;
- marquer les opérations postérieures comme conflit;
- verrouiller ou nettoyer le cache lors du prochain contact.

---

# 67. Réassignation d’équipement

Le changement d’équipement doit :

- incrémenter MissionVersion;
- conserver l’historique;
- être synchronisé;
- afficher le nouvel équipement;
- conserver l’ancien dans les événements.

---

# 68. Pause et annulation administratives

RECA App V2 peut mettre une Mission en pause ou l’annuler.

RECA Opérateur doit recevoir l’état.

Si l’appareil est hors ligne :

- le serveur conserve le nouvel état;
- l’application le reçoit au retour;
- les opérations produites pendant la divergence sont examinées;
- un conflit est créé si nécessaire.

---

# 69. Mission terminée hors ligne

RECA Opérateur affiche :

```text
Terminée — synchronisation en attente
```

Toutes les opérations restent dans la file. La Mission devient `COMPLETED` côté serveur après validation.

---

# 70. Fin refusée

Le serveur peut refuser la complétion si :

- Mission annulée;
- opérateur réassigné;
- transitions manquantes;
- conflit critique;
- schéma invalide.

Le système doit créer un conflit visible.

---

# 71. Reprise après fermeture ou crash

Au redémarrage de RECA Opérateur :

1. restaurer la session;
2. restaurer la Mission;
3. restaurer le MissionItem actif;
4. restaurer les timers;
5. restaurer la file;
6. vérifier la connectivité;
7. reprendre la synchronisation.

Une opération locale doit être complètement écrite ou absente, jamais partielle.

---

# 72. SyncHealth

```ts
type OperatorSyncHealth = {
  missionId: MissionId
  employeeId: EmployeeId
  deviceId?: DeviceId
  lastSeenAt?: string
  lastPositionAt?: string
  lastSuccessfulSyncAt?: string
  pendingOperationCount: number
  retryOperationCount: number
  conflictCount: number
  failedOperationCount: number
  operatorAppVersion?: string
  schemaVersion?: number
  status: SyncHealthStatus
}
```

---

# 73. SyncHealthStatus

```text
HEALTHY
DEGRADED
OFFLINE
BLOCKED
UNKNOWN
```

Classification initiale à confirmer :

```text
HEALTHY
Dernière synchronisation < 2 min
Aucun conflit
Aucun échec
```

```text
DEGRADED
2 à 5 min
ou opérations en attente non bloquantes
```

```text
OFFLINE
> 5 min
```

```text
BLOCKED
Conflit ou opération permanente refusée
```

---

# 74. LastSeen et LastSync

```text
lastSeenAt
L’application a contacté le serveur

lastSuccessfulSyncAt
Une opération a été confirmée
```

Un opérateur peut être visible sans avoir de nouvelle opération à envoyer.

---

# 75. Dashboard

Le Centre des opérations doit afficher :

- état de synchronisation;
- dernière position;
- dernière opération;
- nombre d’opérations en attente;
- conflits;
- version de l’application;
- appareil;
- action disponible.

---

# 76. Onglet Synchronisation de la Mission

Afficher :

```text
Operator
Device
App version
Schema version
Last seen
Last sync
Pending operations
Conflicts
Failures
MissionVersion
Local version connue
```

Pour diagnostic, une liste contrôlée peut afficher :

- sequence;
- type;
- entity;
- occurredAt;
- receivedAt;
- statut;
- retry;
- erreur.

---

# 77. Realtime

RECA App V2 peut utiliser Realtime pour :

- transitions;
- Problems;
- Mission status;
- SyncHealth;
- positions;
- assignations.

RECA Opérateur peut l’utiliser pour :

- pause;
- annulation;
- réassignation;
- nouvelles alertes;
- changement d’équipement.

Toute mise à jour importante doit aussi pouvoir être récupérée par refetch.

---

# 78. Polling de secours

Lorsque Realtime est indisponible :

- polling contrôlé;
- fréquence adaptée;
- comparaison de MissionVersion;
- téléchargement du ChangeSet;
- avertissement de mode dégradé.

---

# 79. Endpoint de synchronisation

Direction conceptuelle :

```text
operator_sync_batch
```

Il peut être implémenté par :

- RPC PostgreSQL;
- Edge Function;
- API serveur.

Le choix doit privilégier :

- transaction;
- validation;
- sécurité;
- idempotence;
- observabilité.

---

# 80. Authentification des appels

Chaque appel doit vérifier :

- JWT;
- User actif;
- Employee lié;
- `canOperate`;
- permission;
- organisation;
- Mission assignée;
- Device si utilisé.

La clé `service_role` ne doit jamais être présente dans RECA Opérateur.

---

# 81. RLS et fonctions métier

L’opérateur doit pouvoir lire seulement :

- sa Mission;
- ses MissionItems;
- ses Problems;
- ses données de synchronisation.

Direction recommandée :

- lecture par RLS contrôlée;
- écriture métier via RPC spécialisées;
- aucun `UPDATE` large des MissionItems.

---

# 82. Device

```ts
type Device = {
  id: DeviceId
  organizationId: OrganizationId
  userId: UserId
  employeeId?: EmployeeId
  platform: 'IOS' | 'ANDROID'
  appVersion: string
  schemaVersion: number
  status: DeviceStatus
  registeredAt: string
  lastSeenAt?: string
  revokedAt?: string
}
```

Statuts :

```text
ACTIVE
REVOKED
LOST
INACTIVE
```

---

# 83. Appareil perdu

Actions :

- révoquer le Device;
- révoquer la session;
- bloquer les nouvelles opérations;
- réassigner si nécessaire;
- examiner les opérations en attente;
- créer un SecurityEvent.

Le DeviceId ne doit pas être un identifiant publicitaire.

---

# 84. Plusieurs appareils

Direction initiale recommandée :

```text
Un Operator peut avoir plusieurs appareils enregistrés,
mais une Mission active ne doit être contrôlée
que par un appareil principal.
```

Une session opérationnelle peut être utilisée :

```ts
type OperatorMissionSession = {
  id: string
  missionId: MissionId
  employeeId: EmployeeId
  deviceId: DeviceId
  status: 'ACTIVE' | 'PAUSED' | 'ENDED' | 'REVOKED'
  startedAt: string
  lastSeenAt?: string
  endedAt?: string
}
```

---

# 85. Deux appareils actifs

Si un deuxième appareil tente de contrôler la Mission :

- afficher un avertissement;
- bloquer ou demander un transfert;
- ne pas permettre des séquences concurrentes silencieuses.

---

# 86. Sécurité du cache

Le cache local doit être :

- minimisé;
- isolé;
- supprimé au logout;
- chiffré si la plateforme le permet;
- inaccessible à un autre User;
- versionné.

---

# 87. Migrations locales

Chaque migration locale doit :

- être testée;
- préserver la file;
- préserver la Mission;
- permettre une récupération;
- refuser clairement un schéma incompatible.

Une mise à jour forcée doit être évitée pendant une Mission active.

---

# 88. Observabilité

Mesurer :

- durée moyenne de synchronisation;
- taux de succès;
- retries;
- conflits;
- opérations rejetées;
- taille des batches;
- temps hors ligne;
- versions d’application;
- files non vidées;
- latence Realtime;
- crashs pendant Mission.

---

# 89. Logs Operator

Champs possibles :

- missionId;
- operationId;
- sequence;
- deviceId;
- appVersion;
- event;
- result;
- duration;
- errorCode.

Ne jamais journaliser :

- token;
- secret;
- données Client inutiles;
- payload complet par défaut.

---

# 90. Logs serveur

Les logs serveur doivent permettre de suivre :

```text
Batch reçu
Opérations validées
Doublons
Rejets
Conflits
Durée
MissionVersion
Actor
```

Un `correlationId` doit relier les appels, transactions, événements et incidents.

---

# 91. Alertes techniques

Créer une alerte si :

- file bloquée;
- conflit critique;
- plusieurs appareils actifs;
- version incompatible;
- Mission active sans synchronisation prolongée;
- taux d’échec élevé;
- opération rejetée répétitivement.

---

# 92. Outils de récupération administrative

Actions possibles :

```text
Réessayer les opérations
Télécharger un diagnostic
Résoudre un conflit
Réassigner
Forcer un refetch
Révoquer l’appareil
Recalculer la Mission
```

Toutes doivent être protégées par permission et audit.

---

# 93. Réconciliation complète

Flux officiel :

```text
Envoyer opérations locales
      ↓
Recevoir acknowledgements
      ↓
Télécharger état serveur
      ↓
Comparer versions
      ↓
Appliquer ChangeSet
      ↓
Valider invariants
      ↓
Mettre cache à jour
```

---

# 94. Validation après synchronisation

Vérifier :

- un seul MissionItem actif;
- ordre valide;
- statut Mission cohérent;
- timestamps cohérents;
- MissionVersion actuelle;
- aucune opération reconnue encore en attente d’application;
- aucun item inconnu.

Si une invariant échoue :

- mettre la synchronisation en `BLOCKED`;
- conserver les données;
- afficher une action;
- créer un incident.

---

# 95. Permissions

Permissions recommandées :

```text
operator_sync.read
operator_sync.supervise
operator_sync.resolve_conflict
operator_sync.retry
operator_sync.revoke_device
operator_sync.export_diagnostic
operator_sync.correct_history
```

---

# 96. Rôles

## Dispatcher

- santé de synchronisation;
- conflits simples;
- Mission;
- réassignation;
- Problems;
- retry.

## Manager

- supervision;
- conflits;
- réassignation;
- rapports.

## Administrator

- accès complet;
- Devices;
- compatibilité;
- diagnostics;
- corrections;
- révocation.

## Operator

- sa propre synchronisation;
- sa file;
- ses erreurs;
- ses actions de retry;
- sa Mission.

---

# 97. Événements de synchronisation

Exemples :

```text
OperatorMissionDownloaded
OperatorMissionStarted
SyncBatchReceived
SyncOperationApplied
SyncOperationDuplicate
SyncOperationRejected
SyncConflictCreated
SyncConflictResolved
OperatorWentOffline
OperatorCameOnline
DeviceRegistered
DeviceRevoked
MissionHandoffStarted
MissionHandoffCompleted
```

Tous les événements techniques ne doivent pas apparaître dans la timeline utilisateur.

---

# 98. UX RECA Opérateur

L’application doit toujours indiquer :

- Mission chargée;
- état de connexion;
- état de synchronisation;
- opérations en attente;
- problème bloquant;
- prochaine action.

Microcopy recommandée :

```text
Synchronisé il y a 18 s
```

```text
3 opérations en attente
```

```text
Hors ligne — le travail est enregistré sur l’appareil
```

```text
Synchronisation bloquée — communiquez avec la répartition
```

---

# 99. UX Dashboard

Le Dispatcher doit voir :

- qui est en ligne;
- qui est hors ligne;
- la dernière synchronisation;
- les opérations en attente;
- les conflits;
- la Mission active;
- les problèmes;
- l’action disponible.

---

# 100. Couleurs de synchronisation

```text
Vert
Synchronisé

Bleu
Envoi en cours

Ambre
En attente ou connexion dégradée

Rouge
Erreur ou conflit

Gris
Hors ligne connu
```

---

# 101. Performance

Objectifs :

- téléchargement Mission rapide;
- batch compact;
- file locale fluide;
- faible consommation batterie;
- peu de requêtes;
- reprise sans duplication;
- carte indépendante de la synchronisation;
- position envoyée de manière contrôlée.

---

# 102. Taille des payloads

Tester au minimum :

- 1 MissionItem;
- 30 MissionItems;
- 100 MissionItems;
- géométries complexes;
- plusieurs alertes;
- photos en attente.

Les géométries GPS peuvent être simplifiées pour l’exécution sans modifier la géométrie exacte du Contrat.

---

# 103. Tests unitaires des contrats

Tester :

- validation des payloads;
- compatibilité de versions;
- enums;
- schémas Zod;
- données minimales;
- données interdites.

---

# 104. Tests unitaires SyncQueue

Tester :

- ajout;
- séquence;
- retry;
- acknowledgement;
- doublon;
- rejet;
- conflit;
- reprise après crash;
- nettoyage.

---

# 105. Tests des machines d’état

Tester :

- transitions permises;
- transitions interdites;
- une résidence active;
- Mission complète;
- pause;
- reprise;
- annulation;
- fallback adjacent.

---

# 106. Tests de réconciliation

Tester :

- version égale;
- serveur plus récent;
- local plus récent;
- ChangeSet;
- conflit;
- opération déjà appliquée;
- horloge décalée.

---

# 107. Tests d’intégration serveur

Tester :

- authentification;
- affectation;
- RLS;
- batch;
- transaction;
- idempotence;
- séquence;
- Problem;
- fin de Mission;
- Device;
- Realtime;
- audit.

---

# 108. Tests d’intégration locale

Tester :

- stockage;
- migration locale;
- hors ligne;
- crash;
- redémarrage;
- changement User;
- mise à jour app;
- cache protégé.

---

# 109. Tests de contrat entre applications

À exécuter en CI :

```text
RECA App V2 produit payload V1
RECA Opérateur valide payload V1
RECA Opérateur produit SyncOperation V1
RECA App V2 valide SyncOperation V1
```

---

# 110. Tests E2E principaux

## Mission normale

```text
Créer Mission
  ↓
Marquer READY
  ↓
Operator télécharge
  ↓
Démarre
  ↓
Transitions
  ↓
Termine
  ↓
Dashboard = COMPLETED
```

## Hors ligne

```text
Operator télécharge
  ↓
Perd connexion
  ↓
Exécute 5 MissionItems
  ↓
File locale
  ↓
Retour réseau
  ↓
Batch
  ↓
Aucune perte
```

## Doublon

```text
Envoyer batch
  ↓
Réponse perdue
  ↓
Renvoyer
  ↓
ALREADY_APPLIED
```

## Réassignation

```text
Operator A actif
  ↓
Réassigner à Operator B
  ↓
A perd l’accès
  ↓
B télécharge
  ↓
Historique conservé
```

## Conflit

```text
Operator termine hors ligne
  ↓
Dispatcher annule serveur
  ↓
Retour réseau
  ↓
Conflit
  ↓
Résolution manuelle
```

---

# 111. Tests complémentaires

Tester aussi :

- version bloquée;
- appareil révoqué;
- photo en attente;
- géométrie absente;
- fallback point/rayon;
- batch hors ordre;
- deux appareils;
- handoff;
- Mission terminée hors ligne;
- horloge incorrecte.

---

# 112. Fixtures

Prévoir :

```text
Mission prête
Mission active
Mission en pause
Mission terminée localement
Mission annulée serveur
Mission réassignée
Operator hors ligne
Batch avec doublon
Batch hors ordre
Conflit de statut
Conflit d’heure
App ancienne
Device révoqué
Géométrie absente
Fallback point/rayon
Photo en attente
```

---

# 113. Environnements

Tester l’intégration dans :

```text
development
staging
production
```

Chaque environnement doit utiliser :

- base distincte;
- clés distinctes;
- Devices distincts;
- logs distincts;
- versions de compatibilité contrôlées.

---

# 114. Déploiement ordonné

Une modification de contrat doit suivre :

```text
1. Ajouter compatibilité serveur
2. Déployer serveur
3. Déployer RECA App V2
4. Déployer RECA Opérateur
5. Vérifier adoption
6. Retirer l’ancienne version plus tard
```

---

# 115. Migration de schéma partagée

Utiliser :

```text
Expand
  ↓
Support double version
  ↓
Migrer les clients
  ↓
Mesurer
  ↓
Retirer l’ancienne version
```

Un rollback doit préserver la file locale et les contrats supportés.

---

# 116. Migration depuis l’intégration existante

Avant modification :

1. inventorier les tables actuelles;
2. inventorier les statuts;
3. inventorier les payloads;
4. inventorier les règles GPS;
5. inventorier le stockage local;
6. inventorier les RPC;
7. inventorier les RLS;
8. inventorier les opérations hors ligne;
9. inventorier les appareils;
10. inventorier les incompatibilités;
11. inventorier les MissionItems historiques;
12. inventorier les erreurs réelles.

---

# 117. Faits déjà validés pour RECA Opérateur

Le système doit conserver :

- carte plein écran;
- tracteur fixe et carte mobile;
- MissionItems comme source terrain;
- transitions GPS;
- approche à 250 m;
- intervention à 30 m avec délai;
- complétion après sortie supérieure à 50 m;
- fallback résidences adjacentes;
- timer par phase;
- problèmes conservés;
- marqueurs terminés masqués;
- prochaines résidences limitées;
- fonctionnement hors ligne;
- synchronisation durable.

---

# 118. Mappings legacy

Créer un registre :

```text
Ancien payload
Nouveau payload
Transformation
Compatibilité
Date de retrait
```

Les Missions historiques peuvent recevoir :

```text
schema_version = 0
mission_version = 1
source = LEGACY
```

sans prétendre qu’elles utilisent le nouveau contrat.

---

# 119. Données historiques incomplètes

Ne pas inventer :

- sequence;
- deviceId;
- geometryVersion;
- receivedAt;
- source.

Utiliser des valeurs explicites comme :

```text
UNKNOWN
LEGACY
MIGRATED
```

selon le champ.

---

# 120. Feature flags

Exemples :

```text
operator_contracts_v1
operator_sync_batch_v1
operator_change_sets
operator_device_sessions
operator_gps_geometry
```

Ils doivent être temporaires et observables.

---

# 121. Critères de réussite métier

L’intégration est réussie si :

- le Dispatcher publie une Mission;
- l’opérateur la reçoit;
- l’opérateur travaille hors ligne;
- aucune action n’est perdue;
- les problèmes remontent;
- le Dashboard reflète l’état;
- les conflits sont visibles;
- une réassignation est contrôlée;
- une Mission passée reste intacte.

---

# 122. Critères de réussite technique

L’intégration doit :

- être versionnée;
- être idempotente;
- conserver l’ordre;
- conserver `occurredAt`;
- utiliser des transactions;
- protéger les données;
- fonctionner sans Realtime;
- reprendre après crash;
- gérer les versions;
- être testée entre les deux applications.

---

# 123. Hors périmètre initial

Ne pas bloquer la V1 avec :

- streaming GPS haute fréquence permanent;
- conversation en temps réel;
- vidéo;
- contrôle distant complet;
- optimisation dynamique de Route;
- plusieurs Operators simultanés par Mission;
- télémétrie véhicule avancée;
- synchronisation pair-à-pair;
- réplication complète de base;
- résolution automatique de tous les conflits.

---

# 124. Décisions à confirmer

Avant l’implémentation finale, confirmer :

- package partagé ou génération;
- technologie de stockage local;
- période de grâce hors ligne;
- fréquence GPS;
- rétention GPS;
- taille de batch;
- politique de retry;
- séquence par Mission ou Device;
- appareil principal;
- plusieurs appareils;
- règles de handoff;
- seuils SyncHealth;
- schéma minimal;
- versions supportées;
- stratégie point/rayon;
- paramètres GPS;
- photos;
- comportement après annulation;
- fermeture hors ligne;
- correction d’horloge;
- outils de diagnostic.

Toutes les décisions confirmées doivent être ajoutées à `memory.md`.

---

# 125. Règles non négociables

Ne jamais perdre une opération terrain confirmée localement.

Ne jamais appliquer deux fois la même opération.

Ne jamais remplacer `occurredAt` par `receivedAt`.

Ne jamais charger les données financières dans RECA Opérateur.

Ne jamais permettre à un opérateur d’accéder à la Mission d’un autre.

Ne jamais dépendre uniquement de Realtime.

Ne jamais supprimer la file avant acknowledgement.

Ne jamais modifier une Mission passée depuis un Contrat actuel.

Ne jamais ignorer silencieusement un conflit.

Ne jamais accepter une version de schéma inconnue.

Ne jamais exposer `service_role`.

Ne jamais laisser deux appareils contrôler la même Mission sans règle explicite.

Ne jamais masquer une synchronisation bloquée.

---

# 126. Diagramme principal

```text
RECA App V2
  ↓
Mission READY
  ↓
OperatorMissionPayload
  ↓
RECA Opérateur
  ↓
Cache local
  ↓
Transitions / Problems / Positions
  ↓
SyncQueue
  ↓
SyncBatch
  ↓
Validation / Idempotence / Transaction
  ↓
Supabase
  ↓
Events / Projections / Realtime
  ↓
Centre des opérations
```

---

# 127. Flux hors ligne officiel

```text
Mission téléchargée
  ↓
Connexion perdue
  ↓
Travail local
  ↓
Opérations PENDING
  ↓
Connexion retrouvée
  ↓
Batch
  ↓
Acknowledgements
  ↓
Réconciliation
  ↓
Cache synchronisé
```

---

# 128. Flux de conflit officiel

```text
État local
  ↓
État serveur divergent
  ↓
SyncConflict
  ↓
Dashboard
  ↓
Résolution
  ↓
MissionVersion finale
  ↓
RECA Opérateur réaligné
```

---

# 129. Résumé officiel

RECA App V2 planifie et supervise.

RECA Opérateur exécute et enregistre.

Les deux applications communiquent par des contrats versionnés.

La Mission et les MissionItems sont téléchargés comme snapshots opérationnels.

RECA Opérateur fonctionne hors ligne grâce à un cache local et une file d’opérations durable.

Chaque opération possède une clé d’idempotence et une séquence.

Le serveur applique les opérations transactionnellement.

L’heure terrain et l’heure de réception sont conservées séparément.

Realtime améliore la rapidité, mais ne remplace jamais le refetch ni la synchronisation durable.

Les conflits sont explicites.

Les réassignations sont contrôlées.

Les appareils peuvent être révoqués.

La santé de synchronisation est visible dans le Centre des opérations.

L’objectif est de garantir qu’aucune opération terrain ne soit perdue, du premier déplacement jusqu’à la fermeture complète de la Mission.
