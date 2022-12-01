<template>
  <div class="GymapHtml" ref="htmlDom">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref, watch, onBeforeUnmount, computed, getCurrentInstance} from 'vue-demi'
import type {Ref, PropType, UnwrapRef, defineComponent as defineComponentOption} from 'vue-demi'
import {gyMap} from "../../../index";
import gyMapUtils from '../../../hooks/gyMapUtils'
import type {gyMapType, MapOptType} from '../../../index'
export default defineComponent({
  name: 'GymapHtml',
  props: {
    //偏移量
    offset: {
      type: Array as PropType<number[]>,
      default: () => ([0, 0])
    },
    //位置
    position: {
      type: Array as PropType<number[]>,
      default: () => ([])
    },
    //是否阻止鼠标穿透
    stopEvent: {
      type: Boolean,
      default: true,
    },
    className: {
      type: String,
      default: '',
    },
  },
  setup(props){
    const htmlDom:Ref<HTMLElement | null> = ref(null)
    const {proxy} = getCurrentInstance();
    console.log(proxy.$parent);
    const mapId:string = proxy.$parent.id;
    const gyMapObj:UnwrapRef<gyMapType> | null = gyMap(mapId).value;
    const mapFinish:Ref<boolean> = computed(() => gyMapObj && gyMapObj.mapFinish);
    let isDraw:boolean = false;
    watch(mapFinish, () => {
      drawDom()
    })
    let overlay:any = null;
    const drawDom = () => {
      if(mapFinish.value && !isDraw){
        isDraw = true;
        overlay = gyMapObj.drawHtmlToMap(htmlDom.value, {
          offset: props.offset,
          position: props.position,
          stopEvent: props.stopEvent,
          className: props.className,
        })

        const runTask = proxy.$parent.runTask;
        if(runTask){
          runTask(overlay, props)
        }
      }
    }
    onMounted(() => {
      console.log(htmlDom.value);
      drawDom()
    })
    watch(() => props.position, p => {
      let pos = gyMapUtils.formatLonLatToPosition(p)
      overlay && overlay.setPosition(pos)
    })
    watch(() => props.offset, p => {
      overlay && overlay.setOffset(p)
    })
    onBeforeUnmount(() => {
      overlay && gyMapObj && gyMapObj.removeOverlay(overlay)

      const destoryTask = proxy.$parent.destory;
      if(destoryTask){
        destoryTask()
      }
    })

    return {
      htmlDom,
      mapId,
      gyMapObj,
      mapFinish,
    }
  }
} as defineComponentOption)
</script>
