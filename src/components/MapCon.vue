<template>
  <div class="gy-map-con">
    <Gymap
      :id="id"
      :mapOpt="mapOpt"
      :zoom="zoom"
      :center="center"
      :layerOpacity="layerOpacity"
    >
      <slot></slot>
    </Gymap>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive} from "vue"
const mapOpt = reactive({
  // extent: [
  //   [116.519955,39.98711],
  //   [116.221951,39.839643],
  // ]
})
let center = ref([116.40531, 39.896884]);
const zoom = ref(15);
const layerOpacity = ref(1);
defineProps({
  id: {
    type: String,
    default: 'map'
  }
})
</script>
