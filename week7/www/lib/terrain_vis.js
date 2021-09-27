define(function () {
	/*
	* Top level export object
	*/

	return exports = {
	
		Terrain: function(_x, _y, THREE)
		{
			this.num_lon    = _x;    // number of longitude steps
			this.num_lat    = _y;    // number of latitude steps
			this.height_map = [];    // two-dimensional array of elevations
			this.geometry   = "";	

			this.particles = [];
			const constraints = [];

			const diff = new THREE.Vector3();
			const MASS = 0.1;
			const restDistance = 25;

			const xSegs = 10;
			const ySegs = 10;
			
			function plane( width, height ) {
				return function ( u, v, target ) {
					const x = ( u - 0.5 ) * width;
					const y = ( v + 0.5 ) * height;
					const z = 0;
					target.set( x, y, z );
				};
			}

			const geometryFunction = plane( restDistance * xSegs, restDistance * ySegs );
			
			class Particle {
				constructor( x, y, z, mass ) {
					this.position = new THREE.Vector3();
					this.previous = new THREE.Vector3();
					this.original = new THREE.Vector3();
					this.a = new THREE.Vector3( 0, 0, 0 ); // acceleration
					this.mass = mass;
					this.invMass = 1 / mass;
					this.tmp = new THREE.Vector3();
					this.tmp2 = new THREE.Vector3();

					// init
					geometryFunction( x, y, this.position ); // position
					geometryFunction( x, y, this.previous ); // previous
					geometryFunction( x, y, this.original );
				}

				// Force -> Acceleration

				addForce( force ) {
					this.a.add(
						this.tmp2.copy( force ).multiplyScalar( this.invMass )
					);
				}

				// Performs Verlet integration

				integrate( timesq ) {
					const newPos = this.tmp.subVectors( this.position, this.previous );
					newPos.multiplyScalar( DRAG ).add( this.position );
					newPos.add( this.a.multiplyScalar( timesq ) );

					this.tmp = this.previous;
					this.previous = this.position;
					this.position = newPos;

					this.a.set( 0, 0, 0 );
				}
			}			

			// Create particles
			for ( let v = 0; v <= this.num_lat; v ++ ) {
				for ( let u = 0; u <= this.num_lon; u ++ ) {
					this.particles.push(
						new Particle( u / this.num_lon, v / this.num_lat, 0, MASS )
					);
				}
			}

			// Structural
			for ( let v = 0; v < this.num_lat; v ++ ) {
				for ( let u = 0; u < this.num_lon; u ++ ) {
					constraints.push( [
						this.particles[ index( u, v ) ],
						this.particles[ index( u, v + 1 ) ],
						restDistance
					] );

					constraints.push( [
						this.particles[ index( u, v ) ],
						this.particles[ index( u + 1, v ) ],
						restDistance
					] );
				}
			}

			for ( let u = this.num_lon, v = 0; v < this.num_lat; v ++ ) {
				constraints.push( [
					this.particles[ index( u, v ) ],
					this.particles[ index( u, v + 1 ) ],
					restDistance
				] );
			}

			for ( let v = this.num_lat, u = 0; u < this.num_lon; u ++ ) {
				constraints.push( [
					this.particles[ index( u, v ) ],
					this.particles[ index( u + 1, v ) ],
					restDistance
				] );
			}

			//this.particles = particles;
			this.constraints = constraints;

			function index( u, v ) {
				return u + v * ( this.num_lon + 1 );
			}
			this.index = index;
		
			this.generate = function ()
			{
				//generate the terrain;
				for(y = 0; y<this.num_lat; y++) {
				   var row = [];
				   for(x = 0; x<this.num_lon; x++) {
					  row.push(Math.random()*2);
				   }
				   this.height_map.push(row);
				}
			}
			
			this.visualize = function ()
			{
				this.geometry = new THREE.ParametricBufferGeometry( geometryFunction, this.num_lon, this.num_lat );
				var material = new THREE.MeshBasicMaterial(0xffff00ff);
				var mesh = new THREE.Mesh(this.geometry, material);
				
				const p = this.particles;
				for ( let i = 0, il = p.length; i < il; i ++ ) {
					const v = p[ i ].position;
					if(Math.floor(i/this.num_lon) < 300) {
						v.z = this.height_map[Math.floor(i/this.num_lon)][i % this.num_lon];
					}
					this.geometry.attributes.position.setXYZ( i, v.x, v.y, v.z );
				}
				this.geometry.attributes.position.needsUpdate = true;
				this.geometry.computeVertexNormals();
								
				return mesh;
			}
			
			this.perturb = function (ball, ballSize)
			{
				ball.position.z -= 1;
				if(ball.position.z < ballSize/2) {
					ball.position.z = ballSize/2;
				}
				
				//update for collision with ball
				for ( let i = 0, il = this.particles.length; i < il; i ++ ) {
					const particle = this.particles[ i ];
					const pos = particle.position;
					diff.subVectors( pos, ball.position );
					
					// collided
					if ( diff.length() < ballSize ) {
						diff.normalize().multiplyScalar( ballSize );
						pos.copy( ball.position ).add( diff );
						this.geometry.attributes.position.setXYZ( i, pos.x, pos.y, pos.z );
					}
				}				
				this.geometry.attributes.position.needsUpdate = true;
				this.geometry.computeVertexNormals();
				return ball.position;
			}
			
			this.interact = function () 
			{
			}
			
			this.perform_analysis = function ()
			{
				//perform the analysis of the geometry created;
				return true;
			}			
		}		
	}});
