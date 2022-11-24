<template>
  <div class="gy-map-con">
    <Gymap
      id="map2"
      :mapOpt="mapOpt"
      :zoom="zoom"
      :center="center"
      :layerOpacity="layerOpacity"
    ></Gymap>
  </div>
</template>

<script setup lang="ts">
  import {ref, reactive} from "vue"
  const mapOpt = reactive({})
  let center = ref([116.40531, 39.896884]);
  const zoom = ref(16);
  const layerOpacity = ref(1);
</script>
