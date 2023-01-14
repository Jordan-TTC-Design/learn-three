export function useAddCount() {
  const count = ref(123);
  return { count };
}
