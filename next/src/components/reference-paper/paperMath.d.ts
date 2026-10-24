import type {PaperSettings,PaperFrame,PaperBend} from '@/types/paper';
declare const math:{
  GPU_PAPER_DEFAULTS:PaperSettings;
  materialBeyondPaperGrab(x:number,y:number,nx:number,ny:number,frame:PaperFrame):number;
  rollBendAtDistance(distance:number,gu:number,settings:PaperSettings,beyond?:number):PaperBend;
  projectBend(distance:number,bend:PaperBend,layer?:number):[number,number,number];
};
export default math;
