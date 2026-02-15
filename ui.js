"use strict";
(() => {
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // src/ui/i18n.ts
  var translations = {
    "zh-CN": {
      builderTab: "\u751F\u6210\u8BBE\u8BA1",
      tailwindTab: "Tailwind",
      settingsTab: "\u8BBE\u7F6E",
      aiBuilderTitle: "\u751F\u6210\u8BBE\u8BA1",
      aiBuilderDesc: "\u6839\u636E\u63D0\u793A\u8BCD\u751F\u6210\u8BBE\u8BA1\u7A3F\u3002\u65B0\u751F\u6210\u5185\u5BB9\u4F1A\u51FA\u73B0\u5728\u9009\u4E2DFrame\u53F3\u4FA7",
      promptPlaceholder: "\u4F8B\u5982\uFF1A\u4E00\u4E2A\u5E26\u6709\u6DF1\u8272\u4E3B\u9898\u3001\u9192\u76EE\u7684\u53F7\u53EC\u6027\u7528\u8BED\u6309\u94AE\u548C\u529F\u80FD\u5217\u8868\u7684\u9AD8\u7EA7\u7740\u9646\u9875\u82F1\u96C4\u90E8\u5206\u3002",
      mobile: "\u{1F4F1} \u624B\u673A",
      desktop: "\u{1F5A5}\uFE0F \u684C\u9762",
      buildBtn: "\u751F\u6210\u8BBE\u8BA1",
      expandBtn: "\u5C55\u5F00\u63CF\u8FF0",
      stopBtn: "\u505C\u6B62",
      tailwindTitle: "Tailwind \u2192 Figma",
      tailwindDesc: "\u7C98\u8D34\u8C46\u5305\u5E94\u7528\u751F\u6210\u7684\u4EE3\u7801\uFF0C\u8F6C\u6362\u4E3AFigma\u8BBE\u8BA1\u7A3F\u3002",
      htmlPlaceholder: '<div class="flex flex-col gap-4 p-6 bg-gray-900">...</div>',
      convertBtn: "\u8F6C\u6362",
      figmaToTailwind: "Figma \u2192 Tailwind",
      selectFrame: "\u8BF7\u5148\u9009\u4E2D\u4E00\u4E2A\u56FE\u5C42",
      converting: "\u8F6C\u6362\u4E2D...",
      settingsTitle: "\u8BBE\u7F6E",
      settingsDesc: "\u914D\u7F6E\u60A8\u7684\u706B\u5C71\u5F15\u64CE Ark \u51ED\u636E\u3002",
      language: "\u8BED\u8A00",
      provider: "\u63D0\u4F9B\u5546",
      chatModelId: "\u804A\u5929\u6A21\u578B ID (\u7528\u4E8E\u5C55\u5F00)",
      codingModelId: "\u7F16\u7801\u6A21\u578B ID (\u7528\u4E8E\u6784\u5EFA)",
      apiKey: "API \u5BC6\u94A5",
      saveSettings: "\u4FDD\u5B58\u8BBE\u7F6E",
      settingsSaved: "\u2713 \u8BBE\u7F6E\u5DF2\u4FDD\u5B58",
      processingIcons: "\u6B63\u5728\u5904\u7406\u56FE\u6807...",
      sentToFigma: "\u2713 \u5DF2\u53D1\u9001\u5230 Figma",
      enterDescription: "\u8BF7\u8F93\u5165\u63CF\u8FF0\u3002",
      setApiKey: "\u8BF7\u5728\u8BBE\u7F6E\u6807\u7B7E\u9875\u4E2D\u8BBE\u7F6E API \u5BC6\u94A5\u3002",
      expandingPrompt: "\u6B63\u5728\u5C55\u5F00\u63CF\u8FF0...",
      expanded: "\u2713 \u5DF2\u5C55\u5F00\uFF01",
      stoppedByUser: "\u7528\u6237\u5DF2\u505C\u6B62\u3002",
      contactingAI: "\u6B63\u5728\u8054\u7CFB AI...",
      buildingLayers: "\u6B63\u5728\u6784\u5EFA Figma \u56FE\u5C42...",
      buildComplete: "\u2713 \u6784\u5EFA\u5B8C\u6210\uFF01",
      generationStopped: "\u751F\u6210\u5DF2\u7531\u7528\u6237\u505C\u6B62\u3002",
      errorPrefix: "\u9519\u8BEF: ",
      tokens: "\u4EE4\u724C",
      aiThinking: "AI \u6B63\u5728\u601D\u8003...",
      generating: "\u6B63\u5728\u751F\u6210...",
      thinkingLabel: "\u6DF1\u5EA6\u601D\u8003",
      refStyle: "\u53C2\u8003\u6837\u5F0F",
      uploadingImage: "\u6B63\u5728\u4E0A\u4F20\u56FE\u7247...",
      noFrameSelected: "\u8BF7\u5148\u9009\u4E2D\u4E00\u4E2A\u56FE\u5C42 (Frame)",
      refAdded: "\u5DF2\u6DFB\u52A0\u53C2\u8003",
      generateImage: "\u751F\u6210\u56FE\u7247",
      imageModelId: "\u56FE\u7247\u6A21\u578B Endpoint ID",
      processingImage: (n, total) => `\u6B63\u5728\u5904\u7406\u56FE\u7247 ${n}/${total}...`
    },
    "en-US": {
      builderTab: "Builder",
      tailwindTab: "Tailwind",
      settingsTab: "Settings",
      aiBuilderTitle: "AI Builder",
      aiBuilderDesc: "AI will generate Tailwind HTML based on your prompt.",
      promptPlaceholder: "e.g. A premium landing page hero section with a dark theme, a vibrant call-to-action button, and a feature list.",
      mobile: "\u{1F4F1} Mobile",
      desktop: "\u{1F5A5}\uFE0F Desktop",
      buildBtn: "Build in Figma",
      expandBtn: "Expand",
      stopBtn: "Stop",
      tailwindTitle: "Tailwind \u2192 Figma",
      tailwindDesc: "Convert existing Tailwind HTML to Figma layers.",
      htmlPlaceholder: '<div class="flex flex-col gap-4 p-6 bg-gray-900">...</div>',
      convertBtn: "Convert",
      figmaToTailwind: "Figma \u2192 Tailwind",
      selectFrame: "Please select a frame",
      converting: "Converting...",
      settingsTitle: "Settings",
      settingsDesc: "Configure your VolcEngine Ark credentials.",
      language: "Language",
      provider: "Provider",
      chatModelId: "Chat Model ID (for Expand)",
      codingModelId: "Coding Model ID (for Builder)",
      apiKey: "API Key",
      saveSettings: "Save Settings",
      settingsSaved: "\u2713 Settings saved",
      processingIcons: "Processing icons...",
      sentToFigma: "\u2713 Sent to Figma",
      enterDescription: "Please enter a description.",
      setApiKey: "Please set API Key in Settings tab.",
      expandingPrompt: "Expanding prompt...",
      expanded: "\u2713 Expanded!",
      stoppedByUser: "Stopped by user.",
      contactingAI: "Contacting AI...",
      buildingLayers: "Building Figma layers...",
      buildComplete: "\u2713 Build complete!",
      generationStopped: "Generation stopped by user.",
      errorPrefix: "Error: ",
      tokens: "tokens",
      aiThinking: "AI is thinking...",
      generating: "Generating...",
      thinkingLabel: "Thinking",
      refStyle: "Ref Style",
      uploadingImage: "Uploading image...",
      noFrameSelected: "Please select a frame",
      refAdded: "Reference added",
      generateImage: "Gen Image",
      imageModelId: "Image Model Endpoint ID",
      processingImage: (n, total) => `Processing image ${n}/${total}...`
    }
  };
  function updateUI(settings2) {
    const lang = settings2.language || "zh-CN";
    const t = translations[lang];
    document.querySelector('[data-tab="builder"]').textContent = t.builderTab;
    document.querySelector('[data-tab="tailwind"]').textContent = t.tailwindTab;
    document.querySelector('[data-tab="settings"]').textContent = t.settingsTab;
    document.querySelector("#builder-tab h2").textContent = t.aiBuilderTitle;
    document.querySelector("#builder-tab .description").textContent = t.aiBuilderDesc;
    document.getElementById("prompt-input").placeholder = t.promptPlaceholder;
    document.querySelector('label[for="builder-mobile"]').textContent = t.mobile;
    document.querySelector('label[for="builder-desktop"]').textContent = t.desktop;
    document.querySelector("#build-btn").childNodes[2].textContent = t.buildBtn;
    document.querySelector("#expand-btn").childNodes[2].textContent = t.expandBtn;
    document.getElementById("stop-btn").textContent = t.stopBtn;
    document.getElementById("thinking-status").textContent = t.aiThinking;
    document.getElementById("token-counter").textContent = `0 ${t.tokens}`;
    const thinkingLabel = document.getElementById("thinking-label");
    if (thinkingLabel) thinkingLabel.textContent = t.thinkingLabel;
    const generateImageLabel = document.getElementById("generate-image-label");
    if (generateImageLabel) generateImageLabel.textContent = t.generateImage;
    const addRefBtn = document.getElementById("add-ref-btn");
    if (addRefBtn) {
      addRefBtn.childNodes[2].textContent = t.refStyle;
    }
    document.querySelector("#tailwind-tab h2").textContent = t.tailwindTitle;
    document.querySelector("#tailwind-tab .description").textContent = t.tailwindDesc;
    document.querySelector('label[for="mobile"]').textContent = t.mobile;
    document.querySelector('label[for="desktop"]').textContent = t.desktop;
    document.getElementById("html-input").placeholder = t.htmlPlaceholder;
    document.getElementById("convert").textContent = t.convertBtn;
    document.getElementById("figma-to-tailwind-btn").textContent = t.figmaToTailwind;
    document.querySelector("#settings-tab h2").textContent = t.settingsTitle;
    document.querySelector("#settings-tab .description").textContent = t.settingsDesc;
    document.querySelector('label[data-i18n="language"]').textContent = t.language;
    document.querySelector('label[data-i18n="provider"]').textContent = t.provider;
    document.querySelector('label[data-i18n="chatModelId"]').textContent = t.chatModelId;
    document.querySelector('label[data-i18n="codingModelId"]').textContent = t.codingModelId;
    const imageModelIdLabel = document.getElementById("image-model-id-label");
    if (imageModelIdLabel) imageModelIdLabel.textContent = t.imageModelId;
    document.querySelector('label[data-i18n="apiKey"]').textContent = t.apiKey;
    document.getElementById("save-settings").textContent = t.saveSettings;
  }

  // src/ui/ui-icons.ts
  var getIconsMap = (html) => __async(null, null, function* () {
    const iconMap = {};
    const faRegex = /class=["']([^"']*\bfa[-a-z0-9]*\b[^"']*)["']/g;
    const matches = Array.from(html.matchAll(faRegex));
    const fetchIcon = (className) => __async(null, null, function* () {
      const iconMatches = Array.from(className.matchAll(/\bfa-([a-z0-9-]+)\b/g));
      for (const iconMatch of iconMatches) {
        const iconName = iconMatch[1];
        if (["fa", "solid", "regular", "brands", "light", "thin", "duotone", "xs", "sm", "lg", "xl", "2xl", "fw", "2xs", "3x", "4x", "5x", "6x", "7x", "8x", "9x", "10x", "spin", "pulse", "stack", "inverse"].includes(iconName)) continue;
        let version = "4.7.0";
        let style = "solid";
        if (className.includes("fa-solid") || className.includes("fas")) {
          style = "solid";
          version = "6.x";
        } else if (className.includes("fa-regular") || className.includes("far")) {
          style = "regular";
          version = "6.x";
        } else if (className.includes("fa-brands") || className.includes("fab")) {
          style = "brands";
          version = "6.x";
        } else if (className.includes("fa-light") || className.includes("fal")) {
          style = "light";
          version = "6.x";
        } else if (className.includes("fa-thin") || className.includes("fat")) {
          style = "thin";
          version = "6.x";
        }
        const key = version === "4.7.0" ? `fa4/${iconName}` : `${style}/${iconName}`;
        if (iconMap[key]) continue;
        try {
          let url;
          if (version === "4.7.0") {
            url = `https://raw.githubusercontent.com/encharm/font-awesome-svg-png/master/black/svg/${iconName}.svg`;
          } else {
            url = `https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/${style}/${iconName}.svg`;
          }
          const response = yield fetch(url);
          if (response.ok) {
            iconMap[key] = yield response.text();
          } else if (version === "6.x" && style !== "solid") {
            const fallbackUrl = `https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/${iconName}.svg`;
            const fallbackRes = yield fetch(fallbackUrl);
            if (fallbackRes.ok) {
              iconMap[key] = yield fallbackRes.text();
            }
          } else if (version === "4.7.0") {
            const fallbackUrl = `https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/${iconName}.svg`;
            const fallbackRes = yield fetch(fallbackUrl);
            if (fallbackRes.ok) {
              iconMap[key] = yield fallbackRes.text();
            }
          }
        } catch (e) {
          console.error(`Failed to fetch icon ${iconName}:`, e);
        }
      }
    });
    yield Promise.all(matches.map((match) => fetchIcon(match[1])));
    return iconMap;
  });

  // src/ui/main.ts
  var DEFAULT_CHAT_MODEL = "doubao-seed-1-8-251228";
  var DEFAULT_CODING_MODEL = "doubao-seed-code-preview-251028";
  var DEFAULT_IMAGE_MODEL = "doubao-seedream-4-5-251128";
  var settings = {
    provider: "volcengine",
    chatModelId: "",
    // Empty means use default
    codingModelId: "",
    // Empty means use default
    apiKey: "",
    language: "zh-CN",
    thinking: true,
    generateImage: false,
    imageModelId: ""
    // Empty means use default
  };
  var styleRefs = [];
  var abortController = null;
  var lastGeneratedCode = "";
  var tabs = document.querySelectorAll(".tab");
  var tabContents = document.querySelectorAll(".tab-content");
  tabs.forEach((tab) => {
    tab.onclick = () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tabContents.forEach((c) => c.classList.remove("active"));
      tab.classList.add("active");
      const tabId = tab.dataset.tab;
      document.getElementById(`${tabId}-tab`).classList.add("active");
    };
  });
  window.onmessage = (event) => {
    const msg = event.data.pluginMessage;
    if (!msg) return;
    if (msg.type === "tailwind-result") {
      const status = document.getElementById("tailwind-status");
      const t = translations[settings.language];
      if (msg.error === "no-selection") {
        status.textContent = t.selectFrame;
      } else {
        document.getElementById("html-input").value = msg.html || "";
        status.textContent = "";
      }
      return;
    }
    if (msg.type === "load-settings" && msg.settings) {
      settings = Object.assign({}, settings, msg.settings);
      if (!settings.language) settings.language = "zh-CN";
      if (!settings.chatModelId) settings.chatModelId = msg.settings.modelId || "doubao-seed-1-8-251228";
      if (!settings.codingModelId) settings.codingModelId = "doubao-seed-code-preview-251028";
      document.getElementById("language").value = settings.language;
      document.getElementById("provider").value = settings.provider || "volcengine";
      document.getElementById("chat-model-id").value = settings.chatModelId || "";
      document.getElementById("coding-model-id").value = settings.codingModelId || "";
      document.getElementById("api-key").value = settings.apiKey || "";
      const thinkingCheckbox = document.getElementById("thinking-checkbox");
      if (thinkingCheckbox) thinkingCheckbox.checked = settings.thinking !== false;
      const generateImageCheckbox = document.getElementById("generate-image-checkbox");
      if (generateImageCheckbox) generateImageCheckbox.checked = settings.generateImage === true;
      document.getElementById("image-model-id").value = settings.imageModelId || "";
      updateUI(settings);
    } else if (msg.type === "export-frame-result") {
      const t = translations[settings.language];
      const status = document.getElementById("builder-status");
      const loadingIndex = styleRefs.findIndex((ref) => ref.loading);
      if (msg.error) {
        if (loadingIndex !== -1) styleRefs.splice(loadingIndex, 1);
        status.textContent = msg.error === "no-selection" ? t.noFrameSelected : t.noFrameSelected;
        status.style.display = "block";
        updateRefList();
        return;
      }
      if (styleRefs.some((ref) => ref.id === msg.id)) {
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
    const container = document.getElementById("ref-items");
    container.innerHTML = "";
    styleRefs.forEach((ref, index) => {
      const item = document.createElement("div");
      item.className = "ref-item";
      const name = ref.loading ? "..." : (ref.name || "").substring(0, 6);
      const actionHtml = ref.loading ? '<div class="item-spinner"></div>' : `<span class="remove-btn" data-index="${index}">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
               </span>`;
      item.innerHTML = `
            <span>${name}</span>
            ${actionHtml}
        `;
      if (!ref.loading) {
        item.querySelector(".remove-btn").addEventListener("click", () => {
          styleRefs.splice(index, 1);
          updateRefList();
        });
      }
      container.appendChild(item);
    });
  }
  document.getElementById("language").onchange = (e) => {
    settings.language = e.target.value;
    updateUI(settings);
  };
  document.getElementById("thinking-checkbox").onchange = (e) => {
    settings.thinking = e.target.checked;
  };
  document.getElementById("generate-image-checkbox").onchange = (e) => {
    settings.generateImage = e.target.checked;
  };
  document.getElementById("save-settings").onclick = () => {
    settings.language = document.getElementById("language").value;
    settings.provider = document.getElementById("provider").value;
    settings.chatModelId = document.getElementById("chat-model-id").value;
    settings.codingModelId = document.getElementById("coding-model-id").value;
    settings.apiKey = document.getElementById("api-key").value;
    settings.thinking = document.getElementById("thinking-checkbox").checked;
    settings.generateImage = document.getElementById("generate-image-checkbox").checked;
    settings.imageModelId = document.getElementById("image-model-id").value;
    parent.postMessage({ pluginMessage: { type: "save-settings", settings } }, "*");
    const t = translations[settings.language];
    const status = document.getElementById("settings-status");
    status.textContent = t.settingsSaved;
    setTimeout(() => {
      status.textContent = "";
    }, 2e3);
  };
  var copyBtn = document.getElementById("copy-btn");
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
    }, 2e3);
  };
  document.getElementById("add-ref-btn").onclick = () => {
    if (styleRefs.some((ref) => ref.loading)) return;
    styleRefs.push({ name: "Loading", loading: true });
    updateRefList();
    parent.postMessage({ pluginMessage: { type: "export-frame-image" } }, "*");
  };
  document.getElementById("stop-btn").onclick = () => {
    if (abortController) {
      abortController.abort();
    }
  };
  var processImages = (html, settings2, abortController2) => __async(null, null, function* () {
    var _a, _b;
    const t = translations[settings2.language];
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const imgs = Array.from(doc.querySelectorAll("img"));
    if (imgs.length === 0) return html;
    for (let i = 0; i < imgs.length; i++) {
      const img = imgs[i];
      const src = img.getAttribute("src");
      const alt = img.getAttribute("alt");
      let resolvedBase64 = "";
      document.getElementById("thinking-status").textContent = t.processingImage(i + 1, imgs.length);
      if (src && src.startsWith("http")) {
        try {
          const res = yield fetch(src, { signal: abortController2 == null ? void 0 : abortController2.signal });
          if (res.ok) {
            const blob = yield res.blob();
            if (blob.size > 0) {
              resolvedBase64 = yield new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(blob);
              });
            }
          }
        } catch (e) {
          console.error("Failed to fetch image src:", e);
        }
      }
      if (!resolvedBase64 && alt && settings2.generateImage && !alt.startsWith("http")) {
        try {
          const res = yield fetch("https://ark.cn-beijing.volces.com/api/v3/images/generations", {
            method: "POST",
            signal: abortController2 == null ? void 0 : abortController2.signal,
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${settings2.apiKey}`
            },
            body: JSON.stringify({
              model: settings2.imageModelId || DEFAULT_IMAGE_MODEL,
              prompt: alt,
              response_format: "b64_json"
            })
          });
          if (res.ok) {
            const data = yield res.json();
            const b64 = (_b = (_a = data.data) == null ? void 0 : _a[0]) == null ? void 0 : _b.b64_json;
            if (b64) {
              resolvedBase64 = `data:image/png;base64,${b64}`;
            }
          }
        } catch (e) {
          console.error("AI image generation failed:", e);
        }
      }
      if (resolvedBase64) {
        img.setAttribute("src", resolvedBase64);
      }
    }
    return doc.body.innerHTML;
  });
  var handleStream = (response, onText) => __async(null, null, function* () {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";
    let reasoningText = "";
    while (true) {
      const { done, value } = yield reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");
      for (const line of lines) {
        if (line.trim().startsWith("data: ")) {
          const dataText = line.trim().slice(6);
          if (dataText === "[DONE]") continue;
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
            console.warn("Failed to parse chunk:", dataText);
          }
        }
      }
    }
    return { fullText, reasoningText };
  });
  document.getElementById("expand-btn").onclick = () => __async(null, null, function* () {
    var _a;
    const promptInput = document.getElementById("prompt-input");
    const prompt = promptInput.value;
    const btn = document.getElementById("expand-btn");
    const buildBtn = document.getElementById("build-btn");
    const status = document.getElementById("builder-status");
    const thinkingContainer = document.getElementById("thinking-container");
    const t = translations[settings.language];
    if (!prompt) {
      status.textContent = t.enterDescription;
      return;
    }
    if (!settings.apiKey) {
      status.textContent = t.setApiKey;
      return;
    }
    btn.disabled = true;
    buildBtn.disabled = true;
    btn.classList.add("loading");
    status.textContent = "";
    status.style.display = "none";
    thinkingContainer.classList.add("active");
    document.getElementById("thinking-status").textContent = t.expandingPrompt;
    abortController = new AbortController();
    try {
      const messageContent = [];
      styleRefs.filter((ref) => !ref.loading && ref.imageData).forEach((ref) => {
        messageContent.push({
          type: "image_url",
          image_url: { url: `data:image/png;base64,${ref.imageData}` }
        });
      });
      const styleInstruction = styleRefs.filter((ref) => !ref.loading && ref.imageData).length > 0 ? `[Style Reference: Study the visual style, colors, typography, and layout patterns from the attached image(s). Keep the summary concise.]

` : "";
      const imageInstruction = settings.generateImage ? "Note: The user intends to generate images. Ensure the expanded prompt includes highly detailed visual descriptions suitable for image generation prompts, including specifications about how the images should blend with the overall design style (colors, lighting, and layout). IMPORTANT: Generate visual materials only, avoid generating charts, structure diagrams, schematics, or any content with text.\n\n" : "Note: Do NOT include any image generation prompts or mention images in the expanded description, as image generation is disabled.\n\n";
      messageContent.push({ type: "text", text: styleInstruction + imageInstruction + prompt });
      const response = yield fetch("https://ark.cn-beijing.volces.com/api/v3/chat/completions", {
        method: "POST",
        signal: abortController.signal,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${settings.apiKey}`
        },
        body: JSON.stringify({
          model: settings.chatModelId || DEFAULT_CHAT_MODEL,
          stream: true,
          thinking: settings.thinking ? void 0 : { type: "disabled" },
          messages: [
            {
              role: "system",
              content: `You are a creative UI prompt engineer. Expand the user's brief UI description into a detailed, descriptive prompt for an AI UI generator. Focus on layout, style, color schemes, and visual elements. Keep the response as a single, well-structured paragraph.`
            },
            { role: "user", content: messageContent }
          ]
        })
      });
      if (!response.ok) {
        const err = yield response.json();
        throw new Error(((_a = err.error) == null ? void 0 : _a.message) || "API request failed");
      }
      promptInput.value = "";
      yield handleStream(response, (text, reasoning) => {
        if (reasoning) document.getElementById("thinking-status").textContent = t.aiThinking;
        else document.getElementById("thinking-status").textContent = t.generating;
        promptInput.value = text;
        promptInput.scrollTop = promptInput.scrollHeight;
        lastGeneratedCode = text;
        const tokens = Math.floor((reasoning.length + text.length) / 4);
        document.getElementById("token-counter").textContent = `${tokens} ${t.tokens}`;
      });
      status.textContent = t.expanded;
    } catch (err) {
      if (err.name === "AbortError") status.textContent = t.stoppedByUser;
      else status.textContent = `${t.errorPrefix}${err.message}`;
    } finally {
      status.style.display = "block";
      btn.disabled = false;
      buildBtn.disabled = false;
      btn.classList.remove("loading");
      thinkingContainer.classList.remove("active");
      if (lastGeneratedCode) copyBtn.style.display = "flex";
      abortController = null;
    }
  });
  document.getElementById("build-btn").onclick = () => __async(null, null, function* () {
    var _a;
    const prompt = document.getElementById("prompt-input").value;
    const viewport = document.querySelector('input[name="builder-viewport"]:checked').value;
    const btn = document.getElementById("build-btn");
    const expandBtn = document.getElementById("expand-btn");
    const status = document.getElementById("builder-status");
    const thinkingContainer = document.getElementById("thinking-container");
    const t = translations[settings.language];
    if (!prompt) {
      status.textContent = t.enterDescription;
      return;
    }
    if (!settings.apiKey) {
      status.textContent = t.setApiKey;
      return;
    }
    btn.disabled = true;
    expandBtn.disabled = true;
    btn.classList.add("loading");
    status.textContent = "";
    status.style.display = "none";
    copyBtn.style.display = "none";
    thinkingContainer.classList.add("active");
    document.getElementById("thinking-status").textContent = t.contactingAI;
    abortController = new AbortController();
    const viewportDesc = viewport === "mobile" ? "Target Viewport: Mobile (375px width). Use single-column layouts, larger touch targets, and vertical stacking." : "Target Viewport: Desktop (1440px width). Use multi-column layouts, horizontal alignment, and whitespace effectively.";
    try {
      const messageContent = [];
      styleRefs.filter((ref) => !ref.loading && ref.imageData).forEach((ref) => {
        messageContent.push({
          type: "image_url",
          image_url: { url: `data:image/png;base64,${ref.imageData}` }
        });
      });
      const styleInstruction = styleRefs.filter((ref) => !ref.loading && ref.imageData).length > 0 ? `[Style Reference: Study the visual style, colors, typography, and layout patterns from the attached image(s). Apply similar aesthetics to the generated design, but follow the text instructions for content and structure. Ensure all text in the generated HTML is in ${settings.language === "zh-CN" ? "Chinese" : "English"}.]

` : "";
      messageContent.push({ type: "text", text: styleInstruction + prompt });
      const imageSystemRule = settings.generateImage ? "10. IMPORTANT: You can generate images using <img> tags. For each image, provide a DETAILED visual description in the 'alt' attribute that will be used as an image generation prompt. Include specific details about the scene, subject, lighting, and how the image should blend perfectly with the rest of the design's colors and aesthetic. IMPORTANT: Generate visual materials only, avoid generating charts, structure diagrams, schematics, or any content with text. Do NOT specify any 'src' attribute for images." : "10. IMPORTANT: Image generation is currently disabled. Do NOT generate any <img> tags, placeholders, or references to external images.";
      const response = yield fetch("https://ark.cn-beijing.volces.com/api/v3/chat/completions", {
        method: "POST",
        signal: abortController.signal,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${settings.apiKey}`
        },
        body: JSON.stringify({
          model: settings.codingModelId || DEFAULT_CODING_MODEL,
          stream: true,
          thinking: settings.thinking ? void 0 : { type: "disabled" },
          messages: [
            {
              role: "system",
              content: `You are an elite UI engineer. TASK: Generate a standalone HTML snippet using Tailwind CSS classes based on the user description. ${viewportDesc} RULES: 1. Only return code, no markdown block wrappers. 2. Use modern, premium aesthetics. 3. Ensure full responsiveness. 4. Use Font Awesome icons where appropriate (fa-solid fa-icon) and vibrant colors. 5. Include decent padding and gap for a clean look. 6. Content Language: ${settings.language === "zh-CN" ? "Chinese (Simplified)" : "English"}. Ensure all text in the generated HTML is in ${settings.language === "zh-CN" ? "Chinese" : "English"}. 7. IMPORTANT: Strictly AVOID using standard CSS or inline style="" attributes. Use ONLY pure Tailwind CSS utility classes. 8. Enclose ALL background colors and specific styling in Tailwind arbitrary value classes (e.g., bg-[#123456], text-[#abcdef]) directly in the class names. 9. AVOID using CSS Grid. Always prefer Flexbox for all layouts to ensure compatibility with Figma Auto Layout. Explicitly specify flex direction using 'flex-row' (preferred/default) or 'flex-col' for all flex containers. ${imageSystemRule}`
            },
            { role: "user", content: messageContent }
          ]
        })
      });
      if (!response.ok) {
        const err = yield response.json();
        throw new Error(((_a = err.error) == null ? void 0 : _a.message) || "API request failed");
      }
      const { fullText: fullHtml } = yield handleStream(response, (text, reasoning) => {
        if (reasoning) document.getElementById("thinking-status").textContent = t.aiThinking;
        else document.getElementById("thinking-status").textContent = t.generating;
        const tokens = Math.floor((reasoning.length + text.length) / 4);
        document.getElementById("token-counter").textContent = `${tokens} ${t.tokens}`;
        lastGeneratedCode = text;
      });
      let html = fullHtml.trim();
      html = html.replace(/^```html\n?/, "").replace(/\n?```$/, "");
      html = yield processImages(html, settings, abortController);
      document.getElementById("thinking-status").textContent = t.buildingLayers;
      const iconMap = yield getIconsMap(html);
      status.textContent = t.buildingLayers;
      parent.postMessage({ pluginMessage: { type: "convert-html", html, viewport, icons: iconMap } }, "*");
      status.textContent = t.buildComplete;
    } catch (err) {
      if (err.name === "AbortError") status.textContent = t.generationStopped;
      else status.textContent = `${t.errorPrefix}${err.message}`;
    } finally {
      status.style.display = "block";
      btn.disabled = false;
      expandBtn.disabled = false;
      btn.classList.remove("loading");
      thinkingContainer.classList.remove("active");
      if (lastGeneratedCode) copyBtn.style.display = "flex";
      abortController = null;
    }
  });
  document.getElementById("figma-to-tailwind-btn").onclick = () => {
    const status = document.getElementById("tailwind-status");
    const t = translations[settings.language];
    status.textContent = t.converting;
    parent.postMessage({ pluginMessage: { type: "figma-to-tailwind" } }, "*");
  };
  document.getElementById("convert").onclick = () => __async(null, null, function* () {
    let html = document.getElementById("html-input").value;
    const viewport = document.querySelector('input[name="viewport"]:checked').value;
    const status = document.getElementById("status");
    const thinkingContainer = document.getElementById("thinking-container");
    const t = translations[settings.language];
    if (!html) return;
    thinkingContainer.classList.add("active");
    status.style.display = "none";
    try {
      html = yield processImages(html, settings, null);
      const iconMap = yield getIconsMap(html);
      parent.postMessage({ pluginMessage: { type: "convert-html", html, viewport, icons: iconMap } }, "*");
      status.textContent = t.sentToFigma;
      status.style.display = "block";
    } catch (e) {
      status.textContent = `${t.errorPrefix}${e.message}`;
      status.style.display = "block";
    } finally {
      thinkingContainer.classList.remove("active");
      setTimeout(() => {
        if (status.textContent === t.sentToFigma) status.textContent = "";
        status.style.display = "none";
      }, 2e3);
    }
  });
})();
