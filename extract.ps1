Add-Type -AssemblyName System.IO.Compression.FileSystem

$docxPath = "G:\GAOGAOZHEN\github\github-projects\heikesong\source.docx"
$outPath = "G:\GAOGAOZHEN\github\github-projects\heikesong\temp_doc.txt"

$zip = [System.IO.Compression.ZipFile]::OpenRead($docxPath)
$entry = $zip.GetEntry('word/document.xml')
$stream = $entry.Open()
$reader = New-Object System.IO.StreamReader($stream)
$xml = $reader.ReadToEnd()
$reader.Close()
$zip.Dispose()

$text = [System.Text.RegularExpressions.Regex]::Replace($xml, '<[^>]+>', ' ')
$text = $text -replace '\s+', ' '
$text = $text -replace '&amp;', '&'
$text = $text -replace '&lt;', '<'
$text = $text -replace '&gt;', '>'
$text = $text -replace '&quot;', '"'
$text = $text -replace '&apos;', "'"

$text | Out-File -FilePath $outPath -Encoding UTF8
Write-Host "Done"
