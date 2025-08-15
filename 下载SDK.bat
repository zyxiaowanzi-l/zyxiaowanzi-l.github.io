@echo off
chcp 65001 >nul
echo 开始下载腾讯云SDK...
echo.

REM 创建临时目录
if exist "temp-sdk" rmdir /s /q "temp-sdk"
mkdir "temp-sdk"

echo 尝试下载腾讯云SDK...
echo.

REM 尝试使用PowerShell下载（使用最新版本）
powershell -Command "& {try { Invoke-WebRequest -Uri 'https://unpkg.com/@cloudbase/js-sdk@latest/dist/index.min.js' -OutFile 'temp-sdk\cloudbase-sdk.js' -TimeoutSec 30; if (Test-Path 'temp-sdk\cloudbase-sdk.js') { $size = (Get-Item 'temp-sdk\cloudbase-sdk.js').Length; if ($size -gt 1000) { Write-Host '✅ 下载成功！文件大小: ' $size ' 字节' -ForegroundColor Green; exit 0 } else { Write-Host '❌ 文件太小，可能下载失败' -ForegroundColor Red; exit 1 } } else { Write-Host '❌ 下载失败' -ForegroundColor Red; exit 1 } } catch { Write-Host '❌ 下载失败:' $_.Exception.Message -ForegroundColor Red; exit 1 }}"

if %errorlevel% equ 0 (
    echo.
    echo ✅ 下载成功！
    
    REM 备份原文件
    if exist "cloudbase-sdk.js" (
        copy "cloudbase-sdk.js" "cloudbase-sdk.js.backup" >nul
        echo 已备份原文件为 cloudbase-sdk.js.backup
    )
    
    REM 替换文件
    copy "temp-sdk\cloudbase-sdk.js" "cloudbase-sdk.js" >nul
    echo ✅ SDK文件已更新！
    
    REM 清理临时目录
    rmdir /s /q "temp-sdk"
    
    echo.
    echo 🎉 腾讯云SDK下载完成！
    echo 现在请刷新网页测试真正的云开发功能
) else (
    echo.
    echo ❌ 下载失败
    echo.
    echo 建议：
    echo 1. 检查网络连接
    echo 2. 尝试使用VPN
    echo 3. 手动下载SDK文件
    echo.
    echo 清理临时文件...
    if exist "temp-sdk" rmdir /s /q "temp-sdk"
)

echo.
pause
