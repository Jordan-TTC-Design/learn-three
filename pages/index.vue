<script setup>
import * as THREE from 'three';

onMounted(() => {
  const scene = new THREE.Scene();
  console.log(scene);
});
</script>

<template>
  <div>
    <canvas id="basicThree"></canvas>
  </div>
</template>

<style lang="scss" scoped>
.pageTitle {
  @apply text-2xl text-black;
  @apply text-ad-error;
}
.pageTitleBox {
  &__txt {
    padding-top: 100px;
  }
}
</style>
