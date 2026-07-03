# PHASE 16: PERFORMANCE STRATEGY — Hideo ERP

---

## 16.1 Performance Targets

| Metric | Target | Measurement |
|---|---|---|
| **Lighthouse Performance** | > 90 | Lighthouse CI |
| **First Contentful Paint (FCP)** | < 2s | Web Vitals |
| **Largest Contentful Paint (LCP)** | < 2.5s | Web Vitals |
| **Cumulative Layout Shift (CLS)** | < 0.1 | Web Vitals |
| **First Input Delay (FID)** | < 100ms | Web Vitals |
| **API Response Time (95th %)** | < 500ms | Laravel Telescope / New Relic |
| **Time to Interactive (TTI)** | < 3.5s | Lighthouse |

---

## 16.2 Backend Performance

### 16.2.1 Redis Cache Strategy

```php
// config/cache.php
'default' => env('CACHE_DRIVER', 'redis'),

// Caching expensive queries
class DashboardService
{
    public function getDashboardData(): array
    {
        $companyId = auth()->user()->company_id;
        $cacheKey = "dashboard.{$companyId}";

        return Cache::remember($cacheKey, 300, function () use ($companyId) {
            return [
                'revenue' => $this->getRevenue(),
                'expenses' => $this->getExpenses(),
                'statistics' => $this->getStatistics(),
                'low_stock' => $this->getLowStockProducts(),
            ];
        });
    }

    public function clearDashboardCache(): void
    {
        $companyId = auth()->user()->company_id;
        Cache::forget("dashboard.{$companyId}");
    }
}

// Cache invalidation on related model changes
class ProductObserver
{
    public function created(Product $product): void
    {
        Cache::forget("dashboard.{$product->company_id}");
    }
}
```

### 16.2.2 Query Optimization

```php
// N+1 Prevention — eager load relations
Purchase::with(['supplier:id,name', 'items.product:id,name,sku'])
    ->where('company_id', auth()->user()->company_id)
    ->latest()
    ->paginate(15);

// Selective columns — never SELECT *
Product::select(['id', 'name', 'sku', 'stock', 'selling_price'])
    ->where('is_active', true)
    ->get();

// Index utilization — query matching index order
// Index: idx_purchases_company_status (company_id, status)
Purchase::where('company_id', $companyId)
    ->where('status', PurchaseStatus::PENDING)
    ->get();
```

### 16.2.3 Database Indexes

All indexes defined in Phase 7 — Database Design. Key indexes:

| Table | Index | Type |
|---|---|---|
| `products` | `(company_id, sku)` | UNIQUE |
| `products` | `(stock, stock_minimum)` | BTREE |
| `purchases` | `(company_id, status)` | COMPOSITE |
| `sales` | `(company_id, order_date)` | COMPOSITE |
| `stock_movements` | `(product_id, created_at)` | COMPOSITE |

### 16.2.4 Database Transactions

```php
// Critical operations use transactions
DB::transaction(function () use ($sale) {
    $sale->save();
    $sale->items()->saveMany($items);
    $this->updateStock($items);  // Stock decrement
    $this->logActivity($sale);
}, 5); // 5 retries for deadlock
```

### 16.2.5 Queue for Heavy Operations

```php
// config/queue.php
'default' => env('QUEUE_CONNECTION', 'redis'),

// Jobs for heavy operations
class GenerateReportJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(): void
    {
        // Heavy report generation
        $report = $this->reportService->generate($this->filters);
        // Store result for download
    }
}

// Dispatch
GenerateReportJob::dispatch($filters);
```

---

## 16.3 Frontend Performance

### 16.3.1 Code Splitting & Lazy Loading

```typescript
// Route-level code splitting
const ProductsPage = lazy(() => import('@/features/products/pages/products-page'));
const ProductCreatePage = lazy(() => import('@/features/products/pages/product-create-page'));

// React Router with lazy routes
{
  path: '/products',
  element: <Suspense fallback={<LoadingState />}><ProductsPage /></Suspense>,
}
```

### 16.3.2 TanStack Query Caching

```typescript
// Global query configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,        // 30 seconds — data fresh
      gcTime: 5 * 60_000,       // 5 minutes — keep in cache
      retry: 2,                 // Retry failed requests twice
      refetchOnWindowFocus: true,
      placeholderData: keepPreviousData,  // Smooth pagination
    },
  },
});

// Specific query with longer cache
export function useProducts(filters: ProductFilters) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => productsApi.getAll(filters),
    staleTime: 60_000,  // Products list: 1 minute stale time
    placeholderData: keepPreviousData,
  });
}
```

### 16.3.3 Component Optimization

```typescript
// React.memo for expensive components
export const ProductTable = memo(function ProductTable({
  data,
  onEdit,
  onDelete,
}: ProductTableProps) {
  return (
    <Table>
      <TableHeader>...</TableHeader>
      <TableBody>
        {data.map((product) => (
          <ProductRow
            key={product.id}
            product={product}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </TableBody>
    </Table>
  );
});

// useMemo for computed values
const totalValue = useMemo(
  () => products.reduce((sum, p) => sum + p.stock * p.selling_price, 0),
  [products]
);

// useCallback for stable callbacks
const handleSort = useCallback((key: string) => {
  setSort((prev) => ({
    key,
    order: prev.key === key && prev.order === 'asc' ? 'desc' : 'asc',
  }));
}, []);
```

### 16.3.4 Asset Optimization

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router'],
          query: ['@tanstack/react-query'],
          ui: ['lucide-react', 'motion'],
        },
      },
    },
    target: 'es2020',
    minify: 'esbuild',
    cssMinify: true,
    sourcemap: false,
  },
});
```

### 16.3.5 Image Optimization

```tsx
// Use WebP format with fallback
<picture>
  <source srcSet={product.image.webp} type="image/webp" />
  <img
    src={product.image.fallback}
    alt={product.name}
    loading="lazy"
    decoding="async"
    className="w-full h-48 object-cover rounded-lg"
  />
</picture>
```

### 16.3.6 Bundle Size Monitoring

```bash
# Analyze bundle
npx vite-bundle-analyzer

# Track bundle size
"scripts": {
  "analyze": "vite-bundle-analyzer",
  "build": "vite build && vite-bundle-analyzer"
}
```

---

## 16.4 React Performance Rules

| Rule | Implementation |
|---|---|
| **Avoid unnecessary re-renders** | React.memo, useMemo, useCallback |
| **Code splitting** | React.lazy + Suspense at route level |
| **Virtualization** | For large lists (>100 items) — `@tanstack/react-virtual` |
| **Debounced search** | `useDebounce` hook (300ms delay) |
| **Pagination** | Server-side pagination (not loading all data) |
| **Optimistic updates** | TanStack Query `onMutate` for instant UI |
| **Prevent infinite loops** | Never call setState in useEffect without deps |
| **Avoid prop drilling** | Use Zustand for global state |

---

## 16.5 Performance Monitoring

```php
// Backend — Laravel Telescope (development)
composer require laravel/telescope --dev

// Production — key metrics to monitor:
// - Slow queries (> 100ms)
// - N+1 queries
// - Cache hit ratio
// - Queue throughput
// - API response time
```

```typescript
// Frontend — Web Vitals
import { onCLS, onFCP, onLCP, onTTFB } from 'web-vitals';

function sendToAnalytics(metric: Metric) {
  const body = JSON.stringify(metric);
  navigator.sendBeacon('/analytics', body);
}

onCLS(sendToAnalytics);
onFCP(sendToAnalytics);
onLCP(sendToAnalytics);
onTTFB(sendToAnalytics);
```

---

## 16.6 Lighthouse CI Configuration

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [pull_request]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
      - uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            http://localhost:4173/dashboard
          uploadArtifacts: true
          budgetPath: ./lighthouse-budget.json
```

```json
// lighthouse-budget.json
{
  "performance": 90,
  "accessibility": 90,
  "best-practices": 90,
  "seo": 90,
  "pwa": 50
}
```

---

--- _End of Phase 16 — Performance Strategy_ ---
