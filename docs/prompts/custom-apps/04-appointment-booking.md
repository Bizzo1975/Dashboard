# Custom App 04: Appointment / Booking System

## Replaces
Calendly, Acuity Scheduling, Square Appointments

## Core Features
- Calendar view with real-time availability management
- Embeddable booking widget for client websites (iframe or JS embed)
- Service types with duration, pricing, and buffer times
- Automated email and SMS confirmations and reminders
- Staff scheduling with individual availability profiles
- Client self-service: book, reschedule, cancel
- Stripe integration for paid appointments
- Timezone-aware scheduling
- Recurring appointment support
- Waitlist for fully-booked slots

## Data Model (Prisma)
```prisma
model Service {
  id            String   @id @default(uuid())
  name          String
  description   String?
  duration      Int      // minutes
  bufferBefore  Int      @default(0) // minutes
  bufferAfter   Int      @default(15) // minutes
  price         Decimal? // null = free
  currency      String   @default("USD")
  color         String?
  isActive      Boolean  @default(true)
  maxAdvanceDays Int     @default(60)
  minNoticeMins Int      @default(60) // minimum booking notice
  appointments  Appointment[]
  staffServices StaffService[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Staff {
  id            String   @id @default(uuid())
  user          User     @relation(fields: [userId], references: [id])
  userId        String   @unique
  displayName   String
  bio           String?
  timezone      String   @default("America/Chicago")
  availability  Availability[]
  staffServices StaffService[]
  appointments  Appointment[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model StaffService {
  id        String  @id @default(uuid())
  staff     Staff   @relation(fields: [staffId], references: [id])
  staffId   String
  service   Service @relation(fields: [serviceId], references: [id])
  serviceId String
  @@unique([staffId, serviceId])
}

model Availability {
  id        String @id @default(uuid())
  staff     Staff  @relation(fields: [staffId], references: [id])
  staffId   String
  dayOfWeek Int    // 0=Sunday, 6=Saturday
  startTime String // "09:00"
  endTime   String // "17:00"
}

model Appointment {
  id              String   @id @default(uuid())
  service         Service  @relation(fields: [serviceId], references: [id])
  serviceId       String
  staff           Staff    @relation(fields: [staffId], references: [id])
  staffId         String
  clientName      String
  clientEmail     String
  clientPhone     String?
  startTime       DateTime
  endTime         DateTime
  timezone        String
  status          String   @default("confirmed") // confirmed, cancelled, completed, no_show
  notes           String?  // client notes
  internalNotes   String?  // staff notes
  price           Decimal?
  stripePaymentId String?
  remindersSent   Int      @default(0)
  cancelToken     String   @unique @default(uuid()) // for self-service cancel link
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  cancelledAt     DateTime?
}

model BlockedTime {
  id        String   @id @default(uuid())
  staff     Staff    @relation(fields: [staffId], references: [id])
  staffId   String
  startTime DateTime
  endTime   DateTime
  reason    String?
  createdAt DateTime @default(now())
}
```

## Key Pages / Routes
```
/dashboard                  — Today's appointments, upcoming, stats
/calendar                   — Full calendar view (day/week/month) with appointments
/appointments               — Appointment list with filters
/appointments/[id]          — Appointment detail, notes, reschedule/cancel
/services                   — Service type management
/staff                      — Staff list, availability configuration
/staff/[id]/availability    — Set weekly availability schedule
/clients                    — Client history and booking records
/settings                   — Business hours, timezone, notification templates
/settings/embed             — Get embed code for booking widget

# Public routes (no auth)
/book                       — Public booking page (select service → staff → time → confirm)
/book/[cancelToken]/cancel  — Self-service cancellation
/book/[cancelToken]/reschedule — Self-service reschedule
```

## Booking Widget (Embeddable)
```html
<!-- Client embeds this on their website -->
<iframe
  src="https://booking.kecktech.com/book?business=CLIENT_ID"
  width="100%"
  height="600"
  frameborder="0"
></iframe>

<!-- Or JS embed for better integration -->
<div id="kecktech-booking"></div>
<script src="https://booking.kecktech.com/embed.js" data-business="CLIENT_ID"></script>
```

## Availability Calculation Logic
```typescript
// Pseudocode for available slots
function getAvailableSlots(staffId, serviceId, date) {
  1. Get staff availability for day of week
  2. Get all existing appointments for that day (including buffers)
  3. Get all blocked times for that day
  4. Generate time slots based on service duration
  5. Remove slots that overlap with existing appointments or blocks
  6. Remove slots that violate minimum notice requirement
  7. Return available slots with timezone conversion
}
```

## Notification System
- **Booking confirmation:** Email + optional SMS immediately after booking
- **Reminder 1:** 24 hours before appointment
- **Reminder 2:** 1 hour before appointment (optional)
- **Cancellation notice:** To both client and staff
- **Reschedule notice:** To both client and staff
- Use: Nodemailer for email, Twilio for SMS

## Client Customization Points
- Service types, durations, pricing
- Staff profiles and availability
- Buffer times between appointments
- Advance booking window
- Minimum booking notice
- Reminder timing and frequency
- Booking widget colors and branding
- Cancellation policy (how late can they cancel?)
- Payment: required upfront, optional, or free
- Timezone defaults
