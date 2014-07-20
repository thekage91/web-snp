
function opacityTween(material, duration, targetOpacity){

	material.trasparent = true;
	var tweenOpacity = new TWEEN.Tween(material)
		.to({opacity: targetOpacity}, duration)
		.easing(TWEEN.Easing.Linear.None);

	return tweenOpacity;
}

// targetIntensity is a number
function flashTween(light, duration, targetIntesity){

	var tweenFlashBack = new TWEEN.Tween(light)
		.to({intensity: targetIntesity} , duration);

	var tweenFlashUp = new TWEEN.Tween(light)
		.to({intensity: targetIntesity} , duration);
	
	var tweenFlash = new TWEEN.Tween(light)
		.to({intensity: targetIntesity} , duration)
		.easing(TWEEN.Easing.Quartic.InOut)
		.chain(tweenFlashBack);

	return tweenFlash;
}

// targetPosition = new THREE.Vector3(x,y,z);
function positionTween(object, duration, targetPosition){

	var tweenPosition = new TWEEN.Tween(object.position)
		.to({z:targetPosition.z}, duration)
		.easing(TWEEN.Easing.Quadratic.In);

	return tweenPosition;
}