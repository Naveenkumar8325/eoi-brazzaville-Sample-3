(function(){
  var root=document.documentElement;
  function store(k,v){try{localStorage.setItem(k,v)}catch(e){}}
  function read(k){try{return localStorage.getItem(k)}catch(e){return null}}

  /* Sticky header */
  var mh=document.getElementById('masthead');
  function setH(){root.style.setProperty('--head-h',(mh.offsetHeight+8)+'px')}
  function onScroll(){mh.classList.toggle('is-stuck',mh.getBoundingClientRect().top<=0&&window.scrollY>0)}
  window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',setH);setH();onScroll();
  document.addEventListener('focusin',function(e){if(mh.contains(e.target))return;var r=e.target.getBoundingClientRect(),h=mh.getBoundingClientRect().bottom;if(r.top<h)window.scrollBy(0,r.top-h-8)});

  /* Popovers */
  function pop(btnId,popId,focusSel){var b=document.getElementById(btnId),p=document.getElementById(popId);
    b.addEventListener('click',function(){var o=b.getAttribute('aria-expanded')==='true';closePops();if(!o){b.setAttribute('aria-expanded','true');p.hidden=false;if(focusSel){var f=p.querySelector(focusSel);if(f)f.focus()}}});
    return {b:b,p:p}}
  var pops=[pop('a11yBtn','a11yPop'),pop('searchBtn','searchPop','input')];
  function closePops(ret){pops.forEach(function(x){if(!x.p.hidden){x.p.hidden=true;x.b.setAttribute('aria-expanded','false');if(ret)x.b.focus()}})}
  document.addEventListener('click',function(e){if(!pops.some(function(x){return x.p.contains(e.target)||x.b.contains(e.target)}))closePops()});
  document.getElementById('searchPop').addEventListener('submit',function(e){e.preventDefault()});

  /* Text size, contrast, links */
  var sizes=[87.5,100,112.5,125],idx=1,fb=document.querySelectorAll('[data-font]');
  function af(){root.style.fontSize=sizes[idx]+'%';fb.forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.font==='0'&&idx===1))});store('eoi4-font',idx);setH()}
  var s=parseInt(read('eoi4-font'),10);if(!isNaN(s)&&sizes[s])idx=s;af();
  fb.forEach(function(b){b.addEventListener('click',function(){var d=+b.dataset.font;idx=d===0?1:Math.min(3,Math.max(0,idx+d));af()})});
  function tog(id,attr,val,key){var b=document.getElementById(id);function set(on){on?root.setAttribute(attr,val):root.removeAttribute(attr);b.setAttribute('aria-pressed',String(on));store(key,on?'1':'0')}set(read(key)==='1');b.addEventListener('click',function(){set(b.getAttribute('aria-pressed')!=='true')})}
  tog('contrastBtn','data-contrast','high','eoi4-contrast');tog('linksBtn','data-links','underline','eoi4-links');
  document.getElementById('lang').addEventListener('change',function(e){if(e.target.value==='hi')window.location.href='https://www.eoibrazzaville.gov.in/'});

  /* Menu */
  var menu=document.getElementById('menu'),nt=document.querySelector('.nav-toggle');
  var trig=Array.prototype.slice.call(menu.querySelectorAll('button[aria-controls]'));
  function closeAll(x){trig.forEach(function(t){if(t!==x){t.setAttribute('aria-expanded','false');document.getElementById(t.getAttribute('aria-controls')).hidden=true}})}
  trig.forEach(function(t){t.addEventListener('click',function(){var o=t.getAttribute('aria-expanded')==='true';closeAll(t);t.setAttribute('aria-expanded',String(!o));document.getElementById(t.getAttribute('aria-controls')).hidden=o})});
  document.addEventListener('keydown',function(e){if(e.key!=='Escape')return;var o=trig.filter(function(t){return t.getAttribute('aria-expanded')==='true'})[0];closeAll();if(o&&menu.contains(document.activeElement))o.focus();closePops(true)});
  document.addEventListener('click',function(e){if(!menu.contains(e.target))closeAll()});
  menu.addEventListener('focusout',function(e){if(!menu.contains(e.relatedTarget))closeAll()});
  nt.addEventListener('click',function(){var o=nt.getAttribute('aria-expanded')==='true';nt.setAttribute('aria-expanded',String(!o));nt.setAttribute('aria-label',o?'Menu':'Close menu');menu.classList.toggle('open',!o)});

  /* Hero */
  var sl=Array.prototype.slice.call(document.querySelectorAll('.hs')),cur=0,timer=null,hover=false;
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches,playing=!reduce;
  var hero=document.querySelector('.hero'),live=document.getElementById('heroSlides'),pb=document.getElementById('hPlay'),ctrl=document.getElementById('heroCtrl');
  sl.forEach(function(x,i){var d=document.createElement('button');d.type='button';d.className='dot';d.setAttribute('aria-label','Show slide '+(i+1)+' of '+sl.length);d.addEventListener('click',function(){go(i,true)});ctrl.appendChild(d);if(i){x.setAttribute('aria-hidden','true');x.inert=true}});
  var dots=ctrl.querySelectorAll('.dot');
  function go(i,user){sl[cur].classList.remove('on');sl[cur].setAttribute('aria-hidden','true');sl[cur].inert=true;cur=(i+sl.length)%sl.length;sl[cur].classList.add('on');sl[cur].removeAttribute('aria-hidden');sl[cur].inert=false;dots.forEach(function(d,j){d.setAttribute('aria-current',String(j===cur))});if(user)live.setAttribute('aria-live','polite')}
  go(0);
  function sched(){clearInterval(timer);if(playing&&!hover)timer=setInterval(function(){go(cur+1)},6000)}
  function setPlay(p){playing=p;pb.setAttribute('aria-label',p?'Pause slideshow':'Play slideshow');pb.innerHTML='<svg class="ico" aria-hidden="true"><use href="#i-'+(p?'pause':'play')+'"/></svg>';live.setAttribute('aria-live',p?'off':'polite');sched()}
  pb.addEventListener('click',function(){setPlay(!playing)});
  hero.addEventListener('mouseenter',function(){hover=true;sched()});hero.addEventListener('mouseleave',function(){hover=false;sched()});
  hero.addEventListener('focusin',function(){hover=true;sched()});hero.addEventListener('focusout',function(e){if(!hero.contains(e.relatedTarget)){hover=false;sched()}});
  setPlay(playing);

  /* Tabs */
  document.querySelectorAll('[role="tablist"]').forEach(function(list){
    var tabs=Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
    function sel(t){tabs.forEach(function(x){var on=x===t;x.setAttribute('aria-selected',String(on));x.tabIndex=on?0:-1;document.getElementById(x.getAttribute('aria-controls')).hidden=!on});t.focus()}
    tabs.forEach(function(t,i){t.addEventListener('click',function(){sel(t)});t.addEventListener('keydown',function(e){var n=null;if(e.key==='ArrowRight')n=tabs[(i+1)%tabs.length];if(e.key==='ArrowLeft')n=tabs[(i-1+tabs.length)%tabs.length];if(e.key==='Home')n=tabs[0];if(e.key==='End')n=tabs[tabs.length-1];if(n){e.preventDefault();sel(n)}})});
  });
})();
