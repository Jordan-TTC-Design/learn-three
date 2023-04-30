<script setup>
import { Robot, FlyingRobot } from '@/assets/models/robet.js';

const zoe = new Robot({ name: 'zoe' });
const jordan = new Robot({ name: 'jordan' });
console.log(zoe, jordan);
jordan.sayHi();

const flyingZoe = new FlyingRobot({ name: 'flyingZoe', canFly: true });
console.log(flyingZoe);
</script>
<template>
  <div>
  </div>
</template>
