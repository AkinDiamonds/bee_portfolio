# Production readiness audit

## Resolved

- Direct visits remain at the top of the page. The testimonial rail never calls document-level scrolling; only its horizontal rail moves after deliberate selection.
- Testimonial selection is user-driven, keyboard-accessible, wraps at both ends, centers the active avatar, and uses lazy image loading for larger collections.
- Motion is restrained and honours `prefers-reduced-motion`. Project media no longer autoplay or loop.
- The approved section rhythm is restored in `globals.css`; missing typography tokens are defined there.
- Featured Projects now has a proper heading and meets contrast requirements in the production browser scan.
- The SEO framework is intentionally pre-launch: no indexing, no crawler access, no sitemap URLs, and `TODO:` metadata until approved identity and canonical-domain inputs are supplied.
- Automated coverage includes initial-scroll regression, testimonial keyboard wraparound, whole-route serious/critical axe scans, responsive overflow, and console errors.

## Deferred content decisions

- Supply the final public portfolio title, positioning statement, canonical domain, social image, and approved structured-data claims before removing `noindex` and populating the sitemap.
- Replace all `TODO:` contact/content destinations with approved data before launch.

## Engineering follow-up

- The existing navigation and project-card modules remain larger than the repository's preferred 150-line component limit, and legacy token references still use Tailwind arbitrary-property syntax in several files. The active design values resolve from `globals.css`, but a dedicated component-extraction/token-class cleanup is still advisable before long-term maintenance.
