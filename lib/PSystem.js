importScripts("extra.js", "vector.js");
function ParticleSystem(position, assetSet, genTime, gravi){
  this.position = position;
  this.assets = assetSet;
  this.genTime = genTime;
  this.gravity = gravi;
  this.maxP = (isMobile)?100:200;
  this.particles = [];

  this.generate = function(){
    let randVel = new Vector(random(-1,1), random(-1,1));
    let randomAsset = floor(random(this.assets.length));
    let asset = this.assets[randomAsset];
    let part = new Particle(this.position, randVel, asset);
    this.particles.push(part);
  }
  this.update = function(){
    let idxToRem = -1;
    let idx = 0;
    for (part of this.particles){
      part.update(this.gravity);
      if (part.ttl <= 0){ idxToRem = idx; }
    }
    if (idxToRem != -1) { this.particles.splice(idxToRem, 1); }
    let posis = this.particles.map(part=>{
      let val = {
        pos:part.position,
        img:part.iml,
        ang:part.angle
      }
      return val;
    });
    let com = JSON.parse(JSON.stringify({'ret': 'dat', 'partPos': posis, genLeft: (this.genTime > 0)}));
    self.postMessage(com);
    if (this.genTime > 0){
      if (this.particles.length <= this.maxP){
        this.generate();
        this.genTime-=10;
      }
    } else {
      if (this.particles.length === 0){
        self.postMessage({'ret': 'dat', 'partPos': null});
        clearInterval(this.tim);
      }
    }
  }
  this.tim;
  this.start = function(){
    let me = this;
    this.tim = setInterval(function(){
      me.update();
    }, 10);
  }
}

function Particle(pos, vel, img, minTtl, maxTtl){
  this.iml = img;
  this.angle = 0;
  if (minTtl){ if (!maxTtl){ maxTtl = random(0, 100); }
  } else {
    minTtl = 1000;
    maxTtl = 2000;
  }
  this.position = new Vector(pos.x, pos.y);
  this.velocity = new Vector(vel.x, vel.y);
  this.ttl = random(minTtl, maxTtl);

  this.update = function(grav){
    let prevPos = this.position.copy();
    if (grav){ this.velocity.add(grav.x, grav.y); }
    this.position.add(this.velocity.x, this.velocity.y);
    if (this.ttl > 0){
      this.ttl-=10;
    }
    let dir = Vector.sub(prevPos, this.position);
    this.angle = dir.angle();
  }
}
var myProcess;
addEventListener("message", function(e){
  let dat = e.data;
  switch (dat.cmd){
    case 'start':{
      myProcess = new ParticleSystem(dat.pos, dat.assets, dat.getT, dat.grav);
      myProcess.start();
      let com = JSON.parse(JSON.stringify({'ret': 'started', 'dat': myProcess}));
      postMessage(com);
      break;
    }
    case 'repos':{
      if (myProcess !== undefined){
        myProcess.position = dat.pos;
      }
      break;
    }
    default:{
      postMessage({'ret': 'open', 'dat': 'Started'});
    }
  }
}, false);
