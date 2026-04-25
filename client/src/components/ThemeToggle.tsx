import { useSnapshot } from "valtio";
import state, { toggleTheme } from "../store";

const ThemeToggle = () => {
  const snap = useSnapshot(state);
  const isDark = snap.theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="fixed bottom-5 right-5 z-30 w-12 h-12 rounded-full glassmorphism flex items-center justify-center shadow-md hover:scale-105 transition-transform text-xl"
    >
      {isDark ? "☀" : "☾"}
    </button>
  );
};

export default ThemeToggle;
