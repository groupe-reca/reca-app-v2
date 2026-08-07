# 01-Design-System.md

# RECA
## Design System du Centre des opérations

Version : 1.0  
Projet : RECA App V2  
Dépôt recommandé : `reca-app-v2`  
Statut : Direction visuelle officielle  

---

# 1. Objectif du document

Ce document définit le système visuel et les règles d’expérience de RECA App V2.

Il sert de référence pour :

- les maquettes Fable;
- les composants React;
- les design tokens;
- les thèmes;
- la navigation;
- les listes;
- les fiches;
- les formulaires;
- les tableaux de bord;
- les cartes géographiques;
- les états opérationnels;
- les expériences desktop, tablette et mobile;
- les tests visuels;
- les futures extensions du produit.

Le design system doit empêcher chaque module de créer sa propre interprétation visuelle.

Il doit permettre de construire une application cohérente sans rendre tous les écrans identiques.

---

# 2. Vision visuelle

RECA App V2 doit donner l’impression d’un produit :

- conçu spécifiquement pour Groupe RECA;
- robuste;
- précis;
- organisé;
- rapide;
- opérationnel;
- moderne;
- professionnel;
- adapté à l’hiver québécois.

Le produit doit appartenir à la même famille que RECA Opérateur.

Les deux applications doivent partager :

- la marque;
- les couleurs principales;
- la typographie;
- les statuts fonctionnels;
- les principes de hiérarchie;
- la qualité des animations;
- les composants essentiels;
- la sensation de précision.

Elles ne doivent toutefois pas utiliser exactement la même composition.

```text
RECA Opérateur
Application terrain
Map First
Mono-mission
Actions très limitées
Utilisation dans un véhicule

RECA App V2
Centre de commandement
Data + Map
Multi-mission
Gestion et supervision
Utilisation bureau, tablette et mobile
```

La cohérence doit provenir du système commun, pas de la copie des écrans.

---

# 3. Principes fondamentaux

## 3.1 L’état avant la décoration

Chaque écran doit montrer clairement :

- l’état actuel;
- la progression;
- les alertes;
- les données critiques;
- la prochaine action.

Les effets visuels ne doivent jamais masquer ces informations.

---

## 3.2 Une hiérarchie forte

Chaque écran possède :

1. une information principale;
2. une action principale;
3. des actions secondaires;
4. des informations de soutien;
5. des métadonnées.

Tous les éléments ne doivent pas avoir le même poids visuel.

---

## 3.3 La carte n’est pas toujours une Card

Les grandes surfaces doivent être utilisées avec intention.

Éviter :

```text
Fond
  └── Carte
       └── Carte
            └── Rangée
                 └── Badge
```

Une Card représente une vraie section.

À l’intérieur d’une Card, préférer :

- des rangées;
- des séparateurs;
- des groupes;
- des labels;
- des fonds secondaires subtils.

---

## 3.4 Densité adaptée au contexte

Les écrans opérationnels doivent être plus denses que les écrans marketing.

Les formulaires doivent rester aérés.

Les listes desktop doivent permettre une lecture rapide de plusieurs éléments.

Le mobile doit montrer l’essentiel sans utiliser de cartes surdimensionnées.

---

## 3.5 Une seule action principale

Un écran ne doit généralement contenir qu’une seule action dominante.

Exemples :

- Créer une mission;
- Créer un contrat;
- Enregistrer;
- Assigner;
- Démarrer;
- Résoudre le problème.

Les actions destructives ne doivent pas rivaliser visuellement avec l’action principale.

---

## 3.6 Les couleurs ont une fonction

Le rouge RECA n’est pas la couleur universelle de tous les éléments actifs.

Les couleurs fonctionnelles conservent leur sens :

- rouge : marque, critique, erreur, destructif;
- vert : succès, actif, terminé;
- bleu : information, navigation, lien;
- ambre : attention, attente, risque;
- gris : secondaire, inactif, inconnu.

---

## 3.7 Le mobile est une expérience distincte

Le mobile ne doit pas être une page desktop empilée verticalement.

Il doit posséder :

- une hiérarchie plus courte;
- des actions collantes;
- des cartes plus compactes;
- des menus condensés;
- des bottom sheets lorsque pertinent;
- une navigation adaptée au rôle.

---

# 4. Identité de marque

## 4.1 Logo officiel

Toujours utiliser les vrais assets officiels de Groupe RECA.

Claude ne doit jamais :

- redessiner le logo;
- recréer le flocon avec une icône générique;
- retaper le nom RECA pour simuler le logo;
- modifier les proportions;
- ajouter une ombre;
- changer les couleurs;
- étirer le logo;
- utiliser un ancien logo sans validation.

Versions minimales à fournir dans le dépôt :

```text
assets/brand/
├── logo-horizontal-dark.svg
├── logo-horizontal-light.svg
├── logo-symbol.svg
├── app-icon.svg
└── favicon.svg
```

Les noms définitifs doivent correspondre aux fichiers réellement fournis.

---

## 4.2 Nom affiché

Dans l’application :

```text
RECA
Centre des opérations
```

Éviter d’afficher publiquement :

```text
RECA App V2
reca-app-v2
```

Ces noms sont techniques.

---

## 4.3 Relation avec RECA Opérateur

Le Centre des opérations et RECA Opérateur doivent être reconnaissables comme deux produits de la même organisation.

Éléments communs :

- logo;
- rouge de marque;
- bleu nuit;
- typographie;
- style des statuts;
- boutons;
- rayons;
- ombres;
- langage des alertes;
- iconographie.

Différences assumées :

- RECA Opérateur utilise davantage le fond sombre et la carte immersive;
- RECA App V2 utilise davantage de panneaux, de données denses et de surfaces de travail;
- RECA App V2 doit être confortable pour de longues sessions administratives.

---

# 5. Thèmes

## 5.1 Thème principal

Le thème sombre constitue la direction visuelle principale et la référence de marque.

Il doit être utilisé en priorité pour :

- la connexion;
- la navigation principale;
- le Centre des opérations;
- les cartes opérationnelles;
- les vues de mission;
- les vues temps réel;
- les écrans de supervision.

---

## 5.2 Thème clair

Le thème clair doit être entièrement supporté.

Il est particulièrement utile pour :

- les formulaires longs;
- les documents;
- les finances;
- les tableaux denses;
- les impressions;
- les environnements très éclairés.

Le thème clair ne doit pas être une inversion automatique naïve du thème sombre.

---

## 5.3 Choix de thème

Valeurs recommandées :

```ts
type ThemePreference = 'system' | 'dark' | 'light'
```

Le choix doit être conservé par utilisateur.

Le système doit respecter les préférences d’accessibilité du système d’exploitation lorsque `system` est sélectionné.

---

# 6. Palette de marque

Les valeurs suivantes constituent la base officielle initiale.

Elles doivent être validées avec les assets réels avant le verrouillage final du Master UI.

## 6.1 Couleurs principales

| Token | Valeur initiale | Usage |
|---|---:|---|
| `brand.red` | `#ED1C24` | Marque, action primaire, critique |
| `brand.redHover` | `#D9161E` | Survol action primaire |
| `brand.redPressed` | `#BE1118` | État pressé |
| `brand.navy` | `#0F172A` | Navigation, fonds sombres |
| `brand.navyDeep` | `#08111F` | Fond sombre principal |
| `brand.navyRaised` | `#131E33` | Surfaces sombres élevées |
| `brand.blueLogo` | `#193557` | Bleu historique du mot-symbole lorsque requis |
| `brand.white` | `#FFFFFF` | Texte et surfaces principales |

La valeur finale du rouge doit provenir du logo officiel ou de la charte Groupe RECA si celle-ci fournit une valeur plus précise.

---

## 6.2 Couleurs fonctionnelles

| Token | Valeur initiale | Usage |
|---|---:|---|
| `status.success` | `#16A36A` | Actif, terminé, valide |
| `status.successSoft` | `#DDF7EB` | Fond de badge succès |
| `status.info` | `#2F7DE1` | Information, navigation, lien |
| `status.infoSoft` | `#E2EEFF` | Fond information |
| `status.warning` | `#D98A0A` | Attention, attente |
| `status.warningSoft` | `#FFF1D6` | Fond attention |
| `status.danger` | `#D92D3A` | Erreur, problème, retard |
| `status.dangerSoft` | `#FDE4E7` | Fond erreur |
| `status.neutral` | `#64748B` | Inactif, inconnu |
| `status.neutralSoft` | `#E8EDF3` | Fond neutre |

Les teintes doivent conserver un contraste accessible dans les deux thèmes.

---

## 6.3 Couleurs de zones de déneigement

Les zones de carte doivent utiliser une palette distincte des statuts métier.

Exemple initial :

| Type de zone | Couleur |
|---|---:|
| Entrée | `#3B82F6` |
| Stationnement | `#8B5CF6` |
| Trottoir | `#14B8A6` |
| Escaliers | `#F59E0B` |
| Aire de manœuvre | `#EC4899` |
| Terrasse | `#22C55E` |
| Autre | `#64748B` |

Ces couleurs servent à différencier les surfaces.

Elles ne doivent pas être interprétées comme des statuts.

---

# 7. Tokens sémantiques

Les composants ne doivent pas dépendre directement des couleurs de marque.

Ils doivent utiliser des tokens sémantiques.

Exemple :

```ts
export const semanticColors = {
  background: 'var(--color-background)',
  surface: 'var(--color-surface)',
  surfaceRaised: 'var(--color-surface-raised)',
  surfaceSunken: 'var(--color-surface-sunken)',
  textPrimary: 'var(--color-text-primary)',
  textSecondary: 'var(--color-text-secondary)',
  textMuted: 'var(--color-text-muted)',
  border: 'var(--color-border)',
  borderStrong: 'var(--color-border-strong)',
  focus: 'var(--color-focus)',
}
```

---

## 7.1 Thème sombre

```css
[data-theme='dark'] {
  --color-background: #08111f;
  --color-surface: #0f1a2d;
  --color-surface-raised: #152238;
  --color-surface-sunken: #0a1424;
  --color-surface-hover: #1a2941;

  --color-text-primary: #f8fafc;
  --color-text-secondary: #c4cede;
  --color-text-muted: #8795aa;
  --color-text-disabled: #58667a;

  --color-border: rgba(148, 163, 184, 0.16);
  --color-border-strong: rgba(148, 163, 184, 0.28);
  --color-focus: #5ea0ff;
}
```

---

## 7.2 Thème clair

```css
[data-theme='light'] {
  --color-background: #f3f5f8;
  --color-surface: #ffffff;
  --color-surface-raised: #ffffff;
  --color-surface-sunken: #edf1f5;
  --color-surface-hover: #f6f8fa;

  --color-text-primary: #111827;
  --color-text-secondary: #475569;
  --color-text-muted: #718096;
  --color-text-disabled: #a0aaba;

  --color-border: rgba(15, 23, 42, 0.10);
  --color-border-strong: rgba(15, 23, 42, 0.18);
  --color-focus: #2f7de1;
}
```

---

# 8. Typographie

## 8.1 Police principale

Police officielle de l’interface :

```text
Manrope
```

Police de repli :

```css
font-family: 'Manrope', Inter, system-ui, -apple-system, BlinkMacSystemFont,
  'Segoe UI', sans-serif;
```

Le logo conserve sa typographie officielle.

---

## 8.2 Principes typographiques

- peu de tailles;
- poids clairement hiérarchisés;
- nombres importants très lisibles;
- labels courts;
- texte secondaire discret;
- aucune utilisation excessive des majuscules;
- interlignage confortable;
- chiffres tabulaires pour les montants et les chronomètres.

---

## 8.3 Échelle typographique desktop

| Token | Taille | Hauteur | Poids | Usage |
|---|---:|---:|---:|---|
| `display-lg` | 36 px | 44 px | 700 | Titre exceptionnel |
| `display-md` | 30 px | 38 px | 700 | Titre de Dashboard |
| `heading-xl` | 26 px | 34 px | 700 | Titre de page |
| `heading-lg` | 22 px | 30 px | 700 | Titre de section |
| `heading-md` | 18 px | 26 px | 650 | Titre de Card |
| `heading-sm` | 16 px | 24 px | 650 | Sous-section |
| `body-lg` | 16 px | 25 px | 450 | Texte principal |
| `body-md` | 14 px | 22 px | 450 | Corps standard |
| `body-sm` | 13 px | 20 px | 450 | Texte secondaire |
| `label-md` | 13 px | 18 px | 600 | Label de contrôle |
| `label-sm` | 12 px | 16 px | 650 | Badge, méta |
| `caption` | 11 px | 15 px | 550 | Micro-information |

---

## 8.4 Échelle typographique mobile

| Token | Taille | Usage |
|---|---:|---|
| `mobile-title` | 24 px | Titre principal |
| `mobile-heading` | 18 px | Section |
| `mobile-card-title` | 16 px | Card |
| `mobile-body` | 15 px | Corps |
| `mobile-label` | 13 px | Labels |
| `mobile-caption` | 12 px | Métadonnées |

Les champs `input`, `select` et `textarea` doivent utiliser au moins `16 px` sur iOS afin d’éviter le zoom automatique.

---

## 8.5 Nombres et montants

Les montants, durées et statistiques doivent utiliser :

```css
font-variant-numeric: tabular-nums;
```

Exemples :

```text
18 / 28
2 h 14
1 249,99 $
64 %
```

---

# 9. Espacement

Utiliser une échelle de 4 px.

```ts
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
}
```

---

## 9.1 Espacement recommandé

| Contexte | Espacement |
|---|---:|
| Icône + texte | 8 px |
| Champs liés | 12 px |
| Éléments dans une Card | 16 px |
| Sections d’une Card | 20–24 px |
| Cards d’une page | 16–24 px |
| Grandes sections | 32 px |
| Contenu desktop | 24–32 px |
| Contenu mobile | 16 px |

---

## 9.2 Densité

Trois densités sont prévues :

```ts
type Density = 'compact' | 'comfortable' | 'spacious'
```

### Compact

Pour :

- tableaux;
- MissionItems;
- paiements;
- historiques;
- listes importantes;
- supervision.

### Comfortable

Valeur par défaut.

Pour :

- listes standards;
- fiches;
- Dashboard;
- paramètres.

### Spacious

Pour :

- connexion;
- états vides;
- confirmation;
- formulaires simples;
- pages publiques.

---

# 10. Rayons

| Token | Valeur | Usage |
|---|---:|---|
| `radius-sm` | 6 px | Petits badges |
| `radius-md` | 10 px | Contrôles |
| `radius-lg` | 14 px | Panneaux |
| `radius-card` | 16 px | Cards principales |
| `radius-xl` | 20 px | Modal, panneau spécial |
| `radius-pill` | 999 px | Chip, filtre, statut |

Les rayons doivent rester cohérents avec RECA Opérateur.

Éviter des Cards excessivement arrondies qui donnent une impression grand public ou ludique.

---

# 11. Bordures et séparateurs

Les bordures doivent être discrètes.

Priorité :

```text
Contraste de surface
      ↓
Ombre légère
      ↓
Bordure subtile
```

Éviter les grandes Cards entourées d’une bordure sombre rigide.

Utiliser des séparateurs internes pour structurer les listes.

---

# 12. Ombres

## 12.1 Ombre de Card

```css
--shadow-card-light:
  0 1px 2px rgba(15, 23, 42, 0.04),
  0 8px 24px rgba(15, 23, 42, 0.06);

--shadow-card-dark:
  0 1px 2px rgba(0, 0, 0, 0.18),
  0 12px 32px rgba(0, 0, 0, 0.16);
```

## 12.2 Ombre flottante

Utilisée pour :

- dropdown;
- modal;
- panneau flottant;
- commandes sur carte;
- bottom sheet.

Elle doit rester douce et teintée par le bleu nuit plutôt que par du noir pur.

---

# 13. Grille et largeur

## 13.1 Breakpoints initiaux

```ts
export const breakpoints = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
}
```

La classification finale doit être centralisée dans un hook ou service unique.

---

## 13.2 Largeur du contenu

Le contenu ne doit pas toujours occuper toute la largeur disponible.

Valeurs recommandées :

```text
Formulaire simple : 720 px
Formulaire complexe : 1100–1280 px
Fiche détail : 1400 px maximum
Dashboard : fluide, 1600 px maximum
Carte opérationnelle : fluide
```

---

## 13.3 Grilles desktop

Grilles recommandées :

```text
12 colonnes
24 px de gouttière
```

Exemples :

```text
Fiche commerciale
8 colonnes contenu + 4 colonnes résumé

Fiche opérationnelle
7 colonnes carte + 5 colonnes état

Route
5 colonnes liste + 7 colonnes carte
```

---

# 14. Surfaces

## 14.1 Background

Fond général de l’application.

Il ne doit pas attirer l’attention.

---

## 14.2 Surface

Card ou panneau standard.

---

## 14.3 Surface Raised

Utilisée pour :

- éléments flottants;
- menus;
- commandes;
- Card sélectionnée;
- panneau important.

---

## 14.4 Surface Sunken

Utilisée pour :

- groupes de champs;
- rangées secondaires;
- zones internes;
- code;
- métadonnées.

---

## 14.5 Glass

Le glassmorphism doit être réservé à :

- la carte;
- la supervision temps réel;
- quelques panneaux flottants;
- RECA Opérateur.

Il ne doit pas être utilisé sur toutes les pages administratives.

---

# 15. Iconographie

## 15.1 Bibliothèque

Utiliser une seule bibliothèque d’icônes principale.

Recommandation :

```text
Lucide
```

Les icônes personnalisées doivent être réservées aux besoins métier particuliers.

---

## 15.2 Tailles

| Usage | Taille |
|---|---:|
| Dans un bouton | 16–18 px |
| Navigation | 18–20 px |
| Card | 20–24 px |
| État vide | 32–40 px |
| Carte opérationnelle | 20–28 px |

---

## 15.3 Règles

- même épaisseur de trait;
- aucun mélange de styles plein et contour sans raison;
- une icône ne remplace pas un label important;
- les actions ambiguës doivent avoir un tooltip;
- les icônes destructives utilisent le rouge seulement au survol ou dans un contexte confirmé.

---

# 16. Boutons

## 16.1 Variantes officielles

```ts
type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'info'
  | 'success'
  | 'danger'
  | 'ghost'
  | 'icon'
```

---

## 16.2 Bouton Primary

Usage : action principale de l’écran.

Style :

- rouge RECA;
- texte blanc;
- contraste élevé;
- une seule action principale par zone.

Exemples :

- Créer une mission;
- Nouveau contrat;
- Enregistrer;
- Assigner.

---

## 16.3 Bouton Secondary

Usage : action importante mais secondaire.

Style :

- surface neutre;
- bordure subtile;
- texte principal.

---

## 16.4 Bouton Tertiary ou Ghost

Usage :

- action locale;
- navigation secondaire;
- outils;
- fermeture.

---

## 16.5 Bouton Danger

Le bouton Danger ne doit pas être visible par défaut dans les headers, sauf nécessité opérationnelle explicite.

Préférer :

```text
Menu ⋮
  └── Archiver
  └── Annuler
  └── Supprimer
```

---

## 16.6 Tailles

| Taille | Hauteur | Usage |
|---|---:|---|
| `sm` | 32 px | Tableau, action compacte |
| `md` | 40 px | Défaut desktop |
| `lg` | 48 px | Mobile, action principale |
| `xl` | 56 px | Action terrain exceptionnelle |

Cible tactile minimale :

```text
44 × 44 px
```

---

## 16.7 États

Tous les boutons doivent posséder :

- default;
- hover;
- pressed;
- focus-visible;
- disabled;
- loading.

Le loading ne doit pas changer la largeur du bouton.

---

# 17. Actions d’en-tête

Structure officielle :

```text
Titre + statut
Information secondaire

[Action principale] [Action rapide] [⋮]
```

Règles :

- une action primaire;
- maximum deux actions visibles supplémentaires sur desktop;
- mobile : une action visible, le reste dans `⋮`;
- actions destructives dans `⋮`;
- téléphone, courriel et Maps peuvent devenir des actions rapides iconiques;
- toute icône seule possède un label accessible.

---

# 18. Champs de formulaire

## 18.1 Hauteur

```text
Desktop : 40–44 px
Mobile : 48 px
```

---

## 18.2 Structure

```text
Label
Contrôle
Texte d’aide ou erreur
```

Le placeholder ne remplace jamais le label.

---

## 18.3 États

- normal;
- hover;
- focus;
- rempli;
- erreur;
- succès facultatif;
- désactivé;
- lecture seule.

---

## 18.4 Erreurs

Une erreur doit :

- être placée près du champ;
- être compréhensible;
- expliquer la correction attendue;
- ne pas dépendre uniquement du rouge;
- être résumée dans les formulaires complexes.

Exemple :

```text
Le numéro de téléphone doit contenir 10 chiffres.
```

Éviter :

```text
Valeur invalide.
```

---

## 18.5 Groupes de champs

Les formulaires longs doivent être organisés par sections.

Exemple :

```text
Informations principales
Coordonnées
Adresse
Affectation
Paramètres avancés
```

---

# 19. Formulaires complexes

Les formulaires complexes utilisent :

- un Wizard;
- des onglets lorsque l’ordre n’est pas linéaire;
- une barre d’action collante;
- un résumé permanent sur desktop lorsque pertinent;
- un résumé accessible à la demande sur mobile;
- une indication des erreurs par étape;
- une sauvegarde brouillon lorsque nécessaire.

Ne pas utiliser une longue page de plus de plusieurs écrans sans structure.

---

# 20. Cards

## 20.1 Variantes

```ts
type CardVariant =
  | 'default'
  | 'interactive'
  | 'selected'
  | 'operational'
  | 'warning'
  | 'danger'
  | 'flat'
```

---

## 20.2 Card Default

- surface standard;
- ombre douce;
- titre clair;
- contenu organisé;
- pas de bordure lourde.

---

## 20.3 Card Interactive

- zone entière cliquable;
- hover perceptible;
- focus visible;
- chevron facultatif;
- curseur approprié.

---

## 20.4 Card Operational

Utilisée pour :

- mission;
- problème;
- opérateur;
- équipement;
- progression.

Elle peut utiliser :

- un accent coloré;
- une progression;
- une heure de mise à jour;
- un statut;
- une action rapide.

---

## 20.5 Card mobile

Une Card mobile doit être compacte.

Éviter les cartes de statistiques occupant presque toute la hauteur de l’écran.

Afficher plusieurs informations importantes dans le premier viewport.

---

# 21. Rangées d’entités

Une rangée standard doit pouvoir afficher :

```text
Icône ou identifiant
Titre principal
Information secondaire
Date ou statut
Montant ou progression
Chevron ou action
```

Le composant doit exister en variantes :

- comfortable;
- compact;
- mobile.

Toute la rangée doit généralement être cliquable.

---

# 22. Listes et tableaux

## 22.1 Desktop

Deux modes doivent être prévus :

```text
Vue confortable
Cards ou rangées détaillées

Vue compacte
Tableau ou rangées denses
```

Les modules pouvant bénéficier fortement d’une vue compacte :

- Missions;
- MissionItems;
- Contrats;
- Factures;
- Paiements;
- Historique;
- Événements.

---

## 22.2 Mobile

Les tableaux deviennent :

- Cards;
- rangées;
- groupes;
- listes virtualisées lorsque nécessaire.

Éviter le défilement horizontal d’un tableau complet.

---

## 22.3 En-tête de liste

Structure :

```text
Titre                              [Créer]
Résumé ou statistiques
Recherche
Filtres
Tri + densité + vue
Liste
```

Le nombre de cartes statistiques doit rester limité.

Afficher uniquement les métriques qui influencent une décision.

---

## 22.4 Filtres

Utiliser :

- chips pour 3 à 6 filtres fréquents;
- panneau avancé pour les autres;
- résumé des filtres actifs;
- bouton pour tout effacer.

Les filtres doivent rester visibles ou facilement accessibles pendant le défilement.

---

# 23. Statistiques

## 23.1 StatCard

Une StatCard contient :

- un label;
- une valeur;
- une unité facultative;
- une variation facultative;
- une icône facultative;
- une action facultative.

---

## 23.2 Limites

Sur mobile, préférer :

```text
Grille 2 × 2 compacte
```

ou :

```text
Bandeau horizontal défilable
```

Éviter une StatCard pleine largeur très haute pour une seule valeur.

---

## 23.3 Statistiques opérationnelles

Prioritaires :

- missions actives;
- progression;
- problèmes;
- opérateurs disponibles;
- équipements disponibles;
- synchronisation;
- éléments sans assignation.

---

# 24. Badges et statuts

## 24.1 Structure

Un badge doit contenir :

- un label court;
- une couleur fonctionnelle;
- éventuellement un point ou une icône;
- un contraste accessible.

---

## 24.2 Exemple de statuts

```text
ACTIF
PLANIFIÉE
EN COURS
TERMINÉE
EN ATTENTE
À SIGNER
BROUILLON
PROBLÈME
EN RETARD
HORS LIGNE
SYNCHRONISATION EN ATTENTE
```

Les libellés affichés peuvent être en majuscules courtes.

Les valeurs de code demeurent en anglais ou selon les conventions techniques officielles.

---

## 24.3 Couleur et texte

Ne jamais afficher uniquement une couleur sans texte ou symbole.

Exemple correct :

```text
● EN COURS
```

---

# 25. Progression

La progression doit pouvoir être montrée sous plusieurs formes :

- barre;
- anneau;
- fraction;
- pourcentage;
- étapes;
- timeline.

Pour une mission :

```text
18 / 28 résidences
64 %
```

Le nombre brut doit accompagner le pourcentage.

---

# 26. Onglets

Les onglets sont utilisés lorsque l’entité possède plusieurs domaines d’information réels.

Exemples :

```text
Client
- Informations
- Contrats
- Factures
- Documents
- Historique
```

```text
Mission
- Résidences
- Problèmes
- Historique
```

Ne pas ajouter des onglets pour masquer une mauvaise hiérarchie.

Mobile :

- onglets horizontaux défilables;
- maximum de labels courts;
- onglet actif clairement visible;
- contenu conservé lorsque pertinent.

---

# 27. Navigation desktop

## 27.1 Sidebar

La sidebar utilise le bleu nuit.

Elle contient :

- logo;
- groupes de modules;
- état actif;
- profil;
- paramètres;
- possibilité de réduction si validée.

Structure recommandée :

```text
CENTRE DES OPÉRATIONS
- Aujourd’hui

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

---

## 27.2 Élément actif

L’état actif doit utiliser :

- un fond distinct;
- un accent;
- un texte plus fort;
- pas uniquement une icône rouge.

---

## 27.3 Sidebar réduite

Si un mode réduit est implanté :

- garder les tooltips;
- conserver le logo symbole;
- ne pas perdre l’accès aux groupes;
- mémoriser la préférence.

---

# 28. Navigation mobile

## 28.1 Bottom Navigation

Maximum recommandé :

```text
5 entrées
```

Structure opérationnelle initiale :

```text
Accueil
Missions
Routes
Clients
Menu
```

La sélection exacte doit pouvoir varier selon le rôle ou les modules épinglés.

---

## 28.2 Header mobile

Le Header mobile affiche :

- retour seulement sur une vraie page imbriquée;
- titre réel de l’entité;
- une action principale;
- menu `⋮`.

Éviter :

```text
Détail
```

Préférer :

```text
Mission #9
Route LaSalle
CTR-000056
```

---

## 28.3 Flows plein écran

Le Bottom Nav doit pouvoir disparaître pour :

- Wizard;
- carte plein écran;
- éditeur de zone;
- flow critique;
- visualisation immersive.

Cette règle doit être déclarative dans le routeur.

---

# 29. Breadcrumbs

Format :

```text
Centre des opérations
› Missions
› Mission #9
```

Règles :

- tous les niveaux précédents sont cliquables;
- la page courante ne l’est pas;
- utiliser le vrai identifiant ou nom;
- ne pas afficher `Détail` lorsque l’entité est connue;
- les breadcrumbs doivent provenir d’une convention de routage commune.

---

# 30. Recherche globale

La recherche globale doit être accessible par :

- une zone dans le header;
- un raccourci `⌘ K` / `Ctrl K`;
- une action mobile.

Elle doit afficher des résultats regroupés :

```text
Clients
Contrats
Routes
Missions
Factures
Équipements
```

Chaque résultat contient :

- type;
- identifiant;
- titre;
- information secondaire;
- statut;
- destination.

---

# 31. Command Palette

La Command Palette pourra également contenir :

- actions récentes;
- navigation;
- création rapide;
- raccourcis;
- éléments récemment consultés.

Exemples :

```text
Créer une mission
Ouvrir les problèmes
Rechercher 224 rue Scott
Nouveau client
```

---

# 32. Modals

Les Modals sont réservées aux actions :

- courtes;
- transitoires;
- bloquantes;
- qui ne justifient pas une page.

Exemples :

- confirmation;
- modification d’une note;
- assignation rapide;
- résolution d’un problème.

Une création d’entité complète doit généralement utiliser une page dédiée.

---

# 33. Bottom Sheets

Les Bottom Sheets sont privilégiées sur mobile pour :

- contenu persistant au-dessus d’une carte;
- détail rapide;
- filtres;
- actions contextuelles;
- menu complémentaire.

Snap points possibles :

```text
peek
half
full
```

Le contenu interne doit demeurer défilable sans déplacer involontairement la feuille.

---

# 34. Drawers

Les Drawers sont utilisés pour :

- filtres avancés desktop;
- détails complémentaires;
- configuration rapide;
- historique secondaire.

Ils ne doivent pas remplacer une vraie fiche détail lorsque plusieurs actions sont nécessaires.

---

# 35. Dropdowns

Les Dropdowns doivent :

- détecter les collisions du viewport;
- être accessibles au clavier;
- fonctionner au toucher;
- se fermer avec Échap;
- utiliser un séparateur avant les actions destructives;
- afficher les actions avec des labels explicites.

---

# 36. Tooltips

Utiliser pour :

- icône seule;
- abréviation;
- donnée tronquée;
- explication courte.

Ne pas placer une instruction essentielle uniquement dans un tooltip.

---

# 37. Toasts

Les Toasts indiquent :

- succès;
- erreur;
- avertissement;
- information.

Ils ne remplacent pas un état persistant important.

Une erreur qui bloque un formulaire doit aussi être visible dans le formulaire.

---

# 38. États de chargement

Priorité :

```text
Skeleton
      ↓
Progression locale
      ↓
Spinner
```

Éviter un écran entièrement vide avec un spinner central lorsque la structure de la page est connue.

Les mutations doivent montrer le loading uniquement sur l’action concernée.

---

# 39. États vides

Un état vide contient :

- un titre;
- une explication;
- la prochaine action;
- une illustration ou icône facultative.

Exemple :

```text
Aucune mission prévue

Créez une mission à partir d’une route pour commencer les opérations.

[Créer une mission]
```

Éviter :

```text
Aucune donnée.
```

---

# 40. États d’erreur

Une erreur doit indiquer :

- ce qui n’a pas fonctionné;
- l’impact;
- si les données locales sont conservées;
- l’action possible;
- un identifiant technique facultatif.

Exemple :

```text
La mission n’a pas pu être actualisée.

Les dernières données connues restent affichées.

[Réessayer]
```

---

# 41. États hors ligne et synchronisation

Les états doivent être visibles et distincts :

```text
Synchronisé
Synchronisation en cours
3 changements en attente
Hors ligne
Erreur de synchronisation
Donnée potentiellement ancienne
```

La dernière mise à jour doit être affichée lorsque pertinent.

Exemple :

```text
Dernière synchronisation : il y a 18 secondes
```

---

# 42. Alertes

## 42.1 Niveaux

```ts
type AlertLevel = 'info' | 'warning' | 'critical'
```

## 42.2 Règles

- une alerte critique domine;
- les alertes secondaires sont regroupées;
- ne jamais afficher une alerte vide;
- inclure une action lorsque possible;
- ne pas utiliser une grande bannière rouge pour une information mineure.

---

# 43. Cartes géographiques

## 43.1 Style

Le style de carte doit appartenir à la marque RECA :

- sobre;
- contrasté;
- rues lisibles;
- bâtiments discrets;
- route claire;
- marqueurs hiérarchisés;
- faible surcharge.

---

## 43.2 Modes

Prévoir :

- plan;
- satellite;
- mode sombre opérationnel;
- zones de déneigement;
- géométrie GPS;
- missions;
- opérateurs;
- équipements.

---

## 43.3 Commandes

Les commandes flottantes doivent être regroupées.

Exemples :

- Recentrer;
- Changer de fond;
- Ajuster la vue;
- Afficher les zones;
- Plein écran.

---

## 43.4 Liste + carte

Pour Routes et Missions, privilégier une vue synchronisée :

```text
Liste ordonnée | Carte
```

La sélection d’un élément dans la liste doit le mettre en évidence sur la carte et inversement.

---

# 44. Visualisation de données

Les graphiques doivent répondre à une question opérationnelle.

Types recommandés :

- barres;
- lignes;
- progression;
- heatmap;
- donut limité;
- timeline.

Éviter les graphiques décoratifs sans action possible.

Toujours fournir :

- unités;
- légende;
- période;
- valeur accessible;
- état vide;
- contexte.

---

# 45. Timelines et historique

Une timeline affiche :

- type d’événement;
- heure;
- acteur;
- résumé;
- détails facultatifs;
- lien vers l’entité.

Exemple :

```text
14:32 · Mission démarrée
Gabriel Cayer

14:37 · Résidence terminée
224 rue Scott · Test Opérateur
```

---

# 46. Avatars et identifiants visuels

Les avatars peuvent représenter :

- utilisateur;
- employé;
- opérateur;
- client;
- organisation.

Règles :

- photo si disponible;
- initiales sinon;
- couleur stable générée;
- texte alternatif;
- taille cohérente.

Les équipements utilisent une icône ou une photo distincte, pas un avatar humain.

---

# 47. Liens

Les liens textuels utilisent la couleur `status.info`.

Ils doivent posséder :

- hover;
- focus;
- visited neutralisé dans l’application;
- indication externe lorsque nécessaire.

Le bleu nuit n’est pas un lien sur un fond clair s’il n’est pas distinguable du texte normal.

---

# 48. Microcopie

Le langage doit être :

- direct;
- précis;
- professionnel;
- humain;
- court;
- orienté vers l’action.

Préférer :

```text
Créer une mission
Assigner un opérateur
Voir le tracé
Ajouter une note
```

Éviter :

```text
Procéder à la création d’une nouvelle mission
Effectuer la modification des informations
```

---

# 49. Terminologie officielle

Utiliser toujours les termes métier validés :

```text
Lead
Soumission
Client
Contrat
Zone de déneigement
Route
Mission
Résidence
MissionItem dans le code
Opérateur
Équipement
Facture
Paiement
Problème
```

L’interface peut afficher `Résidence` plutôt que `MissionItem`.

Ne pas alterner arbitrairement entre :

- parcours et route;
- intervention et mission;
- employé et opérateur;
- site et résidence.

Les distinctions doivent être documentées.

---

# 50. Dates, heures et unités

## 50.1 Locale

```text
fr-CA
```

## 50.2 Dates

Exemples :

```text
4 août 2026
4 août 2026 à 19 h 32
```

## 50.3 Heures

Format recommandé :

```text
19 h 32
```

## 50.4 Unités

- distance : m, km;
- surface stockée : m²;
- surface affichée : m², pi² selon préférence;
- neige : cm;
- durée : min, h;
- monnaie : format canadien français.

---

# 51. Accessibilité

Le design system doit viser au minimum WCAG 2.2 AA.

Exigences :

- contraste suffisant;
- navigation clavier;
- focus visible;
- labels accessibles;
- cibles tactiles de 44 px;
- erreurs annoncées;
- aucune information uniquement par couleur;
- support du zoom texte;
- ordre de lecture logique;
- `prefers-reduced-motion`;
- textes alternatifs;
- rôles ARIA lorsque nécessaires.

---

# 52. Focus

Tous les contrôles interactifs possèdent un `focus-visible` clair.

Recommandation :

```css
outline: 2px solid var(--color-focus);
outline-offset: 2px;
```

Ne jamais supprimer le focus sans remplacement visible.

---

# 53. Animation

## 53.1 Principes

- rapide;
- discrète;
- informative;
- jamais décorative au détriment de la vitesse;
- cohérente avec RECA Opérateur.

---

## 53.2 Durées

```ts
export const motion = {
  instant: 80,
  fast: 140,
  normal: 220,
  slow: 320,
}
```

---

## 53.3 Easing

```css
--ease-standard: cubic-bezier(0.2, 0, 0, 1);
--ease-emphasized: cubic-bezier(0.2, 0.8, 0.2, 1);
```

---

## 53.4 Animations autorisées

- apparition de menu;
- changement d’onglet;
- progression;
- ouverture de sheet;
- sélection sur carte;
- retour visuel d’une action;
- mise à jour d’un statut.

---

## 53.5 Animations à éviter

- éléments qui rebondissent sans raison;
- longs fondus;
- déplacement de toute la page;
- animations empêchant une action rapide;
- parallax;
- effets brillants.

---

# 54. Responsive

## 54.1 Mobile

```text
0 à 767 px
```

- Bottom Navigation;
- header compact;
- Cards compactes;
- actions collantes;
- une colonne;
- bottom sheets;
- champs 48 px.

## 54.2 Tablette

```text
768 à 1023 px
```

- interactions tactiles;
- grille 2 colonnes lorsque pertinente;
- navigation adaptée;
- panneaux redimensionnés;
- pas automatiquement le desktop complet.

## 54.3 Desktop

```text
1024 px et plus
```

- sidebar;
- données denses;
- plusieurs colonnes;
- actions visibles;
- tableaux;
- vue liste + carte.

---

# 55. Master UI obligatoires

Avant d’implémenter tous les modules, Fable doit produire au minimum :

## 55.1 Centre des opérations

Doit définir :

- navigation;
- Dashboard;
- alertes;
- missions;
- carte;
- activité;
- densité.

## 55.2 Liste d’entités

Doit définir :

- statistiques;
- recherche;
- filtres;
- vue compacte;
- vue confortable;
- sélection;
- pagination;
- mobile.

## 55.3 Fiche commerciale

Pour :

- Client;
- Contrat;
- Soumission;
- Facture.

## 55.4 Fiche opérationnelle

Pour :

- Mission;
- Route;
- Employé;
- Équipement.

## 55.5 Formulaire complexe

Doit définir :

- Wizard;
- validation;
- résumé;
- brouillon;
- desktop;
- mobile.

## 55.6 Expérience mobile

Doit définir :

- navigation;
- headers;
- Cards;
- actions;
- sheets;
- formulaires;
- états vides;
- densité.

---

# 56. Composants officiels à prévoir

## Navigation

```text
DesktopSidebar
MobileBottomNavigation
MobileHeader
Breadcrumbs
CommandPalette
GlobalSearch
PageTabs
```

## Layout

```text
AppShell
PageContainer
PageHeader
StickyActionBar
SplitView
MasterDetailLayout
MapLayout
```

## Données

```text
StatCard
EntityCard
EntityRow
DataTable
CompactList
ProgressBar
ProgressRing
Timeline
ActivityFeed
```

## Statuts

```text
StatusBadge
SyncIndicator
ConnectivityIndicator
AlertBanner
ProblemBadge
```

## Formulaires

```text
Input
Textarea
Select
Autocomplete
DatePicker
TimePicker
Checkbox
RadioGroup
SegmentedControl
FormSection
Wizard
```

## Overlays

```text
Modal
BottomSheet
Drawer
Dropdown
Tooltip
Toast
ConfirmDialog
```

## Carte

```text
MapCanvas
MapControls
MapLegend
RouteLayer
MissionLayer
PropertyZoneLayer
GpsGeometryLayer
MapSidePanel
```

## États

```text
EmptyState
ErrorState
OfflineState
LoadingSkeleton
PermissionState
```

---

# 57. Règles de composants

Chaque composant partagé doit :

- utiliser les tokens;
- supporter les thèmes;
- être accessible;
- gérer ses états;
- documenter ses variantes;
- éviter la logique métier;
- être testable;
- avoir un comportement mobile défini;
- ne pas exposer des classes arbitraires comme seule API.

---

# 58. Design tokens dans le code

Structure recommandée :

```text
src/design-system/
├── tokens/
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   ├── radius.ts
│   ├── shadows.ts
│   ├── motion.ts
│   └── breakpoints.ts
├── components/
├── patterns/
├── icons/
└── index.ts
```

Les noms définitifs seront décidés dans l’architecture de l’application.

---

# 59. Utilisation de Tailwind

Si Tailwind est retenu, les tokens officiels doivent être exposés dans la configuration.

Interdit :

```tsx
<div className="bg-[#10182a] text-[#f7f8fa] rounded-[17px]" />
```

Recommandé :

```tsx
<div className="bg-surface text-primary rounded-card shadow-card" />
```

Les valeurs arbitraires ne sont permises que pour un cas exceptionnel documenté.

---

# 60. Handoff Fable vers Claude

Fable doit fournir :

- tokens;
- styles;
- composants;
- variantes;
- états;
- comportements responsive;
- espacements;
- dimensions;
- assets;
- interactions;
- captures de référence.

Claude ne doit pas recevoir seulement des images.

Il doit recevoir un handoff structuré permettant de reproduire fidèlement le système.

---

# 61. Comparaison visuelle obligatoire

Pour chaque Master UI :

```text
Maquette Fable
      ↓
Implémentation statique
      ↓
Capture desktop
      ↓
Capture mobile
      ↓
Comparaison
      ↓
Corrections
```

Les éléments à comparer :

- proportions;
- marges;
- alignements;
- densité;
- typographie;
- contrastes;
- rayons;
- ombres;
- états;
- comportement mobile.

---

# 62. Tests visuels

Les tests doivent couvrir :

- thème sombre;
- thème clair;
- mobile 375 px;
- mobile 390 px;
- mobile 430 px;
- tablette 768 px;
- desktop 1024 px;
- desktop 1280 px;
- desktop 1440 px;
- grand écran;
- zoom navigateur;
- texte long;
- données absentes;
- données nombreuses;
- statut critique;
- loading;
- erreur;
- hors ligne.

---

# 63. Qualité perçue

La qualité ne dépend pas seulement de la beauté.

Elle dépend de :

- la stabilité des layouts;
- la rapidité;
- la cohérence;
- la qualité des états;
- les transitions;
- les alignements;
- la densité;
- la précision des libellés;
- la clarté des actions;
- l’absence d’éléments inutiles.

---

# 64. Pratiques interdites

Il est interdit de :

- redessiner le logo;
- inventer une nouvelle couleur de marque par module;
- utiliser le rouge pour chaque état actif;
- afficher plusieurs actions primaires;
- placer une action destructive en vedette sans nécessité;
- créer une Card pour chaque petite information;
- utiliser des titres génériques comme `Détail`;
- empiler simplement le desktop sur mobile;
- utiliser des tailles de texte trop petites;
- coder des couleurs en dur dans les composants;
- utiliser une icône sans label accessible;
- masquer les erreurs uniquement dans un toast;
- utiliser une animation lente pour une action opérationnelle;
- inventer de nouveaux composants sans vérifier le design system;
- copier automatiquement les écrans de l’ancienne RECA App;
- copier la composition de RECA Opérateur sur des pages administratives.

---

# 65. Points à valider pendant le Master UI

Les éléments suivants doivent être confirmés visuellement avant leur verrouillage final :

- valeur exacte du rouge officiel;
- versions officielles du logo;
- thème par défaut;
- largeur de sidebar;
- navigation mobile principale;
- niveau de densité par défaut;
- style final des Cards;
- style des statistiques;
- apparence des cartes Mapbox;
- usage du glassmorphism;
- palette des zones;
- apparence des graphiques;
- comportement tablette.

Les tokens de ce document constituent la base officielle initiale.

Toute modification validée doit mettre à jour ce document.

---

# 66. Critères de réussite

Le Design System est considéré réussi si :

- RECA App V2 et RECA Opérateur appartiennent clairement à la même famille;
- l’application est immédiatement reconnaissable comme un produit RECA;
- le design ne ressemble pas à un CRM générique;
- les opérations dominent la hiérarchie;
- les pages restent lisibles avec beaucoup de données;
- les Cards ne créent pas une accumulation de rectangles;
- les actions destructives sont correctement hiérarchisées;
- le mobile affiche plusieurs informations importantes dès le premier viewport;
- les thèmes clair et sombre demeurent cohérents;
- les couleurs fonctionnelles conservent leur sens;
- les composants sont réutilisables;
- les écrans sont accessibles;
- les maquettes peuvent être implémentées fidèlement;
- les futures fonctionnalités peuvent être ajoutées sans créer un nouveau style parallèle.

---

# 67. Résumé officiel

RECA App V2 doit utiliser un design sombre, précis et opérationnel comme direction principale, tout en supportant un thème clair professionnel.

Le produit partage sa marque et ses principes avec RECA Opérateur, mais adapte sa densité et ses compositions à un centre de gestion multi-mission.

Le système repose sur :

- le vrai logo RECA;
- Manrope;
- le rouge officiel;
- le bleu nuit;
- des couleurs fonctionnelles stables;
- une hiérarchie forte;
- une seule action principale;
- des Cards utilisées avec intention;
- des listes denses lorsque nécessaire;
- une expérience mobile dédiée;
- des composants partagés;
- des tokens sémantiques;
- des tests visuels systématiques.

Le design ne doit pas seulement être beau.

Il doit permettre de comprendre rapidement :

```text
Ce qui se passe
Ce qui demande une attention
Ce qui doit être fait ensuite
```
