import React, { useContext, useEffect, useRef, useState } from 'react';
import * as Three from 'three';
import { parseData, PlanData, updateScene } from './scene-creator';
import { disposeScene } from './three-memory-cleaner';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as SharedStyle from '../../shared-style';
import ReactPlannerContext from '../../react-planner-context';
import { usePrevious } from '@uidotdev/usehooks';
import { State } from '../../models';
import { diff } from '../../utils/history';

let mouseDownEvent: (event: MouseEvent) => void = null;
let mouseUpEvent: (event: MouseEvent) => void = null;
let cameraP: Three.PerspectiveCamera = null;
let scene3DP: Three.Scene = null;
let planDataP: PlanData = null;
let orbitControllerP = null;
const lastMousePosition = {
  x: 0,
  y: 0
};
let renderingID: number;

interface Scene3DViewerProps {
  state: State;
  width: number;
  height: number;
}

export default function Scene3DViewer(props: Scene3DViewerProps) {
  const { width, height } = props;

  const previousProps = usePrevious(props);
  const canvasWrapper = useRef(null);
  const actions = useContext(ReactPlannerContext);
  const { catalog, projectActions } = actions;

  const [renderer, _setRenderer] = useState((
    (window as any).__threeRenderer ||
    new Three.WebGLRenderer({ preserveDrawingBuffer: true })
  ) as Three.WebGLRenderer);
  (window as any).__threeRenderer = renderer;

  useEffect(() => {
    const { state } = props;

    const scene3D = new Three.Scene();

    //RENDERER
    renderer.setClearColor(new Three.Color(SharedStyle.COLORS.white));
    renderer.setSize(width, height);

    // LOAD DATA
    const planData = parseData(state.scene, actions, catalog);

    scene3D.add(planData.plan);
    scene3D.add(planData.grid);

    const aspectRatio = width / height;
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
    dirLight.position.set(cameraPositionX + 300, cameraPositionY + 400, cameraPositionZ + 300);
    scene3D.add(dirLight);

    // OBJECT PICKING
    const toIntersect = [planData.plan];
    const mouse = new Three.Vector2();
    const raycaster = new Three.Raycaster();

    mouseDownEvent = (event: MouseEvent) => {
      const x = (event.offsetX / props.width) * 2 - 1;
      const y = (-event.offsetY / props.height) * 2 + 1;
      Object.assign(lastMousePosition, { x, y });
    };
    mouseUpEvent = (event: MouseEvent) => {
      event.preventDefault();
      mouse.x = (event.offsetX / props.width) * 2 - 1;
      mouse.y = -(event.offsetY / props.height) * 2 + 1;

      if (
        Math.abs(mouse.x - lastMousePosition.x) <= 0.02 &&
        Math.abs(mouse.y - lastMousePosition.y) <= 0.02
      ) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(toIntersect, true);

        if (intersects.length > 0 && !isNaN(intersects[0].distance)) {
          const object = intersects[0].object as any; //TODO
          object.interact && object.interact();
        } else {
          projectActions.unselectAll();
        }
      }
    };

    renderer.domElement.addEventListener("mousedown", mouseDownEvent);
    renderer.domElement.addEventListener("mouseup", mouseUpEvent);
    renderer.domElement.style.display = "block";

    canvasWrapper.current.appendChild(renderer.domElement);

    // create orbit controls
    const orbitController = new OrbitControls(camera, renderer.domElement);
    const spotLightTarget = new Three.Object3D();
    spotLightTarget.name = "spotLightTarget";
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

      renderer.render(scene3D, camera);

      renderingID = requestAnimationFrame(render);
    };

    render();

    cameraP = camera;
    scene3DP = scene3D;

    planDataP = planData;
    orbitControllerP = orbitController;

    return () => {
      cancelAnimationFrame(renderingID);
      orbitControllerP.dispose();

      renderer.domElement.removeEventListener("mousedown", mouseDownEvent);
      renderer.domElement.removeEventListener("mouseup", mouseUpEvent);

      disposeScene(scene3DP);
      scene3DP.remove(planDataP.plan);
      scene3DP.remove(planDataP.grid);

      scene3DP = null;
      planDataP = null;
      cameraP = null;
      orbitControllerP = null;
      renderer.renderLists.dispose();
    };
  }, []);

  useEffect(() => {
    if (cameraP) {
      cameraP.aspect = props.width / props.height;
      cameraP.updateProjectionMatrix();
    }

    if (previousProps && props.state.scene !== previousProps.state.scene) {
      const changedValues = diff(previousProps.state.scene, props.state.scene);
      updateScene(
        planDataP,
        props.state.scene,
        previousProps.state.scene,
        changedValues,
        actions,
        catalog
      );
    }
    renderer.setSize(props.width, props.height);
  }, [props]);

  return <div ref={canvasWrapper} />;
};
