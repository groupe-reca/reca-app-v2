# 13-Mobile-and-Responsive-Experience.md

# RECA
## Expérience mobile, tablette et responsive

Version : 1.0  
Projet : RECA App V2  
Dépôt recommandé : `reca-app-v2`  
Statut : Spécification officielle de l’expérience responsive  

---

# 1. Objectif du document

Ce document définit l’expérience officielle de RECA App V2 sur :

```text
Mobile
Tablette
Ordinateur portable
Desktop
Grand écran
```

Il décrit :

- les principes responsive;
- les responsabilités de chaque format;
- les shells applicatifs;
- la navigation;
- les en-têtes;
- les listes;
- les fiches;
- les formulaires;
- les cartes;
- les tableaux;
- les actions;
- les modales;
- les bottom sheets;
- les flows plein écran;
- les safe areas;
- la densité;
- l’accessibilité tactile;
- la performance;
- les états de chargement;
- les tests;
- les critères de réussite.

Ce document complète notamment :

```text
01-Design-System.md
02-Information-Architecture.md
03-Application-Architecture.md
06-Operations-Center-Dashboard.md
07-Leads-Quotes-Clients.md
08-Contracts-and-Measurement.md
09-Routes-Missions-and-Dispatch.md
10-Employees-and-Equipment.md
11-Finance-and-Payments.md
12-Operator-Integration-and-Synchronization.md
```

---

# 2. Vision générale

RECA App V2 ne doit pas être une application Desktop réduite pour entrer sur un téléphone.

Chaque format doit offrir une expérience adaptée à son contexte réel.

```text
Desktop
Analyse, planification, comparaison, densité

Tablette
Supervision tactile, carte, mobilité interne

Mobile
Consultation rapide, actions urgentes, communication

RECA Opérateur
Exécution terrain spécialisée
```

Le responsive doit adapter :

- la structure;
- la navigation;
- la densité;
- la priorité des données;
- les interactions;
- les actions;
- la présentation des cartes;
- le comportement des formulaires.

---

# 3. Principe fondamental

Le responsive ne signifie pas seulement :

```text
4 colonnes
  ↓
1 colonne
```

Le système doit parfois utiliser :

- un composant Desktop;
- un composant Mobile;
- une hiérarchie différente;
- une action différente;
- un flow différent;
- un niveau de détail différent.

La logique métier demeure partagée.

La présentation peut être spécialisée.

---

# 4. Objectifs par format

## 4.1 Mobile

Le Mobile doit permettre de :

- comprendre rapidement une situation;
- consulter une entité;
- contacter un Client;
- voir une Mission;
- assigner une ressource;
- résoudre un problème;
- consulter un statut;
- effectuer une action urgente;
- reprendre un travail sans friction.

## 4.2 Tablette

La Tablette doit permettre de :

- superviser;
- utiliser une carte;
- consulter liste et détail;
- modifier des données;
- faire de la répartition;
- utiliser l’outil de mesure;
- travailler en déplacement dans les bureaux ou véhicules.

## 4.3 Desktop

Le Desktop doit permettre de :

- planifier;
- comparer;
- réorganiser;
- analyser;
- gérer des listes volumineuses;
- éditer des formulaires complexes;
- superviser plusieurs Missions;
- exploiter la largeur disponible.

---

# 5. Limite entre RECA App V2 et RECA Opérateur

RECA App V2 Mobile ne doit pas tenter de remplacer RECA Opérateur.

RECA Opérateur demeure responsable de :

- navigation terrain;
- transitions GPS;
- timer;
- carte plein écran;
- fonctionnement hors ligne terrain;
- progression résidence par résidence;
- signalement rapide;
- exécution de la Mission.

RECA App V2 Mobile demeure responsable de :

- supervision;
- consultation;
- répartition;
- administration;
- suivi;
- communication;
- actions de soutien.

---

# 6. Breakpoints officiels

Breakpoints initiaux :

```text
Mobile
0 à 767 px

Tablette
768 à 1023 px

Desktop
1024 à 1439 px

Grand écran
1440 px et plus
```

Les composants doivent aussi supporter les largeurs intermédiaires.

---

# 7. Breakpoints fonctionnels

La logique ne doit pas dépendre uniquement du nom de l’appareil.

Les décisions doivent considérer :

- largeur;
- hauteur;
- mode portrait;
- mode paysage;
- capacité tactile;
- présence d’un clavier;
- densité;
- espace utile.

---

# 8. Orientation

Le système doit fonctionner en :

```text
Portrait
Paysage
```

La Tablette paysage peut utiliser une structure proche du Desktop.

Le Mobile paysage ne doit pas être traité comme un Desktop complet.

---

# 9. Architecture des shells

Structure recommandée :

```text
DesktopAppShell
TabletAppShell
MobileAppShell
FullscreenFlowShell
PrintShell
```

Les shells peuvent partager :

- session;
- route;
- permissions;
- thème;
- providers;
- recherche;
- notifications.

---

# 10. DesktopAppShell

Le DesktopAppShell contient :

- sidebar persistante;
- top bar;
- recherche globale;
- notifications;
- profil;
- breadcrumb;
- zone de contenu;
- panneaux secondaires lorsque requis.

---

# 11. MobileAppShell

Le MobileAppShell contient :

- header compact;
- contenu;
- navigation inférieure;
- safe areas;
- gestion du scroll;
- sheets;
- actions contextuelles.

Il ne contient pas une sidebar Desktop compressée.

---

# 12. TabletAppShell

Le TabletAppShell peut utiliser :

- sidebar compacte;
- rail d’icônes;
- top bar;
- navigation tactile;
- panneau latéral;
- bottom navigation selon largeur.

Le comportement exact peut changer entre portrait et paysage.

---

# 13. FullscreenFlowShell

Le FullscreenFlowShell est utilisé pour :

- outil de mesure;
- carte immersive;
- Wizard complexe;
- édition de Route;
- supervision cartographique;
- document;
- flow critique.

Il peut masquer :

- sidebar;
- navigation inférieure;
- éléments secondaires.

Il doit conserver :

- titre;
- retour;
- action;
- état;
- safe areas.

---

# 14. Navigation Desktop

La sidebar Desktop doit être :

- persistante;
- groupée par domaine;
- filtrée par permissions;
- filtrée par modules;
- repliable;
- lisible;
- stable.

Groupes recommandés :

```text
Centre des opérations
Opérations
Clients et contrats
Finances
Système
```

---

# 15. Navigation Mobile

La navigation principale Mobile utilise une barre inférieure.

Elle doit contenir au maximum :

```text
5 destinations
```

---

# 16. Navigation Mobile par rôle

## Dispatcher

```text
Accueil
Missions
Routes
Clients
Menu
```

## Sales Representative

```text
Accueil
Leads
Soumissions
Clients
Menu
```

## Accounting

```text
Accueil
Factures
Paiements
Clients
Menu
```

## Manager

```text
Accueil
Missions
Clients
Finances
Menu
```

Le choix final dépend des permissions.

---

# 17. Onglet Menu

Le menu Mobile regroupe :

- modules secondaires;
- Employés;
- Équipements;
- Activité;
- Recherche;
- Paramètres;
- Profil;
- Déconnexion.

Il ne doit pas devenir une liste désorganisée.

---

# 18. Élément actif

L’élément actif doit être identifiable par :

- icône;
- libellé;
- forme;
- contraste.

Ne pas dépendre uniquement de la couleur.

---

# 19. Hauteur de la navigation Mobile

La barre doit respecter :

- zone tactile;
- safe area;
- clavier;
- appareils avec indicateur d’accueil;
- orientation.

---

# 20. Header Mobile

Le header Mobile doit être compact.

Il peut contenir :

```text
Retour
Titre
Action
```

ou :

```text
Logo
Titre court
Recherche
Profil
```

selon la route.

---

# 21. Titre Mobile

Le titre doit représenter l’entité réelle.

Exemples :

```text
Missions
MIS-2026-0009
Jean Tremblay
FAC-000081
```

Éviter :

```text
Détail
Page
Informations
```

---

# 22. Header de liste Mobile

Structure recommandée :

```text
Titre
Résumé compact
Recherche
Filtres
Action +
```

---

# 23. Header de fiche Mobile

Structure :

```text
Retour
Numéro ou titre court
Action contextuelle
```

L’identité complète apparaît dans le contenu.

---

# 24. Header Desktop

Le Desktop peut afficher :

- breadcrumb;
- titre;
- sous-titre;
- statut;
- action primaire;
- actions secondaires.

---

# 25. Breadcrumb

Le breadcrumb est principalement Desktop.

Sur Mobile, utiliser :

- retour;
- titre;
- contexte compact.

Éviter un breadcrumb horizontal trop long.

---

# 26. Action primaire

Chaque écran doit posséder au maximum une action primaire dominante.

Exemples :

```text
Créer une Mission
Enregistrer
Envoyer
Assigner
Enregistrer un Paiement
```

---

# 27. Position action primaire Mobile

Options :

- bouton dans le header;
- bouton flottant;
- barre inférieure;
- bouton dans la première section.

Le choix dépend du contexte.

---

# 28. Floating Action Button

Le bouton flottant est approprié pour :

- nouvelle entité;
- ajout simple;
- action fréquente.

Exemples :

```text
Nouveau Lead
Nouvelle Note
Nouveau Problem
```

Il ne convient pas à toutes les pages.

---

# 29. Barre d’actions inférieure

Utilisée pour :

- formulaire long;
- Wizard;
- confirmation financière;
- mesure;
- action critique.

Elle doit afficher :

- action principale;
- retour ou annuler;
- état de sauvegarde si utile.

---

# 30. Safe areas

Tous les éléments fixes doivent respecter :

```css
env(safe-area-inset-top)
env(safe-area-inset-bottom)
env(safe-area-inset-left)
env(safe-area-inset-right)
```

---

# 31. Clavier virtuel

Lorsqu’un clavier est ouvert :

- l’action principale doit rester accessible;
- le champ actif doit rester visible;
- la navigation inférieure peut être masquée;
- le contenu ne doit pas être compressé de façon imprévisible;
- les modales doivent être testées.

---

# 32. Scroll

Chaque écran doit posséder un scroll principal clair.

Éviter :

- double scroll;
- body bloqué sans raison;
- cartes avec petits scrolls;
- tableaux dans des conteneurs verticaux imbriqués;
- zones invisibles sous une barre fixe.

---

# 33. Restauration du scroll

Lors du retour à une liste, restaurer :

- position;
- filtres;
- recherche;
- tri;
- pagination;
- vue;
- onglet.

---

# 34. Pull to refresh

Le pull to refresh peut être utilisé sur Mobile pour :

- Dashboard;
- listes;
- fiche Mission;
- synchronisation.

Il ne doit pas interrompre un formulaire en cours.

---

# 35. Densité responsive

Modes conceptuels :

```text
Compact
Comfortable
Touch
```

## Compact

Desktop dense.

## Comfortable

Desktop ou Tablette.

## Touch

Mobile et Tablette tactile.

---

# 36. Touch targets

Taille minimale :

```text
44 × 44 px
```

Pour :

- boutons;
- icônes;
- lignes cliquables;
- contrôles cartographiques;
- onglets;
- menu;
- cases.

---

# 37. Espacement tactile

Deux actions dangereuses ne doivent pas être trop proches.

Exemple :

```text
Enregistrer
Annuler
```

doivent être visuellement distinctes.

---

# 38. Typographie responsive

La typographie doit conserver la hiérarchie sans devenir surdimensionnée sur Mobile.

Exemple :

```text
Titre de page Desktop
32 px

Titre de page Mobile
24 px
```

Les valeurs finales doivent suivre les tokens du Design System.

---

# 39. Longs titres

Les longs titres doivent :

- se couper proprement;
- conserver le numéro;
- éviter de pousser l’action hors écran;
- utiliser deux lignes si nécessaire;
- fournir le texte complet accessible.

---

# 40. Cartes Mobile

Une carte Mobile doit être compacte.

Elle doit présenter :

- identité;
- statut;
- information principale;
- prochaine action;
- chevron ou action.

Elle ne doit pas reproduire toute la fiche.

---

# 41. Rangée Desktop

Une rangée Desktop doit présenter plus de colonnes.

Elle doit permettre :

- tri;
- sélection;
- actions contextuelles;
- densité;
- navigation.

---

# 42. Toute la carte cliquable

Sur Mobile, toute la carte peut ouvrir la fiche.

Les actions intégrées doivent rester distinctes.

Éviter des zones cliquables imbriquées ambiguës.

---

# 43. Tables

Les tableaux sont privilégiés sur Desktop pour les données denses.

Sur Mobile, ils doivent être transformés en :

- cartes;
- lignes;
- sections;
- vues condensées.

---

# 44. Scroll horizontal des tables

Le scroll horizontal est permis uniquement lorsque la structure tabulaire est essentielle.

Exemples :

- rapport;
- comparaison;
- données financières complexes.

Il ne doit pas être le comportement par défaut des listes principales.

---

# 45. Colonnes prioritaires

Chaque tableau doit définir :

```text
Priorité 1
Toujours visible

Priorité 2
Visible Tablette/Desktop

Priorité 3
Visible Desktop

Priorité 4
Grand écran seulement
```

---

# 46. Actions de rangée

Desktop :

- action principale;
- menu `⋮`;
- hover/focus.

Mobile :

- carte;
- swipe optionnel futur;
- menu;
- action dans fiche.

---

# 47. Swipe actions

Hors périmètre initial.

Une future fonction de swipe doit :

- offrir une alternative visible;
- éviter les actions destructives immédiates;
- demander confirmation si nécessaire.

---

# 48. Listes longues

Les listes longues doivent utiliser :

- pagination serveur;
- chargement progressif;
- virtualisation si nécessaire;
- filtres;
- recherche;
- placeholders.

---

# 49. Pagination Mobile

Options :

- bouton « Charger plus »;
- pagination simple;
- infinite scroll contrôlé.

Direction recommandée :

```text
Charger plus
```

pour préserver le contrôle et l’accessibilité.

---

# 50. Pagination Desktop

Utiliser :

- nombre de résultats;
- page;
- taille;
- précédent;
- suivant.

---

# 51. Filtres Desktop

Les filtres peuvent être :

- visibles dans une toolbar;
- repliables;
- persistants;
- combinables.

---

# 52. Filtres Mobile

Les filtres utilisent :

- bottom sheet;
- drawer;
- panneau plein écran.

Le bouton doit afficher le nombre de filtres actifs.

Exemple :

```text
Filtres · 3
```

---

# 53. Recherche Mobile

La recherche peut être :

- directement visible;
- ouverte par icône;
- plein écran pour recherche globale.

---

# 54. Recherche globale Mobile

La recherche globale doit :

- prendre tout l’écran;
- afficher les résultats groupés;
- gérer le clavier;
- offrir les récents;
- fermer facilement;
- respecter les permissions.

---

# 55. Segmented controls

Appropriés pour de petites vues.

Exemples :

```text
Liste | Carte
Actifs | Tous
Aujourd’hui | Demain
```

Éviter plus de trois ou quatre options.

---

# 56. Onglets Desktop

Les onglets peuvent être horizontaux.

Ils doivent supporter :

- focus;
- URL;
- compteur;
- contenu lazy-loaded.

---

# 57. Onglets Mobile

Les onglets doivent :

- être scrollables si nécessaire;
- ne pas devenir trop petits;
- conserver l’onglet actif;
- éviter les labels excessivement longs.

Une alternative est un sélecteur ou des sections.

---

# 58. Fiches d’entités

Toutes les fiches utilisent une architecture commune :

```text
EntityHeader
Résumé
Action principale
Informations prioritaires
Onglets ou sections
Historique
```

---

# 59. Fiche Client Mobile

Premier écran recommandé :

```text
CLI-000053 · Jean Tremblay
ACTIF

[Appeler] [Courriel] [Maps]
[Créer un Contrat]

Adresse
Contrats actifs
Solde si permission
```

---

# 60. Fiche Contract Mobile

Premier écran :

```text
CTR-000056 · Jean Tremblay
ACTIF

Saison 2026–2027
1 250,00 $
65 m²

[Modifier]
```

---

# 61. Fiche Route Mobile

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

# 62. Fiche Mission Mobile

Premier écran :

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

# 63. Fiche Invoice Mobile

Premier écran :

```text
FAC-000081
PARTIELLEMENT PAYÉE

Total : 1 250,00 $
Payé : 500,00 $
Solde : 750,00 $

[Enregistrer un Paiement]
```

---

# 64. Informations secondaires

Les données secondaires doivent apparaître plus bas.

Exemples :

- CreatedAt;
- UpdatedAt;
- IDs techniques;
- informations rares;
- détails d’audit.

---

# 65. Cartes statistiques

Sur Desktop, les statistiques doivent rester compactes.

Sur Mobile, préférer :

```text
Grille 2 × 2 compacte
```

ou :

```text
Rangée horizontale
```

Éviter une carte pleine largeur par valeur.

---

# 66. Empty states

Un état vide Mobile doit être court.

Exemple :

```text
Aucune Mission aujourd’hui.
```

Action seulement si pertinente.

---

# 67. États positifs

Exemples :

```text
Aucun problème ouvert
Aucun conflit
Tout est synchronisé
```

Ils doivent être compacts.

---

# 68. Formulaires Desktop

Les formulaires Desktop peuvent utiliser :

- une ou deux colonnes;
- sections;
- résumé latéral;
- barre d’actions collante;
- aides;
- aperçu.

---

# 69. Formulaires Mobile

Les formulaires Mobile doivent utiliser :

- une colonne;
- labels visibles;
- champs pleine largeur;
- clavier adapté;
- barre d’actions;
- sections courtes;
- résumé final.

---

# 70. Types de clavier

Utiliser :

```text
inputmode="tel"
inputmode="email"
inputmode="numeric"
inputmode="decimal"
```

selon le champ.

---

# 71. Autofill

Les champs standards doivent permettre l’autofill lorsque sécuritaire.

Exemples :

- nom;
- téléphone;
- courriel;
- adresse.

---

# 72. Scanner et caméra

Hors périmètre initial.

La structure peut permettre plus tard :

- photo;
- document;
- plaque;
- code-barres;
- preuve terrain.

---

# 73. Validation Mobile

Les erreurs doivent apparaître :

- près du champ;
- dans un résumé si plusieurs;
- après interaction ou soumission;
- sans déplacer brutalement l’écran.

---

# 74. Focus sur première erreur

Après soumission invalide :

- déplacer le focus vers la première erreur;
- annoncer le message;
- conserver les valeurs.

---

# 75. Formulaires complexes

Les flows complexes utilisent un Wizard.

Exemples :

- Contrat;
- outil de mesure;
- création de Mission;
- génération financière.

---

# 76. Wizard Desktop

Structure :

```text
Étapes latérales ou supérieures
Contenu
Résumé
Actions
```

---

# 77. Wizard Mobile

Structure :

```text
Étape 2 sur 5
Titre
Contenu
Retour
Continuer
```

Le nombre d’étapes doit rester visible.

---

# 78. Sauvegarde de brouillon

Pour les flows longs :

- sauvegarde explicite;
- sauvegarde automatique future;
- état visible;
- reprise;
- avertissement avant quitter.

---

# 79. Unsaved changes

Lorsqu’un utilisateur quitte avec des modifications :

```text
Vous avez des modifications non enregistrées.
```

Actions :

```text
Continuer la modification
Quitter sans enregistrer
```

---

# 80. Modales Desktop

Les modales sont appropriées pour :

- confirmation;
- action rapide;
- sélection;
- petit formulaire;
- détail secondaire.

Elles ne doivent pas contenir un flow principal complexe.

---

# 81. Modales Mobile

Sur Mobile, préférer :

- bottom sheet;
- plein écran;
- dialogue compact.

Une grande modale centrée est rarement appropriée.

---

# 82. Bottom sheet

Le bottom sheet est approprié pour :

- filtres;
- choix;
- détails;
- actions;
- liste de zones;
- sélection de ressource;
- problème;
- carte contextuelle.

---

# 83. Hauteur bottom sheet

États possibles :

```text
Compact
Moyen
Plein écran
```

Il doit être facile à fermer sans perdre une action importante.

---

# 84. Focus dans sheet

Le focus doit :

- entrer dans le sheet;
- rester dans le sheet;
- revenir à l’élément déclencheur après fermeture.

---

# 85. Drawers Desktop

Les drawers sont appropriés pour :

- détails rapides;
- assignation;
- comparaison;
- activité;
- filtres avancés.

Ils ne remplacent pas une fiche complète.

---

# 86. Confirmations

Utiliser une confirmation pour :

- annuler;
- archiver;
- supprimer;
- fermer;
- paiement;
- réassigner;
- écraser;
- quitter avec changements.

Éviter la confirmation pour chaque petite action.

---

# 87. Confirmations Mobile

Le bouton destructif doit être séparé.

Exemple :

```text
Annuler la Mission
```

en rouge, après une explication claire.

---

# 88. Cartographie Desktop

La carte Desktop peut partager l’écran avec :

- liste;
- panneau;
- détail;
- filtres;
- légende.

---

# 89. Cartographie Tablette

La carte Tablette peut être dominante.

Utiliser :

- panneau repliable;
- bottom sheet;
- grands contrôles;
- interaction tactile.

---

# 90. Cartographie Mobile

La carte Mobile doit être :

- plein écran;
- ou aperçu compact ouvrable.

Éviter une carte de 200 px de haut qui ne permet aucune compréhension.

---

# 91. Liste + carte

Sur Desktop :

```text
Liste à gauche
Carte à droite
```

Sur Mobile :

```text
Segment Liste | Carte
```

ou :

```text
Carte plein écran + bottom sheet
```

---

# 92. Synchronisation liste-carte

La sélection doit être partagée.

```text
Sélectionner une ligne
  ↓
Mettre en évidence le marqueur
```

```text
Sélectionner un marqueur
  ↓
Ouvrir l’élément dans la liste
```

---

# 93. Outil de mesure Desktop

Le Desktop est le format principal pour le tracé précis.

Il doit offrir :

- grande carte;
- liste des zones;
- outils;
- résumé;
- actions collantes.

---

# 94. Outil de mesure Tablette

La Tablette doit permettre une utilisation complète.

Elle peut utiliser :

- carte plein écran;
- outils flottants;
- bottom sheet;
- gros sommets;
- gestes tactiles.

---

# 95. Outil de mesure Mobile

Le Mobile peut permettre :

- consultation;
- correction simple;
- déplacement;
- ajout;
- validation.

Il ne doit pas être présenté comme le meilleur format pour une géométrie complexe.

---

# 96. Contrôles cartographiques

Ils doivent respecter :

- taille tactile;
- contraste;
- espacement;
- safe area;
- orientation;
- lisibilité au soleil.

---

# 97. Gestes cartographiques

Le système doit distinguer :

- déplacement de carte;
- déplacement de sommet;
- zoom;
- rotation;
- dessin.

Les modes doivent être explicites.

---

# 98. État du mode

Afficher clairement :

```text
Mode dessin
Mode modification
Mode déplacement
```

---

# 99. Performance Mobile

Le Mobile doit prioriser :

- shell rapide;
- contenu principal;
- faible JavaScript initial;
- images adaptées;
- carte différée;
- pagination;
- cache;
- requêtes limitées.

---

# 100. Chargement différé

Charger en différé :

- Mapbox;
- PDF;
- graphiques;
- éditeur de mesure;
- modules rares;
- paramètres avancés.

---

# 101. Réseau lent

Le système doit être testé sur :

- Wi-Fi;
- LTE;
- réseau lent;
- latence élevée;
- coupure temporaire.

---

# 102. Offline administratif

RECA App V2 n’est pas une application offline-first complète.

Elle peut supporter :

- dernière donnée connue;
- lecture cache;
- retry;
- formulaire brouillon local;
- état hors ligne.

Les mutations offline doivent être limitées et explicites.

---

# 103. Offline terrain

RECA Opérateur demeure l’application offline-first pour l’exécution.

---

# 104. Indicateur hors ligne

RECA App V2 doit afficher :

```text
Hors ligne
Certaines données peuvent être périmées.
```

---

# 105. Données périmées

Toujours afficher :

- dernière actualisation;
- état;
- possibilité de réessayer.

---

# 106. Skeletons

Les skeletons doivent suivre la forme réelle du contenu.

Éviter les grands rectangles génériques.

---

# 107. Spinners

Utiliser les spinners pour :

- petite action;
- bouton;
- attente courte.

Pour une page, préférer un skeleton.

---

# 108. Optimistic UI

Utiliser seulement pour des actions sûres.

Éviter sur :

- Paiements;
- géométrie;
- Mission;
- assignation;
- statut critique.

---

# 109. Toasts Mobile

Les toasts doivent :

- éviter la navigation inférieure;
- éviter la barre d’action;
- rester lisibles;
- permettre une action seulement si nécessaire.

---

# 110. Erreurs persistantes

Une erreur importante ne doit pas disparaître dans un toast.

Utiliser :

- bannière;
- carte d’erreur;
- état de page;
- AttentionItem.

---

# 111. Accessibilité clavier Desktop

Toutes les actions doivent être accessibles :

- Tab;
- Shift+Tab;
- Enter;
- Espace;
- Échap;
- flèches selon composant.

---

# 112. Focus visible

Le focus doit être visible dans les thèmes clair et sombre.

---

# 113. Focus après navigation

Après navigation :

- focus sur le titre;
- ou premier élément pertinent.

Après fermeture de modal :

- retour au déclencheur.

---

# 114. Lecteurs d’écran

Les composants doivent fournir :

- labels;
- rôles;
- états;
- descriptions;
- annonces;
- erreurs;
- progression.

---

# 115. Couleur

Aucune information ne doit dépendre uniquement de la couleur.

Exemple :

```text
Badge + icône + texte
```

---

# 116. Contraste

Objectif :

```text
WCAG 2.2 AA
```

pour le texte et les contrôles.

---

# 117. Réduction des mouvements

Respecter :

```text
prefers-reduced-motion
```

Réduire :

- transitions;
- animations;
- glissements;
- zooms.

---

# 118. Animations

Les animations doivent être :

- courtes;
- fonctionnelles;
- non bloquantes;
- rares.

---

# 119. Retour navigateur

Le bouton retour du navigateur et le geste iOS doivent fonctionner correctement.

Ne pas intercepter sans raison.

---

# 120. Deep links

Chaque fiche importante doit avoir une URL stable.

Exemples :

```text
/missions/:id
/contracts/:id
/invoices/:id
```

---

# 121. Ouverture depuis notification

Une notification doit ouvrir :

- l’entité;
- l’onglet;
- le problème;
- l’action pertinente.

---

# 122. Préservation du contexte

Après une action, conserver :

- filtre;
- onglet;
- date;
- sélection;
- carte;
- scroll;
- recherche.

---

# 123. Écrans minimums à maîtriser

Le système doit valider six familles responsive :

1. Centre des opérations.
2. Liste d’entités.
3. Fiche commerciale.
4. Fiche opérationnelle.
5. Formulaire complexe.
6. Carte ou flow immersif.

---

# 124. Centre des opérations Mobile

Ordre recommandé :

```text
Statut global
Action urgente
Mission active
À traiter
Problèmes
Ressources
Activité
```

La carte vient après l’essentiel ou s’ouvre plein écran.

---

# 125. Centre des opérations Tablette

Ordre possible :

```text
Résumé
Missions
À traiter
Carte
Ressources
Activité
```

---

# 126. Centre des opérations Desktop

Utiliser :

- largeur;
- grille;
- carte;
- listes;
- panneau à traiter;
- densité.

---

# 127. Liste d’entités Mobile

Exemple :

```text
Header
Résumé compact
Recherche
Filtres
Cartes
Charger plus
Bottom navigation
```

---

# 128. Liste d’entités Desktop

Exemple :

```text
PageHeader
Résumé
Toolbar
Table
Pagination
```

---

# 129. Fiche commerciale Mobile

Priorités :

- identité;
- statut;
- contact;
- prochaine action;
- relations;
- finances selon permission;
- historique.

---

# 130. Fiche opérationnelle Mobile

Priorités :

- statut;
- progression;
- ressource;
- problème;
- synchronisation;
- action.

---

# 131. Formulaire complexe Mobile

Priorités :

- étape;
- champ actuel;
- validation;
- actions;
- résumé final.

---

# 132. Formulaire complexe Desktop

Priorités :

- contexte;
- sections;
- comparaison;
- aperçu;
- résumé;
- actions.

---

# 133. Affichage des dates

Sur Mobile, utiliser des formats courts lorsque le contexte est clair.

Exemples :

```text
Aujourd’hui, 19 h 30
5 août
5 août 2026
```

---

# 134. Affichage des montants

Format :

```text
1 250,00 $
```

Éviter les colonnes trop larges.

---

# 135. Affichage des surfaces

Exemples :

```text
65 m²
700 pi²
```

La source autoritative demeure en mètres carrés.

---

# 136. Affichage des durées

Exemples :

```text
4 min 26 s
1 h 25
```

---

# 137. Téléphone

Sur Mobile, le téléphone doit être cliquable.

Action :

```text
Appeler
```

---

# 138. Courriel

Action :

```text
Envoyer un courriel
```

---

# 139. Adresse

Action :

```text
Ouvrir dans Maps
```

---

# 140. Menus contextuels

Les menus `⋮` regroupent :

- actions secondaires;
- actions rares;
- actions destructives.

Ils doivent être accessibles au clavier et tactilement.

---

# 141. Responsive par permission

L’interface doit filtrer les actions avant de construire le layout.

Une action interdite ne doit pas laisser un espace vide.

---

# 142. Responsive par rôle

Le rôle peut modifier :

- navigation;
- Dashboard;
- action principale;
- ordre;
- blocs;
- raccourcis.

---

# 143. Responsive par saison

En saison :

- Missions;
- Routes;
- ressources;
- problèmes.

Hors saison :

- Contrats;
- renouvellements;
- maintenance;
- ventes;
- finances.

---

# 144. Responsive et thème

Les thèmes clair et sombre doivent être testés sur tous les formats.

Le sombre demeure la direction visuelle principale.

---

# 145. Luminosité extérieure

RECA App V2 Mobile et RECA Opérateur doivent rester lisibles :

- au soleil;
- dans un véhicule;
- avec luminosité réduite;
- avec lunettes;
- avec contraste système.

---

# 146. PWA

RECA App V2 peut devenir installable.

Une PWA ne doit pas être déclarée complète avant validation :

- cache;
- mise à jour;
- icônes;
- offline;
- notifications;
- installation;
- sécurité.

---

# 147. Installation

L’installation peut être proposée seulement si elle apporte une vraie valeur.

---

# 148. Mise à jour PWA

Le système doit éviter une mise à jour disruptive au milieu d’un formulaire.

Afficher :

```text
Une nouvelle version est disponible.
```

Action :

```text
Mettre à jour
```

---

# 149. Compatibilité navigateur

Navigateurs cibles recommandés :

- Safari iOS récent;
- Chrome Android récent;
- Chrome Desktop récent;
- Edge récent;
- Safari macOS récent.

Les versions exactes doivent être définies dans les standards de développement.

---

# 150. Ancien appareil

L’application doit afficher un message clair si le navigateur est incompatible.

---

# 151. Performance perçue

Améliorer par :

- skeleton;
- préchargement;
- cache;
- transitions rapides;
- actions immédiates;
- état de mutation visible.

---

# 152. Budget de performance

Budgets initiaux à mesurer :

```text
Shell léger
Carte séparée
PDF séparé
Wizard séparé
Pas de dépendance volumineuse dans le bundle racine
```

---

# 153. Images

Utiliser :

- formats modernes;
- tailles adaptées;
- lazy loading;
- compression;
- dimensions explicites.

---

# 154. Photos terrain

Les vignettes doivent être optimisées.

L’original se charge à la demande.

---

# 155. Documents

Les PDF doivent s’ouvrir :

- dans une vue dédiée;
- ou dans le lecteur système;
- avec téléchargement contrôlé;
- avec permission.

---

# 156. Impression

Le PrintShell doit :

- retirer navigation;
- retirer actions;
- optimiser couleurs;
- afficher identité;
- afficher date;
- éviter les éléments interactifs.

---

# 157. Tests responsive obligatoires

Largeurs minimales :

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

# 158. Tests de hauteur

Tester aussi :

```text
667 px
844 px
896 px
1024 px
1366 px
```

---

# 159. Tests orientation

Tester :

- Mobile portrait;
- Mobile paysage;
- Tablette portrait;
- Tablette paysage.

---

# 160. Tests tactiles

Vérifier :

- target 44 px;
- gestes;
- scroll;
- drag;
- carte;
- bottom sheet;
- clavier;
- menus.

---

# 161. Tests clavier

Vérifier :

- navigation;
- focus;
- modal;
- table;
- menu;
- Command Palette;
- formulaires;
- carte alternative.

---

# 162. Tests lecteur d’écran

Scénarios :

- ouvrir une liste;
- ouvrir une fiche;
- remplir un formulaire;
- corriger une erreur;
- confirmer une action;
- lire une progression.

---

# 163. Tests zoom

Tester à :

```text
200 %
```

Les contenus doivent demeurer utilisables.

---

# 164. Tests texte agrandi

Tester les tailles de texte système sur Mobile.

---

# 165. Tests réseau

Scénarios :

```text
Connexion normale
Latence élevée
Coupure
Retour réseau
Réponse lente
Timeout
```

---

# 166. Tests de contexte

Vérifier :

- retour depuis fiche;
- filtres;
- scroll;
- onglet;
- rotation;
- reprise après clavier;
- retour après modal;
- deep link.

---

# 167. Tests visuels

Captures obligatoires pour chaque Master UI :

```text
Mobile clair
Mobile sombre
Tablette
Desktop
Grand écran
```

---

# 168. Fixtures responsive

Prévoir :

- titre long;
- adresse longue;
- numéro long;
- statut critique;
- aucune donnée;
- plusieurs actions;
- erreur;
- liste volumineuse;
- carte;
- clavier;
- contenu bilingue;
- montant élevé.

---

# 169. Visual regression

Créer des tests de régression visuelle pour :

- shell;
- navigation;
- Dashboard;
- listes;
- fiches;
- formulaires;
- modales;
- sheets;
- carte;
- thème.

---

# 170. Tests appareils réels

Avant production, tester au minimum sur :

- iPhone avec encoche;
- iPhone plus ancien;
- Android récent;
- iPad ou tablette équivalente;
- laptop;
- écran Desktop.

---

# 171. Chrome DevTools

Les émulations sont utiles.

Elles ne remplacent pas les tests réels pour :

- clavier;
- safe area;
- performance;
- tactile;
- Safari;
- carte;
- PWA.

---

# 172. Architecture de composants responsive

Direction recommandée :

```text
Shared business hooks
Shared domain logic
Shared data hooks
Specialized presentation
```

Exemple :

```text
useMissionDetail()
  ├── MissionDetailDesktop
  └── MissionDetailMobile
```

---

# 173. Éviter la duplication métier

Les composants spécialisés ne doivent pas dupliquer :

- calculs;
- permissions;
- mutations;
- validations;
- queries;
- statuts.

---

# 174. Hooks de breakpoint

Un hook de breakpoint peut contrôler la composition.

Éviter d’utiliser la largeur pour modifier les règles métier.

---

# 175. CSS first

Les changements purement visuels doivent utiliser CSS.

Les changements structurels peuvent utiliser des composants spécialisés.

---

# 176. Server rendering

Non requis pour la première version Vite.

La performance doit être améliorée avec :

- code splitting;
- préchargement;
- cache;
- bundles spécialisés.

---

# 177. Composants officiels à créer

```text
DesktopAppShell
TabletAppShell
MobileAppShell
FullscreenFlowShell

MobileHeader
DesktopPageHeader
MobileBottomNavigation
DesktopSidebar

ResponsiveEntityList
MobileEntityCard
DesktopEntityRow

ResponsiveEntityHeader
MobileActionBar
ResponsiveTabs

FilterSheet
ResponsiveDialog
BottomSheet
SidePanel

ResponsiveMapWorkspace
ResponsiveFormLayout
WizardNavigation
```

---

# 178. MobileEntityCard

Le composant de base doit supporter :

- title;
- subtitle;
- status;
- metadata;
- leading icon;
- trailing action;
- badges;
- disabled;
- selected;
- warning.

---

# 179. DesktopEntityRow

Doit supporter :

- colonnes;
- tri;
- sélection;
- statut;
- action;
- menu;
- focus;
- densité.

---

# 180. ResponsiveEntityHeader

Doit supporter :

- numéro;
- titre;
- statut;
- métadonnées;
- action primaire;
- actions secondaires;
- menu;
- version Mobile/Desktop.

---

# 181. MobileActionBar

Doit supporter :

- action primaire;
- action secondaire;
- loading;
- disabled;
- safe area;
- clavier;
- montant ou résumé.

---

# 182. FilterSheet

Doit supporter :

- filtres;
- compte;
- réinitialiser;
- appliquer;
- état persistant;
- accessibilité.

---

# 183. ResponsiveMapWorkspace

Doit supporter :

- liste + carte Desktop;
- carte + sheet Tablette;
- Liste | Carte Mobile;
- sélection partagée;
- légende;
- controls;
- erreurs;
- loading.

---

# 184. Standards de code

Les composants doivent éviter :

- valeurs de largeur dispersées;
- media queries ad hoc;
- logique répétée;
- classes arbitraires non tokenisées;
- détection User-Agent inutile.

---

# 185. Tokens responsive

Centraliser :

```text
breakpoints
page padding
shell height
bottom nav height
header height
safe area
content max width
map minimum height
touch target
```

---

# 186. CSS container queries

Les container queries peuvent être utilisées pour les composants réutilisables.

Elles ne remplacent pas les breakpoints du shell.

---

# 187. Résolution de contenu

Les composants doivent s’adapter à leur conteneur.

Exemple :

- widget Dashboard;
- carte Mission;
- tableau financier;
- résumé Client.

---

# 188. Mesures à suivre

Mesurer :

- utilisation Mobile;
- actions principales;
- erreurs Mobile;
- abandons de formulaire;
- temps de chargement;
- clics sur filtres;
- ouverture de carte;
- rotations;
- taille de viewport.

---

# 189. Analytics respectueuses

Ne pas enregistrer :

- contenu de champs;
- adresses complètes;
- informations financières sensibles;
- positions;
- données personnelles.

---

# 190. Critères de réussite Mobile

Le Mobile est réussi si un utilisateur peut :

- comprendre l’état en quelques secondes;
- ouvrir l’entité;
- contacter;
- effectuer l’action principale;
- lire le statut;
- revenir sans perdre le contexte;
- utiliser le clavier;
- naviguer d’une seule main lorsque possible.

---

# 191. Critères de réussite Tablette

La Tablette est réussie si elle permet :

- supervision;
- carte;
- répartition;
- formulaire;
- mesure;
- interaction tactile;
- mode portrait et paysage.

---

# 192. Critères de réussite Desktop

Le Desktop est réussi si :

- la largeur est exploitée;
- les listes sont denses;
- les cartes sont utiles;
- la comparaison est facile;
- les actions sont claires;
- les formulaires complexes sont confortables.

---

# 193. Critères de réussite technique

L’expérience responsive doit :

- partager la logique;
- spécialiser la présentation;
- conserver les URLs;
- respecter les permissions;
- fonctionner avec les thèmes;
- respecter les safe areas;
- être accessible;
- être performante;
- être testée sur appareils réels.

---

# 194. Ce qui doit être évité

Ne pas :

- cacher la navigation importante sur Mobile;
- empiler toutes les cartes Desktop;
- utiliser des tables illisibles;
- garder des modales trop grandes;
- créer un double scroll;
- couper les actions sous la safe area;
- placer un bouton sous le clavier;
- répéter le titre;
- montrer les actions destructives en premier;
- charger Mapbox sur toutes les routes;
- dépendre du hover;
- dépendre uniquement de la couleur;
- afficher une donnée périmée comme actuelle;
- mélanger RECA App V2 et RECA Opérateur.

---

# 195. Hors périmètre initial

Ne pas bloquer la V1 avec :

- personnalisation complète du layout;
- widgets déplaçables;
- mode kiosque;
- support smartwatch;
- support CarPlay;
- commandes vocales;
- réalité augmentée;
- gestes avancés;
- application Desktop native;
- offline administratif complet;
- interface téléviseur;
- multi-fenêtres avancées.

---

# 196. Décisions à confirmer

Avant l’implémentation finale, confirmer :

- navigation Mobile par rôle;
- comportement Tablette portrait;
- largeur de sidebar;
- routes plein écran;
- action flottante;
- filtres Mobile;
- pagination Mobile;
- usage des onglets;
- mode Liste | Carte;
- comportement PWA;
- navigateurs supportés;
- budgets de performance;
- offline administratif;
- taille de texte;
- flows spécialisés Mobile;
- comportement du clavier;
- outil de mesure Mobile.

Toutes les décisions confirmées doivent être ajoutées à `memory.md`.

---

# 197. Règles non négociables

Ne jamais traiter le Mobile comme un Desktop rétréci.

Ne jamais dupliquer la logique métier entre Mobile et Desktop.

Ne jamais cacher une action urgente derrière plusieurs niveaux.

Ne jamais dépendre du hover.

Ne jamais utiliser une carte minuscule pour une tâche cartographique.

Ne jamais utiliser une modale Desktop pleine largeur sur Mobile.

Ne jamais placer une action sous la safe area.

Ne jamais perdre le contexte au retour.

Ne jamais forcer un tableau Desktop illisible sur Mobile.

Ne jamais masquer une erreur persistante dans un toast.

Ne jamais laisser le clavier cacher l’action principale.

Ne jamais faire de RECA App V2 Mobile un remplacement de RECA Opérateur.

---

# 198. Diagramme général

```text
Routes et données partagées
          ↓
Hooks applicatifs
          ↓
Présentation responsive
  ┌───────────┬────────────┬─────────────┐
  │ Mobile    │ Tablette   │ Desktop     │
  │ Actions   │ Carte      │ Densité     │
  │ rapides   │ tactile    │ Analyse     │
  └───────────┴────────────┴─────────────┘
```

---

# 199. Flux de liste responsive

```text
Query serveur
  ↓
Résultats
  ↓
DesktopEntityRow
ou
MobileEntityCard
  ↓
Fiche stable par URL
  ↓
Retour avec contexte
```

---

# 200. Flux de formulaire responsive

```text
Schéma partagé
  ↓
État partagé
  ↓
Layout Desktop ou Mobile
  ↓
Validation
  ↓
Mutation unique
  ↓
Navigation
```

---

# 201. Résumé officiel

RECA App V2 possède une expérience distincte pour Mobile, Tablette et Desktop.

Le Desktop favorise la densité, la planification et la comparaison.

La Tablette favorise la supervision tactile, la carte et la mobilité.

Le Mobile favorise la consultation rapide et les actions urgentes.

RECA Opérateur demeure l’application spécialisée pour l’exécution terrain.

Les shells, navigations, listes, fiches, formulaires et cartes s’adaptent au contexte.

La logique métier demeure partagée.

La présentation peut être spécialisée.

Les safe areas, le clavier, le tactile, le scroll, l’accessibilité et la performance sont des exigences de base.

L’objectif est de fournir une application réellement utilisable sur chaque format, plutôt qu’une seule interface simplement compressée.
