// traffic_panel.js
(async () => {
    // 从参数中获取配置
    const arg = $argument.split('&');
    const params = {};
    arg.forEach(item => {
        const [k, v] = item.split('=');
        params[k] = v;
    });

    async function getBwhTraffic(veid, api_key) {
        try {
            const url = `https://api.64clouds.com/v1/getServiceInfo?veid=${veid}&api_key=${api_key}`;
            const resp = await $httpClient.get(url);
            const data = JSON.parse(resp.body);
            if (data.error !== 0) return "错误: " + data.message;
            const used = (data.data_counter / 1024 / 1024 / 1024).toFixed(2);
            const total = (data.plan_monthly_data / 1024 / 1024 / 1024).toFixed(2);
            return `${used} / ${total} GB`;
        } catch (e) {
            return "请求失败";
        }
    }

    const bwhUS = await getBwhTraffic(params.veid1, params.key1);
    const bwhSG = await getBwhTraffic(params.veid2, params.key2);
    
    $done({
        title: "🚀 VPS 流量统计",
        content: `美国: ${bwhUS}\n新加坡: ${bwhSG}`,
        icon: "airplane.circle.fill",
        "icon-color": "#5DADE2"
    });
})();
