// calendar.js —— 生成 6×7 日期网格（周一为第一列），支持上/下月/回今天
(() => {
    const grid = document.getElementById('grid');
    const monthEl = document.getElementById('monthLabel');
    const yearEl  = document.getElementById('yearLabel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const todayBtn= document.getElementById('todayBtn');
  
    const WEEK_START = 1; // 0=周日, 1=周一
    const today = new Date(); today.setHours(0,0,0,0);
    let view = new Date(today.getFullYear(), today.getMonth(), 1);
  
    const startOfMonth = d => new Date(d.getFullYear(), d.getMonth(), 1);
    const addMonths    = (d,n) => new Date(d.getFullYear(), d.getMonth()+n, 1);
    const sameDay = (a,b) => a.getFullYear()===b.getFullYear()
                          && a.getMonth()===b.getMonth()
                          && a.getDate()===b.getDate();
    function gridStart(d){
      const first = startOfMonth(d);
      const shift = (first.getDay()+7 - WEEK_START) % 7; // 使周一起始
      first.setDate(first.getDate() - shift);
      return first;
    }
  
    function render(){
      monthEl.textContent = (view.getMonth()+1) + '月';
      yearEl.textContent  = String(view.getFullYear());
  
      grid.innerHTML = '';
      const g0 = gridStart(view);
      for(let i=0;i<42;i++){
        const d = new Date(g0); d.setDate(g0.getDate()+i);
  
        const cell = document.createElement('div');
        cell.setAttribute('role','gridcell');
        cell.dataset.date = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
        // 用 data- 属性做语义标记，样式以后再用 CSS 按需选中
        if(d.getMonth()!==view.getMonth()) cell.dataset.out = '1';
        if(sameDay(d, today))              cell.dataset.today = '1';
  
        const badge = document.createElement('span');
        badge.textContent = d.getDate();
        cell.appendChild(badge);
  
        grid.appendChild(cell);
      }
    }
  
    prevBtn.onclick = () => { view = addMonths(view,-1); render(); };
    nextBtn.onclick = () => { view = addMonths(view, 1); render(); };
    todayBtn.onclick= () => { view = new Date(today.getFullYear(), today.getMonth(), 1); render(); };
  
    render();
  })();
  