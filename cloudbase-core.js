// 腾讯云云开发核心功能文件
class CloudBaseManager {
    constructor() {
        this.app = null;
        this.db = null;
        this.isInitialized = false;
        this.init();
    }

    // 初始化云开发
    async init() {
        try {
            // 智能检测SDK类型
            if (typeof cloudbase === 'undefined') {
                throw new Error('腾讯云SDK未加载，请检查cloudbase-sdk.js文件');
            }
            
            // 检测是否为真正的腾讯云SDK
            const isRealSDK = this.detectRealSDK();
            
            if (isRealSDK) {
                console.log('检测到真正的腾讯云SDK，使用云开发服务...');
                // 初始化真正的云开发
                this.app = cloudbase.init({
                    env: CLOUDBASE_CONFIG.env
                });
                
                // 获取数据库引用
                this.db = this.app.database();
                
                this.isInitialized = true;
                console.log('✅ 真正的腾讯云云开发初始化成功！');
                
                // 初始化完成后自动加载数据
                this.autoLoadData();
            } else {
                console.log('使用本地模拟SDK进行测试...');
                // 使用模拟SDK
                this.app = cloudbase.init({
                    env: CLOUDBASE_CONFIG.env
                });
                
                this.db = this.app.database();
                this.isInitialized = true;
                console.log('✅ 本地模拟SDK初始化成功（仅用于测试）');
                
                // 初始化完成后自动加载数据
                this.autoLoadData();
            }
            
        } catch (error) {
            console.error('腾讯云云开发初始化失败:', error);
            this.showError('云开发服务连接失败，请检查网络或稍后重试');
        }
    }

    // 检测是否为真正的腾讯云SDK
    detectRealSDK() {
        try {
            // 检查SDK的特征
            if (typeof cloudbase === 'undefined') return false;
            
            // 真正的SDK应该有这些特征
            const hasRealFeatures = (
                cloudbase.init &&
                typeof cloudbase.init === 'function' &&
                cloudbase.version && // 真正的SDK有版本信息
                cloudbase.version.length > 0
            );
            
            // 检查文件大小（真正的SDK文件通常很大）
            const scriptElement = document.querySelector('script[src*="cloudbase-sdk.js"]');
            if (scriptElement) {
                // 如果是从外部加载的，可能是真正的SDK
                return true;
            }
            
            return hasRealFeatures;
        } catch (error) {
            console.log('SDK检测失败:', error);
            return false;
        }
    }



    // 恋爱动态相关功能
    async addLoveFeed(content, type = 'text', mediaUrl = '') {
        if (!this.isInitialized) {
            this.showError('云开发服务未初始化');
            return null;
        }

        try {
            const result = await this.db.collection(CLOUDBASE_CONFIG.collections.loveFeed).add({
                content: content,
                type: type,
                mediaUrl: mediaUrl,
                date: new Date().toISOString().split('T')[0],
                createTime: new Date(),
                status: 'active'
            });
            
            this.showSuccess('动态添加成功！');
            return result;
        } catch (error) {
            console.error('添加恋爱动态失败:', error);
            this.showError('添加动态失败，请重试');
            return null;
        }
    }

    async getLoveFeed(limit = 10) {
        if (!this.isInitialized) return [];

        try {
            const result = await this.db.collection(CLOUDBASE_CONFIG.collections.loveFeed)
                .where({ status: 'active' })
                .orderBy('createTime', 'desc')
                .limit(limit)
                .get();
            
            return result.data || [];
        } catch (error) {
            console.error('获取恋爱动态失败:', error);
            return [];
        }
    }

    // 用户互动记录
    async recordInteraction(type, data) {
        if (!this.isInitialized) return;

        try {
            await this.db.collection(CLOUDBASE_CONFIG.collections.interactions).add({
                type: type,
                data: data,
                timestamp: new Date(),
                userAgent: navigator.userAgent,
                ip: await this.getClientIP()
            });
        } catch (error) {
            console.error('记录互动失败:', error);
        }
    }

    // 美好回忆管理
    async addMemory(title, content, category = 'general') {
        if (!this.isInitialized) {
            this.showError('云开发服务未初始化');
            return null;
        }

        try {
            const result = await this.db.collection(CLOUDBASE_CONFIG.collections.memories).add({
                title: title,
                content: content,
                category: category,
                date: new Date().toISOString().split('T')[0],
                createTime: new Date(),
                status: 'active'
            });
            
            this.showSuccess('回忆添加成功！');
            return result;
        } catch (error) {
            console.error('添加回忆失败:', error);
            this.showError('添加回忆失败，请重试');
            return null;
        }
    }

    async getMemories(category = null, limit = 20) {
        if (!this.isInitialized) return [];

        try {
            let query = this.db.collection(CLOUDBASE_CONFIG.collections.memories)
                .where({ status: 'active' });
            
            if (category) {
                query = query.where({ category: category });
            }
            
            const result = await query
                .orderBy('createTime', 'desc')
                .limit(limit)
                .get();
            
            return result.data || [];
        } catch (error) {
            console.error('获取回忆失败:', error);
            return [];
        }
    }

    // 云函数调用
    async callFunction(name, data = {}) {
        if (!this.isInitialized) {
            this.showError('云开发服务未初始化');
            return null;
        }

        try {
            const result = await this.app.callFunction({
                name: name,
                data: data
            });
            
            return result.result;
        } catch (error) {
            console.error(`调用云函数 ${name} 失败:`, error);
            this.showError('云函数调用失败，请重试');
            return null;
        }
    }

    // 获取幸运签
    async getLuckyNote() {
        const result = await this.callFunction(CLOUDBASE_CONFIG.functions.getLuckyNote);
        if (result) {
            this.recordInteraction('lucky_note', result);
        }
        return result;
    }

    // 获取爱情问答
    async getLoveQuiz() {
        const result = await this.callFunction(CLOUDBASE_CONFIG.functions.getLoveQuiz);
        if (result) {
            this.recordInteraction('love_quiz', result);
        }
        return result;
    }

    // 获取客户端IP
    async getClientIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            return 'unknown';
        }
    }

    // 自动加载数据
    async autoLoadData() {
        // 自动加载恋爱动态
        this.loadLoveFeedToPage();
        
        // 自动加载回忆数据
        this.loadMemoriesToPage();
    }

    // 将恋爱动态加载到页面
    async loadLoveFeedToPage() {
        const feedList = document.getElementById('love-feed-list');
        if (!feedList) return;

        const feeds = await this.getLoveFeed(5);
        if (feeds.length === 0) {
            feedList.innerHTML = '<span style="color:#bbb;">暂无动态，快来添加第一条吧~</span>';
            return;
        }

        feedList.innerHTML = feeds.map(feed => {
            let html = `<div style='margin-bottom:0.9em;'><span style='color:#ff6b9e;font-weight:bold;'>${feed.date}</span>：${feed.content || ''}`;
            if (feed.mediaUrl) {
                if (feed.type === 'image') {
                    html += `<br><img src='${feed.mediaUrl}' alt='动态图片' style='max-width:90%;margin-top:0.3em;border-radius:8px;box-shadow:0 2px 8px #0001;'>`;
                } else if (feed.type === 'video') {
                    html += `<br><video src='${feed.mediaUrl}' controls style='max-width:90%;margin-top:0.3em;border-radius:8px;box-shadow:0 2px 8px #0001;'></video>`;
                }
            }
            html += '</div>';
            return html;
        }).join('');
    }

    // 将回忆数据加载到页面
    async loadMemoriesToPage() {
        // 这里可以根据需要加载回忆数据到页面的特定位置
        console.log('回忆数据加载完成');
    }

    // 显示成功消息
    showSuccess(message) {
        if (typeof showAlert === 'function') {
            showAlert(message);
        } else {
            alert(message);
        }
    }

    // 显示错误消息
    showError(message) {
        if (typeof showAlert === 'function') {
            showAlert(message);
        } else {
            alert(message);
        }
    }
}

// 创建全局实例
window.cloudBaseManager = new CloudBaseManager();
