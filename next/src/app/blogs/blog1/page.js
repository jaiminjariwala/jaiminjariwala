import Navbar from "@/components/Navbar";
import Blog1Article from "@/components/Blog1Article";

export default function Blog1() {
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
        <div className="mt-[48px]">
          <Blog1Article />
        </div>
      </div>
    </section>
  );
}
