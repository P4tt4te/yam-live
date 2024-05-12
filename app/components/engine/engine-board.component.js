import { Plane } from "@react-three/drei";

const EngineBoard = () => {
  return (
    <Plane args={[30, 30]} position={[0, 0, 0]} rotation={[0,0,0]}>
      <meshStandardMaterial color="green" />
    </Plane>
  );
};

export default EngineBoard;
