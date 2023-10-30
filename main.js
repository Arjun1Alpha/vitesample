import "./style.css";

import * as THREE from "three";
import { ARButton } from "three/addons/webxr/ARButton.js";

let camera, scene, renderer;
let controller;

init();
animate();

function init() {
  const container = document.createElement("div");
  document.body.appendChild(container);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.01,
    20
  );

  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 3);
  light.position.set(0.5, 1, 0.25);
  scene.add(light);

  //

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  container.appendChild(renderer.domElement);

  //

  document.body.appendChild(ARButton.createButton(renderer));

  //

  const geometry = new THREE.CylinderGeometry(0, 0.05, 0.2, 32).rotateX(
    Math.PI / 2
  );
  const wallGeometry = new THREE.PlaneGeometry(1, 1);
  const wallMaterial = new THREE.MeshBasicMaterial({
    color: 0x808080,
    side: THREE.DoubleSide,
  });
  const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);

  // Position and rotate the wall as needed
  wallMesh.position.set(0, 0, -1); // Adjust the Z-position to place it in front of the camera
  scene.add(wallMesh);

  function onSelect() {
    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff * Math.random(),
    });
    const mesh = new THREE.Mesh(geometry, material);

    // Set the position and rotation of the mesh on the wall
    mesh.position.copy(controller.position); // Use the controller's position
    mesh.rotation.copy(wallMesh.rotation); // Use the wall's rotation
    wallMesh.add(mesh); // Add the mesh to the wall
  }

  controller = renderer.xr.getController(0);
  controller.addEventListener("select", onSelect);
  scene.add(controller);

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

//

function animate() {
  renderer.setAnimationLoop(render);
}

function render() {
  renderer.render(scene, camera);
}
