<script setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
const threeScene = ref(null);

onMounted(() => {
  /**
 * Base
 */
  // Debug
  const gui = new dat.GUI()

  // Scene
  const scene = new THREE.Scene()
  /**
 * Textures
 */
  const textureLoader = new THREE.TextureLoader()
  /**
 * 粒子
 */

  // const particlesGeometry = new THREE.SphereGeometry(1, 32, 32);

  const particlesGeometry = new THREE.BufferGeometry();
  const count = 1000

  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
  }

  particlesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
  )

  const particlesMaterial = new THREE.PointsMaterial();
  particlesMaterial.size = 0.02
  particlesMaterial.sizeAttenuation = true
  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particles)

  // scene.add(particles)
  /**
 * Sizes
 */
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
  }

  window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  })

  /**
 * Camera
 */
  // Base camera
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
  camera.position.x = 1
  camera.position.y = 1
  camera.position.z = 2
  scene.add(camera)

  // Controls
  const controls = new OrbitControls(camera, threeScene.value)
  controls.enableDamping = true

  /**
 * Renderer
 */
  const renderer = new THREE.WebGLRenderer({
    canvas: threeScene.value
  })
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  /**
 * Animate
 */
  const clock = new THREE.Clock()

  const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
  }

  tick()
})
</script>

<template>
  <div>
    <canvas id="threeScene" ref="threeScene"></canvas>
  </div>
</template>

<style scoped></style>
