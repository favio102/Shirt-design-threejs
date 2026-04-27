import { useEffect } from "react";
import { MotionConfig } from "framer-motion";
import { useSnapshot } from "valtio";
import Canvas from "./canvas";
import { Customizer } from "./pages/Customizer";
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
    <MotionConfig reducedMotion="user">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-2 focus:bg-white focus:text-gray-900 focus:rounded focus:shadow focus-visible:outline-2 focus-visible:outline-blue-500"
      >
        Skip to main content
      </a>
      <main
        id="main-content"
        className="app transition-all ease-in dark:bg-neutral-900"
      >
        <Home />
        <CanvasErrorBoundary>
          <Canvas />
        </CanvasErrorBoundary>
        <Customizer />
        <ThemeToggle />
      </main>
    </MotionConfig>
  );
}

