<template>
  <MapCon>
    <Gymap-html
      :position="position">
      <div class="con"></div>
    </Gymap-html>
  </MapCon>
</template>

<script setup lang="ts">
import MapCon from '@/components/MapCon.vue'
import {ref} from "vue"
const position = ref([116.40531, 39.896884]);
</script>
<style>
.con{
  width: 100px;
  height: 100px;
  background: #fff;
}
</style>
