
function Adenine(code){

	this.code = code;
	this.mesh = createMesh();

	function createMesh (){

		var material = new THREE.MeshLambertMaterial({color: 0xffffff});
		var shape = new THREE.Shape();

		shape.moveTo(0,0);

		//inserire un arco

		shape.lineTo(8,0);
		

		return new THREE.Mesh(material , shape);
	}
}