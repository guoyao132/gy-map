<template>
  <MapCon>
    <GymapImage
      :position="[116.400476,39.899306]"
      :src="imgSrc"
      :scale="0.1"
    />
  </MapCon>
</template>

<script setup lang="ts">
import MapCon from '@/components/MapCon.vue'
import imgSrc from '@/assets/images/logo.png'
</script>

<style lang='less' scoped>
  .DemoGymapImage1{

  }

</style>
