function ParticleSystemManager(){
  this.systemWorkers = new Object();

  this.create = function(name, position, regImgs, genT, gravi, onFinish){
    let command = {
      cmd: 'start',
      pos: position,
      assets: findKeys(assetManager, regImgs),
      getT: genT,
      grav: gravi
    }
    let worker = new Worker("/lib/PSystem.js");
    worker.particlePos = [];
    worker.ready = false;
    worker.addEventListener("error", function(e){
      console.log(e.message);
    });
    worker.addEventListener("message", function(e){
      let dat = e.data;
      switch (dat.ret){
        case 'started':{
          break;
        }
        case 'dat':{
          if (this.ready && !dat.genLeft && this.onFinish){
            this.onFinish();
          }
          this.ready = dat.genLeft;
          this.particlePos = dat.partPos;
          break;
        }
        case 'open':{
          let com = JSON.parse(JSON.stringify(command));
          worker.postMessage(com);
          break;
        }
      }
    });
    worker.postMessage("");
    if (onFinish){ worker.onFinish = onFinish; }
    this.systemWorkers[name] = worker;
  }

  this.reLocate = function(name, newPos){
    if (this.systemWorkers[name].ready !== undefined && newPos !== undefined){
      if (newPos instanceof Vector){
        let command = { cmd: 'repos', pos: newPos }
        let com = JSON.parse(JSON.stringify(command));
        this.systemWorkers[name].postMessage(com);
      }
    }
  }

  this.drawSystem = function(name, w, h, callback){
    if (this.systemWorkers[name] !== undefined){
      let sys = this.systemWorkers[name];
      let pos = sys.particlePos;
      if (pos !== null){
        for (let i = 0, len = pos.length; i < len; i++){
          let x = parseInt(pos[i].pos.x);
          let y = parseInt(pos[i].pos.y);
          push();
          translate(x-(w/2), y-(h/2));
          rotate(pos[i].ang + HALF_PI);
          assetManager[pos[i].img].show(0, 0, w, h);
          pop();
        }
        if (sys.ready && callback){
          callback();
        }
      }
    }
  }
}
