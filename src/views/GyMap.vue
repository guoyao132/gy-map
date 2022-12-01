<template>
  <GyPage :group="group"></GyPage>
</template>
<script setup lang="ts">
import GyPage from '@/components/GyPage.vue'
import {ref} from 'vue';
import type {Ref} from 'vue';

let group:Ref<LeftMenuGroup[]> = ref([]);
group.value = [
  {
    title: '安装',
    items: [
      {
        name: 'GyMap',
        path: '/GyMap/Install',
      },
    ],
  },
  {
    title: '使用',
    items: [
      {
        name: '初始化',
        path: '/GyMap/Init'
      }
    ]
  },
  {
    title: '覆盖物组件',
    items: [
      {
        name: 'GymapText',
        path: '/GyMap/GymapText'
      },
      {
        name: 'GymapCircle',
        path: '/GyMap/GymapCircle'
      },
      {
        name: 'GymapImage',
        path: '/GyMap/GymapImage'
      },
      {
        name: 'GymapHtml',
        path: '/GyMap/GymapHtml'
      },
      {
        name: 'GymapPolygon',
        path: '/GyMap/GymapPolygon'
      },
      {
        name: 'GymapLine',
        path: '/GyMap/GymapLine'
      },
      {
        name: 'GymapHeat',
        path: '/GyMap/GymapHeat'
      },
    ]
  },
  {
    title: '控件',
    items: [
      {
        name: 'GymapDraw',
        path: '/GyMap/GymapDraw'
      },
      {
        name: 'GymapTask',
        path: '/GyMap/GymapTask'
      },
    ]
  },
];
</script>
