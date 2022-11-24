import * as components from './components'
import gyMap from './hooks/gyMap'
import type {App} from 'vue'

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
export {gyMap};
export type {gyMapType, MapOptType} from './hooks/gyMap'

//引用组件
// import Gymap from "./components/Gymap";
// import GymapHtml from "./components/GymapHtml";
// import GymapPolygon from "./components/GymapPolygon";
// export {
//   install,
//   gyMap,
//   Gymap,
//   GymapHtml,
//   GymapPolygon,
// }

