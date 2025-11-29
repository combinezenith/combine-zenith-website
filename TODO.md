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
