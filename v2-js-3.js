// selector
    const steps=[
      {key:'app',title:'Где будет работать инструмент?',opts:[['tire','Шиномонтаж','Высокая цикличность'],['sto','СТО / автосервис','Ежедневные сервисные работы'],['industry','Производство','Крупный крепёж и тяжёлая нагрузка']]},
      {key:'torque',title:'Какой запас момента нужен?',opts:[[900,'До 900 Н·м','Лёгкие и регулярные работы'],[1200,'900–1200 Н·м','Универсальный диапазон'],[1350,'1200–1400 Н·м','Интенсивная работа'],[1600,'1400+ Н·м','Максимальный запас']]},
      {key:'square',title:'Какой приводной квадрат?',opts:[['1/2"','1/2″','Самый распространённый формат'],['3/4"','3/4″','Тяжёлый крепёж'],['1"','1″','Промышленная нагрузка']]},
      {key:'budget',title:'Какой бюджет на инструмент?',opts:[[8000,'До 8 000 ₽','Практичный старт'],[20000,'До 20 000 ₽','Основной рабочий диапазон'],[40000,'До 40 000 ₽','Расширенный выбор'],[999999,'Бюджет не ограничен','Смотрим прежде всего на задачу']]}
    ];
    let step=0,answers={};const qTitle=document.getElementById('questionTitle'),choices=document.getElementById('choices');
    function drawStep(){const s=steps[step];document.getElementById('stepNo').textContent=String(step+1).padStart(2,'0');document.getElementById('progressBar').style.width=((step+1)/steps.length*100)+'%';qTitle.textContent=s.title;choices.innerHTML=s.opts.map(o=>`<button type="button" class="choice ${answers[s.key]==o[0]?'active':''}" data-value="${String(o[0]).replaceAll('"','&quot;')}"><strong>${o[1]}</strong><small>${o[2]}</small></button>`).join('');document.getElementById('prevStep').style.visibility=step?'visible':'hidden';document.getElementById('nextStep').textContent=step===steps.length-1?'Показать модели →':'Далее →'}
    choices.addEventListener('click',e=>{const b=e.target.closest('.choice');if(!b)return;let v=b.dataset.value;if(steps[step].key==='torque'||steps[step].key==='budget')v=Number(v);answers[steps[step].key]=v;choices.querySelectorAll('.choice').forEach(x=>x.classList.toggle('active',x===b))});
    document.getElementById('nextStep').onclick=()=>{const key=steps[step].key;if(answers[key]===undefined)return flashChoices();if(step<steps.length-1){step++;drawStep()}else showResults()};document.getElementById('prevStep').onclick=()=>{if(step){step--;drawStep()}};
    function flashChoices(){choices.animate([{transform:'translateX(0)'},{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'translateX(0)'}],{duration:260})}
    function showResults(){
      const exact=PRODUCTS.filter(p=>p.apps.includes(answers.app)&&p.square===answers.square&&p.torque>=answers.torque&&p.price<=answers.budget);
      document.getElementById('selectorBody').style.display='none';
      document.getElementById('selectorResults').classList.add('active');
      const grid=document.getElementById('resultGrid');
      if(!exact.length){
        grid.innerHTML=`<article class="result-card" style="grid-column:1/-1;padding:28px"><div class="product-brand">Точный подбор</div><h4 style="font-size:24px;margin:8px 0 12px">В популярной выборке нет точного совпадения</h4><div class="result-why" style="font-size:14px;max-width:640px">По этим параметрам лучше не подменять подбор ближайшей моделью. Менеджер подберёт вариант из полного каталога с учётом квадрата, момента, нагрузки и бюджета.</div><a class="btn blue" href="tel:+73433638603">Позвонить специалисту</a></article>`;
        return;
      }
      const list=exact.sort((a,b)=>a.price-b.price).slice(0,3);
      grid.innerHTML=list.map(p=>`<article class="result-card"><img src="${p.image}" alt="${p.brand} ${p.model}"><div class="product-brand">${p.brand} · ${p.model}</div><h4>${p.title}</h4><div class="price">${fmt(p.price)}</div><div class="result-why">Почему рекомендуем: ${p.why}</div><button class="btn blue full" onclick="addToCart('${p.id}')">Добавить в корзину +</button></article>`).join('')
    }
    document.getElementById('restartSelector').onclick=()=>{answers={};step=0;document.getElementById('selectorResults').classList.remove('active');document.getElementById('selectorBody').style.display='grid';drawStep()};drawStep();
    document.querySelectorAll('[data-preset]').forEach(a=>a.addEventListener('click',()=>{answers.app=a.dataset.preset;step=1;setTimeout(drawStep,250)}));

    // faq + mobile menu
    document.querySelectorAll('.faq-q').forEach(b=>b.onclick=()=>b.parentElement.classList.toggle('open'));
    document.getElementById('menuBtn').onclick=()=>{const links=['#catalog','#selector','#business','#delivery','#service'];const box=document.createElement('div');box.className='modal open';box.id='mobileNav';box.innerHTML=`<div class="modal-card" style="width:min(520px,100%);padding:30px"><div style="display:flex;justify-content:space-between;align-items:center"><img class="logo" src="https://respotec.ru/upload/CMax/6ab/kxvz2gpqhuf4oqn47p6lss56fytuywfl.png"><button class="icon-btn" onclick="document.getElementById('mobileNav').remove();document.body.classList.remove('no-scroll')">×</button></div><div style="display:grid;gap:6px;margin-top:30px">${links.map((l,i)=>`<a href="${l}" onclick="document.getElementById('mobileNav').remove();document.body.classList.remove('no-scroll')" style="font-size:28px;font-weight:800;padding:10px 0">${['Каталог','Подбор','Для бизнеса','Доставка','Сервис'][i]}</a>`).join('')}</div></div>`;document.body.appendChild(box);document.body.classList.add('no-scroll')};
    addEventListener('keydown',e=>{if(e.key==='Escape')closeLayers()});
