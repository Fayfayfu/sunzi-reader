// Entries follow the four source paragraphs and their reading groups.
// Each note is [headword, optional contextual pinyin, editorial definition].
const shijiWords = [
  [
    [['兵','','这里指用兵、兴师作战。'],['察','','审慎考察。下文的“五事”就是考察的内容。']],
    [['经','','衡量、考察。'],['校','jiào','比较。将敌我双方的情况放在一起衡量。'],['索其情','','探明双方的实际情况。“情”指实情。']]
  ],
  [
    [['同意','','这里是心意相同，指百姓与君主同心。']],
    [['时制','','四时变化对用兵的影响，如寒暑、季节是否合宜。'],['险易','','地形险阻或平坦。'],['广狭','guǎng xiá','地势宽阔或狭窄。']],
    [['信','','守信，说到做到。'],['曲制','qū zhì','军队的编组和节制办法。“曲”指军中的编制单位。'],['官道','','将吏的职掌、办事规制。此词古注有不同理解，可对照下方旁注。'],['主用','','军费、粮草、器械等的掌管和使用。'],['部曲','bù qū','叶译用词，此处指按隶属关系编成的军队单位。']],
    [['莫不闻','','没有谁没听说过。“闻”是听说，与下文真正懂得这些条件的“知”相对。']],
    [['七计','','下文用七个问题比较敌我双方的条件。'],['校','jiào','比较、衡量。'],['孰','shú','谁、哪一方。七个问句都在比较敌我。'],['练','','训练有素。这里问哪方士卒更熟悉号令和进退。'],['明','','分明。这里问两军相比，谁能做到赏罚分明。']]
  ],
  [
    [['将听吾计','','“将”有两种读法：读 jiāng，可把整句理解为“若听从我的计策”；读 jiàng，则指听取计策的将领。读法不同，后面的去留也有不同解释。'],['祗','zhī','叶译用字。“祗得”就是“只得、只好”。'],['裨将','pí jiàng','李氏旁注中的称呼，指辅佐主将的副将。']],
    [['佐','zuǒ','辅助。'],['势','','这里指临阵时可以利用或造成的有利形势。'],['因利而制权','','“因”是顺着、凭借；“权”指灵活应变。整句说，要根据眼前的有利条件决定怎样行动。']],
    [['诡道','guǐ dào','用兵时迷惑敌人的做法。'],['示之','','做给敌方看，使对方形成某种判断。']],
    [['诱','yòu','引诱，引使敌方采取行动。'],['实','','敌军兵力充实、防备稳固。'],['避之','','避开对方的强处。'],['乘隙','chéng xì','叶译用词。趁对方出现空当时行动。']],
    [['挠','náo','扰乱，使对方受挫。“怒而挠之”如何下手，叶、李的解释略有不同。'],['卑','bēi','这里指我方故意示弱，使对方骄傲。'],['佚','yì','安闲。指敌军得到休整，还没有疲劳。'],['劳之','','使敌人疲劳。“劳”在此是使动用法。'],['亲','','敌方内部亲近、团结。'],['忿','fèn','叶译的“忿怒”，即气愤、恼怒。']],
    [['无备','','没有防备的地方或时机。'],['不意','','对方没有料到。'],['懈','xiè','叶译用字，指松懈、疏于防备。'],['传','chuán','传授、告知。如何临敌制胜，无法事先一一说定；另有不得泄密的读法。']]
  ],
  [
    [['夫','fú','放在句首，引出下面的议论。'],['庙算','miào suàn','出兵以前，在庙堂上筹划并估量双方胜算。'],['得算多','','战前筹划时，预料有把握取胜之处多。叶译着眼于筹划是否周密。']],
    [['况于','','何况，表示再进一层。'],['见','xiàn','这里可按“显现”来读，即胜负的趋势已经显明。叶译作“我预先可以知道了”。'],['矣','yǐ','句末语气词，这里表示已经可以作出判断。']]
  ]
];

// Split at comparison boundaries without splitting the ruby or gloss wrapper.
function comparisonSlice(text,start,end,ranges){
  if(!ranges.length) return esc(text.slice(start,end));
  const cuts=new Set([start,end]);
  for(const r of ranges) for(const pos of [r.start,r.end]) if(start<pos && pos<end) cuts.add(pos);
  const points=[...cuts].sort((a,b)=>a-b);
  return points.slice(1).map((stop,i)=>{
    const from=points[i], ids=ranges.filter(r=>r.start<=from && stop<=r.end).map(r=>r.key);
    const value=esc(text.slice(from,stop));
    return ids.length?'<span data-note-range="'+ids.join(' ')+'"'+(ids.some(key=>key.startsWith('c'))?' data-classic-range':'')+'>'+value+'</span>':value;
  }).join('');
}
function withWordReadings(text, entries, targets=[], ranges=[]) {
  // Match the unescaped text. On the annotated source, mark every occurrence
  // but show pinyin only on first mention, as in the original reading layout.
  const marks=[];
  entries.forEach(([word,sound],key)=>{
    const linked=targets[key];
    if(!linked && !sound) return;
    let first=true;
    for(let at=text.indexOf(word); at>=0; at=text.indexOf(word,at+word.length)){
      marks.push({word,sound:first?sound:'',at,key,linked});
      if(!linked) break;
      first=false;
    }
  });
  marks.sort((a,b)=>a.at-b.at || b.word.length-a.word.length);
  let html='', end=0;
  for(const {word,sound,at,key,linked} of marks){
    if(at<end) continue;
    const base=comparisonSlice(text,at,at+word.length,ranges);
    const label=sound?'<ruby>'+base+'<rp>（</rp><rt>'+esc(sound)+'</rt><rp>）</rp></ruby>':base;
    html+=comparisonSlice(text,end,at,ranges)+(linked?'<span class="source-term" data-source-key="'+key+'">'+label+'</span>':label);
    end=at+word.length;
  }
  return html+comparisonSlice(text,end,text.length,ranges);
}

function wordGloss(entries) {
  const titles=entries.map(([word],k)=>'<span data-gloss-key="'+k+'">'+esc(word)+'</span>').join('、');
  const definitions=entries.map(([word,sound,meaning],k)=>'<div tabindex="0" data-gloss-key="'+k+'"><dt>'+esc(word)+(sound?' <small>'+esc(sound)+'</small>':'')+'</dt><dd>'+esc(meaning)+'</dd></div>').join('');
  return '<details class="word-gloss"><summary><strong>字词注释</strong><span>'+titles+'</span></summary><dl>'+definitions+'</dl></details>';
}

// Each contrast group is its own scope: two identical words in different
// groups never light up together. Re-rendering a chapter drops all listeners.
function bindGlossHighlights() {
  document.querySelectorAll('.named-pair').forEach(pair=>{
    const gloss=pair.querySelector('.word-gloss');
    if(!gloss) return;
    const terms=pair.querySelectorAll('[data-source-key]');
    let hovered=null,focused=null;
    function paint(){
      const key=(hovered||focused)?.dataset.glossKey;
      terms.forEach(term=>term.classList.toggle('gloss-lit',term.dataset.sourceKey===key));
    }
    function entry(el){return el?.closest?.('[data-gloss-key]')||null}
    gloss.addEventListener('pointerover',e=>{
      if(e.pointerType==='touch') return;
      hovered=entry(e.target);paint();
    });
    gloss.addEventListener('pointerout',e=>{
      if(e.pointerType==='touch') return;
      hovered=gloss.contains(e.relatedTarget)?entry(e.relatedTarget):null;paint();
    });
    gloss.addEventListener('focusin',e=>{
      focused=e.target.matches(':focus-visible')?entry(e.target):null;paint();
    });
    gloss.addEventListener('focusout',()=>{focused=null;paint()});
    gloss.addEventListener('toggle',()=>{
      if(!gloss.open){focused=null;if(hovered && !hovered.closest('summary')) hovered=null;paint()}
    });
  });
}
