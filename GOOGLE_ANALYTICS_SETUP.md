# Google Analytics 4 设置指南

## 📊 为 AI Excel Formula 网站设置 Google Analytics 4

### 1. 创建 Google Analytics 4 账户

1. 访问 [Google Analytics](https://analytics.google.com/)
2. 点击 "开始使用" 或 "创建账户"
3. 设置账户信息：
   - **账户名称**: AI Excel Formula
   - **数据共享设置**: 根据需要选择

### 2. 创建 GA4 属性

1. 在账户设置后，创建属性：
   - **属性名称**: AI Excel Formula
   - **报告时区**: 选择你的时区
   - **货币**: 选择适当的货币

2. 选择业务信息：
   - **行业类别**: 技术 > 软件
   - **业务规模**: 选择适当的规模
   - **使用意图**: 选择 "衡量客户互动"

### 3. 设置数据流

1. 选择平台：**网站**
2. 输入网站信息：
   - **网站 URL**: `https://www.aiexcelformula.com`
   - **数据流名称**: AI Excel Formula Website

3. 完成后，你会获得一个 **Measurement ID**，格式类似：`G-XXXXXXXXXX`

### 4. 配置环境变量

将获得的 Measurement ID 添加到 `.env.local` 文件：

```bash
# Google Analytics 4 Configuration
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**重要**: 将 `G-XXXXXXXXXX` 替换为你实际的 Measurement ID

### 5. 部署更新

```bash
git add .
git commit -m "Add Google Analytics 4 integration"
git push
```

### 6. 验证设置

1. 部署完成后，访问你的网站
2. 在 GA4 控制台中，进入 "实时" 报告
3. 你应该能看到实时访问数据

## 📈 GA4 将跟踪的数据

### 自动跟踪的事件：
- **page_view** - 页面访问
- **session_start** - 会话开始
- **first_visit** - 首次访问
- **user_engagement** - 用户参与度

### 自定义事件：
- **formula_generated** - 公式生成事件
  - 平台 (Excel/Google Sheets)
  - 成功/失败状态
  - 输入长度
  - 处理时间

- **formula_copied** - 公式复制事件
  - 平台信息
  - 公式类型

- **platform_switch** - 平台切换事件
  - 从哪个平台切换到哪个平台

- **conversion** - 转化事件
  - 转化类型
  - 转化价值

### 用户属性：
- 设备类型
- 地理位置
- 浏览器信息
- 访问来源

## 🎯 推荐的 GA4 配置

### 1. 设置转化目标
在 GA4 中设置以下转化目标：
- 成功生成公式
- 复制公式
- 用户停留时间超过 2 分钟

### 2. 创建自定义报告
- 公式生成成功率报告
- 平台使用偏好报告
- 用户流失分析报告

### 3. 设置受众群体
- 活跃用户
- 高价值用户（多次使用）
- 平台偏好用户

## 🔒 隐私设置

我们的 GA4 配置已经包含隐私保护设置：
- `anonymize_ip: true` - IP 地址匿名化
- `allow_google_signals: false` - 禁用 Google 信号
- `allow_ad_personalization_signals: false` - 禁用广告个性化

## 📊 数据分析建议

### 关键指标监控：
1. **用户参与度**
   - 平均会话时长
   - 页面停留时间
   - 跳出率

2. **功能使用情况**
   - 公式生成成功率
   - 最受欢迎的公式类型
   - Excel vs Google Sheets 使用比例

3. **转化漏斗**
   - 访问 → 尝试生成 → 成功生成 → 复制公式

4. **用户获取**
   - 流量来源分析
   - 搜索关键词
   - 推荐网站

### 优化建议：
- 根据失败率高的公式类型优化 AI 模型
- 分析用户流失点，改进用户体验
- 根据地理数据优化服务器位置
- 基于设备数据优化移动端体验

## 🚀 高级功能

### 1. 电子商务跟踪（未来扩展）
如果将来添加付费功能，可以跟踪：
- 购买事件
- 收入数据
- 产品性能

### 2. 自定义维度
可以添加更多自定义维度：
- 公式复杂度
- 用户技能水平
- 使用频率

### 3. 数据导出
- 连接到 Google Data Studio
- 导出到 BigQuery 进行高级分析
- API 集成用于自动化报告

## 📞 支持

如果在设置过程中遇到问题：
1. 检查 Measurement ID 格式是否正确
2. 确认环境变量已正确设置
3. 验证网站域名是否匹配
4. 查看浏览器控制台是否有错误信息

设置完成后，你将拥有强大的用户行为分析能力！