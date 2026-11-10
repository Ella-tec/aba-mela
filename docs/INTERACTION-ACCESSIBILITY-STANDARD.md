# Mela interaction and accessibility standard

This checklist applies to every current and future page in Mela.

## Navigation and actions
- Use React Router `Link` for navigation and `button type="button"` for actions.
- Every button must have a real handler. Do not leave decorative or placeholder buttons in the UI.
- Every icon-only control must have an accessible name and a visible keyboard-focus state.
- Use `aria-expanded`, `aria-pressed`, and `aria-current` when a control exposes that state.
- Do not use clickable `div` or `span` elements.
- Keep unknown routes on an accessible not-found page; do not silently redirect users to an unrelated page.

## KPI cards
- Use `src/components/ui/MetricCard.tsx` for navigable KPI cards.
- Every KPI card must open the relevant list, detail, report, or filtered view.
- If a KPI is a filter rather than navigation, implement it as a real button with `aria-pressed` and update the visible records.

## Forms and data
- Associate every input with a visible or screen-reader label.
- Validate required fields before submission and show errors with `role="alert"`.
- Show loading and disabled states during asynchronous requests.
- Confirm successful actions with an accessible live region.
- Connect important workflows to the API where endpoints exist.
- If an endpoint does not exist, label the interaction as demo-only and never imply that data was saved to the server or that money was charged.

## Tables and content
- Use semantic table headers with `scope="col"`.
- Give empty states and filtered-empty states a clear explanation.
- Keep status text visible; do not rely on color alone.
- Keep sample records clearly identified as illustrative data.

## Keyboard and responsive behavior
- All interactive elements must be reachable and usable with a keyboard.
- Preserve visible focus indicators.
- Provide meaningful labels for navigation landmarks and page headings.
- Test mobile navigation, narrow screens, and RTL layouts.

## Before merging a new page
- [ ] Route is registered and direct deep links render.
- [ ] Every link has a valid destination.
- [ ] Every button performs its advertised action.
- [ ] KPI cards navigate or filter correctly.
- [ ] Forms validate, report errors, and confirm success.
- [ ] Icon-only controls have accessible names.
- [ ] Keyboard focus and mobile layout are usable.
- [ ] Demo-only limitations are clearly stated.
- [ ] `npm run build` and `npm run lint` pass.
