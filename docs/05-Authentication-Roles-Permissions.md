# 05-Authentication-Roles-Permissions.md

# RECA
## Authentification, rôles et permissions

Version : 1.0  
Projet : RECA App V2  
Dépôt recommandé : `reca-app-v2`  
Statut : Architecture officielle de sécurité applicative  

---

# 1. Objectif du document

Ce document définit l’architecture officielle de :

- l’authentification;
- la session;
- les utilisateurs;
- les employés;
- les opérateurs;
- les rôles;
- les permissions;
- les restrictions par organisation;
- les protections de routes;
- les protections de services;
- les politiques Supabase RLS;
- les invitations;
- la désactivation des comptes;
- l’audit de sécurité;
- l’intégration avec RECA Opérateur.

Il établit les règles que RECA App V2 doit respecter avant de construire les modules métier.

Ce document complète :

```text
00-Vision.md
03-Application-Architecture.md
04-Data-Architecture.md
```

---

# 2. Principe fondamental

La sécurité ne doit jamais dépendre d’un seul niveau.

Une action sensible doit être protégée à plusieurs endroits :

```text
Interface
   ↓
Route
   ↓
Cas d’utilisation
   ↓
Repository / RPC
   ↓
Supabase RLS
   ↓
Audit
```

Masquer un bouton n’est pas une sécurité.

Bloquer une route côté React n’est pas une sécurité.

La base de données doit toujours demeurer la dernière autorité.

---

# 3. Objectifs de sécurité

Le système doit garantir que :

- chaque utilisateur est authentifié;
- chaque utilisateur appartient à une organisation autorisée;
- chaque utilisateur possède seulement les permissions nécessaires;
- les opérateurs ne voient que les missions qui leur sont assignées;
- les données financières sont protégées;
- les paramètres sensibles sont réservés aux personnes autorisées;
- les actions critiques sont auditées;
- les comptes désactivés perdent immédiatement leur accès;
- les anciens projets ne contournent pas les nouvelles protections;
- les accès Supabase sont contrôlés par RLS;
- aucune clé `service_role` n’est exposée au navigateur;
- les permissions demeurent compréhensibles et maintenables.

---

# 4. Concepts distincts

Les concepts suivants ne doivent pas être fusionnés sans justification.

```text
Auth User
User
Employee
Operator
Role
Permission
Organization Membership
Device
Session
```

---

# 5. Auth User

`auth.users` représente l’identité technique Supabase Auth.

Il contient notamment :

- identifiant Auth;
- courriel;
- état de confirmation;
- métadonnées Auth;
- dernière connexion;
- mécanismes d’authentification.

Il ne doit pas devenir la table principale du métier.

---

# 6. User

`users` représente le profil applicatif.

Structure conceptuelle :

```ts
type User = {
  id: UserId
  authUserId: string
  organizationId: OrganizationId
  displayName: string
  email: string
  status: UserStatus
  theme: ThemePreference
  locale: 'fr-CA' | 'en-CA'
  createdAt: string
  updatedAt: string
}
```

Le User appartient au système applicatif.

Il peut être relié à un Employee.

---

# 7. Employee

`employees` représente une personne employée ou associée à Groupe RECA.

Structure conceptuelle :

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

Un Employee peut exister sans compte utilisateur.

Exemples :

- nouvel employé non activé;
- employé saisonnier;
- fiche administrative;
- opérateur sans accès encore créé.

---

# 8. Operator

L’opérateur est une capacité opérationnelle.

La direction recommandée est :

```text
Operator = Employee autorisé à utiliser RECA Opérateur
```

Il n’est pas nécessaire de créer une table `operators` immédiatement si :

- les données sont déjà dans `employees`;
- le rôle et les permissions suffisent;
- les affectations utilisent `employee_id`.

Un champ ou une projection peut indiquer :

```text
can_operate = true
```

Une table spécialisée pourra être ajoutée si des données propres à l’opérateur deviennent nécessaires.

---

# 9. Organization Membership

Même si la V1 utilise une seule organisation, le modèle doit distinguer l’appartenance.

Structure conceptuelle :

```ts
type OrganizationMembership = {
  id: string
  organizationId: OrganizationId
  userId: UserId
  status: MembershipStatus
  createdAt: string
}
```

Une première version peut conserver directement :

```text
users.organization_id
```

La table Membership devient utile si :

- un utilisateur peut accéder à plusieurs organisations;
- plusieurs rôles varient par organisation;
- des invitations multi-organisations sont nécessaires.

---

# 10. Role

Un rôle regroupe des permissions.

Exemples officiels recommandés :

```text
ADMINISTRATOR
MANAGER
DISPATCHER
SALES_REPRESENTATIVE
ACCOUNTING
OPERATOR
VIEWER
```

Tous ces rôles ne doivent pas nécessairement être activés dans la première version.

---

# 11. Permission

Une permission décrit une capacité précise.

Convention recommandée :

```text
resource.action
```

Exemples :

```text
client.read
client.create
client.update
client.archive

contract.read
contract.create
contract.update
contract.activate
contract.cancel

route.read
route.create
route.update
route.reorder
route.archive

mission.read
mission.create
mission.assign
mission.start
mission.pause
mission.complete
mission.cancel
mission.supervise

invoice.read
invoice.create
invoice.issue
invoice.cancel

payment.read
payment.record
payment.cancel

settings.read
settings.manage
users.manage
roles.manage
```

---

# 12. Pourquoi utiliser des permissions

Les rôles seuls deviennent rapidement insuffisants.

Exemple :

```text
Un gestionnaire peut superviser les missions,
mais ne doit pas nécessairement gérer les comptes utilisateurs.
```

Avec des permissions :

```text
MANAGER
  ├── mission.supervise
  ├── route.read
  ├── employee.read
  └── report.read
```

sans :

```text
users.manage
```

---

# 13. Rôle Administrator

Responsabilité générale :

- contrôle complet;
- paramètres;
- utilisateurs;
- rôles;
- intégrations;
- migrations fonctionnelles;
- accès à tous les modules.

Permissions typiques :

```text
*.read
*.create
*.update
*.archive
*.manage
```

Actions particulièrement sensibles :

- modifier les rôles;
- désactiver un compte;
- gérer les paramètres;
- annuler un paiement;
- consulter les journaux de sécurité;
- configurer les intégrations.

---

# 14. Rôle Manager

Responsabilité :

- supervision;
- performance;
- gestion opérationnelle;
- consultation commerciale et financière selon le besoin.

Permissions typiques :

```text
dashboard.read
mission.read
mission.supervise
route.read
employee.read
equipment.read
client.read
contract.read
invoice.read
report.read
```

Permissions optionnelles :

```text
mission.assign
mission.cancel
route.update
```

---

# 15. Rôle Dispatcher

Responsabilité :

- planification;
- routes;
- missions;
- assignations;
- suivi;
- problèmes.

Permissions typiques :

```text
dashboard.read
route.read
route.create
route.update
route.reorder
mission.read
mission.create
mission.assign
mission.start
mission.pause
mission.complete
mission.cancel
mission.supervise
employee.read
equipment.read
problem.read
problem.resolve
contract.read
```

Le Dispatcher ne doit pas automatiquement posséder :

```text
payment.record
users.manage
settings.manage
```

---

# 16. Rôle Sales Representative

Responsabilité :

- Leads;
- Soumissions;
- Clients;
- Contrats;
- suivi commercial.

Permissions typiques :

```text
lead.read
lead.create
lead.update
lead.archive

quote.read
quote.create
quote.update
quote.send
quote.convert

client.read
client.create
client.update

contract.read
contract.create
contract.update
```

Permissions sensibles à valider :

```text
contract.activate
contract.cancel
invoice.read
```

---

# 17. Rôle Accounting

Responsabilité :

- Factures;
- Paiements;
- soldes;
- retards;
- rapports financiers.

Permissions typiques :

```text
client.read
contract.read
invoice.read
invoice.create
invoice.issue
invoice.cancel
payment.read
payment.record
payment.cancel
financial_report.read
```

Le rôle Accounting ne doit pas automatiquement modifier :

- Routes;
- Missions;
- Équipements;
- Paramètres utilisateurs.

---

# 18. Rôle Operator

Responsabilité :

- exécuter une Mission assignée dans RECA Opérateur.

Permissions typiques :

```text
assigned_mission.read
assigned_mission.start
assigned_mission.pause
assigned_mission.resume
assigned_mission.complete

assigned_mission_item.read
assigned_mission_item.update_status

assigned_problem.create
assigned_problem.update

assigned_sync.create
```

Il ne doit pas posséder :

```text
mission.create
mission.assign
route.update
client.list_all
contract.update
invoice.read
settings.manage
```

---

# 19. Rôle Viewer

Responsabilité :

- consultation limitée;
- audit;
- direction;
- démonstration;
- soutien.

Permissions typiques :

```text
dashboard.read
client.read
contract.read
route.read
mission.read
invoice.read
```

Aucune mutation.

---

# 20. Rôles multiples

L’architecture doit permettre à terme plusieurs rôles par utilisateur.

Exemple :

```text
MANAGER
+ ACCOUNTING
```

Les permissions effectives sont l’union des permissions accordées.

Une permission refusée explicitement peut nécessiter un modèle plus avancé.

La V1 peut utiliser une union simple.

---

# 21. Modèle recommandé

Tables conceptuelles :

```text
users
roles
permissions
user_roles
role_permissions
```

Relations :

```text
User
  └── UserRoles
        └── Role
              └── RolePermissions
                    └── Permission
```

---

# 22. Modèle simplifié temporaire

Une première version peut utiliser :

```text
users.role
```

seulement si :

- les valeurs sont limitées;
- les permissions sont centralisées dans le code;
- la migration future est prévue;
- aucun module ne multiplie les comparaisons directes.

La direction officielle demeure un modèle de permissions.

---

# 23. AppSession

La session applicative doit exposer une projection stable.

```ts
type AppSession = {
  authUserId: string
  userId: UserId
  organizationId: OrganizationId
  displayName: string
  email: string
  status: UserStatus
  roles: RoleKey[]
  permissions: PermissionKey[]
  employeeId?: EmployeeId
  canOperate: boolean
  theme: ThemePreference
}
```

---

# 24. Résolution de session

Flux recommandé :

```text
Supabase Auth session
      ↓
Lire users
      ↓
Valider status
      ↓
Lire organization
      ↓
Lire roles
      ↓
Résoudre permissions
      ↓
Lire employee lié
      ↓
Construire AppSession
```

Une session Auth valide ne suffit pas si :

- le User applicatif est absent;
- le compte est désactivé;
- l’organisation est désactivée;
- l’appartenance est suspendue.

---

# 25. États User

Exemple :

```text
INVITED
ACTIVE
SUSPENDED
DISABLED
ARCHIVED
```

---

# 26. Effet des états User

## INVITED

- invitation envoyée;
- accès incomplet;
- mot de passe non établi;
- aucune action métier autorisée.

## ACTIVE

- accès permis selon les permissions.

## SUSPENDED

- accès temporairement bloqué;
- données conservées.

## DISABLED

- accès refusé;
- sessions révoquées lorsque possible.

## ARCHIVED

- compte historique;
- aucun accès;
- acteur conservé dans l’audit.

---

# 27. États Employee

Exemple :

```text
ACTIVE
INACTIVE
SEASONAL
SUSPENDED
ARCHIVED
```

Le statut Employee ne doit pas être confondu automatiquement avec le statut User.

Exemple :

- un employé administratif actif;
- un compte désactivé temporairement;
- un ancien employé conservé pour l’historique.

---

# 28. Authentification initiale

La première version utilise :

```text
Courriel
Mot de passe
```

via Supabase Auth.

Le flux doit supporter :

- connexion;
- déconnexion;
- récupération de mot de passe;
- confirmation de courriel lorsque activée;
- invitation;
- changement de mot de passe;
- expiration de session.

---

# 29. Page de connexion

La page doit :

- utiliser le logo officiel;
- expliquer clairement le produit;
- être accessible;
- éviter d’indiquer si un compte précis existe;
- afficher les erreurs sans détails techniques;
- protéger contre les soumissions multiples;
- offrir la récupération de mot de passe.

---

# 30. Messages d’erreur de connexion

Messages recommandés :

```text
Courriel ou mot de passe invalide.
```

```text
Votre accès est temporairement suspendu.
```

```text
Votre compte n’est pas encore activé.
```

Ne pas afficher :

- stack trace;
- réponse Supabase brute;
- présence exacte d’un courriel;
- détails de politique RLS.

---

# 31. Invitation

Flux recommandé :

```text
Administrateur crée une invitation
      ↓
User applicatif = INVITED
      ↓
Rôles sélectionnés
      ↓
Courriel Supabase envoyé
      ↓
Utilisateur définit son mot de passe
      ↓
Session vérifiée
      ↓
User = ACTIVE
```

---

# 32. Invitation Employee existant

Lorsqu’un Employee existe déjà :

```text
Employee
  ↓
Créer User
  ↓
Lier employee.user_id
  ↓
Assigner rôles
```

Éviter de créer un deuxième Employee.

---

# 33. Invitation sans Employee

Permise pour :

- comptabilité externe;
- gestionnaire;
- consultant;
- support;
- auditeur.

La décision dépend du rôle.

---

# 34. Récupération de mot de passe

Le flux doit :

- utiliser Supabase Auth;
- envoyer un lien temporaire;
- rediriger vers une route sécurisée;
- valider la session de récupération;
- demander un nouveau mot de passe;
- confirmer le succès;
- invalider les anciens jetons selon les capacités Supabase.

---

# 35. Changement de mot de passe

Un utilisateur connecté doit pouvoir changer son mot de passe.

Actions recommandées :

- saisir nouveau mot de passe;
- confirmer;
- réauthentification si nécessaire;
- journaliser l’événement sans journaliser le mot de passe.

---

# 36. Mot de passe

Règles initiales recommandées :

- longueur minimale de 12 caractères;
- mot de passe compromis refusé lorsque possible;
- aucun mot de passe partagé;
- gestionnaire de mots de passe encouragé;
- aucune règle artificielle excessive si elle réduit la sécurité réelle.

---

# 37. MFA

L’authentification multifacteur est recommandée pour :

- Administrators;
- gestion des finances;
- gestion des utilisateurs;
- accès à la production.

La première version peut la rendre :

- optionnelle pour tous;
- obligatoire pour Administrators;
- obligatoire progressivement.

La décision finale doit être confirmée avant production.

---

# 38. Session persistante

La session peut être persistée selon le comportement Supabase.

L’application doit gérer :

- refresh token;
- expiration;
- reconnexion;
- fermeture de session;
- compte désactivé pendant une session active;
- changement de rôle.

---

# 39. Revalidation de session

La session applicative doit être relue :

- au démarrage;
- après refresh Auth;
- après changement de rôle;
- après changement de statut;
- après changement d’organisation;
- lors d’une erreur d’autorisation importante.

Le cache ne doit pas maintenir des permissions retirées indéfiniment.

---

# 40. Déconnexion

La déconnexion doit :

- appeler Supabase Auth sign out;
- effacer la session locale;
- vider les caches sensibles;
- retirer les abonnements Realtime;
- fermer les données d’organisation;
- rediriger vers la connexion.

---

# 41. Déconnexion forcée

Un Administrator doit pouvoir désactiver un compte.

Le système doit ensuite :

- refuser les nouvelles requêtes;
- refuser les nouveaux tokens selon les capacités;
- forcer une revalidation;
- couper l’accès lors du prochain appel;
- idéalement révoquer les sessions.

---

# 42. Protection des routes

Composants conceptuels :

```text
RequireAuth
RequirePermission
RequireModule
RequireOrganization
RequireFeatureFlag
```

---

# 43. RequireAuth

Responsabilités :

- vérifier la session;
- attendre le chargement;
- rediriger si absent;
- gérer un compte désactivé;
- conserver la destination initiale lorsque pertinent.

---

# 44. RequirePermission

Exemple :

```tsx
<RequirePermission permission="mission.create">
  <MissionCreatePage />
</RequirePermission>
```

Il doit afficher une page `403` ou rediriger selon le contexte.

Il ne doit pas seulement masquer silencieusement une page.

---

# 45. RequireModule

La désactivation d’un module doit :

- cacher son lien;
- bloquer son URL directe;
- empêcher ses actions;
- refuser ses services;
- être reflétée dans les permissions effectives.

Le comportement historique de l’ancienne application, où un module désactivé est caché et bloqué par route, doit être conservé comme principe.

---

# 46. RequireOrganization

Toute route métier doit être associée à une organisation active.

Une session sans organisation valide doit afficher un état de configuration ou bloquer l’accès.

---

# 47. Navigation

La navigation doit être dérivée des permissions.

Exemple :

```ts
const visibleItems = navItems.filter(item =>
  hasPermission(session, item.requiredPermission)
)
```

Ne pas dupliquer une liste de rôles directement dans chaque item.

---

# 48. Boutons et actions

Une action doit vérifier :

```text
Permission
+ état de l’entité
+ module actif
+ organisation
```

Exemple :

```text
Afficher "Créer une mission" seulement si
mission.create est accordée
et Routes est actif
et la Route est valide.
```

---

# 49. Permissions contextuelles

Certaines permissions dépendent du contexte.

Exemples :

```text
Operator peut modifier Mission
seulement si Mission.operator_id = son EmployeeId.
```

```text
Sales Representative peut modifier
les Leads qui lui sont assignés,
si cette règle est activée.
```

Ces règles ne doivent pas être exprimées seulement par une permission globale.

---

# 50. Scopes

Une permission peut posséder un scope.

Exemples conceptuels :

```text
ALL
ASSIGNED
OWN
ORGANIZATION
READ_ONLY
```

Exemple :

```ts
type GrantedPermission = {
  key: 'mission.update'
  scope: 'ASSIGNED'
}
```

La V1 peut gérer les scopes dans les politiques RLS et les cas d’utilisation sans modèle générique complet.

---

# 51. Matrice de permissions initiale

Légende :

```text
R = Lecture
C = Création
U = Modification
A = Archivage/Annulation
M = Gestion complète
S = Assigné seulement
```

| Module | Admin | Manager | Dispatcher | Sales | Accounting | Operator | Viewer |
|---|---|---|---|---|---|---|---|
| Dashboard | M | R | R | R | R | S | R |
| Leads | M | R | R | M | — | — | R |
| Soumissions | M | R | R | M | R | — | R |
| Clients | M | R | R | C/U | R | S limité | R |
| Contrats | M | R | R | C/U | R | S limité | R |
| Routes | M | R/U | M | R | — | S lecture | R |
| Missions | M | M | M | R | — | S | R |
| Problèmes | M | M | M | R | — | S création | R |
| Employés | M | R | R | — | — | propre profil | R |
| Équipements | M | R/U | M | — | — | assigné | R |
| Factures | M | R | R | R limité | M | — | R |
| Paiements | M | R | — | — | M | — | R |
| Paramètres | M | R limité | — | — | — | — | — |
| Utilisateurs | M | — | — | — | — | — | — |

Cette matrice est une base de travail.

Les permissions finales doivent être validées par Groupe RECA avant production.

---

# 52. Permission Helper

Fonctions partagées recommandées :

```ts
function hasPermission(
  session: AppSession,
  permission: PermissionKey,
): boolean
```

```ts
function hasAnyPermission(
  session: AppSession,
  permissions: PermissionKey[],
): boolean
```

```ts
function canAccessAssignedMission(
  session: AppSession,
  mission: MissionAccessProjection,
): boolean
```

---

# 53. Interdiction des comparaisons dispersées

Éviter :

```ts
if (user.role === 'administrateur') {
  // ...
}
```

Préférer :

```ts
if (hasPermission(session, 'settings.manage')) {
  // ...
}
```

Une comparaison de rôle peut demeurer acceptable dans la résolution centrale des permissions.

---

# 54. Cas d’utilisation

Chaque cas d’utilisation sensible doit vérifier la permission.

Exemple :

```ts
async function createMission(
  actor: AppActor,
  input: CreateMissionInput,
) {
  authorize(actor, 'mission.create')
  // ...
}
```

Même si la route est déjà protégée.

---

# 55. Actor

Structure conceptuelle :

```ts
type AppActor = {
  userId: UserId
  authUserId: string
  organizationId: OrganizationId
  employeeId?: EmployeeId
  permissions: PermissionKey[]
  roles: RoleKey[]
}
```

Les cas d’utilisation reçoivent l’Actor résolu.

---

# 56. Service Role

La clé Supabase `service_role` :

- ne doit jamais être présente dans le frontend;
- ne doit jamais être écrite dans `VITE_*`;
- ne doit jamais être journalisée;
- ne doit jamais être committée;
- doit être utilisée seulement côté serveur sécurisé.

---

# 57. Clé anon

La clé `anon` peut être utilisée côté navigateur avec RLS activé.

Elle n’accorde pas automatiquement l’accès.

L’autorisation provient :

- de la session Auth;
- des politiques RLS;
- des fonctions autorisées.

---

# 58. RLS obligatoire

Toutes les tables métier exposées doivent activer RLS.

Exemples :

```text
users
employees
clients
contracts
routes
missions
mission_items
invoices
payments
documents
events
```

---

# 59. RLS par organisation

Politique conceptuelle :

```sql
organization_id = current_user_organization_id()
```

La fonction doit être sécurisée et stable.

Elle doit éviter de faire confiance à un `organization_id` fourni par le navigateur.

---

# 60. Fonctions de contexte RLS

Fonctions possibles :

```text
current_app_user_id()
current_organization_id()
current_employee_id()
current_user_permissions()
has_permission(permission_key)
```

Elles doivent être :

- sécurisées;
- optimisées;
- auditées;
- limitées;
- documentées.

---

# 61. RLS Users

Un utilisateur peut lire :

- son propre profil;
- les profils autorisés selon sa permission;
- les utilisateurs de son organisation.

Un utilisateur ordinaire ne peut pas :

- modifier son rôle;
- changer son organisation;
- s’activer lui-même;
- modifier un autre compte.

---

# 62. RLS Roles

Seuls les utilisateurs avec :

```text
roles.manage
```

peuvent modifier les rôles et permissions.

Les opérateurs ne doivent jamais écrire dans ces tables.

---

# 63. RLS Clients

Exemple :

```text
client.read
+ même organization_id
```

Écriture :

```text
client.create ou client.update
+ même organization_id
```

L’accès d’un opérateur à un Client complet n’est pas nécessaire.

Il doit recevoir seulement les données utiles dans MissionItem.

---

# 64. RLS Contracts

Un opérateur ne doit pas lire tous les Contrats.

Il peut accéder aux snapshots nécessaires via MissionItems assignés.

Cette règle réduit l’exposition des données commerciales.

---

# 65. RLS Routes

Lecture :

- Admin;
- Manager;
- Dispatcher;
- autres rôles autorisés.

Écriture :

- Admin;
- Dispatcher;
- Manager selon permission.

Operator :

- aucune écriture;
- lecture minimale seulement si requise par RECA Opérateur;
- idéalement via Mission plutôt que Route complète.

---

# 66. RLS Missions

Un utilisateur avec permission générale peut lire les Missions de son organisation.

Un Operator peut lire seulement :

```text
missions.operator_id = current_employee_id()
```

ou une relation d’affectation équivalente.

---

# 67. RLS MissionItems

Un Operator peut lire et mettre à jour seulement les MissionItems de sa Mission assignée.

Condition conceptuelle :

```text
mission_items.mission_id
appartient à une Mission dont
operator_id = current_employee_id()
```

---

# 68. Écriture Operator Mission

L’opérateur peut modifier seulement les champs opérationnels autorisés.

Exemples :

- statut;
- temps;
- problème;
- notes terrain;
- progression;
- données de synchronisation.

Il ne peut pas modifier :

- client;
- contrat;
- prix;
- ordre administratif;
- opérateur assigné;
- équipement assigné;
- organisation.

Lorsque possible, les écritures doivent passer par des RPC spécialisées plutôt que par un `UPDATE` large.

---

# 69. RPC opérateur

Exemples :

```text
operator_start_mission
operator_apply_transition
operator_report_problem
operator_complete_mission
operator_sync_batch
```

Avantages :

- validation;
- idempotence;
- champs contrôlés;
- audit;
- transactions;
- erreurs métier.

---

# 70. RLS Factures

Lecture :

- Admin;
- Accounting;
- Manager;
- rôles explicitement autorisés.

Écriture :

- Admin;
- Accounting;
- services transactionnels.

Sales peut avoir une lecture limitée selon décision.

Operator n’a aucun accès.

---

# 71. RLS Paiements

L’écriture directe générale doit être évitée.

L’enregistrement et l’annulation doivent passer par :

```text
record_payment
cancel_payment
```

ou une fonction équivalente.

---

# 72. RLS Documents

L’accès dépend :

- de l’entité;
- du type de document;
- du rôle;
- de l’organisation.

Exemples :

- contrat signé;
- photo terrain;
- facture PDF;
- document employé.

Tous les documents ne doivent pas utiliser la même politique permissive.

---

# 73. Storage Policies

Les buckets sensibles doivent être privés.

Les politiques doivent valider :

- organisation;
- entité;
- permission;
- chemin;
- propriétaire;
- type de fichier.

---

# 74. Convention de chemins Storage

Exemple :

```text
organizations/{organizationId}/
  contracts/{contractId}/
    documents/{documentId}.pdf
```

```text
organizations/{organizationId}/
  missions/{missionId}/
    items/{missionItemId}/
      problems/{problemId}/{fileId}.jpg
```

Le navigateur ne doit pas pouvoir écrire dans le dossier d’une autre organisation.

---

# 75. Téléversements

Tout téléversement doit vérifier :

- taille;
- type MIME;
- extension;
- permission;
- organisation;
- entité;
- quota;
- antivirus lorsque disponible;
- métadonnées.

---

# 76. Signed URLs

Une Signed URL doit être générée seulement après autorisation.

Sa durée doit être limitée.

Elle ne doit pas être exposée dans les logs.

---

# 77. Realtime

Un abonnement Realtime doit respecter les mêmes limites que la lecture normale.

L’utilisateur ne doit pas recevoir les changements d’une autre organisation.

L’Operator ne doit pas écouter toutes les Missions.

---

# 78. Audit de sécurité

Événements à journaliser :

```text
LOGIN_SUCCEEDED
LOGIN_FAILED
LOGOUT
PASSWORD_RESET_REQUESTED
PASSWORD_CHANGED
MFA_ENABLED
MFA_DISABLED
USER_INVITED
USER_ACTIVATED
USER_SUSPENDED
USER_DISABLED
ROLE_ASSIGNED
ROLE_REMOVED
PERMISSION_CHANGED
ORGANIZATION_ACCESS_CHANGED
SENSITIVE_EXPORT_CREATED
```

---

# 79. Audit d’action métier sensible

Également journaliser :

- annulation de Mission;
- annulation de Contrat;
- modification de géométrie;
- changement d’assignation;
- annulation de Paiement;
- modification de paramètres;
- génération de document final;
- modification d’une donnée historique.

---

# 80. SecurityEvent

Structure conceptuelle :

```ts
type SecurityEvent = {
  id: string
  organizationId?: OrganizationId
  userId?: UserId
  authUserId?: string
  type: SecurityEventType
  occurredAt: string
  ipAddress?: string
  userAgent?: string
  success: boolean
  reasonCode?: string
  metadata?: Record<string, unknown>
}
```

Les données IP et User-Agent doivent être conservées seulement selon une politique de rétention justifiée.

---

# 81. Logs interdits

Ne jamais journaliser :

- mot de passe;
- refresh token;
- access token;
- service_role;
- clé API;
- code MFA;
- contenu complet de document privé;
- numéro complet de carte;
- secrets d’intégration.

---

# 82. Limitation de tentatives

La connexion et les actions sensibles doivent être protégées contre les abus.

Utiliser selon les capacités :

- rate limiting;
- protections Supabase;
- délai progressif;
- alertes;
- blocage temporaire;
- audit.

---

# 83. Protection CSRF

Les mécanismes Supabase et les tokens doivent être utilisés correctement.

Toute intégration utilisant des cookies serveur devra prévoir une protection CSRF explicite.

---

# 84. Protection XSS

Les contenus utilisateurs doivent être rendus comme texte par défaut.

Ne pas utiliser `dangerouslySetInnerHTML` pour :

- notes;
- messages;
- clauses;
- descriptions;
- commentaires;

sans sanitization stricte.

---

# 85. Redirections Auth

Les URLs de redirection doivent être limitées aux domaines autorisés.

Éviter les redirects dynamiques fournis directement par l’utilisateur.

---

# 86. Secrets

Les secrets doivent vivre dans :

- Supabase Secrets;
- variables serveur;
- gestionnaire de secrets de déploiement.

Ils ne doivent jamais vivre dans :

- repository;
- Markdown;
- logs;
- captures;
- frontend;
- fichier partagé.

---

# 87. Sessions sur appareil partagé

Le produit doit prévoir les risques de :

- tablette partagée;
- téléphone d’opérateur;
- ordinateur de bureau commun.

Mesures :

- déconnexion visible;
- verrouillage automatique optionnel;
- revalidation pour action sensible;
- suppression du cache après logout;
- mode appareil assigné futur.

---

# 88. RECA Opérateur

RECA Opérateur doit :

- authentifier l’utilisateur;
- résoudre son EmployeeId;
- charger seulement sa Mission assignée;
- conserver localement seulement les données nécessaires;
- protéger son cache local;
- synchroniser par opérations autorisées;
- refuser une Mission d’un autre opérateur.

---

# 89. Connexion Operator

Flux recommandé :

```text
Login Supabase
      ↓
Résoudre User
      ↓
Vérifier User actif
      ↓
Résoudre Employee
      ↓
Vérifier can_operate
      ↓
Vérifier permission assigned_mission.read
      ↓
Charger Mission assignée
```

---

# 90. Operator sans Mission

L’authentification peut réussir.

L’application affiche :

```text
Aucune mission assignée
```

Elle ne doit pas rediriger vers des modules administratifs.

---

# 91. Operator réassigné

Lors d’un changement d’opérateur :

- l’ancien opérateur doit perdre l’accès;
- le nouvel opérateur doit recevoir la Mission;
- les données locales anciennes doivent être isolées;
- les opérations non synchronisées doivent être traitées;
- l’audit doit conserver le changement.

---

# 92. Mode hors ligne

Le mode hors ligne ne supprime pas les règles d’autorisation.

RECA Opérateur peut continuer une Mission déjà téléchargée pendant une période contrôlée.

Il ne doit pas télécharger de nouvelles Missions sans session valide.

---

# 93. Grace Period hors ligne

Une période de grâce locale peut être autorisée pour une Mission déjà active.

Elle doit être :

- limitée;
- documentée;
- liée à l’appareil;
- liée à la Mission;
- révoquée lors d’une synchronisation si le compte est désactivé.

---

# 94. Cache local

Les données sensibles locales doivent être :

- minimisées;
- isolées par utilisateur;
- supprimées au logout;
- supprimées après fin de Mission selon la politique;
- chiffrées si la plateforme le permet.

---

# 95. Modules activables

Un module peut être désactivé au niveau organisation.

Exemple :

```text
payments.enabled = false
```

Effets :

- lien caché;
- route bloquée;
- Command Palette filtrée;
- mutations refusées;
- API/RPC vérifiée si nécessaire.

---

# 96. Module contre permission

Un module actif n’accorde aucune permission.

```text
Module actif
+ permission nécessaire
= accès
```

Un module désactivé bloque l’accès même si la permission existe.

---

# 97. Feature Flags

Un Feature Flag n’est pas une permission.

Il contrôle :

- disponibilité progressive;
- nouvelle expérience;
- pilote;
- migration.

Il ne doit pas accorder l’accès à une donnée autrement interdite.

---

# 98. Administrateur initial

Le système doit prévoir un processus contrôlé pour créer le premier Administrator.

Options :

- migration seed sécurisée;
- script serveur;
- création manuelle documentée;
- invitation initiale.

Ne pas exposer une route publique « créer le premier admin » en production.

---

# 99. Compte de secours

Un compte de secours peut être prévu pour les incidents.

Il doit :

- utiliser MFA;
- avoir un mot de passe unique;
- être surveillé;
- ne pas être utilisé quotidiennement;
- être conservé dans un gestionnaire de secrets;
- produire une alerte lors de son utilisation.

---

# 100. Gestion des comptes

Le module Paramètres doit permettre selon permission :

- inviter;
- modifier le nom;
- assigner des rôles;
- lier un Employee;
- suspendre;
- réactiver;
- désactiver;
- consulter le dernier accès;
- révoquer les sessions lorsque possible.

---

# 101. Actions interdites sur soi-même

Un Administrator ne devrait pas pouvoir facilement :

- retirer son dernier rôle Administrator;
- désactiver son propre compte;
- supprimer le dernier compte Administrator;
- retirer l’accès de toute l’organisation.

Ces actions doivent être bloquées ou confirmées avec une procédure de sécurité.

---

# 102. Dernier Administrator

Invariance :

```text
Une organisation active doit conserver
au moins un Administrator actif.
```

Cette règle doit être vérifiée transactionnellement.

---

# 103. Changement de rôle

Flux :

```text
Sélection du compte
      ↓
Vérifier roles.manage
      ↓
Vérifier invariants
      ↓
Mettre à jour transactionnellement
      ↓
Créer SecurityEvent
      ↓
Invalider la session du compte
      ↓
Afficher confirmation
```

---

# 104. Changement de statut User

Un changement vers `SUSPENDED` ou `DISABLED` doit :

- produire un événement;
- invalider les caches;
- bloquer les nouvelles actions;
- couper Realtime;
- révoquer la session lorsque possible.

---

# 105. Liens User et Employee

Règles :

- un User peut être lié à zéro ou un Employee dans la V1;
- un Employee peut être lié à zéro ou un User;
- un User Operator doit être lié à un Employee;
- supprimer le lien ne doit pas supprimer l’historique;
- l’affectation de Mission utilise EmployeeId.

---

# 106. Duplication de courriel

Le courriel Auth doit être unique selon Supabase.

Le courriel Employee peut être dupliqué historiquement ou absent.

La liaison doit utiliser les identifiants, pas seulement le courriel.

---

# 107. Profil personnel

Un utilisateur peut modifier selon permission :

- son nom d’affichage;
- son thème;
- sa langue;
- son mot de passe;
- ses préférences de notification.

Il ne peut pas modifier :

- ses rôles;
- son organisation;
- son statut;
- son Employee lié.

---

# 108. Données personnelles

L’accès aux coordonnées d’un Employee doit être limité.

Exemple :

- Operator peut voir les informations nécessaires de son propre profil;
- Dispatcher peut voir les coordonnées opérationnelles;
- Accounting n’a pas besoin de toutes les données RH;
- Viewer peut avoir une vue anonymisée selon le besoin.

---

# 109. Exports

Les exports sensibles requièrent une permission dédiée.

Exemples :

```text
client.export
financial.export
mission.export
employee.export
```

Un export important doit être audité.

---

# 110. Impersonation

L’usurpation de session administrative n’est pas incluse dans la V1.

Elle ne doit pas être simulée en partageant un mot de passe.

Une future fonction d’assistance devra :

- être explicite;
- être limitée;
- être auditée;
- afficher une bannière;
- expirer rapidement.

---

# 111. Service Accounts

Les intégrations machine-à-machine doivent utiliser des comptes ou secrets dédiés.

Exemples :

- génération PDF;
- import;
- synchronisation;
- automatisation.

Elles ne doivent pas utiliser le compte personnel d’un Administrator.

---

# 112. Webhooks

Les Webhooks entrants doivent :

- vérifier une signature;
- appliquer un rate limit;
- valider le payload;
- dédupliquer;
- journaliser;
- isoler l’organisation;
- ne pas utiliser une clé frontend.

---

# 113. Edge Functions

Une Edge Function doit vérifier :

- identité;
- organisation;
- permission;
- paramètres;
- secrets;
- taille du payload;
- idempotence;
- audit.

Elle ne doit pas faire confiance uniquement à la présence d’un JWT.

---

# 114. RPC Security Definer

Une fonction `SECURITY DEFINER` doit être utilisée avec prudence.

Elle doit :

- fixer `search_path`;
- vérifier l’Actor;
- vérifier l’organisation;
- vérifier la permission;
- limiter les colonnes;
- éviter SQL dynamique non contrôlé;
- être testée.

---

# 115. Sécurité des vues

Les vues doivent respecter RLS ou exposer seulement des données autorisées.

Une vue ne doit pas contourner silencieusement les politiques des tables sources.

---

# 116. Tests unitaires

Tester :

- résolution des permissions;
- union de rôles;
- permission manquante;
- scopes;
- dernier Administrator;
- changement de statut;
- accès Operator assigné;
- module désactivé;
- session inactive.

---

# 117. Tests RLS

Créer des tests pour :

- Administrator;
- Manager;
- Dispatcher;
- Sales;
- Accounting;
- Operator assigné;
- Operator non assigné;
- Viewer;
- utilisateur d’une autre organisation;
- compte désactivé.

---

# 118. Scénarios RLS critiques

## Operator assigné

Doit pouvoir :

- lire sa Mission;
- lire ses MissionItems;
- écrire ses transitions;
- créer un problème;
- synchroniser.

## Operator non assigné

Ne doit rien pouvoir lire ou écrire sur cette Mission.

## Accounting

Doit pouvoir :

- lire Factures;
- enregistrer Paiement.

Ne doit pas pouvoir :

- modifier une Route;
- créer une Mission.

## Sales

Doit pouvoir :

- créer Client;
- créer Contrat.

Ne doit pas pouvoir :

- annuler un Paiement;
- modifier les rôles.

---

# 119. Tests E2E Auth

Scénarios :

```text
Connexion valide
Connexion invalide
Compte invité
Compte suspendu
Mot de passe oublié
Changement de mot de passe
Déconnexion
Expiration de session
Module désactivé
Permission refusée
Changement de rôle
Operator sans Mission
Operator avec Mission
```

---

# 120. Tests de régression historique

Les comportements confirmés de l’ancienne application doivent être vérifiés :

- Paramètres réservés à l’Administrator;
- module désactivé caché et URL bloquée;
- Operator assigné autorisé à mettre à jour sa Mission;
- Operator non assigné refusé;
- rôle `operateur` reconnu;
- sessions compatibles avec les migrations.

---

# 121. Migration depuis l’ancien modèle

Avant de migrer :

1. inventorier les rôles existants;
2. inventorier les valeurs de `users.role`;
3. inventorier les politiques RLS;
4. identifier les comptes actifs;
5. identifier les Employees liés;
6. identifier les Operators;
7. documenter les exceptions;
8. tester la compatibilité avec les deux applications.

---

# 122. Mappings Legacy

Exemple conceptuel :

```text
administrateur
      ↓
ADMINISTRATOR
```

```text
employe
      ↓
rôle à déterminer selon l’usage réel
```

```text
operateur
      ↓
OPERATOR
```

Le rôle historique `employe` ne doit pas être mappé automatiquement vers un rôle trop puissant.

Chaque compte doit être classé selon son usage réel.

---

# 123. Migration progressive

Ordre recommandé :

```text
1. Ajouter le nouveau modèle de rôles
2. Créer les permissions
3. Migrer les comptes
4. Maintenir le champ legacy temporairement
5. Déployer V2
6. Vérifier
7. Déprécier les comparaisons legacy
8. Retirer le champ plus tard
```

---

# 124. Compatibilité avec l’ancienne application

Pendant la transition :

- l’ancienne application peut continuer à lire son rôle historique;
- RECA App V2 utilise les nouvelles permissions;
- une vue ou fonction peut produire le rôle legacy;
- les deux systèmes doivent rester compatibles.

Éviter une double écriture dispersée dans plusieurs clients.

---

# 125. Compatibilité RECA Opérateur

RECA Opérateur doit continuer à reconnaître l’Operator pendant la migration.

Le contrat minimal :

```text
User actif
Employee lié
can_operate = true
permission assigned_mission.read
Mission assignée
```

---

# 126. Erreurs d’autorisation

Codes recommandés :

```text
UNAUTHENTICATED
SESSION_EXPIRED
USER_INACTIVE
ORGANIZATION_INACTIVE
FORBIDDEN
MODULE_DISABLED
MISSION_NOT_ASSIGNED
MFA_REQUIRED
ACCOUNT_SETUP_REQUIRED
```

L’interface traduit ces codes.

---

# 127. Pages d’erreur

## 401

```text
Votre session a expiré.
Reconnectez-vous pour continuer.
```

## 403

```text
Vous n’avez pas l’autorisation d’accéder à cette section.
```

## Module désactivé

```text
Ce module n’est pas activé pour votre organisation.
```

## Compte suspendu

```text
Votre accès est temporairement suspendu.
Communiquez avec un administrateur.
```

---

# 128. Sécurité de l’interface

L’interface doit :

- cacher les actions interdites;
- désactiver les actions temporairement impossibles;
- expliquer les états;
- ne pas exposer les permissions techniques;
- ne pas charger inutilement les données interdites;
- éviter les flashs de contenu avant résolution de session.

---

# 129. Chargement initial

Avant d’afficher le shell :

```text
Auth résolue
+ User résolu
+ Organisation résolue
+ Permissions résolues
```

Un skeleton global peut être affiché.

Ne pas afficher temporairement tous les modules puis les retirer.

---

# 130. Cache TanStack Query

Les query keys sensibles doivent inclure le contexte pertinent.

Exemple :

```ts
['missions', organizationId, filters]
```

Au changement de User ou Organisation :

- vider le cache;
- fermer Realtime;
- réinitialiser les stores;
- recharger les données.

---

# 131. Changement d’organisation

Hors périmètre initial si une seule organisation.

L’architecture ne doit cependant pas empêcher un sélecteur futur.

Un changement d’organisation doit provoquer une réinitialisation complète du contexte.

---

# 132. Notifications

Les notifications doivent respecter les permissions.

Un Operator ne doit pas recevoir une notification financière.

Accounting ne doit pas recevoir une alerte GPS sans besoin.

Les préférences ne peuvent pas élargir les permissions.

---

# 133. Données du Dashboard

Le Dashboard doit filtrer ses projections selon les permissions.

Exemples :

- Sales voit le pipeline;
- Dispatcher voit les Missions;
- Accounting voit les retards;
- Operator voit sa Mission;
- Manager voit une synthèse.

---

# 134. Recherche globale

La recherche globale doit filtrer les résultats selon les permissions.

Un Operator recherchant une adresse ne doit pas obtenir tous les Clients.

Le service de recherche doit appliquer les restrictions côté serveur.

---

# 135. Command Palette

Une commande apparaît seulement si :

- le module est actif;
- la permission est accordée;
- le contexte est valide;
- l’action existe sur l’appareil.

---

# 136. Mobile

Les mêmes permissions s’appliquent sur mobile.

La navigation mobile ne doit pas exposer un module interdit sous prétexte d’un menu simplifié.

---

# 137. Tablette

Aucune exception de sécurité liée au format d’écran.

---

# 138. Impression et PDF

La génération ou consultation d’un document doit vérifier la permission associée à l’entité.

Une URL de fichier seule ne doit pas suffire.

---

# 139. Environnement de développement

Les comptes de développement doivent couvrir tous les rôles.

Exemples :

```text
admin.dev@...
manager.dev@...
dispatcher.dev@...
sales.dev@...
accounting.dev@...
operator.dev@...
viewer.dev@...
```

Ne jamais utiliser les comptes réels de production pour les tests courants.

---

# 140. Données de démonstration

Une organisation de démonstration doit :

- utiliser des données fictives;
- avoir des permissions contrôlées;
- être isolée;
- pouvoir être réinitialisée;
- ne pas accéder à la production.

---

# 141. CI et sécurité

La CI doit vérifier :

- aucun secret committé;
- typecheck;
- lint;
- tests d’autorisation;
- migrations;
- politiques RLS critiques;
- build.

---

# 142. Déploiement

Avant production :

- vérifier les rôles;
- vérifier le dernier Administrator;
- vérifier les politiques RLS;
- vérifier les Storage policies;
- vérifier les redirects Auth;
- vérifier les secrets;
- vérifier l’accès Operator;
- vérifier l’environnement Supabase;
- vérifier la révocation.

---

# 143. Incident de sécurité

Un incident doit pouvoir être traité par :

```text
Identifier
      ↓
Bloquer
      ↓
Révoquer
      ↓
Auditer
      ↓
Corriger
      ↓
Notifier
      ↓
Documenter
```

Prévoir une procédure pour :

- compte compromis;
- clé exposée;
- accès non autorisé;
- erreur RLS;
- appareil perdu;
- export abusif.

---

# 144. Appareil Operator perdu

Actions recommandées :

- désactiver le User;
- révoquer la session;
- désassocier le Device;
- réassigner la Mission;
- invalider le cache lors du prochain contact;
- vérifier les opérations non synchronisées;
- créer un événement de sécurité.

---

# 145. Rétention des événements de sécurité

La durée doit être définie selon :

- besoin d’audit;
- vie privée;
- réglementation;
- volume.

Une durée initiale recommandée peut être proposée plus tard après validation.

---

# 146. Accès des développeurs

Les développeurs ne doivent pas utiliser une clé `service_role` dans le navigateur.

Les accès à la production doivent être :

- nominatifs;
- limités;
- audités;
- révoqués au départ;
- protégés par MFA.

---

# 147. Accès de Claude

Claude peut consulter :

```text
reca-app
reca-operateur
reca-app-v2
```

Claude ne doit jamais :

- afficher un secret;
- committer une clé;
- exposer une credential;
- modifier un rôle réel sans demande;
- tester une mutation sensible sur un compte réel sans autorisation;
- désactiver un compte de production;
- modifier les politiques RLS sans plan.

---

# 148. Règles non négociables

Ne jamais considérer un bouton caché comme une sécurité.

Ne jamais exposer `service_role` au frontend.

Ne jamais accorder à l’Operator l’accès global aux Clients ou Contrats.

Ne jamais autoriser une écriture Mission sans vérifier l’affectation.

Ne jamais permettre de supprimer le dernier Administrator.

Ne jamais modifier les rôles sans audit.

Ne jamais utiliser un rôle historique ambigu comme permission universelle.

Ne jamais laisser un module désactivé accessible par URL.

Ne jamais construire la recherche globale sans filtrage serveur.

Ne jamais conserver une session active après désactivation sans revalidation.

Ne jamais journaliser un secret.

---

# 149. Décisions à confirmer

Les points suivants doivent être validés avant l’implémentation finale :

- MFA obligatoire ou optionnelle;
- rôles exacts de la V1;
- multi-rôles dès la V1 ou migration progressive;
- permissions Sales sur activation de Contrat;
- permissions Manager sur annulation de Mission;
- accès Sales aux Factures;
- accès Viewer aux données financières;
- durée de session;
- période de grâce hors ligne Operator;
- possibilité d’organisations multiples;
- modèle `users.role` temporaire;
- stratégie de révocation Supabase;
- durée de rétention des SecurityEvents.

Toutes les décisions confirmées doivent être ajoutées à `memory.md`.

---

# 150. Critères de réussite

L’architecture Auth est réussie si :

- chaque action sensible possède une permission;
- les rôles demeurent compréhensibles;
- les comptes inactifs sont bloqués;
- l’Operator voit seulement sa Mission;
- les Routes et Missions sont protégées;
- les finances sont isolées;
- les Paramètres sont réservés;
- les modules désactivés sont réellement bloqués;
- les politiques RLS sont testées;
- les changements de rôle sont audités;
- les sessions peuvent être révoquées;
- l’ancienne application reste compatible pendant la migration;
- RECA Opérateur continue de fonctionner;
- aucun secret n’est exposé;
- la sécurité ne dépend jamais uniquement du frontend.

---

# 151. Flux de connexion officiel

```text
Courriel + mot de passe
      ↓
Supabase Auth
      ↓
Session Auth valide
      ↓
User applicatif trouvé
      ↓
User actif
      ↓
Organisation active
      ↓
Rôles chargés
      ↓
Permissions résolues
      ↓
Employee lié
      ↓
AppSession
      ↓
Route autorisée
```

---

# 152. Flux d’autorisation officiel

```text
Action demandée
      ↓
Module actif ?
      ↓
Session valide ?
      ↓
Permission accordée ?
      ↓
Scope valide ?
      ↓
État métier valide ?
      ↓
RLS autorise ?
      ↓
Transaction
      ↓
Audit
```

---

# 153. Flux Operator officiel

```text
Connexion
      ↓
User actif
      ↓
Employee lié
      ↓
can_operate = true
      ↓
Permission Operator
      ↓
Mission assignée
      ↓
MissionItems autorisés
      ↓
Exécution locale
      ↓
Synchronisation idempotente
```

---

# 154. Résumé officiel

RECA App V2 utilise Supabase Auth pour l’identité.

Le profil applicatif, l’employé, l’opérateur, le rôle et la permission sont des concepts distincts.

Les rôles regroupent des permissions.

Les permissions protègent les actions.

Les scopes protègent le contexte.

Les routes, les cas d’utilisation, les repositories et Supabase RLS appliquent les règles.

L’Operator peut uniquement accéder à sa Mission assignée et aux données opérationnelles nécessaires.

Les données commerciales et financières demeurent protégées.

Les modules désactivés sont cachés et bloqués.

Les changements sensibles sont audités.

L’ancienne RECA App et RECA Opérateur restent compatibles pendant la migration.

La base de données demeure l’autorité finale.

L’objectif est de fournir un système simple à comprendre, strict à l’exécution et sécuritaire pour toutes les opérations de Groupe RECA.
