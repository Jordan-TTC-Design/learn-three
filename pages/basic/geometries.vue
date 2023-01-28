<script setup>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const threeScene = ref(null);
onMounted(() => {
  const scene = new THREE.Scene();
  // 先建立一個空的
  const boxGeometry = new THREE.BufferGeometry();
  // 透過 Float32Array 建立三個座標點陣列
  const positionsArray = new Float32Array([
    0,
    0,
    0, // First vertex
    0,
    1,
    0, // Second vertex
    1,
    0,
    0 // Third vertex
  ]);
  const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
  // 組出一個三角型
  boxGeometry.setAttribute('position', positionsAttribute)

  const boxMaterial = new THREE.MeshBasicMaterial({ color: '#e2e2e2', wireframe: true });
  const box = new THREE.Mesh(boxGeometry, boxMaterial);
  // 加到場景中
  scene.add(box);
  // 新增相機，因為要有相機才會看得到物體
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
  camera.position.z = 4;
  scene.add(camera);

  // 新增 render
  const renderer = new THREE.WebGLRenderer({
    canvas: threeScene.value
  });
  renderer.setSize(size.width, size.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

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
});
</script>

<template>
  <div>
    <canvas id="threeScene" ref="threeScene"></canvas>
  </div>
</template>

<style lang="scss" scoped>
#threeScene {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  outline: none;
}
</style>
