export class Robot {
  constructor({ name }) {
    this.name = name;
  }

  sayHi() {
    console.log('Hi, I am ' + this.name);
  }
}

export class FlyingRobot extends Robot {
  constructor({ name, canFly }) {
    super({ name });
    this.canFly = canFly;
  }

  fly() {
    console.log('I can fly');
  }
}
