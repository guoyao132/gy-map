<script lang="ts">
import {Icon, Stroke, Style} from 'ol/style';
import LineString from 'ol/geom/LineString';
import Feature from 'ol/Feature';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import {onMounted, watch, onBeforeUnmount, computed, getCurrentInstance, defineComponent} from 'vue-demi'
import type {Ref, PropType, UnwrapRef, defineComponent as defineComponentOption} from 'vue-demi'
import {gyMap} from "../../../index";
import type {gyMapType, MapOptType} from '../../../index'
import gyMapUtils from '../../../hooks/gyMapUtils'
import Point from 'ol/geom/Point';
import arrowIcon from '../../../assets/img/arrow.png'
export default defineComponent({
  name: 'GymapLine',
  props: {
//位置
    positionList: {
      type: Array as PropType<number[][]>,
      default: () => ([])
    },
    strokeColor: {
      type: String,
      default: 'blue',
    },
    strokeWidth: {
      type: Number,
      default: 3,
    },
    minZoom: {
      type: Number,
      default: 1,
    },
    maxZoom: {
      type: Number,
      default: 18,
    },
    opacity: {
      type: Number,
      default: 1,
    },
    arrow: {
      type: [Boolean, String],
      default: false,
    },
    arrowAnchor: {
      type: Array as PropType<number[]>,
      default: () => ([0.75, 0.5])
    },
    animate: {
      type: Boolean,
      default: false,
    },
    step: {
      type: Number,
      default: 0.001,
    },
    loop: {
      type: Boolean,
      default: false,
    },
    arrowStep: {
      type: Number,
      default: 20
    },
  },
  setup(props){
    const {proxy} = getCurrentInstance();
    const mapId:string = proxy.$parent.id;
    const gyMapObj:Ref<UnwrapRef<gyMapType>> = gyMap(mapId);
    const mapFinish = computed(() => gyMapObj.value && gyMapObj.value.mapFinish);
    let lineLayer:any = null;
    let lineFeatures:any = null;
    let isDraw:boolean = false;
    let style:any = null;
    let lineAllGeometry:any = null;
    let lineGeometry:any = null;
    let animCoordinates:number[][] = [];
    let allAnimCoordinates:number[][] = [];
    let aId:any = null;
    let lineIndex:number = 0;
    let lineFeature:any = null;
    watch(mapFinish, () => {
      drawLine()
    })
    onMounted(() => {
      drawLine()
    })
    const getCoordinates = (positionList) => {
      let coordinates = positionList.map(v => {
        return gyMapUtils.formatLonLatToPosition(v);
      });
      return new LineString(coordinates);
    }
    const getFeatures = () => {
      let positionList = props.positionList;
      if(props.animate){
        positionList = []
      }
      lineGeometry = getCoordinates(positionList);
      lineFeature = new Feature({
        type: 'lineStyle',
        geometry: lineGeometry
      });
      return lineFeature;
    }
    const getSource = () => {
      lineFeatures = getFeatures();
      lineFeatures.setStyle(style)
      if (!lineFeatures) {
        return;
      }
      return new VectorSource({
        features: [lineFeatures],
      });;
    }
    const styleFunction = function (feature) {
      const geometry = feature.getGeometry();
      const styles = [
        // linestring
        new Style({
          stroke: new Stroke({
            color: props.strokeColor,
            width: props.strokeWidth,
          }),
        }),
      ];

      if(props.arrow){
        let i = 0;
        let step = props.step;
        step = Math.min(step, 0.01)
        geometry.forEachSegment(function (start, end) {
          const dx = end[0] - start[0];
          const dy = end[1] - start[1];
          const rotation = Math.atan2(dy, dx);
          // arrows
          i++;
          let arrowStep = Math.min(props.arrowStep, 1/step);
          if(!props.animate || (i % (1/step / arrowStep) == 0)){
            let icon = null;
            if(typeof props.arrow === 'boolean'){
              icon = arrowIcon
            }else{
              icon =  props.arrow;
            }
            styles.push(
              new Style({
                geometry: new Point(end),
                image: new Icon({
                  src: icon,
                  anchor: props.arrowAnchor,
                  rotateWithView: true,
                  rotation: -rotation,
                }),
              })
            );
          }
        });
      }
      return styles;
    };
    const drawLine = () => {
      if (!mapFinish.value || isDraw) {
        return;
      }
      isDraw = true;
      style = styleFunction;
      clearTimer();
      const source = getSource();
      if(!source){
        return;
      }
      lineLayer = new VectorLayer({
        source: source,
        minZoom: props.minZoom,
        maxZoom: props.maxZoom,
        opacity: props.opacity,
      });
      gyMapObj.value.map.addLayer(lineLayer);
      if(props.animate){
        lineAllGeometry = getCoordinates(props.positionList);
        animate()
        // let i = 0;
        // allAnimCoordinates.push(lineAllGeometry.getCoordinateAt(0));
        // while (i != 1){
        //   i+=0.005
        //   i = Math.min(i, 1);
        //   allAnimCoordinates.push(lineAllGeometry.getCoordinateAt(i));
        // }
        // animate2()
      }
    }
    let timer:NodeJS.Timer | null = null;
    const animate2 = () => {
      clearTimer();
      lineIndex = 0;
      animCoordinates.push(allAnimCoordinates[lineIndex]);
      timer = setInterval(() => {
        lineIndex+=1;
        if(lineIndex >= allAnimCoordinates.length){
          clearTimer()
        }else {
          animCoordinates.push(allAnimCoordinates[lineIndex]);
          updateLine();
          // animCoordinates.push(...allAnimCoordinates.slice(lineIndex, lineIndex + 10));
          // updateLine();
        }
      }, 3000 / allAnimCoordinates.length)
    }
    const animate = () => {
      animCoordinates.push(lineAllGeometry.getCoordinateAt(Math.min(lineIndex, 1)));
      updateLine();
      if(lineIndex > 1){
        clearTimer();
        if(props.loop){
          animCoordinates = [];
          lineIndex = 0;
          animate();
        }
        return
      }
      let step = props.step;
      step = Math.min(step, 0.01)
      lineIndex += step;
      aId = window.requestAnimationFrame(animate)

    }
    const updateLine = () => {
      let line = null;
      if(props.animate){
        line = new LineString(animCoordinates);
      }else{
        line = getCoordinates(props.positionList);
      }
      lineFeature && lineFeature.setGeometry(line);
    }
    const destory = () => {
      if(lineLayer){
        gyMapObj.value && gyMapObj.value.map.removeLayer(lineLayer)
        lineLayer = null;
      }
      clearTimer();
    }
    const clearTimer = () => {
      aId && window.cancelAnimationFrame(aId)
      // if(timer){
      //   clearInterval(timer)
      //   timer = null;
      // }
    }
    watch(() => props.positionList, n => {
      updateLine();
    })
    watch(() => props.opacity, n => {
      lineLayer && lineLayer.setOpacity(n);
    })
    watch(() => props.animate, n => {
      isDraw = false;
      destory();
      drawLine()
    })
    watch(() => props.minZoom, n => {
      lineLayer && lineLayer.setMinZoom(n);
    })
    watch(() => props.maxZoom, n => {
      lineLayer && lineLayer.setMaxZoom(n);
    })
    watch([() => props.strokeColor, () => props.strokeColor, () => props.arrow], () => {
      style = styleFunction;
      lineFeatures && lineFeatures.setStyle(style)
    })
    onBeforeUnmount(() => {
      destory();
    })
  }
} as defineComponentOption)
</script>
<template></template>
