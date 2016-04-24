var createSpaceScene = function() {
	
	scene = new BABYLON.Scene(engine);
	
    //Adding a light
    var light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(0, 0, 0), scene);

    // alpha = longitude (rad)
    // beta = latitude (rad)
    // radius = altitude/height
    var alpha = 0;
    var beta = 0;
    var altitude = 1000;
    var cameraTarget = new BABYLON.Vector3(tweetPos.x, tweetPos.y, tweetPos.z);
	camera = new BABYLON.ArcRotateCamera("Camera", alpha, beta, altitude, cameraTarget, scene);
    camera.attachControl(canvas, false);
    /*camera.upperRadiusLimit = 1000000;
    camera.lowerRadiusLimit = 800000;*/

    // attach the camera to the canvas
    //camera.attachControl(canvas, false);
	/*var earth = BABYLON.Mesh.CreateSphere("earth", 16, 80, scene);
    earth.position = new BABYLON.Vector3(earthPos.x, earthPos.y, earthPos.z);
    var earthMaterial = new BABYLON.StandardMaterial("earthMaterial", scene);
    earthMaterial.diffuseTexture = new BABYLON.Texture('views/images/earth.jpg', scene);
    earthMaterial.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.3);
    earthMaterial.emissiveColor = BABYLON.Color3.White();*/

    var godrays = new BABYLON.VolumetricLightScatteringPostProcess('godrays', 1.0, camera, null, 100, BABYLON.Texture.BILINEAR_SAMPLINGMODE, engine, false);

    // By default it uses a billboard to render the sun, just apply the desired texture
    // position and scale
    godrays.mesh.material.diffuseTexture = new BABYLON.Texture('views/images/sun.png', scene, true, false, BABYLON.Texture.BILINEAR_SAMPLINGMODE);
    godrays.mesh.material.diffuseTexture.hasAlpha = true;
    godrays.mesh.position = new BABYLON.Vector3(0, 0, 0);
    godrays.mesh.scaling = new BABYLON.Vector3(695.7, 695.7, 695.7);

    light.position = godrays.mesh.position;

	return scene;
};
