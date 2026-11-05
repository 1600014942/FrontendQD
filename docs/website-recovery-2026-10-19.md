# Website service recovery, 2026-10-19

## Incident

`https://acucompute.com/` returned HTTP 502. Nginx was running, but its
upstream `127.0.0.1:4173` had no listener. The website unit was a dangling
symlink to `/root/jerry/FrontendQD/deploy/acuindex-site.service`.

Commit `adaf537` deleted the tracked unit on August 8. The host retained its
symlink. The host rebooted on October 18 at 16:58 CEST; the retained Nginx
log shows upstream connection refusals from 17:06 CEST onward. This does not
establish exactly when the old website process stopped.

## Recovery

- Restored the unit definition, based on historical commit `ac55c7c`.
- Installed a regular file at `/etc/systemd/system/acuindex-site.service`,
  rather than another link into a development checkout.
- Enabled and started only `acuindex-site.service`. It became active on
  October 19 at 05:13:53 CEST, with failure restart enabled.
- Kept the existing canonical website server and compiled public files.
  No build, content change, branch switch, or restoration of old source.
- Preserved the two existing modifications in `public/app.js` and `src/app.ts`.
- Did not change Nginx, DNS, TLS, production secrets, Docker containers,
  database schemas, or volumes.

The isolated source worktree is
`/root/jerry/.worktrees/website-service-recovery-20261019`, based on
`origin/main` (`47761b9`). The running server and public files remain in
`/root/jerry/FrontendQD`, at the same revision with the pre-existing article
copy modifications. The restored service does not depend on this task worktree.

The independent executor was `acuindex-site-recovery-20261019.service`.
It backed up the original configuration and included automatic rollback if
service activation or HTTP verification failed. The first execution logged a
missing `rg` in systemd's PATH while checking the port. Port 4173 had already
been independently confirmed unused. Recovery succeeded; the helper now
checks `ss` output directly without that PATH dependency.

Local evidence and the original symlink are retained in:

```text
/root/jerry/acu-repo-management/diagnostics/website-service-20261019.9NYVVb
```

## Verification

- Service is active and enabled; `Restart=on-failure`.
- Origin HTTPS and public HTTPS return 200 for `/`, `/acu-index/`,
  `/articles/`, `/book-demo/`, `/app.js`, and `/styles.css`.
- Public homepage renders at 1440x1000 and 390x844 without page errors,
  failed resources, broken images, or horizontal overflow.
- Homepage console links point to `console.acucompute.com`.
- Console remains HTTP 200. Production frontend and Router remain healthy.
- Container IDs, image IDs, startup times, and restart counts are unchanged.
- Website server, homepage, JavaScript, and CSS SHA-256 values are unchanged.
- Unit validation, shell syntax validation, and TypeScript checking pass.

This recovery verifies website availability, not all business workflows.
Authenticated login, paid inference, and booking email delivery were not
tested. The existing Node server still returns 501 for `/api/book-demo`;
that pre-existing deployment gap is outside this availability repair.

## Maintenance

Install the tracked unit as a regular file when changing its configuration;
do not reintroduce a symlink to a file that can disappear during Git changes.
Do not rerun the recovery helper against an active website: it deliberately
refuses to replace a running service.

The backup's `unit.before` is the original broken symlink. Restoring it
would intentionally return the website to its previous unavailable state,
so it is incident evidence, not a healthy application rollback candidate.
