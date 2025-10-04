import * as THREE from 'three';

import PointerLockControls from './libs/pointer-lock-controls';

export function initPointerLock(
  camera: THREE.PerspectiveCamera,
  rendererElement: HTMLCanvasElement
) {
  const havePointerLock =
    'pointerLockElement' in document ||
    'mozPointerLockElement' in document ||
    'webkitPointerLockElement' in document;

  const pointerlockchange = (event: Event) => {
    controls.enabled = !controls.enabled;
  };

  const requestPointerLockEvent = (event: PointerEvent) => {
    document.body.requestPointerLock =
      document.body.requestPointerLock ||
      (document.body as any).mozRequestPointerLock ||
      (document.body as any).webkitRequestPointerLock;
    document.body.requestPointerLock();
  };

  if (havePointerLock) {
    document.addEventListener('pointerlockchange', pointerlockchange, false);
    document.addEventListener('mozpointerlockchange', pointerlockchange, false);
    document.addEventListener(
      'webkitpointerlockchange',
      pointerlockchange,
      false
    );
    rendererElement.addEventListener('click', requestPointerLockEvent);
  } else {
    console.log("Your browser doesn't seem to support Pointer Lock API");
  }

  const controls = new PointerLockControls(camera);
  return {
    controls,
    pointerlockChangeEvent: pointerlockchange,
    requestPointerLockEvent
  };
}
