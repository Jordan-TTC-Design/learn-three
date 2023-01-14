<template>
  <div class="page-error">
    <h2>{{ error.statusCode }}</h2>
    <h3>{{ error.message }}</h3>
  </div>
</template>

<script>
export default {
  name: "ErrorLayout",
  props: {
    error: {
      type: Object,
      required: true,
    },
  },
  head: {},
};
</script>

<style lang="scss" scoped>
.page-error {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
