import { parseHTML, resolveClasses } from './parser';
import { parseTailwindConfig } from './utils';
import { buildFigmaNode, applyFrameStyles, applySizingConstraints, applyLayoutConstraints, applyAbsolutePositioning } from './builder';
import { ParsedElement, ResolvedStyles } from './types';
import { figmaToTailwind } from './figma-to-tailwind';

figma.showUI(__html__, { width: 400, height: 560 });

figma.clientStorage.getAsync('llm-settings').then(settings => {
    if (settings) {
        figma.ui.postMessage({ type: 'load-settings', settings });
    }
});

figma.ui.onmessage = async (msg: { type: string; html?: string; viewport?: string; icons?: Record<string, string>; settings?: any }) => {
    if (msg.type === 'cancel') {
        figma.closePlugin();
        return;
    }

    if (msg.type === 'figma-to-tailwind') {
        const selection = figma.currentPage.selection;
        if (selection.length === 0) {
            figma.ui.postMessage({ type: 'tailwind-result', html: '', error: 'no-selection' });
            return;
        }
        const node = selection[0];
        const html = figmaToTailwind(node);
        figma.ui.postMessage({ type: 'tailwind-result', html });
        figma.notify('✓ Converted to Tailwind HTML');
        return;
    }

    if (msg.type === 'save-settings' && msg.settings) {
        await figma.clientStorage.setAsync('llm-settings', msg.settings);
        return;
    }

    if (msg.type === 'convert-html' && msg.html) {
        try {
            const iconMap = msg.icons || {};
            const customColors = parseTailwindConfig(msg.html);
            const elements = parseHTML(msg.html);

            if (elements.length === 0) {
                figma.notify('No HTML elements found to convert.');
                return;
            }

            const nodes: SceneNode[] = [];

            function findBody(els: ParsedElement[]): ParsedElement | undefined {
                for (const el of els) {
                    if (el.tagName === 'body') return el;
                    if (el.tagName === 'html' && el.children) {
                        const found = findBody(el.children);
                        if (found) return found;
                    }
                }
                return undefined;
            }

            function findTitle(els: ParsedElement[]): string | undefined {
                for (const el of els) {
                    if (el.tagName === 'title') {
                        return el.children.filter(child => child.tagName === '#text').map(child => child.textContent).join(' ').trim();
                    }
                    if (el.children) {
                        const found = findTitle(el.children);
                        if (found) return found;
                    }
                }
                return undefined;
            }

            const pageTitle = findTitle(elements) || 'Web Page';
            const bodyElement = findBody(elements);
            const targetElements = bodyElement ? bodyElement.children : elements;

            const isDesktop = msg.viewport === 'desktop';
            const screenWidth = isDesktop ? 1440 : 375;
            const artboardWidth = screenWidth;

            // Resolve body styles if present
            const bodyStyles = bodyElement ? resolveClasses(bodyElement.classes, customColors, screenWidth) : {} as ResolvedStyles;

            const artboard = figma.createFrame();
            artboard.name = bodyElement ? 'Body' : (isDesktop ? 'Desktop View' : 'Mobile View');

            // Placement Logic
            const selection = figma.currentPage.selection;
            if (selection.length > 0) {
                let targetNode = selection[selection.length - 1];
                while (targetNode.parent && targetNode.parent.type !== 'PAGE') {
                    targetNode = targetNode.parent as any;
                }
                artboard.x = targetNode.x + targetNode.width + 30;
                artboard.y = targetNode.y;
            } else {
                artboard.x = figma.viewport.center.x - (artboardWidth / 2);
                artboard.y = figma.viewport.center.y - 400;
            }

            // Artboard sizing and styling
            artboard.resize(artboardWidth, bodyStyles.minHeight || 800);
            applyFrameStyles(artboard, bodyStyles);

            artboard.layoutMode = 'VERTICAL';
            artboard.itemSpacing = 0;
            artboard.primaryAxisSizingMode = 'AUTO';
            artboard.counterAxisSizingMode = 'FIXED';
            artboard.clipsContent = true;

            figma.currentPage.appendChild(artboard);

            for (const child of targetElements) {
                const result = await buildFigmaNode(child, customColors, iconMap, artboardWidth, screenWidth, bodyStyles);
                if (result) {
                    artboard.appendChild(result.node);
                    nodes.push(result.node);
                    if (result.styles.position === 'ABSOLUTE') {
                        applySizingConstraints(result.node, result.styles, artboard.layoutMode);
                        applyLayoutConstraints(result.node, result.styles, artboard.layoutMode);
                        applyAbsolutePositioning(result.node, result.styles, artboard);
                    } else {
                        applySizingConstraints(result.node, result.styles, artboard.layoutMode);
                        applyLayoutConstraints(result.node, result.styles, artboard.layoutMode);
                    }
                }
            }

            if (nodes.length > 0) {
                figma.currentPage.selection = [artboard];
                figma.viewport.scrollAndZoomIntoView([artboard]);
                figma.notify(`✓ Created artboard "${pageTitle}" with ${nodes.length} element(s)`);
            }

        } catch (error) {
            figma.notify('Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
            console.error(error);
        }
        return;
    }

    if (msg.type === 'export-frame-image') {
        const selection = figma.currentPage.selection;
        if (selection.length === 0) {
            figma.ui.postMessage({ type: 'export-frame-result', error: 'no-selection' });
            return;
        }

        const node = selection[0];
        if (node.type !== 'FRAME' && node.type !== 'COMPONENT' && node.type !== 'INSTANCE') {
            figma.ui.postMessage({ type: 'export-frame-result', error: 'not-a-frame' });
            return;
        }

        try {
            const bytes = await node.exportAsync({
                format: 'PNG',
                constraint: { type: 'SCALE', value: 0.5 } // Compress to reduce tokens
            });
            const base64 = figma.base64Encode(bytes);
            figma.ui.postMessage({
                type: 'export-frame-result',
                id: node.id,
                name: node.name,
                imageData: base64
            });
        } catch (error) {
            figma.notify('Failed to export frame: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    }
};
