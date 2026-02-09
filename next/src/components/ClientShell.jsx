"use client";

import { createContext, useContext, useState } from "react";
import CustomCursor from "@/components/CustomCursor";
import Header from "@/components/Header";

const MenuContext = createContext();

export const useMenu = () => useContext(MenuContext);

const ClientShell = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <MenuContext.Provider value={{ isMenuOpen, setIsMenuOpen }}>
      <CustomCursor />
      <Header />
      <div className={isMenuOpen ? "relative z-0" : ""}>{children}</div>
    </MenuContext.Provider>
  );
};

export default ClientShell;
