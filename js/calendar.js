// calendar.js
(() => {
  // DOM Elements
  const calendar = document.getElementById('calendar');
  const grid = document.getElementById('grid');
  const monthEl = document.getElementById('monthLabel');
  const yearEl  = document.getElementById('yearLabel');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const actionBtn = document.getElementById('actionBtn'); // Updated ID
  const goalModal = document.getElementById('goalModal');
  const saveGoalBtn = document.getElementById('saveGoalBtn');

  // State
  const WEEK_START = 1; // 0=Sun, 1=Mon
  const today = new Date();
  today.setHours(0,0,0,0);
  let view = new Date(today.getFullYear(), today.getMonth(), 1);
  let isSelectionMode = false;
  let selectedDates = new Set();

  // Date Helpers
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
    prevBtn.disabled = true; // Prevent confusion during selection
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
    render(); // Re-render to clear selection states
  }

  function openGoalModal() {
    // In a real app, you'd populate the modal with info about selectedDates
    console.log('Opening modal for dates:', Array.from(selectedDates));
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
    if (!cell || cell.dataset.out === '1') return; // Ignore clicks outside or on non-cells
    
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
  prevBtn.onclick = () => {
    view = addMonths(view, -1);
    render();
  };

  nextBtn.onclick = () => {
    view = addMonths(view, 1);
    render();
  };
  
  actionBtn.onclick = handleActionBtnClick;
  
  grid.onclick = handleGridClick;

  saveGoalBtn.onclick = () => {
    // Here you would save the goal data
    console.log('Goal saved for dates:', Array.from(selectedDates));
    closeGoalModal();
    exitSelectionMode();
  };

  // Close modal if backdrop is clicked
  goalModal.onclick = (e) => {
    if (e.target === goalModal) {
      closeGoalModal();
      exitSelectionMode();
    }
  }

  // --- Initial Render ---
  render();
})();