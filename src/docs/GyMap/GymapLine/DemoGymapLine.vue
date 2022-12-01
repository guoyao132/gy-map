<template>
  <div class="DemoGymapLine">
    <gy-title>GymapLine</gy-title>
    <p class="sub-title">
      绘制一条线
    </p>
    <gy-demo-box title="基础" :code="DemoGymapLine1_code">
      <DemoGymapLine1/>
    </gy-demo-box>
    <gy-demo-box title="显示层级控制" :code="DemoGymapLine2_code">
      <DemoGymapLine2/>
    </gy-demo-box>
    <gy-demo-box title="给每段结尾添加箭头" :code="DemoGymapLine3_code">
      <DemoGymapLine3/>
    </gy-demo-box>
    <gy-demo-box title="添加线动画" :code="DemoGymapLine4_code">
      <DemoGymapLine4/>
    </gy-demo-box>
    <gy-title>GymapLine 属性</gy-title>
    <GyTable :tableData="propsData"/>
    <br>
  </div>
</template>

<script setup lang="ts">
import {
  DemoGymapLine1,
  DemoGymapLine1_code,
  DemoGymapLine2,
  DemoGymapLine2_code,
  DemoGymapLine3,
  DemoGymapLine3_code,
  DemoGymapLine4,
  DemoGymapLine4_code,
} from './demo/index'
import {ref} from 'vue'
const propsData = ref([
  {
    shuxing: 'positionList',
    shuoming: `
      线的坐标数组 格式为：[[lon,lat],...]
      `,
    leixing: 'Array<number[]>',
  },
  {
    shuxing: 'strokeColor',
    shuoming: `线颜色，可传入rgb、 rgba、颜色名称、十六进制`,
    leixing: 'string',
    moren: 'blue',
  },
  {
    shuxing: 'strokeWidth',
    shuoming: `线宽度`,
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
  {
    shuxing: 'arrow',
    shuoming: '在每段线的结束时，添加一个箭头,可以传入图片路径、或者true使用默认箭头',
    leixing: 'boolean | string',
    kexuan: '',
    moren: '',
  },
  {
    shuxing: 'arrowAnchor',
    shuoming: '线结束箭头的偏移,数值时由横向偏移和纵向偏移组成的数组',
    leixing: 'Array<number>',
    kexuan: '',
    moren: '[0.75, 0.5]',
  },
  {
    shuxing: 'animate',
    shuoming: '添加动画',
    leixing: 'boolean',
    kexuan: 'true/false',
    moren: 'false',
  },
  {
    shuxing: 'step',
    shuoming: '动画执行步长， 0-0.01， 时长越大执行越快',
    leixing: 'Number',
    kexuan: '',
    moren: '0.001',
  },
  {
    shuxing: 'arrowStep',
    shuoming: '箭头的数量，配合动画使用',
    leixing: 'Number',
    kexuan: '',
    moren: '20',
  },
] as Array<TableData>);
</script>

<style lang='less' scoped>
  .DemoGymapLine{

  }

</style>
