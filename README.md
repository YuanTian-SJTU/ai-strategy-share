# ai-strategy-share

## 实时产品预览配置

页面中的“当前版本可操作预览”读取根目录的 `share-config.js`。

每次本地生成新的 Cloudflare 分享地址后，只修改：

```js
livePreviewUrl: "https://你的新地址.trycloudflare.com"
```

然后提交 GitHub 并刷新 Share 页面。页面会自动把这个地址加载到原来视频区域的位置，并保留“在新窗口打开”入口。没有可用地址时，将 `livePreviewUrl` 改回 `null`，页面会显示预览尚未接入。

Cloudflare Quick Tunnel 是临时测试入口；本地 `cloudflared` 停止后地址会失效，重新启动时地址也可能变化。只连接隔离演示环境，不放真实业务数据。

## 产品与技术架构图

页面在战略方向与11—12月月度计划之间展示“产品与技术架构”。
图片位置固定为 `assets/product-technology-architecture.png`。
将最新经确认可展示的架构图上传到该路径（替换旧图片），提交 main 后 GitHub Pages 自动部署。
桌面端整图显示，手机端保留原有桌面宽度供横向查看，点击图可打开原图。
切勿上传敏感内部信息。图片没有上传时，页面显示占位提示，不假装已上线。
