(()=>{
  'use strict';
  const root=document.documentElement;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

  let observer=null;
  if(!reduce && 'IntersectionObserver' in window){
    observer=new IntersectionObserver(entries=>{
      for(const e of entries){
        if(e.isIntersecting){e.target.classList.add('v2-in');observer.unobserve(e.target);}
      }
    },{threshold:.10,rootMargin:'0px 0px -6% 0px'});
    document.querySelectorAll('.reveal').forEach(el=>{
      const r=el.getBoundingClientRect();
      if(r.top < innerHeight*.92) el.classList.add('v2-in');
      observer.observe(el);
    });
    root.classList.add('v2-motion');
  }

  const progress=document.createElement('div');
  progress.id='v2ScrollProgress';
  document.body.appendChild(progress);
  let scrollTick=false;
  const updateScroll=()=>{
    const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
    progress.style.transform=`scaleX(${Math.min(1,Math.max(0,scrollY/max))})`;
    scrollTick=false;
  };
  addEventListener('scroll',()=>{if(!scrollTick){requestAnimationFrame(updateScroll);scrollTick=true;}},{passive:true});
  updateScroll();

  if(reduce) return;

  const halo=document.createElement('div');
  halo.className='v2-cursor-halo';
  document.body.appendChild(halo);
  let mx=innerWidth*.7,my=innerHeight*.3,hx=mx,hy=my;
  addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY;},{passive:true});
  const haloLoop=()=>{
    hx+=(mx-hx)*.12; hy+=(my-hy)*.12;
    halo.style.transform=`translate(${hx-190}px,${hy-190}px)`;
    requestAnimationFrame(haloLoop);
  };
  haloLoop();

  const hero=document.querySelector('.hero');
  const tool=document.querySelector('.hero-product');
  const orbit=document.querySelector('.hero-orbit');
  const labels=[...document.querySelectorAll('.hero .tech-label')];
  if(hero && tool){
    hero.addEventListener('pointermove',e=>{
      if(innerWidth<900) return;
      const r=hero.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5;
      const y=(e.clientY-r.top)/r.height-.5;
      tool.style.transform=`translate3d(${x*22}px,${y*14}px,40px) rotateY(${x*3.2}deg) rotateX(${-y*2.2}deg)`;
      if(orbit) orbit.style.marginLeft=`${x*7}px`;
      labels.forEach((el,i)=>el.style.translate=`${x*(i?8:12)}px ${y*(i?6:9)}px`);
    },{passive:true});
    hero.addEventListener('pointerleave',()=>{
      tool.style.transform='translate3d(0,0,40px)';
      if(orbit) orbit.style.marginLeft='0px';
      labels.forEach(el=>el.style.translate='0 0');
    });
  }

  const tiltEls=[...document.querySelectorAll('.use-card,.product,.service-card')];
  tiltEls.forEach(el=>{
    el.dataset.v2Tilt='';
    el.addEventListener('pointermove',e=>{
      if(innerWidth<900) return;
      const r=el.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5;
      const y=(e.clientY-r.top)/r.height-.5;
      const rx=(-y*3.2).toFixed(2), ry=(x*4.2).toFixed(2);
      el.style.transform=`perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    },{passive:true});
    el.addEventListener('pointerleave',()=>{el.style.transform='';});
  });

  document.querySelectorAll('.btn.primary,.btn.blue,.cart-btn').forEach(btn=>{
    btn.classList.add('v2-magnetic');
    btn.addEventListener('pointermove',e=>{
      if(innerWidth<900) return;
      const r=btn.getBoundingClientRect();
      const x=(e.clientX-r.left-r.width/2)*.08;
      const y=(e.clientY-r.top-r.height/2)*.10;
      btn.style.transform=`translate(${x}px,${y}px)`;
    },{passive:true});
    btn.addEventListener('pointerleave',()=>{btn.style.transform='';});
  });

  document.querySelectorAll('.metric').forEach(metric=>{
    const b=metric.querySelector('b');
    if(!b) return;
    const raw=b.textContent.trim();
    const m=raw.match(/^(\d+)(\+?)$/);
    if(!m || Number(m[1])>2500) return;
    const target=Number(m[1]), suffix=m[2]||'';
    metric.classList.add('v2-count');
    let done=false;
    const io=new IntersectionObserver(es=>{
      if(done || !es.some(x=>x.isIntersecting)) return;
      done=true; io.disconnect();
      const start=performance.now(), dur=1000;
      const frame=t=>{
        const p=Math.min(1,(t-start)/dur);
        const eased=1-Math.pow(1-p,3);
        b.textContent=Math.round(target*eased)+suffix;
        if(p<1) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    },{threshold:.55});
    io.observe(metric);
  });

  const grid=document.getElementById('productGrid');
  if(grid){
    const animateProducts=()=>{
      [...grid.children].forEach((card,i)=>{
        card.animate([
          {opacity:0,transform:'translateY(18px) scale(.985)'},
          {opacity:1,transform:'translateY(0) scale(1)'}
        ],{duration:520,delay:i*65,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'});
      });
    };
    const mo=new MutationObserver(()=>requestAnimationFrame(animateProducts));
    mo.observe(grid,{childList:true});
    if(grid.children.length) animateProducts();
  }
})();
