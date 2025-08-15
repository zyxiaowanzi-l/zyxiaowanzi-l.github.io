// 获取爱情问答云函数
const cloud = require('@cloudbase/node-sdk');

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});

exports.main = async (event, context) => {
    const loveQuizzes = [
        {
            question: "你最喜欢和我一起做什么？",
            options: ["看电影", "散步聊天", "一起做饭", "旅行"],
            answer: "散步聊天",
            explanation: "因为这样我们可以有更多时间交流，了解彼此的想法~"
        },
        {
            question: "你觉得爱情最重要的是什么？",
            options: ["浪漫", "理解", "陪伴", "信任"],
            answer: "理解",
            explanation: "真正的爱情建立在相互理解的基础上，这样才能长久~"
        },
        {
            question: "你最想和我一起去哪里？",
            options: ["海边", "山顶", "古镇", "城市"],
            answer: "海边",
            explanation: "海边的浪漫氛围最适合情侣，可以一起看日出日落~"
        },
        {
            question: "你最喜欢我什么？",
            options: ["性格", "外表", "才华", "善良"],
            answer: "性格",
            explanation: "性格决定了一个人的本质，这是最吸引人的地方~"
        },
        {
            question: "你觉得我们的未来会怎样？",
            options: ["平平淡淡", "充满挑战", "幸福美满", "充满惊喜"],
            answer: "幸福美满",
            explanation: "只要我们相互珍惜，未来一定会越来越美好~"
        }
    ];
    
    // 随机选择一个问题
    const randomIndex = Math.floor(Math.random() * loveQuizzes.length);
    const quiz = loveQuizzes[randomIndex];
    
    return {
        success: true,
        data: {
            quiz: quiz,
            timestamp: new Date().toISOString(),
            type: 'love_quiz'
        }
    };
};
