# gy-map

使用vue3.0+vite+ts封装的地图组件

文档详见 https://283l8319m4.zicp.fun/

或 下载该项目，运行npm run serve.也可阅读离线文档。

# 安装

使用 npm 安装。

```javascript
npm
install
gy - map--
save
```

# 引入

## 全局引入 在main.js中引入

```javascript
import {gyMap} from 'gy-Map';

app.use(gyMap);
```

## 按需引入，在相应的页面中引入

```javascript
import {Gymap, GymapHtml} from 'gy-Map'

<
Gymap
  :mapOpt = "mapOpt"
:
zoom = "zoom"
:
center = "p"
  >
  < Gymap - html
:
position = "p"
:
offset = "o"
  > < /Gymap-html>
</Gymap>
```

# 判断map加载完成

在其他页面中判断map是否加载完成

```javascript
import {watch} from "vue"

const gyMapObj = gyMap(mapId); //mapId可不填， 当有多个地图是可以通过传入对应的ID，获取对应地图的实例。
const mapFinish = computed(() => gyMapObj.value && gyMapObj.value.mapFinish);
watch(mapFinish, n => {
  //n === true
  //map filish
})
```
# GyMap

主容器

```javascript
<template>
  <div class="gy-map-con">
    <Gymap
      id="map2"
    :mapOpt="mapOpt"
    :zoom="zoom"
    :center="center"
    :layerOpacity="layerOpacity"
    >
  </Gymap>
</div>
</template>

<script setup lang="ts">
  import {ref, reactive} from "vue"
  const mapOpt = reactive({})
  let center = ref([116.40531, 39.896884]);
  const zoom = ref(16);
  const layerOpacity = ref(1);
</script>
```
<table class="el-table__body" style="table-layout: fixed; width: 938px;">
    <colgroup>
        <col name="el-table_1_column_1" width="190">
        <col name="el-table_1_column_2" width="187">
        <col name="el-table_1_column_3" width="187">
        <col name="el-table_1_column_4" width="187">
        <col name="el-table_1_column_5" width="187">
    </colgroup>
    <tbody>
        <tr>
            <th>属性名</th>
            <th>说明</th>
            <th>类型</th>
            <th>可选值</th>
            <th>默认值</th>
        </tr>
        <tr>
            <td><div class="cell"><span data-v-ac79ea56="">id</span></div></td>
            <td class="el-table_1_column_2 el-table__cell" rowspan="1" colspan="1"><div class="cell"><!----><span data-v-ac79ea56="">地图容器的ID</span></div></td>
            <td class="el-table_1_column_3 el-table__cell" rowspan="1" colspan="1"><div class="cell"><!----><span data-v-ac79ea56="">string</span></div></td>
            <td class="el-table_1_column_4 el-table__cell" rowspan="1" colspan="1"><div class="cell"><!----><span data-v-ac79ea56="">——</span></div></td>
            <td class="el-table_1_column_5 el-table__cell" rowspan="1" colspan="1"><div class="cell"><!----><span data-v-ac79ea56="">——</span></div></td></tr><tr class="el-table__row">
            <td class="el-table_1_column_1 el-table__cell" rowspan="1" colspan="1"><div class="cell"><!----><span data-v-ac79ea56="">center</span></div></td>
            <td class="el-table_1_column_2 el-table__cell" rowspan="1" colspan="1"><div class="cell"><!----><span data-v-ac79ea56="">地图中心点 值为 [lon, lat] 经纬度组成的数组</span></div></td>
            <td class="el-table_1_column_3 el-table__cell" rowspan="1" colspan="1"><div class="cell"><!----><span data-v-ac79ea56="">Array&lt;number&gt;</span></div></td>
            <td class="el-table_1_column_4 el-table__cell" rowspan="1" colspan="1"><div class="cell"><!----><span data-v-ac79ea56="">——</span></div></td>
            <td class="el-table_1_column_5 el-table__cell" rowspan="1" colspan="1"><div class="cell"><!----><span data-v-ac79ea56="">——</span></div></td></tr><tr class="el-table__row">
            <td class="el-table_1_column_1 el-table__cell" rowspan="1" colspan="1"><div class="cell"><!----><span data-v-ac79ea56="">zoom</span></div></td>
            <td class="el-table_1_column_2 el-table__cell" rowspan="1" colspan="1"><div class="cell"><!----><span data-v-ac79ea56="">地图显示层级 范围为 1 - 18</span></div></td>
            <td class="el-table_1_column_3 el-table__cell" rowspan="1" colspan="1"><div class="cell"><!----><span data-v-ac79ea56="">number</span></div></td>
            <td class="el-table_1_column_4 el-table__cell" rowspan="1" colspan="1"><div class="cell"><!----><span data-v-ac79ea56="">1 - 18</span></div></td>
            <td class="el-table_1_column_5 el-table__cell" rowspan="1" colspan="1"><div class="cell"><!----><span data-v-ac79ea56="">——</span></div></td></tr><tr class="el-table__row">
            <td class="el-table_1_column_1 el-table__cell" rowspan="1" colspan="1"><div class="cell"><!----><span data-v-ac79ea56="">mapOpt</span></div></td>
            <td class="el-table_1_column_2 el-table__cell" rowspan="1" colspan="1"><div class="cell"><!----><span data-v-ac79ea56="">地图相关属性配置
                <br>
                - minZoom number 地图最小层级  默认为 1 最小为1
                <br>
                - maxZoom number 地图最大增肌  默认为 18 最大为18
                <br>
                - mapUrlList string[] | string 地图瓦片 只有一个时直接设置为瓦片地址，多个瓦片时传入一个Array;
                <br>例:BASTURL + '/map/gaodeMap/ccMap/{z}/{x}/{y}.jpg'
                <br>extent 地图范围  值为对角的两个顶点坐标组成的数组，[[leftTopLon, leftTopLat], [rightBottomLon, rightBottomLat]].
                </span></div></td>
            <td class="el-table_1_column_3 el-table__cell" rowspan="1" colspan="1"><div class="cell"><!----><span data-v-ac79ea56="">Object</span></div></td>
            <td class="el-table_1_column_4 el-table__cell" rowspan="1" colspan="1"><div class="cell"><!----><span data-v-ac79ea56="">——</span></div></td>
            <td class="el-table_1_column_5 el-table__cell" rowspan="1" colspan="1"><div class="cell"><!----><span data-v-ac79ea56="">——</span></div></td></tr><tr class="el-table__row">
            <td class="el-table_1_column_1 el-table__cell" rowspan="1" colspan="1"><div class="cell"><!----><span data-v-ac79ea56="">maplayerIndex</span></div></td>
            <td class="el-table_1_column_2 el-table__cell" rowspan="1" colspan="1"><div class="cell"><!----><span data-v-ac79ea56="">地图当前瓦片显示下标</span></div></td>
            <td class="el-table_1_column_3 el-table__cell" rowspan="1" colspan="1"><div class="cell"><!----><span data-v-ac79ea56="">number</span></div></td>
            <td class="el-table_1_column_4 el-table__cell" rowspan="1" colspan="1"><div class="cell"><!----><span data-v-ac79ea56="">——</span></div></td>
            <td class="el-table_1_column_5 el-table__cell" rowspan="1" colspan="1"><div class="cell"><!----><span data-v-ac79ea56="">0</span></div></td></tr><tr class="el-table__row">
            <td class="el-table_1_column_1 el-table__cell" rowspan="1" colspan="1"><div class="cell"><!----><span data-v-ac79ea56="">layerOpacity</span></div></td>
            <td class="el-table_1_column_2 el-table__cell" rowspan="1" colspan="1"><div class="cell"><!----><span data-v-ac79ea56="">地图当前瓦片的透明度</span></div></td>
            <td class="el-table_1_column_3 el-table__cell" rowspan="1" colspan="1"><div class="cell"><!----><span data-v-ac79ea56="">number</span></div></td>
            <td class="el-table_1_column_4 el-table__cell" rowspan="1" colspan="1"><div class="cell"><!----><span data-v-ac79ea56="">0-1</span></div></td>
            <td class="el-table_1_column_5 el-table__cell" rowspan="1" colspan="1"><div class="cell"><!----><span data-v-ac79ea56="">1</span></div></td>
        </tr>
    </tbody>
</table>

#其他组件
- GymapText
  绘制文本
- GymapCircle
  绘制一个圆
- GymapImage
  绘制图片
- DemoGymapHtml
  将HTML绘制到地图中
- GymapPolygon
  多边形
- GymapLine
  绘制一条线
- GymapHeat
  热力图
- GymapDraw
  Draw绘画
- GymapTask
  动画任务
