// traffic_panel.js - Surge 官方稳定版 (无协程依赖)
let arg = $argument || "";
let params = {};
arg.split('&').forEach(item => {
    let [k, v] = item.split('=');
    if (k && v) params[k] = v;
});

function getTraffic(veid, key, callback) {
    let url = "https://api.64clouds.com/v1/getServiceInfo?veid=" + veid + "&api_key=" + key;
    $httpClient.get({ url: url, policy: "DIRECT" }, (error, response, data) => {
        if (error) {
            callback("连接超时");
        } else if (response.status !== 200) {
            callback("HTTP " + response.status);
        } else {
            try {
                let json = JSON.parse(data);
                if (json.error !== 0) {
                    callback("API错误");
                } else {
                    let used = (json.data_counter / 1073741824).toFixed(2);
                    let total = (json.plan_monthly_data / 1073741824).toFixed(2);
                    callback(used + " / " + total + " GB");
                }
            } catch (e) {
                callback("解析错误");
            }
        }
    });
}

// 嵌套调用，彻底避免 async/await 环境报错
getTraffic(params.veid1, params.key1, function(res1) {
    getTraffic(params.veid2, params.key2, function(res2) {
        $done({
            title: "🚀 VPS 流量统计",
            content: "美国: " + res1 + "\n新加坡: " + res2,
            icon: "airplane.circle.fill",
            "icon-color": "#5DADE2"
        });
    });
});
