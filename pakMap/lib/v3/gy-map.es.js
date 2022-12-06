var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
import { defineComponent, onMounted, watch, onBeforeUnmount, ref, getCurrentInstance, computed, onBeforeMount, markRaw } from "vue-demi";
import { openBlock, createElementBlock, renderSlot, withDirectives, createElementVNode, vShow, createTextVNode, Fragment, renderList, normalizeClass, toDisplayString } from "vue";
const _sfc_main$9 = defineComponent({
  name: "Gymap",
  props: {
    mapOpt: {
      type: Object,
      default: () => ({})
    },
    center: {
      type: Array,
      default: () => []
    },
    maplayerIndex: {
      type: Number,
      default: 0
    },
    zoom: {
      type: Number,
      default: 0
    },
    layerOpacity: {
      type: Number,
      default: 1
    },
    id: {
      type: String,
      default: "map"
    }
  },
  setup(props) {
    const gyMapObj = gyMap$1(props.id).value;
    onMounted(() => {
      gyMapObj.init(props.id, {
        ...props.mapOpt,
        maplayerIndex: props.maplayerIndex,
        zoom: props.zoom,
        centerPoint: props.center,
        layerOpacity: props.layerOpacity
      });
    });
    const mouseenterFun = () => {
      const contentIdDom = document.getElementById(props.id);
      if (contentIdDom) {
        contentIdDom.focus();
      }
    };
    watch(() => props.zoom, (n) => {
      gyMapObj && gyMapObj.zoomSetFun(n);
    });
    watch(() => props.maplayerIndex, (n) => {
      gyMapObj && gyMapObj.changeMapLayer(n);
    });
    watch(() => props.center, (n) => {
      gyMapObj && gyMapObj.changeCenterPoint(n);
    });
    watch(() => props.layerOpacity, (n) => {
      gyMapObj && gyMapObj.setLayerOpacity(n);
    });
    onBeforeUnmount(() => {
      gyMapObj && gyMapObj.destory();
    });
    return {
      id: props.id,
      gyMapObj,
      mouseenterFun
    };
  }
});
const Gymap_vue_vue_type_style_index_0_scoped_58bc85b3_lang = "";
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _hoisted_1$2 = ["id"];
function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    id: _ctx.id,
    class: "map divMap",
    tabindex: "0",
    onMouseenter: _cache[0] || (_cache[0] = (...args) => _ctx.mouseenterFun && _ctx.mouseenterFun(...args))
  }, [
    renderSlot(_ctx.$slots, "default", {}, void 0, true)
  ], 40, _hoisted_1$2);
}
const Gymap = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$9], ["__scopeId", "data-v-58bc85b3"]]);
const METERS_PER_UNIT$1 = {
  "radians": 6370997 / (2 * Math.PI),
  "degrees": 2 * Math.PI * 6370997 / 360,
  "ft": 0.3048,
  "m": 1,
  "us-ft": 1200 / 3937
};
class Projection {
  constructor(options) {
    this.code_ = options.code;
    this.units_ = options.units;
    this.extent_ = options.extent !== void 0 ? options.extent : null;
    this.worldExtent_ = options.worldExtent !== void 0 ? options.worldExtent : null;
    this.axisOrientation_ = options.axisOrientation !== void 0 ? options.axisOrientation : "enu";
    this.global_ = options.global !== void 0 ? options.global : false;
    this.canWrapX_ = !!(this.global_ && this.extent_);
    this.getPointResolutionFunc_ = options.getPointResolution;
    this.defaultTileGrid_ = null;
    this.metersPerUnit_ = options.metersPerUnit;
  }
  canWrapX() {
    return this.canWrapX_;
  }
  getCode() {
    return this.code_;
  }
  getExtent() {
    return this.extent_;
  }
  getUnits() {
    return this.units_;
  }
  getMetersPerUnit() {
    return this.metersPerUnit_ || METERS_PER_UNIT$1[this.units_];
  }
  getWorldExtent() {
    return this.worldExtent_;
  }
  getAxisOrientation() {
    return this.axisOrientation_;
  }
  isGlobal() {
    return this.global_;
  }
  setGlobal(global) {
    this.global_ = global;
    this.canWrapX_ = !!(global && this.extent_);
  }
  getDefaultTileGrid() {
    return this.defaultTileGrid_;
  }
  setDefaultTileGrid(tileGrid) {
    this.defaultTileGrid_ = tileGrid;
  }
  setExtent(extent) {
    this.extent_ = extent;
    this.canWrapX_ = !!(this.global_ && extent);
  }
  setWorldExtent(worldExtent) {
    this.worldExtent_ = worldExtent;
  }
  setGetPointResolution(func) {
    this.getPointResolutionFunc_ = func;
  }
  getPointResolutionFunc() {
    return this.getPointResolutionFunc_;
  }
}
const Projection$1 = Projection;
const RADIUS$1 = 6378137;
const HALF_SIZE = Math.PI * RADIUS$1;
const EXTENT$1 = [-HALF_SIZE, -HALF_SIZE, HALF_SIZE, HALF_SIZE];
const WORLD_EXTENT = [-180, -85, 180, 85];
const MAX_SAFE_Y = RADIUS$1 * Math.log(Math.tan(Math.PI / 2));
class EPSG3857Projection extends Projection$1 {
  constructor(code) {
    super({
      code,
      units: "m",
      extent: EXTENT$1,
      global: true,
      worldExtent: WORLD_EXTENT,
      getPointResolution: function(resolution, point) {
        return resolution / Math.cosh(point[1] / RADIUS$1);
      }
    });
  }
}
const PROJECTIONS$1 = [
  new EPSG3857Projection("EPSG:3857"),
  new EPSG3857Projection("EPSG:102100"),
  new EPSG3857Projection("EPSG:102113"),
  new EPSG3857Projection("EPSG:900913"),
  new EPSG3857Projection("http://www.opengis.net/def/crs/EPSG/0/3857"),
  new EPSG3857Projection("http://www.opengis.net/gml/srs/epsg.xml#3857")
];
function fromEPSG4326(input, output, dimension) {
  const length = input.length;
  dimension = dimension > 1 ? dimension : 2;
  if (output === void 0) {
    if (dimension > 2) {
      output = input.slice();
    } else {
      output = new Array(length);
    }
  }
  for (let i = 0; i < length; i += dimension) {
    output[i] = HALF_SIZE * input[i] / 180;
    let y = RADIUS$1 * Math.log(Math.tan(Math.PI * (+input[i + 1] + 90) / 360));
    if (y > MAX_SAFE_Y) {
      y = MAX_SAFE_Y;
    } else if (y < -MAX_SAFE_Y) {
      y = -MAX_SAFE_Y;
    }
    output[i + 1] = y;
  }
  return output;
}
function toEPSG4326(input, output, dimension) {
  const length = input.length;
  dimension = dimension > 1 ? dimension : 2;
  if (output === void 0) {
    if (dimension > 2) {
      output = input.slice();
    } else {
      output = new Array(length);
    }
  }
  for (let i = 0; i < length; i += dimension) {
    output[i] = 180 * input[i] / HALF_SIZE;
    output[i + 1] = 360 * Math.atan(Math.exp(input[i + 1] / RADIUS$1)) / Math.PI - 90;
  }
  return output;
}
const RADIUS = 6378137;
const EXTENT = [-180, -90, 180, 90];
const METERS_PER_UNIT = Math.PI * RADIUS / 180;
class EPSG4326Projection extends Projection$1 {
  constructor(code, axisOrientation) {
    super({
      code,
      units: "degrees",
      extent: EXTENT,
      axisOrientation,
      global: true,
      metersPerUnit: METERS_PER_UNIT,
      worldExtent: EXTENT
    });
  }
}
const PROJECTIONS = [
  new EPSG4326Projection("CRS:84"),
  new EPSG4326Projection("EPSG:4326", "neu"),
  new EPSG4326Projection("urn:ogc:def:crs:OGC:1.3:CRS84"),
  new EPSG4326Projection("urn:ogc:def:crs:OGC:2:84"),
  new EPSG4326Projection("http://www.opengis.net/def/crs/OGC/1.3/CRS84"),
  new EPSG4326Projection("http://www.opengis.net/gml/srs/epsg.xml#4326", "neu"),
  new EPSG4326Projection("http://www.opengis.net/def/crs/EPSG/0/4326", "neu")
];
let cache = {};
function get$3(code) {
  return cache[code] || cache[code.replace(/urn:(x-)?ogc:def:crs:EPSG:(.*:)?(\w+)$/, "EPSG:$3")] || null;
}
function add$2(code, projection) {
  cache[code] = projection;
}
function clear(object) {
  for (const property in object) {
    delete object[property];
  }
}
function isEmpty$1(object) {
  let property;
  for (property in object) {
    return false;
  }
  return !property;
}
let transforms = {};
function add$1(source, destination, transformFn) {
  const sourceCode = source.getCode();
  const destinationCode = destination.getCode();
  if (!(sourceCode in transforms)) {
    transforms[sourceCode] = {};
  }
  transforms[sourceCode][destinationCode] = transformFn;
}
function get$2(sourceCode, destinationCode) {
  let transform2;
  if (sourceCode in transforms && destinationCode in transforms[sourceCode]) {
    transform2 = transforms[sourceCode][destinationCode];
  }
  return transform2;
}
const Relationship = {
  UNKNOWN: 0,
  INTERSECTING: 1,
  ABOVE: 2,
  RIGHT: 4,
  BELOW: 8,
  LEFT: 16
};
const messages = {
  1: "The view center is not defined",
  2: "The view resolution is not defined",
  3: "The view rotation is not defined",
  4: "`image` and `src` cannot be provided at the same time",
  5: "`imgSize` must be set when `image` is provided",
  7: "`format` must be set when `url` is set",
  8: "Unknown `serverType` configured",
  9: "`url` must be configured or set using `#setUrl()`",
  10: "The default `geometryFunction` can only handle `Point` geometries",
  11: "`options.featureTypes` must be an Array",
  12: "`options.geometryName` must also be provided when `options.bbox` is set",
  13: "Invalid corner",
  14: "Invalid color",
  15: "Tried to get a value for a key that does not exist in the cache",
  16: "Tried to set a value for a key that is used already",
  17: "`resolutions` must be sorted in descending order",
  18: "Either `origin` or `origins` must be configured, never both",
  19: "Number of `tileSizes` and `resolutions` must be equal",
  20: "Number of `origins` and `resolutions` must be equal",
  22: "Either `tileSize` or `tileSizes` must be configured, never both",
  24: "Invalid extent or geometry provided as `geometry`",
  25: "Cannot fit empty extent provided as `geometry`",
  26: "Features must have an id set",
  27: "Features must have an id set",
  28: '`renderMode` must be `"hybrid"` or `"vector"`',
  30: "The passed `feature` was already added to the source",
  31: "Tried to enqueue an `element` that was already added to the queue",
  32: "Transformation matrix cannot be inverted",
  33: "Invalid units",
  34: "Invalid geometry layout",
  36: "Unknown SRS type",
  37: "Unknown geometry type found",
  38: "`styleMapValue` has an unknown type",
  39: "Unknown geometry type",
  40: "Expected `feature` to have a geometry",
  41: "Expected an `ol/style/Style` or an array of `ol/style/Style.js`",
  42: "Question unknown, the answer is 42",
  43: "Expected `layers` to be an array or a `Collection`",
  47: "Expected `controls` to be an array or an `ol/Collection`",
  48: "Expected `interactions` to be an array or an `ol/Collection`",
  49: "Expected `overlays` to be an array or an `ol/Collection`",
  50: "`options.featureTypes` should be an Array",
  51: "Either `url` or `tileJSON` options must be provided",
  52: "Unknown `serverType` configured",
  53: "Unknown `tierSizeCalculation` configured",
  55: "The {-y} placeholder requires a tile grid with extent",
  56: "mapBrowserEvent must originate from a pointer event",
  57: "At least 2 conditions are required",
  59: "Invalid command found in the PBF",
  60: "Missing or invalid `size`",
  61: "Cannot determine IIIF Image API version from provided image information JSON",
  62: "A `WebGLArrayBuffer` must either be of type `ELEMENT_ARRAY_BUFFER` or `ARRAY_BUFFER`",
  64: "Layer opacity must be a number",
  66: "`forEachFeatureAtCoordinate` cannot be used on a WebGL layer if the hit detection logic has not been enabled. This is done by providing adequate shaders using the `hitVertexShader` and `hitFragmentShader` properties of `WebGLPointsLayerRenderer`",
  67: "A layer can only be added to the map once. Use either `layer.setMap()` or `map.addLayer()`, not both",
  68: "A VectorTile source can only be rendered if it has a projection compatible with the view projection"
};
class AssertionError extends Error {
  constructor(code) {
    const message = messages[code];
    super(message);
    this.code = code;
    this.name = "AssertionError";
    this.message = message;
  }
}
const AssertionError$1 = AssertionError;
function assert(assertion, errorCode) {
  if (!assertion) {
    throw new AssertionError$1(errorCode);
  }
}
function boundingExtent(coordinates2) {
  const extent = createEmpty();
  for (let i = 0, ii = coordinates2.length; i < ii; ++i) {
    extendCoordinate(extent, coordinates2[i]);
  }
  return extent;
}
function buffer(extent, value, dest) {
  if (dest) {
    dest[0] = extent[0] - value;
    dest[1] = extent[1] - value;
    dest[2] = extent[2] + value;
    dest[3] = extent[3] + value;
    return dest;
  } else {
    return [
      extent[0] - value,
      extent[1] - value,
      extent[2] + value,
      extent[3] + value
    ];
  }
}
function clone(extent, dest) {
  if (dest) {
    dest[0] = extent[0];
    dest[1] = extent[1];
    dest[2] = extent[2];
    dest[3] = extent[3];
    return dest;
  } else {
    return extent.slice();
  }
}
function closestSquaredDistanceXY(extent, x, y) {
  let dx, dy;
  if (x < extent[0]) {
    dx = extent[0] - x;
  } else if (extent[2] < x) {
    dx = x - extent[2];
  } else {
    dx = 0;
  }
  if (y < extent[1]) {
    dy = extent[1] - y;
  } else if (extent[3] < y) {
    dy = y - extent[3];
  } else {
    dy = 0;
  }
  return dx * dx + dy * dy;
}
function containsCoordinate(extent, coordinate) {
  return containsXY(extent, coordinate[0], coordinate[1]);
}
function containsExtent(extent1, extent2) {
  return extent1[0] <= extent2[0] && extent2[2] <= extent1[2] && extent1[1] <= extent2[1] && extent2[3] <= extent1[3];
}
function containsXY(extent, x, y) {
  return extent[0] <= x && x <= extent[2] && extent[1] <= y && y <= extent[3];
}
function coordinateRelationship(extent, coordinate) {
  const minX = extent[0];
  const minY = extent[1];
  const maxX = extent[2];
  const maxY = extent[3];
  const x = coordinate[0];
  const y = coordinate[1];
  let relationship = Relationship.UNKNOWN;
  if (x < minX) {
    relationship = relationship | Relationship.LEFT;
  } else if (x > maxX) {
    relationship = relationship | Relationship.RIGHT;
  }
  if (y < minY) {
    relationship = relationship | Relationship.BELOW;
  } else if (y > maxY) {
    relationship = relationship | Relationship.ABOVE;
  }
  if (relationship === Relationship.UNKNOWN) {
    relationship = Relationship.INTERSECTING;
  }
  return relationship;
}
function createEmpty() {
  return [Infinity, Infinity, -Infinity, -Infinity];
}
function createOrUpdate$2(minX, minY, maxX, maxY, dest) {
  if (dest) {
    dest[0] = minX;
    dest[1] = minY;
    dest[2] = maxX;
    dest[3] = maxY;
    return dest;
  } else {
    return [minX, minY, maxX, maxY];
  }
}
function createOrUpdateEmpty(dest) {
  return createOrUpdate$2(Infinity, Infinity, -Infinity, -Infinity, dest);
}
function createOrUpdateFromCoordinate(coordinate, dest) {
  const x = coordinate[0];
  const y = coordinate[1];
  return createOrUpdate$2(x, y, x, y, dest);
}
function createOrUpdateFromFlatCoordinates(flatCoordinates, offset, end, stride, dest) {
  const extent = createOrUpdateEmpty(dest);
  return extendFlatCoordinates(extent, flatCoordinates, offset, end, stride);
}
function equals$3(extent1, extent2) {
  return extent1[0] == extent2[0] && extent1[2] == extent2[2] && extent1[1] == extent2[1] && extent1[3] == extent2[3];
}
function extend$2(extent1, extent2) {
  if (extent2[0] < extent1[0]) {
    extent1[0] = extent2[0];
  }
  if (extent2[2] > extent1[2]) {
    extent1[2] = extent2[2];
  }
  if (extent2[1] < extent1[1]) {
    extent1[1] = extent2[1];
  }
  if (extent2[3] > extent1[3]) {
    extent1[3] = extent2[3];
  }
  return extent1;
}
function extendCoordinate(extent, coordinate) {
  if (coordinate[0] < extent[0]) {
    extent[0] = coordinate[0];
  }
  if (coordinate[0] > extent[2]) {
    extent[2] = coordinate[0];
  }
  if (coordinate[1] < extent[1]) {
    extent[1] = coordinate[1];
  }
  if (coordinate[1] > extent[3]) {
    extent[3] = coordinate[1];
  }
}
function extendFlatCoordinates(extent, flatCoordinates, offset, end, stride) {
  for (; offset < end; offset += stride) {
    extendXY(extent, flatCoordinates[offset], flatCoordinates[offset + 1]);
  }
  return extent;
}
function extendXY(extent, x, y) {
  extent[0] = Math.min(extent[0], x);
  extent[1] = Math.min(extent[1], y);
  extent[2] = Math.max(extent[2], x);
  extent[3] = Math.max(extent[3], y);
}
function forEachCorner(extent, callback) {
  let val;
  val = callback(getBottomLeft(extent));
  if (val) {
    return val;
  }
  val = callback(getBottomRight(extent));
  if (val) {
    return val;
  }
  val = callback(getTopRight(extent));
  if (val) {
    return val;
  }
  val = callback(getTopLeft(extent));
  if (val) {
    return val;
  }
  return false;
}
function getArea(extent) {
  let area2 = 0;
  if (!isEmpty(extent)) {
    area2 = getWidth(extent) * getHeight(extent);
  }
  return area2;
}
function getBottomLeft(extent) {
  return [extent[0], extent[1]];
}
function getBottomRight(extent) {
  return [extent[2], extent[1]];
}
function getCenter(extent) {
  return [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2];
}
function getCorner(extent, corner) {
  let coordinate;
  if (corner === "bottom-left") {
    coordinate = getBottomLeft(extent);
  } else if (corner === "bottom-right") {
    coordinate = getBottomRight(extent);
  } else if (corner === "top-left") {
    coordinate = getTopLeft(extent);
  } else if (corner === "top-right") {
    coordinate = getTopRight(extent);
  } else {
    assert(false, 13);
  }
  return coordinate;
}
function getForViewAndSize(center, resolution, rotation, size, dest) {
  const [x0, y0, x1, y1, x2, y2, x3, y3] = getRotatedViewport(
    center,
    resolution,
    rotation,
    size
  );
  return createOrUpdate$2(
    Math.min(x0, x1, x2, x3),
    Math.min(y0, y1, y2, y3),
    Math.max(x0, x1, x2, x3),
    Math.max(y0, y1, y2, y3),
    dest
  );
}
function getRotatedViewport(center, resolution, rotation, size) {
  const dx = resolution * size[0] / 2;
  const dy = resolution * size[1] / 2;
  const cosRotation = Math.cos(rotation);
  const sinRotation = Math.sin(rotation);
  const xCos = dx * cosRotation;
  const xSin = dx * sinRotation;
  const yCos = dy * cosRotation;
  const ySin = dy * sinRotation;
  const x = center[0];
  const y = center[1];
  return [
    x - xCos + ySin,
    y - xSin - yCos,
    x - xCos - ySin,
    y - xSin + yCos,
    x + xCos - ySin,
    y + xSin + yCos,
    x + xCos + ySin,
    y + xSin - yCos,
    x - xCos + ySin,
    y - xSin - yCos
  ];
}
function getHeight(extent) {
  return extent[3] - extent[1];
}
function getIntersection(extent1, extent2, dest) {
  const intersection = dest ? dest : createEmpty();
  if (intersects$2(extent1, extent2)) {
    if (extent1[0] > extent2[0]) {
      intersection[0] = extent1[0];
    } else {
      intersection[0] = extent2[0];
    }
    if (extent1[1] > extent2[1]) {
      intersection[1] = extent1[1];
    } else {
      intersection[1] = extent2[1];
    }
    if (extent1[2] < extent2[2]) {
      intersection[2] = extent1[2];
    } else {
      intersection[2] = extent2[2];
    }
    if (extent1[3] < extent2[3]) {
      intersection[3] = extent1[3];
    } else {
      intersection[3] = extent2[3];
    }
  } else {
    createOrUpdateEmpty(intersection);
  }
  return intersection;
}
function getTopLeft(extent) {
  return [extent[0], extent[3]];
}
function getTopRight(extent) {
  return [extent[2], extent[3]];
}
function getWidth(extent) {
  return extent[2] - extent[0];
}
function intersects$2(extent1, extent2) {
  return extent1[0] <= extent2[2] && extent1[2] >= extent2[0] && extent1[1] <= extent2[3] && extent1[3] >= extent2[1];
}
function isEmpty(extent) {
  return extent[2] < extent[0] || extent[3] < extent[1];
}
function returnOrUpdate(extent, dest) {
  if (dest) {
    dest[0] = extent[0];
    dest[1] = extent[1];
    dest[2] = extent[2];
    dest[3] = extent[3];
    return dest;
  } else {
    return extent;
  }
}
function intersectsSegment(extent, start, end) {
  let intersects2 = false;
  const startRel = coordinateRelationship(extent, start);
  const endRel = coordinateRelationship(extent, end);
  if (startRel === Relationship.INTERSECTING || endRel === Relationship.INTERSECTING) {
    intersects2 = true;
  } else {
    const minX = extent[0];
    const minY = extent[1];
    const maxX = extent[2];
    const maxY = extent[3];
    const startX = start[0];
    const startY = start[1];
    const endX = end[0];
    const endY = end[1];
    const slope = (endY - startY) / (endX - startX);
    let x, y;
    if (!!(endRel & Relationship.ABOVE) && !(startRel & Relationship.ABOVE)) {
      x = endX - (endY - maxY) / slope;
      intersects2 = x >= minX && x <= maxX;
    }
    if (!intersects2 && !!(endRel & Relationship.RIGHT) && !(startRel & Relationship.RIGHT)) {
      y = endY - (endX - maxX) * slope;
      intersects2 = y >= minY && y <= maxY;
    }
    if (!intersects2 && !!(endRel & Relationship.BELOW) && !(startRel & Relationship.BELOW)) {
      x = endX - (endY - minY) / slope;
      intersects2 = x >= minX && x <= maxX;
    }
    if (!intersects2 && !!(endRel & Relationship.LEFT) && !(startRel & Relationship.LEFT)) {
      y = endY - (endX - minX) * slope;
      intersects2 = y >= minY && y <= maxY;
    }
  }
  return intersects2;
}
function wrapX$2(extent, projection) {
  const projectionExtent = projection.getExtent();
  const center = getCenter(extent);
  if (projection.canWrapX() && (center[0] < projectionExtent[0] || center[0] >= projectionExtent[2])) {
    const worldWidth = getWidth(projectionExtent);
    const worldsAway = Math.floor(
      (center[0] - projectionExtent[0]) / worldWidth
    );
    const offset = worldsAway * worldWidth;
    extent[0] -= offset;
    extent[2] -= offset;
  }
  return extent;
}
function wrapAndSliceX(extent, projection) {
  if (projection.canWrapX()) {
    const projectionExtent = projection.getExtent();
    if (!isFinite(extent[0]) || !isFinite(extent[2])) {
      return [[projectionExtent[0], extent[1], projectionExtent[2], extent[3]]];
    }
    wrapX$2(extent, projection);
    const worldWidth = getWidth(projectionExtent);
    if (getWidth(extent) > worldWidth) {
      return [[projectionExtent[0], extent[1], projectionExtent[2], extent[3]]];
    } else if (extent[0] < projectionExtent[0]) {
      return [
        [extent[0] + worldWidth, extent[1], projectionExtent[2], extent[3]],
        [projectionExtent[0], extent[1], extent[2], extent[3]]
      ];
    } else if (extent[2] > projectionExtent[2]) {
      return [
        [extent[0], extent[1], projectionExtent[2], extent[3]],
        [projectionExtent[0], extent[1], extent[2] - worldWidth, extent[3]]
      ];
    }
  }
  return [extent];
}
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
function squaredSegmentDistance(x, y, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  if (dx !== 0 || dy !== 0) {
    const t = ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy);
    if (t > 1) {
      x1 = x2;
      y1 = y2;
    } else if (t > 0) {
      x1 += dx * t;
      y1 += dy * t;
    }
  }
  return squaredDistance$1(x, y, x1, y1);
}
function squaredDistance$1(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return dx * dx + dy * dy;
}
function solveLinearSystem(mat) {
  const n = mat.length;
  for (let i = 0; i < n; i++) {
    let maxRow = i;
    let maxEl = Math.abs(mat[i][i]);
    for (let r = i + 1; r < n; r++) {
      const absValue = Math.abs(mat[r][i]);
      if (absValue > maxEl) {
        maxEl = absValue;
        maxRow = r;
      }
    }
    if (maxEl === 0) {
      return null;
    }
    const tmp = mat[maxRow];
    mat[maxRow] = mat[i];
    mat[i] = tmp;
    for (let j = i + 1; j < n; j++) {
      const coef = -mat[j][i] / mat[i][i];
      for (let k = i; k < n + 1; k++) {
        if (i == k) {
          mat[j][k] = 0;
        } else {
          mat[j][k] += coef * mat[i][k];
        }
      }
    }
  }
  const x = new Array(n);
  for (let l = n - 1; l >= 0; l--) {
    x[l] = mat[l][n] / mat[l][l];
    for (let m = l - 1; m >= 0; m--) {
      mat[m][n] -= mat[m][l] * x[l];
    }
  }
  return x;
}
function toRadians(angleInDegrees) {
  return angleInDegrees * Math.PI / 180;
}
function modulo(a, b) {
  const r = a % b;
  return r * b < 0 ? r + b : r;
}
function lerp(a, b, x) {
  return a + x * (b - a);
}
function toFixed(n, decimals) {
  const factor = Math.pow(10, decimals);
  return Math.round(n * factor) / factor;
}
function floor(n, decimals) {
  return Math.floor(toFixed(n, decimals));
}
function ceil(n, decimals) {
  return Math.ceil(toFixed(n, decimals));
}
function add(coordinate, delta) {
  coordinate[0] += +delta[0];
  coordinate[1] += +delta[1];
  return coordinate;
}
function closestOnCircle(coordinate, circle) {
  const r = circle.getRadius();
  const center = circle.getCenter();
  const x0 = center[0];
  const y0 = center[1];
  const x1 = coordinate[0];
  const y1 = coordinate[1];
  let dx = x1 - x0;
  const dy = y1 - y0;
  if (dx === 0 && dy === 0) {
    dx = 1;
  }
  const d = Math.sqrt(dx * dx + dy * dy);
  const x = x0 + r * dx / d;
  const y = y0 + r * dy / d;
  return [x, y];
}
function closestOnSegment(coordinate, segment) {
  const x0 = coordinate[0];
  const y0 = coordinate[1];
  const start = segment[0];
  const end = segment[1];
  const x1 = start[0];
  const y1 = start[1];
  const x2 = end[0];
  const y2 = end[1];
  const dx = x2 - x1;
  const dy = y2 - y1;
  const along = dx === 0 && dy === 0 ? 0 : (dx * (x0 - x1) + dy * (y0 - y1)) / (dx * dx + dy * dy || 0);
  let x, y;
  if (along <= 0) {
    x = x1;
    y = y1;
  } else if (along >= 1) {
    x = x2;
    y = y2;
  } else {
    x = x1 + along * dx;
    y = y1 + along * dy;
  }
  return [x, y];
}
function equals$2(coordinate1, coordinate2) {
  let equals2 = true;
  for (let i = coordinate1.length - 1; i >= 0; --i) {
    if (coordinate1[i] != coordinate2[i]) {
      equals2 = false;
      break;
    }
  }
  return equals2;
}
function rotate$2(coordinate, angle) {
  const cosAngle = Math.cos(angle);
  const sinAngle = Math.sin(angle);
  const x = coordinate[0] * cosAngle - coordinate[1] * sinAngle;
  const y = coordinate[1] * cosAngle + coordinate[0] * sinAngle;
  coordinate[0] = x;
  coordinate[1] = y;
  return coordinate;
}
function scale$3(coordinate, scale2) {
  coordinate[0] *= scale2;
  coordinate[1] *= scale2;
  return coordinate;
}
function squaredDistance(coord1, coord2) {
  const dx = coord1[0] - coord2[0];
  const dy = coord1[1] - coord2[1];
  return dx * dx + dy * dy;
}
function distance(coord1, coord2) {
  return Math.sqrt(squaredDistance(coord1, coord2));
}
function squaredDistanceToSegment(coordinate, segment) {
  return squaredDistance(coordinate, closestOnSegment(coordinate, segment));
}
function wrapX$1(coordinate, projection) {
  if (projection.canWrapX()) {
    const worldWidth = getWidth(projection.getExtent());
    const worldsAway = getWorldsAway(coordinate, projection, worldWidth);
    if (worldsAway) {
      coordinate[0] -= worldsAway * worldWidth;
    }
  }
  return coordinate;
}
function getWorldsAway(coordinate, projection, sourceExtentWidth) {
  const projectionExtent = projection.getExtent();
  let worldsAway = 0;
  if (projection.canWrapX() && (coordinate[0] < projectionExtent[0] || coordinate[0] > projectionExtent[2])) {
    sourceExtentWidth = sourceExtentWidth || getWidth(projectionExtent);
    worldsAway = Math.floor(
      (coordinate[0] - projectionExtent[0]) / sourceExtentWidth
    );
  }
  return worldsAway;
}
const DEFAULT_RADIUS = 63710088e-1;
function getDistance(c1, c2, radius) {
  radius = radius || DEFAULT_RADIUS;
  const lat1 = toRadians(c1[1]);
  const lat2 = toRadians(c2[1]);
  const deltaLatBy2 = (lat2 - lat1) / 2;
  const deltaLonBy2 = toRadians(c2[0] - c1[0]) / 2;
  const a = Math.sin(deltaLatBy2) * Math.sin(deltaLatBy2) + Math.sin(deltaLonBy2) * Math.sin(deltaLonBy2) * Math.cos(lat1) * Math.cos(lat2);
  return 2 * radius * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
let showCoordinateWarning = true;
function disableCoordinateWarning(disable2) {
  const hide = disable2 === void 0 ? true : disable2;
  showCoordinateWarning = !hide;
}
function cloneTransform(input, output, dimension) {
  if (output !== void 0) {
    for (let i = 0, ii = input.length; i < ii; ++i) {
      output[i] = input[i];
    }
    output = output;
  } else {
    output = input.slice();
  }
  return output;
}
function identityTransform(input, output, dimension) {
  if (output !== void 0 && input !== output) {
    for (let i = 0, ii = input.length; i < ii; ++i) {
      output[i] = input[i];
    }
    input = output;
  }
  return input;
}
function addProjection(projection) {
  add$2(projection.getCode(), projection);
  add$1(projection, projection, cloneTransform);
}
function addProjections(projections) {
  projections.forEach(addProjection);
}
function get$1(projectionLike) {
  return typeof projectionLike === "string" ? get$3(projectionLike) : projectionLike || null;
}
function getPointResolution(projection, resolution, point, units) {
  projection = get$1(projection);
  let pointResolution;
  const getter = projection.getPointResolutionFunc();
  if (getter) {
    pointResolution = getter(resolution, point);
    if (units && units !== projection.getUnits()) {
      const metersPerUnit = projection.getMetersPerUnit();
      if (metersPerUnit) {
        pointResolution = pointResolution * metersPerUnit / METERS_PER_UNIT$1[units];
      }
    }
  } else {
    const projUnits = projection.getUnits();
    if (projUnits == "degrees" && !units || units == "degrees") {
      pointResolution = resolution;
    } else {
      const toEPSG43262 = getTransformFromProjections(
        projection,
        get$1("EPSG:4326")
      );
      if (toEPSG43262 === identityTransform && projUnits !== "degrees") {
        pointResolution = resolution * projection.getMetersPerUnit();
      } else {
        let vertices = [
          point[0] - resolution / 2,
          point[1],
          point[0] + resolution / 2,
          point[1],
          point[0],
          point[1] - resolution / 2,
          point[0],
          point[1] + resolution / 2
        ];
        vertices = toEPSG43262(vertices, vertices, 2);
        const width = getDistance(vertices.slice(0, 2), vertices.slice(2, 4));
        const height = getDistance(vertices.slice(4, 6), vertices.slice(6, 8));
        pointResolution = (width + height) / 2;
      }
      const metersPerUnit = units ? METERS_PER_UNIT$1[units] : projection.getMetersPerUnit();
      if (metersPerUnit !== void 0) {
        pointResolution /= metersPerUnit;
      }
    }
  }
  return pointResolution;
}
function addEquivalentProjections(projections) {
  addProjections(projections);
  projections.forEach(function(source) {
    projections.forEach(function(destination) {
      if (source !== destination) {
        add$1(source, destination, cloneTransform);
      }
    });
  });
}
function addEquivalentTransforms(projections1, projections2, forwardTransform, inverseTransform) {
  projections1.forEach(function(projection1) {
    projections2.forEach(function(projection2) {
      add$1(projection1, projection2, forwardTransform);
      add$1(projection2, projection1, inverseTransform);
    });
  });
}
function createProjection(projection, defaultCode) {
  if (!projection) {
    return get$1(defaultCode);
  } else if (typeof projection === "string") {
    return get$1(projection);
  } else {
    return projection;
  }
}
function fromLonLat(coordinate, projection) {
  disableCoordinateWarning();
  return transform(
    coordinate,
    "EPSG:4326",
    projection !== void 0 ? projection : "EPSG:3857"
  );
}
function toLonLat(coordinate, projection) {
  const lonLat = transform(
    coordinate,
    projection !== void 0 ? projection : "EPSG:3857",
    "EPSG:4326"
  );
  const lon = lonLat[0];
  if (lon < -180 || lon > 180) {
    lonLat[0] = modulo(lon + 180, 360) - 180;
  }
  return lonLat;
}
function equivalent(projection1, projection2) {
  if (projection1 === projection2) {
    return true;
  }
  const equalUnits = projection1.getUnits() === projection2.getUnits();
  if (projection1.getCode() === projection2.getCode()) {
    return equalUnits;
  } else {
    const transformFunc = getTransformFromProjections(projection1, projection2);
    return transformFunc === cloneTransform && equalUnits;
  }
}
function getTransformFromProjections(sourceProjection, destinationProjection) {
  const sourceCode = sourceProjection.getCode();
  const destinationCode = destinationProjection.getCode();
  let transformFunc = get$2(sourceCode, destinationCode);
  if (!transformFunc) {
    transformFunc = identityTransform;
  }
  return transformFunc;
}
function getTransform(source, destination) {
  const sourceProjection = get$1(source);
  const destinationProjection = get$1(destination);
  return getTransformFromProjections(sourceProjection, destinationProjection);
}
function transform(coordinate, source, destination) {
  const transformFunc = getTransform(source, destination);
  return transformFunc(coordinate, void 0, coordinate.length);
}
function toUserCoordinate(coordinate, sourceProjection) {
  {
    return coordinate;
  }
}
function fromUserCoordinate(coordinate, destProjection) {
  {
    if (showCoordinateWarning && !equals$2(coordinate, [0, 0]) && coordinate[0] >= -180 && coordinate[0] <= 180 && coordinate[1] >= -90 && coordinate[1] <= 90) {
      showCoordinateWarning = false;
      console.warn(
        "Call useGeographic() from ol/proj once to work with [longitude, latitude] coordinates."
      );
    }
    return coordinate;
  }
}
function toUserExtent(extent, sourceProjection) {
  {
    return extent;
  }
}
function fromUserExtent(extent, destProjection) {
  {
    return extent;
  }
}
function addCommon() {
  addEquivalentProjections(PROJECTIONS$1);
  addEquivalentProjections(PROJECTIONS);
  addEquivalentTransforms(
    PROJECTIONS,
    PROJECTIONS$1,
    fromEPSG4326,
    toEPSG4326
  );
}
addCommon();
const gyMapUtils = {
  formatLonLatToPosition(lon, lat) {
    if (Array.isArray(lon)) {
      return this.formatLonLatToPosition(lon[0], lon[1]);
    } else {
      if (!lat) {
        console.error("\u8BF7\u4F20\u5165\u6B63\u786E\u7684\u53C2\u6570\uFF01");
        return [];
      }
      return fromLonLat([lon, lat]);
    }
  },
  flortAdd: function(num1, num2) {
    var r1, r2, m;
    try {
      r1 = num1.toString().split(".")[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = num2.toString().split(".")[1].length;
    } catch (e) {
      r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    return Math.round(num1 * m + num2 * m) / m;
  }
};
const _sfc_main$8 = defineComponent({
  name: "GymapHtml",
  props: {
    offset: {
      type: Array,
      default: () => [0, 0]
    },
    position: {
      type: Array,
      default: () => []
    },
    stopEvent: {
      type: Boolean,
      default: true
    },
    className: {
      type: String,
      default: ""
    }
  },
  setup(props) {
    const htmlDom = ref(null);
    const { proxy } = getCurrentInstance();
    console.log(proxy.$parent);
    const mapId = proxy.$parent.id;
    const gyMapObj = gyMap$1(mapId).value;
    const mapFinish = computed(() => gyMapObj && gyMapObj.mapFinish);
    let isDraw = false;
    watch(mapFinish, () => {
      drawDom();
    });
    let overlay = null;
    const drawDom = () => {
      if (mapFinish.value && !isDraw) {
        isDraw = true;
        overlay = gyMapObj.drawHtmlToMap(htmlDom.value, {
          offset: props.offset,
          position: props.position,
          stopEvent: props.stopEvent,
          className: props.className
        });
        const runTask = proxy.$parent.runTask;
        if (runTask) {
          runTask(overlay, props);
        }
      }
    };
    onMounted(() => {
      console.log(htmlDom.value);
      drawDom();
    });
    watch(() => props.position, (p) => {
      let pos = gyMapUtils.formatLonLatToPosition(p);
      overlay && overlay.setPosition(pos);
    });
    watch(() => props.offset, (p) => {
      overlay && overlay.setOffset(p);
    });
    onBeforeUnmount(() => {
      overlay && gyMapObj && gyMapObj.removeOverlay(overlay);
      const destoryTask = proxy.$parent.destory;
      if (destoryTask) {
        destoryTask();
      }
    });
    return {
      htmlDom,
      mapId,
      gyMapObj,
      mapFinish
    };
  }
});
const _hoisted_1$1 = {
  class: "GymapHtml",
  ref: "htmlDom"
};
function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$1, [
    renderSlot(_ctx.$slots, "default")
  ], 512);
}
const GymapHtml = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$8]]);
const ImageState = {
  IDLE: 0,
  LOADING: 1,
  LOADED: 2,
  ERROR: 3,
  EMPTY: 4
};
function abstract() {
  throw new Error("Unimplemented abstract method.");
}
let uidCounter_ = 0;
function getUid(obj) {
  return obj.ol_uid || (obj.ol_uid = String(++uidCounter_));
}
function hasArea(size) {
  return size[0] > 0 && size[1] > 0;
}
function scale$2(size, ratio, dest) {
  if (dest === void 0) {
    dest = [0, 0];
  }
  dest[0] = size[0] * ratio + 0.5 | 0;
  dest[1] = size[1] * ratio + 0.5 | 0;
  return dest;
}
function toSize(size, dest) {
  if (Array.isArray(size)) {
    return size;
  } else {
    if (dest === void 0) {
      dest = [size, size];
    } else {
      dest[0] = size;
      dest[1] = size;
    }
    return dest;
  }
}
class ImageStyle {
  constructor(options) {
    this.opacity_ = options.opacity;
    this.rotateWithView_ = options.rotateWithView;
    this.rotation_ = options.rotation;
    this.scale_ = options.scale;
    this.scaleArray_ = toSize(options.scale);
    this.displacement_ = options.displacement;
    this.declutterMode_ = options.declutterMode;
  }
  clone() {
    const scale2 = this.getScale();
    return new ImageStyle({
      opacity: this.getOpacity(),
      scale: Array.isArray(scale2) ? scale2.slice() : scale2,
      rotation: this.getRotation(),
      rotateWithView: this.getRotateWithView(),
      displacement: this.getDisplacement().slice(),
      declutterMode: this.getDeclutterMode()
    });
  }
  getOpacity() {
    return this.opacity_;
  }
  getRotateWithView() {
    return this.rotateWithView_;
  }
  getRotation() {
    return this.rotation_;
  }
  getScale() {
    return this.scale_;
  }
  getScaleArray() {
    return this.scaleArray_;
  }
  getDisplacement() {
    return this.displacement_;
  }
  getDeclutterMode() {
    return this.declutterMode_;
  }
  getAnchor() {
    return abstract();
  }
  getImage(pixelRatio) {
    return abstract();
  }
  getHitDetectionImage() {
    return abstract();
  }
  getPixelRatio(pixelRatio) {
    return 1;
  }
  getImageState() {
    return abstract();
  }
  getImageSize() {
    return abstract();
  }
  getOrigin() {
    return abstract();
  }
  getSize() {
    return abstract();
  }
  setDisplacement(displacement) {
    this.displacement_ = displacement;
  }
  setOpacity(opacity) {
    this.opacity_ = opacity;
  }
  setRotateWithView(rotateWithView) {
    this.rotateWithView_ = rotateWithView;
  }
  setRotation(rotation) {
    this.rotation_ = rotation;
  }
  setScale(scale2) {
    this.scale_ = scale2;
    this.scaleArray_ = toSize(scale2);
  }
  listenImageChange(listener) {
    abstract();
  }
  load() {
    abstract();
  }
  unlistenImageChange(listener) {
    abstract();
  }
}
const ImageStyle$1 = ImageStyle;
const HEX_COLOR_RE_ = /^#([a-f0-9]{3}|[a-f0-9]{4}(?:[a-f0-9]{2}){0,2})$/i;
const NAMED_COLOR_RE_ = /^([a-z]*)$|^hsla?\(.*\)$/i;
function asString(color) {
  if (typeof color === "string") {
    return color;
  } else {
    return toString$1(color);
  }
}
function fromNamed(color) {
  const el = document.createElement("div");
  el.style.color = color;
  if (el.style.color !== "") {
    document.body.appendChild(el);
    const rgb = getComputedStyle(el).color;
    document.body.removeChild(el);
    return rgb;
  } else {
    return "";
  }
}
const fromString = function() {
  const MAX_CACHE_SIZE = 1024;
  const cache2 = {};
  let cacheSize = 0;
  return function(s) {
    let color;
    if (cache2.hasOwnProperty(s)) {
      color = cache2[s];
    } else {
      if (cacheSize >= MAX_CACHE_SIZE) {
        let i = 0;
        for (const key in cache2) {
          if ((i++ & 3) === 0) {
            delete cache2[key];
            --cacheSize;
          }
        }
      }
      color = fromStringInternal_(s);
      cache2[s] = color;
      ++cacheSize;
    }
    return color;
  };
}();
function asArray(color) {
  if (Array.isArray(color)) {
    return color;
  } else {
    return fromString(color);
  }
}
function fromStringInternal_(s) {
  let r, g, b, a, color;
  if (NAMED_COLOR_RE_.exec(s)) {
    s = fromNamed(s);
  }
  if (HEX_COLOR_RE_.exec(s)) {
    const n = s.length - 1;
    let d;
    if (n <= 4) {
      d = 1;
    } else {
      d = 2;
    }
    const hasAlpha = n === 4 || n === 8;
    r = parseInt(s.substr(1 + 0 * d, d), 16);
    g = parseInt(s.substr(1 + 1 * d, d), 16);
    b = parseInt(s.substr(1 + 2 * d, d), 16);
    if (hasAlpha) {
      a = parseInt(s.substr(1 + 3 * d, d), 16);
    } else {
      a = 255;
    }
    if (d == 1) {
      r = (r << 4) + r;
      g = (g << 4) + g;
      b = (b << 4) + b;
      if (hasAlpha) {
        a = (a << 4) + a;
      }
    }
    color = [r, g, b, a / 255];
  } else if (s.startsWith("rgba(")) {
    color = s.slice(5, -1).split(",").map(Number);
    normalize(color);
  } else if (s.startsWith("rgb(")) {
    color = s.slice(4, -1).split(",").map(Number);
    color.push(1);
    normalize(color);
  } else {
    assert(false, 14);
  }
  return color;
}
function normalize(color) {
  color[0] = clamp(color[0] + 0.5 | 0, 0, 255);
  color[1] = clamp(color[1] + 0.5 | 0, 0, 255);
  color[2] = clamp(color[2] + 0.5 | 0, 0, 255);
  color[3] = clamp(color[3], 0, 1);
  return color;
}
function toString$1(color) {
  let r = color[0];
  if (r != (r | 0)) {
    r = r + 0.5 | 0;
  }
  let g = color[1];
  if (g != (g | 0)) {
    g = g + 0.5 | 0;
  }
  let b = color[2];
  if (b != (b | 0)) {
    b = b + 0.5 | 0;
  }
  const a = color[3] === void 0 ? 1 : Math.round(color[3] * 100) / 100;
  return "rgba(" + r + "," + g + "," + b + "," + a + ")";
}
function asColorLike(color) {
  if (Array.isArray(color)) {
    return toString$1(color);
  } else {
    return color;
  }
}
const ua = typeof navigator !== "undefined" && typeof navigator.userAgent !== "undefined" ? navigator.userAgent.toLowerCase() : "";
const FIREFOX = ua.includes("firefox");
const SAFARI = ua.includes("safari") && !ua.includes("chrom");
const SAFARI_BUG_237906 = SAFARI && (ua.includes("version/15.4") || /cpu (os|iphone os) 15_4 like mac os x/.test(ua));
const WEBKIT = ua.includes("webkit") && !ua.includes("edge");
const MAC = ua.includes("macintosh");
const DEVICE_PIXEL_RATIO = typeof devicePixelRatio !== "undefined" ? devicePixelRatio : 1;
const WORKER_OFFSCREEN_CANVAS = typeof WorkerGlobalScope !== "undefined" && typeof OffscreenCanvas !== "undefined" && self instanceof WorkerGlobalScope;
const IMAGE_DECODE = typeof Image !== "undefined" && Image.prototype.decode;
const PASSIVE_EVENT_LISTENERS = function() {
  let passive = false;
  try {
    const options = Object.defineProperty({}, "passive", {
      get: function() {
        passive = true;
      }
    });
    window.addEventListener("_", null, options);
    window.removeEventListener("_", null, options);
  } catch (error) {
  }
  return passive;
}();
function createCanvasContext2D(width, height, canvasPool2, settings) {
  let canvas;
  if (canvasPool2 && canvasPool2.length) {
    canvas = canvasPool2.shift();
  } else if (WORKER_OFFSCREEN_CANVAS) {
    canvas = new OffscreenCanvas(width || 300, height || 300);
  } else {
    canvas = document.createElement("canvas");
  }
  if (width) {
    canvas.width = width;
  }
  if (height) {
    canvas.height = height;
  }
  return canvas.getContext("2d", settings);
}
function releaseCanvas$1(context) {
  const canvas = context.canvas;
  canvas.width = 1;
  canvas.height = 1;
  context.clearRect(0, 0, 1, 1);
}
function outerWidth(element) {
  let width = element.offsetWidth;
  const style = getComputedStyle(element);
  width += parseInt(style.marginLeft, 10) + parseInt(style.marginRight, 10);
  return width;
}
function outerHeight(element) {
  let height = element.offsetHeight;
  const style = getComputedStyle(element);
  height += parseInt(style.marginTop, 10) + parseInt(style.marginBottom, 10);
  return height;
}
function replaceNode(newNode, oldNode) {
  const parent = oldNode.parentNode;
  if (parent) {
    parent.replaceChild(newNode, oldNode);
  }
}
function removeNode$1(node) {
  return node && node.parentNode ? node.parentNode.removeChild(node) : null;
}
function removeChildren(node) {
  while (node.lastChild) {
    node.removeChild(node.lastChild);
  }
}
function replaceChildren(node, children) {
  const oldChildren = node.childNodes;
  for (let i = 0; true; ++i) {
    const oldChild = oldChildren[i];
    const newChild = children[i];
    if (!oldChild && !newChild) {
      break;
    }
    if (oldChild === newChild) {
      continue;
    }
    if (!oldChild) {
      node.appendChild(newChild);
      continue;
    }
    if (!newChild) {
      node.removeChild(oldChild);
      --i;
      continue;
    }
    node.insertBefore(newChild, oldChild);
  }
}
class BaseEvent {
  constructor(type) {
    this.propagationStopped;
    this.defaultPrevented;
    this.type = type;
    this.target = null;
  }
  preventDefault() {
    this.defaultPrevented = true;
  }
  stopPropagation() {
    this.propagationStopped = true;
  }
}
const BaseEvent$1 = BaseEvent;
const ObjectEventType = {
  PROPERTYCHANGE: "propertychange"
};
class Disposable {
  constructor() {
    this.disposed = false;
  }
  dispose() {
    if (!this.disposed) {
      this.disposed = true;
      this.disposeInternal();
    }
  }
  disposeInternal() {
  }
}
const Disposable$1 = Disposable;
function binarySearch(haystack, needle, comparator) {
  let mid, cmp;
  comparator = comparator || numberSafeCompareFunction;
  let low = 0;
  let high = haystack.length;
  let found = false;
  while (low < high) {
    mid = low + (high - low >> 1);
    cmp = +comparator(haystack[mid], needle);
    if (cmp < 0) {
      low = mid + 1;
    } else {
      high = mid;
      found = !cmp;
    }
  }
  return found ? low : ~low;
}
function numberSafeCompareFunction(a, b) {
  return a > b ? 1 : a < b ? -1 : 0;
}
function linearFindNearest(arr, target, direction) {
  const n = arr.length;
  if (arr[0] <= target) {
    return 0;
  } else if (target <= arr[n - 1]) {
    return n - 1;
  } else {
    let i;
    if (direction > 0) {
      for (i = 1; i < n; ++i) {
        if (arr[i] < target) {
          return i - 1;
        }
      }
    } else if (direction < 0) {
      for (i = 1; i < n; ++i) {
        if (arr[i] <= target) {
          return i;
        }
      }
    } else {
      for (i = 1; i < n; ++i) {
        if (arr[i] == target) {
          return i;
        } else if (arr[i] < target) {
          if (typeof direction === "function") {
            if (direction(target, arr[i - 1], arr[i]) > 0) {
              return i - 1;
            } else {
              return i;
            }
          } else if (arr[i - 1] - target < target - arr[i]) {
            return i - 1;
          } else {
            return i;
          }
        }
      }
    }
    return n - 1;
  }
}
function reverseSubArray(arr, begin, end) {
  while (begin < end) {
    const tmp = arr[begin];
    arr[begin] = arr[end];
    arr[end] = tmp;
    ++begin;
    --end;
  }
}
function extend$1(arr, data) {
  const extension = Array.isArray(data) ? data : [data];
  const length = extension.length;
  for (let i = 0; i < length; i++) {
    arr[arr.length] = extension[i];
  }
}
function equals$1(arr1, arr2) {
  const len1 = arr1.length;
  if (len1 !== arr2.length) {
    return false;
  }
  for (let i = 0; i < len1; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
}
function isSorted(arr, func, strict) {
  const compare = func || numberSafeCompareFunction;
  return arr.every(function(currentVal, index2) {
    if (index2 === 0) {
      return true;
    }
    const res = compare(arr[index2 - 1], currentVal);
    return !(res > 0 || strict && res === 0);
  });
}
function TRUE() {
  return true;
}
function FALSE() {
  return false;
}
function VOID() {
}
function memoizeOne(fn) {
  let called = false;
  let lastResult;
  let lastArgs;
  let lastThis;
  return function() {
    const nextArgs = Array.prototype.slice.call(arguments);
    if (!called || this !== lastThis || !equals$1(nextArgs, lastArgs)) {
      called = true;
      lastThis = this;
      lastArgs = nextArgs;
      lastResult = fn.apply(this, arguments);
    }
    return lastResult;
  };
}
class Target extends Disposable$1 {
  constructor(target) {
    super();
    this.eventTarget_ = target;
    this.pendingRemovals_ = null;
    this.dispatching_ = null;
    this.listeners_ = null;
  }
  addEventListener(type, listener) {
    if (!type || !listener) {
      return;
    }
    const listeners = this.listeners_ || (this.listeners_ = {});
    const listenersForType = listeners[type] || (listeners[type] = []);
    if (!listenersForType.includes(listener)) {
      listenersForType.push(listener);
    }
  }
  dispatchEvent(event) {
    const isString = typeof event === "string";
    const type = isString ? event : event.type;
    const listeners = this.listeners_ && this.listeners_[type];
    if (!listeners) {
      return;
    }
    const evt = isString ? new BaseEvent$1(event) : event;
    if (!evt.target) {
      evt.target = this.eventTarget_ || this;
    }
    const dispatching = this.dispatching_ || (this.dispatching_ = {});
    const pendingRemovals = this.pendingRemovals_ || (this.pendingRemovals_ = {});
    if (!(type in dispatching)) {
      dispatching[type] = 0;
      pendingRemovals[type] = 0;
    }
    ++dispatching[type];
    let propagate;
    for (let i = 0, ii = listeners.length; i < ii; ++i) {
      if ("handleEvent" in listeners[i]) {
        propagate = listeners[i].handleEvent(evt);
      } else {
        propagate = listeners[i].call(this, evt);
      }
      if (propagate === false || evt.propagationStopped) {
        propagate = false;
        break;
      }
    }
    if (--dispatching[type] === 0) {
      let pr = pendingRemovals[type];
      delete pendingRemovals[type];
      while (pr--) {
        this.removeEventListener(type, VOID);
      }
      delete dispatching[type];
    }
    return propagate;
  }
  disposeInternal() {
    this.listeners_ && clear(this.listeners_);
  }
  getListeners(type) {
    return this.listeners_ && this.listeners_[type] || void 0;
  }
  hasListener(type) {
    if (!this.listeners_) {
      return false;
    }
    return type ? type in this.listeners_ : Object.keys(this.listeners_).length > 0;
  }
  removeEventListener(type, listener) {
    const listeners = this.listeners_ && this.listeners_[type];
    if (listeners) {
      const index2 = listeners.indexOf(listener);
      if (index2 !== -1) {
        if (this.pendingRemovals_ && type in this.pendingRemovals_) {
          listeners[index2] = VOID;
          ++this.pendingRemovals_[type];
        } else {
          listeners.splice(index2, 1);
          if (listeners.length === 0) {
            delete this.listeners_[type];
          }
        }
      }
    }
  }
}
const EventTarget = Target;
const EventType = {
  CHANGE: "change",
  ERROR: "error",
  BLUR: "blur",
  CLEAR: "clear",
  CONTEXTMENU: "contextmenu",
  CLICK: "click",
  DBLCLICK: "dblclick",
  DRAGENTER: "dragenter",
  DRAGOVER: "dragover",
  DROP: "drop",
  FOCUS: "focus",
  KEYDOWN: "keydown",
  KEYPRESS: "keypress",
  LOAD: "load",
  RESIZE: "resize",
  TOUCHMOVE: "touchmove",
  WHEEL: "wheel"
};
function listen(target, type, listener, thisArg, once) {
  if (thisArg && thisArg !== target) {
    listener = listener.bind(thisArg);
  }
  if (once) {
    const originalListener = listener;
    listener = function() {
      target.removeEventListener(type, listener);
      originalListener.apply(this, arguments);
    };
  }
  const eventsKey = {
    target,
    type,
    listener
  };
  target.addEventListener(type, listener);
  return eventsKey;
}
function listenOnce(target, type, listener, thisArg) {
  return listen(target, type, listener, thisArg, true);
}
function unlistenByKey(key) {
  if (key && key.target) {
    key.target.removeEventListener(key.type, key.listener);
    clear(key);
  }
}
class Observable extends EventTarget {
  constructor() {
    super();
    this.on = this.onInternal;
    this.once = this.onceInternal;
    this.un = this.unInternal;
    this.revision_ = 0;
  }
  changed() {
    ++this.revision_;
    this.dispatchEvent(EventType.CHANGE);
  }
  getRevision() {
    return this.revision_;
  }
  onInternal(type, listener) {
    if (Array.isArray(type)) {
      const len = type.length;
      const keys = new Array(len);
      for (let i = 0; i < len; ++i) {
        keys[i] = listen(this, type[i], listener);
      }
      return keys;
    } else {
      return listen(this, type, listener);
    }
  }
  onceInternal(type, listener) {
    let key;
    if (Array.isArray(type)) {
      const len = type.length;
      key = new Array(len);
      for (let i = 0; i < len; ++i) {
        key[i] = listenOnce(this, type[i], listener);
      }
    } else {
      key = listenOnce(this, type, listener);
    }
    listener.ol_key = key;
    return key;
  }
  unInternal(type, listener) {
    const key = listener.ol_key;
    if (key) {
      unByKey(key);
    } else if (Array.isArray(type)) {
      for (let i = 0, ii = type.length; i < ii; ++i) {
        this.removeEventListener(type[i], listener);
      }
    } else {
      this.removeEventListener(type, listener);
    }
  }
}
Observable.prototype.on;
Observable.prototype.once;
Observable.prototype.un;
function unByKey(key) {
  if (Array.isArray(key)) {
    for (let i = 0, ii = key.length; i < ii; ++i) {
      unlistenByKey(key[i]);
    }
  } else {
    unlistenByKey(key);
  }
}
const Observable$1 = Observable;
class ObjectEvent extends BaseEvent$1 {
  constructor(type, key, oldValue) {
    super(type);
    this.key = key;
    this.oldValue = oldValue;
  }
}
class BaseObject extends Observable$1 {
  constructor(values) {
    super();
    this.on;
    this.once;
    this.un;
    getUid(this);
    this.values_ = null;
    if (values !== void 0) {
      this.setProperties(values);
    }
  }
  get(key) {
    let value;
    if (this.values_ && this.values_.hasOwnProperty(key)) {
      value = this.values_[key];
    }
    return value;
  }
  getKeys() {
    return this.values_ && Object.keys(this.values_) || [];
  }
  getProperties() {
    return this.values_ && Object.assign({}, this.values_) || {};
  }
  hasProperties() {
    return !!this.values_;
  }
  notify(key, oldValue) {
    let eventType;
    eventType = `change:${key}`;
    if (this.hasListener(eventType)) {
      this.dispatchEvent(new ObjectEvent(eventType, key, oldValue));
    }
    eventType = ObjectEventType.PROPERTYCHANGE;
    if (this.hasListener(eventType)) {
      this.dispatchEvent(new ObjectEvent(eventType, key, oldValue));
    }
  }
  addChangeListener(key, listener) {
    this.addEventListener(`change:${key}`, listener);
  }
  removeChangeListener(key, listener) {
    this.removeEventListener(`change:${key}`, listener);
  }
  set(key, value, silent) {
    const values = this.values_ || (this.values_ = {});
    if (silent) {
      values[key] = value;
    } else {
      const oldValue = values[key];
      values[key] = value;
      if (oldValue !== value) {
        this.notify(key, oldValue);
      }
    }
  }
  setProperties(values, silent) {
    for (const key in values) {
      this.set(key, values[key], silent);
    }
  }
  applyProperties(source) {
    if (!source.values_) {
      return;
    }
    Object.assign(this.values_ || (this.values_ = {}), source.values_);
  }
  unset(key, silent) {
    if (this.values_ && key in this.values_) {
      const oldValue = this.values_[key];
      delete this.values_[key];
      if (isEmpty$1(this.values_)) {
        this.values_ = null;
      }
      if (!silent) {
        this.notify(key, oldValue);
      }
    }
  }
}
const BaseObject$1 = BaseObject;
const CLASS_HIDDEN = "ol-hidden";
const CLASS_SELECTABLE = "ol-selectable";
const CLASS_UNSELECTABLE = "ol-unselectable";
const CLASS_CONTROL = "ol-control";
const CLASS_COLLAPSED = "ol-collapsed";
const fontRegEx = new RegExp(
  [
    "^\\s*(?=(?:(?:[-a-z]+\\s*){0,2}(italic|oblique))?)",
    "(?=(?:(?:[-a-z]+\\s*){0,2}(small-caps))?)",
    "(?=(?:(?:[-a-z]+\\s*){0,2}(bold(?:er)?|lighter|[1-9]00 ))?)",
    "(?:(?:normal|\\1|\\2|\\3)\\s*){0,3}((?:xx?-)?",
    "(?:small|large)|medium|smaller|larger|[\\.\\d]+(?:\\%|in|[cem]m|ex|p[ctx]))",
    "(?:\\s*\\/\\s*(normal|[\\.\\d]+(?:\\%|in|[cem]m|ex|p[ctx])?))",
    `?\\s*([-,\\"\\'\\sa-z]+?)\\s*$`
  ].join(""),
  "i"
);
const fontRegExMatchIndex = [
  "style",
  "variant",
  "weight",
  "size",
  "lineHeight",
  "family"
];
const getFontParameters = function(fontSpec) {
  const match = fontSpec.match(fontRegEx);
  if (!match) {
    return null;
  }
  const style = {
    lineHeight: "normal",
    size: "1.2em",
    style: "normal",
    weight: "normal",
    variant: "normal"
  };
  for (let i = 0, ii = fontRegExMatchIndex.length; i < ii; ++i) {
    const value = match[i + 1];
    if (value !== void 0) {
      style[fontRegExMatchIndex[i]] = value;
    }
  }
  style.families = style.family.split(/,\s?/);
  return style;
};
const defaultFont = "10px sans-serif";
const defaultFillStyle = "#000";
const defaultLineCap = "round";
const defaultLineDash = [];
const defaultLineDashOffset = 0;
const defaultLineJoin = "round";
const defaultMiterLimit = 10;
const defaultStrokeStyle = "#000";
const defaultTextAlign = "center";
const defaultTextBaseline = "middle";
const defaultPadding = [0, 0, 0, 0];
const defaultLineWidth = 1;
const checkedFonts = new BaseObject$1();
let measureContext = null;
let measureFont;
const textHeights = {};
const registerFont = function() {
  const retries = 100;
  const size = "32px ";
  const referenceFonts = ["monospace", "serif"];
  const len = referenceFonts.length;
  const text = "wmytzilWMYTZIL@#/&?$%10\uF013";
  let interval, referenceWidth;
  function isAvailable(fontStyle, fontWeight, fontFamily) {
    let available = true;
    for (let i = 0; i < len; ++i) {
      const referenceFont = referenceFonts[i];
      referenceWidth = measureTextWidth(
        fontStyle + " " + fontWeight + " " + size + referenceFont,
        text
      );
      if (fontFamily != referenceFont) {
        const width = measureTextWidth(
          fontStyle + " " + fontWeight + " " + size + fontFamily + "," + referenceFont,
          text
        );
        available = available && width != referenceWidth;
      }
    }
    if (available) {
      return true;
    }
    return false;
  }
  function check() {
    let done = true;
    const fonts = checkedFonts.getKeys();
    for (let i = 0, ii = fonts.length; i < ii; ++i) {
      const font = fonts[i];
      if (checkedFonts.get(font) < retries) {
        if (isAvailable.apply(this, font.split("\n"))) {
          clear(textHeights);
          measureContext = null;
          measureFont = void 0;
          checkedFonts.set(font, retries);
        } else {
          checkedFonts.set(font, checkedFonts.get(font) + 1, true);
          done = false;
        }
      }
    }
    if (done) {
      clearInterval(interval);
      interval = void 0;
    }
  }
  return function(fontSpec) {
    const font = getFontParameters(fontSpec);
    if (!font) {
      return;
    }
    const families = font.families;
    for (let i = 0, ii = families.length; i < ii; ++i) {
      const family = families[i];
      const key = font.style + "\n" + font.weight + "\n" + family;
      if (checkedFonts.get(key) === void 0) {
        checkedFonts.set(key, retries, true);
        if (!isAvailable(font.style, font.weight, family)) {
          checkedFonts.set(key, 0, true);
          if (interval === void 0) {
            interval = setInterval(check, 32);
          }
        }
      }
    }
  };
}();
const measureTextHeight = function() {
  let measureElement;
  return function(fontSpec) {
    let height = textHeights[fontSpec];
    if (height == void 0) {
      if (WORKER_OFFSCREEN_CANVAS) {
        const font = getFontParameters(fontSpec);
        const metrics = measureText(fontSpec, "\u017Dg");
        const lineHeight = isNaN(Number(font.lineHeight)) ? 1.2 : Number(font.lineHeight);
        height = lineHeight * (metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent);
      } else {
        if (!measureElement) {
          measureElement = document.createElement("div");
          measureElement.innerHTML = "M";
          measureElement.style.minHeight = "0";
          measureElement.style.maxHeight = "none";
          measureElement.style.height = "auto";
          measureElement.style.padding = "0";
          measureElement.style.border = "none";
          measureElement.style.position = "absolute";
          measureElement.style.display = "block";
          measureElement.style.left = "-99999px";
        }
        measureElement.style.font = fontSpec;
        document.body.appendChild(measureElement);
        height = measureElement.offsetHeight;
        document.body.removeChild(measureElement);
      }
      textHeights[fontSpec] = height;
    }
    return height;
  };
}();
function measureText(font, text) {
  if (!measureContext) {
    measureContext = createCanvasContext2D(1, 1);
  }
  if (font != measureFont) {
    measureContext.font = font;
    measureFont = measureContext.font;
  }
  return measureContext.measureText(text);
}
function measureTextWidth(font, text) {
  return measureText(font, text).width;
}
function measureAndCacheTextWidth(font, text, cache2) {
  if (text in cache2) {
    return cache2[text];
  }
  const width = text.split("\n").reduce((prev, curr) => Math.max(prev, measureTextWidth(font, curr)), 0);
  cache2[text] = width;
  return width;
}
function getTextDimensions(baseStyle, chunks) {
  const widths = [];
  const heights = [];
  const lineWidths = [];
  let width = 0;
  let lineWidth = 0;
  let height = 0;
  let lineHeight = 0;
  for (let i = 0, ii = chunks.length; i <= ii; i += 2) {
    const text = chunks[i];
    if (text === "\n" || i === ii) {
      width = Math.max(width, lineWidth);
      lineWidths.push(lineWidth);
      lineWidth = 0;
      height += lineHeight;
      continue;
    }
    const font = chunks[i + 1] || baseStyle.font;
    const currentWidth = measureTextWidth(font, text);
    widths.push(currentWidth);
    lineWidth += currentWidth;
    const currentHeight = measureTextHeight(font);
    heights.push(currentHeight);
    lineHeight = Math.max(lineHeight, currentHeight);
  }
  return { width, height, widths, heights, lineWidths };
}
function drawImageOrLabel(context, transform2, opacity, labelOrImage, originX, originY, w, h, x, y, scale2) {
  context.save();
  if (opacity !== 1) {
    context.globalAlpha *= opacity;
  }
  if (transform2) {
    context.setTransform.apply(context, transform2);
  }
  if (labelOrImage.contextInstructions) {
    context.translate(x, y);
    context.scale(scale2[0], scale2[1]);
    executeLabelInstructions(labelOrImage, context);
  } else if (scale2[0] < 0 || scale2[1] < 0) {
    context.translate(x, y);
    context.scale(scale2[0], scale2[1]);
    context.drawImage(
      labelOrImage,
      originX,
      originY,
      w,
      h,
      0,
      0,
      w,
      h
    );
  } else {
    context.drawImage(
      labelOrImage,
      originX,
      originY,
      w,
      h,
      x,
      y,
      w * scale2[0],
      h * scale2[1]
    );
  }
  context.restore();
}
function executeLabelInstructions(label, context) {
  const contextInstructions = label.contextInstructions;
  for (let i = 0, ii = contextInstructions.length; i < ii; i += 2) {
    if (Array.isArray(contextInstructions[i + 1])) {
      context[contextInstructions[i]].apply(
        context,
        contextInstructions[i + 1]
      );
    } else {
      context[contextInstructions[i]] = contextInstructions[i + 1];
    }
  }
}
class RegularShape extends ImageStyle$1 {
  constructor(options) {
    const rotateWithView = options.rotateWithView !== void 0 ? options.rotateWithView : false;
    super({
      opacity: 1,
      rotateWithView,
      rotation: options.rotation !== void 0 ? options.rotation : 0,
      scale: options.scale !== void 0 ? options.scale : 1,
      displacement: options.displacement !== void 0 ? options.displacement : [0, 0],
      declutterMode: options.declutterMode
    });
    this.canvas_ = void 0;
    this.hitDetectionCanvas_ = null;
    this.fill_ = options.fill !== void 0 ? options.fill : null;
    this.origin_ = [0, 0];
    this.points_ = options.points;
    this.radius_ = options.radius !== void 0 ? options.radius : options.radius1;
    this.radius2_ = options.radius2;
    this.angle_ = options.angle !== void 0 ? options.angle : 0;
    this.stroke_ = options.stroke !== void 0 ? options.stroke : null;
    this.size_ = null;
    this.renderOptions_ = null;
    this.render();
  }
  clone() {
    const scale2 = this.getScale();
    const style = new RegularShape({
      fill: this.getFill() ? this.getFill().clone() : void 0,
      points: this.getPoints(),
      radius: this.getRadius(),
      radius2: this.getRadius2(),
      angle: this.getAngle(),
      stroke: this.getStroke() ? this.getStroke().clone() : void 0,
      rotation: this.getRotation(),
      rotateWithView: this.getRotateWithView(),
      scale: Array.isArray(scale2) ? scale2.slice() : scale2,
      displacement: this.getDisplacement().slice(),
      declutterMode: this.getDeclutterMode()
    });
    style.setOpacity(this.getOpacity());
    return style;
  }
  getAnchor() {
    const size = this.size_;
    if (!size) {
      return null;
    }
    const displacement = this.getDisplacement();
    const scale2 = this.getScaleArray();
    return [
      size[0] / 2 - displacement[0] / scale2[0],
      size[1] / 2 + displacement[1] / scale2[1]
    ];
  }
  getAngle() {
    return this.angle_;
  }
  getFill() {
    return this.fill_;
  }
  setFill(fill) {
    this.fill_ = fill;
    this.render();
  }
  getHitDetectionImage() {
    if (!this.hitDetectionCanvas_) {
      this.createHitDetectionCanvas_(this.renderOptions_);
    }
    return this.hitDetectionCanvas_;
  }
  getImage(pixelRatio) {
    let image = this.canvas_[pixelRatio];
    if (!image) {
      const renderOptions = this.renderOptions_;
      const context = createCanvasContext2D(
        renderOptions.size * pixelRatio,
        renderOptions.size * pixelRatio
      );
      this.draw_(renderOptions, context, pixelRatio);
      image = context.canvas;
      this.canvas_[pixelRatio] = image;
    }
    return image;
  }
  getPixelRatio(pixelRatio) {
    return pixelRatio;
  }
  getImageSize() {
    return this.size_;
  }
  getImageState() {
    return ImageState.LOADED;
  }
  getOrigin() {
    return this.origin_;
  }
  getPoints() {
    return this.points_;
  }
  getRadius() {
    return this.radius_;
  }
  getRadius2() {
    return this.radius2_;
  }
  getSize() {
    return this.size_;
  }
  getStroke() {
    return this.stroke_;
  }
  setStroke(stroke) {
    this.stroke_ = stroke;
    this.render();
  }
  listenImageChange(listener) {
  }
  load() {
  }
  unlistenImageChange(listener) {
  }
  calculateLineJoinSize_(lineJoin, strokeWidth, miterLimit) {
    if (strokeWidth === 0 || this.points_ === Infinity || lineJoin !== "bevel" && lineJoin !== "miter") {
      return strokeWidth;
    }
    let r1 = this.radius_;
    let r2 = this.radius2_ === void 0 ? r1 : this.radius2_;
    if (r1 < r2) {
      const tmp = r1;
      r1 = r2;
      r2 = tmp;
    }
    const points = this.radius2_ === void 0 ? this.points_ : this.points_ * 2;
    const alpha = 2 * Math.PI / points;
    const a = r2 * Math.sin(alpha);
    const b = Math.sqrt(r2 * r2 - a * a);
    const d = r1 - b;
    const e = Math.sqrt(a * a + d * d);
    const miterRatio = e / a;
    if (lineJoin === "miter" && miterRatio <= miterLimit) {
      return miterRatio * strokeWidth;
    }
    const k = strokeWidth / 2 / miterRatio;
    const l = strokeWidth / 2 * (d / e);
    const maxr = Math.sqrt((r1 + k) * (r1 + k) + l * l);
    const bevelAdd = maxr - r1;
    if (this.radius2_ === void 0 || lineJoin === "bevel") {
      return bevelAdd * 2;
    }
    const aa = r1 * Math.sin(alpha);
    const bb = Math.sqrt(r1 * r1 - aa * aa);
    const dd = r2 - bb;
    const ee = Math.sqrt(aa * aa + dd * dd);
    const innerMiterRatio = ee / aa;
    if (innerMiterRatio <= miterLimit) {
      const innerLength = innerMiterRatio * strokeWidth / 2 - r2 - r1;
      return 2 * Math.max(bevelAdd, innerLength);
    }
    return bevelAdd * 2;
  }
  createRenderOptions() {
    let lineJoin = defaultLineJoin;
    let miterLimit = 0;
    let lineDash = null;
    let lineDashOffset = 0;
    let strokeStyle;
    let strokeWidth = 0;
    if (this.stroke_) {
      strokeStyle = this.stroke_.getColor();
      if (strokeStyle === null) {
        strokeStyle = defaultStrokeStyle;
      }
      strokeStyle = asColorLike(strokeStyle);
      strokeWidth = this.stroke_.getWidth();
      if (strokeWidth === void 0) {
        strokeWidth = defaultLineWidth;
      }
      lineDash = this.stroke_.getLineDash();
      lineDashOffset = this.stroke_.getLineDashOffset();
      lineJoin = this.stroke_.getLineJoin();
      if (lineJoin === void 0) {
        lineJoin = defaultLineJoin;
      }
      miterLimit = this.stroke_.getMiterLimit();
      if (miterLimit === void 0) {
        miterLimit = defaultMiterLimit;
      }
    }
    const add2 = this.calculateLineJoinSize_(lineJoin, strokeWidth, miterLimit);
    const maxRadius = Math.max(this.radius_, this.radius2_ || 0);
    const size = Math.ceil(2 * maxRadius + add2);
    return {
      strokeStyle,
      strokeWidth,
      size,
      lineDash,
      lineDashOffset,
      lineJoin,
      miterLimit
    };
  }
  render() {
    this.renderOptions_ = this.createRenderOptions();
    const size = this.renderOptions_.size;
    this.canvas_ = {};
    this.size_ = [size, size];
  }
  draw_(renderOptions, context, pixelRatio) {
    context.scale(pixelRatio, pixelRatio);
    context.translate(renderOptions.size / 2, renderOptions.size / 2);
    this.createPath_(context);
    if (this.fill_) {
      let color = this.fill_.getColor();
      if (color === null) {
        color = defaultFillStyle;
      }
      context.fillStyle = asColorLike(color);
      context.fill();
    }
    if (this.stroke_) {
      context.strokeStyle = renderOptions.strokeStyle;
      context.lineWidth = renderOptions.strokeWidth;
      if (renderOptions.lineDash) {
        context.setLineDash(renderOptions.lineDash);
        context.lineDashOffset = renderOptions.lineDashOffset;
      }
      context.lineJoin = renderOptions.lineJoin;
      context.miterLimit = renderOptions.miterLimit;
      context.stroke();
    }
  }
  createHitDetectionCanvas_(renderOptions) {
    if (this.fill_) {
      let color = this.fill_.getColor();
      let opacity = 0;
      if (typeof color === "string") {
        color = asArray(color);
      }
      if (color === null) {
        opacity = 1;
      } else if (Array.isArray(color)) {
        opacity = color.length === 4 ? color[3] : 1;
      }
      if (opacity === 0) {
        const context = createCanvasContext2D(
          renderOptions.size,
          renderOptions.size
        );
        this.hitDetectionCanvas_ = context.canvas;
        this.drawHitDetectionCanvas_(renderOptions, context);
      }
    }
    if (!this.hitDetectionCanvas_) {
      this.hitDetectionCanvas_ = this.getImage(1);
    }
  }
  createPath_(context) {
    let points = this.points_;
    const radius = this.radius_;
    if (points === Infinity) {
      context.arc(0, 0, radius, 0, 2 * Math.PI);
    } else {
      const radius2 = this.radius2_ === void 0 ? radius : this.radius2_;
      if (this.radius2_ !== void 0) {
        points *= 2;
      }
      const startAngle = this.angle_ - Math.PI / 2;
      const step = 2 * Math.PI / points;
      for (let i = 0; i < points; i++) {
        const angle0 = startAngle + i * step;
        const radiusC = i % 2 === 0 ? radius : radius2;
        context.lineTo(radiusC * Math.cos(angle0), radiusC * Math.sin(angle0));
      }
      context.closePath();
    }
  }
  drawHitDetectionCanvas_(renderOptions, context) {
    context.translate(renderOptions.size / 2, renderOptions.size / 2);
    this.createPath_(context);
    context.fillStyle = defaultFillStyle;
    context.fill();
    if (this.stroke_) {
      context.strokeStyle = renderOptions.strokeStyle;
      context.lineWidth = renderOptions.strokeWidth;
      if (renderOptions.lineDash) {
        context.setLineDash(renderOptions.lineDash);
        context.lineDashOffset = renderOptions.lineDashOffset;
      }
      context.lineJoin = renderOptions.lineJoin;
      context.miterLimit = renderOptions.miterLimit;
      context.stroke();
    }
  }
}
const RegularShape$1 = RegularShape;
class CircleStyle extends RegularShape$1 {
  constructor(options) {
    options = options ? options : { radius: 5 };
    super({
      points: Infinity,
      fill: options.fill,
      radius: options.radius,
      stroke: options.stroke,
      scale: options.scale !== void 0 ? options.scale : 1,
      rotation: options.rotation !== void 0 ? options.rotation : 0,
      rotateWithView: options.rotateWithView !== void 0 ? options.rotateWithView : false,
      displacement: options.displacement !== void 0 ? options.displacement : [0, 0],
      declutterMode: options.declutterMode
    });
  }
  clone() {
    const scale2 = this.getScale();
    const style = new CircleStyle({
      fill: this.getFill() ? this.getFill().clone() : void 0,
      stroke: this.getStroke() ? this.getStroke().clone() : void 0,
      radius: this.getRadius(),
      scale: Array.isArray(scale2) ? scale2.slice() : scale2,
      rotation: this.getRotation(),
      rotateWithView: this.getRotateWithView(),
      displacement: this.getDisplacement().slice(),
      declutterMode: this.getDeclutterMode()
    });
    style.setOpacity(this.getOpacity());
    return style;
  }
  setRadius(radius) {
    this.radius_ = radius;
    this.render();
  }
}
const Circle$2 = CircleStyle;
class Fill {
  constructor(options) {
    options = options || {};
    this.color_ = options.color !== void 0 ? options.color : null;
  }
  clone() {
    const color = this.getColor();
    return new Fill({
      color: Array.isArray(color) ? color.slice() : color || void 0
    });
  }
  getColor() {
    return this.color_;
  }
  setColor(color) {
    this.color_ = color;
  }
}
const Fill$1 = Fill;
class IconImageCache {
  constructor() {
    this.cache_ = {};
    this.cacheSize_ = 0;
    this.maxCacheSize_ = 32;
  }
  clear() {
    this.cache_ = {};
    this.cacheSize_ = 0;
  }
  canExpireCache() {
    return this.cacheSize_ > this.maxCacheSize_;
  }
  expire() {
    if (this.canExpireCache()) {
      let i = 0;
      for (const key in this.cache_) {
        const iconImage = this.cache_[key];
        if ((i++ & 3) === 0 && !iconImage.hasListener()) {
          delete this.cache_[key];
          --this.cacheSize_;
        }
      }
    }
  }
  get(src, crossOrigin, color) {
    const key = getKey$1(src, crossOrigin, color);
    return key in this.cache_ ? this.cache_[key] : null;
  }
  set(src, crossOrigin, color, iconImage) {
    const key = getKey$1(src, crossOrigin, color);
    this.cache_[key] = iconImage;
    ++this.cacheSize_;
  }
  setSize(maxCacheSize) {
    this.maxCacheSize_ = maxCacheSize;
    this.expire();
  }
}
function getKey$1(src, crossOrigin, color) {
  const colorString = color ? asString(color) : "null";
  return crossOrigin + ":" + src + ":" + colorString;
}
const shared = new IconImageCache();
function listenImage(image, loadHandler, errorHandler) {
  const img = image;
  let listening = true;
  let decoding = false;
  let loaded = false;
  const listenerKeys = [
    listenOnce(img, EventType.LOAD, function() {
      loaded = true;
      if (!decoding) {
        loadHandler();
      }
    })
  ];
  if (img.src && IMAGE_DECODE) {
    decoding = true;
    img.decode().then(function() {
      if (listening) {
        loadHandler();
      }
    }).catch(function(error) {
      if (listening) {
        if (loaded) {
          loadHandler();
        } else {
          errorHandler();
        }
      }
    });
  } else {
    listenerKeys.push(listenOnce(img, EventType.ERROR, errorHandler));
  }
  return function unlisten() {
    listening = false;
    listenerKeys.forEach(unlistenByKey);
  };
}
let taintedTestContext = null;
class IconImage extends EventTarget {
  constructor(image, src, size, crossOrigin, imageState, color) {
    super();
    this.hitDetectionImage_ = null;
    this.image_ = image;
    this.crossOrigin_ = crossOrigin;
    this.canvas_ = {};
    this.color_ = color;
    this.unlisten_ = null;
    this.imageState_ = imageState;
    this.size_ = size;
    this.src_ = src;
    this.tainted_;
  }
  initializeImage_() {
    this.image_ = new Image();
    if (this.crossOrigin_ !== null) {
      this.image_.crossOrigin = this.crossOrigin_;
    }
  }
  isTainted_() {
    if (this.tainted_ === void 0 && this.imageState_ === ImageState.LOADED) {
      if (!taintedTestContext) {
        taintedTestContext = createCanvasContext2D(1, 1);
      }
      taintedTestContext.drawImage(this.image_, 0, 0);
      try {
        taintedTestContext.getImageData(0, 0, 1, 1);
        this.tainted_ = false;
      } catch (e) {
        taintedTestContext = null;
        this.tainted_ = true;
      }
    }
    return this.tainted_ === true;
  }
  dispatchChangeEvent_() {
    this.dispatchEvent(EventType.CHANGE);
  }
  handleImageError_() {
    this.imageState_ = ImageState.ERROR;
    this.unlistenImage_();
    this.dispatchChangeEvent_();
  }
  handleImageLoad_() {
    this.imageState_ = ImageState.LOADED;
    if (this.size_) {
      this.image_.width = this.size_[0];
      this.image_.height = this.size_[1];
    } else {
      this.size_ = [this.image_.width, this.image_.height];
    }
    this.unlistenImage_();
    this.dispatchChangeEvent_();
  }
  getImage(pixelRatio) {
    if (!this.image_) {
      this.initializeImage_();
    }
    this.replaceColor_(pixelRatio);
    return this.canvas_[pixelRatio] ? this.canvas_[pixelRatio] : this.image_;
  }
  getPixelRatio(pixelRatio) {
    this.replaceColor_(pixelRatio);
    return this.canvas_[pixelRatio] ? pixelRatio : 1;
  }
  getImageState() {
    return this.imageState_;
  }
  getHitDetectionImage() {
    if (!this.image_) {
      this.initializeImage_();
    }
    if (!this.hitDetectionImage_) {
      if (this.isTainted_()) {
        const width = this.size_[0];
        const height = this.size_[1];
        const context = createCanvasContext2D(width, height);
        context.fillRect(0, 0, width, height);
        this.hitDetectionImage_ = context.canvas;
      } else {
        this.hitDetectionImage_ = this.image_;
      }
    }
    return this.hitDetectionImage_;
  }
  getSize() {
    return this.size_;
  }
  getSrc() {
    return this.src_;
  }
  load() {
    if (this.imageState_ !== ImageState.IDLE) {
      return;
    }
    if (!this.image_) {
      this.initializeImage_();
    }
    this.imageState_ = ImageState.LOADING;
    try {
      this.image_.src = this.src_;
    } catch (e) {
      this.handleImageError_();
    }
    this.unlisten_ = listenImage(
      this.image_,
      this.handleImageLoad_.bind(this),
      this.handleImageError_.bind(this)
    );
  }
  replaceColor_(pixelRatio) {
    if (!this.color_ || this.canvas_[pixelRatio] || this.imageState_ !== ImageState.LOADED) {
      return;
    }
    const image = this.image_;
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(image.width * pixelRatio);
    canvas.height = Math.ceil(image.height * pixelRatio);
    const ctx = canvas.getContext("2d");
    ctx.scale(pixelRatio, pixelRatio);
    ctx.drawImage(image, 0, 0);
    ctx.globalCompositeOperation = "multiply";
    ctx.fillStyle = asString(this.color_);
    ctx.fillRect(0, 0, canvas.width / pixelRatio, canvas.height / pixelRatio);
    ctx.globalCompositeOperation = "destination-in";
    ctx.drawImage(image, 0, 0);
    this.canvas_[pixelRatio] = canvas;
  }
  unlistenImage_() {
    if (this.unlisten_) {
      this.unlisten_();
      this.unlisten_ = null;
    }
  }
}
function get(image, src, size, crossOrigin, imageState, color) {
  let iconImage = shared.get(src, crossOrigin, color);
  if (!iconImage) {
    iconImage = new IconImage(image, src, size, crossOrigin, imageState, color);
    shared.set(src, crossOrigin, color, iconImage);
  }
  return iconImage;
}
class Icon extends ImageStyle$1 {
  constructor(options) {
    options = options || {};
    const opacity = options.opacity !== void 0 ? options.opacity : 1;
    const rotation = options.rotation !== void 0 ? options.rotation : 0;
    const scale2 = options.scale !== void 0 ? options.scale : 1;
    const rotateWithView = options.rotateWithView !== void 0 ? options.rotateWithView : false;
    super({
      opacity,
      rotation,
      scale: scale2,
      displacement: options.displacement !== void 0 ? options.displacement : [0, 0],
      rotateWithView,
      declutterMode: options.declutterMode
    });
    this.anchor_ = options.anchor !== void 0 ? options.anchor : [0.5, 0.5];
    this.normalizedAnchor_ = null;
    this.anchorOrigin_ = options.anchorOrigin !== void 0 ? options.anchorOrigin : "top-left";
    this.anchorXUnits_ = options.anchorXUnits !== void 0 ? options.anchorXUnits : "fraction";
    this.anchorYUnits_ = options.anchorYUnits !== void 0 ? options.anchorYUnits : "fraction";
    this.crossOrigin_ = options.crossOrigin !== void 0 ? options.crossOrigin : null;
    const image = options.img !== void 0 ? options.img : null;
    this.imgSize_ = options.imgSize;
    let src = options.src;
    assert(!(src !== void 0 && image), 4);
    assert(!image || image && this.imgSize_, 5);
    if ((src === void 0 || src.length === 0) && image) {
      src = image.src || getUid(image);
    }
    assert(src !== void 0 && src.length > 0, 6);
    const imageState = options.src !== void 0 ? ImageState.IDLE : ImageState.LOADED;
    this.color_ = options.color !== void 0 ? asArray(options.color) : null;
    this.iconImage_ = get(
      image,
      src,
      this.imgSize_ !== void 0 ? this.imgSize_ : null,
      this.crossOrigin_,
      imageState,
      this.color_
    );
    this.offset_ = options.offset !== void 0 ? options.offset : [0, 0];
    this.offsetOrigin_ = options.offsetOrigin !== void 0 ? options.offsetOrigin : "top-left";
    this.origin_ = null;
    this.size_ = options.size !== void 0 ? options.size : null;
  }
  clone() {
    const scale2 = this.getScale();
    return new Icon({
      anchor: this.anchor_.slice(),
      anchorOrigin: this.anchorOrigin_,
      anchorXUnits: this.anchorXUnits_,
      anchorYUnits: this.anchorYUnits_,
      color: this.color_ && this.color_.slice ? this.color_.slice() : this.color_ || void 0,
      crossOrigin: this.crossOrigin_,
      imgSize: this.imgSize_,
      offset: this.offset_.slice(),
      offsetOrigin: this.offsetOrigin_,
      opacity: this.getOpacity(),
      rotateWithView: this.getRotateWithView(),
      rotation: this.getRotation(),
      scale: Array.isArray(scale2) ? scale2.slice() : scale2,
      size: this.size_ !== null ? this.size_.slice() : void 0,
      src: this.getSrc(),
      displacement: this.getDisplacement().slice(),
      declutterMode: this.getDeclutterMode()
    });
  }
  getAnchor() {
    let anchor = this.normalizedAnchor_;
    if (!anchor) {
      anchor = this.anchor_;
      const size = this.getSize();
      if (this.anchorXUnits_ == "fraction" || this.anchorYUnits_ == "fraction") {
        if (!size) {
          return null;
        }
        anchor = this.anchor_.slice();
        if (this.anchorXUnits_ == "fraction") {
          anchor[0] *= size[0];
        }
        if (this.anchorYUnits_ == "fraction") {
          anchor[1] *= size[1];
        }
      }
      if (this.anchorOrigin_ != "top-left") {
        if (!size) {
          return null;
        }
        if (anchor === this.anchor_) {
          anchor = this.anchor_.slice();
        }
        if (this.anchorOrigin_ == "top-right" || this.anchorOrigin_ == "bottom-right") {
          anchor[0] = -anchor[0] + size[0];
        }
        if (this.anchorOrigin_ == "bottom-left" || this.anchorOrigin_ == "bottom-right") {
          anchor[1] = -anchor[1] + size[1];
        }
      }
      this.normalizedAnchor_ = anchor;
    }
    const displacement = this.getDisplacement();
    const scale2 = this.getScaleArray();
    return [
      anchor[0] - displacement[0] / scale2[0],
      anchor[1] + displacement[1] / scale2[1]
    ];
  }
  setAnchor(anchor) {
    this.anchor_ = anchor;
    this.normalizedAnchor_ = null;
  }
  getColor() {
    return this.color_;
  }
  getImage(pixelRatio) {
    return this.iconImage_.getImage(pixelRatio);
  }
  getPixelRatio(pixelRatio) {
    return this.iconImage_.getPixelRatio(pixelRatio);
  }
  getImageSize() {
    return this.iconImage_.getSize();
  }
  getImageState() {
    return this.iconImage_.getImageState();
  }
  getHitDetectionImage() {
    return this.iconImage_.getHitDetectionImage();
  }
  getOrigin() {
    if (this.origin_) {
      return this.origin_;
    }
    let offset = this.offset_;
    if (this.offsetOrigin_ != "top-left") {
      const size = this.getSize();
      const iconImageSize = this.iconImage_.getSize();
      if (!size || !iconImageSize) {
        return null;
      }
      offset = offset.slice();
      if (this.offsetOrigin_ == "top-right" || this.offsetOrigin_ == "bottom-right") {
        offset[0] = iconImageSize[0] - size[0] - offset[0];
      }
      if (this.offsetOrigin_ == "bottom-left" || this.offsetOrigin_ == "bottom-right") {
        offset[1] = iconImageSize[1] - size[1] - offset[1];
      }
    }
    this.origin_ = offset;
    return this.origin_;
  }
  getSrc() {
    return this.iconImage_.getSrc();
  }
  getSize() {
    return !this.size_ ? this.iconImage_.getSize() : this.size_;
  }
  listenImageChange(listener) {
    this.iconImage_.addEventListener(EventType.CHANGE, listener);
  }
  load() {
    this.iconImage_.load();
  }
  unlistenImageChange(listener) {
    this.iconImage_.removeEventListener(EventType.CHANGE, listener);
  }
}
const Icon$1 = Icon;
class Stroke {
  constructor(options) {
    options = options || {};
    this.color_ = options.color !== void 0 ? options.color : null;
    this.lineCap_ = options.lineCap;
    this.lineDash_ = options.lineDash !== void 0 ? options.lineDash : null;
    this.lineDashOffset_ = options.lineDashOffset;
    this.lineJoin_ = options.lineJoin;
    this.miterLimit_ = options.miterLimit;
    this.width_ = options.width;
  }
  clone() {
    const color = this.getColor();
    return new Stroke({
      color: Array.isArray(color) ? color.slice() : color || void 0,
      lineCap: this.getLineCap(),
      lineDash: this.getLineDash() ? this.getLineDash().slice() : void 0,
      lineDashOffset: this.getLineDashOffset(),
      lineJoin: this.getLineJoin(),
      miterLimit: this.getMiterLimit(),
      width: this.getWidth()
    });
  }
  getColor() {
    return this.color_;
  }
  getLineCap() {
    return this.lineCap_;
  }
  getLineDash() {
    return this.lineDash_;
  }
  getLineDashOffset() {
    return this.lineDashOffset_;
  }
  getLineJoin() {
    return this.lineJoin_;
  }
  getMiterLimit() {
    return this.miterLimit_;
  }
  getWidth() {
    return this.width_;
  }
  setColor(color) {
    this.color_ = color;
  }
  setLineCap(lineCap) {
    this.lineCap_ = lineCap;
  }
  setLineDash(lineDash) {
    this.lineDash_ = lineDash;
  }
  setLineDashOffset(lineDashOffset) {
    this.lineDashOffset_ = lineDashOffset;
  }
  setLineJoin(lineJoin) {
    this.lineJoin_ = lineJoin;
  }
  setMiterLimit(miterLimit) {
    this.miterLimit_ = miterLimit;
  }
  setWidth(width) {
    this.width_ = width;
  }
}
const Stroke$1 = Stroke;
class Style {
  constructor(options) {
    options = options || {};
    this.geometry_ = null;
    this.geometryFunction_ = defaultGeometryFunction;
    if (options.geometry !== void 0) {
      this.setGeometry(options.geometry);
    }
    this.fill_ = options.fill !== void 0 ? options.fill : null;
    this.image_ = options.image !== void 0 ? options.image : null;
    this.renderer_ = options.renderer !== void 0 ? options.renderer : null;
    this.hitDetectionRenderer_ = options.hitDetectionRenderer !== void 0 ? options.hitDetectionRenderer : null;
    this.stroke_ = options.stroke !== void 0 ? options.stroke : null;
    this.text_ = options.text !== void 0 ? options.text : null;
    this.zIndex_ = options.zIndex;
  }
  clone() {
    let geometry = this.getGeometry();
    if (geometry && typeof geometry === "object") {
      geometry = geometry.clone();
    }
    return new Style({
      geometry,
      fill: this.getFill() ? this.getFill().clone() : void 0,
      image: this.getImage() ? this.getImage().clone() : void 0,
      renderer: this.getRenderer(),
      stroke: this.getStroke() ? this.getStroke().clone() : void 0,
      text: this.getText() ? this.getText().clone() : void 0,
      zIndex: this.getZIndex()
    });
  }
  getRenderer() {
    return this.renderer_;
  }
  setRenderer(renderer) {
    this.renderer_ = renderer;
  }
  setHitDetectionRenderer(renderer) {
    this.hitDetectionRenderer_ = renderer;
  }
  getHitDetectionRenderer() {
    return this.hitDetectionRenderer_;
  }
  getGeometry() {
    return this.geometry_;
  }
  getGeometryFunction() {
    return this.geometryFunction_;
  }
  getFill() {
    return this.fill_;
  }
  setFill(fill) {
    this.fill_ = fill;
  }
  getImage() {
    return this.image_;
  }
  setImage(image) {
    this.image_ = image;
  }
  getStroke() {
    return this.stroke_;
  }
  setStroke(stroke) {
    this.stroke_ = stroke;
  }
  getText() {
    return this.text_;
  }
  setText(text) {
    this.text_ = text;
  }
  getZIndex() {
    return this.zIndex_;
  }
  setGeometry(geometry) {
    if (typeof geometry === "function") {
      this.geometryFunction_ = geometry;
    } else if (typeof geometry === "string") {
      this.geometryFunction_ = function(feature2) {
        return feature2.get(geometry);
      };
    } else if (!geometry) {
      this.geometryFunction_ = defaultGeometryFunction;
    } else if (geometry !== void 0) {
      this.geometryFunction_ = function() {
        return geometry;
      };
    }
    this.geometry_ = geometry;
  }
  setZIndex(zIndex) {
    this.zIndex_ = zIndex;
  }
}
function toFunction(obj) {
  let styleFunction;
  if (typeof obj === "function") {
    styleFunction = obj;
  } else {
    let styles;
    if (Array.isArray(obj)) {
      styles = obj;
    } else {
      assert(typeof obj.getZIndex === "function", 41);
      const style = obj;
      styles = [style];
    }
    styleFunction = function() {
      return styles;
    };
  }
  return styleFunction;
}
let defaultStyles = null;
function createDefaultStyle(feature2, resolution) {
  if (!defaultStyles) {
    const fill = new Fill$1({
      color: "rgba(255,255,255,0.4)"
    });
    const stroke = new Stroke$1({
      color: "#3399CC",
      width: 1.25
    });
    defaultStyles = [
      new Style({
        image: new Circle$2({
          fill,
          stroke,
          radius: 5
        }),
        fill,
        stroke
      })
    ];
  }
  return defaultStyles;
}
function createEditingStyle() {
  const styles = {};
  const white = [255, 255, 255, 1];
  const blue = [0, 153, 255, 1];
  const width = 3;
  styles["Polygon"] = [
    new Style({
      fill: new Fill$1({
        color: [255, 255, 255, 0.5]
      })
    })
  ];
  styles["MultiPolygon"] = styles["Polygon"];
  styles["LineString"] = [
    new Style({
      stroke: new Stroke$1({
        color: white,
        width: width + 2
      })
    }),
    new Style({
      stroke: new Stroke$1({
        color: blue,
        width
      })
    })
  ];
  styles["MultiLineString"] = styles["LineString"];
  styles["Circle"] = styles["Polygon"].concat(styles["LineString"]);
  styles["Point"] = [
    new Style({
      image: new Circle$2({
        radius: width * 2,
        fill: new Fill$1({
          color: blue
        }),
        stroke: new Stroke$1({
          color: white,
          width: width / 2
        })
      }),
      zIndex: Infinity
    })
  ];
  styles["MultiPoint"] = styles["Point"];
  styles["GeometryCollection"] = styles["Polygon"].concat(
    styles["LineString"],
    styles["Point"]
  );
  return styles;
}
function defaultGeometryFunction(feature2) {
  return feature2.getGeometry();
}
const Style$1 = Style;
const DEFAULT_FILL_COLOR = "#333";
class Text {
  constructor(options) {
    options = options || {};
    this.font_ = options.font;
    this.rotation_ = options.rotation;
    this.rotateWithView_ = options.rotateWithView;
    this.scale_ = options.scale;
    this.scaleArray_ = toSize(options.scale !== void 0 ? options.scale : 1);
    this.text_ = options.text;
    this.textAlign_ = options.textAlign;
    this.justify_ = options.justify;
    this.textBaseline_ = options.textBaseline;
    this.fill_ = options.fill !== void 0 ? options.fill : new Fill$1({ color: DEFAULT_FILL_COLOR });
    this.maxAngle_ = options.maxAngle !== void 0 ? options.maxAngle : Math.PI / 4;
    this.placement_ = options.placement !== void 0 ? options.placement : "point";
    this.overflow_ = !!options.overflow;
    this.stroke_ = options.stroke !== void 0 ? options.stroke : null;
    this.offsetX_ = options.offsetX !== void 0 ? options.offsetX : 0;
    this.offsetY_ = options.offsetY !== void 0 ? options.offsetY : 0;
    this.backgroundFill_ = options.backgroundFill ? options.backgroundFill : null;
    this.backgroundStroke_ = options.backgroundStroke ? options.backgroundStroke : null;
    this.padding_ = options.padding === void 0 ? null : options.padding;
  }
  clone() {
    const scale2 = this.getScale();
    return new Text({
      font: this.getFont(),
      placement: this.getPlacement(),
      maxAngle: this.getMaxAngle(),
      overflow: this.getOverflow(),
      rotation: this.getRotation(),
      rotateWithView: this.getRotateWithView(),
      scale: Array.isArray(scale2) ? scale2.slice() : scale2,
      text: this.getText(),
      textAlign: this.getTextAlign(),
      justify: this.getJustify(),
      textBaseline: this.getTextBaseline(),
      fill: this.getFill() ? this.getFill().clone() : void 0,
      stroke: this.getStroke() ? this.getStroke().clone() : void 0,
      offsetX: this.getOffsetX(),
      offsetY: this.getOffsetY(),
      backgroundFill: this.getBackgroundFill() ? this.getBackgroundFill().clone() : void 0,
      backgroundStroke: this.getBackgroundStroke() ? this.getBackgroundStroke().clone() : void 0,
      padding: this.getPadding() || void 0
    });
  }
  getOverflow() {
    return this.overflow_;
  }
  getFont() {
    return this.font_;
  }
  getMaxAngle() {
    return this.maxAngle_;
  }
  getPlacement() {
    return this.placement_;
  }
  getOffsetX() {
    return this.offsetX_;
  }
  getOffsetY() {
    return this.offsetY_;
  }
  getFill() {
    return this.fill_;
  }
  getRotateWithView() {
    return this.rotateWithView_;
  }
  getRotation() {
    return this.rotation_;
  }
  getScale() {
    return this.scale_;
  }
  getScaleArray() {
    return this.scaleArray_;
  }
  getStroke() {
    return this.stroke_;
  }
  getText() {
    return this.text_;
  }
  getTextAlign() {
    return this.textAlign_;
  }
  getJustify() {
    return this.justify_;
  }
  getTextBaseline() {
    return this.textBaseline_;
  }
  getBackgroundFill() {
    return this.backgroundFill_;
  }
  getBackgroundStroke() {
    return this.backgroundStroke_;
  }
  getPadding() {
    return this.padding_;
  }
  setOverflow(overflow) {
    this.overflow_ = overflow;
  }
  setFont(font) {
    this.font_ = font;
  }
  setMaxAngle(maxAngle) {
    this.maxAngle_ = maxAngle;
  }
  setOffsetX(offsetX) {
    this.offsetX_ = offsetX;
  }
  setOffsetY(offsetY) {
    this.offsetY_ = offsetY;
  }
  setPlacement(placement) {
    this.placement_ = placement;
  }
  setRotateWithView(rotateWithView) {
    this.rotateWithView_ = rotateWithView;
  }
  setFill(fill) {
    this.fill_ = fill;
  }
  setRotation(rotation) {
    this.rotation_ = rotation;
  }
  setScale(scale2) {
    this.scale_ = scale2;
    this.scaleArray_ = toSize(scale2 !== void 0 ? scale2 : 1);
  }
  setStroke(stroke) {
    this.stroke_ = stroke;
  }
  setText(text) {
    this.text_ = text;
  }
  setTextAlign(textAlign) {
    this.textAlign_ = textAlign;
  }
  setJustify(justify) {
    this.justify_ = justify;
  }
  setTextBaseline(textBaseline) {
    this.textBaseline_ = textBaseline;
  }
  setBackgroundFill(fill) {
    this.backgroundFill_ = fill;
  }
  setBackgroundStroke(stroke) {
    this.backgroundStroke_ = stroke;
  }
  setPadding(padding) {
    this.padding_ = padding;
  }
}
const Text$1 = Text;
const LayerProperty = {
  OPACITY: "opacity",
  VISIBLE: "visible",
  EXTENT: "extent",
  Z_INDEX: "zIndex",
  MAX_RESOLUTION: "maxResolution",
  MIN_RESOLUTION: "minResolution",
  MAX_ZOOM: "maxZoom",
  MIN_ZOOM: "minZoom",
  SOURCE: "source",
  MAP: "map"
};
class BaseLayer extends BaseObject$1 {
  constructor(options) {
    super();
    this.on;
    this.once;
    this.un;
    this.background_ = options.background;
    const properties = Object.assign({}, options);
    if (typeof options.properties === "object") {
      delete properties.properties;
      Object.assign(properties, options.properties);
    }
    properties[LayerProperty.OPACITY] = options.opacity !== void 0 ? options.opacity : 1;
    assert(typeof properties[LayerProperty.OPACITY] === "number", 64);
    properties[LayerProperty.VISIBLE] = options.visible !== void 0 ? options.visible : true;
    properties[LayerProperty.Z_INDEX] = options.zIndex;
    properties[LayerProperty.MAX_RESOLUTION] = options.maxResolution !== void 0 ? options.maxResolution : Infinity;
    properties[LayerProperty.MIN_RESOLUTION] = options.minResolution !== void 0 ? options.minResolution : 0;
    properties[LayerProperty.MIN_ZOOM] = options.minZoom !== void 0 ? options.minZoom : -Infinity;
    properties[LayerProperty.MAX_ZOOM] = options.maxZoom !== void 0 ? options.maxZoom : Infinity;
    this.className_ = properties.className !== void 0 ? properties.className : "ol-layer";
    delete properties.className;
    this.setProperties(properties);
    this.state_ = null;
  }
  getBackground() {
    return this.background_;
  }
  getClassName() {
    return this.className_;
  }
  getLayerState(managed) {
    const state = this.state_ || {
      layer: this,
      managed: managed === void 0 ? true : managed
    };
    const zIndex = this.getZIndex();
    state.opacity = clamp(Math.round(this.getOpacity() * 100) / 100, 0, 1);
    state.visible = this.getVisible();
    state.extent = this.getExtent();
    state.zIndex = zIndex === void 0 && !state.managed ? Infinity : zIndex;
    state.maxResolution = this.getMaxResolution();
    state.minResolution = Math.max(this.getMinResolution(), 0);
    state.minZoom = this.getMinZoom();
    state.maxZoom = this.getMaxZoom();
    this.state_ = state;
    return state;
  }
  getLayersArray(array) {
    return abstract();
  }
  getLayerStatesArray(states) {
    return abstract();
  }
  getExtent() {
    return this.get(LayerProperty.EXTENT);
  }
  getMaxResolution() {
    return this.get(LayerProperty.MAX_RESOLUTION);
  }
  getMinResolution() {
    return this.get(LayerProperty.MIN_RESOLUTION);
  }
  getMinZoom() {
    return this.get(LayerProperty.MIN_ZOOM);
  }
  getMaxZoom() {
    return this.get(LayerProperty.MAX_ZOOM);
  }
  getOpacity() {
    return this.get(LayerProperty.OPACITY);
  }
  getSourceState() {
    return abstract();
  }
  getVisible() {
    return this.get(LayerProperty.VISIBLE);
  }
  getZIndex() {
    return this.get(LayerProperty.Z_INDEX);
  }
  setBackground(background) {
    this.background_ = background;
    this.changed();
  }
  setExtent(extent) {
    this.set(LayerProperty.EXTENT, extent);
  }
  setMaxResolution(maxResolution) {
    this.set(LayerProperty.MAX_RESOLUTION, maxResolution);
  }
  setMinResolution(minResolution) {
    this.set(LayerProperty.MIN_RESOLUTION, minResolution);
  }
  setMaxZoom(maxZoom) {
    this.set(LayerProperty.MAX_ZOOM, maxZoom);
  }
  setMinZoom(minZoom) {
    this.set(LayerProperty.MIN_ZOOM, minZoom);
  }
  setOpacity(opacity) {
    assert(typeof opacity === "number", 64);
    this.set(LayerProperty.OPACITY, opacity);
  }
  setVisible(visible) {
    this.set(LayerProperty.VISIBLE, visible);
  }
  setZIndex(zindex) {
    this.set(LayerProperty.Z_INDEX, zindex);
  }
  disposeInternal() {
    if (this.state_) {
      this.state_.layer = null;
      this.state_ = null;
    }
    super.disposeInternal();
  }
}
const BaseLayer$1 = BaseLayer;
const RenderEventType = {
  PRERENDER: "prerender",
  POSTRENDER: "postrender",
  PRECOMPOSE: "precompose",
  POSTCOMPOSE: "postcompose",
  RENDERCOMPLETE: "rendercomplete"
};
class Layer extends BaseLayer$1 {
  constructor(options) {
    const baseOptions = Object.assign({}, options);
    delete baseOptions.source;
    super(baseOptions);
    this.on;
    this.once;
    this.un;
    this.mapPrecomposeKey_ = null;
    this.mapRenderKey_ = null;
    this.sourceChangeKey_ = null;
    this.renderer_ = null;
    this.rendered = false;
    if (options.render) {
      this.render = options.render;
    }
    if (options.map) {
      this.setMap(options.map);
    }
    this.addChangeListener(
      LayerProperty.SOURCE,
      this.handleSourcePropertyChange_
    );
    const source = options.source ? options.source : null;
    this.setSource(source);
  }
  getLayersArray(array) {
    array = array ? array : [];
    array.push(this);
    return array;
  }
  getLayerStatesArray(states) {
    states = states ? states : [];
    states.push(this.getLayerState());
    return states;
  }
  getSource() {
    return this.get(LayerProperty.SOURCE) || null;
  }
  getRenderSource() {
    return this.getSource();
  }
  getSourceState() {
    const source = this.getSource();
    return !source ? "undefined" : source.getState();
  }
  handleSourceChange_() {
    this.changed();
  }
  handleSourcePropertyChange_() {
    if (this.sourceChangeKey_) {
      unlistenByKey(this.sourceChangeKey_);
      this.sourceChangeKey_ = null;
    }
    const source = this.getSource();
    if (source) {
      this.sourceChangeKey_ = listen(
        source,
        EventType.CHANGE,
        this.handleSourceChange_,
        this
      );
    }
    this.changed();
  }
  getFeatures(pixel) {
    if (!this.renderer_) {
      return new Promise((resolve) => resolve([]));
    }
    return this.renderer_.getFeatures(pixel);
  }
  getData(pixel) {
    if (!this.renderer_ || !this.rendered) {
      return null;
    }
    return this.renderer_.getData(pixel);
  }
  render(frameState, target) {
    const layerRenderer = this.getRenderer();
    if (layerRenderer.prepareFrame(frameState)) {
      this.rendered = true;
      return layerRenderer.renderFrame(frameState, target);
    }
  }
  unrender() {
    this.rendered = false;
  }
  setMapInternal(map) {
    if (!map) {
      this.unrender();
    }
    this.set(LayerProperty.MAP, map);
  }
  getMapInternal() {
    return this.get(LayerProperty.MAP);
  }
  setMap(map) {
    if (this.mapPrecomposeKey_) {
      unlistenByKey(this.mapPrecomposeKey_);
      this.mapPrecomposeKey_ = null;
    }
    if (!map) {
      this.changed();
    }
    if (this.mapRenderKey_) {
      unlistenByKey(this.mapRenderKey_);
      this.mapRenderKey_ = null;
    }
    if (map) {
      this.mapPrecomposeKey_ = listen(
        map,
        RenderEventType.PRECOMPOSE,
        function(evt) {
          const renderEvent = evt;
          const layerStatesArray = renderEvent.frameState.layerStatesArray;
          const layerState = this.getLayerState(false);
          assert(
            !layerStatesArray.some(function(arrayLayerState) {
              return arrayLayerState.layer === layerState.layer;
            }),
            67
          );
          layerStatesArray.push(layerState);
        },
        this
      );
      this.mapRenderKey_ = listen(this, EventType.CHANGE, map.render, map);
      this.changed();
    }
  }
  setSource(source) {
    this.set(LayerProperty.SOURCE, source);
  }
  getRenderer() {
    if (!this.renderer_) {
      this.renderer_ = this.createRenderer();
    }
    return this.renderer_;
  }
  hasRenderer() {
    return !!this.renderer_;
  }
  createRenderer() {
    return null;
  }
  disposeInternal() {
    if (this.renderer_) {
      this.renderer_.dispose();
      delete this.renderer_;
    }
    this.setSource(null);
    super.disposeInternal();
  }
}
function inView(layerState, viewState) {
  if (!layerState.visible) {
    return false;
  }
  const resolution = viewState.resolution;
  if (resolution < layerState.minResolution || resolution >= layerState.maxResolution) {
    return false;
  }
  const zoom = viewState.zoom;
  return zoom > layerState.minZoom && zoom <= layerState.maxZoom;
}
const Layer$1 = Layer;
function quickselect(arr, k, left, right, compare) {
  quickselectStep(arr, k, left || 0, right || arr.length - 1, compare || defaultCompare);
}
function quickselectStep(arr, k, left, right, compare) {
  while (right > left) {
    if (right - left > 600) {
      var n = right - left + 1;
      var m = k - left + 1;
      var z = Math.log(n);
      var s = 0.5 * Math.exp(2 * z / 3);
      var sd = 0.5 * Math.sqrt(z * s * (n - s) / n) * (m - n / 2 < 0 ? -1 : 1);
      var newLeft = Math.max(left, Math.floor(k - m * s / n + sd));
      var newRight = Math.min(right, Math.floor(k + (n - m) * s / n + sd));
      quickselectStep(arr, k, newLeft, newRight, compare);
    }
    var t = arr[k];
    var i = left;
    var j = right;
    swap(arr, left, k);
    if (compare(arr[right], t) > 0)
      swap(arr, left, right);
    while (i < j) {
      swap(arr, i, j);
      i++;
      j--;
      while (compare(arr[i], t) < 0)
        i++;
      while (compare(arr[j], t) > 0)
        j--;
    }
    if (compare(arr[left], t) === 0)
      swap(arr, left, j);
    else {
      j++;
      swap(arr, j, right);
    }
    if (j <= k)
      left = j + 1;
    if (k <= j)
      right = j - 1;
  }
}
function swap(arr, i, j) {
  var tmp = arr[i];
  arr[i] = arr[j];
  arr[j] = tmp;
}
function defaultCompare(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}
class RBush$2 {
  constructor(maxEntries = 9) {
    this._maxEntries = Math.max(4, maxEntries);
    this._minEntries = Math.max(2, Math.ceil(this._maxEntries * 0.4));
    this.clear();
  }
  all() {
    return this._all(this.data, []);
  }
  search(bbox) {
    let node = this.data;
    const result = [];
    if (!intersects$1(bbox, node))
      return result;
    const toBBox = this.toBBox;
    const nodesToSearch = [];
    while (node) {
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        const childBBox = node.leaf ? toBBox(child) : child;
        if (intersects$1(bbox, childBBox)) {
          if (node.leaf)
            result.push(child);
          else if (contains(bbox, childBBox))
            this._all(child, result);
          else
            nodesToSearch.push(child);
        }
      }
      node = nodesToSearch.pop();
    }
    return result;
  }
  collides(bbox) {
    let node = this.data;
    if (!intersects$1(bbox, node))
      return false;
    const nodesToSearch = [];
    while (node) {
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        const childBBox = node.leaf ? this.toBBox(child) : child;
        if (intersects$1(bbox, childBBox)) {
          if (node.leaf || contains(bbox, childBBox))
            return true;
          nodesToSearch.push(child);
        }
      }
      node = nodesToSearch.pop();
    }
    return false;
  }
  load(data) {
    if (!(data && data.length))
      return this;
    if (data.length < this._minEntries) {
      for (let i = 0; i < data.length; i++) {
        this.insert(data[i]);
      }
      return this;
    }
    let node = this._build(data.slice(), 0, data.length - 1, 0);
    if (!this.data.children.length) {
      this.data = node;
    } else if (this.data.height === node.height) {
      this._splitRoot(this.data, node);
    } else {
      if (this.data.height < node.height) {
        const tmpNode = this.data;
        this.data = node;
        node = tmpNode;
      }
      this._insert(node, this.data.height - node.height - 1, true);
    }
    return this;
  }
  insert(item) {
    if (item)
      this._insert(item, this.data.height - 1);
    return this;
  }
  clear() {
    this.data = createNode([]);
    return this;
  }
  remove(item, equalsFn) {
    if (!item)
      return this;
    let node = this.data;
    const bbox = this.toBBox(item);
    const path = [];
    const indexes = [];
    let i, parent, goingUp;
    while (node || path.length) {
      if (!node) {
        node = path.pop();
        parent = path[path.length - 1];
        i = indexes.pop();
        goingUp = true;
      }
      if (node.leaf) {
        const index2 = findItem(item, node.children, equalsFn);
        if (index2 !== -1) {
          node.children.splice(index2, 1);
          path.push(node);
          this._condense(path);
          return this;
        }
      }
      if (!goingUp && !node.leaf && contains(node, bbox)) {
        path.push(node);
        indexes.push(i);
        i = 0;
        parent = node;
        node = node.children[0];
      } else if (parent) {
        i++;
        node = parent.children[i];
        goingUp = false;
      } else
        node = null;
    }
    return this;
  }
  toBBox(item) {
    return item;
  }
  compareMinX(a, b) {
    return a.minX - b.minX;
  }
  compareMinY(a, b) {
    return a.minY - b.minY;
  }
  toJSON() {
    return this.data;
  }
  fromJSON(data) {
    this.data = data;
    return this;
  }
  _all(node, result) {
    const nodesToSearch = [];
    while (node) {
      if (node.leaf)
        result.push(...node.children);
      else
        nodesToSearch.push(...node.children);
      node = nodesToSearch.pop();
    }
    return result;
  }
  _build(items, left, right, height) {
    const N = right - left + 1;
    let M = this._maxEntries;
    let node;
    if (N <= M) {
      node = createNode(items.slice(left, right + 1));
      calcBBox(node, this.toBBox);
      return node;
    }
    if (!height) {
      height = Math.ceil(Math.log(N) / Math.log(M));
      M = Math.ceil(N / Math.pow(M, height - 1));
    }
    node = createNode([]);
    node.leaf = false;
    node.height = height;
    const N2 = Math.ceil(N / M);
    const N1 = N2 * Math.ceil(Math.sqrt(M));
    multiSelect(items, left, right, N1, this.compareMinX);
    for (let i = left; i <= right; i += N1) {
      const right2 = Math.min(i + N1 - 1, right);
      multiSelect(items, i, right2, N2, this.compareMinY);
      for (let j = i; j <= right2; j += N2) {
        const right3 = Math.min(j + N2 - 1, right2);
        node.children.push(this._build(items, j, right3, height - 1));
      }
    }
    calcBBox(node, this.toBBox);
    return node;
  }
  _chooseSubtree(bbox, node, level, path) {
    while (true) {
      path.push(node);
      if (node.leaf || path.length - 1 === level)
        break;
      let minArea = Infinity;
      let minEnlargement = Infinity;
      let targetNode;
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        const area2 = bboxArea(child);
        const enlargement = enlargedArea(bbox, child) - area2;
        if (enlargement < minEnlargement) {
          minEnlargement = enlargement;
          minArea = area2 < minArea ? area2 : minArea;
          targetNode = child;
        } else if (enlargement === minEnlargement) {
          if (area2 < minArea) {
            minArea = area2;
            targetNode = child;
          }
        }
      }
      node = targetNode || node.children[0];
    }
    return node;
  }
  _insert(item, level, isNode) {
    const bbox = isNode ? item : this.toBBox(item);
    const insertPath = [];
    const node = this._chooseSubtree(bbox, this.data, level, insertPath);
    node.children.push(item);
    extend(node, bbox);
    while (level >= 0) {
      if (insertPath[level].children.length > this._maxEntries) {
        this._split(insertPath, level);
        level--;
      } else
        break;
    }
    this._adjustParentBBoxes(bbox, insertPath, level);
  }
  _split(insertPath, level) {
    const node = insertPath[level];
    const M = node.children.length;
    const m = this._minEntries;
    this._chooseSplitAxis(node, m, M);
    const splitIndex = this._chooseSplitIndex(node, m, M);
    const newNode = createNode(node.children.splice(splitIndex, node.children.length - splitIndex));
    newNode.height = node.height;
    newNode.leaf = node.leaf;
    calcBBox(node, this.toBBox);
    calcBBox(newNode, this.toBBox);
    if (level)
      insertPath[level - 1].children.push(newNode);
    else
      this._splitRoot(node, newNode);
  }
  _splitRoot(node, newNode) {
    this.data = createNode([node, newNode]);
    this.data.height = node.height + 1;
    this.data.leaf = false;
    calcBBox(this.data, this.toBBox);
  }
  _chooseSplitIndex(node, m, M) {
    let index2;
    let minOverlap = Infinity;
    let minArea = Infinity;
    for (let i = m; i <= M - m; i++) {
      const bbox1 = distBBox(node, 0, i, this.toBBox);
      const bbox2 = distBBox(node, i, M, this.toBBox);
      const overlap = intersectionArea(bbox1, bbox2);
      const area2 = bboxArea(bbox1) + bboxArea(bbox2);
      if (overlap < minOverlap) {
        minOverlap = overlap;
        index2 = i;
        minArea = area2 < minArea ? area2 : minArea;
      } else if (overlap === minOverlap) {
        if (area2 < minArea) {
          minArea = area2;
          index2 = i;
        }
      }
    }
    return index2 || M - m;
  }
  _chooseSplitAxis(node, m, M) {
    const compareMinX = node.leaf ? this.compareMinX : compareNodeMinX;
    const compareMinY = node.leaf ? this.compareMinY : compareNodeMinY;
    const xMargin = this._allDistMargin(node, m, M, compareMinX);
    const yMargin = this._allDistMargin(node, m, M, compareMinY);
    if (xMargin < yMargin)
      node.children.sort(compareMinX);
  }
  _allDistMargin(node, m, M, compare) {
    node.children.sort(compare);
    const toBBox = this.toBBox;
    const leftBBox = distBBox(node, 0, m, toBBox);
    const rightBBox = distBBox(node, M - m, M, toBBox);
    let margin = bboxMargin(leftBBox) + bboxMargin(rightBBox);
    for (let i = m; i < M - m; i++) {
      const child = node.children[i];
      extend(leftBBox, node.leaf ? toBBox(child) : child);
      margin += bboxMargin(leftBBox);
    }
    for (let i = M - m - 1; i >= m; i--) {
      const child = node.children[i];
      extend(rightBBox, node.leaf ? toBBox(child) : child);
      margin += bboxMargin(rightBBox);
    }
    return margin;
  }
  _adjustParentBBoxes(bbox, path, level) {
    for (let i = level; i >= 0; i--) {
      extend(path[i], bbox);
    }
  }
  _condense(path) {
    for (let i = path.length - 1, siblings; i >= 0; i--) {
      if (path[i].children.length === 0) {
        if (i > 0) {
          siblings = path[i - 1].children;
          siblings.splice(siblings.indexOf(path[i]), 1);
        } else
          this.clear();
      } else
        calcBBox(path[i], this.toBBox);
    }
  }
}
function findItem(item, items, equalsFn) {
  if (!equalsFn)
    return items.indexOf(item);
  for (let i = 0; i < items.length; i++) {
    if (equalsFn(item, items[i]))
      return i;
  }
  return -1;
}
function calcBBox(node, toBBox) {
  distBBox(node, 0, node.children.length, toBBox, node);
}
function distBBox(node, k, p, toBBox, destNode) {
  if (!destNode)
    destNode = createNode(null);
  destNode.minX = Infinity;
  destNode.minY = Infinity;
  destNode.maxX = -Infinity;
  destNode.maxY = -Infinity;
  for (let i = k; i < p; i++) {
    const child = node.children[i];
    extend(destNode, node.leaf ? toBBox(child) : child);
  }
  return destNode;
}
function extend(a, b) {
  a.minX = Math.min(a.minX, b.minX);
  a.minY = Math.min(a.minY, b.minY);
  a.maxX = Math.max(a.maxX, b.maxX);
  a.maxY = Math.max(a.maxY, b.maxY);
  return a;
}
function compareNodeMinX(a, b) {
  return a.minX - b.minX;
}
function compareNodeMinY(a, b) {
  return a.minY - b.minY;
}
function bboxArea(a) {
  return (a.maxX - a.minX) * (a.maxY - a.minY);
}
function bboxMargin(a) {
  return a.maxX - a.minX + (a.maxY - a.minY);
}
function enlargedArea(a, b) {
  return (Math.max(b.maxX, a.maxX) - Math.min(b.minX, a.minX)) * (Math.max(b.maxY, a.maxY) - Math.min(b.minY, a.minY));
}
function intersectionArea(a, b) {
  const minX = Math.max(a.minX, b.minX);
  const minY = Math.max(a.minY, b.minY);
  const maxX = Math.min(a.maxX, b.maxX);
  const maxY = Math.min(a.maxY, b.maxY);
  return Math.max(0, maxX - minX) * Math.max(0, maxY - minY);
}
function contains(a, b) {
  return a.minX <= b.minX && a.minY <= b.minY && b.maxX <= a.maxX && b.maxY <= a.maxY;
}
function intersects$1(a, b) {
  return b.minX <= a.maxX && b.minY <= a.maxY && b.maxX >= a.minX && b.maxY >= a.minY;
}
function createNode(children) {
  return {
    children,
    height: 1,
    leaf: true,
    minX: Infinity,
    minY: Infinity,
    maxX: -Infinity,
    maxY: -Infinity
  };
}
function multiSelect(arr, left, right, n, compare) {
  const stack = [left, right];
  while (stack.length) {
    right = stack.pop();
    left = stack.pop();
    if (right - left <= n)
      continue;
    const mid = left + Math.ceil((right - left) / n / 2) * n;
    quickselect(arr, mid, left, right, compare);
    stack.push(left, mid, mid, right);
  }
}
function toStyle(flatStyle) {
  const style = new Style$1({
    fill: getFill(flatStyle, ""),
    stroke: getStroke(flatStyle, ""),
    text: getText(flatStyle),
    image: getImage(flatStyle)
  });
  return style;
}
function getFill(flatStyle, prefix) {
  const color = flatStyle[prefix + "fill-color"];
  if (!color) {
    return;
  }
  return new Fill$1({ color });
}
function getStroke(flatStyle, prefix) {
  const width = flatStyle[prefix + "stroke-width"];
  const color = flatStyle[prefix + "stroke-color"];
  if (!width && !color) {
    return;
  }
  return new Stroke$1({
    width,
    color,
    lineCap: flatStyle[prefix + "stroke-line-cap"],
    lineJoin: flatStyle[prefix + "stroke-line-join"],
    lineDash: flatStyle[prefix + "stroke-line-dash"],
    lineDashOffset: flatStyle[prefix + "stroke-line-dash-offset"],
    miterLimit: flatStyle[prefix + "stroke-miter-limit"]
  });
}
function getText(flatStyle) {
  const value = flatStyle["text-value"];
  if (!value) {
    return;
  }
  const text = new Text$1({
    text: value,
    font: flatStyle["text-font"],
    maxAngle: flatStyle["text-max-angle"],
    offsetX: flatStyle["text-offset-x"],
    offsetY: flatStyle["text-offset-y"],
    overflow: flatStyle["text-overflow"],
    placement: flatStyle["text-placement"],
    scale: flatStyle["text-scale"],
    rotateWithView: flatStyle["text-rotate-with-view"],
    rotation: flatStyle["text-rotation"],
    textAlign: flatStyle["text-align"],
    justify: flatStyle["text-justify"],
    textBaseline: flatStyle["text-baseline"],
    padding: flatStyle["text-padding"],
    fill: getFill(flatStyle, "text-"),
    backgroundFill: getFill(flatStyle, "text-background-"),
    stroke: getStroke(flatStyle, "text-"),
    backgroundStroke: getStroke(flatStyle, "text-background-")
  });
  return text;
}
function getImage(flatStyle) {
  const iconSrc = flatStyle["icon-src"];
  const iconImg = flatStyle["icon-img"];
  if (iconSrc || iconImg) {
    const icon = new Icon$1({
      src: iconSrc,
      img: iconImg,
      imgSize: flatStyle["icon-img-size"],
      anchor: flatStyle["icon-anchor"],
      anchorOrigin: flatStyle["icon-anchor-origin"],
      anchorXUnits: flatStyle["icon-anchor-x-units"],
      anchorYUnits: flatStyle["icon-anchor-y-units"],
      color: flatStyle["icon-color"],
      crossOrigin: flatStyle["icon-cross-origin"],
      offset: flatStyle["icon-offset"],
      displacement: flatStyle["icon-displacement"],
      opacity: flatStyle["icon-opacity"],
      scale: flatStyle["icon-scale"],
      rotation: flatStyle["icon-rotation"],
      rotateWithView: flatStyle["icon-rotate-with-view"],
      size: flatStyle["icon-size"],
      declutterMode: flatStyle["icon-declutter-mode"]
    });
    return icon;
  }
  const shapePoints = flatStyle["shape-points"];
  if (shapePoints) {
    const prefix = "shape-";
    const shape = new RegularShape$1({
      points: shapePoints,
      fill: getFill(flatStyle, prefix),
      stroke: getStroke(flatStyle, prefix),
      radius: flatStyle["shape-radius"],
      radius1: flatStyle["shape-radius1"],
      radius2: flatStyle["shape-radius2"],
      angle: flatStyle["shape-angle"],
      displacement: flatStyle["shape-displacement"],
      rotation: flatStyle["shape-rotation"],
      rotateWithView: flatStyle["shape-rotate-with-view"],
      scale: flatStyle["shape-scale"],
      declutterMode: flatStyle["shape-declutter-mode"]
    });
    return shape;
  }
  const circleRadius = flatStyle["circle-radius"];
  if (circleRadius) {
    const prefix = "circle-";
    const circle = new Circle$2({
      radius: circleRadius,
      fill: getFill(flatStyle, prefix),
      stroke: getStroke(flatStyle, prefix),
      displacement: flatStyle["circle-displacement"],
      scale: flatStyle["circle-scale"],
      rotation: flatStyle["circle-rotation"],
      rotateWithView: flatStyle["circle-rotate-with-view"],
      declutterMode: flatStyle["circle-declutter-mode"]
    });
    return circle;
  }
  return;
}
const Property$4 = {
  RENDER_ORDER: "renderOrder"
};
class BaseVectorLayer extends Layer$1 {
  constructor(options) {
    options = options ? options : {};
    const baseOptions = Object.assign({}, options);
    delete baseOptions.style;
    delete baseOptions.renderBuffer;
    delete baseOptions.updateWhileAnimating;
    delete baseOptions.updateWhileInteracting;
    super(baseOptions);
    this.declutter_ = options.declutter !== void 0 ? options.declutter : false;
    this.renderBuffer_ = options.renderBuffer !== void 0 ? options.renderBuffer : 100;
    this.style_ = null;
    this.styleFunction_ = void 0;
    this.setStyle(options.style);
    this.updateWhileAnimating_ = options.updateWhileAnimating !== void 0 ? options.updateWhileAnimating : false;
    this.updateWhileInteracting_ = options.updateWhileInteracting !== void 0 ? options.updateWhileInteracting : false;
  }
  getDeclutter() {
    return this.declutter_;
  }
  getFeatures(pixel) {
    return super.getFeatures(pixel);
  }
  getRenderBuffer() {
    return this.renderBuffer_;
  }
  getRenderOrder() {
    return this.get(Property$4.RENDER_ORDER);
  }
  getStyle() {
    return this.style_;
  }
  getStyleFunction() {
    return this.styleFunction_;
  }
  getUpdateWhileAnimating() {
    return this.updateWhileAnimating_;
  }
  getUpdateWhileInteracting() {
    return this.updateWhileInteracting_;
  }
  renderDeclutter(frameState) {
    if (!frameState.declutterTree) {
      frameState.declutterTree = new RBush$2(9);
    }
    this.getRenderer().renderDeclutter(frameState);
  }
  setRenderOrder(renderOrder) {
    this.set(Property$4.RENDER_ORDER, renderOrder);
  }
  setStyle(style) {
    let styleLike;
    if (style === void 0) {
      styleLike = createDefaultStyle;
    } else if (style === null) {
      styleLike = null;
    } else if (typeof style === "function") {
      styleLike = style;
    } else if (style instanceof Style$1) {
      styleLike = style;
    } else if (Array.isArray(style)) {
      const len = style.length;
      const styles = new Array(len);
      for (let i = 0; i < len; ++i) {
        const s = style[i];
        if (s instanceof Style$1) {
          styles[i] = s;
        } else {
          styles[i] = toStyle(s);
        }
      }
      styleLike = styles;
    } else {
      styleLike = toStyle(style);
    }
    this.style_ = styleLike;
    this.styleFunction_ = style === null ? void 0 : toFunction(this.style_);
    this.changed();
  }
}
const BaseVectorLayer$1 = BaseVectorLayer;
const Instruction = {
  BEGIN_GEOMETRY: 0,
  BEGIN_PATH: 1,
  CIRCLE: 2,
  CLOSE_PATH: 3,
  CUSTOM: 4,
  DRAW_CHARS: 5,
  DRAW_IMAGE: 6,
  END_GEOMETRY: 7,
  FILL: 8,
  MOVE_TO_LINE_TO: 9,
  SET_FILL_STYLE: 10,
  SET_STROKE_STYLE: 11,
  STROKE: 12
};
const fillInstruction = [Instruction.FILL];
const strokeInstruction = [Instruction.STROKE];
const beginPathInstruction = [Instruction.BEGIN_PATH];
const closePathInstruction = [Instruction.CLOSE_PATH];
const CanvasInstruction = Instruction;
class VectorContext {
  drawCustom(geometry, feature2, renderer, hitDetectionRenderer) {
  }
  drawGeometry(geometry) {
  }
  setStyle(style) {
  }
  drawCircle(circleGeometry, feature2) {
  }
  drawFeature(feature2, style) {
  }
  drawGeometryCollection(geometryCollectionGeometry, feature2) {
  }
  drawLineString(lineStringGeometry, feature2) {
  }
  drawMultiLineString(multiLineStringGeometry, feature2) {
  }
  drawMultiPoint(multiPointGeometry, feature2) {
  }
  drawMultiPolygon(multiPolygonGeometry, feature2) {
  }
  drawPoint(pointGeometry, feature2) {
  }
  drawPolygon(polygonGeometry, feature2) {
  }
  drawText(geometry, feature2) {
  }
  setFillStrokeStyle(fillStyle, strokeStyle) {
  }
  setImageStyle(imageStyle, declutterImageWithText) {
  }
  setTextStyle(textStyle, declutterImageWithText) {
  }
}
const VectorContext$1 = VectorContext;
function inflateCoordinates(flatCoordinates, offset, end, stride, coordinates2) {
  coordinates2 = coordinates2 !== void 0 ? coordinates2 : [];
  let i = 0;
  for (let j = offset; j < end; j += stride) {
    coordinates2[i++] = flatCoordinates.slice(j, j + stride);
  }
  coordinates2.length = i;
  return coordinates2;
}
function inflateCoordinatesArray(flatCoordinates, offset, ends, stride, coordinatess) {
  coordinatess = coordinatess !== void 0 ? coordinatess : [];
  let i = 0;
  for (let j = 0, jj = ends.length; j < jj; ++j) {
    const end = ends[j];
    coordinatess[i++] = inflateCoordinates(
      flatCoordinates,
      offset,
      end,
      stride,
      coordinatess[i]
    );
    offset = end;
  }
  coordinatess.length = i;
  return coordinatess;
}
function inflateMultiCoordinatesArray(flatCoordinates, offset, endss, stride, coordinatesss) {
  coordinatesss = coordinatesss !== void 0 ? coordinatesss : [];
  let i = 0;
  for (let j = 0, jj = endss.length; j < jj; ++j) {
    const ends = endss[j];
    coordinatesss[i++] = ends.length === 1 && ends[0] === offset ? [] : inflateCoordinatesArray(
      flatCoordinates,
      offset,
      ends,
      stride,
      coordinatesss[i]
    );
    offset = ends[ends.length - 1];
  }
  coordinatesss.length = i;
  return coordinatesss;
}
class CanvasBuilder extends VectorContext$1 {
  constructor(tolerance, maxExtent, resolution, pixelRatio) {
    super();
    this.tolerance = tolerance;
    this.maxExtent = maxExtent;
    this.pixelRatio = pixelRatio;
    this.maxLineWidth = 0;
    this.resolution = resolution;
    this.beginGeometryInstruction1_ = null;
    this.beginGeometryInstruction2_ = null;
    this.bufferedMaxExtent_ = null;
    this.instructions = [];
    this.coordinates = [];
    this.tmpCoordinate_ = [];
    this.hitDetectionInstructions = [];
    this.state = {};
  }
  applyPixelRatio(dashArray) {
    const pixelRatio = this.pixelRatio;
    return pixelRatio == 1 ? dashArray : dashArray.map(function(dash) {
      return dash * pixelRatio;
    });
  }
  appendFlatPointCoordinates(flatCoordinates, stride) {
    const extent = this.getBufferedMaxExtent();
    const tmpCoord = this.tmpCoordinate_;
    const coordinates2 = this.coordinates;
    let myEnd = coordinates2.length;
    for (let i = 0, ii = flatCoordinates.length; i < ii; i += stride) {
      tmpCoord[0] = flatCoordinates[i];
      tmpCoord[1] = flatCoordinates[i + 1];
      if (containsCoordinate(extent, tmpCoord)) {
        coordinates2[myEnd++] = tmpCoord[0];
        coordinates2[myEnd++] = tmpCoord[1];
      }
    }
    return myEnd;
  }
  appendFlatLineCoordinates(flatCoordinates, offset, end, stride, closed, skipFirst) {
    const coordinates2 = this.coordinates;
    let myEnd = coordinates2.length;
    const extent = this.getBufferedMaxExtent();
    if (skipFirst) {
      offset += stride;
    }
    let lastXCoord = flatCoordinates[offset];
    let lastYCoord = flatCoordinates[offset + 1];
    const nextCoord = this.tmpCoordinate_;
    let skipped = true;
    let i, lastRel, nextRel;
    for (i = offset + stride; i < end; i += stride) {
      nextCoord[0] = flatCoordinates[i];
      nextCoord[1] = flatCoordinates[i + 1];
      nextRel = coordinateRelationship(extent, nextCoord);
      if (nextRel !== lastRel) {
        if (skipped) {
          coordinates2[myEnd++] = lastXCoord;
          coordinates2[myEnd++] = lastYCoord;
          skipped = false;
        }
        coordinates2[myEnd++] = nextCoord[0];
        coordinates2[myEnd++] = nextCoord[1];
      } else if (nextRel === Relationship.INTERSECTING) {
        coordinates2[myEnd++] = nextCoord[0];
        coordinates2[myEnd++] = nextCoord[1];
        skipped = false;
      } else {
        skipped = true;
      }
      lastXCoord = nextCoord[0];
      lastYCoord = nextCoord[1];
      lastRel = nextRel;
    }
    if (closed && skipped || i === offset + stride) {
      coordinates2[myEnd++] = lastXCoord;
      coordinates2[myEnd++] = lastYCoord;
    }
    return myEnd;
  }
  drawCustomCoordinates_(flatCoordinates, offset, ends, stride, builderEnds) {
    for (let i = 0, ii = ends.length; i < ii; ++i) {
      const end = ends[i];
      const builderEnd = this.appendFlatLineCoordinates(
        flatCoordinates,
        offset,
        end,
        stride,
        false,
        false
      );
      builderEnds.push(builderEnd);
      offset = end;
    }
    return offset;
  }
  drawCustom(geometry, feature2, renderer, hitDetectionRenderer) {
    this.beginGeometry(geometry, feature2);
    const type = geometry.getType();
    const stride = geometry.getStride();
    const builderBegin = this.coordinates.length;
    let flatCoordinates, builderEnd, builderEnds, builderEndss;
    let offset;
    switch (type) {
      case "MultiPolygon":
        flatCoordinates = geometry.getOrientedFlatCoordinates();
        builderEndss = [];
        const endss = geometry.getEndss();
        offset = 0;
        for (let i = 0, ii = endss.length; i < ii; ++i) {
          const myEnds = [];
          offset = this.drawCustomCoordinates_(
            flatCoordinates,
            offset,
            endss[i],
            stride,
            myEnds
          );
          builderEndss.push(myEnds);
        }
        this.instructions.push([
          CanvasInstruction.CUSTOM,
          builderBegin,
          builderEndss,
          geometry,
          renderer,
          inflateMultiCoordinatesArray
        ]);
        this.hitDetectionInstructions.push([
          CanvasInstruction.CUSTOM,
          builderBegin,
          builderEndss,
          geometry,
          hitDetectionRenderer || renderer,
          inflateMultiCoordinatesArray
        ]);
        break;
      case "Polygon":
      case "MultiLineString":
        builderEnds = [];
        flatCoordinates = type == "Polygon" ? geometry.getOrientedFlatCoordinates() : geometry.getFlatCoordinates();
        offset = this.drawCustomCoordinates_(
          flatCoordinates,
          0,
          geometry.getEnds(),
          stride,
          builderEnds
        );
        this.instructions.push([
          CanvasInstruction.CUSTOM,
          builderBegin,
          builderEnds,
          geometry,
          renderer,
          inflateCoordinatesArray
        ]);
        this.hitDetectionInstructions.push([
          CanvasInstruction.CUSTOM,
          builderBegin,
          builderEnds,
          geometry,
          hitDetectionRenderer || renderer,
          inflateCoordinatesArray
        ]);
        break;
      case "LineString":
      case "Circle":
        flatCoordinates = geometry.getFlatCoordinates();
        builderEnd = this.appendFlatLineCoordinates(
          flatCoordinates,
          0,
          flatCoordinates.length,
          stride,
          false,
          false
        );
        this.instructions.push([
          CanvasInstruction.CUSTOM,
          builderBegin,
          builderEnd,
          geometry,
          renderer,
          inflateCoordinates
        ]);
        this.hitDetectionInstructions.push([
          CanvasInstruction.CUSTOM,
          builderBegin,
          builderEnd,
          geometry,
          hitDetectionRenderer || renderer,
          inflateCoordinates
        ]);
        break;
      case "MultiPoint":
        flatCoordinates = geometry.getFlatCoordinates();
        builderEnd = this.appendFlatPointCoordinates(flatCoordinates, stride);
        if (builderEnd > builderBegin) {
          this.instructions.push([
            CanvasInstruction.CUSTOM,
            builderBegin,
            builderEnd,
            geometry,
            renderer,
            inflateCoordinates
          ]);
          this.hitDetectionInstructions.push([
            CanvasInstruction.CUSTOM,
            builderBegin,
            builderEnd,
            geometry,
            hitDetectionRenderer || renderer,
            inflateCoordinates
          ]);
        }
        break;
      case "Point":
        flatCoordinates = geometry.getFlatCoordinates();
        this.coordinates.push(flatCoordinates[0], flatCoordinates[1]);
        builderEnd = this.coordinates.length;
        this.instructions.push([
          CanvasInstruction.CUSTOM,
          builderBegin,
          builderEnd,
          geometry,
          renderer
        ]);
        this.hitDetectionInstructions.push([
          CanvasInstruction.CUSTOM,
          builderBegin,
          builderEnd,
          geometry,
          hitDetectionRenderer || renderer
        ]);
        break;
    }
    this.endGeometry(feature2);
  }
  beginGeometry(geometry, feature2) {
    this.beginGeometryInstruction1_ = [
      CanvasInstruction.BEGIN_GEOMETRY,
      feature2,
      0,
      geometry
    ];
    this.instructions.push(this.beginGeometryInstruction1_);
    this.beginGeometryInstruction2_ = [
      CanvasInstruction.BEGIN_GEOMETRY,
      feature2,
      0,
      geometry
    ];
    this.hitDetectionInstructions.push(this.beginGeometryInstruction2_);
  }
  finish() {
    return {
      instructions: this.instructions,
      hitDetectionInstructions: this.hitDetectionInstructions,
      coordinates: this.coordinates
    };
  }
  reverseHitDetectionInstructions() {
    const hitDetectionInstructions = this.hitDetectionInstructions;
    hitDetectionInstructions.reverse();
    let i;
    const n = hitDetectionInstructions.length;
    let instruction;
    let type;
    let begin = -1;
    for (i = 0; i < n; ++i) {
      instruction = hitDetectionInstructions[i];
      type = instruction[0];
      if (type == CanvasInstruction.END_GEOMETRY) {
        begin = i;
      } else if (type == CanvasInstruction.BEGIN_GEOMETRY) {
        instruction[2] = i;
        reverseSubArray(this.hitDetectionInstructions, begin, i);
        begin = -1;
      }
    }
  }
  setFillStrokeStyle(fillStyle, strokeStyle) {
    const state = this.state;
    if (fillStyle) {
      const fillStyleColor = fillStyle.getColor();
      state.fillStyle = asColorLike(
        fillStyleColor ? fillStyleColor : defaultFillStyle
      );
    } else {
      state.fillStyle = void 0;
    }
    if (strokeStyle) {
      const strokeStyleColor = strokeStyle.getColor();
      state.strokeStyle = asColorLike(
        strokeStyleColor ? strokeStyleColor : defaultStrokeStyle
      );
      const strokeStyleLineCap = strokeStyle.getLineCap();
      state.lineCap = strokeStyleLineCap !== void 0 ? strokeStyleLineCap : defaultLineCap;
      const strokeStyleLineDash = strokeStyle.getLineDash();
      state.lineDash = strokeStyleLineDash ? strokeStyleLineDash.slice() : defaultLineDash;
      const strokeStyleLineDashOffset = strokeStyle.getLineDashOffset();
      state.lineDashOffset = strokeStyleLineDashOffset ? strokeStyleLineDashOffset : defaultLineDashOffset;
      const strokeStyleLineJoin = strokeStyle.getLineJoin();
      state.lineJoin = strokeStyleLineJoin !== void 0 ? strokeStyleLineJoin : defaultLineJoin;
      const strokeStyleWidth = strokeStyle.getWidth();
      state.lineWidth = strokeStyleWidth !== void 0 ? strokeStyleWidth : defaultLineWidth;
      const strokeStyleMiterLimit = strokeStyle.getMiterLimit();
      state.miterLimit = strokeStyleMiterLimit !== void 0 ? strokeStyleMiterLimit : defaultMiterLimit;
      if (state.lineWidth > this.maxLineWidth) {
        this.maxLineWidth = state.lineWidth;
        this.bufferedMaxExtent_ = null;
      }
    } else {
      state.strokeStyle = void 0;
      state.lineCap = void 0;
      state.lineDash = null;
      state.lineDashOffset = void 0;
      state.lineJoin = void 0;
      state.lineWidth = void 0;
      state.miterLimit = void 0;
    }
  }
  createFill(state) {
    const fillStyle = state.fillStyle;
    const fillInstruction2 = [CanvasInstruction.SET_FILL_STYLE, fillStyle];
    if (typeof fillStyle !== "string") {
      fillInstruction2.push(true);
    }
    return fillInstruction2;
  }
  applyStroke(state) {
    this.instructions.push(this.createStroke(state));
  }
  createStroke(state) {
    return [
      CanvasInstruction.SET_STROKE_STYLE,
      state.strokeStyle,
      state.lineWidth * this.pixelRatio,
      state.lineCap,
      state.lineJoin,
      state.miterLimit,
      this.applyPixelRatio(state.lineDash),
      state.lineDashOffset * this.pixelRatio
    ];
  }
  updateFillStyle(state, createFill) {
    const fillStyle = state.fillStyle;
    if (typeof fillStyle !== "string" || state.currentFillStyle != fillStyle) {
      if (fillStyle !== void 0) {
        this.instructions.push(createFill.call(this, state));
      }
      state.currentFillStyle = fillStyle;
    }
  }
  updateStrokeStyle(state, applyStroke) {
    const strokeStyle = state.strokeStyle;
    const lineCap = state.lineCap;
    const lineDash = state.lineDash;
    const lineDashOffset = state.lineDashOffset;
    const lineJoin = state.lineJoin;
    const lineWidth = state.lineWidth;
    const miterLimit = state.miterLimit;
    if (state.currentStrokeStyle != strokeStyle || state.currentLineCap != lineCap || lineDash != state.currentLineDash && !equals$1(state.currentLineDash, lineDash) || state.currentLineDashOffset != lineDashOffset || state.currentLineJoin != lineJoin || state.currentLineWidth != lineWidth || state.currentMiterLimit != miterLimit) {
      if (strokeStyle !== void 0) {
        applyStroke.call(this, state);
      }
      state.currentStrokeStyle = strokeStyle;
      state.currentLineCap = lineCap;
      state.currentLineDash = lineDash;
      state.currentLineDashOffset = lineDashOffset;
      state.currentLineJoin = lineJoin;
      state.currentLineWidth = lineWidth;
      state.currentMiterLimit = miterLimit;
    }
  }
  endGeometry(feature2) {
    this.beginGeometryInstruction1_[2] = this.instructions.length;
    this.beginGeometryInstruction1_ = null;
    this.beginGeometryInstruction2_[2] = this.hitDetectionInstructions.length;
    this.beginGeometryInstruction2_ = null;
    const endGeometryInstruction = [CanvasInstruction.END_GEOMETRY, feature2];
    this.instructions.push(endGeometryInstruction);
    this.hitDetectionInstructions.push(endGeometryInstruction);
  }
  getBufferedMaxExtent() {
    if (!this.bufferedMaxExtent_) {
      this.bufferedMaxExtent_ = clone(this.maxExtent);
      if (this.maxLineWidth > 0) {
        const width = this.resolution * (this.maxLineWidth + 1) / 2;
        buffer(this.bufferedMaxExtent_, width, this.bufferedMaxExtent_);
      }
    }
    return this.bufferedMaxExtent_;
  }
}
const Builder = CanvasBuilder;
class CanvasImageBuilder extends Builder {
  constructor(tolerance, maxExtent, resolution, pixelRatio) {
    super(tolerance, maxExtent, resolution, pixelRatio);
    this.hitDetectionImage_ = null;
    this.image_ = null;
    this.imagePixelRatio_ = void 0;
    this.anchorX_ = void 0;
    this.anchorY_ = void 0;
    this.height_ = void 0;
    this.opacity_ = void 0;
    this.originX_ = void 0;
    this.originY_ = void 0;
    this.rotateWithView_ = void 0;
    this.rotation_ = void 0;
    this.scale_ = void 0;
    this.width_ = void 0;
    this.declutterMode_ = void 0;
    this.declutterImageWithText_ = void 0;
  }
  drawPoint(pointGeometry, feature2) {
    if (!this.image_) {
      return;
    }
    this.beginGeometry(pointGeometry, feature2);
    const flatCoordinates = pointGeometry.getFlatCoordinates();
    const stride = pointGeometry.getStride();
    const myBegin = this.coordinates.length;
    const myEnd = this.appendFlatPointCoordinates(flatCoordinates, stride);
    this.instructions.push([
      CanvasInstruction.DRAW_IMAGE,
      myBegin,
      myEnd,
      this.image_,
      this.anchorX_ * this.imagePixelRatio_,
      this.anchorY_ * this.imagePixelRatio_,
      Math.ceil(this.height_ * this.imagePixelRatio_),
      this.opacity_,
      this.originX_ * this.imagePixelRatio_,
      this.originY_ * this.imagePixelRatio_,
      this.rotateWithView_,
      this.rotation_,
      [
        this.scale_[0] * this.pixelRatio / this.imagePixelRatio_,
        this.scale_[1] * this.pixelRatio / this.imagePixelRatio_
      ],
      Math.ceil(this.width_ * this.imagePixelRatio_),
      this.declutterMode_,
      this.declutterImageWithText_
    ]);
    this.hitDetectionInstructions.push([
      CanvasInstruction.DRAW_IMAGE,
      myBegin,
      myEnd,
      this.hitDetectionImage_,
      this.anchorX_,
      this.anchorY_,
      this.height_,
      this.opacity_,
      this.originX_,
      this.originY_,
      this.rotateWithView_,
      this.rotation_,
      this.scale_,
      this.width_,
      this.declutterMode_,
      this.declutterImageWithText_
    ]);
    this.endGeometry(feature2);
  }
  drawMultiPoint(multiPointGeometry, feature2) {
    if (!this.image_) {
      return;
    }
    this.beginGeometry(multiPointGeometry, feature2);
    const flatCoordinates = multiPointGeometry.getFlatCoordinates();
    const stride = multiPointGeometry.getStride();
    const myBegin = this.coordinates.length;
    const myEnd = this.appendFlatPointCoordinates(flatCoordinates, stride);
    this.instructions.push([
      CanvasInstruction.DRAW_IMAGE,
      myBegin,
      myEnd,
      this.image_,
      this.anchorX_ * this.imagePixelRatio_,
      this.anchorY_ * this.imagePixelRatio_,
      Math.ceil(this.height_ * this.imagePixelRatio_),
      this.opacity_,
      this.originX_ * this.imagePixelRatio_,
      this.originY_ * this.imagePixelRatio_,
      this.rotateWithView_,
      this.rotation_,
      [
        this.scale_[0] * this.pixelRatio / this.imagePixelRatio_,
        this.scale_[1] * this.pixelRatio / this.imagePixelRatio_
      ],
      Math.ceil(this.width_ * this.imagePixelRatio_),
      this.declutterMode_,
      this.declutterImageWithText_
    ]);
    this.hitDetectionInstructions.push([
      CanvasInstruction.DRAW_IMAGE,
      myBegin,
      myEnd,
      this.hitDetectionImage_,
      this.anchorX_,
      this.anchorY_,
      this.height_,
      this.opacity_,
      this.originX_,
      this.originY_,
      this.rotateWithView_,
      this.rotation_,
      this.scale_,
      this.width_,
      this.declutterMode_,
      this.declutterImageWithText_
    ]);
    this.endGeometry(feature2);
  }
  finish() {
    this.reverseHitDetectionInstructions();
    this.anchorX_ = void 0;
    this.anchorY_ = void 0;
    this.hitDetectionImage_ = null;
    this.image_ = null;
    this.imagePixelRatio_ = void 0;
    this.height_ = void 0;
    this.scale_ = void 0;
    this.opacity_ = void 0;
    this.originX_ = void 0;
    this.originY_ = void 0;
    this.rotateWithView_ = void 0;
    this.rotation_ = void 0;
    this.width_ = void 0;
    return super.finish();
  }
  setImageStyle(imageStyle, sharedData) {
    const anchor = imageStyle.getAnchor();
    const size = imageStyle.getSize();
    const origin = imageStyle.getOrigin();
    this.imagePixelRatio_ = imageStyle.getPixelRatio(this.pixelRatio);
    this.anchorX_ = anchor[0];
    this.anchorY_ = anchor[1];
    this.hitDetectionImage_ = imageStyle.getHitDetectionImage();
    this.image_ = imageStyle.getImage(this.pixelRatio);
    this.height_ = size[1];
    this.opacity_ = imageStyle.getOpacity();
    this.originX_ = origin[0];
    this.originY_ = origin[1];
    this.rotateWithView_ = imageStyle.getRotateWithView();
    this.rotation_ = imageStyle.getRotation();
    this.scale_ = imageStyle.getScaleArray();
    this.width_ = size[0];
    this.declutterMode_ = imageStyle.getDeclutterMode();
    this.declutterImageWithText_ = sharedData;
  }
}
const ImageBuilder = CanvasImageBuilder;
class CanvasLineStringBuilder extends Builder {
  constructor(tolerance, maxExtent, resolution, pixelRatio) {
    super(tolerance, maxExtent, resolution, pixelRatio);
  }
  drawFlatCoordinates_(flatCoordinates, offset, end, stride) {
    const myBegin = this.coordinates.length;
    const myEnd = this.appendFlatLineCoordinates(
      flatCoordinates,
      offset,
      end,
      stride,
      false,
      false
    );
    const moveToLineToInstruction = [
      CanvasInstruction.MOVE_TO_LINE_TO,
      myBegin,
      myEnd
    ];
    this.instructions.push(moveToLineToInstruction);
    this.hitDetectionInstructions.push(moveToLineToInstruction);
    return end;
  }
  drawLineString(lineStringGeometry, feature2) {
    const state = this.state;
    const strokeStyle = state.strokeStyle;
    const lineWidth = state.lineWidth;
    if (strokeStyle === void 0 || lineWidth === void 0) {
      return;
    }
    this.updateStrokeStyle(state, this.applyStroke);
    this.beginGeometry(lineStringGeometry, feature2);
    this.hitDetectionInstructions.push(
      [
        CanvasInstruction.SET_STROKE_STYLE,
        state.strokeStyle,
        state.lineWidth,
        state.lineCap,
        state.lineJoin,
        state.miterLimit,
        defaultLineDash,
        defaultLineDashOffset
      ],
      beginPathInstruction
    );
    const flatCoordinates = lineStringGeometry.getFlatCoordinates();
    const stride = lineStringGeometry.getStride();
    this.drawFlatCoordinates_(
      flatCoordinates,
      0,
      flatCoordinates.length,
      stride
    );
    this.hitDetectionInstructions.push(strokeInstruction);
    this.endGeometry(feature2);
  }
  drawMultiLineString(multiLineStringGeometry, feature2) {
    const state = this.state;
    const strokeStyle = state.strokeStyle;
    const lineWidth = state.lineWidth;
    if (strokeStyle === void 0 || lineWidth === void 0) {
      return;
    }
    this.updateStrokeStyle(state, this.applyStroke);
    this.beginGeometry(multiLineStringGeometry, feature2);
    this.hitDetectionInstructions.push(
      [
        CanvasInstruction.SET_STROKE_STYLE,
        state.strokeStyle,
        state.lineWidth,
        state.lineCap,
        state.lineJoin,
        state.miterLimit,
        state.lineDash,
        state.lineDashOffset
      ],
      beginPathInstruction
    );
    const ends = multiLineStringGeometry.getEnds();
    const flatCoordinates = multiLineStringGeometry.getFlatCoordinates();
    const stride = multiLineStringGeometry.getStride();
    let offset = 0;
    for (let i = 0, ii = ends.length; i < ii; ++i) {
      offset = this.drawFlatCoordinates_(
        flatCoordinates,
        offset,
        ends[i],
        stride
      );
    }
    this.hitDetectionInstructions.push(strokeInstruction);
    this.endGeometry(feature2);
  }
  finish() {
    const state = this.state;
    if (state.lastStroke != void 0 && state.lastStroke != this.coordinates.length) {
      this.instructions.push(strokeInstruction);
    }
    this.reverseHitDetectionInstructions();
    this.state = null;
    return super.finish();
  }
  applyStroke(state) {
    if (state.lastStroke != void 0 && state.lastStroke != this.coordinates.length) {
      this.instructions.push(strokeInstruction);
      state.lastStroke = this.coordinates.length;
    }
    state.lastStroke = 0;
    super.applyStroke(state);
    this.instructions.push(beginPathInstruction);
  }
}
const LineStringBuilder = CanvasLineStringBuilder;
function douglasPeucker(flatCoordinates, offset, end, stride, squaredTolerance, simplifiedFlatCoordinates, simplifiedOffset) {
  const n = (end - offset) / stride;
  if (n < 3) {
    for (; offset < end; offset += stride) {
      simplifiedFlatCoordinates[simplifiedOffset++] = flatCoordinates[offset];
      simplifiedFlatCoordinates[simplifiedOffset++] = flatCoordinates[offset + 1];
    }
    return simplifiedOffset;
  }
  const markers = new Array(n);
  markers[0] = 1;
  markers[n - 1] = 1;
  const stack = [offset, end - stride];
  let index2 = 0;
  while (stack.length > 0) {
    const last = stack.pop();
    const first = stack.pop();
    let maxSquaredDistance = 0;
    const x1 = flatCoordinates[first];
    const y1 = flatCoordinates[first + 1];
    const x2 = flatCoordinates[last];
    const y2 = flatCoordinates[last + 1];
    for (let i = first + stride; i < last; i += stride) {
      const x = flatCoordinates[i];
      const y = flatCoordinates[i + 1];
      const squaredDistance2 = squaredSegmentDistance(x, y, x1, y1, x2, y2);
      if (squaredDistance2 > maxSquaredDistance) {
        index2 = i;
        maxSquaredDistance = squaredDistance2;
      }
    }
    if (maxSquaredDistance > squaredTolerance) {
      markers[(index2 - offset) / stride] = 1;
      if (first + stride < index2) {
        stack.push(first, index2);
      }
      if (index2 + stride < last) {
        stack.push(index2, last);
      }
    }
  }
  for (let i = 0; i < n; ++i) {
    if (markers[i]) {
      simplifiedFlatCoordinates[simplifiedOffset++] = flatCoordinates[offset + i * stride];
      simplifiedFlatCoordinates[simplifiedOffset++] = flatCoordinates[offset + i * stride + 1];
    }
  }
  return simplifiedOffset;
}
function douglasPeuckerArray(flatCoordinates, offset, ends, stride, squaredTolerance, simplifiedFlatCoordinates, simplifiedOffset, simplifiedEnds) {
  for (let i = 0, ii = ends.length; i < ii; ++i) {
    const end = ends[i];
    simplifiedOffset = douglasPeucker(
      flatCoordinates,
      offset,
      end,
      stride,
      squaredTolerance,
      simplifiedFlatCoordinates,
      simplifiedOffset
    );
    simplifiedEnds.push(simplifiedOffset);
    offset = end;
  }
  return simplifiedOffset;
}
function snap(value, tolerance) {
  return tolerance * Math.round(value / tolerance);
}
function quantize(flatCoordinates, offset, end, stride, tolerance, simplifiedFlatCoordinates, simplifiedOffset) {
  if (offset == end) {
    return simplifiedOffset;
  }
  let x1 = snap(flatCoordinates[offset], tolerance);
  let y1 = snap(flatCoordinates[offset + 1], tolerance);
  offset += stride;
  simplifiedFlatCoordinates[simplifiedOffset++] = x1;
  simplifiedFlatCoordinates[simplifiedOffset++] = y1;
  let x2, y2;
  do {
    x2 = snap(flatCoordinates[offset], tolerance);
    y2 = snap(flatCoordinates[offset + 1], tolerance);
    offset += stride;
    if (offset == end) {
      simplifiedFlatCoordinates[simplifiedOffset++] = x2;
      simplifiedFlatCoordinates[simplifiedOffset++] = y2;
      return simplifiedOffset;
    }
  } while (x2 == x1 && y2 == y1);
  while (offset < end) {
    const x3 = snap(flatCoordinates[offset], tolerance);
    const y3 = snap(flatCoordinates[offset + 1], tolerance);
    offset += stride;
    if (x3 == x2 && y3 == y2) {
      continue;
    }
    const dx1 = x2 - x1;
    const dy1 = y2 - y1;
    const dx2 = x3 - x1;
    const dy2 = y3 - y1;
    if (dx1 * dy2 == dy1 * dx2 && (dx1 < 0 && dx2 < dx1 || dx1 == dx2 || dx1 > 0 && dx2 > dx1) && (dy1 < 0 && dy2 < dy1 || dy1 == dy2 || dy1 > 0 && dy2 > dy1)) {
      x2 = x3;
      y2 = y3;
      continue;
    }
    simplifiedFlatCoordinates[simplifiedOffset++] = x2;
    simplifiedFlatCoordinates[simplifiedOffset++] = y2;
    x1 = x2;
    y1 = y2;
    x2 = x3;
    y2 = y3;
  }
  simplifiedFlatCoordinates[simplifiedOffset++] = x2;
  simplifiedFlatCoordinates[simplifiedOffset++] = y2;
  return simplifiedOffset;
}
function quantizeArray(flatCoordinates, offset, ends, stride, tolerance, simplifiedFlatCoordinates, simplifiedOffset, simplifiedEnds) {
  for (let i = 0, ii = ends.length; i < ii; ++i) {
    const end = ends[i];
    simplifiedOffset = quantize(
      flatCoordinates,
      offset,
      end,
      stride,
      tolerance,
      simplifiedFlatCoordinates,
      simplifiedOffset
    );
    simplifiedEnds.push(simplifiedOffset);
    offset = end;
  }
  return simplifiedOffset;
}
function quantizeMultiArray(flatCoordinates, offset, endss, stride, tolerance, simplifiedFlatCoordinates, simplifiedOffset, simplifiedEndss) {
  for (let i = 0, ii = endss.length; i < ii; ++i) {
    const ends = endss[i];
    const simplifiedEnds = [];
    simplifiedOffset = quantizeArray(
      flatCoordinates,
      offset,
      ends,
      stride,
      tolerance,
      simplifiedFlatCoordinates,
      simplifiedOffset,
      simplifiedEnds
    );
    simplifiedEndss.push(simplifiedEnds);
    offset = ends[ends.length - 1];
  }
  return simplifiedOffset;
}
class CanvasPolygonBuilder extends Builder {
  constructor(tolerance, maxExtent, resolution, pixelRatio) {
    super(tolerance, maxExtent, resolution, pixelRatio);
  }
  drawFlatCoordinatess_(flatCoordinates, offset, ends, stride) {
    const state = this.state;
    const fill = state.fillStyle !== void 0;
    const stroke = state.strokeStyle !== void 0;
    const numEnds = ends.length;
    this.instructions.push(beginPathInstruction);
    this.hitDetectionInstructions.push(beginPathInstruction);
    for (let i = 0; i < numEnds; ++i) {
      const end = ends[i];
      const myBegin = this.coordinates.length;
      const myEnd = this.appendFlatLineCoordinates(
        flatCoordinates,
        offset,
        end,
        stride,
        true,
        !stroke
      );
      const moveToLineToInstruction = [
        CanvasInstruction.MOVE_TO_LINE_TO,
        myBegin,
        myEnd
      ];
      this.instructions.push(moveToLineToInstruction);
      this.hitDetectionInstructions.push(moveToLineToInstruction);
      if (stroke) {
        this.instructions.push(closePathInstruction);
        this.hitDetectionInstructions.push(closePathInstruction);
      }
      offset = end;
    }
    if (fill) {
      this.instructions.push(fillInstruction);
      this.hitDetectionInstructions.push(fillInstruction);
    }
    if (stroke) {
      this.instructions.push(strokeInstruction);
      this.hitDetectionInstructions.push(strokeInstruction);
    }
    return offset;
  }
  drawCircle(circleGeometry, feature2) {
    const state = this.state;
    const fillStyle = state.fillStyle;
    const strokeStyle = state.strokeStyle;
    if (fillStyle === void 0 && strokeStyle === void 0) {
      return;
    }
    this.setFillStrokeStyles_();
    this.beginGeometry(circleGeometry, feature2);
    if (state.fillStyle !== void 0) {
      this.hitDetectionInstructions.push([
        CanvasInstruction.SET_FILL_STYLE,
        defaultFillStyle
      ]);
    }
    if (state.strokeStyle !== void 0) {
      this.hitDetectionInstructions.push([
        CanvasInstruction.SET_STROKE_STYLE,
        state.strokeStyle,
        state.lineWidth,
        state.lineCap,
        state.lineJoin,
        state.miterLimit,
        state.lineDash,
        state.lineDashOffset
      ]);
    }
    const flatCoordinates = circleGeometry.getFlatCoordinates();
    const stride = circleGeometry.getStride();
    const myBegin = this.coordinates.length;
    this.appendFlatLineCoordinates(
      flatCoordinates,
      0,
      flatCoordinates.length,
      stride,
      false,
      false
    );
    const circleInstruction = [CanvasInstruction.CIRCLE, myBegin];
    this.instructions.push(beginPathInstruction, circleInstruction);
    this.hitDetectionInstructions.push(beginPathInstruction, circleInstruction);
    if (state.fillStyle !== void 0) {
      this.instructions.push(fillInstruction);
      this.hitDetectionInstructions.push(fillInstruction);
    }
    if (state.strokeStyle !== void 0) {
      this.instructions.push(strokeInstruction);
      this.hitDetectionInstructions.push(strokeInstruction);
    }
    this.endGeometry(feature2);
  }
  drawPolygon(polygonGeometry, feature2) {
    const state = this.state;
    const fillStyle = state.fillStyle;
    const strokeStyle = state.strokeStyle;
    if (fillStyle === void 0 && strokeStyle === void 0) {
      return;
    }
    this.setFillStrokeStyles_();
    this.beginGeometry(polygonGeometry, feature2);
    if (state.fillStyle !== void 0) {
      this.hitDetectionInstructions.push([
        CanvasInstruction.SET_FILL_STYLE,
        defaultFillStyle
      ]);
    }
    if (state.strokeStyle !== void 0) {
      this.hitDetectionInstructions.push([
        CanvasInstruction.SET_STROKE_STYLE,
        state.strokeStyle,
        state.lineWidth,
        state.lineCap,
        state.lineJoin,
        state.miterLimit,
        state.lineDash,
        state.lineDashOffset
      ]);
    }
    const ends = polygonGeometry.getEnds();
    const flatCoordinates = polygonGeometry.getOrientedFlatCoordinates();
    const stride = polygonGeometry.getStride();
    this.drawFlatCoordinatess_(
      flatCoordinates,
      0,
      ends,
      stride
    );
    this.endGeometry(feature2);
  }
  drawMultiPolygon(multiPolygonGeometry, feature2) {
    const state = this.state;
    const fillStyle = state.fillStyle;
    const strokeStyle = state.strokeStyle;
    if (fillStyle === void 0 && strokeStyle === void 0) {
      return;
    }
    this.setFillStrokeStyles_();
    this.beginGeometry(multiPolygonGeometry, feature2);
    if (state.fillStyle !== void 0) {
      this.hitDetectionInstructions.push([
        CanvasInstruction.SET_FILL_STYLE,
        defaultFillStyle
      ]);
    }
    if (state.strokeStyle !== void 0) {
      this.hitDetectionInstructions.push([
        CanvasInstruction.SET_STROKE_STYLE,
        state.strokeStyle,
        state.lineWidth,
        state.lineCap,
        state.lineJoin,
        state.miterLimit,
        state.lineDash,
        state.lineDashOffset
      ]);
    }
    const endss = multiPolygonGeometry.getEndss();
    const flatCoordinates = multiPolygonGeometry.getOrientedFlatCoordinates();
    const stride = multiPolygonGeometry.getStride();
    let offset = 0;
    for (let i = 0, ii = endss.length; i < ii; ++i) {
      offset = this.drawFlatCoordinatess_(
        flatCoordinates,
        offset,
        endss[i],
        stride
      );
    }
    this.endGeometry(feature2);
  }
  finish() {
    this.reverseHitDetectionInstructions();
    this.state = null;
    const tolerance = this.tolerance;
    if (tolerance !== 0) {
      const coordinates2 = this.coordinates;
      for (let i = 0, ii = coordinates2.length; i < ii; ++i) {
        coordinates2[i] = snap(coordinates2[i], tolerance);
      }
    }
    return super.finish();
  }
  setFillStrokeStyles_() {
    const state = this.state;
    const fillStyle = state.fillStyle;
    if (fillStyle !== void 0) {
      this.updateFillStyle(state, this.createFill);
    }
    if (state.strokeStyle !== void 0) {
      this.updateStrokeStyle(state, this.applyStroke);
    }
  }
}
const PolygonBuilder = CanvasPolygonBuilder;
function matchingChunk(maxAngle, flatCoordinates, offset, end, stride) {
  let chunkStart = offset;
  let chunkEnd = offset;
  let chunkM = 0;
  let m = 0;
  let start = offset;
  let acos, i, m12, m23, x1, y1, x12, y12, x23, y23;
  for (i = offset; i < end; i += stride) {
    const x2 = flatCoordinates[i];
    const y2 = flatCoordinates[i + 1];
    if (x1 !== void 0) {
      x23 = x2 - x1;
      y23 = y2 - y1;
      m23 = Math.sqrt(x23 * x23 + y23 * y23);
      if (x12 !== void 0) {
        m += m12;
        acos = Math.acos((x12 * x23 + y12 * y23) / (m12 * m23));
        if (acos > maxAngle) {
          if (m > chunkM) {
            chunkM = m;
            chunkStart = start;
            chunkEnd = i;
          }
          m = 0;
          start = i - stride;
        }
      }
      m12 = m23;
      x12 = x23;
      y12 = y23;
    }
    x1 = x2;
    y1 = y2;
  }
  m += m23;
  return m > chunkM ? [start, i] : [chunkStart, chunkEnd];
}
const TEXT_ALIGN = {
  "left": 0,
  "end": 0,
  "center": 0.5,
  "right": 1,
  "start": 1,
  "top": 0,
  "middle": 0.5,
  "hanging": 0.2,
  "alphabetic": 0.8,
  "ideographic": 0.8,
  "bottom": 1
};
class CanvasTextBuilder extends Builder {
  constructor(tolerance, maxExtent, resolution, pixelRatio) {
    super(tolerance, maxExtent, resolution, pixelRatio);
    this.labels_ = null;
    this.text_ = "";
    this.textOffsetX_ = 0;
    this.textOffsetY_ = 0;
    this.textRotateWithView_ = void 0;
    this.textRotation_ = 0;
    this.textFillState_ = null;
    this.fillStates = {};
    this.textStrokeState_ = null;
    this.strokeStates = {};
    this.textState_ = {};
    this.textStates = {};
    this.textKey_ = "";
    this.fillKey_ = "";
    this.strokeKey_ = "";
    this.declutterImageWithText_ = void 0;
  }
  finish() {
    const instructions = super.finish();
    instructions.textStates = this.textStates;
    instructions.fillStates = this.fillStates;
    instructions.strokeStates = this.strokeStates;
    return instructions;
  }
  drawText(geometry, feature2) {
    const fillState = this.textFillState_;
    const strokeState = this.textStrokeState_;
    const textState = this.textState_;
    if (this.text_ === "" || !textState || !fillState && !strokeState) {
      return;
    }
    const coordinates2 = this.coordinates;
    let begin = coordinates2.length;
    const geometryType = geometry.getType();
    let flatCoordinates = null;
    let stride = geometry.getStride();
    if (textState.placement === "line" && (geometryType == "LineString" || geometryType == "MultiLineString" || geometryType == "Polygon" || geometryType == "MultiPolygon")) {
      if (!intersects$2(this.getBufferedMaxExtent(), geometry.getExtent())) {
        return;
      }
      let ends;
      flatCoordinates = geometry.getFlatCoordinates();
      if (geometryType == "LineString") {
        ends = [flatCoordinates.length];
      } else if (geometryType == "MultiLineString") {
        ends = geometry.getEnds();
      } else if (geometryType == "Polygon") {
        ends = geometry.getEnds().slice(0, 1);
      } else if (geometryType == "MultiPolygon") {
        const endss = geometry.getEndss();
        ends = [];
        for (let i = 0, ii = endss.length; i < ii; ++i) {
          ends.push(endss[i][0]);
        }
      }
      this.beginGeometry(geometry, feature2);
      const textAlign = textState.textAlign;
      let flatOffset = 0;
      let flatEnd;
      for (let o = 0, oo = ends.length; o < oo; ++o) {
        if (textAlign == void 0) {
          const range = matchingChunk(
            textState.maxAngle,
            flatCoordinates,
            flatOffset,
            ends[o],
            stride
          );
          flatOffset = range[0];
          flatEnd = range[1];
        } else {
          flatEnd = ends[o];
        }
        for (let i = flatOffset; i < flatEnd; i += stride) {
          coordinates2.push(flatCoordinates[i], flatCoordinates[i + 1]);
        }
        const end = coordinates2.length;
        flatOffset = ends[o];
        this.drawChars_(begin, end);
        begin = end;
      }
      this.endGeometry(feature2);
    } else {
      let geometryWidths = textState.overflow ? null : [];
      switch (geometryType) {
        case "Point":
        case "MultiPoint":
          flatCoordinates = geometry.getFlatCoordinates();
          break;
        case "LineString":
          flatCoordinates = geometry.getFlatMidpoint();
          break;
        case "Circle":
          flatCoordinates = geometry.getCenter();
          break;
        case "MultiLineString":
          flatCoordinates = geometry.getFlatMidpoints();
          stride = 2;
          break;
        case "Polygon":
          flatCoordinates = geometry.getFlatInteriorPoint();
          if (!textState.overflow) {
            geometryWidths.push(flatCoordinates[2] / this.resolution);
          }
          stride = 3;
          break;
        case "MultiPolygon":
          const interiorPoints = geometry.getFlatInteriorPoints();
          flatCoordinates = [];
          for (let i = 0, ii = interiorPoints.length; i < ii; i += 3) {
            if (!textState.overflow) {
              geometryWidths.push(interiorPoints[i + 2] / this.resolution);
            }
            flatCoordinates.push(interiorPoints[i], interiorPoints[i + 1]);
          }
          if (flatCoordinates.length === 0) {
            return;
          }
          stride = 2;
          break;
      }
      const end = this.appendFlatPointCoordinates(flatCoordinates, stride);
      if (end === begin) {
        return;
      }
      if (geometryWidths && (end - begin) / 2 !== flatCoordinates.length / stride) {
        let beg = begin / 2;
        geometryWidths = geometryWidths.filter((w, i) => {
          const keep = coordinates2[(beg + i) * 2] === flatCoordinates[i * stride] && coordinates2[(beg + i) * 2 + 1] === flatCoordinates[i * stride + 1];
          if (!keep) {
            --beg;
          }
          return keep;
        });
      }
      this.saveTextStates_();
      if (textState.backgroundFill || textState.backgroundStroke) {
        this.setFillStrokeStyle(
          textState.backgroundFill,
          textState.backgroundStroke
        );
        if (textState.backgroundFill) {
          this.updateFillStyle(this.state, this.createFill);
          this.hitDetectionInstructions.push(this.createFill(this.state));
        }
        if (textState.backgroundStroke) {
          this.updateStrokeStyle(this.state, this.applyStroke);
          this.hitDetectionInstructions.push(this.createStroke(this.state));
        }
      }
      this.beginGeometry(geometry, feature2);
      let padding = textState.padding;
      if (padding != defaultPadding && (textState.scale[0] < 0 || textState.scale[1] < 0)) {
        let p0 = textState.padding[0];
        let p12 = textState.padding[1];
        let p22 = textState.padding[2];
        let p32 = textState.padding[3];
        if (textState.scale[0] < 0) {
          p12 = -p12;
          p32 = -p32;
        }
        if (textState.scale[1] < 0) {
          p0 = -p0;
          p22 = -p22;
        }
        padding = [p0, p12, p22, p32];
      }
      const pixelRatio = this.pixelRatio;
      this.instructions.push([
        CanvasInstruction.DRAW_IMAGE,
        begin,
        end,
        null,
        NaN,
        NaN,
        NaN,
        1,
        0,
        0,
        this.textRotateWithView_,
        this.textRotation_,
        [1, 1],
        NaN,
        void 0,
        this.declutterImageWithText_,
        padding == defaultPadding ? defaultPadding : padding.map(function(p) {
          return p * pixelRatio;
        }),
        !!textState.backgroundFill,
        !!textState.backgroundStroke,
        this.text_,
        this.textKey_,
        this.strokeKey_,
        this.fillKey_,
        this.textOffsetX_,
        this.textOffsetY_,
        geometryWidths
      ]);
      const scale2 = 1 / pixelRatio;
      this.hitDetectionInstructions.push([
        CanvasInstruction.DRAW_IMAGE,
        begin,
        end,
        null,
        NaN,
        NaN,
        NaN,
        1,
        0,
        0,
        this.textRotateWithView_,
        this.textRotation_,
        [scale2, scale2],
        NaN,
        void 0,
        this.declutterImageWithText_,
        padding,
        !!textState.backgroundFill,
        !!textState.backgroundStroke,
        this.text_,
        this.textKey_,
        this.strokeKey_,
        this.fillKey_,
        this.textOffsetX_,
        this.textOffsetY_,
        geometryWidths
      ]);
      this.endGeometry(feature2);
    }
  }
  saveTextStates_() {
    const strokeState = this.textStrokeState_;
    const textState = this.textState_;
    const fillState = this.textFillState_;
    const strokeKey = this.strokeKey_;
    if (strokeState) {
      if (!(strokeKey in this.strokeStates)) {
        this.strokeStates[strokeKey] = {
          strokeStyle: strokeState.strokeStyle,
          lineCap: strokeState.lineCap,
          lineDashOffset: strokeState.lineDashOffset,
          lineWidth: strokeState.lineWidth,
          lineJoin: strokeState.lineJoin,
          miterLimit: strokeState.miterLimit,
          lineDash: strokeState.lineDash
        };
      }
    }
    const textKey = this.textKey_;
    if (!(textKey in this.textStates)) {
      this.textStates[textKey] = {
        font: textState.font,
        textAlign: textState.textAlign || defaultTextAlign,
        justify: textState.justify,
        textBaseline: textState.textBaseline || defaultTextBaseline,
        scale: textState.scale
      };
    }
    const fillKey = this.fillKey_;
    if (fillState) {
      if (!(fillKey in this.fillStates)) {
        this.fillStates[fillKey] = {
          fillStyle: fillState.fillStyle
        };
      }
    }
  }
  drawChars_(begin, end) {
    const strokeState = this.textStrokeState_;
    const textState = this.textState_;
    const strokeKey = this.strokeKey_;
    const textKey = this.textKey_;
    const fillKey = this.fillKey_;
    this.saveTextStates_();
    const pixelRatio = this.pixelRatio;
    const baseline = TEXT_ALIGN[textState.textBaseline];
    const offsetY = this.textOffsetY_ * pixelRatio;
    const text = this.text_;
    const strokeWidth = strokeState ? strokeState.lineWidth * Math.abs(textState.scale[0]) / 2 : 0;
    this.instructions.push([
      CanvasInstruction.DRAW_CHARS,
      begin,
      end,
      baseline,
      textState.overflow,
      fillKey,
      textState.maxAngle,
      pixelRatio,
      offsetY,
      strokeKey,
      strokeWidth * pixelRatio,
      text,
      textKey,
      1
    ]);
    this.hitDetectionInstructions.push([
      CanvasInstruction.DRAW_CHARS,
      begin,
      end,
      baseline,
      textState.overflow,
      fillKey,
      textState.maxAngle,
      1,
      offsetY,
      strokeKey,
      strokeWidth,
      text,
      textKey,
      1 / pixelRatio
    ]);
  }
  setTextStyle(textStyle, sharedData) {
    let textState, fillState, strokeState;
    if (!textStyle) {
      this.text_ = "";
    } else {
      const textFillStyle = textStyle.getFill();
      if (!textFillStyle) {
        fillState = null;
        this.textFillState_ = fillState;
      } else {
        fillState = this.textFillState_;
        if (!fillState) {
          fillState = {};
          this.textFillState_ = fillState;
        }
        fillState.fillStyle = asColorLike(
          textFillStyle.getColor() || defaultFillStyle
        );
      }
      const textStrokeStyle = textStyle.getStroke();
      if (!textStrokeStyle) {
        strokeState = null;
        this.textStrokeState_ = strokeState;
      } else {
        strokeState = this.textStrokeState_;
        if (!strokeState) {
          strokeState = {};
          this.textStrokeState_ = strokeState;
        }
        const lineDash = textStrokeStyle.getLineDash();
        const lineDashOffset = textStrokeStyle.getLineDashOffset();
        const lineWidth = textStrokeStyle.getWidth();
        const miterLimit = textStrokeStyle.getMiterLimit();
        strokeState.lineCap = textStrokeStyle.getLineCap() || defaultLineCap;
        strokeState.lineDash = lineDash ? lineDash.slice() : defaultLineDash;
        strokeState.lineDashOffset = lineDashOffset === void 0 ? defaultLineDashOffset : lineDashOffset;
        strokeState.lineJoin = textStrokeStyle.getLineJoin() || defaultLineJoin;
        strokeState.lineWidth = lineWidth === void 0 ? defaultLineWidth : lineWidth;
        strokeState.miterLimit = miterLimit === void 0 ? defaultMiterLimit : miterLimit;
        strokeState.strokeStyle = asColorLike(
          textStrokeStyle.getColor() || defaultStrokeStyle
        );
      }
      textState = this.textState_;
      const font = textStyle.getFont() || defaultFont;
      registerFont(font);
      const textScale = textStyle.getScaleArray();
      textState.overflow = textStyle.getOverflow();
      textState.font = font;
      textState.maxAngle = textStyle.getMaxAngle();
      textState.placement = textStyle.getPlacement();
      textState.textAlign = textStyle.getTextAlign();
      textState.justify = textStyle.getJustify();
      textState.textBaseline = textStyle.getTextBaseline() || defaultTextBaseline;
      textState.backgroundFill = textStyle.getBackgroundFill();
      textState.backgroundStroke = textStyle.getBackgroundStroke();
      textState.padding = textStyle.getPadding() || defaultPadding;
      textState.scale = textScale === void 0 ? [1, 1] : textScale;
      const textOffsetX = textStyle.getOffsetX();
      const textOffsetY = textStyle.getOffsetY();
      const textRotateWithView = textStyle.getRotateWithView();
      const textRotation = textStyle.getRotation();
      this.text_ = textStyle.getText() || "";
      this.textOffsetX_ = textOffsetX === void 0 ? 0 : textOffsetX;
      this.textOffsetY_ = textOffsetY === void 0 ? 0 : textOffsetY;
      this.textRotateWithView_ = textRotateWithView === void 0 ? false : textRotateWithView;
      this.textRotation_ = textRotation === void 0 ? 0 : textRotation;
      this.strokeKey_ = strokeState ? (typeof strokeState.strokeStyle == "string" ? strokeState.strokeStyle : getUid(strokeState.strokeStyle)) + strokeState.lineCap + strokeState.lineDashOffset + "|" + strokeState.lineWidth + strokeState.lineJoin + strokeState.miterLimit + "[" + strokeState.lineDash.join() + "]" : "";
      this.textKey_ = textState.font + textState.scale + (textState.textAlign || "?") + (textState.justify || "?") + (textState.textBaseline || "?");
      this.fillKey_ = fillState ? typeof fillState.fillStyle == "string" ? fillState.fillStyle : "|" + getUid(fillState.fillStyle) : "";
    }
    this.declutterImageWithText_ = sharedData;
  }
}
const BATCH_CONSTRUCTORS = {
  "Circle": PolygonBuilder,
  "Default": Builder,
  "Image": ImageBuilder,
  "LineString": LineStringBuilder,
  "Polygon": PolygonBuilder,
  "Text": CanvasTextBuilder
};
class BuilderGroup {
  constructor(tolerance, maxExtent, resolution, pixelRatio) {
    this.tolerance_ = tolerance;
    this.maxExtent_ = maxExtent;
    this.pixelRatio_ = pixelRatio;
    this.resolution_ = resolution;
    this.buildersByZIndex_ = {};
  }
  finish() {
    const builderInstructions = {};
    for (const zKey in this.buildersByZIndex_) {
      builderInstructions[zKey] = builderInstructions[zKey] || {};
      const builders = this.buildersByZIndex_[zKey];
      for (const builderKey in builders) {
        const builderInstruction = builders[builderKey].finish();
        builderInstructions[zKey][builderKey] = builderInstruction;
      }
    }
    return builderInstructions;
  }
  getBuilder(zIndex, builderType) {
    const zIndexKey = zIndex !== void 0 ? zIndex.toString() : "0";
    let replays = this.buildersByZIndex_[zIndexKey];
    if (replays === void 0) {
      replays = {};
      this.buildersByZIndex_[zIndexKey] = replays;
    }
    let replay = replays[builderType];
    if (replay === void 0) {
      const Constructor = BATCH_CONSTRUCTORS[builderType];
      replay = new Constructor(
        this.tolerance_,
        this.maxExtent_,
        this.resolution_,
        this.pixelRatio_
      );
      replays[builderType] = replay;
    }
    return replay;
  }
}
const CanvasBuilderGroup = BuilderGroup;
class LayerRenderer extends Observable$1 {
  constructor(layer) {
    super();
    this.ready = true;
    this.boundHandleImageChange_ = this.handleImageChange_.bind(this);
    this.layer_ = layer;
    this.declutterExecutorGroup = null;
  }
  getFeatures(pixel) {
    return abstract();
  }
  getData(pixel) {
    return null;
  }
  prepareFrame(frameState) {
    return abstract();
  }
  renderFrame(frameState, target) {
    return abstract();
  }
  loadedTileCallback(tiles, zoom, tile) {
    if (!tiles[zoom]) {
      tiles[zoom] = {};
    }
    tiles[zoom][tile.tileCoord.toString()] = tile;
    return void 0;
  }
  createLoadedTileFinder(source, projection, tiles) {
    return function(zoom, tileRange) {
      const callback = this.loadedTileCallback.bind(this, tiles, zoom);
      return source.forEachLoadedTile(projection, zoom, tileRange, callback);
    }.bind(this);
  }
  forEachFeatureAtCoordinate(coordinate, frameState, hitTolerance, callback, matches) {
    return void 0;
  }
  getLayer() {
    return this.layer_;
  }
  handleFontsChanged() {
  }
  handleImageChange_(event) {
    const image = event.target;
    if (image.getState() === ImageState.LOADED) {
      this.renderIfReadyAndVisible();
    }
  }
  loadImage(image) {
    let imageState = image.getState();
    if (imageState != ImageState.LOADED && imageState != ImageState.ERROR) {
      image.addEventListener(EventType.CHANGE, this.boundHandleImageChange_);
    }
    if (imageState == ImageState.IDLE) {
      image.load();
      imageState = image.getState();
    }
    return imageState == ImageState.LOADED;
  }
  renderIfReadyAndVisible() {
    const layer = this.getLayer();
    if (layer && layer.getVisible() && layer.getSourceState() === "ready") {
      layer.changed();
    }
  }
  disposeInternal() {
    delete this.layer_;
    super.disposeInternal();
  }
}
const LayerRenderer$1 = LayerRenderer;
class RenderEvent extends BaseEvent$1 {
  constructor(type, inversePixelTransform, frameState, context) {
    super(type);
    this.inversePixelTransform = inversePixelTransform;
    this.frameState = frameState;
    this.context = context;
  }
}
const RenderEvent$1 = RenderEvent;
const tmp_ = new Array(6);
function create$2() {
  return [1, 0, 0, 1, 0, 0];
}
function reset(transform2) {
  return set(transform2, 1, 0, 0, 1, 0, 0);
}
function multiply(transform1, transform2) {
  const a1 = transform1[0];
  const b1 = transform1[1];
  const c1 = transform1[2];
  const d1 = transform1[3];
  const e1 = transform1[4];
  const f1 = transform1[5];
  const a2 = transform2[0];
  const b2 = transform2[1];
  const c2 = transform2[2];
  const d2 = transform2[3];
  const e2 = transform2[4];
  const f2 = transform2[5];
  transform1[0] = a1 * a2 + c1 * b2;
  transform1[1] = b1 * a2 + d1 * b2;
  transform1[2] = a1 * c2 + c1 * d2;
  transform1[3] = b1 * c2 + d1 * d2;
  transform1[4] = a1 * e2 + c1 * f2 + e1;
  transform1[5] = b1 * e2 + d1 * f2 + f1;
  return transform1;
}
function set(transform2, a, b, c, d, e, f) {
  transform2[0] = a;
  transform2[1] = b;
  transform2[2] = c;
  transform2[3] = d;
  transform2[4] = e;
  transform2[5] = f;
  return transform2;
}
function setFromArray(transform1, transform2) {
  transform1[0] = transform2[0];
  transform1[1] = transform2[1];
  transform1[2] = transform2[2];
  transform1[3] = transform2[3];
  transform1[4] = transform2[4];
  transform1[5] = transform2[5];
  return transform1;
}
function apply(transform2, coordinate) {
  const x = coordinate[0];
  const y = coordinate[1];
  coordinate[0] = transform2[0] * x + transform2[2] * y + transform2[4];
  coordinate[1] = transform2[1] * x + transform2[3] * y + transform2[5];
  return coordinate;
}
function rotate$1(transform2, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return multiply(transform2, set(tmp_, cos, sin, -sin, cos, 0, 0));
}
function scale$1(transform2, x, y) {
  return multiply(transform2, set(tmp_, x, 0, 0, y, 0, 0));
}
function makeScale(target, x, y) {
  return set(target, x, 0, 0, y, 0, 0);
}
function translate$1(transform2, dx, dy) {
  return multiply(transform2, set(tmp_, 1, 0, 0, 1, dx, dy));
}
function compose(transform2, dx1, dy1, sx, sy, angle, dx2, dy2) {
  const sin = Math.sin(angle);
  const cos = Math.cos(angle);
  transform2[0] = sx * cos;
  transform2[1] = sy * sin;
  transform2[2] = -sx * sin;
  transform2[3] = sy * cos;
  transform2[4] = dx2 * sx * cos - dy2 * sx * sin + dx1;
  transform2[5] = dx2 * sy * sin + dy2 * sy * cos + dy1;
  return transform2;
}
function makeInverse(target, source) {
  const det = determinant(source);
  assert(det !== 0, 32);
  const a = source[0];
  const b = source[1];
  const c = source[2];
  const d = source[3];
  const e = source[4];
  const f = source[5];
  target[0] = d / det;
  target[1] = -b / det;
  target[2] = -c / det;
  target[3] = a / det;
  target[4] = (c * f - d * e) / det;
  target[5] = -(a * f - b * e) / det;
  return target;
}
function determinant(mat) {
  return mat[0] * mat[3] - mat[1] * mat[2];
}
let transformStringDiv;
function toString(mat) {
  const transformString = "matrix(" + mat.join(", ") + ")";
  if (WORKER_OFFSCREEN_CANVAS) {
    return transformString;
  }
  const node = transformStringDiv || (transformStringDiv = document.createElement("div"));
  node.style.transform = transformString;
  return node.style.transform;
}
const canvasPool$1 = [];
let pixelContext = null;
function createPixelContext() {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  pixelContext = canvas.getContext("2d");
}
class CanvasLayerRenderer extends LayerRenderer$1 {
  constructor(layer) {
    super(layer);
    this.container = null;
    this.renderedResolution;
    this.tempTransform = create$2();
    this.pixelTransform = create$2();
    this.inversePixelTransform = create$2();
    this.context = null;
    this.containerReused = false;
    this.pixelContext_ = null;
    this.frameState = null;
  }
  getImageData(image, col, row) {
    if (!pixelContext) {
      createPixelContext();
    }
    pixelContext.clearRect(0, 0, 1, 1);
    let data;
    try {
      pixelContext.drawImage(image, col, row, 1, 1, 0, 0, 1, 1);
      data = pixelContext.getImageData(0, 0, 1, 1).data;
    } catch (err) {
      pixelContext = null;
      return null;
    }
    return data;
  }
  getBackground(frameState) {
    const layer = this.getLayer();
    let background = layer.getBackground();
    if (typeof background === "function") {
      background = background(frameState.viewState.resolution);
    }
    return background || void 0;
  }
  useContainer(target, transform2, backgroundColor) {
    const layerClassName = this.getLayer().getClassName();
    let container, context;
    if (target && target.className === layerClassName && (!backgroundColor || target && target.style.backgroundColor && equals$1(
      asArray(target.style.backgroundColor),
      asArray(backgroundColor)
    ))) {
      const canvas = target.firstElementChild;
      if (canvas instanceof HTMLCanvasElement) {
        context = canvas.getContext("2d");
      }
    }
    if (context && context.canvas.style.transform === transform2) {
      this.container = target;
      this.context = context;
      this.containerReused = true;
    } else if (this.containerReused) {
      this.container = null;
      this.context = null;
      this.containerReused = false;
    }
    if (!this.container) {
      container = document.createElement("div");
      container.className = layerClassName;
      let style = container.style;
      style.position = "absolute";
      style.width = "100%";
      style.height = "100%";
      context = createCanvasContext2D();
      const canvas = context.canvas;
      container.appendChild(canvas);
      style = canvas.style;
      style.position = "absolute";
      style.left = "0";
      style.transformOrigin = "top left";
      this.container = container;
      this.context = context;
    }
    if (!this.containerReused && backgroundColor && !this.container.style.backgroundColor) {
      this.container.style.backgroundColor = backgroundColor;
    }
  }
  clipUnrotated(context, frameState, extent) {
    const topLeft = getTopLeft(extent);
    const topRight = getTopRight(extent);
    const bottomRight = getBottomRight(extent);
    const bottomLeft = getBottomLeft(extent);
    apply(frameState.coordinateToPixelTransform, topLeft);
    apply(frameState.coordinateToPixelTransform, topRight);
    apply(frameState.coordinateToPixelTransform, bottomRight);
    apply(frameState.coordinateToPixelTransform, bottomLeft);
    const inverted = this.inversePixelTransform;
    apply(inverted, topLeft);
    apply(inverted, topRight);
    apply(inverted, bottomRight);
    apply(inverted, bottomLeft);
    context.save();
    context.beginPath();
    context.moveTo(Math.round(topLeft[0]), Math.round(topLeft[1]));
    context.lineTo(Math.round(topRight[0]), Math.round(topRight[1]));
    context.lineTo(Math.round(bottomRight[0]), Math.round(bottomRight[1]));
    context.lineTo(Math.round(bottomLeft[0]), Math.round(bottomLeft[1]));
    context.clip();
  }
  dispatchRenderEvent_(type, context, frameState) {
    const layer = this.getLayer();
    if (layer.hasListener(type)) {
      const event = new RenderEvent$1(
        type,
        this.inversePixelTransform,
        frameState,
        context
      );
      layer.dispatchEvent(event);
    }
  }
  preRender(context, frameState) {
    this.frameState = frameState;
    this.dispatchRenderEvent_(RenderEventType.PRERENDER, context, frameState);
  }
  postRender(context, frameState) {
    this.dispatchRenderEvent_(RenderEventType.POSTRENDER, context, frameState);
  }
  getRenderTransform(center, resolution, rotation, pixelRatio, width, height, offsetX) {
    const dx1 = width / 2;
    const dy1 = height / 2;
    const sx = pixelRatio / resolution;
    const sy = -sx;
    const dx2 = -center[0] + offsetX;
    const dy2 = -center[1];
    return compose(
      this.tempTransform,
      dx1,
      dy1,
      sx,
      sy,
      -rotation,
      dx2,
      dy2
    );
  }
  disposeInternal() {
    delete this.frameState;
    super.disposeInternal();
  }
}
const CanvasLayerRenderer$1 = CanvasLayerRenderer;
function transform2D(flatCoordinates, offset, end, stride, transform2, dest) {
  dest = dest ? dest : [];
  let i = 0;
  for (let j = offset; j < end; j += stride) {
    const x = flatCoordinates[j];
    const y = flatCoordinates[j + 1];
    dest[i++] = transform2[0] * x + transform2[2] * y + transform2[4];
    dest[i++] = transform2[1] * x + transform2[3] * y + transform2[5];
  }
  if (dest && dest.length != i) {
    dest.length = i;
  }
  return dest;
}
function rotate(flatCoordinates, offset, end, stride, angle, anchor, dest) {
  dest = dest ? dest : [];
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const anchorX = anchor[0];
  const anchorY = anchor[1];
  let i = 0;
  for (let j = offset; j < end; j += stride) {
    const deltaX = flatCoordinates[j] - anchorX;
    const deltaY = flatCoordinates[j + 1] - anchorY;
    dest[i++] = anchorX + deltaX * cos - deltaY * sin;
    dest[i++] = anchorY + deltaX * sin + deltaY * cos;
    for (let k = j + 2; k < j + stride; ++k) {
      dest[i++] = flatCoordinates[k];
    }
  }
  if (dest && dest.length != i) {
    dest.length = i;
  }
  return dest;
}
function scale(flatCoordinates, offset, end, stride, sx, sy, anchor, dest) {
  dest = dest ? dest : [];
  const anchorX = anchor[0];
  const anchorY = anchor[1];
  let i = 0;
  for (let j = offset; j < end; j += stride) {
    const deltaX = flatCoordinates[j] - anchorX;
    const deltaY = flatCoordinates[j + 1] - anchorY;
    dest[i++] = anchorX + sx * deltaX;
    dest[i++] = anchorY + sy * deltaY;
    for (let k = j + 2; k < j + stride; ++k) {
      dest[i++] = flatCoordinates[k];
    }
  }
  if (dest && dest.length != i) {
    dest.length = i;
  }
  return dest;
}
function translate(flatCoordinates, offset, end, stride, deltaX, deltaY, dest) {
  dest = dest ? dest : [];
  let i = 0;
  for (let j = offset; j < end; j += stride) {
    dest[i++] = flatCoordinates[j] + deltaX;
    dest[i++] = flatCoordinates[j + 1] + deltaY;
    for (let k = j + 2; k < j + stride; ++k) {
      dest[i++] = flatCoordinates[k];
    }
  }
  if (dest && dest.length != i) {
    dest.length = i;
  }
  return dest;
}
function drawTextOnPath(flatCoordinates, offset, end, stride, text, startM, maxAngle, scale2, measureAndCacheTextWidth2, font, cache2, rotation) {
  let x2 = flatCoordinates[offset];
  let y2 = flatCoordinates[offset + 1];
  let x1 = 0;
  let y1 = 0;
  let segmentLength = 0;
  let segmentM = 0;
  function advance() {
    x1 = x2;
    y1 = y2;
    offset += stride;
    x2 = flatCoordinates[offset];
    y2 = flatCoordinates[offset + 1];
    segmentM += segmentLength;
    segmentLength = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
  }
  do {
    advance();
  } while (offset < end - stride && segmentM + segmentLength < startM);
  let interpolate = segmentLength === 0 ? 0 : (startM - segmentM) / segmentLength;
  const beginX = lerp(x1, x2, interpolate);
  const beginY = lerp(y1, y2, interpolate);
  const startOffset = offset - stride;
  const startLength = segmentM;
  const endM = startM + scale2 * measureAndCacheTextWidth2(font, text, cache2);
  while (offset < end - stride && segmentM + segmentLength < endM) {
    advance();
  }
  interpolate = segmentLength === 0 ? 0 : (endM - segmentM) / segmentLength;
  const endX = lerp(x1, x2, interpolate);
  const endY = lerp(y1, y2, interpolate);
  let reverse;
  if (rotation) {
    const flat = [beginX, beginY, endX, endY];
    rotate(flat, 0, 4, 2, rotation, flat, flat);
    reverse = flat[0] > flat[2];
  } else {
    reverse = beginX > endX;
  }
  const PI = Math.PI;
  const result = [];
  const singleSegment = startOffset + stride === offset;
  offset = startOffset;
  segmentLength = 0;
  segmentM = startLength;
  x2 = flatCoordinates[offset];
  y2 = flatCoordinates[offset + 1];
  let previousAngle;
  if (singleSegment) {
    advance();
    previousAngle = Math.atan2(y2 - y1, x2 - x1);
    if (reverse) {
      previousAngle += previousAngle > 0 ? -PI : PI;
    }
    const x = (endX + beginX) / 2;
    const y = (endY + beginY) / 2;
    result[0] = [x, y, (endM - startM) / 2, previousAngle, text];
    return result;
  }
  text = text.replace(/\n/g, " ");
  for (let i = 0, ii = text.length; i < ii; ) {
    advance();
    let angle = Math.atan2(y2 - y1, x2 - x1);
    if (reverse) {
      angle += angle > 0 ? -PI : PI;
    }
    if (previousAngle !== void 0) {
      let delta = angle - previousAngle;
      delta += delta > PI ? -2 * PI : delta < -PI ? 2 * PI : 0;
      if (Math.abs(delta) > maxAngle) {
        return null;
      }
    }
    previousAngle = angle;
    const iStart = i;
    let charLength = 0;
    for (; i < ii; ++i) {
      const index2 = reverse ? ii - i - 1 : i;
      const len = scale2 * measureAndCacheTextWidth2(font, text[index2], cache2);
      if (offset + stride < end && segmentM + segmentLength < startM + charLength + len / 2) {
        break;
      }
      charLength += len;
    }
    if (i === iStart) {
      continue;
    }
    const chars = reverse ? text.substring(ii - iStart, ii - i) : text.substring(iStart, i);
    interpolate = segmentLength === 0 ? 0 : (startM + charLength / 2 - segmentM) / segmentLength;
    const x = lerp(x1, x2, interpolate);
    const y = lerp(y1, y2, interpolate);
    result.push([x, y, charLength / 2, angle, chars]);
    startM += charLength;
  }
  return result;
}
function lineStringLength(flatCoordinates, offset, end, stride) {
  let x1 = flatCoordinates[offset];
  let y1 = flatCoordinates[offset + 1];
  let length = 0;
  for (let i = offset + stride; i < end; i += stride) {
    const x2 = flatCoordinates[i];
    const y2 = flatCoordinates[i + 1];
    length += Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    x1 = x2;
    y1 = y2;
  }
  return length;
}
const tmpExtent = createEmpty();
const p1 = [];
const p2 = [];
const p3 = [];
const p4 = [];
function getDeclutterBox(replayImageOrLabelArgs) {
  return replayImageOrLabelArgs[3].declutterBox;
}
const rtlRegEx = new RegExp(
  "[" + String.fromCharCode(1425) + "-" + String.fromCharCode(2303) + String.fromCharCode(64285) + "-" + String.fromCharCode(65023) + String.fromCharCode(65136) + "-" + String.fromCharCode(65276) + String.fromCharCode(67584) + "-" + String.fromCharCode(69631) + String.fromCharCode(124928) + "-" + String.fromCharCode(126975) + "]"
);
function horizontalTextAlign(text, align) {
  if ((align === "start" || align === "end") && !rtlRegEx.test(text)) {
    align = align === "start" ? "left" : "right";
  }
  return TEXT_ALIGN[align];
}
function createTextChunks(acc, line, i) {
  if (i > 0) {
    acc.push("\n", "");
  }
  acc.push(line, "");
  return acc;
}
class Executor {
  constructor(resolution, pixelRatio, overlaps, instructions) {
    this.overlaps = overlaps;
    this.pixelRatio = pixelRatio;
    this.resolution = resolution;
    this.alignFill_;
    this.instructions = instructions.instructions;
    this.coordinates = instructions.coordinates;
    this.coordinateCache_ = {};
    this.renderedTransform_ = create$2();
    this.hitDetectionInstructions = instructions.hitDetectionInstructions;
    this.pixelCoordinates_ = null;
    this.viewRotation_ = 0;
    this.fillStates = instructions.fillStates || {};
    this.strokeStates = instructions.strokeStates || {};
    this.textStates = instructions.textStates || {};
    this.widths_ = {};
    this.labels_ = {};
  }
  createLabel(text, textKey, fillKey, strokeKey) {
    const key = text + textKey + fillKey + strokeKey;
    if (this.labels_[key]) {
      return this.labels_[key];
    }
    const strokeState = strokeKey ? this.strokeStates[strokeKey] : null;
    const fillState = fillKey ? this.fillStates[fillKey] : null;
    const textState = this.textStates[textKey];
    const pixelRatio = this.pixelRatio;
    const scale2 = [
      textState.scale[0] * pixelRatio,
      textState.scale[1] * pixelRatio
    ];
    const textIsArray = Array.isArray(text);
    const align = textState.justify ? TEXT_ALIGN[textState.justify] : horizontalTextAlign(
      Array.isArray(text) ? text[0] : text,
      textState.textAlign || defaultTextAlign
    );
    const strokeWidth = strokeKey && strokeState.lineWidth ? strokeState.lineWidth : 0;
    const chunks = textIsArray ? text : text.split("\n").reduce(createTextChunks, []);
    const { width, height, widths, heights, lineWidths } = getTextDimensions(
      textState,
      chunks
    );
    const renderWidth = width + strokeWidth;
    const contextInstructions = [];
    const w = (renderWidth + 2) * scale2[0];
    const h = (height + strokeWidth) * scale2[1];
    const label = {
      width: w < 0 ? Math.floor(w) : Math.ceil(w),
      height: h < 0 ? Math.floor(h) : Math.ceil(h),
      contextInstructions
    };
    if (scale2[0] != 1 || scale2[1] != 1) {
      contextInstructions.push("scale", scale2);
    }
    if (strokeKey) {
      contextInstructions.push("strokeStyle", strokeState.strokeStyle);
      contextInstructions.push("lineWidth", strokeWidth);
      contextInstructions.push("lineCap", strokeState.lineCap);
      contextInstructions.push("lineJoin", strokeState.lineJoin);
      contextInstructions.push("miterLimit", strokeState.miterLimit);
      contextInstructions.push("setLineDash", [strokeState.lineDash]);
      contextInstructions.push("lineDashOffset", strokeState.lineDashOffset);
    }
    if (fillKey) {
      contextInstructions.push("fillStyle", fillState.fillStyle);
    }
    contextInstructions.push("textBaseline", "middle");
    contextInstructions.push("textAlign", "center");
    const leftRight = 0.5 - align;
    let x = align * renderWidth + leftRight * strokeWidth;
    const strokeInstructions = [];
    const fillInstructions = [];
    let lineHeight = 0;
    let lineOffset = 0;
    let widthHeightIndex = 0;
    let lineWidthIndex = 0;
    let previousFont;
    for (let i = 0, ii = chunks.length; i < ii; i += 2) {
      const text2 = chunks[i];
      if (text2 === "\n") {
        lineOffset += lineHeight;
        lineHeight = 0;
        x = align * renderWidth + leftRight * strokeWidth;
        ++lineWidthIndex;
        continue;
      }
      const font = chunks[i + 1] || textState.font;
      if (font !== previousFont) {
        if (strokeKey) {
          strokeInstructions.push("font", font);
        }
        if (fillKey) {
          fillInstructions.push("font", font);
        }
        previousFont = font;
      }
      lineHeight = Math.max(lineHeight, heights[widthHeightIndex]);
      const fillStrokeArgs = [
        text2,
        x + leftRight * widths[widthHeightIndex] + align * (widths[widthHeightIndex] - lineWidths[lineWidthIndex]),
        0.5 * (strokeWidth + lineHeight) + lineOffset
      ];
      x += widths[widthHeightIndex];
      if (strokeKey) {
        strokeInstructions.push("strokeText", fillStrokeArgs);
      }
      if (fillKey) {
        fillInstructions.push("fillText", fillStrokeArgs);
      }
      ++widthHeightIndex;
    }
    Array.prototype.push.apply(contextInstructions, strokeInstructions);
    Array.prototype.push.apply(contextInstructions, fillInstructions);
    this.labels_[key] = label;
    return label;
  }
  replayTextBackground_(context, p12, p22, p32, p42, fillInstruction2, strokeInstruction2) {
    context.beginPath();
    context.moveTo.apply(context, p12);
    context.lineTo.apply(context, p22);
    context.lineTo.apply(context, p32);
    context.lineTo.apply(context, p42);
    context.lineTo.apply(context, p12);
    if (fillInstruction2) {
      this.alignFill_ = fillInstruction2[2];
      this.fill_(context);
    }
    if (strokeInstruction2) {
      this.setStrokeStyle_(
        context,
        strokeInstruction2
      );
      context.stroke();
    }
  }
  calculateImageOrLabelDimensions_(sheetWidth, sheetHeight, centerX, centerY, width, height, anchorX, anchorY, originX, originY, rotation, scale2, snapToPixel, padding, fillStroke, feature2) {
    anchorX *= scale2[0];
    anchorY *= scale2[1];
    let x = centerX - anchorX;
    let y = centerY - anchorY;
    const w = width + originX > sheetWidth ? sheetWidth - originX : width;
    const h = height + originY > sheetHeight ? sheetHeight - originY : height;
    const boxW = padding[3] + w * scale2[0] + padding[1];
    const boxH = padding[0] + h * scale2[1] + padding[2];
    const boxX = x - padding[3];
    const boxY = y - padding[0];
    if (fillStroke || rotation !== 0) {
      p1[0] = boxX;
      p4[0] = boxX;
      p1[1] = boxY;
      p2[1] = boxY;
      p2[0] = boxX + boxW;
      p3[0] = p2[0];
      p3[1] = boxY + boxH;
      p4[1] = p3[1];
    }
    let transform2;
    if (rotation !== 0) {
      transform2 = compose(
        create$2(),
        centerX,
        centerY,
        1,
        1,
        rotation,
        -centerX,
        -centerY
      );
      apply(transform2, p1);
      apply(transform2, p2);
      apply(transform2, p3);
      apply(transform2, p4);
      createOrUpdate$2(
        Math.min(p1[0], p2[0], p3[0], p4[0]),
        Math.min(p1[1], p2[1], p3[1], p4[1]),
        Math.max(p1[0], p2[0], p3[0], p4[0]),
        Math.max(p1[1], p2[1], p3[1], p4[1]),
        tmpExtent
      );
    } else {
      createOrUpdate$2(
        Math.min(boxX, boxX + boxW),
        Math.min(boxY, boxY + boxH),
        Math.max(boxX, boxX + boxW),
        Math.max(boxY, boxY + boxH),
        tmpExtent
      );
    }
    if (snapToPixel) {
      x = Math.round(x);
      y = Math.round(y);
    }
    return {
      drawImageX: x,
      drawImageY: y,
      drawImageW: w,
      drawImageH: h,
      originX,
      originY,
      declutterBox: {
        minX: tmpExtent[0],
        minY: tmpExtent[1],
        maxX: tmpExtent[2],
        maxY: tmpExtent[3],
        value: feature2
      },
      canvasTransform: transform2,
      scale: scale2
    };
  }
  replayImageOrLabel_(context, contextScale, imageOrLabel, dimensions, opacity, fillInstruction2, strokeInstruction2) {
    const fillStroke = !!(fillInstruction2 || strokeInstruction2);
    const box = dimensions.declutterBox;
    const canvas = context.canvas;
    const strokePadding = strokeInstruction2 ? strokeInstruction2[2] * dimensions.scale[0] / 2 : 0;
    const intersects2 = box.minX - strokePadding <= canvas.width / contextScale && box.maxX + strokePadding >= 0 && box.minY - strokePadding <= canvas.height / contextScale && box.maxY + strokePadding >= 0;
    if (intersects2) {
      if (fillStroke) {
        this.replayTextBackground_(
          context,
          p1,
          p2,
          p3,
          p4,
          fillInstruction2,
          strokeInstruction2
        );
      }
      drawImageOrLabel(
        context,
        dimensions.canvasTransform,
        opacity,
        imageOrLabel,
        dimensions.originX,
        dimensions.originY,
        dimensions.drawImageW,
        dimensions.drawImageH,
        dimensions.drawImageX,
        dimensions.drawImageY,
        dimensions.scale
      );
    }
    return true;
  }
  fill_(context) {
    if (this.alignFill_) {
      const origin = apply(this.renderedTransform_, [0, 0]);
      const repeatSize = 512 * this.pixelRatio;
      context.save();
      context.translate(origin[0] % repeatSize, origin[1] % repeatSize);
      context.rotate(this.viewRotation_);
    }
    context.fill();
    if (this.alignFill_) {
      context.restore();
    }
  }
  setStrokeStyle_(context, instruction) {
    context["strokeStyle"] = instruction[1];
    context.lineWidth = instruction[2];
    context.lineCap = instruction[3];
    context.lineJoin = instruction[4];
    context.miterLimit = instruction[5];
    context.lineDashOffset = instruction[7];
    context.setLineDash(instruction[6]);
  }
  drawLabelWithPointPlacement_(text, textKey, strokeKey, fillKey) {
    const textState = this.textStates[textKey];
    const label = this.createLabel(text, textKey, fillKey, strokeKey);
    const strokeState = this.strokeStates[strokeKey];
    const pixelRatio = this.pixelRatio;
    const align = horizontalTextAlign(
      Array.isArray(text) ? text[0] : text,
      textState.textAlign || defaultTextAlign
    );
    const baseline = TEXT_ALIGN[textState.textBaseline || defaultTextBaseline];
    const strokeWidth = strokeState && strokeState.lineWidth ? strokeState.lineWidth : 0;
    const width = label.width / pixelRatio - 2 * textState.scale[0];
    const anchorX = align * width + 2 * (0.5 - align) * strokeWidth;
    const anchorY = baseline * label.height / pixelRatio + 2 * (0.5 - baseline) * strokeWidth;
    return {
      label,
      anchorX,
      anchorY
    };
  }
  execute_(context, contextScale, transform2, instructions, snapToPixel, featureCallback, hitExtent, declutterTree) {
    let pixelCoordinates;
    if (this.pixelCoordinates_ && equals$1(transform2, this.renderedTransform_)) {
      pixelCoordinates = this.pixelCoordinates_;
    } else {
      if (!this.pixelCoordinates_) {
        this.pixelCoordinates_ = [];
      }
      pixelCoordinates = transform2D(
        this.coordinates,
        0,
        this.coordinates.length,
        2,
        transform2,
        this.pixelCoordinates_
      );
      setFromArray(this.renderedTransform_, transform2);
    }
    let i = 0;
    const ii = instructions.length;
    let d = 0;
    let dd;
    let anchorX, anchorY, prevX, prevY, roundX, roundY, image, text, textKey, strokeKey, fillKey;
    let pendingFill = 0;
    let pendingStroke = 0;
    let lastFillInstruction = null;
    let lastStrokeInstruction = null;
    const coordinateCache = this.coordinateCache_;
    const viewRotation = this.viewRotation_;
    const viewRotationFromTransform = Math.round(Math.atan2(-transform2[1], transform2[0]) * 1e12) / 1e12;
    const state = {
      context,
      pixelRatio: this.pixelRatio,
      resolution: this.resolution,
      rotation: viewRotation
    };
    const batchSize = this.instructions != instructions || this.overlaps ? 0 : 200;
    let feature2;
    let x, y, currentGeometry;
    while (i < ii) {
      const instruction = instructions[i];
      const type = instruction[0];
      switch (type) {
        case CanvasInstruction.BEGIN_GEOMETRY:
          feature2 = instruction[1];
          currentGeometry = instruction[3];
          if (!feature2.getGeometry()) {
            i = instruction[2];
          } else if (hitExtent !== void 0 && !intersects$2(hitExtent, currentGeometry.getExtent())) {
            i = instruction[2] + 1;
          } else {
            ++i;
          }
          break;
        case CanvasInstruction.BEGIN_PATH:
          if (pendingFill > batchSize) {
            this.fill_(context);
            pendingFill = 0;
          }
          if (pendingStroke > batchSize) {
            context.stroke();
            pendingStroke = 0;
          }
          if (!pendingFill && !pendingStroke) {
            context.beginPath();
            prevX = NaN;
            prevY = NaN;
          }
          ++i;
          break;
        case CanvasInstruction.CIRCLE:
          d = instruction[1];
          const x1 = pixelCoordinates[d];
          const y1 = pixelCoordinates[d + 1];
          const x2 = pixelCoordinates[d + 2];
          const y2 = pixelCoordinates[d + 3];
          const dx = x2 - x1;
          const dy = y2 - y1;
          const r = Math.sqrt(dx * dx + dy * dy);
          context.moveTo(x1 + r, y1);
          context.arc(x1, y1, r, 0, 2 * Math.PI, true);
          ++i;
          break;
        case CanvasInstruction.CLOSE_PATH:
          context.closePath();
          ++i;
          break;
        case CanvasInstruction.CUSTOM:
          d = instruction[1];
          dd = instruction[2];
          const geometry = instruction[3];
          const renderer = instruction[4];
          const fn = instruction.length == 6 ? instruction[5] : void 0;
          state.geometry = geometry;
          state.feature = feature2;
          if (!(i in coordinateCache)) {
            coordinateCache[i] = [];
          }
          const coords = coordinateCache[i];
          if (fn) {
            fn(pixelCoordinates, d, dd, 2, coords);
          } else {
            coords[0] = pixelCoordinates[d];
            coords[1] = pixelCoordinates[d + 1];
            coords.length = 2;
          }
          renderer(coords, state);
          ++i;
          break;
        case CanvasInstruction.DRAW_IMAGE:
          d = instruction[1];
          dd = instruction[2];
          image = instruction[3];
          anchorX = instruction[4];
          anchorY = instruction[5];
          let height = instruction[6];
          const opacity = instruction[7];
          const originX = instruction[8];
          const originY = instruction[9];
          const rotateWithView = instruction[10];
          let rotation = instruction[11];
          const scale2 = instruction[12];
          let width = instruction[13];
          const declutterMode = instruction[14];
          const declutterImageWithText = instruction[15];
          if (!image && instruction.length >= 20) {
            text = instruction[19];
            textKey = instruction[20];
            strokeKey = instruction[21];
            fillKey = instruction[22];
            const labelWithAnchor = this.drawLabelWithPointPlacement_(
              text,
              textKey,
              strokeKey,
              fillKey
            );
            image = labelWithAnchor.label;
            instruction[3] = image;
            const textOffsetX = instruction[23];
            anchorX = (labelWithAnchor.anchorX - textOffsetX) * this.pixelRatio;
            instruction[4] = anchorX;
            const textOffsetY = instruction[24];
            anchorY = (labelWithAnchor.anchorY - textOffsetY) * this.pixelRatio;
            instruction[5] = anchorY;
            height = image.height;
            instruction[6] = height;
            width = image.width;
            instruction[13] = width;
          }
          let geometryWidths;
          if (instruction.length > 25) {
            geometryWidths = instruction[25];
          }
          let padding, backgroundFill, backgroundStroke;
          if (instruction.length > 17) {
            padding = instruction[16];
            backgroundFill = instruction[17];
            backgroundStroke = instruction[18];
          } else {
            padding = defaultPadding;
            backgroundFill = false;
            backgroundStroke = false;
          }
          if (rotateWithView && viewRotationFromTransform) {
            rotation += viewRotation;
          } else if (!rotateWithView && !viewRotationFromTransform) {
            rotation -= viewRotation;
          }
          let widthIndex = 0;
          for (; d < dd; d += 2) {
            if (geometryWidths && geometryWidths[widthIndex++] < width / this.pixelRatio) {
              continue;
            }
            const dimensions = this.calculateImageOrLabelDimensions_(
              image.width,
              image.height,
              pixelCoordinates[d],
              pixelCoordinates[d + 1],
              width,
              height,
              anchorX,
              anchorY,
              originX,
              originY,
              rotation,
              scale2,
              snapToPixel,
              padding,
              backgroundFill || backgroundStroke,
              feature2
            );
            const args = [
              context,
              contextScale,
              image,
              dimensions,
              opacity,
              backgroundFill ? lastFillInstruction : null,
              backgroundStroke ? lastStrokeInstruction : null
            ];
            if (declutterTree) {
              if (declutterMode === "none") {
                continue;
              } else if (declutterMode === "obstacle") {
                declutterTree.insert(dimensions.declutterBox);
                continue;
              } else {
                let imageArgs;
                let imageDeclutterBox;
                if (declutterImageWithText) {
                  const index2 = dd - d;
                  if (!declutterImageWithText[index2]) {
                    declutterImageWithText[index2] = args;
                    continue;
                  }
                  imageArgs = declutterImageWithText[index2];
                  delete declutterImageWithText[index2];
                  imageDeclutterBox = getDeclutterBox(imageArgs);
                  if (declutterTree.collides(imageDeclutterBox)) {
                    continue;
                  }
                }
                if (declutterTree.collides(dimensions.declutterBox)) {
                  continue;
                }
                if (imageArgs) {
                  declutterTree.insert(imageDeclutterBox);
                  this.replayImageOrLabel_.apply(this, imageArgs);
                }
                declutterTree.insert(dimensions.declutterBox);
              }
            }
            this.replayImageOrLabel_.apply(this, args);
          }
          ++i;
          break;
        case CanvasInstruction.DRAW_CHARS:
          const begin = instruction[1];
          const end = instruction[2];
          const baseline = instruction[3];
          const overflow = instruction[4];
          fillKey = instruction[5];
          const maxAngle = instruction[6];
          const measurePixelRatio = instruction[7];
          const offsetY = instruction[8];
          strokeKey = instruction[9];
          const strokeWidth = instruction[10];
          text = instruction[11];
          textKey = instruction[12];
          const pixelRatioScale = [
            instruction[13],
            instruction[13]
          ];
          const textState = this.textStates[textKey];
          const font = textState.font;
          const textScale = [
            textState.scale[0] * measurePixelRatio,
            textState.scale[1] * measurePixelRatio
          ];
          let cachedWidths;
          if (font in this.widths_) {
            cachedWidths = this.widths_[font];
          } else {
            cachedWidths = {};
            this.widths_[font] = cachedWidths;
          }
          const pathLength = lineStringLength(pixelCoordinates, begin, end, 2);
          const textLength = Math.abs(textScale[0]) * measureAndCacheTextWidth(font, text, cachedWidths);
          if (overflow || textLength <= pathLength) {
            const textAlign = this.textStates[textKey].textAlign;
            const startM = (pathLength - textLength) * TEXT_ALIGN[textAlign];
            const parts = drawTextOnPath(
              pixelCoordinates,
              begin,
              end,
              2,
              text,
              startM,
              maxAngle,
              Math.abs(textScale[0]),
              measureAndCacheTextWidth,
              font,
              cachedWidths,
              viewRotationFromTransform ? 0 : this.viewRotation_
            );
            drawChars:
              if (parts) {
                const replayImageOrLabelArgs = [];
                let c, cc, chars, label, part;
                if (strokeKey) {
                  for (c = 0, cc = parts.length; c < cc; ++c) {
                    part = parts[c];
                    chars = part[4];
                    label = this.createLabel(chars, textKey, "", strokeKey);
                    anchorX = part[2] + (textScale[0] < 0 ? -strokeWidth : strokeWidth);
                    anchorY = baseline * label.height + (0.5 - baseline) * 2 * strokeWidth * textScale[1] / textScale[0] - offsetY;
                    const dimensions = this.calculateImageOrLabelDimensions_(
                      label.width,
                      label.height,
                      part[0],
                      part[1],
                      label.width,
                      label.height,
                      anchorX,
                      anchorY,
                      0,
                      0,
                      part[3],
                      pixelRatioScale,
                      false,
                      defaultPadding,
                      false,
                      feature2
                    );
                    if (declutterTree && declutterTree.collides(dimensions.declutterBox)) {
                      break drawChars;
                    }
                    replayImageOrLabelArgs.push([
                      context,
                      contextScale,
                      label,
                      dimensions,
                      1,
                      null,
                      null
                    ]);
                  }
                }
                if (fillKey) {
                  for (c = 0, cc = parts.length; c < cc; ++c) {
                    part = parts[c];
                    chars = part[4];
                    label = this.createLabel(chars, textKey, fillKey, "");
                    anchorX = part[2];
                    anchorY = baseline * label.height - offsetY;
                    const dimensions = this.calculateImageOrLabelDimensions_(
                      label.width,
                      label.height,
                      part[0],
                      part[1],
                      label.width,
                      label.height,
                      anchorX,
                      anchorY,
                      0,
                      0,
                      part[3],
                      pixelRatioScale,
                      false,
                      defaultPadding,
                      false,
                      feature2
                    );
                    if (declutterTree && declutterTree.collides(dimensions.declutterBox)) {
                      break drawChars;
                    }
                    replayImageOrLabelArgs.push([
                      context,
                      contextScale,
                      label,
                      dimensions,
                      1,
                      null,
                      null
                    ]);
                  }
                }
                if (declutterTree) {
                  declutterTree.load(replayImageOrLabelArgs.map(getDeclutterBox));
                }
                for (let i2 = 0, ii2 = replayImageOrLabelArgs.length; i2 < ii2; ++i2) {
                  this.replayImageOrLabel_.apply(this, replayImageOrLabelArgs[i2]);
                }
              }
          }
          ++i;
          break;
        case CanvasInstruction.END_GEOMETRY:
          if (featureCallback !== void 0) {
            feature2 = instruction[1];
            const result = featureCallback(feature2, currentGeometry);
            if (result) {
              return result;
            }
          }
          ++i;
          break;
        case CanvasInstruction.FILL:
          if (batchSize) {
            pendingFill++;
          } else {
            this.fill_(context);
          }
          ++i;
          break;
        case CanvasInstruction.MOVE_TO_LINE_TO:
          d = instruction[1];
          dd = instruction[2];
          x = pixelCoordinates[d];
          y = pixelCoordinates[d + 1];
          roundX = x + 0.5 | 0;
          roundY = y + 0.5 | 0;
          if (roundX !== prevX || roundY !== prevY) {
            context.moveTo(x, y);
            prevX = roundX;
            prevY = roundY;
          }
          for (d += 2; d < dd; d += 2) {
            x = pixelCoordinates[d];
            y = pixelCoordinates[d + 1];
            roundX = x + 0.5 | 0;
            roundY = y + 0.5 | 0;
            if (d == dd - 2 || roundX !== prevX || roundY !== prevY) {
              context.lineTo(x, y);
              prevX = roundX;
              prevY = roundY;
            }
          }
          ++i;
          break;
        case CanvasInstruction.SET_FILL_STYLE:
          lastFillInstruction = instruction;
          this.alignFill_ = instruction[2];
          if (pendingFill) {
            this.fill_(context);
            pendingFill = 0;
            if (pendingStroke) {
              context.stroke();
              pendingStroke = 0;
            }
          }
          context.fillStyle = instruction[1];
          ++i;
          break;
        case CanvasInstruction.SET_STROKE_STYLE:
          lastStrokeInstruction = instruction;
          if (pendingStroke) {
            context.stroke();
            pendingStroke = 0;
          }
          this.setStrokeStyle_(context, instruction);
          ++i;
          break;
        case CanvasInstruction.STROKE:
          if (batchSize) {
            pendingStroke++;
          } else {
            context.stroke();
          }
          ++i;
          break;
        default:
          ++i;
          break;
      }
    }
    if (pendingFill) {
      this.fill_(context);
    }
    if (pendingStroke) {
      context.stroke();
    }
    return void 0;
  }
  execute(context, contextScale, transform2, viewRotation, snapToPixel, declutterTree) {
    this.viewRotation_ = viewRotation;
    this.execute_(
      context,
      contextScale,
      transform2,
      this.instructions,
      snapToPixel,
      void 0,
      void 0,
      declutterTree
    );
  }
  executeHitDetection(context, transform2, viewRotation, featureCallback, hitExtent) {
    this.viewRotation_ = viewRotation;
    return this.execute_(
      context,
      1,
      transform2,
      this.hitDetectionInstructions,
      true,
      featureCallback,
      hitExtent
    );
  }
}
const Executor$1 = Executor;
const ORDER = ["Polygon", "Circle", "LineString", "Image", "Text", "Default"];
class ExecutorGroup {
  constructor(maxExtent, resolution, pixelRatio, overlaps, allInstructions, renderBuffer) {
    this.maxExtent_ = maxExtent;
    this.overlaps_ = overlaps;
    this.pixelRatio_ = pixelRatio;
    this.resolution_ = resolution;
    this.renderBuffer_ = renderBuffer;
    this.executorsByZIndex_ = {};
    this.hitDetectionContext_ = null;
    this.hitDetectionTransform_ = create$2();
    this.createExecutors_(allInstructions);
  }
  clip(context, transform2) {
    const flatClipCoords = this.getClipCoords(transform2);
    context.beginPath();
    context.moveTo(flatClipCoords[0], flatClipCoords[1]);
    context.lineTo(flatClipCoords[2], flatClipCoords[3]);
    context.lineTo(flatClipCoords[4], flatClipCoords[5]);
    context.lineTo(flatClipCoords[6], flatClipCoords[7]);
    context.clip();
  }
  createExecutors_(allInstructions) {
    for (const zIndex in allInstructions) {
      let executors = this.executorsByZIndex_[zIndex];
      if (executors === void 0) {
        executors = {};
        this.executorsByZIndex_[zIndex] = executors;
      }
      const instructionByZindex = allInstructions[zIndex];
      for (const builderType in instructionByZindex) {
        const instructions = instructionByZindex[builderType];
        executors[builderType] = new Executor$1(
          this.resolution_,
          this.pixelRatio_,
          this.overlaps_,
          instructions
        );
      }
    }
  }
  hasExecutors(executors) {
    for (const zIndex in this.executorsByZIndex_) {
      const candidates = this.executorsByZIndex_[zIndex];
      for (let i = 0, ii = executors.length; i < ii; ++i) {
        if (executors[i] in candidates) {
          return true;
        }
      }
    }
    return false;
  }
  forEachFeatureAtCoordinate(coordinate, resolution, rotation, hitTolerance, callback, declutteredFeatures) {
    hitTolerance = Math.round(hitTolerance);
    const contextSize = hitTolerance * 2 + 1;
    const transform2 = compose(
      this.hitDetectionTransform_,
      hitTolerance + 0.5,
      hitTolerance + 0.5,
      1 / resolution,
      -1 / resolution,
      -rotation,
      -coordinate[0],
      -coordinate[1]
    );
    const newContext = !this.hitDetectionContext_;
    if (newContext) {
      this.hitDetectionContext_ = createCanvasContext2D(
        contextSize,
        contextSize
      );
    }
    const context = this.hitDetectionContext_;
    if (context.canvas.width !== contextSize || context.canvas.height !== contextSize) {
      context.canvas.width = contextSize;
      context.canvas.height = contextSize;
    } else if (!newContext) {
      context.clearRect(0, 0, contextSize, contextSize);
    }
    let hitExtent;
    if (this.renderBuffer_ !== void 0) {
      hitExtent = createEmpty();
      extendCoordinate(hitExtent, coordinate);
      buffer(
        hitExtent,
        resolution * (this.renderBuffer_ + hitTolerance),
        hitExtent
      );
    }
    const indexes = getPixelIndexArray(hitTolerance);
    let builderType;
    function featureCallback(feature2, geometry) {
      const imageData = context.getImageData(
        0,
        0,
        contextSize,
        contextSize
      ).data;
      for (let i2 = 0, ii = indexes.length; i2 < ii; i2++) {
        if (imageData[indexes[i2]] > 0) {
          if (!declutteredFeatures || builderType !== "Image" && builderType !== "Text" || declutteredFeatures.includes(feature2)) {
            const idx = (indexes[i2] - 3) / 4;
            const x = hitTolerance - idx % contextSize;
            const y = hitTolerance - (idx / contextSize | 0);
            const result2 = callback(feature2, geometry, x * x + y * y);
            if (result2) {
              return result2;
            }
          }
          context.clearRect(0, 0, contextSize, contextSize);
          break;
        }
      }
      return void 0;
    }
    const zs = Object.keys(this.executorsByZIndex_).map(Number);
    zs.sort(numberSafeCompareFunction);
    let i, j, executors, executor, result;
    for (i = zs.length - 1; i >= 0; --i) {
      const zIndexKey = zs[i].toString();
      executors = this.executorsByZIndex_[zIndexKey];
      for (j = ORDER.length - 1; j >= 0; --j) {
        builderType = ORDER[j];
        executor = executors[builderType];
        if (executor !== void 0) {
          result = executor.executeHitDetection(
            context,
            transform2,
            rotation,
            featureCallback,
            hitExtent
          );
          if (result) {
            return result;
          }
        }
      }
    }
    return void 0;
  }
  getClipCoords(transform2) {
    const maxExtent = this.maxExtent_;
    if (!maxExtent) {
      return null;
    }
    const minX = maxExtent[0];
    const minY = maxExtent[1];
    const maxX = maxExtent[2];
    const maxY = maxExtent[3];
    const flatClipCoords = [minX, minY, minX, maxY, maxX, maxY, maxX, minY];
    transform2D(flatClipCoords, 0, 8, 2, transform2, flatClipCoords);
    return flatClipCoords;
  }
  isEmpty() {
    return isEmpty$1(this.executorsByZIndex_);
  }
  execute(context, contextScale, transform2, viewRotation, snapToPixel, builderTypes, declutterTree) {
    const zs = Object.keys(this.executorsByZIndex_).map(Number);
    zs.sort(numberSafeCompareFunction);
    if (this.maxExtent_) {
      context.save();
      this.clip(context, transform2);
    }
    builderTypes = builderTypes ? builderTypes : ORDER;
    let i, ii, j, jj, replays, replay;
    if (declutterTree) {
      zs.reverse();
    }
    for (i = 0, ii = zs.length; i < ii; ++i) {
      const zIndexKey = zs[i].toString();
      replays = this.executorsByZIndex_[zIndexKey];
      for (j = 0, jj = builderTypes.length; j < jj; ++j) {
        const builderType = builderTypes[j];
        replay = replays[builderType];
        if (replay !== void 0) {
          replay.execute(
            context,
            contextScale,
            transform2,
            viewRotation,
            snapToPixel,
            declutterTree
          );
        }
      }
    }
    if (this.maxExtent_) {
      context.restore();
    }
  }
}
const circlePixelIndexArrayCache = {};
function getPixelIndexArray(radius) {
  if (circlePixelIndexArrayCache[radius] !== void 0) {
    return circlePixelIndexArrayCache[radius];
  }
  const size = radius * 2 + 1;
  const maxDistanceSq = radius * radius;
  const distances = new Array(maxDistanceSq + 1);
  for (let i = 0; i <= radius; ++i) {
    for (let j = 0; j <= radius; ++j) {
      const distanceSq = i * i + j * j;
      if (distanceSq > maxDistanceSq) {
        break;
      }
      let distance2 = distances[distanceSq];
      if (!distance2) {
        distance2 = [];
        distances[distanceSq] = distance2;
      }
      distance2.push(((radius + i) * size + (radius + j)) * 4 + 3);
      if (i > 0) {
        distance2.push(((radius - i) * size + (radius + j)) * 4 + 3);
      }
      if (j > 0) {
        distance2.push(((radius + i) * size + (radius - j)) * 4 + 3);
        if (i > 0) {
          distance2.push(((radius - i) * size + (radius - j)) * 4 + 3);
        }
      }
    }
  }
  const pixelIndex = [];
  for (let i = 0, ii = distances.length; i < ii; ++i) {
    if (distances[i]) {
      pixelIndex.push(...distances[i]);
    }
  }
  circlePixelIndexArrayCache[radius] = pixelIndex;
  return pixelIndex;
}
const CanvasExecutorGroup = ExecutorGroup;
const ViewHint = {
  ANIMATING: 0,
  INTERACTING: 1
};
const tmpTransform = create$2();
class Geometry extends BaseObject$1 {
  constructor() {
    super();
    this.extent_ = createEmpty();
    this.extentRevision_ = -1;
    this.simplifiedGeometryMaxMinSquaredTolerance = 0;
    this.simplifiedGeometryRevision = 0;
    this.simplifyTransformedInternal = memoizeOne(function(revision, squaredTolerance, transform2) {
      if (!transform2) {
        return this.getSimplifiedGeometry(squaredTolerance);
      }
      const clone2 = this.clone();
      clone2.applyTransform(transform2);
      return clone2.getSimplifiedGeometry(squaredTolerance);
    });
  }
  simplifyTransformed(squaredTolerance, transform2) {
    return this.simplifyTransformedInternal(
      this.getRevision(),
      squaredTolerance,
      transform2
    );
  }
  clone() {
    return abstract();
  }
  closestPointXY(x, y, closestPoint, minSquaredDistance) {
    return abstract();
  }
  containsXY(x, y) {
    const coord = this.getClosestPoint([x, y]);
    return coord[0] === x && coord[1] === y;
  }
  getClosestPoint(point, closestPoint) {
    closestPoint = closestPoint ? closestPoint : [NaN, NaN];
    this.closestPointXY(point[0], point[1], closestPoint, Infinity);
    return closestPoint;
  }
  intersectsCoordinate(coordinate) {
    return this.containsXY(coordinate[0], coordinate[1]);
  }
  computeExtent(extent) {
    return abstract();
  }
  getExtent(extent) {
    if (this.extentRevision_ != this.getRevision()) {
      const extent2 = this.computeExtent(this.extent_);
      if (isNaN(extent2[0]) || isNaN(extent2[1])) {
        createOrUpdateEmpty(extent2);
      }
      this.extentRevision_ = this.getRevision();
    }
    return returnOrUpdate(this.extent_, extent);
  }
  rotate(angle, anchor) {
    abstract();
  }
  scale(sx, sy, anchor) {
    abstract();
  }
  simplify(tolerance) {
    return this.getSimplifiedGeometry(tolerance * tolerance);
  }
  getSimplifiedGeometry(squaredTolerance) {
    return abstract();
  }
  getType() {
    return abstract();
  }
  applyTransform(transformFn) {
    abstract();
  }
  intersectsExtent(extent) {
    return abstract();
  }
  translate(deltaX, deltaY) {
    abstract();
  }
  transform(source, destination) {
    const sourceProj = get$1(source);
    const transformFn = sourceProj.getUnits() == "tile-pixels" ? function(inCoordinates, outCoordinates, stride) {
      const pixelExtent = sourceProj.getExtent();
      const projectedExtent = sourceProj.getWorldExtent();
      const scale2 = getHeight(projectedExtent) / getHeight(pixelExtent);
      compose(
        tmpTransform,
        projectedExtent[0],
        projectedExtent[3],
        scale2,
        -scale2,
        0,
        0,
        0
      );
      transform2D(
        inCoordinates,
        0,
        inCoordinates.length,
        stride,
        tmpTransform,
        outCoordinates
      );
      return getTransform(sourceProj, destination)(
        inCoordinates,
        outCoordinates,
        stride
      );
    } : getTransform(sourceProj, destination);
    this.applyTransform(transformFn);
    return this;
  }
}
const Geometry$1 = Geometry;
class SimpleGeometry extends Geometry$1 {
  constructor() {
    super();
    this.layout = "XY";
    this.stride = 2;
    this.flatCoordinates = null;
  }
  computeExtent(extent) {
    return createOrUpdateFromFlatCoordinates(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      extent
    );
  }
  getCoordinates() {
    return abstract();
  }
  getFirstCoordinate() {
    return this.flatCoordinates.slice(0, this.stride);
  }
  getFlatCoordinates() {
    return this.flatCoordinates;
  }
  getLastCoordinate() {
    return this.flatCoordinates.slice(
      this.flatCoordinates.length - this.stride
    );
  }
  getLayout() {
    return this.layout;
  }
  getSimplifiedGeometry(squaredTolerance) {
    if (this.simplifiedGeometryRevision !== this.getRevision()) {
      this.simplifiedGeometryMaxMinSquaredTolerance = 0;
      this.simplifiedGeometryRevision = this.getRevision();
    }
    if (squaredTolerance < 0 || this.simplifiedGeometryMaxMinSquaredTolerance !== 0 && squaredTolerance <= this.simplifiedGeometryMaxMinSquaredTolerance) {
      return this;
    }
    const simplifiedGeometry = this.getSimplifiedGeometryInternal(squaredTolerance);
    const simplifiedFlatCoordinates = simplifiedGeometry.getFlatCoordinates();
    if (simplifiedFlatCoordinates.length < this.flatCoordinates.length) {
      return simplifiedGeometry;
    } else {
      this.simplifiedGeometryMaxMinSquaredTolerance = squaredTolerance;
      return this;
    }
  }
  getSimplifiedGeometryInternal(squaredTolerance) {
    return this;
  }
  getStride() {
    return this.stride;
  }
  setFlatCoordinates(layout, flatCoordinates) {
    this.stride = getStrideForLayout(layout);
    this.layout = layout;
    this.flatCoordinates = flatCoordinates;
  }
  setCoordinates(coordinates2, layout) {
    abstract();
  }
  setLayout(layout, coordinates2, nesting) {
    let stride;
    if (layout) {
      stride = getStrideForLayout(layout);
    } else {
      for (let i = 0; i < nesting; ++i) {
        if (coordinates2.length === 0) {
          this.layout = "XY";
          this.stride = 2;
          return;
        } else {
          coordinates2 = coordinates2[0];
        }
      }
      stride = coordinates2.length;
      layout = getLayoutForStride(stride);
    }
    this.layout = layout;
    this.stride = stride;
  }
  applyTransform(transformFn) {
    if (this.flatCoordinates) {
      transformFn(this.flatCoordinates, this.flatCoordinates, this.stride);
      this.changed();
    }
  }
  rotate(angle, anchor) {
    const flatCoordinates = this.getFlatCoordinates();
    if (flatCoordinates) {
      const stride = this.getStride();
      rotate(
        flatCoordinates,
        0,
        flatCoordinates.length,
        stride,
        angle,
        anchor,
        flatCoordinates
      );
      this.changed();
    }
  }
  scale(sx, sy, anchor) {
    if (sy === void 0) {
      sy = sx;
    }
    if (!anchor) {
      anchor = getCenter(this.getExtent());
    }
    const flatCoordinates = this.getFlatCoordinates();
    if (flatCoordinates) {
      const stride = this.getStride();
      scale(
        flatCoordinates,
        0,
        flatCoordinates.length,
        stride,
        sx,
        sy,
        anchor,
        flatCoordinates
      );
      this.changed();
    }
  }
  translate(deltaX, deltaY) {
    const flatCoordinates = this.getFlatCoordinates();
    if (flatCoordinates) {
      const stride = this.getStride();
      translate(
        flatCoordinates,
        0,
        flatCoordinates.length,
        stride,
        deltaX,
        deltaY,
        flatCoordinates
      );
      this.changed();
    }
  }
}
function getLayoutForStride(stride) {
  let layout;
  if (stride == 2) {
    layout = "XY";
  } else if (stride == 3) {
    layout = "XYZ";
  } else if (stride == 4) {
    layout = "XYZM";
  }
  return layout;
}
function getStrideForLayout(layout) {
  let stride;
  if (layout == "XY") {
    stride = 2;
  } else if (layout == "XYZ" || layout == "XYM") {
    stride = 3;
  } else if (layout == "XYZM") {
    stride = 4;
  }
  return stride;
}
function transformGeom2D(simpleGeometry, transform2, dest) {
  const flatCoordinates = simpleGeometry.getFlatCoordinates();
  if (!flatCoordinates) {
    return null;
  } else {
    const stride = simpleGeometry.getStride();
    return transform2D(
      flatCoordinates,
      0,
      flatCoordinates.length,
      stride,
      transform2,
      dest
    );
  }
}
const SimpleGeometry$1 = SimpleGeometry;
class CanvasImmediateRenderer extends VectorContext$1 {
  constructor(context, pixelRatio, extent, transform2, viewRotation, squaredTolerance, userTransform) {
    super();
    this.context_ = context;
    this.pixelRatio_ = pixelRatio;
    this.extent_ = extent;
    this.transform_ = transform2;
    this.viewRotation_ = viewRotation;
    this.squaredTolerance_ = squaredTolerance;
    this.userTransform_ = userTransform;
    this.contextFillState_ = null;
    this.contextStrokeState_ = null;
    this.contextTextState_ = null;
    this.fillState_ = null;
    this.strokeState_ = null;
    this.image_ = null;
    this.imageAnchorX_ = 0;
    this.imageAnchorY_ = 0;
    this.imageHeight_ = 0;
    this.imageOpacity_ = 0;
    this.imageOriginX_ = 0;
    this.imageOriginY_ = 0;
    this.imageRotateWithView_ = false;
    this.imageRotation_ = 0;
    this.imageScale_ = [0, 0];
    this.imageWidth_ = 0;
    this.text_ = "";
    this.textOffsetX_ = 0;
    this.textOffsetY_ = 0;
    this.textRotateWithView_ = false;
    this.textRotation_ = 0;
    this.textScale_ = [0, 0];
    this.textFillState_ = null;
    this.textStrokeState_ = null;
    this.textState_ = null;
    this.pixelCoordinates_ = [];
    this.tmpLocalTransform_ = create$2();
  }
  drawImages_(flatCoordinates, offset, end, stride) {
    if (!this.image_) {
      return;
    }
    const pixelCoordinates = transform2D(
      flatCoordinates,
      offset,
      end,
      stride,
      this.transform_,
      this.pixelCoordinates_
    );
    const context = this.context_;
    const localTransform = this.tmpLocalTransform_;
    const alpha = context.globalAlpha;
    if (this.imageOpacity_ != 1) {
      context.globalAlpha = alpha * this.imageOpacity_;
    }
    let rotation = this.imageRotation_;
    if (this.imageRotateWithView_) {
      rotation += this.viewRotation_;
    }
    for (let i = 0, ii = pixelCoordinates.length; i < ii; i += 2) {
      const x = pixelCoordinates[i] - this.imageAnchorX_;
      const y = pixelCoordinates[i + 1] - this.imageAnchorY_;
      if (rotation !== 0 || this.imageScale_[0] != 1 || this.imageScale_[1] != 1) {
        const centerX = x + this.imageAnchorX_;
        const centerY = y + this.imageAnchorY_;
        compose(
          localTransform,
          centerX,
          centerY,
          1,
          1,
          rotation,
          -centerX,
          -centerY
        );
        context.setTransform.apply(context, localTransform);
        context.translate(centerX, centerY);
        context.scale(this.imageScale_[0], this.imageScale_[1]);
        context.drawImage(
          this.image_,
          this.imageOriginX_,
          this.imageOriginY_,
          this.imageWidth_,
          this.imageHeight_,
          -this.imageAnchorX_,
          -this.imageAnchorY_,
          this.imageWidth_,
          this.imageHeight_
        );
        context.setTransform(1, 0, 0, 1, 0, 0);
      } else {
        context.drawImage(
          this.image_,
          this.imageOriginX_,
          this.imageOriginY_,
          this.imageWidth_,
          this.imageHeight_,
          x,
          y,
          this.imageWidth_,
          this.imageHeight_
        );
      }
    }
    if (this.imageOpacity_ != 1) {
      context.globalAlpha = alpha;
    }
  }
  drawText_(flatCoordinates, offset, end, stride) {
    if (!this.textState_ || this.text_ === "") {
      return;
    }
    if (this.textFillState_) {
      this.setContextFillState_(this.textFillState_);
    }
    if (this.textStrokeState_) {
      this.setContextStrokeState_(this.textStrokeState_);
    }
    this.setContextTextState_(this.textState_);
    const pixelCoordinates = transform2D(
      flatCoordinates,
      offset,
      end,
      stride,
      this.transform_,
      this.pixelCoordinates_
    );
    const context = this.context_;
    let rotation = this.textRotation_;
    if (this.textRotateWithView_) {
      rotation += this.viewRotation_;
    }
    for (; offset < end; offset += stride) {
      const x = pixelCoordinates[offset] + this.textOffsetX_;
      const y = pixelCoordinates[offset + 1] + this.textOffsetY_;
      if (rotation !== 0 || this.textScale_[0] != 1 || this.textScale_[1] != 1) {
        context.translate(x - this.textOffsetX_, y - this.textOffsetY_);
        context.rotate(rotation);
        context.translate(this.textOffsetX_, this.textOffsetY_);
        context.scale(this.textScale_[0], this.textScale_[1]);
        if (this.textStrokeState_) {
          context.strokeText(this.text_, 0, 0);
        }
        if (this.textFillState_) {
          context.fillText(this.text_, 0, 0);
        }
        context.setTransform(1, 0, 0, 1, 0, 0);
      } else {
        if (this.textStrokeState_) {
          context.strokeText(this.text_, x, y);
        }
        if (this.textFillState_) {
          context.fillText(this.text_, x, y);
        }
      }
    }
  }
  moveToLineTo_(flatCoordinates, offset, end, stride, close) {
    const context = this.context_;
    const pixelCoordinates = transform2D(
      flatCoordinates,
      offset,
      end,
      stride,
      this.transform_,
      this.pixelCoordinates_
    );
    context.moveTo(pixelCoordinates[0], pixelCoordinates[1]);
    let length = pixelCoordinates.length;
    if (close) {
      length -= 2;
    }
    for (let i = 2; i < length; i += 2) {
      context.lineTo(pixelCoordinates[i], pixelCoordinates[i + 1]);
    }
    if (close) {
      context.closePath();
    }
    return end;
  }
  drawRings_(flatCoordinates, offset, ends, stride) {
    for (let i = 0, ii = ends.length; i < ii; ++i) {
      offset = this.moveToLineTo_(
        flatCoordinates,
        offset,
        ends[i],
        stride,
        true
      );
    }
    return offset;
  }
  drawCircle(geometry) {
    if (!intersects$2(this.extent_, geometry.getExtent())) {
      return;
    }
    if (this.fillState_ || this.strokeState_) {
      if (this.fillState_) {
        this.setContextFillState_(this.fillState_);
      }
      if (this.strokeState_) {
        this.setContextStrokeState_(this.strokeState_);
      }
      const pixelCoordinates = transformGeom2D(
        geometry,
        this.transform_,
        this.pixelCoordinates_
      );
      const dx = pixelCoordinates[2] - pixelCoordinates[0];
      const dy = pixelCoordinates[3] - pixelCoordinates[1];
      const radius = Math.sqrt(dx * dx + dy * dy);
      const context = this.context_;
      context.beginPath();
      context.arc(
        pixelCoordinates[0],
        pixelCoordinates[1],
        radius,
        0,
        2 * Math.PI
      );
      if (this.fillState_) {
        context.fill();
      }
      if (this.strokeState_) {
        context.stroke();
      }
    }
    if (this.text_ !== "") {
      this.drawText_(geometry.getCenter(), 0, 2, 2);
    }
  }
  setStyle(style) {
    this.setFillStrokeStyle(style.getFill(), style.getStroke());
    this.setImageStyle(style.getImage());
    this.setTextStyle(style.getText());
  }
  setTransform(transform2) {
    this.transform_ = transform2;
  }
  drawGeometry(geometry) {
    const type = geometry.getType();
    switch (type) {
      case "Point":
        this.drawPoint(
          geometry
        );
        break;
      case "LineString":
        this.drawLineString(
          geometry
        );
        break;
      case "Polygon":
        this.drawPolygon(
          geometry
        );
        break;
      case "MultiPoint":
        this.drawMultiPoint(
          geometry
        );
        break;
      case "MultiLineString":
        this.drawMultiLineString(
          geometry
        );
        break;
      case "MultiPolygon":
        this.drawMultiPolygon(
          geometry
        );
        break;
      case "GeometryCollection":
        this.drawGeometryCollection(
          geometry
        );
        break;
      case "Circle":
        this.drawCircle(
          geometry
        );
        break;
    }
  }
  drawFeature(feature2, style) {
    const geometry = style.getGeometryFunction()(feature2);
    if (!geometry || !intersects$2(this.extent_, geometry.getExtent())) {
      return;
    }
    this.setStyle(style);
    this.drawGeometry(geometry);
  }
  drawGeometryCollection(geometry) {
    const geometries = geometry.getGeometriesArray();
    for (let i = 0, ii = geometries.length; i < ii; ++i) {
      this.drawGeometry(geometries[i]);
    }
  }
  drawPoint(geometry) {
    if (this.squaredTolerance_) {
      geometry = geometry.simplifyTransformed(
        this.squaredTolerance_,
        this.userTransform_
      );
    }
    const flatCoordinates = geometry.getFlatCoordinates();
    const stride = geometry.getStride();
    if (this.image_) {
      this.drawImages_(flatCoordinates, 0, flatCoordinates.length, stride);
    }
    if (this.text_ !== "") {
      this.drawText_(flatCoordinates, 0, flatCoordinates.length, stride);
    }
  }
  drawMultiPoint(geometry) {
    if (this.squaredTolerance_) {
      geometry = geometry.simplifyTransformed(
        this.squaredTolerance_,
        this.userTransform_
      );
    }
    const flatCoordinates = geometry.getFlatCoordinates();
    const stride = geometry.getStride();
    if (this.image_) {
      this.drawImages_(flatCoordinates, 0, flatCoordinates.length, stride);
    }
    if (this.text_ !== "") {
      this.drawText_(flatCoordinates, 0, flatCoordinates.length, stride);
    }
  }
  drawLineString(geometry) {
    if (this.squaredTolerance_) {
      geometry = geometry.simplifyTransformed(
        this.squaredTolerance_,
        this.userTransform_
      );
    }
    if (!intersects$2(this.extent_, geometry.getExtent())) {
      return;
    }
    if (this.strokeState_) {
      this.setContextStrokeState_(this.strokeState_);
      const context = this.context_;
      const flatCoordinates = geometry.getFlatCoordinates();
      context.beginPath();
      this.moveToLineTo_(
        flatCoordinates,
        0,
        flatCoordinates.length,
        geometry.getStride(),
        false
      );
      context.stroke();
    }
    if (this.text_ !== "") {
      const flatMidpoint = geometry.getFlatMidpoint();
      this.drawText_(flatMidpoint, 0, 2, 2);
    }
  }
  drawMultiLineString(geometry) {
    if (this.squaredTolerance_) {
      geometry = geometry.simplifyTransformed(
        this.squaredTolerance_,
        this.userTransform_
      );
    }
    const geometryExtent = geometry.getExtent();
    if (!intersects$2(this.extent_, geometryExtent)) {
      return;
    }
    if (this.strokeState_) {
      this.setContextStrokeState_(this.strokeState_);
      const context = this.context_;
      const flatCoordinates = geometry.getFlatCoordinates();
      let offset = 0;
      const ends = geometry.getEnds();
      const stride = geometry.getStride();
      context.beginPath();
      for (let i = 0, ii = ends.length; i < ii; ++i) {
        offset = this.moveToLineTo_(
          flatCoordinates,
          offset,
          ends[i],
          stride,
          false
        );
      }
      context.stroke();
    }
    if (this.text_ !== "") {
      const flatMidpoints = geometry.getFlatMidpoints();
      this.drawText_(flatMidpoints, 0, flatMidpoints.length, 2);
    }
  }
  drawPolygon(geometry) {
    if (this.squaredTolerance_) {
      geometry = geometry.simplifyTransformed(
        this.squaredTolerance_,
        this.userTransform_
      );
    }
    if (!intersects$2(this.extent_, geometry.getExtent())) {
      return;
    }
    if (this.strokeState_ || this.fillState_) {
      if (this.fillState_) {
        this.setContextFillState_(this.fillState_);
      }
      if (this.strokeState_) {
        this.setContextStrokeState_(this.strokeState_);
      }
      const context = this.context_;
      context.beginPath();
      this.drawRings_(
        geometry.getOrientedFlatCoordinates(),
        0,
        geometry.getEnds(),
        geometry.getStride()
      );
      if (this.fillState_) {
        context.fill();
      }
      if (this.strokeState_) {
        context.stroke();
      }
    }
    if (this.text_ !== "") {
      const flatInteriorPoint = geometry.getFlatInteriorPoint();
      this.drawText_(flatInteriorPoint, 0, 2, 2);
    }
  }
  drawMultiPolygon(geometry) {
    if (this.squaredTolerance_) {
      geometry = geometry.simplifyTransformed(
        this.squaredTolerance_,
        this.userTransform_
      );
    }
    if (!intersects$2(this.extent_, geometry.getExtent())) {
      return;
    }
    if (this.strokeState_ || this.fillState_) {
      if (this.fillState_) {
        this.setContextFillState_(this.fillState_);
      }
      if (this.strokeState_) {
        this.setContextStrokeState_(this.strokeState_);
      }
      const context = this.context_;
      const flatCoordinates = geometry.getOrientedFlatCoordinates();
      let offset = 0;
      const endss = geometry.getEndss();
      const stride = geometry.getStride();
      context.beginPath();
      for (let i = 0, ii = endss.length; i < ii; ++i) {
        const ends = endss[i];
        offset = this.drawRings_(flatCoordinates, offset, ends, stride);
      }
      if (this.fillState_) {
        context.fill();
      }
      if (this.strokeState_) {
        context.stroke();
      }
    }
    if (this.text_ !== "") {
      const flatInteriorPoints = geometry.getFlatInteriorPoints();
      this.drawText_(flatInteriorPoints, 0, flatInteriorPoints.length, 2);
    }
  }
  setContextFillState_(fillState) {
    const context = this.context_;
    const contextFillState = this.contextFillState_;
    if (!contextFillState) {
      context.fillStyle = fillState.fillStyle;
      this.contextFillState_ = {
        fillStyle: fillState.fillStyle
      };
    } else {
      if (contextFillState.fillStyle != fillState.fillStyle) {
        contextFillState.fillStyle = fillState.fillStyle;
        context.fillStyle = fillState.fillStyle;
      }
    }
  }
  setContextStrokeState_(strokeState) {
    const context = this.context_;
    const contextStrokeState = this.contextStrokeState_;
    if (!contextStrokeState) {
      context.lineCap = strokeState.lineCap;
      context.setLineDash(strokeState.lineDash);
      context.lineDashOffset = strokeState.lineDashOffset;
      context.lineJoin = strokeState.lineJoin;
      context.lineWidth = strokeState.lineWidth;
      context.miterLimit = strokeState.miterLimit;
      context.strokeStyle = strokeState.strokeStyle;
      this.contextStrokeState_ = {
        lineCap: strokeState.lineCap,
        lineDash: strokeState.lineDash,
        lineDashOffset: strokeState.lineDashOffset,
        lineJoin: strokeState.lineJoin,
        lineWidth: strokeState.lineWidth,
        miterLimit: strokeState.miterLimit,
        strokeStyle: strokeState.strokeStyle
      };
    } else {
      if (contextStrokeState.lineCap != strokeState.lineCap) {
        contextStrokeState.lineCap = strokeState.lineCap;
        context.lineCap = strokeState.lineCap;
      }
      if (!equals$1(contextStrokeState.lineDash, strokeState.lineDash)) {
        context.setLineDash(
          contextStrokeState.lineDash = strokeState.lineDash
        );
      }
      if (contextStrokeState.lineDashOffset != strokeState.lineDashOffset) {
        contextStrokeState.lineDashOffset = strokeState.lineDashOffset;
        context.lineDashOffset = strokeState.lineDashOffset;
      }
      if (contextStrokeState.lineJoin != strokeState.lineJoin) {
        contextStrokeState.lineJoin = strokeState.lineJoin;
        context.lineJoin = strokeState.lineJoin;
      }
      if (contextStrokeState.lineWidth != strokeState.lineWidth) {
        contextStrokeState.lineWidth = strokeState.lineWidth;
        context.lineWidth = strokeState.lineWidth;
      }
      if (contextStrokeState.miterLimit != strokeState.miterLimit) {
        contextStrokeState.miterLimit = strokeState.miterLimit;
        context.miterLimit = strokeState.miterLimit;
      }
      if (contextStrokeState.strokeStyle != strokeState.strokeStyle) {
        contextStrokeState.strokeStyle = strokeState.strokeStyle;
        context.strokeStyle = strokeState.strokeStyle;
      }
    }
  }
  setContextTextState_(textState) {
    const context = this.context_;
    const contextTextState = this.contextTextState_;
    const textAlign = textState.textAlign ? textState.textAlign : defaultTextAlign;
    if (!contextTextState) {
      context.font = textState.font;
      context.textAlign = textAlign;
      context.textBaseline = textState.textBaseline;
      this.contextTextState_ = {
        font: textState.font,
        textAlign,
        textBaseline: textState.textBaseline
      };
    } else {
      if (contextTextState.font != textState.font) {
        contextTextState.font = textState.font;
        context.font = textState.font;
      }
      if (contextTextState.textAlign != textAlign) {
        contextTextState.textAlign = textAlign;
        context.textAlign = textAlign;
      }
      if (contextTextState.textBaseline != textState.textBaseline) {
        contextTextState.textBaseline = textState.textBaseline;
        context.textBaseline = textState.textBaseline;
      }
    }
  }
  setFillStrokeStyle(fillStyle, strokeStyle) {
    if (!fillStyle) {
      this.fillState_ = null;
    } else {
      const fillStyleColor = fillStyle.getColor();
      this.fillState_ = {
        fillStyle: asColorLike(
          fillStyleColor ? fillStyleColor : defaultFillStyle
        )
      };
    }
    if (!strokeStyle) {
      this.strokeState_ = null;
    } else {
      const strokeStyleColor = strokeStyle.getColor();
      const strokeStyleLineCap = strokeStyle.getLineCap();
      const strokeStyleLineDash = strokeStyle.getLineDash();
      const strokeStyleLineDashOffset = strokeStyle.getLineDashOffset();
      const strokeStyleLineJoin = strokeStyle.getLineJoin();
      const strokeStyleWidth = strokeStyle.getWidth();
      const strokeStyleMiterLimit = strokeStyle.getMiterLimit();
      const lineDash = strokeStyleLineDash ? strokeStyleLineDash : defaultLineDash;
      this.strokeState_ = {
        lineCap: strokeStyleLineCap !== void 0 ? strokeStyleLineCap : defaultLineCap,
        lineDash: this.pixelRatio_ === 1 ? lineDash : lineDash.map((n) => n * this.pixelRatio_),
        lineDashOffset: (strokeStyleLineDashOffset ? strokeStyleLineDashOffset : defaultLineDashOffset) * this.pixelRatio_,
        lineJoin: strokeStyleLineJoin !== void 0 ? strokeStyleLineJoin : defaultLineJoin,
        lineWidth: (strokeStyleWidth !== void 0 ? strokeStyleWidth : defaultLineWidth) * this.pixelRatio_,
        miterLimit: strokeStyleMiterLimit !== void 0 ? strokeStyleMiterLimit : defaultMiterLimit,
        strokeStyle: asColorLike(
          strokeStyleColor ? strokeStyleColor : defaultStrokeStyle
        )
      };
    }
  }
  setImageStyle(imageStyle) {
    let imageSize;
    if (!imageStyle || !(imageSize = imageStyle.getSize())) {
      this.image_ = null;
      return;
    }
    const imagePixelRatio = imageStyle.getPixelRatio(this.pixelRatio_);
    const imageAnchor = imageStyle.getAnchor();
    const imageOrigin = imageStyle.getOrigin();
    this.image_ = imageStyle.getImage(this.pixelRatio_);
    this.imageAnchorX_ = imageAnchor[0] * imagePixelRatio;
    this.imageAnchorY_ = imageAnchor[1] * imagePixelRatio;
    this.imageHeight_ = imageSize[1] * imagePixelRatio;
    this.imageOpacity_ = imageStyle.getOpacity();
    this.imageOriginX_ = imageOrigin[0];
    this.imageOriginY_ = imageOrigin[1];
    this.imageRotateWithView_ = imageStyle.getRotateWithView();
    this.imageRotation_ = imageStyle.getRotation();
    const imageScale = imageStyle.getScaleArray();
    this.imageScale_ = [
      imageScale[0] * this.pixelRatio_ / imagePixelRatio,
      imageScale[1] * this.pixelRatio_ / imagePixelRatio
    ];
    this.imageWidth_ = imageSize[0] * imagePixelRatio;
  }
  setTextStyle(textStyle) {
    if (!textStyle) {
      this.text_ = "";
    } else {
      const textFillStyle = textStyle.getFill();
      if (!textFillStyle) {
        this.textFillState_ = null;
      } else {
        const textFillStyleColor = textFillStyle.getColor();
        this.textFillState_ = {
          fillStyle: asColorLike(
            textFillStyleColor ? textFillStyleColor : defaultFillStyle
          )
        };
      }
      const textStrokeStyle = textStyle.getStroke();
      if (!textStrokeStyle) {
        this.textStrokeState_ = null;
      } else {
        const textStrokeStyleColor = textStrokeStyle.getColor();
        const textStrokeStyleLineCap = textStrokeStyle.getLineCap();
        const textStrokeStyleLineDash = textStrokeStyle.getLineDash();
        const textStrokeStyleLineDashOffset = textStrokeStyle.getLineDashOffset();
        const textStrokeStyleLineJoin = textStrokeStyle.getLineJoin();
        const textStrokeStyleWidth = textStrokeStyle.getWidth();
        const textStrokeStyleMiterLimit = textStrokeStyle.getMiterLimit();
        this.textStrokeState_ = {
          lineCap: textStrokeStyleLineCap !== void 0 ? textStrokeStyleLineCap : defaultLineCap,
          lineDash: textStrokeStyleLineDash ? textStrokeStyleLineDash : defaultLineDash,
          lineDashOffset: textStrokeStyleLineDashOffset ? textStrokeStyleLineDashOffset : defaultLineDashOffset,
          lineJoin: textStrokeStyleLineJoin !== void 0 ? textStrokeStyleLineJoin : defaultLineJoin,
          lineWidth: textStrokeStyleWidth !== void 0 ? textStrokeStyleWidth : defaultLineWidth,
          miterLimit: textStrokeStyleMiterLimit !== void 0 ? textStrokeStyleMiterLimit : defaultMiterLimit,
          strokeStyle: asColorLike(
            textStrokeStyleColor ? textStrokeStyleColor : defaultStrokeStyle
          )
        };
      }
      const textFont = textStyle.getFont();
      const textOffsetX = textStyle.getOffsetX();
      const textOffsetY = textStyle.getOffsetY();
      const textRotateWithView = textStyle.getRotateWithView();
      const textRotation = textStyle.getRotation();
      const textScale = textStyle.getScaleArray();
      const textText = textStyle.getText();
      const textTextAlign = textStyle.getTextAlign();
      const textTextBaseline = textStyle.getTextBaseline();
      this.textState_ = {
        font: textFont !== void 0 ? textFont : defaultFont,
        textAlign: textTextAlign !== void 0 ? textTextAlign : defaultTextAlign,
        textBaseline: textTextBaseline !== void 0 ? textTextBaseline : defaultTextBaseline
      };
      this.text_ = textText !== void 0 ? Array.isArray(textText) ? textText.reduce((acc, t, i) => acc += i % 2 ? " " : t, "") : textText : "";
      this.textOffsetX_ = textOffsetX !== void 0 ? this.pixelRatio_ * textOffsetX : 0;
      this.textOffsetY_ = textOffsetY !== void 0 ? this.pixelRatio_ * textOffsetY : 0;
      this.textRotateWithView_ = textRotateWithView !== void 0 ? textRotateWithView : false;
      this.textRotation_ = textRotation !== void 0 ? textRotation : 0;
      this.textScale_ = [
        this.pixelRatio_ * textScale[0],
        this.pixelRatio_ * textScale[1]
      ];
    }
  }
}
const CanvasImmediateRenderer$1 = CanvasImmediateRenderer;
const HIT_DETECT_RESOLUTION = 0.5;
function createHitDetectionImageData(size, transforms2, features, styleFunction, extent, resolution, rotation) {
  const width = size[0] * HIT_DETECT_RESOLUTION;
  const height = size[1] * HIT_DETECT_RESOLUTION;
  const context = createCanvasContext2D(width, height);
  context.imageSmoothingEnabled = false;
  const canvas = context.canvas;
  const renderer = new CanvasImmediateRenderer$1(
    context,
    HIT_DETECT_RESOLUTION,
    extent,
    null,
    rotation
  );
  const featureCount = features.length;
  const indexFactor = Math.floor((256 * 256 * 256 - 1) / featureCount);
  const featuresByZIndex = {};
  for (let i = 1; i <= featureCount; ++i) {
    const feature2 = features[i - 1];
    const featureStyleFunction = feature2.getStyleFunction() || styleFunction;
    if (!styleFunction) {
      continue;
    }
    let styles = featureStyleFunction(feature2, resolution);
    if (!styles) {
      continue;
    }
    if (!Array.isArray(styles)) {
      styles = [styles];
    }
    const index2 = i * indexFactor;
    const color = "#" + ("000000" + index2.toString(16)).slice(-6);
    for (let j = 0, jj = styles.length; j < jj; ++j) {
      const originalStyle = styles[j];
      const geometry = originalStyle.getGeometryFunction()(feature2);
      if (!geometry || !intersects$2(extent, geometry.getExtent())) {
        continue;
      }
      const style = originalStyle.clone();
      const fill = style.getFill();
      if (fill) {
        fill.setColor(color);
      }
      const stroke = style.getStroke();
      if (stroke) {
        stroke.setColor(color);
        stroke.setLineDash(null);
      }
      style.setText(void 0);
      const image = originalStyle.getImage();
      if (image && image.getOpacity() !== 0) {
        const imgSize = image.getImageSize();
        if (!imgSize) {
          continue;
        }
        const imgContext = createCanvasContext2D(
          imgSize[0],
          imgSize[1],
          void 0,
          { alpha: false }
        );
        const img = imgContext.canvas;
        imgContext.fillStyle = color;
        imgContext.fillRect(0, 0, img.width, img.height);
        style.setImage(
          new Icon$1({
            img,
            imgSize,
            anchor: image.getAnchor(),
            anchorXUnits: "pixels",
            anchorYUnits: "pixels",
            offset: image.getOrigin(),
            opacity: 1,
            size: image.getSize(),
            scale: image.getScale(),
            rotation: image.getRotation(),
            rotateWithView: image.getRotateWithView()
          })
        );
      }
      const zIndex = style.getZIndex() || 0;
      let byGeometryType = featuresByZIndex[zIndex];
      if (!byGeometryType) {
        byGeometryType = {};
        featuresByZIndex[zIndex] = byGeometryType;
        byGeometryType["Polygon"] = [];
        byGeometryType["Circle"] = [];
        byGeometryType["LineString"] = [];
        byGeometryType["Point"] = [];
      }
      byGeometryType[geometry.getType().replace("Multi", "")].push(
        geometry,
        style
      );
    }
  }
  const zIndexKeys = Object.keys(featuresByZIndex).map(Number).sort(numberSafeCompareFunction);
  for (let i = 0, ii = zIndexKeys.length; i < ii; ++i) {
    const byGeometryType = featuresByZIndex[zIndexKeys[i]];
    for (const type in byGeometryType) {
      const geomAndStyle = byGeometryType[type];
      for (let j = 0, jj = geomAndStyle.length; j < jj; j += 2) {
        renderer.setStyle(geomAndStyle[j + 1]);
        for (let k = 0, kk = transforms2.length; k < kk; ++k) {
          renderer.setTransform(transforms2[k]);
          renderer.drawGeometry(geomAndStyle[j]);
        }
      }
    }
  }
  return context.getImageData(0, 0, canvas.width, canvas.height);
}
function hitDetect(pixel, features, imageData) {
  const resultFeatures = [];
  if (imageData) {
    const x = Math.floor(Math.round(pixel[0]) * HIT_DETECT_RESOLUTION);
    const y = Math.floor(Math.round(pixel[1]) * HIT_DETECT_RESOLUTION);
    const index2 = (clamp(x, 0, imageData.width - 1) + clamp(y, 0, imageData.height - 1) * imageData.width) * 4;
    const r = imageData.data[index2];
    const g = imageData.data[index2 + 1];
    const b = imageData.data[index2 + 2];
    const i = b + 256 * (g + 256 * r);
    const indexFactor = Math.floor((256 * 256 * 256 - 1) / features.length);
    if (i && i % indexFactor === 0) {
      resultFeatures.push(features[i / indexFactor - 1]);
    }
  }
  return resultFeatures;
}
const SIMPLIFY_TOLERANCE = 0.5;
const GEOMETRY_RENDERERS = {
  "Point": renderPointGeometry,
  "LineString": renderLineStringGeometry,
  "Polygon": renderPolygonGeometry,
  "MultiPoint": renderMultiPointGeometry,
  "MultiLineString": renderMultiLineStringGeometry,
  "MultiPolygon": renderMultiPolygonGeometry,
  "GeometryCollection": renderGeometryCollectionGeometry,
  "Circle": renderCircleGeometry
};
function defaultOrder(feature1, feature2) {
  return parseInt(getUid(feature1), 10) - parseInt(getUid(feature2), 10);
}
function getSquaredTolerance(resolution, pixelRatio) {
  const tolerance = getTolerance(resolution, pixelRatio);
  return tolerance * tolerance;
}
function getTolerance(resolution, pixelRatio) {
  return SIMPLIFY_TOLERANCE * resolution / pixelRatio;
}
function renderCircleGeometry(builderGroup, geometry, style, feature2, declutterBuilderGroup) {
  const fillStyle = style.getFill();
  const strokeStyle = style.getStroke();
  if (fillStyle || strokeStyle) {
    const circleReplay = builderGroup.getBuilder(style.getZIndex(), "Circle");
    circleReplay.setFillStrokeStyle(fillStyle, strokeStyle);
    circleReplay.drawCircle(geometry, feature2);
  }
  const textStyle = style.getText();
  if (textStyle && textStyle.getText()) {
    const textReplay = (declutterBuilderGroup || builderGroup).getBuilder(
      style.getZIndex(),
      "Text"
    );
    textReplay.setTextStyle(textStyle);
    textReplay.drawText(geometry, feature2);
  }
}
function renderFeature(replayGroup, feature2, style, squaredTolerance, listener, transform2, declutterBuilderGroup) {
  let loading = false;
  const imageStyle = style.getImage();
  if (imageStyle) {
    const imageState = imageStyle.getImageState();
    if (imageState == ImageState.LOADED || imageState == ImageState.ERROR) {
      imageStyle.unlistenImageChange(listener);
    } else {
      if (imageState == ImageState.IDLE) {
        imageStyle.load();
      }
      imageStyle.listenImageChange(listener);
      loading = true;
    }
  }
  renderFeatureInternal(
    replayGroup,
    feature2,
    style,
    squaredTolerance,
    transform2,
    declutterBuilderGroup
  );
  return loading;
}
function renderFeatureInternal(replayGroup, feature2, style, squaredTolerance, transform2, declutterBuilderGroup) {
  const geometry = style.getGeometryFunction()(feature2);
  if (!geometry) {
    return;
  }
  const simplifiedGeometry = geometry.simplifyTransformed(
    squaredTolerance,
    transform2
  );
  const renderer = style.getRenderer();
  if (renderer) {
    renderGeometry(replayGroup, simplifiedGeometry, style, feature2);
  } else {
    const geometryRenderer = GEOMETRY_RENDERERS[simplifiedGeometry.getType()];
    geometryRenderer(
      replayGroup,
      simplifiedGeometry,
      style,
      feature2,
      declutterBuilderGroup
    );
  }
}
function renderGeometry(replayGroup, geometry, style, feature2) {
  if (geometry.getType() == "GeometryCollection") {
    const geometries = geometry.getGeometries();
    for (let i = 0, ii = geometries.length; i < ii; ++i) {
      renderGeometry(replayGroup, geometries[i], style, feature2);
    }
    return;
  }
  const replay = replayGroup.getBuilder(style.getZIndex(), "Default");
  replay.drawCustom(
    geometry,
    feature2,
    style.getRenderer(),
    style.getHitDetectionRenderer()
  );
}
function renderGeometryCollectionGeometry(replayGroup, geometry, style, feature2, declutterBuilderGroup) {
  const geometries = geometry.getGeometriesArray();
  let i, ii;
  for (i = 0, ii = geometries.length; i < ii; ++i) {
    const geometryRenderer = GEOMETRY_RENDERERS[geometries[i].getType()];
    geometryRenderer(
      replayGroup,
      geometries[i],
      style,
      feature2,
      declutterBuilderGroup
    );
  }
}
function renderLineStringGeometry(builderGroup, geometry, style, feature2, declutterBuilderGroup) {
  const strokeStyle = style.getStroke();
  if (strokeStyle) {
    const lineStringReplay = builderGroup.getBuilder(
      style.getZIndex(),
      "LineString"
    );
    lineStringReplay.setFillStrokeStyle(null, strokeStyle);
    lineStringReplay.drawLineString(geometry, feature2);
  }
  const textStyle = style.getText();
  if (textStyle && textStyle.getText()) {
    const textReplay = (declutterBuilderGroup || builderGroup).getBuilder(
      style.getZIndex(),
      "Text"
    );
    textReplay.setTextStyle(textStyle);
    textReplay.drawText(geometry, feature2);
  }
}
function renderMultiLineStringGeometry(builderGroup, geometry, style, feature2, declutterBuilderGroup) {
  const strokeStyle = style.getStroke();
  if (strokeStyle) {
    const lineStringReplay = builderGroup.getBuilder(
      style.getZIndex(),
      "LineString"
    );
    lineStringReplay.setFillStrokeStyle(null, strokeStyle);
    lineStringReplay.drawMultiLineString(geometry, feature2);
  }
  const textStyle = style.getText();
  if (textStyle && textStyle.getText()) {
    const textReplay = (declutterBuilderGroup || builderGroup).getBuilder(
      style.getZIndex(),
      "Text"
    );
    textReplay.setTextStyle(textStyle);
    textReplay.drawText(geometry, feature2);
  }
}
function renderMultiPolygonGeometry(builderGroup, geometry, style, feature2, declutterBuilderGroup) {
  const fillStyle = style.getFill();
  const strokeStyle = style.getStroke();
  if (strokeStyle || fillStyle) {
    const polygonReplay = builderGroup.getBuilder(style.getZIndex(), "Polygon");
    polygonReplay.setFillStrokeStyle(fillStyle, strokeStyle);
    polygonReplay.drawMultiPolygon(geometry, feature2);
  }
  const textStyle = style.getText();
  if (textStyle && textStyle.getText()) {
    const textReplay = (declutterBuilderGroup || builderGroup).getBuilder(
      style.getZIndex(),
      "Text"
    );
    textReplay.setTextStyle(textStyle);
    textReplay.drawText(geometry, feature2);
  }
}
function renderPointGeometry(builderGroup, geometry, style, feature2, declutterBuilderGroup) {
  const imageStyle = style.getImage();
  const textStyle = style.getText();
  let declutterImageWithText;
  if (imageStyle) {
    if (imageStyle.getImageState() != ImageState.LOADED) {
      return;
    }
    let imageBuilderGroup = builderGroup;
    if (declutterBuilderGroup) {
      const declutterMode = imageStyle.getDeclutterMode();
      if (declutterMode !== "none") {
        imageBuilderGroup = declutterBuilderGroup;
        if (declutterMode === "obstacle") {
          const imageReplay2 = builderGroup.getBuilder(
            style.getZIndex(),
            "Image"
          );
          imageReplay2.setImageStyle(imageStyle, declutterImageWithText);
          imageReplay2.drawPoint(geometry, feature2);
        } else if (textStyle && textStyle.getText()) {
          declutterImageWithText = {};
        }
      }
    }
    const imageReplay = imageBuilderGroup.getBuilder(
      style.getZIndex(),
      "Image"
    );
    imageReplay.setImageStyle(imageStyle, declutterImageWithText);
    imageReplay.drawPoint(geometry, feature2);
  }
  if (textStyle && textStyle.getText()) {
    let textBuilderGroup = builderGroup;
    if (declutterBuilderGroup) {
      textBuilderGroup = declutterBuilderGroup;
    }
    const textReplay = textBuilderGroup.getBuilder(style.getZIndex(), "Text");
    textReplay.setTextStyle(textStyle, declutterImageWithText);
    textReplay.drawText(geometry, feature2);
  }
}
function renderMultiPointGeometry(builderGroup, geometry, style, feature2, declutterBuilderGroup) {
  const imageStyle = style.getImage();
  const textStyle = style.getText();
  let declutterImageWithText;
  if (imageStyle) {
    if (imageStyle.getImageState() != ImageState.LOADED) {
      return;
    }
    let imageBuilderGroup = builderGroup;
    if (declutterBuilderGroup) {
      const declutterMode = imageStyle.getDeclutterMode();
      if (declutterMode !== "none") {
        imageBuilderGroup = declutterBuilderGroup;
        if (declutterMode === "obstacle") {
          const imageReplay2 = builderGroup.getBuilder(
            style.getZIndex(),
            "Image"
          );
          imageReplay2.setImageStyle(imageStyle, declutterImageWithText);
          imageReplay2.drawMultiPoint(geometry, feature2);
        } else if (textStyle && textStyle.getText()) {
          declutterImageWithText = {};
        }
      }
    }
    const imageReplay = imageBuilderGroup.getBuilder(
      style.getZIndex(),
      "Image"
    );
    imageReplay.setImageStyle(imageStyle, declutterImageWithText);
    imageReplay.drawMultiPoint(geometry, feature2);
  }
  if (textStyle && textStyle.getText()) {
    let textBuilderGroup = builderGroup;
    if (declutterBuilderGroup) {
      textBuilderGroup = declutterBuilderGroup;
    }
    const textReplay = textBuilderGroup.getBuilder(style.getZIndex(), "Text");
    textReplay.setTextStyle(textStyle, declutterImageWithText);
    textReplay.drawText(geometry, feature2);
  }
}
function renderPolygonGeometry(builderGroup, geometry, style, feature2, declutterBuilderGroup) {
  const fillStyle = style.getFill();
  const strokeStyle = style.getStroke();
  if (fillStyle || strokeStyle) {
    const polygonReplay = builderGroup.getBuilder(style.getZIndex(), "Polygon");
    polygonReplay.setFillStrokeStyle(fillStyle, strokeStyle);
    polygonReplay.drawPolygon(geometry, feature2);
  }
  const textStyle = style.getText();
  if (textStyle && textStyle.getText()) {
    const textReplay = (declutterBuilderGroup || builderGroup).getBuilder(
      style.getZIndex(),
      "Text"
    );
    textReplay.setTextStyle(textStyle);
    textReplay.drawText(geometry, feature2);
  }
}
class CanvasVectorLayerRenderer extends CanvasLayerRenderer$1 {
  constructor(vectorLayer) {
    super(vectorLayer);
    this.boundHandleStyleImageChange_ = this.handleStyleImageChange_.bind(this);
    this.animatingOrInteracting_;
    this.hitDetectionImageData_ = null;
    this.renderedFeatures_ = null;
    this.renderedRevision_ = -1;
    this.renderedResolution_ = NaN;
    this.renderedExtent_ = createEmpty();
    this.wrappedRenderedExtent_ = createEmpty();
    this.renderedRotation_;
    this.renderedCenter_ = null;
    this.renderedProjection_ = null;
    this.renderedRenderOrder_ = null;
    this.replayGroup_ = null;
    this.replayGroupChanged = true;
    this.declutterExecutorGroup = null;
    this.clipping = true;
    this.compositionContext_ = null;
    this.opacity_ = 1;
  }
  renderWorlds(executorGroup, frameState, declutterTree) {
    const extent = frameState.extent;
    const viewState = frameState.viewState;
    const center = viewState.center;
    const resolution = viewState.resolution;
    const projection = viewState.projection;
    const rotation = viewState.rotation;
    const projectionExtent = projection.getExtent();
    const vectorSource = this.getLayer().getSource();
    const pixelRatio = frameState.pixelRatio;
    const viewHints = frameState.viewHints;
    const snapToPixel = !(viewHints[ViewHint.ANIMATING] || viewHints[ViewHint.INTERACTING]);
    const context = this.compositionContext_;
    const width = Math.round(frameState.size[0] * pixelRatio);
    const height = Math.round(frameState.size[1] * pixelRatio);
    const multiWorld = vectorSource.getWrapX() && projection.canWrapX();
    const worldWidth = multiWorld ? getWidth(projectionExtent) : null;
    const endWorld = multiWorld ? Math.ceil((extent[2] - projectionExtent[2]) / worldWidth) + 1 : 1;
    let world = multiWorld ? Math.floor((extent[0] - projectionExtent[0]) / worldWidth) : 0;
    do {
      const transform2 = this.getRenderTransform(
        center,
        resolution,
        rotation,
        pixelRatio,
        width,
        height,
        world * worldWidth
      );
      executorGroup.execute(
        context,
        1,
        transform2,
        rotation,
        snapToPixel,
        void 0,
        declutterTree
      );
    } while (++world < endWorld);
  }
  setupCompositionContext_() {
    if (this.opacity_ !== 1) {
      const compositionContext = createCanvasContext2D(
        this.context.canvas.width,
        this.context.canvas.height,
        canvasPool$1
      );
      this.compositionContext_ = compositionContext;
    } else {
      this.compositionContext_ = this.context;
    }
  }
  releaseCompositionContext_() {
    if (this.opacity_ !== 1) {
      const alpha = this.context.globalAlpha;
      this.context.globalAlpha = this.opacity_;
      this.context.drawImage(this.compositionContext_.canvas, 0, 0);
      this.context.globalAlpha = alpha;
      releaseCanvas$1(this.compositionContext_);
      canvasPool$1.push(this.compositionContext_.canvas);
      this.compositionContext_ = null;
    }
  }
  renderDeclutter(frameState) {
    if (this.declutterExecutorGroup) {
      this.setupCompositionContext_();
      this.renderWorlds(
        this.declutterExecutorGroup,
        frameState,
        frameState.declutterTree
      );
      this.releaseCompositionContext_();
    }
  }
  renderFrame(frameState, target) {
    const pixelRatio = frameState.pixelRatio;
    const layerState = frameState.layerStatesArray[frameState.layerIndex];
    makeScale(this.pixelTransform, 1 / pixelRatio, 1 / pixelRatio);
    makeInverse(this.inversePixelTransform, this.pixelTransform);
    const canvasTransform = toString(this.pixelTransform);
    this.useContainer(target, canvasTransform, this.getBackground(frameState));
    const context = this.context;
    const canvas = context.canvas;
    const replayGroup = this.replayGroup_;
    const declutterExecutorGroup = this.declutterExecutorGroup;
    if ((!replayGroup || replayGroup.isEmpty()) && (!declutterExecutorGroup || declutterExecutorGroup.isEmpty())) {
      return null;
    }
    const width = Math.round(frameState.size[0] * pixelRatio);
    const height = Math.round(frameState.size[1] * pixelRatio);
    if (canvas.width != width || canvas.height != height) {
      canvas.width = width;
      canvas.height = height;
      if (canvas.style.transform !== canvasTransform) {
        canvas.style.transform = canvasTransform;
      }
    } else if (!this.containerReused) {
      context.clearRect(0, 0, width, height);
    }
    this.preRender(context, frameState);
    const viewState = frameState.viewState;
    viewState.projection;
    this.opacity_ = layerState.opacity;
    this.setupCompositionContext_();
    let clipped = false;
    let render2 = true;
    if (layerState.extent && this.clipping) {
      const layerExtent = fromUserExtent(layerState.extent);
      render2 = intersects$2(layerExtent, frameState.extent);
      clipped = render2 && !containsExtent(layerExtent, frameState.extent);
      if (clipped) {
        this.clipUnrotated(this.compositionContext_, frameState, layerExtent);
      }
    }
    if (render2) {
      this.renderWorlds(replayGroup, frameState);
    }
    if (clipped) {
      this.compositionContext_.restore();
    }
    this.releaseCompositionContext_();
    this.postRender(context, frameState);
    if (this.renderedRotation_ !== viewState.rotation) {
      this.renderedRotation_ = viewState.rotation;
      this.hitDetectionImageData_ = null;
    }
    return this.container;
  }
  getFeatures(pixel) {
    return new Promise(
      function(resolve) {
        if (!this.hitDetectionImageData_ && !this.animatingOrInteracting_) {
          const size = [this.context.canvas.width, this.context.canvas.height];
          apply(this.pixelTransform, size);
          const center = this.renderedCenter_;
          const resolution = this.renderedResolution_;
          const rotation = this.renderedRotation_;
          const projection = this.renderedProjection_;
          const extent = this.wrappedRenderedExtent_;
          const layer = this.getLayer();
          const transforms2 = [];
          const width = size[0] * HIT_DETECT_RESOLUTION;
          const height = size[1] * HIT_DETECT_RESOLUTION;
          transforms2.push(
            this.getRenderTransform(
              center,
              resolution,
              rotation,
              HIT_DETECT_RESOLUTION,
              width,
              height,
              0
            ).slice()
          );
          const source = layer.getSource();
          const projectionExtent = projection.getExtent();
          if (source.getWrapX() && projection.canWrapX() && !containsExtent(projectionExtent, extent)) {
            let startX = extent[0];
            const worldWidth = getWidth(projectionExtent);
            let world = 0;
            let offsetX;
            while (startX < projectionExtent[0]) {
              --world;
              offsetX = worldWidth * world;
              transforms2.push(
                this.getRenderTransform(
                  center,
                  resolution,
                  rotation,
                  HIT_DETECT_RESOLUTION,
                  width,
                  height,
                  offsetX
                ).slice()
              );
              startX += worldWidth;
            }
            world = 0;
            startX = extent[2];
            while (startX > projectionExtent[2]) {
              ++world;
              offsetX = worldWidth * world;
              transforms2.push(
                this.getRenderTransform(
                  center,
                  resolution,
                  rotation,
                  HIT_DETECT_RESOLUTION,
                  width,
                  height,
                  offsetX
                ).slice()
              );
              startX -= worldWidth;
            }
          }
          this.hitDetectionImageData_ = createHitDetectionImageData(
            size,
            transforms2,
            this.renderedFeatures_,
            layer.getStyleFunction(),
            extent,
            resolution,
            rotation
          );
        }
        resolve(
          hitDetect(pixel, this.renderedFeatures_, this.hitDetectionImageData_)
        );
      }.bind(this)
    );
  }
  forEachFeatureAtCoordinate(coordinate, frameState, hitTolerance, callback, matches) {
    if (!this.replayGroup_) {
      return void 0;
    }
    const resolution = frameState.viewState.resolution;
    const rotation = frameState.viewState.rotation;
    const layer = this.getLayer();
    const features = {};
    const featureCallback = function(feature2, geometry, distanceSq) {
      const key = getUid(feature2);
      const match = features[key];
      if (!match) {
        if (distanceSq === 0) {
          features[key] = true;
          return callback(feature2, layer, geometry);
        }
        matches.push(
          features[key] = {
            feature: feature2,
            layer,
            geometry,
            distanceSq,
            callback
          }
        );
      } else if (match !== true && distanceSq < match.distanceSq) {
        if (distanceSq === 0) {
          features[key] = true;
          matches.splice(matches.lastIndexOf(match), 1);
          return callback(feature2, layer, geometry);
        }
        match.geometry = geometry;
        match.distanceSq = distanceSq;
      }
      return void 0;
    };
    let result;
    const executorGroups = [this.replayGroup_];
    if (this.declutterExecutorGroup) {
      executorGroups.push(this.declutterExecutorGroup);
    }
    executorGroups.some((executorGroup) => {
      return result = executorGroup.forEachFeatureAtCoordinate(
        coordinate,
        resolution,
        rotation,
        hitTolerance,
        featureCallback,
        executorGroup === this.declutterExecutorGroup && frameState.declutterTree ? frameState.declutterTree.all().map((item) => item.value) : null
      );
    });
    return result;
  }
  handleFontsChanged() {
    const layer = this.getLayer();
    if (layer.getVisible() && this.replayGroup_) {
      layer.changed();
    }
  }
  handleStyleImageChange_(event) {
    this.renderIfReadyAndVisible();
  }
  prepareFrame(frameState) {
    const vectorLayer = this.getLayer();
    const vectorSource = vectorLayer.getSource();
    if (!vectorSource) {
      return false;
    }
    const animating = frameState.viewHints[ViewHint.ANIMATING];
    const interacting = frameState.viewHints[ViewHint.INTERACTING];
    const updateWhileAnimating = vectorLayer.getUpdateWhileAnimating();
    const updateWhileInteracting = vectorLayer.getUpdateWhileInteracting();
    if (this.ready && !updateWhileAnimating && animating || !updateWhileInteracting && interacting) {
      this.animatingOrInteracting_ = true;
      return true;
    }
    this.animatingOrInteracting_ = false;
    const frameStateExtent = frameState.extent;
    const viewState = frameState.viewState;
    const projection = viewState.projection;
    const resolution = viewState.resolution;
    const pixelRatio = frameState.pixelRatio;
    const vectorLayerRevision = vectorLayer.getRevision();
    const vectorLayerRenderBuffer = vectorLayer.getRenderBuffer();
    let vectorLayerRenderOrder = vectorLayer.getRenderOrder();
    if (vectorLayerRenderOrder === void 0) {
      vectorLayerRenderOrder = defaultOrder;
    }
    const center = viewState.center.slice();
    const extent = buffer(
      frameStateExtent,
      vectorLayerRenderBuffer * resolution
    );
    const renderedExtent = extent.slice();
    const loadExtents = [extent.slice()];
    const projectionExtent = projection.getExtent();
    if (vectorSource.getWrapX() && projection.canWrapX() && !containsExtent(projectionExtent, frameState.extent)) {
      const worldWidth = getWidth(projectionExtent);
      const gutter = Math.max(getWidth(extent) / 2, worldWidth);
      extent[0] = projectionExtent[0] - gutter;
      extent[2] = projectionExtent[2] + gutter;
      wrapX$1(center, projection);
      const loadExtent = wrapX$2(loadExtents[0], projection);
      if (loadExtent[0] < projectionExtent[0] && loadExtent[2] < projectionExtent[2]) {
        loadExtents.push([
          loadExtent[0] + worldWidth,
          loadExtent[1],
          loadExtent[2] + worldWidth,
          loadExtent[3]
        ]);
      } else if (loadExtent[0] > projectionExtent[0] && loadExtent[2] > projectionExtent[2]) {
        loadExtents.push([
          loadExtent[0] - worldWidth,
          loadExtent[1],
          loadExtent[2] - worldWidth,
          loadExtent[3]
        ]);
      }
    }
    if (this.ready && this.renderedResolution_ == resolution && this.renderedRevision_ == vectorLayerRevision && this.renderedRenderOrder_ == vectorLayerRenderOrder && containsExtent(this.wrappedRenderedExtent_, extent)) {
      if (!equals$1(this.renderedExtent_, renderedExtent)) {
        this.hitDetectionImageData_ = null;
        this.renderedExtent_ = renderedExtent;
      }
      this.renderedCenter_ = center;
      this.replayGroupChanged = false;
      return true;
    }
    this.replayGroup_ = null;
    const replayGroup = new CanvasBuilderGroup(
      getTolerance(resolution, pixelRatio),
      extent,
      resolution,
      pixelRatio
    );
    let declutterBuilderGroup;
    if (this.getLayer().getDeclutter()) {
      declutterBuilderGroup = new CanvasBuilderGroup(
        getTolerance(resolution, pixelRatio),
        extent,
        resolution,
        pixelRatio
      );
    }
    let userTransform;
    {
      for (let i = 0, ii = loadExtents.length; i < ii; ++i) {
        vectorSource.loadFeatures(loadExtents[i], resolution, projection);
      }
    }
    const squaredTolerance = getSquaredTolerance(resolution, pixelRatio);
    let ready = true;
    const render2 = function(feature2) {
      let styles;
      const styleFunction = feature2.getStyleFunction() || vectorLayer.getStyleFunction();
      if (styleFunction) {
        styles = styleFunction(feature2, resolution);
      }
      if (styles) {
        const dirty = this.renderFeature(
          feature2,
          squaredTolerance,
          styles,
          replayGroup,
          userTransform,
          declutterBuilderGroup
        );
        ready = ready && !dirty;
      }
    }.bind(this);
    const userExtent = toUserExtent(extent);
    const features = vectorSource.getFeaturesInExtent(userExtent);
    if (vectorLayerRenderOrder) {
      features.sort(vectorLayerRenderOrder);
    }
    for (let i = 0, ii = features.length; i < ii; ++i) {
      render2(features[i]);
    }
    this.renderedFeatures_ = features;
    this.ready = ready;
    const replayGroupInstructions = replayGroup.finish();
    const executorGroup = new CanvasExecutorGroup(
      extent,
      resolution,
      pixelRatio,
      vectorSource.getOverlaps(),
      replayGroupInstructions,
      vectorLayer.getRenderBuffer()
    );
    if (declutterBuilderGroup) {
      this.declutterExecutorGroup = new CanvasExecutorGroup(
        extent,
        resolution,
        pixelRatio,
        vectorSource.getOverlaps(),
        declutterBuilderGroup.finish(),
        vectorLayer.getRenderBuffer()
      );
    }
    this.renderedResolution_ = resolution;
    this.renderedRevision_ = vectorLayerRevision;
    this.renderedRenderOrder_ = vectorLayerRenderOrder;
    this.renderedExtent_ = renderedExtent;
    this.wrappedRenderedExtent_ = extent;
    this.renderedCenter_ = center;
    this.renderedProjection_ = projection;
    this.replayGroup_ = executorGroup;
    this.hitDetectionImageData_ = null;
    this.replayGroupChanged = true;
    return true;
  }
  renderFeature(feature2, squaredTolerance, styles, builderGroup, transform2, declutterBuilderGroup) {
    if (!styles) {
      return false;
    }
    let loading = false;
    if (Array.isArray(styles)) {
      for (let i = 0, ii = styles.length; i < ii; ++i) {
        loading = renderFeature(
          builderGroup,
          feature2,
          styles[i],
          squaredTolerance,
          this.boundHandleStyleImageChange_,
          transform2,
          declutterBuilderGroup
        ) || loading;
      }
    } else {
      loading = renderFeature(
        builderGroup,
        feature2,
        styles,
        squaredTolerance,
        this.boundHandleStyleImageChange_,
        transform2,
        declutterBuilderGroup
      );
    }
    return loading;
  }
}
const CanvasVectorLayerRenderer$1 = CanvasVectorLayerRenderer;
class VectorLayer extends BaseVectorLayer$1 {
  constructor(options) {
    super(options);
  }
  createRenderer() {
    return new CanvasVectorLayerRenderer$1(this);
  }
}
const LayerVector = VectorLayer;
const CollectionEventType = {
  ADD: "add",
  REMOVE: "remove"
};
const Property$3 = {
  LENGTH: "length"
};
class CollectionEvent extends BaseEvent$1 {
  constructor(type, element, index2) {
    super(type);
    this.element = element;
    this.index = index2;
  }
}
class Collection extends BaseObject$1 {
  constructor(array, options) {
    super();
    this.on;
    this.once;
    this.un;
    options = options || {};
    this.unique_ = !!options.unique;
    this.array_ = array ? array : [];
    if (this.unique_) {
      for (let i = 0, ii = this.array_.length; i < ii; ++i) {
        this.assertUnique_(this.array_[i], i);
      }
    }
    this.updateLength_();
  }
  clear() {
    while (this.getLength() > 0) {
      this.pop();
    }
  }
  extend(arr) {
    for (let i = 0, ii = arr.length; i < ii; ++i) {
      this.push(arr[i]);
    }
    return this;
  }
  forEach(f) {
    const array = this.array_;
    for (let i = 0, ii = array.length; i < ii; ++i) {
      f(array[i], i, array);
    }
  }
  getArray() {
    return this.array_;
  }
  item(index2) {
    return this.array_[index2];
  }
  getLength() {
    return this.get(Property$3.LENGTH);
  }
  insertAt(index2, elem) {
    if (index2 < 0 || index2 > this.getLength()) {
      throw new Error("Index out of bounds: " + index2);
    }
    if (this.unique_) {
      this.assertUnique_(elem);
    }
    this.array_.splice(index2, 0, elem);
    this.updateLength_();
    this.dispatchEvent(
      new CollectionEvent(CollectionEventType.ADD, elem, index2)
    );
  }
  pop() {
    return this.removeAt(this.getLength() - 1);
  }
  push(elem) {
    if (this.unique_) {
      this.assertUnique_(elem);
    }
    const n = this.getLength();
    this.insertAt(n, elem);
    return this.getLength();
  }
  remove(elem) {
    const arr = this.array_;
    for (let i = 0, ii = arr.length; i < ii; ++i) {
      if (arr[i] === elem) {
        return this.removeAt(i);
      }
    }
    return void 0;
  }
  removeAt(index2) {
    if (index2 < 0 || index2 >= this.getLength()) {
      return void 0;
    }
    const prev = this.array_[index2];
    this.array_.splice(index2, 1);
    this.updateLength_();
    this.dispatchEvent(
      new CollectionEvent(CollectionEventType.REMOVE, prev, index2)
    );
    return prev;
  }
  setAt(index2, elem) {
    const n = this.getLength();
    if (index2 >= n) {
      this.insertAt(index2, elem);
      return;
    }
    if (index2 < 0) {
      throw new Error("Index out of bounds: " + index2);
    }
    if (this.unique_) {
      this.assertUnique_(elem, index2);
    }
    const prev = this.array_[index2];
    this.array_[index2] = elem;
    this.dispatchEvent(
      new CollectionEvent(CollectionEventType.REMOVE, prev, index2)
    );
    this.dispatchEvent(
      new CollectionEvent(CollectionEventType.ADD, elem, index2)
    );
  }
  updateLength_() {
    this.set(Property$3.LENGTH, this.array_.length);
  }
  assertUnique_(elem, except) {
    for (let i = 0, ii = this.array_.length; i < ii; ++i) {
      if (this.array_[i] === elem && i !== except) {
        throw new AssertionError$1(58);
      }
    }
  }
}
const Collection$1 = Collection;
class RBush {
  constructor(maxEntries) {
    this.rbush_ = new RBush$2(maxEntries);
    this.items_ = {};
  }
  insert(extent, value) {
    const item = {
      minX: extent[0],
      minY: extent[1],
      maxX: extent[2],
      maxY: extent[3],
      value
    };
    this.rbush_.insert(item);
    this.items_[getUid(value)] = item;
  }
  load(extents, values) {
    const items = new Array(values.length);
    for (let i = 0, l = values.length; i < l; i++) {
      const extent = extents[i];
      const value = values[i];
      const item = {
        minX: extent[0],
        minY: extent[1],
        maxX: extent[2],
        maxY: extent[3],
        value
      };
      items[i] = item;
      this.items_[getUid(value)] = item;
    }
    this.rbush_.load(items);
  }
  remove(value) {
    const uid = getUid(value);
    const item = this.items_[uid];
    delete this.items_[uid];
    return this.rbush_.remove(item) !== null;
  }
  update(extent, value) {
    const item = this.items_[getUid(value)];
    const bbox = [item.minX, item.minY, item.maxX, item.maxY];
    if (!equals$3(bbox, extent)) {
      this.remove(value);
      this.insert(extent, value);
    }
  }
  getAll() {
    const items = this.rbush_.all();
    return items.map(function(item) {
      return item.value;
    });
  }
  getInExtent(extent) {
    const bbox = {
      minX: extent[0],
      minY: extent[1],
      maxX: extent[2],
      maxY: extent[3]
    };
    const items = this.rbush_.search(bbox);
    return items.map(function(item) {
      return item.value;
    });
  }
  forEach(callback) {
    return this.forEach_(this.getAll(), callback);
  }
  forEachInExtent(extent, callback) {
    return this.forEach_(this.getInExtent(extent), callback);
  }
  forEach_(values, callback) {
    let result;
    for (let i = 0, l = values.length; i < l; i++) {
      result = callback(values[i]);
      if (result) {
        return result;
      }
    }
    return result;
  }
  isEmpty() {
    return isEmpty$1(this.items_);
  }
  clear() {
    this.rbush_.clear();
    this.items_ = {};
  }
  getExtent(extent) {
    const data = this.rbush_.toJSON();
    return createOrUpdate$2(data.minX, data.minY, data.maxX, data.maxY, extent);
  }
  concat(rbush) {
    this.rbush_.load(rbush.rbush_.all());
    for (const i in rbush.items_) {
      this.items_[i] = rbush.items_[i];
    }
  }
}
const RBush$1 = RBush;
class Source extends BaseObject$1 {
  constructor(options) {
    super();
    this.projection = get$1(options.projection);
    this.attributions_ = adaptAttributions(options.attributions);
    this.attributionsCollapsible_ = options.attributionsCollapsible !== void 0 ? options.attributionsCollapsible : true;
    this.loading = false;
    this.state_ = options.state !== void 0 ? options.state : "ready";
    this.wrapX_ = options.wrapX !== void 0 ? options.wrapX : false;
    this.interpolate_ = !!options.interpolate;
    this.viewResolver = null;
    this.viewRejector = null;
    const self2 = this;
    this.viewPromise_ = new Promise(function(resolve, reject) {
      self2.viewResolver = resolve;
      self2.viewRejector = reject;
    });
  }
  getAttributions() {
    return this.attributions_;
  }
  getAttributionsCollapsible() {
    return this.attributionsCollapsible_;
  }
  getProjection() {
    return this.projection;
  }
  getResolutions() {
    return abstract();
  }
  getView() {
    return this.viewPromise_;
  }
  getState() {
    return this.state_;
  }
  getWrapX() {
    return this.wrapX_;
  }
  getInterpolate() {
    return this.interpolate_;
  }
  refresh() {
    this.changed();
  }
  setAttributions(attributions) {
    this.attributions_ = adaptAttributions(attributions);
    this.changed();
  }
  setState(state) {
    this.state_ = state;
    this.changed();
  }
}
function adaptAttributions(attributionLike) {
  if (!attributionLike) {
    return null;
  }
  if (Array.isArray(attributionLike)) {
    return function(frameState) {
      return attributionLike;
    };
  }
  if (typeof attributionLike === "function") {
    return attributionLike;
  }
  return function(frameState) {
    return [attributionLike];
  };
}
const Source$1 = Source;
const VectorEventType = {
  ADDFEATURE: "addfeature",
  CHANGEFEATURE: "changefeature",
  CLEAR: "clear",
  REMOVEFEATURE: "removefeature",
  FEATURESLOADSTART: "featuresloadstart",
  FEATURESLOADEND: "featuresloadend",
  FEATURESLOADERROR: "featuresloaderror"
};
function all$1(extent, resolution) {
  return [[-Infinity, -Infinity, Infinity, Infinity]];
}
let withCredentials = false;
function loadFeaturesXhr(url, format, extent, resolution, projection, success, failure) {
  const xhr2 = new XMLHttpRequest();
  xhr2.open(
    "GET",
    typeof url === "function" ? url(extent, resolution, projection) : url,
    true
  );
  if (format.getType() == "arraybuffer") {
    xhr2.responseType = "arraybuffer";
  }
  xhr2.withCredentials = withCredentials;
  xhr2.onload = function(event) {
    if (!xhr2.status || xhr2.status >= 200 && xhr2.status < 300) {
      const type = format.getType();
      let source;
      if (type == "json" || type == "text") {
        source = xhr2.responseText;
      } else if (type == "xml") {
        source = xhr2.responseXML;
        if (!source) {
          source = new DOMParser().parseFromString(
            xhr2.responseText,
            "application/xml"
          );
        }
      } else if (type == "arraybuffer") {
        source = xhr2.response;
      }
      if (source) {
        success(
          format.readFeatures(source, {
            extent,
            featureProjection: projection
          }),
          format.readProjection(source)
        );
      } else {
        failure();
      }
    } else {
      failure();
    }
  };
  xhr2.onerror = failure;
  xhr2.send();
}
function xhr(url, format) {
  return function(extent, resolution, projection, success, failure) {
    const source = this;
    loadFeaturesXhr(
      url,
      format,
      extent,
      resolution,
      projection,
      function(features, dataProjection) {
        source.addFeatures(features);
        if (success !== void 0) {
          success(features);
        }
      },
      failure ? failure : VOID
    );
  };
}
class VectorSourceEvent extends BaseEvent$1 {
  constructor(type, feature2, features) {
    super(type);
    this.feature = feature2;
    this.features = features;
  }
}
class VectorSource extends Source$1 {
  constructor(options) {
    options = options || {};
    super({
      attributions: options.attributions,
      interpolate: true,
      projection: void 0,
      state: "ready",
      wrapX: options.wrapX !== void 0 ? options.wrapX : true
    });
    this.on;
    this.once;
    this.un;
    this.loader_ = VOID;
    this.format_ = options.format;
    this.overlaps_ = options.overlaps === void 0 ? true : options.overlaps;
    this.url_ = options.url;
    if (options.loader !== void 0) {
      this.loader_ = options.loader;
    } else if (this.url_ !== void 0) {
      assert(this.format_, 7);
      this.loader_ = xhr(
        this.url_,
        this.format_
      );
    }
    this.strategy_ = options.strategy !== void 0 ? options.strategy : all$1;
    const useSpatialIndex = options.useSpatialIndex !== void 0 ? options.useSpatialIndex : true;
    this.featuresRtree_ = useSpatialIndex ? new RBush$1() : null;
    this.loadedExtentsRtree_ = new RBush$1();
    this.loadingExtentsCount_ = 0;
    this.nullGeometryFeatures_ = {};
    this.idIndex_ = {};
    this.uidIndex_ = {};
    this.featureChangeKeys_ = {};
    this.featuresCollection_ = null;
    let collection;
    let features;
    if (Array.isArray(options.features)) {
      features = options.features;
    } else if (options.features) {
      collection = options.features;
      features = collection.getArray();
    }
    if (!useSpatialIndex && collection === void 0) {
      collection = new Collection$1(features);
    }
    if (features !== void 0) {
      this.addFeaturesInternal(features);
    }
    if (collection !== void 0) {
      this.bindFeaturesCollection_(collection);
    }
  }
  addFeature(feature2) {
    this.addFeatureInternal(feature2);
    this.changed();
  }
  addFeatureInternal(feature2) {
    const featureKey = getUid(feature2);
    if (!this.addToIndex_(featureKey, feature2)) {
      if (this.featuresCollection_) {
        this.featuresCollection_.remove(feature2);
      }
      return;
    }
    this.setupChangeEvents_(featureKey, feature2);
    const geometry = feature2.getGeometry();
    if (geometry) {
      const extent = geometry.getExtent();
      if (this.featuresRtree_) {
        this.featuresRtree_.insert(extent, feature2);
      }
    } else {
      this.nullGeometryFeatures_[featureKey] = feature2;
    }
    this.dispatchEvent(
      new VectorSourceEvent(VectorEventType.ADDFEATURE, feature2)
    );
  }
  setupChangeEvents_(featureKey, feature2) {
    this.featureChangeKeys_[featureKey] = [
      listen(feature2, EventType.CHANGE, this.handleFeatureChange_, this),
      listen(
        feature2,
        ObjectEventType.PROPERTYCHANGE,
        this.handleFeatureChange_,
        this
      )
    ];
  }
  addToIndex_(featureKey, feature2) {
    let valid = true;
    const id = feature2.getId();
    if (id !== void 0) {
      if (!(id.toString() in this.idIndex_)) {
        this.idIndex_[id.toString()] = feature2;
      } else {
        valid = false;
      }
    }
    if (valid) {
      assert(!(featureKey in this.uidIndex_), 30);
      this.uidIndex_[featureKey] = feature2;
    }
    return valid;
  }
  addFeatures(features) {
    this.addFeaturesInternal(features);
    this.changed();
  }
  addFeaturesInternal(features) {
    const extents = [];
    const newFeatures = [];
    const geometryFeatures = [];
    for (let i = 0, length = features.length; i < length; i++) {
      const feature2 = features[i];
      const featureKey = getUid(feature2);
      if (this.addToIndex_(featureKey, feature2)) {
        newFeatures.push(feature2);
      }
    }
    for (let i = 0, length = newFeatures.length; i < length; i++) {
      const feature2 = newFeatures[i];
      const featureKey = getUid(feature2);
      this.setupChangeEvents_(featureKey, feature2);
      const geometry = feature2.getGeometry();
      if (geometry) {
        const extent = geometry.getExtent();
        extents.push(extent);
        geometryFeatures.push(feature2);
      } else {
        this.nullGeometryFeatures_[featureKey] = feature2;
      }
    }
    if (this.featuresRtree_) {
      this.featuresRtree_.load(extents, geometryFeatures);
    }
    if (this.hasListener(VectorEventType.ADDFEATURE)) {
      for (let i = 0, length = newFeatures.length; i < length; i++) {
        this.dispatchEvent(
          new VectorSourceEvent(VectorEventType.ADDFEATURE, newFeatures[i])
        );
      }
    }
  }
  bindFeaturesCollection_(collection) {
    let modifyingCollection = false;
    this.addEventListener(
      VectorEventType.ADDFEATURE,
      function(evt) {
        if (!modifyingCollection) {
          modifyingCollection = true;
          collection.push(evt.feature);
          modifyingCollection = false;
        }
      }
    );
    this.addEventListener(
      VectorEventType.REMOVEFEATURE,
      function(evt) {
        if (!modifyingCollection) {
          modifyingCollection = true;
          collection.remove(evt.feature);
          modifyingCollection = false;
        }
      }
    );
    collection.addEventListener(
      CollectionEventType.ADD,
      function(evt) {
        if (!modifyingCollection) {
          modifyingCollection = true;
          this.addFeature(evt.element);
          modifyingCollection = false;
        }
      }.bind(this)
    );
    collection.addEventListener(
      CollectionEventType.REMOVE,
      function(evt) {
        if (!modifyingCollection) {
          modifyingCollection = true;
          this.removeFeature(evt.element);
          modifyingCollection = false;
        }
      }.bind(this)
    );
    this.featuresCollection_ = collection;
  }
  clear(fast) {
    if (fast) {
      for (const featureId in this.featureChangeKeys_) {
        const keys = this.featureChangeKeys_[featureId];
        keys.forEach(unlistenByKey);
      }
      if (!this.featuresCollection_) {
        this.featureChangeKeys_ = {};
        this.idIndex_ = {};
        this.uidIndex_ = {};
      }
    } else {
      if (this.featuresRtree_) {
        const removeAndIgnoreReturn = function(feature2) {
          this.removeFeatureInternal(feature2);
        }.bind(this);
        this.featuresRtree_.forEach(removeAndIgnoreReturn);
        for (const id in this.nullGeometryFeatures_) {
          this.removeFeatureInternal(this.nullGeometryFeatures_[id]);
        }
      }
    }
    if (this.featuresCollection_) {
      this.featuresCollection_.clear();
    }
    if (this.featuresRtree_) {
      this.featuresRtree_.clear();
    }
    this.nullGeometryFeatures_ = {};
    const clearEvent = new VectorSourceEvent(VectorEventType.CLEAR);
    this.dispatchEvent(clearEvent);
    this.changed();
  }
  forEachFeature(callback) {
    if (this.featuresRtree_) {
      return this.featuresRtree_.forEach(callback);
    } else if (this.featuresCollection_) {
      this.featuresCollection_.forEach(callback);
    }
  }
  forEachFeatureAtCoordinateDirect(coordinate, callback) {
    const extent = [coordinate[0], coordinate[1], coordinate[0], coordinate[1]];
    return this.forEachFeatureInExtent(extent, function(feature2) {
      const geometry = feature2.getGeometry();
      if (geometry.intersectsCoordinate(coordinate)) {
        return callback(feature2);
      } else {
        return void 0;
      }
    });
  }
  forEachFeatureInExtent(extent, callback) {
    if (this.featuresRtree_) {
      return this.featuresRtree_.forEachInExtent(extent, callback);
    } else if (this.featuresCollection_) {
      this.featuresCollection_.forEach(callback);
    }
  }
  forEachFeatureIntersectingExtent(extent, callback) {
    return this.forEachFeatureInExtent(
      extent,
      function(feature2) {
        const geometry = feature2.getGeometry();
        if (geometry.intersectsExtent(extent)) {
          const result = callback(feature2);
          if (result) {
            return result;
          }
        }
      }
    );
  }
  getFeaturesCollection() {
    return this.featuresCollection_;
  }
  getFeatures() {
    let features;
    if (this.featuresCollection_) {
      features = this.featuresCollection_.getArray().slice(0);
    } else if (this.featuresRtree_) {
      features = this.featuresRtree_.getAll();
      if (!isEmpty$1(this.nullGeometryFeatures_)) {
        extend$1(features, Object.values(this.nullGeometryFeatures_));
      }
    }
    return features;
  }
  getFeaturesAtCoordinate(coordinate) {
    const features = [];
    this.forEachFeatureAtCoordinateDirect(coordinate, function(feature2) {
      features.push(feature2);
    });
    return features;
  }
  getFeaturesInExtent(extent, projection) {
    if (this.featuresRtree_) {
      const multiWorld = projection && projection.canWrapX() && this.getWrapX();
      if (!multiWorld) {
        return this.featuresRtree_.getInExtent(extent);
      }
      const extents = wrapAndSliceX(extent, projection);
      return [].concat(
        ...extents.map((anExtent) => this.featuresRtree_.getInExtent(anExtent))
      );
    } else if (this.featuresCollection_) {
      return this.featuresCollection_.getArray().slice(0);
    } else {
      return [];
    }
  }
  getClosestFeatureToCoordinate(coordinate, filter) {
    const x = coordinate[0];
    const y = coordinate[1];
    let closestFeature = null;
    const closestPoint = [NaN, NaN];
    let minSquaredDistance = Infinity;
    const extent = [-Infinity, -Infinity, Infinity, Infinity];
    filter = filter ? filter : TRUE;
    this.featuresRtree_.forEachInExtent(
      extent,
      function(feature2) {
        if (filter(feature2)) {
          const geometry = feature2.getGeometry();
          const previousMinSquaredDistance = minSquaredDistance;
          minSquaredDistance = geometry.closestPointXY(
            x,
            y,
            closestPoint,
            minSquaredDistance
          );
          if (minSquaredDistance < previousMinSquaredDistance) {
            closestFeature = feature2;
            const minDistance = Math.sqrt(minSquaredDistance);
            extent[0] = x - minDistance;
            extent[1] = y - minDistance;
            extent[2] = x + minDistance;
            extent[3] = y + minDistance;
          }
        }
      }
    );
    return closestFeature;
  }
  getExtent(extent) {
    return this.featuresRtree_.getExtent(extent);
  }
  getFeatureById(id) {
    const feature2 = this.idIndex_[id.toString()];
    return feature2 !== void 0 ? feature2 : null;
  }
  getFeatureByUid(uid) {
    const feature2 = this.uidIndex_[uid];
    return feature2 !== void 0 ? feature2 : null;
  }
  getFormat() {
    return this.format_;
  }
  getOverlaps() {
    return this.overlaps_;
  }
  getUrl() {
    return this.url_;
  }
  handleFeatureChange_(event) {
    const feature2 = event.target;
    const featureKey = getUid(feature2);
    const geometry = feature2.getGeometry();
    if (!geometry) {
      if (!(featureKey in this.nullGeometryFeatures_)) {
        if (this.featuresRtree_) {
          this.featuresRtree_.remove(feature2);
        }
        this.nullGeometryFeatures_[featureKey] = feature2;
      }
    } else {
      const extent = geometry.getExtent();
      if (featureKey in this.nullGeometryFeatures_) {
        delete this.nullGeometryFeatures_[featureKey];
        if (this.featuresRtree_) {
          this.featuresRtree_.insert(extent, feature2);
        }
      } else {
        if (this.featuresRtree_) {
          this.featuresRtree_.update(extent, feature2);
        }
      }
    }
    const id = feature2.getId();
    if (id !== void 0) {
      const sid = id.toString();
      if (this.idIndex_[sid] !== feature2) {
        this.removeFromIdIndex_(feature2);
        this.idIndex_[sid] = feature2;
      }
    } else {
      this.removeFromIdIndex_(feature2);
      this.uidIndex_[featureKey] = feature2;
    }
    this.changed();
    this.dispatchEvent(
      new VectorSourceEvent(VectorEventType.CHANGEFEATURE, feature2)
    );
  }
  hasFeature(feature2) {
    const id = feature2.getId();
    if (id !== void 0) {
      return id in this.idIndex_;
    } else {
      return getUid(feature2) in this.uidIndex_;
    }
  }
  isEmpty() {
    if (this.featuresRtree_) {
      return this.featuresRtree_.isEmpty() && isEmpty$1(this.nullGeometryFeatures_);
    }
    if (this.featuresCollection_) {
      return this.featuresCollection_.getLength() === 0;
    }
    return true;
  }
  loadFeatures(extent, resolution, projection) {
    const loadedExtentsRtree = this.loadedExtentsRtree_;
    const extentsToLoad = this.strategy_(extent, resolution, projection);
    for (let i = 0, ii = extentsToLoad.length; i < ii; ++i) {
      const extentToLoad = extentsToLoad[i];
      const alreadyLoaded = loadedExtentsRtree.forEachInExtent(
        extentToLoad,
        function(object) {
          return containsExtent(object.extent, extentToLoad);
        }
      );
      if (!alreadyLoaded) {
        ++this.loadingExtentsCount_;
        this.dispatchEvent(
          new VectorSourceEvent(VectorEventType.FEATURESLOADSTART)
        );
        this.loader_.call(
          this,
          extentToLoad,
          resolution,
          projection,
          function(features) {
            --this.loadingExtentsCount_;
            this.dispatchEvent(
              new VectorSourceEvent(
                VectorEventType.FEATURESLOADEND,
                void 0,
                features
              )
            );
          }.bind(this),
          function() {
            --this.loadingExtentsCount_;
            this.dispatchEvent(
              new VectorSourceEvent(VectorEventType.FEATURESLOADERROR)
            );
          }.bind(this)
        );
        loadedExtentsRtree.insert(extentToLoad, { extent: extentToLoad.slice() });
      }
    }
    this.loading = this.loader_.length < 4 ? false : this.loadingExtentsCount_ > 0;
  }
  refresh() {
    this.clear(true);
    this.loadedExtentsRtree_.clear();
    super.refresh();
  }
  removeLoadedExtent(extent) {
    const loadedExtentsRtree = this.loadedExtentsRtree_;
    let obj;
    loadedExtentsRtree.forEachInExtent(extent, function(object) {
      if (equals$3(object.extent, extent)) {
        obj = object;
        return true;
      }
    });
    if (obj) {
      loadedExtentsRtree.remove(obj);
    }
  }
  removeFeature(feature2) {
    if (!feature2) {
      return;
    }
    const featureKey = getUid(feature2);
    if (featureKey in this.nullGeometryFeatures_) {
      delete this.nullGeometryFeatures_[featureKey];
    } else {
      if (this.featuresRtree_) {
        this.featuresRtree_.remove(feature2);
      }
    }
    const result = this.removeFeatureInternal(feature2);
    if (result) {
      this.changed();
    }
  }
  removeFeatureInternal(feature2) {
    const featureKey = getUid(feature2);
    const featureChangeKeys = this.featureChangeKeys_[featureKey];
    if (!featureChangeKeys) {
      return;
    }
    featureChangeKeys.forEach(unlistenByKey);
    delete this.featureChangeKeys_[featureKey];
    const id = feature2.getId();
    if (id !== void 0) {
      delete this.idIndex_[id.toString()];
    }
    delete this.uidIndex_[featureKey];
    this.dispatchEvent(
      new VectorSourceEvent(VectorEventType.REMOVEFEATURE, feature2)
    );
    return feature2;
  }
  removeFromIdIndex_(feature2) {
    let removed = false;
    for (const id in this.idIndex_) {
      if (this.idIndex_[id] === feature2) {
        delete this.idIndex_[id];
        removed = true;
        break;
      }
    }
    return removed;
  }
  setLoader(loader) {
    this.loader_ = loader;
  }
  setUrl(url) {
    assert(this.format_, 7);
    this.url_ = url;
    this.setLoader(xhr(url, this.format_));
  }
}
const VectorSource$1 = VectorSource;
class Feature extends BaseObject$1 {
  constructor(geometryOrProperties) {
    super();
    this.on;
    this.once;
    this.un;
    this.id_ = void 0;
    this.geometryName_ = "geometry";
    this.style_ = null;
    this.styleFunction_ = void 0;
    this.geometryChangeKey_ = null;
    this.addChangeListener(this.geometryName_, this.handleGeometryChanged_);
    if (geometryOrProperties) {
      if (typeof geometryOrProperties.getSimplifiedGeometry === "function") {
        const geometry = geometryOrProperties;
        this.setGeometry(geometry);
      } else {
        const properties = geometryOrProperties;
        this.setProperties(properties);
      }
    }
  }
  clone() {
    const clone2 = new Feature(this.hasProperties() ? this.getProperties() : null);
    clone2.setGeometryName(this.getGeometryName());
    const geometry = this.getGeometry();
    if (geometry) {
      clone2.setGeometry(geometry.clone());
    }
    const style = this.getStyle();
    if (style) {
      clone2.setStyle(style);
    }
    return clone2;
  }
  getGeometry() {
    return this.get(this.geometryName_);
  }
  getId() {
    return this.id_;
  }
  getGeometryName() {
    return this.geometryName_;
  }
  getStyle() {
    return this.style_;
  }
  getStyleFunction() {
    return this.styleFunction_;
  }
  handleGeometryChange_() {
    this.changed();
  }
  handleGeometryChanged_() {
    if (this.geometryChangeKey_) {
      unlistenByKey(this.geometryChangeKey_);
      this.geometryChangeKey_ = null;
    }
    const geometry = this.getGeometry();
    if (geometry) {
      this.geometryChangeKey_ = listen(
        geometry,
        EventType.CHANGE,
        this.handleGeometryChange_,
        this
      );
    }
    this.changed();
  }
  setGeometry(geometry) {
    this.set(this.geometryName_, geometry);
  }
  setStyle(style) {
    this.style_ = style;
    this.styleFunction_ = !style ? void 0 : createStyleFunction(style);
    this.changed();
  }
  setId(id) {
    this.id_ = id;
    this.changed();
  }
  setGeometryName(name) {
    this.removeChangeListener(this.geometryName_, this.handleGeometryChanged_);
    this.geometryName_ = name;
    this.addChangeListener(this.geometryName_, this.handleGeometryChanged_);
    this.handleGeometryChanged_();
  }
}
function createStyleFunction(obj) {
  if (typeof obj === "function") {
    return obj;
  } else {
    let styles;
    if (Array.isArray(obj)) {
      styles = obj;
    } else {
      assert(typeof obj.getZIndex === "function", 41);
      const style = obj;
      styles = [style];
    }
    return function() {
      return styles;
    };
  }
}
const feature = Feature;
class GeometryCollection extends Geometry$1 {
  constructor(geometries) {
    super();
    this.geometries_ = geometries ? geometries : null;
    this.changeEventsKeys_ = [];
    this.listenGeometriesChange_();
  }
  unlistenGeometriesChange_() {
    this.changeEventsKeys_.forEach(unlistenByKey);
    this.changeEventsKeys_.length = 0;
  }
  listenGeometriesChange_() {
    if (!this.geometries_) {
      return;
    }
    for (let i = 0, ii = this.geometries_.length; i < ii; ++i) {
      this.changeEventsKeys_.push(
        listen(this.geometries_[i], EventType.CHANGE, this.changed, this)
      );
    }
  }
  clone() {
    const geometryCollection = new GeometryCollection(null);
    geometryCollection.setGeometries(this.geometries_);
    geometryCollection.applyProperties(this);
    return geometryCollection;
  }
  closestPointXY(x, y, closestPoint, minSquaredDistance) {
    if (minSquaredDistance < closestSquaredDistanceXY(this.getExtent(), x, y)) {
      return minSquaredDistance;
    }
    const geometries = this.geometries_;
    for (let i = 0, ii = geometries.length; i < ii; ++i) {
      minSquaredDistance = geometries[i].closestPointXY(
        x,
        y,
        closestPoint,
        minSquaredDistance
      );
    }
    return minSquaredDistance;
  }
  containsXY(x, y) {
    const geometries = this.geometries_;
    for (let i = 0, ii = geometries.length; i < ii; ++i) {
      if (geometries[i].containsXY(x, y)) {
        return true;
      }
    }
    return false;
  }
  computeExtent(extent) {
    createOrUpdateEmpty(extent);
    const geometries = this.geometries_;
    for (let i = 0, ii = geometries.length; i < ii; ++i) {
      extend$2(extent, geometries[i].getExtent());
    }
    return extent;
  }
  getGeometries() {
    return cloneGeometries(this.geometries_);
  }
  getGeometriesArray() {
    return this.geometries_;
  }
  getGeometriesArrayRecursive() {
    let geometriesArray = [];
    const geometries = this.geometries_;
    for (let i = 0, ii = geometries.length; i < ii; ++i) {
      if (geometries[i].getType() === this.getType()) {
        geometriesArray = geometriesArray.concat(
          geometries[i].getGeometriesArrayRecursive()
        );
      } else {
        geometriesArray.push(geometries[i]);
      }
    }
    return geometriesArray;
  }
  getSimplifiedGeometry(squaredTolerance) {
    if (this.simplifiedGeometryRevision !== this.getRevision()) {
      this.simplifiedGeometryMaxMinSquaredTolerance = 0;
      this.simplifiedGeometryRevision = this.getRevision();
    }
    if (squaredTolerance < 0 || this.simplifiedGeometryMaxMinSquaredTolerance !== 0 && squaredTolerance < this.simplifiedGeometryMaxMinSquaredTolerance) {
      return this;
    }
    const simplifiedGeometries = [];
    const geometries = this.geometries_;
    let simplified = false;
    for (let i = 0, ii = geometries.length; i < ii; ++i) {
      const geometry = geometries[i];
      const simplifiedGeometry = geometry.getSimplifiedGeometry(squaredTolerance);
      simplifiedGeometries.push(simplifiedGeometry);
      if (simplifiedGeometry !== geometry) {
        simplified = true;
      }
    }
    if (simplified) {
      const simplifiedGeometryCollection = new GeometryCollection(null);
      simplifiedGeometryCollection.setGeometriesArray(simplifiedGeometries);
      return simplifiedGeometryCollection;
    } else {
      this.simplifiedGeometryMaxMinSquaredTolerance = squaredTolerance;
      return this;
    }
  }
  getType() {
    return "GeometryCollection";
  }
  intersectsExtent(extent) {
    const geometries = this.geometries_;
    for (let i = 0, ii = geometries.length; i < ii; ++i) {
      if (geometries[i].intersectsExtent(extent)) {
        return true;
      }
    }
    return false;
  }
  isEmpty() {
    return this.geometries_.length === 0;
  }
  rotate(angle, anchor) {
    const geometries = this.geometries_;
    for (let i = 0, ii = geometries.length; i < ii; ++i) {
      geometries[i].rotate(angle, anchor);
    }
    this.changed();
  }
  scale(sx, sy, anchor) {
    if (!anchor) {
      anchor = getCenter(this.getExtent());
    }
    const geometries = this.geometries_;
    for (let i = 0, ii = geometries.length; i < ii; ++i) {
      geometries[i].scale(sx, sy, anchor);
    }
    this.changed();
  }
  setGeometries(geometries) {
    this.setGeometriesArray(cloneGeometries(geometries));
  }
  setGeometriesArray(geometries) {
    this.unlistenGeometriesChange_();
    this.geometries_ = geometries;
    this.listenGeometriesChange_();
    this.changed();
  }
  applyTransform(transformFn) {
    const geometries = this.geometries_;
    for (let i = 0, ii = geometries.length; i < ii; ++i) {
      geometries[i].applyTransform(transformFn);
    }
    this.changed();
  }
  translate(deltaX, deltaY) {
    const geometries = this.geometries_;
    for (let i = 0, ii = geometries.length; i < ii; ++i) {
      geometries[i].translate(deltaX, deltaY);
    }
    this.changed();
  }
  disposeInternal() {
    this.unlistenGeometriesChange_();
    super.disposeInternal();
  }
}
function cloneGeometries(geometries) {
  const clonedGeometries = [];
  for (let i = 0, ii = geometries.length; i < ii; ++i) {
    clonedGeometries.push(geometries[i].clone());
  }
  return clonedGeometries;
}
const GeometryCollection$1 = GeometryCollection;
class FeatureFormat {
  constructor() {
    this.dataProjection = void 0;
    this.defaultFeatureProjection = void 0;
    this.supportedMediaTypes = null;
  }
  getReadOptions(source, options) {
    if (options) {
      let dataProjection = options.dataProjection ? get$1(options.dataProjection) : this.readProjection(source);
      if (options.extent && dataProjection && dataProjection.getUnits() === "tile-pixels") {
        dataProjection = get$1(dataProjection);
        dataProjection.setWorldExtent(options.extent);
      }
      options = {
        dataProjection,
        featureProjection: options.featureProjection
      };
    }
    return this.adaptOptions(options);
  }
  adaptOptions(options) {
    return Object.assign(
      {
        dataProjection: this.dataProjection,
        featureProjection: this.defaultFeatureProjection
      },
      options
    );
  }
  getType() {
    return abstract();
  }
  readFeature(source, options) {
    return abstract();
  }
  readFeatures(source, options) {
    return abstract();
  }
  readGeometry(source, options) {
    return abstract();
  }
  readProjection(source) {
    return abstract();
  }
  writeFeature(feature2, options) {
    return abstract();
  }
  writeFeatures(features, options) {
    return abstract();
  }
  writeGeometry(geometry, options) {
    return abstract();
  }
}
function transformGeometryWithOptions(geometry, write, options) {
  const featureProjection = options ? get$1(options.featureProjection) : null;
  const dataProjection = options ? get$1(options.dataProjection) : null;
  let transformed;
  if (featureProjection && dataProjection && !equivalent(featureProjection, dataProjection)) {
    transformed = (write ? geometry.clone() : geometry).transform(
      write ? featureProjection : dataProjection,
      write ? dataProjection : featureProjection
    );
  } else {
    transformed = geometry;
  }
  if (write && options && options.decimals !== void 0) {
    const power = Math.pow(10, options.decimals);
    const transform2 = function(coordinates2) {
      for (let i = 0, ii = coordinates2.length; i < ii; ++i) {
        coordinates2[i] = Math.round(coordinates2[i] * power) / power;
      }
      return coordinates2;
    };
    if (transformed === geometry) {
      transformed = geometry.clone();
    }
    transformed.applyTransform(transform2);
  }
  return transformed;
}
class JSONFeature extends FeatureFormat {
  constructor() {
    super();
  }
  getType() {
    return "json";
  }
  readFeature(source, options) {
    return this.readFeatureFromObject(
      getObject(source),
      this.getReadOptions(source, options)
    );
  }
  readFeatures(source, options) {
    return this.readFeaturesFromObject(
      getObject(source),
      this.getReadOptions(source, options)
    );
  }
  readFeatureFromObject(object, options) {
    return abstract();
  }
  readFeaturesFromObject(object, options) {
    return abstract();
  }
  readGeometry(source, options) {
    return this.readGeometryFromObject(
      getObject(source),
      this.getReadOptions(source, options)
    );
  }
  readGeometryFromObject(object, options) {
    return abstract();
  }
  readProjection(source) {
    return this.readProjectionFromObject(getObject(source));
  }
  readProjectionFromObject(object) {
    return abstract();
  }
  writeFeature(feature2, options) {
    return JSON.stringify(this.writeFeatureObject(feature2, options));
  }
  writeFeatureObject(feature2, options) {
    return abstract();
  }
  writeFeatures(features, options) {
    return JSON.stringify(this.writeFeaturesObject(features, options));
  }
  writeFeaturesObject(features, options) {
    return abstract();
  }
  writeGeometry(geometry, options) {
    return JSON.stringify(this.writeGeometryObject(geometry, options));
  }
  writeGeometryObject(geometry, options) {
    return abstract();
  }
}
function getObject(source) {
  if (typeof source === "string") {
    const object = JSON.parse(source);
    return object ? object : null;
  } else if (source !== null) {
    return source;
  } else {
    return null;
  }
}
const JSONFeature$1 = JSONFeature;
function assignClosest(flatCoordinates, offset1, offset2, stride, x, y, closestPoint) {
  const x1 = flatCoordinates[offset1];
  const y1 = flatCoordinates[offset1 + 1];
  const dx = flatCoordinates[offset2] - x1;
  const dy = flatCoordinates[offset2 + 1] - y1;
  let offset;
  if (dx === 0 && dy === 0) {
    offset = offset1;
  } else {
    const t = ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy);
    if (t > 1) {
      offset = offset2;
    } else if (t > 0) {
      for (let i = 0; i < stride; ++i) {
        closestPoint[i] = lerp(
          flatCoordinates[offset1 + i],
          flatCoordinates[offset2 + i],
          t
        );
      }
      closestPoint.length = stride;
      return;
    } else {
      offset = offset1;
    }
  }
  for (let i = 0; i < stride; ++i) {
    closestPoint[i] = flatCoordinates[offset + i];
  }
  closestPoint.length = stride;
}
function maxSquaredDelta(flatCoordinates, offset, end, stride, max) {
  let x1 = flatCoordinates[offset];
  let y1 = flatCoordinates[offset + 1];
  for (offset += stride; offset < end; offset += stride) {
    const x2 = flatCoordinates[offset];
    const y2 = flatCoordinates[offset + 1];
    const squaredDelta = squaredDistance$1(x1, y1, x2, y2);
    if (squaredDelta > max) {
      max = squaredDelta;
    }
    x1 = x2;
    y1 = y2;
  }
  return max;
}
function arrayMaxSquaredDelta(flatCoordinates, offset, ends, stride, max) {
  for (let i = 0, ii = ends.length; i < ii; ++i) {
    const end = ends[i];
    max = maxSquaredDelta(flatCoordinates, offset, end, stride, max);
    offset = end;
  }
  return max;
}
function multiArrayMaxSquaredDelta(flatCoordinates, offset, endss, stride, max) {
  for (let i = 0, ii = endss.length; i < ii; ++i) {
    const ends = endss[i];
    max = arrayMaxSquaredDelta(flatCoordinates, offset, ends, stride, max);
    offset = ends[ends.length - 1];
  }
  return max;
}
function assignClosestPoint(flatCoordinates, offset, end, stride, maxDelta, isRing, x, y, closestPoint, minSquaredDistance, tmpPoint) {
  if (offset == end) {
    return minSquaredDistance;
  }
  let i, squaredDistance2;
  if (maxDelta === 0) {
    squaredDistance2 = squaredDistance$1(
      x,
      y,
      flatCoordinates[offset],
      flatCoordinates[offset + 1]
    );
    if (squaredDistance2 < minSquaredDistance) {
      for (i = 0; i < stride; ++i) {
        closestPoint[i] = flatCoordinates[offset + i];
      }
      closestPoint.length = stride;
      return squaredDistance2;
    } else {
      return minSquaredDistance;
    }
  }
  tmpPoint = tmpPoint ? tmpPoint : [NaN, NaN];
  let index2 = offset + stride;
  while (index2 < end) {
    assignClosest(
      flatCoordinates,
      index2 - stride,
      index2,
      stride,
      x,
      y,
      tmpPoint
    );
    squaredDistance2 = squaredDistance$1(x, y, tmpPoint[0], tmpPoint[1]);
    if (squaredDistance2 < minSquaredDistance) {
      minSquaredDistance = squaredDistance2;
      for (i = 0; i < stride; ++i) {
        closestPoint[i] = tmpPoint[i];
      }
      closestPoint.length = stride;
      index2 += stride;
    } else {
      index2 += stride * Math.max(
        (Math.sqrt(squaredDistance2) - Math.sqrt(minSquaredDistance)) / maxDelta | 0,
        1
      );
    }
  }
  if (isRing) {
    assignClosest(
      flatCoordinates,
      end - stride,
      offset,
      stride,
      x,
      y,
      tmpPoint
    );
    squaredDistance2 = squaredDistance$1(x, y, tmpPoint[0], tmpPoint[1]);
    if (squaredDistance2 < minSquaredDistance) {
      minSquaredDistance = squaredDistance2;
      for (i = 0; i < stride; ++i) {
        closestPoint[i] = tmpPoint[i];
      }
      closestPoint.length = stride;
    }
  }
  return minSquaredDistance;
}
function assignClosestArrayPoint(flatCoordinates, offset, ends, stride, maxDelta, isRing, x, y, closestPoint, minSquaredDistance, tmpPoint) {
  tmpPoint = tmpPoint ? tmpPoint : [NaN, NaN];
  for (let i = 0, ii = ends.length; i < ii; ++i) {
    const end = ends[i];
    minSquaredDistance = assignClosestPoint(
      flatCoordinates,
      offset,
      end,
      stride,
      maxDelta,
      isRing,
      x,
      y,
      closestPoint,
      minSquaredDistance,
      tmpPoint
    );
    offset = end;
  }
  return minSquaredDistance;
}
function assignClosestMultiArrayPoint(flatCoordinates, offset, endss, stride, maxDelta, isRing, x, y, closestPoint, minSquaredDistance, tmpPoint) {
  tmpPoint = tmpPoint ? tmpPoint : [NaN, NaN];
  for (let i = 0, ii = endss.length; i < ii; ++i) {
    const ends = endss[i];
    minSquaredDistance = assignClosestArrayPoint(
      flatCoordinates,
      offset,
      ends,
      stride,
      maxDelta,
      isRing,
      x,
      y,
      closestPoint,
      minSquaredDistance,
      tmpPoint
    );
    offset = ends[ends.length - 1];
  }
  return minSquaredDistance;
}
function deflateCoordinate(flatCoordinates, offset, coordinate, stride) {
  for (let i = 0, ii = coordinate.length; i < ii; ++i) {
    flatCoordinates[offset++] = coordinate[i];
  }
  return offset;
}
function deflateCoordinates(flatCoordinates, offset, coordinates2, stride) {
  for (let i = 0, ii = coordinates2.length; i < ii; ++i) {
    const coordinate = coordinates2[i];
    for (let j = 0; j < stride; ++j) {
      flatCoordinates[offset++] = coordinate[j];
    }
  }
  return offset;
}
function deflateCoordinatesArray(flatCoordinates, offset, coordinatess, stride, ends) {
  ends = ends ? ends : [];
  let i = 0;
  for (let j = 0, jj = coordinatess.length; j < jj; ++j) {
    const end = deflateCoordinates(
      flatCoordinates,
      offset,
      coordinatess[j],
      stride
    );
    ends[i++] = end;
    offset = end;
  }
  ends.length = i;
  return ends;
}
function deflateMultiCoordinatesArray(flatCoordinates, offset, coordinatesss, stride, endss) {
  endss = endss ? endss : [];
  let i = 0;
  for (let j = 0, jj = coordinatesss.length; j < jj; ++j) {
    const ends = deflateCoordinatesArray(
      flatCoordinates,
      offset,
      coordinatesss[j],
      stride,
      endss[i]
    );
    if (ends.length === 0) {
      ends[0] = offset;
    }
    endss[i++] = ends;
    offset = ends[ends.length - 1];
  }
  endss.length = i;
  return endss;
}
function forEach(flatCoordinates, offset, end, stride, callback) {
  let ret;
  offset += stride;
  for (; offset < end; offset += stride) {
    ret = callback(
      flatCoordinates.slice(offset - stride, offset),
      flatCoordinates.slice(offset, offset + stride)
    );
    if (ret) {
      return ret;
    }
  }
  return false;
}
function interpolatePoint(flatCoordinates, offset, end, stride, fraction, dest, dimension) {
  let o, t;
  const n = (end - offset) / stride;
  if (n === 1) {
    o = offset;
  } else if (n === 2) {
    o = offset;
    t = fraction;
  } else if (n !== 0) {
    let x1 = flatCoordinates[offset];
    let y1 = flatCoordinates[offset + 1];
    let length = 0;
    const cumulativeLengths = [0];
    for (let i = offset + stride; i < end; i += stride) {
      const x2 = flatCoordinates[i];
      const y2 = flatCoordinates[i + 1];
      length += Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
      cumulativeLengths.push(length);
      x1 = x2;
      y1 = y2;
    }
    const target = fraction * length;
    const index2 = binarySearch(cumulativeLengths, target);
    if (index2 < 0) {
      t = (target - cumulativeLengths[-index2 - 2]) / (cumulativeLengths[-index2 - 1] - cumulativeLengths[-index2 - 2]);
      o = offset + (-index2 - 2) * stride;
    } else {
      o = offset + index2 * stride;
    }
  }
  dimension = dimension > 1 ? dimension : 2;
  dest = dest ? dest : new Array(dimension);
  for (let i = 0; i < dimension; ++i) {
    dest[i] = o === void 0 ? NaN : t === void 0 ? flatCoordinates[o + i] : lerp(flatCoordinates[o + i], flatCoordinates[o + stride + i], t);
  }
  return dest;
}
function lineStringCoordinateAtM(flatCoordinates, offset, end, stride, m, extrapolate) {
  if (end == offset) {
    return null;
  }
  let coordinate;
  if (m < flatCoordinates[offset + stride - 1]) {
    if (extrapolate) {
      coordinate = flatCoordinates.slice(offset, offset + stride);
      coordinate[stride - 1] = m;
      return coordinate;
    } else {
      return null;
    }
  } else if (flatCoordinates[end - 1] < m) {
    if (extrapolate) {
      coordinate = flatCoordinates.slice(end - stride, end);
      coordinate[stride - 1] = m;
      return coordinate;
    } else {
      return null;
    }
  }
  if (m == flatCoordinates[offset + stride - 1]) {
    return flatCoordinates.slice(offset, offset + stride);
  }
  let lo = offset / stride;
  let hi = end / stride;
  while (lo < hi) {
    const mid = lo + hi >> 1;
    if (m < flatCoordinates[(mid + 1) * stride - 1]) {
      hi = mid;
    } else {
      lo = mid + 1;
    }
  }
  const m0 = flatCoordinates[lo * stride - 1];
  if (m == m0) {
    return flatCoordinates.slice((lo - 1) * stride, (lo - 1) * stride + stride);
  }
  const m1 = flatCoordinates[(lo + 1) * stride - 1];
  const t = (m - m0) / (m1 - m0);
  coordinate = [];
  for (let i = 0; i < stride - 1; ++i) {
    coordinate.push(
      lerp(
        flatCoordinates[(lo - 1) * stride + i],
        flatCoordinates[lo * stride + i],
        t
      )
    );
  }
  coordinate.push(m);
  return coordinate;
}
function lineStringsCoordinateAtM(flatCoordinates, offset, ends, stride, m, extrapolate, interpolate) {
  if (interpolate) {
    return lineStringCoordinateAtM(
      flatCoordinates,
      offset,
      ends[ends.length - 1],
      stride,
      m,
      extrapolate
    );
  }
  let coordinate;
  if (m < flatCoordinates[stride - 1]) {
    if (extrapolate) {
      coordinate = flatCoordinates.slice(0, stride);
      coordinate[stride - 1] = m;
      return coordinate;
    } else {
      return null;
    }
  }
  if (flatCoordinates[flatCoordinates.length - 1] < m) {
    if (extrapolate) {
      coordinate = flatCoordinates.slice(flatCoordinates.length - stride);
      coordinate[stride - 1] = m;
      return coordinate;
    } else {
      return null;
    }
  }
  for (let i = 0, ii = ends.length; i < ii; ++i) {
    const end = ends[i];
    if (offset == end) {
      continue;
    }
    if (m < flatCoordinates[offset + stride - 1]) {
      return null;
    } else if (m <= flatCoordinates[end - 1]) {
      return lineStringCoordinateAtM(
        flatCoordinates,
        offset,
        end,
        stride,
        m,
        false
      );
    }
    offset = end;
  }
  return null;
}
function linearRingContainsExtent(flatCoordinates, offset, end, stride, extent) {
  const outside = forEachCorner(
    extent,
    function(coordinate) {
      return !linearRingContainsXY(
        flatCoordinates,
        offset,
        end,
        stride,
        coordinate[0],
        coordinate[1]
      );
    }
  );
  return !outside;
}
function linearRingContainsXY(flatCoordinates, offset, end, stride, x, y) {
  let wn = 0;
  let x1 = flatCoordinates[end - stride];
  let y1 = flatCoordinates[end - stride + 1];
  for (; offset < end; offset += stride) {
    const x2 = flatCoordinates[offset];
    const y2 = flatCoordinates[offset + 1];
    if (y1 <= y) {
      if (y2 > y && (x2 - x1) * (y - y1) - (x - x1) * (y2 - y1) > 0) {
        wn++;
      }
    } else if (y2 <= y && (x2 - x1) * (y - y1) - (x - x1) * (y2 - y1) < 0) {
      wn--;
    }
    x1 = x2;
    y1 = y2;
  }
  return wn !== 0;
}
function linearRingsContainsXY(flatCoordinates, offset, ends, stride, x, y) {
  if (ends.length === 0) {
    return false;
  }
  if (!linearRingContainsXY(flatCoordinates, offset, ends[0], stride, x, y)) {
    return false;
  }
  for (let i = 1, ii = ends.length; i < ii; ++i) {
    if (linearRingContainsXY(flatCoordinates, ends[i - 1], ends[i], stride, x, y)) {
      return false;
    }
  }
  return true;
}
function linearRingssContainsXY(flatCoordinates, offset, endss, stride, x, y) {
  if (endss.length === 0) {
    return false;
  }
  for (let i = 0, ii = endss.length; i < ii; ++i) {
    const ends = endss[i];
    if (linearRingsContainsXY(flatCoordinates, offset, ends, stride, x, y)) {
      return true;
    }
    offset = ends[ends.length - 1];
  }
  return false;
}
function intersectsLineString(flatCoordinates, offset, end, stride, extent) {
  const coordinatesExtent = extendFlatCoordinates(
    createEmpty(),
    flatCoordinates,
    offset,
    end,
    stride
  );
  if (!intersects$2(extent, coordinatesExtent)) {
    return false;
  }
  if (containsExtent(extent, coordinatesExtent)) {
    return true;
  }
  if (coordinatesExtent[0] >= extent[0] && coordinatesExtent[2] <= extent[2]) {
    return true;
  }
  if (coordinatesExtent[1] >= extent[1] && coordinatesExtent[3] <= extent[3]) {
    return true;
  }
  return forEach(
    flatCoordinates,
    offset,
    end,
    stride,
    function(point1, point2) {
      return intersectsSegment(extent, point1, point2);
    }
  );
}
function intersectsLineStringArray(flatCoordinates, offset, ends, stride, extent) {
  for (let i = 0, ii = ends.length; i < ii; ++i) {
    if (intersectsLineString(flatCoordinates, offset, ends[i], stride, extent)) {
      return true;
    }
    offset = ends[i];
  }
  return false;
}
function intersectsLinearRing(flatCoordinates, offset, end, stride, extent) {
  if (intersectsLineString(flatCoordinates, offset, end, stride, extent)) {
    return true;
  }
  if (linearRingContainsXY(
    flatCoordinates,
    offset,
    end,
    stride,
    extent[0],
    extent[1]
  )) {
    return true;
  }
  if (linearRingContainsXY(
    flatCoordinates,
    offset,
    end,
    stride,
    extent[0],
    extent[3]
  )) {
    return true;
  }
  if (linearRingContainsXY(
    flatCoordinates,
    offset,
    end,
    stride,
    extent[2],
    extent[1]
  )) {
    return true;
  }
  if (linearRingContainsXY(
    flatCoordinates,
    offset,
    end,
    stride,
    extent[2],
    extent[3]
  )) {
    return true;
  }
  return false;
}
function intersectsLinearRingArray(flatCoordinates, offset, ends, stride, extent) {
  if (!intersectsLinearRing(flatCoordinates, offset, ends[0], stride, extent)) {
    return false;
  }
  if (ends.length === 1) {
    return true;
  }
  for (let i = 1, ii = ends.length; i < ii; ++i) {
    if (linearRingContainsExtent(
      flatCoordinates,
      ends[i - 1],
      ends[i],
      stride,
      extent
    )) {
      if (!intersectsLineString(
        flatCoordinates,
        ends[i - 1],
        ends[i],
        stride,
        extent
      )) {
        return false;
      }
    }
  }
  return true;
}
function intersectsLinearRingMultiArray(flatCoordinates, offset, endss, stride, extent) {
  for (let i = 0, ii = endss.length; i < ii; ++i) {
    const ends = endss[i];
    if (intersectsLinearRingArray(flatCoordinates, offset, ends, stride, extent)) {
      return true;
    }
    offset = ends[ends.length - 1];
  }
  return false;
}
class LineString extends SimpleGeometry$1 {
  constructor(coordinates2, layout) {
    super();
    this.flatMidpoint_ = null;
    this.flatMidpointRevision_ = -1;
    this.maxDelta_ = -1;
    this.maxDeltaRevision_ = -1;
    if (layout !== void 0 && !Array.isArray(coordinates2[0])) {
      this.setFlatCoordinates(
        layout,
        coordinates2
      );
    } else {
      this.setCoordinates(
        coordinates2,
        layout
      );
    }
  }
  appendCoordinate(coordinate) {
    if (!this.flatCoordinates) {
      this.flatCoordinates = coordinate.slice();
    } else {
      extend$1(this.flatCoordinates, coordinate);
    }
    this.changed();
  }
  clone() {
    const lineString = new LineString(
      this.flatCoordinates.slice(),
      this.layout
    );
    lineString.applyProperties(this);
    return lineString;
  }
  closestPointXY(x, y, closestPoint, minSquaredDistance) {
    if (minSquaredDistance < closestSquaredDistanceXY(this.getExtent(), x, y)) {
      return minSquaredDistance;
    }
    if (this.maxDeltaRevision_ != this.getRevision()) {
      this.maxDelta_ = Math.sqrt(
        maxSquaredDelta(
          this.flatCoordinates,
          0,
          this.flatCoordinates.length,
          this.stride,
          0
        )
      );
      this.maxDeltaRevision_ = this.getRevision();
    }
    return assignClosestPoint(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      this.maxDelta_,
      false,
      x,
      y,
      closestPoint,
      minSquaredDistance
    );
  }
  forEachSegment(callback) {
    return forEach(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      callback
    );
  }
  getCoordinateAtM(m, extrapolate) {
    if (this.layout != "XYM" && this.layout != "XYZM") {
      return null;
    }
    extrapolate = extrapolate !== void 0 ? extrapolate : false;
    return lineStringCoordinateAtM(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      m,
      extrapolate
    );
  }
  getCoordinates() {
    return inflateCoordinates(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride
    );
  }
  getCoordinateAt(fraction, dest) {
    return interpolatePoint(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      fraction,
      dest,
      this.stride
    );
  }
  getLength() {
    return lineStringLength(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride
    );
  }
  getFlatMidpoint() {
    if (this.flatMidpointRevision_ != this.getRevision()) {
      this.flatMidpoint_ = this.getCoordinateAt(0.5, this.flatMidpoint_);
      this.flatMidpointRevision_ = this.getRevision();
    }
    return this.flatMidpoint_;
  }
  getSimplifiedGeometryInternal(squaredTolerance) {
    const simplifiedFlatCoordinates = [];
    simplifiedFlatCoordinates.length = douglasPeucker(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      squaredTolerance,
      simplifiedFlatCoordinates,
      0
    );
    return new LineString(simplifiedFlatCoordinates, "XY");
  }
  getType() {
    return "LineString";
  }
  intersectsExtent(extent) {
    return intersectsLineString(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      extent
    );
  }
  setCoordinates(coordinates2, layout) {
    this.setLayout(layout, coordinates2, 1);
    if (!this.flatCoordinates) {
      this.flatCoordinates = [];
    }
    this.flatCoordinates.length = deflateCoordinates(
      this.flatCoordinates,
      0,
      coordinates2,
      this.stride
    );
    this.changed();
  }
}
const LineString$1 = LineString;
class MultiLineString extends SimpleGeometry$1 {
  constructor(coordinates2, layout, ends) {
    super();
    this.ends_ = [];
    this.maxDelta_ = -1;
    this.maxDeltaRevision_ = -1;
    if (Array.isArray(coordinates2[0])) {
      this.setCoordinates(
        coordinates2,
        layout
      );
    } else if (layout !== void 0 && ends) {
      this.setFlatCoordinates(
        layout,
        coordinates2
      );
      this.ends_ = ends;
    } else {
      let layout2 = this.getLayout();
      const lineStrings = coordinates2;
      const flatCoordinates = [];
      const ends2 = [];
      for (let i = 0, ii = lineStrings.length; i < ii; ++i) {
        const lineString = lineStrings[i];
        if (i === 0) {
          layout2 = lineString.getLayout();
        }
        extend$1(flatCoordinates, lineString.getFlatCoordinates());
        ends2.push(flatCoordinates.length);
      }
      this.setFlatCoordinates(layout2, flatCoordinates);
      this.ends_ = ends2;
    }
  }
  appendLineString(lineString) {
    if (!this.flatCoordinates) {
      this.flatCoordinates = lineString.getFlatCoordinates().slice();
    } else {
      extend$1(this.flatCoordinates, lineString.getFlatCoordinates().slice());
    }
    this.ends_.push(this.flatCoordinates.length);
    this.changed();
  }
  clone() {
    const multiLineString = new MultiLineString(
      this.flatCoordinates.slice(),
      this.layout,
      this.ends_.slice()
    );
    multiLineString.applyProperties(this);
    return multiLineString;
  }
  closestPointXY(x, y, closestPoint, minSquaredDistance) {
    if (minSquaredDistance < closestSquaredDistanceXY(this.getExtent(), x, y)) {
      return minSquaredDistance;
    }
    if (this.maxDeltaRevision_ != this.getRevision()) {
      this.maxDelta_ = Math.sqrt(
        arrayMaxSquaredDelta(
          this.flatCoordinates,
          0,
          this.ends_,
          this.stride,
          0
        )
      );
      this.maxDeltaRevision_ = this.getRevision();
    }
    return assignClosestArrayPoint(
      this.flatCoordinates,
      0,
      this.ends_,
      this.stride,
      this.maxDelta_,
      false,
      x,
      y,
      closestPoint,
      minSquaredDistance
    );
  }
  getCoordinateAtM(m, extrapolate, interpolate) {
    if (this.layout != "XYM" && this.layout != "XYZM" || this.flatCoordinates.length === 0) {
      return null;
    }
    extrapolate = extrapolate !== void 0 ? extrapolate : false;
    interpolate = interpolate !== void 0 ? interpolate : false;
    return lineStringsCoordinateAtM(
      this.flatCoordinates,
      0,
      this.ends_,
      this.stride,
      m,
      extrapolate,
      interpolate
    );
  }
  getCoordinates() {
    return inflateCoordinatesArray(
      this.flatCoordinates,
      0,
      this.ends_,
      this.stride
    );
  }
  getEnds() {
    return this.ends_;
  }
  getLineString(index2) {
    if (index2 < 0 || this.ends_.length <= index2) {
      return null;
    }
    return new LineString$1(
      this.flatCoordinates.slice(
        index2 === 0 ? 0 : this.ends_[index2 - 1],
        this.ends_[index2]
      ),
      this.layout
    );
  }
  getLineStrings() {
    const flatCoordinates = this.flatCoordinates;
    const ends = this.ends_;
    const layout = this.layout;
    const lineStrings = [];
    let offset = 0;
    for (let i = 0, ii = ends.length; i < ii; ++i) {
      const end = ends[i];
      const lineString = new LineString$1(
        flatCoordinates.slice(offset, end),
        layout
      );
      lineStrings.push(lineString);
      offset = end;
    }
    return lineStrings;
  }
  getFlatMidpoints() {
    const midpoints = [];
    const flatCoordinates = this.flatCoordinates;
    let offset = 0;
    const ends = this.ends_;
    const stride = this.stride;
    for (let i = 0, ii = ends.length; i < ii; ++i) {
      const end = ends[i];
      const midpoint = interpolatePoint(
        flatCoordinates,
        offset,
        end,
        stride,
        0.5
      );
      extend$1(midpoints, midpoint);
      offset = end;
    }
    return midpoints;
  }
  getSimplifiedGeometryInternal(squaredTolerance) {
    const simplifiedFlatCoordinates = [];
    const simplifiedEnds = [];
    simplifiedFlatCoordinates.length = douglasPeuckerArray(
      this.flatCoordinates,
      0,
      this.ends_,
      this.stride,
      squaredTolerance,
      simplifiedFlatCoordinates,
      0,
      simplifiedEnds
    );
    return new MultiLineString(simplifiedFlatCoordinates, "XY", simplifiedEnds);
  }
  getType() {
    return "MultiLineString";
  }
  intersectsExtent(extent) {
    return intersectsLineStringArray(
      this.flatCoordinates,
      0,
      this.ends_,
      this.stride,
      extent
    );
  }
  setCoordinates(coordinates2, layout) {
    this.setLayout(layout, coordinates2, 2);
    if (!this.flatCoordinates) {
      this.flatCoordinates = [];
    }
    const ends = deflateCoordinatesArray(
      this.flatCoordinates,
      0,
      coordinates2,
      this.stride,
      this.ends_
    );
    this.flatCoordinates.length = ends.length === 0 ? 0 : ends[ends.length - 1];
    this.changed();
  }
}
const MultiLineString$1 = MultiLineString;
class Point extends SimpleGeometry$1 {
  constructor(coordinates2, layout) {
    super();
    this.setCoordinates(coordinates2, layout);
  }
  clone() {
    const point = new Point(this.flatCoordinates.slice(), this.layout);
    point.applyProperties(this);
    return point;
  }
  closestPointXY(x, y, closestPoint, minSquaredDistance) {
    const flatCoordinates = this.flatCoordinates;
    const squaredDistance2 = squaredDistance$1(
      x,
      y,
      flatCoordinates[0],
      flatCoordinates[1]
    );
    if (squaredDistance2 < minSquaredDistance) {
      const stride = this.stride;
      for (let i = 0; i < stride; ++i) {
        closestPoint[i] = flatCoordinates[i];
      }
      closestPoint.length = stride;
      return squaredDistance2;
    } else {
      return minSquaredDistance;
    }
  }
  getCoordinates() {
    return !this.flatCoordinates ? [] : this.flatCoordinates.slice();
  }
  computeExtent(extent) {
    return createOrUpdateFromCoordinate(this.flatCoordinates, extent);
  }
  getType() {
    return "Point";
  }
  intersectsExtent(extent) {
    return containsXY(extent, this.flatCoordinates[0], this.flatCoordinates[1]);
  }
  setCoordinates(coordinates2, layout) {
    this.setLayout(layout, coordinates2, 0);
    if (!this.flatCoordinates) {
      this.flatCoordinates = [];
    }
    this.flatCoordinates.length = deflateCoordinate(
      this.flatCoordinates,
      0,
      coordinates2,
      this.stride
    );
    this.changed();
  }
}
const Point$1 = Point;
class MultiPoint extends SimpleGeometry$1 {
  constructor(coordinates2, layout) {
    super();
    if (layout && !Array.isArray(coordinates2[0])) {
      this.setFlatCoordinates(
        layout,
        coordinates2
      );
    } else {
      this.setCoordinates(
        coordinates2,
        layout
      );
    }
  }
  appendPoint(point) {
    if (!this.flatCoordinates) {
      this.flatCoordinates = point.getFlatCoordinates().slice();
    } else {
      extend$1(this.flatCoordinates, point.getFlatCoordinates());
    }
    this.changed();
  }
  clone() {
    const multiPoint = new MultiPoint(
      this.flatCoordinates.slice(),
      this.layout
    );
    multiPoint.applyProperties(this);
    return multiPoint;
  }
  closestPointXY(x, y, closestPoint, minSquaredDistance) {
    if (minSquaredDistance < closestSquaredDistanceXY(this.getExtent(), x, y)) {
      return minSquaredDistance;
    }
    const flatCoordinates = this.flatCoordinates;
    const stride = this.stride;
    for (let i = 0, ii = flatCoordinates.length; i < ii; i += stride) {
      const squaredDistance2 = squaredDistance$1(
        x,
        y,
        flatCoordinates[i],
        flatCoordinates[i + 1]
      );
      if (squaredDistance2 < minSquaredDistance) {
        minSquaredDistance = squaredDistance2;
        for (let j = 0; j < stride; ++j) {
          closestPoint[j] = flatCoordinates[i + j];
        }
        closestPoint.length = stride;
      }
    }
    return minSquaredDistance;
  }
  getCoordinates() {
    return inflateCoordinates(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride
    );
  }
  getPoint(index2) {
    const n = !this.flatCoordinates ? 0 : this.flatCoordinates.length / this.stride;
    if (index2 < 0 || n <= index2) {
      return null;
    }
    return new Point$1(
      this.flatCoordinates.slice(
        index2 * this.stride,
        (index2 + 1) * this.stride
      ),
      this.layout
    );
  }
  getPoints() {
    const flatCoordinates = this.flatCoordinates;
    const layout = this.layout;
    const stride = this.stride;
    const points = [];
    for (let i = 0, ii = flatCoordinates.length; i < ii; i += stride) {
      const point = new Point$1(flatCoordinates.slice(i, i + stride), layout);
      points.push(point);
    }
    return points;
  }
  getType() {
    return "MultiPoint";
  }
  intersectsExtent(extent) {
    const flatCoordinates = this.flatCoordinates;
    const stride = this.stride;
    for (let i = 0, ii = flatCoordinates.length; i < ii; i += stride) {
      const x = flatCoordinates[i];
      const y = flatCoordinates[i + 1];
      if (containsXY(extent, x, y)) {
        return true;
      }
    }
    return false;
  }
  setCoordinates(coordinates2, layout) {
    this.setLayout(layout, coordinates2, 1);
    if (!this.flatCoordinates) {
      this.flatCoordinates = [];
    }
    this.flatCoordinates.length = deflateCoordinates(
      this.flatCoordinates,
      0,
      coordinates2,
      this.stride
    );
    this.changed();
  }
}
const MultiPoint$1 = MultiPoint;
function linearRing(flatCoordinates, offset, end, stride) {
  let twiceArea = 0;
  let x1 = flatCoordinates[end - stride];
  let y1 = flatCoordinates[end - stride + 1];
  for (; offset < end; offset += stride) {
    const x2 = flatCoordinates[offset];
    const y2 = flatCoordinates[offset + 1];
    twiceArea += y1 * x2 - x1 * y2;
    x1 = x2;
    y1 = y2;
  }
  return twiceArea / 2;
}
function linearRings(flatCoordinates, offset, ends, stride) {
  let area2 = 0;
  for (let i = 0, ii = ends.length; i < ii; ++i) {
    const end = ends[i];
    area2 += linearRing(flatCoordinates, offset, end, stride);
    offset = end;
  }
  return area2;
}
function linearRingss$1(flatCoordinates, offset, endss, stride) {
  let area2 = 0;
  for (let i = 0, ii = endss.length; i < ii; ++i) {
    const ends = endss[i];
    area2 += linearRings(flatCoordinates, offset, ends, stride);
    offset = ends[ends.length - 1];
  }
  return area2;
}
class LinearRing extends SimpleGeometry$1 {
  constructor(coordinates2, layout) {
    super();
    this.maxDelta_ = -1;
    this.maxDeltaRevision_ = -1;
    if (layout !== void 0 && !Array.isArray(coordinates2[0])) {
      this.setFlatCoordinates(
        layout,
        coordinates2
      );
    } else {
      this.setCoordinates(
        coordinates2,
        layout
      );
    }
  }
  clone() {
    return new LinearRing(this.flatCoordinates.slice(), this.layout);
  }
  closestPointXY(x, y, closestPoint, minSquaredDistance) {
    if (minSquaredDistance < closestSquaredDistanceXY(this.getExtent(), x, y)) {
      return minSquaredDistance;
    }
    if (this.maxDeltaRevision_ != this.getRevision()) {
      this.maxDelta_ = Math.sqrt(
        maxSquaredDelta(
          this.flatCoordinates,
          0,
          this.flatCoordinates.length,
          this.stride,
          0
        )
      );
      this.maxDeltaRevision_ = this.getRevision();
    }
    return assignClosestPoint(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      this.maxDelta_,
      true,
      x,
      y,
      closestPoint,
      minSquaredDistance
    );
  }
  getArea() {
    return linearRing(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride
    );
  }
  getCoordinates() {
    return inflateCoordinates(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride
    );
  }
  getSimplifiedGeometryInternal(squaredTolerance) {
    const simplifiedFlatCoordinates = [];
    simplifiedFlatCoordinates.length = douglasPeucker(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      squaredTolerance,
      simplifiedFlatCoordinates,
      0
    );
    return new LinearRing(simplifiedFlatCoordinates, "XY");
  }
  getType() {
    return "LinearRing";
  }
  intersectsExtent(extent) {
    return false;
  }
  setCoordinates(coordinates2, layout) {
    this.setLayout(layout, coordinates2, 1);
    if (!this.flatCoordinates) {
      this.flatCoordinates = [];
    }
    this.flatCoordinates.length = deflateCoordinates(
      this.flatCoordinates,
      0,
      coordinates2,
      this.stride
    );
    this.changed();
  }
}
const LinearRing$1 = LinearRing;
function getInteriorPointOfArray(flatCoordinates, offset, ends, stride, flatCenters, flatCentersOffset, dest) {
  let i, ii, x, x1, x2, y1, y2;
  const y = flatCenters[flatCentersOffset + 1];
  const intersections = [];
  for (let r = 0, rr = ends.length; r < rr; ++r) {
    const end = ends[r];
    x1 = flatCoordinates[end - stride];
    y1 = flatCoordinates[end - stride + 1];
    for (i = offset; i < end; i += stride) {
      x2 = flatCoordinates[i];
      y2 = flatCoordinates[i + 1];
      if (y <= y1 && y2 <= y || y1 <= y && y <= y2) {
        x = (y - y1) / (y2 - y1) * (x2 - x1) + x1;
        intersections.push(x);
      }
      x1 = x2;
      y1 = y2;
    }
  }
  let pointX = NaN;
  let maxSegmentLength = -Infinity;
  intersections.sort(numberSafeCompareFunction);
  x1 = intersections[0];
  for (i = 1, ii = intersections.length; i < ii; ++i) {
    x2 = intersections[i];
    const segmentLength = Math.abs(x2 - x1);
    if (segmentLength > maxSegmentLength) {
      x = (x1 + x2) / 2;
      if (linearRingsContainsXY(flatCoordinates, offset, ends, stride, x, y)) {
        pointX = x;
        maxSegmentLength = segmentLength;
      }
    }
    x1 = x2;
  }
  if (isNaN(pointX)) {
    pointX = flatCenters[flatCentersOffset];
  }
  if (dest) {
    dest.push(pointX, y, maxSegmentLength);
    return dest;
  } else {
    return [pointX, y, maxSegmentLength];
  }
}
function getInteriorPointsOfMultiArray(flatCoordinates, offset, endss, stride, flatCenters) {
  let interiorPoints = [];
  for (let i = 0, ii = endss.length; i < ii; ++i) {
    const ends = endss[i];
    interiorPoints = getInteriorPointOfArray(
      flatCoordinates,
      offset,
      ends,
      stride,
      flatCenters,
      2 * i,
      interiorPoints
    );
    offset = ends[ends.length - 1];
  }
  return interiorPoints;
}
function coordinates(flatCoordinates, offset, end, stride) {
  while (offset < end - stride) {
    for (let i = 0; i < stride; ++i) {
      const tmp = flatCoordinates[offset + i];
      flatCoordinates[offset + i] = flatCoordinates[end - stride + i];
      flatCoordinates[end - stride + i] = tmp;
    }
    offset += stride;
    end -= stride;
  }
}
function linearRingIsClockwise(flatCoordinates, offset, end, stride) {
  let edge = 0;
  let x1 = flatCoordinates[end - stride];
  let y1 = flatCoordinates[end - stride + 1];
  for (; offset < end; offset += stride) {
    const x2 = flatCoordinates[offset];
    const y2 = flatCoordinates[offset + 1];
    edge += (x2 - x1) * (y2 + y1);
    x1 = x2;
    y1 = y2;
  }
  return edge === 0 ? void 0 : edge > 0;
}
function linearRingsAreOriented(flatCoordinates, offset, ends, stride, right) {
  right = right !== void 0 ? right : false;
  for (let i = 0, ii = ends.length; i < ii; ++i) {
    const end = ends[i];
    const isClockwise = linearRingIsClockwise(
      flatCoordinates,
      offset,
      end,
      stride
    );
    if (i === 0) {
      if (right && isClockwise || !right && !isClockwise) {
        return false;
      }
    } else {
      if (right && !isClockwise || !right && isClockwise) {
        return false;
      }
    }
    offset = end;
  }
  return true;
}
function linearRingssAreOriented(flatCoordinates, offset, endss, stride, right) {
  for (let i = 0, ii = endss.length; i < ii; ++i) {
    const ends = endss[i];
    if (!linearRingsAreOriented(flatCoordinates, offset, ends, stride, right)) {
      return false;
    }
    if (ends.length) {
      offset = ends[ends.length - 1];
    }
  }
  return true;
}
function orientLinearRings(flatCoordinates, offset, ends, stride, right) {
  right = right !== void 0 ? right : false;
  for (let i = 0, ii = ends.length; i < ii; ++i) {
    const end = ends[i];
    const isClockwise = linearRingIsClockwise(
      flatCoordinates,
      offset,
      end,
      stride
    );
    const reverse = i === 0 ? right && isClockwise || !right && !isClockwise : right && !isClockwise || !right && isClockwise;
    if (reverse) {
      coordinates(flatCoordinates, offset, end, stride);
    }
    offset = end;
  }
  return offset;
}
function orientLinearRingsArray(flatCoordinates, offset, endss, stride, right) {
  for (let i = 0, ii = endss.length; i < ii; ++i) {
    offset = orientLinearRings(
      flatCoordinates,
      offset,
      endss[i],
      stride,
      right
    );
  }
  return offset;
}
class Polygon extends SimpleGeometry$1 {
  constructor(coordinates2, layout, ends) {
    super();
    this.ends_ = [];
    this.flatInteriorPointRevision_ = -1;
    this.flatInteriorPoint_ = null;
    this.maxDelta_ = -1;
    this.maxDeltaRevision_ = -1;
    this.orientedRevision_ = -1;
    this.orientedFlatCoordinates_ = null;
    if (layout !== void 0 && ends) {
      this.setFlatCoordinates(
        layout,
        coordinates2
      );
      this.ends_ = ends;
    } else {
      this.setCoordinates(
        coordinates2,
        layout
      );
    }
  }
  appendLinearRing(linearRing2) {
    if (!this.flatCoordinates) {
      this.flatCoordinates = linearRing2.getFlatCoordinates().slice();
    } else {
      extend$1(this.flatCoordinates, linearRing2.getFlatCoordinates());
    }
    this.ends_.push(this.flatCoordinates.length);
    this.changed();
  }
  clone() {
    const polygon = new Polygon(
      this.flatCoordinates.slice(),
      this.layout,
      this.ends_.slice()
    );
    polygon.applyProperties(this);
    return polygon;
  }
  closestPointXY(x, y, closestPoint, minSquaredDistance) {
    if (minSquaredDistance < closestSquaredDistanceXY(this.getExtent(), x, y)) {
      return minSquaredDistance;
    }
    if (this.maxDeltaRevision_ != this.getRevision()) {
      this.maxDelta_ = Math.sqrt(
        arrayMaxSquaredDelta(
          this.flatCoordinates,
          0,
          this.ends_,
          this.stride,
          0
        )
      );
      this.maxDeltaRevision_ = this.getRevision();
    }
    return assignClosestArrayPoint(
      this.flatCoordinates,
      0,
      this.ends_,
      this.stride,
      this.maxDelta_,
      true,
      x,
      y,
      closestPoint,
      minSquaredDistance
    );
  }
  containsXY(x, y) {
    return linearRingsContainsXY(
      this.getOrientedFlatCoordinates(),
      0,
      this.ends_,
      this.stride,
      x,
      y
    );
  }
  getArea() {
    return linearRings(
      this.getOrientedFlatCoordinates(),
      0,
      this.ends_,
      this.stride
    );
  }
  getCoordinates(right) {
    let flatCoordinates;
    if (right !== void 0) {
      flatCoordinates = this.getOrientedFlatCoordinates().slice();
      orientLinearRings(flatCoordinates, 0, this.ends_, this.stride, right);
    } else {
      flatCoordinates = this.flatCoordinates;
    }
    return inflateCoordinatesArray(flatCoordinates, 0, this.ends_, this.stride);
  }
  getEnds() {
    return this.ends_;
  }
  getFlatInteriorPoint() {
    if (this.flatInteriorPointRevision_ != this.getRevision()) {
      const flatCenter = getCenter(this.getExtent());
      this.flatInteriorPoint_ = getInteriorPointOfArray(
        this.getOrientedFlatCoordinates(),
        0,
        this.ends_,
        this.stride,
        flatCenter,
        0
      );
      this.flatInteriorPointRevision_ = this.getRevision();
    }
    return this.flatInteriorPoint_;
  }
  getInteriorPoint() {
    return new Point$1(this.getFlatInteriorPoint(), "XYM");
  }
  getLinearRingCount() {
    return this.ends_.length;
  }
  getLinearRing(index2) {
    if (index2 < 0 || this.ends_.length <= index2) {
      return null;
    }
    return new LinearRing$1(
      this.flatCoordinates.slice(
        index2 === 0 ? 0 : this.ends_[index2 - 1],
        this.ends_[index2]
      ),
      this.layout
    );
  }
  getLinearRings() {
    const layout = this.layout;
    const flatCoordinates = this.flatCoordinates;
    const ends = this.ends_;
    const linearRings2 = [];
    let offset = 0;
    for (let i = 0, ii = ends.length; i < ii; ++i) {
      const end = ends[i];
      const linearRing2 = new LinearRing$1(
        flatCoordinates.slice(offset, end),
        layout
      );
      linearRings2.push(linearRing2);
      offset = end;
    }
    return linearRings2;
  }
  getOrientedFlatCoordinates() {
    if (this.orientedRevision_ != this.getRevision()) {
      const flatCoordinates = this.flatCoordinates;
      if (linearRingsAreOriented(flatCoordinates, 0, this.ends_, this.stride)) {
        this.orientedFlatCoordinates_ = flatCoordinates;
      } else {
        this.orientedFlatCoordinates_ = flatCoordinates.slice();
        this.orientedFlatCoordinates_.length = orientLinearRings(
          this.orientedFlatCoordinates_,
          0,
          this.ends_,
          this.stride
        );
      }
      this.orientedRevision_ = this.getRevision();
    }
    return this.orientedFlatCoordinates_;
  }
  getSimplifiedGeometryInternal(squaredTolerance) {
    const simplifiedFlatCoordinates = [];
    const simplifiedEnds = [];
    simplifiedFlatCoordinates.length = quantizeArray(
      this.flatCoordinates,
      0,
      this.ends_,
      this.stride,
      Math.sqrt(squaredTolerance),
      simplifiedFlatCoordinates,
      0,
      simplifiedEnds
    );
    return new Polygon(simplifiedFlatCoordinates, "XY", simplifiedEnds);
  }
  getType() {
    return "Polygon";
  }
  intersectsExtent(extent) {
    return intersectsLinearRingArray(
      this.getOrientedFlatCoordinates(),
      0,
      this.ends_,
      this.stride,
      extent
    );
  }
  setCoordinates(coordinates2, layout) {
    this.setLayout(layout, coordinates2, 2);
    if (!this.flatCoordinates) {
      this.flatCoordinates = [];
    }
    const ends = deflateCoordinatesArray(
      this.flatCoordinates,
      0,
      coordinates2,
      this.stride,
      this.ends_
    );
    this.flatCoordinates.length = ends.length === 0 ? 0 : ends[ends.length - 1];
    this.changed();
  }
}
const Polygon$1 = Polygon;
function fromExtent(extent) {
  const minX = extent[0];
  const minY = extent[1];
  const maxX = extent[2];
  const maxY = extent[3];
  const flatCoordinates = [
    minX,
    minY,
    minX,
    maxY,
    maxX,
    maxY,
    maxX,
    minY,
    minX,
    minY
  ];
  return new Polygon(flatCoordinates, "XY", [flatCoordinates.length]);
}
function fromCircle(circle, sides, angle) {
  sides = sides ? sides : 32;
  const stride = circle.getStride();
  const layout = circle.getLayout();
  const center = circle.getCenter();
  const arrayLength = stride * (sides + 1);
  const flatCoordinates = new Array(arrayLength);
  for (let i = 0; i < arrayLength; i += stride) {
    flatCoordinates[i] = 0;
    flatCoordinates[i + 1] = 0;
    for (let j = 2; j < stride; j++) {
      flatCoordinates[i + j] = center[j];
    }
  }
  const ends = [flatCoordinates.length];
  const polygon = new Polygon(flatCoordinates, layout, ends);
  makeRegular(polygon, center, circle.getRadius(), angle);
  return polygon;
}
function makeRegular(polygon, center, radius, angle) {
  const flatCoordinates = polygon.getFlatCoordinates();
  const stride = polygon.getStride();
  const sides = flatCoordinates.length / stride - 1;
  const startAngle = angle ? angle : 0;
  for (let i = 0; i <= sides; ++i) {
    const offset = i * stride;
    const angle2 = startAngle + modulo(i, sides) * 2 * Math.PI / sides;
    flatCoordinates[offset] = center[0] + radius * Math.cos(angle2);
    flatCoordinates[offset + 1] = center[1] + radius * Math.sin(angle2);
  }
  polygon.changed();
}
function linearRingss(flatCoordinates, offset, endss, stride) {
  const flatCenters = [];
  let extent = createEmpty();
  for (let i = 0, ii = endss.length; i < ii; ++i) {
    const ends = endss[i];
    extent = createOrUpdateFromFlatCoordinates(
      flatCoordinates,
      offset,
      ends[0],
      stride
    );
    flatCenters.push((extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2);
    offset = ends[ends.length - 1];
  }
  return flatCenters;
}
class MultiPolygon extends SimpleGeometry$1 {
  constructor(coordinates2, layout, endss) {
    super();
    this.endss_ = [];
    this.flatInteriorPointsRevision_ = -1;
    this.flatInteriorPoints_ = null;
    this.maxDelta_ = -1;
    this.maxDeltaRevision_ = -1;
    this.orientedRevision_ = -1;
    this.orientedFlatCoordinates_ = null;
    if (!endss && !Array.isArray(coordinates2[0])) {
      let thisLayout = this.getLayout();
      const polygons = coordinates2;
      const flatCoordinates = [];
      const thisEndss = [];
      for (let i = 0, ii = polygons.length; i < ii; ++i) {
        const polygon = polygons[i];
        if (i === 0) {
          thisLayout = polygon.getLayout();
        }
        const offset = flatCoordinates.length;
        const ends = polygon.getEnds();
        for (let j = 0, jj = ends.length; j < jj; ++j) {
          ends[j] += offset;
        }
        extend$1(flatCoordinates, polygon.getFlatCoordinates());
        thisEndss.push(ends);
      }
      layout = thisLayout;
      coordinates2 = flatCoordinates;
      endss = thisEndss;
    }
    if (layout !== void 0 && endss) {
      this.setFlatCoordinates(
        layout,
        coordinates2
      );
      this.endss_ = endss;
    } else {
      this.setCoordinates(
        coordinates2,
        layout
      );
    }
  }
  appendPolygon(polygon) {
    let ends;
    if (!this.flatCoordinates) {
      this.flatCoordinates = polygon.getFlatCoordinates().slice();
      ends = polygon.getEnds().slice();
      this.endss_.push();
    } else {
      const offset = this.flatCoordinates.length;
      extend$1(this.flatCoordinates, polygon.getFlatCoordinates());
      ends = polygon.getEnds().slice();
      for (let i = 0, ii = ends.length; i < ii; ++i) {
        ends[i] += offset;
      }
    }
    this.endss_.push(ends);
    this.changed();
  }
  clone() {
    const len = this.endss_.length;
    const newEndss = new Array(len);
    for (let i = 0; i < len; ++i) {
      newEndss[i] = this.endss_[i].slice();
    }
    const multiPolygon = new MultiPolygon(
      this.flatCoordinates.slice(),
      this.layout,
      newEndss
    );
    multiPolygon.applyProperties(this);
    return multiPolygon;
  }
  closestPointXY(x, y, closestPoint, minSquaredDistance) {
    if (minSquaredDistance < closestSquaredDistanceXY(this.getExtent(), x, y)) {
      return minSquaredDistance;
    }
    if (this.maxDeltaRevision_ != this.getRevision()) {
      this.maxDelta_ = Math.sqrt(
        multiArrayMaxSquaredDelta(
          this.flatCoordinates,
          0,
          this.endss_,
          this.stride,
          0
        )
      );
      this.maxDeltaRevision_ = this.getRevision();
    }
    return assignClosestMultiArrayPoint(
      this.getOrientedFlatCoordinates(),
      0,
      this.endss_,
      this.stride,
      this.maxDelta_,
      true,
      x,
      y,
      closestPoint,
      minSquaredDistance
    );
  }
  containsXY(x, y) {
    return linearRingssContainsXY(
      this.getOrientedFlatCoordinates(),
      0,
      this.endss_,
      this.stride,
      x,
      y
    );
  }
  getArea() {
    return linearRingss$1(
      this.getOrientedFlatCoordinates(),
      0,
      this.endss_,
      this.stride
    );
  }
  getCoordinates(right) {
    let flatCoordinates;
    if (right !== void 0) {
      flatCoordinates = this.getOrientedFlatCoordinates().slice();
      orientLinearRingsArray(
        flatCoordinates,
        0,
        this.endss_,
        this.stride,
        right
      );
    } else {
      flatCoordinates = this.flatCoordinates;
    }
    return inflateMultiCoordinatesArray(
      flatCoordinates,
      0,
      this.endss_,
      this.stride
    );
  }
  getEndss() {
    return this.endss_;
  }
  getFlatInteriorPoints() {
    if (this.flatInteriorPointsRevision_ != this.getRevision()) {
      const flatCenters = linearRingss(
        this.flatCoordinates,
        0,
        this.endss_,
        this.stride
      );
      this.flatInteriorPoints_ = getInteriorPointsOfMultiArray(
        this.getOrientedFlatCoordinates(),
        0,
        this.endss_,
        this.stride,
        flatCenters
      );
      this.flatInteriorPointsRevision_ = this.getRevision();
    }
    return this.flatInteriorPoints_;
  }
  getInteriorPoints() {
    return new MultiPoint$1(this.getFlatInteriorPoints().slice(), "XYM");
  }
  getOrientedFlatCoordinates() {
    if (this.orientedRevision_ != this.getRevision()) {
      const flatCoordinates = this.flatCoordinates;
      if (linearRingssAreOriented(flatCoordinates, 0, this.endss_, this.stride)) {
        this.orientedFlatCoordinates_ = flatCoordinates;
      } else {
        this.orientedFlatCoordinates_ = flatCoordinates.slice();
        this.orientedFlatCoordinates_.length = orientLinearRingsArray(
          this.orientedFlatCoordinates_,
          0,
          this.endss_,
          this.stride
        );
      }
      this.orientedRevision_ = this.getRevision();
    }
    return this.orientedFlatCoordinates_;
  }
  getSimplifiedGeometryInternal(squaredTolerance) {
    const simplifiedFlatCoordinates = [];
    const simplifiedEndss = [];
    simplifiedFlatCoordinates.length = quantizeMultiArray(
      this.flatCoordinates,
      0,
      this.endss_,
      this.stride,
      Math.sqrt(squaredTolerance),
      simplifiedFlatCoordinates,
      0,
      simplifiedEndss
    );
    return new MultiPolygon(simplifiedFlatCoordinates, "XY", simplifiedEndss);
  }
  getPolygon(index2) {
    if (index2 < 0 || this.endss_.length <= index2) {
      return null;
    }
    let offset;
    if (index2 === 0) {
      offset = 0;
    } else {
      const prevEnds = this.endss_[index2 - 1];
      offset = prevEnds[prevEnds.length - 1];
    }
    const ends = this.endss_[index2].slice();
    const end = ends[ends.length - 1];
    if (offset !== 0) {
      for (let i = 0, ii = ends.length; i < ii; ++i) {
        ends[i] -= offset;
      }
    }
    return new Polygon$1(
      this.flatCoordinates.slice(offset, end),
      this.layout,
      ends
    );
  }
  getPolygons() {
    const layout = this.layout;
    const flatCoordinates = this.flatCoordinates;
    const endss = this.endss_;
    const polygons = [];
    let offset = 0;
    for (let i = 0, ii = endss.length; i < ii; ++i) {
      const ends = endss[i].slice();
      const end = ends[ends.length - 1];
      if (offset !== 0) {
        for (let j = 0, jj = ends.length; j < jj; ++j) {
          ends[j] -= offset;
        }
      }
      const polygon = new Polygon$1(
        flatCoordinates.slice(offset, end),
        layout,
        ends
      );
      polygons.push(polygon);
      offset = end;
    }
    return polygons;
  }
  getType() {
    return "MultiPolygon";
  }
  intersectsExtent(extent) {
    return intersectsLinearRingMultiArray(
      this.getOrientedFlatCoordinates(),
      0,
      this.endss_,
      this.stride,
      extent
    );
  }
  setCoordinates(coordinates2, layout) {
    this.setLayout(layout, coordinates2, 3);
    if (!this.flatCoordinates) {
      this.flatCoordinates = [];
    }
    const endss = deflateMultiCoordinatesArray(
      this.flatCoordinates,
      0,
      coordinates2,
      this.stride,
      this.endss_
    );
    if (endss.length === 0) {
      this.flatCoordinates.length = 0;
    } else {
      const lastEnds = endss[endss.length - 1];
      this.flatCoordinates.length = lastEnds.length === 0 ? 0 : lastEnds[lastEnds.length - 1];
    }
    this.changed();
  }
}
const MultiPolygon$1 = MultiPolygon;
class GeoJSON extends JSONFeature$1 {
  constructor(options) {
    options = options ? options : {};
    super();
    this.dataProjection = get$1(
      options.dataProjection ? options.dataProjection : "EPSG:4326"
    );
    if (options.featureProjection) {
      this.defaultFeatureProjection = get$1(options.featureProjection);
    }
    this.geometryName_ = options.geometryName;
    this.extractGeometryName_ = options.extractGeometryName;
    this.supportedMediaTypes = [
      "application/geo+json",
      "application/vnd.geo+json"
    ];
  }
  readFeatureFromObject(object, options) {
    let geoJSONFeature = null;
    if (object["type"] === "Feature") {
      geoJSONFeature = object;
    } else {
      geoJSONFeature = {
        "type": "Feature",
        "geometry": object,
        "properties": null
      };
    }
    const geometry = readGeometry(geoJSONFeature["geometry"], options);
    const feature$1 = new feature();
    if (this.geometryName_) {
      feature$1.setGeometryName(this.geometryName_);
    } else if (this.extractGeometryName_ && "geometry_name" in geoJSONFeature !== void 0) {
      feature$1.setGeometryName(geoJSONFeature["geometry_name"]);
    }
    feature$1.setGeometry(geometry);
    if ("id" in geoJSONFeature) {
      feature$1.setId(geoJSONFeature["id"]);
    }
    if (geoJSONFeature["properties"]) {
      feature$1.setProperties(geoJSONFeature["properties"], true);
    }
    return feature$1;
  }
  readFeaturesFromObject(object, options) {
    const geoJSONObject = object;
    let features = null;
    if (geoJSONObject["type"] === "FeatureCollection") {
      const geoJSONFeatureCollection = object;
      features = [];
      const geoJSONFeatures = geoJSONFeatureCollection["features"];
      for (let i = 0, ii = geoJSONFeatures.length; i < ii; ++i) {
        features.push(this.readFeatureFromObject(geoJSONFeatures[i], options));
      }
    } else {
      features = [this.readFeatureFromObject(object, options)];
    }
    return features;
  }
  readGeometryFromObject(object, options) {
    return readGeometry(object, options);
  }
  readProjectionFromObject(object) {
    const crs = object["crs"];
    let projection;
    if (crs) {
      if (crs["type"] == "name") {
        projection = get$1(crs["properties"]["name"]);
      } else if (crs["type"] === "EPSG") {
        projection = get$1("EPSG:" + crs["properties"]["code"]);
      } else {
        assert(false, 36);
      }
    } else {
      projection = this.dataProjection;
    }
    return projection;
  }
  writeFeatureObject(feature2, options) {
    options = this.adaptOptions(options);
    const object = {
      "type": "Feature",
      geometry: null,
      properties: null
    };
    const id = feature2.getId();
    if (id !== void 0) {
      object.id = id;
    }
    if (!feature2.hasProperties()) {
      return object;
    }
    const properties = feature2.getProperties();
    const geometry = feature2.getGeometry();
    if (geometry) {
      object.geometry = writeGeometry(geometry, options);
      delete properties[feature2.getGeometryName()];
    }
    if (!isEmpty$1(properties)) {
      object.properties = properties;
    }
    return object;
  }
  writeFeaturesObject(features, options) {
    options = this.adaptOptions(options);
    const objects = [];
    for (let i = 0, ii = features.length; i < ii; ++i) {
      objects.push(this.writeFeatureObject(features[i], options));
    }
    return {
      type: "FeatureCollection",
      features: objects
    };
  }
  writeGeometryObject(geometry, options) {
    return writeGeometry(geometry, this.adaptOptions(options));
  }
}
function readGeometry(object, options) {
  if (!object) {
    return null;
  }
  let geometry;
  switch (object["type"]) {
    case "Point": {
      geometry = readPointGeometry(object);
      break;
    }
    case "LineString": {
      geometry = readLineStringGeometry(
        object
      );
      break;
    }
    case "Polygon": {
      geometry = readPolygonGeometry(object);
      break;
    }
    case "MultiPoint": {
      geometry = readMultiPointGeometry(
        object
      );
      break;
    }
    case "MultiLineString": {
      geometry = readMultiLineStringGeometry(
        object
      );
      break;
    }
    case "MultiPolygon": {
      geometry = readMultiPolygonGeometry(
        object
      );
      break;
    }
    case "GeometryCollection": {
      geometry = readGeometryCollectionGeometry(
        object
      );
      break;
    }
    default: {
      throw new Error("Unsupported GeoJSON type: " + object["type"]);
    }
  }
  return transformGeometryWithOptions(geometry, false, options);
}
function readGeometryCollectionGeometry(object, options) {
  const geometries = object["geometries"].map(
    function(geometry) {
      return readGeometry(geometry, options);
    }
  );
  return new GeometryCollection$1(geometries);
}
function readPointGeometry(object) {
  return new Point$1(object["coordinates"]);
}
function readLineStringGeometry(object) {
  return new LineString$1(object["coordinates"]);
}
function readMultiLineStringGeometry(object) {
  return new MultiLineString$1(object["coordinates"]);
}
function readMultiPointGeometry(object) {
  return new MultiPoint$1(object["coordinates"]);
}
function readMultiPolygonGeometry(object) {
  return new MultiPolygon$1(object["coordinates"]);
}
function readPolygonGeometry(object) {
  return new Polygon$1(object["coordinates"]);
}
function writeGeometry(geometry, options) {
  geometry = transformGeometryWithOptions(geometry, true, options);
  const type = geometry.getType();
  let geoJSON;
  switch (type) {
    case "Point": {
      geoJSON = writePointGeometry(geometry);
      break;
    }
    case "LineString": {
      geoJSON = writeLineStringGeometry(
        geometry
      );
      break;
    }
    case "Polygon": {
      geoJSON = writePolygonGeometry(
        geometry,
        options
      );
      break;
    }
    case "MultiPoint": {
      geoJSON = writeMultiPointGeometry(
        geometry
      );
      break;
    }
    case "MultiLineString": {
      geoJSON = writeMultiLineStringGeometry(
        geometry
      );
      break;
    }
    case "MultiPolygon": {
      geoJSON = writeMultiPolygonGeometry(
        geometry,
        options
      );
      break;
    }
    case "GeometryCollection": {
      geoJSON = writeGeometryCollectionGeometry(
        geometry,
        options
      );
      break;
    }
    case "Circle": {
      geoJSON = {
        type: "GeometryCollection",
        geometries: []
      };
      break;
    }
    default: {
      throw new Error("Unsupported geometry type: " + type);
    }
  }
  return geoJSON;
}
function writeGeometryCollectionGeometry(geometry, options) {
  options = Object.assign({}, options);
  delete options.featureProjection;
  const geometries = geometry.getGeometriesArray().map(function(geometry2) {
    return writeGeometry(geometry2, options);
  });
  return {
    type: "GeometryCollection",
    geometries
  };
}
function writeLineStringGeometry(geometry, options) {
  return {
    type: "LineString",
    coordinates: geometry.getCoordinates()
  };
}
function writeMultiLineStringGeometry(geometry, options) {
  return {
    type: "MultiLineString",
    coordinates: geometry.getCoordinates()
  };
}
function writeMultiPointGeometry(geometry, options) {
  return {
    type: "MultiPoint",
    coordinates: geometry.getCoordinates()
  };
}
function writeMultiPolygonGeometry(geometry, options) {
  let right;
  if (options) {
    right = options.rightHanded;
  }
  return {
    type: "MultiPolygon",
    coordinates: geometry.getCoordinates(right)
  };
}
function writePointGeometry(geometry, options) {
  return {
    type: "Point",
    coordinates: geometry.getCoordinates()
  };
}
function writePolygonGeometry(geometry, options) {
  let right;
  if (options) {
    right = options.rightHanded;
  }
  return {
    type: "Polygon",
    coordinates: geometry.getCoordinates(right)
  };
}
const GeoJSON$1 = GeoJSON;
const _sfc_main$7 = defineComponent({
  name: "GymapPolygon",
  props: {
    positionList: {
      type: Array,
      default: () => []
    },
    className: {
      type: String
    },
    fillColor: {
      type: String,
      default: "rgba(0, 0, 255, 0.1)"
    },
    strokeColor: {
      type: String,
      default: ""
    },
    strokeWidth: {
      type: Number,
      default: 3
    },
    minZoom: {
      type: Number,
      default: 1
    },
    maxZoom: {
      type: Number,
      default: 18
    },
    opacity: {
      type: Number,
      default: 1
    }
  },
  setup(props) {
    const { proxy } = getCurrentInstance();
    const mapId = proxy.$parent.id;
    const gyMapObj = gyMap$1(mapId);
    const mapFinish = computed(() => gyMapObj.value && gyMapObj.value.mapFinish);
    let polygonLayer = null;
    let isDraw = false;
    watch(mapFinish, () => {
      drawPolygon();
    });
    onMounted(() => {
      drawPolygon();
    });
    const getFeatures = () => {
      let positionList = props.positionList;
      let firstValue = positionList[0];
      let lonlatArr = [];
      if (firstValue && !Array.isArray(firstValue[0])) {
        lonlatArr = [positionList];
      } else {
        lonlatArr = positionList;
      }
      let features = lonlatArr.map((v) => {
        let coordinates2 = v.map((v2) => {
          return gyMapUtils.formatLonLatToPosition(v2);
        });
        return {
          "type": "Feature",
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              coordinates2
            ]
          }
        };
      });
      return features;
    };
    const getSource = () => {
      const features = getFeatures();
      if (!features) {
        return;
      }
      const geojsonObject = {
        "type": "FeatureCollection",
        "crs": {
          "type": "name",
          "properties": {
            "name": "EPSG:3857"
          }
        },
        "features": features
      };
      const source = new VectorSource$1({
        features: new GeoJSON$1().readFeatures(geojsonObject)
      });
      return source;
    };
    const getStyle = () => {
      return new Style$1({
        stroke: props.strokeColor ? new Stroke$1({
          color: props.strokeColor,
          width: props.strokeWidth
        }) : null,
        fill: props.fillColor ? new Fill$1({
          color: props.fillColor
        }) : null
      });
    };
    const drawPolygon = () => {
      if (!mapFinish.value || isDraw) {
        return;
      }
      isDraw = true;
      const source = getSource();
      if (!source) {
        return;
      }
      const stylePol = getStyle();
      polygonLayer = new LayerVector({
        source,
        style: [stylePol],
        minZoom: props.minZoom,
        maxZoom: props.maxZoom,
        opacity: props.opacity
      });
      gyMapObj.value.map.addLayer(polygonLayer);
    };
    watch(() => props.positionList, () => {
      const source = getSource();
      if (!source) {
        return;
      }
      polygonLayer && polygonLayer.setSource(source);
    }, {
      deep: true
    });
    watch([() => props.strokeColor, () => props.strokeWidth, () => props.fillColor], () => {
      const stylePol = getStyle();
      polygonLayer && polygonLayer.setStyle(stylePol);
    });
    watch(() => props.opacity, (n) => {
      polygonLayer && polygonLayer.setOpacity(n);
    });
    watch(() => props.minZoom, (n) => {
      polygonLayer && polygonLayer.setMinZoom(n);
    });
    watch(() => props.maxZoom, (n) => {
      polygonLayer && polygonLayer.setMaxZoom(n);
    });
    const destory = () => {
      if (polygonLayer) {
        gyMapObj.value && gyMapObj.value.map.removeLayer(polygonLayer);
        polygonLayer = null;
      }
    };
    onBeforeUnmount(() => {
      destory();
    });
  }
});
function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
  return null;
}
const GymapPolygon = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$7]]);
const arrowIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAATCAMAAACTKxybAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAHJQTFRF//////8A//8A/6pV/79A/8wz/9Ur/9Eu/8Q7/8wz/9It/8k2/9Eu/8o1/9Av/8o1/84x/8wz/8wz/8wz/8wz/8wz/8s0/8wz/8s0/8wz/8wz/8wz/8wz/8s0/8wz/8wz/8wz/8wz/8wz/8wz/8wz/8wzo2lg3QAAACV0Uk5TAAECAwQFBgsNDxETFhgbHUNGm6Ckqa2usrW+w8fLztLV1tnc9jtYQ+sAAABdSURBVAjXZc9HDsAwCARAp/fee+X/X8wesIQVbiMELEqVU6B0VS8tocZARGvE8Edoi1leD+0Jy+2gI2U5LXRmLLuB7pxl1dBT6N4Fzf+OnJHb5B2ZwMhmpDb+kZ9+tBQLxwwvvoMAAAAASUVORK5CYII=";
const _sfc_main$6 = defineComponent({
  name: "GymapLine",
  props: {
    positionList: {
      type: Array,
      default: () => []
    },
    strokeColor: {
      type: String,
      default: "blue"
    },
    strokeWidth: {
      type: Number,
      default: 3
    },
    minZoom: {
      type: Number,
      default: 1
    },
    maxZoom: {
      type: Number,
      default: 18
    },
    opacity: {
      type: Number,
      default: 1
    },
    arrow: {
      type: [Boolean, String],
      default: false
    },
    arrowAnchor: {
      type: Array,
      default: () => [0.75, 0.5]
    },
    animate: {
      type: Boolean,
      default: false
    },
    step: {
      type: Number,
      default: 1e-3
    },
    loop: {
      type: Boolean,
      default: false
    },
    arrowStep: {
      type: Number,
      default: 20
    }
  },
  setup(props) {
    const { proxy } = getCurrentInstance();
    const mapId = proxy.$parent.id;
    const gyMapObj = gyMap$1(mapId);
    const mapFinish = computed(() => gyMapObj.value && gyMapObj.value.mapFinish);
    let lineLayer = null;
    let lineFeatures = null;
    let isDraw = false;
    let style = null;
    let lineAllGeometry = null;
    let lineGeometry = null;
    let animCoordinates = [];
    let aId = null;
    let lineIndex = 0;
    let lineFeature = null;
    watch(mapFinish, () => {
      drawLine();
    });
    onMounted(() => {
      drawLine();
    });
    const getCoordinates = (positionList) => {
      let coordinates2 = positionList.map((v) => {
        return gyMapUtils.formatLonLatToPosition(v);
      });
      return new LineString$1(coordinates2);
    };
    const getFeatures = () => {
      let positionList = props.positionList;
      if (props.animate) {
        positionList = [];
      }
      lineGeometry = getCoordinates(positionList);
      lineFeature = new feature({
        type: "lineStyle",
        geometry: lineGeometry
      });
      return lineFeature;
    };
    const getSource = () => {
      lineFeatures = getFeatures();
      lineFeatures.setStyle(style);
      if (!lineFeatures) {
        return;
      }
      return new VectorSource$1({
        features: [lineFeatures]
      });
    };
    const styleFunction = function(feature2) {
      const geometry = feature2.getGeometry();
      const styles = [
        new Style$1({
          stroke: new Stroke$1({
            color: props.strokeColor,
            width: props.strokeWidth
          })
        })
      ];
      if (props.arrow) {
        let i = 0;
        let step = props.step;
        step = Math.min(step, 0.01);
        geometry.forEachSegment(function(start, end) {
          const dx = end[0] - start[0];
          const dy = end[1] - start[1];
          const rotation = Math.atan2(dy, dx);
          i++;
          let arrowStep = Math.min(props.arrowStep, 1 / step);
          if (!props.animate || i % (1 / step / arrowStep) == 0) {
            let icon = null;
            if (typeof props.arrow === "boolean") {
              icon = arrowIcon;
            } else {
              icon = props.arrow;
            }
            styles.push(
              new Style$1({
                geometry: new Point$1(end),
                image: new Icon$1({
                  src: icon,
                  anchor: props.arrowAnchor,
                  rotateWithView: true,
                  rotation: -rotation
                })
              })
            );
          }
        });
      }
      return styles;
    };
    const drawLine = () => {
      if (!mapFinish.value || isDraw) {
        return;
      }
      isDraw = true;
      style = styleFunction;
      clearTimer();
      const source = getSource();
      if (!source) {
        return;
      }
      lineLayer = new LayerVector({
        source,
        minZoom: props.minZoom,
        maxZoom: props.maxZoom,
        opacity: props.opacity
      });
      gyMapObj.value.map.addLayer(lineLayer);
      if (props.animate) {
        lineAllGeometry = getCoordinates(props.positionList);
        animate();
      }
    };
    const animate = () => {
      animCoordinates.push(lineAllGeometry.getCoordinateAt(Math.min(lineIndex, 1)));
      updateLine();
      if (lineIndex > 1) {
        clearTimer();
        if (props.loop) {
          animCoordinates = [];
          lineIndex = 0;
          animate();
        }
        return;
      }
      let step = props.step;
      step = Math.min(step, 0.01);
      lineIndex += step;
      aId = window.requestAnimationFrame(animate);
    };
    const updateLine = () => {
      let line = null;
      if (props.animate) {
        line = new LineString$1(animCoordinates);
      } else {
        line = getCoordinates(props.positionList);
      }
      lineFeature && lineFeature.setGeometry(line);
    };
    const destory = () => {
      if (lineLayer) {
        gyMapObj.value && gyMapObj.value.map.removeLayer(lineLayer);
        lineLayer = null;
      }
      clearTimer();
    };
    const clearTimer = () => {
      aId && window.cancelAnimationFrame(aId);
    };
    watch(() => props.positionList, (n) => {
      updateLine();
    });
    watch(() => props.opacity, (n) => {
      lineLayer && lineLayer.setOpacity(n);
    });
    watch(() => props.animate, (n) => {
      isDraw = false;
      destory();
      drawLine();
    });
    watch(() => props.minZoom, (n) => {
      lineLayer && lineLayer.setMinZoom(n);
    });
    watch(() => props.maxZoom, (n) => {
      lineLayer && lineLayer.setMaxZoom(n);
    });
    watch([() => props.strokeColor, () => props.strokeColor, () => props.arrow], () => {
      style = styleFunction;
      lineFeatures && lineFeatures.setStyle(style);
    });
    onBeforeUnmount(() => {
      destory();
    });
  }
});
function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
  return null;
}
const GymapLine = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$6]]);
const _sfc_main$5 = defineComponent({
  name: "GymapTask",
  props: {
    positionList: {
      type: Array,
      default: () => []
    },
    loop: {
      type: Boolean,
      default: false
    },
    step: {
      type: Number,
      default: 1e-3
    },
    taskStatus: {
      type: String,
      default: "play"
    },
    delay: {
      type: Number,
      default: 3e3
    },
    animateDataType: {
      type: String,
      default: "LONLAT"
    }
  },
  emits: ["animate"],
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const mapId = proxy.$parent.id;
    let canPlay = true;
    let noComponents = false;
    let childrenWatch = null;
    let layer = null;
    let timer = void 0;
    const runTask = (childLayerObj, childProps) => {
      if (!canPlay) {
        return;
      }
      if (!noComponents) {
        if (!childrenWatch) {
          childrenWatch = watch(() => childProps.position, () => {
            animIndex = 0;
            destory();
          });
        }
        layer = childLayerObj;
      }
      if (props.taskStatus === "play") {
        startTask();
      }
      if (props.delay !== 0) {
        timer = setTimeout(() => {
          startTask();
        }, props.delay);
      }
    };
    watch(() => props.taskStatus, (n) => {
      if (n === "play") {
        startTask();
      } else if (n === "stop") {
        animIndex = 0;
        stopTask();
      } else if (n === "pause") {
        stopTask();
      }
    });
    const getAllCoordinates = (positions) => {
      let coordinates2 = positions.map((v) => {
        return gyMapUtils.formatLonLatToPosition(v);
      });
      let linestring = new LineString$1(coordinates2);
      return linestring;
    };
    let lineGeometry = null;
    const startTask = () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      if (noComponents ? false : !layer) {
        return;
      }
      if (aId) {
        return;
      }
      if (!lineGeometry) {
        lineGeometry = getAllCoordinates(props.positionList);
      }
      animate();
    };
    let animIndex = 0;
    let aId = null;
    const animate = () => {
      let coordinate = lineGeometry.getCoordinateAt(Math.min(animIndex, 1));
      if (!noComponents) {
        if (layer.geometry) {
          layer.geometry.setCoordinates(coordinate);
        } else {
          layer.setPosition(coordinate);
        }
      }
      if (props.animateDataType === "LONLAT") {
        coordinate = toLonLat(coordinate);
      }
      emit("animate", coordinate, animIndex);
      if (animIndex > 1) {
        stopTask();
        if (props.loop) {
          animIndex = 0;
          animate();
        }
        return;
      }
      let step = props.step;
      animIndex = gyMapUtils.flortAdd(animIndex, step);
      aId = window.requestAnimationFrame(animate);
    };
    const stopTask = () => {
      childrenWatch && childrenWatch();
      aId && window.cancelAnimationFrame(aId);
      aId = null;
    };
    const destory = () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      stopTask();
    };
    onBeforeMount(() => {
      let defaultStr = proxy.$slots.default;
      if (defaultStr) {
        let children = proxy.$slots.default();
        let len = 0;
        for (let i = 0; i < children.length; i++) {
          let child = children[i];
          if (typeof child.type !== "symbol") {
            len++;
            if (len > 1) {
              canPlay = false;
              console.error("GymapTask\u7EC4\u4EF6\u4E2D\u53EA\u5141\u8BB8\u5B58\u5728\u4E00\u4E2A\u9700\u8981\u6267\u884C\u52A8\u753B\u7684\u7EC4\u4EF6\u3002");
              break;
            }
          }
        }
      } else if (!defaultStr) {
        noComponents = true;
        runTask();
      }
    });
    onMounted(() => {
      if (noComponents) {
        runTask();
      }
    });
    return {
      id: mapId,
      runTask,
      destory
    };
  }
});
function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", null, [
    renderSlot(_ctx.$slots, "default")
  ]);
}
const GymapTask = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$5]]);
class createOlLayer {
  constructor(id, stylesObj) {
    __publicField(this, "style");
    __publicField(this, "geometry");
    __publicField(this, "feature");
    __publicField(this, "mapId");
    __publicField(this, "source");
    __publicField(this, "layer");
    __publicField(this, "minZoom");
    __publicField(this, "maxZoom");
    __publicField(this, "olPositions");
    __publicField(this, "opacity");
    __publicField(this, "declutter");
    __publicField(this, "zIndex");
    __publicField(this, "stylesObj");
    __publicField(this, "gyMapObj");
    __publicField(this, "mapFinish");
    __publicField(this, "isDraw");
    this.style = void 0;
    this.geometry = void 0;
    this.feature = new feature();
    this.mapId = "";
    this.source = void 0;
    this.layer = null;
    this.minZoom = computed(() => stylesObj.minZoom);
    this.maxZoom = computed(() => stylesObj.maxZoom);
    this.opacity = computed(() => stylesObj.opacity);
    this.olPositions = computed(() => stylesObj.position);
    this.declutter = stylesObj.declutter;
    this.stylesObj = stylesObj;
    this.zIndex = void 0;
    this.gyMapObj = gyMap$1(id);
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
    this.addLayer();
    this.addWatchFun();
    this.addLayerToMap();
  }
  addFeature() {
    this.feature = new feature({
      geometry: this.geometry
    });
  }
  addSource() {
    this.source = new VectorSource$1({
      features: [this.feature]
    });
  }
  addLayer() {
    this.layer = new LayerVector({
      source: this.source,
      declutter: this.declutter,
      minZoom: this.minZoom.value,
      maxZoom: this.maxZoom.value,
      opacity: this.opacity.value
    });
  }
  addLayerToMap() {
    var _a, _b;
    if (!this.isDraw && this.mapFinish.value) {
      this.isDraw = true;
      (_b = (_a = this.gyMapObj.value) == null ? void 0 : _a.map) == null ? void 0 : _b.addLayer(this.layer);
    }
  }
  addWatchFun() {
    watch(this.mapFinish, (n) => {
      this.addLayerToMap();
    });
    this.addLayerWatch();
    this.addPropsWatch();
  }
  addLayerWatch() {
    watch(this.minZoom, (n) => {
      var _a;
      (_a = this.layer) == null ? void 0 : _a.setMinZoom(n);
    });
    watch(this.maxZoom, (n) => {
      var _a;
      (_a = this.layer) == null ? void 0 : _a.setMaxZoom(n);
    });
    watch(this.opacity, (n) => {
      var _a;
      (_a = this.layer) == null ? void 0 : _a.setOpacity(n);
    });
    watch(this.olPositions, (n) => {
      this.setGeoPosition(n);
    });
  }
  addPropsWatch() {
    watch(this.stylesObj, () => {
      this.setStyle();
    });
  }
  getGeometry() {
    return void 0;
  }
  setGeoPosition(position) {
  }
  getStyle() {
    return void 0;
  }
  setStyle() {
    this.style = this.getStyle();
    if (this.style && this.feature)
      this.feature.setStyle(this.style);
  }
  destory() {
    var _a, _b;
    (_b = (_a = this.gyMapObj.value) == null ? void 0 : _a.map) == null ? void 0 : _b.removeLayer(this.layer);
    this.layer = null;
    this.isDraw = false;
  }
}
const layerProps$4 = {
  isAuto: {
    type: Boolean,
    default: false
  },
  declutter: {
    type: Boolean,
    default: false
  },
  minZoom: {
    type: Number,
    default: 1
  },
  maxZoom: {
    type: Number,
    default: 18
  },
  opacity: {
    type: Number,
    default: 1
  }
};
class Circle extends SimpleGeometry$1 {
  constructor(center, radius, layout) {
    super();
    if (layout !== void 0 && radius === void 0) {
      this.setFlatCoordinates(layout, center);
    } else {
      radius = radius ? radius : 0;
      this.setCenterAndRadius(center, radius, layout);
    }
  }
  clone() {
    const circle = new Circle(
      this.flatCoordinates.slice(),
      void 0,
      this.layout
    );
    circle.applyProperties(this);
    return circle;
  }
  closestPointXY(x, y, closestPoint, minSquaredDistance) {
    const flatCoordinates = this.flatCoordinates;
    const dx = x - flatCoordinates[0];
    const dy = y - flatCoordinates[1];
    const squaredDistance2 = dx * dx + dy * dy;
    if (squaredDistance2 < minSquaredDistance) {
      if (squaredDistance2 === 0) {
        for (let i = 0; i < this.stride; ++i) {
          closestPoint[i] = flatCoordinates[i];
        }
      } else {
        const delta = this.getRadius() / Math.sqrt(squaredDistance2);
        closestPoint[0] = flatCoordinates[0] + delta * dx;
        closestPoint[1] = flatCoordinates[1] + delta * dy;
        for (let i = 2; i < this.stride; ++i) {
          closestPoint[i] = flatCoordinates[i];
        }
      }
      closestPoint.length = this.stride;
      return squaredDistance2;
    } else {
      return minSquaredDistance;
    }
  }
  containsXY(x, y) {
    const flatCoordinates = this.flatCoordinates;
    const dx = x - flatCoordinates[0];
    const dy = y - flatCoordinates[1];
    return dx * dx + dy * dy <= this.getRadiusSquared_();
  }
  getCenter() {
    return this.flatCoordinates.slice(0, this.stride);
  }
  computeExtent(extent) {
    const flatCoordinates = this.flatCoordinates;
    const radius = flatCoordinates[this.stride] - flatCoordinates[0];
    return createOrUpdate$2(
      flatCoordinates[0] - radius,
      flatCoordinates[1] - radius,
      flatCoordinates[0] + radius,
      flatCoordinates[1] + radius,
      extent
    );
  }
  getRadius() {
    return Math.sqrt(this.getRadiusSquared_());
  }
  getRadiusSquared_() {
    const dx = this.flatCoordinates[this.stride] - this.flatCoordinates[0];
    const dy = this.flatCoordinates[this.stride + 1] - this.flatCoordinates[1];
    return dx * dx + dy * dy;
  }
  getType() {
    return "Circle";
  }
  intersectsExtent(extent) {
    const circleExtent = this.getExtent();
    if (intersects$2(extent, circleExtent)) {
      const center = this.getCenter();
      if (extent[0] <= center[0] && extent[2] >= center[0]) {
        return true;
      }
      if (extent[1] <= center[1] && extent[3] >= center[1]) {
        return true;
      }
      return forEachCorner(extent, this.intersectsCoordinate.bind(this));
    }
    return false;
  }
  setCenter(center) {
    const stride = this.stride;
    const radius = this.flatCoordinates[stride] - this.flatCoordinates[0];
    const flatCoordinates = center.slice();
    flatCoordinates[stride] = flatCoordinates[0] + radius;
    for (let i = 1; i < stride; ++i) {
      flatCoordinates[stride + i] = center[i];
    }
    this.setFlatCoordinates(this.layout, flatCoordinates);
    this.changed();
  }
  setCenterAndRadius(center, radius, layout) {
    this.setLayout(layout, center, 0);
    if (!this.flatCoordinates) {
      this.flatCoordinates = [];
    }
    const flatCoordinates = this.flatCoordinates;
    let offset = deflateCoordinate(flatCoordinates, 0, center, this.stride);
    flatCoordinates[offset++] = flatCoordinates[0] + radius;
    for (let i = 1, ii = this.stride; i < ii; ++i) {
      flatCoordinates[offset++] = flatCoordinates[i];
    }
    flatCoordinates.length = offset;
    this.changed();
  }
  getCoordinates() {
    return null;
  }
  setCoordinates(coordinates2, layout) {
  }
  setRadius(radius) {
    this.flatCoordinates[this.stride] = this.flatCoordinates[0] + radius;
    this.changed();
  }
  rotate(angle, anchor) {
    const center = this.getCenter();
    const stride = this.getStride();
    this.setCenter(
      rotate(center, 0, center.length, stride, angle, anchor, center)
    );
    this.changed();
  }
  translate(deltaX, deltaY) {
    const center = this.getCenter();
    const stride = this.getStride();
    this.setCenter(
      translate(center, 0, center.length, stride, deltaX, deltaY, center)
    );
    this.changed();
  }
}
Circle.prototype.transform;
const Circle$1 = Circle;
class CreateCircleLayer extends createOlLayer {
  constructor(id, position, stylesObj) {
    super(id, stylesObj);
    __publicField(this, "position");
    __publicField(this, "fillColor");
    __publicField(this, "strokeColor");
    __publicField(this, "strokeWidth");
    __publicField(this, "lineDash");
    __publicField(this, "radius");
    __publicField(this, "scale");
    __publicField(this, "rotation");
    __publicField(this, "isAuto");
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
  getGeometry() {
    return new Point$1(this.position.value);
  }
  setGeoPosition(position) {
    this.geometry.setCoordinates(gyMapUtils.formatLonLatToPosition(position));
  }
  getStyle() {
    const s = new Style$1({
      image: new Circle$2({
        radius: this.radius.value || 5,
        fill: this.fillColor.value ? new Fill$1({
          color: this.fillColor.value
        }) : void 0,
        stroke: this.strokeColor.value ? new Stroke$1({
          color: this.strokeColor.value,
          width: this.strokeWidth.value
        }) : void 0,
        scale: this.scale.value,
        rotation: this.rotation.value
      })
    });
    return this.isAuto.value ? (feature2, resolution) => {
      s.getImage().setScale(1 / Math.pow(resolution, 1));
      return s;
    } : s;
  }
}
const layerProps$3 = {
  ...layerProps$4,
  position: {
    type: Array,
    default: () => []
  },
  fillColor: {
    type: String,
    default: ""
  },
  strokeColor: {
    type: String,
    default: ""
  },
  strokeWidth: {
    type: Number,
    default: 3
  },
  scale: {
    type: [Number, Array],
    default: 1
  },
  radius: {
    type: Number,
    default: 5
  },
  rotation: {
    type: Number,
    default: 0
  }
};
const _sfc_main$4 = defineComponent({
  name: "GymapCircle",
  props: {
    ...layerProps$3
  },
  setup(props) {
    const { proxy } = getCurrentInstance();
    const mapId = proxy.$parent.id;
    let layerObj = null;
    onMounted(() => {
      layerObj = new CreateCircleLayer(mapId, props.position, props);
      const runTask = proxy.$parent.runTask;
      if (runTask) {
        runTask(layerObj, props);
      }
    });
    const destory = () => {
      layerObj == null ? void 0 : layerObj.destory();
      layerObj = null;
    };
    onBeforeUnmount(() => {
      destory();
      const destoryTask = proxy.$parent.destory;
      if (destoryTask) {
        destoryTask();
      }
    });
  }
});
function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
  return null;
}
const GymapCircle = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$4]]);
class CreateTextLayer$1 extends createOlLayer {
  constructor(id, position, stylesObj) {
    super(id, stylesObj);
    __publicField(this, "position");
    __publicField(this, "text");
    __publicField(this, "font");
    __publicField(this, "offsetX");
    __publicField(this, "offsetY");
    __publicField(this, "scale");
    __publicField(this, "rotation");
    __publicField(this, "textAlign");
    __publicField(this, "textBaseline");
    __publicField(this, "fillColor");
    __publicField(this, "strokeColor");
    __publicField(this, "strokeWidth");
    __publicField(this, "backgroundFillColor");
    __publicField(this, "backgroundStrokeColor");
    __publicField(this, "backgroundStrokeWidth");
    __publicField(this, "padding");
    __publicField(this, "isAuto");
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
  getGeometry() {
    return new Point$1(this.position.value);
  }
  setGeoPosition(position) {
    this.geometry.setCoordinates(gyMapUtils.formatLonLatToPosition(position));
  }
  getStyle() {
    const s = new Style$1({
      text: new Text$1({
        text: this.text.value,
        font: this.font.value,
        offsetX: this.offsetX.value,
        offsetY: this.offsetY.value,
        placement: "point",
        scale: this.scale.value,
        rotation: this.rotation.value,
        textAlign: this.textAlign.value,
        textBaseline: this.textBaseline.value,
        fill: this.fillColor.value ? new Fill$1({
          color: this.fillColor.value
        }) : void 0,
        stroke: this.strokeColor.value ? new Stroke$1({
          color: this.strokeColor.value,
          width: this.strokeWidth.value
        }) : void 0,
        backgroundFill: this.backgroundFillColor.value ? new Fill$1({
          color: this.backgroundFillColor.value
        }) : void 0,
        backgroundStroke: this.backgroundStrokeColor.value ? new Stroke$1({
          color: this.backgroundStrokeColor.value,
          width: this.backgroundStrokeWidth.value
        }) : void 0,
        padding: this.padding.value
      })
    });
    return this.isAuto.value ? (feature2, resolution) => {
      s.getText().setScale(1 / Math.pow(resolution, 1));
      return s;
    } : s;
  }
}
const layerProps$2 = {
  ...layerProps$4,
  position: {
    type: Array,
    default: () => []
  },
  text: {
    type: String,
    default: ""
  },
  font: {
    type: String,
    default: ""
  },
  offsetX: {
    type: Number,
    default: 0
  },
  offsetY: {
    type: Number,
    default: 0
  },
  scale: {
    type: Number,
    default: 1
  },
  rotation: {
    type: Number,
    default: 0
  },
  textAlign: {
    type: String,
    default: ""
  },
  textBaseline: {
    type: String,
    default: ""
  },
  fillColor: {
    type: String,
    default: ""
  },
  strokeColor: {
    type: String,
    default: ""
  },
  strokeWidth: {
    type: Number,
    default: 5
  },
  backgroundFillColor: {
    type: String,
    default: ""
  },
  backgroundStrokeColor: {
    type: String,
    default: ""
  },
  backgroundStrokeWidth: {
    type: Number,
    default: 5
  },
  padding: {
    type: Array,
    default: () => [0, 0, 0, 0]
  }
};
const _sfc_main$3 = defineComponent({
  name: "GymapText",
  props: {
    ...layerProps$2
  },
  setup(props) {
    const { proxy } = getCurrentInstance();
    const mapId = proxy.$parent.id;
    let layerObj = null;
    onMounted(() => {
      layerObj = new CreateTextLayer$1(mapId, props.position, props);
      const runTask = proxy.$parent.runTask;
      if (runTask) {
        runTask(layerObj, props);
      }
    });
    const destory = () => {
      layerObj.destory();
      layerObj = null;
    };
    onBeforeUnmount(() => {
      destory();
      const destoryTask = proxy.$parent.destory;
      if (destoryTask) {
        destoryTask();
      }
    });
  }
});
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
  return null;
}
const GymapText = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3]]);
class CreateTextLayer extends createOlLayer {
  constructor(id, position, stylesObj) {
    super(id, stylesObj);
    __publicField(this, "position");
    __publicField(this, "src");
    __publicField(this, "anchor");
    __publicField(this, "displacement");
    __publicField(this, "scale");
    __publicField(this, "rotation");
    __publicField(this, "isAuto");
    this.position = computed(() => gyMapUtils.formatLonLatToPosition(position));
    this.src = computed(() => stylesObj.src);
    this.anchor = computed(() => stylesObj.anchor);
    this.displacement = computed(() => stylesObj.displacement);
    this.scale = computed(() => stylesObj.scale);
    this.rotation = computed(() => stylesObj.rotation);
    this.isAuto = computed(() => stylesObj.isAuto);
    this.draw();
  }
  getGeometry() {
    return new Point$1(this.position.value);
  }
  setGeoPosition(position) {
    this.geometry.setCoordinates(gyMapUtils.formatLonLatToPosition(position));
  }
  getStyle() {
    const s = new Style$1({
      image: new Icon$1({
        crossOrigin: "anonymous",
        src: this.src.value,
        anchor: this.anchor.value,
        displacement: this.displacement.value,
        scale: this.scale.value,
        rotation: this.rotation.value
      })
    });
    return this.isAuto.value ? (feature2, resolution) => {
      s.getImage().setScale(1 / Math.pow(resolution, 1));
      return s;
    } : s;
  }
}
const layerProps$1 = {
  ...layerProps$4,
  position: {
    type: Array,
    default: () => []
  },
  src: {
    type: String,
    default: ""
  },
  anchor: {
    type: Array,
    default: () => [0.5, 0.5]
  },
  displacement: {
    type: Array,
    default: () => [0, 0]
  },
  scale: {
    type: Number,
    default: 1
  },
  rotation: {
    type: Number,
    default: 0
  }
};
const _sfc_main$2 = defineComponent({
  name: "GymapImage",
  props: {
    ...layerProps$1
  },
  setup(props) {
    const { proxy } = getCurrentInstance();
    const mapId = proxy.$parent.id;
    let layerObj = null;
    onMounted(() => {
      layerObj = new CreateTextLayer(mapId, props.position, props);
      const runTask = proxy.$parent.runTask;
      if (runTask) {
        runTask(layerObj, props);
      }
    });
    const destory = () => {
      layerObj.destory();
      layerObj = null;
    };
    onBeforeUnmount(() => {
      destory();
      const destoryTask = proxy.$parent.destory;
      if (destoryTask) {
        destoryTask();
      }
    });
  }
});
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", null, [
    renderSlot(_ctx.$slots, "default")
  ]);
}
const GymapImage = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2]]);
const InteractionProperty = {
  ACTIVE: "active"
};
function easeIn(t) {
  return Math.pow(t, 3);
}
function easeOut(t) {
  return 1 - easeIn(1 - t);
}
function inAndOut(t) {
  return 3 * t * t - 2 * t * t * t;
}
function linear(t) {
  return t;
}
class Interaction extends BaseObject$1 {
  constructor(options) {
    super();
    this.on;
    this.once;
    this.un;
    if (options && options.handleEvent) {
      this.handleEvent = options.handleEvent;
    }
    this.map_ = null;
    this.setActive(true);
  }
  getActive() {
    return this.get(InteractionProperty.ACTIVE);
  }
  getMap() {
    return this.map_;
  }
  handleEvent(mapBrowserEvent) {
    return true;
  }
  setActive(active) {
    this.set(InteractionProperty.ACTIVE, active);
  }
  setMap(map) {
    this.map_ = map;
  }
}
function pan(view, delta, duration) {
  const currentCenter = view.getCenterInternal();
  if (currentCenter) {
    const center = [currentCenter[0] + delta[0], currentCenter[1] + delta[1]];
    view.animateInternal({
      duration: duration !== void 0 ? duration : 250,
      easing: linear,
      center: view.getConstrainedCenter(center)
    });
  }
}
function zoomByDelta(view, delta, anchor, duration) {
  const currentZoom = view.getZoom();
  if (currentZoom === void 0) {
    return;
  }
  const newZoom = view.getConstrainedZoom(currentZoom + delta);
  const newResolution = view.getResolutionForZoom(newZoom);
  if (view.getAnimating()) {
    view.cancelAnimations();
  }
  view.animate({
    resolution: newResolution,
    anchor,
    duration: duration !== void 0 ? duration : 250,
    easing: easeOut
  });
}
const Interaction$1 = Interaction;
const MapBrowserEventType = {
  SINGLECLICK: "singleclick",
  CLICK: EventType.CLICK,
  DBLCLICK: EventType.DBLCLICK,
  POINTERDRAG: "pointerdrag",
  POINTERMOVE: "pointermove",
  POINTERDOWN: "pointerdown",
  POINTERUP: "pointerup",
  POINTEROVER: "pointerover",
  POINTEROUT: "pointerout",
  POINTERENTER: "pointerenter",
  POINTERLEAVE: "pointerleave",
  POINTERCANCEL: "pointercancel"
};
class DoubleClickZoom extends Interaction$1 {
  constructor(options) {
    super();
    options = options ? options : {};
    this.delta_ = options.delta ? options.delta : 1;
    this.duration_ = options.duration !== void 0 ? options.duration : 250;
  }
  handleEvent(mapBrowserEvent) {
    let stopEvent = false;
    if (mapBrowserEvent.type == MapBrowserEventType.DBLCLICK) {
      const browserEvent = mapBrowserEvent.originalEvent;
      const map = mapBrowserEvent.map;
      const anchor = mapBrowserEvent.coordinate;
      const delta = browserEvent.shiftKey ? -this.delta_ : this.delta_;
      const view = map.getView();
      zoomByDelta(view, delta, anchor, this.duration_);
      browserEvent.preventDefault();
      stopEvent = true;
    }
    return !stopEvent;
  }
}
const DoubleClickZoom$1 = DoubleClickZoom;
class PointerInteraction extends Interaction$1 {
  constructor(options) {
    options = options ? options : {};
    super(
      options
    );
    if (options.handleDownEvent) {
      this.handleDownEvent = options.handleDownEvent;
    }
    if (options.handleDragEvent) {
      this.handleDragEvent = options.handleDragEvent;
    }
    if (options.handleMoveEvent) {
      this.handleMoveEvent = options.handleMoveEvent;
    }
    if (options.handleUpEvent) {
      this.handleUpEvent = options.handleUpEvent;
    }
    if (options.stopDown) {
      this.stopDown = options.stopDown;
    }
    this.handlingDownUpSequence = false;
    this.targetPointers = [];
  }
  getPointerCount() {
    return this.targetPointers.length;
  }
  handleDownEvent(mapBrowserEvent) {
    return false;
  }
  handleDragEvent(mapBrowserEvent) {
  }
  handleEvent(mapBrowserEvent) {
    if (!mapBrowserEvent.originalEvent) {
      return true;
    }
    let stopEvent = false;
    this.updateTrackedPointers_(mapBrowserEvent);
    if (this.handlingDownUpSequence) {
      if (mapBrowserEvent.type == MapBrowserEventType.POINTERDRAG) {
        this.handleDragEvent(mapBrowserEvent);
        mapBrowserEvent.originalEvent.preventDefault();
      } else if (mapBrowserEvent.type == MapBrowserEventType.POINTERUP) {
        const handledUp = this.handleUpEvent(mapBrowserEvent);
        this.handlingDownUpSequence = handledUp && this.targetPointers.length > 0;
      }
    } else {
      if (mapBrowserEvent.type == MapBrowserEventType.POINTERDOWN) {
        const handled = this.handleDownEvent(mapBrowserEvent);
        this.handlingDownUpSequence = handled;
        stopEvent = this.stopDown(handled);
      } else if (mapBrowserEvent.type == MapBrowserEventType.POINTERMOVE) {
        this.handleMoveEvent(mapBrowserEvent);
      }
    }
    return !stopEvent;
  }
  handleMoveEvent(mapBrowserEvent) {
  }
  handleUpEvent(mapBrowserEvent) {
    return false;
  }
  stopDown(handled) {
    return handled;
  }
  updateTrackedPointers_(mapBrowserEvent) {
    if (mapBrowserEvent.activePointers) {
      this.targetPointers = mapBrowserEvent.activePointers;
    }
  }
}
function centroid(pointerEvents) {
  const length = pointerEvents.length;
  let clientX = 0;
  let clientY = 0;
  for (let i = 0; i < length; i++) {
    clientX += pointerEvents[i].clientX;
    clientY += pointerEvents[i].clientY;
  }
  return [clientX / length, clientY / length];
}
const PointerInteraction$1 = PointerInteraction;
class RenderBox extends Disposable$1 {
  constructor(className) {
    super();
    this.geometry_ = null;
    this.element_ = document.createElement("div");
    this.element_.style.position = "absolute";
    this.element_.style.pointerEvents = "auto";
    this.element_.className = "ol-box " + className;
    this.map_ = null;
    this.startPixel_ = null;
    this.endPixel_ = null;
  }
  disposeInternal() {
    this.setMap(null);
  }
  render_() {
    const startPixel = this.startPixel_;
    const endPixel = this.endPixel_;
    const px = "px";
    const style = this.element_.style;
    style.left = Math.min(startPixel[0], endPixel[0]) + px;
    style.top = Math.min(startPixel[1], endPixel[1]) + px;
    style.width = Math.abs(endPixel[0] - startPixel[0]) + px;
    style.height = Math.abs(endPixel[1] - startPixel[1]) + px;
  }
  setMap(map) {
    if (this.map_) {
      this.map_.getOverlayContainer().removeChild(this.element_);
      const style = this.element_.style;
      style.left = "inherit";
      style.top = "inherit";
      style.width = "inherit";
      style.height = "inherit";
    }
    this.map_ = map;
    if (this.map_) {
      this.map_.getOverlayContainer().appendChild(this.element_);
    }
  }
  setPixels(startPixel, endPixel) {
    this.startPixel_ = startPixel;
    this.endPixel_ = endPixel;
    this.createOrUpdateGeometry();
    this.render_();
  }
  createOrUpdateGeometry() {
    const startPixel = this.startPixel_;
    const endPixel = this.endPixel_;
    const pixels = [
      startPixel,
      [startPixel[0], endPixel[1]],
      endPixel,
      [endPixel[0], startPixel[1]]
    ];
    const coordinates2 = pixels.map(
      this.map_.getCoordinateFromPixelInternal,
      this.map_
    );
    coordinates2[4] = coordinates2[0].slice();
    if (!this.geometry_) {
      this.geometry_ = new Polygon$1([coordinates2]);
    } else {
      this.geometry_.setCoordinates([coordinates2]);
    }
  }
  getGeometry() {
    return this.geometry_;
  }
}
const RenderBox$1 = RenderBox;
function all(var_args) {
  const conditions = arguments;
  return function(event) {
    let pass = true;
    for (let i = 0, ii = conditions.length; i < ii; ++i) {
      pass = pass && conditions[i](event);
      if (!pass) {
        break;
      }
    }
    return pass;
  };
}
const altKeyOnly = function(mapBrowserEvent) {
  const originalEvent = mapBrowserEvent.originalEvent;
  return originalEvent.altKey && !(originalEvent.metaKey || originalEvent.ctrlKey) && !originalEvent.shiftKey;
};
const altShiftKeysOnly = function(mapBrowserEvent) {
  const originalEvent = mapBrowserEvent.originalEvent;
  return originalEvent.altKey && !(originalEvent.metaKey || originalEvent.ctrlKey) && originalEvent.shiftKey;
};
const focus = function(event) {
  const targetElement = event.map.getTargetElement();
  const activeElement = event.map.getOwnerDocument().activeElement;
  return targetElement.contains(activeElement);
};
const focusWithTabindex = function(event) {
  return event.map.getTargetElement().hasAttribute("tabindex") ? focus(event) : true;
};
const always = TRUE;
const mouseActionButton = function(mapBrowserEvent) {
  const originalEvent = mapBrowserEvent.originalEvent;
  return originalEvent.button == 0 && !(WEBKIT && MAC && originalEvent.ctrlKey);
};
const never = FALSE;
const singleClick = function(mapBrowserEvent) {
  return mapBrowserEvent.type == MapBrowserEventType.SINGLECLICK;
};
const noModifierKeys = function(mapBrowserEvent) {
  const originalEvent = mapBrowserEvent.originalEvent;
  return !originalEvent.altKey && !(originalEvent.metaKey || originalEvent.ctrlKey) && !originalEvent.shiftKey;
};
const shiftKeyOnly = function(mapBrowserEvent) {
  const originalEvent = mapBrowserEvent.originalEvent;
  return !originalEvent.altKey && !(originalEvent.metaKey || originalEvent.ctrlKey) && originalEvent.shiftKey;
};
const targetNotEditable = function(mapBrowserEvent) {
  const originalEvent = mapBrowserEvent.originalEvent;
  const tagName = originalEvent.target.tagName;
  return tagName !== "INPUT" && tagName !== "SELECT" && tagName !== "TEXTAREA" && !originalEvent.target.isContentEditable;
};
const mouseOnly = function(mapBrowserEvent) {
  const pointerEvent = mapBrowserEvent.originalEvent;
  assert(pointerEvent !== void 0, 56);
  return pointerEvent.pointerType == "mouse";
};
const primaryAction = function(mapBrowserEvent) {
  const pointerEvent = mapBrowserEvent.originalEvent;
  assert(pointerEvent !== void 0, 56);
  return pointerEvent.isPrimary && pointerEvent.button === 0;
};
const DragBoxEventType = {
  BOXSTART: "boxstart",
  BOXDRAG: "boxdrag",
  BOXEND: "boxend",
  BOXCANCEL: "boxcancel"
};
class DragBoxEvent extends BaseEvent$1 {
  constructor(type, coordinate, mapBrowserEvent) {
    super(type);
    this.coordinate = coordinate;
    this.mapBrowserEvent = mapBrowserEvent;
  }
}
class DragBox extends PointerInteraction$1 {
  constructor(options) {
    super();
    this.on;
    this.once;
    this.un;
    options = options ? options : {};
    this.box_ = new RenderBox$1(options.className || "ol-dragbox");
    this.minArea_ = options.minArea !== void 0 ? options.minArea : 64;
    if (options.onBoxEnd) {
      this.onBoxEnd = options.onBoxEnd;
    }
    this.startPixel_ = null;
    this.condition_ = options.condition ? options.condition : mouseActionButton;
    this.boxEndCondition_ = options.boxEndCondition ? options.boxEndCondition : this.defaultBoxEndCondition;
  }
  defaultBoxEndCondition(mapBrowserEvent, startPixel, endPixel) {
    const width = endPixel[0] - startPixel[0];
    const height = endPixel[1] - startPixel[1];
    return width * width + height * height >= this.minArea_;
  }
  getGeometry() {
    return this.box_.getGeometry();
  }
  handleDragEvent(mapBrowserEvent) {
    this.box_.setPixels(this.startPixel_, mapBrowserEvent.pixel);
    this.dispatchEvent(
      new DragBoxEvent(
        DragBoxEventType.BOXDRAG,
        mapBrowserEvent.coordinate,
        mapBrowserEvent
      )
    );
  }
  handleUpEvent(mapBrowserEvent) {
    this.box_.setMap(null);
    const completeBox = this.boxEndCondition_(
      mapBrowserEvent,
      this.startPixel_,
      mapBrowserEvent.pixel
    );
    if (completeBox) {
      this.onBoxEnd(mapBrowserEvent);
    }
    this.dispatchEvent(
      new DragBoxEvent(
        completeBox ? DragBoxEventType.BOXEND : DragBoxEventType.BOXCANCEL,
        mapBrowserEvent.coordinate,
        mapBrowserEvent
      )
    );
    return false;
  }
  handleDownEvent(mapBrowserEvent) {
    if (this.condition_(mapBrowserEvent)) {
      this.startPixel_ = mapBrowserEvent.pixel;
      this.box_.setMap(mapBrowserEvent.map);
      this.box_.setPixels(this.startPixel_, this.startPixel_);
      this.dispatchEvent(
        new DragBoxEvent(
          DragBoxEventType.BOXSTART,
          mapBrowserEvent.coordinate,
          mapBrowserEvent
        )
      );
      return true;
    } else {
      return false;
    }
  }
  onBoxEnd(event) {
  }
}
const DragBox$1 = DragBox;
class DragPan extends PointerInteraction$1 {
  constructor(options) {
    super({
      stopDown: FALSE
    });
    options = options ? options : {};
    this.kinetic_ = options.kinetic;
    this.lastCentroid = null;
    this.lastPointersCount_;
    this.panning_ = false;
    const condition = options.condition ? options.condition : all(noModifierKeys, primaryAction);
    this.condition_ = options.onFocusOnly ? all(focusWithTabindex, condition) : condition;
    this.noKinetic_ = false;
  }
  handleDragEvent(mapBrowserEvent) {
    if (!this.panning_) {
      this.panning_ = true;
      this.getMap().getView().beginInteraction();
    }
    const targetPointers = this.targetPointers;
    const centroid$1 = centroid(targetPointers);
    if (targetPointers.length == this.lastPointersCount_) {
      if (this.kinetic_) {
        this.kinetic_.update(centroid$1[0], centroid$1[1]);
      }
      if (this.lastCentroid) {
        const delta = [
          this.lastCentroid[0] - centroid$1[0],
          centroid$1[1] - this.lastCentroid[1]
        ];
        const map = mapBrowserEvent.map;
        const view = map.getView();
        scale$3(delta, view.getResolution());
        rotate$2(delta, view.getRotation());
        view.adjustCenterInternal(delta);
      }
    } else if (this.kinetic_) {
      this.kinetic_.begin();
    }
    this.lastCentroid = centroid$1;
    this.lastPointersCount_ = targetPointers.length;
    mapBrowserEvent.originalEvent.preventDefault();
  }
  handleUpEvent(mapBrowserEvent) {
    const map = mapBrowserEvent.map;
    const view = map.getView();
    if (this.targetPointers.length === 0) {
      if (!this.noKinetic_ && this.kinetic_ && this.kinetic_.end()) {
        const distance2 = this.kinetic_.getDistance();
        const angle = this.kinetic_.getAngle();
        const center = view.getCenterInternal();
        const centerpx = map.getPixelFromCoordinateInternal(center);
        const dest = map.getCoordinateFromPixelInternal([
          centerpx[0] - distance2 * Math.cos(angle),
          centerpx[1] - distance2 * Math.sin(angle)
        ]);
        view.animateInternal({
          center: view.getConstrainedCenter(dest),
          duration: 500,
          easing: easeOut
        });
      }
      if (this.panning_) {
        this.panning_ = false;
        view.endInteraction();
      }
      return false;
    } else {
      if (this.kinetic_) {
        this.kinetic_.begin();
      }
      this.lastCentroid = null;
      return true;
    }
  }
  handleDownEvent(mapBrowserEvent) {
    if (this.targetPointers.length > 0 && this.condition_(mapBrowserEvent)) {
      const map = mapBrowserEvent.map;
      const view = map.getView();
      this.lastCentroid = null;
      if (view.getAnimating()) {
        view.cancelAnimations();
      }
      if (this.kinetic_) {
        this.kinetic_.begin();
      }
      this.noKinetic_ = this.targetPointers.length > 1;
      return true;
    } else {
      return false;
    }
  }
}
const DragPan$1 = DragPan;
function disable(rotation) {
  if (rotation !== void 0) {
    return 0;
  } else {
    return void 0;
  }
}
function none$1(rotation) {
  if (rotation !== void 0) {
    return rotation;
  } else {
    return void 0;
  }
}
function createSnapToN(n) {
  const theta = 2 * Math.PI / n;
  return function(rotation, isMoving) {
    if (isMoving) {
      return rotation;
    }
    if (rotation !== void 0) {
      rotation = Math.floor(rotation / theta + 0.5) * theta;
      return rotation;
    } else {
      return void 0;
    }
  };
}
function createSnapToZero(tolerance) {
  tolerance = tolerance || toRadians(5);
  return function(rotation, isMoving) {
    if (isMoving) {
      return rotation;
    }
    if (rotation !== void 0) {
      if (Math.abs(rotation) <= tolerance) {
        return 0;
      } else {
        return rotation;
      }
    } else {
      return void 0;
    }
  };
}
class DragRotate extends PointerInteraction$1 {
  constructor(options) {
    options = options ? options : {};
    super({
      stopDown: FALSE
    });
    this.condition_ = options.condition ? options.condition : altShiftKeysOnly;
    this.lastAngle_ = void 0;
    this.duration_ = options.duration !== void 0 ? options.duration : 250;
  }
  handleDragEvent(mapBrowserEvent) {
    if (!mouseOnly(mapBrowserEvent)) {
      return;
    }
    const map = mapBrowserEvent.map;
    const view = map.getView();
    if (view.getConstraints().rotation === disable) {
      return;
    }
    const size = map.getSize();
    const offset = mapBrowserEvent.pixel;
    const theta = Math.atan2(size[1] / 2 - offset[1], offset[0] - size[0] / 2);
    if (this.lastAngle_ !== void 0) {
      const delta = theta - this.lastAngle_;
      view.adjustRotationInternal(-delta);
    }
    this.lastAngle_ = theta;
  }
  handleUpEvent(mapBrowserEvent) {
    if (!mouseOnly(mapBrowserEvent)) {
      return true;
    }
    const map = mapBrowserEvent.map;
    const view = map.getView();
    view.endInteraction(this.duration_);
    return false;
  }
  handleDownEvent(mapBrowserEvent) {
    if (!mouseOnly(mapBrowserEvent)) {
      return false;
    }
    if (mouseActionButton(mapBrowserEvent) && this.condition_(mapBrowserEvent)) {
      const map = mapBrowserEvent.map;
      map.getView().beginInteraction();
      this.lastAngle_ = void 0;
      return true;
    } else {
      return false;
    }
  }
}
const DragRotate$1 = DragRotate;
class DragZoom extends DragBox$1 {
  constructor(options) {
    options = options ? options : {};
    const condition = options.condition ? options.condition : shiftKeyOnly;
    super({
      condition,
      className: options.className || "ol-dragzoom",
      minArea: options.minArea
    });
    this.duration_ = options.duration !== void 0 ? options.duration : 200;
    this.out_ = options.out !== void 0 ? options.out : false;
  }
  onBoxEnd(event) {
    const map = this.getMap();
    const view = map.getView();
    let geometry = this.getGeometry();
    if (this.out_) {
      const rotatedExtent = view.rotatedExtentForGeometry(geometry);
      const resolution = view.getResolutionForExtentInternal(rotatedExtent);
      const factor = view.getResolution() / resolution;
      geometry = geometry.clone();
      geometry.scale(factor * factor);
    }
    view.fitInternal(geometry, {
      duration: this.duration_,
      easing: easeOut
    });
  }
}
const DragZoom$1 = DragZoom;
class MapEvent extends BaseEvent$1 {
  constructor(type, map, frameState) {
    super(type);
    this.map = map;
    this.frameState = frameState !== void 0 ? frameState : null;
  }
}
const MapEvent$1 = MapEvent;
class MapBrowserEvent extends MapEvent$1 {
  constructor(type, map, originalEvent, dragging, frameState, activePointers) {
    super(type, map, frameState);
    this.originalEvent = originalEvent;
    this.pixel_ = null;
    this.coordinate_ = null;
    this.dragging = dragging !== void 0 ? dragging : false;
    this.activePointers = activePointers;
  }
  get pixel() {
    if (!this.pixel_) {
      this.pixel_ = this.map.getEventPixel(this.originalEvent);
    }
    return this.pixel_;
  }
  set pixel(pixel) {
    this.pixel_ = pixel;
  }
  get coordinate() {
    if (!this.coordinate_) {
      this.coordinate_ = this.map.getCoordinateFromPixel(this.pixel);
    }
    return this.coordinate_;
  }
  set coordinate(coordinate) {
    this.coordinate_ = coordinate;
  }
  preventDefault() {
    super.preventDefault();
    if ("preventDefault" in this.originalEvent) {
      this.originalEvent.preventDefault();
    }
  }
  stopPropagation() {
    super.stopPropagation();
    if ("stopPropagation" in this.originalEvent) {
      this.originalEvent.stopPropagation();
    }
  }
}
const MapBrowserEvent$1 = MapBrowserEvent;
const DrawEventType = {
  DRAWSTART: "drawstart",
  DRAWEND: "drawend",
  DRAWABORT: "drawabort"
};
class DrawEvent extends BaseEvent$1 {
  constructor(type, feature2) {
    super(type);
    this.feature = feature2;
  }
}
function getTraceTargets(coordinate, features) {
  const targets = [];
  for (let i = 0; i < features.length; ++i) {
    const feature2 = features[i];
    const geometry = feature2.getGeometry();
    appendGeometryTraceTargets(coordinate, geometry, targets);
  }
  return targets;
}
function getSquaredDistance(a, b) {
  return squaredDistance$1(a[0], a[1], b[0], b[1]);
}
function getCoordinate(coordinates2, index2) {
  const count = coordinates2.length;
  if (index2 < 0) {
    return coordinates2[index2 + count];
  }
  if (index2 >= count) {
    return coordinates2[index2 - count];
  }
  return coordinates2[index2];
}
function getCumulativeSquaredDistance(coordinates2, startIndex, endIndex) {
  let lowIndex, highIndex;
  if (startIndex < endIndex) {
    lowIndex = startIndex;
    highIndex = endIndex;
  } else {
    lowIndex = endIndex;
    highIndex = startIndex;
  }
  const lowWholeIndex = Math.ceil(lowIndex);
  const highWholeIndex = Math.floor(highIndex);
  if (lowWholeIndex > highWholeIndex) {
    const start = interpolateCoordinate(coordinates2, lowIndex);
    const end = interpolateCoordinate(coordinates2, highIndex);
    return getSquaredDistance(start, end);
  }
  let sd = 0;
  if (lowIndex < lowWholeIndex) {
    const start = interpolateCoordinate(coordinates2, lowIndex);
    const end = getCoordinate(coordinates2, lowWholeIndex);
    sd += getSquaredDistance(start, end);
  }
  if (highWholeIndex < highIndex) {
    const start = getCoordinate(coordinates2, highWholeIndex);
    const end = interpolateCoordinate(coordinates2, highIndex);
    sd += getSquaredDistance(start, end);
  }
  for (let i = lowWholeIndex; i < highWholeIndex - 1; ++i) {
    const start = getCoordinate(coordinates2, i);
    const end = getCoordinate(coordinates2, i + 1);
    sd += getSquaredDistance(start, end);
  }
  return sd;
}
function appendGeometryTraceTargets(coordinate, geometry, targets) {
  if (geometry instanceof LineString$1) {
    appendTraceTarget(coordinate, geometry.getCoordinates(), false, targets);
    return;
  }
  if (geometry instanceof MultiLineString$1) {
    const coordinates2 = geometry.getCoordinates();
    for (let i = 0, ii = coordinates2.length; i < ii; ++i) {
      appendTraceTarget(coordinate, coordinates2[i], false, targets);
    }
    return;
  }
  if (geometry instanceof Polygon$1) {
    const coordinates2 = geometry.getCoordinates();
    for (let i = 0, ii = coordinates2.length; i < ii; ++i) {
      appendTraceTarget(coordinate, coordinates2[i], true, targets);
    }
    return;
  }
  if (geometry instanceof MultiPolygon$1) {
    const polys = geometry.getCoordinates();
    for (let i = 0, ii = polys.length; i < ii; ++i) {
      const coordinates2 = polys[i];
      for (let j = 0, jj = coordinates2.length; j < jj; ++j) {
        appendTraceTarget(coordinate, coordinates2[j], true, targets);
      }
    }
    return;
  }
  if (geometry instanceof GeometryCollection$1) {
    const geometries = geometry.getGeometries();
    for (let i = 0; i < geometries.length; ++i) {
      appendGeometryTraceTargets(coordinate, geometries[i], targets);
    }
    return;
  }
}
const sharedUpdateInfo = { index: -1, endIndex: NaN };
function getTraceTargetUpdate(coordinate, traceState, map, snapTolerance) {
  const x = coordinate[0];
  const y = coordinate[1];
  let closestTargetDistance = Infinity;
  let newTargetIndex = -1;
  let newEndIndex = NaN;
  for (let targetIndex = 0; targetIndex < traceState.targets.length; ++targetIndex) {
    const target = traceState.targets[targetIndex];
    const coordinates2 = target.coordinates;
    let minSegmentDistance = Infinity;
    let endIndex;
    for (let coordinateIndex = 0; coordinateIndex < coordinates2.length - 1; ++coordinateIndex) {
      const start = coordinates2[coordinateIndex];
      const end = coordinates2[coordinateIndex + 1];
      const rel = getPointSegmentRelationship(x, y, start, end);
      if (rel.squaredDistance < minSegmentDistance) {
        minSegmentDistance = rel.squaredDistance;
        endIndex = coordinateIndex + rel.along;
      }
    }
    if (minSegmentDistance < closestTargetDistance) {
      closestTargetDistance = minSegmentDistance;
      if (target.ring && traceState.targetIndex === targetIndex) {
        if (target.endIndex > target.startIndex) {
          if (endIndex < target.startIndex) {
            endIndex += coordinates2.length;
          }
        } else if (target.endIndex < target.startIndex) {
          if (endIndex > target.startIndex) {
            endIndex -= coordinates2.length;
          }
        }
      }
      newEndIndex = endIndex;
      newTargetIndex = targetIndex;
    }
  }
  const newTarget = traceState.targets[newTargetIndex];
  let considerBothDirections = newTarget.ring;
  if (traceState.targetIndex === newTargetIndex && considerBothDirections) {
    const newCoordinate = interpolateCoordinate(
      newTarget.coordinates,
      newEndIndex
    );
    const pixel = map.getPixelFromCoordinate(newCoordinate);
    if (distance(pixel, traceState.startPx) > snapTolerance) {
      considerBothDirections = false;
    }
  }
  if (considerBothDirections) {
    const coordinates2 = newTarget.coordinates;
    const count = coordinates2.length;
    const startIndex = newTarget.startIndex;
    const endIndex = newEndIndex;
    if (startIndex < endIndex) {
      const forwardDistance = getCumulativeSquaredDistance(
        coordinates2,
        startIndex,
        endIndex
      );
      const reverseDistance = getCumulativeSquaredDistance(
        coordinates2,
        startIndex,
        endIndex - count
      );
      if (reverseDistance < forwardDistance) {
        newEndIndex -= count;
      }
    } else {
      const reverseDistance = getCumulativeSquaredDistance(
        coordinates2,
        startIndex,
        endIndex
      );
      const forwardDistance = getCumulativeSquaredDistance(
        coordinates2,
        startIndex,
        endIndex + count
      );
      if (forwardDistance < reverseDistance) {
        newEndIndex += count;
      }
    }
  }
  sharedUpdateInfo.index = newTargetIndex;
  sharedUpdateInfo.endIndex = newEndIndex;
  return sharedUpdateInfo;
}
function appendTraceTarget(coordinate, coordinates2, ring, targets) {
  const x = coordinate[0];
  const y = coordinate[1];
  for (let i = 0, ii = coordinates2.length - 1; i < ii; ++i) {
    const start = coordinates2[i];
    const end = coordinates2[i + 1];
    const rel = getPointSegmentRelationship(x, y, start, end);
    if (rel.squaredDistance === 0) {
      const index2 = i + rel.along;
      targets.push({
        coordinates: coordinates2,
        ring,
        startIndex: index2,
        endIndex: index2
      });
      return;
    }
  }
}
const sharedRel = { along: 0, squaredDistance: 0 };
function getPointSegmentRelationship(x, y, start, end) {
  const x1 = start[0];
  const y1 = start[1];
  const x2 = end[0];
  const y2 = end[1];
  const dx = x2 - x1;
  const dy = y2 - y1;
  let along = 0;
  let px = x1;
  let py = y1;
  if (dx !== 0 || dy !== 0) {
    along = clamp(((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy), 0, 1);
    px += dx * along;
    py += dy * along;
  }
  sharedRel.along = along;
  sharedRel.squaredDistance = toFixed(squaredDistance$1(x, y, px, py), 10);
  return sharedRel;
}
function interpolateCoordinate(coordinates2, index2) {
  const count = coordinates2.length;
  let startIndex = Math.floor(index2);
  const along = index2 - startIndex;
  if (startIndex >= count) {
    startIndex -= count;
  } else if (startIndex < 0) {
    startIndex += count;
  }
  let endIndex = startIndex + 1;
  if (endIndex >= count) {
    endIndex -= count;
  }
  const start = coordinates2[startIndex];
  const x0 = start[0];
  const y0 = start[1];
  const end = coordinates2[endIndex];
  const dx = end[0] - x0;
  const dy = end[1] - y0;
  return [x0 + dx * along, y0 + dy * along];
}
class Draw extends PointerInteraction$1 {
  constructor(options) {
    const pointerOptions = options;
    if (!pointerOptions.stopDown) {
      pointerOptions.stopDown = FALSE;
    }
    super(pointerOptions);
    this.on;
    this.once;
    this.un;
    this.shouldHandle_ = false;
    this.downPx_ = null;
    this.downTimeout_;
    this.lastDragTime_;
    this.pointerType_;
    this.freehand_ = false;
    this.source_ = options.source ? options.source : null;
    this.features_ = options.features ? options.features : null;
    this.snapTolerance_ = options.snapTolerance ? options.snapTolerance : 12;
    this.type_ = options.type;
    this.mode_ = getMode(this.type_);
    this.stopClick_ = !!options.stopClick;
    this.minPoints_ = options.minPoints ? options.minPoints : this.mode_ === "Polygon" ? 3 : 2;
    this.maxPoints_ = this.mode_ === "Circle" ? 2 : options.maxPoints ? options.maxPoints : Infinity;
    this.finishCondition_ = options.finishCondition ? options.finishCondition : TRUE;
    this.geometryLayout_ = options.geometryLayout ? options.geometryLayout : "XY";
    let geometryFunction = options.geometryFunction;
    if (!geometryFunction) {
      const mode = this.mode_;
      if (mode === "Circle") {
        geometryFunction = function(coordinates2, geometry, projection) {
          const circle = geometry ? geometry : new Circle$1([NaN, NaN]);
          const center = fromUserCoordinate(coordinates2[0]);
          const squaredLength = squaredDistance(
            center,
            fromUserCoordinate(coordinates2[coordinates2.length - 1])
          );
          circle.setCenterAndRadius(
            center,
            Math.sqrt(squaredLength),
            this.geometryLayout_
          );
          return circle;
        };
      } else {
        let Constructor;
        if (mode === "Point") {
          Constructor = Point$1;
        } else if (mode === "LineString") {
          Constructor = LineString$1;
        } else if (mode === "Polygon") {
          Constructor = Polygon$1;
        }
        geometryFunction = function(coordinates2, geometry, projection) {
          if (geometry) {
            if (mode === "Polygon") {
              if (coordinates2[0].length) {
                geometry.setCoordinates(
                  [coordinates2[0].concat([coordinates2[0][0]])],
                  this.geometryLayout_
                );
              } else {
                geometry.setCoordinates([], this.geometryLayout_);
              }
            } else {
              geometry.setCoordinates(coordinates2, this.geometryLayout_);
            }
          } else {
            geometry = new Constructor(coordinates2, this.geometryLayout_);
          }
          return geometry;
        };
      }
    }
    this.geometryFunction_ = geometryFunction;
    this.dragVertexDelay_ = options.dragVertexDelay !== void 0 ? options.dragVertexDelay : 500;
    this.finishCoordinate_ = null;
    this.sketchFeature_ = null;
    this.sketchPoint_ = null;
    this.sketchCoords_ = null;
    this.sketchLine_ = null;
    this.sketchLineCoords_ = null;
    this.squaredClickTolerance_ = options.clickTolerance ? options.clickTolerance * options.clickTolerance : 36;
    this.overlay_ = new LayerVector({
      source: new VectorSource$1({
        useSpatialIndex: false,
        wrapX: options.wrapX ? options.wrapX : false
      }),
      style: options.style ? options.style : getDefaultStyleFunction$1(),
      updateWhileInteracting: true
    });
    this.geometryName_ = options.geometryName;
    this.condition_ = options.condition ? options.condition : noModifierKeys;
    this.freehandCondition_;
    if (options.freehand) {
      this.freehandCondition_ = always;
    } else {
      this.freehandCondition_ = options.freehandCondition ? options.freehandCondition : shiftKeyOnly;
    }
    this.traceCondition_;
    this.setTrace(options.trace || false);
    this.traceState_ = { active: false };
    this.traceSource_ = options.traceSource || options.source || null;
    this.addChangeListener(InteractionProperty.ACTIVE, this.updateState_);
  }
  setTrace(trace) {
    let condition;
    if (!trace) {
      condition = never;
    } else if (trace === true) {
      condition = always;
    } else {
      condition = trace;
    }
    this.traceCondition_ = condition;
  }
  setMap(map) {
    super.setMap(map);
    this.updateState_();
  }
  getOverlay() {
    return this.overlay_;
  }
  handleEvent(event) {
    if (event.originalEvent.type === EventType.CONTEXTMENU) {
      event.originalEvent.preventDefault();
    }
    this.freehand_ = this.mode_ !== "Point" && this.freehandCondition_(event);
    let move = event.type === MapBrowserEventType.POINTERMOVE;
    let pass = true;
    if (!this.freehand_ && this.lastDragTime_ && event.type === MapBrowserEventType.POINTERDRAG) {
      const now = Date.now();
      if (now - this.lastDragTime_ >= this.dragVertexDelay_) {
        this.downPx_ = event.pixel;
        this.shouldHandle_ = !this.freehand_;
        move = true;
      } else {
        this.lastDragTime_ = void 0;
      }
      if (this.shouldHandle_ && this.downTimeout_ !== void 0) {
        clearTimeout(this.downTimeout_);
        this.downTimeout_ = void 0;
      }
    }
    if (this.freehand_ && event.type === MapBrowserEventType.POINTERDRAG && this.sketchFeature_ !== null) {
      this.addToDrawing_(event.coordinate);
      pass = false;
    } else if (this.freehand_ && event.type === MapBrowserEventType.POINTERDOWN) {
      pass = false;
    } else if (move && this.getPointerCount() < 2) {
      pass = event.type === MapBrowserEventType.POINTERMOVE;
      if (pass && this.freehand_) {
        this.handlePointerMove_(event);
        if (this.shouldHandle_) {
          event.originalEvent.preventDefault();
        }
      } else if (event.originalEvent.pointerType === "mouse" || event.type === MapBrowserEventType.POINTERDRAG && this.downTimeout_ === void 0) {
        this.handlePointerMove_(event);
      }
    } else if (event.type === MapBrowserEventType.DBLCLICK) {
      pass = false;
    }
    return super.handleEvent(event) && pass;
  }
  handleDownEvent(event) {
    this.shouldHandle_ = !this.freehand_;
    if (this.freehand_) {
      this.downPx_ = event.pixel;
      if (!this.finishCoordinate_) {
        this.startDrawing_(event.coordinate);
      }
      return true;
    }
    if (!this.condition_(event)) {
      this.lastDragTime_ = void 0;
      return false;
    }
    this.lastDragTime_ = Date.now();
    this.downTimeout_ = setTimeout(
      function() {
        this.handlePointerMove_(
          new MapBrowserEvent$1(
            MapBrowserEventType.POINTERMOVE,
            event.map,
            event.originalEvent,
            false,
            event.frameState
          )
        );
      }.bind(this),
      this.dragVertexDelay_
    );
    this.downPx_ = event.pixel;
    return true;
  }
  deactivateTrace_() {
    this.traceState_ = { active: false };
  }
  toggleTraceState_(event) {
    if (!this.traceSource_ || !this.traceCondition_(event)) {
      return;
    }
    if (this.traceState_.active) {
      this.deactivateTrace_();
      return;
    }
    const map = this.getMap();
    const lowerLeft = map.getCoordinateFromPixel([
      event.pixel[0] - this.snapTolerance_,
      event.pixel[1] + this.snapTolerance_
    ]);
    const upperRight = map.getCoordinateFromPixel([
      event.pixel[0] + this.snapTolerance_,
      event.pixel[1] - this.snapTolerance_
    ]);
    const extent = boundingExtent([lowerLeft, upperRight]);
    const features = this.traceSource_.getFeaturesInExtent(extent);
    if (features.length === 0) {
      return;
    }
    const targets = getTraceTargets(event.coordinate, features);
    if (targets.length) {
      this.traceState_ = {
        active: true,
        startPx: event.pixel.slice(),
        targets,
        targetIndex: -1
      };
    }
  }
  addOrRemoveTracedCoordinates_(target, endIndex) {
    const previouslyForward = target.startIndex <= target.endIndex;
    const currentlyForward = target.startIndex <= endIndex;
    if (previouslyForward === currentlyForward) {
      if (previouslyForward && endIndex > target.endIndex || !previouslyForward && endIndex < target.endIndex) {
        this.addTracedCoordinates_(target, target.endIndex, endIndex);
      } else if (previouslyForward && endIndex < target.endIndex || !previouslyForward && endIndex > target.endIndex) {
        this.removeTracedCoordinates_(endIndex, target.endIndex);
      }
    } else {
      this.removeTracedCoordinates_(target.startIndex, target.endIndex);
      this.addTracedCoordinates_(target, target.startIndex, endIndex);
    }
  }
  removeTracedCoordinates_(fromIndex, toIndex) {
    if (fromIndex === toIndex) {
      return;
    }
    let remove = 0;
    if (fromIndex < toIndex) {
      const start = Math.ceil(fromIndex);
      let end = Math.floor(toIndex);
      if (end === toIndex) {
        end -= 1;
      }
      remove = end - start + 1;
    } else {
      const start = Math.floor(fromIndex);
      let end = Math.ceil(toIndex);
      if (end === toIndex) {
        end += 1;
      }
      remove = start - end + 1;
    }
    if (remove > 0) {
      this.removeLastPoints_(remove);
    }
  }
  addTracedCoordinates_(target, fromIndex, toIndex) {
    if (fromIndex === toIndex) {
      return;
    }
    const coordinates2 = [];
    if (fromIndex < toIndex) {
      const start = Math.ceil(fromIndex);
      let end = Math.floor(toIndex);
      if (end === toIndex) {
        end -= 1;
      }
      for (let i = start; i <= end; ++i) {
        coordinates2.push(getCoordinate(target.coordinates, i));
      }
    } else {
      const start = Math.floor(fromIndex);
      let end = Math.ceil(toIndex);
      if (end === toIndex) {
        end += 1;
      }
      for (let i = start; i >= end; --i) {
        coordinates2.push(getCoordinate(target.coordinates, i));
      }
    }
    if (coordinates2.length) {
      this.appendCoordinates(coordinates2);
    }
  }
  updateTrace_(event) {
    const traceState = this.traceState_;
    if (!traceState.active) {
      return;
    }
    if (traceState.targetIndex === -1) {
      if (distance(traceState.startPx, event.pixel) < this.snapTolerance_) {
        return;
      }
    }
    const updatedTraceTarget = getTraceTargetUpdate(
      event.coordinate,
      traceState,
      this.getMap(),
      this.snapTolerance_
    );
    if (traceState.targetIndex !== updatedTraceTarget.index) {
      if (traceState.targetIndex !== -1) {
        const oldTarget = traceState.targets[traceState.targetIndex];
        this.removeTracedCoordinates_(oldTarget.startIndex, oldTarget.endIndex);
      }
      const newTarget = traceState.targets[updatedTraceTarget.index];
      this.addTracedCoordinates_(
        newTarget,
        newTarget.startIndex,
        updatedTraceTarget.endIndex
      );
    } else {
      const target2 = traceState.targets[traceState.targetIndex];
      this.addOrRemoveTracedCoordinates_(target2, updatedTraceTarget.endIndex);
    }
    traceState.targetIndex = updatedTraceTarget.index;
    const target = traceState.targets[traceState.targetIndex];
    target.endIndex = updatedTraceTarget.endIndex;
    const coordinate = interpolateCoordinate(
      target.coordinates,
      target.endIndex
    );
    const pixel = this.getMap().getPixelFromCoordinate(coordinate);
    event.coordinate = coordinate;
    event.pixel = [Math.round(pixel[0]), Math.round(pixel[1])];
  }
  handleUpEvent(event) {
    let pass = true;
    if (this.getPointerCount() === 0) {
      if (this.downTimeout_) {
        clearTimeout(this.downTimeout_);
        this.downTimeout_ = void 0;
      }
      this.handlePointerMove_(event);
      const tracing = this.traceState_.active;
      this.toggleTraceState_(event);
      if (this.shouldHandle_) {
        const startingToDraw = !this.finishCoordinate_;
        if (startingToDraw) {
          this.startDrawing_(event.coordinate);
        }
        if (!startingToDraw && this.freehand_) {
          this.finishDrawing();
        } else if (!this.freehand_ && (!startingToDraw || this.mode_ === "Point")) {
          if (this.atFinish_(event.pixel, tracing)) {
            if (this.finishCondition_(event)) {
              this.finishDrawing();
            }
          } else {
            this.addToDrawing_(event.coordinate);
          }
        }
        pass = false;
      } else if (this.freehand_) {
        this.abortDrawing();
      }
    }
    if (!pass && this.stopClick_) {
      event.preventDefault();
    }
    return pass;
  }
  handlePointerMove_(event) {
    this.pointerType_ = event.originalEvent.pointerType;
    if (this.downPx_ && (!this.freehand_ && this.shouldHandle_ || this.freehand_ && !this.shouldHandle_)) {
      const downPx = this.downPx_;
      const clickPx = event.pixel;
      const dx = downPx[0] - clickPx[0];
      const dy = downPx[1] - clickPx[1];
      const squaredDistance2 = dx * dx + dy * dy;
      this.shouldHandle_ = this.freehand_ ? squaredDistance2 > this.squaredClickTolerance_ : squaredDistance2 <= this.squaredClickTolerance_;
      if (!this.shouldHandle_) {
        return;
      }
    }
    if (!this.finishCoordinate_) {
      this.createOrUpdateSketchPoint_(event.coordinate.slice());
      return;
    }
    this.updateTrace_(event);
    this.modifyDrawing_(event.coordinate);
  }
  atFinish_(pixel, tracing) {
    let at = false;
    if (this.sketchFeature_) {
      let potentiallyDone = false;
      let potentiallyFinishCoordinates = [this.finishCoordinate_];
      const mode = this.mode_;
      if (mode === "Point") {
        at = true;
      } else if (mode === "Circle") {
        at = this.sketchCoords_.length === 2;
      } else if (mode === "LineString") {
        potentiallyDone = !tracing && this.sketchCoords_.length > this.minPoints_;
      } else if (mode === "Polygon") {
        const sketchCoords = this.sketchCoords_;
        potentiallyDone = sketchCoords[0].length > this.minPoints_;
        potentiallyFinishCoordinates = [
          sketchCoords[0][0],
          sketchCoords[0][sketchCoords[0].length - 2]
        ];
        if (tracing) {
          potentiallyFinishCoordinates = [sketchCoords[0][0]];
        } else {
          potentiallyFinishCoordinates = [
            sketchCoords[0][0],
            sketchCoords[0][sketchCoords[0].length - 2]
          ];
        }
      }
      if (potentiallyDone) {
        const map = this.getMap();
        for (let i = 0, ii = potentiallyFinishCoordinates.length; i < ii; i++) {
          const finishCoordinate = potentiallyFinishCoordinates[i];
          const finishPixel = map.getPixelFromCoordinate(finishCoordinate);
          const dx = pixel[0] - finishPixel[0];
          const dy = pixel[1] - finishPixel[1];
          const snapTolerance = this.freehand_ ? 1 : this.snapTolerance_;
          at = Math.sqrt(dx * dx + dy * dy) <= snapTolerance;
          if (at) {
            this.finishCoordinate_ = finishCoordinate;
            break;
          }
        }
      }
    }
    return at;
  }
  createOrUpdateSketchPoint_(coordinates2) {
    if (!this.sketchPoint_) {
      this.sketchPoint_ = new feature(new Point$1(coordinates2));
      this.updateSketchFeatures_();
    } else {
      const sketchPointGeom = this.sketchPoint_.getGeometry();
      sketchPointGeom.setCoordinates(coordinates2);
    }
  }
  createOrUpdateCustomSketchLine_(geometry) {
    if (!this.sketchLine_) {
      this.sketchLine_ = new feature();
    }
    const ring = geometry.getLinearRing(0);
    let sketchLineGeom = this.sketchLine_.getGeometry();
    if (!sketchLineGeom) {
      sketchLineGeom = new LineString$1(
        ring.getFlatCoordinates(),
        ring.getLayout()
      );
      this.sketchLine_.setGeometry(sketchLineGeom);
    } else {
      sketchLineGeom.setFlatCoordinates(
        ring.getLayout(),
        ring.getFlatCoordinates()
      );
      sketchLineGeom.changed();
    }
  }
  startDrawing_(start) {
    const projection = this.getMap().getView().getProjection();
    const stride = getStrideForLayout(this.geometryLayout_);
    while (start.length < stride) {
      start.push(0);
    }
    this.finishCoordinate_ = start;
    if (this.mode_ === "Point") {
      this.sketchCoords_ = start.slice();
    } else if (this.mode_ === "Polygon") {
      this.sketchCoords_ = [[start.slice(), start.slice()]];
      this.sketchLineCoords_ = this.sketchCoords_[0];
    } else {
      this.sketchCoords_ = [start.slice(), start.slice()];
    }
    if (this.sketchLineCoords_) {
      this.sketchLine_ = new feature(new LineString$1(this.sketchLineCoords_));
    }
    const geometry = this.geometryFunction_(
      this.sketchCoords_,
      void 0,
      projection
    );
    this.sketchFeature_ = new feature();
    if (this.geometryName_) {
      this.sketchFeature_.setGeometryName(this.geometryName_);
    }
    this.sketchFeature_.setGeometry(geometry);
    this.updateSketchFeatures_();
    this.dispatchEvent(
      new DrawEvent(DrawEventType.DRAWSTART, this.sketchFeature_)
    );
  }
  modifyDrawing_(coordinate) {
    const map = this.getMap();
    const geometry = this.sketchFeature_.getGeometry();
    const projection = map.getView().getProjection();
    const stride = getStrideForLayout(this.geometryLayout_);
    let coordinates2, last;
    while (coordinate.length < stride) {
      coordinate.push(0);
    }
    if (this.mode_ === "Point") {
      last = this.sketchCoords_;
    } else if (this.mode_ === "Polygon") {
      coordinates2 = this.sketchCoords_[0];
      last = coordinates2[coordinates2.length - 1];
      if (this.atFinish_(map.getPixelFromCoordinate(coordinate))) {
        coordinate = this.finishCoordinate_.slice();
      }
    } else {
      coordinates2 = this.sketchCoords_;
      last = coordinates2[coordinates2.length - 1];
    }
    last[0] = coordinate[0];
    last[1] = coordinate[1];
    this.geometryFunction_(
      this.sketchCoords_,
      geometry,
      projection
    );
    if (this.sketchPoint_) {
      const sketchPointGeom = this.sketchPoint_.getGeometry();
      sketchPointGeom.setCoordinates(coordinate);
    }
    if (geometry.getType() === "Polygon" && this.mode_ !== "Polygon") {
      this.createOrUpdateCustomSketchLine_(geometry);
    } else if (this.sketchLineCoords_) {
      const sketchLineGeom = this.sketchLine_.getGeometry();
      sketchLineGeom.setCoordinates(this.sketchLineCoords_);
    }
    this.updateSketchFeatures_();
  }
  addToDrawing_(coordinate) {
    const geometry = this.sketchFeature_.getGeometry();
    const projection = this.getMap().getView().getProjection();
    let done;
    let coordinates2;
    const mode = this.mode_;
    if (mode === "LineString" || mode === "Circle") {
      this.finishCoordinate_ = coordinate.slice();
      coordinates2 = this.sketchCoords_;
      if (coordinates2.length >= this.maxPoints_) {
        if (this.freehand_) {
          coordinates2.pop();
        } else {
          done = true;
        }
      }
      coordinates2.push(coordinate.slice());
      this.geometryFunction_(coordinates2, geometry, projection);
    } else if (mode === "Polygon") {
      coordinates2 = this.sketchCoords_[0];
      if (coordinates2.length >= this.maxPoints_) {
        if (this.freehand_) {
          coordinates2.pop();
        } else {
          done = true;
        }
      }
      coordinates2.push(coordinate.slice());
      if (done) {
        this.finishCoordinate_ = coordinates2[0];
      }
      this.geometryFunction_(this.sketchCoords_, geometry, projection);
    }
    this.createOrUpdateSketchPoint_(coordinate.slice());
    this.updateSketchFeatures_();
    if (done) {
      this.finishDrawing();
    }
  }
  removeLastPoints_(n) {
    if (!this.sketchFeature_) {
      return;
    }
    const geometry = this.sketchFeature_.getGeometry();
    const projection = this.getMap().getView().getProjection();
    const mode = this.mode_;
    for (let i = 0; i < n; ++i) {
      let coordinates2;
      if (mode === "LineString" || mode === "Circle") {
        coordinates2 = this.sketchCoords_;
        coordinates2.splice(-2, 1);
        if (coordinates2.length >= 2) {
          this.finishCoordinate_ = coordinates2[coordinates2.length - 2].slice();
          const finishCoordinate = this.finishCoordinate_.slice();
          coordinates2[coordinates2.length - 1] = finishCoordinate;
          this.createOrUpdateSketchPoint_(finishCoordinate);
        }
        this.geometryFunction_(coordinates2, geometry, projection);
        if (geometry.getType() === "Polygon" && this.sketchLine_) {
          this.createOrUpdateCustomSketchLine_(
            geometry
          );
        }
      } else if (mode === "Polygon") {
        coordinates2 = this.sketchCoords_[0];
        coordinates2.splice(-2, 1);
        const sketchLineGeom = this.sketchLine_.getGeometry();
        if (coordinates2.length >= 2) {
          const finishCoordinate = coordinates2[coordinates2.length - 2].slice();
          coordinates2[coordinates2.length - 1] = finishCoordinate;
          this.createOrUpdateSketchPoint_(finishCoordinate);
        }
        sketchLineGeom.setCoordinates(coordinates2);
        this.geometryFunction_(this.sketchCoords_, geometry, projection);
      }
      if (coordinates2.length === 1) {
        this.abortDrawing();
        break;
      }
    }
    this.updateSketchFeatures_();
  }
  removeLastPoint() {
    this.removeLastPoints_(1);
  }
  finishDrawing() {
    const sketchFeature = this.abortDrawing_();
    if (!sketchFeature) {
      return;
    }
    let coordinates2 = this.sketchCoords_;
    const geometry = sketchFeature.getGeometry();
    const projection = this.getMap().getView().getProjection();
    if (this.mode_ === "LineString") {
      coordinates2.pop();
      this.geometryFunction_(coordinates2, geometry, projection);
    } else if (this.mode_ === "Polygon") {
      coordinates2[0].pop();
      this.geometryFunction_(coordinates2, geometry, projection);
      coordinates2 = geometry.getCoordinates();
    }
    if (this.type_ === "MultiPoint") {
      sketchFeature.setGeometry(
        new MultiPoint$1([coordinates2])
      );
    } else if (this.type_ === "MultiLineString") {
      sketchFeature.setGeometry(
        new MultiLineString$1([coordinates2])
      );
    } else if (this.type_ === "MultiPolygon") {
      sketchFeature.setGeometry(
        new MultiPolygon$1([coordinates2])
      );
    }
    this.dispatchEvent(new DrawEvent(DrawEventType.DRAWEND, sketchFeature));
    if (this.features_) {
      this.features_.push(sketchFeature);
    }
    if (this.source_) {
      this.source_.addFeature(sketchFeature);
    }
  }
  abortDrawing_() {
    this.finishCoordinate_ = null;
    const sketchFeature = this.sketchFeature_;
    this.sketchFeature_ = null;
    this.sketchPoint_ = null;
    this.sketchLine_ = null;
    this.overlay_.getSource().clear(true);
    this.deactivateTrace_();
    return sketchFeature;
  }
  abortDrawing() {
    const sketchFeature = this.abortDrawing_();
    if (sketchFeature) {
      this.dispatchEvent(new DrawEvent(DrawEventType.DRAWABORT, sketchFeature));
    }
  }
  appendCoordinates(coordinates2) {
    const mode = this.mode_;
    const newDrawing = !this.sketchFeature_;
    if (newDrawing) {
      this.startDrawing_(coordinates2[0]);
    }
    let sketchCoords;
    if (mode === "LineString" || mode === "Circle") {
      sketchCoords = this.sketchCoords_;
    } else if (mode === "Polygon") {
      sketchCoords = this.sketchCoords_ && this.sketchCoords_.length ? this.sketchCoords_[0] : [];
    } else {
      return;
    }
    if (newDrawing) {
      sketchCoords.shift();
    }
    sketchCoords.pop();
    for (let i = 0; i < coordinates2.length; i++) {
      this.addToDrawing_(coordinates2[i]);
    }
    const ending = coordinates2[coordinates2.length - 1];
    this.addToDrawing_(ending);
    this.modifyDrawing_(ending);
  }
  extend(feature$1) {
    const geometry = feature$1.getGeometry();
    const lineString = geometry;
    this.sketchFeature_ = feature$1;
    this.sketchCoords_ = lineString.getCoordinates();
    const last = this.sketchCoords_[this.sketchCoords_.length - 1];
    this.finishCoordinate_ = last.slice();
    this.sketchCoords_.push(last.slice());
    this.sketchPoint_ = new feature(new Point$1(last));
    this.updateSketchFeatures_();
    this.dispatchEvent(
      new DrawEvent(DrawEventType.DRAWSTART, this.sketchFeature_)
    );
  }
  updateSketchFeatures_() {
    const sketchFeatures = [];
    if (this.sketchFeature_) {
      sketchFeatures.push(this.sketchFeature_);
    }
    if (this.sketchLine_) {
      sketchFeatures.push(this.sketchLine_);
    }
    if (this.sketchPoint_) {
      sketchFeatures.push(this.sketchPoint_);
    }
    const overlaySource = this.overlay_.getSource();
    overlaySource.clear(true);
    overlaySource.addFeatures(sketchFeatures);
  }
  updateState_() {
    const map = this.getMap();
    const active = this.getActive();
    if (!map || !active) {
      this.abortDrawing();
    }
    this.overlay_.setMap(active ? map : null);
  }
}
function getDefaultStyleFunction$1() {
  const styles = createEditingStyle();
  return function(feature2, resolution) {
    return styles[feature2.getGeometry().getType()];
  };
}
function getMode(type) {
  switch (type) {
    case "Point":
    case "MultiPoint":
      return "Point";
    case "LineString":
    case "MultiLineString":
      return "LineString";
    case "Polygon":
    case "MultiPolygon":
      return "Polygon";
    case "Circle":
      return "Circle";
    default:
      throw new Error("Invalid type: " + type);
  }
}
const Draw$1 = Draw;
const KeyCode = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40
};
class KeyboardPan extends Interaction$1 {
  constructor(options) {
    super();
    options = options || {};
    this.defaultCondition_ = function(mapBrowserEvent) {
      return noModifierKeys(mapBrowserEvent) && targetNotEditable(mapBrowserEvent);
    };
    this.condition_ = options.condition !== void 0 ? options.condition : this.defaultCondition_;
    this.duration_ = options.duration !== void 0 ? options.duration : 100;
    this.pixelDelta_ = options.pixelDelta !== void 0 ? options.pixelDelta : 128;
  }
  handleEvent(mapBrowserEvent) {
    let stopEvent = false;
    if (mapBrowserEvent.type == EventType.KEYDOWN) {
      const keyEvent = mapBrowserEvent.originalEvent;
      const keyCode = keyEvent.keyCode;
      if (this.condition_(mapBrowserEvent) && (keyCode == KeyCode.DOWN || keyCode == KeyCode.LEFT || keyCode == KeyCode.RIGHT || keyCode == KeyCode.UP)) {
        const map = mapBrowserEvent.map;
        const view = map.getView();
        const mapUnitsDelta = view.getResolution() * this.pixelDelta_;
        let deltaX = 0, deltaY = 0;
        if (keyCode == KeyCode.DOWN) {
          deltaY = -mapUnitsDelta;
        } else if (keyCode == KeyCode.LEFT) {
          deltaX = -mapUnitsDelta;
        } else if (keyCode == KeyCode.RIGHT) {
          deltaX = mapUnitsDelta;
        } else {
          deltaY = mapUnitsDelta;
        }
        const delta = [deltaX, deltaY];
        rotate$2(delta, view.getRotation());
        pan(view, delta, this.duration_);
        keyEvent.preventDefault();
        stopEvent = true;
      }
    }
    return !stopEvent;
  }
}
const KeyboardPan$1 = KeyboardPan;
class KeyboardZoom extends Interaction$1 {
  constructor(options) {
    super();
    options = options ? options : {};
    this.condition_ = options.condition ? options.condition : targetNotEditable;
    this.delta_ = options.delta ? options.delta : 1;
    this.duration_ = options.duration !== void 0 ? options.duration : 100;
  }
  handleEvent(mapBrowserEvent) {
    let stopEvent = false;
    if (mapBrowserEvent.type == EventType.KEYDOWN || mapBrowserEvent.type == EventType.KEYPRESS) {
      const keyEvent = mapBrowserEvent.originalEvent;
      const charCode = keyEvent.charCode;
      if (this.condition_(mapBrowserEvent) && (charCode == "+".charCodeAt(0) || charCode == "-".charCodeAt(0))) {
        const map = mapBrowserEvent.map;
        const delta = charCode == "+".charCodeAt(0) ? this.delta_ : -this.delta_;
        const view = map.getView();
        zoomByDelta(view, delta, void 0, this.duration_);
        keyEvent.preventDefault();
        stopEvent = true;
      }
    }
    return !stopEvent;
  }
}
const KeyboardZoom$1 = KeyboardZoom;
const MapEventType = {
  POSTRENDER: "postrender",
  MOVESTART: "movestart",
  MOVEEND: "moveend",
  LOADSTART: "loadstart",
  LOADEND: "loadend"
};
const CIRCLE_CENTER_INDEX = 0;
const CIRCLE_CIRCUMFERENCE_INDEX = 1;
const tempExtent = [0, 0, 0, 0];
const tempSegment$1 = [];
const ModifyEventType = {
  MODIFYSTART: "modifystart",
  MODIFYEND: "modifyend"
};
class ModifyEvent extends BaseEvent$1 {
  constructor(type, features, mapBrowserEvent) {
    super(type);
    this.features = features;
    this.mapBrowserEvent = mapBrowserEvent;
  }
}
class Modify extends PointerInteraction$1 {
  constructor(options) {
    super(options);
    this.on;
    this.once;
    this.un;
    this.boundHandleFeatureChange_ = this.handleFeatureChange_.bind(this);
    this.condition_ = options.condition ? options.condition : primaryAction;
    this.defaultDeleteCondition_ = function(mapBrowserEvent) {
      return altKeyOnly(mapBrowserEvent) && singleClick(mapBrowserEvent);
    };
    this.deleteCondition_ = options.deleteCondition ? options.deleteCondition : this.defaultDeleteCondition_;
    this.insertVertexCondition_ = options.insertVertexCondition ? options.insertVertexCondition : always;
    this.vertexFeature_ = null;
    this.vertexSegments_ = null;
    this.lastPixel_ = [0, 0];
    this.ignoreNextSingleClick_ = false;
    this.featuresBeingModified_ = null;
    this.rBush_ = new RBush$1();
    this.pixelTolerance_ = options.pixelTolerance !== void 0 ? options.pixelTolerance : 10;
    this.snappedToVertex_ = false;
    this.changingFeature_ = false;
    this.dragSegments_ = [];
    this.overlay_ = new LayerVector({
      source: new VectorSource$1({
        useSpatialIndex: false,
        wrapX: !!options.wrapX
      }),
      style: options.style ? options.style : getDefaultStyleFunction(),
      updateWhileAnimating: true,
      updateWhileInteracting: true
    });
    this.SEGMENT_WRITERS_ = {
      "Point": this.writePointGeometry_.bind(this),
      "LineString": this.writeLineStringGeometry_.bind(this),
      "LinearRing": this.writeLineStringGeometry_.bind(this),
      "Polygon": this.writePolygonGeometry_.bind(this),
      "MultiPoint": this.writeMultiPointGeometry_.bind(this),
      "MultiLineString": this.writeMultiLineStringGeometry_.bind(this),
      "MultiPolygon": this.writeMultiPolygonGeometry_.bind(this),
      "Circle": this.writeCircleGeometry_.bind(this),
      "GeometryCollection": this.writeGeometryCollectionGeometry_.bind(this)
    };
    this.source_ = null;
    this.hitDetection_ = null;
    let features;
    if (options.features) {
      features = options.features;
    } else if (options.source) {
      this.source_ = options.source;
      features = new Collection$1(this.source_.getFeatures());
      this.source_.addEventListener(
        VectorEventType.ADDFEATURE,
        this.handleSourceAdd_.bind(this)
      );
      this.source_.addEventListener(
        VectorEventType.REMOVEFEATURE,
        this.handleSourceRemove_.bind(this)
      );
    }
    if (!features) {
      throw new Error(
        "The modify interaction requires features, a source or a layer"
      );
    }
    if (options.hitDetection) {
      this.hitDetection_ = options.hitDetection;
    }
    this.features_ = features;
    this.features_.forEach(this.addFeature_.bind(this));
    this.features_.addEventListener(
      CollectionEventType.ADD,
      this.handleFeatureAdd_.bind(this)
    );
    this.features_.addEventListener(
      CollectionEventType.REMOVE,
      this.handleFeatureRemove_.bind(this)
    );
    this.lastPointerEvent_ = null;
    this.delta_ = [0, 0];
    this.snapToPointer_ = options.snapToPointer === void 0 ? !this.hitDetection_ : options.snapToPointer;
  }
  addFeature_(feature2) {
    const geometry = feature2.getGeometry();
    if (geometry) {
      const writer = this.SEGMENT_WRITERS_[geometry.getType()];
      if (writer) {
        writer(feature2, geometry);
      }
    }
    const map = this.getMap();
    if (map && map.isRendered() && this.getActive()) {
      this.handlePointerAtPixel_(this.lastPixel_, map);
    }
    feature2.addEventListener(EventType.CHANGE, this.boundHandleFeatureChange_);
  }
  willModifyFeatures_(evt, segments) {
    if (!this.featuresBeingModified_) {
      this.featuresBeingModified_ = new Collection$1();
      const features = this.featuresBeingModified_.getArray();
      for (let i = 0, ii = segments.length; i < ii; ++i) {
        const segment = segments[i];
        for (let s = 0, ss = segment.length; s < ss; ++s) {
          const feature2 = segment[s].feature;
          if (feature2 && !features.includes(feature2)) {
            this.featuresBeingModified_.push(feature2);
          }
        }
      }
      if (this.featuresBeingModified_.getLength() === 0) {
        this.featuresBeingModified_ = null;
      } else {
        this.dispatchEvent(
          new ModifyEvent(
            ModifyEventType.MODIFYSTART,
            this.featuresBeingModified_,
            evt
          )
        );
      }
    }
  }
  removeFeature_(feature2) {
    this.removeFeatureSegmentData_(feature2);
    if (this.vertexFeature_ && this.features_.getLength() === 0) {
      this.overlay_.getSource().removeFeature(this.vertexFeature_);
      this.vertexFeature_ = null;
    }
    feature2.removeEventListener(
      EventType.CHANGE,
      this.boundHandleFeatureChange_
    );
  }
  removeFeatureSegmentData_(feature2) {
    const rBush = this.rBush_;
    const nodesToRemove = [];
    rBush.forEach(
      function(node) {
        if (feature2 === node.feature) {
          nodesToRemove.push(node);
        }
      }
    );
    for (let i = nodesToRemove.length - 1; i >= 0; --i) {
      const nodeToRemove = nodesToRemove[i];
      for (let j = this.dragSegments_.length - 1; j >= 0; --j) {
        if (this.dragSegments_[j][0] === nodeToRemove) {
          this.dragSegments_.splice(j, 1);
        }
      }
      rBush.remove(nodeToRemove);
    }
  }
  setActive(active) {
    if (this.vertexFeature_ && !active) {
      this.overlay_.getSource().removeFeature(this.vertexFeature_);
      this.vertexFeature_ = null;
    }
    super.setActive(active);
  }
  setMap(map) {
    this.overlay_.setMap(map);
    super.setMap(map);
  }
  getOverlay() {
    return this.overlay_;
  }
  handleSourceAdd_(event) {
    if (event.feature) {
      this.features_.push(event.feature);
    }
  }
  handleSourceRemove_(event) {
    if (event.feature) {
      this.features_.remove(event.feature);
    }
  }
  handleFeatureAdd_(evt) {
    this.addFeature_(evt.element);
  }
  handleFeatureChange_(evt) {
    if (!this.changingFeature_) {
      const feature2 = evt.target;
      this.removeFeature_(feature2);
      this.addFeature_(feature2);
    }
  }
  handleFeatureRemove_(evt) {
    this.removeFeature_(evt.element);
  }
  writePointGeometry_(feature2, geometry) {
    const coordinates2 = geometry.getCoordinates();
    const segmentData = {
      feature: feature2,
      geometry,
      segment: [coordinates2, coordinates2]
    };
    this.rBush_.insert(geometry.getExtent(), segmentData);
  }
  writeMultiPointGeometry_(feature2, geometry) {
    const points = geometry.getCoordinates();
    for (let i = 0, ii = points.length; i < ii; ++i) {
      const coordinates2 = points[i];
      const segmentData = {
        feature: feature2,
        geometry,
        depth: [i],
        index: i,
        segment: [coordinates2, coordinates2]
      };
      this.rBush_.insert(geometry.getExtent(), segmentData);
    }
  }
  writeLineStringGeometry_(feature2, geometry) {
    const coordinates2 = geometry.getCoordinates();
    for (let i = 0, ii = coordinates2.length - 1; i < ii; ++i) {
      const segment = coordinates2.slice(i, i + 2);
      const segmentData = {
        feature: feature2,
        geometry,
        index: i,
        segment
      };
      this.rBush_.insert(boundingExtent(segment), segmentData);
    }
  }
  writeMultiLineStringGeometry_(feature2, geometry) {
    const lines = geometry.getCoordinates();
    for (let j = 0, jj = lines.length; j < jj; ++j) {
      const coordinates2 = lines[j];
      for (let i = 0, ii = coordinates2.length - 1; i < ii; ++i) {
        const segment = coordinates2.slice(i, i + 2);
        const segmentData = {
          feature: feature2,
          geometry,
          depth: [j],
          index: i,
          segment
        };
        this.rBush_.insert(boundingExtent(segment), segmentData);
      }
    }
  }
  writePolygonGeometry_(feature2, geometry) {
    const rings = geometry.getCoordinates();
    for (let j = 0, jj = rings.length; j < jj; ++j) {
      const coordinates2 = rings[j];
      for (let i = 0, ii = coordinates2.length - 1; i < ii; ++i) {
        const segment = coordinates2.slice(i, i + 2);
        const segmentData = {
          feature: feature2,
          geometry,
          depth: [j],
          index: i,
          segment
        };
        this.rBush_.insert(boundingExtent(segment), segmentData);
      }
    }
  }
  writeMultiPolygonGeometry_(feature2, geometry) {
    const polygons = geometry.getCoordinates();
    for (let k = 0, kk = polygons.length; k < kk; ++k) {
      const rings = polygons[k];
      for (let j = 0, jj = rings.length; j < jj; ++j) {
        const coordinates2 = rings[j];
        for (let i = 0, ii = coordinates2.length - 1; i < ii; ++i) {
          const segment = coordinates2.slice(i, i + 2);
          const segmentData = {
            feature: feature2,
            geometry,
            depth: [j, k],
            index: i,
            segment
          };
          this.rBush_.insert(boundingExtent(segment), segmentData);
        }
      }
    }
  }
  writeCircleGeometry_(feature2, geometry) {
    const coordinates2 = geometry.getCenter();
    const centerSegmentData = {
      feature: feature2,
      geometry,
      index: CIRCLE_CENTER_INDEX,
      segment: [coordinates2, coordinates2]
    };
    const circumferenceSegmentData = {
      feature: feature2,
      geometry,
      index: CIRCLE_CIRCUMFERENCE_INDEX,
      segment: [coordinates2, coordinates2]
    };
    const featureSegments = [centerSegmentData, circumferenceSegmentData];
    centerSegmentData.featureSegments = featureSegments;
    circumferenceSegmentData.featureSegments = featureSegments;
    this.rBush_.insert(createOrUpdateFromCoordinate(coordinates2), centerSegmentData);
    let circleGeometry = geometry;
    this.rBush_.insert(circleGeometry.getExtent(), circumferenceSegmentData);
  }
  writeGeometryCollectionGeometry_(feature2, geometry) {
    const geometries = geometry.getGeometriesArray();
    for (let i = 0; i < geometries.length; ++i) {
      const geometry2 = geometries[i];
      const writer = this.SEGMENT_WRITERS_[geometry2.getType()];
      writer(feature2, geometry2);
    }
  }
  createOrUpdateVertexFeature_(coordinates2, features, geometries) {
    let vertexFeature = this.vertexFeature_;
    if (!vertexFeature) {
      vertexFeature = new feature(new Point$1(coordinates2));
      this.vertexFeature_ = vertexFeature;
      this.overlay_.getSource().addFeature(vertexFeature);
    } else {
      const geometry = vertexFeature.getGeometry();
      geometry.setCoordinates(coordinates2);
    }
    vertexFeature.set("features", features);
    vertexFeature.set("geometries", geometries);
    return vertexFeature;
  }
  handleEvent(mapBrowserEvent) {
    if (!mapBrowserEvent.originalEvent) {
      return true;
    }
    this.lastPointerEvent_ = mapBrowserEvent;
    let handled;
    if (!mapBrowserEvent.map.getView().getInteracting() && mapBrowserEvent.type == MapBrowserEventType.POINTERMOVE && !this.handlingDownUpSequence) {
      this.handlePointerMove_(mapBrowserEvent);
    }
    if (this.vertexFeature_ && this.deleteCondition_(mapBrowserEvent)) {
      if (mapBrowserEvent.type != MapBrowserEventType.SINGLECLICK || !this.ignoreNextSingleClick_) {
        handled = this.removePoint();
      } else {
        handled = true;
      }
    }
    if (mapBrowserEvent.type == MapBrowserEventType.SINGLECLICK) {
      this.ignoreNextSingleClick_ = false;
    }
    return super.handleEvent(mapBrowserEvent) && !handled;
  }
  handleDragEvent(evt) {
    this.ignoreNextSingleClick_ = false;
    this.willModifyFeatures_(evt, this.dragSegments_);
    const vertex = [
      evt.coordinate[0] + this.delta_[0],
      evt.coordinate[1] + this.delta_[1]
    ];
    const features = [];
    const geometries = [];
    for (let i = 0, ii = this.dragSegments_.length; i < ii; ++i) {
      const dragSegment = this.dragSegments_[i];
      const segmentData = dragSegment[0];
      const feature2 = segmentData.feature;
      if (!features.includes(feature2)) {
        features.push(feature2);
      }
      const geometry = segmentData.geometry;
      if (!geometries.includes(geometry)) {
        geometries.push(geometry);
      }
      const depth = segmentData.depth;
      let coordinates2;
      const segment = segmentData.segment;
      const index2 = dragSegment[1];
      while (vertex.length < geometry.getStride()) {
        vertex.push(segment[index2][vertex.length]);
      }
      switch (geometry.getType()) {
        case "Point":
          coordinates2 = vertex;
          segment[0] = vertex;
          segment[1] = vertex;
          break;
        case "MultiPoint":
          coordinates2 = geometry.getCoordinates();
          coordinates2[segmentData.index] = vertex;
          segment[0] = vertex;
          segment[1] = vertex;
          break;
        case "LineString":
          coordinates2 = geometry.getCoordinates();
          coordinates2[segmentData.index + index2] = vertex;
          segment[index2] = vertex;
          break;
        case "MultiLineString":
          coordinates2 = geometry.getCoordinates();
          coordinates2[depth[0]][segmentData.index + index2] = vertex;
          segment[index2] = vertex;
          break;
        case "Polygon":
          coordinates2 = geometry.getCoordinates();
          coordinates2[depth[0]][segmentData.index + index2] = vertex;
          segment[index2] = vertex;
          break;
        case "MultiPolygon":
          coordinates2 = geometry.getCoordinates();
          coordinates2[depth[1]][depth[0]][segmentData.index + index2] = vertex;
          segment[index2] = vertex;
          break;
        case "Circle":
          segment[0] = vertex;
          segment[1] = vertex;
          if (segmentData.index === CIRCLE_CENTER_INDEX) {
            this.changingFeature_ = true;
            geometry.setCenter(vertex);
            this.changingFeature_ = false;
          } else {
            this.changingFeature_ = true;
            evt.map.getView().getProjection();
            let radius = distance(
              fromUserCoordinate(geometry.getCenter()),
              fromUserCoordinate(vertex)
            );
            geometry.setRadius(radius);
            this.changingFeature_ = false;
          }
          break;
      }
      if (coordinates2) {
        this.setGeometryCoordinates_(geometry, coordinates2);
      }
    }
    this.createOrUpdateVertexFeature_(vertex, features, geometries);
  }
  handleDownEvent(evt) {
    if (!this.condition_(evt)) {
      return false;
    }
    const pixelCoordinate = evt.coordinate;
    this.handlePointerAtPixel_(evt.pixel, evt.map, pixelCoordinate);
    this.dragSegments_.length = 0;
    this.featuresBeingModified_ = null;
    const vertexFeature = this.vertexFeature_;
    if (vertexFeature) {
      evt.map.getView().getProjection();
      const insertVertices = [];
      const vertex = vertexFeature.getGeometry().getCoordinates();
      const vertexExtent = boundingExtent([vertex]);
      const segmentDataMatches = this.rBush_.getInExtent(vertexExtent);
      const componentSegments = {};
      segmentDataMatches.sort(compareIndexes);
      for (let i = 0, ii = segmentDataMatches.length; i < ii; ++i) {
        const segmentDataMatch = segmentDataMatches[i];
        const segment = segmentDataMatch.segment;
        let uid = getUid(segmentDataMatch.geometry);
        const depth = segmentDataMatch.depth;
        if (depth) {
          uid += "-" + depth.join("-");
        }
        if (!componentSegments[uid]) {
          componentSegments[uid] = new Array(2);
        }
        if (segmentDataMatch.geometry.getType() === "Circle" && segmentDataMatch.index === CIRCLE_CIRCUMFERENCE_INDEX) {
          const closestVertex = closestOnSegmentData(
            pixelCoordinate,
            segmentDataMatch
          );
          if (equals$2(closestVertex, vertex) && !componentSegments[uid][0]) {
            this.dragSegments_.push([segmentDataMatch, 0]);
            componentSegments[uid][0] = segmentDataMatch;
          }
          continue;
        }
        if (equals$2(segment[0], vertex) && !componentSegments[uid][0]) {
          this.dragSegments_.push([segmentDataMatch, 0]);
          componentSegments[uid][0] = segmentDataMatch;
          continue;
        }
        if (equals$2(segment[1], vertex) && !componentSegments[uid][1]) {
          if (componentSegments[uid][0] && componentSegments[uid][0].index === 0) {
            let coordinates2 = segmentDataMatch.geometry.getCoordinates();
            switch (segmentDataMatch.geometry.getType()) {
              case "LineString":
              case "MultiLineString":
                continue;
              case "MultiPolygon":
                coordinates2 = coordinates2[depth[1]];
              case "Polygon":
                if (segmentDataMatch.index !== coordinates2[depth[0]].length - 2) {
                  continue;
                }
                break;
            }
          }
          this.dragSegments_.push([segmentDataMatch, 1]);
          componentSegments[uid][1] = segmentDataMatch;
          continue;
        }
        if (getUid(segment) in this.vertexSegments_ && !componentSegments[uid][0] && !componentSegments[uid][1] && this.insertVertexCondition_(evt)) {
          insertVertices.push(segmentDataMatch);
        }
      }
      if (insertVertices.length) {
        this.willModifyFeatures_(evt, [insertVertices]);
      }
      for (let j = insertVertices.length - 1; j >= 0; --j) {
        this.insertVertex_(insertVertices[j], vertex);
      }
    }
    return !!this.vertexFeature_;
  }
  handleUpEvent(evt) {
    for (let i = this.dragSegments_.length - 1; i >= 0; --i) {
      const segmentData = this.dragSegments_[i][0];
      const geometry = segmentData.geometry;
      if (geometry.getType() === "Circle") {
        const coordinates2 = geometry.getCenter();
        const centerSegmentData = segmentData.featureSegments[0];
        const circumferenceSegmentData = segmentData.featureSegments[1];
        centerSegmentData.segment[0] = coordinates2;
        centerSegmentData.segment[1] = coordinates2;
        circumferenceSegmentData.segment[0] = coordinates2;
        circumferenceSegmentData.segment[1] = coordinates2;
        this.rBush_.update(createOrUpdateFromCoordinate(coordinates2), centerSegmentData);
        let circleGeometry = geometry;
        this.rBush_.update(
          circleGeometry.getExtent(),
          circumferenceSegmentData
        );
      } else {
        this.rBush_.update(boundingExtent(segmentData.segment), segmentData);
      }
    }
    if (this.featuresBeingModified_) {
      this.dispatchEvent(
        new ModifyEvent(
          ModifyEventType.MODIFYEND,
          this.featuresBeingModified_,
          evt
        )
      );
      this.featuresBeingModified_ = null;
    }
    return false;
  }
  handlePointerMove_(evt) {
    this.lastPixel_ = evt.pixel;
    this.handlePointerAtPixel_(evt.pixel, evt.map, evt.coordinate);
  }
  handlePointerAtPixel_(pixel, map, coordinate) {
    const pixelCoordinate = coordinate || map.getCoordinateFromPixel(pixel);
    map.getView().getProjection();
    const sortByDistance = function(a, b) {
      return projectedDistanceToSegmentDataSquared(pixelCoordinate, a) - projectedDistanceToSegmentDataSquared(pixelCoordinate, b);
    };
    let nodes;
    let hitPointGeometry;
    if (this.hitDetection_) {
      const layerFilter = typeof this.hitDetection_ === "object" ? (layer) => layer === this.hitDetection_ : void 0;
      map.forEachFeatureAtPixel(
        pixel,
        (feature2, layer, geometry) => {
          geometry = geometry || feature2.getGeometry();
          if (geometry.getType() === "Point" && this.features_.getArray().includes(feature2)) {
            hitPointGeometry = geometry;
            const coordinate2 = geometry.getFlatCoordinates().slice(0, 2);
            nodes = [
              {
                feature: feature2,
                geometry,
                segment: [coordinate2, coordinate2]
              }
            ];
          }
          return true;
        },
        { layerFilter }
      );
    }
    if (!nodes) {
      const viewExtent = fromUserExtent(
        createOrUpdateFromCoordinate(pixelCoordinate, tempExtent)
      );
      const buffer$1 = map.getView().getResolution() * this.pixelTolerance_;
      const box = toUserExtent(
        buffer(viewExtent, buffer$1, tempExtent)
      );
      nodes = this.rBush_.getInExtent(box);
    }
    if (nodes && nodes.length > 0) {
      const node = nodes.sort(sortByDistance)[0];
      const closestSegment = node.segment;
      let vertex = closestOnSegmentData(pixelCoordinate, node);
      const vertexPixel = map.getPixelFromCoordinate(vertex);
      let dist = distance(pixel, vertexPixel);
      if (hitPointGeometry || dist <= this.pixelTolerance_) {
        const vertexSegments = {};
        vertexSegments[getUid(closestSegment)] = true;
        if (!this.snapToPointer_) {
          this.delta_[0] = vertex[0] - pixelCoordinate[0];
          this.delta_[1] = vertex[1] - pixelCoordinate[1];
        }
        if (node.geometry.getType() === "Circle" && node.index === CIRCLE_CIRCUMFERENCE_INDEX) {
          this.snappedToVertex_ = true;
          this.createOrUpdateVertexFeature_(
            vertex,
            [node.feature],
            [node.geometry]
          );
        } else {
          const pixel1 = map.getPixelFromCoordinate(closestSegment[0]);
          const pixel2 = map.getPixelFromCoordinate(closestSegment[1]);
          const squaredDist1 = squaredDistance(vertexPixel, pixel1);
          const squaredDist2 = squaredDistance(vertexPixel, pixel2);
          dist = Math.sqrt(Math.min(squaredDist1, squaredDist2));
          this.snappedToVertex_ = dist <= this.pixelTolerance_;
          if (this.snappedToVertex_) {
            vertex = squaredDist1 > squaredDist2 ? closestSegment[1] : closestSegment[0];
          }
          this.createOrUpdateVertexFeature_(
            vertex,
            [node.feature],
            [node.geometry]
          );
          const geometries = {};
          geometries[getUid(node.geometry)] = true;
          for (let i = 1, ii = nodes.length; i < ii; ++i) {
            const segment = nodes[i].segment;
            if (equals$2(closestSegment[0], segment[0]) && equals$2(closestSegment[1], segment[1]) || equals$2(closestSegment[0], segment[1]) && equals$2(closestSegment[1], segment[0])) {
              const geometryUid = getUid(nodes[i].geometry);
              if (!(geometryUid in geometries)) {
                geometries[geometryUid] = true;
                vertexSegments[getUid(segment)] = true;
              }
            } else {
              break;
            }
          }
        }
        this.vertexSegments_ = vertexSegments;
        return;
      }
    }
    if (this.vertexFeature_) {
      this.overlay_.getSource().removeFeature(this.vertexFeature_);
      this.vertexFeature_ = null;
    }
  }
  insertVertex_(segmentData, vertex) {
    const segment = segmentData.segment;
    const feature2 = segmentData.feature;
    const geometry = segmentData.geometry;
    const depth = segmentData.depth;
    const index2 = segmentData.index;
    let coordinates2;
    while (vertex.length < geometry.getStride()) {
      vertex.push(0);
    }
    switch (geometry.getType()) {
      case "MultiLineString":
        coordinates2 = geometry.getCoordinates();
        coordinates2[depth[0]].splice(index2 + 1, 0, vertex);
        break;
      case "Polygon":
        coordinates2 = geometry.getCoordinates();
        coordinates2[depth[0]].splice(index2 + 1, 0, vertex);
        break;
      case "MultiPolygon":
        coordinates2 = geometry.getCoordinates();
        coordinates2[depth[1]][depth[0]].splice(index2 + 1, 0, vertex);
        break;
      case "LineString":
        coordinates2 = geometry.getCoordinates();
        coordinates2.splice(index2 + 1, 0, vertex);
        break;
      default:
        return;
    }
    this.setGeometryCoordinates_(geometry, coordinates2);
    const rTree = this.rBush_;
    rTree.remove(segmentData);
    this.updateSegmentIndices_(geometry, index2, depth, 1);
    const newSegmentData = {
      segment: [segment[0], vertex],
      feature: feature2,
      geometry,
      depth,
      index: index2
    };
    rTree.insert(boundingExtent(newSegmentData.segment), newSegmentData);
    this.dragSegments_.push([newSegmentData, 1]);
    const newSegmentData2 = {
      segment: [vertex, segment[1]],
      feature: feature2,
      geometry,
      depth,
      index: index2 + 1
    };
    rTree.insert(boundingExtent(newSegmentData2.segment), newSegmentData2);
    this.dragSegments_.push([newSegmentData2, 0]);
    this.ignoreNextSingleClick_ = true;
  }
  removePoint() {
    if (this.lastPointerEvent_ && this.lastPointerEvent_.type != MapBrowserEventType.POINTERDRAG) {
      const evt = this.lastPointerEvent_;
      this.willModifyFeatures_(evt, this.dragSegments_);
      const removed = this.removeVertex_();
      if (this.featuresBeingModified_) {
        this.dispatchEvent(
          new ModifyEvent(
            ModifyEventType.MODIFYEND,
            this.featuresBeingModified_,
            evt
          )
        );
      }
      this.featuresBeingModified_ = null;
      return removed;
    }
    return false;
  }
  removeVertex_() {
    const dragSegments = this.dragSegments_;
    const segmentsByFeature = {};
    let deleted = false;
    let component, coordinates2, dragSegment, geometry, i, index2, left;
    let newIndex, right, segmentData, uid;
    for (i = dragSegments.length - 1; i >= 0; --i) {
      dragSegment = dragSegments[i];
      segmentData = dragSegment[0];
      uid = getUid(segmentData.feature);
      if (segmentData.depth) {
        uid += "-" + segmentData.depth.join("-");
      }
      if (!(uid in segmentsByFeature)) {
        segmentsByFeature[uid] = {};
      }
      if (dragSegment[1] === 0) {
        segmentsByFeature[uid].right = segmentData;
        segmentsByFeature[uid].index = segmentData.index;
      } else if (dragSegment[1] == 1) {
        segmentsByFeature[uid].left = segmentData;
        segmentsByFeature[uid].index = segmentData.index + 1;
      }
    }
    for (uid in segmentsByFeature) {
      right = segmentsByFeature[uid].right;
      left = segmentsByFeature[uid].left;
      index2 = segmentsByFeature[uid].index;
      newIndex = index2 - 1;
      if (left !== void 0) {
        segmentData = left;
      } else {
        segmentData = right;
      }
      if (newIndex < 0) {
        newIndex = 0;
      }
      geometry = segmentData.geometry;
      coordinates2 = geometry.getCoordinates();
      component = coordinates2;
      deleted = false;
      switch (geometry.getType()) {
        case "MultiLineString":
          if (coordinates2[segmentData.depth[0]].length > 2) {
            coordinates2[segmentData.depth[0]].splice(index2, 1);
            deleted = true;
          }
          break;
        case "LineString":
          if (coordinates2.length > 2) {
            coordinates2.splice(index2, 1);
            deleted = true;
          }
          break;
        case "MultiPolygon":
          component = component[segmentData.depth[1]];
        case "Polygon":
          component = component[segmentData.depth[0]];
          if (component.length > 4) {
            if (index2 == component.length - 1) {
              index2 = 0;
            }
            component.splice(index2, 1);
            deleted = true;
            if (index2 === 0) {
              component.pop();
              component.push(component[0]);
              newIndex = component.length - 1;
            }
          }
          break;
      }
      if (deleted) {
        this.setGeometryCoordinates_(geometry, coordinates2);
        const segments = [];
        if (left !== void 0) {
          this.rBush_.remove(left);
          segments.push(left.segment[0]);
        }
        if (right !== void 0) {
          this.rBush_.remove(right);
          segments.push(right.segment[1]);
        }
        if (left !== void 0 && right !== void 0) {
          const newSegmentData = {
            depth: segmentData.depth,
            feature: segmentData.feature,
            geometry: segmentData.geometry,
            index: newIndex,
            segment: segments
          };
          this.rBush_.insert(
            boundingExtent(newSegmentData.segment),
            newSegmentData
          );
        }
        this.updateSegmentIndices_(geometry, index2, segmentData.depth, -1);
        if (this.vertexFeature_) {
          this.overlay_.getSource().removeFeature(this.vertexFeature_);
          this.vertexFeature_ = null;
        }
        dragSegments.length = 0;
      }
    }
    return deleted;
  }
  setGeometryCoordinates_(geometry, coordinates2) {
    this.changingFeature_ = true;
    geometry.setCoordinates(coordinates2);
    this.changingFeature_ = false;
  }
  updateSegmentIndices_(geometry, index2, depth, delta) {
    this.rBush_.forEachInExtent(
      geometry.getExtent(),
      function(segmentDataMatch) {
        if (segmentDataMatch.geometry === geometry && (depth === void 0 || segmentDataMatch.depth === void 0 || equals$1(segmentDataMatch.depth, depth)) && segmentDataMatch.index > index2) {
          segmentDataMatch.index += delta;
        }
      }
    );
  }
}
function compareIndexes(a, b) {
  return a.index - b.index;
}
function projectedDistanceToSegmentDataSquared(pointCoordinates, segmentData, projection) {
  const geometry = segmentData.geometry;
  if (geometry.getType() === "Circle") {
    let circleGeometry = geometry;
    if (segmentData.index === CIRCLE_CIRCUMFERENCE_INDEX) {
      const distanceToCenterSquared = squaredDistance(
        circleGeometry.getCenter(),
        fromUserCoordinate(pointCoordinates)
      );
      const distanceToCircumference = Math.sqrt(distanceToCenterSquared) - circleGeometry.getRadius();
      return distanceToCircumference * distanceToCircumference;
    }
  }
  const coordinate = fromUserCoordinate(pointCoordinates);
  tempSegment$1[0] = fromUserCoordinate(segmentData.segment[0]);
  tempSegment$1[1] = fromUserCoordinate(segmentData.segment[1]);
  return squaredDistanceToSegment(coordinate, tempSegment$1);
}
function closestOnSegmentData(pointCoordinates, segmentData, projection) {
  const geometry = segmentData.geometry;
  if (geometry.getType() === "Circle" && segmentData.index === CIRCLE_CIRCUMFERENCE_INDEX) {
    let circleGeometry = geometry;
    return toUserCoordinate(
      circleGeometry.getClosestPoint(
        fromUserCoordinate(pointCoordinates)
      )
    );
  }
  const coordinate = fromUserCoordinate(pointCoordinates);
  tempSegment$1[0] = fromUserCoordinate(segmentData.segment[0]);
  tempSegment$1[1] = fromUserCoordinate(segmentData.segment[1]);
  return toUserCoordinate(
    closestOnSegment(coordinate, tempSegment$1)
  );
}
function getDefaultStyleFunction() {
  const style = createEditingStyle();
  return function(feature2, resolution) {
    return style["Point"];
  };
}
const Modify$1 = Modify;
class MouseWheelZoom extends Interaction$1 {
  constructor(options) {
    options = options ? options : {};
    super(
      options
    );
    this.totalDelta_ = 0;
    this.lastDelta_ = 0;
    this.maxDelta_ = options.maxDelta !== void 0 ? options.maxDelta : 1;
    this.duration_ = options.duration !== void 0 ? options.duration : 250;
    this.timeout_ = options.timeout !== void 0 ? options.timeout : 80;
    this.useAnchor_ = options.useAnchor !== void 0 ? options.useAnchor : true;
    this.constrainResolution_ = options.constrainResolution !== void 0 ? options.constrainResolution : false;
    const condition = options.condition ? options.condition : always;
    this.condition_ = options.onFocusOnly ? all(focusWithTabindex, condition) : condition;
    this.lastAnchor_ = null;
    this.startTime_ = void 0;
    this.timeoutId_;
    this.mode_ = void 0;
    this.trackpadEventGap_ = 400;
    this.trackpadTimeoutId_;
    this.deltaPerZoom_ = 300;
  }
  endInteraction_() {
    this.trackpadTimeoutId_ = void 0;
    const map = this.getMap();
    if (!map) {
      return;
    }
    const view = map.getView();
    view.endInteraction(
      void 0,
      this.lastDelta_ ? this.lastDelta_ > 0 ? 1 : -1 : 0,
      this.lastAnchor_
    );
  }
  handleEvent(mapBrowserEvent) {
    if (!this.condition_(mapBrowserEvent)) {
      return true;
    }
    const type = mapBrowserEvent.type;
    if (type !== EventType.WHEEL) {
      return true;
    }
    const map = mapBrowserEvent.map;
    const wheelEvent = mapBrowserEvent.originalEvent;
    wheelEvent.preventDefault();
    if (this.useAnchor_) {
      this.lastAnchor_ = mapBrowserEvent.coordinate;
    }
    let delta;
    if (mapBrowserEvent.type == EventType.WHEEL) {
      delta = wheelEvent.deltaY;
      if (FIREFOX && wheelEvent.deltaMode === WheelEvent.DOM_DELTA_PIXEL) {
        delta /= DEVICE_PIXEL_RATIO;
      }
      if (wheelEvent.deltaMode === WheelEvent.DOM_DELTA_LINE) {
        delta *= 40;
      }
    }
    if (delta === 0) {
      return false;
    } else {
      this.lastDelta_ = delta;
    }
    const now = Date.now();
    if (this.startTime_ === void 0) {
      this.startTime_ = now;
    }
    if (!this.mode_ || now - this.startTime_ > this.trackpadEventGap_) {
      this.mode_ = Math.abs(delta) < 4 ? "trackpad" : "wheel";
    }
    const view = map.getView();
    if (this.mode_ === "trackpad" && !(view.getConstrainResolution() || this.constrainResolution_)) {
      if (this.trackpadTimeoutId_) {
        clearTimeout(this.trackpadTimeoutId_);
      } else {
        if (view.getAnimating()) {
          view.cancelAnimations();
        }
        view.beginInteraction();
      }
      this.trackpadTimeoutId_ = setTimeout(
        this.endInteraction_.bind(this),
        this.timeout_
      );
      view.adjustZoom(-delta / this.deltaPerZoom_, this.lastAnchor_);
      this.startTime_ = now;
      return false;
    }
    this.totalDelta_ += delta;
    const timeLeft = Math.max(this.timeout_ - (now - this.startTime_), 0);
    clearTimeout(this.timeoutId_);
    this.timeoutId_ = setTimeout(
      this.handleWheelZoom_.bind(this, map),
      timeLeft
    );
    return false;
  }
  handleWheelZoom_(map) {
    const view = map.getView();
    if (view.getAnimating()) {
      view.cancelAnimations();
    }
    let delta = -clamp(
      this.totalDelta_,
      -this.maxDelta_ * this.deltaPerZoom_,
      this.maxDelta_ * this.deltaPerZoom_
    ) / this.deltaPerZoom_;
    if (view.getConstrainResolution() || this.constrainResolution_) {
      delta = delta ? delta > 0 ? 1 : -1 : 0;
    }
    zoomByDelta(view, delta, this.lastAnchor_, this.duration_);
    this.mode_ = void 0;
    this.totalDelta_ = 0;
    this.lastAnchor_ = null;
    this.startTime_ = void 0;
    this.timeoutId_ = void 0;
  }
  setMouseAnchor(useAnchor) {
    this.useAnchor_ = useAnchor;
    if (!useAnchor) {
      this.lastAnchor_ = null;
    }
  }
}
const MouseWheelZoom$1 = MouseWheelZoom;
class PinchRotate extends PointerInteraction$1 {
  constructor(options) {
    options = options ? options : {};
    const pointerOptions = options;
    if (!pointerOptions.stopDown) {
      pointerOptions.stopDown = FALSE;
    }
    super(pointerOptions);
    this.anchor_ = null;
    this.lastAngle_ = void 0;
    this.rotating_ = false;
    this.rotationDelta_ = 0;
    this.threshold_ = options.threshold !== void 0 ? options.threshold : 0.3;
    this.duration_ = options.duration !== void 0 ? options.duration : 250;
  }
  handleDragEvent(mapBrowserEvent) {
    let rotationDelta = 0;
    const touch0 = this.targetPointers[0];
    const touch1 = this.targetPointers[1];
    const angle = Math.atan2(
      touch1.clientY - touch0.clientY,
      touch1.clientX - touch0.clientX
    );
    if (this.lastAngle_ !== void 0) {
      const delta = angle - this.lastAngle_;
      this.rotationDelta_ += delta;
      if (!this.rotating_ && Math.abs(this.rotationDelta_) > this.threshold_) {
        this.rotating_ = true;
      }
      rotationDelta = delta;
    }
    this.lastAngle_ = angle;
    const map = mapBrowserEvent.map;
    const view = map.getView();
    if (view.getConstraints().rotation === disable) {
      return;
    }
    const viewportPosition = map.getViewport().getBoundingClientRect();
    const centroid$1 = centroid(this.targetPointers);
    centroid$1[0] -= viewportPosition.left;
    centroid$1[1] -= viewportPosition.top;
    this.anchor_ = map.getCoordinateFromPixelInternal(centroid$1);
    if (this.rotating_) {
      map.render();
      view.adjustRotationInternal(rotationDelta, this.anchor_);
    }
  }
  handleUpEvent(mapBrowserEvent) {
    if (this.targetPointers.length < 2) {
      const map = mapBrowserEvent.map;
      const view = map.getView();
      view.endInteraction(this.duration_);
      return false;
    } else {
      return true;
    }
  }
  handleDownEvent(mapBrowserEvent) {
    if (this.targetPointers.length >= 2) {
      const map = mapBrowserEvent.map;
      this.anchor_ = null;
      this.lastAngle_ = void 0;
      this.rotating_ = false;
      this.rotationDelta_ = 0;
      if (!this.handlingDownUpSequence) {
        map.getView().beginInteraction();
      }
      return true;
    } else {
      return false;
    }
  }
}
const PinchRotate$1 = PinchRotate;
class PinchZoom extends PointerInteraction$1 {
  constructor(options) {
    options = options ? options : {};
    const pointerOptions = options;
    if (!pointerOptions.stopDown) {
      pointerOptions.stopDown = FALSE;
    }
    super(pointerOptions);
    this.anchor_ = null;
    this.duration_ = options.duration !== void 0 ? options.duration : 400;
    this.lastDistance_ = void 0;
    this.lastScaleDelta_ = 1;
  }
  handleDragEvent(mapBrowserEvent) {
    let scaleDelta = 1;
    const touch0 = this.targetPointers[0];
    const touch1 = this.targetPointers[1];
    const dx = touch0.clientX - touch1.clientX;
    const dy = touch0.clientY - touch1.clientY;
    const distance2 = Math.sqrt(dx * dx + dy * dy);
    if (this.lastDistance_ !== void 0) {
      scaleDelta = this.lastDistance_ / distance2;
    }
    this.lastDistance_ = distance2;
    const map = mapBrowserEvent.map;
    const view = map.getView();
    if (scaleDelta != 1) {
      this.lastScaleDelta_ = scaleDelta;
    }
    const viewportPosition = map.getViewport().getBoundingClientRect();
    const centroid$1 = centroid(this.targetPointers);
    centroid$1[0] -= viewportPosition.left;
    centroid$1[1] -= viewportPosition.top;
    this.anchor_ = map.getCoordinateFromPixelInternal(centroid$1);
    map.render();
    view.adjustResolutionInternal(scaleDelta, this.anchor_);
  }
  handleUpEvent(mapBrowserEvent) {
    if (this.targetPointers.length < 2) {
      const map = mapBrowserEvent.map;
      const view = map.getView();
      const direction = this.lastScaleDelta_ > 1 ? 1 : -1;
      view.endInteraction(this.duration_, direction);
      return false;
    } else {
      return true;
    }
  }
  handleDownEvent(mapBrowserEvent) {
    if (this.targetPointers.length >= 2) {
      const map = mapBrowserEvent.map;
      this.anchor_ = null;
      this.lastDistance_ = void 0;
      this.lastScaleDelta_ = 1;
      if (!this.handlingDownUpSequence) {
        map.getView().beginInteraction();
      }
      return true;
    } else {
      return false;
    }
  }
}
const PinchZoom$1 = PinchZoom;
function getFeatureFromEvent(evt) {
  if (evt.feature) {
    return evt.feature;
  } else if (evt.element) {
    return evt.element;
  }
}
const tempSegment = [];
class Snap extends PointerInteraction$1 {
  constructor(options) {
    options = options ? options : {};
    const pointerOptions = options;
    if (!pointerOptions.handleDownEvent) {
      pointerOptions.handleDownEvent = TRUE;
    }
    if (!pointerOptions.stopDown) {
      pointerOptions.stopDown = FALSE;
    }
    super(pointerOptions);
    this.source_ = options.source ? options.source : null;
    this.vertex_ = options.vertex !== void 0 ? options.vertex : true;
    this.edge_ = options.edge !== void 0 ? options.edge : true;
    this.features_ = options.features ? options.features : null;
    this.featuresListenerKeys_ = [];
    this.featureChangeListenerKeys_ = {};
    this.indexedFeaturesExtents_ = {};
    this.pendingFeatures_ = {};
    this.pixelTolerance_ = options.pixelTolerance !== void 0 ? options.pixelTolerance : 10;
    this.rBush_ = new RBush$1();
    this.GEOMETRY_SEGMENTERS_ = {
      "Point": this.segmentPointGeometry_.bind(this),
      "LineString": this.segmentLineStringGeometry_.bind(this),
      "LinearRing": this.segmentLineStringGeometry_.bind(this),
      "Polygon": this.segmentPolygonGeometry_.bind(this),
      "MultiPoint": this.segmentMultiPointGeometry_.bind(this),
      "MultiLineString": this.segmentMultiLineStringGeometry_.bind(this),
      "MultiPolygon": this.segmentMultiPolygonGeometry_.bind(this),
      "GeometryCollection": this.segmentGeometryCollectionGeometry_.bind(this),
      "Circle": this.segmentCircleGeometry_.bind(this)
    };
  }
  addFeature(feature2, register) {
    register = register !== void 0 ? register : true;
    const feature_uid = getUid(feature2);
    const geometry = feature2.getGeometry();
    if (geometry) {
      const segmenter = this.GEOMETRY_SEGMENTERS_[geometry.getType()];
      if (segmenter) {
        this.indexedFeaturesExtents_[feature_uid] = geometry.getExtent(
          createEmpty()
        );
        const segments = [];
        segmenter(segments, geometry);
        if (segments.length === 1) {
          this.rBush_.insert(boundingExtent(segments[0]), {
            feature: feature2,
            segment: segments[0]
          });
        } else if (segments.length > 1) {
          const extents = segments.map((s) => boundingExtent(s));
          const segmentsData = segments.map((segment) => ({
            feature: feature2,
            segment
          }));
          this.rBush_.load(extents, segmentsData);
        }
      }
    }
    if (register) {
      this.featureChangeListenerKeys_[feature_uid] = listen(
        feature2,
        EventType.CHANGE,
        this.handleFeatureChange_,
        this
      );
    }
  }
  forEachFeatureAdd_(feature2) {
    this.addFeature(feature2);
  }
  forEachFeatureRemove_(feature2) {
    this.removeFeature(feature2);
  }
  getFeatures_() {
    let features;
    if (this.features_) {
      features = this.features_;
    } else if (this.source_) {
      features = this.source_.getFeatures();
    }
    return features;
  }
  handleEvent(evt) {
    const result = this.snapTo(evt.pixel, evt.coordinate, evt.map);
    if (result) {
      evt.coordinate = result.vertex.slice(0, 2);
      evt.pixel = result.vertexPixel;
    }
    return super.handleEvent(evt);
  }
  handleFeatureAdd_(evt) {
    const feature2 = getFeatureFromEvent(evt);
    this.addFeature(feature2);
  }
  handleFeatureRemove_(evt) {
    const feature2 = getFeatureFromEvent(evt);
    this.removeFeature(feature2);
  }
  handleFeatureChange_(evt) {
    const feature2 = evt.target;
    if (this.handlingDownUpSequence) {
      const uid = getUid(feature2);
      if (!(uid in this.pendingFeatures_)) {
        this.pendingFeatures_[uid] = feature2;
      }
    } else {
      this.updateFeature_(feature2);
    }
  }
  handleUpEvent(evt) {
    const featuresToUpdate = Object.values(this.pendingFeatures_);
    if (featuresToUpdate.length) {
      featuresToUpdate.forEach(this.updateFeature_.bind(this));
      this.pendingFeatures_ = {};
    }
    return false;
  }
  removeFeature(feature2, unlisten) {
    const unregister = unlisten !== void 0 ? unlisten : true;
    const feature_uid = getUid(feature2);
    const extent = this.indexedFeaturesExtents_[feature_uid];
    if (extent) {
      const rBush = this.rBush_;
      const nodesToRemove = [];
      rBush.forEachInExtent(extent, function(node) {
        if (feature2 === node.feature) {
          nodesToRemove.push(node);
        }
      });
      for (let i = nodesToRemove.length - 1; i >= 0; --i) {
        rBush.remove(nodesToRemove[i]);
      }
    }
    if (unregister) {
      unlistenByKey(this.featureChangeListenerKeys_[feature_uid]);
      delete this.featureChangeListenerKeys_[feature_uid];
    }
  }
  setMap(map) {
    const currentMap = this.getMap();
    const keys = this.featuresListenerKeys_;
    const features = this.getFeatures_();
    if (currentMap) {
      keys.forEach(unlistenByKey);
      keys.length = 0;
      features.forEach(this.forEachFeatureRemove_.bind(this));
    }
    super.setMap(map);
    if (map) {
      if (this.features_) {
        keys.push(
          listen(
            this.features_,
            CollectionEventType.ADD,
            this.handleFeatureAdd_,
            this
          ),
          listen(
            this.features_,
            CollectionEventType.REMOVE,
            this.handleFeatureRemove_,
            this
          )
        );
      } else if (this.source_) {
        keys.push(
          listen(
            this.source_,
            VectorEventType.ADDFEATURE,
            this.handleFeatureAdd_,
            this
          ),
          listen(
            this.source_,
            VectorEventType.REMOVEFEATURE,
            this.handleFeatureRemove_,
            this
          )
        );
      }
      features.forEach(this.forEachFeatureAdd_.bind(this));
    }
  }
  snapTo(pixel, pixelCoordinate, map) {
    const lowerLeft = map.getCoordinateFromPixel([
      pixel[0] - this.pixelTolerance_,
      pixel[1] + this.pixelTolerance_
    ]);
    const upperRight = map.getCoordinateFromPixel([
      pixel[0] + this.pixelTolerance_,
      pixel[1] - this.pixelTolerance_
    ]);
    const box = boundingExtent([lowerLeft, upperRight]);
    const segments = this.rBush_.getInExtent(box);
    const segmentsLength = segments.length;
    if (segmentsLength === 0) {
      return null;
    }
    map.getView().getProjection();
    const projectedCoordinate = fromUserCoordinate(pixelCoordinate);
    let closestVertex;
    let minSquaredDistance = Infinity;
    const squaredPixelTolerance = this.pixelTolerance_ * this.pixelTolerance_;
    const getResult = () => {
      if (closestVertex) {
        const vertexPixel = map.getPixelFromCoordinate(closestVertex);
        const squaredPixelDistance = squaredDistance(pixel, vertexPixel);
        if (squaredPixelDistance <= squaredPixelTolerance) {
          return {
            vertex: closestVertex,
            vertexPixel: [
              Math.round(vertexPixel[0]),
              Math.round(vertexPixel[1])
            ]
          };
        }
      }
      return null;
    };
    if (this.vertex_) {
      for (let i = 0; i < segmentsLength; ++i) {
        const segmentData = segments[i];
        if (segmentData.feature.getGeometry().getType() !== "Circle") {
          segmentData.segment.forEach((vertex) => {
            const tempVertexCoord = fromUserCoordinate(vertex);
            const delta = squaredDistance(projectedCoordinate, tempVertexCoord);
            if (delta < minSquaredDistance) {
              closestVertex = vertex;
              minSquaredDistance = delta;
            }
          });
        }
      }
      const result = getResult();
      if (result) {
        return result;
      }
    }
    if (this.edge_) {
      for (let i = 0; i < segmentsLength; ++i) {
        let vertex = null;
        const segmentData = segments[i];
        if (segmentData.feature.getGeometry().getType() === "Circle") {
          let circleGeometry = segmentData.feature.getGeometry();
          vertex = toUserCoordinate(
            closestOnCircle(
              projectedCoordinate,
              circleGeometry
            )
          );
        } else {
          const [segmentStart, segmentEnd] = segmentData.segment;
          if (segmentEnd) {
            tempSegment[0] = fromUserCoordinate(segmentStart);
            tempSegment[1] = fromUserCoordinate(segmentEnd);
            vertex = closestOnSegment(projectedCoordinate, tempSegment);
          }
        }
        if (vertex) {
          const delta = squaredDistance(projectedCoordinate, vertex);
          if (delta < minSquaredDistance) {
            closestVertex = vertex;
            minSquaredDistance = delta;
          }
        }
      }
      const result = getResult();
      if (result) {
        return result;
      }
    }
    return null;
  }
  updateFeature_(feature2) {
    this.removeFeature(feature2, false);
    this.addFeature(feature2, false);
  }
  segmentCircleGeometry_(segments, geometry) {
    this.getMap().getView().getProjection();
    let circleGeometry = geometry;
    const polygon = fromCircle(circleGeometry);
    const coordinates2 = polygon.getCoordinates()[0];
    for (let i = 0, ii = coordinates2.length - 1; i < ii; ++i) {
      segments.push(coordinates2.slice(i, i + 2));
    }
  }
  segmentGeometryCollectionGeometry_(segments, geometry) {
    const geometries = geometry.getGeometriesArray();
    for (let i = 0; i < geometries.length; ++i) {
      const segmenter = this.GEOMETRY_SEGMENTERS_[geometries[i].getType()];
      if (segmenter) {
        segmenter(segments, geometries[i]);
      }
    }
  }
  segmentLineStringGeometry_(segments, geometry) {
    const coordinates2 = geometry.getCoordinates();
    for (let i = 0, ii = coordinates2.length - 1; i < ii; ++i) {
      segments.push(coordinates2.slice(i, i + 2));
    }
  }
  segmentMultiLineStringGeometry_(segments, geometry) {
    const lines = geometry.getCoordinates();
    for (let j = 0, jj = lines.length; j < jj; ++j) {
      const coordinates2 = lines[j];
      for (let i = 0, ii = coordinates2.length - 1; i < ii; ++i) {
        segments.push(coordinates2.slice(i, i + 2));
      }
    }
  }
  segmentMultiPointGeometry_(segments, geometry) {
    geometry.getCoordinates().forEach((point) => {
      segments.push([point]);
    });
  }
  segmentMultiPolygonGeometry_(segments, geometry) {
    const polygons = geometry.getCoordinates();
    for (let k = 0, kk = polygons.length; k < kk; ++k) {
      const rings = polygons[k];
      for (let j = 0, jj = rings.length; j < jj; ++j) {
        const coordinates2 = rings[j];
        for (let i = 0, ii = coordinates2.length - 1; i < ii; ++i) {
          segments.push(coordinates2.slice(i, i + 2));
        }
      }
    }
  }
  segmentPointGeometry_(segments, geometry) {
    segments.push([geometry.getCoordinates()]);
  }
  segmentPolygonGeometry_(segments, geometry) {
    const rings = geometry.getCoordinates();
    for (let j = 0, jj = rings.length; j < jj; ++j) {
      const coordinates2 = rings[j];
      for (let i = 0, ii = coordinates2.length - 1; i < ii; ++i) {
        segments.push(coordinates2.slice(i, i + 2));
      }
    }
  }
}
const Snap$1 = Snap;
class Kinetic {
  constructor(decay, minVelocity, delay) {
    this.decay_ = decay;
    this.minVelocity_ = minVelocity;
    this.delay_ = delay;
    this.points_ = [];
    this.angle_ = 0;
    this.initialVelocity_ = 0;
  }
  begin() {
    this.points_.length = 0;
    this.angle_ = 0;
    this.initialVelocity_ = 0;
  }
  update(x, y) {
    this.points_.push(x, y, Date.now());
  }
  end() {
    if (this.points_.length < 6) {
      return false;
    }
    const delay = Date.now() - this.delay_;
    const lastIndex = this.points_.length - 3;
    if (this.points_[lastIndex + 2] < delay) {
      return false;
    }
    let firstIndex = lastIndex - 3;
    while (firstIndex > 0 && this.points_[firstIndex + 2] > delay) {
      firstIndex -= 3;
    }
    const duration = this.points_[lastIndex + 2] - this.points_[firstIndex + 2];
    if (duration < 1e3 / 60) {
      return false;
    }
    const dx = this.points_[lastIndex] - this.points_[firstIndex];
    const dy = this.points_[lastIndex + 1] - this.points_[firstIndex + 1];
    this.angle_ = Math.atan2(dy, dx);
    this.initialVelocity_ = Math.sqrt(dx * dx + dy * dy) / duration;
    return this.initialVelocity_ > this.minVelocity_;
  }
  getDistance() {
    return (this.minVelocity_ - this.initialVelocity_) / this.decay_;
  }
  getAngle() {
    return this.angle_;
  }
}
const Kinetic$1 = Kinetic;
function defaults$1(options) {
  options = options ? options : {};
  const interactions = new Collection$1();
  const kinetic = new Kinetic$1(-5e-3, 0.05, 100);
  const altShiftDragRotate = options.altShiftDragRotate !== void 0 ? options.altShiftDragRotate : true;
  if (altShiftDragRotate) {
    interactions.push(new DragRotate$1());
  }
  const doubleClickZoom = options.doubleClickZoom !== void 0 ? options.doubleClickZoom : true;
  if (doubleClickZoom) {
    interactions.push(
      new DoubleClickZoom$1({
        delta: options.zoomDelta,
        duration: options.zoomDuration
      })
    );
  }
  const dragPan = options.dragPan !== void 0 ? options.dragPan : true;
  if (dragPan) {
    interactions.push(
      new DragPan$1({
        onFocusOnly: options.onFocusOnly,
        kinetic
      })
    );
  }
  const pinchRotate = options.pinchRotate !== void 0 ? options.pinchRotate : true;
  if (pinchRotate) {
    interactions.push(new PinchRotate$1());
  }
  const pinchZoom = options.pinchZoom !== void 0 ? options.pinchZoom : true;
  if (pinchZoom) {
    interactions.push(
      new PinchZoom$1({
        duration: options.zoomDuration
      })
    );
  }
  const keyboard = options.keyboard !== void 0 ? options.keyboard : true;
  if (keyboard) {
    interactions.push(new KeyboardPan$1());
    interactions.push(
      new KeyboardZoom$1({
        delta: options.zoomDelta,
        duration: options.zoomDuration
      })
    );
  }
  const mouseWheelZoom = options.mouseWheelZoom !== void 0 ? options.mouseWheelZoom : true;
  if (mouseWheelZoom) {
    interactions.push(
      new MouseWheelZoom$1({
        onFocusOnly: options.onFocusOnly,
        duration: options.zoomDuration
      })
    );
  }
  const shiftDragZoom = options.shiftDragZoom !== void 0 ? options.shiftDragZoom : true;
  if (shiftDragZoom) {
    interactions.push(
      new DragZoom$1({
        duration: options.zoomDuration
      })
    );
  }
  return interactions;
}
class LRUCache {
  constructor(highWaterMark) {
    this.highWaterMark = highWaterMark !== void 0 ? highWaterMark : 2048;
    this.count_ = 0;
    this.entries_ = {};
    this.oldest_ = null;
    this.newest_ = null;
  }
  canExpireCache() {
    return this.highWaterMark > 0 && this.getCount() > this.highWaterMark;
  }
  expireCache(keep) {
    while (this.canExpireCache()) {
      this.pop();
    }
  }
  clear() {
    this.count_ = 0;
    this.entries_ = {};
    this.oldest_ = null;
    this.newest_ = null;
  }
  containsKey(key) {
    return this.entries_.hasOwnProperty(key);
  }
  forEach(f) {
    let entry = this.oldest_;
    while (entry) {
      f(entry.value_, entry.key_, this);
      entry = entry.newer;
    }
  }
  get(key, options) {
    const entry = this.entries_[key];
    assert(entry !== void 0, 15);
    if (entry === this.newest_) {
      return entry.value_;
    } else if (entry === this.oldest_) {
      this.oldest_ = this.oldest_.newer;
      this.oldest_.older = null;
    } else {
      entry.newer.older = entry.older;
      entry.older.newer = entry.newer;
    }
    entry.newer = null;
    entry.older = this.newest_;
    this.newest_.newer = entry;
    this.newest_ = entry;
    return entry.value_;
  }
  remove(key) {
    const entry = this.entries_[key];
    assert(entry !== void 0, 15);
    if (entry === this.newest_) {
      this.newest_ = entry.older;
      if (this.newest_) {
        this.newest_.newer = null;
      }
    } else if (entry === this.oldest_) {
      this.oldest_ = entry.newer;
      if (this.oldest_) {
        this.oldest_.older = null;
      }
    } else {
      entry.newer.older = entry.older;
      entry.older.newer = entry.newer;
    }
    delete this.entries_[key];
    --this.count_;
    return entry.value_;
  }
  getCount() {
    return this.count_;
  }
  getKeys() {
    const keys = new Array(this.count_);
    let i = 0;
    let entry;
    for (entry = this.newest_; entry; entry = entry.older) {
      keys[i++] = entry.key_;
    }
    return keys;
  }
  getValues() {
    const values = new Array(this.count_);
    let i = 0;
    let entry;
    for (entry = this.newest_; entry; entry = entry.older) {
      values[i++] = entry.value_;
    }
    return values;
  }
  peekLast() {
    return this.oldest_.value_;
  }
  peekLastKey() {
    return this.oldest_.key_;
  }
  peekFirstKey() {
    return this.newest_.key_;
  }
  peek(key) {
    if (!this.containsKey(key)) {
      return void 0;
    }
    return this.entries_[key].value_;
  }
  pop() {
    const entry = this.oldest_;
    delete this.entries_[entry.key_];
    if (entry.newer) {
      entry.newer.older = null;
    }
    this.oldest_ = entry.newer;
    if (!this.oldest_) {
      this.newest_ = null;
    }
    --this.count_;
    return entry.value_;
  }
  replace(key, value) {
    this.get(key);
    this.entries_[key].value_ = value;
  }
  set(key, value) {
    assert(!(key in this.entries_), 16);
    const entry = {
      key_: key,
      newer: null,
      older: this.newest_,
      value_: value
    };
    if (!this.newest_) {
      this.oldest_ = entry;
    } else {
      this.newest_.newer = entry;
    }
    this.newest_ = entry;
    this.entries_[key] = entry;
    ++this.count_;
  }
  setSize(size) {
    this.highWaterMark = size;
  }
}
const LRUCache$1 = LRUCache;
const TileState = {
  IDLE: 0,
  LOADING: 1,
  LOADED: 2,
  ERROR: 3,
  EMPTY: 4
};
class Tile extends EventTarget {
  constructor(tileCoord, state, options) {
    super();
    options = options ? options : {};
    this.tileCoord = tileCoord;
    this.state = state;
    this.interimTile = null;
    this.key = "";
    this.transition_ = options.transition === void 0 ? 250 : options.transition;
    this.transitionStarts_ = {};
    this.interpolate = !!options.interpolate;
  }
  changed() {
    this.dispatchEvent(EventType.CHANGE);
  }
  release() {
    if (this.state === TileState.ERROR) {
      this.setState(TileState.EMPTY);
    }
  }
  getKey() {
    return this.key + "/" + this.tileCoord;
  }
  getInterimTile() {
    if (!this.interimTile) {
      return this;
    }
    let tile = this.interimTile;
    do {
      if (tile.getState() == TileState.LOADED) {
        this.transition_ = 0;
        return tile;
      }
      tile = tile.interimTile;
    } while (tile);
    return this;
  }
  refreshInterimChain() {
    if (!this.interimTile) {
      return;
    }
    let tile = this.interimTile;
    let prev = this;
    do {
      if (tile.getState() == TileState.LOADED) {
        tile.interimTile = null;
        break;
      } else if (tile.getState() == TileState.LOADING) {
        prev = tile;
      } else if (tile.getState() == TileState.IDLE) {
        prev.interimTile = tile.interimTile;
      } else {
        prev = tile;
      }
      tile = prev.interimTile;
    } while (tile);
  }
  getTileCoord() {
    return this.tileCoord;
  }
  getState() {
    return this.state;
  }
  setState(state) {
    if (this.state !== TileState.ERROR && this.state > state) {
      throw new Error("Tile load sequence violation");
    }
    this.state = state;
    this.changed();
  }
  load() {
    abstract();
  }
  getAlpha(id, time) {
    if (!this.transition_) {
      return 1;
    }
    let start = this.transitionStarts_[id];
    if (!start) {
      start = time;
      this.transitionStarts_[id] = start;
    } else if (start === -1) {
      return 1;
    }
    const delta = time - start + 1e3 / 60;
    if (delta >= this.transition_) {
      return 1;
    }
    return easeIn(delta / this.transition_);
  }
  inTransition(id) {
    if (!this.transition_) {
      return false;
    }
    return this.transitionStarts_[id] !== -1;
  }
  endTransition(id) {
    if (this.transition_) {
      this.transitionStarts_[id] = -1;
    }
  }
}
const Tile$1 = Tile;
class ImageTile extends Tile$1 {
  constructor(tileCoord, state, src, crossOrigin, tileLoadFunction, options) {
    super(tileCoord, state, options);
    this.crossOrigin_ = crossOrigin;
    this.src_ = src;
    this.key = src;
    this.image_ = new Image();
    if (crossOrigin !== null) {
      this.image_.crossOrigin = crossOrigin;
    }
    this.unlisten_ = null;
    this.tileLoadFunction_ = tileLoadFunction;
  }
  getImage() {
    return this.image_;
  }
  setImage(element) {
    this.image_ = element;
    this.state = TileState.LOADED;
    this.unlistenImage_();
    this.changed();
  }
  handleImageError_() {
    this.state = TileState.ERROR;
    this.unlistenImage_();
    this.image_ = getBlankImage();
    this.changed();
  }
  handleImageLoad_() {
    const image = this.image_;
    if (image.naturalWidth && image.naturalHeight) {
      this.state = TileState.LOADED;
    } else {
      this.state = TileState.EMPTY;
    }
    this.unlistenImage_();
    this.changed();
  }
  load() {
    if (this.state == TileState.ERROR) {
      this.state = TileState.IDLE;
      this.image_ = new Image();
      if (this.crossOrigin_ !== null) {
        this.image_.crossOrigin = this.crossOrigin_;
      }
    }
    if (this.state == TileState.IDLE) {
      this.state = TileState.LOADING;
      this.changed();
      this.tileLoadFunction_(this, this.src_);
      this.unlisten_ = listenImage(
        this.image_,
        this.handleImageLoad_.bind(this),
        this.handleImageError_.bind(this)
      );
    }
  }
  unlistenImage_() {
    if (this.unlisten_) {
      this.unlisten_();
      this.unlisten_ = null;
    }
  }
}
function getBlankImage() {
  const ctx = createCanvasContext2D(1, 1);
  ctx.fillStyle = "rgba(0,0,0,0)";
  ctx.fillRect(0, 0, 1, 1);
  return ctx.canvas;
}
const ImageTile$1 = ImageTile;
const ERROR_THRESHOLD = 0.5;
const MAX_SUBDIVISION = 10;
const MAX_TRIANGLE_WIDTH = 0.25;
class Triangulation {
  constructor(sourceProj, targetProj, targetExtent, maxSourceExtent, errorThreshold, destinationResolution) {
    this.sourceProj_ = sourceProj;
    this.targetProj_ = targetProj;
    let transformInvCache = {};
    const transformInv = getTransform(this.targetProj_, this.sourceProj_);
    this.transformInv_ = function(c) {
      const key = c[0] + "/" + c[1];
      if (!transformInvCache[key]) {
        transformInvCache[key] = transformInv(c);
      }
      return transformInvCache[key];
    };
    this.maxSourceExtent_ = maxSourceExtent;
    this.errorThresholdSquared_ = errorThreshold * errorThreshold;
    this.triangles_ = [];
    this.wrapsXInSource_ = false;
    this.canWrapXInSource_ = this.sourceProj_.canWrapX() && !!maxSourceExtent && !!this.sourceProj_.getExtent() && getWidth(maxSourceExtent) == getWidth(this.sourceProj_.getExtent());
    this.sourceWorldWidth_ = this.sourceProj_.getExtent() ? getWidth(this.sourceProj_.getExtent()) : null;
    this.targetWorldWidth_ = this.targetProj_.getExtent() ? getWidth(this.targetProj_.getExtent()) : null;
    const destinationTopLeft = getTopLeft(targetExtent);
    const destinationTopRight = getTopRight(targetExtent);
    const destinationBottomRight = getBottomRight(targetExtent);
    const destinationBottomLeft = getBottomLeft(targetExtent);
    const sourceTopLeft = this.transformInv_(destinationTopLeft);
    const sourceTopRight = this.transformInv_(destinationTopRight);
    const sourceBottomRight = this.transformInv_(destinationBottomRight);
    const sourceBottomLeft = this.transformInv_(destinationBottomLeft);
    const maxSubdivision = MAX_SUBDIVISION + (destinationResolution ? Math.max(
      0,
      Math.ceil(
        Math.log2(
          getArea(targetExtent) / (destinationResolution * destinationResolution * 256 * 256)
        )
      )
    ) : 0);
    this.addQuad_(
      destinationTopLeft,
      destinationTopRight,
      destinationBottomRight,
      destinationBottomLeft,
      sourceTopLeft,
      sourceTopRight,
      sourceBottomRight,
      sourceBottomLeft,
      maxSubdivision
    );
    if (this.wrapsXInSource_) {
      let leftBound = Infinity;
      this.triangles_.forEach(function(triangle, i, arr) {
        leftBound = Math.min(
          leftBound,
          triangle.source[0][0],
          triangle.source[1][0],
          triangle.source[2][0]
        );
      });
      this.triangles_.forEach(
        function(triangle) {
          if (Math.max(
            triangle.source[0][0],
            triangle.source[1][0],
            triangle.source[2][0]
          ) - leftBound > this.sourceWorldWidth_ / 2) {
            const newTriangle = [
              [triangle.source[0][0], triangle.source[0][1]],
              [triangle.source[1][0], triangle.source[1][1]],
              [triangle.source[2][0], triangle.source[2][1]]
            ];
            if (newTriangle[0][0] - leftBound > this.sourceWorldWidth_ / 2) {
              newTriangle[0][0] -= this.sourceWorldWidth_;
            }
            if (newTriangle[1][0] - leftBound > this.sourceWorldWidth_ / 2) {
              newTriangle[1][0] -= this.sourceWorldWidth_;
            }
            if (newTriangle[2][0] - leftBound > this.sourceWorldWidth_ / 2) {
              newTriangle[2][0] -= this.sourceWorldWidth_;
            }
            const minX = Math.min(
              newTriangle[0][0],
              newTriangle[1][0],
              newTriangle[2][0]
            );
            const maxX = Math.max(
              newTriangle[0][0],
              newTriangle[1][0],
              newTriangle[2][0]
            );
            if (maxX - minX < this.sourceWorldWidth_ / 2) {
              triangle.source = newTriangle;
            }
          }
        }.bind(this)
      );
    }
    transformInvCache = {};
  }
  addTriangle_(a, b, c, aSrc, bSrc, cSrc) {
    this.triangles_.push({
      source: [aSrc, bSrc, cSrc],
      target: [a, b, c]
    });
  }
  addQuad_(a, b, c, d, aSrc, bSrc, cSrc, dSrc, maxSubdivision) {
    const sourceQuadExtent = boundingExtent([aSrc, bSrc, cSrc, dSrc]);
    const sourceCoverageX = this.sourceWorldWidth_ ? getWidth(sourceQuadExtent) / this.sourceWorldWidth_ : null;
    const sourceWorldWidth = this.sourceWorldWidth_;
    const wrapsX = this.sourceProj_.canWrapX() && sourceCoverageX > 0.5 && sourceCoverageX < 1;
    let needsSubdivision = false;
    if (maxSubdivision > 0) {
      if (this.targetProj_.isGlobal() && this.targetWorldWidth_) {
        const targetQuadExtent = boundingExtent([a, b, c, d]);
        const targetCoverageX = getWidth(targetQuadExtent) / this.targetWorldWidth_;
        needsSubdivision = targetCoverageX > MAX_TRIANGLE_WIDTH || needsSubdivision;
      }
      if (!wrapsX && this.sourceProj_.isGlobal() && sourceCoverageX) {
        needsSubdivision = sourceCoverageX > MAX_TRIANGLE_WIDTH || needsSubdivision;
      }
    }
    if (!needsSubdivision && this.maxSourceExtent_) {
      if (isFinite(sourceQuadExtent[0]) && isFinite(sourceQuadExtent[1]) && isFinite(sourceQuadExtent[2]) && isFinite(sourceQuadExtent[3])) {
        if (!intersects$2(sourceQuadExtent, this.maxSourceExtent_)) {
          return;
        }
      }
    }
    let isNotFinite = 0;
    if (!needsSubdivision) {
      if (!isFinite(aSrc[0]) || !isFinite(aSrc[1]) || !isFinite(bSrc[0]) || !isFinite(bSrc[1]) || !isFinite(cSrc[0]) || !isFinite(cSrc[1]) || !isFinite(dSrc[0]) || !isFinite(dSrc[1])) {
        if (maxSubdivision > 0) {
          needsSubdivision = true;
        } else {
          isNotFinite = (!isFinite(aSrc[0]) || !isFinite(aSrc[1]) ? 8 : 0) + (!isFinite(bSrc[0]) || !isFinite(bSrc[1]) ? 4 : 0) + (!isFinite(cSrc[0]) || !isFinite(cSrc[1]) ? 2 : 0) + (!isFinite(dSrc[0]) || !isFinite(dSrc[1]) ? 1 : 0);
          if (isNotFinite != 1 && isNotFinite != 2 && isNotFinite != 4 && isNotFinite != 8) {
            return;
          }
        }
      }
    }
    if (maxSubdivision > 0) {
      if (!needsSubdivision) {
        const center = [(a[0] + c[0]) / 2, (a[1] + c[1]) / 2];
        const centerSrc = this.transformInv_(center);
        let dx;
        if (wrapsX) {
          const centerSrcEstimX = (modulo(aSrc[0], sourceWorldWidth) + modulo(cSrc[0], sourceWorldWidth)) / 2;
          dx = centerSrcEstimX - modulo(centerSrc[0], sourceWorldWidth);
        } else {
          dx = (aSrc[0] + cSrc[0]) / 2 - centerSrc[0];
        }
        const dy = (aSrc[1] + cSrc[1]) / 2 - centerSrc[1];
        const centerSrcErrorSquared = dx * dx + dy * dy;
        needsSubdivision = centerSrcErrorSquared > this.errorThresholdSquared_;
      }
      if (needsSubdivision) {
        if (Math.abs(a[0] - c[0]) <= Math.abs(a[1] - c[1])) {
          const bc = [(b[0] + c[0]) / 2, (b[1] + c[1]) / 2];
          const bcSrc = this.transformInv_(bc);
          const da = [(d[0] + a[0]) / 2, (d[1] + a[1]) / 2];
          const daSrc = this.transformInv_(da);
          this.addQuad_(
            a,
            b,
            bc,
            da,
            aSrc,
            bSrc,
            bcSrc,
            daSrc,
            maxSubdivision - 1
          );
          this.addQuad_(
            da,
            bc,
            c,
            d,
            daSrc,
            bcSrc,
            cSrc,
            dSrc,
            maxSubdivision - 1
          );
        } else {
          const ab = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
          const abSrc = this.transformInv_(ab);
          const cd = [(c[0] + d[0]) / 2, (c[1] + d[1]) / 2];
          const cdSrc = this.transformInv_(cd);
          this.addQuad_(
            a,
            ab,
            cd,
            d,
            aSrc,
            abSrc,
            cdSrc,
            dSrc,
            maxSubdivision - 1
          );
          this.addQuad_(
            ab,
            b,
            c,
            cd,
            abSrc,
            bSrc,
            cSrc,
            cdSrc,
            maxSubdivision - 1
          );
        }
        return;
      }
    }
    if (wrapsX) {
      if (!this.canWrapXInSource_) {
        return;
      }
      this.wrapsXInSource_ = true;
    }
    if ((isNotFinite & 11) == 0) {
      this.addTriangle_(a, c, d, aSrc, cSrc, dSrc);
    }
    if ((isNotFinite & 14) == 0) {
      this.addTriangle_(a, c, b, aSrc, cSrc, bSrc);
    }
    if (isNotFinite) {
      if ((isNotFinite & 13) == 0) {
        this.addTriangle_(b, d, a, bSrc, dSrc, aSrc);
      }
      if ((isNotFinite & 7) == 0) {
        this.addTriangle_(b, d, c, bSrc, dSrc, cSrc);
      }
    }
  }
  calculateSourceExtent() {
    const extent = createEmpty();
    this.triangles_.forEach(function(triangle, i, arr) {
      const src = triangle.source;
      extendCoordinate(extent, src[0]);
      extendCoordinate(extent, src[1]);
      extendCoordinate(extent, src[2]);
    });
    return extent;
  }
  getTriangles() {
    return this.triangles_;
  }
}
const Triangulation$1 = Triangulation;
let brokenDiagonalRendering_;
const canvasPool = [];
function drawTestTriangle(ctx, u1, v1, u2, v2) {
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(u1, v1);
  ctx.lineTo(u2, v2);
  ctx.closePath();
  ctx.save();
  ctx.clip();
  ctx.fillRect(0, 0, Math.max(u1, u2) + 1, Math.max(v1, v2));
  ctx.restore();
}
function verifyBrokenDiagonalRendering(data, offset) {
  return Math.abs(data[offset * 4] - 210) > 2 || Math.abs(data[offset * 4 + 3] - 0.75 * 255) > 2;
}
function isBrokenDiagonalRendering() {
  if (brokenDiagonalRendering_ === void 0) {
    const ctx = document.createElement("canvas").getContext("2d");
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = "rgba(210, 0, 0, 0.75)";
    drawTestTriangle(ctx, 4, 5, 4, 0);
    drawTestTriangle(ctx, 4, 5, 0, 5);
    const data = ctx.getImageData(0, 0, 3, 3).data;
    brokenDiagonalRendering_ = verifyBrokenDiagonalRendering(data, 0) || verifyBrokenDiagonalRendering(data, 4) || verifyBrokenDiagonalRendering(data, 8);
  }
  return brokenDiagonalRendering_;
}
function calculateSourceResolution(sourceProj, targetProj, targetCenter, targetResolution) {
  const sourceCenter = transform(targetCenter, targetProj, sourceProj);
  let sourceResolution = getPointResolution(
    targetProj,
    targetResolution,
    targetCenter
  );
  const targetMetersPerUnit = targetProj.getMetersPerUnit();
  if (targetMetersPerUnit !== void 0) {
    sourceResolution *= targetMetersPerUnit;
  }
  const sourceMetersPerUnit = sourceProj.getMetersPerUnit();
  if (sourceMetersPerUnit !== void 0) {
    sourceResolution /= sourceMetersPerUnit;
  }
  const sourceExtent = sourceProj.getExtent();
  if (!sourceExtent || containsCoordinate(sourceExtent, sourceCenter)) {
    const compensationFactor = getPointResolution(sourceProj, sourceResolution, sourceCenter) / sourceResolution;
    if (isFinite(compensationFactor) && compensationFactor > 0) {
      sourceResolution /= compensationFactor;
    }
  }
  return sourceResolution;
}
function calculateSourceExtentResolution(sourceProj, targetProj, targetExtent, targetResolution) {
  const targetCenter = getCenter(targetExtent);
  let sourceResolution = calculateSourceResolution(
    sourceProj,
    targetProj,
    targetCenter,
    targetResolution
  );
  if (!isFinite(sourceResolution) || sourceResolution <= 0) {
    forEachCorner(targetExtent, function(corner) {
      sourceResolution = calculateSourceResolution(
        sourceProj,
        targetProj,
        corner,
        targetResolution
      );
      return isFinite(sourceResolution) && sourceResolution > 0;
    });
  }
  return sourceResolution;
}
function render(width, height, pixelRatio, sourceResolution, sourceExtent, targetResolution, targetExtent, triangulation, sources, gutter, renderEdges, interpolate) {
  const context = createCanvasContext2D(
    Math.round(pixelRatio * width),
    Math.round(pixelRatio * height),
    canvasPool
  );
  if (!interpolate) {
    context.imageSmoothingEnabled = false;
  }
  if (sources.length === 0) {
    return context.canvas;
  }
  context.scale(pixelRatio, pixelRatio);
  function pixelRound(value) {
    return Math.round(value * pixelRatio) / pixelRatio;
  }
  context.globalCompositeOperation = "lighter";
  const sourceDataExtent = createEmpty();
  sources.forEach(function(src, i, arr) {
    extend$2(sourceDataExtent, src.extent);
  });
  const canvasWidthInUnits = getWidth(sourceDataExtent);
  const canvasHeightInUnits = getHeight(sourceDataExtent);
  const stitchContext = createCanvasContext2D(
    Math.round(pixelRatio * canvasWidthInUnits / sourceResolution),
    Math.round(pixelRatio * canvasHeightInUnits / sourceResolution)
  );
  if (!interpolate) {
    stitchContext.imageSmoothingEnabled = false;
  }
  const stitchScale = pixelRatio / sourceResolution;
  sources.forEach(function(src, i, arr) {
    const xPos = src.extent[0] - sourceDataExtent[0];
    const yPos = -(src.extent[3] - sourceDataExtent[3]);
    const srcWidth = getWidth(src.extent);
    const srcHeight = getHeight(src.extent);
    if (src.image.width > 0 && src.image.height > 0) {
      stitchContext.drawImage(
        src.image,
        gutter,
        gutter,
        src.image.width - 2 * gutter,
        src.image.height - 2 * gutter,
        xPos * stitchScale,
        yPos * stitchScale,
        srcWidth * stitchScale,
        srcHeight * stitchScale
      );
    }
  });
  const targetTopLeft = getTopLeft(targetExtent);
  triangulation.getTriangles().forEach(function(triangle, i, arr) {
    const source = triangle.source;
    const target = triangle.target;
    let x0 = source[0][0], y0 = source[0][1];
    let x1 = source[1][0], y1 = source[1][1];
    let x2 = source[2][0], y2 = source[2][1];
    const u0 = pixelRound((target[0][0] - targetTopLeft[0]) / targetResolution);
    const v0 = pixelRound(
      -(target[0][1] - targetTopLeft[1]) / targetResolution
    );
    const u1 = pixelRound((target[1][0] - targetTopLeft[0]) / targetResolution);
    const v1 = pixelRound(
      -(target[1][1] - targetTopLeft[1]) / targetResolution
    );
    const u2 = pixelRound((target[2][0] - targetTopLeft[0]) / targetResolution);
    const v2 = pixelRound(
      -(target[2][1] - targetTopLeft[1]) / targetResolution
    );
    const sourceNumericalShiftX = x0;
    const sourceNumericalShiftY = y0;
    x0 = 0;
    y0 = 0;
    x1 -= sourceNumericalShiftX;
    y1 -= sourceNumericalShiftY;
    x2 -= sourceNumericalShiftX;
    y2 -= sourceNumericalShiftY;
    const augmentedMatrix = [
      [x1, y1, 0, 0, u1 - u0],
      [x2, y2, 0, 0, u2 - u0],
      [0, 0, x1, y1, v1 - v0],
      [0, 0, x2, y2, v2 - v0]
    ];
    const affineCoefs = solveLinearSystem(augmentedMatrix);
    if (!affineCoefs) {
      return;
    }
    context.save();
    context.beginPath();
    if (isBrokenDiagonalRendering() || !interpolate) {
      context.moveTo(u1, v1);
      const steps = 4;
      const ud = u0 - u1;
      const vd = v0 - v1;
      for (let step = 0; step < steps; step++) {
        context.lineTo(
          u1 + pixelRound((step + 1) * ud / steps),
          v1 + pixelRound(step * vd / (steps - 1))
        );
        if (step != steps - 1) {
          context.lineTo(
            u1 + pixelRound((step + 1) * ud / steps),
            v1 + pixelRound((step + 1) * vd / (steps - 1))
          );
        }
      }
      context.lineTo(u2, v2);
    } else {
      context.moveTo(u1, v1);
      context.lineTo(u0, v0);
      context.lineTo(u2, v2);
    }
    context.clip();
    context.transform(
      affineCoefs[0],
      affineCoefs[2],
      affineCoefs[1],
      affineCoefs[3],
      u0,
      v0
    );
    context.translate(
      sourceDataExtent[0] - sourceNumericalShiftX,
      sourceDataExtent[3] - sourceNumericalShiftY
    );
    context.scale(
      sourceResolution / pixelRatio,
      -sourceResolution / pixelRatio
    );
    context.drawImage(stitchContext.canvas, 0, 0);
    context.restore();
  });
  if (renderEdges) {
    context.save();
    context.globalCompositeOperation = "source-over";
    context.strokeStyle = "black";
    context.lineWidth = 1;
    triangulation.getTriangles().forEach(function(triangle, i, arr) {
      const target = triangle.target;
      const u0 = (target[0][0] - targetTopLeft[0]) / targetResolution;
      const v0 = -(target[0][1] - targetTopLeft[1]) / targetResolution;
      const u1 = (target[1][0] - targetTopLeft[0]) / targetResolution;
      const v1 = -(target[1][1] - targetTopLeft[1]) / targetResolution;
      const u2 = (target[2][0] - targetTopLeft[0]) / targetResolution;
      const v2 = -(target[2][1] - targetTopLeft[1]) / targetResolution;
      context.beginPath();
      context.moveTo(u1, v1);
      context.lineTo(u0, v0);
      context.lineTo(u2, v2);
      context.closePath();
      context.stroke();
    });
    context.restore();
  }
  return context.canvas;
}
class ReprojTile extends Tile$1 {
  constructor(sourceProj, sourceTileGrid, targetProj, targetTileGrid, tileCoord, wrappedTileCoord, pixelRatio, gutter, getTileFunction, errorThreshold, renderEdges, interpolate) {
    super(tileCoord, TileState.IDLE, { interpolate: !!interpolate });
    this.renderEdges_ = renderEdges !== void 0 ? renderEdges : false;
    this.pixelRatio_ = pixelRatio;
    this.gutter_ = gutter;
    this.canvas_ = null;
    this.sourceTileGrid_ = sourceTileGrid;
    this.targetTileGrid_ = targetTileGrid;
    this.wrappedTileCoord_ = wrappedTileCoord ? wrappedTileCoord : tileCoord;
    this.sourceTiles_ = [];
    this.sourcesListenerKeys_ = null;
    this.sourceZ_ = 0;
    const targetExtent = targetTileGrid.getTileCoordExtent(
      this.wrappedTileCoord_
    );
    const maxTargetExtent = this.targetTileGrid_.getExtent();
    let maxSourceExtent = this.sourceTileGrid_.getExtent();
    const limitedTargetExtent = maxTargetExtent ? getIntersection(targetExtent, maxTargetExtent) : targetExtent;
    if (getArea(limitedTargetExtent) === 0) {
      this.state = TileState.EMPTY;
      return;
    }
    const sourceProjExtent = sourceProj.getExtent();
    if (sourceProjExtent) {
      if (!maxSourceExtent) {
        maxSourceExtent = sourceProjExtent;
      } else {
        maxSourceExtent = getIntersection(maxSourceExtent, sourceProjExtent);
      }
    }
    const targetResolution = targetTileGrid.getResolution(
      this.wrappedTileCoord_[0]
    );
    const sourceResolution = calculateSourceExtentResolution(
      sourceProj,
      targetProj,
      limitedTargetExtent,
      targetResolution
    );
    if (!isFinite(sourceResolution) || sourceResolution <= 0) {
      this.state = TileState.EMPTY;
      return;
    }
    const errorThresholdInPixels = errorThreshold !== void 0 ? errorThreshold : ERROR_THRESHOLD;
    this.triangulation_ = new Triangulation$1(
      sourceProj,
      targetProj,
      limitedTargetExtent,
      maxSourceExtent,
      sourceResolution * errorThresholdInPixels,
      targetResolution
    );
    if (this.triangulation_.getTriangles().length === 0) {
      this.state = TileState.EMPTY;
      return;
    }
    this.sourceZ_ = sourceTileGrid.getZForResolution(sourceResolution);
    let sourceExtent = this.triangulation_.calculateSourceExtent();
    if (maxSourceExtent) {
      if (sourceProj.canWrapX()) {
        sourceExtent[1] = clamp(
          sourceExtent[1],
          maxSourceExtent[1],
          maxSourceExtent[3]
        );
        sourceExtent[3] = clamp(
          sourceExtent[3],
          maxSourceExtent[1],
          maxSourceExtent[3]
        );
      } else {
        sourceExtent = getIntersection(sourceExtent, maxSourceExtent);
      }
    }
    if (!getArea(sourceExtent)) {
      this.state = TileState.EMPTY;
    } else {
      const sourceRange = sourceTileGrid.getTileRangeForExtentAndZ(
        sourceExtent,
        this.sourceZ_
      );
      for (let srcX = sourceRange.minX; srcX <= sourceRange.maxX; srcX++) {
        for (let srcY = sourceRange.minY; srcY <= sourceRange.maxY; srcY++) {
          const tile = getTileFunction(this.sourceZ_, srcX, srcY, pixelRatio);
          if (tile) {
            this.sourceTiles_.push(tile);
          }
        }
      }
      if (this.sourceTiles_.length === 0) {
        this.state = TileState.EMPTY;
      }
    }
  }
  getImage() {
    return this.canvas_;
  }
  reproject_() {
    const sources = [];
    this.sourceTiles_.forEach(
      function(tile, i, arr) {
        if (tile && tile.getState() == TileState.LOADED) {
          sources.push({
            extent: this.sourceTileGrid_.getTileCoordExtent(tile.tileCoord),
            image: tile.getImage()
          });
        }
      }.bind(this)
    );
    this.sourceTiles_.length = 0;
    if (sources.length === 0) {
      this.state = TileState.ERROR;
    } else {
      const z = this.wrappedTileCoord_[0];
      const size = this.targetTileGrid_.getTileSize(z);
      const width = typeof size === "number" ? size : size[0];
      const height = typeof size === "number" ? size : size[1];
      const targetResolution = this.targetTileGrid_.getResolution(z);
      const sourceResolution = this.sourceTileGrid_.getResolution(
        this.sourceZ_
      );
      const targetExtent = this.targetTileGrid_.getTileCoordExtent(
        this.wrappedTileCoord_
      );
      this.canvas_ = render(
        width,
        height,
        this.pixelRatio_,
        sourceResolution,
        this.sourceTileGrid_.getExtent(),
        targetResolution,
        targetExtent,
        this.triangulation_,
        sources,
        this.gutter_,
        this.renderEdges_,
        this.interpolate
      );
      this.state = TileState.LOADED;
    }
    this.changed();
  }
  load() {
    if (this.state == TileState.IDLE) {
      this.state = TileState.LOADING;
      this.changed();
      let leftToLoad = 0;
      this.sourcesListenerKeys_ = [];
      this.sourceTiles_.forEach(
        function(tile, i, arr) {
          const state = tile.getState();
          if (state == TileState.IDLE || state == TileState.LOADING) {
            leftToLoad++;
            const sourceListenKey = listen(
              tile,
              EventType.CHANGE,
              function(e) {
                const state2 = tile.getState();
                if (state2 == TileState.LOADED || state2 == TileState.ERROR || state2 == TileState.EMPTY) {
                  unlistenByKey(sourceListenKey);
                  leftToLoad--;
                  if (leftToLoad === 0) {
                    this.unlistenSources_();
                    this.reproject_();
                  }
                }
              },
              this
            );
            this.sourcesListenerKeys_.push(sourceListenKey);
          }
        }.bind(this)
      );
      if (leftToLoad === 0) {
        setTimeout(this.reproject_.bind(this), 0);
      } else {
        this.sourceTiles_.forEach(function(tile, i, arr) {
          const state = tile.getState();
          if (state == TileState.IDLE) {
            tile.load();
          }
        });
      }
    }
  }
  unlistenSources_() {
    this.sourcesListenerKeys_.forEach(unlistenByKey);
    this.sourcesListenerKeys_ = null;
  }
  release() {
    if (this.canvas_) {
      releaseCanvas$1(this.canvas_.getContext("2d"));
      canvasPool.push(this.canvas_);
      this.canvas_ = null;
    }
    super.release();
  }
}
const ReprojTile$1 = ReprojTile;
function createOrUpdate$1(z, x, y, tileCoord) {
  if (tileCoord !== void 0) {
    tileCoord[0] = z;
    tileCoord[1] = x;
    tileCoord[2] = y;
    return tileCoord;
  } else {
    return [z, x, y];
  }
}
function getKeyZXY(z, x, y) {
  return z + "/" + x + "/" + y;
}
function getKey(tileCoord) {
  return getKeyZXY(tileCoord[0], tileCoord[1], tileCoord[2]);
}
function fromKey(key) {
  return key.split("/").map(Number);
}
function hash(tileCoord) {
  return (tileCoord[1] << tileCoord[0]) + tileCoord[2];
}
function withinExtentAndZ(tileCoord, tileGrid) {
  const z = tileCoord[0];
  const x = tileCoord[1];
  const y = tileCoord[2];
  if (tileGrid.getMinZoom() > z || z > tileGrid.getMaxZoom()) {
    return false;
  }
  const tileRange = tileGrid.getFullTileRange(z);
  if (!tileRange) {
    return true;
  } else {
    return tileRange.containsXY(x, y);
  }
}
class TileCache extends LRUCache$1 {
  clear() {
    while (this.getCount() > 0) {
      this.pop().release();
    }
    super.clear();
  }
  expireCache(usedTiles) {
    while (this.canExpireCache()) {
      const tile = this.peekLast();
      if (tile.getKey() in usedTiles) {
        break;
      } else {
        this.pop().release();
      }
    }
  }
  pruneExceptNewestZ() {
    if (this.getCount() === 0) {
      return;
    }
    const key = this.peekFirstKey();
    const tileCoord = fromKey(key);
    const z = tileCoord[0];
    this.forEach(
      function(tile) {
        if (tile.tileCoord[0] !== z) {
          this.remove(getKey(tile.tileCoord));
          tile.release();
        }
      }.bind(this)
    );
  }
}
const TileCache$1 = TileCache;
const TileEventType = {
  TILELOADSTART: "tileloadstart",
  TILELOADEND: "tileloadend",
  TILELOADERROR: "tileloaderror"
};
class TileRange {
  constructor(minX, maxX, minY, maxY) {
    this.minX = minX;
    this.maxX = maxX;
    this.minY = minY;
    this.maxY = maxY;
  }
  contains(tileCoord) {
    return this.containsXY(tileCoord[1], tileCoord[2]);
  }
  containsTileRange(tileRange) {
    return this.minX <= tileRange.minX && tileRange.maxX <= this.maxX && this.minY <= tileRange.minY && tileRange.maxY <= this.maxY;
  }
  containsXY(x, y) {
    return this.minX <= x && x <= this.maxX && this.minY <= y && y <= this.maxY;
  }
  equals(tileRange) {
    return this.minX == tileRange.minX && this.minY == tileRange.minY && this.maxX == tileRange.maxX && this.maxY == tileRange.maxY;
  }
  extend(tileRange) {
    if (tileRange.minX < this.minX) {
      this.minX = tileRange.minX;
    }
    if (tileRange.maxX > this.maxX) {
      this.maxX = tileRange.maxX;
    }
    if (tileRange.minY < this.minY) {
      this.minY = tileRange.minY;
    }
    if (tileRange.maxY > this.maxY) {
      this.maxY = tileRange.maxY;
    }
  }
  getHeight() {
    return this.maxY - this.minY + 1;
  }
  getSize() {
    return [this.getWidth(), this.getHeight()];
  }
  getWidth() {
    return this.maxX - this.minX + 1;
  }
  intersects(tileRange) {
    return this.minX <= tileRange.maxX && this.maxX >= tileRange.minX && this.minY <= tileRange.maxY && this.maxY >= tileRange.minY;
  }
}
function createOrUpdate(minX, maxX, minY, maxY, tileRange) {
  if (tileRange !== void 0) {
    tileRange.minX = minX;
    tileRange.maxX = maxX;
    tileRange.minY = minY;
    tileRange.maxY = maxY;
    return tileRange;
  } else {
    return new TileRange(minX, maxX, minY, maxY);
  }
}
const TileRange$1 = TileRange;
const DEFAULT_MAX_ZOOM = 42;
const DEFAULT_TILE_SIZE = 256;
const tmpTileCoord = [0, 0, 0];
const DECIMALS = 5;
class TileGrid {
  constructor(options) {
    this.minZoom = options.minZoom !== void 0 ? options.minZoom : 0;
    this.resolutions_ = options.resolutions;
    assert(
      isSorted(
        this.resolutions_,
        function(a, b) {
          return b - a;
        },
        true
      ),
      17
    );
    let zoomFactor;
    if (!options.origins) {
      for (let i = 0, ii = this.resolutions_.length - 1; i < ii; ++i) {
        if (!zoomFactor) {
          zoomFactor = this.resolutions_[i] / this.resolutions_[i + 1];
        } else {
          if (this.resolutions_[i] / this.resolutions_[i + 1] !== zoomFactor) {
            zoomFactor = void 0;
            break;
          }
        }
      }
    }
    this.zoomFactor_ = zoomFactor;
    this.maxZoom = this.resolutions_.length - 1;
    this.origin_ = options.origin !== void 0 ? options.origin : null;
    this.origins_ = null;
    if (options.origins !== void 0) {
      this.origins_ = options.origins;
      assert(this.origins_.length == this.resolutions_.length, 20);
    }
    const extent = options.extent;
    if (extent !== void 0 && !this.origin_ && !this.origins_) {
      this.origin_ = getTopLeft(extent);
    }
    assert(
      !this.origin_ && this.origins_ || this.origin_ && !this.origins_,
      18
    );
    this.tileSizes_ = null;
    if (options.tileSizes !== void 0) {
      this.tileSizes_ = options.tileSizes;
      assert(this.tileSizes_.length == this.resolutions_.length, 19);
    }
    this.tileSize_ = options.tileSize !== void 0 ? options.tileSize : !this.tileSizes_ ? DEFAULT_TILE_SIZE : null;
    assert(
      !this.tileSize_ && this.tileSizes_ || this.tileSize_ && !this.tileSizes_,
      22
    );
    this.extent_ = extent !== void 0 ? extent : null;
    this.fullTileRanges_ = null;
    this.tmpSize_ = [0, 0];
    this.tmpExtent_ = [0, 0, 0, 0];
    if (options.sizes !== void 0) {
      this.fullTileRanges_ = options.sizes.map(function(size, z) {
        const tileRange = new TileRange$1(
          Math.min(0, size[0]),
          Math.max(size[0] - 1, -1),
          Math.min(0, size[1]),
          Math.max(size[1] - 1, -1)
        );
        if (extent) {
          const restrictedTileRange = this.getTileRangeForExtentAndZ(extent, z);
          tileRange.minX = Math.max(restrictedTileRange.minX, tileRange.minX);
          tileRange.maxX = Math.min(restrictedTileRange.maxX, tileRange.maxX);
          tileRange.minY = Math.max(restrictedTileRange.minY, tileRange.minY);
          tileRange.maxY = Math.min(restrictedTileRange.maxY, tileRange.maxY);
        }
        return tileRange;
      }, this);
    } else if (extent) {
      this.calculateTileRanges_(extent);
    }
  }
  forEachTileCoord(extent, zoom, callback) {
    const tileRange = this.getTileRangeForExtentAndZ(extent, zoom);
    for (let i = tileRange.minX, ii = tileRange.maxX; i <= ii; ++i) {
      for (let j = tileRange.minY, jj = tileRange.maxY; j <= jj; ++j) {
        callback([zoom, i, j]);
      }
    }
  }
  forEachTileCoordParentTileRange(tileCoord, callback, tempTileRange, tempExtent2) {
    let tileRange, x, y;
    let tileCoordExtent = null;
    let z = tileCoord[0] - 1;
    if (this.zoomFactor_ === 2) {
      x = tileCoord[1];
      y = tileCoord[2];
    } else {
      tileCoordExtent = this.getTileCoordExtent(tileCoord, tempExtent2);
    }
    while (z >= this.minZoom) {
      if (this.zoomFactor_ === 2) {
        x = Math.floor(x / 2);
        y = Math.floor(y / 2);
        tileRange = createOrUpdate(x, x, y, y, tempTileRange);
      } else {
        tileRange = this.getTileRangeForExtentAndZ(
          tileCoordExtent,
          z,
          tempTileRange
        );
      }
      if (callback(z, tileRange)) {
        return true;
      }
      --z;
    }
    return false;
  }
  getExtent() {
    return this.extent_;
  }
  getMaxZoom() {
    return this.maxZoom;
  }
  getMinZoom() {
    return this.minZoom;
  }
  getOrigin(z) {
    if (this.origin_) {
      return this.origin_;
    } else {
      return this.origins_[z];
    }
  }
  getResolution(z) {
    return this.resolutions_[z];
  }
  getResolutions() {
    return this.resolutions_;
  }
  getTileCoordChildTileRange(tileCoord, tempTileRange, tempExtent2) {
    if (tileCoord[0] < this.maxZoom) {
      if (this.zoomFactor_ === 2) {
        const minX = tileCoord[1] * 2;
        const minY = tileCoord[2] * 2;
        return createOrUpdate(
          minX,
          minX + 1,
          minY,
          minY + 1,
          tempTileRange
        );
      }
      const tileCoordExtent = this.getTileCoordExtent(
        tileCoord,
        tempExtent2 || this.tmpExtent_
      );
      return this.getTileRangeForExtentAndZ(
        tileCoordExtent,
        tileCoord[0] + 1,
        tempTileRange
      );
    }
    return null;
  }
  getTileRangeForTileCoordAndZ(tileCoord, z, tempTileRange) {
    if (z > this.maxZoom || z < this.minZoom) {
      return null;
    }
    const tileCoordZ = tileCoord[0];
    const tileCoordX = tileCoord[1];
    const tileCoordY = tileCoord[2];
    if (z === tileCoordZ) {
      return createOrUpdate(
        tileCoordX,
        tileCoordY,
        tileCoordX,
        tileCoordY,
        tempTileRange
      );
    }
    if (this.zoomFactor_) {
      const factor = Math.pow(this.zoomFactor_, z - tileCoordZ);
      const minX = Math.floor(tileCoordX * factor);
      const minY = Math.floor(tileCoordY * factor);
      if (z < tileCoordZ) {
        return createOrUpdate(minX, minX, minY, minY, tempTileRange);
      }
      const maxX = Math.floor(factor * (tileCoordX + 1)) - 1;
      const maxY = Math.floor(factor * (tileCoordY + 1)) - 1;
      return createOrUpdate(minX, maxX, minY, maxY, tempTileRange);
    }
    const tileCoordExtent = this.getTileCoordExtent(tileCoord, this.tmpExtent_);
    return this.getTileRangeForExtentAndZ(tileCoordExtent, z, tempTileRange);
  }
  getTileRangeExtent(z, tileRange, tempExtent2) {
    const origin = this.getOrigin(z);
    const resolution = this.getResolution(z);
    const tileSize = toSize(this.getTileSize(z), this.tmpSize_);
    const minX = origin[0] + tileRange.minX * tileSize[0] * resolution;
    const maxX = origin[0] + (tileRange.maxX + 1) * tileSize[0] * resolution;
    const minY = origin[1] + tileRange.minY * tileSize[1] * resolution;
    const maxY = origin[1] + (tileRange.maxY + 1) * tileSize[1] * resolution;
    return createOrUpdate$2(minX, minY, maxX, maxY, tempExtent2);
  }
  getTileRangeForExtentAndZ(extent, z, tempTileRange) {
    const tileCoord = tmpTileCoord;
    this.getTileCoordForXYAndZ_(extent[0], extent[3], z, false, tileCoord);
    const minX = tileCoord[1];
    const minY = tileCoord[2];
    this.getTileCoordForXYAndZ_(extent[2], extent[1], z, true, tileCoord);
    return createOrUpdate(
      minX,
      tileCoord[1],
      minY,
      tileCoord[2],
      tempTileRange
    );
  }
  getTileCoordCenter(tileCoord) {
    const origin = this.getOrigin(tileCoord[0]);
    const resolution = this.getResolution(tileCoord[0]);
    const tileSize = toSize(this.getTileSize(tileCoord[0]), this.tmpSize_);
    return [
      origin[0] + (tileCoord[1] + 0.5) * tileSize[0] * resolution,
      origin[1] - (tileCoord[2] + 0.5) * tileSize[1] * resolution
    ];
  }
  getTileCoordExtent(tileCoord, tempExtent2) {
    const origin = this.getOrigin(tileCoord[0]);
    const resolution = this.getResolution(tileCoord[0]);
    const tileSize = toSize(this.getTileSize(tileCoord[0]), this.tmpSize_);
    const minX = origin[0] + tileCoord[1] * tileSize[0] * resolution;
    const minY = origin[1] - (tileCoord[2] + 1) * tileSize[1] * resolution;
    const maxX = minX + tileSize[0] * resolution;
    const maxY = minY + tileSize[1] * resolution;
    return createOrUpdate$2(minX, minY, maxX, maxY, tempExtent2);
  }
  getTileCoordForCoordAndResolution(coordinate, resolution, opt_tileCoord) {
    return this.getTileCoordForXYAndResolution_(
      coordinate[0],
      coordinate[1],
      resolution,
      false,
      opt_tileCoord
    );
  }
  getTileCoordForXYAndResolution_(x, y, resolution, reverseIntersectionPolicy, opt_tileCoord) {
    const z = this.getZForResolution(resolution);
    const scale2 = resolution / this.getResolution(z);
    const origin = this.getOrigin(z);
    const tileSize = toSize(this.getTileSize(z), this.tmpSize_);
    let tileCoordX = scale2 * (x - origin[0]) / resolution / tileSize[0];
    let tileCoordY = scale2 * (origin[1] - y) / resolution / tileSize[1];
    if (reverseIntersectionPolicy) {
      tileCoordX = ceil(tileCoordX, DECIMALS) - 1;
      tileCoordY = ceil(tileCoordY, DECIMALS) - 1;
    } else {
      tileCoordX = floor(tileCoordX, DECIMALS);
      tileCoordY = floor(tileCoordY, DECIMALS);
    }
    return createOrUpdate$1(z, tileCoordX, tileCoordY, opt_tileCoord);
  }
  getTileCoordForXYAndZ_(x, y, z, reverseIntersectionPolicy, opt_tileCoord) {
    const origin = this.getOrigin(z);
    const resolution = this.getResolution(z);
    const tileSize = toSize(this.getTileSize(z), this.tmpSize_);
    let tileCoordX = (x - origin[0]) / resolution / tileSize[0];
    let tileCoordY = (origin[1] - y) / resolution / tileSize[1];
    if (reverseIntersectionPolicy) {
      tileCoordX = ceil(tileCoordX, DECIMALS) - 1;
      tileCoordY = ceil(tileCoordY, DECIMALS) - 1;
    } else {
      tileCoordX = floor(tileCoordX, DECIMALS);
      tileCoordY = floor(tileCoordY, DECIMALS);
    }
    return createOrUpdate$1(z, tileCoordX, tileCoordY, opt_tileCoord);
  }
  getTileCoordForCoordAndZ(coordinate, z, opt_tileCoord) {
    return this.getTileCoordForXYAndZ_(
      coordinate[0],
      coordinate[1],
      z,
      false,
      opt_tileCoord
    );
  }
  getTileCoordResolution(tileCoord) {
    return this.resolutions_[tileCoord[0]];
  }
  getTileSize(z) {
    if (this.tileSize_) {
      return this.tileSize_;
    } else {
      return this.tileSizes_[z];
    }
  }
  getFullTileRange(z) {
    if (!this.fullTileRanges_) {
      return this.extent_ ? this.getTileRangeForExtentAndZ(this.extent_, z) : null;
    } else {
      return this.fullTileRanges_[z];
    }
  }
  getZForResolution(resolution, opt_direction) {
    const z = linearFindNearest(
      this.resolutions_,
      resolution,
      opt_direction || 0
    );
    return clamp(z, this.minZoom, this.maxZoom);
  }
  tileCoordIntersectsViewport(tileCoord, viewport) {
    return intersectsLinearRing(
      viewport,
      0,
      viewport.length,
      2,
      this.getTileCoordExtent(tileCoord)
    );
  }
  calculateTileRanges_(extent) {
    const length = this.resolutions_.length;
    const fullTileRanges = new Array(length);
    for (let z = this.minZoom; z < length; ++z) {
      fullTileRanges[z] = this.getTileRangeForExtentAndZ(extent, z);
    }
    this.fullTileRanges_ = fullTileRanges;
  }
}
const TileGrid$1 = TileGrid;
function getForProjection(projection) {
  let tileGrid = projection.getDefaultTileGrid();
  if (!tileGrid) {
    tileGrid = createForProjection(projection);
    projection.setDefaultTileGrid(tileGrid);
  }
  return tileGrid;
}
function wrapX(tileGrid, tileCoord, projection) {
  const z = tileCoord[0];
  const center = tileGrid.getTileCoordCenter(tileCoord);
  const projectionExtent = extentFromProjection(projection);
  if (!containsCoordinate(projectionExtent, center)) {
    const worldWidth = getWidth(projectionExtent);
    const worldsAway = Math.ceil(
      (projectionExtent[0] - center[0]) / worldWidth
    );
    center[0] += worldWidth * worldsAway;
    return tileGrid.getTileCoordForCoordAndZ(center, z);
  } else {
    return tileCoord;
  }
}
function createForExtent(extent, maxZoom, tileSize, corner) {
  corner = corner !== void 0 ? corner : "top-left";
  const resolutions = resolutionsFromExtent(extent, maxZoom, tileSize);
  return new TileGrid$1({
    extent,
    origin: getCorner(extent, corner),
    resolutions,
    tileSize
  });
}
function createXYZ(options) {
  const xyzOptions = options || {};
  const extent = xyzOptions.extent || get$1("EPSG:3857").getExtent();
  const gridOptions = {
    extent,
    minZoom: xyzOptions.minZoom,
    tileSize: xyzOptions.tileSize,
    resolutions: resolutionsFromExtent(
      extent,
      xyzOptions.maxZoom,
      xyzOptions.tileSize,
      xyzOptions.maxResolution
    )
  };
  return new TileGrid$1(gridOptions);
}
function resolutionsFromExtent(extent, maxZoom, tileSize, maxResolution) {
  maxZoom = maxZoom !== void 0 ? maxZoom : DEFAULT_MAX_ZOOM;
  tileSize = toSize(tileSize !== void 0 ? tileSize : DEFAULT_TILE_SIZE);
  const height = getHeight(extent);
  const width = getWidth(extent);
  maxResolution = maxResolution > 0 ? maxResolution : Math.max(width / tileSize[0], height / tileSize[1]);
  const length = maxZoom + 1;
  const resolutions = new Array(length);
  for (let z = 0; z < length; ++z) {
    resolutions[z] = maxResolution / Math.pow(2, z);
  }
  return resolutions;
}
function createForProjection(projection, maxZoom, tileSize, corner) {
  const extent = extentFromProjection(projection);
  return createForExtent(extent, maxZoom, tileSize, corner);
}
function extentFromProjection(projection) {
  projection = get$1(projection);
  let extent = projection.getExtent();
  if (!extent) {
    const half = 180 * METERS_PER_UNIT$1.degrees / projection.getMetersPerUnit();
    extent = createOrUpdate$2(-half, -half, half, half);
  }
  return extent;
}
class TileSource extends Source$1 {
  constructor(options) {
    super({
      attributions: options.attributions,
      attributionsCollapsible: options.attributionsCollapsible,
      projection: options.projection,
      state: options.state,
      wrapX: options.wrapX,
      interpolate: options.interpolate
    });
    this.on;
    this.once;
    this.un;
    this.opaque_ = options.opaque !== void 0 ? options.opaque : false;
    this.tilePixelRatio_ = options.tilePixelRatio !== void 0 ? options.tilePixelRatio : 1;
    this.tileGrid = options.tileGrid !== void 0 ? options.tileGrid : null;
    const tileSize = [256, 256];
    if (this.tileGrid) {
      toSize(this.tileGrid.getTileSize(this.tileGrid.getMinZoom()), tileSize);
    }
    this.tileCache = new TileCache$1(options.cacheSize || 0);
    this.tmpSize = [0, 0];
    this.key_ = options.key || "";
    this.tileOptions = {
      transition: options.transition,
      interpolate: options.interpolate
    };
    this.zDirection = options.zDirection ? options.zDirection : 0;
  }
  canExpireCache() {
    return this.tileCache.canExpireCache();
  }
  expireCache(projection, usedTiles) {
    const tileCache = this.getTileCacheForProjection(projection);
    if (tileCache) {
      tileCache.expireCache(usedTiles);
    }
  }
  forEachLoadedTile(projection, z, tileRange, callback) {
    const tileCache = this.getTileCacheForProjection(projection);
    if (!tileCache) {
      return false;
    }
    let covered = true;
    let tile, tileCoordKey, loaded;
    for (let x = tileRange.minX; x <= tileRange.maxX; ++x) {
      for (let y = tileRange.minY; y <= tileRange.maxY; ++y) {
        tileCoordKey = getKeyZXY(z, x, y);
        loaded = false;
        if (tileCache.containsKey(tileCoordKey)) {
          tile = tileCache.get(tileCoordKey);
          loaded = tile.getState() === TileState.LOADED;
          if (loaded) {
            loaded = callback(tile) !== false;
          }
        }
        if (!loaded) {
          covered = false;
        }
      }
    }
    return covered;
  }
  getGutterForProjection(projection) {
    return 0;
  }
  getKey() {
    return this.key_;
  }
  setKey(key) {
    if (this.key_ !== key) {
      this.key_ = key;
      this.changed();
    }
  }
  getOpaque(projection) {
    return this.opaque_;
  }
  getResolutions() {
    if (!this.tileGrid) {
      return null;
    }
    return this.tileGrid.getResolutions();
  }
  getTile(z, x, y, pixelRatio, projection) {
    return abstract();
  }
  getTileGrid() {
    return this.tileGrid;
  }
  getTileGridForProjection(projection) {
    if (!this.tileGrid) {
      return getForProjection(projection);
    } else {
      return this.tileGrid;
    }
  }
  getTileCacheForProjection(projection) {
    const sourceProjection = this.getProjection();
    assert(
      sourceProjection === null || equivalent(sourceProjection, projection),
      68
    );
    return this.tileCache;
  }
  getTilePixelRatio(pixelRatio) {
    return this.tilePixelRatio_;
  }
  getTilePixelSize(z, pixelRatio, projection) {
    const tileGrid = this.getTileGridForProjection(projection);
    const tilePixelRatio = this.getTilePixelRatio(pixelRatio);
    const tileSize = toSize(tileGrid.getTileSize(z), this.tmpSize);
    if (tilePixelRatio == 1) {
      return tileSize;
    } else {
      return scale$2(tileSize, tilePixelRatio, this.tmpSize);
    }
  }
  getTileCoordForTileUrlFunction(tileCoord, projection) {
    projection = projection !== void 0 ? projection : this.getProjection();
    const tileGrid = this.getTileGridForProjection(projection);
    if (this.getWrapX() && projection.isGlobal()) {
      tileCoord = wrapX(tileGrid, tileCoord, projection);
    }
    return withinExtentAndZ(tileCoord, tileGrid) ? tileCoord : null;
  }
  clear() {
    this.tileCache.clear();
  }
  refresh() {
    this.clear();
    super.refresh();
  }
  updateCacheSize(tileCount, projection) {
    const tileCache = this.getTileCacheForProjection(projection);
    if (tileCount > tileCache.highWaterMark) {
      tileCache.highWaterMark = tileCount;
    }
  }
  useTile(z, x, y, projection) {
  }
}
class TileSourceEvent extends BaseEvent$1 {
  constructor(type, tile) {
    super(type);
    this.tile = tile;
  }
}
const TileSource$1 = TileSource;
function createFromTemplate(template, tileGrid) {
  const zRegEx = /\{z\}/g;
  const xRegEx = /\{x\}/g;
  const yRegEx = /\{y\}/g;
  const dashYRegEx = /\{-y\}/g;
  return function(tileCoord, pixelRatio, projection) {
    if (!tileCoord) {
      return void 0;
    } else {
      return template.replace(zRegEx, tileCoord[0].toString()).replace(xRegEx, tileCoord[1].toString()).replace(yRegEx, tileCoord[2].toString()).replace(dashYRegEx, function() {
        const z = tileCoord[0];
        const range = tileGrid.getFullTileRange(z);
        assert(range, 55);
        const y = range.getHeight() - tileCoord[2] - 1;
        return y.toString();
      });
    }
  };
}
function createFromTemplates(templates, tileGrid) {
  const len = templates.length;
  const tileUrlFunctions = new Array(len);
  for (let i = 0; i < len; ++i) {
    tileUrlFunctions[i] = createFromTemplate(templates[i], tileGrid);
  }
  return createFromTileUrlFunctions(tileUrlFunctions);
}
function createFromTileUrlFunctions(tileUrlFunctions) {
  if (tileUrlFunctions.length === 1) {
    return tileUrlFunctions[0];
  }
  return function(tileCoord, pixelRatio, projection) {
    if (!tileCoord) {
      return void 0;
    } else {
      const h = hash(tileCoord);
      const index2 = modulo(h, tileUrlFunctions.length);
      return tileUrlFunctions[index2](tileCoord, pixelRatio, projection);
    }
  };
}
function expandUrl(url) {
  const urls = [];
  let match = /\{([a-z])-([a-z])\}/.exec(url);
  if (match) {
    const startCharCode = match[1].charCodeAt(0);
    const stopCharCode = match[2].charCodeAt(0);
    let charCode;
    for (charCode = startCharCode; charCode <= stopCharCode; ++charCode) {
      urls.push(url.replace(match[0], String.fromCharCode(charCode)));
    }
    return urls;
  }
  match = /\{(\d+)-(\d+)\}/.exec(url);
  if (match) {
    const stop = parseInt(match[2], 10);
    for (let i = parseInt(match[1], 10); i <= stop; i++) {
      urls.push(url.replace(match[0], i.toString()));
    }
    return urls;
  }
  urls.push(url);
  return urls;
}
class UrlTile extends TileSource$1 {
  constructor(options) {
    super({
      attributions: options.attributions,
      cacheSize: options.cacheSize,
      opaque: options.opaque,
      projection: options.projection,
      state: options.state,
      tileGrid: options.tileGrid,
      tilePixelRatio: options.tilePixelRatio,
      wrapX: options.wrapX,
      transition: options.transition,
      interpolate: options.interpolate,
      key: options.key,
      attributionsCollapsible: options.attributionsCollapsible,
      zDirection: options.zDirection
    });
    this.generateTileUrlFunction_ = this.tileUrlFunction === UrlTile.prototype.tileUrlFunction;
    this.tileLoadFunction = options.tileLoadFunction;
    if (options.tileUrlFunction) {
      this.tileUrlFunction = options.tileUrlFunction;
    }
    this.urls = null;
    if (options.urls) {
      this.setUrls(options.urls);
    } else if (options.url) {
      this.setUrl(options.url);
    }
    this.tileLoadingKeys_ = {};
  }
  getTileLoadFunction() {
    return this.tileLoadFunction;
  }
  getTileUrlFunction() {
    return Object.getPrototypeOf(this).tileUrlFunction === this.tileUrlFunction ? this.tileUrlFunction.bind(this) : this.tileUrlFunction;
  }
  getUrls() {
    return this.urls;
  }
  handleTileChange(event) {
    const tile = event.target;
    const uid = getUid(tile);
    const tileState = tile.getState();
    let type;
    if (tileState == TileState.LOADING) {
      this.tileLoadingKeys_[uid] = true;
      type = TileEventType.TILELOADSTART;
    } else if (uid in this.tileLoadingKeys_) {
      delete this.tileLoadingKeys_[uid];
      type = tileState == TileState.ERROR ? TileEventType.TILELOADERROR : tileState == TileState.LOADED ? TileEventType.TILELOADEND : void 0;
    }
    if (type != void 0) {
      this.dispatchEvent(new TileSourceEvent(type, tile));
    }
  }
  setTileLoadFunction(tileLoadFunction) {
    this.tileCache.clear();
    this.tileLoadFunction = tileLoadFunction;
    this.changed();
  }
  setTileUrlFunction(tileUrlFunction, key) {
    this.tileUrlFunction = tileUrlFunction;
    this.tileCache.pruneExceptNewestZ();
    if (typeof key !== "undefined") {
      this.setKey(key);
    } else {
      this.changed();
    }
  }
  setUrl(url) {
    const urls = expandUrl(url);
    this.urls = urls;
    this.setUrls(urls);
  }
  setUrls(urls) {
    this.urls = urls;
    const key = urls.join("\n");
    if (this.generateTileUrlFunction_) {
      this.setTileUrlFunction(createFromTemplates(urls, this.tileGrid), key);
    } else {
      this.setKey(key);
    }
  }
  tileUrlFunction(tileCoord, pixelRatio, projection) {
    return void 0;
  }
  useTile(z, x, y) {
    const tileCoordKey = getKeyZXY(z, x, y);
    if (this.tileCache.containsKey(tileCoordKey)) {
      this.tileCache.get(tileCoordKey);
    }
  }
}
const UrlTile$1 = UrlTile;
class TileImage extends UrlTile$1 {
  constructor(options) {
    super({
      attributions: options.attributions,
      cacheSize: options.cacheSize,
      opaque: options.opaque,
      projection: options.projection,
      state: options.state,
      tileGrid: options.tileGrid,
      tileLoadFunction: options.tileLoadFunction ? options.tileLoadFunction : defaultTileLoadFunction,
      tilePixelRatio: options.tilePixelRatio,
      tileUrlFunction: options.tileUrlFunction,
      url: options.url,
      urls: options.urls,
      wrapX: options.wrapX,
      transition: options.transition,
      interpolate: options.interpolate !== void 0 ? options.interpolate : true,
      key: options.key,
      attributionsCollapsible: options.attributionsCollapsible,
      zDirection: options.zDirection
    });
    this.crossOrigin = options.crossOrigin !== void 0 ? options.crossOrigin : null;
    this.tileClass = options.tileClass !== void 0 ? options.tileClass : ImageTile$1;
    this.tileCacheForProjection = {};
    this.tileGridForProjection = {};
    this.reprojectionErrorThreshold_ = options.reprojectionErrorThreshold;
    this.renderReprojectionEdges_ = false;
  }
  canExpireCache() {
    if (this.tileCache.canExpireCache()) {
      return true;
    } else {
      for (const key in this.tileCacheForProjection) {
        if (this.tileCacheForProjection[key].canExpireCache()) {
          return true;
        }
      }
    }
    return false;
  }
  expireCache(projection, usedTiles) {
    const usedTileCache = this.getTileCacheForProjection(projection);
    this.tileCache.expireCache(
      this.tileCache == usedTileCache ? usedTiles : {}
    );
    for (const id in this.tileCacheForProjection) {
      const tileCache = this.tileCacheForProjection[id];
      tileCache.expireCache(tileCache == usedTileCache ? usedTiles : {});
    }
  }
  getGutterForProjection(projection) {
    if (this.getProjection() && projection && !equivalent(this.getProjection(), projection)) {
      return 0;
    } else {
      return this.getGutter();
    }
  }
  getGutter() {
    return 0;
  }
  getKey() {
    let key = super.getKey();
    if (!this.getInterpolate()) {
      key += ":disable-interpolation";
    }
    return key;
  }
  getOpaque(projection) {
    if (this.getProjection() && projection && !equivalent(this.getProjection(), projection)) {
      return false;
    } else {
      return super.getOpaque(projection);
    }
  }
  getTileGridForProjection(projection) {
    const thisProj = this.getProjection();
    if (this.tileGrid && (!thisProj || equivalent(thisProj, projection))) {
      return this.tileGrid;
    } else {
      const projKey = getUid(projection);
      if (!(projKey in this.tileGridForProjection)) {
        this.tileGridForProjection[projKey] = getForProjection(projection);
      }
      return this.tileGridForProjection[projKey];
    }
  }
  getTileCacheForProjection(projection) {
    const thisProj = this.getProjection();
    if (!thisProj || equivalent(thisProj, projection)) {
      return this.tileCache;
    } else {
      const projKey = getUid(projection);
      if (!(projKey in this.tileCacheForProjection)) {
        this.tileCacheForProjection[projKey] = new TileCache$1(
          this.tileCache.highWaterMark
        );
      }
      return this.tileCacheForProjection[projKey];
    }
  }
  createTile_(z, x, y, pixelRatio, projection, key) {
    const tileCoord = [z, x, y];
    const urlTileCoord = this.getTileCoordForTileUrlFunction(
      tileCoord,
      projection
    );
    const tileUrl = urlTileCoord ? this.tileUrlFunction(urlTileCoord, pixelRatio, projection) : void 0;
    const tile = new this.tileClass(
      tileCoord,
      tileUrl !== void 0 ? TileState.IDLE : TileState.EMPTY,
      tileUrl !== void 0 ? tileUrl : "",
      this.crossOrigin,
      this.tileLoadFunction,
      this.tileOptions
    );
    tile.key = key;
    tile.addEventListener(EventType.CHANGE, this.handleTileChange.bind(this));
    return tile;
  }
  getTile(z, x, y, pixelRatio, projection) {
    const sourceProjection = this.getProjection();
    if (!sourceProjection || !projection || equivalent(sourceProjection, projection)) {
      return this.getTileInternal(
        z,
        x,
        y,
        pixelRatio,
        sourceProjection || projection
      );
    } else {
      const cache2 = this.getTileCacheForProjection(projection);
      const tileCoord = [z, x, y];
      let tile;
      const tileCoordKey = getKey(tileCoord);
      if (cache2.containsKey(tileCoordKey)) {
        tile = cache2.get(tileCoordKey);
      }
      const key = this.getKey();
      if (tile && tile.key == key) {
        return tile;
      } else {
        const sourceTileGrid = this.getTileGridForProjection(sourceProjection);
        const targetTileGrid = this.getTileGridForProjection(projection);
        const wrappedTileCoord = this.getTileCoordForTileUrlFunction(
          tileCoord,
          projection
        );
        const newTile = new ReprojTile$1(
          sourceProjection,
          sourceTileGrid,
          projection,
          targetTileGrid,
          tileCoord,
          wrappedTileCoord,
          this.getTilePixelRatio(pixelRatio),
          this.getGutter(),
          function(z2, x2, y2, pixelRatio2) {
            return this.getTileInternal(z2, x2, y2, pixelRatio2, sourceProjection);
          }.bind(this),
          this.reprojectionErrorThreshold_,
          this.renderReprojectionEdges_,
          this.getInterpolate()
        );
        newTile.key = key;
        if (tile) {
          newTile.interimTile = tile;
          newTile.refreshInterimChain();
          cache2.replace(tileCoordKey, newTile);
        } else {
          cache2.set(tileCoordKey, newTile);
        }
        return newTile;
      }
    }
  }
  getTileInternal(z, x, y, pixelRatio, projection) {
    let tile = null;
    const tileCoordKey = getKeyZXY(z, x, y);
    const key = this.getKey();
    if (!this.tileCache.containsKey(tileCoordKey)) {
      tile = this.createTile_(z, x, y, pixelRatio, projection, key);
      this.tileCache.set(tileCoordKey, tile);
    } else {
      tile = this.tileCache.get(tileCoordKey);
      if (tile.key != key) {
        const interimTile = tile;
        tile = this.createTile_(z, x, y, pixelRatio, projection, key);
        if (interimTile.getState() == TileState.IDLE) {
          tile.interimTile = interimTile.interimTile;
        } else {
          tile.interimTile = interimTile;
        }
        tile.refreshInterimChain();
        this.tileCache.replace(tileCoordKey, tile);
      }
    }
    return tile;
  }
  setRenderReprojectionEdges(render2) {
    if (this.renderReprojectionEdges_ == render2) {
      return;
    }
    this.renderReprojectionEdges_ = render2;
    for (const id in this.tileCacheForProjection) {
      this.tileCacheForProjection[id].clear();
    }
    this.changed();
  }
  setTileGridForProjection(projection, tilegrid) {
    const proj = get$1(projection);
    if (proj) {
      const projKey = getUid(proj);
      if (!(projKey in this.tileGridForProjection)) {
        this.tileGridForProjection[projKey] = tilegrid;
      }
    }
  }
  clear() {
    super.clear();
    for (const id in this.tileCacheForProjection) {
      this.tileCacheForProjection[id].clear();
    }
  }
}
function defaultTileLoadFunction(imageTile, src) {
  imageTile.getImage().src = src;
}
const TileImage$1 = TileImage;
class XYZ extends TileImage$1 {
  constructor(options) {
    options = options || {};
    const projection = options.projection !== void 0 ? options.projection : "EPSG:3857";
    const tileGrid = options.tileGrid !== void 0 ? options.tileGrid : createXYZ({
      extent: extentFromProjection(projection),
      maxResolution: options.maxResolution,
      maxZoom: options.maxZoom,
      minZoom: options.minZoom,
      tileSize: options.tileSize
    });
    super({
      attributions: options.attributions,
      cacheSize: options.cacheSize,
      crossOrigin: options.crossOrigin,
      interpolate: options.interpolate,
      opaque: options.opaque,
      projection,
      reprojectionErrorThreshold: options.reprojectionErrorThreshold,
      tileGrid,
      tileLoadFunction: options.tileLoadFunction,
      tilePixelRatio: options.tilePixelRatio,
      tileUrlFunction: options.tileUrlFunction,
      url: options.url,
      urls: options.urls,
      wrapX: options.wrapX !== void 0 ? options.wrapX : true,
      transition: options.transition,
      attributionsCollapsible: options.attributionsCollapsible,
      zDirection: options.zDirection
    });
    this.gutter_ = options.gutter !== void 0 ? options.gutter : 0;
  }
  getGutter() {
    return this.gutter_;
  }
}
const XYZ$1 = XYZ;
const TileProperty = {
  PRELOAD: "preload",
  USE_INTERIM_TILES_ON_ERROR: "useInterimTilesOnError"
};
class BaseTileLayer extends Layer$1 {
  constructor(options) {
    options = options ? options : {};
    const baseOptions = Object.assign({}, options);
    delete baseOptions.preload;
    delete baseOptions.useInterimTilesOnError;
    super(baseOptions);
    this.on;
    this.once;
    this.un;
    this.setPreload(options.preload !== void 0 ? options.preload : 0);
    this.setUseInterimTilesOnError(
      options.useInterimTilesOnError !== void 0 ? options.useInterimTilesOnError : true
    );
  }
  getPreload() {
    return this.get(TileProperty.PRELOAD);
  }
  setPreload(preload) {
    this.set(TileProperty.PRELOAD, preload);
  }
  getUseInterimTilesOnError() {
    return this.get(TileProperty.USE_INTERIM_TILES_ON_ERROR);
  }
  setUseInterimTilesOnError(useInterimTilesOnError) {
    this.set(TileProperty.USE_INTERIM_TILES_ON_ERROR, useInterimTilesOnError);
  }
  getData(pixel) {
    return super.getData(pixel);
  }
}
const BaseTileLayer$1 = BaseTileLayer;
class CanvasTileLayerRenderer extends CanvasLayerRenderer$1 {
  constructor(tileLayer) {
    super(tileLayer);
    this.extentChanged = true;
    this.renderedExtent_ = null;
    this.renderedPixelRatio;
    this.renderedProjection = null;
    this.renderedRevision;
    this.renderedTiles = [];
    this.newTiles_ = false;
    this.tmpExtent = createEmpty();
    this.tmpTileRange_ = new TileRange$1(0, 0, 0, 0);
  }
  isDrawableTile(tile) {
    const tileLayer = this.getLayer();
    const tileState = tile.getState();
    const useInterimTilesOnError = tileLayer.getUseInterimTilesOnError();
    return tileState == TileState.LOADED || tileState == TileState.EMPTY || tileState == TileState.ERROR && !useInterimTilesOnError;
  }
  getTile(z, x, y, frameState) {
    const pixelRatio = frameState.pixelRatio;
    const projection = frameState.viewState.projection;
    const tileLayer = this.getLayer();
    const tileSource = tileLayer.getSource();
    let tile = tileSource.getTile(z, x, y, pixelRatio, projection);
    if (tile.getState() == TileState.ERROR) {
      if (tileLayer.getUseInterimTilesOnError() && tileLayer.getPreload() > 0) {
        this.newTiles_ = true;
      }
    }
    if (!this.isDrawableTile(tile)) {
      tile = tile.getInterimTile();
    }
    return tile;
  }
  getData(pixel) {
    const frameState = this.frameState;
    if (!frameState) {
      return null;
    }
    const layer = this.getLayer();
    const coordinate = apply(
      frameState.pixelToCoordinateTransform,
      pixel.slice()
    );
    const layerExtent = layer.getExtent();
    if (layerExtent) {
      if (!containsCoordinate(layerExtent, coordinate)) {
        return null;
      }
    }
    const pixelRatio = frameState.pixelRatio;
    const projection = frameState.viewState.projection;
    const viewState = frameState.viewState;
    const source = layer.getRenderSource();
    const tileGrid = source.getTileGridForProjection(viewState.projection);
    const tilePixelRatio = source.getTilePixelRatio(frameState.pixelRatio);
    for (let z = tileGrid.getZForResolution(viewState.resolution); z >= tileGrid.getMinZoom(); --z) {
      const tileCoord = tileGrid.getTileCoordForCoordAndZ(coordinate, z);
      const tile = source.getTile(
        z,
        tileCoord[1],
        tileCoord[2],
        pixelRatio,
        projection
      );
      if (!(tile instanceof ImageTile$1 || tile instanceof ReprojTile$1) || tile instanceof ReprojTile$1 && tile.getState() === TileState.EMPTY) {
        return null;
      }
      if (tile.getState() !== TileState.LOADED) {
        continue;
      }
      const tileOrigin = tileGrid.getOrigin(z);
      const tileSize = toSize(tileGrid.getTileSize(z));
      const tileResolution = tileGrid.getResolution(z);
      const col = Math.floor(
        tilePixelRatio * ((coordinate[0] - tileOrigin[0]) / tileResolution - tileCoord[1] * tileSize[0])
      );
      const row = Math.floor(
        tilePixelRatio * ((tileOrigin[1] - coordinate[1]) / tileResolution - tileCoord[2] * tileSize[1])
      );
      const gutter = Math.round(
        tilePixelRatio * source.getGutterForProjection(viewState.projection)
      );
      return this.getImageData(tile.getImage(), col + gutter, row + gutter);
    }
    return null;
  }
  loadedTileCallback(tiles, zoom, tile) {
    if (this.isDrawableTile(tile)) {
      return super.loadedTileCallback(tiles, zoom, tile);
    }
    return false;
  }
  prepareFrame(frameState) {
    return !!this.getLayer().getSource();
  }
  renderFrame(frameState, target) {
    const layerState = frameState.layerStatesArray[frameState.layerIndex];
    const viewState = frameState.viewState;
    const projection = viewState.projection;
    const viewResolution = viewState.resolution;
    const viewCenter = viewState.center;
    const rotation = viewState.rotation;
    const pixelRatio = frameState.pixelRatio;
    const tileLayer = this.getLayer();
    const tileSource = tileLayer.getSource();
    const sourceRevision = tileSource.getRevision();
    const tileGrid = tileSource.getTileGridForProjection(projection);
    const z = tileGrid.getZForResolution(viewResolution, tileSource.zDirection);
    const tileResolution = tileGrid.getResolution(z);
    let extent = frameState.extent;
    const resolution = frameState.viewState.resolution;
    const tilePixelRatio = tileSource.getTilePixelRatio(pixelRatio);
    const width = Math.round(getWidth(extent) / resolution * pixelRatio);
    const height = Math.round(getHeight(extent) / resolution * pixelRatio);
    const layerExtent = layerState.extent && fromUserExtent(layerState.extent);
    if (layerExtent) {
      extent = getIntersection(
        extent,
        fromUserExtent(layerState.extent)
      );
    }
    const dx = tileResolution * width / 2 / tilePixelRatio;
    const dy = tileResolution * height / 2 / tilePixelRatio;
    const canvasExtent = [
      viewCenter[0] - dx,
      viewCenter[1] - dy,
      viewCenter[0] + dx,
      viewCenter[1] + dy
    ];
    const tileRange = tileGrid.getTileRangeForExtentAndZ(extent, z);
    const tilesToDrawByZ = {};
    tilesToDrawByZ[z] = {};
    const findLoadedTiles = this.createLoadedTileFinder(
      tileSource,
      projection,
      tilesToDrawByZ
    );
    const tmpExtent2 = this.tmpExtent;
    const tmpTileRange = this.tmpTileRange_;
    this.newTiles_ = false;
    const viewport = rotation ? getRotatedViewport(
      viewState.center,
      resolution,
      rotation,
      frameState.size
    ) : void 0;
    for (let x = tileRange.minX; x <= tileRange.maxX; ++x) {
      for (let y = tileRange.minY; y <= tileRange.maxY; ++y) {
        if (rotation && !tileGrid.tileCoordIntersectsViewport([z, x, y], viewport)) {
          continue;
        }
        const tile = this.getTile(z, x, y, frameState);
        if (this.isDrawableTile(tile)) {
          const uid = getUid(this);
          if (tile.getState() == TileState.LOADED) {
            tilesToDrawByZ[z][tile.tileCoord.toString()] = tile;
            let inTransition = tile.inTransition(uid);
            if (inTransition && layerState.opacity !== 1) {
              tile.endTransition(uid);
              inTransition = false;
            }
            if (!this.newTiles_ && (inTransition || !this.renderedTiles.includes(tile))) {
              this.newTiles_ = true;
            }
          }
          if (tile.getAlpha(uid, frameState.time) === 1) {
            continue;
          }
        }
        const childTileRange = tileGrid.getTileCoordChildTileRange(
          tile.tileCoord,
          tmpTileRange,
          tmpExtent2
        );
        let covered = false;
        if (childTileRange) {
          covered = findLoadedTiles(z + 1, childTileRange);
        }
        if (!covered) {
          tileGrid.forEachTileCoordParentTileRange(
            tile.tileCoord,
            findLoadedTiles,
            tmpTileRange,
            tmpExtent2
          );
        }
      }
    }
    const canvasScale = tileResolution / viewResolution * pixelRatio / tilePixelRatio;
    compose(
      this.pixelTransform,
      frameState.size[0] / 2,
      frameState.size[1] / 2,
      1 / pixelRatio,
      1 / pixelRatio,
      rotation,
      -width / 2,
      -height / 2
    );
    const canvasTransform = toString(this.pixelTransform);
    this.useContainer(target, canvasTransform, this.getBackground(frameState));
    const context = this.context;
    const canvas = context.canvas;
    makeInverse(this.inversePixelTransform, this.pixelTransform);
    compose(
      this.tempTransform,
      width / 2,
      height / 2,
      canvasScale,
      canvasScale,
      0,
      -width / 2,
      -height / 2
    );
    if (canvas.width != width || canvas.height != height) {
      canvas.width = width;
      canvas.height = height;
    } else if (!this.containerReused) {
      context.clearRect(0, 0, width, height);
    }
    if (layerExtent) {
      this.clipUnrotated(context, frameState, layerExtent);
    }
    if (!tileSource.getInterpolate()) {
      context.imageSmoothingEnabled = false;
    }
    this.preRender(context, frameState);
    this.renderedTiles.length = 0;
    let zs = Object.keys(tilesToDrawByZ).map(Number);
    zs.sort(numberSafeCompareFunction);
    let clips, clipZs, currentClip;
    if (layerState.opacity === 1 && (!this.containerReused || tileSource.getOpaque(frameState.viewState.projection))) {
      zs = zs.reverse();
    } else {
      clips = [];
      clipZs = [];
    }
    for (let i = zs.length - 1; i >= 0; --i) {
      const currentZ = zs[i];
      const currentTilePixelSize = tileSource.getTilePixelSize(
        currentZ,
        pixelRatio,
        projection
      );
      const currentResolution = tileGrid.getResolution(currentZ);
      const currentScale = currentResolution / tileResolution;
      const dx2 = currentTilePixelSize[0] * currentScale * canvasScale;
      const dy2 = currentTilePixelSize[1] * currentScale * canvasScale;
      const originTileCoord = tileGrid.getTileCoordForCoordAndZ(
        getTopLeft(canvasExtent),
        currentZ
      );
      const originTileExtent = tileGrid.getTileCoordExtent(originTileCoord);
      const origin = apply(this.tempTransform, [
        tilePixelRatio * (originTileExtent[0] - canvasExtent[0]) / tileResolution,
        tilePixelRatio * (canvasExtent[3] - originTileExtent[3]) / tileResolution
      ]);
      const tileGutter = tilePixelRatio * tileSource.getGutterForProjection(projection);
      const tilesToDraw = tilesToDrawByZ[currentZ];
      for (const tileCoordKey in tilesToDraw) {
        const tile = tilesToDraw[tileCoordKey];
        const tileCoord = tile.tileCoord;
        const xIndex = originTileCoord[1] - tileCoord[1];
        const nextX = Math.round(origin[0] - (xIndex - 1) * dx2);
        const yIndex = originTileCoord[2] - tileCoord[2];
        const nextY = Math.round(origin[1] - (yIndex - 1) * dy2);
        const x = Math.round(origin[0] - xIndex * dx2);
        const y = Math.round(origin[1] - yIndex * dy2);
        const w = nextX - x;
        const h = nextY - y;
        const transition = z === currentZ;
        const inTransition = transition && tile.getAlpha(getUid(this), frameState.time) !== 1;
        let contextSaved = false;
        if (!inTransition) {
          if (clips) {
            currentClip = [x, y, x + w, y, x + w, y + h, x, y + h];
            for (let i2 = 0, ii = clips.length; i2 < ii; ++i2) {
              if (z !== currentZ && currentZ < clipZs[i2]) {
                const clip = clips[i2];
                if (intersects$2(
                  [x, y, x + w, y + h],
                  [clip[0], clip[3], clip[4], clip[7]]
                )) {
                  if (!contextSaved) {
                    context.save();
                    contextSaved = true;
                  }
                  context.beginPath();
                  context.moveTo(currentClip[0], currentClip[1]);
                  context.lineTo(currentClip[2], currentClip[3]);
                  context.lineTo(currentClip[4], currentClip[5]);
                  context.lineTo(currentClip[6], currentClip[7]);
                  context.moveTo(clip[6], clip[7]);
                  context.lineTo(clip[4], clip[5]);
                  context.lineTo(clip[2], clip[3]);
                  context.lineTo(clip[0], clip[1]);
                  context.clip();
                }
              }
            }
            clips.push(currentClip);
            clipZs.push(currentZ);
          } else {
            context.clearRect(x, y, w, h);
          }
        }
        this.drawTileImage(
          tile,
          frameState,
          x,
          y,
          w,
          h,
          tileGutter,
          transition
        );
        if (clips && !inTransition) {
          if (contextSaved) {
            context.restore();
          }
          this.renderedTiles.unshift(tile);
        } else {
          this.renderedTiles.push(tile);
        }
        this.updateUsedTiles(frameState.usedTiles, tileSource, tile);
      }
    }
    this.renderedRevision = sourceRevision;
    this.renderedResolution = tileResolution;
    this.extentChanged = !this.renderedExtent_ || !equals$3(this.renderedExtent_, canvasExtent);
    this.renderedExtent_ = canvasExtent;
    this.renderedPixelRatio = pixelRatio;
    this.renderedProjection = projection;
    this.manageTilePyramid(
      frameState,
      tileSource,
      tileGrid,
      pixelRatio,
      projection,
      extent,
      z,
      tileLayer.getPreload()
    );
    this.scheduleExpireCache(frameState, tileSource);
    this.postRender(context, frameState);
    if (layerState.extent) {
      context.restore();
    }
    context.imageSmoothingEnabled = true;
    if (canvasTransform !== canvas.style.transform) {
      canvas.style.transform = canvasTransform;
    }
    return this.container;
  }
  drawTileImage(tile, frameState, x, y, w, h, gutter, transition) {
    const image = this.getTileImage(tile);
    if (!image) {
      return;
    }
    const uid = getUid(this);
    const layerState = frameState.layerStatesArray[frameState.layerIndex];
    const alpha = layerState.opacity * (transition ? tile.getAlpha(uid, frameState.time) : 1);
    const alphaChanged = alpha !== this.context.globalAlpha;
    if (alphaChanged) {
      this.context.save();
      this.context.globalAlpha = alpha;
    }
    this.context.drawImage(
      image,
      gutter,
      gutter,
      image.width - 2 * gutter,
      image.height - 2 * gutter,
      x,
      y,
      w,
      h
    );
    if (alphaChanged) {
      this.context.restore();
    }
    if (alpha !== layerState.opacity) {
      frameState.animate = true;
    } else if (transition) {
      tile.endTransition(uid);
    }
  }
  getImage() {
    const context = this.context;
    return context ? context.canvas : null;
  }
  getTileImage(tile) {
    return tile.getImage();
  }
  scheduleExpireCache(frameState, tileSource) {
    if (tileSource.canExpireCache()) {
      const postRenderFunction = function(tileSource2, map, frameState2) {
        const tileSourceKey = getUid(tileSource2);
        if (tileSourceKey in frameState2.usedTiles) {
          tileSource2.expireCache(
            frameState2.viewState.projection,
            frameState2.usedTiles[tileSourceKey]
          );
        }
      }.bind(null, tileSource);
      frameState.postRenderFunctions.push(
        postRenderFunction
      );
    }
  }
  updateUsedTiles(usedTiles, tileSource, tile) {
    const tileSourceKey = getUid(tileSource);
    if (!(tileSourceKey in usedTiles)) {
      usedTiles[tileSourceKey] = {};
    }
    usedTiles[tileSourceKey][tile.getKey()] = true;
  }
  manageTilePyramid(frameState, tileSource, tileGrid, pixelRatio, projection, extent, currentZ, preload, tileCallback) {
    const tileSourceKey = getUid(tileSource);
    if (!(tileSourceKey in frameState.wantedTiles)) {
      frameState.wantedTiles[tileSourceKey] = {};
    }
    const wantedTiles = frameState.wantedTiles[tileSourceKey];
    const tileQueue = frameState.tileQueue;
    const minZoom = tileGrid.getMinZoom();
    const rotation = frameState.viewState.rotation;
    const viewport = rotation ? getRotatedViewport(
      frameState.viewState.center,
      frameState.viewState.resolution,
      rotation,
      frameState.size
    ) : void 0;
    let tileCount = 0;
    let tile, tileRange, tileResolution, x, y, z;
    for (z = minZoom; z <= currentZ; ++z) {
      tileRange = tileGrid.getTileRangeForExtentAndZ(extent, z, tileRange);
      tileResolution = tileGrid.getResolution(z);
      for (x = tileRange.minX; x <= tileRange.maxX; ++x) {
        for (y = tileRange.minY; y <= tileRange.maxY; ++y) {
          if (rotation && !tileGrid.tileCoordIntersectsViewport([z, x, y], viewport)) {
            continue;
          }
          if (currentZ - z <= preload) {
            ++tileCount;
            tile = tileSource.getTile(z, x, y, pixelRatio, projection);
            if (tile.getState() == TileState.IDLE) {
              wantedTiles[tile.getKey()] = true;
              if (!tileQueue.isKeyQueued(tile.getKey())) {
                tileQueue.enqueue([
                  tile,
                  tileSourceKey,
                  tileGrid.getTileCoordCenter(tile.tileCoord),
                  tileResolution
                ]);
              }
            }
            if (tileCallback !== void 0) {
              tileCallback(tile);
            }
          } else {
            tileSource.useTile(z, x, y, projection);
          }
        }
      }
    }
    tileSource.updateCacheSize(tileCount, projection);
  }
}
const CanvasTileLayerRenderer$1 = CanvasTileLayerRenderer;
class TileLayer extends BaseTileLayer$1 {
  constructor(options) {
    super(options);
  }
  createRenderer() {
    return new CanvasTileLayerRenderer$1(this);
  }
}
const TileLayer$1 = TileLayer;
const DROP = Infinity;
class PriorityQueue {
  constructor(priorityFunction, keyFunction) {
    this.priorityFunction_ = priorityFunction;
    this.keyFunction_ = keyFunction;
    this.elements_ = [];
    this.priorities_ = [];
    this.queuedElements_ = {};
  }
  clear() {
    this.elements_.length = 0;
    this.priorities_.length = 0;
    clear(this.queuedElements_);
  }
  dequeue() {
    const elements = this.elements_;
    const priorities = this.priorities_;
    const element = elements[0];
    if (elements.length == 1) {
      elements.length = 0;
      priorities.length = 0;
    } else {
      elements[0] = elements.pop();
      priorities[0] = priorities.pop();
      this.siftUp_(0);
    }
    const elementKey = this.keyFunction_(element);
    delete this.queuedElements_[elementKey];
    return element;
  }
  enqueue(element) {
    assert(!(this.keyFunction_(element) in this.queuedElements_), 31);
    const priority = this.priorityFunction_(element);
    if (priority != DROP) {
      this.elements_.push(element);
      this.priorities_.push(priority);
      this.queuedElements_[this.keyFunction_(element)] = true;
      this.siftDown_(0, this.elements_.length - 1);
      return true;
    }
    return false;
  }
  getCount() {
    return this.elements_.length;
  }
  getLeftChildIndex_(index2) {
    return index2 * 2 + 1;
  }
  getRightChildIndex_(index2) {
    return index2 * 2 + 2;
  }
  getParentIndex_(index2) {
    return index2 - 1 >> 1;
  }
  heapify_() {
    let i;
    for (i = (this.elements_.length >> 1) - 1; i >= 0; i--) {
      this.siftUp_(i);
    }
  }
  isEmpty() {
    return this.elements_.length === 0;
  }
  isKeyQueued(key) {
    return key in this.queuedElements_;
  }
  isQueued(element) {
    return this.isKeyQueued(this.keyFunction_(element));
  }
  siftUp_(index2) {
    const elements = this.elements_;
    const priorities = this.priorities_;
    const count = elements.length;
    const element = elements[index2];
    const priority = priorities[index2];
    const startIndex = index2;
    while (index2 < count >> 1) {
      const lIndex = this.getLeftChildIndex_(index2);
      const rIndex = this.getRightChildIndex_(index2);
      const smallerChildIndex = rIndex < count && priorities[rIndex] < priorities[lIndex] ? rIndex : lIndex;
      elements[index2] = elements[smallerChildIndex];
      priorities[index2] = priorities[smallerChildIndex];
      index2 = smallerChildIndex;
    }
    elements[index2] = element;
    priorities[index2] = priority;
    this.siftDown_(startIndex, index2);
  }
  siftDown_(startIndex, index2) {
    const elements = this.elements_;
    const priorities = this.priorities_;
    const element = elements[index2];
    const priority = priorities[index2];
    while (index2 > startIndex) {
      const parentIndex = this.getParentIndex_(index2);
      if (priorities[parentIndex] > priority) {
        elements[index2] = elements[parentIndex];
        priorities[index2] = priorities[parentIndex];
        index2 = parentIndex;
      } else {
        break;
      }
    }
    elements[index2] = element;
    priorities[index2] = priority;
  }
  reprioritize() {
    const priorityFunction = this.priorityFunction_;
    const elements = this.elements_;
    const priorities = this.priorities_;
    let index2 = 0;
    const n = elements.length;
    let element, i, priority;
    for (i = 0; i < n; ++i) {
      element = elements[i];
      priority = priorityFunction(element);
      if (priority == DROP) {
        delete this.queuedElements_[this.keyFunction_(element)];
      } else {
        priorities[index2] = priority;
        elements[index2++] = element;
      }
    }
    elements.length = index2;
    priorities.length = index2;
    this.heapify_();
  }
}
const PriorityQueue$1 = PriorityQueue;
class TileQueue extends PriorityQueue$1 {
  constructor(tilePriorityFunction, tileChangeCallback) {
    super(
      function(element) {
        return tilePriorityFunction.apply(null, element);
      },
      function(element) {
        return element[0].getKey();
      }
    );
    this.boundHandleTileChange_ = this.handleTileChange.bind(this);
    this.tileChangeCallback_ = tileChangeCallback;
    this.tilesLoading_ = 0;
    this.tilesLoadingKeys_ = {};
  }
  enqueue(element) {
    const added = super.enqueue(element);
    if (added) {
      const tile = element[0];
      tile.addEventListener(EventType.CHANGE, this.boundHandleTileChange_);
    }
    return added;
  }
  getTilesLoading() {
    return this.tilesLoading_;
  }
  handleTileChange(event) {
    const tile = event.target;
    const state = tile.getState();
    if (state === TileState.LOADED || state === TileState.ERROR || state === TileState.EMPTY) {
      if (state !== TileState.ERROR) {
        tile.removeEventListener(EventType.CHANGE, this.boundHandleTileChange_);
      }
      const tileKey = tile.getKey();
      if (tileKey in this.tilesLoadingKeys_) {
        delete this.tilesLoadingKeys_[tileKey];
        --this.tilesLoading_;
      }
      this.tileChangeCallback_();
    }
  }
  loadMoreTiles(maxTotalLoading, maxNewLoads) {
    let newLoads = 0;
    let state, tile, tileKey;
    while (this.tilesLoading_ < maxTotalLoading && newLoads < maxNewLoads && this.getCount() > 0) {
      tile = this.dequeue()[0];
      tileKey = tile.getKey();
      state = tile.getState();
      if (state === TileState.IDLE && !(tileKey in this.tilesLoadingKeys_)) {
        this.tilesLoadingKeys_[tileKey] = true;
        ++this.tilesLoading_;
        ++newLoads;
        tile.load();
      }
    }
  }
}
const TileQueue$1 = TileQueue;
function getTilePriority(frameState, tile, tileSourceKey, tileCenter, tileResolution) {
  if (!frameState || !(tileSourceKey in frameState.wantedTiles)) {
    return DROP;
  }
  if (!frameState.wantedTiles[tileSourceKey][tile.getKey()]) {
    return DROP;
  }
  const center = frameState.viewState.center;
  const deltaX = tileCenter[0] - center[0];
  const deltaY = tileCenter[1] - center[1];
  return 65536 * Math.log(tileResolution) + Math.sqrt(deltaX * deltaX + deltaY * deltaY) / tileResolution;
}
class GroupEvent extends BaseEvent$1 {
  constructor(type, layer) {
    super(type);
    this.layer = layer;
  }
}
const Property$2 = {
  LAYERS: "layers"
};
class LayerGroup extends BaseLayer$1 {
  constructor(options) {
    options = options || {};
    const baseOptions = Object.assign({}, options);
    delete baseOptions.layers;
    let layers = options.layers;
    super(baseOptions);
    this.on;
    this.once;
    this.un;
    this.layersListenerKeys_ = [];
    this.listenerKeys_ = {};
    this.addChangeListener(Property$2.LAYERS, this.handleLayersChanged_);
    if (layers) {
      if (Array.isArray(layers)) {
        layers = new Collection$1(layers.slice(), { unique: true });
      } else {
        assert(typeof layers.getArray === "function", 43);
      }
    } else {
      layers = new Collection$1(void 0, { unique: true });
    }
    this.setLayers(layers);
  }
  handleLayerChange_() {
    this.changed();
  }
  handleLayersChanged_() {
    this.layersListenerKeys_.forEach(unlistenByKey);
    this.layersListenerKeys_.length = 0;
    const layers = this.getLayers();
    this.layersListenerKeys_.push(
      listen(layers, CollectionEventType.ADD, this.handleLayersAdd_, this),
      listen(layers, CollectionEventType.REMOVE, this.handleLayersRemove_, this)
    );
    for (const id in this.listenerKeys_) {
      this.listenerKeys_[id].forEach(unlistenByKey);
    }
    clear(this.listenerKeys_);
    const layersArray = layers.getArray();
    for (let i = 0, ii = layersArray.length; i < ii; i++) {
      const layer = layersArray[i];
      this.registerLayerListeners_(layer);
      this.dispatchEvent(new GroupEvent("addlayer", layer));
    }
    this.changed();
  }
  registerLayerListeners_(layer) {
    const listenerKeys = [
      listen(
        layer,
        ObjectEventType.PROPERTYCHANGE,
        this.handleLayerChange_,
        this
      ),
      listen(layer, EventType.CHANGE, this.handleLayerChange_, this)
    ];
    if (layer instanceof LayerGroup) {
      listenerKeys.push(
        listen(layer, "addlayer", this.handleLayerGroupAdd_, this),
        listen(layer, "removelayer", this.handleLayerGroupRemove_, this)
      );
    }
    this.listenerKeys_[getUid(layer)] = listenerKeys;
  }
  handleLayerGroupAdd_(event) {
    this.dispatchEvent(new GroupEvent("addlayer", event.layer));
  }
  handleLayerGroupRemove_(event) {
    this.dispatchEvent(new GroupEvent("removelayer", event.layer));
  }
  handleLayersAdd_(collectionEvent) {
    const layer = collectionEvent.element;
    this.registerLayerListeners_(layer);
    this.dispatchEvent(new GroupEvent("addlayer", layer));
    this.changed();
  }
  handleLayersRemove_(collectionEvent) {
    const layer = collectionEvent.element;
    const key = getUid(layer);
    this.listenerKeys_[key].forEach(unlistenByKey);
    delete this.listenerKeys_[key];
    this.dispatchEvent(new GroupEvent("removelayer", layer));
    this.changed();
  }
  getLayers() {
    return this.get(Property$2.LAYERS);
  }
  setLayers(layers) {
    const collection = this.getLayers();
    if (collection) {
      const currentLayers = collection.getArray();
      for (let i = 0, ii = currentLayers.length; i < ii; ++i) {
        this.dispatchEvent(new GroupEvent("removelayer", currentLayers[i]));
      }
    }
    this.set(Property$2.LAYERS, layers);
  }
  getLayersArray(array) {
    array = array !== void 0 ? array : [];
    this.getLayers().forEach(function(layer) {
      layer.getLayersArray(array);
    });
    return array;
  }
  getLayerStatesArray(dest) {
    const states = dest !== void 0 ? dest : [];
    const pos = states.length;
    this.getLayers().forEach(function(layer) {
      layer.getLayerStatesArray(states);
    });
    const ownLayerState = this.getLayerState();
    let defaultZIndex = ownLayerState.zIndex;
    if (!dest && ownLayerState.zIndex === void 0) {
      defaultZIndex = 0;
    }
    for (let i = pos, ii = states.length; i < ii; i++) {
      const layerState = states[i];
      layerState.opacity *= ownLayerState.opacity;
      layerState.visible = layerState.visible && ownLayerState.visible;
      layerState.maxResolution = Math.min(
        layerState.maxResolution,
        ownLayerState.maxResolution
      );
      layerState.minResolution = Math.max(
        layerState.minResolution,
        ownLayerState.minResolution
      );
      layerState.minZoom = Math.max(layerState.minZoom, ownLayerState.minZoom);
      layerState.maxZoom = Math.min(layerState.maxZoom, ownLayerState.maxZoom);
      if (ownLayerState.extent !== void 0) {
        if (layerState.extent !== void 0) {
          layerState.extent = getIntersection(
            layerState.extent,
            ownLayerState.extent
          );
        } else {
          layerState.extent = ownLayerState.extent;
        }
      }
      if (layerState.zIndex === void 0) {
        layerState.zIndex = defaultZIndex;
      }
    }
    return states;
  }
  getSourceState() {
    return "ready";
  }
}
const LayerGroup$1 = LayerGroup;
const ARRAY_BUFFER = 34962;
const ELEMENT_ARRAY_BUFFER = 34963;
const STREAM_DRAW = 35040;
const STATIC_DRAW = 35044;
const DYNAMIC_DRAW = 35048;
const UNSIGNED_BYTE = 5121;
const UNSIGNED_SHORT = 5123;
const UNSIGNED_INT = 5125;
const FLOAT = 5126;
const CONTEXT_IDS = ["experimental-webgl", "webgl", "webkit-3d", "moz-webgl"];
function getContext(canvas, attributes) {
  attributes = Object.assign(
    {
      preserveDrawingBuffer: true,
      antialias: SAFARI_BUG_237906 ? false : true
    },
    attributes
  );
  const ii = CONTEXT_IDS.length;
  for (let i = 0; i < ii; ++i) {
    try {
      const context = canvas.getContext(CONTEXT_IDS[i], attributes);
      if (context) {
        return context;
      }
    } catch (e) {
    }
  }
  return null;
}
const BufferUsage = {
  STATIC_DRAW,
  STREAM_DRAW,
  DYNAMIC_DRAW
};
class WebGLArrayBuffer {
  constructor(type, usage) {
    this.array = null;
    this.type = type;
    assert(type === ARRAY_BUFFER || type === ELEMENT_ARRAY_BUFFER, 62);
    this.usage = usage !== void 0 ? usage : BufferUsage.STATIC_DRAW;
  }
  ofSize(size) {
    this.array = new (getArrayClassForType(this.type))(size);
  }
  fromArray(array) {
    this.array = getArrayClassForType(this.type).from(array);
  }
  fromArrayBuffer(buffer2) {
    this.array = new (getArrayClassForType(this.type))(buffer2);
  }
  getType() {
    return this.type;
  }
  getArray() {
    return this.array;
  }
  getUsage() {
    return this.usage;
  }
  getSize() {
    return this.array ? this.array.length : 0;
  }
}
function getArrayClassForType(type) {
  switch (type) {
    case ARRAY_BUFFER:
      return Float32Array;
    case ELEMENT_ARRAY_BUFFER:
      return Uint32Array;
    default:
      return Float32Array;
  }
}
const WebGLArrayBuffer$1 = WebGLArrayBuffer;
const ContextEventType = {
  LOST: "webglcontextlost",
  RESTORED: "webglcontextrestored"
};
const DEFAULT_VERTEX_SHADER = `
  precision mediump float;
  
  attribute vec2 a_position;
  varying vec2 v_texCoord;
  varying vec2 v_screenCoord;
  
  uniform vec2 u_screenSize;
   
  void main() {
    v_texCoord = a_position * 0.5 + 0.5;
    v_screenCoord = v_texCoord * u_screenSize;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;
const DEFAULT_FRAGMENT_SHADER = `
  precision mediump float;
   
  uniform sampler2D u_image;
  uniform float u_opacity;
   
  varying vec2 v_texCoord;
   
  void main() {
    gl_FragColor = texture2D(u_image, v_texCoord) * u_opacity;
  }
`;
class WebGLPostProcessingPass {
  constructor(options) {
    this.gl_ = options.webGlContext;
    const gl = this.gl_;
    this.scaleRatio_ = options.scaleRatio || 1;
    this.renderTargetTexture_ = gl.createTexture();
    this.renderTargetTextureSize_ = null;
    this.frameBuffer_ = gl.createFramebuffer();
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(
      vertexShader,
      options.vertexShader || DEFAULT_VERTEX_SHADER
    );
    gl.compileShader(vertexShader);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(
      fragmentShader,
      options.fragmentShader || DEFAULT_FRAGMENT_SHADER
    );
    gl.compileShader(fragmentShader);
    this.renderTargetProgram_ = gl.createProgram();
    gl.attachShader(this.renderTargetProgram_, vertexShader);
    gl.attachShader(this.renderTargetProgram_, fragmentShader);
    gl.linkProgram(this.renderTargetProgram_);
    this.renderTargetVerticesBuffer_ = gl.createBuffer();
    const verticesArray = [-1, -1, 1, -1, -1, 1, 1, -1, 1, 1, -1, 1];
    gl.bindBuffer(gl.ARRAY_BUFFER, this.renderTargetVerticesBuffer_);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(verticesArray),
      gl.STATIC_DRAW
    );
    this.renderTargetAttribLocation_ = gl.getAttribLocation(
      this.renderTargetProgram_,
      "a_position"
    );
    this.renderTargetUniformLocation_ = gl.getUniformLocation(
      this.renderTargetProgram_,
      "u_screenSize"
    );
    this.renderTargetOpacityLocation_ = gl.getUniformLocation(
      this.renderTargetProgram_,
      "u_opacity"
    );
    this.renderTargetTextureLocation_ = gl.getUniformLocation(
      this.renderTargetProgram_,
      "u_image"
    );
    this.uniforms_ = [];
    options.uniforms && Object.keys(options.uniforms).forEach(
      function(name) {
        this.uniforms_.push({
          value: options.uniforms[name],
          location: gl.getUniformLocation(this.renderTargetProgram_, name)
        });
      }.bind(this)
    );
  }
  getGL() {
    return this.gl_;
  }
  init(frameState) {
    const gl = this.getGL();
    const textureSize = [
      gl.drawingBufferWidth * this.scaleRatio_,
      gl.drawingBufferHeight * this.scaleRatio_
    ];
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.getFrameBuffer());
    gl.viewport(0, 0, textureSize[0], textureSize[1]);
    if (!this.renderTargetTextureSize_ || this.renderTargetTextureSize_[0] !== textureSize[0] || this.renderTargetTextureSize_[1] !== textureSize[1]) {
      this.renderTargetTextureSize_ = textureSize;
      const level = 0;
      const internalFormat = gl.RGBA;
      const border = 0;
      const format = gl.RGBA;
      const type = gl.UNSIGNED_BYTE;
      const data = null;
      gl.bindTexture(gl.TEXTURE_2D, this.renderTargetTexture_);
      gl.texImage2D(
        gl.TEXTURE_2D,
        level,
        internalFormat,
        textureSize[0],
        textureSize[1],
        border,
        format,
        type,
        data
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        this.renderTargetTexture_,
        0
      );
    }
  }
  apply(frameState, nextPass, preCompose, postCompose) {
    const gl = this.getGL();
    const size = frameState.size;
    gl.bindFramebuffer(
      gl.FRAMEBUFFER,
      nextPass ? nextPass.getFrameBuffer() : null
    );
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.renderTargetTexture_);
    if (!nextPass) {
      const canvasId = getUid(gl.canvas);
      if (!frameState.renderTargets[canvasId]) {
        const attributes = gl.getContextAttributes();
        if (attributes && attributes.preserveDrawingBuffer) {
          gl.clearColor(0, 0, 0, 0);
          gl.clear(gl.COLOR_BUFFER_BIT);
        }
        frameState.renderTargets[canvasId] = true;
      }
    }
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.renderTargetVerticesBuffer_);
    gl.useProgram(this.renderTargetProgram_);
    gl.enableVertexAttribArray(this.renderTargetAttribLocation_);
    gl.vertexAttribPointer(
      this.renderTargetAttribLocation_,
      2,
      gl.FLOAT,
      false,
      0,
      0
    );
    gl.uniform2f(this.renderTargetUniformLocation_, size[0], size[1]);
    gl.uniform1i(this.renderTargetTextureLocation_, 0);
    const opacity = frameState.layerStatesArray[frameState.layerIndex].opacity;
    gl.uniform1f(this.renderTargetOpacityLocation_, opacity);
    this.applyUniforms(frameState);
    if (preCompose) {
      preCompose(gl, frameState);
    }
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    if (postCompose) {
      postCompose(gl, frameState);
    }
  }
  getFrameBuffer() {
    return this.frameBuffer_;
  }
  applyUniforms(frameState) {
    const gl = this.getGL();
    let value;
    let textureSlot = 1;
    this.uniforms_.forEach(function(uniform) {
      value = typeof uniform.value === "function" ? uniform.value(frameState) : uniform.value;
      if (value instanceof HTMLCanvasElement || value instanceof ImageData) {
        if (!uniform.texture) {
          uniform.texture = gl.createTexture();
        }
        gl.activeTexture(gl[`TEXTURE${textureSlot}`]);
        gl.bindTexture(gl.TEXTURE_2D, uniform.texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        if (value instanceof ImageData) {
          gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            value.width,
            value.height,
            0,
            gl.UNSIGNED_BYTE,
            new Uint8Array(value.data)
          );
        } else {
          gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            value
          );
        }
        gl.uniform1i(uniform.location, textureSlot++);
      } else if (Array.isArray(value)) {
        switch (value.length) {
          case 2:
            gl.uniform2f(uniform.location, value[0], value[1]);
            return;
          case 3:
            gl.uniform3f(uniform.location, value[0], value[1], value[2]);
            return;
          case 4:
            gl.uniform4f(
              uniform.location,
              value[0],
              value[1],
              value[2],
              value[3]
            );
            return;
          default:
            return;
        }
      } else if (typeof value === "number") {
        gl.uniform1f(uniform.location, value);
      }
    });
  }
}
const WebGLPostProcessingPass$1 = WebGLPostProcessingPass;
function create$1() {
  return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
}
function fromTransform(mat4, transform2) {
  mat4[0] = transform2[0];
  mat4[1] = transform2[1];
  mat4[4] = transform2[2];
  mat4[5] = transform2[3];
  mat4[12] = transform2[4];
  mat4[13] = transform2[5];
  return mat4;
}
const DefaultUniform = {
  PROJECTION_MATRIX: "u_projectionMatrix",
  OFFSET_SCALE_MATRIX: "u_offsetScaleMatrix",
  OFFSET_ROTATION_MATRIX: "u_offsetRotateMatrix",
  TIME: "u_time",
  ZOOM: "u_zoom",
  RESOLUTION: "u_resolution",
  SIZE_PX: "u_sizePx",
  PIXEL_RATIO: "u_pixelRatio"
};
const AttributeType = {
  UNSIGNED_BYTE,
  UNSIGNED_SHORT,
  UNSIGNED_INT,
  FLOAT
};
const canvasCache = {};
function getSharedCanvasCacheKey(key) {
  return "shared/" + key;
}
let uniqueCanvasCacheKeyCount = 0;
function getUniqueCanvasCacheKey() {
  const key = "unique/" + uniqueCanvasCacheKeyCount;
  uniqueCanvasCacheKeyCount += 1;
  return key;
}
function getCanvas(key) {
  let cacheItem = canvasCache[key];
  if (!cacheItem) {
    const canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.style.left = "0";
    cacheItem = { users: 0, canvas };
    canvasCache[key] = cacheItem;
  }
  cacheItem.users += 1;
  return cacheItem.canvas;
}
function releaseCanvas(key) {
  const cacheItem = canvasCache[key];
  if (!cacheItem) {
    return;
  }
  cacheItem.users -= 1;
  if (cacheItem.users > 0) {
    return;
  }
  const canvas = cacheItem.canvas;
  const gl = getContext(canvas);
  const extension = gl.getExtension("WEBGL_lose_context");
  if (extension) {
    extension.loseContext();
  }
  delete canvasCache[key];
}
class WebGLHelper extends Disposable$1 {
  constructor(options) {
    super();
    options = options || {};
    this.boundHandleWebGLContextLost_ = this.handleWebGLContextLost.bind(this);
    this.boundHandleWebGLContextRestored_ = this.handleWebGLContextRestored.bind(this);
    this.canvasCacheKey_ = options.canvasCacheKey ? getSharedCanvasCacheKey(options.canvasCacheKey) : getUniqueCanvasCacheKey();
    this.canvas_ = getCanvas(this.canvasCacheKey_);
    this.gl_ = getContext(this.canvas_);
    this.bufferCache_ = {};
    this.extensionCache_ = {};
    this.currentProgram_ = null;
    this.canvas_.addEventListener(
      ContextEventType.LOST,
      this.boundHandleWebGLContextLost_
    );
    this.canvas_.addEventListener(
      ContextEventType.RESTORED,
      this.boundHandleWebGLContextRestored_
    );
    this.offsetRotateMatrix_ = create$2();
    this.offsetScaleMatrix_ = create$2();
    this.tmpMat4_ = create$1();
    this.uniformLocations_ = {};
    this.attribLocations_ = {};
    this.uniforms_ = [];
    if (options.uniforms) {
      this.setUniforms(options.uniforms);
    }
    const gl = this.getGL();
    this.postProcessPasses_ = options.postProcesses ? options.postProcesses.map(function(options2) {
      return new WebGLPostProcessingPass$1({
        webGlContext: gl,
        scaleRatio: options2.scaleRatio,
        vertexShader: options2.vertexShader,
        fragmentShader: options2.fragmentShader,
        uniforms: options2.uniforms
      });
    }) : [new WebGLPostProcessingPass$1({ webGlContext: gl })];
    this.shaderCompileErrors_ = null;
    this.startTime_ = Date.now();
  }
  setUniforms(uniforms) {
    this.uniforms_ = [];
    for (const name in uniforms) {
      this.uniforms_.push({
        name,
        value: uniforms[name]
      });
    }
    this.uniformLocations_ = {};
  }
  canvasCacheKeyMatches(canvasCacheKey) {
    return this.canvasCacheKey_ === getSharedCanvasCacheKey(canvasCacheKey);
  }
  getExtension(name) {
    if (name in this.extensionCache_) {
      return this.extensionCache_[name];
    }
    const extension = this.gl_.getExtension(name);
    this.extensionCache_[name] = extension;
    return extension;
  }
  bindBuffer(buffer2) {
    const gl = this.getGL();
    const bufferKey = getUid(buffer2);
    let bufferCache = this.bufferCache_[bufferKey];
    if (!bufferCache) {
      const webGlBuffer = gl.createBuffer();
      bufferCache = {
        buffer: buffer2,
        webGlBuffer
      };
      this.bufferCache_[bufferKey] = bufferCache;
    }
    gl.bindBuffer(buffer2.getType(), bufferCache.webGlBuffer);
  }
  flushBufferData(buffer2) {
    const gl = this.getGL();
    this.bindBuffer(buffer2);
    gl.bufferData(buffer2.getType(), buffer2.getArray(), buffer2.getUsage());
  }
  deleteBuffer(buf) {
    const gl = this.getGL();
    const bufferKey = getUid(buf);
    const bufferCacheEntry = this.bufferCache_[bufferKey];
    if (bufferCacheEntry && !gl.isContextLost()) {
      gl.deleteBuffer(bufferCacheEntry.webGlBuffer);
    }
    delete this.bufferCache_[bufferKey];
  }
  disposeInternal() {
    this.canvas_.removeEventListener(
      ContextEventType.LOST,
      this.boundHandleWebGLContextLost_
    );
    this.canvas_.removeEventListener(
      ContextEventType.RESTORED,
      this.boundHandleWebGLContextRestored_
    );
    releaseCanvas(this.canvasCacheKey_);
    delete this.gl_;
    delete this.canvas_;
  }
  prepareDraw(frameState, disableAlphaBlend) {
    const gl = this.getGL();
    const canvas = this.getCanvas();
    const size = frameState.size;
    const pixelRatio = frameState.pixelRatio;
    canvas.width = size[0] * pixelRatio;
    canvas.height = size[1] * pixelRatio;
    canvas.style.width = size[0] + "px";
    canvas.style.height = size[1] + "px";
    for (let i = this.postProcessPasses_.length - 1; i >= 0; i--) {
      this.postProcessPasses_[i].init(frameState);
    }
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, disableAlphaBlend ? gl.ZERO : gl.ONE_MINUS_SRC_ALPHA);
  }
  prepareDrawToRenderTarget(frameState, renderTarget, disableAlphaBlend) {
    const gl = this.getGL();
    const size = renderTarget.getSize();
    gl.bindFramebuffer(gl.FRAMEBUFFER, renderTarget.getFramebuffer());
    gl.viewport(0, 0, size[0], size[1]);
    gl.bindTexture(gl.TEXTURE_2D, renderTarget.getTexture());
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, disableAlphaBlend ? gl.ZERO : gl.ONE_MINUS_SRC_ALPHA);
  }
  drawElements(start, end) {
    const gl = this.getGL();
    this.getExtension("OES_element_index_uint");
    const elementType = gl.UNSIGNED_INT;
    const elementSize = 4;
    const numItems = end - start;
    const offsetInBytes = start * elementSize;
    gl.drawElements(gl.TRIANGLES, numItems, elementType, offsetInBytes);
  }
  finalizeDraw(frameState, preCompose, postCompose) {
    for (let i = 0, ii = this.postProcessPasses_.length; i < ii; i++) {
      if (i === ii - 1) {
        this.postProcessPasses_[i].apply(
          frameState,
          null,
          preCompose,
          postCompose
        );
      } else {
        this.postProcessPasses_[i].apply(
          frameState,
          this.postProcessPasses_[i + 1]
        );
      }
    }
  }
  getCanvas() {
    return this.canvas_;
  }
  getGL() {
    return this.gl_;
  }
  applyFrameState(frameState) {
    const size = frameState.size;
    const rotation = frameState.viewState.rotation;
    const pixelRatio = frameState.pixelRatio;
    const offsetScaleMatrix = reset(this.offsetScaleMatrix_);
    scale$1(offsetScaleMatrix, 2 / size[0], 2 / size[1]);
    const offsetRotateMatrix = reset(this.offsetRotateMatrix_);
    if (rotation !== 0) {
      rotate$1(offsetRotateMatrix, -rotation);
    }
    this.setUniformMatrixValue(
      DefaultUniform.OFFSET_SCALE_MATRIX,
      fromTransform(this.tmpMat4_, offsetScaleMatrix)
    );
    this.setUniformMatrixValue(
      DefaultUniform.OFFSET_ROTATION_MATRIX,
      fromTransform(this.tmpMat4_, offsetRotateMatrix)
    );
    this.setUniformFloatValue(
      DefaultUniform.TIME,
      (Date.now() - this.startTime_) * 1e-3
    );
    this.setUniformFloatValue(DefaultUniform.ZOOM, frameState.viewState.zoom);
    this.setUniformFloatValue(
      DefaultUniform.RESOLUTION,
      frameState.viewState.resolution
    );
    this.setUniformFloatValue(DefaultUniform.PIXEL_RATIO, pixelRatio);
    this.setUniformFloatVec2(DefaultUniform.SIZE_PX, [size[0], size[1]]);
  }
  applyUniforms(frameState) {
    const gl = this.getGL();
    let value;
    let textureSlot = 0;
    this.uniforms_.forEach(
      function(uniform) {
        value = typeof uniform.value === "function" ? uniform.value(frameState) : uniform.value;
        if (value instanceof HTMLCanvasElement || value instanceof HTMLImageElement || value instanceof ImageData) {
          if (!uniform.texture) {
            uniform.prevValue = void 0;
            uniform.texture = gl.createTexture();
          }
          gl.activeTexture(gl[`TEXTURE${textureSlot}`]);
          gl.bindTexture(gl.TEXTURE_2D, uniform.texture);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          const imageReady = !(value instanceof HTMLImageElement) || value.complete;
          if (imageReady && uniform.prevValue !== value) {
            uniform.prevValue = value;
            gl.texImage2D(
              gl.TEXTURE_2D,
              0,
              gl.RGBA,
              gl.RGBA,
              gl.UNSIGNED_BYTE,
              value
            );
          }
          gl.uniform1i(this.getUniformLocation(uniform.name), textureSlot++);
        } else if (Array.isArray(value) && value.length === 6) {
          this.setUniformMatrixValue(
            uniform.name,
            fromTransform(this.tmpMat4_, value)
          );
        } else if (Array.isArray(value) && value.length <= 4) {
          switch (value.length) {
            case 2:
              gl.uniform2f(
                this.getUniformLocation(uniform.name),
                value[0],
                value[1]
              );
              return;
            case 3:
              gl.uniform3f(
                this.getUniformLocation(uniform.name),
                value[0],
                value[1],
                value[2]
              );
              return;
            case 4:
              gl.uniform4f(
                this.getUniformLocation(uniform.name),
                value[0],
                value[1],
                value[2],
                value[3]
              );
              return;
            default:
              return;
          }
        } else if (typeof value === "number") {
          gl.uniform1f(this.getUniformLocation(uniform.name), value);
        }
      }.bind(this)
    );
  }
  useProgram(program, frameState) {
    const gl = this.getGL();
    gl.useProgram(program);
    this.currentProgram_ = program;
    this.uniformLocations_ = {};
    this.attribLocations_ = {};
    this.applyFrameState(frameState);
    this.applyUniforms(frameState);
  }
  compileShader(source, type) {
    const gl = this.getGL();
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
  }
  getProgram(fragmentShaderSource, vertexShaderSource) {
    const gl = this.getGL();
    const fragmentShader = this.compileShader(
      fragmentShaderSource,
      gl.FRAGMENT_SHADER
    );
    const vertexShader = this.compileShader(
      vertexShaderSource,
      gl.VERTEX_SHADER
    );
    const program = gl.createProgram();
    gl.attachShader(program, fragmentShader);
    gl.attachShader(program, vertexShader);
    gl.linkProgram(program);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      const message = `Fragment shader compliation failed: ${gl.getShaderInfoLog(
        fragmentShader
      )}`;
      throw new Error(message);
    }
    gl.deleteShader(fragmentShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      const message = `Vertex shader compilation failed: ${gl.getShaderInfoLog(
        vertexShader
      )}`;
      throw new Error(message);
    }
    gl.deleteShader(vertexShader);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const message = `GL program linking failed: ${gl.getShaderInfoLog(
        vertexShader
      )}`;
      throw new Error(message);
    }
    return program;
  }
  getUniformLocation(name) {
    if (this.uniformLocations_[name] === void 0) {
      this.uniformLocations_[name] = this.getGL().getUniformLocation(
        this.currentProgram_,
        name
      );
    }
    return this.uniformLocations_[name];
  }
  getAttributeLocation(name) {
    if (this.attribLocations_[name] === void 0) {
      this.attribLocations_[name] = this.getGL().getAttribLocation(
        this.currentProgram_,
        name
      );
    }
    return this.attribLocations_[name];
  }
  makeProjectionTransform(frameState, transform2) {
    const size = frameState.size;
    const rotation = frameState.viewState.rotation;
    const resolution = frameState.viewState.resolution;
    const center = frameState.viewState.center;
    reset(transform2);
    compose(
      transform2,
      0,
      0,
      2 / (resolution * size[0]),
      2 / (resolution * size[1]),
      -rotation,
      -center[0],
      -center[1]
    );
    return transform2;
  }
  setUniformFloatValue(uniform, value) {
    this.getGL().uniform1f(this.getUniformLocation(uniform), value);
  }
  setUniformFloatVec2(uniform, value) {
    this.getGL().uniform2fv(this.getUniformLocation(uniform), value);
  }
  setUniformFloatVec4(uniform, value) {
    this.getGL().uniform4fv(this.getUniformLocation(uniform), value);
  }
  setUniformMatrixValue(uniform, value) {
    this.getGL().uniformMatrix4fv(
      this.getUniformLocation(uniform),
      false,
      value
    );
  }
  enableAttributeArray_(attribName, size, type, stride, offset) {
    const location = this.getAttributeLocation(attribName);
    if (location < 0) {
      return;
    }
    this.getGL().enableVertexAttribArray(location);
    this.getGL().vertexAttribPointer(
      location,
      size,
      type,
      false,
      stride,
      offset
    );
  }
  enableAttributes(attributes) {
    const stride = computeAttributesStride(attributes);
    let offset = 0;
    for (let i = 0; i < attributes.length; i++) {
      const attr = attributes[i];
      this.enableAttributeArray_(
        attr.name,
        attr.size,
        attr.type || FLOAT,
        stride,
        offset
      );
      offset += attr.size * getByteSizeFromType(attr.type);
    }
  }
  handleWebGLContextLost() {
    clear(this.bufferCache_);
    this.currentProgram_ = null;
  }
  handleWebGLContextRestored() {
  }
  createTexture(size, data, texture) {
    const gl = this.getGL();
    texture = texture || gl.createTexture();
    const level = 0;
    const internalFormat = gl.RGBA;
    const border = 0;
    const format = gl.RGBA;
    const type = gl.UNSIGNED_BYTE;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    if (data) {
      gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, format, type, data);
    } else {
      gl.texImage2D(
        gl.TEXTURE_2D,
        level,
        internalFormat,
        size[0],
        size[1],
        border,
        format,
        type,
        null
      );
    }
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return texture;
  }
}
function computeAttributesStride(attributes) {
  let stride = 0;
  for (let i = 0; i < attributes.length; i++) {
    const attr = attributes[i];
    stride += attr.size * getByteSizeFromType(attr.type);
  }
  return stride;
}
function getByteSizeFromType(type) {
  switch (type) {
    case AttributeType.UNSIGNED_BYTE:
      return Uint8Array.BYTES_PER_ELEMENT;
    case AttributeType.UNSIGNED_SHORT:
      return Uint16Array.BYTES_PER_ELEMENT;
    case AttributeType.UNSIGNED_INT:
      return Uint32Array.BYTES_PER_ELEMENT;
    case AttributeType.FLOAT:
    default:
      return Float32Array.BYTES_PER_ELEMENT;
  }
}
class WebGLLayerRenderer extends LayerRenderer$1 {
  constructor(layer, options) {
    super(layer);
    options = options || {};
    this.inversePixelTransform_ = create$2();
    this.pixelContext_ = null;
    this.postProcesses_ = options.postProcesses;
    this.uniforms_ = options.uniforms;
    this.helper;
    layer.addChangeListener(LayerProperty.MAP, this.removeHelper.bind(this));
    this.dispatchPreComposeEvent = this.dispatchPreComposeEvent.bind(this);
    this.dispatchPostComposeEvent = this.dispatchPostComposeEvent.bind(this);
  }
  dispatchPreComposeEvent(context, frameState) {
    const layer = this.getLayer();
    if (layer.hasListener(RenderEventType.PRECOMPOSE)) {
      const event = new RenderEvent$1(
        RenderEventType.PRECOMPOSE,
        void 0,
        frameState,
        context
      );
      layer.dispatchEvent(event);
    }
  }
  dispatchPostComposeEvent(context, frameState) {
    const layer = this.getLayer();
    if (layer.hasListener(RenderEventType.POSTCOMPOSE)) {
      const event = new RenderEvent$1(
        RenderEventType.POSTCOMPOSE,
        void 0,
        frameState,
        context
      );
      layer.dispatchEvent(event);
    }
  }
  reset(options) {
    this.uniforms_ = options.uniforms;
    if (this.helper) {
      this.helper.setUniforms(this.uniforms_);
    }
  }
  removeHelper() {
    if (this.helper) {
      this.helper.dispose();
      delete this.helper;
    }
  }
  prepareFrame(frameState) {
    if (this.getLayer().getRenderSource()) {
      let incrementGroup = true;
      let groupNumber = -1;
      let className;
      for (let i = 0, ii = frameState.layerStatesArray.length; i < ii; i++) {
        const layer = frameState.layerStatesArray[i].layer;
        const renderer = layer.getRenderer();
        if (!(renderer instanceof WebGLLayerRenderer)) {
          incrementGroup = true;
          continue;
        }
        const layerClassName = layer.getClassName();
        if (incrementGroup || layerClassName !== className) {
          groupNumber += 1;
          incrementGroup = false;
        }
        className = layerClassName;
        if (renderer === this) {
          break;
        }
      }
      const canvasCacheKey = "map/" + frameState.mapId + "/group/" + groupNumber;
      if (!this.helper || !this.helper.canvasCacheKeyMatches(canvasCacheKey)) {
        this.removeHelper();
        this.helper = new WebGLHelper({
          postProcesses: this.postProcesses_,
          uniforms: this.uniforms_,
          canvasCacheKey
        });
        if (className) {
          this.helper.getCanvas().className = className;
        }
        this.afterHelperCreated();
      }
    }
    return this.prepareFrameInternal(frameState);
  }
  afterHelperCreated() {
  }
  prepareFrameInternal(frameState) {
    return true;
  }
  disposeInternal() {
    this.removeHelper();
    super.disposeInternal();
  }
  dispatchRenderEvent_(type, context, frameState) {
    const layer = this.getLayer();
    if (layer.hasListener(type)) {
      compose(
        this.inversePixelTransform_,
        0,
        0,
        frameState.pixelRatio,
        -frameState.pixelRatio,
        0,
        0,
        -frameState.size[1]
      );
      const event = new RenderEvent$1(
        type,
        this.inversePixelTransform_,
        frameState,
        context
      );
      layer.dispatchEvent(event);
    }
  }
  preRender(context, frameState) {
    this.dispatchRenderEvent_(RenderEventType.PRERENDER, context, frameState);
  }
  postRender(context, frameState) {
    this.dispatchRenderEvent_(RenderEventType.POSTRENDER, context, frameState);
  }
}
const WebGLLayerRenderer$1 = WebGLLayerRenderer;
const tmpArray4 = new Uint8Array(4);
class WebGLRenderTarget {
  constructor(helper, size) {
    this.helper_ = helper;
    const gl = helper.getGL();
    this.texture_ = gl.createTexture();
    this.framebuffer_ = gl.createFramebuffer();
    this.size_ = size || [1, 1];
    this.data_ = new Uint8Array(0);
    this.dataCacheDirty_ = true;
    this.updateSize_();
  }
  setSize(size) {
    if (equals$1(size, this.size_)) {
      return;
    }
    this.size_[0] = size[0];
    this.size_[1] = size[1];
    this.updateSize_();
  }
  getSize() {
    return this.size_;
  }
  clearCachedData() {
    this.dataCacheDirty_ = true;
  }
  readAll() {
    if (this.dataCacheDirty_) {
      const size = this.size_;
      const gl = this.helper_.getGL();
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer_);
      gl.readPixels(
        0,
        0,
        size[0],
        size[1],
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        this.data_
      );
      this.dataCacheDirty_ = false;
    }
    return this.data_;
  }
  readPixel(x, y) {
    if (x < 0 || y < 0 || x > this.size_[0] || y >= this.size_[1]) {
      tmpArray4[0] = 0;
      tmpArray4[1] = 0;
      tmpArray4[2] = 0;
      tmpArray4[3] = 0;
      return tmpArray4;
    }
    this.readAll();
    const index2 = Math.floor(x) + (this.size_[1] - Math.floor(y) - 1) * this.size_[0];
    tmpArray4[0] = this.data_[index2 * 4];
    tmpArray4[1] = this.data_[index2 * 4 + 1];
    tmpArray4[2] = this.data_[index2 * 4 + 2];
    tmpArray4[3] = this.data_[index2 * 4 + 3];
    return tmpArray4;
  }
  getTexture() {
    return this.texture_;
  }
  getFramebuffer() {
    return this.framebuffer_;
  }
  updateSize_() {
    const size = this.size_;
    const gl = this.helper_.getGL();
    this.texture_ = this.helper_.createTexture(size, null, this.texture_);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer_);
    gl.viewport(0, 0, size[0], size[1]);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      this.texture_,
      0
    );
    this.data_ = new Uint8Array(size[0] * size[1] * 4);
  }
}
const WebGLRenderTarget$1 = WebGLRenderTarget;
const WebGLWorkerMessageType = {
  GENERATE_POLYGON_BUFFERS: "GENERATE_POLYGON_BUFFERS",
  GENERATE_POINT_BUFFERS: "GENERATE_POINT_BUFFERS",
  GENERATE_LINE_STRING_BUFFERS: "GENERATE_LINE_STRING_BUFFERS"
};
var earcut$1 = { exports: {} };
earcut$1.exports = earcut;
earcut$1.exports.default = earcut;
function earcut(data, holeIndices, dim) {
  dim = dim || 2;
  var hasHoles = holeIndices && holeIndices.length, outerLen = hasHoles ? holeIndices[0] * dim : data.length, outerNode = linkedList(data, 0, outerLen, dim, true), triangles = [];
  if (!outerNode || outerNode.next === outerNode.prev)
    return triangles;
  var minX, minY, maxX, maxY, x, y, invSize;
  if (hasHoles)
    outerNode = eliminateHoles(data, holeIndices, outerNode, dim);
  if (data.length > 80 * dim) {
    minX = maxX = data[0];
    minY = maxY = data[1];
    for (var i = dim; i < outerLen; i += dim) {
      x = data[i];
      y = data[i + 1];
      if (x < minX)
        minX = x;
      if (y < minY)
        minY = y;
      if (x > maxX)
        maxX = x;
      if (y > maxY)
        maxY = y;
    }
    invSize = Math.max(maxX - minX, maxY - minY);
    invSize = invSize !== 0 ? 32767 / invSize : 0;
  }
  earcutLinked(outerNode, triangles, dim, minX, minY, invSize, 0);
  return triangles;
}
function linkedList(data, start, end, dim, clockwise) {
  var i, last;
  if (clockwise === signedArea(data, start, end, dim) > 0) {
    for (i = start; i < end; i += dim)
      last = insertNode(i, data[i], data[i + 1], last);
  } else {
    for (i = end - dim; i >= start; i -= dim)
      last = insertNode(i, data[i], data[i + 1], last);
  }
  if (last && equals(last, last.next)) {
    removeNode(last);
    last = last.next;
  }
  return last;
}
function filterPoints(start, end) {
  if (!start)
    return start;
  if (!end)
    end = start;
  var p = start, again;
  do {
    again = false;
    if (!p.steiner && (equals(p, p.next) || area(p.prev, p, p.next) === 0)) {
      removeNode(p);
      p = end = p.prev;
      if (p === p.next)
        break;
      again = true;
    } else {
      p = p.next;
    }
  } while (again || p !== end);
  return end;
}
function earcutLinked(ear, triangles, dim, minX, minY, invSize, pass) {
  if (!ear)
    return;
  if (!pass && invSize)
    indexCurve(ear, minX, minY, invSize);
  var stop = ear, prev, next;
  while (ear.prev !== ear.next) {
    prev = ear.prev;
    next = ear.next;
    if (invSize ? isEarHashed(ear, minX, minY, invSize) : isEar(ear)) {
      triangles.push(prev.i / dim | 0);
      triangles.push(ear.i / dim | 0);
      triangles.push(next.i / dim | 0);
      removeNode(ear);
      ear = next.next;
      stop = next.next;
      continue;
    }
    ear = next;
    if (ear === stop) {
      if (!pass) {
        earcutLinked(filterPoints(ear), triangles, dim, minX, minY, invSize, 1);
      } else if (pass === 1) {
        ear = cureLocalIntersections(filterPoints(ear), triangles, dim);
        earcutLinked(ear, triangles, dim, minX, minY, invSize, 2);
      } else if (pass === 2) {
        splitEarcut(ear, triangles, dim, minX, minY, invSize);
      }
      break;
    }
  }
}
function isEar(ear) {
  var a = ear.prev, b = ear, c = ear.next;
  if (area(a, b, c) >= 0)
    return false;
  var ax = a.x, bx = b.x, cx = c.x, ay = a.y, by = b.y, cy = c.y;
  var x0 = ax < bx ? ax < cx ? ax : cx : bx < cx ? bx : cx, y0 = ay < by ? ay < cy ? ay : cy : by < cy ? by : cy, x1 = ax > bx ? ax > cx ? ax : cx : bx > cx ? bx : cx, y1 = ay > by ? ay > cy ? ay : cy : by > cy ? by : cy;
  var p = c.next;
  while (p !== a) {
    if (p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1 && pointInTriangle(ax, ay, bx, by, cx, cy, p.x, p.y) && area(p.prev, p, p.next) >= 0)
      return false;
    p = p.next;
  }
  return true;
}
function isEarHashed(ear, minX, minY, invSize) {
  var a = ear.prev, b = ear, c = ear.next;
  if (area(a, b, c) >= 0)
    return false;
  var ax = a.x, bx = b.x, cx = c.x, ay = a.y, by = b.y, cy = c.y;
  var x0 = ax < bx ? ax < cx ? ax : cx : bx < cx ? bx : cx, y0 = ay < by ? ay < cy ? ay : cy : by < cy ? by : cy, x1 = ax > bx ? ax > cx ? ax : cx : bx > cx ? bx : cx, y1 = ay > by ? ay > cy ? ay : cy : by > cy ? by : cy;
  var minZ = zOrder(x0, y0, minX, minY, invSize), maxZ = zOrder(x1, y1, minX, minY, invSize);
  var p = ear.prevZ, n = ear.nextZ;
  while (p && p.z >= minZ && n && n.z <= maxZ) {
    if (p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1 && p !== a && p !== c && pointInTriangle(ax, ay, bx, by, cx, cy, p.x, p.y) && area(p.prev, p, p.next) >= 0)
      return false;
    p = p.prevZ;
    if (n.x >= x0 && n.x <= x1 && n.y >= y0 && n.y <= y1 && n !== a && n !== c && pointInTriangle(ax, ay, bx, by, cx, cy, n.x, n.y) && area(n.prev, n, n.next) >= 0)
      return false;
    n = n.nextZ;
  }
  while (p && p.z >= minZ) {
    if (p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1 && p !== a && p !== c && pointInTriangle(ax, ay, bx, by, cx, cy, p.x, p.y) && area(p.prev, p, p.next) >= 0)
      return false;
    p = p.prevZ;
  }
  while (n && n.z <= maxZ) {
    if (n.x >= x0 && n.x <= x1 && n.y >= y0 && n.y <= y1 && n !== a && n !== c && pointInTriangle(ax, ay, bx, by, cx, cy, n.x, n.y) && area(n.prev, n, n.next) >= 0)
      return false;
    n = n.nextZ;
  }
  return true;
}
function cureLocalIntersections(start, triangles, dim) {
  var p = start;
  do {
    var a = p.prev, b = p.next.next;
    if (!equals(a, b) && intersects(a, p, p.next, b) && locallyInside(a, b) && locallyInside(b, a)) {
      triangles.push(a.i / dim | 0);
      triangles.push(p.i / dim | 0);
      triangles.push(b.i / dim | 0);
      removeNode(p);
      removeNode(p.next);
      p = start = b;
    }
    p = p.next;
  } while (p !== start);
  return filterPoints(p);
}
function splitEarcut(start, triangles, dim, minX, minY, invSize) {
  var a = start;
  do {
    var b = a.next.next;
    while (b !== a.prev) {
      if (a.i !== b.i && isValidDiagonal(a, b)) {
        var c = splitPolygon(a, b);
        a = filterPoints(a, a.next);
        c = filterPoints(c, c.next);
        earcutLinked(a, triangles, dim, minX, minY, invSize, 0);
        earcutLinked(c, triangles, dim, minX, minY, invSize, 0);
        return;
      }
      b = b.next;
    }
    a = a.next;
  } while (a !== start);
}
function eliminateHoles(data, holeIndices, outerNode, dim) {
  var queue = [], i, len, start, end, list;
  for (i = 0, len = holeIndices.length; i < len; i++) {
    start = holeIndices[i] * dim;
    end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
    list = linkedList(data, start, end, dim, false);
    if (list === list.next)
      list.steiner = true;
    queue.push(getLeftmost(list));
  }
  queue.sort(compareX);
  for (i = 0; i < queue.length; i++) {
    outerNode = eliminateHole(queue[i], outerNode);
  }
  return outerNode;
}
function compareX(a, b) {
  return a.x - b.x;
}
function eliminateHole(hole, outerNode) {
  var bridge = findHoleBridge(hole, outerNode);
  if (!bridge) {
    return outerNode;
  }
  var bridgeReverse = splitPolygon(bridge, hole);
  filterPoints(bridgeReverse, bridgeReverse.next);
  return filterPoints(bridge, bridge.next);
}
function findHoleBridge(hole, outerNode) {
  var p = outerNode, hx = hole.x, hy = hole.y, qx = -Infinity, m;
  do {
    if (hy <= p.y && hy >= p.next.y && p.next.y !== p.y) {
      var x = p.x + (hy - p.y) * (p.next.x - p.x) / (p.next.y - p.y);
      if (x <= hx && x > qx) {
        qx = x;
        m = p.x < p.next.x ? p : p.next;
        if (x === hx)
          return m;
      }
    }
    p = p.next;
  } while (p !== outerNode);
  if (!m)
    return null;
  var stop = m, mx = m.x, my = m.y, tanMin = Infinity, tan;
  p = m;
  do {
    if (hx >= p.x && p.x >= mx && hx !== p.x && pointInTriangle(hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p.x, p.y)) {
      tan = Math.abs(hy - p.y) / (hx - p.x);
      if (locallyInside(p, hole) && (tan < tanMin || tan === tanMin && (p.x > m.x || p.x === m.x && sectorContainsSector(m, p)))) {
        m = p;
        tanMin = tan;
      }
    }
    p = p.next;
  } while (p !== stop);
  return m;
}
function sectorContainsSector(m, p) {
  return area(m.prev, m, p.prev) < 0 && area(p.next, m, m.next) < 0;
}
function indexCurve(start, minX, minY, invSize) {
  var p = start;
  do {
    if (p.z === 0)
      p.z = zOrder(p.x, p.y, minX, minY, invSize);
    p.prevZ = p.prev;
    p.nextZ = p.next;
    p = p.next;
  } while (p !== start);
  p.prevZ.nextZ = null;
  p.prevZ = null;
  sortLinked(p);
}
function sortLinked(list) {
  var i, p, q, e, tail, numMerges, pSize, qSize, inSize = 1;
  do {
    p = list;
    list = null;
    tail = null;
    numMerges = 0;
    while (p) {
      numMerges++;
      q = p;
      pSize = 0;
      for (i = 0; i < inSize; i++) {
        pSize++;
        q = q.nextZ;
        if (!q)
          break;
      }
      qSize = inSize;
      while (pSize > 0 || qSize > 0 && q) {
        if (pSize !== 0 && (qSize === 0 || !q || p.z <= q.z)) {
          e = p;
          p = p.nextZ;
          pSize--;
        } else {
          e = q;
          q = q.nextZ;
          qSize--;
        }
        if (tail)
          tail.nextZ = e;
        else
          list = e;
        e.prevZ = tail;
        tail = e;
      }
      p = q;
    }
    tail.nextZ = null;
    inSize *= 2;
  } while (numMerges > 1);
  return list;
}
function zOrder(x, y, minX, minY, invSize) {
  x = (x - minX) * invSize | 0;
  y = (y - minY) * invSize | 0;
  x = (x | x << 8) & 16711935;
  x = (x | x << 4) & 252645135;
  x = (x | x << 2) & 858993459;
  x = (x | x << 1) & 1431655765;
  y = (y | y << 8) & 16711935;
  y = (y | y << 4) & 252645135;
  y = (y | y << 2) & 858993459;
  y = (y | y << 1) & 1431655765;
  return x | y << 1;
}
function getLeftmost(start) {
  var p = start, leftmost = start;
  do {
    if (p.x < leftmost.x || p.x === leftmost.x && p.y < leftmost.y)
      leftmost = p;
    p = p.next;
  } while (p !== start);
  return leftmost;
}
function pointInTriangle(ax, ay, bx, by, cx, cy, px, py) {
  return (cx - px) * (ay - py) >= (ax - px) * (cy - py) && (ax - px) * (by - py) >= (bx - px) * (ay - py) && (bx - px) * (cy - py) >= (cx - px) * (by - py);
}
function isValidDiagonal(a, b) {
  return a.next.i !== b.i && a.prev.i !== b.i && !intersectsPolygon(a, b) && (locallyInside(a, b) && locallyInside(b, a) && middleInside(a, b) && (area(a.prev, a, b.prev) || area(a, b.prev, b)) || equals(a, b) && area(a.prev, a, a.next) > 0 && area(b.prev, b, b.next) > 0);
}
function area(p, q, r) {
  return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
}
function equals(p12, p22) {
  return p12.x === p22.x && p12.y === p22.y;
}
function intersects(p12, q1, p22, q2) {
  var o1 = sign(area(p12, q1, p22));
  var o2 = sign(area(p12, q1, q2));
  var o3 = sign(area(p22, q2, p12));
  var o4 = sign(area(p22, q2, q1));
  if (o1 !== o2 && o3 !== o4)
    return true;
  if (o1 === 0 && onSegment(p12, p22, q1))
    return true;
  if (o2 === 0 && onSegment(p12, q2, q1))
    return true;
  if (o3 === 0 && onSegment(p22, p12, q2))
    return true;
  if (o4 === 0 && onSegment(p22, q1, q2))
    return true;
  return false;
}
function onSegment(p, q, r) {
  return q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y);
}
function sign(num) {
  return num > 0 ? 1 : num < 0 ? -1 : 0;
}
function intersectsPolygon(a, b) {
  var p = a;
  do {
    if (p.i !== a.i && p.next.i !== a.i && p.i !== b.i && p.next.i !== b.i && intersects(p, p.next, a, b))
      return true;
    p = p.next;
  } while (p !== a);
  return false;
}
function locallyInside(a, b) {
  return area(a.prev, a, a.next) < 0 ? area(a, b, a.next) >= 0 && area(a, a.prev, b) >= 0 : area(a, b, a.prev) < 0 || area(a, a.next, b) < 0;
}
function middleInside(a, b) {
  var p = a, inside = false, px = (a.x + b.x) / 2, py = (a.y + b.y) / 2;
  do {
    if (p.y > py !== p.next.y > py && p.next.y !== p.y && px < (p.next.x - p.x) * (py - p.y) / (p.next.y - p.y) + p.x)
      inside = !inside;
    p = p.next;
  } while (p !== a);
  return inside;
}
function splitPolygon(a, b) {
  var a2 = new Node(a.i, a.x, a.y), b2 = new Node(b.i, b.x, b.y), an = a.next, bp = b.prev;
  a.next = b;
  b.prev = a;
  a2.next = an;
  an.prev = a2;
  b2.next = a2;
  a2.prev = b2;
  bp.next = b2;
  b2.prev = bp;
  return b2;
}
function insertNode(i, x, y, last) {
  var p = new Node(i, x, y);
  if (!last) {
    p.prev = p;
    p.next = p;
  } else {
    p.next = last.next;
    p.prev = last;
    last.next.prev = p;
    last.next = p;
  }
  return p;
}
function removeNode(p) {
  p.next.prev = p.prev;
  p.prev.next = p.next;
  if (p.prevZ)
    p.prevZ.nextZ = p.nextZ;
  if (p.nextZ)
    p.nextZ.prevZ = p.prevZ;
}
function Node(i, x, y) {
  this.i = i;
  this.x = x;
  this.y = y;
  this.prev = null;
  this.next = null;
  this.z = 0;
  this.prevZ = null;
  this.nextZ = null;
  this.steiner = false;
}
earcut.deviation = function(data, holeIndices, dim, triangles) {
  var hasHoles = holeIndices && holeIndices.length;
  var outerLen = hasHoles ? holeIndices[0] * dim : data.length;
  var polygonArea = Math.abs(signedArea(data, 0, outerLen, dim));
  if (hasHoles) {
    for (var i = 0, len = holeIndices.length; i < len; i++) {
      var start = holeIndices[i] * dim;
      var end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
      polygonArea -= Math.abs(signedArea(data, start, end, dim));
    }
  }
  var trianglesArea = 0;
  for (i = 0; i < triangles.length; i += 3) {
    var a = triangles[i] * dim;
    var b = triangles[i + 1] * dim;
    var c = triangles[i + 2] * dim;
    trianglesArea += Math.abs(
      (data[a] - data[c]) * (data[b + 1] - data[a + 1]) - (data[a] - data[b]) * (data[c + 1] - data[a + 1])
    );
  }
  return polygonArea === 0 && trianglesArea === 0 ? 0 : Math.abs((trianglesArea - polygonArea) / polygonArea);
};
function signedArea(data, start, end, dim) {
  var sum = 0;
  for (var i = start, j = end - dim; i < end; i += dim) {
    sum += (data[j] - data[i]) * (data[i + 1] + data[j + 1]);
    j = i;
  }
  return sum;
}
earcut.flatten = function(data) {
  var dim = data[0][0].length, result = { vertices: [], holes: [], dimensions: dim }, holeIndex = 0;
  for (var i = 0; i < data.length; i++) {
    for (var j = 0; j < data[i].length; j++) {
      for (var d = 0; d < dim; d++)
        result.vertices.push(data[i][j][d]);
    }
    if (i > 0) {
      holeIndex += data[i - 1].length;
      result.holes.push(holeIndex);
    }
  }
  return result;
};
function colorEncodeId(id, array) {
  array = array || [];
  const radix = 256;
  const divide = radix - 1;
  array[0] = Math.floor(id / radix / radix / radix) / divide;
  array[1] = Math.floor(id / radix / radix) % radix / divide;
  array[2] = Math.floor(id / radix) % radix / divide;
  array[3] = id % radix / divide;
  return array;
}
function colorDecodeId(color) {
  let id = 0;
  const radix = 256;
  const mult = radix - 1;
  id += Math.round(color[0] * radix * radix * radix * mult);
  id += Math.round(color[1] * radix * radix * mult);
  id += Math.round(color[2] * radix * mult);
  id += Math.round(color[3] * mult);
  return id;
}
function create() {
  const source = 'const e="GENERATE_POLYGON_BUFFERS",t="GENERATE_POINT_BUFFERS",n="GENERATE_LINE_STRING_BUFFERS",r="undefined"!=typeof navigator&&void 0!==navigator.userAgent?navigator.userAgent.toLowerCase():"";r.includes("firefox");r.includes("safari")&&!r.includes("chrom")&&(r.includes("version/15.4")||/cpu (os|iphone os) 15_4 like mac os x/.test(r)),r.includes("webkit")&&r.includes("edge"),r.includes("macintosh"),"undefined"!=typeof WorkerGlobalScope&&"undefined"!=typeof OffscreenCanvas&&(self,WorkerGlobalScope),function(){let e=!1;try{const t=Object.defineProperty({},"passive",{get:function(){e=!0}});window.addEventListener("_",null,t),window.removeEventListener("_",null,t)}catch(e){}}();const o={1:"The view center is not defined",2:"The view resolution is not defined",3:"The view rotation is not defined",4:"`image` and `src` cannot be provided at the same time",5:"`imgSize` must be set when `image` is provided",7:"`format` must be set when `url` is set",8:"Unknown `serverType` configured",9:"`url` must be configured or set using `#setUrl()`",10:"The default `geometryFunction` can only handle `Point` geometries",11:"`options.featureTypes` must be an Array",12:"`options.geometryName` must also be provided when `options.bbox` is set",13:"Invalid corner",14:"Invalid color",15:"Tried to get a value for a key that does not exist in the cache",16:"Tried to set a value for a key that is used already",17:"`resolutions` must be sorted in descending order",18:"Either `origin` or `origins` must be configured, never both",19:"Number of `tileSizes` and `resolutions` must be equal",20:"Number of `origins` and `resolutions` must be equal",22:"Either `tileSize` or `tileSizes` must be configured, never both",24:"Invalid extent or geometry provided as `geometry`",25:"Cannot fit empty extent provided as `geometry`",26:"Features must have an id set",27:"Features must have an id set",28:\'`renderMode` must be `"hybrid"` or `"vector"`\',30:"The passed `feature` was already added to the source",31:"Tried to enqueue an `element` that was already added to the queue",32:"Transformation matrix cannot be inverted",33:"Invalid units",34:"Invalid geometry layout",36:"Unknown SRS type",37:"Unknown geometry type found",38:"`styleMapValue` has an unknown type",39:"Unknown geometry type",40:"Expected `feature` to have a geometry",41:"Expected an `ol/style/Style` or an array of `ol/style/Style.js`",42:"Question unknown, the answer is 42",43:"Expected `layers` to be an array or a `Collection`",47:"Expected `controls` to be an array or an `ol/Collection`",48:"Expected `interactions` to be an array or an `ol/Collection`",49:"Expected `overlays` to be an array or an `ol/Collection`",50:"`options.featureTypes` should be an Array",51:"Either `url` or `tileJSON` options must be provided",52:"Unknown `serverType` configured",53:"Unknown `tierSizeCalculation` configured",55:"The {-y} placeholder requires a tile grid with extent",56:"mapBrowserEvent must originate from a pointer event",57:"At least 2 conditions are required",59:"Invalid command found in the PBF",60:"Missing or invalid `size`",61:"Cannot determine IIIF Image API version from provided image information JSON",62:"A `WebGLArrayBuffer` must either be of type `ELEMENT_ARRAY_BUFFER` or `ARRAY_BUFFER`",64:"Layer opacity must be a number",66:"`forEachFeatureAtCoordinate` cannot be used on a WebGL layer if the hit detection logic has not been enabled. This is done by providing adequate shaders using the `hitVertexShader` and `hitFragmentShader` properties of `WebGLPointsLayerRenderer`",67:"A layer can only be added to the map once. Use either `layer.setMap()` or `map.addLayer()`, not both",68:"A VectorTile source can only be rendered if it has a projection compatible with the view projection"};class i extends Error{constructor(e){const t=o[e];super(t),this.code=e,this.name="AssertionError",this.message=t}}function s(e,t){const n=t[0],r=t[1];return t[0]=e[0]*n+e[2]*r+e[4],t[1]=e[1]*n+e[3]*r+e[5],t}function a(e,t){const n=(r=t)[0]*r[3]-r[1]*r[2];var r;!function(e,t){if(!e)throw new i(t)}(0!==n,32);const o=t[0],s=t[1],a=t[2],u=t[3],x=t[4],f=t[5];return e[0]=u/n,e[1]=-s/n,e[2]=-a/n,e[3]=o/n,e[4]=(a*f-u*x)/n,e[5]=-(o*f-s*x)/n,e}new Array(6);var u={exports:{}};function x(e,t,n){n=n||2;var r,o,i,s,a,u,x,y=t&&t.length,d=y?t[0]*n:e.length,h=f(e,0,d,n,!0),v=[];if(!h||h.next===h.prev)return v;if(y&&(h=function(e,t,n,r){var o,i,s,a=[];for(o=0,i=t.length;o<i;o++)(s=f(e,t[o]*r,o<i-1?t[o+1]*r:e.length,r,!1))===s.next&&(s.steiner=!0),a.push(w(s));for(a.sort(p),o=0;o<a.length;o++)n=l(n=g(a[o],n),n.next);return n}(e,t,h,n)),e.length>80*n){r=i=e[0],o=s=e[1];for(var b=n;b<d;b+=n)(a=e[b])<r&&(r=a),(u=e[b+1])<o&&(o=u),a>i&&(i=a),u>s&&(s=u);x=0!==(x=Math.max(i-r,s-o))?1/x:0}return c(h,v,n,r,o,x),v}function f(e,t,n,r,o){var i,s;if(o===B(e,t,n,r)>0)for(i=t;i<n;i+=r)s=U(i,e[i],e[i+1],s);else for(i=n-r;i>=t;i-=r)s=U(i,e[i],e[i+1],s);return s&&M(s,s.next)&&(z(s),s=s.next),s}function l(e,t){if(!e)return e;t||(t=e);var n,r=e;do{if(n=!1,r.steiner||!M(r,r.next)&&0!==Z(r.prev,r,r.next))r=r.next;else{if(z(r),(r=t=r.prev)===r.next)break;n=!0}}while(n||r!==t);return t}function c(e,t,n,r,o,i,s){if(e){!s&&i&&function(e,t,n,r){var o=e;do{null===o.z&&(o.z=m(o.x,o.y,t,n,r)),o.prevZ=o.prev,o.nextZ=o.next,o=o.next}while(o!==e);o.prevZ.nextZ=null,o.prevZ=null,function(e){var t,n,r,o,i,s,a,u,x=1;do{for(n=e,e=null,i=null,s=0;n;){for(s++,r=n,a=0,t=0;t<x&&(a++,r=r.nextZ);t++);for(u=x;a>0||u>0&&r;)0!==a&&(0===u||!r||n.z<=r.z)?(o=n,n=n.nextZ,a--):(o=r,r=r.nextZ,u--),i?i.nextZ=o:e=o,o.prevZ=i,i=o;n=r}i.nextZ=null,x*=2}while(s>1)}(o)}(e,r,o,i);for(var a,u,x=e;e.prev!==e.next;)if(a=e.prev,u=e.next,i?d(e,r,o,i):y(e))t.push(a.i/n),t.push(e.i/n),t.push(u.i/n),z(e),e=u.next,x=u.next;else if((e=u)===x){s?1===s?c(e=h(l(e),t,n),t,n,r,o,i,2):2===s&&v(e,t,n,r,o,i):c(l(e),t,n,r,o,i,1);break}}}function y(e){var t=e.prev,n=e,r=e.next;if(Z(t,n,r)>=0)return!1;for(var o=e.next.next;o!==e.prev;){if(A(t.x,t.y,n.x,n.y,r.x,r.y,o.x,o.y)&&Z(o.prev,o,o.next)>=0)return!1;o=o.next}return!0}function d(e,t,n,r){var o=e.prev,i=e,s=e.next;if(Z(o,i,s)>=0)return!1;for(var a=o.x<i.x?o.x<s.x?o.x:s.x:i.x<s.x?i.x:s.x,u=o.y<i.y?o.y<s.y?o.y:s.y:i.y<s.y?i.y:s.y,x=o.x>i.x?o.x>s.x?o.x:s.x:i.x>s.x?i.x:s.x,f=o.y>i.y?o.y>s.y?o.y:s.y:i.y>s.y?i.y:s.y,l=m(a,u,t,n,r),c=m(x,f,t,n,r),y=e.prevZ,d=e.nextZ;y&&y.z>=l&&d&&d.z<=c;){if(y!==e.prev&&y!==e.next&&A(o.x,o.y,i.x,i.y,s.x,s.y,y.x,y.y)&&Z(y.prev,y,y.next)>=0)return!1;if(y=y.prevZ,d!==e.prev&&d!==e.next&&A(o.x,o.y,i.x,i.y,s.x,s.y,d.x,d.y)&&Z(d.prev,d,d.next)>=0)return!1;d=d.nextZ}for(;y&&y.z>=l;){if(y!==e.prev&&y!==e.next&&A(o.x,o.y,i.x,i.y,s.x,s.y,y.x,y.y)&&Z(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;d&&d.z<=c;){if(d!==e.prev&&d!==e.next&&A(o.x,o.y,i.x,i.y,s.x,s.y,d.x,d.y)&&Z(d.prev,d,d.next)>=0)return!1;d=d.nextZ}return!0}function h(e,t,n){var r=e;do{var o=r.prev,i=r.next.next;!M(o,i)&&F(o,r,r.next,i)&&k(o,i)&&k(i,o)&&(t.push(o.i/n),t.push(r.i/n),t.push(i.i/n),z(r),z(r.next),r=e=i),r=r.next}while(r!==e);return l(r)}function v(e,t,n,r,o,i){var s=e;do{for(var a=s.next.next;a!==s.prev;){if(s.i!==a.i&&E(s,a)){var u=S(s,a);return s=l(s,s.next),u=l(u,u.next),c(s,t,n,r,o,i),void c(u,t,n,r,o,i)}a=a.next}s=s.next}while(s!==e)}function p(e,t){return e.x-t.x}function g(e,t){var n=function(e,t){var n,r=t,o=e.x,i=e.y,s=-1/0;do{if(i<=r.y&&i>=r.next.y&&r.next.y!==r.y){var a=r.x+(i-r.y)*(r.next.x-r.x)/(r.next.y-r.y);if(a<=o&&a>s){if(s=a,a===o){if(i===r.y)return r;if(i===r.next.y)return r.next}n=r.x<r.next.x?r:r.next}}r=r.next}while(r!==t);if(!n)return null;if(o===s)return n;var u,x=n,f=n.x,l=n.y,c=1/0;r=n;do{o>=r.x&&r.x>=f&&o!==r.x&&A(i<l?o:s,i,f,l,i<l?s:o,i,r.x,r.y)&&(u=Math.abs(i-r.y)/(o-r.x),k(r,e)&&(u<c||u===c&&(r.x>n.x||r.x===n.x&&b(n,r)))&&(n=r,c=u)),r=r.next}while(r!==x);return n}(e,t);if(!n)return t;var r=S(n,e),o=l(n,n.next);return l(r,r.next),t===n?o:t}function b(e,t){return Z(e.prev,e,t.prev)<0&&Z(t.next,e,e.next)<0}function m(e,t,n,r,o){return(e=1431655765&((e=858993459&((e=252645135&((e=16711935&((e=32767*(e-n)*o)|e<<8))|e<<4))|e<<2))|e<<1))|(t=1431655765&((t=858993459&((t=252645135&((t=16711935&((t=32767*(t-r)*o)|t<<8))|t<<4))|t<<2))|t<<1))<<1}function w(e){var t=e,n=e;do{(t.x<n.x||t.x===n.x&&t.y<n.y)&&(n=t),t=t.next}while(t!==e);return n}function A(e,t,n,r,o,i,s,a){return(o-s)*(t-a)-(e-s)*(i-a)>=0&&(e-s)*(r-a)-(n-s)*(t-a)>=0&&(n-s)*(i-a)-(o-s)*(r-a)>=0}function E(e,t){return e.next.i!==t.i&&e.prev.i!==t.i&&!function(e,t){var n=e;do{if(n.i!==e.i&&n.next.i!==e.i&&n.i!==t.i&&n.next.i!==t.i&&F(n,n.next,e,t))return!0;n=n.next}while(n!==e);return!1}(e,t)&&(k(e,t)&&k(t,e)&&function(e,t){var n=e,r=!1,o=(e.x+t.x)/2,i=(e.y+t.y)/2;do{n.y>i!=n.next.y>i&&n.next.y!==n.y&&o<(n.next.x-n.x)*(i-n.y)/(n.next.y-n.y)+n.x&&(r=!r),n=n.next}while(n!==e);return r}(e,t)&&(Z(e.prev,e,t.prev)||Z(e,t.prev,t))||M(e,t)&&Z(e.prev,e,e.next)>0&&Z(t.prev,t,t.next)>0)}function Z(e,t,n){return(t.y-e.y)*(n.x-t.x)-(t.x-e.x)*(n.y-t.y)}function M(e,t){return e.x===t.x&&e.y===t.y}function F(e,t,n,r){var o=I(Z(e,t,n)),i=I(Z(e,t,r)),s=I(Z(n,r,e)),a=I(Z(n,r,t));return o!==i&&s!==a||(!(0!==o||!T(e,n,t))||(!(0!==i||!T(e,r,t))||(!(0!==s||!T(n,e,r))||!(0!==a||!T(n,t,r)))))}function T(e,t,n){return t.x<=Math.max(e.x,n.x)&&t.x>=Math.min(e.x,n.x)&&t.y<=Math.max(e.y,n.y)&&t.y>=Math.min(e.y,n.y)}function I(e){return e>0?1:e<0?-1:0}function k(e,t){return Z(e.prev,e,e.next)<0?Z(e,t,e.next)>=0&&Z(e,e.prev,t)>=0:Z(e,t,e.prev)<0||Z(e,e.next,t)<0}function S(e,t){var n=new R(e.i,e.x,e.y),r=new R(t.i,t.x,t.y),o=e.next,i=t.prev;return e.next=t,t.prev=e,n.next=o,o.prev=n,r.next=n,n.prev=r,i.next=r,r.prev=i,r}function U(e,t,n,r){var o=new R(e,t,n);return r?(o.next=r.next,o.prev=r,r.next.prev=o,r.next=o):(o.prev=o,o.next=o),o}function z(e){e.next.prev=e.prev,e.prev.next=e.next,e.prevZ&&(e.prevZ.nextZ=e.nextZ),e.nextZ&&(e.nextZ.prevZ=e.prevZ)}function R(e,t,n){this.i=e,this.x=t,this.y=n,this.prev=null,this.next=null,this.z=null,this.prevZ=null,this.nextZ=null,this.steiner=!1}function B(e,t,n,r){for(var o=0,i=t,s=n-r;i<n;i+=r)o+=(e[s]-e[i])*(e[i+1]+e[s+1]),s=i;return o}u.exports=x,u.exports.default=x,x.deviation=function(e,t,n,r){var o=t&&t.length,i=o?t[0]*n:e.length,s=Math.abs(B(e,0,i,n));if(o)for(var a=0,u=t.length;a<u;a++){var x=t[a]*n,f=a<u-1?t[a+1]*n:e.length;s-=Math.abs(B(e,x,f,n))}var l=0;for(a=0;a<r.length;a+=3){var c=r[a]*n,y=r[a+1]*n,d=r[a+2]*n;l+=Math.abs((e[c]-e[d])*(e[y+1]-e[c+1])-(e[c]-e[y])*(e[d+1]-e[c+1]))}return 0===s&&0===l?0:Math.abs((l-s)/s)},x.flatten=function(e){for(var t=e[0][0].length,n={vertices:[],holes:[],dimensions:t},r=0,o=0;o<e.length;o++){for(var i=0;i<e[o].length;i++)for(var s=0;s<t;s++)n.vertices.push(e[o][i][s]);o>0&&(r+=e[o-1].length,n.holes.push(r))}return n};const P=[],C={vertexPosition:0,indexPosition:0};function N(e,t,n,r,o){e[t+0]=n,e[t+1]=r,e[t+2]=o}function _(e,t,n,r,o,i){const s=3+o,a=e[t+0],u=e[t+1],x=P;x.length=o;for(let n=0;n<x.length;n++)x[n]=e[t+2+n];let f=i?i.vertexPosition:0,l=i?i.indexPosition:0;const c=f/s;return N(n,f,a,u,0),x.length&&n.set(x,f+3),f+=s,N(n,f,a,u,1),x.length&&n.set(x,f+3),f+=s,N(n,f,a,u,2),x.length&&n.set(x,f+3),f+=s,N(n,f,a,u,3),x.length&&n.set(x,f+3),f+=s,r[l++]=c,r[l++]=c+1,r[l++]=c+3,r[l++]=c+1,r[l++]=c+2,r[l++]=c+3,C.vertexPosition=f,C.indexPosition=l,C}function L(e,t,n,r,o,i,a,u,x,f){const l=5+u.length,c=i.length/l,y=[e[t+0],e[t+1]],d=[e[n],e[n+1]],h=s(f,[...y]),v=s(f,[...d]);function p(e,t,n){const r=1e4;return Math.round(1500*t)+Math.round(1500*n)*r+e*r*r}function g(e,t,n){const r=Math.sqrt((t[0]-e[0])*(t[0]-e[0])+(t[1]-e[1])*(t[1]-e[1])),o=[(t[0]-e[0])/r,(t[1]-e[1])/r],i=[-o[1],o[0]],s=Math.sqrt((n[0]-e[0])*(n[0]-e[0])+(n[1]-e[1])*(n[1]-e[1])),a=[(n[0]-e[0])/s,(n[1]-e[1])/s],u=0===r||0===s?0:Math.acos((x=a[0]*o[0]+a[1]*o[1],f=-1,l=1,Math.min(Math.max(x,f),l)));var x,f,l;return a[0]*i[0]+a[1]*i[1]>0?u:2*Math.PI-u}const b=null!==o;let m=0,w=0;if(null!==r){m=g(h,v,s(f,[...[e[r],e[r+1]]]))}if(b){w=g(v,h,s(f,[...[e[o],e[o+1]]]))}i.push(y[0],y[1],d[0],d[1],p(0,m,w)),i.push(...u),i.push(y[0],y[1],d[0],d[1],p(1,m,w)),i.push(...u),i.push(y[0],y[1],d[0],d[1],p(2,m,w)),i.push(...u),i.push(y[0],y[1],d[0],d[1],p(3,m,w)),i.push(...u),a.push(c,c+1,c+2,c+1,c+3,c+2)}function G(e,t,n,r,o){const i=2+o;let s=t;const a=e.slice(s,s+o);s+=o;const x=e[s++];let f=0;const l=new Array(x-1);for(let t=0;t<x;t++)f+=e[s++],t<x-1&&(l[t]=f);const c=e.slice(s,s+2*f),y=u.exports(c,l,2);for(let e=0;e<y.length;e++)r.push(y[e]+n.length/i);for(let e=0;e<c.length;e+=2)n.push(c[e],c[e+1],...a);return s+2*f}const O=self;O.onmessage=r=>{const o=r.data;switch(o.type){case t:{const e=3,t=2,n=o.customAttributesCount,r=t+n,i=new Float32Array(o.renderInstructions),s=i.length/r,a=4*s*(n+e),u=new Uint32Array(6*s),x=new Float32Array(a);let f;for(let e=0;e<i.length;e+=r)f=_(i,e,x,u,n,f);const l=Object.assign({vertexBuffer:x.buffer,indexBuffer:u.buffer,renderInstructions:i.buffer},o);O.postMessage(l,[x.buffer,u.buffer,i.buffer]);break}case n:{const e=[],t=[],n=o.customAttributesCount,r=2,i=new Float32Array(o.renderInstructions);let s=0;const u=o.renderInstructionsTransform,x=[1,0,0,1,0,0];let f,l;for(a(x,u);s<i.length;){l=Array.from(i.slice(s,s+n)),s+=n,f=i[s++];for(let n=0;n<f-1;n++)L(i,s+n*r,s+(n+1)*r,n>0?s+(n-1)*r:null,n<f-2?s+(n+2)*r:null,e,t,l,0,x);s+=f*r}const c=Uint32Array.from(t),y=Float32Array.from(e),d=Object.assign({vertexBuffer:y.buffer,indexBuffer:c.buffer,renderInstructions:i.buffer},o);O.postMessage(d,[y.buffer,c.buffer,i.buffer]);break}case e:{const e=[],t=[],n=o.customAttributesCount,r=new Float32Array(o.renderInstructions);let i=0;for(;i<r.length;)i=G(r,i,e,t,n);const s=Uint32Array.from(t),a=Float32Array.from(e),u=Object.assign({vertexBuffer:a.buffer,indexBuffer:s.buffer,renderInstructions:r.buffer},o);O.postMessage(u,[a.buffer,s.buffer,r.buffer]);break}}};';
  return new Worker(typeof Blob === "undefined" ? "data:application/javascript;base64," + Buffer.from(source, "binary").toString("base64") : URL.createObjectURL(new Blob([source], { type: "application/javascript" })));
}
class WebGLPointsLayerRenderer extends WebGLLayerRenderer$1 {
  constructor(layer, options) {
    const uniforms = options.uniforms || {};
    const projectionMatrixTransform = create$2();
    uniforms[DefaultUniform.PROJECTION_MATRIX] = projectionMatrixTransform;
    super(layer, {
      uniforms,
      postProcesses: options.postProcesses
    });
    this.ready = false;
    this.sourceRevision_ = -1;
    this.verticesBuffer_ = new WebGLArrayBuffer$1(ARRAY_BUFFER, DYNAMIC_DRAW);
    this.hitVerticesBuffer_ = new WebGLArrayBuffer$1(ARRAY_BUFFER, DYNAMIC_DRAW);
    this.indicesBuffer_ = new WebGLArrayBuffer$1(
      ELEMENT_ARRAY_BUFFER,
      DYNAMIC_DRAW
    );
    this.vertexShader_ = options.vertexShader;
    this.fragmentShader_ = options.fragmentShader;
    this.program_;
    this.hitDetectionEnabled_ = options.hitFragmentShader && options.hitVertexShader ? true : false;
    this.hitVertexShader_ = options.hitVertexShader;
    this.hitFragmentShader_ = options.hitFragmentShader;
    this.hitProgram_;
    const customAttributes = options.attributes ? options.attributes.map(function(attribute) {
      return {
        name: "a_" + attribute.name,
        size: 1,
        type: AttributeType.FLOAT
      };
    }) : [];
    this.attributes = [
      {
        name: "a_position",
        size: 2,
        type: AttributeType.FLOAT
      },
      {
        name: "a_index",
        size: 1,
        type: AttributeType.FLOAT
      }
    ].concat(customAttributes);
    this.hitDetectionAttributes = [
      {
        name: "a_position",
        size: 2,
        type: AttributeType.FLOAT
      },
      {
        name: "a_index",
        size: 1,
        type: AttributeType.FLOAT
      },
      {
        name: "a_hitColor",
        size: 4,
        type: AttributeType.FLOAT
      },
      {
        name: "a_featureUid",
        size: 1,
        type: AttributeType.FLOAT
      }
    ].concat(customAttributes);
    this.customAttributes = options.attributes ? options.attributes : [];
    this.previousExtent_ = createEmpty();
    this.currentTransform_ = projectionMatrixTransform;
    this.renderTransform_ = create$2();
    this.invertRenderTransform_ = create$2();
    this.renderInstructions_ = new Float32Array(0);
    this.hitRenderInstructions_ = new Float32Array(0);
    this.hitRenderTarget_;
    this.generateBuffersRun_ = 0;
    this.worker_ = create();
    this.worker_.addEventListener(
      "message",
      function(event) {
        const received = event.data;
        if (received.type === WebGLWorkerMessageType.GENERATE_POINT_BUFFERS) {
          const projectionTransform = received.projectionTransform;
          if (received.hitDetection) {
            this.hitVerticesBuffer_.fromArrayBuffer(received.vertexBuffer);
            this.helper.flushBufferData(this.hitVerticesBuffer_);
          } else {
            this.verticesBuffer_.fromArrayBuffer(received.vertexBuffer);
            this.helper.flushBufferData(this.verticesBuffer_);
          }
          this.indicesBuffer_.fromArrayBuffer(received.indexBuffer);
          this.helper.flushBufferData(this.indicesBuffer_);
          this.renderTransform_ = projectionTransform;
          makeInverse(
            this.invertRenderTransform_,
            this.renderTransform_
          );
          if (received.hitDetection) {
            this.hitRenderInstructions_ = new Float32Array(
              event.data.renderInstructions
            );
          } else {
            this.renderInstructions_ = new Float32Array(
              event.data.renderInstructions
            );
            if (received.generateBuffersRun === this.generateBuffersRun_) {
              this.ready = true;
            }
          }
          this.getLayer().changed();
        }
      }.bind(this)
    );
    this.featureCache_ = {};
    this.featureCount_ = 0;
    const source = this.getLayer().getSource();
    this.sourceListenKeys_ = [
      listen(
        source,
        VectorEventType.ADDFEATURE,
        this.handleSourceFeatureAdded_,
        this
      ),
      listen(
        source,
        VectorEventType.CHANGEFEATURE,
        this.handleSourceFeatureChanged_,
        this
      ),
      listen(
        source,
        VectorEventType.REMOVEFEATURE,
        this.handleSourceFeatureDelete_,
        this
      ),
      listen(
        source,
        VectorEventType.CLEAR,
        this.handleSourceFeatureClear_,
        this
      )
    ];
    source.forEachFeature(
      function(feature2) {
        this.featureCache_[getUid(feature2)] = {
          feature: feature2,
          properties: feature2.getProperties(),
          geometry: feature2.getGeometry()
        };
        this.featureCount_++;
      }.bind(this)
    );
  }
  afterHelperCreated() {
    this.program_ = this.helper.getProgram(
      this.fragmentShader_,
      this.vertexShader_
    );
    if (this.hitDetectionEnabled_) {
      this.hitProgram_ = this.helper.getProgram(
        this.hitFragmentShader_,
        this.hitVertexShader_
      );
      this.hitRenderTarget_ = new WebGLRenderTarget$1(this.helper);
    }
  }
  handleSourceFeatureAdded_(event) {
    const feature2 = event.feature;
    this.featureCache_[getUid(feature2)] = {
      feature: feature2,
      properties: feature2.getProperties(),
      geometry: feature2.getGeometry()
    };
    this.featureCount_++;
  }
  handleSourceFeatureChanged_(event) {
    const feature2 = event.feature;
    this.featureCache_[getUid(feature2)] = {
      feature: feature2,
      properties: feature2.getProperties(),
      geometry: feature2.getGeometry()
    };
  }
  handleSourceFeatureDelete_(event) {
    const feature2 = event.feature;
    delete this.featureCache_[getUid(feature2)];
    this.featureCount_--;
  }
  handleSourceFeatureClear_() {
    this.featureCache_ = {};
    this.featureCount_ = 0;
  }
  renderFrame(frameState) {
    const gl = this.helper.getGL();
    this.preRender(gl, frameState);
    const projection = frameState.viewState.projection;
    const layer = this.getLayer();
    const vectorSource = layer.getSource();
    const multiWorld = vectorSource.getWrapX() && projection.canWrapX();
    const projectionExtent = projection.getExtent();
    const extent = frameState.extent;
    const worldWidth = multiWorld ? getWidth(projectionExtent) : null;
    const endWorld = multiWorld ? Math.ceil((extent[2] - projectionExtent[2]) / worldWidth) + 1 : 1;
    const startWorld = multiWorld ? Math.floor((extent[0] - projectionExtent[0]) / worldWidth) : 0;
    let world = startWorld;
    const renderCount = this.indicesBuffer_.getSize();
    do {
      this.helper.makeProjectionTransform(frameState, this.currentTransform_);
      translate$1(this.currentTransform_, world * worldWidth, 0);
      multiply(this.currentTransform_, this.invertRenderTransform_);
      this.helper.applyUniforms(frameState);
      this.helper.drawElements(0, renderCount);
    } while (++world < endWorld);
    this.helper.finalizeDraw(
      frameState,
      this.dispatchPreComposeEvent,
      this.dispatchPostComposeEvent
    );
    const canvas = this.helper.getCanvas();
    if (this.hitDetectionEnabled_) {
      this.renderHitDetection(frameState, startWorld, endWorld, worldWidth);
      this.hitRenderTarget_.clearCachedData();
    }
    this.postRender(gl, frameState);
    return canvas;
  }
  prepareFrameInternal(frameState) {
    const layer = this.getLayer();
    const vectorSource = layer.getSource();
    const viewState = frameState.viewState;
    const viewNotMoving = !frameState.viewHints[ViewHint.ANIMATING] && !frameState.viewHints[ViewHint.INTERACTING];
    const extentChanged = !equals$3(this.previousExtent_, frameState.extent);
    const sourceChanged = this.sourceRevision_ < vectorSource.getRevision();
    if (sourceChanged) {
      this.sourceRevision_ = vectorSource.getRevision();
    }
    if (viewNotMoving && (extentChanged || sourceChanged)) {
      const projection = viewState.projection;
      const resolution = viewState.resolution;
      const renderBuffer = layer instanceof BaseVectorLayer$1 ? layer.getRenderBuffer() : 0;
      const extent = buffer(frameState.extent, renderBuffer * resolution);
      vectorSource.loadFeatures(extent, resolution, projection);
      this.rebuildBuffers_(frameState);
      this.previousExtent_ = frameState.extent.slice();
    }
    this.helper.useProgram(this.program_, frameState);
    this.helper.prepareDraw(frameState);
    this.helper.bindBuffer(this.verticesBuffer_);
    this.helper.bindBuffer(this.indicesBuffer_);
    this.helper.enableAttributes(this.attributes);
    return true;
  }
  rebuildBuffers_(frameState) {
    const projectionTransform = create$2();
    this.helper.makeProjectionTransform(frameState, projectionTransform);
    const totalInstructionsCount = (2 + this.customAttributes.length) * this.featureCount_;
    if (!this.renderInstructions_ || this.renderInstructions_.length !== totalInstructionsCount) {
      this.renderInstructions_ = new Float32Array(totalInstructionsCount);
    }
    if (this.hitDetectionEnabled_) {
      const totalHitInstructionsCount = (7 + this.customAttributes.length) * this.featureCount_;
      if (!this.hitRenderInstructions_ || this.hitRenderInstructions_.length !== totalHitInstructionsCount) {
        this.hitRenderInstructions_ = new Float32Array(
          totalHitInstructionsCount
        );
      }
    }
    let featureCache, geometry;
    const tmpCoords = [];
    const tmpColor = [];
    let renderIndex = 0;
    let hitIndex = 0;
    let hitColor;
    for (const featureUid in this.featureCache_) {
      featureCache = this.featureCache_[featureUid];
      geometry = featureCache.geometry;
      if (!geometry || geometry.getType() !== "Point") {
        continue;
      }
      tmpCoords[0] = geometry.getFlatCoordinates()[0];
      tmpCoords[1] = geometry.getFlatCoordinates()[1];
      apply(projectionTransform, tmpCoords);
      hitColor = colorEncodeId(hitIndex + 6, tmpColor);
      this.renderInstructions_[renderIndex++] = tmpCoords[0];
      this.renderInstructions_[renderIndex++] = tmpCoords[1];
      if (this.hitDetectionEnabled_) {
        this.hitRenderInstructions_[hitIndex++] = tmpCoords[0];
        this.hitRenderInstructions_[hitIndex++] = tmpCoords[1];
        this.hitRenderInstructions_[hitIndex++] = hitColor[0];
        this.hitRenderInstructions_[hitIndex++] = hitColor[1];
        this.hitRenderInstructions_[hitIndex++] = hitColor[2];
        this.hitRenderInstructions_[hitIndex++] = hitColor[3];
        this.hitRenderInstructions_[hitIndex++] = Number(featureUid);
      }
      let value;
      for (let j = 0; j < this.customAttributes.length; j++) {
        value = this.customAttributes[j].callback(
          featureCache.feature,
          featureCache.properties
        );
        this.renderInstructions_[renderIndex++] = value;
        if (this.hitDetectionEnabled_) {
          this.hitRenderInstructions_[hitIndex++] = value;
        }
      }
    }
    const message = {
      id: 0,
      type: WebGLWorkerMessageType.GENERATE_POINT_BUFFERS,
      renderInstructions: this.renderInstructions_.buffer,
      customAttributesCount: this.customAttributes.length
    };
    message["projectionTransform"] = projectionTransform;
    message["generateBuffersRun"] = ++this.generateBuffersRun_;
    this.ready = false;
    this.worker_.postMessage(message, [this.renderInstructions_.buffer]);
    this.renderInstructions_ = null;
    if (this.hitDetectionEnabled_) {
      const hitMessage = {
        id: 0,
        type: WebGLWorkerMessageType.GENERATE_POINT_BUFFERS,
        renderInstructions: this.hitRenderInstructions_.buffer,
        customAttributesCount: 5 + this.customAttributes.length
      };
      hitMessage["projectionTransform"] = projectionTransform;
      hitMessage["hitDetection"] = true;
      this.worker_.postMessage(hitMessage, [
        this.hitRenderInstructions_.buffer
      ]);
      this.hitRenderInstructions_ = null;
    }
  }
  forEachFeatureAtCoordinate(coordinate, frameState, hitTolerance, callback, matches) {
    assert(this.hitDetectionEnabled_, 66);
    if (!this.hitRenderInstructions_) {
      return void 0;
    }
    const pixel = apply(
      frameState.coordinateToPixelTransform,
      coordinate.slice()
    );
    const data = this.hitRenderTarget_.readPixel(pixel[0] / 2, pixel[1] / 2);
    const color = [data[0] / 255, data[1] / 255, data[2] / 255, data[3] / 255];
    const index2 = colorDecodeId(color);
    const opacity = this.hitRenderInstructions_[index2];
    const uid = Math.floor(opacity).toString();
    const source = this.getLayer().getSource();
    const feature2 = source.getFeatureByUid(uid);
    if (feature2) {
      return callback(feature2, this.getLayer(), null);
    }
    return void 0;
  }
  renderHitDetection(frameState, startWorld, endWorld, worldWidth) {
    if (!this.hitVerticesBuffer_.getSize()) {
      return;
    }
    let world = startWorld;
    this.hitRenderTarget_.setSize([
      Math.floor(frameState.size[0] / 2),
      Math.floor(frameState.size[1] / 2)
    ]);
    this.helper.useProgram(this.hitProgram_, frameState);
    this.helper.prepareDrawToRenderTarget(
      frameState,
      this.hitRenderTarget_,
      true
    );
    this.helper.bindBuffer(this.hitVerticesBuffer_);
    this.helper.bindBuffer(this.indicesBuffer_);
    this.helper.enableAttributes(this.hitDetectionAttributes);
    do {
      this.helper.makeProjectionTransform(frameState, this.currentTransform_);
      translate$1(this.currentTransform_, world * worldWidth, 0);
      multiply(this.currentTransform_, this.invertRenderTransform_);
      this.helper.applyUniforms(frameState);
      const renderCount = this.indicesBuffer_.getSize();
      this.helper.drawElements(0, renderCount);
    } while (++world < endWorld);
  }
  disposeInternal() {
    this.worker_.terminate();
    this.layer_ = null;
    this.sourceListenKeys_.forEach(function(key) {
      unlistenByKey(key);
    });
    this.sourceListenKeys_ = null;
    super.disposeInternal();
  }
}
const WebGLPointsLayerRenderer$1 = WebGLPointsLayerRenderer;
const Property$1 = {
  BLUR: "blur",
  GRADIENT: "gradient",
  RADIUS: "radius"
};
const DEFAULT_GRADIENT = ["#00f", "#0ff", "#0f0", "#ff0", "#f00"];
class Heatmap extends BaseVectorLayer$1 {
  constructor(options) {
    options = options ? options : {};
    const baseOptions = Object.assign({}, options);
    delete baseOptions.gradient;
    delete baseOptions.radius;
    delete baseOptions.blur;
    delete baseOptions.weight;
    super(baseOptions);
    this.gradient_ = null;
    this.addChangeListener(Property$1.GRADIENT, this.handleGradientChanged_);
    this.setGradient(options.gradient ? options.gradient : DEFAULT_GRADIENT);
    this.setBlur(options.blur !== void 0 ? options.blur : 15);
    this.setRadius(options.radius !== void 0 ? options.radius : 8);
    const weight = options.weight ? options.weight : "weight";
    if (typeof weight === "string") {
      this.weightFunction_ = function(feature2) {
        return feature2.get(weight);
      };
    } else {
      this.weightFunction_ = weight;
    }
    this.setRenderOrder(null);
  }
  getBlur() {
    return this.get(Property$1.BLUR);
  }
  getGradient() {
    return this.get(Property$1.GRADIENT);
  }
  getRadius() {
    return this.get(Property$1.RADIUS);
  }
  handleGradientChanged_() {
    this.gradient_ = createGradient(this.getGradient());
  }
  setBlur(blur) {
    this.set(Property$1.BLUR, blur);
  }
  setGradient(colors) {
    this.set(Property$1.GRADIENT, colors);
  }
  setRadius(radius) {
    this.set(Property$1.RADIUS, radius);
  }
  createRenderer() {
    return new WebGLPointsLayerRenderer$1(this, {
      className: this.getClassName(),
      attributes: [
        {
          name: "weight",
          callback: function(feature2) {
            const weight = this.weightFunction_(feature2);
            return weight !== void 0 ? clamp(weight, 0, 1) : 1;
          }.bind(this)
        }
      ],
      vertexShader: `
        precision mediump float;
        uniform mat4 u_projectionMatrix;
        uniform mat4 u_offsetScaleMatrix;
        uniform float u_size;
        attribute vec2 a_position;
        attribute float a_index;
        attribute float a_weight;

        varying vec2 v_texCoord;
        varying float v_weight;

        void main(void) {
          mat4 offsetMatrix = u_offsetScaleMatrix;
          float offsetX = a_index == 0.0 || a_index == 3.0 ? -u_size / 2.0 : u_size / 2.0;
          float offsetY = a_index == 0.0 || a_index == 1.0 ? -u_size / 2.0 : u_size / 2.0;
          vec4 offsets = offsetMatrix * vec4(offsetX, offsetY, 0.0, 0.0);
          gl_Position = u_projectionMatrix * vec4(a_position, 0.0, 1.0) + offsets;
          float u = a_index == 0.0 || a_index == 3.0 ? 0.0 : 1.0;
          float v = a_index == 0.0 || a_index == 1.0 ? 0.0 : 1.0;
          v_texCoord = vec2(u, v);
          v_weight = a_weight;
        }`,
      fragmentShader: `
        precision mediump float;
        uniform float u_blurSlope;

        varying vec2 v_texCoord;
        varying float v_weight;

        void main(void) {
          vec2 texCoord = v_texCoord * 2.0 - vec2(1.0, 1.0);
          float sqRadius = texCoord.x * texCoord.x + texCoord.y * texCoord.y;
          float value = (1.0 - sqrt(sqRadius)) * u_blurSlope;
          float alpha = smoothstep(0.0, 1.0, value) * v_weight;
          gl_FragColor = vec4(alpha, alpha, alpha, alpha);
        }`,
      hitVertexShader: `
        precision mediump float;
        uniform mat4 u_projectionMatrix;
        uniform mat4 u_offsetScaleMatrix;
        uniform float u_size;
        attribute vec2 a_position;
        attribute float a_index;
        attribute float a_weight;
        attribute vec4 a_hitColor;

        varying vec2 v_texCoord;
        varying float v_weight;
        varying vec4 v_hitColor;

        void main(void) {
          mat4 offsetMatrix = u_offsetScaleMatrix;
          float offsetX = a_index == 0.0 || a_index == 3.0 ? -u_size / 2.0 : u_size / 2.0;
          float offsetY = a_index == 0.0 || a_index == 1.0 ? -u_size / 2.0 : u_size / 2.0;
          vec4 offsets = offsetMatrix * vec4(offsetX, offsetY, 0.0, 0.0);
          gl_Position = u_projectionMatrix * vec4(a_position, 0.0, 1.0) + offsets;
          float u = a_index == 0.0 || a_index == 3.0 ? 0.0 : 1.0;
          float v = a_index == 0.0 || a_index == 1.0 ? 0.0 : 1.0;
          v_texCoord = vec2(u, v);
          v_hitColor = a_hitColor;
          v_weight = a_weight;
        }`,
      hitFragmentShader: `
        precision mediump float;
        uniform float u_blurSlope;

        varying vec2 v_texCoord;
        varying float v_weight;
        varying vec4 v_hitColor;

        void main(void) {
          vec2 texCoord = v_texCoord * 2.0 - vec2(1.0, 1.0);
          float sqRadius = texCoord.x * texCoord.x + texCoord.y * texCoord.y;
          float value = (1.0 - sqrt(sqRadius)) * u_blurSlope;
          float alpha = smoothstep(0.0, 1.0, value) * v_weight;
          if (alpha < 0.05) {
            discard;
          }

          gl_FragColor = v_hitColor;
        }`,
      uniforms: {
        u_size: function() {
          return (this.get(Property$1.RADIUS) + this.get(Property$1.BLUR)) * 2;
        }.bind(this),
        u_blurSlope: function() {
          return this.get(Property$1.RADIUS) / Math.max(1, this.get(Property$1.BLUR));
        }.bind(this)
      },
      postProcesses: [
        {
          fragmentShader: `
            precision mediump float;

            uniform sampler2D u_image;
            uniform sampler2D u_gradientTexture;
            uniform float u_opacity;

            varying vec2 v_texCoord;

            void main() {
              vec4 color = texture2D(u_image, v_texCoord);
              gl_FragColor.a = color.a * u_opacity;
              gl_FragColor.rgb = texture2D(u_gradientTexture, vec2(0.5, color.a)).rgb;
              gl_FragColor.rgb *= gl_FragColor.a;
            }`,
          uniforms: {
            u_gradientTexture: function() {
              return this.gradient_;
            }.bind(this),
            u_opacity: function() {
              return this.getOpacity();
            }.bind(this)
          }
        }
      ]
    });
  }
  renderDeclutter() {
  }
}
function createGradient(colors) {
  const width = 1;
  const height = 256;
  const context = createCanvasContext2D(width, height);
  const gradient = context.createLinearGradient(0, 0, width, height);
  const step = 1 / (colors.length - 1);
  for (let i = 0, ii = colors.length; i < ii; ++i) {
    gradient.addColorStop(i * step, colors[i]);
  }
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);
  return context.canvas;
}
const HeatMapLayer = Heatmap;
class MapRenderer extends Disposable$1 {
  constructor(map) {
    super();
    this.map_ = map;
  }
  dispatchRenderEvent(type, frameState) {
    abstract();
  }
  calculateMatrices2D(frameState) {
    const viewState = frameState.viewState;
    const coordinateToPixelTransform = frameState.coordinateToPixelTransform;
    const pixelToCoordinateTransform = frameState.pixelToCoordinateTransform;
    compose(
      coordinateToPixelTransform,
      frameState.size[0] / 2,
      frameState.size[1] / 2,
      1 / viewState.resolution,
      -1 / viewState.resolution,
      -viewState.rotation,
      -viewState.center[0],
      -viewState.center[1]
    );
    makeInverse(pixelToCoordinateTransform, coordinateToPixelTransform);
  }
  forEachFeatureAtCoordinate(coordinate, frameState, hitTolerance, checkWrapped, callback, thisArg, layerFilter, thisArg2) {
    let result;
    const viewState = frameState.viewState;
    function forEachFeatureAtCoordinate(managed, feature2, layer, geometry) {
      return callback.call(thisArg, feature2, managed ? layer : null, geometry);
    }
    const projection = viewState.projection;
    const translatedCoordinate = wrapX$1(coordinate.slice(), projection);
    const offsets = [[0, 0]];
    if (projection.canWrapX() && checkWrapped) {
      const projectionExtent = projection.getExtent();
      const worldWidth = getWidth(projectionExtent);
      offsets.push([-worldWidth, 0], [worldWidth, 0]);
    }
    const layerStates = frameState.layerStatesArray;
    const numLayers = layerStates.length;
    const matches = [];
    const tmpCoord = [];
    for (let i = 0; i < offsets.length; i++) {
      for (let j = numLayers - 1; j >= 0; --j) {
        const layerState = layerStates[j];
        const layer = layerState.layer;
        if (layer.hasRenderer() && inView(layerState, viewState) && layerFilter.call(thisArg2, layer)) {
          const layerRenderer = layer.getRenderer();
          const source = layer.getSource();
          if (layerRenderer && source) {
            const coordinates2 = source.getWrapX() ? translatedCoordinate : coordinate;
            const callback2 = forEachFeatureAtCoordinate.bind(
              null,
              layerState.managed
            );
            tmpCoord[0] = coordinates2[0] + offsets[i][0];
            tmpCoord[1] = coordinates2[1] + offsets[i][1];
            result = layerRenderer.forEachFeatureAtCoordinate(
              tmpCoord,
              frameState,
              hitTolerance,
              callback2,
              matches
            );
          }
          if (result) {
            return result;
          }
        }
      }
    }
    if (matches.length === 0) {
      return void 0;
    }
    const order = 1 / matches.length;
    matches.forEach((m, i) => m.distanceSq += i * order);
    matches.sort((a, b) => a.distanceSq - b.distanceSq);
    matches.some((m) => {
      return result = m.callback(m.feature, m.layer, m.geometry);
    });
    return result;
  }
  hasFeatureAtCoordinate(coordinate, frameState, hitTolerance, checkWrapped, layerFilter, thisArg) {
    const hasFeature = this.forEachFeatureAtCoordinate(
      coordinate,
      frameState,
      hitTolerance,
      checkWrapped,
      TRUE,
      this,
      layerFilter,
      thisArg
    );
    return hasFeature !== void 0;
  }
  getMap() {
    return this.map_;
  }
  renderFrame(frameState) {
    abstract();
  }
  scheduleExpireIconCache(frameState) {
    if (shared.canExpireCache()) {
      frameState.postRenderFunctions.push(expireIconCache);
    }
  }
}
function expireIconCache(map, frameState) {
  shared.expire();
}
const MapRenderer$1 = MapRenderer;
class CompositeMapRenderer extends MapRenderer$1 {
  constructor(map) {
    super(map);
    this.fontChangeListenerKey_ = listen(
      checkedFonts,
      ObjectEventType.PROPERTYCHANGE,
      map.redrawText.bind(map)
    );
    this.element_ = document.createElement("div");
    const style = this.element_.style;
    style.position = "absolute";
    style.width = "100%";
    style.height = "100%";
    style.zIndex = "0";
    this.element_.className = CLASS_UNSELECTABLE + " ol-layers";
    const container = map.getViewport();
    container.insertBefore(this.element_, container.firstChild || null);
    this.children_ = [];
    this.renderedVisible_ = true;
  }
  dispatchRenderEvent(type, frameState) {
    const map = this.getMap();
    if (map.hasListener(type)) {
      const event = new RenderEvent$1(type, void 0, frameState);
      map.dispatchEvent(event);
    }
  }
  disposeInternal() {
    unlistenByKey(this.fontChangeListenerKey_);
    this.element_.parentNode.removeChild(this.element_);
    super.disposeInternal();
  }
  renderFrame(frameState) {
    if (!frameState) {
      if (this.renderedVisible_) {
        this.element_.style.display = "none";
        this.renderedVisible_ = false;
      }
      return;
    }
    this.calculateMatrices2D(frameState);
    this.dispatchRenderEvent(RenderEventType.PRECOMPOSE, frameState);
    const layerStatesArray = frameState.layerStatesArray.sort(function(a, b) {
      return a.zIndex - b.zIndex;
    });
    const viewState = frameState.viewState;
    this.children_.length = 0;
    const declutterLayers = [];
    let previousElement = null;
    for (let i = 0, ii = layerStatesArray.length; i < ii; ++i) {
      const layerState = layerStatesArray[i];
      frameState.layerIndex = i;
      const layer = layerState.layer;
      const sourceState = layer.getSourceState();
      if (!inView(layerState, viewState) || sourceState != "ready" && sourceState != "undefined") {
        layer.unrender();
        continue;
      }
      const element = layer.render(frameState, previousElement);
      if (!element) {
        continue;
      }
      if (element !== previousElement) {
        this.children_.push(element);
        previousElement = element;
      }
      if ("getDeclutter" in layer) {
        declutterLayers.push(
          layer
        );
      }
    }
    for (let i = declutterLayers.length - 1; i >= 0; --i) {
      declutterLayers[i].renderDeclutter(frameState);
    }
    replaceChildren(this.element_, this.children_);
    this.dispatchRenderEvent(RenderEventType.POSTCOMPOSE, frameState);
    if (!this.renderedVisible_) {
      this.element_.style.display = "";
      this.renderedVisible_ = true;
    }
    this.scheduleExpireIconCache(frameState);
  }
}
const CompositeMapRenderer$1 = CompositeMapRenderer;
const PointerEventType = {
  POINTERMOVE: "pointermove",
  POINTERDOWN: "pointerdown",
  POINTERUP: "pointerup",
  POINTEROVER: "pointerover",
  POINTEROUT: "pointerout",
  POINTERENTER: "pointerenter",
  POINTERLEAVE: "pointerleave",
  POINTERCANCEL: "pointercancel"
};
class MapBrowserEventHandler extends EventTarget {
  constructor(map, moveTolerance) {
    super(map);
    this.map_ = map;
    this.clickTimeoutId_;
    this.emulateClicks_ = false;
    this.dragging_ = false;
    this.dragListenerKeys_ = [];
    this.moveTolerance_ = moveTolerance === void 0 ? 1 : moveTolerance;
    this.down_ = null;
    const element = this.map_.getViewport();
    this.activePointers_ = [];
    this.trackedTouches_ = {};
    this.element_ = element;
    this.pointerdownListenerKey_ = listen(
      element,
      PointerEventType.POINTERDOWN,
      this.handlePointerDown_,
      this
    );
    this.originalPointerMoveEvent_;
    this.relayedListenerKey_ = listen(
      element,
      PointerEventType.POINTERMOVE,
      this.relayMoveEvent_,
      this
    );
    this.boundHandleTouchMove_ = this.handleTouchMove_.bind(this);
    this.element_.addEventListener(
      EventType.TOUCHMOVE,
      this.boundHandleTouchMove_,
      PASSIVE_EVENT_LISTENERS ? { passive: false } : false
    );
  }
  emulateClick_(pointerEvent) {
    let newEvent = new MapBrowserEvent$1(
      MapBrowserEventType.CLICK,
      this.map_,
      pointerEvent
    );
    this.dispatchEvent(newEvent);
    if (this.clickTimeoutId_ !== void 0) {
      clearTimeout(this.clickTimeoutId_);
      this.clickTimeoutId_ = void 0;
      newEvent = new MapBrowserEvent$1(
        MapBrowserEventType.DBLCLICK,
        this.map_,
        pointerEvent
      );
      this.dispatchEvent(newEvent);
    } else {
      this.clickTimeoutId_ = setTimeout(
        function() {
          this.clickTimeoutId_ = void 0;
          const newEvent2 = new MapBrowserEvent$1(
            MapBrowserEventType.SINGLECLICK,
            this.map_,
            pointerEvent
          );
          this.dispatchEvent(newEvent2);
        }.bind(this),
        250
      );
    }
  }
  updateActivePointers_(pointerEvent) {
    const event = pointerEvent;
    const id = event.pointerId;
    if (event.type == MapBrowserEventType.POINTERUP || event.type == MapBrowserEventType.POINTERCANCEL) {
      delete this.trackedTouches_[id];
      for (const pointerId in this.trackedTouches_) {
        if (this.trackedTouches_[pointerId].target !== event.target) {
          delete this.trackedTouches_[pointerId];
          break;
        }
      }
    } else if (event.type == MapBrowserEventType.POINTERDOWN || event.type == MapBrowserEventType.POINTERMOVE) {
      this.trackedTouches_[id] = event;
    }
    this.activePointers_ = Object.values(this.trackedTouches_);
  }
  handlePointerUp_(pointerEvent) {
    this.updateActivePointers_(pointerEvent);
    const newEvent = new MapBrowserEvent$1(
      MapBrowserEventType.POINTERUP,
      this.map_,
      pointerEvent,
      void 0,
      void 0,
      this.activePointers_
    );
    this.dispatchEvent(newEvent);
    if (this.emulateClicks_ && !newEvent.defaultPrevented && !this.dragging_ && this.isMouseActionButton_(pointerEvent)) {
      this.emulateClick_(this.down_);
    }
    if (this.activePointers_.length === 0) {
      this.dragListenerKeys_.forEach(unlistenByKey);
      this.dragListenerKeys_.length = 0;
      this.dragging_ = false;
      this.down_ = null;
    }
  }
  isMouseActionButton_(pointerEvent) {
    return pointerEvent.button === 0;
  }
  handlePointerDown_(pointerEvent) {
    this.emulateClicks_ = this.activePointers_.length === 0;
    this.updateActivePointers_(pointerEvent);
    const newEvent = new MapBrowserEvent$1(
      MapBrowserEventType.POINTERDOWN,
      this.map_,
      pointerEvent,
      void 0,
      void 0,
      this.activePointers_
    );
    this.dispatchEvent(newEvent);
    this.down_ = {};
    for (const property in pointerEvent) {
      const value = pointerEvent[property];
      this.down_[property] = typeof value === "function" ? VOID : value;
    }
    if (this.dragListenerKeys_.length === 0) {
      const doc = this.map_.getOwnerDocument();
      this.dragListenerKeys_.push(
        listen(
          doc,
          MapBrowserEventType.POINTERMOVE,
          this.handlePointerMove_,
          this
        ),
        listen(doc, MapBrowserEventType.POINTERUP, this.handlePointerUp_, this),
        listen(
          this.element_,
          MapBrowserEventType.POINTERCANCEL,
          this.handlePointerUp_,
          this
        )
      );
      if (this.element_.getRootNode && this.element_.getRootNode() !== doc) {
        this.dragListenerKeys_.push(
          listen(
            this.element_.getRootNode(),
            MapBrowserEventType.POINTERUP,
            this.handlePointerUp_,
            this
          )
        );
      }
    }
  }
  handlePointerMove_(pointerEvent) {
    if (this.isMoving_(pointerEvent)) {
      this.updateActivePointers_(pointerEvent);
      this.dragging_ = true;
      const newEvent = new MapBrowserEvent$1(
        MapBrowserEventType.POINTERDRAG,
        this.map_,
        pointerEvent,
        this.dragging_,
        void 0,
        this.activePointers_
      );
      this.dispatchEvent(newEvent);
    }
  }
  relayMoveEvent_(pointerEvent) {
    this.originalPointerMoveEvent_ = pointerEvent;
    const dragging = !!(this.down_ && this.isMoving_(pointerEvent));
    this.dispatchEvent(
      new MapBrowserEvent$1(
        MapBrowserEventType.POINTERMOVE,
        this.map_,
        pointerEvent,
        dragging
      )
    );
  }
  handleTouchMove_(event) {
    const originalEvent = this.originalPointerMoveEvent_;
    if ((!originalEvent || originalEvent.defaultPrevented) && (typeof event.cancelable !== "boolean" || event.cancelable === true)) {
      event.preventDefault();
    }
  }
  isMoving_(pointerEvent) {
    return this.dragging_ || Math.abs(pointerEvent.clientX - this.down_.clientX) > this.moveTolerance_ || Math.abs(pointerEvent.clientY - this.down_.clientY) > this.moveTolerance_;
  }
  disposeInternal() {
    if (this.relayedListenerKey_) {
      unlistenByKey(this.relayedListenerKey_);
      this.relayedListenerKey_ = null;
    }
    this.element_.removeEventListener(
      EventType.TOUCHMOVE,
      this.boundHandleTouchMove_
    );
    if (this.pointerdownListenerKey_) {
      unlistenByKey(this.pointerdownListenerKey_);
      this.pointerdownListenerKey_ = null;
    }
    this.dragListenerKeys_.forEach(unlistenByKey);
    this.dragListenerKeys_.length = 0;
    this.element_ = null;
    super.disposeInternal();
  }
}
const MapBrowserEventHandler$1 = MapBrowserEventHandler;
const MapProperty = {
  LAYERGROUP: "layergroup",
  SIZE: "size",
  TARGET: "target",
  VIEW: "view"
};
const ViewProperty = {
  CENTER: "center",
  RESOLUTION: "resolution",
  ROTATION: "rotation"
};
function createExtent(extent, onlyCenter, smooth) {
  return function(center, resolution, size, isMoving, centerShift) {
    if (!center) {
      return void 0;
    }
    if (!resolution && !onlyCenter) {
      return center;
    }
    const viewWidth = onlyCenter ? 0 : size[0] * resolution;
    const viewHeight = onlyCenter ? 0 : size[1] * resolution;
    const shiftX = centerShift ? centerShift[0] : 0;
    const shiftY = centerShift ? centerShift[1] : 0;
    let minX = extent[0] + viewWidth / 2 + shiftX;
    let maxX = extent[2] - viewWidth / 2 + shiftX;
    let minY = extent[1] + viewHeight / 2 + shiftY;
    let maxY = extent[3] - viewHeight / 2 + shiftY;
    if (minX > maxX) {
      minX = (maxX + minX) / 2;
      maxX = minX;
    }
    if (minY > maxY) {
      minY = (maxY + minY) / 2;
      maxY = minY;
    }
    let x = clamp(center[0], minX, maxX);
    let y = clamp(center[1], minY, maxY);
    if (isMoving && smooth && resolution) {
      const ratio = 30 * resolution;
      x += -ratio * Math.log(1 + Math.max(0, minX - center[0]) / ratio) + ratio * Math.log(1 + Math.max(0, center[0] - maxX) / ratio);
      y += -ratio * Math.log(1 + Math.max(0, minY - center[1]) / ratio) + ratio * Math.log(1 + Math.max(0, center[1] - maxY) / ratio);
    }
    return [x, y];
  };
}
function none(center) {
  return center;
}
function getViewportClampedResolution(resolution, maxExtent, viewportSize, showFullExtent) {
  const xResolution = getWidth(maxExtent) / viewportSize[0];
  const yResolution = getHeight(maxExtent) / viewportSize[1];
  if (showFullExtent) {
    return Math.min(resolution, Math.max(xResolution, yResolution));
  }
  return Math.min(resolution, Math.min(xResolution, yResolution));
}
function getSmoothClampedResolution(resolution, maxResolution, minResolution) {
  let result = Math.min(resolution, maxResolution);
  const ratio = 50;
  result *= Math.log(1 + ratio * Math.max(0, resolution / maxResolution - 1)) / ratio + 1;
  if (minResolution) {
    result = Math.max(result, minResolution);
    result /= Math.log(1 + ratio * Math.max(0, minResolution / resolution - 1)) / ratio + 1;
  }
  return clamp(result, minResolution / 2, maxResolution * 2);
}
function createSnapToResolutions(resolutions, smooth, maxExtent, showFullExtent) {
  smooth = smooth !== void 0 ? smooth : true;
  return function(resolution, direction, size, isMoving) {
    if (resolution !== void 0) {
      const maxResolution = resolutions[0];
      const minResolution = resolutions[resolutions.length - 1];
      const cappedMaxRes = maxExtent ? getViewportClampedResolution(
        maxResolution,
        maxExtent,
        size,
        showFullExtent
      ) : maxResolution;
      if (isMoving) {
        if (!smooth) {
          return clamp(resolution, minResolution, cappedMaxRes);
        }
        return getSmoothClampedResolution(
          resolution,
          cappedMaxRes,
          minResolution
        );
      }
      const capped = Math.min(cappedMaxRes, resolution);
      const z = Math.floor(linearFindNearest(resolutions, capped, direction));
      if (resolutions[z] > cappedMaxRes && z < resolutions.length - 1) {
        return resolutions[z + 1];
      }
      return resolutions[z];
    } else {
      return void 0;
    }
  };
}
function createSnapToPower(power, maxResolution, minResolution, smooth, maxExtent, showFullExtent) {
  smooth = smooth !== void 0 ? smooth : true;
  minResolution = minResolution !== void 0 ? minResolution : 0;
  return function(resolution, direction, size, isMoving) {
    if (resolution !== void 0) {
      const cappedMaxRes = maxExtent ? getViewportClampedResolution(
        maxResolution,
        maxExtent,
        size,
        showFullExtent
      ) : maxResolution;
      if (isMoving) {
        if (!smooth) {
          return clamp(resolution, minResolution, cappedMaxRes);
        }
        return getSmoothClampedResolution(
          resolution,
          cappedMaxRes,
          minResolution
        );
      }
      const tolerance = 1e-9;
      const minZoomLevel = Math.ceil(
        Math.log(maxResolution / cappedMaxRes) / Math.log(power) - tolerance
      );
      const offset = -direction * (0.5 - tolerance) + 0.5;
      const capped = Math.min(cappedMaxRes, resolution);
      const cappedZoomLevel = Math.floor(
        Math.log(maxResolution / capped) / Math.log(power) + offset
      );
      const zoomLevel = Math.max(minZoomLevel, cappedZoomLevel);
      const newResolution = maxResolution / Math.pow(power, zoomLevel);
      return clamp(newResolution, minResolution, cappedMaxRes);
    } else {
      return void 0;
    }
  };
}
function createMinMaxResolution(maxResolution, minResolution, smooth, maxExtent, showFullExtent) {
  smooth = smooth !== void 0 ? smooth : true;
  return function(resolution, direction, size, isMoving) {
    if (resolution !== void 0) {
      const cappedMaxRes = maxExtent ? getViewportClampedResolution(
        maxResolution,
        maxExtent,
        size,
        showFullExtent
      ) : maxResolution;
      if (!smooth || !isMoving) {
        return clamp(resolution, minResolution, cappedMaxRes);
      }
      return getSmoothClampedResolution(
        resolution,
        cappedMaxRes,
        minResolution
      );
    } else {
      return void 0;
    }
  };
}
const DEFAULT_MIN_ZOOM = 0;
class View extends BaseObject$1 {
  constructor(options) {
    super();
    this.on;
    this.once;
    this.un;
    options = Object.assign({}, options);
    this.hints_ = [0, 0];
    this.animations_ = [];
    this.updateAnimationKey_;
    this.projection_ = createProjection(options.projection, "EPSG:3857");
    this.viewportSize_ = [100, 100];
    this.targetCenter_ = null;
    this.targetResolution_;
    this.targetRotation_;
    this.nextCenter_ = null;
    this.nextResolution_;
    this.nextRotation_;
    this.cancelAnchor_ = void 0;
    if (options.projection) {
      disableCoordinateWarning();
    }
    if (options.center) {
      options.center = fromUserCoordinate(options.center, this.projection_);
    }
    if (options.extent) {
      options.extent = fromUserExtent(options.extent, this.projection_);
    }
    this.applyOptions_(options);
  }
  applyOptions_(options) {
    const properties = Object.assign({}, options);
    for (const key in ViewProperty) {
      delete properties[key];
    }
    this.setProperties(properties, true);
    const resolutionConstraintInfo = createResolutionConstraint(options);
    this.maxResolution_ = resolutionConstraintInfo.maxResolution;
    this.minResolution_ = resolutionConstraintInfo.minResolution;
    this.zoomFactor_ = resolutionConstraintInfo.zoomFactor;
    this.resolutions_ = options.resolutions;
    this.padding_ = options.padding;
    this.minZoom_ = resolutionConstraintInfo.minZoom;
    const centerConstraint = createCenterConstraint(options);
    const resolutionConstraint = resolutionConstraintInfo.constraint;
    const rotationConstraint = createRotationConstraint(options);
    this.constraints_ = {
      center: centerConstraint,
      resolution: resolutionConstraint,
      rotation: rotationConstraint
    };
    this.setRotation(options.rotation !== void 0 ? options.rotation : 0);
    this.setCenterInternal(
      options.center !== void 0 ? options.center : null
    );
    if (options.resolution !== void 0) {
      this.setResolution(options.resolution);
    } else if (options.zoom !== void 0) {
      this.setZoom(options.zoom);
    }
  }
  get padding() {
    return this.padding_;
  }
  set padding(padding) {
    let oldPadding = this.padding_;
    this.padding_ = padding;
    const center = this.getCenter();
    if (center) {
      const newPadding = padding || [0, 0, 0, 0];
      oldPadding = oldPadding || [0, 0, 0, 0];
      const resolution = this.getResolution();
      const offsetX = resolution / 2 * (newPadding[3] - oldPadding[3] + oldPadding[1] - newPadding[1]);
      const offsetY = resolution / 2 * (newPadding[0] - oldPadding[0] + oldPadding[2] - newPadding[2]);
      this.setCenterInternal([center[0] + offsetX, center[1] - offsetY]);
    }
  }
  getUpdatedOptions_(newOptions) {
    const options = this.getProperties();
    if (options.resolution !== void 0) {
      options.resolution = this.getResolution();
    } else {
      options.zoom = this.getZoom();
    }
    options.center = this.getCenterInternal();
    options.rotation = this.getRotation();
    return Object.assign({}, options, newOptions);
  }
  animate(var_args) {
    if (this.isDef() && !this.getAnimating()) {
      this.resolveConstraints(0);
    }
    const args = new Array(arguments.length);
    for (let i = 0; i < args.length; ++i) {
      let options = arguments[i];
      if (options.center) {
        options = Object.assign({}, options);
        options.center = fromUserCoordinate(
          options.center,
          this.getProjection()
        );
      }
      if (options.anchor) {
        options = Object.assign({}, options);
        options.anchor = fromUserCoordinate(
          options.anchor,
          this.getProjection()
        );
      }
      args[i] = options;
    }
    this.animateInternal.apply(this, args);
  }
  animateInternal(var_args) {
    let animationCount = arguments.length;
    let callback;
    if (animationCount > 1 && typeof arguments[animationCount - 1] === "function") {
      callback = arguments[animationCount - 1];
      --animationCount;
    }
    let i = 0;
    for (; i < animationCount && !this.isDef(); ++i) {
      const state = arguments[i];
      if (state.center) {
        this.setCenterInternal(state.center);
      }
      if (state.zoom !== void 0) {
        this.setZoom(state.zoom);
      } else if (state.resolution) {
        this.setResolution(state.resolution);
      }
      if (state.rotation !== void 0) {
        this.setRotation(state.rotation);
      }
    }
    if (i === animationCount) {
      if (callback) {
        animationCallback(callback, true);
      }
      return;
    }
    let start = Date.now();
    let center = this.targetCenter_.slice();
    let resolution = this.targetResolution_;
    let rotation = this.targetRotation_;
    const series = [];
    for (; i < animationCount; ++i) {
      const options = arguments[i];
      const animation = {
        start,
        complete: false,
        anchor: options.anchor,
        duration: options.duration !== void 0 ? options.duration : 1e3,
        easing: options.easing || inAndOut,
        callback
      };
      if (options.center) {
        animation.sourceCenter = center;
        animation.targetCenter = options.center.slice();
        center = animation.targetCenter;
      }
      if (options.zoom !== void 0) {
        animation.sourceResolution = resolution;
        animation.targetResolution = this.getResolutionForZoom(options.zoom);
        resolution = animation.targetResolution;
      } else if (options.resolution) {
        animation.sourceResolution = resolution;
        animation.targetResolution = options.resolution;
        resolution = animation.targetResolution;
      }
      if (options.rotation !== void 0) {
        animation.sourceRotation = rotation;
        const delta = modulo(options.rotation - rotation + Math.PI, 2 * Math.PI) - Math.PI;
        animation.targetRotation = rotation + delta;
        rotation = animation.targetRotation;
      }
      if (isNoopAnimation(animation)) {
        animation.complete = true;
      } else {
        start += animation.duration;
      }
      series.push(animation);
    }
    this.animations_.push(series);
    this.setHint(ViewHint.ANIMATING, 1);
    this.updateAnimations_();
  }
  getAnimating() {
    return this.hints_[ViewHint.ANIMATING] > 0;
  }
  getInteracting() {
    return this.hints_[ViewHint.INTERACTING] > 0;
  }
  cancelAnimations() {
    this.setHint(ViewHint.ANIMATING, -this.hints_[ViewHint.ANIMATING]);
    let anchor;
    for (let i = 0, ii = this.animations_.length; i < ii; ++i) {
      const series = this.animations_[i];
      if (series[0].callback) {
        animationCallback(series[0].callback, false);
      }
      if (!anchor) {
        for (let j = 0, jj = series.length; j < jj; ++j) {
          const animation = series[j];
          if (!animation.complete) {
            anchor = animation.anchor;
            break;
          }
        }
      }
    }
    this.animations_.length = 0;
    this.cancelAnchor_ = anchor;
    this.nextCenter_ = null;
    this.nextResolution_ = NaN;
    this.nextRotation_ = NaN;
  }
  updateAnimations_() {
    if (this.updateAnimationKey_ !== void 0) {
      cancelAnimationFrame(this.updateAnimationKey_);
      this.updateAnimationKey_ = void 0;
    }
    if (!this.getAnimating()) {
      return;
    }
    const now = Date.now();
    let more = false;
    for (let i = this.animations_.length - 1; i >= 0; --i) {
      const series = this.animations_[i];
      let seriesComplete = true;
      for (let j = 0, jj = series.length; j < jj; ++j) {
        const animation = series[j];
        if (animation.complete) {
          continue;
        }
        const elapsed = now - animation.start;
        let fraction = animation.duration > 0 ? elapsed / animation.duration : 1;
        if (fraction >= 1) {
          animation.complete = true;
          fraction = 1;
        } else {
          seriesComplete = false;
        }
        const progress = animation.easing(fraction);
        if (animation.sourceCenter) {
          const x0 = animation.sourceCenter[0];
          const y0 = animation.sourceCenter[1];
          const x1 = animation.targetCenter[0];
          const y1 = animation.targetCenter[1];
          this.nextCenter_ = animation.targetCenter;
          const x = x0 + progress * (x1 - x0);
          const y = y0 + progress * (y1 - y0);
          this.targetCenter_ = [x, y];
        }
        if (animation.sourceResolution && animation.targetResolution) {
          const resolution = progress === 1 ? animation.targetResolution : animation.sourceResolution + progress * (animation.targetResolution - animation.sourceResolution);
          if (animation.anchor) {
            const size = this.getViewportSize_(this.getRotation());
            const constrainedResolution = this.constraints_.resolution(
              resolution,
              0,
              size,
              true
            );
            this.targetCenter_ = this.calculateCenterZoom(
              constrainedResolution,
              animation.anchor
            );
          }
          this.nextResolution_ = animation.targetResolution;
          this.targetResolution_ = resolution;
          this.applyTargetState_(true);
        }
        if (animation.sourceRotation !== void 0 && animation.targetRotation !== void 0) {
          const rotation = progress === 1 ? modulo(animation.targetRotation + Math.PI, 2 * Math.PI) - Math.PI : animation.sourceRotation + progress * (animation.targetRotation - animation.sourceRotation);
          if (animation.anchor) {
            const constrainedRotation = this.constraints_.rotation(
              rotation,
              true
            );
            this.targetCenter_ = this.calculateCenterRotate(
              constrainedRotation,
              animation.anchor
            );
          }
          this.nextRotation_ = animation.targetRotation;
          this.targetRotation_ = rotation;
        }
        this.applyTargetState_(true);
        more = true;
        if (!animation.complete) {
          break;
        }
      }
      if (seriesComplete) {
        this.animations_[i] = null;
        this.setHint(ViewHint.ANIMATING, -1);
        this.nextCenter_ = null;
        this.nextResolution_ = NaN;
        this.nextRotation_ = NaN;
        const callback = series[0].callback;
        if (callback) {
          animationCallback(callback, true);
        }
      }
    }
    this.animations_ = this.animations_.filter(Boolean);
    if (more && this.updateAnimationKey_ === void 0) {
      this.updateAnimationKey_ = requestAnimationFrame(
        this.updateAnimations_.bind(this)
      );
    }
  }
  calculateCenterRotate(rotation, anchor) {
    let center;
    const currentCenter = this.getCenterInternal();
    if (currentCenter !== void 0) {
      center = [currentCenter[0] - anchor[0], currentCenter[1] - anchor[1]];
      rotate$2(center, rotation - this.getRotation());
      add(center, anchor);
    }
    return center;
  }
  calculateCenterZoom(resolution, anchor) {
    let center;
    const currentCenter = this.getCenterInternal();
    const currentResolution = this.getResolution();
    if (currentCenter !== void 0 && currentResolution !== void 0) {
      const x = anchor[0] - resolution * (anchor[0] - currentCenter[0]) / currentResolution;
      const y = anchor[1] - resolution * (anchor[1] - currentCenter[1]) / currentResolution;
      center = [x, y];
    }
    return center;
  }
  getViewportSize_(rotation) {
    const size = this.viewportSize_;
    if (rotation) {
      const w = size[0];
      const h = size[1];
      return [
        Math.abs(w * Math.cos(rotation)) + Math.abs(h * Math.sin(rotation)),
        Math.abs(w * Math.sin(rotation)) + Math.abs(h * Math.cos(rotation))
      ];
    } else {
      return size;
    }
  }
  setViewportSize(size) {
    this.viewportSize_ = Array.isArray(size) ? size.slice() : [100, 100];
    if (!this.getAnimating()) {
      this.resolveConstraints(0);
    }
  }
  getCenter() {
    const center = this.getCenterInternal();
    if (!center) {
      return center;
    }
    return toUserCoordinate(center, this.getProjection());
  }
  getCenterInternal() {
    return this.get(ViewProperty.CENTER);
  }
  getConstraints() {
    return this.constraints_;
  }
  getConstrainResolution() {
    return this.get("constrainResolution");
  }
  getHints(hints) {
    if (hints !== void 0) {
      hints[0] = this.hints_[0];
      hints[1] = this.hints_[1];
      return hints;
    } else {
      return this.hints_.slice();
    }
  }
  calculateExtent(size) {
    const extent = this.calculateExtentInternal(size);
    return toUserExtent(extent, this.getProjection());
  }
  calculateExtentInternal(size) {
    size = size || this.getViewportSizeMinusPadding_();
    const center = this.getCenterInternal();
    assert(center, 1);
    const resolution = this.getResolution();
    assert(resolution !== void 0, 2);
    const rotation = this.getRotation();
    assert(rotation !== void 0, 3);
    return getForViewAndSize(center, resolution, rotation, size);
  }
  getMaxResolution() {
    return this.maxResolution_;
  }
  getMinResolution() {
    return this.minResolution_;
  }
  getMaxZoom() {
    return this.getZoomForResolution(this.minResolution_);
  }
  setMaxZoom(zoom) {
    this.applyOptions_(this.getUpdatedOptions_({ maxZoom: zoom }));
  }
  getMinZoom() {
    return this.getZoomForResolution(this.maxResolution_);
  }
  setMinZoom(zoom) {
    this.applyOptions_(this.getUpdatedOptions_({ minZoom: zoom }));
  }
  setConstrainResolution(enabled) {
    this.applyOptions_(this.getUpdatedOptions_({ constrainResolution: enabled }));
  }
  getProjection() {
    return this.projection_;
  }
  getResolution() {
    return this.get(ViewProperty.RESOLUTION);
  }
  getResolutions() {
    return this.resolutions_;
  }
  getResolutionForExtent(extent, size) {
    return this.getResolutionForExtentInternal(
      fromUserExtent(extent, this.getProjection()),
      size
    );
  }
  getResolutionForExtentInternal(extent, size) {
    size = size || this.getViewportSizeMinusPadding_();
    const xResolution = getWidth(extent) / size[0];
    const yResolution = getHeight(extent) / size[1];
    return Math.max(xResolution, yResolution);
  }
  getResolutionForValueFunction(power) {
    power = power || 2;
    const maxResolution = this.getConstrainedResolution(this.maxResolution_);
    const minResolution = this.minResolution_;
    const max = Math.log(maxResolution / minResolution) / Math.log(power);
    return function(value) {
      const resolution = maxResolution / Math.pow(power, value * max);
      return resolution;
    };
  }
  getRotation() {
    return this.get(ViewProperty.ROTATION);
  }
  getValueForResolutionFunction(power) {
    const logPower = Math.log(power || 2);
    const maxResolution = this.getConstrainedResolution(this.maxResolution_);
    const minResolution = this.minResolution_;
    const max = Math.log(maxResolution / minResolution) / logPower;
    return function(resolution) {
      const value = Math.log(maxResolution / resolution) / logPower / max;
      return value;
    };
  }
  getViewportSizeMinusPadding_(rotation) {
    let size = this.getViewportSize_(rotation);
    const padding = this.padding_;
    if (padding) {
      size = [
        size[0] - padding[1] - padding[3],
        size[1] - padding[0] - padding[2]
      ];
    }
    return size;
  }
  getState() {
    const projection = this.getProjection();
    const resolution = this.getResolution();
    const rotation = this.getRotation();
    let center = this.getCenterInternal();
    const padding = this.padding_;
    if (padding) {
      const reducedSize = this.getViewportSizeMinusPadding_();
      center = calculateCenterOn(
        center,
        this.getViewportSize_(),
        [reducedSize[0] / 2 + padding[3], reducedSize[1] / 2 + padding[0]],
        resolution,
        rotation
      );
    }
    return {
      center: center.slice(0),
      projection: projection !== void 0 ? projection : null,
      resolution,
      nextCenter: this.nextCenter_,
      nextResolution: this.nextResolution_,
      nextRotation: this.nextRotation_,
      rotation,
      zoom: this.getZoom()
    };
  }
  getZoom() {
    let zoom;
    const resolution = this.getResolution();
    if (resolution !== void 0) {
      zoom = this.getZoomForResolution(resolution);
    }
    return zoom;
  }
  getZoomForResolution(resolution) {
    let offset = this.minZoom_ || 0;
    let max, zoomFactor;
    if (this.resolutions_) {
      const nearest = linearFindNearest(this.resolutions_, resolution, 1);
      offset = nearest;
      max = this.resolutions_[nearest];
      if (nearest == this.resolutions_.length - 1) {
        zoomFactor = 2;
      } else {
        zoomFactor = max / this.resolutions_[nearest + 1];
      }
    } else {
      max = this.maxResolution_;
      zoomFactor = this.zoomFactor_;
    }
    return offset + Math.log(max / resolution) / Math.log(zoomFactor);
  }
  getResolutionForZoom(zoom) {
    if (this.resolutions_) {
      if (this.resolutions_.length <= 1) {
        return 0;
      }
      const baseLevel = clamp(
        Math.floor(zoom),
        0,
        this.resolutions_.length - 2
      );
      const zoomFactor = this.resolutions_[baseLevel] / this.resolutions_[baseLevel + 1];
      return this.resolutions_[baseLevel] / Math.pow(zoomFactor, clamp(zoom - baseLevel, 0, 1));
    } else {
      return this.maxResolution_ / Math.pow(this.zoomFactor_, zoom - this.minZoom_);
    }
  }
  fit(geometryOrExtent, options) {
    let geometry;
    assert(
      Array.isArray(geometryOrExtent) || typeof geometryOrExtent.getSimplifiedGeometry === "function",
      24
    );
    if (Array.isArray(geometryOrExtent)) {
      assert(!isEmpty(geometryOrExtent), 25);
      const extent = fromUserExtent(geometryOrExtent, this.getProjection());
      geometry = fromExtent(extent);
    } else if (geometryOrExtent.getType() === "Circle") {
      const extent = fromUserExtent(
        geometryOrExtent.getExtent(),
        this.getProjection()
      );
      geometry = fromExtent(extent);
      geometry.rotate(this.getRotation(), getCenter(extent));
    } else {
      {
        geometry = geometryOrExtent;
      }
    }
    this.fitInternal(geometry, options);
  }
  rotatedExtentForGeometry(geometry) {
    const rotation = this.getRotation();
    const cosAngle = Math.cos(rotation);
    const sinAngle = Math.sin(-rotation);
    const coords = geometry.getFlatCoordinates();
    const stride = geometry.getStride();
    let minRotX = Infinity;
    let minRotY = Infinity;
    let maxRotX = -Infinity;
    let maxRotY = -Infinity;
    for (let i = 0, ii = coords.length; i < ii; i += stride) {
      const rotX = coords[i] * cosAngle - coords[i + 1] * sinAngle;
      const rotY = coords[i] * sinAngle + coords[i + 1] * cosAngle;
      minRotX = Math.min(minRotX, rotX);
      minRotY = Math.min(minRotY, rotY);
      maxRotX = Math.max(maxRotX, rotX);
      maxRotY = Math.max(maxRotY, rotY);
    }
    return [minRotX, minRotY, maxRotX, maxRotY];
  }
  fitInternal(geometry, options) {
    options = options || {};
    let size = options.size;
    if (!size) {
      size = this.getViewportSizeMinusPadding_();
    }
    const padding = options.padding !== void 0 ? options.padding : [0, 0, 0, 0];
    const nearest = options.nearest !== void 0 ? options.nearest : false;
    let minResolution;
    if (options.minResolution !== void 0) {
      minResolution = options.minResolution;
    } else if (options.maxZoom !== void 0) {
      minResolution = this.getResolutionForZoom(options.maxZoom);
    } else {
      minResolution = 0;
    }
    const rotatedExtent = this.rotatedExtentForGeometry(geometry);
    let resolution = this.getResolutionForExtentInternal(rotatedExtent, [
      size[0] - padding[1] - padding[3],
      size[1] - padding[0] - padding[2]
    ]);
    resolution = isNaN(resolution) ? minResolution : Math.max(resolution, minResolution);
    resolution = this.getConstrainedResolution(resolution, nearest ? 0 : 1);
    const rotation = this.getRotation();
    const sinAngle = Math.sin(rotation);
    const cosAngle = Math.cos(rotation);
    const centerRot = getCenter(rotatedExtent);
    centerRot[0] += (padding[1] - padding[3]) / 2 * resolution;
    centerRot[1] += (padding[0] - padding[2]) / 2 * resolution;
    const centerX = centerRot[0] * cosAngle - centerRot[1] * sinAngle;
    const centerY = centerRot[1] * cosAngle + centerRot[0] * sinAngle;
    const center = this.getConstrainedCenter([centerX, centerY], resolution);
    const callback = options.callback ? options.callback : VOID;
    if (options.duration !== void 0) {
      this.animateInternal(
        {
          resolution,
          center,
          duration: options.duration,
          easing: options.easing
        },
        callback
      );
    } else {
      this.targetResolution_ = resolution;
      this.targetCenter_ = center;
      this.applyTargetState_(false, true);
      animationCallback(callback, true);
    }
  }
  centerOn(coordinate, size, position) {
    this.centerOnInternal(
      fromUserCoordinate(coordinate, this.getProjection()),
      size,
      position
    );
  }
  centerOnInternal(coordinate, size, position) {
    this.setCenterInternal(
      calculateCenterOn(
        coordinate,
        size,
        position,
        this.getResolution(),
        this.getRotation()
      )
    );
  }
  calculateCenterShift(center, resolution, rotation, size) {
    let centerShift;
    const padding = this.padding_;
    if (padding && center) {
      const reducedSize = this.getViewportSizeMinusPadding_(-rotation);
      const shiftedCenter = calculateCenterOn(
        center,
        size,
        [reducedSize[0] / 2 + padding[3], reducedSize[1] / 2 + padding[0]],
        resolution,
        rotation
      );
      centerShift = [
        center[0] - shiftedCenter[0],
        center[1] - shiftedCenter[1]
      ];
    }
    return centerShift;
  }
  isDef() {
    return !!this.getCenterInternal() && this.getResolution() !== void 0;
  }
  adjustCenter(deltaCoordinates) {
    const center = toUserCoordinate(this.targetCenter_, this.getProjection());
    this.setCenter([
      center[0] + deltaCoordinates[0],
      center[1] + deltaCoordinates[1]
    ]);
  }
  adjustCenterInternal(deltaCoordinates) {
    const center = this.targetCenter_;
    this.setCenterInternal([
      center[0] + deltaCoordinates[0],
      center[1] + deltaCoordinates[1]
    ]);
  }
  adjustResolution(ratio, anchor) {
    anchor = anchor && fromUserCoordinate(anchor, this.getProjection());
    this.adjustResolutionInternal(ratio, anchor);
  }
  adjustResolutionInternal(ratio, anchor) {
    const isMoving = this.getAnimating() || this.getInteracting();
    const size = this.getViewportSize_(this.getRotation());
    const newResolution = this.constraints_.resolution(
      this.targetResolution_ * ratio,
      0,
      size,
      isMoving
    );
    if (anchor) {
      this.targetCenter_ = this.calculateCenterZoom(newResolution, anchor);
    }
    this.targetResolution_ *= ratio;
    this.applyTargetState_();
  }
  adjustZoom(delta, anchor) {
    this.adjustResolution(Math.pow(this.zoomFactor_, -delta), anchor);
  }
  adjustRotation(delta, anchor) {
    if (anchor) {
      anchor = fromUserCoordinate(anchor, this.getProjection());
    }
    this.adjustRotationInternal(delta, anchor);
  }
  adjustRotationInternal(delta, anchor) {
    const isMoving = this.getAnimating() || this.getInteracting();
    const newRotation = this.constraints_.rotation(
      this.targetRotation_ + delta,
      isMoving
    );
    if (anchor) {
      this.targetCenter_ = this.calculateCenterRotate(newRotation, anchor);
    }
    this.targetRotation_ += delta;
    this.applyTargetState_();
  }
  setCenter(center) {
    this.setCenterInternal(
      center ? fromUserCoordinate(center, this.getProjection()) : center
    );
  }
  setCenterInternal(center) {
    this.targetCenter_ = center;
    this.applyTargetState_();
  }
  setHint(hint, delta) {
    this.hints_[hint] += delta;
    this.changed();
    return this.hints_[hint];
  }
  setResolution(resolution) {
    this.targetResolution_ = resolution;
    this.applyTargetState_();
  }
  setRotation(rotation) {
    this.targetRotation_ = rotation;
    this.applyTargetState_();
  }
  setZoom(zoom) {
    this.setResolution(this.getResolutionForZoom(zoom));
  }
  applyTargetState_(doNotCancelAnims, forceMoving) {
    const isMoving = this.getAnimating() || this.getInteracting() || forceMoving;
    const newRotation = this.constraints_.rotation(
      this.targetRotation_,
      isMoving
    );
    const size = this.getViewportSize_(newRotation);
    const newResolution = this.constraints_.resolution(
      this.targetResolution_,
      0,
      size,
      isMoving
    );
    const newCenter = this.constraints_.center(
      this.targetCenter_,
      newResolution,
      size,
      isMoving,
      this.calculateCenterShift(
        this.targetCenter_,
        newResolution,
        newRotation,
        size
      )
    );
    if (this.get(ViewProperty.ROTATION) !== newRotation) {
      this.set(ViewProperty.ROTATION, newRotation);
    }
    if (this.get(ViewProperty.RESOLUTION) !== newResolution) {
      this.set(ViewProperty.RESOLUTION, newResolution);
      this.set("zoom", this.getZoom(), true);
    }
    if (!newCenter || !this.get(ViewProperty.CENTER) || !equals$2(this.get(ViewProperty.CENTER), newCenter)) {
      this.set(ViewProperty.CENTER, newCenter);
    }
    if (this.getAnimating() && !doNotCancelAnims) {
      this.cancelAnimations();
    }
    this.cancelAnchor_ = void 0;
  }
  resolveConstraints(duration, resolutionDirection, anchor) {
    duration = duration !== void 0 ? duration : 200;
    const direction = resolutionDirection || 0;
    const newRotation = this.constraints_.rotation(this.targetRotation_);
    const size = this.getViewportSize_(newRotation);
    const newResolution = this.constraints_.resolution(
      this.targetResolution_,
      direction,
      size
    );
    const newCenter = this.constraints_.center(
      this.targetCenter_,
      newResolution,
      size,
      false,
      this.calculateCenterShift(
        this.targetCenter_,
        newResolution,
        newRotation,
        size
      )
    );
    if (duration === 0 && !this.cancelAnchor_) {
      this.targetResolution_ = newResolution;
      this.targetRotation_ = newRotation;
      this.targetCenter_ = newCenter;
      this.applyTargetState_();
      return;
    }
    anchor = anchor || (duration === 0 ? this.cancelAnchor_ : void 0);
    this.cancelAnchor_ = void 0;
    if (this.getResolution() !== newResolution || this.getRotation() !== newRotation || !this.getCenterInternal() || !equals$2(this.getCenterInternal(), newCenter)) {
      if (this.getAnimating()) {
        this.cancelAnimations();
      }
      this.animateInternal({
        rotation: newRotation,
        center: newCenter,
        resolution: newResolution,
        duration,
        easing: easeOut,
        anchor
      });
    }
  }
  beginInteraction() {
    this.resolveConstraints(0);
    this.setHint(ViewHint.INTERACTING, 1);
  }
  endInteraction(duration, resolutionDirection, anchor) {
    anchor = anchor && fromUserCoordinate(anchor, this.getProjection());
    this.endInteractionInternal(duration, resolutionDirection, anchor);
  }
  endInteractionInternal(duration, resolutionDirection, anchor) {
    this.setHint(ViewHint.INTERACTING, -1);
    this.resolveConstraints(duration, resolutionDirection, anchor);
  }
  getConstrainedCenter(targetCenter, targetResolution) {
    const size = this.getViewportSize_(this.getRotation());
    return this.constraints_.center(
      targetCenter,
      targetResolution || this.getResolution(),
      size
    );
  }
  getConstrainedZoom(targetZoom, direction) {
    const targetRes = this.getResolutionForZoom(targetZoom);
    return this.getZoomForResolution(
      this.getConstrainedResolution(targetRes, direction)
    );
  }
  getConstrainedResolution(targetResolution, direction) {
    direction = direction || 0;
    const size = this.getViewportSize_(this.getRotation());
    return this.constraints_.resolution(targetResolution, direction, size);
  }
}
function animationCallback(callback, returnValue) {
  setTimeout(function() {
    callback(returnValue);
  }, 0);
}
function createCenterConstraint(options) {
  if (options.extent !== void 0) {
    const smooth = options.smoothExtentConstraint !== void 0 ? options.smoothExtentConstraint : true;
    return createExtent(options.extent, options.constrainOnlyCenter, smooth);
  }
  const projection = createProjection(options.projection, "EPSG:3857");
  if (options.multiWorld !== true && projection.isGlobal()) {
    const extent = projection.getExtent().slice();
    extent[0] = -Infinity;
    extent[2] = Infinity;
    return createExtent(extent, false, false);
  }
  return none;
}
function createResolutionConstraint(options) {
  let resolutionConstraint;
  let maxResolution;
  let minResolution;
  const defaultMaxZoom = 28;
  const defaultZoomFactor = 2;
  let minZoom = options.minZoom !== void 0 ? options.minZoom : DEFAULT_MIN_ZOOM;
  let maxZoom = options.maxZoom !== void 0 ? options.maxZoom : defaultMaxZoom;
  const zoomFactor = options.zoomFactor !== void 0 ? options.zoomFactor : defaultZoomFactor;
  const multiWorld = options.multiWorld !== void 0 ? options.multiWorld : false;
  const smooth = options.smoothResolutionConstraint !== void 0 ? options.smoothResolutionConstraint : true;
  const showFullExtent = options.showFullExtent !== void 0 ? options.showFullExtent : false;
  const projection = createProjection(options.projection, "EPSG:3857");
  const projExtent = projection.getExtent();
  let constrainOnlyCenter = options.constrainOnlyCenter;
  let extent = options.extent;
  if (!multiWorld && !extent && projection.isGlobal()) {
    constrainOnlyCenter = false;
    extent = projExtent;
  }
  if (options.resolutions !== void 0) {
    const resolutions = options.resolutions;
    maxResolution = resolutions[minZoom];
    minResolution = resolutions[maxZoom] !== void 0 ? resolutions[maxZoom] : resolutions[resolutions.length - 1];
    if (options.constrainResolution) {
      resolutionConstraint = createSnapToResolutions(
        resolutions,
        smooth,
        !constrainOnlyCenter && extent,
        showFullExtent
      );
    } else {
      resolutionConstraint = createMinMaxResolution(
        maxResolution,
        minResolution,
        smooth,
        !constrainOnlyCenter && extent,
        showFullExtent
      );
    }
  } else {
    const size = !projExtent ? 360 * METERS_PER_UNIT$1.degrees / projection.getMetersPerUnit() : Math.max(getWidth(projExtent), getHeight(projExtent));
    const defaultMaxResolution = size / DEFAULT_TILE_SIZE / Math.pow(defaultZoomFactor, DEFAULT_MIN_ZOOM);
    const defaultMinResolution = defaultMaxResolution / Math.pow(defaultZoomFactor, defaultMaxZoom - DEFAULT_MIN_ZOOM);
    maxResolution = options.maxResolution;
    if (maxResolution !== void 0) {
      minZoom = 0;
    } else {
      maxResolution = defaultMaxResolution / Math.pow(zoomFactor, minZoom);
    }
    minResolution = options.minResolution;
    if (minResolution === void 0) {
      if (options.maxZoom !== void 0) {
        if (options.maxResolution !== void 0) {
          minResolution = maxResolution / Math.pow(zoomFactor, maxZoom);
        } else {
          minResolution = defaultMaxResolution / Math.pow(zoomFactor, maxZoom);
        }
      } else {
        minResolution = defaultMinResolution;
      }
    }
    maxZoom = minZoom + Math.floor(
      Math.log(maxResolution / minResolution) / Math.log(zoomFactor)
    );
    minResolution = maxResolution / Math.pow(zoomFactor, maxZoom - minZoom);
    if (options.constrainResolution) {
      resolutionConstraint = createSnapToPower(
        zoomFactor,
        maxResolution,
        minResolution,
        smooth,
        !constrainOnlyCenter && extent,
        showFullExtent
      );
    } else {
      resolutionConstraint = createMinMaxResolution(
        maxResolution,
        minResolution,
        smooth,
        !constrainOnlyCenter && extent,
        showFullExtent
      );
    }
  }
  return {
    constraint: resolutionConstraint,
    maxResolution,
    minResolution,
    minZoom,
    zoomFactor
  };
}
function createRotationConstraint(options) {
  const enableRotation = options.enableRotation !== void 0 ? options.enableRotation : true;
  if (enableRotation) {
    const constrainRotation = options.constrainRotation;
    if (constrainRotation === void 0 || constrainRotation === true) {
      return createSnapToZero();
    } else if (constrainRotation === false) {
      return none$1;
    } else if (typeof constrainRotation === "number") {
      return createSnapToN(constrainRotation);
    } else {
      return none$1;
    }
  } else {
    return disable;
  }
}
function isNoopAnimation(animation) {
  if (animation.sourceCenter && animation.targetCenter) {
    if (!equals$2(animation.sourceCenter, animation.targetCenter)) {
      return false;
    }
  }
  if (animation.sourceResolution !== animation.targetResolution) {
    return false;
  }
  if (animation.sourceRotation !== animation.targetRotation) {
    return false;
  }
  return true;
}
function calculateCenterOn(coordinate, size, position, resolution, rotation) {
  const cosAngle = Math.cos(-rotation);
  let sinAngle = Math.sin(-rotation);
  let rotX = coordinate[0] * cosAngle - coordinate[1] * sinAngle;
  let rotY = coordinate[1] * cosAngle + coordinate[0] * sinAngle;
  rotX += (size[0] / 2 - position[0]) * resolution;
  rotY += (position[1] - size[1] / 2) * resolution;
  sinAngle = -sinAngle;
  const centerX = rotX * cosAngle - rotY * sinAngle;
  const centerY = rotY * cosAngle + rotX * sinAngle;
  return [centerX, centerY];
}
const View$1 = View;
class Control extends BaseObject$1 {
  constructor(options) {
    super();
    const element = options.element;
    if (element && !options.target && !element.style.pointerEvents) {
      element.style.pointerEvents = "auto";
    }
    this.element = element ? element : null;
    this.target_ = null;
    this.map_ = null;
    this.listenerKeys = [];
    if (options.render) {
      this.render = options.render;
    }
    if (options.target) {
      this.setTarget(options.target);
    }
  }
  disposeInternal() {
    removeNode$1(this.element);
    super.disposeInternal();
  }
  getMap() {
    return this.map_;
  }
  setMap(map) {
    if (this.map_) {
      removeNode$1(this.element);
    }
    for (let i = 0, ii = this.listenerKeys.length; i < ii; ++i) {
      unlistenByKey(this.listenerKeys[i]);
    }
    this.listenerKeys.length = 0;
    this.map_ = map;
    if (map) {
      const target = this.target_ ? this.target_ : map.getOverlayContainerStopEvent();
      target.appendChild(this.element);
      if (this.render !== VOID) {
        this.listenerKeys.push(
          listen(map, MapEventType.POSTRENDER, this.render, this)
        );
      }
      map.render();
    }
  }
  render(mapEvent) {
  }
  setTarget(target) {
    this.target_ = typeof target === "string" ? document.getElementById(target) : target;
  }
}
const Control$1 = Control;
class Attribution extends Control$1 {
  constructor(options) {
    options = options ? options : {};
    super({
      element: document.createElement("div"),
      render: options.render,
      target: options.target
    });
    this.ulElement_ = document.createElement("ul");
    this.collapsed_ = options.collapsed !== void 0 ? options.collapsed : true;
    this.userCollapsed_ = this.collapsed_;
    this.overrideCollapsible_ = options.collapsible !== void 0;
    this.collapsible_ = options.collapsible !== void 0 ? options.collapsible : true;
    if (!this.collapsible_) {
      this.collapsed_ = false;
    }
    const className = options.className !== void 0 ? options.className : "ol-attribution";
    const tipLabel = options.tipLabel !== void 0 ? options.tipLabel : "Attributions";
    const expandClassName = options.expandClassName !== void 0 ? options.expandClassName : className + "-expand";
    const collapseLabel = options.collapseLabel !== void 0 ? options.collapseLabel : "\u203A";
    const collapseClassName = options.collapseClassName !== void 0 ? options.collapseClassName : className + "-collapse";
    if (typeof collapseLabel === "string") {
      this.collapseLabel_ = document.createElement("span");
      this.collapseLabel_.textContent = collapseLabel;
      this.collapseLabel_.className = collapseClassName;
    } else {
      this.collapseLabel_ = collapseLabel;
    }
    const label = options.label !== void 0 ? options.label : "i";
    if (typeof label === "string") {
      this.label_ = document.createElement("span");
      this.label_.textContent = label;
      this.label_.className = expandClassName;
    } else {
      this.label_ = label;
    }
    const activeLabel = this.collapsible_ && !this.collapsed_ ? this.collapseLabel_ : this.label_;
    this.toggleButton_ = document.createElement("button");
    this.toggleButton_.setAttribute("type", "button");
    this.toggleButton_.setAttribute("aria-expanded", String(!this.collapsed_));
    this.toggleButton_.title = tipLabel;
    this.toggleButton_.appendChild(activeLabel);
    this.toggleButton_.addEventListener(
      EventType.CLICK,
      this.handleClick_.bind(this),
      false
    );
    const cssClasses = className + " " + CLASS_UNSELECTABLE + " " + CLASS_CONTROL + (this.collapsed_ && this.collapsible_ ? " " + CLASS_COLLAPSED : "") + (this.collapsible_ ? "" : " ol-uncollapsible");
    const element = this.element;
    element.className = cssClasses;
    element.appendChild(this.toggleButton_);
    element.appendChild(this.ulElement_);
    this.renderedAttributions_ = [];
    this.renderedVisible_ = true;
  }
  collectSourceAttributions_(frameState) {
    const lookup = {};
    const visibleAttributions = [];
    let collapsible = true;
    const layerStatesArray = frameState.layerStatesArray;
    for (let i = 0, ii = layerStatesArray.length; i < ii; ++i) {
      const layerState = layerStatesArray[i];
      if (!inView(layerState, frameState.viewState)) {
        continue;
      }
      const source = layerState.layer.getSource();
      if (!source) {
        continue;
      }
      const attributionGetter = source.getAttributions();
      if (!attributionGetter) {
        continue;
      }
      const attributions = attributionGetter(frameState);
      if (!attributions) {
        continue;
      }
      collapsible = collapsible && source.getAttributionsCollapsible() !== false;
      if (Array.isArray(attributions)) {
        for (let j = 0, jj = attributions.length; j < jj; ++j) {
          if (!(attributions[j] in lookup)) {
            visibleAttributions.push(attributions[j]);
            lookup[attributions[j]] = true;
          }
        }
      } else {
        if (!(attributions in lookup)) {
          visibleAttributions.push(attributions);
          lookup[attributions] = true;
        }
      }
    }
    if (!this.overrideCollapsible_) {
      this.setCollapsible(collapsible);
    }
    return visibleAttributions;
  }
  updateElement_(frameState) {
    if (!frameState) {
      if (this.renderedVisible_) {
        this.element.style.display = "none";
        this.renderedVisible_ = false;
      }
      return;
    }
    const attributions = this.collectSourceAttributions_(frameState);
    const visible = attributions.length > 0;
    if (this.renderedVisible_ != visible) {
      this.element.style.display = visible ? "" : "none";
      this.renderedVisible_ = visible;
    }
    if (equals$1(attributions, this.renderedAttributions_)) {
      return;
    }
    removeChildren(this.ulElement_);
    for (let i = 0, ii = attributions.length; i < ii; ++i) {
      const element = document.createElement("li");
      element.innerHTML = attributions[i];
      this.ulElement_.appendChild(element);
    }
    this.renderedAttributions_ = attributions;
  }
  handleClick_(event) {
    event.preventDefault();
    this.handleToggle_();
    this.userCollapsed_ = this.collapsed_;
  }
  handleToggle_() {
    this.element.classList.toggle(CLASS_COLLAPSED);
    if (this.collapsed_) {
      replaceNode(this.collapseLabel_, this.label_);
    } else {
      replaceNode(this.label_, this.collapseLabel_);
    }
    this.collapsed_ = !this.collapsed_;
    this.toggleButton_.setAttribute("aria-expanded", String(!this.collapsed_));
  }
  getCollapsible() {
    return this.collapsible_;
  }
  setCollapsible(collapsible) {
    if (this.collapsible_ === collapsible) {
      return;
    }
    this.collapsible_ = collapsible;
    this.element.classList.toggle("ol-uncollapsible");
    if (this.userCollapsed_) {
      this.handleToggle_();
    }
  }
  setCollapsed(collapsed) {
    this.userCollapsed_ = collapsed;
    if (!this.collapsible_ || this.collapsed_ === collapsed) {
      return;
    }
    this.handleToggle_();
  }
  getCollapsed() {
    return this.collapsed_;
  }
  render(mapEvent) {
    this.updateElement_(mapEvent.frameState);
  }
}
const Attribution$1 = Attribution;
class Rotate extends Control$1 {
  constructor(options) {
    options = options ? options : {};
    super({
      element: document.createElement("div"),
      render: options.render,
      target: options.target
    });
    const className = options.className !== void 0 ? options.className : "ol-rotate";
    const label = options.label !== void 0 ? options.label : "\u21E7";
    const compassClassName = options.compassClassName !== void 0 ? options.compassClassName : "ol-compass";
    this.label_ = null;
    if (typeof label === "string") {
      this.label_ = document.createElement("span");
      this.label_.className = compassClassName;
      this.label_.textContent = label;
    } else {
      this.label_ = label;
      this.label_.classList.add(compassClassName);
    }
    const tipLabel = options.tipLabel ? options.tipLabel : "Reset rotation";
    const button = document.createElement("button");
    button.className = className + "-reset";
    button.setAttribute("type", "button");
    button.title = tipLabel;
    button.appendChild(this.label_);
    button.addEventListener(
      EventType.CLICK,
      this.handleClick_.bind(this),
      false
    );
    const cssClasses = className + " " + CLASS_UNSELECTABLE + " " + CLASS_CONTROL;
    const element = this.element;
    element.className = cssClasses;
    element.appendChild(button);
    this.callResetNorth_ = options.resetNorth ? options.resetNorth : void 0;
    this.duration_ = options.duration !== void 0 ? options.duration : 250;
    this.autoHide_ = options.autoHide !== void 0 ? options.autoHide : true;
    this.rotation_ = void 0;
    if (this.autoHide_) {
      this.element.classList.add(CLASS_HIDDEN);
    }
  }
  handleClick_(event) {
    event.preventDefault();
    if (this.callResetNorth_ !== void 0) {
      this.callResetNorth_();
    } else {
      this.resetNorth_();
    }
  }
  resetNorth_() {
    const map = this.getMap();
    const view = map.getView();
    if (!view) {
      return;
    }
    const rotation = view.getRotation();
    if (rotation !== void 0) {
      if (this.duration_ > 0 && rotation % (2 * Math.PI) !== 0) {
        view.animate({
          rotation: 0,
          duration: this.duration_,
          easing: easeOut
        });
      } else {
        view.setRotation(0);
      }
    }
  }
  render(mapEvent) {
    const frameState = mapEvent.frameState;
    if (!frameState) {
      return;
    }
    const rotation = frameState.viewState.rotation;
    if (rotation != this.rotation_) {
      const transform2 = "rotate(" + rotation + "rad)";
      if (this.autoHide_) {
        const contains2 = this.element.classList.contains(CLASS_HIDDEN);
        if (!contains2 && rotation === 0) {
          this.element.classList.add(CLASS_HIDDEN);
        } else if (contains2 && rotation !== 0) {
          this.element.classList.remove(CLASS_HIDDEN);
        }
      }
      this.label_.style.transform = transform2;
    }
    this.rotation_ = rotation;
  }
}
const Rotate$1 = Rotate;
class Zoom extends Control$1 {
  constructor(options) {
    options = options ? options : {};
    super({
      element: document.createElement("div"),
      target: options.target
    });
    const className = options.className !== void 0 ? options.className : "ol-zoom";
    const delta = options.delta !== void 0 ? options.delta : 1;
    const zoomInClassName = options.zoomInClassName !== void 0 ? options.zoomInClassName : className + "-in";
    const zoomOutClassName = options.zoomOutClassName !== void 0 ? options.zoomOutClassName : className + "-out";
    const zoomInLabel = options.zoomInLabel !== void 0 ? options.zoomInLabel : "+";
    const zoomOutLabel = options.zoomOutLabel !== void 0 ? options.zoomOutLabel : "\u2013";
    const zoomInTipLabel = options.zoomInTipLabel !== void 0 ? options.zoomInTipLabel : "Zoom in";
    const zoomOutTipLabel = options.zoomOutTipLabel !== void 0 ? options.zoomOutTipLabel : "Zoom out";
    const inElement = document.createElement("button");
    inElement.className = zoomInClassName;
    inElement.setAttribute("type", "button");
    inElement.title = zoomInTipLabel;
    inElement.appendChild(
      typeof zoomInLabel === "string" ? document.createTextNode(zoomInLabel) : zoomInLabel
    );
    inElement.addEventListener(
      EventType.CLICK,
      this.handleClick_.bind(this, delta),
      false
    );
    const outElement = document.createElement("button");
    outElement.className = zoomOutClassName;
    outElement.setAttribute("type", "button");
    outElement.title = zoomOutTipLabel;
    outElement.appendChild(
      typeof zoomOutLabel === "string" ? document.createTextNode(zoomOutLabel) : zoomOutLabel
    );
    outElement.addEventListener(
      EventType.CLICK,
      this.handleClick_.bind(this, -delta),
      false
    );
    const cssClasses = className + " " + CLASS_UNSELECTABLE + " " + CLASS_CONTROL;
    const element = this.element;
    element.className = cssClasses;
    element.appendChild(inElement);
    element.appendChild(outElement);
    this.duration_ = options.duration !== void 0 ? options.duration : 250;
  }
  handleClick_(delta, event) {
    event.preventDefault();
    this.zoomByDelta_(delta);
  }
  zoomByDelta_(delta) {
    const map = this.getMap();
    const view = map.getView();
    if (!view) {
      return;
    }
    const currentZoom = view.getZoom();
    if (currentZoom !== void 0) {
      const newZoom = view.getConstrainedZoom(currentZoom + delta);
      if (this.duration_ > 0) {
        if (view.getAnimating()) {
          view.cancelAnimations();
        }
        view.animate({
          zoom: newZoom,
          duration: this.duration_,
          easing: easeOut
        });
      } else {
        view.setZoom(newZoom);
      }
    }
  }
}
const Zoom$1 = Zoom;
function defaults(options) {
  options = options ? options : {};
  const controls = new Collection$1();
  const zoomControl = options.zoom !== void 0 ? options.zoom : true;
  if (zoomControl) {
    controls.push(new Zoom$1(options.zoomOptions));
  }
  const rotateControl = options.rotate !== void 0 ? options.rotate : true;
  if (rotateControl) {
    controls.push(new Rotate$1(options.rotateOptions));
  }
  const attributionControl = options.attribution !== void 0 ? options.attribution : true;
  if (attributionControl) {
    controls.push(new Attribution$1(options.attributionOptions));
  }
  return controls;
}
function removeLayerMapProperty(layer) {
  if (layer instanceof Layer$1) {
    layer.setMapInternal(null);
    return;
  }
  if (layer instanceof LayerGroup$1) {
    layer.getLayers().forEach(removeLayerMapProperty);
  }
}
function setLayerMapProperty(layer, map) {
  if (layer instanceof Layer$1) {
    layer.setMapInternal(map);
    return;
  }
  if (layer instanceof LayerGroup$1) {
    const layers = layer.getLayers().getArray();
    for (let i = 0, ii = layers.length; i < ii; ++i) {
      setLayerMapProperty(layers[i], map);
    }
  }
}
class Map extends BaseObject$1 {
  constructor(options) {
    super();
    options = options || {};
    this.on;
    this.once;
    this.un;
    const optionsInternal = createOptionsInternal(options);
    this.renderComplete_;
    this.loaded_ = true;
    this.boundHandleBrowserEvent_ = this.handleBrowserEvent.bind(this);
    this.maxTilesLoading_ = options.maxTilesLoading !== void 0 ? options.maxTilesLoading : 16;
    this.pixelRatio_ = options.pixelRatio !== void 0 ? options.pixelRatio : DEVICE_PIXEL_RATIO;
    this.postRenderTimeoutHandle_;
    this.animationDelayKey_;
    this.animationDelay_ = this.animationDelay_.bind(this);
    this.coordinateToPixelTransform_ = create$2();
    this.pixelToCoordinateTransform_ = create$2();
    this.frameIndex_ = 0;
    this.frameState_ = null;
    this.previousExtent_ = null;
    this.viewPropertyListenerKey_ = null;
    this.viewChangeListenerKey_ = null;
    this.layerGroupPropertyListenerKeys_ = null;
    this.viewport_ = document.createElement("div");
    this.viewport_.className = "ol-viewport" + ("ontouchstart" in window ? " ol-touch" : "");
    this.viewport_.style.position = "relative";
    this.viewport_.style.overflow = "hidden";
    this.viewport_.style.width = "100%";
    this.viewport_.style.height = "100%";
    this.overlayContainer_ = document.createElement("div");
    this.overlayContainer_.style.position = "absolute";
    this.overlayContainer_.style.zIndex = "0";
    this.overlayContainer_.style.width = "100%";
    this.overlayContainer_.style.height = "100%";
    this.overlayContainer_.style.pointerEvents = "none";
    this.overlayContainer_.className = "ol-overlaycontainer";
    this.viewport_.appendChild(this.overlayContainer_);
    this.overlayContainerStopEvent_ = document.createElement("div");
    this.overlayContainerStopEvent_.style.position = "absolute";
    this.overlayContainerStopEvent_.style.zIndex = "0";
    this.overlayContainerStopEvent_.style.width = "100%";
    this.overlayContainerStopEvent_.style.height = "100%";
    this.overlayContainerStopEvent_.style.pointerEvents = "none";
    this.overlayContainerStopEvent_.className = "ol-overlaycontainer-stopevent";
    this.viewport_.appendChild(this.overlayContainerStopEvent_);
    this.mapBrowserEventHandler_ = null;
    this.moveTolerance_ = options.moveTolerance;
    this.keyboardEventTarget_ = optionsInternal.keyboardEventTarget;
    this.targetChangeHandlerKeys_ = null;
    this.controls = optionsInternal.controls || defaults();
    this.interactions = optionsInternal.interactions || defaults$1({
      onFocusOnly: true
    });
    this.overlays_ = optionsInternal.overlays;
    this.overlayIdIndex_ = {};
    this.renderer_ = null;
    this.postRenderFunctions_ = [];
    this.tileQueue_ = new TileQueue$1(
      this.getTilePriority.bind(this),
      this.handleTileChange_.bind(this)
    );
    this.addChangeListener(
      MapProperty.LAYERGROUP,
      this.handleLayerGroupChanged_
    );
    this.addChangeListener(MapProperty.VIEW, this.handleViewChanged_);
    this.addChangeListener(MapProperty.SIZE, this.handleSizeChanged_);
    this.addChangeListener(MapProperty.TARGET, this.handleTargetChanged_);
    this.setProperties(optionsInternal.values);
    const map = this;
    if (options.view && !(options.view instanceof View$1)) {
      options.view.then(function(viewOptions) {
        map.setView(new View$1(viewOptions));
      });
    }
    this.controls.addEventListener(
      CollectionEventType.ADD,
      function(event) {
        event.element.setMap(this);
      }.bind(this)
    );
    this.controls.addEventListener(
      CollectionEventType.REMOVE,
      function(event) {
        event.element.setMap(null);
      }.bind(this)
    );
    this.interactions.addEventListener(
      CollectionEventType.ADD,
      function(event) {
        event.element.setMap(this);
      }.bind(this)
    );
    this.interactions.addEventListener(
      CollectionEventType.REMOVE,
      function(event) {
        event.element.setMap(null);
      }.bind(this)
    );
    this.overlays_.addEventListener(
      CollectionEventType.ADD,
      function(event) {
        this.addOverlayInternal_(event.element);
      }.bind(this)
    );
    this.overlays_.addEventListener(
      CollectionEventType.REMOVE,
      function(event) {
        const id = event.element.getId();
        if (id !== void 0) {
          delete this.overlayIdIndex_[id.toString()];
        }
        event.element.setMap(null);
      }.bind(this)
    );
    this.controls.forEach(
      function(control) {
        control.setMap(this);
      }.bind(this)
    );
    this.interactions.forEach(
      function(interaction) {
        interaction.setMap(this);
      }.bind(this)
    );
    this.overlays_.forEach(this.addOverlayInternal_.bind(this));
  }
  addControl(control) {
    this.getControls().push(control);
  }
  addInteraction(interaction) {
    this.getInteractions().push(interaction);
  }
  addLayer(layer) {
    const layers = this.getLayerGroup().getLayers();
    layers.push(layer);
  }
  handleLayerAdd_(event) {
    setLayerMapProperty(event.layer, this);
  }
  addOverlay(overlay) {
    this.getOverlays().push(overlay);
  }
  addOverlayInternal_(overlay) {
    const id = overlay.getId();
    if (id !== void 0) {
      this.overlayIdIndex_[id.toString()] = overlay;
    }
    overlay.setMap(this);
  }
  disposeInternal() {
    this.controls.clear();
    this.interactions.clear();
    this.overlays_.clear();
    this.setTarget(null);
    super.disposeInternal();
  }
  forEachFeatureAtPixel(pixel, callback, options) {
    if (!this.frameState_ || !this.renderer_) {
      return;
    }
    const coordinate = this.getCoordinateFromPixelInternal(pixel);
    options = options !== void 0 ? options : {};
    const hitTolerance = options.hitTolerance !== void 0 ? options.hitTolerance : 0;
    const layerFilter = options.layerFilter !== void 0 ? options.layerFilter : TRUE;
    const checkWrapped = options.checkWrapped !== false;
    return this.renderer_.forEachFeatureAtCoordinate(
      coordinate,
      this.frameState_,
      hitTolerance,
      checkWrapped,
      callback,
      null,
      layerFilter,
      null
    );
  }
  getFeaturesAtPixel(pixel, options) {
    const features = [];
    this.forEachFeatureAtPixel(
      pixel,
      function(feature2) {
        features.push(feature2);
      },
      options
    );
    return features;
  }
  getAllLayers() {
    const layers = [];
    function addLayersFrom(layerGroup) {
      layerGroup.forEach(function(layer) {
        if (layer instanceof LayerGroup$1) {
          addLayersFrom(layer.getLayers());
        } else {
          layers.push(layer);
        }
      });
    }
    addLayersFrom(this.getLayers());
    return layers;
  }
  hasFeatureAtPixel(pixel, options) {
    if (!this.frameState_ || !this.renderer_) {
      return false;
    }
    const coordinate = this.getCoordinateFromPixelInternal(pixel);
    options = options !== void 0 ? options : {};
    const layerFilter = options.layerFilter !== void 0 ? options.layerFilter : TRUE;
    const hitTolerance = options.hitTolerance !== void 0 ? options.hitTolerance : 0;
    const checkWrapped = options.checkWrapped !== false;
    return this.renderer_.hasFeatureAtCoordinate(
      coordinate,
      this.frameState_,
      hitTolerance,
      checkWrapped,
      layerFilter,
      null
    );
  }
  getEventCoordinate(event) {
    return this.getCoordinateFromPixel(this.getEventPixel(event));
  }
  getEventCoordinateInternal(event) {
    return this.getCoordinateFromPixelInternal(this.getEventPixel(event));
  }
  getEventPixel(event) {
    const viewportPosition = this.viewport_.getBoundingClientRect();
    const eventPosition = "changedTouches" in event ? event.changedTouches[0] : event;
    return [
      eventPosition.clientX - viewportPosition.left,
      eventPosition.clientY - viewportPosition.top
    ];
  }
  getTarget() {
    return this.get(MapProperty.TARGET);
  }
  getTargetElement() {
    const target = this.getTarget();
    if (target !== void 0) {
      return typeof target === "string" ? document.getElementById(target) : target;
    } else {
      return null;
    }
  }
  getCoordinateFromPixel(pixel) {
    return toUserCoordinate(
      this.getCoordinateFromPixelInternal(pixel),
      this.getView().getProjection()
    );
  }
  getCoordinateFromPixelInternal(pixel) {
    const frameState = this.frameState_;
    if (!frameState) {
      return null;
    } else {
      return apply(
        frameState.pixelToCoordinateTransform,
        pixel.slice()
      );
    }
  }
  getControls() {
    return this.controls;
  }
  getOverlays() {
    return this.overlays_;
  }
  getOverlayById(id) {
    const overlay = this.overlayIdIndex_[id.toString()];
    return overlay !== void 0 ? overlay : null;
  }
  getInteractions() {
    return this.interactions;
  }
  getLayerGroup() {
    return this.get(MapProperty.LAYERGROUP);
  }
  setLayers(layers) {
    const group = this.getLayerGroup();
    if (layers instanceof Collection$1) {
      group.setLayers(layers);
      return;
    }
    const collection = group.getLayers();
    collection.clear();
    collection.extend(layers);
  }
  getLayers() {
    const layers = this.getLayerGroup().getLayers();
    return layers;
  }
  getLoadingOrNotReady() {
    const layerStatesArray = this.getLayerGroup().getLayerStatesArray();
    for (let i = 0, ii = layerStatesArray.length; i < ii; ++i) {
      const state = layerStatesArray[i];
      if (!state.visible) {
        continue;
      }
      const renderer = state.layer.getRenderer();
      if (renderer && !renderer.ready) {
        return true;
      }
      const source = state.layer.getSource();
      if (source && source.loading) {
        return true;
      }
    }
    return false;
  }
  getPixelFromCoordinate(coordinate) {
    const viewCoordinate = fromUserCoordinate(
      coordinate,
      this.getView().getProjection()
    );
    return this.getPixelFromCoordinateInternal(viewCoordinate);
  }
  getPixelFromCoordinateInternal(coordinate) {
    const frameState = this.frameState_;
    if (!frameState) {
      return null;
    } else {
      return apply(
        frameState.coordinateToPixelTransform,
        coordinate.slice(0, 2)
      );
    }
  }
  getRenderer() {
    return this.renderer_;
  }
  getSize() {
    return this.get(MapProperty.SIZE);
  }
  getView() {
    return this.get(MapProperty.VIEW);
  }
  getViewport() {
    return this.viewport_;
  }
  getOverlayContainer() {
    return this.overlayContainer_;
  }
  getOverlayContainerStopEvent() {
    return this.overlayContainerStopEvent_;
  }
  getOwnerDocument() {
    const targetElement = this.getTargetElement();
    return targetElement ? targetElement.ownerDocument : document;
  }
  getTilePriority(tile, tileSourceKey, tileCenter, tileResolution) {
    return getTilePriority(
      this.frameState_,
      tile,
      tileSourceKey,
      tileCenter,
      tileResolution
    );
  }
  handleBrowserEvent(browserEvent, type) {
    type = type || browserEvent.type;
    const mapBrowserEvent = new MapBrowserEvent$1(type, this, browserEvent);
    this.handleMapBrowserEvent(mapBrowserEvent);
  }
  handleMapBrowserEvent(mapBrowserEvent) {
    if (!this.frameState_) {
      return;
    }
    const originalEvent = mapBrowserEvent.originalEvent;
    const eventType = originalEvent.type;
    if (eventType === PointerEventType.POINTERDOWN || eventType === EventType.WHEEL || eventType === EventType.KEYDOWN) {
      const doc = this.getOwnerDocument();
      const rootNode = this.viewport_.getRootNode ? this.viewport_.getRootNode() : doc;
      const target = originalEvent.target;
      if (this.overlayContainerStopEvent_.contains(target) || !(rootNode === doc ? doc.documentElement : rootNode).contains(target)) {
        return;
      }
    }
    mapBrowserEvent.frameState = this.frameState_;
    if (this.dispatchEvent(mapBrowserEvent) !== false) {
      const interactionsArray = this.getInteractions().getArray().slice();
      for (let i = interactionsArray.length - 1; i >= 0; i--) {
        const interaction = interactionsArray[i];
        if (interaction.getMap() !== this || !interaction.getActive() || !this.getTargetElement()) {
          continue;
        }
        const cont = interaction.handleEvent(mapBrowserEvent);
        if (!cont || mapBrowserEvent.propagationStopped) {
          break;
        }
      }
    }
  }
  handlePostRender() {
    const frameState = this.frameState_;
    const tileQueue = this.tileQueue_;
    if (!tileQueue.isEmpty()) {
      let maxTotalLoading = this.maxTilesLoading_;
      let maxNewLoads = maxTotalLoading;
      if (frameState) {
        const hints = frameState.viewHints;
        if (hints[ViewHint.ANIMATING] || hints[ViewHint.INTERACTING]) {
          const lowOnFrameBudget = Date.now() - frameState.time > 8;
          maxTotalLoading = lowOnFrameBudget ? 0 : 8;
          maxNewLoads = lowOnFrameBudget ? 0 : 2;
        }
      }
      if (tileQueue.getTilesLoading() < maxTotalLoading) {
        tileQueue.reprioritize();
        tileQueue.loadMoreTiles(maxTotalLoading, maxNewLoads);
      }
    }
    if (frameState && this.renderer_ && !frameState.animate) {
      if (this.renderComplete_ === true) {
        if (this.hasListener(RenderEventType.RENDERCOMPLETE)) {
          this.renderer_.dispatchRenderEvent(
            RenderEventType.RENDERCOMPLETE,
            frameState
          );
        }
        if (this.loaded_ === false) {
          this.loaded_ = true;
          this.dispatchEvent(
            new MapEvent$1(MapEventType.LOADEND, this, frameState)
          );
        }
      } else if (this.loaded_ === true) {
        this.loaded_ = false;
        this.dispatchEvent(
          new MapEvent$1(MapEventType.LOADSTART, this, frameState)
        );
      }
    }
    const postRenderFunctions = this.postRenderFunctions_;
    for (let i = 0, ii = postRenderFunctions.length; i < ii; ++i) {
      postRenderFunctions[i](this, frameState);
    }
    postRenderFunctions.length = 0;
  }
  handleSizeChanged_() {
    if (this.getView() && !this.getView().getAnimating()) {
      this.getView().resolveConstraints(0);
    }
    this.render();
  }
  handleTargetChanged_() {
    if (this.mapBrowserEventHandler_) {
      for (let i = 0, ii = this.targetChangeHandlerKeys_.length; i < ii; ++i) {
        unlistenByKey(this.targetChangeHandlerKeys_[i]);
      }
      this.targetChangeHandlerKeys_ = null;
      this.viewport_.removeEventListener(
        EventType.CONTEXTMENU,
        this.boundHandleBrowserEvent_
      );
      this.viewport_.removeEventListener(
        EventType.WHEEL,
        this.boundHandleBrowserEvent_
      );
      this.mapBrowserEventHandler_.dispose();
      this.mapBrowserEventHandler_ = null;
      removeNode$1(this.viewport_);
    }
    const targetElement = this.getTargetElement();
    if (!targetElement) {
      if (this.renderer_) {
        clearTimeout(this.postRenderTimeoutHandle_);
        this.postRenderTimeoutHandle_ = void 0;
        this.postRenderFunctions_.length = 0;
        this.renderer_.dispose();
        this.renderer_ = null;
      }
      if (this.animationDelayKey_) {
        cancelAnimationFrame(this.animationDelayKey_);
        this.animationDelayKey_ = void 0;
      }
    } else {
      targetElement.appendChild(this.viewport_);
      if (!this.renderer_) {
        this.renderer_ = new CompositeMapRenderer$1(this);
      }
      this.mapBrowserEventHandler_ = new MapBrowserEventHandler$1(
        this,
        this.moveTolerance_
      );
      for (const key in MapBrowserEventType) {
        this.mapBrowserEventHandler_.addEventListener(
          MapBrowserEventType[key],
          this.handleMapBrowserEvent.bind(this)
        );
      }
      this.viewport_.addEventListener(
        EventType.CONTEXTMENU,
        this.boundHandleBrowserEvent_,
        false
      );
      this.viewport_.addEventListener(
        EventType.WHEEL,
        this.boundHandleBrowserEvent_,
        PASSIVE_EVENT_LISTENERS ? { passive: false } : false
      );
      const defaultView = this.getOwnerDocument().defaultView;
      const keyboardEventTarget = !this.keyboardEventTarget_ ? targetElement : this.keyboardEventTarget_;
      this.targetChangeHandlerKeys_ = [
        listen(
          keyboardEventTarget,
          EventType.KEYDOWN,
          this.handleBrowserEvent,
          this
        ),
        listen(
          keyboardEventTarget,
          EventType.KEYPRESS,
          this.handleBrowserEvent,
          this
        ),
        listen(defaultView, EventType.RESIZE, this.updateSize, this)
      ];
    }
    this.updateSize();
  }
  handleTileChange_() {
    this.render();
  }
  handleViewPropertyChanged_() {
    this.render();
  }
  handleViewChanged_() {
    if (this.viewPropertyListenerKey_) {
      unlistenByKey(this.viewPropertyListenerKey_);
      this.viewPropertyListenerKey_ = null;
    }
    if (this.viewChangeListenerKey_) {
      unlistenByKey(this.viewChangeListenerKey_);
      this.viewChangeListenerKey_ = null;
    }
    const view = this.getView();
    if (view) {
      this.updateViewportSize_();
      this.viewPropertyListenerKey_ = listen(
        view,
        ObjectEventType.PROPERTYCHANGE,
        this.handleViewPropertyChanged_,
        this
      );
      this.viewChangeListenerKey_ = listen(
        view,
        EventType.CHANGE,
        this.handleViewPropertyChanged_,
        this
      );
      view.resolveConstraints(0);
    }
    this.render();
  }
  handleLayerGroupChanged_() {
    if (this.layerGroupPropertyListenerKeys_) {
      this.layerGroupPropertyListenerKeys_.forEach(unlistenByKey);
      this.layerGroupPropertyListenerKeys_ = null;
    }
    const layerGroup = this.getLayerGroup();
    if (layerGroup) {
      this.handleLayerAdd_(new GroupEvent("addlayer", layerGroup));
      this.layerGroupPropertyListenerKeys_ = [
        listen(layerGroup, ObjectEventType.PROPERTYCHANGE, this.render, this),
        listen(layerGroup, EventType.CHANGE, this.render, this),
        listen(layerGroup, "addlayer", this.handleLayerAdd_, this),
        listen(layerGroup, "removelayer", this.handleLayerRemove_, this)
      ];
    }
    this.render();
  }
  isRendered() {
    return !!this.frameState_;
  }
  animationDelay_() {
    this.animationDelayKey_ = void 0;
    this.renderFrame_(Date.now());
  }
  renderSync() {
    if (this.animationDelayKey_) {
      cancelAnimationFrame(this.animationDelayKey_);
    }
    this.animationDelay_();
  }
  redrawText() {
    const layerStates = this.getLayerGroup().getLayerStatesArray();
    for (let i = 0, ii = layerStates.length; i < ii; ++i) {
      const layer = layerStates[i].layer;
      if (layer.hasRenderer()) {
        layer.getRenderer().handleFontsChanged();
      }
    }
  }
  render() {
    if (this.renderer_ && this.animationDelayKey_ === void 0) {
      this.animationDelayKey_ = requestAnimationFrame(this.animationDelay_);
    }
  }
  removeControl(control) {
    return this.getControls().remove(control);
  }
  removeInteraction(interaction) {
    return this.getInteractions().remove(interaction);
  }
  removeLayer(layer) {
    const layers = this.getLayerGroup().getLayers();
    return layers.remove(layer);
  }
  handleLayerRemove_(event) {
    removeLayerMapProperty(event.layer);
  }
  removeOverlay(overlay) {
    return this.getOverlays().remove(overlay);
  }
  renderFrame_(time) {
    const size = this.getSize();
    const view = this.getView();
    const previousFrameState = this.frameState_;
    let frameState = null;
    if (size !== void 0 && hasArea(size) && view && view.isDef()) {
      const viewHints = view.getHints(
        this.frameState_ ? this.frameState_.viewHints : void 0
      );
      const viewState = view.getState();
      frameState = {
        animate: false,
        coordinateToPixelTransform: this.coordinateToPixelTransform_,
        declutterTree: null,
        extent: getForViewAndSize(
          viewState.center,
          viewState.resolution,
          viewState.rotation,
          size
        ),
        index: this.frameIndex_++,
        layerIndex: 0,
        layerStatesArray: this.getLayerGroup().getLayerStatesArray(),
        pixelRatio: this.pixelRatio_,
        pixelToCoordinateTransform: this.pixelToCoordinateTransform_,
        postRenderFunctions: [],
        size,
        tileQueue: this.tileQueue_,
        time,
        usedTiles: {},
        viewState,
        viewHints,
        wantedTiles: {},
        mapId: getUid(this),
        renderTargets: {}
      };
      if (viewState.nextCenter && viewState.nextResolution) {
        const rotation = isNaN(viewState.nextRotation) ? viewState.rotation : viewState.nextRotation;
        frameState.nextExtent = getForViewAndSize(
          viewState.nextCenter,
          viewState.nextResolution,
          rotation,
          size
        );
      }
    }
    this.frameState_ = frameState;
    this.renderer_.renderFrame(frameState);
    if (frameState) {
      if (frameState.animate) {
        this.render();
      }
      Array.prototype.push.apply(
        this.postRenderFunctions_,
        frameState.postRenderFunctions
      );
      if (previousFrameState) {
        const moveStart = !this.previousExtent_ || !isEmpty(this.previousExtent_) && !equals$3(frameState.extent, this.previousExtent_);
        if (moveStart) {
          this.dispatchEvent(
            new MapEvent$1(MapEventType.MOVESTART, this, previousFrameState)
          );
          this.previousExtent_ = createOrUpdateEmpty(this.previousExtent_);
        }
      }
      const idle = this.previousExtent_ && !frameState.viewHints[ViewHint.ANIMATING] && !frameState.viewHints[ViewHint.INTERACTING] && !equals$3(frameState.extent, this.previousExtent_);
      if (idle) {
        this.dispatchEvent(
          new MapEvent$1(MapEventType.MOVEEND, this, frameState)
        );
        clone(frameState.extent, this.previousExtent_);
      }
    }
    this.dispatchEvent(new MapEvent$1(MapEventType.POSTRENDER, this, frameState));
    this.renderComplete_ = this.hasListener(MapEventType.LOADSTART) || this.hasListener(MapEventType.LOADEND) || this.hasListener(RenderEventType.RENDERCOMPLETE) ? !this.tileQueue_.getTilesLoading() && !this.tileQueue_.getCount() && !this.getLoadingOrNotReady() : void 0;
    if (!this.postRenderTimeoutHandle_) {
      this.postRenderTimeoutHandle_ = setTimeout(() => {
        this.postRenderTimeoutHandle_ = void 0;
        this.handlePostRender();
      }, 0);
    }
  }
  setLayerGroup(layerGroup) {
    const oldLayerGroup = this.getLayerGroup();
    if (oldLayerGroup) {
      this.handleLayerRemove_(new GroupEvent("removelayer", oldLayerGroup));
    }
    this.set(MapProperty.LAYERGROUP, layerGroup);
  }
  setSize(size) {
    this.set(MapProperty.SIZE, size);
  }
  setTarget(target) {
    this.set(MapProperty.TARGET, target);
  }
  setView(view) {
    if (!view || view instanceof View$1) {
      this.set(MapProperty.VIEW, view);
      return;
    }
    this.set(MapProperty.VIEW, new View$1());
    const map = this;
    view.then(function(viewOptions) {
      map.setView(new View$1(viewOptions));
    });
  }
  updateSize() {
    const targetElement = this.getTargetElement();
    let size = void 0;
    if (targetElement) {
      const computedStyle = getComputedStyle(targetElement);
      const width = targetElement.offsetWidth - parseFloat(computedStyle["borderLeftWidth"]) - parseFloat(computedStyle["paddingLeft"]) - parseFloat(computedStyle["paddingRight"]) - parseFloat(computedStyle["borderRightWidth"]);
      const height = targetElement.offsetHeight - parseFloat(computedStyle["borderTopWidth"]) - parseFloat(computedStyle["paddingTop"]) - parseFloat(computedStyle["paddingBottom"]) - parseFloat(computedStyle["borderBottomWidth"]);
      if (!isNaN(width) && !isNaN(height)) {
        size = [width, height];
        if (!hasArea(size) && !!(targetElement.offsetWidth || targetElement.offsetHeight || targetElement.getClientRects().length)) {
          console.warn(
            "No map visible because the map container's width or height are 0."
          );
        }
      }
    }
    this.setSize(size);
    this.updateViewportSize_();
  }
  updateViewportSize_() {
    const view = this.getView();
    if (view) {
      let size = void 0;
      const computedStyle = getComputedStyle(this.viewport_);
      if (computedStyle.width && computedStyle.height) {
        size = [
          parseInt(computedStyle.width, 10),
          parseInt(computedStyle.height, 10)
        ];
      }
      view.setViewportSize(size);
    }
  }
}
function createOptionsInternal(options) {
  let keyboardEventTarget = null;
  if (options.keyboardEventTarget !== void 0) {
    keyboardEventTarget = typeof options.keyboardEventTarget === "string" ? document.getElementById(options.keyboardEventTarget) : options.keyboardEventTarget;
  }
  const values = {};
  const layerGroup = options.layers && typeof options.layers.getLayers === "function" ? options.layers : new LayerGroup$1({
    layers: options.layers
  });
  values[MapProperty.LAYERGROUP] = layerGroup;
  values[MapProperty.TARGET] = options.target;
  values[MapProperty.VIEW] = options.view instanceof View$1 ? options.view : new View$1();
  let controls;
  if (options.controls !== void 0) {
    if (Array.isArray(options.controls)) {
      controls = new Collection$1(options.controls.slice());
    } else {
      assert(
        typeof options.controls.getArray === "function",
        47
      );
      controls = options.controls;
    }
  }
  let interactions;
  if (options.interactions !== void 0) {
    if (Array.isArray(options.interactions)) {
      interactions = new Collection$1(options.interactions.slice());
    } else {
      assert(
        typeof options.interactions.getArray === "function",
        48
      );
      interactions = options.interactions;
    }
  }
  let overlays;
  if (options.overlays !== void 0) {
    if (Array.isArray(options.overlays)) {
      overlays = new Collection$1(options.overlays.slice());
    } else {
      assert(
        typeof options.overlays.getArray === "function",
        49
      );
      overlays = options.overlays;
    }
  } else {
    overlays = new Collection$1();
  }
  return {
    controls,
    interactions,
    keyboardEventTarget,
    overlays,
    values
  };
}
const Map$1 = Map;
const _sfc_main$1 = defineComponent({
  name: "GymapDraw",
  props: {
    canInsertVertexCondition: {
      type: Boolean,
      default: true
    },
    drawTypeList: {
      type: Array,
      default: () => {
        return [
          "Point",
          "LineString",
          "Circle",
          "Polygon"
        ];
      }
    },
    drawTypeCnameList: {
      type: Array,
      default: () => {
        return [
          "\u70B9",
          "\u7EBF",
          "\u5706",
          "\u591A\u8FB9\u5F62"
        ];
      }
    },
    btnBackground: {
      type: String,
      default: "rgb(102, 102, 102)"
    },
    btnColor: {
      type: String,
      default: "#fff"
    },
    btnActiveBackground: {
      type: String,
      default: "rgb(142, 142, 142)"
    },
    btnActiveColor: {
      type: String,
      default: "#fff"
    },
    deleteActiveBackground: {
      type: String,
      default: "rgb(28 137 189)"
    },
    deleteActiveColor: {
      type: String,
      default: "#fff"
    },
    fillColor: {
      type: String,
      default: "rgba(255, 255, 255, 0.2)"
    },
    strokeColor: {
      type: String,
      default: "#ffcc33"
    },
    strokeWidth: {
      type: Number,
      default: 3
    },
    pointRadius: {
      type: Number,
      default: 7
    }
  },
  emits: ["drawFinish"],
  setup(props, { emit }) {
    const drawCon = ref(null);
    const { proxy } = getCurrentInstance();
    const mapId = proxy.$parent.id;
    const gyMapObj = gyMap$1(mapId);
    const mapFinish = computed(() => gyMapObj.value && gyMapObj.value.mapFinish);
    let drawObj = null;
    let snapObj = null;
    let modify = null;
    let source = ref(null);
    let layer = null;
    let isInit = false;
    const drawType = ref("Point");
    const status = ref("");
    const hasFeature = computed(() => source.value && source.value.getFeatures().length != 0);
    const startDraw = () => {
      if (status.value === "start") {
        return;
      }
      status.value = "start";
      if (!source.value) {
        source.value = new VectorSource$1();
      }
      if (!isInit) {
        isInit = true;
        layer = new LayerVector({
          source: source.value,
          style: {
            "fill-color": props.fillColor,
            "stroke-color": props.strokeColor,
            "stroke-width": props.strokeWidth,
            "circle-radius": props.pointRadius,
            "circle-fill-color": props.strokeColor
          }
        });
        gyMapObj.value.map.addLayer(layer);
        gyMapObj.value.map.on("singleclick", (e) => {
          if (status.value === "delete" && singleClick(e)) {
            gyMapObj.value.map.forEachFeatureAtPixel(e.pixel, (feature2) => {
              layer.getSource().removeFeature(feature2);
              if (!hasFeature.value) {
                startDraw();
              }
              return true;
            }, {
              hitTolerance: 0
            });
          }
        });
      }
      drawObj = new Draw$1({
        source: source.value,
        type: drawType.value
      });
      snapObj = new Snap$1({
        source: source.value
      });
      modify = new Modify$1({
        source: source.value,
        deleteCondition: (e) => {
          return altKeyOnly(e) && singleClick(e);
        },
        insertVertexCondition: (e) => {
          return props.canInsertVertexCondition;
        },
        snapToPointer: false
      });
      gyMapObj.value.map.addInteraction(modify);
      gyMapObj.value.map.addInteraction(drawObj);
      gyMapObj.value.map.addInteraction(snapObj);
    };
    const deleteDraw = () => {
      if (status.value === "start") {
        endDraw();
      }
      status.value = "delete";
    };
    const changeDrawType = (type) => {
      drawType.value = type;
      if (status.value !== "end") {
        endDraw();
        startDraw();
      }
    };
    const endDraw = (finish) => {
      if (status.value !== "end") {
        status.value = "end";
        destory();
        finish && submitData();
      }
    };
    const submitData = () => {
      const features = source.value.getFeatures();
      let data = [];
      features.forEach((feature2) => {
        let geometry = feature2.getGeometry();
        let type = geometry.getType();
        let coordinates2 = geometry.getCoordinates();
        switch (type) {
          case "Circle":
            coordinates2 = [geometry.getCenter()];
            break;
          case "Point":
            coordinates2 = [coordinates2];
            break;
          case "Polygon":
            coordinates2 = coordinates2[0];
            break;
        }
        let lonlats = [];
        coordinates2.forEach((coordinate) => {
          lonlats.push(toLonLat(coordinate));
        });
        let obj = {
          coordinates: lonlats,
          type
        };
        if (type === "Circle") {
          let radius = geometry.getRadius();
          obj.radius = radius;
        }
        data.push(obj);
      });
      emit("drawFinish", data);
    };
    const destory = () => {
      gyMapObj.value.map.removeInteraction(modify);
      gyMapObj.value.map.removeInteraction(drawObj);
      gyMapObj.value.map.removeInteraction(snapObj);
    };
    onMounted(() => {
      drawCon.value.style.setProperty("--btnBackground", props.btnBackground);
      drawCon.value.style.setProperty("--btnColor", props.btnColor);
      drawCon.value.style.setProperty("--deleteActiveBackground", props.deleteActiveBackground);
      drawCon.value.style.setProperty("--deleteActiveColor", props.deleteActiveColor);
      drawCon.value.style.setProperty("--btnActiveBackground", props.btnActiveBackground);
      drawCon.value.style.setProperty("--btnActiveColor", props.btnActiveColor);
    });
    onBeforeUnmount(() => {
      destory();
    });
    return {
      drawCon,
      drawType,
      status,
      gyMapObj,
      mapFinish,
      hasFeature,
      startDraw,
      deleteDraw,
      changeDrawType,
      endDraw,
      submitData,
      destory
    };
  }
});
const GymapDraw_vue_vue_type_style_index_0_scoped_7b4fbe16_lang = "";
const _hoisted_1 = {
  class: "draw-btns-list",
  ref: "drawCon"
};
const _hoisted_2 = { class: "draw-type draw-btn draw-type-select" };
const _hoisted_3 = { class: "draw-type-select-con" };
const _hoisted_4 = ["onClick"];
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return withDirectives((openBlock(), createElementBlock("div", _hoisted_1, [
    withDirectives(createElementVNode("div", {
      class: "draw-start draw-btn",
      onClick: _cache[0] || (_cache[0] = (...args) => _ctx.startDraw && _ctx.startDraw(...args))
    }, "\u5F00\u59CB\u7ED8\u5236", 512), [
      [vShow, !_ctx.status || _ctx.status === "end"]
    ]),
    withDirectives(createElementVNode("div", _hoisted_2, [
      createTextVNode(" \u7ED8\u5236\u7C7B\u578B "),
      createElementVNode("div", _hoisted_3, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.drawTypeList, (item, index2) => {
          return openBlock(), createElementBlock("div", {
            key: "type" + index2,
            class: normalizeClass(["draw-type-option", { "active": _ctx.drawType === item }]),
            onClick: ($event) => _ctx.changeDrawType(item)
          }, toDisplayString(_ctx.drawTypeCnameList[index2] || "\u5F85\u5B9A"), 11, _hoisted_4);
        }), 128))
      ])
    ], 512), [
      [vShow, _ctx.status && _ctx.status !== "end"]
    ]),
    withDirectives(createElementVNode("div", {
      class: "draw-end draw-btn",
      onClick: _cache[1] || (_cache[1] = ($event) => _ctx.endDraw(true))
    }, "\u7ED8\u5236\u5B8C\u6210", 512), [
      [vShow, _ctx.status && _ctx.status !== "end"]
    ]),
    withDirectives(createElementVNode("div", {
      class: normalizeClass(["draw-end", "draw-btn", { "active": _ctx.status === "delete" }]),
      onClick: _cache[2] || (_cache[2] = (...args) => _ctx.deleteDraw && _ctx.deleteDraw(...args))
    }, "\u5220\u9664\u56FE\u5F62 ", 2), [
      [vShow, _ctx.hasFeature && (_ctx.status && _ctx.status !== "end")]
    ])
  ], 512)), [
    [vShow, _ctx.mapFinish]
  ]);
}
const GymapDraw = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__scopeId", "data-v-7b4fbe16"]]);
class CreateHeatMapLayer extends createOlLayer {
  constructor(id, position, stylesObj) {
    super(id, stylesObj);
    __publicField(this, "visible");
    __publicField(this, "gradien");
    __publicField(this, "radius");
    __publicField(this, "blur");
    __publicField(this, "weight");
    __publicField(this, "heatMapData");
    __publicField(this, "maxValue");
    __publicField(this, "minValue");
    __publicField(this, "subValue");
    this.gradien = stylesObj.gradien;
    this.weight = stylesObj.weight;
    this.maxValue = stylesObj.maxValue;
    this.minValue = stylesObj.minValue;
    this.heatMapData = computed(() => stylesObj.data);
    this.visible = computed(() => stylesObj.visible);
    this.radius = computed(() => stylesObj.radius);
    this.blur = computed(() => stylesObj.blur);
    this.minZoom = computed(() => stylesObj.minZoom);
    this.maxZoom = computed(() => stylesObj.maxZoom);
    this.opacity = computed(() => stylesObj.opacity);
    this.subValue = 0;
    this.formatMinMaxValue();
    this.draw();
  }
  formatMinMaxValue() {
    if (this.minValue < 0) {
      this.subValue = Math.abs(this.minValue);
      this.minValue = 0;
      this.maxValue = gyMapUtils.flortAdd(this.maxValue, this.subValue);
    }
  }
  checkData() {
    if (this.heatMapData.value.length !== 0) {
      let fitstData = this.heatMapData.value[0];
      if (Array.isArray(fitstData)) {
        if (fitstData.length < 3) {
          console.error("\u8BF7\u4F20\u5165\u6B63\u786E\u7684\u6570\u636E\u683C\u5F0F\uFF01");
          return false;
        }
        return true;
      } else {
        console.error("\u8BF7\u4F20\u5165\u6B63\u786E\u7684\u6570\u636E\u683C\u5F0F\uFF01");
        return false;
      }
    }
    return true;
  }
  addFeature() {
  }
  addFeatures() {
    let features = [];
    if (this.checkData()) {
      features = this.heatMapData.value.map((data) => {
        let lonlat = [data[0], data[1]];
        const geo = new Point$1(gyMapUtils.formatLonLatToPosition(lonlat));
        return new feature({
          geometry: geo,
          data
        });
      });
    }
    return features;
  }
  addSource() {
  }
  addLayer() {
    let weightHandler = this.weight ? (feature2) => this.weight(feature2.get("data"), feature2) : (feature2) => {
      const item = feature2.get("data") || [];
      let value = item[2];
      if (this.subValue !== 0) {
        value = gyMapUtils.flortAdd(value, this.subValue);
      }
      if (value > this.maxValue) {
        return 1;
      } else if (value < this.minValue) {
        return 0;
      } else {
        return value / this.maxValue;
      }
    };
    let features = this.addFeatures();
    let source = new VectorSource$1({
      features
    });
    console.log(features);
    console.log(this.layer);
    this.layer = new HeatMapLayer({
      source,
      blur: this.blur.value,
      radius: this.radius.value,
      visible: this.visible.value,
      gradient: this.gradien,
      weight: weightHandler,
      minZoom: this.minZoom.value,
      maxZoom: this.maxZoom.value,
      opacity: this.opacity.value
    });
    console.log(this.layer);
  }
  addLayerWatch() {
    watch(this.heatMapData, (n) => {
      this.destory();
      this.addLayer();
      this.addLayerToMap();
    });
    watch(this.visible, (n) => {
      var _a;
      (_a = this.layer) == null ? void 0 : _a.setVisible(n);
    });
    watch(this.radius, (n) => {
      var _a;
      (_a = this.layer) == null ? void 0 : _a.setRadius(n);
    });
    watch(this.blur, (n) => {
      var _a;
      (_a = this.layer) == null ? void 0 : _a.setBlur(n);
    });
    watch(this.minZoom, (n) => {
      var _a;
      (_a = this.layer) == null ? void 0 : _a.setMinZoom(n);
    });
    watch(this.maxZoom, (n) => {
      var _a;
      (_a = this.layer) == null ? void 0 : _a.setMaxZoom(n);
    });
    watch(this.opacity, (n) => {
      var _a;
      (_a = this.layer) == null ? void 0 : _a.setOpacity(n);
    });
  }
  addPropsWatch() {
    watch(this.stylesObj, () => {
    });
  }
}
const layerProps = {
  data: {
    type: Array,
    default: () => []
  },
  visible: {
    type: Boolean,
    default: true
  },
  gradien: {
    type: Array,
    default: () => ["#00f", "#0ff", "#0f0", "#ff0", "#f00"]
  },
  radius: {
    type: Number,
    default: 100
  },
  blur: {
    type: Number,
    default: 100
  },
  maxValue: {
    type: Number,
    default: 1
  },
  minValue: {
    type: Number,
    default: 0
  },
  subValue: {
    type: Number,
    default: 0
  },
  weight: {
    type: [String, Function],
    default: ""
  },
  minZoom: {
    type: Number,
    default: 1
  },
  maxZoom: {
    type: Number,
    default: 18
  },
  opacity: {
    type: Number,
    default: 1
  }
};
const _sfc_main = defineComponent({
  name: "GymapHeat",
  props: {
    ...layerProps
  },
  setup(props) {
    const { proxy } = getCurrentInstance();
    const mapId = proxy.$parent.id;
    let layerObj = null;
    onMounted(() => {
      layerObj = new CreateHeatMapLayer(mapId, props.position, props);
      console.log(layerObj);
    });
    const destory = () => {
      layerObj.destory();
      layerObj = null;
    };
    onBeforeUnmount(() => {
      destory();
    });
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return null;
}
const GymapHeat = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
const components = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GyMap: Gymap,
  GymapHtml,
  GymapPolygon,
  GymapLine,
  GymapTask,
  GymapCircle,
  GymapText,
  GymapImage,
  GymapDraw,
  GymapHeat
}, Symbol.toStringTag, { value: "Module" }));
const Property = {
  ELEMENT: "element",
  MAP: "map",
  OFFSET: "offset",
  POSITION: "position",
  POSITIONING: "positioning"
};
class Overlay extends BaseObject$1 {
  constructor(options) {
    super();
    this.on;
    this.once;
    this.un;
    this.options = options;
    this.id = options.id;
    this.insertFirst = options.insertFirst !== void 0 ? options.insertFirst : true;
    this.stopEvent = options.stopEvent !== void 0 ? options.stopEvent : true;
    this.element = document.createElement("div");
    this.element.className = options.className !== void 0 ? options.className : "ol-overlay-container " + CLASS_SELECTABLE;
    this.element.style.position = "absolute";
    this.element.style.pointerEvents = "auto";
    this.autoPan = options.autoPan === true ? {} : options.autoPan || void 0;
    this.rendered = {
      transform_: "",
      visible: true
    };
    this.mapPostrenderListenerKey = null;
    this.addChangeListener(Property.ELEMENT, this.handleElementChanged);
    this.addChangeListener(Property.MAP, this.handleMapChanged);
    this.addChangeListener(Property.OFFSET, this.handleOffsetChanged);
    this.addChangeListener(Property.POSITION, this.handlePositionChanged);
    this.addChangeListener(Property.POSITIONING, this.handlePositioningChanged);
    if (options.element !== void 0) {
      this.setElement(options.element);
    }
    this.setOffset(options.offset !== void 0 ? options.offset : [0, 0]);
    this.setPositioning(options.positioning || "top-left");
    if (options.position !== void 0) {
      this.setPosition(options.position);
    }
  }
  getElement() {
    return this.get(Property.ELEMENT);
  }
  getId() {
    return this.id;
  }
  getMap() {
    return this.get(Property.MAP) || null;
  }
  getOffset() {
    return this.get(Property.OFFSET);
  }
  getPosition() {
    return this.get(Property.POSITION);
  }
  getPositioning() {
    return this.get(Property.POSITIONING);
  }
  handleElementChanged() {
    removeChildren(this.element);
    const element = this.getElement();
    if (element) {
      this.element.appendChild(element);
    }
  }
  handleMapChanged() {
    if (this.mapPostrenderListenerKey) {
      removeNode$1(this.element);
      unlistenByKey(this.mapPostrenderListenerKey);
      this.mapPostrenderListenerKey = null;
    }
    const map = this.getMap();
    if (map) {
      this.mapPostrenderListenerKey = listen(
        map,
        MapEventType.POSTRENDER,
        this.render,
        this
      );
      this.updatePixelPosition();
      const container = this.stopEvent ? map.getOverlayContainerStopEvent() : map.getOverlayContainer();
      if (this.insertFirst) {
        container.insertBefore(this.element, container.childNodes[0] || null);
      } else {
        container.appendChild(this.element);
      }
      this.performAutoPan();
    }
  }
  render() {
    this.updatePixelPosition();
  }
  handleOffsetChanged() {
    this.updatePixelPosition();
  }
  handlePositionChanged() {
    this.updatePixelPosition();
    this.performAutoPan();
  }
  handlePositioningChanged() {
    this.updatePixelPosition();
  }
  setElement(element) {
    this.set(Property.ELEMENT, element);
  }
  setMap(map) {
    this.set(Property.MAP, map);
  }
  setOffset(offset) {
    this.set(Property.OFFSET, offset);
  }
  setPosition(position) {
    this.set(Property.POSITION, position);
  }
  performAutoPan() {
    if (this.autoPan) {
      this.panIntoView(this.autoPan);
    }
  }
  panIntoView(panIntoViewOptions) {
    const map = this.getMap();
    if (!map || !map.getTargetElement() || !this.get(Property.POSITION)) {
      return;
    }
    const mapRect = this.getRect(map.getTargetElement(), map.getSize());
    const element = this.getElement();
    const overlayRect = this.getRect(element, [
      outerWidth(element),
      outerHeight(element)
    ]);
    panIntoViewOptions = panIntoViewOptions || {};
    const myMargin = panIntoViewOptions.margin === void 0 ? 20 : panIntoViewOptions.margin;
    if (!containsExtent(mapRect, overlayRect)) {
      const offsetLeft = overlayRect[0] - mapRect[0];
      const offsetRight = mapRect[2] - overlayRect[2];
      const offsetTop = overlayRect[1] - mapRect[1];
      const offsetBottom = mapRect[3] - overlayRect[3];
      const delta = [0, 0];
      if (offsetLeft < 0) {
        delta[0] = offsetLeft - myMargin;
      } else if (offsetRight < 0) {
        delta[0] = Math.abs(offsetRight) + myMargin;
      }
      if (offsetTop < 0) {
        delta[1] = offsetTop - myMargin;
      } else if (offsetBottom < 0) {
        delta[1] = Math.abs(offsetBottom) + myMargin;
      }
      if (delta[0] !== 0 || delta[1] !== 0) {
        const center = map.getView().getCenterInternal();
        const centerPx = map.getPixelFromCoordinateInternal(center);
        if (!centerPx) {
          return;
        }
        const newCenterPx = [centerPx[0] + delta[0], centerPx[1] + delta[1]];
        const panOptions = panIntoViewOptions.animation || {};
        map.getView().animateInternal({
          center: map.getCoordinateFromPixelInternal(newCenterPx),
          duration: panOptions.duration,
          easing: panOptions.easing
        });
      }
    }
  }
  getRect(element, size) {
    const box = element.getBoundingClientRect();
    const offsetX = box.left + window.pageXOffset;
    const offsetY = box.top + window.pageYOffset;
    return [offsetX, offsetY, offsetX + size[0], offsetY + size[1]];
  }
  setPositioning(positioning) {
    this.set(Property.POSITIONING, positioning);
  }
  setVisible(visible) {
    if (this.rendered.visible !== visible) {
      this.element.style.display = visible ? "" : "none";
      this.rendered.visible = visible;
    }
  }
  updatePixelPosition() {
    const map = this.getMap();
    const position = this.getPosition();
    if (!map || !map.isRendered() || !position) {
      this.setVisible(false);
      return;
    }
    const pixel = map.getPixelFromCoordinate(position);
    const mapSize = map.getSize();
    this.updateRenderedPosition(pixel, mapSize);
  }
  updateRenderedPosition(pixel, mapSize) {
    const style = this.element.style;
    const offset = this.getOffset();
    const positioning = this.getPositioning();
    this.setVisible(true);
    const x = Math.round(pixel[0] + offset[0]) + "px";
    const y = Math.round(pixel[1] + offset[1]) + "px";
    let posX = "0%";
    let posY = "0%";
    if (positioning == "bottom-right" || positioning == "center-right" || positioning == "top-right") {
      posX = "-100%";
    } else if (positioning == "bottom-center" || positioning == "center-center" || positioning == "top-center") {
      posX = "-50%";
    }
    if (positioning == "bottom-left" || positioning == "bottom-center" || positioning == "bottom-right") {
      posY = "-100%";
    } else if (positioning == "center-left" || positioning == "center-center" || positioning == "center-right") {
      posY = "-50%";
    }
    const transform2 = `translate(${posX}, ${posY}) translate(${x}, ${y})`;
    if (this.rendered.transform_ != transform2) {
      this.rendered.transform_ = transform2;
      style.transform = transform2;
    }
  }
  getOptions() {
    return this.options;
  }
}
const Overlay$1 = Overlay;
const BASTURL = "http://172.18.8.146:30000";
let gyMapResultObj = {};
const gyMapInit = (type) => {
  type = type || "";
  if (type && gyMapResultObj[type]) {
    return gyMapResultObj[type];
  }
  const getRightZoom = (zoom2) => {
    return Math.max(mapOpt.minZoom, Math.min(Number(zoom2 || 0), mapOpt.maxZoom));
  };
  const formatOpt = () => {
    mapOpt.minZoom = Math.max(1, mapOpt.minZoom);
    mapOpt.maxZoom = Math.min(18, mapOpt.maxZoom);
    zoom.value = getRightZoom(mapOpt.zoom);
  };
  let map = ref(null);
  let view = ref(null);
  let mapOpt = {
    layerOpacity: 1,
    maplayerIndex: 0,
    centerPoint: [116.40531, 39.896884],
    minZoom: 1,
    maxZoom: 18,
    zoom: 16,
    extent: void 0,
    mapUrlList: [
      "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
      BASTURL + "/map/gaodeMap/ccMap/{z}/{x}/{y}.jpg"
    ]
  };
  let zoom = ref(getRightZoom(mapOpt.zoom));
  let contentId = "";
  let tileLayerList = [];
  let layerIndex = -1;
  let mapFinish = ref(false);
  const init = (id, opt) => {
    if (!id) {
      console.error(`not find ${id}`);
      return;
    }
    initOptions(id, opt);
    initTileLayerList();
    initMap();
    changeMapLayer(mapOpt.maplayerIndex);
  };
  let initOptions = (id, opt) => {
    contentId = id;
    mapOpt = Object.assign({}, mapOpt, opt);
    formatOpt();
    let extent = mapOpt.extent || void 0;
    if (extent) {
      let lonlat1 = extent[0];
      let lonlat2 = extent[1];
      if (lonlat1 && lonlat2) {
        let c1 = gyMapUtils.formatLonLatToPosition(lonlat1);
        let c2 = gyMapUtils.formatLonLatToPosition(lonlat2);
        let ex = [
          Math.min(c1[0], c2[0]),
          Math.min(c1[1], c2[1]),
          Math.max(c1[0], c2[0]),
          Math.max(c1[1], c2[1])
        ];
        mapOpt.extent = ex;
      } else {
        mapOpt.extent = void 0;
      }
    }
  };
  const initMap = () => {
    view.value = markRaw(new View$1({
      center: gyMapUtils.formatLonLatToPosition(mapOpt.centerPoint),
      zoom: zoom.value,
      minZoom: mapOpt.minZoom,
      maxZoom: mapOpt.maxZoom,
      extent: mapOpt.extent
    }));
    map.value = markRaw(new Map$1({
      layers: tileLayerList,
      target: contentId,
      view: view.value,
      controls: []
    }));
    mapFinish.value = true;
  };
  const initTileLayerList = () => {
    tileLayerList = [];
    let mapUrlList = mapOpt.mapUrlList;
    if (!Array.isArray(mapUrlList)) {
      mapUrlList = [mapUrlList];
    }
    mapUrlList.forEach((v) => {
      tileLayerList.push(
        new TileLayer$1({
          visible: false,
          opacity: mapOpt.layerOpacity,
          source: new XYZ$1({
            url: v
          })
        })
      );
    });
  };
  const zoomSetFun = (val) => {
    let zoomVal = getRightZoom(Number(val));
    if (zoomVal === zoom.value) {
      return;
    }
    view.value && view.value.animate({ zoom: zoomVal, duration: 800 });
    zoom.value = zoomVal;
  };
  const zoomAddFun = () => {
    zoomSetFun(zoom.value + 1);
  };
  const zoomSubFun = () => {
    zoomSetFun(zoom.value - 1);
  };
  const changeMapLayer = (index2) => {
    var _a, _b;
    index2 = Number(index2 || 0);
    if (layerIndex === index2) {
      return;
    }
    let len = tileLayerList.length;
    let i = Math.max(0, Math.min(index2, len));
    if (layerIndex !== -1) {
      (_a = tileLayerList[layerIndex]) == null ? void 0 : _a.setVisible(false);
    }
    (_b = tileLayerList[i]) == null ? void 0 : _b.setVisible(true);
    layerIndex = i;
  };
  const changeCenterPoint = (center) => {
    let point = gyMapUtils.formatLonLatToPosition(center);
    view.value && view.value.animate({ center: point, duration: 800 });
  };
  const drawHtmlToMap = (id, {
    position,
    offset = [0, 0],
    stopEvent = true,
    className = ""
  }) => {
    let dom = null;
    if (typeof id === "object") {
      if (id instanceof HTMLElement) {
        dom = [id];
      } else {
        console.error(`\u8BF7\u4F20\u5165\u6B63\u786E\u7684dom\u5BF9\u8C61\uFF01`);
        return null;
      }
    } else if (typeof id === "string") {
      dom = document.querySelectorAll(id);
      if (dom.length === 0) {
        console.error(`not find ${id}`);
        return null;
      }
    }
    if (!Array.isArray(position)) {
      console.error(`position \u683C\u5F0F\u4E0D\u6B63\u786E\uFF0C\u5E94\u8BE5\u4E3A [\u7ECF\u5EA6\uFF0C\u7EAC\u5EA6]`);
      return null;
    }
    let overlayList = [];
    Array.prototype.forEach.call(dom, (v) => {
      let overlay = new Overlay$1({
        element: v,
        position: gyMapUtils.formatLonLatToPosition(position),
        insertFirst: false,
        autoPan: true,
        stopEvent,
        className: "ol-overlay-container ol-selectable " + className,
        offset
      });
      map.value && map.value.addOverlay(overlay);
      overlayList.push(overlay);
    });
    if (overlayList.length === 1) {
      return overlayList[0];
    } else {
      return overlayList;
    }
  };
  const removeOverlay = (overlay) => {
    overlay && map.value && map.value.removeOverlay(overlay);
  };
  const setLayerOpacity = (val) => {
    let layer = tileLayerList[layerIndex];
    layer && layer.setOpacity(val);
  };
  const destory = () => {
    delete gyMapResultObj[type];
  };
  let result = ref({
    contentId: type,
    map,
    view,
    mapFinish,
    zoom,
    init,
    zoomSetFun,
    zoomAddFun,
    zoomSubFun,
    changeMapLayer,
    changeCenterPoint,
    drawHtmlToMap,
    removeOverlay,
    setLayerOpacity,
    destory
  });
  gyMapResultObj[type] = result;
  return result;
};
const gyMap = (type) => {
  if (gyMapResultObj[type]) {
    return gyMapResultObj[type];
  }
  return gyMapInit.call(void 0, type);
};
const gyMap$1 = gyMap;
let install = (Vue) => {
  if (!install.installed) {
    const _components = Object.keys(components).map(
      (key) => components[key]
    );
    _components.forEach((component) => {
      if ((component.hasOwnProperty("name") || component.hasOwnProperty("__name")) && component.hasOwnProperty("setup")) {
        Vue.component(component.name || component.__name, component);
      }
    });
  }
};
const index = {
  install
};
export {
  Gymap as GyMap,
  GymapCircle,
  GymapDraw,
  GymapHeat,
  GymapHtml,
  GymapImage,
  GymapLine,
  GymapPolygon,
  GymapTask,
  GymapText,
  index as default,
  gyMap$1 as gyMap,
  install
};
