import Navbar from "@/components/Navbar";
import HireMeLanyard from "@/components/HireMeLanyard";

export default function HireMe() {
  return (
    <section className="relative min-h-screen bg-white text-black overflow-hidden">
      <HireMeLanyard />
      <Navbar />
    </section>
  );
}
