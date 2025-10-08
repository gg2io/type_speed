const WORDS = [
  "algorithm","binary","code","data","execute","function","variable",
  "interface","kernel","logic","memory","network","protocol","query",
  "runtime","syntax","terminal","upload","vector","compiler","debug",
  "encrypt","firewall","gateway","hardware","integer","javascript",
  "localhost","module","namespace","object","parameter","quantum",
  "recursive","software","thread","unicode","virtual","webhook",
  "atom","biology","carbon","dioxide","electron","fusion","genome",
  "hydrogen","isotope","joule","kinetic","laser","molecule","neutron",
  "oxygen","photon","quantum","radiation","spectrum","theorem","ultraviolet",
  "velocity","wavelength","chromosome","database","ecosystem","frequency",
  "gradient","hypothesis","inertia","latitude","magnitude","nucleus",
  "orbit","plasma","resonance","satellite","topology","uncertainty",
  "vaccine","waveform","catalyst","derivative","equilibrium","formula",
  "graphene","helix","inference","matrix","nanotechnology","oscillation",
  "peptide","reactor","semiconductor","telescope","voltage","bandwidth",
  "capacitor","diode","ethernet","femtosecond","gigabyte","hologram",
  "infrared","terabyte","microchip","neutrino","peptide","quasar",
  "refraction","synapse","transistor","ultraviolet","viscosity","nanometer",
  "cryptocurrency","blockchain","neural","algorithm","cybersecurity","metadata",
  "cache","router","server","pixel","render","codec","encryption",
  "microprocessor","semiconductor","broadband","photosynthesis","evolution",
  "entropy","catalyst","polymer","isotope","thermodynamics","relativity",
  "calculus","integral","logarithm","probability","enzyme","metabolism"
];

let gameDuration = 60;
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
    
    // Add green blink effect to word display
    currentWordEl.classList.add('correct');
    
    // Show match confirmed feedback
    matchFeedback.textContent = 'MATCH_CONFIRMED';
    matchFeedback.classList.add('show');
    
    // Change word and remove effects after animation
    setTimeout(() => {
      currentWordEl.textContent = pickWord();
      currentWordEl.classList.remove('correct');
      matchFeedback.classList.remove('show');
    }, 200);
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