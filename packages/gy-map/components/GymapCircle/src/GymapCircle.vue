<template></template>
<script lang="ts">
import {defineComponent,onMounted, onBeforeUnmount, getCurrentInstance} from 'vue-demi'
import CreateCircleLayer ,{layerProps} from "../../../hooks/createLayer/CreateCircleLayer";
import type {defineComponent as defineComponentOption} from 'vue-demi'

export default defineComponent({
  name: 'GymapCircle',
  props: {
    ...layerProps,
  },
  setup(props){
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
  }
} as defineComponentOption)
</script>

