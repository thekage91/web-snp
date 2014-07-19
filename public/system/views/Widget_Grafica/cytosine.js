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

//Function to create a cytosine base
function createCytosine(basesLength, basesRadius) {
    var shape = new THREE.Shape();
    shape.moveTo(0, basesRadius*2);
    shape.lineTo(basesRadius, basesRadius);
    shape.lineTo(0, 0);
    shape.lineTo(basesLength, 0);
    shape.lineTo(basesLength, basesRadius*2);
    shape.lineTo(0, basesRadius*2);

    var shapeGeometry = shape.extrude({amount: basesRadius*2, bevelSize: 0, bevelThickness: 0});
    var shapeMaterial = new THREE.MeshBasicMaterial({color: 0xdda411, side: THREE.DoubleSide});
    var shape = new THREE.Mesh(shapeGeometry, shapeMaterial);

    shape.castShadow = true;
    shape.receiveShadow = true;

    var cytosine = new THREE.Object3D();
    cytosine.add(shape);

    //TODO: Mettere bordi neri
    //shape.wireframe = new THREE.MeshBasicMaterial({color: 0x000000, side: THREE.DoubleSide});
    //shape.wireframeLinewidth = 50;
    //shape.wireFrameLineJoin = meshMaterial.wireframeLinejoin;
        
    //Add the text "C"
    var text = createMesh(new THREE.TextGeometry("C", options), 0x396d35);
    text.position.z = basesRadius*3/2;
    text.position.y = basesRadius/3;
    text.position.x = basesRadius*2;

    text.castShadow = true;
    text.receiveShadow = true;

    cytosine.add(text);

    return cytosine;
}

function createMesh(geom, textColor) {
    var meshMaterial = new THREE.MeshPhongMaterial({specular: 0xffffff, color: textColor, shininess: 100, metal: true});
    var textMesh = new THREE.Mesh(geom, meshMaterial);
    textMesh.castShadow = true;

    return textMesh;
}