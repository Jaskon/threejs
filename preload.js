var texturesLoaded = 0;
var texturesToLoad = 0;

function preLoad () {
	THREE.ImageLoader.prototype.crossOrigin = '';
    THREE.MTLLoader.prototype.crossOrigin = '';
    THREE.JSONLoader.prototype.crossOrigin = '';

	/*texturesToLoad++;
	var mtlLoader = new THREE.MTLLoader();			// Old (.obj)
	mtlLoader.setBaseUrl('https://rawgit.com/Jaskon/hi/master/fluttyObj/');
	mtlLoader.setPath('https://rawgit.com/Jaskon/hi/master/fluttyObj/');
	mtlLoader.load('https://rawgit.com/Jaskon/hi/master/fluttyObj/fluttershy.mtl', function(materials) {
		materials.preload();
		var objLoader = new THREE.OBJLoader();
		objLoader.setMaterials(materials);
		objLoader.setPath('https://rawgit.com/Jaskon/hi/master/fluttyObj/');
		objLoader.load('fluttershy.obj', function (object) {
			fluttyModel = object;
    		texturesLoaded++;
		});
	});*/

	var jsonLoader = new THREE.JSONLoader();
	var flut = jsonLoader.parse(fluttershy, "https://rawgit.com/Jaskon/hi/master/model/");
	for (var i = 0; i < flut.materials.length; i++)
		flut.materials[i].skinning = true;
	material = new THREE.MultiMaterial(flut.materials);
	fluttyModel = new THREE.SkinnedMesh(flut.geometry, material);

	mixer = new THREE.AnimationMixer(scene);		//scene
	clock = new THREE.Clock();
	clock.autoStart = true;


	isLoaded();
}

function isLoaded() {
	if (texturesLoaded < texturesToLoad) {
		setTimeout("isLoaded()", 200);
	} else {
		init();
	}
}