import { apiURL } from "./config/apiURL.js";
import { Game } from "./Game.js";

const game = new Game();
let isGameIsInit = false;

const htmlElemens = {
  container: document.querySelector('[data-container]'),
  spaceshipCursor: document.querySelector('[data-spaceship-entry]'),
  modalEntry: document.querySelector('[data-modal-entry]'),
  modalGame: document.querySelector('[data-modal-entry]'),
  modalSubmitScore: document.querySelector('[data-modal-submit-score]'),
  modalBestPlayers: document.querySelector('[data-modal-best-players]'),

  submitScore: document.querySelector('[data-button-submit]'),
  bestPlayersBtn: document.querySelector('[data-modal-entry-scores]'),
  startBtn: document.querySelector('[data-modal-entry-start]'),


  saveScoreForm: document.querySelector('#submit-score-form'),
  saveScoreName: document.querySelector('#submit-score-name'),
  xBtn: document.querySelectorAll('.button__X'),
  bestPlayersContainer: document.querySelector('.playersList__container'),

}



const eventListeners = () => {

  // setSpaceshipCursor();

  htmlElemens.startBtn.addEventListener('click', handleStartGame);
  // startBtn.addEventListener('click', handleStartGame);

  htmlElemens.saveScoreForm.addEventListener('submit', async (e) => handleSubmitScore(e));

  htmlElemens.submitScore.addEventListener('click', () => {
    htmlElemens.modalSubmitScore.classList.remove('hide');
  });

  htmlElemens.bestPlayersBtn.addEventListener('click', handleWatchBestPlayers);

  Array.from(htmlElemens.xBtn).forEach(button => {
    button.addEventListener('click', () => {
      button.parentNode.classList.add('hide');
      htmlElemens.modalGame.classList.add('hide');
      htmlElemens.modalEntry.classList.remove('hide');
    });
  })



}

const handleWatchBestPlayers = async () => {
  htmlElemens.modalBestPlayers.classList.remove('hide');

  const res = await fech(`${apiURL}/users`);
  const data = await res.json(); // data.name data.score

  data.forEach(user => {
    const newUser = `<li>${user.name} <span>${user.score} pkt</span></li>`;

    htmlElemens.bestPlayersContainer.appendChild(newUser)
  })
}

const handleSubmitScore = async (e) => {

  e.preventDefault();
  const name = String(htmlElemens.saveScoreName.value);
  const score = Number(game.score);

  const res = await fech(`${apiURL}/add`, {  //TODO
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name,
      score
    })
  })

  const data = res.JSON();

  console.log(data)  // TODO  remove cl


  htmlElemens.saveScoreName.value = '';
}


function handleStartGame() {
  console.log('start')
  htmlElemens.modalEntry.classList.add('hide');
  if (!isGameIsInit) {
    game.init();
    isGameIsInit = true;
  }
  else {
    game.newGame();
  }
}

function setSpaceshipCursor() {
  window.addEventListener('mousemove', (e) => {
    htmlElemens.modalEntry.style.cursor = 'none';
    htmlElemens.startBtn.style.cursor = 'none';
    htmlElemens.bestPlayersBtn.style.cursor = 'none';
    htmlElemens.spaceshipCursor.style.display = 'block';
    htmlElemens.spaceshipCursor.style.left = `${e.clientX}px`;
    htmlElemens.spaceshipCursor.style.top = `${e.clientY}px`;
  });
}

function removeSpaceshipCursor() {
  window.removeEventListener('mousemove', (e) => {
    htmlElemens.modalEntry.style.cursor = 'none';
    htmlElemens.startBtn.style.cursor = 'none';
    htmlElemens.bestPlayersBtn.style.cursor = 'none';
    htmlElemens.spaceshipCursor.style.display = 'block';
    htmlElemens.spaceshipCursor.style.left = `${e.clientX}px`;
    htmlElemens.spaceshipCursor.style.top = `${e.clientY}px`;
  });
}


eventListeners();