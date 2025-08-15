@echo off
chcp 65001 >nul
title 腾讯云云函数一键部署
echo.
echo ========================================
echo 🚀 腾讯云云函数一键部署工具
echo ========================================
echo.

echo 📍 当前目录: %CD%
echo 🔑 环境ID: cloud1-9ghdf1i93f8fb2b9
echo.

echo 正在进入云函数目录...
cd /d "%~dp0cloud-functions"
if %errorlevel% neq 0 (
    echo ❌ 无法进入云函数目录
    pause
    exit /b 1
)

echo ✅ 已进入云函数目录: %CD%
echo.

echo 🎯 开始部署云函数...
echo.

call deploy-windows.bat

echo.
echo ========================================
echo 🎉 部署完成！请查看上方结果
echo ========================================
echo.
echo 📋 下一步操作:
echo 1. 访问腾讯云控制台验证部署结果
echo 2. 测试云函数功能
echo 3. 更新前端配置
echo.
pause
