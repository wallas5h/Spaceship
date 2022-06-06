import { CrossMissile } from "./CrossMissile.js";
import { Missile } from "./Missile.js";


export class Spaceship {

  constructor(element, container) {
    this.element = element;
    this.container = container;

    this.missiles = [];
    this.modifier = 10;
    this.leftArrow = false;
    this.rightArrow = false;
    this.upArrow = false;
    this.downArrow = false;
    this.numberOfMissilesInOneShoot = 1;

  }

  init = () => {
    this.setPosition();
    this.#eventListeners();
    this.#gameLoop();
  }

  getEloffsetToCenterOfEl = () => {
    return this.element.offsetLeft + this.element.offsetWidth / 2;
  }

  setPosition = () => {
    this.element.style.bottom = '0px';
    this.element.style.left = `${window.innerWidth / 2 - this.element.offsetWidth / 2}px`
  }

  #eventListeners = () => {

    window.addEventListener('keydown', (e) => {

      switch (e.key) {
        case 'ArrowLeft':
          this.leftArrow = true;
          break;

        case 'ArrowRight':
          this.rightArrow = true;
          break;

        case 'ArrowUp':
          this.upArrow = true;
          break;

        case 'ArrowDown':
          this.downArrow = true;
          break;
      }
    });

    window.addEventListener('keyup', (e) => {

      switch (e.key) {
        case 'ArrowLeft':
          this.leftArrow = false;
          break;

        case 'ArrowRight':
          this.rightArrow = false;
          break;

        case 'ArrowUp':
          this.upArrow = false;
          break;

        case 'ArrowDown':
          this.downArrow = false;
          break;

        case ' ':
          this.#shoot();
          break;

      }
    });

    window.addEventListener('click', (e) => {
      this.#shoot();
    })

    window.addEventListener('mousemove', (e) => {
      this.#steerByMouse(e)
    })

  }

  #gameLoop = () => {
    this.#whatKey();
    requestAnimationFrame(this.#gameLoop);
  }

  #steerByMouse = (e) => {

    this.element.style.left = `${e.clientX - this.element.offsetWidth / 2}px`;

    this.element.style.top = `${e.clientY - this.element.offsetWidth / 2}px`
  }

  #whatKey = () => {

    const { leftMoveCondition, upMoveCondition, rightMoveCondition, downMoveCondition } = this.keyboardMoveConditions();

    const { leftMoveTranslation, upMoveTranslation, rightMoveTranslation, downMoveTranslation } = this.keyboardMoveMethodTranslations();

    if (leftMoveCondition && upMoveCondition) {
      leftMoveTranslation();
      upMoveTranslation();
      return
    }

    if (rightMoveCondition && upMoveCondition) {
      upMoveTranslation();
      rightMoveTranslation();
      return;
    }

    if (leftMoveCondition && downMoveCondition) {
      leftMoveTranslation();
      downMoveTranslation();
      return
    }

    if (rightMoveCondition && downMoveCondition) {
      downMoveTranslation();
      rightMoveTranslation();
      return;
    }

    if (leftMoveCondition) {
      leftMoveTranslation();
      return
    }
    if (rightMoveCondition) {
      rightMoveTranslation();
      return
    }

    if (upMoveCondition) {
      upMoveTranslation();
      return
    }

    if (downMoveCondition) {
      downMoveTranslation()
      return
    }
  }

  #shoot = () => {

    if (this.numberOfMissilesInOneShoot === 1) {
      const missile = new Missile(
        this.getEloffsetToCenterOfEl(),
        this.element.offsetTop,
        'missile',
        this.container
      )
      missile.init();
      this.missiles.push(missile);
    }
    else if (this.numberOfMissilesInOneShoot === 2) {
      const missile1 = new Missile(
        this.getEloffsetToCenterOfEl() - 11,
        this.element.offsetTop,
        'missile',
        this.container
      )

      const missile2 = new Missile(
        this.getEloffsetToCenterOfEl() + 11,
        this.element.offsetTop,
        'missile',
        this.container
      )

      missile1.init();
      this.missiles.push(missile1);
      missile2.init();
      this.missiles.push(missile2);
    }

    else if (this.numberOfMissilesInOneShoot === 3) {
      const missile1 = new Missile(
        this.getEloffsetToCenterOfEl() - 20,
        this.element.offsetTop,
        'missile',
        this.container
      )

      const missile2 = new Missile(
        this.getEloffsetToCenterOfEl() + 20,
        this.element.offsetTop,
        'missile',
        this.container
      )

      const missile3 = new Missile(
        this.getEloffsetToCenterOfEl(),
        this.element.offsetTop - 10,
        'missile',
        this.container
      )

      missile1.init();
      this.missiles.push(missile1);
      missile2.init();
      this.missiles.push(missile2);
      missile3.init();
      this.missiles.push(missile3);
    }

    else if (this.numberOfMissilesInOneShoot === 4) {
      const missile1 = new CrossMissile(
        this.getEloffsetToCenterOfEl() - 20,
        this.element.offsetTop,
        -2,
        this.container
      )

      const missile2 = new CrossMissile(
        this.getEloffsetToCenterOfEl() + 20,
        this.element.offsetTop,
        2,
        this.container
      )

      const missile3 = new Missile(
        this.getEloffsetToCenterOfEl() - 6,
        this.element.offsetTop - 10,
        'missile',
        this.container
      )
      const missile4 = new Missile(
        this.getEloffsetToCenterOfEl() + 6,
        this.element.offsetTop - 10,
        'missile',
        this.container
      )

      missile1.init();
      this.missiles.push(missile1);
      missile2.init();
      this.missiles.push(missile2);
      missile3.init();
      this.missiles.push(missile3);
      missile4.init();
      this.missiles.push(missile4);
    }

    else if (this.numberOfMissilesInOneShoot === 5) {
      const missile1 = new CrossMissile(
        this.getEloffsetToCenterOfEl() - 20,
        this.element.offsetTop,
        -6,
        this.container
      )


      const missile2 = new CrossMissile(
        this.getEloffsetToCenterOfEl() + 20,
        this.element.offsetTop,
        6,
        this.container
      )

      const missile3 = new CrossMissile(
        this.getEloffsetToCenterOfEl() - 10,
        this.element.offsetTop - 10,
        -3,
        this.container
      )
      const missile4 = new CrossMissile(
        this.getEloffsetToCenterOfEl() + 10,
        this.element.offsetTop - 10,
        3,
        this.container
      )

      const missile5 = new Missile(
        this.getEloffsetToCenterOfEl(),
        this.element.offsetTop - 30,
        'missile',
        this.container
      )

      missile1.init();
      this.missiles.push(missile1);
      missile2.init();
      this.missiles.push(missile2);
      missile3.init();
      this.missiles.push(missile3);
      missile4.init();
      this.missiles.push(missile4);
      missile5.init();
      this.missiles.push(missile5);
    }
  }

  addMissileInOneShoot = () => {
    return this.numberOfMissilesInOneShoot++;
  }

  removeMissileInOneShoot = () => {
    return this.numberOfMissilesInOneShoot--;
  }


  keyboardMoveMethodTranslations() {
    const leftMoveTranslation = () => { return this.element.style.left = `${parseInt(this.element.offsetLeft) - this.modifier}px`; };

    const rightMoveTranslation = () => { return this.element.style.left = `${parseInt(this.element.offsetLeft) + this.modifier}px`; };

    const upMoveTranslation = () => {
      return this.element.style.top = `${parseInt(this.element.offsetTop) - this.modifier}px`;
    };

    const downMoveTranslation = () => {
      return this.element.style.top = `${parseInt(this.element.offsetTop) + this.modifier}px`;
    };
    return { leftMoveTranslation, upMoveTranslation, rightMoveTranslation, downMoveTranslation };
  }

  keyboardMoveConditions() {
    const leftMoveCondition = this.leftArrow && this.element.offsetLeft > 0;
    const rightMoveCondition = this.rightArrow && this.element.offsetLeft >= -10 && window.innerWidth >= (this.element.offsetLeft + this.element.offsetWidth);

    const upMoveCondition = this.upArrow && this.element.offsetTop > 10;
    const downMoveCondition = this.downArrow && this.element.offsetTop + 60 < window.innerHeight;
    return { leftMoveCondition, upMoveCondition, rightMoveCondition, downMoveCondition };
  }
}