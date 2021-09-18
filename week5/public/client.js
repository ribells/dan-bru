import * as THREE from '/build/three.module.js';
import * as terrain_vis from '/build/terrain_vis.js';

///Renderer
var renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

///background
renderer.setClearColor ("#ddccff", 1);

var scene = new THREE.Scene();

///camera
var camera = new THREE.PerspectiveCamera(35, window.innerWidth/window.innerHeight, 1, 10000 );
camera.position.set( 0, 0, 50 );
camera.lookAt( 0, 0, 0 );
camera.zoom = 3;
scene.add( camera );

function render() {
  camera.updateProjectionMatrix();
  //update(false);
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

var terrain = new terrain_vis.Terrain (400, 300, THREE);
var mesh = terrain.generate();

scene.add(mesh);

render();    