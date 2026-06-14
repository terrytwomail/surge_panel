// traffic_panel.js - 终极兜底调试版
let arg = $argument || "";
let params = {};
arg.split('&').forEach(item => {
    let [k, v] = item.split('=');
    if (k && v) params[k] = v;
});

function getTraffic(veid, key, callback) {
    if (!veid || !key) return callback("参数错误");
    let url = "https://api.64clouds.com/v1/getServiceInfo?veid=" + veid + "&api_key=" + key;
    $httpClient.get({ url: url, policy: "DIRECT" }, (error, response, data) => {
        if (error) {
            callback("连接超时"); // 如果显示这个，说明 Surge 的 Rule 没放行，或者是 API 服务器拒接
        } else if (response.status !== 200) {
            callback("HTTP " + response.status); // 如果显示这个，说明 API 报错
        } else {
            try {
                let json = JSON.parse(data);
                if (json.error !== 0) {
                    callback("API错误:" + json.message); // 如果显示这个，说明 API Key 或 ID 不对
                } else {
                    let used = (json.data_counter / 1073741824).toFixed(1);
                    let total = (json.plan_monthly_data / 1073741824).toFixed(1);
                    callback(used + "/" + total + "GB");
                }
            } catch (e) {
                callback("数据格式错误");
            }
        }
    });
}

// 串行执行，确保不产生协程冲突
getTraffic(params.veid1, params.key1, function(res1) {
    getTraffic(params.veid2, params.key2, function(res2) {
        $done({
            title: "🚀 VPS 流量统计",
            content: "BWG-US: " + res1 + "\nBWG-SG: " + res2,
            icon: "airplane.circle.fill",
            "icon-color": "#5DADE2"
        });
    });
});
