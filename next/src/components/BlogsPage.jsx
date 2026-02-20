import Link from "next/link";
import { Short_Stack } from "next/font/google";
import Navbar from "@/components/Navbar";

const shortStack = Short_Stack({
  subsets: ["latin"],
  weight: "400",
});

const BlogsPage = () => {
  return (
    <section className="min-h-screen bg-white text-black">
      <Navbar />

      <div
        className="mx-auto w-full max-w-[689px]"
        style={{
          paddingLeft: "clamp(0px, calc((768px - 100vw) * 9999), 20px)",
          paddingRight: "clamp(0px, calc((768px - 100vw) * 9999), 20px)",
        }}
      >
        <div className="mt-[38px]">
          <p
            className="block text-[clamp(18px,3.5vw,21px)] font-normal leading-none tracking-[-0.01em] "
            style={{ margin: 0, padding: 0, lineHeight: 1 }}
          >
            February 10, 2026
          </p>

          <Link
            href="/blogs/blog1"
            className={`${shortStack.className} mt-[10px] inline-block text-[clamp(28px,4.3vw,38px)] leading-[0.92] tracking-[-0.02em] [-webkit-text-stroke:2.2px_#000000]`}
          >
            My first blog
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogsPage;
