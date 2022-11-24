<template>
  <MapCon id="map4">
    <GymapCircle
      fillColor="red"
      :position="[116.40131, 39.896884]"
      :radius="1000"
      :scale="[1, 0.5]"
      :isAuto="true"
    />
  </MapCon>
</template>

<script setup lang="ts">
import MapCon from '@/components/MapCon.vue'
</script>
