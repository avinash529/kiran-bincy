/* ── CURSOR (rAF, GPU) ── */
const cur=document.getElementById('cur'),crr=document.getElementById('curRing');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px';});
(function ac(){rx+=(mx-rx)*.12;ry+=(my-ry)*.12;crr.style.left=rx+'px';crr.style.top=ry+'px';requestAnimationFrame(ac);})();
document.querySelectorAll('a,button,.ev-card,.cd-box').forEach(el=>{
  el.addEventListener('mouseenter',()=>{cur.style.width='16px';cur.style.height='16px';crr.style.width='60px';crr.style.height='60px';});
  el.addEventListener('mouseleave',()=>{cur.style.width='8px';cur.style.height='8px';crr.style.width='36px';crr.style.height='36px';});
});

/* ── STAR + PETAL CANVAS (GPU: opacity, translate only) ── */
const sc=document.getElementById('stars'),sctx=sc.getContext('2d');
let SW,SH;
function rsz(){SW=sc.width=window.innerWidth;SH=sc.height=window.innerHeight;}
rsz();window.addEventListener('resize',rsz);
const stars=Array.from({length:200},()=>({x:Math.random(),y:Math.random(),r:Math.random()*1.2+.2,o:Math.random()*.6+.1,sp:Math.random()*.0003+.0001,tw:Math.random()*Math.PI*2}));
const petals=Array.from({length:30},()=>({x:Math.random(),y:Math.random(),r:Math.random()*5+3,vx:(Math.random()-.5)*.0003,vy:Math.random()*.0004+.0001,a:Math.random()*Math.PI*2,spin:(Math.random()-.5)*.008,c:Math.random()>.5?'rgba(200,169,110,':'rgba(196,113,126,',w:Math.random()*Math.PI*2,ws:Math.random()*.01+.005}));
let T=0;
function anim(){
  sctx.clearRect(0,0,SW,SH);T+=.016;
  for(const s of stars){const tw=.4+.6*Math.sin(T*1.5+s.tw);sctx.beginPath();sctx.arc(s.x*SW,(s.y+T*s.sp)%1*SH,s.r,0,Math.PI*2);sctx.fillStyle=`rgba(255,240,210,${s.o*tw})`;sctx.fill();}
  for(const p of petals){p.y+=p.vy;p.x+=p.vx+Math.sin(T*p.ws+p.w)*.0002;p.a+=p.spin;if(p.y>1){p.y=-.05;p.x=Math.random();}sctx.save();sctx.translate(p.x*SW,p.y*SH);sctx.rotate(p.a);sctx.globalAlpha=.22;sctx.fillStyle=p.c+'.8)';sctx.beginPath();sctx.ellipse(0,0,p.r,p.r*.45,0,0,Math.PI*2);sctx.fill();sctx.restore();}
  requestAnimationFrame(anim);
}
anim();

/* ── COUNTDOWN ── */
function upCD(){const d=new Date('2026-05-17')-new Date();if(d<=0)return;const pad=n=>String(Math.floor(n)).padStart(2,'0');document.getElementById('cdD').textContent=pad(d/86400000);document.getElementById('cdH').textContent=pad(d%86400000/3600000);document.getElementById('cdM').textContent=pad(d%3600000/60000);document.getElementById('cdS').textContent=pad(d%60000/1000);}
upCD();setInterval(upCD,1000);

/* ── GSAP ── */
window.addEventListener('load',()=>{
  gsap.registerPlugin(ScrollTrigger);

  // Loader
  const tl=gsap.timeline({onComplete:initHero});
  tl.to('.loader-name',{opacity:1,duration:.8,ease:'power2.out'})
    .to('#loaderBar',{width:'220px',duration:1.2,ease:'power3.out'})
    .to('#loader',{yPercent:-100,duration:1.1,ease:'power4.inOut',delay:.4})
    .set('#loader',{display:'none'});

  function initHero(){
    const h=gsap.timeline({defaults:{ease:'power3.out'}});
    h.to('#hKiran',{opacity:1,y:0,duration:1,from:{y:50}})
     .to('#hAmp',{opacity:1,duration:.6},'-=.4')
     .to('#hBincy',{opacity:1,y:0,duration:1,from:{y:50}},'-=.6')
     .to('#hDate',{opacity:1,y:0,duration:.8,from:{y:20}},'-=.3')
     .to('#scrollCue',{opacity:1,duration:.6},'-=.2');
  }

  // Parallax
  gsap.to('#heroInner',{yPercent:30,scrollTrigger:{trigger:'#hero',start:'top top',end:'bottom top',scrub:1.2}});
  gsap.to('#storyBg',{yPercent:-25,scrollTrigger:{trigger:'.story-wrap',start:'top bottom',end:'bottom top',scrub:1.5}});

  // Reveals
  document.querySelectorAll('[data-reveal="fade"]').forEach(el=>{
    gsap.fromTo(el,{opacity:0},{opacity:1,duration:1,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 88%',toggleActions:'play none none none'}});
  });
  document.querySelectorAll('[data-reveal="up"]').forEach((el,i)=>{
    gsap.fromTo(el,{opacity:0,y:40},{opacity:1,y:0,duration:1,ease:'power3.out',delay:i*.04,scrollTrigger:{trigger:el,start:'top 88%',toggleActions:'play none none none'}});
  });
  document.querySelectorAll('[data-reveal="left"]').forEach(el=>{
    gsap.fromTo(el,{opacity:0,x:-50},{opacity:1,x:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 85%',toggleActions:'play none none none'}});
  });
  document.querySelectorAll('[data-reveal="right"]').forEach(el=>{
    gsap.fromTo(el,{opacity:0,x:50},{opacity:1,x:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 85%',toggleActions:'play none none none'}});
  });

  // Stagger CD boxes
  gsap.fromTo('.cd-box,.cd-colon',{opacity:0,y:30},{opacity:1,y:0,stagger:.08,duration:.9,ease:'back.out(1.5)',scrollTrigger:{trigger:'.cd-grid',start:'top 82%'}});

  // RSVP ring pulse
  gsap.to('.rsvp-ring',{scale:1.06,stagger:.3,duration:3,yoyo:true,repeat:-1,ease:'sine.inOut'});
});
