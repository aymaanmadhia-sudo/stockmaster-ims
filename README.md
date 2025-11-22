<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>StockMaster — Inventory MVP</title>
  <style>
    :root{--bg:#0f1724;--card:#0b1220;--muted:#98a2b3;--accent:#06b6d4;--accent-2:#7c3aed;--glass:rgba(255,255,255,0.04)}
    *{box-sizing:border-box;font-family:Inter,ui-sans-serif,system-ui,Segoe UI,Roboto,"Helvetica Neue",Arial}
    html,body{height:100%;margin:0;background:linear-gradient(180deg,#071028 0%,#071b2a 60%);color:#e6eef6}
    .app{display:grid;grid-template-columns:260px 1fr;min-height:100vh}
    .sidebar{padding:22px;background:linear-gradient(180deg,rgba(255,255,255,0.02),transparent);border-right:1px solid rgba(255,255,255,0.03)}
    .logo{display:flex;gap:10px;align-items:center;margin-bottom:18px}
    .logo .mark{width:44px;height:44px;background:linear-gradient(135deg,var(--accent),var(--accent-2));border-radius:10px;display:flex;align-items:center;justify-content:center;font-weight:700}
    .logo h1{font-size:16px;margin:0}
    nav{margin-top:14px}
    .nav-item{display:flex;align-items:center;gap:12px;padding:10px;border-radius:8px;margin-bottom:6px;color:var(--muted);cursor:pointer}
    .nav-item:hover{background:var(--glass);color:#fff}
    .nav-item.active{background:linear-gradient(90deg,var(--accent),var(--accent-2));color:#021124}

    .main{padding:28px}
    .topbar{display:flex;justify-content:space-between;align-items:center;margin-bottom:22px}
    .search{display:flex;gap:8px;align-items:center}
    .search input{background:transparent;border:1px solid rgba(255,255,255,0.04);padding:10px 12px;border-radius:8px;color:var(--muted);min-width:260px}
    .kpis{display:flex;gap:14px;margin-bottom:18px}
    .kpi{background:linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01));padding:16px;border-radius:12px;min-width:180px;border:1px solid rgba(255,255,255,0.03)}
    .kpi h3{margin:0;font-size:14px;color:var(--muted)}
    .kpi p{margin:8px 0 0;font-size:22px;font-weight:700}

    .panel{background:linear-gradient(180deg,#071830 0%,#041a2a 100%);padding:18px;border-radius:12px;border:1px solid rgba(255,255,255,0.03)}
    .grid-2{display:grid;grid-template-columns:2fr 1fr;gap:14px}
    table{width:100%;border-collapse:collapse}
    th,td{padding:10px;text-align:left;border-bottom:1px dashed rgba(255,255,255,0.03);font-size:14px}
    th{color:var(--muted);font-weight:600}
    .btn{background:linear-gradient(90deg,var(--accent),var(--accent-2));padding:8px 12px;border-radius:8px;border:none;color:#021124;cursor:pointer}
    .btn.ghost{background:transparent;color:var(--accent);border:1px solid rgba(255,255,255,0.03)}
    .form-row{display:flex;gap:8px;margin-bottom:8px}
    .input{background:transparent;border:1px solid rgba(255,255,255,0.04);padding:10px;border-radius:8px;color:var(--muted);flex:1}
    .small{font-size:13px;color:var(--muted)}
    .tag{display:inline-block;padding:6px 8px;border-radius:999px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.03);font-size:12px}

    .cards{display:flex;flex-wrap:wrap;gap:10px}
    .product-card{background:linear-gradient(180deg,rgba(255,255,255,0.02),transparent);padding:12px;border-radius:10px;min-width:200px}

    .footer{margin-top:18px;color:var(--muted);font-size:13px}

    /* responsive */
    @media (max-width:900px){.app{grid-template-columns:1fr}.sidebar{display:none}.topbar{flex-direction:column;align-items:flex-start}.grid-2{grid-template-columns:1fr}.kpis{flex-direction:column}}
  </style>
</head>
<body>
  <div class="app">
    <aside class="sidebar">
      <div class="logo">
        <div class="mark">SM</div>
        <div>
          <h1>StockMaster</h1>
          <div class="small">Inventory MVP</div>
        </div>
      </div>
      <nav>
        <div class="nav-item active" data-view="dashboard">📊 Dashboard</div>
        <div class="nav-item" data-view="products">📦 Products</div>
        <div class="nav-item" data-view="receipts">📥 Receipts</div>
        <div class="nav-item" data-view="deliveries">📤 Deliveries</div>
        <div class="nav-item" data-view="transfers">🔁 Transfers</div>
        <div class="nav-item" data-view="adjustments">⚠️ Adjustments</div>
        <div class="nav-item" data-view="ledger">🧾 Ledger</div>
        <div class="nav-item" data-view="settings">⚙️ Settings</div>
      </nav>

      <div style="margin-top:18px">
        <div class="small">Quick Links</div>
        <a class="tag" href="/mnt/data/StockMaster.pdf" target="_blank" style="display:inline-block;margin-top:8px;text-decoration:none;color:inherit">📎 View Spec (PDF)</a>
      </div>

      <div class="footer">Built for hackathons • Demo-ready • Local storage data</div>
    </aside>

    <main class="main">
      <div class="topbar">
        <div>
          <div style="font-size:20px;font-weight:700">Inventory Dashboard</div>
          <div class="small" id="subTitle">A simple, clear inventory MVP — live demo data</div>
        </div>
        <div class="search">
          <input id="globalSearch" placeholder="Search SKU, name, category..." />
          <button class="btn" id="openSeed">Seed Demo</button>
        </div>
      </div>

      <section id="viewArea">
        <!-- Dashboard -->
        <div class="view" id="dashboard">
          <div class="kpis">
            <div class="kpi"><h3>Total Products</h3><p id="k_total_products">0</p></div>
            <div class="kpi"><h3>Total Stock (units)</h3><p id="k_total_stock">0</p></div>
            <div class="kpi"><h3>Low / Out of stock</h3><p id="k_low_stock">0</p></div>
            <div class="kpi"><h3>Pending Receipts</h3><p id="k_pending_receipts">0</p></div>
          </div>

          <div class="grid-2">
            <div>
              <div class="panel">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
                  <div style="font-weight:700">Stock Overview</div>
                  <div class="small">Filter by warehouse / category</div>
                </div>
                <div id="productCards" class="cards"></div>
              </div>

              <div style="margin-top:12px" class="panel">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
                  <div style="font-weight:700">Recent Ledger</div>
                  <div class="small">Latest operations</div>
                </div>
                <table id="recentLedger">
                  <thead><tr><th>Time</th><th>Type</th><th>Product</th><th>Qty</th></tr></thead>
                  <tbody></tbody>
                </table>
              </div>

            </div>

            <div>
              <div class="panel">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
                  <div style="font-weight:700">Quick Actions</div>
                  <div class="small">Fast create & operate</div>
                </div>
                <div style="display:flex;flex-direction:column;gap:8px">
                  <button class="btn" onclick="ui.openForm('product')">+ Add Product</button>
                  <button class="btn ghost" onclick="showView('receipts')">Create Receipt</button>
                  <button class="btn ghost" onclick="showView('deliveries')">Create Delivery</button>
                </div>
              </div>

              <div style="margin-top:12px" class="panel">
                <div style="font-weight:700;margin-bottom:8px">Insights</div>
                <div class="small">Auto suggestions</div>
                <ul id="insights" style="margin-top:8px"></ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Products -->
        <div class="view" id="products" style="display:none">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
            <div style="font-weight:700">Products</div>
            <div>
              <button class="btn" onclick="ui.openForm('product')">+ New Product</button>
            </div>
          </div>

          <div class="panel">
            <table id="productsTable">
              <thead><tr><th>SKU</th><th>Name</th><th>Category</th><th>Stock</th><th>Actions</th></tr></thead>
              <tbody></tbody>
            </table>
          </div>
        </div>

        <!-- Receipts -->
        <div class="view" id="receipts" style="display:none">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
            <div style="font-weight:700">Receipts (Incoming)</div>
            <div>
              <button class="btn" onclick="ui.openForm('receipt')">+ New Receipt</button>
            </div>
          </div>

          <div class="panel">
            <table id="receiptsTable"><thead><tr><th>ID</th><th>Supplier</th><th>Items</th><th>Status</th><th>Actions</th></tr></thead><tbody></tbody></table>
          </div>
        </div>

        <!-- Deliveries -->
        <div class="view" id="deliveries" style="display:none">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
            <div style="font-weight:700">Deliveries (Outgoing)</div>
            <div>
              <button class="btn" onclick="ui.openForm('delivery')">+ New Delivery</button>
            </div>
          </div>

          <div class="panel">
            <table id="deliveriesTable"><thead><tr><th>ID</th><th>Customer</th><th>Items</th><th>Status</th><th>Actions</th></tr></thead><tbody></tbody></table>
          </div>
        </div>

        <!-- Transfers -->
        <div class="view" id="transfers" style="display:none">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
            <div style="font-weight:700">Internal Transfers</div>
            <div>
              <button class="btn" onclick="ui.openForm('transfer')">+ Transfer</button>
            </div>
          </div>
          <div class="panel"><table id="transfersTable"><thead><tr><th>ID</th><th>From</th><th>To</th><th>Items</th><th>Actions</th></tr></thead><tbody></tbody></table></div>
        </div>

        <!-- Adjustments -->
        <div class="view" id="adjustments" style="display:none">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
            <div style="font-weight:700">Stock Adjustments</div>
            <div>
              <button class="btn" onclick="ui.openForm('adjustment')">+ Adjust</button>
            </div>
          </div>
          <div class="panel"><table id="adjustmentsTable"><thead><tr><th>ID</th><th>Product</th><th>Location</th><th>Counted</th><th>Actions</th></tr></thead><tbody></tbody></table></div>
        </div>

        <!-- Ledger -->
        <div class="view" id="ledger" style="display:none">
          <div style="font-weight:700;margin-bottom:12px">Move History / Ledger</div>
          <div class="panel"><table id="ledgerTable"><thead><tr><th>Time</th><th>Type</th><th>SKU</th><th>Product</th><th>Qty</th><th>Ref</th></tr></thead><tbody></tbody></table></div>
        </div>

        <!-- Settings -->
        <div class="view" id="settings" style="display:none">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
            <div style="font-weight:700">Settings</div>
            <div class="small">Manage warehouses & categories</div>
          </div>
          <div class="panel">
            <div style="display:flex;gap:12px">
              <div style="flex:1">
                <div class="small" style="margin-bottom:6px">Warehouses</div>
                <div id="warehousesList"></div>
                <div style="margin-top:8px;display:flex;gap:8px"><input id="newWarehouse" class="input" placeholder="New warehouse name" /><button class="btn" onclick="actions.addWarehouse()">Add</button></div>
              </div>
              <div style="flex:1">
                <div class="small" style="margin-bottom:6px">Product categories</div>
                <div id="categoriesList"></div>
                <div style="margin-top:8px;display:flex;gap:8px"><input id="newCategory" class="input" placeholder="New category" /><button class="btn" onclick="actions.addCategory()">Add</button></div>
              </div>
            </div>
          </div>
        </div>


      </section>

      <!-- modal area for forms -->
      <div id="modal" style="position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:rgba(2,6,23,0.6);padding:20px">
        <div style="width:880px;max-width:98%;background:#031026;padding:16px;border-radius:10px;border:1px solid rgba(255,255,255,0.03)">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
            <div id="modalTitle" style="font-weight:700"></div>
            <div><button class="btn ghost" onclick="ui.closeModal()">Close</button></div>
          </div>
          <div id="modalBody"></div>
        </div>
      </div>

    </main>
  </div>

  <script>
    /***** Simple client-only Inventory app (no backend) *****/
    const STORAGE_KEY = 'stockmaster_demo_v1';

    function uuid(prefix=''){
      return prefix + Math.random().toString(36).slice(2,9);
    }

    // default data seed
    const seed = ()=>({
      products:[
        {id:'p1',sku:'STL-001',name:'Steel Rod',category:'Raw Material',unit:'kg',stock:{main:100,production:0}},
        {id:'p2',sku:'CH-001',name:'Chair',category:'Furniture',unit:'pcs',stock:{main:25}},
        {id:'p3',sku:'FRM-001',name:'Frame',category:'Components',unit:'pcs',stock:{main:40}}
      ],
      warehouses:[{id:'main',name:'Main Warehouse'},{id:'production',name:'Production Floor'}],
      receipts:[],deliveries:[],transfers:[],adjustments:[],ledger:[]
    });

    function saveState(state){localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}
    function loadState(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY))||seed()}catch(e){return seed()}}
    let state = loadState();

    // ensure structures
    state.products = state.products||[];
    state.warehouses = state.warehouses||[];
    state.receipts = state.receipts||[];
    state.deliveries = state.deliveries||[];
    state.transfers = state.transfers||[];
    state.adjustments = state.adjustments||[];
    state.ledger = state.ledger||[];

    // actions to mutate state
    const actions = {
      addWarehouse(){const name=document.getElementById('newWarehouse').value.trim(); if(!name) return alert('Enter name'); const id=uuid('w_'); state.warehouses.push({id,name}); saveState(state); render.settings(); document.getElementById('newWarehouse').value='';},
      addCategory(){const name=document.getElementById('newCategory').value.trim(); if(!name) return alert('Enter category'); if(!state.categories) state.categories=[]; state.categories.push(name); saveState(state); render.settings(); document.getElementById('newCategory').value='';},
      createProduct(data){data.id = uuid('p_'); data.stock = data.stock || {}; // initial stock per warehouse
        if(data.initQty && data.initWarehouse){data.stock[data.initWarehouse]=parseFloat(data.initQty)}
        state.products.push(data); log('create','product',data.id,data.sku,data.name,0); saveState(state); refreshAll();},
      updateProduct(id,changes){const p = state.products.find(x=>x.id===id); Object.assign(p,changes); saveState(state); refreshAll();},
      createReceipt(payload){payload.id = uuid('r_'); payload.status='validated'; payload.createdAt=new Date().toISOString(); state.receipts.push(payload);
        // apply changes
        payload.items.forEach(it=>{const prod = state.products.find(p=>p.id===it.product); if(!prod.stock[it.warehouse]) prod.stock[it.warehouse]=0; prod.stock[it.warehouse]+=parseFloat(it.qty); log('receipt',payload.id,it.product,prod.sku,prod.name,it.qty);});
        saveState(state); refreshAll();},
      createDelivery(payload){payload.id = uuid('d_'); payload.status='validated'; payload.createdAt=new Date().toISOString(); // check stock
        for(const it of payload.items){const prod = state.products.find(p=>p.id===it.product); const have=(prod.stock[it.warehouse]||0); if(have < it.qty){return alert('Insufficient stock for '+prod.name+' at '+it.warehouse)} }
        state.deliveries.push(payload);
        payload.items.forEach(it=>{const prod = state.products.find(p=>p.id===it.product); prod.stock[it.warehouse]-=parseFloat(it.qty); log('delivery',payload.id,it.product,prod.sku,prod.name,-it.qty);});
        saveState(state); refreshAll();},
      createTransfer(payload){payload.id=uuid('t_'); payload.createdAt=new Date().toISOString(); state.transfers.push(payload);
        payload.items.forEach(it=>{const prod = state.products.find(p=>p.id===it.product); prod.stock[it.from] = (prod.stock[it.from]||0) - it.qty; prod.stock[it.to] = (prod.stock[it.to]||0) + it.qty; log('transfer',payload.id,it.product,prod.sku,prod.name,0);}); saveState(state); refreshAll();},
      createAdjustment(payload){payload.id=uuid('a_'); payload.createdAt=new Date().toISOString(); state.adjustments.push(payload);
        const prod = state.products.find(p=>p.id===payload.product); const old = prod.stock[payload.location] || 0; prod.stock[payload.location] = Number(payload.counted);
        log('adjustment',payload.id,payload.product,prod.sku,prod.name,(payload.counted - old)); saveState(state); refreshAll();}
    };

    function log(type,ref,productId,sku,name,qty){state.ledger.unshift({time:new Date().toISOString(),type,ref,productId,sku,name,qty}); if(state.ledger.length>200) state.ledger.pop();}

    /******** UI / Rendering ********/
    const ui = {
      openForm(kind,edit){document.getElementById('modalTitle').innerText = ({product:'New Product',receipt:'New Receipt',delivery:'New Delivery',transfer:'New Transfer',adjustment:'Stock Adjustment'})[kind] || 'Form'; document.getElementById('modal').style.display='flex'; const body = document.getElementById('modalBody'); body.innerHTML=''; if(kind==='product') render.productForm(body,edit); if(kind==='receipt') render.receiptForm(body); if(kind==='delivery') render.deliveryForm(body); if(kind==='transfer') render.transferForm(body); if(kind==='adjustment') render.adjustmentForm(body); },
      closeModal(){document.getElementById('modal').style.display='none';}
    };

    const render = {
      nav(){document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active')); document.querySelector('.nav-item[data-view="'+currentView+'"]').classList.add('active');},
      dashboard(){document.getElementById('productCards').innerHTML=''; state.products.forEach(p=>{const total = Object.values(p.stock||{}).reduce((a,b)=>a+Number(b||0),0); const el = document.createElement('div'); el.className='product-card'; el.innerHTML = `<div style="display:flex;justify-content:space-between"><div style="font-weight:700">${p.name}</div><div class="tag">${p.sku}</div></div><div class="small">${p.category} • ${p.unit}</div><div style="margin-top:10px;font-weight:700">${total} <span class="small">units</span></div>`; document.getElementById('productCards').appendChild(el); });
        // KPIs
        document.getElementById('k_total_products').innerText = state.products.length;
        const totStock = state.products.reduce((acc,p)=>acc + Object.values(p.stock||{}).reduce((a,b)=>a+Number(b||0),0),0);
        document.getElementById('k_total_stock').innerText = totStock;
        const low = state.products.filter(p=>Object.values(p.stock||{}).reduce((a,b)=>a+Number(b||0),0) < (p.reorder_level||5)).length;
        document.getElementById('k_low_stock').innerText = low;
        document.getElementById('k_pending_receipts').innerText = state.receipts.filter(r=>r.status!=='validated').length;

        // recent ledger
        const tb = document.querySelector('#recentLedger tbody'); tb.innerHTML=''; state.ledger.slice(0,7).forEach(l=>{const tr=document.createElement('tr'); tr.innerHTML=`<td>${new Date(l.time).toLocaleString()}</td><td>${l.type}</td><td>${l.name}</td><td>${l.qty}</td>`; tb.appendChild(tr)});

        // insights
        const ins = document.getElementById('insights'); ins.innerHTML=''; if(low>0) ins.innerHTML += `<li class="small">${low} product(s) below reorder level — consider purchase</li>`; if(state.products.length===0) ins.innerHTML += `<li class="small">No products found — add one</li>`;
      },
      products(){const tb=document.querySelector('#productsTable tbody'); tb.innerHTML=''; state.products.forEach(p=>{const qty = Object.values(p.stock||{}).reduce((a,b)=>a+Number(b||0),0); const tr=document.createElement('tr'); tr.innerHTML=`<td>${p.sku}</td><td>${p.name}</td><td>${p.category||'-'}</td><td>${qty}</td><td><button class="btn ghost" onclick='ui.openForm("product","${p.id}")'>Edit</button></td>`; tb.appendChild(tr)});
      },
      receipts(){const tb=document.querySelector('#receiptsTable tbody'); tb.innerHTML=''; state.receipts.forEach(r=>{const tr=document.createElement('tr'); tr.innerHTML=`<td>${r.id}</td><td>${r.supplier}</td><td>${r.items.length}</td><td>${r.status}</td><td><button class="btn ghost" onclick="">View</button></td>`; tb.appendChild(tr)});},
      deliveries(){const tb=document.querySelector('#deliveriesTable tbody'); tb.innerHTML=''; state.deliveries.forEach(d=>{const tr=document.createElement('tr'); tr.innerHTML=`<td>${d.id}</td><td>${d.customer}</td><td>${d.items.length}</td><td>${d.status}</td><td><button class="btn ghost">View</button></td>`; tb.appendChild(tr)});},
      transfers(){const tb=document.querySelector('#transfersTable tbody'); tb.innerHTML=''; state.transfers.forEach(t=>{const tr=document.createElement('tr'); tr.innerHTML=`<td>${t.id}</td><td>${t.from}</td><td>${t.to}</td><td>${t.items.length}</td><td><button class="btn ghost">View</button></td>`; tb.appendChild(tr)});},
      adjustments(){const tb=document.querySelector('#adjustmentsTable tbody'); tb.innerHTML=''; state.adjustments.forEach(a=>{const p = state.products.find(x=>x.id===a.product)||{}; const tr=document.createElement('tr'); tr.innerHTML=`<td>${a.id}</td><td>${p.name||'-'}</td><td>${a.location}</td><td>${a.counted}</td><td><button class="btn ghost">View</button></td>`; tb.appendChild(tr)});},
      ledger(){const tb=document.querySelector('#ledgerTable tbody'); tb.innerHTML=''; state.ledger.forEach(l=>{const tr=document.createElement('tr'); tr.innerHTML=`<td>${new Date(l.time).toLocaleString()}</td><td>${l.type}</td><td>${l.sku}</td><td>${l.name}</td><td>${l.qty}</td><td>${l.ref}</td>`; tb.appendChild(tr)});},
      settings(){document.getElementById('warehousesList').innerHTML = state.warehouses.map(w=>`<div class="tag">${w.name}</div>`).join(' ');
        document.getElementById('categoriesList').innerHTML = (state.categories||[]).map(c=>`<div class="tag">${c}</div>`).join(' ');
      },

      // forms
      productForm(body,editId){const editing = state.products.find(p=>p.id===editId) || {sku:'',name:'',category:'',unit:'',initQty:'',initWarehouse:state.warehouses[0]?.id||''};
        body.innerHTML = `
          <div style="display:flex;gap:12px"><div style="flex:1"><label class="small">Name</label><input id="p_name" class="input" value="${editing.name||''}" /></div>
          <div style="flex:1"><label class="small">SKU</label><input id="p_sku" class="input" value="${editing.sku||''}" /></div></div>
          <div style="display:flex;gap:12px;margin-top:8px"><div style="flex:1"><label class="small">Category</label><input id="p_cat" class="input" value="${editing.category||''}" /></div>
          <div style="flex:1"><label class="small">Unit</label><input id="p_unit" class="input" value="${editing.unit||''}" /></div></div>
          <div style="display:flex;gap:12px;margin-top:8px"><div style="flex:1"><label class="small">Initial quantity (optional)</label><input id="p_initQty" class="input" value="${editing.initQty||''}" /></div>
          <div style="flex:1"><label class="small">Initial warehouse</label><select id="p_initWarehouse" class="input">${state.warehouses.map(w=>`<option value="${w.id}">${w.name}</option>`).join('')}</select></div></div>
          <div style="margin-top:12px;display:flex;gap:8px;justify-content:flex-end"><button class="btn" id="saveProduct">Save</button><button class="btn ghost" onclick="ui.closeModal()">Cancel</button></div>
        `;
        document.getElementById('saveProduct').onclick = ()=>{
          const data={sku:document.getElementById('p_sku').value,name:document.getElementById('p_name').value,category:document.getElementById('p_cat').value,unit:document.getElementById('p_unit').value,initQty:document.getElementById('p_initQty').value,initWarehouse:document.getElementById('p_initWarehouse').value};
          if(editId){actions.updateProduct(editId,data);} else {actions.createProduct(data);} ui.closeModal();}
      },
      receiptForm(body){body.innerHTML = `<div><label class="small">Supplier</label><input id="r_supplier" class="input" placeholder="Supplier name" /></div><div id="r_items_wrap" style="margin-top:8px"></div><div style="margin-top:8px;display:flex;justify-content:space-between;align-items:center"><div class="small">Add items — choose product, warehouse, qty</div><div><button class="btn" id="r_add_item">Add item</button></div></div><div style="margin-top:12px;display:flex;gap:8px;justify-content:flex-end"><button class="btn" id="r_save">Validate Receipt</button><button class="btn ghost" onclick="ui.closeModal()">Cancel</button></div>`; const wrap=document.getElementById('r_items_wrap'); function addRow(){const idx=wrap.children.length; const row=document.createElement('div'); row.style.display='flex'; row.style.gap='8px'; row.style.marginTop='8px'; row.innerHTML = `<select class="input r_pid">${state.products.map(p=>`<option value='${p.id}'>${p.sku} — ${p.name}</option>`).join('')}</select><select class="input r_wh">${state.warehouses.map(w=>`<option value='${w.id}'>${w.name}</option>`).join('')}</select><input class="input r_qty" placeholder="qty" /><button class="btn ghost r_rm">Remove</button>`; wrap.appendChild(row); row.querySelector('.r_rm').onclick=()=>row.remove(); }
        document.getElementById('r_add_item').onclick=addRow; addRow(); document.getElementById('r_save').onclick=()=>{const supplier=document.getElementById('r_supplier').value||'Unknown'; const items = Array.from(wrap.querySelectorAll('div')).map(div=>{return{product:div.querySelector('.r_pid').value,warehouse:div.querySelector('.r_wh').value,qty:parseFloat(div.querySelector('.r_qty').value||0)}}).filter(i=>i.qty>0); if(items.length===0) return alert('Add atleast 1 item'); actions.createReceipt({supplier,items}); ui.closeModal();}},
      deliveryForm(body){body.innerHTML = `<div><label class="small">Customer</label><input id="d_customer" class="input" placeholder="Customer name" /></div><div id="d_items_wrap" style="margin-top:8px"></div><div style="margin-top:8px;display:flex;justify-content:space-between;align-items:center"><div class="small">Pick items — choose product, warehouse, qty</div><div><button class="btn" id="d_add_item">Add item</button></div></div><div style="margin-top:12px;display:flex;gap:8px;justify-content:flex-end"><button class="btn" id="d_save">Validate Delivery</button><button class="btn ghost" onclick="ui.closeModal()">Cancel</button></div>`; const wrap=document.getElementById('d_items_wrap'); function addRow(){const idx=wrap.children.length; const row=document.createElement('div'); row.style.display='flex'; row.style.gap='8px'; row.style.marginTop='8px'; row.innerHTML = `<select class="input d_pid">${state.products.map(p=>`<option value='${p.id}'>${p.sku} — ${p.name}</option>`).join('')}</select><select class="input d_wh">${state.warehouses.map(w=>`<option value='${w.id}'>${w.name}</option>`).join('')}</select><input class="input d_qty" placeholder="qty" /><button class="btn ghost d_rm">Remove</button>`; wrap.appendChild(row); row.querySelector('.d_rm').onclick=()=>row.remove(); }
        document.getElementById('d_add_item').onclick=addRow; addRow(); document.getElementById('d_save').onclick=()=>{const customer=document.getElementById('d_customer').value||'Anonymous'; const items = Array.from(wrap.querySelectorAll('div')).map(div=>{return{product:div.querySelector('.d_pid').value,warehouse:div.querySelector('.d_wh').value,qty:parseFloat(div.querySelector('.d_qty').value||0)}}).filter(i=>i.qty>0); if(items.length===0) return alert('Add atleast 1 item'); actions.createDelivery({customer,items}); ui.closeModal();}},
      transferForm(body){body.innerHTML = `<div style="display:flex;gap:8px"><div style="flex:1"><label class="small">From</label><select id="t_from" class="input">${state.warehouses.map(w=>`<option value='${w.id}'>${w.name}</option>`).join('')}</select></div><div style="flex:1"><label class="small">To</label><select id="t_to" class="input">${state.warehouses.map(w=>`<option value='${w.id}'>${w.name}</option>`).join('')}</select></div></div><div id="t_items_wrap" style="margin-top:8px"></div><div style="margin-top:8px;display:flex;justify-content:space-between;align-items:center"><div class="small">Move items between locations</div><div><button class="btn" id="t_add_item">Add item</button></div></div><div style="margin-top:12px;display:flex;gap:8px;justify-content:flex-end"><button class="btn" id="t_save">Do Transfer</button><button class="btn ghost" onclick="ui.closeModal()">Cancel</button></div>`; const wrap=document.getElementById('t_items_wrap'); function addRow(){const row=document.createElement('div'); row.style.display='flex'; row.style.gap='8px'; row.style.marginTop='8px'; row.innerHTML = `<select class="input t_pid">${state.products.map(p=>`<option value='${p.id}'>${p.sku} — ${p.name}</option>`).join('')}</select><input class="input t_qty" placeholder="qty" /><button class="btn ghost t_rm">Remove</button>`; wrap.appendChild(row); row.querySelector('.t_rm').onclick=()=>row.remove(); }
        document.getElementById('t_add_item').onclick=addRow; addRow(); document.getElementById('t_save').onclick=()=>{const from=document.getElementById('t_from').value; const to=document.getElementById('t_to').value; if(from===to) return alert('From and To must be different'); const items = Array.from(wrap.querySelectorAll('div')).map(div=>{return{product:div.querySelector('.t_pid').value,qty:parseFloat(div.querySelector('.t_qty').value||0),from,to}}).filter(i=>i.qty>0); if(items.length===0) return alert('Add items'); actions.createTransfer({from,to,items}); ui.closeModal();}},
      adjustmentForm(body){body.innerHTML = `<div><label class="small">Product</label><select id="a_prod" class="input">${state.products.map(p=>`<option value='${p.id}'>${p.sku} — ${p.name}</option>`).join('')}</select></div><div style="display:flex;gap:8px;margin-top:8px"><div style="flex:1"><label class="small">Location</label><select id="a_loc" class="input">${state.warehouses.map(w=>`<option value='${w.id}'>${w.name}</option>`).join('')}</select></div><div style="flex:1"><label class="small">Counted Qty</label><input id="a_counted" class="input" /></div></div><div style="margin-top:12px;display:flex;gap:8px;justify-content:flex-end"><button class="btn" id="a_save">Apply</button><button class="btn ghost" onclick="ui.closeModal()">Cancel</button></div>`; document.getElementById('a_save').onclick=()=>{const product=document.getElementById('a_prod').value; const location=document.getElementById('a_loc').value; const counted=document.getElementById('a_counted').value; if(counted==='') return alert('Enter counted qty'); actions.createAdjustment({product,location,counted:parseFloat(counted)}); ui.closeModal();}}
    };

    // simple router
    let currentView='dashboard';
    function showView(view){document.querySelectorAll('.view').forEach(v=>v.style.display='none'); document.getElementById(view).style.display='block'; currentView=view; render.nav(); refreshView();}
    document.querySelectorAll('.nav-item').forEach(n=>n.addEventListener('click',()=>showView(n.getAttribute('data-view'))));

    function refreshView(){if(currentView==='dashboard') render.dashboard(); if(currentView==='products') render.products(); if(currentView==='receipts') render.receipts(); if(currentView==='deliveries') render.deliveries(); if(currentView==='transfers') render.transfers(); if(currentView==='adjustments') render.adjustments(); if(currentView==='ledger') render.ledger(); if(currentView==='settings') render.settings();}
    function refreshAll(){saveState(state); refreshView();}

    // initial render
    refreshAll(); showView('dashboard');

    // seed demo
    document.getElementById('openSeed').addEventListener('click',()=>{localStorage.removeItem(STORAGE_KEY); state = seed(); saveState(state); refreshAll(); alert('Demo data seeded');});

    // search
    document.getElementById('globalSearch').addEventListener('input',e=>{const q=e.target.value.toLowerCase(); if(!q) return refreshAll(); // quick filter on product cards + tables
      // filter products
      const filtered = state.products.filter(p=>p.sku.toLowerCase().includes(q)||p.name.toLowerCase().includes(q)||((p.category||'').toLowerCase().includes(q)));
      document.getElementById('productCards').innerHTML = ''; filtered.forEach(p=>{const total = Object.values(p.stock||{}).reduce((a,b)=>a+Number(b||0),0); const el = document.createElement('div'); el.className='product-card'; el.innerHTML = `<div style="display:flex;justify-content:space-between"><div style="font-weight:700">${p.name}</div><div class="tag">${p.sku}</div></div><div class="small">${p.category}</div><div style="margin-top:10px;font-weight:700">${total}</div>`; document.getElementById('productCards').appendChild(el);});
    });

    // populate tables on load
    refreshAll();

    // For demo: allow modal edit product when clicked from edit button (simple handler)
    window.ui = ui; window.actions = actions; window.render = render; window.state = state;
  </script>
</body>
</html>
