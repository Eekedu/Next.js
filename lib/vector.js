function Vector(x, y, z){
  this.x = (x)?x: 0;
  this.y = (y)?y: 0;
  this.z = (z)?z: 0;

  this.set = function(other, y){
    if (!y){
      if (other instanceof Vector){
        this.x = other.x;
        this.y = other.y;
      } else {
        this.x = other;
        this.y = other;
      }
    } else {
      this.x = other;
      this.y = y;
    }
  }

  this.add = function(other, y){
    if (!y){
      if (other instanceof Vector){
        this.x += other.x;
        this.y += other.y;
      } else {
        this.x += other;
        this.y += other
      }
    } else {
      this.x += other;
      this.y += y;
    }
  };

  this.sub = function(other, y){
    if (!y){
      if (other instanceof Vector){
        this.add(-other.x, -other.y);
      } else {
        this.add(-other, -other);
      }
    } else {
      this.add(-other, -y);
    }
  };

  this.mult = function(mult1, mult2){
    if (!mult2){
      this.x *= mult1;
      this.y *= mult1;
    } else {
      this.x *= mult1;
      this.y *= mult2;
    }
  };

  this.div = function(div1, div2){
    if (!div2){
      this.mult(1.0/div1);
    } else {
      this.mult(1.0/div1, 1.0/div2);
    }
  };

  this.mag = function(val){
    if (val){
      var direction = this.angle();
      this.x = Math.cos(direction) * val;
      this.y = Math.sin(direction) * val;
    } else {
      return Math.sqrt((this.x*this.x) + (this.y*this.y));
    }
  };

  this.normalize = function(){
    var mag = this.mag();
    this.div(mag);
  };

  this.angle = function(){
    return Math.atan2(this.y, this.x);
  };

  this.copy = function(){
    return new Vector(this.x, this.y);
  };
}

Vector.add = function(other, other2){
  if (other instanceof Vector && other2 instanceof Vector){
    return new Vector(other.x + other2.x, other.y + other2.y);
  }
};

Vector.sub = function(other, other2){
  if (other instanceof Vector && other2 instanceof Vector){
    return new Vector(other.x - other2.x, other.y - other2.y);
  }
};

Vector.mult = function(other, other2){
  if (other instanceof Vector && other2 instanceof Vector){
    return new Vector(other.x * other2.x, other.y * other2.y);
  }
};

Vector.div = function(other, other2){
  if (other instanceof Vector && other2 instanceof Vector){
    return new Vector(other.x / other2.x, other.y / other2.y);
  }
};
if (typeof process != "undefined"){
  module.exports.Vector = Vector;
  module.exports.Vector.add = Vector.add;
  module.exports.Vector.sub = Vector.sub;
  module.exports.Vector.mult = Vector.mult;
  module.exports.Vector.div = Vector.div;
}
