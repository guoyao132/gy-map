import CreateOlLayer, {olLayerProps} from './CreateOlLayer'
import type {StyleType} from './CreateOlLayer'
import type {Geometry} from "ol/geom"
import {Point} from 'ol/geom'
import {Style, Stroke, Fill, Image, Icon} from 'ol/style'
import gyMapUtils from "../gyMapUtils";
import type {PropType, ComputedRef} from 'vue-demi';
import {computed} from 'vue-demi'
export interface TextStyle {
  src: string | undefined;
  anchor?: number[];
  displacement?: number[] | undefined;
  scale?: number;
  rotation?: number;
  isAuto?: boolean;
}
class CreateTextLayer extends CreateOlLayer{
  position: ComputedRef<number[]>;
  src:  ComputedRef<TextStyle['src']>;
  anchor:  ComputedRef<TextStyle['anchor']>;
  displacement:  ComputedRef<TextStyle['displacement']>;
  scale:  ComputedRef<TextStyle['scale']>;
  rotation:  ComputedRef<TextStyle['rotation']>;
  isAuto:  ComputedRef<TextStyle['isAuto']>;
  constructor(id:string, position:number[], stylesObj : any) {
    super(id, stylesObj);
    this.position = computed(() => gyMapUtils.formatLonLatToPosition(position));
    this.src = computed(() => stylesObj.src);
    this.anchor = computed(() => stylesObj.anchor);
    this.displacement = computed(() => stylesObj.displacement);
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
      image: new Icon({
        crossOrigin: 'anonymous',
        src: this.src.value,
        anchor: this.anchor.value,
        displacement: this.displacement.value,
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

export default CreateTextLayer;
const layerProps = {
  ...olLayerProps,
  position: {
    type: Array as PropType<number[]>,
    default: () => ([])
  },
  src:  {
    type: String,
    default: '',
  },
  anchor:  {
    type: Array as PropType<number[]>,
    default: () => ([0.5, 0.5]),
  },
  displacement:  {
    type: Array as PropType<number[]>,
    default: () => ([0,0]),
  },
  scale:  {
    type: Number,
    default: 1,
  },
  rotation:  {
    type: Number,
    default: 0,
  },
}
export {
  layerProps,
}
