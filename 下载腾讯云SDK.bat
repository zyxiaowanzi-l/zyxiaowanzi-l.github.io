@echo off
chcp 65001 >nul
echo Starting Tencent Cloud SDK download...
echo.

:: Create directory
if not exist "tencent-cloud-sdk" mkdir tencent-cloud-sdk
cd tencent-cloud-sdk

echo Downloading Tencent Cloud JavaScript SDK...

:: Try multiple CDN sources
echo Trying CDN source 1: unpkg...
powershell -Command "try { Invoke-WebRequest -Uri 'https://unpkg.com/tencentcloud-sdk-js@latest/dist/tencentcloud-sdk-js.min.js' -OutFile 'tencentcloud-sdk-js.min.js' -TimeoutSec 30; if (Test-Path 'tencentcloud-sdk-js.min.js') { Write-Host 'SUCCESS' } } catch { Write-Host 'FAILED' }"

if exist "tencentcloud-sdk-js.min.js" (
    echo SUCCESS: SDK downloaded
    goto :success
)

echo Trying CDN source 2: jsdelivr...
powershell -Command "try { Invoke-WebRequest -Uri 'https://cdn.jsdelivr.net/npm/tencentcloud-sdk-js@latest/dist/tencentcloud-sdk-js.min.js' -OutFile 'tencentcloud-sdk-js.min.js' -TimeoutSec 30; if (Test-Path 'tencentcloud-sdk-js.min.js') { Write-Host 'SUCCESS' } } catch { Write-Host 'FAILED' }"

if exist "tencentcloud-sdk-js.min.js" (
    echo SUCCESS: SDK downloaded
    goto :success
)

echo Trying CDN source 3: cdnjs...
powershell -Command "try { Invoke-WebRequest -Uri 'https://cdnjs.cloudflare.com/ajax/libs/tencentcloud-sdk-js/latest/tencentcloud-sdk-js.min.js' -OutFile 'tencentcloud-sdk-js.min.js' -TimeoutSec 30; if (Test-Path 'tencentcloud-sdk-js.min.js') { Write-Host 'SUCCESS' } } catch { Write-Host 'FAILED' }"

if exist "tencentcloud-sdk-js.min.js" (
    echo SUCCESS: SDK downloaded
    goto :success
)

echo All CDN sources failed
echo.
echo Suggestions:
echo 1. Check network connection
echo 2. Try using VPN
echo 3. Download SDK manually
echo 4. Use npm install
goto :end

:success
echo.
echo Next steps:
echo 1. Configure API keys
echo 2. Refresh webpage
echo 3. Enjoy high-precision face recognition

:end
echo.
echo Press any key to continue...
pause >nul
