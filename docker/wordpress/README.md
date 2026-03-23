# WordPress branding (Kecktech)

- **`branding/transparent-logo.png`** — Source logo (keep in sync with `img/transparent-logo.png` in repo root).
- **`mu-plugins/kecktech-logo.php`** — Must-use plugin: copies the logo into `wp-content/uploads/kecktech/`, sets **Appearance → Customize → Site Identity** custom logo and **site icon**, forces **HTTPS** media URLs (Traefik), rebuilds `get_custom_logo` / **Site Logo** block markup when needed, adds header CSS for **Astra builder** slots, and rewrites **REQUEST QUOTE** → **Customer Login** (link defaults to `#`; set via `add_filter( 'kecktech_customer_portal_url', fn () => 'https://…' );` in a small custom MU plugin or theme). Bump internal brand version when replacing bundled artwork.

Mounted by `docker-compose.yml` on the `wordpress` service:

- `.../uploads/kecktech-branding` → read-only source
- `.../wp-content/mu-plugins` → read-only MU plugin

After changing the PNG, restart WordPress and clear any caching plugin. If you fork the MU plugin, bump `KECKTECH_LOGO_BRAND_VERSION` when you replace the artwork so existing databases pick up the new file. To opt out of the bundled logo, disable or remove the MU plugin.
