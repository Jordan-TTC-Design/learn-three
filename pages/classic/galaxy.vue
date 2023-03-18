<script setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
const threeScene = ref(null)

onMounted(() => {
  /**
 * Base
 */
  // Debug
  const gui = new dat.GUI()

  // Canvas
  // const canvas = document.querySelector('canvas.webgl')

  // Scene
  const scene = new THREE.Scene()
  const parameters = {}
  parameters.count = 1000
  parameters.size = 0.01
  parameters.radius = 5
  parameters.branches = 3
  let geometry = null
  let material = null
  let points = null
  const generateGalaxy = () => {
    // This code creates a new instance of a BufferGeometry class and assigns it to the variable geometry. The BufferGeometry class is used to store and manipulate the vertices and faces of a 3D object. The code also creates a new instance of a Float32Array class and assigns it to the variable positions. The Float32Array class is used to store 32-bit floating point numbers.
    // The code next creates a for loop that creates a new instance of the BufferAttribute class, which is used to store data associated with vertices, normals, colors, uvs, and any custom attributes. It is then assigned to the attribute position of the geometry object. The BufferAttribute class takes two parameters, an array of data and the number of items in each data point. The data points are then passed through the BufferGeometry class, which stores the data and assigns it to the attribute position. The number of data points is determined by the count parameter passed through the parameters object.

    // destory old geometry
    if (points !== null) {
      geometry.dispose()
      material.dispose()
      scene.remove(points)
    }

    geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(parameters.count * 3)
    for (let i = 0; i < parameters.count; i++) {
      const i3 = i * 3
      const radius = parameters.radius * Math.random()
      const brancherAngle = ((i % parameters.branches) / parameters.branches) * Math.PI * 2
      positions[i3] = radius
      positions[i3 + 1] = 0
      positions[i3 + 2] = brancherAngle * radius
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    }

    material = new THREE.PointsMaterial({
      size: parameters.size,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      // color: new THREE.Color(`hsl(${Math.random() * 360}, 50%, 50%)`)
    })
    points = new THREE.Points(geometry, material)
    scene.add(points)
  }
  generateGalaxy()

  gui.add(parameters, 'count').min(100).max(10000).step(100).onFinishChange(generateGalaxy)
  gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy)
  gui.add(parameters, 'radius').min(0.001).max(20).step(0.001).onFinishChange(generateGalaxy)
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
  camera.position.x = 3
  camera.position.y = 3
  camera.position.z = 3
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

  /**
 * Animate
 */
  // const clock = new THREE.Clock()

  const tick = () => {
    // const elapsedTime = clock.getElapsedTime()

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
