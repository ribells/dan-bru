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
    var group = new THREE.Group();
	var targetRotation = 0;
	var targetTranslation = 0;
	var targetRotationOnMouseDown = 0;
	var mouseX = 0;
	var mouseY = -1;
	var prevMouseY = -1;
	var mouseXOnMouseDown = 0;
	var windowHalfX = window.innerWidth / 2;
	var windowHalfY = window.innerHeight / 2;

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
	  group.rotation.y += ( targetRotation - group.rotation.y ) * 0.05;
	  group.position.z += ( targetTranslation );
	  
	  if(sphere) {
		pos = terrain.perturb(sphere, ballSize);
	  }
	  proxy.position.x = pos.x;
	  proxy.position.y = pos.y;
	  proxy.position.z = pos.z;
	  renderer.render(scene, camera);
	  requestAnimationFrame(render);
	}

	///lighting & shadows
	var lightA1 = new THREE.AmbientLight(0xFF000F, 0.2);
	scene.add(lightA1);
	var lightD1 = new THREE.DirectionalLight( 0xFF000F, 0.85 );
	lightD1.position.set( -20, -20, 200 );
	lightD1.castShadow = true;
	scene.add( lightD1 );
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	
	group.position.y = 0;
	scene.add(group);
        
    terrain.generate();
    var mesh = terrain.visualize();
	group.add(mesh);
	
	// sphere
	const ballGeo = new THREE.SphereGeometry( ballSize, 32, 16 );
	const ballMaterial = new THREE.MeshBasicMaterial();

	sphere = new THREE.Mesh( ballGeo, ballMaterial );
	sphere.visible = false;
	sphere.position.set(0, 260, 100);
	group.add(sphere);
	
	// sphere-proxy
	const proxyGeo = new THREE.SphereGeometry( ballSize*.8, 32, 16 );
	const proxyMaterial = new THREE.MeshLambertMaterial(0xffff00);
	proxy = new THREE.Mesh( proxyGeo, proxyMaterial );
	proxy.castShadow = true;
	proxy.receiveShadow = true;
	proxy.position.set(0, 260, 100);
	group.add(proxy);
	
	function onDocumentMouseDown( event ) {
		event.preventDefault();
		document.addEventListener( 'mousemove', onDocumentMouseMove, false );
		document.addEventListener( 'mouseup', onDocumentMouseUp, false );
		document.addEventListener( 'mouseout', onDocumentMouseOut, false );
		mouseXOnMouseDown = event.clientX - windowHalfX;
		targetRotationOnMouseDown = targetRotation;
	}

	function onDocumentMouseMove( event ) {
		mouseX = event.clientX - windowHalfX;
		if(prevMouseY == -1) {
			prevMouseY = event.clientY;
			mouseY = event.clientY;
		} else {
			prevMouseY = mouseY;
			mouseY = event.clientY;
			targetTranslation = (mouseY - prevMouseY);
		}
		targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.02;
	}

	function onDocumentMouseUp( event ) {
		document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
		document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
		document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
		prevMouseY = -1; mouseY = -1;
	}

	function onDocumentMouseOut( event ) {
		document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
		document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
		document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
	}

	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	
	render();
	
    print("Application is loaded");
});
