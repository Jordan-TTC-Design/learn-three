import { defineStore } from 'pinia';

export const useAllStore = defineStore('all', () => {
  const count = ref(0);

  const increment = () => {
    count.value += 1;
  };
  const decrement = () => {
    count.value -= 1;
  };

  const doubleCount = computed(() => count.value * 2);

  return {
    count,
    increment,
    decrement,
    doubleCount
  };
});
