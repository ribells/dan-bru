define(function (require) {
    // Load any app-specific modules with a relative require call like:
    //var sketch = require('mymodule.js');

    // Load library/vendor modules using full IDs:
    var print = require('print');
    var THREE = require('three');
    var terrain = require('terrain_vis');

    var terrain = new terrain.Terrain (400, 300, THREE);
    var mesh = terrain.generate();
	
    print("Application is loaded");
});
