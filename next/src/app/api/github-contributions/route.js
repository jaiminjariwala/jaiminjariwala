import { NextResponse } from "next/server";

const GITHUB_USERNAME = "jaiminjariwala";
const GITHUB_CONTRIBUTIONS_URL = `https://github.com/users/${GITHUB_USERNAME}/contributions`;
const REVALIDATE_SECONDS = 60 * 60;
const FETCH_TIMEOUT_MS = 10_000;
const MIN_CALENDAR_DAYS = 365;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

export const runtime = "nodejs";
export const revalidate = 3600;

function decodeHtmlEntities(value) {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (entity, hexadecimal) => {
      const codePoint = Number.parseInt(hexadecimal, 16);
      return Number.isInteger(codePoint) && codePoint <= 0x10ffff
        ? String.fromCodePoint(codePoint)
        : entity;
    })
    .replace(/&#(\d+);/g, (entity, decimal) => {
      const codePoint = Number.parseInt(decimal, 10);
      return Number.isInteger(codePoint) && codePoint <= 0x10ffff
        ? String.fromCodePoint(codePoint)
        : entity;
    })
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function cleanText(markup = "") {
  return decodeHtmlEntities(markup.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function getAttribute(attributes, name) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = attributes.match(
    new RegExp(`\\b${escapedName}=(?:"([^"]*)"|'([^']*)')`, "i")
  );

  return match ? decodeHtmlEntities(match[1] ?? match[2] ?? "") : "";
}

function parseContributionCount(label) {
  if (/^no contributions?\b/i.test(label)) return 0;

  const match = label.match(/([\d,]+)\s+contributions?\b/i);
  return match ? Number.parseInt(match[1].replaceAll(",", ""), 10) : null;
}

function parseContributionHtml(html) {
  const descriptionMarkup = html.match(
    /<h2\b[^>]*\bid=(?:"js-contribution-activity-description"|'js-contribution-activity-description')[^>]*>([\s\S]*?)<\/h2>/i
  )?.[1];
  const totalMatch = cleanText(descriptionMarkup).match(
    /([\d,]+)\s+contributions?\b/i
  );

  const contributionByDate = new Map();
  const cellPattern = /<td\b([^>]*)><\/td>/gi;
  let cellMatch;

  while ((cellMatch = cellPattern.exec(html)) !== null) {
    const attributes = cellMatch[1];
    const className = getAttribute(attributes, "class");

    if (!className.split(/\s+/).includes("ContributionCalendar-day")) {
      continue;
    }

    const date = getAttribute(attributes, "data-date");
    const level = Number.parseInt(getAttribute(attributes, "data-level"), 10);
    const adjacentMarkup = html.slice(cellPattern.lastIndex, cellPattern.lastIndex + 800);
    const tooltipMarkup = adjacentMarkup.match(
      /^\s*<tool-tip\b[^>]*>([\s\S]*?)<\/tool-tip>/i
    )?.[1];
    const label = cleanText(tooltipMarkup);
    const count = parseContributionCount(label);
    const timestamp = Date.parse(`${date}T00:00:00Z`);

    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      Number.isNaN(timestamp) ||
      !Number.isInteger(level) ||
      level < 0 ||
      level > 4 ||
      count === null
    ) {
      continue;
    }

    contributionByDate.set(date, { date, count, level });
  }

  const contributions = Array.from(contributionByDate.values()).sort((a, b) =>
    a.date.localeCompare(b.date)
  );
  const firstTimestamp = Date.parse(`${contributions[0]?.date}T00:00:00Z`);
  const lastTimestamp = Date.parse(`${contributions.at(-1)?.date}T00:00:00Z`);
  const expectedDayCount =
    Number.isNaN(firstTimestamp) || Number.isNaN(lastTimestamp)
      ? 0
      : Math.round((lastTimestamp - firstTimestamp) / DAY_IN_MS) + 1;

  if (
    contributions.length < MIN_CALENDAR_DAYS ||
    contributions.length !== expectedDayCount
  ) {
    throw new Error("GitHub returned an incomplete contribution calendar.");
  }

  const summedTotal = contributions.reduce((sum, day) => sum + day.count, 0);
  const total = totalMatch
    ? Number.parseInt(totalMatch[1].replaceAll(",", ""), 10)
    : summedTotal;

  return {
    username: GITHUB_USERNAME,
    profileUrl: `https://github.com/${GITHUB_USERNAME}`,
    total,
    range: {
      from: contributions[0].date,
      to: contributions.at(-1).date,
    },
    contributions,
  };
}

export async function GET() {
  try {
    const response = await fetch(GITHUB_CONTRIBUTIONS_URL, {
      headers: {
        Accept: "text/html",
        "User-Agent": "jaiminjariwala-portfolio",
      },
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    if (!response.ok) {
      throw new Error(`GitHub responded with status ${response.status}.`);
    }

    const calendar = parseContributionHtml(await response.text());

    return NextResponse.json(
      {
        ...calendar,
        updatedAt: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    console.error("GitHub contribution fetch failed:", error);

    return NextResponse.json(
      { error: "GitHub activity is temporarily unavailable." },
      {
        status: 502,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }
}
