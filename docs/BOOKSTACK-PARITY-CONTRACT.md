# BookStack to Kecktech Website Parity Contract

This contract defines a strict pass/fail baseline for `help.kecktech.net`.
Source of truth for visual parity:

- `f:/Github/Dashboard/website/src/components/Header.astro`
- `f:/Github/Dashboard/website/src/styles/global.css`

## Scope

The following areas must match the Kecktech website:

1. Header shell and navigation.
2. Link set, order, and active styling.
3. Top-right CTA behavior and styling.
4. Home/dashboard content cards and list styling.
5. Mobile nav behavior and spacing.

## Parity Checklist

### Header Frame

- [ ] Header background is `#1E3A5F`.
- [ ] Header height is 68px on desktop.
- [ ] Header uses centered container width and horizontal padding matching website rhythm.
- [ ] Header has subtle drop shadow equivalent to website.

### Brand Area

- [ ] Logo asset is the white Kecktech logo variant.
- [ ] Logo vertical alignment matches website.
- [ ] Home icon link is visible and clickable, with same hover/active behavior as nav links.

### Navigation Links

- [ ] Links appear in this exact order: Home, About, Services, Pricing, Help, Contact.
- [ ] Font family is `Poppins`; size 15px; weight 500.
- [ ] Default text color is white with 0.85-0.90 opacity.
- [ ] Hover and active color is `#C07810`.
- [ ] Link pill padding is 8px x 14px.
- [ ] Border radius is 4px.

### CTA Button

- [ ] CTA text is `Customer Login`.
- [ ] CTA includes user icon on the left.
- [ ] CTA background is `#C07810`.
- [ ] CTA text color is navy (`#1E3A5F`) at rest.
- [ ] CTA hover background darkens and text turns white.
- [ ] CTA border radius is 6px and remains on all breakpoints.

### Article/Content List Area

- [ ] Listing cards use 10px radius.
- [ ] Typography uses `Open Sans` for body text.
- [ ] Base body size is 18px with readable line height.
- [ ] Card spacing and gutters mirror website card rhythm.
- [ ] Link styles are gold, with clear hover differentiation.
- [ ] Senior-facing readability rules are preserved (high contrast, clear tap targets).

### Mobile Behavior

- [ ] Header collapses to hamburger on small screens.
- [ ] Mobile menu spacing and typography match website rules.
- [ ] Link tap targets are at least 48px tall.
- [ ] CTA remains visible and functional in mobile navigation.

## Acceptance Gate

Track 1 (BookStack parity) is considered successful only if all checklist items pass on:

- Desktop: 1366x768 and 1920x1080
- Tablet: 768x1024
- Mobile: 390x844

Any failed non-negotiable item caused by BookStack structural limits triggers Track 2 (custom wiki fallback).
