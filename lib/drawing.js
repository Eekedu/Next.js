Image.prototype.show = function(x, y, w, h, frame, dW, dH){
    if (this.alpha){
      cx.save();
      cx.globalAlpha = this.alpha;
    }
    if (!frame){
      cx.drawImage(this, x, y, w, h);
    } else {
      cx.drawImage(this, (frame * w), 0, w, h, x, y, dW, dH);
    }
    if (this.alpha){
      cx.restore();
    }
  }

  Image.prototype.getPixels = function(){
    cx.drawImage(this, 0, 0, this.width, this.height);
    return cx.getImageData(0, 0, this.width, this.height);
  }

  function dataToImage(data){
    canvas.width = data.width;
    canvas.height = data.height;
    cx.putImageData(data, 0, 0);
    var newImage = new Image();
    newImage.src = canvas.toDataURL();
    canvas.width = width;
    canvas.height = height;
    return newImage;
  }

  function Color(r, g, b, a){
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a || 255;
    this.brightness = function(){
      return ((0.2126 * this.r) +
      (0.7152 * this.g) +
      (0.0722 * this.b)) *
      (this.a / 255);
    };
  }

  function rectMode(MODE){
    if (MODE == NORMAL){
      NORMAL = true;
      CENTER = false;
    } else if (MODE == CENTER){
      NORMAL = false;
      CENTER = true;
    }
  }

  function color(r, g, b, a){
    var string = "rgb";
    if (a){ string+="a"; }
    string += "(" + r + ", " + g + ", " + b;
    if (a){ string+=", " + a; }
    string += ")";
    return string;
  }

  function translate(x, y){
    cx.translate(x, y);
  }

  function canvasRotate(deg, x, y){
    canvasIsRotate = (deg !== 0)?true:false;
    canvas.style.transform = "rotate(" + deg + "deg)";
    canvas.style.position = "absolute";
    canvas.style.left = x + "%";
    canvas.style.top = y + "%";
  }

  function rotate(rads){
    cx.rotate(rads);
  }

  function rotateDegrees(degs){
    rotate(degs * Math.PI/180);
  }

  function font(size, family){
    cx.font = size + "px " + ((family)?family:"Arial");
  }

  function text(mesg, x, y){
    cx.fillText(mesg, x, y);
  }

  function textWidth(mesg){
    return cx.measureText(mesg).width;
  }

  function link(mesg, href, x, y, color, highlight){
    fill(color.r, color.g, color.b, color.a);
    stroke(255);
    let lw = textWidth(mesg);
    if (mouseX > x && mouseX < x + lw){
      if (mouseY > y - textScale && mouseY < y){
        if (mouseDown){
          newTab(href);
          mouseDown = false;
        }
        fill(highlight.r, highlight.g, highlight.b, highlight.a);
        stroke(highlight.r, highlight.g, highlight.b, highlight.a);
        canvas.style.cursor = "pointer";
      } else {
        canvas.style.cursor = "default";
      }
    } else {
      canvas.style.cursor = "default";
    }
    text(mesg, x, y);
    line(x, y + 2, x + lw, y + 2);
  }

  function line(x1, y1, x2, y2){
    cx.beginPath();
    cx.moveTo(x1, y1);
    cx.lineTo(x2, y2);
    cx.stroke();
  }

  function rect(x, y, w, h, filled){
    cx.save();
    var didT = false;
    if (CENTER && !NORMAL){
      didT = true;
      translate(x - (w/2), y - (h/2));
    }
    if (filled) { cx.fillRect((didT)?0:x, (didT)?0:y, w, h); }
    else { cx.rect((didT)?0:x, (didT)?0:y, w, h); cx.stroke(); }
    cx.restore();
  }

  function circle(x, y, radius, filled){
    cx.beginPath();
    cx.arc(x, y, radius, 0, TWO_PI, false);
    if (filled) { cx.fill(); }
    cx.stroke();
  }

  function ellipse(x, y, radiusX, radiusY, filled){
    cx.save();
    cx.beginPath();
    translate(x - radiusX, y - radiusY);
    cx.scale(radiusX, radiusY);
    cx.arc(1, 1, 1, 0, TWO_PI, false);
    if (filled) { cx.fill(); }
    cx.restore();
    cx.stroke();
  }

  var begin;
  var vertexDrawing = false;
  var fillPath = false;

  function start(filled){
    if (!vertexDrawing){
      vertexDrawing = true;
      cx.beginPath();
      if (filled) { fillPath = true; }
    } else {
      throw new ReferenceError();
    }
  }

  function vertex(x, y){
    if (vertexDrawing){
      if (begin == null) { begin = new Vector(x, y); }
      cx.lineTo(x, y);
    } else {
      throw new ReferenceError();
    }
  }

  function end(connect){
    if (vertexDrawing){
      if (connect) {
        cx.lineTo(begin.x, begin.y);
      }
      cx.stroke();
      if (fillPath) {
        cx.fill();
      }
      fillPath = false;
      vertexDrawing = false;
      begin = null;
    } else {
      throw new ReferenceError();
    }
  }

  function fill(r, g, b, a){
    cx.fillStyle = checkColor(r, g, b, a);
  }

  function strokeWeight(weight){
    cx.lineWidth = weight;
  }

  function stroke(r, g, b, a){
    cx.strokeStyle = checkColor(r, g, b, a);
  }

  function background(r, g, b, a){
    cx.fillStyle = checkColor(r, g, b, a);
    cx.fillRect(0, 0, width, height);
    if (width === wWidth && height === wHeight){
      document.getElementsByTagName("html")[0]
              .style.backgroundColor = checkColor(r, g, b, a);
    }
  }

  function checkColor(r, g, b, a){
    r = constrain(r, 0, 255);
    if (g !=null){
      g = constrain(g, 0, 255);
      if (b != null){
        b = constrain(b, 0, 255);
      }
    }
    if (a){
      a = constrain(a, 0, 1);
    }
    return color(r, (g !=null)?g:r, (g != null && b != null)?b:r, a);
  }
