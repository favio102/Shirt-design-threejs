import { useEffect } from "react";
import { useSnapshot } from "valtio";
import Canvas from "./canvas";
import Customizer from "./pages/Customizer";
import { Home } from "./pages/Home";
import CanvasErrorBoundary from "./components/CanvasErrorBoundary";
import { ThemeToggle } from "./components";
import state from "./store";

export function App() {
  const snap = useSnapshot(state);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", snap.theme === "dark");
  }, [snap.theme]);

  return (
    <main className="app transition-all ease-in dark:bg-neutral-900">
      <Home />
      <CanvasErrorBoundary>
        <Canvas />
      </CanvasErrorBoundary>
      <Customizer />
      <ThemeToggle />
    </main>
  );
}

