import { Box } from "./Box.js";
import { Enemy } from "./Enemy.js";
import { Heart } from "./Heart.js";
import { Spaceship } from "./Spaceship.js";


class Game {

  htmlElements = {
    spaceship: document.querySelector('[data-spaceship]'),
    container: document.querySelector('[data-container]'),
    score: document.querySelector('[data-score]'),
    lives: document.querySelector('[data-lives]'),
    modal: document.querySelector('.modal'),
    scoreInfo: document.querySelector('[data-score-info]'),
    button: document.querySelector('[data-button]'),
  }

  ship = new Spaceship(
    this.htmlElements.spaceship,
    this.htmlElements.container
  )
  #enemies = [];
  #enemiesMissiles = [];
  #lives = null;
  #score = null;
  #enemiesInterval = null;
  #checkPositionInterval = null;
  #createEnemyInterval = null;
  #heartAddLive = null;
  #boxBlueAddWeapon = null;
  #switchOfEnemies = true;
  #isHeartWasUse = false;
  #frequencyBoxBonus = null;         // default 70
  #intervalTimeCreateEnemy = null;  // default 1500
  #enemyBigCreateFrequency = null;  // default 5 || 2 || 1 


  init = () => {
    this.ship.init();
    this.newGame();
    this.htmlElements.button.addEventListener('click', () => {
      this.newGame();
    });
  }

  newGame = () => {
    this.htmlElements.modal.classList.add('hide');
    this.#enemiesInterval = 30;
    this.#lives = 3;
    this.#score = 0;
    this.#frequencyBoxBonus = 70;
    this.#intervalTimeCreateEnemy = 1500;
    this.#enemyBigCreateFrequency = 2;
    this.#updateLivesText();
    this.#updateScoreText();
    this.ship.setPosition();

    this.#createEnemyInterval = setInterval(() => {
      !this.#switchOfEnemies && this.#randomNewEnemy();  // enemy switch of
    }, this.#intervalTimeCreateEnemy)

    this.#checkPositionInterval = setInterval(() => {
      this.#checkPosition();
    }, 125)
  }

  endGame = () => {
    this.htmlElements.modal.classList.remove('hide');
    this.htmlElements.scoreInfo.textContent = `You loose! Your score is: ${this.#score
      }`;
    this.#enemies.forEach((enemy) => enemy.explode());
    this.ship.missiles.forEach((missile) => missile.remove());
    this.#enemiesMissiles.flat().forEach((missile) => missile.remove());
    this.#enemiesMissiles.length = 0;
    this.#enemies.length = 0;
    this.#heartAddLive.remove();
    // this.#boxBlueAddWeapon.remove();

    this.ship.numberOfMissilesInOneShoot = 1;
    this.#isHeartWasUse = false;

    clearInterval(this.#createEnemyInterval);
    clearInterval(this.#checkPositionInterval);
  }

  #checkPosition = () => {

    this.#enemiesMissiles = [];

    const ship = this.ship.element;

    const shipPosition = {
      top: ship.offsetTop,
      bottom: ship.offsetTop + ship.offsetHeight,
      left: ship.offsetLeft,
      right: ship.offsetLeft + ship.offsetWidth,
    }



    this.heartCollectBonus(shipPosition);

    this.boxBlueCollectBonus(shipPosition);



    this.#enemies.forEach((enemy, enemyIndex, enemyArr) => {
      const enemyPosition = {
        top: enemy.element.offsetTop,
        bottom: enemy.element.offsetTop + enemy.element.offsetHeight,
        left: enemy.element.offsetLeft,
        right: enemy.element.offsetLeft + enemy.element.offsetWidth,
      }

      // create Array of enemiesMissiles
      if (enemy.element.className === 'enemy--big') {
        this.#enemiesMissiles.push(enemy.missiles);
      }

      if (enemyPosition.top > window.innerHeight) {
        enemy.explode();
        this.#updateLives();
        enemyArr.splice(enemyIndex, 1);
      }

      this.ship.missiles.forEach((missile, missileIndex, missileArr) => {
        const missilePosition = {
          top: missile.element.offsetTop,
          bottom: missile.element.offsetTop + missile.element.offsetHeight,
          left: missile.element.offsetLeft,
          right: missile.element.offsetLeft + missile.element.offsetWidth,
        }

        if (
          missilePosition.top <= enemyPosition.bottom &&
          missilePosition.right >= enemyPosition.left &&
          missilePosition.left <= enemyPosition.right
        ) {
          enemy.hit();
          this.#updateScore();

          if (!enemy.lives) {
            enemy.explode();
            enemyArr.splice(enemyIndex, 1);
          }

          missile.remove();
          missileArr.splice(missileIndex, 1);
        }

        if (missilePosition.top <= 0) {
          missile.remove();
          missileArr.splice(missileIndex, 1);
        }

      })

      this.hitSpaceshipToEnemyResult(shipPosition, enemyPosition, enemy, enemyArr, enemyIndex);

      const enemyMissles = this.#enemiesMissiles.flat();
      enemyMissles.forEach((missile, missileIndex, missileArr) => {

        // debugger;
        const missilePosition = {
          top: missile.element.offsetTop,
          bottom: missile.element.offsetTop + missile.element.offsetHeight,
          left: missile.element.offsetLeft,
          right: missile.element.offsetLeft + missile.element.offsetWidth,
        }


        if (missilePosition.right >= shipPosition.left &&
          missilePosition.left <= shipPosition.right &&
          missilePosition.bottom < shipPosition.bottom &&
          missilePosition.top > shipPosition.top
        ) {
          missile.remove();
          missileArr.splice(missileIndex, 1);
          this.#updateLives();
          if (this.ship.numberOfMissilesInOneShoot > 1) {
            this.ship.removeMissileInOneShoot();
          }

        }
      })

    })


  }

  #randomNewEnemy = () => {
    const randomNumber = Math.floor(Math.random() * 5 + 1);

    randomNumber % this.#enemyBigCreateFrequency ?

      this.#createEnemy(
        this.htmlElements.container,
        this.#enemiesInterval,
        'enemy',
        'explosion',
        1
      )

      :
      this.#createEnemy(
        this.htmlElements.container,
        this.#enemiesInterval * 2,
        'enemy--big',
        'explosion--big',
        3
      )

  }

  #createEnemy = (...params) => {
    const enemy = new Enemy(...params);
    enemy.init();
    this.#enemies.push(enemy);

  }

  #updateScore = () => {
    this.#score++;
    if (!(this.#score % 4)) {
      this.#enemiesInterval--;
    }
    this.#updateScoreText();

    if (this.ship.numberOfMissilesInOneShoot !== 5 && !(this.#score % this.#frequencyBoxBonus)) {
      // debugger;
      this.#boxBlueAddWeapon = new Box('box-blue', this.htmlElements.container);
      this.#boxBlueAddWeapon.init();
    }

    if (this.#score % 100) {
      this.#intervalTimeCreateEnemy -= 100;
    }

    if (this.#score % 140 && this.#score < 300) {
      this.#frequencyBoxBonus += 30;
    }

  }




  #updateLives = (value = -1) => {
    this.#lives += value;
    this.#updateLivesText();
    if (value > 0) {
      this.htmlElements.container.classList.add('addLife');
      setTimeout(() => {
        this.htmlElements.container.classList.remove('addLife');
      }, 200)
    } else {

      this.htmlElements.container.classList.add('hit');
      setTimeout(() => {
        this.htmlElements.container.classList.remove('hit');
      }, 200);

    }

    if (this.#lives === 0 && !this.#isHeartWasUse) {
      this.#heartAddLive = new Heart(this.htmlElements.container);
      this.#heartAddLive.init();
      this.#isHeartWasUse = true;
    }

    if (this.#lives < 0) {
      this.endGame()
    };

  }

  #updateScoreText = () => {
    this.htmlElements.score.textContent = `Score: ${this.#score}`;
  }

  #updateLivesText = () => {
    this.htmlElements.lives.textContent = `Lives: ${this.#lives}`;
  }


  hitSpaceshipToEnemyResult(shipPosition, enemyPosition, enemy, enemyArr, enemyIndex) {
    if (shipPosition.top < enemyPosition.bottom &&
      shipPosition.right > enemyPosition.left &&
      shipPosition.left < enemyPosition.right) {
      enemy.hit();
      enemy.explode();
      enemyArr.splice(enemyIndex, 1);
      this.#updateScore();
      this.#updateLives();
      if (this.ship.numberOfMissilesInOneShoot > 1) {
        this.ship.removeMissileInOneShoot();
      }
    }
  }

  boxBlueCollectBonus(shipPosition) {
    let boxBluePosition = {};

    if (this.#boxBlueAddWeapon) {

      const box = this.#boxBlueAddWeapon.element;

      boxBluePosition = {
        top: box.offsetTop,
        bottom: box.offsetTop + box.offsetHeight,
        left: box.offsetLeft,
        right: box.offsetLeft + box.offsetWidth,
      };
    }

    if (shipPosition.top < boxBluePosition.bottom &&
      shipPosition.right > boxBluePosition.left &&
      shipPosition.left < boxBluePosition.right) {
      this.#boxBlueAddWeapon.remove();
      this.ship.addMissileInOneShoot();
    }
  }

  heartCollectBonus(shipPosition) {
    let heartPosition = {};

    if (this.#heartAddLive) {

      const heart = this.#heartAddLive.element;

      heartPosition = {
        top: heart.offsetTop,
        bottom: heart.offsetTop + heart.offsetHeight,
        left: heart.offsetLeft,
        right: heart.offsetLeft + heart.offsetWidth,
      };
    }

    if (shipPosition.top < heartPosition.bottom &&
      shipPosition.right > heartPosition.left &&
      shipPosition.left < heartPosition.right) {
      this.#heartAddLive.remove();
      this.#updateLives(1);
    }
  }
}

window.onload = () => {
  const game = new Game();
  game.init();
}