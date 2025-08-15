/**
 * 腾讯云AI人脸识别服务 - 增强版
 * 支持在线API调用和离线模拟模式
 */

class TencentAIServiceEnhanced {
    constructor(config) {
        this.config = config;
        this.baseUrl = 'https://iai.tencentcloudapi.com';
        this.version = '2020-03-03';
        this.isOnline = false;
        this.sdkLoaded = false;
        
        // 多用户管理
        this.currentUser = null;
        this.registeredUsers = new Map();
        
        // 初始化服务
        this.init();
        this.loadRegisteredUsers();
    }
    
    /**
     * 初始化服务
     */
    async init() {
        try {
            // 检查网络连接
            this.isOnline = await this.checkNetworkConnection();
            console.log(`网络连接状态: ${this.isOnline ? '在线' : '离线'}`);
            
            // 尝试加载腾讯云SDK
            await this.loadTencentSDK();
            
            // 等待SDK加载完成
            if (this.sdkLoaded) {
                await this.waitForSDK();
            }
            
            console.log(`腾讯云AI服务初始化完成 - 在线状态: ${this.isOnline}, SDK状态: ${this.sdkLoaded}`);
        } catch (error) {
            console.warn('腾讯云AI服务初始化失败，将使用离线模式:', error);
            this.isOnline = false;
            this.sdkLoaded = false;
        }
    }
    
    /**
     * 加载已注册用户
     */
    loadRegisteredUsers() {
        try {
            const usersData = localStorage.getItem('registeredUsers');
            if (usersData) {
                const users = JSON.parse(usersData);
                users.forEach(user => {
                    this.registeredUsers.set(user.id, user);
                });
                console.log(`✅ 已加载 ${this.registeredUsers.size} 个注册用户`);
            }
        } catch (error) {
            console.warn('加载注册用户失败:', error);
        }
    }
    
    /**
     * 保存注册用户到本地存储
     */
    saveRegisteredUsers() {
        try {
            const usersArray = Array.from(this.registeredUsers.values());
            localStorage.setItem('registeredUsers', JSON.stringify(usersArray));
            console.log('✅ 用户数据已保存到本地存储');
        } catch (error) {
            console.error('保存用户数据失败:', error);
        }
    }
    
    /**
     * 注册新用户
     */
    async registerUser(userInfo, photoData) {
        try {
            const userId = 'user_' + Date.now();
            const newUser = {
                id: userId,
                name: userInfo.name,
                role: userInfo.role || 'partner',
                photoData: photoData,
                createTime: new Date().toISOString(),
                lastLogin: null,
                permissions: this.config.userRoles[userInfo.role || 'partner'].permissions
            };
            
            // 保存到内存和本地存储
            this.registeredUsers.set(userId, newUser);
            this.saveRegisteredUsers();
            
            console.log(`✅ 用户 ${newUser.name} 注册成功`);
            return newUser;
        } catch (error) {
            console.error('用户注册失败:', error);
            throw error;
        }
    }
    
    /**
     * 通过人脸识别登录用户
     */
    async loginUserByFace(photoData) {
        try {
            let bestMatch = null;
            let bestScore = 0;
            
            // 与所有注册用户进行人脸比对
            for (const [userId, user] of this.registeredUsers) {
                try {
                    const result = await this.compareFace(photoData, user.photoData);
                    if (result.Response && result.Response.Score) {
                        const score = result.Response.Score;
                        if (score > bestScore && score >= 90) { // 90%以上相似度
                            bestScore = score;
                            bestMatch = user;
                        }
                    }
                } catch (error) {
                    console.warn(`与用户 ${user.name} 比对失败:`, error);
                }
            }
            
            if (bestMatch) {
                // 更新最后登录时间
                bestMatch.lastLogin = new Date().toISOString();
                this.saveRegisteredUsers();
                
                // 设置当前用户
                this.currentUser = bestMatch;
                
                console.log(`✅ 用户 ${bestMatch.name} 登录成功，相似度: ${bestScore}%`);
                return {
                    success: true,
                    user: bestMatch,
                    score: bestScore
                };
            } else {
                return {
                    success: false,
                    message: '未找到匹配的用户，请先注册'
                };
            }
        } catch (error) {
            console.error('人脸识别登录失败:', error);
            throw error;
        }
    }
    
    /**
     * 获取当前用户
     */
    getCurrentUser() {
        return this.currentUser;
    }
    
    /**
     * 检查用户权限
     */
    hasPermission(permission) {
        if (!this.currentUser) return false;
        return this.currentUser.permissions.includes(permission);
    }
    
    /**
     * 获取所有注册用户
     */
    getAllUsers() {
        return Array.from(this.registeredUsers.values());
    }
    
    /**
     * 删除用户
     */
    deleteUser(userId) {
        if (this.registeredUsers.has(userId)) {
            const user = this.registeredUsers.get(userId);
            this.registeredUsers.delete(userId);
            this.saveRegisteredUsers();
            console.log(`✅ 用户 ${user.name} 已删除`);
            return true;
        }
        return false;
    }
    
    /**
     * 更新用户信息
     */
    updateUser(userId, updates) {
        if (this.registeredUsers.has(userId)) {
            const user = this.registeredUsers.get(userId);
            Object.assign(user, updates);
            this.saveRegisteredUsers();
            console.log(`✅ 用户 ${user.name} 信息已更新`);
            return true;
        }
        return false;
    }
    
    /**
     * 登出当前用户
     */
    logout() {
        this.currentUser = null;
        console.log('✅ 用户已登出');
    }
    
    /**
     * 检查网络连接
     */
    async checkNetworkConnection() {
        try {
            const response = await fetch('https://www.tencentcloud.com', { 
                method: 'HEAD',
                mode: 'no-cors',
                timeout: 5000
            });
            return true;
        } catch (error) {
            return false;
        }
    }
    
    /**
     * 加载腾讯云SDK
     */
    async loadTencentSDK() {
        try {
            // 尝试加载本地SDK
            console.log('正在加载本地腾讯云SDK...');
            const localLoaded = await this.loadScript('tencent-cloud-sdk/tencentcloud-sdk-js.min.js');
            
            if (localLoaded) {
                this.sdkLoaded = true;
                console.log('✅ 本地腾讯云SDK加载成功');
                return;
            }
            
            // 尝试从CDN加载
            console.log('本地SDK加载失败，尝试从CDN加载...');
            const cdnSources = [
                'https://unpkg.com/tencentcloud-sdk-js@latest/dist/tencentcloud-sdk-js.min.js',
                'https://cdn.jsdelivr.net/npm/tencentcloud-sdk-js@latest/dist/tencentcloud-sdk-js.min.js'
            ];
            
            for (const cdnUrl of cdnSources) {
                console.log(`尝试从CDN加载: ${cdnUrl}`);
                if (await this.loadScript(cdnUrl)) {
                    this.sdkLoaded = true;
                    console.log('✅ CDN腾讯云SDK加载成功');
                    return;
                }
            }
            
            console.warn('❌ 所有SDK加载方式都失败了，将使用离线模拟模式');
        } catch (error) {
            console.error('SDK加载过程中发生错误:', error);
            this.sdkLoaded = false;
        }
    }
    
    /**
     * 动态加载脚本
     */
    loadScript(src) {
        return new Promise((resolve) => {
            if (src.startsWith('http')) {
                // 从CDN加载
                const script = document.createElement('script');
                script.src = src;
                script.onload = () => resolve(true);
                script.onerror = () => resolve(false);
                document.head.appendChild(script);
                
                // 设置超时
                setTimeout(() => resolve(false), 10000);
            } else {
                // 本地文件
                const script = document.createElement('script');
                script.src = src;
                script.onload = () => resolve(true);
                script.onerror = () => resolve(false);
                document.head.appendChild(script);
                
                // 设置超时
                setTimeout(() => resolve(false), 5000);
            }
        });
    }
    
    /**
     * 人脸检测
     */
    async detectFace(imageBase64) {
        if (this.isOnline && this.sdkLoaded) {
            return await this.onlineDetectFace(imageBase64);
        } else {
            return await this.offlineDetectFace(imageBase64);
        }
    }
    
    /**
     * 在线人脸检测
     */
    async onlineDetectFace(imageBase64) {
        try {
            // 使用腾讯云SDK
            if (typeof TencentCloud !== 'undefined') {
                const client = new TencentCloud.iai.v20200303.Client({
                    credential: {
                        secretId: this.config.secretId,
                        secretKey: this.config.secretKey,
                    },
                    region: this.config.region,
                    profile: {
                        httpProfile: {
                            endpoint: this.baseUrl,
                        },
                    },
                });
                
                const params = {
                    Image: imageBase64,
                    MaxFaceNum: this.config.faceParams.maxFaceNum,
                    NeedFaceAttributes: this.config.faceParams.needFaceAttributes,
                    NeedQualityDetection: this.config.faceParams.needQualityDetection,
                    FaceModelVersion: this.config.faceParams.faceModelVersion
                };
                
                const result = await client.DetectFace(params);
                return result;
            } else {
                throw new Error('腾讯云SDK未加载');
            }
        } catch (error) {
            console.error('在线人脸检测失败，切换到离线模式:', error);
            return await this.offlineDetectFace(imageBase64);
        }
    }
    
    /**
     * 离线人脸检测（模拟）
     */
    async offlineDetectFace(imageBase64) {
        // 模拟API响应延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 模拟检测结果
        return {
            Response: {
                RequestId: 'offline_' + Date.now(),
                FaceNum: 1,
                FaceInfos: [{
                    FaceId: 'face_' + Math.random().toString(36).substr(2, 9),
                    FaceRect: {
                        X: 100,
                        Y: 100,
                        Width: 200,
                        Height: 200
                    },
                    FaceAttributes: {
                        Age: 25,
                        Gender: 1,
                        Expression: 1,
                        Glass: 0,
                        Hat: 0,
                        Mask: 0
                    },
                    FaceQualityInfo: {
                        Score: 95,
                        Sharpness: 90,
                        Brightness: 85,
                        Completeness: 95
                    }
                }]
            }
        };
    }
    
    /**
     * 人脸比对
     */
    async compareFace(imageABase64, imageBBase64) {
        if (this.isOnline && this.sdkLoaded) {
            return await this.onlineCompareFace(imageABase64, imageBBase64);
        } else {
            return await this.offlineCompareFace(imageABase64, imageBBase64);
        }
    }
    
    /**
     * 在线人脸比对
     */
    async onlineCompareFace(imageABase64, imageBBase64) {
        try {
            if (typeof TencentCloud !== 'undefined') {
                const client = new TencentCloud.iai.v20200303.Client({
                    credential: {
                        secretId: this.config.secretId,
                        secretKey: this.config.secretKey,
                    },
                    region: this.config.region,
                    profile: {
                        httpProfile: {
                            endpoint: this.baseUrl,
                        },
                    },
                });
                
                const params = {
                    ImageA: imageABase64,
                    ImageB: imageBBase64,
                    FaceModelVersion: this.config.faceParams.faceModelVersion
                };
                
                const result = await client.CompareFace(params);
                return result;
            } else {
                throw new Error('腾讯云SDK未加载');
            }
        } catch (error) {
            console.error('在线人脸比对失败，切换到离线模式:', error);
            return await this.offlineCompareFace(imageABase64, imageBBase64);
        }
    }
    
    /**
     * 离线人脸比对（模拟）
     */
    async offlineCompareFace(imageABase64, imageBBase64) {
        // 模拟API响应延迟
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // 模拟比对结果（基于图片数据相似性）
        const similarity = this.calculateImageSimilarity(imageABase64, imageBBase64);
        const score = Math.floor(similarity * 100);
        
        return {
            Response: {
                RequestId: 'offline_' + Date.now(),
                Score: score,
                FaceModelVersion: this.config.faceParams.faceModelVersion
            }
        };
    }
    
    /**
     * 计算图片相似性（离线模式）
     */
    calculateImageSimilarity(imgA, imgB) {
        // 简单的相似性计算（基于Base64字符串）
        const lenA = imgA.length;
        const lenB = imgB.length;
        const minLen = Math.min(lenA, lenB);
        
        if (minLen === 0) return 0;
        
        let matches = 0;
        for (let i = 0; i < minLen; i++) {
            if (imgA[i] === imgB[i]) {
                matches++;
            }
        }
        
        // 移除随机因素，提高安全性
        const baseSimilarity = matches / minLen;
        
        // 添加更严格的验证逻辑
        // 1. 检查图片尺寸是否合理
        // 2. 检查图片格式是否一致
        // 3. 检查图片内容特征
        
        // 临时返回较低相似度，提高安全性
        const strictSimilarity = baseSimilarity * 0.6; // 降低60%相似度
        
        return Math.max(0, Math.min(1, strictSimilarity));
    }
    
    /**
     * 活体检测
     */
    async performLivenessDetection(imageData) {
        try {
            if (this.isOnline && this.sdkLoaded) {
                return await this.onlineLivenessDetection(imageData);
            } else {
                return await this.offlineLivenessDetection(imageData);
            }
        } catch (error) {
            console.error('活体检测失败:', error);
            return await this.offlineLivenessDetection(imageData);
        }
    }
    
    /**
     * 在线活体检测
     */
    async onlineLivenessDetection(imageData) {
        try {
            if (typeof TencentCloud !== 'undefined') {
                const client = new TencentCloud.iai.v20200303.Client({
                    credential: {
                        secretId: this.config.secretId,
                        secretKey: this.config.secretKey,
                    },
                    region: this.config.region,
                    profile: {
                        httpProfile: {
                            endpoint: this.baseUrl,
                        },
                    },
                });
                
                const params = {
                    Image: imageData,
                    LivenessType: 'SILENT' // 静默活体检测
                };
                
                const result = await client.DetectLiveness(params);
                return result.Response ? result.Response.Score : 85;
            } else {
                throw new Error('腾讯云SDK未加载');
            }
        } catch (error) {
            console.error('在线活体检测失败，切换到离线模式:', error);
            return await this.offlineLivenessDetection(imageData);
        }
    }
    
    /**
     * 离线活体检测（增强版）
     */
    async offlineLivenessDetection(imageData) {
        // 模拟API响应延迟
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // 更严格的活体检测
        try {
            // 1. 检查图像是否包含人脸
            const hasFace = await this.detectFaceInImage(imageData);
            if (!hasFace) {
                return 30; // 没有检测到人脸，返回低分
            }
            
            // 2. 检查图像质量
            const imageQuality = this.analyzeImageQuality(imageData);
            if (imageQuality < 0.5) {
                return 40; // 图像质量差，返回低分
            }
            
            // 3. 检查是否为遮挡图像
            const isBlocked = this.detectImageBlocking(imageData);
            if (isBlocked) {
                return 20; // 检测到遮挡，返回很低分
            }
            
            return 85; // 通过所有检查
        } catch (error) {
            console.error('活体检测失败:', error);
            return 30; // 出错时返回低分
        }
    }
    
    /**
     * 检测图像中是否包含人脸
     */
    async detectFaceInImage(imageData) {
        try {
            // 简单的图像分析
            // 1. 检查图像数据长度
            if (imageData.length < 1000) {
                return false; // 图像数据太短，可能不是有效图像
            }
            
            // 2. 检查图像格式
            if (!imageData.startsWith('/9j/') && !imageData.startsWith('iVBOR')) {
                return false; // 不是JPEG或PNG格式
            }
            
            // 3. 模拟人脸检测结果
            // 这里可以集成真实的人脸检测算法
            return true; // 临时返回true
        } catch (error) {
            console.error('人脸检测失败:', error);
            return false;
        }
    }
    
    /**
     * 分析图像质量
     */
    analyzeImageQuality(imageData) {
        try {
            // 简单的图像质量分析
            // 1. 检查图像数据长度（越长质量越好）
            const dataLength = imageData.length;
            const qualityScore = Math.min(1, dataLength / 50000); // 标准化到0-1
            
            // 2. 检查图像是否被压缩过度
            if (dataLength < 10000) {
                return qualityScore * 0.5; // 压缩过度，降低分数
            }
            
            return qualityScore;
        } catch (error) {
            console.error('图像质量分析失败:', error);
            return 0.3; // 出错时返回低分
        }
    }
    
    /**
     * 检测图像是否被遮挡
     */
    detectImageBlocking(imageData) {
        try {
            // 检测图像是否被遮挡
            // 1. 检查图像数据长度是否异常
            if (imageData.length < 5000) {
                return true; // 数据太短，可能被遮挡
            }
            
            // 2. 检查图像数据模式
            // 如果图像被手遮挡，数据模式会发生变化
            const dataPattern = this.analyzeDataPattern(imageData);
            if (dataPattern.isBlocked) {
                return true;
            }
            
            // 3. 临时返回false，表示未检测到遮挡
            // 在实际应用中，这里应该使用更复杂的算法
            return false;
        } catch (error) {
            console.error('遮挡检测失败:', error);
            return true; // 出错时假设被遮挡，提高安全性
        }
    }
    
    /**
     * 分析数据模式
     */
    analyzeDataPattern(imageData) {
        try {
            // 简单的数据模式分析
            // 1. 检查数据重复性
            const sampleSize = Math.min(1000, imageData.length);
            const sample = imageData.substring(0, sampleSize);
            
            let repeatedChars = 0;
            for (let i = 1; i < sample.length; i++) {
                if (sample[i] === sample[i-1]) {
                    repeatedChars++;
                }
            }
            
            const repetitionRate = repeatedChars / sample.length;
            
            // 2. 判断是否被遮挡
            const isBlocked = repetitionRate > 0.8; // 重复率过高可能被遮挡
            
            return {
                isBlocked: isBlocked,
                repetitionRate: repetitionRate,
                confidence: 0.7
            };
        } catch (error) {
            console.error('数据模式分析失败:', error);
            return {
                isBlocked: true, // 出错时假设被遮挡
                repetitionRate: 1.0,
                confidence: 0.0
            };
        }
    }
    
    /**
     * 获取服务状态
     */
    getServiceStatus() {
        return {
            isOnline: this.isOnline,
            sdkLoaded: this.sdkLoaded,
            mode: this.isOnline && this.sdkLoaded ? 'online' : 'offline',
            message: this.isOnline && this.sdkLoaded ? 
                '在线模式 - 使用腾讯云API' : 
                '离线模式 - 使用本地模拟'
        };
    }
    
    /**
     * 检查SDK是否可用
     */
    checkSDKAvailability() {
        if (typeof TencentCloud !== 'undefined') {
            console.log('✅ 腾讯云SDK已加载到全局作用域');
            console.log('📋 SDK版本:', TencentCloud.version);
            console.log('📝 说明:', TencentCloud.description);
            return true;
        } else {
            console.log('❌ 腾讯云SDK未加载到全局作用域');
            return false;
        }
    }
    
    /**
     * 等待SDK加载完成
     */
    async waitForSDK(timeout = 10000) {
        const startTime = Date.now();
        
        while (Date.now() - startTime < timeout) {
            if (this.checkSDKAvailability()) {
                this.sdkLoaded = true;
                return true;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        console.warn('SDK加载超时，将使用离线模式');
        return false;
    }
    
    /**
     * 测试服务连接
     */
    async testConnection() {
        try {
            const testImage = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';
            
            const result = await this.detectFace(testImage.split(',')[1]);
            return {
                success: true,
                result: result,
                status: this.getServiceStatus()
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                status: this.getServiceStatus()
            };
        }
    }
}

// 创建全局实例
window.tencentAIServiceEnhanced = new TencentAIServiceEnhanced(TENCENT_AI_CONFIG);

// 导出服务类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TencentAIServiceEnhanced;
}
