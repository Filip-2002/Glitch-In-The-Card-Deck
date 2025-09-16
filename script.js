let selectedCards = [];
let cardMap = {};
let currentBit = 0;
let answerBits = 0;
const maxBits = 5;
let fullDeck = [];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}


const cardPickContainer = document.getElementById("card-pick");
const groupContainer = document.getElementById("card-group");
const revealContainer = document.getElementById("revealed-card");

function fetchCards() {
  fullDeck = [];

  const suits = ["S", "H", "D", "C"]; // Spades, Hearts, Diamonds, Clubs
  const values = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];

  suits.forEach(suit => {
    values.forEach(value => {
      const code = value + suit;
      fullDeck.push({
        code: code,
        value: value,
        suit: suit,
        image: `cards/${code}.jpg` // point to your local JPG files
      });
    });
  });

  shuffle(fullDeck);

  selectedCards = fullDeck.slice(0, 20);

  selectedCards.forEach((card, i) => {
    card.binaryValue = i + 1;
    cardMap[card.binaryValue] = card;

    const img = document.createElement("img");
    img.src = card.image;
    img.alt = `${card.value} of ${card.suit}`;
    cardPickContainer.appendChild(img);
  });

  fanCards(cardPickContainer);
}

function fanCards(container) {
	const cards = container.querySelectorAll("img");
	const total = cards.length;
	const spacing = 5;
	const startAngle = -Math.floor(total / 2) * spacing;

	cards.forEach((card, i) => {
		const angle = startAngle + i * spacing;
		const offset = (i - total / 2) * 30 - 20;
		card.style.transform = `rotate(${angle}deg)`;
		card.style.left = `calc(50% + ${offset}px)`;
		card.style.bottom = `0`;
		card.style.zIndex = i;
	});
}

function startTrick() {
	document.getElementById("step-1").classList.add("hidden");
	document.getElementById("main-title").classList.add("hidden");
	document.getElementById("step-2").classList.remove("hidden");
	showNextGroup();
}

function showNextGroup() {
	groupContainer.innerHTML = "";

	const bit = 1 << currentBit;
	const group = selectedCards.filter((card) => (card.binaryValue & bit) !== 0);

	const availableExtras = fullDeck.filter((c) => !selectedCards.includes(c));
	const shuffledExtras = availableExtras.sort(() => Math.random() - 0.5);
	const extras = shuffledExtras.slice(0, 14 - group.length);

	const combined = [...group, ...extras].sort(() => Math.random() - 0.5);

	combined.forEach((card) => {
		const img = document.createElement("img");
		img.src = card.image;
		img.alt = `${card.value} of ${card.suit}`;
		groupContainer.appendChild(img);
	});

	fanCards(groupContainer);
}

function answer(isYes) {
	if (isYes) answerBits += 1 << currentBit;
	currentBit++;

	if (currentBit >= maxBits) {
		revealCard();
	} else {
		showNextGroup();
	}
}

function revealCard() {
	document.getElementById("step-2").classList.add("hidden");
	document.getElementById("step-3").classList.remove("hidden");

	const card = cardMap[answerBits];

	if (card) {
		const mainCard = document.createElement("img");
		mainCard.src = card.image;
		mainCard.alt = `${card.value} of ${card.suit}`;
		mainCard.className = "main-card";
		revealContainer.appendChild(mainCard);
	} else {
		revealContainer.innerHTML = `<div class="error-message">Card not found. Try again!</div>`;
	}
}

function shuffleDeck() {
	document.getElementById("step-3").classList.add("hidden");
	document.getElementById("main-title").classList.remove("hidden");
	document.getElementById("step-1").classList.remove("hidden");

	cardPickContainer.innerHTML = "";
	groupContainer.innerHTML = "";
	revealContainer.innerHTML = "";

	currentBit = 0;
	answerBits = 0;
	selectedCards = [];
	cardMap = {};

	fetchCards();
}

fetchCards();
