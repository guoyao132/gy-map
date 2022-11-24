<template>
  <div class="GyTitle" :style="`font-weight:${bold};font-size:${size}`">
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  bold: {
    type: Number,
    default: 800,
  },
  size: {
    type: String,
    default: '24px',
  },
});
const emit = defineEmits([]);
</script>

<style lang='less' scoped>
  .GyTitle{
    display: flex;
    align-items: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: rgb(70, 70, 70);
    margin-bottom: 10px;
  }

</style>
