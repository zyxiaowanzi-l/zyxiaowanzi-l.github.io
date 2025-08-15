// 获取回忆列表云函数
const cloud = require('@cloudbase/node-sdk');

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});

exports.main = async (event, context) => {
    const db = cloud.database();
    
    try {
        const { category, limit = 20, page = 1 } = event;
        
        // 构建查询条件
        let query = db.collection('memories').where({
            status: 'active'
        });
        
        // 如果指定了分类，添加分类筛选
        if (category && category !== 'all') {
            query = query.where({
                category: category
            });
        }
        
        // 获取总数
        const countResult = await query.count();
        const total = countResult.total;
        
        // 分页查询
        const skip = (page - 1) * limit;
        const result = await query
            .orderBy('createTime', 'desc')
            .skip(skip)
            .limit(limit)
            .get();
        
        return {
            success: true,
            data: {
                memories: result.data,
                pagination: {
                    current: page,
                    pageSize: limit,
                    total: total,
                    pages: Math.ceil(total / limit)
                }
            }
        };
        
    } catch (error) {
        console.error('获取回忆列表失败:', error);
        return {
            success: false,
            error: '获取回忆列表失败，请重试'
        };
    }
};
