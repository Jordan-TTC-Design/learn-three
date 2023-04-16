<script setup>
import Experience from '@/assets/models/Experience.js';

onMounted(() => {
  const experience = new Experience({ target: document.getElementById('threeScene') });
  console.log(experience);
});

</script>
<template>
  <div>
    <canvas id="threeScene" ref="threeScene"></canvas>
  </div>
</template>
