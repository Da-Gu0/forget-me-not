const fs = require('fs');
const path = require('path');

const files = ['visit1.html', 'visit3.html', 'visit4.html', 'visit5.html'];

files.forEach(f => {
  const fullPath = path.join(__dirname, f);
  const html = fs.readFileSync(fullPath, 'utf-8');
  const match = html.match(/<script>([\s\S]*?)<\/script>/);
  if (!match) return;
  
  const js = match[1];
  const lines = js.split('\n');
  
  try {
    new Function(js);
    console.log(f + ': OK');
  } catch (e) {
    console.log(f + ': ' + e.message);
    // Parse line number from stack
    const stackMatch = e.stack && e.stack.match(/at new Function.*?:(\d+)/);
    let errLine = 1;
    if (stackMatch) errLine = parseInt(stackMatch[1]);
    else {
      // Try "line X" pattern
      const m2 = e.message.match(/line\s+(\d+)/i);
      if (m2) errLine = parseInt(m2[1]);
    }
    
    console.log('  Context around error (JS line ' + errLine + '):');
    const start = Math.max(0, errLine - 5);
    const end = Math.min(lines.length, errLine + 3);
    for (let i = start; i < end; i++) {
      const marker = (i + 1 === errLine) ? '>>>' : '   ';
      console.log('  ' + marker + ' ' + String(i+1).padStart(4) + '| ' + lines[i]);
    }
    console.log('');
  }
});
