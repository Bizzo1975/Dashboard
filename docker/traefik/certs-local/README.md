# Optional trusted certs for Traefik (local dev)

Place **mkcert** (or other) PEM + key here, e.g. `kecktech.pem` / `kecktech-key.pem`, and add a dynamic TLS file that references `/certs-local/...`. See **`docs/HTTPS-TEST-ENV.md`**.

`*.pem` / `*.key` in this folder are **gitignored** so keys are never committed.
