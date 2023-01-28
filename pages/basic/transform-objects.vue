<script setup>
import * as THREE from 'three';
const threeScene = ref(null);
onMounted(() => {
  const scene = new THREE.Scene();

  // 建立群組
  const boxGroup = new THREE.Group();
  scene.add(boxGroup);

  // 建立第一個方塊
  const boxGeometry = new THREE.BoxGeometry(10, 10, 10);
  const boxMaterial = new THREE.MeshBasicMaterial({ color: '#e2e2e2' });
  const box1 = new THREE.Mesh(boxGeometry, boxMaterial);

  // 移動，記得要在 render 前面移動
  box1.position.x = 5;
  box1.position.y = -6;
  box1.position.z = 3;
  box1.scale.set(2, 0.5, 0.5);
  // 加到群組
  boxGroup.add(box1);

  // 建立第二個方塊
  const boxGeometry2 = new THREE.BoxGeometry(10, 10, 10);
  const boxMaterial2 = new THREE.MeshBasicMaterial({ color: '#C10' });
  const box2 = new THREE.Mesh(boxGeometry2, boxMaterial2);
  box2.position.set(20, 10, 5);
  // 加到群組
  boxGroup.add(box2);
  boxGroup.position.y = -20
  // 新增相機，因為要有相機才會看得到物體
  const size = {
    width: 800,
    height: 600
  };
  const camera = new THREE.PerspectiveCamera(75, size.width / size.height);
  camera.position.z = 50;
  // 可以針對某個特定點觀看
  camera.lookAt(new THREE.Vector3(20, 0, 10));
  scene.add(camera);

  // 新增軸心
  const axesHelper = new THREE.AxesHelper();
  scene.add(axesHelper);

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
