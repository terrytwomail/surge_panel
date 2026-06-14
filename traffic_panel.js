// traffic_panel.js - 极简全日志记录版
(async () => {
    // 0. 日志：确认参数获取
    console.log("Panel Started. Argument: " + ($argument || "Empty"));

    let arg = $argument || "";
    let params = {};
    arg.split('&').forEach(item => {
        let [k, v] = item.split('=');
        if (k && v) params[k] = v;
    });

    // 辅助函数
    function getTraffic(veid, key) {
        return new Promise((resolve) => {
            let url = "https://api.64clouds.com/v1/getServiceInfo?veid=" + veid + "&api_key=" + key;
            console.log("Requesting: " + url); // 这里的日志必须在系统日志看到
            
            $httpClient.get({ url: url, policy: "DIRECT" }, (error, response, data) => {
                if (error) {
                    console.log("HTTP Error: " + error);
                    resolve("连接失败");
                } else {
                    console.log("Status: " + response.status + ", Data: " + data.substring(0, 50));
                    try {
                        let json = JSON.parse(data);
                        if (json.error !== 0) {
                            resolve("API错误");
                        } else {
                            let used = (json.data_counter / 1073741824).toFixed(2);
                            let total = (json.plan_monthly_data / 1073741824).toFixed(2);
                            resolve(used + " / " + total + " GB");
                        }
                    } catch (e) {
                        resolve("解析失败");
                    }
                }
            });
        });
    }

    // 执行
    let res1 = await getTraffic(params.veid1, params.key1);
    let res2 = await getTraffic(params.veid2, params.key2);

    $done({
        title: "🚀 VPS 流量统计",
        content: "美国: " + res1 + "\n新加坡: " + res2,
        icon: "airplane.circle.fill",
        "icon-color": "#5DADE2"
    });
})();
