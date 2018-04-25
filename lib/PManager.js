/**
  * The particle system manager. The variable PSM is an instance of this Object
*/
function ParticleSystemManager(){
  this.systemWorkers = new Object();

  /**
    * Create a new particle system.
    * @param {string} name The name of the system, used to reference it later
    * @param {Vector} position A 2D vector that holds a position, this is the location in which new particle will be generated at
    * @param {Regex, string} regImgs A regex value, can be string, to load the images by. Eg. ''/images\/*''/ would load all images in the images folder
    * @param {integer} genT The generation time in ms to run the generation of new particles
    * @param {Vector} gavi The gravity the particles accelerate by, can be 0x Oy
    * @param {function} [onFinish=undefined] Optional callback to run when the generation time is done
  */
  this.create = function(name, position, regImgs, genT, gravi, onFinish){
    let keyAssets = findKeys(assetManager, regImgs);
    let command = {
      cmd: 'start',
      pos: position,
      assets: keyAssets,
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

  /**
    * Relocates the position of newly generated particles
    * @param {string} name The name reference of the system made in create
    * @param {Vector} newPos The new position
  */
  this.reLocate = function(name, newPos){
    if (this.systemWorkers[name].ready !== undefined && newPos !== undefined){
      if (newPos instanceof Vector){
        let command = { cmd: 'repos', pos: newPos }
        let com = JSON.parse(JSON.stringify(command));
        this.systemWorkers[name].postMessage(com);
      }
    }
  }

  /**
    * Draws the particles
    * @param {string} name The name reference of the system made in create
    * @param {integer} w Width of the particle
    * @param {integer} h The height of the particle
    * @param {function} [callback=undefined] Optional callback function called if it drew particles
  */
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
