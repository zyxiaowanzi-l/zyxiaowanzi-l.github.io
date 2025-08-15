@echo off
chcp 65001 >nul
echo 开始下载腾讯云SDK（使用官方CDN）...
echo.

REM 创建临时目录
if exist "temp-sdk" rmdir /s /q "temp-sdk"
mkdir "temp-sdk"

echo 尝试从腾讯云官方CDN下载...
echo.

REM 尝试多个腾讯云官方CDN源
powershell -Command "& {
    $urls = @(
        'https://main.qcloudimg.com/raw/cloudbase-js-sdk/latest/index.min.js',
        'https://main.qcloudimg.com/raw/cloudbase-js-sdk/2.5.0/index.min.js',
        'https://main.qcloudimg.com/raw/cloudbase-js-sdk/2.4.0/index.min.js'
    )
    
    $success = $false
    foreach ($url in $urls) {
        Write-Host '尝试下载: ' $url -ForegroundColor Yellow
        try {
            Invoke-WebRequest -Uri $url -OutFile 'temp-sdk\cloudbase-sdk.js' -TimeoutSec 30
            if (Test-Path 'temp-sdk\cloudbase-sdk.js') {
                $size = (Get-Item 'temp-sdk\cloudbase-sdk.js').Length
                if ($size -gt 1000) {
                    Write-Host '✅ 下载成功！文件大小: ' $size ' 字节' -ForegroundColor Green
                    $success = $true
                    break
                } else {
                    Write-Host '❌ 文件太小，可能下载失败' -ForegroundColor Red
                    Remove-Item 'temp-sdk\cloudbase-sdk.js' -Force
                }
            }
        } catch {
            Write-Host '❌ 下载失败: ' $_.Exception.Message -ForegroundColor Red
        }
    }
    
    if ($success) {
        exit 0
    } else {
        exit 1
    }
}"

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
    echo ❌ 所有官方CDN源都失败了
    echo.
    echo 现在尝试备用方案...
    echo.
    
    REM 尝试使用npm镜像
    echo 尝试使用npm镜像下载...
    powershell -Command "& {try { Invoke-WebRequest -Uri 'https://registry.npmmirror.com/@cloudbase/js-sdk/latest/files/dist/index.min.js' -OutFile 'temp-sdk\cloudbase-sdk.js' -TimeoutSec 30; if (Test-Path 'temp-sdk\cloudbase-sdk.js') { $size = (Get-Item 'temp-sdk\cloudbase-sdk.js').Length; if ($size -gt 1000) { Write-Host '✅ npm镜像下载成功！文件大小: ' $size ' 字节' -ForegroundColor Green; exit 0 } else { Write-Host '❌ 文件太小，可能下载失败' -ForegroundColor Red; exit 1 } } else { Write-Host '❌ 下载失败' -ForegroundColor Red; exit 1 } } catch { Write-Host '❌ npm镜像下载失败:' $_.Exception.Message -ForegroundColor Red; exit 1 }}"
    
    if %errorlevel% equ 0 (
        echo.
        echo ✅ npm镜像下载成功！
        
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
        echo ❌ 所有下载方法都失败了
        echo.
        echo 建议：
        echo 1. 检查网络连接
        echo 2. 尝试使用VPN
        echo 3. 手动下载SDK文件
        echo.
        echo 清理临时文件...
        if exist "temp-sdk" rmdir /s /q "temp-sdk"
    )
)

echo.
pause
