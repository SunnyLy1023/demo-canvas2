var canvasWidth=Math.min(600, $(window).width()-80);
var canvasHeight=Math.min(500, $(window).height()-100);


var cans=document.getElementById("canvas");
var control=document.getElementById("control");
var clear_btn=control.getElementsByClassName("clear-btn")[0];

var context=cans.getContext("2d");
var ev=event||window.event;


var isMousedown=false;
var startpoint={x:0, y:0};
var lastTime=0;
var lastLineWidth=-1;
var strokeColor="black";

cans.width=canvasWidth;
cans.height=canvasHeight;
$('#control').css("margin-left",canvasWidth/2+canvasWidth*1/100+'px');
//$('#control').css("height",canvasWidth*8/10+'px');
drawGrid();

//画板字体颜色变化
$('#control .color-btn').click(function(){
	$('#control .color-btn').removeClass('active');
	$(this).addClass('active');
	strokeColor=$(this).css('background-color');
});
//清除画板
clear_btn.onclick=function(){
	context.clearRect(0,0,cans.width,cans.height);
	drawGrid();
}
//鼠标点击或触摸频幕的操作
function downStroke(point){
	isMousedown=true;
	startpoint=windowTocanvas(point.x, point.y);
	lastTime=new Date().getTime();
}
//鼠标离开或触摸停止的操作
function endStroke(){
	isMousedown=false;
}
//鼠标移动或触摸滑动的操作
function moveStroke(point){
	
	var movepoint=windowTocanvas(point.x, point.y);
	var endTime=new Date().getTime();
	//两点之间的距离和绘制时间
	var s=getDistance(startpoint,movepoint);
	var t=endTime-lastTime;
	var endlinWidth=getLinWidth(s, t);

	//开始绘制
	context.strokeStyle=strokeColor;
	context.lineWidth=endlinWidth;
	context.beginPath();
	context.moveTo(startpoint.x, startpoint.y);
	context.lineTo(movepoint.x, movepoint.y);
	context.lineCap="round";
	context.lineJoin="round";
	context.stroke();
	
	//重新改变初始值;
	startpoint=movepoint;
	lastTime=endTime;
	lastLineWidth=endlinWidth;
}
cans.onmousedown=function(ev){
	ev.preventDefault();
	downStroke({x:ev.clientX, y:ev.clientY});
}
cans.onmouseup=function(ev){
	ev.preventDefault();
	endStroke();
}
cans.onmousemove=function(ev){
	ev.preventDefault();
	if(isMousedown){
		moveStroke({x:ev.clientX, y:ev.clientY});
	}
	
}
cans.onmouseout=function(ev){
	ev.preventDefault();
	endStroke();
}
cans.addEventListener('touchstart',function(ev){
	ev.preventDefault();
	var tou=ev.touches[0];
	downStroke({x:tou.pageX, y:tou.pageY});
});
cans.addEventListener('touchmove',function(ev){
	ev.preventDefault();
	var tou=ev.touches[0];
	if(isMousedown){
		moveStroke({x:tou.pageX, y:tou.pageY});
	}
});
cans.addEventListener('touchend',function(ev){
	ev.preventDefault();
	endStroke();
});
var minSpeed=0.1;
var maxSpeed=5;
var minLineWidth=1;
var maxLineWidth=10;
//获取最终根据书写速度快慢的字体痕迹大小
function getLinWidth(s,t){
	var v=s/t;
	var resultWidth;
	if(v<=minSpeed){
		resultWidth=maxLineWidth;
	}else if (v>=maxSpeed) {
		resultWidth=minLineWidth;
	}else{
		resultWidth=maxLineWidth-(v-minSpeed)/(maxSpeed-minSpeed)*(maxLineWidth-minLineWidth);
	}
	if(lastLineWidth = -1){
		return resultWidth;
	}else{
		return lastLineWidth*3/5+resultWidth*2/5;
	}
}
//获取两点之间的距离
function getDistance(loc1, loc2){
	return Math.sqrt((loc1.x-loc2.x)*(loc1.x-loc2.x)+(loc1.y-loc2.y)*(loc1.y-loc2.y));
}
//获取canvas里的鼠标坐标
function windowTocanvas(x, y){
	var canXY=cans.getBoundingClientRect();
	return {x:x-canXY.left, y:y-canXY.top};
}

//绘制米字格
function drawGrid(){
	
	context.save();
	
	context.strokeStyle="rgb(230,11,9)";
	context.lineWidth=6;
	
	context.beginPath();
	context.moveTo(3,3);
	context.lineTo(canvasWidth-3,3);
	context.lineTo(canvasWidth-3,canvasHeight-3);
	context.lineTo(3,canvasHeight-3);
	context.closePath();
	context.stroke();
	

	context.lineWidth=1;
	
	context.beginPath();
	context.moveTo(0,0);
	context.lineTo(canvasWidth,canvasHeight);
	
	context.moveTo(canvasWidth,0);
	context.lineTo(0,canvasHeight);
	
	context.moveTo(canvasWidth/2,0);
	context.lineTo(canvasWidth/2,canvasHeight);
	
	context.moveTo(0,canvasHeight/2);
	context.lineTo(canvasWidth,canvasHeight/2);
	
	context.stroke();
	
	context.restore();
}
