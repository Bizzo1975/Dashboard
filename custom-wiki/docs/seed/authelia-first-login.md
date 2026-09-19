# First Authelia SSO login

**App:** Authelia  
**Audience:** end-user  
**Last verified:** 2026-08-07

## Goal
Complete the first SSO login so protected apps (dash, admin, erp, etc.) open.

## Prerequisites
- Account exists in LLDAP / Authelia
- URL: https://auth.kecktech.net

## Steps
1. Open a protected app (e.g. https://dash.kecktech.net)
2. You are redirected to Authelia
3. Enter username and password
4. Complete 2FA if enrolled
5. Return to the original app

## Verify
Refreshing the app no longer sends you to auth for this session.

## Related
- Apps Dashboard tiles
- ERPNext login
