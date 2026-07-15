const fs = require('fs');
const v = fs.readFileSync('G:/GAOGAOZHEN/github/github-projects/heikesong2/heikesong/index.html', 'utf8');

// Check for v2-specific functions
const checks = [
  'startVisit2() {', 'doV2Intro()', 'doV2Interact', 'onV2ItemClick',
  'showSpecimenBox', 'closeSpecimenBox', 'showFieldNotes', 'closeFieldNotes',
  'flipFieldNotesPage', 'showWorkId', 'closeWorkId', 'showLetter', 'closeLetter',
  'onV2AllExamined', 'doV2Ending', 'triggerSpecimenDialogue',
  'onBlueLabelEnter', 'onBlueLabelLeave', 'markV2ItemExamined',
  'setZhaoExpression', 'setPlayerExpression',
  'onPotClick', 'onToolBoxClick',
  '_fnShowPage', '_fnUpdateNav', '_startFNDialogue',
  'exp:', 'startCb',
  'hand_reach'
];

const results = {};
for (const c of checks) {
  results[c] = v.includes(c);
}
console.log('Function presence check:');
for (const [k, present] of Object.entries(results)) {
  if (!present) console.log('  MISSING:', k);
}
const missing = Object.entries(results).filter(([_,p]) => !p);
console.log(`\nMissing: ${missing.length}/${checks.length}`);

// Check where the script ends
const scriptEnd = v.lastIndexOf('</script>');
console.log('\nScript ends at offset:', scriptEnd);
console.log('Last 200 chars before </script>:');
console.log(v.substring(scriptEnd - 200, scriptEnd));
