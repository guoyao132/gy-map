<template>
  <div class="GyPage">
    <div class="sider">
      <siderbar :group="group"/>
    </div>
    <div ref="mainRef" class="app-main btf-scrollbar">
      <router-view/>
    </div>
  </div>
</template>
<script setup lang="ts">
import Siderbar from './Siderbar.vue';
import {ref, watch} from 'vue';
import type {PropType} from 'vue'
import {useRoute} from 'vue-router';

const route = useRoute();
const mainRef: any = ref(null);
watch(route, () => {
  mainRef.value.scrollTop = 0;
});

const props = defineProps({
  group: {
    type: Array as PropType<LeftMenuGroup[]>,
    default: () => ([])
  }
})
</script>

<style lang="less" scoped>
.GyPage {
  height: calc(100vh - 60px);
  display: flex;
}

.sider {
  position: fixed;
  height: calc(100vh - 60px);
}

.app-main {
  margin-left: 230px;
  width: calc(100% - 230px);
  height: calc(100vh - 60px);
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
  padding: 30px;
  background: rgb(250, 250, 250);
}
</style>
