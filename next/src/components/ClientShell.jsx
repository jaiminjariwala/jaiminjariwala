"use client";

import CustomCursor from "@/components/CustomCursor";

const ClientShell = ({ children }) => {
  return (
    <>
      {children}
      <CustomCursor />
    </>
  );
};

export default ClientShell;
