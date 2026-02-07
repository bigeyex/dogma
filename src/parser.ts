import { ParsedElement, ResolvedStyles } from './types';
import { TAILWIND_COLORS, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS, SHADOWS } from './constants';
import { hexToRgb, parseSpacing, sortClasses } from './utils';

export function parseColor(colorClass: string, customColors: Record<string, string>): RGB | null {
    if (customColors[colorClass]) return hexToRgb(customColors[colorClass]);
    if (colorClass.startsWith('#')) return hexToRgb(colorClass);

    if (colorClass.startsWith('[') && colorClass.endsWith(']')) {
        const value = colorClass.slice(1, -1);
        if (value.startsWith('#')) return hexToRgb(value);
    }

    const parts = colorClass.split('-');
    if (parts.length === 1) {
        const colorPalette = TAILWIND_COLORS[parts[0]];
        if (colorPalette) {
            const hex = colorPalette['DEFAULT'] || colorPalette['500'];
            if (hex && hex !== 'transparent') return hexToRgb(hex);
        }
    } else if (parts.length >= 2) {
        const shade = parts[parts.length - 1];
        const colorName = parts.slice(0, -1).join('-');
        const colorPalette = TAILWIND_COLORS[colorName];
        if (colorPalette && colorPalette[shade]) {
            return hexToRgb(colorPalette[shade]);
        }
    }
    return null;
}

export function parseHTML(html: string): ParsedElement[] {
    const cleanedHtml = html.replace(/<script[\s\S]*?<\/script>/gi, '');
    const noComments = cleanedHtml.replace(/<!--[\s\S]*?-->/g, '');
    const elements: ParsedElement[] = [];
    const stack: ParsedElement[] = [];

    const tagRegex = /<\/?([a-z][a-z0-9]*)\s*([^>]*)>|([^<]+)/gi;
    let match;

    while ((match = tagRegex.exec(noComments)) !== null) {
        const [fullMatch, tagName, attributes, textContent] = match;

        if (textContent) {
            const trimmed = textContent.trim();
            if (trimmed && stack.length > 0) {
                stack[stack.length - 1].children.push({
                    tagName: '#text',
                    classes: [],
                    attributes: {},
                    textContent: trimmed,
                    children: []
                });
            }
        } else if (fullMatch.startsWith('</')) {
            if (stack.length > 0) {
                const closed = stack.pop()!;
                if (stack.length > 0) {
                    stack[stack.length - 1].children.push(closed);
                } else {
                    elements.push(closed);
                }
            }
        } else if (tagName) {
            const lowerTagName = tagName.toLowerCase();
            const attrRegex = /(\w+)\s*=\s*["']([^"']*)["']/g;
            const attrMap: Record<string, string> = {};
            let attrMatch;
            while ((attrMatch = attrRegex.exec(attributes)) !== null) {
                attrMap[attrMatch[1].toLowerCase()] = attrMatch[2];
            }
            const classes = attrMap['class'] ? attrMap['class'].split(/\s+/).filter(Boolean) : [];
            const element: ParsedElement = {
                tagName: lowerTagName,
                classes,
                attributes: attrMap,
                textContent: '',
                children: [],
            };
            const selfClosing = ['img', 'br', 'hr', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'param', 'source', 'track', 'wbr'];
            if (selfClosing.includes(lowerTagName) || attributes.endsWith('/')) {
                if (stack.length > 0) stack[stack.length - 1].children.push(element);
                else elements.push(element);
            } else {
                stack.push(element);
            }
        }
    }
    while (stack.length > 1) {
        const closed = stack.pop()!;
        stack[stack.length - 1].children.push(closed);
    }
    if (stack.length === 1) elements.push(stack[0]);
    return elements;
}

export function resolveClasses(classes: string[], customColors: Record<string, string>, screenWidth?: number): ResolvedStyles {
    const processedClasses = screenWidth ? sortClasses(classes, screenWidth) : classes;
    const styles: ResolvedStyles = {};

    for (const cls of processedClasses) {
        if (cls === 'flex' || cls === 'inline-flex') {
            styles.display = 'flex';
            if (!styles.flexDirection) styles.flexDirection = 'HORIZONTAL';
        } else if (cls === 'flex-row') {
            styles.flexDirection = 'HORIZONTAL';
        } else if (cls === 'flex-col') {
            styles.flexDirection = 'VERTICAL';
        } else if (cls === 'flex-wrap') {
            styles.flexWrap = 'WRAP';
        } else if (cls === 'flex-nowrap') {
            styles.flexWrap = 'NO_WRAP';
        } else if (cls === 'flex-1' || cls === 'flex-grow') {
            styles.flexGrow = 1;
        } else if (cls === 'flex-grow-0') {
            styles.flexGrow = 0;
        }
        else if (cls === 'absolute' || cls === 'fixed') styles.position = 'ABSOLUTE';
        else if (cls === 'relative') styles.position = 'RELATIVE';
        else if (cls.startsWith('top-')) {
            const val = parseSpacing(cls.slice(4));
            if (val !== undefined) styles.top = val;
        }
        else if (cls.startsWith('right-')) {
            const val = parseSpacing(cls.slice(6));
            if (val !== undefined) styles.right = val;
        }
        else if (cls.startsWith('bottom-')) {
            const val = parseSpacing(cls.slice(7));
            if (val !== undefined) styles.bottom = val;
        }
        else if (cls.startsWith('left-')) {
            const val = parseSpacing(cls.slice(5));
            if (val !== undefined) styles.left = val;
        }
        else if (cls.startsWith('inset-')) {
            const val = parseSpacing(cls.slice(6));
            if (val !== undefined) {
                styles.top = val; styles.right = val; styles.bottom = val; styles.left = val;
            }
        }
        else if (cls === 'justify-start') styles.justifyContent = 'MIN';
        else if (cls === 'justify-center') styles.justifyContent = 'CENTER';
        else if (cls === 'justify-end') styles.justifyContent = 'MAX';
        else if (cls === 'justify-between') styles.justifyContent = 'SPACE_BETWEEN';
        else if (cls === 'items-start') styles.alignItems = 'MIN';
        else if (cls === 'items-center') styles.alignItems = 'CENTER';
        else if (cls === 'items-end') styles.alignItems = 'MAX';
        else if (cls === 'items-stretch') styles.alignItems = 'STRETCH';
        else if (cls.startsWith('gap-x-') || cls.startsWith('space-x-')) {
            const val = parseSpacing(cls.startsWith('gap-x-') ? cls.slice(6) : cls.slice(8));
            if (val !== undefined) styles.gapX = val;
        }
        else if (cls.startsWith('gap-y-') || cls.startsWith('space-y-')) {
            const val = parseSpacing(cls.startsWith('gap-y-') ? cls.slice(6) : cls.slice(8));
            if (val !== undefined) styles.gapY = val;
        }
        else if (cls.startsWith('gap-')) {
            const val = parseSpacing(cls.slice(4));
            if (val !== undefined) {
                styles.gap = val; styles.gapX = val; styles.gapY = val;
            }
        }
        else if (cls === 'w-full') styles.width = 'FILL';
        else if (cls === 'w-auto' || cls === 'w-fit') styles.width = 'HUG';
        else if (cls.startsWith('w-')) {
            const val = parseSpacing(cls.slice(2));
            if (val !== undefined) styles.width = val;
        }
        else if (cls === 'h-full') styles.height = 'FILL';
        else if (cls === 'h-auto' || cls === 'h-fit') styles.height = 'HUG';
        else if (cls.startsWith('h-')) {
            const val = parseSpacing(cls.slice(2));
            if (val !== undefined) styles.height = val;
        }
        else if (cls.startsWith('min-w-')) {
            const val = parseSpacing(cls.slice(6));
            if (val !== undefined) styles.minWidth = val;
        }
        else if (cls.startsWith('max-w-')) {
            const val = parseSpacing(cls.slice(6));
            if (val !== undefined) styles.maxWidth = val;
        }
        else if (cls.startsWith('min-h-')) {
            const val = parseSpacing(cls.slice(6));
            if (val !== undefined) styles.minHeight = val;
        }
        else if (cls.startsWith('max-h-')) {
            const val = parseSpacing(cls.slice(6));
            if (val !== undefined) styles.maxHeight = val;
        }
        else if (cls.startsWith('px-')) {
            const val = parseSpacing(cls.slice(3));
            if (val !== undefined) { styles.paddingRight = val; styles.paddingLeft = val; }
        }
        else if (cls.startsWith('py-')) {
            const val = parseSpacing(cls.slice(3));
            if (val !== undefined) { styles.paddingTop = val; styles.paddingBottom = val; }
        }
        else if (cls.startsWith('pt-')) {
            const val = parseSpacing(cls.slice(3));
            if (val !== undefined) styles.paddingTop = val;
        }
        else if (cls.startsWith('pr-')) {
            const val = parseSpacing(cls.slice(3));
            if (val !== undefined) styles.paddingRight = val;
        }
        else if (cls.startsWith('pb-')) {
            const val = parseSpacing(cls.slice(3));
            if (val !== undefined) styles.paddingBottom = val;
        }
        else if (cls.startsWith('pl-')) {
            const val = parseSpacing(cls.slice(3));
            if (val !== undefined) styles.paddingLeft = val;
        }
        else if (cls.startsWith('p-')) {
            const val = parseSpacing(cls.slice(2));
            if (val !== undefined) {
                styles.paddingTop = val; styles.paddingRight = val; styles.paddingBottom = val; styles.paddingLeft = val;
            }
        }
        else if (cls.startsWith('mx-')) {
            const val = parseSpacing(cls.slice(3));
            if (val !== undefined) { styles.marginRight = val; styles.marginLeft = val; }
        }
        else if (cls.startsWith('my-')) {
            const val = parseSpacing(cls.slice(3));
            if (val !== undefined) { styles.marginTop = val; styles.marginBottom = val; }
        }
        else if (cls.startsWith('mt-')) {
            const val = parseSpacing(cls.slice(3));
            if (val !== undefined) styles.marginTop = val;
        }
        else if (cls.startsWith('mr-')) {
            const val = parseSpacing(cls.slice(3));
            if (val !== undefined) styles.marginRight = val;
        }
        else if (cls.startsWith('mb-')) {
            const val = parseSpacing(cls.slice(3));
            if (val !== undefined) styles.marginBottom = val;
        }
        else if (cls.startsWith('ml-')) {
            const val = parseSpacing(cls.slice(3));
            if (val !== undefined) styles.marginLeft = val;
        }
        else if (cls.startsWith('m-')) {
            const val = parseSpacing(cls.slice(2));
            if (val !== undefined) {
                styles.marginTop = val; styles.marginRight = val; styles.marginBottom = val; styles.marginLeft = val;
            }
        }
        else if (cls.startsWith('bg-')) {
            const colorPart = cls.slice(3);
            const opacityMatch = colorPart.match(/^(.+)\/(\d+)$/);
            if (opacityMatch) {
                const color = parseColor(opacityMatch[1], customColors);
                if (color) { styles.backgroundColor = color; styles.backgroundOpacity = parseInt(opacityMatch[2]) / 100; }
            } else {
                const color = parseColor(colorPart, customColors);
                if (color) styles.backgroundColor = color;
            }
        }
        else if (cls.startsWith('text-') && !['text-left', 'text-center', 'text-right', 'text-justify'].includes(cls)) {
            const value = cls.slice(5);
            if (FONT_SIZES[value]) {
                styles.fontSize = FONT_SIZES[value].size;
                styles.lineHeight = FONT_SIZES[value].lineHeight;
            } else {
                const color = parseColor(value, customColors);
                if (color) styles.textColor = color;
            }
        }
        else if (cls === 'text-left') styles.textAlign = 'LEFT';
        else if (cls === 'text-center') styles.textAlign = 'CENTER';
        else if (cls === 'text-right') styles.textAlign = 'RIGHT';
        else if (cls === 'text-justify') styles.textAlign = 'JUSTIFIED';
        else if (cls.startsWith('font-')) {
            const weight = cls.slice(5);
            if (FONT_WEIGHTS[weight]) styles.fontWeight = FONT_WEIGHTS[weight];
        }
        else if (cls.startsWith('border-') && !['border-t-', 'border-r-', 'border-b-', 'border-l-'].some(p => cls.startsWith(p))) {
            const value = cls.slice(7);
            if (['0', '2', '4', '8'].includes(value)) styles.borderWidth = parseInt(value);
            else {
                const color = parseColor(value, customColors);
                if (color) styles.borderColor = color;
            }
        }
        else if (cls === 'border') styles.borderWidth = 1;
        else if (cls === 'rounded') styles.borderRadius = BORDER_RADIUS['DEFAULT'];
        else if (cls === 'rounded-none') styles.borderRadius = 0;
        else if (cls.startsWith('rounded-') && !['-t-', '-r-', '-b-', '-l-', '-tl-', '-tr-', '-br-', '-bl-'].some(p => cls.includes(p))) {
            const val = BORDER_RADIUS[cls.slice(8)];
            if (val !== undefined) styles.borderRadius = val;
        }
        else if (cls.startsWith('rounded-tl-')) {
            const val = BORDER_RADIUS[cls.slice(11)];
            if (val !== undefined) styles.borderRadiusTL = val;
        }
        else if (cls.startsWith('rounded-tr-')) {
            const val = BORDER_RADIUS[cls.slice(11)];
            if (val !== undefined) styles.borderRadiusTR = val;
        }
        else if (cls.startsWith('rounded-br-')) {
            const val = BORDER_RADIUS[cls.slice(11)];
            if (val !== undefined) styles.borderRadiusBR = val;
        }
        else if (cls.startsWith('rounded-bl-')) {
            const val = BORDER_RADIUS[cls.slice(11)];
            if (val !== undefined) styles.borderRadiusBL = val;
        }
        else if (cls === 'shadow') styles.shadows = SHADOWS['DEFAULT'];
        else if (cls.startsWith('shadow-')) {
            const val = SHADOWS[cls.slice(7)];
            if (val) styles.shadows = val;
        }
        else if (cls.startsWith('opacity-')) {
            const val = parseInt(cls.slice(8));
            if (!isNaN(val)) styles.opacity = val / 100;
        }
        else if (cls === 'grid') {
            styles.display = 'grid'; styles.flexWrap = 'WRAP';
        }
        else if (cls.startsWith('grid-cols-')) {
            const cols = parseInt(cls.slice(10));
            if (!isNaN(cols)) styles.gridCols = cols;
        }
        else if (cls === 'justify-around') styles.justifyContent = 'SPACE_BETWEEN';
        else if (cls === 'flex-shrink-0') styles.flexShrink = 0;
        else if (cls === 'flex-shrink') styles.flexShrink = 1;
        else if (cls === 'overflow-hidden') styles.overflow = 'hidden';
        else if (['overflow-visible', 'overflow-auto', 'overflow-x-auto', 'overflow-y-auto'].includes(cls)) styles.overflow = 'visible';
        else if (cls === 'object-cover') styles.objectFit = 'cover';
        else if (cls === 'object-contain') styles.objectFit = 'contain';
        else if (cls === 'object-fill') styles.objectFit = 'fill';
        else if (cls === 'whitespace-nowrap') styles.whiteSpace = 'nowrap';
        else if (cls === 'whitespace-normal') styles.whiteSpace = 'normal';
        else if (cls === 'leading-relaxed') styles.lineHeight = 1.625 * (styles.fontSize || 16);
        else if (cls === 'leading-loose') styles.lineHeight = 2 * (styles.fontSize || 16);
        else if (cls === 'leading-tight') styles.lineHeight = 1.25 * (styles.fontSize || 16);
        else if (cls === 'leading-snug') styles.lineHeight = 1.375 * (styles.fontSize || 16);
        else if (cls === 'leading-normal') styles.lineHeight = 1.5 * (styles.fontSize || 16);
        else if (cls === 'font-serif') styles.fontFamily = 'serif';
        else if (cls === 'font-sans') styles.fontFamily = 'sans';
        else if (cls === 'font-mono') styles.fontFamily = 'mono';
        else if (cls.startsWith('bg-gradient-to-')) {
            const dir = cls.slice(15);
            const validDirs = ['t', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl'];
            if (validDirs.includes(dir)) {
                if (!styles.gradient) styles.gradient = { type: 'LINEAR', direction: `to-${dir}` as any };
                else styles.gradient.direction = `to-${dir}` as any;
            }
        }
        else if (cls.startsWith('from-')) {
            const colorPart = cls.slice(5);
            const opacityMatch = colorPart.match(/^(.+)\/(\d+)$/);
            if (!styles.gradient) styles.gradient = { type: 'LINEAR', direction: 'to-b' };
            if (opacityMatch) {
                const color = parseColor(opacityMatch[1], customColors);
                if (color) { styles.gradient.from = color; styles.gradient.fromOpacity = parseInt(opacityMatch[2]) / 100; }
            } else {
                const color = parseColor(colorPart, customColors);
                if (color) styles.gradient.from = color;
            }
        }
        else if (cls.startsWith('via-')) {
            const colorPart = cls.slice(4);
            const opacityMatch = colorPart.match(/^(.+)\/(\d+)$/);
            if (!styles.gradient) styles.gradient = { type: 'LINEAR', direction: 'to-b' };
            if (opacityMatch) {
                const color = parseColor(opacityMatch[1], customColors);
                if (color) { styles.gradient.via = color; styles.gradient.viaOpacity = parseInt(opacityMatch[2]) / 100; }
            } else {
                const color = parseColor(colorPart, customColors);
                if (color) styles.gradient.via = color;
            }
        }
        else if (cls.startsWith('to-')) {
            const possibleDir = cls.slice(3);
            const validDirections = ['t', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl'];
            if (validDirections.includes(possibleDir)) {
                // This is a direction change, handled by bg-gradient-to-...
                // but if someone writes 'to-r' separately, we could handle it here
                if (!styles.gradient) styles.gradient = { type: 'LINEAR', direction: `to-${possibleDir}` as any };
                else styles.gradient.direction = `to-${possibleDir}` as any;
            } else {
                // This is a color
                const colorPart = cls.slice(3);
                const opacityMatch = colorPart.match(/^(.+)\/(\d+)$/);
                if (!styles.gradient) styles.gradient = { type: 'LINEAR', direction: 'to-b' };
                if (opacityMatch) {
                    const color = parseColor(opacityMatch[1], customColors);
                    if (color) { styles.gradient.to = color; styles.gradient.toOpacity = parseInt(opacityMatch[2]) / 100; }
                } else {
                    const color = parseColor(colorPart, customColors);
                    if (color) styles.gradient.to = color;
                }
            }
        }
    }
    return styles;
}
