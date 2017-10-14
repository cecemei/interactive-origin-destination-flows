var json = require('./florida.json');
var geojsonhint = require('./node_modules/@mapbox/geojsonhint');

console.log(geojsonhint.hint(json));