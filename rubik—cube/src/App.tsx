import "./App.css";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

//基础模型参数
const BasicParams = {
  x: 0,
  y: 0,
  z: 0,
  num: 2,
  len: 1,
  //右、左、上、下、前、后
  colors: ["#ff6b02", "#dd422f", "#ffffff", "#fdcd02", "#3d81f7", "#019d53"],
};

function App() {
  const genCubes = (
    x: number,
    y: number,
    z: number,
    num: number,
    len: number
  ) => {
    //魔方左上角坐标
    const leftUpX = x - (num / 2) * len;
    const leftUpY = y + (num / 2) * len;
    const leftUpZ = z + (num / 2) * len;

    const cubes = [];
    for (let i = 0; i < num; i++) {
      for (let j = 0; j < num * num; j++) {
        const cube = {
          position: { x: 0, y: 0, z: 0 },
        };
        //依次计算各个小方块中心点坐标
        cube.position.x = leftUpX + len / 2 + (j % num) * len;
        cube.position.y = leftUpY - len / 2 - Math.floor(j / num) * len;
        cube.position.z = leftUpZ - len / 2 - i * len;
        cubes.push(cube);
      }
    }
    return cubes;
  };

  const cubes = genCubes(
    BasicParams.x,
    BasicParams.y,
    BasicParams.z,
    BasicParams.num,
    BasicParams.len
  );

  const cubeMeshs = cubes.map((item) => {
    return (
      <mesh
        position={[item.position.x, item.position.y, item.position.z]}
        material={[
          new THREE.MeshBasicMaterial({ color: BasicParams.colors[0] }),
          new THREE.MeshBasicMaterial({ color: BasicParams.colors[1] }),
          new THREE.MeshBasicMaterial({ color: BasicParams.colors[2] }),
          new THREE.MeshBasicMaterial({ color: BasicParams.colors[3] }),
          new THREE.MeshBasicMaterial({ color: BasicParams.colors[4] }),
          new THREE.MeshBasicMaterial({ color: BasicParams.colors[5] }),
          new THREE.MeshBasicMaterial({ color: BasicParams.colors[6] }),
          new THREE.MeshBasicMaterial({ color: BasicParams.colors[7] }),
        ]}
      >
        <boxGeometry
          args={[BasicParams.len, BasicParams.len, BasicParams.len]}
        />
      </mesh>
    );
  });
  return (
    <>
      <Canvas>
        {cubeMeshs}
        <OrbitControls />
        <axesHelper args={[5]} />
      </Canvas>
    </>
  );
}

export default App;
