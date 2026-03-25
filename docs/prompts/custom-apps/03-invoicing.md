# Custom App 03: Invoicing and Billing System

## Replaces
QuickBooks Invoicing, FreshBooks, Wave

## Core Features
- Invoice creation with line items, tax rates, and discounts
- Recurring invoice scheduling (weekly, monthly, quarterly, annual)
- Payment tracking: paid, pending, overdue with aging reports
- Client portal: invoice viewing, payment submission, history
- PDF generation with customizable templates
- Stripe and payment gateway integration for online payments
- Expense tracking with receipt upload
- Profit/loss and revenue reports
- Multi-currency support
- Email notifications: invoice sent, payment received, overdue reminders

## Data Model (Prisma)
```prisma
model Client {
  id          String    @id @default(uuid())
  name        String
  email       String
  phone       String?
  address     String?
  city        String?
  state       String?
  zip         String?
  country     String    @default("US")
  taxId       String?
  notes       String?
  invoices    Invoice[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  deletedAt   DateTime?
}

model Invoice {
  id              String        @id @default(uuid())
  invoiceNumber   String        @unique
  client          Client        @relation(fields: [clientId], references: [id])
  clientId        String
  status          String        @default("draft") // draft, sent, viewed, paid, overdue, cancelled
  issueDate       DateTime      @default(now())
  dueDate         DateTime
  lineItems       LineItem[]
  subtotal        Decimal
  taxRate         Decimal       @default(0)
  taxAmount       Decimal       @default(0)
  discountPercent Decimal       @default(0)
  discountAmount  Decimal       @default(0)
  total           Decimal
  currency        String        @default("USD")
  notes           String?       // displayed on invoice
  internalNotes   String?       // not shown to client
  payments        Payment[]
  amountPaid      Decimal       @default(0)
  amountDue       Decimal       // total - amountPaid
  recurringConfig RecurringInvoice?
  pdfUrl          String?
  sentAt          DateTime?
  viewedAt        DateTime?
  paidAt          DateTime?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}

model LineItem {
  id          String  @id @default(uuid())
  invoice     Invoice @relation(fields: [invoiceId], references: [id], onDelete: Cascade)
  invoiceId   String
  description String
  quantity    Decimal
  unitPrice   Decimal
  amount      Decimal // quantity * unitPrice
  order       Int     @default(0)
}

model Payment {
  id                  String   @id @default(uuid())
  invoice             Invoice  @relation(fields: [invoiceId], references: [id])
  invoiceId           String
  amount              Decimal
  method              String   // stripe, check, cash, bank_transfer, other
  stripePaymentId     String?
  reference           String?  // check number, transfer ref
  notes               String?
  receivedAt          DateTime @default(now())
  createdAt           DateTime @default(now())
}

model RecurringInvoice {
  id          String   @id @default(uuid())
  invoice     Invoice  @relation(fields: [templateInvoiceId], references: [id])
  templateInvoiceId String @unique
  frequency   String   // weekly, biweekly, monthly, quarterly, annual
  nextDate    DateTime
  endDate     DateTime?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
}

model Expense {
  id          String   @id @default(uuid())
  description String
  amount      Decimal
  category    String
  vendor      String?
  date        DateTime
  receiptUrl  String?
  notes       String?
  user        User     @relation(fields: [userId], references: [id])
  userId      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## Key Pages / Routes
```
/dashboard               — Revenue summary, outstanding invoices, recent payments
/invoices                — Invoice list with status filters, search, date range
/invoices/new            — Create invoice (line items, client select, tax/discount)
/invoices/[id]           — Invoice detail, payment history, actions (send, record payment)
/invoices/[id]/pdf       — PDF preview/download
/clients                 — Client list with outstanding balance summary
/clients/[id]            — Client detail with invoice history
/recurring               — Recurring invoice configurations
/expenses                — Expense list with category filtering
/expenses/new            — Log new expense with receipt upload
/reports                 — Revenue by period, aging report, profit/loss, tax summary
/settings/invoice-template — Customize invoice PDF appearance
/settings/tax-rates      — Configure tax rates
/settings/payment        — Stripe/payment gateway configuration
/portal/[token]          — Client portal: view invoice, make payment (public, no auth required)
```

## PDF Generation
- Use `@react-pdf/renderer` or `puppeteer` for PDF generation
- Template should include: company logo, invoice number, dates, client info, line items table, totals, payment instructions, terms
- Customizable per client deployment (logo, colors, footer text, terms)

## Stripe Integration
```typescript
// Create payment link for invoice
const session = await stripe.checkout.sessions.create({
  mode: 'payment',
  line_items: [{
    price_data: {
      currency: invoice.currency.toLowerCase(),
      product_data: { name: `Invoice ${invoice.invoiceNumber}` },
      unit_amount: Math.round(Number(invoice.amountDue) * 100),
    },
    quantity: 1,
  }],
  success_url: `${BASE_URL}/portal/${token}?paid=true`,
  cancel_url: `${BASE_URL}/portal/${token}`,
  metadata: { invoiceId: invoice.id },
});

// Webhook: checkout.session.completed → record payment, update invoice status
```

## Automated Workflows
- Invoice sent → email with PDF attachment and payment link
- Payment received → email receipt to client, update invoice status
- Invoice overdue → automated reminder emails (configurable: 1 day, 7 days, 14 days, 30 days)
- Recurring invoice → auto-generate and send on schedule

## Client Customization Points
- Invoice number format and prefix
- Default payment terms (Net 15, 30, 60, etc.)
- Tax rate configuration (single or multi-rate)
- Invoice PDF template (layout, logo, colors, footer)
- Overdue reminder schedule and wording
- Payment methods accepted
- Currency and locale settings
- Expense categories
