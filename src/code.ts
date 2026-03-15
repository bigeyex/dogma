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
            const intent = (msg as any).intent || 'REPLACE';

            const targetNode = await figma.getNodeByIdAsync(selectionId) as SceneNode;
            if (!targetNode) {
                figma.notify('Error: Could not find the original selected node.');
                return;
            }

            const parentNode = targetNode.parent;
            
            // Check if we are trying to edit a top-level Artboard/Frame
            const isTopLevel = !parentNode || parentNode.type === 'PAGE';
            const isContainer = targetNode.type === 'FRAME' || targetNode.type === 'SECTION' || targetNode.type === 'GROUP';

            // Special handling for Top-Level Artboards
            if (isTopLevel) {
                // We only allow APPEND (adding content) for top-level artboards
                if (intent === 'APPEND' && isContainer) {
                    // Allowed
                } else {
                    figma.notify('Error: Cannot replace a top-level frame. Select an element inside, or use "Add" intent to append to the artboard.');
                    return;
                }
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

            // Build new nodes
            const newResults: { node: SceneNode, styles: any }[] = [];
            for (const child of targetElements) {
                const result = await buildFigmaNode(child, customColors, iconMap, Math.round(oldWidth), Math.round(screenWidth), bodyStyles);
                if (result) {
                    newResults.push(result);
                }
            }
            
            const newNodes = newResults.map(r => r.node);

            // --- INSERTION LOGIC ---
            
            // Case 1: Append to Container (e.g. Artboard or Group)
            // If intent is APPEND and target is a container, we add INSIDE it.
            if (intent === 'APPEND' && isContainer) {
                const container = targetNode as FrameNode; // Frame, Group, Section all have appendChild
                for (const res of newResults) {
                    container.appendChild(res.node);
                    
                    // Apply constraints
                    applySizingConstraints(res.node, res.styles, container.layoutMode || 'NONE', bodyStyles.display || 'flex');
                    applyLayoutConstraints(res.node, res.styles, container.layoutMode || 'NONE');
                    
                    if (res.styles.position === 'ABSOLUTE') {
                        applyAbsolutePositioning(res.node, res.styles, container);
                    }
                }
                figma.notify(`✓ Appended ${newNodes.length} element(s) to ${targetNode.name}`);
            } 
            // Case 2: Replace, Insert Before, Insert After (Sibling Operation)
            else {
                if (!parentNode || isTopLevel) {
                     // Should be covered by early check, but just in case
                     figma.notify('Error: Cannot insert siblings for a top-level node.');
                     return;
                }

                const parentWithChildren = parentNode as FrameNode;
                
                // Find index of the target node in parent
                let targetIndex = -1;
                for (let i = 0; i < parentWithChildren.children.length; i++) {
                    if (parentWithChildren.children[i].id === targetNode.id) {
                        targetIndex = i;
                        break;
                    }
                }

                // Determine Insert Index
                let insertIndex = targetIndex;
                if (intent === 'INSERT_AFTER') insertIndex = targetIndex + 1;
                // INSERT_BEFORE defaults to targetIndex (pushing target down)

                // Insert Nodes
                for (let i = 0; i < newResults.length; i++) {
                    const res = newResults[i];
                    // Note: insertChild handles index clamping automatically? 
                    // Safest is to just insert.
                    parentWithChildren.insertChild(insertIndex + i, res.node);

                    // Apply constraints
                    applySizingConstraints(res.node, res.styles, parentWithChildren.layoutMode || 'NONE', bodyStyles.display || 'flex');
                    applyLayoutConstraints(res.node, res.styles, parentWithChildren.layoutMode || 'NONE');

                    if (res.styles.position === 'ABSOLUTE') {
                        applyAbsolutePositioning(res.node, res.styles, parentWithChildren);
                    }
                }

                // Handle Layout / Positioning for Fixed Layouts
                const parentLayout = parentWithChildren.layoutMode;
                if (!parentLayout || parentLayout === 'NONE') {
                    if (newResults.length > 0) {
                        newResults.forEach((res, i) => {
                             // Only adjust x/y if NOT absolute
                             if (res.styles.position !== 'ABSOLUTE') {
                                  if (intent === 'REPLACE') {
                                      res.node.x = oldX;
                                      res.node.y = oldY;
                                  } else if (intent === 'INSERT_BEFORE') {
                                      res.node.x = oldX;
                                      res.node.y = oldY - res.node.height - 20; 
                                  } else if (intent === 'INSERT_AFTER') {
                                      res.node.x = oldX;
                                      res.node.y = oldY + oldHeight + 20;
                                  }
                             }
                        });
                    }
                }

                // Handle REPLACE removal
                if (intent === 'REPLACE') {
                    targetNode.remove();
                    figma.notify(`✓ Replaced selection with ${newNodes.length} new element(s)`);
                } else {
                    figma.notify(`✓ Inserted ${newNodes.length} element(s)`);
                }
            }

            // Select new nodes
            if (newNodes.length > 0) {
                figma.currentPage.selection = newNodes;
                figma.viewport.scrollAndZoomIntoView(newNodes);
            }

        } catch (error) {
            figma.notify('Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
            console.error(error);
        }
        return;
    }

    if (msg.type === 'get-selection-size') {
        const selection = figma.currentPage.selection;
        if (selection.length > 0) {
            const node = selection[0];
            const bounds = (node as SceneNode).absoluteBoundingBox;
            if (bounds) {
                figma.ui.postMessage({
                    type: 'selection-size-result',
                    width: Math.round(bounds.width),
                    height: Math.round(bounds.height),
                    hasSelection: true,
                    selectionId: node.id
                });
            } else {
                figma.ui.postMessage({
                    type: 'selection-size-result',
                    width: 2848,
                    height: 1600,
                    hasSelection: false
                });
            }
        } else {
            figma.ui.postMessage({
                type: 'selection-size-result',
                width: 2848,
                height: 1600,
                hasSelection: false
            });
        }
        return;
    }

    if (msg.type === 'place-image') {
        try {
            const { imageData, width, height, selectionId } = msg as any;

            // Decode base64 to bytes
            const bytes = figma.base64Decode(imageData);

            const image = figma.createImage(bytes);
            const rect = figma.createRectangle();
            rect.name = 'Generated Image';
            rect.resize(width, height);
            rect.fills = [{
                type: 'IMAGE',
                imageHash: image.hash,
                scaleMode: 'FILL'
            }];

            if (selectionId) {
                // Replace the selected node
                const targetNode = await figma.getNodeByIdAsync(selectionId) as SceneNode;
                if (targetNode && targetNode.parent) {
                    const parent = targetNode.parent;
                    const oldX = targetNode.x;
                    const oldY = targetNode.y;

                    // Find index
                    let targetIndex = 0;
                    if ('children' in parent) {
                        for (let i = 0; i < (parent as FrameNode).children.length; i++) {
                            if ((parent as FrameNode).children[i].id === targetNode.id) {
                                targetIndex = i;
                                break;
                            }
                        }
                    }

                    if ('children' in parent) {
                        (parent as FrameNode).insertChild(targetIndex, rect);
                    } else {
                        figma.currentPage.appendChild(rect);
                    }

                    // Preserve layout positioning (e.g. ABSOLUTE) and constraints
                    if ('layoutPositioning' in targetNode) {
                        (rect as any).layoutPositioning = (targetNode as any).layoutPositioning;
                    }
                    if ('constraints' in targetNode) {
                        rect.constraints = (targetNode as any).constraints;
                    }

                    rect.x = oldX;
                    rect.y = oldY;
                    targetNode.remove();

                    figma.currentPage.selection = [rect];
                    figma.viewport.scrollAndZoomIntoView([rect]);
                    figma.notify('✓ Image replaced selection');
                } else {
                    // Fallback: place on canvas
                    figma.currentPage.appendChild(rect);
                    rect.x = figma.viewport.center.x - (width / 2);
                    rect.y = figma.viewport.center.y - (height / 2);
                    figma.currentPage.selection = [rect];
                    figma.viewport.scrollAndZoomIntoView([rect]);
                    figma.notify('✓ Image placed on canvas');
                }
            } else {
                // No selection: place on canvas
                figma.currentPage.appendChild(rect);
                rect.x = figma.viewport.center.x - (width / 2);
                rect.y = figma.viewport.center.y - (height / 2);
                figma.currentPage.selection = [rect];
                figma.viewport.scrollAndZoomIntoView([rect]);
                figma.notify('✓ Image placed on canvas');
            }
        } catch (error) {
            figma.notify('Error placing image: ' + (error instanceof Error ? error.message : 'Unknown error'));
            console.error(error);
        }
        return;
    }

    if (msg.type === 'get-library-components') {
        try {
            const catalog: any[] = [];

            // Find all components and component sets on the current page
            const components = figma.currentPage.findAllWithCriteria({ types: ['COMPONENT'] });
            const componentSets = figma.currentPage.findAllWithCriteria({ types: ['COMPONENT_SET'] });

            // Track component set IDs so we skip individual variants that belong to a set
            const setIds = new Set(componentSets.map(s => s.id));

            for (const comp of components) {
                // Skip components that are children of a component set (they're variants)
                if (comp.parent && setIds.has(comp.parent.id)) continue;
                catalog.push({
                    key: comp.key,
                    name: comp.name,
                    description: comp.description || '',
                    type: 'component',
                    variantProperties: null,
                    source: 'local'
                });
            }

            for (const set of componentSets) {
                const variantProps: Record<string, { values: string[] }> = {};
                if (set.variantGroupProperties) {
                    for (const [propKey, propVal] of Object.entries(set.variantGroupProperties)) {
                        variantProps[propKey] = { values: (propVal as any).values || [] };
                    }
                }
                catalog.push({
                    key: set.key,
                    name: set.name,
                    description: set.description || '',
                    type: 'componentSet',
                    variantProperties: Object.keys(variantProps).length > 0 ? variantProps : null,
                    source: 'local'
                });
            }

            figma.ui.postMessage({ type: 'library-components-result', components: catalog });
        } catch (error) {
            console.error('Failed to get library components:', error);
            figma.ui.postMessage({ type: 'library-components-result', components: [] });
        }
        return;
    }
};
