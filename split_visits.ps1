$src = 'G:\GAOGAOZHEN\github\github-projects\heikesong\index.html'
$v1  = 'G:\GAOGAOZHEN\github\github-projects\heikesong\visit1.html'
$v2  = 'G:\GAOGAOZHEN\github\github-projects\heikesong\visit2.html'

$enc = [System.Text.UTF8Encoding]::new($false)
$all = [System.IO.File]::ReadAllLines($src, $enc)

# visit1: lines 0-1803 (1-indexed: 1-1804)
$c1 = $all[0..1803]
[System.IO.File]::WriteAllLines($v1, $c1, $enc)
Write-Host ('visit1: ' + $c1.Count + ' lines')

# visit2: lines 0-1479 + lines 1805-2134 (1-indexed: 1-1480 + 1806-2135)
$c2 = $all[0..1479] + $all[1805..2134]
[System.IO.File]::WriteAllLines($v2, $c2, $enc)
Write-Host ('visit2: ' + $c2.Count + ' lines')

Write-Host 'Done'
