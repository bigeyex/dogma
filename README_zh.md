# Dogma: 豆包 Figma 智能助手

Dogma 是一款强大的 Figma 插件，利用火山引擎（Ark）AI 模型连接文字描述、Tailwind CSS 和 Figma 设计。它允许设计师和开发者立即生成高保真 UI 组件，通过样式参考进行微调，并无缝处理图片。

## 核心功能

- **🚀 AI 构建器**: 根据简单的文字描述生成独立的 Tailwind CSS HTML 片段。
- **✨ 提示词展开**: 自动将简短的 UI 描述扩展为详细的需求文档，以获得更好的 AI 生成效果。
- **🎨 样式参考**: 选择现有的 Figma 框架作为视觉参考。AI 将分析布局、颜色和字体以确保一致性。
- **🖼️ 增强型图片集成**:
  - **外部 URL**: 自动从外部 `src` URL 获取图片。
  - **AI 生成**: 根据 `alt` 描述利用火山引擎 Seedream 生成自定义视觉资产。
  - **智能回退**: 提供健壮的回退链（Src > AI 生成 > 占位符），确保布局永不损坏。
- **🔄 Tailwind ↔ Figma**: 
  - 将生成的或自定义的 Tailwind 代码直接转换为 Figma 图层。
  - 将选中的 Figma 框架转回 Tailwind CSS 代码。
- **🌍 国际化**: 全面支持英文（美国）和中文（简体）。
- **⚙️ 可配置模型**: 支持为对话、编码和图片生成自定义模型 ID，并带有智能默认回退。

## 快速上手

### 准备工作
- 机器上已安装 [Node.js](https://nodejs.org/)。
- 拥有火山引擎 Ark API 密钥。

### 安装步骤
1. 克隆此仓库。
2. 安装依赖：
   ```bash
   npm install
   ```
3. 构建插件：
   ```bash
   npm run build
   # 或用于开发模式
   npm run watch
   ```
4. 在 Figma 中，前往 `Plugins > Development > Import plugin from manifest...` 并选择该目录下的 `manifest.json`。

### 配置
1. 打开 Dogma 插件中的 **设置 (Settings)** 标签页。
2. 输入您的 **火山引擎 API Key**。
3. （可选）配置自定义 **模型 ID**。如果留空，插件将使用推荐的默认值。

## 开发相关

- `npm run watch`: 在您更改时持续构建插件和 UI。
- `npm run build`: 一次性生产环境构建。
- `src/code.ts`: Figma 插件主逻辑（图层创建、消息传递）。
- `src/ui/main.ts`: UI 逻辑和 AI 流水线编排。
- `src/builder.ts`: 将 HTML/Tailwind 转换为 Figma 节点的逻辑。

## 许可证
MIT
