import CreateOlLayer, {olLayerProps} from './CreateOlLayer'
import type {StyleType} from './CreateOlLayer'
import type {Geometry} from "ol/geom"
import {Point} from 'ol/geom'
import {Style, Stroke, Fill, Text} from 'ol/style'
import gyMapUtils from "../gyMapUtils";
import type {PropType, ComputedRef} from 'vue-demi';
import {computed} from 'vue-demi'
export interface TextStyle {
  text: string[] | string | undefined;
  font?: string | undefined;
  offsetX?: number | undefined;
  offsetY?: number | undefined;
  scale?: number;
  rotation?: number;
  textAlign?:  CanvasTextAlign | undefined;
  textBaseline?:  CanvasTextBaseline | undefined;
  fillColor?: string | null;
  strokeColor?: string | null;
  strokeWidth?: number | undefined;
  backgroundFillColor?: string | null;
  backgroundStrokeColor?: string | null;
  backgroundStrokeWidth?: number | undefined;
  padding?: number[],
  isAuto?: boolean;
}
class CreateTextLayer extends CreateOlLayer{
  position: ComputedRef<number[]>;
  text:  ComputedRef<TextStyle['text']>;
  font:  ComputedRef<TextStyle['font']>;
  offsetX:  ComputedRef<TextStyle['offsetX']>;
  offsetY:  ComputedRef<TextStyle['offsetY']>;
  scale:  ComputedRef<TextStyle['scale']>;
  rotation:  ComputedRef<TextStyle['rotation']>;
  textAlign:  ComputedRef<TextStyle['textAlign']>;
  textBaseline:  ComputedRef<TextStyle['textBaseline']>;
  fillColor:  ComputedRef<TextStyle['fillColor']>;
  strokeColor:  ComputedRef<TextStyle['strokeColor']>;
  strokeWidth:  ComputedRef<TextStyle['strokeWidth']>;
  backgroundFillColor:  ComputedRef<TextStyle['backgroundFillColor']>;
  backgroundStrokeColor:  ComputedRef<TextStyle['backgroundStrokeColor']>;
  backgroundStrokeWidth:  ComputedRef<TextStyle['backgroundStrokeWidth']>;
  padding:  ComputedRef<TextStyle['padding']>;
  isAuto:  ComputedRef<TextStyle['isAuto']>;
  constructor(id:string, position:number[], stylesObj : any) {
    super(id, stylesObj);
    this.position = computed(() => gyMapUtils.formatLonLatToPosition(position));
    this.text = computed(() => stylesObj.text);
    this.font = computed(() => stylesObj.font);
    this.offsetX = computed(() => stylesObj.offsetX);
    this.offsetY = computed(() => stylesObj.offsetY);
    this.scale = computed(() => stylesObj.scale);
    this.rotation = computed(() => stylesObj.rotation);
    this.textAlign = computed(() => stylesObj.textAlign);
    this.textBaseline = computed(() => stylesObj.textBaseline);
    this.fillColor = computed(() => stylesObj.fillColor);
    this.strokeColor = computed(() => stylesObj.strokeColor);
    this.strokeWidth = computed(() => stylesObj.strokeWidth);
    this.backgroundFillColor = computed(() => stylesObj.backgroundFillColor);
    this.backgroundStrokeColor = computed(() => stylesObj.backgroundStrokeColor);
    this.backgroundStrokeWidth = computed(() => stylesObj.backgroundStrokeWidth);
    this.padding = computed(() => stylesObj.padding);
    this.isAuto = computed(() => stylesObj.isAuto);
    this.draw();
  }

  getGeometry():Geometry | undefined{
    return new Point(this.position.value);
  }
  setGeoPosition(position: number[]){
    (this.geometry as Point).setCoordinates(gyMapUtils.formatLonLatToPosition(position))
  }
  getStyle():StyleType{
    const s = new Style({
      text: new Text({
        text: this.text.value,
        font: this.font.value,
        offsetX: this.offsetX.value,
        offsetY: this.offsetY.value,
        placement: "point",
        scale: this.scale.value,
        rotation: this.rotation.value,
        textAlign: this.textAlign.value,
        textBaseline: this.textBaseline.value,
        fill: this.fillColor.value ? new Fill({
          color: this.fillColor.value,
        }) : undefined,
        stroke: this.strokeColor.value ? new Stroke({
          color: this.strokeColor.value,
          width: this.strokeWidth.value,
        }) : undefined,
        backgroundFill: this.backgroundFillColor.value ? new Fill({
          color: this.backgroundFillColor.value,
        }) : undefined,
        backgroundStroke: this.backgroundStrokeColor.value ? new Stroke({
          color: this.backgroundStrokeColor.value,
          width: this.backgroundStrokeWidth.value,
        }): undefined,
        padding: this.padding.value,
      })
    });
    return this.isAuto.value ? (feature, resolution) => {
      s.getText().setScale(1/Math.pow(resolution, 1))
      return s;
    } : s
  }
}

export default CreateTextLayer;
const layerProps = {
  ...olLayerProps,
  position: {
    type: Array as PropType<number[]>,
    default: () => ([])
  },
  text: {
    type: String,
    default: '',
  },
  font: {
    type: String,
    default: '',
  },
  offsetX: {
    type: Number,
    default: 0,
  },
  offsetY: {
    type: Number,
    default: 0,
  },
  scale: {
    type: Number,
    default: 1,
  },
  rotation: {
    type: Number,
    default: 0,
  },
  textAlign: {
    type: String as PropType<CanvasTextAlign>,
    default: '',
  },
  textBaseline: {
    type: String as PropType<CanvasTextBaseline>,
    default: '',
  },
  fillColor: {
    type: String,
    default: '',
  },
  strokeColor: {
    type: String,
    default: '',
  },
  strokeWidth: {
    type: Number,
    default: 5,
  },
  backgroundFillColor: {
    type: String,
    default: '',
  },
  backgroundStrokeColor: {
    type: String,
    default: '',
  },
  backgroundStrokeWidth: {
    type: Number,
    default: 5,
  },
  padding: {
    type: Array,
    default: () => ([0,0,0,0]),
  },
}
export {
  layerProps,
}
