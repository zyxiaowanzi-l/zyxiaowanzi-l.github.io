@echo off
chcp 65001 >nul
echo 🚀 开始部署云函数到腾讯云...
echo 环境ID: cloud1-9ghdf1i93f8fb2b9
echo.

echo 检查腾讯云CLI工具...
tcb --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 腾讯云CLI工具未安装
    echo 请先执行: npm install -g @cloudbase/cli
    pause
    exit /b 1
)
echo ✅ 腾讯云CLI工具已安装
echo.

echo 检查登录状态...
tcb login --check >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 未登录腾讯云，请先登录
    echo 请执行: tcb login
    pause
    exit /b 1
)
echo ✅ 已登录腾讯云
echo.

echo 📝 部署 getLuckyNote 云函数...
tcb fn deploy getLuckyNote --env cloud1-9ghdf1i93f8fb2b9
if %errorlevel% equ 0 (
    echo ✅ getLuckyNote 部署成功！
) else (
    echo ❌ getLuckyNote 部署失败
)
echo.

echo 💕 部署 getLoveQuiz 云函数...
tcb fn deploy getLoveQuiz --env cloud1-9ghdf1i93f8fb2b9
if %errorlevel% equ 0 (
    echo ✅ getLoveQuiz 部署成功！
) else (
    echo ❌ getLoveQuiz 部署失败
)
echo.

echo 💭 部署 addMemory 云函数...
tcb fn deploy addMemory --env cloud1-9ghdf1i93f8fb2b9
if %errorlevel% equ 0 (
    echo ✅ addMemory 部署成功！
) else (
    echo ❌ addMemory 部署失败
)
echo.

echo 📚 部署 getMemories 云函数...
tcb fn deploy getMemories --env cloud1-9ghdf1i93f8fb2b9
if %errorlevel% equ 0 (
    echo ✅ getMemories 部署成功！
) else (
    echo ❌ getMemories 部署失败
)
echo.

echo 🎉 云函数部署完成！
echo 现在您可以在腾讯云控制台查看部署的云函数
echo.

echo 📋 部署后验证步骤:
echo 1. 访问腾讯云云开发控制台
echo 2. 进入环境: cloud1-9ghdf1i93f8fb2b9
echo 3. 查看云函数列表，确认4个函数都已部署
echo 4. 测试云函数是否正常工作
echo.

pause
