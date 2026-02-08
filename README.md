# Dogma: Doubao Companion to Figma

Dogma is a powerful Figma plugin that leverages VolcEngine (Ark) AI models to bridge the gap between text descriptions, Tailwind CSS, and Figma designs. It allows designers and developers to generate high-fidelity UI components, refine them with style references, and handle images seamlessly.

## Key Features

- **🚀 AI Builder**: Generate standalone Tailwind CSS HTML snippets from simple text descriptions.
- **✨ Prompt Expansion**: Automatically expand brief UI descriptions into detailed requirement documents for better AI generation results.
- **🎨 Style Reference**: Select existing Figma frames to use as visual references. The AI will analyze the layout, colors, and typography to ensure consistency.
- **🖼️ Enhanced Image Integration**:
  - **External URLs**: Automatically fetches images from external `src` URLs.
  - **AI Generation**: Generates custom visual assets using VolcEngine Seedream based on `alt` descriptions.
  - **Smart Fallback**: Provides a robust fallback chain (Src > AI Generation > Placeholder) to ensure layouts never break.
- **🔄 Tailwind ↔ Figma**: 
  - Convert generated or custom Tailwind code directly into Figma layers.
  - Convert selected Figma frames back into Tailwind CSS code.
- **🌍 Internationalization**: Full support for both English (US) and Chinese (Simplified).
- **⚙️ Configurable Models**: Support for custom Model IDs for Chat, Coding, and Image generation, with smart default fallbacks.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.
- A VolcEngine Ark API Key.

### Installation
1. Clone this repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the plugin:
   ```bash
   npm run build
   # or for development
   npm run watch
   ```
4. In Figma, go to `Plugins > Development > Import plugin from manifest...` and select the `manifest.json` in this directory.

### Configuration
1. Open the **Settings** tab in the Dogma plugin.
2. Enter your **VolcEngine API Key**.
3. (Optional) Configure custom **Model IDs**. If left empty, the plugin will use the recommended defaults.

## Development

- `npm run watch`: Continuously build the plugin and UI as you make changes.
- `npm run build`: One-time build for production.
- `src/code.ts`: Main Figma plugin logic (layer creation, messaging).
- `src/ui/main.ts`: UI logic and AI pipeline orchestration.
- `src/builder.ts`: Logic for converting HTML/Tailwind to Figma nodes.

## License
MIT
