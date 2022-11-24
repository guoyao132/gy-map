<template>
  <div class="guide-wrapper">
    <gy-title>安装</gy-title>
    <p>使用 npm 安装。</p>
    <ShowCode code="npm install gy-map --save" />
    <p>
      gy-map 仅支持 Vue3，这里我推荐您使用 setup 语法糖。
    </p>
    <gy-title>引入</gy-title>
    <p>
      全局引入 在main.js中引入
    </p>
    <ShowCode :code="code1" />
    <p>按需引入，在相应的页面中引入</p>
    <ShowCode :code="code2" />
    <br/>
    <gy-title>判断map加载完成</gy-title>
    <p>在其他页面中判断map是否加载完成</p>
    <ShowCode :code="code3" />
  </div>
</template>

<script setup lang="ts">
import ShowCode from '@/components/ShowCode.vue'
const code1 =
`import {gyMap} from 'gy-Map';
app.use(gyMap);`;
const code2 =
`import {Gymap, GymapHtml} from 'gy-Map'
<Gymap
  :mapOpt="mapOpt"
  :zoom="zoom"
  :center="p"
>
  <Gymap-html
    :position="p"
    :offset="o"
  ></Gymap-html>
</Gymap>`
const code3 =
`import {watch} from "vue"
const gyMapObj = gyMap(mapId); //mapId可不填， 当有多个地图是可以通过传入对应的ID，获取对应地图的实例。
const mapFinish = computed(() => gyMapObj.value && gyMapObj.value.mapFinish);
watch(mapFinish, n => {
  //n === true
  //map filish
})
`
</script>

<style lang='less' scoped>
  .DemoInit{

  }

</style>
