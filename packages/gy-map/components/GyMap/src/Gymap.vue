<template>
  <div
    :id="id"
    class="map divMap"
    tabindex="0"
    @mouseenter="mouseenterFun">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, watch, onBeforeUnmount} from 'vue-demi'
import type {PropType, UnwrapRef, defineComponent as defineComponentOption} from 'vue-demi'
import {gyMap} from "../../../index.ts";
import type {gyMapType, MapOptType} from '../../../index'

export default defineComponent({
  name: 'Gymap',
  props: {
    mapOpt: {
      type: Object as PropType<MapOptType>,
      default: () => ({})
    },
    center: {
      type: Array as PropType<number[][]>,
      default: () => ([])
    },
    maplayerIndex: {
      type: Number,
      default: 0,
    },
    zoom: {
      type: Number,
      default: 0,
    },
    layerOpacity: {
      type: Number,
      default: 1,
    },
    id: {
      type: String,
      default: 'map',
    },
  },
  setup(props) {
    const gyMapObj: UnwrapRef<gyMapType> | null = gyMap(props.id).value;
    onMounted(() => {
      gyMapObj.init(props.id, {
        ...props.mapOpt,
        maplayerIndex: props.maplayerIndex,
        zoom: props.zoom,
        centerPoint: props.center,
        layerOpacity: props.layerOpacity,
      })
    })
    const mouseenterFun = () => {
      const contentIdDom: HTMLElement | null = document.getElementById(props.id);
      if (contentIdDom) {
        contentIdDom.focus();
      }
    }
    watch(() => props.zoom, n => {
      gyMapObj && gyMapObj.zoomSetFun(n);
    })
    watch(() => props.maplayerIndex, n => {
      gyMapObj && gyMapObj.changeMapLayer(n);
    })
    watch(() => props.center, n => {
      gyMapObj && gyMapObj.changeCenterPoint(n);
    })
    watch(() => props.layerOpacity, n => {
      gyMapObj && gyMapObj.setLayerOpacity(n);
    })
    onBeforeUnmount(() => {
      gyMapObj && gyMapObj.destory();
    })

    return {
      id: props.id,
      gyMapObj,
      mouseenterFun
    }
  }
} as defineComponentOption)
</script>

<style lang='less' scoped>
.divMap {
  position: relative;
  width: 100%;
  height: 100%;
  outline: none;
}

</style>
