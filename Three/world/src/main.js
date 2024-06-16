import { World } from "./World/World.js";
import { World as TrainWorld } from "./World/TrainWorld.js";
import { World as CubeWorld } from "./World/CubeWorld.js";
import { World as BallWorld } from "./World/BallWorld.js";

async function main() {
  const cubeContainer = document.getElementById("cube-container");
  const cubeWorld = new CubeWorld(cubeContainer);
  cubeWorld.start();

  const ballContainer = document.getElementById("ball-container");
  const ballWorld = new BallWorld(ballContainer);
  ballWorld.start();

  const trainContainer = document.getElementById("train-container");
  const trainWorld = new TrainWorld(trainContainer);
  trainWorld.start();

  const container = document.getElementById("birds-container");
  const world = new World(container);
  await world.init();
  world.start();
}

main().catch((err) => {
  console.error(err);
});
