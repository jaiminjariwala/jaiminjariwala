# GitHub hover preview

Reference: the user-supplied `Screen Recording 2026-11-04 at 6.05.55 PM.mov` (6.9 seconds; all 376 decoded frames inspected in sequential contact sheets, with full-resolution entrance/settled/exit frames inspected separately).

The recording's link hover remains immediate. The preview begins shortly afterward: the blurred profile footer appears first, the card expands upward, and the calendar cells resolve in a left-to-right wave. On leave the whole card fades and blurs rather than collapsing its calendar in reverse.

Implementation:

- The existing GitHub anchor, arrow, destination, and underline styling stay unchanged inside `GitHubHoverCard`.
- A 100 ms hover-intent delay precedes a 180 ms blur/fade entrance. Calendar height grows over 340 ms; cells resolve with column/row staggering. Exit uses a 100 ms pointer grace period and 180 ms fade/blur.
- Real activity comes from the existing `/api/github-contributions` endpoint. The previous full contribution graph remains intact. The preview shows the latest 17 Sunday-aligned weeks, including incomplete weeks without manufacturing future contribution counts.
- Requests are shared/cached for 15 minutes and warmed after initial paint. Failures are retryable and visibly reported rather than replaced with invented activity.
- The preview remains open when the pointer enters the card, opens on keyboard focus, closes with Escape, and has an associated accessible description. On touch, the link navigates normally without a first-tap hover interception. Reduced-motion preferences disable animation.
- The preview moves below its link when there is insufficient space above it. No document-flow height or link position changes on hover.

Verification: production build, strict TypeScript check, calendar/cache unit tests, and isolated headless Chrome checks for hover, unchanged link bounds/destination, pointer bridging, Escape, keyboard focus, interruption/re-entry, and touch navigation. The visual preview was also captured with the real endpoint, not fixture contribution data.
