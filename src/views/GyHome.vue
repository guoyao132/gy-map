<template>
  <div class="home-wrapper">
    <div class="startbox">
      <p>一个 Vue 3 组件库</p>
      <gy-button @click="goMap" style="margin-top: 10px">开始使用</gy-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import {useRouter} from "vue-router"
const router = useRouter();
const goMap = () => {
  router.push('/GyMap/Install')
}
</script>

<style lang="less" scoped>
.popover-body {
  padding: 15px;
  box-sizing: border-box;
}

.home-wrapper {
  width: 100%;
  height: 80%;
  display: flex;
  align-items: center;
  justify-content: center;

  .startbox{
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    text-align: center;

    p{
      width: 100%;
      margin-bottom: 50px;
    }
  }
}
</style>
