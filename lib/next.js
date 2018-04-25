var canvas, canvasIsRotate = false, cx = null, fps=60;
const PI = Math.PI, HALF_PI = PI/2, QUART_PI = PI/4, TWO_PI = 2 * PI;
var NORMAL = true, CENTER = false, assetManager = new Object();
var mouseX, mouseY, globalMouseX, globalMouseY, textScale;
var wWidth, wHeight, width, height, hfwidth, hfheight, PSM;
if (useFirebase == null){
  var useFirebase = false;
}

wWidth = window.innerWidth - 4;
wHeight = window.innerHeight - 4;

var mouseDown = false;
var keysDown = [];

/**
  * Connects to a firebase database and returns a reference
  * @param {string} apiKey Your api key from fireBase
  * @param {string} projectId The name of your databaseURL
  * @return {object} The reference to the database
*/
function FirebaseInit(apiKey, projectId){
  var config = {
    apiKey: apiKey,
    authDomain: projectId + ".firebaseapp.com",
    databaseURL: "https://" + projectId + ".firebaseio.com",
    projectId: projectId
  };
  firebase.initializeApp(config);
  return firebase.database();
}

/**
  * Watches a value in the database
  * @param {object} database The database reference from FirebaseInit
  * @param {string} key The key to watch
  * @param {function} callback The callback function to call when it gets an update. The callback function gets passed the data returned on update, eg. callback(data)
  * @param {string} [oVeride=undefined] Optional overided type, 'value' if undefined 'update' etc for other types
  * @return {object} The reference to the listener
*/
function FirebaseWatch(database, key, callback, oVeride){
  var rel = database.ref(key);
  var listenFor = oVeride || "value";
  rel.on(listenFor, callback);
  return rel;
}

/**
  * Converts the result of updated data from firebase to a normal array
  * @param {object} data The data object returned from the callback function in FirebaseWatch
  * @return {Array} returns an array of values
*/
function FirebaseGetArray(data){
  var retArray = [];
  data.forEach(function(snap){
    var value = snap.val();
    value.key = snap.key;
    retArray.push(value);
  });
  return retArray;
}

/**
  * Logs you into the Firebase database opened with FirebaseInit, must have email verified
  * @param {string} uName The username of the account
  * @param {string} passwd The password of the account
*/
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

/**
  * Signs out the account that is logged into the database
*/
function FirebaseSignOut(){
  firebase.auth().signOut();
}

window.addEventListener("mousemove", function(event){
  globalMouseX = event.clientX - 8;
  globalMouseY = event.clientY - 8;
});

/**
  * Creates an API object
  * @param {string} src The source of the API
*/
function API(src){
  this.src = src;
  this.request = new XMLHttpRequest();
  this.request.open('GET', this.src, true);

  /**
    * Called to set a callback when the API object gets data from it's source
    * @param {function} callback The callback function, passes the response data as a parameter
  */
  this.get = function(callback){
    this.request.onload = function(){
      callback(JSON.parse(this.response));
    };
    this.request.send();
  }
}

/**
  * Iterates over an array or object
  * @param {Array, object} arr The array or Object
  * @param {function} callback The callback function that has parameters, eg callback(index, obj), second is the object instance at that index
*/
function each(arr, callback){
  $.each(arr, callback);
}

/**
  * Deletes the canvas from the page
*/
function deleteCanvas(){
  canvas.parentNode.removeChild(canvas);
}

/**
  * Create a canvas on the webpage
  * @param {integer} width2 The width of the canvas
  * @param {integer} height2 The height of the canvas
  * @param {boolean} [cursorHide=undefined] Optional parameter, if true hides the cursor over the canvas
*/
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
              if (typeof mouseClick === "function"){ mouseClick(); }
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

function parseData(folder, type, data, alpha){
    let dat = parseDirectoryListing(data);
    for (file of dat){
      if (file.substr(-1, 1) === "/"){
        $.get(folder+file, data =>parseData(folder+file, type, data, alpha));
      } else {
        let shortFile = folder + file.replace(/([.]+[a-z]+)/g, "");
        if (shortFile.substr(-1, 1) !== "/"){
          assetManager[shortFile] = new type();
          if (type === Image){ assetManager[shortFile].alpha = alpha; }
          assetManager[shortFile].src = folder + file;
        }
      }
    }
}

/**
  * Loads a folder into the assetManager Object (recursively)
  * @param {string} folder The folder to loaded
  * @param {Object} type A type to load the files in the folder as that Object, eg. Image would load all files as images
  * @param {Function} callback Callback function to run after the files have been loaded into the webpage
  * @param {integer} [alpha=undefined] Optional parameter in case type is Image, sets the alpha of all pictures. Must be between 0.0 and 1.0
*/
function addAssetFolder(folder, type, callback, alpha){
  inDeepFolder = 0;
  $.get(folder, data =>parseData(folder, type, data, alpha)).then(fi =>{
    setTimeout(function(){
      callback();
    }, 250);
  });
}
function parseDirectoryListing(text){
   return docs = text
                .match(/href="([a-zA-Z/.0-9-]*)/g) // pull out the hrefs
                .map((x) => x.replace('href="', '')); // clean up
}

/**
  * Opens a new tab in the browser
  * @param {string} url The url to open
*/
function newTab(url){
  var win = window.open(url, "_blank");
  win.focus();
}

/**
  * Checks the mouse position agaisnt a rectangular boundary
  * @param {integer} x X position
  * @param {integer} y Y position
  * @param {integer} w Width
  * @param {integer} h Height
  * @param {integer} [h2=undefined] Optional secondary height, depends if you need it. eg Clicking text will require you to need it.
*/
function checkMouseCoords(x, y, w, h, h2){
  if (mouseX > x && mouseX < x + w){
    if (mouseY > y - h && mouseY < y + h2){
      return true;
    }
  }
  return false;
}

/**
  * Resizes the canvas
  * @param {integer} newWidth The new width
  * @param {integer} newHeight The new height
*/
function reSize(newWidth, newHeight){
  canvas.width = newWidth;
  canvas.height = newHeight;
  width = canvas.width;
  hfwidth = width/2;
  height = canvas.height;
  hfheight = height/2
}

/**
  * Checks to see if a key has been pressed
  * @param {string} key The key to check
  * @param {boolean} [once=undefined] Optional boolean to reset the button to not pressed
  * @return {boolean} returns true if a key is down
*/
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

/**
  * Sets the framerate of drawing
  * @param {integer} fr The new framerate
*/
function setFrameRate(fr){
  fps = fr;
}

/**
  * Save all translations, rotations, lineweights, etc. of the canvas
*/
function push(){
  cx.save();
}

/**
  * Restores the canvas before push() was called
*/
function pop(){
  cx.restore();
}

/**
  * Sets a callback function when a mouse is pressed
  * @param {function} callback Function to call when a mouse is pressed
*/
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
  $.getScript('/lib/clickable.js', clickL);
}
function clickL(){
  $.getScript('/lib/animation.js', animL);
}
function animL(){
  $.getScript('/lib/noise.js', noisL);
}
function noisL(){
  $.getScript('/lib/extra.js', extrL);
}
function extrL(){
  $.getScript('/lib/PManager.js', fireBase);
}
function fireBase(){
  if (useFirebase === true){
    $.getScript('https://www.gstatic.com/firebasejs/4.9.0/firebase.js', userFunctions);
  } else {
    userFunctions();
  }
}

function userFunctions(){
  PSM = new ParticleSystemManager();
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
