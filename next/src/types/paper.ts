import type {Bounds,Point} from '@/components/paperGeometry';
import type {PaperDragOptions} from '@/components/paperDragGeometry';
import type {PortfolioSection} from '@/lib/siteSeo';

export interface PaperFrame {docW:number;docH:number;gu:number;left:number;right:number;top:number;amp:number;sideAmp:number;period:number}
export interface PaperSettings {
  rollRadiusGu:number;rollTiltDeg:number;rollShade:number;layerGapGu:number;bendGapCap:number;thicknessGu:number;
  peek:number;foldSoftness:number;tipCurl:number;surfaceShade:number;contactShadowStrength:number;
  contactShadowSoftnessGu:number;castShadowStrength:number;backFaceShade:number;backFacePosition:number;
  backFaceWidth:number;backFaceFalloff:number;castShadowBlurGu:number;castShadowSpreadGu:number;
  castShadowDistanceGu:number;coupling:number;damping:number;flexibility:number;origin:string;tipDropGu?:number;
}
export interface PaperBend {radius:number;tipAngle:number;foldDistance:number;gu:number;rollStart:number;rollLength:number;rollAngle:number;rollPitch:number;layerSpacing:number;contactLift:number}
export interface PaperEngine {
  readonly failed:boolean;readonly active:boolean;readonly settling:boolean;
  updateUndersideInk(ink:HTMLCanvasElement):void;whenIdle():Promise<void>;setColors(colors:readonly string[]):boolean;
  clear():void;dispose():void;
  paint(frame:PaperFrame,layout:{stackCornerOffsetGu:number},originX:number,originY:number,targetX:number,targetY:number,dt:number,lightX:number,time?:number):void;
}
export interface PaperEngineOptions {colors:readonly string[];palettes?:readonly (readonly string[])[];surfaceInk?:boolean;staticPose?:boolean;pixelRatio?:number;viewportTop?:()=>number;viewportHeight?:()=>number;settings?:()=>PaperSettings}
export interface StampSnapshot {image:HTMLCanvasElement;width:number;height:number;x:number;y:number;rotation:number}
export interface PaperState {
  width:number;height:number;k:number;target:number;velocity:number;angle:number;targetAngle:number;angularVelocity:number;
  plush:number;dt:number;lastTime:number;reducedMotion:boolean;dragging:boolean;raf:number;moved:boolean;
  open:boolean;startX:number;startY:number;startK:number;startAngle:number;dragOptions:PaperDragOptions;
  originX?:number;originY?:number;restAngle?:number;pointerId?:number;renderHeight?:number;
  arrivalActive?:boolean;arrivalPending?:boolean;paintPending?:boolean;flatMobile?:boolean;fullRaster?:boolean;hintActive?:boolean;
  collectionBounds?:Bounds|null;ink?:HTMLCanvasElement;inkWithoutStamp?:HTMLCanvasElement;stampSnapshot?:StampSnapshot;
  stampTap?:({stamp:HTMLButtonElement;cancelled?:boolean}&Point)|null;
}
export interface PaperPeelProps {open:boolean;onOpenChange(open:boolean):void;onClipChange(clip:string,progress:number):void;onSettled?(open:boolean):void;onContentReady?(variant:PortfolioSection):void;variant?:PortfolioSection}
