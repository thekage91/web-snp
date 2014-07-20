var options = {
    size: 7,
    height: 5*2/3,
    font: "helvetiker",
    bevelThickness: 1,
    bevelSize: 0.5,
    bevelSegments: 3,
    bevelEnabled: true,
    curveSegments: 12,
    steps: 1
};

//Function to create a guanine base
function createGuanine(basesLength, basesRadius) {
    var shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0, basesRadius*2);
    shape.lineTo(basesLength/2, basesRadius*2);
    shape.arc(0, 0, basesRadius/2, 2*Math.PI, Math.PI, false);
    shape.lineTo(basesLength - basesRadius, basesRadius*2);
    shape.lineTo(basesLength, basesRadius);
    shape.lineTo(basesLength - basesRadius, 0);
    shape.lineTo(0, 0);

    var shapeGeometry = shape.extrude({amount: basesRadius*2, bevelSize: 0, bevelThickness: 0});
    var shapeMaterial = new THREE.MeshPhongMaterial({color: 0xff0000, side: THREE.DoubleSide});
    var shape = new THREE.Mesh(shapeGeometry, shapeMaterial);

    shape.castShadow = true;
    shape.receiveShadow = true;

    var guanine = new THREE.Object3D();
    guanine.add(shape);

    //TODO: Mettere bordi neri
    //shape.wireframe = new THREE.MeshBasicMaterial({color: 0x000000, side: THREE.DoubleSide});
    //shape.wireframeLinewidth = 50;
    //shape.wireFrameLineJoin = meshMaterial.wireframeLinejoin;
        
    //Add the text "G"
    var text = createMesh(new THREE.TextGeometry("G", options), 0x396d35);
    text.position.z = basesRadius*3/2;
    text.position.y = basesRadius/3;
    text.position.x = basesLength - basesRadius*3;

    text.castShadow = true;
    text.receiveShadow = true;

    guanine.add(text);

    return guanine;
}

function createMesh(geom, textColor) {
    var meshMaterial = new THREE.MeshPhongMaterial({specular: 0xffffff, color: textColor, shininess: 100, metal: true});
    var textMesh = new THREE.Mesh(geom, meshMaterial);
    textMesh.castShadow = true;

    return textMesh;
}