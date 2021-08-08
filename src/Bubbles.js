import * as Utils from "./utils.js";

const RedBubble = "../img/bubble-red.png";
const BlueBubble = "../img/bubble-blue.png";
const PurpleBubble = "../img/bubble-purple.png";

export default class Bubbles {
  /** @param {HTMLElement} container */
  constructor(container) {
    this.container = container;
    new p5(p5 => {
      this.p5 = p5;
      p5.setup = this.setup.bind(this);
      p5.draw = this.draw.bind(this);
    }, container);
  }

  setup() {
    const { p5, container } = this;
    const { offsetWidth: w, offsetHeight: h } = container;

    p5.createCanvas(w, h);
    this.redBubble = p5.loadImage(RedBubble);
    this.blueBubble = p5.loadImage(BlueBubble);
    this.purpleBubble = p5.loadImage(PurpleBubble);
    this.setImage();
    this.interval = setInterval(this.setImage.bind(this), 5000);
    this.bubbles = [];

    let i = 0;
    while (i++ < 16) {
      setTimeout(() => {
        let max = h / 300;
        max = max > 1 ? max : 1;
        const size = w < h ? w / 5 : h / 5;
        const x = 0;
        const y = h - size;
        const velocity = {
          x: p5.random(0.5, max),
          y: p5.random(0.5, max)
        };
        const bubble = { size, x, y, velocity };
        this.bubbles.push(bubble);
      }, i * 800);
    }
  }

  draw() {
    const { p5, bubbles } = this;
    p5.clear();

    for (let i = 0; i < bubbles.length; i++) {
      const bubble = bubbles[i];
      const { x, y, size } = bubble;
      p5.image(this.bubbleImage, x, y, size, size);
      this.update(bubble, i);
    }
  }

  setImage() {
    const { p5, redBubble, blueBubble, purpleBubble } = this;
    this.bubbleImage = p5.random([redBubble, blueBubble, purpleBubble]);
  }

  update(bubble, index) {
    const { offsetWidth: w, offsetHeight: h } = this.container;
    const { size, velocity } = bubble;

    bubble.x += velocity.x;
    bubble.y += velocity.y;

    // change direction on boundary collision
    const { x, y } = bubble;
    if (x > w - size || x < 0) bubble.velocity.x *= -1;
    if (y > h - size || y < 0) bubble.velocity.y *= -1;

    // change direction on collision with other bubbles
    const self = bubble;
    for (let i = 0; i < this.bubbles.length; i++) {
      if (index === i) continue; // ignore self
      const bubble = this.bubbles[i];
      if (Utils.isCollided(self, bubble)) {
        Utils.resolveCollision(self, bubble);
      }
    }
  }

  destroy() {
    this.p5.remove();
    this.interval = clearInterval(this.interval);
  }
}
