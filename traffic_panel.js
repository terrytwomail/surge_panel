(async () => {
    // 自动解析 argument 中的参数
    const arg = $argument || "";
    const params = {};
    arg.split('&').forEach(item => {
        const [k, v] = item.split('=');
        if (k && v) params[k] = v;
    });

    // 辅助函数：请求并解析流量
    async function getBwhTraffic(veid, api_key) {
        if (!veid || !api_key) return "参数缺失";
        try {
            // 强制指定 DIRECT 策略，防止被代理劫持
            const url = `https://api.64clouds.com/v1/getServiceInfo?veid=${veid}&api_key=${api_key}`;
            const resp = await $httpClient.get({ url: url, policy: "DIRECT" });
            
            // 严厉检查：如果返回的是 HTML，说明被机场劫持或 URL 错误
            if (!resp.body || resp.body.trim().startsWith("<")) return "接口劫持/错误";
            
            const data = JSON.parse(resp.body);
            if (data.error !== 0) return `API错误: ${data.message}`;
            
            const used = (data.data_counter / 1024 / 1024 / 1024).toFixed(2);
            const total = (data.plan_monthly_data / 1024 / 1024 / 1024).toFixed(2);
            return `${used} / ${total} GB`;
        } catch (e) {
            return "连接超时";
        }
    }

    // 动态显示：支持任意数量的 VPS，只要 argument 传进来即可
    const content = [];
    if (params.veid1) content.push(`美国: ${await getBwhTraffic(params.veid1, params.key1)}`);
    if (params.veid2) content.push(`新加坡: ${await getBwhTraffic(params.veid2, params.key2)}`);
    if (params.veid3) content.push(`其他: ${await getBwhTraffic(params.veid3, params.key3)}`);

    $done({
        title: "🚀 VPS 流量统计",
        content: content.length > 0 ? content.join("\n") : "未配置参数",
        icon: "airplane.circle.fill",
        "icon-color": "#5DADE2"
    });
})();
