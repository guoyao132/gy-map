<template>
  <MapCon>
    <GymapHeat
      :data="positionList"
    />
  </MapCon>
</template>

<script setup lang="ts">
import MapCon from '@/components/MapCon.vue';
import {ref} from 'vue'
import type {Ref} from 'vue'
const positionList:Ref<number[][]> = ref([
  [116.400476,39.899306, 1],
  [116.411226,39.899306, 1],
  [116.411226,39.893075, 1],
  [116.400476,39.893075, 1],
])
</script>
