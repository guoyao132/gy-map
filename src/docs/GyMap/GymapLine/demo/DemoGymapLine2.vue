<template>
  <MapCon id="map2">
    <GymapLine
      :positionList="lineList"
      :minZoom="15"
      :maxZoom="16"
    />
  </MapCon>
</template>

<script setup lang="ts">
import MapCon from '@/components/MapCon.vue'
import {ref} from "vue"
const lineList = ref([
  [116.400476,39.899306],
  [116.411226,39.899306],
  [116.411226,39.893075],
  [116.400476,39.893075],
  [116.400476,39.899306],
])
</script>
