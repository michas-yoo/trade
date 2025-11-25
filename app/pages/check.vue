<script setup lang="ts">
onMounted(() => {
  $fetch('/api/check');
});
</script>

<template><div></div></template>

<style scoped></style>
