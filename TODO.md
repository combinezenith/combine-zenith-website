# ESLint Fixes TODO

## Masonry.tsx
- [ ] Fix useEffect missing dependency 'get' (line 13)
- [ ] Fix useLayoutEffect missing dependency 'containerRef' (line 222)

## TeamCard.tsx
- [ ] Rename 'children' prop to 'teamMembers' in DepartmentColumn component to avoid React children prop warning (multiple lines)

## TextType.tsx
- [ ] Remove unused 'getRandomSpeed' function (line 58)

## admin/team/page.tsx
- [ ] Escape unescaped apostrophe in string (line 118)

## services/page.tsx
- [ ] Remove unused 'isVisible' variable (line 18)
- [ ] Escape unescaped apostrophe in CTA text (line 264)
