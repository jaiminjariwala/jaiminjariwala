"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import styles from "./GitHubContributions.module.css";

const PROFILE_URL = "https://github.com/jaiminjariwala";
const REFRESH_INTERVAL_MS = 15 * 60 * 1000;
const RETRY_INTERVAL_MS = 60 * 1000;
const REQUEST_TIMEOUT_MS = 12 * 1000;
const STALE_AFTER_MS = 2 * 60 * 60 * 1000;
const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});
const MONTH_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  timeZone: "UTC",
});
const LOADING_WEEKS = Array.from({ length: 53 }, (_, index) => ({
  key: `loading-${index}`,
  days: Array(7).fill(null),
}));

function parseUtcDate(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;

  const parsed = new Date(`${date}T00:00:00Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getWeekKey(date) {
  const weekStart = new Date(date);
  weekStart.setUTCDate(weekStart.getUTCDate() - weekStart.getUTCDay());
  return weekStart.toISOString().slice(0, 10);
}

function buildCalendar(contributions) {
  const validDays = contributions
    .map((day) => ({ ...day, parsedDate: parseUtcDate(day.date) }))
    .filter((day) => day.parsedDate)
    .sort((a, b) => a.date.localeCompare(b.date));
  // The calendar ends at the last real contribution day; tooltips near the
  // right edge anchor rightward in CSS instead of relying on filler tiles.
  const calendarDays = validDays;

  const weekMap = new Map();

  calendarDays.forEach((day) => {
    const weekKey = getWeekKey(day.parsedDate);

    if (!weekMap.has(weekKey)) {
      weekMap.set(weekKey, { key: weekKey, days: Array(7).fill(null) });
    }

    weekMap.get(weekKey).days[day.parsedDate.getUTCDay()] = day;
  });

  const weeks = Array.from(weekMap.values()).sort((a, b) =>
    a.key.localeCompare(b.key)
  );
  const weekIndexes = new Map(
    weeks.map((week, index) => [week.key, index])
  );
  const monthMap = new Map();

  calendarDays.forEach((day) => {
    const monthKey = day.date.slice(0, 7);

    if (!monthMap.has(monthKey)) {
      monthMap.set(monthKey, {
        key: monthKey,
        label: MONTH_FORMATTER.format(day.parsedDate),
        weekIndex: weekIndexes.get(getWeekKey(day.parsedDate)),
      });
    }
  });

  return { weeks, months: Array.from(monthMap.values()) };
}

function getDayDetails(day) {
  const contributionLabel =
    day.count === 0
      ? "No contributions"
      : `${day.count.toLocaleString()} ${day.count === 1 ? "contribution" : "contributions"
      }`;
  const dateLabel = DATE_FORMATTER.format(day.parsedDate);

  return {
    contributionLabel,
    dateLabel,
    accessibleLabel: `${contributionLabel} on ${dateLabel}`,
  };
}

function isPayloadStale(updatedAt) {
  const updatedTimestamp = Date.parse(updatedAt);
  return (
    Number.isNaN(updatedTimestamp) ||
    Date.now() - updatedTimestamp > STALE_AFTER_MS
  );
}

const GitHubContributions = () => {
  const [state, setState] = useState({
    status: "loading",
    data: null,
    stale: false,
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const sectionRef = useRef(null);
  const viewportRef = useRef(null);
  const weeksRef = useRef(null);
  const openTooltipRef = useRef(null);
  const tooltipBodyLeftRef = useRef(null);
  const calendar = useMemo(
    () => buildCalendar(state.data?.contributions ?? []),
    [state.data]
  );
  const isReady = state.status === "success";
  const displayedWeeks = isReady ? calendar.weeks : LOADING_WEEKS;
  const profileUrl = state.data?.profileUrl || PROFILE_URL;

  useEffect(() => {
    let isActive = true;
    let refreshTimer;
    let activeController;

    const loadContributions = async () => {
      const controller = new AbortController();
      activeController = controller;
      const timeoutTimer = window.setTimeout(
        () => controller.abort(),
        REQUEST_TIMEOUT_MS
      );
      let nextDelay = RETRY_INTERVAL_MS;

      try {
        const response = await fetch("/api/github-contributions", {
          cache: "no-store",
          signal: controller.signal,
        });
        const payload = await response.json();

        if (!response.ok || !Array.isArray(payload.contributions)) {
          throw new Error(payload.error || "Unable to load GitHub activity.");
        }

        if (isActive) {
          setState({
            status: "success",
            data: payload,
            stale: isPayloadStale(payload.updatedAt),
          });
        }
        nextDelay = REFRESH_INTERVAL_MS;
      } catch (error) {
        if (isActive) {
          setState((current) =>
            current.data
              ? { ...current, stale: true }
              : {
                status: "error",
                data: null,
                stale: false,
                message:
                  error instanceof Error
                    ? error.message
                    : "Unable to load GitHub activity.",
              }
          );
        }
      } finally {
        window.clearTimeout(timeoutTimer);
        if (activeController === controller) activeController = undefined;

        if (isActive) {
          refreshTimer = window.setTimeout(loadContributions, nextDelay);
        }
      }
    };

    loadContributions();

    return () => {
      isActive = false;
      window.clearTimeout(refreshTimer);
      activeController?.abort();
    };
  }, []);

  useLayoutEffect(() => {
    if (!isReady || !viewportRef.current || !weeksRef.current) return;

    const viewport = viewportRef.current;
    const weeks = weeksRef.current;
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    let firstFrame;
    let secondFrame;

    const alignMobileRightEdge = () => {
      if (!mobileQuery.matches) return;

      firstFrame = window.requestAnimationFrame(() => {
        secondFrame = window.requestAnimationFrame(() => {
          // Align to the content box: the scroller carries horizontal padding
          // purely to widen its clip box for tooltips.
          const paddingRight =
            parseFloat(window.getComputedStyle(viewport).paddingRight) || 0;
          const viewportRight =
            viewport.getBoundingClientRect().right - paddingRight;
          const weeksRight = weeks.getBoundingClientRect().right;
          const tileEdgeOffset = weeksRight - viewportRight;
          const targetScrollLeft = viewport.scrollLeft + tileEdgeOffset;

          viewport.scrollLeft = Math.max(
            0,
            Math.min(
              targetScrollLeft,
              viewport.scrollWidth - viewport.clientWidth
            )
          );
        });
      });
    };

    alignMobileRightEdge();
    window.addEventListener("resize", alignMobileRightEdge);

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      window.removeEventListener("resize", alignMobileRightEdge);
    };
  }, [isReady, calendar.weeks.length]);

  // Tap-opened tooltips: the body clamps inside the window and the arrow
  // slides to point at the selected tile. While a tooltip is open, tapping a
  // nearby tile keeps the body exactly where it is — only the content and
  // the arrow move; the body relocates only when the new tile is beyond the
  // arrow's reach (or the tooltip chain was closed in between).
  useLayoutEffect(() => {
    const previous = openTooltipRef.current;
    if (previous) {
      previous.classList.remove(styles.tooltipAdjusted);
      previous.style.removeProperty("--tooltip-left");
      previous.style.removeProperty("--tooltip-arrow-left");
      openTooltipRef.current = null;
    }

    if (!selectedDate) {
      tooltipBodyLeftRef.current = null;
      return;
    }
    const section = sectionRef.current;
    if (!section) return;
    const tooltip = section.querySelector(`.${styles.tooltipOpen}`);
    const wrap = tooltip?.parentElement;
    if (!tooltip || !wrap) return;

    const wrapRect = wrap.getBoundingClientRect();
    const width = tooltip.offsetWidth;
    // The real clipping context is the window (the mobile scroller's clip
    // box is widened to the screen edges in CSS), so tooltips may overhang
    // the graph itself.
    const bounds = { left: 12, right: window.innerWidth - 12 };
    const wrapCenterX = wrapRect.left + wrapRect.width / 2;

    // Arrow apex keeps 15px from either tooltip edge: the last hairline of
    // the 12px corner radius it can overlap recedes under a pixel.
    const arrowInset = 15;

    // Sticky body: reuse the open tooltip's position when the new tile is
    // still within the arrow's reach and the (possibly re-sized) body still
    // fits the window from there.
    let bodyLeft = null;
    const previousLeft = tooltipBodyLeftRef.current;
    if (previousLeft != null) {
      const apex = wrapCenterX - previousLeft;
      const arrowReaches =
        apex >= arrowInset && apex <= width - arrowInset;
      const stillFits =
        previousLeft >= bounds.left && previousLeft + width <= bounds.right;
      if (arrowReaches && stillFits) bodyLeft = previousLeft;
    }

    if (bodyLeft == null) {
      const naturalLeft = wrapCenterX - width / 2;
      const minLeft = bounds.left;
      const maxLeft = Math.max(minLeft, bounds.right - width);
      bodyLeft = Math.min(Math.max(naturalLeft, minLeft), maxLeft);
    }

    const arrowLeft = Math.min(
      Math.max(wrapCenterX - bodyLeft, arrowInset),
      width - arrowInset,
    );

    tooltip.style.setProperty(
      "--tooltip-left",
      `${bodyLeft - wrapRect.left}px`,
    );
    tooltip.style.setProperty("--tooltip-arrow-left", `${arrowLeft}px`);
    tooltip.classList.add(styles.tooltipAdjusted);
    openTooltipRef.current = tooltip;
    tooltipBodyLeftRef.current = bodyLeft;
  }, [selectedDate]);

  useEffect(() => {
    const dismissTooltip = (event) => {
      if (!sectionRef.current?.contains(event.target)) {
        setSelectedDate(null);
      }
    };

    document.addEventListener("pointerdown", dismissTooltip);
    return () => document.removeEventListener("pointerdown", dismissTooltip);
  }, []);

  const handleViewportScroll = () => {
    setSelectedDate(null);

    const activeElement = document.activeElement;
    if (
      activeElement instanceof HTMLElement &&
      activeElement.classList.contains(styles.day)
    ) {
      activeElement.blur();
    }
  };

  const heading = isReady
    ? `${state.data.total.toLocaleString()} GitHub contributions in the last year`
    : state.status === "error"
      ? "GitHub contributions"
      : "Loading GitHub contributions…";
  const status = isReady
    ? state.stale
      ? "Showing cached GitHub activity while refreshing automatically."
      : "Live GitHub activity, refreshed hourly."
    : "Fetching live GitHub activity.";

  return (
    <div ref={sectionRef} className={styles.section}>
      <h2 id="github-contributions-title" className={styles.heading}>
        {heading}
      </h2>

      {state.status === "error" ? (
        <div className={styles.error} role="status">
          <p>GitHub activity could not load right now. Retrying shortly.</p>
          <a href={profileUrl} target="_blank" rel="noreferrer">
            View contributions on GitHub
          </a>
        </div>
      ) : (
        <>
          <div
            ref={viewportRef}
            className={styles.viewport}
            aria-busy={!isReady}
            onScroll={handleViewportScroll}
          >
            <div
              className={styles.graph}
              style={{ "--week-count": displayedWeeks.length }}
            >
              <div className={styles.monthRow} aria-hidden="true">
                {isReady &&
                  calendar.months.map((month) => (
                    <span
                      className={styles.month}
                      key={month.key}
                      style={{ gridColumnStart: month.weekIndex + 1 }}
                    >
                      {month.label}
                    </span>
                  ))}
              </div>

              <div className={styles.graphBody}>
                <div
                  ref={weeksRef}
                  className={styles.weeks}
                  role={isReady ? "group" : undefined}
                  aria-label={
                    isReady
                      ? `${state.data.total.toLocaleString()} GitHub contributions from ${state.data.range.from} through ${state.data.range.to}.`
                      : undefined
                  }
                >
                  {displayedWeeks.map((week) => (
                    <div
                      className={styles.week}
                      role={isReady ? "presentation" : undefined}
                      key={week.key}
                    >
                      {week.days.map((day, dayIndex) => {
                        if (!day) {
                          return (
                            <span
                              className={`${styles.day} ${isReady ? styles.empty : styles.skeleton
                                }`}
                              aria-hidden="true"
                              key={`${week.key}-${dayIndex}`}
                            />
                          );
                        }

                        const {
                          contributionLabel,
                          dateLabel,
                          accessibleLabel,
                        } = getDayDetails(day);
                        const isSelected = selectedDate === day.date;

                        return (
                          <span className={styles.dayWrap} key={day.date}>
                            <button
                              className={styles.day}
                              data-cursor-type="select-black"
                              data-level={day.level}
                              type="button"
                              aria-label={accessibleLabel}
                              aria-expanded={isSelected}
                              onMouseDown={(event) => {
                                // Keep mouse clicks from focus-pinning a
                                // tooltip on hover devices; keyboard focus
                                // still shows tooltips for accessibility.
                                if (
                                  window.matchMedia(
                                    "(hover: hover) and (pointer: fine)",
                                  ).matches
                                ) {
                                  event.preventDefault();
                                }
                              }}
                              onClick={() => {
                                // Laptops see tooltips on hover alone;
                                // tap-to-pin is touch-only.
                                if (
                                  window.matchMedia(
                                    "(hover: hover) and (pointer: fine)",
                                  ).matches
                                ) {
                                  return;
                                }
                                setSelectedDate((current) =>
                                  current === day.date ? null : day.date,
                                );
                              }}
                            />
                            <span
                              className={`${styles.tooltip} ${isSelected ? styles.tooltipOpen : ""
                                }`}
                              role="tooltip"
                            >
                              <strong className={styles.tooltipCount}>
                                {contributionLabel}
                              </strong>
                              <span className={styles.tooltipDate}>
                                {dateLabel}
                              </span>
                            </span>
                          </span>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div
            className={styles.legend}
            aria-label="Contribution intensity from less to more"
          >
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <i
                className={styles.legendTile}
                data-level={level}
                aria-hidden="true"
                key={level}
              />
            ))}
            <span>More</span>
          </div>

          <span className={styles.status} aria-live="polite">
            {status}
          </span>
        </>
      )}
    </div>
  );
};

export default GitHubContributions;
