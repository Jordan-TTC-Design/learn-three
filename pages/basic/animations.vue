<script setup>
import * as THREE from 'three';
import gsap from 'gsap';

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

  // 為了讓每個瀏覽器都一樣速率，可以在 box.rotation.y 乘以一個時間差，意思是用時間差來控制值。
  let time = Date.now();

  const timeLoop = () => {
    // 裏面也宣告一個現在時間的值
    const current = Date.now();
    // 兩者相減
    const deltaTime = current - time;
    // 更新舊的時間
    time = current;

    // 再把旋轉值更新
    box.rotation.y += 0.001 * deltaTime;
    // 把 render 放到這裡，每次更新都 render 一次
    renderer.render(scene, camera);
    window.requestAnimationFrame(timeLoop);
  };
  // timeLoop();
  // 直接使用 Three 內建的時鐘功能
  const clock = new THREE.Clock();
  const timeLoop2 = () => {
    // 可以取得每秒增加的數值
    const elapsedTime = clock.getElapsedTime();

    // 再把旋轉值更新為該數值
    box.rotation.y = Math.sin(elapsedTime)
    console.log(Math.sin(elapsedTime))
    // camera.lookAt(box)
    // 把 render 放到這裡，每次更新都 render 一次
    renderer.render(scene, camera);
    window.requestAnimationFrame(timeLoop2);
  };
  // timeLoop2();

  gsap.to(box.position, { duration: 2, delay: 1, x: 20 });
  const timeLoop3 = () => {
    // 可以取得每秒增加的數值
    // 把 render 放到這裡，每次更新都 render 一次
    renderer.render(scene, camera);
    window.requestAnimationFrame(timeLoop3);
  };
  timeLoop3();
});
</script>

<template>
  <div>
    <canvas id="threeScene" ref="threeScene"></canvas>
  </div>
</template>

<style lang="scss" scoped></style>
