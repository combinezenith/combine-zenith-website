# TODO: Integrate Firebase on Services Pages with services.json Properties

## Steps to Complete

- [ ] Update ServiceCard.tsx to use 'name' instead of 'title' to match services.json
- [ ] Update DynamicServices page.tsx to use 'name' instead of 'title'
- [ ] Update ServiceApproach (FAQ.tsx) to handle approach as array of objects (id, title, content) instead of strings
- [ ] Update admin/services/page.tsx to use 'name' instead of 'title'
- [ ] Update ServiceForm component to use 'name' instead of 'title'
- [ ] Populate Firebase 'services' collection with data from services.json (excluding admin properties like 'status')
- [ ] Test the integration by verifying data display on services pages

## Notes
- Ignore admin-specific properties like 'status' in services.json
- Ensure approach is handled as objects with id, title, content
- Pillars are already handled correctly as they are in services.json
