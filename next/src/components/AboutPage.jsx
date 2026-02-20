import Image from "next/image";
import Navbar from "@/components/Navbar";

const AboutPage = () => {
  return (
    <section className="min-h-screen bg-white text-black">
      <Navbar />
      <div className="mx-auto w-full max-w-[689px]" style={{ paddingLeft: 'clamp(0px, calc((768px - 100vw) * 9999), 20px)', paddingRight: 'clamp(0px, calc((768px - 100vw) * 9999), 20px)' }}>
        <Image
          src="/Washington-DC.jpg"
          alt="The George Washington University campus entrance"
          width={674}
          height={449}
          priority
          className="h-auto w-full pt-[30px]"
        />

        <div className="mt-12 pb-6">
          <div className="mt-[88px]">
            <div>
              <h2 style={{ margin: 0, padding: 0, fontSize: 'clamp(21px, 3.5vw, 24px)' }} className="m-0 p-0 text-[24px] leading-[0.92] text-black">
                Present
              </h2>
              <p className="m-0 -mt-[2px] leading-[1.35] tracking-[-0.01em] [-webkit-text-stroke:0.3px_#000000]" style={{ fontSize: 'clamp(21px, 3.5vw, 24px)' }}>
                I am a grad student pursuing Master&rsquo;s in Computer Science at The George Washington University,
                Washington D.C., (majoring in Software Engineering).
              </p>
            </div>

            <div className="mt-7">
              <p className="leading-[1.35] tracking-[-0.01em] [-webkit-text-stroke:0.3px_#000000]" style={{ fontSize: 'clamp(21px, 3.5vw, 24px)' }}>
                I love playing playing spikeball, badminton, golf, table tennis, and always down for other American sports. I hit the gym almost daily and love traveling cities whenever I get a chance.
              </p>
            </div>

            <div className="mt-7">
              <p className="leading-[1.35] tracking-[-0.01em] [-webkit-text-stroke:0.3px_#000000]" style={{ fontSize: 'clamp(21px, 3.5vw, 24px)' }}>
              <strong>I prefer working out of home</strong> rather than from home, as I am an extrovert who enjoys
              being outside and around people more than staying indoors.
              </p>
            </div>

            <div className="mt-7">
              <p className="leading-[1.35] tracking-[-0.01em] [-webkit-text-stroke:0.3px_#000000]" style={{ fontSize: 'clamp(21px, 3.5vw, 24px)' }}>
                At present, I live in Arlington, Virginia.
              </p>
            </div>
          </div>




          <div className="mt-[108px]">
            <div>
              <h2 style={{ margin: 0, padding: 0, fontSize: 'clamp(21px, 3.5vw, 24px)' }} className="m-0 p-0 text-[24px] leading-[0.92] text-black">
                Past
              </h2>
              <p className="m-0 -mt-[2px] leading-[1.35] tracking-[-0.01em] [-webkit-text-stroke:0.3px_#000000]" style={{ fontSize: 'clamp(21px, 3.5vw, 24px)' }}>
                I worked as an <strong>AI/ML intern</strong>{" "}
                <a href="https://logicwind.com" target="_blank" rel="noreferrer" className="text-[#3896ff] [-webkit-text-stroke:0.3px_#3896ff]">
                  @Logicwind
                </a>{" "}
                and worked there for 7 months from May 2024 to December 2024.
              </p>
            </div>

            <div className="mt-7">
              <p className="leading-[1.35] tracking-[-0.01em] [-webkit-text-stroke:0.3px_#000000]" style={{ fontSize: 'clamp(21px, 3.5vw, 24px)' }}>
                Did my Bachelor&rsquo;s in Computer Science and Engineering from India. My hometown is Surat,
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
