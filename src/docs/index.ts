import type {RouteRecordRaw} from 'vue-router'
const modules = import.meta.glob('./*/*/index.ts');
const capitalizeRegex = /(?:^|[\s_-]+)\w/g;
const router: RouteRecordRaw[] = [];
let tempName = '';
const pathArr = Object.keys(modules);
pathArr.forEach(path => {
  const module = modules[path];
  tempName = path.replace(/^\.\/(.*)\/index.ts/, '$1');
  const tempNameArr = tempName.split('/');
  const type = tempNameArr[0];
  tempName = tempNameArr[1];
  tempName = tempName.replace(capitalizeRegex, (match) => match.toUpperCase())
    .replace('-', '');

  router.push({
    name: `U-Gy-${type}-${tempName}`,
    path: `/${type}/${tempName}`,
    component: module,
  })
})

export default router;
