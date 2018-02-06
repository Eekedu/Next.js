var canvas, cx = null, fps=60;
const PI = Math.PI, HALF_PI = PI/2, QUART_PI = PI/4, TWO_PI = 2 * PI;
var NORMAL = true, CENTER = false;
var mouseX, mouseY, globalMouseX, globalMouseY;
var wWidth, wHeight, width, height, hfwidth, hfheight;
if (useFirebase == null){
  var useFirebase = false;
}

wWidth = window.innerWidth - 4;
wHeight = window.innerHeight - 4;

var mouseDown = false;
var keysDown = [];

function FirebaseInit(apiKey, projectId){
  //Initialize fireBase
  var config = {
    apiKey: apiKey,
    authDomain: projectId + ".firebaseapp.com",
    databaseURL: "https://" + projectId + ".firebaseio.com",
    projectId: projectId
  };
  firebase.initializeApp(config);
  return firebase.database();
}

function FirebaseWatch(database, key, callback, oVeride){
  var rel = database.ref(key);
  var listenFor = oVeride || "value";
  rel.on(listenFor, callback);
  return rel;
}

function FirebaseGetArray(data){
  var retArray = [];
  data.forEach(function(snap){
    var value = snap.val();
    value.key = snap.key;
    retArray.push(value);
  });
  return retArray;
}

window.addEventListener("mousemove", function(event){
  globalMouseX = event.clientX - 8;
  globalMouseY = event.clientY - 8;
});

function API(src){
  this.src = src;
  this.request = new XMLHttpRequest();
  this.request.open('GET', this.src, true);
  this.get = function(callback){
    this.request.onload = function(){
      callback(JSON.parse(this.response));
    };
    this.request.send();
  }
}

function each(arr, callback){
  $.each(arr, callback);
}

function deleteCanvas(){
  canvas.parentNode.removeChild(canvas);
}

function createCanvas(width2, height2, cursorHide){
  canvas = document.createElement("canvas");
  var bod = document.getElementsByTagName("body").item(0);
  bod.insertBefore(canvas, bod.firstChild);
  bod.style.margin = "0px";
  canvas.width = width2;
  canvas.height = height2;
  if (cursorHide) { canvas.style.cursor = "none"; }
  canvas.addEventListener("mousemove", function(event){
    mouseX = event.clientX - 8;
    mouseY = event.clientY - 8;
  });
  canvas.addEventListener("mousedown", function(event){
    mouseDown = true;
  });
  canvas.addEventListener("mouseup", function(event){
    if (mouseClick) { mouseClick(); }
    mouseDown = false;
  });
  canvas.addEventListener("touchstart", function(event){
    mouseDown = true;
  });
  canvas.addEventListener("touchend", function(event){
    if (mouseClick) { mouseClick(); }
    mouseDown = false;
  });
  window.addEventListener("keydown", function(event){
    var small = event.key.toLowerCase();
    keysDown[small] = true;
  });
  window.addEventListener("keyup", function(event){
    var small = event.key.toLowerCase();
    keysDown[small] = false;
  });
  reSize(canvas.width, canvas.height);
  cx = canvas.getContext('2d');
}

function reSize(newWidth, newHeight){
  canvas.width = newWidth;
  canvas.height = newHeight;
  width = canvas.width;
  hfwidth = width/2;
  height = canvas.height;
  hfheight = height/2
}

function isKeyDown(key, once){
  if (keysDown[key] != 'undefined'){
    if (once){
      var retVal = keysDown[key];
      keysDown[key] = false;
      return retVal;
    }
    return keysDown[key];
  }
}

function setFrameRate(fr){
  fps = fr;
}

function dist(p1, p2){
  return Math.sqrt(distS(p1, p2));
}

function distS(p1, p2){
  return (p2.x-p1.x)*(p2.x-p1.x)+(p2.y-p1.y)*(p2.y-p1.y);
}

function constrain(val, min, max){
  if (val < min) { val = min; }
  if (val > max) { val = max; }
  return val;
}

function map(value, valFrom, valTo, valMin, valMax){
  return (((value - valFrom) / (valTo - valFrom)) *
  (valMax - valMin) + valMin);
}

function lerp(val1, val2, amount){
  amount = (amount < 0)? 0: amount;
  amount = (amount > 1)? 1: amount;
  if (val2 < val1){
    return val1 - (val1 - val2) * amount;
  } else {
    return val1 + (val2 - val1) * amount;
  }
}

function random(min, max){
  if (max){
    return Math.random() * (max - min) + min;
  } else {
    return Math.random() * min;
  }
}

function roundDecS(num, decimals){
  return num.toFixed(decimals);
}

function ceil(num){
  return Math.ceil(num);
}

function floor(num){
  return Math.floor(num);
}

function abs(num){
  return Math.abs(num);
}

function cos(angle){
  return Math.cos(angle);
}

function sin(angle){
  return Math.sin(angle);
}

function push(){
  cx.save();
}

function pop(){
  cx.restore();
}

function mousePressed(callback){
  if (!callback){ throw new ReferenceError(); }
  if (mouseDown){
    callback();
  }
}

var jq = document.createElement("script");
jq.src="/lib/jquery.min.js";
if (jq.readyState){
  jq.onreadystatechange = function(){
    if (jq.readyState === "loaded" || jq.readyState === "complete"){
      jq.onreadystatechange = null;
      JQLoaded();
    }
  }
} else {
  jq.onload = function(){
    JQLoaded();
  }
}

document.getElementsByTagName("head")[0].appendChild(jq);

function JQLoaded(){
  $.getScript('/lib/drawing.js', drawingL);
}
function drawingL(){
  $.getScript('/lib/vector.js', vectorL);
}
function vectorL(){
  $.getScript('/lib/taglib.js', tagL);
}
function tagL(){
  $.getScript('/lib/noise.js', fireBase);
}
function fireBase(){
  if (useFirebase === true){
    $.getScript('https://www.gstatic.com/firebasejs/4.9.0/firebase.js', userFunctions);
  } else {
    userFunctions();
  }
}

function userFunctions(){
  if (typeof preload === "function"){
    preload();
    setTimeout(userFunctions2, 500);
  } else {
    userFunctions2();
  }
}

function userFunctions2(){
  if (typeof init === "function"){
    init();
  }

  if (typeof loop === "function"){
    setTimeout(gameLoop, 1000 / fps);
  }
}

function gameLoop(){
  wWidth = window.innerWidth - 4;
  wHeight = window.innerHeight - 4;
  if (typeof cx !== undefined){
    cx.resetTransform();
    loop();
  }
  setTimeout(gameLoop, 1000 / fps);
}
