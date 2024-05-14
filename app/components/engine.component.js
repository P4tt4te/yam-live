import { Canvas } from "@react-three/fiber";
import TestBox from "./engine/test-box.component";
import EngineDice from "./engine/engine-dice.component";
import EngineBoard from "./engine/engine-board.component";
import { useEffect } from "react";

const DICES_POSTITIONS = [
  [-4.6, -4.6, 0],
  [-2, -2, 0],
  [0, 0, 0],
  [2, 2, 0],
  [4.6, 4.6, 0],
];

const Engine = ({ dices, isOpponent, toggleDiceLock }) => {
  useEffect(() => console.log("dices:  ", dices), [dices]);

  return (
    <Canvas
      gl={{ physicallyCorrectLights: true }}
      camera={{ position: [0, 0, 8], rotation: [0, 0, Math.PI / 4] }}
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
        {dices.map((dice, index) => {
          if (dice.value === "" || index > 4) return;

          console.log("dice : ",dice);

          return (
            <EngineDice
              key={index}
              position={DICES_POSTITIONS[index]}
              number={parseInt(dice.value)}
              isLocked={dice.locked}
              isOpponent={isOpponent}
              onPress={() => !isOpponent && toggleDiceLock(index)}
            />
          );
        })}
      </group>
      <EngineBoard />
    </Canvas>
  );
};

export default Engine;
