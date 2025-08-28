import * as Three from 'three';
import React from 'react';
import { defineCatalogElement } from '@archef2000/react-planner';

const WIDTH = 70;
const DEPTH = 70;
const HEIGHT = 100;

const grey = new Three.MeshBasicMaterial({ color: 0xD3D3D3 });
const metalGrey = new Three.MeshBasicMaterial({ color: 0x808080 });
const white = new Three.MeshBasicMaterial({ color: 0x000000 });
const black = new Three.MeshBasicMaterial({ color: 0x000000 });


function makeBackrest() {
  const backrest = new Three.Object3D();
  const backrestGeometry1 = new Three.CylinderGeometry(0.01, 0.01, 0.18, 32, 32);
  const backrestGeometry2 = new Three.CylinderGeometry(0.01, 0.01, 0.04, 32, 32);
  const NodeGeometry = new Three.SphereGeometry(0.01, 32, 32);
  const backrest1 = new Three.Mesh(backrestGeometry1, black);
  const backrest2 = new Three.Mesh(backrestGeometry2, black);
  const backrest3 = new Three.Mesh(backrestGeometry1, black);
  const backrest4 = new Three.Mesh(backrestGeometry2, black);
  const node1 = new Three.Mesh(NodeGeometry, black);
  const node2 = new Three.Mesh(NodeGeometry, black);
  const backrestPillow = makeBackrestPillow();
  backrest1.rotation.z = Math.PI * (90 + 6) / 180;
  backrest1.position.z = 0.05;
  backrest1.position.x = 0.09;
  backrest2.rotation.z = -Math.PI * 96 / 180;
  backrest2.position.x = 0.02 * Math.cos(Math.PI * 6 / 180);
  backrest3.rotation.z = Math.PI * (90 + 6) / 180;
  backrest3.position.z = -0.05;
  backrest3.position.x = 0.09;
  backrest4.rotation.z = -Math.PI * 96 / 180;
  backrest4.position.x = 0.02 * Math.cos(Math.PI * 6 / 180);
  node1.position.y = 0.09;
  node2.position.y = 0.09;
  node1.add(backrest2);
  node2.add(backrest4);
  backrestPillow.rotation.y = Math.PI / 2;
  backrestPillow.position.y = 0.25 + 0.02;
  backrest1.add(node1);
  backrest.add(backrest1);
  backrest3.add(node2);
  backrest.add(backrest3);
  backrest.add(backrestPillow);

  return backrest;
}

function makeBackrestMinLOD() {
  const backrest = new Three.Object3D();
  const backrestGeometry1 = new Three.CylinderGeometry(0.01, 0.01, 0.18, 8, 8);
  const backrestGeometry2 = new Three.CylinderGeometry(0.01, 0.01, 0.04, 8, 8);
  const NodeGeometry = new Three.SphereGeometry(0.01, 32, 32);
  const backrest1 = new Three.Mesh(backrestGeometry1, black);
  const backrest2 = new Three.Mesh(backrestGeometry2, black);
  const backrest3 = new Three.Mesh(backrestGeometry1, black);
  const backrest4 = new Three.Mesh(backrestGeometry2, black);
  const node1 = new Three.Mesh(NodeGeometry, black);
  const node2 = new Three.Mesh(NodeGeometry, black);
  const backrestPillow = makeBackrestPillowMinLOD();
  backrest1.rotation.z = Math.PI * (90 + 6) / 180;
  backrest1.position.z = 0.05;
  backrest1.position.x = 0.09;
  backrest2.rotation.z = -Math.PI * 96 / 180;
  backrest2.position.x = 0.02 * Math.cos(Math.PI * 6 / 180);
  backrest3.rotation.z = Math.PI * (90 + 6) / 180;
  backrest3.position.z = -0.05;
  backrest3.position.x = 0.09;
  backrest4.rotation.z = -Math.PI * 96 / 180;
  backrest4.position.x = 0.02 * Math.cos(Math.PI * 6 / 180);
  node1.position.y = 0.09;
  node2.position.y = 0.09;
  node1.add(backrest2);
  node2.add(backrest4);
  backrestPillow.rotation.y = Math.PI / 2;
  backrestPillow.position.y = 0.25 + 0.02;
  backrest1.add(node1);
  backrest.add(backrest1);
  backrest3.add(node2);
  backrest.add(backrest3);
  backrest.add(backrestPillow);

  return backrest;
}


function makeWheel() {
  const ArmrestGeometry = new Three.CylinderGeometry(0.027, 0.02, 0.3, 32, 32);
  const SupportGeometry = new Three.CylinderGeometry(0.02, 0.01, 0.02, 32, 32);
  const PivotGeometry = new Three.CylinderGeometry(0.008, 0.008, 0.01, 32, 32);
  const SupportGeometryStart = new Three.SphereGeometry(0.02, 32, 32);
  const WheelGeometry = new Three.CylinderGeometry(0.025, 0.025, 0.05, 32, 32);
  const InsideWheelGeometry = new Three.CylinderGeometry(0.02, 0.02, 0.051, 32, 32);
  const WheelCoverGeometry = new Three.CylinderGeometry(0.026, 0.026, 0.045, 32, 32);
  const armrest = new Three.Mesh(ArmrestGeometry, metalGrey);
  const support = new Three.Mesh(SupportGeometry, metalGrey);
  const pivot = new Three.Mesh(PivotGeometry, grey);
  const SupportStart = new Three.Mesh(SupportGeometryStart, metalGrey);
  const Wheel = new Three.Mesh(WheelGeometry, black);
  const WheelCover = new Three.Mesh(WheelCoverGeometry, metalGrey);
  const InsideWheel = new Three.Mesh(InsideWheelGeometry, metalGrey);
  const Armrest1 = new Three.Object3D();
  const Armrest2 = new Three.Object3D();
  armrest.rotation.z = Math.PI * 80 / 180;
  armrest.position.x = 0.01 + 0.15;
  Armrest1.rotation.z = -Math.PI * 80 / 180;
  Armrest1.position.y = -Math.sin(Math.PI * 80 / 180) * 0.15;
  support.position.y = -0.01;
  pivot.position.y = -0.01 - 0.005;
  Wheel.rotation.x = Math.PI / 2;
  Wheel.position.y = -0.005 - 0.02;
  WheelCover.position.z = -0.003;
  Wheel.add(InsideWheel);
  Wheel.add(WheelCover);
  pivot.add(Wheel);
  support.add(pivot);
  Armrest1.add(support);
  Armrest1.add(SupportStart);
  armrest.add(Armrest1);
  Armrest2.add(armrest);
  return Armrest2;
}

function makeWheelMinLOD() {
  const ArmrestGeometry = new Three.CylinderGeometry(0.027, 0.02, 0.3, 8, 8);
  const SupportGeometry = new Three.CylinderGeometry(0.02, 0.01, 0.02, 8, 8);
  const PivotGeometry = new Three.CylinderGeometry(0.008, 0.008, 0.01, 8, 8);
  const SupportGeometryStart = new Three.SphereGeometry(0.02, 8, 8);
  const WheelGeometry = new Three.CylinderGeometry(0.025, 0.025, 0.05, 8, 8);
  const InsideWheelGeometry = new Three.CylinderGeometry(0.02, 0.02, 0.051, 8, 8);
  const armrest = new Three.Mesh(ArmrestGeometry, metalGrey);
  const support = new Three.Mesh(SupportGeometry, metalGrey);
  const pivot = new Three.Mesh(PivotGeometry, grey);
  const SupportStart = new Three.Mesh(SupportGeometryStart, metalGrey);
  const Wheel = new Three.Mesh(WheelGeometry, black);
  const InsideWheel = new Three.Mesh(InsideWheelGeometry, metalGrey);
  const Armrest1 = new Three.Object3D();
  const Armrest2 = new Three.Object3D();
  armrest.rotation.z = Math.PI * 80 / 180;
  armrest.position.x = 0.01 + 0.15;
  Armrest1.rotation.z = -Math.PI * 80 / 180;
  Armrest1.position.y = -Math.sin(Math.PI * 80 / 180) * 0.15;
  support.position.y = -0.01;
  pivot.position.y = -0.01 - 0.005;
  Wheel.rotation.x = Math.PI / 2;
  Wheel.position.y = -0.005 - 0.02;
  Wheel.add(InsideWheel);
  pivot.add(Wheel);
  support.add(pivot);
  Armrest1.add(support);
  Armrest1.add(SupportStart);
  armrest.add(Armrest1);
  Armrest2.add(armrest);
  return Armrest2;
}

function makeBackrestPillow() {
  const pillow = new Three.Object3D();
  const CenterGeometry = new Three.BoxGeometry(0.3, 0.5, 0.04);
  const ShortEdgeGeometry = new Three.CylinderGeometry(0.02, 0.02, 0.3, 32, 32);
  const LongEdgeGeometry = new Three.CylinderGeometry(0.02, 0.02, 0.5, 32, 32);
  const AngleGeometry = new Three.SphereGeometry(0.02, 32, 32);
  const edgeShort1 = new Three.Mesh(ShortEdgeGeometry, white);
  const edgeShort2 = new Three.Mesh(ShortEdgeGeometry, white);
  const edgeLong1 = new Three.Mesh(LongEdgeGeometry, white);
  const edgeLong2 = new Three.Mesh(LongEdgeGeometry, white);
  const angle1c = new Three.Mesh(AngleGeometry, white);
  const angle2c = new Three.Mesh(AngleGeometry, white);
  const angle1l = new Three.Mesh(AngleGeometry, white);
  const angle2l = new Three.Mesh(AngleGeometry, white);
  const center = new Three.Mesh(CenterGeometry, white);
  edgeShort1.rotation.z = Math.PI / 2;
  edgeShort1.position.y = 0.25;
  angle1c.position.y = 0.15;
  edgeShort2.rotation.z = Math.PI / 2;
  edgeShort2.position.y = -0.25;
  angle2c.position.y = -0.15;
  edgeLong1.position.x = 0.15;
  angle1l.position.y = 0.25;
  edgeLong2.position.x = -0.15;
  angle2l.position.y = -0.25;
  edgeLong2.add(angle2l);
  pillow.add(edgeLong2);
  edgeLong1.add(angle1l);
  pillow.add(edgeLong1);
  edgeShort2.add(angle2c);
  pillow.add(edgeShort2);
  edgeShort1.add(angle1c);
  pillow.add(edgeShort1);
  pillow.add(center);
  return pillow;
}

function makeBackrestPillowMinLOD() {
  const pillow = new Three.Object3D();
  const CenterGeometry = new Three.BoxGeometry(0.3, 0.5, 0.04);
  const ShortEdgeGeometry = new Three.CylinderGeometry(0.02, 0.02, 0.3, 8, 8);
  const LongEdgeGeometry = new Three.CylinderGeometry(0.02, 0.02, 0.5, 8, 8);
  const AngleGeometry = new Three.SphereGeometry(0.02, 32, 32);
  const edgeShort1 = new Three.Mesh(ShortEdgeGeometry, white);
  const edgeShort2 = new Three.Mesh(ShortEdgeGeometry, white);
  const edgeLong1 = new Three.Mesh(LongEdgeGeometry, white);
  const edgeLong2 = new Three.Mesh(LongEdgeGeometry, white);
  const angle1c = new Three.Mesh(AngleGeometry, white);
  const angle2c = new Three.Mesh(AngleGeometry, white);
  const angle1l = new Three.Mesh(AngleGeometry, white);
  const angle2l = new Three.Mesh(AngleGeometry, white);
  const center = new Three.Mesh(CenterGeometry, white);
  edgeShort1.rotation.z = Math.PI / 2;
  edgeShort1.position.y = 0.25;
  angle1c.position.y = 0.15;
  edgeShort2.rotation.z = Math.PI / 2;
  edgeShort2.position.y = -0.25;
  angle2c.position.y = -0.15;
  edgeLong1.position.x = 0.15;
  angle1l.position.y = 0.25;
  edgeLong2.position.x = -0.15;
  angle2l.position.y = -0.25;
  edgeLong2.add(angle2l);
  pillow.add(edgeLong2);
  edgeLong1.add(angle1l);
  pillow.add(edgeLong1);
  edgeShort2.add(angle2c);
  pillow.add(edgeShort2);
  edgeShort1.add(angle1c);
  pillow.add(edgeShort1);
  pillow.add(center);
  return pillow;
}

function makeBody() {
  const body = new Three.Object3D();
  const SupportPillowGeometry1 = new Three.BoxGeometry(0.28, 0.06, 0.07);
  const SupportPillowGeometry2 = new Three.BoxGeometry(0.3, 0.04, 0.09);
  const ShortHandleGeometry = new Three.CylinderGeometry(0.0045, 0.0045, 0.07, 32, 32);
  const LongHandleGeometry = new Three.CylinderGeometry(0.0045, 0.0045, 0.09, 32, 32);
  const HandleGeometry = new Three.CylinderGeometry(0.007, 0.005, 0.06, 32);
  const ArmrestSupportGeometry = new Three.CylinderGeometry(0.01, 0.01, 0.2, 32, 32);
  const SupportPillow1 = new Three.Mesh(SupportPillowGeometry1, metalGrey);
  const SupportPillow2 = new Three.Mesh(SupportPillowGeometry2, metalGrey);
  const LongHandle = new Three.Mesh(LongHandleGeometry, white);
  const ShortHandle = new Three.Mesh(ShortHandleGeometry, white);
  const Handle1 = new Three.Mesh(HandleGeometry, black);
  const Handle2 = new Three.Mesh(HandleGeometry, black);
  const ArmrestBase1 = new Three.Mesh(ArmrestSupportGeometry, metalGrey);
  const ArmrestBase2 = new Three.Mesh(ArmrestSupportGeometry, metalGrey);
  const Pillow = makePillow();
  const armrest1 = makeArmrest();
  const armrest2 = makeArmrest();
  SupportPillow1.position.y = 0.03;
  SupportPillow2.rotation.z = Math.PI * 6 / 180;
  SupportPillow2.position.y = 0.06;
  LongHandle.rotation.x = Math.PI * 80 / 180;
  LongHandle.position.z = 0.035 + 0.045;
  LongHandle.position.x = 0.1;
  ShortHandle.rotation.x = -Math.PI * 80 / 180;
  ShortHandle.position.z = -0.035 - 0.035;
  ShortHandle.position.x = 0.08;
  Handle2.position.y = 0.035 + 0.03;
  Handle1.position.y = 0.045 + 0.03;
  Pillow.position.y = 0.02 + 0.02;
  ArmrestBase1.rotation.x = Math.PI / 2;
  ArmrestBase1.rotation.y = -Math.PI * 6 / 180;
  ArmrestBase2.rotation.x = Math.PI / 2;
  ArmrestBase2.rotation.y = -Math.PI * 6 / 180;
  ArmrestBase1.position.z = 0.045 + 0.1;
  ArmrestBase2.position.z = -0.045 - 0.1;
  armrest1.position.y = 0.1;
  armrest2.position.y = -0.1;
  SupportPillow2.add(Pillow);
  ArmrestBase1.add(armrest1);
  ArmrestBase2.add(armrest2);
  SupportPillow2.add(ArmrestBase1);
  SupportPillow2.add(ArmrestBase2);
  LongHandle.add(Handle1);
  ShortHandle.add(Handle2);
  SupportPillow1.add(LongHandle);
  SupportPillow1.add(ShortHandle);
  body.add(SupportPillow2);
  body.add(SupportPillow1);
  return body;
}

function makeBodyMinLOD() {
  const body = new Three.Object3D();
  const SupportPillowGeometry1 = new Three.BoxGeometry(0.28, 0.06, 0.07);
  const SupportPillowGeometry2 = new Three.BoxGeometry(0.3, 0.04, 0.09);
  const ArmrestSupportGeometry = new Three.CylinderGeometry(0.01, 0.01, 0.2, 8, 8);
  const SupportPillow1 = new Three.Mesh(SupportPillowGeometry1, metalGrey);
  const SupportPillow2 = new Three.Mesh(SupportPillowGeometry2, metalGrey);
  const ArmrestBase1 = new Three.Mesh(ArmrestSupportGeometry, metalGrey);
  const ArmrestBase2 = new Three.Mesh(ArmrestSupportGeometry, metalGrey);
  const Pillow = makePillow();
  const armrest1 = makeArmrestMinLOD();
  const armrest2 = makeArmrestMinLOD();
  SupportPillow1.position.y = 0.03;
  SupportPillow2.rotation.z = Math.PI * 6 / 180;
  SupportPillow2.position.y = 0.06;
  Pillow.position.y = 0.02 + 0.02;
  ArmrestBase1.rotation.x = Math.PI / 2;
  ArmrestBase1.rotation.y = -Math.PI * 6 / 180;
  ArmrestBase2.rotation.x = Math.PI / 2;
  ArmrestBase2.rotation.y = -Math.PI * 6 / 180;
  ArmrestBase1.position.z = 0.045 + 0.1;
  ArmrestBase2.position.z = -0.045 - 0.1;
  armrest1.position.y = 0.1;
  armrest2.position.y = -0.1;
  SupportPillow2.add(Pillow);
  ArmrestBase1.add(armrest1);
  ArmrestBase2.add(armrest2);
  SupportPillow2.add(ArmrestBase1);
  SupportPillow2.add(ArmrestBase2);
  body.add(SupportPillow2);
  body.add(SupportPillow1);
  return body;
}

function makeArmrest() {
  const armrest = new Three.Object3D();
  const NodeGeometry = new Three.SphereGeometry(0.01, 32, 32);
  const GeometryP1 = new Three.CylinderGeometry(0.01, 0.01, 0.24, 32, 32);
  const GeometryP2 = new Three.CylinderGeometry(0.01, 0.01, 0.04, 32, 32);
  const GeometryP3 = new Three.CylinderGeometry(0.02, 0.025, 0.2, 32, 32);
  const node1 = new Three.Mesh(NodeGeometry, metalGrey);
  const node2 = new Three.Mesh(NodeGeometry, metalGrey);
  const P1 = new Three.Mesh(GeometryP1, metalGrey);
  const P2 = new Three.Mesh(GeometryP2, metalGrey);
  const P3 = new Three.Mesh(GeometryP3, white);
  P1.rotation.x = Math.PI / 2;
  P1.rotation.z = -Math.PI * 25 / 180;
  P1.position.set(0.12 * Math.sin(P1.rotation.z), 0, -0.12 * Math.cos(P1.rotation.z));
  P2.rotation.z = Math.PI * 100 / 180;
  P2.position.x = 0.02;
  P2.position.y = 0.0035;
  node2.position.y = -0.12;
  P3.position.y = -0.1 - 0.02;
  P2.add(P3);
  node2.add(P2);
  P1.add(node2);
  node1.add(P1);
  armrest.add(node1);
  return armrest;
}

function makeArmrestMinLOD() {
  const armrest = new Three.Object3D();
  const NodeGeometry = new Three.SphereGeometry(0.01, 8, 8);
  const GeometryP1 = new Three.CylinderGeometry(0.01, 0.01, 0.24, 8, 8);
  const GeometryP2 = new Three.CylinderGeometry(0.01, 0.01, 0.04, 8, 8);
  const GeometryP3 = new Three.CylinderGeometry(0.02, 0.025, 0.2, 8, 8);
  const node1 = new Three.Mesh(NodeGeometry, metalGrey);
  const node2 = new Three.Mesh(NodeGeometry, metalGrey);
  const P1 = new Three.Mesh(GeometryP1, metalGrey);
  const P2 = new Three.Mesh(GeometryP2, metalGrey);
  const P3 = new Three.Mesh(GeometryP3, white);
  P1.rotation.x = Math.PI / 2;
  P1.rotation.z = -Math.PI * 25 / 180;
  P1.position.set(0.12 * Math.sin(P1.rotation.z), 0, -0.12 * Math.cos(P1.rotation.z));
  P2.rotation.z = Math.PI * 100 / 180;
  P2.position.x = 0.02;
  P2.position.y = 0.0035;
  node2.position.y = -0.12;
  P3.position.y = -0.1 - 0.02;
  P2.add(P3);
  node2.add(P2);
  P1.add(node2);
  node1.add(P1);
  armrest.add(node1);
  return armrest;
}

function makePillow() {
  const pillow = new Three.Object3D();
  const CenterGeometry = new Three.BoxGeometry(0.4, 0.04, 0.4);
  const CenterPillow = new Three.Mesh(CenterGeometry, white);
  const edge1 = makeEdge();
  const edge2 = makeEdge();
  const edge3 = makeEdge();
  const edge4 = makeEdge();
  edge1.rotation.x = Math.PI / 2;
  edge1.position.x = 0.2;
  edge2.rotation.x = -Math.PI / 2;
  edge2.position.x = -0.2;
  edge3.rotation.z = -Math.PI / 2;
  edge3.position.z = -0.2;
  edge4.rotation.z = Math.PI / 2;
  edge4.position.z = 0.2;
  CenterPillow.add(edge1);
  CenterPillow.add(edge2);
  CenterPillow.add(edge3);
  CenterPillow.add(edge4);
  pillow.add(CenterPillow);
  return pillow;
}

function makeEdge() {
  const EdgeGeometry = new Three.CylinderGeometry(0.02, 0.02, 0.4, 32, 32, true); // openEnded is set here
  const AngleGeometry = new Three.SphereGeometry(0.02, 32, 32);
  const angle = new Three.Mesh(AngleGeometry, white);
  const edge = new Three.Mesh(EdgeGeometry, white);
  angle.position.y = 0.2;
  edge.add(angle);
  return edge;
}

function makeBase() {
  const base = new Three.Object3D();
  const CylinderGeometry1 = new Three.CylinderGeometry(0.027, 0.027, 0.05, 32, 32);
  const CylinderGeometry2 = new Three.CylinderGeometry(0.03, 0.03, 0.2, 32, 32);
  const CylinderGeometry3 = new Three.CylinderGeometry(0.04, 0.04, 0.06, 32, 32);
  const CylinderCoverGeometryCylinder2 = new Three.TorusGeometry(0.04, 0.025, 32, 100);
  const CylinderGeometry4 = new Three.CylinderGeometry(0.02, 0.02, 0.14, 32, 32);
  const Cylinder1 = new Three.Mesh(CylinderGeometry1, metalGrey);
  const Cylinder2 = new Three.Mesh(CylinderGeometry2, metalGrey);
  const CoverCylinder1 = new Three.Mesh(CylinderGeometry3, metalGrey);
  const CoverCylinder2 = new Three.Mesh(CylinderCoverGeometryCylinder2, metalGrey);
  const Cylinder3 = new Three.Mesh(CylinderGeometry4, metalGrey);
  const Wheel = makeWheels();
  Cylinder1.position.y = -0.1 - 0.025;
  Cylinder3.position.y = 0.1 + 0.07;
  Wheel.position.y = -0.07;
  CoverCylinder1.position.y = -0.05;
  CoverCylinder2.rotation.x = Math.PI / 2;
  CoverCylinder2.position.y = -0.05;
  Cylinder2.add(CoverCylinder1);
  Cylinder2.add(CoverCylinder2);
  Cylinder2.add(Wheel);
  Cylinder2.add(Cylinder1);
  Cylinder2.add(Cylinder3);
  base.add(Cylinder2);
  return base;
}

function makeBaseMinLOD() {
  const base = new Three.Object3D();
  const CylinderGeometry1 = new Three.CylinderGeometry(0.027, 0.027, 0.05, 8, 8);
  const CylinderGeometry2 = new Three.CylinderGeometry(0.03, 0.03, 0.2, 8, 8);
  const CylinderGeometry3 = new Three.CylinderGeometry(0.04, 0.04, 0.06, 8, 8);
  const CylinderCoverGeometryCylinder2 = new Three.TorusGeometry(0.04, 0.025, 8, 100);
  const CylinderGeometry4 = new Three.CylinderGeometry(0.02, 0.02, 0.14, 8, 8);
  const Cylinder1 = new Three.Mesh(CylinderGeometry1, metalGrey);
  const Cylinder2 = new Three.Mesh(CylinderGeometry2, metalGrey);
  const CoverCylinder1 = new Three.Mesh(CylinderGeometry3, metalGrey);
  const CoverCylinder2 = new Three.Mesh(CylinderCoverGeometryCylinder2, metalGrey);
  const Cylinder3 = new Three.Mesh(CylinderGeometry4, metalGrey);
  const Wheel = makeWheelsMinLOD();
  Cylinder1.position.y = -0.1 - 0.025;
  Cylinder3.position.y = 0.1 + 0.07;
  Wheel.position.y = -0.07;
  CoverCylinder1.position.y = -0.05;
  CoverCylinder2.rotation.x = Math.PI / 2;
  CoverCylinder2.position.y = -0.05;
  Cylinder2.add(CoverCylinder1);
  Cylinder2.add(CoverCylinder2);
  Cylinder2.add(Wheel);
  Cylinder2.add(Cylinder1);
  Cylinder2.add(Cylinder3);
  base.add(Cylinder2);
  return base;
}

function makeWheels() {
  const wheels = new Three.Object3D();
  for (let i = 0; i < 5; i++) {
    const wheel = makeWheel();
    wheel.rotation.y = 2 * Math.PI * i * 72 / 360;
    wheels.add(wheel);
  }
  return wheels;
}

function makeWheelsMinLOD() {
  const wheels = new Three.Object3D();
  for (let i = 0; i < 5; i++) {
    const wheel = makeWheelMinLOD();
    wheel.rotation.y = 2 * Math.PI * i * 72 / 360;
    wheels.add(wheel);
  }
  return wheels;
}

const objectMaxLOD = makeObjectMaxLOD();
const objectMinLOD = makeObjectMinLOD();

function makeObjectMaxLOD() {
  const chairDesk = new Three.Mesh();
  const baseChair = makeBase();
  const bodyChair = makeBody();
  const backrestChair = makeBackrest();
  baseChair.position.y = 0.1 + 0.07;
  bodyChair.position.y = 0.1 + 0.14;
  backrestChair.position.y = 0.06;
  backrestChair.position.x = -0.25;
  bodyChair.add(backrestChair);
  baseChair.add(bodyChair);
  chairDesk.add(baseChair);
  chairDesk.rotation.y = -0.5 * Math.PI;
  chairDesk.position.z -= 0.02;

  return chairDesk
}

function makeObjectMinLOD() {
  const chairDesk = new Three.Mesh();
  const baseChair = makeBaseMinLOD();
  const bodyChair = makeBodyMinLOD();
  const backrestChair = makeBackrestMinLOD();
  baseChair.position.y = 0.1 + 0.07;
  bodyChair.position.y = 0.1 + 0.14;
  backrestChair.position.y = 0.06;
  backrestChair.position.x = -0.25;
  bodyChair.add(backrestChair);
  baseChair.add(bodyChair);
  chairDesk.add(baseChair);
  chairDesk.rotation.y = -0.5 * Math.PI;
  chairDesk.position.z -= 0.02;

  return chairDesk
}

export default defineCatalogElement({
  name: "chairdesk",
  prototype: "items",

  info: {
    tag: ['furnishings', 'wood'],
    title: "chairdesk",
    description: "office chair",
    image: require('./chairdesk.png')
  },

  properties: {
    altitude: {
      label: "altitude",
      type: "length-measure",
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
        <rect key="1" x="0" y="0" width={WIDTH} height={DEPTH}
          style={{ stroke: element.selected ? '#0096fd' : '#000', strokeWidth: "2px", fill: "#84e1ce" }} />
        <text key="2" x="0" y="0"
          transform={`translate(${WIDTH / 2}, ${DEPTH / 2}) scale(1,-1) rotate(${textRotation})`}
          style={{ textAnchor: "middle", fontSize: "11px" }}>
          {element.type}
        </text>
      </g>
    );
  },


  async render3D(element, layer, scene) {
    const newAltitude = element.properties.altitude.length;

    const chairDeskMaxLOD = new Three.Object3D();
    chairDeskMaxLOD.add(objectMaxLOD.clone());

    const aa = new Three.Box3().setFromObject(chairDeskMaxLOD);

    const deltaX = Math.abs(aa.max.x - aa.min.x);
    const deltaY = Math.abs(aa.max.y - aa.min.y);
    const deltaZ = Math.abs(aa.max.z - aa.min.z);

    chairDeskMaxLOD.position.y += newAltitude;
    chairDeskMaxLOD.position.x += -WIDTH / 8;
    chairDeskMaxLOD.position.z += DEPTH / 4;
    chairDeskMaxLOD.scale.set(WIDTH / deltaX, DEPTH / deltaZ, HEIGHT / deltaY);

    const chairDeskMinLOD = new Three.Object3D();
    chairDeskMinLOD.add(objectMinLOD.clone());
    chairDeskMinLOD.position.y += newAltitude;
    chairDeskMinLOD.position.x += -WIDTH / 8;
    chairDeskMinLOD.position.z += DEPTH / 4;
    chairDeskMinLOD.scale.set(WIDTH / deltaX, DEPTH / deltaZ, HEIGHT / deltaY);

    /**** all level of detail ***/

    const lod = new Three.LOD();

    lod.addLevel(chairDeskMaxLOD, 200);
    lod.addLevel(chairDeskMinLOD, 900);
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
