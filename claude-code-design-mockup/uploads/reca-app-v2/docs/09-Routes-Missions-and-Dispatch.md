# 09-Routes-Missions-and-Dispatch.md

# RECA
## Routes, Missions et répartition

Version : 1.0  
Projet : RECA App V2  
Dépôt recommandé : `reca-app-v2`  
Statut : Spécification métier, fonctionnelle et opérationnelle officielle  

---

# 1. Objectif du document

Ce document définit le fonctionnement officiel des modules :

```text
Routes
Missions
Répartition
Problèmes opérationnels
Supervision
```

Il décrit :

- le rôle d’une Route;
- le rôle d’une Mission;
- la distinction entre Route et Mission;
- les RouteItems;
- les MissionItems;
- la préparation des Missions;
- les assignations;
- les statuts;
- les transitions;
- la répartition;
- le suivi en temps réel;
- la carte opérationnelle;
- les problèmes;
- les corrections;
- l’historique;
- la relation avec les Contrats;
- la relation avec les Employés;
- la relation avec les Équipements;
- la relation avec RECA Opérateur;
- les permissions;
- les transactions;
- les projections;
- les comportements Desktop, Tablette et Mobile;
- la migration depuis l’ancienne RECA App;
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
08-Contracts-and-Measurement.md
```

---

# 2. Vision générale

Le système opérationnel de RECA repose sur quatre niveaux distincts :

```text
Contrat
  ↓
Route
  ↓
Mission
  ↓
MissionItem
```

Chaque niveau possède une responsabilité propre.

```text
Contrat
Définit la propriété et le service permanent

Route
Définit un ordre permanent de Contrats

Mission
Définit une exécution réelle pour un événement précis

MissionItem
Définit une propriété à traiter dans cette Mission précise
```

Cette distinction est non négociable.

---

# 3. Principe fondamental

Une Route est un modèle permanent.

Une Mission est une instance réelle.

```text
Route permanente
      ↓
Mission créée pour une tempête
      ↓
MissionItems figés
      ↓
Exécution dans RECA Opérateur
      ↓
Historique
```

Modifier une Route ne doit jamais réécrire une Mission existante.

Modifier un Contrat ne doit jamais réécrire un MissionItem déjà créé.

---

# 4. Responsabilité du module Routes

Le module Routes doit permettre de :

- créer une Route;
- nommer une Route;
- définir son secteur;
- ajouter des Contrats;
- retirer des Contrats;
- ordonner les Contrats;
- déplacer un Contrat;
- assigner des ressources par défaut;
- identifier les Contrats incomplets;
- visualiser la Route sur une carte;
- consulter sa superficie;
- consulter sa durée estimée;
- consulter son historique;
- créer une Mission à partir de la Route;
- archiver une Route sans perdre les Missions passées.

---

# 5. Responsabilité du module Missions

Le module Missions doit permettre de :

- créer une Mission;
- sélectionner une Route;
- figer les MissionItems;
- assigner un opérateur;
- assigner un équipement;
- vérifier la préparation;
- démarrer;
- suivre la progression;
- mettre en pause;
- reprendre;
- traiter les problèmes;
- corriger certaines données;
- terminer;
- annuler;
- consulter l’historique;
- superviser la synchronisation avec RECA Opérateur.

---

# 6. Responsabilité de la répartition

La répartition doit permettre de comprendre rapidement :

- quelle Mission doit être préparée;
- quelle Route est utilisée;
- quel opérateur est assigné;
- quel équipement est assigné;
- quels conflits existent;
- quels Contrats sont incomplets;
- quelles Missions sont prêtes;
- quelles Missions sont en cours;
- quelles Missions sont bloquées;
- quelles interventions nécessitent une action humaine.

---

# 7. Routes recommandées dans l’application

## Routes

```text
/routes
/routes/new
/routes/:routeId
/routes/:routeId/edit
/routes/:routeId/map
```

## Missions

```text
/missions
/missions/new
/missions/:missionId
/missions/:missionId/dispatch
/missions/:missionId/map
```

---

# 8. Entité Route

Structure conceptuelle :

```ts
type Route = {
  id: RouteId
  organizationId: OrganizationId
  number: string
  name: string
  status: RouteStatus
  sector?: string
  description?: string

  defaultOperatorId?: EmployeeId
  defaultEquipmentId?: EquipmentId

  estimatedDurationSeconds?: number
  estimatedTravelSeconds?: number
  totalAreaSquareMeters?: number

  version: number
  createdAt: string
  createdBy?: UserId
  updatedAt: string
  updatedBy?: UserId
  deletedAt?: string
}
```

---

# 9. Statuts Route

Valeurs recommandées :

```text
DRAFT
ACTIVE
INACTIVE
ARCHIVED
```

---

# 10. Signification des statuts Route

## DRAFT

- Route en préparation;
- ordre non finalisé;
- création de Mission bloquée ou avertie.

## ACTIVE

- Route utilisable;
- création de Mission permise.

## INACTIVE

- Route temporairement non utilisée;
- historique conservé.

## ARCHIVED

- Route retirée des listes courantes;
- Missions passées conservées.

---

# 11. Transitions Route

Flux principal :

```text
DRAFT
  ↓
ACTIVE
  ↓
INACTIVE
  ↓
ARCHIVED
```

Branches :

```text
INACTIVE → ACTIVE
DRAFT → ARCHIVED
ACTIVE → ARCHIVED
```

L’archivage d’une Route active doit demander confirmation.

---

# 12. Numéro visible Route

Format recommandé :

```text
RTE-000014
```

Le nom reste lisible :

```text
LaSalle
Saint-Antoine
Secteur Nord
```

L’interface affiche souvent :

```text
RTE-000014 · LaSalle
```

---

# 13. Entité RouteItem

Structure conceptuelle :

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
  createdBy?: UserId
  updatedAt: string
  updatedBy?: UserId
  deletedAt?: string
}
```

---

# 14. Statuts RouteItem

Valeurs possibles :

```text
ACTIVE
TEMPORARILY_DISABLED
ARCHIVED
```

Un Contrat suspendu peut aussi rendre un RouteItem temporairement non admissible à une Mission.

---

# 15. Relation Route–Contract

La Route ne doit pas contenir seulement un tableau JSON d’identifiants.

La relation officielle utilise :

```text
route_items
```

Cette structure permet :

- ordre;
- historique;
- statut;
- priorité;
- notes;
- filtres;
- contraintes;
- audit.

---

# 16. Ordre des RouteItems

L’ordre doit être explicite.

Valeurs recommandées :

```text
10
20
30
40
```

ou séquence continue :

```text
1
2
3
4
```

Le choix final doit simplifier :

- insertion;
- réorganisation;
- synchronisation;
- contraintes.

---

# 17. Réorganisation

La réorganisation doit permettre :

- glisser-déposer;
- boutons monter/descendre;
- déplacement vers une position;
- annulation;
- sauvegarde transactionnelle.

Le glisser-déposer ne doit pas être l’unique méthode.

---

# 18. ReorderRouteItems

Cas d’utilisation recommandé :

```text
ReorderRouteItems
```

Entrée :

```ts
type ReorderRouteItemsInput = {
  routeId: RouteId
  orderedItemIds: RouteItemId[]
  expectedRouteVersion: number
}
```

La mutation doit être transactionnelle.

---

# 19. Concurrence de réorganisation

Si deux utilisateurs modifient l’ordre :

```text
La Route a été modifiée par une autre personne.
Rechargez avant de poursuivre.
```

Le système ne doit pas écraser silencieusement l’ordre récent.

---

# 20. Ajout d’un Contrat à une Route

Avant l’ajout, vérifier :

- Contrat actif;
- Client actif ou autorisé;
- adresse de service;
- coordonnées;
- géométrie selon règle;
- absence de doublon;
- permissions;
- compatibilité de secteur si applicable.

---

# 21. Contrat déjà dans une Route

Direction initiale recommandée :

```text
Un Contrat actif ne peut appartenir
qu’à une seule Route opérationnelle principale.
```

Le système doit détecter :

```text
Ce Contrat appartient déjà à la Route RTE-000014 · LaSalle.
```

Une exception future peut être autorisée pour des services distincts.

---

# 22. Retrait d’un Contrat d’une Route

Le retrait :

- ne supprime pas le Contrat;
- ne modifie pas les Missions existantes;
- retire seulement le RouteItem;
- produit un événement;
- peut demander une raison.

---

# 23. Contrat suspendu dans une Route

Le RouteItem reste historique.

Lors de la création d’une Mission :

```text
Contrat suspendu
  ↓
MissionItem non créé
```

ou avertissement, selon la règle finale.

La direction recommandée est d’exclure automatiquement les Contrats non actifs.

---

# 24. Contrat sans géométrie

Le RouteItem peut afficher :

```text
SURFACE MANQUANTE
```

La Route peut rester enregistrée.

La création de Mission doit :

- bloquer;
- ou permettre avec avertissement;

selon les exigences de RECA Opérateur.

Direction recommandée :

```text
Mission bloquée si la géométrie GPS est requise
et qu’aucun fallback valide n’existe.
```

---

# 25. RouteReadiness

Projection conceptuelle :

```ts
type RouteReadiness = {
  routeId: RouteId
  isReadyForMission: boolean
  activeItemCount: number
  validItemCount: number
  missingGeometryCount: number
  missingCoordinatesCount: number
  suspendedContractCount: number
  duplicateContractCount: number
  hasDefaultOperator: boolean
  hasDefaultEquipment: boolean
  blockingIssues: RouteReadinessIssue[]
  warnings: RouteReadinessWarning[]
}
```

---

# 26. Activation Route

Une Route peut devenir `ACTIVE` si :

- elle possède un nom;
- elle possède au moins un RouteItem actif;
- son ordre est valide;
- aucun doublon bloquant;
- permissions valides.

L’absence d’opérateur ou d’équipement par défaut ne bloque pas nécessairement l’activation.

---

# 27. Ressources par défaut

Une Route peut définir :

```text
default_operator_id
default_equipment_id
```

Ces valeurs servent à préremplir une Mission.

Elles ne constituent pas une affectation définitive.

---

# 28. Conflit de ressource par défaut

Une ressource par défaut peut être :

- inactive;
- en maintenance;
- déjà affectée;
- archivée;
- indisponible.

La Route peut conserver la référence historique, mais doit afficher un avertissement.

---

# 29. Estimation de Route

La Route peut afficher :

- superficie totale;
- nombre de Contrats;
- distance estimée;
- temps d’intervention estimé;
- temps de déplacement estimé;
- durée totale estimée.

---

# 30. Estimation initiale

Sans modèle historique avancé :

```text
durée estimée =
somme des durées moyennes par Contrat
+ déplacement estimé
```

Les valeurs doivent être présentées comme estimations.

---

# 31. Estimation future

La structure doit permettre plus tard :

- moyenne par superficie;
- moyenne par équipement;
- moyenne par opérateur;
- conditions météo;
- densité;
- apprentissage historique;
- optimisation automatique.

Hors périmètre initial.

---

# 32. Carte Route

La carte doit afficher :

- chaque Contrat;
- son ordre;
- son statut;
- la Route;
- les zones;
- les problèmes de données;
- les coordonnées;
- la superficie.

---

# 33. Vue partagée Desktop

Structure recommandée :

```text
┌────────────────────────────┬───────────────────────────────┐
│ Liste ordonnée             │ Carte                         │
│                            │                               │
│ 1. CTR-000053              │ 1  2  3  4                   │
│ 2. CTR-000054              │                               │
│ 3. CTR-000055              │                               │
└────────────────────────────┴───────────────────────────────┘
```

---

# 34. Sélection synchronisée

Sélectionner un RouteItem dans la liste doit :

- surligner le marqueur;
- centrer la carte;
- afficher les détails.

Sélectionner un marqueur doit :

- sélectionner la ligne;
- la rendre visible;
- afficher le panneau associé.

---

# 35. Carte Mobile Route

Sur Mobile, utiliser :

- onglet Carte;
- aperçu;
- plein écran;
- bottom sheet des RouteItems.

Ne pas afficher simultanément une carte minuscule et une longue liste illisible.

---

# 36. Fiche Route — structure officielle

```text
En-tête
Résumé
Onglets
Contrats
Carte
Historique
```

Onglets recommandés :

```text
Contrats
Carte
Historique
```

Les Paramètres peuvent être intégrés dans Modifier.

---

# 37. En-tête Route

Afficher :

```text
RTE-000014 · LaSalle
[ACTIVE]
```

Informations secondaires :

- nombre de Contrats;
- superficie;
- durée estimée;
- opérateur par défaut;
- équipement par défaut.

Action primaire :

```text
Créer une Mission
```

Actions secondaires :

```text
Modifier
```

Menu :

```text
Dupliquer
Désactiver
Archiver
```

---

# 38. Action « Supprimer la Route »

L’action ne doit pas être visible au même niveau que les actions courantes.

Direction recommandée :

```text
Archiver la Route
```

La suppression définitive est réservée aux données de test ou erreurs contrôlées.

---

# 39. Liste Routes

La liste doit permettre :

- recherche;
- filtre par statut;
- filtre par secteur;
- filtre par opérateur;
- filtre par équipement;
- filtre par préparation;
- tri;
- mode compact Desktop;
- cartes Mobile.

---

# 40. Résumé Routes

Statistiques compactes :

```text
Actives
Brouillons
Inactives
À vérifier
Sans opérateur
Sans équipement
```

---

# 41. Ligne Route Desktop

Contenu recommandé :

```text
Route
Statut
Contrats
Superficie
Durée estimée
Opérateur
Équipement
Préparation
```

---

# 42. Carte Route Mobile

Afficher :

- nom;
- numéro;
- statut;
- nombre de Contrats;
- opérateur;
- équipement;
- badge de préparation;
- chevron.

---

# 43. Duplication de Route

Une Route peut être dupliquée.

Le système doit demander :

- nouveau nom;
- nouveau secteur;
- copier les RouteItems;
- copier l’ordre;
- copier les ressources par défaut;
- statut initial.

Direction recommandée :

```text
Nouvelle Route = DRAFT
```

---

# 44. Version Route

La Route doit posséder :

```text
version
```

Elle change lorsque :

- RouteItem ajouté;
- RouteItem retiré;
- ordre modifié;
- affectation par défaut modifiée;
- statut modifié;
- paramètres opérationnels modifiés.

---

# 45. Historique Route

Événements :

```text
RouteCreated
RouteActivated
RouteDeactivated
RouteArchived
RouteItemAdded
RouteItemRemoved
RouteItemsReordered
RouteDefaultOperatorChanged
RouteDefaultEquipmentChanged
MissionCreatedFromRoute
```

---

# 46. Entité Mission

Structure conceptuelle :

```ts
type Mission = {
  id: MissionId
  organizationId: OrganizationId
  number: string

  routeId?: RouteId
  routeNameSnapshot?: string
  sourceRouteVersion?: number

  scheduledDate: string
  scheduledStartAt?: string

  operatorId?: EmployeeId
  equipmentId?: EquipmentId

  status: MissionStatus

  startedAt?: string
  pausedAt?: string
  completedAt?: string
  cancelledAt?: string

  notes?: string
  cancellationReason?: string

  version: number
  createdAt: string
  createdBy?: UserId
  updatedAt: string
  updatedBy?: UserId
}
```

---

# 47. Numéro Mission

Format recommandé :

```text
MIS-2026-0009
```

Il doit être :

- unique par organisation;
- lisible;
- stable;
- généré côté serveur.

---

# 48. Statuts Mission recommandés

```text
PLANNED
READY
IN_PROGRESS
PAUSED
COMPLETED
CANCELLED
```

---

# 49. Signification des statuts Mission

## PLANNED

- Mission créée;
- préparation incomplète ou en attente;
- non disponible à l’opérateur.

## READY

- opérateur assigné;
- équipement assigné;
- MissionItems valides;
- disponible pour exécution.

## IN_PROGRESS

- Mission démarrée;
- progression active.

## PAUSED

- Mission temporairement interrompue;
- progression conservée.

## COMPLETED

- Mission terminée;
- historique figé.

## CANCELLED

- Mission annulée;
- raison conservée;
- historique conservé.

---

# 50. Transitions Mission

Flux principal :

```text
PLANNED
  ↓
READY
  ↓
IN_PROGRESS
  ↓
COMPLETED
```

Pause :

```text
IN_PROGRESS
  ↓
PAUSED
  ↓
IN_PROGRESS
```

Annulation :

```text
PLANNED → CANCELLED
READY → CANCELLED
IN_PROGRESS → CANCELLED
PAUSED → CANCELLED
```

---

# 51. Transitions interdites

Exemples :

```text
COMPLETED → IN_PROGRESS
CANCELLED → READY
CANCELLED → IN_PROGRESS
```

Une correction historique doit utiliser un processus administratif distinct.

---

# 52. Création d’une Mission

La Mission peut être créée depuis :

```text
Route
```

ou exceptionnellement :

```text
Mission spéciale sans Route
```

La V1 doit privilégier la création depuis une Route active.

---

# 53. Flux de création depuis Route

```text
Sélectionner Route
  ↓
Lire RouteItems actifs
  ↓
Lire Contrats admissibles
  ↓
Calculer RouteReadiness
  ↓
Choisir date
  ↓
Assigner opérateur
  ↓
Assigner équipement
  ↓
Créer Mission
  ↓
Créer MissionItems figés
  ↓
Créer événement
  ↓
Afficher fiche Mission
```

---

# 54. CreateMissionFromRoute

Cas d’utilisation officiel :

```text
CreateMissionFromRoute
```

Entrée conceptuelle :

```ts
type CreateMissionFromRouteInput = {
  routeId: RouteId
  scheduledDate: string
  scheduledStartAt?: string
  operatorId?: EmployeeId
  equipmentId?: EquipmentId
  notes?: string
  idempotencyKey: string
}
```

---

# 55. Création transactionnelle

La transaction doit :

1. verrouiller ou vérifier la Route;
2. valider la version;
3. charger les RouteItems;
4. filtrer les Contrats;
5. créer la Mission;
6. créer les MissionItems;
7. figer les snapshots;
8. créer les événements;
9. retourner la Mission complète.

---

# 56. Double création

Le double clic ou une reprise réseau ne doit pas créer deux Missions identiques.

Utiliser :

```text
idempotency_key
```

---

# 57. Mission spéciale

Une future Mission peut être créée sans Route pour :

- reprise;
- urgence;
- service ponctuel;
- correction;
- propriété unique.

La V1 peut prévoir la structure sans exposer cette fonction immédiatement.

---

# 58. MissionItem

Structure conceptuelle :

```ts
type MissionItem = {
  id: MissionItemId
  missionId: MissionId
  contractId?: ContractId
  routeItemId?: RouteItemId

  order: number
  status: MissionItemStatus

  contractNumber: string
  clientName: string
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

  travelStartedAt?: string
  approachStartedAt?: string
  workStartedAt?: string
  completedAt?: string

  travelDurationSeconds?: number
  approachDurationSeconds?: number
  workDurationSeconds?: number

  problemCount: number
  createdAt: string
  updatedAt: string
}
```

---

# 59. Snapshot MissionItem

Le MissionItem doit figer :

- ordre;
- numéro de Contrat;
- nom affiché;
- adresse;
- téléphone utile;
- coordonnées;
- géométrie exacte;
- géométrie GPS;
- version;
- superficie;
- instructions;
- alertes;
- Route source.

---

# 60. Pourquoi figer

Une Mission passée doit rester fidèle à ce qui était prévu au moment de sa création.

Une modification future du Contrat ne doit pas changer :

- l’adresse historique;
- la géométrie historique;
- les instructions historiques;
- l’ordre historique;
- les temps;
- les problèmes.

---

# 61. Statuts MissionItem recommandés

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

---

# 62. Signification MissionItem

## WAITING

- en attente;
- non actif.

## EN_ROUTE

- déplacement vers la résidence.

## APPROACHING

- proximité détectée;
- intervention imminente.

## IN_PROGRESS

- travail en cours.

## COMPLETED

- résidence terminée.

## PROBLEM

- problème nécessitant une action ou empêchant le service.

## SKIPPED

- élément volontairement ignoré;
- raison requise.

## CANCELLED

- élément annulé administrativement.

---

# 63. Une seule résidence active

Règle non négociable :

```text
Une Mission ne peut avoir plus d’un MissionItem actif.
```

États actifs :

```text
EN_ROUTE
APPROACHING
IN_PROGRESS
```

Cette règle doit être protégée :

- dans le domaine;
- dans les RPC;
- dans les tests;
- éventuellement par une contrainte.

---

# 64. Premier MissionItem

Au démarrage de Mission :

```text
Premier MissionItem = EN_ROUTE
```

sauf décision explicite ou correction.

---

# 65. Progression automatique

Après la complétion d’un MissionItem :

```text
MissionItem actuel = COMPLETED
MissionItem suivant = EN_ROUTE
```

La transition doit être transactionnelle.

---

# 66. Fallback résidences adjacentes

Pour deux propriétés très proches :

```text
MissionItem précédent terminé
      ↓
MissionItem suivant passe immédiatement IN_PROGRESS
      ↓
Déplacement synthétique de 5 secondes
```

Cette règle appartient principalement à RECA Opérateur, mais RECA App V2 doit pouvoir afficher et historiser la source de transition.

Source recommandée :

```text
ADJACENT_RESIDENCE_FALLBACK
```

---

# 67. Ordre MissionItem

L’ordre est figé à la création.

Il peut être modifié avant le démarrage selon permission.

Après démarrage :

- modification exceptionnelle;
- raison obligatoire;
- audit;
- synchronisation contrôlée.

---

# 68. Réorganisation avant départ

La fiche Mission doit permettre de :

- déplacer un MissionItem;
- retirer un MissionItem;
- ajouter un Contrat admissible;
- recalculer la préparation.

Seulement si :

```text
Mission.status = PLANNED ou READY
```

et non démarrée.

---

# 69. Ajout après démarrage

Hors périmètre initial ou action administrative avancée.

Une future fonction devra :

- versionner;
- synchroniser;
- conserver l’ordre;
- éviter les conflits;
- demander confirmation.

---

# 70. Suppression MissionItem

Avant démarrage :

```text
Retirer de la Mission
```

Après démarrage :

```text
Annuler l’intervention
```

L’historique doit être conservé.

---

# 71. MissionReadiness

Structure conceptuelle :

```ts
type MissionReadiness = {
  missionId: MissionId
  isReadyToDispatch: boolean

  hasRoute: boolean
  hasItems: boolean
  hasOperator: boolean
  hasEquipment: boolean

  operatorIsActive: boolean
  operatorCanOperate: boolean
  equipmentIsAvailable: boolean

  validGeometryCount: number
  invalidGeometryCount: number
  missingCoordinatesCount: number

  hasAssignmentConflict: boolean
  blockingIssues: MissionReadinessIssue[]
  warnings: MissionReadinessWarning[]
}
```

---

# 72. Conditions minimales READY

Direction recommandée :

```text
Au moins un MissionItem
+ opérateur actif
+ opérateur autorisé
+ équipement disponible
+ aucune erreur géographique bloquante
+ aucune affectation conflictuelle
```

---

# 73. Affectation opérateur

La Mission doit pouvoir être assignée à un Employee :

```text
can_operate = true
```

Le système doit vérifier :

- employé actif;
- compte actif si RECA Opérateur requis;
- permission Operator;
- absence de conflit;
- disponibilité;
- accès à l’appareil.

---

# 74. Affectation équipement

Le système doit vérifier :

- équipement actif;
- statut disponible;
- non archivé;
- non hors service;
- absence de conflit;
- compatibilité avec la Mission si règle future.

---

# 75. Conflit d’affectation

Exemples :

```text
Même opérateur sur deux Missions actives
Même équipement sur deux Missions actives
Employé suspendu
Équipement en maintenance
Mission déjà démarrée avec autre ressource
```

---

# 76. Override de conflit

Une dérogation peut être autorisée aux Administrators ou Managers.

Elle doit :

- demander une raison;
- afficher l’impact;
- produire un événement;
- rester exceptionnelle.

---

# 77. Affectations Route vs Mission

La Route fournit des valeurs par défaut.

La Mission possède les affectations autoritatives.

```text
Route.defaultOperator
      ↓ préremplit
Mission.operatorId
```

Modifier la Route après création ne change pas la Mission.

---

# 78. Fiche Mission — structure officielle

```text
En-tête opérationnel
Résumé de progression
Carte
MissionItem actif
À traiter
Onglets
```

Onglets recommandés :

```text
Résidences
Problèmes
Historique
Synchronisation
```

---

# 79. En-tête Mission

Afficher :

```text
MIS-2026-0009 · LaSalle
[EN COURS]
```

Informations secondaires :

- date;
- opérateur;
- équipement;
- Route;
- dernière synchronisation.

Action primaire contextuelle :

```text
Assigner
Démarrer
Mettre en pause
Reprendre
Fermer
```

Menu :

```text
Modifier
Réassigner
Annuler
```

---

# 80. Actions contextuelles

## PLANNED

Action primaire :

```text
Compléter la préparation
```

## READY

Action primaire :

```text
Démarrer
```

## IN_PROGRESS

Action primaire :

```text
Mettre en pause
```

ou :

```text
Ouvrir la supervision
```

## PAUSED

Action primaire :

```text
Reprendre
```

## COMPLETED

Action principale :

```text
Voir le rapport
```

---

# 81. Action Fermer

La fermeture d’une Mission doit vérifier :

- tous les MissionItems dans un état terminal;
- problèmes ouverts;
- synchronisation;
- temps;
- permission.

États terminaux :

```text
COMPLETED
PROBLEM
SKIPPED
CANCELLED
```

La règle exacte concernant `PROBLEM` doit être confirmée.

---

# 82. Fermer avec problèmes ouverts

Direction recommandée :

- autoriser seulement avec confirmation;
- conserver les problèmes;
- indiquer « Mission terminée avec problèmes »;
- créer un élément à traiter.

---

# 83. Annulation Mission

L’annulation doit demander :

- raison;
- impact;
- statut des MissionItems;
- notification de l’opérateur;
- synchronisation.

---

# 84. Raison d’annulation

Valeurs possibles :

```text
WEATHER
OPERATION_CANCELLED
EQUIPMENT_FAILURE
OPERATOR_UNAVAILABLE
DUPLICATE
CREATED_BY_ERROR
OTHER
```

---

# 85. Progression Mission

Projection :

```ts
type MissionProgress = {
  total: number
  waiting: number
  enRoute: number
  approaching: number
  inProgress: number
  completed: number
  problems: number
  skipped: number
  cancelled: number
  progressPercentage: number
}
```

---

# 86. Calcul de progression

Direction :

```text
completed / actionable_total
```

Les éléments `CANCELLED` peuvent être exclus.

Les éléments `SKIPPED` et `PROBLEM` doivent être définis explicitement.

---

# 87. Mission active

La fiche doit présenter immédiatement :

- progression;
- MissionItem actif;
- suivant;
- problème;
- opérateur;
- équipement;
- synchronisation;
- durée.

---

# 88. Bloc MissionItem actif

Exemple :

```text
EN COURS

CTR-000047
148 rue Scott
65 m²

Début : 19 h 14
Durée : 4 min 26 s

[Voir la propriété]
```

---

# 89. MissionItem suivant

Afficher :

```text
PROCHAINE RÉSIDENCE
CTR-000048 · 152 rue Scott
```

---

# 90. Liste MissionItems

La liste doit afficher :

- ordre;
- numéro;
- adresse;
- statut;
- durée;
- superficie;
- problème;
- synchronisation;
- action.

---

# 91. Mode compact Desktop

Une Mission peut contenir plusieurs dizaines de MissionItems.

Utiliser des rangées denses.

Éviter une grande carte par résidence sur Desktop.

---

# 92. Carte MissionItem Mobile

Sur Mobile administratif :

- ordre;
- adresse;
- statut;
- durée;
- problème;
- chevron.

RECA Opérateur possède sa propre interface terrain.

---

# 93. Carte Mission

La carte de Mission doit afficher :

- tous les MissionItems;
- ordre;
- statut;
- MissionItem actif;
- opérateur;
- dernière position;
- problèmes;
- Route prévue.

---

# 94. Couleurs carte Mission

Convention recommandée :

```text
Actif : vert
Prochains : bleu
En attente : gris
Problème : rouge
Terminé : masqué ou atténué
Position périmée : gris
```

La convention doit rester compatible visuellement avec RECA Opérateur.

---

# 95. MissionItems terminés

Sur la carte de supervision :

- masquer par défaut;
- ou afficher très atténué;
- permettre un filtre.

---

# 96. Problèmes visibles

Les MissionItems en problème doivent rester visibles.

Ils ne doivent pas disparaître comme les MissionItems terminés.

---

# 97. Position opérateur

Afficher :

- dernière position;
- heure;
- fraîcheur;
- direction si fiable;
- équipement;
- statut.

Ne pas afficher une position ancienne comme actuelle.

---

# 98. Fraîcheur

Exemple initial :

```text
< 2 min : à jour
2–5 min : dégradé
> 5 min : hors ligne
```

Les seuils doivent être configurables.

---

# 99. Répartition Desktop

Vue recommandée :

```text
┌──────────────────────────────┬──────────────────────────────┐
│ Missions                     │ Carte / détails              │
│                              │                              │
│ À préparer                   │ Opérateur                    │
│ Prêtes                       │ Équipement                   │
│ En cours                     │ Problèmes                    │
└──────────────────────────────┴──────────────────────────────┘
```

---

# 100. Écran Dispatch

Route recommandée :

```text
/missions/:missionId/dispatch
```

Responsabilités :

- préparation;
- assignation;
- validation;
- aperçu MissionItems;
- conflits;
- mise à READY.

---

# 101. DispatchSummary

Structure conceptuelle :

```ts
type DispatchSummary = {
  mission: MissionSummary
  readiness: MissionReadiness
  route: RouteSummary
  operator?: EmployeeSummary
  equipment?: EquipmentSummary
  items: MissionItemPreparationSummary[]
  conflicts: DispatchConflict[]
  warnings: DispatchWarning[]
}
```

---

# 102. Actions Dispatch

Actions possibles :

```text
Assigner opérateur
Assigner équipement
Réordonner
Retirer une résidence
Ajouter une résidence
Vérifier la géométrie
Marquer prête
```

---

# 103. Marquer READY

Cette action doit être transactionnelle.

Elle doit :

- recalculer MissionReadiness;
- vérifier les ressources;
- vérifier les MissionItems;
- vérifier les conflits;
- changer le statut;
- créer un événement;
- rendre la Mission disponible à RECA Opérateur.

---

# 104. Disponibilité à RECA Opérateur

RECA Opérateur doit recevoir une Mission seulement lorsqu’elle respecte le contrat d’intégration.

Direction :

```text
Mission.status = READY
ou IN_PROGRESS
```

---

# 105. Démarrage administratif

Une Mission peut être démarrée :

- depuis RECA Opérateur;
- depuis RECA App V2 selon permission.

Le flux principal recommandé est :

```text
Operator démarre depuis RECA Opérateur
```

Le Dispatcher peut utiliser une action de secours.

---

# 106. Démarrage de secours

Un démarrage administratif doit :

- demander confirmation;
- préciser la source;
- produire un événement;
- synchroniser l’opérateur;
- vérifier que la Mission n’est pas déjà démarrée.

---

# 107. Pause

Une Mission peut être mise en pause par :

- Operator;
- Dispatcher;
- System selon cas.

Source enregistrée :

```text
OPERATOR
DISPATCHER
SYSTEM
```

---

# 108. Effet de pause

Pendant la pause :

- MissionItem actif reste identifiable;
- timers métier sont suspendus selon règle;
- synchronisation continue;
- carte reste visible;
- historique conserve les périodes.

---

# 109. MissionPause

Structure conceptuelle :

```ts
type MissionPause = {
  id: string
  missionId: MissionId
  startedAt: string
  endedAt?: string
  reason?: MissionPauseReason
  source: TransitionSource
  actorId?: UserId
}
```

---

# 110. Raisons de pause

Exemples :

```text
BREAK
EQUIPMENT
WEATHER
TRAFFIC
CLIENT
DISPATCH
OTHER
```

---

# 111. Problème opérationnel

Une difficulté terrain doit devenir une entité structurée.

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

  acknowledgedBy?: UserId
  acknowledgedAt?: string

  resolvedBy?: UserId
  resolvedAt?: string
  resolutionNotes?: string
}
```

---

# 112. Codes Problem

Valeurs initiales possibles :

```text
ACCESS_BLOCKED
VEHICLE_PRESENT
GATE_CLOSED
PROPERTY_NOT_FOUND
UNSAFE_CONDITION
SNOW_DEPOSIT_UNAVAILABLE
CLIENT_REQUEST
EQUIPMENT_FAILURE
GPS_ERROR
OTHER
```

---

# 113. Sévérités Problem

```text
LOW
MEDIUM
HIGH
CRITICAL
```

---

# 114. Statuts Problem

```text
OPEN
ACKNOWLEDGED
IN_PROGRESS
RESOLVED
DISMISSED
```

---

# 115. Flux Problem

```text
OPEN
  ↓
ACKNOWLEDGED
  ↓
IN_PROGRESS
  ↓
RESOLVED
```

Alternative :

```text
OPEN → DISMISSED
```

Une raison doit être conservée.

---

# 116. Signalement Operator

RECA Opérateur peut créer un Problem avec :

- code;
- description;
- MissionItem;
- photo future;
- heure originale;
- appareil;
- idempotencyKey.

---

# 117. Réception Dashboard

Le problème doit apparaître dans :

- Mission;
- Centre des opérations;
- fiche Contract si pertinent;
- historique;
- notifications futures.

---

# 118. Résolution Dispatcher

La résolution peut :

- ajouter une note;
- contacter le Client;
- demander une reprise;
- marquer l’intervention comme impossible;
- réordonner;
- fermer le Problem.

---

# 119. Problem et MissionItemStatus

Un Problem ne doit pas automatiquement forcer toujours :

```text
MissionItem.status = PROBLEM
```

La règle dépend du type.

Exemple :

```text
Véhicule présent
  ↓
MissionItem = PROBLEM
```

Exemple :

```text
Note mineure
  ↓
MissionItem peut rester IN_PROGRESS
```

---

# 120. Intervention impossible

Lorsqu’un service ne peut pas être réalisé :

```text
MissionItem = PROBLEM ou SKIPPED
Problem = OPEN ou RESOLVED selon traitement
```

La règle finale doit être confirmée.

---

# 121. Reprise future

Une future fonction peut générer :

```text
Mission de reprise
```

à partir de MissionItems problématiques.

Hors périmètre initial, mais la donnée doit permettre cette évolution.

---

# 122. Correction administrative

Certaines corrections peuvent être requises :

- temps incorrect;
- mauvais statut;
- mauvaise résidence;
- mauvaise affectation;
- problème signalé par erreur.

La correction doit :

- demander une raison;
- conserver l’ancienne valeur;
- créer un événement;
- respecter les invariants;
- synchroniser si Mission active.

---

# 123. Source de correction

Valeur recommandée :

```text
ADMINISTRATIVE_CORRECTION
```

---

# 124. Interdiction de correction silencieuse

Ne jamais modifier directement un timestamp historique depuis une page sans audit.

---

# 125. Transitions MissionItem

Chaque transition doit conserver :

- fromStatus;
- toStatus;
- occurredAt;
- receivedAt;
- source;
- operator;
- device;
- correlationId;
- metadata.

---

# 126. Transition source

Valeurs :

```text
GPS
OPERATOR
DISPATCHER
SYSTEM
SYNC_RECOVERY
ADJACENT_RESIDENCE_FALLBACK
ADMINISTRATIVE_CORRECTION
```

---

# 127. Heure terrain

Pour les événements hors ligne :

```text
occurred_at
```

représente l’heure réelle terrain.

```text
received_at
```

représente l’heure serveur.

---

# 128. Timers

Les durées doivent être dérivées de transitions fiables.

Exemples :

```text
travel_duration
approach_duration
work_duration
pause_duration
```

---

# 129. Timer actuel

La supervision affiche le timer de la phase actuelle.

Elle ne doit pas confondre :

- durée totale Mission;
- durée de déplacement;
- durée d’intervention;
- pause.

---

# 130. Temps synthétique

Les transitions synthétiques doivent être identifiables.

Exemple :

```text
synthetic_travel_seconds = 5
```

Ne pas les présenter comme une mesure GPS exacte.

---

# 131. Historique Mission

La timeline doit afficher :

- création;
- Route source;
- MissionItems créés;
- assignations;
- READY;
- démarrage;
- transitions;
- pauses;
- problèmes;
- corrections;
- fin;
- annulation;
- synchronisation.

---

# 132. Rapport Mission

Après complétion, le rapport peut afficher :

- durée totale;
- temps de déplacement;
- temps d’intervention;
- résidences terminées;
- problèmes;
- opérateur;
- équipement;
- écarts;
- synchronisation;
- activité.

---

# 133. Statistiques Mission

Exemples :

```text
Durée moyenne par résidence
Temps moyen de déplacement
Temps moyen d’intervention
Superficie totale traitée
Nombre de problèmes
Taux de complétion
```

---

# 134. Statistiques fiables

Une statistique doit préciser :

- population;
- définition;
- exclusions;
- source;
- fraîcheur.

---

# 135. Liste Missions

La liste doit permettre :

- recherche;
- filtre par date;
- filtre par statut;
- filtre par Route;
- filtre par opérateur;
- filtre par équipement;
- filtre par problème;
- filtre par synchronisation;
- tri;
- mode compact.

---

# 136. Résumé Missions

Statistiques compactes :

```text
À préparer
Prêtes
En cours
En pause
Terminées
Avec problème
```

---

# 137. Ligne Mission Desktop

Contenu recommandé :

```text
Mission
Date
Route
Statut
Progression
Opérateur
Équipement
Problèmes
Synchronisation
```

---

# 138. Carte Mission Mobile

Afficher :

- numéro;
- Route;
- statut;
- progression;
- opérateur;
- problème;
- synchronisation;
- chevron.

---

# 139. Recherche Missions

Champs :

- numéro;
- Route;
- opérateur;
- équipement;
- Contract;
- adresse;
- date.

---

# 140. Recherche globale

Une adresse doit permettre de retrouver :

- Mission active;
- MissionItem;
- Route;
- Contract;
- Client.

---

# 141. Centre des opérations

Les Missions alimentent les blocs :

- Missions actives;
- Missions à préparer;
- problèmes;
- opérateurs;
- équipements;
- synchronisation;
- activité;
- carte.

---

# 142. Projection ActiveMissionSummary

```ts
type ActiveMissionSummary = {
  id: MissionId
  number: string
  routeName: string
  status: MissionStatus
  progress: MissionProgress
  operator?: EmployeeSummary
  equipment?: EquipmentSummary
  activeItem?: MissionItemSummary
  openProblemCount: number
  lastSyncAt?: string
  syncHealth: SyncHealthStatus
  startedAt?: string
}
```

---

# 143. Permissions Routes

Permissions recommandées :

```text
route.read
route.create
route.update
route.reorder
route.assign_defaults
route.activate
route.archive
route.create_mission
```

---

# 144. Permissions Missions

```text
mission.read
mission.create
mission.update
mission.assign
mission.reorder_items
mission.mark_ready
mission.start
mission.pause
mission.resume
mission.complete
mission.cancel
mission.supervise
mission.correct_history
```

---

# 145. Permissions Problems

```text
problem.read
problem.create
problem.acknowledge
problem.resolve
problem.dismiss
```

---

# 146. Rôle Dispatcher

Accès recommandé :

- Routes complet;
- Missions complet;
- assignations;
- problèmes;
- supervision;
- corrections limitées.

---

# 147. Rôle Manager

Accès recommandé :

- lecture complète;
- supervision;
- assignations;
- annulation selon permission;
- rapport.

---

# 148. Rôle Sales

Accès recommandé :

- lecture limitée des Routes et Missions;
- aucune répartition par défaut.

---

# 149. Rôle Accounting

Aucun besoin de modification des Routes ou Missions.

Lecture limitée seulement si utile pour la facturation.

---

# 150. Rôle Operator

Dans RECA App V2 :

- lecture de sa Mission seulement si exposée;
- aucune modification administrative;
- actions terrain principalement dans RECA Opérateur.

---

# 151. RLS Routes

Lecture et écriture limitées par :

- organisation;
- permission;
- statut.

L’Operator ne doit pas accéder à toutes les Routes.

---

# 152. RLS Missions

L’Operator peut lire seulement :

```text
Mission.operator_id = current_employee_id()
```

ou affectation équivalente.

---

# 153. RLS MissionItems

L’Operator peut lire et modifier seulement les MissionItems de sa Mission assignée.

---

# 154. Écriture directe MissionItem

Éviter un `UPDATE` large depuis RECA Opérateur.

Privilégier des RPC :

```text
operator_apply_transition
operator_report_problem
operator_complete_item
```

---

# 155. RPC Routes

Exemples :

```text
create_route
reorder_route_items
activate_route
archive_route
```

---

# 156. RPC Missions

Exemples :

```text
create_mission_from_route
mark_mission_ready
assign_mission_resources
start_mission
pause_mission
resume_mission
complete_mission
cancel_mission
```

---

# 157. RPC Operator

Exemples :

```text
operator_start_mission
operator_apply_transition
operator_report_problem
operator_sync_batch
operator_complete_mission
```

---

# 158. Transactions critiques

Doivent être atomiques :

```text
ReorderRouteItems
CreateMissionFromRoute
AssignMissionResources
MarkMissionReady
CompleteMissionItemAndAdvance
RecordMissionProblem
CompleteMission
```

---

# 159. Realtime

Abonnements possibles :

- missions;
- mission_items;
- mission_problems;
- assignments;
- sync status;
- positions.

Flux :

```text
Realtime
  ↓
Identifier l’entité
  ↓
Invalider Query
  ↓
Relire projection
```

---

# 160. Realtime n’est pas la source de vérité

Une interruption Realtime ne doit pas :

- perdre la Mission;
- empêcher une rel lecture;
- afficher une position ancienne comme actuelle;
- masquer une erreur de synchronisation.

---

# 161. Synchronisation

La spécification complète sera définie dans :

```text
12-Operator-Integration-and-Synchronization.md
```

Le présent document impose déjà :

- Mission versionnée;
- MissionItems figés;
- transitions idempotentes;
- occurredAt et receivedAt;
- source;
- deviceId;
- sequence;
- sync health;
- conflits visibles.

---

# 162. État hors ligne

La supervision doit distinguer :

```text
Mission active
Opérateur hors ligne
Dernière donnée connue
Opérations en attente
```

---

# 163. SyncHealthStatus

Valeurs :

```text
HEALTHY
DEGRADED
OFFLINE
BLOCKED
UNKNOWN
```

---

# 164. Appareil non supporté

Le système peut afficher :

```text
Version RECA Opérateur non supportée
```

et bloquer la préparation si le contrat d’intégration est incompatible.

---

# 165. Version Mission payload

Le payload envoyé à RECA Opérateur doit inclure :

```text
schemaVersion
missionVersion
geometryVersion
```

---

# 166. Desktop — Routes

Le Desktop doit privilégier :

- liste dense;
- vue partagée;
- carte utile;
- réorganisation claire;
- actions contextuelles;
- résumé compact.

---

# 167. Desktop — Missions

Le Desktop doit privilégier :

- progression;
- carte;
- MissionItem actif;
- liste dense;
- problèmes;
- synchronisation;
- historique.

---

# 168. Mobile administratif

Le Mobile doit permettre :

- consulter;
- assigner;
- voir progression;
- voir problèmes;
- ouvrir la carte;
- intervenir rapidement.

Il ne doit pas tenter de remplacer RECA Opérateur.

---

# 169. Mobile — fiche Mission

Premier écran recommandé :

```text
MIS-2026-0009 · LaSalle
EN COURS

18 / 28
64 %

Test Opérateur
Kubota FPT3101
Synchronisé il y a 18 s

[Ouvrir la supervision]
```

---

# 170. Mobile — fiche Route

Premier écran :

```text
RTE-000014 · LaSalle
ACTIVE

28 Contrats
2 450 m²
3 h 25 estimées

[Créer une Mission]
```

---

# 171. Tablette

La Tablette peut utiliser :

- liste + carte;
- panneau latéral;
- bottom sheet;
- interactions tactiles;
- carte dominante.

---

# 172. Design visuel

Le module opérationnel doit sembler :

- robuste;
- rapide;
- dense;
- calme;
- précis;
- spécifique au déneigement.

Il ne doit pas ressembler à :

- un CRM générique;
- une page de cartes blanches empilées;
- un formulaire administratif;
- un tableau sans hiérarchie.

---

# 173. Couleurs fonctionnelles

```text
Vert
Intervention active ou succès

Bleu
Déplacement, préparation, information

Ambre
Avertissement, retard, dégradation

Rouge
Problème critique, annulation, destructif

Gris
Attente, inactif, donnée périmée
```

---

# 174. Une seule action dominante

Chaque écran doit posséder une action principale contextuelle.

Les actions rares ou destructives doivent être dans un menu.

---

# 175. États vides Routes

```text
Aucune Route

Créez une Route et ajoutez-y des Contrats actifs.

[Nouvelle Route]
```

---

# 176. État Route vide

```text
Cette Route ne contient aucun Contrat.

[Ajouter un Contrat]
```

---

# 177. États vides Missions

```text
Aucune Mission

Créez une Mission à partir d’une Route active.

[Nouvelle Mission]
```

---

# 178. État sans Mission aujourd’hui

```text
Aucune Mission prévue aujourd’hui.
```

État positif compact, sans grande carte vide.

---

# 179. Erreur partielle

Une erreur de carte ne doit pas bloquer la liste.

Une erreur de synchronisation ne doit pas bloquer la consultation historique.

---

# 180. Performance

Objectifs :

- pagination serveur;
- projections optimisées;
- carte chargée en différé;
- Realtime ciblé;
- pas de chargement de tous les Contrats;
- liste virtualisée si nécessaire;
- sélection minimale.

---

# 181. Query Keys

Exemples :

```ts
routeKeys.all
routeKeys.list(filters)
routeKeys.detail(id)
routeKeys.items(id)
routeKeys.readiness(id)

missionKeys.all
missionKeys.list(filters)
missionKeys.detail(id)
missionKeys.items(id)
missionKeys.problems(id)
missionKeys.sync(id)
missionKeys.history(id)
```

---

# 182. Mutations Routes

```text
CreateRoute
UpdateRoute
AddContractToRoute
RemoveContractFromRoute
ReorderRouteItems
ActivateRoute
DeactivateRoute
ArchiveRoute
DuplicateRoute
```

---

# 183. Mutations Missions

```text
CreateMissionFromRoute
AssignOperator
AssignEquipment
ReorderMissionItems
MarkMissionReady
StartMission
PauseMission
ResumeMission
CompleteMission
CancelMission
CorrectMissionHistory
```

---

# 184. Mutations Problems

```text
ReportProblem
AcknowledgeProblem
ResolveProblem
DismissProblem
```

---

# 185. Événements Route

```text
RouteCreated
RouteUpdated
RouteActivated
RouteDeactivated
RouteArchived
RouteItemAdded
RouteItemRemoved
RouteItemsReordered
RouteDuplicated
MissionCreatedFromRoute
```

---

# 186. Événements Mission

```text
MissionCreated
MissionPrepared
MissionMarkedReady
MissionOperatorAssigned
MissionEquipmentAssigned
MissionStarted
MissionPaused
MissionResumed
MissionCompleted
MissionCancelled
MissionItemTransitioned
MissionProblemReported
MissionProblemResolved
MissionHistoryCorrected
```

---

# 187. Audit

Les actions suivantes doivent être auditées :

- réorganisation;
- assignation;
- annulation;
- correction;
- suppression logique;
- conflit forcé;
- changement de statut;
- transition manuelle;
- fin forcée.

---

# 188. Migration de l’ancienne RECA App

Avant migration :

1. inventorier les Routes;
2. inventorier les RouteItems;
3. inventorier l’ordre;
4. inventorier les assignations;
5. inventorier les Missions;
6. inventorier les MissionItems;
7. inventorier les statuts;
8. inventorier les temps;
9. inventorier les problèmes;
10. inventorier les données Operator;
11. inventorier les RLS;
12. inventorier les données orphelines.

---

# 189. Mappings legacy Route

Créer un registre :

```text
Ancien statut
Nouveau statut
Confiance
Action
```

Toute valeur ambiguë doit devenir :

```text
NEEDS_REVIEW
```

dans un rapport de migration, pas comme statut métier permanent.

---

# 190. Mappings legacy Mission

Le mapping doit être partagé avec RECA Opérateur.

Aucun changement de statut ne doit être fait sans vérifier :

- anciennes valeurs;
- code actuel;
- transitions;
- données terrain;
- historique.

---

# 191. Missions historiques

Les Missions historiques doivent être conservées.

Même si certaines données sont incomplètes :

- ne pas inventer;
- marquer la source;
- conserver les timestamps;
- conserver les relations connues;
- produire un rapport.

---

# 192. MissionItems historiques incomplets

Exemples :

- géométrie absente;
- temps absent;
- Contract supprimé;
- opérateur absent;
- équipement absent.

Le système doit afficher :

```text
Donnée historique incomplète
```

sans créer de fausse précision.

---

# 193. Backfill snapshots

Le backfill peut utiliser les données actuelles seulement si :

- aucune autre source historique;
- la différence est documentée;
- le snapshot est marqué `MIGRATED`;
- aucune prétention d’exactitude historique.

---

# 194. Compatibilité progressive

Pendant la transition :

- ancienne RECA App continue;
- V2 lit via adapters;
- RECA Opérateur continue;
- contrats de données versionnés;
- migrations additives;
- aucun changement destructif prématuré.

---

# 195. Feature flags

Exemples :

```text
new_routes_workspace
new_mission_dispatch
new_mission_supervision
new_problem_center
```

Ils doivent être temporaires.

---

# 196. Tests unitaires Route

Tester :

- statuts;
- activation;
- ajout Contract;
- doublon;
- ordre;
- réorganisation;
- readiness;
- estimation;
- version;
- archivage.

---

# 197. Tests unitaires Mission

Tester :

- création;
- snapshot;
- readiness;
- statuts;
- transitions;
- une résidence active;
- progression;
- assignations;
- conflit;
- fermeture;
- annulation;
- correction.

---

# 198. Tests unitaires MissionItem

Tester :

- transitions permises;
- durée;
- progression;
- fallback adjacent;
- Problem;
- SKIPPED;
- CANCELLED;
- source;
- idempotence.

---

# 199. Tests d’intégration

Tester :

- create_mission_from_route;
- reorder_route_items;
- assign resources;
- mark ready;
- Operator RPC;
- Realtime;
- RLS;
- Problems;
- historique;
- projections;
- migration.

---

# 200. Tests E2E — Route

```text
Créer Route
  ↓
Ajouter 3 Contrats
  ↓
Réordonner
  ↓
Assigner valeurs par défaut
  ↓
Activer
  ↓
Créer Mission
```

---

# 201. Tests E2E — Mission

```text
Créer depuis Route
  ↓
Assigner opérateur
  ↓
Assigner équipement
  ↓
Marquer prête
  ↓
Operator démarre
  ↓
Progression
  ↓
Problème
  ↓
Résolution
  ↓
Mission terminée
```

---

# 202. Tests E2E — conflit

```text
Même équipement sur deux Missions
  ↓
Conflit affiché
  ↓
READY bloqué
  ↓
Réassignation
  ↓
READY permis
```

---

# 203. Tests E2E — snapshot

```text
Créer Mission depuis Route version 5
  ↓
Modifier Route version 6
  ↓
Mission conserve ordre version 5
```

---

# 204. Tests E2E — hors ligne

```text
Operator hors ligne
  ↓
Transitions locales
  ↓
Dashboard affiche dernière donnée connue
  ↓
Synchronisation
  ↓
Événements appliqués dans l’ordre
```

---

# 205. Tests E2E — doublon sync

```text
Même operation envoyée deux fois
  ↓
Idempotency key reconnue
  ↓
Une seule transition appliquée
```

---

# 206. Tests responsive

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

# 207. Fixtures

Prévoir :

```text
Route vide
Route active
Route avec Contrat suspendu
Route avec géométrie manquante
Route avec 30 Contrats
Mission planifiée
Mission prête
Mission en cours
Mission en pause
Mission terminée
Mission avec problème critique
Mission hors ligne
Mission historique incomplète
Conflit opérateur
Conflit équipement
```

---

# 208. Master UI

Le module doit produire deux écrans maîtres.

## Fiche opérationnelle Route

- Desktop;
- Mobile;
- liste + carte;
- préparation;
- action Mission.

## Fiche opérationnelle Mission

- Desktop;
- Mobile;
- progression;
- carte;
- MissionItem actif;
- problèmes;
- synchronisation.

---

# 209. Validation avant code

Avant l’implémentation finale, valider :

- statuts Route;
- statuts Mission;
- statuts MissionItem;
- règle Contrat dans plusieurs Routes;
- géométrie obligatoire;
- conditions READY;
- fermeture avec Problems;
- réorganisation après démarrage;
- Mission spéciale;
- actions Operator vs Dispatcher;
- seuils de synchronisation;
- sources de transition;
- modèle de pauses;
- permissions;
- stratégie de correction.

---

# 210. Hors périmètre initial

Ne pas bloquer la V1 avec :

- optimisation automatique complète;
- IA de répartition;
- météo avancée;
- simulation 3D;
- télémétrie véhicule;
- conversation temps réel;
- suivi vidéo;
- replanification automatique complexe;
- plusieurs opérateurs par Mission;
- plusieurs équipements simultanés par Mission;
- gestion de sous-traitants avancée;
- routes dynamiques temps réel;
- calcul prédictif complexe;
- facturation automatique par Mission.

---

# 211. Décisions à confirmer

Avant l’implémentation finale, confirmer :

- statuts exacts;
- un Contrat dans une ou plusieurs Routes;
- géométrie obligatoire pour Mission;
- opérateur obligatoire pour READY;
- équipement obligatoire pour READY;
- démarrage par Operator seulement ou aussi Dispatcher;
- fermeture avec problèmes ouverts;
- Mission spéciale sans Route;
- ajout ou retrait après démarrage;
- réorganisation après démarrage;
- définition de progression;
- traitement de SKIPPED;
- traitement de PROBLEM;
- temps synthétique adjacent;
- seuils SyncHealth;
- visibilité GPS par rôle;
- conditions de fin;
- raisons d’annulation;
- modèle de reprise;
- rétention GPS;
- correction administrative.

Toutes les décisions confirmées doivent être ajoutées à `memory.md`.

---

# 212. Règles non négociables

Ne jamais confondre Route et Mission.

Ne jamais modifier une Mission existante lorsque la Route change.

Ne jamais modifier un MissionItem historique lorsque le Contrat change.

Ne jamais permettre plus d’un MissionItem actif.

Ne jamais créer une Mission en plusieurs mutations navigateur fragiles.

Ne jamais marquer READY sans recalculer la préparation.

Ne jamais afficher une position périmée comme temps réel.

Ne jamais écraser l’heure terrain avec l’heure de réception.

Ne jamais appliquer deux fois la même opération synchronisée.

Ne jamais placer Annuler ou Archiver au même niveau que l’action principale.

Ne jamais donner à l’Operator l’accès global aux Routes, Clients ou Contrats.

Ne jamais corriger une donnée historique sans audit.

---

# 213. Diagramme principal

```text
Contract
   ↓
RouteItem
   ↓
Route
   ↓
CreateMissionFromRoute
   ↓
Mission
   ├── Operator
   ├── Equipment
   ├── MissionItems
   │     ├── Contract snapshot
   │     ├── Geometry snapshot
   │     ├── Status
   │     ├── Timers
   │     └── Problems
   ├── Transitions
   ├── Synchronization
   └── History
```

---

# 214. Flux de répartition officiel

```text
Route active
      ↓
Vérifier RouteReadiness
      ↓
Créer Mission
      ↓
Créer MissionItems
      ↓
Assigner opérateur
      ↓
Assigner équipement
      ↓
Vérifier MissionReadiness
      ↓
Marquer READY
      ↓
Publier à RECA Opérateur
```

---

# 215. Flux d’exécution officiel

```text
Operator démarre
      ↓
Mission IN_PROGRESS
      ↓
MissionItem EN_ROUTE
      ↓
APPROACHING
      ↓
IN_PROGRESS
      ↓
COMPLETED
      ↓
MissionItem suivant
      ↓
Mission terminée
```

---

# 216. Flux de problème officiel

```text
Problème terrain
      ↓
RECA Opérateur
      ↓
MissionProblem
      ↓
Centre des opérations
      ↓
Dispatcher
      ↓
Résolution ou intervention impossible
      ↓
Historique
```

---

# 217. Résumé officiel

Une Route est un modèle permanent de Contrats ordonnés.

Une Mission est une exécution réelle créée à partir d’une Route.

Les MissionItems sont des snapshots opérationnels.

Les assignations de Route sont des valeurs par défaut.

Les assignations de Mission sont autoritatives.

La Mission doit être préparée avant d’être disponible dans RECA Opérateur.

La répartition doit montrer les conflits, les ressources manquantes et les données invalides.

Une seule résidence peut être active à la fois.

Les problèmes sont des entités structurées.

Les transitions conservent leur source, leur heure terrain et leur heure de réception.

Le Dashboard et la fiche Mission affichent la progression, la synchronisation et les problèmes.

Les Missions passées demeurent intactes même lorsque les Routes ou Contrats évoluent.

L’objectif est de transformer les Routes et Missions en un système opérationnel fiable, supervisable et directement compatible avec le travail terrain de Groupe RECA.
