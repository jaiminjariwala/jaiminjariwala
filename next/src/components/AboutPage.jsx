import Image from "next/image";
import Navbar from "@/components/Navbar";

const AboutPage = () => {
  return (
    <section className="min-h-screen bg-white text-black">
      <div className="mx-auto w-full max-w-[689px]">
        <Navbar />

        <div className="h-[150px]" aria-hidden="true" />

        <Image
          src="/university-image.svg"
          alt="The George Washington University campus entrance"
          width={674}
          height={449}
          priority
          className="h-auto w-full pt-[30px]"
        />

        <div className="relative mt-12 pb-6">
          <div className="absolute left-[14px] top-[-26px] bottom-[-26px] w-[6px] -translate-x-1/2 rounded-full bg-[#4da3ff]" />

          <div className="mt-[88px]">
            <div className="relative pl-[68px]">
              <span className="absolute left-[14px] h-[22px] w-[22px] -translate-x-1/2 rounded-full bg-[#49be09]" />
              <h2 style={{ margin: 0, padding: 0 }} className="m-0 p-0 text-[24px] font-medium leading-[0.92] text-[#73c951]">
                Present
              </h2>
              <p className="m-0 -mt-[2px] text-[clamp(24px,1.65vw,24px)] leading-[1.35] tracking-[-0.01em]">
                I am a grad student pursuing <strong>Master&rsquo;s in Computer Science at The George Washington University,</strong>{" "}
                <strong>Washington D.C.,</strong> (majoring in Software Engineering).
              </p>
            </div>

            <div className="relative mt-7 pl-[68px]">
              <span className="absolute left-[14px] top-[4px] h-[22px] w-[22px] -translate-x-1/2 rounded-full bg-[#49be09]" />
              <p className="text-[clamp(24px,1.65vw,24px)] leading-[1.35] tracking-[-0.01em]">
                Outside of work, I enjoy roller skating and playing spikeball, badminton, golf, table tennis, and always open to
                learn and play other American sports. Moreover, I hit the gym almost daily and love traveling cities whenever I get
                the chance. <strong>I prefer working out of home</strong> rather than from home, as I am an extrovert who enjoys
                being outside and around people more than staying indoors.
              </p>
            </div>

            <div className="relative mt-7 pl-[68px]">
              <span className="absolute left-[14px] top-[4px] h-[22px] w-[22px] -translate-x-1/2 rounded-full bg-[#49be09]" />
              <p className="text-[clamp(24px,1.65vw,24px)] leading-[1.35] tracking-[-0.01em]">
                At present, <strong>I live in Arlington, Virginia.</strong>
              </p>
            </div>
          </div>

          <div className="mt-[88px]">
            <div className="relative pl-[68px]">
              <span className="absolute left-[14px] h-[22px] w-[22px] -translate-x-1/2 rounded-full bg-[#49be09]" />
              <h2 style={{ margin: 0, padding: 0 }} className="m-0 p-0 text-[24px] font-semibold leading-[0.92] text-[#73c951]">
                Past
              </h2>
              <p className="m-0 -mt-[2px] text-[clamp(24px,1.65vw,24px)] leading-[1.35] tracking-[-0.01em]">
                I worked as an <strong>AI/ML intern</strong>{" "}
                <a href="https://logicwind.com" target="_blank" rel="noreferrer" className="text-[#3896ff] hover:underline">
                  @Logicwind
                </a>{" "}
                and worked there for 7 months from May 2024 to December 2024.
              </p>
            </div>

            <div className="relative mt-7 pl-[68px]">
              <span className="absolute left-[14px] top-[4px] h-[22px] w-[22px] -translate-x-1/2 rounded-full bg-[#49be09]" />
              <p className="text-[clamp(24px,1.65vw,24px)] leading-[1.35] tracking-[-0.01em]">
                Did my <strong>Bachelor&rsquo;s in Computer Science and Engineering from India.</strong> My hometown is Surat,
                Gujarat, India.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-[74px] mb-[74px] flex justify-center">
          <div className="h-[8px] w-[62%] min-w-[240px] max-w-[520px] rounded-full bg-[#73c951]" />
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
