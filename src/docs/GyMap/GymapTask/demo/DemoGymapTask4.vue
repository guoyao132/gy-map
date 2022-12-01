<template>
  <gy-button @click.native="taskStatus = 'play'">play</gy-button>
  <gy-button @click.native="taskStatus = 'stop'">stop</gy-button>
  <gy-button @click.native="taskStatus = 'pause'">pause</gy-button>
  <MapCon id="map4">
    <GymapTask
      :loop="true"
      :positionList="positionList"
      :taskStatus="taskStatus"
      @animate="animateFun"
    />

    <GymapCircle
      fillColor="red"
      :radius="100"
      :position="p"
    />
  </MapCon>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import type {Ref} from 'vue'
const positionList:Ref<number[][]> = ref([
  [116.400476,39.899306],
  [116.411226,39.899306],
  [116.411226,39.893075],
  [116.400476,39.893075],
  [116.400476,39.899306],
])
const p:Ref<number[]> = ref([116.40531, 39.896884]);
const taskStatus = ref('');
const animateFun = (data:any) => {
  p.value = data;
}
</script>
<style lang="less">
.gy-button{
  margin-right: 20px;
  margin-bottom: 20px;
}
</style>
