import EventEmitter from '@/assets/utils/EventEmitter.js';

export default class Time extends EventEmitter {
  constructor() {
    super()

    // Set time
    this.start = Date.now();
    this.current = this.start;
    this.elapsed = 0;
    this.delta = 16;
    this.tick()
  }

  tick() {
    const currentTime = Date.now();
    this.delta = currentTime - this.current;
    this.current = currentTime;
    this.elapsed = this.current - this.start;
    // console.log(this.elapsed);
    this.trigger('tick')
    window.requestAnimationFrame(() => {
      this.tick()
    })
  }
}
