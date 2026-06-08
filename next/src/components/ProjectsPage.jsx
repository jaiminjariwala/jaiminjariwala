import Navbar from "@/components/Navbar";
import ProjectsCurl from "@/components/ProjectsCurl";

const ProjectsPage = () => {
  return (
    <section className="min-h-screen bg-white text-black" style={{ overflow: "clip" }}>
      <Navbar />

      <div
        className="mx-auto w-full max-w-[689px] pb-[28px]"
        style={{
          paddingLeft: "clamp(0px, calc((768px - 100vw) * 9999), 20px)",
          paddingRight: "clamp(0px, calc((768px - 100vw) * 9999), 20px)",
        }}
      >
        <div className="projects-row">
          <ProjectsCurl />
        </div>
      </div>
    </section>
  );
};

export default ProjectsPage;
