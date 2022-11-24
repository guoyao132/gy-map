<template></template>
<script setup lang="ts">
import {onMounted, onBeforeUnmount, getCurrentInstance} from 'vue'
import CreateTextLayer ,{layerProps} from "../../../hooks/createLayer/CreateTextLayer";
const props = defineProps({
  ...layerProps,
})
const {proxy} = getCurrentInstance();
const mapId:string = proxy.$parent.id;
let layerObj:CreateTextLayer = null;
onMounted(() => {
  layerObj = new CreateTextLayer(mapId, props.position, props);

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
