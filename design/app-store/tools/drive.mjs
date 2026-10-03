import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';
const S = process.argv[2];
const W = Number(process.env.W ?? 390), H = Number(process.env.H ?? 844);
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ['--headless=new', '--disable-gpu', '--remote-debugging-port=9333', `--user-data-dir=${S}/${process.env.PROFILE ?? 'profile'}`, `--window-size=${W},${H}`, 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let ws;
for (let i = 0; i < 60; i++) { try { const list = await (await fetch('http://127.0.0.1:9333/json')).json(); const pg = list.find((t) => t.type === 'page'); if (pg) { ws = new WebSocket(pg.webSocketDebuggerUrl); break; } } catch {} await sleep(250); }
await new Promise((r) => (ws.onopen = r));
let id = 0; const pending = new Map();
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const evaluate = async (expr) => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;
const shot = async (name) => { const r = await send('Page.captureScreenshot', { format: 'png' }); writeFileSync(`${S}/${name}.png`, Buffer.from(r.result.data, 'base64')); console.log('shot', name); };
await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: Number(process.env.DSF ?? (W > 900 ? 1 : 2)), mobile: process.env.MOBILE ? process.env.MOBILE === '1' : !(W > 900) });
const go = async (path) => { await send('Page.navigate', { url: path.startsWith('file:') ? path : `http://localhost:8080${path}` }); await sleep(3500); };
const click = (text) => evaluate(`(() => { const els=[...document.querySelectorAll('div,span,a,button')].filter(e=>e.innerText && e.innerText.trim().toLowerCase()===${JSON.stringify(text.toLowerCase())}); const el=els[els.length-1]; if(!el) return false; el.click(); return true; })()`);
const type = (ph, value) => evaluate(`(() => { const el=[...document.querySelectorAll('input,textarea')].find(e=>(e.placeholder||'').toLowerCase().includes(${JSON.stringify(ph.toLowerCase())})); if(!el) return false; const set=Object.getOwnPropertyDescriptor(el.__proto__,'value').set; set.call(el, ${JSON.stringify(value)}); el.dispatchEvent(new Event('input',{bubbles:true})); return true; })()`);
const texts = () => evaluate(`document.body.innerText.slice(0,1500)`);
const steps = await import(`${S}/steps.mjs`);
try { await steps.default({ send, evaluate, shot, go, click, type, texts, sleep }); } finally { chrome.kill(); process.exit(0); }
