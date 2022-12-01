<template>
  <div class="DemoGymapDraw">
    <gy-title>GymapDraw</gy-title>
    <p class="sub-title">
      Draw绘画
    </p>
    <gy-demo-box title="基础" :code="DemoGymapDraw1_code">
      <DemoGymapDraw1/>
    </gy-demo-box>
    <p>注：需要删除拐点时，可按ctrl+鼠标左键，点击需要删除的拐点进行删除。其中点、圆、线只剩两个点或者多边形只剩三个点时，不可删除，需要进行删除图形！</p>
    <br>
    <p>
      点击绘制完成后会触发"drawFinish"事件。
      返回数据格式为数组。
      <br>
      每个数据包包含"type"和"coordinates"。
      <br>
      type为绘制图形类型（'Point' | 'LineString' | 'Circle' | 'Polygon'）。
      <br>
      coordinates为坐标数据。其中 Point和Circle的坐标需要取coordinates[0]为实际坐标。
      <br>
      Circle还包含radius属性，为圆的半径。
    </p>
    <br>
    <gy-title>GymapDraw 属性</gy-title>
    <GyTable :tableData="propsData"/>
  </div>
</template>

<script setup lang="ts">
import {
  DemoGymapDraw1,
  DemoGymapDraw1_code,
} from './demo'
import {ref} from 'vue'
const propsData = ref([
  {
    shuxing: 'drawTypeList',
    shuoming: `
    绘制的类型数组
    `,
    leixing: 'Array',
    kexuan: 'Point(点) / LineString(线) / Circle(圆) / Polygon(多边形)',
    moren: '[Point, LineString, Circle, Polygon]'
  },
  {
    shuxing: 'drawTypeCnameList',
    shuoming: `
    绘制的类型数组对应的名称
    `,
    leixing: 'Array',
    moren: '[点, 线, 圆, 多边形]'
  },
  {
    shuxing: 'btnBackground',
    shuoming: `
    按钮背景颜色
    `,
    leixing: 'String',
    moren: 'rgb(102, 102, 102)'
  },
  {
    shuxing: 'btnColor',
    shuoming: `
    按钮文字颜色
    `,
    leixing: 'String',
    moren: '#fff'
  },
  {
    shuxing: 'btnActiveBackground',
    shuoming: `
    按钮高亮背景颜色
    `,
    leixing: 'String',
    moren: 'rgb(142, 142, 142)'
  },
  {
    shuxing: 'btnActiveColor',
    shuoming: `
    按钮高亮文字颜色
    `,
    leixing: 'String',
    moren: '#fff'
  },
  {
    shuxing: 'deleteActiveBackground',
    shuoming: `
    删除按钮选中背景颜色
    `,
    leixing: 'String',
    moren: 'rgb(28 137 189)'
  },
  {
    shuxing: 'deleteActiveColor',
    shuoming: `
    删除按钮选中文字颜色
    `,
    leixing: 'String',
    moren: '#fff'
  },
  {
    shuxing: 'fillColor',
    shuoming: `
    绘制完成后填充区域颜色
    `,
    leixing: 'String',
    moren: 'rgba(255, 255, 255, 0.2)'
  },
  {
    shuxing: 'strokeColor',
    shuoming: `
    绘制完成后线的颜色
    `,
    leixing: 'String',
    moren: '#ffcc33'
  },
  {
    shuxing: 'strokeWidth',
    shuoming: `
    绘制完成后线的宽度
    `,
    leixing: 'String',
    moren: '3'
  },
  {
    shuxing: 'pointRadius',
    shuoming: `
    绘制点时，点的半径
    `,
    leixing: 'Number',
    moren: '7'
  },
  {
    shuxing: 'canInsertVertexCondition',
    shuoming: `
      是否允许在线或者多边形上插入新的点位
      `,
    leixing: 'boolean',
    moren: 'true'
  },
] as Array<TableData>);
</script>

<style lang='less' scoped>
  .DemoGymapDraw{

  }

</style>
