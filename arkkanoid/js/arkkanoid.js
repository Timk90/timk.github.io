//получаем канвас
var cvs = document.getElementById("canvas");

//добавляем слушателя на канву для кнопок
document.addEventListener("keydown", moveStick);

//получить context в переменную ctx
var ctx = cvs.getContext("2d");

//добавить картинки
var bg = new Image();
var ball = new Image();
var block = new Image();

bg.src = "img/bg.jpeg";
ball.src = "img/ball.png";

//запускать всё, когда загрузятся все картинки, а точнее самая больша - бэкграунд
bg.onload = paint;

//массив блоков, которые нужно разбивать
var blocks = [];

//набор начальных параметров
var changeX = 2;
var changeY = 3;
var posX = canvas.width/2;
var posY = canvas.height-40;
var stickX = canvas.width/2-30;
var stickY = canvas.height-30;
var stickWidth = 60;
var stickHeight = 10;
var blockWidth = 50;
var blockHeight = 20;

//время запуска приложения
var startTime = new Date().getTime();
var finalTime = 0; 
var lose = false;

//разместить блоки
allignBlocks(72);

//Добавить на канву картинки (повторять)
function paint(){
	ctx.drawImage(bg, 0, 0, 1000, 500);
	drawBlocks(blocks);
	showScore();
	drawStick();
	drawBall();
		
	if(blocks.length == 0){
		drawWin();	
	}
	if(lose){
		drawLose();
	}
	//запрос анимации для повторения отрисовки
	requestAnimationFrame(paint);
}

//декларируем объект блок
function Block(x, y, width, height){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
}

//первоначальное расположение блоков
function allignBlocks(blocksNumber){
		var currentPosX = 16;
		var currentPosY = 3;
		for(var i = 0; i < blocksNumber; i++){
			var block = new Block(currentPosX, currentPosY, blockWidth, blockHeight);
			blocks.push(block);
			if(currentPosX + 2*blockWidth < canvas.width){
				currentPosX = currentPosX + blockWidth + 1;	
			}else{
				currentPosY = currentPosY + blockHeight+1;
				currentPosX = 16;
		}

	}
}

//отрисовка шарика и проверка на столконовения
function drawBall(){

	//удар в границы канвы
	checkCanvaCollision();

	//удар в платформу
	checkStickCollision();

	//удар в угол блока 
	checkAngleCollision();

	//удар снизу или сверху блока
	checkVerticalCollision();

	//удар сбоку блока
	checkHorizontalCollision();

	posX += changeX;
	posY += changeY;

	//нарисовать зеленый круг
	ctx.beginPath();
	ctx.fillStyle = "red";
	ctx.arc(posX, posY, 7, 0, 2 * Math.PI);
	ctx.fill();
	ctx.stroke(); //добавляется граница окружности
	ctx.closePath();
}

function checkCanvaCollision(){
	if(posX+changeX <= 0 ){
		changeX = -changeX;
	}else if(posX+changeX >= canvas.width ){
		changeX = -changeX;
	}else if(posY+changeY <= 0 ){
		changeY = -changeY;
	}else if(posY+changeY >= canvas.height ){
		changeY = -changeY; 
		//changeX = 0;
		//changeY = 0;
		//lose = true;
	}
}

function checkStickCollision(){
	if((posY+changeY >= stickY) && 
		(posY+changeY <= (stickY+stickHeight)) &&
		(posX+changeX < (stickX+stickWidth)) && 
		(posX+changeX > stickX)){
		changeY = -changeY;
	}

	if((posY+changeY > stickY) && (posY+changeY < (stickY+stickHeight)) &&
	  ((posX+changeX >= stickX) && (posX+changeX <= (stickX+stickWidth/30))) ||
	  (posY+changeY > stickY) && (posY+changeY < (stickY+stickHeight)) &&
	  ((posX+changeX <= stickX.width) && (posX+changeX >= (stickX.stickWidth-stickWidth/30)))){
		changeX = -changeX;
	}
}

function checkAngleCollision(){
	for(var i = 0 ; i < blocks.length; i++){
		if(checkUpDownEdge(posY+changeY , blocks[i].y, blocks[i].height) && checkLREdge(posX+changeX , blocks[i].x, blocks[i].width)){
		  	changeY = -changeY;
		  	changeX = -changeX;
		  	blocks.splice(i,1);
		}
	}
}

function checkVerticalCollision(){
	for(var i = 0 ; i < blocks.length; i++){
	  	if(checkUpDownEdge(posY+changeY , blocks[i].y, blocks[i].height) && (posX+changeX  >= blocks[i].x) && (posX+changeX <= blocks[i].x+blocks[i].width)){
		  	changeY = -changeY;
		  	blocks.splice(i,1);
	  	}
	}
}

function checkHorizontalCollision(){
	for(var i = 0 ; i < blocks.length; i++){  	 
		 if(checkLREdge(posX+changeX , blocks[i].x, blocks[i].width) && (posY+changeY  >= blocks[i].y) && (posY+changeY  <= blocks[i].y+blocks[i].height)){
		  	changeX = -changeX;
		  	blocks.splice(i,1);
	  	}
	}
}

function checkUpDownEdge(curY, y, height){
	if(((curY >= y) && (curY <= y+height/5)) ||
	((curY <= y+height) && (curY >= y+height-height/5))){
		return true;
	}else{
		return false;
	}
}

function checkLREdge(curX, x, width){
	if(((curX >= x) && (curX <= x+width/9)) ||
	((curX <= x+width) && (curX >= x+width-width/9))){
		return true;
	}else{
		return false;
	}
}

//отрисовка платформы
function drawStick(){
	ctx.fillStyle = "black";
	ctx.fillRect(stickX, stickY, stickWidth, stickHeight);
    ctx.fillStyle = "white";
	ctx.fillRect(stickX+10, stickY+2, 40, 6);
	ctx.fillStyle = "red";
	ctx.fillRect(stickX+15, stickY+4, 30, 2);
}

//движение платформы
function moveStick(e){
	if(e.keyCode == 39 && stickX+stickWidth < canvas.width){
		stickX +=9;	
	}else if(e.keyCode == 37 && stickX > 0){
		stickX -=9;
	}
}

//нарисовать доступные блоки
function drawBlocks(blocks){
	for(var i = 0; i <blocks.length; i++){
		ctx.fillStyle = "green";
		ctx.fillRect(blocks[i].x, blocks[i].y, blocks[i].width, blocks[i].height);
		ctx.fillStyle = "yellow";
		ctx.fillRect(blocks[i].x+blocks[i].width/4, blocks[i].y+blocks[i].height/4, blocks[i].width/2, blocks[i].height/2);
	}
}

// отрисовать победу
function drawWin(){
	ctx.fillStyle = "green";
	ctx.font = "30px Arial";
	ctx.fillText("YOU WIN", canvas.width/2-70, canvas.height/2);
	ctx.fillText("in "+finalTime+" s", canvas.width/2-45, canvas.height/2+25);
}

// отрисовать поражение
function drawLose(){
	ctx.fillStyle = "red";
	ctx.font = "30px Arial";
	ctx.fillText("YOU LOSE", canvas.width/2-70, canvas.height/2);
	ctx.fillText("in "+finalTime+" s", canvas.width/2-45, canvas.height/2+25);
}

//показать оставшееся кол-во блоков 
function showScore(){
	ctx.font = "18px Arial";
	ctx.fillStyle = "white";

	var currentTime = new Date().getTime();
	var minutes = Math.floor((currentTime - startTime)/1000/60);
	var seconds = Math.floor((currentTime - startTime)/1000);
	seconds = seconds - minutes*60;
	if(seconds < 10){
		seconds = "0"+seconds;
	}
	if(blocks.length >0 && !lose){
		finalTime = minutes+":"+seconds;
		ctx.fillText("Score: blocks left ="+blocks.length, 10, canvas.height);
		ctx.fillText("time: "+finalTime, canvas.width-90, canvas.height);
	}
}



