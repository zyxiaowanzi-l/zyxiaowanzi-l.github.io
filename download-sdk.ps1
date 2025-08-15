# 下载腾讯云SDK脚本
Write-Host "开始下载腾讯云SDK..." -ForegroundColor Green

# 创建临时目录
$tempDir = "temp-sdk"
if (Test-Path $tempDir) {
    Remove-Item $tempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

# 尝试多个下载源
$downloadUrls = @(
    "https://unpkg.com/@cloudbase/js-sdk@2.6.0/dist/index.min.js",
    "https://cdn.jsdelivr.net/npm/@cloudbase/js-sdk@2.6.0/dist/index.min.js",
    "https://registry.npmmirror.com/@cloudbase/js-sdk/2.6.0/files/dist/index.min.js"
)

$success = $false
foreach ($url in $downloadUrls) {
    Write-Host "尝试下载: $url" -ForegroundColor Yellow
    try {
        $outputPath = "$tempDir\cloudbase-sdk.js"
        Invoke-WebRequest -Uri $url -OutFile $outputPath -TimeoutSec 30
        
        if (Test-Path $outputPath) {
            $fileSize = (Get-Item $outputPath).Length
            if ($fileSize -gt 1000) {  # 文件大小应该大于1KB
                Write-Host "✅ 下载成功！文件大小: $($fileSize) 字节" -ForegroundColor Green
                $success = $true
                break
            } else {
                Write-Host "❌ 文件太小，可能下载失败" -ForegroundColor Red
                Remove-Item $outputPath -Force
            }
        }
    } catch {
        Write-Host "❌ 下载失败: $($_.Exception.Message)" -ForegroundColor Red
    }
}

if ($success) {
    # 备份原文件
    if (Test-Path "cloudbase-sdk.js") {
        Copy-Item "cloudbase-sdk.js" "cloudbase-sdk.js.backup" -Force
        Write-Host "已备份原文件为 cloudbase-sdk.js.backup" -ForegroundColor Yellow
    }
    
    # 替换文件
    Copy-Item "$tempDir\cloudbase-sdk.js" "cloudbase-sdk.js" -Force
    Write-Host "✅ SDK文件已更新！" -ForegroundColor Green
    
    # 清理临时目录
    Remove-Item $tempDir -Recurse -Force
    
    Write-Host "`n🎉 腾讯云SDK下载完成！" -ForegroundColor Green
    Write-Host "现在请刷新网页测试真正的云开发功能" -ForegroundColor Cyan
} else {
    Write-Host "`n❌ 所有下载源都失败了" -ForegroundColor Red
    Write-Host "建议：" -ForegroundColor Yellow
    Write-Host "1. 检查网络连接" -ForegroundColor White
    Write-Host "2. 尝试使用VPN" -ForegroundColor White
    Write-Host "3. 手动下载SDK文件" -ForegroundColor White
    
    # 清理临时目录
    if (Test-Path $tempDir) {
        Remove-Item $tempDir -Recurse -Force
    }
}

Write-Host "`n按任意键继续..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
