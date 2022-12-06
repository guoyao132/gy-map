<template>
  <div>
    <slot></slot>
  </div>
</template>
<script lang="ts">
import {defineComponent, onMounted, watch, onBeforeMount,onBeforeUnmount, computed, getCurrentInstance} from 'vue-demi'
import type {Ref, PropType, defineComponent as defineComponentOption} from 'vue-demi'
import gyMapUtils from "../../../hooks/gyMapUtils";
import LineString from "ol/geom/LineString";
import {toLonLat} from 'ol/proj'
import type {LineString as linestringType} from "ol/geom";
type TaskStatus = 'play' | 'stop' | 'pause' | '';
type AnimateDataType = 'COORDINATE' | 'LONLAT';
export default defineComponent({
  name: 'GymapTask',
  props: {
    positionList: {
      type: Array as PropType<number[][]>,
      default: () => ([]),
    },
    loop: {
      type: Boolean,
      default: false
    },
    step: {
      type: Number,
      default: 0.001,
    },
    taskStatus: {
      type: String as PropType<TaskStatus>,
      default: 'play',
    },
    delay: {
      type: Number,
      default: 3000,
    },
    animateDataType: {
      type: String as PropType<AnimateDataType>,
      default: 'LONLAT',
    }
  },
  emits: ['animate'],
  setup(props, {emit}){
    const {proxy} = getCurrentInstance();
    const mapId:string = proxy.$parent.id;
    let canPlay = true;
    let noComponents = false;
    let childrenWatch = null;
    let layer = null;
    let timer:Number | undefined = undefined;
    const runTask = (childLayerObj?:any, childProps?:any) => {
      if(!canPlay){
        return
      }
      if(!noComponents){
        if(!childrenWatch){
          childrenWatch = watch(() => childProps.position, () => {
            animIndex = 0;
            destory();
          })
        }
        layer = childLayerObj;
      }
      if(props.taskStatus === 'play'){
        startTask();
      }
      if(props.delay !== 0){
        timer = setTimeout(() => {
          startTask();
        }, props.delay)
      }
    }
    watch(() => props.taskStatus, (n:TaskStatus) => {
      if(n === 'play'){
        startTask();
      }else if(n === 'stop'){
        animIndex = 0;
        stopTask();
      }else if(n === 'pause'){
        stopTask();
      }
    })
    const getAllCoordinates = (positions:number[][]):linestringType => {
      let coordinates = positions.map(v => {
        return gyMapUtils.formatLonLatToPosition(v);
      });
      let linestring = new LineString(coordinates);
      return linestring;
    }
    let lineGeometry:linestringType = null;
    const startTask = () => {
      if(timer){
        clearTimeout(timer);
        timer = null;
      }
      if(noComponents ? false : !layer){
        return;
      }
      if(aId){
        return;
      }
      if(!lineGeometry){
        lineGeometry = getAllCoordinates(props.positionList);
      }
      animate();
    }
    let animIndex = 0;
    let aId = null;
    const animate = () => {
      let coordinate = lineGeometry.getCoordinateAt(Math.min(animIndex, 1));
      if(!noComponents) {
        if(layer.geometry){
          layer.geometry.setCoordinates(coordinate)
        }else{
          layer.setPosition(coordinate)
        }
      }
      if(props.animateDataType === 'LONLAT'){
        coordinate = toLonLat(coordinate);
      }
      emit('animate', coordinate, animIndex);
      if(animIndex > 1){
        stopTask();
        if(props.loop){
          animIndex = 0;
          animate();
        }
        return
      }
      let step = props.step;
      animIndex = gyMapUtils.flortAdd(animIndex, step);
      aId = window.requestAnimationFrame(animate)
    }
    const stopTask = () => {
      childrenWatch && childrenWatch();
      aId && window.cancelAnimationFrame(aId)
      aId = null;
    }
    const destory = () => {
      if(timer){
        clearTimeout(timer);
        timer = null;
      }
      stopTask();
    }
    onBeforeMount(() => {
      let defaultStr = proxy.$slots.default;
      if(defaultStr){
        let children = proxy.$slots.default();
        let len = 0;
        for(let i = 0; i < children.length; i++){
          let child = children[i];
          if(typeof child.type !== 'symbol'){
            len++;
            if(len > 1){
              canPlay = false;
              console.error('GymapTask组件中只允许存在一个需要执行动画的组件。');
              break;
            }
          }
        }
      }else if(!defaultStr){
        noComponents = true;
        runTask();
      }
    })
    onMounted(() => {
      if(noComponents){
        runTask();
      }
    })
    return {
      id: mapId,
      runTask: runTask,
      destory: destory,
    }
  }
} as defineComponentOption)
</script>
