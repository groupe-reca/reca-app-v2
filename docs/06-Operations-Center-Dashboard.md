# 06-Operations-Center-Dashboard.md

# RECA
## Centre des opérations et tableau de bord

Version : 1.0  
Projet : RECA App V2  
Dépôt recommandé : `reca-app-v2`  
Statut : Spécification officielle du Centre des opérations  

---

# 1. Objectif du document

Ce document définit le rôle, la structure, les données, les comportements et les règles du Centre des opérations de RECA App V2.

Le Centre des opérations représente :

- la page d’accueil principale;
- la vue quotidienne de supervision;
- la synthèse opérationnelle;
- le point de départ des actions urgentes;
- la vue consolidée des Missions;
- la vue consolidée des Routes;
- la vue consolidée des opérateurs et équipements;
- la vue consolidée des problèmes;
- la vue consolidée de la synchronisation avec RECA Opérateur;
- la principale interface de décision pendant la saison.

Ce document définit :

- les objectifs du Dashboard;
- les utilisateurs visés;
- les blocs d’information;
- les priorités visuelles;
- les projections de données;
- les actions rapides;
- les alertes;
- les états;
- les comportements Desktop, Tablette et Mobile;
- les règles de fraîcheur;
- les permissions;
- les tests;
- les critères de réussite.

---

# 2. Vision

Le Dashboard ne doit pas être une collection de statistiques générales.

Il doit répondre immédiatement à trois questions :

```text
Qu’est-ce qui se passe maintenant ?
Qu’est-ce qui demande mon attention ?
Quelle est la prochaine action ?
```

Le Dashboard doit fonctionner comme un véritable centre de commandement.

Il ne doit pas être conçu comme :

- une page d’accueil décorative;
- un rapport mensuel;
- une liste de liens;
- une série de grandes cartes chiffrées;
- une copie des modules;
- une page commerciale générique.

---

# 3. Rôle du Centre des opérations

Le Centre des opérations doit permettre de :

- comprendre la journée en cours;
- préparer les Missions;
- surveiller les Missions actives;
- identifier les blocages;
- suivre les problèmes;
- voir les opérateurs assignés;
- voir les équipements assignés;
- surveiller les synchronisations;
- accéder rapidement aux entités importantes;
- intervenir avant qu’un problème affecte les Clients;
- consulter les activités récentes;
- comparer la progression prévue et réelle.

---

# 4. Position dans l’application

Route recommandée :

```text
/operations
```

Alias possible :

```text
/dashboard
```

La route officielle doit demeurer :

```text
/operations
```

Le nom affiché dans la navigation :

```text
Aujourd’hui
```

Le titre de page :

```text
Centre des opérations
```

---

# 5. Utilisateurs principaux

## 5.1 Administrator

Voit :

- l’ensemble des opérations;
- les alertes système;
- les problèmes;
- les finances nécessitant une attention;
- les modules;
- les erreurs de synchronisation;
- les actions administratives.

## 5.2 Manager

Voit :

- l’état général;
- les Missions;
- la performance;
- les problèmes;
- les ressources;
- les statistiques;
- l’activité.

## 5.3 Dispatcher

Voit en priorité :

- Missions à préparer;
- Missions prêtes;
- Missions actives;
- opérateurs;
- équipements;
- problèmes;
- Routes;
- synchronisation;
- actions de répartition.

## 5.4 Sales Representative

Voit une version adaptée :

- Leads à traiter;
- Soumissions;
- Clients;
- Contrats incomplets;
- rappels;
- activité commerciale.

Les opérations peuvent apparaître en lecture limitée selon permission.

## 5.5 Accounting

Voit une version adaptée :

- Factures à émettre;
- Factures en retard;
- Paiements récents;
- soldes;
- Clients nécessitant une attention financière.

## 5.6 Operator

L’Operator utilise principalement RECA Opérateur.

RECA App V2 peut afficher une page simplifiée :

```text
Ma mission
```

Le Dashboard administratif complet ne lui est pas nécessaire.

---

# 6. Dashboard personnalisé par rôle

Le Dashboard utilise une base commune.

Les blocs visibles et leur ordre peuvent varier selon :

- permissions;
- rôle;
- modules actifs;
- saison;
- préférences;
- taille d’écran.

Exemple Dispatcher :

```text
Missions
Problèmes
Carte
Opérateurs
Équipements
Synchronisation
```

Exemple Sales :

```text
Rappels
Leads
Soumissions
Contrats incomplets
Activité commerciale
```

Exemple Accounting :

```text
Factures en retard
Paiements récents
Échéances
Clients à contacter
```

---

# 7. Principe de priorité

L’ordre d’affichage doit suivre l’urgence opérationnelle.

Ordre général recommandé :

```text
1. Problème critique
2. Mission active en difficulté
3. Mission à préparer
4. Ressource manquante
5. Synchronisation en erreur
6. Travail normal en cours
7. Activité récente
8. Statistiques secondaires
```

---

# 8. En-tête principal

Structure recommandée :

```text
Bonjour Gabriel
Mardi 5 août 2026 · Opérations du jour
```

Éléments :

- salutation;
- nom;
- date locale;
- statut global;
- dernière actualisation;
- action principale selon le rôle.

Exemple Dispatcher :

```text
[Créer une mission]
```

Exemple Sales :

```text
[Nouveau lead]
```

---

# 9. Statut global des opérations

Le Dashboard doit afficher un résumé global.

Exemple :

```text
OPÉRATIONS NORMALES
Toutes les missions actives progressent normalement.
```

Ou :

```text
ATTENTION REQUISE
2 problèmes ouverts · 1 mission sans équipement
```

Ou :

```text
INCIDENT CRITIQUE
Synchronisation interrompue pour 3 opérateurs
```

Le statut global ne doit pas être basé sur une seule statistique.

---

# 10. Niveaux du statut global

```text
NORMAL
ATTENTION
CRITICAL
OFFLINE
UNKNOWN
```

## NORMAL

- aucun problème critique;
- progression normale;
- synchronisation récente.

## ATTENTION

- problème non bloquant;
- ressource manquante;
- retard;
- synchronisation partielle.

## CRITICAL

- Mission bloquée;
- opérateur sans accès;
- problème de sécurité;
- panne importante;
- absence de données critiques.

## OFFLINE

- Dashboard ne peut pas obtenir l’état actuel.

## UNKNOWN

- état impossible à déterminer.

---

# 11. Résumé des Missions

Le premier bloc opérationnel doit présenter :

```text
Missions à préparer
Missions prêtes
Missions en cours
Missions en pause
Missions terminées
Missions annulées
```

L’affichage principal ne doit pas surcharger avec toutes les catégories.

Résumé recommandé :

```text
2 à préparer
1 prête
3 en cours
1 avec problème
```

---

# 12. Carte Mission active

Chaque Mission active peut être affichée dans une carte opérationnelle compacte.

Contenu :

- numéro;
- Route;
- statut;
- progression;
- opérateur;
- équipement;
- nombre de MissionItems;
- résidences terminées;
- problèmes;
- dernière synchronisation;
- heure de début;
- durée;
- action.

Exemple :

```text
MIS-2026-0009 · Saint-Jérôme
EN COURS

18 / 28 résidences
64 %

Test Opérateur · Kubota FPT3101
Dernière synchronisation : il y a 18 s

[Ouvrir la mission]
```

---

# 13. Progression Mission

La progression doit utiliser :

```text
completed_items / total_actionable_items
```

Exclure selon les règles :

- annulés;
- ignorés;
- contrats suspendus non copiés;
- éléments invalides.

La définition exacte doit être centralisée.

---

# 14. Progression temporelle

Une Mission peut afficher :

```text
Temps écoulé
Temps estimé restant
Avance ou retard
```

Ces estimations doivent être clairement identifiées.

Exemple :

```text
Estimation : 1 h 25 restantes
```

Ne jamais afficher une estimation comme une certitude.

---

# 15. Mission à préparer

Une Mission à préparer doit indiquer ce qui manque.

Exemple :

```text
Mission Saint-Antoine
Prévue à 18 h

Opérateur : manquant
Équipement : Kubota FPT3101
Résidences : 28
Géométries valides : 26 / 28

[Compléter la préparation]
```

---

# 16. MissionReadiness

Projection recommandée :

```ts
type MissionReadiness = {
  missionId: MissionId
  isReady: boolean
  hasOperator: boolean
  hasEquipment: boolean
  hasItems: boolean
  hasValidItems: boolean
  hasValidGeometry: boolean
  hasBlockingProblems: boolean
  missingRequirements: MissionRequirement[]
  warnings: MissionWarning[]
}
```

---

# 17. Bloc « À traiter »

Ce bloc est obligatoire.

Il rassemble les éléments nécessitant une action.

Catégories possibles :

```text
Missions
Routes
Contrats
Clients
Équipements
Factures
Synchronisation
Système
```

Exemples :

```text
Mission sans opérateur
Mission sans équipement
Contrat sans zone
Route vide
Équipement en maintenance assigné
Facture en retard
Synchronisation bloquée
Utilisateur invité non activé
```

---

# 18. AttentionItem

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
  actionLabel?: string
  dueAt?: string
  createdAt: string
}
```

---

# 19. Sévérités

```text
INFO
WARNING
CRITICAL
```

Règle visuelle :

- INFO : bleu ou neutre;
- WARNING : ambre;
- CRITICAL : rouge.

Le rouge ne doit pas être utilisé pour tous les éléments à traiter.

---

# 20. Résolution

Un AttentionItem peut être :

- calculé dynamiquement;
- résolu par une action;
- ignoré;
- reporté;
- fermé automatiquement.

Le système doit distinguer :

```text
résolu
ignoré
expiré
non applicable
```

---

# 21. Problèmes terrain

Le Dashboard doit afficher les problèmes ouverts.

Résumé :

```text
3 problèmes ouverts
1 critique
2 à vérifier
```

Carte problème :

```text
VÉHICULE DANS L’ENTRÉE
MIS-2026-0009 · CTR-000047
Signalé il y a 4 min par Test Opérateur

[Voir] [Résoudre]
```

---

# 22. Priorité des problèmes

Ordre recommandé :

```text
Critical
High
Medium
Low
```

La priorité peut dépendre :

- danger;
- Mission bloquée;
- impact Client;
- équipement;
- délai;
- répétition.

---

# 23. Statuts Problem

```text
OPEN
ACKNOWLEDGED
IN_PROGRESS
RESOLVED
DISMISSED
```

---

# 24. Carte globale des opérations

Le Dashboard Desktop doit pouvoir afficher une carte.

La carte montre :

- Missions actives;
- opérateurs;
- dernières positions connues;
- Routes;
- MissionItems actifs;
- problèmes;
- secteurs;
- équipements lorsque disponible.

---

# 25. Objectif de la carte

La carte doit répondre à :

```text
Où sont les opérations ?
Quelle Mission est active ?
Où se trouve le prochain problème ?
```

Elle ne doit pas devenir une carte décorative.

---

# 26. Symboles cartographiques

Convention recommandée :

```text
Opérateur actif : marqueur vert
Mission en retard : ambre
Problème critique : rouge
Mission prête : bleu
Position périmée : gris
```

---

# 27. Dernière position connue

Chaque position doit afficher sa fraîcheur.

Exemple :

```text
Dernière position : il y a 24 s
```

Si trop ancienne :

```text
Position possiblement périmée
```

---

# 28. Position Operator

Structure conceptuelle :

```ts
type OperatorPositionSummary = {
  employeeId: EmployeeId
  missionId?: MissionId
  latitude: number
  longitude: number
  heading?: number
  speed?: number
  recordedAt: string
  receivedAt: string
  freshness: DataFreshness
}
```

---

# 29. Rétention des positions

Le Dashboard utilise la dernière position connue.

Il ne doit pas nécessiter de conserver toutes les positions indéfiniment.

La politique complète sera définie avec la synchronisation.

---

# 30. Opérateurs

Le Dashboard doit afficher l’état des opérateurs.

Exemples :

```text
Assigné
En mission
En pause
Hors ligne
Mission terminée
Sans mission
```

---

# 31. Carte Operator

Contenu :

- nom;
- statut;
- Mission;
- équipement;
- progression;
- dernière synchronisation;
- dernier problème;
- action.

Exemple :

```text
Test Opérateur
EN MISSION

MIS-2026-0009
Kubota FPT3101
18 / 28

Synchronisé il y a 18 s
```

---

# 32. Équipements

Le Dashboard doit résumer :

```text
Disponibles
Assignés
En utilisation
En maintenance
Hors service
```

Un équipement problématique assigné à une Mission doit remonter dans « À traiter ».

---

# 33. Disponibilité Equipment

Projection conceptuelle :

```ts
type EquipmentAvailability = {
  equipmentId: EquipmentId
  status: EquipmentStatus
  assignedMissionId?: MissionId
  assignedEmployeeId?: EmployeeId
  hasConflict: boolean
  warnings: string[]
}
```

---

# 34. Synchronisation

Le Centre des opérations doit montrer la santé de RECA Opérateur.

Résumé :

```text
5 opérateurs synchronisés
1 connexion instable
0 opération bloquée
```

---

# 35. Sync Health

Structure conceptuelle :

```ts
type OperatorSyncHealth = {
  employeeId: EmployeeId
  deviceId?: DeviceId
  missionId?: MissionId
  lastSeenAt?: string
  lastSyncAt?: string
  pendingOperations?: number
  failedOperations?: number
  appVersion?: string
  status: SyncHealthStatus
}
```

---

# 36. SyncHealthStatus

```text
HEALTHY
DEGRADED
OFFLINE
BLOCKED
UNKNOWN
```

---

# 37. Règles de fraîcheur

Exemple initial à confirmer :

```text
HEALTHY
Dernière synchronisation < 2 minutes

DEGRADED
2 à 5 minutes

OFFLINE
> 5 minutes

BLOCKED
Opérations en erreur ou conflit
```

Les seuils doivent être configurables.

---

# 38. Activité récente

Le Dashboard doit afficher une timeline courte.

Exemples :

```text
Mission MIS-2026-0009 démarrée
Opérateur assigné à Route Saint-Antoine
Problème signalé
Paiement enregistré
Contrat activé
Route modifiée
```

---

# 39. Limite de l’activité

Afficher seulement les événements utiles.

Éviter :

- chaque déplacement GPS;
- chaque rafraîchissement;
- événements techniques trop fréquents;
- mutations internes sans signification utilisateur.

---

# 40. RecentActivityItem

```ts
type RecentActivityItem = {
  id: EventId
  type: string
  title: string
  description?: string
  actorName?: string
  entityType: string
  entityId: string
  occurredAt: string
  source: EventSource
}
```

---

# 41. Raccourcis

Le Dashboard peut proposer :

```text
Créer une mission
Créer une Route
Nouveau Client
Nouveau Contrat
Nouvelle Facture
Enregistrer un Paiement
```

Les raccourcis sont filtrés par permissions.

---

# 42. Command Palette

Le Dashboard peut ouvrir la Command Palette.

Raccourci recommandé :

```text
⌘ K
Ctrl K
```

---

# 43. Recherche globale

La recherche doit être accessible depuis le Dashboard.

Placeholder :

```text
Rechercher un client, une adresse, un contrat, une mission…
```

---

# 44. Statistiques secondaires

Statistiques possibles :

- Contrats actifs;
- Clients actifs;
- surface totale sous contrat;
- Factures en retard;
- temps moyen par résidence;
- problèmes par Mission;
- durée moyenne des Missions;
- équipements disponibles.

Elles ne doivent pas dominer l’écran.

---

# 45. Statistiques quotidiennes

Exemple :

```text
Résidences terminées aujourd’hui
Temps total d’intervention
Temps total de déplacement
Problèmes ouverts
Missions terminées
```

---

# 46. Indicateurs comparatifs

Une comparaison peut afficher :

```text
Aujourd’hui vs dernière Mission comparable
Cette semaine vs semaine précédente
Route actuelle vs moyenne
```

Seulement si les données sont fiables.

---

# 47. Saison

Le Dashboard doit connaître la saison active.

Exemple :

```text
Saison 2026–2027
```

La saison influence :

- Missions;
- Contrats;
- statistiques;
- Routes;
- alertes;
- rapports.

---

# 48. Mode hors saison

Hors saison, le Dashboard peut privilégier :

- Contrats à renouveler;
- préparation;
- équipements en maintenance;
- ventes;
- facturation;
- configuration des Routes.

---

# 49. Mode tempête

Pendant une opération importante, le Dashboard peut basculer dans un mode plus opérationnel.

Exemple :

```text
MODE TEMPÊTE
```

Priorités :

- Missions;
- problèmes;
- opérateurs;
- synchronisation;
- progression;
- carte.

Les statistiques commerciales deviennent secondaires.

---

# 50. Déclenchement mode tempête

Options :

- activation manuelle;
- Mission active;
- événement météo futur;
- configuration de l’organisation.

La V1 peut utiliser :

```text
Une Mission active = mode opérationnel renforcé
```

---

# 51. Desktop — structure recommandée

```text
┌────────────────────────────────────────────────────────────┐
│ En-tête · Date · Statut global · Action principale        │
├────────────────────────────────────────────────────────────┤
│ Résumé Missions / Problèmes / Ressources / Synchronisation │
├──────────────────────────────┬─────────────────────────────┤
│ Missions actives             │ À traiter                   │
│                              │                             │
├──────────────────────────────┼─────────────────────────────┤
│ Carte des opérations         │ Problèmes ouverts           │
│                              │ Opérateurs                  │
├──────────────────────────────┴─────────────────────────────┤
│ Activité récente                                           │
└────────────────────────────────────────────────────────────┘
```

---

# 52. Largeur Desktop

Utiliser toute la largeur utile.

Éviter une colonne centrale trop étroite laissant de grandes zones vides.

Le contenu doit demeurer lisible sur :

```text
1280 px
1440 px
1920 px
```

---

# 53. Scroll Desktop

Le shell principal peut être fixe.

Le Dashboard peut défiler verticalement.

Éviter :

- double scroll;
- cartes internes avec scroll inutile;
- panneaux tronqués;
- zone de carte instable.

---

# 54. Panneau collant

Un panneau « À traiter » peut devenir collant sur grand écran.

Il ne doit pas masquer le contenu.

---

# 55. Tablette

Structure possible :

```text
Résumé compact
Missions
À traiter
Carte
Problèmes
Ressources
Activité
```

La carte doit conserver une hauteur utile.

---

# 56. Mobile — objectif

Le mobile doit afficher l’essentiel sans obliger l’utilisateur à parcourir de grandes cartes vides.

Ordre recommandé :

```text
Statut global
Actions urgentes
Mission active
À traiter
Problèmes
Ressources
Activité
```

---

# 57. Mobile — en-tête

Exemple :

```text
Aujourd’hui
Mardi 5 août
```

Action principale sous forme :

```text
+
```

ou bouton compact selon contexte.

---

# 58. Mobile — résumé compact

Au lieu de quatre grandes cartes verticales :

```text
[3 en cours] [2 à préparer]
[1 problème] [1 hors ligne]
```

Utiliser une grille compacte.

---

# 59. Mobile — Mission active

La première Mission active doit être visible immédiatement.

Contenu :

- nom;
- progression;
- opérateur;
- problème;
- synchronisation;
- action.

---

# 60. Mobile — carte

La carte peut être :

- un aperçu compact;
- une carte plein écran ouverte au toucher;
- un onglet;
- un bottom sheet.

Elle ne doit pas occuper inutilement plusieurs écrans verticaux.

---

# 61. Mobile — actions urgentes

Les actions urgentes peuvent utiliser une liste compacte.

Exemple :

```text
Mission sans équipement
Route Saint-Antoine
[Assigner]
```

---

# 62. Mobile — navigation

Navigation recommandée pour Dispatcher :

```text
Accueil
Missions
Routes
Clients
Menu
```

Le Dashboard doit respecter les règles de `02-Information-Architecture.md`.

---

# 63. Design visuel

Le Dashboard utilise :

- surfaces claires;
- cartes limitées;
- espaces fonctionnels;
- hiérarchie forte;
- couleurs fonctionnelles;
- rouge RECA avec modération;
- typographie Manrope;
- icônes simples.

---

# 64. Utilisation du rouge

Le rouge RECA sert à :

- action primaire;
- marque;
- critique;
- destructif;
- problème grave.

Il ne sert pas à colorer toutes les statistiques.

---

# 65. Densité

Le Dashboard doit être plus dense que les anciennes pages administratives.

Objectif :

```text
Voir l’état général sans parcourir plusieurs écrans.
```

---

# 66. Cartes

Une carte représente une section réelle.

Éviter :

```text
Carte
  └── Carte
       └── Carte
```

À l’intérieur d’une carte, utiliser :

- rangées;
- séparateurs;
- badges;
- mini-grilles;
- listes.

---

# 67. États de chargement

Chaque bloc peut avoir un skeleton indépendant.

Le Dashboard ne doit pas rester entièrement bloqué si une projection secondaire échoue.

---

# 68. Chargement initial

Ordre recommandé :

```text
1. Shell
2. En-tête
3. Statut global
4. Missions
5. À traiter
6. Carte
7. Problèmes
8. Activité
```

---

# 69. Erreur partielle

Exemple :

```text
Impossible de charger la carte.
Les missions et problèmes demeurent disponibles.
```

---

# 70. Erreur globale

Exemple :

```text
Impossible de charger le Centre des opérations.
[Réessayer]
```

Afficher aussi :

- dernière donnée connue si disponible;
- horodatage;
- statut hors ligne.

---

# 71. Donnée périmée

Une carte peut afficher :

```text
Données mises à jour il y a 8 minutes
```

avec ton ambre.

---

# 72. Absence de Missions

État vide :

```text
Aucune mission prévue aujourd’hui

Vous pouvez créer une mission à partir d’une Route active.

[Créer une mission]
```

---

# 73. Absence de problèmes

État positif compact :

```text
Aucun problème ouvert
```

Ne pas utiliser une grande carte vide.

---

# 74. Absence d’opérateurs

```text
Aucun opérateur actif
```

Si une Mission existe :

```text
1 Mission attend une assignation
[Assigner un opérateur]
```

---

# 75. Permissions du Dashboard

Permissions possibles :

```text
dashboard.read
dashboard.operations.read
dashboard.sales.read
dashboard.finance.read
dashboard.system.read
```

La V1 peut utiliser les permissions des modules sources.

---

# 76. Filtrage serveur

Les projections doivent respecter les permissions côté serveur.

Le Dashboard ne doit pas charger toutes les données puis les masquer côté client.

---

# 77. Projection principale

Nom recommandé :

```text
operations_dashboard
```

ou RPC :

```text
get_operations_dashboard
```

---

# 78. OperationsDashboardProjection

Structure conceptuelle :

```ts
type OperationsDashboardProjection = {
  generatedAt: string
  organizationId: OrganizationId
  date: string
  timezone: string

  globalStatus: OperationsGlobalStatus
  missionSummary: MissionSummary
  activeMissions: ActiveMissionSummary[]
  readinessItems: MissionReadinessSummary[]
  attentionItems: AttentionItem[]
  openProblems: MissionProblemSummary[]
  operatorStatuses: OperatorStatusSummary[]
  equipmentStatuses: EquipmentStatusSummary[]
  syncHealth: SyncHealthSummary
  recentActivity: RecentActivityItem[]
}
```

---

# 79. MissionSummary

```ts
type MissionSummary = {
  planned: number
  ready: number
  inProgress: number
  paused: number
  completed: number
  cancelled: number
  withProblems: number
}
```

---

# 80. GlobalStatus

```ts
type OperationsGlobalStatus = {
  level: 'NORMAL' | 'ATTENTION' | 'CRITICAL' | 'OFFLINE' | 'UNKNOWN'
  title: string
  message?: string
  reasons: OperationsStatusReason[]
}
```

---

# 81. Projection séparée ou unique

Options :

## Projection unique

Avantages :

- cohérence temporelle;
- moins de requêtes;
- chargement simple.

Risques :

- payload plus gros;
- blocage global;
- complexité SQL.

## Projections séparées

Avantages :

- chargement progressif;
- erreurs isolées;
- cache indépendant.

Risques :

- incohérence temporelle;
- plusieurs requêtes;
- orchestration plus complexe.

Direction recommandée :

```text
Projection principale légère
+ projections secondaires ciblées
```

---

# 82. Requêtes recommandées

```text
get_operations_summary
get_active_missions
get_attention_items
get_open_problems
get_operator_sync_health
get_recent_activity
```

La combinaison finale sera décidée lors de l’implémentation.

---

# 83. Cache

Fréquences possibles :

```text
Résumé : 15–30 secondes
Missions actives : 5–15 secondes
Problèmes : temps réel + refetch
Synchronisation : 10–30 secondes
Activité : 30–60 secondes
Statistiques secondaires : plusieurs minutes
```

---

# 84. Realtime

Abonnements possibles :

- missions;
- mission_items;
- mission_problems;
- sync operations;
- assignments;
- domain events.

Flux :

```text
Realtime event
      ↓
Identifier le bloc
      ↓
Invalider la query
      ↓
Relire la projection autoritative
```

---

# 85. Polling de secours

Si Realtime est indisponible :

- polling contrôlé;
- indicateur de mode dégradé;
- fréquence réduite en arrière-plan;
- retour automatique au direct.

---

# 86. Visibilité navigateur

Lorsque l’onglet est caché :

- réduire le polling;
- conserver les abonnements essentiels;
- rafraîchir au retour;
- afficher le temps de dernière mise à jour.

---

# 87. Performance

Objectifs initiaux :

```text
Shell visible < 1 s
Résumé principal < 2 s
Interactions immédiates
Aucune requête répétitive inutile
Carte chargée de manière différée
```

Les objectifs exacts seront mesurés sur l’environnement réel.

---

# 88. Carte lazy-loaded

La librairie cartographique doit être chargée après les blocs essentiels.

Le Dashboard reste utile si la carte est lente.

---

# 89. Pagination

Les listes longues du Dashboard sont limitées.

Exemples :

```text
5 Missions actives
5 problèmes
8 éléments à traiter
10 activités
```

Un lien ouvre le module complet.

---

# 90. Tri

## Missions actives

```text
Critique
Avec problème
En retard
Progression normale
```

## À traiter

```text
Sévérité
Échéance
Ancienneté
```

## Problèmes

```text
Critique
Ouvert le plus ancien
```

---

# 91. Filtres Dashboard

Filtres possibles :

- date;
- secteur;
- Route;
- opérateur;
- statut;
- type de problème.

La V1 doit rester simple.

Filtre initial recommandé :

```text
Aujourd’hui
```

---

# 92. Sélecteur de date

Permettre :

```text
Aujourd’hui
Hier
Demain
Date spécifique
```

Une vue historique ne doit pas afficher les positions « en direct ».

---

# 93. Vue historique

Pour une date passée :

- Missions;
- progression finale;
- problèmes;
- activité;
- statistiques;
- aucun statut temps réel.

---

# 94. Vue future

Pour une date future :

- Missions planifiées;
- préparation;
- opérateurs;
- équipements;
- conflits;
- contrats incomplets;
- aucun suivi terrain.

---

# 95. Conflits d’assignation

Le Dashboard doit identifier :

```text
Même opérateur sur deux Missions
Même équipement sur deux Missions
Équipement indisponible
Employé inactif
```

---

# 96. Conflit de Route

Exemples :

- contrat dupliqué;
- ordre invalide;
- contrat suspendu;
- adresse sans coordonnées;
- géométrie manquante;
- Route vide.

---

# 97. Contrats incomplets

Le Dashboard peut afficher :

```text
2 Contrats actifs sans zone
1 Contrat sans coordonnées GPS
```

Ces informations doivent provenir de `ContractReadiness`.

---

# 98. Finances à traiter

Selon permission :

```text
Factures en retard
Factures sans paiement
Paiements récents
Échéances aujourd’hui
```

Ces données doivent rester secondaires dans le Dashboard opérationnel.

---

# 99. Système

Selon permission :

- utilisateurs invités;
- intégration en erreur;
- migration requise;
- configuration manquante;
- version RECA Opérateur obsolète;
- secret externe manquant.

---

# 100. Version RECA Opérateur

Le Dashboard peut signaler :

```text
1 appareil utilise une version non supportée
```

La compatibilité est définie dans le contrat d’intégration.

---

# 101. Actions rapides Mission

Actions possibles :

```text
Ouvrir
Assigner
Démarrer
Mettre en pause
Reprendre
Fermer
Annuler
```

Le Dashboard ne doit pas exposer toutes les actions en permanence.

Une seule action contextuelle principale.

Les autres dans un menu.

---

# 102. Actions destructives

Annuler une Mission doit être dans :

```text
Menu ⋮
```

avec confirmation.

---

# 103. Action depuis AttentionItem

Exemple :

```text
Mission sans équipement
[Assigner]
```

L’action ouvre :

- side panel;
- modal;
- route dédiée;
- fiche Mission.

La solution doit préserver le contexte.

---

# 104. Panneau latéral Desktop

Certaines actions rapides peuvent utiliser un panneau latéral.

Exemples :

- assigner opérateur;
- assigner équipement;
- résoudre problème;
- voir détails.

Ne pas utiliser un panneau pour les formulaires complexes.

---

# 105. Bottom Sheet Mobile

Sur mobile :

- problème;
- assignation;
- détails Mission;
- carte;

peuvent utiliser un bottom sheet.

---

# 106. Notifications navigateur

Hors périmètre initial.

Une future version peut notifier :

- problème critique;
- Mission bloquée;
- synchronisation perdue;
- équipement en panne.

---

# 107. Sons

Aucun son dans la V1.

Une alerte sonore future doit être :

- configurable;
- rare;
- réservée au critique;
- accessible.

---

# 108. Accessibilité

Le Dashboard doit :

- utiliser des titres hiérarchiques;
- annoncer les alertes;
- être navigable au clavier;
- fournir des libellés;
- ne pas dépendre uniquement des couleurs;
- conserver un contraste suffisant;
- permettre l’agrandissement;
- fournir une alternative textuelle à la carte.

---

# 109. Alternative à la carte

La liste des Missions et problèmes doit contenir les mêmes informations essentielles.

Un utilisateur ne doit pas dépendre de la carte pour comprendre l’état.

---

# 110. Touch targets

Sur mobile :

```text
44 × 44 px minimum
```

---

# 111. Responsive

Le Dashboard utilise des composants spécialisés par taille lorsque nécessaire.

Il ne doit pas simplement passer :

```text
grid-cols-4
```

à :

```text
grid-cols-1
```

---

# 112. Personnalisation future

Possibilités :

- réordonner les blocs;
- épingler;
- masquer;
- préférences par rôle;
- densité;
- carte ouverte ou fermée.

Hors périmètre V1, sauf ordre par rôle.

---

# 113. Export Dashboard

Hors périmètre initial.

Les rapports doivent être construits dans un module dédié.

---

# 114. Données sensibles

Le Dashboard ne doit pas afficher inutilement :

- courriels complets;
- téléphones complets;
- adresses de tous les Clients;
- montants financiers à un Operator;
- détails RH;
- GPS historique complet.

---

# 115. Sécurité de la carte

Les données cartographiques doivent être filtrées selon les permissions.

Un Sales Representative ne doit pas nécessairement voir les positions en direct.

---

# 116. Observabilité

Mesurer :

- temps de chargement;
- erreur par widget;
- échec Realtime;
- données périmées;
- RPC lente;
- carte indisponible;
- action urgente non traitée.

---

# 117. Logs

Événements possibles :

```text
operations_dashboard_loaded
operations_dashboard_failed
attention_item_opened
mission_card_opened
problem_resolved_from_dashboard
```

Ne pas journaliser les données personnelles complètes.

---

# 118. Analytics produit

Mesurer :

- blocs utilisés;
- actions principales;
- temps avant ouverture d’une Mission;
- taux de résolution depuis « À traiter »;
- fréquence d’utilisation de la carte;
- erreurs de navigation.

---

# 119. Tests unitaires

Tester :

- GlobalStatus;
- MissionSummary;
- MissionReadiness;
- AttentionItem sorting;
- DataFreshness;
- permission filtering;
- assignment conflict detection;
- sync health classification.

---

# 120. Tests composants

Tester :

- états de chargement;
- erreurs partielles;
- état vide;
- Mission active;
- problème critique;
- données périmées;
- rôle différent;
- action cachée;
- Mobile compact.

---

# 121. Tests d’intégration

Tester :

- projections;
- RPC;
- Realtime;
- permissions;
- RLS;
- rafraîchissement;
- données multi-organisations;
- compatibilité RECA Opérateur.

---

# 122. Tests E2E

Scénarios :

```text
Dispatcher ouvre le Dashboard
      ↓
voit une Mission à préparer
      ↓
assigne opérateur et équipement
      ↓
Mission devient prête
```

```text
Operator signale un problème
      ↓
Dashboard reçoit l’événement
      ↓
problème apparaît
      ↓
Dispatcher le résout
```

```text
Synchronisation interrompue
      ↓
statut passe DEGRADED
      ↓
Dashboard affiche l’avertissement
```

```text
Mission terminée
      ↓
progression = 100 %
      ↓
Mission quitte les actives
      ↓
activité récente mise à jour
```

---

# 123. Tests Mobile

Tester aux largeurs :

```text
375 px
390 px
414 px
```

Vérifier :

- résumé compact;
- Mission active visible rapidement;
- action urgente accessible;
- aucune grande carte vide;
- aucun double scroll;
- navigation inférieure;
- safe areas.

---

# 124. Tests Tablette

Tester :

```text
768 px
834 px
1024 px
```

---

# 125. Tests Desktop

Tester :

```text
1280 px
1440 px
1920 px
```

---

# 126. États de démonstration

Prévoir des fixtures :

```text
Journée calme
Journée avec 1 Mission
Plusieurs Missions
Problème critique
Synchronisation hors ligne
Aucune Mission
Hors saison
Vue Accounting
Vue Sales
```

---

# 127. Master UI

Le Centre des opérations doit être le premier Master UI de RECA App V2.

Versions minimales :

```text
Desktop — journée active
Desktop — problème critique
Mobile — journée active
Mobile — Mission à préparer
```

---

# 128. Validation visuelle

Avant implémentation :

- valider hiérarchie;
- valider densité;
- valider carte;
- valider résumé;
- valider « À traiter »;
- valider actions;
- valider états;
- valider mobile.

---

# 129. Ce qui doit être conservé de l’ancienne application

Conserver comme référence :

- données existantes;
- entités;
- permissions validées;
- modules;
- Missions;
- Routes;
- Factures;
- Clients;
- contrats;
- composants utiles;
- comportements métier confirmés.

Ne pas copier automatiquement :

- Dashboard actuel;
- grandes cartes statistiques;
- espaces vides;
- ordre historique des modules;
- répétition des mêmes layouts.

---

# 130. Hors périmètre initial

Ne pas bloquer la V1 avec :

- météo avancée;
- radar météo;
- prévisions automatiques;
- optimisation IA;
- télémétrie véhicule;
- carte 3D;
- conversation temps réel;
- rapports exécutifs complexes;
- personnalisation complète des widgets;
- notifications push;
- sons d’alerte;
- prédictions de fin précises.

---

# 131. Roadmap d’implémentation suggérée

## Phase 1 — Projections et modèle

- MissionSummary;
- AttentionItem;
- ProblemSummary;
- OperatorStatus;
- SyncHealth;
- GlobalStatus.

## Phase 2 — Master UI statique

- Desktop;
- Mobile;
- données simulées;
- états.

## Phase 3 — Données réelles principales

- Missions;
- problèmes;
- ressources;
- activité.

## Phase 4 — Carte

- positions;
- problèmes;
- Missions;
- fraîcheur.

## Phase 5 — Realtime

- Mission;
- Problem;
- SyncHealth.

## Phase 6 — Personnalisation par rôle

- Dispatcher;
- Manager;
- Sales;
- Accounting.

---

# 132. Définition de terminé

Le Centre des opérations est prêt lorsque :

- les données principales sont réelles;
- les permissions fonctionnent;
- les Missions actives sont visibles;
- les Missions à préparer sont identifiées;
- les problèmes remontent;
- les opérateurs sont visibles;
- les équipements sont visibles;
- la synchronisation est visible;
- les actions urgentes sont accessibles;
- le mobile est compact;
- la carte est utile;
- les données périmées sont signalées;
- les tests sont complets;
- la documentation est à jour.

---

# 133. Critères de réussite métier

Le Dashboard est réussi si un Dispatcher peut en moins de 30 secondes :

- comprendre combien de Missions sont actives;
- identifier une Mission bloquée;
- voir quel opérateur est affecté;
- voir quel équipement est utilisé;
- identifier un problème critique;
- savoir si les données sont à jour;
- ouvrir l’action requise.

---

# 134. Critères de réussite visuelle

Le Dashboard doit sembler :

- opérationnel;
- précis;
- dense;
- calme;
- hiérarchisé;
- spécifique à RECA;
- moderne;
- rapide.

Il ne doit pas sembler :

- vide;
- décoratif;
- générique;
- commercial;
- constitué uniquement de statistiques.

---

# 135. Critères de réussite technique

Le Dashboard doit :

- utiliser des projections efficaces;
- respecter les permissions;
- gérer les erreurs partielles;
- fonctionner sans Realtime;
- afficher la fraîcheur;
- charger la carte en différé;
- éviter les requêtes excessives;
- être testable;
- rester compatible avec RECA Opérateur;
- être performant sur mobile.

---

# 136. Règles non négociables

Toujours afficher ce qui demande une attention.

Toujours afficher la fraîcheur des données opérationnelles.

Ne jamais présenter une donnée périmée comme temps réel.

Ne jamais dépendre uniquement de la carte.

Ne jamais afficher toutes les actions au même niveau.

Ne jamais utiliser de grandes cartes statistiques sur mobile pour des données secondaires.

Ne jamais charger des données interdites puis les masquer.

Ne jamais utiliser Realtime comme seule source de vérité.

Ne jamais afficher une estimation comme une certitude.

Ne jamais cacher un problème critique derrière un onglet secondaire.

---

# 137. Décisions à confirmer

Avant l’implémentation finale, confirmer :

- seuils de fraîcheur;
- ordre exact des blocs;
- rôle par défaut du Dashboard;
- présence du mode tempête;
- permissions Manager;
- carte visible par Sales;
- données financières visibles par Manager;
- seuil de retard Mission;
- calcul d’estimation restante;
- statut global exact;
- actions rapides autorisées;
- fréquence de rafraîchissement;
- comportement hors saison.

Les décisions confirmées doivent être ajoutées dans `memory.md`.

---

# 138. Diagramme fonctionnel

```text
Missions
Routes
Problems
Employees
Equipment
Synchronization
Contracts
Invoices
Events
   ↓
Projections opérationnelles
   ↓
Centre des opérations
   ↓
Résumé
À traiter
Carte
Missions
Problèmes
Ressources
Activité
   ↓
Actions
```

---

# 139. Flux Realtime

```text
RECA Opérateur
      ↓
Transition / Problem / Sync
      ↓
Supabase
      ↓
Realtime
      ↓
Invalidation Query
      ↓
Projection autoritative
      ↓
Dashboard actualisé
```

---

# 140. Flux Mission à préparer

```text
Mission planifiée
      ↓
MissionReadiness
      ↓
Exigence manquante
      ↓
AttentionItem
      ↓
Dashboard
      ↓
Action Dispatcher
      ↓
Mission prête
```

---

# 141. Résumé officiel

Le Centre des opérations est la page principale de RECA App V2.

Il ne présente pas seulement des statistiques.

Il présente :

```text
Ce qui se passe
Ce qui bloque
Ce qui doit être fait
```

Les Missions dominent l’expérience pendant la saison.

Les problèmes, opérateurs, équipements et synchronisations sont visibles immédiatement.

La carte complète les listes, mais ne les remplace pas.

Le Dashboard s’adapte aux rôles.

Les données indiquent leur fraîcheur.

Les actions urgentes sont accessibles directement.

Le mobile utilise une densité spécifique.

Le Centre des opérations devient la représentation quotidienne du travail réel de Groupe RECA.
