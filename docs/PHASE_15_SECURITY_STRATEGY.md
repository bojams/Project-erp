# PHASE 15: SECURITY STRATEGY — Hideo ERP

---

## 15.1 Security Layers

```
┌──────────────────────────────────────────────────────────────┐
│                    INPUT VALIDATION                            │
│  (Zod — client-side, Form Request — server-side)              │
├──────────────────────────────────────────────────────────────┤
│                    AUTHENTICATION                              │
│  (Laravel Sanctum — token-based)                              │
├──────────────────────────────────────────────────────────────┤
│                    AUTHORIZATION                               │
│  (Spatie RBAC — Policies + Gates)                             │
├──────────────────────────────────────────────────────────────┤
│                    CSRF PROTECTION                             │
│  (SameSite cookies, SPA token)                                │
├──────────────────────────────────────────────────────────────┤
│                    XSS PROTECTION                              │
│  (Output escaping, CSP headers)                               │
├──────────────────────────────────────────────────────────────┤
│                    SQL INJECTION PROTECTION                    │
│  (Eloquent ORM — parameterized queries)                       │
├──────────────────────────────────────────────────────────────┤
│                    RATE LIMITING                               │
│  (Laravel throttle middleware)                                │
├──────────────────────────────────────────────────────────────┤
│                    DATA ENCRYPTION                             │
│  (bcrypt passwords, HTTPS)                                    │
└──────────────────────────────────────────────────────────────┘
```

---

## 15.2 Authentication (Sanctum)

### Token-Based Auth Flow

```
1. POST /api/v1/auth/login
   - Validate credentials (email + password)
   - Check if user is active
   - Create Sanctum token with abilities
   - Log login attempt (success/failed)
   - Return { user, token }

2. Client stores token in Zustand store (persisted to localStorage)

3. Every subsequent request:
   - Axios interceptor attaches: Authorization: Bearer {token}
   - Server middleware: auth:sanctum

4. POST /api/v1/auth/logout
   - Revoke current token
   - Clear session
```

### Token Configuration

```php
// config/sanctum.php
'expiration' => 60 * 24, // 24 hours
'abilities' => ['*'],     // Can be scoped per user

// Token creation in AuthService
$token = $user->createToken($request->device_name, ['*'])->plainTextToken;
```

### Password Security

```php
// Password hashing — handled by Laravel (bcrypt)
// config/hashing.php
'bcrypt' => [
    'rounds' => 12,  // Cost factor
],

// Password validation rules
'password' => ['required', 'string', 'min:8', 'confirmed', Password::defaults()],
```

---

## 15.3 Authorization (Spatie RBAC)

### Policy Enforcement

```php
// In Controller
public function destroy(int $id): JsonResponse
{
    $product = $this->productService->getById($id);

    // Policy check
    $this->authorize('delete', $product);

    $this->productService->delete($id);

    return $this->success(null, 'Product deleted successfully');
}

// In Blade / Inertia (for reference)
@can('delete', $product)
  <button>Delete</button>
@endcan
```

### Permission Check — Frontend

```tsx
import { useAuthStore } from '@/stores/auth-store';

function can(permission: string): boolean {
  const user = useAuthStore.getState().user;
  return user?.permissions?.includes(permission) ?? false;
}

// In component
{can('create-products') && <Button>Add Product</Button>}
```

### Route Protection

```php
// routes/api.php
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('products', ProductController::class)
        ->middleware('can:viewAny,App\Models\Product');
});
```

```tsx
// Frontend route guard
<Route
  path="/users"
  element={
    <RequirePermission permission="view-users">
      <UsersPage />
    </RequirePermission>
  }
/>
```

---

## 15.4 CSRF Protection

```php
// config/sanctum.php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'localhost,localhost:3000'));

// Axios — send cookies with SPA requests
apiClient.defaults.withCredentials = true;
apiClient.defaults.withXSRFToken = true;
```

---

## 15.5 XSS Protection

```php
// Server-side — Blade auto-escapes {{ }} by default
// When returning JSON — API resources handle escaping

// Content Security Policy headers (via middleware)
header("Content-Security-Policy: default-src 'self'; script-src 'self'");

// Frontend — React auto-escapes by default
// Avoid dangerouslySetInnerHTML
```

---

## 15.6 SQL Injection Protection

```php
// GOOD — Eloquent ORM (parameterized queries)
Product::where('name', 'like', "%{$search}%")->get();

// GOOD — Query Builder (parameterized)
DB::table('products')->where('sku', $sku)->first();

// BAD — Raw SQL (avoid unless absolutely necessary)
DB::select("SELECT * FROM products WHERE sku = '{$sku}'");
```

---

## 15.7 Rate Limiting

```php
// app/Providers/AppServiceProvider.php
protected function configureRateLimiting(): void
{
    RateLimiter::for('api', function (Request $request) {
        return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
    });

    RateLimiter::for('auth', function (Request $request) {
        return Limit::perMinute(5)->by($request->ip());
    });
}

// routes/api.php
Route::post('auth/login', [AuthController::class, 'login'])
    ->middleware('throttle:auth');
```

---

## 15.8 Input Validation

### Server-side (Laravel Form Request)

```php
class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', Product::class);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:200'],
            'sku' => [
                'required',
                'string',
                'max:50',
                Rule::unique('products')
                    ->where('company_id', $this->user()->company_id)
                    ->ignore($this->route('product')),
            ],
            'selling_price' => ['required', 'numeric', 'min:0', 'gte:purchase_price'],
        ];
    }

    public function messages(): array
    {
        return [
            'selling_price.gte' => 'Selling price must be greater than or equal to purchase price.',
        ];
    }
}
```

### Client-side (Zod)

```typescript
export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(200),
  sku: z.string().min(1, 'SKU is required').max(50),
  selling_price: z.number().min(0, 'Price must be ≥ 0'),
}).refine(
  (data) => data.selling_price >= data.purchase_price,
  { message: 'Selling price must be ≥ purchase price', path: ['selling_price'] }
);
```

---

## 15.9 Sensitive Data Protection

| Data Type | Protection |
|---|---|
| Passwords | bcrypt (12 rounds) — never stored in plaintext |
| Tokens | Hashed in database (Sanctum) |
| API Keys | Stored in .env, never exposed |
| Personal Data | Not exposed in logs, not in URLs |
| Logs | Never log passwords, tokens, secrets |

```php
// app/Exceptions/Handler.php
public function register(): void
{
    $this->reportable(function (Throwable $e) {
        // Filter sensitive data from logs
        Log::error($e->getMessage(), [
            'exception' => get_class($e),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            // NO request data with passwords
        ]);
    });
}
```

---

## 15.10 Security Headers

```php
// app/Http/Middleware/SecurityHeadersMiddleware.php
public function handle(Request $request, Closure $next): Response
{
    $response = $next($request);

    $response->headers->set('X-Content-Type-Options', 'nosniff');
    $response->headers->set('X-Frame-Options', 'DENY');
    $response->headers->set('X-XSS-Protection', '1; mode=block');
    $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
    $response->headers->set('Permissions-Policy', 'camera=(), microphone=()');

    return $response;
}
```

---

## 15.11 Audit Trail

```php
// Every Create/Update/Delete operation:
ActivityLog::create([
    'company_id' => auth()->user()->company_id,
    'user_id' => auth()->id(),
    'action' => 'create',      // create | update | delete
    'module' => 'product',     // Module name
    'description' => "Created product '{$product->name}'",
    'old_values' => null,
    'new_values' => $product->toJson(),
    'ip_address' => request()->ip(),
    'user_agent' => request()->userAgent(),
]);
```

---

## 15.12 Security Checklist

| # | Item | Status |
|---|---|---|
| 1 | Password hashing (bcrypt) | ✅ |
| 2 | Token-based authentication (Sanctum) | ✅ |
| 3 | Role-based authorization (Spatie) | ✅ |
| 4 | Policy-based access control | ✅ |
| 5 | Input validation (server + client) | ✅ |
| 6 | CSRF protection | ✅ |
| 7 | XSS protection (React auto-escape) | ✅ |
| 8 | SQL injection protection (Eloquent) | ✅ |
| 9 | Rate limiting (auth + API) | ✅ |
| 10 | HTTPS enforcement | ✅ via deployment |
| 11 | Security headers (CSP, HSTS, X-Frame) | ✅ |
| 12 | Audit trail (activity logs) | ✅ |
| 13 | No sensitive data in logs | ✅ |
| 14 | Soft delete (data recovery) | ✅ |
| 15 | Company data isolation (company_id) | ✅ |

---

--- _End of Phase 15 — Security Strategy_ ---
