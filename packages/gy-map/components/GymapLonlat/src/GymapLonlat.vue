<template>
  <div v-show="showCon" :class="['GySjmapLonlat-con', className]">
    {{ lonlat }}
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  onMounted,
  onBeforeUnmount,
  getCurrentInstance,
  watch,
  computed,
  ref,
} from 'vue-demi'
import type {
  Ref,
  UnwrapRef,
} from 'vue-demi'
import type {defineComponent as defineComponentOption} from 'vue-demi'
import {gyMap} from "../../../index";
import {toLonLat} from 'ol/proj'
import type {gyMapType} from '../../../index'
export default defineComponent({
  name: 'GymapLonlat',
  props: {
    showCon: {
      type: Boolean,
      default: true,
    },
    className: {
      type: String,
      default: '',
    },
  },
  emits: ['getLonlat'],
  setup(props, {emit}){
    const {proxy} = getCurrentInstance();
    const mapId:string = proxy.$parent.id;
    const gyMapObj:Ref<UnwrapRef<gyMapType>> | null = gyMap(mapId);
    const mapFinish:Ref<boolean> = computed(() => gyMapObj.value && gyMapObj.value.mapFinish);
    let isOn:boolean = false;
    const lonlat:Ref<string> = ref('')
    const getLonLat = (e) => {
      let coordinate = e.coordinate;
      let l = toLonLat(coordinate)
      lonlat.value = l.join(',');
      emit('getLonlat', lonlat.value);
    }
    const addEvent = () => {
      if(mapFinish.value && !isOn){
        gyMapObj.value.map.on('click', getLonLat)
      }
    }
    watch(mapFinish, () => {
      addEvent();
    })
    onMounted(() => {
      addEvent();
    })
    const destory = () => {
      gyMapObj.value.map && gyMapObj.value.map.un('click', getLonLat)
    }
    onBeforeUnmount(() => {
      destory();
    })
    return {
      className: props.className,
      lonlat
    }
  }
} as defineComponentOption)
</script>
<style lang="less" scoped>
.GySjmapLonlat-con{
  position: absolute;
  bottom: 10px;
  right: 10px;
  z-index: 1;
  color: #fff;
}
</style>
