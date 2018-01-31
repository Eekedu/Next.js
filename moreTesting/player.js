class Player {

  constructor(color, index){
    this.index = index;
    this.color = color;
    this.reset();
  }

  rollDice(){
    //var roll = floor(random(1, 7));
    this.spot += floor(random(1, 7));//roll;
    if (this.spot < (maxTiles)){
      if (tiles[this.spot].snadder !=0){
        this.spot = tiles[this.spot].snadder;
      }
    }
    //console.log(this.spot, roll);
  }

  showCurrent(){
    if (this.spot != -1){
      font(10);
      fill(255);
      var playLength = players.length;
      var center = tiles[this.spot].getCenter();
      var wh = center[2];
      var wh2 = wh / playLength;
      var newX = center[0] - (wh /2) + (this.index * wh2) + wh2/3;
      text("V", newX, center[1]);
    }
  }

  show(){
    stroke(0);
    strokeWeight(1);
    var playLength = players.length;
    fill(this.color.r, this.color.g, this.color.b);
    var current = tiles[this.spot].getCenter();
    var wh = current[2];
    var wh2 = wh / playLength;
    var newX = current[0] - (wh /2) + (this.index * wh2) + wh2/2;
    circle(newX, current[1], wh2 / 2.2, true);
  }

  reset(){
    this.spot = -1;
  }
}
