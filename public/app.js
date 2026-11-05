'use strict';
const $ = s => document.querySelector(s);
const main = $('main');
const iconPaths = { search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>', book:'<path d="M3 5c3-1 6-1 9 1 3-2 6-2 9-1v13c-3-1-6-1-9 1-3-2-6-2-9-1zM12 6v13"/>', arrow:'<path d="M4 12h15m-5-5 5 5-5 5"/>', pen:'<path d="m4 20 1-6L16 3l5 5L10 19zM13 6l5 5"/>', stack:'<path d="m3 8 9-5 9 5-9 5zM3 12l9 5 9-5M3 16l9 5 9-5"/>', check:'<path d="m5 12 4 4 10-10"/>', flag:'<path d="M5 21V4m0 1c6-5 8 5 15 0v10c-6 5-9-5-15 0"/>' };
function icon(k){return '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">'+iconPaths[k]+'</svg>'}
$('#search').innerHTML=icon('search')+'<span>搜索</span>';
const esc = s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num = i=>String(i+1).padStart(2,'0');
const link = i=>'#read/'+(i+1);
const key='sunzi.study.v1';
let saved={};
try{saved=JSON.parse(localStorage.getItem(key))||{}}catch{}
let notes=Array.isArray(saved.notes)?saved.notes.slice(0,13):[], done=new Set(Array.isArray(saved.done)?saved.done.filter(i=>Number.isInteger(i)&&i>=0&&i<13):[]),last=Number.isInteger(saved.last)&&saved.last>=0&&saved.last<13?saved.last:null;
function persist(){if(signedReader)return true;try{localStorage.setItem(key,JSON.stringify({notes,done:[...done],last}));return true}catch{notify('浏览器未能保存，本次输入仍在当前页面。');return false}}
let toastTimer;
function notify(msg){$('#status').textContent=msg;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#status').textContent='',2600)}
function section(en,title,action=''){return '<div class="section-head"><div><div class="eyebrow">'+en+'</div><h2>'+title+'</h2></div>'+action+'</div>'}
function card(i){const d=lessons[i];return '<a class="card" href="'+link(i)+'"><div class="card-index">第'+numerals[i]+'篇 <i></i> '+num(i)+'</div><img class="card-art" alt="" src="art/chapter-ink/'+num(i)+'.webp"><h3>'+d[0]+'篇</h3><p>'+d[1]+'</p><div class="card-foot"><span>'+groups[groupOf(i)]+'</span><b>'+(done.has(i)?'已读 ':'')+icon('arrow')+'</b></div></a>'}
function cards(ids){return '<div class="cards">'+ids.map(card).join('')+'</div>'}
const sampleHistoryKey = 'sunzi.opening-sample.v2';
let sampleHistory = { chapters: [], groups: {} };
let currentSample = null;

// Pick once from each index per round, even when moving between a reload and a new tab.
function pickUnseen(history, size) {
  const seen = Array.isArray(history)
    ? [...new Set(history.filter(i => Number.isInteger(i) && i >= 0 && i < size))]
    : [];
  const previous = seen.at(-1);
  if (seen.length === size) seen.length = 0;
  const choices = Array.from({ length: size }, (_, i) => i)
    .filter(i => !seen.includes(i) && (size === 1 || i !== previous));
  seen.push(choices[Math.floor(Math.random() * choices.length)]);
  return seen;
}

function drawSample() {
  try {
    const stored = JSON.parse(localStorage.getItem(sampleHistoryKey));
    if (stored && Array.isArray(stored.chapters) && stored.groups && typeof stored.groups === 'object') {
      sampleHistory = stored;
    } else if (!sampleHistory.chapters.length) {
      sampleHistory.chapters = JSON.parse(localStorage.getItem('sunzi.opening-sample.v1')) || [];
    }
  } catch { /* Use this tab's history when browser storage is unavailable. */ }

  const chapters = pickUnseen(sampleHistory.chapters, openingReadings.length);
  const chapter = chapters.at(-1);
  const groups = pickUnseen(sampleHistory.groups[chapter], openingReadings[chapter].length);
  sampleHistory.chapters = chapters;
  sampleHistory.groups[chapter] = groups;
  try { localStorage.setItem(sampleHistoryKey, JSON.stringify(sampleHistory)); } catch {}
  return { chapter, group: groups.at(-1) };
}

function openingSample() {
  currentSample ??= drawSample();
  const { chapter, group } = currentSample;
  const { part, start, count, excerpt, translationExcerpt } = openingReadings[chapter][group];
  const rows = annotations[chapter][part - 1].lines.slice(start - 1, start - 1 + count);
  const originalText = rows.map(([original]) => original).join('');
  const from = excerpt ? originalText.indexOf(excerpt) : 0;
  const until = from + (excerpt ?? originalText).length;
  let offset = 0;
  const wordsByRow = yeEditions[chapter].words[part - 1];
  const annotatedText = rows.map(([original], i) => {
    const piece = original.slice(Math.max(0, from - offset), Math.max(0, until - offset));
    offset += original.length;
    return withWordReadings(piece, wordsByRow[start - 1 + i]);
  }).join('');
  const translation = translationExcerpt ?? rows.map(([, ye]) => ye).join('');
  const href = link(chapter) + '/p/' + part + '/s/' + start;
  return `<section class="opening-sample" aria-labelledby="sample-title">
    <div class="sample-heading"><h2 id="sample-title">卷首试读</h2><small>《${lessons[chapter][0]}篇》</small></div>
    <div class="sample-reading">
      <blockquote>${annotatedText}</blockquote>
      <details><summary>叶玉麟译文</summary><p>${esc(translation)}</p></details>
    </div>
    <div class="sample-actions">
      <button type="button" class="sample-next" aria-label="换一组卷首试读"><span aria-hidden="true">↻</span> 换一组</button>
      <a class="text-link" href="${href}">读这一段 ${icon('arrow')}</a>
    </div>
  </section>`;
}
function home(){return `<section class="hero"><div class="hero-art"></div><div class="hero-caption" aria-hidden="true">山川形势图<span>示意</span></div><div class="hero-copy"><div class="eyebrow"><i></i> 经典研读系列 <b>/</b> 卷一</div><h1><img class="hero-wordmark" src="art/title-weibei-c.svg" alt="孙子兵法"><span class="title-seal">十三篇</span></h1><div class="hero-sub">孙子十三篇，逐句读。</div><p>从原文读起，遇到难句可对照叶玉麟的白话译文，<br class="desk">也可以点开字词，细看曹操、杜牧的注文。</p><div class="actions"><a class="button primary" href="${resumeLink()}">${icon('book')} ${resumeLabel()} ${icon('arrow')}</a><a class="text-link" href="#map">看全书脉络 ${icon('arrow')}</a></div></div><div class="hero-folio">图录 · 〇一</div></section>
${openingSample()}
<section>${section('CHAPTER SELECTION','篇章研读','<a class="text-link" href="#catalog">查看全部十三篇 '+icon('arrow')+'</a>')}${cards([0,1,2])}</section>
<div class="method"><div class="method-title"><span class="eyebrow">READING GUIDE</span><strong>怎样读</strong></div>${[['book','读原文','通读一段，把握上下文'],['stack','对照叶译','逐句对照，看清句意'],['search','查注解','点开字词，参看古注']].map((d,i)=>'<div class="method-step"><div class="method-ico">'+icon(d[0])+'</div><div><strong><small>0'+(i+1)+'</small>'+d[1]+'</strong><p>'+d[2]+'</p></div></div>').join('')}</div>`}
function catalog() {
  const choices = groups.map((name, group) => `
    <button class="stage-choice" data-filter="${group}" aria-pressed="false">
      ${stagePainting(group)}
      <span><small>${num(group)}</small><strong>${name}</strong></span>
    </button>`).join('');
  return `${section('THE THIRTEEN CHAPTERS','十三篇目')}
    <p class="intro">按原序通读，或先看<a href="#map">十三篇的全书脉络 ↗</a>。</p>
    <div class="filters stage-filters" role="group" aria-label="按阶段选篇">
      <div class="stage-filter-head"><span>按阶段选篇</span><button data-filter="-1" aria-pressed="true">全部篇章</button></div>
      ${choices}
    </div><div id="shelf">${cards(lessons.map((_,i)=>i))}</div>`;
}
const chapterArtDescriptions = [
  '半展的竹简上留着竖行墨迹', '车上载着远征所需的粮袋', '完好的城池敞开城门',
  '山脊上的城垣', '陡坡上蓄势待落的圆石', '绕过岩石的溪流',
  '队伍沿山路绕行', '岔路旁的小旗', '群鸟从林间惊起',
  '两面山壁之间的隘口', '行至崖壁与河湾之间的队伍', '营帐上空随风倾斜的火焰和浓烟',
  '两人之间递过一卷简册'
];
function readingFrontispiece(i) {
  const group = groupOf(i);
  return `<div class="chapter-opening">
    <div><div class="eyebrow">CHAPTER ${num(i)} <b>/</b> ${groups[group]}</div>
      <h1>${lessons[i][0]}篇</h1><p class="read-q">${lessons[i][1]}</p>
    </div>
    <img class="opening-art" width="180" height="132" src="art/chapter-ink/${num(i)}.webp" alt="${chapterArtDescriptions[i]}">
  </div>
  <details class="reading-stage"><summary>看阶段图 · ${groups[group]}</summary>
    <div class="reading-stage-inner">${stagePainting(group)}<div>
      <strong>${stageScenes[group]}</strong><p>${mapQuestions[group]}</p>
      <a href="#map/${i+1}">本篇在全书中的位置 ↗</a>
    </div></div>
  </details>`;
}
function read(i){last=i;persist();return `<div class="crumb"><a href="#catalog">十三篇目</a> / 第${numerals[i]}篇</div><div class="reader-grid"><article class="reader">${readingFrontispiece(i)}${annotatedReading(i)}<div class="ruled"></div><div class="read-actions"><button class="button primary" id="done">${icon('check')} ${done.has(i)?'已读 · 撤销标记':'标记为已读'}</button><a class="text-link" href="${i<12?link(i+1):'#journal'}">${i<12?'下一篇 · '+lessons[i+1][0]:'查看我的研读'} ${icon('arrow')}</a></div></article><aside><div class="eyebrow">IN THIS CHAPTER</div><h3>本篇段落</h3><nav class="chapter-map" aria-label="段落导航">${localContents(i)}</nav><div class="eyebrow shelf-label">CONTENTS</div><h3>十三篇目</h3><a href="#map/${i+1}">本篇在全书中的位置 ↗</a>${lessons.map((x,j)=>'<a '+(i===j?'class="current" aria-current="page"':'')+' href="'+link(j)+'"><small>'+num(j)+'</small>'+x[0]+'篇'+(done.has(j)?icon('check'):'')+'</a>').join('')}</aside></div>`}
function journal(){let entries=lessons.map((_,i)=>i).filter(i=>notes[i]?.trim());return section('READING RECORD','我的研读')+journalAccount()+`<div class="journal-summary"><div><span class="eyebrow">READING PROGRESS</span><h2>已读 ${done.size} <small>/ 13 篇</small></h2><progress max="13" value="${done.size}"></progress></div><a class="button primary" href="${resumeLink()}">${icon('book')} ${resumeLabel()}</a></div>
${entries.length ? `<h2 class="journal-heading">以前的笔记 <small>${entries.length} 则</small></h2><div class="note-list">${entries.map(i=>`<a href="${link(i)}"><strong>第${numerals[i]}篇 · ${lessons[i][0]}</strong><p>${esc(notes[i])}</p><span>返回篇章 ${icon('arrow')}</span></a>`).join('')}</div>` : ''}`}
function render(){stopTracking();let hash=location.hash.slice(1);
 if(hash==='account'&&!accountsEnabled){hash='journal';history.replaceState(history.state,'','#journal')}
 const oldCase=/^read\/([1-9]|1[0-3])\/case$/.exec(hash);
 if(oldCase){hash='read/'+oldCase[1];history.replaceState(history.state,'','#'+hash)}
 const mapMatch=/^map(?:\/([1-9]|1[0-3]))?$/.exec(hash);
 const match=/^read\/(\d+)(?:\/p\/(\d+)(?:\/s\/(\d+))?)?$/.exec(hash),i=match?Number(match[1])-1:-1,reader=i>=0&&i<13;const page=reader?'read':mapMatch?'map':hash==='catalog'?'catalog':hash==='journal'?'journal':hash==='account'?'account':'home';
 if (page !== 'home') currentSample = null;
 main.className='wrap '+page;main.innerHTML=reader?read(i):mapMatch?bookMap(Number(mapMatch[1])||0):page==='catalog'?catalog():page==='journal'?journal():page==='account'?accountView():home();
 const sourceFooter=$('#chapter-source');
 sourceFooter.hidden=!(reader&&!!yeEditions[i]);
 sourceFooter.innerHTML=sourceFooter.hidden?'':yeCredit(i);
 document.querySelectorAll('nav a').forEach(a=>{const active=a.dataset.page===(reader?'catalog':page);a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});document.title=(reader?lessons[i][0]+'篇':mapMatch?'全书脉络':page==='catalog'?'十三篇目':page==='journal'?'我的研读':page==='account'?'读者账户':'孙子兵法')+' · 兵法研读室';
 if(reader){bindReadingMode();$('#done').onclick=()=>{if(done.has(i))done.delete(i);else done.add(i);persist();sendProgress({kind:'done',chapter:i,value:done.has(i)});$('#done').innerHTML=icon('check')+' '+(done.has(i)?'已读 · 撤销标记':'标记为已读');document.querySelector('aside a.current').innerHTML='<small>'+num(i)+'</small>'+lessons[i][0]+'篇'+(done.has(i)?icon('check'):'');notify(done.has(i)?'已标记为读完':'已撤销已读标记')}}
 if(page==='catalog')document.querySelector('.filters').onclick=e=>{const btn=e.target.closest('[data-filter]');if(!btn)return;document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',b===btn));let g=Number(btn.dataset.filter);$('#shelf').innerHTML=cards(lessons.map((_,j)=>j).filter(j=>g===-1||groupOf(j)===g))};if(reader) enterReading(i,match); else if(mapMatch?.[1]){const spread=document.querySelector('.atlas-spread');if(window.matchMedia('(max-width:760px)').matches && mapPick)document.getElementById('chapter-lens').scrollIntoView();else if(window.scrollY>spread.offsetTop)spread.scrollIntoView();mapPick=false} else window.scrollTo(0,0)}
$('#search').onclick=()=>{$('#query').value='';results();$('#finder').showModal();$('#query').focus()};$('#matches').onclick=e=>{const hit=e.target.closest('a');if(!hit)return;$('#finder').close();if(hit.hash===location.hash){e.preventDefault();render();main.focus({preventScroll:true})}};$('#query').oninput=results;$('#finder').onclick=e=>{if(e.target===e.currentTarget&&e.clientX!==0){const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.currentTarget.close()}};
main.addEventListener('click', event => {
  const button = event.target.closest('.sample-next');
  if (!button) return;
  currentSample = drawSample();
  button.closest('.opening-sample').outerHTML = openingSample();
  main.querySelector('.sample-next').focus({ preventScroll: true });
});
document.querySelector('header').addEventListener('click', event => {
  if (location.hash === '#home' && event.target.closest('a[href="#home"]') &&
      !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
    event.preventDefault();
    currentSample = null;
    render();
  }
});
window.addEventListener('hashchange',()=>{render();main.focus({preventScroll:true})});beginReading();
