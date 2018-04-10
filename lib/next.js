var canvas, canvasIsRotate = false, cx = null, fps=60;
const PI = Math.PI, HALF_PI = PI/2, QUART_PI = PI/4, TWO_PI = 2 * PI;
var NORMAL = true, CENTER = false, assetManager = new Object();
var mouseX, mouseY, globalMouseX, globalMouseY, textScale;
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

function FirebaseEMLogin(uName, passwd){
  firebase.auth().signInAndRetrieveDataWithEmailAndPassword(uName, passwd).
  then(function(){
    if (!firebase.auth().currentUser.emailVerified){
      FirebaseSignOut();
    } else {
      console.log("Email Verified!");
    }
  });
}

function FirebaseSignOut(){
  firebase.auth().signOut();
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
  if (!canvas){
    canvas = document.createElement("canvas");
    canvas.id = "canvas";
    var bod = document.getElementsByTagName("body").item(0);
    bod.insertBefore(canvas, bod.firstChild);
    bod.style.margin = "0px";
    canvas.width = width2;
    canvas.height = height2;
    if (cursorHide) { canvas.style.cursor = "none"; }
    AttachHandler(canvas, "mousemove", null, true);
    AttachHandler(canvas, "touchmove", null, true);
    AttachHandler(canvas, "mousedown", true, true);
    AttachHandler(canvas, "mouseup", false, true);
    AttachHandler(canvas, "touchstart", true, true);
    AttachHandler(canvas, "touchend", false, true);
    AttachHandler(canvas, "keydown", true);
    AttachHandler(canvas, "keyup", false, true);
    reSize(canvas.width, canvas.height);
    cx = canvas.getContext('2d');
  } else {
    console.log("Convas already created!");
  }
}

function AttachHandler(obj, type, varSet, special){
  obj.addEventListener(type, function(evt){
    let FL = type.charAt(0);
    switch (FL){
      case 'k':{
        var small = evt.key.toLowerCase();
        keysDown[small] = varSet;
        if (special){
          if (typeof keyTyped === "function"){
            keyTyped();
          }
        }
        break;
      }
      case 't': case 'm':{
        mouseDown = (varSet !== null)?varSet:mouseDown;
        if (varSet === null){
          if (special){
              if (typeof mouseMove === "function") { mouseMove(); }
          }
        }
        if (FL === 't'){
          mouseX = (canvasIsRotate)?evt.touches[0].clientY:evt.touches[0].clientX;
          mouseY = (canvasIsRotate)?evt.touches[0].clientX:evt.touches[0].clientY;
        } else {
          mouseX = (canvasIsRotate)?evt.clientY:evt.clientX;
          mouseY = (canvasIsRotate)?evt.clientX:evt.clientY;
        }
        if (special){
          if (varSet !== null){
            if (varSet){
              if (typeof mousePDown === "function"){ mousePDown(); }
            } else {
              if (typeof mousePDown === "function"){ mouseClick(); }
            }
          }
        }
        break;
      }
    }
  });
}

Object.defineProperty(Object.prototype,'Enum', {
  value: function() {
    for(i in arguments) {
      Object.defineProperty(this,arguments[i], {
        value:parseInt(i),
        writable:false,
        enumerable:true,
        configurable:true
      });
    }
    return this;
  },
  writable:false,
  enumerable:false,
  configurable:false
});

function addAssetFolder(folder, type, callback){
  $.get(folder, data =>{
    let dat = parseDirectoryListing(data);
    for (file of dat){
      let shortFile = folder + file.replace(/([.][a-z]+)/g, "");
      assetManager[shortFile] = new type();
      assetManager[shortFile].src = folder + file;
    }
  }).then(fi =>{
    callback();
  });
}
function parseDirectoryListing(text){
   return docs = text
                .match(/href="([a-zA-Z0-9-.a-zA-Z0-9]+)/g) // pull out the hrefs
                .map((x) => x.replace('href="', '')); // clean up
}

function newTab(url){
  var win = window.open(url, "_blank");
  win.focus();
}

function checkMouseCoords(x, y, w, h, h2){
  if (mouseX > x && mouseX < x + w){
    if (mouseY > y - h && mouseY < y + h2){
      return true;
    }
  }
  return false;
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

function numLoop(val, min, max){
  if (val < min) { val = max; }
  if (val > max) { val = min; }
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

function detectmob() {
  if( navigator.userAgent.match(/Android/i)
  || navigator.userAgent.match(/webOS/i)
  || navigator.userAgent.match(/iPhone/i)
  || navigator.userAgent.match(/iPad/i)
  || navigator.userAgent.match(/iPod/i)
  || navigator.userAgent.match(/BlackBerry/i)
  || navigator.userAgent.match(/Windows Phone/i)
){
  return true;
}
else {
  return false;
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
  $.getScript('/lib/clickable.js', clickL);
}
function clickL(){
  $.getScript('/lib/animation.js', animL);
}
function animL(){
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
  textScale = (400 - floor(textWidth("O"))) / Math.round(window.devicePixelRatio * 10);
  if (typeof cx !== undefined){
    cx.resetTransform();
    loop();
  }
  setTimeout(gameLoop, 1000 / fps);
}
