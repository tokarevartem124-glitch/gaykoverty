(async()=>{
  const load=src=>new Promise((ok,fail)=>{const s=document.createElement('script');s.src=src+'?v=5';s.async=false;s.onload=ok;s.onerror=fail;document.head.appendChild(s)});
  try{
    await load('v2-js-1.js');
    await load('v2-motion-boot.js');
    for(const src of ['v2-js-2.js','v2-js-3.js','v2-js-4.js','v2-motion.js']) await load(src);
  }catch(err){
    document.documentElement.classList.remove('motion-ok');
    console.error('v2 loader error',err);
  }
})();
