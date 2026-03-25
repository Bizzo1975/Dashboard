# PeerTube Video/Audio Platform with Paywall — Project Prompt

## Objective
Deploy a self-hosted video and audio hosting platform with HLS adaptive streaming, content management, and a paywall system for premium content. All media stored and served from Kecktech infrastructure.

## Architecture Overview

### Components
1. **PeerTube** — Core media engine (upload, transcode, stream, manage)
2. **Paywall Proxy** — Access control layer between users and premium content
3. **Stripe Integration** — Payment processing for subscriptions and one-time purchases
4. **PostgreSQL** — Shared database for PeerTube and paywall metadata
5. **Redis** — Caching and session management
6. **FFmpeg** — Transcoding engine (bundled with PeerTube)

### Deployment Architecture
```
User → Cloudflare Tunnel → Nginx Reverse Proxy
  ├── /video/* → PeerTube (public content)
  ├── /premium/* → Paywall Proxy → PeerTube (gated content)
  └── /api/payments/* → Stripe Webhook Handler
```

## Phase 1: PeerTube Deployment (Weeks 1-2)

### Docker Compose Stack
```yaml
services:
  peertube:
    image: chocobozzz/peertube:production-bookworm
    environment:
      - PEERTUBE_DB_USERNAME=peertube
      - PEERTUBE_DB_PASSWORD=${PT_DB_PASS}
      - PEERTUBE_DB_HOSTNAME=peertube-db
      - PEERTUBE_REDIS_HOSTNAME=peertube-redis
      - PEERTUBE_WEBSERVER_HOSTNAME=video.kecktech.com
      - PEERTUBE_WEBSERVER_PORT=443
      - PEERTUBE_WEBSERVER_HTTPS=true
      - PEERTUBE_SMTP_HOSTNAME=${SMTP_HOST}
    volumes:
      - ./data:/data
      - ./config:/config
    ports:
      - "9000:9000"
    depends_on:
      - peertube-db
      - peertube-redis
  peertube-db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_DB=peertube
      - POSTGRES_USER=peertube
      - POSTGRES_PASSWORD=${PT_DB_PASS}
    volumes:
      - pgdata:/var/lib/postgresql/data
  peertube-redis:
    image: redis:7-alpine
    volumes:
      - redisdata:/data
volumes:
  pgdata:
  redisdata:
```

### PeerTube Configuration Priorities
- Disable federation (internal use only, can re-enable later)
- Configure transcoding: 480p, 720p, 1080p profiles
- Enable HLS streaming (disable WebTorrent for internal use)
- Set storage paths to expandable volume/NAS mount
- Configure upload limits (adjust for audio vs video)
- Apply CSS theming to match WordPress site
- Create channel structure (public, premium categories)
- Set up admin and content creator accounts

### Audio Content Support
PeerTube handles audio natively. Audio uploads get:
- Automatic waveform visualization player
- Same metadata system as video (title, description, tags, chapters)
- Same API endpoints — no separate audio handling needed
- Transcoding to standard audio formats

## Phase 2: Paywall Proxy — Nginx Auth (Week 3)

### Architecture
```nginx
# Nginx auth subrequest pattern
location /premium/ {
    auth_request /auth/verify;
    auth_request_set $auth_status $upstream_status;
    error_page 401 = @paywall_redirect;
    proxy_pass http://peertube:9000;
}

location = /auth/verify {
    internal;
    proxy_pass http://paywall-api:3001/api/verify-access;
    proxy_pass_request_body off;
    proxy_set_header Content-Length "";
    proxy_set_header X-Original-URI $request_uri;
    proxy_set_header Cookie $http_cookie;
}

location @paywall_redirect {
    return 302 /subscribe?redirect=$request_uri;
}
```

### Paywall API Service (Node.js/Express or Next.js API Routes)
```typescript
// Core paywall data model
interface Subscription {
  id: string;
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  plan: 'monthly' | 'annual' | 'lifetime';
  status: 'active' | 'cancelled' | 'past_due';
  currentPeriodEnd: Date;
  createdAt: Date;
}

interface Purchase {
  id: string;
  userId: string;
  videoId: string;          // PeerTube video UUID
  stripePaymentIntentId: string;
  amount: number;
  purchasedAt: Date;
}

// Verification endpoint
// GET /api/verify-access
// Checks: valid session → active subscription OR individual purchase for requested video
// Returns: 200 (allowed) or 401 (denied)
```

### Stripe Integration Points
- **Checkout Session** — Create for new subscriptions or one-time purchases
- **Webhook Handler** — Process `checkout.session.completed`, `invoice.paid`, `customer.subscription.deleted`, `invoice.payment_failed`
- **Customer Portal** — Link to Stripe's hosted portal for subscription management
- **Price IDs** — Configure in environment variables, not hardcoded

## Phase 3: Next.js Paywall Gateway (Weeks 5-6, Optional Enhancement)

### When to build this:
- When you need a branded subscriber dashboard
- When the content library exceeds ~50 premium items
- When you want search/filter/recommendation features for premium content

### Features:
- User registration and login (NextAuth.js)
- Subscriber dashboard (purchased content, subscription status)
- Content browser with free/premium indicators
- PeerTube embed player (only rendered after access verification)
- Stripe subscription management
- Themed to match WordPress site exactly

## Storage Planning

### Transcoding Storage Multiplier
A single uploaded video generates multiple transcoded versions:
- 480p + 720p + 1080p ≈ 3-4x the original file size
- 1 hour of 1080p source ≈ 2-4 GB → 6-16 GB after transcoding
- Audio files: minimal, ~50-100 MB per hour after transcoding

### Storage Strategy
- Mount NAS/external storage at `/data/videos` for media files
- Keep PostgreSQL and config on fast local SSD
- Implement cleanup policy for failed/orphaned transcodes
- Monitor disk usage with alerts at 80% threshold

## When Working On This:
- PeerTube's API is comprehensive — use it for all content management operations
- Never store Stripe secrets in code; use environment variables exclusively
- Test paywall with Stripe test mode before going live
- Ensure HLS streams work across browsers (Safari requires specific CORS headers)
- Plan for storage growth — video libraries expand quickly
- Consider CDN caching via Cloudflare for public content to reduce origin load
