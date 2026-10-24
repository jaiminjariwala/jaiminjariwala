"use client";

import CustomCursor from "@/components/CustomCursor";
import type {ReactNode} from 'react';

const ClientShell = ({ children }:{children:ReactNode}) => {
  return (
    <>
      {children}
      <CustomCursor />
    </>
  );
};

export default ClientShell;
