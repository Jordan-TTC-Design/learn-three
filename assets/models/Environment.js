import * as THREE from 'three';

export default class Environment {
  constructor(experience) {
    this.experience = experience;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources
    this.setEnvironment();
    // this.setSunLight();
    // this.setEnvironmentLight();
    this.setEnvironmentMap()
  }

  setEnvironment() {
    this.scene.background = new THREE.Color('#888888');
  }

  setSunLight() {
    this.sunLight = new THREE.DirectionalLight('#f2f2f2', 1)
    this.sunLight.castShadow = true
    this.sunLight.shadow.camera.far = 15
    this.sunLight.shadow.mapSize.set(1024, 1024)
    this.sunLight.shadow.normalBias = 0.05
    this.sunLight.position.set(3, 2, 1)
    this.scene.add(this.sunLight)
  }

  setEnvironmentLight() {
    this.environmentLight = new THREE.HemisphereLight('#e2e2e2', '#000000', 2);
    this.scene.add(this.environmentLight);
  }

  setEnvironmentMap() {
    this.environmentMap = {}
    this.environmentMap.intensity = 0.8
    this.environmentMap.texture = this.resources.items.environmentMapTexture
    this.environmentMap.texture.encoding = THREE.sRGBEncoding

    this.scene.environment = this.environmentMap.texture
    this.environmentMap.updateMaterials = () => {
      this.scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          child.material.envMap = this.environmentMap.texture
          child.material.envMapIntensity = this.environmentMap.intensity
          child.material.needsUpdate = true
        }
      })
    }
    this.environmentMap.updateMaterials()
  }
}
