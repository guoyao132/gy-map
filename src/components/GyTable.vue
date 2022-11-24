<template>
  <div class="GyTable">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column
        v-for="(item, index) in tableHeader"
        :key="'tableRow' + index"
        :min-width="item.minWidth"
        :prop="item.prop"
        :label="item.label"
      >
        <template #default="{row}">
          <span v-if="item.prop === 'shuoming'" v-html="row[item.prop]"></span>
          <span v-else>{{row[item.prop] || '——'}}</span>
<!--          <span>{{row}}</span>-->
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import type {PropType} from 'vue'
interface TableHead {
  label: string;
  prop: string;
  minWidth: number;
}
const props = defineProps({
  tableHeader: {
    type: Array as PropType<TableHead[]>,
    default: () => ([
      {
        label: '属性名',
        prop: 'shuxing',
        minWidth: 20,
      },
      {
        label: '说明',
        prop: 'shuoming',
        minWidth: 20,
      },
      {
        label: '类型',
        prop: 'leixing',
        minWidth: 20,
      },
      {
        label: '可选值',
        prop: 'kexuan',
        minWidth: 20,
      },
      {
        label: '默认值',
        prop: 'moren',
        minWidth: 20,
      },
    ])
  },
  tableData: {
    type: Array as PropType<TableData[]>,
    default: () => ([])
  },
});
</script>

<style lang='less' scoped>
  .GyTable{

  }

</style>
