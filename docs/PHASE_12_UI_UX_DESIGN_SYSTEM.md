# PHASE 12: UI/UX DESIGN SYSTEM — Hideo ERP

---

**Design Philosophy:** Professional, clean, enterprise-grade. Inspired by Stripe, Linear, Vercel, Notion, and GitHub.

---

## 12.1 Design Principles

| # | Principle | Description |
|---|---|---|
| 1 | **Clarity over Creativity** | UI harus jelas dan mudah dipahami, bukan "kreatif" yang membingungkan |
| 2 | **Hierarchy** | Visual hierarchy yang kuat — pengguna tahu apa yang penting pertama kali |
| 3 | **Consistency** | Setiap elemen yang sama harus terlihat dan berperilaku sama |
| 4 | **Whitespace** | Gunakan whitespace sebagai elemen desain, bukan ruang kosong |
| 5 | **Typography First** | Typography adalah fondasi visual — bukan gambar atau warna |
| 6 | **Accessibility** | Setiap keputusan desain harus mempertimbangkan aksesibilitas |
| 7 | **Data Density** | Tampilkan data sebanyak mungkin tanpa mengorbankan readability |
| 8 | **Progressive Disclosure** | Tampilkan informasi kompleks secara bertahap |

---

## 12.2 Color System

### Light Mode

```
Primary (#0F172A)  ■■■■■  — Headings, primary text
Secondary (#475569) ■■■■■  — Secondary text, labels
Muted (#94A3B8)    ■■■■■  — Placeholder, disabled
Border (#E2E8F0)    ■■■■■  — Borders, dividers
Background (#FFFFFF) ■■■■■ — Page background
Surface (#F8FAFC)  ■■■■■  — Card/section background

Accent (#3B82F6)   ■■■■■  — Primary action, links
Accent Hover (#2563EB) — Hover state
Accent Light (#EFF6FF) — Light accent background

Success (#10B981)  ■■■■■  — Stock in, paid, completed
Warning (#F59E0B)  ■■■■■  — Low stock, pending
Error (#EF4444)    ■■■■■  — Stock out, cancelled, errors
Info (#6366F1)     ■■■■■  — Informational badges
```

### Dark Mode

```
Primary (#F1F5F9)  ■■■■■  — Headings, primary text
Secondary (#94A3B8) ■■■■■  — Secondary text
Muted (#64748B)    ■■■■■  — Placeholder, disabled
Border (#1E293B)   ■■■■■  — Borders, dividers
Background (#0F172A) ■■■■■ — Page background
Surface (#1E293B)  ■■■■■  — Card/section background

Accent (#60A5FA)   ■■■■■  — Primary action (dark mode)
Success (#34D399)  ■■■■■  — Success state (dark mode)
Warning (#FBBF24)  ■■■■■  — Warning state (dark mode)
Error (#F87171)    ■■■■■  — Error state (dark mode)
```

### Status Colors (used in Badges)

| Status | Light Mode | Dark Mode |
|---|---|---|
| Pending | `bg-yellow-100 text-yellow-800` | `bg-yellow-900/30 text-yellow-400` |
| Approved / Completed | `bg-blue-100 text-blue-800` | `bg-blue-900/30 text-blue-400` |
| Received / Paid | `bg-green-100 text-green-800` | `bg-green-900/30 text-green-400` |
| Cancelled | `bg-red-100 text-red-800` | `bg-red-900/30 text-red-400` |
| Partial | `bg-orange-100 text-orange-800` | `bg-orange-900/30 text-orange-400` |

---

## 12.3 Typography System

### Font Stack

```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Type Scale

| Level | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| **h1** | 24px / 1.5rem | 700 (bold) | 1.2 | Page titles |
| **h2** | 20px / 1.25rem | 600 (semibold) | 1.3 | Section headers |
| **h3** | 18px / 1.125rem | 600 (semibold) | 1.4 | Card titles |
| **h4** | 16px / 1rem | 600 (semibold) | 1.4 | Sub-section |
| **body** | 14px / 0.875rem | 400 (regular) | 1.5 | Body text |
| **body-sm** | 13px / 0.8125rem | 400 (regular) | 1.5 | Table cells |
| **caption** | 12px / 0.75rem | 500 (medium) | 1.4 | Labels, helper text |
| **overline** | 11px / 0.6875rem | 600 (semibold) | 1.2 | Uppercase labels |

### Text Styles

```css
/* Tailwind config */
fontSize: {
  'xs': ['0.75rem', { lineHeight: '1rem' }],      /* caption */
  'sm': ['0.8125rem', { lineHeight: '1.25rem' }], /* body-sm */
  'base': ['0.875rem', { lineHeight: '1.5rem' }], /* body */
  'lg': ['1rem', { lineHeight: '1.5rem' }],       /* h4 */
  'xl': ['1.125rem', { lineHeight: '1.5rem' }],   /* h3 */
  '2xl': ['1.25rem', { lineHeight: '1.3rem' }],   /* h2 */
  '3xl': ['1.5rem', { lineHeight: '1.2rem' }],    /* h1 */
}
```

---

## 12.4 Spacing System

Menggunakan skala 4px Tailwind default:

| Token | Pixels | Usage |
|---|---|---|
| `space-1` | 4px | Dense padding |
| `space-2` | 8px | Small gap, icon padding |
| `space-3` | 12px | Button padding |
| `space-4` | 16px | Card padding, form spacing |
| `space-5` | 20px | Section spacing |
| `space-6` | 24px | Page margins |
| `space-8` | 32px | Large section spacing |
| `space-10` | 40px | Page section gaps |
| `space-12` | 48px | Major page sections |

### Layout Spacing Rules

```
Page Padding:         p-6 (24px)
Card Padding:         p-6 (24px)
Section Gap:          space-y-8 (32px)
Form Field Gap:       space-y-4 (16px)
Table Cell Padding:   px-4 py-3 (16px / 12px)
Button Padding:       px-4 py-2 (16px / 8px)
```

---

## 12.5 Component System

### 12.5.1 Cards

```css
.card {
  @apply bg-white dark:bg-slate-900
         rounded-xl
         border border-slate-200 dark:border-slate-800
         p-6;
}
```

**Usage:** Untuk konten utama seperti statistik, form sections, detail panels.

### 12.5.2 Buttons

| Variant | Usage |
|---|---|
| **Primary** (solid blue) | Main CTA — Create, Save, Submit |
| **Secondary** (outline) | Alternative action — Cancel, Back |
| **Ghost** (no border) | Tertiary action — Edit inline |
| **Danger** (solid red) | Destructive action — Delete |
| **Icon** | Icon-only buttons |

```
Primary:   bg-blue-600 hover:bg-blue-700 text-white
Secondary: border border-slate-300 hover:bg-slate-100 text-slate-700
Ghost:     hover:bg-slate-100 text-slate-700
Danger:    bg-red-600 hover:bg-red-700 text-white
Icon:      p-2 hover:bg-slate-100 rounded-lg
```

**Sizes:** `sm` (h-8), `default` (h-10), `lg` (h-12)

### 12.5.3 Input Fields

```css
.input {
  @apply w-full
         h-10
         px-3 py-2
         rounded-lg
         border border-slate-300 dark:border-slate-700
         bg-white dark:bg-slate-900
         text-sm
         placeholder:text-slate-400
         focus:outline-none
         focus:ring-2 focus:ring-blue-500 focus:border-blue-500
         disabled:bg-slate-50 disabled:text-slate-400;
}

.input-error {
  @apply border-red-500 focus:ring-red-500;
}

.label {
  @apply block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5;
}

.error-text {
  @apply text-xs text-red-600 mt-1.5;
}
```

### 12.5.4 Tables

| Element | Style |
|---|---|
| Header | `text-xs font-semibold text-slate-500 uppercase tracking-wider` |
| Row | `border-b border-slate-100 hover:bg-slate-50` |
| Cell | `py-3 px-4 text-sm text-slate-700` |
| Striped | Optional — `even:bg-slate-50` |

### 12.5.5 Sidebar

```
Desktop:
  Width: 256px (w-64)
  Background: bg-white dark:bg-slate-950
  Border: border-r border-slate-200
  Menu Item: px-3 py-2 rounded-lg text-sm
  Active: bg-slate-100 font-semibold text-slate-900
  Hover: bg-slate-50 text-slate-700
  Group Label: px-3 py-2 text-xs font-semibold text-slate-400 uppercase

Mobile:
  Drawer (Sheet component from shadcn)
  Full width, animated from left
  Overlay background
```

### 12.5.6 Modal / Dialog

```css
.dialog-overlay {
  @apply fixed inset-0 bg-black/50 backdrop-blur-sm;
}

.dialog-content {
  @apply fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
         w-full max-w-lg
         bg-white dark:bg-slate-900
         rounded-xl shadow-2xl
         p-6;
}
```

### 12.5.7 Badges

| Size | Style |
|---|---|
| `sm` | `px-1.5 py-0.5 text-xs rounded-md font-medium` |
| `default` | `px-2 py-1 text-xs rounded-md font-medium` |
| `lg` | `px-2.5 py-1 text-sm rounded-md font-medium` |

### 12.5.8 Tabs

```css
.tab-list {
  @apply flex border-b border-slate-200 space-x-1;
}

.tab-trigger {
  @apply px-4 py-2 text-sm font-medium
         text-slate-500 hover:text-slate-700
         border-b-2 border-transparent
         data-[state=active]:text-blue-600 data-[state=active]:border-blue-600;
}
```

### 12.5.9 Skeleton / Loading

```css
.skeleton {
  @apply animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800;
}
```

---

## 12.6 Page Layout System

### Standard Page Layout

```
┌────────────────────────────────────────────────────────┐
│  PageHeader                                            │
│  ┌──────────────────────────────────────────────────┐ │
│  │  Title                         [Action Button]   │ │
│  │  Description/Subtitle                             │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  Filter Bar                                            │
│  ┌──────────────────────────────────────────────────┐ │
│  │  [Search]  [Category ▼]  [Status ▼]  [Date ▼]   │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  DataTable / Content                                    │
│  ┌──────────────────────────────────────────────────┐ │
│  │  ┌─────┬──────────┬────────┬────────┬────────┐  │ │
│  │  │  #  │   Name   │ Price  │ Stock  │ Action │  │ │
│  │  ├─────┼──────────┼────────┼────────┼────────┤  │ │
│  │  │  1  │ Product  │ 3,500  │  500   │ [✏️][🗑️]│  │ │
│  │  └─────┴──────────┴────────┴────────┴────────┘  │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  Pagination                                            │
│  ┌──────────────────────────────────────────────────┐ │
│  │  Showing 1-15 of 100    [<] [1] [2] [3] [>]    │ │
│  └──────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

### Form Page Layout

```
┌────────────────────────────────────────────────────────┐
│  PageHeader (Back button + Title)                       │
│                                                        │
│  Form Card                                             │
│  ┌──────────────────────────────────────────────────┐ │
│  │  Section Title                                    │ │
│  │  ┌────────────────────────────────────────────┐  │ │
│  │  │  Field Label                                │  │ │
│  │  │  [ Input Field                 ]            │  │ │
│  │  │  Error text                                 │  │ │
│  │  └────────────────────────────────────────────┘  │ │
│  │                                                    │ │
│  │  ┌────────────────────┐ ┌────────────────────┐  │ │
│  │  │  Field Label       │ │  Field Label       │  │ │
│  │  │  [ Input    ]      │ │  [ Input    ]      │  │ │
│  │  └────────────────────┘ └────────────────────┘  │ │
│  │                                                    │ │
│  │  ┌────────────────────────────────────────────┐  │ │
│  │  │  [Cancel]                    [Save]        │  │ │
│  │  └────────────────────────────────────────────┘  │ │
│  └──────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

---

## 12.7 Dark Mode Strategy

Implementasi menggunakan `next-themes` atau `class`-based toggling via Tailwind CSS `dark:` modifier.

```css
/* tailwind.config.js */
darkMode: 'class',

/* components/ui/button.tsx */
<button className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" />

/* Theme toggle in header */
<button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
  {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
</button>
```

**Rules:**
- Semua komponen harus memiliki `dark:` variant
- Gunakan CSS variables untuk warna yang sering berubah
- Smooth transition untuk theme switch (`transition-colors duration-200`)

---

## 12.8 Icon Usage

- **Library:** Lucide React (konsisten dengan AGENTS.md)
- **Size:** `h-4 w-4` (16px) untuk menu icons, `h-5 w-5` (20px) untuk buttons
- **Stroke width:** default (2px)
- **Color:** `text-slate-500` untuk icons, `text-blue-600` untuk active state

---

## 12.9 Animation Guidelines

- **Library:** Motion (framer-motion)
- **Durasi:** 150ms — micro-interactions, 300ms — page transitions
- **Easing:** `ease-out` untuk enter, `ease-in` untuk exit
- **Penggunaan minimum** — hanya untuk transisi bermakna
- **`prefers-reduced-motion`** harus dihormati

```tsx
// Page transitions
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -10 }}
  transition={{ duration: 0.2 }}
>
  <Content />
</motion.div>
```

---

## 12.10 Accessibility

| Requirement | Implementation |
|---|---|
| **Semantic HTML** | `<nav>`, `<main>`, `<header>`, `<section>`, `<table>`, `<form>` |
| **Labels** | Setiap input wajib `<label>` atau `aria-label` |
| **Keyboard Nav** | Tab order logis, focus visible styles |
| **Screen Reader** | `sr-only` untuk visually hidden text, `aria-live` untuk dynamic content |
| **Color Contrast** | Minimum 4.5:1 untuk normal text, 3:1 untuk large text (WCAG AA) |
| **Focus Ring** | `focus-visible:ring-2 focus-visible:ring-blue-500` |
| **Reduced Motion** | `@media (prefers-reduced-motion: reduce)` |
| **Error Announcement** | `role="alert"` pada error messages |

---

## 12.11 Component Inventory (shadcn/ui)

Berikut adalah komponen shadcn/ui yang akan digunakan:

| Komponen | Usage |
|---|---|
| Button | All action buttons |
| Input, Textarea | Form fields |
| Select | Dropdown selections |
| Table | Data tables |
| Card | Content containers |
| Dialog | Modals, confirmations |
| Sheet | Mobile sidebar drawer |
| DropdownMenu | Action menus, user menu |
| Avatar | User profile images |
| Badge | Status indicators |
| Tabs | Tab navigation |
| Separator | Visual dividers |
| Skeleton | Loading states |
| Toast | Notifications |
| Tooltip | Hover hints |
| Popover | Inline menus |
| Command | Command palette / search |
| Alert | Alert messages |
| Progress | Progress indicators |
| Calendar | Date picker |

---

--- _End of Phase 12 — UI/UX Design System_ ---
