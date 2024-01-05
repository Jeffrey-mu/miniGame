const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const port = 3230;
const {
  requesting_real_resources,
  verify_resources,
} = require('./src/utils');



// 自定义中间件函数
const myMiddleware = async (req, res, next) => {
  const file_types = [
    // Image formats
    'jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp',

    // Audio formats
    'mp3', 'ogg', 'wav',

    // Video formats (if your game includes videos)
    'mp4', 'webm', 'ogv',

    // Font formats
    'ttf', 'otf', 'woff', 'woff2',

    // JSON data (for configuration, levels, etc.)
    'json',

    // Text files (if needed)
    'txt',

    // 3D models (if your game uses 3D assets)
    'obj', 'fbx', 'gltf',

    // Other asset formats (adjust based on your game's requirements)
    'xml', 'csv', 'yaml', 'css', 'js'
  ];
  // Assuming req.url is something like "/path/to/resource/file.txt"
  const urlParts = req.url.split('/');

  // Get the last item
  const lastItem = urlParts[urlParts.length - 1];

  // Split the last item by dot (.)
  const fileParts = lastItem.split('.');

  // Get the last part after the last dot
  const fileExtension = fileParts[fileParts.length - 1];

  if (file_types.includes(fileExtension)) {
    const verify_data = verify_resources(req);
    if (verify_data) {
      next()
    } else  {
      await requesting_real_resources(req)
      next()
    }
  } else {
    next()
  }
};

// 使用自定义中间件
app.use(myMiddleware);
// 添加静态目录
app.use(express.static('games'));

// 启动服务器
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
