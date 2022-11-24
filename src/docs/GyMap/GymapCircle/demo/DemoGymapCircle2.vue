<template>
  <MapCon id="map2">
    <GymapCircle
      fillColor="red"
      :position="[116.40531, 39.896884]"
      :radius="100"
      :opacity="0.5"
      :strokeWidth="10"
      strokeColor="yellow"
    />
  </MapCon>
</template>
<script setup lang="ts">
import MapCon from '@/components/MapCon.vue'
</script>
