import { createCamera } from "./components/camera.js";
import { createLights } from "./components/lights.js";
import { createScene } from "./components/scene.js";
import { createAxesHelper, createGridHelper } from "./components/helpers.js";
import { Train } from "./components/Train/Train.js";

import { createControls } from "./systems/controls.js";
import { createRenderer } from "./systems/renderer.js";
import { Resizer } from "./systems/Resizer.js";
import { Loop } from "./systems/Loop.js";

class World {
  constructor(container) {
    this.camera = createCamera();
    this.renderer = createRenderer();
    this.scene = createScene();
    this.loop = new Loop(this.camera, this.scene, this.renderer);
    container.append(this.renderer.domElement);
    this.controls = createControls(this.camera, this.renderer.domElement);

    const { ambientLight, mainLight } = createLights();
    const train = new Train();

    this.loop.updatables.push(this.controls, train);
    this.scene.add(ambientLight, mainLight, train);

    const resizer = new Resizer(container, this.camera, this.renderer);
    this.scene.add(createAxesHelper(), createGridHelper());
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  start() {
    this.loop.start();
  }

  stop() {
    this.loop.stop();
  }
}

export { World };
