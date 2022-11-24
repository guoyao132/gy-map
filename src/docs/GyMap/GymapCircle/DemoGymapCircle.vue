<template>
  <div class="DemoGymapCircle">
    <gy-title>GymapCircle</gy-title>
    <p class="sub-title">
      绘制一个圆
    </p>
    <gy-demo-box title="基础" :code="DemoGymapCircle1_code">
      <DemoGymapCircle1/>
    </gy-demo-box>
    <gy-demo-box title="边框加透明" :code="DemoGymapCircle2_code">
      <DemoGymapCircle2/>
    </gy-demo-box>
    <gy-demo-box title="椭圆加旋转" :code="DemoGymapCircle3_code">
      <DemoGymapCircle3/>
    </gy-demo-box>
    <gy-demo-box title="随着地图同比放大缩小" :code="DemoGymapCircle4_code">
      <DemoGymapCircle4/>
    </gy-demo-box>
    <gy-title>GymapCircle 属性</gy-title>
    <GyTable :tableData="propsData"/>
  </div>
</template>

<script setup lang="ts">
import {
  DemoGymapCircle1_code,
  DemoGymapCircle1,
  DemoGymapCircle2_code,
  DemoGymapCircle2,
  DemoGymapCircle3,
  DemoGymapCircle3_code,
  DemoGymapCircle4,
  DemoGymapCircle4_code,
} from './demo/index'
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
    shuxing: 'radius',
    shuoming: '圆形的半径',
    leixing: 'number',
    kexuan: '',
    moren: 5,
  },
  {
    shuxing: 'fillColor',
    shuoming: `圆形形区域颜色，可传入rgb、 rgba、颜色名称、十六进制或为null或空字符串
      <br>
      为null或空字符换时，表示不显示区域颜色
    `,
    leixing: 'string | null',
    moren: '',

  },
  {
    shuxing: 'strokeColor',
    shuoming: `圆形边框线颜色，可传入rgb、 rgba、颜色名称、十六进制或为null或空字符串
      <br>
      为null或空字符换时，表示不显示边框线
    `,
    leixing: 'string | null',
    moren: '',
  },
  {
    shuxing: 'strokeWidth',
    shuoming: `圆形边框线宽度`,
    leixing: 'number',
    moren: '3',
  },
  {
    shuxing: 'scale',
    shuoming: `
    圆形的放大倍数，可传入数字或者横向或者竖向放大倍数的数组
    <br>
    例： [1, 0.5] 可形成椭圆
    `,
    leixing: 'number | number[]',
    kexuan: '',
    moren: 1,
  },
  {
    shuxing: 'rotation',
    shuoming: '旋转角度， 配合scale为数组时使用',
    leixing: 'number',
    moren: 0,
  },
  ...propsOlTableData,
] as Array<TableData>);
</script>

<style lang='less' scoped>
  .DemoGymapCircle{

  }

</style>
