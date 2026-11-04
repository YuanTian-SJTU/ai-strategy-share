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

## 架构图当前版与上一版切换

顶部导航「产品与技术架构」跳转到战略与月计划之间的架构图区域。

固定路径：
- 当前：`assets/product-technology-architecture.png`
- 上一版：`assets/product-technology-architecture-previous.png`

更新步骤：
1. 先把原来的当前架构图保存并上传为 `product-technology-architecture-previous.png`（保留真实旧版，不使用新图充当旧版）。
2. 再把新的架构图上传并覆盖 `product-technology-architecture.png`。
3. 提交到 main，等待 GitHub Pages 部署，刷新网页；必要时强制刷新图片缓存。

页面默认打开当前版本；只有上一版文件存在并且可读取时，「上一版本」按钮才可以点击。没有旧图时显示「上一版本（待归档）」，不捏造历史版本。点击图片可在新标签打开原图；手机端可以横向滑动查看。更早版本可以通过 Git 提交历史追溯。
