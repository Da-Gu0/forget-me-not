const fs = require('fs');
const path = require('path');
const files = ['visit1.html','visit2.html','visit3.html','visit4.html','visit5.html','index.html'];
let errors = 0;
files.forEach(f => {
  const p = path.join('G:\\GAOGAOZHEN\\github\\github-projects\\heikesong', f);
  const content = fs.readFileSync(p, 'utf-8');
  const start = content.indexOf('<script>');
  const end = content.lastIndexOf('</script>');
  if (start === -1 || end === -1) { console.log(`${f}: NO SCRIPT TAG`); errors++; return; }
  const js = content.slice(start + 8, end);
  try {
    new Function(js);
    console.log(`${f}: OK`);
  } catch(e) {
    console.log(`${f}: ${e.message}`);
    errors++;
  }
});
process.exit(errors);
