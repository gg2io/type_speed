const WORDS = [
  "cat","dog","sun","run","red","blue","code","game","fast","time",
  "apple","orange","planet","keyboard","coffee","window","random",
  "javascript","function","variable","network","protocol", "george",
  "challenge","execute","container","velocity","imagine","creative",
  "monitor","display","browser","developer","typing","digital",
  "performance","experience","optimize","accuracy","practice","terminal",
  "algorithm","syntax","interface","module","package","resource","binary",
  "elephant","pineapple","butterfly","adventure","serendipity","constellation",
  "mountain","river","forest","ocean","lightning","thunder","cascade",
  "quantum","matrix","cipher","vector","pixel","render","compile",
  "telescope","galaxy","nebula","asteroid","meteor","comet","supernova",
  "dragon","phoenix","unicorn","legend","mystery","enchant","sorcerer",
  "guitar","piano","symphony","melody","rhythm","harmony","chorus",
  "volcano","earthquake","tornado","blizzard","avalanche","tsunami","eclipse",
  "ninja","samurai","warrior","champion","knight","guardian","sentinel",
  "chocolate","vanilla","caramel","cinnamon","honey","maple","sugar",
  "rocket","satellite","astronaut","spaceship","orbit","launch","mission",
  "crystal","diamond","emerald","sapphire","ruby","amethyst","topaz",
  "thunder","lightning","storm","tempest","hurricane","cyclone","typhoon",
  "whisper","echo","silence","shout","murmur","roar","crescendo"
];

let gameDuration = 30;
let timeLeft = gameDuration;
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
const difficultySelector = document.getElementById('difficulty-selector');
const difficultyBtns = document.querySelectorAll('.difficulty-btn');
const customTimeContainer = document.getElementById('custom-time-container');
const customTimeInput = document.getElementById('custom-time');
const matchFeedback = document.getElementById('match-feedback');

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
  
  // Get custom time if selected
  const activeBtn = document.querySelector('.difficulty-btn.active');
  if (activeBtn && activeBtn.dataset.time === 'custom') {
    const customValue = parseInt(customTimeInput.value);
    if (!customValue || customValue < 10 || customValue > 600) {
      alert('Please enter a valid time between 10 and 600 seconds');
      return;
    }
    gameDuration = customValue;
  }
  
  running = true;
  startBtn.style.display = 'none';
  resetBtn.style.display = 'inline-block';
  difficultySelector.style.display = 'none';
  wordInput.disabled = false;
  wordInput.value = '';
  wordInput.focus();

  timeLeft = gameDuration;
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
  startBtn.style.display = 'none';
  resetBtn.style.display = 'inline-block';
  wordInput.disabled = true;
  clearInterval(timer);

  if (completed > topScore) {
    topScore = completed;
    topScoreEl.textContent = topScore;
  }
  
  matchFeedback.textContent = `TIME_ELAPSED. FINAL_SCORE: ${completed}`;
  matchFeedback.classList.add('show');
}

function resetGame(){
  running = false;
  clearInterval(timer);
  timeLeft = gameDuration;
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
  difficultySelector.style.display = 'block';
  matchFeedback.textContent = '';
  matchFeedback.classList.remove('show');
}

function checkWord(){
  if (!running) return;
  const typed = wordInput.value.trim();
  const target = currentWordEl.textContent.trim();
  if (typed.toLowerCase() === target.toLowerCase()) {
    completed++;
    completedEl.textContent = completed;
    wordInput.value = '';
    wordInput.placeholder = '...';
    currentWordEl.textContent = pickWord();
    
    // Show match confirmed feedback
    matchFeedback.textContent = 'MATCH_CONFIRMED';
    matchFeedback.classList.add('show');
    
    // Hide feedback after a short delay
    setTimeout(() => {
      matchFeedback.classList.remove('show');
    }, 500);
  }
}

// Difficulty button handlers
difficultyBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    difficultyBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    const timeValue = btn.dataset.time;
    if (timeValue === 'custom') {
      customTimeContainer.style.display = 'block';
      customTimeInput.focus();
    } else {
      customTimeContainer.style.display = 'none';
      gameDuration = parseInt(timeValue);
      timeEl.textContent = gameDuration;
      timeLeft = gameDuration;
    }
  });
});

// Update time display when custom input changes
customTimeInput.addEventListener('input', () => {
  const value = parseInt(customTimeInput.value);
  if (value && value >= 10 && value <= 600) {
    gameDuration = value;
    timeEl.textContent = gameDuration;
    timeLeft = gameDuration;
  }
});

startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetGame);
wordInput.addEventListener('input', checkWord);

window.addEventListener('DOMContentLoaded', () => {
  wordQueue = newQueue();
});