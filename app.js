// Expand / Collapse helpers
const expandAll = document.getElementById('expandAll');
const collapseAll = document.getElementById('collapseAll');
function allDetails(){ return Array.from(document.querySelectorAll('details')); }
expandAll?.addEventListener('click', ()=> allDetails().forEach(d => d.open = true));
collapseAll?.addEventListener('click', ()=> allDetails().forEach(d => d.open = false));

// === GOATBoard Builder + Poll + JPEG Share ===
(function(){
  const defaultPool = [
    "Lionel Messi","Cristiano Ronaldo","Zinedine Zidane","Andrés Iniesta","Luka Modrić",
    "Ronaldinho","Xavi Hernández","Neymar Jr.","Robert Lewandowski","Thierry Henry"
  ];
  const LS_TOP5 = 'goat_top5_v1';
  const LS_POOL_CUSTOM = 'goat_pool_custom_v1';
  const LS_POLL_COUNTS = 'goat_poll_counts_v1';
  const LS_POLL_TOTAL = 'goat_poll_total_v1';
  const LS_POLL_LOCKED = 'goat_poll_locked_v1';

  const top5El = document.getElementById('top5List');

  const playerSelect = document.getElementById('playerSelect');
  const addFromSelectBtn = document.getElementById('addFromSelect');

  const customInput = document.getElementById('customPlayer');
  const addCustomBtn = document.getElementById('addCustom');

  const lockBtn = document.getElementById('lockIn');
  const clearBtn = document.getElementById('clearVote');
  const shareBtn = document.getElementById('shareImage');

  const pollRows = document.getElementById('pollRows');
  const pollTotal = document.getElementById('pollTotal');

  // Poster elements
  const shareCard = document.getElementById('shareCard');
  const shareList = document.getElementById('shareList');
  const shareDate = document.getElementById('shareDate');

  const storedTop = JSON.parse(localStorage.getItem(LS_TOP5) || '[]');
  const storedCustom = JSON.parse(localStorage.getItem(LS_POOL_CUSTOM) || '[]');

  let top5 = Array.isArray(storedTop) ? storedTop : [];

  // Ensure dropdown also has any previously saved custom players
  function addOptionIfMissing(name){
    if (!name) return;
    const exists = Array.from(playerSelect.options).some(o => o.value === name);
    if (!exists){
      const opt = document.createElement('option');
      opt.value = name; opt.textContent = name;
      playerSelect.appendChild(opt);
    }
  }
  storedCustom.forEach(addOptionIfMissing);

  function saveTop(){ localStorage.setItem(LS_TOP5, JSON.stringify(top5)); }
  function saveCustomPool(names){
    localStorage.setItem(LS_POOL_CUSTOM, JSON.stringify(names));
  }

  function renderTop5(){
    top5El.innerHTML = '';
    for(let i=0;i<5;i++){
      const li = document.createElement('li');
      const name = top5[i] || '';
      li.className = 'slot';
      li.innerHTML = `
        <span class="index">${i+1}</span>
        <span class="who">${name || '<span class="muted">Empty slot</span>'}</span>
        <span class="actions">
          <button class="pill-btn" data-act="up" data-idx="${i}" aria-label="Move up">▲</button>
          <button class="pill-btn" data-act="down" data-idx="${i}" aria-label="Move down">▼</button>
          <button class="pill-btn" data-act="remove" data-idx="${i}" aria-label="Remove">✕</button>
        </span>`;
      top5El.appendChild(li);
    }
  }

  function addToTop5(name){
    if(!name) return;
    if(top5.includes(name)) return;
    const emptyIdx = top5.findIndex(x=>!x);
    if(emptyIdx !== -1){ top5[emptyIdx] = name; }
    else if(top5.length < 5){ top5.push(name); }
    else { alert('Top 5 is full. Remove a slot or move items to add new ones.'); return; }
    saveTop(); renderTop5();
  }

  addFromSelectBtn.addEventListener('click', ()=>{
    const val = playerSelect.value;
    addToTop5(val);
  });

  addCustomBtn.addEventListener('click', ()=>{
    const val = (customInput.value || '').trim();
    if(!val) return;
    addOptionIfMissing(val);
    // persist custom list
    const customs = Array.from(playerSelect.options)
      .map(o=>o.value)
      .filter(n => !defaultPool.includes(n));
    saveCustomPool(customs);
    addToTop5(val);
    customInput.value='';
  });

  customInput.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ addCustomBtn.click(); }});

  top5El.addEventListener('click', (e)=>{
    const btn = e.target.closest('.pill-btn'); if(!btn) return;
    const idx = parseInt(btn.getAttribute('data-idx'),10);
    const act = btn.getAttribute('data-act');
    if(act==='remove'){ top5[idx] = ''; saveTop(); renderTop5(); return; }
    if(act==='up' && idx>0){ [top5[idx-1], top5[idx]] = [top5[idx], top5[idx-1]]; saveTop(); renderTop5(); return; }
    if(act==='down' && idx<4){ [top5[idx+1], top5[idx]] = [top5[idx], top5[idx+1]]; saveTop(); renderTop5(); return; }
  });

  // ---- Poll logic (device-only) ----
  function getCounts(){ return JSON.parse(localStorage.getItem(LS_POLL_COUNTS) || '{}'); }
  function setCounts(obj){ localStorage.setItem(LS_POLL_COUNTS, JSON.stringify(obj)); }
  function getTotal(){ return parseInt(localStorage.getItem(LS_POLL_TOTAL) || '0',10); }
  function setTotal(n){ localStorage.setItem(LS_POLL_TOTAL, String(n)); }

  function renderPoll(){
    const counts = getCounts();
    const total = getTotal();
    pollTotal.textContent = total;
    pollRows.innerHTML = '';

    const entries = Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,15);
    if(entries.length === 0){
      const hint = document.createElement('div');
      hint.className = 'meta';
      hint.textContent = 'No submissions yet. Build your Top 5 on the right and lock it in!';
      pollRows.appendChild(hint);
      return;
    }

    entries.forEach(([name, cnt])=>{
      const pct = total > 0 ? Math.round((cnt/total)*100) : 0;
      const row = document.createElement('div'); row.className = 'poll-row';
      const left = document.createElement('div');
      left.innerHTML = `<div class="poll-name">${name}</div><div class="poll-bar"><div style="width:${pct}%"></div></div>`;
      const right = document.createElement('div'); right.className = 'poll-pct'; right.textContent = pct + '%';
      row.appendChild(left); row.appendChild(right);
      pollRows.appendChild(row);
    });
  }

  function lockInVote(){
    const already = localStorage.getItem(LS_POLL_LOCKED) === '1';
    if(already){
      alert('You already locked in your Top 5 on this device.');
      return;
    }
    const picks = top5.filter(Boolean);
    if(picks.length < 5){
      if(!confirm('You have fewer than 5 players. Lock in anyway?')) return;
    }
    const counts = getCounts();
    picks.forEach(name => { counts[name] = (counts[name]||0) + 1; });
    setCounts(counts);
    setTotal(getTotal()+1);
    localStorage.setItem(LS_POLL_LOCKED,'1');
    renderPoll();
    alert('Locked! Your Top 5 was counted on this device.');
  }

  function clearVote(){
    if(confirm('Reset your local poll submission and counts on this device?')){
      localStorage.removeItem(LS_POLL_LOCKED);
      localStorage.removeItem(LS_POLL_COUNTS);
      localStorage.removeItem(LS_POLL_TOTAL);
      renderPoll();
      alert('Local poll data cleared.');
    }
  }
  lockBtn.addEventListener('click', lockInVote);
  clearBtn.addEventListener('click', clearVote);

  // ---- JPEG poster rendering & sharing ----
  function populateShareCard(){
    const d = new Date();
    shareDate.textContent = d.toLocaleDateString(undefined, {year:'numeric', month:'short', day:'numeric'});
    shareList.innerHTML = '';
    const picks = top5.filter(Boolean);
    for(let i = 0; i < 5; i++){
      const nm = picks[i] || '—';
      const row = document.createElement('div');
      row.className = 'row';
      row.innerHTML = `<div class="idx">${i+1}</div>
                       <div class="nm">${nm}</div>
                       <div class="tag">GOATBoard</div>`;
      shareList.appendChild(row);
    }
  }

  async function generateJPEGBlob(){
    populateShareCard();
    if (!window.html2canvas) {
      alert('Image renderer not found. Place html2canvas.min.js next to index.html.');
      return null;
    }
    const canvas = await html2canvas(shareCard, { backgroundColor: null, scale: 2, useCORS: true });
    return new Promise(resolve => canvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.92));
  }

  async function shareOrDownloadJPEG(){
    const blob = await generateJPEGBlob();
    if(!blob) return;
    const file = new File([blob], 'goatboard-top5.jpg', { type: 'image/jpeg' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: 'GOATBoard — My Top 5', text: 'My GOATBoard Top 5 (21st Century)' });
        return;
      } catch(e) { /* user cancelled */ }
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'goatboard-top5.jpg';
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  }
  shareBtn.addEventListener('click', shareOrDownloadJPEG);

  // Init
  renderTop5();
  renderPoll();
})();
