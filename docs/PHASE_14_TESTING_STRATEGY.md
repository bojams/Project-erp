# PHASE 14: TESTING STRATEGY — Hideo ERP

---

## 14.1 Testing Pyramid

```
         ╱╲
        ╱ E2E ╲          ← (Future — Playwright/Cypress)
       ╱────────╲
      ╱Integration╲       ← (Feature tests — API + Database)
     ╱──────────────╲
    ╱   Unit Tests    ╲    ← (Service + Model + Policy tests)
   ╱────────────────────╲
  ╱  Static Analysis     ╲   ← (TypeScript, PHPStan, ESLint, Pint)
 ╱──────────────────────────╲
```

---

## 14.2 Backend Testing (Pest PHP)

### 14.2.1 Test Structure

```
tests/
├── Feature/
│   ├── Auth/
│   │   ├── LoginTest.php
│   │   ├── LogoutTest.php
│   │   ├── ForgotPasswordTest.php
│   │   ├── ResetPasswordTest.php
│   │   └── ProfileTest.php
│   ├── UserManagement/
│   │   ├── UserCrudTest.php
│   │   ├── RoleCrudTest.php
│   │   └── PermissionTest.php
│   ├── MasterData/
│   │   ├── ProductTest.php
│   │   ├── CategoryTest.php
│   │   ├── UnitTest.php
│   │   ├── SupplierTest.php
│   │   └── CustomerTest.php
│   ├── Transactions/
│   │   ├── PurchaseTest.php
│   │   ├── PurchaseApprovalTest.php
│   │   ├── SalesTest.php
│   │   └── SalesPaymentTest.php
│   ├── Inventory/
│   │   ├── StockInTest.php
│   │   ├── StockOutTest.php
│   │   └── StockAdjustmentTest.php
│   ├── Expense/
│   │   └── ExpenseTest.php
│   ├── Report/
│   │   └── ReportTest.php
│   └── Log/
│       ├── ActivityLogTest.php
│       └── LoginLogTest.php
│
├── Unit/
│   ├── Services/
│   │   ├── PurchaseServiceTest.php
│   │   ├── SaleServiceTest.php
│   │   ├── StockMovementServiceTest.php
│   │   └── ...
│   ├── Models/
│   │   ├── ProductTest.php
│   │   ├── PurchaseTest.php
│   │   └── ...
│   ├── Enums/
│   │   ├── PurchaseStatusTest.php
│   │   └── PaymentStatusTest.php
│   └── Traits/
│       └── ApiResponseTraitTest.php
│
└── TestCase.php
```

### 14.2.2 Feature Test Example

```php
<?php

use App\Models\User;
use App\Models\Product;
use App\Models\Category;
use function Pest\Laravel\actingAs;
use function Pest\Laravel\postJson;
use function Pest\Laravel\getJson;
use function Pest\Laravel\putJson;
use function Pest\Laravel\deleteJson;

beforeEach(function () {
    $this->user = User::factory()->superAdmin()->create();
    $this->category = Category::factory()->create();
    actingAs($this->user);
});

describe('Product CRUD', function () {
    it('can list products', function () {
        Product::factory()->count(5)->create();

        $response = getJson('/api/v1/products');

        $response->assertOk()
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => ['id', 'name', 'sku', 'stock']
                ],
                'meta'
            ]);
    });

    it('can create a product', function () {
        $productData = [
            'name' => 'Test Product',
            'sku' => 'TST-001',
            'category_id' => $this->category->id,
            'unit_id' => 1,
            'purchase_price' => 10000,
            'selling_price' => 15000,
            'stock_minimum' => 10,
        ];

        $response = postJson('/api/v1/products', $productData);

        $response->assertCreated()
            ->assertJson([
                'success' => true,
                'data' => ['name' => 'Test Product']
            ]);
    });

    it('validates selling price >= purchase price', function () {
        $response = postJson('/api/v1/products', [
            'name' => 'Invalid Product',
            'sku' => 'INV-001',
            'purchase_price' => 20000,
            'selling_price' => 15000,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['selling_price']);
    });
});

describe('Product Authorization', function () {
    it('staff cannot delete products', function () {
        $staff = User::factory()->staff()->create();
        $product = Product::factory()->create();

        actingAs($staff);

        $response = deleteJson("/api/v1/products/{$product->id}");

        $response->assertForbidden();
    });
});
```

### 14.2.3 Unit Test Example

```php
<?php

use App\Enums\PurchaseStatus;
use App\Services\PurchaseService;
use App\Models\Purchase;

describe('PurchaseService', function () {
    it('generates unique purchase number', function () {
        $service = app(PurchaseService::class);

        $number1 = $service->generateNumber();
        $number2 = $service->generateNumber();

        expect($number1)->not->toBe($number2);
        expect($number1)->toMatch('/^PO-\d{8}-\d{4}$/');
    });

    it('prevents self-approval', function () {
        $user = User::factory()->create();
        $purchase = Purchase::factory()->create([
            'created_by' => $user->id,
            'status' => PurchaseStatus::PENDING,
        ]);

        $service = app(PurchaseService::class);

        $service->approve($purchase->id);
    })->throws(\App\Exceptions\BusinessException::class);
});
```

### 14.2.4 Database Setup

```php
// tests/TestCase.php
abstract class TestCase extends BaseTestCase
{
    use CreatesApplication, RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed([
            RolePermissionSeeder::class,
            // Other seeders needed for tests
        ]);
    }
}
```

---

## 14.3 Frontend Testing (Vitest)

### 14.3.1 Test Structure

```
src/
├── features/
│   ├── products/
│   │   ├── components/
│   │   │   ├── __tests__/
│   │   │   │   ├── product-table.test.tsx
│   │   │   │   └── product-form.test.tsx
│   │   ├── hooks/
│   │   │   ├── __tests__/
│   │   │   │   ├── use-products.test.ts
│   │   │   │   └── use-create-product.test.ts
│   │   └── schemas/
│   │       └── __tests__/
│   │           └── product-schema.test.ts
│   └── ...
│
├── components/
│   └── ui/
│       └── __tests__/
│           ├── button.test.tsx
│           └── data-table.test.tsx
│
├── hooks/
│   └── __tests__/
│       └── use-debounce.test.ts
│
├── stores/
│   └── __tests__/
│       └── auth-store.test.ts
│
├── utils/
│   └── __tests__/
│       ├── format.test.ts
│       └── cn.test.ts
```

### 14.3.2 Component Test Example

```tsx
// features/products/components/__tests__/product-form.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductForm } from '../product-form';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
}

describe('ProductForm', () => {
  it('renders all required fields', () => {
    renderWithProviders(
      <ProductForm onSubmit={vi.fn()} />
    );

    expect(screen.getByLabelText(/product name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/sku/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/purchase price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/selling price/i)).toBeInTheDocument();
  });

  it('shows validation errors on empty submit', async () => {
    const onSubmit = vi.fn();
    renderWithProviders(<ProductForm onSubmit={onSubmit} />);

    await userEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText(/product name is required/i)).toBeInTheDocument();
    });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits with valid data', async () => {
    const onSubmit = vi.fn();
    renderWithProviders(<ProductForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText(/product name/i), 'Test Product');
    await userEvent.type(screen.getByLabelText(/sku/i), 'TST-001');
    await userEvent.type(screen.getByLabelText(/purchase price/i), '10000');
    await userEvent.type(screen.getByLabelText(/selling price/i), '15000');

    await userEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Test Product',
          sku: 'TST-001',
        })
      );
    });
  });
});
```

### 14.3.3 Hook Test Example

```typescript
// features/products/hooks/__tests__/use-products.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProducts } from '../use-products';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

function createWrapper() {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };
}

describe('useProducts', () => {
  it('returns products list', async () => {
    const { result } = renderHook(
      () => useProducts({ page: 1, per_page: 15 }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.data).toBeDefined();
    expect(result.current.data?.meta).toBeDefined();
  });
});
```

### 14.3.4 Schema Test Example

```typescript
// features/products/schemas/__tests__/product-schema.test.ts
import { productSchema } from '../product-schema';

describe('productSchema', () => {
  it('validates a valid product', () => {
    const result = productSchema.safeParse({
      name: 'Test Product',
      sku: 'TST-001',
      unit_id: 1,
      purchase_price: 10000,
      selling_price: 15000,
    });

    expect(result.success).toBe(true);
  });

  it('rejects selling price less than purchase price', () => {
    const result = productSchema.safeParse({
      name: 'Test',
      sku: 'TST-001',
      unit_id: 1,
      purchase_price: 20000,
      selling_price: 10000,
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toContain('selling_price');
  });

  it('requires name and sku', () => {
    const result = productSchema.safeParse({
      unit_id: 1,
      purchase_price: 0,
      selling_price: 0,
    });

    expect(result.success).toBe(false);
  });
});
```

---

## 14.4 Coverage Targets

| Layer | Target | Critical Logic |
|---|---|---|
| **Backend Services** | 90%+ | 100% (purchase approval, stock adjustment, payment) |
| **Backend Feature Tests** | 85%+ | 100% (all CRUD + authorization scenarios) |
| **Frontend Components** | 80%+ | 100% (form validation, permission rendering) |
| **Frontend Hooks** | 85%+ | 100% (query hooks, mutation hooks) |
| **Frontend Schemas** | 100% | 100% (Zod validation — easy to cover) |
| **Frontend Utils** | 90%+ | 100% |

### Coverage Command

```bash
# Backend
composer pest -- --coverage --min=80

# Frontend
npx vitest --coverage --threshold 80
```

---

## 14.5 CI Pipeline

```yaml
# .github/workflows/tests.yml
name: Tests

on: [push, pull_request]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: shivammathur/setup-php@v2
        with: { php-version: 8.4 }
      - run: composer install
      - run: cp .env.example .env
      - run: php artisan key:generate
      - run: php vendor/bin/pest --coverage --min=80

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npx vitest --coverage --threshold 80
      - run: npm run build
```

---

--- _End of Phase 14 — Testing Strategy_ ---
