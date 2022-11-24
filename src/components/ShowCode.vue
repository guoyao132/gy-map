<template>
  <div class="hl-pre">
    <div class="pre-box">
      <pre><code v-hljs v-text="code"></code></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  code: {
    type: String,
    default: '',
  }
});
</script>

<style lang='less' scoped>
  .ShowCode{

  }

</style>
