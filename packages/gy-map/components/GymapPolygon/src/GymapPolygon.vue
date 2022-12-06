<script lang="ts">
import {Fill, Stroke, Style} from 'ol/style';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import {defineComponent, onMounted, ref, watch, onBeforeUnmount, computed, getCurrentInstance} from 'vue-demi'
import {gyMap} from "../../../index";
import gyMapUtils from '../../../hooks/gyMapUtils'
import type {Ref, PropType, UnwrapRef, defineComponent as defineComponentOption} from 'vue-demi'
import type {gyMapType, MapOptType} from '../../../index'
export default defineComponent({
  name: 'GymapPolygon',
  props: {
    //位置
    positionList: {
      type: Array as PropType<number[][] | Array<number[][]>>,
      default: () => ([])
    },
    className: {
      type: String,
    },
    fillColor: {
      type: String,
      default: 'rgba(0, 0, 255, 0.1)',
    },
    strokeColor: {
      type: String,
      default: '',
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
  },
  setup(props){
    const {proxy} = getCurrentInstance();
    const mapId:string = proxy.$parent.id;
    const gyMapObj:Ref<UnwrapRef<gyMapType>> = gyMap(mapId);
    const mapFinish:Ref<boolean> = computed(() => gyMapObj.value && gyMapObj.value.mapFinish);
    let polygonLayer:any = null;
    let isDraw:boolean = false;
    watch(mapFinish, () => {
      drawPolygon()
    })
    onMounted(() => {
      drawPolygon()
    })
    const getFeatures = () => {
      let positionList = props.positionList;
      let firstValue = positionList[0];
      let lonlatArr = [];
      if(firstValue && !Array.isArray(firstValue[0])){
        lonlatArr = [positionList]
      }else{
        lonlatArr = positionList;
      }
      let features = lonlatArr.map(v => {
        let coordinates = v.map(v => {
          return gyMapUtils.formatLonLatToPosition(v);
        })
        return {
          'type': 'Feature',
          'geometry': {
            'type': 'Polygon',
            'coordinates': [
              coordinates
            ],
          },
        }
      });
      return features;
    }
    const getSource = () => {
      const features = getFeatures();
      if(!features){
        return;
      }
      const geojsonObject = {
        'type': 'FeatureCollection',
        'crs': {
          'type': 'name',
          'properties': {
            'name': 'EPSG:3857',
          },
        },
        'features':features
      };
      const source = new VectorSource({
        features: new GeoJSON().readFeatures(geojsonObject),
      });
      return source;
    }
    const getStyle = () => {
      return new Style({
        stroke: props.strokeColor ? new Stroke({
          color: props.strokeColor,
          width: props.strokeWidth,
        }) : null,
        fill: props.fillColor  ? new Fill({
          color: props.fillColor,
        }) : null,
      });
    }
    const drawPolygon = () => {
      if(!mapFinish.value || isDraw){
        return;
      }
      isDraw = true;
      const source = getSource();
      if(!source){
        return;
      }
      const stylePol = getStyle();
      polygonLayer = new VectorLayer({
        source: source,
        style: [stylePol],
        minZoom: props.minZoom,
        maxZoom: props.maxZoom,
        opacity: props.opacity,
      });
      gyMapObj.value.map.addLayer(polygonLayer);
    }
    watch(() => props.positionList, () => {
      const source = getSource();
      if(!source){
        return;
      }
      polygonLayer && polygonLayer.setSource(source);
    }, {
      deep: true
    })
    watch([() => props.strokeColor, () => props.strokeWidth, () => props.fillColor], () => {
      const stylePol = getStyle();
      polygonLayer && polygonLayer.setStyle(stylePol);
    })
    watch(() => props.opacity, n => {
      polygonLayer && polygonLayer.setOpacity(n);
    })
    watch(() => props.minZoom, n => {
      polygonLayer && polygonLayer.setMinZoom(n);
    })
    watch(() => props.maxZoom, n => {
      polygonLayer && polygonLayer.setMaxZoom(n);
    })
    const destory = () => {
      if(polygonLayer){
        gyMapObj.value && gyMapObj.value.map.removeLayer(polygonLayer)
        polygonLayer = null;
      }
    }
    onBeforeUnmount(() => {
      destory()
    })
  }
} as defineComponentOption)
</script>
<template></template>
