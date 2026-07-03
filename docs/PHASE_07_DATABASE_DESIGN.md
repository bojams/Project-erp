# PHASE 7: DATABASE DESIGN — Hideo ERP

---

**Engine:** InnoDB (MySQL 8+)
**Charset:** utf8mb4
**Collation:** utf8mb4_unicode_ci

---

## 7.1 Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Table name | snake_case, plural | `products`, `purchase_items` |
| Column name | snake_case | `product_name`, `stock_minimum` |
| Primary key | `id` (auto-increment BIGINT) | `id` |
| Foreign key | `{table}_id` | `category_id`, `supplier_id` |
| Timestamps | `created_at`, `updated_at` | — |
| Soft delete | `deleted_at` | — |
| Created by | `created_by` | — |
| Updated by | `updated_by` | — |
| Index prefix | `idx_{table}_{column}` | `idx_products_category_id` |
| Unique prefix | `uq_{table}_{column}` | `uq_products_sku` |

---

## 7.2 Table List

| No | Table Name | Module | Description |
|---|---|---|---|
| 1 | `users` | Auth | User accounts |
| 2 | `personal_access_tokens` | Auth | Sanctum tokens |
| 3 | `password_reset_tokens` | Auth | Reset password tokens |
| 4 | `permissions` | RBAC | Permission list (Spatie) |
| 5 | `roles` | RBAC | Role list (Spatie) |
| 6 | `model_has_permissions` | RBAC | User-to-permission (Spatie) |
| 7 | `model_has_roles` | RBAC | User-to-role (Spatie) |
| 8 | `role_has_permissions` | RBAC | Role-to-permission (Spatie) |
| 9 | `companies` | Settings | Company profile |
| 10 | `settings` | Settings | Application settings |
| 11 | `categories` | Product | Product categories |
| 12 | `units` | Product | Product units of measure |
| 13 | `products` | Product | Products |
| 14 | `suppliers` | Supplier | Suppliers |
| 15 | `customers` | Customer | Customers |
| 16 | `purchases` | Purchase | Purchase orders |
| 17 | `purchase_items` | Purchase | Purchase order line items |
| 18 | `sales` | Sales | Sales orders |
| 19 | `sale_items` | Sales | Sales order line items |
| 20 | `stock_movements` | Inventory | Stock movement history |
| 21 | `expense_categories` | Expense | Expense categories |
| 22 | `expenses` | Expense | Expenses |
| 23 | `notifications` | Notification | In-app notifications |
| 24 | `activity_logs` | Activity | User activity logs |
| 25 | `login_logs` | Activity | Login attempt logs |

**Total: 25 tables**

---

## 7.3 Column Definitions

### 7.3.1 `users`

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | BIGINT UNSIGNED | PK, Auto Increment | Primary key |
| company_id | BIGINT UNSIGNED | FK → companies.id, NULLABLE | Company association |
| name | VARCHAR(100) | NOT NULL | Full name |
| email | VARCHAR(255) | NOT NULL, UNIQUE | Email address |
| password | VARCHAR(255) | NOT NULL | Hashed password |
| phone | VARCHAR(20) | NULLABLE | Phone number |
| avatar | VARCHAR(255) | NULLABLE | Profile photo path |
| is_active | TINYINT(1) | NOT NULL, DEFAULT 1 | Active status |
| email_verified_at | TIMESTAMP | NULLABLE | Email verification |
| last_login_at | TIMESTAMP | NULLABLE | Last login timestamp |
| remember_token | VARCHAR(100) | NULLABLE | "Remember me" token |
| created_by | BIGINT UNSIGNED | FK → users.id, NULLABLE | Creator |
| updated_by | BIGINT UNSIGNED | FK → users.id, NULLABLE | Last updater |
| created_at | TIMESTAMP | NULLABLE | — |
| updated_at | TIMESTAMP | NULLABLE | — |
| deleted_at | TIMESTAMP | NULLABLE | Soft delete |

**Indexes:** `idx_users_company_id` (company_id), `idx_users_is_active` (is_active)
**Relationships:** belongsTo(Company), belongsToMany(Role), hasMany(ActivityLog)

---

### 7.3.2 `companies`

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | BIGINT UNSIGNED | PK, Auto Increment | Primary key |
| name | VARCHAR(200) | NOT NULL | Company name |
| address | TEXT | NULLABLE | Company address |
| phone | VARCHAR(20) | NULLABLE | Company phone |
| email | VARCHAR(255) | NULLABLE | Company email |
| logo | VARCHAR(255) | NULLABLE | Logo image path |
| tax_id | VARCHAR(50) | NULLABLE | NPWP / Tax ID |
| currency | VARCHAR(5) | NOT NULL, DEFAULT 'IDR' | Default currency |
| timezone | VARCHAR(50) | NOT NULL, DEFAULT 'Asia/Jakarta' | Timezone |
| date_format | VARCHAR(20) | NOT NULL, DEFAULT 'd/m/Y' | Date format |
| low_stock_threshold | INT | NOT NULL, DEFAULT 10 | Default low stock alert |
| is_active | TINYINT(1) | NOT NULL, DEFAULT 1 | Active status |
| created_by | BIGINT UNSIGNED | FK → users.id, NULLABLE | — |
| updated_by | BIGINT UNSIGNED | FK → users.id, NULLABLE | — |
| created_at | TIMESTAMP | NULLABLE | — |
| updated_at | TIMESTAMP | NULLABLE | — |
| deleted_at | TIMESTAMP | NULLABLE | Soft delete |

**Indexes:** `idx_companies_is_active` (is_active)

---

### 7.3.3 `settings`

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | BIGINT UNSIGNED | PK, Auto Increment | Primary key |
| company_id | BIGINT UNSIGNED | FK → companies.id, NULLABLE | Null = global |
| key | VARCHAR(100) | NOT NULL | Setting key |
| value | TEXT | NULLABLE | Setting value |
| group | VARCHAR(50) | NOT NULL | Setting group |
| created_at | TIMESTAMP | NULLABLE | — |
| updated_at | TIMESTAMP | NULLABLE | — |

**Indexes:** `uq_settings_company_key` (UNIQUE: company_id, key), `idx_settings_group` (group)

---

### 7.3.4 `categories`

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | BIGINT UNSIGNED | PK, Auto Increment | Primary key |
| company_id | BIGINT UNSIGNED | FK → companies.id | Company scope |
| name | VARCHAR(100) | NOT NULL | Category name |
| slug | VARCHAR(100) | NOT NULL | URL-friendly name |
| description | TEXT | NULLABLE | Description |
| is_active | TINYINT(1) | NOT NULL, DEFAULT 1 | Active status |
| created_by | BIGINT UNSIGNED | FK → users.id, NULLABLE | — |
| updated_by | BIGINT UNSIGNED | FK → users.id, NULLABLE | — |
| created_at | TIMESTAMP | NULLABLE | — |
| updated_at | TIMESTAMP | NULLABLE | — |
| deleted_at | TIMESTAMP | NULLABLE | Soft delete |

**Indexes:** `uq_categories_company_slug` (UNIQUE: company_id, slug), `idx_categories_company` (company_id)

---

### 7.3.5 `units`

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | BIGINT UNSIGNED | PK, Auto Increment | Primary key |
| company_id | BIGINT UNSIGNED | FK → companies.id | Company scope |
| name | VARCHAR(50) | NOT NULL | Unit name (e.g., Pieces) |
| short_code | VARCHAR(10) | NOT NULL | Short code (e.g., pcs) |
| is_active | TINYINT(1) | NOT NULL, DEFAULT 1 | Active status |
| created_by | BIGINT UNSIGNED | FK → users.id, NULLABLE | — |
| updated_by | BIGINT UNSIGNED | FK → users.id, NULLABLE | — |
| created_at | TIMESTAMP | NULLABLE | — |
| updated_at | TIMESTAMP | NULLABLE | — |
| deleted_at | TIMESTAMP | NULLABLE | Soft delete |

**Indexes:** `uq_units_company_short_code` (UNIQUE: company_id, short_code)

---

### 7.3.6 `products`

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | BIGINT UNSIGNED | PK, Auto Increment | Primary key |
| company_id | BIGINT UNSIGNED | FK → companies.id | Company scope |
| category_id | BIGINT UNSIGNED | FK → categories.id, NULLABLE | Product category |
| unit_id | BIGINT UNSIGNED | FK → units.id | Unit of measure |
| name | VARCHAR(200) | NOT NULL | Product name |
| sku | VARCHAR(50) | NOT NULL | Stock Keeping Unit |
| barcode | VARCHAR(100) | NULLABLE | Barcode number |
| description | TEXT | NULLABLE | Product description |
| purchase_price | DECIMAL(15,2) | NOT NULL, DEFAULT 0 | Purchase price |
| selling_price | DECIMAL(15,2) | NOT NULL, DEFAULT 0 | Selling price |
| stock | INTEGER | NOT NULL, DEFAULT 0 | Current stock quantity |
| stock_minimum | INTEGER | NOT NULL, DEFAULT 10 | Minimum stock alert |
| image | VARCHAR(255) | NULLABLE | Product image path |
| is_active | TINYINT(1) | NOT NULL, DEFAULT 1 | Active status |
| created_by | BIGINT UNSIGNED | FK → users.id, NULLABLE | — |
| updated_by | BIGINT UNSIGNED | FK → users.id, NULLABLE | — |
| created_at | TIMESTAMP | NULLABLE | — |
| updated_at | TIMESTAMP | NULLABLE | — |
| deleted_at | TIMESTAMP | NULLABLE | Soft delete |

**Indexes:**
- `uq_products_company_sku` (UNIQUE: company_id, sku)
- `idx_products_category_id` (category_id)
- `idx_products_unit_id` (unit_id)
- `idx_products_stock_minimum` (stock, stock_minimum) — for low stock queries
- `idx_products_name` (name) — for search

**Constraints:** CHECK (selling_price >= purchase_price)

---

### 7.3.7 `suppliers`

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | BIGINT UNSIGNED | PK, Auto Increment | Primary key |
| company_id | BIGINT UNSIGNED | FK → companies.id | Company scope |
| name | VARCHAR(200) | NOT NULL | Supplier name |
| contact_person | VARCHAR(100) | NULLABLE | Contact person name |
| phone | VARCHAR(20) | NULLABLE | Phone number |
| email | VARCHAR(255) | NULLABLE | Email address |
| address | TEXT | NULLABLE | Address |
| tax_id | VARCHAR(50) | NULLABLE | NPWP |
| is_active | TINYINT(1) | NOT NULL, DEFAULT 1 | Active status |
| created_by | BIGINT UNSIGNED | FK → users.id, NULLABLE | — |
| updated_by | BIGINT UNSIGNED | FK → users.id, NULLABLE | — |
| created_at | TIMESTAMP | NULLABLE | — |
| updated_at | TIMESTAMP | NULLABLE | — |
| deleted_at | TIMESTAMP | NULLABLE | Soft delete |

**Indexes:** `idx_suppliers_company_id` (company_id), `idx_suppliers_name` (name)

---

### 7.3.8 `customers`

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | BIGINT UNSIGNED | PK, Auto Increment | Primary key |
| company_id | BIGINT UNSIGNED | FK → companies.id | Company scope |
| name | VARCHAR(200) | NOT NULL | Customer name |
| contact_person | VARCHAR(100) | NULLABLE | Contact person |
| phone | VARCHAR(20) | NULLABLE | Phone number |
| email | VARCHAR(255) | NULLABLE | Email address |
| address | TEXT | NULLABLE | Address |
| is_active | TINYINT(1) | NOT NULL, DEFAULT 1 | Active status |
| created_by | BIGINT UNSIGNED | FK → users.id, NULLABLE | — |
| updated_by | BIGINT UNSIGNED | FK → users.id, NULLABLE | — |
| created_at | TIMESTAMP | NULLABLE | — |
| updated_at | TIMESTAMP | NULLABLE | — |
| deleted_at | TIMESTAMP | NULLABLE | Soft delete |

**Indexes:** `idx_customers_company_id` (company_id), `idx_customers_name` (name)

---

### 7.3.9 `purchases`

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | BIGINT UNSIGNED | PK, Auto Increment | Primary key |
| company_id | BIGINT UNSIGNED | FK → companies.id | Company scope |
| supplier_id | BIGINT UNSIGNED | FK → suppliers.id | Supplier |
| purchase_number | VARCHAR(50) | NOT NULL | Auto-generated PO number |
| status | ENUM('pending','approved','received','cancelled') | NOT NULL, DEFAULT 'pending' | PO status |
| order_date | DATE | NOT NULL | Order date |
| received_date | DATE | NULLABLE | Actual receive date |
| notes | TEXT | NULLABLE | Additional notes |
| subtotal | DECIMAL(15,2) | NOT NULL, DEFAULT 0 | Total before tax/discount |
| total | DECIMAL(15,2) | NOT NULL, DEFAULT 0 | Grand total |
| created_by | BIGINT UNSIGNED | FK → users.id, NULLABLE | — |
| approved_by | BIGINT UNSIGNED | FK → users.id, NULLABLE | Approver |
| updated_by | BIGINT UNSIGNED | FK → users.id, NULLABLE | — |
| created_at | TIMESTAMP | NULLABLE | — |
| updated_at | TIMESTAMP | NULLABLE | — |
| deleted_at | TIMESTAMP | NULLABLE | Soft delete |

**Indexes:**
- `uq_purchases_company_number` (UNIQUE: company_id, purchase_number)
- `idx_purchases_supplier_id` (supplier_id)
- `idx_purchases_status` (status)
- `idx_purchases_order_date` (order_date)
- `idx_purchases_company_status` (company_id, status)

**Constraints:** subtotal >= 0, total >= subtotal

---

### 7.3.10 `purchase_items`

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | BIGINT UNSIGNED | PK, Auto Increment | Primary key |
| purchase_id | BIGINT UNSIGNED | FK → purchases.id, ON DELETE CASCADE | Parent PO |
| product_id | BIGINT UNSIGNED | FK → products.id | Product |
| quantity | INTEGER | NOT NULL | Quantity ordered |
| received_quantity | INTEGER | NOT NULL, DEFAULT 0 | Quantity received |
| unit_price | DECIMAL(15,2) | NOT NULL | Price per unit |
| subtotal | DECIMAL(15,2) | NOT NULL | quantity * unit_price |
| created_at | TIMESTAMP | NULLABLE | — |
| updated_at | TIMESTAMP | NULLABLE | — |

**Indexes:**
- `idx_purchase_items_purchase_id` (purchase_id)
- `idx_purchase_items_product_id` (product_id)
- `uq_purchase_items_purchase_product` (UNIQUE: purchase_id, product_id) — prevents duplicate product

**Constraints:** quantity > 0, received_quantity <= quantity, unit_price >= 0

---

### 7.3.11 `sales`

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | BIGINT UNSIGNED | PK, Auto Increment | Primary key |
| company_id | BIGINT UNSIGNED | FK → companies.id | Company scope |
| customer_id | BIGINT UNSIGNED | FK → customers.id, NULLABLE | Customer (walk-in allowed) |
| sale_number | VARCHAR(50) | NOT NULL | Auto-generated SO number |
| invoice_number | VARCHAR(50) | NOT NULL | Auto-generated invoice number |
| status | ENUM('pending','completed','cancelled') | NOT NULL, DEFAULT 'pending' | SO status |
| payment_status | ENUM('unpaid','partial','paid') | NOT NULL, DEFAULT 'unpaid' | Payment status |
| amount_paid | DECIMAL(15,2) | NOT NULL, DEFAULT 0 | Amount already paid |
| order_date | DATE | NOT NULL | Order date |
| notes | TEXT | NULLABLE | Additional notes |
| subtotal | DECIMAL(15,2) | NOT NULL, DEFAULT 0 | Total before tax/discount |
| total | DECIMAL(15,2) | NOT NULL, DEFAULT 0 | Grand total |
| created_by | BIGINT UNSIGNED | FK → users.id, NULLABLE | — |
| updated_by | BIGINT UNSIGNED | FK → users.id, NULLABLE | — |
| created_at | TIMESTAMP | NULLABLE | — |
| updated_at | TIMESTAMP | NULLABLE | — |
| deleted_at | TIMESTAMP | NULLABLE | Soft delete |

**Indexes:**
- `uq_sales_company_sale_number` (UNIQUE: company_id, sale_number)
- `uq_sales_company_invoice_number` (UNIQUE: company_id, invoice_number)
- `idx_sales_customer_id` (customer_id)
- `idx_sales_status` (status)
- `idx_sales_payment_status` (payment_status)
- `idx_sales_order_date` (order_date)
- `idx_sales_company_status` (company_id, status)

**Constraints:** subtotal >= 0, total >= subtotal, amount_paid <= total

---

### 7.3.12 `sale_items`

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | BIGINT UNSIGNED | PK, Auto Increment | Primary key |
| sale_id | BIGINT UNSIGNED | FK → sales.id, ON DELETE CASCADE | Parent SO |
| product_id | BIGINT UNSIGNED | FK → products.id | Product |
| quantity | INTEGER | NOT NULL | Quantity sold |
| unit_price | DECIMAL(15,2) | NOT NULL | Price per unit |
| subtotal | DECIMAL(15,2) | NOT NULL | quantity * unit_price |
| created_at | TIMESTAMP | NULLABLE | — |
| updated_at | TIMESTAMP | NULLABLE | — |

**Indexes:**
- `idx_sale_items_sale_id` (sale_id)
- `idx_sale_items_product_id` (product_id)

**Constraints:** quantity > 0, unit_price >= 0

---

### 7.3.13 `stock_movements`

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | BIGINT UNSIGNED | PK, Auto Increment | Primary key |
| company_id | BIGINT UNSIGNED | FK → companies.id | Company scope |
| product_id | BIGINT UNSIGNED | FK → products.id | Product |
| type | ENUM('in','out','adjustment') | NOT NULL | Movement type |
| quantity | INTEGER | NOT NULL | Positive for in, negative for out |
| stock_before | INTEGER | NOT NULL | Stock before movement |
| stock_after | INTEGER | NOT NULL | Stock after movement |
| reference_type | VARCHAR(50) | NULLABLE | Source (purchase/sale/adjustment) |
| reference_id | BIGINT UNSIGNED | NULLABLE | Source ID |
| reason | TEXT | NULLABLE | Reason (for adjustment) |
| created_by | BIGINT UNSIGNED | FK → users.id, NULLABLE | Who performed |
| created_at | TIMESTAMP | NULLABLE | — |

**Indexes:**
- `idx_stock_movements_product_id` (product_id)
- `idx_stock_movements_type` (type)
- `idx_stock_movements_created_at` (created_at)
- `idx_stock_movements_reference` (reference_type, reference_id)
- `idx_stock_movements_product_type` (product_id, type)

---

### 7.3.14 `expense_categories`

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | BIGINT UNSIGNED | PK, Auto Increment | Primary key |
| company_id | BIGINT UNSIGNED | FK → companies.id | Company scope |
| name | VARCHAR(100) | NOT NULL | Category name |
| slug | VARCHAR(100) | NOT NULL | URL-friendly name |
| description | TEXT | NULLABLE | Description |
| is_active | TINYINT(1) | NOT NULL, DEFAULT 1 | Active status |
| created_by | BIGINT UNSIGNED | FK → users.id, NULLABLE | — |
| updated_by | BIGINT UNSIGNED | FK → users.id, NULLABLE | — |
| created_at | TIMESTAMP | NULLABLE | — |
| updated_at | TIMESTAMP | NULLABLE | — |
| deleted_at | TIMESTAMP | NULLABLE | Soft delete |

**Indexes:** `uq_expense_categories_company_slug` (UNIQUE: company_id, slug)

---

### 7.3.15 `expenses`

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | BIGINT UNSIGNED | PK, Auto Increment | Primary key |
| company_id | BIGINT UNSIGNED | FK → companies.id | Company scope |
| expense_category_id | BIGINT UNSIGNED | FK → expense_categories.id | Category |
| description | TEXT | NOT NULL | Expense description |
| amount | DECIMAL(15,2) | NOT NULL | Amount |
| expense_date | DATE | NOT NULL | Date of expense |
| receipt | VARCHAR(255) | NULLABLE | Receipt image path |
| created_by | BIGINT UNSIGNED | FK → users.id, NULLABLE | — |
| updated_by | BIGINT UNSIGNED | FK → users.id, NULLABLE | — |
| created_at | TIMESTAMP | NULLABLE | — |
| updated_at | TIMESTAMP | NULLABLE | — |
| deleted_at | TIMESTAMP | NULLABLE | Soft delete |

**Indexes:**
- `idx_expenses_company_id` (company_id)
- `idx_expenses_category_id` (expense_category_id)
- `idx_expenses_date` (expense_date)

**Constraints:** amount > 0

---

### 7.3.16 `notifications`

Uses Laravel's default `notifications` table structure.

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | CHAR(36) | PK | UUID |
| type | VARCHAR(255) | NOT NULL | Notification class |
| notifiable_type | VARCHAR(255) | NOT NULL | Morph model type |
| notifiable_id | BIGINT UNSIGNED | NOT NULL | Morph model ID |
| data | JSON | NOT NULL | Notification data |
| read_at | TIMESTAMP | NULLABLE | When read |
| created_at | TIMESTAMP | NULLABLE | — |
| updated_at | TIMESTAMP | NULLABLE | — |

**Indexes:** `idx_notifications_notifiable` (notifiable_type, notifiable_id)

---

### 7.3.17 `activity_logs`

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | BIGINT UNSIGNED | PK, Auto Increment | Primary key |
| company_id | BIGINT UNSIGNED | FK → companies.id | Company scope |
| user_id | BIGINT UNSIGNED | FK → users.id, NULLABLE | User who performed |
| action | VARCHAR(50) | NOT NULL | 'create', 'update', 'delete' |
| module | VARCHAR(50) | NOT NULL | Module name (e.g., 'product') |
| description | TEXT | NULLABLE | Human-readable description |
| old_values | JSON | NULLABLE | Previous values |
| new_values | JSON | NULLABLE | New values |
| ip_address | VARCHAR(45) | NULLABLE | IP address |
| user_agent | TEXT | NULLABLE | User agent string |
| created_at | TIMESTAMP | NULLABLE | — |

**Indexes:**
- `idx_activity_logs_company_id` (company_id)
- `idx_activity_logs_user_id` (user_id)
- `idx_activity_logs_action` (action)
- `idx_activity_logs_module` (module)
- `idx_activity_logs_created_at` (created_at)
- `idx_activity_logs_user_action` (user_id, action)

---

### 7.3.18 `login_logs`

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | BIGINT UNSIGNED | PK, Auto Increment | Primary key |
| user_id | BIGINT UNSIGNED | FK → users.id, NULLABLE | User (null if failed) |
| email | VARCHAR(255) | NOT NULL | Attempted email |
| ip_address | VARCHAR(45) | NULLABLE | IP address |
| user_agent | TEXT | NULLABLE | User agent |
| is_success | TINYINT(1) | NOT NULL | Login success/failed |
| failed_reason | VARCHAR(100) | NULLABLE | Failure reason |
| created_at | TIMESTAMP | NULLABLE | — |

**Indexes:**
- `idx_login_logs_user_id` (user_id)
- `idx_login_logs_email` (email)
- `idx_login_logs_created_at` (created_at)
- `idx_login_logs_success` (is_success)

---

## 7.4 Spatie RBAC Tables

### 7.4.1 `permissions`

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | BIGINT UNSIGNED | PK, Auto Increment | Primary key |
| name | VARCHAR(255) | NOT NULL | Permission name (e.g., 'view-products') |
| guard_name | VARCHAR(255) | NOT NULL, DEFAULT 'web' | Guard |
| created_at | TIMESTAMP | NULLABLE | — |
| updated_at | TIMESTAMP | NULLABLE | — |

**Indexes:** `uq_permissions_name_guard` (UNIQUE: name, guard_name)

### 7.4.2 `roles`

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | BIGINT UNSIGNED | PK, Auto Increment | Primary key |
| name | VARCHAR(255) | NOT NULL | Role name (e.g., 'super_admin') |
| guard_name | VARCHAR(255) | NOT NULL, DEFAULT 'web' | Guard |
| is_default | TINYINT(1) | NOT NULL, DEFAULT 0 | Flag for default roles |
| created_at | TIMESTAMP | NULLABLE | — |
| updated_at | TIMESTAMP | NULLABLE | — |

**Indexes:** `uq_roles_name_guard` (UNIQUE: name, guard_name)

### 7.4.3 `model_has_permissions`

| Column | Type | Constraints |
|---|---|---|
| permission_id | BIGINT UNSIGNED | FK → permissions.id, ON DELETE CASCADE |
| model_type | VARCHAR(255) | NOT NULL |
| model_id | BIGINT UNSIGNED | NOT NULL |

**PK:** (permission_id, model_id, model_type)

### 7.4.4 `model_has_roles`

| Column | Type | Constraints |
|---|---|---|
| role_id | BIGINT UNSIGNED | FK → roles.id, ON DELETE CASCADE |
| model_type | VARCHAR(255) | NOT NULL |
| model_id | BIGINT UNSIGNED | NOT NULL |

**PK:** (role_id, model_id, model_type)

### 7.4.5 `role_has_permissions`

| Column | Type | Constraints |
|---|---|---|
| permission_id | BIGINT UNSIGNED | FK → permissions.id, ON DELETE CASCADE |
| role_id | BIGINT UNSIGNED | FK → roles.id, ON DELETE CASCADE |

**PK:** (permission_id, role_id)

---

## 7.5 Relationships Summary

```
companies 1──* users
companies 1──* products
companies 1──* categories
companies 1──* units
companies 1──* suppliers
companies 1──* customers
companies 1──* purchases
companies 1──* sales
companies 1──* expenses
companies 1──* expense_categories
companies 1──* stock_movements
companies 1──* activity_logs
companies 1──* settings (nullable FK)

categories 1──* products
units      1──* products

suppliers  1──* purchases
purchases  1──* purchase_items
purchase_items *──1 products

customers  1──* sales (nullable)
sales      1──* sale_items
sale_items *──1 products

products   1──* stock_movements

expense_categories 1──* expenses

users (created_by) *──1 purchases
users (approved_by) *──1 purchases (nullable)
users (created_by) *──1 sales
users              1──* activity_logs
users              1──* login_logs
users              1──* notifications (polymorphic)
```

---

## 7.6 Multi-Company Isolation Strategy

Semua tabel data bisnis menggunakan `company_id` sebagai **foreign key** ke tabel `companies`.

**Query pattern:**
```php
// Global scope on all company-scoped models
protected static function booted(): void
{
    static::addGlobalScope('company', function (Builder $builder) {
        $builder->where('company_id', auth()->user()->company_id);
    });
}
```

**Keuntungan:**
- Isolasi data antar perusahaan
- Performa query lebih baik dengan company_id index
- Siap untuk multi-tenant di masa depan
- Tidak perlu tabel terpisah per tenant

---

--- _End of Phase 7 — Database Design_ ---
