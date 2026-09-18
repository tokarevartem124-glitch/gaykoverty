(async()=>{
  const load=src=>new Promise((ok,fail)=>{const s=document.createElement('script');s.src=src;s.async=false;s.onload=ok;s.onerror=fail;document.head.appendChild(s)});
  try{
    await load('v2-js-1.js?v=5');
    await load('v2-js-2.js?v=5');
    await load('v2-js-3.js?v=5');
    await load('v2-js-4.js?v=5');
    await load('v2-visual.js?v=22');
  }catch(err){
    document.documentElement.classList.remove('motion-ok','v2-motion');
    console.error('v2 loader error',err);
  }
})();
