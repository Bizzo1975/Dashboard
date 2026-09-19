/**
 * Per-app context injected into every help article for depth + accuracy.
 */
module.exports = {
  erpnext: {
    urls: ["https://erp.kecktech.net", "https://ops.kecktech.net"],
    about:
      "ERPNext (Desk) is Kecktech’s ERP for CRM, invoicing, assets (including HaaS), and operations records. Many staff sessions hit Authelia first, then Desk.",
    uiMap: [
      "Awesome Bar (search) at the top — fastest way to open DocTypes like Customer or Sales Invoice",
      "Left workspace sidebar — modules such as CRM, Accounting, Stock, Assets",
      "Avatar menu (top-right) — user, company context, Log out",
      "List view vs Form view — lists support filters; forms have Save / Submit where applicable",
    ],
    pitfalls: [
      "Confusing Authelia password with a separate ERPNext local user password",
      "Missing Role permissions looking like “the module is broken”",
      "Creating Customers without a Contact email — portal/Zammad linkage becomes harder later",
      "Using Submit on documents without understanding stock/accounting impact",
    ],
    tips: [
      "Prefer Awesome Bar over hunting through nested menus.",
      "Match Customer contact emails to portal/Zammad identities when possible.",
      "For HaaS devices, record Assets with serials and link the Customer.",
    ],
  },
  zammad: {
    urls: ["https://tickets.kecktech.net", "https://support.kecktech.net"],
    about:
      "Zammad is the Kecktech help desk. Customers use the portal UI; agents use the agent interface. Email to support@kecktech.net also creates tickets. Critical/High priorities can SMS on-call via n8n → Twilio.",
    uiMap: [
      "Customer portal: My Tickets, New Ticket, ticket timeline replies",
      "Agent UI: Overviews, ticket pane, article composer, Time Accounting tab",
      "States: New, Open, Pending Reminder, Pending Close, Closed",
      "Groups commonly used: MSP Support, HaaS, Senior Care, Internal",
    ],
    pitfalls: [
      "Replying by personal email outside the thread — breaks ticket history",
      "Pasting passwords into public ticket articles instead of Vaultwarden",
      "Agents forgetting Time Accounting / service tags used for billing",
      "Customers searching while filters hide Closed/Pending tickets",
    ],
    tips: [
      "Put the system name and symptom in the subject line.",
      "Use Pending Reminder with a date when waiting on vendors.",
      "Pending Close after resolution; let auto-close finish when customers go silent.",
    ],
  },
  vaultwarden: {
    urls: ["https://vault.kecktech.net"],
    about:
      "Vaultwarden is Kecktech’s Bitwarden-compatible password manager for staff and shared client collections. The master password is never recoverable by admins.",
    uiMap: [
      "Web vault item list with collection filters",
      "New item → Login / Secure Note / Card",
      "Organization Admin Console for collections and members",
      "Browser extension: set custom server URL before login",
    ],
    pitfalls: [
      "Pointing the official Bitwarden extension at bitwarden.com instead of vault.kecktech.net",
      "Storing shared client secrets only in My Vault",
      "Emailing master passwords or collection exports",
      "Losing TOTP for the vault account without backup codes",
    ],
    tips: [
      "One collection per client company; name it consistently with RMM/ERP.",
      "Store RustDesk IDs and HaaS local admin creds on the client collection.",
      "Use read-only collection permissions for customers when they only need to view.",
    ],
  },
  n8n: {
    urls: ["https://n8n.kecktech.net"],
    about:
      "n8n runs Kecktech automations (example: Zammad webhook → Twilio SMS for on-call). Treat Active workflows as production code.",
    uiMap: [
      "Workflows list → canvas editor",
      "Credentials manager (left menu)",
      "Executions history with Success/Error filters",
      "Node parameters + INPUT/OUTPUT JSON panels",
    ],
    pitfalls: [
      "Testing with real customer SMS storms",
      "Hard-coding secrets in Function nodes instead of Credentials",
      "Leaving duplicate workflows Active after experiments",
      "Ignoring 401s after token rotation",
    ],
    tips: [
      "Use Listen for test event before activating webhook changes.",
      "Name credentials with environment suffixes (`-prod`).",
      "Document workflow purpose in the workflow Settings description field.",
    ],
  },
  website: {
    urls: ["https://www.kecktech.net"],
    about:
      "The public marketing site (Astro) covers services, demos, help entry points, and contact. Content edits usually go through Site Admin at https://admin.kecktech.net.",
    uiMap: [
      "Top navigation: services / demos / help / contact (labels follow the live site)",
      "Demos index linking to product showcases",
      "Contact form posting through the site API / mail pipeline",
      "Footer legal links including privacy",
    ],
    pitfalls: [
      "Assuming the contact form replaces a tracked Zammad ticket for outages",
      "Cached CDN/HTML hiding a just-published edit",
      "Blockers preventing form POST or analytics—not always a server outage",
    ],
    tips: [
      "Existing customers should prefer https://support.kecktech.net for support.",
      "After CMS edits, hard-refresh the public path.",
      "Demo links should match demos.json / live demo hosts.",
    ],
  },
  "site-admin": {
    urls: ["https://admin.kecktech.net"],
    about:
      "Site Admin is the staff CMS for www.kecktech.net pages (example editor path `/page/home`). Changes are staff-only and Authelia-gated.",
    uiMap: [
      "Page list / navigation to each editable route",
      "Editor fields/blocks for headlines, body, CTAs",
      "Save (draft) vs Publish/Go live controls",
      "Preview when offered by the CMS build",
    ],
    pitfalls: [
      "Saving a draft and forgetting to publish",
      "Editing production claims (pricing/SLA) without approval",
      "403s from missing admin group membership mistaken for app bugs",
    ],
    tips: [
      "Use a second reviewer for homepage and pricing-adjacent copy.",
      "Check mobile width before publish.",
      "Link Help CTAs to https://help.kecktech.net articles when possible.",
    ],
  },
  wiki: {
    urls: ["https://help.kecktech.net"],
    about:
      "The Help Center (custom wiki) hosts product documentation. Public readers browse shelves/books; staff import markdown from `content/help` via API.",
    uiMap: [
      "Search box on the home/header",
      "Shelves → Books (per app) → Chapters (getting-started, how-to, admin, troubleshoot)",
      "Article page with Goal, Prerequisites, Steps, Verify, Related",
      "Staff review/import tooling for draft vs approved pages",
    ],
    pitfalls: [
      "Searching only UI nicknames when articles use product names",
      "Editing production DB content without updating git markdown (drifts)",
      "Broken relative Related links after slug renames",
    ],
    tips: [
      "Search `app + task` (`vault unlock`, `portal invoices`).",
      "Staff: run import with `--dry-run` before tokenized POSTs.",
      "File doc-fix tickets with the article URL and screenshot.",
    ],
  },
  umami: {
    urls: ["https://umami.kecktech.net"],
    about:
      "Umami provides privacy-friendly analytics for Kecktech web properties. Empty charts usually mean the tracking script/website ID is wrong or blocked—not that the site has zero visitors.",
    uiMap: [
      "Website property switcher",
      "Date range controls",
      "Overview cards + Pages / Referrers / Devices",
      "Settings → Websites for tracking snippets",
    ],
    pitfalls: [
      "Reading the wrong property or an empty date range",
      "Ad blockers dropping collect beacons during “tests”",
      "Deploying the script with a staging website ID on production",
    ],
    tips: [
      "Verify Network calls to the Umami collect endpoint from a clean browser profile.",
      "Store website IDs in Vaultwarden notes for web projects.",
      "Use aggregates in meetings—avoid exporting personally sensitive raw data.",
    ],
  },
  "tactical-rmm": {
    urls: ["https://rmm.kecktech.net"],
    about:
      "Tactical RMM provides agent monitoring, scripting, and remote tools for MSP/HaaS devices. Installers are site-specific—never reuse another client’s agent package.",
    uiMap: [
      "Clients → Sites → Agents tree",
      "Agent detail: status, patches, scripts, take control / remote background",
      "Script library and Run Script dialog (run-as + timeout)",
      "Alerts/policies assigned at client or site level",
    ],
    pitfalls: [
      "Running destructive scripts without a change window",
      "Assuming Offline means “safe to ignore” on HaaS devices",
      "Losing local admin/RustDesk fallback when RMM is down",
    ],
    tips: [
      "Confirm Online check-in before remote actions.",
      "Log SVC-MSP / SVC-REMOTE time in the Zammad ticket.",
      "Store agent IDs with device records in Vaultwarden.",
    ],
  },
  portainer: {
    urls: ["https://portainer.kecktech.net"],
    about:
      "Portainer is the Docker/ops UI for inspecting containers, logs, and stacks on Kecktech hosts. Many environments are Tailscale-scoped.",
    uiMap: [
      "Environments home",
      "Containers / Stacks / Volumes / Networks",
      "Container Logs and Console tabs",
      "Stack editor for compose updates",
    ],
    pitfalls: [
      "Recreating stateful containers without confirming volumes",
      "Updating `:latest` tags without a rollback plan",
      "Pasting secrets from logs into public chat",
    ],
    tips: [
      "Export compose before stack updates.",
      "Smoke-test the public Traefik URL after changes.",
      "Prefer change tickets for production restarts.",
    ],
  },
  traefik: {
    urls: ["https://traefik.kecktech.net"],
    about:
      "Traefik is the edge reverse proxy/TLS terminator for `*.kecktech.net`. Routers map Host rules to container services; Authelia middleware protects staff apps.",
    uiMap: [
      "HTTP Routers / Services / Middlewares",
      "Entrypoints web / websecure",
      "Router detail: rule, service servers, middleware chain",
      "Traefik container logs for ACME and backend errors",
    ],
    pitfalls: [
      "Debugging Traefik before confirming DNS",
      "Wrong container port in service labels → 502",
      "Forgetting shared Docker network between Traefik and the app",
      "Accidentally putting Authelia on intentionally public routes",
    ],
    tips: [
      "Distinguish 404 (no router) from 502 (bad upstream) from auth redirects.",
      "After label changes, recreate the container so Traefik rediscovers it.",
      "Keep help/marketing public unless there is a deliberate lockdown.",
    ],
  },
  authelia: {
    urls: ["https://auth.kecktech.net"],
    about:
      "Authelia provides SSO and 2FA in front of protected Kecktech apps. Identities come from LLDAP groups such as `kecktech_customers`, `kecktech_ops`, and `kecktech_admins`.",
    uiMap: [
      "Login form (username/password)",
      "TOTP / 2FA challenge",
      "Authenticated portal security settings for enrollment",
      "Redirect back to the original app after success",
    ],
    pitfalls: [
      "Clock skew breaking TOTP (looks like a redirect loop)",
      "Stale cookies across auth + app hosts",
      "Expecting customer one-factor access on two-factor-only admin hosts",
    ],
    tips: [
      "Store TOTP backup codes in Vaultwarden.",
      "Portal customers generally use one-factor where policy allows; admins should expect 2FA.",
      "Access control changes require config reload and paired LLDAP group updates.",
    ],
  },
  lldap: {
    urls: ["https://lldap.kecktech.net"],
    about:
      "LLDAP is the lightweight directory behind Authelia. Creating users and assigning groups is the source of truth for who can reach portal vs ops apps.",
    uiMap: [
      "Users list + Create User",
      "Groups membership editor",
      "User detail attributes (mail, display name)",
      "Admin login distinct from normal app SSO users",
    ],
    pitfalls: [
      "Adding customers to `kecktech_admins` / `kecktech_ops`",
      "Username typos (`First.Last` vs `first.last`)",
      "Off-boarding in apps but leaving LLDAP groups intact",
    ],
    tips: [
      "Prefer the dashboard onboarding wizard when provisioning customers.",
      "Keep emails aligned with Zammad and ERPNext contacts.",
      "Store temporary passwords only in Vaultwarden collections.",
    ],
  },
  rustdesk: {
    urls: ["https://rustdesk.kecktech.net", "https://rustdesk.com/download"],
    about:
      "RustDesk is used for interactive remote support. MSP unattended access may also use Tactical RMM. Client IDs are often stored in Vaultwarden.",
    uiMap: [
      "Home screen showing your ID and Ready state",
      "Control Remote Desktop ID entry",
      "Settings → Network for custom ID/relay servers when instructed",
      "Incoming connection Accept prompt on the client side",
    ],
    pitfalls: [
      "Transposed IDs",
      "Mismatched custom server settings between tech and client",
      "Leaving permanent passwords in place against policy after a session",
    ],
    tips: [
      "Prefer one-time passwords for ad-hoc support.",
      "Put the ID in the Zammad ticket for the assigned tech.",
      "Fall back to RMM take-control on managed devices when P2P fails.",
    ],
  },
  portal: {
    urls: ["https://portal.kecktech.net"],
    about:
      "The customer portal personalizes tickets (Zammad) and invoices (ERPNext) for users in `kecktech_customers`. Empty widgets usually mean identity mismatch, not a total outage.",
    uiMap: [
      "Welcome banner with name/company",
      "Tickets / support widget",
      "Invoices / billing widget",
      "Links out to support.kecktech.net when creating richer ticket threads",
    ],
    pitfalls: [
      "User exists in LLDAP but not in `kecktech_customers`",
      "Zammad customer email differs from portal login email",
      "No ERPNext invoices yet interpreted as “billing is broken”",
    ],
    tips: [
      "Staff should run linkage checks via the onboarding wizard when possible.",
      "Customers should keep one primary email across portal, tickets, and invoices.",
      "Use Vaultwarden for credential handoff—not email threads.",
    ],
  },
  marketlist: {
    urls: ["https://marketlist.kecktech.net"],
    about:
      "Marketlist is a Kecktech demo app for shared shopping lists. Data may reset; do not store real secrets in the demo.",
    uiMap: [
      "Lists overview",
      "List detail with item rows and purchased toggles",
      "Add item field/button",
      "Optional sharing/settings entry points in the demo build",
    ],
    pitfalls: [
      "Stale demo passwords bookmarked from an old session",
      "Expecting production durability from sandbox data",
    ],
    tips: [
      "Pull credentials from the www demos page when login fails.",
      "Prefix demo items if you are evaluating with a prospect watching.",
      "Use the website contact form for production interest.",
    ],
  },
  flooros: {
    urls: ["https://flooros.kecktech.net"],
    about:
      "FloorOS demos floor-plan / space status workflows for facilities-style use cases. Rendering depends on modern browser canvas/WebGL support.",
    uiMap: [
      "Floor switcher / tabs",
      "Interactive map canvas",
      "Room/zone selection highlight",
      "Detail panel with status controls",
    ],
    pitfalls: [
      "Extensions blocking canvas/WebGL",
      "Editing on a read-only demo persona",
      "Assuming statuses persist across sandbox resets",
    ],
    tips: [
      "Start on a floor that contains seeded rooms.",
      "Use clear demo notes like `DEMO maintenance`.",
      "Capture screenshots for sales follow-up rather than relying on sandbox state.",
    ],
  },
  argo: {
    urls: ["https://argo.kecktech.net"],
    about:
      "ARGO is a Kecktech demo operations app. Use `DEMO-` prefixes on sample records so resets and reviews stay obvious.",
    uiMap: [
      "Home dashboard widgets",
      "Primary list (orders/jobs/assets depending on build)",
      "Create/New form with validation",
      "Record detail with edit/save",
    ],
    pitfalls: [
      "Idle sessions returning 401 mid-form",
      "Validation errors mistaken for outages",
      "Mixing staging expectations with the public demo host",
    ],
    tips: [
      "Keep sample data obviously fake.",
      "Screenshot the create→list path for stakeholder reviews.",
      "Report 5xx with timestamp via contact/support.",
    ],
  },
  cleaner: {
    urls: ["https://cleaner.kecktech.net"],
    about:
      "Cleaner demos scheduling and checklist completion for cleaning operations (dispatcher and/or cleaner views).",
    uiMap: [
      "Schedule or kanban job board",
      "Job detail with checklist",
      "Status control (Completed/Done)",
      "Optional photo/note attachments in the demo",
    ],
    pitfalls: [
      "Optimistic UI ticks that fail server-side validation",
      "Read-only demo role with no write permissions",
      "Board filters hiding the job you just completed",
    ],
    tips: [
      "Complete the full checklist before marking Done when evaluating QA flows.",
      "Try both board and detail views after status changes.",
      "Ask staff which persona (dispatcher vs cleaner) the demo account represents.",
    ],
  },
  netops: {
    urls: ["https://netops.kecktech.net"],
    about:
      "NetOps is an internal console for network inventory and change documentation. Treat it as operational source material during incidents.",
    uiMap: [
      "Site / device inventory lists",
      "Record detail with IPs, uplinks, contacts",
      "Notes/history for change documentation",
      "Search/filter across sites",
    ],
    pitfalls: [
      "Updating production firewalls without a ticket while “just fixing docs”",
      "Leaving decommissioned gear marked active",
      "Docs that disagree with Traefik/DNS reality",
    ],
    tips: [
      "Always reference the Zammad ticket number in NetOps notes.",
      "Reconcile names with RMM clients and Vaultwarden collections.",
      "Hygiene passes prevent incident confusion later.",
    ],
  },
  chat: {
    urls: ["https://chat.kecktech.net"],
    about:
      "Team chat for Kecktech coordination. It complements Zammad rather than replacing tickets for customer work.",
    uiMap: [
      "Channel list / browser",
      "Message composer and threads",
      "File upload control",
      "User/notification preferences",
    ],
    pitfalls: [
      "Sharing passwords or .env contents in channels",
      "Incident discussion without a ticket ID",
      "Websocket blocks on restrictive networks",
    ],
    tips: [
      "Create private channels per cutover/incident with ticket links.",
      "Rotate any accidentally pasted secret immediately.",
      "Prefer tickets for customer-visible commitments.",
    ],
  },
  "sovereign-hub": {
    urls: ["https://sovereign-hub.kecktech.net"],
    about:
      "Sovereign Hub aggregates launchers/resources for related services. Broken tiles are often downstream outages or stale catalog URLs.",
    uiMap: [
      "Hub home tile/catalog grid",
      "Project or context picker when enabled",
      "Admin catalog settings for tile URLs and visibility",
      "Deep link into target services",
    ],
    pitfalls: [
      "Staging URLs left on production tiles",
      "Tiles visible to groups that lack Authelia access to the target",
      "SSO loops when hub and target both challenge awkwardly",
    ],
    tips: [
      "Verify tiles with a non-admin user in the target group.",
      "Remove retired services instead of leaving 404 tiles.",
      "Keep titles aligned with Help Center app names when possible.",
    ],
  },
  farmbot: {
    urls: ["https://farmbot.kecktech.net"],
    about:
      "FarmBot demo showcases farm device automation UX. Assume simulation unless staff confirm hardware is live—do not run untested motor sequences on a real bot.",
    uiMap: [
      "Farm map / device overview",
      "Sequences list and editor",
      "Run/Execute controls",
      "Logs/ticker for step progress",
    ],
    pitfalls: [
      "Running move sequences on live hardware without training",
      "Interpreting a locked simulator as a UI bug",
      "Websocket drops looking like “buttons do nothing”",
    ],
    tips: [
      "Prefer staff-designated safe sample sequences.",
      "Watch logs while evaluating—not only the map animation.",
      "Contact sales via the website for hardware deployments.",
    ],
  },
  dashboard: {
    urls: ["https://dash.kecktech.net", "https://dashboard.kecktech.net"],
    about:
      "The Apps Dashboard is the staff launcher for Kecktech systems after Authelia. Ops tooling such as the onboarding wizard may live under `/ops/...` on this host.",
    uiMap: [
      "Tile grid of applications",
      "Optional ops section / onboarding wizard entry",
      "User session identity via Authelia",
      "Admin configuration for tile URLs and group visibility",
    ],
    pitfalls: [
      "Bookmarks to raw hosts drifting from canonical tiles",
      "Customers seeing infra tiles due to wrong group visibility",
      "403 on a tile misread as dashboard outage",
    ],
    tips: [
      "Use the dashboard daily so SSO and links stay consistent.",
      "Canonical hosts: erp, tickets/support, vault, admin, rmm, portal, help.",
      "Report wrong tile URLs with expected vs actual hostname.",
    ],
  },
};
