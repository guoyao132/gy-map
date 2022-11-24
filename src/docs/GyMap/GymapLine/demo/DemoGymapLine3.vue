<template>
  <MapCon id="map3">
    <GymapLine
      :positionList="lineList"
      :arrow="true"
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
