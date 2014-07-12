
function Guanine(code){

	this.code = code;
	this.mesh = createMesh();

	function createMesh(){

		var material = new THREE.MeshLambertMaterial({color: 0xffffff});
		var shape = new THREE.Shape();

		shape.moveTo(0,0);
		shape.lineTo(8,0);

		//aggiungere un arco

		shape.lineTo(12,2);
		shape.lineTo(8,4);
		shape.lineTo(0,4);
		shape.lineTo(0,0);


		return new THREE.Mesh(shape , material);
	}

}