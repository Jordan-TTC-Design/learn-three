import * as THREE from 'three';
import Sizes from '@/assets/utils/Sizes.js';
import Time from '@/assets/utils/Time.js';
import Camera from '@/assets/models/Camera.js';
import Render from '@/assets/models/Render.js';
import World from '@/assets/models/World.js';
// import Environment from '@/assets/models/Environment.js';
import sources from '@/assets/models/Sources.js';
import Resources from '@/assets/models/Resources.js'
let instance = null;

export default class Experience {
  constructor({ target }) {
    if (instance) {
      return instance;
    }
    instance = this;
    // console.log('Experience constructor');
    this.canvas = target
    window.experience = this;
    this.sizes = new Sizes();
    this.time = new Time();
    this.sizes.on('resize', () => {
      this.resize();
    });
    this.time.on('tick', () => {
      this.updated();
    })
    // start three.js
    this.scene = new THREE.Scene();
    this.camera = new Camera(this);
    this.renderer = new Render(this);
    this.resources = new Resources(sources)
    this.world = new World(this);
    // this.environment = new Environment(this);
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  updated() {
    this.camera.updated();
    this.renderer.update();
  }
}
