"use client";

import type { MouseEvent, ReactNode } from "react";
import { experienceRoles } from "./portfolioExperience";
import styles from "./PortfolioV2.module.css";
import PortfolioBackLink from "./PortfolioBackLink";

function ExperienceRow({
  entry,
  children,
}: {
  entry: (typeof experienceRoles)[number];
  children: ReactNode;
}) {
  return (
    <div>
      <div>
        {children}
        <span>{entry.role}</span>
        {entry.team && <span className={styles.experienceTeam}>· {entry.team}</span>}
        {entry.subjects?.map((subject) => <span key={subject}>· {subject}</span>)}
      </div>
      <div className={styles.experienceMeta}>
        <span>{entry.location}</span>
        <time>{entry.date}</time>
      </div>
    </div>
  );
}

export default function PortfolioV2Experience({
  slug,
  onBack,
}: {
  slug?: string;
  onOpen?: (slug: string) => void;
  onBack?: () => void;
}) {
  function follow(event: MouseEvent<HTMLAnchorElement>, action?: () => void) {
    if (!action || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    action();
  }

  const selected = experienceRoles.find((entry) => entry.slug === slug);

  if (selected) {
    return (
      <>
        <header>
          <PortfolioBackLink
            href={onBack ? `/experience#role-${selected.slug}` : "/experience"}
            label="Back to Experience"
            onClick={(event) => follow(event, onBack)}
          />
          <div className={`${styles.experience} ${styles.roleList}`}>
            <ExperienceRow entry={selected}>
              <h1 className={styles.experienceDetailName}>
                {selected.company}
              </h1>
            </ExperienceRow>
          </div>
        </header>
        {selected.details.map((detail) => <p key={detail}>{detail}</p>)}
      </>
    );
  }

  return (
    <>
      <header>
        <h1 className={styles.sectionHeading}>Experience</h1>
      </header>
      <div className={`${styles.experience} ${styles.roleList}`}>
        {experienceRoles.map((entry) => (
          <ExperienceRow key={entry.slug} entry={entry}>
            <strong id={`role-${entry.slug}`}>{entry.company}</strong>
          </ExperienceRow>
        ))}
      </div>
    </>
  );
}
