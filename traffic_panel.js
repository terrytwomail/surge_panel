// traffic_panel.js - 终极强制日志版
$task.fetch({
    url: "https://api.64clouds.com/v1/getServiceInfo?veid=" + ($argument.match(/veid1=([^&]+)/) ? $argument.match(/veid1=([^&]+)/)[1] : "") + "&api_key=" + ($argument.match(/key1=([^&]+)/) ? $argument.match(/key1=([^&]+)/)[1] : ""),
    method: "GET",
    policy: "DIRECT"
}).then(response => {
    console.log("Response Status: " + response.status);
    console.log("Response Body: " + response.body);
    
    let data = JSON.parse(response.body);
    let used = (data.data_counter / 1073741824).toFixed(2);
    let total = (data.plan_monthly_data / 1073741824).toFixed(2);
    
    $done({
        title: "🚀 VPS 流量统计",
        content: "流量: " + used + " / " + total + " GB",
        icon: "airplane.circle.fill",
        "icon-color": "#5DADE2"
    });
}, reason => {
    console.log("Fetch Error: " + reason);
    $done({
        title: "🚀 VPS 流量统计",
        content: "请求失败: " + reason,
        icon: "xmark.octagon.fill",
        "icon-color": "#D65C51"
    });
});
