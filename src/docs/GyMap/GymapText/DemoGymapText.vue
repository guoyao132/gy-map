<template>
  <div class="GymapText">
    <gy-title>GymapText</gy-title>
    <p class="sub-title">
      绘制文本
    </p>
    <gy-demo-box title="基础" :code="DemoGymapText1_code">
      <DemoGymapText1/>
    </gy-demo-box>
    <gy-demo-box title="基础" :code="DemoGymapText2_code">
      <DemoGymapText2/>
    </gy-demo-box>
    <br>
    <gy-title>GymapText 属性</gy-title>
    <GyTable :tableData="propsData"/>
  </div>
</template>

<script setup lang="ts">
import {
  DemoGymapText1,
  DemoGymapText1_code,
  DemoGymapText2,
  DemoGymapText2_code,
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
    shuxing: 'text',
    shuoming: '文本内容',
    leixing: 'string',
  },
  {
    shuxing: 'font',
    shuoming: `
    字体大小以及字体格式
    <br>
    需要同时设置 例： 20px sans-serif
    `,
    leixing: 'string',
  },
  {
    shuxing: 'offsetX',
    shuoming: `
    横向偏移量
    `,
    leixing: 'number',
  },
  {
    shuxing: 'offsetY',
    shuoming: `
    纵向偏移量
    `,
    leixing: 'number',
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
  {
    shuxing: 'textAlign',
    shuoming: `
    文本对齐方式
    `,
    leixing: 'string',
    kexuan: `left / right / center / end / start`,
    moren: 'center'
  },
  {
    shuxing: 'textBaseline',
    shuoming: `
    文本竖向对齐方式
    `,
    leixing: 'string',
    kexuan: `bottom / top / middle / alphabetic / hanging / ideographic`,
    moren: 'middle'
  },
  {
    shuxing: 'fillColor',
    shuoming: `文字颜色，可传入rgb、 rgba、颜色名称、十六进制或为null或空字符串
      <br>
      为null或空字符换时，表示不显示区域颜色
    `,
    leixing: 'string | null',
    moren: '',

  },
  {
    shuxing: 'strokeColor',
    shuoming: `文字边框线颜色，可传入rgb、 rgba、颜色名称、十六进制或为null或空字符串
      <br>
      为null或空字符换时，表示不显示边框线
    `,
    leixing: 'string | null',
    moren: '',
  },
  {
    shuxing: 'strokeWidth',
    shuoming: `文字边框线宽度`,
    leixing: 'number',
    moren: '3',
  },
  {
    shuxing: 'backgroundFillColor',
    shuoming: `文字背景颜色，可传入rgb、 rgba、颜色名称、十六进制或为null或空字符串
      <br>
      为null或空字符换时，表示不显示区域颜色
    `,
    leixing: 'string | null',
    moren: '',

  },
  {
    shuxing: 'backgroundStrokeColor',
    shuoming: `文字背景边框线颜色，可传入rgb、 rgba、颜色名称、十六进制或为null或空字符串
      <br>
      为null或空字符换时，表示不显示边框线
    `,
    leixing: 'string | null',
    moren: '',
  },
  {
    shuxing: 'backgroundStrokeWidth',
    shuoming: `文字背景边框线宽度`,
    leixing: 'number',
    moren: '3',
  },
  {
    shuxing: 'padding',
    shuoming: `
    文字背景与文字的内边距
    `,
    leixing: 'number[]  | [top, right, bottom, left]',
    moren: '[0,0,0,0]',
  },
  ...propsOlTableData,
] as Array<TableData>);
</script>
