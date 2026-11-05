# Worktree Integration, November 5, 2026

The October 19 recovery's untracked service unit, recovery helper, and incident
record are now preserved in main. The unit matches the installed regular
systemd unit byte for byte; the helper is retained for its documented inactive,
broken-symlink recovery scenario and was not executed again.

The article-list heading and introduction already served by the production
working directory are now recorded in source and its generated `public/app.js`.
Only those existing copy edits are integrated; no homepage redesign, service
restart, or new production content is introduced.

Validation:

- TypeScript `npm run check` passed.
- `npm run build` rebuilt all 14 routes.
- Rebuilt `public/app.js` matches the running directory byte for byte.
- Source `src/app.ts` matches the pre-existing production edit byte for byte.
- Service-unit verification and recovery-helper shell syntax checks passed.
- Installed service-unit contents match the tracked unit.

The original working directories and branches are preserved, including their
pre-existing dirty/untracked copies. Those copies are not additional missing
features: their contents are now represented in main. Local evidence and
repository bundles are under the protected
`/root/jerry/acu-repo-management/worktree-audit-20261105/` directory.
