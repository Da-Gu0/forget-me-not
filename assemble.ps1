$enc = [System.Text.UTF8Encoding]::new($false)
$base = 'G:\GAOGAOZHEN\github\github-projects\heikesong2\heikesong'
$all = [System.IO.File]::ReadAllLines("$base\visit2.html", $enc)
$closingLines = [System.IO.File]::ReadAllLines("$base\_closing.txt", $enc)

# Actual indices in visit2.html (0-indexed):
# Line 939: <script>
# Lines 940-966: Game state declarations up to el: {},
# Lines 967-974: init (was modified, shorter)
# Line 976: cacheDom() {
# Lines 976-1480: Engine methods (last: onTransitionContinue)
# Line 1481: blank
# Line 1482: Visit 2 story comment begins
$scriptTag  = 989
$cacheDom   = 1026
$storyEnd   = 1560

Write-Host "Indices: script=$scriptTag cacheDom=$cacheDom storyEnd=$storyEnd"

function Build($num, $outName, $initArr, $phaseArr) {
    $storyFile = "$base" + "\_v" + $num + "_story.js"
    $outPath   = "$base" + "\" + $outName
    $out = New-Object System.Collections.ArrayList

    # 1. HTML head + body (lines 0 to scriptTag-1)
    for ($i = 0; $i -lt $scriptTag; $i++) {
        $null = $out.Add($all[$i])
    }

    # 2. Script tag + Game state declarations (lines scriptTag to cacheDom-1)
    #    Skip old init lines (967-974)
    for ($i = $scriptTag; $i -lt $cacheDom; $i++) {
        if ($i -ge 1018 -and $i -le 1024) { continue }  # skip old init
        $null = $out.Add($all[$i])
    }

    # 3. Insert NEW init
    foreach ($x in $initArr) { $null = $out.Add($x) }

    # 4. Engine methods (cacheDom to storyEnd-1), replace startPhase switch cases
    $state = 0  # 0=normal, 1=found startPhase decl, 2=found switch, 3=skip old cases
    for ($i = $cacheDom; $i -lt $storyEnd; $i++) {
        $l = $all[$i]
        
        if ($l -like '*startPhase(name)*') {
            $null = $out.Add($l)
            $state = 1
            continue
        }
        
        if ($state -eq 1 -and $l -like '*switch(name)*') {
            $null = $out.Add($l)
            foreach ($p in $phaseArr) { $null = $out.Add($p) }
            $state = 2
            continue
        }
        
        if ($state -eq 2) {
            # Skip old case lines
            if ($l.Trim() -eq '}') {
                $null = $out.Add($l)
                $state = 0
            }
            continue
        }
        
        $null = $out.Add($l)
    }

    # 5. Story functions
    $story = [System.IO.File]::ReadAllLines($storyFile, $enc)
    foreach ($s in $story) { if ($s.Length -gt 0) { $null = $out.Add($s) } }

    # 5.5. Bridge helpers (override showChoices/addFragment, add showDialogue)
    $null = $out.Add('')
    $null = $out.Add('  // ========== 辅助桥接方法 ==========')
    $null = $out.Add('')
    $null = $out.Add('  showDialogue: function(speaker, text, callback) {')
    $null = $out.Add('    this.runDialogueQueue([{ speaker: speaker, text: text, speed: 50, cb: callback }]);')
    $null = $out.Add('  },')
    $null = $out.Add('')
    $null = $out.Add('  showChoices: function(choices, onSelect) {')
    $null = $out.Add('    var ct = this.el.choices;')
    $null = $out.Add('    ct.innerHTML = "";')
    $null = $out.Add('    var self = this;')
    $null = $out.Add('    choices.forEach(function(ch) {')
    $null = $out.Add('      var btn = document.createElement("button");')
    $null = $out.Add('      btn.className = "choice-btn";')
    $null = $out.Add('      btn.innerHTML = "<span class=\"choice-label\">\u9009\u9879 " + ch.label + "</span>" + ch.text;')
    $null = $out.Add('      btn.addEventListener("click", function() {')
    $null = $out.Add('        ct.classList.remove("active");')
    $null = $out.Add('        ct.innerHTML = "";')
    $null = $out.Add('        if (ch.cb) { ch.cb(); }')
    $null = $out.Add('        else if (onSelect) { onSelect(ch.label); }')
    $null = $out.Add('      });')
    $null = $out.Add('      ct.appendChild(btn);')
    $null = $out.Add('    });')
    $null = $out.Add('    requestAnimationFrame(function() {')
    $null = $out.Add('      requestAnimationFrame(function() { ct.classList.add("active"); });')
    $null = $out.Add('    });')
    $null = $out.Add('  },')
    $null = $out.Add('')
    $null = $out.Add('  addFragment: function() {')
    $null = $out.Add('    var fragment;')
    $null = $out.Add('    if (arguments.length === 1 && typeof arguments[0] === "object") {')
    $null = $out.Add('      fragment = arguments[0];')
    $null = $out.Add('    } else {')
    $null = $out.Add('      fragment = { text: arguments[1], verdict: arguments[2] };')
    $null = $out.Add('    }')
    $null = $out.Add('    this.notebookFragments.push(fragment);')
    $null = $out.Add('    this.updateTrustBar();')
    $null = $out.Add('    this.updateNotebookUI();')
    $null = $out.Add('    this.showToast("\u{1F4D3} \u865A\u5B9E\u5BF9\u8D26\u672C\u5DF2\u8BB0\u5F55 \u00B7 \u788E\u7247 " + this.notebookFragments.length + "/5");')
    $null = $out.Add('  },')
    $null = $out.Add('')

    # 6. Closing
    foreach ($c in $closingLines) { $null = $out.Add($c) }

    [System.IO.File]::WriteAllLines($outPath, [string[]]$out, $enc)
    Write-Host "$outName : $($out.Count) lines"
}

# Visit 3
Build 3 'visit3.html' @(
    '  // ========== 初始化 =========='
    '  init() {'
    '    this.cacheDom();'
    '    this.bindGlobalClick();'
    '    this.resetScene();'
    '    setTimeout(function() { Game.startVisit3(); }, 600);'
    '  },'
) @(
    "      case 'v3_intro': this.doV3Intro(); break;"
    "      case 'v3_side_by_side': this.doV3SideBySide(); break;"
    "      case 'v3_crayon': this.doV3Crayon(); break;"
    "      case 'v3_choice': this.doV3Choice(); break;"
    "      case 'v3_ending': this.doV3Ending(); break;"
    "      default: break;"
)

# Visit 4
Build 4 'visit4.html' @(
    '  // ========== 初始化 =========='
    '  init() {'
    '    this.cacheDom();'
    '    this.bindGlobalClick();'
    '    this.resetScene();'
    '    setTimeout(function() { Game.startVisit4(); }, 600);'
    '  },'
) @(
    "      case 'v4_intro': this.doV4Intro(); break;"
    "      case 'v4_sundowning': this.doV4Sundowning(); break;"
    "      case 'v4_comfort': this.doV4Comfort(); break;"
    "      case 'v4_search': this.doV4Search(); break;"
    "      case 'v4_overlay': this.doV4Overlay(); break;"
    "      case 'v4_quiet': this.doV4Quiet(); break;"
    "      case 'v4_ending': this.doV4Ending(); break;"
    "      default: break;"
)

# Visit 5
Build 5 'visit5.html' @(
    '  // ========== 初始化 =========='
    '  init() {'
    '    this.cacheDom();'
    '    this.bindGlobalClick();'
    '    this.resetScene();'
    '    setTimeout(function() { Game.startVisit5(); }, 600);'
    '  },'
) @(
    "      case 'v5_intro': this.doV5Intro(); break;"
    "      case 'v5_meta': this.doV5Meta(); break;"
    "      case 'v5_dialogue': this.doV5Dialogue(); break;"
    "      case 'v5_call': this.doV5Call(); break;"
    "      case 'v5_embrace': this.doV5Embrace(); break;"
    "      case 'v5_input': this.doV5Input(); break;"
    "      case 'v5_ending': this.doV5Ending(); break;"
    "      default: break;"
)

Write-Host "All done!"
