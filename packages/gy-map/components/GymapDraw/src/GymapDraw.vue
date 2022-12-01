<template>
  <div class="draw-btns-list" v-show="mapFinish" ref="drawCon">
    <div class="draw-start draw-btn" v-show="!status || status === 'end'" @click="startDraw">开始绘制</div>
    <div class="draw-type draw-btn draw-type-select" v-show="status && status !== 'end'">
      绘制类型
      <div class="draw-type-select-con">
        <div v-for="(item, index) in drawTypeList" :key="'type' + index" :class="['draw-type-option', {'active': drawType === item}]"
             @click="changeDrawType(item)">
          {{ drawTypeCnameList[index] || '待定' }}
        </div>
      </div>
    </div>
    <div class="draw-end draw-btn" v-show="status && status !== 'end'" @click="endDraw(true)">绘制完成</div>
    <div :class="['draw-end', 'draw-btn', {'active': status === 'delete'}]"
         v-show="hasFeature && (status && status !== 'end')" @click="deleteDraw">删除图形
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, onMounted, onBeforeUnmount, computed, getCurrentInstance} from 'vue-demi'
import type {Ref, PropType, UnwrapRef, ComputedRef, defineComponent as defineComponentOption} from 'vue-demo'
import {gyMap} from "../../../index";
import {Draw, Snap, Modify} from 'ol/interaction'
import {Vector as VectorSource} from 'ol/source'
import {Vector as LayerVector} from 'ol/layer'
import {altKeyOnly, singleClick} from 'ol/events/condition'
import {toLonLat} from 'ol/proj'
import type SourceType from 'ol/source'
import type LayerType from 'ol/layer'
import type {Type as DrawType} from 'ol/geom/Geometry'
import type {Geometry, Circle} from 'ol/geom'
import type interactionType from 'ol/interaction';
import type MapBrowserEvent from 'ol/MapBrowserEvent';
import type {Feature} from 'ol';
import type {gyMapType, MapOptType} from '../../../index'
export default defineComponent({
  name: 'GymapDraw',
  props: {
    canInsertVertexCondition: {
      type: Boolean,
      default: true
    },
    drawTypeList: {
      type: Array as PropType<DrawType[]>,
      default: () => {
        return [
          'Point',
          'LineString',
          'Circle',
          'Polygon',
        ]
      }
    },
    drawTypeCnameList: {
      type: Array,
      default: () => {
        return [
          '点',
          '线',
          '圆',
          '多边形',
        ]
      }
    },
    btnBackground: {
      type: String,
      default: 'rgb(102, 102, 102)',
    },
    btnColor: {
      type: String,
      default: '#fff',
    },
    btnActiveBackground: {
      type: String,
      default: 'rgb(142, 142, 142)',
    },
    btnActiveColor: {
      type: String,
      default: '#fff',
    },
    deleteActiveBackground: {
      type: String,
      default: 'rgb(28 137 189)',
    },
    deleteActiveColor: {
      type: String,
      default: '#fff',
    },
    fillColor: {
      type: String,
      default: 'rgba(255, 255, 255, 0.2)',
    },
    strokeColor: {
      type: String,
      default: '#ffcc33',
    },
    strokeWidth: {
      type: Number,
      default: 3,
    },
    pointRadius: {
      type: Number,
      default: 7,
    },
  },
  emits: ['drawFinish'],
  setup(props, {emits}){
    const drawCon: Ref<HTMLElement | null> = ref(null);
    const {proxy} = getCurrentInstance();
    const mapId: string = proxy.$parent.id;
    const gyMapObj: Ref<UnwrapRef<gyMapType>> = gyMap(mapId);
    const mapFinish: ComputedRef<boolean> = computed(() => gyMapObj.value && gyMapObj.value.mapFinish);
    let drawObj: interactionType.Draw = null;
    let snapObj: interactionType.Snap = null;
    let modify: interactionType.Modify = null;
    let source: Ref<SourceType.Vector> = ref(null);
    let layer: LayerType.Vector<SourceType.Vector> = null;
    let isInit: boolean = false;
    let drawType: Ref<DrawType> = ref('Point' as DrawType);
    const status: Ref<string> = ref('');
    const hasFeature: ComputedRef<boolean> = computed(() => source.value && source.value.getFeatures().length != 0);
    const startDraw = () => {
      if (status.value === 'start') {
        return;
      }
      status.value = 'start';
      if (!source.value) {
        source.value = new VectorSource()
      }
      if (!isInit) {
        isInit = true;
        layer = new LayerVector({
          source: source.value,
          style: {
            'fill-color': props.fillColor,
            'stroke-color': props.strokeColor,
            'stroke-width': props.strokeWidth,
            'circle-radius': props.pointRadius,
            'circle-fill-color': props.strokeColor,
          },
        })
        gyMapObj.value.map.addLayer(layer);
        gyMapObj.value.map.on('singleclick', (e: any) => {
          if (status.value === 'delete' && singleClick(e)) {
            gyMapObj.value.map.forEachFeatureAtPixel(e.pixel, (feature: Feature): boolean => {
              layer.getSource().removeFeature(feature);
              if(!hasFeature.value){
                startDraw();
              }
              return true
            }, {
              hitTolerance: 0
            })
          }
        })
      }
      drawObj = new Draw({
        source: source.value,
        type: drawType.value,
      })
      snapObj = new Snap({
        source: source.value
      })
      modify = new Modify({
        source: source.value,
        deleteCondition: (e: MapBrowserEvent): boolean => {
          return altKeyOnly(e) && singleClick(e)
        },
        insertVertexCondition: (e: MapBrowserEvent<any>): boolean => {
          return props.canInsertVertexCondition;
        },
        snapToPointer: false,
      });
      gyMapObj.value.map.addInteraction(modify);
      gyMapObj.value.map.addInteraction(drawObj);
      gyMapObj.value.map.addInteraction(snapObj);
    }
    const deleteDraw = () => {
      if (status.value === 'start') {
        endDraw();
      }
      status.value = 'delete';
    }
    const changeDrawType = (type: DrawType) => {
      drawType.value = type;
      if (status.value !== 'end') {
        endDraw();
        startDraw();
      }
    }
    const endDraw = (finish?: boolean) => {
      if (status.value !== 'end') {
        status.value = 'end';
        destory();
        finish && submitData();
        // aaa.getFeatures()[0].getGeometry().getCoordinates()

      }
    }
    const submitData = () => {
      const features = source.value.getFeatures();
      let data = [];
      features.forEach((feature: Feature) => {
        let geometry: Geometry = feature.getGeometry();
        let type = geometry.getType();
        let coordinates = geometry.getCoordinates();
        switch (type) {
          case 'Circle':
            coordinates = [(geometry as Circle).getCenter()];
            break;
          case 'Point':
            coordinates = [coordinates];
            break;
          case 'Polygon':
            coordinates = coordinates[0];
            break;
        }
        let lonlats = [];
        coordinates.forEach(coordinate => {
          lonlats.push(toLonLat(coordinate));
        })

        let obj = {
          coordinates: lonlats,
          type,
        };
        if (type === 'Circle') {
          let radius = (geometry as Circle).getRadius();
          obj.radius = radius;
        }
        data.push(obj);
      })
      emits('drawFinish', data);
    }
    const destory = () => {
      gyMapObj.value.map.removeInteraction(modify);
      gyMapObj.value.map.removeInteraction(drawObj);
      gyMapObj.value.map.removeInteraction(snapObj);
    }
    onMounted(() => {
      drawCon.value.style.setProperty('--btnBackground', props.btnBackground);
      drawCon.value.style.setProperty('--btnColor', props.btnColor);
      drawCon.value.style.setProperty('--deleteActiveBackground', props.deleteActiveBackground);
      drawCon.value.style.setProperty('--deleteActiveColor', props.deleteActiveColor);
      drawCon.value.style.setProperty('--btnActiveBackground', props.btnActiveBackground);
      drawCon.value.style.setProperty('--btnActiveColor', props.btnActiveColor);
    })
    onBeforeUnmount(() => {
      destory();
    })
    return {
      status,
      gyMapObj,
      mapFinish,
      hasFeature,
      startDraw,
      deleteDraw,
      changeDrawType,
      endDraw,
      submitData,
      destory,
    }
  }
} as defineComponentOption)

</script>

<style lang='less' scoped>
.draw-btns-list {
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 2;
  color: #fff;
  display: flex;
  --btnBackground: rgb(102, 102, 102);
  --btnColor: #fff;
  --btnActiveBackground: rgb(142, 142, 142);
  --btnActiveColor: #fff;
  --deleteActiveBackground: rgb(28 137 189);
  --deleteActiveColor: #fff;
}

.draw-btn {
  background: var(--btnBackground);
  color: var(--btnColor);
  font-size: 0.8rem;
  padding: 3px 5px;
  margin-right: 1rem;
  border-radius: 5px;

  &.active {
    background: var(--deleteActiveBackground);
    color: var(--deleteActiveColor);
  }
}

.draw-type-select {
  position: relative;

  &:hover {
    .draw-type-select-con {
      height: 92px;
      padding: 6px 0 10px;
    }
  }
}

.draw-type-select-con {
  position: absolute;
  left: 0;
  top: 80%;
  background: var(--btnBackground);
  width: 100%;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  box-sizing: border-box;
  height: 0;
  overflow: hidden;
  transition: all .3s linear;

  .draw-type-option{
    padding: 0 5px;
  }

  .active{
    background: var(--btnActiveBackground);
    color: var(--btnActiveColor);
  }
}

</style>
