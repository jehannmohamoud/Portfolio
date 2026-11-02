document.documentElement.classList.add('js');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');reveal.unobserve(e.target)}}),{threshold:.08});
document.querySelectorAll('.reveal').forEach(e=>reveal.observe(e));
const motion=document.querySelector('#motion');let paused=reduced.matches;
function sync(){document.body.classList.toggle('paused',paused);motion.setAttribute('aria-pressed',String(paused));motion.textContent=paused?'Play motion ▷':'Pause motion Ⅱ'}
sync();motion.addEventListener('click',()=>{paused=!paused;sync()});reduced.addEventListener('change',()=>{paused=reduced.matches;sync()});
let scheduled=false;const progress=document.querySelector('.progress'),visual=document.querySelector('.hero-visual');
function updateScroll(){const max=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${max>0?Math.min(1,scrollY/max):0})`;visual.style.transform=(!paused&&!reduced.matches&&innerWidth>850)?`translateY(${Math.min(scrollY,800)*.055}px)`:'none';scheduled=false}
addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateScroll)}},{passive:true});addEventListener('resize',updateScroll);updateScroll();
const rail=document.querySelector('.filmstrip');
document.querySelector('.gallery-prev').addEventListener('click',()=>rail.scrollBy({left:-rail.clientWidth*.8,behavior:reduced.matches?'instant':'smooth'}));document.querySelector('.gallery-next').addEventListener('click',()=>rail.scrollBy({left:rail.clientWidth*.8,behavior:reduced.matches?'instant':'smooth'}));
rail.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();rail.scrollBy({left:(e.key==='ArrowRight'?1:-1)*rail.clientWidth*.6,behavior:reduced.matches?'instant':'smooth'})}});
let drag=null,moved=false,suppress=false;
rail.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0)return;drag={x:e.clientX,left:rail.scrollLeft};moved=false});rail.addEventListener('pointermove',e=>{if(!drag)return;const delta=e.clientX-drag.x;if(Math.abs(delta)>6){moved=true;rail.classList.add('dragging');rail.scrollLeft=drag.left-delta;e.preventDefault()}});addEventListener('pointerup',()=>{if(!drag)return;suppress=moved;drag=null;rail.classList.remove('dragging');setTimeout(()=>suppress=false,0)});rail.addEventListener('dragstart',e=>e.preventDefault());
const viewer=document.querySelector('#viewer');document.querySelectorAll('.enlarge').forEach(b=>b.addEventListener('click',()=>{if(suppress)return;const image=b.querySelector('img'),target=document.querySelector('#viewer-image');target.src=image.src;target.alt=image.alt;document.querySelector('#viewer-caption').textContent=b.dataset.caption;viewer.showModal()}));document.querySelector('#close-viewer').addEventListener('click',()=>viewer.close());viewer.addEventListener('click',e=>{if(e.target===viewer)viewer.close()});document.querySelector('#year').textContent=new Date().getFullYear();
