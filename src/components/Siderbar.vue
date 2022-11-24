<template>
  <div class="siderbar btf-scrollbar">
    <div v-for="(list, i) in group" :key="`group${i}`" class="group">
      <div v-if="list.title" class="title">
        <span> {{ list.title }}</span>
      </div>
      <div
        v-for="(item, i) in list.items"
        :key="`siderbar${i}`"
        class="item"
        :style="`animation-delay: ${(i * 5 + i) * 25}ms;`"
      >
        <router-link :to="item.path">
          <span class="name">
          {{ item.name }}
        </span>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type {PropType} from 'vue';

defineProps({
  group: {
    type: Array as PropType<LeftMenuGroup[]>,
    default() {
      return [];
    },
  },
});

</script>
<style lang="less" scoped>
.siderbar {
  width: 230px;
  height: 100%;
  min-height: 100vh;
  overflow-y: auto;
  border-right: 1px solid rgb(235, 235, 235);
  user-select: none;
  background: #fff;

  .group {
    white-space: nowrap;
    margin-top: 20px;
    padding: 5px 0 5px 20px;

    .title {
      margin: 20px 0 15px 0;
      padding: 0 20px;
      font-size: 14px;
      font-weight: 400;
      height: 20px;
      color: rgb(190, 190, 190);
      overflow: hidden;

      span {
        display: inline-block;
      }
    }

    .item {
      display: flex;
      align-items: center;
      position: relative;
      height: 36px;
      line-height: 36px;
      box-sizing: border-box;
      list-style: none;
      cursor: pointer;
      font-size: 14px;
      transform: translateX(20px);
      opacity: 0;
      color: rgb(135, 135, 135);
      animation: slideIn 0.75s ease;
      animation-fill-mode: forwards;

      > a{
        width: calc(100% - 20px);
        border-radius: 4px;
        display: block;
        padding-left: 20px;

        &:hover {
          color: rgb(0, 0, 0);
          background: rgb(245, 245, 245);
        }

        &.router-link-active {
          color: #fff;
          background: rgb(59, 121, 208);
        }

        &.router-link-active:hover {
          color: #fff;
          background: rgb(59, 121, 208);
        }
      }
    }

    @keyframes slideIn {
      from {
        transform: translateX(20px);
        opacity: 0;
      }

      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  }

  .group:last-child {
    padding-bottom: 150px;
  }
}
</style>
