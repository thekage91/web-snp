THREE.Curves = {};

THREE.Curves.HelixCurve = THREE.Curve.create(

	function() {

	},

	function(t) {

		var a = 25; // radius - era 30
		var b = 300; // height - era 150
		var t2 = 2 * Math.PI * t * b / 120; //era 30, è il livello di allungamento
		var tx = Math.cos(t2) * a,
			ty = Math.sin(t2) * a,
			tz = b * t;

		return new THREE.Vector3(tx, ty, tz);

	}

);