const fs=require('fs');
const v=fs.readFileSync('G:/GAOGAOZHEN/github/github-projects/heikesong2/heikesong/index.html','utf8');
console.log('index.html size:',v.length);
const checks=['pot','flower-pot','flowerpot','花盆','三盆','work-id','field-notes','letter','suitcase','v2-scene','v3-scene','v4-scene','v5-scene'];
checks.forEach(c=>console.log(c+':',v.includes(c)?'YES':'NO'));
console.log('v2-related:',v.includes('startVisit2')?'YES':'NO');
console.log('v3-related:',v.includes('visit3')?'YES':'NO');
console.log('v4-related:',v.includes('visit4')?'YES':'NO');
console.log('v5-related:',v.includes('visit5')?'YES':'NO');
console.log('class Game:',v.includes('class Game')?'YES':'NO');
console.log('initGame:',v.includes('initGame')?'YES':'NO');
console.log('startPhase:',v.includes('startPhase')?'YES':'NO');
console.log('doIntro:',v.includes('doIntro')?'YES':'NO');
// count script tags
const scriptTags=v.match(/<script[^>]*>/g);
console.log('script tags:',scriptTags?scriptTags.length:0);
// count class Game occurrences
const classGame=v.match(/class Game/g);
console.log('class Game count:',classGame?classGame.length:0);
// find Game class definition
const idx=v.indexOf('class Game');
if(idx>=0)console.log('Game class snippet:',v.substring(idx,idx+200).replace(/\r?\n/g,'\\n'));
// find initGame call
const idx2=v.lastIndexOf('initGame');
if(idx2>=0)console.log('initGame area:',v.substring(idx2,idx2+300).replace(/\r?\n/g,'\\n'));
// check v3-v5 files
const files=['visit3.html','visit4.html','visit5.html'];
files.forEach(f=>{
  if(!fs.existsSync(f))return console.log(f,'missing');
  const v=fs.readFileSync(f,'utf8');
  console.log(f,'size:',v.length);
  console.log('  class Game:',v.includes('class Game')?'YES':'NO');
  console.log('  initGame:',v.includes('initGame')?'YES':'NO');
  console.log('  initGame called:',/initGame\s*\(\s*\)/.test(v)?'YES':'NO');
  console.log('  startVisit:',v.includes('startVisit')?'YES':'NO');
  console.log('  startPhase:',v.includes('startPhase')?'YES':'NO');
  const scripts=v.match(/<script[^>]*>/g);
  console.log('  script tags:',scripts?scripts.length:0);
});
