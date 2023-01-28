<script setup>
import * as THREE from 'three';
// 內建控制
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

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

  // Cursor
  // const cursor = {
  //   x: 0,
  //   y: 0
  // };

  // window.addEventListener('mousemove', (e) => {
  //   cursor.x = e.clientX / size.width - 0.5;
  //   cursor.y = e.clientY / size.height - 0.5;
  //   console.log(cursor);
  // });

  const camera = new THREE.PerspectiveCamera(
    75,
    size.width / size.height,
    1,
    1000
  );
  // const asp = size.width / size.height;
  // const camera = new THREE.OrthographicCamera(
  //   -10 * asp,
  //   10 * asp,
  //   10,
  //   -10,
  //   1,
  //   1000
  // );
  // camera.position.x = 20;
  // camera.position.y = 20;
  camera.position.z = 20;
  scene.add(camera);
  // camera.lookAt(box.position);

  // 新增 render
  const renderer = new THREE.WebGLRenderer({
    canvas: threeScene.value
  });
  renderer.setSize(size.width, size.height);

  // 如果要用內建的 orbitControls
  const controls = new OrbitControls(camera, threeScene.value);
  controls.enableDamping = true;

  // const clock = new THREE.Clock();
  const timeLoop2 = () => {
    // 自己根據 mouse move 操控
    // const espTime = clock.getElapsedTime();
    // // box.rotation.y = espTime;
    // camera.position.x = Math.sin(cursor.x * Math.PI * 10) * 10;
    // camera.position.z = Math.cos(cursor.x * Math.PI * 10) * 20;
    // camera.lookAt(new THREE.Vector3());

    // orbitControls 要記得更新
    controls.update();
    // 把 render 放到這裡，每次更新都 render 一次
    renderer.render(scene, camera);
    window.requestAnimationFrame(timeLoop2);
  };
  timeLoop2();
});
</script>

<template>
  <div>
    <canvas id="threeScene" ref="threeScene"></canvas>
  </div>
</template>

<style lang="scss" scoped></style>
