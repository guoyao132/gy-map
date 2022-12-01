<template>
  <div class="DemoInit">
    <gy-title>GyMap</gy-title>
    <p class="sub-title">
      主容器
    </p>
    <gy-demo-box title="初始化" :code="DemoGyMap1_code">
      <DemoGyMap1/>
    </gy-demo-box>
    <gy-title>GyMap 属性</gy-title>
    <GyTable :tableData="propsData"/>
  </div>
</template>

<script setup lang="ts">
import {DemoGyMap1, DemoGyMap1_code} from "./demo";
import GyTable from '@/components/GyTable.vue'
import {ref} from 'vue'
const propsData = ref([
  {
    shuxing: 'id',
    shuoming: '地图容器的ID',
    leixing: 'string',
  },
  {
    shuxing: 'center',
    shuoming: '地图中心点 值为 [lon, lat] 经纬度组成的数组',
    leixing: 'Array<number>',
  },
  {
    shuxing: 'zoom',
    shuoming: '地图显示层级 范围为 1 - 18',
    leixing: 'number',
    kexuan: '1 - 18',
  },
  {
    shuxing: 'mapOpt',
    shuoming: `地图相关属性配置
    <br/>
    - minZoom number 地图最小层级  默认为 1 最小为1
    <br/>
    - maxZoom number 地图最大增肌  默认为 18 最大为18
    <br/>
    - mapUrlList string[] | string 地图瓦片 只有一个时直接设置为瓦片地址，多个瓦片时传入一个Array;
    <br/>例:BASTURL + '/map/gaodeMap/ccMap/{z}/{x}/{y}.jpg'
    <br/>extent 地图范围  值为对角的两个顶点坐标组成的数组，[[leftTopLon, leftTopLat], [rightBottomLon, rightBottomLat]].
    `,
    leixing: 'Object',
  },
  {
    shuxing: 'maplayerIndex',
    shuoming: '地图当前瓦片显示下标',
    leixing: 'number',
    moren: '0',
  },
  {
    shuxing: 'layerOpacity',
    shuoming: '地图当前瓦片的透明度',
    leixing: 'number',
    kexuan: '0-1',
    moren: '1',
  },
] as Array<TableData>);
</script>

<style lang='less' scoped>
.DemoInit {

}

</style>
