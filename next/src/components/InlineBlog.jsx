"use client";

import { useState } from "react";
import { Short_Stack } from "next/font/google";
import Blog1Article from "@/components/Blog1Article";

const shortStack = Short_Stack({
  subsets: ["latin"],
  weight: "400",
});

export default function InlineBlog() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="bg-white text-black">
      <div
        className="mx-auto w-full max-w-[689px]"
        style={{
          paddingLeft: "clamp(0px, calc((768px - 100vw) * 9999), 20px)",
          paddingRight: "clamp(0px, calc((768px - 100vw) * 9999), 20px)",
        }}
      >
        {isExpanded ? (
          <Blog1Article compact onBack={() => setIsExpanded(false)} />
        ) : (
          <div>
            <p
              className="block text-[clamp(18px,3.5vw,21px)] font-normal leading-none tracking-[-0.01em]"
              style={{ margin: 0, padding: 0, lineHeight: 1 }}
            >
              February 10, 2026
            </p>

            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              aria-expanded={isExpanded}
              className={`${shortStack.className} mt-[10px] inline-block border-0 bg-transparent p-0 text-left text-[clamp(28px,4.3vw,38px)] leading-[0.92] tracking-[-0.02em] [-webkit-text-stroke:2.2px_#000000]`}
            >
              My first blog
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
