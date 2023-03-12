<script setup>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
const threeScene = ref(null);

onMounted(() => {
  /**
  * 場景
  */
  const scene = new THREE.Scene();

  const axs = new THREE.AxesHelper();
  scene.add(axs)
  /**
  * 材質
  */
  const textureLoader = new THREE.TextureLoader();
  const mapCapTexture = textureLoader.load('/textures/matcaps/7.png')
  /**
  * 字體
  */
  const fontLoader = new FontLoader()
  fontLoader.load(
    '/font/Roboto Black_Regular.json',
    (font) => {
      console.log('loaded')
      console.log(font)
      // 新增文字實體
      const textGeometry = new TextGeometry(
        'good',
        {
          font,
          size: 1,
          height: 0.2,
          curveSegments: 5,
          bevelEnabled: true,
          bevelThickness: 0.03,
          bevelSize: 0.02,
          bevelOffset: 0,
          bevelSegments: 4
        }
      )
      textGeometry.computeBoundingBox()
      // textGeometry.translate(
      //   -(textGeometry.boundingBox.max.x + 0.017) * 0.5,
      //   -(textGeometry.boundingBox.max.y - 0.31) * 0.5,
      //   -(textGeometry.boundingBox.max.z - 0.03) * 0.5,
      // )
      textGeometry.center();
      console.log(textGeometry.boundingBox)
      const textMaterial = new THREE.MeshMatcapMaterial({ matcap: mapCapTexture });
      // textMaterial.wireframe = true;
      const text = new THREE.Mesh(textGeometry, textMaterial);
      scene.add(text)

      const dountGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
      const dountMaterial = new THREE.MeshMatcapMaterial({ matcap: mapCapTexture });
      for (let i = 0; i < 100; i++) {
        const dount = new THREE.Mesh(dountGeometry, dountMaterial)
        // dountGeometry.translate(
        //   (Math.random() - 0.5) * 50,
        //   (Math.random() - 0.5) * 50,
        //   (Math.random() - 0.5) * 50
        // )
        dount.position.x = (Math.random() - 0.5) * 50;
        dount.position.y = (Math.random() - 0.5) * 50;
        dount.position.z = (Math.random() - 0.5) * 50;
        dount.rotation.x = Math.random() * Math.PI
        dount.rotation.y = Math.random() * Math.PI
        const scale = Math.random()
        dount.scale.set(scale, scale, scale)
        scene.add(dount)
      }
    }
  )
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
