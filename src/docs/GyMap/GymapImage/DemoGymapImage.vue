<template>
  <div class="DemoGymapImage">
    <gy-title>GymapImage</gy-title>
    <p class="sub-title">
      绘制图片
    </p>
    <gy-demo-box title="添加线动画" :code="DemoGymapImage1_code">
      <DemoGymapImage1/>
    </gy-demo-box>
    <gy-title>GymapImage 属性</gy-title>
    <GyTable :tableData="propsData"/>
  </div>
</template>

<script setup lang="ts">
import {
  DemoGymapImage1,
  DemoGymapImage1_code
} from './demo'
import propsOlTableData from "@/components/propsOlTableData";
import {ref} from "vue";
const propsData = ref([
  {
    shuxing: 'position',
    shuoming: `
      由经纬度组成的数组
      <br/>
      [lon,lat]
      `,
    leixing: 'number[]',
  },
  {
    shuxing: 'src',
    shuoming: `图片路径`,
    leixing: 'string',
  },
  {
    shuxing: 'anchor',
    shuoming: `图片中心点`,
    leixing: 'number[]',
    moren: '[0.5, 0.5]',
  },
  {
    shuxing: 'displacement',
    shuoming: '图片偏移',
    leixing: 'number[]',
    moren: '[0, 0]',
  },
  {
    shuxing: 'scale',
    shuoming: `
    放大倍数
    `,
    leixing: 'number',
  },
  {
    shuxing: 'rotation',
    shuoming: `
    旋转角度
    <br>
    例： Math.PI / 2
    `,
    leixing: 'number',
  },
  ...propsOlTableData,
] as Array<TableData>);
</script>

<style lang='less' scoped>
  .DemoGymapImage{

  }

</style>
