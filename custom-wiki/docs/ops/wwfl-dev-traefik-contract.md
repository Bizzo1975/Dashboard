# WWFL Dev Traefik contract

Canonical routing for `dev.willworkforlunch.com`:

- Traefik file: `/opt/docker/traefik/dynamic/dev-willworkforlunch.yml`
- Backend MUST be `http://100.88.196.37:80` (nginx front of the personal-website stack)
- Do NOT point Traefik at `:3006` or `:3000` — those are internal app ports and cause **502**

Dev stack (`/opt/docker/personal-website` on `100.88.196.37`):

- `personal-website-nginx-1` publishes host `:80` / `:443`
- `personal-website-app-1` listens on Docker network `:3000` only
- Health: nginx `200` on `http://127.0.0.1/` from the VM

Verify: `curl -sk -o /dev/null -w '%{http_code}\n' https://dev.willworkforlunch.com/`
