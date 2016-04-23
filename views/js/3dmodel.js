var createSpaceScene = function() {
	
	scene = new BABYLON.Scene(engine);
	
    //Adding a light
    var light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(20, 20, 100), scene);

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
    earthMaterial.diffuseTexture = new BABYLON.Texture('views/images/earth.jpg', scene);
    earthMaterial.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.3);
    earthMaterial.emissiveColor = BABYLON.Color3.White();

    var godrays = new BABYLON.VolumetricLightScatteringPostProcess('godrays', 1.0, camera, null, 100, BABYLON.Texture.BILINEAR_SAMPLINGMODE, engine, false);

    // By default it uses a billboard to render the sun, just apply the desired texture
    // position and scale
    godrays.mesh.material.diffuseTexture = new BABYLON.Texture('views/images/sun.png', scene, true, false, BABYLON.Texture.BILINEAR_SAMPLINGMODE);
    godrays.mesh.material.diffuseTexture.hasAlpha = true;
    godrays.mesh.position = new BABYLON.Vector3(-150, 150, 150);
    godrays.mesh.scaling = new BABYLON.Vector3(35, 35, 35);

    light.position = godrays.mesh.position;

	return scene;
};
