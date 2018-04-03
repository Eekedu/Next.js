function Animation(speed, looped, sheet, numFrames, w){
  this.speed = speed;
  this.frameNum = 0;
  this.frames = (sheet)?new Image():[];
  this.numFrames = numFrames;
  this.stopped = false;
  this.direction = 1;

  this.addFrame = function(src){
    if (sheet){
      this.frames.src = src;
    } else {
      let frame = new Image();
      frame.src = src;
      this.frames.push(frame);
    }
  }

  this.step = function(x, y, dW, dH){
    if (!sheet) {
      this.frames[floor(this.frameNum) + 1].show(x, y, w, h);
    } else {
      this.frames.show(x, y, w, this.frames.height, floor(this.frameNum + 1), dW, dH);
    }
    if (!looped){
      this.frameNum = (this.frameNum + (this.speed * this.direction));
      this.frameNum = constrain(this.frameNum, 0, numFrames);
    } else {
      this.frameNum = (this.frameNum + (this.speed * this.direction)) % (numFrames + 1);
      this.frameNum = numLoop(this.frameNum, 0, numFrames);
    }
    if (this.frameNum >= numFrames) { this.stopped = true; }
    else if (this.frameNum <= 0) { this.stopped = true; }
    else { this.stopped = false; }
  }
}
