// Typed boundary for the preserved third-party JavaScript GPU runtime.
import type {PaperEngine,PaperEngineOptions} from '@/types/paper';
export function createPageEngine(canvas:HTMLCanvasElement,options:PaperEngineOptions):Promise<PaperEngine>;
