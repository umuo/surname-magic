# 姓氏秘语

基于 React、Vite 和 Framer Motion 的百家姓卡牌小游戏。通过七次选择猜出心中的姓氏，支持手机布局、姓氏查询、回退修改和减少动态效果偏好。

## 本地开发

需要 Node.js 22 和 npm。

```sh
npm ci
npm run dev
```

## 构建

```sh
npm run build
npm run preview
```

默认资源路径为 `/`。部署到子目录时设置 `VITE_BASE_PATH`：

```sh
VITE_BASE_PATH=/surname-magic/ npm run build
```

## GitHub Pages

站点地址：https://umuo.github.io/surname-magic/

在仓库 Settings → Pages → Build and deployment 中，将 Source 设为 **GitHub Actions**。

推送到 `main` 后，`.github/workflows/deploy-pages.yml` 自动安装依赖、构建并部署 `dist`。也可在 Actions 中手动运行工作流。构建产物和本地截图不提交到仓库。
