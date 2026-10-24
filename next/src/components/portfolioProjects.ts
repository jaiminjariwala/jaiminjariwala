export interface ProjectMedia {type:'image'|'video';src:string;label:string;poster?:string;aspect?:string}
export interface PortfolioProject {id:string;title:string;description:string;note?:string;aspect?:string;links:{label:string;href:string}[];media:ProjectMedia[]}
const codexImage=(file:string,label:string):ProjectMedia=>({type:'image',src:`/media/codex-lite/${file}.png`,label});

export const portfolioProjects:PortfolioProject[]=[
  {
    id:'codex-lite', title:'Codex Lite',
    description:'I built a macOS app that brings AI chat, code, and a browser into one workspace. Capture a region of your screen and attach it above the message field, work alongside a tabbed editor and terminal, or dictate with local Whisper. Text and screenshot models run locally through Ollama, with Google and GitHub sign-in backed by Go and PostgreSQL.',
    note:'An independent project, not an OpenAI product.',
    links:[{label:'GitHub',href:'https://github.com/jaiminjariwala/codex-lite'},{label:'Download for macOS',href:'https://github.com/jaiminjariwala/codex-lite/releases/latest'}],
    media:[
      {type:'video',src:'/media/codex-lite/demo-1.mp4',poster:'/media/codex-lite/code-workspace.png',label:'Demo 1',aspect:'1920 / 1128'},
      {type:'video',src:'/media/codex-lite/demo-2.mp4',poster:'/media/codex-lite/browser-workspace.png',label:'Demo 2',aspect:'1920 / 1128'},
      codexImage('code-workspace','Code workspace'),
      codexImage('browser-workspace','Browser workspace'),
      codexImage('01-welcome','Welcome'),
      codexImage('02-sign-in','Google and GitHub sign-in'),
      codexImage('03-browser-sign-in','Browser sign-in'),
      codexImage('04-account-chooser','Account chooser'),
      codexImage('05-microphone-permission','Dictation setup'),
      codexImage('settings-light','Light settings'),
      codexImage('settings-dark','Dark settings'),
      codexImage('settings-appearance','Appearance'),
      codexImage('settings-memory','Memory'),
    ],
  },
  {
    id:'component-library',title:'Open Source Component Library',
    description:'A home for reusable UI components and the code behind them. Browse live previews, edit code in the browser, and take the assets with you. Signed-in users can publish to the community gallery, fork components, and revisit earlier versions. Built with Next.js and TypeScript.',
    links:[{label:'GitHub',href:'https://github.com/jaiminjariwala/NEXT-JS/tree/main/component-library'},{label:'Live site',href:'https://component-library-six-eta.vercel.app'}],
    media:[{type:'image',src:'/images/project-1-shot.png',label:'Component Library playground'}],
  },
  {
    id:'url-shortener',title:'URL Shortener',
    description:'A Go backend project that makes the request path visible. PostgreSQL stores each short link, Redis caches repeat lookups, and a shared rate limiter controls requests. The dashboard traces real cache hits, misses, and database reads.',
    note:'A local backend lab. Screenshot timings are individual observations, not a performance benchmark.',
    links:[{label:'GitHub',href:'https://github.com/jaiminjariwala/go-backend-mastery/tree/main/15-url-shortener'}],
    aspect:'4 / 5',
    media:[{type:'image',src:'/media/url-shortener/cache-miss.jpg',label:'Cache miss: PostgreSQL fills Redis'},{type:'image',src:'/media/url-shortener/cache-hit.jpg',label:'Cache hit: Redis answers'}],
  },
];
