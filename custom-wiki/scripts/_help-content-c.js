/**
 * Help articles: flooros, argo, cleaner, netops, chat, sovereign-hub, farmbot, dashboard
 */
module.exports = function register({ writeArticle, article }) {
  // ── FloorOS ──────────────────────────────────────────────────────────────
  {
    const app = "flooros";
    const name = "FloorOS";
    const url = "https://flooros.kecktech.net";

    writeArticle(
      app,
      "getting-started",
      "open-demo",
      "Open the FloorOS demo",
      article({
        appName: name,
        audience: "end-user",
        title: "Open the FloorOS demo",
        goal: "Launch FloorOS and orient to floor-plan / space management views in the demo.",
        prereqs: [
          `Demo URL: ${url}`,
          "Link also available from https://www.kecktech.net demos",
        ],
        steps: [
          "Open FloorOS from the demos page or the direct URL.",
          "Sign in with published demo credentials if the app is gated.",
          "Land on the primary floor or spaces view.",
          "Identify navigation for floors, rooms/zones, and status indicators.",
          "Pan/zoom the floor visualization if the demo includes an interactive map.",
          "Open a room/zone detail panel to see sample metadata (capacity, status, notes).",
        ],
        verify: "A floor view renders and you can select at least one space/room without a blank screen.",
        related: [
          { label: "Update a space status", href: "../how-to/update-space-status.md" },
          { label: "Floor plan not rendering", href: "../troubleshoot/map-not-loading.md" },
          { label: "Browse public demos", href: "../../website/getting-started/browse-site.md" },
        ],
      })
    );

    writeArticle(
      app,
      "how-to",
      "update-space-status",
      "Update a space status in FloorOS",
      article({
        appName: name,
        audience: "end-user",
        title: "Update a space status in FloorOS",
        goal: "Change a room/zone status (available, occupied, maintenance) in the demo workflow.",
        prereqs: ["Access to an editable demo floor", "Understanding that demo data may reset"],
        steps: [
          "Open the floor view and select the target room/zone.",
          "Open the detail / edit panel.",
          "Change status using the control provided (dropdown or buttons).",
          "Add an optional note (example: `Demo maintenance window`).",
          "Save. Confirm the floor color/icon updates to match the new status.",
          "Switch floors if available and return to ensure the change persisted for the session.",
        ],
        verify: "Selected space shows the new status in both the detail panel and the floor overview.",
        related: [
          { label: "Open the FloorOS demo", href: "../getting-started/open-demo.md" },
          { label: "Floor plan not rendering", href: "../troubleshoot/map-not-loading.md" },
          { label: "Browse public demos", href: "../../website/getting-started/browse-site.md" },
        ],
      })
    );

    writeArticle(
      app,
      "troubleshoot",
      "map-not-loading",
      "Floor plan not rendering",
      article({
        appName: name,
        audience: "end-user",
        title: "Floor plan not rendering",
        goal: "Recover when FloorOS shows a blank map or stuck loading indicator.",
        prereqs: ["Modern browser with WebGL/canvas enabled", "Demo credentials"],
        steps: [
          "Hard refresh and retry in a private window.",
          "Disable extensions that block canvas/WebGL.",
          "Confirm you are on the correct floor tab; some demos hide empty floors.",
          "Check browser console only if you are technical—capture errors for a support ticket.",
          "If the API layer fails (endless spinner), the demo backend may be redeploying; wait and retry.",
          "Use the website contact form if the demo stays down during a sales evaluation.",
        ],
        verify: "Floor geometry/tiles render and space selection highlights a region.",
        related: [
          { label: "Open the FloorOS demo", href: "../getting-started/open-demo.md" },
          { label: "Update a space status", href: "../how-to/update-space-status.md" },
          { label: "Website contact form", href: "../../website/how-to/contact-form.md" },
        ],
      })
    );
  }

  // ── ARGO ─────────────────────────────────────────────────────────────────
  {
    const app = "argo";
    const name = "ARGO";
    const url = "https://argo.kecktech.net";

    writeArticle(
      app,
      "getting-started",
      "open-demo",
      "Open the ARGO demo",
      article({
        appName: name,
        audience: "end-user",
        title: "Open the ARGO demo",
        goal: "Launch the ARGO demo and locate its primary operational dashboard.",
        prereqs: [`Demo URL: ${url}`, "Demos page for current access notes"],
        steps: [
          "Open ARGO from https://www.kecktech.net demos or the direct hostname.",
          "Authenticate with demo credentials when prompted.",
          "Identify the home dashboard: KPIs, queues, or job/order cards depending on the build.",
          "Open the main navigation to see modules showcased in the demo.",
          "Read any on-screen demo banner so you know which features are simulated.",
        ],
        verify: "Dashboard widgets load and navigation between two modules works.",
        related: [
          { label: "Create a sample record", href: "../how-to/create-sample-record.md" },
          { label: "ARGO demo errors", href: "../troubleshoot/demo-errors.md" },
          { label: "Browse public demos", href: "../../website/getting-started/browse-site.md" },
        ],
      })
    );

    writeArticle(
      app,
      "how-to",
      "create-sample-record",
      "Create a sample record in ARGO",
      article({
        appName: name,
        audience: "end-user",
        title: "Create a sample record in ARGO",
        goal: "Walk the happy-path create flow so you can evaluate ARGO data entry UX.",
        prereqs: ["Signed into the demo", "Create permission on the demo role"],
        steps: [
          "From the dashboard, open the primary list (orders, jobs, or assets—use the label shown).",
          "Click **New** / **Create**.",
          "Fill required fields with clearly fake demo data (prefix names with `DEMO-`).",
          "Save and open the record detail view.",
          "Edit one field and save again to test update UX.",
          "Return to the list and confirm sort/search finds your `DEMO-` record.",
        ],
        verify: "The new record opens by ID/name and appears in list search.",
        related: [
          { label: "Open the ARGO demo", href: "../getting-started/open-demo.md" },
          { label: "ARGO demo errors", href: "../troubleshoot/demo-errors.md" },
          { label: "Browse public demos", href: "../../website/getting-started/browse-site.md" },
        ],
      })
    );

    writeArticle(
      app,
      "troubleshoot",
      "demo-errors",
      "ARGO demo errors",
      article({
        appName: name,
        audience: "end-user",
        title: "ARGO demo errors",
        goal: "Work around validation failures, stale sessions, and hosting blips in the ARGO demo.",
        prereqs: ["Screenshot of the error", "Time of failure"],
        steps: [
          "Read validation messages—required fields often block save.",
          "Sign out/in if you receive 401 after idle time.",
          "Retry create with simpler ASCII field values if you hit encoding edge cases.",
          "Clear site data if the UI shows mixed old/new schemas after a redeploy.",
          "Persistent 5xx: report via https://www.kecktech.net contact or support ticket with URL + time.",
        ],
        verify: "You can create or open a sample record without an error toast.",
        related: [
          { label: "Open the ARGO demo", href: "../getting-started/open-demo.md" },
          { label: "Create a sample record", href: "../how-to/create-sample-record.md" },
          { label: "Website contact form", href: "../../website/how-to/contact-form.md" },
        ],
      })
    );
  }

  // ── Cleaner ──────────────────────────────────────────────────────────────
  {
    const app = "cleaner";
    const name = "Cleaner";
    const url = "https://cleaner.kecktech.net";

    writeArticle(
      app,
      "getting-started",
      "open-demo",
      "Open the Cleaner demo",
      article({
        appName: name,
        audience: "end-user",
        title: "Open the Cleaner demo",
        goal: "Launch the Cleaner demo and understand its cleaning schedule / job board concept.",
        prereqs: [`Demo URL: ${url}`, "Demo credentials from the demos page if required"],
        steps: [
          "Open Cleaner from the marketing demos list or direct URL.",
          "Sign in if the demo is authenticated.",
          "Find the schedule or job list for the sample property/client.",
          "Open a job card to see status, assigned cleaner, and checklist items.",
          "Note whether the demo emphasizes dispatcher view vs cleaner mobile view.",
        ],
        verify: "You can open the schedule/job board and view a job detail.",
        related: [
          { label: "Complete a cleaning checklist", href: "../how-to/complete-checklist.md" },
          { label: "Jobs not updating", href: "../troubleshoot/jobs-stuck.md" },
          { label: "Browse public demos", href: "../../website/getting-started/browse-site.md" },
        ],
      })
    );

    writeArticle(
      app,
      "how-to",
      "complete-checklist",
      "Complete a cleaning checklist",
      article({
        appName: name,
        audience: "end-user",
        title: "Complete a cleaning checklist",
        goal: "Mark checklist tasks complete on a demo job and move it to done.",
        prereqs: ["Job assigned or available in the demo", "Edit rights on demo role"],
        steps: [
          "Open a job from the board/schedule.",
          "Expand the checklist section.",
          "Tick items as completed; add a note/photo placeholder if the UI offers it.",
          "Change job status to Completed / Done using the status control.",
          "Return to the board and confirm the job moved columns or filtered state.",
          "Reset or pick another job if you want to re-demo the flow (sandbox may auto-reset).",
        ],
        verify: "Job shows completed checklist progress and a completed status on the board.",
        related: [
          { label: "Open the Cleaner demo", href: "../getting-started/open-demo.md" },
          { label: "Jobs not updating", href: "../troubleshoot/jobs-stuck.md" },
          { label: "Browse public demos", href: "../../website/getting-started/browse-site.md" },
        ],
      })
    );

    writeArticle(
      app,
      "troubleshoot",
      "jobs-stuck",
      "Cleaner jobs not updating",
      article({
        appName: name,
        audience: "end-user",
        title: "Cleaner jobs not updating",
        goal: "Unstick the demo when checklist ticks or status changes do not persist.",
        prereqs: ["Network connectivity", "Active demo session"],
        steps: [
          "Watch for failed network requests after save; retry once online.",
          "Refresh the job detail—UI may be optimistic while API rejected validation.",
          "Ensure you are not on a read-only demo persona.",
          "Try another job; a single corrupt sample record should not block evaluation.",
          "After a platform redeploy, re-login and use freshly seeded jobs.",
        ],
        verify: "A checklist change remains after refresh.",
        related: [
          { label: "Open the Cleaner demo", href: "../getting-started/open-demo.md" },
          { label: "Complete a cleaning checklist", href: "../how-to/complete-checklist.md" },
          { label: "Website contact form", href: "../../website/how-to/contact-form.md" },
        ],
      })
    );
  }

  // ── NetOps ───────────────────────────────────────────────────────────────
  {
    const app = "netops";
    const name = "NetOps";
    const url = "https://netops.kecktech.net";

    writeArticle(
      app,
      "getting-started",
      "open-netops",
      "Open the NetOps console",
      article({
        appName: name,
        audience: "admin",
        title: "Open the NetOps console",
        goal: "Reach the NetOps tooling used for network visibility and operator tasks.",
        prereqs: [
          "Ops/admin group membership",
          `URL: ${url}`,
          "Tailscale if the console is internal-only",
        ],
        steps: [
          "Connect to the admin network if required.",
          `Open ${url} and complete Authelia.`,
          "Land on the NetOps home/dashboard.",
          "Locate inventory, device, or circuit lists used by the team.",
          "Open a known site/device to confirm read access before making changes.",
        ],
        verify: "NetOps UI loads and you can open a site or device record.",
        related: [
          { label: "Document a network change", href: "../how-to/document-change.md" },
          { label: "NetOps admin inventory hygiene", href: "../admin/inventory-hygiene.md" },
          { label: "NetOps unreachable", href: "../troubleshoot/unreachable.md" },
        ],
      })
    );

    writeArticle(
      app,
      "how-to",
      "document-change",
      "Document a network change",
      article({
        appName: name,
        audience: "admin",
        title: "Document a network change",
        goal: "Record a firewall, DNS, or circuit change so the next operator has accurate NetOps context.",
        prereqs: [
          "Approved change ticket in Zammad",
          "Before/after values (IP, VLAN, DNS name, rule IDs)",
        ],
        steps: [
          "Open the site/device object affected by the change.",
          "Update structured fields (IP addresses, uplinks, notes) to the new reality.",
          "Add a dated note referencing the Zammad ticket number.",
          "Attach diagrams or config snippets if the app supports uploads—redact secrets.",
          "If DNS changed, verify public/private resolution and update related Traefik routes docs.",
          "Close the loop in the ticket with a link/screenshot of the NetOps record.",
        ],
        verify: "Another tech can open the same record and understand the new state without asking you.",
        related: [
          { label: "Open the NetOps console", href: "../getting-started/open-netops.md" },
          { label: "NetOps admin inventory hygiene", href: "../admin/inventory-hygiene.md" },
          { label: "NetOps unreachable", href: "../troubleshoot/unreachable.md" },
        ],
      })
    );

    writeArticle(
      app,
      "troubleshoot",
      "unreachable",
      "NetOps console unreachable",
      article({
        appName: name,
        audience: "admin",
        title: "NetOps console unreachable",
        goal: "Restore access when NetOps fails DNS, auth, or upstream health checks.",
        prereqs: ["Tailscale status", "Portainer access for the NetOps stack"],
        steps: [
          "Confirm Tailscale is connected and `netops.kecktech.net` resolves as expected.",
          "Check Authelia health if you never leave the auth redirect.",
          "In Traefik, verify the NetOps router points at a healthy container.",
          "Inspect Portainer logs for the NetOps service.",
          "Use break-glass host tools only if documented; do not bypass change control on production firewalls.",
          "Declare incident priority based on whether customer traffic is impacted vs docs-only outage.",
        ],
        verify: "NetOps UI authenticates and loads inventory views.",
        related: [
          { label: "Open the NetOps console", href: "../getting-started/open-netops.md" },
          { label: "Document a network change", href: "../how-to/document-change.md" },
          { label: "NetOps admin inventory hygiene", href: "../admin/inventory-hygiene.md" },
        ],
      })
    );

    writeArticle(
      app,
      "admin",
      "inventory-hygiene",
      "Keep NetOps inventory accurate",
      article({
        appName: name,
        audience: "admin",
        title: "Keep NetOps inventory accurate",
        goal: "Run a lightweight hygiene pass so stale devices and circuits do not mislead incident response.",
        prereqs: ["NetOps admin rights", "Recent customer site list from ERP/CRM"],
        steps: [
          "Export or browse devices last-seen older than your threshold (example: 90 days).",
          "Mark decommissioned gear retired instead of deleting history when the app allows.",
          "Reconcile circuit IDs with carrier portals quarterly.",
          "Ensure each active site has an emergency contact and location note.",
          "Align naming with Vaultwarden collections and RMM client names.",
          "Log the hygiene pass date in ops notes.",
        ],
        verify: "Spot-check three active sites: contacts, uplinks, and hostnames match production.",
        related: [
          { label: "Open the NetOps console", href: "../getting-started/open-netops.md" },
          { label: "Document a network change", href: "../how-to/document-change.md" },
          { label: "NetOps unreachable", href: "../troubleshoot/unreachable.md" },
        ],
      })
    );
  }

  // ── Chat ─────────────────────────────────────────────────────────────────
  {
    const app = "chat";
    const name = "Chat";
    const url = "https://chat.kecktech.net";

    writeArticle(
      app,
      "getting-started",
      "join-workspace",
      "Join the Kecktech chat workspace",
      article({
        appName: name,
        audience: "end-user",
        title: "Join the Kecktech chat workspace",
        goal: "Sign in to team chat and reach the channels you need.",
        prereqs: [
          "Invited account or SSO-enabled user",
          `URL: ${url}`,
          "Authelia login when the edge requires it",
        ],
        steps: [
          `Open ${url}.`,
          "Complete Authelia / app login.",
          "Accept any workspace invitation email if this is your first join.",
          "Open the channel browser and join `#general` plus your team channels.",
          "Set display name and notification preferences (desktop/mobile).",
          "Send a quick hello in an appropriate channel so others know you are online.",
        ],
        verify: "You see channel history and can post a message that appears to others.",
        related: [
          { label: "Create a channel and share files", href: "../how-to/channels-and-files.md" },
          { label: "Chat admin moderation basics", href: "../admin/moderation.md" },
          { label: "Cannot connect to chat", href: "../troubleshoot/cannot-connect.md" },
        ],
      })
    );

    writeArticle(
      app,
      "how-to",
      "channels-and-files",
      "Create a channel and share files",
      article({
        appName: name,
        audience: "end-user",
        title: "Create a channel and share files",
        goal: "Spin up a topic channel and share a file without leaking secrets.",
        prereqs: ["Permission to create channels", "File smaller than server limits"],
        steps: [
          "Click **Add channel** / create channel.",
          "Name it clearly (`client-acme-cutover`) and set private vs public per policy.",
          "Invite only required members.",
          "Share updates in-thread when possible to keep the main channel readable.",
          "Upload files with the paperclip/upload control. Never upload password exports—use Vaultwarden.",
          "Pin key messages (runbooks, bridges) when the UI allows.",
        ],
        verify: "Channel members can open the channel and download the shared non-sensitive file.",
        related: [
          { label: "Join the chat workspace", href: "../getting-started/join-workspace.md" },
          { label: "Chat admin moderation basics", href: "../admin/moderation.md" },
          { label: "Cannot connect to chat", href: "../troubleshoot/cannot-connect.md" },
        ],
      })
    );

    writeArticle(
      app,
      "troubleshoot",
      "cannot-connect",
      "Cannot connect to chat",
      article({
        appName: name,
        audience: "end-user",
        title: "Cannot connect to chat",
        goal: "Fix SSO, websocket, and client issues that prevent chat from loading.",
        prereqs: ["Note whether web, desktop, or mobile client fails"],
        steps: [
          "Retry in a private browser window after Authelia re-login.",
          "If the UI loads but messages never appear, corporate proxies may block websockets—try Tailscale or another network.",
          "Update/reinstall the desktop client if only the native app fails.",
          "Check https://status-style signals via staff if many users report the outage simultaneously.",
          "Capture exact error text and file a ticket with Internal group for ops.",
        ],
        verify: "Realtime messages appear without manual refresh.",
        related: [
          { label: "Join the chat workspace", href: "../getting-started/join-workspace.md" },
          { label: "Create a channel and share files", href: "../how-to/channels-and-files.md" },
          { label: "Chat admin moderation basics", href: "../admin/moderation.md" },
        ],
      })
    );

    writeArticle(
      app,
      "admin",
      "moderation",
      "Chat moderation basics",
      article({
        appName: name,
        audience: "admin",
        title: "Chat moderation basics",
        goal: "Manage membership, retain auditability, and remove sensitive accidental posts.",
        prereqs: ["Chat admin/moderator role", "HR/ops guidance for people issues"],
        steps: [
          "Review workspace members monthly; remove departed staff (coordinate with LLDAP off-boarding).",
          "Convert noisy DMs about incidents into a dedicated private channel with ticket links.",
          "Delete or tombstone accidental secret pastes; rotate the exposed credential in Vaultwarden immediately.",
          "Adjust default notification and retention settings per compliance needs.",
          "Document integration webhooks (Zammad/n8n) so they are not removed as spam.",
        ],
        verify: "Departed users cannot log in; incident channel history still references ticket IDs.",
        related: [
          { label: "Join the chat workspace", href: "../getting-started/join-workspace.md" },
          { label: "Create a channel and share files", href: "../how-to/channels-and-files.md" },
          { label: "Cannot connect to chat", href: "../troubleshoot/cannot-connect.md" },
        ],
      })
    );
  }

  // ── Sovereign Hub ────────────────────────────────────────────────────────
  {
    const app = "sovereign-hub";
    const name = "Sovereign Hub";
    const url = "https://sovereign-hub.kecktech.net";

    writeArticle(
      app,
      "getting-started",
      "open-hub",
      "Open Sovereign Hub",
      article({
        appName: name,
        audience: "end-user",
        title: "Open Sovereign Hub",
        goal: "Reach Sovereign Hub and identify the services or resources it aggregates.",
        prereqs: [
          `URL: ${url}`,
          "Account authorized for Hub access (SSO via Authelia when enabled)",
        ],
        steps: [
          `Open ${url}.`,
          "Complete Authelia if challenged.",
          "Review the hub home: tiles, resource catalog, or project switcher as presented.",
          "Open a single resource/tile to confirm deep links work.",
          "Bookmark the hub as your launch point if you use multiple sovereign services.",
        ],
        verify: "Hub home renders and at least one linked resource opens successfully.",
        related: [
          { label: "Launch a linked service", href: "../how-to/launch-service.md" },
          { label: "Manage hub catalog entries", href: "../admin/manage-catalog.md" },
          { label: "Hub tile failures", href: "../troubleshoot/tile-failures.md" },
        ],
      })
    );

    writeArticle(
      app,
      "how-to",
      "launch-service",
      "Launch a linked service from the hub",
      article({
        appName: name,
        audience: "end-user",
        title: "Launch a linked service from the hub",
        goal: "Use Sovereign Hub navigation to open a downstream app with the correct context.",
        prereqs: ["Working hub session", "Permission on the target service"],
        steps: [
          "From hub home, select the service tile/card you need.",
          "If prompted, complete an additional consent or project picker.",
          "Confirm the URL you land on matches the expected kecktech.net (or documented) host.",
          "Perform a minimal action in the target app to ensure the session is valid.",
          "Use hub back-navigation or your bookmark to return without stacking duplicate SSO loops.",
        ],
        verify: "Target service loads under your user and reflects the project/context you selected.",
        related: [
          { label: "Open Sovereign Hub", href: "../getting-started/open-hub.md" },
          { label: "Manage hub catalog entries", href: "../admin/manage-catalog.md" },
          { label: "Hub tile failures", href: "../troubleshoot/tile-failures.md" },
        ],
      })
    );

    writeArticle(
      app,
      "troubleshoot",
      "tile-failures",
      "Sovereign Hub tile failures",
      article({
        appName: name,
        audience: "end-user",
        title: "Sovereign Hub tile failures",
        goal: "Fix tiles that 404, loop on SSO, or open the wrong environment.",
        prereqs: ["Name of the failing tile", "Whether other tiles work"],
        steps: [
          "If only one tile fails, the downstream app is likely down—check that hostname directly.",
          "If all tiles fail auth, fix Authelia session first.",
          "Clear hub site data if stale feature flags/catalog cache are suspected after a deploy.",
          "Compare the tile URL with staff docs; report mismatches so admins can update the catalog.",
          "Open a ticket with tile name, target URL, and screenshot.",
        ],
        verify: "The previously failing tile opens the correct healthy service.",
        related: [
          { label: "Open Sovereign Hub", href: "../getting-started/open-hub.md" },
          { label: "Launch a linked service", href: "../how-to/launch-service.md" },
          { label: "Manage hub catalog entries", href: "../admin/manage-catalog.md" },
        ],
      })
    );

    writeArticle(
      app,
      "admin",
      "manage-catalog",
      "Manage Sovereign Hub catalog entries",
      article({
        appName: name,
        audience: "admin",
        title: "Manage Sovereign Hub catalog entries",
        goal: "Add or update hub tiles so users reach the right URLs with correct visibility.",
        prereqs: ["Hub admin role", "Final URL and audience (staff vs customer)"],
        steps: [
          "Open hub admin/catalog settings.",
          "Create or edit a tile: title, description, icon, target URL, and sort order.",
          "Limit visibility to groups that should see the tile.",
          "Point production tiles at production hosts only—never mix staging URLs silently.",
          "Save and verify with a non-admin test user in the intended group.",
          "Remove retired services instead of leaving broken links.",
        ],
        verify: "Test user sees the tile and lands on the correct authenticated app.",
        related: [
          { label: "Open Sovereign Hub", href: "../getting-started/open-hub.md" },
          { label: "Launch a linked service", href: "../how-to/launch-service.md" },
          { label: "Hub tile failures", href: "../troubleshoot/tile-failures.md" },
        ],
      })
    );
  }

  // ── FarmBot ──────────────────────────────────────────────────────────────
  {
    const app = "farmbot";
    const name = "FarmBot";
    const url = "https://farmbot.kecktech.net";

    writeArticle(
      app,
      "getting-started",
      "open-demo",
      "Open the FarmBot demo",
      article({
        appName: name,
        audience: "end-user",
        title: "Open the FarmBot demo",
        goal: "Launch the FarmBot demo UI and locate farm/device controls safely.",
        prereqs: [
          `Demo URL: ${url}`,
          "Understand this may be a simulated farm—avoid assuming physical hardware moves unless staff confirm",
        ],
        steps: [
          "Open FarmBot from the demos page or direct URL.",
          "Sign in with demo credentials if required.",
          "Find the farm map / device overview.",
          "Locate controls for sequences, plants, or peripherals as exposed in the demo.",
          "Read any warning banners about simulation vs real hardware.",
        ],
        verify: "Farm overview loads and you can open the sequences or plants panel.",
        related: [
          { label: "Run a demo sequence", href: "../how-to/run-sequence.md" },
          { label: "FarmBot controls unresponsive", href: "../troubleshoot/unresponsive.md" },
          { label: "Browse public demos", href: "../../website/getting-started/browse-site.md" },
        ],
      })
    );

    writeArticle(
      app,
      "how-to",
      "run-sequence",
      "Run a demo FarmBot sequence",
      article({
        appName: name,
        audience: "end-user",
        title: "Run a demo FarmBot sequence",
        goal: "Execute a sample sequence in the demo to evaluate automation UX.",
        prereqs: [
          "Demo role allowed to run sequences",
          "Confirmation that the instance is simulated or hardware-safe",
        ],
        steps: [
          "Open **Sequences** (or equivalent).",
          "Select a sample sequence such as water plants / move to home—prefer staff-provided safe demos.",
          "Use **Run** / **Execute** once. Watch the log/ticker for step progress.",
          "Do not edit motor steps on a live bot without training.",
          "After completion, review the log for success/failure messages.",
          "Reset demo state if the UI provides a sandbox reset.",
        ],
        verify: "Sequence log shows completed steps without unhandled errors.",
        related: [
          { label: "Open the FarmBot demo", href: "../getting-started/open-demo.md" },
          { label: "FarmBot controls unresponsive", href: "../troubleshoot/unresponsive.md" },
          { label: "Browse public demos", href: "../../website/getting-started/browse-site.md" },
        ],
      })
    );

    writeArticle(
      app,
      "troubleshoot",
      "unresponsive",
      "FarmBot controls unresponsive",
      article({
        appName: name,
        audience: "end-user",
        title: "FarmBot controls unresponsive",
        goal: "Recover when the demo UI loads but run controls do nothing.",
        prereqs: ["Browser console access helpful but optional"],
        steps: [
          "Confirm you are still authenticated; re-login if buttons no-op.",
          "Check whether another demo user locked the device/simulator.",
          "Refresh after waiting for a previously running sequence to finish.",
          "Try a different sample sequence; one corrupt definition should not block all demos.",
          "If websockets fail, try another network; report persistent outages via the contact form.",
        ],
        verify: "A sample sequence starts and emits log lines.",
        related: [
          { label: "Open the FarmBot demo", href: "../getting-started/open-demo.md" },
          { label: "Run a demo sequence", href: "../how-to/run-sequence.md" },
          { label: "Website contact form", href: "../../website/how-to/contact-form.md" },
        ],
      })
    );
  }

  // ── Dashboard ────────────────────────────────────────────────────────────
  {
    const app = "dashboard";
    const name = "Apps Dashboard";
    const url = "https://dash.kecktech.net";
    const alias = "https://dashboard.kecktech.net";

    writeArticle(
      app,
      "getting-started",
      "use-app-tiles",
      "Use Apps Dashboard tiles",
      article({
        appName: name,
        audience: "end-user",
        title: "Use Apps Dashboard tiles",
        goal: "Open Kecktech apps from the central dashboard tiles after SSO.",
        prereqs: [
          "Staff or authorized user account",
          `URL: ${url} (alias: ${alias})`,
        ],
        steps: [
          `Open ${url} (or ${alias}).`,
          "Complete Authelia login and 2FA if required.",
          "Review the tile grid. Each tile launches an app (ERP, tickets, vault, admin, RMM, etc.).",
          "Click a tile you are allowed to use. A new tab/window may open.",
          "If a tile is missing, you may lack group membership—ask ops rather than bookmarking raw hosts inconsistently.",
          "Use the dashboard as your daily launcher to keep SSO sessions predictable.",
        ],
        verify: "At least two tiles open their target apps under your user without 403.",
        related: [
          { label: "Pin and find ops tools", href: "../how-to/find-ops-tools.md" },
          { label: "Configure dashboard tiles", href: "../admin/configure-tiles.md" },
          { label: "Tile opens wrong app or 403", href: "../troubleshoot/tile-403.md" },
        ],
      })
    );

    writeArticle(
      app,
      "how-to",
      "find-ops-tools",
      "Find ops tools on the dashboard",
      article({
        appName: name,
        audience: "admin",
        title: "Find ops tools on the dashboard",
        goal: "Locate onboarding, infra, and support launchers used by Kecktech staff.",
        prereqs: ["Ops-group access on the dashboard"],
        steps: [
          "Sign in to the dashboard.",
          "Look for ops-specific sections or tiles such as Onboarding Wizard (`/ops/onboarding` on the dashboard host).",
          "Open Portainer, Traefik, LLDAP, n8n, Umami, and RMM tiles from the same grid when visible.",
          "Prefer these links over tribal bookmarks so hostname changes propagate.",
          "If you use the onboarding wizard, follow its steps for LLDAP → Vault → Zammad → ERPNext linkage.",
        ],
        verify: "You can open the onboarding wizard or an infra tile appropriate to your role.",
        related: [
          { label: "Use Apps Dashboard tiles", href: "../getting-started/use-app-tiles.md" },
          { label: "Configure dashboard tiles", href: "../admin/configure-tiles.md" },
          { label: "Tile opens wrong app or 403", href: "../troubleshoot/tile-403.md" },
        ],
      })
    );

    writeArticle(
      app,
      "troubleshoot",
      "tile-403",
      "Dashboard tile opens wrong app or 403",
      article({
        appName: name,
        audience: "end-user",
        title: "Dashboard tile opens wrong app or 403",
        goal: "Correct authorization and link problems when dashboard tiles misbehave.",
        prereqs: ["Tile name that fails", "Your username"],
        steps: [
          "Open the tile once; note the final hostname and HTTP status.",
          "403 after Authelia usually means LLDAP group missing for that app—request group change.",
          "Wrong app/URL: report as a dashboard config bug with expected vs actual URL.",
          "Clear cookies for dash/dashboard and auth hosts, then retry.",
          "Try the alias host (`dash` vs `dashboard`) only as a temporary workaround; still report the bad tile.",
        ],
        verify: "Tile lands on the intended app with an authorized session.",
        related: [
          { label: "Use Apps Dashboard tiles", href: "../getting-started/use-app-tiles.md" },
          { label: "Find ops tools on the dashboard", href: "../how-to/find-ops-tools.md" },
          { label: "Configure dashboard tiles", href: "../admin/configure-tiles.md" },
        ],
      })
    );

    writeArticle(
      app,
      "admin",
      "configure-tiles",
      "Configure dashboard tiles",
      article({
        appName: name,
        audience: "admin",
        title: "Configure dashboard tiles",
        goal: "Add or update app tiles and visibility so each group sees the right launchers.",
        prereqs: [
          "Dashboard admin access",
          "Final HTTPS URL and required Authelia groups",
        ],
        steps: [
          "Open dashboard admin/configuration for tiles (as implemented in the Kecktech dashboard).",
          "Create/edit a tile: title, icon, target URL, sort order, and audience groups.",
          "Use canonical hosts (`erp.kecktech.net`, `tickets.kecktech.net`, `vault.kecktech.net`, etc.).",
          "Hide infra tiles from customer groups.",
          "Save and verify with a test user in each affected group.",
          "Announce non-trivial launcher changes in staff chat.",
        ],
        verify: "Test users only see permitted tiles and each tile hits the correct healthy URL.",
        related: [
          { label: "Use Apps Dashboard tiles", href: "../getting-started/use-app-tiles.md" },
          { label: "Find ops tools on the dashboard", href: "../how-to/find-ops-tools.md" },
          { label: "Tile opens wrong app or 403", href: "../troubleshoot/tile-403.md" },
        ],
      })
    );
  }
};
