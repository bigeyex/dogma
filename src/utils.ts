import { BREAKPOINTS, SPACING_SCALE } from './constants';

export function hexToRgb(hex: string): RGB {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
        return {
            r: parseInt(result[1], 16) / 255,
            g: parseInt(result[2], 16) / 255,
            b: parseInt(result[3], 16) / 255,
        };
    }
    return { r: 0, g: 0, b: 0 };
}

export function parseSpacing(value: string): number | undefined {
    if (SPACING_SCALE[value] !== undefined) return SPACING_SCALE[value];
    if (value === 'screen') return 800; // Default viewport height fallback

    const arbitraryMatch = value.match(/^\[(\d+)(?:px)?\]$/);
    if (arbitraryMatch) {
        return parseInt(arbitraryMatch[1]);
    }

    return undefined;
}

export function sortClasses(classes: string[], screenWidth: number): string[] {
    const parsed = classes.map(cls => {
        const parts = cls.split(':');
        let prefix = '';
        let baseClass = cls;

        if (parts.length > 1) {
            const possiblePrefix = parts[0];
            if (BREAKPOINTS[possiblePrefix]) {
                prefix = possiblePrefix;
                baseClass = parts.slice(1).join(':');
            }
        }
        return { original: cls, prefix, baseClass };
    });

    const active = parsed.filter(p => {
        if (!p.prefix) return true;
        return screenWidth >= BREAKPOINTS[p.prefix];
    });

    active.sort((a, b) => {
        const scoreA = a.prefix ? BREAKPOINTS[a.prefix] : 0;
        const scoreB = b.prefix ? BREAKPOINTS[b.prefix] : 0;
        return scoreA - scoreB;
    });

    return active.map(p => p.baseClass);
}

export function parseTailwindConfig(html: string): Record<string, string> {
    const customColors: Record<string, string> = {};
    const configMatch = html.match(/tailwind\.config\s*=\s*\{[\s\S]*?\n\s*\}/);
    if (!configMatch) return customColors;

    const configStr = configMatch[0];
    const colorsMatch = configStr.match(/colors\s*:\s*\{([^}]+)\}/);
    if (colorsMatch) {
        const colorsStr = colorsMatch[1];
        const colorRegex = /(\w+)\s*:\s*['"]([^'"]+)['"]/g;
        let match;
        while ((match = colorRegex.exec(colorsStr)) !== null) {
            customColors[match[1]] = match[2];
        }
    }

    return customColors;
}

export function calculateLineHeight(style: any, fontSize: number): number {
    if (!style || !style.lineHeight) return fontSize * 1.2;
    const lh = style.lineHeight;
    if (lh.unit === 'PIXELS') return lh.value;
    if (lh.unit === 'PERCENT') return (fontSize * lh.value) / 100;
    return fontSize * 1.2;
}

export function hexAlphaToRgba(hex: string, alpha: number): { r: number, g: number, b: number, a: number } {
    const rgb = hexToRgb(hex);
    return Object.assign({}, rgb, { a: alpha });
}

export function rgbToHex(r: number, g: number, b: number): string {
    const toHex = (c: number) => {
        const hex = Math.round(c * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    return '#' + toHex(r) + toHex(g) + toHex(b);
}

export function rgbToHsl(r: number, g: number, b: number): { h: number, s: number, l: number } {
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return { h, s, l };
}

export function hslToRgb(h: number, s: number, l: number): RGB {
    let r, g, b;
    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return { r, g, b };
}
