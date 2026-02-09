import Link from "next/link";
import Image from "next/image";

export default function InterestsPage() {
  return (
    <section className="h-screen px-[6vw] pt-[18vh] pb-[8vh] text-white flex flex-col justify-start">
      <Link
        href="/"
        className="hero-arrow fixed left-[6vw] top-6 z-50 inline-flex items-center"
        aria-label="Back to home"
      >
        <Image className="hero-arrow-icon" src="/left-arrow.svg" alt="" width={70} height={30} priority />
      </Link>
      <div className="max-w-[60vw]">
        <h1 className="text-left text-[clamp(2rem,6vw,5.5rem)] font-[400] tracking-[-3px] leading-[0.9]">
          More about my work & interests
        </h1>
        <p className="mt-[6vh] text-left text-[clamp(1.2rem,2.4vw,2.4rem)] font-light leading-[1.25] tracking-[-0.2px]">
          My websites revolve around Typography, Colors, Swiss Design Principles and Framer Motion. Currently, I am exploring GSAP animations and 3JS.
        </p>
      </div>
    </section>
  );
}
