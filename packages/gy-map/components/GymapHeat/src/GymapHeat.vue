<template></template>

<script setup lang="ts">
import {onMounted, onBeforeUnmount, getCurrentInstance} from 'vue'
import CreateHeatMapLayer ,{layerProps} from "../../../hooks/createLayer/CreateHeatMapLayer";
const props = defineProps({
  ...layerProps,
})
const {proxy} = getCurrentInstance();
const mapId:string = proxy.$parent.id;
let layerObj:CreateHeatMapLayer = null;
onMounted(() => {
  layerObj = new CreateHeatMapLayer(mapId, props.position, props);
  console.log(layerObj);
})
const destory = () => {
  layerObj.destory();
  layerObj = null;
}
onBeforeUnmount(() => {
  destory();
})

</script>
