# OpenBao / Umami secrets note

OpenBao remains sealed after the Traefik outage recovery window.

Until unsealed, Umami continues to run from the recovered secrets file on the Umami host:

- `/run/umami-secrets/umami.env` (runtime mount / recovered env)

Do not rotate Umami DB credentials until OpenBao is unsealed and the canonical secret path is confirmed.
