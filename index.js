let titleText;
let playBtn;
let bgMenu;
let grassBg;
let leftKey;
let rightKey;
let upKey;
let downKey;
let keys;
let placeBtn;
let blockPlaced;
let menuBtn;

function startGame(){
	gameArea.start();
	openMenu();
	let gameLoop = setInterval(tick, 30);
}

function tick(){
	gameArea.clearScreen();
	if(gameArea.screenType === "menu"){
		bgMenu.show();
		titleText.show();
		playBtn.show();
	} else if(gameArea.screenType === "game"){
		grassBg.show();
		blockPlaced.forEach(block => block.show());
		player.show();
		upKey.show();
		downKey.show();
		leftKey.show();
		rightKey.show();
		placeBtn.show();
		menuBtn.show();
	}
}

function openMenu(){
	titleText = new createText("Minecraft", 120, "Arial", 300, 150, "black");
	playBtn = new createButton("green", 400, 200, 300, 100, "Play", 60, "Arial", "black"); 
	bgMenu = new bg("bg");
	gameArea.screenType = "menu";
}

function openGame(){
	grassBg = new bg("grass");
	player.x = gameArea.width / 2 - player.width / 2;
	player.y = gameArea.height / 2 - player.height / 2;
	upKey = new createJoystickControl("up");
	downKey = new createJoystickControl("down");
	leftKey = new createJoystickControl("left");
	rightKey = new createJoystickControl("right");
	keys = [upKey, downKey, leftKey, rightKey];
	placeBtn = new createButton("gray", 900, 400, 100, 100, "Place", 37, "Arial", "Black");
	menuBtn = new createButton("gray", 900, 200, 100, 100, "Menu", 37, "Arial", "Black");
	blockPlaced = [];
	gameArea.screenType = "game";
}

const gameArea = {
	canvas: document.createElement("canvas"),
	width: 1080,
	height: 732,
	screenType: "menu",
	start: function() {
		this.canvas.width = this.width;
		this.canvas.height = this.height;
		this.context = this.canvas.getContext("2d");
		document.body.append(this.canvas);
	},
	clearScreen: function() {
		this.context.clearRect(0,0,this.width,this.height);
	}
}

function bg(id) {
	this.image = document.getElementById(id);
	this.x = 0;
	this.y = 0;
	this.width = gameArea.width;
	this.height = gameArea.height;
	this.show = function() {
		gameArea.context.drawImage(this.image, this.x, this.y, this.width, this.height);
	}
}

function createText(textContent, size, font, x, y, color){
	this.textContent = textContent;
	this.size = size;
	this.font = font;
	this.x = x;
	this.y = y;
	this.color = color;
	this.show = function() {
		gameArea.context.font = `${this.size}px ${this.font}`;
		gameArea.context.fillStyle = this.color;
		gameArea.context.fillText(this.textContent, this.x, this.y);
	}
}

function createButton(color, x, y, width, height, textContent, textSize, textFont, textColor){
	this.textContent = textContent;
	this.textSize = textSize;
	this.textFont = textFont;
	this.textColor = textColor;
	this.color = color;
	this.width = width;
	this.height = height;
	this.x = x;
	this.y = y;
	this.show = function() {
		gameArea.context.fillStyle = this.color;
		gameArea.context.fillRect(this.x,this.y,this.width,this.height);
		gameArea.context.font = `${this.textSize}px ${this.textFont}`;
		gameArea.context.fillStyle = this.textColor;
		gameArea.context.fillText(this.textContent, this.x + 10, this.y + this.height / 1.5);
	}
}

function createBlock(color, x, y, width, height){
	this.color = color;
	this.width = width;
	this.height = height;
	this.x = x;
	this.y = y;
	this.show = function() {
		gameArea.context.fillStyle = this.color;
		gameArea.context.fillRect(this.x,this.y,this.width,this.height);
	}
}

function createJoystickControl(type){
	this.type = type;
	this.width = 100;
	this.height = 100;
	this.textSize = 90;
	this.textFont = "Arial";
	this.textColor = "black";
	this.color = "gray";
	this.offsetX = 10;
	this.offsetY = 80;
	let txt = this.type === "up" ? "^" : "?";
	txt = this.type === "down" ? "v" : txt;
	txt = this.type === "left" ? "<" : txt;
	txt = this.type === "right" ? ">" : txt;
	this.txt = txt;
	let x = this.type === "up" ? 100 : 0;
	x = this.type === "down" ? 100: x;
	x = this.type === "left" ? 0 : x;
	x = this.type === "right" ? 200 : x;
	this.x = x + this.offsetX;
	let y = this.type === "up" ? 400 : 200;
	y = this.type === "down" ? 400 + this.width : y;
	y = this.type === "left" ? 400 + this.width : y;
	y = this.type === "right" ? 400 + this.width: y;
	this.y = y + this.offsetY;
	this.clicked = () => {
		let move = this.type === "up" ? "+y" : " ";
		move = this.type === "down" ?"-y" :move;
		move = this.type === "left" ? "-x":move;
	}
	let temp = new createButton(this.color, this.x, this.y, this.width, this.height , this.txt, this.textSize, this.textFont, this.textColor);
	this.show = () => {
		temp.show();
	};
}

gameArea.canvas.addEventListener("click", event => {
	const mouse = {
		x: event.offsetX,
		y: event.offsetY
	};
	if(gameArea.screenType === "menu"){
		tick();
		let checking = {
			x: playBtn.x,
			y: playBtn.y,
			width: playBtn.width,
			height: playBtn.height
		}
		let clicked = checkClick(mouse.x,mouse.y,checking.x,checking.y, checking.width, checking.height);
		if(clicked){
			openGame();
		}
	} else if(gameArea.screenType === "game") {
		tick();
		keys.forEach(key => {
			let checking = {
				x: key.x,
				y: key.y,
				width: key.width,
				height: key.height
			}
			let clicked = checkClick(mouse.x,mouse.y,checking.x,checking.y, checking.width, checking.height);
			if(clicked){
				let type = key.type;
				switch(type){
					case "up":
						player.y-=player.speed;
						break;
					case "down":
						player.y+=player.speed;
						break;
					case "left":
						player.x-=player.speed;
						break;
					case "right":
						player.x+=player.speed;
						break;
				}
				
				
			}
		});
		let clicked = checkClick(mouse.x,mouse.y,placeBtn.x,placeBtn.y, placeBtn.width, placeBtn.height);
		if(clicked){
			blockPlaced.push(new createBlock("orange", player.x - 2.5, player.y - 2.5, player.width + 5, player.height + 5));
		}
		clicked = checkClick(mouse.x,mouse.y,menuBtn.x,menuBtn.y, menuBtn.width, menuBtn.height);
		if(clicked){
			openMenu();
		}
	}
});

function checkClick(mouseX, mouseY, objectX, objectY, objectWidth, objectHeight){
	if(mouseX > objectX && mouseX < objectWidth + objectX && mouseY > objectY && mouseY < objectHeight + objectY){
		return true;
	} else {
		return false;
	}
}

const player = {
	width: 80,
	height: 80,
	color: "lightblue",
	x: 0,
	y: 0,
	speed:20,
	show: function() {
		gameArea.context.fillStyle = this.color;
		gameArea.context.fillRect(this.x,this.y,this.width,this.height);
	}
};
