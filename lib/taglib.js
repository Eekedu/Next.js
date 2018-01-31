function select(id){
  var tag = document.getElementById(id);
  return new Tag(tag);
}

function createTag(tag, id){
  var retTag = document.createElement(tag);
  if (id) { retTag.id = id; }
  document.body.appendChild(retTag);
  retObj = new Tag(retTag);
  return retObj;
}

function Tag(tag){
  this.tag = tag;
  this.id = tag.id;
  this.tag.mDown = false;
  this.html = this.tag.innerHTML;
  this.text = this.tag.innerText;
  this.src = this.tag.src;
  this.tag.callback = null;
  watch(this, "html", function(prop, old, newV){
    this.tag.innerHTML = newV;
  });
  watch(this, "text", function(prop, old, newV){
    this.tag.innerText = newV;
  });
  watch(this, "src", function(prop, old, newV){
    this.tag.src = newV;
  });
  this.tag.addEventListener("mousedown", function(){
    this.mDown = true;
  });
  this.tag.addEventListener("mouseup", function(){
    if (this.callback != null){
      this.callback();
    }
    this.mDown = false;
  });
  this.setMouseCallback = function (callback){
    this.tag.callback = callback;
  }
  this.mousePressed = function(){
    return this.tag.mDown;
  };
  this.setValue = function(newVal){
    this.tag.value = newVal;
  };
  this.getValue = function(){
    return this.tag.value;
  };
  this.color = function(r, g, b){
    this.tag.style.color = checkColor(r, g, b);
  };
  this.background = function(r, g, b){
    this.tag.style.background = checkColor(r, g, b);
  }
  this.setStyle = function(styleType, value){
    this.tag.style[styleType] = value;
  }
  this.insertChild = function(child){
    this.tag.appendChild(child.tag);
  }
}

function watch(target, prop, handler) {
    if (target.__lookupGetter__(prop) != null) {
        return true;
    }
    var oldval = target[prop],
        newval = oldval,
        self = this,
        getter = function () {
            return newval;
        },
        setter = function (val) {
            if (Object.prototype.toString.call(val) === '[object Array]') {
                val = _extendArray(val, handler, self);
            }
            oldval = newval;
            newval = val;
            handler.call(target, prop, oldval, val);
        };
    if (delete target[prop]) { // can't watch constants
        if (Object.defineProperty) { // ECMAScript 5
            Object.defineProperty(target, prop, {
                get: getter,
                set: setter,
                enumerable: false,
                configurable: true
            });
        } else if (Object.prototype.__defineGetter__ && Object.prototype.__defineSetter__) { // legacy
            Object.prototype.__defineGetter__.call(target, prop, getter);
            Object.prototype.__defineSetter__.call(target, prop, setter);
        }
    }
    return this;
};

function unwatch(target, prop) {
    var val = target[prop];
    delete target[prop]; // remove accessors
    target[prop] = val;
    return this;
};

// Allows operations performed on an array instance to trigger bindings
function _extendArray(arr, callback, framework) {
    if (arr.__wasExtended === true) return;

    function generateOverloadedFunction(target, methodName, self) {
        return function () {
            var oldValue = Array.prototype.concat.apply(target);
            var newValue = Array.prototype[methodName].apply(target, arguments);
            target.updated(oldValue, motive);
            return newValue;
        };
    }
    arr.updated = function (oldValue, self) {
        callback.call(this, 'items', oldValue, this, motive);
    };
    arr.concat = generateOverloadedFunction(arr, 'concat', motive);
    arr.join = generateOverloadedFunction(arr, 'join', motive);
    arr.pop = generateOverloadedFunction(arr, 'pop', motive);
    arr.push = generateOverloadedFunction(arr, 'push', motive);
    arr.reverse = generateOverloadedFunction(arr, 'reverse', motive);
    arr.shift = generateOverloadedFunction(arr, 'shift', motive);
    arr.slice = generateOverloadedFunction(arr, 'slice', motive);
    arr.sort = generateOverloadedFunction(arr, 'sort', motive);
    arr.splice = generateOverloadedFunction(arr, 'splice', motive);
    arr.unshift = generateOverloadedFunction(arr, 'unshift', motive);
    arr.__wasExtended = true;

    return arr;
}
