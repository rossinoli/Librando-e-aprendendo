const grid = document.querySelector('.grid');
const spanPlayer = document.querySelector('.player');
const timer = document.querySelector('.timer');

const characters = [
  'LA', 'LB', 'LC', 'LD', 'LE', 'LF', 'LG', 'LH', 'LI', 'LJ',
  'LK', 'LL', 'LM', 'LN', 'LO', 'LP', 'LQ', 'LR', 'LS', 'LT',
  'LU', 'LV', 'LW', 'LX', 'LY', 'LZ', 'LÇ',
];

// Define exatamente 12 pares (24 cartas no total)
const TOTAL_PARES = 12;

// Trava para evitar cliques durante a memorização inicial
let tempoMemorizacao = true;

// Pré-carregamento das imagens
const preloadImages = () => {
  characters.forEach((char) => {
    const img = new Image();
    img.src = `../images/${char}.jpg`;
  });
};

const createElement = (tag, className) => {
  const element = document.createElement(tag);
  element.className = className;
  return element;
};

let firstCard = '';
let secondCard = '';

const checkEndGame = () => {
  const disabledCards = document.querySelectorAll('.disabled-card');

  if (disabledCards.length === TOTAL_PARES * 2) {
    clearInterval(this.loop);
    alert(`Parabéns, ${spanPlayer.innerHTML}! Seu tempo foi de: ${timer.innerHTML}s`);
  }
};

const checkCards = () => {
  const firstCharacter = firstCard.getAttribute('data-character');
  const secondCharacter = secondCard.getAttribute('data-character');

  if (firstCharacter === secondCharacter) {
    firstCard.firstChild.classList.add('disabled-card');
    secondCard.firstChild.classList.add('disabled-card');

    firstCard = '';
    secondCard = '';

    checkEndGame();
  } else {
    setTimeout(() => {
      firstCard.classList.remove('reveal-card');
      secondCard.classList.remove('reveal-card');

      firstCard = '';
      secondCard = '';
    }, 500);
  }
};

const revealCard = ({ target }) => {
  if (tempoMemorizacao) return;

  if (target.parentNode.className.includes('reveal-card')) {
    return;
  }

  if (firstCard === '') {
    target.parentNode.classList.add('reveal-card');
    firstCard = target.parentNode;
  } else if (secondCard === '') {
    target.parentNode.classList.add('reveal-card');
    secondCard = target.parentNode;

    checkCards();
  }
};

const createCard = (character) => {
  const card = createElement('div', 'card');
  const front = createElement('div', 'face front');
  const back = createElement('div', 'face back');

  front.style.backgroundImage = `url('../images/${character}.jpg')`;

  card.appendChild(front);
  card.appendChild(back);

  card.addEventListener('click', revealCard);
  card.setAttribute('data-character', character);

  return card;
};

const loadGame = () => {
  // 1. Sorteia aleatoriamente 12 letras
  const embaralhado = [...characters].sort(() => Math.random() - 0.5);
  const letrasSorteadas = embaralhado.slice(0, TOTAL_PARES);

  // 2. Duplica para formar os pares e embaralha para colocar na tela (24 cartas)
  const duplicateCharacters = [...letrasSorteadas, ...letrasSorteadas];
  const shuffledArray = duplicateCharacters.sort(() => Math.random() - 0.5);

  grid.innerHTML = '';

  shuffledArray.forEach((character) => {
    const card = createCard(character);
    grid.appendChild(card);
  });

  // 3. Revela todas as cartas nos 10s iniciais de memorização
  const allCards = document.querySelectorAll('.card');
  allCards.forEach((card) => card.classList.add('reveal-card'));

  let tempoRestante = 10;
  timer.innerHTML = tempoRestante;

  const contagemRegressiva = setInterval(() => {
    tempoRestante -= 1;
    if (tempoRestante > 0) {
      timer.innerHTML = tempoRestante;
    } else {
      clearInterval(contagemRegressiva);

      allCards.forEach((card) => card.classList.remove('reveal-card'));
      tempoMemorizacao = false;

      timer.innerHTML = '0';
      startTimer();
    }
  }, 1000);
};

const startTimer = () => {
  this.loop = setInterval(() => {
    const currentTime = +timer.innerHTML;
    timer.innerHTML = currentTime + 1;
  }, 1000);
};

window.onload = () => {
  preloadImages();
  spanPlayer.innerHTML = localStorage.getItem('player');
  loadGame();
};