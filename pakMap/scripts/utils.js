const fs = require('fs')
const path = require('path')
const dir = path.resolve(__dirname, '..', 'lib')
function loadModule(name) {
  try {
    return require(name)
  } catch (e) {
    return undefined
  }
}

function copy(name, version) {
  const src = path.join(dir, `v${version}`, name)
  const dest = path.join(dir, name)
  let content = fs.readFileSync(src, 'utf-8')
  try {
    fs.unlinkSync(dest)
  } catch (error) { }
  fs.writeFileSync(dest, content, 'utf-8')
}

function updateVue2API() {
  const ignoreList = ['version', 'default']
  const VCA = loadModule('@vue/composition-api')
  if (!VCA) {
    console.warn('[gy-map] Composition API plugin is not found. Please run "npm install @vue/composition-api" to install.')
    return
  }
}

function switchVersion(version) {
  copy('gy-map.cjs.js', version)
  copy('gy-map.es.js', version)
  copy('gy-map.umd.js', version)
  copy('style.css', version)

  if (version === 2)
    updateVue2API()
}


module.exports.loadModule = loadModule
module.exports.switchVersion = switchVersion
