# Help Center Content Program — Scaffold

Operating system for documenting every Kecktech app on [help.kecktech.net](https://help.kecktech.net/).

## Category tree (one category per app)

| Category slug | App | Subcategories |
|---------------|-----|---------------|
| erpnext | ERPNext | getting-started, how-to, admin, troubleshoot |
| zammad | Zammad / Support | getting-started, how-to, admin, troubleshoot |
| portal | Customer Portal | getting-started, how-to, admin, troubleshoot |
| vaultwarden | Vaultwarden | getting-started, how-to, admin, troubleshoot |
| dashboard | Apps Dashboard | getting-started, how-to, admin, troubleshoot |
| site-admin | Site Admin CMS | getting-started, how-to, admin, troubleshoot |
| n8n | n8n | getting-started, how-to, admin, troubleshoot |
| umami | Umami / Stats | getting-started, how-to, admin, troubleshoot |
| trmm | Tactical RMM | getting-started, how-to, admin, troubleshoot |
| authelia | Authelia SSO | getting-started, how-to, admin, troubleshoot |
| marketlist | Marketlist | getting-started, how-to, admin, troubleshoot |
| flooros | FloorOS | getting-started, how-to, admin, troubleshoot |
| farmbot | FarmBot | getting-started, how-to, admin, troubleshoot |
| cleaner | Cleaner | getting-started, how-to, admin, troubleshoot |
| argo | ARGO | getting-started, how-to, admin, troubleshoot |
| rustdesk | RustDesk (client) | getting-started, how-to, troubleshoot |
| wiki | Help Center itself | getting-started, how-to, admin |

## Article template

```md
# {Title}

**App:** {App name}  
**Audience:** end-user | admin | ops  
**Last verified:** YYYY-MM-DD

## Goal
One sentence: what the reader can do after this guide.

## Prerequisites
- Account / role needed
- URL: https://...

## Steps
1. ...
2. ...

## Verify
How to confirm success.

## Related
- Links to sibling articles
```

## Seed articles (write first)

1. `erpnext/getting-started/login-and-desk.md`
2. `erpnext/how-to/create-customer.md`
3. `zammad/getting-started/open-a-ticket.md`
4. `zammad/how-to/customer-reply.md`
5. `portal/getting-started/sign-in.md`
6. `vaultwarden/getting-started/create-vault.md`
7. `dashboard/getting-started/use-app-tiles.md`
8. `site-admin/how-to/edit-a-page.md`
9. `authelia/getting-started/first-login.md`
10. `wiki/getting-started/find-an-article.md`

## Backlog (remaining apps)

- [ ] n8n — workflows for ops
- [ ] umami — reading site stats
- [ ] trmm — agent overview for techs
- [ ] marketlist / flooros / farmbot / cleaner / argo — demo-user guides
- [ ] rustdesk — install client + connect (no web UI)

## Implementation notes

- Store articles in custom-wiki DB (existing chapters/pages) or markdown under `content/help/` imported by seed script.
- Match marketing nav: Blog / Demos / Help.
- Do not invent product behavior — verify against live app before publishing.
