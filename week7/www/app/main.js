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
	camera.position.set( 0, 1000, 200 );
	camera.lookAt( 0, 200, 0 );
	camera.zoom = 3;
	scene.add( camera );
	
    var terrain = require('terrain_vis');
    var terrain = new terrain.Terrain (400, 300, THREE);
    
    var sphere = "";
	const ballSize = 30;
	
	function render() {
	  camera.updateProjectionMatrix();
	  if(sphere) {
		pos = terrain.perturb(sphere, ballSize);
	  }
	  proxy.position.z = pos.z;
	  renderer.render(scene, camera);
	  requestAnimationFrame(render);
	}

	///lighting & shadows
	var lightA1 = new THREE.AmbientLight(0xFF000F, 0.2);
	scene.add(lightA1);
	var lightD1 = new THREE.DirectionalLight( 0xFF000F, 0.85 );
	lightD1.position.set( -20, -20, -200 );
	lightD1.castShadow = true;
	scene.add( lightD1 );
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
    terrain.generate();
    var mesh = terrain.visualize();
	scene.add(mesh);
	
	// sphere
	const ballGeo = new THREE.SphereGeometry( ballSize, 32, 16 );
	const ballMaterial = new THREE.MeshLambertMaterial();

	sphere = new THREE.Mesh( ballGeo, ballMaterial );
	sphere.visible = false;
	sphere.position.set(0, 260, 100);
	scene.add(sphere);
	
	// sphere-proxy
	const proxyGeo = new THREE.SphereGeometry( ballSize*.8, 32, 16 );
	const proxyMaterial = new THREE.MeshLambertMaterial(0xffff00);
	proxy = new THREE.Mesh( proxyGeo, proxyMaterial );
	proxy.castShadow = true;
	proxy.receiveShadow = true;
	proxy.position.set(0, 260, 100);
	scene.add(proxy);
	
	render();    
	
    print("Application is loaded");
});
