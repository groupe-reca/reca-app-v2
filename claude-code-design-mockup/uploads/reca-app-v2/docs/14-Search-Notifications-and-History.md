# 14-Search-Notifications-and-History.md

# RECA
## Recherche globale, notifications et historique

Version : 1.0  
Projet : RECA App V2  
Dépôt recommandé : `reca-app-v2`  
Statut : Spécification officielle de recherche, notifications et historique  

---

# 1. Objectif du document

Ce document définit l’architecture et le fonctionnement officiels de :

```text
Recherche globale
Recherche par module
Command Palette
Notifications
Centre « À traiter »
Activité récente
Historique des entités
Journal d’événements
Journal d’audit
Historique de synchronisation
```

Il décrit :

- les objectifs;
- les données indexées;
- les règles de sécurité;
- les résultats;
- les priorités;
- les filtres;
- les raccourcis;
- les notifications internes;
- les préférences;
- les événements;
- les timelines;
- l’audit;
- la rétention;
- les comportements Desktop, Tablette et Mobile;
- les projections;
- les transactions;
- les tests;
- les critères de réussite.

Ce document complète notamment :

```text
00-Vision.md
02-Information-Architecture.md
03-Application-Architecture.md
04-Data-Architecture.md
05-Authentication-Roles-Permissions.md
06-Operations-Center-Dashboard.md
07-Leads-Quotes-Clients.md
08-Contracts-and-Measurement.md
09-Routes-Missions-and-Dispatch.md
10-Employees-and-Equipment.md
11-Finance-and-Payments.md
12-Operator-Integration-and-Synchronization.md
13-Mobile-and-Responsive-Experience.md
```

---

# 2. Vision générale

RECA App V2 doit permettre à un utilisateur de retrouver rapidement :

```text
Une personne
Une adresse
Un numéro
Un Contrat
Une Route
Une Mission
Une Facture
Un Paiement
Un Employé
Un Équipement
Un problème
Une action récente
```

L’utilisateur ne doit pas avoir à savoir dans quel module chercher.

Le système doit aussi permettre de comprendre :

```text
Qu’est-ce qui vient de se passer ?
Qu’est-ce qui a changé ?
Qui a fait l’action ?
Qu’est-ce qui demande une intervention ?
```

---

# 3. Principes fondamentaux

1. La recherche doit être globale, rapide et sécurisée.
2. Les résultats doivent respecter les permissions côté serveur.
3. Une notification n’est pas un remplacement du Centre des opérations.
4. Un événement métier n’est pas une note.
5. Un événement d’audit n’est pas une notification.
6. Les historiques doivent conserver la vérité au moment de l’action.
7. Les événements techniques trop fréquents ne doivent pas polluer l’activité utilisateur.
8. Les actions importantes doivent être traçables.
9. Les notifications doivent être utiles, peu nombreuses et configurables.
10. Une donnée sensible ne doit jamais être exposée dans un résultat non autorisé.

---

# 4. Concepts distincts

Les concepts suivants doivent demeurer distincts :

```text
SearchDocument
SearchResult
Command
Notification
AttentionItem
DomainEvent
ActivityItem
AuditEvent
SecurityEvent
SynchronizationEvent
EntityTimelineItem
```

---

# 5. Recherche globale

La recherche globale permet d’interroger plusieurs domaines depuis un seul champ.

Raccourci recommandé :

```text
Ctrl + K
Cmd + K
```

Placeholder recommandé :

```text
Rechercher un client, une adresse, un contrat, une mission…
```

---

# 6. Routes recommandées

```text
/search
/activity
/notifications
/attention
/audit
```

La recherche globale peut aussi s’ouvrir comme Command Palette sans navigation complète.

---

# 7. Entités recherchables

La recherche globale doit pouvoir indexer :

```text
Leads
Soumissions
Clients
Contrats
Routes
Missions
MissionItems
Employés
Équipements
Factures
Paiements
Problèmes
Documents selon permission
```

---

# 8. Champs de recherche par entité

## Lead

- numéro;
- prénom;
- nom;
- entreprise;
- téléphone;
- courriel;
- adresse;
- service;
- source.

## Soumission

- numéro;
- Lead;
- Client;
- entreprise;
- téléphone;
- courriel;
- titre;
- service.

## Client

- numéro;
- prénom;
- nom;
- entreprise;
- téléphone;
- courriel;
- adresse;
- ville;
- code postal.

## Contrat

- numéro;
- Client;
- adresse;
- saison;
- Route;
- téléphone;
- statut.

## Route

- numéro;
- nom;
- secteur;
- Contrats liés;
- opérateur par défaut;
- équipement par défaut.

## Mission

- numéro;
- Route;
- date;
- opérateur;
- équipement;
- adresse;
- Contrat;
- statut.

## MissionItem

- adresse;
- numéro de Contrat;
- Client affiché;
- Mission;
- problème.

## Employé

- numéro;
- prénom;
- nom;
- téléphone;
- courriel;
- rôle;
- titre.

## Équipement

- numéro;
- nom;
- type;
- marque;
- modèle;
- plaque;
- série.

## Facture

- numéro;
- Client;
- Contrat;
- montant;
- échéance;
- statut.

## Paiement

- numéro;
- Client;
- Facture;
- référence;
- méthode;
- montant.

---

# 9. Recherche par numéro

Les numéros visibles doivent être prioritaires.

Exemples :

```text
CLI-000053
CTR-000056
RTE-000014
MIS-2026-0009
FAC-000081
PAI-000104
```

Un résultat exact doit apparaître en premier.

---

# 10. Recherche par adresse

Une adresse doit pouvoir retrouver :

```text
Client
Contrat
Route
Mission
MissionItem
Facture liée
```

L’utilisateur ne doit pas avoir à choisir le bon module avant la recherche.

---

# 11. Recherche par téléphone

Le téléphone doit être normalisé.

Exemple :

```text
4506024195
+14506024195
450 602-4195
```

doivent retourner les mêmes entités autorisées.

---

# 12. Recherche par courriel

Le courriel doit être normalisé en minuscules.

Les résultats doivent respecter :

- permissions;
- organisation;
- visibilité du module.

---

# 13. Normalisation

Le moteur doit normaliser :

- accents;
- majuscules;
- espaces;
- tirets;
- ponctuation;
- téléphone;
- code postal;
- courriel;
- numéros visibles.

---

# 14. Tolérance aux erreurs

Le moteur peut supporter :

- fautes simples;
- préfixes;
- sous-chaînes;
- transposition;
- accents manquants.

Exemple :

```text
St Jerome
Saint-Jérôme
St-Jérôme
```

---

# 15. Recherche exacte et floue

Ordre recommandé :

```text
1. Match exact numéro
2. Match exact téléphone ou courriel
3. Préfixe
4. Match texte normalisé
5. Match flou
6. Historique ou contenu secondaire
```

---

# 16. SearchResult

Structure conceptuelle :

```ts
type SearchResult = {
  id: string
  entityType: SearchEntityType
  entityId: string

  title: string
  subtitle?: string
  metadata?: string[]
  status?: string

  route: string
  icon?: string

  score: number
  matchedFields: string[]
  highlightedText?: string

  organizationId: OrganizationId
}
```

---

# 17. SearchEntityType

Valeurs possibles :

```text
LEAD
QUOTE
CLIENT
CONTRACT
ROUTE
MISSION
MISSION_ITEM
EMPLOYEE
EQUIPMENT
INVOICE
PAYMENT
PROBLEM
DOCUMENT
```

---

# 18. Groupement des résultats

Les résultats peuvent être groupés par type.

Exemple :

```text
Clients
Contrats
Missions
Factures
```

Le meilleur résultat exact peut être affiché avant les groupes.

---

# 19. Nombre de résultats

La Command Palette affiche un nombre limité.

Exemple :

```text
5 résultats par groupe
```

Puis :

```text
Voir tous les résultats
```

---

# 20. Recherche complète

La page `/search` permet :

- plus de résultats;
- filtres;
- tri;
- types;
- dates;
- statuts;
- pagination.

---

# 21. Filtres de recherche

Filtres possibles :

- type d’entité;
- statut;
- date;
- saison;
- secteur;
- Route;
- opérateur;
- Client;
- module;
- document;
- activité.

---

# 22. Recherche et permissions

Le filtrage doit être appliqué côté serveur.

Exemple :

```text
Operator
```

ne doit pas recevoir :

- Factures;
- Paiements;
- Clients complets;
- Contrats complets;
- Missions d’autres opérateurs.

---

# 23. Recherche et modules désactivés

Un module désactivé ne doit pas apparaître :

- dans les résultats;
- dans les suggestions;
- dans les commandes;
- dans les récents.

---

# 24. SearchDocument

Une table ou projection consolidée peut être utilisée.

Structure conceptuelle :

```ts
type SearchDocument = {
  id: string
  organizationId: OrganizationId
  entityType: SearchEntityType
  entityId: string

  title: string
  subtitle?: string
  normalizedText: string
  searchableNumbers?: string[]
  searchablePhones?: string[]
  searchableEmails?: string[]
  searchableAddresses?: string[]

  status?: string
  updatedAt: string
}
```

---

# 25. Stratégies d’implémentation

Solutions possibles :

```text
pg_trgm
tsvector
Vue matérialisée
Table d’index consolidée
RPC de recherche
Combinaison
```

Direction recommandée :

```text
RPC serveur
+ tsvector
+ pg_trgm
+ filtres de permissions
```

La décision finale dépend du schéma réel.

---

# 26. Mise à jour de l’index

L’index doit être mis à jour lors de :

- création;
- modification;
- archivage;
- changement de statut;
- changement d’adresse;
- changement de téléphone;
- migration.

---

# 27. Index asynchrone ou synchrone

Pour les entités critiques :

```text
mise à jour synchrone ou quasi immédiate
```

Pour les documents lourds :

```text
indexation asynchrone
```

---

# 28. Fraîcheur de recherche

Les résultats doivent refléter les changements récents rapidement.

Objectif initial :

```text
moins de 5 secondes pour les entités principales
```

---

# 29. Recherche de documents

La V1 peut rechercher :

- nom de fichier;
- type;
- entité;
- date.

L’indexation du contenu complet PDF est hors périmètre initial.

---

# 30. Résultats récents

La recherche peut afficher :

```text
Récents
```

Basés sur :

- entités récemment ouvertes;
- recherches récentes;
- commandes récentes.

---

# 31. Données des récents

Les récents doivent être :

- propres à l’utilisateur;
- limités;
- non sensibles;
- effaçables;
- filtrés par permissions actuelles.

---

# 32. Épinglés

Une future fonction peut permettre d’épingler :

- Client;
- Mission;
- Route;
- Facture;
- vue.

Hors périmètre initial.

---

# 33. Command Palette

La Command Palette combine :

```text
Recherche
Navigation
Actions
Commandes
```

---

# 34. Command

Structure conceptuelle :

```ts
type Command = {
  id: string
  label: string
  description?: string
  keywords: string[]
  icon?: string

  requiredPermission?: PermissionKey
  requiredModule?: string
  requiredContext?: string

  action: CommandAction
}
```

---

# 35. Commandes possibles

```text
Nouvelle Mission
Nouvelle Route
Nouveau Lead
Nouvelle Soumission
Nouveau Client
Nouveau Contrat
Nouvelle Facture
Enregistrer un Paiement
Nouvel Employé
Nouvel Équipement
Ouvrir le Centre des opérations
Ouvrir les paramètres
```

---

# 36. Commandes contextuelles

Exemples depuis une Mission :

```text
Assigner un opérateur
Assigner un équipement
Mettre en pause
Ouvrir la carte
Résoudre un problème
```

---

# 37. Filtrage des commandes

Une commande apparaît seulement si :

- la permission existe;
- le module est actif;
- le contexte est valide;
- l’état métier permet l’action;
- l’appareil supporte l’action.

---

# 38. Raccourcis clavier

Raccourcis possibles :

```text
Ctrl/Cmd + K
Recherche et commandes

G puis M
Ouvrir Missions

G puis C
Ouvrir Clients

N puis M
Nouvelle Mission
```

Les raccourcis avancés sont optionnels.

Ils doivent être documentés et désactivables si nécessaire.

---

# 39. Mobile Search

Sur Mobile, la recherche globale s’ouvre plein écran.

Elle doit contenir :

- champ;
- annuler;
- récents;
- résultats groupés;
- clavier;
- états vides;
- chargement.

---

# 40. Notifications

Une notification informe un utilisateur d’un changement important.

Elle doit être :

- ciblée;
- utile;
- actionnable;
- limitée;
- sécurisée;
- configurable.

---

# 41. Notification vs AttentionItem

## Notification

Informe qu’un événement vient de se produire.

Exemple :

```text
Une Mission vous a été assignée.
```

## AttentionItem

Représente une situation qui demande encore une action.

Exemple :

```text
Mission sans équipement.
```

Une notification peut disparaître après lecture.

Un AttentionItem reste jusqu’à résolution.

---

# 42. Notification vs Activity

## Notification

Personnelle et ciblée.

## Activity

Historique partagé d’événements utiles.

---

# 43. Notification vs SecurityEvent

Un SecurityEvent peut produire une notification.

Mais l’événement de sécurité demeure dans son journal dédié.

---

# 44. Entité Notification

Structure conceptuelle :

```ts
type Notification = {
  id: NotificationId
  organizationId: OrganizationId
  recipientUserId: UserId

  type: NotificationType
  priority: NotificationPriority

  title: string
  message?: string

  entityType?: string
  entityId?: string
  route?: string

  createdAt: string
  readAt?: string
  dismissedAt?: string
  expiresAt?: string

  sourceEventId?: EventId
}
```

---

# 45. NotificationPriority

```text
LOW
NORMAL
HIGH
CRITICAL
```

---

# 46. Types de notifications

Exemples :

```text
MISSION_ASSIGNED
MISSION_READY
MISSION_STARTED
MISSION_PAUSED
MISSION_COMPLETED
MISSION_CANCELLED

PROBLEM_REPORTED
PROBLEM_RESOLVED

SYNC_DEGRADED
SYNC_BLOCKED
OPERATOR_OFFLINE

QUOTE_ACCEPTED
LEAD_REMINDER_DUE

INVOICE_OVERDUE
PAYMENT_RECORDED

USER_INVITED
ROLE_CHANGED
SECURITY_ALERT
```

---

# 47. Destinataires

Le système doit déterminer les destinataires selon :

- rôle;
- permission;
- affectation;
- responsabilité;
- module;
- préférence;
- criticité.

---

# 48. Exemple Mission

```text
MISSION_ASSIGNED
```

Destinataires possibles :

- Operator assigné;
- Dispatcher;
- Manager selon préférence.

---

# 49. Exemple Problem

```text
PROBLEM_REPORTED
```

Destinataires :

- Dispatcher;
- Manager;
- Administrator;
- Operator concerné selon contexte.

---

# 50. Exemple Finance

```text
INVOICE_OVERDUE
```

Destinataires :

- Accounting;
- Manager selon préférence;
- Sales responsable selon politique.

---

# 51. Préférences de notification

Structure conceptuelle :

```ts
type NotificationPreference = {
  userId: UserId
  type: NotificationType

  inAppEnabled: boolean
  emailEnabled: boolean
  pushEnabled: boolean

  minimumPriority?: NotificationPriority
}
```

---

# 52. Canaux V1

Canal obligatoire :

```text
In-app
```

Canaux futurs :

```text
Email
Push
SMS
```

---

# 53. Notifications in-app

Comportement :

- badge;
- panneau;
- liste;
- lecture;
- ouverture de l’entité;
- marquer comme lu;
- marquer tout comme lu.

---

# 54. Badge

Le badge doit afficher :

```text
nombre non lu
```

Une limite visuelle peut afficher :

```text
99+
```

---

# 55. Panneau de notifications

Sections possibles :

```text
Aujourd’hui
Cette semaine
Plus anciennes
```

Chaque item affiche :

- icône;
- titre;
- message;
- date relative;
- état lu;
- action.

---

# 56. Ouverture d’une notification

Cliquer doit :

- marquer comme lue;
- ouvrir la bonne route;
- ouvrir l’onglet pertinent;
- préserver le contexte;
- gérer une entité archivée.

---

# 57. Entité inaccessible

Si la permission a changé :

```text
Vous n’avez plus accès à cet élément.
```

La notification peut être marquée comme lue.

---

# 58. Dismiss

Une notification peut être :

- lue;
- masquée;
- expirée.

La suppression définitive n’est pas nécessaire.

---

# 59. Expiration

Exemples :

- notification temporaire;
- rappel expiré;
- Mission terminée.

Une notification critique d’audit ne doit pas disparaître sans journal.

---

# 60. Déduplication des notifications

Éviter plusieurs notifications identiques.

Exemple :

```text
Operator offline
```

ne doit pas être recréée à chaque polling.

Utiliser :

- sourceEventId;
- clé de déduplication;
- fenêtre temporelle;
- état courant.

---

# 61. Regroupement

Plusieurs événements peuvent être regroupés.

Exemple :

```text
3 Factures sont maintenant en retard.
```

Au lieu de trois notifications séparées si le besoin le permet.

---

# 62. Notification critique

Une notification critique peut produire :

- bannière;
- badge;
- toast;
- entrée dans À traiter.

Elle ne doit pas dépendre uniquement d’un toast.

---

# 63. Toasts

Les toasts servent à confirmer :

```text
Paiement enregistré
Mission assignée
Note ajoutée
```

Ils ne remplacent pas une notification durable.

---

# 64. Centre des notifications

Route :

```text
/notifications
```

Filtres :

- toutes;
- non lues;
- critiques;
- module;
- période.

---

# 65. Mobile Notifications

Sur Mobile :

- panneau plein écran;
- swipe futur;
- carte compacte;
- accès rapide;
- badge navigation ou header.

---

# 66. Push Notifications

Hors périmètre initial.

Une future version devra gérer :

- consentement;
- appareil;
- token;
- révocation;
- permissions système;
- contenu minimal;
- deep link;
- vie privée.

---

# 67. Email Notifications

Une future version peut envoyer :

- rappel Lead;
- Facture en retard;
- problème critique;
- invitation;
- rapport.

Les emails doivent être idempotents et historisés.

---

# 68. Notification Operator

RECA Opérateur peut recevoir :

- Mission assignée;
- Mission modifiée;
- pause;
- annulation;
- nouvelle alerte;
- réassignation;
- synchronisation bloquée.

---

# 69. Notification Dispatcher

Le Dispatcher peut recevoir :

- Problem;
- Operator offline;
- Mission non prête;
- conflit;
- Mission terminée;
- Equipment hors service.

---

# 70. Notification Sales

Le Sales Representative peut recevoir :

- nouveau Lead;
- rappel;
- Soumission acceptée;
- Soumission expirée;
- Client créé.

---

# 71. Notification Accounting

Accounting peut recevoir :

- Facture prête;
- Facture en retard;
- Payment enregistré;
- incohérence;
- annulation.

---

# 72. Historique des entités

Chaque entité importante doit posséder une timeline.

Exemples :

```text
Client
Contract
Route
Mission
Employee
Equipment
Invoice
Payment
```

---

# 73. EntityTimelineItem

Structure conceptuelle :

```ts
type EntityTimelineItem = {
  id: string
  type: TimelineItemType

  title: string
  description?: string

  actorName?: string
  actorId?: UserId

  occurredAt: string
  source: EventSource

  entityType: string
  entityId: string

  relatedEntityType?: string
  relatedEntityId?: string

  metadata?: Record<string, unknown>
}
```

---

# 74. TimelineItemType

```text
EVENT
NOTE
DOCUMENT
STATUS_CHANGE
ASSIGNMENT
PAYMENT
PROBLEM
SYNC
SECURITY
```

---

# 75. Timeline Client

Exemples :

```text
Client créé
Coordonnées modifiées
Note ajoutée
Soumission liée
Contract créé
Invoice créée
Payment reçu
Client archivé
```

---

# 76. Timeline Contract

Exemples :

```text
Contract créé
Géométrie modifiée
Version incrémentée
Document généré
Contract activé
Ajouté à Route
Invoice générée
Utilisé dans Mission
```

---

# 77. Timeline Route

Exemples :

```text
Route créée
Contract ajouté
Ordre modifié
Operator par défaut modifié
Equipment par défaut modifié
Mission créée
Route archivée
```

---

# 78. Timeline Mission

Exemples :

```text
Mission créée
Operator assigné
Equipment assigné
Mission prête
Mission démarrée
Problem signalé
Mission mise en pause
Mission reprise
Mission terminée
```

---

# 79. Timeline Invoice

Exemples :

```text
Invoice créée
Émise
Envoyée
Payment reçu
Payment annulé
Invoice payée
Invoice annulée
```

---

# 80. Timeline technique vs métier

La timeline utilisateur ne doit pas afficher :

- chaque heartbeat;
- chaque position;
- chaque retry;
- chaque cache invalidation;
- chaque requête;
- chaque batch vide.

Ces événements restent dans les logs techniques.

---

# 81. DomainEvent

Structure conceptuelle :

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

# 82. EventSource

Valeurs :

```text
RECA_APP_V2
RECA_OPERATOR
LEGACY_RECA_APP
SYSTEM
EDGE_FUNCTION
MIGRATION
IMPORT
```

---

# 83. Actor

Un événement peut provenir de :

- User;
- Operator;
- système;
- migration;
- intégration;
- job.

---

# 84. Événement sans acteur humain

Exemple :

```text
InvoiceMarkedOverdue
```

Source :

```text
SYSTEM
```

---

# 85. Payload minimal

Le payload doit contenir seulement ce qui est utile.

Exemple changement de statut :

```json
{
  "from": "READY",
  "to": "IN_PROGRESS"
}
```

Éviter de stocker l’entité entière à chaque événement.

---

# 86. Snapshots et événements

Un événement ne remplace pas un snapshot.

Exemple :

- MissionItem conserve son snapshot;
- événement conserve le changement.

---

# 87. Journal d’audit

Le journal d’audit est réservé aux actions sensibles.

Exemples :

- rôle modifié;
- Payment annulé;
- Contract annulé;
- géométrie modifiée;
- Mission corrigée;
- export;
- User désactivé.

---

# 88. AuditEvent

Structure conceptuelle :

```ts
type AuditEvent = {
  id: string
  organizationId: OrganizationId

  actorId?: UserId
  action: string

  entityType: string
  entityId: string

  occurredAt: string
  source: EventSource

  oldValues?: Record<string, unknown>
  newValues?: Record<string, unknown>

  reason?: string
  correlationId?: string
}
```

---

# 89. Journal de sécurité

Les événements de sécurité doivent rester distincts.

Exemples :

```text
LOGIN_FAILED
USER_DISABLED
ROLE_CHANGED
DEVICE_REVOKED
SENSITIVE_EXPORT_CREATED
```

---

# 90. Accès au journal d’audit

Permissions recommandées :

```text
audit.read
audit.export
security_audit.read
```

Accès typique :

- Administrator;
- Manager selon décision;
- aucun Operator;
- aucun Sales par défaut.

---

# 91. Filtrage du journal d’audit

Filtres :

- acteur;
- action;
- entité;
- période;
- source;
- criticité;
- module.

---

# 92. Export d’audit

L’export doit :

- respecter les permissions;
- être journalisé;
- exclure les secrets;
- indiquer la période;
- indiquer l’auteur;
- produire un fichier protégé.

---

# 93. Historique de synchronisation

La synchronisation possède son propre historique.

Afficher :

- batch;
- opération;
- séquence;
- statut;
- retry;
- conflit;
- acknowledgement;
- app version;
- device;
- Mission.

---

# 94. Historique technique de sync

Réservé aux rôles autorisés.

Il ne doit pas polluer la timeline Mission principale.

---

# 95. Activité globale

Route :

```text
/activity
```

Elle présente les événements métier récents de l’organisation.

---

# 96. RecentActivityItem

Structure conceptuelle :

```ts
type RecentActivityItem = {
  id: EventId
  type: string
  title: string
  description?: string

  actorName?: string
  occurredAt: string

  entityType: string
  entityId: string

  source: EventSource
  severity?: string
}
```

---

# 97. Activité pertinente

Exemples à afficher :

```text
Mission démarrée
Problem signalé
Contract activé
Payment enregistré
Route modifiée
Equipment hors service
Soumission acceptée
```

---

# 98. Activité à exclure

Exemples :

```text
Position GPS reçue
Polling terminé
Query invalidée
Heartbeat
Batch vide
Token rafraîchi
```

---

# 99. Filtres Activité

- module;
- acteur;
- entité;
- date;
- source;
- type;
- gravité.

---

# 100. Activité personnalisée

Le Dashboard peut afficher seulement les activités pertinentes au rôle.

Exemple Dispatcher :

```text
Missions
Problems
Resources
Synchronization
```

Exemple Accounting :

```text
Invoices
Payments
Credits
```

---

# 101. Centre « À traiter »

Route :

```text
/attention
```

Il regroupe les situations non résolues.

---

# 102. AttentionItem

Structure conceptuelle :

```ts
type AttentionItem = {
  id: string
  organizationId: OrganizationId

  category: AttentionCategory
  severity: AttentionSeverity

  title: string
  description?: string

  entityType?: string
  entityId?: string

  createdAt: string
  dueAt?: string

  status: AttentionStatus
  resolutionType?: string
  resolvedAt?: string
  resolvedBy?: UserId
}
```

---

# 103. AttentionStatus

```text
OPEN
SNOOZED
RESOLVED
DISMISSED
EXPIRED
```

---

# 104. Snooze

Une action peut être reportée.

Exemple :

```text
Rappeler demain à 9 h
```

Le snooze ne doit pas être disponible pour tous les éléments critiques.

---

# 105. AttentionItem calculé

Exemple :

```text
Mission sans Equipment
```

peut être calculé dynamiquement.

Il disparaît lorsque l’Equipment est assigné.

---

# 106. AttentionItem persistant

Exemple :

```text
Conflit de synchronisation
```

doit être explicitement résolu.

---

# 107. Catégories À traiter

```text
COMMERCIAL
CLIENT
CONTRACT
ROUTE
MISSION
PROBLEM
EMPLOYEE
EQUIPMENT
FINANCE
SYNCHRONIZATION
SECURITY
SYSTEM
```

---

# 108. Priorité

Tri recommandé :

```text
CRITICAL
HIGH
MEDIUM
LOW
```

Puis :

```text
échéance
ancienneté
```

---

# 109. Notifications et AttentionItem

Un même événement peut produire :

```text
Notification
+ AttentionItem
```

Exemple :

```text
Operator offline
```

Notification :

```text
L’opérateur est hors ligne.
```

AttentionItem :

```text
Vérifier la synchronisation de MIS-2026-0009.
```

---

# 110. Déduplication À traiter

Un même problème ne doit pas produire plusieurs lignes ouvertes identiques.

Utiliser une clé logique :

```text
category + entity + condition
```

---

# 111. Résolution

Une action peut résoudre automatiquement l’AttentionItem.

Exemple :

```text
Assigner Equipment
  ↓
MissionReadiness recalculée
  ↓
AttentionItem résolu
```

---

# 112. Résolution manuelle

Pour certains items :

- saisir une raison;
- marquer résolu;
- conserver l’historique;
- créer un événement.

---

# 113. Rétention des notifications

Les notifications lues peuvent être conservées pendant une durée limitée.

La durée finale doit être confirmée.

Direction initiale :

```text
90 jours
```

---

# 114. Rétention des événements métier

Les événements métier importants doivent être conservés durablement.

Exemples :

- Mission;
- Contract;
- Payment;
- statut;
- géométrie;
- assignation.

---

# 115. Rétention des logs techniques

Les logs techniques peuvent avoir une rétention plus courte.

Exemple :

```text
30 à 90 jours
```

selon le volume et les besoins.

---

# 116. Rétention des événements de sécurité

La durée doit être définie selon :

- audit;
- réglementation;
- incident;
- vie privée;
- volume.

---

# 117. Vie privée

Les historiques doivent éviter :

- contenu complet de notes sensibles;
- tokens;
- secrets;
- données personnelles inutiles;
- GPS brut permanent;
- payloads complets.

---

# 118. Masquage de données

Selon permission, l’historique peut afficher :

```text
Coordonnées modifiées
```

sans exposer les anciennes valeurs complètes.

---

# 119. Recherche et données archivées

Par défaut, les entités archivées peuvent être masquées.

Option :

```text
Inclure les éléments archivés
```

---

# 120. Recherche et historique

Une recherche peut retrouver une entité archivée.

Elle ne doit pas rechercher tous les événements historiques par défaut.

Une recherche d’activité distincte peut le permettre.

---

# 121. Recherche par événement

La V1 peut supporter une recherche limitée dans :

- type;
- acteur;
- entité;
- date;
- numéro.

La recherche plein texte dans tous les payloads est déconseillée.

---

# 122. Permissions Recherche

Permission générale possible :

```text
search.use
```

Puis filtrage par permissions des entités.

---

# 123. Permissions Notifications

```text
notification.read_own
notification.manage_preferences
notification.mark_read
```

Administrateur :

```text
notification.manage_system
```

---

# 124. Permissions Activité

```text
activity.read
activity.read_all
```

---

# 125. Permissions Historique

```text
history.read
history.read_sensitive
history.correct
```

---

# 126. Permissions Audit

```text
audit.read
audit.export
security_audit.read
```

---

# 127. RLS Search

Une RPC de recherche doit appliquer :

- organisation;
- permissions;
- modules;
- scope;
- statut utilisateur.

---

# 128. RLS Notifications

Un User peut lire seulement :

```text
recipient_user_id = current_user_id()
```

Un Administrator peut gérer les modèles, pas nécessairement lire toutes les notifications personnelles sans besoin explicite.

---

# 129. RLS Events

Les événements doivent respecter l’accès à l’entité source.

Une politique trop large sur `domain_events` est interdite.

---

# 130. RLS Audit

Le journal d’audit doit être limité aux rôles autorisés.

---

# 131. Server-side filtering

Le client ne doit pas charger :

- tous les événements;
- toutes les notifications;
- tous les résultats;

puis masquer localement.

---

# 132. Pagination

Recherche :

- pagination serveur;
- limite;
- score.

Notifications :

- curseur ou pagination.

Activité :

- pagination par date.

Historique :

- pagination ou chargement progressif.

---

# 133. Cursor pagination

Appropriée pour :

- activité;
- notifications;
- événements;
- audit.

Curseur possible :

```text
occurredAt + id
```

---

# 134. Query Keys

Exemples :

```ts
searchKeys.global(query, filters)
searchKeys.recent()
searchKeys.commands()

notificationKeys.all
notificationKeys.list(filters)
notificationKeys.unreadCount()
notificationKeys.preferences()

activityKeys.list(filters)
attentionKeys.list(filters)

historyKeys.entity(entityType, entityId, filters)
auditKeys.list(filters)
```

---

# 135. Mutations Notifications

```text
MarkNotificationRead
MarkAllNotificationsRead
DismissNotification
UpdateNotificationPreferences
```

---

# 136. Mutations Attention

```text
ResolveAttentionItem
DismissAttentionItem
SnoozeAttentionItem
```

---

# 137. Mutations Historique

L’historique normal est append-only.

Mutations permises :

```text
AddNote
CorrectHistoryWithAudit
ResolveConflict
```

---

# 138. Append-only

Les événements importants doivent être ajoutés.

Ils ne doivent pas être modifiés arbitrairement.

---

# 139. Correction d’événement

Une correction doit produire :

- événement original;
- événement de correction;
- acteur;
- raison;
- nouvelle valeur;
- date.

---

# 140. Materialized views

Les projections de recherche ou d’activité peuvent utiliser des vues matérialisées.

Elles doivent fournir :

```text
generated_at
source_updated_at
```

---

# 141. Recherche et cache

Le cache doit être court.

Les requêtes vides ne doivent pas lancer une recherche globale lourde.

---

# 142. Debounce

Valeur initiale recommandée :

```text
250 à 350 ms
```

---

# 143. Nombre minimal de caractères

Direction :

```text
2 caractères
```

Exceptions :

- numéro exact;
- raccourci;
- récent;
- téléphone.

---

# 144. Annulation de requête

Les anciennes recherches doivent être annulées lorsque la requête change.

---

# 145. États de chargement Search

Afficher :

```text
Recherche…
```

Puis :

- résultats;
- aucun résultat;
- erreur;
- récents.

---

# 146. Aucun résultat

Texte :

```text
Aucun résultat pour « Tremblai ».

Vérifiez l’orthographe ou essayez un numéro, une adresse ou un téléphone.
```

---

# 147. Erreur Search

```text
Impossible d’effectuer la recherche.
[Réessayer]
```

---

# 148. Résultat inaccessible

Ne pas afficher l’existence d’une entité interdite.

---

# 149. Desktop Search

La Command Palette peut être centrée.

Elle doit être :

- rapide;
- accessible;
- navigable au clavier;
- fermable avec Échap;
- stable.

---

# 150. Navigation clavier Search

```text
Flèche haut
Flèche bas
Entrée
Échap
Tab
```

---

# 151. Mobile Search

Le clavier doit s’ouvrir automatiquement.

Le champ reste visible.

Les résultats défilent.

---

# 152. Notifications Desktop

Utiliser :

- cloche;
- badge;
- panneau;
- route complète.

---

# 153. Notifications Mobile

Utiliser :

- icône header;
- badge;
- écran complet;
- cartes compactes.

---

# 154. Activity Desktop

Vue dense :

```text
Date
Acteur
Action
Entité
Source
```

---

# 155. Activity Mobile

Cartes timeline :

- icône;
- titre;
- date;
- acteur;
- entité;
- action.

---

# 156. Timeline Desktop

Utiliser une colonne principale avec filtres.

Éviter une carte par événement si le volume est important.

---

# 157. Timeline Mobile

Utiliser :

- ligne verticale légère;
- cartes compactes;
- dates groupées.

---

# 158. Affichage du temps

Utiliser :

```text
il y a 18 s
il y a 4 min
Aujourd’hui à 19 h 14
5 août 2026
```

Le détail peut afficher le timestamp exact.

---

# 159. Timezone

Tous les temps d’affichage utilisent le fuseau de l’organisation.

Les événements conservent UTC.

---

# 160. Fraîcheur

L’activité et les notifications doivent indiquer leur fraîcheur.

Realtime améliore l’instantanéité.

Le refetch demeure nécessaire.

---

# 161. Realtime Notifications

Le système peut écouter :

- nouvelles notifications;
- marqueurs lus;
- AttentionItems;
- Problems;
- Mission events.

---

# 162. Realtime Activity

Pour le Dashboard, l’arrivée d’un événement peut invalider la projection d’activité.

---

# 163. Polling de secours

Si Realtime est indisponible :

- polling;
- indicateur discret;
- mise à jour au retour de visibilité.

---

# 164. Jobs planifiés

Des jobs peuvent créer :

- Factures en retard;
- rappels Lead;
- expirations de Soumissions;
- alertes de maintenance;
- notifications;
- AttentionItems.

---

# 165. Idempotence des jobs

Un job ne doit pas créer plusieurs notifications identiques.

Utiliser :

- sourceEventId;
- date logique;
- clé de déduplication.

---

# 166. NotificationTemplate

Structure conceptuelle :

```ts
type NotificationTemplate = {
  type: NotificationType
  locale: 'fr-CA' | 'en-CA'
  titleTemplate: string
  messageTemplate?: string
  defaultPriority: NotificationPriority
}
```

---

# 167. Localisation

Les notifications doivent respecter la langue du User.

Les événements internes utilisent des clés stables.

---

# 168. Historique bilingue

Stocker :

- eventType;
- données structurées.

Générer le libellé à l’affichage.

Éviter de stocker seulement une phrase française définitive.

---

# 169. Microcopy

Les messages doivent être :

- courts;
- précis;
- actionnables;
- non techniques.

Exemple :

```text
MIS-2026-0009 est hors ligne depuis 6 minutes.
```

---

# 170. Messages techniques

Les détails techniques doivent être accessibles dans une vue diagnostic, pas dans la notification principale.

---

# 171. Observabilité

Mesurer :

- latence Search;
- taux de zéro résultat;
- clic sur résultats;
- type recherché;
- notifications ouvertes;
- notifications ignorées;
- AttentionItems résolus;
- erreurs d’index;
- jobs en échec;
- événements non projetés;
- délais Realtime.

---

# 172. Analytics respectueuses

Ne pas journaliser :

- requêtes complètes sensibles;
- téléphone complet;
- courriel complet;
- adresse complète;
- contenu de note;
- données financières sensibles.

Des catégories ou hash peuvent être utilisés si nécessaire.

---

# 173. Tests unitaires Search

Tester :

- normalisation;
- téléphone;
- courriel;
- numéro;
- accents;
- score;
- tri;
- permissions;
- modules;
- résultats exacts;
- résultats flous.

---

# 174. Tests unitaires Notifications

Tester :

- création;
- destinataires;
- déduplication;
- priorité;
- lecture;
- expiration;
- regroupement;
- préférences.

---

# 175. Tests unitaires Events

Tester :

- payload;
- source;
- acteur;
- occurredAt;
- receivedAt;
- timeline;
- audit;
- correction.

---

# 176. Tests unitaires Attention

Tester :

- calcul;
- déduplication;
- résolution;
- snooze;
- criticité;
- disparition automatique.

---

# 177. Tests d’intégration Search

Tester :

- RPC;
- index;
- RLS;
- permissions;
- pagination;
- recherche multi-entités;
- archive;
- organisation.

---

# 178. Tests d’intégration Notifications

Tester :

- événements;
- préférences;
- Realtime;
- badge;
- lecture;
- deep link;
- permissions.

---

# 179. Tests d’intégration History

Tester :

- timeline Client;
- timeline Contract;
- timeline Mission;
- timeline Invoice;
- audit;
- notes;
- documents;
- sync.

---

# 180. Tests E2E — recherche par adresse

```text
Saisir une adresse
  ↓
Voir Client, Contract et Mission
  ↓
Ouvrir Mission
  ↓
Retour à la recherche
```

---

# 181. Tests E2E — numéro exact

```text
Saisir FAC-000081
  ↓
Facture en premier résultat
  ↓
Ouvrir
```

---

# 182. Tests E2E — permissions

```text
Operator recherche téléphone Client
  ↓
Aucun résultat commercial interdit
```

---

# 183. Tests E2E — notification Problem

```text
Operator signale un Problem
  ↓
Dispatcher reçoit notification
  ↓
Ouvre Mission
  ↓
Résout
  ↓
AttentionItem disparaît
```

---

# 184. Tests E2E — rappel Lead

```text
Rappel arrivé
  ↓
Notification
  ↓
Dashboard Sales
  ↓
Lead ouvert
  ↓
Rappel complété
```

---

# 185. Tests E2E — historique Payment

```text
Payment enregistré
  ↓
Timeline Invoice
  ↓
Annulation Payment
  ↓
Nouvel événement
  ↓
Ancien événement conservé
```

---

# 186. Tests E2E — module désactivé

```text
Module Payments désactivé
  ↓
Aucune commande Payment
  ↓
Aucun résultat Payment
  ↓
Route directe bloquée
```

---

# 187. Tests responsive

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

# 188. Fixtures

Prévoir :

```text
Recherche exacte
Recherche floue
Adresse multiple
Téléphone partagé
Aucun résultat
Permission limitée
Notification critique
Notification lue
AttentionItem ouvert
AttentionItem résolu
Timeline longue
Audit financier
Conflit sync
Événement legacy
```

---

# 189. Master UI

Le module doit produire :

## Recherche globale

- Desktop Command Palette;
- Mobile plein écran;
- résultats groupés;
- états.

## Centre des notifications

- Desktop panneau;
- route complète;
- Mobile.

## Historique

- timeline fiche;
- activité globale;
- audit dense.

---

# 190. Performance cible

Objectifs initiaux :

```text
Résultat exact < 500 ms
Recherche générale < 1 s dans la majorité des cas
Badge Notifications quasi immédiat
Timeline paginée
Aucun chargement global inutile
```

Les objectifs doivent être mesurés sur les données réelles.

---

# 191. Migration depuis l’ancienne RECA App

Avant migration :

1. inventorier les mécanismes de recherche existants;
2. inventorier les colonnes normalisées;
3. inventorier les événements;
4. inventorier les historiques;
5. inventorier les notes;
6. inventorier les notifications;
7. inventorier les modules;
8. inventorier les RLS;
9. inventorier les doublons;
10. inventorier les événements techniques;
11. inventorier les données orphelines.

---

# 192. Mappings legacy events

Créer un registre :

```text
Ancien eventType
Nouveau eventType
Transformation
Confiance
```

---

# 193. Événements legacy non structurés

Lorsqu’un ancien événement contient seulement un texte :

- conserver le texte;
- marquer `source = LEGACY_RECA_APP`;
- ne pas inventer un payload structuré;
- afficher une timeline compatible.

---

# 194. Backfill Search

Le backfill doit :

- indexer les entités;
- normaliser;
- respecter l’organisation;
- exclure les données supprimées;
- produire un rapport;
- être relançable.

---

# 195. Backfill Notifications

Les anciennes notifications ne doivent pas nécessairement être migrées si elles ne possèdent pas de valeur durable.

Les événements et AttentionItems importants doivent être conservés.

---

# 196. Compatibilité progressive

Pendant la transition :

- ancienne recherche peut continuer;
- V2 utilise sa RPC;
- index additif;
- événements centralisés progressivement;
- aucun changement destructif;
- feature flags temporaires.

---

# 197. Feature flags

Exemples :

```text
global_search_v2
command_palette_v2
notifications_center_v2
entity_timelines_v2
audit_log_v2
```

---

# 198. Hors périmètre initial

Ne pas bloquer la V1 avec :

- recherche IA générative;
- recherche sémantique vectorielle;
- OCR de tous les documents;
- SMS;
- push complet;
- règles complexes d’escalade;
- workflow BPM;
- collaboration temps réel;
- commentaires avec mentions;
- centre de messages;
- recherche externe;
- indexation de courriels;
- archivage légal complet.

---

# 199. Décisions à confirmer

Avant l’implémentation finale, confirmer :

- stratégie Search;
- `pg_trgm`;
- `tsvector`;
- table consolidée;
- indexation documents;
- nombre minimal de caractères;
- recherche floue;
- raccourcis;
- récents;
- épinglés;
- canaux Notifications;
- rétention;
- regroupement;
- destinataires;
- préférences;
- niveaux de priorité;
- visibilité Activity;
- accès Audit;
- payload d’événements;
- historique bilingue;
- snooze;
- seuils d’escalade.

Toutes les décisions confirmées doivent être ajoutées à `memory.md`.

---

# 200. Règles non négociables

Ne jamais retourner un résultat interdit puis le masquer côté client.

Ne jamais exposer l’existence d’une entité non autorisée.

Ne jamais confondre Notification, AttentionItem et Event.

Ne jamais supprimer silencieusement un événement d’audit.

Ne jamais utiliser un toast comme seule trace d’un incident critique.

Ne jamais créer plusieurs notifications identiques pour le même événement.

Ne jamais indexer des secrets.

Ne jamais stocker uniquement un texte traduit pour un événement structuré.

Ne jamais afficher les logs techniques dans la timeline utilisateur normale.

Ne jamais permettre à un Operator de rechercher les données financières.

Ne jamais modifier un événement historique sans événement de correction.

Ne jamais présenter une notification expirée comme une action encore requise.

---

# 201. Diagramme principal

```text
Entités métier
  ↓
Search Index
  ↓
Recherche globale
  ↓
Résultats sécurisés

Entités métier
  ↓
Domain Events
  ├── Activity
  ├── Entity Timelines
  ├── Notifications
  ├── AttentionItems
  └── Audit
```

---

# 202. Flux Search officiel

```text
Requête utilisateur
      ↓
Normalisation
      ↓
Permissions et modules
      ↓
Recherche indexée
      ↓
Score
      ↓
Groupement
      ↓
Résultats
      ↓
Navigation
```

---

# 203. Flux Notification officiel

```text
DomainEvent
      ↓
Règle de notification
      ↓
Destinataires
      ↓
Préférences
      ↓
Déduplication
      ↓
Notification
      ↓
Badge / panneau / deep link
```

---

# 204. Flux Historique officiel

```text
Action métier
      ↓
Transaction
      ↓
DomainEvent
      ↓
Projection Timeline
      ↓
Fiche entité
      ↓
Activité globale
      ↓
Audit si sensible
```

---

# 205. Résumé officiel

La recherche globale permet de retrouver une entité, une adresse, un numéro ou une situation sans connaître le module exact.

Les résultats sont filtrés côté serveur selon les permissions.

La Command Palette combine navigation, recherche et actions.

Les notifications informent un utilisateur d’un événement important.

Les AttentionItems représentent les situations encore non résolues.

Les DomainEvents alimentent les timelines et l’activité.

Les AuditEvents conservent les actions sensibles.

Les événements techniques restent dans les journaux de diagnostic.

Les historiques sont append-only.

Les notifications sont dédupliquées et configurables.

Les événements sont structurés, versionnables et bilingues à l’affichage.

L’objectif est de rendre RECA App V2 rapide à naviguer, simple à superviser et entièrement traçable.
