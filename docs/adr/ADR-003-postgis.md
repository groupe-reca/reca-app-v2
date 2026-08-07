# ADR-003 — PostGIS

## Contexte

`docs/03-Application-Architecture.md` §7.2 liste PostGIS comme extension possible « lorsque nécessaire ». `docs/00-Vision.md` §9.3 et §58 exigent que les géométries de zones de déneigement soient fiables et que les calculs (surface, union, buffer, simplification, proximité) soient centralisés, sans imposer PostGIS spécifiquement — un contrat GeoJSON (`Polygon`, `MultiPolygon`, `GeoPoint`, `BoundingBox`) est explicitement mentionné comme format possible.

Lors de la clarification des décisions de bootstrap, le propriétaire du projet n'était pas certain de ce qu'est PostGIS et a supposé que « Supabase va gérer ça aussi ». C'est partiellement exact : Supabase permet d'activer l'extension PostGIS trivialement, mais la vraie question — utiliser des colonnes de géométrie PostGIS dès maintenant vs. stocker la géométrie en GeoJSON/JSONB — n'a pas été tranchée par le propriétaire. Conformément à `docs/00-Vision.md` §28.3 (« Aucune invention silencieuse »), cette décision ne doit pas être présumée réglée.

## Décision

**Différée.** Par défaut, jusqu'à nouvelle décision : stocker la géométrie des zones de déneigement en GeoJSON/JSONB, sans colonnes PostGIS dédiées. Réévaluer PostGIS spécifiquement lorsqu'un besoin concret de requête spatiale apparaît (proximité, optimisation de routes, recherche géographique à l'échelle).

## Options considérées

- **JSONB/GeoJSON dès le départ** (défaut actuel) — plus simple à mettre en place, compatible avec les besoins immédiats de capture et d'affichage de zones; ne bloque pas une migration future vers PostGIS.
- **PostGIS dès le bootstrap** — évite une conversion de schéma plus tard, mais ajoute de la complexité (extension, types de colonnes, index spatiaux) avant qu'un besoin réel de requête spatiale soit confirmé.

## Conséquences

- Les migrations initiales n'incluent pas de colonnes de géométrie PostGIS.
- Si PostGIS est adopté plus tard, une migration additive de conversion sera nécessaire (JSONB → géométrie), à planifier avec les principes « Expand → Migrate → Switch → Contract » de `docs/03-Application-Architecture.md` §84.
- Cette décision doit être revisitée explicitement — ne pas la faire passer silencieusement à « Accepted » sans validation du propriétaire du projet.

## Statut

Proposed / Deferred — non tranchée définitivement, en attente d'un besoin concret ou d'une décision explicite du propriétaire du projet.

## Date

2026-08-07
