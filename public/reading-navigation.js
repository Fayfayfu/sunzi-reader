'use strict';

const readingPositionKey = 'sunzi.reading-position.v1';
let activeReading = null;
let memoryPosition = null;
let firstReaderRender = true;

function savedPosition() {
  if (signedReader) return memoryPosition;
  let point = memoryPosition;
  try {
    point = JSON.parse(localStorage.getItem(readingPositionKey)) || point;
  } catch {}
  if (!point || !Number.isInteger(point.chapter) || !annotations[point.chapter]) return null;
  const part = Number.isInteger(point.part) && annotations[point.chapter][point.part - 1] ? point.part : 0;
  return { chapter: point.chapter, part };
}

function resumeLink() {
  const point = savedPosition();
  return point ? link(point.chapter) + (point.part ? '/p/' + point.part : '') : link(last ?? 0);
}

function resumeLabel() {
  const point = savedPosition();
  const chapter = point?.chapter ?? last;
  if (chapter === null) return '开始研读';
  return '继续研读 · ' + lessons[chapter][0] + (point?.part ? ' · 第 ' + point.part + ' 段' : '');
}

function recordPart(part) {
  const reading = activeReading;
  if (!reading || reading.part === part || document.visibilityState === 'hidden') return;
  reading.part = part;
  memoryPosition = { chapter: reading.chapter, part };
  if (signedReader) {
    sendProgress({kind:'position', ...memoryPosition});
    return;
  }
  try {
    localStorage.setItem(readingPositionKey, JSON.stringify(memoryPosition));
    sessionStorage.setItem(readingPositionKey, JSON.stringify({ ...memoryPosition, route: location.hash }));
  } catch {}
}

function trackScroll() {
  const reading = activeReading;
  if (!reading || reading.frame) return;
  reading.frame = requestAnimationFrame(() => {
    reading.frame = 0;
    measurePassage(reading);
  });
}

function measurePassage(reading) {
  // Follow the paragraph at reading height, even if an expanded note is taller than the screen.
  const guide = Math.min(180, innerHeight * 0.3);
  let part = 0;
  for (const section of reading.sections) {
    if (section.getBoundingClientRect().top > guide) break;
    part++;
  }
  if (part) recordPart(part);
}

function flushScroll() {
  if (!activeReading?.frame) return;
  cancelAnimationFrame(activeReading.frame);
  activeReading.frame = 0;
  measurePassage(activeReading);
}

function stopTracking() {
  flushScroll();
  activeReading = null;
}

window.addEventListener('scroll', trackScroll, { passive: true });
window.addEventListener('pagehide', flushScroll);

function enterReading(chapter, match) {
  const sections = Array.from(document.querySelectorAll('#passages .passage'));
  const stored = savedPosition();
  const reload = firstReaderRender && performance.getEntriesByType('navigation')[0]?.type === 'reload';
  firstReaderRender = false;
  const explicitPart = Number(match[2]);
  let part = sections[explicitPart - 1] ? explicitPart : 0;
  if (reload && !signedReader) {
    let tabPosition = null;
    try { tabPosition = JSON.parse(sessionStorage.getItem(readingPositionKey)); } catch {}
    if (tabPosition?.route === location.hash && tabPosition.chapter === chapter && sections[tabPosition.part - 1]) {
      part = tabPosition.part;
    } else if (!match[2] && stored?.chapter === chapter) {
      part = stored.part;
    }
  }
  const pair = part === explicitPart && document.getElementById('sentence-' + part + '-' + Number(match[3]));
  const sentence = pair && (plainReading ? document.getElementById('straight-' + part + '-' + Number(match[3])) : pair.querySelector('.original'));
  const target = sentence || sections[part - 1];
  activeReading = { chapter, sections, frame: 0, part: null };
  recordPart(part);
  if (target) target.scrollIntoView({ block: 'start' });
  else window.scrollTo(0, 0);
  if (sentence) {
    sentence.classList.add('sentence-found');
    setTimeout(() => sentence.classList.remove('sentence-found'), 2400);
  }
}

window.addEventListener('storage', event => {
  if (signedReader || event.key !== readingPositionKey) return;
  const button = document.querySelector('.actions .primary, .journal-summary .primary');
  if (!button) return;
  button.href = resumeLink();
  button.innerHTML = icon('book') + ' ' + resumeLabel() + (button.closest('.actions') ? ' ' + icon('arrow') : '');
});

function searchPattern(query) {
  const letters = Array.from(query).filter(char => !/[\s\p{P}]/u.test(char));
  if (!letters.length) return null;
  const literal = letters.map(char => char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  return new RegExp(literal.join('[\\s\\p{P}]*'), 'iu');
}

function excerpt(text, match) {
  if (!match) return esc(text);
  const start = match.index;
  const end = start + match[0].length;
  return esc(text.slice(0, start)) + '<mark>' + esc(text.slice(start, end)) + '</mark>' + esc(text.slice(end));
}

function searchHit(url, location, original, evidence = '') {
  return '<a class="text-result" href="' + url + '"><small>' + esc(location) +
    '</small><strong>' + original + '</strong>' + (evidence ? '<span>' + evidence + '</span>' : '') + '</a>';
}

function results() {
  const query = $('#query').value.trim();
  const pattern = searchPattern(query);
  const hits = [];
  const other = [];
  lessons.forEach((lesson, chapter) => {
    const title = lesson[0] + '篇';
    const base = link(chapter);
    const chapterResult = () => searchHit(base, '第' + numerals[chapter] + '篇', esc(title), esc(lesson[1]));
    if (!query) { other.push(chapterResult()); return; }
    if (!pattern) return;
    for (const [index, part] of annotations[chapter].entries()) {
      const url = base + '/p/' + (index + 1);
      const label = title + ' · 第 ' + (index + 1) + ' 段 · ' + part.title;
      part.lines.forEach(([original, translated], row) => {
        const sources = [['原文', original], ['叶译', translated], ['两译对读', part.variants?.[row]?.text]];
        for (const [name, value] of sources) {
          const found = value && pattern.exec(value);
          if (!found) continue;
          hits.push(searchHit(url + '/s/' + (row + 1), label,
            excerpt(original, name === '原文' ? found : null),
            name === '原文' ? '' : name + ' · ' + excerpt(value, found)));
          break;
        }
      });
      if (pattern.test(part.title) || pattern.test(part.note || '')) {
        other.push(searchHit(url, title + ' · 第 ' + (index + 1) + ' 段', excerpt(part.title, pattern.exec(part.title)),
          part.note && pattern.test(part.note) ? '段解 · ' + excerpt(part.note, pattern.exec(part.note)) : ''));
      }
    }
    if ([title, ...lesson, groups[groupOf(chapter)], '叶玉麟 李浴日', chapterOverviews[chapter]].some(value => pattern.test(value))) {
      other.push(chapterResult());
    }
  });
  $('#matches').innerHTML = [...hits, ...other].join('') || '<p>没有找到匹配内容。可以试试较短的词，或换用原文中的字。</p>';
  $('#matches').scrollTop = 0;
}
