import * as components from './components'
import gyMap from './hooks/gyMap'
import type {App} from 'vue-demi'

let install:any = (Vue:App):void => {
  if (!install.installed) {
    const _components = Object.keys(components).map(
      (key) => components[key as keyof typeof components]
    );
    _components.forEach((component:any) => {
      if (
        (component.hasOwnProperty('name') ||
          component.hasOwnProperty('__name')) &&
        component.hasOwnProperty('setup')
      ) {
        Vue.component(component.name || component.__name, component);
      }
    });
  }
}

export default {
  install
}
export type {gyMapType, MapOptType} from './hooks/gyMap'

//引用组件
import {GyMap} from "./components/GyMap";
import {GymapHtml} from "./components/GymapHtml";
import {GymapPolygon} from "./components/GymapPolygon";
import {GymapCircle} from "./components/GymapCircle";
import {GymapDraw} from "./components/GymapDraw";
import {GymapHeat} from "./components/GymapHeat";
import {GymapImage} from "./components/GymapImage";
import {GymapLine} from "./components/GymapLine";
import {GymapTask} from "./components/GymapTask";
import {GymapText} from "./components/GymapText";
export {
  install,
  gyMap,
  GyMap,
  GymapHtml,
  GymapPolygon,
  GymapCircle,
  GymapDraw,
  GymapHeat,
  GymapImage,
  GymapLine,
  GymapTask,
  GymapText,
}

