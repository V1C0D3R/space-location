var createSpaceScene = function() {
	
	scene = new BABYLON.Scene(engine);
	
	camera = new BABYLON.ArcRotateCamera("Camera", -1.5, 1.3, 500, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, false);
    camera.upperRadiusLimit = 600;
    camera.lowerRadiusLimit = 200;
	
    // target the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // attach the camera to the canvas
    //camera.attachControl(canvas, false);
	
	var earth = BABYLON.Mesh.CreateSphere("earth", 16, 80, scene);
    var earthMaterial = new BABYLON.StandardMaterial("earthMaterial", scene);
    /*earthMaterial.diffuseTexture = new BABYLON.Texture('views/images/earth.jpg', scene);
    earthMaterial.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.8);
    earthMaterial.emissiveColor = BABYLON.Color3.White();*/
    
    earthMaterial.material = earthMaterial;
	return scene;
};
