# 部署前检查清单

## ✅ 必需步骤

1. **环境变量设置**
   - [ ] ZHIPU_API_KEY 已设置
   - [ ] ZHIPU_MODEL 已设置（可选，默认：glm-4-flash）

2. **代码准备**
   - [ ] 所有代码已提交到Git
   - [ ] .env.local 已添加到 .gitignore
   - [ ] 构建测试通过：`npm run build`

3. **域名和SEO**
   - [ ] 考虑自定义域名（可选）
   - [ ] 更新sitemap和robots.txt中的域名

## 🚀 推荐部署流程（Vercel）

1. 推送代码到GitHub
2. 在Vercel导入项目
3. 配置环境变量：
   - ZHIPU_API_KEY=你的智谱AI密钥
   - ZHIPU_MODEL=glm-4-flash（可选）
4. 部署完成

## 💡 优化建议

- 使用自定义域名提升品牌形象
- 启用HTTPS（大多数平台默认支持）
- 配置CDN加速（Vercel自带）
- 监控应用性能和错误

## 🔧 智谱AI配置说明

- **API密钥获取**：访问 https://open.bigmodel.cn/ 注册并获取API密钥
- **推荐模型**：glm-4-flash（性价比最高，响应速度快）
- **备选模型**：glm-4（更高质量，但成本稍高）