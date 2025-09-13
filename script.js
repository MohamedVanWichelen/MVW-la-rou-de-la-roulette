// ====== Palette ======
const PALETTE_LIGHT = [
  "#6C82A0",  // Bleu gris clair
  "#38536C",  // Bleu acier
  "#152238",  // Bleu marine
  "#0B0F19",  // Bleu nuit
  "#EFEBD9"   // Crème clair
];

const PALETTE_DARK = [
  "#EFEBD9",  // Crème clair (inversé)
  "#6C82A0",  // Bleu gris
  "#38536C",  // Bleu acier
  "#152238",  // Bleu marine
  "#0B0F19"   // Bleu nuit
];

// Fonction pour obtenir la palette selon le mode
function getCurrentPalette() {
  const isDarkMode = document.documentElement.classList.contains('dark') || 
                     document.body.classList.contains('dark');
  return isDarkMode ? PALETTE_DARK : PALETTE_LIGHT;
}

// ====== DOM ======
let canvas, ctx, spinBtn, resultEl, modeBtn, addChoiceBtn, choicesList;

// ====== State ======
let choices = ["Oui","Non","Plus tard","Demander un avis"];
let rotation = 0;     // radians
let spinning = false;

// ====== Physics ======
let angularVelocity = 0;  // radians per frame
let angularAcceleration = 0;
let friction = 0.982;     // friction coefficient - plus naturel
let minVelocity = 0.0008; // minimum velocity before stopping - plus basse
let maxVelocity = 0.8;    // maximum velocity - plus haute pour plus d'excitation
let spinForce = 0.08;     // initial spin force - plus forte pour démarrage naturel
let targetSegment = -1;   // target segment index
let isDecelerating = false;
let decelerationPhase = false; // Track deceleration phase
let minTurns = 4;         // Minimum number of full turns - plus réaliste
let maxTurns = 8;         // Maximum number of full turns - plus réaliste

// ====== Responsive canvas ======
function resizeCanvas(){
  const wrap = canvas.parentElement;
  const isMobile = window.innerWidth <= 768;
  const padding = isMobile ? 24 : 28; // More padding on mobile
  const maxSize = isMobile ? 400 : 700; // Smaller max size on mobile
  const size = Math.min(wrap.clientWidth - padding, maxSize);
  const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  canvas.width  = size * DPR;
  canvas.height = size * DPR;
  canvas.style.width  = size + 'px';
  canvas.style.height = size + 'px';
  ctx.setTransform(DPR,0,0,DPR,0,0);
  draw();
}
window.addEventListener('resize', resizeCanvas);

// ====== Helpers ======
function getSegments(){
  const arr = choices.filter(c => c && c.trim()).map(c => c.trim());
  const n = Math.max(2, Math.min(8, arr.length));
  return arr.slice(0,n);
}

function wrapText(ctx, text, x, y, lineHeight, maxWidth){
  const words = text.split(' ');
  let line = '';
  const lines = [];
  for(let n=0;n<words.length;n++){
    const testLine = line + words[n] + ' ';
    const w = ctx.measureText(testLine).width;
    if (w > maxWidth && n>0){
      lines.push(line.trim());
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line.trim());
  for(let i=0;i<lines.length;i++){
    ctx.fillText(lines[i], x, y - (lines.length-1-i)*lineHeight);
  }
}

// ====== Draw wheel ======
function draw(){
  console.log('draw() called');
  console.log('canvas:', canvas);
  console.log('choices:', choices);
  
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const w = canvas.width / dpr;
  const h = canvas.height / dpr;
  const cx = w/2, cy = h/2;
  const r = Math.min(w, h)/2 - 20;

  ctx.clearRect(0,0,w,h);

  const segs = getSegments();
  const n = segs.length;
  const arc = (Math.PI * 2) / n;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);

  // Check mode once at the beginning
  const isDarkMode = document.documentElement.classList.contains('dark') || 
                     document.body.classList.contains('dark');

  // Draw outer rim with metallic effect - adapt to mode
  ctx.beginPath();
  ctx.arc(0, 0, r + 8, 0, Math.PI * 2);
  ctx.closePath();
  const rimGradient = ctx.createRadialGradient(0, 0, r, 0, 0, r + 8);
  
  if (isDarkMode) {
    // Dark mode rim - metallic dark
    rimGradient.addColorStop(0, '#38536C');
    rimGradient.addColorStop(0.5, '#152238');
    rimGradient.addColorStop(1, '#0B0F19');
  } else {
    // Light mode rim - metallic light
    rimGradient.addColorStop(0, '#E5E5E7');
    rimGradient.addColorStop(0.5, '#D1D1D6');
    rimGradient.addColorStop(1, '#AEAEB2');
  }
  
  ctx.fillStyle = rimGradient;
  ctx.fill();

  // Draw segments
  const currentPalette = getCurrentPalette();
  const harmoniousPalette = createHarmoniousPalette(currentPalette);
  for(let i=0; i<n; i++){
    const start = i * arc;
    const end = start + arc;

    // Main segment
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, r, start, end, false);
    ctx.closePath();
    
    // Create gradient for each segment with harmonious palette
    const segmentGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
    const baseColor = harmoniousPalette[i % harmoniousPalette.length];
    segmentGradient.addColorStop(0, lightenColor(baseColor, 25));
    segmentGradient.addColorStop(0.7, baseColor);
    segmentGradient.addColorStop(1, darkenColor(baseColor, 20));
    
    ctx.fillStyle = segmentGradient;
    ctx.fill();

    // Segment border with 3D effect - adapt to mode
    
    // Light border for contrast
    ctx.strokeStyle = isDarkMode ? 'rgba(239,235,217,0.3)' : 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, r, start, end, false);
    ctx.stroke();

    // Inner shadow for depth - adapt to mode
    ctx.strokeStyle = isDarkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, r - 1, start, end, false);
    ctx.stroke();

    // Label with better contrast
    ctx.save();
    const mid = start + arc/2;
    ctx.rotate(mid);
    ctx.textAlign = 'right';
    
    // Text shadow for readability
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    
    ctx.fillStyle = getContrastColor(baseColor);
    // Adjust font size based on number of segments and mobile
    const isMobile = window.innerWidth <= 768;
    const segmentCount = segs.length;
    let baseFontSize;
    
    if (segmentCount >= 8) {
      // Smaller font for 8 segments
      baseFontSize = isMobile ? Math.max(10, Math.min(14, r*0.08)) : Math.max(9, Math.min(12, r*0.07));
    } else if (segmentCount >= 6) {
      // Medium font for 6-7 segments
      baseFontSize = isMobile ? Math.max(12, Math.min(16, r*0.09)) : Math.max(11, Math.min(15, r*0.08));
    } else {
      // Normal font for 2-5 segments
      baseFontSize = isMobile ? Math.max(14, Math.min(22, r*0.11)) : Math.max(13, Math.min(20, r*0.09));
    }
    
    ctx.font = `600 ${baseFontSize}px -apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif`;
    const text = segs[i];
    const maxWidth = segmentCount >= 8 ? (isMobile ? 100 : 90) : (isMobile ? 160 : 140);
    wrapText(ctx, text, r - 25, 0, baseFontSize, maxWidth);
    
    ctx.shadowColor = 'transparent';
    ctx.restore();
  }

  // Center hub with metallic effect - adapt to mode
  const hubRadius = Math.max(20, r*0.15);
  ctx.beginPath();
  ctx.arc(0, 0, hubRadius, 0, Math.PI*2);
  ctx.closePath();
  
  const hubGradient = ctx.createRadialGradient(0, 0, 2, 0, 0, hubRadius);
  if (isDarkMode) {
    // Dark mode hub - metallic dark
    hubGradient.addColorStop(0, '#EFEBD9');
    hubGradient.addColorStop(0.3, '#6C82A0');
    hubGradient.addColorStop(0.7, '#38536C');
    hubGradient.addColorStop(1, '#152238');
  } else {
    // Light mode hub - metallic light
    hubGradient.addColorStop(0, '#FFFFFF');
    hubGradient.addColorStop(0.3, '#F2F2F7');
    hubGradient.addColorStop(0.7, '#D1D1D6');
    hubGradient.addColorStop(1, '#AEAEB2');
  }
  
  ctx.fillStyle = hubGradient;
  ctx.fill();
  
  // Hub border - adapt to mode
  ctx.strokeStyle = isDarkMode ? 'rgba(239,235,217,0.2)' : 'rgba(0,0,0,0.2)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.restore();
}

// Helper functions for color manipulation
function lightenColor(color, percent) {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

function darkenColor(color, percent) {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) - amt;
  const G = (num >> 8 & 0x00FF) - amt;
  const B = (num & 0x0000FF) - amt;
  return "#" + (0x1000000 + (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 +
    (G > 255 ? 255 : G < 0 ? 0 : G) * 0x100 +
    (B > 255 ? 255 : B < 0 ? 0 : B)).toString(16).slice(1);
}

// Create harmonious color variations
function createHarmoniousPalette(basePalette) {
  return basePalette.map((color, index) => {
    // Add subtle variations to create more visual interest
    const variation = Math.sin(index * Math.PI / 3) * 15; // ±15 variation
    return variation > 0 ? lightenColor(color, variation) : darkenColor(color, -variation);
  });
}

function getContrastColor(color) {
  const rgb = parseInt(color.replace("#", ""), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luma > 128 ? '#000000' : '#FFFFFF';
}

// ====== Update choices ======
function updateChoices(){
  console.log('updateChoices called');
  
  // Get choices from individual input fields
  const inputs = choicesList.querySelectorAll('.choice-item input');
  const arr = Array.from(inputs)
    .map(input => input.value.trim())
    .filter(Boolean);
  
  console.log('parsed choices:', arr);
  
  choices = arr.length < 2 ? ["Choix 1","Choix 2"] : arr.slice(0,8);
  console.log('final choices:', choices);
  
  resultEl.textContent = '';
  
  // Update layout for 6+ choices
  if (choices.length >= 6) {
    choicesList.classList.add('two-columns');
  } else {
    choicesList.classList.remove('two-columns');
  }
  
  // Reset rotation to prevent cumulative issues
  rotation = 0;
  
  draw();
  
  // Enable spin button if we have valid choices
  if (choices.length >= 2) {
    spinBtn.disabled = false;
    spinBtn.style.opacity = '1';
  } else {
    spinBtn.disabled = true;
    spinBtn.style.opacity = '0.5';
  }
  
  // Update add button state
  updateAddButtonState();
}

// ====== Choice Management ======
function createChoiceItem(value = '', placeholder = '') {
  const choiceItem = document.createElement('div');
  choiceItem.className = 'choice-item';
  
  const input = document.createElement('input');
  input.type = 'text';
  input.value = value;
  input.placeholder = placeholder || 'Entrez un choix...';
  input.maxLength = 50;
  
  const removeBtn = document.createElement('button');
  removeBtn.className = 'remove-choice-btn';
  removeBtn.type = 'button';
  removeBtn.innerHTML = '×';
  removeBtn.title = 'Supprimer ce choix';
  
  choiceItem.appendChild(input);
  choiceItem.appendChild(removeBtn);
  
  // Add event listeners
  input.addEventListener('input', updateChoices);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addNewChoice();
    }
  });
  
  removeBtn.addEventListener('click', () => {
    removeChoice(choiceItem);
  });
  
  return choiceItem;
}

function addNewChoice() {
  const currentChoices = choicesList.querySelectorAll('.choice-item');
  if (currentChoices.length >= 8) {
    alert('Maximum 8 choix autorisés');
    return;
  }
  
  const newChoice = createChoiceItem('', `Choix ${currentChoices.length + 1}`);
  choicesList.appendChild(newChoice);
  
  // Focus on the new input
  const input = newChoice.querySelector('input');
  input.focus();
  
  updateChoices();
}

function removeChoice(choiceItem) {
  const currentChoices = choicesList.querySelectorAll('.choice-item');
  if (currentChoices.length <= 2) {
    alert('Minimum 2 choix requis');
    return;
  }
  
  choiceItem.remove();
  updateChoices();
}

function updateAddButtonState() {
  const currentChoices = choicesList.querySelectorAll('.choice-item');
  addChoiceBtn.disabled = currentChoices.length >= 8;
}

function initializeChoices() {
  choicesList.innerHTML = '';
  
  // Create initial choices
  const initialChoices = ["Oui", "Non", "Plus tard", "Demander un avis"];
  initialChoices.forEach((choice, index) => {
    const choiceItem = createChoiceItem(choice, `Choix ${index + 1}`);
    choicesList.appendChild(choiceItem);
  });
  
  updateChoices();
}

// ====== Realistic Physics-based Spin ======
function spin(){
  if(spinning) return;
  
  const segs = getSegments();
  const n = segs.length;
  
  // Reset physics - NO pre-selection of target
  angularVelocity = 0;
  angularAcceleration = 0;
  isDecelerating = false;
  decelerationPhase = false;
  targetSegment = -1; // No predetermined target
  
  // Normalize current rotation to prevent accumulation
  rotation = rotation % (Math.PI * 2);
  
  // Apply very strong initial spin force for multiple turns
  const baseForce = spinForce;
  const randomVariation = Math.random() * spinForce * 0.4; // 0 to 40% variation
  angularVelocity = baseForce + randomVariation; // Very strong start for multiple turns
  
  // Calculate target number of turns for suspense
  const targetTurns = minTurns + Math.random() * (maxTurns - minTurns);
  const targetRotation = targetTurns * Math.PI * 2; // Convert to radians
  
  console.log('Starting velocity:', angularVelocity);
  console.log('Target turns:', targetTurns.toFixed(1));
  console.log('Target rotation:', targetRotation.toFixed(2));
  
  spinning = true;
  resultEl.textContent = '...';
  
  // Play spin sound
  playSpinSound();
  
  // Start physics loop
  physicsLoop();
}

function physicsLoop(){
  if(!spinning) return;
  
  // Calculate total rotation so far
  const totalRotation = Math.abs(rotation);
  const totalTurns = totalRotation / (Math.PI * 2);
  
  // Apply natural progressive deceleration based on turns completed
  if(!decelerationPhase) {
    // Fast phase - maintain speed for multiple turns with natural variation
    if(totalTurns < minTurns) {
      // Keep high speed for minimum turns with slight natural variation
      const naturalVariation = 0.998 + (Math.random() * 0.004 - 0.002);
      angularVelocity *= naturalVariation;
    } else if(totalTurns < minTurns + 1.5) {
      // Start slowing down after minimum turns
      angularVelocity *= 0.992; // Light friction
    } else {
      // Switch to deceleration phase
      decelerationPhase = true;
      console.log('Switching to deceleration phase after', totalTurns.toFixed(1), 'turns');
    }
  } else {
    // Slow phase - natural deceleration for final stop
    const naturalFriction = friction + (Math.random() * 0.003 - 0.0015);
    angularVelocity *= naturalFriction;
  }
  
  // Update rotation
  rotation += angularVelocity;
  
  // Keep rotation in 0-2π range for drawing, but track total rotation
  const normalizedRotation = rotation % (Math.PI * 2);
  if(normalizedRotation < 0) normalizedRotation += Math.PI * 2;
  
  // Draw current state with normalized rotation
  const originalRotation = rotation;
  rotation = normalizedRotation;
  draw();
  rotation = originalRotation; // Restore for physics calculations
  
  // Add visual feedback for rotation speed and turns
  if(spinning) {
    const speed = Math.abs(angularVelocity);
    const intensity = Math.min(1, speed / maxVelocity);
    
    // Add subtle blur effect for fast rotation
    if(intensity > 0.3) {
      canvas.style.filter = `blur(${intensity * 2}px)`;
    } else {
      canvas.style.filter = 'none';
    }
    
    // Update result text to show turns count
    const turnsText = totalTurns.toFixed(1);
    resultEl.textContent = `Tour ${turnsText}...`;
  } else {
    canvas.style.filter = 'none';
  }
  
  // Check if wheel has stopped
  if(Math.abs(angularVelocity) < minVelocity){
    spinning = false;
    console.log('Wheel stopped after', totalTurns.toFixed(1), 'turns');
    console.log('Final velocity:', angularVelocity);
    // Determine result based on final position
    determineResult();
  } else {
    requestAnimationFrame(physicsLoop);
  }
}

function determineResult(){
  const segs = getSegments();
  const n = segs.length;
  const arc = (Math.PI * 2) / n;
  
  // Normalize rotation to 0-2π range
  let normalizedRotation = rotation % (Math.PI * 2);
  if(normalizedRotation < 0) normalizedRotation += Math.PI * 2;
  
  // The pointer is fixed at the top (-π/2 radians)
  // We need to find which segment is currently under the pointer
  // This is the most fair way - the wheel stops naturally and we read what's under the pointer
  
  let selectedSegment = 0;
  
  // Calculate the angle of each segment center relative to the wheel's current rotation
  for(let i = 0; i < n; i++){
    const segmentCenterAngle = (i * arc) + (arc / 2);
    
    // Calculate the angle between the segment center and the pointer position
    // The pointer is at -π/2 (top), so we need to see which segment center is closest
    let angleToPointer = segmentCenterAngle - normalizedRotation;
    
    // Normalize angle to -π to π range
    while(angleToPointer > Math.PI) angleToPointer -= Math.PI * 2;
    while(angleToPointer < -Math.PI) angleToPointer += Math.PI * 2;
    
    // Check if this segment is closest to the pointer (-π/2)
    // We want the segment whose center is closest to -π/2
    if(Math.abs(angleToPointer - (-Math.PI / 2)) < arc / 2){
      selectedSegment = i;
      break;
    }
  }
  
  console.log('Final rotation:', normalizedRotation);
  console.log('Selected segment:', selectedSegment);
  console.log('Segment content:', segs[selectedSegment]);
  
  // Track results for fairness testing (optional)
  trackResult(selectedSegment);
  
  finalizeResult(selectedSegment);
}

// Optional: Track results to verify fairness
let resultTracker = {};
function trackResult(segmentIndex){
  const segs = getSegments();
  const choice = segs[segmentIndex];
  resultTracker[choice] = (resultTracker[choice] || 0) + 1;
  
  // Log statistics every 10 spins
  const totalSpins = Object.values(resultTracker).reduce((a, b) => a + b, 0);
  if(totalSpins % 10 === 0){
    console.log('Fairness statistics:', resultTracker);
    console.log('Total spins:', totalSpins);
  }
}

function finalizeResult(selectedSegment){
  const segs = getSegments();
  const winner = segs[selectedSegment];
  resultEl.textContent = `🎯 Le choix gagnant est : ${winner}`;
  celebrate();
  
  // Highlight the pointer to show result
  highlightPointer();
  
  // Haptic feedback
  if(navigator.vibrate) {
    navigator.vibrate([50, 30, 50]); // Pattern: vibrate, pause, vibrate
  }
  
  // Sound effect (optional - will add if supported)
  playSpinCompleteSound();
}

function highlightPointer() {
  const pointer = document.querySelector('.pointer svg');
  if (pointer) {
    pointer.style.animation = 'pointerHighlight 1s ease-in-out 3';
    setTimeout(() => {
      pointer.style.animation = 'pointerPulse 2s ease-in-out infinite';
    }, 3000);
  }
}

function playSpinCompleteSound(){
  // Create a more realistic "ding" sound effect
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create multiple oscillators for a richer sound
    const oscillator1 = audioContext.createOscillator();
    const oscillator2 = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filterNode = audioContext.createBiquadFilter();
    
    oscillator1.connect(filterNode);
    oscillator2.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Main tone (bell-like)
    oscillator1.type = 'sine';
    oscillator1.frequency.setValueAtTime(880, audioContext.currentTime); // A5
    oscillator1.frequency.exponentialRampToValueAtTime(660, audioContext.currentTime + 0.4);
    
    // Harmonic
    oscillator2.type = 'sine';
    oscillator2.frequency.setValueAtTime(1320, audioContext.currentTime); // E6
    oscillator2.frequency.exponentialRampToValueAtTime(990, audioContext.currentTime + 0.4);
    
    // Filter for bell-like quality
    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(2000, audioContext.currentTime);
    filterNode.Q.setValueAtTime(1, audioContext.currentTime);
    
    // Envelope
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
    
    oscillator1.start(audioContext.currentTime);
    oscillator2.start(audioContext.currentTime);
    oscillator1.stop(audioContext.currentTime + 0.4);
    oscillator2.stop(audioContext.currentTime + 0.4);
  } catch(e) {
    // Sound not supported, continue silently
  }
}

function playSpinSound(){
  // Create spinning sound effect that matches the multiple turns
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator1 = audioContext.createOscillator();
    const oscillator2 = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filterNode = audioContext.createBiquadFilter();
    
    oscillator1.connect(filterNode);
    oscillator2.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Longer duration for multiple turns (5-8 seconds)
    const soundDuration = 6 + Math.random() * 2; // 6-8 seconds
    
    // Create a more realistic spinning sound
    oscillator1.type = 'sawtooth';
    oscillator1.frequency.setValueAtTime(150, audioContext.currentTime); // Higher frequency for fast spin
    oscillator1.frequency.linearRampToValueAtTime(120, audioContext.currentTime + soundDuration * 0.3); // Maintain speed
    oscillator1.frequency.exponentialRampToValueAtTime(25, audioContext.currentTime + soundDuration); // Slow down at end
    
    oscillator2.type = 'triangle';
    oscillator2.frequency.setValueAtTime(250, audioContext.currentTime); // Higher harmonic
    oscillator2.frequency.linearRampToValueAtTime(200, audioContext.currentTime + soundDuration * 0.3);
    oscillator2.frequency.exponentialRampToValueAtTime(40, audioContext.currentTime + soundDuration);
    
    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(1200, audioContext.currentTime); // Start with higher frequency
    filterNode.frequency.linearRampToValueAtTime(1000, audioContext.currentTime + soundDuration * 0.3);
    filterNode.frequency.exponentialRampToValueAtTime(150, audioContext.currentTime + soundDuration); // Lower as it slows
    filterNode.Q.setValueAtTime(0.2, audioContext.currentTime);
    
    // Envelope that matches the multiple turns
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime); // Start loud
    gainNode.gain.linearRampToValueAtTime(0.08, audioContext.currentTime + soundDuration * 0.2); // Stay loud
    gainNode.gain.linearRampToValueAtTime(0.06, audioContext.currentTime + soundDuration * 0.7); // Maintain during turns
    gainNode.gain.exponentialRampToValueAtTime(0.005, audioContext.currentTime + soundDuration); // Fade out at end
    
    oscillator1.start(audioContext.currentTime);
    oscillator2.start(audioContext.currentTime);
    oscillator1.stop(audioContext.currentTime + soundDuration);
    oscillator2.stop(audioContext.currentTime + soundDuration);
  } catch(e) {
    // Sound not supported, continue silently
  }
}

// ====== Mini-confettis ======
function celebrate(){
  const wrap = canvas.parentElement;
  const N = 26;
  for(let i=0;i<N;i++){
    const dot = document.createElement('div');
    const size = 6 + Math.random()*6;
    dot.className = 'confetti-dot';
    dot.style.width = size + 'px';
    dot.style.height = size + 'px';
    dot.style.background = PALETTE[i % PALETTE.length];
    dot.style.left = '50%';
    dot.style.top = '50%';
    dot.style.transform = 'translate(-50%, -50%)';
    wrap.appendChild(dot);

    const ang = Math.random()*Math.PI*2;
    const dist = 40 + Math.random()*120;
    const tx = Math.cos(ang)*dist;
    const ty = Math.sin(ang)*dist;
    const life = 600 + Math.random()*600;

    requestAnimationFrame(()=>{
      dot.style.transition = `transform ${life}ms ease-out, opacity ${life}ms ease-in`;
      dot.style.transform = `translate(${tx}px, ${ty}px)`;
      dot.style.opacity = '0';
    });
    setTimeout(()=> dot.remove(), life + 40);
  }
}

// ====== Mode clair/sombre ======
function toggleMode(){
  const root = document.documentElement;
  if (root.classList.contains('dark')) {
    root.classList.remove('dark');
    document.body.classList.remove('dark');
    localStorage.setItem('mode','light');
  } else {
    root.classList.add('dark');
    document.body.classList.add('dark');
    localStorage.setItem('mode','dark');
  }
  
  // Redraw the wheel with new colors
  draw();
}
function initMode(){
  const saved = localStorage.getItem('mode');
  if(saved === 'dark'){
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');
  }
}

// ====== Initialization ======
function initApp() {
  // Get DOM elements
  canvas = document.getElementById('wheel');
  ctx = canvas.getContext('2d');
  spinBtn = document.getElementById('spinBtn');
  resultEl = document.getElementById('result');
  modeBtn = document.getElementById('modeBtn');
  addChoiceBtn = document.getElementById('addChoiceBtn');
  choicesList = document.getElementById('choicesList');

  // Initialize choices system
  initializeChoices();

  // Attach event listeners
  spinBtn.addEventListener('click', spin);
  modeBtn.addEventListener('click', toggleMode);
  addChoiceBtn.addEventListener('click', addNewChoice);
  
  
  // Mobile optimizations
  // Prevent zoom on input focus for choice inputs
  choicesList.addEventListener('focusin', (e) => {
    if (e.target.tagName === 'INPUT' && window.innerWidth <= 768) {
      const viewport = document.querySelector('meta[name="viewport"]');
      viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
    }
  });
  
  choicesList.addEventListener('focusout', (e) => {
    if (e.target.tagName === 'INPUT' && window.innerWidth <= 768) {
      const viewport = document.querySelector('meta[name="viewport"]');
      viewport.setAttribute('content', 'width=device-width, initial-scale=1');
    }
  });
  
  // Add touch feedback for buttons
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(btn => {
    btn.addEventListener('touchstart', () => {
      btn.style.transform = 'scale(0.95)';
    });
    
    btn.addEventListener('touchend', () => {
      setTimeout(() => {
        btn.style.transform = '';
      }, 150);
    });
  });
  
  // Add a function to reset statistics (for testing fairness)
  window.resetStats = () => {
    resultTracker = {};
    console.log('Statistics reset!');
  };
  
  // Add a function to show current statistics
  window.showStats = () => {
    console.log('Current statistics:', resultTracker);
    const total = Object.values(resultTracker).reduce((a, b) => a + b, 0);
    console.log('Total spins:', total);
    if(total > 0){
      console.log('Distribution:');
      Object.entries(resultTracker).forEach(([choice, count]) => {
        const percentage = ((count / total) * 100).toFixed(1);
        console.log(`${choice}: ${count} (${percentage}%)`);
      });
    }
  };
  
  // Add functions to adjust suspense level
  window.setSuspenseLevel = (level) => {
    switch(level) {
      case 'low':
        minTurns = 3; maxTurns = 5;
        console.log('Suspense level set to LOW (3-5 turns)');
        break;
      case 'medium':
        minTurns = 6; maxTurns = 8;
        console.log('Suspense level set to MEDIUM (6-8 turns)');
        break;
      case 'high':
        minTurns = 8; maxTurns = 12;
        console.log('Suspense level set to HIGH (8-12 turns)');
        break;
      default:
        console.log('Invalid level. Use: setSuspenseLevel("low"), setSuspenseLevel("medium"), or setSuspenseLevel("high")');
    }
  };
  
  // Show current settings
  console.log('🎯 Roulette de Décision initialisée !');
  console.log('📊 Commandes disponibles:');
  console.log('  - showStats() : Afficher les statistiques');
  console.log('  - resetStats() : Réinitialiser les statistiques');
  console.log('  - setSuspenseLevel("low/medium/high") : Ajuster le suspense');
  console.log(`🎪 Tours actuels: ${minTurns}-${maxTurns}`);

  // Initialize app
  initMode();
  resizeCanvas();
  updateChoices();
  
  console.log('App initialized successfully!');
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
