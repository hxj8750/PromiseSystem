// calendar.js
(() => {
  // --- DOM Elements ---
  const calendar = document.getElementById('calendar');
  const grid = document.getElementById('grid');
  const monthEl = document.getElementById('monthLabel');
  const yearEl  = document.getElementById('yearLabel');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const actionBtn = document.getElementById('actionBtn');
  
  // Modal & Form Elements
  const goalModal = document.getElementById('goalModal');
  const saveGoalBtn = document.getElementById('saveGoalBtn');
  const hourHand = document.getElementById('hourHand');
  const minuteHand = document.getElementById('minuteHand');
  const digitalTime = document.getElementById('digitalTime');
  const hourSlider = document.getElementById('hourSlider');
  const minuteSlider = document.getElementById('minuteSlider');

  // --- State ---
  const WEEK_START = 1; // 0=Sun, 1=Mon
  const today = new Date();
  today.setHours(0,0,0,0);
  let view = new Date(today.getFullYear(), today.getMonth(), 1);
  let isSelectionMode = false;
  let selectedDates = new Set();

  // --- Date Helpers ---
  const startOfMonth = d => new Date(d.getFullYear(), d.getMonth(), 1);
  const addMonths = (d,n) => new Date(d.getFullYear(), d.getMonth() + n, 1);
  const sameDay = (a,b) => a.getFullYear() === b.getFullYear()
                      && a.getMonth() === b.getMonth()
                      && a.getDate() === b.getDate();
  function gridStart(d) {
    const first = startOfMonth(d);
    const shift = (first.getDay() + 7 - WEEK_START) % 7;
    first.setDate(first.getDate() - shift);
    return first;
  }

  // --- Core Rendering Function ---
  function render() {
    monthEl.textContent = (view.getMonth() + 1) + '月';
    yearEl.textContent  = String(view.getFullYear());
    grid.innerHTML = '';
    const g0 = gridStart(view);
    for (let i = 0; i < 42; i++) {
      const d = new Date(g0);
      d.setDate(g0.getDate() + i);
      const cell = document.createElement('div');
      const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      cell.setAttribute('role','gridcell');
      cell.dataset.date = dateStr;
      if (d.getMonth() !== view.getMonth()) cell.dataset.out = '1';
      if (sameDay(d, today)) cell.dataset.today = '1';
      if (selectedDates.has(dateStr)) cell.dataset.selected = '1';
      const badge = document.createElement('span');
      badge.textContent = d.getDate();
      cell.appendChild(badge);
      grid.appendChild(cell);
    }
  }

  // --- State & Mode Management Functions ---
  function enterSelectionMode() {
    isSelectionMode = true;
    calendar.classList.add('selection-mode');
    actionBtn.textContent = '制定目标';
    actionBtn.disabled = true;
    prevBtn.disabled = true;
    nextBtn.disabled = true;
  }

  function exitSelectionMode() {
    isSelectionMode = false;
    selectedDates.clear();
    calendar.classList.remove('selection-mode');
    actionBtn.textContent = '选择日期';
    actionBtn.disabled = false;
    prevBtn.disabled = false;
    nextBtn.disabled = false;
    render();
  }

  function openGoalModal() {
    console.log('Opening modal for dates:', Array.from(selectedDates));
    updateClock(hourSlider.value, minuteSlider.value); // Set initial clock time
    goalModal.hidden = false;
  }

  function closeGoalModal() {
    goalModal.hidden = true;
  }
  
  // --- Event Handlers ---
  function handleActionBtnClick() {
    if (isSelectionMode) {
      openGoalModal();
    } else {
      enterSelectionMode();
    }
  }

  function handleGridClick(e) {
    if (!isSelectionMode) return;
    const cell = e.target.closest('[role="gridcell"]');
    if (!cell || cell.dataset.out === '1') return;
    const dateStr = cell.dataset.date;
    if (selectedDates.has(dateStr)) {
      selectedDates.delete(dateStr);
      delete cell.dataset.selected;
    } else {
      selectedDates.add(dateStr);
      cell.dataset.selected = '1';
    }
    actionBtn.disabled = selectedDates.size === 0;
  }

  // --- Event Listeners ---
  prevBtn.onclick = () => { view = addMonths(view, -1); render(); };
  nextBtn.onclick = () => { view = addMonths(view, 1); render(); };
  actionBtn.onclick = handleActionBtnClick;
  grid.onclick = handleGridClick;

  // --- MODAL, FORM & CLOCK LOGIC ---

  // Clock Update Function
  function updateClock(h, m) {
    const hours = parseInt(h, 10);
    const minutes = parseInt(m, 10);

    // Update digital display
    const hourStr = String(hours).padStart(2, '0');
    const minuteStr = String(minutes).padStart(2, '0');
    digitalTime.textContent = `${hourStr}:${minuteStr}`;

    // Update clock hands
    const minuteDeg = minutes * 6;
    const hourDeg = (hours % 12) * 30 + minutes * 0.5;
    minuteHand.style.transform = `rotate(${minuteDeg}deg)`;
    hourHand.style.transform = `rotate(${hourDeg}deg)`;
  }

  // Sliders Event Listener
  function handleSliderInput() {
    updateClock(hourSlider.value, minuteSlider.value);
  }
  hourSlider.addEventListener('input', handleSliderInput);
  minuteSlider.addEventListener('input', handleSliderInput);

  // Modal Buttons & Overlay Listeners
  saveGoalBtn.onclick = () => {
    // In a real app, you would collect and save form data here
    console.log('Goal saved for dates:', Array.from(selectedDates));
    console.log(`Deadline time: ${hourSlider.value}:${minuteSlider.value}`);
    closeGoalModal();
    exitSelectionMode();
  };

  goalModal.onclick = (e) => {
    if (e.target === goalModal) {
      closeGoalModal();
      exitSelectionMode();
    }
  };

  // --- Initial Render ---
  render();
})();