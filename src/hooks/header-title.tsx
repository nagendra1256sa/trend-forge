'use client';
import React, { createContext, useContext, useState } from 'react';

interface HeaderTitleContextType {
  headerTitle: string;
  setHeaderTitle: (title: string) => void;
}

const HeaderTitleContext = createContext<HeaderTitleContextType | undefined>(undefined);

export const HeaderTitleProvider = ({ children }: { children: React.ReactNode }) => {
  const [headerTitle, setHeaderTitle] = useState('');

  return (
    <HeaderTitleContext.Provider value={{ headerTitle, setHeaderTitle }}>
      {children}
    </HeaderTitleContext.Provider>
  );
};

export const useHeaderTitle = () => {
  const context = useContext(HeaderTitleContext);
  if (!context) throw new Error('useHeaderTitle must be used inside HeaderTitleProvider');
  return context;
};
