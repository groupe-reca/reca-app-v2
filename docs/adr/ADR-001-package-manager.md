# ADR-001 — Package manager

## Contexte

`docs/16-Development-Standards.md` §5 recommande pnpm pour tout le dépôt mais laisse la décision finale ouverte, à confirmer au bootstrap technique (§195). Un seul gestionnaire de paquets et un seul lockfile doivent être utilisés pour tout le dépôt.

## Décision

Utiliser **pnpm** comme gestionnaire de paquets officiel de `reca-app-v2`.

## Options considérées

- **pnpm** — recommandation officielle des standards de développement; installation rapide, `node_modules` strict qui évite les dépendances fantômes, bon support des workspaces si un futur package partagé est nécessaire.
- **npm** — inclus avec Node, aucune installation supplémentaire, mais support de workspace plus faible.
- **yarn** — support de workspace mature, mais n'apporte aucun avantage documenté par rapport à pnpm ici.

## Conséquences

- Un seul lockfile (`pnpm-lock.yaml`) doit être versionné; aucun second lockfile ne doit être ajouté.
- Les commandes et le `README.md` doivent référencer `pnpm`.
- Les pipelines CI doivent installer et mettre en cache pnpm.

## Statut

Accepted

## Date

2026-08-07
