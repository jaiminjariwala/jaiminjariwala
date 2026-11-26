type ExperienceRole = {
  slug: string;
  company: string;
  role: string;
  date: string;
  location: string;
  subjects?: string[];
  team?: string;
  summary: string;
  details: string[];
};

export const experienceRoles: ExperienceRole[] = [
  {
    slug: "george-washington-university",
    company: "The George Washington University",
    role: "Graduate Teaching Assistant II",
    date: "Aug 2026 – Present",
    location: "Washington D.C.",
    subjects: ["Cloud Computing Class", "Database Management Systems 2 Class"],
    summary: "Build AWS labs and help students troubleshoot cloud deployments, SQL, and database schemas.",
    details: [
      "I build and document hands-on AWS labs, including a GitHub-to-Jenkins pipeline that builds Docker images, pushes them to Amazon ECR, and deploys them to ECS and EKS.",
      "I lead students through cloud and database exercises, troubleshoot SQL and schemas in Oracle, MySQL, and PostgreSQL, and hold office hours and grade coursework.",
    ],
  },
  {
    slug: "amazon",
    company: "Amazon",
    role: "Design Technologist I Intern (L4)",
    date: "June – Aug 2026",
    location: "Seattle, Washington",
    team: "Alexa Smart Home Team",
    summary: "Built the Echo Show Device SDK, adopted by four or more teams to build voice-enabled prototypes in under two hours.",
    details: [
      "I built and rolled out the Echo Show Device SDK so teams could prototype voice-enabled experiences directly on the device. I also created a Figma-to-React Native workflow with reusable Alexa components and built and tested 17 or more prototypes.",
      "I automated AWS provisioning and IAM configuration for Alexa apps. Setup went from more than two days to about 90 seconds, and deployment errors fell by 90%.",
    ],
  },
  {
    slug: "logicwind",
    company: "Logicwind",
    role: "AI/ML Intern",
    date: "May – Dec 2024",
    location: "Surat, Gujarat, India",
    summary: "Built handwriting and road-scene models in PyTorch and reduced inference latency by 20%.",
    details: [
      "I implemented handwritten-text analysis and built computer vision algorithms for road-lane and object detection. I also built REST APIs so the frontend could use the model results.",
      "I reduced inference latency by 20% and improved model accuracy from 72% to 96%. I worked with engineering and client teams to resolve production issues.",
    ],
  },
];

export function experiencePath(slug: string) {
  return `/experience/${slug}`;
}
