/* Simple beginner-friendly app logic extracted from the single-file demo.
   Save as app.js and keep it next to index.html + styles.css.
*/

const KEY = 'stockmaster_hack_beginner_v2';
function load(){try{const s = localStorage.getItem(KEY); return s ? JSON.parse(s) : {products:[],receipts:[],deliveries:[],ledger:[]};}catch(e){return {products:[],receipts:[],deliveries:[],ledger:[]}}}
function save(db){localStorage.setItem(KEY, JSON.stringify(db));}
let db = load();

function uid(pref='id'){return pref + Math.random().toString(36).slice(2,9)}
function findProd(id){return db.products.find(p=>p.id===id)}
function $(s){return document.querySelector(s)}
function $all(s){return document.querySelectorAll(s)}

// Add product
function addProduct(){
  const sku = $('#p_sku').value.trim();
  const name = $('#p_name').value.trim();
  const cat = $('#p_cat').value.trim();
  if(!sku||!name) return alert('Enter SKU and name');
  db.products.push({id:uid('p_'),sku,name,category:cat,stock:0});
  save(db); renderAll();
  $('#p_sku').value=''; $('#p_name').value=''; $('#p_cat').value='';
  markStep(1);
}

// Create receipt (incoming)
function createReceipt(){
  const pid = $('#r_prod').value; const qty = Number($('#r_qty').value||0); const sup = $('#r_supplier').value||'Unknown';
  if(!pid || qty<=0) return alert('Pick product and enter qty');
  const p=findProd(pid);
  p.stock += qty;
  const r = {id:uid('r_'),supplier:sup,items:[{sku:p.sku,name:p.name,qty}],time:new Date().toISOString()};
  db.receipts.push(r);
  db.ledger.unshift({time:r.time,type:'receipt',sku:p.sku,product:p.name,qty});
  save(db); renderAll(); $('#r_qty').value=''; markStep(2);
}

// Create delivery (outgoing)
function createDelivery(){
  const pid = $('#d_prod').value; const qty = Number($('#d_qty').value||0);
  if(!pid || qty<=0) return alert('Pick product and enter qty');
  const p=findProd(pid);
  if(p.stock < qty) return alert('Not enough stock');
  p.stock -= qty;
  const d = {id:uid('d_'),items:[{sku:p.sku,name:p.name,qty}],time:new Date().toISOString()};
  db.deliveries.push(d);
  db.ledger.unshift({time:d.time,type:'delivery',sku:p.sku,product:p.name,qty:-qty});
  save(db); renderAll(); $('#d_qty').value=''; markStep(3);
}

// Render everything
function renderAll(){
  $('#k_total_products').innerText = db.products.length;
  $('#k_total_stock').innerText = db.products.reduce((s,p)=>s + (p.stock||0),0);
  $('#k_low_stock').innerText = db.products.filter(p=>p.stock < 5).length;
  $('#k_actions').innerText = db.ledger.length;

  // Product cards
  const cards = $('#productCards'); cards.innerHTML='';
  db.products.slice(0,9).forEach(p=>{
    const tot = p.stock||0;
    const card = document.createElement('div'); card.className='product-card';
    card.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center">
      <div><div style="font-weight:700">${p.name}</div><div class="sku">${p.sku} • ${p.category||'-'}</div></div>
      <div style="text-align:right"><div style="font-weight:700">${tot}</div><div class="small">${p.stock<5?'<span style="color:#ffb4a2">Low</span>':'OK'}</div></div>
    </div><div class="progress"><i style="width:${Math.min(100,tot)}%"></i></div>`;
    cards.appendChild(card);
  });

  // Tables
  const pbody = $('#productsTable tbody'); pbody.innerHTML = '';
  db.products.forEach(p=>{const tr = document.createElement('tr'); tr.innerHTML = `<td>${p.sku}</td><td>${p.name}</td><td>${p.category||'-'}</td><td>${p.stock}</td>`; pbody.appendChild(tr)});

  const rbody = $('#receiptsTable tbody'); rbody.innerHTML='';
  db.receipts.forEach(r=>{const tr=document.createElement('tr'); tr.innerHTML = `<td>${r.id}</td><td>${r.supplier}</td><td>${r.items.length}</td>`; rbody.appendChild(tr)});

  const dbody = $('#deliveriesTable tbody'); dbody.innerHTML='';
  db.deliveries.forEach(d=>{const tr=document.createElement('tr'); tr.innerHTML = `<td>${d.id}</td><td>${d.items.length}</td>`; dbody.appendChild(tr)});

  const lbody = $('#ledgerTable tbody'); lbody.innerHTML='';
  db.ledger.slice(0,50).forEach(l=>{const tr=document.createElement('tr'); tr.innerHTML = `<td>${new Date(l.time).toLocaleString()}</td><td>${l.type}</td><td>${l.sku}</td><td>${l.product}</td><td>${l.qty}</td>`; lbody.appendChild(tr)});

  const recent = $('#recentLedger tbody'); recent.innerHTML='';
  db.ledger.slice(0,6).forEach(l=>{const tr=document.createElement('tr'); tr.innerHTML = `<td>${new Date(l.time).toLocaleTimeString()}</td><td>${l.type}</td><td>${l.product}</td><td>${l.qty}</td>`; recent.appendChild(tr)});

  // selects
  const rsel = $('#r_prod'); const dsel = $('#d_prod'); rsel.innerHTML=''; dsel.innerHTML='';
  db.products.forEach(p=>{rsel.insertAdjacentHTML('beforeend',`<option value='${p.id}'>${p.sku} — ${p.name}</option>`); dsel.insertAdjacentHTML('beforeend',`<option value='${p.id}'>${p.sku} — ${p.name}</option>`)});

  refreshSteps();
}

// Navigation
function openPanel(id){['dashboard','products','receipts','deliveries','ledger','help'].forEach(k=>{const el = document.getElementById(k); if(el) el.style.display = (k===id || (id==='dashboard'&&k==='dashboard')) ? 'block' : 'none';}); document.querySelectorAll('.menu button').forEach(b=>b.classList.toggle('active', b.getAttribute('data-view')===id));}
document.querySelectorAll('.menu button').forEach(b=>b.addEventListener('click', ()=>openPanel(b.getAttribute('data-view'))));

// Seed demo & download
function seedDemo(){localStorage.removeItem(KEY); db = {products:[{id:'p_demo1',sku:'STL-001',name:'Steel Rod',category:'Raw',stock:100},{id:'p_demo2',sku:'CH-001',name:'Chair',category:'Furniture',stock:20},{id:'p_demo3',sku:'FRM-001',name:'Frame',category:'Components',stock:40}], receipts:[],deliveries:[],ledger:[]}; save(db); renderAll(); alert('Demo seeded — try Receive then Deliver!');}
$('#seedBtn').addEventListener('click', seedDemo);

// download the HTML (current page)
function downloadHTML(){const html = '<!doctype html>\\n' + document.documentElement.outerHTML; const blob = new Blob([html], {type:'text/html'}); const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='stockmaster_beginner.html'; a.click();}

// Steps helpers
function markStep(n){if(n===1) document.getElementById('s1').classList.add('complete'); if(n===2) document.getElementById('s2').classList.add('complete'); if(n===3) document.getElementById('s3').classList.add('complete');}
function refreshSteps(){ if(db.products.length>0) markStep(1); if(db.ledger.some(x=>x.type==='receipt')) markStep(2); if(db.ledger.some(x=>x.type==='delivery')) markStep(3); }

// guide button
$('#guideBtn').addEventListener('click', ()=>{alert('Presentation guide:\\n1) Problem (30s) 2) Live demo (60-90s) 3) Tech + next steps (30s). Keep it short and show the working receive→deliver flow.');});

// init
renderAll(); openPanel('dashboard');

// expose for tinkering
window._db = db; window.seedDemo = seedDemo; window.downloadHTML = downloadHTML; window.addProduct = addProduct; window.createReceipt = createReceipt; window.createDelivery = createDelivery; window.openPanel = openPanel;
async function sendToBackend(data) {
    try {
        const response = await fetch("http://127.0.0.1:5000/api", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        console.log("Backend response:", result);
        alert("Backend says: " + result.message);

    } catch (error) {
        console.error("Error:", error);
    }
}

