const fs = require('fs');
const path = require('path');

const files = ['visit1.html', 'visit2.html', 'visit3.html', 'visit4.html', 'visit5.html'];

files.forEach(f => {
  const fullPath = path.join(__dirname, f);
  const html = fs.readFileSync(fullPath, 'utf-8');
  
  // Extract JS between <script> and </script>
  const match = html.match(/<script>([\s\S]*?)<\/script>/);
  if (!match) {
    console.log(f + ': NO <script> found!');
    return;
  }
  
  const js = match[1];
  
  try {
    // Try to parse as a function body (since it's just object literal)
    new Function(js);
    console.log(f + ': JS syntax OK');
  } catch (e) {
    console.log(f + ': SYNTAX ERROR - ' + e.message);
    // Show context around error
    const lines = js.split('\n');
    const lineMatch = e.stack && e.stack.match(/at new Function.*:(\d+):/);
    if (lineMatch) {
      const errLine = parseInt(lineMatch[1]);
      console.log('  Around line ' + errLine + ':');
      for (let i = Math.max(0, errLine-3); i < Math.min(lines.length, errLine+2); i++) {
        console.log('  ' + (i+1) + ': ' + lines[i]);
      }
    }
  }
  
  // Also check if key functions exist
  console.log('  Has init: ' + /init\s*\(/.test(js));
  console.log('  Has Game object: ' + /const\s+Game\s*=/.test(js));
  console.log('  Has DOMContentLoaded: ' + /DOMContentLoaded/.test(js));
  console.log('');
});
