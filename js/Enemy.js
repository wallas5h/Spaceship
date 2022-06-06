import { Missile } from "./Missile.js";


export class Enemy {

  constructor(container, intervalTime, enemyClass, explosionClass, lives = 1) {
    this.container = container;
    this.intervalTime = intervalTime;
    this.enemyClass = enemyClass;
    this.explosionClass = explosionClass;
    this.lives = lives;

    this.element = document.createElement('div');
    this.interval = null;
    this.shootInterval = null;
    this.missiles = [];

  }

  init = () => {
    this.#setEnemy();
    this.#updatePosition();
    if (this.enemyClass === 'enemy--big') {
      this.#setShootInterval();
    }
  }

  #setEnemy = () => {
    this.element.classList.add(this.enemyClass);
    this.container.appendChild(this.element);
    this.element.style.top = '0px';
    this.element.style.left = `${this.#randomPosition()}px`;
  }

  #randomPosition = () => {
    return Math.floor(Math.random() * (window.innerWidth - this.element.offsetWidth))
  }

  #updatePosition = () => {
    this.interval = setInterval(() => {
      this.#setNewPosition();
    }, this.intervalTime)
  }

  #setNewPosition = () => {
    this.element.style.top = `${this.element.offsetTop + 1}px`;
  }

  hit = () => {
    this.lives--;
    !this.lives && this.explode()
  }

  explode = () => {
    this.element.classList.replace(this.enemyClass, this.explosionClass);
    clearInterval(this.interval);
    clearInterval(this.shootInterval);
    const animationTime = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--explosions-animation-time'));

    setTimeout(() => {
      this.element.remove();
    }, animationTime)
  }

  #setShootInterval = () => {
    this.shootInterval = setInterval(() => {
      this.#shoot();
    }, 3000)
  }

  #shoot = () => {
    const missile = new Missile(
      this.element.offsetLeft + this.element.offsetWidth / 2,
      this.element.offsetTop + this.element.offsetHeight,
      'missile--enemy',
      this.container
    )
    missile.init();
    this.missiles.push(missile);
  }


}