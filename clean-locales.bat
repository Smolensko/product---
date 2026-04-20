@echo off
chcp 65001 >nul
cd "%~dp0"
echo ================================
echo   清理非中文本地化文件
echo ================================
echo.
echo 正在扫描并删除非中文本地化文件...
echo 保留的语言: zh-CN, zh-TW, zh
echo.

:: 使用PowerShell执行删除操作
powershell -Command "
$keepPatterns = @('zh-CN', 'zh-TW', 'zh', 'chinese', 'Chinese', 'index\.');
$localeDirPatterns = @('locales', 'locale', 'i18n');
$deletedCount = 0;
$keptCount = 0;

function ShouldKeep($fileName) {
    foreach ($pattern in $keepPatterns) {
        if ($fileName -match $pattern) { return $true; }
    }
    return $false;
}

function ShouldProcess($dirPath) {
    foreach ($pattern in $localeDirPatterns) {
        if ($dirPath -match [regex]::Escape($pattern)) { return $true; }
    }
    return $false;
}

function ScanDir($dirPath) {
    try {
        $files = Get-ChildItem -Path $dirPath -Force -ErrorAction SilentlyContinue;
        foreach ($item in $files) {
            $filePath = $item.FullName;
            if ($item.PSIsContainer) {
                ScanDir $filePath;
            } else {
                if (ShouldProcess $dirPath) {
                    if (ShouldKeep $item.Name) { $script:keptCount++; }
                    else {
                        Remove-Item -Path $filePath -Force -ErrorAction SilentlyContinue;
                        $script:deletedCount++;
                        if ($deletedCount % 100 -eq 0) { Write-Host \"已删除 $deletedCount 个文件...\"; }
                    }
                }
            }
        }
    } catch { }
}

ScanDir (Get-Location);
Write-Host '';
Write-Host '清理完成！';
Write-Host \"保留中文文件: $keptCount 个\";
Write-Host \"删除非中文文件: $deletedCount 个\";
"

echo.
echo 操作完成！
pause