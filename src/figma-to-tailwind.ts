import { TAILWIND_COLORS, SPACING_SCALE, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from './constants';

/* ============================================================================
   COLOR UTILITIES
   ============================================================================ */

function rgbToHex(r: number, g: number, b: number): string {
    const toHex = (n: number) => Math.round(n * 255).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255
    } : null;
}

function colorDistance(c1: { r: number; g: number; b: number }, c2: { r: number; g: number; b: number }): number {
    return Math.sqrt((c1.r - c2.r) ** 2 + (c1.g - c2.g) ** 2 + (c1.b - c2.b) ** 2);
}

function findClosestTailwindColor(hex: string, prefix: 'bg' | 'text' | 'border'): string {
    const target = hexToRgb(hex);
    if (!target) return `${prefix}-[${hex}]`;

    let closestClass = `${prefix}-[${hex}]`;
    let minDistance = Infinity;

    for (const [colorName, shades] of Object.entries(TAILWIND_COLORS)) {
        for (const [shade, colorHex] of Object.entries(shades)) {
            if (colorHex === 'transparent') continue;
            const rgb = hexToRgb(colorHex);
            if (!rgb) continue;

            const distance = colorDistance(target, rgb);
            if (distance < minDistance) {
                minDistance = distance;
                closestClass = shade === 'DEFAULT' ? `${prefix}-${colorName}` : `${prefix}-${colorName}-${shade}`;
            }
        }
    }

    // Use arbitrary value if no close match (threshold ~5% difference)
    return minDistance < 0.1 ? closestClass : `${prefix}-[${hex}]`;
}

/* ============================================================================
   SPACING UTILITIES
   ============================================================================ */

function findClosestSpacing(value: number): string {
    if (value === 0) return '0';

    let closest = '0';
    let minDiff = Infinity;

    for (const [key, px] of Object.entries(SPACING_SCALE)) {
        const diff = Math.abs(px - value);
        if (diff < minDiff) {
            minDiff = diff;
            closest = key;
        }
    }

    // Use arbitrary value if no close match
    return minDiff <= 2 ? closest : `[${Math.round(value)}px]`;
}

/* ============================================================================
   TYPOGRAPHY UTILITIES
   ============================================================================ */

function findClosestFontSize(size: number): string {
    let closest = 'base';
    let minDiff = Infinity;

    for (const [key, data] of Object.entries(FONT_SIZES)) {
        const diff = Math.abs(data.size - size);
        if (diff < minDiff) {
            minDiff = diff;
            closest = key;
        }
    }

    return minDiff <= 2 ? closest : `[${Math.round(size)}px]`;
}

function findFontWeight(weight: string): string | null {
    for (const [key, value] of Object.entries(FONT_WEIGHTS)) {
        if (value.toLowerCase() === weight.toLowerCase()) {
            return key;
        }
    }
    return null;
}

/* ============================================================================
   BORDER RADIUS UTILITIES
   ============================================================================ */

function findClosestBorderRadius(radius: number): string {
    if (radius === 0) return 'none';
    if (radius >= 9999) return 'full';

    let closest = 'DEFAULT';
    let minDiff = Infinity;

    for (const [key, px] of Object.entries(BORDER_RADIUS)) {
        if (key === 'full') continue;
        const diff = Math.abs(px - radius);
        if (diff < minDiff) {
            minDiff = diff;
            closest = key;
        }
    }

    return minDiff <= 2 ? (closest === 'DEFAULT' ? '' : closest) : `[${Math.round(radius)}px]`;
}

/* ============================================================================
   SHADOW UTILITIES
   ============================================================================ */

function findClosestShadow(effects: readonly Effect[]): string | null {
    const dropShadows = effects.filter(e => e.type === 'DROP_SHADOW' && e.visible);
    if (dropShadows.length === 0) return null;

    // Simple heuristic: match by radius of first shadow
    const firstShadow = dropShadows[0] as DropShadowEffect;
    const radius = firstShadow.radius;

    if (radius <= 2) return 'shadow-sm';
    if (radius <= 4) return 'shadow';
    if (radius <= 8) return 'shadow-md';
    if (radius <= 16) return 'shadow-lg';
    if (radius <= 30) return 'shadow-xl';
    return 'shadow-2xl';
}

/* ============================================================================
   MAIN CONVERTER
   ============================================================================ */

function convertNode(node: SceneNode, indent: number = 0): string {
    const indentStr = '  '.repeat(indent);
    const classes: string[] = [];

    // Skip invisible nodes
    if ('visible' in node && !node.visible) return '';

    // Handle text nodes
    if (node.type === 'TEXT') {
        const textNode = node as TextNode;

        // Font size
        if (typeof textNode.fontSize === 'number') {
            const sizeClass = findClosestFontSize(textNode.fontSize);
            classes.push(`text-${sizeClass}`);
        }

        // Font weight
        if (typeof textNode.fontName !== 'symbol' && textNode.fontName?.style) {
            const weightClass = findFontWeight(textNode.fontName.style);
            if (weightClass && weightClass !== 'normal') classes.push(`font-${weightClass}`);
        }

        // Text color
        if (textNode.fills && Array.isArray(textNode.fills) && textNode.fills.length > 0) {
            const fill = textNode.fills[0];
            if (fill.type === 'SOLID') {
                const hex = rgbToHex(fill.color.r, fill.color.g, fill.color.b);
                classes.push(findClosestTailwindColor(hex, 'text'));
            }
        }

        // Text alignment
        if (textNode.textAlignHorizontal === 'CENTER') classes.push('text-center');
        else if (textNode.textAlignHorizontal === 'RIGHT') classes.push('text-right');
        else if (textNode.textAlignHorizontal === 'JUSTIFIED') classes.push('text-justify');

        const classAttr = classes.length > 0 ? ` class="${classes.join(' ')}"` : '';
        const text = textNode.characters.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return `${indentStr}<span${classAttr}>${text}</span>\n`;
    }

    // Handle frames and groups
    if (node.type === 'FRAME' || node.type === 'GROUP' || node.type === 'COMPONENT' || node.type === 'INSTANCE') {
        const frameNode = node as FrameNode;

        // Layout
        if (frameNode.layoutMode === 'HORIZONTAL') {
            classes.push('flex', 'flex-row');
        } else if (frameNode.layoutMode === 'VERTICAL') {
            classes.push('flex', 'flex-col');
        }

        // Justify content
        if (frameNode.primaryAxisAlignItems === 'CENTER') classes.push('justify-center');
        else if (frameNode.primaryAxisAlignItems === 'MAX') classes.push('justify-end');
        else if (frameNode.primaryAxisAlignItems === 'SPACE_BETWEEN') classes.push('justify-between');

        // Align items
        if (frameNode.counterAxisAlignItems === 'CENTER') classes.push('items-center');
        else if (frameNode.counterAxisAlignItems === 'MAX') classes.push('items-end');

        // Gap
        if (frameNode.itemSpacing && frameNode.itemSpacing > 0) {
            classes.push(`gap-${findClosestSpacing(frameNode.itemSpacing)}`);
        }

        // Flex wrap
        if (frameNode.layoutWrap === 'WRAP') classes.push('flex-wrap');

        // Padding
        const pt = frameNode.paddingTop || 0;
        const pr = frameNode.paddingRight || 0;
        const pb = frameNode.paddingBottom || 0;
        const pl = frameNode.paddingLeft || 0;

        if (pt === pr && pr === pb && pb === pl && pt > 0) {
            classes.push(`p-${findClosestSpacing(pt)}`);
        } else {
            if (pt === pb && pt > 0) classes.push(`py-${findClosestSpacing(pt)}`);
            else {
                if (pt > 0) classes.push(`pt-${findClosestSpacing(pt)}`);
                if (pb > 0) classes.push(`pb-${findClosestSpacing(pb)}`);
            }
            if (pl === pr && pl > 0) classes.push(`px-${findClosestSpacing(pl)}`);
            else {
                if (pl > 0) classes.push(`pl-${findClosestSpacing(pl)}`);
                if (pr > 0) classes.push(`pr-${findClosestSpacing(pr)}`);
            }
        }

        // Sizing
        if (frameNode.layoutSizingHorizontal === 'FILL') classes.push('w-full');
        else if (typeof frameNode.width === 'number' && frameNode.layoutSizingHorizontal === 'FIXED') {
            classes.push(`w-[${Math.round(frameNode.width)}px]`);
        }

        if (frameNode.layoutSizingVertical === 'FILL') classes.push('h-full');
        else if (typeof frameNode.height === 'number' && frameNode.layoutSizingVertical === 'FIXED') {
            classes.push(`h-[${Math.round(frameNode.height)}px]`);
        }

        // Min/Max sizing
        if (frameNode.minWidth) classes.push(`min-w-[${Math.round(frameNode.minWidth)}px]`);
        if (frameNode.maxWidth && frameNode.maxWidth < 10000) classes.push(`max-w-[${Math.round(frameNode.maxWidth)}px]`);
        if (frameNode.minHeight) classes.push(`min-h-[${Math.round(frameNode.minHeight)}px]`);
        if (frameNode.maxHeight && frameNode.maxHeight < 10000) classes.push(`max-h-[${Math.round(frameNode.maxHeight)}px]`);

        // Background
        if (frameNode.fills && Array.isArray(frameNode.fills) && frameNode.fills.length > 0) {
            const fill = frameNode.fills[0];
            if (fill.type === 'SOLID' && fill.visible !== false) {
                const hex = rgbToHex(fill.color.r, fill.color.g, fill.color.b);
                classes.push(findClosestTailwindColor(hex, 'bg'));
                if (fill.opacity !== undefined && fill.opacity < 1) {
                    classes.push(`bg-opacity-${Math.round(fill.opacity * 100)}`);
                }
            }
        }

        // Border
        if (frameNode.strokes && Array.isArray(frameNode.strokes) && frameNode.strokes.length > 0) {
            const stroke = frameNode.strokes[0];
            if (stroke.type === 'SOLID' && stroke.visible !== false) {
                const borderWidth = typeof frameNode.strokeWeight === 'number' ? frameNode.strokeWeight : 1;
                if (borderWidth === 1) classes.push('border');
                else classes.push(`border-${borderWidth}`);

                const hex = rgbToHex(stroke.color.r, stroke.color.g, stroke.color.b);
                classes.push(findClosestTailwindColor(hex, 'border'));
            }
        }

        // Border radius
        const radiusTL = frameNode.topLeftRadius || 0;
        const radiusTR = frameNode.topRightRadius || 0;
        const radiusBR = frameNode.bottomRightRadius || 0;
        const radiusBL = frameNode.bottomLeftRadius || 0;

        if (radiusTL === radiusTR && radiusTR === radiusBR && radiusBR === radiusBL && radiusTL > 0) {
            const radiusClass = findClosestBorderRadius(radiusTL);
            classes.push(radiusClass ? `rounded-${radiusClass}` : 'rounded');
        } else {
            if (radiusTL > 0) classes.push(`rounded-tl-${findClosestBorderRadius(radiusTL) || 'DEFAULT'}`);
            if (radiusTR > 0) classes.push(`rounded-tr-${findClosestBorderRadius(radiusTR) || 'DEFAULT'}`);
            if (radiusBR > 0) classes.push(`rounded-br-${findClosestBorderRadius(radiusBR) || 'DEFAULT'}`);
            if (radiusBL > 0) classes.push(`rounded-bl-${findClosestBorderRadius(radiusBL) || 'DEFAULT'}`);
        }

        // Shadows
        if (frameNode.effects && frameNode.effects.length > 0) {
            const shadowClass = findClosestShadow(frameNode.effects);
            if (shadowClass) classes.push(shadowClass);
        }

        // Opacity
        if (frameNode.opacity !== undefined && frameNode.opacity < 1) {
            classes.push(`opacity-${Math.round(frameNode.opacity * 100)}`);
        }

        // Overflow
        if (frameNode.clipsContent) classes.push('overflow-hidden');

        // Convert children
        let childrenHtml = '';
        if ('children' in frameNode) {
            for (const child of frameNode.children) {
                childrenHtml += convertNode(child, indent + 1);
            }
        }

        const classAttr = classes.length > 0 ? ` class="${classes.join(' ')}"` : '';

        if (childrenHtml) {
            return `${indentStr}<div${classAttr}>\n${childrenHtml}${indentStr}</div>\n`;
        } else {
            return `${indentStr}<div${classAttr}></div>\n`;
        }
    }

    // Handle rectangles (simple shapes)
    if (node.type === 'RECTANGLE') {
        const rectNode = node as RectangleNode;

        // Size
        classes.push(`w-[${Math.round(rectNode.width)}px]`);
        classes.push(`h-[${Math.round(rectNode.height)}px]`);

        // Background
        if (rectNode.fills && Array.isArray(rectNode.fills) && rectNode.fills.length > 0) {
            const fill = rectNode.fills[0];
            if (fill.type === 'SOLID' && fill.visible !== false) {
                const hex = rgbToHex(fill.color.r, fill.color.g, fill.color.b);
                classes.push(findClosestTailwindColor(hex, 'bg'));
            }
        }

        // Border radius
        if (rectNode.cornerRadius && typeof rectNode.cornerRadius === 'number' && rectNode.cornerRadius > 0) {
            const radiusClass = findClosestBorderRadius(rectNode.cornerRadius);
            classes.push(radiusClass ? `rounded-${radiusClass}` : 'rounded');
        }

        const classAttr = classes.length > 0 ? ` class="${classes.join(' ')}"` : '';
        return `${indentStr}<div${classAttr}></div>\n`;
    }

    // Handle vectors (icons) - output as placeholder
    if (node.type === 'VECTOR' || node.type === 'BOOLEAN_OPERATION') {
        return `${indentStr}<!-- Icon: ${node.name} -->\n${indentStr}<i class="fa-solid fa-circle"></i>\n`;
    }

    return '';
}

export function figmaToTailwind(node: SceneNode): string {
    return convertNode(node, 0).trim();
}
