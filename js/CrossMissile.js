



export class CrossMissile {
  constructor(x, y, deg, container) {
    this.x = x;
    this.y = y;
    this.deg = deg;
    this.container = container;
    this.element = document.createElement('div');
    this.interval = null;
    this.tangle = Math.tan(Math.abs(this.deg) * Math.PI / 180);
  }

  init = () => {
    this.element.classList.add('missile');
    this.container.appendChild(this.element);
    this.element.style.left = `${this.x - this.element.offsetWidth / 2}px`;
    this.element.style.top = `${this.y - this.element.offsetHeight}px`;
    this.interval = setInterval(() => this.missileTranslation(), 20);
    this.#autoremove();
  }

  missileTranslation = () => {
    if (this.deg < 0) {
      this.element.style.top = `${this.element.offsetTop - 20}px`;
      this.element.style.left = `${this.element.offsetLeft - this.tangle * (20)}px`;
    }
    else {
      this.element.style.top = `${this.element.offsetTop - 20}px`;
      this.element.style.left = `${this.element.offsetLeft + this.tangle * (20)}px`;
    }


  }

  remove = () => {
    clearInterval(this.interval);
    this.element.remove();
  }

  #autoremove = () => {
    if (this.element.offsetTop > 0 && this.element.offsetLeft > 0 && this.element.offsetLeft < window.innerWidth) {
      requestAnimationFrame(this.#autoremove)
    }

    if (this.element.offsetTop <= 0 || this.element.offsetLeft < 0 || this.element.offsetLeft > window.innerWidth) {
      this.remove();
    }

  }
}