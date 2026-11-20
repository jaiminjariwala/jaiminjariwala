export interface ProjectMedia {
  type: "image" | "video";
  src: string;
  label: string;
  poster?: string;
  aspect?: string;
}
export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
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
    description:
      "Xcode has no dedicated HomeView simulator. This independent SwiftUI app gives developers and designers a way to prototype for the display. Finding the right light in a smart-home dashboard can mean remembering which button controls which fixture. In the bedroom demo, tap the ceiling light or desk lamp directly in the room photo and see the lighting change.",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/jaiminjariwala/apple-homeview-simulator",
      },
    ],
    media: [
      {
        type: "image",
        src: "/media/apple-homeview-simulator/homeview-demo.webp",
        label: "Simulator dashboard and bedroom light controls",
        aspect: "1560 / 1720",
      },
    ],
  },
  {
    id: "sharded-raft-kv",
    title: "Sharded Raft KV",
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
        aspect: "1580 / 1458",
      },
      {
        type: "image",
        src: "/media/sharded-raft-kv/replication.png",
        label: "Replication",
        aspect: "1580 / 1336",
      },
      {
        type: "image",
        src: "/media/sharded-raft-kv/sharding.png",
        label: "Sharding",
        aspect: "1580 / 1563",
      },
      {
        type: "image",
        src: "/media/sharded-raft-kv/grpc.png",
        label: "gRPC request routing",
        aspect: "1580 / 1090",
      },
    ],
  },
  {
    id: "codex-lite",
    title: "Codex Lite",
    description:
      "AI chat, a code editor, and a browser share one macOS workspace. Capture a region of your screen and attach it above the message field, work alongside a tabbed editor and terminal, or dictate with local Whisper. Text and screenshot models run locally through Ollama, with Google and GitHub sign-in backed by Go and PostgreSQL.",
    note: "An independent project, not an OpenAI product.",
    links: [
      { label: "GitHub", href: "https://github.com/jaiminjariwala/codex-lite" },
      {
        label: "Download for macOS",
        href: "https://github.com/jaiminjariwala/codex-lite/releases/latest",
      },
    ],
    media: [
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
      codexImage("code-workspace", "Code workspace"),
      codexImage("browser-workspace", "Browser workspace"),
      codexImage("01-welcome", "Welcome"),
      codexImage("02-sign-in", "Google and GitHub sign-in"),
      codexImage("03-browser-sign-in", "Browser sign-in"),
      codexImage("04-account-chooser", "Account chooser"),
      codexImage("05-microphone-permission", "Dictation setup"),
      codexImage("settings-light", "Light settings"),
      codexImage("settings-appearance", "Appearance"),
      codexImage("settings-memory", "Memory"),
    ],
  },
  {
    id: "component-library",
    title: "Open Source Component Library",
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
  {
    id: "url-shortener",
    title: "URL Shortener",
    description:
      "Follow a short-link request from the dashboard to Redis or PostgreSQL. The Go backend stores links in PostgreSQL, caches repeat lookups in Redis, and applies a shared rate limit. The dashboard shows actual cache hits, misses, and database reads.",
    note: "A local backend lab. Screenshot timings are individual observations, not a performance benchmark.",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/jaiminjariwala/go-backend-mastery/tree/main/15-url-shortener",
      },
    ],
    aspect: "4 / 5",
    media: [
      {
        type: "image",
        src: "/media/url-shortener/cache-miss.jpg",
        label: "Cache miss: PostgreSQL fills Redis",
      },
      {
        type: "image",
        src: "/media/url-shortener/cache-hit.jpg",
        label: "Cache hit: Redis answers",
      },
    ],
  },
];
