import React, { Component } from 'react';

import * as Three from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { State } from '../../models';
import ReactPlannerContext from '../../react-planner-context';
import * as SharedStyle from '../../shared-style';
import { diff } from '../../utils/history';

import { parseData, PlanData, updateScene } from './scene-creator';
import { disposeScene } from './three-memory-cleaner';

interface Scene3DViewerProps {
  state: State;
  width: number;
  height: number;
}

export default class Scene3DViewer extends Component<Scene3DViewerProps, {}> {
  static contextType = ReactPlannerContext;
  declare context: React.ContextType<typeof ReactPlannerContext>;

  lastMousePosition: { x: number; y: number } = { x: 0, y: 0 };
  width: number;
  height: number;
  renderingID = 0;
  renderer: Three.WebGLRenderer;

  canvasWrapper: React.RefObject<null | HTMLDivElement>;

  camera: Three.PerspectiveCamera | undefined;
  scene3D: Three.Scene | undefined;
  planData: PlanData | undefined;
  orbitController: OrbitControls | undefined;

  mouseDownEvent: undefined | ((event: MouseEvent) => void);
  mouseUpEvent: undefined | ((event: MouseEvent) => void);

  constructor(props: Scene3DViewerProps) {
    super(props);

    this.width = props.width;
    this.height = props.height;
    this.canvasWrapper = React.createRef<HTMLDivElement>();

    this.renderer =
      (window as any).__threeRenderer ||
      new Three.WebGLRenderer({ preserveDrawingBuffer: true });
    (window as any).__threeRenderer = this.renderer;
  }

  componentDidMount() {
    const { state } = this.props;

    const scene3D = new Three.Scene();

    //RENDERER
    this.renderer.setClearColor(new Three.Color(SharedStyle.COLORS.white));
    this.renderer.setSize(this.width, this.height);

    // LOAD DATA
    const planData = parseData(state.scene, this.context);

    scene3D.add(planData.plan);
    scene3D.add(planData.grid);

    const aspectRatio = this.width / this.height;
    const camera = new Three.PerspectiveCamera(45, aspectRatio, 1, 300000);

    scene3D.add(camera);

    // Set position for the camera
    const cameraPositionX =
      -(planData.boundingBox.max.x - planData.boundingBox.min.x) / 2;
    const cameraPositionY =
      ((planData.boundingBox.max.y - planData.boundingBox.min.y) / 2) * 10;
    const cameraPositionZ =
      (planData.boundingBox.max.z - planData.boundingBox.min.z) / 2;

    camera.position.set(cameraPositionX, cameraPositionY, cameraPositionZ);
    camera.up = new Three.Vector3(0, 1, 0);

    // HELPER AXIS
    // let axisHelper = new Three.AxesHelper(100);
    // scene3D.add(axisHelper);

    // LIGHT
    const ambient = new Three.AmbientLight(0xffffff, 0.45);
    scene3D.add(ambient);
    const hemi = new Three.HemisphereLight(0xffffff, 0x666666, 0.5);
    scene3D.add(hemi);
    const spotLight1 = new Three.SpotLight(SharedStyle.COLORS.white, 1.0);
    spotLight1.position.set(cameraPositionX, cameraPositionY, cameraPositionZ);
    scene3D.add(spotLight1);
    const dirLight = new Three.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(
      cameraPositionX + 300,
      cameraPositionY + 400,
      cameraPositionZ + 300
    );
    scene3D.add(dirLight);

    // OBJECT PICKING
    const toIntersect = [planData.plan];
    const mouse = new Three.Vector2();
    const raycaster = new Three.Raycaster();

    this.mouseDownEvent = (event: MouseEvent) => {
      this.lastMousePosition.x = (event.offsetX / this.width) * 2 - 1;
      this.lastMousePosition.y = (-event.offsetY / this.height) * 2 + 1;
    };
    this.mouseUpEvent = (event: MouseEvent) => {
      event.preventDefault();
      mouse.x = (event.offsetX / this.width) * 2 - 1;
      mouse.y = -(event.offsetY / this.height) * 2 + 1;

      if (
        Math.abs(mouse.x - this.lastMousePosition.x) <= 0.02 &&
        Math.abs(mouse.y - this.lastMousePosition.y) <= 0.02
      ) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(toIntersect, true);

        if (intersects.length > 0 && !isNaN(intersects[0].distance)) {
          const object = intersects[0].object as any; //TODO
          object.interact && object.interact();
        } else {
          this.context.projectActions.unselectAll();
        }
      }
    };

    if (this.mouseDownEvent)
      this.renderer.domElement.addEventListener(
        'mousedown',
        this.mouseDownEvent
      );
    if (this.mouseUpEvent)
      this.renderer.domElement.addEventListener('mouseup', this.mouseUpEvent);
    this.renderer.domElement.style.display = 'block';

    if (this.canvasWrapper.current)
      this.canvasWrapper.current.appendChild(this.renderer.domElement);

    // create orbit controls
    const orbitController = new OrbitControls(camera, this.renderer.domElement);
    const spotLightTarget = new Three.Object3D();
    spotLightTarget.name = 'spotLightTarget';
    spotLightTarget.position.set(
      orbitController.target.x,
      orbitController.target.y,
      orbitController.target.z
    );
    scene3D.add(spotLightTarget);
    spotLight1.target = spotLightTarget;

    const render = () => {
      orbitController.update();
      spotLight1.position.set(
        camera.position.x,
        camera.position.y,
        camera.position.z
      );
      spotLightTarget.position.set(
        orbitController.target.x,
        orbitController.target.y,
        orbitController.target.z
      );
      camera.updateMatrix();
      camera.updateMatrixWorld();

      for (const elemID in planData.sceneGraph.LODs) {
        planData.sceneGraph.LODs[elemID].update(camera);
      }

      this.renderer.render(scene3D, camera);

      this.renderingID = requestAnimationFrame(render);
    };

    render();

    this.camera = camera;
    this.scene3D = scene3D;
    this.orbitController = orbitController;
    this.planData = planData;
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.renderingID);
    this.orbitController?.dispose();

    if (this.mouseDownEvent)
      this.renderer.domElement.removeEventListener(
        'mousedown',
        this.mouseDownEvent
      );
    if (this.mouseUpEvent)
      this.renderer.domElement.removeEventListener(
        'mouseup',
        this.mouseUpEvent
      );

    if (this.scene3D) {
      disposeScene(this.scene3D);
      if (this.planData) {
        this.scene3D.remove(this.planData.plan);
        this.scene3D.remove(this.planData.grid);
      }
    }

    this.scene3D = undefined;
    this.planData = undefined;
    this.camera = undefined;
    this.orbitController = undefined;
    this.renderer.renderLists.dispose();
  }

  componentDidUpdate(prevProps: Scene3DViewerProps) {
    const { width, height } = this.props;
    this.width = width;
    this.height = height;
    if (this.camera) {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }

    if (prevProps && this.props.state.scene !== prevProps.state.scene) {
      const changedValues = diff(prevProps.state.scene, this.props.state.scene);
      if (this.planData) {
        updateScene(
          this.planData,
          this.props.state.scene,
          prevProps.state.scene,
          changedValues,
          this.context
        );
      }
    }
    this.renderer.setSize(width, height);
  }
  render() {
    return <div ref={this.canvasWrapper} />;
  }
}
