"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import * as THREE from "three";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";

extend({ MeshLineGeometry, MeshLineMaterial });

const CARD_ASPECT = 1.37;
const ROLE_TITLES = ["Software Developer", "Frontend Developer", "Web Developer", "Product Designer"];
const BAND_VISUAL = {
  lineWidth: 1.2,
  tipSizePx: 42,
  tipSizePxMobile: 54,
  tipEmbedWorldMobile: 0.2,
};
const CARD_PHYSICS = {
  gravityScale: 0.72,
  linearDamping: 0.75,
  angularDamping: 3.2,
  springDragged: 6,
  springIdle: 11,
  dampingDragged: 1.8,
  dampingIdle: 3.4,
  maxSpin: 2.2,
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const normalizeAngle = (angle) => Math.atan2(Math.sin(angle), Math.cos(angle));

function toScreen(camera, size, source, target) {
  target.set(source.x, source.y, source.z).project(camera);
  return {
    x: (target.x * 0.5 + 0.5) * size.width,
    y: (-target.y * 0.5 + 0.5) * size.height,
  };
}

function placeOverlay(el, x, y, angle) {
  if (!el) return;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  el.style.transform = `translate(-50%, -50%) rotate(${angle}rad)`;
  if (el.style.opacity !== "1") {
    el.style.opacity = "1";
  }
}

function RoleFocusText({ text }) {
  return (
    <span key={text} className="hire-role-focus-text">
      {text}
    </span>
  );
}

function Band({ cardRef, tipRef, cardSize }) {
  const band = useRef();
  const fixed = useRef();
  const j1 = useRef();
  const j2 = useRef();
  const j3 = useRef();
  const card = useRef();

  const vec = useMemo(() => new THREE.Vector3(), []);
  const dragVec = useMemo(() => new THREE.Vector3(), []);
  const ang = useMemo(() => new THREE.Vector3(), []);
  const rot = useMemo(() => new THREE.Vector4(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);
  const screenVec = useMemo(() => new THREE.Vector3(), []);
  const attachVec = useMemo(() => new THREE.Vector3(), []);
  const attachScreenVec = useMemo(() => new THREE.Vector3(), []);
  const quat = useMemo(() => new THREE.Quaternion(), []);
  const euler = useMemo(() => new THREE.Euler(), []);
  const lineResolution = useMemo(() => new THREE.Vector2(1, 1), []);

  const { size, camera } = useThree();
  const isMobile = size.width < 768;
  lineResolution.set(size.width, size.height);

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ])
  );
  const [dragged, drag] = useState(false);

  const cardWorldWidth = clamp(cardSize.width / 130, 1.95, 2.75);
  const cardWorldHeight = cardWorldWidth * CARD_ASPECT;
  const cardAttachY = cardWorldHeight / 2 - 0.36;
  const segmentLength = 0.9;

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], segmentLength]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], segmentLength]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], segmentLength]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, cardAttachY, 0]]);

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }

    if (!fixed.current || !j1.current || !j2.current || !j3.current || !card.current) {
      return;
    }

    [j1, j2].forEach((ref) => {
      if (!ref.current.lerped) {
        ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
      }
      const distance = ref.current.lerped.distanceTo(ref.current.translation());
      const clamped = Math.max(0.1, Math.min(1, distance));
      ref.current.lerped.lerp(ref.current.translation(), delta * (2 + clamped * 18));
    });

    const cardPos = card.current.translation();
    rot.copy(card.current.rotation());
    quat.set(rot.x, rot.y, rot.z, rot.w);
    euler.setFromQuaternion(quat, "XYZ");

    const tipEmbedWorld = isMobile ? BAND_VISUAL.tipEmbedWorldMobile : 0;
    attachVec.set(0, cardAttachY - tipEmbedWorld, 0).applyQuaternion(quat).add(
      new THREE.Vector3(cardPos.x, cardPos.y, cardPos.z)
    );

    curve.points[0].copy(attachVec);
    curve.points[1].copy(j2.current.lerped);
    curve.points[2].copy(j1.current.lerped);
    curve.points[3].copy(fixed.current.translation());
    if (band.current?.geometry) {
      band.current.geometry.setPoints(curve.getPoints(32));
    }

    ang.copy(card.current.angvel());

    // Soft spring-to-center so the badge settles quickly without full spins.
    const spring = dragged ? CARD_PHYSICS.springDragged : CARD_PHYSICS.springIdle;
    const damping = dragged ? CARD_PHYSICS.dampingDragged : CARD_PHYSICS.dampingIdle;
    const nextX = ang.x - (normalizeAngle(euler.x) * spring + ang.x * damping) * delta;
    const nextY = ang.y - (normalizeAngle(euler.y) * spring + ang.y * damping) * delta;
    const nextZ = ang.z - (normalizeAngle(euler.z) * spring * 1.2 + ang.z * damping) * delta;
    const maxSpin = CARD_PHYSICS.maxSpin;
    card.current.setAngvel({
      x: clamp(nextX, -maxSpin, maxSpin),
      y: clamp(nextY, -maxSpin, maxSpin),
      z: clamp(nextZ, -maxSpin, maxSpin),
    });

    const cardScreen = toScreen(camera, size, cardPos, screenVec);
    placeOverlay(cardRef.current, cardScreen.x, cardScreen.y, euler.z);

    // Tip circle at the band-card join point (rendered behind the card layer)
    const tipScreen = toScreen(camera, size, attachVec, attachScreenVec);
    placeOverlay(tipRef.current, tipScreen.x, tipScreen.y, 0);
  });

  return (
    <>
      <group position={[0, 3.7, 0]}>
        <RigidBody ref={fixed} type="fixed" angularDamping={2} linearDamping={2} />

        <RigidBody ref={j1} position={[0, -segmentLength, 0]} angularDamping={3} linearDamping={3} colliders={false}>
          <BallCollider args={[0.08]} />
        </RigidBody>

        <RigidBody ref={j2} position={[0, -segmentLength * 2, 0]} angularDamping={3} linearDamping={3} colliders={false}>
          <BallCollider args={[0.08]} />
        </RigidBody>

        <RigidBody ref={j3} position={[0, -segmentLength * 3, 0]} angularDamping={3} linearDamping={3} colliders={false}>
          <BallCollider args={[0.08]} />
        </RigidBody>

        <RigidBody
          ref={card}
          position={[0, -(segmentLength * 3 + cardWorldHeight * 0.5 + 0.62), 0]}
          gravityScale={CARD_PHYSICS.gravityScale}
          angularDamping={CARD_PHYSICS.angularDamping}
          linearDamping={CARD_PHYSICS.linearDamping}
          colliders={false}
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[cardWorldWidth / 2, cardWorldHeight / 2, 0.02]} />
          <mesh
            onPointerUp={(e) => {
              e.stopPropagation();
              e.target.releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              e.target.setPointerCapture(e.pointerId);
              drag(dragVec.copy(e.point).sub(vec.copy(card.current.translation())));
            }}
          >
            <planeGeometry args={[cardWorldWidth, cardWorldHeight]} />
            <meshBasicMaterial transparent opacity={0} side={THREE.DoubleSide} />
          </mesh>
        </RigidBody>
      </group>

      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          transparent={false}
          color="#000000"
          depthTest={false}
          resolution={lineResolution}
          lineWidth={isMobile ? BAND_VISUAL.lineWidth * 0.82 : BAND_VISUAL.lineWidth}
        />
      </mesh>
    </>
  );
}

export default function HireMeLanyard() {
  const stageRef = useRef(null);
  const cardRef = useRef(null);
  const tipRef = useRef(null);
  const [roleIndex, setRoleIndex] = useState(0);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [cardSize, setCardSize] = useState({
    width: 290,
    height: Math.round(290 * CARD_ASPECT),
  });

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;

    const updateSize = () => {
      const width = clamp(stage.clientWidth * 0.26, 220, 320);
      setIsMobileViewport(stage.clientWidth < 768);
      setCardSize({
        width,
        height: Math.round(width * CARD_ASPECT),
      });
    };

    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(stage);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setRoleIndex((current) => (current + 1) % ROLE_TITLES.length);
    }, 2400);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div ref={stageRef} className="hire-r3f-lanyard">
      <Canvas className="hire-r3f-lanyard-canvas" camera={{ position: [0, 0, 13], fov: 25 }} dpr={[1, 2]}>
        <Physics gravity={[0, -40, 0]} timeStep={1 / 60} interpolate>
          <Band key={cardSize.width} cardRef={cardRef} tipRef={tipRef} cardSize={cardSize} />
        </Physics>
      </Canvas>

      <div
        ref={tipRef}
        className="hire-lanyard-tip"
        style={{
          width: `${isMobileViewport ? BAND_VISUAL.tipSizePxMobile : BAND_VISUAL.tipSizePx}px`,
          height: `${isMobileViewport ? BAND_VISUAL.tipSizePxMobile : BAND_VISUAL.tipSizePx}px`,
          opacity: 0,
        }}
      />

      <article
        ref={cardRef}
        className="hire-badge-card"
        style={{
          width: `${cardSize.width}px`,
          height: `${cardSize.height}px`,
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          willChange: "transform, left, top",
        }}
      >
        <div className="hire-badge-card-inner tracking-[-0.09em]">
          <Image
            src="/my-profile.svg"
            alt="Jaimin Jariwala"
            width={480}
            height={480}
            className="hire-badge-photo"
            draggable={false}
            priority
          />
          <h2 className="hire-badge-name">
            Jaimin
            <br />
            Jariwala
          </h2>
          <p className="hire-badge-role">
            <RoleFocusText text={ROLE_TITLES[roleIndex]} />
          </p>
        </div>
      </article>
    </div>
  );
}
