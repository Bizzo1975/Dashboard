# Rocket.Chat Self-Hosted Chat Service — Project Prompt

## Objective
Deploy a self-hosted Discord-style chat service with persistent text channels, chat rooms, file sharing, and voice channels via Jitsi integration. Themed to match the Kecktech WordPress site.

## Architecture

### Docker Compose Stack
```yaml
services:
  rocketchat:
    image: registry.rocket.chat/rocketchat/rocket.chat:latest
    environment:
      - ROOT_URL=https://chat.kecktech.com
      - PORT=3000
      - MONGO_URL=mongodb://mongodb:27017/rocketchat?replicaSet=rs0
      - MONGO_OPLOG_URL=mongodb://mongodb:27017/local?replicaSet=rs0
      - DEPLOY_METHOD=docker
    volumes:
      - rc-uploads:/app/uploads
    ports:
      - "3100:3000"
    depends_on:
      - mongodb
  mongodb:
    image: mongo:6.0
    command: mongod --replSet rs0 --oplogSize 128
    volumes:
      - mongodata:/data/db
  mongo-init-replica:
    image: mongo:6.0
    command: >
      bash -c "sleep 10 && mongosh mongodb://mongodb:27017 --eval 'rs.initiate({_id: \"rs0\", members: [{_id: 0, host: \"mongodb:27017\"}]})'"
    depends_on:
      - mongodb
volumes:
  mongodata:
  rc-uploads:
```

### Jitsi Integration for Voice
```yaml
  jitsi-web:
    image: jitsi/web:stable
    environment:
      - ENABLE_AUTH=1
      - AUTH_TYPE=jwt
      - JWT_APP_ID=rocketchat
      - JWT_APP_SECRET=${JITSI_JWT_SECRET}
    ports:
      - "8443:443"
  jitsi-prosody:
    image: jitsi/prosody:stable
  jitsi-jicofo:
    image: jitsi/jicofo:stable
  jitsi-jvb:
    image: jitsi/jvb:stable
    ports:
      - "10000:10000/udp"
```

## Configuration Priorities

### Channel Structure (Initial Setup)
```
General Channels:
  #welcome          — Onboarding and introductions
  #announcements    — Company/community announcements (admin-only posting)
  #general          — Open discussion

Support Channels:
  #help-desk        — Client support requests
  #tech-support     — Technical questions

Team Channels:
  #dev              — Development discussion
  #projects         — Active project updates

Voice Channels:
  #voice-general    — Open voice room (via Jitsi)
  #voice-meetings   — Scheduled meeting room
```

### Role Configuration
```
Admin:
  - Full server administration
  - Channel creation and management
  - User management
  - Settings access

Moderator:
  - Pin/delete messages
  - Mute users
  - Manage channel topics
  - Cannot change server settings

Member:
  - Send messages in allowed channels
  - Upload files
  - Join voice channels
  - Create DMs

Guest:
  - Read-only access to public channels
  - Can DM admins/moderators
  - No file upload
```

### Theming
Rocket.Chat supports custom CSS via Admin → Layout → Custom CSS. Key areas to theme:
- Sidebar background and text colors
- Header bar styling
- Message bubble appearance
- Font family and sizes
- Accent colors for buttons and links
- Login page branding (logo, background)

```css
/* Example WordPress theme alignment */
:root {
  --rcx-color-primary: #YOUR_WP_PRIMARY;
  --rcx-color-primary-dark: #YOUR_WP_PRIMARY_DARK;
}

.sidebar {
  background-color: #YOUR_WP_SIDEBAR_BG;
}

.message {
  font-family: 'Your WP Font', sans-serif;
}
```

### Integrations to Configure
- **Webhooks:** Incoming webhooks for automated notifications (deploy alerts, monitoring)
- **Jitsi:** Voice/video calling from within channels
- **File Storage:** Configure S3-compatible storage (MinIO on Proxmox) for uploads if local disk is limited
- **SMTP:** Email notifications for mentions and DMs when users are offline
- **OAuth:** Optional SSO with existing authentication if other Kecktech services use shared auth

## Mobile Access
- Rocket.Chat has official iOS and Android apps
- Configure push notifications via Rocket.Chat push gateway (free for community edition)
- Apps connect to your self-hosted instance URL

## Monitoring and Maintenance
- MongoDB oplog monitoring (can grow quickly — set oplog size cap)
- Regular MongoDB backups: `mongodump --archive=/backups/rc-$(date +%Y%m%d).gz --gzip`
- Monitor disk usage on uploads volume
- Rocket.Chat admin panel has built-in room and user analytics

## When Working On This:
- Rocket.Chat requires MongoDB with replica set — even single-node needs `rs.initiate()`
- Always use the official Docker images from `registry.rocket.chat`
- Jitsi integration requires JWT auth configuration on both sides
- UDP port 10000 must be accessible for Jitsi video bridge (WebRTC media)
- Test voice channels from both LAN and external connections (STUN/TURN may be needed externally)
- Back up MongoDB before Rocket.Chat version upgrades
- Community Edition is fully functional — do not configure features that require Enterprise license
