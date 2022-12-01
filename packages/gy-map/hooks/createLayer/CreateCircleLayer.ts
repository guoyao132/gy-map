import CreateOlLayer, {olLayerProps} from './CreateOlLayer'
import type {StyleType} from './CreateOlLayer'
import type {Geometry} from "ol/geom"
import {Point} from 'ol/geom'
import {Style, Stroke, Fill, Circle} from 'ol/style'
import gyMapUtils from "../gyMapUtils";
import type {PropType, ComputedRef} from 'vue-demi';
import {computed} from 'vue-demi'
interface CircleStyle {
  radius: number | undefined;
  fillColor?: string | null;
  strokeColor?: string | null;
  strokeWidth?: number | undefined;
  lineDash?: number[] | null;
  scale?: number[] | number | undefined;
  rotation?:  number | undefined;
  declutter?: boolean;
  isAuto?: boolean;
}

class CreateCircleLayer extends CreateOlLayer{
  position: ComputedRef<number[]>;
  fillColor: ComputedRef<CircleStyle['fillColor']>;
  strokeColor: ComputedRef<CircleStyle['strokeColor']>;
  strokeWidth: ComputedRef<CircleStyle['strokeWidth']>;
  lineDash: ComputedRef<CircleStyle['lineDash']>;
  radius: ComputedRef<CircleStyle['radius']>;
  scale: ComputedRef<CircleStyle['scale']>;
  rotation: ComputedRef<CircleStyle['rotation']>;
  isAuto:  ComputedRef<CircleStyle['isAuto']>;
  constructor(id:string, position:number[], stylesObj: any) {
    super(id, stylesObj);
    this.position = computed(() => gyMapUtils.formatLonLatToPosition(position));
    this.fillColor = computed(() => stylesObj.fillColor);
    this.strokeColor = computed(() => stylesObj.strokeColor);
    this.strokeWidth = computed(() => stylesObj.strokeWidth);
    this.radius = computed(() => stylesObj.radius);
    this.lineDash = computed(() => stylesObj.lineDash);
    this.scale = computed(() => stylesObj.scale);
    this.rotation = computed(() => stylesObj.rotation);
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
      image: new Circle({
        radius: this.radius.value || 5,
        fill: this.fillColor.value ? new Fill({
          color: this.fillColor.value,
        }) : undefined,
        stroke: this.strokeColor.value ? new Stroke({
          color: this.strokeColor.value,
          width: this.strokeWidth.value,
        }) : undefined,
        scale: this.scale.value,
        rotation: this.rotation.value,
      })
    });
    return this.isAuto.value ? (feature, resolution) => {
      s.getImage().setScale(1/Math.pow(resolution, 1))
      return s;
    } : s
  }
}

export default CreateCircleLayer;
const layerProps = {
  ...olLayerProps,
  position: {
    type: Array as PropType<number[]>,
    default: () => ([])
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
    default: 3,
  },
  scale: {
    type: [Number, Array],
    default: 1,
  },
  radius: {
    type: Number,
    default: 5,
  },
  rotation: {
    type: Number,
    default: 0,
  },
}

export {
  layerProps,
}
