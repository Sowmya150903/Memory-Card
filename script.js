const gameContainer = document.getElementById('game-container');
const resetButton = document.getElementById('reset-button');
const message = document.getElementById('message');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score'); // Score display
const difficultyButtons = document.querySelectorAll('.difficulty-button');

let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedCount = 0;
let timer;
let timeLeft = 120; // 2 minutes
let score = 0; // Score variable

const cardImages = [
    '1.jpeg',
    'download.jpeg',
    '2.jpeg',
    '3.jpeg',
    '4.jpeg',
    '5.jpeg',
    '6.jpeg',
    'images.jpeg'
];

difficultyButtons.forEach(button => {
    button.addEventListener('click', () => {
        const difficulty = button.getAttribute('data-difficulty');
        createCards(difficulty);
    });
});

function createCards(difficulty) {
    let numPairs;

    switch (difficulty) {
        case 'easy':
            numPairs = 4; // 8 cards (4 pairs)
            break;
        case 'medium':
            numPairs = 6; // 12 cards (6 pairs)
            break;
        case 'hard':
            numPairs = 8; // 16 cards (8 pairs)
            break;
    }

    cards = []; // Reset cards array
    const selectedImages = cardImages.slice(0, numPairs); // Get the required number of images

    // Create pairs of cards
    selectedImages.forEach(image => {
        cards.push(image, image);
    });

    shuffle(cards);
    gameContainer.innerHTML = '';
    message.style.display = 'none';
    score = 0; // Reset score
    updateScoreDisplay(); // Update score display

    cards.forEach((image) => {
        const card = document.createElement('div');
        card.classList.add('card');

        const cardInner = document.createElement('div');
        cardInner.classList.add('card-inner');

        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');
        cardFront.innerText = "?";

        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');

        const img = document.createElement('img');
        img.src = image;

        cardBack.appendChild(img);
        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        card.appendChild(cardInner);
        card.setAttribute('data-value', image);
        card.addEventListener('click', flipCard);

        gameContainer.appendChild(card);
    });

    matchedCount = 0;
    startTimer(); // Start the timer when cards are created
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function startTimer() {
    clearInterval(timer); // Clear any existing timer
    timeLeft = 120; // Reset time
    timerDisplay.textContent = `Time Left: ${timeLeft} seconds`;

    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time Left: ${timeLeft} seconds`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            message.textContent = "Time's up! You lost the game!";
            message.style.color = 'white';
            message.style.display = 'block';
            lockBoard = true; // Lock the board when time is up
        }
    }, 1000);
}

function flipCard() {
    if (lockBoard || this.classList.contains('flipped') || this.classList.contains('matched')) return;

    this.classList.add('flipped');

    if (!firstCard) {
        firstCard = this;
    } else {
        secondCard = this;
        lockBoard = true;

        checkForMatch();
    }
}

function checkForMatch() {
    if (firstCard.dataset.value === secondCard.dataset.value) {
        setTimeout(() => {
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');
            matchedCount++;
            score += 10; // Add points for a match
            updateScoreDisplay(); // Update score display
            checkForWin();
            resetBoard();
        }, 500);
    } else {
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            score -= 2; // Deduct points for a mismatch
            updateScoreDisplay(); // Update score display
            resetBoard();
        }, 1000);
    }
}

function updateScoreDisplay() {
    scoreDisplay.textContent = `Score: ${score}`; // Update score display
}

function checkForWin() {
    if (matchedCount === cards.length / 2) {
        clearInterval(timer); // Stop the timer on win
        message.textContent = "You Won the Game! 🎉";
        message.style.color = 'white';
        message.style.display = 'block';
    }
}

function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

resetButton.addEventListener('click', () => {
    gameContainer.style.display = 'grid';
    const activeDifficulty = document.querySelector('.difficulty-button.active')?.getAttribute('data-difficulty') || 'easy';
    createCards(activeDifficulty);
});

// Initialize the game with easy difficulty
createCards('easy');
