# Future Bee Integration Contract

The static footer owns the landing surface only. It does not render a bee,
start an animation, manage interaction, or own a bee lifecycle.

## Landing pad

- Target `#bee-landing-pad` (also marked with `data-bee-landing-zone="center"`).
- The element is the O glyph in the `SIMEON.` wordmark and has `position: relative`
  with an inline-block coordinate plane.
- The landing point is the center of the element: `50%` horizontal and `50%`
  vertical. Use the element's live `getBoundingClientRect()` at placement time
  so the bee remains aligned across responsive font sizes.
- The target has a minimum inline size of 48px on mobile and scales with the
  wordmark on larger viewports.

Keep the bee's DOM, animation, state, and accessibility behavior in the future
bee component. The footer should remain a stable host and must not acquire bee
runtime responsibilities.
