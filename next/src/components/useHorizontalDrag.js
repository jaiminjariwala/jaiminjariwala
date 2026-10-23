"use client";

import {useRef} from 'react';
import {createHorizontalDragHandlers} from './horizontalDrag.mjs';

// Touch stays native; mouse dragging must not open a folder on release.
export default function useHorizontalDrag(){
  const handlers=useRef(null);
  if(!handlers.current)handlers.current=createHorizontalDragHandlers();
  return handlers.current;
}
