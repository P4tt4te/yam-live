import { Canvas } from "@react-three/fiber";
import TestBox from "./engine/test-box.component";
import EngineDice from "./engine/engine-dice.component";
import EngineBoard from "./engine/engine-board.component";

const Engine = () => {
  //<TestBox />

  return (
    <Canvas
      gl={{ physicallyCorrectLights: true }}
      camera={{ position: [0, 0, 15], rotation: [0, 0, Math.PI / 4] }}
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
      <pointLight position={[3, 3, 10]} intensity={1000} />
      <group position={[0, 0, 0.8]}>
        <EngineDice position={[-4, 0, 0]} number={1} />
        <EngineDice position={[4, 0, 0]} number={2} />
        <EngineDice position={[0, 0, 0]} number={3} />
        <EngineDice position={[4, -4, 0]} number={4} />
        <EngineDice position={[-4, 4, 0]} number={5} />
      </group>
      <EngineBoard />
    </Canvas>
  );
};

export default Engine;
