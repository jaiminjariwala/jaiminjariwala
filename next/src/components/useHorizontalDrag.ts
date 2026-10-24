"use client";

import {useState} from 'react';
import {createHorizontalDragHandlers} from './horizontalDrag.ts';

// Touch stays native; mouse dragging must not open a folder on release.
export default function useHorizontalDrag(){
  const [handlers]=useState(createHorizontalDragHandlers);
  return handlers;
}
