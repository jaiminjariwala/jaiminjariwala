"use client";

import Image from "next/image";
import Link from "next/link";
import { Short_Stack } from "next/font/google";

const shortStack = Short_Stack({
  subsets: ["latin"],
  weight: "400",
});

export default function Blog1Article({ compact = false, onBack }) {
  const backIcon = (
    <Image
      src="/icons/left-arrow.svg"
      alt=""
      aria-hidden="true"
      width={22}
      height={20}
      priority={!compact}
    />
  );

  return (
    <article className={compact ? "inline-unfold" : undefined}>
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to blogs"
          className="inline-flex h-[24px] w-[24px] items-center justify-center border-0 bg-transparent p-0"
        >
          {backIcon}
        </button>
      ) : (
        <Link
          href="/blogs"
          aria-label="Back to blogs"
          className="inline-flex h-[24px] w-[24px] items-center justify-center"
        >
          {backIcon}
        </Link>
      )}

      <p
        className={`${compact ? "mt-[16px]" : "mt-[22px]"} text-[clamp(21px,3.5vw,24px)] font-normal leading-none tracking-[-0.01em] [-webkit-text-stroke:0.3px_#000000]`}
        style={{ marginBottom: 0 }}
      >
        February 10, 2026
      </p>

      <h1
        className={`${shortStack.className} mt-[11px] text-[clamp(48px,4.3vw,56px)] font-normal leading-[0.92] tracking-[-0.02em] [-webkit-text-stroke:2.2px_#000000]`}
      >
        My first blog
      </h1>

      <p
        className={`${compact ? "mt-[38px]" : "mt-[78px]"} text-[clamp(21px,3.5vw,24px)] font-normal leading-[1.35] tracking-[-0.01em] [-webkit-text-stroke:0.3px_#000000]`}
      >
        Yes, like every software (frontend) developers who adds blogs section
        into their website and creates their first blog, I decided to follow the
        same. Well, that&apos;s not true, haha, I incorporated writing what I
        think couple months back because that allows me to think deeply and
        understand things better.
      </p>

      <Image
        src="/images/blog-1-image.svg"
        alt="Sketch style notebook artwork"
        width={1200}
        height={1200}
        priority={!compact}
        className={`${compact ? "mt-[40px]" : "mt-[74px]"} h-auto w-full`}
      />

      <p
        className={`${compact ? "mt-[40px]" : "mt-[72px]"} text-[clamp(21px,3.5vw,24px)] font-normal leading-[1.35] tracking-[-0.01em] [-webkit-text-stroke:0.3px_#000000]`}
      >
        My blogs won&apos;t be on some specific topics but just random
        thoughts, the way people tweets on Twitter, just some random thoughts,
        images, arts, and musics.
      </p>

      <div
        className={`${compact ? "mb-[12px] mt-[48px]" : "mb-[74px] mt-[92px]"} flex justify-center`}
      >
        <div className="h-[6px] w-[62%] min-w-[220px] max-w-[520px] bg-[#73c951]" />
      </div>
    </article>
  );
}
