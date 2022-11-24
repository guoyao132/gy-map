<template>
  <MapCon id="map2">
    <GymapText
      :position="[116.40531, 39.896884]"
      text="GymapText 内容"
      fillColor="#fff"
      font="20px sans-serif"
      strokeColor="red"
      backgroundFillColor="blue"
      :padding="[10,10,10,10]"
    />
  </MapCon>
</template>

<script setup lang="ts">
import MapCon from '@/components/MapCon.vue'
</script>
