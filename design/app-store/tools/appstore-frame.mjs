// Frames each raw capture into a 1320 x 2868 App Store screenshot:
// a short headline above the phone screen, in Rise's own type and colors.
import { writeFileSync } from 'node:fs';

const DIR = process.argv[2];
const OUT = process.argv[3];
const night = { bg: '#232946', glow: 'rgba(233,180,76,0.16)', text: '#F5F1E8', sub: '#9BA0C0' };
const day = { bg: '#FBF7EF', glow: 'rgba(233,180,76,0.22)', text: '#2C2A26', sub: '#6B6459' };

export const FRAMES = [
  ['1-today', 'Start with a verse.<br>End with the truth.', 'Thirty seconds at night fills the dawn.', day],
  ['2-sos', 'Help is one tap away.', 'For the moment it’s hard.', night],
  ['3-plan', 'Your way out,<br>in your order.', 'Breathe, read, and let your allies know.', night],
  ['4-rise', 'After a fall, grace.<br>Not shame.', 'The sun comes back up. So will you.', day],
  ['5-patterns', 'See when it’s hardest.', 'Gentle patterns and one thing worth trying.', day],
  ['6-armory', 'Hide the Word<br>in your heart.', 'Memorize Scripture, alone or with a friend.', day],
];

for (const [name, title, sub, c] of FRAMES) {
  const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=Inter:wght@400;500&display=swap" rel="stylesheet">
<style>
html,body{margin:0;width:1320px;height:2868px;overflow:hidden}
body{background:radial-gradient(1200px 900px at 50% 0%, ${c.glow}, transparent 70%), ${c.bg};
  display:flex;flex-direction:column;align-items:center;font-family:Inter,sans-serif}
h1{font-family:Fraunces,serif;font-weight:600;font-size:118px;line-height:1.08;letter-spacing:-1.5px;
  color:${c.text};text-align:center;margin:210px 90px 0}
p{font-size:50px;line-height:1.35;color:${c.sub};text-align:center;margin:44px 120px 0}
.phone{margin-top:120px;width:1040px;border-radius:92px;overflow:hidden;
  box-shadow:0 0 0 14px rgba(0,0,0,0.9),0 60px 140px rgba(20,22,40,0.35)}
.phone img{display:block;width:1040px}
</style></head><body>
<h1>${title}</h1><p>${sub}</p>
<div class="phone"><img src="file://${DIR}/raw-${name}.png"></div>
</body></html>`;
  writeFileSync(`${OUT}/${name}.html`, html);
}
console.log('frames written');
