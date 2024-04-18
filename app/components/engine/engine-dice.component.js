import { useGLTF } from "@react-three/drei";
import diceAsset from "../../assets/dice.glb";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

const EngineDice = () => {
  const { scene } = useGLTF(diceAsset);
  const mesh = useRef();

  useFrame((state, delta) => {
    mesh.current.rotation.z += delta;
  });

  return (
    <group scale={0.1}>
      <primitive ref={mesh} object={scene} />
    </group>
  );
};
export default EngineDice;
