import { Plane } from "@react-three/drei";

const EngineBoard = () => {
  return (
    <Plane args={[4, 4]} position={[0, 0, 0]} rotation={[0,-Math.PI / 8,0]}>
      <meshBasicMaterial color="green" />
    </Plane>
  );
};

export default EngineBoard;
