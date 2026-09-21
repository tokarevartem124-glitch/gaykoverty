(()=>{
  'use strict';

  // Upgrade the hero visual to a more contemporary premium object.
  const heroVisual=document.querySelector('.hero-visual');
  const heroImg=document.querySelector('.hero-product');
  if(heroVisual && heroImg){
    heroVisual.setAttribute('aria-label','Licota PAW-04048S, пневматический гайковёрт 1/2 дюйма');
    heroImg.src='https://media.garwin.ru/images/products/0d/eb/0debbde8-059c-4ff8-8a6a-111e4f67ad15-w488r.jpeg';
    heroImg.alt='Licota PAW-04048S пневматический гайковёрт';
    const labels=heroVisual.querySelectorAll('.tech-label b');
    if(labels[0]) labels[0].textContent='1789 Н·м';
    if(labels[1]) labels[1].textContent='1/2″';
    const note=heroVisual.querySelector('.hero-note');
    if(note) note.textContent='LICOTA · PAW-04048S';
  }

  // Expand the curated showroom to six verified key models.
  if(typeof PRODUCTS!=='undefined' && Array.isArray(PRODUCTS)){
    const additions=[
      {
        id:'licota-04048',
        brand:'LICOTA',
        model:'PAW-04048',
        title:'Гайковерт пневматический ударный 1/2″ 1085 Нм, композитный',
        price:21200,
        square:'1/2"',
        torque:1085,
        weight:2.19,
        dims:'215 × 75 × 215 мм',
        stock:true,
        image:'https://media.garwin.ru/images/products/13/fb/13fb7a20-9e0a-4ffd-bd5d-cd2726702410-w488r.jpeg',
        apps:['sto','tire'],
        load:'high',
        why:'Профессиональная композитная модель Twin Hammer для интенсивной сервисной работы.'
      },
      {
        id:'licota-04048s',
        brand:'LICOTA',
        model:'PAW-04048S',
        title:'Гайковерт пневматический ударный 1/2″ 1789 Нм, композитный',
        price:25000,
        square:'1/2"',
        torque:1789,
        weight:1.65,
        dims:'215 × 80 × 215 мм',
        stock:true,
        image:'https://media.garwin.ru/images/products/0d/eb/0debbde8-059c-4ff8-8a6a-111e4f67ad15-w488r.jpeg',
        apps:['sto','tire','industry'],
        load:'high',
        why:'Лёгкий композитный корпус и высокий максимальный момент для интенсивной эксплуатации.'
      }
    ];
    additions.forEach(p=>{if(!PRODUCTS.some(x=>x.id===p.id)) PRODUCTS.push(p);});
    if(typeof renderProducts==='function') renderProducts();
  }
})();
