# 10-Employees-and-Equipment.md

# RECA
## Employés, opérateurs et équipements

Version : 1.0  
Projet : RECA App V2  
Dépôt recommandé : `reca-app-v2`  
Statut : Spécification métier, fonctionnelle et opérationnelle officielle  

---

# 1. Objectif du document

Ce document définit le fonctionnement officiel des modules :

```text
Employés
Opérateurs
Équipements
Disponibilités
Affectations
Maintenance
Historique d’utilisation
```

Il décrit :

- le rôle de chaque entité;
- les relations entre User, Employee et Operator;
- les statuts;
- les disponibilités;
- les compétences;
- les équipements;
- les affectations;
- les conflits;
- la maintenance;
- l’utilisation dans les Routes;
- l’utilisation dans les Missions;
- l’intégration avec RECA Opérateur;
- les permissions;
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
09-Routes-Missions-and-Dispatch.md
```

---

# 2. Vision générale

Le module Équipe doit permettre de répondre rapidement à quatre questions :

```text
Qui travaille ?
Qui peut opérer ?
Quel équipement est disponible ?
Quelle ressource est affectée à quelle Mission ?
```

Il ne doit pas être conçu comme un simple registre administratif.

Il doit soutenir directement :

- la planification;
- la répartition;
- l’exécution;
- la sécurité;
- la disponibilité;
- la maintenance;
- l’historique;
- la supervision.

---

# 3. Concepts distincts

Les concepts suivants doivent demeurer séparés :

```text
User
Employee
Operator
Equipment
Assignment
Availability
MaintenanceEvent
```

---

# 4. User

`User` représente le compte applicatif.

Il est utilisé pour :

- l’authentification;
- les rôles;
- les permissions;
- la session;
- l’accès à RECA App V2;
- l’accès à RECA Opérateur.

Un User n’est pas automatiquement un Employee.

---

# 5. Employee

`Employee` représente une personne travaillant pour ou avec Groupe RECA.

Il peut exister sans compte applicatif.

Exemples :

- employé administratif;
- opérateur saisonnier;
- mécanicien;
- répartiteur;
- représentant;
- employé en préparation;
- ancien employé conservé pour historique.

---

# 6. Operator

`Operator` représente la capacité d’un Employee à utiliser RECA Opérateur et à exécuter une Mission.

Direction officielle :

```text
Operator = Employee actif
+ can_operate = true
+ User actif lié
+ permission Operator
```

Une table `operators` séparée n’est pas obligatoire dans la première version.

---

# 7. Equipment

`Equipment` représente une ressource matérielle utilisée dans les opérations.

Exemples :

- tracteur;
- chargeur;
- camion;
- souffleuse;
- pelle;
- épandeur;
- remorque;
- autre équipement spécialisé.

---

# 8. Assignment

`Assignment` représente l’affectation d’une ressource à :

- une Route;
- une Mission;
- une plage de disponibilité;
- un opérateur;
- un équipement.

Les affectations par défaut et les affectations réelles doivent être distinguées.

---

# 9. Relations principales

```text
User
  ↕
Employee
  ↓
Operator capability
  ↓
Mission assignment
  ↕
Equipment
```

---

# 10. Routes recommandées

## Employés

```text
/employees
/employees/new
/employees/:employeeId
/employees/:employeeId/edit
```

## Équipements

```text
/equipments
/equipments/new
/equipments/:equipmentId
/equipments/:equipmentId/edit
```

## Affectations

```text
/assignments
```

Une vue d’affectation avancée peut être ajoutée plus tard.

---

# 11. Responsabilité du module Employés

Le module doit permettre de :

- créer une fiche Employé;
- modifier les coordonnées;
- définir le statut;
- définir la capacité d’opérer;
- lier un User;
- inviter un User;
- voir les rôles;
- voir les permissions;
- gérer les disponibilités;
- consulter les affectations;
- consulter les Missions;
- consulter l’historique;
- archiver sans perdre les données passées.

---

# 12. Responsabilité du module Équipements

Le module doit permettre de :

- créer un équipement;
- définir son type;
- définir son statut;
- enregistrer sa disponibilité;
- enregistrer les informations d’identification;
- enregistrer les notes;
- affecter à une Route;
- affecter à une Mission;
- consulter les Missions passées;
- suivre la maintenance;
- identifier les conflits;
- archiver sans perdre l’historique.

---

# 13. Responsabilité du module Affectations

Le système doit permettre de :

- assigner un opérateur à une Mission;
- assigner un équipement à une Mission;
- définir des ressources par défaut sur une Route;
- identifier les conflits;
- voir les affectations actuelles;
- voir les affectations futures;
- voir les affectations passées;
- réassigner;
- conserver l’historique.

---

# 14. Entité Employee

Structure conceptuelle :

```ts
type Employee = {
  id: EmployeeId
  organizationId: OrganizationId

  number: string
  firstName: string
  lastName: string

  phone?: string
  email?: string

  status: EmployeeStatus
  canOperate: boolean

  userId?: UserId

  jobTitle?: string
  hireDate?: string
  endDate?: string

  notes?: string

  createdAt: string
  createdBy?: UserId
  updatedAt: string
  updatedBy?: UserId
  deletedAt?: string
}
```

---

# 15. Numéro Employé

Format recommandé :

```text
EMP-000042
```

Le numéro est lisible et stable.

Il ne remplace pas l’UUID technique.

---

# 16. Statuts Employee

Valeurs recommandées :

```text
ACTIVE
SEASONAL
INACTIVE
SUSPENDED
ARCHIVED
```

---

# 17. Signification des statuts Employee

## ACTIVE

- employé actif;
- disponible selon son horaire;
- peut recevoir des affectations.

## SEASONAL

- employé saisonnier;
- actif dans une période définie;
- peut recevoir des affectations pendant sa période.

## INACTIVE

- ne reçoit pas de nouvelles affectations;
- historique conservé.

## SUSPENDED

- accès ou travail temporairement bloqué;
- aucune nouvelle affectation.

## ARCHIVED

- ancien employé;
- retiré des listes courantes;
- historique conservé.

---

# 18. Transitions Employee

Flux possible :

```text
ACTIVE
  ↓
INACTIVE
  ↓
ARCHIVED
```

Branches :

```text
SEASONAL → ACTIVE
ACTIVE → SUSPENDED
SUSPENDED → ACTIVE
INACTIVE → ACTIVE
```

---

# 19. Employé actif et User désactivé

Un Employee peut être actif alors que son User est désactivé.

Exemple :

- fiche RH conservée;
- accès applicatif retiré;
- travail non numérique;
- correction temporaire.

Cependant, un Operator actif doit posséder un User actif pour utiliser RECA Opérateur.

---

# 20. canOperate

Le champ :

```text
can_operate
```

indique qu’un Employee peut être utilisé comme opérateur.

Il ne suffit pas à lui seul.

Conditions complètes :

```text
Employee actif ou saisonnier valide
+ can_operate = true
+ User actif lié
+ permission Operator
```

---

# 21. Validation Operator

Projection recommandée :

```ts
type OperatorEligibility = {
  employeeId: EmployeeId
  isEligible: boolean
  employeeIsActive: boolean
  canOperate: boolean
  hasLinkedUser: boolean
  userIsActive: boolean
  hasOperatorPermission: boolean
  blockingReasons: string[]
  warnings: string[]
}
```

---

# 22. Employé sans User

La fiche doit afficher :

```text
Aucun compte utilisateur lié
```

Action selon permission :

```text
[Inviter]
```

---

# 23. Employé avec User

Afficher :

- courriel de connexion;
- statut du compte;
- rôles;
- dernière connexion;
- état MFA futur;
- action de gestion.

---

# 24. Liaison Employee–User

Règles :

- un Employee peut être lié à zéro ou un User dans la V1;
- un User peut être lié à zéro ou un Employee;
- un Operator doit être lié à un User;
- la liaison utilise les IDs;
- ne jamais lier uniquement par courriel;
- la suppression du lien ne supprime pas l’historique.

---

# 25. Invitation depuis Employee

Flux :

```text
Employee
  ↓
Inviter un User
  ↓
Créer User applicatif
  ↓
Assigner rôle
  ↓
Envoyer invitation
  ↓
Lier user_id
```

---

# 26. Formulaire Employee

Sections recommandées :

```text
Identité
Coordonnées
Emploi
Capacités
Compte utilisateur
Notes
```

---

# 27. Champs Employee

Possibles :

- prénom;
- nom;
- téléphone;
- courriel;
- titre;
- date d’embauche;
- statut;
- canOperate;
- notes;
- User lié.

---

# 28. Validation Employee

Minimum recommandé :

```text
Prénom
Nom
Statut
```

Téléphone recommandé pour les opérateurs.

Courriel requis seulement lorsqu’un compte User doit être créé.

---

# 29. Compétences

La structure doit permettre plus tard :

- types d’équipement autorisés;
- certifications;
- permis;
- compétences;
- restrictions;
- dates d’expiration.

La V1 peut utiliser :

```text
employee_skills
```

ou une structure simple si le besoin est limité.

---

# 30. EmployeeSkill

Structure conceptuelle future :

```ts
type EmployeeSkill = {
  id: string
  employeeId: EmployeeId
  key: string
  level?: string
  validUntil?: string
  notes?: string
}
```

---

# 31. Disponibilité Employee

La disponibilité représente la possibilité de recevoir une affectation.

Elle peut dépendre de :

- statut;
- horaire;
- absence;
- maladie;
- vacances;
- affectation existante;
- restriction;
- période saisonnière.

---

# 32. EmployeeAvailability

Structure conceptuelle :

```ts
type EmployeeAvailability = {
  employeeId: EmployeeId
  date: string
  status: AvailabilityStatus
  startsAt?: string
  endsAt?: string
  reason?: string
}
```

---

# 33. AvailabilityStatus

Valeurs possibles :

```text
AVAILABLE
UNAVAILABLE
PARTIALLY_AVAILABLE
ASSIGNED
UNKNOWN
```

---

# 34. Disponibilité V1

La première version peut utiliser une approche simple :

- statut Employee;
- affectations;
- indisponibilités ponctuelles;
- période saisonnière.

Une gestion complète des horaires peut venir plus tard.

---

# 35. Période saisonnière

Pour un Employee `SEASONAL` :

```text
season_start_date
season_end_date
```

ou relation à la saison active.

---

# 36. Indisponibilité

Exemples :

```text
VACATION
SICK
PERSONAL
TRAINING
SUSPENSION
OTHER
```

---

# 37. Conflit Operator

Le système doit identifier :

- opérateur sur deux Missions actives;
- opérateur indisponible;
- User désactivé;
- canOperate faux;
- rôle manquant;
- Employee suspendu;
- application Operator incompatible;
- appareil absent si requis.

---

# 38. Override Operator

Un override administratif peut être permis seulement pour certains conflits non critiques.

Il doit :

- demander une raison;
- produire un événement;
- afficher un avertissement;
- ne jamais contourner l’absence de permission ou de User actif.

---

# 39. Fiche Employee — structure

```text
En-tête
Résumé
Informations
Compte utilisateur
Disponibilité
Missions
Historique
```

Onglets possibles :

```text
Informations
Affectations
Missions
Historique
```

---

# 40. En-tête Employee

Afficher :

```text
EMP-000042 · Test Opérateur
[ACTIF]
```

Informations secondaires :

- titre;
- canOperate;
- statut User;
- prochaine affectation.

Action primaire contextuelle :

```text
Assigner
```

ou :

```text
Inviter
```

ou :

```text
Modifier
```

Menu :

```text
Suspendre
Désactiver
Archiver
```

---

# 41. Résumé Employee

Statistiques utiles :

```text
Missions cette saison
Heures d’intervention
Problèmes signalés
Équipement actuel
Dernière synchronisation
```

Seulement pour les opérateurs.

---

# 42. Onglet Informations Employee

Afficher :

- coordonnées;
- statut;
- emploi;
- capacité d’opérer;
- notes;
- dates;
- User lié;
- rôles.

---

# 43. Onglet Affectations Employee

Afficher :

- affectation actuelle;
- prochaine Mission;
- Routes par défaut;
- historique d’affectation;
- conflits.

---

# 44. Onglet Missions Employee

Afficher :

- Missions passées;
- statut;
- date;
- Route;
- équipement;
- durée;
- problèmes;
- performance.

---

# 45. Onglet Historique Employee

Afficher :

- création;
- changement de statut;
- User lié;
- rôle modifié;
- affectation;
- indisponibilité;
- archivage;
- réactivation.

---

# 46. Liste Employees

La liste doit permettre :

- recherche;
- filtre par statut;
- filtre canOperate;
- filtre par rôle;
- filtre par disponibilité;
- filtre par affectation;
- tri;
- mode compact Desktop;
- cartes Mobile.

---

# 47. Recherche Employees

Champs :

- numéro;
- prénom;
- nom;
- téléphone;
- courriel;
- titre;
- rôle.

---

# 48. Résumé Employees

Statistiques compactes :

```text
Actifs
Opérateurs
Disponibles
Assignés
Suspendus
Sans compte
```

---

# 49. Ligne Employee Desktop

Contenu recommandé :

```text
Employé
Statut
Rôle
Opérateur
Disponibilité
Mission actuelle
Équipement
Compte
```

---

# 50. Carte Employee Mobile

Afficher :

- nom;
- statut;
- titre;
- capacité Operator;
- Mission actuelle;
- équipement;
- chevron.

---

# 51. Entité Equipment

Structure conceptuelle :

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

  serialNumber?: string
  plateNumber?: string
  internalCode?: string

  notes?: string

  acquiredAt?: string
  retiredAt?: string

  createdAt: string
  createdBy?: UserId
  updatedAt: string
  updatedBy?: UserId
  deletedAt?: string
}
```

---

# 52. Numéro Equipment

Format recommandé :

```text
EQP-000018
```

Nom d’affichage :

```text
Kubota FPT3101
```

Affichage combiné :

```text
EQP-000018 · Kubota FPT3101
```

---

# 53. Types Equipment

Valeurs initiales possibles :

```text
TRACTOR
LOADER
TRUCK
SNOW_BLOWER
SPREADER
TRAILER
ATV
OTHER
```

La liste finale doit être confirmée selon l’inventaire réel.

---

# 54. Statuts Equipment

Valeurs recommandées :

```text
AVAILABLE
ASSIGNED
IN_USE
MAINTENANCE
OUT_OF_SERVICE
INACTIVE
ARCHIVED
```

---

# 55. Signification des statuts Equipment

## AVAILABLE

- disponible pour une Mission.

## ASSIGNED

- affecté à une Mission future ou prête.

## IN_USE

- utilisé dans une Mission en cours.

## MAINTENANCE

- temporairement indisponible;
- entretien planifié ou en cours.

## OUT_OF_SERVICE

- inutilisable;
- panne ou sécurité.

## INACTIVE

- non utilisé temporairement.

## ARCHIVED

- retiré de l’inventaire courant;
- historique conservé.

---

# 56. Statut calculé ou manuel

Certains statuts peuvent être dérivés.

Exemple :

```text
Mission en cours
  ↓
Equipment = IN_USE
```

Le système doit éviter une incohérence entre :

- statut manuel;
- affectation;
- Mission réelle.

Direction recommandée :

```text
Base status
+ operational status derived
```

---

# 57. BaseEquipmentStatus

Exemple :

```text
AVAILABLE
MAINTENANCE
OUT_OF_SERVICE
INACTIVE
ARCHIVED
```

---

# 58. OperationalEquipmentStatus

Exemple dérivé :

```text
UNASSIGNED
ASSIGNED
IN_USE
```

Affichage combiné possible :

```text
Disponible · Assigné à MIS-2026-0009
```

---

# 59. EquipmentAvailability

Projection conceptuelle :

```ts
type EquipmentAvailability = {
  equipmentId: EquipmentId
  baseStatus: EquipmentBaseStatus
  operationalStatus: EquipmentOperationalStatus
  isAvailable: boolean
  assignedMissionId?: MissionId
  assignedEmployeeId?: EmployeeId
  activeMaintenanceId?: MaintenanceEventId
  conflicts: EquipmentConflict[]
  warnings: string[]
}
```

---

# 60. Formulaire Equipment

Sections recommandées :

```text
Identification
Type
Statut
Informations techniques
Disponibilité
Notes
```

---

# 61. Champs Equipment

Possibles :

- nom;
- type;
- marque;
- modèle;
- année;
- numéro de série;
- plaque;
- code interne;
- statut;
- date d’acquisition;
- notes.

---

# 62. Validation Equipment

Minimum recommandé :

```text
Nom
Type
Statut
```

Une plaque ou un numéro de série n’est pas obligatoire pour tous les types.

---

# 63. Identification unique

Le système doit aider à détecter :

- même numéro de série;
- même plaque;
- même code interne;
- même nom exact.

Il ne doit pas bloquer des doublons légitimes sans confirmation.

---

# 64. Compétence Equipment–Operator

Une future relation peut définir :

```text
Employee autorisé pour EquipmentType
```

La V1 peut afficher un avertissement si l’information existe.

---

# 65. Maintenance

Le système doit permettre de conserver un historique de maintenance.

Structure conceptuelle :

```ts
type MaintenanceEvent = {
  id: MaintenanceEventId
  organizationId: OrganizationId
  equipmentId: EquipmentId

  type: MaintenanceType
  status: MaintenanceStatus

  title: string
  description?: string

  scheduledAt?: string
  startedAt?: string
  completedAt?: string

  odometer?: number
  engineHours?: number

  costCents?: number
  vendor?: string
  notes?: string

  createdAt: string
  createdBy?: UserId
}
```

---

# 66. MaintenanceType

Valeurs possibles :

```text
INSPECTION
PREVENTIVE
REPAIR
BREAKDOWN
TIRE
FLUID
ELECTRICAL
OTHER
```

---

# 67. MaintenanceStatus

```text
PLANNED
IN_PROGRESS
COMPLETED
CANCELLED
```

---

# 68. Maintenance active

Un Equipment avec maintenance active doit être :

```text
isAvailable = false
```

sauf override administratif exceptionnel.

---

# 69. Panne pendant Mission

Flux :

```text
Equipment failure
  ↓
Problem signalé
  ↓
Equipment = OUT_OF_SERVICE ou MAINTENANCE
  ↓
Mission en pause ou réassignation
  ↓
Nouvel équipement
  ↓
Historique d’affectation
```

---

# 70. Réassignation Equipment

Une Mission active peut changer d’équipement.

La réassignation doit conserver :

- ancien équipement;
- nouvel équipement;
- heure;
- acteur;
- raison;
- impact;
- synchronisation vers RECA Opérateur.

---

# 71. EquipmentAssignmentHistory

Structure conceptuelle :

```ts
type EquipmentAssignmentHistory = {
  id: string
  missionId: MissionId
  equipmentId: EquipmentId
  assignedAt: string
  unassignedAt?: string
  assignedBy: UserId
  reason?: string
}
```

---

# 72. Fiche Equipment — structure

```text
En-tête
Résumé
Informations
Disponibilité
Affectations
Maintenance
Missions
Historique
```

Onglets recommandés :

```text
Informations
Affectations
Maintenance
Missions
Historique
```

---

# 73. En-tête Equipment

Afficher :

```text
EQP-000018 · Kubota FPT3101
[DISPONIBLE]
```

Informations secondaires :

- type;
- marque;
- modèle;
- année;
- Mission actuelle;
- opérateur actuel.

Action primaire contextuelle :

```text
Assigner
```

ou :

```text
Planifier une maintenance
```

Menu :

```text
Modifier
Mettre hors service
Désactiver
Archiver
```

---

# 74. Résumé Equipment

Statistiques utiles :

```text
Missions cette saison
Heures d’utilisation
Dernière maintenance
Prochaine maintenance
Problèmes
```

---

# 75. Onglet Informations Equipment

Afficher :

- identification;
- type;
- marque;
- modèle;
- année;
- série;
- plaque;
- statut;
- notes;
- dates.

---

# 76. Onglet Affectations Equipment

Afficher :

- Mission actuelle;
- prochaine Mission;
- opérateur;
- Routes par défaut;
- conflits;
- historique.

---

# 77. Onglet Maintenance Equipment

Afficher :

- maintenance active;
- prochaine maintenance;
- historique;
- coûts;
- documents;
- notes.

---

# 78. Onglet Missions Equipment

Afficher :

- date;
- Mission;
- Route;
- opérateur;
- durée;
- surface;
- problèmes;
- statut.

---

# 79. Onglet Historique Equipment

Afficher :

- création;
- changement de statut;
- affectation;
- panne;
- maintenance;
- réassignation;
- archivage.

---

# 80. Liste Equipments

La liste doit permettre :

- recherche;
- filtre par type;
- filtre par statut;
- filtre par disponibilité;
- filtre par affectation;
- filtre par maintenance;
- tri;
- mode compact Desktop;
- cartes Mobile.

---

# 81. Recherche Equipments

Champs :

- numéro;
- nom;
- type;
- marque;
- modèle;
- plaque;
- série;
- code interne.

---

# 82. Résumé Equipments

Statistiques compactes :

```text
Disponibles
Assignés
En utilisation
Maintenance
Hors service
```

---

# 83. Ligne Equipment Desktop

Contenu recommandé :

```text
Équipement
Type
Statut
Disponibilité
Mission
Opérateur
Maintenance
Dernière activité
```

---

# 84. Carte Equipment Mobile

Afficher :

- nom;
- type;
- statut;
- Mission actuelle;
- opérateur;
- maintenance;
- chevron.

---

# 85. Affectations par défaut Route

Une Route peut référencer :

```text
default_operator_id
default_equipment_id
```

Ces valeurs :

- préremplissent une Mission;
- ne bloquent pas nécessairement l’activation;
- doivent être validées lors de la création de Mission;
- ne sont pas autoritatives après création.

---

# 86. Affectations Mission

Une Mission possède :

```text
operator_id
equipment_id
```

ou une table d’historique plus complète.

Les affectations Mission sont autoritatives pour l’exécution.

---

# 87. ResourceAssignment

Structure conceptuelle :

```ts
type ResourceAssignment = {
  id: ResourceAssignmentId
  organizationId: OrganizationId

  employeeId?: EmployeeId
  equipmentId?: EquipmentId

  routeId?: RouteId
  missionId?: MissionId

  type: AssignmentType
  status: AssignmentStatus

  startsAt?: string
  endsAt?: string

  createdAt: string
  createdBy?: UserId
  cancelledAt?: string
  cancelledBy?: UserId
}
```

---

# 88. AssignmentType

```text
ROUTE_DEFAULT
MISSION_PLANNED
MISSION_ACTIVE
TEMPORARY
```

---

# 89. AssignmentStatus

```text
PLANNED
ACTIVE
COMPLETED
CANCELLED
```

---

# 90. Modèle V1 simplifié

La V1 peut conserver des champs directs sur Route et Mission.

Une table d’historique dédiée doit être ajoutée lorsque nécessaire pour :

- réassignation;
- périodes;
- audit;
- conflit;
- statistique.

---

# 91. Conflits d’affectation

Conflits bloquants possibles :

```text
Operator sur deux Missions actives
Equipment sur deux Missions actives
Employee suspendu
Equipment hors service
Operator sans User actif
Operator sans permission
```

Avertissements possibles :

```text
Operator sur deux Missions futures
Equipment sur deux Missions futures
Maintenance planifiée proche
Disponibilité partielle
```

---

# 92. AssignmentConflict

Structure conceptuelle :

```ts
type AssignmentConflict = {
  type: AssignmentConflictType
  severity: 'WARNING' | 'BLOCKING'
  employeeId?: EmployeeId
  equipmentId?: EquipmentId
  conflictingMissionId?: MissionId
  message: string
}
```

---

# 93. Détection de conflits

La détection doit s’exécuter :

- lors de la sélection;
- avant sauvegarde;
- avant `READY`;
- avant démarrage;
- lors d’un changement de statut;
- lors d’une maintenance;
- lors d’une désactivation.

---

# 94. Modification d’un Employee assigné

Si un Employee assigné devient inactif :

- afficher l’impact;
- identifier les Missions;
- bloquer ou demander une réassignation;
- conserver l’historique;
- mettre à jour le Dashboard.

---

# 95. Modification d’un Equipment assigné

Si un Equipment devient `MAINTENANCE` ou `OUT_OF_SERVICE` :

- identifier les Missions;
- produire un AttentionItem;
- bloquer `READY`;
- proposer une réassignation;
- conserver l’historique.

---

# 96. Archivage Employee

Avant archivage, vérifier :

- Mission active;
- Mission future;
- Route par défaut;
- User actif;
- responsabilités.

L’archivage ne doit pas supprimer :

- Missions;
- temps;
- problèmes;
- événements;
- historique.

---

# 97. Archivage Equipment

Avant archivage, vérifier :

- Mission active;
- Mission future;
- Route par défaut;
- maintenance ouverte.

L’historique doit rester intact.

---

# 98. Suppression physique

La suppression physique est interdite depuis l’interface métier normale.

Préférer :

```text
Archiver
Désactiver
Mettre hors service
```

---

# 99. Disponibilité dans le Dashboard

Le Centre des opérations doit afficher :

```text
Opérateurs disponibles
Opérateurs assignés
Opérateurs hors ligne
Équipements disponibles
Équipements assignés
Équipements en maintenance
```

---

# 100. AttentionItems

Exemples :

```text
Mission sans opérateur
Mission sans équipement
Operator sans compte actif
Equipment en maintenance assigné
Employee suspendu assigné
Maintenance en retard
Equipment hors service
```

---

# 101. EmployeeStatusSummary

Structure conceptuelle :

```ts
type EmployeeStatusSummary = {
  employeeId: EmployeeId
  name: string
  status: EmployeeStatus
  canOperate: boolean
  eligibility: OperatorEligibility
  availability: AvailabilityStatus
  activeMissionId?: MissionId
  assignedEquipmentId?: EquipmentId
  lastSyncAt?: string
}
```

---

# 102. EquipmentStatusSummary

Structure conceptuelle :

```ts
type EquipmentStatusSummary = {
  equipmentId: EquipmentId
  name: string
  type: EquipmentType
  baseStatus: EquipmentBaseStatus
  operationalStatus: EquipmentOperationalStatus
  activeMissionId?: MissionId
  operatorId?: EmployeeId
  maintenanceStatus?: MaintenanceStatus
  warnings: string[]
}
```

---

# 103. RECA Opérateur

RECA Opérateur doit recevoir :

- EmployeeId;
- UserId;
- nom;
- Mission assignée;
- Equipment assigné;
- permissions;
- version de l’application;
- données minimales.

---

# 104. Operator Session

La session Operator doit vérifier :

```text
User actif
Employee lié
Employee actif
canOperate = true
permission Operator
Mission assignée
```

---

# 105. Equipment dans RECA Opérateur

RECA Opérateur peut afficher :

- nom;
- type;
- identifiant;
- informations utiles;
- changement d’équipement si autorisé;
- problème associé.

Il ne doit pas exposer toutes les données administratives.

---

# 106. Réassignation pendant Mission

Flux recommandé :

```text
Equipment failure
  ↓
Dispatcher ouvre Mission
  ↓
Choisit nouvel Equipment
  ↓
Vérifie conflits
  ↓
Confirme raison
  ↓
Crée historique
  ↓
Met à jour Mission
  ↓
Synchronise Operator
```

---

# 107. Changement d’Operator pendant Mission

Flux similaire :

```text
Operator unavailable
  ↓
Sélection nouvel Operator
  ↓
Vérifier User et permissions
  ↓
Transférer Mission
  ↓
Révoquer ancien accès
  ↓
Synchroniser
  ↓
Historique
```

---

# 108. Ancien Operator et opérations locales

Avant une réassignation, vérifier :

- opérations non synchronisées;
- conflits;
- dernière activité;
- appareil;
- fermeture de session.

Le transfert ne doit pas perdre les opérations terrain.

---

# 109. Device

Une future relation Device peut permettre de savoir :

- appareil;
- version;
- dernier accès;
- dernière synchronisation;
- User;
- Employee;
- statut.

---

# 110. Permissions Employees

Permissions recommandées :

```text
employee.read
employee.create
employee.update
employee.invite_user
employee.link_user
employee.manage_availability
employee.suspend
employee.archive
employee.read_history
```

---

# 111. Permissions Equipments

```text
equipment.read
equipment.create
equipment.update
equipment.assign
equipment.change_status
equipment.manage_maintenance
equipment.archive
equipment.read_history
```

---

# 112. Permissions Assignments

```text
assignment.read
assignment.create
assignment.update
assignment.override_conflict
assignment.cancel
```

---

# 113. Administrator

Accès complet.

---

# 114. Manager

Accès recommandé :

- lecture;
- assignation;
- statuts;
- maintenance;
- historique;
- conflits;
- réassignation.

---

# 115. Dispatcher

Accès recommandé :

- lecture Employees;
- lecture Equipments;
- assignations;
- disponibilité;
- conflits;
- réassignation;
- statut opérationnel.

Modification administrative limitée.

---

# 116. Accounting

Accès limité aux informations nécessaires.

Aucune modification d’affectation.

---

# 117. Sales

Lecture minimale ou aucune selon le besoin.

---

# 118. Operator

Accès :

- propre profil;
- Equipment assigné;
- Mission assignée;
- signalement de problème.

Aucun accès global aux Employees ou Equipments.

---

# 119. RLS Employees

Lecture :

- même organisation;
- permission;
- propre profil selon cas.

Écriture :

- même organisation;
- permission.

L’Operator peut lire une projection minimale de lui-même.

---

# 120. RLS Equipments

Lecture :

- rôles opérationnels;
- Operator seulement pour Equipment assigné;
- même organisation.

Écriture :

- permission;
- transaction contrôlée pour les statuts sensibles.

---

# 121. RLS Assignments

L’Operator peut lire son affectation.

Il ne peut pas créer ou modifier une affectation administrative.

---

# 122. RPC Affectations

Exemples :

```text
assign_operator_to_mission
assign_equipment_to_mission
reassign_operator
reassign_equipment
set_route_default_resources
```

---

# 123. RPC Maintenance

Exemples :

```text
schedule_equipment_maintenance
start_equipment_maintenance
complete_equipment_maintenance
mark_equipment_out_of_service
```

---

# 124. Transactions critiques

Doivent être atomiques :

```text
AssignOperatorToMission
AssignEquipmentToMission
ReassignOperator
ReassignEquipment
ArchiveEmployee
ArchiveEquipment
StartMaintenance
CompleteMaintenance
```

---

# 125. Événements Employee

```text
EmployeeCreated
EmployeeUpdated
EmployeeStatusChanged
EmployeeOperatorCapabilityChanged
EmployeeUserLinked
EmployeeUserUnlinked
EmployeeAvailabilityChanged
EmployeeArchived
```

---

# 126. Événements Equipment

```text
EquipmentCreated
EquipmentUpdated
EquipmentStatusChanged
EquipmentAssigned
EquipmentUnassigned
EquipmentMaintenanceScheduled
EquipmentMaintenanceStarted
EquipmentMaintenanceCompleted
EquipmentMarkedOutOfService
EquipmentArchived
```

---

# 127. Événements Assignment

```text
OperatorAssignedToMission
OperatorReassigned
EquipmentAssignedToMission
EquipmentReassigned
RouteDefaultResourcesChanged
AssignmentConflictOverridden
```

---

# 128. Audit

Les actions suivantes doivent être auditées :

- changement de statut;
- changement de capacité Operator;
- liaison User;
- réassignation;
- override de conflit;
- mise hors service;
- maintenance;
- archivage;
- réactivation.

---

# 129. Desktop — liste Employees

Utiliser :

- tableau ou rangées;
- filtres;
- recherche;
- résumé compact;
- densité confortable/compacte;
- actions contextuelles.

---

# 130. Desktop — liste Equipments

Même principe.

La disponibilité opérationnelle doit être plus visible que les métadonnées secondaires.

---

# 131. Desktop — fiche Employee

Structure à deux colonnes possible :

```text
Informations principales
Compte et permissions
```

Puis onglets pour :

- affectations;
- Missions;
- historique.

---

# 132. Desktop — fiche Equipment

Structure recommandée :

```text
État opérationnel
Informations
Affectation actuelle
Maintenance
Historique
```

---

# 133. Mobile — liste Employees

Cartes compactes.

Ne pas afficher de grandes statistiques.

Filtres accessibles dans une barre ou un sheet.

---

# 134. Mobile — fiche Employee

Premier écran :

```text
EMP-000042 · Test Opérateur
ACTIF

Opérateur autorisé
Mission : MIS-2026-0009
Equipment : Kubota FPT3101

[Voir la Mission]
```

---

# 135. Mobile — fiche Equipment

Premier écran :

```text
EQP-000018 · Kubota FPT3101
EN UTILISATION

MIS-2026-0009
Test Opérateur

[Voir la Mission]
```

---

# 136. Tablette

La Tablette peut utiliser :

- liste + détail;
- carte opérationnelle;
- panneau latéral;
- actions tactiles;
- historique compact.

---

# 137. Design visuel

Le module doit sembler :

- professionnel;
- opérationnel;
- robuste;
- précis;
- dense;
- cohérent avec le Centre des opérations.

---

# 138. Couleurs fonctionnelles

```text
Vert
Disponible, actif, opérationnel

Bleu
Assigné, information

Ambre
Maintenance prochaine, disponibilité partielle

Rouge
Hors service, suspendu, conflit critique

Gris
Inactif, archivé, inconnu
```

---

# 139. Actions destructives

Suspendre, mettre hors service ou archiver doivent être dans un menu secondaire.

L’action primaire dépend du contexte :

```text
Assigner
Modifier
Planifier une maintenance
Inviter
```

---

# 140. États vides Employees

```text
Aucun Employé

Ajoutez les membres de l’équipe qui utiliseront ou administreront RECA.

[Nouvel Employé]
```

---

# 141. États vides Equipments

```text
Aucun Équipement

Ajoutez les véhicules et équipements utilisés dans les Missions.

[Nouvel Équipement]
```

---

# 142. Employé sans Mission

État compact :

```text
Aucune Mission assignée
```

---

# 143. Equipment sans affectation

```text
Disponible
Aucune Mission assignée
```

---

# 144. Equipment en maintenance

```text
Maintenance en cours
Indisponible pour les Missions
```

---

# 145. Erreur partielle

Une erreur de chargement des Missions passées ne doit pas bloquer la fiche Employee ou Equipment.

---

# 146. Recherche globale

Les résultats doivent inclure :

```text
Employé · EMP-000042
Équipement · EQP-000018
```

---

# 147. Command Palette

Commandes possibles :

```text
Nouvel Employé
Nouvel Équipement
Assigner un Operator
Assigner un Equipment
Planifier une maintenance
```

Filtrées par permission.

---

# 148. Performance

Les listes doivent utiliser :

- pagination serveur;
- filtres serveur;
- recherche debouncée;
- index;
- préchargement de fiche;
- sélection minimale.

---

# 149. Query Keys

Exemples :

```ts
employeeKeys.all
employeeKeys.list(filters)
employeeKeys.detail(id)
employeeKeys.assignments(id)
employeeKeys.missions(id)
employeeKeys.history(id)
employeeKeys.eligibility(id)

equipmentKeys.all
equipmentKeys.list(filters)
equipmentKeys.detail(id)
equipmentKeys.assignments(id)
equipmentKeys.maintenance(id)
equipmentKeys.missions(id)
equipmentKeys.history(id)
equipmentKeys.availability(id)
```

---

# 150. Mutations Employee

```text
CreateEmployee
UpdateEmployee
ChangeEmployeeStatus
SetOperatorCapability
LinkUser
UnlinkUser
SetAvailability
ArchiveEmployee
```

---

# 151. Mutations Equipment

```text
CreateEquipment
UpdateEquipment
ChangeEquipmentStatus
AssignEquipment
ScheduleMaintenance
StartMaintenance
CompleteMaintenance
ArchiveEquipment
```

---

# 152. Mutations Assignment

```text
AssignOperatorToMission
AssignEquipmentToMission
ReassignOperator
ReassignEquipment
CancelAssignment
OverrideAssignmentConflict
```

---

# 153. Validation de concurrence

Une affectation doit vérifier la version de la Mission.

Une maintenance doit vérifier la version de l’Equipment.

Éviter les écrasements silencieux.

---

# 154. Migration de l’ancienne RECA App

Avant migration :

1. inventorier les Employees;
2. inventorier les Users liés;
3. inventorier les rôles;
4. inventorier les valeurs `can_operate`;
5. inventorier les Equipments;
6. inventorier les types;
7. inventorier les statuts;
8. inventorier les affectations;
9. inventorier les Missions historiques;
10. inventorier les incohérences;
11. inventorier les doublons;
12. inventorier les politiques RLS.

---

# 155. Mappings Employee legacy

Créer un registre :

```text
Ancienne valeur
Nouveau statut
Confiance
Action
```

Toute valeur ambiguë doit être révisée.

---

# 156. Mappings Equipment legacy

Même approche pour :

- type;
- statut;
- disponibilité;
- affectation.

---

# 157. Employés orphelins

Cas possibles :

- User sans Employee;
- Employee sans User;
- Operator sans rôle;
- Operator sans `can_operate`;
- User Operator désactivé;
- Employee archivé encore assigné.

Ces cas doivent apparaître dans un rapport de migration.

---

# 158. Equipments orphelins

Cas possibles :

- Equipment archivé assigné;
- Equipment sans type;
- Equipment hors service sur Mission active;
- doublon de plaque;
- doublon de série;
- statut inconnu.

---

# 159. Backfill

Le backfill doit :

- conserver les IDs;
- préserver les Missions historiques;
- préserver les affectations;
- marquer les données ambiguës;
- éviter les statuts inventés;
- produire un rapport.

---

# 160. Compatibilité progressive

Pendant la transition :

- ancienne RECA App continue;
- V2 lit via adapters;
- RECA Opérateur continue;
- champs nouveaux additifs;
- aucun changement destructif;
- mappings centralisés.

---

# 161. Feature flags

Exemples :

```text
new_employee_workspace
new_equipment_workspace
new_assignment_center
new_maintenance_module
```

Ils doivent être temporaires.

---

# 162. Tests unitaires Employee

Tester :

- validation;
- statuts;
- transitions;
- OperatorEligibility;
- liaison User;
- disponibilité;
- archivage;
- conflits.

---

# 163. Tests unitaires Equipment

Tester :

- types;
- statuts;
- disponibilité;
- affectation;
- maintenance;
- archivage;
- conflits;
- historique.

---

# 164. Tests unitaires Assignment

Tester :

- double affectation;
- conflit;
- override;
- réassignation;
- dates;
- Mission active;
- Route par défaut.

---

# 165. Tests d’intégration

Tester :

- repositories;
- RLS;
- invitation;
- liaison User;
- assignation Mission;
- maintenance;
- Realtime;
- Dashboard;
- RECA Opérateur;
- migration.

---

# 166. Tests E2E — Operator

```text
Créer Employee
  ↓
Activer canOperate
  ↓
Inviter User
  ↓
Assigner rôle Operator
  ↓
Assigner Mission
  ↓
Connexion RECA Opérateur
```

---

# 167. Tests E2E — Equipment

```text
Créer Equipment
  ↓
Assigner à Mission
  ↓
Mission démarre
  ↓
Equipment = IN_USE
  ↓
Mission terminée
  ↓
Equipment = AVAILABLE
```

---

# 168. Tests E2E — Maintenance

```text
Planifier maintenance
  ↓
Maintenance démarre
  ↓
Equipment indisponible
  ↓
READY bloqué
  ↓
Maintenance terminée
  ↓
Equipment disponible
```

---

# 169. Tests E2E — panne en Mission

```text
Mission en cours
  ↓
Panne Equipment
  ↓
Problem signalé
  ↓
Equipment hors service
  ↓
Réassignation
  ↓
RECA Opérateur reçoit la mise à jour
```

---

# 170. Tests E2E — conflit Operator

```text
Operator assigné à Mission A
  ↓
Tentative assignation Mission B
  ↓
Conflit bloquant
  ↓
Réassignation ou annulation
```

---

# 171. Tests E2E — archivage

```text
Employee avec Missions passées
  ↓
Archiver
  ↓
Retiré des listes actives
  ↓
Historique conservé
```

---

# 172. Tests responsive

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

# 173. Fixtures

Prévoir :

```text
Employee actif
Employee saisonnier
Employee sans User
Operator valide
Operator invalide
Employee suspendu
Equipment disponible
Equipment assigné
Equipment en utilisation
Equipment en maintenance
Equipment hors service
Conflit Operator
Conflit Equipment
Maintenance planifiée
Mission active avec réassignation
```

---

# 174. Master UI

Le module doit dériver du Master UI opérationnel.

## Fiche opérationnelle simple

Pour :

- Employee;
- Equipment.

## Liste opérationnelle

Pour :

- Employees;
- Equipments.

## Panneau d’affectation

Composant partagé pour :

- Route;
- Mission;
- Dashboard;
- fiches Employee;
- fiches Equipment.

---

# 175. Validation avant code

Avant implémentation finale, valider :

- statuts Employee;
- statuts Equipment;
- modèle Operator;
- rôle de `can_operate`;
- User obligatoire;
- disponibilité V1;
- modèle de maintenance;
- type d’équipements;
- relation Route par défaut;
- règles de conflit;
- overrides;
- permissions;
- réassignation en Mission;
- archivage;
- historique.

---

# 176. Hors périmètre initial

Ne pas bloquer la V1 avec :

- paie complète;
- CCQ;
- feuilles de temps avancées;
- télémétrie véhicule;
- inventaire de pièces;
- coût total de possession;
- gestion complète d’atelier;
- géolocalisation continue des employés;
- biométrie;
- planification automatique des quarts;
- certification gouvernementale complète;
- gestion RH complète;
- gestion d’assurances;
- gestion de carburant.

---

# 177. Décisions à confirmer

Avant l’implémentation finale, confirmer :

- statuts exacts Employee;
- statuts exacts Equipment;
- User obligatoire pour Operator;
- modèle `can_operate`;
- multi-rôles;
- disponibilités;
- horaires;
- compétences;
- certifications;
- types d’équipement;
- base status vs operational status;
- maintenance V1;
- réassignation pendant Mission;
- override de conflits;
- accès Manager;
- accès Dispatcher;
- données visibles par Operator;
- archivage avec affectation future;
- relation Employee–User;
- gestion des appareils.

Toutes les décisions confirmées doivent être ajoutées à `memory.md`.

---

# 178. Règles non négociables

Ne jamais confondre User, Employee et Operator.

Ne jamais permettre à un Operator sans User actif d’utiliser RECA Opérateur.

Ne jamais assigner un Employee suspendu à une Mission.

Ne jamais assigner un Equipment hors service ou en maintenance sans override explicite.

Ne jamais modifier une affectation historique sans audit.

Ne jamais supprimer un Employee ou Equipment ayant un historique.

Ne jamais donner à l’Operator l’accès global aux Employees ou Equipments.

Ne jamais masquer un conflit critique.

Ne jamais laisser une Mission READY avec une ressource invalide.

Ne jamais écraser une réassignation concurrente.

Ne jamais utiliser l’interface comme seule protection.

---

# 179. Diagramme principal

```text
User
  ↕
Employee
  ├── Status
  ├── Availability
  ├── Skills
  ├── Assignments
  └── Operator capability
          ↓
       Mission
          ↕
       Equipment
          ├── Status
          ├── Availability
          ├── Maintenance
          └── Assignment history
```

---

# 180. Flux Operator officiel

```text
Créer Employee
  ↓
Définir canOperate
  ↓
Créer ou lier User
  ↓
Assigner rôle Operator
  ↓
Vérifier éligibilité
  ↓
Assigner Mission
  ↓
RECA Opérateur
```

---

# 181. Flux Equipment officiel

```text
Créer Equipment
  ↓
Définir statut
  ↓
Valider disponibilité
  ↓
Assigner à Mission
  ↓
IN_USE pendant exécution
  ↓
Historique
  ↓
AVAILABLE après fin
```

---

# 182. Flux panne officiel

```text
Panne signalée
  ↓
Problem
  ↓
Equipment OUT_OF_SERVICE
  ↓
Mission impactée
  ↓
Réassignation
  ↓
Maintenance
  ↓
Retour AVAILABLE
```

---

# 183. Résumé officiel

Le module Équipe gère les personnes et ressources nécessaires aux opérations.

Un User représente l’accès applicatif.

Un Employee représente la personne.

Un Operator représente la capacité opérationnelle d’un Employee.

Un Equipment représente une ressource matérielle.

Les affectations de Route sont des valeurs par défaut.

Les affectations de Mission sont autoritatives.

Les conflits doivent être détectés avant `READY`.

Les ressources invalides ou indisponibles doivent bloquer la Mission selon les règles.

La maintenance influence directement la disponibilité.

Les réassignations conservent un historique.

RECA Opérateur reçoit seulement les données utiles à la Mission.

Le Desktop favorise la densité et la supervision.

Le Mobile favorise la consultation et les actions rapides.

L’objectif est de garantir que chaque Mission possède les bonnes personnes, les bons équipements et un historique complet des ressources utilisées.
