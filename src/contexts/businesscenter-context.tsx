"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

interface BusinessCenterContextType {
  selectedBCId: number | null;
  setSelectedBCId: (id: number) => void;
  contextLoading: boolean;
}

const BusinessCenterContext = createContext<BusinessCenterContextType | undefined>(undefined);

export const BusinessCenterProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedBCId, setSelectedBCIdState] = useState<number | null>(null);
  const [contextLoading, setContextLoading] = useState(true);
  useEffect(() => {
    const stored = localStorage.getItem("BCId_Key");
    if (stored) {
      setSelectedBCIdState(Number(stored));
      setContextLoading(false);
    }
  }, []);

  const setSelectedBCId = (id: number) => {
    localStorage.setItem("BCId_Key", id.toString());
    setSelectedBCIdState(id);
  };

  return (
    <BusinessCenterContext.Provider value={{ selectedBCId, setSelectedBCId, contextLoading }}>
      {children}
    </BusinessCenterContext.Provider>
  );
};

export const useBusinessCenter = (): BusinessCenterContextType => {
  const context = useContext(BusinessCenterContext);
  if (!context) {
    throw new Error("useBusinessCenter must be used within a BusinessCenterProvider");
  }
  return context;
};
