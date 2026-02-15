import { translations, updateUI } from './i18n';
import { getIconsMap } from './ui-icons';

/* ============================================================================
   STATE & CONFIGURATION
   ============================================================================ */
export const DEFAULT_CHAT_MODEL = 'doubao-seed-1-8-251228';
export const DEFAULT_CODING_MODEL = 'doubao-seed-code-preview-251028';
export const DEFAULT_IMAGE_MODEL = 'doubao-seedream-4-5-251128';

let settings = {
    provider: 'volcengine',
    chatModelId: '', // Empty means use default
    codingModelId: '', // Empty means use default
    apiKey: '',
    language: 'zh-CN',
    thinking: true,
    generateImage: false,
    imageModelId: '' // Empty means use default
};

let styleRefs: Array<{ id?: string, name: string, imageData?: string, loading?: boolean }> = [];

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
        (document.getElementById('chat-model-id') as HTMLInputElement).value = settings.chatModelId || '';
        (document.getElementById('coding-model-id') as HTMLInputElement).value = settings.codingModelId || '';
        (document.getElementById('api-key') as HTMLInputElement).value = settings.apiKey || '';

        const thinkingCheckbox = document.getElementById('thinking-checkbox') as HTMLInputElement;
        if (thinkingCheckbox) thinkingCheckbox.checked = settings.thinking !== false;

        const generateImageCheckbox = document.getElementById('generate-image-checkbox') as HTMLInputElement;
        if (generateImageCheckbox) generateImageCheckbox.checked = settings.generateImage === true;

        (document.getElementById('image-model-id') as HTMLInputElement).value = settings.imageModelId || '';

        updateUI(settings);
    } else if (msg.type === 'export-frame-result') {
        const t = translations[settings.language];
        const status = document.getElementById('builder-status')!;

        // Find the loading item
        const loadingIndex = styleRefs.findIndex(ref => ref.loading);

        if (msg.error) {
            if (loadingIndex !== -1) styleRefs.splice(loadingIndex, 1);
            status.textContent = msg.error === 'no-selection' ? t.noFrameSelected : t.noFrameSelected;
            status.style.display = 'block';
            updateRefList();
            return;
        }

        if (styleRefs.some(ref => ref.id === msg.id)) {
            if (loadingIndex !== -1) styleRefs.splice(loadingIndex, 1);
            updateRefList();
            return;
        }

        if (loadingIndex !== -1) {
            styleRefs[loadingIndex] = {
                id: msg.id,
                name: msg.name,
                imageData: msg.imageData,
                loading: false
            };
        } else {
            styleRefs.push({
                id: msg.id,
                name: msg.name,
                imageData: msg.imageData,
                loading: false
            });
        }
        updateRefList();
    } else {
        updateUI(settings);
    }
};

function updateRefList() {
    const container = document.getElementById('ref-items')!;
    container.innerHTML = '';
    styleRefs.forEach((ref, index) => {
        const item = document.createElement('div');
        item.className = 'ref-item';
        const name = ref.loading ? '...' : (ref.name || '').substring(0, 6);
        const actionHtml = ref.loading
            ? '<div class="item-spinner"></div>'
            : `<span class="remove-btn" data-index="${index}">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
               </span>`;

        item.innerHTML = `
            <span>${name}</span>
            ${actionHtml}
        `;

        if (!ref.loading) {
            item.querySelector('.remove-btn')!.addEventListener('click', () => {
                styleRefs.splice(index, 1);
                updateRefList();
            });
        }
        container.appendChild(item);
    });
}

/* ============================================================================
   SETTINGS LOGIC
   ============================================================================ */
document.getElementById('language')!.onchange = (e) => {
    settings.language = (e.target as HTMLSelectElement).value;
    updateUI(settings);
};

document.getElementById('thinking-checkbox')!.onchange = (e) => {
    settings.thinking = (e.target as HTMLInputElement).checked;
};

document.getElementById('generate-image-checkbox')!.onchange = (e) => {
    settings.generateImage = (e.target as HTMLInputElement).checked;
};

document.getElementById('save-settings')!.onclick = () => {
    settings.language = (document.getElementById('language') as HTMLSelectElement).value;
    settings.provider = (document.getElementById('provider') as HTMLSelectElement).value;
    settings.chatModelId = (document.getElementById('chat-model-id') as HTMLInputElement).value;
    settings.codingModelId = (document.getElementById('coding-model-id') as HTMLInputElement).value;
    settings.apiKey = (document.getElementById('api-key') as HTMLInputElement).value;
    settings.thinking = (document.getElementById('thinking-checkbox') as HTMLInputElement).checked;
    settings.generateImage = (document.getElementById('generate-image-checkbox') as HTMLInputElement).checked;
    settings.imageModelId = (document.getElementById('image-model-id') as HTMLInputElement).value;

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

document.getElementById('add-ref-btn')!.onclick = () => {
    // Only allow one loading ref at a time for simplicity and to match Figma selection
    if (styleRefs.some(ref => ref.loading)) return;

    styleRefs.push({ name: 'Loading', loading: true });
    updateRefList();
    parent.postMessage({ pluginMessage: { type: 'export-frame-image' } }, '*');
};

document.getElementById('stop-btn')!.onclick = () => {
    if (abortController) {
        abortController.abort();
    }
};

const processImages = async (html: string, settings: any, abortController: AbortController | null): Promise<string> => {
    const t = translations[settings.language];
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const imgs = Array.from(doc.querySelectorAll('img'));

    if (imgs.length === 0) return html;

    for (let i = 0; i < imgs.length; i++) {
        const img = imgs[i] as HTMLImageElement;
        const src = img.getAttribute('src');
        const alt = img.getAttribute('alt');
        let resolvedBase64 = '';

        document.getElementById('thinking-status')!.textContent = t.processingImage(i + 1, imgs.length);

        // 1. Try to fetch external src
        if (src && src.startsWith('http')) {
            try {
                const res = await fetch(src, { signal: abortController?.signal });
                if (res.ok) {
                    const blob = await res.blob();
                    if (blob.size > 0) {
                        resolvedBase64 = await new Promise((resolve) => {
                            const reader = new FileReader();
                            reader.onloadend = () => resolve(reader.result as string);
                            reader.readAsDataURL(blob);
                        });
                    }
                }
            } catch (e) {
                console.error('Failed to fetch image src:', e);
            }
        }

        // 2. Try to generate via alt if no src or fetch failed
        if (!resolvedBase64 && alt && settings.generateImage && !alt.startsWith('http')) {
            try {
                const res = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
                    method: 'POST',
                    signal: abortController?.signal,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${settings.apiKey}`
                    },
                    body: JSON.stringify({
                        model: settings.imageModelId || DEFAULT_IMAGE_MODEL,
                        prompt: alt,
                        response_format: 'b64_json'
                    })
                });

                if (res.ok) {
                    const data = await res.json();
                    const b64 = data.data?.[0]?.b64_json;
                    if (b64) {
                        resolvedBase64 = `data:image/png;base64,${b64}`;
                    }
                }
            } catch (e) {
                console.error('AI image generation failed:', e);
            }
        }

        if (resolvedBase64) {
            img.setAttribute('src', resolvedBase64);
        }
    }

    return doc.body.innerHTML;
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
        const messageContent: any[] = [];
        styleRefs.filter(ref => !ref.loading && ref.imageData).forEach(ref => {
            messageContent.push({
                type: 'image_url',
                image_url: { url: `data:image/png;base64,${ref.imageData}` }
            });
        });

        const styleInstruction = styleRefs.filter(ref => !ref.loading && ref.imageData).length > 0
            ? `[Style Reference: Study the visual style, colors, typography, and layout patterns from the attached image(s). Keep the summary concise.]\n\n`
            : "";

        const imageInstruction = settings.generateImage
            ? "Note: The user intends to generate images. Ensure the expanded prompt includes highly detailed visual descriptions suitable for image generation prompts, including specifications about how the images should blend with the overall design style (colors, lighting, and layout). IMPORTANT: Generate visual materials only, avoid generating charts, structure diagrams, schematics, or any content with text.\n\n"
            : "Note: Do NOT include any image generation prompts or mention images in the expanded description, as image generation is disabled.\n\n";

        messageContent.push({ type: 'text', text: styleInstruction + imageInstruction + prompt });

        const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
            method: 'POST',
            signal: abortController.signal,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${settings.apiKey}`
            },
            body: JSON.stringify({
                model: settings.chatModelId || DEFAULT_CHAT_MODEL,
                stream: true,
                thinking: settings.thinking ? undefined : { type: 'disabled' },
                messages: [
                    {
                        role: 'system',
                        content: `You are a creative UI prompt engineer. Expand the user's brief UI description into a detailed, descriptive prompt for an AI UI generator. Focus on layout, style, color schemes, and visual elements. Keep the response as a single, well-structured paragraph.`
                    },
                    { role: 'user', content: messageContent }
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
        const messageContent: any[] = [];
        styleRefs.filter(ref => !ref.loading && ref.imageData).forEach(ref => {
            messageContent.push({
                type: 'image_url',
                image_url: { url: `data:image/png;base64,${ref.imageData}` }
            });
        });

        const styleInstruction = styleRefs.filter(ref => !ref.loading && ref.imageData).length > 0
            ? `[Style Reference: Study the visual style, colors, typography, and layout patterns from the attached image(s). Apply similar aesthetics to the generated design, but follow the text instructions for content and structure. Ensure all text in the generated HTML is in ${settings.language === 'zh-CN' ? 'Chinese' : 'English'}.]\n\n`
            : "";

        messageContent.push({ type: 'text', text: styleInstruction + prompt });

        const imageSystemRule = settings.generateImage
            ? "10. IMPORTANT: You can generate images using <img> tags. For each image, provide a DETAILED visual description in the 'alt' attribute that will be used as an image generation prompt. Include specific details about the scene, subject, lighting, and how the image should blend perfectly with the rest of the design's colors and aesthetic. IMPORTANT: Generate visual materials only, avoid generating charts, structure diagrams, schematics, or any content with text. Do NOT specify any 'src' attribute for images."
            : "10. IMPORTANT: Image generation is currently disabled. Do NOT generate any <img> tags, placeholders, or references to external images.";

        const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
            method: 'POST',
            signal: abortController.signal,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${settings.apiKey}`
            },
            body: JSON.stringify({
                model: settings.codingModelId || DEFAULT_CODING_MODEL,
                stream: true,
                thinking: settings.thinking ? undefined : { type: 'disabled' },
                messages: [
                    {
                        role: 'system',
                        content: `You are an elite UI engineer. TASK: Generate a standalone HTML snippet using Tailwind CSS classes based on the user description. ${viewportDesc} RULES: 1. Only return code, no markdown block wrappers. 2. Use modern, premium aesthetics. 3. Ensure full responsiveness. 4. Use Font Awesome icons where appropriate (fa-solid fa-icon) and vibrant colors. 5. Include decent padding and gap for a clean look. 6. Content Language: ${settings.language === 'zh-CN' ? 'Chinese (Simplified)' : 'English'}. Ensure all text in the generated HTML is in ${settings.language === 'zh-CN' ? 'Chinese' : 'English'}. 7. IMPORTANT: Strictly AVOID using standard CSS or inline style="" attributes. Use ONLY pure Tailwind CSS utility classes. 8. Enclose ALL background colors and specific styling in Tailwind arbitrary value classes (e.g., bg-[#123456], text-[#abcdef]) directly in the class names. 9. AVOID using CSS Grid. Always prefer Flexbox for all layouts to ensure compatibility with Figma Auto Layout. Explicitly specify flex direction using 'flex-row' (preferred/default) or 'flex-col' for all flex containers. ${imageSystemRule}`
                    },
                    { role: 'user', content: messageContent }
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

        // Resolve images (Fetch or Generate)
        html = await processImages(html, settings, abortController);

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
    let html = (document.getElementById('html-input') as HTMLTextAreaElement).value;
    const viewport = (document.querySelector('input[name="viewport"]:checked') as HTMLInputElement).value;
    const status = document.getElementById('tailwind-status')!;
    const thinkingContainer = document.getElementById('thinking-container')!;
    const t = translations[settings.language];

    if (!html) return;

    thinkingContainer.classList.add('active');
    status.style.display = 'none';

    try {
        // Resolve images (Fetch or Generate)
        html = await processImages(html, settings, null);

        const iconMap = await getIconsMap(html);
        parent.postMessage({ pluginMessage: { type: 'convert-html', html, viewport, icons: iconMap } }, '*');
        status.textContent = t.sentToFigma;
        status.style.display = 'block';
    } catch (e: any) {
        status.textContent = `${t.errorPrefix}${e.message}`;
        status.style.display = 'block';
    } finally {
        thinkingContainer.classList.remove('active');
        setTimeout(() => { if (status.textContent === t.sentToFigma) status.textContent = ''; status.style.display = 'none'; }, 2000);
    }
};
