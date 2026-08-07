# 07-Leads-Quotes-Clients.md

# RECA
## Leads, Soumissions et Clients

Version : 1.0  
Projet : RECA App V2  
Dépôt recommandé : `reca-app-v2`  
Statut : Spécification métier et fonctionnelle officielle  

---

# 1. Objectif du document

Ce document définit le fonctionnement officiel des modules :

```text
Leads
Soumissions
Clients
```

Il décrit :

- leur rôle dans le pipeline commercial;
- leurs responsabilités;
- leurs données;
- leurs statuts;
- leurs relations;
- leurs parcours;
- leurs pages;
- leurs actions;
- leurs règles de conversion;
- leurs règles de validation;
- leurs permissions;
- leur représentation Desktop, Tablette et Mobile;
- leur intégration avec les Contrats;
- leur intégration avec les Factures;
- leur historique;
- leur migration depuis l’ancienne RECA App;
- leurs tests;
- leurs critères de réussite.

Ce document complète notamment :

```text
00-Vision.md
01-Design-System.md
02-Information-Architecture.md
03-Application-Architecture.md
04-Data-Architecture.md
05-Authentication-Roles-Permissions.md
06-Operations-Center-Dashboard.md
```

---

# 2. Vision du pipeline commercial

Le pipeline commercial officiel est :

```text
Lead
  ↓
Soumission
  ↓
Client
  ↓
Contrat
```

Une fois le Contrat créé :

```text
Contrat
  ↓
Route
  ↓
Mission
  ↓
Facturation
```

Les trois modules couverts par ce document représentent les premières étapes de la relation avec le Client.

Le système doit permettre de comprendre rapidement :

- qui a communiqué avec RECA;
- ce que cette personne demande;
- qui doit faire le suivi;
- quelle est la prochaine action;
- si une Soumission existe;
- si elle a été acceptée;
- si le prospect est devenu Client;
- si un Contrat a été créé.

---

# 3. Principe fondamental

Chaque module possède une responsabilité distincte.

```text
Lead
Une possibilité commerciale à qualifier

Soumission
Une proposition commerciale précise

Client
Une relation officielle avec une personne ou une entreprise
```

Ces concepts ne doivent pas être fusionnés.

Un Lead n’est pas automatiquement un Client.

Une Soumission n’est pas un Contrat.

Un Contrat en brouillon n’est pas une Soumission.

---

# 4. Distinction Soumission et Contrat

Cette distinction est non négociable.

## Soumission

La Soumission représente :

- une offre;
- une proposition;
- un prix estimé ou proposé;
- une période de validité;
- une décision en attente;
- un document commercial non contractuel tant qu’il n’est pas accepté selon le processus défini.

## Contrat

Le Contrat représente :

- un engagement;
- des clauses;
- des obligations;
- des modalités;
- une saison;
- des services;
- une propriété;
- des zones de déneigement;
- un échéancier;
- une relation opérationnelle.

Créer un Contrat avec le statut `DRAFT` ou `SIGNATURE_PENDING` ne doit jamais être présenté comme « créer une Soumission ».

---

# 5. Responsabilité du module Leads

Le module Leads doit permettre de :

- saisir un nouveau prospect;
- conserver ses coordonnées;
- comprendre son besoin;
- identifier sa source;
- assigner un responsable;
- planifier un rappel;
- suivre les contacts;
- modifier son statut;
- créer une Soumission;
- marquer une opportunité gagnée ou perdue;
- conserver un historique.

---

# 6. Responsabilité du module Soumissions

Le module Soumissions doit permettre de :

- préparer une proposition;
- relier la proposition à un Lead ou un Client;
- détailler les services;
- calculer les montants;
- appliquer les taxes;
- définir une expiration;
- enregistrer des notes;
- générer un document;
- envoyer la proposition;
- suivre son statut;
- la convertir vers un Client;
- préparer la création d’un Contrat;
- conserver son historique.

---

# 7. Responsabilité du module Clients

Le module Clients doit permettre de :

- gérer les personnes et entreprises;
- gérer les coordonnées;
- gérer les adresses;
- gérer la langue;
- gérer le statut;
- géolocaliser la propriété;
- créer des Contrats;
- créer des Factures;
- consulter les Contrats;
- consulter les Factures et Paiements;
- gérer les notes;
- gérer les documents;
- consulter l’historique;
- archiver sans perdre les relations passées.

---

# 8. Dépendances officielles

La direction des dépendances est :

```text
Leads
  ↓
Soumissions
  ↓
Clients
  ↓
Contrats
  ↓
Factures
  ↓
Paiements
```

Un module en aval peut consommer un contrat public du module en amont.

Un module en amont ne doit pas dépendre de l’implémentation interne d’un module en aval.

Exemple permis :

```text
Soumission → lire le Lead lié
```

Exemple à éviter :

```text
Lead → importer un composant interne de Factures
```

---

# 9. Routes recommandées

## Leads

```text
/leads
/leads/new
/leads/:leadId
```

## Soumissions

```text
/quotes
/quotes/new
/quotes/:quoteId
```

## Clients

```text
/clients
/clients/new
/clients/:clientId
```

---

# 10. Paramètres de contexte

Les pages de création peuvent recevoir un contexte.

Exemples :

```text
/quotes/new?leadId=:leadId
```

```text
/clients/new?convertQuoteId=:quoteId
```

```text
/contracts/new?clientId=:clientId
```

```text
/invoices/new?clientId=:clientId
```

Le contexte doit être validé avant d’afficher le formulaire final.

---

# 11. Chargement obligatoire du contexte

Lorsqu’une création dépend d’une entité liée, le formulaire ne doit pas être soumis avant le chargement de cette entité.

Exemple :

```text
QuoteCreatePage
+ leadId
```

Le système doit :

1. charger le Lead;
2. valider qu’il existe;
3. valider l’accès;
4. préremplir la Soumission;
5. seulement ensuite rendre le formulaire utilisable.

Cette règle évite qu’une mutation secondaire soit silencieusement ignorée.

---

# 12. Pages de création dédiées

La création normale d’une entité utilise une page dédiée.

```text
Nouveau Lead
Nouvelle Soumission
Nouveau Client
```

Une création principale ne doit pas utiliser une modale depuis une page liste.

Avantages :

- URL stable;
- retour navigateur;
- espace suffisant;
- validation claire;
- contexte lisible;
- meilleur comportement Mobile;
- moins de perte de saisie.

---

# 13. Exception : création rapide intégrée

Une création rapide de Client peut demeurer dans une modale lorsqu’elle est déclenchée à l’intérieur d’un autre formulaire en cours.

Exemple :

```text
Wizard Contrat
  ↓
Recherche Client
  ↓
Client absent
  ↓
Créer rapidement le Client
  ↓
Retour au Wizard sans perdre la saisie
```

Cette exception ne doit pas devenir la méthode normale de création d’un Client.

---

# 14. Navigation après création

Comportement recommandé :

```text
Créer Lead
  ↓
Fiche Lead
```

```text
Créer Soumission
  ↓
Fiche Soumission
```

```text
Créer Client
  ↓
Fiche Client
```

Lors d’une conversion :

```text
Soumission
  ↓
Créer Client
  ↓
Fiche Client avec origine Soumission visible
```

---

# 15. Entité Lead

Structure conceptuelle :

```ts
type Lead = {
  id: LeadId
  organizationId: OrganizationId
  number: string

  firstName?: string
  lastName?: string
  companyName?: string

  phone?: string
  email?: string
  address?: PostalAddress

  requestedService?: string
  source?: LeadSource
  message?: string

  status: LeadStatus
  assignedTo?: UserId
  nextReminderAt?: string

  createdAt: string
  createdBy?: UserId
  updatedAt: string
  updatedBy?: UserId
  deletedAt?: string
}
```

---

# 16. Identité du Lead

Le Lead peut représenter :

- une personne;
- une entreprise;
- une personne contactant RECA pour une entreprise;
- une demande incomplète.

Le système doit permettre de créer un Lead même lorsque toutes les données ne sont pas encore connues.

Le minimum requis doit rester raisonnable.

---

# 17. Minimum requis Lead

Minimum recommandé :

```text
Nom ou entreprise
+ au moins un moyen de contact
```

Moyens de contact possibles :

```text
Téléphone
Courriel
```

Une demande provenant d’un formulaire peut aussi commencer avec :

```text
Courriel
+ message
```

La règle finale dépendra des sources de Leads activées.

---

# 18. Source du Lead

Sources possibles :

```text
WEBSITE
PHONE
EMAIL
FACEBOOK
GOOGLE
REFERRAL
EXISTING_CLIENT
MANUAL
OTHER
```

Chaque source possède :

- une valeur stable;
- un libellé;
- éventuellement une précision;
- éventuellement une campagne.

---

# 19. Attribution du Lead

Un Lead peut être assigné à :

- un Sales Representative;
- un Manager;
- aucun utilisateur temporairement.

L’assignation doit être visible dans :

- la liste;
- la fiche;
- le bloc de rappels;
- le Dashboard commercial.

---

# 20. Statuts Lead recommandés

```text
NEW
CONTACTED
QUALIFIED
QUOTE_PREPARED
QUOTE_SENT
WON
LOST
ARCHIVED
```

---

# 21. Signification des statuts Lead

## NEW

- Lead nouvellement créé;
- aucun contact confirmé.

## CONTACTED

- une tentative ou un échange a eu lieu;
- la qualification n’est pas terminée.

## QUALIFIED

- besoin confirmé;
- coordonnées suffisantes;
- opportunité valide.

## QUOTE_PREPARED

- une Soumission est en préparation ou créée;
- elle n’est pas nécessairement envoyée.

## QUOTE_SENT

- une Soumission a été envoyée.

## WON

- l’opportunité a été gagnée;
- le Client ou Contrat associé existe ou doit être créé.

## LOST

- l’opportunité n’a pas été gagnée;
- une raison peut être demandée.

## ARCHIVED

- Lead fermé et conservé pour historique.

---

# 22. Mapping avec l’ancien statut

L’ancienne application utilise notamment un statut équivalent à :

```text
soumission_envoyee
```

Le mapping recommandé est :

```text
soumission_envoyee
  ↓
QUOTE_SENT
```

Tous les anciens statuts doivent être inventoriés avant la migration.

Ils ne doivent pas être convertis par simple intuition.

---

# 23. Transitions Lead

Flux principal :

```text
NEW
  ↓
CONTACTED
  ↓
QUALIFIED
  ↓
QUOTE_PREPARED
  ↓
QUOTE_SENT
  ↓
WON
```

Branches possibles :

```text
NEW → LOST
CONTACTED → LOST
QUALIFIED → LOST
QUOTE_SENT → LOST
```

`ARCHIVED` doit généralement être une action administrative distincte.

---

# 24. Effet de création d’une Soumission depuis un Lead

Lorsqu’une Soumission est créée depuis un Lead :

```text
Lead
  ↓
QuoteCreatePage?leadId=
  ↓
Soumission créée
```

Le système doit mettre à jour le statut du Lead selon la règle confirmée.

Direction recommandée :

```text
Soumission créée comme brouillon
  ↓
Lead = QUOTE_PREPARED
```

```text
Soumission envoyée
  ↓
Lead = QUOTE_SENT
```

Éviter de passer automatiquement à `QUOTE_SENT` si la Soumission n’a pas réellement été envoyée.

---

# 25. Rappels Lead

Un Lead peut posséder :

- prochaine date de rappel;
- heure;
- responsable;
- note;
- statut du rappel;
- historique.

Structure conceptuelle :

```ts
type LeadReminder = {
  id: LeadReminderId
  leadId: LeadId
  assignedTo: UserId
  dueAt: string
  message?: string
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED'
  completedAt?: string
  createdAt: string
}
```

---

# 26. Prochaine action Lead

La fiche Lead doit toujours tenter de présenter la prochaine action.

Exemples :

```text
Appeler le prospect
Préparer une Soumission
Envoyer la Soumission
Relancer demain
Transformer en Client
Fermer comme perdu
```

---

# 27. Raison de perte

Lorsqu’un Lead devient `LOST`, demander une raison.

Exemples :

```text
PRICE
NO_RESPONSE
COMPETITOR
OUT_OF_AREA
SERVICE_NOT_OFFERED
TIMING
DUPLICATE
OTHER
```

Cette donnée permet d’améliorer les ventes sans transformer le formulaire en enquête complexe.

---

# 28. Notes Lead

Les notes servent à conserver :

- échange téléphonique;
- préférence;
- objection;
- information manquante;
- prochaine action;
- contexte.

Une note n’est pas un événement d’audit.

Les deux peuvent apparaître dans la même timeline.

---

# 29. Fiche Lead — structure

Structure recommandée :

```text
En-tête Lead
Résumé de contact
Statut et assignation
Prochaine action
Rappel
Besoin et message
Soumissions liées
Notes
Historique
```

---

# 30. En-tête Lead

Afficher :

- numéro;
- nom ou entreprise;
- statut;
- responsable;
- action primaire;
- menu secondaire.

Action primaire contextuelle :

```text
Créer une Soumission
```

ou :

```text
Ouvrir la Soumission
```

Actions rapides :

- appeler;
- envoyer un courriel;
- ouvrir l’adresse dans Maps.

Menu :

- Modifier;
- changer le statut;
- marquer perdu;
- archiver.

---

# 31. Liste Leads

La liste doit permettre :

- recherche;
- filtre par statut;
- filtre par responsable;
- filtre par source;
- rappels en retard;
- tri par date;
- tri par prochaine action;
- affichage compact Desktop;
- cartes Mobile.

---

# 32. Recherche Leads

Champs recherchables :

- numéro;
- nom;
- entreprise;
- téléphone;
- courriel;
- adresse;
- service demandé.

---

# 33. Résumé Leads

Statistiques compactes possibles :

```text
Nouveaux
À contacter
Qualifiés
Soumissions envoyées
Gagnés
Perdus
Rappels en retard
```

Ne pas afficher sept grandes cartes sur Mobile.

---

# 34. Carte Lead Mobile

Contenu principal :

- nom;
- entreprise;
- statut;
- téléphone;
- service;
- prochain rappel;
- responsable.

Toute la carte doit ouvrir la fiche.

---

# 35. Ligne Lead Desktop

Contenu recommandé :

```text
Lead
Statut
Contact
Service
Responsable
Prochaine action
Créé le
```

---

# 36. Entité Soumission

Structure conceptuelle :

```ts
type Quote = {
  id: QuoteId
  organizationId: OrganizationId
  number: string

  leadId?: LeadId
  clientId?: ClientId

  status: QuoteStatus
  title?: string
  description?: string

  subtotalCents: number
  taxTotalCents: number
  totalCents: number

  validUntil?: string
  notes?: string

  createdAt: string
  createdBy?: UserId
  updatedAt: string
  updatedBy?: UserId
  sentAt?: string
  acceptedAt?: string
  rejectedAt?: string
  deletedAt?: string
}
```

---

# 37. Relation Soumission

Une Soumission peut appartenir à :

```text
Lead seulement
Client seulement
Lead devenu Client
```

La relation originale au Lead doit pouvoir être conservée même après conversion.

Exemple :

```text
quote.lead_id
quote.client_id
```

---

# 38. Items de Soumission

Structure conceptuelle :

```ts
type QuoteItem = {
  id: QuoteItemId
  quoteId: QuoteId
  description: string
  quantity: number
  unitPriceCents: number
  subtotalCents: number
  taxable: boolean
  order: number
}
```

---

# 39. Calculs Soumission

Le calcul doit être centralisé.

```text
Sous-total
+ Taxes applicables
= Total
```

Les valeurs doivent être recalculées de façon fiable.

Le navigateur ne doit pas être la seule autorité pour les montants finaux persistés.

---

# 40. Taxes

Les taxes utilisent la configuration de l’organisation.

La Soumission doit conserver suffisamment d’information pour reproduire le montant présenté.

Possibilités :

- snapshot des taux;
- lignes de taxes;
- version de configuration.

Une modification future des taux ne doit pas réécrire une ancienne Soumission.

---

# 41. Statuts Soumission recommandés

```text
DRAFT
READY
SENT
VIEWED
ACCEPTED
REJECTED
EXPIRED
CANCELLED
ARCHIVED
```

La V1 peut omettre `VIEWED` si aucun suivi d’ouverture fiable n’existe.

---

# 42. Signification des statuts Soumission

## DRAFT

- préparation en cours;
- non prête à envoyer.

## READY

- complète;
- prête à être envoyée.

## SENT

- transmise au prospect ou Client.

## VIEWED

- ouverte par le destinataire;
- seulement si l’information est fiable.

## ACCEPTED

- acceptée;
- conversion vers Client ou Contrat disponible.

## REJECTED

- refusée.

## EXPIRED

- date de validité dépassée;
- non acceptée.

## CANCELLED

- annulée par RECA;
- conserve l’historique.

## ARCHIVED

- masquée des opérations courantes;
- historique conservé.

---

# 43. Transitions Soumission

Flux principal :

```text
DRAFT
  ↓
READY
  ↓
SENT
  ↓
ACCEPTED
```

Branches :

```text
SENT → REJECTED
SENT → EXPIRED
DRAFT → CANCELLED
READY → CANCELLED
SENT → CANCELLED
```

---

# 44. Expiration

Une Soumission peut posséder :

```text
valid_until
```

Le statut `EXPIRED` peut être :

- calculé;
- persisté par tâche;
- mis à jour à la lecture.

La stratégie doit rester cohérente.

Une Soumission acceptée ne devient pas expirée après coup.

---

# 45. Création Soumission depuis Lead

Préremplir :

- nom;
- entreprise;
- téléphone;
- courriel;
- adresse;
- service demandé;
- message;
- Lead lié.

Le formulaire doit indiquer clairement :

```text
Soumission créée pour LED-000125
```

---

# 46. Création Soumission depuis Client

Préremplir :

- Client;
- coordonnées;
- adresse;
- langue;
- éléments connus.

Route possible :

```text
/quotes/new?clientId=:clientId
```

---

# 47. Envoi Soumission

L’action `Envoyer` doit :

1. valider la Soumission;
2. générer ou utiliser le document;
3. confirmer le destinataire;
4. envoyer;
5. enregistrer `sentAt`;
6. mettre le statut à `SENT`;
7. créer un événement;
8. mettre à jour le Lead lié si nécessaire.

---

# 48. Échec d’envoi

Un échec d’envoi ne doit pas marquer la Soumission `SENT`.

Afficher :

```text
L’envoi a échoué.
La Soumission demeure prête à envoyer.
```

Le document peut avoir été généré sans que l’envoi ait réussi.

---

# 49. Acceptation Soumission

Une Soumission acceptée doit permettre :

- créer ou lier un Client;
- créer un Contrat;
- conserver l’acceptation;
- conserver le document accepté;
- conserver la date;
- conserver l’acteur ou la source.

---

# 50. Conversion Soumission vers Client

Flux officiel :

```text
Soumission acceptée
      ↓
Client déjà lié ?
      ├── Oui → ouvrir Client
      └── Non → créer Client
```

Route :

```text
/clients/new?convertQuoteId=:quoteId
```

---

# 51. Préremplissage Client depuis Soumission

Préremplir à partir du Lead ou de la Soumission :

- prénom;
- nom;
- entreprise;
- téléphone;
- courriel;
- adresse;
- langue si connue;
- notes pertinentes;
- origine.

Ne pas copier automatiquement dans les notes internes :

- messages temporaires;
- détails inutiles;
- données sensibles;
- contenu commercial complet.

---

# 52. Transaction de conversion

La conversion doit éviter les doublons.

Étapes recommandées :

1. vérifier si la Soumission possède déjà un Client;
2. rechercher un Client potentiel;
3. demander confirmation si correspondance;
4. créer le Client si nécessaire;
5. lier `quote.client_id`;
6. mettre la Soumission à `ACCEPTED` si approprié;
7. mettre le Lead à `WON`;
8. créer les événements;
9. ouvrir la fiche Client.

---

# 53. Détection de doublon Client

Critères possibles :

- téléphone normalisé;
- courriel normalisé;
- adresse normalisée;
- entreprise;
- combinaison nom + adresse.

Le système doit présenter une suggestion.

Il ne doit pas fusionner automatiquement deux personnes sans confirmation.

---

# 54. Soumission acceptée sans Contrat

Une Soumission acceptée peut exister avant le Contrat.

État possible :

```text
Soumission acceptée
Client créé
Contrat à préparer
```

Le Dashboard commercial peut remonter :

```text
Soumission acceptée sans Contrat
```

---

# 55. Soumission et Contrat

La création d’un Contrat depuis une Soumission doit transférer seulement les données appropriées.

Exemples :

- Client;
- adresse;
- services proposés;
- prix;
- notes commerciales pertinentes;
- référence de Soumission.

Le Contrat doit demander les informations supplémentaires :

- saison;
- zones;
- obligations;
- clauses;
- modalités;
- informations terrain;
- géométrie.

---

# 56. Fiche Soumission — structure

Structure recommandée :

```text
En-tête Soumission
Résumé financier
Statut et expiration
Lead ou Client lié
Services et items
Notes
Document
Historique
Prochaine étape
```

---

# 57. En-tête Soumission

Afficher :

- numéro;
- titre ou destinataire;
- statut;
- total;
- expiration;
- action primaire;
- menu.

Action primaire contextuelle :

```text
Envoyer
```

ou :

```text
Transformer en Client
```

ou :

```text
Créer un Contrat
```

Menu :

- Modifier;
- Dupliquer;
- Annuler;
- Archiver.

---

# 58. Résumé financier Soumission

Afficher :

```text
Sous-total
Taxes
Total
Expiration
```

Le Total doit dominer.

Les Notes ne doivent pas occuper le même niveau visuel que le montant.

---

# 59. Carte Lead liée

Si un Lead existe :

```text
LED-000125
Nom
Téléphone
Statut

[Ouvrir le Lead]
```

---

# 60. Carte Client liée

Si un Client existe :

```text
CLI-000053
Nom ou entreprise
Téléphone
Statut

[Ouvrir le Client]
```

Sinon :

```text
Aucun Client lié

[Transformer en Client]
```

---

# 61. Liste Soumissions

La liste doit permettre :

- recherche;
- filtre par statut;
- filtre par responsable;
- filtre par date;
- filtre expirées;
- tri par total;
- tri par expiration;
- tri par dernière modification.

---

# 62. Recherche Soumissions

Champs :

- numéro;
- Lead;
- Client;
- entreprise;
- téléphone;
- courriel;
- titre;
- service.

---

# 63. Résumé Soumissions

Statistiques compactes possibles :

```text
Brouillons
Prêtes
Envoyées
Acceptées
Refusées
Expirées
Valeur totale
```

La valeur totale doit préciser sa définition.

Exemple :

```text
Valeur des Soumissions envoyées actives
```

---

# 64. Ligne Soumission Desktop

Contenu recommandé :

```text
Numéro
Destinataire
Statut
Total
Expiration
Responsable
Dernière activité
```

---

# 65. Carte Soumission Mobile

Afficher :

- numéro;
- destinataire;
- statut;
- total;
- expiration;
- prochaine action.

---

# 66. Entité Client

Structure conceptuelle :

```ts
type Client = {
  id: ClientId
  organizationId: OrganizationId
  number: string

  type: 'RESIDENTIAL' | 'COMMERCIAL'
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED'
  language: 'FR' | 'EN'

  firstName?: string
  lastName?: string
  companyName?: string

  phone: string
  email?: string

  billingAddress?: PostalAddress
  latitude?: number
  longitude?: number

  createdAt: string
  createdBy?: UserId
  updatedAt: string
  updatedBy?: UserId
  deletedAt?: string
}
```

---

# 67. Types Client

Valeurs officielles :

```text
RESIDENTIAL
COMMERCIAL
```

Mapping historique :

```text
residentiel → RESIDENTIAL
commercial → COMMERCIAL
```

---

# 68. Client résidentiel

Champs principaux :

- prénom;
- nom;
- téléphone;
- courriel;
- adresse;
- langue.

---

# 69. Client commercial

Champs principaux :

- entreprise obligatoire;
- personne contact;
- téléphone;
- courriel;
- adresse;
- langue.

La règle historique où l’entreprise est requise pour un Client commercial doit être conservée.

---

# 70. Téléphone Client

Le téléphone demeure obligatoire dans le modèle actuel validé.

La nouvelle application doit :

- normaliser;
- formater;
- accepter les formats québécois;
- conserver une valeur exploitable;
- permettre l’appel direct sur Mobile.

Une évolution future peut permettre un Client sans téléphone seulement après décision explicite.

---

# 71. Courriel Client

Le courriel est optionnel selon le modèle actuel.

Lorsqu’il est présent :

- normaliser en minuscules;
- valider;
- permettre l’action rapide;
- utiliser la langue préférée pour les communications.

---

# 72. Langue Client

Valeurs :

```text
FR
EN
```

Mapping historique :

```text
francais → FR
anglais → EN
```

La langue influence :

- documents;
- courriels;
- communications;
- Contrats;
- Factures;
- portail futur.

---

# 73. Statuts Client

```text
ACTIVE
INACTIVE
ARCHIVED
```

Mapping historique actuel :

```text
actif → ACTIVE
inactif → INACTIVE
```

---

# 74. Signification des statuts Client

## ACTIVE

- relation active;
- création de Contrat permise;
- création de Facture permise.

## INACTIVE

- relation temporairement inactive;
- historique conservé;
- actions nouvelles limitées ou averties.

## ARCHIVED

- retiré des listes courantes;
- historique complet conservé;
- Contrats et Factures demeurent accessibles selon permission.

---

# 75. Archivage Client

Archiver un Client ne doit pas :

- supprimer ses Contrats;
- supprimer ses Factures;
- supprimer ses Paiements;
- supprimer ses Notes;
- supprimer ses Documents;
- supprimer son historique.

L’action doit être située dans le menu secondaire.

---

# 76. Réactivation Client

Un Client archivé ou inactif peut être réactivé selon permission.

La réactivation doit produire un événement.

---

# 77. Adresses Client

La V1 peut conserver une adresse principale.

L’architecture doit permettre plus tard :

```text
Adresse de facturation
Adresse de service
Adresse postale
Autre propriété
```

Les Contrats doivent conserver leur propre adresse de service ou référence stable.

---

# 78. Géocodage Client

Lors de la création ou modification :

```text
Adresse valide
  ↓
Géocodage best-effort
  ↓
latitude / longitude
```

Le géocodage ne doit pas bloquer la création du Client.

En cas d’échec :

- enregistrer le Client;
- indiquer « Adresse non localisée »;
- permettre une correction ultérieure;
- remonter un élément de préparation si nécessaire.

---

# 79. Adresse normalisée

Conserver :

- composants d’adresse;
- affichage lisible;
- code postal;
- ville;
- province;
- pays;
- coordonnées;
- source du géocodage si nécessaire.

Éviter de dépendre uniquement d’une chaîne libre.

---

# 80. ClientEditorRef

La fiche Client peut afficher :

```text
Créé le
Dernière modification
Modifié par
```

`updatedBy` peut être résolu par relation avec `users`.

Il ne doit pas être une chaîne copiée dans le Client.

---

# 81. Notes Client

Les notes Client permettent :

- ajout;
- modification;
- suppression logique;
- auteur;
- date;
- timeline.

Structure :

```ts
type ClientNote = {
  id: ClientNoteId
  clientId: ClientId
  message: string
  authorId: UserId
  createdAt: string
  updatedAt?: string
  deletedAt?: string
}
```

---

# 82. Fiche Client — en-tête

Afficher :

```text
CLI-000053 · Nom du Client
[ACTIF]
```

Actions rapides :

- Téléphone;
- Courriel;
- Maps.

Action primaire :

```text
Créer un Contrat
```

Menu secondaire :

- Modifier;
- Créer une Facture;
- Archiver le Client.

---

# 83. Onglets Client

Structure officielle :

```text
Informations
Contrats
Factures & paiements
Documents
Historique
```

---

# 84. Onglet Informations

Afficher :

- coordonnées;
- type;
- langue;
- adresse;
- carte;
- dates;
- notes;
- informations générales.

Éviter de répéter le statut dans plusieurs cartes.

---

# 85. Onglet Contrats

Afficher :

- Contrats actifs;
- Contrats en attente;
- Contrats terminés;
- numéro;
- saison;
- statut;
- montant;
- adresse;
- action.

Action :

```text
Créer un Contrat
```

---

# 86. Onglet Factures & paiements

Afficher :

- Factures;
- statut;
- date;
- échéance;
- total;
- solde;
- Paiements liés;
- totaux.

Action selon permission :

```text
Créer une Facture
```

ou :

```text
Enregistrer un Paiement
```

---

# 87. Onglet Documents

Afficher :

- Contrats signés;
- Soumissions;
- Factures PDF;
- documents Client;
- dates;
- versions.

L’état « Bientôt disponible » de l’ancienne application ne doit pas être conservé dans la V2 finale.

---

# 88. Onglet Historique

Afficher une timeline consolidée :

- Client créé;
- coordonnées modifiées;
- Soumission liée;
- Contrat créé;
- statut modifié;
- Facture créée;
- Paiement reçu;
- Note ajoutée;
- Client archivé;
- Client réactivé.

---

# 89. Liste Clients

La liste doit permettre :

- recherche;
- filtre par statut;
- filtre par type;
- filtre par langue;
- filtre par présence de Contrat actif;
- filtre par secteur;
- tri;
- mode compact Desktop;
- cartes Mobile.

---

# 90. Recherche Clients

Champs :

- numéro;
- prénom;
- nom;
- entreprise;
- téléphone;
- courriel;
- adresse;
- ville;
- code postal.

---

# 91. Résumé Clients

Statistiques compactes :

```text
Actifs
Inactifs
Résidentiels
Commerciaux
Avec Contrat actif
Sans Contrat
```

Ces données ne doivent pas prendre plus d’espace que la liste elle-même.

---

# 92. Ligne Client Desktop

Contenu recommandé :

```text
Client
Type
Contact
Adresse
Statut
Contrat actif
Solde ou information secondaire selon permission
```

---

# 93. Carte Client Mobile

Afficher :

- nom ou entreprise;
- type;
- statut;
- téléphone;
- adresse;
- Contrat actif;
- chevron.

Toute la carte ouvre la fiche.

---

# 94. ClientSearchPicker

Le sélecteur de Client intégré doit permettre :

- recherche rapide;
- affichage du type;
- téléphone;
- adresse;
- sélection;
- création rapide;
- comportement tactile fiable;
- conservation du formulaire parent.

Il doit utiliser le contrat public du module Clients.

---

# 95. Pipeline visuel

Les fiches doivent montrer la relation sans imposer un Kanban partout.

Exemple Lead :

```text
Lead
  → Soumission envoyée
  → En attente de réponse
```

Exemple Soumission :

```text
Soumission acceptée
  → Client créé
  → Contrat à préparer
```

Exemple Client :

```text
Client actif
  → 2 Contrats
  → 1 Facture en attente
```

---

# 96. Dashboard commercial

Projection possible :

```ts
type SalesDashboardProjection = {
  newLeads: number
  leadsToContact: LeadSummary[]
  overdueReminders: LeadReminderSummary[]
  quotesToPrepare: QuoteSummary[]
  quotesAwaitingResponse: QuoteSummary[]
  acceptedQuotesWithoutClient: QuoteSummary[]
  acceptedQuotesWithoutContract: QuoteSummary[]
  recentClients: ClientSummary[]
}
```

---

# 97. Bloc « À traiter » commercial

Éléments possibles :

```text
Lead sans responsable
Lead sans moyen de contact
Rappel en retard
Lead qualifié sans Soumission
Soumission prête non envoyée
Soumission envoyée sans suivi
Soumission expirée
Soumission acceptée sans Client
Client actif sans Contrat
```

---

# 98. Déduplication

Le système doit aider à détecter :

- Lead déjà existant;
- Client déjà existant;
- Soumission dupliquée;
- même téléphone;
- même courriel;
- même propriété.

Il doit proposer :

```text
Ouvrir l’entité existante
Continuer quand même
Fusionner dans un flux contrôlé
```

---

# 99. Fusion de Leads

La fusion n’est pas obligatoire dans la V1.

Une future fonction doit conserver :

- notes;
- rappels;
- Soumissions;
- événements;
- source;
- identifiants.

Ne jamais supprimer un Lead dupliqué sans historique.

---

# 100. Fusion de Clients

Hors périmètre initial.

Une future fusion de Clients est une opération sensible qui doit :

- être réservée;
- afficher les conflits;
- préserver les relations;
- être transactionnelle;
- être auditée;
- permettre un retour contrôlé.

---

# 101. Actions rapides de contact

Les modules doivent utiliser des actions cohérentes :

```text
Appeler
Envoyer un courriel
Ouvrir dans Maps
```

Les actions apparaissent seulement lorsque la donnée existe.

---

# 102. Formatage du téléphone

Utiliser un format d’affichage uniforme.

Exemple :

```text
450 555-0123
```

Le lien utilise :

```text
tel:+14505550123
```

---

# 103. Formatage des dates

Afficher en français canadien.

Exemple :

```text
5 août 2026
```

Les dates de rappel doivent inclure l’heure.

---

# 104. Formulaire Lead

Sections recommandées :

```text
Identité
Coordonnées
Demande
Source
Assignation
Prochaine action
```

---

# 105. Champs Formulaire Lead

Possibles :

- prénom;
- nom;
- entreprise;
- téléphone;
- courriel;
- adresse;
- service;
- source;
- message;
- responsable;
- rappel;
- statut initial.

Le statut initial normal est :

```text
NEW
```

---

# 106. Formulaire Soumission

Sections recommandées :

```text
Destinataire
Services
Tarification
Taxes
Validité
Notes
Validation
```

---

# 107. Formulaire Client

Sections recommandées :

```text
Type
Identité
Coordonnées
Adresse
Langue
Statut
```

---

# 108. Client résidentiel — validation

Exiger :

- prénom ou nom selon règle finale;
- téléphone;
- type;
- langue;
- statut.

---

# 109. Client commercial — validation

Exiger :

- entreprise;
- téléphone;
- type;
- langue;
- statut.

La personne contact peut être recommandée sans être obligatoirement requise dans la première version.

---

# 110. Barre d’actions formulaires

Desktop :

- actions collantes en bas lorsque le formulaire est long.

Mobile :

- barre inférieure fixe;
- bouton principal;
- retour;
- respect de la safe area.

---

# 111. Brouillons

## Lead

Le Lead peut être créé avec des informations minimales.

## Soumission

La Soumission possède un vrai statut `DRAFT`.

## Client

Le Client ne devrait pas utiliser un statut « brouillon » dans la V1.

Une création Client doit produire une fiche valide.

---

# 112. Sauvegarde automatique

Hors périmètre initial pour Leads et Clients.

Possiblement utile pour les Soumissions longues.

Une future sauvegarde automatique doit afficher :

- état;
- heure;
- erreur;
- version.

---

# 113. Suppression et archivage

## Lead

Préférer :

```text
Archiver
```

Suppression définitive réservée aux données de test ou erreurs contrôlées.

## Soumission

Préférer :

```text
Annuler
Archiver
```

## Client

Préférer :

```text
Archiver
```

---

# 114. Actions destructives

Les actions destructives doivent être dans :

```text
Menu ⋮
```

avec confirmation.

Elles ne doivent pas être au même niveau que l’action principale.

---

# 115. Permissions Leads

Permissions recommandées :

```text
lead.read
lead.create
lead.update
lead.assign
lead.change_status
lead.archive
lead.export
```

---

# 116. Permissions Soumissions

```text
quote.read
quote.create
quote.update
quote.send
quote.accept
quote.reject
quote.cancel
quote.convert
quote.archive
quote.export
```

---

# 117. Permissions Clients

```text
client.read
client.create
client.update
client.archive
client.export
client.read_financial
client.read_documents
```

---

# 118. Accès Sales Representative

Accès recommandé :

- Leads complet;
- Soumissions complet;
- Clients lecture/création/modification;
- Contrats création/modification selon permission;
- Factures lecture limitée selon décision.

---

# 119. Accès Dispatcher

Accès recommandé :

- Clients en lecture;
- Contrats en lecture;
- Leads et Soumissions en lecture limitée si nécessaire;
- aucune gestion commerciale complète par défaut.

---

# 120. Accès Accounting

Accès recommandé :

- Clients en lecture;
- Soumissions en lecture si nécessaire;
- Factures et Paiements;
- aucune modification de Lead par défaut.

---

# 121. Accès Operator

L’Operator ne doit pas accéder aux modules Leads ou Soumissions.

Il ne doit pas accéder à la fiche Client complète.

Les données nécessaires lui sont transmises dans MissionItem.

---

# 122. RLS Leads

Lecture et écriture limitées :

- organisation;
- permissions;
- éventuellement assignation.

Un Sales Representative peut être limité à ses Leads dans une configuration future.

---

# 123. RLS Soumissions

La Soumission doit être accessible selon :

- organisation;
- permission;
- Lead ou Client lié.

L’accès au document doit suivre les mêmes règles.

---

# 124. RLS Clients

La fiche Client complète ne doit pas être accessible à l’Operator.

Les projections Client utilisées ailleurs doivent être minimales.

---

# 125. Événements Leads

Exemples :

```text
LeadCreated
LeadAssigned
LeadStatusChanged
LeadReminderScheduled
LeadReminderCompleted
LeadMarkedLost
QuoteCreatedFromLead
LeadConverted
LeadArchived
```

---

# 126. Événements Soumissions

```text
QuoteCreated
QuoteUpdated
QuoteReady
QuoteSent
QuoteAccepted
QuoteRejected
QuoteExpired
QuoteCancelled
QuoteConvertedToClient
ContractCreatedFromQuote
```

---

# 127. Événements Clients

```text
ClientCreated
ClientUpdated
ClientGeocoded
ClientStatusChanged
ClientArchived
ClientReactivated
ClientNoteAdded
ContractCreatedForClient
InvoiceCreatedForClient
```

---

# 128. Timeline

La timeline doit distinguer :

- événement système;
- action utilisateur;
- note;
- document;
- conversion.

Elle doit afficher :

- libellé;
- auteur;
- date;
- entité liée;
- action d’ouverture lorsque pertinente.

---

# 129. Documents Soumission

Le document final doit conserver :

- numéro;
- version;
- date;
- destinataire;
- items;
- taxes;
- total;
- expiration;
- conditions;
- langue;
- fichier généré;
- statut d’envoi.

---

# 130. Version de Soumission

Lorsqu’une Soumission envoyée est modifiée de façon importante :

- créer une nouvelle version;
- ou repasser en brouillon avec historique;
- ne pas réécrire silencieusement le document déjà envoyé.

La stratégie finale doit être confirmée.

---

# 131. Langue du document

La langue vient :

1. du Client lié;
2. du Lead si connue;
3. du choix de la Soumission;
4. du français par défaut.

---

# 132. Courriel Soumission

Le courriel doit permettre :

- sujet;
- message;
- pièce jointe PDF;
- destinataire;
- copie optionnelle;
- langue;
- historique d’envoi.

Le fournisseur actuel peut évoluer.

Le module dépend d’un service d’envoi abstrait.

---

# 133. Notifications internes

Exemples :

- rappel Lead en retard;
- Soumission acceptée;
- Soumission expirée;
- nouveau Client;
- Soumission acceptée sans Contrat.

---

# 134. États vides Leads

```text
Aucun Lead

Les nouvelles demandes et les prospects apparaîtront ici.

[Nouveau Lead]
```

---

# 135. États vides Soumissions

```text
Aucune Soumission

Créez une proposition à partir d’un Lead ou d’un Client.

[Nouvelle Soumission]
```

---

# 136. États vides Clients

```text
Aucun Client

Les Clients créés ou convertis depuis une Soumission apparaîtront ici.

[Nouveau Client]
```

---

# 137. États vides liés

Exemple fiche Lead :

```text
Aucune Soumission liée

Le besoin est qualifié et prêt à être chiffré.

[Créer une Soumission]
```

Exemple fiche Client :

```text
Aucun Contrat

Créez un premier Contrat pour cette propriété.

[Créer un Contrat]
```

---

# 138. Erreurs partielles

Une erreur de chargement des Factures ne doit pas rendre toute la fiche Client inutilisable.

Afficher l’erreur dans l’onglet concerné.

---

# 139. Donnée non localisée

Exemple Client :

```text
Adresse non localisée

La fiche Client est enregistrée, mais la position GPS doit être vérifiée.

[Situer]
```

---

# 140. Desktop — listes

Utiliser :

- toolbar;
- recherche;
- filtres;
- résumé compact;
- rangées ou tableau;
- densité confortable/compacte;
- pagination serveur.

Les cartes détaillées peuvent être une option, pas l’unique format.

---

# 141. Desktop — fiches

Utiliser :

- EntityHeader;
- actions rapides;
- onglets;
- contenu à deux colonnes lorsque pertinent;
- activité;
- panneaux secondaires;
- largeur utile.

---

# 142. Mobile — listes

Utiliser :

- header compact;
- bouton `+`;
- recherche;
- filtres repliables;
- cartes compactes;
- résumé réduit;
- navigation inférieure.

---

# 143. Mobile — fiches

Priorités :

- identité;
- statut;
- action primaire;
- contact;
- prochaine action;
- onglets ou segments;
- contenu essentiel.

Éviter :

- grandes cartes statistiques;
- répétition du titre;
- actions destructives visibles;
- longues zones vides.

---

# 144. Mobile — Lead

Premier écran recommandé :

```text
LED-000125 · Jean Tremblay
QUALIFIÉ

[Appeler] [Courriel]
[Créer une Soumission]

Prochain rappel
Demande
Responsable
```

---

# 145. Mobile — Soumission

Premier écran :

```text
SOU-000078
ENVOYÉE

4 250,00 $
Valide jusqu’au 20 août

[Relancer]
```

---

# 146. Mobile — Client

Premier écran :

```text
CLI-000053 · Jean Tremblay
ACTIF

[Appeler] [Courriel] [Maps]
[Créer un Contrat]

Informations
Contrats
Factures
```

---

# 147. Tablette

La Tablette peut utiliser :

- navigation Desktop compacte;
- liste + détail;
- deux colonnes;
- panneaux;
- actions tactiles.

---

# 148. Recherche globale

Les trois modules doivent apparaître dans la recherche globale.

Exemples de résultats :

```text
Lead · LED-000125
Soumission · SOU-000078
Client · CLI-000053
```

---

# 149. Résultats groupés

La recherche peut grouper :

```text
Leads
Soumissions
Clients
Contrats
Factures
```

Un même téléphone peut retourner plusieurs entités liées.

---

# 150. Recherche par propriété

Une adresse doit permettre de retrouver :

- Lead;
- Client;
- Contrat;
- Route;
- Mission;
- Factures.

La recherche ne doit pas demander à l’utilisateur de connaître le bon module.

---

# 151. Performance des listes

Utiliser :

- pagination serveur;
- filtres serveur;
- recherche debouncée;
- index;
- sélection minimale;
- préchargement de la fiche.

---

# 152. Query Keys

Exemples :

```ts
leadKeys.all
leadKeys.list(filters)
leadKeys.detail(id)
leadKeys.reminders(id)

quoteKeys.all
quoteKeys.list(filters)
quoteKeys.detail(id)

clientKeys.all
clientKeys.list(filters)
clientKeys.detail(id)
clientKeys.notes(id)
clientKeys.contracts(id)
clientKeys.invoices(id)
```

---

# 153. Mutations

Mutations principales :

```text
CreateLead
UpdateLead
AssignLead
ChangeLeadStatus
ScheduleLeadReminder

CreateQuote
UpdateQuote
SendQuote
AcceptQuote
RejectQuote
ConvertQuoteToClient

CreateClient
UpdateClient
ArchiveClient
AddClientNote
```

---

# 154. Transactions critiques

Doivent être transactionnelles :

```text
ConvertQuoteToClient
AcceptQuoteAndUpdateLead
CreateClientFromQuote
ArchiveClient avec validations
```

---

# 155. Conversion idempotente

Une même Soumission ne doit pas créer deux Clients lors d’un double clic ou d’une reprise.

Utiliser :

- verrou;
- clé d’idempotence;
- vérification `quote.client_id`;
- transaction.

---

# 156. Concurrence

Une modification doit vérifier la version ou la dernière mise à jour.

Exemple :

```text
La Soumission a été modifiée par une autre personne.
Rechargez avant de continuer.
```

---

# 157. Migration depuis l’ancienne RECA App

Avant migration :

1. inventorier les tables;
2. inventorier les colonnes;
3. inventorier les statuts;
4. inventorier les liens Lead–Soumission–Client;
5. inventorier les Notes;
6. inventorier les Rappels;
7. inventorier les documents;
8. inventorier les enregistrements orphelins;
9. inventorier les doublons;
10. confirmer les règles métier.

---

# 158. Anciennes conventions à conserver comme référence

Le système actuel confirme notamment :

- création sur page dédiée;
- contexte par query params;
- Lead vers Soumission;
- Soumission vers Client;
- Client résidentiel ou commercial;
- entreprise obligatoire pour commercial;
- téléphone Client obligatoire;
- langue Client;
- statut Client;
- notes Client;
- onglets Client;
- géocodage best-effort;
- actions téléphone, courriel et Maps;
- création de Contrat depuis Client;
- création de Facture depuis Client.

---

# 159. Éléments à ne pas copier automatiquement

Ne pas copier sans analyse :

- statuts hérités ambigus;
- composants dupliqués;
- grandes cartes identiques;
- détail sans vraie hiérarchie;
- création en modale depuis les listes;
- suppression trop visible;
- relations calculées uniquement dans le frontend;
- effets secondaires non transactionnels;
- titre générique « Détail ».

---

# 160. Legacy status mappings

Créer un registre :

```text
Ancienne valeur
Nouveau statut
Confiance
Action requise
```

Exemple :

```text
soumission_envoyee
QUOTE_SENT
Haute
Migration automatique possible
```

Toute valeur inconnue doit être marquée :

```text
NEEDS_REVIEW
```

---

# 161. Backfill Client

Le backfill peut devoir remplir :

- type;
- statut;
- langue;
- coordonnées;
- normalisation téléphone;
- normalisation courriel;
- géocodage;
- numéro visible.

Ne pas inventer une langue inconnue sans règle documentée.

---

# 162. Données orphelines

Exemples :

- Soumission sans Lead ni Client;
- Lead marqué gagné sans Client;
- Client sans téléphone;
- Client commercial sans entreprise;
- Soumission acceptée sans lien.

Ces cas doivent produire un rapport de migration.

---

# 163. Compatibilité temporaire

Pendant la migration :

- ancienne application continue de fonctionner;
- V2 lit les données via adapters;
- nouvelles colonnes sont additives;
- mappings de statuts sont centralisés;
- aucun changement destructif prématuré.

---

# 164. Tests unitaires Leads

Tester :

- validation;
- transitions;
- rappel;
- raison de perte;
- calcul prochaine action;
- mapping legacy;
- permission.

---

# 165. Tests unitaires Soumissions

Tester :

- calcul sous-total;
- taxes;
- total;
- expiration;
- transitions;
- conversion;
- idempotence;
- version;
- mapping Lead.

---

# 166. Tests unitaires Clients

Tester :

- résidentiel;
- commercial;
- entreprise obligatoire;
- téléphone;
- langue;
- archivage;
- géocodage non bloquant;
- détection de doublon;
- mapping legacy.

---

# 167. Tests d’intégration

Tester :

- repositories;
- RLS;
- création depuis contexte;
- conversion Soumission vers Client;
- mise à jour Lead;
- notes Client;
- géocodage;
- documents;
- historique;
- recherche.

---

# 168. Tests E2E — pipeline principal

```text
Créer Lead
  ↓
Qualifier
  ↓
Créer Soumission
  ↓
Envoyer
  ↓
Accepter
  ↓
Créer Client
  ↓
Créer Contrat
```

---

# 169. Tests E2E — Lead perdu

```text
Créer Lead
  ↓
Contacter
  ↓
Marquer perdu
  ↓
Choisir raison
  ↓
Vérifier historique
```

---

# 170. Tests E2E — doublon Client

```text
Convertir Soumission
  ↓
Téléphone déjà existant
  ↓
Afficher Client potentiel
  ↓
Lier au Client existant
  ↓
Aucun doublon créé
```

---

# 171. Tests E2E — géocodage en échec

```text
Créer Client
  ↓
Géocodage indisponible
  ↓
Client créé
  ↓
Adresse non localisée affichée
  ↓
Correction possible
```

---

# 172. Tests responsive

Tester :

```text
375 px
390 px
414 px
768 px
1024 px
1280 px
1440 px
1920 px
```

---

# 173. Fixtures

Prévoir :

```text
Lead nouveau
Lead avec rappel en retard
Lead qualifié
Lead perdu
Soumission brouillon
Soumission envoyée
Soumission acceptée
Soumission expirée
Client résidentiel
Client commercial
Client inactif
Client sans géocodage
Client avec plusieurs Contrats
Client avec Factures en retard
```

---

# 174. Master UI

Les modules doivent dériver de deux Master UI.

## Master UI — Liste commerciale

Utilisé pour :

- Leads;
- Soumissions;
- Clients.

## Master UI — Fiche commerciale

Utilisé pour :

- Lead;
- Soumission;
- Client;
- Contrat;
- Facture.

Les variantes métier demeurent distinctes.

---

# 175. Critères de réussite Leads

Le module Leads est réussi si :

- un Lead peut être saisi rapidement;
- la prochaine action est claire;
- les rappels sont visibles;
- la qualification est compréhensible;
- la Soumission peut être créée sans ressaisie;
- les doublons sont détectables;
- l’historique est fiable.

---

# 176. Critères de réussite Soumissions

Le module Soumissions est réussi si :

- les montants sont fiables;
- les statuts sont clairs;
- l’envoi est traçable;
- l’expiration est visible;
- la conversion ne crée pas de doublon;
- le document envoyé reste historique;
- la création du Client et du Contrat est simple.

---

# 177. Critères de réussite Clients

Le module Clients est réussi si :

- les coordonnées sont accessibles rapidement;
- l’adresse est exploitable;
- les Contrats sont visibles;
- les Factures et Paiements sont visibles;
- les Notes sont faciles à utiliser;
- l’archivage conserve l’historique;
- le Client devient le point d’entrée principal de la relation.

---

# 178. Critères de réussite visuelle

Les trois modules doivent sembler :

- cohérents;
- commerciaux;
- professionnels;
- rapides;
- structurés;
- spécifiques à RECA.

Ils ne doivent pas sembler :

- être trois copies du même écran;
- être des tableaux administratifs sans contexte;
- être dominés par de grandes cartes statistiques;
- présenter toutes les actions avec la même importance.

---

# 179. Critères de réussite technique

Les modules doivent :

- respecter l’architecture Feature-first;
- isoler Supabase;
- utiliser des schémas;
- utiliser des cas d’utilisation;
- utiliser des transactions pour les conversions;
- respecter les permissions;
- respecter RLS;
- gérer la concurrence;
- conserver l’historique;
- être compatibles avec l’ancien schéma;
- être testés Desktop et Mobile.

---

# 180. Hors périmètre initial

Ne pas bloquer la première version avec :

- CRM marketing complet;
- campagnes automatisées;
- séquences de courriels;
- téléphonie intégrée;
- scoring IA;
- signature électronique avancée;
- portail prospect;
- paiement de Soumission;
- fusion automatique de Clients;
- tracking complet d’ouverture;
- attribution multi-touch;
- prévision de revenus complexe.

---

# 181. Décisions à confirmer

Avant l’implémentation finale, confirmer :

- statuts exacts Leads;
- statut automatique après création de Soumission;
- statut automatique après envoi;
- raisons de perte;
- minimum requis d’un Lead;
- multi-Soumissions par Lead;
- versionnement des Soumissions;
- mécanisme d’acceptation;
- permissions Sales sur Contrats;
- visibilité financière Sales;
- détection de doublon;
- multi-adresses Client;
- statut inactif versus archivé;
- langue par défaut;
- comportement d’une Soumission expirée;
- possibilité de créer une Soumission directement pour un Client;
- création automatique ou manuelle du Contrat après acceptation.

Ces décisions doivent être ajoutées dans `memory.md` lorsqu’elles sont validées.

---

# 182. Règles non négociables

Ne jamais confondre Soumission et Contrat.

Ne jamais créer deux Clients à partir de la même conversion sans avertissement.

Ne jamais marquer une Soumission envoyée si l’envoi a échoué.

Ne jamais marquer un Lead `QUOTE_SENT` si aucune Soumission n’a réellement été envoyée.

Ne jamais supprimer un Client avec son historique financier.

Ne jamais bloquer la création d’un Client uniquement parce que le géocodage échoue.

Ne jamais permettre à l’Operator d’accéder aux données commerciales complètes.

Ne jamais utiliser une modale pour une création principale depuis une liste.

Ne jamais afficher une action destructive au même niveau que l’action primaire.

Ne jamais réécrire silencieusement une ancienne Soumission envoyée.

---

# 183. Diagramme principal

```text
Lead
 ├── Coordonnées
 ├── Source
 ├── Responsable
 ├── Rappels
 ├── Notes
 └── Soumissions
        ↓
     Soumission
      ├── Items
      ├── Montants
      ├── Taxes
      ├── Document
      ├── Statut
      └── Conversion
             ↓
          Client
           ├── Coordonnées
           ├── Adresse
           ├── Notes
           ├── Documents
           ├── Contrats
           ├── Factures
           └── Historique
```

---

# 184. Flux de conversion officiel

```text
Lead qualifié
      ↓
Créer Soumission
      ↓
Soumission prête
      ↓
Envoyer
      ↓
Acceptation
      ↓
Détecter Client existant
      ↓
Créer ou lier Client
      ↓
Marquer Lead gagné
      ↓
Préparer Contrat
```

---

# 185. Résumé officiel

Le module Leads gère les opportunités.

Le module Soumissions gère les propositions.

Le module Clients gère la relation officielle.

La chaîne est :

```text
Lead
  ↓
Soumission
  ↓
Client
  ↓
Contrat
```

Les créations principales utilisent des pages dédiées.

Les conversions conservent le contexte.

Les statuts sont explicites.

Les rappels et prochaines actions sont visibles.

Les Soumissions conservent leurs montants, documents et versions.

Les Clients conservent leurs coordonnées, Contrats, Factures, Notes, Documents et Historique.

Les conversions sont transactionnelles et protégées contre les doublons.

Le mobile est compact.

Le Desktop offre une densité adaptée.

L’objectif est de transformer chaque demande commerciale en relation Client claire, traçable et prête à devenir une opération RECA.
