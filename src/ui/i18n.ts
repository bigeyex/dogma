export const translations: Record<string, any> = {
    'zh-CN': {
        builderTab: '生成设计',
        tailwindTab: 'Tailwind',
        settingsTab: '设置',
        aiBuilderTitle: '生成设计',
        aiBuilderDesc: '根据提示词生成设计稿。新生成内容会出现在选中Frame右侧',
        promptPlaceholder: '例如：一个带有深色主题、醒目的号召性用语按钮和功能列表的高级着陆页英雄部分。',
        mobile: '📱 手机',
        desktop: '🖥️ 桌面',
        buildBtn: '生成设计',
        expandBtn: '扩写提示词',
        editInPlace: '就地编辑',
        editInPlaceWorking: '正在就地编辑...',
        editInPlaceComplete: '✓ 就地编辑完成！',
        noArtboardFound: '请在画板中选择一个元素',
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
        thinkingLabel: '深度思考',
        refStyle: '参考样式',
        uploadingImage: '正在上传图片...',
        noFrameSelected: '请先选中一个图层 (Frame)',
        refAdded: '已添加参考',
        generateImage: '生成图片',
        imageModelId: '图片模型 Endpoint ID',
        processingImage: (n: number, total: number) => `正在处理图片 ${n}/${total}...`,
        exportingArtboard: '正在导出画板...',
        replacingSelection: '正在替换选中内容...',
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
        expandBtn: 'Expand Prompt',
        editInPlace: 'Edit in Place',
        editInPlaceWorking: 'Editing in place...',
        editInPlaceComplete: '✓ Edit in place complete!',
        noArtboardFound: 'Please select an element within an artboard',
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
        thinkingLabel: 'Thinking',
        refStyle: 'Ref Style',
        uploadingImage: 'Uploading image...',
        noFrameSelected: 'Please select a frame',
        refAdded: 'Reference added',
        generateImage: 'Gen Image',
        imageModelId: 'Image Model Endpoint ID',
        processingImage: (n: number, total: number) => `Processing image ${n}/${total}...`,
        exportingArtboard: 'Exporting artboard...',
        replacingSelection: 'Replacing selection...',
    },
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
    document.querySelector('#edit-in-place-btn')!.childNodes[2].textContent = t.editInPlace;
    const expandIconBtn = document.getElementById('expand-icon-btn');
    if (expandIconBtn) {
        expandIconBtn.setAttribute('data-tooltip', t.expandBtn);
        expandIconBtn.removeAttribute('title');
    }
    document.getElementById('stop-btn')!.textContent = t.stopBtn;
    document.getElementById('thinking-status')!.textContent = t.aiThinking;
    document.getElementById('token-counter')!.textContent = `0 ${t.tokens}`;
    const thinkingLabel = document.getElementById('thinking-label');
    if (thinkingLabel) thinkingLabel.textContent = t.thinkingLabel;
    const generateImageLabel = document.getElementById('generate-image-label');
    if (generateImageLabel) generateImageLabel.textContent = t.generateImage;

    // Style Ref
    const addRefBtn = document.getElementById('add-ref-btn');
    if (addRefBtn) {
        addRefBtn.childNodes[2].textContent = t.refStyle;
    }

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
    const imageModelIdLabel = document.getElementById('image-model-id-label');
    if (imageModelIdLabel) imageModelIdLabel.textContent = t.imageModelId;
    document.querySelector('label[data-i18n="apiKey"]')!.textContent = t.apiKey;
    document.getElementById('save-settings')!.textContent = t.saveSettings;
}
