<template>
  <div class="DemoGymapPolygon">
    <gy-title>GymapPolygon</gy-title>
    <p class="sub-title">
      多边形
    </p>
    <gy-demo-box title="基础" :code="DemoGymapPolygon1_code">
      <DemoGymapPolygon1/>
    </gy-demo-box>
    <p>注: 起始点位和终止点位需要相同</p>
    <gy-demo-box title="带边框的多边形" :code="DemoGymapPolygon2_code">
      <DemoGymapPolygon2/>
    </gy-demo-box>
    <gy-demo-box title="显示层级控制" :code="DemoGymapPolygon3_code">
      <DemoGymapPolygon3/>
    </gy-demo-box>
    <gy-title>GymapPolygon 属性</gy-title>
    <GyTable :tableData="propsData"/>
    <br>
    <p>
      positionList、strokeColor、strokeWidth、fillColor、opacity、minZoom、maxZoom支持同步修改。
    </p>
  </div>
</template>

<script setup lang="ts">
import {
  DemoGymapPolygon1,
  DemoGymapPolygon1_code,
  DemoGymapPolygon2,
  DemoGymapPolygon2_code,
  DemoGymapPolygon3,
  DemoGymapPolygon3_code,

} from './demo/index'
import {ref} from 'vue'
const propsData = ref([
  {
    shuxing: 'positionList',
    shuoming: `
      多边形坐标数组，支持多个多边形，只需传入多个数据
      <br/>
      只有一个时，传入[[lon,lat],...];
      <br/>
      多个时，传入[[[lon,lat],...], [[lon, lat], ...], ...]
      `,
    leixing: 'Array<number[]> | Array<Array<number[]>>',
  },
  {
    shuxing: 'fillColor',
    shuoming: `多边形区域颜色，可传入rgb、 rgba、颜色名称、十六进制或为null或空字符串
      <br>
      为null或空字符换时，表示不显示区域颜色
    `,
    leixing: 'string | null',
    moren: 'rgba(0, 0, 255, 0.1)',

  },
  {
    shuxing: 'strokeColor',
    shuoming: `多边形边框线颜色，可传入rgb、 rgba、颜色名称、十六进制或为null或空字符串
      <br>
      为null或空字符换时，表示不显示边框线
    `,
    leixing: 'string | null',
    moren: 'rgba(0, 0, 255, 0.1)',
  },
  {
    shuxing: 'strokeWidth',
    shuoming: `多边形边框线宽度`,
    leixing: 'number',
    moren: '3',
  },
  {
    shuxing: 'minZoom',
    shuoming: '允许显示多边形的最小地图层级',
    leixing: 'number',
    kexuan: '1 - 18',
  },
  {
    shuxing: 'maxZoom',
    shuoming: '允许显示多边形的最大地图层级',
    leixing: 'number',
    kexuan: '1 - 18',
  },
  {
    shuxing: 'opacity',
    shuoming: '当前多边形的透明度',
    leixing: 'number',
    kexuan: '0-1',
    moren: '1',
  },
] as Array<TableData>);
</script>

<style lang='less' scoped>
  .DemoGymapPolygon{

  }

</style>
