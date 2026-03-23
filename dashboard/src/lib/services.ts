/** Canonical list of all 12 Kecktech stack services.
 *  Single source of truth for home page tiles, ops page, and /api/health.
 */
export type ServiceDef = {
  name: string;
  description: string;
  url: string;
  healthUrl: string;
  healthHost?: string;
  icon: string;
  color: string;
};

export const SERVICES: ServiceDef[] = [
  {
    name: "ERPNext",
    description: "CRM, Billing, HaaS",
    url: "https://ops.kecktech.net",
    healthUrl: "http://frappe_docker-frontend-1:8080/api/method/ping",
    // Must match FRAPPE_SITE_NAME_HEADER / nginx server_name
    healthHost: "ops.kecktech.net",
    icon: "briefcase",
    color: "#0089ff",
  },
  {
    name: "Zammad",
    description: "Service Desk",
    url: "https://tickets.kecktech.net",
    healthUrl: "http://zammad-nginx:8080/",
    icon: "headset",
    color: "#34d399",
  },
  {
    name: "Vaultwarden",
    description: "Secrets & Profiles",
    url: "https://vault.kecktech.net",
    healthUrl: "http://vaultwarden:80/alive",
    icon: "lock",
    color: "#818cf8",
  },
  {
    name: "n8n",
    description: "Workflows & SMS",
    url: "https://n8n.kecktech.net",
    healthUrl: "http://n8n:5678/healthz",
    icon: "workflow",
    color: "#ff6d5a",
  },
  {
    name: "WordPress",
    description: "Public Website",
    url: "https://www.kecktech.net",
    // Static core file avoids redirects / canonical URL issues on internal HTTP checks
    healthUrl: "http://wordpress:80/wp-includes/images/w-logo-blue.png",
    icon: "globe",
    color: "#21759b",
  },
  {
    name: "WikiJS",
    description: "Knowledge Base",
    url: "https://help.kecktech.net",
    healthUrl: "http://wikijs:3000/healthz",
    icon: "book",
    color: "#1976d2",
  },
  {
    name: "Umami",
    description: "Analytics",
    url: "https://stats.kecktech.net",
    healthUrl: "http://umami:3000/api/heartbeat",
    icon: "chart",
    color: "#f59e0b",
  },
  {
    name: "Tactical RMM",
    description: "Remote Monitoring",
    url: "https://rmm.kecktech.net",
    // Internal HTTPS uses self-signed cert; Node fetch fails TLS. HTTP :8080 is same nginx.
    healthUrl: "http://trmm-nginx:8080/",
    icon: "monitor",
    color: "#6366f1",
  },
  {
    name: "Mailcow",
    description: "Email Server",
    url: "https://mail.kecktech.net",
    healthUrl: "http://mailcowdockerized-nginx-mailcow-1:8081/",
    icon: "mail",
    color: "#f43f5e",
  },
  {
    name: "Portainer",
    description: "Container Management",
    url: "https://127.0.0.1:9443",
    healthUrl: "http://portainer:9000/api/system/status",
    icon: "container",
    color: "#13bef9",
  },
  {
    name: "Traefik",
    description: "Reverse Proxy",
    url: "https://traefik.kecktech.net",
    healthUrl: "http://traefik:80/ping",
    icon: "route",
    color: "#38a3a5",
  },
  {
    name: "Authelia",
    description: "SSO Gateway",
    url: "https://auth.kecktech.net",
    healthUrl: "http://authelia:9091/api/health",
    icon: "shield",
    color: "#1a56db",
  },
];
