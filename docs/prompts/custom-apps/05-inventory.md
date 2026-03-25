# Custom App 05: Inventory Management System

## Replaces
inFlow, Sortly, Cin7

## Core Features
- Product catalog with SKUs, categories, images, and variants
- Real-time stock level tracking with low-stock alerts
- Purchase orders: create, receive, partial receipt
- Barcode/QR code scanning support (camera or handheld scanner)
- Multi-location inventory (warehouses, stores, vehicles)
- Stock transfers between locations
- Stock adjustments with reason tracking
- Reporting: stock valuation, movement history, reorder suggestions
- Supplier management
- CSV bulk import/export

## Data Model (Prisma)
```prisma
model Product {
  id          String    @id @default(uuid())
  name        String
  sku         String    @unique
  barcode     String?   @unique
  description String?
  category    Category? @relation(fields: [categoryId], references: [id])
  categoryId  String?
  unit        String    @default("each") // each, box, kg, lbs, etc.
  costPrice   Decimal?
  sellPrice   Decimal?
  imageUrl    String?
  isActive    Boolean   @default(true)
  minStock    Int       @default(0) // low stock alert threshold
  variants    ProductVariant[]
  stockLevels StockLevel[]
  movements   StockMovement[]
  poItems     PurchaseOrderItem[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  deletedAt   DateTime?
}

model ProductVariant {
  id          String   @id @default(uuid())
  product     Product  @relation(fields: [productId], references: [id])
  productId   String
  name        String   // e.g. "Large / Red"
  sku         String   @unique
  barcode     String?  @unique
  costPrice   Decimal?
  sellPrice   Decimal?
  stockLevels StockLevel[]
  createdAt   DateTime @default(now())
}

model Category {
  id       String    @id @default(uuid())
  name     String
  parent   Category? @relation("CategoryTree", fields: [parentId], references: [id])
  parentId String?
  children Category[] @relation("CategoryTree")
  products Product[]
}

model Location {
  id          String       @id @default(uuid())
  name        String
  address     String?
  type        String       @default("warehouse") // warehouse, store, vehicle
  isActive    Boolean      @default(true)
  stockLevels StockLevel[]
}

model StockLevel {
  id          String          @id @default(uuid())
  product     Product         @relation(fields: [productId], references: [id])
  productId   String
  variant     ProductVariant? @relation(fields: [variantId], references: [id])
  variantId   String?
  location    Location        @relation(fields: [locationId], references: [id])
  locationId  String
  quantity    Int             @default(0)
  updatedAt   DateTime        @updatedAt
  @@unique([productId, variantId, locationId])
}

model StockMovement {
  id            String   @id @default(uuid())
  product       Product  @relation(fields: [productId], references: [id])
  productId     String
  type          String   // received, sold, adjusted, transferred, returned
  quantity      Int      // positive = in, negative = out
  fromLocation  String?
  toLocation    String?
  reason        String?  // for adjustments
  reference     String?  // PO number, sale ID, transfer ID
  user          User     @relation(fields: [userId], references: [id])
  userId        String
  createdAt     DateTime @default(now())
}

model Supplier {
  id          String          @id @default(uuid())
  name        String
  contactName String?
  email       String?
  phone       String?
  address     String?
  notes       String?
  orders      PurchaseOrder[]
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt
}

model PurchaseOrder {
  id          String              @id @default(uuid())
  poNumber    String              @unique
  supplier    Supplier            @relation(fields: [supplierId], references: [id])
  supplierId  String
  status      String              @default("draft") // draft, sent, partial, received, cancelled
  items       PurchaseOrderItem[]
  subtotal    Decimal
  tax         Decimal             @default(0)
  total       Decimal
  notes       String?
  orderedAt   DateTime?
  expectedAt  DateTime?
  receivedAt  DateTime?
  createdAt   DateTime            @default(now())
  updatedAt   DateTime            @updatedAt
}

model PurchaseOrderItem {
  id              String        @id @default(uuid())
  purchaseOrder   PurchaseOrder @relation(fields: [purchaseOrderId], references: [id])
  purchaseOrderId String
  product         Product       @relation(fields: [productId], references: [id])
  productId       String
  quantityOrdered Int
  quantityReceived Int          @default(0)
  unitCost        Decimal
  total           Decimal
}
```

## Key Pages / Routes
```
/dashboard                — Stock overview, low-stock alerts, recent movements
/products                 — Product catalog with search, filter by category
/products/new             — Add product (details, pricing, images, variants)
/products/[id]            — Product detail with stock levels per location
/products/scan            — Barcode scanner page (camera-based)
/categories               — Category tree management
/inventory                — Stock levels matrix (products × locations)
/inventory/adjust         — Stock adjustment form with reason
/inventory/transfer       — Inter-location transfer form
/movements                — Stock movement history with filtering
/purchase-orders          — PO list with status filters
/purchase-orders/new      — Create PO from supplier
/purchase-orders/[id]     — PO detail, receive items
/suppliers                — Supplier directory
/reports                  — Valuation report, movement summary, reorder report
/settings/locations       — Location management
```

## Barcode Scanning
- Use `quagga2` or `html5-qrcode` library for camera-based scanning
- Support Code 128, EAN-13, UPC-A, QR Code formats
- Scan → lookup product → quick action (adjust stock, add to PO, view details)
- Also support USB/Bluetooth handheld scanners (they type the barcode into a focused input)

## Client Customization Points
- Product fields and variants structure
- Location types and count
- Barcode format preferences
- Unit types (each, weight-based, volume-based)
- Low-stock alert thresholds and notification channels
- PO approval workflow (optional)
- Reporting periods and custom report fields
- Integration with POS or e-commerce (future)
