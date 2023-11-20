const index = require('../index.js');
const {phantasmaJS, PhantasmaAPI, ScriptBuilder} = require('phantasma-ts');

global.window.phantasmaJsHw = index;
global.window.phantasmaJS = phantasmaJS;
global.window.PhantasmaAPI = PhantasmaAPI
global.window.ScriptBuilder = ScriptBuilder