define(function () {
	/*
	* Top level export object
	*/

	return exports = {

		// --- a terrain class (Example parameters: 300, 200, THREE)

		Terrain: function(_x, _y, THREE)
		{
			this.num_lon   = _x;       // number of longitude steps
			this.num_lat  = _y;        // number of latitude steps
			this.height_map = [];      // two-dimensional array of elevations

			this.generate = function ()
			{
				//generate the terrain;
				for(y = 0; y<this.num_lat; y++) {
				   var row = [];
				   for(x = 0; x<this.num_lon; x++) {
				   	  row.push(Math.random()*100);
				   }
				   this.height_map.push(row);
				}
			}
			
			this.visualize = function ()
			{
				console.log(THREE);
				var geometry = new THREE.BufferGeometry();
				const vertices = new Float32Array( [
					-1.0, -1.0,  1.0,
					 1.0, -1.0,  1.0,
					 1.0,  1.0,  1.0,

					 1.0,  1.0,  1.0,
					-1.0,  1.0,  1.0,
					-1.0, -1.0,  1.0
				] );
				geometry.setAttribute('position', new THREE.BufferAttribute(vertices,3));

				var colors = new Float32Array([
					0,0,1, 0,0,0, 0,0,0,
					0,0,1, 0,0,0, 0,0,0
				]);
				geometry.setAttribute('color', new THREE.BufferAttribute(colors,3));

				var material = new THREE.MeshBasicMaterial();
				var mesh = new THREE.Mesh(geometry, material);
				return mesh;
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
	}
});
