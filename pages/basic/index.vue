<script setup>
import * as THREE from 'three';
const threeScene = ref(null);
onMounted(() => {
  const scene = new THREE.Scene();
  // create a gray box
  const boxGeometry = new THREE.BoxGeometry(10, 10, 10);
  const boxMaterial = new THREE.MeshBasicMaterial({ color: '#e2e2e2' });
  // 建立步驟
  const box = new THREE.Mesh(boxGeometry, boxMaterial);
  // 加到場景中
  scene.add(box);
  // 新增相機，因為要有相機才會看得到物體
  const size = {
    width: 800,
    height: 600
  };
  const camera = new THREE.PerspectiveCamera(75, size.width / size.height);
  camera.position.z = 30; // 由於預設相機會在中心點，物體目前也在中心點，所以要位移相機才會看到東西
  scene.add(camera);

  // 新增 render
  const renderer = new THREE.WebGLRenderer({
    canvas: threeScene.value
  });
  renderer.setSize(size.width, size.height);
  renderer.render(scene, camera);
});
</script>

<template>
  <div>
    <canvas id="threeScene" ref="threeScene"></canvas>
  </div>
</template>

<style lang="scss" scoped></style>
