class Clickable {

  constructor(x, y){
    this.x = x;
    this.y = y;
  }

  checkMouse(textScale2, too){
    if (mouseX > this.x && mouseX < this.x + this.w){
      if (mouseY > this.y - textScale2 && mouseY < this.y + too){
        return true;
      }
    }
    return false;
  }
}

class Button extends Clickable {

  constructor(text, x, y, from){
    super(x, y);
    this.from = (from)?from: "C";
    this.superX = x;
    this.text = text;
    this.click = false;
    this.ttw = 0;
  }

  check(textScale2, tto){
    if (this.checkMouse(textScale2, tto)){
      if (!this.click){
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  show(){
    if (mouseDown && this.ttw < 1){
      if (this.check(textScale, 0)){
        this.click = true;
        this.ttw = 20;
      } else {
        this.click = false;
      }
    } else {
      this.click = false;
    }
    this.ttw-=1;
    this.ttw = constrain(this.ttw, 0, 20);
    this.w = textWidth(this.text);
    let scale = this.superX * (textScale / 32);
    this.x = ((this.from == "C")?hfwidth:(this.from == "L")?0:width);
    this.x += ((this.from == "C" || this.from == "L")?scale:-scale) - (this.w/2);
    let minX = ((this.from == "L")?0:hfwidth);
    let maxX = ((this.from == "L")?hfwidth:width);
    this.x = constrain(this.x, minX - this.w, maxX - this.w);
    this.hover = this.checkMouse(textScale, 0);
    fill(100);
    rect(this.x, this.y - textScale, this.w, textScale + 4, !this.hover);
    fill(255);
    text(this.text, this.x, this.y);
  }

}

class ImageButton extends Button {
  constructor(img, x, y, from){
    super("", x, y, from);
    this.img = new Image();
    this.img.src = img;
  }

  show(){
    if (mouseDown && this.ttw < 1){
      if (this.check(0, this.img.height)){
        this.click = true;
        this.ttw = 0;
      } else {
        this.click = false;
      }
    } else {
      this.click = false;
    }
    this.ttw-=1;
    this.ttw = constrain(this.ttw, 0, 1);
    let scale = this.superX * (this.img.height / 32);
    this.w = textScale * 1.5;
    this.x = ((this.from == "C")?hfwidth:(this.from == "L")?0:width);
    this.x += ((this.from == "C" || this.from == "L")?scale:-scale) - (this.w/2);
    let minX = ((this.from == "L")?0:hfwidth);
    let maxX = ((this.from == "L")?hfwidth:width);
    this.x = constrain(this.x, minX - this.w, maxX - this.w);
    this.hover = this.checkMouse(0, this.img.height);
    this.img.show(this.x, this.y, this.w, textScale * 1.5);
  }
}
