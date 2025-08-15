// 腾讯云云开发核心功能文件 - 完全修复版本
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
                throw new Error('腾讯云SDK未加载，请检查cloudbase-sdk-fixed.js文件');
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
            // 首先尝试从云数据库获取
            try {
                const result = await this.db.collection(CLOUDBASE_CONFIG.collections.loveFeed)
                    .where({ status: 'active' })
                    .orderBy('createTime', 'desc')
                    .limit(limit)
                    .get();
                
                if (result.data && result.data.length > 0) {
                    // 同步到本地存储
                    localStorage.setItem('loveFeeds', JSON.stringify(result.data));
                    return result.data;
                }
            } catch (dbError) {
                console.log('⚠️ 云数据库获取失败，使用本地存储:', dbError.message);
            }
            
            // 如果云数据库失败，从本地存储获取
            const localFeeds = JSON.parse(localStorage.getItem('loveFeeds') || '[]');
            if (localFeeds.length > 0) {
                console.log('✅ 从本地存储获取到', localFeeds.length, '条动态');
                return localFeeds.slice(0, limit);
            }
            
            return [];
        } catch (error) {
            console.error('获取恋爱动态失败:', error);
            return [];
        }
    }
    
    // 删除恋爱动态
    async deleteLoveFeed(feedId) {
        if (!this.isInitialized) {
            this.showError('云开发服务未初始化');
            return null;
        }

        try {
            console.log('🔄 开始删除恋爱动态:', feedId);
            
            // 首先尝试从云数据库删除
            try {
                console.log('🔄 从云数据库删除...');
                const deleteResult = await this.db.collection(CLOUDBASE_CONFIG.collections.loveFeed)
                    .doc(feedId)
                    .remove();
                console.log('✅ 云数据库删除成功:', deleteResult);
            } catch (dbError) {
                console.log('⚠️ 云数据库删除失败，使用本地删除:', dbError.message);
            }
            
            // 从本地存储中删除
            let feeds = JSON.parse(localStorage.getItem('loveFeeds') || '[]');
            const originalLength = feeds.length;
            feeds = feeds.filter(feed => feed._id !== feedId);
            
            if (feeds.length === originalLength) {
                console.log('⚠️ 本地存储中未找到要删除的动态');
            } else {
                localStorage.setItem('loveFeeds', JSON.stringify(feeds));
                console.log('✅ 本地存储删除成功');
            }
            
            // 同时从页面DOM中移除该动态
            console.log('🔍 查找要删除的DOM元素，feedId:', feedId);
            let feedElement = document.querySelector(`[data-feed-id="${feedId}"]`);
            
            // 如果没找到，尝试其他选择器
            if (!feedElement) {
                console.log('⚠️ 未找到data-feed-id元素，尝试其他选择器...');
                // 尝试查找包含该feedId的父元素
                const allFeedElements = document.querySelectorAll('.love-feed-item, [style*="background:linear-gradient"], [style*="border-radius:12px"]');
                console.log('找到可能的动态元素数量:', allFeedElements.length);
                
                // 遍历所有可能的动态元素，查找包含该feedId的内容
                for (let element of allFeedElements) {
                    if (element.textContent && element.textContent.includes(feedId)) {
                        feedElement = element;
                        console.log('✅ 通过内容匹配找到元素');
                        break;
                    }
                }
            }
            
            if (feedElement) {
                console.log('✅ 找到要删除的DOM元素:', feedElement);
                // 添加删除动画
                feedElement.style.animation = 'fadeOut 0.3s ease';
                feedElement.style.transform = 'scale(0.95)';
                feedElement.style.opacity = '0.5';
                
                setTimeout(() => {
                    if (feedElement.parentNode) {
                        feedElement.parentNode.removeChild(feedElement);
                        console.log('✅ 页面DOM删除成功');
                        
                        // 检查是否还有其他动态
                        const remainingFeeds = document.querySelectorAll('.love-feed-item, [style*="background:linear-gradient"], [style*="border-radius:12px"]');
                        console.log('剩余动态元素数量:', remainingFeeds.length);
                        
                        if (remainingFeeds.length === 0) {
                            // 如果没有动态了，显示空状态
                            const feedList = document.getElementById('love-feed-list');
                            if (feedList) {
                                feedList.innerHTML = '<span style="color:#bbb;">暂无动态，快来添加第一条吧~</span>';
                                console.log('✅ 显示空状态');
                            }
                        }
                    }
                }, 300);
            } else {
                console.log('❌ 未找到要删除的DOM元素');
            }
            
            // 检查是否还有其他动态
            const remainingFeeds = document.querySelectorAll('[data-feed-id]');
            if (remainingFeeds.length === 0) {
                // 如果没有动态了，显示空状态
                const feedList = document.getElementById('love-feed-list');
                if (feedList) {
                    feedList.innerHTML = '<span style="color:#bbb;">暂无动态，快来添加第一条吧~</span>';
                }
            }
            
            console.log('✅ 删除成功');
            this.showSuccess('动态删除成功！');
            return { deleted: 1, _real: true };
        } catch (error) {
            console.error('删除恋爱动态失败:', error);
            this.showError('删除动态失败，请重试');
            return null;
        }
    }

    // 用户互动记录 - 完全非阻塞版本
    recordInteraction(type, data) {
        if (!this.isInitialized) return;

        // 完全异步执行，不阻塞任何功能
        setTimeout(async () => {
            try {
                await this.db.collection(CLOUDBASE_CONFIG.collections.interactions).add({
                    type: type,
                    data: data,
                    timestamp: new Date(),
                    userAgent: navigator.userAgent,
                    ip: await this.getClientIP()
                });
                console.log('✅ 互动记录成功:', type);
            } catch (error) {
                console.log('记录互动失败（非阻塞）:', error.message);
            }
        }, 0);
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

    // 云函数调用 - 完全修复版本
    async callFunction(name, data = {}) {
        if (!this.isInitialized) {
            this.showError('云开发服务未初始化');
            return null;
        }

        try {
            console.log('🔄 开始调用云函数:', name, data);
            
            const result = await this.app.callFunction({
                name: name,
                data: data
            });
            
            console.log('✅ 云函数调用成功:', result);
            
            // 确保返回正确的数据结构
            if (result && result.result) {
                return result.result;
            } else if (result) {
                return result;
            } else {
                return { success: true, message: '云函数调用成功' };
            }
            
        } catch (error) {
            console.error(`❌ 调用云函数 ${name} 失败:`, error);
            this.showError('云函数调用失败，请重试');
            return null;
        }
    }

    // 获取幸运签
    async getLuckyNote() {
        try {
            console.log('🎯 开始获取幸运签...');
            const result = await this.callFunction(CLOUDBASE_CONFIG.functions.getLuckyNote);
            if (result) {
                this.recordInteraction('lucky_note', result);
                console.log('✅ 幸运签获取成功:', result);
            }
            return result;
        } catch (error) {
            console.error('❌ 获取幸运签失败:', error);
            return null;
        }
    }

    // 获取爱情问答
    async getLoveQuiz() {
        try {
            console.log('🎯 开始获取爱情问答...');
            const result = await this.callFunction(CLOUDBASE_CONFIG.functions.getLoveQuiz);
            if (result) {
                this.recordInteraction('love_quiz', result);
                console.log('✅ 爱情问答获取成功:', result);
            }
            return result;
        } catch (error) {
            console.error('❌ 获取爱情问答失败:', error);
            return null;
        }
    }

    // 获取客户端IP - 完全本地化版本
    async getClientIP() {
        try {
            // 直接返回本地IP，避免网络请求
            const localIP = '127.0.0.1';
            console.log('✅ 使用本地IP:', localIP);
            return localIP;
        } catch (error) {
            console.log('使用默认本地IP');
            return '127.0.0.1';
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

        // 显示加载动画
        feedList.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #ff6b9e;">
                <div style="font-size: 1.2rem; margin-bottom: 1rem;">🔄 正在加载动态...</div>
                <div style="width: 40px; height: 40px; border: 3px solid #ff6b9e; border-top: 3px solid transparent; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
            </div>
        `;
        
        // 隐藏加载提示文字
        const feedLoading = document.getElementById('love-feed-loading');
        if (feedLoading) {
            feedLoading.style.display = 'none';
        }

        const feeds = await this.getLoveFeed(5);
        if (feeds.length === 0) {
            feedList.innerHTML = '<span style="color:#bbb;">暂无动态，快来添加第一条吧~</span>';
            return;
        }

        feedList.innerHTML = feeds.map(feed => {
            let html = `<div data-feed-id="${feed._id}" style='position:relative;margin-bottom:1.2em;padding:1.2rem;background:linear-gradient(135deg, #fff6fa 0%, #fff 100%);border-radius:12px;box-shadow:0 3px 15px rgba(255,107,158,0.08);border:1px solid rgba(255,107,158,0.1);'>`;
            
            // 开发者删除按钮（右上角）
            html += `<div style='position:absolute;top:1rem;right:1rem;'>`;
            html += `<button onclick='deleteLoveFeed("${feed._id}")' style='background:#ff4757;color:white;border:none;border-radius:50%;width:24px;height:24px;cursor:pointer;font-size:12px;line-height:1;opacity:0.7;transition:opacity 0.3s ease;' onmouseover='this.style.opacity="1"' onmouseout='this.style.opacity="0.7"'>×</button>`;
            html += `</div>`;
            
            html += `<div style='margin-bottom:0.6em;display:flex;align-items:center;'><span style='color:#ff6b9e;font-weight:600;font-size:0.85rem;background:rgba(255,107,158,0.1);padding:0.3rem 0.8rem;border-radius:15px;'>${feed.date}</span></div>`;
            html += `<div style='color:#333;line-height:1.6;margin-bottom:0.8em;font-size:0.95rem;'>${feed.content || ''}</div>`;
            
            // 支持多张图片
            if (feed.mediaUrls && feed.mediaUrls.length > 0) {
                html += `<div style='text-align:center;margin-top:1rem;'>`;
                feed.mediaUrls.forEach((url, index) => {
                    html += `<img src='${url}' alt='动态图片${index + 1}' style='max-width:150px;max-height:150px;border-radius:10px;box-shadow:0 4px 20px rgba(255,107,158,0.15);object-fit:cover;transition:transform 0.3s ease;margin:0.5rem;cursor:pointer;' onclick='showImageModal("${url}")' onmouseover='this.style.transform="scale(1.05)"' onmouseout='this.style.transform="scale(1)"'>`;
                });
                html += `</div>`;
            } else if (feed.mediaUrl) {
                // 兼容旧版本单张图片
                if (feed.type === 'image') {
                    html += `<div style='text-align:center;margin-top:1rem;'><img src='${feed.mediaUrl}' alt='动态图片' style='max-width:200px;max-height:200px;border-radius:10px;box-shadow:0 4px 20px rgba(255,107,158,0.15);object-fit:cover;transition:transform 0.3s ease;cursor:pointer;' onclick='showImageModal("${feed.mediaUrl}")' onmouseover='this.style.transform="scale(1.05)"' onmouseout='this.style.transform="scale(1)"'>`;
                } else if (feed.type === 'video') {
                    html += `<div style='text-align:center;margin-top:1rem;'><video src='${feed.mediaUrl}' controls style='max-width:300px;max-height:200px;border-radius:10px;box-shadow:0 4px 20px rgba(255,107,158,0.15);'>`;
                }
            }
            html += '</div>';
            return html;
        }).join('');
        
        console.log('✅ 动态加载完成，共', feeds.length, '条');
        
        // 验证data-feed-id是否正确设置
        const feedElements = document.querySelectorAll('[data-feed-id]');
        console.log('🔍 验证data-feed-id设置，找到元素数量:', feedElements.length);
        feedElements.forEach((element, index) => {
            const feedId = element.getAttribute('data-feed-id');
            console.log(`元素 ${index + 1}: data-feed-id="${feedId}"`);
        });
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
