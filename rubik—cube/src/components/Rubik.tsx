import * as THREE from "three";

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
export default function Rubik() {
  const faces = (rgbaColor: string) => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext("2d");
    if (!context) return;
    //画一个宽高都是256的黑色正方形
    context.fillStyle = "rgba(0,0,0,1)";
    context.fillRect(0, 0, 256, 256);
    //在内部用某颜色的16px宽的线再画一个宽高为224的圆角正方形并用改颜色填充
    context.rect(16, 16, 224, 224);
    context.lineJoin = "round";
    context.lineWidth = 16;
    context.fillStyle = rgbaColor;
    context.strokeStyle = rgbaColor;
    context.stroke();
    context.fill();
    return canvas;
  };

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

  const genMaterials = () => {
    const myFaces = [];
    for (let k = 0; k < 6; k++) {
      myFaces[k] = faces(BasicParams.colors[k]);
    }
    const materials = [];
    for (let k = 0; k < 6; k++) {
      const texture = new THREE.Texture(myFaces[k]);
      texture.needsUpdate = true;
      materials.push(new THREE.MeshBasicMaterial({ map: texture }));
    }
    return materials;
  };

  const cubes = genCubes(
    BasicParams.x,
    BasicParams.y,
    BasicParams.z,
    BasicParams.num,
    BasicParams.len
  );

  const materials = genMaterials();

  const cubeMeshs = cubes.map((item) => {
    return (
      <mesh
        position={[item.position.x, item.position.y, item.position.z]}
        material={materials}
      >
        <boxGeometry
          args={[BasicParams.len, BasicParams.len, BasicParams.len]}
        />
      </mesh>
    );
  });
  return cubeMeshs;
}
