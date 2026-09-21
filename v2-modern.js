(()=>{
  'use strict';
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root=document.documentElement;

  requestAnimationFrame(()=>root.classList.add('v2-ready'));

  const setPointer=(el,e,nameX,nameY,scale=18)=>{
    const r=el.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    el.style.setProperty(nameX,`${(x*scale).toFixed(1)}px`);
    el.style.setProperty(nameY,`${(y*scale).toFixed(1)}px`);
  };

  const hero=document.querySelector('.hero');
  if(hero && !reduce){
    hero.addEventListener('pointermove',e=>{
      if(innerWidth<900) return;
      setPointer(hero,e,'--hero-x','--hero-y',22);
    },{passive:true});
    hero.addEventListener('pointerleave',()=>{
      hero.style.setProperty('--hero-x','0px');
      hero.style.setProperty('--hero-y','0px');
    });
  }

  const selector=document.querySelector('.selector-wrap');
  if(selector && !reduce){
    selector.addEventListener('pointermove',e=>{
      if(innerWidth<900) return;
      setPointer(selector,e,'--selector-x','--selector-y',15);
    },{passive:true});
    selector.addEventListener('pointerleave',()=>{
      selector.style.setProperty('--selector-x','0px');
      selector.style.setProperty('--selector-y','0px');
    });
  }

  const glowTargets='.use-card,.product,.choice,.service-card';
  document.addEventListener('pointermove',e=>{
    if(reduce || innerWidth<900) return;
    const el=e.target.closest(glowTargets);
    if(!el) return;
    const r=el.getBoundingClientRect();
    el.style.setProperty('--px',`${e.clientX-r.left}px`);
    el.style.setProperty('--py',`${e.clientY-r.top}px`);
  },{passive:true});

  let lastY=scrollY;
  const header=document.querySelector('.site-header');
  addEventListener('scroll',()=>{
    if(!header) return;
    const y=scrollY;
    header.dataset.scrollDir=y>lastY?'down':'up';
    lastY=y;
  },{passive:true});

  if('IntersectionObserver' in window){
    const io=new IntersectionObserver(entries=>{
      entries.forEach(entry=>entry.target.classList.toggle('is-active',entry.isIntersecting));
    },{threshold:.34});
    document.querySelectorAll('#applications,#selector,#catalog,#business,#delivery,.final-cta').forEach(el=>io.observe(el));
  }
})();
