# 11-Finance-and-Payments.md

# RECA
## Factures, paiements et suivi financier

Version : 1.0  
Projet : RECA App V2  
Dépôt recommandé : `reca-app-v2`  
Statut : Spécification métier, fonctionnelle et financière officielle  

---

# 1. Objectif du document

Ce document définit le fonctionnement officiel des modules :

```text
Factures
Paiements
Échéanciers
Soldes
Taxes
Crédits et ajustements
Suivi des comptes Clients
Rapports financiers opérationnels
```

Il décrit :

- le rôle d’une Facture;
- le rôle d’un Paiement;
- leur relation avec le Client et le Contrat;
- les statuts;
- les montants;
- les taxes;
- l’échéancier;
- la génération depuis un Contrat;
- l’émission;
- les Paiements partiels;
- les annulations;
- les ajustements;
- les remboursements futurs;
- les retards;
- les soldes;
- les documents;
- l’audit;
- les permissions;
- les règles Supabase RLS;
- les transactions;
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
10-Employees-and-Equipment.md
```

---

# 2. Vision générale

Le module financier doit permettre de répondre rapidement à quatre questions :

```text
Qu’est-ce qui doit être facturé ?
Qu’est-ce qui a été payé ?
Quel montant reste à recevoir ?
Qu’est-ce qui demande une intervention ?
```

Il doit demeurer :

- fiable;
- traçable;
- simple à utiliser;
- cohérent avec les Contrats;
- adapté aux Paiements partiels;
- compatible avec les données historiques;
- protégé par des permissions strictes.

---

# 3. Principe fondamental

Les données financières ne doivent jamais être modifiées silencieusement.

Une opération financière importante doit produire :

- une transaction atomique;
- un état cohérent;
- un événement;
- un acteur;
- une date;
- une raison lorsque nécessaire;
- un historique durable.

---

# 4. Concepts distincts

Les concepts suivants doivent demeurer séparés :

```text
Contract
PaymentSchedule
Invoice
InvoiceItem
Payment
Credit
Adjustment
Refund
FinancialEvent
```

---

# 5. Contrat

Le Contrat définit notamment :

- le prix convenu;
- les taxes;
- les modalités;
- l’échéancier;
- la saison;
- le Client;
- les services.

Il ne représente pas à lui seul une Facture.

---

# 6. Échéancier

L’échéancier décrit quand les montants doivent être facturés ou payés.

Il ne représente pas nécessairement un Paiement réel.

---

# 7. Facture

La Facture représente une créance officielle envers un Client.

Elle contient :

- numéro;
- Client;
- Contrat;
- date d’émission;
- échéance;
- items;
- sous-total;
- taxes;
- total;
- montant payé;
- solde;
- statut;
- document.

---

# 8. Paiement

Le Paiement représente un montant réellement reçu.

Il contient :

- montant;
- date;
- méthode;
- référence;
- Facture;
- Client;
- acteur;
- statut;
- historique d’annulation.

---

# 9. Crédit

Un Crédit représente un montant accordé au Client et applicable à une Facture ou à son compte.

La V1 peut limiter cette fonction.

La structure doit toutefois éviter de corriger une Facture en inventant un Paiement négatif.

---

# 10. Ajustement

Un Ajustement représente une correction comptable contrôlée.

Exemples :

- correction de montant;
- erreur de taxe;
- rabais après émission;
- différence autorisée.

La V1 peut traiter les ajustements par notes de crédit ou nouvelle Facture selon la stratégie retenue.

---

# 11. Relation principale

```text
Client
  ├── Contract
  │     └── PaymentSchedule
  ├── Invoices
  │     ├── InvoiceItems
  │     ├── Payments
  │     ├── Credits
  │     └── Documents
  └── FinancialHistory
```

---

# 12. Routes recommandées

## Factures

```text
/invoices
/invoices/new
/invoices/:invoiceId
/invoices/:invoiceId/edit
```

## Paiements

```text
/payments
/payments/new
/payments/:paymentId
```

## Finances Client

```text
/clients/:clientId?tab=finances
```

## Finances Contrat

```text
/contracts/:contractId?tab=billing
```

---

# 13. Responsabilité du module Factures

Le module doit permettre de :

- créer une Facture;
- générer une Facture depuis un Contrat;
- générer plusieurs Factures depuis un échéancier;
- modifier un brouillon;
- calculer les taxes;
- émettre;
- générer un PDF;
- envoyer;
- suivre le statut;
- enregistrer un Paiement;
- afficher le solde;
- identifier un retard;
- annuler;
- consulter l’historique;
- conserver les versions nécessaires.

---

# 14. Responsabilité du module Paiements

Le module doit permettre de :

- enregistrer un Paiement;
- choisir une Facture;
- choisir un Client;
- valider le montant;
- gérer les Paiements partiels;
- empêcher les doublons;
- annuler un Paiement;
- conserver la référence;
- mettre à jour le solde;
- mettre à jour le statut de Facture;
- produire un reçu futur;
- conserver l’historique.

---

# 15. Responsabilité du suivi financier

Le système doit permettre de voir :

- Factures brouillon;
- Factures à émettre;
- Factures envoyées;
- Factures partiellement payées;
- Factures payées;
- Factures en retard;
- Paiements récents;
- solde par Client;
- solde par Contrat;
- échéances à venir;
- éléments à traiter.

---

# 16. Entité Invoice

Structure conceptuelle :

```ts
type Invoice = {
  id: InvoiceId
  organizationId: OrganizationId
  number: string

  clientId: ClientId
  contractId?: ContractId
  paymentScheduleEntryId?: PaymentScheduleEntryId

  status: InvoiceStatus

  issuedDate?: string
  dueDate: string

  subtotalCents: number
  taxTotalCents: number
  totalCents: number

  paidCents: number
  creditedCents: number
  balanceCents: number

  currency: 'CAD'
  language: 'FR' | 'EN'

  notes?: string
  internalNotes?: string

  createdAt: string
  createdBy?: UserId
  updatedAt: string
  updatedBy?: UserId

  issuedAt?: string
  sentAt?: string
  cancelledAt?: string
  cancelledBy?: UserId
  cancellationReason?: string

  version: number
  deletedAt?: string
}
```

---

# 17. Numéro Facture

Format recommandé :

```text
FAC-000081
```

Le numéro doit être :

- unique par organisation;
- généré côté serveur;
- stable;
- non réutilisé;
- lisible.

---

# 18. InvoiceItem

Structure conceptuelle :

```ts
type InvoiceItem = {
  id: InvoiceItemId
  invoiceId: InvoiceId

  description: string
  quantity: number
  unitPriceCents: number

  subtotalCents: number
  taxCode?: string
  taxable: boolean

  order: number
}
```

---

# 19. Quantité

La quantité peut représenter :

- unité;
- service;
- versement;
- heure;
- intervention;
- forfait.

La V1 doit afficher une unité seulement si elle apporte une vraie valeur.

---

# 20. Montants

Convention recommandée :

```text
Stockage en cents entiers
```

Exemple :

```text
125000 = 1 250,00 $
```

Les calculs ne doivent pas utiliser des flottants imprécis.

---

# 21. Calcul Invoice

```text
Sous-total
+ Taxes
- Crédits
= Total exigible
```

Puis :

```text
Total exigible
- Paiements valides
= Solde
```

---

# 22. Total historique

Le total d’une Facture émise doit demeurer historique.

Une modification de taux de taxe ou de Contrat ne doit pas la recalculer rétroactivement.

---

# 23. Taxes

La configuration initiale peut inclure :

```text
TPS
TVQ
```

Le système doit conserver les taux réellement appliqués.

---

# 24. TaxLine

Structure conceptuelle :

```ts
type InvoiceTaxLine = {
  id: string
  invoiceId: InvoiceId
  code: string
  label: string
  rateBasisPoints: number
  taxableAmountCents: number
  taxAmountCents: number
}
```

---

# 25. Basis points

Exemple :

```text
5 % = 500 basis points
9,975 % = 997,5 basis points
```

La stratégie technique exacte doit éviter les erreurs d’arrondi.

Une représentation décimale PostgreSQL contrôlée peut être utilisée.

---

# 26. Arrondi

Les règles d’arrondi doivent être centralisées.

Le système doit définir :

- arrondi par ligne ou global;
- précision;
- ordre d’application;
- cohérence PDF;
- cohérence DB;
- cohérence frontend.

---

# 27. Devise

La première devise est :

```text
CAD
```

La structure doit conserver la devise sur chaque document financier.

---

# 28. Langue Invoice

La langue vient généralement du Client.

Valeurs :

```text
FR
EN
```

Elle influence :

- PDF;
- courriel;
- libellés;
- reçu futur.

---

# 29. Statuts Invoice recommandés

```text
DRAFT
READY
ISSUED
SENT
PARTIALLY_PAID
PAID
OVERDUE
CANCELLED
ARCHIVED
```

---

# 30. Signification des statuts Invoice

## DRAFT

- préparation;
- non officielle;
- modifiable.

## READY

- complète;
- prête à être émise.

## ISSUED

- officiellement émise;
- date et numéro figés.

## SENT

- envoyée au Client.

## PARTIALLY_PAID

- au moins un Paiement valide;
- solde supérieur à zéro.

## PAID

- solde égal à zéro;
- entièrement réglée.

## OVERDUE

- échéance dépassée;
- solde supérieur à zéro.

## CANCELLED

- annulée;
- historique conservé;
- aucun nouveau Paiement normal.

## ARCHIVED

- retirée des listes courantes;
- historique conservé.

---

# 31. Statut calculé et statut explicite

Certains états peuvent être calculés :

```text
PARTIALLY_PAID
PAID
OVERDUE
```

Le système doit éviter les incohérences entre :

- statut stocké;
- total;
- Paiements;
- échéance.

Direction recommandée :

```text
Statut persistant mis à jour transactionnellement
+ fonction de recalcul autoritative
```

---

# 32. Priorité des règles de statut

Exemple :

```text
CANCELLED
  domine tous les états calculés
```

```text
PAID
  si balance = 0 et non CANCELLED
```

```text
OVERDUE
  si dueDate passée et balance > 0
```

```text
PARTIALLY_PAID
  si paid > 0 et balance > 0
```

```text
SENT ou ISSUED
  sinon selon l’historique d’envoi
```

---

# 33. Transitions Invoice

Flux principal :

```text
DRAFT
  ↓
READY
  ↓
ISSUED
  ↓
SENT
  ↓
PARTIALLY_PAID
  ↓
PAID
```

Branche temporelle :

```text
ISSUED ou SENT
  ↓
OVERDUE
```

Annulation :

```text
DRAFT → CANCELLED
READY → CANCELLED
ISSUED → CANCELLED selon règle
SENT → CANCELLED selon règle
```

---

# 34. Modification d’une Facture

## DRAFT

Modification complète permise selon permission.

## READY

Modification permise avec retour éventuel à DRAFT.

## ISSUED ou SENT

Modification limitée.

Direction recommandée :

- annuler et recréer;
- ou produire un Crédit/Ajustement;
- ne pas réécrire silencieusement.

## PAID

Modification directe interdite.

---

# 35. Émission

Émettre une Facture doit :

1. valider le Client;
2. valider les items;
3. valider les montants;
4. valider les taxes;
5. générer le numéro si nécessaire;
6. fixer `issuedDate`;
7. fixer la version;
8. changer le statut;
9. générer ou préparer le document;
10. créer un événement.

---

# 36. Envoi

Envoyer une Facture doit :

1. vérifier qu’elle est émise;
2. confirmer le destinataire;
3. générer le PDF si nécessaire;
4. envoyer;
5. enregistrer `sentAt`;
6. conserver l’historique d’envoi;
7. changer le statut à `SENT` si approprié.

---

# 37. Échec d’envoi

Un échec d’envoi ne doit pas annuler l’émission.

État :

```text
Facture émise
Envoi échoué
```

La Facture demeure officielle.

---

# 38. Facture créée manuellement

Une Facture peut être créée :

- depuis un Client;
- depuis un Contrat;
- depuis l’échéancier;
- manuellement par Accounting.

---

# 39. Facture depuis Client

Route possible :

```text
/invoices/new?clientId=:clientId
```

Préremplir :

- Client;
- langue;
- adresse de facturation;
- devise.

---

# 40. Facture depuis Contract

Route :

```text
/invoices/new?contractId=:contractId
```

Préremplir :

- Client;
- Contract;
- services;
- montant;
- taxes;
- langue;
- échéance suggérée.

---

# 41. Génération depuis PaymentSchedule

Flux :

```text
Contract
  ↓
PaymentSchedule
  ↓
CreateInvoicesFromSchedule
  ↓
Invoices DRAFT
```

La génération doit être transactionnelle.

---

# 42. PaymentScheduleEntry

Structure conceptuelle :

```ts
type PaymentScheduleEntry = {
  id: PaymentScheduleEntryId
  contractId: ContractId

  order: number
  label: string

  type: 'PERCENTAGE' | 'FIXED_AMOUNT'
  value: number

  dueDate: string
  invoiceId?: InvoiceId

  status: 'PENDING' | 'INVOICED' | 'CANCELLED'
}
```

---

# 43. Échéancier et Facture

Une entrée d’échéancier ne doit créer qu’une Facture active normale.

Le lien :

```text
payment_schedule_entry_id
```

permet d’empêcher les doublons.

---

# 44. Double génération

Un double clic ne doit pas produire deux séries de Factures.

Utiliser :

- transaction;
- verrou;
- contrainte unique;
- idempotencyKey.

---

# 45. Modification du Contract après génération

Une modification du prix du Contrat ne doit pas recalculer automatiquement les Factures déjà émises.

Pour les Factures DRAFT :

- recalcul contrôlé;
- avertissement;
- confirmation.

Pour les Factures émises :

- Crédit;
- nouvelle Facture;
- ajustement;
- aucune réécriture silencieuse.

---

# 46. Facture périodique

Une future version peut supporter :

- facturation mensuelle;
- facturation saisonnière;
- récurrence;
- renouvellement.

Hors périmètre initial, mais l’échéancier doit permettre l’évolution.

---

# 47. Date d’émission

La date d’émission représente la date officielle du document.

Elle peut différer de `createdAt`.

---

# 48. Date d’échéance

La date d’échéance doit être explicite.

Elle peut venir :

- de l’échéancier;
- d’un délai configuré;
- d’une date manuelle.

---

# 49. Délai par défaut

Paramètre possible :

```text
invoice_due_days
```

Exemple :

```text
30 jours
```

Le document doit conserver la date finale, pas seulement le délai.

---

# 50. Facture en retard

Règle conceptuelle :

```text
dueDate < aujourd’hui
+ balanceCents > 0
+ status non CANCELLED
= OVERDUE
```

---

# 51. Fuseau horaire

La comparaison de date utilise le fuseau de l’organisation.

---

# 52. Jours de retard

Calcul :

```text
today - dueDate
```

Afficher :

```text
En retard de 12 jours
```

---

# 53. Niveau de retard

Catégories possibles :

```text
1–7 jours
8–30 jours
31–60 jours
61 jours et plus
```

Ces catégories peuvent alimenter les rapports.

---

# 54. Entité Payment

Structure conceptuelle :

```ts
type Payment = {
  id: PaymentId
  organizationId: OrganizationId
  number: string

  clientId: ClientId
  invoiceId: InvoiceId

  amountCents: number
  method: PaymentMethod
  receivedAt: string

  reference?: string
  notes?: string

  status: PaymentStatus

  recordedBy: UserId
  createdAt: string

  cancelledAt?: string
  cancelledBy?: UserId
  cancellationReason?: string

  idempotencyKey?: string
}
```

---

# 55. Numéro Payment

Format recommandé :

```text
PAI-000104
```

---

# 56. Méthodes de Paiement

Valeurs initiales possibles :

```text
CASH
CHEQUE
E_TRANSFER
CARD
ONLINE
OTHER
```

---

# 57. Statuts Payment

```text
RECORDED
CANCELLED
FAILED
PENDING
```

La V1 manuelle peut utiliser principalement :

```text
RECORDED
CANCELLED
```

---

# 58. Enregistrement d’un Payment

Flux officiel :

```text
Sélectionner Invoice
  ↓
Afficher solde
  ↓
Saisir montant
  ↓
Choisir méthode
  ↓
Confirmer date et référence
  ↓
RecordPayment transactionnel
  ↓
Recalculer Invoice
  ↓
Créer événement
  ↓
Afficher confirmation
```

---

# 59. RecordPayment

Cas d’utilisation officiel :

```text
RecordPayment
```

Entrée conceptuelle :

```ts
type RecordPaymentInput = {
  invoiceId: InvoiceId
  amountCents: number
  method: PaymentMethod
  receivedAt: string
  reference?: string
  notes?: string
  idempotencyKey: string
}
```

---

# 60. Transaction Payment

La transaction doit :

1. charger et verrouiller la Facture;
2. valider l’organisation;
3. valider le statut;
4. valider le montant;
5. détecter un doublon;
6. créer le Payment;
7. recalculer `paidCents`;
8. recalculer `balanceCents`;
9. recalculer le statut;
10. créer un événement;
11. retourner la Facture mise à jour.

---

# 61. Paiement partiel

Un Paiement inférieur au solde est permis.

Résultat :

```text
Invoice.status = PARTIALLY_PAID
```

---

# 62. Paiement complet

Un Paiement égal au solde produit :

```text
balanceCents = 0
status = PAID
```

---

# 63. Surpaiement

Direction initiale recommandée :

```text
Bloquer un Payment supérieur au solde
```

Message :

```text
Le montant dépasse le solde de la Facture.
```

Une future gestion de crédit Client pourra permettre le surpaiement contrôlé.

---

# 64. Paiement nul ou négatif

Interdit.

---

# 65. Payment sur Invoice annulée

Interdit.

---

# 66. Payment sur Invoice payée

Interdit, sauf fonction de crédit future.

---

# 67. Référence Payment

Exemples :

- numéro de chèque;
- confirmation de virement;
- référence terminal;
- note interne.

Elle doit être recherchable.

---

# 68. Détection de doublon Payment

Critères possibles :

- même Facture;
- même montant;
- même date;
- même référence;
- même idempotencyKey.

Le système doit prévenir sans bloquer les cas légitimes.

---

# 69. Annulation d’un Payment

Un Payment ne doit pas être modifié directement.

Flux :

```text
Payment RECORDED
  ↓
CancelPayment
  ↓
Payment CANCELLED
  ↓
Recalcul Invoice
  ↓
Événement
```

---

# 70. CancelPayment

Entrée :

```ts
type CancelPaymentInput = {
  paymentId: PaymentId
  reason: string
}
```

---

# 71. Effet de l’annulation

La transaction doit :

1. verrouiller le Payment;
2. vérifier qu’il n’est pas déjà annulé;
3. marquer `CANCELLED`;
4. conserver acteur et raison;
5. recalculer la Facture;
6. recalculer le statut;
7. créer un événement.

---

# 72. Réactivation d’un Payment annulé

Interdite.

Créer un nouveau Payment valide.

---

# 73. Modification Payment

Interdite pour :

- montant;
- Facture;
- Client;
- date;
- méthode.

Une erreur doit être corrigée par annulation et nouvel enregistrement.

Des notes secondaires peuvent éventuellement être modifiées avec audit.

---

# 74. Paiement non affecté

Hors périmètre initial.

Une future fonction peut permettre :

```text
Payment Client non affecté
  ↓
Credit balance
  ↓
Application future
```

---

# 75. Paiement réparti sur plusieurs Invoices

Hors périmètre initial.

La structure future pourrait utiliser :

```text
payments
payment_allocations
```

La V1 recommande :

```text
Un Payment appartient à une Invoice.
```

---

# 76. PaymentAllocation future

Structure possible :

```ts
type PaymentAllocation = {
  id: string
  paymentId: PaymentId
  invoiceId: InvoiceId
  amountCents: number
}
```

---

# 77. Crédit

Une future entité peut être :

```ts
type CreditNote = {
  id: CreditNoteId
  organizationId: OrganizationId
  number: string
  clientId: ClientId
  invoiceId?: InvoiceId
  amountCents: number
  reason: string
  status: 'DRAFT' | 'ISSUED' | 'APPLIED' | 'CANCELLED'
  issuedAt?: string
}
```

---

# 78. Remboursement

Hors périmètre initial.

Un remboursement ne doit pas être représenté par la suppression d’un Payment.

---

# 79. Annulation Invoice

L’annulation d’une Facture doit vérifier :

- Paiements valides;
- Crédits;
- statut;
- permissions;
- raison;
- document;
- impact Contract.

---

# 80. Invoice avec Payment

Direction recommandée :

```text
Une Invoice avec Payment valide
ne peut pas être annulée
avant l’annulation ou le traitement du Payment.
```

---

# 81. Facture brouillon supprimée

Une Facture DRAFT jamais émise peut être archivée ou supprimée logiquement selon permission.

La suppression physique demeure réservée aux données de test.

---

# 82. Facture émise annulée

Elle doit conserver :

- numéro;
- document;
- montant;
- date;
- raison;
- acteur;
- événements.

Le PDF peut être estampillé ou accompagné d’un statut `ANNULÉE`.

---

# 83. InvoiceDocument

Structure conceptuelle :

```ts
type InvoiceDocument = {
  id: DocumentId
  invoiceId: InvoiceId
  version: number
  storagePath: string
  generatedAt: string
  generatedBy: UserId
  status: 'CURRENT' | 'SUPERSEDED' | 'CANCELLED'
}
```

---

# 84. PDF Invoice

Le PDF doit contenir :

- logo officiel;
- coordonnées RECA;
- numéro;
- date;
- échéance;
- Client;
- adresse;
- items;
- sous-total;
- taxes;
- total;
- Paiements ou solde si document actualisé;
- modalités;
- langue.

---

# 85. Document original et état actuel

Direction recommandée :

- le PDF émis conserve les montants d’origine;
- l’interface affiche le solde actuel;
- un relevé ou reçu futur peut afficher les Paiements.

Ne pas régénérer silencieusement le document original à chaque Payment.

---

# 86. Reçu

Une future fonction peut générer un reçu après Payment.

Le reçu doit référencer :

- Payment;
- Invoice;
- Client;
- montant;
- date;
- méthode;
- solde.

---

# 87. Courriel Invoice

Le service d’envoi doit conserver :

- destinataire;
- date;
- sujet;
- langue;
- document;
- résultat;
- erreur.

---

# 88. Relance

Une future fonction peut envoyer :

- rappel avant échéance;
- rappel de retard;
- relevé.

La V1 peut offrir une action manuelle :

```text
Envoyer un rappel
```

---

# 89. Rappel manuel

L’action doit :

- confirmer le destinataire;
- utiliser le solde actuel;
- créer un événement;
- ne pas changer le statut financier.

---

# 90. FinancialAttentionItem

Structure conceptuelle :

```ts
type FinancialAttentionItem = {
  id: string
  category: FinancialAttentionCategory
  severity: 'INFO' | 'WARNING' | 'CRITICAL'

  clientId?: ClientId
  contractId?: ContractId
  invoiceId?: InvoiceId

  title: string
  description?: string
  amountCents?: number
  dueDate?: string
  actionLabel?: string
}
```

---

# 91. Catégories à traiter

```text
INVOICE_READY_TO_ISSUE
INVOICE_OVERDUE
PAYMENT_SCHEDULE_MISSING
CONTRACT_WITHOUT_INVOICES
PAYMENT_DUPLICATE_WARNING
INVOICE_TOTAL_MISMATCH
PAYMENT_REQUIRES_REVIEW
```

---

# 92. Dashboard financier

Projection possible :

```ts
type FinanceDashboardProjection = {
  generatedAt: string

  draftInvoiceCount: number
  readyInvoiceCount: number
  issuedInvoiceCount: number
  overdueInvoiceCount: number

  totalOutstandingCents: number
  totalOverdueCents: number
  paymentsReceivedTodayCents: number
  paymentsReceivedThisMonthCents: number

  overdueInvoices: InvoiceSummary[]
  upcomingInvoices: InvoiceSummary[]
  recentPayments: PaymentSummary[]
  attentionItems: FinancialAttentionItem[]
}
```

---

# 93. Centre des opérations

Selon les permissions, le Dashboard principal peut afficher :

```text
Factures en retard
Factures à émettre
Paiements récents
Solde à recevoir
```

Ces blocs doivent rester secondaires pendant les opérations terrain.

---

# 94. Fiche Invoice — structure officielle

```text
En-tête
Résumé financier
Client et Contract
Items
Paiements
Document
Historique
```

Onglets possibles :

```text
Détails
Paiements
Documents
Historique
```

---

# 95. En-tête Invoice

Afficher :

```text
FAC-000081 · Jean Tremblay
[PARTIELLEMENT PAYÉE]
```

Informations secondaires :

- date;
- échéance;
- Contract;
- langue.

Action primaire contextuelle :

```text
Émettre
Envoyer
Enregistrer un Paiement
```

Menu :

```text
Modifier
Dupliquer
Annuler
Archiver
```

---

# 96. Résumé financier Invoice

Afficher clairement :

```text
Total
Payé
Crédité
Solde
Échéance
```

Le Solde doit être visuellement dominant lorsqu’il est supérieur à zéro.

---

# 97. Onglet Détails Invoice

Afficher :

- Client;
- Contract;
- dates;
- items;
- taxes;
- notes;
- montants;
- statut;
- langue.

---

# 98. Onglet Paiements Invoice

Afficher :

- liste des Paiements;
- montant;
- date;
- méthode;
- référence;
- statut;
- acteur;
- total payé;
- solde.

Action :

```text
Enregistrer un Paiement
```

---

# 99. Onglet Documents Invoice

Afficher :

- PDF;
- version;
- date;
- statut;
- envoi;
- téléchargement;
- courriel.

---

# 100. Onglet Historique Invoice

Afficher :

- création;
- modification;
- émission;
- envoi;
- Payment;
- annulation Payment;
- retard;
- annulation Invoice;
- archivage.

---

# 101. Liste Invoices

La liste doit permettre :

- recherche;
- filtre par statut;
- filtre par Client;
- filtre par Contract;
- filtre par échéance;
- filtre en retard;
- filtre payée;
- tri par date;
- tri par montant;
- tri par solde;
- pagination serveur.

---

# 102. Recherche Invoices

Champs :

- numéro;
- Client;
- entreprise;
- téléphone;
- courriel;
- Contract;
- référence Payment;
- montant;
- adresse.

---

# 103. Résumé Invoices

Statistiques compactes :

```text
Brouillons
À émettre
En retard
Partiellement payées
Payées
Solde total
```

---

# 104. Ligne Invoice Desktop

Contenu recommandé :

```text
Facture
Client
Contract
Statut
Émise
Échéance
Total
Payé
Solde
```

---

# 105. Carte Invoice Mobile

Afficher :

- numéro;
- Client;
- statut;
- total;
- solde;
- échéance;
- badge retard;
- chevron.

---

# 106. Fiche Payment

Structure :

```text
En-tête
Montant
Invoice
Client
Méthode
Référence
Historique
```

---

# 107. En-tête Payment

Afficher :

```text
PAI-000104
[ENREGISTRÉ]
```

Informations :

- montant;
- Client;
- Invoice;
- date.

Action secondaire :

```text
Ouvrir la Facture
```

Menu :

```text
Annuler le Paiement
```

---

# 108. Liste Payments

La liste doit permettre :

- recherche;
- filtre par méthode;
- filtre par date;
- filtre par statut;
- filtre par Client;
- filtre par Invoice;
- tri;
- pagination.

---

# 109. Résumé Payments

Statistiques compactes :

```text
Aujourd’hui
Cette semaine
Ce mois-ci
Annulés
```

---

# 110. Ligne Payment Desktop

Contenu recommandé :

```text
Paiement
Date
Client
Facture
Méthode
Référence
Montant
Statut
```

---

# 111. Carte Payment Mobile

Afficher :

- numéro;
- Client;
- montant;
- méthode;
- date;
- Invoice;
- statut.

---

# 112. Formulaire Invoice

Sections recommandées :

```text
Client et Contract
Items
Taxes
Dates
Langue
Notes
Validation
```

---

# 113. Formulaire Payment

Sections recommandées :

```text
Facture
Solde
Montant
Méthode
Date
Référence
Notes
Confirmation
```

---

# 114. Sélecteur Invoice dans Payment

Le sélecteur doit afficher :

- numéro;
- Client;
- total;
- payé;
- solde;
- échéance;
- statut.

Il doit filtrer par défaut :

```text
Factures avec solde > 0
```

---

# 115. Préremplissage Payment

Depuis une Facture :

```text
/payments/new?invoiceId=:invoiceId
```

Préremplir :

- Facture;
- Client;
- solde;
- montant égal au solde;
- date actuelle;
- méthode précédente du Client si configurée.

---

# 116. Confirmation Payment

Avant enregistrement, afficher :

```text
Facture FAC-000081
Solde actuel : 1 250,00 $
Paiement : 500,00 $
Nouveau solde : 750,00 $
```

---

# 117. Double soumission

Le bouton doit être bloqué pendant la mutation.

La transaction doit aussi être idempotente.

---

# 118. Barre d’actions

Desktop :

- actions collantes pour les formulaires longs;
- action principale à droite.

Mobile :

- barre inférieure;
- montant visible;
- safe area;
- bouton principal.

---

# 119. Mobile — Facture

Premier écran recommandé :

```text
FAC-000081
PARTIELLEMENT PAYÉE

Total : 1 250,00 $
Payé : 500,00 $
Solde : 750,00 $

Échéance : 20 août 2026

[Enregistrer un Paiement]
```

---

# 120. Mobile — Payment

Premier écran :

```text
PAI-000104
500,00 $

Jean Tremblay
FAC-000081
Virement Interac
5 août 2026
```

---

# 121. Desktop — densité

Le module financier doit être dense et lisible.

Éviter :

- une grande carte par statistique;
- des montants répétés dans plusieurs panneaux;
- des tableaux excessivement aérés;
- des actions destructives trop visibles.

---

# 122. Couleurs fonctionnelles

```text
Vert
Payé, Paiement confirmé

Bleu
Émise, envoyée, information

Ambre
Échéance proche, Paiement partiel, vérification

Rouge
En retard important, annulation, erreur

Gris
Brouillon, archivée, annulée
```

---

# 123. Rouge et retard

Toutes les Factures en retard ne doivent pas être affichées en rouge intense.

Utiliser :

- ambre pour retard récent;
- rouge pour retard important ou critique;
- texte et icône en plus de la couleur.

---

# 124. États vides Invoices

```text
Aucune Facture

Créez une Facture depuis un Client ou un Contrat.

[Nouvelle Facture]
```

---

# 125. États vides Payments

```text
Aucun Paiement

Les Paiements enregistrés apparaîtront ici.
```

---

# 126. Invoice sans Payment

État compact :

```text
Aucun Paiement enregistré
Solde : 1 250,00 $
```

---

# 127. Invoice payée

État positif :

```text
Facture payée en totalité
```

Ne pas utiliser une grande carte décorative.

---

# 128. Erreur partielle

Une erreur de chargement du PDF ne doit pas bloquer les montants ou les Paiements.

Une erreur de liste Payment ne doit pas masquer la Facture.

---

# 129. Erreur de cohérence

Si :

```text
paidCents + balanceCents != totalCents - creditedCents
```

Le système doit :

- afficher une erreur;
- bloquer certaines actions;
- créer un AttentionItem;
- permettre un recalcul autorisé;
- journaliser.

---

# 130. RecalculateInvoiceBalance

Cas d’utilisation administratif :

```text
RecalculateInvoiceBalance
```

Il doit :

- relire les Payments valides;
- relire les Credits valides;
- recalculer;
- comparer;
- corriger si autorisé;
- produire un événement.

---

# 131. Permissions Invoices

Permissions recommandées :

```text
invoice.read
invoice.create
invoice.update_draft
invoice.issue
invoice.send
invoice.cancel
invoice.archive
invoice.generate_document
invoice.read_financial
invoice.export
```

---

# 132. Permissions Payments

```text
payment.read
payment.record
payment.cancel
payment.export
```

---

# 133. Permissions Credits futures

```text
credit.read
credit.create
credit.issue
credit.apply
credit.cancel
```

---

# 134. Administrator

Accès complet.

---

# 135. Accounting

Accès recommandé :

- Invoices complet;
- Payments complet;
- rapports;
- annulations;
- exports;
- documents.

---

# 136. Manager

Accès recommandé :

- lecture financière;
- rapports;
- retard;
- annulation selon permission;
- aucune gestion de rôle.

---

# 137. Sales

Accès possible :

- lecture du statut financier Client;
- lecture du solde;
- création de Facture selon décision;
- aucun CancelPayment par défaut.

---

# 138. Dispatcher

Lecture limitée seulement si nécessaire.

Aucun Payment.

---

# 139. Operator

Aucun accès financier.

---

# 140. RLS Invoices

Lecture :

- même organisation;
- permission.

Écriture :

- même organisation;
- permission;
- statut compatible.

---

# 141. RLS Payments

L’écriture directe générale doit être évitée.

Utiliser :

```text
record_payment
cancel_payment
```

---

# 142. Service Role

Les opérations serveur utilisant `service_role` doivent rester dans un environnement sécurisé.

Aucune clé sensible dans le frontend.

---

# 143. Storage Policies

Les PDF doivent être privés.

Accès selon :

- organisation;
- Invoice;
- permission;
- document.

---

# 144. Chemin Storage Invoice

Exemple :

```text
organizations/{organizationId}/invoices/{invoiceId}/documents/{version}.pdf
```

---

# 145. Signed URLs

Ne jamais stocker l’URL signée.

Stocker le chemin.

---

# 146. Événements Invoice

```text
InvoiceCreated
InvoiceUpdated
InvoiceReady
InvoiceIssued
InvoiceSent
InvoiceSendFailed
InvoiceMarkedOverdue
InvoicePaid
InvoiceCancelled
InvoiceArchived
InvoiceDocumentGenerated
InvoiceBalanceRecalculated
```

---

# 147. Événements Payment

```text
PaymentRecorded
PaymentCancelled
PaymentDuplicateWarning
PaymentReceiptGenerated
```

---

# 148. FinancialEvent payload

Payload minimal :

- ancien statut;
- nouveau statut;
- montant;
- solde précédent;
- nouveau solde;
- référence;
- raison;
- Invoice;
- Payment.

Ne pas enregistrer inutilement tout le document.

---

# 149. Audit

Actions obligatoirement auditées :

- émission;
- annulation Invoice;
- enregistrement Payment;
- annulation Payment;
- modification de taxes;
- modification après émission;
- recalcul;
- export;
- Crédit futur.

---

# 150. Exports

Exports possibles :

```text
Invoices
Payments
Accounts receivable
Overdue invoices
Client statement
```

Chaque export doit respecter :

- permissions;
- organisation;
- filtres;
- données sensibles;
- audit.

---

# 151. Rapports V1

Rapports recommandés :

```text
Solde à recevoir
Factures en retard
Paiements par période
Factures par statut
Revenus facturés
Revenus encaissés
```

---

# 152. Facturé vs encaissé

Ces indicateurs ne doivent pas être confondus.

```text
Facturé
Somme des Invoices émises

Encaissé
Somme des Payments valides
```

---

# 153. Revenu comptable

Le terme `revenu` peut avoir une signification comptable précise.

L’interface V1 doit privilégier :

```text
Montant facturé
Montant reçu
Solde à recevoir
```

---

# 154. Périodes

Filtres :

```text
Aujourd’hui
Cette semaine
Ce mois-ci
Cette saison
Période personnalisée
```

---

# 155. Saison

Les rapports financiers peuvent filtrer par :

- saison du Contract;
- date Invoice;
- date Payment.

La définition doit être visible.

---

# 156. Performance des listes

Utiliser :

- pagination serveur;
- filtres serveur;
- index;
- recherche debouncée;
- agrégats;
- vues SQL;
- RPC.

---

# 157. Projections financières

Exemples :

```text
invoice_balance_view
client_financial_summary
contract_financial_summary
overdue_invoice_summary
payment_period_summary
```

---

# 158. ClientFinancialSummary

Structure conceptuelle :

```ts
type ClientFinancialSummary = {
  clientId: ClientId
  invoiceCount: number
  totalInvoicedCents: number
  totalPaidCents: number
  totalCreditedCents: number
  outstandingBalanceCents: number
  overdueBalanceCents: number
  lastPaymentAt?: string
}
```

---

# 159. ContractFinancialSummary

```ts
type ContractFinancialSummary = {
  contractId: ContractId
  contractTotalCents: number
  scheduledCents: number
  invoicedCents: number
  paidCents: number
  outstandingCents: number
  nextDueDate?: string
  hasScheduleMismatch: boolean
}
```

---

# 160. Realtime

Realtime peut signaler :

- nouveau Payment;
- Invoice payée;
- annulation;
- retard recalculé;
- document généré.

L’interface doit relire la projection autoritative.

---

# 161. Tâche de retard

Le passage à `OVERDUE` peut être géré par :

- calcul à la lecture;
- tâche planifiée;
- fonction SQL;
- combinaison.

La stratégie doit être cohérente.

---

# 162. Job quotidien

Une tâche quotidienne peut :

- identifier les Factures en retard;
- mettre à jour le statut;
- créer les AttentionItems;
- préparer les rappels futurs.

---

# 163. Idempotence des jobs

Un job relancé ne doit pas créer plusieurs événements identiques pour le même changement.

---

# 164. Concurrence

Les opérations financières utilisent :

- verrou de ligne;
- version;
- transaction;
- idempotencyKey;
- contraintes.

---

# 165. Modification concurrente Invoice

Exemple :

```text
Cette Facture a été modifiée.
Rechargez avant de poursuivre.
```

---

# 166. Payment concurrent

Deux personnes enregistrant le solde en même temps :

- une transaction réussit;
- la suivante relit le nouveau solde;
- le surpaiement est bloqué;
- aucun double Paiement silencieux.

---

# 167. Query Keys

Exemples :

```ts
invoiceKeys.all
invoiceKeys.list(filters)
invoiceKeys.detail(id)
invoiceKeys.payments(id)
invoiceKeys.documents(id)
invoiceKeys.history(id)

paymentKeys.all
paymentKeys.list(filters)
paymentKeys.detail(id)

financeKeys.dashboard(filters)
financeKeys.clientSummary(clientId)
financeKeys.contractSummary(contractId)
financeKeys.overdue(filters)
```

---

# 168. Mutations Invoice

```text
CreateInvoice
UpdateDraftInvoice
MarkInvoiceReady
IssueInvoice
SendInvoice
CancelInvoice
ArchiveInvoice
GenerateInvoiceDocument
RecalculateInvoiceBalance
```

---

# 169. Mutations Payment

```text
RecordPayment
CancelPayment
```

---

# 170. Transactions critiques

Doivent être atomiques :

```text
CreateInvoicesFromSchedule
IssueInvoice
RecordPayment
CancelPayment
CancelInvoice
ApplyCredit
RecalculateInvoiceBalance
```

---

# 171. Migration depuis l’ancienne RECA App

Avant migration :

1. inventorier les Invoices;
2. inventorier les Payments;
3. inventorier les statuts;
4. inventorier les taxes;
5. inventorier les totaux;
6. inventorier les soldes;
7. inventorier les documents;
8. inventorier les liens Contract;
9. inventorier les liens Client;
10. inventorier les échéanciers;
11. inventorier les annulations;
12. inventorier les données orphelines;
13. inventorier les politiques RLS;
14. inventorier les incohérences.

---

# 172. Mappings Invoice legacy

Créer un registre :

```text
Ancienne valeur
Nouveau statut
Confiance
Action
```

Toute valeur ambiguë doit être marquée pour révision.

---

# 173. Mappings Payment legacy

Même principe pour :

- statut;
- méthode;
- date;
- montant;
- annulation;
- référence.

---

# 174. Incohérences financières

Exemples :

- total différent de la somme des items;
- taxes incohérentes;
- paid supérieur au total;
- balance négatif;
- Payment sans Invoice;
- Invoice sans Client;
- statut PAID avec solde;
- statut OVERDUE avec solde zéro;
- Payment annulé encore comptabilisé.

---

# 175. Rapport de migration

Le rapport doit inclure :

```text
Invoices totales
Payments totaux
Incohérences
Données sans relation
Statuts inconnus
Soldes recalculés
Documents manquants
Éléments à réviser
```

---

# 176. Backfill des soldes

Le backfill doit recalculer :

```text
paidCents
creditedCents
balanceCents
status
```

à partir des opérations historiques valides.

Il doit produire un rapport avant application finale.

---

# 177. Aucune invention

Ne jamais inventer :

- date Payment;
- méthode;
- référence;
- Client;
- Invoice;
- taxe.

Marquer les données inconnues.

---

# 178. Compatibilité progressive

Pendant la transition :

- ancienne RECA App continue;
- V2 utilise des adapters;
- colonnes nouvelles additives;
- fonctions transactionnelles centralisées;
- aucune suppression destructrice;
- rapports de comparaison.

---

# 179. Double écriture

La double écriture financière est particulièrement risquée.

Elle ne doit être utilisée que si :

- nécessaire;
- transactionnelle;
- centralisée;
- surveillée;
- temporaire.

---

# 180. Feature flags

Exemples :

```text
new_invoice_workspace
new_payment_flow
new_finance_dashboard
new_invoice_documents
```

Ils doivent être retirés après stabilisation.

---

# 181. Tests unitaires Invoice

Tester :

- calculs;
- taxes;
- arrondi;
- statut;
- retard;
- émission;
- annulation;
- version;
- document;
- modification interdite.

---

# 182. Tests unitaires Payment

Tester :

- montant partiel;
- montant complet;
- surpaiement;
- doublon;
- annulation;
- recalcul;
- idempotence;
- statut Invoice.

---

# 183. Tests unitaires Schedule

Tester :

- pourcentages;
- montants fixes;
- somme;
- dates;
- génération unique;
- modification.

---

# 184. Tests d’intégration

Tester :

- repositories;
- RPC;
- RLS;
- Storage;
- génération PDF;
- envoi;
- recalcul;
- Dashboard;
- exports;
- migration.

---

# 185. Tests E2E — génération depuis Contract

```text
Contract actif
  ↓
Échéancier à trois versements
  ↓
Générer Invoices
  ↓
Trois brouillons
  ↓
Montant total cohérent
```

---

# 186. Tests E2E — Payment partiel

```text
Invoice 1 000 $
  ↓
Payment 400 $
  ↓
Statut PARTIALLY_PAID
  ↓
Solde 600 $
```

---

# 187. Tests E2E — Payment complet

```text
Invoice solde 600 $
  ↓
Payment 600 $
  ↓
Statut PAID
  ↓
Solde 0 $
```

---

# 188. Tests E2E — annulation Payment

```text
Invoice PAID
  ↓
Annuler Payment
  ↓
Payment CANCELLED
  ↓
Invoice redevient ISSUED ou OVERDUE
  ↓
Solde recalculé
```

---

# 189. Tests E2E — concurrence

```text
Deux Payments du solde
  ↓
Premier accepté
  ↓
Deuxième bloqué
  ↓
Aucun solde négatif
```

---

# 190. Tests E2E — Invoice en retard

```text
Invoice émise
  ↓
Échéance dépassée
  ↓
Solde > 0
  ↓
OVERDUE
  ↓
AttentionItem
```

---

# 191. Tests E2E — annulation Invoice

```text
Invoice sans Payment
  ↓
Annuler
  ↓
Raison requise
  ↓
Historique conservé
  ↓
Aucun nouveau Payment permis
```

---

# 192. Tests responsive

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

# 193. Fixtures

Prévoir :

```text
Invoice brouillon
Invoice prête
Invoice émise
Invoice envoyée
Invoice partiellement payée
Invoice payée
Invoice en retard
Invoice annulée
Invoice avec deux taxes
Payment comptant
Payment chèque
Payment virement
Payment annulé
Contract avec échéancier
Incohérence de solde
Client avec plusieurs Invoices
```

---

# 194. Master UI

Le module doit dériver de :

## Fiche commerciale et financière

Pour :

- Invoice;
- Payment.

## Liste dense

Pour :

- Invoices;
- Payments.

## Formulaire financier

Pour :

- Invoice;
- Payment;
- échéancier.

---

# 195. Validation avant code

Avant implémentation finale, valider :

- statuts Invoice;
- statuts Payment;
- méthode de taxes;
- stratégie d’arrondi;
- génération automatique;
- Invoice READY;
- Invoice ISSUED;
- document original;
- surpaiement;
- Paiements multi-Invoices;
- Crédits;
- remboursement;
- annulation avec Payment;
- accès Sales;
- accès Manager;
- rapports;
- retards;
- rappels;
- exports.

---

# 196. Hors périmètre initial

Ne pas bloquer la V1 avec :

- comptabilité générale complète;
- grand livre;
- rapprochement bancaire;
- intégration bancaire automatisée;
- cartes de crédit intégrées;
- paiement Client en ligne;
- remboursement automatisé;
- multi-devises;
- crédits complexes;
- intérêts automatiques;
- recouvrement automatisé;
- synchronisation QuickBooks;
- taxes multi-juridictions;
- facturation par Mission;
- abonnements récurrents avancés.

---

# 197. Décisions à confirmer

Avant l’implémentation finale, confirmer :

- statuts exacts Invoice;
- statut READY nécessaire ou non;
- génération des numéros;
- taxes par ligne ou globales;
- stratégie d’arrondi;
- modification après émission;
- annulation avec Payment;
- surpaiement;
- multi-allocation;
- Crédit V1;
- remboursement;
- facture depuis échéancier;
- génération automatique ou manuelle;
- délai par défaut;
- statut de retard calculé ou persisté;
- document après Payment;
- reçu;
- permission Sales;
- permission Manager;
- exports;
- rappels;
- seuils de retard.

Toutes les décisions confirmées doivent être ajoutées à `memory.md`.

---

# 198. Règles non négociables

Ne jamais modifier silencieusement une Facture émise.

Ne jamais modifier directement un Payment enregistré.

Ne jamais permettre un solde négatif sans modèle explicite de Crédit.

Ne jamais compter un Payment annulé dans le total payé.

Ne jamais marquer une Facture payée si son solde est supérieur à zéro.

Ne jamais marquer un envoi réussi si le courriel a échoué.

Ne jamais générer plusieurs séries de Factures depuis le même échéancier.

Ne jamais exposer les données financières à l’Operator.

Ne jamais supprimer une Facture ou un Payment historique.

Ne jamais utiliser le frontend comme seule autorité de calcul.

Ne jamais appliquer une transaction financière sans audit.

Ne jamais afficher une donnée financière incohérente comme fiable.

---

# 199. Diagramme principal

```text
Contract
  ↓
PaymentSchedule
  ↓
Invoice
  ├── InvoiceItems
  ├── TaxLines
  ├── Documents
  ├── Payments
  ├── Credits
  └── FinancialEvents
        ↓
ClientFinancialSummary
        ↓
Dashboard financier
```

---

# 200. Flux Invoice officiel

```text
Contract ou Client
      ↓
Créer Invoice
      ↓
Ajouter items
      ↓
Calculer taxes
      ↓
Valider
      ↓
Émettre
      ↓
Générer PDF
      ↓
Envoyer
      ↓
Suivre solde
```

---

# 201. Flux Payment officiel

```text
Invoice avec solde
      ↓
Saisir Payment
      ↓
Valider montant
      ↓
Transaction
      ↓
Créer Payment
      ↓
Recalculer Invoice
      ↓
Mettre à jour statut
      ↓
Créer événement
```

---

# 202. Flux annulation Payment

```text
Payment enregistré
      ↓
Demander raison
      ↓
CancelPayment
      ↓
Recalcul Invoice
      ↓
Mettre à jour statut
      ↓
Historique
```

---

# 203. Résumé officiel

Le Contract définit les modalités.

L’échéancier définit les versements prévus.

La Invoice représente une créance officielle.

Le Payment représente un montant réellement reçu.

Les montants sont stockés avec une convention sûre.

Les taxes et arrondis sont centralisés.

Les Factures émises ne sont jamais réécrites silencieusement.

Les Payments sont annulés, jamais modifiés arbitrairement.

Les soldes et statuts sont recalculés transactionnellement.

Les Paiements partiels sont supportés.

Les surpaiements sont bloqués dans la V1.

Les données financières sont protégées par des permissions et RLS.

Les documents et événements conservent l’historique.

L’objectif est de fournir à Groupe RECA un suivi financier fiable, clair et directement lié aux Clients et Contrats.
