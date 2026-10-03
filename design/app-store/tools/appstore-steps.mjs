// Captures raw app screens at the 6.9" iPhone logical size (440 x 956 @3x).
import { store } from './seed.mjs';

export default async ({ go, shot, evaluate, sleep }) => {
  const scroll = (y) =>
    evaluate(`(()=>{const s=[...document.querySelectorAll('div')].filter(d=>d.scrollHeight>d.clientHeight+4&&getComputedStyle(d).overflowY!=='visible'); s.forEach(x=>x.scrollTop=${y});})()`);
  await go('/today');
  await evaluate(`localStorage.setItem('rise.store.v1', ${JSON.stringify(JSON.stringify(store))})`);
  await go('/today'); await sleep(1800); await shot('appstore/raw-1-today');
  await go('/sos'); await sleep(1500); await shot('appstore/raw-2-sos');
  await evaluate(`document.querySelector('[aria-label="I’m struggling right now"]').click()`);
  await sleep(1200); await scroll(250); await sleep(600); await shot('appstore/raw-3-plan');
  await go('/rise-again'); await sleep(4200); await shot('appstore/raw-4-rise');
  await go('/patterns'); await sleep(1500); await shot('appstore/raw-5-patterns');
  await go('/armory'); await sleep(1500); await shot('appstore/raw-6-armory');
};
