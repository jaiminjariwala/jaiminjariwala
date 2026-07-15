import Navbar from "@/components/Navbar";
import ProjectsCurl from "@/components/ProjectsCurl";

const ProjectsPage = ({ embedded = false }) => {
  return (
    <section
      className={`bg-white text-black${embedded ? " projects-page-embedded" : ""}`}
      style={
        embedded
          ? { overflow: "visible" }
          : { height: "100dvh", overflow: "hidden" }
      }
    >
      {!embedded && <Navbar />}

      <div
        className={`mx-auto w-full max-w-[689px]${embedded ? "" : " pb-[28px]"}`}
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
