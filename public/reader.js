const annotations = [...commentary1, ...commentary2, ...commentary3, ...commentary4];
const commentSources = [
  ['《十一家注孙子·计篇》','https://zh.wikisource.org/zh-hans/十一家注孫子/計篇'],
  ['《十一家注孙子·作战》','https://zh.wikisource.org/zh-hans/十一家注孫子/作戰篇'],
  ['《十一家注孙子·谋攻篇》','https://zh.wikisource.org/zh-hans/十一家注孫子/謀攻篇'],
  ['《十一家注孙子·形篇》','https://zh.wikisource.org/zh-hans/十一家注孫子/形篇'],
  ['《孙子集注·势篇》','https://ctext.org/wiki.pl?chapter=346190&if=en&remap=gb'],
  ['《孙子集注·虚实》','https://ctext.org/wiki.pl?chapter=189452&if=gb'],
  ['《孙子注解·军争》','https://www.shidianguji.com/zh/book/DZ1180/chapter/DZ1180_12'],
  ['《孙子注解·九变》','https://ctext.org/wiki.pl?chapter=629402&if=en'],
  ['《孙子注解·行军》','https://ctext.org/wiki.pl?chapter=91474&if=en&remap=gb'],
  ['《孙子注解·地形》','https://ctext.org/wiki.pl?chapter=244895&if=gb&remap=gb'],
  ['《孙子注解·九地》','https://ctext.org/wiki.pl?chapter=968124&if=en&remap=gb'],
  ['《孙子注解·火攻》','https://ctext.org/wiki.pl?chapter=182307&if=gb'],
  ['《孙子注解·用间》','https://ctext.org/wiki.pl?chapter=798494&if=gb']
];
const readingChecks = [
  ['如果已经记住五事，为什么还要问七个“孰”？','“孰”要求把双方放在同一问题下比较。只知道我方善于训练，并不能据此说明我方比对方练得更好。'],
  ['为什么作战成本要一直追到百姓家中？','前线的物资从别处运来，运输、征发和附近物价都把负担传到后方。仅列军队账上的开支，就会漏掉原文用来判断久战之害的一大部分。'],
  ['攻城即使成功，怎样仍可能低于“全”的标准？','攻城准备和强攻都会消耗士卒，城池本身也可能受到破坏。判断一种手段要同时算到手的目标和为它耗掉的东西。'],
  ['能使己方不易被击败，为什么还说“可胜在敌”？','整顿自己的防守可以由己方着手，却不能强迫对方出现弱点。等待不是闲置，而是防备自己、观察敌人，识别条件已经改变的时刻。'],
  ['水能漂石、猛禽能制物，两个譬喻各讲什么？','水流的力量来自形成的势，猛禽的打击还需动作节奏短促准确。前者着眼力量如何蓄成，后者着眼何时、怎样释放。'],
  ['“无所不备，则无所不寡”怎样推出来？','需要防备的地点越多，同一总量的兵力就越分散。我方若能选定交手的一处集中兵力，战场局部的众寡可以不同于双方总人数。'],
  ['为什么“先到”还要追问“谁到了”？','急行会把强壮者与疲弱者拉开，也可能丢下辎重。先头部队到了但队伍分散、物资未至，未必取得可以利用的先机。'],
  ['为什么“知地形”仍可能“不能得地之利”？','知道地形特征还须随处境权衡进退。将帅若把既定任务、路线或性情当作必须执行的动作，就会错过利与害已经变化的事实。'],
  ['为什么末尾转向平时怎样行令？','看到征候之后还得让自己的队伍按判断行动。平时命令能否执行、士卒是否信服，决定临阵号令能不能转化为一致行动。'],
  ['地形不利和将帅失职怎样区分？','先问往返、距离、阻隔给行动带来什么限制，再问编组、训练、指挥是否失当。篇中分别列出地形与败因，提醒将帅别把组织问题都归咎于地势。'],
  ['把“争地”简单理解成一定要攻，占了哪个便宜又漏了哪个条件？','争地因双方得到都有利而得名，但要看谁已先据有利位置，以及强攻要付什么代价。分类告诉人利之所在，仍需判断如何行动。'],
  ['火已烧起来，为什么“待而勿攻”？','敌军没有因此失序，说明预想的可乘之机尚未出现。要等火势与敌情明朗，再决定能否跟进。'],
  ['三个人转述相同的敌情，算几条消息来源？','先追问三人各自如何得知。第四段反复说“因是而知之”，多条渠道可能依赖同一个反间。若三个说法都源于一人，增加的是传递次数，未增加独立见闻。']
];
const yePDF = 'https://upload.wikimedia.org/wikipedia/commons/1/13/SSID-13420140_白話譯解_孫子兵法_卷上.pdf';
const yeEditions = [
  {chapter:'计篇', key:'ji', first:33, anchor:'始计第一', words:shijiWords, li:'https://www.leeyuri.org/Simplified/Sc1.pdf'},
  {chapter:'作战篇', key:'zuozhan', first:53, anchor:'作战第二', words:zuozhanWords, li:'https://www.leeyuri.org/Simplified/Sc2.pdf'},
  {chapter:'谋攻篇', key:'maogong', first:86, anchor:'谋攻第三', words:maogongWords, li:'https://www.leeyuri.org/Simplified/Sc3.pdf'},
  {chapter:'军形篇', key:'junxing', first:105, anchor:'军形第四', words:junxingWords, translationSounds:[['髣髴','fǎng fú']], li:'https://www.leeyuri.org/Simplified/Sc4.pdf'},
  ...furtherEditions
];
function external(url, label) {
  return `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(label)}</a>`;
}
function yeCredit(i) {
  const edition=yeEditions[i];
  const {chapter,key,first,anchor,li}=edition;
  const pages=edition.pages || [first,first+1];
  const book=edition.book || '上';
  const commentary=edition.commentary;
  const classicalName=commentary?.chapter || (i===3?'形篇':chapter);
  const primary=commentary?.url || commentSources[i][1];
  const notes=annotations[i].flatMap(part=>Object.values(part.variants));
  const liPages=[...new Set(notes.map(v=>v.page))].sort((a,b)=>a-b);
  const volume=numerals[i];
  const scan4='https://zh.wikisource.org/wiki/Page:Sibu_Congkan0339-吉天保-孫子集注-4-1.djvu/';
  const refs=external('https://www.zdic.net/hans/'+(['挠','楯','轒辒','镒','碫','佚','蹶','圮','蘙','怼','衢','轸','诳'][i]),'汉典');
  return `<div class="edition edition-credit ye-credit"><strong>本篇所据版本</strong>
    <p>白话取自叶玉麟选译、叶慧晓校勘《白话译解 孙子兵法》卷${book}，广益书局 1943 年本。《${chapter}》篇末“解”见原书第 ${pages[0]}–${pages.at(-1)} 页。本站转为简体，按原文分组，调整标点。</p>
    ${i===1?'<p>校记：第 53 页“力屈□尽”中有一字影印不清，以“□”标出；同页“长毂车”的“毂”亦不清晰，暂依上下文辨读。</p>':''}
    ${i===2?`<p>校记：本站原文作“少则能守之”。叶书${external(yePDF+'#page=73','原书第 71 页')}作“少则能逃之”，所以第 87 页的叶译说兵少时“则逃去勿与决战”。</p>`:''}
    ${i===3?'<p>校记：叶书第 105 页先解释篇名，本站译文从该页第二个“解”起。第 106 页“再□伺敌人的虚懈”，“伺”前一字未能辨清，保留作“□”。镒与铢的折算照录叶书。</p>':''}
    ${edition.notes?.map(note=>`<p>校记：${esc(note)}</p>`).join('') || ''}
    <p>古文取自${external('https://zh.wikisource.org/zh-hans/孙子兵法#'+anchor,'维基文库《孙子兵法·'+anchor+'》')}，与叶书用字偶有不同。“两译对读”是本站对李浴日《孙子兵法新研究·${anchor}》的转述，并非李氏译文引录。篇章导读与段解由本站编写。</p>
    <p>字词注释由本站编写，释义参看${external(primary,'《十一家注孙子·'+classicalName+'》')}；读音参看${external('https://dict.revised.moe.edu.tw','《重编国语辞典修订本》')}与${refs}。${commentary?`本篇多音字另参${external('https://www.leeyuri.org/Daxi-8S-YinZhu.pdf','《音注武经七书·孙子》')}。`: ''}</p>
    <p>古注对读据${external(primary,'《十一家注孙子》卷'+(commentary?.volume || '上')+'《'+classicalName+'》')}逐条录出曹操、杜牧署名的注文，按本站简体正文对应到句，另参校${external(commentary?.checkUrl || ('https://zh.wikisource.org/zh-hans/孫子集注_(四部叢刊本)/卷第'+volume),'《孙子集注》（四部丛刊本）卷'+volume)}。合署依底本标明，各条白话由本站编写。</p>
    ${i===3?`<p>古注参校本卷四见第一册影印${external(scan4+'172','第 172 页（卷首）')}至${external(scan4+'205','第 205 页（卷末）')}。“不可胜在己”下曹注开头的“守固备也”，见《十一家注》，四部丛刊本此处没有这四字。</p>`:''}
    ${commentary?.scan?`<p>古注参校本在第 ${commentary.scan.book} 册影印${external(commentary.scan.firstURL,'第 '+commentary.scan.first+' 页')}至${external(commentary.scan.lastURL,'第 '+commentary.scan.last+' 页')}。${esc(commentary.notes || '')}</p>`:''}
    <div class="source-folio">叶译影印　${pages.map(page=>external('art/sources/ye-'+key+'-'+page+'.webp','原书第 '+page+' 页')).join(' · ')}　${external((edition.url || yePDF)+'#page='+(edition.pdfPages?.[0] || first+2),'完整'+book+'卷 PDF ↗')}</div>
    <div class="source-folio">李浴日旁注所据电子本　${liPages.map(page=>external(li+'#page='+page,(i>0?notes.filter(v=>v.page===page).map(v=>v.word).join('、')+'，':'')+'第 '+page+' 页')).join(' · ')}</div></div>`;
}
function comparisonPlan(part) {
  const groups=part.lines.map(()=>({ranges:[],notes:[],li:[]}));
  function mark(row,label,key) {
    const src=part.lines[row][0], [first,last=first]=label.split('……');
    const start=src.indexOf(first), stop=src.indexOf(last,start);
    if(start>=0 && stop>=0) groups[row].ranges.push({key,start,end:stop+last.length});
  }
  for(const [row,v] of Object.entries(part.variants)) {
    // A joint title can refer to disjoint words, e.g. 留之、去之.
    const terms=part.lines[row][0].includes(v.word)?[v.word]:v.word.split('、');
    terms.forEach((word,i)=>{
      const key='l'+row+'-'+i;
      groups[row].li.push({word,key});
      mark(row,word,key);
    });
  }
  (part.comparisons||[]).forEach((c,i)=>{
    const row=c.row ?? part.lines.findIndex(([src])=>src.includes(c.phrase)),key='c'+i;
    if(row<0) return;
    groups[row].notes.push(compareNotes(c,key));
    mark(row,c.highlight || c.label || c.phrase,key);
    if(row>0 && c.previousHighlight) mark(row-1,c.previousHighlight,key);
  });
  return groups;
}
function compareNotes(comparison,key) {
  const columns=comparison.notes.map(note=>`<div class="classic-note">
    <h5>${esc(note.author)}注${note.shared?`<small>${esc(note.shared)}</small>`:''}</h5>
    <p class="note-quotation">${esc(note.quote)}</p>
    <p class="note-paraphrase"><b>白话</b>${esc(note.plain)}</p>
  </div>`).join('');
  return `<details class="note-comparison" data-note-target="${key}">
    <summary><strong>古注对读</strong><span>${esc(comparison.label || comparison.phrase)}</span></summary>
    ${comparison.sourcePhrase?`<p class="variant-wording">${esc(comparison.sourcePhrase)}</p>`:''}
    <div class="note-columns">${columns}</div>
  </details>`;
}
function yePassage(i,part,j) {
  const edition=yeEditions[i];
  const plan=comparisonPlan(part);
  const straight=[];
  const pairs=part.lines.map(([src,tr],k)=>{
    const words=edition.words[j][k];
    const v=part.variants[k];
    // Prefer the classical original; glosses of Ye or Li point to that text instead.
    const where=words.map(([word])=>src.includes(word)?0:tr.includes(word)?1:2);
    const renderWords=(text,source)=>withWordReadings(text,source===1 && edition.translationSounds?[...words,...edition.translationSounds]:words,where.map(n=>n===source),source===0?plan[k].ranges:[]);
    const original=renderWords(src,0);
    straight.push(`<span id="straight-${j+1}-${k+1}" data-pair-id="sentence-${j+1}-${k+1}">${original}</span>`);
    const margin=v?`<details class="li-margin" data-note-target="${plan[k].li.map(t=>t.key).join(' ')}">
      <summary><strong>两译对读</strong><span>${plan[k].li.map(t=>'<span data-note-target="'+t.key+'">'+esc(t.word)+'</span>').join('、')}</span></summary>
      <div class="li-body"><p>${renderWords(v.text,2)}</p>${i===0?external(edition.li+'#page='+v.page,'李浴日《孙子兵法新研究·始计第一》，电子本第 '+v.page+' 页 ↗'):''}</div>
    </details>`:'';
    const comparison=plan[k].notes.join('');
    return `<div class="line-pair named-pair" id="sentence-${j+1}-${k+1}"><p class="original">${original}</p><p class="translation">${renderWords(tr,1)}</p>${words.length?wordGloss(words):''}${margin}${comparison}</div>`;
  }).join('');
  return `<section class="passage edition-passage" id="passage-${j+1}"><div class="phead"><span>第 ${num(j)} 段</span><h3>${esc(part.title)}</h3></div><div class="parallel">${pairs}</div><p class="straight" hidden>${straight.join('')}</p>${part.note?`<div class="marginal"><strong>段解</strong><p>${esc(part.note)}</p></div>`:''}</section>`;
}
function referenceLinks(i) {
  if(yeEditions[i]) return '';
  const [name,url]=commentSources[i];
  return `<div class="edition edition-credit"><strong>这一篇的文字从哪里来</strong><p>古文及分段取自<a href="https://zh.wikisource.org/zh-hans/孙子兵法#${lessons[i][0]}第${numerals[i]}" target="_blank" rel="noopener">维基文库《孙子兵法》</a>。白话译文和段解由 AI（Codex）编写。释义参看<a href="${url}" target="_blank" rel="noopener">${name}</a>；段解中署名的意见，是对注家读法的转述。</p></div>`;
}
function passage(i, part, j) {
  if(yeEditions[i]) return yePassage(i,part,j);
  const pairs=part.lines.map(([src,translation])=>`<div class="line-pair"><p class="original">${esc(src)}</p><p class="translation">${esc(translation)}</p></div>`).join('');
  return `<section class="passage" id="passage-${j+1}"><div class="phead"><span>第 ${num(j)} 段</span><h3>${esc(part.title)}</h3></div><div class="parallel">${pairs}</div><p class="straight" hidden>${esc(classic[i][j])}</p><div class="marginal"><strong>段解</strong><p>${esc(part.note)}</p></div></section>`;
}
function localContents(i) {
  return annotations[i].map((p,j)=>`<a href="${link(i)}/p/${j+1}"><small>${num(j)}</small><span>${esc(p.title)}</span></a>`).join('');
}
function annotatedReading(i) {
  const parts=annotations[i], units=parts.reduce((sum,p)=>sum+p.lines.length,0);
  return `${referenceLinks(i)}<div class="chapter-argument"><strong>${yeEditions[i]?'本站导读':'篇章脉络'}</strong><p>${chapterOverviews[i]}</p></div><details class="in-page"><summary>本篇段落索引 · ${parts.length} 段</summary><nav aria-label="本篇段落">${localContents(i)}</nav></details><div class="study-head"><div><div class="eyebrow">TEXT &amp; COMMENTARY</div><h2>逐段讲读</h2><span>${parts.length} 段原文 · ${units} 组对照</span></div><div class="view-buttons" aria-label="阅读方式"><button data-reading="paired" aria-pressed="true">${yeEditions[i]?'原文与叶译':'原文与讲解'}</button><button data-reading="plain" aria-pressed="false">只读原文</button></div></div><div id="passages">${parts.map((p,j)=>passage(i,p,j)).join('')}</div>
  <div class="recall"><strong>合卷自问</strong><p>${readingChecks[i][0]}</p><details><summary>对照参考思路</summary><p>${readingChecks[i][1]}</p></details></div>`;
}
let plainReading = false;
function bindComparisonHighlights() {
  const root=document.querySelector('#passages');
  if(!root) return;
  let hover=null,focus=null,active=null,lit=[];
  function target(el){return el?.closest && !el.closest('a')?el.closest('[data-note-target]'):null}
  function paint(){
    const next=hover||focus;
    if(active===next) return;
    lit.forEach(el=>el.classList.remove('note-lit','classic-lit'));
    active=next;
    // Keys are local to one passage; a shared note may reach the preceding line.
    const section=active?.closest('.edition-passage');
    const ids=active?.dataset.noteTarget.split(' ')||[];
    lit=section?[...section.querySelectorAll('.original [data-note-range]')].filter(el=>
      el.dataset.noteRange.split(' ').some(key=>ids.includes(key))):[];
    const colorClass=active?.closest('.note-comparison')?'classic-lit':'note-lit';
    lit.forEach(el=>el.classList.add(colorClass));
  }
  root.addEventListener('pointerover',e=>{
    if(e.pointerType!=='touch'){hover=target(e.target);paint()}
  });
  root.addEventListener('pointerout',e=>{
    if(e.pointerType!=='touch'){hover=target(e.relatedTarget);paint()}
  });
  root.addEventListener('focusin',e=>{
    focus=e.target.matches(':focus-visible')?target(e.target):null;
    if(focus) hover=null;
    paint();
  });
  root.addEventListener('focusout',()=>{focus=null;paint()});
}
function bindSourceNotes() {
  const root = document.getElementById('passages');
  const isClassic = key => key.startsWith('c');
  const keysOf = range => (range?.dataset.noteRange || '').split(' ').filter(isClassic);
  const terms = root.querySelectorAll('.original [data-source-key], .straight [data-source-key]');
  const ranges = root.querySelectorAll('.original [data-note-range], .straight [data-note-range]');
  const makeTrigger = element => {
    element.setAttribute('role', 'button');
    element.tabIndex = 0;
    element.title = '展开对应注解';
  };
  terms.forEach(makeTrigger);
  ranges.forEach(range => {
    if (keysOf(range).length && !range.closest('[data-source-key]')) makeTrigger(range);
  });

  let marked = null;
  let timer = 0;
  function openNotes(event) {
    const trigger = event.target.closest('[role="button"]');
    if (!trigger || !root.contains(trigger)) return;
    if (event.type === 'keydown') {
      if (!['Enter', ' '].includes(event.key)) return;
      event.preventDefault();
    } else if (window.getSelection()?.type === 'Range') {
      return;
    }

    const straight = trigger.closest('[data-pair-id]');
    const pair = straight ? document.getElementById(straight.dataset.pairId) : trigger.closest('.named-pair');
    const glossKey = trigger.dataset.sourceKey;
    const exactRange = event.target.closest('[data-note-range]');
    // Clicking a constituent character follows its own range. Activating the
    // complete headword (keyboard or ruby reading) follows the whole word.
    const rangesAtPoint = exactRange ? [exactRange] : [...trigger.querySelectorAll('[data-note-range]')];
    const classicKeys = new Set(rangesAtPoint.flatMap(keysOf));
    const definition = glossKey === undefined ? null :
      pair.querySelector('.word-gloss dl [data-gloss-key="' + glossKey + '"]');
    if (definition) definition.closest('details').open = true;
    pair.closest('.edition-passage').querySelectorAll('.note-comparison').forEach(note => {
      if (classicKeys.has(note.dataset.noteTarget)) note.open = true;
    });
    clearTimeout(timer);
    marked?.classList.remove('opened-definition');
    marked = definition;
    if (marked) {
      marked.classList.add('opened-definition');
      timer = setTimeout(() => marked?.classList.remove('opened-definition'), 2200);
    }
    if (straight) {
      document.querySelector('[data-reading="paired"]').click();
      pair.querySelector('.original').scrollIntoView({block:'start'});
      const corresponding = [...pair.querySelectorAll('.original [role="button"]')][
        [...straight.querySelectorAll('[role="button"]')].indexOf(trigger)];
      corresponding?.focus({preventScroll:true});
    }
  }
  root.addEventListener('click', openNotes);
  root.addEventListener('keydown', openNotes);
}

function bindReadingMode() {
  bindGlossHighlights();
  bindComparisonHighlights();
  bindSourceNotes();
  document.querySelectorAll('[data-reading]').forEach(button=>button.onclick=()=>{
    const plain=button.dataset.reading==='plain';
    plainReading=plain;
    document.querySelectorAll('.parallel, .marginal').forEach(el=>el.hidden=plain);
    document.querySelectorAll('.straight').forEach(el=>el.hidden=!plain);
    document.querySelectorAll('[data-reading]').forEach(b=>b.setAttribute('aria-pressed',b===button));
  });
  if(plainReading) document.querySelector('[data-reading=plain]').click();
}
