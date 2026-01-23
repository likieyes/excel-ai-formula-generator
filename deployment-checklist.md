# 部署前检查清单

## ✅ 必需步骤

1. **环境变量设置**
   - [ ] OPENAI_API_KEY 已设置
   - [ ] OPENAI_MODEL 已设置（可选）

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
3. 配置环境变量
4. 部署完成

## 💡 优化建议

- 使用自定义域名提升品牌形象
- 启用HTTPS（大多数平台默认支持）
- 配置CDN加速（Vercel自带）
- 监控应用性能和错误