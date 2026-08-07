# 17-Roadmap.md

# RECA
## Feuille de route officielle de RECA App V2

Version : 1.0  
Projet : `reca-app-v2`  
Application historique : `reca-app`  
Application terrain : `reca-operateur`  
Statut : Feuille de route fonctionnelle, technique et opérationnelle officielle  

---

# 1. Objectif du document

Ce document définit la feuille de route officielle de RECA App V2.

Il transforme la vision, l’architecture et les règles métier documentées dans les fichiers précédents en une séquence de réalisation concrète.

Il décrit :

- les phases du projet;
- les dépendances;
- les jalons;
- les livrables;
- les validations;
- les Master UI;
- les sprints recommandés;
- les critères de passage;
- les risques;
- les priorités;
- les pilotes;
- la migration;
- la stabilisation;
- le retrait progressif de `reca-app`;
- l’intégration avec `reca-operateur`.

Ce document complète l’ensemble de la documentation officielle :

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
10-Employees-and-Equipment.md
11-Finance-and-Payments.md
12-Operator-Integration-and-Synchronization.md
13-Mobile-and-Responsive-Experience.md
14-Search-Notifications-and-History.md
15-Migration-Strategy.md
16-Development-Standards.md
```

---

# 2. Vision de livraison

RECA App V2 ne doit pas être développée comme une longue série d’écrans indépendants.

La progression officielle est :

```text
Documentation
  ↓
Inventaire réel
  ↓
Décisions techniques
  ↓
Fondation
  ↓
Master UI
  ↓
Données et sécurité
  ↓
Modules métier
  ↓
Opérations
  ↓
Intégration Operator
  ↓
Finance
  ↓
Migration
  ↓
Pilote
  ↓
Bascule
  ↓
Stabilisation
```

---

# 3. Principes de planification

La feuille de route respecte les principes suivants :

1. construire les fondations avant les modules;
2. valider le design avant de multiplier les écrans;
3. migrer par domaine;
4. conserver les systèmes existants;
5. construire les modules selon leurs dépendances;
6. traiter les Missions et la synchronisation comme des fonctions critiques;
7. traiter la Finance comme une fonction critique;
8. utiliser des migrations additives;
9. valider chaque phase avant de poursuivre;
10. maintenir la documentation et la mémoire à jour.

---

# 4. Dépendances principales

```text
Auth et permissions
  ↓
Shell et navigation
  ↓
Design System et Master UI
  ↓
Clients
  ↓
Contrats
  ↓
Employés et Équipements
  ↓
Routes
  ↓
Missions
  ↓
RECA Opérateur
```

En parallèle :

```text
Clients
  ↓
Factures
  ↓
Paiements
```

Et transversalement :

```text
Événements
Recherche
Notifications
Historique
Migration
Observabilité
```

---

# 5. Priorités métier

Ordre de priorité général :

## Priorité critique

- Auth;
- permissions;
- RLS;
- Clients;
- Contrats;
- géométrie;
- Routes;
- Missions;
- Operator;
- Factures;
- Paiements;
- migration.

## Priorité élevée

- Dashboard;
- Employees;
- Equipment;
- Problems;
- Search;
- History;
- Notifications;
- documents.

## Priorité secondaire

- automatisations avancées;
- rapports avancés;
- préférences complexes;
- fonctions futures.

---

# 6. Jalons officiels

```text
Jalon 0
Documentation terminée

Jalon 1
Inventaire et décisions techniques terminés

Jalon 2
Fondation du dépôt fonctionnelle

Jalon 3
Master UI approuvé

Jalon 4
Modules commerciaux fonctionnels

Jalon 5
Contrats et mesure fonctionnels

Jalon 6
Routes, ressources et Missions fonctionnelles

Jalon 7
Intégration RECA Opérateur validée

Jalon 8
Finance fonctionnelle

Jalon 9
Recherche, notifications et historique fonctionnels

Jalon 10
Migration et pilote réussis

Jalon 11
RECA App V2 en production

Jalon 12
Ancienne application en lecture seule puis retirée
```

---

# 7. Phase 0 — Documentation et préparation

## Objectif

Créer une base documentaire complète avant le développement.

## Livrables

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
10-Employees-and-Equipment.md
11-Finance-and-Payments.md
12-Operator-Integration-and-Synchronization.md
13-Mobile-and-Responsive-Experience.md
14-Search-Notifications-and-History.md
15-Migration-Strategy.md
16-Development-Standards.md
17-Roadmap.md
```

## Critère de sortie

- documentation complète;
- aucune contradiction critique non identifiée;
- liste de décisions à confirmer;
- structure du nouveau dépôt validée.

---

# 8. Phase 1 — Inventaire réel

## Objectif

Comparer la documentation cible avec :

```text
reca-app
reca-operateur
base Supabase
Storage
RLS
RPC
Edge Functions
```

## Livrables

```text
docs/migration/inventory.md
docs/migration/status-mappings.md
docs/migration/data-quality-report.md
docs/migration/operator-compatibility.md
```

## Travaux

- inventorier les routes;
- inventorier les tables;
- inventorier les vues;
- inventorier les RPC;
- inventorier les RLS;
- inventorier les statuts;
- inventorier les documents;
- inventorier les géométries;
- inventorier les Missions;
- inventorier la synchronisation;
- inventorier les données financières;
- identifier les contradictions.

## Critère de sortie

- l’état réel est documenté;
- les mappings sont identifiés;
- les risques sont connus;
- les premières migrations peuvent être planifiées.

---

# 9. Phase 2 — Décisions techniques

## Objectif

Confirmer les choix nécessaires au bootstrap.

## Décisions requises

```text
Gestionnaire de paquets
Versions des dépendances
Structure exacte du dépôt
Architecture des feature flags
Stratégie i18n
Stratégie de monitoring
Stratégie de CI
Stratégie de déploiement
Package partagé Operator ou génération
PostGIS ou GeoJSON JSONB
Approche Search
Approche notifications
Approche documents PDF
```

## Livrables

```text
docs/adr/ADR-001-package-manager.md
docs/adr/ADR-002-project-structure.md
docs/adr/ADR-003-operator-contracts.md
docs/adr/ADR-004-role-model.md
docs/adr/ADR-005-geometry-storage.md
docs/adr/ADR-006-search.md
docs/adr/ADR-007-deployment.md
```

## Critère de sortie

- décisions approuvées;
- `memory.md` mis à jour;
- aucune décision de fond cachée dans le code.

---

# 10. Phase 3 — Fondation du dépôt

## Objectif

Créer un dépôt propre, testable et déployable.

## Livrables

```text
reca-app-v2/
├── CLAUDE.md
├── README.md
├── tasks.md
├── plans.md
├── file-index.md
├── memory.md
├── docs/
├── src/
├── supabase/
├── tests/
└── configuration du projet
```

## Fonctions de base

- React;
- Vite;
- TypeScript strict;
- Tailwind;
- React Router;
- TanStack Query;
- React Hook Form;
- Zod;
- Supabase;
- Vitest;
- Playwright;
- lint;
- format;
- CI;
- environnements.

## Critère de sortie

```text
pnpm check
```

ou commande équivalente réussie.

---

# 11. Phase 4 — Design System et Master UI

## Objectif

Valider visuellement le produit avant de construire tous les modules.

## Master UI obligatoires

```text
1. Centre des opérations
2. Liste d’entités
3. Fiche commerciale
4. Fiche opérationnelle
5. Formulaire complexe
6. Expérience mobile
```

---

# 12. Master UI 1 — Centre des opérations

États à produire :

- journée normale;
- Mission active;
- problème critique;
- aucune Mission;
- données périmées;
- hors saison;
- Mobile;
- Desktop;
- clair;
- sombre.

Critère :

- hiérarchie immédiatement compréhensible;
- pas de Dashboard générique;
- carte et opérations cohérentes;
- À traiter visible.

---

# 13. Master UI 2 — Liste d’entités

Utiliser comme référence pour :

- Clients;
- Contrats;
- Routes;
- Missions;
- Invoices;
- Employees;
- Equipment.

États :

- liste normale;
- filtres;
- recherche;
- vide;
- chargement;
- erreur;
- Mobile;
- Desktop.

---

# 14. Master UI 3 — Fiche commerciale

Utiliser comme référence pour :

- Lead;
- Quote;
- Client;
- Contract;
- Invoice.

États :

- actif;
- incomplet;
- archivé;
- problème;
- mobile;
- desktop.

---

# 15. Master UI 4 — Fiche opérationnelle

Utiliser pour :

- Route;
- Mission;
- Employee;
- Equipment.

États :

- préparation;
- en cours;
- problème;
- hors ligne;
- terminé.

---

# 16. Master UI 5 — Formulaire complexe

Utiliser pour :

- Contract;
- géométrie;
- Mission;
- échéancier;
- conversion.

États :

- validation;
- erreur;
- brouillon;
- confirmation;
- Mobile;
- Desktop.

---

# 17. Master UI 6 — Expérience Mobile

Valider :

- navigation inférieure;
- header;
- cartes;
- actions;
- filtres;
- bottom sheets;
- formulaires;
- safe areas;
- clavier;
- thème sombre.

---

# 18. Critère de sortie Master UI

Aucun sprint de multiplication d’écrans ne doit commencer avant :

- validation Desktop;
- validation Mobile;
- validation clair/sombre;
- validation des tokens;
- validation des composants de base;
- capture de référence;
- documentation des ajustements.

---

# 19. Phase 5 — Auth, rôles et sécurité

## Objectif

Mettre en place la sécurité avant les modules métier.

## Livrables

- Supabase Auth;
- session;
- organisation;
- profil;
- rôles;
- permissions;
- modules;
- feature flags;
- guards;
- RLS;
- tests.

## Critère de sortie

Les scénarios suivants fonctionnent :

```text
Administrator
Manager
Dispatcher
Sales Representative
Accounting
Operator
Viewer
```

avec accès permis et refusé correctement.

---

# 20. Phase 6 — Shell et navigation

## Objectif

Créer le cadre applicatif officiel.

## Livrables

```text
DesktopAppShell
TabletAppShell
MobileAppShell
FullscreenFlowShell
DesktopSidebar
MobileBottomNavigation
TopBar
Breadcrumb
GlobalSearchTrigger
NotificationTrigger
ProfileMenu
```

## Critère de sortie

- navigation par rôle;
- modules filtrés;
- routes protégées;
- responsive;
- thème;
- état de session;
- deep links.

---

# 21. Phase 7 — Shared Domain et infrastructure

## Objectif

Créer les bases partagées avant les modules.

## Livrables

- IDs;
- Money;
- Date;
- Address;
- Phone;
- Result;
- Error codes;
- pagination;
- audit;
- events;
- Storage;
- repositories de base;
- mappers;
- infrastructure Supabase;
- query key standards.

## Critère de sortie

Les features peuvent être développées sans contourner l’architecture.

---

# 22. Phase 8 — Clients

## Objectif

Construire la première entité centrale.

## Livrables

- liste;
- création;
- fiche;
- modification;
- archivage;
- notes;
- adresses;
- géocodage;
- recherche;
- historique;
- permissions;
- RLS;
- adapter legacy.

## Critère de sortie

Un Client peut être créé, trouvé, modifié, archivé et utilisé comme contexte pour les modules suivants.

---

# 23. Phase 9 — Leads et Soumissions

## Objectif

Reconstruire le pipeline commercial.

## Livrables

- Leads;
- rappels;
- assignations;
- statuts;
- Quotes;
- items;
- calculs;
- PDF;
- envoi;
- acceptation;
- conversion Client;
- historique;
- migration.

## Critère de sortie

Flux fonctionnel :

```text
Lead
  ↓
Quote
  ↓
Client
```

---

# 24. Phase 10 — Contrats

## Objectif

Créer le centre de vérité commercial et opérationnel.

## Livrables

- Wizard;
- Client;
- propriété;
- saison;
- services;
- clauses;
- tarification;
- échéancier;
- documents;
- versions;
- Readiness;
- historique;
- migration.

## Critère de sortie

Un Contract peut être créé, finalisé, activé et utilisé par les opérations.

---

# 25. Phase 11 — Outil de mesure

## Objectif

Reconstruire l’éditeur de surface sans limite artificielle.

## Livrables

- Mapbox;
- satellite/plan;
- zones multiples;
- dessin libre;
- édition;
- surface;
- capture;
- `snow_geometry`;
- `geometry_version`;
- `geometry_status`;
- migration non destructive;
- validation;
- Mobile/Tablette.

## Critère de sortie

Scénarios validés :

```text
Entrée simple
Entrée longue
Plusieurs zones
Surface cachée
Géométrie migrée
Capture complète
```

---

# 26. Phase 12 — Employees et Equipment

## Objectif

Créer les ressources nécessaires à la répartition.

## Livrables

- Employees;
- User linking;
- Operator eligibility;
- Equipment;
- statuts;
- disponibilité;
- maintenance;
- historique;
- recherche;
- RLS.

## Critère de sortie

Un Operator et un Equipment peuvent être validés et affectés.

---

# 27. Phase 13 — Routes

## Objectif

Créer les modèles permanents de service.

## Livrables

- liste;
- fiche;
- carte;
- RouteItems;
- ajout Contract;
- réorganisation;
- ressources par défaut;
- Readiness;
- version;
- historique;
- migration.

## Critère de sortie

Une Route active peut être utilisée pour créer une Mission.

---

# 28. Phase 14 — Missions et Dispatch

## Objectif

Créer le cœur opérationnel administratif.

## Livrables

- création depuis Route;
- snapshots;
- MissionItems;
- assignations;
- readiness;
- dispatch;
- progression;
- carte;
- Problems;
- pauses;
- annulation;
- historique;
- supervision.

## Critère de sortie

Une Mission peut être créée, préparée, assignée, suivie et terminée.

---

# 29. Phase 15 — Centre des opérations

## Objectif

Brancher le Dashboard sur les données réelles.

## Livrables

- projection Dashboard;
- Missions actives;
- À traiter;
- Problems;
- ressources;
- synchronisation;
- carte;
- activité;
- vues par rôle;
- saison;
- responsive.

## Critère de sortie

Le Dashboard répond clairement :

```text
Qu’est-ce qui se passe ?
Qu’est-ce qui demande une action ?
Quelle est la prochaine action ?
```

---

# 30. Phase 16 — Contrats partagés Operator

## Objectif

Créer le contrat officiel entre RECA App V2 et RECA Opérateur.

## Livrables

- package partagé ou génération;
- schémas;
- versions;
- enums;
- payload Mission;
- payload MissionItem;
- Problems;
- transitions;
- erreurs;
- tests de contrat.

## Critère de sortie

Les deux applications valident les mêmes contrats en CI.

---

# 31. Phase 17 — Synchronisation Operator

## Objectif

Fiabiliser complètement les opérations terrain.

## Livrables

- cache local;
- SyncQueue;
- batch;
- sequence;
- idempotencyKey;
- acknowledgements;
- retry;
- conflicts;
- Device;
- session;
- handoff;
- health;
- Dashboard;
- tests hors ligne.

## Critère de sortie

Scénario complet validé :

```text
Mission téléchargée
  ↓
Travail hors ligne
  ↓
Retour réseau
  ↓
Aucune perte
  ↓
Aucun doublon
  ↓
Dashboard cohérent
```

---

# 32. Phase 18 — Factures

## Objectif

Reconstruire la facturation sur des règles fiables.

## Livrables

- liste;
- création;
- items;
- taxes;
- émission;
- PDF;
- envoi;
- échéance;
- retard;
- statut;
- historique;
- migration;
- RLS.

## Critère de sortie

Une Invoice peut être générée, émise, envoyée et suivie.

---

# 33. Phase 19 — Paiements

## Objectif

Fiabiliser les encaissements.

## Livrables

- Payment;
- Payment partiel;
- Payment complet;
- idempotence;
- annulation;
- solde;
- statut Invoice;
- audit;
- migration;
- rapports.

## Critère de sortie

Aucun Payment ne peut produire :

- doublon;
- surpaiement;
- solde incohérent;
- statut incorrect.

---

# 34. Phase 20 — Recherche globale

## Objectif

Permettre de retrouver rapidement toutes les entités autorisées.

## Livrables

- index;
- normalisation;
- RPC;
- Command Palette;
- recherche Mobile;
- résultats groupés;
- permissions;
- récents;
- tests.

## Critère de sortie

Les recherches suivantes fonctionnent :

```text
Numéro
Téléphone
Courriel
Adresse
Nom
Route
Mission
Facture
```

---

# 35. Phase 21 — Notifications et À traiter

## Objectif

Centraliser les événements importants et actions non résolues.

## Livrables

- Notifications;
- préférences;
- badge;
- panneau;
- deep links;
- AttentionItems;
- résolution;
- déduplication;
- Realtime;
- Mobile.

## Critère de sortie

Les incidents critiques restent visibles jusqu’à résolution.

---

# 36. Phase 22 — Historique et audit

## Objectif

Fournir une traçabilité complète.

## Livrables

- DomainEvents;
- timelines;
- activité globale;
- AuditEvents;
- SecurityEvents;
- historique sync;
- filtres;
- permissions;
- export contrôlé.

## Critère de sortie

Toute action critique peut être expliquée :

```text
Qui
Quoi
Quand
Pourquoi
Sur quelle entité
```

---

# 37. Phase 23 — Migration progressive

## Objectif

Migrer les données et basculer les modules.

## Livrables

- scripts;
- dry-runs;
- rapports;
- mappings;
- backfills;
- feature flags;
- shadow reads;
- comparaisons;
- rollback.

## Critère de sortie

Aucun écart critique non expliqué.

---

# 38. Phase 24 — Pilote

## Objectif

Valider l’application avec de vrais utilisateurs et de vrais scénarios.

## Utilisateurs pilotes

```text
Administrator
Dispatcher
Sales Representative
Accounting
Operator test
```

## Scénarios pilotes

- création Client;
- Lead vers Contract;
- mesure;
- Route;
- Mission;
- Operator hors ligne;
- Problem;
- Invoice;
- Payment;
- Search;
- Notification.

## Critère de sortie

- aucune erreur critique;
- adoption suffisante;
- rollback non utilisé ou maîtrisé;
- données comparées;
- ajustements terminés.

---

# 39. Phase 25 — Production progressive

## Objectif

Activer RECA App V2 par module.

Ordre recommandé :

```text
Clients
Leads et Quotes
Contracts
Employees et Equipment
Routes
Missions
Dashboard
Finance
Search et History
```

L’ordre peut changer selon les résultats du pilote.

---

# 40. Phase 26 — Lecture seule legacy

## Objectif

Empêcher de nouvelles divergences.

`reca-app` devient :

```text
Lecture seule
```

Il demeure disponible pour :

- comparaison;
- récupération;
- historique;
- support.

---

# 41. Phase 27 — Retrait legacy

## Objectif

Retirer proprement l’ancienne application.

Livrables :

- tag final;
- archive;
- README;
- suppression des secrets;
- retrait des routes;
- retrait des mappings;
- retrait des flags;
- retrait des colonnes obsolètes après observation.

---

# 42. Sprints recommandés

La séquence suivante est une proposition initiale.

Les numéros de sprint sont officiels seulement après confirmation dans `plans.md`.

---

# 43. Sprint 001 — Bootstrap du dépôt

## Objectif

Initialiser `reca-app-v2`.

## Contenu

- dépôt;
- package manager;
- Vite;
- React;
- TypeScript strict;
- Tailwind;
- lint;
- format;
- tests;
- CI;
- mémoire;
- README.

## Definition of Done

- build;
- test;
- lint;
- typecheck;
- preview;
- docs.

---

# 44. Sprint 002 — Architecture applicative

## Contenu

- structure Feature-first;
- app providers;
- routing;
- Error Boundaries;
- Result;
- errors;
- config;
- environment;
- Supabase client;
- database types;
- repository conventions.

---

# 45. Sprint 003 — Design System Foundations

## Contenu

- tokens;
- thème;
- typographie;
- Button;
- Input;
- Badge;
- Alert;
- Card;
- Dialog;
- BottomSheet;
- Drawer;
- Toast;
- Skeleton;
- EmptyState;
- ErrorState.

---

# 46. Sprint 004 — Shell responsive

## Contenu

- DesktopAppShell;
- MobileAppShell;
- TabletAppShell;
- FullscreenFlowShell;
- sidebar;
- bottom nav;
- top bar;
- breadcrumb;
- profile.

---

# 47. Sprint 005 — Auth et permissions

## Contenu

- Auth;
- session;
- profils;
- rôles;
- permissions;
- module guards;
- route guards;
- RLS tests;
- User management minimal.

---

# 48. Sprint 006 — Master UI

## Contenu

- Operations Center;
- Entity List;
- Commercial Detail;
- Operational Detail;
- Complex Form;
- Mobile Experience;
- screenshots;
- visual regression.

---

# 49. Sprint 007 — Shared infrastructure

## Contenu

- pagination;
- query keys;
- formatting;
- date;
- money;
- address;
- phone;
- Storage;
- audit seam;
- event seam;
- map seam.

---

# 50. Sprint 008 — Clients

## Contenu

- list;
- create;
- detail;
- edit;
- archive;
- notes;
- geocoding;
- history;
- search;
- RLS.

---

# 51. Sprint 009 — Leads

## Contenu

- list;
- create;
- detail;
- status;
- assignment;
- reminders;
- lost reasons;
- conversion context.

---

# 52. Sprint 010 — Quotes

## Contenu

- create;
- items;
- calculations;
- status;
- PDF;
- send;
- accept;
- convert to Client;
- versioning.

---

# 53. Sprint 011 — Contracts Core

## Contenu

- Wizard;
- Client;
- service address;
- season;
- services;
- clauses;
- pricing;
- schedule;
- readiness;
- history.

---

# 54. Sprint 012 — Measurement Editor

## Contenu

- Mapbox;
- zones;
- free drawing;
- editing;
- area;
- capture;
- MultiPolygon;
- geometry status;
- migration seam.

---

# 55. Sprint 013 — Employees

## Contenu

- list;
- detail;
- create;
- status;
- user linking;
- canOperate;
- eligibility;
- availability;
- history.

---

# 56. Sprint 014 — Equipment

## Contenu

- list;
- detail;
- create;
- status;
- availability;
- maintenance;
- assignment history;
- conflicts.

---

# 57. Sprint 015 — Routes

## Contenu

- list;
- detail;
- RouteItems;
- map;
- reorder;
- defaults;
- readiness;
- versioning.

---

# 58. Sprint 016 — Mission creation and dispatch

## Contenu

- create from Route;
- snapshots;
- MissionItems;
- assignments;
- readiness;
- dispatch;
- validation;
- idempotence.

---

# 59. Sprint 017 — Mission supervision

## Contenu

- active Mission;
- progress;
- map;
- active item;
- Problems;
- pause;
- complete;
- cancel;
- history.

---

# 60. Sprint 018 — Operations Center

## Contenu

- Dashboard projections;
- active Missions;
- Attention;
- Problems;
- resources;
- map;
- season;
- role views.

---

# 61. Sprint 019 — Operator contracts

## Contenu

- shared schemas;
- payloads;
- enums;
- versions;
- compatibility;
- CI contract tests.

---

# 62. Sprint 020 — Operator synchronization

## Contenu

- SyncQueue;
- batch;
- sequence;
- idempotence;
- retry;
- acknowledgements;
- conflicts;
- health.

---

# 63. Sprint 021 — Operator devices and handoff

## Contenu

- Device;
- session;
- revoke;
- primary device;
- reassignment;
- handoff;
- offline grace;
- diagnostics.

---

# 64. Sprint 022 — Invoices

## Contenu

- list;
- create;
- schedule;
- taxes;
- issue;
- PDF;
- send;
- overdue;
- history.

---

# 65. Sprint 023 — Payments

## Contenu

- record;
- partial;
- complete;
- cancel;
- idempotence;
- balance;
- audit;
- reports.

---

# 66. Sprint 024 — Global Search

## Contenu

- index;
- normalization;
- RPC;
- Command Palette;
- Mobile;
- permissions;
- recent.

---

# 67. Sprint 025 — Notifications and Attention

## Contenu

- notification model;
- preferences;
- badge;
- center;
- deep links;
- AttentionItems;
- deduplication.

---

# 68. Sprint 026 — History and Audit

## Contenu

- DomainEvents;
- timelines;
- activity;
- audit;
- security events;
- filters;
- export.

---

# 69. Sprint 027 — Migration tooling

## Contenu

- inventory scripts;
- status mappings;
- migration batches;
- dry-run;
- reports;
- legacy ID mapping;
- comparison tools.

---

# 70. Sprint 028 — Module migration pilot

## Contenu

- Clients;
- Contracts;
- Routes;
- Invoices;
- comparison;
- feature flags;
- rollback.

---

# 71. Sprint 029 — Operator pilot

## Contenu

- real Mission;
- offline;
- sync;
- Problem;
- handoff;
- compatibility;
- monitoring.

---

# 72. Sprint 030 — Production cutover

## Contenu

- module activation;
- support;
- monitoring;
- incident process;
- legacy links;
- observation.

---

# 73. Sprint 031 — Legacy read-only

## Contenu

- block mutations;
- banner;
- redirects;
- support;
- comparison;
- archive preparation.

---

# 74. Sprint 032 — Legacy retirement

## Contenu

- remove flags;
- remove adapters;
- remove legacy policies;
- archive repositories;
- final documentation;
- final audits.

---

# 75. Dépendances entre sprints

Exemples :

```text
Sprint 008 Clients
nécessite
Sprint 005 Auth
Sprint 006 Master UI
Sprint 007 Shared infrastructure
```

```text
Sprint 016 Missions
nécessite
Sprint 011 Contracts
Sprint 013 Employees
Sprint 014 Equipment
Sprint 015 Routes
```

```text
Sprint 020 Operator sync
nécessite
Sprint 016 Missions
Sprint 019 Operator contracts
```

```text
Sprint 023 Payments
nécessite
Sprint 022 Invoices
```

---

# 76. Ordre parallèle possible

Certaines pistes peuvent progresser en parallèle.

## Piste UI

- Design System;
- Master UI;
- responsive;
- composants.

## Piste Data

- inventaire;
- migrations;
- adapters;
- RLS;
- projections.

## Piste Operator

- contrats;
- compatibilité;
- sync;
- Device.

## Piste Finance

- schéma;
- calculs;
- migration;
- documents.

Le parallélisme ne doit pas créer des décisions contradictoires.

---

# 77. Priorité saisonnière

Pendant la saison de déneigement, prioriser :

```text
Missions
Routes
Operator
Problems
Equipment
Dashboard
Stabilité
```

Hors saison, prioriser :

```text
Contracts
Renouvellements
Mesure
Clients
Finance
Maintenance
Migration
```

---

# 78. Changements à éviter avant une tempête

Ne pas déployer immédiatement avant une tempête :

- changement de statut;
- changement de payload;
- changement de sync;
- migration Mission;
- RLS Operator;
- refonte carte;
- mise à jour forcée.

---

# 79. Fenêtres de validation terrain

Les fonctions suivantes exigent un test réel :

- géométrie GPS;
- transitions;
- adjacence;
- hors ligne;
- handoff;
- synchronisation;
- Equipment reassignment;
- carte Operator.

---

# 80. Gates de qualité

Chaque phase doit passer quatre gates.

## Gate 1 — Métier

- règle validée;
- scénario réel;
- terminologie correcte.

## Gate 2 — Technique

- architecture;
- types;
- tests;
- transaction;
- performance.

## Gate 3 — Sécurité

- permissions;
- RLS;
- données;
- audit.

## Gate 4 — UX

- Desktop;
- Mobile;
- accessibilité;
- états;
- erreurs.

---

# 81. Definition of Ready d’un sprint

Un sprint est prêt si :

- objectif clair;
- documentation lue;
- dépendances terminées;
- décisions confirmées;
- scope limité;
- critères d’acceptation;
- fixtures;
- risques;
- migration identifiée.

---

# 82. Definition of Done d’un sprint

Un sprint est terminé si :

- code;
- tests;
- typecheck;
- lint;
- build;
- responsive;
- accessibilité;
- permissions;
- RLS;
- erreurs;
- docs;
- mémoire;
- captures;
- comparaison legacy si applicable.

---

# 83. Critères de passage en pilote

Avant pilote :

- aucun bug critique connu;
- flux principal complet;
- rollback testé;
- logs;
- support;
- utilisateurs formés;
- feature flags;
- données validées;
- RLS validées;
- Operator validé;
- Finance validée.

---

# 84. Critères de passage en production

Avant production :

- pilote réussi;
- données comparées;
- incidents résolus;
- performance acceptable;
- utilisateurs prêts;
- documentation;
- monitoring;
- backup;
- rollback;
- communication.

---

# 85. Critères de passage en lecture seule legacy

- tous les modules critiques sont en production;
- aucune mutation legacy nécessaire;
- Operator stable;
- Finance stable;
- documents accessibles;
- période d’observation complétée;
- support prêt.

---

# 86. Critères de retrait legacy

- lecture seule stable;
- aucune dépendance runtime;
- aucun User actif nécessaire;
- archive créée;
- secrets retirés;
- routes retirées;
- données préservées;
- documentation finale.

---

# 87. Risques du projet

## 87.1 Sous-estimer le legacy

Réponse :

- inventaire avant estimation.

## 87.2 Contradictions métier

Réponse :

- `memory.md`;
- décisions confirmées;
- ADR.

## 87.3 Géométrie

Réponse :

- migration non destructive;
- NEEDS_REVIEW;
- tests terrain.

## 87.4 Operator

Réponse :

- contrats versionnés;
- double support;
- pilote réel.

## 87.5 Finance

Réponse :

- transactions;
- comparaison;
- aucun écart silencieux.

## 87.6 RLS

Réponse :

- tests automatisés;
- matrice de rôles.

## 87.7 Scope trop large

Réponse :

- sprints limités;
- Definition of Done;
- hors périmètre explicite.

---

# 88. Gestion des décisions

Chaque décision suit :

```text
Question
  ↓
Options
  ↓
Recommandation
  ↓
Validation
  ↓
memory.md
  ↓
ADR si important
```

---

# 89. Gestion des tâches

`tasks.md` doit contenir :

- sprint actif;
- tâches;
- statut;
- bloqueurs;
- critères;
- tests;
- fichiers.

---

# 90. Gestion des plans

`plans.md` doit contenir :

- phase active;
- séquence;
- dépendances;
- risques;
- décisions ouvertes;
- plan de rollback.

---

# 91. Gestion de l’index des fichiers

`file-index.md` doit référencer :

- docs;
- features;
- migrations;
- tests;
- contrats;
- adapters;
- ADR;
- scripts.

---

# 92. Gestion de la mémoire

`memory.md` doit contenir :

- décisions confirmées;
- conventions;
- statuts;
- architectures;
- choix d’outils;
- comportements non négociables.

---

# 93. Reporting de progression

Rapport recommandé à la fin de chaque sprint :

```text
Objectif
Travail terminé
Tests
Captures
Migrations
Risques
Décisions
Éléments reportés
Prochaine étape
```

---

# 94. Métriques projet

Mesurer :

- sprints terminés;
- bugs;
- tests;
- erreurs production;
- performance;
- modules migrés;
- usage V2;
- retours legacy;
- incidents Operator;
- écarts financiers;
- conflits sync.

---

# 95. Métriques UX

Mesurer :

- temps d’action;
- abandon formulaire;
- erreurs;
- usage Mobile;
- usage Search;
- filtres;
- support;
- satisfaction interne.

---

# 96. Métriques opérationnelles

Mesurer :

- Missions créées;
- Missions prêtes;
- Problems;
- Operators hors ligne;
- sync;
- durée;
- erreurs de géométrie;
- conflits d’affectation.

---

# 97. Métriques de migration

Mesurer :

- lignes migrées;
- warnings;
- erreurs;
- écarts;
- documents;
- géométries;
- statuts inconnus;
- utilisateurs sur V2;
- feature flags actifs.

---

# 98. Hors périmètre de la première feuille de route

Ne pas inclure comme exigence de lancement :

- IA de dispatch;
- optimisation avancée;
- télémétrie complète;
- paie;
- CCQ;
- inventaire de pièces;
- portail Client complet;
- paiements en ligne;
- comptabilité générale;
- campagnes marketing;
- signature avancée;
- multi-organisations commerciales;
- BI avancée;
- application native administrative.

---

# 99. Évolutions futures possibles

Après stabilisation :

```text
Optimisation automatique de Routes
Prévisions de durée
Rapports avancés
Portail Client
Paiement en ligne
Signature électronique
Renouvellements
Maintenance avancée
Paie
CCQ
Inventaire
Notifications Push
Automatisations
IA opérationnelle
```

---

# 100. Décisions à confirmer avant Sprint 001

- nom final du dépôt;
- gestionnaire de paquets;
- versions;
- hébergement;
- CI;
- environnements;
- feature flags;
- monitoring;
- i18n;
- shared contracts;
- stratégie de base;
- stratégie Storage;
- premier module pilote;
- calendrier;
- rôles pilotes.

---

# 101. Règles non négociables

Ne jamais commencer les modules sans fondation.

Ne jamais multiplier les écrans avant validation du Master UI.

Ne jamais basculer les Missions sans test Operator réel.

Ne jamais basculer la Finance avec des soldes non comparés.

Ne jamais retirer `reca-app` avant la phase lecture seule.

Ne jamais modifier `reca-operateur` sans contrat versionné.

Ne jamais ignorer un écart de migration.

Ne jamais considérer un sprint terminé sans tests et documentation.

Ne jamais ajouter une décision durable uniquement dans le code.

Ne jamais faire une migration big bang.

Ne jamais déployer une modification critique avant une tempête.

Ne jamais laisser un feature flag temporaire devenir permanent.

---

# 102. Diagramme général de la feuille de route

```text
Documentation
      ↓
Inventaire
      ↓
Décisions techniques
      ↓
Fondation
      ↓
Master UI
      ↓
Auth et sécurité
      ↓
Clients et commercial
      ↓
Contracts et mesure
      ↓
Resources
      ↓
Routes et Missions
      ↓
Operations Center
      ↓
Operator integration
      ↓
Finance
      ↓
Search et History
      ↓
Migration
      ↓
Pilote
      ↓
Production
      ↓
Legacy read-only
      ↓
Retrait legacy
```

---

# 103. Résumé officiel

La feuille de route de RECA App V2 commence par la documentation, l’inventaire réel et les décisions techniques.

Le dépôt est ensuite initialisé avec une architecture propre, des tests, des environnements et un protocole mémoire.

Le Design System et les six Master UI sont validés avant de multiplier les pages.

Les modules sont construits selon leurs dépendances :

```text
Clients
Leads
Quotes
Contracts
Mesure
Employees
Equipment
Routes
Missions
Operator
Finance
Search
Notifications
History
```

Les Missions, la synchronisation Operator, les permissions et la Finance sont traitées comme des domaines critiques.

La migration est progressive, additive, observable et réversible.

Les modules passent par un pilote avant la production.

`reca-app` passe ensuite en lecture seule avant son retrait contrôlé.

L’objectif est de livrer un véritable centre des opérations RECA, fiable sur le terrain, sécuritaire pour les données et durable pour les prochaines années.
