<script setup lang="ts">
onMounted(() => {
  $fetch('/api/check-and-notify');
});
</script>

<template><div></div></template>

<style scoped></style>
