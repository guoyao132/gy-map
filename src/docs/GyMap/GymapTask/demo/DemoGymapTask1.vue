<template>
  <MapCon>
    <GymapTask
      :loop="true"
      :positionList="positionList"
    >
      <Gymap-html
        :position="[116.40531, 39.896884]">
        <div class="con"></div>
      </Gymap-html>
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

</script>
<style lang="less">
.con{
  width: 100px;
  height: 100px;
  background: #fff;
}
</style>
