<template>
  <MapCon id="map2">
    <GymapTask
      :loop="true"
      :positionList="positionList"
    >
      <GymapCircle
        fillColor="red"
        :radius="100"
        :position="p"
      />
    </GymapTask>
  </MapCon>
</template>

<script setup lang="ts">
import {ref} from "vue"
import type {Ref} from 'vue'
const positionList:Ref<number[][]> = ref([
  [116.400476,39.899306],
  [116.411226,39.899306],
  [116.411226,39.893075],
  [116.400476,39.893075],
  [116.400476,39.899306],
])
const p:Ref<number[]> = ref([116.40531, 39.896884]);
setTimeout(() =>{
  p.value = [116.400476,39.899306];
}, 5000)
</script>
