const fs = require('fs');
const html = fs.readFileSync('visit1.html', 'utf8');
const start = html.indexOf('<script>');
const end = html.lastIndexOf('</script>');
const js = html.slice(start + 8, end);

function findBracketMismatch(code) {
  let depth = 0;
  const lines = code.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (let j = 0; j < line.length; j++) {
      if (line[j] === '{' && !(j > 0 && line[j-1] === '$')) depth++;
      if (line[j] === '}') depth--;
      if (depth < 0) return { line: i + 1, char: j + 1, text: line.trim() };
    }
  }
  if (depth !== 0) return { line: 'EOF', depth };
  return null;
}

function findSyntaxErrors(code) {
  const errors = [];
  try {
    new Function(code);
  } catch (e) {
    const match = e.message.match(/Unexpected token ['"`\\]?(.*?)['"`\\]?/);
    if (match) {
      errors.push(e.message + ' (near token: ' + match[1] + ')');
    } else {
      errors.push(e.message);
    }
  }
  return errors;
}

const mismatch = findBracketMismatch(js);
const syntaxErrors = findSyntaxErrors(js);

console.log('=== visit1.html bracket check ===');
if (mismatch) {
  console.log('MISMATCH:', JSON.stringify(mismatch));
} else {
  console.log('Brackets balanced.');
}

console.log('\n=== Syntax errors ===');
if (syntaxErrors.length) {
  syntaxErrors.forEach(e => console.log('  SyntaxError:', e));
} else {
  console.log('No syntax errors found.');
}
