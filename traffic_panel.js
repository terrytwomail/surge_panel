// traffic_panel.js - 强力优化版
(async () => {
    // 配置部分：你可以把 VEID 和 KEY 直接写死在这里，防止传递参数时出错
    const configs = [
        { name: "美国 VPS", veid: "2143971", key: "p1" },
        { name: "新加坡 VPS", veid: "1810448", key: "pvc" }
    ];

    async function getBwhTraffic(config) {
        try {
            const url = `https://api.64clouds.com/v1/getServiceInfo?veid=${config.veid}&api_key=${config.key}`;
            
            // 强制指定策略为 DIRECT，避开 Surge 的规则拦截，防止 API 请求被机场代理劫持
            const resp = await $httpClient.get({ url: url, policy: "DIRECT" });
            
            // 严格 JSON 校验
            if (!resp.body || resp.body.trim().startsWith("<")) {
                return "API返回错误(页面跳转)";
            }
            
            const data = JSON.parse(resp.body);
            if (data.error !== 0) return `错误: ${data.message}`;
            
            const used = (data.data_counter / 1024 / 1024 / 1024).toFixed(2);
            const total = (data.plan_monthly_data / 1024 / 1024 / 1024).toFixed(2);
            return `${used} / ${total} GB`;
        } catch (e) {
            return "连接超时";
        }
    }

    // 并行执行请求，速度更快
    const results = await Promise.all(configs.map(c => getBwhTraffic(c)));
    
    // 渲染面板
    $done({
        title: "🚀 VPS 流量统计",
        content: configs.map((c, i) => `${c.name}: ${results[i]}`).join("\n"),
        icon: "airplane.circle.fill",
        "icon-color": "#5DADE2"
    });
})();
