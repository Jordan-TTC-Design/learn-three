<script setup>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import GUI from 'lil-gui';
const gui = new GUI();

const threeScene = ref(null);
onMounted(() => {
  const params = {
    cssColor: '#ff00ff',
    spin: () => {
      gsap.to(box.rotation, { duration: 2, y: box.rotation.y + 5 });
    }
  };
  const scene = new THREE.Scene();
  const boxGeometry = new THREE.BoxGeometry(10, 10, 10);
  const boxMaterial = new THREE.MeshBasicMaterial({ color: params.cssColor });
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
  camera.position.z = 20;
  scene.add(camera);

  // 新增控制設定
  gui.add(box.position, 'y').min(-10).max(10).step(0.1).name('boxY');
  console.log(gui);
  gui.add(box, 'visible');
  gui.add(boxMaterial, 'wireframe');

  gui.addColor(params, 'cssColor').onChange(() => {
    box.material.color.set(params.cssColor);
  });
  gui.add(params, 'spin').name('旋轉');

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
