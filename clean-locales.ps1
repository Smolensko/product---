Write-Host "🚀 开始清理非中文本地化文件..." -ForegroundColor Cyan

# 需要保留的中文相关模式
$keepPatterns = @(
    "zh-CN",
    "zh-TW",
    "zh",
    "chinese",
    "Chinese",
    "index."
)

# 需要处理的目录模式
$localeDirPatterns = @(
    "locales",
    "locale",
    "i18n"
)

$deletedCount = 0
$keptCount = 0

function ShouldKeep($fileName) {
    foreach ($pattern in $keepPatterns) {
        if ($fileName -match $pattern) {
            return $true
        }
    }
    return $false
}

function ShouldProcess($dirPath) {
    foreach ($pattern in $localeDirPatterns) {
        if ($dirPath -match [regex]::Escape($pattern)) {
            return $true
        }
    }
    return $false
}

function ScanDir($dirPath) {
    try {
        $files = Get-ChildItem -Path $dirPath -Force -ErrorAction SilentlyContinue
        
        foreach ($item in $files) {
            $filePath = $item.FullName
            
            if ($item.PSIsContainer) {
                ScanDir $filePath
            } else {
                if (ShouldProcess $dirPath) {
                    if (ShouldKeep $item.Name) {
                        $script:keptCount++
                    } else {
                        Remove-Item -Path $filePath -Force -ErrorAction SilentlyContinue
                        $script:deletedCount++
                        if ($deletedCount % 100 -eq 0) {
                            Write-Host "已删除 $deletedCount 个文件..." -ForegroundColor Yellow
                        }
                    }
                }
            }
        }
    } catch {
        # 忽略错误
    }
}

# 开始扫描
ScanDir (Get-Location)

Write-Host ""
Write-Host "📊 清理完成！" -ForegroundColor Green
Write-Host "✅ 保留中文文件: $keptCount 个" -ForegroundColor Green
Write-Host "🗑️ 删除非中文文件: $deletedCount 个" -ForegroundColor Red

if ($deletedCount -eq 0) {
    Write-Host ""
    Write-Host "提示：没有找到需要删除的非中文本地化文件。" -ForegroundColor Gray
}