// Safari's native video fullscreen API predates the standard element API.
interface HTMLVideoElement {
  readonly webkitDisplayingFullscreen?:boolean;
  webkitEnterFullscreen?:()=>void;
}
