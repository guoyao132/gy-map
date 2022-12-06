import type {Ref, UnwrapRef} from 'vue-demi'
import {reactive, ref, markRaw} from 'vue-demi';
// @ts-ignore
import type olType from 'ol'
// @ts-ignore
import Map from 'ol/Map';
// @ts-ignore
import TileLayer from "ol/layer/Tile";
// @ts-ignore
import XYZ from "ol/source/XYZ";
// @ts-ignore
import View from "ol/View";
// @ts-ignore
import Overlay from 'ol/Overlay'
import * as olExtent from 'ol/extent'
// @ts-ignore
import gyMapUtils from "./gyMapUtils";

const BASTURL:string = 'http://172.18.8.146:30000'

interface mapObj {
  contentId:string;
  map: Ref<olType.Map | null>,
  view: Ref<olType.View | null>,
  mapFinish: Ref<boolean>,
  zoom: Ref<number>,
  [propName:string]: any,
}

interface GyMapResultObj {
  [propName: string]: Ref<UnwrapRef<mapObj>>
}
interface MapOpt {
  layerOpacity: number,
  maplayerIndex: number,
  centerPoint: Array<number>,
  minZoom: number,
  maxZoom: number,
  zoom: number,
  mapUrlList: Array<string>,
  extent: number[] | undefined
}

let gyMapResultObj:GyMapResultObj = {};


const gyMapInit = (type:string): Ref<UnwrapRef<mapObj>> => {
  type = type || '';
  if(type && gyMapResultObj[type]){
    return gyMapResultObj[type];
  }
  /****************************************/
  //获取在最大最小值内的zoom
  const getRightLayerIndex = (index:number | string):number => {
    let len = tileLayerList.length;
    return Math.max(0, Math.min(Number(index || 0), len))
  }
  const getRightZoom = (zoom:number| string):number => {
    return Math.max(mapOpt.minZoom, Math.min(Number(zoom || 0), mapOpt.maxZoom))
  }
  //格式化mapOpt
  const formatOpt = ():void => {
    mapOpt.minZoom = Math.max(1, mapOpt.minZoom)
    mapOpt.maxZoom = Math.min(18, mapOpt.maxZoom)
    zoom.value = getRightZoom(mapOpt.zoom);
  }
  /**************************************/
  let map:Ref<olType.Map| null> = ref(null);
  let view:Ref<olType.View | null> = ref(null);
  let mapOpt:MapOpt = {
    layerOpacity: 1,
    maplayerIndex: 0,
    centerPoint: [116.40531, 39.896884],
    minZoom: 1,
    maxZoom: 18,
    zoom: 16,
    extent: undefined,
    mapUrlList: [
      "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
      BASTURL + '/map/gaodeMap/ccMap/{z}/{x}/{y}.jpg',
    ],
  }
  let zoom:Ref<number> = ref(getRightZoom(mapOpt.zoom));
  let contentId:string = '';
  let tileLayerList:Array<any> = [];
  let layerIndex:number = -1;
  let mapUtils:any = {
    ...gyMapUtils,
  };
  let mapFinish:Ref<boolean> = ref(false);
  /****************************************/
  //初始化
  const init = (id:string, opt: any) => {
    if(!id){
      console.error(`not find ${id}`);
      return;
    }
    initOptions(id, opt);
    initTileLayerList();
    initMap();
    changeMapLayer(mapOpt.maplayerIndex);
  }
  //初始化配置
  let initOptions = (id:string, opt:any) => {
    contentId = id;
    mapOpt = Object.assign({}, mapOpt, opt);
    formatOpt();
    let extent = mapOpt.extent || undefined;
    if(extent){
      let lonlat1 = extent[0];
      let lonlat2 = extent[1];
      if(lonlat1 && lonlat2){
        let c1 = gyMapUtils.formatLonLatToPosition(lonlat1);
        let c2 = gyMapUtils.formatLonLatToPosition(lonlat2);
        let ex = [
          Math.min(c1[0], c2[0]),
          Math.min(c1[1], c2[1]),
          Math.max(c1[0], c2[0]),
          Math.max(c1[1], c2[1]),
        ]
        mapOpt.extent = ex;
      }else{
        mapOpt.extent = undefined;
      }
    }
  }
  //初始化地图
  const initMap = () => {
    view.value = markRaw(new View({
      center: gyMapUtils.formatLonLatToPosition(mapOpt.centerPoint),
      zoom: zoom.value,
      minZoom: mapOpt.minZoom,
      maxZoom: mapOpt.maxZoom,
      extent: mapOpt.extent,
    }));
    map.value = markRaw(new Map({
      layers: tileLayerList,
      target: contentId,
      view: view.value,
      controls: [],
    }));
    // const contentIdDom:HTMLElement | null = document.getElementById(contentId);
    // if(contentIdDom){
    //   contentIdDom.focus();
    // }
    mapFinish.value = true;
  }
  //初始化地图layer
  const initTileLayerList = () => {
    tileLayerList = [];
    let mapUrlList:Array<string> = mapOpt.mapUrlList;
    if(!Array.isArray(mapUrlList)){
      mapUrlList = [mapUrlList];
    }
    mapUrlList.forEach(v =>{
      tileLayerList.push(
        new TileLayer({
          visible: false,
          opacity: mapOpt.layerOpacity,
          source: new XYZ({
            url: v
          }),
        }),
      )
    })
  }
  //设置zoom
  const zoomSetFun = (val:number | string):void => {
    let zoomVal = getRightZoom(Number(val));
    if(zoomVal === zoom.value){
      return;
    }
    view.value && view.value.animate({zoom: zoomVal, duration: 800});
    zoom.value = zoomVal;
  }
  //增加zoom
  const zoomAddFun = ():void => {
    zoomSetFun(zoom.value + 1)
  }
  //减少zoom
  const zoomSubFun = ():void => {
    zoomSetFun(zoom.value - 1)
  }
  //切换地图layer
  const changeMapLayer = (index:number | string):void => {
    index = Number(index || 0)
    if(layerIndex === index){
      return
    }
    let len:number = tileLayerList.length;
    let i:number = Math.max(0, Math.min(index, len))
    if(layerIndex !== -1) {
      tileLayerList[layerIndex]?.setVisible(false)
    }
    tileLayerList[i]?.setVisible(true)
    layerIndex = i;
  }
  //切换中心点
  const changeCenterPoint = (center:Array<number>) => {
    let point = gyMapUtils.formatLonLatToPosition(center)
    view.value && view.value.animate({center: point, duration: 800});
  }
  //将html绘制到地图上
  interface drawHtmlToMapOpt {
    position: Array<number>,
    offset: Array<number>,
    stopEvent: boolean,
    className: string
  }
  const drawHtmlToMap = (id:string | HTMLElement, {
    position,
    offset = [0, 0],
    stopEvent = true,
    className = '',
  }:drawHtmlToMapOpt):olType.Overlay | Array<olType.Overlay> | null => {
    let dom = null;
    let idIsDom = false;
    if(typeof id === 'object'){
      if(id instanceof HTMLElement) {
        dom = [id];
        idIsDom = true;
      } else {
        console.error(`请传入正确的dom对象！`);
        return null;
      }
    }else if(typeof id === 'string'){
      dom = document.querySelectorAll(id)
      if(dom.length === 0){
        console.error(`not find ${id}`);
        return null;
      }
    }
    if(!Array.isArray(position)){
      console.error(`position 格式不正确，应该为 [经度，纬度]`);
      return null;
    }
    let overlayList:Array<olType.Overlay> = [];
    Array.prototype.forEach.call(dom, v => {
      let overlay:olType.Overlay = new Overlay({
        element: v,
        position: gyMapUtils.formatLonLatToPosition(position),
        insertFirst: false,
        autoPan: true,
        stopEvent,
        className: 'ol-overlay-container ol-selectable ' + className,
        offset,
      });
      map.value && map.value.addOverlay(overlay)
      overlayList.push(overlay);
    })
    if(overlayList.length === 1){
      return overlayList[0];
    }else{
      return overlayList;
    }
  }
  const removeOverlay = (overlay:olType.Overlay):void => {
    overlay && map.value && map.value.removeOverlay(overlay);
  }
  const setLayerOpacity = (val:number):void => {
    let layer:any = tileLayerList[layerIndex];
    layer && layer.setOpacity(val)
  }

  const destory = ():void => {
    delete gyMapResultObj[type]
  }
  let result: Ref<UnwrapRef<mapObj>> = ref({
    contentId: type,
    map,
    view,
    mapFinish,
    zoom,
    init,
    zoomSetFun,
    zoomAddFun,
    zoomSubFun,
    changeMapLayer,
    changeCenterPoint,
    drawHtmlToMap,
    removeOverlay,
    setLayerOpacity,
    destory,
  });
  gyMapResultObj[type] = result;
  return result
}

const gyMap = (type:string):Ref<UnwrapRef<mapObj>> => {
  if( gyMapResultObj[type]){
    return  gyMapResultObj[type];
  }
  return gyMapInit.call(this, type);
};

export default gyMap;

export type gyMapType = mapObj
export type MapOptType = MapOpt
