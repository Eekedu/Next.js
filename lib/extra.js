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
var isMobile = detectmob();
function Range(min, max){
  this.min = min;
  this.max = max;

  this.getRand = function(){
    return random(min, max);
  }
}
function findKeys(o, r) {
  let keys = [];
  for (var key in o) {
    if (key.match(r)) {
      let exp = /mob/g;
      if (isMobile){
        if (key.match(exp)){
          keys.push(key);
        }
      } else {
        if (!key.match(exp)){
          keys.push(key);
        }
      }
    }
  }
  if (keys.length > 0){
    return keys;
  }
  return undefined;
}

function dist(p1, p2){
  return Math.sqrt(distS(p1, p2));
}

function distS(p1, p2){
  return (p2.x-p1.x)*(p2.x-p1.x)+(p2.y-p1.y)*(p2.y-p1.y);
}

function softmax(arr){
  return arr.map(function(value, index){
    return Math.exp(value) / arr.map(function(y){ return Math.exp(y) })
    .reduce(function(a, b){return a*b});
  });
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
  if (isMobile) return ~~num;
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

function List(...arrList){
    this.arr = arrList;
    this.iter = function(callback){
      each(this.arr, (k,v)=>callback(k,v));
    }
}

function range(start, end, step=1){
  const len = Math.floor((end-start) / step) + 1;
  return Array(len).fill().map((_,idx)=> start + (idx * step))
}

function Boundary(pos=new Vector(), w, h) {
  this.pos = pos; this.w = w; this.h = h;
  this.endP = new Vector(pos.x+w, pos.y+h);

  this.adjust = function(t_pos=new Vector(), w, h){
    this.pos = t_pos;
    this.w = w; this.h = h;
    this.endP.set(this.pos.x+w, this.pos.y+h);
  };

  this.within = function(t_pos=new Vector(), w, h){
    let pos_x2 = t_pos.x + w;
    let pos_y2 = t_pos.y + h;
    return t_pos.x >= this.pos.x && t_pos.y >= this.pos.y &&
        pos_x2 <= this.endP.x && pos_y2 <= this.endP.y;
  };
}
