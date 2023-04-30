import * as THREE from 'three';
import Environment from '@/assets/models/Environment.js';
export default class World {
  constructor(experience) {
    this.experience = experience;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources

    const testMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial()
    )
    this.scene.add(testMesh);
    // Wait for resources
    this.resources.on('ready', () => {
      // Setup
      this.environment = new Environment(this.experience)
    })
  }
}
