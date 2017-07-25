var renderer;
var raycaster;
var scene, camera, cameraYaw, cameraPitch;
var mouse, intersects, INTERSECTED, touch, firstTouch;
var movings = new Array(10);			// 6-9: rotation
var lightList = [];
var meshList1 = [];
var fluttyModel;			// Fluttershy model (for players?)

var socket;
var connected = 0;
var coordsInterval;
var players = [];
var sendingMeshColors = [], sendingMeshColorsN = 0;

var box;
var manager = new THREE.LoadingManager();
var stats;
var mixer, clock;

function init() {

	renderer = new THREE.WebGLRenderer({antialias:true});		//true
	renderer.setSize(window.innerWidth, window.innerHeight);
	//renderer.setClearColor(0xeeeeee);
	document.all.container.appendChild(renderer.domElement);
	
	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();
	touch = new THREE.Vector2();
	firstTouch = new THREE.Vector2();
	euler = new THREE.Euler(0, 0, 0);
	if ("ontouchstart" in window) {
		document.all.container.setAttribute("ontouchstart", "touchStart(event)");
		document.all.container.setAttribute("ontouchmove", "touchMove(event)");
		document.all.container.setAttribute("ontouchend", "touchEnd(event)");
		document.all.chatButton.style.marginLeft = "-" + (document.all.chatButton.clientWidth + 8) + "px";
		document.all.chatButton.style.left = "100%";
	} else {
		document.all.container.setAttribute("onmousedown", "mouseDown(event)");
		document.all.container.setAttribute("onmousemove", "mouseMove(event)");
		document.body.removeChild(document.all.ctrlBut);
		document.body.removeChild(document.all.ctrlButDown);
		document.body.removeChild(document.all.ctrlButUp);
		document.body.removeChild(document.all.chatButton);
	}
	document.addEventListener("keydown", keyDown);
	document.addEventListener("keyup", keyUp);



	scene = new THREE.Scene();

	for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 10; j++) {
			meshList1[i*10 + j] = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 4), new THREE.MeshLambertMaterial({color: 0x008800}));		// Cube
			meshList1[i*10 + j].preventHex = 0x008800;
			meshList1[i*10 + j].currentHex = 0x008800;
			meshList1[i*10 + j].position.set(j*4.5, 0, -i*4.5);
			meshList1[i*10 + j].rotation.set(0, 0, 0);
			meshList1[i*10 + j].number = i*10 + j;
			scene.add(meshList1[i*10 + j]);
		}
	}

	for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 10; j++) {
			meshList1[100 + i*10 + j] = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 4), new THREE.MeshLambertMaterial({color: 0x882088}));		// Cube
			meshList1[100 + i*10 + j].preventHex = 0x882088;
			meshList1[100 + i*10 + j].currentHex = 0x882088;
			meshList1[100 + i*10 + j].position.set(j*4.5 + 54, 0, -i*4.5);
			meshList1[100 + i*10 + j].rotation.set(0, 0, 0);
			meshList1[100 + i*10 + j].number = 100 + i*10 + j;
			scene.add(meshList1[100 + i*10 + j]);
		}
	}



	camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 1000);
	camera.position.set(0, 1.7, -1.7);
	cameraPitch = new THREE.Object3D();
	cameraPitch.add(camera);
	cameraYaw = new THREE.Object3D();
	cameraYaw.position.set(40, 20, 60);
	cameraYaw.add(cameraPitch);
	scene.add(cameraYaw);
	//camera.lookAt(meshList1[39].position);



	lightList[0] = new THREE.HemisphereLight (0xffffff, 0x333333, 2);
	lightList[0].position.set(-100, 100, 70);
	scene.add(lightList[0]);


	/*Del*/
	var canvas = document.createElement('canvas');
	var size = 512;
	canvas.width = size;
	canvas.height = size;
	var ctx = canvas.getContext('2d');

	var x = 0, y = 0, w = 200, h = 80, r = 20;
	ctx.fillStyle = "#ff0000";
	ctx.textAlign = "center";
	ctx.font = '90px Arial';
	ctx.fillText("Hello, World!", size/2, size/2);
	/*ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y);
    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r);
    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h);
    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r);
    ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.closePath();
    ctx.fill();
	ctx.stroke();*/

	var texture = new THREE.Texture(canvas);
	texture.needsUpdate = true;
	var material = new THREE.SpriteMaterial({map: texture, color: 0xffffff, fog: false});
	var sprite = new THREE.Sprite(material);
	sprite.position.set(10,10,11);
	sprite.scale.set(40, 40, 40);
	//sprite.currentHex = 0xffffff;
    //sprite.preventHex = 0xffffff;
	scene.add(sprite);

	THREE.TextureLoader.prototype.crossOrigin = '';
	texture = new THREE.TextureLoader().load("sprite.png");		// http://i.imgur.com/0RdlFrx.png
    material = new THREE.SpriteMaterial({map: texture, color: 0xffffff, fog: false});
    sprite = new THREE.Sprite(material);
    sprite.position.set(10, 10, 12);
    sprite.scale.set(1.5, 1.5, 1.5);
    scene.add(sprite);

    map = new THREE.TextureLoader().load("sprite1.png");		// http://i.imgur.com/ZCexHwt.png
    material = new THREE.SpriteMaterial({map: map, color: 0xffffff, fog: false});
    sprite = new THREE.Sprite(material);
    sprite.position.set(10, 10, 10);
    sprite.scale.set(8, 8, 8);
    scene.add(sprite);

    
	meshList1[0].material.map = map;
    meshList1[0].material.color.setHex(0xffffff);
    meshList1[0].preventHex = 0xffffff;
    meshList1[0].currentHex = 0xffffff;



	/*var jsonLoader = new THREE.JSONLoader();
	var flut = jsonLoader.parse(fluttershy, "https://rawgit.com/Jaskon/hi/master/model/");
	for (var i = 0; i < flut.materials.length; i++) {
		flut.materials[i].skinning = true;
		//flut.materials[i].color.setHex(0x999999);
		//flut.materials[i].map = null;
	}
	material = new THREE.MultiMaterial(flut.materials);
	var mesh = new THREE.SkinnedMesh(flut.geometry, material);		//material
	mesh.position.set(49, 10, 10);
	mesh.scale.set(1, 1, 1);
	scene.add(mesh);

	mixer = new THREE.AnimationMixer(mesh);		//scene
	mixer.clipAction(flut.geometry.animations[0], mesh).play();
	clock = new THREE.Clock();
	clock.autoStart = true;*/
	/*Del*/


	stats = new Stats();
	stats.setMode(0);
	stats.domElement.style.position = "absolute";
	stats.domElement.style.left = "0px";
	stats.domElement.style.top = "30px";
	document.body.appendChild(stats.domElement);

	window.addEventListener('resize', function () {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize(window.innerWidth, window.innerHeight);
	}, false);

	//renderer.render(scene, camera);
	animate();
}


// Render
function animate() {
	stats.begin();

	var delta = clock.getDelta();
	mixer.update(delta);

	if (movings[6] == 1) {
		cameraYaw.rotation.y += 0.02;
	}
	if (movings[7] == 1) {
		cameraPitch.rotation.x -= 0.02;
	}
	if (movings[8] == 1) {
		cameraYaw.rotation.y -= 0.02;
	}
	if (movings[9] == 1) {
		cameraPitch.rotation.x += 0.02;
	}
	
	if (movings[0] > 0) {
		cameraYaw.position.x -= Math.cos(cameraYaw.rotation.y) * movings[0];
		//camera.position.y -= Math.sin(camera.rotation.z);
		cameraYaw.position.z += Math.sin(cameraYaw.rotation.y) * movings[0];
	}
	if (movings[1] > 0) {
		cameraYaw.position.x += Math.sin(cameraYaw.rotation.y) * movings[1];
		//camera.position.y -= Math.sin(camera.rotation.z);
		cameraYaw.position.z += Math.cos(cameraYaw.rotation.y) * movings[1];

	}
	if (movings[2] > 0) {
		cameraYaw.position.x += Math.cos(cameraYaw.rotation.y) * movings[2];
		//camera.position.y += Math.sin(camera.rotation.z);
		cameraYaw.position.z -= Math.sin(cameraYaw.rotation.y) * movings[2];
	}
	if (movings[3] > 0) {
		cameraYaw.position.x -= Math.sin(cameraYaw.rotation.y) * movings[3];
		//camera.position.y -= Math.sin(camera.rotation.z);
		cameraYaw.position.z -= Math.cos(cameraYaw.rotation.y) * movings[3];
	}
	if (movings[4] == 1)
		cameraYaw.position.y -= 1;
	if (movings[5] == 1)
		cameraYaw.position.y += 1;
	
	
	for (var i = 0; i < 200; i++) {
		meshList1[i].rotation.y -= 0.01;
	}
	
	raycaster.setFromCamera(mouse, camera);
	intersects = raycaster.intersectObjects(meshList1);
	if (intersects.length > 0) {
	 	if (INTERSECTED != intersects[0].object) {
	 	 	if (INTERSECTED) 
	 	 	 	INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
	 		INTERSECTED = intersects[0].object;
	 		INTERSECTED.material.color.setHex(0x880000);
	 	}
	} else {
	 	if (INTERSECTED) {
	 	 	INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
	 	 	INTERSECTED = null;
	 	}
	}

	renderer.render(scene, camera);

	stats.end();
	requestAnimationFrame(animate);
}


// Connection
function connect(url) {
	if (!connected) {
		socket = io.connect(url);
		socket.on("connect", function() {

			socket.on("firstConnection", function(data) {			// Players, rays and rotations
				var parse = JSON.parse(data.players);
				for (var i in parse) {
					players[i] = new THREE.Object3D();
					var box = fluttyModel.clone();
					players[i].add(box);
					scene.add(players[i]);
					mixer.clipAction(box.geometry.animations[0], box).play();
				}
				for (var i in data.meshColors) {
					meshList1[i].material.color.setHex( data.meshColors[i] == 1 ? (0x008888) : (meshList1[i].preventHex) );
					meshList1[i].currentHex = data.meshColors[i] == 1 ? (0x008888) : (meshList1[i].preventHex);
				}
				players[data.me] = cameraYaw;
			});

			coordsInterval = setInterval(function() {			// My coords, (ray) and rotation
				if (sendingMeshColorsN > 0) {
					var tSend = [];
					for (var i = 0; i < sendingMeshColorsN; i++)
						tSend[i] = sendingMeshColors[i];
				}
				socket.emit("coords", {"x": cameraYaw.position.x, "y": cameraYaw.position.y, "z": cameraYaw.position.z,
							"rY": cameraYaw.rotation.y, "rX": cameraPitch.rotation.x, "changeColors": tSend});
				sendingMeshColorsN == 0 ? (0) : (sendingMeshColorsN = 0);
			}, 200);

			socket.on("playerConnected", function(data) {
				players[data.name] = new THREE.Object3D();
				var box = fluttyModel.clone();
				players[data.name].add(box);
				scene.add(players[data.name]);
				mixer.clipAction(box.geometry.animations[0], box).play();
			});

			socket.on("coords", function(data) {			// Apply other players coords, ray and rotation
				players[data.name].position.set(data.x, data.y, data.z);
				players[data.name].rotation.y = data.rY;
				players[data.name].children[0].rotation.x = data.rX;
				if (data.changeColors)
					for (var i = 0; i < data.changeColors.length; i++)
						if (meshList1[data.changeColors[i]].currentHex == 0x008888) {
							meshList1[data.changeColors[i]].material.color.setHex(meshList1[data.changeColors[i]].preventHex);
							meshList1[data.changeColors[i]].currentHex = meshList1[data.changeColors[i]].preventHex;
						} else {
							meshList1[data.changeColors[i]].material.color.setHex(0x008888);
							meshList1[data.changeColors[i]].currentHex = 0x008888;
						}
			});

			socket.on("newMessage", function(data) {
				showMessage(data.player, data.message);
			});


			socket.on("playerDisconnected", function(data) {
				scene.remove(players[data.name]);
			});

			connected = 1;
			//document.all.connectButton.innerHTML = "Disconnect";
			document.all.connectButton.style.visibility = "hidden";
		});
	} else {
		clearInterval(coordsInterval);
		socket.disconnect();

		connected = 0;
		document.all.connectButton.innerHTML = "Connect";
	}
}