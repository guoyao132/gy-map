<template>
  <div class="DemoGymapHeat">
    <gy-title>GymapHeat</gy-title>
    <p class="sub-title">
      热力图
    </p>
  </div>
  <gy-demo-box title="基础" :code="DemoGymapHeat1_code">
    <DemoGymapHeat1/>
  </gy-demo-box>

  <gy-title>GymapHeat 属性</gy-title>
  <GyTable :tableData="propsData"/>
</template>

<script setup lang="ts">
import {
  DemoGymapHeat1,
  DemoGymapHeat1_code,
} from './demo'

import {ref} from "vue";
const propsData = ref([
  {
    shuxing: 'data',
    shuoming: `
      热力图数据
      由经纬度，以及权重数组组成的数组。数据必须包含，经度、纬度、权重。否则将出错！
      <br/>
      [[lon,lat, weight]...]
      `,
    leixing: 'number[][]',
  },
  {
    shuxing: 'visable',
    shuoming: `
      是否显示
      `,
    leixing: 'boolean',
    moren: 'true'
  },
  {
    shuxing: 'gradien',
    shuoming: `
      热力图颜色渐变色值数组
      `,
    leixing: 'Array<string>',
    moren: "['#00f', '#0ff', '#0f0', '#ff0', '#f00']",
  },
  {
    shuxing: 'radius',
    shuoming: `
      热力图半径
      `,
    leixing: 'number',
    moren: "100",
  },
  {
    shuxing: 'blur',
    shuoming: `
      热力图模糊距离
      `,
    leixing: 'number',
    moren: "100",
  },
  {
    shuxing: 'maxValue',
    shuoming: `
      权重最大值
      `,
    leixing: 'number',
    moren: "1",
  },
  {
    shuxing: 'minValue',
    shuoming: `
      权重最小值
      `,
    leixing: 'number',
    moren: "0",
  },
  {
    shuxing: 'weight',
    shuoming: `
      从要素返回权重的函数。重量值的范围应为0到1。
      <br>
      该函数有两个参数，第一个参数为当前点位数据，第二个参数为点位的feature对象！
      `,
    leixing: 'function',
    moren: "",
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
