'use strict';

// The four branches reuse the catalogue divisions. Transitions and trails are editorial readings.
const mapQuestions = ['仗该不该打，怎样才算胜？','胜势怎样形成，又在何处发挥？','军队到了现场，怎样随处境而变？','何时可动手，凭什么知敌情？'];
const mapChapters = [
  ['比较双方','而索其情'],
  ['算久战之费','兵贵胜'],
  ['权衡全与破','不战而屈'],
  ['先立于不败','先为不可胜'],
  ['让众人合力','求之于势'],
  ['使敌分我专','我专而敌分'],
  ['争先亦有危','军争为利'],
  ['利害要兼看','必杂于利害'],
  ['从征候察敌','尘高而锐'],
  ['辨地形与败因','地形者'],
  ['因处境合众','率然者'],
  ['火起仍须待','主不可以怒'],
  ['向知情人求证','必取于人']
];
const mapTransitions = [
  '《始计》把敌我放在一起比较。《作战》接着追问：即使胜算在我，粮草要运多远，百姓能支撑多久？',
  '既然久战会耗尽国力，怎样取得所求又少受损失？《谋攻》把“全”放在“破”之前，再比较伐谋、伐交、伐兵与攻城。',
  '《谋攻》讨论用什么手段取胜。《军形》把目光收回己方：有些败因可以先消除，敌人何时露出破绽，却不能由我决定。',
  '《军形》先讲怎样立于不败。《兵势》转向一支军队内部：怎样编组、发令、配合奇正，让许多人在合适的一刻一齐用力？',
  '《兵势》用滚石说明蓄成的力量。《虚实》再问这股力量落在哪里：敌军若须处处防备，我军能否集中在一处？',
  '《虚实》讲选择交手的时地。《军争》把这个选择放回行军途中：争先的人到了，粮草和其余部队跟得上吗？',
  '《军争》列出不宜逼迫或追击的情形。《九变》把这种判断推得更远：有路却不走，有城却不攻，各要看什么条件？',
  '《九变》要求随条件改变办法。《行军》让读者看到条件从何处辨认：水势、扬尘、言辞、赏罚，都是可以观察的征候。',
  '《行军》从驻地和眼前迹象察敌。《地形》比较同一片地势对进退双方的不同影响，还把将帅自身造成的失败单列出来。',
  '《地形》问道路是否通畅、进去能否退回。《九地》又添一层：即使地貌相似，深入敌境的程度和退路不同，也会改变士卒的行动。',
  '《九地》考察军队处在怎样的局面。《火攻》换到一种具体手段：即使火已经烧起来，还得看敌军是否动乱，决定是否跟进。',
  '《火攻》要求看清情形才动手。《用间》接着追问，我们凭什么知道敌情？观察火势可以用眼，敌方内部的事情则要找到知情的人。'
];
const mapTrails = [
  ['敌我之情从哪里知道','从比较双方，到确定要知道什么，再到追问消息从谁而来。',[[1,'而索其情','该比较什么'],[3,'知彼知己','哪一方还不了解'],[13,'必取于人','谁能提供敌情']]],
  ['一支军队怎样形成优势','先辨哪些条件由己方掌握，再看如何合力，以及在哪一处用力。',[[4,'先为不可胜','先使自己稳固'],[5,'求之于势','让组织形成力量'],[6,'我专而敌分','在一处改变众寡']]],
  ['同一条路，对谁有利','强行军有先到的好处，也有掉队的风险。地形限制进退，深入的程度又会改变士卒的心态。',[[7,'军争为利','算抵达的代价'],[10,'地形者','看双方的进退'],[11,'深则专，浅则散','看部队的处境']]],
  ['有胜算，就一定要打吗','把战争的耗费、所得能否保全、动兵的理由放在一起衡量。',[[2,'兵贵胜','久战会耗掉什么'],[3,'不战而屈','胜后还能保全什么'],[12,'不合于利而止','该在何处停手']]]
];

function mapSource(chapter, phrase) {
  for (const [part, passage] of annotations[chapter-1].entries()) {
    const row = passage.lines.findIndex(([original])=>original.includes(phrase));
    if (row>=0) return {text:passage.lines[row][0],translation:passage.lines[row][1],href:link(chapter-1)+'/p/'+(part+1)+'/s/'+(row+1),part:part+1};
  }
  throw new Error('Missing map passage: '+phrase);
}
// Each link explains the change of question between the last and first
// chapters of two consecutive groups. The sequence is a reading aid.
const groupLinks = [
  '选定求胜之法，还得先消除己方的败因。',
  '选好了交手之地，还要让人马粮草及时赶到。',
  '处境决定用兵之法；即使火已烧起，也要看敌情再行动。'
];
const stageScenes = ['案前议图','临崖蓄势','临流择路','隔水察火'];
function stagePainting(group) {
  return `<img class="stage-art" src="art/stages/${num(group)}.webp" width="768" height="512" alt="${stageScenes[group]}">`;
}
function branchNodes(group,selected) {
  const chapters=lessons.map((_,i)=>i).filter(i=>groupOf(i)===group);
  const leaves=chapters.map(i=>`<li><a class="map-leaf" href="#map/${i+1}" title="${mapChapters[i][0]}" ${selected===i+1?'aria-current="page"':''}>${lessons[i][0]}</a></li>`).join('');
  const last=chapters.at(-1);
  const connection=groupLinks[group] ? `<div class="group-link"><span class="link-line" aria-hidden="true"></span><div><small>${lessons[last][0]} → ${lessons[last+1][0]}</small><p>${groupLinks[group]}</p></div></div>` : '';
  return `<li class="map-stage"><div class="map-stage-content">${stagePainting(group)}<div class="stage-heading"><span class="stage-number">${num(group)}</span><h3>${groups[group]}</h3></div>
    <div class="stage-body"><p class="stage-question">${mapQuestions[group]}</p><ul>${leaves}</ul></div></div>${connection}</li>`;
}
function chapterLens(n) {
  const i=n-1;
  const source=mapSource(n,mapChapters[i][1]);
  const bridge = (label,idx,text)=>`<div><a href="#map/${idx+1}"><small>${label}</small><strong>${lessons[idx][0]}篇</strong><span aria-hidden="true">↗</span></a><p>${text}</p></div>`;
  return `<article class="map-lens" id="chapter-lens" aria-label="篇章详读" tabindex="-1">
    <div class="map-folio"><span>篇章详读</span><i></i><span>${num(i)} / 13</span></div>
    <div class="map-lens-head"><div><small>第${numerals[i]}篇 · ${groups[groupOf(i)]}</small><h2>${lessons[i][0]}篇</h2></div><span class="map-seal" aria-hidden="true">孙子</span></div>
    <div class="map-evidence"><small>原典选读</small><blockquote>${esc(source.text)}</blockquote><a href="${source.href}">到第 ${source.part} 段读原文与注解 <span aria-hidden="true">→</span></a></div>
    <h3>${lessons[i][1]}</h3><p class="lens-overview">${chapterOverviews[i]}</p>
    <div class="map-bridges">${i>0?bridge('承接上篇',i-1,mapTransitions[i-1]):''}${i<12?bridge('读到下篇',i+1,mapTransitions[i]):''}</div>
    <a class="lens-return" href="#map">回到全图 ↑</a></article>`;
}
function trailRows(){
  return mapTrails.map(([name,why,steps],i)=>`<details class="map-trail"><summary><small>${num(i)}</small><strong>${name}</strong><span class="trail-route">${steps.map(([n])=>lessons[n-1][0]).join(' · ')}</span></summary><div class="trail-body"><p>${why}</p><ol>${steps.map(([n,phrase,label])=>`<li><a href="${mapSource(n,phrase).href}"><strong>${lessons[n-1][0]}篇</strong> · ${label} ↗</a></li>`).join('')}</ol></div></details>`).join('');
}
function bookMap(selected) {
  const active=selected || 1;
  return `<header class="map-heading"><div class="atlas-kicker">孙子十三篇 <b>/</b> 研读图谱</div><h1>全书脉络</h1><p>沿着四组问题读十三篇，点篇名看原文与前后联系。</p></header>
    <div class="atlas-spread">
      <section class="map-diagram" aria-label="十三篇的四组承接图"><div class="map-root"><h2>十三篇怎样接起来</h2><small>本站导读</small></div>
      <ol class="map-path">${groups.map((_,g)=>branchNodes(g,active)).join('')}</ol><p class="map-caption">篇序沿用原书；分组和箭头说明的是一种串读思路。</p></section>
      ${chapterLens(active)}
    </div>
    <section class="map-trails"><div class="map-trails-head"><span class="atlas-kicker">专题串读</span><h2>循一个问题，跨篇读</h2></div><div class="trail-list">${trailRows()}</div></section>`;
}

let mapPick=false;
document.addEventListener('click',event=>{
  const leaf=event.target.closest('a.map-leaf');
  if(!leaf || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  if(leaf.hash===location.hash) document.getElementById('chapter-lens')?.scrollIntoView();
  else mapPick=true;
});
