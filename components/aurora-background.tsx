'use client';

import React from 'react';

export function AuroraBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Esfera de Luz 1 (Azul/Ciano) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full 
        bg-cyan-500/20 dark:bg-blue-600/15 blur-[120px] animate-aurora-slow" 
      />
      
      {/* Esfera de Luz 2 (Roxa/Fúcsia) */}
      <div className="absolute bottom-[10%] right-[-5%] w-[600px] h-[600px] rounded-full 
        bg-fuchsia-500/20 dark:bg-purple-600/15 blur-[130px] animate-aurora-delay" 
      />

      {/* Esfera de Luz 3 (Rosa/Suave para dar profundidade) */}
      <div className="absolute top-[30%] left-[40%] w-[400px] h-[400px] rounded-full 
        bg-pink-400/10 dark:bg-pink-900/5 blur-[100px] animate-aurora-slow" 
      />
    </div>
  );
}