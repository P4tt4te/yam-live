import { Plane } from "@react-three/drei";

const EngineBoard = () => {
  return (
    <Plane args={[40, 40]} position={[0, 0, 0]} rotation={[0,0,0]}>
      <meshStandardMaterial color="green" />
    </Plane>
  );
};

export default EngineBoard;
