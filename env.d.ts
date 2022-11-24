/// <reference types="vite/client" />
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}


declare module 'gy-map'
declare module 'gy-ui'
declare module 'vue3-hljs'

type LeftMenuItem = {
  name: string;
  path: string;
};
type LeftMenuGroup = {
  title: string;
  items: LeftMenuItem[];
};

interface TableData {
  shuxing: string;    //属性
  shuoming: string;   //说明
  leixing: string;    //类型
  kexuan: string;     //可选参数
  moren: string;      //默认参数
}
