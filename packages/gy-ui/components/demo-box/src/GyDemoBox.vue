<template>
  <div class="GyDemoBox">
    <gy-title size="16px" :bold="800"
    >
      {{ title }}
    </gy-title>
    <div class="demo-item">
      <div class="demo-cp"><slot></slot></div>
      <div v-show="isShowCode" class="hl-pre">
        <div class="pre-box">
          <pre><code v-hljs v-text="code"></code></pre>
        </div>
      </div>
      <div class="show-bar" @click="isShowCode = !isShowCode">
        <div class="icon">
          <Icon v-if="!isShowCode" size="20">
            <Code24Regular />
          </Icon>
          <Icon v-if="isShowCode" size="20">
            <ChevronUp24Regular />
          </Icon>
        </div>

        {{ isShowCode ? '关闭' : '显示源码' }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronUp24Regular, Code24Regular } from '@vicons/fluent';
import { Icon } from '@vicons/utils';
import { ref } from 'vue';
defineProps({
  title: {
    type: String,
    default() {
      return '';
    },
  },
  tag: {
    type: String,
    default() {
      return '';
    },
  },
  code: {
    type: String,
    default() {
      return '';
    },
  },
});

let isShowCode = ref(false);
</script>

<style lang='less' scoped>
.GyDemoBox {
  margin: 50px 0 50px 0;

  .demo-item {
    margin: 10px 0;
    background-color: rgb(255, 255, 255);
    border-radius: 6px;
    border: 1px solid rgb(235, 235, 235);
  }
  .hl-pre {
    position: relative;
    .pre-box {
      margin-top: 10px;
      border-radius: 6px;
    }
  }
  .show-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px solid rgb(235, 235, 235);
    width: 100%;
    height: 30px;
    border-radius: 0 0 6px 6px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.25s;
    color: #999;
    background-color: rgb(255, 255, 255);
    .icon {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 10px;
    }
  }
  .show-bar:hover {
    background-color: rgb(235, 235, 235);
    color: rgb(70, 70, 70);
  }

  .demo-cp {
    padding: 30px;
  }
}

</style>
