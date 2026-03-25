# Custom App 09: Form Builder and Data Collection

## Replaces
JotForm, Typeform, Google Forms (business use)

## Core Features
- Drag-and-drop form builder with live preview
- Field types: text, textarea, number, email, phone, date, select, multi-select, checkbox, radio, file upload, signature, rating, matrix
- Conditional logic: show/hide fields based on other answers
- Multi-page forms with progress indicator
- Submission management dashboard with search and filtering
- Email notifications on submission (configurable recipients)
- Data export: CSV, JSON, Excel
- Embeddable on external websites (iframe and JS snippet)
- Form templates for common use cases
- Submission analytics (views, starts, completions, drop-off)
- Spam protection (honeypot + rate limiting)

## Data Model (Prisma)
```prisma
model Form {
  id            String       @id @default(uuid())
  title         String
  description   String?
  slug          String       @unique
  fields        FormField[]
  pages         FormPage[]
  submissions   Submission[]
  status        String       @default("draft") // draft, published, closed
  settings      Json         // notification emails, redirect URL, confirmation message
  theme         Json?        // colors, fonts, logo
  submitButton  String       @default("Submit")
  successMessage String      @default("Thank you for your submission!")
  redirectUrl   String?
  maxSubmissions Int?
  closesAt      DateTime?
  requiresAuth  Boolean      @default(false)
  createdBy     User         @relation(fields: [createdById], references: [id])
  createdById   String
  viewCount     Int          @default(0)
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt
}

model FormPage {
  id      String      @id @default(uuid())
  form    Form        @relation(fields: [formId], references: [id])
  formId  String
  title   String?
  order   Int
  fields  FormField[]
}

model FormField {
  id            String    @id @default(uuid())
  form          Form      @relation(fields: [formId], references: [id])
  formId        String
  page          FormPage? @relation(fields: [pageId], references: [id])
  pageId        String?
  type          String    // text, textarea, number, email, phone, date, select, multi_select, checkbox, radio, file, signature, rating, matrix, heading, paragraph
  label         String
  placeholder   String?
  helpText      String?
  required      Boolean   @default(false)
  order         Int
  options       Json?     // for select, radio, checkbox: [{label, value}]
  validation    Json?     // min, max, pattern, minLength, maxLength, fileTypes, maxFileSize
  conditionalLogic Json?  // {field: fieldId, operator: 'equals'|'not_equals'|'contains', value: '...'}
  defaultValue  String?
  width         String    @default("full") // full, half
}

model Submission {
  id          String   @id @default(uuid())
  form        Form     @relation(fields: [formId], references: [id])
  formId      String
  data        Json     // { fieldId: value, ... }
  files       SubmissionFile[]
  ipAddress   String?
  userAgent   String?
  isRead      Boolean  @default(false)
  isStarred   Boolean  @default(false)
  createdAt   DateTime @default(now())
}

model SubmissionFile {
  id           String     @id @default(uuid())
  submission   Submission @relation(fields: [submissionId], references: [id])
  submissionId String
  fieldId      String
  fileName     String
  fileUrl      String
  mimeType     String
  size         Int
  createdAt    DateTime   @default(now())
}
```

## Key Pages / Routes
```
# Builder / Admin
/forms                    — Form list with submission counts
/forms/new                — Create new form (opens builder)
/forms/[id]/edit          — Drag-and-drop form builder
/forms/[id]/submissions   — Submission list with search/filter
/forms/[id]/submissions/[sid] — Individual submission detail
/forms/[id]/analytics     — Views, completion rate, drop-off analysis
/forms/[id]/settings      — Notifications, embedding, closing rules
/forms/[id]/export        — Export submissions to CSV/JSON/Excel
/templates                — Form template library

# Public form rendering
/f/[slug]                 — Public form page (styled, responsive)
/f/[slug]/success         — Confirmation page after submission
```

## Form Builder UI
The builder should use a drag-and-drop interface with:
- Left sidebar: field type palette (drag to add)
- Center: form preview with click-to-edit fields
- Right sidebar: field properties panel (label, validation, logic)
- Use `@dnd-kit/sortable` for drag-and-drop
- Live preview toggle (builder vs. respondent view)

## Embed Options
```html
<!-- iframe embed -->
<iframe src="https://forms.kecktech.com/f/SLUG" width="100%" height="800" frameborder="0"></iframe>

<!-- JS embed (better integration) -->
<div id="kecktech-form-SLUG"></div>
<script src="https://forms.kecktech.com/embed.js" data-form="SLUG"></script>
```

## Client Customization Points
- Form theme: colors, fonts, logo, background
- Field types available (can restrict to simpler set for less technical clients)
- Notification recipients and templates
- File upload storage location and limits
- Custom confirmation pages
- Submission data retention policies
- Integration webhooks (send data to other systems on submit)
- Domain for hosted forms (client's own domain)
