/**
 * Help articles: erpnext, zammad, vaultwarden, n8n, website, site-admin, wiki, umami
 */
module.exports = function register({ writeArticle, article }) {
  // ── ERPNext ──────────────────────────────────────────────────────────────
  {
    const app = "erpnext";
    const name = "ERPNext";
    const url = "https://erp.kecktech.net";
    const alias = "https://ops.kecktech.net";

    writeArticle(
      app,
      "getting-started",
      "login-and-desk",
      "Log in to ERPNext Desk",
      article({
        appName: name,
        audience: "end-user",
        title: "Log in to ERPNext Desk",
        goal: "Sign in to the Kecktech ERP desk and open your home workspace without errors.",
        prereqs: [
          "Staff or customer ERPNext account (often behind Authelia)",
          `URL: ${url} (alias: ${alias})`,
          "Modern browser with cookies enabled for Authelia SSO",
        ],
        steps: [
          `Open ${url} (or ${alias}).`,
          "If redirected to Authelia at https://auth.kecktech.net, enter your LLDAP username and password, then complete 2FA if enrolled.",
          "On the ERPNext login screen (if shown), enter your ERPNext user email/username and password, then click **Login**.",
          "Wait for Desk to load. You should see the workspace sidebar and module icons (CRM, Accounting, Buying, Selling, Stock, and others).",
          "Open **Home** (or your default workspace). Pin frequently used DocTypes with the star icon.",
          "Open your avatar menu (top-right) and confirm the correct user name and company context appear.",
        ],
        verify:
          "You can open **CRM → Customer** (or another permitted module) and the list view loads without an authentication or permission error.",
        related: [
          { label: "Create a customer", href: "../how-to/create-customer.md" },
          { label: "Manage roles and permissions", href: "../admin/manage-roles.md" },
          { label: "Cannot open Desk", href: "../troubleshoot/cannot-open-desk.md" },
        ],
      })
    );

    writeArticle(
      app,
      "how-to",
      "create-customer",
      "Create a customer in ERPNext",
      article({
        appName: name,
        audience: "end-user",
        title: "Create a customer in ERPNext",
        goal: "Add a Customer record with billing details so invoices and portal data can link correctly.",
        prereqs: [
          "Logged into Desk with CRM or Sales create permission",
          `URL: ${url}`,
          "Legal/business name and primary contact email ready",
        ],
        steps: [
          `Open ${url} and reach Desk.`,
          "Go to **CRM → Customer**, or use Awesome Bar: type `Customer` and press Enter.",
          "Click **+ Add Customer** (or **New**).",
          "Set **Customer Name** to the company or individual legal name used on invoices.",
          "Choose **Customer Type** (Company or Individual) and set **Customer Group** / **Territory** per Kecktech ops practice.",
          "Under **Address & Contact**, add a primary Billing Address and a Contact with email (match Zammad/portal email when possible).",
          "Optional: set default payment terms, currency, and tax category for that client.",
          "Click **Save**. Note the Customer ID in the title bar for ticket notes.",
        ],
        verify:
          "The Customer appears in list search by name, and the form opens without validation errors.",
        related: [
          { label: "Log in to Desk", href: "../getting-started/login-and-desk.md" },
          { label: "Manage roles and permissions", href: "../admin/manage-roles.md" },
          { label: "Cannot open Desk", href: "../troubleshoot/cannot-open-desk.md" },
        ],
      })
    );

    writeArticle(
      app,
      "troubleshoot",
      "cannot-open-desk",
      "Cannot open ERPNext Desk",
      article({
        appName: name,
        audience: "end-user",
        title: "Cannot open ERPNext Desk",
        goal: "Diagnose and clear common blocks that prevent Desk from loading after SSO or password login.",
        prereqs: [
          "Browser access from your workstation",
          `Try both ${url} and ${alias}`,
          "Know whether you normally use Authelia SSO",
        ],
        steps: [
          "Confirm the page is not a Traefik 404/502. Gateway errors lasting more than a minute should be ticketed at https://tickets.kecktech.net.",
          "Clear cookies for `auth.kecktech.net` and `erp.kecktech.net` (or use a private window), then sign in again through Authelia.",
          "If Authelia succeeds but ERPNext shows **Login**, use the ERPNext user that matches your staff email.",
          "If Desk loads but modules are empty, ask an admin to confirm your User is enabled and has Role permissions.",
          "Temporarily disable aggressive ad blockers for `*.kecktech.net`; Desk boot uses XHR.",
          "For CSRF or session loops: sign out at https://auth.kecktech.net, close the tab, then start again from the ERP URL.",
          "Still blocked? Capture URL, HTTP status, and a screenshot; file a Zammad ticket (Internal or MSP Support).",
        ],
        verify: "Desk home loads with workspace icons and Awesome Bar finds DocTypes.",
        related: [
          { label: "Log in to Desk", href: "../getting-started/login-and-desk.md" },
          { label: "Create a customer", href: "../how-to/create-customer.md" },
          { label: "Authelia first login", href: "../../authelia/getting-started/first-login.md" },
        ],
      })
    );

    writeArticle(
      app,
      "admin",
      "manage-roles",
      "Manage ERPNext roles and permissions",
      article({
        appName: name,
        audience: "admin",
        title: "Manage ERPNext roles and permissions",
        goal: "Assign roles and permission rules so staff see only the DocTypes they need.",
        prereqs: [
          "System Manager or Administrator role",
          `URL: ${url}`,
          "List of modules the user needs (CRM, Accounts, Stock, etc.)",
        ],
        steps: [
          `Sign in to ${url} as an administrator.`,
          "Awesome Bar → `User` → open the target user.",
          "Under **Roles**, enable the minimum set (Sales User, Accounts User, etc.). Avoid System Manager unless required.",
          "Apply a **Role Profile** if Kecktech uses standard tech vs finance profiles.",
          "Open **Role Permission Manager** and confirm Create/Read/Write/Submit for required Document Types.",
          "If restricting by Customer/Company, add **User Permission** rows for allowed records.",
          "Have the user hard-refresh Desk (or log out/in) and re-test module access.",
          "Record the access grant in the related Zammad ticket or onboarding checklist.",
        ],
        verify:
          "The user opens permitted DocTypes and gets a clear permission error on DocTypes they should not access.",
        related: [
          { label: "Log in to Desk", href: "../getting-started/login-and-desk.md" },
          { label: "Create a customer", href: "../how-to/create-customer.md" },
          { label: "Cannot open Desk", href: "../troubleshoot/cannot-open-desk.md" },
        ],
      })
    );
  }

  // ── Zammad ───────────────────────────────────────────────────────────────
  {
    const app = "zammad";
    const name = "Zammad";
    const url = "https://tickets.kecktech.net";
    const alias = "https://support.kecktech.net";

    writeArticle(
      app,
      "getting-started",
      "open-a-ticket",
      "Open a support ticket in Zammad",
      article({
        appName: name,
        audience: "end-user",
        title: "Open a support ticket in Zammad",
        goal: "Create a tracked support request so Kecktech can respond under SLA.",
        prereqs: [
          "Customer account, or ability to email support@kecktech.net",
          `Customer UI: ${alias} (alias: ${url})`,
          "Clear issue description and optional screenshots",
        ],
        steps: [
          `Open ${alias} (or ${url}).`,
          "Sign in via Authelia if prompted. Customers land in the Zammad customer portal.",
          "Click **New Ticket** (or **+**).",
          "Enter a short **Title** naming the system and symptom (example: `Portal invoices not loading`).",
          "Select the group when offered (MSP Support, HaaS, Senior Care, or Internal for staff).",
          "Describe what broke, when it started, who is affected, and steps already tried. Attach screenshots or logs.",
          "Submit and copy the ticket number from the confirmation or ticket header.",
          "Alternatively email support@kecktech.net — Zammad creates a ticket from that channel automatically.",
        ],
        verify: "The ticket appears in your list with state New or Open and shows your message.",
        related: [
          { label: "Reply to a ticket", href: "../how-to/customer-reply.md" },
          { label: "Work the agent queue", href: "../admin/agent-queue.md" },
          { label: "Ticket missing after submit", href: "../troubleshoot/ticket-not-visible.md" },
        ],
      })
    );

    writeArticle(
      app,
      "how-to",
      "customer-reply",
      "Reply to a support ticket",
      article({
        appName: name,
        audience: "end-user",
        title: "Reply to a support ticket",
        goal: "Send a customer reply that continues the conversation on an existing ticket.",
        prereqs: [
          "Existing ticket number or Zammad notification email",
          `Portal: ${alias}`,
        ],
        steps: [
          `Open ${alias} and sign in.`,
          "Open **My Tickets** or the deep link from the notification email.",
          "Select the ticket and read the latest agent reply.",
          "Type your update in the reply box. Answer agent questions in a short numbered list when possible.",
          "Attach new files if requested. Do not paste passwords—use Vaultwarden share links instead.",
          "Submit/Update and confirm your message appears in the timeline.",
          "If the ticket is Pending Close and the issue is fixed, reply confirming resolution.",
        ],
        verify: "Your reply is visible in ticket history and the state is Open or Pending (not stuck Closed).",
        related: [
          { label: "Open a ticket", href: "../getting-started/open-a-ticket.md" },
          { label: "Ticket missing after submit", href: "../troubleshoot/ticket-not-visible.md" },
          { label: "Portal sign-in", href: "../../portal/getting-started/sign-in.md" },
        ],
      })
    );

    writeArticle(
      app,
      "troubleshoot",
      "ticket-not-visible",
      "Ticket missing after submit",
      article({
        appName: name,
        audience: "end-user",
        title: "Ticket missing after submit",
        goal: "Locate a ticket that does not appear in the customer portal after submit.",
        prereqs: [
          "Approximate submit time and subject line",
          "Access to the email inbox used for the Zammad account",
        ],
        steps: [
          "Check confirmation email from Zammad / support@kecktech.net for a ticket number and link.",
          "In the portal, clear state/date filters and search by subject keywords.",
          "Confirm you are logged in as the same email used at creation. Org-shared tickets may use a different view.",
          "If you emailed support@kecktech.net, wait a few minutes for mail processing; check spam for bounces.",
          `Retry ${url} vs ${alias} after a full Authelia re-login in a private window.`,
          "Still missing? Contact support with subject, timestamp, and sending email so an agent can search Admin → Tickets.",
        ],
        verify: "You can open the ticket by number and see your original message.",
        related: [
          { label: "Open a ticket", href: "../getting-started/open-a-ticket.md" },
          { label: "Reply to a ticket", href: "../how-to/customer-reply.md" },
          { label: "Work the agent queue", href: "../admin/agent-queue.md" },
        ],
      })
    );

    writeArticle(
      app,
      "admin",
      "agent-queue",
      "Work the agent ticket queue",
      article({
        appName: name,
        audience: "admin",
        title: "Work the agent ticket queue",
        goal: "Claim, update, and close tickets from the agent UI under Kecktech SLA practice.",
        prereqs: [
          "Agent or Admin role in Zammad",
          `URL: ${url}`,
          "Familiarity with groups: MSP Support, HaaS, Senior Care, Internal",
        ],
        steps: [
          `Open ${url} and sign in as an agent (not the customer portal).`,
          "Open **Overviews** → your group overview or **My assigned**.",
          "Open the oldest New ticket that matches your skill. **Assign** it to yourself if unassigned.",
          "Set priority (Critical/High/Normal/Low). Critical/High may trigger n8n → Twilio SMS to on-call.",
          "Reply publicly with next steps. Use macros for common acknowledgements when available.",
          "Log time under **Time Accounting**. Tag SVC-MSP, SVC-HAAS, SVC-REMOTE as required.",
          "When done, set **Pending Close** with a clear resolution summary.",
          "For vendor waits, use **Pending Reminder** with a follow-up date and an internal note containing the vendor case ID.",
        ],
        verify: "Ticket shows your assignment, latest public reply, and a state that matches remaining work.",
        related: [
          { label: "Open a ticket", href: "../getting-started/open-a-ticket.md" },
          { label: "Reply to a ticket", href: "../how-to/customer-reply.md" },
          { label: "Ticket missing after submit", href: "../troubleshoot/ticket-not-visible.md" },
        ],
        extra: `## SLA quick reference
| Priority | First response | Resolution target |
|---|---|---|
| Critical | 30 min | 4 hours |
| High | 2 hours | 8 hours |
| Normal | 4 hours | 24 hours |
| Low | 8 hours | 72 hours |`,
      })
    );
  }

  // ── Vaultwarden ──────────────────────────────────────────────────────────
  {
    const app = "vaultwarden";
    const name = "Vaultwarden";
    const url = "https://vault.kecktech.net";

    writeArticle(
      app,
      "getting-started",
      "create-vault",
      "Create and unlock your vault",
      article({
        appName: name,
        audience: "end-user",
        title: "Create and unlock your vault",
        goal: "Access your Kecktech Vaultwarden vault and confirm you can store a login item.",
        prereqs: [
          "Invitation email or staff-created account",
          `URL: ${url}`,
          "A strong master password you will not reuse elsewhere",
        ],
        steps: [
          `Open ${url}. Complete Authelia if the edge requires SSO before the vault UI.`,
          "If invited: open the invite link, set your **master password**, and optionally a non-revealing hint.",
          "If the account exists: enter vault email and master password, then unlock.",
          "Recommended: install the Bitwarden browser extension, set server URL to the vault hostname above, and log in.",
          "Create a temporary **Login** item named `Vault self-test`, save it, then delete after verify.",
          "Configure vault timeout lock for your device trust level.",
        ],
        verify: "Vault item list loads after unlock, and a new Login item saves without sync errors.",
        related: [
          { label: "Store and share a login item", href: "../how-to/share-login-item.md" },
          { label: "Manage organization collections", href: "../admin/org-collections.md" },
          { label: "Cannot unlock vault", href: "../troubleshoot/cannot-unlock.md" },
        ],
      })
    );

    writeArticle(
      app,
      "how-to",
      "share-login-item",
      "Store and share a login item",
      article({
        appName: name,
        audience: "end-user",
        title: "Store and share a login item",
        goal: "Save credentials into the correct collection so teammates can access them securely.",
        prereqs: [
          "Unlocked vault",
          "Membership in the target Organization/Collection",
          `URL: ${url}`,
        ],
        steps: [
          "Unlock the web vault or browser extension pointed at the Kecktech server.",
          "Click **New item** → **Login**.",
          "Fill Name, Username, Password, and URI (example: https://portal.kecktech.net).",
          "Under Ownership/Collections, select the client collection. Do not leave shared client secrets only in My Vault.",
          "Add notes for RustDesk IDs, serials, or recovery codes when relevant.",
          "Save and confirm the item appears under the collection filter.",
          "Customer access requires an org admin to grant the collection—never email the vault master password.",
        ],
        verify: "Another collection member can unlock and view the item.",
        related: [
          { label: "Create and unlock your vault", href: "../getting-started/create-vault.md" },
          { label: "Manage organization collections", href: "../admin/org-collections.md" },
          { label: "Cannot unlock vault", href: "../troubleshoot/cannot-unlock.md" },
        ],
      })
    );

    writeArticle(
      app,
      "troubleshoot",
      "cannot-unlock",
      "Cannot unlock Vaultwarden",
      article({
        appName: name,
        audience: "end-user",
        title: "Cannot unlock Vaultwarden",
        goal: "Recover from failed unlock, wrong server URL, or SSO edge issues.",
        prereqs: [
          "Know whether you use web vault, browser extension, or mobile app",
          "Access to invite email if the account is new",
        ],
        steps: [
          "Confirm the client custom server URL is exactly `https://vault.kecktech.net`.",
          "If Authelia challenges loop, finish https://auth.kecktech.net login, then reload the vault.",
          "Master password failures: try your hint; staff cannot read your master password.",
          "After rotating the master password on one device, sync that device online before updating others.",
          "Extension stuck: log out, clear local vault data, log in again with email + master password (+ vault 2FA if enabled).",
          "Invite expired? Ask staff to resend an organization invite from the Vaultwarden admin console.",
        ],
        verify: "Vault unlocks and previously saved items are listed.",
        related: [
          { label: "Create and unlock your vault", href: "../getting-started/create-vault.md" },
          { label: "Store and share a login item", href: "../how-to/share-login-item.md" },
          { label: "Manage organization collections", href: "../admin/org-collections.md" },
        ],
      })
    );

    writeArticle(
      app,
      "admin",
      "org-collections",
      "Manage organization collections",
      article({
        appName: name,
        audience: "admin",
        title: "Manage organization collections",
        goal: "Create client collections and grant least-privilege access for staff and customers.",
        prereqs: [
          "Organization Owner or Admin",
          `URL: ${url}`,
          "Naming convention: one collection per client company",
        ],
        steps: [
          "Sign in with an org admin account.",
          "Open Admin Console / Organization settings for the Kecktech org.",
          "Create a Collection named after the client. Use Read only for customers who should view but not edit.",
          "Assign staff users with Can edit or Can view as appropriate.",
          "Invite a new customer by email, require master password setup, then assign only their client collection.",
          "Create Login items for portal, HaaS device admin, and RustDesk ID notes in that collection.",
          "On off-boarding, remove the user from the collection or disable the user.",
        ],
        verify:
          "A test staff account sees only intended collections; a removed user loses visibility after re-login.",
        related: [
          { label: "Create and unlock your vault", href: "../getting-started/create-vault.md" },
          { label: "Store and share a login item", href: "../how-to/share-login-item.md" },
          { label: "Cannot unlock vault", href: "../troubleshoot/cannot-unlock.md" },
        ],
      })
    );
  }

  // ── n8n ──────────────────────────────────────────────────────────────────
  {
    const app = "n8n";
    const name = "n8n";
    const url = "https://n8n.kecktech.net";

    writeArticle(
      app,
      "getting-started",
      "open-editor",
      "Open the n8n workflow editor",
      article({
        appName: name,
        audience: "admin",
        title: "Open the n8n workflow editor",
        goal: "Reach the n8n canvas so you can inspect or edit Kecktech automation workflows.",
        prereqs: [
          "Ops/staff account allowed on n8n (Authelia + n8n user)",
          `URL: ${url}`,
          "Tailscale or office network if the instance is restricted",
        ],
        steps: [
          `Open ${url}.`,
          "Complete Authelia SSO if challenged.",
          "Sign into n8n with your ops user if a second login is required.",
          "From the left sidebar open **Workflows**. You should see named flows such as Zammad webhook → Twilio SMS.",
          "Click a workflow to open the canvas. Nodes appear left-to-right with trigger → actions.",
          "Use the editor toggle to switch between Editor and Executions without activating changes yet.",
        ],
        verify: "A workflow canvas loads and you can select a node to view its parameters panel.",
        related: [
          { label: "Test a webhook workflow", href: "../how-to/test-webhook.md" },
          { label: "Manage credentials", href: "../admin/manage-credentials.md" },
          { label: "Workflow executions failing", href: "../troubleshoot/executions-failing.md" },
        ],
      })
    );

    writeArticle(
      app,
      "how-to",
      "test-webhook",
      "Test a webhook-triggered workflow",
      article({
        appName: name,
        audience: "admin",
        title: "Test a webhook-triggered workflow",
        goal: "Safely fire a test execution for a webhook workflow (for example Zammad → SMS) and confirm success.",
        prereqs: [
          "Editor access to the target workflow",
          "Permission to send a test event (or use n8n Listen for test event)",
          "Understanding of whether the workflow is Active in production",
        ],
        steps: [
          "Open the workflow. Note whether it is **Active** (production) before testing.",
          "Select the Webhook (or Zammad Trigger) node. Copy the Test URL if you will POST manually.",
          "Click **Listen for test event** on the trigger node when available.",
          "Send a safe synthetic payload (prefer staging ticket IDs). Never spam real customer SMS without intent.",
          "Watch the node turn green and inspect JSON output in the OUTPUT panel.",
          "Step through downstream nodes (IF, HTTP Request, Twilio). Confirm credentials resolve.",
          "Open **Executions** and confirm the run shows Success with expected branch taken.",
          "Deactivate experimental copies; leave only reviewed workflows Active.",
        ],
        verify: "Executions list shows a successful run with the expected Twilio/HTTP response body.",
        related: [
          { label: "Open the workflow editor", href: "../getting-started/open-editor.md" },
          { label: "Manage credentials", href: "../admin/manage-credentials.md" },
          { label: "Workflow executions failing", href: "../troubleshoot/executions-failing.md" },
        ],
      })
    );

    writeArticle(
      app,
      "troubleshoot",
      "executions-failing",
      "Workflow executions failing",
      article({
        appName: name,
        audience: "admin",
        title: "Workflow executions failing",
        goal: "Find the failing node, fix credentials or payload shape, and restore reliable automation.",
        prereqs: [
          "Access to Executions history",
          "Knowledge of which external API failed (Zammad, Twilio, Graph, etc.)",
        ],
        steps: [
          "Open **Executions**, filter Error, and open the latest failed run.",
          "Click the red node. Read the error message and HTTP status (401, 403, 404, 429, 5xx).",
          "401/403: open **Credentials**, re-test the credential, rotate tokens stored in Vaultwarden if expired.",
          "Expression errors: compare incoming JSON to the expressions under the node (typos in `$json` paths).",
          "Timeouts: check whether the downstream API is up; increase timeout only after confirming the API is healthy.",
          "For webhook workflows that never run: confirm Active state and that Traefik routes `${url}` correctly.",
          "After fix, re-run with a controlled test payload and document the root cause in the related ticket.",
        ],
        verify: "A new execution completes with Success and side effects (SMS, ticket note) occur as designed.",
        related: [
          { label: "Open the workflow editor", href: "../getting-started/open-editor.md" },
          { label: "Test a webhook workflow", href: "../how-to/test-webhook.md" },
          { label: "Manage credentials", href: "../admin/manage-credentials.md" },
        ],
      })
    );

    writeArticle(
      app,
      "admin",
      "manage-credentials",
      "Manage n8n credentials",
      article({
        appName: name,
        audience: "admin",
        title: "Manage n8n credentials",
        goal: "Create and rotate API credentials used by workflows without embedding secrets in node parameters.",
        prereqs: [
          "n8n owner/admin rights",
          "Secret values available from Vaultwarden (Twilio, Graph, Zammad token, etc.)",
          `URL: ${url}`,
        ],
        steps: [
          "In n8n open **Credentials** from the left menu.",
          "Create a credential type matching the node (Header Auth, OAuth2, Twilio API, etc.).",
          "Paste secrets from Vaultwarden; never commit them to git or paste into public ticket replies.",
          "Name credentials clearly (`twilio-prod`, `zammad-webhook-token`).",
          "Open a workflow node and select the credential from the dropdown instead of hard-coding.",
          "Use **Test** / execute a single node where the UI allows it.",
          "On rotation: update the credential object once; all linked workflows pick up the new secret.",
          "Remove unused credentials quarterly to reduce blast radius.",
        ],
        verify: "A dependent workflow execution succeeds after selecting the new credential.",
        related: [
          { label: "Open the workflow editor", href: "../getting-started/open-editor.md" },
          { label: "Test a webhook workflow", href: "../how-to/test-webhook.md" },
          { label: "Workflow executions failing", href: "../troubleshoot/executions-failing.md" },
        ],
      })
    );
  }

  // ── website ──────────────────────────────────────────────────────────────
  {
    const app = "website";
    const name = "Kecktech Website";
    const url = "https://www.kecktech.net";

    writeArticle(
      app,
      "getting-started",
      "browse-site",
      "Browse the public website",
      article({
        appName: name,
        audience: "end-user",
        title: "Browse the public website",
        goal: "Find services, demos, and contact options on the public Kecktech marketing site.",
        prereqs: [
          "Any modern browser",
          `URL: ${url}`,
        ],
        steps: [
          `Open ${url}.`,
          "Use the top navigation for primary sections (services, demos, help, contact—labels match the live site).",
          "Open **Demos** to explore product showcases such as Marketlist, FloorOS, ARGO, Cleaner, and FarmBot.",
          "Open **Help** to jump to https://help.kecktech.net for how-to articles.",
          "Use the contact form or listed phone/email when you need sales or support intake.",
          "On mobile, open the menu control to reach the same destinations.",
        ],
        verify: "Home page loads with brand header and you can open Demos and Help without broken links.",
        related: [
          { label: "Use the contact form", href: "../how-to/contact-form.md" },
          { label: "Page or form errors", href: "../troubleshoot/page-not-loading.md" },
          { label: "Edit pages in Site Admin", href: "../../site-admin/how-to/edit-a-page.md" },
        ],
      })
    );

    writeArticle(
      app,
      "how-to",
      "contact-form",
      "Send a message with the contact form",
      article({
        appName: name,
        audience: "end-user",
        title: "Send a message with the contact form",
        goal: "Submit the website contact form so the message reaches Kecktech (Graph/mail pipeline).",
        prereqs: [
          `Contact page on ${url}`,
          "Valid reply email address",
          "Short description of your request",
        ],
        steps: [
          "Open the Contact page from the site navigation.",
          "Enter your name, email, phone (if requested), and message.",
          "Complete any CAPTCHA or anti-spam challenge if shown.",
          "Submit the form and wait for the on-page success confirmation.",
          "Check your inbox for an acknowledgement if the site sends one.",
          "For existing support issues, prefer https://support.kecktech.net so the request becomes a tracked ticket.",
        ],
        verify: "The page shows a success state (not a generic 500) and you do not see a validation error on required fields.",
        related: [
          { label: "Browse the public website", href: "../getting-started/browse-site.md" },
          { label: "Page or form errors", href: "../troubleshoot/page-not-loading.md" },
          { label: "Open a support ticket", href: "../../zammad/getting-started/open-a-ticket.md" },
        ],
      })
    );

    writeArticle(
      app,
      "troubleshoot",
      "page-not-loading",
      "Website page or form not loading",
      article({
        appName: name,
        audience: "end-user",
        title: "Website page or form not loading",
        goal: "Recover from blank pages, 5xx errors, or contact form failures on the public site.",
        prereqs: [
          "Note the exact URL and error text",
          "Try a second network (phone hotspot) to rule out local DNS",
        ],
        steps: [
          "Hard refresh (Ctrl+F5) or try a private window to bypass stale cache/CDN assets.",
          "If only one path fails (for example `/demos`), try Home to see whether the whole site is down.",
          "Contact form errors: confirm required fields, disable blockers for the domain, and retry once.",
          "If you see a Traefik or gateway error, wait briefly; persistent outages should be reported via phone or https://tickets.kecktech.net.",
          "Staff editing content should verify the page in Site Admin (https://admin.kecktech.net) and republish if a draft was left unpublished.",
        ],
        verify: "The target page renders and the contact form can show validation or success responses.",
        related: [
          { label: "Browse the public website", href: "../getting-started/browse-site.md" },
          { label: "Send a contact form message", href: "../how-to/contact-form.md" },
          { label: "Edit a page in Site Admin", href: "../../site-admin/how-to/edit-a-page.md" },
        ],
      })
    );
  }

  // ── site-admin ───────────────────────────────────────────────────────────
  {
    const app = "site-admin";
    const name = "Site Admin CMS";
    const url = "https://admin.kecktech.net";

    writeArticle(
      app,
      "getting-started",
      "sign-in-cms",
      "Sign in to Site Admin",
      article({
        appName: name,
        audience: "admin",
        title: "Sign in to Site Admin",
        goal: "Reach the CMS dashboard used to edit www.kecktech.net pages.",
        prereqs: [
          "Staff account in the admin group (Authelia/LLDAP)",
          `URL: ${url}`,
        ],
        steps: [
          `Open ${url}.`,
          "Complete Authelia login and 2FA if prompted.",
          "Land on the Site Admin home / page list.",
          "Confirm you can see editable pages such as Home and other site routes.",
          "Open **Page → Home** (or `/page/home`) as a smoke check that the editor shell loads.",
        ],
        verify: "You see the CMS navigation and at least one editable page entry without a 403.",
        related: [
          { label: "Edit a page", href: "../how-to/edit-a-page.md" },
          { label: "Publish and review checklist", href: "../admin/publish-checklist.md" },
          { label: "Cannot save or publish", href: "../troubleshoot/cannot-save.md" },
        ],
      })
    );

    writeArticle(
      app,
      "how-to",
      "edit-a-page",
      "Edit a website page",
      article({
        appName: name,
        audience: "admin",
        title: "Edit a website page",
        goal: "Change copy or content blocks on a marketing page and save the draft.",
        prereqs: [
          "Signed into Site Admin",
          `Editor URL pattern: ${url}/page/{slug}`,
          "Approved copy from marketing/owner when changing public claims",
        ],
        steps: [
          `Open ${url} and sign in.`,
          "Select the page to edit (example: Home via `/page/home`).",
          "Update the fields or blocks shown in the editor (headlines, body, CTAs, demo cards as applicable).",
          "Keep brand voice consistent; do not invent pricing or SLA claims.",
          "Click **Save** (or equivalent) to persist the draft.",
          "Use preview if available, then follow the publish checklist before making changes live.",
          "After publish, open https://www.kecktech.net on the matching path and hard-refresh.",
        ],
        verify: "Saved content reloads in the editor, and the public page shows the update after publish/cache refresh.",
        related: [
          { label: "Sign in to Site Admin", href: "../getting-started/sign-in-cms.md" },
          { label: "Publish and review checklist", href: "../admin/publish-checklist.md" },
          { label: "Cannot save or publish", href: "../troubleshoot/cannot-save.md" },
        ],
      })
    );

    writeArticle(
      app,
      "troubleshoot",
      "cannot-save",
      "Cannot save or publish in Site Admin",
      article({
        appName: name,
        audience: "admin",
        title: "Cannot save or publish in Site Admin",
        goal: "Clear permission, session, and validation issues that block CMS saves.",
        prereqs: [
          "Note any on-screen error toast or network status code",
          "Confirm you should have edit rights for that page",
        ],
        steps: [
          "Re-authenticate via Authelia; expired sessions often fail saves with 401.",
          "Check required fields—empty mandatory blocks can block save without a clear banner on some forms.",
          "If you receive 403, confirm LLDAP group membership for site admins with an ops admin.",
          "Try another browser profile to rule out extension interference.",
          "If save works but public site is stale, purge/wait for CDN/cache and confirm you published—not only saved draft.",
          "Escalate with HAR/screenshot to Internal tickets if API `/api` routes return 5xx.",
        ],
        verify: "A small intentional edit saves and appears after publish on the public URL.",
        related: [
          { label: "Sign in to Site Admin", href: "../getting-started/sign-in-cms.md" },
          { label: "Edit a website page", href: "../how-to/edit-a-page.md" },
          { label: "Publish and review checklist", href: "../admin/publish-checklist.md" },
        ],
      })
    );

    writeArticle(
      app,
      "admin",
      "publish-checklist",
      "Publish and review checklist",
      article({
        appName: name,
        audience: "admin",
        title: "Publish and review checklist",
        goal: "Ship website changes safely with review, links, and mobile checks.",
        prereqs: [
          "Draft already saved in Site Admin",
          "Second reviewer available for material marketing changes",
        ],
        steps: [
          "Re-read the edited sections for typos, broken brand names, and outdated phone numbers.",
          "Click every CTA and internal link you changed; confirm demos still match `demos.json` / live demo apps.",
          "Check desktop and a narrow mobile width before publish.",
          "Publish using the CMS control (Publish/Go live—use the label shown in admin).",
          "Verify https://www.kecktech.net (and the specific path) with a hard refresh.",
          "Spot-check Help and Portal links still resolve.",
          "Note the change in the related ticket or changelog channel.",
        ],
        verify: "Public page matches the approved draft and no console/network errors block primary CTAs.",
        related: [
          { label: "Sign in to Site Admin", href: "../getting-started/sign-in-cms.md" },
          { label: "Edit a website page", href: "../how-to/edit-a-page.md" },
          { label: "Cannot save or publish", href: "../troubleshoot/cannot-save.md" },
        ],
      })
    );
  }

  // ── wiki ─────────────────────────────────────────────────────────────────
  {
    const app = "wiki";
    const name = "Help Center (Wiki)";
    const url = "https://help.kecktech.net";

    writeArticle(
      app,
      "getting-started",
      "find-an-article",
      "Find an article in the Help Center",
      article({
        appName: name,
        audience: "end-user",
        title: "Find an article in the Help Center",
        goal: "Locate a how-to or troubleshooting article for a Kecktech app quickly.",
        prereqs: [
          "Public access (login not required for most help content)",
          `URL: ${url}`,
        ],
        steps: [
          `Open ${url}.`,
          "Use search with an app name + task (example: `vault unlock`, `zammad ticket`).",
          "Or browse shelves/books by product (ERPNext, Portal, Vaultwarden, etc.).",
          "Open a chapter such as Getting Started, How-to, or Troubleshoot.",
          "Skim Goal and Prerequisites before following Steps.",
          "Use Related links at the bottom to jump to sibling procedures.",
        ],
        verify: "You open an article whose Goal matches the task you need to complete.",
        related: [
          { label: "Suggest an article improvement", href: "../how-to/suggest-improvement.md" },
          { label: "Import help content (staff)", href: "../admin/import-content.md" },
          { label: "Search returns nothing useful", href: "../troubleshoot/search-misses.md" },
        ],
      })
    );

    writeArticle(
      app,
      "how-to",
      "suggest-improvement",
      "Suggest an article improvement",
      article({
        appName: name,
        audience: "end-user",
        title: "Suggest an article improvement",
        goal: "Report outdated steps or missing topics so staff can update the Help Center.",
        prereqs: [
          "Link to the article (or search terms if missing)",
          "What you expected vs what you saw",
        ],
        steps: [
          "Copy the article URL from the browser address bar.",
          "Open a ticket at https://support.kecktech.net (or email support@kecktech.net).",
          "Subject example: `Help doc fix: Vaultwarden unlock steps`.",
          "Include: article URL, screenshot, and the correct UI labels if you know them.",
          "If the topic is missing entirely, describe the app + task that needs a new article.",
          "Staff will update markdown under `content/help/` and re-import when appropriate.",
        ],
        verify: "You receive a ticket number acknowledging the documentation request.",
        related: [
          { label: "Find an article", href: "../getting-started/find-an-article.md" },
          { label: "Import help content (staff)", href: "../admin/import-content.md" },
          { label: "Search returns nothing useful", href: "../troubleshoot/search-misses.md" },
        ],
      })
    );

    writeArticle(
      app,
      "troubleshoot",
      "search-misses",
      "Search returns nothing useful",
      article({
        appName: name,
        audience: "end-user",
        title: "Search returns nothing useful",
        goal: "Work around empty or noisy Help Center search results.",
        prereqs: ["Rough name of the app or task"],
        steps: [
          "Search the app slug or product name alone (`erpnext`, `authelia`, `portal`).",
          "Try a verb synonyms: open/create/sign in/login/unlock.",
          "Browse the book for that app instead of relying on search.",
          "Check https://www.kecktech.net demos/help links for marketing entry points.",
          "If content is truly missing, follow Suggest an article improvement.",
        ],
        verify: "You reach a relevant Getting Started or How-to page for the app.",
        related: [
          { label: "Find an article", href: "../getting-started/find-an-article.md" },
          { label: "Suggest an article improvement", href: "../how-to/suggest-improvement.md" },
          { label: "Import help content (staff)", href: "../admin/import-content.md" },
        ],
      })
    );

    writeArticle(
      app,
      "admin",
      "import-content",
      "Import help content from markdown",
      article({
        appName: name,
        audience: "admin",
        title: "Import help content from markdown",
        goal: "Push `content/help` articles into the wiki via the import APIs.",
        prereqs: [
          "Repo checkout of custom-wiki with updated markdown",
          "Environment: `WIKI_URL` (default http://127.0.0.1:8080) and `WIKI_IMPORT_TOKEN`",
          "Token must exist as a valid API bearer token in the wiki database",
        ],
        steps: [
          "Review `content/help/manifest.json` for the articles you intend to load.",
          "Ensure hierarchy route and pages route are reachable on the wiki instance.",
          "From `custom-wiki`, run `node scripts/import-help-content.js` (add `--dry-run` first if desired).",
          "The script POSTs `/api/import/hierarchy` per app/subcategory, then `/api/import/pages` with markdown bodies.",
          "Confirm responses return shelf/book/chapter IDs and page IDs without 401/400 errors.",
          "Open https://help.kecktech.net and spot-check a new article’s title and Related links.",
          "Set reviewStatus to APPROVED in admin/review tooling when content is production-ready.",
        ],
        verify: "A newly imported slug resolves under its book/chapter and renders sanitized HTML from markdown.",
        related: [
          { label: "Find an article", href: "../getting-started/find-an-article.md" },
          { label: "Suggest an article improvement", href: "../how-to/suggest-improvement.md" },
          { label: "Search returns nothing useful", href: "../troubleshoot/search-misses.md" },
        ],
      })
    );
  }

  // ── umami ────────────────────────────────────────────────────────────────
  {
    const app = "umami";
    const name = "Umami";
    const url = "https://umami.kecktech.net";

    writeArticle(
      app,
      "getting-started",
      "view-dashboard",
      "View Umami analytics dashboard",
      article({
        appName: name,
        audience: "admin",
        title: "View Umami analytics dashboard",
        goal: "Open site analytics for Kecktech properties and read traffic at a glance.",
        prereqs: [
          "Umami login (staff)",
          `URL: ${url}`,
          "Website tracking already installed on the property",
        ],
        steps: [
          `Open ${url} and sign in (Authelia may front the app).`,
          "Select the website property (for example www.kecktech.net).",
          "Set the date range (today / 7d / 30d) in the dashboard header.",
          "Review overview cards: views, visits, bounce rate, and average visit duration.",
          "Scroll to pages, referrers, and devices to see what content performs.",
          "Use realtime (if enabled) during campaigns to confirm events are arriving.",
        ],
        verify: "Charts populate for the selected property and date range (not stuck on empty with tracking known-good).",
        related: [
          { label: "Filter pages and referrers", href: "../how-to/filter-reports.md" },
          { label: "Add a website property", href: "../admin/add-website.md" },
          { label: "No data in Umami", href: "../troubleshoot/no-data.md" },
        ],
      })
    );

    writeArticle(
      app,
      "how-to",
      "filter-reports",
      "Filter pages and referrers",
      article({
        appName: name,
        audience: "admin",
        title: "Filter pages and referrers",
        goal: "Narrow Umami reports to a path or traffic source for a campaign review.",
        prereqs: ["Access to the property dashboard", "Campaign URL or referrer hostname"],
        steps: [
          "Open the property dashboard and choose the date range covering the campaign.",
          "In Pages, click a path (for example `/demos`) to focus the view if the UI supports drill-down.",
          "Check Referrers for sources such as search, direct, or partner sites.",
          "Compare mobile vs desktop under Devices when diagnosing layout issues reported by users.",
          "Export or screenshot key charts for the ticket or meeting notes.",
          "Avoid sharing raw IP-level data externally; Umami is for aggregate product analytics.",
        ],
        verify: "Filtered view shows only the expected paths/sources for the period.",
        related: [
          { label: "View analytics dashboard", href: "../getting-started/view-dashboard.md" },
          { label: "Add a website property", href: "../admin/add-website.md" },
          { label: "No data in Umami", href: "../troubleshoot/no-data.md" },
        ],
      })
    );

    writeArticle(
      app,
      "troubleshoot",
      "no-data",
      "No data in Umami",
      article({
        appName: name,
        audience: "admin",
        title: "No data in Umami",
        goal: "Restore tracking when the dashboard stays empty despite live traffic.",
        prereqs: [
          "Ability to view site HTML / tag manager",
          "Umami website ID and script URL from the property settings",
        ],
        steps: [
          "Confirm you selected the correct website property and a date range that should include hits.",
          "Open the public site, DevTools → Network, filter for the Umami collect/script endpoint; confirm it is not blocked.",
          "Verify the tracking script website ID matches the Umami property.",
          "Disable ad blockers on a test browser; many blockers drop analytics beacons.",
          "If only one environment fails (staging vs prod), confirm the script is deployed to that host.",
          "Check Umami app logs / container health via Portainer if the API itself is down.",
        ],
        verify: "A test pageview from your browser increments realtime or appears in today’s stats within a few minutes.",
        related: [
          { label: "View analytics dashboard", href: "../getting-started/view-dashboard.md" },
          { label: "Filter pages and referrers", href: "../how-to/filter-reports.md" },
          { label: "Add a website property", href: "../admin/add-website.md" },
        ],
      })
    );

    writeArticle(
      app,
      "admin",
      "add-website",
      "Add a website property in Umami",
      article({
        appName: name,
        audience: "admin",
        title: "Add a website property in Umami",
        goal: "Register a new site so its tracking script can send pageviews to Umami.",
        prereqs: [
          "Umami admin role",
          "Canonical hostname for the site",
          "Place to install the script (Astro layout, CMS, etc.)",
        ],
        steps: [
          `Sign in at ${url}.`,
          "Open Settings → Websites → Add website.",
          "Enter name and domain (example: `www.kecktech.net`).",
          "Save and copy the tracking snippet / website ID.",
          "Store the ID in Vaultwarden notes for the web project if helpful.",
          "Deploy the script to the site’s shared layout. Publish the site.",
          "Generate a few pageviews and confirm they appear in the new property.",
        ],
        verify: "The new property lists recent pageviews from your test browse.",
        related: [
          { label: "View analytics dashboard", href: "../getting-started/view-dashboard.md" },
          { label: "Filter pages and referrers", href: "../how-to/filter-reports.md" },
          { label: "No data in Umami", href: "../troubleshoot/no-data.md" },
        ],
      })
    );
  }
};
