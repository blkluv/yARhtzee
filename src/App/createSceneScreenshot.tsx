import * as THREE from "three";
import { getScore } from "../gameRules/getScore";
import { DiceValue, Category } from "../gameRules/types";
import { renderDiceSvgToString } from "./Ui/Dice";

export const createSceneScreenshot = () => {
  const imageSize = 320;

  const box = new THREE.Box3();
  const center = new THREE.Vector3();
  const size = new THREE.Vector3();
  const camera = new THREE.OrthographicCamera();

  const renderer = new THREE.WebGLRenderer({});
  renderer.setSize(imageSize, imageSize);
  renderer.setClearColor("#f7f3ed");
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

  const canvas = document.createElement("canvas");
  canvas.width = renderer.domElement.width;
  canvas.height = renderer.domElement.height;
  const ctx = canvas.getContext("2d")!;

  const bestImageTypePromise = (async () => {
    for (const type of ["image/webp", "image/jpeg"] as const) {
      const blob = await new Promise<Blob | null>((r) =>
        canvas.toBlob(r, type)
      );
      if (blob?.type === type) return type;
    }
    return undefined;
  })();

  const getImage = async (
    scene: THREE.Scene,
    roll: DiceValue[],
    category: Category
  ) => {
    const dicePositions = roll.map(() => new THREE.Vector3());
    box.makeEmpty();
    scene.traverse((o) => {
      if (typeof o.userData?.diceIndex === "number") {
        box.expandByObject(o);
        o.getWorldPosition(dicePositions[o.userData.diceIndex]);
      }
    });

    const rollSorted = roll
      .map((value, i) => ({
        value,
        x: dicePositions[i].x,
      }))
      .sort((a, b) => a.x - b.x)
      .map((a) => a.value);

    // set camera
    {
      box.getCenter(center);
      box.getSize(size);
      const l =
        Math.max(
          size.x,
          size.z + 1 /* +1 to compensate for the camera slight angle */
        ) + 1; /* a nice margin */
      camera.top = -l / 2;
      camera.bottom = l / 2;
      camera.left = -l / 2;
      camera.right = l / 2;
      camera.updateProjectionMatrix();
      camera.position.set(center.x, 3, center.z);
      camera.quaternion.identity();
      camera.rotateX(-Math.PI / 2 + -0.3 /* add a slight angle */);
      camera.matrixWorldNeedsUpdate = true;
    }

    //
    // draw scene
    renderer.clear();
    renderer.render(scene, camera);
    ctx.drawImage(renderer.domElement, 0, 0);

    //
    // draw dices
    const diceSize = Math.min(25, canvas.width / roll.length);
    for (let i = roll.length; i--; ) {
      // const svgString = renderToStaticMarkup(<SvgDice value={rollSorted[i]} />); // this adds a huge chunk on the js payload
      const svgString = renderDiceSvgToString({ value: rollSorted[i] });
      const svgUrl = "data:image/svg+xml," + encodeURIComponent(svgString);
      const img = new Image();
      await new Promise((r) => {
        img.onload = r;
        img.src = svgUrl;
      });

      ctx.drawImage(
        img,
        canvas.width / 2 + (i - roll.length / 2) * diceSize,
        0,
        diceSize,
        diceSize
      );
    }

    //
    // draw category and scrore
    ctx.save();
    ctx.globalAlpha = 0.9;
    ctx.globalCompositeOperation = "difference";
    ctx.font = `bold ${22}px helvetica, Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = "#666";
    ctx.fillText(
      `${category}: ${getScore(category, roll)} points`,
      canvas.width / 2,
      diceSize + 4,
      canvas.width
    );
    ctx.restore();

    const type = await bestImageTypePromise;
    const blob = await new Promise<Blob | null>((r) =>
      canvas.toBlob(r, type, 0.8)
    );

    if (!blob) throw "could not canvas to blob";

    return blob;
  };
  const dispose = () => {
    renderer.dispose();
  };

  return { getImage, dispose };
};
