import * as Three from 'three';
import React from 'react';
import { defineCatalogElement } from '@archef2000/react-planner';

const WIDTH = 100;
const DEPTH = 80;
const HEIGHT = 100;

const black = new Three.MeshLambertMaterial({ color: 0x000000 });
const grey = new Three.MeshLambertMaterial({ color: 0xC0C0C0 });
const red = new Three.MeshLambertMaterial({ color: 0xCC0000 });
const blue = new Three.MeshLambertMaterial({ color: 0x000066 });
const yellow = new Three.MeshLambertMaterial({ color: 0xF7DA00 });
const green = new Three.MeshLambertMaterial({ color: 0x006633 });

const objectMaxLOD = makeObjectMaxLOD();
const objectMinLOD = makeObjectMinLOD();

function makeObjectMaxLOD() {
  //base
  const cleaning_cart = new Three.Mesh(new Three.BoxGeometry(1, 0.75, 0.05), grey);

  for (let rx = -0.4; rx <= 0.45; rx += 0.85) {
    for (let rz = -0.3; rz <= 0.3; rz += 0.6) {
      const tire = new Three.Mesh(new Three.CylinderGeometry(0.08, 0.08, 0.05, 32), black);
      tire.position.set(rx, rz, 0.15);
      cleaning_cart.add(tire);

      const bearing = new Three.Mesh(new Three.CylinderGeometry(0.06, 0.06, 0.06, 32), grey);
      tire.add(bearing);

      const nut = new Three.Mesh(new Three.CylinderGeometry(0.01, 0.01, 0.08, 6), black);
      nut.position.set(0, 0, 0);
      tire.add(nut);

      const coverUp = new Three.Mesh(new Three.CylinderGeometry(0.06, 0.06, 0.01, 32), grey);
      coverUp.rotation.x = 0.5 * Math.PI;
      coverUp.position.set(-0.03, 0, -0.12);
      tire.add(coverUp);

      const coverDown = new Three.Mesh(new Three.CylinderGeometry(0.03725, 0.03725, 0.03, 32), black);
      coverDown.rotation.x = 0.5 * Math.PI;
      coverDown.position.set(-0.03, 0, -0.1);
      tire.add(coverDown);

      const p1Geometry = new Three.CylinderGeometry(0.055, 0.055, 0.005, 3);
      const p1_left = new Three.Mesh(p1Geometry, grey);
      p1_left.position.set(-0.02, -0.035, -0.06);
      tire.add(p1_left);

      const p2Geometry = new Three.BoxGeometry(0.055, 0.11, 0.005);
      const p2_left = new Three.Mesh(p2Geometry, grey);
      p2_left.rotation.x = 0.5 * Math.PI;
      p2_left.position.set(0, -0.035, -0.04);
      tire.add(p2_left);

      const p1_right = new Three.Mesh(p1Geometry, grey);
      p1_right.position.set(-0.02, 0.035, -0.06);
      tire.add(p1_right);

      const p2_right = new Three.Mesh(p2Geometry, grey);
      p2_right.rotation.x = 0.5 * Math.PI;
      p2_right.position.set(0, 0.035, -0.04);
      tire.add(p2_right);

      const p3 = new Three.Mesh(new Three.BoxGeometry(0.095, 0.075, 0.01), grey);
      p3.position.set(-0.02, 0, -0.09);
      tire.add(p3);
    }
  }

  //drawer support
  const drawerSupportGeometry = new Three.BoxGeometry(0.85, 0.75, 0.05);
  const drawer_p1 = new Three.Mesh(drawerSupportGeometry, grey);
  drawer_p1.position.set(0.475, 0, -0.45);
  drawer_p1.rotation.y = 0.5 * Math.PI;
  cleaning_cart.add(drawer_p1);

  const drawer_p2 = new Three.Mesh(drawerSupportGeometry, grey);
  drawer_p2.position.set(0, 0, -0.45);
  drawer_p2.rotation.y = 0.5 * Math.PI;
  cleaning_cart.add(drawer_p2);

  //base top
  const baseTop = new Three.Mesh(new Three.BoxGeometry(0.5, 0.75, 0.05), grey);
  baseTop.position.set(0.25, 0, -0.8);
  cleaning_cart.add(baseTop);

  let gz;

  //shelfs guide
  for (gz = -0.74; gz <= -0.1; gz += 0.25) {
    const shelfGeometry = new Three.BoxGeometry(0.05, 0.75, 0.02);
    const shelf_1 = new Three.Mesh(shelfGeometry, grey);
    shelf_1.position.set(0.45, 0, gz);
    cleaning_cart.add(shelf_1);

    const shelf_2 = new Three.Mesh(shelfGeometry, grey);
    shelf_2.position.set(0.025, 0, gz);
    cleaning_cart.add(shelf_2);
  }

  let cz: number;

  //lateral drawers
  for (cz = -0.76; cz <= -0.1; cz += 0.25) {
    //border
    const drawerBorderGeometry = new Three.BoxGeometry(0.05, 0.75, 0.015);
    const drawerBorder_1 = new Three.Mesh(drawerBorderGeometry, blue);
    drawerBorder_1.position.set(0.42, 0, cz);
    cleaning_cart.add(drawerBorder_1);

    const drawerBorder_2 = new Three.Mesh(drawerBorderGeometry, blue);
    drawerBorder_2.position.set(0.055, 0, cz);
    cleaning_cart.add(drawerBorder_2);

    //long side
    const longSideGeometry = new Three.BoxGeometry(0.02, 0.20, 0.75);
    const longSide_1 = new Three.Mesh(longSideGeometry, blue);
    longSide_1.position.set(0.405, 0, cz + 0.1);
    longSide_1.rotation.x = 0.5 * Math.PI;
    cleaning_cart.add(longSide_1);

    const longSide_2 = new Three.Mesh(longSideGeometry, blue);
    longSide_2.position.set(0.07, 0, cz + 0.1);
    longSide_2.rotation.x = 0.5 * Math.PI;
    cleaning_cart.add(longSide_2);

    //short side
    const shortSideGeometry = new Three.BoxGeometry(0.02, 0.34, 0.215);
    const shortSide_1 = new Three.Mesh(shortSideGeometry, blue);
    shortSide_1.position.set(0.25, -0.365, cz + 0.1);
    shortSide_1.rotation.z = 0.5 * Math.PI;
    cleaning_cart.add(shortSide_1);

    const shortSide_2 = new Three.Mesh(shortSideGeometry, blue);
    shortSide_2.position.set(0.235, 0.365, cz + 0.1);
    shortSide_2.rotation.z = 0.5 * Math.PI;
    cleaning_cart.add(shortSide_2);

    //bottom side
    const bottomSide = new Three.Mesh(new Three.BoxGeometry(0.355, 0.75, 0.015), blue);
    bottomSide.position.set(0.2375, 0, cz + 0.205);
    cleaning_cart.add(bottomSide);
  }

  //bucket up support
  const bucket_1 = new Three.Mesh(new Three.BoxGeometry(0.5, 0.05, 0.05), grey);
  bucket_1.position.set(0.25, -0.35, -0.85);
  cleaning_cart.add(bucket_1);

  const bucket_2 = bucket_1.clone();
  bucket_2.position.set(0.25, 0.35, -0.85);
  cleaning_cart.add(bucket_2);

  //bucket down support
  const bucket_3 = bucket_1.clone();
  bucket_3.position.set(-0.25, -0.35, -0.05);
  cleaning_cart.add(bucket_3);

  const bucket_4 = bucket_1.clone();
  bucket_4.position.set(-0.25, 0.35, -0.05);
  cleaning_cart.add(bucket_4);

  const bucket_5 = new Three.Mesh(new Three.BoxGeometry(0.05, 0.65, 0.05), grey);
  bucket_5.position.set(-0.475, 0, -0.05);
  cleaning_cart.add(bucket_5);

  //waste basket top support
  const wasteSupport_1 = new Three.Mesh(new Three.BoxGeometry(0.5, 0.05, 0.05), grey);
  wasteSupport_1.position.set(0.7, -0.35, -0.05);
  cleaning_cart.add(wasteSupport_1);

  const wasteSupport_2 = wasteSupport_1.clone();
  wasteSupport_2.position.set(0.7, 0.35, -0.05);
  cleaning_cart.add(wasteSupport_2);

  const wasteSupport_3 = new Three.Mesh(new Three.BoxGeometry(0.05, 0.65, 0.05), grey);
  wasteSupport_3.position.set(0.925, 0, -0.05);
  cleaning_cart.add(wasteSupport_3);

  //waste basket support down
  const wasteSupportDown_1 = new Three.Mesh(new Three.BoxGeometry(0.5, 0.05, 0.05), grey);
  wasteSupportDown_1.position.set(0.7, -0.35, -0.85);
  cleaning_cart.add(wasteSupportDown_1);

  const wasteSupportDown_2 = wasteSupportDown_1.clone();
  wasteSupportDown_2.position.set(0.7, 0.35, -0.85);
  cleaning_cart.add(wasteSupportDown_2);

  const wasteSupportDown_3 = new Three.Mesh(new Three.BoxGeometry(0.05, 0.65, 0.05), grey);
  wasteSupportDown_3.position.set(0.925, 0, -0.85);
  cleaning_cart.add(wasteSupportDown_3);

  //waste cover
  const wasteCover = new Three.Mesh(new Three.BoxGeometry(0.45, 0.775, 0.05), blue);
  wasteCover.position.set(0.745, 0, -0.9);
  cleaning_cart.add(wasteCover);

  //sack
  const sack = new Three.Mesh(new Three.BoxGeometry(0.3, 0.65, 0.7), black);
  sack.position.set(0.75, 0, -0.5);
  cleaning_cart.add(sack);

  // cover pivot
  const coverPivotGeometry = new Three.CylinderGeometry(0.01, 0.01, 0.05, 32);
  const coverPivot_1 = new Three.Mesh(coverPivotGeometry, black);
  coverPivot_1.position.set(0.51, -0.35, -0.88);
  cleaning_cart.add(coverPivot_1);

  const coverPivot_2 = new Three.Mesh(coverPivotGeometry, black);
  coverPivot_2.position.set(0.51, 0.35, -0.88);
  cleaning_cart.add(coverPivot_2);

  let color1: Three.MeshLambertMaterial;
  let delta1: number;

  //bucket on the top
  for (let sty = -0.3; sty <= 0.3; sty += 0.6) {
    sty === -0.3 ? color1 = red : color1 = blue;
    sty === -0.3 ? delta1 = -1 : delta1 = 1;

    const bucketTop_1 = new Three.Mesh(new Three.BoxGeometry(0.2, 0.3, 0.05), color1);
    bucketTop_1.position.set(0.13, sty - delta1 * 0.14, -0.85);
    cleaning_cart.add(bucketTop_1);

    const bucketTop_2 = new Three.Mesh(new Three.BoxGeometry(0.2, 0.15, 0.02), color1);
    bucketTop_2.position.set(0.13, sty - delta1 * 0.29, -0.9);
    bucketTop_2.rotation.x = 0.5 * Math.PI;
    cleaning_cart.add(bucketTop_2);

    const bucketTop_3 = new Three.Mesh(new Three.BoxGeometry(0.2, 0.15, 0.02), color1);
    bucketTop_3.position.set(0.13, sty, -0.9);
    bucketTop_3.rotation.x = 0.5 * Math.PI;
    cleaning_cart.add(bucketTop_3);

    const bucketTop_4 = new Three.Mesh(new Three.BoxGeometry(0.15, 0.3, 0.02), color1);
    bucketTop_4.position.set(0.04, sty - delta1 * 0.14, -0.9);
    bucketTop_4.rotation.y = 0.5 * Math.PI;
    cleaning_cart.add(bucketTop_4);

    const bucketTop_5 = new Three.Mesh(new Three.BoxGeometry(0.15, 0.3, 0.02), color1);
    bucketTop_5.position.set(0.22, sty - delta1 * 0.14, -0.9);
    bucketTop_5.rotation.y = 0.5 * Math.PI;
    cleaning_cart.add(bucketTop_5);
  }

  let color2: Three.MeshLambertMaterial;
  let delta2: number;

  //bucket on the top
  for (let sty = -0.3; sty <= 0.3; sty += 0.6) {
    sty === -0.3 ? color2 = yellow : color2 = green;
    sty === -0.3 ? delta2 = -1 : delta2 = 1;

    const bucketTop2_p1 = new Three.Mesh(new Three.BoxGeometry(0.2, 0.3, 0.05), color2);
    bucketTop2_p1.position.set(0.35, sty - delta2 * 0.14, -0.85);
    cleaning_cart.add(bucketTop2_p1);

    const bucketTop2_p2 = new Three.Mesh(new Three.BoxGeometry(0.2, 0.15, 0.02), color2);
    bucketTop2_p2.position.set(0.35, sty - delta2 * 0.29, -0.9);
    bucketTop2_p2.rotation.x = 0.5 * Math.PI;
    cleaning_cart.add(bucketTop2_p2);

    const bucketTop2_p3 = new Three.Mesh(new Three.BoxGeometry(0.2, 0.15, 0.02), color2);
    bucketTop2_p3.position.set(0.35, sty, -0.9);
    bucketTop2_p3.rotation.x = 0.5 * Math.PI;
    cleaning_cart.add(bucketTop2_p3);

    const bucketTop2_p4 = new Three.Mesh(new Three.BoxGeometry(0.15, 0.3, 0.02), color2);
    bucketTop2_p4.position.set(0.26, sty - delta2 * 0.14, -0.9);
    bucketTop2_p4.rotation.y = 0.5 * Math.PI;
    cleaning_cart.add(bucketTop2_p4);

    const bucketTop2_p5 = new Three.Mesh(new Three.BoxGeometry(0.15, 0.3, 0.02), color2);
    bucketTop2_p5.position.set(0.44, sty - delta2 * 0.14, -0.9);
    bucketTop2_p5.rotation.y = 0.5 * Math.PI;
    cleaning_cart.add(bucketTop2_p5);
  }

  let color: Three.MeshLambertMaterial;
  let delta: number;

  //bucket on the top
  for (let sdy = -0.3; sdy <= 0.3; sdy += 0.6) {
    sdy === -0.3 ? color = red : color = blue;
    sdy === -0.3 ? delta = -1 : delta = 1;

    const bucketTop3_p1 = new Three.Mesh(new Three.BoxGeometry(0.4, 0.3, 0.05), color);
    bucketTop3_p1.position.set(-0.22, sdy - delta * 0.14, -0.05);
    cleaning_cart.add(bucketTop3_p1);

    const bucketTop3_p2 = new Three.Mesh(new Three.BoxGeometry(0.4, 0.25, 0.02), color);
    bucketTop3_p2.position.set(-0.22, sdy - delta * 0.28, -0.2);
    bucketTop3_p2.rotation.x = 0.5 * Math.PI;
    cleaning_cart.add(bucketTop3_p2);

    const bucketTop3_p3 = new Three.Mesh(new Three.BoxGeometry(0.4, 0.25, 0.02), color);
    bucketTop3_p3.position.set(-0.22, sdy, -0.2);
    bucketTop3_p3.rotation.x = 0.5 * Math.PI;
    cleaning_cart.add(bucketTop3_p3);

    const bucketTop3_p4 = new Three.Mesh(new Three.BoxGeometry(0.25, 0.3, 0.02), color);
    bucketTop3_p4.position.set(-0.41, sdy - delta * 0.14, -0.2);
    bucketTop3_p4.rotation.y = 0.5 * Math.PI;
    cleaning_cart.add(bucketTop3_p4);

    const bucketTop3_p5 = new Three.Mesh(new Three.BoxGeometry(0.25, 0.3, 0.02), color);
    bucketTop3_p5.position.set(-0.03, sdy - delta * 0.14, -0.2);
    bucketTop3_p5.rotation.y = 0.5 * Math.PI;
    cleaning_cart.add(bucketTop3_p5);
  }

  for (let scy = -0.45; scy <= 0.55; scy += 0.90) {
    //broom
    const broom = new Three.Mesh(new Three.CylinderGeometry(0.02, 0.02, 0.06, 32), blue);
    broom.rotation.x = 0.5 * Math.PI;
    broom.position.set(0.48, scy, -1.3);
    cleaning_cart.add(broom);

    const broom_handle = new Three.Mesh(new Three.CylinderGeometry(0.02, 0.02, 1.3, 32), grey);
    broom_handle.position.set(0, 0.68, 0);
    broom.add(broom_handle);

    const broom_p2 = new Three.Mesh(new Three.CylinderGeometry(0.025, 0.025, 0.06, 32), blue);
    broom_p2.rotation.y = 0.5 * Math.PI;
    broom_p2.position.set(0, 1.32, 0);
    broom.add(broom_p2);

    const broom_p3 = new Three.Mesh(new Three.BoxGeometry(0.02, 0.15, 0.5), blue);
    broom_p3.position.set(0, 1.34, 0);
    broom_p3.rotation.z = 0.5 * Math.PI;
    broom_p3.rotation.y = 0.5 * Math.PI;
    broom.add(broom_p3);

    const broom_p4 = new Three.Mesh(new Three.BoxGeometry(0.01, 0.2, 0.55), grey);
    broom_p4.position.set(0, 1.35, 0);
    broom_p4.rotation.z = 0.5 * Math.PI;
    broom_p4.rotation.y = 0.5 * Math.PI;
    broom.add(broom_p4);
  }

  //broom hook
  const hook_p1 = new Three.Mesh(new Three.CylinderGeometry(0.01, 0.01, 0.05, 32), blue);
  hook_p1.position.set(0.48, -0.39, -0.85);
  cleaning_cart.add(hook_p1);

  const hook_p2 = new Three.Mesh(new Three.CylinderGeometry(0.025, 0.025, 0.03, 32), blue);
  hook_p2.position.set(0.48, -0.44, -0.85);
  hook_p2.rotation.x = 0.5 * Math.PI;
  cleaning_cart.add(hook_p2);

  const hook_p3 = new Three.Mesh(new Three.CylinderGeometry(0.01, 0.01, 0.05, 32), blue);
  hook_p3.position.set(0.48, 0.39, -0.85);
  cleaning_cart.add(hook_p3);

  const hook_p4 = new Three.Mesh(new Three.CylinderGeometry(0.025, 0.025, 0.03, 32), blue);
  hook_p4.position.set(0.48, 0.44, -0.85);
  hook_p4.rotation.x = 0.5 * Math.PI;
  cleaning_cart.add(hook_p4);

  return cleaning_cart
}

function makeObjectMinLOD() {
  //base
  const cleaning_cart = new Three.Mesh(new Three.BoxGeometry(1, 0.75, 0.05), grey);

  for (let rx = -0.4; rx <= 0.45; rx += 0.85) {
    for (let rz = -0.3; rz <= 0.3; rz += 0.6) {
      const tire = new Three.Mesh(new Three.CylinderGeometry(0.08, 0.08, 0.05, 32), black);
      tire.position.set(rx, rz, 0.15);
      cleaning_cart.add(tire);

      const bearing = new Three.Mesh(new Three.CylinderGeometry(0.06, 0.06, 0.06, 32), grey);
      tire.add(bearing);

      const nut = new Three.Mesh(new Three.CylinderGeometry(0.01, 0.01, 0.08, 6), black);
      nut.position.set(0, 0, 0);
      tire.add(nut);

      const coverUp = new Three.Mesh(new Three.CylinderGeometry(0.06, 0.06, 0.01, 32), grey);
      coverUp.rotation.x = 0.5 * Math.PI;
      coverUp.position.set(-0.03, 0, -0.12);
      tire.add(coverUp);

      const coverDown = new Three.Mesh(new Three.CylinderGeometry(0.03725, 0.03725, 0.03, 32), black);
      coverDown.rotation.x = 0.5 * Math.PI;
      coverDown.position.set(-0.03, 0, -0.1);
      tire.add(coverDown);

      const p1Geometry = new Three.CylinderGeometry(0.055, 0.055, 0.005, 3);
      const p1_left = new Three.Mesh(p1Geometry, grey);
      p1_left.position.set(-0.02, -0.035, -0.06);
      tire.add(p1_left);

      const p2Geometry = new Three.BoxGeometry(0.055, 0.11, 0.005);
      const p2_left = new Three.Mesh(p2Geometry, grey);
      p2_left.rotation.x = 0.5 * Math.PI;
      p2_left.position.set(0, -0.035, -0.04);
      tire.add(p2_left);

      const p1_right = new Three.Mesh(p1Geometry, grey);
      p1_right.position.set(-0.02, 0.035, -0.06);
      tire.add(p1_right);

      const p2_right = new Three.Mesh(p2Geometry, grey);
      p2_right.rotation.x = 0.5 * Math.PI;
      p2_right.position.set(0, 0.035, -0.04);
      tire.add(p2_right);

      const p3 = new Three.Mesh(new Three.BoxGeometry(0.095, 0.075, 0.01), grey);
      p3.position.set(-0.02, 0, -0.09);
      tire.add(p3);
    }
  }

  //drawer support
  const drawerSupportGeometry = new Three.BoxGeometry(0.85, 0.75, 0.05);
  const drawer_p1 = new Three.Mesh(drawerSupportGeometry, grey);
  drawer_p1.position.set(0.475, 0, -0.45);
  drawer_p1.rotation.y = 0.5 * Math.PI;
  cleaning_cart.add(drawer_p1);

  const drawer_p2 = new Three.Mesh(drawerSupportGeometry, grey);
  drawer_p2.position.set(0, 0, -0.45);
  drawer_p2.rotation.y = 0.5 * Math.PI;
  cleaning_cart.add(drawer_p2);

  //base top
  const baseTop = new Three.Mesh(new Three.BoxGeometry(0.5, 0.75, 0.05), grey);
  baseTop.position.set(0.25, 0, -0.8);
  cleaning_cart.add(baseTop);

  let gz: number;

  //shelfs guide
  for (gz = -0.74; gz <= -0.1; gz += 0.25) {
    const shelfGeometry = new Three.BoxGeometry(0.05, 0.75, 0.02);
    const shelf_1 = new Three.Mesh(shelfGeometry, grey);
    shelf_1.position.set(0.45, 0, gz);
    cleaning_cart.add(shelf_1);

    const shelf_2 = new Three.Mesh(shelfGeometry, grey);
    shelf_2.position.set(0.025, 0, gz);
    cleaning_cart.add(shelf_2);
  }

  let cz: number;

  //lateral drawers
  for (cz = -0.76; cz <= -0.1; cz += 0.25) {
    //border
    const drawerBorderGeometry = new Three.BoxGeometry(0.05, 0.75, 0.015);
    const drawerBorder_1 = new Three.Mesh(drawerBorderGeometry, blue);
    drawerBorder_1.position.set(0.42, 0, cz);
    cleaning_cart.add(drawerBorder_1);

    const drawerBorder_2 = new Three.Mesh(drawerBorderGeometry, blue);
    drawerBorder_2.position.set(0.055, 0, cz);
    cleaning_cart.add(drawerBorder_2);

    //long side
    const longSideGeometry = new Three.BoxGeometry(0.02, 0.20, 0.75);
    const longSide_1 = new Three.Mesh(longSideGeometry, blue);
    longSide_1.position.set(0.405, 0, cz + 0.1);
    longSide_1.rotation.x = 0.5 * Math.PI;
    cleaning_cart.add(longSide_1);

    const longSide_2 = new Three.Mesh(longSideGeometry, blue);
    longSide_2.position.set(0.07, 0, cz + 0.1);
    longSide_2.rotation.x = 0.5 * Math.PI;
    cleaning_cart.add(longSide_2);

    //short side
    const shortSideGeometry = new Three.BoxGeometry(0.02, 0.34, 0.215);
    const shortSide_1 = new Three.Mesh(shortSideGeometry, blue);
    shortSide_1.position.set(0.25, -0.365, cz + 0.1);
    shortSide_1.rotation.z = 0.5 * Math.PI;
    cleaning_cart.add(shortSide_1);

    const shortSide_2 = new Three.Mesh(shortSideGeometry, blue);
    shortSide_2.position.set(0.235, 0.365, cz + 0.1);
    shortSide_2.rotation.z = 0.5 * Math.PI;
    cleaning_cart.add(shortSide_2);

    //bottom side
    const bottomSide = new Three.Mesh(new Three.BoxGeometry(0.355, 0.75, 0.015), blue);
    bottomSide.position.set(0.2375, 0, cz + 0.205);
    cleaning_cart.add(bottomSide);
  }

  //bucket up support
  const bucket_1 = new Three.Mesh(new Three.BoxGeometry(0.5, 0.05, 0.05), grey);
  bucket_1.position.set(0.25, -0.35, -0.85);
  cleaning_cart.add(bucket_1);

  const bucket_2 = bucket_1.clone();
  bucket_2.position.set(0.25, 0.35, -0.85);
  cleaning_cart.add(bucket_2);

  //bucket down support
  const bucket_3 = bucket_1.clone();
  bucket_3.position.set(-0.25, -0.35, -0.05);
  cleaning_cart.add(bucket_3);

  const bucket_4 = bucket_1.clone();
  bucket_4.position.set(-0.25, 0.35, -0.05);
  cleaning_cart.add(bucket_4);

  const bucket_5 = new Three.Mesh(new Three.BoxGeometry(0.05, 0.65, 0.05), grey);
  bucket_5.position.set(-0.475, 0, -0.05);
  cleaning_cart.add(bucket_5);

  //waste basket top support
  const wasteSupport_1 = new Three.Mesh(new Three.BoxGeometry(0.5, 0.05, 0.05), grey);
  wasteSupport_1.position.set(0.7, -0.35, -0.05);
  cleaning_cart.add(wasteSupport_1);

  const wasteSupport_2 = wasteSupport_1.clone();
  wasteSupport_2.position.set(0.7, 0.35, -0.05);
  cleaning_cart.add(wasteSupport_2);

  const wasteSupport_3 = new Three.Mesh(new Three.BoxGeometry(0.05, 0.65, 0.05), grey);
  wasteSupport_3.position.set(0.925, 0, -0.05);
  cleaning_cart.add(wasteSupport_3);

  //waste basket support down
  const wasteSupportDown_1 = new Three.Mesh(new Three.BoxGeometry(0.5, 0.05, 0.05), grey);
  wasteSupportDown_1.position.set(0.7, -0.35, -0.85);
  cleaning_cart.add(wasteSupportDown_1);

  const wasteSupportDown_2 = wasteSupportDown_1.clone();
  wasteSupportDown_2.position.set(0.7, 0.35, -0.85);
  cleaning_cart.add(wasteSupportDown_2);

  const wasteSupportDown_3 = new Three.Mesh(new Three.BoxGeometry(0.05, 0.65, 0.05), grey);
  wasteSupportDown_3.position.set(0.925, 0, -0.85);
  cleaning_cart.add(wasteSupportDown_3);

  //waste cover
  const wasteCover = new Three.Mesh(new Three.BoxGeometry(0.45, 0.775, 0.05), blue);
  wasteCover.position.set(0.745, 0, -0.9);
  cleaning_cart.add(wasteCover);

  //sack
  const sack = new Three.Mesh(new Three.BoxGeometry(0.3, 0.65, 0.7), black);
  sack.position.set(0.75, 0, -0.5);
  cleaning_cart.add(sack);

  // cover pivot
  const coverPivotGeometry = new Three.CylinderGeometry(0.01, 0.01, 0.05, 32);
  const coverPivot_1 = new Three.Mesh(coverPivotGeometry, black);
  coverPivot_1.position.set(0.51, -0.35, -0.88);
  cleaning_cart.add(coverPivot_1);

  const coverPivot_2 = new Three.Mesh(coverPivotGeometry, black);
  coverPivot_2.position.set(0.51, 0.35, -0.88);
  cleaning_cart.add(coverPivot_2);

  let color1: Three.MeshLambertMaterial;
  let delta1: number;

  //bucket on the top
  for (let sty = -0.3; sty <= 0.3; sty += 0.6) {
    sty === -0.3 ? color1 = red : color1 = blue;
    sty === -0.3 ? delta1 = -1 : delta1 = 1;

    const bucketTop_1 = new Three.Mesh(new Three.BoxGeometry(0.2, 0.3, 0.05), color1);
    bucketTop_1.position.set(0.13, sty - delta1 * 0.14, -0.85);
    cleaning_cart.add(bucketTop_1);

    const bucketTop_2 = new Three.Mesh(new Three.BoxGeometry(0.2, 0.15, 0.02), color1);
    bucketTop_2.position.set(0.13, sty - delta1 * 0.29, -0.9);
    bucketTop_2.rotation.x = 0.5 * Math.PI;
    cleaning_cart.add(bucketTop_2);

    const bucketTop_3 = new Three.Mesh(new Three.BoxGeometry(0.2, 0.15, 0.02), color1);
    bucketTop_3.position.set(0.13, sty, -0.9);
    bucketTop_3.rotation.x = 0.5 * Math.PI;
    cleaning_cart.add(bucketTop_3);

    const bucketTop_4 = new Three.Mesh(new Three.BoxGeometry(0.15, 0.3, 0.02), color1);
    bucketTop_4.position.set(0.04, sty - delta1 * 0.14, -0.9);
    bucketTop_4.rotation.y = 0.5 * Math.PI;
    cleaning_cart.add(bucketTop_4);

    const bucketTop_5 = new Three.Mesh(new Three.BoxGeometry(0.15, 0.3, 0.02), color1);
    bucketTop_5.position.set(0.22, sty - delta1 * 0.14, -0.9);
    bucketTop_5.rotation.y = 0.5 * Math.PI;
    cleaning_cart.add(bucketTop_5);
  }

  let color2: Three.MeshLambertMaterial;
  let delta2: number;

  //bucket on the top
  for (let sty = -0.3; sty <= 0.3; sty += 0.6) {
    sty === -0.3 ? color2 = yellow : color2 = green;
    sty === -0.3 ? delta2 = -1 : delta2 = 1;

    const bucketTop2_p1 = new Three.Mesh(new Three.BoxGeometry(0.2, 0.3, 0.05), color2);
    bucketTop2_p1.position.set(0.35, sty - delta2 * 0.14, -0.85);
    cleaning_cart.add(bucketTop2_p1);

    const bucketTop2_p2 = new Three.Mesh(new Three.BoxGeometry(0.2, 0.15, 0.02), color2);
    bucketTop2_p2.position.set(0.35, sty - delta2 * 0.29, -0.9);
    bucketTop2_p2.rotation.x = 0.5 * Math.PI;
    cleaning_cart.add(bucketTop2_p2);

    const bucketTop2_p3 = new Three.Mesh(new Three.BoxGeometry(0.2, 0.15, 0.02), color2);
    bucketTop2_p3.position.set(0.35, sty, -0.9);
    bucketTop2_p3.rotation.x = 0.5 * Math.PI;
    cleaning_cart.add(bucketTop2_p3);

    const bucketTop2_p4 = new Three.Mesh(new Three.BoxGeometry(0.15, 0.3, 0.02), color2);
    bucketTop2_p4.position.set(0.26, sty - delta2 * 0.14, -0.9);
    bucketTop2_p4.rotation.y = 0.5 * Math.PI;
    cleaning_cart.add(bucketTop2_p4);

    const bucketTop2_p5 = new Three.Mesh(new Three.BoxGeometry(0.15, 0.3, 0.02), color2);
    bucketTop2_p5.position.set(0.44, sty - delta2 * 0.14, -0.9);
    bucketTop2_p5.rotation.y = 0.5 * Math.PI;
    cleaning_cart.add(bucketTop2_p5);
  }

  let color: Three.MeshLambertMaterial;
  let delta: number;

  //bucket on the top
  for (let sdy = -0.3; sdy <= 0.3; sdy += 0.6) {
    sdy === -0.3 ? color = red : color = blue;
    sdy === -0.3 ? delta = -1 : delta = 1;

    const bucketTop3_p1 = new Three.Mesh(new Three.BoxGeometry(0.4, 0.3, 0.05), color);
    bucketTop3_p1.position.set(-0.22, sdy - delta * 0.14, -0.05);
    cleaning_cart.add(bucketTop3_p1);

    const bucketTop3_p2 = new Three.Mesh(new Three.BoxGeometry(0.4, 0.25, 0.02), color);
    bucketTop3_p2.position.set(-0.22, sdy - delta * 0.28, -0.2);
    bucketTop3_p2.rotation.x = 0.5 * Math.PI;
    cleaning_cart.add(bucketTop3_p2);

    const bucketTop3_p3 = new Three.Mesh(new Three.BoxGeometry(0.4, 0.25, 0.02), color);
    bucketTop3_p3.position.set(-0.22, sdy, -0.2);
    bucketTop3_p3.rotation.x = 0.5 * Math.PI;
    cleaning_cart.add(bucketTop3_p3);

    const bucketTop3_p4 = new Three.Mesh(new Three.BoxGeometry(0.25, 0.3, 0.02), color);
    bucketTop3_p4.position.set(-0.41, sdy - delta * 0.14, -0.2);
    bucketTop3_p4.rotation.y = 0.5 * Math.PI;
    cleaning_cart.add(bucketTop3_p4);

    const bucketTop3_p5 = new Three.Mesh(new Three.BoxGeometry(0.25, 0.3, 0.02), color);
    bucketTop3_p5.position.set(-0.03, sdy - delta * 0.14, -0.2);
    bucketTop3_p5.rotation.y = 0.5 * Math.PI;
    cleaning_cart.add(bucketTop3_p5);
  }

  for (let scy = -0.45; scy <= 0.55; scy += 0.90) {
    //broom
    const broom = new Three.Mesh(new Three.CylinderGeometry(0.02, 0.02, 0.06, 32), blue);
    broom.rotation.x = 0.5 * Math.PI;
    broom.position.set(0.48, scy, -1.3);
    cleaning_cart.add(broom);

    const broom_handle = new Three.Mesh(new Three.CylinderGeometry(0.02, 0.02, 1.3, 32), grey);
    broom_handle.position.set(0, 0.68, 0);
    broom.add(broom_handle);

    const broom_p2 = new Three.Mesh(new Three.CylinderGeometry(0.025, 0.025, 0.06, 32), blue);
    broom_p2.rotation.y = 0.5 * Math.PI;
    broom_p2.position.set(0, 1.32, 0);
    broom.add(broom_p2);

    const broom_p3 = new Three.Mesh(new Three.BoxGeometry(0.02, 0.15, 0.5), blue);
    broom_p3.position.set(0, 1.34, 0);
    broom_p3.rotation.z = 0.5 * Math.PI;
    broom_p3.rotation.y = 0.5 * Math.PI;
    broom.add(broom_p3);

    const broom_p4 = new Three.Mesh(new Three.BoxGeometry(0.01, 0.2, 0.55), grey);
    broom_p4.position.set(0, 1.35, 0);
    broom_p4.rotation.z = 0.5 * Math.PI;
    broom_p4.rotation.y = 0.5 * Math.PI;
    broom.add(broom_p4);
  }


  //broom hook
  const hook_p1 = new Three.Mesh(new Three.CylinderGeometry(0.01, 0.01, 0.05, 32), blue);
  hook_p1.position.set(0.48, -0.39, -0.85);
  cleaning_cart.add(hook_p1);

  const hook_p2 = new Three.Mesh(new Three.CylinderGeometry(0.025, 0.025, 0.03, 32), blue);
  hook_p2.position.set(0.48, -0.44, -0.85);
  hook_p2.rotation.x = 0.5 * Math.PI;
  cleaning_cart.add(hook_p2);

  const hook_p3 = new Three.Mesh(new Three.CylinderGeometry(0.01, 0.01, 0.05, 32), blue);
  hook_p3.position.set(0.48, 0.39, -0.85);
  cleaning_cart.add(hook_p3);

  const hook_p4 = new Three.Mesh(new Three.CylinderGeometry(0.025, 0.025, 0.03, 32), blue);
  hook_p4.position.set(0.48, 0.44, -0.85);
  hook_p4.rotation.x = 0.5 * Math.PI;
  cleaning_cart.add(hook_p4);

  return cleaning_cart
}

export default defineCatalogElement({
  name: 'cleaning cart',
  prototype: 'items',

  info: {
    tag: ['metal', 'plastic'],
    title: 'cleaning cart',
    description: 'cleaning cart',
    image: require('./cleaning_cart.png')
  },

  properties: {
    altitude: {
      label: 'altitude',
      type: 'length-measure',
      defaultValue: {
        length: 0
      }
    }
  },

  render2D: function (element, layer, scene) {
    const angle = element.rotation + 90;

    let textRotation = 0;
    if (Math.sin(angle * Math.PI / 180) < 0) {
      textRotation = 180;
    }

    return (
      <g transform={`translate(${-WIDTH / 2},${-DEPTH / 2})`}>
        <rect key='1' x='0' y='0' width={WIDTH} height={DEPTH}
          style={{ stroke: element.selected ? '#0096fd' : '#000', strokeWidth: '2px', fill: '#84e1ce' }} />
        <text key='2' x='0' y='0'
          transform={`translate(${WIDTH / 2}, ${DEPTH / 2}) scale(1,-1) rotate(${textRotation})`}
          style={{ textAnchor: 'middle', fontSize: '11px' }}>
          {element.type}
        </text>
      </g>
    )
  },

  async render3D(element, layer, scene) {
    const newAltitude = element.properties.altitude.length;

    /************ lod max ****************/

    const cleaning_cartMaxLOD = new Three.Object3D();
    cleaning_cartMaxLOD.add(objectMaxLOD.clone());

    const valuePosition = new Three.Box3().setFromObject(cleaning_cartMaxLOD);

    const deltaX = Math.abs(valuePosition.max.x - valuePosition.min.x);
    const deltaY = Math.abs(valuePosition.max.y - valuePosition.min.y);
    const deltaZ = Math.abs(valuePosition.max.z - valuePosition.min.z);

    cleaning_cartMaxLOD.rotation.x = 0.5 * Math.PI;
    cleaning_cartMaxLOD.position.y += HEIGHT / 5 + newAltitude;
    cleaning_cartMaxLOD.scale.set(WIDTH / deltaX, DEPTH / deltaZ, HEIGHT / deltaY);

    /************ lod min ****************/

    const cleaning_cartMinLOD = new Three.Object3D();
    cleaning_cartMinLOD.add(objectMinLOD.clone());
    cleaning_cartMinLOD.rotation.x = 0.5 * Math.PI;
    cleaning_cartMinLOD.position.y += HEIGHT / 5 + newAltitude;
    cleaning_cartMinLOD.scale.set(WIDTH / deltaX, DEPTH / deltaZ, HEIGHT / deltaY);

    /**** all level of detail ***/

    const lod = new Three.LOD();

    lod.addLevel(cleaning_cartMaxLOD, 200);
    lod.addLevel(cleaning_cartMinLOD, 900);
    lod.updateMatrix();
    lod.matrixAutoUpdate = false;

    if (element.selected) {
      const bbox = new Three.BoxHelper(lod, 0x99c3fb);
      bbox.material.linewidth = 5;
      bbox.renderOrder = 1000;
      bbox.material.depthTest = false;
      lod.add(bbox);
    }
    return lod;
  }
});
