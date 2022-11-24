import type {App} from 'vue'
import * as components from './components'

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
  install,
}
