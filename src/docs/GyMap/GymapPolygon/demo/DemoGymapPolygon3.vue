<template>
  <MapCon id="map3">
    <GymapPolygon
      :positionList="polyPosList"
      :minZoom="15"
      :maxZoom="16"
    />
  </MapCon>
</template>

<script setup lang="ts">
import MapCon from '@/components/MapCon.vue'
import {ref} from 'vue'
const strokeColor = ref('blue')
const polyPosList = ref([
  [
    [116.400476,39.899306],
    [116.411226,39.899306],
    [116.411226,39.893075],
    [116.400476,39.893075],
    [116.400476,39.899306],
  ]
])
</script>
