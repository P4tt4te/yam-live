import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

const TestBox = () => {
  const mesh = useRef();

  useFrame((state, delta) => {
    mesh.current.rotation.z += delta;
  });

  return (
    <mesh ref={mesh} position={[0, 0, 0]} rotation={[2, 3, 2]}>
      <boxGeometry />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  );
};

export default TestBox;
