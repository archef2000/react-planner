"use strict";

import React from 'react';
import * as Three from 'three';
import { parseData, PlanData, updateScene } from './scene-creator';
import { disposeScene } from './three-memory-cleaner';
import { initPointerLock } from "./pointer-lock-navigation";
import { firstPersonOnKeyDown, firstPersonOnKeyUp } from "./libs/first-person-controls";
import * as SharedStyle from '../../shared-style';
import ReactPlannerContext from '../../react-planner-context';
import { State } from '../../models';
import { diff } from '../../utils/history';
import PointerLockControls from './libs/pointer-lock-controls';

interface Viewer3DFirstPersonProps {
  state: State;
  width: number;
  height: number;
}

export default class Viewer3DFirstPerson extends React.Component<Viewer3DFirstPersonProps> {
  static contextType = ReactPlannerContext;
  declare context: React.ContextType<typeof ReactPlannerContext>;

  private renderer: Three.WebGLRenderer;
  private stopRendering = false;
  private scene3D: Three.Scene | null = null;
  private sceneOnTop: Three.Scene | null = null;
  private camera: Three.PerspectiveCamera | null = null;
  private planData: PlanData = null;
  private controls: PointerLockControls = null;
  private pointerlockChangeEvent: any = null;
  private requestPointerLockEvent: any = null;
  private keyDownEvent: any = null;
  private keyUpEvent: any = null;
  private mouseDownEvent: any = null;
  private canvasWrapper = React.createRef<HTMLDivElement>();

  constructor(props: Viewer3DFirstPersonProps) {
    super(props);
    this.renderer = (window as any).__threeRenderer || new Three.WebGLRenderer({ preserveDrawingBuffer: true });
    (window as any).__threeRenderer = this.renderer;
  }

  componentDidMount() {
    let prevTime = performance.now();
    const velocity = new Three.Vector3();
    const direction = new Three.Vector3();
    let moveForward = false;
    let moveBackward = false;
    let moveLeft = false;
    let moveRight = false;
    let canJump = false;

    const { width, height, state } = this.props;
    const { catalog, projectActions } = this.context;
    const actions = this.context;

    this.renderer.setClearColor(new Three.Color(SharedStyle.COLORS.white));
    this.renderer.setSize(width, height);

    const scene3D = new Three.Scene();
    const sceneOnTop = new Three.Scene();
    const planData = parseData(state.scene, actions, catalog);
    scene3D.add(planData.plan);

    const aspectRatio = width / height;
    const camera = new Three.PerspectiveCamera(45, aspectRatio, 0.1, 300000);
    sceneOnTop.add(camera);
    camera.position.set(0, 0, 0);
    camera.up = new Three.Vector3(0, 1, 0);

    const ambient = new Three.AmbientLight(0xafafaf);
    scene3D.add(ambient);
    const hemi = new Three.HemisphereLight(0xffffff, 0x666666, 0.5);
    scene3D.add(hemi);
    const pointLight = new Three.PointLight(SharedStyle.COLORS.white, 0.4, 1000);
    pointLight.position.set(0, 0, 0);
    scene3D.add(pointLight);
    const dirLight = new Three.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(300, 400, 300);
    scene3D.add(dirLight);

    document.body.requestPointerLock = document.body.requestPointerLock ||
      (document.body as any).mozRequestPointerLock ||
      (document.body as any).webkitRequestPointerLock;
    document.body.requestPointerLock();

    const humanHeight = 170;
    let yInitialPosition = planData.boundingBox.min.y + (planData.boundingBox.min.y - planData.boundingBox.max.y) / 2 + humanHeight;
    const { controls, pointerlockChangeEvent, requestPointerLockEvent } = initPointerLock(camera, this.renderer.domElement);
    controls.getObject().position.set(-50, yInitialPosition, -100);
    sceneOnTop.add(controls.getObject());

    this.keyDownEvent = (event: KeyboardEvent) => {
      const moveResult = firstPersonOnKeyDown(event, moveForward, moveLeft, moveBackward, moveRight, canJump, velocity);
      moveForward = moveResult.moveForward;
      moveLeft = moveResult.moveLeft;
      moveBackward = moveResult.moveBackward;
      moveRight = moveResult.moveRight;
      canJump = moveResult.canJump;
    };
    this.keyUpEvent = (event: KeyboardEvent) => {
      const moveResult = firstPersonOnKeyUp(event, moveForward, moveLeft, moveBackward, moveRight, canJump);
      moveForward = moveResult.moveForward;
      moveLeft = moveResult.moveLeft;
      moveBackward = moveResult.moveBackward;
      moveRight = moveResult.moveRight;
      canJump = moveResult.canJump;
    };
    document.addEventListener('keydown', this.keyDownEvent);
    document.addEventListener('keyup', this.keyUpEvent);

    const pointer = new Three.Object3D();
    pointer.name = 'pointer';
    const pointerMaterial = new Three.MeshBasicMaterial({ depthTest: false, depthWrite: false, color: SharedStyle.COLORS.black });
    const pointerGeometry1 = new Three.BufferGeometry();
    pointerGeometry1.setAttribute('position', new Three.BufferAttribute(new Float32Array([-10, 0, 0, 10, 0, 0]), 3));
    const linePointer1 = new Three.Line(pointerGeometry1, pointerMaterial); linePointer1.position.z -= 100;
    const pointerGeometry2 = new Three.BufferGeometry();
    pointerGeometry2.setAttribute('position', new Three.BufferAttribute(new Float32Array([0, 10, 0, 0, -10, 0]), 3));
    const linePointer2 = new Three.Line(pointerGeometry2, pointerMaterial); linePointer2.position.z -= 100;
    const pointerGeometry3 = new Three.BufferGeometry();
    pointerGeometry3.setAttribute('position', new Three.BufferAttribute(new Float32Array([-1, 1, 0, 1, 1, 0, 1, -1, 0, -1, -1, 0, -1, 1, 0]), 3));
    const linePointer3 = new Three.Line(pointerGeometry3, pointerMaterial); linePointer3.position.z -= 100;
    pointer.add(linePointer1); pointer.add(linePointer2); pointer.add(linePointer3);
    camera.add(pointer);

    const toIntersect = [planData.plan];
    const mouseVector = new Three.Vector2(0, 0);
    const raycaster = new Three.Raycaster();
    this.mouseDownEvent = (event: MouseEvent) => {
      if (controls.enabled) {
        event.preventDefault();
        raycaster.setFromCamera(mouseVector, camera);
        const intersects = raycaster.intersectObjects(toIntersect, true);
        if (intersects.length > 0 && !isNaN(intersects[0].distance)) {
          const object = intersects[0].object as any;
          object.interact && object.interact();
        } else {
          projectActions.unselectAll();
        }
      }
    };
    document.addEventListener('mousedown', this.mouseDownEvent, false);

    this.renderer.domElement.style.display = 'block';
    (this.canvasWrapper.current as HTMLDivElement).appendChild(this.renderer.domElement);
    this.renderer.autoClear = false;

    const render = () => {
      if (!this.stopRendering && planData) {
        yInitialPosition = planData.boundingBox.min.y + humanHeight;
        const multiplier = 5;
        const time = performance.now();
        const delta = (time - prevTime) / 1000 * multiplier;
        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;
        velocity.y -= 9.8 * 100.0 * delta / multiplier;
        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveLeft) - Number(moveRight);
        direction.normalize();
        if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;
        controls.getObject().translateX(velocity.x * delta);
        controls.getObject().translateY(velocity.y * delta);
        controls.getObject().translateZ(velocity.z * delta);
        if (controls.getObject().position.y < yInitialPosition) {
          velocity.y = 0;
          controls.getObject().position.y = yInitialPosition;
          canJump = true;
        }
        prevTime = time;
        const controlObjectPosition = controls.getObject().position;
        pointLight.position.set(controlObjectPosition.x, controlObjectPosition.y, controlObjectPosition.z);
        for (const elemID in planData.sceneGraph.LODs) planData.sceneGraph.LODs[elemID].update(camera);
        this.renderer.clear();
        this.renderer.render(scene3D, camera);
        this.renderer.clearDepth();
        this.renderer.render(sceneOnTop, camera);
        requestAnimationFrame(render);
      }
    };
    render();

    this.scene3D = scene3D;
    this.sceneOnTop = sceneOnTop;
    this.camera = camera;
    this.planData = planData;
    this.controls = controls;
    this.pointerlockChangeEvent = pointerlockChangeEvent;
    this.requestPointerLockEvent = requestPointerLockEvent;
  }

  componentDidUpdate(prevProps: Viewer3DFirstPersonProps) {
    if (!this.camera) return;
    const { width, height, state } = this.props;
    if (prevProps.width !== width || prevProps.height !== height) {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    }
    if (prevProps.state.scene !== state.scene && this.planData) {
      const changedValues = diff(prevProps.state.scene, state.scene);
      updateScene(this.planData, state.scene, prevProps.state.scene, changedValues, this.context, this.context.catalog);
    }
    if (this.scene3D && this.sceneOnTop && this.camera) {
      this.renderer.clear();
      this.renderer.render(this.scene3D, this.camera);
      this.renderer.clearDepth();
      this.renderer.render(this.sceneOnTop, this.camera);
    }
  }

  componentWillUnmount() {
    this.stopRendering = true;
    this.renderer.autoClear = true;
    document.removeEventListener('mousedown', this.mouseDownEvent);
    document.removeEventListener('keydown', this.keyDownEvent);
    document.removeEventListener('keyup', this.keyUpEvent);
    document.removeEventListener('pointerlockchange', this.pointerlockChangeEvent);
    document.removeEventListener('mozpointerlockchange', this.pointerlockChangeEvent);
    document.removeEventListener('webkitpointerlockchange', this.pointerlockChangeEvent);
    this.renderer.domElement.removeEventListener('click', this.requestPointerLockEvent);
    if (this.scene3D && this.planData) {
      disposeScene(this.scene3D);
      this.scene3D.remove(this.planData.plan);
    }
    this.scene3D = null;
    this.planData = null;
    this.renderer.renderLists.dispose();
  }

  render() {
    return <div ref={this.canvasWrapper} />;
  }
}
