"use client";

import CustomCursor from "@/components/CustomCursor";
import { ContactDraftProvider } from "@/components/ContactDraftContext";

const ClientShell = ({ children }) => {
  return (
    <ContactDraftProvider>
      {children}
      <CustomCursor />
    </ContactDraftProvider>
  );
};

export default ClientShell;
