<template>
  <div class="DemoGymapHtml">
    <gy-title>DemoGymapHtml</gy-title>
    <p class="sub-title">
      将HTML绘制到地图中
    </p>
    <gy-demo-box title="基础" :code="DemoGymapHtml1_Code">
      <DemoGymapHtml1/>
    </gy-demo-box>
    <br/>
    <gy-title>DemoGymapHtml 属性</gy-title>
    <GyTable
      :tableData="propsData"
    />
  </div>
</template>

<script setup lang="ts">
import {DemoGymapHtml1, DemoGymapHtml1_Code} from './demo/index'
import GyTable from '@/components/GyTable.vue'
import {ref} from "vue"
const propsData = ref([
  {
    shuxing: 'position',
    shuoming: 'HTML所在位置 值为 [lon, lat] 经纬度组成的数组',
    leixing: 'Arrray<number>',
    kexuan: '',
    moren: '',
  },
  {
    shuxing: 'offset',
    shuoming: '偏移量 值为 [0, 0] 横向和竖向偏移量',
    leixing: 'Arrray<number>',
    kexuan: '',
    moren: '',
  },
  {
    shuxing: 'stopEvent',
    shuoming: '是否阻止鼠标点击穿透 默认 true,即鼠标在点击HTML时,不可操作地图',
    leixing: 'boolean',
    kexuan: 'true/false',
    moren: 'true',
  },
  {
    shuxing: 'className',
    shuoming: '给容器添加class',
    leixing: 'string',
    kexuan: '',
    moren: '',
  },
] as Array<TableData>);
</script>

<style lang='less' scoped>
  .DemoGymapHtml{

  }

</style>
