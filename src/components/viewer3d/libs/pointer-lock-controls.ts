/**
 * @author mrdoob / http://mrdoob.com/
 */

import * as THREE from 'three';

class PointerLockControls {
  yawObject: THREE.Object3D;
  pitchObject: THREE.Object3D;
  enabled = false;

  constructor(camera: THREE.PerspectiveCamera) {
    const scope = this;

    camera.rotation.set(0, 0, 0);

    this.pitchObject = new THREE.Object3D();
    this.pitchObject.name = 'pitchObject';
    this.pitchObject.add(camera);

    this.yawObject = new THREE.Object3D();
    this.yawObject.name = 'yawObject';
    this.yawObject.position.y = 10;
    this.yawObject.add(this.pitchObject);

    document.addEventListener('mousemove', this.onMouseMove.bind(this), false);
  }
  onMouseMove(event: MouseEvent) {
    const PI_2 = Math.PI / 2;
    if (this.enabled === false) return;

    const movementX = event.movementX || (event as any).mozMovementX || (event as any).webkitMovementX || 0;
    const movementY = event.movementY || (event as any).mozMovementY || (event as any).webkitMovementY || 0;

    this.yawObject.rotation.y -= movementX * 0.002;
    this.pitchObject.rotation.x -= movementY * 0.002;

    this.pitchObject.rotation.x = Math.max(- PI_2, Math.min(PI_2, this.pitchObject.rotation.x));
  };

  dispose() {
    document.removeEventListener('mousemove', this.onMouseMove.bind(this), false);
  };


  getObject() {
    return this.yawObject;
  };

  getDirection = function () {
    const direction = new THREE.Vector3(0, 0, - 1);
    const rotation = new THREE.Euler(0, 0, 0, "YXZ");

    return function (v: THREE.Vector3) {
      rotation.set(this.pitchObject.rotation.x, this.yawObject.rotation.y, 0);

      v.copy(direction).applyEuler(rotation);

      return v;
    };
  }();
};

export default PointerLockControls;