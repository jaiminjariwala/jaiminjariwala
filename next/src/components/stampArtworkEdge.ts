// Archived optional effect; not applied to the current Projects stamp.
// A paper-like alpha edge, not a blur of the illustration itself. The middle
// remains fully opaque; the wider brushed perimeter dissolves into white paper.
const edgeSvg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
<defs>
  <linearGradient id="horizontal"><stop stop-color="white" stop-opacity="0"/><stop offset=".025" stop-color="white" stop-opacity=".12"/><stop offset=".075" stop-color="white" stop-opacity=".6"/><stop offset=".13" stop-color="white"/><stop offset=".87" stop-color="white"/><stop offset=".925" stop-color="white" stop-opacity=".6"/><stop offset=".975" stop-color="white" stop-opacity=".12"/><stop offset="1" stop-color="white" stop-opacity="0"/></linearGradient>
  <linearGradient id="vertical" x2="0" y2="1"><stop stop-color="white" stop-opacity="0"/><stop offset=".025" stop-color="white" stop-opacity=".12"/><stop offset=".075" stop-color="white" stop-opacity=".6"/><stop offset=".13" stop-color="white"/><stop offset=".945" stop-color="white"/><stop offset="1" stop-color="white" stop-opacity="0"/></linearGradient>
  <mask id="verticalEdge" mask-type="alpha"><path d="M0 0h200v200H0z" fill="url(#vertical)"/></mask>
  <filter id="paperEdge" x="0" y="0" width="200" height="200" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency=".22" numOctaves="3" seed="12" result="grain"/>
    <feDisplacementMap in="SourceGraphic" in2="grain" scale="9" xChannelSelector="R" yChannelSelector="G" result="brushed"/>
    <feColorMatrix in="grain" type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 1 0 0 0 0" result="grainAlpha"/>
    <feComposite in="brushed" in2="grainAlpha" operator="arithmetic" k1="0" k2="1.5" k3="1" k4="-.5"/>
  </filter>
</defs>
<g filter="url(#paperEdge)"><path d="M0 0h200v200H0z" fill="url(#horizontal)" mask="url(#verticalEdge)"/></g>
</svg>`;

// Inline so the same edge survives the canvas snapshot used during page rolls.
export const stampArtworkEdge=`url("data:image/svg+xml,${encodeURIComponent(edgeSvg)}")`;
