<template>
  <slot></slot>
</template>
<script setup lang="ts">
import {onMounted, onBeforeUnmount, getCurrentInstance} from 'vue'
import CreateImageLayer ,{layerProps} from "../../../hooks/createLayer/CreateImageLayer";
const props = defineProps({
  ...layerProps,
})
const {proxy} = getCurrentInstance();
const mapId:string = proxy.$parent.id;
let layerObj:CreateImageLayer = null;
onMounted(() => {
  layerObj = new CreateImageLayer(mapId, props.position, props);

  const runTask = proxy.$parent.runTask;
  if(runTask){
    runTask(layerObj, props)
  }
})
const destory = () => {
  layerObj.destory();
  layerObj = null;
}
onBeforeUnmount(() => {
  destory();
  const destoryTask = proxy.$parent.destory;
  if(destoryTask){
    destoryTask()
  }
})


</script>
