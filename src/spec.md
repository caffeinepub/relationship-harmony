# Specification

## Summary
**Goal:** Replace manual partner forms with an invitation link system that allows users to generate shareable links for partners to join their relationship automatically after signing up.

**Planned changes:**
- Create backend data structure for invitation codes with expiration and usage tracking
- Implement backend functions to generate unique invitation links and validate codes
- Replace AddPartnerModal and PartnerForm with invitation link generation interface
- Create frontend component to display and copy invitation links
- Build signup flow that accepts invitation codes from URLs and automatically joins partners to relationships after authentication
- Add React Query hooks for invitation operations with proper cache invalidation

**User-visible outcome:** Users can generate invitation links and share them with partners, who can then click the link, sign up with Internet Identity, and automatically join the relationship without manual forms.
