

export class Missile {
  constructor(x, y, className, container) {
    this.x = x;
    this.y = y;
    this.className = className;
    this.container = container;
    this.element = document.createElement('div');
    this.interval = null;
  }

  init = () => {
    this.element.classList.add(`${this.className}`);
    this.container.appendChild(this.element);
    this.element.style.left = `${this.x - this.element.offsetWidth / 2}px`;
    this.element.style.top = `${this.y - this.element.offsetHeight}px`;
    this.#autoremove();

    this.className === 'missile--enemy' ?
      this.interval = setInterval(() => { this.element.style.top = `${this.element.offsetTop + 5}px` }, 20)
      :
      this.interval = setInterval(() => { this.element.style.top = `${this.element.offsetTop - 20}px` }, 20);

  }

  remove = () => {
    clearInterval(this.interval);
    this.element.remove();
  }

  #autoremove = () => {
    if (this.className === 'missile--enemy') {
      if (this.element.offsetTop < window.innerHeight) {
        requestAnimationFrame(this.#autoremove)
      }

      if (this.element.offsetTop + this.element.offsetHeight > window.innerHeight || this.element.offsetLeft < 0) {
        this.remove();
      }
    }
    else {
      if (this.element.offsetTop > 0) {
        requestAnimationFrame(this.#autoremove)
      }

      if (this.element.offsetTop <= 0) {
        this.remove();
      }
    }
  }
}