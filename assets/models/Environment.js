import * as THREE from 'three';

export default class Environment {
  constructor(experience) {
    this.experience = experience;
    this.scene = this.experience.scene;
    this.setEnvironment();
    this.setSunLight();
    this.setEnvironmentLight();
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
}
