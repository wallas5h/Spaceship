

export class Heart {
  constructor(container) {
    this.container = container;
    this.element = document.createElement('div');
    this.x = null;
    this.y = 0;
    this.interval = null;
  }

  init = () => {
    this.element.classList.add('heart');
    this.container.appendChild(this.element);
    this.createRandomX();
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
    this.interval = setInterval(() => { this.element.style.top = `${this.element.offsetTop + 4}px` }, 100);
    this.#autoremove();
  }

  createRandomX = () => {
    this.x = Math.floor(Math.random() * (window.innerWidth - this.element.offsetWidth / 2))
  }

  remove = () => {
    clearInterval(this.interval);
    this.element.remove();
  }

  #autoremove = () => {
    if (this.element.offsetTop < window.innerHeight) {
      requestAnimationFrame(this.#autoremove)
    }

    if (this.element.offsetTop >= window.innerHeight) {
      this.remove();
    }

  }
}