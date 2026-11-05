#!/usr/bin/env bash
set -euo pipefail

service=acuindex-site.service
target=/etc/systemd/system/$service
site=/root/jerry/FrontendQD
source_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
backup_root=/root/jerry/acu-repo-management/diagnostics
containers=(acu-router-alpha-acu-router-1 acu-router-alpha-new-api-1)
assets=(
  "$site/server.mjs"
  "$site/public/index.html"
  "$site/public/app.js"
  "$site/public/styles.css"
)

if [[ $EUID -ne 0 ]]; then
  echo "Run as root through an independent systemd-run executor." >&2
  exit 1
fi
if systemctl is-active --quiet "$service"; then
  echo "Refusing recovery of an already active website." >&2
  exit 1
fi
if [[ ! -L "$target" || -e "$target" ]]; then
  echo "Expected a broken website service symlink; refusing other states." >&2
  exit 1
fi
listeners=$(ss -H -lnt 'sport = :4173')
if [[ -n "$listeners" ]]; then
  echo "Port 4173 is occupied; refusing to replace its owner." >&2
  exit 1
fi

/usr/bin/node --check "$site/server.mjs"
systemd-analyze verify "$source_dir/$service"
mkdir -p "$backup_root"
backup=$(mktemp -d "$backup_root/website-service-20261019.XXXXXX")
chmod 700 "$backup"
cp -a "$target" "$backup/unit.before"
sha256sum "${assets[@]}" > "$backup/assets.before"
docker inspect "${containers[@]}" \
  --format '{{.Id}} {{.Image}} {{.State.StartedAt}} {{.RestartCount}}' \
  > "$backup/containers.before"

rollback() {
  local result=$?
  trap - ERR
  echo "Website recovery failed; restoring previous service configuration." >&2
  systemctl stop "$service" || true
  cp -a --remove-destination "$backup/unit.before" "$target"
  systemctl daemon-reload
  echo "Rollback evidence: $backup" >&2
  exit "$result"
}
trap rollback ERR

# Install a regular unit file so deletion in a Git checkout cannot orphan it.
cp --remove-destination "$source_dir/$service" "$target"
chmod 644 "$target"
systemctl daemon-reload
systemctl enable "$service"
systemctl start "$service"

curl --fail --silent --show-error --retry 5 --retry-connrefused \
  --retry-delay 1 --max-time 10 http://127.0.0.1:4173/ \
  --output "$backup/home.after.html"
cmp "$backup/home.after.html" "$site/public/index.html"
for route in / /acu-index/ /articles/ /book-demo/ /app.js /styles.css; do
  curl --fail --silent --show-error --max-time 15 \
    --resolve acucompute.com:443:127.0.0.1 \
    "https://acucompute.com$route" --output /dev/null
  curl --fail --silent --show-error --max-time 15 \
    "https://acucompute.com$route" --output /dev/null
  printf 'OK origin + public: %s\n' "$route"
done

systemctl is-active "$service"
systemctl is-enabled "$service"
sha256sum "${assets[@]}" > "$backup/assets.after"
cmp "$backup/assets.before" "$backup/assets.after"
docker inspect "${containers[@]}" \
  --format '{{.Id}} {{.Image}} {{.State.StartedAt}} {{.RestartCount}}' \
  > "$backup/containers.after"
cmp "$backup/containers.before" "$backup/containers.after"
trap - ERR
printf 'Website recovered. Evidence and original configuration: %s\n' "$backup"
