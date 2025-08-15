# 手动下载腾讯云SDK说明

## 🚀 **方法1：使用自动下载脚本（推荐）**

### 双击运行 `下载SDK.bat` 文件
- 会自动尝试多个下载源
- 自动备份原文件
- 自动替换SDK文件

## 📥 **方法2：手动下载**

### 步骤1：访问下载链接
在浏览器中打开以下任一链接：

**主链接：**
- https://unpkg.com/@cloudbase/js-sdk@2.6.0/dist/index.min.js

**备用链接：**
- https://cdn.jsdelivr.net/npm/@cloudbase/js-sdk@2.6.0/dist/index.min.js
- https://registry.npmmirror.com/@cloudbase/js-sdk/2.6.0/files/dist/index.min.js

### 步骤2：保存文件
1. 右键点击页面
2. 选择"另存为"
3. 文件名改为：`cloudbase-sdk.js`
4. 保存到项目根目录（覆盖原文件）

### 步骤3：验证文件
- 文件大小应该大于 100KB
- 文件内容应该包含 `cloudbase` 相关代码

## 🔧 **方法3：使用PowerShell命令**

在PowerShell中运行：

```powershell
# 下载SDK
Invoke-WebRequest -Uri "https://unpkg.com/@cloudbase/js-sdk@2.6.0/dist/index.min.js" -OutFile "cloudbase-sdk.js"

# 检查文件大小
(Get-Item "cloudbase-sdk.js").Length
```

## 🌐 **方法4：使用curl命令**

在Git Bash中运行：

```bash
curl -o cloudbase-sdk.js "https://unpkg.com/@cloudbase/js-sdk@2.6.0/dist/index.min.js"
```

## ✅ **下载完成后的验证**

1. **刷新网页** - 查看控制台是否有新的日志
2. **检查控制台** - 应该看到"检测到真正的腾讯云SDK"
3. **测试功能** - 尝试添加回忆，应该能真正保存到腾讯云

## 🚨 **如果仍然失败**

### 网络问题解决方案：
1. **使用VPN** - 解决CDN访问限制
2. **更换网络** - 尝试手机热点
3. **使用代理** - 配置代理服务器

### 手动创建SDK文件：
如果所有方法都失败，可以：
1. 在其他网络环境下载
2. 使用手机下载后传输到电脑
3. 从其他项目复制SDK文件

## 📋 **文件结构确认**

确保项目根目录包含：
```
cursor web/
├── cloudbase-sdk.js          ← 真正的腾讯云SDK
├── cloudbase-config.js       ← 配置文件
├── cloudbase-core.js         ← 核心功能
├── index.html                ← 主页面
└── 下载SDK.bat              ← 自动下载脚本
```

## 🎯 **预期结果**

下载成功后：
- ✅ 控制台显示"检测到真正的腾讯云SDK"
- ✅ 云开发服务真正连接成功
- ✅ 数据真正保存到腾讯云
- ✅ 云函数真正调用成功

## 📞 **需要帮助？**

如果遇到问题：
1. 检查网络连接
2. 查看浏览器控制台错误信息
3. 确认文件下载完整
4. 尝试不同的下载方法
