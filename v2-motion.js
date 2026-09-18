(()=>{
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine=window.matchMedia('(pointer:fine)').matches;
  const hero=document.querySelector('.hero');
  const heroVisual=document.querySelector('.hero-visual');
  const heroProduct=document.querySelector('.hero-product');

  // decorative ambient layer
  if(hero && !reduce){
    const ambient=document.createElement('div');
    ambient.className='hero-ambient';
    const scan=document.createElement('span');
    scan.className='hero-scan';
    ambient.appendChild(scan);
    const points=[
      [62,23,0],[84,30,1.4],[72,71,2.6],[91,62,4.2],[57,54,5.1],[78,12,3.4],[66,86,6.2]
    ];
    points.forEach(([x,y,d])=>{
      const p=document.createElement('span');
      p.className='hero-particle';
      p.style.left=x+'%';p.style.top=y+'%';p.style.animationDelay=d+'s';
      ambient.appendChild(p);
    });
    hero.prepend(ambient);
  }

  // stagger groups already present in markup
  const staggerGroups=['.use-grid','.product-grid','.fact-list','.service-grid'];
  staggerGroups.forEach(sel=>{
    document.querySelectorAll(sel).forEach(group=>{
      [...group.children].forEach((el,i)=>{
        if(el.classList.contains('reveal')) el.classList.add('stagger-'+Math.min((i%4)+1,4));
      });
    });
  });

  // global soft light following pointer
  if(fine && !reduce){
    const glow=document.createElement('div');
    glow.className='motion-glow';
    document.body.appendChild(glow);
    let gx=innerWidth*.5,gy=innerHeight*.5,tx=gx,ty=gy,raf=0;
    const tick=()=>{
      gx+=(tx-gx)*.12;gy+=(ty-gy)*.12;
      glow.style.transform=`translate3d(${gx-180}px,${gy-180}px,0)`;
      raf=requestAnimationFrame(tick);
    };
    window.addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY;document.body.classList.add('motion-ready')},{passive:true});
    raf=requestAnimationFrame(tick);
    window.addEventListener('pagehide',()=>cancelAnimationFrame(raf),{once:true});
  }

  // cinematic hero parallax
  if(heroVisual && heroProduct && fine && !reduce){
    let px=0,py=0,cx=0,cy=0,frame=0;
    heroVisual.addEventListener('pointermove',e=>{
      const r=heroVisual.getBoundingClientRect();
      px=((e.clientX-r.left)/r.width-.5);
      py=((e.clientY-r.top)/r.height-.5);
    },{passive:true});
    heroVisual.addEventListener('pointerleave',()=>{px=0;py=0});
    const loop=()=>{
      cx+=(px-cx)*.075;cy+=(py-cy)*.075;
      heroProduct.style.translate=`${cx*18}px ${cy*12}px`;
      heroProduct.style.rotate=`${-7+cx*2.2}deg`;
      heroVisual.querySelectorAll('.tech-label').forEach((el,i)=>{
        const dir=i? -1:1;
        el.style.translate=`${cx*dir*12}px ${cy*dir*8}px`;
      });
      frame=requestAnimationFrame(loop);
    };
    frame=requestAnimationFrame(loop);
    window.addEventListener('pagehide',()=>cancelAnimationFrame(frame),{once:true});
  }

  // restrained 3D tilt: only larger cards, pointer devices only
  if(fine && !reduce){
    const tiltEls=[...document.querySelectorAll('.use-card,.product,.service-card')];
    tiltEls.forEach(el=>{
      el.dataset.tilt='';
      el.addEventListener('pointermove',e=>{
        const r=el.getBoundingClientRect();
        const x=(e.clientX-r.left)/r.width-.5;
        const y=(e.clientY-r.top)/r.height-.5;
        const max=el.classList.contains('product')?3.1:4.2;
        el.style.transform=`perspective(900px) rotateX(${-y*max}deg) rotateY(${x*max}deg) translateY(-5px)`;
      },{passive:true});
      el.addEventListener('pointerleave',()=>{el.style.transform=''});
    });

    // magnetic primary actions
    document.querySelectorAll('.btn.primary,.btn.blue,.cta-box .btn').forEach(btn=>{
      btn.addEventListener('pointermove',e=>{
        const r=btn.getBoundingClientRect();
        const x=e.clientX-(r.left+r.width/2);
        const y=e.clientY-(r.top+r.height/2);
        btn.style.translate=`${x*.08}px ${y*.11}px`;
      },{passive:true});
      btn.addEventListener('pointerleave',()=>{btn.style.translate=''});
    });
  }

  // section depth on scroll without layout thrashing
  if(!reduce){
    const labels=[...document.querySelectorAll('.section .eyebrow')];
    let ticking=false;
    const update=()=>{
      const vh=innerHeight;
      labels.forEach(el=>{
        const r=el.getBoundingClientRect();
        const center=r.top+r.height/2;
        if(center>-120 && center<vh+120){
          const t=(center-vh/2)/vh;
          el.style.translate=`${Math.max(-10,Math.min(10,t*-12))}px 0`;
        }
      });
      ticking=false;
    };
    addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(update)}},{passive:true});
    update();
  }
})();
