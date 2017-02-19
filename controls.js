var messages = [];
var chatting = 0;

// Mouse, touch, keys
function mouseMove(event) {
	event.preventDefault();
	
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

function mouseDown(event) {
	event.preventDefault();
	
	if (INTERSECTED) {
		if (INTERSECTED.currentHex == 0x008888) {
			INTERSECTED.material.color.setHex(INTERSECTED.preventHex);
			INTERSECTED.currentHex = INTERSECTED.preventHex;
		} else {
			INTERSECTED.material.color.setHex(0x008888);
			INTERSECTED.currentHex = 0x008888;
		}
	 	if (connected) {
		 	sendingMeshColors[sendingMeshColorsN] = INTERSECTED.number;
		 	sendingMeshColorsN++;
		}
		INTERSECTED = null;
	}
}


function touchStart(event) {
	event.preventDefault();
	
	touch.x = event.targetTouches[0].clientX;
	touch.y = event.targetTouches[0].clientY;
	firstTouch.x = event.targetTouches[0].clientX;
	firstTouch.y = event.targetTouches[0].clientY;
}

function touchMove(event) {
	//event.preventDefault();
	
	/*mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
	mouse.y = - (event.touches[0].clientY / window.innerHeight) * 2 + 1;*/
	
	cameraYaw.rotation.y += (touch.x - event.targetTouches[0].clientX) / 500;
	cameraPitch.rotation.x += Math.cos(camera.rotation.y)*(touch.y - event.targetTouches[0].clientY) / 500;
	
	touch.x = event.targetTouches[0].clientX;
	touch.y = event.targetTouches[0].clientY;
}

function touchEnd(event) {
	if (firstTouch.x - touch.x > -2 && firstTouch.x - touch.x < 2 &&
	    firstTouch.y - touch.y > -2 && firstTouch.y - touch.y < 2)
		mouseDown(event);
}


function keyDown(event) {			// A-65, S-83, D-68, W-87, Ctrl-17, Space-32, Enter-13
	if (chatting && event.keyCode != 13) return;
	if (event.keyCode == 65)			// Left
		movings[0] = 1;
	else
	if (event.keyCode == 83)			// Backward
		movings[1] = 1;
	else
	if (event.keyCode == 68)			// Right
		movings[2] = 1;
	else
	if (event.keyCode == 87)			// Forward
		movings[3] = 1;
	else
	if (event.keyCode == 17)			// Down
		movings[4] = 1;
	else
	if (event.keyCode == 32) {			// Up
		event.preventDefault();
		movings[5] = 1;
	}
	else
	if (event.keyCode == 13) {
		event.preventDefault();
		if (connected)
			if (chatting)
				chatSendMessage();
			else
				chatStartMessage();
	}
	
	//
	if (event.keyCode == 37)			// Arrows
		movings[6] = 1;
	else
	if (event.keyCode == 40)
		movings[7] = 1;
	else
	if (event.keyCode == 39)
		movings[8] = 1;
	else
	if (event.keyCode == 38)
		movings[9] = 1;
}

function keyUp(event) {			// 65 83 68 87
	if (event.keyCode == 65)			// Left
		movings[0] = 0;
	else
	if (event.keyCode == 83)			// Back
		movings[1] = 0;
	else
	if (event.keyCode == 68)			// Right
		movings[2] = 0;
	else
	if (event.keyCode == 87)			// Forward
		movings[3] = 0;
	else
	if (event.keyCode == 17)			// Down
		movings[4] = 0;
	else
	if (event.keyCode == 32)			// Up
		movings[5] = 0;
		
	//
	if (event.keyCode == 37)
		movings[6] = 0;
	else
	if (event.keyCode == 40)
		movings[7] = 0;
	else
	if (event.keyCode == 39)
		movings[8] = 0;
	else
	if (event.keyCode == 38)
		movings[9] = 0;
}


function ctrlButStart(event) {
	event.preventDefault();
	
	box = event.targetTouches[0].target.getBoundingClientRect();
	movings[2] = (event.targetTouches[0].clientX - box.left - 100) / 80;
	movings[0] = - movings[2];
	movings[1] = (event.targetTouches[0].clientY - box.top - 100) / 80;
	movings[3] = - movings[1];
}

function ctrlButEnd(event) {
	movings[0] = 0;
	movings[1] = 0;
	movings[2] = 0;
	movings[3] = 0;
}

function ctrlButDownStart(event) {
	event.preventDefault();
	
	movings[4] = 1;
}

function ctrlButDownEnd(event) {
	movings[4] = 0;
}

function ctrlButUpStart(event) {
	event.preventDefault();
	
	movings[5] = 1;
}

function ctrlButUpEnd(event) {
	movings[5] = 0;
}


function chatForTouch() {
	if (!connected)
		return;
	if (!chatting) {
		chatStartMessage();
		document.all.chatButton.innerHTML = "Send message";
	} else {
		chatSendMessage();
		document.all.chatButton.innerHTML = "Chat message";
	}
}

function chatStartMessage() {
	document.all.chatInput.value = "";
	document.all.chatInput.style.visibility = "visible";
	document.all.chatInput.focus();

	chatting = 1;
}

function chatSendMessage() {
	//Sending message to the server
	socket.emit("newMessage", {"message": document.all.chatInput.value});

	document.all.chatInput.style.visibility = "hidden";
	chatting = 0;
}

function showMessage(player, message) {
	if (messages[player]) {			// Fast hide message
		if (messages[player].delInterval) clearInterval(messages[player].delInterval);
		if (messages[player].showingInterval) clearInterval(messages[player].showingInterval);
		if (messages[player].hidingInterval) clearInterval(messages[player].hidingInterval);
		players[player].remove(messages[player]);
		messages[player] = null;
	}

	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');
	ctx.font = "36px Arial";
	var textWidth = ctx.measureText(message).width;
	if (textWidth < 70) textWidth = 70;
	canvas.width = textWidth;
	canvas.height = textWidth;

	ctx.font = "36px Arial";
	ctx.fillStyle = "#ff00ff";
	ctx.textAlign = "center";
	ctx.fillText(message, textWidth/2, textWidth/2);

	var texture = new THREE.Texture(canvas);
	texture.needsUpdate = true;
	var material = new THREE.SpriteMaterial({map: texture, color: 0xffffff, fog: false});
	var sprite = new THREE.Sprite(material);
	sprite.scale.set(textWidth/12, textWidth/12, textWidth/12);
	sprite.position.y += 8;

	messages[player] = sprite;

	messages[player].showingInterval = smoothShowMessage(player, 33);
	players[player].add(messages[player]);
	sprite.delInterval = setTimeout(function() {messages[player].hidingInterval = smoothHideMessage(player, 33);}, 5000);
}

function smoothShowMessage(player, delay) {
	messages[player].material.opacity = 0;
	var interval = setInterval(function() {
		messages[player].material.opacity += 0.15;
		if (messages[player].material.opacity >= 1) {
			messages[player].material.opacity = 1;
			clearInterval(interval);
		}
	}, delay);
	return interval;
}

function smoothHideMessage(player, delay) {
	var interval = setInterval(function() {
		messages[player].material.opacity -= 0.15;
		if (messages[player].material.opacity <= 0) {
			clearInterval(interval);
			messages[player] = null;
		}
	}, delay);
	return interval;
}