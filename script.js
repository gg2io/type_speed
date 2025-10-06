const GAME_DURATION = 60;
const WORDS = [
  "cat","dog","sun","run","red","blue","code","game","fast","time",
  "apple","orange","planet","keyboard","coffee","window","random",
  "javascript","function","variable","network","protocol",
  "challenge","execute","container","velocity","imagine","creative",
  "keyboard","monitor","display","browser","developer","typing",
  "performance","experience","optimize","accuracy","practice",
  "algorithm","syntax","interface","module","package","resource",
  "elephant","pineapple","butterfly","adventure","serendipity","constellation"
];

let timeLeft = GAME_DURATION;
let completed = 0;
let topScore = 0;
let timer = null;
let running = false;
let wordQueue = [];

const timeEl = document.getElementById('time');
const completedEl = document.getElementById('completed');
const topScoreEl = document.getElementById('top-score');
const currentWordEl = document.getElementById('word-display');
const startBtn = document.getElementById('initiate-btn');
const resetBtn = document.getElementById('reset-btn');
const wordInput = document.getElementById('input-word');

function shuffle(a){
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function newQueue(){
  let arr = [];
  for (let i = 0; i < 4; i++) arr = arr.concat(WORDS);
  return shuffle(arr);
}

function pickWord(){
  if (wordQueue.length === 0) wordQueue = newQueue();
  return wordQueue.shift();
}

function startGame(){
  if (running) return;
  running = true;
  startBtn.style.display = 'none';
  resetBtn.style.display = 'inline-block';
  wordInput.disabled = false;
  wordInput.value = '';
  wordInput.focus();

  timeLeft = GAME_DURATION;
  completed = 0;
  completedEl.textContent = completed;
  timeEl.textContent = timeLeft;

  if (wordQueue.length < 10) wordQueue = newQueue();
  currentWordEl.textContent = pickWord();

  timer = setInterval(() => {
    timeLeft -= 1;
    timeEl.textContent = timeLeft;
    if (timeLeft <= 0) stopGame();
  }, 1000);
}

function stopGame(){
  running = false;
  startBtn.style.display = 'inline-block';
  resetBtn.style.display = 'none';
  wordInput.disabled = true;
  clearInterval(timer);

  if (completed > topScore) {
    topScore = completed;
    topScoreEl.textContent = topScore;
  }
  
  currentWordEl.textContent = `FINISHED - ${completed} WORDS`;
}

function resetGame(){
  running = false;
  clearInterval(timer);
  timeLeft = GAME_DURATION;
  completed = 0;
  wordQueue = newQueue();
  timeEl.textContent = timeLeft;
  completedEl.textContent = completed;
  topScoreEl.textContent = topScore;
  currentWordEl.textContent = '---';
  wordInput.value = '';
  wordInput.disabled = true;
  startBtn.style.display = 'inline-block';
  resetBtn.style.display = 'none';
}

function checkWord(){
  if (!running) return;
  const typed = wordInput.value.trim();
  const target = currentWordEl.textContent.trim();
  if (typed.toLowerCase() === target.toLowerCase()) {
    completed++;
    completedEl.textContent = completed;
    wordInput.value = '';
    currentWordEl.textContent = pickWord();
  }
}

startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetGame);
wordInput.addEventListener('input', checkWord);

window.addEventListener('DOMContentLoaded', () => {
  wordQueue = newQueue();
});