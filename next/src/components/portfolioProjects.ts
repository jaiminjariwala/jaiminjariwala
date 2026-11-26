export interface ProjectMedia {
  type: "image" | "video";
  src: string;
  label: string;
  poster?: string;
  fallbackSrc?: string;
  aspect?: string;
}
export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  date?: string;
  note?: string;
  aspect?: string;
  links: { label: string; href: string }[];
  media: ProjectMedia[];
}
const codexImage = (file: string, label: string): ProjectMedia => ({
  type: "image",
  src: `/media/codex-lite/${file}.png`,
  label,
});

export const portfolioProjects: PortfolioProject[] = [
  {
    id: "apple-homeview-simulator",
    title: "Apple HomeView Simulator",
    date: "Nov 2026 – Present",
    description:
      "Xcode has no dedicated HomeView simulator. This independent SwiftUI app gives developers and designers a way to prototype for the display. Finding the right light in a smart-home dashboard can mean remembering which button controls which fixture. In the demo, tap fixtures in two bedrooms and a bathroom to see individual or grouped lighting changes.",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/jaiminjariwala/apple-homeview-simulator",
      },
    ],
    media: [
      {
        type: "video",
        src: "/media/apple-homeview-simulator/homeview-demo-rgb-lossless.webm?v=srgb-match",
        fallbackSrc: "/media/apple-homeview-simulator/homeview-demo-srgb-fallback.mp4?v=srgb-match",
        label: "Bedroom 1, Bedroom 2, and Bathroom 1 lighting demo",
        aspect: "1240 / 1636",
      },
    ],
  },
  {
    id: "sharded-raft-kv",
    title: "Sharded Raft KV Database",
    date: "Sep 2026 – Oct 2026",
    description:
      "A distributed key-value database written in Go. Each shard uses Raft to replicate data across three servers, with committed writes, verified reads, and recovery through write-ahead logs and snapshots. The Next.js console shows how gRPC requests are routed and what happens when a server fails.",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/jaiminjariwala/go-backend-mastery/tree/main/17-sharded-raft-kv",
      },
    ],
    media: [
      {
        type: "image",
        src: "/media/sharded-raft-kv/live-cluster.png",
        label: "Live cluster and verified reads",
        aspect: "1080 / 1458",
      },
      {
        type: "image",
        src: "/media/sharded-raft-kv/replication.png",
        label: "Replication",
        aspect: "1080 / 1336",
      },
      {
        type: "image",
        src: "/media/sharded-raft-kv/sharding.png",
        label: "Sharding",
        aspect: "1080 / 1563",
      },
      {
        type: "image",
        src: "/media/sharded-raft-kv/grpc.png",
        label: "gRPC request routing",
        aspect: "1080 / 1090",
      },
    ],
  },
  {
    id: "codex-lite",
    title: "Codex Lite",
    date: "July 2026 – August 2026",
    description:
      "AI chat, a code editor, and a browser share one macOS workspace. Capture a region of your screen and attach it above the message field, work alongside a tabbed editor and terminal, or dictate with local Whisper. Text and screenshot models run locally through Ollama, with Google and GitHub sign-in backed by Go and PostgreSQL.",
    links: [
      { label: "GitHub", href: "https://github.com/jaiminjariwala/codex-lite" },
      {
        label: "Download for macOS",
        href: "https://github.com/jaiminjariwala/codex-lite/releases/latest",
      },
    ],
    media: [
      codexImage("01-welcome", "Welcome"),
      codexImage("02-sign-in", "Google and GitHub sign-in"),
      codexImage("03-browser-sign-in", "Browser sign-in"),
      codexImage("04-account-chooser", "Account chooser"),
      codexImage("05-microphone-permission", "Dictation setup"),
      codexImage("code-workspace", "Code workspace"),
      codexImage("browser-workspace", "Browser workspace"),
      codexImage("settings-light", "Light settings"),
      codexImage("settings-appearance", "Appearance"),
      codexImage("settings-memory", "Memory"),
      {
        type: "video",
        src: "/media/codex-lite/demo-1.mp4",
        poster: "/media/codex-lite/code-workspace.png",
        label: "Demo 1",
        aspect: "1920 / 1128",
      },
      {
        type: "video",
        src: "/media/codex-lite/demo-2.mp4",
        poster: "/media/codex-lite/browser-workspace.png",
        label: "Demo 2",
        aspect: "1920 / 1128",
      },

    ],
  },
  {
    id: "component-library",
    title: "Open Source Component Library",
    date: "Dec 2025 – April 2026",
    description:
      "Browse reusable UI components, try their live previews, and edit the source in your browser. Signed-in users can publish to the community gallery, fork components, and revisit earlier versions. Built with Next.js and TypeScript.",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/jaiminjariwala/NEXT-JS/tree/main/component-library",
      },
      {
        label: "Live site",
        href: "https://component-library-six-eta.vercel.app",
      },
    ],
    media: [
      {
        type: "image",
        src: "/images/project-1-shot.png",
        label: "Component Library playground",
      },
    ],
  },

];
