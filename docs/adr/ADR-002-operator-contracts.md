# ADR-002 — Contrats d'intégration avec RECA Opérateur

## Contexte

`docs/03-Application-Architecture.md` §51 pose deux options pour partager les contrats de données (Mission, MissionItem, statuts, etc.) entre `reca-app-v2` et `reca-operateur` : un package npm partagé (`@reca/contracts`) ou une génération de types à partir du schéma. Le document précise que « le choix final sera effectué après analyse des deux dépôts ».

Le propriétaire du projet a confirmé que `reca-app-v2` utilisera **la même base de données Supabase que `reca-app`** — il n'y a pas de nouvelle base de données créée pour la nouvelle application. Dans le système existant, `reca-operateur` opère déjà sur cette même base. Cette confirmation change la nature de la décision : la question n'est plus « comment synchroniser deux schémas séparés » mais « comment structurer une base partagée par trois applications ».

## Décision

Le contrat d'intégration entre `reca-app-v2` et `reca-operateur` **est le schéma Supabase partagé lui-même** (tables, vues, RPC, migrations) — pas un package npm séparé, pas de pipeline de génération de types inter-dépôts.

Chaque dépôt génère ses propres types TypeScript locaux à partir de ce même schéma via le Supabase CLI (voir ADR relatif à la génération des types). Les champs ou statuts hérités qui ne correspondent pas encore à la nouvelle terminologie doivent passer par la couche d'anti-corruption déjà exigée par `docs/03-Application-Architecture.md` §52 (ex. `LegacyContractMapper`), afin que `reca-app-v2` ne soit pas contaminée par les anciennes conventions même si elle lit la même table.

## Options considérées

- **Package npm partagé (`@reca/contracts`)** — écarté : ajoute un coût de publication/versionnement sans bénéfice si les deux applications lisent déjà directement les mêmes tables Supabase.
- **Génération de types indépendante par dépôt à partir d'un schéma dupliqué** — écarté : n'a pas de sens si le schéma est physiquement partagé, pas dupliqué.
- **Schéma Supabase partagé comme contrat** (retenu) — le plus simple et le plus fidèle à l'architecture réelle du système existant.

## Conséquences

- Toute modification de schéma affectant des tables consommées par `reca-operateur` (Missions, MissionItems, statuts, géométrie, synchronisation) doit être coordonnée : migration additive, tests de compatibilité dans les deux dépôts (`docs/16-Development-Standards.md` §105, §128), et mise à jour de la documentation des deux projets.
- RLS devient le mécanisme principal d'isolation entre les responsabilités des deux applications sur les mêmes tables — il doit être testé avec les profils Operator et non-Operator (`docs/16-Development-Standards.md` §93).
- `reca-app-v2` ne doit toujours pas importer le code React de `reca-operateur`; seule la base de données est partagée, pas le code applicatif.
- Cette décision doit être revalidée si un jour `reca-operateur` migre vers une base de données distincte.

## Statut

Accepted

## Date

2026-08-07
