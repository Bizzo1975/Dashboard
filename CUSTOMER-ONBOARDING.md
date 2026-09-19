# Customer Account Onboarding — Kecktech IT Solutions

This document describes the process for provisioning a new customer user account across the Kecktech stack, granting access to the Customer Portal, password vault, and relevant customer-facing data.

---

## Overview

Customer accounts use **LLDAP** for authentication (via Authelia SSO). A customer in the `kecktech_customers` group gets:

- **One-factor auth** access to `portal.kecktech.net`
- Access to their Vaultwarden collection (shared by staff)
- Linked records in Zammad and ERPNext for personalized portal data

---

## Step 1 — Create Customer Account in LLDAP

**Access:** `https://ldap.kecktech.net` (Tailscale required) — log in as `keckadmin`

1. Go to **Users → Create User**
2. Fill in:
   - **Username:** `firstname.lastname` (lowercase, no spaces)
   - **Email:** customer's email address
   - **Display Name:** Full name
   - **Password:** Generate a strong password (store in Step 3)
3. Save the user.
4. Go to the user's detail page → **Add to Group → `kecktech_customers`**

> **Note:** Do NOT add customers to `kecktech_admins` or `kecktech_ops`.

---

## Step 2 — Create LLDAP Group (one-time setup)

If the `kecktech_customers` group does not yet exist:

1. In LLDAP → **Groups → Create Group**
2. Name: `kecktech_customers`
3. Save.

Authelia's `configuration.yml` already includes the rule granting `kecktech_customers` one-factor access to `portal.kecktech.net`.

---

## Step 3 — Add Credentials to Vaultwarden

**Access:** `https://vault.kecktech.net` — log in as staff admin

1. Navigate to the appropriate **Customer Collection** (named after the client company).
2. Create a new **Login** item:
   - **Name:** `Customer Portal — {Customer Name}`
   - **Username:** LLDAP username from Step 1
   - **Password:** Password generated in Step 1
   - **URL:** `https://portal.kecktech.net`
3. Save. Optionally share the collection with the customer if they have a Vaultwarden account.

> If the customer does not have a Vaultwarden org seat, share credentials securely via an encrypted message or in-person handoff.

---

## Step 4 — Verify Zammad Account

**Access:** `https://tickets.kecktech.net` — log in as admin

1. Go to **Admin → Users → Search** for the customer's email.
2. If no Zammad account exists, create one:
   - **Email:** same as LLDAP email
   - **Name:** Full name
   - **Role:** Customer
3. Assign to the correct **Organization** in Zammad (matches company name).

The Customer Portal reads Zammad tickets filtered by the authenticated user's email (injected by Authelia's `remote-email` header).

---

## Step 5 — Verify ERPNext Customer Record

**Access:** `https://ops.kecktech.net` — log in as ERPNext admin

1. Go to **CRM → Customers → Search** for the customer's company name.
2. Ensure a **Customer** record exists with the correct name.
3. Verify at least one **Sales Invoice** is linked to this customer.

The Customer Portal fetches invoices from ERPNext's API using the customer's display name as the filter.

---

## Step 6 — Test Access

1. Open a private/incognito browser window.
2. Navigate to `https://portal.kecktech.net`.
3. Authelia will redirect to the login page — log in with the customer's LLDAP credentials.
4. Verify:
   - Welcome banner shows the correct name.
   - Support tickets appear (if any exist in Zammad).
   - Invoices appear (if any exist in ERPNext).

---

## Admin Testing Access

Admin accounts (`kecktech_admins` group) have **two-factor** access to `portal.kecktech.net`. Use the `keckadmin` account with an enrolled TOTP device to test the portal without creating a test customer account.

---

## Off-boarding a Customer

1. **LLDAP:** Remove user from `kecktech_customers` group or disable/delete the account.
2. **Vaultwarden:** Revoke collection share or delete customer credentials.
3. **Zammad:** Set customer user to inactive.
4. **ERPNext:** No action required (historical invoices remain).

---

## Required Environment Variables (`.env`)

The following variables must be set in `docker/.env` for the Customer Portal to function:

```env
# Zammad API (for ticket fetching)
ZAMMAD_API_TOKEN=your_zammad_api_token

# ERPNext API (for invoice fetching)
ERPNEXT_API_KEY=your_erpnext_api_key
ERPNEXT_API_SECRET=your_erpnext_api_secret
```

To generate a Zammad API token: `Admin → API → Access Tokens → New Token`  
To generate ERPNext API keys: `Settings → My Account → API Access → Generate Keys`

---

*Last updated: March 2026*
