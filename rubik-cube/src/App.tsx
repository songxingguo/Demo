import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Rubik from "./components/Rubik";
import "./App.css";

function App() {
  return (
    <>
      <Canvas>
        <Rubik />
        {/* <OrbitControls /> */}
        {/* <axesHelper args={[5]} /> */}
      </Canvas>
    </>
  );
}

export default App;
