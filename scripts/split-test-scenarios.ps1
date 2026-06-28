$filesToProcess = @(
    "docs/test/TEST-SCENARIOS.part-01.md",
    "docs/test/TEST-SCENARIOS.part-02.md"
)
$outputBaseDir = "docs/test/scenarios"

foreach ($filePath in $filesToProcess) {
    if (-not (Test-Path $filePath)) { continue }
    $lines = Get-Content $filePath
    
    $currentScenario = $null
    $currentContent = @()
    
    foreach ($line in $lines) {
        if ($line -like "### TC-*") {
            if ($currentScenario -ne $null) {
                $idMatch = [regex]::Match($currentScenario, "TC-([A-Z]+)-\d+")
                if ($idMatch.Success) {
                    $area = $idMatch.Groups[1].Value
                    $idFull = $idMatch.Value
                    $areaDir = Join-Path $outputBaseDir $area
                    if (-not (Test-Path $areaDir)) { New-Item -ItemType Directory -Force -Path $areaDir | Out-Null }
                    $targetPath = Join-Path $areaDir "$idFull.md"
                    $fileContent = "$currentScenario`n`n" + ($currentContent -join "`n").Trim()
                    Set-Content -Path $targetPath -Value $fileContent -Encoding utf8
                }
            }
            $currentScenario = $line
            $currentContent = @()
            continue
        }
        
        if ($line -like "## *") {
            if ($currentScenario -ne $null) {
                $idMatch = [regex]::Match($currentScenario, "TC-([A-Z]+)-\d+")
                if ($idMatch.Success) {
                    $area = $idMatch.Groups[1].Value
                    $idFull = $idMatch.Value
                    $areaDir = Join-Path $outputBaseDir $area
                    if (-not (Test-Path $areaDir)) { New-Item -ItemType Directory -Force -Path $areaDir | Out-Null }
                    $targetPath = Join-Path $areaDir "$idFull.md"
                    $fileContent = "$currentScenario`n`n" + ($currentContent -join "`n").Trim()
                    Set-Content -Path $targetPath -Value $fileContent -Encoding utf8
                }
            }
            $currentScenario = $null
            $currentContent = @()
            continue
        }
        
        if ($currentScenario -ne $null) {
            $currentContent += $line
        }
    }
    
    if ($currentScenario -ne $null) {
        $idMatch = [regex]::Match($currentScenario, "TC-([A-Z]+)-\d+")
        if ($idMatch.Success) {
            $area = $idMatch.Groups[1].Value
            $idFull = $idMatch.Value
            $areaDir = Join-Path $outputBaseDir $area
            if (-not (Test-Path $areaDir)) { New-Item -ItemType Directory -Force -Path $areaDir | Out-Null }
            $targetPath = Join-Path $areaDir "$idFull.md"
            $fileContent = "$currentScenario`n`n" + ($currentContent -join "`n").Trim()
            Set-Content -Path $targetPath -Value $fileContent -Encoding utf8
        }
    }

    if ($filePath -like "*part-02.md*") {
        $regLines = @()
        $inRegMatrix = $false
        foreach ($line in $lines) {
            if ($line -like "*## 16. Regression & edge-case matrix*") {
                $inRegMatrix = $true
                continue
            }
            if ($inRegMatrix -and $line -like "## *") {
                break
            }
            if ($inRegMatrix) {
                $regLines += $line
            }
        }
        
        $regDir = Join-Path $outputBaseDir "REGRESSION"
        if (-not (Test-Path $regDir)) { New-Item -ItemType Directory -Force -Path $regDir | Out-Null }
        
        foreach ($line in $regLines) {
            if ($line -like "|*" -and $line -notlike "*---*" -and $line -notlike "*# | Scenario*") {
                $cols = $line.Split('|').Where({ $_.Trim() -ne "" })
                if ($cols.Count -ge 3) {
                    $id = $cols[0].Trim()
                    $scenario = $cols[1].Trim()
                    $expected = $cols[2].Trim()
                    $targetPath = Join-Path $regDir "$id.md"
                    $fileContent = "# Regression Scenario ${id}: $scenario`n`n**Expected Result:** $expected"
                    Set-Content -Path $targetPath -Value $fileContent -Encoding utf8
                }
            }
        }
    }
}
