<script setup>
const point = ref(120);
const { count } = useAddCount();
console.log(count);
onMounted(() => {
  console.log(window);
});
</script>

<template>
  <div>
    <h1 class="pageTitle">index</h1>
    <p class="text-head-1">{{ point }}</p>
    <div class="pageTitleBox container">
      <p class="text-head-2 pageTitleBox__txt">{{ count }}</p>
    </div>
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
