# TODO: Fix Build Errors and Warnings

## Critical Errors (Build Failing)
- [ ] Fix type error in `src/app/(pages)/portfolio/[id]/page.tsx`: Update params type to Promise and await params (Next.js 15 compatibility)

## Warnings to Fix
- [ ] Replace `<img>` with `<Image>` from next/image in `src/app/(components)/ServiceWorksGallery.tsx`
- [ ] Remove unused imports (`Clock`, `Handshake`, `DollarSign`) in `src/app/(pages)/admin/dashboard/page.tsx`
- [ ] Add `fetchAll` to useEffect dependency array in `src/app/(pages)/admin/dashboard/page.tsx`
- [ ] Remove unused import `TextType` in `src/app/(pages)/services/page.tsx`
