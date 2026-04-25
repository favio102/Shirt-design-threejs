import Canvas from "./canvas";
import Customizer from "./pages/Customizer";
import Home from "./pages/Home";
import CanvasErrorBoundary from "./components/CanvasErrorBoundary";

function App() {
  return (
    <main className="app transition-all ease-in">
      <Home />
      <CanvasErrorBoundary>
        <Canvas />
      </CanvasErrorBoundary>
      <Customizer />
    </main>
  );
}

export default App;
