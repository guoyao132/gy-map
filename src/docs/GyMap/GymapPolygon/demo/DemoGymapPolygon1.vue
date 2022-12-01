<template>
  <MapCon>
    <GymapPolygon
      :positionList="polyPosList"
      fillColor="rgba(0,0,255,0.5)"
    />
  </MapCon>
</template>

<script setup lang="ts">
import MapCon from '@/components/MapCon.vue'
import {ref} from 'vue'
const polyPosList = ref([
  [116.400476,39.899306],
  [116.411226,39.899306],
  [116.411226,39.893075],
  [116.400476,39.893075],
  [116.400476,39.899306],
])
</script>

<style lang='less' scoped>
  .DemoGymapPolygon1{

  }

</style>
