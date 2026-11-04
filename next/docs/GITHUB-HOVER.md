# GitHub hover preview

Reference: the user-supplied `Screen Recording 2026-11-04 at 6.05.55 PM.mov` (6.9 seconds; all 376 decoded frames inspected in sequential contact sheets, with full-resolution entrance/settled/exit frames inspected separately).

The recording's link hover remains immediate. The preview begins shortly afterward: the blurred profile footer appears first, the card expands upward, and the calendar cells resolve in a left-to-right wave. On leave the whole card fades and blurs rather than collapsing its calendar in reverse.

Implementation:

- The existing GitHub anchor, arrow, destination, and underline styling stay unchanged inside `GitHubHoverCard`.
- A 100 ms hover-intent delay precedes a 180 ms blur/fade entrance. Calendar height grows over 340 ms; cells resolve with column/row staggering. Exit uses a 100 ms pointer grace period and 180 ms fade/blur.
- Real activity comes from the existing `/api/github-contributions` endpoint. The preview opens at the latest activity and retains the entire available history in a horizontal scroller, with mouse dragging, trackpad scrolling, and keyboard arrow navigation. Sunday-aligned rows leave missing and future dates empty. Only the visible recent columns animate to avoid animating hundreds of offscreen cells.
- The footer uses the public GitHub profile photo. Name, handle, description, and month labels use larger text for readability.
- Requests are shared/cached for 15 minutes and warmed after initial paint. Failures are retryable and visibly reported rather than replaced with invented activity.
- The preview remains open when the pointer enters the card, opens on keyboard focus, closes with Escape, and has an associated accessible description. On touch, the link navigates normally without a first-tap hover interception. Reduced-motion preferences disable animation.
- The preview moves below its link when there is insufficient space above it. No document-flow height or link position changes on hover.

Verification: production build, strict TypeScript check, calendar/cache unit tests, and isolated Chrome and WebKit checks for the profile photo, all available history, latest-first positioning, mouse dragging, horizontal wheel scrolling, keyboard scrolling, unchanged link bounds/destination, pointer bridging, Escape, interruption/re-entry, and touch navigation. Both engines' visual previews were also captured with the real endpoint, not fixture contribution data.
