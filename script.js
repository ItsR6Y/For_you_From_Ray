/* ============================================
   GOTHIC CRUSH WEBSITE — script.js
   chaotic. dramatic. emotionally unhinged. 🖤
   ============================================ */

'use strict';

// ===== STATE =====
let currentPage = 1;
let audioEnabled = false;
let currentCompliment = 0;
let page5Triggered = false;
let easterEggTimer = null;

// ===== AUDIO PLACEHOLDERS =====
const sounds = {
  intro: null,       // intro.mp3
  sad: null,         // sad.mp3
  sus: null,         // sus.mp3
  celebration: null, // celebration.mp3
  lie: null,         // lie.mp3
  meow: null         // meow easter egg
};

// Try loading audio (graceful fail if files don't exist)
function loadAudio() {
  const files = ['intro','sad','sus','celebration','lie'];
  files.forEach(name => {
    try {
      const a = new Audio(`assets/${name}.mp3`);
      a.preload = 'auto';
      sounds[name] = a;
    } catch(e) {}
  });
  try {
    const m = new Audio(`assets/meow.mp3`);
    m.preload = 'auto';
    sounds.meow = m;
  } catch(e) {}
}

function playSound(name, volume = 0.7) {
  if (!audioEnabled || !sounds[name]) return;
  try {
    const s = sounds[name].cloneNode ? sounds[name].cloneNode() : sounds[name];
    if (s) { s.volume = volume; s.play().catch(()=>{}); }
  } catch(e) {}
}

function stopSound(name) {
  if (!sounds[name]) return;
  try { sounds[name].pause(); sounds[name].currentTime = 0; } catch(e) {}
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  loadAudio();
  setupCursorTrail();
  setupParticles();
  setupAudioPopup();
  setupPage1();
  setupMobileFloats();
  startEasterEggs();
});

// ===== CURSOR TRAIL =====
function setupCursorTrail() {
  const trail = document.getElementById('cursor-trail');
  if (!trail) return;
  document.addEventListener('mousemove', e => {
    trail.style.left = e.clientX + 'px';
    trail.style.top = e.clientY + 'px';
  });
  document.addEventListener('mousedown', () => {
    trail.style.width = '18px';
    trail.style.height = '18px';
  });
  document.addEventListener('mouseup', () => {
    trail.style.width = '12px';
    trail.style.height = '12px';
  });
}

// ===== BACKGROUND PARTICLES =====
function setupParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const EMOJIS = ['✨','♥','☠','🐱','💀','🌙','⭐','💕','🖤'];

  for (let i = 0; i < 30; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      size: 10 + Math.random() * 12,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -0.2 - Math.random() * 0.4,
      opacity: 0.1 + Math.random() * 0.3,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 0.5
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.font = `${p.size}px serif`;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation * Math.PI / 180);
      ctx.fillText(p.emoji, 0, 0);
      ctx.restore();
      p.x += p.speedX;
      p.y += p.speedY;
      p.rotation += p.rotSpeed;
      if (p.y < -30) {
        p.y = window.innerHeight + 30;
        p.x = Math.random() * window.innerWidth;
      }
      if (p.x < -30) p.x = window.innerWidth + 30;
      if (p.x > window.innerWidth + 30) p.x = -30;
    });
    requestAnimationFrame(animate);
  }
  animate();
}

// ===== AUDIO POPUP =====
function setupAudioPopup() {
  const popup = document.getElementById('audio-popup');
  const yesBtn = document.getElementById('audio-yes');
  const noBtn = document.getElementById('audio-no');

  yesBtn.addEventListener('click', () => {
    audioEnabled = true;
    dismissPopup();
    setTimeout(() => playSound('intro', 0.5), 500);
  });
  noBtn.addEventListener('click', () => {
    audioEnabled = false;
    dismissPopup();
  });

  function dismissPopup() {
    popup.style.opacity = '0';
    popup.style.transition = 'opacity 0.5s ease';
    setTimeout(() => { popup.style.display = 'none'; startPage1(); }, 500);
  }
}

// ===== PAGE 1 SETUP =====
function setupPage1() {
  const yesBtn = document.getElementById('btn-yes');
  if (!yesBtn) return;

  let hasFled = false;

  yesBtn.addEventListener('mouseenter', () => {
    if (!hasFled) {
      // First hover - make it flee by switching to fixed positioning
      hasFled = true;
      const rect = yesBtn.getBoundingClientRect();
      // Anchor it at its current position first, then move
      yesBtn.classList.add('fleeing');
      yesBtn.style.left = rect.left + 'px';
      yesBtn.style.top = rect.top + 'px';
      yesBtn.style.width = rect.width + 'px';
    }
    flee();
  });

  yesBtn.addEventListener('mousemove', () => {
    if (hasFled) flee();
  });

  function flee() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const btnW = 120;
    const btnH = 50;
    const newX = Math.random() * (w - btnW - 40) + 20;
    const newY = Math.random() * (h - btnH - 40) + 20;
    const rot = (Math.random() - 0.5) * 25;
    yesBtn.style.left = newX + 'px';
    yesBtn.style.top = newY + 'px';
    yesBtn.style.transform = `rotate(${rot}deg)`;
  }

  yesBtn.addEventListener('click', (e) => {
    e.preventDefault();
    yesBtn.style.transform = 'rotate(720deg) scale(0)';
    yesBtn.style.transition = 'transform 0.5s ease';
    setTimeout(() => { yesBtn.style.display = 'none'; }, 500);
  });
}

function startPage1() {
  // Already showing page 1 on load
  const page = document.getElementById('page-1');
  if (page) page.classList.add('active');
}

// ===== PAGE NAVIGATION =====
function goToPage(num) {
  if (num === currentPage) return;

  const currentEl = document.getElementById(`page-${currentPage}`);
  const nextEl = document.getElementById(`page-${num}`);

  if (!nextEl) return;

  // Flicker for page 2
  if (num === 2) {
    flickerScreen().then(() => transition());
  } else {
    transition();
  }

  function transition() {
    if (currentEl) {
      currentEl.classList.remove('active');
      currentEl.classList.add('exiting');
      setTimeout(() => currentEl.classList.remove('exiting'), 800);
    }
    setTimeout(() => {
      nextEl.classList.add('active');
      currentPage = num;
      onPageEnter(num);
    }, 400);
  }
}

function flickerScreen() {
  return new Promise(resolve => {
    const body = document.body;
    let count = 0;
    const interval = setInterval(() => {
      body.style.opacity = count % 2 === 0 ? '0.1' : '1';
      count++;
      if (count > 8) {
        clearInterval(interval);
        body.style.opacity = '1';
        resolve();
      }
    }, 80);
  });
}

// ===== ON PAGE ENTER HOOKS =====
function onPageEnter(num) {
  switch(num) {
    case 2: initPage2(); break;
    case 3: initPage3(); break;
    case 4: initPage4(); break;
    case 5: initPage5(); break;
    case 6: initPage6(); break;
    case 7: initPage7(); break;
    case 8: initPage8(); break;
  }
}

// ===== PAGE 2: DRAMATIC SAD =====
function initPage2() {
  playSound('sad', 0.6);
  startRain();
  // Dramatic text animation
  const t = document.getElementById('dramatic-knew');
  if (t) {
    t.style.animation = 'none';
    void t.offsetHeight;
    t.style.animation = 'dramaticAppear 0.5s ease';
  }
}

function startRain() {
  const canvas = document.getElementById('rain-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();

  const drops = Array.from({length: 150}, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    len: 10 + Math.random() * 20,
    speed: 3 + Math.random() * 5,
    opacity: 0.1 + Math.random() * 0.3
  }));

  let animating = true;
  function rainLoop() {
    if (!animating) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drops.forEach(d => {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(100, 150, 255, ${d.opacity})`;
      ctx.lineWidth = 1;
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x - 2, d.y + d.len);
      ctx.stroke();
      d.y += d.speed;
      if (d.y > canvas.height) {
        d.y = -d.len;
        d.x = Math.random() * canvas.width;
      }
    });
    requestAnimationFrame(rainLoop);
  }
  rainLoop();
}

function calmDown() {
  const btn = document.getElementById('btn-chill');
  if (!btn) return;
  btn.classList.add('inflating');
  setTimeout(() => {
    btn.classList.remove('inflating');
    btn.classList.add('popped');
    fireConfettiAt(window.innerWidth / 2, window.innerHeight / 2);
    setTimeout(() => goToPage(3), 400);
  }, 650);
}

// Mini confetti burst
function fireConfettiAt(x, y) {
  const colors = ['#ff2d78','#9b30ff','#3d5af1','#ff6eb4','#c084fc'];
  for (let i = 0; i < 40; i++) {
    const piece = document.createElement('div');
    piece.style.cssText = `
      position:fixed; left:${x}px; top:${y}px;
      width:8px; height:8px; border-radius:2px;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      pointer-events:none; z-index:999;
    `;
    document.body.appendChild(piece);
    const angle = Math.random() * Math.PI * 2;
    const vel = 5 + Math.random() * 10;
    const vx = Math.cos(angle) * vel;
    const vy = Math.sin(angle) * vel;
    let px = x, py = y, vy2 = vy;
    let frame = 0;
    const anim = setInterval(() => {
      frame++;
      px += vx;
      py += vy2;
      vy2 += 0.4;
      piece.style.left = px + 'px';
      piece.style.top = py + 'px';
      piece.style.opacity = Math.max(0, 1 - frame / 40);
      piece.style.transform = `rotate(${frame * 10}deg)`;
      if (frame >= 40) { clearInterval(anim); piece.remove(); }
    }, 16);
  }
}

// ===== PAGE 3: GREEN FLAG =====
function initPage3() {
  const input = document.getElementById('green-flag-input');
  const buttons = document.getElementById('input-buttons');
  const aiAnalysis = document.getElementById('ai-analysis');
  const barFill = document.getElementById('bar-fill');
  const prob = document.getElementById('green-flag-prob');

  input.addEventListener('input', () => {
    if (input.value.length > 0) {
      buttons.style.display = 'flex';
      buttons.style.animation = 'fadeIn 0.4s ease';
    }
    if (input.value.length >= 5) {
      aiAnalysis.style.display = 'block';
      aiAnalysis.style.animation = 'fadeIn 0.4s ease';
      // Animate bar
      setTimeout(() => {
        const pct = Math.min(100, 40 + input.value.length * 2);
        barFill.style.width = pct + '%';
        prob.textContent = pct > 80
          ? '💚 green flag probability: very high actually'
          : pct > 50
          ? '🟡 green flag probability: detected (maybe)'
          : '🔴 still analyzing… type more.';
      }, 300);
    }
  });

  const skipBtn = document.getElementById('btn-skip');
  const doneBtn = document.getElementById('btn-done-poo');

  skipBtn.addEventListener('click', () => showLiePopup());
  doneBtn.addEventListener('click', () => {
    const val = input.value.trim();
    if (val.length < 10) {
      showLiePopup();
    } else {
      goToPage(4);
    }
  });
}

function showLiePopup() {
  playSound('lie', 0.8);
  const popup = document.getElementById('lie-popup');
  popup.style.opacity = '1';
  popup.style.pointerEvents = 'all';
  popup.querySelector('.lie-popup-inner').style.animation = 'popIn 0.3s ease';

  // Shake screen
  document.getElementById('page-3').style.animation = 'screenShake 0.3s ease';
  setTimeout(() => {
    document.getElementById('page-3').style.animation = '';
  }, 300);

  setTimeout(() => {
    popup.style.opacity = '0';
    popup.style.pointerEvents = 'none';
  }, 1500);
}

// ===== PAGE 4: COMPLIMENTS =====
function initPage4() {
  currentCompliment = 0;
  updateCompliment();
  scheduleWarningPopup();
  startFloatingCats('page4-cats');
}

function updateCompliment() {
  const items = document.querySelectorAll('.compliment-item');
  items.forEach((item, i) => {
    item.classList.toggle('active', i === currentCompliment);
  });

  const nextBtn = document.getElementById('btn-next-compliment');
  const doneBtn = document.getElementById('btn-to-page5');

  if (currentCompliment >= items.length - 1) {
    if (nextBtn) nextBtn.style.display = 'none';
    if (doneBtn) {
      doneBtn.style.display = 'inline-block';
      doneBtn.style.animation = 'fadeIn 0.6s ease';
    }
    showWarningPopup();
  } else {
    if (nextBtn) nextBtn.style.display = 'inline-block';
    if (doneBtn) doneBtn.style.display = 'none';
  }
}

function nextCompliment() {
  const items = document.querySelectorAll('.compliment-item');
  if (currentCompliment < items.length - 1) {
    currentCompliment++;
    updateCompliment();
    if (Math.random() > 0.5) showWarningPopup();
  }
}

function scheduleWarningPopup() {
  setTimeout(() => showWarningPopup(), 3000);
}

function showWarningPopup() {
  const popup = document.getElementById('warning-popup');
  if (!popup) return;
  popup.classList.add('visible');
  setTimeout(() => popup.classList.remove('visible'), 2500);
}

function startFloatingCats(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const catEmojis = ['🐱','😸','😺','🐾','😻'];
  setInterval(() => {
    const cat = document.createElement('div');
    cat.className = 'floating-cat';
    cat.textContent = catEmojis[Math.floor(Math.random() * catEmojis.length)];
    cat.style.left = Math.random() * 100 + '%';
    cat.style.animationDuration = (8 + Math.random() * 8) + 's';
    cat.style.animationDelay = '0s';
    cat.style.fontSize = (1 + Math.random() * 1.5) + 'rem';
    container.appendChild(cat);
    setTimeout(() => cat.remove(), 16000);
  }, 1500);
}

// ===== PAGE 5: GOTHIC MOMMY =====
function initPage5() {
  if (page5Triggered) return;
  page5Triggered = true;

  const theWord = document.getElementById('the-word');
  const right = document.getElementById('page5-right');
  const btn = document.getElementById('btn-to-page6');

  // After title appears (~2s animation delay + 1s pause)
  setTimeout(() => {
    playSound('sus', 0.8);

    // Screen shake
    const p5 = document.getElementById('page-5');
    if (p5) { p5.style.animation = 'screenShake 0.4s ease'; setTimeout(() => p5.style.animation = '', 400); }

    // Fade out just the word "mommy"
    if (theWord) {
      theWord.classList.add('fading');
      setTimeout(() => {
        theWord.textContent = 'baddie';
        theWord.classList.remove('fading');
      }, 250); // halfway through fade → swap text → fade back in
    }

    // Reveal right image
    setTimeout(() => {
      if (right) right.classList.add('revealed');
      const left = document.getElementById('page5-left');
      if (left) { left.style.transition = 'text-align 0.8s ease'; left.style.textAlign = 'left'; }
    }, 500);

    // Show button
    setTimeout(() => {
      if (btn) { btn.style.display = 'inline-block'; btn.style.animation = 'fadeIn 0.6s ease'; }
    }, 1200);

  }, 3200);
}

// ===== PAGE 6: FAKE FINAL =====
function initPage6() {
  playSound('celebration', 0.7);
  startMegaConfetti();
  startBouncingCats();
}

function startMegaConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#ff2d78','#9b30ff','#3d5af1','#ff6eb4','#c084fc','#ffd700','#00ff88'];
  const pieces = [];

  for (let i = 0; i < 120; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: 5 + Math.random() * 10,
      h: 5 + Math.random() * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      speedX: (Math.random() - 0.5) * 3,
      speedY: 2 + Math.random() * 4,
      rotSpeed: (Math.random() - 0.5) * 5
    });
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      ctx.save();
      ctx.translate(p.x + p.w/2, p.y + p.h/2);
      ctx.rotate(p.rotation * Math.PI / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
      ctx.restore();
      p.x += p.speedX;
      p.y += p.speedY;
      p.rotation += p.rotSpeed;
      if (p.y > canvas.height + 20) {
        p.y = -20;
        p.x = Math.random() * canvas.width;
      }
    });
    requestAnimationFrame(loop);
  }
  loop();
}

function startBouncingCats() {
  const container = document.getElementById('page6-cats-container');
  if (!container) return;

  const catEmojis = ['🐱','😸','😺','😻','🙀','😾'];
  for (let i = 0; i < 12; i++) {
    const cat = document.createElement('div');
    cat.className = 'bouncing-cat-p6';
    cat.textContent = catEmojis[Math.floor(Math.random() * catEmojis.length)];

    const x = Math.random() * 90 + '%';
    const delay = Math.random() * 2;
    const dur = 0.8 + Math.random() * 1;
    const size = 1.5 + Math.random() * 2;

    cat.style.cssText = `
      left: ${x}; top: ${20 + Math.random() * 60}%;
      animation-duration: ${dur}s;
      animation-delay: ${delay}s;
      font-size: ${size}rem;
    `;
    container.appendChild(cat);
  }
}

// ===== PAGE 7: REAL FINAL =====
function initPage7() {
  stopSound('celebration');
  createStars();
  animateFinalMessage();
}

function createStars() {
  const container = document.getElementById('stars-bg');
  if (!container) return;
  for (let i = 0; i < 80; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = 1 + Math.random() * 3;
    star.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation-duration: ${2 + Math.random() * 4}s;
      animation-delay: ${Math.random() * 3}s;
    `;
    container.appendChild(star);
  }
}

function animateFinalMessage() {
  const paras = document.querySelectorAll('.final-message p');
  paras.forEach((p, i) => {
    p.style.opacity = '0';
    p.style.transform = 'translateY(15px)';
    p.style.transition = 'all 0.6s ease';
    setTimeout(() => {
      p.style.opacity = '1';
      p.style.transform = 'translateY(0)';
    }, 300 + i * 300);
  });
}

function theEnd() {
  const popup = document.getElementById('achievement-popup');
  if (popup) popup.classList.add('visible');

  // Random cat appears
  const cat = document.createElement('div');
  cat.textContent = '🐱';
  cat.style.cssText = `
    position: fixed;
    left: 50%; top: 50%;
    transform: translate(-50%, -50%);
    font-size: 6rem;
    z-index: 999;
    animation: popIn 0.5s ease;
    pointer-events: none;
  `;
  document.body.appendChild(cat);
  playSound('meow', 0.8);

  setTimeout(() => {
    cat.remove();
    popup.classList.remove('visible');
    goToPage(8);
  }, 2200);
}

// ===== PAGE 8: THE END =====
function initPage8() {
  createStars2();
  spawnEndHearts();
}

function createStars2() {
  const container = document.getElementById('stars-bg-2');
  if (!container) return;
  for (let i = 0; i < 100; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = 1 + Math.random() * 3;
    star.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${Math.random() * 100}%; top: ${Math.random() * 100}%;
      animation-duration: ${2 + Math.random() * 4}s;
      animation-delay: ${Math.random() * 3}s;
    `;
    container.appendChild(star);
  }
}

function spawnEndHearts() {
  const container = document.getElementById('end-hearts');
  if (!container) return;
  const items = ['🖤','💜','🌙','✨','☠','🐱','💕'];
  setInterval(() => {
    const el = document.createElement('div');
    el.className = 'end-heart';
    el.textContent = items[Math.floor(Math.random() * items.length)];
    el.style.left = Math.random() * 100 + '%';
    el.style.fontSize = (0.8 + Math.random() * 1.4) + 'rem';
    el.style.animationDuration = (6 + Math.random() * 8) + 's';
    el.style.animationDelay = '0s';
    container.appendChild(el);
    setTimeout(() => el.remove(), 14000);
  }, 800);
}

// ===== MOBILE: FLOATING SKULLS & CATS =====
function setupMobileFloats() {
  const skulls = document.getElementById('floating-skulls');
  const cats = document.getElementById('bouncing-cats');
  if (!skulls || !cats) return;

  for (let i = 0; i < 12; i++) {
    const s = document.createElement('div');
    s.textContent = '💀';
    s.style.cssText = `
      position: absolute;
      font-size: ${1 + Math.random() * 2}rem;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: float ${3 + Math.random() * 4}s ease-in-out ${Math.random() * 2}s infinite;
      opacity: 0.3;
      pointer-events: none;
    `;
    skulls.appendChild(s);
  }

  for (let i = 0; i < 6; i++) {
    const c = document.createElement('div');
    c.textContent = ['🐱','😸','🐾'][Math.floor(Math.random() * 3)];
    c.style.cssText = `
      position: absolute;
      font-size: ${1 + Math.random() * 1.5}rem;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: catBounce ${0.8 + Math.random() * 0.8}s ease-in-out ${Math.random() * 1}s infinite;
      pointer-events: none;
    `;
    cats.appendChild(c);
  }
}

// ===== EASTER EGGS =====
function startEasterEggs() {
  // Random "emotional damage" popup every ~30-45 seconds
  setInterval(() => {
    if (Math.random() > 0.6) showEmotionalDamage();
  }, 35000);

  // Fake error message occasionally
  setInterval(() => {
    if (Math.random() > 0.7) showFakeError();
  }, 45000);

  // Random meow on click every now and then
  document.addEventListener('click', () => {
    if (Math.random() > 0.95) playSound('meow', 0.4);
  });

  // Konami code Easter egg
  setupKonami();

  // Triple click anywhere shows bat
  let clickCount = 0;
  document.addEventListener('click', () => {
    clickCount++;
    if (clickCount >= 3) {
      clickCount = 0;
      spawnBat(event.clientX, event.clientY);
    }
    setTimeout(() => clickCount = 0, 800);
  });
}

function showEmotionalDamage() {
  const el = document.getElementById('emotional-damage');
  if (!el) return;
  el.classList.remove('flash');
  void el.offsetHeight;
  el.classList.add('flash');
  setTimeout(() => el.classList.remove('flash'), 1100);
}

function showFakeError() {
  const el = document.getElementById('fake-error');
  if (!el) return;
  el.classList.add('visible');
  setTimeout(() => el.classList.remove('visible'), 3000);
}

function spawnBat(x, y) {
  const bat = document.createElement('div');
  bat.textContent = '🦇';
  bat.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    font-size: 1.5rem;
    z-index: 999;
    pointer-events: none;
    animation: floatCat ${2 + Math.random() * 2}s ease forwards;
  `;
  document.body.appendChild(bat);
  setTimeout(() => bat.remove(), 4000);
}

function setupKonami() {
  const code = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let pos = 0;
  document.addEventListener('keydown', e => {
    if (e.key === code[pos]) {
      pos++;
      if (pos === code.length) {
        pos = 0;
        konami();
      }
    } else {
      pos = 0;
    }
  });
}

function konami() {
  showEmotionalDamage();
  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      spawnBat(Math.random() * window.innerWidth, Math.random() * window.innerHeight);
    }, i * 100);
  }
  showFakeError();
}

// ===== EXPOSE TO HTML =====
window.goToPage = goToPage;
window.calmDown = calmDown;
window.nextCompliment = nextCompliment;
window.theEnd = theEnd;
