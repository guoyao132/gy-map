import type olStyleType from "ol/style"
import type {StyleFunction} from "ol/style/Style"
import type {Geometry} from "ol/geom"
import type {Vector} from "ol/source"
import type {Vector as layerVector} from "ol/layer"
import type {Feature} from "ol"
import type {ComputedRef, UnwrapRef, Ref} from 'vue-demi'
import feature from "ol/Feature";
import VectorSource from 'ol/source/Vector';
import VectorLayer from "ol/layer/Vector";
import {computed, watch} from 'vue-demi'
import type {gyMapType} from '../../index';
import {gyMap} from '../../index';

export type layerType = layerVector<VectorSource> | null;
export type StyleType = StyleFunction | olStyleType.Style[] | olStyleType.Style | undefined;

class createOlLayer {
  style: StyleType;
  geometry: Geometry | undefined;
  feature: Feature;
  mapId: string;
  source: Vector | undefined;
  layer: any;
  minZoom: ComputedRef<number>;
  maxZoom: ComputedRef<number>;
  olPositions: ComputedRef<number[]>;
  opacity: ComputedRef<number>;
  declutter: boolean;
  zIndex: number | undefined;
  stylesObj: any;
  gyMapObj: Ref<UnwrapRef<gyMapType>>;
  mapFinish: ComputedRef<boolean>;
  isDraw: boolean;

  constructor(id: string, stylesObj: any) {
    this.style = undefined;
    this.geometry = undefined;
    this.feature = new feature();
    this.mapId = '';
    this.source = undefined;
    this.layer = null;
    this.minZoom = computed(() => stylesObj.minZoom)
    this.maxZoom = computed(() => stylesObj.maxZoom)
    this.opacity = computed(() => stylesObj.opacity)
    this.olPositions = computed(() => stylesObj.position)
    this.declutter = stylesObj.declutter;
    this.stylesObj = stylesObj;
    this.zIndex = undefined;
    this.gyMapObj = gyMap(id);
    this.mapFinish = computed(() => this.gyMapObj.value && this.gyMapObj.value.mapFinish);
    this.isDraw = false;
  }

  init() {

  }

  draw() {
    this.geometry = this.getGeometry();
    this.addFeature();
    this.setStyle();
    this.addSource();
    this.addLayer()
    this.addWatchFun()
    this.addLayerToMap()
  }

  addFeature(){
    this.feature = new feature({
      geometry: this.geometry,
    })
  }

  addSource(){
    this.source = new VectorSource({
      features: [this.feature],
    })
  }

  addLayer() {
    this.layer = new VectorLayer({
      source: this.source,
      declutter: this.declutter,
      minZoom: this.minZoom.value,
      maxZoom: this.maxZoom.value,
      opacity: this.opacity.value,
    });
  }

  addLayerToMap() {
    if(!this.isDraw && this.mapFinish.value){
      this.isDraw = true;
      this.gyMapObj.value?.map?.addLayer(this.layer)
    }
  }

  addWatchFun() {
    watch(this.mapFinish, (n) => {
      this.addLayerToMap();
    })
    this.addLayerWatch();
    this.addPropsWatch();
  }

  addLayerWatch(){
    watch(this.minZoom, (n) => {
      this.layer?.setMinZoom(n);
    })
    watch(this.maxZoom, (n) => {
      this.layer?.setMaxZoom(n);
    })
    watch(this.opacity, (n) => {
      this.layer?.setOpacity(n);
    })
    watch(this.olPositions, (n) => {
      this.setGeoPosition(n);
    })
  }

  addPropsWatch(){
    watch(this.stylesObj, () => {
      this.setStyle();
    })
  }

  getGeometry(): Geometry | undefined {
    return undefined;
  }

  setGeoPosition(position:number[]){}

  getStyle(): StyleType {
    return undefined;
  }

  setStyle() {
    this.style = this.getStyle();
    if(this.style && this.feature)
      this.feature.setStyle(this.style)
  }

  destory() {
    this.gyMapObj.value?.map?.removeLayer(this.layer);
    this.layer = null;
    this.isDraw = false;
  }
}

export default createOlLayer;
const layerProps = {
  isAuto: {
    type: Boolean,
    default: false,
  },
  declutter: {
    type: Boolean,
    default: false,
  },
  minZoom: {
    type: Number,
    default: 1,
  },
  maxZoom: {
    type: Number,
    default: 18,
  },
  opacity: {
    type: Number,
    default: 1,
  },
}
export {
  layerProps as olLayerProps,
}
