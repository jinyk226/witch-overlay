const importRoundRect = () => {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r, a, textWidth) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    if (a <= 15) a = 15
    if (a >= textWidth - 15) a = textWidth - 15
    this.beginPath();
    this.strokeStyle = 'black'
    this.fillStyle = 'white'
    this.lineWidth = 3
    this.moveTo(x+r, y);
    this.arcTo(x+w, y,   x+w, y+h, r);
    this.arcTo(x+w, y+h, x,   y+h, r);
    this.arcTo(x,   y+h, x,   y,   r);
    this.arcTo(x,   y,   x+w, y,   r);
    this.closePath();
    this.fill()
    this.stroke();
    this.beginPath();
    this.moveTo(a-5, y+h-2);
    this.lineTo(a, y+h+5);
    this.lineTo(a+5, y+h-2);
    this.stroke();
    this.fill();
    return this;
  }
}

module.exports = {
  importRoundRect
}
