import { Box, useGLTF } from "@react-three/drei";
import diceAsset from "../../assets/dice.glb";
import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshStandardMaterial } from "three";

const EngineDice = (props) => {
  const { scene } = useGLTF(diceAsset);
  const animationGroup = useRef();
  const mesh = useRef();
  const copiedScene = useMemo(() => scene.clone(), [scene]);

  const [number, setNumber] = useState(props.number);
  const [isSelected, setIsSelected] = useState(false);

  useFrame((state, delta) => {
    animationGroup.current.rotation.z += delta;
  });

  useEffect(() => {
    if (!mesh.current) return;
    switch (number) {
      case 1:
        mesh.current.rotation.x = 0;
        mesh.current.rotation.y = 0;
        break;
      case 2:
        mesh.current.rotation.x = 0;
        mesh.current.rotation.y = -Math.PI / 2;
        break;
      case 3:
        mesh.current.rotation.x = -Math.PI / 2;
        mesh.current.rotation.y = 0;
        break;
      case 4:
        mesh.current.rotation.x = Math.PI / 2;
        mesh.current.rotation.y = 0;
        break;
      case 5:
        mesh.current.rotation.x = 0;
        mesh.current.rotation.y = Math.PI / 2;
        break;
      case 6:
        mesh.current.rotation.x = Math.PI;
        mesh.current.rotation.y = 0;
        break;
    }
  }, [mesh, number]);

  //<meshStandardMaterial transparent opacity={1} color="red" />

  return (
    <group {...props} scale={props.scale ? props.scale : 0.1}>
      <group onClick={() => setIsSelected(!isSelected)} ref={animationGroup}>
        <Box
          args={[21, 21, 21]}
          material={
            new MeshStandardMaterial({
              color: "red",
              opacity: isSelected ? 0.5 : 0,
              transparent: true,
            })
          }
        />
        <primitive ref={mesh} object={copiedScene} />
      </group>
    </group>
  );
};
export default EngineDice;
