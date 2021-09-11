define(function (require) {
    // Load any app-specific modules with a relative require call like:
    //var sketch = require('mymodule.js');

    // Load library/vendor modules using full IDs:
    var print = require('print');
    var THREE = require('three');
    
	///Renderer
	var renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	///background
	renderer.setClearColor ("#ddccff", 1);

	var scene = new THREE.Scene();

	///camera
	camera = new THREE.PerspectiveCamera(35, window.innerWidth/window.innerHeight, 1, 10000 );
	camera.position.set( 0, 0, 50 );
	camera.lookAt( 0, 0, 0 );
	camera.zoom = 3;
	scene.add( camera );
	
    var terrain = require('terrain_vis');
    var terrain = new terrain.Terrain (400, 300, THREE);
	
	function render() {
	  camera.updateProjectionMatrix();
	  //terrain.interact();
	  renderer.render( scene, camera );
	  requestAnimationFrame( render );  
	}

	///lighting & shadows
	var lightA1 = new THREE.AmbientLight(0xFFFFFF, 0.85);
	scene.add(lightA1);
	var lightD1 = new THREE.DirectionalLight( 0xFFFFFF, 0.85 );
	lightD1.position.set( -20, 600, -20 );
	lightD1.castShadow = true;
	scene.add( lightD1 );
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
    terrain.generate();
    var mesh = terrain.visualize();
	scene.add(mesh);
	
	render();    
	
    print("Application is loaded");
});
