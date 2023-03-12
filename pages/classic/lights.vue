<script setup>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';
const threeScene = ref(null);

onMounted(() => {
  /**
  * 場景
  */
  const scene = new THREE.Scene();
  const gui = new dat.GUI()

  /**
 * Lights
 */
  // const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5)
  // 環境光
  const ambientLight = new THREE.AmbientLight()
  ambientLight.color = new THREE.Color(0xFFFFFF)
  ambientLight.intensity = 0.5
  scene.add(ambientLight)
  gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
  // 定向光
  const directionalLight = new THREE.DirectionalLight(0x00FFFC, 0.3)
  directionalLight.position.set(1, 0.25, 0)
  // scene.add(directionalLight)
  // 半球光
  const hemisphereLight = new THREE.HemisphereLight(0xFF0000, 0x0000FF, 0.3)
  // scene.add(hemisphereLight)

  // 定點光
  const pointLight = new THREE.PointLight(0xFFFFFF, 0.5, 20, 2)
  pointLight.position.set(1, 1, 0)
  // scene.add(pointLight)

  // 方形區域光
  const rectAreaLight = new THREE.RectAreaLight(0x4E00FF, 2, 1, 1)
  rectAreaLight.position.set(-1.5, 0, 1.5)
  rectAreaLight.lookAt(new THREE.Vector3(0, 0, 0))
  // scene.add(rectAreaLight)

  // spotLight
  const spotLight = new THREE.SpotLight(0x78FF00, 0.5, 10, Math.PI * 0.1, 0.25, 1)
  spotLight.position.set(0, 2, 3)
  scene.add(spotLight)

  spotLight.target.position.x = -0.75
  scene.add(spotLight.target)
  const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2)
  scene.add(hemisphereLightHelper)

  const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
  scene.add(directionalLightHelper)

  const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
  scene.add(pointLightHelper)

  const spotLightHelper = new THREE.SpotLightHelper(spotLight)
  scene.add(spotLightHelper)

  /**
 * Objects
 */
  // Material
  const material = new THREE.MeshStandardMaterial()
  material.roughness = 0.4

  // Objects
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
  )
  sphere.position.x = -1.5

  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
  )

  const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
  )
  torus.position.x = 1.5

  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
  )
  plane.rotation.x = -Math.PI * 0.5
  plane.position.y = -0.65

  scene.add(sphere, cube, torus, plane)
  const size = {
    width: window.innerWidth,
    height: window.innerHeight
  };

  const camera = new THREE.PerspectiveCamera(
    75,
    size.width / size.height,
    1,
    1000
  );
  camera.position.z = 5;
  scene.add(camera);

  // 新增 render
  const renderer = new THREE.WebGLRenderer({
    canvas: threeScene.value
  });
  renderer.setSize(size.width, size.height);
  renderer.render(scene, camera);

  // 如果要用內建的 orbitControls
  const controls = new OrbitControls(camera, threeScene.value);
  controls.enableDamping = true;

  const timeLoop2 = () => {
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(timeLoop2);
  };
  timeLoop2();

  window.addEventListener('resize', () => {
    // 更新
    size.width = window.innerWidth;
    size.height = window.innerHeight;

    // 更新相機
    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();
    // 更新場景渲染
    renderer.setSize(size.width, size.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
})
</script>

<template>
  <div>
    <canvas id="threeScene" ref="threeScene"></canvas>
  </div>
</template>

<style scoped></style>
