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
                        applySizingConstraints(result.node, result.styles, artboard.layoutMode, bodyStyles.display || 'flex');
                        applyLayoutConstraints(result.node, result.styles, artboard.layoutMode);
                        applyAbsolutePositioning(result.node, result.styles, artboard);
                    } else {
                        applySizingConstraints(result.node, result.styles, artboard.layoutMode, bodyStyles.display || 'flex');
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

    if (msg.type === 'export-artboard-with-selection') {
        const selection = figma.currentPage.selection;
        if (selection.length === 0) {
            figma.ui.postMessage({ type: 'artboard-with-selection-result', error: 'no-selection' });
            return;
        }

        const selectedNode = selection[0];

        // Find the top-level artboard (frame on the page)
        let artboard: FrameNode | null = null;
        let current: BaseNode | null = selectedNode;
        while (current) {
            if (current.parent && current.parent.type === 'PAGE' &&
                (current.type === 'FRAME' || current.type === 'COMPONENT' || current.type === 'INSTANCE')) {
                artboard = current as FrameNode;
                break;
            }
            current = current.parent;
        }

        if (!artboard) {
            figma.ui.postMessage({ type: 'artboard-with-selection-result', error: 'no-artboard' });
            return;
        }

        try {
            // Calculate selection position relative to artboard
            const artboardBounds = artboard.absoluteBoundingBox!;
            const selBounds = (selectedNode as SceneNode).absoluteBoundingBox!;

            const relX = selBounds.x - artboardBounds.x;
            const relY = selBounds.y - artboardBounds.y;
            const selWidth = selBounds.width;
            const selHeight = selBounds.height;

            // Create a temporary red border rectangle on the artboard
            const redBorder = figma.createRectangle();
            redBorder.name = '__temp_red_border__';
            redBorder.x = relX;
            redBorder.y = relY;
            redBorder.resize(selWidth, selHeight);
            redBorder.fills = []; // No fill
            redBorder.strokes = [{ type: 'SOLID', color: { r: 1, g: 0, b: 0 } }];
            redBorder.strokeWeight = 4;
            redBorder.strokeAlign = 'OUTSIDE';

            artboard.appendChild(redBorder);

            // Export artboard with the red border
            const bytes = await artboard.exportAsync({
                format: 'PNG',
                constraint: { type: 'SCALE', value: 0.5 }
            });
            const base64 = figma.base64Encode(bytes);

            // Remove the temporary red border immediately
            redBorder.remove();

            figma.ui.postMessage({
                type: 'artboard-with-selection-result',
                imageData: base64,
                selectionId: selectedNode.id,
                selectionBounds: {
                    x: relX,
                    y: relY,
                    width: selWidth,
                    height: selHeight
                },
                artboardSize: {
                    width: artboardBounds.width,
                    height: artboardBounds.height
                }
            });
        } catch (error) {
            // Clean up the red border if something went wrong
            const tempBorder = artboard.findChild(n => n.name === '__temp_red_border__');
            if (tempBorder) tempBorder.remove();
            figma.ui.postMessage({ type: 'artboard-with-selection-result', error: (error instanceof Error ? error.message : 'Unknown error') });
        }
    }

    if (msg.type === 'replace-selection' && msg.html) {
        try {
            const selectionId = (msg as any).selectionId;
            const targetNode = await figma.getNodeByIdAsync(selectionId) as SceneNode;
            if (!targetNode) {
                figma.notify('Error: Could not find the original selected node.');
                return;
            }

            const parentNode = targetNode.parent;
            if (!parentNode || parentNode.type === 'PAGE') {
                figma.notify('Error: Cannot replace a top-level frame. Select an element inside an artboard.');
                return;
            }

            // Find the artboard for width reference
            let artboard: FrameNode | null = null;
            let current: BaseNode | null = targetNode;
            while (current) {
                if (current.parent && current.parent.type === 'PAGE' &&
                    (current.type === 'FRAME' || current.type === 'COMPONENT' || current.type === 'INSTANCE')) {
                    artboard = current as FrameNode;
                    break;
                }
                current = current.parent;
            }

            const iconMap = msg.icons || {};
            const customColors = parseTailwindConfig(msg.html);
            const elements = parseHTML(msg.html);

            if (elements.length === 0) {
                figma.notify('No HTML elements generated.');
                return;
            }

            // Find body or use root elements
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
            const bodyElement = findBody(elements);
            const targetElements = bodyElement ? bodyElement.children : elements;

            // Use selection width for building, or parent width
            const selBounds = targetNode.absoluteBoundingBox!;
            const screenWidth = selBounds.width;
            const bodyStyles = bodyElement ? resolveClasses(bodyElement.classes, customColors, screenWidth) : {} as ResolvedStyles;

            // Remember position and index
            const oldX = targetNode.x;
            const oldY = targetNode.y;
            const oldWidth = selBounds.width;
            const oldHeight = selBounds.height;

            // Find index of the target node in parent
            let targetIndex = -1;
            if ('children' in parentNode) {
                const parentWithChildren = parentNode as FrameNode;
                for (let i = 0; i < parentWithChildren.children.length; i++) {
                    if (parentWithChildren.children[i].id === targetNode.id) {
                        targetIndex = i;
                        break;
                    }
                }
            }

            // Build new nodes
            const newNodes: SceneNode[] = [];
            for (const child of targetElements) {
                const result = await buildFigmaNode(child, customColors, iconMap, Math.round(oldWidth), Math.round(screenWidth), bodyStyles);
                if (result) {
                    newNodes.push(result.node);
                    if ('children' in parentNode) {
                        (parentNode as FrameNode).appendChild(result.node);
                    }
                    if (result.styles.position === 'ABSOLUTE') {
                        applySizingConstraints(result.node, result.styles, (parentNode as FrameNode).layoutMode || 'NONE', bodyStyles.display || 'flex');
                        applyLayoutConstraints(result.node, result.styles, (parentNode as FrameNode).layoutMode || 'NONE');
                        applyAbsolutePositioning(result.node, result.styles, parentNode as FrameNode);
                    } else {
                        applySizingConstraints(result.node, result.styles, (parentNode as FrameNode).layoutMode || 'NONE', bodyStyles.display || 'flex');
                        applyLayoutConstraints(result.node, result.styles, (parentNode as FrameNode).layoutMode || 'NONE');
                    }
                }
            }

            // If parent uses auto-layout, move new nodes to the old index position
            if ('children' in parentNode && targetIndex !== -1) {
                const parentWithChildren = parentNode as FrameNode;
                // Move each new node to the correct position
                for (let i = 0; i < newNodes.length; i++) {
                    try {
                        parentWithChildren.insertChild(targetIndex + i, newNodes[i]);
                    } catch (_e) {
                        // Already appended, skip
                    }
                }
            }

            // If parent doesn't use auto-layout, position the new node at the old position
            if (!(parentNode as FrameNode).layoutMode || (parentNode as FrameNode).layoutMode === 'NONE') {
                if (newNodes.length > 0) {
                    newNodes[0].x = oldX;
                    newNodes[0].y = oldY;
                }
            }

            // Remove old node
            targetNode.remove();

            // Select new nodes
            if (newNodes.length > 0) {
                figma.currentPage.selection = newNodes;
                figma.viewport.scrollAndZoomIntoView(newNodes);
            }

            figma.notify(`✓ Replaced selection with ${newNodes.length} new element(s)`);
        } catch (error) {
            figma.notify('Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
            console.error(error);
        }
        return;
    }
};
