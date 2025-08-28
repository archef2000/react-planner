import { Vector3 } from 'three';

export function firstPersonOnKeyDown(event: KeyboardEvent, moveForward: boolean, moveLeft: boolean, moveBackward: boolean, moveRight: boolean, canJump: boolean, velocity: Vector3) {

  switch (event.keyCode) {

    case 38: // up
    case 87: // w
      moveForward = true;
      break;

    case 37: // left
    case 65: // a
      moveLeft = true;
      break;

    case 40: // down
    case 83: // s
      moveBackward = true;
      break;

    case 39: // right
    case 68: // d
      moveRight = true;
      break;

    case 32: // space
      if (canJump === true) velocity.y += 225;
      canJump = false;
      break;
  }

  return { moveForward, moveLeft, moveBackward, moveRight, canJump }
}

export function firstPersonOnKeyUp(event: KeyboardEvent, moveForward: boolean, moveLeft: boolean, moveBackward: boolean, moveRight: boolean, canJump: boolean) {

  switch (event.keyCode) {
    case 38: // up
    case 87: // w
      moveForward = false;
      break;

    case 37: // left
    case 65: // a
      moveLeft = false;
      break;

    case 40: // down
    case 83: // s
      moveBackward = false;
      break;

    case 39: // right
    case 68: // d
      moveRight = false;
      break;
  }
  return { moveForward, moveLeft, moveBackward, moveRight, canJump }
}
