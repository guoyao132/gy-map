<template></template>
<script lang="ts">
import {defineComponent, onMounted, onBeforeUnmount, getCurrentInstance} from 'vue-demi'
import type {defineComponent as defineComponentOption} from 'vue-demi'
import CreateHeatMapLayer, {layerProps} from "../../../hooks/createLayer/CreateHeatMapLayer";
export default defineComponent({
  name: 'GymapHeat',
  props: {
    ...layerProps,
  },
  setup(props){
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
  }
} as defineComponentOption)


</script>
