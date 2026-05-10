"use client";

import CustomCursor from "@/components/CustomCursor";
import TextSelectionHighlight from "@/components/TextSelectionHighlight";
import { ContactDraftProvider } from "@/components/ContactDraftContext";

const ClientShell = ({ children }) => {
  return (
    <ContactDraftProvider>
      {children}
      <CustomCursor />
      <TextSelectionHighlight />
    </ContactDraftProvider>
  );
};

export default ClientShell;
