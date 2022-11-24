<template></template>
<script setup lang="ts">
import {onMounted, onBeforeUnmount, getCurrentInstance} from 'vue'
import CreateCircleLayer ,{layerProps} from "../../../hooks/createLayer/CreateCircleLayer";
const props = defineProps({
  ...layerProps,
})
const {proxy} = getCurrentInstance();
const mapId:string = proxy.$parent.id;
let layerObj:CreateCircleLayer = null;
onMounted(() => {
  layerObj = new CreateCircleLayer(mapId, props.position, props);

  const runTask = proxy.$parent.runTask;
  if(runTask){
    runTask(layerObj, props)
  }
})
const destory = () => {
  layerObj?.destory();
  layerObj = null
}
onBeforeUnmount(() => {
  destory();
  const destoryTask = proxy.$parent.destory;
  if(destoryTask){
    destoryTask()
  }
})


</script>

