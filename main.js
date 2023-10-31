import "./style.css";
import * as THREE from "three";
import { ARButton } from "three/addons/webxr/ARButton.js";

let camera, scene, renderer;
let controller;
let meshes = []; 
let wallMesh;
let pointer; 

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

  // Create the initial wallGeometry
  const wallGeometry = new THREE.PlaneGeometry(0.3, 0.3);
  const wallMaterial = new THREE.MeshBasicMaterial({
    transparent: true,
    color: "#000000",
    alphaTest: 0,
    side: THREE.DoubleSide,
  });

  wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
  wallMesh.position.set(0, 0, -1);
  scene.add(wallMesh);


  const pointerGeometry = new THREE.SphereGeometry(0.02, 16, 16);
  const pointerMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  pointer = new THREE.Mesh(pointerGeometry, pointerMaterial);
  pointer.visible = false; 
  scene.add(pointer);
  
  document.querySelector("#ARButton").addEventListener("click", function () {
    pointer.visible = true;
  });

  // When the pointer is clicked, place an object at its position
  pointer.addEventListener("click", function (event) {
    console.log(event)
    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff * Math.random(),
    });

    const size = 0.5;
    const geometry = new THREE.PlaneGeometry(size, size);
    const mesh = new THREE.Mesh(geometry, material);

    // Place the object at the pointer's position
    mesh.position.copy(pointer.position);

    // Add the mesh to the array and the scene
    meshes.push(mesh);
    scene.add(mesh);
  });

  controller = renderer.xr.getController(0);
  scene.add(controller);

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  renderer.setAnimationLoop(render);
}

function render() {
  renderer.render(scene, camera);
}
