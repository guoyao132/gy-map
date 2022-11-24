<template>
  <div class="Header">
    <div class="logo">
      <span style="margin-left: 10px"> Gy UI</span>
    </div>
    <div class="menu">
      <div class="menu-item">
        <router-link to="/">首页</router-link>
      </div>
      <div class="menu-item">
        <router-link to="/gymap">地图</router-link>
      </div>
      <a target="_blank" href="https://github.com/guoyao132/gy-commom/tree/gy-map-ts">
        <Icon size="24"> <LogoGithub /> </Icon>
      </a>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { LogoGithub } from '@vicons/ionicons5';
import { Icon } from '@vicons/utils';

</script>

<style lang="less" scoped>
.Header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  width: 100%;
  height: 60px;
  box-sizing: border-box;
  background: rgb(255, 255, 255);
  border-bottom: 1px solid rgb(235, 235, 235);
  user-select: none;
  .logo {
    display: flex;
    align-items: center;
    font-size: 22px;
    cursor: pointer;
    .lew-badge {
      margin-left: 10px;
    }
  }
  .menu {
    display: flex;
    align-items: center;
    a,
    span,
    .menu-item {
      display: inline-flex;
      align-items: center;
      padding: 5px;
      opacity: 1;
      font-size: 14px;
      margin-right: 10px;
      transition: all 0.5s;
      color: #747474;
      svg {
        cursor: pointer;
      }

      a{
        color: #747474;

        &.router-link-active{
          color: #000;
          font-weight: bold;
        }
      }
    }
    .menu-item {
      cursor: pointer;
    }

    .menu-item {
      padding: 10px;
    }
  }
}
</style>
<style lang="less">
.icon-mode-sunny {
  display: none;
}
.icon-mode-moon {
  display: block;
}
.lew-dark {
  .logo {
    img {
      filter: invert(100%);
    }
  }
  .icon-mode-sunny {
    display: block;
  }
  .icon-mode-moon {
    display: none;
  }
}
</style>
