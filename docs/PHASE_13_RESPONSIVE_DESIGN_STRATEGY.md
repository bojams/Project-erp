# PHASE 13: RESPONSIVE DESIGN STRATEGY — Hideo ERP

---

**Approach:** Mobile First Design

---

## 13.1 Breakpoints

```css
/* Tailwind CSS v4 breakpoints */
sm:  640px    /* Mobile large */
md:  768px    /* Tablet */
lg:  1024px   /* Laptop */
xl:  1280px   /* Desktop */
2xl: 1536px   /* Ultrawide */
```

### Device Matrix

| Device | Width | Breakpoint | Layout |
|---|---|---|---|
| Mobile S | 320px | `default` | Single column, bottom nav |
| Mobile L | 375-425px | `default` | Single column, bottom nav |
| Tablet | 768px | `md` | 2-column, collapsible sidebar |
| Laptop | 1024px | `lg` | Sidebar + content |
| Desktop | 1280px | `xl` | Sidebar + full content |
| Ultrawide | 1920px+ | `2xl` | Max-width container (1440px) |

---

## 13.2 Responsive Navigation

| Device | Sidebar | Header | Navigation |
|---|---|---|---|
| Mobile (< 768px) | Hidden (drawer) | Compact (h-14) | **Bottom Tab Bar** (5 tabs) |
| Tablet (768-1024px) | Collapsible (icons only) | Normal (h-16) | Sidebar + Bottom Nav hidden |
| Desktop (1024px+) | Fixed (w-64) | Normal (h-16) | Full sidebar menu |

### Mobile Bottom Navigation

```
┌──────────────────────────────────────────────────────┐
│                                                       │
│                    CONTENT                             │
│                                                       │
├──────────────────────────────────────────────────────┤
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  │
│  │ 📊   │  │ 📦   │  │ 📋   │  │ 📄   │  │ ⚙️   │  │
│  │Home  │  │ Stock │  │Trans │  │Report│  │ More │  │
│  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘  │
└──────────────────────────────────────────────────────┘
```

### Tablet Collapsible Sidebar

```
┌──────┬──────────────────────────────────────────────┐
│      │  HEADER                                       │
│  📌  ├──────────────────────────────────────────────┤
│  📊  │                                              │
│  👥  │           CONTENT                             │
│  📦  │                                              │
│  📋  │                                              │
│  🔔  │                                              │
│  ⚙️  │                                              │
└──────┴──────────────────────────────────────────────┘
```

---

## 13.3 Responsive Tables

### Desktop (>= 1024px) — Full Table

| # | Product | Price | Stock | Status | Actions |
|---|---|---|---|---|---|
| 1 | Indomie | 3,500 | 500 | ✅ Active | ✏️ 🗑️ |
| 2 | Aqua | 2,000 | 0 | ❌ Inactive | ✏️ 🗑️ |

### Mobile (< 768px) — Card Layout

```
┌────────────────────────────────────────────────┐
│  Indomie Goreng                      🔴 Low    │
│  SKU: IDM-001  │  Stock: 2                      │
│  Price: Rp 3,500                                │
│  ┌────────┐ ┌────────┐                          │
│  │  Edit  │ │ Delete │                          │
│  └────────┘ └────────┘                          │
├────────────────────────────────────────────────┤
│  Aqua                                       ✅ │
│  SKU: AQU-001  │  Stock: 100                    │
│  Price: Rp 2,000                                │
│  ┌────────┐ ┌────────┐                          │
│  │  Edit  │ │ Delete │                          │
│  └────────┘ └────────┘                          │
└────────────────────────────────────────────────┘
```

### Responsive Table Strategy (Code)

```tsx
// components/responsive-table.tsx
export function ResponsiveTable<T>(props: TableProps<T>) {
  return (
    <>
      {/* Desktop: full table */}
      <div className="hidden md:block">
        <DataTable {...props} />
      </div>
      {/* Mobile: card layout */}
      <div className="md:hidden space-y-3">
        {props.data.map((item) => (
          <MobileCard key={item.id} data={item} columns={props.columns} />
        ))}
      </div>
    </>
  );
}
```

---

## 13.4 Responsive Forms

| Element | Desktop (>= 768px) | Mobile (< 768px) |
|---|---|---|
| Field layout | 2-column grid `grid-cols-2` | Single column |
| Buttons | Inline (side by side) | Full width, stacked |
| Modal width | `max-w-lg` (512px) | Full screen minus padding |
| Date picker | Inline calendar | Bottom sheet |
| Select | Native dropdown | Native picker |

### Form Width

```tsx
// Form container
<div className="mx-auto w-full md:max-w-2xl lg:max-w-3xl space-y-8">
  <form>...</form>
</div>
```

---

## 13.5 Responsive Dashboard

```
Mobile (< 768px):
┌─────────────────────────┐
│  Revenue Today           │
│  Rp 5,000,000  ▲12.5%   │
├─────────────────────────┤
│  Expense Today           │
│  Rp 500,000              │
├─────────────────────────┤
│  Statistics              │
│  150 Produk │ 85 Cust   │
├─────────────────────────┤
│  Low Stock Alert         │
│  ┌─────────────────────┐│
│  │ Indomie — Stok: 2  ││
│  │ Aqua — Stok: 0     ││
│  └─────────────────────┘│
├─────────────────────────┤
│  Recent Activity         │
│  ┌─────────────────────┐│
│  │ 10:30 — SO created ││
│  │ 10:15 — PO approved││
│  └─────────────────────┘│
└─────────────────────────┘

Tablet (768-1024px — 2 columns):
┌─────────────────┬─────────────────┐
│  Revenue Card   │  Expense Card   │
├─────────────────┴─────────────────┤
│  Statistics (4 cards inline)       │
├─────────────────┬─────────────────┤
│  Low Stock      │  Activity       │
└─────────────────┴─────────────────┘

Desktop (1024px+ — 3+ columns):
┌──────────┬──────────┬──────────┐
│ Revenue  │ Expense  │ Stats    │
├──────────┴──────────┴──────────┤
│  Chart (full width)            │
├──────────┬─────────────────────┤
│ Low Stck │  Recent Activity    │
└──────────┴─────────────────────┘
```

### Dashboard Grid

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
  <StatCard title="Revenue" ... />
  <StatCard title="Expense" ... />
  <StatCard title="Products" ... />
  <StatCard title="Customers" ... />
</div>
```

---

## 13.6 Responsive Data Display

### Pagination

```
Desktop:
[<] [1] [2] [3] [4] [5] ... [10] [>]

Mobile:
[<]  Page 1 of 10  [>]
```

### Filters

```
Desktop:
[Search...]  [Category ▼]  [Status ▼]  [Date ▼]  [Apply]

Mobile:
[Search...]  [▼ Filters (2 active)]
             → Opens filter drawer (Sheet)
```

### Actions

```
Desktop: Icon buttons inline (✏️ 🗑️)
Mobile:  "..." menu → Dropdown
```

---

## 13.7 Responsive Images & Media

```css
img {
  @apply max-w-full h-auto;
  /* Responsive images */
}
```

---

## 13.8 Responsive Typography

```css
/* Fluid typography with clamp() */
h1 { font-size: clamp(1.25rem, 4vw, 1.5rem); }
h2 { font-size: clamp(1.125rem, 3vw, 1.25rem); }
body { font-size: clamp(0.8125rem, 2vw, 0.875rem); }
```

---

## 13.9 Testing Responsiveness

| Tool | Method |
|---|---|
| Browser DevTools | Chrome/Firefox responsive mode — test all breakpoints |
| Physical devices | Test on real mobile, tablet, laptop |
| Viewport resizing | Manual resize from 320px to 1920px |
| Touch testing | Verify touch targets >= 44x44px on mobile |

---

--- _End of Phase 13 — Responsive Design Strategy_ ---
