
function Cytosine(code){

	// Code C
	this.code = code;
	this.mesh = createMesh();

	function createMesh(){

		var basesRadius = 5;
		var basesLength = 50;
		var options = {
				        size: 7,
				        height: basesRadius*2/3,
				        font: "helvetiker",
				        bevelThickness: 1,
				        bevelSize: 0.5,
				        bevelSegments: 3,
				        bevelEnabled: true,
				        curveSegments: 12,
				        steps: 1
				      };

		var material = new THREE.MeshLambertMaterial({color: 0xdda411, side: THREE.DoubleSide});
		var shape = new THREE.Shape();
		var geometry = null;
		var text = null;
		var mesh = null;

		/*
		shape.moveTo(0,0);

		shape.lineTo(6,0);
		shape.lineTo(4,2);
		shape.lineTo(6,4);
		shape.lineTo(0,4);
		shape.lineTo(0,0);
		*/

		shape.moveTo(0, basesRadius*2);
        
        shape.lineTo(basesRadius, basesRadius);
        shape.lineTo(0, 0);
        shape.lineTo(basesLength, 0);
        shape.lineTo(basesLength, basesRadius*2);
        shape.lineTo(0, basesRadius*2);

		geometry = shape.extrude({amount: basesRadius*2, bevelSize: 0, bevelThickness: 0});

		text = createMesh(new THREE.TextGeometry(this.code , options), 0x396d35);
        text.position.z = basesRadius*3/2;
        text.position.y = basesRadius/3;
        text.position.x = basesRadius*2;

		mesh = new THREE.Mesh(material , geometry);

		mesh.add(text);

		return mesh;
	}
}