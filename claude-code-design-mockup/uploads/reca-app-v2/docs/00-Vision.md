# 00-Vision.md

# RECA
## Centre des opérations

Version : 1.0  
Projet : RECA App V2  
Dépôt recommandé : `reca-app-v2`  
Statut : Vision officielle du produit  

---

# 1. Objectif du document

Ce document définit la vision officielle de la nouvelle application RECA.

Il sert de référence principale pour :

- l’architecture;
- le design;
- la navigation;
- les modules;
- les données;
- les permissions;
- l’intégration avec RECA Opérateur;
- la migration depuis l’ancienne application;
- la roadmap;
- les décisions futures.

Toute nouvelle fonctionnalité doit être évaluée selon cette vision.

Le projet ne doit pas être guidé uniquement par :

- l’ancienne interface;
- les tables existantes;
- les habitudes du code actuel;
- une demande isolée;
- une maquette sans contexte métier;
- une préférence technique temporaire.

La nouvelle application doit être construite autour de la réalité opérationnelle de Groupe RECA.

---

# 2. Nom du produit

Nom principal :

```text
RECA
Centre des opérations
```

Nom technique du nouveau projet :

```text
RECA App V2
```

Nom recommandé du dépôt :

```text
reca-app-v2
```

L’ancien projet conserve temporairement son dépôt actuel :

```text
reca-app
```

L’application terrain conserve son dépôt :

```text
reca-operateur
```

---

# 3. Vision générale

RECA App V2 doit devenir le centre de planification, de gestion, de répartition et de supervision de toutes les opérations de Groupe RECA.

L’application doit réunir dans un même système cohérent :

- les ventes;
- les clients;
- les contrats;
- les surfaces à déneiger;
- les routes;
- les missions;
- les opérateurs;
- les employés;
- les équipements;
- les factures;
- les paiements;
- les problèmes terrain;
- l’historique;
- les statistiques;
- la synchronisation avec RECA Opérateur.

La nouvelle application ne doit pas simplement afficher des modules administratifs.

Elle doit permettre de comprendre rapidement :

- ce qui doit être préparé;
- ce qui est en cours;
- ce qui est terminé;
- ce qui est bloqué;
- ce qui demande une intervention;
- ce qui n’est pas synchronisé;
- ce qui affecte les clients;
- ce qui affecte les opérations.

---

# 4. Problème principal à résoudre

L’ancienne application a été construite progressivement, à mesure que les besoins étaient découverts.

Elle contient maintenant une grande quantité de fonctionnalités utiles, mais son expérience globale demeure principalement organisée autour de modules individuels.

Cette approche produit plusieurs limites :

- l’application ressemble davantage à un logiciel administratif qu’à un centre de commandement;
- la navigation suit parfois les entités techniques plutôt que le travail réel;
- les écrans utilisent souvent la même structure, même lorsque les besoins sont différents;
- le tableau de bord ne reflète pas encore les opérations quotidiennes;
- les actions importantes sont parfois noyées parmi les actions secondaires;
- les modules opérationnels ne dominent pas suffisamment l’expérience;
- l’information est parfois trop dispersée;
- le mobile empile encore plusieurs écrans administratifs au lieu de proposer une expérience adaptée;
- la relation entre Contrats, Routes, Missions et RECA Opérateur doit devenir plus explicite.

La nouvelle application doit corriger ces limites sans perdre les règles métier déjà validées.

---

# 5. Pourquoi créer une nouvelle application

La décision officielle est de construire une nouvelle application dans un dépôt séparé.

Cette décision permet de :

- repartir avec une architecture claire;
- concevoir l’expérience complète avant de coder;
- éviter de casser l’application actuelle;
- conserver un système fonctionnel pendant la transition;
- comparer les comportements;
- migrer progressivement;
- intégrer proprement RECA Opérateur;
- utiliser les données existantes sans copier les défauts actuels;
- appliquer la même discipline que pour RECA Opérateur.

La nouvelle application ne constitue pas une simple refonte visuelle.

Elle constitue une reconstruction contrôlée du produit autour de la réalité métier actuelle.

---

# 6. Statut des trois applications

## 6.1 RECA App actuelle

Projet :

```text
reca-app
```

Rôle :

- application actuelle;
- référence fonctionnelle;
- source d’exigences;
- source de règles métier;
- source de schémas existants;
- source de migrations;
- système temporairement utilisé pendant la transition.

L’ancienne application ne doit pas être supprimée.

Elle ne doit pas être modifiée dans le cadre de RECA App V2, sauf demande explicite.

## 6.2 RECA App V2

Projet :

```text
reca-app-v2
```

Rôle :

- nouvelle application officielle;
- nouvelle source de vérité pour le frontend;
- centre des opérations;
- nouvelle référence d’architecture;
- nouvelle référence visuelle;
- nouvelle référence de navigation;
- futur système principal de Groupe RECA.

## 6.3 RECA Opérateur

Projet :

```text
reca-operateur
```

Rôle :

- application terrain;
- exécution des missions;
- suivi GPS;
- progression des MissionItems;
- problèmes;
- mode hors ligne;
- synchronisation;
- collecte de données opérationnelles.

RECA App V2 prépare, distribue, supervise et reçoit les données de RECA Opérateur.

---

# 7. Relation entre les systèmes

```text
Clients
   ↓
Contrats
   ↓
Zones de déneigement
   ↓
Routes
   ↓
Missions
   ↓
MissionItems
   ↓
RECA Opérateur
   ↓
Événements terrain
   ↓
Synchronisation
   ↓
RECA App V2
   ↓
Historique et statistiques
```

RECA App V2 représente le centre de commandement.

RECA Opérateur représente le terminal d’exécution.

Les deux applications doivent être conçues comme deux parties d’un même produit.

---

# 8. Chaîne métier officielle

La nouvelle application doit respecter la chaîne suivante :

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
MissionItem
  ↓
Exécution
  ↓
Historique
  ↓
Facturation et statistiques
```

Cette chaîne ne signifie pas que toutes les étapes sont obligatoires dans tous les cas.

Elle représente le modèle général de l’entreprise.

---

# 9. Concepts fondamentaux

## 9.1 Client

Le client représente la personne ou l’entreprise avec laquelle RECA entretient une relation.

Un client peut posséder :

- plusieurs contrats;
- plusieurs adresses;
- plusieurs factures;
- plusieurs paiements;
- plusieurs notes;
- plusieurs documents;
- un historique.

## 9.2 Contrat

Le contrat représente l’engagement commercial et opérationnel permanent.

Il contient notamment :

- le client;
- l’adresse;
- les services;
- les prix;
- les modalités;
- les clauses;
- les zones de déneigement;
- les informations pour l’opérateur;
- les échéanciers;
- les documents;
- les versions.

Un contrat n’est pas une mission.

## 9.3 Zone de déneigement

La zone de déneigement représente la surface réelle à traiter.

Elle doit être conservée et améliorée.

Cette donnée est importante pour :

- l’estimation;
- la superficie;
- la compréhension de la propriété;
- les statistiques;
- la détection GPS;
- la stabilité de RECA Opérateur;
- les futures optimisations.

La zone de capture ne doit jamais limiter la géométrie réelle.

## 9.4 Route

Une route est un modèle permanent de travail.

Elle contient un ordre de contrats.

Elle peut être associée à :

- un secteur;
- un opérateur;
- un équipement;
- une priorité;
- des paramètres;
- un historique.

Une route n’est pas une mission.

## 9.5 Mission

Une mission représente une exécution réelle pour un événement précis.

Exemples :

- une tempête;
- une opération de déglaçage;
- une reprise;
- une intervention spéciale.

Une mission possède :

- une date;
- une heure;
- une route;
- un opérateur;
- un équipement;
- un statut;
- une progression;
- des MissionItems;
- des problèmes;
- un historique.

## 9.6 MissionItem

Un MissionItem représente une résidence ou un site à exécuter dans une mission précise.

Il doit être une copie opérationnelle suffisamment complète pour préserver l’historique.

Une modification future du contrat ne doit pas réécrire silencieusement une mission passée.

## 9.7 Opérateur

L’opérateur utilise RECA Opérateur pour exécuter une mission.

RECA App V2 doit permettre de :

- l’assigner;
- voir sa mission;
- suivre sa progression;
- voir ses problèmes;
- voir son équipement;
- voir son état de synchronisation;
- consulter son historique.

---

# 10. Utilisateurs principaux

## 10.1 Administrateur

Responsabilités possibles :

- gestion complète;
- paramètres;
- utilisateurs;
- permissions;
- contrats;
- routes;
- missions;
- finances;
- supervision;
- rapports.

## 10.2 Répartiteur

Responsabilités possibles :

- préparation des routes;
- création des missions;
- assignation des opérateurs;
- assignation des équipements;
- suivi des opérations;
- traitement des problèmes;
- ajustement des priorités.

## 10.3 Représentant

Responsabilités possibles :

- leads;
- soumissions;
- clients;
- contrats;
- rappels;
- suivi commercial.

## 10.4 Comptabilité

Responsabilités possibles :

- factures;
- paiements;
- soldes;
- retards;
- rapports financiers.

## 10.5 Gestionnaire

Responsabilités possibles :

- supervision générale;
- statistiques;
- performance;
- problèmes;
- activité;
- suivi des équipes.

## 10.6 Opérateur

L’opérateur travaille principalement dans RECA Opérateur.

Son accès à RECA App V2 peut être limité à certaines informations selon les besoins futurs.

---

# 11. Expérience attendue

La nouvelle application doit donner l’impression d’un produit conçu spécifiquement pour Groupe RECA.

Elle doit transmettre :

- contrôle;
- confiance;
- précision;
- rapidité;
- robustesse;
- clarté;
- professionnalisme;
- maîtrise des opérations hivernales.

Elle ne doit pas ressembler à :

- un gabarit CRM générique;
- un tableau administratif standard;
- une collection de formulaires;
- une application construite directement à partir des tables de base de données;
- un ensemble de pages sans hiérarchie.

---

# 12. Principe d’expérience principal

L’application doit toujours aider l’utilisateur à répondre à trois questions :

```text
Qu’est-ce qui se passe maintenant ?
Qu’est-ce qui demande mon attention ?
Quelle est la prochaine action ?
```

Chaque écran important doit mettre en évidence :

- l’état actuel;
- les problèmes;
- la progression;
- l’action principale;
- les données critiques.

---

# 13. Centre des opérations

Le tableau de bord devient le véritable Centre des opérations.

Il doit présenter en priorité :

- missions du jour;
- missions à préparer;
- missions en cours;
- missions terminées;
- problèmes ouverts;
- opérateurs assignés;
- équipements assignés;
- progression;
- synchronisation;
- alertes;
- éléments à traiter;
- carte des opérations;
- activité récente.

Les données commerciales et financières demeurent disponibles, mais ne doivent pas dominer l’écran opérationnel principal pendant la saison.

---

# 14. Navigation orientée métier

La navigation doit refléter la réalité de l’entreprise.

Structure conceptuelle recommandée :

```text
CENTRE DES OPÉRATIONS
- Aujourd’hui
- Recherche globale
- Activité

OPÉRATIONS
- Missions
- Routes
- Employés
- Équipements

CLIENTS ET CONTRATS
- Leads
- Soumissions
- Clients
- Contrats

FINANCES
- Factures
- Paiements

SYSTÈME
- Paramètres
```

L’ordre exact pourra être configuré selon :

- le rôle;
- la saison;
- les modules actifs;
- les préférences de l’organisation.

---

# 15. Recherche globale

L’utilisateur ne doit pas toujours devoir connaître le bon module avant de chercher.

La recherche globale doit éventuellement permettre de chercher par :

- nom;
- adresse;
- téléphone;
- courriel;
- numéro de contrat;
- numéro de facture;
- mission;
- route;
- équipement;
- opérateur.

Exemple :

```text
224 rue Scott
```

Le système doit pouvoir retourner :

- le client;
- le contrat;
- la route;
- la mission active;
- les factures;
- l’historique associé.

---

# 16. Design général

L’identité existante de Groupe RECA doit être respectée.

Principes :

- logo officiel;
- rouge RECA comme couleur de marque;
- bleu nuit pour les grandes surfaces de navigation;
- couleurs fonctionnelles distinctes;
- typographie claire et robuste;
- peu de couleurs décoratives;
- beaucoup de lisibilité;
- hiérarchie forte;
- densité adaptée;
- espaces utiles;
- cartes utilisées avec intention.

Le design ne doit pas utiliser le rouge pour tous les états.

Exemples :

- rouge : marque, critique, destructif;
- vert : succès, terminé, actif;
- bleu : information, navigation;
- ambre : attention;
- gris : secondaire, inactif.

---

# 17. Desktop

L’expérience desktop doit être conçue comme une application professionnelle.

Elle doit favoriser :

- rapidité;
- densité;
- vue d’ensemble;
- comparaison;
- actions multiples;
- cartes;
- tableaux;
- panneaux;
- raccourcis;
- navigation persistante.

Le desktop ne doit pas être une version mobile étirée.

---

# 18. Mobile

L’expérience mobile doit être conçue séparément.

Elle doit favoriser :

- actions rapides;
- information essentielle;
- navigation courte;
- cartes compactes;
- boutons accessibles;
- actions collantes;
- bottom sheets lorsque pertinent;
- safe areas;
- lecture à une main.

Le mobile ne doit pas simplement empiler toutes les cartes desktop.

---

# 19. Tablette

La tablette doit être évaluée comme une expérience distincte lorsque nécessaire.

Elle peut combiner :

- navigation desktop;
- panneaux plus compacts;
- cartes;
- formulaires en deux colonnes;
- cartes opérationnelles;
- interactions tactiles.

Le comportement tablette ne doit pas être laissé au hasard entre desktop et mobile.

---

# 20. Principes de données

## 20.1 Source de vérité

La base Supabase existante peut être conservée et adaptée.

La nouvelle application ne doit pas créer une seconde base de données uniquement pour éviter de comprendre l’existante.

Toute modification doit être :

- documentée;
- migrable;
- additive lorsque possible;
- compatible avec la transition;
- sécurisée par RLS;
- testée.

## 20.2 Historique

Les entités importantes doivent conserver un historique.

Exemples :

- changement de statut;
- assignation;
- modification de contrat;
- création de mission;
- problème terrain;
- facture;
- paiement;
- synchronisation;
- modification de géométrie.

## 20.3 Données figées

Les événements passés doivent conserver les données utilisées à l’époque.

Exemples :

- géométrie utilisée par un MissionItem;
- opérateur assigné;
- équipement assigné;
- prix;
- clauses;
- route;
- ordre;
- alertes.

---

# 21. Intégration avec RECA Opérateur

La nouvelle application doit être conçue dès le départ pour RECA Opérateur.

Elle doit préparer et transmettre :

- Mission;
- MissionItems;
- ordre;
- adresses;
- coordonnées;
- géométries;
- alertes;
- informations terrain;
- opérateur;
- équipement;
- paramètres opérationnels.

Elle doit recevoir :

- statuts;
- temps;
- problèmes;
- notes;
- événements;
- progression;
- données de synchronisation;
- fin de mission.

---

# 22. Fonctionnement en temps réel

RECA App V2 doit afficher les opérations de manière actualisée.

Cependant, elle ne doit pas supposer que RECA Opérateur est toujours connecté.

Elle doit distinguer :

- dernière donnée connue;
- donnée en temps réel;
- donnée en attente;
- opérateur hors ligne;
- synchronisation partielle;
- conflit;
- erreur.

L’absence de réseau ne doit pas produire de fausse impression de précision.

---

# 23. Statistiques

Les statistiques doivent provenir du travail réel.

Exemples :

- durée moyenne par résidence;
- durée moyenne par superficie;
- temps de déplacement;
- nombre de problèmes;
- performance d’une route;
- performance d’un équipement;
- progression d’une mission;
- taux de synchronisation;
- contrats sans zone;
- missions sans assignation;
- factures en retard.

Les statistiques ne doivent pas être créées uniquement parce qu’une donnée est facile à compter.

---

# 24. Automatisation future

La nouvelle architecture doit permettre plus tard :

- optimisation des routes;
- estimation prédictive;
- détection d’anomalies;
- recommandations;
- automatisation des missions;
- génération de rapports;
- détection de contrats incomplets;
- intelligence artificielle opérationnelle.

Ces fonctions ne doivent pas compliquer la première version inutilement.

---

# 25. Ce que la nouvelle application doit conserver

La nouvelle application doit conserver les règles métier valides de l’ancienne application.

Exemples :

- pipeline Lead → Soumission → Client → Contrat;
- clients résidentiels et commerciaux;
- paramètres de contrat;
- outil de mesure;
- zones;
- factures;
- paiements;
- employés;
- équipements;
- routes;
- missions;
- rôles;
- paramètres;
- documents;
- notes;
- historique.

La nouvelle application peut réutiliser certaines fonctions ou idées lorsqu’elles sont :

- correctes;
- testées;
- compatibles;
- documentées;
- adaptées à la nouvelle architecture.

---

# 26. Ce que la nouvelle application ne doit pas copier automatiquement

Elle ne doit pas copier aveuglément :

- la structure visuelle actuelle;
- les cartes répétitives;
- les grandes zones vides;
- les titres génériques;
- les actions destructives trop visibles;
- la navigation orientée uniquement par modules;
- les dépendances fragiles;
- les composants dupliqués;
- les accès directs;
- les décisions temporaires;
- les solutions devenues obsolètes.

---

# 27. Hors périmètre initial

La première version de RECA App V2 ne doit pas être retardée par :

- intelligence artificielle prédictive avancée;
- optimisation automatique complète des routes;
- télémétrie de véhicule;
- caméra en temps réel;
- paie complète;
- gestion CCQ complète;
- inventaire avancé;
- portail client entièrement reconstruit;
- comptabilité complète;
- discussion instantanée;
- suivi vidéo;
- modèle 3D;
- automatisations non essentielles.

Ces fonctions pourront être ajoutées après stabilisation du cœur opérationnel.

---

# 28. Principes non négociables

## 28.1 Documentation d’abord

Avant de développer un module important :

- lire la documentation;
- lire la mémoire;
- vérifier l’ancienne application;
- vérifier RECA Opérateur;
- créer un plan;
- confirmer les dépendances.

## 28.2 Nouvelle application séparée

Ne jamais supprimer ou remplacer l’ancienne application pendant la construction.

## 28.3 Aucune invention silencieuse

Une décision métier importante doit être validée et documentée.

## 28.4 Une action principale

Chaque écran doit posséder une hiérarchie claire.

Les actions rares, secondaires ou destructives doivent être réduites visuellement ou déplacées dans un menu.

## 28.5 Les opérations dominent

Pendant la saison, les missions, routes, problèmes, opérateurs et équipements doivent être plus visibles que les fonctions secondaires.

## 28.6 Mobile réellement adapté

Le mobile doit être conçu, pas seulement compressé.

## 28.7 Historique fiable

Les données passées ne doivent pas être réécrites silencieusement.

## 28.8 Intégration native avec RECA Opérateur

Les deux applications doivent utiliser des contrats de données stables.

## 28.9 Sécurité

Les rôles et permissions doivent être appliqués à la fois :

- dans l’interface;
- dans les routes;
- dans les services;
- dans Supabase RLS.

## 28.10 Mémoire obligatoire

Le projet doit maintenir :

```text
tasks.md
plans.md
file-index.md
memory.md
```

---

# 29. Hiérarchie des sources

En cas de contradiction :

```text
1. Décision explicite récente du propriétaire du projet
2. Documentation officielle de RECA App V2
3. memory.md de RECA App V2
4. plans.md de RECA App V2
5. Code et tests de RECA App V2
6. Documentation de RECA Opérateur
7. Comportement confirmé de l’ancienne RECA App
8. Mémoire de l’ancienne RECA App
9. Anciennes maquettes
10. Hypothèse du développeur
```

L’ancienne application est une référence.

Elle n’est pas automatiquement la nouvelle source de vérité.

---

# 30. Critères de succès du produit

RECA App V2 sera considérée réussie si :

- l’utilisateur comprend immédiatement l’état des opérations;
- le tableau de bord montre ce qui demande une action;
- une mission peut être préparée rapidement;
- les opérateurs et équipements peuvent être assignés clairement;
- RECA Opérateur reçoit les bonnes données;
- la progression terrain est visible;
- les problèmes sont faciles à repérer;
- les contrats conservent leurs informations complètes;
- les surfaces sont fiables;
- les routes sont faciles à organiser;
- les factures et paiements demeurent cohérents;
- les rôles sont sécurisés;
- la navigation est rapide;
- la recherche permet de retrouver une adresse sans connaître le module;
- le mobile est réellement utilisable;
- la migration peut être effectuée sans interruption;
- l’ancienne application peut être retirée seulement lorsque la nouvelle est prête.

---

# 31. Critères de succès visuels

Le produit doit sembler :

- spécifique à RECA;
- moderne;
- robuste;
- cohérent;
- professionnel;
- opérationnel;
- précis;
- rapide.

L’utilisateur ne doit pas avoir l’impression d’utiliser :

- un CRM générique;
- un template;
- une interface d’administration standard;
- un logiciel constitué de formulaires indépendants.

---

# 32. Critères de succès techniques

La nouvelle application doit posséder :

- TypeScript strict;
- architecture modulaire;
- composants partagés;
- données validées;
- services isolés;
- gestion claire des erreurs;
- tests;
- migrations;
- RLS;
- journaux structurés;
- environnement de développement;
- documentation à jour;
- système de mémoire;
- intégration contrôlée avec les anciens systèmes.

---

# 33. Méthode officielle de construction

La méthode doit suivre celle utilisée pour RECA Opérateur.

```text
Vision
  ↓
Design System
  ↓
Architecture de l’information
  ↓
Architecture de l’application
  ↓
Architecture des données
  ↓
Modules métier
  ↓
Master UI
  ↓
Roadmap
  ↓
Sprints
  ↓
Implémentation
  ↓
Tests
  ↓
Migration
```

Le code ne doit pas commencer avant que les fondations nécessaires soient définies.

---

# 34. Master UI

Avant de construire tous les écrans, créer des écrans maîtres.

Minimum recommandé :

```text
1. Centre des opérations
2. Liste d’entités
3. Fiche commerciale
4. Fiche opérationnelle
5. Formulaire complexe
6. Expérience mobile
```

Les modules doivent ensuite être dérivés de ces modèles.

Ils ne doivent pas être conçus indépendamment sans système commun.

---

# 35. Vision du résultat final

RECA App V2 doit devenir la représentation numérique du fonctionnement réel de Groupe RECA.

Le système doit relier :

```text
La vente
La propriété
Le contrat
La route
La mission
L’opérateur
L’équipement
Le terrain
La facture
L’historique
```

La nouvelle application doit permettre à Groupe RECA de mieux :

- planifier;
- exécuter;
- superviser;
- comprendre;
- améliorer;
- grandir.

---

# 36. Résumé officiel

RECA App V2 est un nouveau Centre des opérations construit dans un dépôt séparé.

L’ancienne RECA App reste disponible comme référence fonctionnelle.

RECA Opérateur reste l’application terrain.

La nouvelle application doit être conçue autour de la chaîne réelle :

```text
Client
  ↓
Contrat
  ↓
Zone
  ↓
Route
  ↓
Mission
  ↓
MissionItem
  ↓
RECA Opérateur
  ↓
Historique
```

La priorité n’est pas de copier l’existant plus proprement.

La priorité est de construire le bon produit.

RECA App V2 doit montrer ce qui se passe, ce qui demande une attention et ce qui doit être fait ensuite.

Elle doit devenir le véritable Centre des opérations de Groupe RECA.
