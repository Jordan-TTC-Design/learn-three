<script setup>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
const threeScene = ref(null);
onMounted(() => {
  const textureManager = new THREE.LoadingManager();
  textureManager.onStart = () => {
    console.log('load');
  };
  const textureLoader = new THREE.TextureLoader(textureManager);
  const boxColor = textureLoader.load(
    '/textures/door/color.jpg',
    () => {
      console.log('load');
    },
    () => {
      console.log('progress');
    },
    () => {
      console.log('error'); // 如果發生錯誤
    }
  );
  // const boxAlpha = textureLoader.load('/textures/door/alpha.jpg');
  // const boxHeight = textureLoader.load('/textures/door/height.jpg');
  // const boxNormal = textureLoader.load('/textures/door/normal.jpg');
  // const boxAmbient = textureLoader.load('/textures/door/ambientOcclusion.jpg');
  // const boxMetalness = textureLoader.load('/textures/door/metalness.jpg');
  // const boxRoughness= textureLoader.load('/textures/door/roughness.jpg');

  boxColor.minFilter = THREE.NearestFilter // make texture sharper

  // boxColor.repeat.x = 2;
  // boxColor.repeat.y = 2;
  boxColor.offset.x = 0.5;
  boxColor.offset.y = 0.5;

  boxColor.rotation = Math.PI / 4;

  const scene = new THREE.Scene();
  const boxGeometry = new THREE.BoxGeometry(10, 10, 10);
  const boxMaterial = new THREE.MeshBasicMaterial({ map: boxColor });
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
