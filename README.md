# Pixel Cabin Project

这是一个像素化小屋项目，包含客户端和服务器端代码。

## 项目结构

- `client/` - 前端客户端代码
- `server/` - 后端服务器代码

## 开发环境设置

### 前置要求

- Node.js (推荐最新LTS版本)
- npm 或 yarn

### 安装依赖

```bash
# 安装客户端依赖
cd client
npm install

# 安装服务器端依赖
cd ../server
npm install
```

### 运行项目

```bash
# 启动客户端
cd client
npm start

# 启动服务器
cd server
npm start
```

## Git使用指南

### 基本命令

```bash
# 初始化仓库（如果尚未初始化）
git init

# 添加所有更改到暂存区
git add .

# 提交更改
git commit -m "描述你的更改"

# 推送到远程仓库
git push origin main
```

### 分支管理

```bash
# 创建新分支
git checkout -b feature/新功能名称

# 切换分支
git checkout main

# 合并分支
git merge feature/新功能名称
```

## .gitignore 说明

项目已经配置了全面的 `.gitignore` 文件，自动排除以下内容：

- IDE 配置文件（包括 JetBrains IDEA）
- 操作系统生成的文件（Windows 的 Thumbs.db，macOS 的 .DS_Store）
- Node.js 依赖目录（node_modules）
- 构建输出目录（dist, build）
- 环境变量文件（.env）
- 日志文件
- 缓存文件

### 排除的IDE相关文件

特别注意，以下IDE相关目录和文件已被排除：

- `.idea/` - JetBrains IDEA/WebStorm 完整配置
- `.vscode/` - Visual Studio Code 配置（保留扩展配置）
- `*.iml` - IntelliJ IDEA 模块文件

这样可以确保每个开发者使用自己的IDE配置，同时保持项目的干净性。

## 贡献指南

1. Fork 本仓库
2. 创建你的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 许可证

[在此处添加许可证信息]