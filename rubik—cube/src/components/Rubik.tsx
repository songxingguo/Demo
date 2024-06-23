import * as THREE from "three";
import { useThree } from "@react-three/fiber";

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
  const { camera, scene } = useThree();

  let isRotating = false; // 是否在旋转
  let startCube: any; // 焦点立方体
  let normalize: any; // 焦点立方体表面的法线
  let startPoint: any; // 鼠标焦点的起始位置

  const rotateDuration = 500; // 转动的总运动时间

  const setupEvents = () => {
    window.addEventListener("mousedown", startMouse);
    window.addEventListener("mousemove", moveMouse);
    window.addEventListener("mouseup", stopMouse);
    window.addEventListener("touchstart", startMouse);
    window.addEventListener("touchmove", moveMouse);
    window.addEventListener("touchend", stopMouse);
  };
  setupEvents();

  /**
   * 魔方控制方法
   */
  function startMouse(event: any) {
    // 找到
    const value = getIntersectAndNormalize(event);
    normalize = value.normalize;
    console.log("startMouse");
    // 魔方没有处于转动过程中且存在碰撞物体
    if (!isRotating && value.intersect) {
      // controller.enabled = false; // 当刚开始的接触点在魔方上时操作为转动魔方，屏蔽控制器转动
      startCube = value.intersect.object;
      startPoint = value.intersect.point; // 开始转动，设置起始点
    } else {
      // controller.enabled = true; // 当刚开始的接触点没有在魔方上或者在魔方上，但是魔方正在转动时操作转动控制器
    }
  }

  function moveMouse(event: any) {
    const value = getIntersectAndNormalize(event);
    if (!isRotating && value.intersect && startPoint) {
      const movePoint = value.intersect.point;
      console.log("moveMouse");
      if (!movePoint.equals(startPoint)) {
        isRotating = true;
        let vector = movePoint.sub(startPoint);
        let direction = getDirection(vector);
        let cubes = getPlaneCubes(startCube, direction);
        requestAnimationFrame((timestamp) => {
          rotateAnimation(cubes, direction, timestamp, 0, 0);
        });
      }
    }
  }

  function stopMouse(event: any) {
    console.log("stopMouse");
    startCube = null;
    startPoint = null;
    isRotating = false;
    // controller.enabled = true;
  }

  function setupRubiks() {
    // 透明正方体
    const size = BasicParams.len * BasicParams.num;
    let box = new THREE.BoxGeometry(size, size, size);
    let mesh = new THREE.MeshBasicMaterial({
      // vertexColors: THREE.FaceColors,
      opacity: 0,
      transparent: true,
    });
    const rubiks = new THREE.Mesh(box, mesh);
    rubiks.name = "coverCube";
    scene.add(rubiks);
  }
  setupRubiks();

  /**
   * 获取操作焦点以及该焦点所在平面的法向量
   * */
  function getIntersectAndNormalize(event: any) {
    let mouse = new THREE.Vector2();
    if (event.touches) {
      // 触摸事件
      const touch = event.touches[0];
      mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
    } else {
      // 鼠标事件
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    // Raycaster方式定位选取元素，可能会选取多个，以第一个为准
    const intersects = raycaster.intersectObjects(scene.children);
    let intersect, normalize;
    if (intersects.length) {
      try {
        if (intersects[0].object?.name === "coverCube") {
          intersect = intersects[1];
          normalize = intersects[0].face?.normal;
        } else {
          intersect = intersects[0];
          normalize = intersects[1].face?.normal;
        }
      } catch (err) {
        //nothing
      }
    }
    return { intersect: intersect, normalize: normalize };
  }

  /**
   * 根据立方体和旋转方向，找到同一平面上的所有立方体
   */
  function getPlaneCubes(cube: any, direction: any) {
    const cubes = scene.children;
    let results = [];
    let orientation = direction % 10;
    switch (orientation) {
      case 1:
      case 2:
        // 绕x轴
        for (let i = 0; i < cubes.length; i++) {
          let curr = cubes[i];
          // console.log("绕x轴", curr.position, cube.position);
          if (Math.abs(curr.position.x - cube.position.x) < 0.2) {
            results.push(curr);
          }
        }
        break;
      case 3:
      case 4:
        // 绕y轴
        for (let i = 0; i < cubes.length; i++) {
          let curr = cubes[i];
          // console.log("绕y轴", curr.position, cube.position);
          if (Math.abs(curr.position.y - cube.position.y) < 0.2) {
            results.push(curr);
          }
        }
        break;
      case 5:
      case 6:
        // 绕z轴
        for (let i = 0; i < cubes.length; i++) {
          let curr = cubes[i];
          // console.log("绕z轴", curr.position, cube.position);
          if (Math.abs(curr.position.z - cube.position.z) < 0.2) {
            results.push(curr);
          }
        }
        break;
    }
    return results;
  }

  // 魔方转动的六个方向
  const xLine = new THREE.Vector3(1, 0, 0); // X轴正方向
  const xLineAd = new THREE.Vector3(-1, 0, 0); // X轴负方向
  const yLine = new THREE.Vector3(0, 1, 0); // Y轴正方向
  const yLineAd = new THREE.Vector3(0, -1, 0); // Y轴负方向
  const zLine = new THREE.Vector3(0, 0, 1); // Z轴正方向
  const zLineAd = new THREE.Vector3(0, 0, -1); // Z轴负方向

  /**
   * 获得旋转方向
   * vector3: 鼠标滑动的方向
   */
  function getDirection(vector3: any) {
    let direction;
    // 判断差向量和 x、y、z 轴的夹角
    const xAngle = vector3.angleTo(xLine);
    const xAngleAd = vector3.angleTo(xLineAd);
    const yAngle = vector3.angleTo(yLine);
    const yAngleAd = vector3.angleTo(yLineAd);
    const zAngle = vector3.angleTo(zLine);
    const zAngleAd = vector3.angleTo(zLineAd);
    const minAngle = Math.min(
      ...[xAngle, xAngleAd, yAngle, yAngleAd, zAngle, zAngleAd]
    ); // 最小夹角
    switch (minAngle) {
      case xAngle:
        direction = 10; // 向x轴正方向旋转90度（还要区分是绕z轴还是绕y轴）
        if (normalize.equals(yLine)) {
          direction = direction + 5; // 绕z轴顺时针
        } else if (normalize.equals(yLineAd)) {
          direction = direction + 6; // 绕z轴逆时针
        } else if (normalize.equals(zLine)) {
          direction = direction + 4; // 绕y轴逆时针
        } else if (normalize.equals(zLineAd)) {
          direction = direction + 3; // 绕y轴顺时针
        }
        break;
      case xAngleAd:
        direction = 20; // 向x轴反方向旋转90度
        if (normalize.equals(yLine)) {
          direction = direction + 6; // 绕z轴逆时针
        } else if (normalize.equals(yLineAd)) {
          direction = direction + 5; // 绕z轴顺时针
        } else if (normalize.equals(zLine)) {
          direction = direction + 3; // 绕y轴顺时针
        } else if (normalize.equals(zLineAd)) {
          direction = direction + 4; // 绕y轴逆时针
        }
        break;
      case yAngle:
        direction = 30; // 向y轴正方向旋转90度
        if (normalize.equals(zLine)) {
          direction = direction + 1; // 绕x轴顺时针
        } else if (normalize.equals(zLineAd)) {
          direction = direction + 2; // 绕x轴逆时针
        } else if (normalize.equals(xLine)) {
          direction = direction + 6; // 绕z轴逆时针
        } else {
          direction = direction + 5; // 绕z轴顺时针
        }
        break;
      case yAngleAd:
        direction = 40; // 向y轴反方向旋转90度
        if (normalize.equals(zLine)) {
          direction = direction + 2; // 绕x轴逆时针
        } else if (normalize.equals(zLineAd)) {
          direction = direction + 1; // 绕x轴顺时针
        } else if (normalize.equals(xLine)) {
          direction = direction + 5; // 绕z轴顺时针
        } else {
          direction = direction + 6; // 绕z轴逆时针
        }
        break;
      case zAngle:
        direction = 50; // 向z轴正方向旋转90度
        if (normalize.equals(yLine)) {
          direction = direction + 2; // 绕x轴逆时针
        } else if (normalize.equals(yLineAd)) {
          direction = direction + 1; // 绕x轴顺时针
        } else if (normalize.equals(xLine)) {
          direction = direction + 3; // 绕y轴顺时针
        } else if (normalize.equals(xLineAd)) {
          direction = direction + 4; // 绕y轴逆时针
        }
        break;
      case zAngleAd:
        direction = 60; // 向z轴反方向旋转90度
        if (normalize.equals(yLine)) {
          direction = direction + 1; // 绕x轴顺时针
        } else if (normalize.equals(yLineAd)) {
          direction = direction + 2; // 绕x轴逆时针
        } else if (normalize.equals(xLine)) {
          direction = direction + 4; // 绕y轴逆时针
        } else if (normalize.equals(xLineAd)) {
          direction = direction + 3; // 绕y轴顺时针
        }
        break;
      default:
        break;
    }
    return direction;
  }

  function rotateAnimation(
    cubes: any,
    direction: any,
    currentstamp: any,
    startstamp: any,
    laststamp: any
  ) {
    if (startstamp === 0) {
      startstamp = currentstamp;
      laststamp = currentstamp;
    }
    if (currentstamp - startstamp >= rotateDuration) {
      currentstamp = startstamp + rotateDuration;
      isRotating = false;
      startPoint = null;
    }
    let orientation = direction % 10;
    let radians = orientation % 2 == 1 ? -90 : 90;
    switch (orientation) {
      case 1:
      case 2:
        for (let i = 0; i < cubes.length; i++) {
          rotateAroundWorldX(
            cubes[i],
            (((radians * Math.PI) / 180) * (currentstamp - laststamp)) /
              rotateDuration
          );
        }
        break;
      case 3:
      case 4:
        for (let i = 0; i < cubes.length; i++) {
          rotateAroundWorldY(
            cubes[i],
            (((radians * Math.PI) / 180) * (currentstamp - laststamp)) /
              rotateDuration
          );
        }
        break;
      case 5:
      case 6:
        for (let i = 0; i < cubes.length; i++) {
          rotateAroundWorldZ(
            cubes[i],
            (((radians * Math.PI) / 180) * (currentstamp - laststamp)) /
              rotateDuration
          );
        }
        break;
    }
    if (currentstamp - startstamp < rotateDuration) {
      requestAnimationFrame((timestamp) => {
        rotateAnimation(cubes, direction, timestamp, startstamp, currentstamp);
      });
    }
  }

  function rotateAroundWorldX(cube: any, rad: any) {
    const y0 = cube.position.y;
    const z0 = cube.position.z;
    const q = new THREE.Quaternion();
    q.setFromAxisAngle(new THREE.Vector3(1, 0, 0), rad);
    cube.quaternion.premultiply(q);
    cube.position.y = Math.cos(rad) * y0 - Math.sin(rad) * z0;
    cube.position.z = Math.cos(rad) * z0 + Math.sin(rad) * y0;
  }

  function rotateAroundWorldY(cube: any, rad: any) {
    const x0 = cube.position.x;
    const z0 = cube.position.z;
    const q = new THREE.Quaternion();
    q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rad);
    cube.quaternion.premultiply(q);
    cube.position.x = Math.cos(rad) * x0 + Math.sin(rad) * z0;
    cube.position.z = Math.cos(rad) * z0 - Math.sin(rad) * x0;
  }

  function rotateAroundWorldZ(cube: any, rad: any) {
    const x0 = cube.position.x;
    const y0 = cube.position.y;
    const q = new THREE.Quaternion();
    q.setFromAxisAngle(new THREE.Vector3(0, 0, 1), rad);
    cube.quaternion.premultiply(q);
    cube.position.x = Math.cos(rad) * x0 - Math.sin(rad) * y0;
    cube.position.y = Math.cos(rad) * y0 + Math.sin(rad) * x0;
  }

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

    const materials = genMaterials();

    const cubes = [];
    for (let i = 0; i < num; i++) {
      for (let j = 0; j < num * num; j++) {
        let position = { x: 0, y: 0, z: 0 };
        //依次计算各个小方块中心点坐标
        position.x = leftUpX + len / 2 + (j % num) * len;
        position.y = leftUpY - len / 2 - Math.floor(j / num) * len;
        position.z = leftUpZ - len / 2 - i * len;
        cubes.push(
          <mesh
            position={[position.x, position.y, position.z]}
            material={materials}
            key={`${i}-${j}`}
          >
            <boxGeometry
              args={[BasicParams.len, BasicParams.len, BasicParams.len]}
            />
          </mesh>
        );
      }
    }
    return cubes;
  };

  return genCubes(
    BasicParams.x,
    BasicParams.y,
    BasicParams.z,
    BasicParams.num,
    BasicParams.len
  );
}
