const IMG={
      garwin:'https://respotec.ru/upload/iblock/362/y00v2ydqob04ylnr26zax6tfnoasv80i.jpg',
      jonnes:'https://respotec.ru/upload/iblock/faf/e4pkley5l91onnvzsbbbgwzju5gkfrim.jpg',
      pta:'https://respotec.ru/upload/iblock/a04/v4tt1n20cjvh4caj9ur5rt8z09bbj8xb.jpg',
      ombra:'https://respotec.ru/upload/iblock/d4d/g0xe6swq5j6m3fb2zzjs226xjtoeei6y.jpg'
    };
    const PRODUCTS=[
      {id:'garwin-800',brand:'GARWIN PRO',model:'800527-4088',title:'Гайковерт пневматический ударный 1/2″ 800 Нм',price:4600,square:'1/2"',torque:800,weight:3,dims:'240 × 220 × 80 мм',stock:false,image:IMG.garwin,apps:['sto','tire'],load:'daily',why:'Рациональный вариант для регулярных работ без переплаты за максимальный момент.'},
      {id:'jonnes-1356',brand:'JONNESWAY',model:'JAI-1114',title:'Гайковерт пневматический ударный 1/2″ 1356 Нм',price:18450,square:'1/2"',torque:1356,weight:2.5,dims:'220 × 220 × 80 мм',stock:true,image:IMG.jonnes,apps:['sto','tire'],load:'high',why:'Высокий момент при рабочем размере 1/2″ — для интенсивной эксплуатации.'},
      {id:'pta-1200',brand:'СТАНКОИМПОРТ',model:'PTA301',title:'Ударный пневматический гайковерт 1/2″ 1200 Нм',price:6400,square:'1/2"',torque:1200,weight:2.5,dims:'200 × 210 × 80 мм',stock:true,image:IMG.pta,apps:['sto','tire'],load:'daily',why:'Сильное соотношение цены и момента для СТО и шиномонтажа.'},
      {id:'ombra-1200',brand:'OMBRA',model:'OMP11212',title:'Гайковерт пневматический ударный 1/2″ 1200 Нм',price:18650,square:'1/2"',torque:1200,weight:2.8,dims:'220 × 220 × 80 мм',stock:true,image:IMG.ombra,apps:['sto','tire'],load:'daily',why:'Сбалансированная модель для регулярной сервисной работы.'}
    ];
    const fmt=n=>new Intl.NumberFormat('ru-RU').format(n)+' ₽';
    let cart=[];

    // header + scroll reveals
    const header=document.getElementById('header');
    addEventListener('scroll',()=>header.classList.toggle('scrolled',scrollY>24),{passive:true});
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
    document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

    // product rendering
    const productGrid=document.getElementById('productGrid');
    function renderProducts(filter='all'){
      const list=filter==='all'?PRODUCTS:PRODUCTS.filter(p=>p.square===filter);
      productGrid.innerHTML=list.map(p=>`<article class="product reveal in">
        <div class="product-media"><span class="badge">${p.model}</span><img src="${p.image}" alt="${p.brand} ${p.model}" loading="lazy"></div>
        <div class="availability" style="${p.stock?'':'color:#8b95a0'}">${p.stock?'Есть в наличии':'Уточнить наличие'}</div>
        <div class="product-brand">${p.brand}</div><h3>${p.title}</h3>
        <div class="spec-row"><span class="spec">${p.square}</span><span class="spec">${p.torque} Н·м</span><span class="spec">${p.weight} кг</span></div>
        <div class="price-row"><div class="price">${fmt(p.price)}</div></div>
        <div class="product-actions"><button class="btn blue add" type="button" data-id="${p.id}">В корзину +</button><button class="product-detail-btn details" type="button" data-id="${p.id}" aria-label="Подробнее">↗</button></div>
      </article>`).join('');
    }
    renderProducts();
    document.getElementById('filterChips').addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;document.querySelectorAll('.chip').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderProducts(b.dataset.filter)});
    productGrid.addEventListener('click',e=>{const add=e.target.closest('.add'),det=e.target.closest('.details');if(add)addToCart(add.dataset.id);if(det)openProduct(det.dataset.id)});

    // cart
    const overlay=document.getElementById('overlay'),drawer=document.getElementById('cartDrawer'),count=document.getElementById('cartCount');
    function openCart(){drawer.classList.add('open');overlay.classList.add('open');drawer.setAttribute('aria-hidden','false');document.body.classList.add('no-scroll');renderCart()}
    function closeLayers(){drawer.classList.remove('open');overlay.classList.remove('open');document.querySelectorAll('.modal.open').forEach(m=>{m.classList.remove('open');m.setAttribute('aria-hidden','true')});drawer.setAttribute('aria-hidden','true');document.body.classList.remove('no-scroll')}
    document.getElementById('openCart').onclick=openCart;document.getElementById('closeCart').onclick=closeLayers;overlay.onclick=closeLayers;
    function addToCart(id){const item=cart.find(x=>x.id===id);if(item)item.qty++;else cart.push({id,qty:1});updateCount();showToast();renderCart()}
    function updateCount(){count.textContent=cart.reduce((s,x)=>s+x.qty,0);count.classList.remove('bump');requestAnimationFrame(()=>count.classList.add('bump'));setTimeout(()=>count.classList.remove('bump'),220)}
    function renderCart(){const el=document.getElementById('cartItems');if(!cart.length){el.innerHTML='<div class="cart-empty">Корзина пока пустая.<br><br><a href="#catalog" class="btn soft" onclick="closeLayers()">Перейти к моделям</a></div>';document.getElementById('checkoutBtn').disabled=true}else{document.getElementById('checkoutBtn').disabled=false;el.innerHTML=cart.map(x=>{const p=PRODUCTS.find(p=>p.id===x.id);return `<div class="cart-item"><img src="${p.image}" alt=""><div><h4>${p.brand} ${p.model}</h4><div class="mini-price">${fmt(p.price)}</div><div class="qty"><button data-op="minus" data-id="${p.id}">−</button><span>${x.qty}</span><button data-op="plus" data-id="${p.id}">+</button></div></div><button class="remove" data-op="remove" data-id="${p.id}" aria-label="Удалить">×</button></div>`}).join('')}
      document.getElementById('cartTotal').textContent=fmt(cartTotal())}
    function cartTotal(){return cart.reduce((s,x)=>{const p=PRODUCTS.find(p=>p.id===x.id);return s+p.price*x.qty},0)}
    document.getElementById('cartItems').addEventListener('click',e=>{const b=e.target.closest('[data-op]');if(!b)return;const item=cart.find(x=>x.id===b.dataset.id);if(!item)return;if(b.dataset.op==='plus')item.qty++;if(b.dataset.op==='minus')item.qty=Math.max(1,item.qty-1);if(b.dataset.op==='remove')cart=cart.filter(x=>x.id!==b.dataset.id);updateCount();renderCart()});
    function showToast(){const t=document.getElementById('toast');t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1700)}

    