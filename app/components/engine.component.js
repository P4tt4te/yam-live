import { Canvas } from "@react-three/fiber";
import TestBox from "./engine/test-box.component";
import TestDice from "./engine/test-dice.component";

const Engine = () => {
  //<TestBox />

  return (
    <Canvas
      gl={{ physicallyCorrectLights: true }}
      camera={{ position: [-6, 0, 16], fov: 36 }}
      onCreated={(state) => {
        const _gl = state.gl.getContext();
        const pixelStorei = _gl.pixelStorei.bind(_gl);
        _gl.pixelStorei = function (...args) {
          const [parameter] = args;
          switch (parameter) {
            case _gl.UNPACK_FLIP_Y_WEBGL:
              return pixelStorei(...args);
          }
        };
      }}
    >
      <pointLight position={[-2, -3, 0]} intensity={100} />
      <pointLight position={[6, 10, 6]} intensity={1000} />
      <TestBox />
      <TestDice />
    </Canvas>
  );
};

export default Engine;
