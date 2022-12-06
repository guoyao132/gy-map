<template>
  <div class="DemoGymapTask">
    <gy-title>GymapTask</gy-title>
    <p class="sub-title">
      动画任务，支持执行动画的组件：GymapHtml、GymapCircle、GymapImage、GymapText
    </p>
    <gy-demo-box title="基础" :code="DemoGymapTask1_code">
      <DemoGymapTask1/>
    </gy-demo-box>
    <gy-demo-box title="修改position" :code="DemoGymapTask2_code">
      <DemoGymapTask2/>
    </gy-demo-box>
    <p>注：在执行动画过程中，如果修改了动画容器的position,会立即修改位置，并停止动画！</p>
    <gy-demo-box title="动画延迟" :code="DemoGymapTask3_code">
      <DemoGymapTask3/>
    </gy-demo-box>
    <p>注：需要设置delay时长，单位为毫秒并将taskStatus设置为 ''(空字符串)，避免初始化完成后启动动画。</p>
    <gy-demo-box title="animate事件" :code="DemoGymapTask4_code">
      <DemoGymapTask4/>
    </gy-demo-box>
    <br>
    <gy-title>GymapTask 属性</gy-title>
    <GyTable :tableData="propsData"/>
    <br>
    <gy-title>GymapTask 事件</gy-title>
    <GyTable :tableData="propsData1" :tableHeader="tableHeader"/>
  </div>
</template>

<script setup lang="ts">
import {
  DemoGymapTask1,
  DemoGymapTask1_code,
  DemoGymapTask2,
  DemoGymapTask2_code,
  DemoGymapTask3,
  DemoGymapTask3_code,
  DemoGymapTask4,
  DemoGymapTask4_code,
} from './demo'
import {ref} from 'vue';
const propsData = ref([
  {
    shuxing: 'positionList',
    shuoming: `
      动画执行经过的点位
      由经纬度数组组成的数组
      <br/>
      [[lon,lat]...]
      `,
    leixing: 'number[][]',
  },
  {
    shuxing: 'loop',
    shuoming: '是否循环',
    leixing: 'Boolean',
    moren: 'false',
  },
  {
    shuxing: 'step',
    shuoming: '动画执行步长， 0-1， 时长越大执行越快',
    leixing: 'Number',
    moren: 0.001
  },
  {
    shuxing: 'taskStatus',
    shuoming: `
    动画执行的状态
    <br>
    状态包括play(播放)、stop(停止)、pause(暂停)、"" (空字符串)。
    <br>
    初始状态设置为play即可以默认启动。
    <br>
    可通过切换taskStatus状态来控制动画执行。
    `,
    leixing: 'String',
    moren: 'play',
    kexuan: 'play / stop / pause / ""',
  },
  {
    shuxing: 'delay',
    shuoming: '动画启动延时，仅默认动画启动有效。',
    leixing: 'Number',
    moren: 0.001
  },
  {
    shuxing: 'animateDataType',
    shuoming: `
    动画执行时，animate事件获取到的数据格式
    <br>
    类型为：COORDINATE(点位) | LONLAT(经纬度)
    `,
    leixing: 'String',
    moren: 'LONLAT',
    kexuan: 'COORDINATE / LONLAT'
  },
] as Array<TableData>);

interface ShijianData {
  name: string;    //属性
  shuoming: string;   //说明
  props: string;    //类型
}
const tableHeader = ref([
  {
    label: '事件名',
    prop: 'name',
    minWidth: 20,
  },
  {
    label: '说明',
    prop: 'shuoming',
    minWidth: 40,
  },
  {
    label: '回调参数',
    prop: 'props',
    minWidth: 40,
  },
])
const propsData1 = ref([
  {
    name: 'animate',
    shuoming: `
      在动画执行时，每帧会进行触发。
      `,
    props: 'position(当前位置), animIndex(当前动画执行进度)',
  },
] as Array<ShijianData>);
</script>

<style lang='less' scoped>
  .DemoGymapTask{

  }

</style>
