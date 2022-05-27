/* eslint-disable */
const require = (modname) => {
  if (typeof BigInt === 'undefined') {
    return;
  }
  const module = requireRaw(modname);
  if (module) {
    return module;
  } else {
    throw Error(`undefined module:'${modname}'`);
  }
};
const requireRaw = (modname) => {
  throw Error(`unknown module:'${modname}'`);
};
if (!window.phantasmaJsHw) {
  window.phantasmaJsHw = {};
}
