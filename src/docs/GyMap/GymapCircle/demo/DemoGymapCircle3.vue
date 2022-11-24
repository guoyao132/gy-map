<template>
  <MapCon id="map3">
    <GymapCircle
      fillColor="red"
      :position="[116.40131, 39.896884]"
      :radius="100"
      :scale="[1, 0.5]"
    />
    <GymapCircle
      fillColor="red"
      :position="[116.40931, 39.896884]"
      :radius="100"
      :scale="[1, 0.5]"
      :rotation="Math.PI / 2"
    />
  </MapCon>
</template>

<script setup lang="ts">
import MapCon from '@/components/MapCon.vue'
</script>
