@echo off
echo 正在安装依赖包...
npm install

echo.
echo 依赖安装完成！正在部署云函数...
echo.

echo 部署 getLuckyNote 云函数...
tcb fn deploy getLuckyNote

echo.
echo 部署 getLoveQuiz 云函数...
tcb fn deploy getLoveQuiz

echo.
echo 部署 addMemory 云函数...
tcb fn deploy addMemory

echo.
echo 部署 getMemories 云函数...
tcb fn deploy getMemories

echo.
echo 所有云函数部署完成！
pause
