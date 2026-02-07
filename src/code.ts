import { parseHTML, resolveClasses } from './parser';
import { parseTailwindConfig } from './utils';
import { buildFigmaNode, applySizingConstraints, applyLayoutConstraints } from './builder';
import { ParsedElement } from './types';

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
            let targetElements = elements;
            const bodyElement = findBody(elements);
            if (bodyElement) targetElements = bodyElement.children;

            const isDesktop = msg.viewport === 'desktop';
            const artboardWidth = isDesktop ? 1440 : 375;

            const artboard = figma.createFrame();
            artboard.name = pageTitle;

            const selection = figma.currentPage.selection;
            if (selection.length > 0) {
                const lastNode = selection[selection.length - 1];
                artboard.x = lastNode.x + lastNode.width + 30;
                artboard.y = lastNode.y;
            } else {
                artboard.x = figma.viewport.center.x - (artboardWidth / 2);
                artboard.y = figma.viewport.center.y - 400;
            }

            artboard.layoutMode = 'VERTICAL';
            artboard.resize(artboardWidth, artboard.height);
            artboard.layoutSizingHorizontal = 'FIXED';
            artboard.layoutSizingVertical = 'HUG';

            artboard.itemSpacing = 0;
            artboard.paddingTop = 0;
            artboard.paddingRight = 0;
            artboard.paddingBottom = 0;
            artboard.paddingLeft = 0;
            artboard.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
            figma.currentPage.appendChild(artboard);

            for (const element of targetElements) {
                const result = await buildFigmaNode(element, customColors, iconMap, artboardWidth, artboardWidth);
                if (result) {
                    artboard.appendChild(result.node);
                    nodes.push(result.node);
                    applySizingConstraints(result.node, result.styles, artboard.layoutMode);
                    applyLayoutConstraints(result.node, result.styles, artboard.layoutMode);
                }
            }

            if (nodes.length > 0) {
                figma.currentPage.selection = [artboard];
                figma.viewport.scrollAndZoomIntoView([artboard]);
                figma.notify(`✓ Created artboard "${pageTitle}" with ${nodes.length} element(s)`);
            }

        } catch (error) {
            figma.notify('Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    }
};
