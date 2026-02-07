export const translations: Record<string, any> = {
    'zh-CN': {
        builderTab: '构建器',
        tailwindTab: 'Tailwind',
        settingsTab: '设置',
        aiBuilderTitle: 'AI 构建器',
        aiBuilderDesc: 'AI 将根据您的描述生成 Tailwind HTML。',
        promptPlaceholder: '例如：一个带有深色主题、醒目的号召性用语按钮和功能列表的高级着陆页英雄部分。',
        mobile: '📱 手机',
        desktop: '🖥️ 桌面',
        buildBtn: '在 Figma 中构建',
        expandBtn: '展开描述',
        stopBtn: '停止',
        tailwindTitle: 'Tailwind → Figma',
        tailwindDesc: '粘贴豆包应用生成的代码，转换为Figma设计稿。',
        htmlPlaceholder: '<div class="flex flex-col gap-4 p-6 bg-gray-900">...</div>',
        convertBtn: '转换',
        figmaToTailwind: 'Figma → Tailwind',
        selectFrame: '请先选中一个图层',
        converting: '转换中...',
        settingsTitle: '设置',
        settingsDesc: '配置您的火山引擎 Ark 凭据。',
        language: '语言',
        provider: '提供商',
        chatModelId: '聊天模型 ID (用于展开)',
        codingModelId: '编码模型 ID (用于构建)',
        apiKey: 'API 密钥',
        saveSettings: '保存设置',
        settingsSaved: '✓ 设置已保存',
        processingIcons: '正在处理图标...',
        sentToFigma: '✓ 已发送到 Figma',
        enterDescription: '请输入描述。',
        setApiKey: '请在设置标签页中设置 API 密钥。',
        expandingPrompt: '正在展开描述...',
        expanded: '✓ 已展开！',
        stoppedByUser: '用户已停止。',
        contactingAI: '正在联系 AI...',
        buildingLayers: '正在构建 Figma 图层...',
        buildComplete: '✓ 构建完成！',
        generationStopped: '生成已由用户停止。',
        errorPrefix: '错误: ',
        tokens: '令牌',
        aiThinking: 'AI 正在思考...',
        generating: '正在生成...',
        thinkingLabel: '深度思考'
    },
    'en-US': {
        builderTab: 'Builder',
        tailwindTab: 'Tailwind',
        settingsTab: 'Settings',
        aiBuilderTitle: 'AI Builder',
        aiBuilderDesc: 'AI will generate Tailwind HTML based on your prompt.',
        promptPlaceholder: 'e.g. A premium landing page hero section with a dark theme, a vibrant call-to-action button, and a feature list.',
        mobile: '📱 Mobile',
        desktop: '🖥️ Desktop',
        buildBtn: 'Build in Figma',
        expandBtn: 'Expand',
        stopBtn: 'Stop',
        tailwindTitle: 'Tailwind → Figma',
        tailwindDesc: 'Convert existing Tailwind HTML to Figma layers.',
        htmlPlaceholder: '<div class="flex flex-col gap-4 p-6 bg-gray-900">...</div>',
        convertBtn: 'Convert',
        figmaToTailwind: 'Figma → Tailwind',
        selectFrame: 'Please select a frame',
        converting: 'Converting...',
        settingsTitle: 'Settings',
        settingsDesc: 'Configure your VolcEngine Ark credentials.',
        language: 'Language',
        provider: 'Provider',
        chatModelId: 'Chat Model ID (for Expand)',
        codingModelId: 'Coding Model ID (for Builder)',
        apiKey: 'API Key',
        saveSettings: 'Save Settings',
        settingsSaved: '✓ Settings saved',
        processingIcons: 'Processing icons...',
        sentToFigma: '✓ Sent to Figma',
        enterDescription: 'Please enter a description.',
        setApiKey: 'Please set API Key in Settings tab.',
        expandingPrompt: 'Expanding prompt...',
        expanded: '✓ Expanded!',
        stoppedByUser: 'Stopped by user.',
        contactingAI: 'Contacting AI...',
        buildingLayers: 'Building Figma layers...',
        buildComplete: '✓ Build complete!',
        generationStopped: 'Generation stopped by user.',
        errorPrefix: 'Error: ',
        tokens: 'tokens',
        aiThinking: 'AI is thinking...',
        generating: 'Generating...',
        thinkingLabel: 'Thinking'
    }
};

export function updateUI(settings: any) {
    const lang = settings.language || 'zh-CN';
    const t = translations[lang];

    // Tabs
    document.querySelector('[data-tab="builder"]')!.textContent = t.builderTab;
    document.querySelector('[data-tab="tailwind"]')!.textContent = t.tailwindTab;
    document.querySelector('[data-tab="settings"]')!.textContent = t.settingsTab;

    // Builder Tab
    document.querySelector('#builder-tab h2')!.textContent = t.aiBuilderTitle;
    document.querySelector('#builder-tab .description')!.textContent = t.aiBuilderDesc;
    (document.getElementById('prompt-input') as HTMLTextAreaElement).placeholder = t.promptPlaceholder;
    document.querySelector('label[for="builder-mobile"]')!.textContent = t.mobile;
    document.querySelector('label[for="builder-desktop"]')!.textContent = t.desktop;
    document.querySelector('#build-btn')!.childNodes[2].textContent = t.buildBtn; // Respect spinner
    document.querySelector('#expand-btn')!.childNodes[2].textContent = t.expandBtn;
    document.getElementById('stop-btn')!.textContent = t.stopBtn;
    document.getElementById('thinking-status')!.textContent = t.aiThinking;
    document.getElementById('token-counter')!.textContent = `0 ${t.tokens}`;
    const thinkingLabelSpan = document.querySelector('label.checkbox-group span');
    if (thinkingLabelSpan) thinkingLabelSpan.textContent = t.thinkingLabel;

    // Tailwind Tab
    document.querySelector('#tailwind-tab h2')!.textContent = t.tailwindTitle;
    document.querySelector('#tailwind-tab .description')!.textContent = t.tailwindDesc;
    document.querySelector('label[for="mobile"]')!.textContent = t.mobile;
    document.querySelector('label[for="desktop"]')!.textContent = t.desktop;
    (document.getElementById('html-input') as HTMLTextAreaElement).placeholder = t.htmlPlaceholder;
    document.getElementById('convert')!.textContent = t.convertBtn;
    document.getElementById('figma-to-tailwind-btn')!.textContent = t.figmaToTailwind;

    // Settings Tab
    document.querySelector('#settings-tab h2')!.textContent = t.settingsTitle;
    document.querySelector('#settings-tab .description')!.textContent = t.settingsDesc;
    document.querySelector('label[data-i18n="language"]')!.textContent = t.language;
    document.querySelector('label[data-i18n="provider"]')!.textContent = t.provider;
    document.querySelector('label[data-i18n="chatModelId"]')!.textContent = t.chatModelId;
    document.querySelector('label[data-i18n="codingModelId"]')!.textContent = t.codingModelId;
    document.querySelector('label[data-i18n="apiKey"]')!.textContent = t.apiKey;
    document.getElementById('save-settings')!.textContent = t.saveSettings;
}
