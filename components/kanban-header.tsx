'use client';

import { useTheme } from "next-themes";
import { Info, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function KanbanHeader() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Evita problemas de renderização entre servidor e cliente (hydration)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return(
    <header className="w-full h-14 bg-background/50 backdrop-blur-md border-b border-border flex items-center justify-between px-6 relative z-10">
      {/* Elemento invisível na esquerda apenas para centralizar perfeitamente o logo */}
      <div className="w-9" />

      {/* Centro: Título e Info */}
      <div className="flex items-center gap-2">
        <span className="font-semibold tracking-wider text-sm uppercase text-muted-foreground">
          KANBAN<span className="text-foreground font-bold">app</span>
        </span>
        <Info className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
      </div>

      {/* Direita: Botão de alternar tema */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 active:scale-95"
        aria-label="Alternar tema"
      >
        {theme === "dark" ? (
          <Sun className="w-4 h-4 text-amber-500 animate-in fade-in zoom-in-50 duration-300" />
        ) : (
          <Moon className="w-4 h-4 text-blue-600 animate-in fade-in zoom-in-50 duration-300" />
        )}
      </button>
    </header>
  )
}