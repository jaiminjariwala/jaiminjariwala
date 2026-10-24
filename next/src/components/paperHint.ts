export const PAPER_HINT_KEY='portfolio-paper-hint-seen-v1';
export const PAPER_HINT_DURATION=2900;

const ease=(value:number)=>{const t=Math.max(0,Math.min(1,value));return t*t*(3-2*t);};
type HintStorage={getItem(key:string):string|null|undefined;setItem(key:string,value:string):void};

export function paperHintPull(width:number,closed:number,opened:number){
  // Stay well below the quarter-travel threshold used by real drags.
  return Math.min(width<640?62:78,Math.max(0,(closed-opened)*.12));
}

export function paperHintPose(elapsed:number){
  const fadeIn=ease(elapsed/400),fadeOut=1-ease((elapsed-2450)/450);
  return {
    opacity:fadeIn*fadeOut,
    grip:ease((elapsed-650)/180)*(1-ease((elapsed-1900)/180)),
    pull:elapsed<1900?ease((elapsed-850)/800):0,
    done:elapsed>=PAPER_HINT_DURATION,
  };
}

export function paperHintSeen(storage?:HintStorage|null){
  try{return storage?.getItem(PAPER_HINT_KEY)==='1';}catch{return false;}
}

export function rememberPaperHint(storage?:HintStorage|null){
  try{storage?.setItem(PAPER_HINT_KEY,'1');}catch{/* Storage can be unavailable in private browsing. */}
}
