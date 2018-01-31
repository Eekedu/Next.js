class Tile {
  constructor(x, y, wh, index, snadder){
    this.x = x;
    this.y = y;
    this.wh = wh;
    this.index = index;
    this.snadder = snadder;
    if (this.snadder >= (maxTiles) - 1) {
      this.snadder = (maxTiles) - 1;
    } else if (this.snadder < 0){
      this.snadder = 0;
    }
    this.color = index % 2 * 100 + 100;
  }

  getCenter(){
    var x = this.x + (this.wh/2);
    var y = this.y + (this.wh/2);
    return [x, y, this.wh];
  }

  showSnadder(){
    strokeWeight(3);
    if (this.snadder != 0){
      var myCenter = this.getCenter();
      var otCenter = tiles[this.snadder].getCenter();
      var line1X = myCenter[0];
      var line1Y = myCenter[1];
      var line2X = otCenter[0];
      var line2Y = otCenter[1];
      if (this.snadder > this.index){
        stroke(0, 255, 0);
      } else if (this.snadder < this.index){
        stroke(255, 0, 0);
      }
      line(line1X, line1Y, line2X, line2Y);
    }
  }

  show(){
    fill(this.color);
    rect(this.x, this.y, this.wh, this.wh, true);
    fill(0);
    font(resolution / 2);
    var xPos = this.x + (resolution / 5);
    var yPos = this.y + (resolution / 2);
    if ((this.index) % (xMax * 2) == 0){
      text(">>", xPos, yPos);
    } else if ((this.index) % (xMax) == 0){
      text("<<", xPos, yPos);
    } else if (this.index == (maxTiles) - 1){
      text("G",  xPos, yPos + (resolution   / 5));
    }
  }
}
