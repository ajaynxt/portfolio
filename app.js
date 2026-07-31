(()=>{"use strict";const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)],root=document.documentElement,body=document.body,reduced=matchMedia('(prefers-reduced-motion: reduce)');const media=window.AJAY_NXT_MEDIA||{videos:[],photos:[]};
const loader=null;
const atmosphereControl=$('[data-atmosphere-control]');
let paletteStep=Number(localStorage.getItem('ajaynxt-palette-step')||0);
let paletteRunning=localStorage.getItem('ajaynxt-palette-running')!=='false';
let atmosphereTimer;

function luxuryPalette(step){
  const goldenAngle=137.507764;
  const hue=(24+step*goldenAngle)%360;
  const secondary=(hue+18+Math.sin(step*.71)*16+360)%360;
  const saturation=30+Math.round((Math.sin(step*.43)+1)*5);
  const accentLight=43+Math.round((Math.cos(step*.37)+1)*3);
  return{
    hue,
    bg:`hsl(${hue.toFixed(1)} 24% 96%)`,
    bg2:`hsl(${secondary.toFixed(1)} 27% 98%)`,
    surface:`hsl(${hue.toFixed(1)} 22% 99%)`,
    surface2:`hsl(${secondary.toFixed(1)} 17% 91%)`,
    ink:`hsl(${(hue+180)%360} 14% 10%)`,
    muted:`hsl(${(hue+180)%360} 9% 36%)`,
    muted2:`hsl(${(hue+180)%360} 7% 57%)`,
    accent:`hsl(${hue.toFixed(1)} ${saturation}% ${accentLight}%)`,
    accent2:`hsl(${secondary.toFixed(1)} ${Math.max(28,saturation-3)}% 78%)`,
    line:`hsla(${(hue+180)%360} 14% 12% / .14)`,
    line2:`hsla(${(hue+180)%360} 14% 12% / .29)`,
    shadow:`0 38px 100px hsla(${hue.toFixed(1)} 28% 22% / .14)`
  };
}
function applyInfinitePalette(advance=false){
  if(advance)paletteStep+=1;
  const p=luxuryPalette(paletteStep);
  root.dataset.atmosphere='infinite';
  root.dataset.tone='light';
  root.style.setProperty('--bg',p.bg);
  root.style.setProperty('--bg2',p.bg2);
  root.style.setProperty('--surface',p.surface);
  root.style.setProperty('--surface2',p.surface2);
  root.style.setProperty('--ink',p.ink);
  root.style.setProperty('--muted',p.muted);
  root.style.setProperty('--muted2',p.muted2);
  root.style.setProperty('--accent',p.accent);
  root.style.setProperty('--accent2',p.accent2);
  root.style.setProperty('--accentInk','#fff');
  root.style.setProperty('--line',p.line);
  root.style.setProperty('--line2',p.line2);
  root.style.setProperty('--shadow',p.shadow);
  $('meta[name="theme-color"]')?.setAttribute('content',p.bg);
  const count=$('[data-atmosphere-count]');
  if(count)count.textContent=`${String((paletteStep%99)+1).padStart(2,'0')} / ∞`;
  const label=atmosphereControl?.querySelector('span');
  if(label)label.textContent=paletteRunning?'Infinite colour':'Colour locked';
  atmosphereControl?.setAttribute('aria-pressed',String(!paletteRunning));
  localStorage.setItem('ajaynxt-palette-step',String(paletteStep));
  dispatchEvent(new CustomEvent('ajaynxt:atmosphere',{detail:{tone:'light',hue:p.hue}}));
}
function scheduleAtmosphere(){
  clearInterval(atmosphereTimer);
  if(paletteRunning&&!reduced.matches){
    atmosphereTimer=setInterval(()=>applyInfinitePalette(true),3000);
  }
}
atmosphereControl?.addEventListener('click',()=>{
  paletteRunning=!paletteRunning;
  localStorage.setItem('ajaynxt-palette-running',String(paletteRunning));
  applyInfinitePalette(false);
  scheduleAtmosphere();
});
applyInfinitePalette(false);
scheduleAtmosphere();
const header=$('[data-header]'),progress=$('.progress i');function scrollUI(){header?.classList.toggle('scrolled',scrollY>20);const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);if(progress)progress.style.width=`${Math.min(100,scrollY/max*100)}%`}scrollUI();addEventListener('scroll',scrollUI,{passive:true});
const menu=$('[data-menu-button]'),desktopNav=$('.desktop-nav'),mobileNav=$('[data-mobile-nav]');function setMenu(open){desktopNav?.classList.toggle('open',open);mobileNav?.classList.toggle('open',open);body.classList.toggle('menu-open',open);menu?.setAttribute('aria-expanded',String(open))}menu?.addEventListener('click',()=>setMenu(!(desktopNav?.classList.contains('open')||mobileNav?.classList.contains('open'))));$$('nav a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
function initReveals(){const els=$$('.reveal');if(reduced.matches){els.forEach(e=>e.classList.add('visible'));return}if(window.gsap&&window.ScrollTrigger){gsap.registerPlugin(ScrollTrigger);els.forEach(el=>gsap.fromTo(el,{opacity:0,y:28},{opacity:1,y:0,duration:.85,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 89%',once:true}}));gsap.from('.hero h1 span',{opacity:0,yPercent:110,duration:1.1,stagger:.12,delay:1.55,ease:'power4.out'});}else{const o=new IntersectionObserver((es,ob)=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');ob.unobserve(e.target)}}),{threshold:.06});els.forEach(e=>o.observe(e));$$('.hero .reveal').forEach(e=>e.classList.add('visible'))}}addEventListener('load',initReveals,{once:true});setTimeout(initReveals,850);

const liveShots=$$('img[data-live-src]');
if('IntersectionObserver'in window){
  const shotObserver=new IntersectionObserver((entries,observer)=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      const img=entry.target;
      const live=img.dataset.liveSrc;
      if(live&&!img.dataset.liveLoaded){
        img.dataset.liveLoaded='true';
        img.src=live;
      }
      observer.unobserve(img);
    });
  },{rootMargin:'700px 0px'});
  liveShots.forEach(img=>shotObserver.observe(img));
}else{
  liveShots.forEach(img=>{if(img.dataset.liveSrc)img.src=img.dataset.liveSrc});
}
$$('[data-project] img').forEach(img=>img.addEventListener('error',()=>{const f=img.dataset.fallback;if(f&&img.src!==new URL(f,location.href).href){img.src=f;img.classList.add('fallback-active')}}));
const filters=$$('[data-filter]'),projects=$$('[data-project]');filters.forEach(b=>b.addEventListener('click',()=>{const f=b.dataset.filter;filters.forEach(x=>x.classList.toggle('active',x===b));projects.forEach(p=>p.classList.toggle('hidden',f!=='all'&&!p.dataset.category.includes(f)));window.ScrollTrigger?.refresh?.()}));
if(!reduced.matches&&matchMedia('(hover:hover) and (pointer:fine)').matches){$$('.project-visual').forEach(el=>{el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(1100px) rotateX(${-y*3.5}deg) rotateY(${x*4.5}deg)`});el.addEventListener('pointerleave',()=>el.style.transform='')});$$('.magnetic').forEach(el=>{el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();el.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.12}px,${(e.clientY-r.top-r.height/2)*.14}px)`});el.addEventListener('pointerleave',()=>el.style.transform='')})}
const dot=$('.cursor-dot'),ring=$('.cursor-ring');if(dot&&ring&&matchMedia('(hover:hover) and (pointer:fine)').matches){let x=innerWidth/2,y=innerHeight/2,rx=x,ry=y;addEventListener('pointermove',e=>{x=e.clientX;y=e.clientY;dot.style.transform=`translate(${x}px,${y}px) translate(-50%,-50%)`});(function draw(){rx+=(x-rx)*.15;ry+=(y-ry)*.15;ring.style.transform=`translate(${rx}px,${ry}px) translate(-50%,-50%)`;requestAnimationFrame(draw)})();$$('a,button,input,select,textarea').forEach(el=>{el.addEventListener('mouseenter',()=>ring.classList.add('active'));el.addEventListener('mouseleave',()=>ring.classList.remove('active'))})}
const dialog=$('[data-video-dialog]'),stage=$('[data-video-stage]');function openVideo(index){const item=media.videos[index];if(!item||!dialog||!stage)return;stage.replaceChildren();if(item.localUrl){const v=document.createElement('video');v.src=item.localUrl;v.poster=item.poster||'';v.controls=true;v.autoplay=true;v.playsInline=true;stage.append(v)}else if(item.driveId){const f=document.createElement('iframe');f.src=`https://drive.google.com/file/d/${encodeURIComponent(item.driveId)}/preview`;f.allow='autoplay; fullscreen';f.allowFullscreen=true;f.title=item.title;stage.append(f)}dialog.showModal();body.classList.add('dialog-open')}$$('[data-video-index]').forEach(b=>b.addEventListener('click',()=>openVideo(Number(b.dataset.videoIndex))));$('[data-video-close]')?.addEventListener('click',()=>dialog?.close());dialog?.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});dialog?.addEventListener('close',()=>{stage?.replaceChildren();body.classList.remove('dialog-open')});
const form=$('[data-enquiry-form]'),status=$('[data-form-status]');function error(input,msg){input.setAttribute('aria-invalid',String(Boolean(msg)));const e=input.closest('label')?.querySelector('.field-error');if(e)e.textContent=msg;return!msg}function valid(input){const v=input.value.trim();if(input.required&&!v)return error(input,'Please complete this field.');if(input.name==='phone'&&!/^[0-9+()\-\s]{8,18}$/.test(v))return error(input,'Enter a valid phone number.');if(input.name==='email'&&v&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))return error(input,'Enter a valid email.');return error(input,'')}
form?.addEventListener('submit',async e=>{e.preventDefault();const required=$$('[required]',form),ok=required.map(valid).every(Boolean);if(!ok){required.find(x=>x.getAttribute('aria-invalid')==='true')?.focus();return}const values=Object.fromEntries(new FormData(form)),button=form.querySelector('button[type=submit]');button.disabled=true;if(status)status.textContent='Preparing your project brief…';try{if(window.AJAY_NXT_FIREBASE?.configured){await window.AJAY_NXT_FIREBASE.saveEnquiry({...values,timeline:'',budget:''});if(status)status.textContent='Enquiry saved. Ajay will contact you shortly.';form.reset()}else{const text=`AJAYNXT premium project enquiry\nName: ${values.name}\nPhone: ${values.phone}\nEmail: ${values.email||'-'}\nService: ${values.service}\nGoal: ${values.details}`;open(`https://wa.me/919929562585?text=${encodeURIComponent(text)}`,'_blank','noopener,noreferrer');if(status)status.textContent='Opening WhatsApp…'}}catch(err){const text=`AJAYNXT project enquiry\nName: ${values.name}\nPhone: ${values.phone}\nService: ${values.service}\nGoal: ${values.details}`;open(`https://wa.me/919929562585?text=${encodeURIComponent(text)}`,'_blank','noopener,noreferrer');if(status)status.textContent='Opening WhatsApp fallback…'}finally{button.disabled=false}});$$('input,textarea',form||document).forEach(i=>i.addEventListener('blur',()=>i.value&&valid(i)));
$('[data-year]')?.replaceChildren(document.createTextNode(String(new Date().getFullYear())));
let firebaseRequested=false;
function loadFirebase(){
  if(firebaseRequested)return;
  const src=window.AJAY_NXT_FIREBASE_SRC;
  if(!src)return;
  firebaseRequested=true;
  const s=document.createElement('script');
  s.type='module';
  s.src=src;
  document.head.append(s);
}
form?.addEventListener('focusin',loadFirebase,{once:true});
form?.addEventListener('pointerenter',loadFirebase,{once:true});
if('requestIdleCallback'in window)requestIdleCallback(loadFirebase,{timeout:5000});
else setTimeout(loadFirebase,4500);})();
