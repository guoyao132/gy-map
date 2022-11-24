import CreateOlLayer from './CreateOlLayer'
import {Point} from 'ol/geom'
import {Heatmap as HeatMapLayer, Tile} from 'ol/layer'
import gyMapUtils from "../gyMapUtils";
import type {PropType, ComputedRef} from "vue";
import {computed, watch} from "vue"
import VectorSource from "ol/source/Vector";
import feature from "ol/Feature";
import type {Feature} from "ol";
import type {Point as PointType} from "ol/geom";
import type {Vector} from "ol/source";

class CreateHeatMapLayer extends CreateOlLayer{
  visible: ComputedRef<boolean>;
  gradien: string[];
  radius: ComputedRef<number>;
  blur: ComputedRef<number>;
  weight: any;
  heatMapData: ComputedRef<Array<number[]>>;
  maxValue: number;
  minValue: number;
  subValue: number;

  constructor(id:string, position:number[], stylesObj : any) {
    super(id, stylesObj);
    this.gradien = stylesObj.gradien;
    this.weight = stylesObj.weight;
    this.maxValue = stylesObj.maxValue;
    this.minValue = stylesObj.minValue;

    this.heatMapData = computed(() => stylesObj.data);
    this.visible = computed(() => stylesObj.visible);
    this.radius = computed(() => stylesObj.radius);
    this.blur = computed(() => stylesObj.blur);
    this.minZoom = computed(() => stylesObj.minZoom)
    this.maxZoom = computed(() => stylesObj.maxZoom)
    this.opacity = computed(() => stylesObj.opacity)
    this.subValue = 0;
    this.formatMinMaxValue();
    this.draw();
  }

  formatMinMaxValue(){
    if(this.minValue < 0){
      this.subValue = Math.abs(this.minValue);
      this.minValue = 0;
      this.maxValue = gyMapUtils.flortAdd(this.maxValue, this.subValue);
    }
  }

  checkData():boolean{
    if(this.heatMapData.value.length !== 0){
      let fitstData = this.heatMapData.value[0];
      if(Array.isArray(fitstData)){
        if(fitstData.length < 3){
          console.error('请传入正确的数据格式！')
          return false
        }
        return true
      }else{
        console.error('请传入正确的数据格式！')
        return false
      }
    }
    return true
  }


  addFeature(){}

  addFeatures():Feature[]{
    let features:Feature[] = []
    if(this.checkData()){
      features = this.heatMapData.value.map((data:Array<number>):Feature => {
        let lonlat = [data[0], data[1]];
        const geo = new Point(gyMapUtils.formatLonLatToPosition(lonlat));
        return new feature({
          geometry: geo,
          data: data,
        })
      })
    }
    return features;
  }


  addSource(){}

  addLayer() {
    let weightHandler = this.weight ?
      (feature:Feature) => this.weight(feature.get('data'), feature)
      : (feature:Feature) => {
        const item = feature.get('data') || [];
        let value:number = item[2];
        if(this.subValue !== 0){
          value = gyMapUtils.flortAdd(value, this.subValue);
        }
        if(value > this.maxValue){
          return 1;
        }else if(value < this.minValue){
          return 0;
        }else{
          return value / this.maxValue
        }
      }
    let features = this.addFeatures();
    let source = new VectorSource({
      features: features
    }) as Vector<PointType>;
    console.log(features);
    console.log(this.layer);
    this.layer = new HeatMapLayer({
      source: source,
      blur: this.blur.value,
      radius: this.radius.value,
      visible: this.visible.value,
      gradient: this.gradien,
      weight: weightHandler,
      minZoom: this.minZoom.value,
      maxZoom: this.maxZoom.value,
      opacity: this.opacity.value,
    })
    console.log(this.layer);
  }

  addLayerWatch(){
    watch(this.heatMapData, (n) => {
      this.destory();
      this.addLayer()
      this.addLayerToMap()
    })
    watch(this.visible, (n) => {
      this.layer?.setVisible(n);
    })
    watch(this.radius, (n) => {
      this.layer?.setRadius(n);
    })
    watch(this.blur, (n) => {
      this.layer?.setBlur(n);
    })
    watch(this.minZoom, (n) => {
      this.layer?.setMinZoom(n);
    })
    watch(this.maxZoom, (n) => {
      this.layer?.setMaxZoom(n);
    })
    watch(this.opacity, (n) => {
      this.layer?.setOpacity(n);
    })
  }

  addPropsWatch(){
    watch(this.stylesObj, () => {
      // vector.setBlur(parseInt(blur.value, 10));
    })
  }
}

export default CreateHeatMapLayer;
const layerProps = {
  data: {
    type: Array,
    default: () => ([]),
  },
  visible: {
    type: Boolean,
    default: true,
  },
  gradien: {
    type: Array as PropType<Array<string>>,
    default: () => (['#00f', '#0ff', '#0f0', '#ff0', '#f00']),
  },
  radius: {
    type: Number,
    default: 100,
  },
  blur: {
    type: Number,
    default: 100,
  },
  maxValue: {
    type: Number,
    default: 1,
  },
  minValue: {
    type: Number,
    default: 0,
  },
  subValue: {
    type: Number,
    default: 0,
  },
  weight: {
    type: [String, Function],
    default: '',
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
  layerProps,
}
