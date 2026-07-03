# PHASE 10: API DESIGN — Hideo ERP

---

**Base URL:** `/api/v1`
**Format:** JSON
**Auth:** Bearer Token (Sanctum)

---

## 10.1 Authentication API

### POST /auth/login
Login dengan email dan password.

**Request:**
```json
{
    "email": "admin@hideoerp.com",
    "password": "password123",
    "device_name": "Chrome 120 - Windows"
}
```

**Validation Rules:**
| Field | Rules |
|---|---|
| email | required, string, email, max:255 |
| password | required, string, min:8 |
| device_name | sometimes, string, max:255 |

**Response (200):**
```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "user": {
            "id": 1,
            "name": "Super Admin",
            "email": "admin@hideoerp.com",
            "avatar": null,
            "role": "super_admin",
            "permissions": ["view-dashboard", "view-products", "..."]
        },
        "token": "1|abc123def456..."
    }
}
```

**Response (401):**
```json
{
    "success": false,
    "message": "Invalid email or password"
}
```

---

### POST /auth/logout
Revoke token.

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
    "success": true,
    "message": "Logged out successfully"
}
```

---

### POST /auth/forgot-password
Kirim link reset password.

**Request:**
```json
{
    "email": "admin@hideoerp.com"
}
```

**Validation Rules:**
| Field | Rules |
|---|---|
| email | required, string, email, exists:users,email |

**Response (200):**
```json
{
    "success": true,
    "message": "Password reset link sent to your email"
}
```

---

### POST /auth/reset-password
Reset password dengan token.

**Request:**
```json
{
    "email": "admin@hideoerp.com",
    "token": "reset-token-here",
    "password": "newpassword123",
    "password_confirmation": "newpassword123"
}
```

**Validation Rules:**
| Field | Rules |
|---|---|
| email | required, string, email |
| token | required, string |
| password | required, string, min:8, confirmed |

---

## 10.2 Profile API

### GET /profile
**Auth:** Bearer Token

**Response (200):**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "name": "Super Admin",
        "email": "admin@hideoerp.com",
        "phone": "08123456789",
        "avatar": "https://storage.hideoerp.com/avatars/user1.jpg",
        "role": "super_admin",
        "company": {
            "id": 1,
            "name": "Hideo Corp",
            "logo": "..."
        }
    }
}
```

---

### PUT /profile
Update profil.

**Request:**
```json
{
    "name": "Super Admin Updated",
    "phone": "08123456789",
    "avatar": "base64-encoded-image"
}
```

**Validation Rules:**
| Field | Rules |
|---|---|
| name | sometimes, string, max:100 |
| phone | sometimes, string, max:20 |
| avatar | sometimes, image, max:2048, mimes:jpg,jpeg,png,webp |

---

### PUT /profile/change-password
**Request:**
```json
{
    "current_password": "oldpassword123",
    "password": "newpassword123",
    "password_confirmation": "newpassword123"
}
```

**Validation Rules:**
| Field | Rules |
|---|---|
| current_password | required, string |
| password | required, string, min:8, confirmed, different:current_password |

---

## 10.3 Dashboard API

### GET /dashboard
**Auth:** Bearer Token
**Permission:** `view-dashboard`

**Response (200):**
```json
{
    "success": true,
    "data": {
        "revenue": {
            "today": 5000000,
            "this_week": 35000000,
            "this_month": 150000000,
            "percentage_change": 12.5
        },
        "expense": {
            "today": 500000,
            "this_month": 15000000
        },
        "statistics": {
            "total_products": 150,
            "total_customers": 85,
            "total_suppliers": 25,
            "total_sales_today": 12
        },
        "low_stock_products": [
            {
                "id": 1,
                "name": "Product A",
                "stock": 2,
                "stock_minimum": 10,
                "unit": "pcs"
            }
        ],
        "recent_activities": [
            {
                "id": 100,
                "user": { "id": 1, "name": "Super Admin" },
                "action": "create",
                "module": "sale",
                "description": "Created sales order SO-20260624-0005",
                "created_at": "2026-06-24T10:30:00Z"
            }
        ]
    }
}
```

---

## 10.4 User Management API

### GET /users
**Auth:** Bearer Token
**Permission:** `view-users`

**Query Parameters:**
| Param | Type | Default | Description |
|---|---|---|---|
| search | string | null | Search by name or email |
| role | string | null | Filter by role name |
| is_active | boolean | null | Filter by active status |
| per_page | int | 15 | Items per page |
| page | int | 1 | Page number |
| sort_by | string | id | Sort column |
| sort_order | string | desc | asc or desc |

**Response (200):**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "name": "Super Admin",
            "email": "admin@hideoerp.com",
            "phone": "08123456789",
            "avatar": null,
            "is_active": true,
            "role": "super_admin",
            "last_login_at": "2026-06-24T09:00:00Z",
            "created_at": "2026-01-01T00:00:00Z"
        }
    ],
    "meta": {
        "current_page": 1,
        "last_page": 5,
        "per_page": 15,
        "total": 65
    }
}
```

---

### POST /users
**Auth:** Bearer Token
**Permission:** `create-users`

**Request:**
```json
{
    "name": "Staff Baru",
    "email": "staff@hideoerp.com",
    "password": "password123",
    "password_confirmation": "password123",
    "phone": "08123456789",
    "role": "staff",
    "is_active": true
}
```

**Validation Rules:**
| Field | Rules |
|---|---|
| name | required, string, max:100 |
| email | required, string, email, max:255, unique:users |
| password | required, string, min:8, confirmed |
| phone | sometimes, string, max:20 |
| role | required, string, exists:roles,name |
| is_active | sometimes, boolean |

---

### GET /users/{id}
**Auth:** Bearer Token
**Permission:** `view-users`

**Response (200):**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "name": "Staff Baru",
        "email": "staff@hideoerp.com",
        "phone": "08123456789",
        "avatar": null,
        "is_active": true,
        "role": "staff",
        "permissions": ["view-dashboard", "view-products", "create-products"],
        "last_login_at": null,
        "created_at": "2026-06-24T10:00:00Z"
    }
}
```

---

### PUT /users/{id}
**Auth:** Bearer Token
**Permission:** `edit-users`

**Request:**
```json
{
    "name": "Staff Update",
    "email": "staff@hideoerp.com",
    "phone": "08123456788",
    "role": "manager",
    "is_active": true
}
```

**Validation Rules:**
| Field | Rules |
|---|---|
| name | sometimes, string, max:100 |
| email | sometimes, email, max:255, unique:users,email,{id} |
| phone | sometimes, string, max:20 |
| role | sometimes, string, exists:roles,name |
| is_active | sometimes, boolean |

---

### DELETE /users/{id}
**Auth:** Bearer Token
**Permission:** `delete-users`

**Constraint:** Cannot delete yourself.

**Response (200):**
```json
{
    "success": true,
    "message": "User deleted successfully"
}
```

---

## 10.5 Role & Permission API

### GET /roles
**Auth:** Bearer Token
**Permission:** `view-roles`

**Response (200):**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "name": "super_admin",
            "guard_name": "web",
            "permissions_count": 70,
            "users_count": 1,
            "created_at": "2026-01-01T00:00:00Z"
        }
    ]
}
```

---

### POST /roles
**Auth:** Bearer Token
**Permission:** `create-roles`

**Request:**
```json
{
    "name": "supervisor",
    "permissions": ["view-products", "create-products", "view-sales", "create-sales"]
}
```

**Validation Rules:**
| Field | Rules |
|---|---|
| name | required, string, max:255, unique:roles,name |
| permissions | required, array |
| permissions.* | required, string, exists:permissions,name |

---

### PUT /roles/{id}
**Auth:** Bearer Token
**Permission:** `edit-roles`

**Constrain:** Cannot edit `super_admin` role.

**Request:**
```json
{
    "name": "supervisor-updated",
    "permissions": ["view-products", "create-products", "edit-products"]
}
```

---

### DELETE /roles/{id}
**Auth:** Bearer Token
**Permission:** `delete-roles`

**Constrain:** Cannot delete `super_admin` role. Cannot delete role with active users.

---

### GET /permissions
**Auth:** Bearer Token
**Permission:** `view-permissions`

**Response (200):**
```json
{
    "success": true,
    "data": [
        {"id": 1, "name": "view-dashboard", "guard_name": "web"},
        {"id": 2, "name": "view-users", "guard_name": "web"}
    ]
}
```

---

## 10.6 Product API

### GET /products
**Auth:** Bearer Token
**Permission:** `view-products`

**Query Parameters:**
| Param | Type | Default | Description |
|---|---|---|---|
| search | string | null | Search by name or SKU |
| category_id | int | null | Filter by category |
| unit_id | int | null | Filter by unit |
| is_active | boolean | null | Active status |
| low_stock | boolean | null | Filter low stock |
| per_page | int | 15 | Items per page |

---

### POST /products
**Auth:** Bearer Token
**Permission:** `create-products`

**Request:**
```json
{
    "name": "Indomie Goreng",
    "sku": "IDM-GORENG-001",
    "category_id": 1,
    "unit_id": 2,
    "purchase_price": 2500,
    "selling_price": 3500,
    "stock_minimum": 50,
    "description": "Indomie Goreng Rasa Original",
    "image": "base64-encoded-image"
}
```

**Validation Rules:**
| Field | Rules |
|---|---|
| name | required, string, max:200 |
| sku | required, string, max:50, unique:products,sku,NULL,id,company_id,{company_id} |
| category_id | sometimes, integer, exists:categories,id |
| unit_id | required, integer, exists:units,id |
| purchase_price | required, numeric, min:0 |
| selling_price | required, numeric, min:0, gte:purchase_price |
| stock_minimum | required, integer, min:0 |
| description | sometimes, string, max:1000 |
| image | sometimes, image, max:2048 |

---

### GET /products/{id}
**Auth:** Bearer Token
**Permission:** `view-products`

**Response (200):**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "name": "Indomie Goreng",
        "sku": "IDM-GORENG-001",
        "category": {"id": 1, "name": "Makanan"},
        "unit": {"id": 2, "name": "Pieces", "short_code": "pcs"},
        "purchase_price": "2500.00",
        "selling_price": "3500.00",
        "stock": 500,
        "stock_minimum": 50,
        "is_low_stock": false,
        "stock_value": "1250000.00",
        "description": "Indomie Goreng Rasa Original",
        "image": "https://storage.hideoerp.com/products/indomie.jpg",
        "created_at": "2026-06-24T10:00:00Z"
    }
}
```

---

### PUT /products/{id}
**Auth:** Bearer Token
**Permission:** `edit-products`

---

### DELETE /products/{id}
**Auth:** Bearer Token
**Permission:** `delete-products`

**Constraint:** Cannot delete if linked to purchases or sales.

---

## 10.7 Category API

### GET /categories
**Auth:** Bearer Token
**Permission:** `view-categories`

### POST /categories
**Auth:** Bearer Token
**Permission:** `create-categories`

**Request:**
```json
{
    "name": "Makanan Ringan",
    "description": "Kategori untuk makanan ringan dan snack"
}
```

**Validation Rules:**
| Field | Rules |
|---|---|
| name | required, string, max:100, unique:categories,name,NULL,id,company_id,{company_id} |
| description | sometimes, string, max:500 |

---

## 10.8 Supplier API

### GET /suppliers
**Auth:** Bearer Token
**Permission:** `view-suppliers`

### POST /suppliers
**Auth:** Bearer Token
**Permission:** `create-suppliers`

**Request:**
```json
{
    "name": "PT Indofood Sukses Makmur Tbk",
    "contact_person": "Budi Santoso",
    "phone": "021-12345678",
    "email": "budi@indofood.co.id",
    "address": "Jl. Jend. Sudirman Kav. 76-78, Jakarta",
    "tax_id": "01.234.567.8-999.000"
}
```

**Validation Rules:**
| Field | Rules |
|---|---|
| name | required, string, max:200 |
| contact_person | sometimes, string, max:100 |
| phone | sometimes, string, max:20 |
| email | sometimes, string, email, max:255 |
| address | sometimes, string, max:1000 |
| tax_id | sometimes, string, max:50 |

---

## 10.9 Customer API

### GET /customers
**Auth:** Bearer Token
**Permission:** `view-customers`

### POST /customers
**Auth:** Bearer Token
**Permission:** `create-customers`

**Request:**
```json
{
    "name": "Ahmad Rizki",
    "phone": "08123456789",
    "email": "ahmad@email.com",
    "address": "Jl. Merdeka No. 10, Bandung"
}
```

---

## 10.10 Purchase API

### GET /purchases
**Auth:** Bearer Token
**Permission:** `view-purchases`

**Query Parameters:**
| Param | Type | Default | Description |
|---|---|---|---|
| search | string | null | Search by number |
| supplier_id | int | null | Filter by supplier |
| status | string | null | Filter by status (pending/approved/received/cancelled) |
| date_from | date | null | Start date |
| date_to | date | null | End date |
| per_page | int | 15 | Items per page |

---

### POST /purchases
**Auth:** Bearer Token
**Permission:** `create-purchases`

**Request:**
```json
{
    "supplier_id": 1,
    "order_date": "2026-06-24",
    "notes": "PO untuk restock bulan Juni",
    "items": [
        {
            "product_id": 1,
            "quantity": 100,
            "unit_price": 2500
        },
        {
            "product_id": 2,
            "quantity": 50,
            "unit_price": 5000
        }
    ]
}
```

**Validation Rules:**
| Field | Rules |
|---|---|
| supplier_id | required, integer, exists:suppliers,id |
| order_date | required, date, format:Y-m-d |
| notes | sometimes, string, max:1000 |
| items | required, array, min:1 |
| items.*.product_id | required, integer, exists:products,id |
| items.*.quantity | required, integer, min:1 |
| items.*.unit_price | required, numeric, min:0 |

**Response (201):**
```json
{
    "success": true,
    "message": "Purchase order created successfully",
    "data": {
        "id": 1,
        "purchase_number": "PO-20260624-0001",
        "supplier": {"id": 1, "name": "PT Indofood"},
        "status": "pending",
        "order_date": "2026-06-24",
        "items": [
            {
                "id": 1,
                "product": {"id": 1, "name": "Product A", "sku": "SKU001"},
                "quantity": 100,
                "unit_price": "2500.00",
                "subtotal": "250000.00"
            }
        ],
        "subtotal": "250000.00",
        "total": "250000.00",
        "created_by": {"id": 1, "name": "Super Admin"},
        "created_at": "2026-06-24T10:00:00Z"
    }
}
```

---

### POST /purchases/{purchase}/approve
**Auth:** Bearer Token
**Permission:** `approve-purchases`

**Constrain:** Cannot self-approve. Status must be pending.

---

### POST /purchases/{purchase}/receive
**Auth:** Bearer Token
**Permission:** `approve-purchases`

**Request:**
```json
{
    "items": [
        {"id": 1, "received_quantity": 100},
        {"id": 2, "received_quantity": 50}
    ]
}
```

---

## 10.11 Sales API

### GET /sales
**Auth:** Bearer Token
**Permission:** `view-sales`

### POST /sales
**Auth:** Bearer Token
**Permission:** `create-sales`

**Request:**
```json
{
    "customer_id": 1,
    "order_date": "2026-06-24",
    "notes": "Penjualan langsung ke toko",
    "items": [
        {
            "product_id": 1,
            "quantity": 5,
            "unit_price": 3500
        }
    ]
}
```

**Validation Rules (additional):**
| Field | Rules |
|---|---|
| items.*.quantity | required, integer, min:1, lte:available_stock |

---

### POST /sales/{sale}/update-payment
**Auth:** Bearer Token
**Permission:** `edit-invoice-status`

**Request:**
```json
{
    "payment_status": "paid",
    "amount_paid": 17500
}
```

**Validation Rules:**
| Field | Rules |
|---|---|
| payment_status | required, string, in:unpaid,partial,paid |
| amount_paid | required, numeric, min:0, lte:total |

---

## 10.12 Stock Movement API

### GET /inventory
**Auth:** Bearer Token
**Permission:** `view-inventory`

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "product_id": 1,
            "product_name": "Indomie Goreng",
            "sku": "IDM-GORENG-001",
            "category": "Makanan",
            "stock": 500,
            "stock_minimum": 50,
            "unit": "pcs",
            "is_low_stock": false
        }
    ]
}
```

---

### POST /inventory/stock-in
**Auth:** Bearer Token
**Permission:** `create-stock-in`

**Request:**
```json
{
    "product_id": 1,
    "quantity": 50,
    "reference_type": "purchase",
    "reference_id": 1,
    "notes": "Direct stock in - adjustment"
}
```

---

### POST /inventory/stock-out
**Auth:** Bearer Token
**Permission:** `create-stock-out`

**Request:**
```json
{
    "product_id": 1,
    "quantity": 10,
    "reference_type": "sale",
    "reference_id": null,
    "notes": "Sample barang untuk customer"
}
```

---

### POST /inventory/adjustment
**Auth:** Bearer Token
**Permission:** `create-stock-adjustment`

**Request:**
```json
{
    "product_id": 1,
    "quantity": -5,
    "reason": "Barang rusak saat penyimpanan"
}
```

**Validation Rules:**
| Field | Rules |
|---|---|
| quantity | required, integer, not:0 |
| reason | required_if:adjustment, string, max:500 |
| product_id | required, integer, exists:products,id |

---

### GET /inventory/history
**Auth:** Bearer Token
**Permission:** `view-stock-history`

**Query Parameters:**
| Param | Type | Default | Description |
|---|---|---|---|
| product_id | int | null | Filter by product |
| type | string | null | Filter by type (in/out/adjustment) |
| date_from | date | null | Start date |
| date_to | date | null | End date |

---

## 10.13 Expense API

### GET /expenses
**Auth:** Bearer Token
**Permission:** `view-expenses`

### POST /expenses
**Auth:** Bearer Token
**Permission:** `create-expenses`

**Request:**
```json
{
    "expense_category_id": 1,
    "description": "Listrik bulan Juni 2026",
    "amount": 1500000,
    "expense_date": "2026-06-24",
    "receipt": "base64-encoded-image"
}
```

---

## 10.14 Reports API

### GET /reports/sales
**Auth:** Bearer Token
**Permission:** `view-sales-report`

**Query Parameters:**
| Param | Type | Default | Description |
|---|---|---|---|
| date_from | date | first of month | Start date |
| date_to | date | today | End date |
| status | string | null | Filter by status |
| group_by | string | day | day, week, month |

**Response (200):**
```json
{
    "success": true,
    "data": {
        "summary": {
            "total_sales": 150000000,
            "total_transactions": 45,
            "average_transaction": 3333333,
            "total_items_sold": 230
        },
        "chart": [
            {"date": "2026-06-01", "total": 5000000, "count": 2},
            {"date": "2026-06-02", "total": 7500000, "count": 3}
        ],
        "details": [
            {
                "sale_number": "SO-20260624-0001",
                "customer": "Ahmad Rizki",
                "total": "3500000",
                "status": "completed",
                "payment_status": "paid",
                "date": "2026-06-24"
            }
        ]
    }
}
```

---

## 10.15 Activity Log API

### GET /logs/activities
**Auth:** Bearer Token
**Permission:** `view-activity-logs`

### GET /logs/logins
**Auth:** Bearer Token
**Permission:** `view-login-logs`

---

## 10.16 Notification API

### GET /notifications
**Auth:** Bearer Token
**Permission:** `view-notifications`

**Response (200):**
```json
{
    "success": true,
    "data": {
        "unread_count": 3,
        "notifications": [
            {
                "id": "uuid-123",
                "type": "low_stock",
                "title": "Stok Menipis",
                "message": "Product 'Indomie Goreng' hanya tersisa 2 unit",
                "read_at": null,
                "created_at": "2026-06-24T10:00:00Z"
            }
        ]
    }
}
```

---

### POST /notifications/{id}/read
**Auth:** Bearer Token

### POST /notifications/read-all
**Auth:** Bearer Token

---

## 10.17 Settings API

### GET /settings/company
**Auth:** Bearer Token
**Permission:** `view-settings`

### PUT /settings/company
**Auth:** Bearer Token
**Permission:** `edit-company-profile`

**Request:**
```json
{
    "name": "Hideo Corp",
    "address": "Jl. Sudirman No. 1, Jakarta",
    "phone": "021-12345678",
    "email": "info@hideoerp.com",
    "logo": "base64-encoded-image"
}
```

### GET /settings/application
**Auth:** Bearer Token
**Permission:** `view-settings`

### PUT /settings/application
**Auth:** Bearer Token
**Permission:** `edit-app-settings`

**Request:**
```json
{
    "currency": "IDR",
    "timezone": "Asia/Jakarta",
    "date_format": "d/m/Y",
    "low_stock_threshold": 10
}
```

---

## 10.18 API Error Codes Summary

| HTTP Code | Description | Example Scenario |
|---|---|---|
| 200 | Success | Successful GET/PUT/PATCH/DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Invalid input format |
| 401 | Unauthenticated | Missing or expired token |
| 403 | Forbidden | Insufficient permission |
| 404 | Not Found | Resource does not exist |
| 409 | Conflict | Business rule violation (stock insufficient) |
| 422 | Validation Error | Invalid request data |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side exception |

---

--- _End of Phase 10 — API Design_ ---
