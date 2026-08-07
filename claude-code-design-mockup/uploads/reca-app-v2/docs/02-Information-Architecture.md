# 02-Information-Architecture.md

# RECA
## Architecture de l’information

Version : 1.0  
Projet : RECA App V2  
Dépôt recommandé : `reca-app-v2`  
Statut : Architecture officielle de navigation et d’organisation de l’information  

---

# 1. Objectif du document

Ce document définit comment l’information est organisée, trouvée, comprise et parcourue dans RECA App V2.

Il couvre notamment :

- la structure générale du produit;
- les groupes de navigation;
- les modules;
- les relations entre les entités;
- les parcours principaux;
- les modèles de pages;
- la recherche globale;
- les breadcrumbs;
- les onglets;
- la navigation Desktop;
- la navigation Mobile;
- le comportement Tablette;
- les règles de création et d’édition;
- la conservation du contexte;
- les états vides, erreurs et chargements;
- les conventions d’URL;
- les règles de hiérarchie de l’information.

Ce document ne définit pas encore :

- l’architecture technique interne;
- les schémas détaillés de données;
- les politiques RLS;
- les responsabilités précises des services;
- les composants React définitifs.

Ces sujets seront couverts dans les documents suivants.

---

# 2. Principe fondamental

L’organisation de l’application doit suivre le travail réel de Groupe RECA.

Elle ne doit pas simplement refléter :

- les tables Supabase;
- l’ordre historique de développement;
- le nom des dossiers techniques;
- les anciens menus;
- une structure CRM générique.

La navigation doit permettre de répondre rapidement à trois questions :

```text
Qu’est-ce qui se passe maintenant ?
Qu’est-ce qui demande mon attention ?
Quelle est la prochaine action ?
```

---

# 3. Modèle mental officiel

Le produit repose sur quatre grands domaines.

```text
OPÉRATIONS
Missions · Routes · Employés · Équipements

CLIENTS ET CONTRATS
Leads · Soumissions · Clients · Contrats · Zones

FINANCES
Factures · Paiements

SYSTÈME
Utilisateurs · Rôles · Paramètres · Historique
```

Le Centre des opérations relie ces domaines.

```text
Centre des opérations
        ↓
Vue consolidée de ce qui se passe aujourd’hui
```

---

# 4. Chaîne métier principale

La chaîne métier officielle est :

```text
Lead
  ↓
Soumission
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
Résidence / MissionItem
  ↓
RECA Opérateur
  ↓
Historique
  ↓
Facturation et statistiques
```

Cette chaîne représente la relation générale entre les entités.

Elle ne signifie pas que chaque utilisateur doit parcourir toutes les étapes dans chaque situation.

---

# 5. Hiérarchie globale du produit

```text
RECA
├── Centre des opérations
│   ├── Aujourd’hui
│   ├── À traiter
│   ├── Activité
│   └── Recherche globale
│
├── Opérations
│   ├── Missions
│   ├── Routes
│   ├── Employés
│   └── Équipements
│
├── Clients et contrats
│   ├── Leads
│   ├── Soumissions
│   ├── Clients
│   └── Contrats
│
├── Finances
│   ├── Factures
│   └── Paiements
│
└── Système
    ├── Paramètres
    ├── Utilisateurs
    ├── Modules
    └── Préférences
```

Les éléments exacts visibles dépendent :

- du rôle;
- des permissions;
- des modules actifs;
- du contexte saisonnier;
- des préférences de l’organisation.

La visibilité d’un lien ne remplace jamais une permission réelle.

---

# 6. Centre des opérations

Le Centre des opérations est le point d’entrée principal de RECA App V2.

Il ne doit pas être un simple tableau de statistiques commerciales.

Il doit regrouper les informations qui nécessitent une décision ou une action.

## 6.1 Sections principales

```text
Aujourd’hui
Missions
Problèmes
Opérateurs
Équipements
Synchronisation
À traiter
Activité récente
```

## 6.2 Questions auxquelles il doit répondre

- Quelles missions sont prévues aujourd’hui?
- Quelles missions sont en cours?
- Quelles missions ne sont pas prêtes?
- Quels opérateurs ne sont pas assignés?
- Quels équipements ne sont pas assignés?
- Où se trouvent les problèmes?
- Quelle progression est réellement connue?
- Quels opérateurs sont hors ligne?
- Quels changements attendent une synchronisation?
- Quels contrats demandent une correction?
- Quelles factures sont en retard?

## 6.3 Navigation depuis le Centre

Chaque élément doit mener directement vers le contexte pertinent.

Exemples :

```text
Mission sans équipement
      ↓
Fiche Mission · section Affectation
```

```text
3 problèmes ouverts
      ↓
Liste des Missions filtrée sur Problèmes
```

```text
2 contrats sans zone
      ↓
Liste Contrats · vue À compléter
```

---

# 7. Centre « À traiter »

Le produit doit posséder une notion transversale d’éléments nécessitant une action.

Cette notion peut être affichée dans le Dashboard et, si le volume le justifie, dans une page dédiée.

Exemples :

- mission sans opérateur;
- mission sans équipement;
- mission non prête hors ligne;
- problème terrain non résolu;
- opérateur non synchronisé;
- contrat sans zone de déneigement;
- contrat incomplet;
- soumission expirée;
- facture en retard;
- paiement à vérifier;
- document manquant;
- conflit de données;
- géométrie à réviser.

Chaque élément doit contenir :

- une priorité;
- une entité;
- une cause;
- une date;
- une action recommandée;
- un lien direct.

---

# 8. Navigation Desktop

## 8.1 Structure générale

Le Desktop utilise une navigation persistante.

```text
Sidebar
      │
      ├── Identité RECA
      ├── Navigation principale
      ├── Contexte saisonnier
      └── Utilisateur

Barre supérieure
      │
      ├── Breadcrumb
      ├── Recherche globale
      ├── Notifications
      └── Actions contextuelles

Contenu principal
```

## 8.2 Sidebar

La sidebar doit :

- rester stable;
- afficher les groupes métier;
- indiquer clairement la section active;
- permettre de réduire les groupes;
- respecter les permissions;
- ne pas utiliser une pagination de menu comme comportement principal;
- permettre un défilement discret si nécessaire;
- afficher l’identité de l’utilisateur en bas.

## 8.3 Ordre recommandé

```text
CENTRE DES OPÉRATIONS
Aujourd’hui

OPÉRATIONS
Missions
Routes
Employés
Équipements

CLIENTS ET CONTRATS
Leads
Soumissions
Clients
Contrats

FINANCES
Factures
Paiements

SYSTÈME
Paramètres
```

## 8.4 Variations saisonnières

Pendant la saison active, le groupe Opérations demeure prioritaire.

Hors saison, une configuration future peut permettre de placer Clients et contrats avant Opérations.

Le changement de saison ne doit pas modifier les URLs ni les permissions.

---

# 9. Navigation Mobile

## 9.1 Principe

Le Mobile possède sa propre architecture de navigation.

Il ne doit pas simplement afficher une sidebar dans un tiroir.

Il utilise :

- un header compact;
- une navigation inférieure;
- un menu complémentaire;
- des actions principales collantes lorsque nécessaire;
- des pages dédiées pour les parcours importants.

## 9.2 Navigation inférieure par défaut

Pour un administrateur ou un répartiteur :

```text
Accueil
Missions
Routes
Clients
Menu
```

## 9.3 Profils recommandés

### Administrateur / Répartiteur

```text
Accueil
Missions
Routes
Clients
Menu
```

### Représentant

```text
Accueil
Leads
Soumissions
Clients
Menu
```

### Comptabilité

```text
Accueil
Factures
Paiements
Clients
Menu
```

L’opérateur utilise principalement RECA Opérateur.

## 9.4 Règles du bouton Retour

Le bouton Retour est affiché sur :

- une fiche détail;
- une page de création;
- un Wizard;
- une sous-page de paramètres;
- un historique complet.

Il n’est pas affiché sur une racine de navigation inférieure.

## 9.5 Menu complémentaire

Le menu complémentaire contient :

- les modules non épinglés;
- les paramètres;
- la recherche;
- l’activité;
- le profil;
- la déconnexion.

---

# 10. Navigation Tablette

La tablette doit être traitée explicitement.

Deux modes sont possibles selon la largeur et le contexte :

```text
Mode Desktop compact
ou
Mode Mobile étendu
```

La décision doit être prise par type de page.

Exemples :

- Dashboard : grille compacte;
- Liste + carte : panneau double;
- Formulaire : deux colonnes;
- Fiche : onglets persistants;
- Wizard cartographique : carte dominante avec panneaux tactiles.

Le projet ne doit pas supposer automatiquement que toute tablette est un Desktop.

---

# 11. Contexte saisonnier

Le déneigement fonctionne par saisons.

RECA App V2 doit posséder un contexte saisonnier explicite.

Exemple :

```text
Saison 2026–2027
```

## 11.1 Éléments affectés

- contrats;
- routes;
- missions;
- statistiques;
- problèmes;
- activités;
- tableaux de bord.

## 11.2 Éléments non limités automatiquement

- clients;
- historique global;
- utilisateurs;
- équipements;
- factures;
- paiements.

## 11.3 Règles

- la saison active doit être visible;
- le changement doit être explicite;
- les filtres doivent indiquer la saison appliquée;
- les liens profonds doivent préserver le contexte lorsque pertinent;
- une donnée historique ne doit jamais disparaître sans indication.

---

# 12. Recherche globale

## 12.1 Objectif

La recherche globale permet de trouver une information sans connaître son module.

Raccourci recommandé :

```text
Ctrl + K
Cmd + K
```

## 12.2 Champs recherchables

- nom de client;
- entreprise;
- adresse;
- téléphone;
- courriel;
- numéro de contrat;
- numéro de soumission;
- numéro de facture;
- mission;
- route;
- opérateur;
- employé;
- équipement;
- plaque ou identifiant interne;
- problème.

## 12.3 Résultats regroupés

```text
Clients
Contrats
Missions
Routes
Factures
Employés
Équipements
```

Chaque résultat doit afficher :

- le type;
- le nom ou numéro;
- le statut;
- une information secondaire;
- le contexte actuel;
- une action d’ouverture.

## 12.4 Recherche par adresse

Une adresse doit permettre de retrouver :

- le client;
- le contrat;
- la route;
- la mission active;
- les résidences historiques;
- les factures liées.

## 12.5 Actions rapides

La recherche globale peut également proposer :

```text
Créer un client
Créer un contrat
Créer une mission
Ouvrir les problèmes
```

---

# 13. Éléments récents et favoris

Le système doit faciliter le retour vers les éléments fréquemment utilisés.

## 13.1 Récents

Exemples :

- clients consultés;
- contrats consultés;
- missions consultées;
- routes consultées.

## 13.2 Favoris ou éléments épinglés

Éléments potentiellement épinglables :

- route importante;
- mission en cours;
- client prioritaire;
- rapport;
- vue filtrée.

Cette fonction est facultative pour la V1, mais l’architecture ne doit pas l’empêcher.

---

# 14. Breadcrumbs

## 14.1 Objectif

Les breadcrumbs indiquent le contexte réel de navigation.

Ils ne doivent jamais utiliser un titre générique comme :

```text
Détail
Fiche
Page
```

## 14.2 Exemples

```text
Centre des opérations
› Missions
› Mission #9
```

```text
Centre des opérations
› Clients
› CLI-000125 · Thomas Leroux
```

```text
Centre des opérations
› Contrats
› CTR-000056
› Modifier
```

## 14.3 Règles

- le dernier élément n’est pas cliquable;
- les parents sont cliquables;
- les labels utilisent les vraies entités;
- les routes doivent être imbriquées logiquement;
- un identifiant stable est préférable à un titre ambigu;
- les noms très longs sont tronqués visuellement, jamais dans la donnée accessible.

---

# 15. Titres de pages

Le titre doit identifier immédiatement l’entité ou l’action.

Préférer :

```text
Mission #9
Route LaSalle
CTR-000056
Thomas Leroux
Nouvelle mission
Modifier le contrat CTR-000056
```

Éviter :

```text
Détail
Informations
Nouvel élément
Modifier
```

---

# 16. Conventions d’URL

## 16.1 Principes

Les URLs doivent être :

- stables;
- partageables;
- lisibles;
- compatibles avec les liens profonds;
- indépendantes de la langue visuelle lorsque possible;
- prévisibles.

## 16.2 Routes principales recommandées

```text
/dashboard
/attention
/activity

/missions
/missions/new
/missions/:missionId

/routes
/routes/new
/routes/:routeId

/employees
/employees/new
/employees/:employeeId

/equipments
/equipments/new
/equipments/:equipmentId

/leads
/leads/new
/leads/:leadId

/quotes
/quotes/new
/quotes/:quoteId

/clients
/clients/new
/clients/:clientId

/contracts
/contracts/new
/contracts/:contractId

/invoices
/invoices/new
/invoices/:invoiceId

/payments
/payments/:paymentId

/settings
/settings/users
/settings/modules
```

## 16.3 Sous-routes

Les sous-sections importantes peuvent utiliser des URLs dédiées.

Exemple :

```text
/missions/:missionId/residences
/missions/:missionId/problems
/missions/:missionId/history
```

Cependant, un onglet purement visuel n’a pas obligatoirement besoin de modifier l’URL.

La règle doit être uniforme par modèle de page.

---

# 17. Conservation du contexte

L’application doit préserver le contexte lors des retours.

Exemples :

- filtres;
- recherche;
- tri;
- mode compact ou confortable;
- page de pagination;
- position de défilement;
- onglet actif;
- viewport de carte;
- saison;
- élément sélectionné.

Exemple :

```text
Liste Contrats filtrée
      ↓
Ouvrir CTR-000056
      ↓
Retour
      ↓
Même filtre, même position, même vue
```

---

# 18. Modèles de pages officiels

La nouvelle application ne doit pas créer une architecture différente pour chaque écran.

Les pages doivent dériver de modèles officiels.

```text
1. Centre des opérations
2. Liste d’entités
3. Fiche commerciale
4. Fiche opérationnelle
5. Fiche simple
6. Formulaire standard
7. Wizard complexe
8. Paramètres
```

---

# 19. Modèle « Centre des opérations »

Structure générale :

```text
Contexte du jour
      ↓
Indicateurs critiques
      ↓
Missions et progression
      ↓
Carte des opérations
      ↓
À traiter
      ↓
Activité récente
```

Les cartes statistiques doivent être compactes et actionnables.

Le mobile ne doit pas afficher un seul chiffre géant par écran.

---

# 20. Modèle « Liste d’entités »

## 20.1 Structure

```text
Titre + action principale
Résumé compact facultatif
Recherche
Filtres
Tri
Vue / densité
Résultats
Pagination ou chargement progressif
```

## 20.2 Desktop

Deux densités recommandées :

```text
Confortable
Cartes ou rangées détaillées

Compacte
Tableau ou rangées denses
```

## 20.3 Mobile

- cartes compactes;
- information principale en premier;
- carte entièrement cliquable;
- filtres dans une sheet ou barre collante;
- résumé compact;
- action principale facilement accessible.

## 20.4 Statistiques

Une liste n’affiche des statistiques que si elles aident à décider.

Éviter cinq grandes cartes identiques au-dessus de chaque module.

---

# 21. Modèle « Fiche commerciale »

Applicable principalement à :

- Lead;
- Soumission;
- Client;
- Contrat;
- Facture.

## 21.1 Structure

```text
En-tête d’entité
Bandeau de chiffres ou statut
Onglets
Contenu principal
Relations
Historique
```

## 21.2 Actions

- une action primaire;
- actions rapides utiles;
- actions secondaires;
- actions destructives dans le menu `⋮`.

## 21.3 Exemples d’actions primaires

```text
Lead → Créer une soumission
Soumission → Transformer en client
Client → Créer un contrat
Contrat → Envoyer ou générer le document
Facture → Enregistrer un paiement
```

---

# 22. Modèle « Fiche opérationnelle »

Applicable principalement à :

- Mission;
- Route.

## 22.1 Structure

```text
En-tête opérationnel
État et progression
Affectation
Carte
Liste synchronisée
Problèmes
Historique
```

## 22.2 Mission

Informations prioritaires :

- statut;
- progression;
- opérateur;
- équipement;
- résidence active;
- problèmes;
- dernière synchronisation;
- durée;
- heure de début;
- heure de fin.

## 22.3 Route

Informations prioritaires :

- nom;
- couleur;
- opérateur par défaut;
- équipement par défaut;
- nombre de contrats;
- ordre;
- surface;
- dernières missions;
- préparation de mission.

## 22.4 Liste + carte

Pour Routes et Missions, privilégier :

```text
Liste | Carte
```

La sélection doit être synchronisée dans les deux directions.

---

# 23. Modèle « Fiche simple »

Applicable principalement à :

- Employé;
- Équipement;
- Paiement;
- certains paramètres.

Structure recommandée :

```text
En-tête
Informations essentielles
Relations
Notes ou historique
```

Les onglets ne sont ajoutés que si le volume d’information le justifie.

---

# 24. Onglets recommandés par module

Les noms définitifs seront confirmés dans les documents métier.

## 24.1 Client

```text
Informations
Contrats
Factures et paiements
Documents
Historique
```

## 24.2 Contrat

```text
Aperçu
Propriété et zones
Facturation
Documents
Historique
```

## 24.3 Route

```text
Aperçu
Contrats
Missions
Historique
```

La carte peut rester visible dans Aperçu ou dans une disposition Liste + Carte.

## 24.4 Mission

```text
En direct
Résidences
Problèmes
Historique
```

## 24.5 Employé

```text
Informations
Affectations
Missions
Historique
```

## 24.6 Équipement

```text
Informations
Affectations
Missions
Entretien
Historique
```

## 24.7 Facture

```text
Aperçu
Paiements
Historique
```

---

# 25. Règles d’utilisation des onglets

- ne pas ajouter un onglet pour une seule petite carte;
- conserver les onglets importants dans une position stable;
- rendre l’onglet actif évident;
- préserver l’onglet lors du retour;
- afficher un indicateur si un onglet contient un problème;
- éviter plus de six onglets visibles;
- utiliser un menu supplémentaire sur Mobile si nécessaire;
- permettre les liens profonds vers un onglet important.

---

# 26. Création d’entités

## 26.1 Règle officielle

La création principale d’une entité se fait sur une page dédiée.

Exemples :

```text
/clients/new
/contracts/new
/missions/new
/routes/new
```

## 26.2 Exceptions

Une création rapide peut utiliser une modale ou une sheet lorsqu’elle se déroule à l’intérieur d’un autre formulaire et qu’une navigation ferait perdre le contexte.

Exemple :

```text
Créer rapidement un client depuis le Wizard Contrat
```

## 26.3 Actions contextuelles

Les relations d’origine doivent être préservées.

Exemples :

```text
/quotes/new?leadId=...
/clients/new?convertQuoteId=...
/invoices/new?clientId=...
/contracts/new?clientId=...
/missions/new?routeId=...
```

---

# 27. Édition d’entités

## 27.1 Édition simple

Une modale ou un panneau latéral peut être utilisé pour :

- une note;
- un statut;
- une assignation;
- une petite information;
- une action sans navigation complexe.

## 27.2 Édition complexe

Une page dédiée ou un Wizard est requis pour :

- contrat;
- zones de déneigement;
- route complexe;
- mission;
- configuration importante;
- échéancier.

## 27.3 Actions destructives

Les actions suivantes doivent être regroupées dans le menu `⋮` :

- archiver;
- annuler;
- supprimer;
- désactiver;
- réinitialiser.

Elles ne doivent pas rivaliser avec l’action principale.

---

# 28. Wizard complexe

Les parcours complexes doivent utiliser un Wizard lorsque :

- l’ordre des étapes est important;
- certaines données dépendent d’une étape précédente;
- la validation complète serait trop lourde sur une seule page;
- une carte ou un outil spécialisé est requis.

Exemples :

- création de contrat;
- outil de mesure;
- création de mission;
- import ou migration guidée.

Le Wizard doit fournir :

- progression;
- étape actuelle;
- retour;
- sauvegarde de brouillon lorsque pertinent;
- validation visible;
- reprise;
- résumé final.

---

# 29. Relations et navigation croisée

Chaque fiche doit exposer les relations importantes sans obliger l’utilisateur à refaire une recherche.

## 29.1 Lead

```text
Lead
├── Soumission
├── Client converti
└── Activité
```

## 29.2 Client

```text
Client
├── Contrats
├── Factures
├── Paiements
├── Documents
└── Historique
```

## 29.3 Contrat

```text
Contrat
├── Client
├── Zones
├── Route
├── Missions
├── Factures
└── Historique
```

## 29.4 Route

```text
Route
├── Contrats ordonnés
├── Opérateur par défaut
├── Équipement par défaut
├── Missions
└── Historique
```

## 29.5 Mission

```text
Mission
├── Route source
├── Opérateur
├── Équipement
├── Résidences
├── Problèmes
└── Historique
```

---

# 30. Contexte figé et contexte vivant

L’interface doit distinguer les données vivantes des copies historiques.

Exemple :

```text
Contrat actuel
≠
Données copiées dans une Mission passée
```

Une fiche Mission doit afficher les données opérationnelles utilisées lors de sa création, même si le contrat a changé depuis.

Lorsqu’une donnée provient d’une copie historique, l’interface doit pouvoir l’indiquer.

---

# 31. Notifications

Une notification représente une information destinée à un utilisateur.

Exemples :

- mission assignée;
- problème critique;
- synchronisation bloquée;
- soumission expirée;
- facture en retard;
- contrat à réviser.

Chaque notification doit avoir :

- un niveau;
- un titre;
- une date;
- une entité liée;
- un état lu/non lu;
- une action.

Les notifications ne remplacent pas l’historique.

---

# 32. Activité et historique

L’activité représente les événements du système.

Exemples :

- mission créée;
- opérateur assigné;
- résidence terminée;
- problème ajouté;
- contrat modifié;
- paiement enregistré.

L’historique d’une entité est accessible depuis sa fiche.

L’activité globale peut être accessible depuis le Centre des opérations.

---

# 33. Filtres et vues sauvegardées

## 33.1 Filtres standards

- statut;
- période;
- saison;
- opérateur;
- équipement;
- route;
- client;
- priorité;
- synchronisation;
- problème.

## 33.2 Vues sauvegardées

Exemples futurs :

```text
Missions à préparer
Problèmes ouverts
Contrats sans zone
Factures en retard
Routes sans équipement
```

Les vues sauvegardées peuvent être :

- personnelles;
- partagées;
- définies par l’organisation.

---

# 34. Tri

Le tri par défaut doit correspondre au besoin métier.

Exemples :

- Missions : urgence ou date de départ;
- Routes : nom ou priorité;
- Leads : prochaine action;
- Contrats : statut puis saison;
- Factures : échéance;
- Paiements : date décroissante;
- Problèmes : criticité puis ancienneté.

Le tri ne doit pas être basé automatiquement sur la date de création pour tous les modules.

---

# 35. Pagination et chargement

Le choix dépend du module.

## Pagination recommandée

- Factures;
- Paiements;
- Clients;
- Contrats;
- Historique volumineux.

## Chargement progressif possible

- Activité;
- Notifications;
- recherche globale;
- timelines.

Le retour vers une liste doit préserver la position.

---

# 36. Hiérarchie des informations

Chaque écran doit classer les données selon trois niveaux.

## Niveau 1 — Critique

- statut;
- progression;
- problème;
- action principale;
- affectation;
- montant dû;
- synchronisation.

## Niveau 2 — Opérationnel

- coordonnées;
- dates;
- route;
- équipement;
- temps;
- superficie;
- notes importantes.

## Niveau 3 — Historique ou administratif

- créé le;
- modifié par;
- identifiant interne;
- journal complet;
- anciennes valeurs.

Les données de niveau 3 ne doivent pas dominer la page.

---

# 37. Cartes et panneaux

Une grande section peut utiliser une Card.

À l’intérieur, préférer :

- rangées;
- séparateurs;
- listes;
- groupes;
- surfaces légèrement teintées.

Éviter :

```text
Card
  └── Card
       └── Card
```

La structure visuelle doit soutenir la structure de l’information.

---

# 38. États vides

Un état vide doit expliquer :

- ce qui manque;
- pourquoi cela compte;
- la prochaine action.

Exemple :

```text
Aucune mission prévue

Créez une mission à partir d’une route pour commencer les opérations.

[Créer une mission]
```

Les états vides ne doivent pas afficher uniquement :

```text
Aucune donnée.
```

---

# 39. Chargement

Le chargement doit préserver la structure connue de la page.

Utiliser :

- skeletons;
- placeholders de carte;
- lignes fantômes;
- chargement local de l’action.

Éviter un spinner plein écran lorsque la structure est déjà connue.

---

# 40. Erreurs

Une erreur doit indiquer :

- l’élément affecté;
- l’impact;
- la dernière donnée connue;
- l’action possible;
- la possibilité de réessayer.

Exemple :

```text
La progression de la mission n’a pas pu être actualisée.

Les dernières données connues restent affichées.

[Réessayer]
```

---

# 41. États hors ligne et synchronisation

Les états suivants doivent être distingués :

```text
Synchronisé
Synchronisation en cours
Changements en attente
Opérateur hors ligne
Erreur de synchronisation
Donnée potentiellement ancienne
```

Lorsque pertinent, afficher :

```text
Dernière synchronisation : il y a 18 secondes
```

L’interface ne doit pas présenter une donnée ancienne comme étant en temps réel.

---

# 42. Carte comme structure d’information

La carte n’est pas un simple élément décoratif.

Elle peut organiser l’information pour :

- Routes;
- Missions;
- contrats et zones;
- opérateurs;
- équipements;
- problèmes.

## 42.1 Synchronisation Liste + Carte

```text
Sélection dans la liste
      ↓
Mise en évidence sur la carte
```

```text
Sélection sur la carte
      ↓
Ouverture ou surbrillance dans la liste
```

## 42.2 Éléments visibles

- hiérarchie des marqueurs;
- état;
- progression;
- problèmes;
- zones;
- route;
- sélection active.

---

# 43. Navigation depuis les cartes

Un marqueur doit offrir :

- un résumé;
- l’état;
- une action d’ouverture;
- une action contextuelle facultative.

Éviter de rendre une carte entièrement dépendante de petits popups difficiles à utiliser.

Sur Mobile, une sélection peut ouvrir un bottom sheet.

---

# 44. Actions rapides globales

Actions potentielles :

```text
Créer une mission
Créer un client
Créer un contrat
Rechercher une adresse
Voir les problèmes
```

Les actions disponibles dépendent du rôle.

Elles peuvent être accessibles depuis :

- la recherche globale;
- le Dashboard;
- un bouton `+` global;
- le menu Mobile.

---

# 45. Raccourcis clavier

Le Desktop peut supporter :

```text
Cmd/Ctrl + K  Recherche
G puis M      Missions
G puis R      Routes
G puis C      Clients
N puis M      Nouvelle mission
Esc           Fermer menu ou panneau
```

Les raccourcis doivent :

- être documentés;
- ne pas entrer en conflit avec le navigateur;
- être désactivés pendant une saisie;
- rester facultatifs.

---

# 46. Navigation par rôle

La structure générale demeure stable.

Le rôle modifie :

- les liens visibles;
- les actions disponibles;
- les modules épinglés;
- la page d’accueil;
- les notifications.

Exemples :

```text
Répartiteur
Accueil → Opérations du jour
```

```text
Représentant
Accueil → Pipeline commercial et rappels
```

```text
Comptabilité
Accueil → Factures, paiements et retards
```

Les permissions réelles seront définies dans `05-Authentication-Roles-Permissions.md`.

---

# 47. Modules activables

Une organisation peut activer ou désactiver certains modules.

Règles :

- masquer le lien;
- bloquer l’accès direct;
- conserver les données;
- ne pas briser les relations;
- afficher une explication aux administrateurs;
- ne pas supprimer automatiquement un module ou ses données.

---

# 48. Navigation entre anciennes et nouvelles applications

Pendant la migration, certains liens peuvent encore mener vers l’ancienne application.

Ces liens doivent être :

- clairement identifiés;
- temporaires;
- documentés;
- suivis;
- retirés lorsque le module est migré.

L’utilisateur ne doit pas être envoyé silencieusement vers une autre application avec une interface différente.

---

# 49. Liens profonds

Les pages importantes doivent être partageables directement.

Exemples :

```text
Mission précise
Problème précis
Contrat précis
Facture précise
Onglet Historique
Vue filtrée
```

Après connexion, l’utilisateur doit revenir au lien demandé s’il possède la permission.

---

# 50. Navigation après une mutation

Après une création ou modification :

## Création

```text
Créer
  ↓
Page de confirmation ou fiche créée
```

## Modification simple

```text
Enregistrer
  ↓
Rester sur la fiche
```

## Suppression ou archivage

```text
Confirmer
  ↓
Retour à la liste avec état préservé
```

Les redirections doivent être prévisibles.

---

# 51. Confirmations

Une confirmation est requise pour :

- suppression;
- annulation de mission;
- annulation de contrat;
- changement irréversible;
- réinitialisation;
- clôture avec problèmes non résolus.

Elle n’est pas requise pour chaque modification ordinaire.

---

# 52. Nommage des entités

L’interface utilise les termes métier officiels :

```text
Lead
Soumission
Client
Contrat
Zone de déneigement
Route
Mission
Résidence
Opérateur
Employé
Équipement
Facture
Paiement
Problème
```

Dans le code, `MissionItem` demeure acceptable.

Dans l’interface, utiliser principalement `Résidence` lorsque le contexte est résidentiel.

---

# 53. Identifiants visibles

Les identifiants humains doivent être utilisés lorsque disponibles.

Exemples :

```text
CLI-000125
CTR-000056
FAC-000081
Mission #9
```

Les UUID techniques ne doivent pas être affichés dans l’interface normale.

---

# 54. Navigation et accessibilité

Exigences :

- ordre de tabulation logique;
- lien « Aller au contenu »;
- landmarks sémantiques;
- titre de page unique;
- breadcrumb accessible;
- navigation clavier;
- indication de page active;
- focus restauré après fermeture d’une modale;
- annonce des changements importants;
- navigation Mobile lisible par lecteur d’écran.

---

# 55. Titre du navigateur

Format recommandé :

```text
Mission #9 · RECA
CTR-000056 · RECA
Clients · RECA
Centre des opérations · RECA
```

Le titre doit se mettre à jour selon l’entité.

---

# 56. Mémoire de navigation

Le système peut mémoriser par utilisateur :

- module d’accueil;
- densité des listes;
- filtres récents;
- modules épinglés;
- saison active;
- préférence carte/liste;
- taille de certains panneaux.

Les préférences doivent être réinitialisables.

---

# 57. Instrumentation de la navigabilité

La nouvelle application doit permettre d’évaluer :

- temps pour trouver un client;
- temps pour créer une mission;
- nombre de clics pour traiter un problème;
- taux d’utilisation de la recherche;
- abandons de Wizard;
- retours inutiles;
- écrans fréquemment visités;
- filtres utilisés.

Les données d’usage ne doivent pas collecter inutilement des informations personnelles.

---

# 58. Pratiques interdites

Il est interdit de :

- utiliser `Détail` comme titre principal;
- créer une navigation différente pour chaque module;
- dupliquer le menu Desktop dans un tiroir Mobile sans adaptation;
- mettre toutes les actions au même niveau;
- afficher plusieurs actions primaires;
- rendre une suppression plus visible qu’une action quotidienne;
- perdre les filtres au retour d’une fiche;
- cacher un problème dans un onglet sans indicateur;
- utiliser la date de création comme tri universel;
- créer un onglet pour une seule petite information;
- afficher une donnée ancienne comme étant en temps réel;
- utiliser un UUID comme identifiant utilisateur principal;
- envoyer silencieusement vers l’ancienne application;
- construire les URLs à partir des libellés visibles traduits;
- créer une page sans état vide, loading et erreur.

---

# 59. Critères de réussite

L’architecture de l’information est réussie si :

- un utilisateur retrouve une adresse sans connaître le module;
- le Dashboard montre les opérations du jour;
- une Mission est accessible rapidement;
- les Routes sont faciles à comprendre et préparer;
- les relations Client → Contrat → Route → Mission sont visibles;
- le Mobile expose les fonctions les plus utiles au rôle;
- le retour conserve le contexte;
- les titres utilisent les vraies entités;
- les actions principales sont évidentes;
- les actions destructives ne dominent pas;
- les données anciennes sont identifiées;
- les états hors ligne et synchronisation sont compréhensibles;
- les modules partagent des modèles de pages cohérents;
- l’application reste spécifique à la réalité de RECA.

---

# 60. Flux de référence

## 60.1 Créer une mission

```text
Centre des opérations
      ↓
Créer une mission
      ↓
Choisir une route
      ↓
Vérifier les contrats actifs
      ↓
Assigner opérateur et équipement
      ↓
Vérifier la préparation
      ↓
Créer
      ↓
Fiche Mission
```

## 60.2 Retrouver une résidence

```text
Recherche globale
      ↓
Entrer une adresse
      ↓
Résultats regroupés
      ↓
Ouvrir le contrat ou la mission active
```

## 60.3 Traiter un problème terrain

```text
Centre des opérations
      ↓
Problèmes ouverts
      ↓
Mission concernée
      ↓
Résidence
      ↓
Décision et résolution
      ↓
Historique
```

## 60.4 Créer un contrat

```text
Client
      ↓
Créer un contrat
      ↓
Informations principales
      ↓
Outil de mesure facultatif ou requis selon règle
      ↓
Paiement
      ↓
Révision
      ↓
Contrat créé
```

---

# 61. Résumé officiel

RECA App V2 utilise une architecture de l’information centrée sur les opérations.

Le Centre des opérations constitue l’entrée principale.

La navigation est organisée en quatre domaines :

```text
Opérations
Clients et contrats
Finances
Système
```

Les relations métier demeurent visibles :

```text
Lead
→ Soumission
→ Client
→ Contrat
→ Route
→ Mission
→ Résidence
→ Historique
```

Le Desktop favorise la densité et la vue d’ensemble.

Le Mobile possède une navigation adaptée au rôle.

La recherche globale permet de retrouver une information sans connaître son module.

Les listes, fiches, formulaires et Wizards dérivent de modèles officiels.

Les titres identifient les vraies entités.

Les retours conservent le contexte.

Les problèmes, la progression et la prochaine action doivent toujours rester faciles à trouver.

L’architecture de l’information ne doit pas seulement rendre l’application navigable.

Elle doit rendre les opérations compréhensibles.
