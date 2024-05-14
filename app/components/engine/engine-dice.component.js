import { Box, useGLTF } from "@react-three/drei";
import diceAsset from "../../assets/dice.glb";
import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshStandardMaterial } from "three";
import { DiceLerp } from "@/app/helpers/diceLerp.helpers";

const EngineDice = (props) => {
  const { scene } = useGLTF(diceAsset);
  const animationGroup = useRef();
  const mesh = useRef();
  const copiedScene = useMemo(() => scene.clone(), [scene]);

  const [isSelected, setIsSelected] = useState(props.isLocked);

  useFrame((state, delta) => {
    animationGroup.current.rotation.y = DiceLerp(
      animationGroup.current.rotation.y,
      -Math.PI * 6
    );
    animationGroup.current.rotation.x = DiceLerp(
      animationGroup.current.rotation.y,
      -Math.PI * 6
    );
  });

  const restartAnimation = () => {
    if (!animationGroup.current) return;
    animationGroup.current.rotation.x = 0;
    animationGroup.current.rotation.y = 0;
  };

  useEffect(() => {
    if (!mesh.current) return;
    restartAnimation();
    switch (props.number) {
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
  }, [mesh, props.number]);

  //<meshStandardMaterial transparent opacity={1} color="red" />

  useEffect(() => {
    console.log("isLocked : ", props.isLocked);
  }, [props]);

  return (
    <group position={props.position} scale={props.scale ? props.scale : 0.1}>
      <group ref={animationGroup}>
        <Box
          args={[21, 21, 21]}
          material={
            new MeshStandardMaterial({
              color: "red",
              opacity: isSelected ? 0.5 : 0,
              transparent: true,
            })
          }
          onClick={(e) => {
            console.log("onClick");
            setIsSelected(!isSelected);
            props.onPress();
          }}
        />
        <primitive ref={mesh} object={copiedScene} />
      </group>
    </group>
  );
};
export default EngineDice;
