import { translations, updateUI } from './i18n';
import { getIconsMap } from './ui-icons';

/* ============================================================================
   STATE & CONFIGURATION
   ============================================================================ */
let settings = {
    provider: 'volcengine',
    chatModelId: 'doubao-seed-1-8-251228',
    codingModelId: 'doubao-seed-code-preview-251028',
    apiKey: '',
    language: 'zh-CN',
    thinking: true
};

let abortController: AbortController | null = null;
let lastGeneratedCode = "";

/* ============================================================================
   TAB MANAGEMENT
   ============================================================================ */
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
    (tab as HTMLElement).onclick = () => {
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        tab.classList.add('active');
        const tabId = (tab as HTMLElement).dataset.tab;
        document.getElementById(`${tabId}-tab`)!.classList.add('active');
    };
});

/* ============================================================================
   INITIALIZATION
   ============================================================================ */
window.onmessage = (event) => {
    const msg = event.data.pluginMessage;
    if (!msg) return;

    // Handle tailwind-result from Figma
    if (msg.type === 'tailwind-result') {
        const status = document.getElementById('tailwind-status')!;
        const t = translations[settings.language];
        if (msg.error === 'no-selection') {
            status.textContent = t.selectFrame;
        } else {
            (document.getElementById('html-input') as HTMLTextAreaElement).value = msg.html || '';
            status.textContent = '';
        }
        return;
    }

    if (msg.type === 'load-settings' && msg.settings) {
        settings = Object.assign({}, settings, msg.settings);
        if (!settings.language) settings.language = 'zh-CN';

        // Backfill model IDs if missing from older settings
        if (!settings.chatModelId) settings.chatModelId = (msg.settings as any).modelId || 'doubao-seed-1-8-251228';
        if (!settings.codingModelId) settings.codingModelId = 'doubao-seed-code-preview-251028';

        (document.getElementById('language') as HTMLSelectElement).value = settings.language;
        (document.getElementById('provider') as HTMLSelectElement).value = settings.provider || 'volcengine';
        (document.getElementById('chat-model-id') as HTMLInputElement).value = settings.chatModelId;
        (document.getElementById('coding-model-id') as HTMLInputElement).value = settings.codingModelId;
        (document.getElementById('api-key') as HTMLInputElement).value = settings.apiKey || '';

        const thinkingCheckbox = document.getElementById('thinking-checkbox') as HTMLInputElement;
        if (thinkingCheckbox) thinkingCheckbox.checked = settings.thinking !== false;

        updateUI(settings);
    } else {
        updateUI(settings);
    }
};

/* ============================================================================
   SETTINGS LOGIC
   ============================================================================ */
document.getElementById('language')!.onchange = (e) => {
    settings.language = (e.target as HTMLSelectElement).value;
    updateUI(settings);
};

document.getElementById('save-settings')!.onclick = () => {
    settings.language = (document.getElementById('language') as HTMLSelectElement).value;
    settings.provider = (document.getElementById('provider') as HTMLSelectElement).value;
    settings.chatModelId = (document.getElementById('chat-model-id') as HTMLInputElement).value;
    settings.codingModelId = (document.getElementById('coding-model-id') as HTMLInputElement).value;
    settings.apiKey = (document.getElementById('api-key') as HTMLInputElement).value;
    settings.thinking = (document.getElementById('thinking-checkbox') as HTMLInputElement).checked;

    parent.postMessage({ pluginMessage: { type: 'save-settings', settings } }, '*');

    const t = translations[settings.language];
    const status = document.getElementById('settings-status')!;
    status.textContent = t.settingsSaved;
    setTimeout(() => { status.textContent = ''; }, 2000);
};

/* ============================================================================
   AI BUILDER HANDLERS
   ============================================================================ */
const copyBtn = document.getElementById('copy-btn')!;
copyBtn.onclick = () => {
    if (!lastGeneratedCode) return;
    const textArea = document.createElement("textarea");
    textArea.value = lastGeneratedCode;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("Copy");
    textArea.remove();

    const originalHTML = copyBtn.innerHTML;
    copyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    setTimeout(() => {
        copyBtn.innerHTML = originalHTML;
    }, 2000);
};

document.getElementById('stop-btn')!.onclick = () => {
    if (abortController) {
        abortController.abort();
    }
};

const handleStream = async (response: Response, onText: (text: string, reasoning: string) => void) => {
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let fullText = "";
    let reasoningText = "";

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
            if (line.trim().startsWith('data: ')) {
                const dataText = line.trim().slice(6);
                if (dataText === '[DONE]') continue;

                try {
                    const data = JSON.parse(dataText);
                    const delta = data.choices[0].delta;

                    if (delta.reasoning_content) {
                        reasoningText += delta.reasoning_content;
                    } else if (delta.content) {
                        fullText += delta.content;
                    }
                    onText(fullText, reasoningText);
                } catch (e) {
                    console.warn('Failed to parse chunk:', dataText);
                }
            }
        }
    }
    return { fullText, reasoningText };
};

document.getElementById('expand-btn')!.onclick = async () => {
    const promptInput = document.getElementById('prompt-input') as HTMLTextAreaElement;
    const prompt = promptInput.value;
    const btn = document.getElementById('expand-btn') as HTMLButtonElement;
    const buildBtn = document.getElementById('build-btn') as HTMLButtonElement;
    const status = document.getElementById('builder-status')!;
    const thinkingContainer = document.getElementById('thinking-container')!;
    const t = translations[settings.language];

    if (!prompt) { status.textContent = t.enterDescription; return; }
    if (!settings.apiKey) { status.textContent = t.setApiKey; return; }

    btn.disabled = true;
    buildBtn.disabled = true;
    btn.classList.add('loading');
    status.textContent = '';
    status.style.display = 'none';
    thinkingContainer.classList.add('active');
    document.getElementById('thinking-status')!.textContent = t.expandingPrompt;

    abortController = new AbortController();

    try {
        const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
            method: 'POST',
            signal: abortController.signal,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${settings.apiKey}`
            },
            body: JSON.stringify({
                model: settings.chatModelId,
                stream: true,
                thinking: (document.getElementById('thinking-checkbox') as HTMLInputElement).checked ? undefined : { type: 'disabled' },
                messages: [
                    {
                        role: 'system',
                        content: `You are an expert product manager and UX designer. TASK: Expand the user's short description into a detailed requirement document for a web page design in Figma. Focus on: 1. UI components (e.g., sections, buttons, input fields, text blocks). 2. One or two sentences about the task the user is going to accomplish. IMPORTANT: Do NOT include detailed colors, typography specs, or style descriptions (e.g., "blue gradient", "rounded corners"). Return ONLY the expanded description text, no intro/outro. OUTPUT LANGUAGE: ${settings.language === 'zh-CN' ? 'Chinese (Simplified)' : 'English'}`
                    },
                    { role: 'user', content: prompt }
                ]
            })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error?.message || 'API request failed');
        }

        promptInput.value = "";
        await handleStream(response, (text, reasoning) => {
            if (reasoning) document.getElementById('thinking-status')!.textContent = t.aiThinking;
            else document.getElementById('thinking-status')!.textContent = t.generating;

            promptInput.value = text;
            promptInput.scrollTop = promptInput.scrollHeight;
            lastGeneratedCode = text;
            const tokens = Math.floor((reasoning.length + text.length) / 4);
            document.getElementById('token-counter')!.textContent = `${tokens} ${t.tokens}`;
        });

        status.textContent = t.expanded;
    } catch (err: any) {
        if (err.name === 'AbortError') status.textContent = t.stoppedByUser;
        else status.textContent = `${t.errorPrefix}${err.message}`;
    } finally {
        status.style.display = 'block';
        btn.disabled = false;
        buildBtn.disabled = false;
        btn.classList.remove('loading');
        thinkingContainer.classList.remove('active');
        if (lastGeneratedCode) copyBtn.style.display = 'flex';
        abortController = null;
    }
};

document.getElementById('build-btn')!.onclick = async () => {
    const prompt = (document.getElementById('prompt-input') as HTMLTextAreaElement).value;
    const viewport = (document.querySelector('input[name="builder-viewport"]:checked') as HTMLInputElement).value;
    const btn = document.getElementById('build-btn') as HTMLButtonElement;
    const expandBtn = document.getElementById('expand-btn') as HTMLButtonElement;
    const status = document.getElementById('builder-status')!;
    const thinkingContainer = document.getElementById('thinking-container')!;
    const t = translations[settings.language];

    if (!prompt) { status.textContent = t.enterDescription; return; }
    if (!settings.apiKey) { status.textContent = t.setApiKey; return; }

    btn.disabled = true;
    expandBtn.disabled = true;
    btn.classList.add('loading');
    status.textContent = '';
    status.style.display = 'none';
    copyBtn.style.display = 'none';
    thinkingContainer.classList.add('active');
    document.getElementById('thinking-status')!.textContent = t.contactingAI;

    abortController = new AbortController();

    const viewportDesc = viewport === 'mobile'
        ? "Target Viewport: Mobile (375px width). Use single-column layouts, larger touch targets, and vertical stacking."
        : "Target Viewport: Desktop (1440px width). Use multi-column layouts, horizontal alignment, and whitespace effectively.";

    try {
        const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
            method: 'POST',
            signal: abortController.signal,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${settings.apiKey}`
            },
            body: JSON.stringify({
                model: settings.codingModelId,
                stream: true,
                thinking: (document.getElementById('thinking-checkbox') as HTMLInputElement).checked ? undefined : { type: 'disabled' },
                messages: [
                    {
                        role: 'system',
                        content: `You are an elite UI engineer. TASK: Generate a standalone HTML snippet using Tailwind CSS classes based on the user description. ${viewportDesc} RULES: 1. Only return code, no markdown block wrappers. 2. Use modern, premium aesthetics. 3. Ensure full responsiveness. 4. Use Font Awesome icons where appropriate (fa-solid fa-icon) and vibrant colors. 5. Include decent padding and gap for a clean look. 6. Content Language: ${settings.language === 'zh-CN' ? 'Chinese (Simplified)' : 'English'}. Ensure all text in the generated HTML is in ${settings.language === 'zh-CN' ? 'Chinese' : 'English'}. 7. IMPORTANT: Strictly AVOID using standard CSS or inline style="" attributes. Use ONLY pure Tailwind CSS utility classes. 8. Enclose ALL background colors and specific styling in Tailwind arbitrary value classes (e.g., bg-[#123456], text-[#abcdef]) directly in the class names. 9. AVOID using CSS Grid. Always prefer Flexbox for all layouts to ensure compatibility with Figma Auto Layout. Explicitly specify flex direction using 'flex-row' (preferred/default) or 'flex-col' for all flex containers. Use Grid ONLY as a last resort for extremely complex 2D structures.`
                    },
                    { role: 'user', content: prompt }
                ]
            })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error?.message || 'API request failed');
        }

        const { fullText: fullHtml } = await handleStream(response, (text, reasoning) => {
            if (reasoning) document.getElementById('thinking-status')!.textContent = t.aiThinking;
            else document.getElementById('thinking-status')!.textContent = t.generating;

            const tokens = Math.floor((reasoning.length + text.length) / 4);
            document.getElementById('token-counter')!.textContent = `${tokens} ${t.tokens}`;
            lastGeneratedCode = text;
        });

        let html = fullHtml.trim();
        html = html.replace(/^```html\n?/, '').replace(/\n?```$/, '');

        document.getElementById('thinking-status')!.textContent = t.buildingLayers;
        const iconMap = await getIconsMap(html);

        status.textContent = t.buildingLayers;
        parent.postMessage({ pluginMessage: { type: 'convert-html', html, viewport, icons: iconMap } }, '*');
        status.textContent = t.buildComplete;

    } catch (err: any) {
        if (err.name === 'AbortError') status.textContent = t.generationStopped;
        else status.textContent = `${t.errorPrefix}${err.message}`;
    } finally {
        status.style.display = 'block';
        btn.disabled = false;
        expandBtn.disabled = false;
        btn.classList.remove('loading');
        thinkingContainer.classList.remove('active');
        if (lastGeneratedCode) copyBtn.style.display = 'flex';
        abortController = null;
    }
};

document.getElementById('figma-to-tailwind-btn')!.onclick = () => {
    const status = document.getElementById('tailwind-status')!;
    const t = translations[settings.language];
    status.textContent = t.converting;
    parent.postMessage({ pluginMessage: { type: 'figma-to-tailwind' } }, '*');
};

/* ============================================================================
   TAILWIND CONVERTER HANDLERS
   ============================================================================ */
document.getElementById('convert')!.onclick = async () => {
    const html = (document.getElementById('html-input') as HTMLTextAreaElement).value;
    const viewport = (document.querySelector('input[name="viewport"]:checked') as HTMLInputElement).value;
    const status = document.getElementById('tailwind-status')!;
    const t = translations[settings.language];

    if (!html) return;
    status.textContent = t.processingIcons;
    const iconMap = await getIconsMap(html);

    parent.postMessage({ pluginMessage: { type: 'convert-html', html, viewport, icons: iconMap } }, '*');
    status.textContent = t.sentToFigma;
    setTimeout(() => { status.textContent = ''; }, 2000);
};
