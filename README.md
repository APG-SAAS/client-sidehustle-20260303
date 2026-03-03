# Side Hustle

Simple job tracker for side-income work. Track invoices, job status, paid totals, and export for tax reporting.

## What it does
- Add jobs with client + amount
- Toggle invoiced / started / completed / paid
- Quick filters for invoiced, completed, paid
- Export CSV + printable PDF

## Folder structure
- `src/app/page.tsx` → main UI
- `src/app/globals.css` → styles + print rules

## Run locally
```bash
pnpm install
pnpm dev
```

## Export
- CSV export for accountant
- PDF export via browser print
