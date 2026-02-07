import { ParsedElement, ResolvedStyles } from './types';
import { resolveClasses } from './parser';

export function applySizingConstraints(node: SceneNode, styles: ResolvedStyles, parentLayoutMode: string) {
    if (node.type === 'FRAME' || node.type === 'TEXT') {
        if (styles.width === 'FILL') {
            if (parentLayoutMode !== 'NONE') node.layoutSizingHorizontal = 'FILL';
            else if (node.type === 'FRAME' && node.layoutMode !== 'NONE') node.layoutSizingHorizontal = 'HUG';
        } else if (styles.width === 'HUG') {
            if (node.type === 'FRAME' && node.layoutMode !== 'NONE') node.layoutSizingHorizontal = 'HUG';
            else if (node.type === 'TEXT') node.textAutoResize = 'WIDTH_AND_HEIGHT';
        } else if (typeof styles.width === 'number') {
            node.resize(styles.width, node.height);
            node.layoutSizingHorizontal = 'FIXED';
        } else {
            if (node.type === 'FRAME') {
                if (parentLayoutMode === 'VERTICAL') node.layoutSizingHorizontal = 'FILL';
                else if (parentLayoutMode === 'HORIZONTAL') node.layoutSizingHorizontal = styles.flexGrow === 1 ? 'FILL' : 'HUG';
            } else if (node.type === 'TEXT') node.textAutoResize = 'WIDTH_AND_HEIGHT';
        }

        if (styles.height === 'FILL') {
            if (parentLayoutMode !== 'NONE') node.layoutSizingVertical = 'FILL';
            else if (node.type === 'FRAME' && node.layoutMode !== 'NONE') node.layoutSizingVertical = 'HUG';
        } else if (styles.height === 'HUG') {
            if (node.type === 'FRAME' && node.layoutMode !== 'NONE') node.layoutSizingVertical = 'HUG';
        } else if (typeof styles.height === 'number') {
            node.resize(node.width, styles.height);
            node.layoutSizingVertical = 'FIXED';
        } else {
            if (node.type === 'TEXT') node.layoutSizingVertical = 'HUG';
            else if (node.type === 'FRAME' && node.layoutMode !== 'NONE') node.layoutSizingVertical = 'HUG';
            else { node.resize(node.width, 1); node.layoutSizingVertical = 'FIXED'; }
        }
    }
}

export function wrapWithMargin(node: SceneNode, styles: ResolvedStyles): { node: SceneNode, styles: ResolvedStyles } {
    const hasMargin = styles.marginTop || styles.marginRight || styles.marginBottom || styles.marginLeft;
    if (!hasMargin) return { node, styles };

    const wrapper = figma.createFrame();
    wrapper.name = 'margin-wrapper';
    wrapper.fills = [];
    wrapper.layoutMode = 'VERTICAL';

    if (styles.marginTop) wrapper.paddingTop = styles.marginTop;
    if (styles.marginRight) wrapper.paddingRight = styles.marginRight;
    if (styles.marginBottom) wrapper.paddingBottom = styles.marginBottom;
    if (styles.marginLeft) wrapper.paddingLeft = styles.marginLeft;

    wrapper.appendChild(node);
    applySizingConstraints(node, styles, 'VERTICAL');

    const wrapperStyles = { ...styles };
    if (typeof styles.width === 'number') wrapperStyles.width = 'HUG';
    if (typeof styles.height === 'number') wrapperStyles.height = 'HUG';

    return { node: wrapper, styles: wrapperStyles };
}

export function applyLayoutConstraints(node: SceneNode, styles: ResolvedStyles, parentLayoutMode: string) {
    const canSetConstraints = (node.type === 'FRAME' && node.layoutMode !== 'NONE') || parentLayoutMode !== 'NONE';
    if (canSetConstraints && (node.type === 'FRAME' || node.type === 'TEXT')) {
        if (styles.minWidth !== undefined) node.minWidth = styles.minWidth;
        if (styles.maxWidth !== undefined) node.maxWidth = styles.maxWidth;
        if (styles.minHeight !== undefined) node.minHeight = styles.minHeight;
        if (styles.maxHeight !== undefined) node.maxHeight = styles.maxHeight;
    }
}

interface BuildResult {
    node: SceneNode;
    styles: ResolvedStyles;
}

export async function buildFigmaNode(element: ParsedElement, customColors: Record<string, string>, iconMap: Record<string, string>, availableWidth?: number, screenWidth?: number, inheritedStyles: ResolvedStyles = {}): Promise<BuildResult | null> {
    const styles = resolveClasses(element.classes, customColors, screenWidth);
    const hasFa = element.classes.some(c => c.startsWith('fa') && c !== 'fa-solid' && c !== 'fa-regular' && c !== 'fa-brands');

    // Icon handling
    if (hasFa) {
        const iconClass = element.classes.find(c => c.startsWith('fa-') && c !== 'fa-solid' && c !== 'fa-regular' && c !== 'fa-brands');
        if (iconClass) {
            const iconName = iconClass.slice(3);
            let iconStyle = 'fa4';
            if (element.classes.includes('fas') || element.classes.includes('fa-solid')) iconStyle = 'solid';
            else if (element.classes.includes('far') || element.classes.includes('fa-regular')) iconStyle = 'regular';
            else if (element.classes.includes('fab') || element.classes.includes('fa-brands')) iconStyle = 'brands';

            let svgContent = iconMap[`${iconStyle}/${iconName}`];
            if (!svgContent) {
                for (const k of [`fa4/${iconName}`, `solid/${iconName}`, `regular/${iconName}`, `brands/${iconName}`]) {
                    if (iconMap[k]) { svgContent = iconMap[k]; break; }
                }
            }

            if (svgContent) {
                if (styles.textColor) {
                    const hexColor = `#${Math.round(styles.textColor.r * 255).toString(16).padStart(2, '0')}${Math.round(styles.textColor.g * 255).toString(16).padStart(2, '0')}${Math.round(styles.textColor.b * 255).toString(16).padStart(2, '0')}`;
                    svgContent = svgContent.replace(/<path/g, `<path fill="${hexColor}"`).replace(/fill="[^"]*"/g, `fill="${hexColor}"`);
                }
                const svgNode = figma.createNodeFromSvg(svgContent);
                svgNode.name = `fa-${iconName}`;
                const size = styles.fontSize || 16;
                svgNode.resize(size, size);
                styles.width = size;
                styles.height = size;
                return { node: svgNode, styles };
            }
        }
    }

    // Text handling
    if (element.tagName === '#text') {
        const text = figma.createText();
        const combinedStyles = { ...inheritedStyles, ...styles };
        const requestedFontWeight = combinedStyles.fontWeight || 'Regular';
        let loadedFontStyle = 'Regular';
        try {
            await figma.loadFontAsync({ family: 'Inter', style: requestedFontWeight });
            loadedFontStyle = requestedFontWeight;
        } catch {
            try { await figma.loadFontAsync({ family: 'Inter', style: 'Regular' }); loadedFontStyle = 'Regular'; } catch (e) { }
        }
        text.fontName = { family: 'Inter', style: loadedFontStyle };
        text.characters = element.textContent;
        if (combinedStyles.fontSize) text.fontSize = combinedStyles.fontSize;
        if (combinedStyles.lineHeight) text.lineHeight = { value: combinedStyles.lineHeight, unit: 'PIXELS' };
        if (combinedStyles.textColor) text.fills = [{ type: 'SOLID', color: combinedStyles.textColor }];
        if (combinedStyles.textAlign) text.textAlignHorizontal = combinedStyles.textAlign;
        if (combinedStyles.opacity !== undefined) text.opacity = combinedStyles.opacity;
        return { node: text, styles: combinedStyles };
    }

    // Frame handling
    const frame = figma.createFrame();
    frame.resize(frame.width, 1);
    const meaningfulClasses = element.classes.filter(c => !c.match(/^(p|m|w|h|min|max|flex|gap|bg|text|rounded|border|shadow)-/) && !['flex', 'container', 'items-center', 'justify-between', 'justify-around'].includes(c));
    frame.name = element.tagName + (meaningfulClasses.length ? '.' + meaningfulClasses.slice(0, 2).join('.') : '');
    frame.fills = [];

    if (styles.display === 'flex') frame.layoutMode = styles.flexDirection || 'HORIZONTAL';
    else if (styles.display === 'grid') frame.layoutMode = 'HORIZONTAL';
    else frame.layoutMode = 'VERTICAL';

    if (frame.layoutMode === 'HORIZONTAL') {
        frame.itemSpacing = styles.gapX ?? styles.gap ?? 0;
        if (styles.flexWrap === 'WRAP') frame.counterAxisSpacing = styles.gapY ?? styles.gap ?? 0;
    } else if (frame.layoutMode === 'VERTICAL') {
        frame.itemSpacing = styles.gapY ?? styles.gap ?? 0;
        if (styles.flexWrap === 'WRAP') frame.counterAxisSpacing = styles.gapX ?? styles.gap ?? 0;
    }

    if (styles.paddingTop !== undefined) frame.paddingTop = styles.paddingTop;
    if (styles.paddingRight !== undefined) frame.paddingRight = styles.paddingRight;
    if (styles.paddingBottom !== undefined) frame.paddingBottom = styles.paddingBottom;
    if (styles.paddingLeft !== undefined) frame.paddingLeft = styles.paddingLeft;

    if (styles.justifyContent) frame.primaryAxisAlignItems = styles.justifyContent;
    frame.counterAxisAlignItems = styles.alignItems === 'STRETCH' ? 'MIN' : (styles.alignItems || 'MIN');

    if ((styles.flexWrap === 'WRAP' || styles.display === 'grid') && frame.layoutMode === 'HORIZONTAL') frame.layoutWrap = 'WRAP';
    if (styles.backgroundColor) frame.fills = [{ type: 'SOLID', color: styles.backgroundColor, opacity: styles.backgroundOpacity ?? 1 }];
    if (styles.overflow === 'hidden') frame.clipsContent = true;
    if (styles.borderWidth) {
        frame.strokeWeight = styles.borderWidth;
        frame.strokes = [{ type: 'SOLID', color: styles.borderColor || { r: 0.8, g: 0.8, b: 0.8 } }];
    }
    if (styles.borderRadius !== undefined) frame.cornerRadius = styles.borderRadius;
    if (styles.borderRadiusTL !== undefined) frame.topLeftRadius = styles.borderRadiusTL;
    if (styles.borderRadiusTR !== undefined) frame.topRightRadius = styles.borderRadiusTR;
    if (styles.borderRadiusBR !== undefined) frame.bottomRightRadius = styles.borderRadiusBR;
    if (styles.borderRadiusBL !== undefined) frame.bottomLeftRadius = styles.borderRadiusBL;
    if (styles.shadows) frame.effects = styles.shadows;
    if (styles.opacity !== undefined) frame.opacity = styles.opacity;

    if ((element.tagName === 'input' || element.tagName === 'textarea') && element.attributes['placeholder']) {
        const placeholderText = figma.createText();
        try { await figma.loadFontAsync({ family: 'Inter', style: 'Regular' }); } catch { }
        placeholderText.fontName = { family: 'Inter', style: 'Regular' };
        placeholderText.characters = element.attributes['placeholder'];
        placeholderText.fontSize = styles.fontSize || 14;
        placeholderText.fills = [{ type: 'SOLID', color: { r: 0.6, g: 0.6, b: 0.6 } }];
        frame.appendChild(placeholderText);
    }

    let resolvedWidth: number | undefined = (typeof styles.width === 'number') ? styles.width : (styles.width === 'FILL' ? availableWidth : undefined);
    let innerWidth = resolvedWidth;
    if (innerWidth !== undefined) {
        innerWidth = innerWidth - (styles.paddingLeft || 0) - (styles.paddingRight || 0) - ((styles.borderWidth || 0) * 2);
    }

    const absoluteChildren: { node: SceneNode, styles: ResolvedStyles }[] = [];
    for (const child of element.children) {
        const childInheritedStyles: ResolvedStyles = {
            textColor: styles.textColor || inheritedStyles.textColor,
            fontSize: styles.fontSize || inheritedStyles.fontSize,
            fontWeight: styles.fontWeight || inheritedStyles.fontWeight,
            fontFamily: styles.fontFamily || inheritedStyles.fontFamily,
            textAlign: styles.textAlign || inheritedStyles.textAlign,
            lineHeight: styles.lineHeight || inheritedStyles.lineHeight,
        };
        const childResult = await buildFigmaNode(child, customColors, iconMap, innerWidth, screenWidth, childInheritedStyles);
        if (childResult) {
            if (childResult.styles.position === 'ABSOLUTE') absoluteChildren.push(childResult);
            else {
                frame.appendChild(childResult.node);
                applySizingConstraints(childResult.node, childResult.styles, frame.layoutMode);
                applyLayoutConstraints(childResult.node, childResult.styles, frame.layoutMode);
            }
        }
    }

    // Grid layout child sizing
    if (styles.display === 'grid' && styles.gridCols && frame.children.length > 0) {
        const containerWidth = (typeof styles.width === 'number' ? styles.width : innerWidth);
        if (containerWidth) {
            let workingWidth = containerWidth;
            if (typeof styles.width === 'number') workingWidth = styles.width - (styles.paddingLeft || 0) - (styles.paddingRight || 0) - ((styles.borderWidth || 0) * 2);
            if (workingWidth > 0 && styles.gridCols > 0) {
                const colWidth = (workingWidth - ((styles.gridCols - 1) * (styles.gapX ?? 0))) / styles.gridCols;
                if (colWidth > 0) {
                    for (const childNode of frame.children) {
                        if ('resize' in childNode) childNode.resize(colWidth, childNode.height);
                        if ('layoutSizingHorizontal' in childNode) (childNode as any).layoutSizingHorizontal = 'FIXED';
                    }
                }
            }
        }
    }

    // Justify-around simulation
    if (element.classes.includes('justify-around') && frame.layoutMode === 'HORIZONTAL' && frame.layoutWrap === 'NO_WRAP' && frame.children.length > 0) {
        const containerWidth = (typeof styles.width === 'number' ? styles.width : availableWidth) || screenWidth;
        if (containerWidth) {
            let childrenTotalWidth = 0;
            for (const childNode of frame.children) childrenTotalWidth += childNode.width;
            const freeSpace = containerWidth - (styles.paddingLeft || 0) - (styles.paddingRight || 0) - childrenTotalWidth;
            if (freeSpace > 0) {
                const edgePadding = (freeSpace / frame.children.length) / 2;
                frame.paddingLeft = (styles.paddingLeft || 0) + edgePadding;
                frame.paddingRight = (styles.paddingRight || 0) + edgePadding;
            }
        }
    }

    // Absolute children
    if (absoluteChildren.length > 0) {
        for (const absChild of absoluteChildren) {
            frame.appendChild(absChild.node);
            (absChild.node as any).layoutPositioning = 'ABSOLUTE';
            const node = absChild.node as any;
            const absStyles = absChild.styles;
            if (absStyles.left !== undefined && absStyles.right !== undefined) {
                node.constraints = { horizontal: 'STRETCH', vertical: node.constraints.vertical };
                node.x = absStyles.left;
                node.resize(frame.width - absStyles.left - absStyles.right, node.height);
            } else if (absStyles.left !== undefined) {
                node.constraints = { horizontal: 'MIN', vertical: node.constraints.vertical };
                node.x = absStyles.left;
            } else if (absStyles.right !== undefined) {
                node.constraints = { horizontal: 'MAX', vertical: node.constraints.vertical };
                node.x = frame.width - node.width - absStyles.right;
            } else { node.constraints = { horizontal: 'MIN', vertical: node.constraints.vertical }; node.x = 0; }

            if (absStyles.top !== undefined && absStyles.bottom !== undefined) {
                node.constraints = { horizontal: node.constraints.horizontal, vertical: 'STRETCH' };
                node.y = absStyles.top;
                node.resize(node.width, frame.height - absStyles.top - absStyles.bottom);
            } else if (absStyles.top !== undefined) {
                node.constraints = { horizontal: node.constraints.horizontal, vertical: 'MIN' };
                node.y = absStyles.top;
            } else if (absStyles.bottom !== undefined) {
                node.constraints = { horizontal: node.constraints.horizontal, vertical: 'MAX' };
                node.y = frame.height - node.height - absStyles.bottom;
            } else { node.constraints = { horizontal: node.constraints.horizontal, vertical: 'MIN' }; node.y = 0; }
        }
    }

    return wrapWithMargin(frame, styles);
}
