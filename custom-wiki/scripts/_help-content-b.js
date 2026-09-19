/**
 * Help articles: tactical-rmm, portainer, traefik, authelia, lldap, rustdesk, portal, marketlist
 */
module.exports = function register({ writeArticle, article }) {
  // ── Tactical RMM ─────────────────────────────────────────────────────────
  {
    const app = "tactical-rmm";
    const name = "Tactical RMM";
    const url = "https://rmm.kecktech.net";

    writeArticle(
      app,
      "getting-started",
      "open-rmm",
      "Open Tactical RMM and find an agent",
      article({
        appName: name,
        audience: "admin",
        title: "Open Tactical RMM and find an agent",
        goal: "Sign in to RMM and locate a managed agent under the correct client/site.",
        prereqs: [
          "Tech account with RMM access",
          `URL: ${url}`,
          "Client name and approximate hostname",
        ],
        steps: [
          `Open ${url} and complete Authelia if prompted.`,
          "Sign into Tactical RMM with your tech credentials.",
          "In the left tree, expand **Clients → {Client} → Sites**.",
          "Open **Agents** and sort/filter by hostname or last seen.",
          "Click the agent to open the detail view (status, OS, patches, scripts).",
          "Confirm the agent shows Online before attempting remote actions.",
        ],
        verify: "Agent detail page loads and shows a recent check-in timestamp.",
        related: [
          { label: "Run a remote script", href: "../how-to/run-script.md" },
          { label: "Deploy an agent", href: "../admin/deploy-agent.md" },
          { label: "Agent offline", href: "../troubleshoot/agent-offline.md" },
        ],
      })
    );

    writeArticle(
      app,
      "how-to",
      "run-script",
      "Run a script on a managed agent",
      article({
        appName: name,
        audience: "admin",
        title: "Run a script on a managed agent",
        goal: "Execute an approved script or remote command on a single agent and capture output.",
        prereqs: [
          "Online agent",
          "Permission to run scripts",
          "Change window / customer approval when required",
        ],
        steps: [
          "Open the target agent in Tactical RMM.",
          "Choose **Run Script** (or the Scripts action in the agent toolbar).",
          "Select a saved script from the library, or paste an approved one-off when policy allows.",
          "Set run-as context (System vs logged-in user) and timeout.",
          "Confirm the host name in the dialog before executing.",
          "Watch the script results panel for stdout/stderr and exit code.",
          "Paste a short summary into the related Zammad ticket and log time (SVC-MSP / SVC-REMOTE).",
        ],
        verify: "Script result shows success exit code (or an understood non-zero with remediation next steps).",
        related: [
          { label: "Open RMM and find an agent", href: "../getting-started/open-rmm.md" },
          { label: "Deploy an agent", href: "../admin/deploy-agent.md" },
          { label: "Agent offline", href: "../troubleshoot/agent-offline.md" },
        ],
      })
    );

    writeArticle(
      app,
      "troubleshoot",
      "agent-offline",
      "Tactical RMM agent offline",
      article({
        appName: name,
        audience: "admin",
        title: "Tactical RMM agent offline",
        goal: "Diagnose why an agent stopped checking in and restore monitoring.",
        prereqs: [
          "Client contact path for on-site power/network checks",
          "Vaultwarden item for device admin / RustDesk ID if unattended access fails",
        ],
        steps: [
          "Confirm last check-in time on the agent page and whether other agents at that site are online.",
          "If the whole site is offline, suspect ISP/firewall; contact the client for WAN status.",
          "If only one device: ask whether it is powered on, sleeping, or off-domain VPN.",
          "Attempt RustDesk or take-control recovery if credentials exist.",
          "On the device, verify the Tactical RMM service is running and can reach the RMM URL.",
          "Reinstall the agent only after confirming you have the correct client/site installer from RMM.",
          "After recovery, confirm check-in and review missed patches/alerts.",
        ],
        verify: "Agent status returns to Online with a fresh check-in within a few minutes.",
        related: [
          { label: "Open RMM and find an agent", href: "../getting-started/open-rmm.md" },
          { label: "Run a remote script", href: "../how-to/run-script.md" },
          { label: "Deploy an agent", href: "../admin/deploy-agent.md" },
        ],
      })
    );

    writeArticle(
      app,
      "admin",
      "deploy-agent",
      "Deploy a Tactical RMM agent",
      article({
        appName: name,
        audience: "admin",
        title: "Deploy a Tactical RMM agent",
        goal: "Install an agent under the correct client/site for monitoring and remote management.",
        prereqs: [
          "Admin rights in RMM",
          "Local admin on the target Windows/Linux/Mac device",
          "Client and Site already created in RMM",
        ],
        steps: [
          `Sign in at ${url}.`,
          "Navigate to the Client → Site where the device belongs.",
          "Use **Add Agent** / download the installer for that site (do not reuse another client’s installer).",
          "Run the installer on the device with elevation.",
          "Wait for the agent to appear Online in the Agents list.",
          "Assign monitoring policies / automation as required for HaaS or MSP baselines.",
          "Store hostname, agent ID, and local admin reference in the client’s Vaultwarden collection.",
          "Document deployment in the HaaS or onboarding ticket.",
        ],
        verify: "New agent is Online under the intended Client/Site and accepts a test script or inventory refresh.",
        related: [
          { label: "Open RMM and find an agent", href: "../getting-started/open-rmm.md" },
          { label: "Run a remote script", href: "../how-to/run-script.md" },
          { label: "Agent offline", href: "../troubleshoot/agent-offline.md" },
        ],
      })
    );
  }

  // ── Portainer ────────────────────────────────────────────────────────────
  {
    const app = "portainer";
    const name = "Portainer";
    const url = "https://portainer.kecktech.net";

    writeArticle(
      app,
      "getting-started",
      "access-portainer",
      "Access Portainer environments",
      article({
        appName: name,
        audience: "admin",
        title: "Access Portainer environments",
        goal: "Sign in to Portainer and open the Docker environment that hosts Kecktech stacks.",
        prereqs: [
          "Ops admin membership",
          `URL: ${url}`,
          "Tailscale if the instance is not public",
        ],
        steps: [
          `Open ${url} and authenticate (Authelia and/or Portainer local admin as configured).`,
          "From **Home / Environments**, select the target endpoint (Docker host or Swarm).",
          "Open **Containers** to see running services.",
          "Use stacks view if deployments are managed as compose stacks.",
          "Do not restart production containers without a change window unless mitigating an outage.",
        ],
        verify: "Container list loads for the selected environment with health/status columns visible.",
        related: [
          { label: "Inspect logs for a container", href: "../how-to/view-logs.md" },
          { label: "Safe stack update checklist", href: "../admin/stack-update.md" },
          { label: "Portainer login or endpoint down", href: "../troubleshoot/endpoint-unreachable.md" },
        ],
      })
    );

    writeArticle(
      app,
      "how-to",
      "view-logs",
      "Inspect logs for a container",
      article({
        appName: name,
        audience: "admin",
        title: "Inspect logs for a container",
        goal: "Pull recent container logs to diagnose an application error.",
        prereqs: ["Access to the environment", "Container/service name"],
        steps: [
          "Open the environment → **Containers**.",
          "Select the container (example: wiki, n8n, traefik).",
          "Open the **Logs** tab. Enable auto-refresh if you are reproducing live.",
          "Increase line count or download logs for ticket attachments.",
          "Correlate timestamps with Traefik access errors or user-reported times.",
          "Avoid pasting secrets from logs into public channels; redact tokens.",
        ],
        verify: "You captured log lines that include the error signature needed for root-cause analysis.",
        related: [
          { label: "Access Portainer environments", href: "../getting-started/access-portainer.md" },
          { label: "Safe stack update checklist", href: "../admin/stack-update.md" },
          { label: "Portainer login or endpoint down", href: "../troubleshoot/endpoint-unreachable.md" },
        ],
      })
    );

    writeArticle(
      app,
      "troubleshoot",
      "endpoint-unreachable",
      "Portainer login or endpoint unreachable",
      article({
        appName: name,
        audience: "admin",
        title: "Portainer login or endpoint unreachable",
        goal: "Restore access when Portainer UI or a Docker endpoint will not connect.",
        prereqs: [
          "Console/SSH access to the Docker host if UI is down",
          "Vaultwarden credentials for host access",
        ],
        steps: [
          "Confirm Tailscale connectivity and DNS for `portainer.kecktech.net`.",
          "If Authelia fails, fix auth first at https://auth.kecktech.net.",
          "If Portainer loads but an environment is gray/down, check the Portainer agent and Docker daemon on that host.",
          "On the host: `docker ps` (or equivalent) to see whether containers still run despite UI issues.",
          "Review Traefik router for Portainer if you get 404/502 at the edge.",
          "Escalate as P1 if multiple customer-facing stacks are impacted.",
        ],
        verify: "Portainer lists the environment as Up and container views refresh.",
        related: [
          { label: "Access Portainer environments", href: "../getting-started/access-portainer.md" },
          { label: "Inspect logs for a container", href: "../how-to/view-logs.md" },
          { label: "Safe stack update checklist", href: "../admin/stack-update.md" },
        ],
      })
    );

    writeArticle(
      app,
      "admin",
      "stack-update",
      "Safe stack update checklist",
      article({
        appName: name,
        audience: "admin",
        title: "Safe stack update checklist",
        goal: "Update a compose stack in Portainer with rollback awareness.",
        prereqs: [
          "Maint window or approved change",
          "Backup/snapshot policy understood for stateful services",
          "Image tags pinned (avoid surprise `:latest` where possible)",
        ],
        steps: [
          "Identify the stack and export/copy the current compose for rollback.",
          "Confirm volumes and networks will persist across recreate.",
          "Pull new images, then update the stack with Portainer **Update the stack**.",
          "Watch container health and logs for 2–5 minutes.",
          "Hit the public URL through Traefik (auth apps via Authelia) for a smoke test.",
          "If unhealthy, roll back to the previous compose/image tag immediately.",
          "Record version and outcome in the change ticket.",
        ],
        verify: "Stack services are healthy and the smoke-test URL behaves correctly.",
        related: [
          { label: "Access Portainer environments", href: "../getting-started/access-portainer.md" },
          { label: "Inspect logs for a container", href: "../how-to/view-logs.md" },
          { label: "Portainer login or endpoint down", href: "../troubleshoot/endpoint-unreachable.md" },
        ],
      })
    );
  }

  // ── Traefik ──────────────────────────────────────────────────────────────
  {
    const app = "traefik";
    const name = "Traefik";
    const url = "https://traefik.kecktech.net";

    writeArticle(
      app,
      "getting-started",
      "read-dashboard",
      "Read the Traefik dashboard",
      article({
        appName: name,
        audience: "admin",
        title: "Read the Traefik dashboard",
        goal: "Open Traefik’s dashboard/API view to inspect routers, services, and middlewares.",
        prereqs: [
          "Ops access (often Tailscale-only)",
          `Dashboard URL if enabled: ${url}`,
          "Familiarity with entrypoints `web` / `websecure`",
        ],
        steps: [
          "Connect to the admin network/Tailscale if required.",
          `Open ${url} (or the internal dashboard port documented for the host).`,
          "Authenticate if the dashboard is SSO-protected.",
          "Open **HTTP → Routers** and search for a hostname (example: `erp.kecktech.net`).",
          "Click the router to see entrypoints, rule (`Host(...)`), service, and middlewares (Authelia, headers, compress).",
          "Cross-check **Services** and **Middlewares** tabs when diagnosing 404 vs 502.",
        ],
        verify: "You can locate the router for a known hostname and see it marked enabled/success.",
        related: [
          { label: "Trace a 502 to a service", href: "../how-to/trace-502.md" },
          { label: "Add or update a router label", href: "../admin/router-labels.md" },
          { label: "Router missing / TLS errors", href: "../troubleshoot/router-missing.md" },
        ],
      })
    );

    writeArticle(
      app,
      "how-to",
      "trace-502",
      "Trace a 502 Bad Gateway",
      article({
        appName: name,
        audience: "admin",
        title: "Trace a 502 Bad Gateway",
        goal: "Determine whether a 502 is caused by Traefik routing or a down upstream container.",
        prereqs: ["Failing public URL", "Portainer access to the upstream stack"],
        steps: [
          "Note exact hostname and path returning 502.",
          "In Traefik, find the router → service → server URL (container name/port).",
          "In Portainer, confirm the upstream container is running and healthy on that port.",
          "Compare container logs at the failure timestamp.",
          "If the service is up but Traefik still 502s, check network membership (Traefik must share Docker network with the container).",
          "Retry the URL; if Authelia middleware is attached, confirm auth.kecktech.net is healthy too.",
          "Record root cause (crash loop, wrong port label, network) in the incident ticket.",
        ],
        verify: "Public URL returns application HTML/JSON instead of Traefik 502.",
        related: [
          { label: "Read the Traefik dashboard", href: "../getting-started/read-dashboard.md" },
          { label: "Add or update a router label", href: "../admin/router-labels.md" },
          { label: "Router missing / TLS errors", href: "../troubleshoot/router-missing.md" },
        ],
      })
    );

    writeArticle(
      app,
      "troubleshoot",
      "router-missing",
      "Router missing or TLS errors",
      article({
        appName: name,
        audience: "admin",
        title: "Router missing or TLS errors",
        goal: "Restore a hostname that does not appear in Traefik or fails certificate issuance.",
        prereqs: [
          "Compose/labels for the service",
          "DNS A/AAAA or CNAME for `*.kecktech.net` pointing at the edge",
        ],
        steps: [
          "nslookup/dig the hostname; fix DNS before debugging Traefik.",
          "Confirm container labels include `traefik.enable=true`, correct `Host()` rule, and entrypoint `websecure`.",
          "Restart/recreate the container so Traefik re-discovers labels.",
          "For TLS failures, check ACME resolver logs in the Traefik container and rate limits.",
          "Ensure the router is not filtered by a wrong middleware chain that rejects before TLS completes.",
          "Validate with `curl -vI https://hostname` from Tailscale and from an external vantage point.",
        ],
        verify: "Router appears in the dashboard and HTTPS returns a valid certificate for the hostname.",
        related: [
          { label: "Read the Traefik dashboard", href: "../getting-started/read-dashboard.md" },
          { label: "Trace a 502 to a service", href: "../how-to/trace-502.md" },
          { label: "Add or update a router label", href: "../admin/router-labels.md" },
        ],
      })
    );

    writeArticle(
      app,
      "admin",
      "router-labels",
      "Add or update a Traefik router label",
      article({
        appName: name,
        audience: "admin",
        title: "Add or update a Traefik router label",
        goal: "Expose a container on a kecktech.net hostname with Authelia middleware when required.",
        prereqs: [
          "Compose edit rights via Portainer/git",
          "Chosen subdomain and whether SSO is required",
        ],
        steps: [
          "Decide hostname (example: `newapp.kecktech.net`) and create DNS.",
          "Add Traefik labels: enable, router rule `Host(...)`, entrypoints, TLS certresolver, service port.",
          "Attach Authelia forward-auth middleware for staff apps; omit for intentionally public apps (marketing, help).",
          "Deploy the stack update during a change window.",
          "Confirm router appears in Traefik and smoke-test through the browser.",
          "Document the new route in ops inventory / this Help Center.",
        ],
        verify: "HTTPS to the hostname reaches the app and auth behavior matches the design (SSO vs public).",
        related: [
          { label: "Read the Traefik dashboard", href: "../getting-started/read-dashboard.md" },
          { label: "Trace a 502 to a service", href: "../how-to/trace-502.md" },
          { label: "Router missing / TLS errors", href: "../troubleshoot/router-missing.md" },
        ],
      })
    );
  }

  // ── Authelia ─────────────────────────────────────────────────────────────
  {
    const app = "authelia";
    const name = "Authelia";
    const url = "https://auth.kecktech.net";

    writeArticle(
      app,
      "getting-started",
      "first-login",
      "Complete your first Authelia SSO login",
      article({
        appName: name,
        audience: "end-user",
        title: "Complete your first Authelia SSO login",
        goal: "Authenticate once so protected Kecktech apps open for your session.",
        prereqs: [
          "Account exists in LLDAP",
          `Authelia portal: ${url}`,
          "App URL such as https://dash.kecktech.net or https://portal.kecktech.net",
        ],
        steps: [
          "Open a protected app (example: https://dash.kecktech.net).",
          "You are redirected to Authelia.",
          "Enter your username and password (LLDAP credentials).",
          "If prompted to register 2FA, enroll an authenticator app (TOTP) and store backup codes in Vaultwarden.",
          "Complete the 2FA challenge when one-factor is insufficient for that resource policy.",
          "Authelia redirects you back to the original application.",
        ],
        verify: "Refreshing the app no longer forces a full login for the SSO session lifetime.",
        related: [
          { label: "Enroll or reset 2FA", href: "../how-to/enroll-2fa.md" },
          { label: "Adjust access control rules", href: "../admin/access-control.md" },
          { label: "Stuck in login redirect loop", href: "../troubleshoot/redirect-loop.md" },
        ],
      })
    );

    writeArticle(
      app,
      "how-to",
      "enroll-2fa",
      "Enroll or reset Authelia 2FA",
      article({
        appName: name,
        audience: "end-user",
        title: "Enroll or reset Authelia 2FA",
        goal: "Register TOTP (or complete a staff-assisted reset) so two-factor apps accept your login.",
        prereqs: [
          "Working password login",
          "Authenticator app on your phone",
          "Staff help if you lost all second factors",
        ],
        steps: [
          `Open ${url} and sign in with username/password.`,
          "Open the security / 2FA settings from the Authelia authenticated portal (or follow the enrollment prompt).",
          "Scan the TOTP QR code with your authenticator app.",
          "Enter the 6-digit code to confirm enrollment.",
          "Save recovery/backup codes in your Vaultwarden vault—not in plain email.",
          "If locked out: contact Kecktech support; staff reset 2FA in Authelia/LLDAP process, then you re-enroll.",
        ],
        verify: "A fresh login to a two-factor resource accepts password + TOTP and lands in the app.",
        related: [
          { label: "First Authelia SSO login", href: "../getting-started/first-login.md" },
          { label: "Adjust access control rules", href: "../admin/access-control.md" },
          { label: "Stuck in login redirect loop", href: "../troubleshoot/redirect-loop.md" },
        ],
      })
    );

    writeArticle(
      app,
      "troubleshoot",
      "redirect-loop",
      "Stuck in Authelia redirect loop",
      article({
        appName: name,
        audience: "end-user",
        title: "Stuck in Authelia redirect loop",
        goal: "Break SSO redirect loops between an app and auth.kecktech.net.",
        prereqs: ["Affected app URL", "Ability to clear site cookies"],
        steps: [
          "Stop rapid refreshes; open a private window.",
          "Sign out explicitly at https://auth.kecktech.net if a session exists.",
          "Clear cookies for `auth.kecktech.net` and the target app hostname.",
          "Confirm device clock is correct (TOTP fails when skewed and may look like a loop).",
          "Retry the app URL once. Complete password + 2FA deliberately.",
          "If only one app loops, report possible misconfigured forward-auth middleware for that router.",
          "If all apps fail, treat as auth outage and open a high-priority ticket.",
        ],
        verify: "You reach the app UI once and subsequent navigations stay authenticated.",
        related: [
          { label: "First Authelia SSO login", href: "../getting-started/first-login.md" },
          { label: "Enroll or reset 2FA", href: "../how-to/enroll-2fa.md" },
          { label: "Adjust access control rules", href: "../admin/access-control.md" },
        ],
      })
    );

    writeArticle(
      app,
      "admin",
      "access-control",
      "Adjust Authelia access control rules",
      article({
        appName: name,
        audience: "admin",
        title: "Adjust Authelia access control rules",
        goal: "Change which groups may access a protected domain and whether one- or two-factor is required.",
        prereqs: [
          "Access to Authelia configuration (file/config volume) and ability to reload",
          "LLDAP groups such as `kecktech_admins`, `kecktech_ops`, `kecktech_customers`",
          "Change ticket for audit",
        ],
        steps: [
          "Identify the domain (example: `admin.kecktech.net`) and current policy (bypass / one_factor / two_factor).",
          "Edit access control rules so subject groups match intent (customers → portal; admins → infra).",
          "Keep help.kecktech.net / public marketing bypass rules intact unless intentionally locking them down.",
          "Validate YAML/config, deploy, and restart/reload Authelia carefully.",
          "Test with a user in-group and a user out-of-group (expect 403 or denied).",
          "Document the rule change and rollback snippet in the ticket.",
        ],
        verify: "In-group user reaches the app with the expected factor count; out-of-group user is denied.",
        related: [
          { label: "First Authelia SSO login", href: "../getting-started/first-login.md" },
          { label: "Enroll or reset 2FA", href: "../how-to/enroll-2fa.md" },
          { label: "Stuck in login redirect loop", href: "../troubleshoot/redirect-loop.md" },
        ],
      })
    );
  }

  // ── LLDAP ────────────────────────────────────────────────────────────────
  {
    const app = "lldap";
    const name = "LLDAP";
    const url = "https://lldap.kecktech.net";

    writeArticle(
      app,
      "getting-started",
      "admin-console",
      "Open the LLDAP admin console",
      article({
        appName: name,
        audience: "admin",
        title: "Open the LLDAP admin console",
        goal: "Reach the LLDAP UI used to manage users and groups for Authelia SSO.",
        prereqs: [
          "keckadmin or delegated admin account",
          `URL: ${url} (Tailscale often required)`,
        ],
        steps: [
          "Connect to Tailscale if the directory is not exposed publicly.",
          `Open ${url} and sign in as directory admin.`,
          "Open **Users** to browse accounts; open **Groups** to browse `kecktech_customers`, `kecktech_ops`, `kecktech_admins`.",
          "Confirm you can view a known test user without making changes yet.",
        ],
        verify: "Users and Groups lists load and show existing directory objects.",
        related: [
          { label: "Create a user and assign groups", href: "../how-to/create-user.md" },
          { label: "Group naming and off-boarding", href: "../admin/group-policy.md" },
          { label: "User cannot sign in via Authelia", href: "../troubleshoot/user-auth-fail.md" },
        ],
      })
    );

    writeArticle(
      app,
      "how-to",
      "create-user",
      "Create a user and assign groups",
      article({
        appName: name,
        audience: "admin",
        title: "Create a user and assign groups",
        goal: "Provision an LLDAP user with the correct group so Authelia and apps authorize them.",
        prereqs: [
          "Directory admin access",
          "Legal name, username pattern `firstname.lastname`, and email",
          "Target group (customers vs ops vs admins)",
        ],
        steps: [
          "Go to **Users → Create User**.",
          "Set username (lowercase), email, display name, and a strong temporary password.",
          "Save the user, then open the user detail page.",
          "Add to group: `kecktech_customers` for portal users; never add customers to `kecktech_admins` or `kecktech_ops`.",
          "Store credentials in the appropriate Vaultwarden collection.",
          "Optionally create matching Zammad customer and verify ERPNext customer linkage via the onboarding wizard at https://dashboard.kecktech.net/ops/onboarding.",
          "Have the user complete Authelia first login + 2FA as required.",
        ],
        verify: "User appears in the group membership list and can authenticate at https://auth.kecktech.net.",
        related: [
          { label: "Open the LLDAP admin console", href: "../getting-started/admin-console.md" },
          { label: "Group naming and off-boarding", href: "../admin/group-policy.md" },
          { label: "User cannot sign in via Authelia", href: "../troubleshoot/user-auth-fail.md" },
        ],
      })
    );

    writeArticle(
      app,
      "troubleshoot",
      "user-auth-fail",
      "User cannot sign in via Authelia",
      article({
        appName: name,
        audience: "admin",
        title: "User cannot sign in via Authelia",
        goal: "Fix directory issues that prevent Authelia from accepting a user login.",
        prereqs: ["Username/email claimed by the user", "LLDAP admin access"],
        steps: [
          "In LLDAP, search the user; confirm the account exists and is not mistyped.",
          "Verify group membership matches the Authelia access control rule for the target app.",
          "Reset the password if lockout/forgotten password is likely; communicate via a secure channel.",
          "Confirm email attribute is populated—some apps key off mail.",
          "If password works in LLDAP bind tests but Authelia fails, check Authelia LDAP backend logs.",
          "For 2FA-only failures, follow Authelia 2FA reset rather than deleting the user.",
        ],
        verify: "User completes Authelia login and reaches the intended application.",
        related: [
          { label: "Open the LLDAP admin console", href: "../getting-started/admin-console.md" },
          { label: "Create a user and assign groups", href: "../how-to/create-user.md" },
          { label: "Group naming and off-boarding", href: "../admin/group-policy.md" },
        ],
      })
    );

    writeArticle(
      app,
      "admin",
      "group-policy",
      "Group naming and off-boarding",
      article({
        appName: name,
        audience: "admin",
        title: "Group naming and off-boarding",
        goal: "Keep LLDAP groups consistent and revoke access cleanly when people leave.",
        prereqs: ["Directory admin", "Off-boarding ticket with last day"],
        steps: [
          "Use standard groups only: `kecktech_customers`, `kecktech_ops`, `kecktech_admins` (plus any documented specialty groups).",
          "Do not create ad-hoc groups without updating Authelia access control.",
          "On off-boarding: remove group memberships, disable or delete the user per policy.",
          "Revoke Vaultwarden collection access and set Zammad user inactive.",
          "Confirm Authelia denies login within a minute of directory change (or after session expiry).",
          "Check the onboarding wizard / inventory so ERP/portal linkages are noted historically.",
        ],
        verify: "Former user’s password no longer opens protected apps; shared vault items are not customer-accessible.",
        related: [
          { label: "Open the LLDAP admin console", href: "../getting-started/admin-console.md" },
          { label: "Create a user and assign groups", href: "../how-to/create-user.md" },
          { label: "User cannot sign in via Authelia", href: "../troubleshoot/user-auth-fail.md" },
        ],
      })
    );
  }

  // ── RustDesk ─────────────────────────────────────────────────────────────
  {
    const app = "rustdesk";
    const name = "RustDesk";
    const url = "https://rustdesk.kecktech.net";

    writeArticle(
      app,
      "getting-started",
      "install-client",
      "Install the RustDesk client",
      article({
        appName: name,
        audience: "end-user",
        title: "Install the RustDesk client",
        goal: "Install RustDesk and prepare your ID for Kecktech remote support sessions.",
        prereqs: [
          "Permission to install software on the device",
          "Download from https://rustdesk.com/download (or installer provided by Kecktech)",
          "Optional self-hosted signal/relay: configure only if staff instructs",
        ],
        steps: [
          "Download the RustDesk client for your OS.",
          "Install and launch RustDesk. Note your **ID** on the home screen.",
          "Set a one-time or permanent password per staff guidance (prefer one-time for ad-hoc support).",
          "If Kecktech provides a custom server/key, open **Settings → Network** and enter the ID/relay server details from your ticket.",
          "Send your RustDesk ID to the technician through the support ticket (not via public social media).",
          "Stay at the PC to approve the incoming connection prompt.",
        ],
        verify: "RustDesk shows your ID and Ready status; you can accept a test connection from Kecktech.",
        related: [
          { label: "Connect to a remote ID", href: "../how-to/connect-remote.md" },
          { label: "Connection fails or is rejected", href: "../troubleshoot/cannot-connect.md" },
          { label: "Open a support ticket", href: "../../zammad/getting-started/open-a-ticket.md" },
        ],
      })
    );

    writeArticle(
      app,
      "how-to",
      "connect-remote",
      "Connect to a remote RustDesk ID",
      article({
        appName: name,
        audience: "admin",
        title: "Connect to a remote RustDesk ID",
        goal: "Start a support session to a client device using its RustDesk ID.",
        prereqs: [
          "RustDesk installed on your workstation",
          "Client ID (from Vaultwarden or the live session)",
          "Client available to share OTP / approve connection",
        ],
        steps: [
          "Open RustDesk on your tech workstation.",
          "Retrieve the client ID from the ticket or Vaultwarden item `RustDesk ID — {Client}`.",
          "Enter the ID in **Control Remote Desktop** and click connect.",
          "Enter the password/OTP the client provides, or use the stored permanent password only when policy allows unattended access.",
          "Wait for the interactive accept if the client side requires it.",
          "Perform support work; narrate invasive steps.",
          "Disconnect, then log time in Zammad (SVC-REMOTE).",
        ],
        verify: "You see the remote desktop and input control works for the session duration.",
        related: [
          { label: "Install the RustDesk client", href: "../getting-started/install-client.md" },
          { label: "Connection fails or is rejected", href: "../troubleshoot/cannot-connect.md" },
          { label: "Remote support procedures context", href: "../../tactical-rmm/getting-started/open-rmm.md" },
        ],
      })
    );

    writeArticle(
      app,
      "troubleshoot",
      "cannot-connect",
      "RustDesk connection fails",
      article({
        appName: name,
        audience: "end-user",
        title: "RustDesk connection fails",
        goal: "Fix common ID, password, network, and custom-server issues that block remote sessions.",
        prereqs: ["Both parties online", "Correct RustDesk ID"],
        steps: [
          "Confirm both sides run compatible RustDesk versions and show Ready/Online.",
          "Re-read the ID carefully; IDs are easy to transpose.",
          "If using a custom Kecktech server, verify Network settings match staff instructions on both sides.",
          "Disable VPN conflicts temporarily; some VPNs block P2P/relay.",
          "Ensure the client clicks Accept on the connection prompt.",
          "Try a new one-time password if authentication fails.",
          "Fallback: schedule Tactical RMM take-control for MSP-managed devices.",
        ],
        verify: "A new connection attempt reaches the Accept prompt and establishes desktop video.",
        related: [
          { label: "Install the RustDesk client", href: "../getting-started/install-client.md" },
          { label: "Connect to a remote ID", href: "../how-to/connect-remote.md" },
          { label: "Open a support ticket", href: "../../zammad/getting-started/open-a-ticket.md" },
        ],
      })
    );
  }

  // ── Portal ───────────────────────────────────────────────────────────────
  {
    const app = "portal";
    const name = "Customer Portal";
    const url = "https://portal.kecktech.net";

    writeArticle(
      app,
      "getting-started",
      "sign-in",
      "Sign in to the customer portal",
      article({
        appName: name,
        audience: "end-user",
        title: "Sign in to the customer portal",
        goal: "Authenticate and reach your personalized portal home with tickets and invoices.",
        prereqs: [
          "LLDAP user in `kecktech_customers`",
          `URL: ${url}`,
          "Authelia credentials (password + 2FA if required by policy)",
        ],
        steps: [
          `Open ${url}.`,
          "Complete Authelia login when redirected.",
          "Land on the portal home. Confirm the welcome banner shows your name/company.",
          "Locate widgets for support tickets (Zammad) and invoices (ERPNext) as provisioned.",
          "If this is your first login, change any temporary password via the process staff provided and store it in Vaultwarden.",
        ],
        verify: "Portal home loads for your account without 403, and your name appears in the header/welcome area.",
        related: [
          { label: "View tickets and invoices", href: "../how-to/view-tickets-invoices.md" },
          { label: "Portal admin linkage checks", href: "../admin/link-accounts.md" },
          { label: "Portal empty or forbidden", href: "../troubleshoot/empty-or-403.md" },
        ],
      })
    );

    writeArticle(
      app,
      "how-to",
      "view-tickets-invoices",
      "View tickets and invoices in the portal",
      article({
        appName: name,
        audience: "end-user",
        title: "View tickets and invoices in the portal",
        goal: "Open your support tickets and billing documents from the customer portal.",
        prereqs: ["Signed-in portal session", "Tickets/invoices exist for your organization"],
        steps: [
          "From portal home, open the Support / Tickets section.",
          "Select a ticket to view status and conversation. Use **New** if you need to create one (or go to https://support.kecktech.net).",
          "Open Invoices / Billing to list ERPNext-linked invoices.",
          "Download PDF statements when offered.",
          "For payment questions, reply on the invoice-related ticket or contact billing as instructed on the document.",
        ],
        verify: "At least one ticket or invoice record opens with details matching emails you received.",
        related: [
          { label: "Sign in to the customer portal", href: "../getting-started/sign-in.md" },
          { label: "Portal admin linkage checks", href: "../admin/link-accounts.md" },
          { label: "Portal empty or forbidden", href: "../troubleshoot/empty-or-403.md" },
        ],
      })
    );

    writeArticle(
      app,
      "troubleshoot",
      "empty-or-403",
      "Portal empty or forbidden",
      article({
        appName: name,
        audience: "end-user",
        title: "Portal empty or forbidden",
        goal: "Resolve blank widgets or 403 errors after portal sign-in.",
        prereqs: ["Your login email", "Company name on file with Kecktech"],
        steps: [
          "If you see 403 after Authelia, you may lack `kecktech_customers`—contact support to fix group membership.",
          "If home loads but tickets are empty, confirm you have tickets under the same email in Zammad.",
          "If invoices are empty, finance may not have issued ERPNext invoices yet—or the customer record email does not match.",
          "Retry in a private window after signing out of Authelia fully.",
          "Provide screenshots and your username in a support ticket for staff linkage repair.",
        ],
        verify: "Portal shows your identity and the data widgets you are entitled to see.",
        related: [
          { label: "Sign in to the customer portal", href: "../getting-started/sign-in.md" },
          { label: "View tickets and invoices", href: "../how-to/view-tickets-invoices.md" },
          { label: "Portal admin linkage checks", href: "../admin/link-accounts.md" },
        ],
      })
    );

    writeArticle(
      app,
      "admin",
      "link-accounts",
      "Link portal user to Zammad and ERPNext",
      article({
        appName: name,
        audience: "admin",
        title: "Link portal user to Zammad and ERPNext",
        goal: "Ensure a customer’s LLDAP identity maps to Zammad org tickets and ERPNext invoices in the portal.",
        prereqs: [
          "LLDAP user already in `kecktech_customers`",
          "Access to Zammad admin and ERPNext",
          "Optional: https://dashboard.kecktech.net/ops/onboarding wizard",
        ],
        steps: [
          "Prefer the Onboarding Wizard on the apps dashboard to run Steps 1–4 automatically when available.",
          "In Zammad, ensure a Customer user exists with the same email and correct Organization.",
          "In ERPNext (https://erp.kecktech.net / https://ops.kecktech.net), confirm Customer + invoices exist for the company.",
          "Align contact email addresses across systems.",
          "Have the customer sign in at https://portal.kecktech.net and verify tickets/invoices populate.",
          "Store portal credentials in the client Vaultwarden collection.",
        ],
        verify: "Customer portal session shows welcome identity plus at least one linked ticket or invoice when data exists.",
        related: [
          { label: "Sign in to the customer portal", href: "../getting-started/sign-in.md" },
          { label: "View tickets and invoices", href: "../how-to/view-tickets-invoices.md" },
          { label: "Portal empty or forbidden", href: "../troubleshoot/empty-or-403.md" },
        ],
      })
    );
  }

  // ── Marketlist ───────────────────────────────────────────────────────────
  {
    const app = "marketlist";
    const name = "Marketlist";
    const url = "https://marketlist.kecktech.net";

    writeArticle(
      app,
      "getting-started",
      "open-demo",
      "Open the Marketlist demo",
      article({
        appName: name,
        audience: "end-user",
        title: "Open the Marketlist demo",
        goal: "Launch the Marketlist demo app and understand its shopping-list workflow.",
        prereqs: [
          `Demo URL: ${url} (also linked from https://www.kecktech.net demos)`,
          "Demo credentials if the instance is gated—use values from the demos page or staff",
        ],
        steps: [
          "Open the demos page on https://www.kecktech.net or go directly to the Marketlist URL.",
          "Sign in with demo credentials if prompted.",
          "Land on the list overview. Note sample lists used for the showcase.",
          "Open a list to see items, quantities, and checked-off state.",
          "Orient to navigation: lists, items, and sharing/settings if exposed in the demo build.",
        ],
        verify: "You can open at least one list and see item rows without an application error.",
        related: [
          { label: "Add items to a list", href: "../how-to/add-items.md" },
          { label: "Demo login or data reset issues", href: "../troubleshoot/demo-access.md" },
          { label: "Browse public demos", href: "../../website/getting-started/browse-site.md" },
        ],
      })
    );

    writeArticle(
      app,
      "how-to",
      "add-items",
      "Add items to a Marketlist list",
      article({
        appName: name,
        audience: "end-user",
        title: "Add items to a Marketlist list",
        goal: "Create or extend a shopping list with new items in the demo.",
        prereqs: ["Signed into Marketlist demo", "A list you can edit"],
        steps: [
          "Open the target list from the overview.",
          "Use **Add item** (or the inline add field).",
          "Enter item name, optional quantity/unit, and notes.",
          "Save. Confirm the item appears at the top or bottom per sort order.",
          "Toggle purchased/checked state to simulate shopping.",
          "Remember demo data may reset periodically—do not store real credentials here.",
        ],
        verify: "New item remains visible after a refresh (until the next demo reset window).",
        related: [
          { label: "Open the Marketlist demo", href: "../getting-started/open-demo.md" },
          { label: "Demo login or data reset issues", href: "../troubleshoot/demo-access.md" },
          { label: "Browse public demos", href: "../../website/getting-started/browse-site.md" },
        ],
      })
    );

    writeArticle(
      app,
      "troubleshoot",
      "demo-access",
      "Marketlist demo login or data issues",
      article({
        appName: name,
        audience: "end-user",
        title: "Marketlist demo login or data issues",
        goal: "Recover when the Marketlist demo will not sign in or appears empty after a reset.",
        prereqs: ["Demos page for current credentials", "Private browser window"],
        steps: [
          "Copy fresh demo credentials from the Kecktech demos page—old bookmarks may be stale.",
          "Clear site data for the Marketlist host and retry.",
          "If the list is empty, the sandbox may have reset; recreate a sample list to continue evaluating UX.",
          "502/404: note the error and contact Kecktech—demo hosting may be redeploying.",
          "For production interest, use the website contact form rather than relying on demo persistence.",
        ],
        verify: "You can sign in and interact with a list end-to-end.",
        related: [
          { label: "Open the Marketlist demo", href: "../getting-started/open-demo.md" },
          { label: "Add items to a list", href: "../how-to/add-items.md" },
          { label: "Website contact form", href: "../../website/how-to/contact-form.md" },
        ],
      })
    );
  }
};
