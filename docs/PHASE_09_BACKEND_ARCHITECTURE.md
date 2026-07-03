# PHASE 9: BACKEND ARCHITECTURE — Hideo ERP

---

## 9.1 Architecture Overview

Hideo ERP menggunakan **Service Layer Architecture** di atas Laravel 12.

**Prinsip Utama:**
- Controllers hanya menerima request, memanggil Service, mengembalikan Resource
- Services mengandung semua business logic
- Models hanya berisi definisi relasi, scopes, dan accessors/mutators
- Policies menangani authorization
- Requests menangani validasi
- Resources menangani response formatting

### Layer Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                       HTTP ROUTE (api.php)                        │
├──────────────────────────────────────────────────────────────────┤
│                              ↓                                    │
│                      MIDDLEWARE                                   │
│   (auth:sanctum, verified, throttle, company.scope)               │
├──────────────────────────────────────────────────────────────────┤
│                              ↓                                    │
│                      CONTROLLER                                   │
│              (Thin — only orchestration)                          │
├──────────────────────────────────────────────────────────────────┤
│              ↓                    ↓                  ↓            │
│        FORM REQUEST          SERVICE            POLICY             │
│        (Validation)      (Business Logic)    (Authorization)      │
│              ↓                    ↓                  ↓            │
│                         ┌────────────────┐                        │
│                         │    MODEL       │                        │
│                         │  (Relations,   │                        │
│                         │   Scopes,      │                        │
│                         │   Accessors)   │                        │
│                         └───────┬────────┘                        │
│                                 ↓                                 │
│                         ┌────────────────┐                        │
│                         │  API RESOURCE  │                        │
│                         │  (Response     │                        │
│                         │   Formatting)  │                        │
│                         └────────────────┘                        │
├──────────────────────────────────────────────────────────────────┤
│                              ↓                                    │
│                   JSON RESPONSE                                    │
│           { success: true, message, data }                        │
└──────────────────────────────────────────────────────────────────┘
```

---

## 9.2 Folder Structure

```
app/
├── Console/
│   └── Commands/
│       └── CheckLowStock.php
│
├── Enums/
│   ├── PurchaseStatus.php         (pending, approved, received, cancelled)
│   ├── SaleStatus.php             (pending, completed, cancelled)
│   ├── PaymentStatus.php          (unpaid, partial, paid)
│   ├── StockMovementType.php      (in, out, adjustment)
│   └── UserRole.php               (super_admin, owner, manager, staff)
│
├── Events/
│   ├── ProductLowStock.php
│   └── PurchaseApproved.php
│
├── Exceptions/
│   ├── InsufficientStockException.php
│   └── BusinessException.php
│
├── Http/
│   ├── Controllers/
│   │   ├── Api/
│   │   │   ├── AuthController.php
│   │   │   ├── ProfileController.php
│   │   │   ├── DashboardController.php
│   │   │   ├── UserController.php
│   │   │   ├── RoleController.php
│   │   │   ├── PermissionController.php
│   │   │   ├── ProductController.php
│   │   │   ├── CategoryController.php
│   │   │   ├── UnitController.php
│   │   │   ├── SupplierController.php
│   │   │   ├── CustomerController.php
│   │   │   ├── PurchaseController.php
│   │   │   ├── SaleController.php
│   │   │   ├── StockMovementController.php
│   │   │   ├── ExpenseController.php
│   │   │   ├── ExpenseCategoryController.php
│   │   │   ├── ReportController.php
│   │   │   ├── ActivityLogController.php
│   │   │   ├── NotificationController.php
│   │   │   └── SettingController.php
│   │   └── Controller.php          (Base Controller)
│   │
│   ├── Middleware/
│   │   └── CompanyScopeMiddleware.php
│   │
│   ├── Requests/
│   │   ├── Auth/
│   │   │   ├── LoginRequest.php
│   │   │   ├── ForgotPasswordRequest.php
│   │   │   ├── ResetPasswordRequest.php
│   │   │   └── ChangePasswordRequest.php
│   │   ├── User/
│   │   │   ├── StoreUserRequest.php
│   │   │   └── UpdateUserRequest.php
│   │   ├── Role/
│   │   │   ├── StoreRoleRequest.php
│   │   │   └── UpdateRoleRequest.php
│   │   ├── Product/
│   │   │   ├── StoreProductRequest.php
│   │   │   └── UpdateProductRequest.php
│   │   ├── Category/
│   │   │   ├── StoreCategoryRequest.php
│   │   │   └── UpdateCategoryRequest.php
│   │   ├── Supplier/
│   │   │   ├── StoreSupplierRequest.php
│   │   │   └── UpdateSupplierRequest.php
│   │   ├── Customer/
│   │   │   ├── StoreCustomerRequest.php
│   │   │   └── UpdateCustomerRequest.php
│   │   ├── Purchase/
│   │   │   ├── StorePurchaseRequest.php
│   │   │   └── UpdatePurchaseRequest.php
│   │   ├── Sale/
│   │   │   ├── StoreSaleRequest.php
│   │   │   └── UpdateSaleRequest.php
│   │   ├── StockMovement/
│   │   │   ├── StockInRequest.php
│   │   │   ├── StockOutRequest.php
│   │   │   └── StockAdjustmentRequest.php
│   │   ├── Expense/
│   │   │   ├── StoreExpenseRequest.php
│   │   │   └── UpdateExpenseRequest.php
│   │   ├── Report/
│   │   │   └── ReportRequest.php
│   │   └── Setting/
│   │       └── UpdateCompanyRequest.php
│   │
│   ├── Resources/
│   │   ├── UserResource.php
│   │   ├── UserCollection.php
│   │   ├── RoleResource.php
│   │   ├── PermissionResource.php
│   │   ├── ProductResource.php
│   │   ├── ProductCollection.php
│   │   ├── CategoryResource.php
│   │   ├── UnitResource.php
│   │   ├── SupplierResource.php
│   │   ├── CustomerResource.php
│   │   ├── PurchaseResource.php
│   │   ├── PurchaseCollection.php
│   │   ├── PurchaseItemResource.php
│   │   ├── SaleResource.php
│   │   ├── SaleCollection.php
│   │   ├── SaleItemResource.php
│   │   ├── StockMovementResource.php
│   │   ├── ExpenseResource.php
│   │   ├── ExpenseCategoryResource.php
│   │   ├── ReportResource.php
│   │   ├── ActivityLogResource.php
│   │   ├── NotificationResource.php
│   │   ├── SettingResource.php
│   │   └── DashboardResource.php
│   │
│   └── Responses/
│       └── ApiResponse.php         (Standard response trait)
│
├── Jobs/
│   ├── SendPasswordResetEmailJob.php
│   ├── ProcessStockAdjustmentJob.php
│   └── GenerateReportJob.php
│
├── Listeners/
│   ├── SendLowStockNotification.php
│   └── LogApprovedPurchase.php
│
├── Models/
│   ├── User.php
│   ├── Company.php
│   ├── Setting.php
│   ├── Category.php
│   ├── Unit.php
│   ├── Product.php
│   ├── Supplier.php
│   ├── Customer.php
│   ├── Purchase.php
│   ├── PurchaseItem.php
│   ├── Sale.php
│   ├── SaleItem.php
│   ├── StockMovement.php
│   ├── ExpenseCategory.php
│   ├── Expense.php
│   ├── ActivityLog.php
│   └── LoginLog.php
│
├── Policies/
│   ├── UserPolicy.php
│   ├── RolePolicy.php
│   ├── ProductPolicy.php
│   ├── CategoryPolicy.php
│   ├── SupplierPolicy.php
│   ├── CustomerPolicy.php
│   ├── PurchasePolicy.php
│   ├── SalePolicy.php
│   ├── StockMovementPolicy.php
│   ├── ExpensePolicy.php
│   └── ReportPolicy.php
│
├── Providers/
│   └── AppServiceProvider.php      (Global scopes, macros)
│
├── Services/
│   ├── AuthService.php
│   ├── DashboardService.php
│   ├── UserService.php
│   ├── RoleService.php
│   ├── ProductService.php
│   ├── SupplierService.php
│   ├── CustomerService.php
│   ├── PurchaseService.php
│   ├── SaleService.php
│   ├── StockMovementService.php
│   ├── ExpenseService.php
│   ├── ReportService.php
│   ├── ActivityLogService.php
│   ├── NotificationService.php
│   └── SettingService.php
│
├── Traits/
│   ├── HasCompanyScope.php
│   ├── HasCreatedBy.php
│   └── ApiResponseTrait.php
│
└── Observers/
    ├── ProductObserver.php         (Check low stock → dispatch event)
    └── PurchaseObserver.php        (Log status changes)
```

---

## 9.3 Data Flow

### 9.3.1 Request Lifecycle

```
User Action (Browser)
    │
    ▼
React Component → TanStack Query → Axios → HTTP Request
    │
    ▼ (Server)
api.php Route → Middleware Stack (auth, throttle, company)
    │
    ▼
Controller::method(Request)
    │
    ├── 1. Inject Form Request for validation
    │       └── Jika gagal → 422 Validation Error Response
    │
    ├── 2. Check Policy (authorization)
    │       └── Jika tidak diizinkan → 403 Forbidden Response
    │
    ├── 3. Call Service method
    │       ├── Business logic execution
    │       ├── Database transaction (if critical)
    │       ├── Dispatch event / job (if needed)
    │       └── Return DTO / Model result
    │
    ├── 4. Transform via API Resource
    │       └── Format response sesuai standar
    │
    └── 5. Return JSON Response
            └── { success: true, message, data, meta }
```

### 9.3.2 Critical Transaction Flow (Sales)

```
1. POST /api/sales
    │
    ▼
SaleController::store(StoreSaleRequest $request)
    │
    ├── Validate request (items, quantities, prices)
    │
    ├── Policy: can('create', Sale::class)
    │
    ├── SaleService::createSale($data)
    │       │
    │       ├── DB::beginTransaction()
    │       │
    │       ├── Create Sale record
    │       │
    │       ├── Create SaleItems (loop)
    │       │       └── Validate stock availability for each
    │       │       └── If any fails → throw InsufficientStockException
    │       │       └── Calculate subtotals
    │       │
    │       ├── Calculate total
    │       │
    │       ├── Update product stock (decrement)
    │       │       └── Create StockMovement record for each item
    │       │
    │       ├── Log activity via ActivityLogService
    │       │
    │       ├── DB::commit()
    │       │
    │       └── Return Sale model (with relations loaded)
    │
    ├── Return new SaleResource($sale)
    │
    └── Response: 201 Created
```

---

## 9.4 Service Layer Pattern

### 9.4.1 Service Contract

```php
interface ServiceInterface
{
    public function getAll(array $filters = []): LengthAwarePaginator;
    public function getById(int $id): Model;
    public function create(array $data): Model;
    public function update(int $id, array $data): Model;
    public function delete(int $id): bool;
}
```

### 9.4.2 Service Example Structure

```php
class PurchaseService
{
    public function __construct(
        private readonly ActivityLogService $activityLogService,
        private readonly StockMovementService $stockMovementService,
        private readonly NotificationService $notificationService,
    ) {}

    public function getAll(array $filters = []): LengthAwarePaginator
    {
        return Purchase::query()
            ->with(['supplier:id,name', 'items.product:id,name,sku'])
            ->applyFilters($filters)
            ->latest()
            ->paginate($filters['per_page'] ?? 10);
    }

    public function create(array $data): Purchase
    {
        return DB::transaction(function () use ($data) {
            $purchase = Purchase::create([
                'company_id' => auth()->user()->company_id,
                'supplier_id' => $data['supplier_id'],
                'purchase_number' => $this->generateNumber(),
                'order_date' => $data['order_date'],
                'notes' => $data['notes'] ?? null,
                'created_by' => auth()->id(),
            ]);

            $items = collect($data['items'])->map(function ($item) {
                return new PurchaseItem([
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'subtotal' => $item['quantity'] * $item['unit_price'],
                ]);
            });

            $purchase->items()->saveMany($items);
            $purchase->load('items');

            $purchase->update([
                'subtotal' => $purchase->items->sum('subtotal'),
                'total' => $purchase->subtotal,
            ]);

            $this->activityLogService->log('create', 'purchase', $purchase);

            return $purchase->fresh(['supplier', 'items.product']);
        });
    }

    public function approve(int $id): Purchase
    {
        return DB::transaction(function () use ($id) {
            $purchase = Purchase::findOrFail($id);

            throw_if(
                $purchase->status !== PurchaseStatus::PENDING,
                new BusinessException('Only pending purchases can be approved')
            );

            throw_if(
                $purchase->created_by === auth()->id(),
                new BusinessException('You cannot approve your own purchase')
            );

            $purchase->update([
                'status' => PurchaseStatus::APPROVED,
                'approved_by' => auth()->id(),
            ]);

            $this->activityLogService->log('update', 'purchase', $purchase);

            return $purchase;
        });
    }

    private function generateNumber(): string
    {
        $prefix = 'PO-' . now()->format('Ymd');
        $last = Purchase::where('purchase_number', 'like', "$prefix-%")
            ->latest()->first();

        $sequence = $last ? (int) explode('-', $last->purchase_number)[2] + 1 : 1;

        return "$prefix-" . str_pad($sequence, 4, '0', STR_PAD_LEFT);
    }
}
```

---

## 9.5 Controller Pattern

```php
class PurchaseController extends Controller
{
    public function __construct(
        private readonly PurchaseService $purchaseService,
    ) {}

    public function index(PurchaseListRequest $request): PurchageCollection
    {
        $this->authorize('viewAny', Purchase::class);

        $purchases = $this->purchaseService->getAll($request->validated());

        return new PurchaseCollection($purchases);
    }

    public function store(StorePurchaseRequest $request): PurchageResource
    {
        $this->authorize('create', Purchase::class);

        $purchase = $this->purchaseService->create($request->validated());

        return new PurchaseResource($purchase);
    }

    public function show(int $id): PurchageResource
    {
        $purchase = $this->purchaseService->getById($id);

        $this->authorize('view', $purchase);

        return new PurchaseResource($purchase);
    }

    public function approve(int $id): PurchageResource
    {
        $purchase = $this->purchaseService->getById($id);

        $this->authorize('approve', $purchase);

        $purchase = $this->purchaseService->approve($id);

        return new PurchaseResource($purchase);
    }
}
```

---

## 9.6 Model Architecture

### 9.6.1 Base Model Traits

```php
trait HasCompanyScope
{
    protected static function bootHasCompanyScope(): void
    {
        static::addGlobalScope('company', function (Builder $builder) {
            if (auth()->check()) {
                $builder->where('company_id', auth()->user()->company_id);
            }
        });

        static::creating(function (Model $model) {
            if (auth()->check() && !$model->company_id) {
                $model->company_id = auth()->user()->company_id;
            }
        });
    }
}

trait HasCreatedBy
{
    protected static function bootHasCreatedBy(): void
    {
        static::creating(function (Model $model) {
            if (auth()->check()) {
                $model->created_by ??= auth()->id();
            }
        });

        static::updating(function (Model $model) {
            if (auth()->check()) {
                $model->updated_by = auth()->id();
            }
        });
    }
}
```

### 9.6.2 Model Example

```php
class Product extends Model
{
    use HasFactory, SoftDeletes;
    use HasCompanyScope, HasCreatedBy;

    protected $fillable = [
        'company_id', 'category_id', 'unit_id',
        'name', 'sku', 'barcode', 'description',
        'purchase_price', 'selling_price',
        'stock', 'stock_minimum', 'image', 'is_active',
    ];

    protected $casts = [
        'purchase_price' => 'decimal:2',
        'selling_price' => 'decimal:2',
        'stock' => 'integer',
        'stock_minimum' => 'integer',
        'is_active' => 'boolean',
    ];

    // Relations
    public function company(): BelongsTo { return $this->belongsTo(Company::class); }
    public function category(): BelongsTo { return $this->belongsTo(Category::class); }
    public function unit(): BelongsTo { return $this->belongsTo(Unit::class); }
    public function stockMovements(): HasMany { return $this->hasMany(StockMovement::class); }
    public function purchaseItems(): HasMany { return $this->hasMany(PurchaseItem::class); }
    public function saleItems(): HasMany { return $this->hasMany(SaleItem::class); }

    // Scopes
    public function scopeActive(Builder $query): Builder { return $query->where('is_active', true); }
    public function scopeLowStock(Builder $query): Builder
    {
        return $query->whereColumn('stock', '<=', 'stock_minimum');
    }
    public function scopeByCategory(Builder $query, int $categoryId): Builder
    {
        return $query->where('category_id', $categoryId);
    }

    // Accessors
    public function getStockValueAttribute(): float
    {
        return $this->stock * $this->purchase_price;
    }

    public function getIsLowStockAttribute(): bool
    {
        return $this->stock <= $this->stock_minimum;
    }
}
```

---

## 9.7 Policy Architecture

```php
class PurchasePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view-purchases');
    }

    public function view(User $user, Purchase $purchase): bool
    {
        return $user->hasPermissionTo('view-purchases')
            && $user->company_id === $purchase->company_id;
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create-purchases');
    }

    public function update(User $user, Purchase $purchase): bool
    {
        return $user->hasPermissionTo('edit-purchases')
            && $purchase->status === PurchaseStatus::PENDING;
    }

    public function delete(User $user, Purchase $purchase): bool
    {
        return $user->hasPermissionTo('delete-purchases')
            && $purchase->status === PurchaseStatus::PENDING;
    }

    public function approve(User $user, Purchase $purchase): bool
    {
        return $user->hasPermissionTo('approve-purchases')
            && $purchase->status === PurchaseStatus::PENDING
            && $purchase->created_by !== $user->id;
    }
}
```

---

## 9.8 API Response Standard

```php
trait ApiResponseTrait
{
    public function success(mixed $data = null, string $message = 'Success', int $code = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $code);
    }

    public function error(string $message = 'Error', int $code = 400, mixed $errors = null): JsonResponse
    {
        $response = [
            'success' => false,
            'message' => $message,
        ];

        if ($errors) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $code);
    }

    public function validationError(mixed $errors): JsonResponse
    {
        return $this->error('Validation Error', 422, $errors);
    }

    public function forbidden(string $message = 'Forbidden'): JsonResponse
    {
        return $this->error($message, 403);
    }

    public function notFound(string $message = 'Not Found'): JsonResponse
    {
        return $this->error($message, 404);
    }
}
```

### Response Examples

**Success:**
```json
{
    "success": true,
    "message": "Purchase created successfully",
    "data": {
        "id": 1,
        "purchase_number": "PO-20260624-0001",
        "supplier": { "id": 1, "name": "PT Supplier ABC" },
        "items": [...],
        "total": "1500000.00",
        "status": "pending"
    }
}
```

**Validation Error:**
```json
{
    "success": false,
    "message": "Validation Error",
    "errors": {
        "supplier_id": ["The supplier field is required."],
        "items": ["At least one item is required."]
    }
}
```

**Server Error:**
```json
{
    "success": false,
    "message": "Internal Server Error"
}
```

---

## 9.9 Enum Architecture

```php
enum PurchaseStatus: string
{
    case PENDING = 'pending';
    case APPROVED = 'approved';
    case RECEIVED = 'received';
    case CANCELLED = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'Pending',
            self::APPROVED => 'Approved',
            self::RECEIVED => 'Received',
            self::CANCELLED => 'Cancelled',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::PENDING => 'yellow',
            self::APPROVED => 'blue',
            self::RECEIVED => 'green',
            self::CANCELLED => 'red',
        };
    }

    public function canTransitionTo(self $newStatus): bool
    {
        return match ($this) {
            self::PENDING => in_array($newStatus, [self::APPROVED, self::CANCELLED]),
            self::APPROVED => in_array($newStatus, [self::RECEIVED, self::CANCELLED]),
            self::RECEIVED => false,
            self::CANCELLED => false,
        };
    }
}
```

---

## 9.10 Security Flow

```
Request → Route → Middleware
                        │
          ┌─────────────┼──────────────┐
          ▼             ▼              ▼
    auth:sanctum   throttle:api   company.scope
    (Token Valid)  (Rate Limit)   (Data Isolation)
          │             │              │
          └─────────────┼──────────────┘
                        ▼
                Form Request Validation
                        │
                        ▼
                   Policy Check
                        │
                        ▼
                   Service Layer
                        │
                    ┌───┴───┐
                    ▼       ▼
            DB Transaction  Event/Job
                    │       │
                    └───┬───┘
                        ▼
                   API Resource
                        │
                        ▼
                   JSON Response
```

---

## 9.11 Events & Jobs

| Event | Trigger | Listener/Job |
|---|---|---|
| `ProductLowStock` | Product stock ≤ minimum after any stock change | `SendLowStockNotification` → create Notification record |
| `PurchaseApproved` | Purchase status changed to approved | `LogApprovedPurchase` → activity log |
| — | Forgot password request | `SendPasswordResetEmailJob` → queue email |
| — | Stock adjustment bulk process | `ProcessStockAdjustmentJob` → queue heavy operation |

---

## 9.12 Route Architecture

```php
// routes/api.php

Route::prefix('v1')->group(function () {
    // Public
    Route::post('auth/login', [AuthController::class, 'login']);
    Route::post('auth/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('auth/reset-password', [AuthController::class, 'resetPassword']);

    // Protected
    Route::middleware('auth:sanctum')->group(function () {
        // Auth & Profile
        Route::post('auth/logout', [AuthController::class, 'logout']);
        Route::get('profile', [ProfileController::class, 'show']);
        Route::put('profile', [ProfileController::class, 'update']);
        Route::put('profile/change-password', [ProfileController::class, 'changePassword']);

        // Dashboard
        Route::get('dashboard', [DashboardController::class, 'index']);

        // User Management
        Route::apiResource('users', UserController::class);
        Route::apiResource('roles', RoleController::class);
        Route::get('permissions', [PermissionController::class, 'index']);

        // Master Data
        Route::apiResource('products', ProductController::class);
        Route::apiResource('categories', CategoryController::class);
        Route::apiResource('units', UnitController::class);
        Route::apiResource('suppliers', SupplierController::class);
        Route::apiResource('customers', CustomerController::class);

        // Transactions
        Route::apiResource('purchases', PurchaseController::class);
        Route::post('purchases/{purchase}/approve', [PurchaseController::class, 'approve']);
        Route::post('purchases/{purchase}/receive', [PurchaseController::class, 'receive']);

        Route::apiResource('sales', SaleController::class);
        Route::post('sales/{sale}/update-payment', [SaleController::class, 'updatePayment']);

        Route::apiResource('expenses', ExpenseController::class);
        Route::apiResource('expense-categories', ExpenseCategoryController::class);

        // Inventory
        Route::get('inventory', [StockMovementController::class, 'index']);
        Route::post('inventory/stock-in', [StockMovementController::class, 'stockIn']);
        Route::post('inventory/stock-out', [StockMovementController::class, 'stockOut']);
        Route::post('inventory/adjustment', [StockMovementController::class, 'adjustment']);
        Route::get('inventory/history', [StockMovementController::class, 'history']);

        // Reports
        Route::get('reports/sales', [ReportController::class, 'sales']);
        Route::get('reports/purchases', [ReportController::class, 'purchases']);
        Route::get('reports/inventory', [ReportController::class, 'inventory']);
        Route::get('reports/expenses', [ReportController::class, 'expenses']);

        // Logs
        Route::get('logs/activities', [ActivityLogController::class, 'activities']);
        Route::get('logs/logins', [ActivityLogController::class, 'logins']);

        // Notifications
        Route::get('notifications', [NotificationController::class, 'index']);
        Route::post('notifications/{id}/read', [NotificationController::class, 'markAsRead']);
        Route::post('notifications/read-all', [NotificationController::class, 'markAllAsRead']);

        // Settings
        Route::get('settings/company', [SettingController::class, 'company']);
        Route::put('settings/company', [SettingController::class, 'updateCompany']);
        Route::get('settings/application', [SettingController::class, 'application']);
        Route::put('settings/application', [SettingController::class, 'updateApplication']);
    });
});
```

---

## 9.13 Middleware Stack

| Middleware | Route Group | Purpose |
|---|---|---|
| `auth:sanctum` | Protected | Token authentication |
| `throttle:api` | Protected | Rate limiting (60 req/min) |
| `throttle:5,1` | Login | Rate limiting login (5 attempts/min) |
| `company.scope` | Protected | Ensures user has company_id |

---

--- _End of Phase 9 — Backend Architecture_ ---
