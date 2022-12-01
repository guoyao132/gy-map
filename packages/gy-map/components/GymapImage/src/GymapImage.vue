<template>
  <slot></slot>
</template>
<script lang="ts">
import {defineComponent, onMounted, onBeforeUnmount, getCurrentInstance} from 'vue-demi'
import type {defineComponent as defineComponentOption} from 'vue-demi'
import CreateImageLayer ,{layerProps} from "../../../hooks/createLayer/CreateImageLayer";
export default defineComponent({
  props: {
    ...layerProps,
  },
  setup(props){
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
  }
} as defineComponentOption)


</script>
