<<<<<<< HEAD
# Linting Errors Fix Plan

## HeroSection.tsx
- [x] Replace 'any' type with proper interface for Firestore data
- [x] Replace <img> with Next.js <Image> component
- [x] Escape apostrophes in JSX text

## dashboard/page.tsx
- [x] Wrap fetchAll in useCallback and add to useEffect dependencies

## admin/home/page.tsx
- [x] Define proper types for Firestore data instead of 'any'
- [x] Change error handling from 'any' to 'unknown'

## Verification
- [x] Run linting to check all errors are resolved
- [ ] Test application functionality
=======
# Contact Inquiries Admin Panel Task

- [x] Create API route for sending emails (src/app/api/send-email/route.ts)
- [x] Update admin contact page to fetch and display inquiries (src/app/(pages)/admin/contact/page.tsx)
- [x] Add reply modal/form in the admin page
- [x] Integrate email sending with the reply functionality
- [x] Add view dialog for full inquiry details
>>>>>>> 4c7705363112a00da02a00b1567cc6fc8f7f5787
