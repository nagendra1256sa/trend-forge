"use client";

import React from 'react';

const FallbackLoader: React.FC = () => {
  return (
    <div className="loader-overlay">
      <span className="loader"></span>
    </div>
  );
};

export default FallbackLoader;