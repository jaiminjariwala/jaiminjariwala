import Link from "next/link";
import type { MouseEventHandler } from "react";
import styles from "./PortfolioV2.module.css";

export default function PortfolioBackLink({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}) {
  return (
    <Link
      href={href}
      prefetch={false}
      className={styles.galleryBack}
      aria-label={label}
      onClick={onClick}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m11 5-7 7 7 7M4 12h16" />
      </svg>
      Back
    </Link>
  );
}
