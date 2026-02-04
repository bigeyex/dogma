// Tailwind HTML to Figma Converter Plugin
// Converts HTML with Tailwind CSS classes to Figma designs

// ============================================================================
// TAILWIND DEFAULT COLORS
// ============================================================================

const TAILWIND_COLORS: Record<string, Record<string, string>> = {
  slate: { '50': '#f8fafc', '100': '#f1f5f9', '200': '#e2e8f0', '300': '#cbd5e1', '400': '#94a3b8', '500': '#64748b', '600': '#475569', '700': '#334155', '800': '#1e293b', '900': '#0f172a', '950': '#020617' },
  gray: { '50': '#f9fafb', '100': '#f3f4f6', '200': '#e5e7eb', '300': '#d1d5db', '400': '#9ca3af', '500': '#6b7280', '600': '#4b5563', '700': '#374151', '800': '#1f2937', '900': '#111827', '950': '#030712' },
  zinc: { '50': '#fafafa', '100': '#f4f4f5', '200': '#e4e4e7', '300': '#d4d4d8', '400': '#a1a1aa', '500': '#71717a', '600': '#52525b', '700': '#3f3f46', '800': '#27272a', '900': '#18181b', '950': '#09090b' },
  neutral: { '50': '#fafafa', '100': '#f5f5f5', '200': '#e5e5e5', '300': '#d4d4d4', '400': '#a3a3a3', '500': '#737373', '600': '#525252', '700': '#404040', '800': '#262626', '900': '#171717', '950': '#0a0a0a' },
  stone: { '50': '#fafaf9', '100': '#f5f5f4', '200': '#e7e5e4', '300': '#d6d3d1', '400': '#a8a29e', '500': '#78716c', '600': '#57534e', '700': '#44403c', '800': '#292524', '900': '#1c1917', '950': '#0c0a09' },
  red: { '50': '#fef2f2', '100': '#fee2e2', '200': '#fecaca', '300': '#fca5a5', '400': '#f87171', '500': '#ef4444', '600': '#dc2626', '700': '#b91c1c', '800': '#991b1b', '900': '#7f1d1d', '950': '#450a0a' },
  orange: { '50': '#fff7ed', '100': '#ffedd5', '200': '#fed7aa', '300': '#fdba74', '400': '#fb923c', '500': '#f97316', '600': '#ea580c', '700': '#c2410c', '800': '#9a3412', '900': '#7c2d12', '950': '#431407' },
  amber: { '50': '#fffbeb', '100': '#fef3c7', '200': '#fde68a', '300': '#fcd34d', '400': '#fbbf24', '500': '#f59e0b', '600': '#d97706', '700': '#b45309', '800': '#92400e', '900': '#78350f', '950': '#451a03' },
  yellow: { '50': '#fefce8', '100': '#fef9c3', '200': '#fef08a', '300': '#fde047', '400': '#facc15', '500': '#eab308', '600': '#ca8a04', '700': '#a16207', '800': '#854d0e', '900': '#713f12', '950': '#422006' },
  lime: { '50': '#f7fee7', '100': '#ecfccb', '200': '#d9f99d', '300': '#bef264', '400': '#a3e635', '500': '#84cc16', '600': '#65a30d', '700': '#4d7c0f', '800': '#3f6212', '900': '#365314', '950': '#1a2e05' },
  green: { '50': '#f0fdf4', '100': '#dcfce7', '200': '#bbf7d0', '300': '#86efac', '400': '#4ade80', '500': '#22c55e', '600': '#16a34a', '700': '#15803d', '800': '#166534', '900': '#14532d', '950': '#052e16' },
  emerald: { '50': '#ecfdf5', '100': '#d1fae5', '200': '#a7f3d0', '300': '#6ee7b7', '400': '#34d399', '500': '#10b981', '600': '#059669', '700': '#047857', '800': '#065f46', '900': '#064e3b', '950': '#022c22' },
  teal: { '50': '#f0fdfa', '100': '#ccfbf1', '200': '#99f6e4', '300': '#5eead4', '400': '#2dd4bf', '500': '#14b8a6', '600': '#0d9488', '700': '#0f766e', '800': '#115e59', '900': '#134e4a', '950': '#042f2e' },
  cyan: { '50': '#ecfeff', '100': '#cffafe', '200': '#a5f3fc', '300': '#67e8f9', '400': '#22d3ee', '500': '#06b6d4', '600': '#0891b2', '700': '#0e7490', '800': '#155e75', '900': '#164e63', '950': '#083344' },
  sky: { '50': '#f0f9ff', '100': '#e0f2fe', '200': '#bae6fd', '300': '#7dd3fc', '400': '#38bdf8', '500': '#0ea5e9', '600': '#0284c7', '700': '#0369a1', '800': '#075985', '900': '#0c4a6e', '950': '#082f49' },
  blue: { '50': '#eff6ff', '100': '#dbeafe', '200': '#bfdbfe', '300': '#93c5fd', '400': '#60a5fa', '500': '#3b82f6', '600': '#2563eb', '700': '#1d4ed8', '800': '#1e40af', '900': '#1e3a8a', '950': '#172554' },
  indigo: { '50': '#eef2ff', '100': '#e0e7ff', '200': '#c7d2fe', '300': '#a5b4fc', '400': '#818cf8', '500': '#6366f1', '600': '#4f46e5', '700': '#4338ca', '800': '#3730a3', '900': '#312e81', '950': '#1e1b4b' },
  violet: { '50': '#f5f3ff', '100': '#ede9fe', '200': '#ddd6fe', '300': '#c4b5fd', '400': '#a78bfa', '500': '#8b5cf6', '600': '#7c3aed', '700': '#6d28d9', '800': '#5b21b6', '900': '#4c1d95', '950': '#2e1065' },
  purple: { '50': '#faf5ff', '100': '#f3e8ff', '200': '#e9d5ff', '300': '#d8b4fe', '400': '#c084fc', '500': '#a855f7', '600': '#9333ea', '700': '#7e22ce', '800': '#6b21a8', '900': '#581c87', '950': '#3b0764' },
  fuchsia: { '50': '#fdf4ff', '100': '#fae8ff', '200': '#f5d0fe', '300': '#f0abfc', '400': '#e879f9', '500': '#d946ef', '600': '#c026d3', '700': '#a21caf', '800': '#86198f', '900': '#701a75', '950': '#4a044e' },
  pink: { '50': '#fdf2f8', '100': '#fce7f3', '200': '#fbcfe8', '300': '#f9a8d4', '400': '#f472b6', '500': '#ec4899', '600': '#db2777', '700': '#be185d', '800': '#9d174d', '900': '#831843', '950': '#500724' },
  rose: { '50': '#fff1f2', '100': '#ffe4e6', '200': '#fecdd3', '300': '#fda4af', '400': '#fb7185', '500': '#f43f5e', '600': '#e11d48', '700': '#be123c', '800': '#9f1239', '900': '#881337', '950': '#4c0519' },
  white: { DEFAULT: '#ffffff' },
  black: { DEFAULT: '#000000' },
  transparent: { DEFAULT: 'transparent' },
};

// Spacing scale (in pixels)
const SPACING_SCALE: Record<string, number> = {
  '0': 0, 'px': 1, '0.5': 2, '1': 4, '1.5': 6, '2': 8, '2.5': 10, '3': 12, '3.5': 14,
  '4': 16, '5': 20, '6': 24, '7': 28, '8': 32, '9': 36, '10': 40, '11': 44, '12': 48,
  '14': 56, '16': 64, '20': 80, '24': 96, '28': 112, '32': 128, '36': 144, '40': 160,
  '44': 176, '48': 192, '52': 208, '56': 224, '60': 240, '64': 256, '72': 288, '80': 320, '96': 384,
};

// Font sizes
const FONT_SIZES: Record<string, { size: number; lineHeight: number }> = {
  'xs': { size: 12, lineHeight: 16 },
  'sm': { size: 14, lineHeight: 20 },
  'base': { size: 16, lineHeight: 24 },
  'lg': { size: 18, lineHeight: 28 },
  'xl': { size: 20, lineHeight: 28 },
  '2xl': { size: 24, lineHeight: 32 },
  '3xl': { size: 30, lineHeight: 36 },
  '4xl': { size: 36, lineHeight: 40 },
  '5xl': { size: 48, lineHeight: 48 },
  '6xl': { size: 60, lineHeight: 60 },
  '7xl': { size: 72, lineHeight: 72 },
  '8xl': { size: 96, lineHeight: 96 },
  '9xl': { size: 128, lineHeight: 128 },
};

// Font weights
const FONT_WEIGHTS: Record<string, string> = {
  'thin': 'Thin',
  'extralight': 'ExtraLight',
  'light': 'Light',
  'normal': 'Regular',
  'medium': 'Medium',
  'semibold': 'SemiBold',
  'bold': 'Bold',
  'extrabold': 'ExtraBold',
  'black': 'Black',
};

// Border radius
const BORDER_RADIUS: Record<string, number> = {
  'none': 0, 'sm': 2, 'DEFAULT': 4, 'md': 6, 'lg': 8, 'xl': 12, '2xl': 16, '3xl': 24, 'full': 9999,
};

// Shadow values
const SHADOWS: Record<string, DropShadowEffect[]> = {
  'sm': [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.05 }, offset: { x: 0, y: 1 }, radius: 2, spread: 0, visible: true, blendMode: 'NORMAL' }],
  'DEFAULT': [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.1 }, offset: { x: 0, y: 1 }, radius: 3, spread: 0, visible: true, blendMode: 'NORMAL' }, { type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.1 }, offset: { x: 0, y: 1 }, radius: 2, spread: -1, visible: true, blendMode: 'NORMAL' }],
  'md': [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.1 }, offset: { x: 0, y: 4 }, radius: 6, spread: -1, visible: true, blendMode: 'NORMAL' }, { type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.1 }, offset: { x: 0, y: 2 }, radius: 4, spread: -2, visible: true, blendMode: 'NORMAL' }],
  'lg': [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.1 }, offset: { x: 0, y: 10 }, radius: 15, spread: -3, visible: true, blendMode: 'NORMAL' }, { type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.1 }, offset: { x: 0, y: 4 }, radius: 6, spread: -4, visible: true, blendMode: 'NORMAL' }],
  'xl': [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.1 }, offset: { x: 0, y: 20 }, radius: 25, spread: -5, visible: true, blendMode: 'NORMAL' }, { type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.1 }, offset: { x: 0, y: 8 }, radius: 10, spread: -6, visible: true, blendMode: 'NORMAL' }],
  '2xl': [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.25 }, offset: { x: 0, y: 25 }, radius: 50, spread: -12, visible: true, blendMode: 'NORMAL' }],
  'none': [],
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function hexToRgb(hex: string): RGB {
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

function parseSpacing(value: string): number | undefined {
  if (SPACING_SCALE[value] !== undefined) return SPACING_SCALE[value];

  // Handle arbitrary values like [10px] or [5px]
  const arbitraryMatch = value.match(/^\[(\d+)(?:px)?\]$/);
  if (arbitraryMatch) {
    return parseInt(arbitraryMatch[1]);
  }

  return undefined;
}

function parseColor(colorClass: string, customColors: Record<string, string>): RGB | null {
  // Check custom colors first
  if (customColors[colorClass]) {
    return hexToRgb(customColors[colorClass]);
  }

  // Check for direct hex values
  if (colorClass.startsWith('#')) {
    return hexToRgb(colorClass);
  }

  // Parse Tailwind color format: color-shade (e.g., blue-500)
  const parts = colorClass.split('-');
  if (parts.length === 1) {
    // Single color like "white" or "black"
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

// ============================================================================
// TAILWIND CONFIG PARSER
// ============================================================================

function parseTailwindConfig(html: string): Record<string, string> {
  const customColors: Record<string, string> = {};

  // Find tailwind.config in script tags
  const configMatch = html.match(/tailwind\.config\s*=\s*\{[\s\S]*?\n\s*\}/);
  if (!configMatch) return customColors;

  const configStr = configMatch[0];

  // Extract colors from theme.extend.colors
  const colorsMatch = configStr.match(/colors\s*:\s*\{([^}]+)\}/);
  if (colorsMatch) {
    const colorsStr = colorsMatch[1];
    // Match color definitions like: primary: '#3b82f6' or primary: "#3b82f6"
    const colorRegex = /(\w+)\s*:\s*['"]([^'"]+)['"]/g;
    let match;
    while ((match = colorRegex.exec(colorsStr)) !== null) {
      customColors[match[1]] = match[2];
    }
  }

  return customColors;
}

// ============================================================================
// HTML PARSER
// ============================================================================

interface ParsedElement {
  tagName: string;
  classes: string[];
  attributes: Record<string, string>;
  textContent: string;
  children: ParsedElement[];
}

function parseHTML(html: string): ParsedElement[] {
  // Remove script tags (except for tailwind config which is parsed separately)
  const cleanedHtml = html.replace(/<script[\s\S]*?<\/script>/gi, '');

  // Remove comments
  const noComments = cleanedHtml.replace(/<!--[\s\S]*?-->/g, '');

  // Simple HTML parser
  const elements: ParsedElement[] = [];
  const stack: ParsedElement[] = [];

  // Match opening tags, closing tags, and text content
  const tagRegex = /<\/?([a-z][a-z0-9]*)\s*([^>]*)>|([^<]+)/gi;
  let match;

  while ((match = tagRegex.exec(noComments)) !== null) {
    const [fullMatch, tagName, attributes, textContent] = match;

    if (textContent) {
      // Text content
      const trimmed = textContent.trim();
      if (trimmed && stack.length > 0) {
        const current = stack[stack.length - 1];
        // Create a text node as a child
        current.children.push({
          tagName: '#text',
          classes: [],
          attributes: {},
          textContent: trimmed,
          children: []
        });
      }
    } else if (fullMatch.startsWith('</')) {
      // Closing tag
      if (stack.length > 0) {
        const closed = stack.pop()!;
        if (stack.length > 0) {
          stack[stack.length - 1].children.push(closed);
        } else {
          elements.push(closed);
        }
      }
    } else if (tagName) {
      // Opening tag
      const lowerTagName = tagName.toLowerCase();

      // Parse attributes
      const attrRegex = /(\w+)\s*=\s*["']([^"']*)["']/g;
      const attrMap: Record<string, string> = {};
      let attrMatch;
      while ((attrMatch = attrRegex.exec(attributes)) !== null) {
        attrMap[attrMatch[1].toLowerCase()] = attrMatch[2];
      }

      // Extract classes separately for convenience
      const classes = attrMap['class'] ? attrMap['class'].split(/\s+/).filter(Boolean) : [];

      const element: ParsedElement = {
        tagName: lowerTagName,
        classes,
        attributes: attrMap,
        textContent: '',
        children: [],
      };

      // Self-closing tags
      const selfClosing = ['img', 'br', 'hr', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'param', 'source', 'track', 'wbr'];
      if (selfClosing.includes(lowerTagName) || attributes.endsWith('/')) {
        if (stack.length > 0) {
          stack[stack.length - 1].children.push(element);
        } else {
          elements.push(element);
        }
      } else {
        stack.push(element);
      }
    }
  }

  // Handle any remaining unclosed tags
  while (stack.length > 1) {
    const closed = stack.pop()!;
    stack[stack.length - 1].children.push(closed);
  }
  if (stack.length === 1) {
    elements.push(stack[0]);
  }

  return elements;
}

// ============================================================================
// TAILWIND CLASS RESOLVER
// ============================================================================

interface ResolvedStyles {
  // Layout
  display?: 'flex' | 'block' | 'grid';
  flexDirection?: 'HORIZONTAL' | 'VERTICAL';
  justifyContent?: 'MIN' | 'CENTER' | 'MAX' | 'SPACE_BETWEEN';
  alignItems?: 'MIN' | 'CENTER' | 'MAX' | 'STRETCH';
  gap?: number;
  gapX?: number;
  gapY?: number;
  flexWrap?: 'WRAP' | 'NO_WRAP';
  flexGrow?: number;
  flexShrink?: number;
  gridCols?: number;
  position?: 'ABSOLUTE' | 'RELATIVE' | 'STATIC';
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;

  // Sizing
  width?: number | 'FILL' | 'HUG';
  height?: number | 'FILL' | 'HUG';
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;

  // Spacing
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;

  // Colors
  backgroundColor?: RGB;
  backgroundOpacity?: number;
  textColor?: RGB;
  borderColor?: RGB;

  // Border
  borderWidth?: number;
  borderRadius?: number;
  borderRadiusTL?: number;
  borderRadiusTR?: number;
  borderRadiusBR?: number;
  borderRadiusBL?: number;

  // Typography
  fontSize?: number;
  lineHeight?: number;
  fontWeight?: string;
  fontFamily?: 'sans' | 'serif' | 'mono';
  textAlign?: 'LEFT' | 'CENTER' | 'RIGHT' | 'JUSTIFIED';
  whiteSpace?: 'nowrap' | 'normal';

  // Effects
  shadows?: DropShadowEffect[];
  opacity?: number;
  overflow?: 'hidden' | 'visible';
  objectFit?: 'cover' | 'contain' | 'fill';

  // Margins
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
}


function resolveClasses(classes: string[], customColors: Record<string, string>): ResolvedStyles {
  const styles: ResolvedStyles = {};

  for (const cls of classes) {
    // Flex layout
    if (cls === 'flex') {
      styles.display = 'flex';
      styles.flexDirection = 'HORIZONTAL';
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

    // Positioning
    else if (cls === 'absolute') styles.position = 'ABSOLUTE';
    else if (cls === 'relative') styles.position = 'RELATIVE';

    // Top, Right, Bottom, Left
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
    // Inset
    else if (cls.startsWith('inset-')) {
      const val = parseSpacing(cls.slice(6));
      if (val !== undefined) {
        styles.top = val;
        styles.right = val;
        styles.bottom = val;
        styles.left = val;
      }
    }

    // Justify content
    else if (cls === 'justify-start') styles.justifyContent = 'MIN';
    else if (cls === 'justify-center') styles.justifyContent = 'CENTER';
    else if (cls === 'justify-end') styles.justifyContent = 'MAX';
    else if (cls === 'justify-between') styles.justifyContent = 'SPACE_BETWEEN';

    // Align items
    else if (cls === 'items-start') styles.alignItems = 'MIN';
    else if (cls === 'items-center') styles.alignItems = 'CENTER';
    else if (cls === 'items-end') styles.alignItems = 'MAX';
    else if (cls === 'items-stretch') styles.alignItems = 'STRETCH';

    // Gap
    else if (cls.startsWith('gap-x-') || cls.startsWith('space-x-')) {
      const value = cls.startsWith('gap-x-') ? cls.slice(6) : cls.slice(8);
      const val = parseSpacing(value);
      if (val !== undefined) styles.gapX = val;
    }
    else if (cls.startsWith('gap-y-') || cls.startsWith('space-y-')) {
      const value = cls.startsWith('gap-y-') ? cls.slice(6) : cls.slice(8);
      const val = parseSpacing(value);
      if (val !== undefined) styles.gapY = val;
    }
    else if (cls.startsWith('gap-')) {
      const value = cls.slice(4);
      const val = parseSpacing(value);
      if (val !== undefined) {
        styles.gap = val;
        styles.gapX = val;
        styles.gapY = val;
      }
    }

    // Width
    else if (cls === 'w-full') styles.width = 'FILL';
    else if (cls === 'w-auto' || cls === 'w-fit') styles.width = 'HUG';
    else if (cls.startsWith('w-')) {
      const value = cls.slice(2);
      const val = parseSpacing(value);
      if (val !== undefined) styles.width = val;
    }

    // Height
    else if (cls === 'h-full') styles.height = 'FILL';
    else if (cls === 'h-auto' || cls === 'h-fit') styles.height = 'HUG';
    else if (cls.startsWith('h-')) {
      const value = cls.slice(2);
      const val = parseSpacing(value);
      if (val !== undefined) styles.height = val;
    }

    // Min/Max width
    else if (cls.startsWith('min-w-')) {
      const value = cls.slice(6);
      const val = parseSpacing(value);
      if (val !== undefined) styles.minWidth = val;
    }
    else if (cls.startsWith('max-w-')) {
      const value = cls.slice(6);
      const val = parseSpacing(value);
      if (val !== undefined) styles.maxWidth = val;
    }

    // Min/Max height
    else if (cls.startsWith('min-h-')) {
      const value = cls.slice(6);
      const val = parseSpacing(value);
      if (val !== undefined) styles.minHeight = val;
    }
    else if (cls.startsWith('max-h-')) {
      const value = cls.slice(6);
      const val = parseSpacing(value);
      if (val !== undefined) styles.maxHeight = val;
    }

    // Padding
    else if (cls.startsWith('px-')) {
      const value = cls.slice(3);
      const val = parseSpacing(value);
      if (val !== undefined) {
        styles.paddingRight = val;
        styles.paddingLeft = val;
      }
    }
    else if (cls.startsWith('py-')) {
      const value = cls.slice(3);
      const val = parseSpacing(value);
      if (val !== undefined) {
        styles.paddingTop = val;
        styles.paddingBottom = val;
      }
    }
    else if (cls.startsWith('pt-')) {
      const value = cls.slice(3);
      const val = parseSpacing(value);
      if (val !== undefined) styles.paddingTop = val;
    }
    else if (cls.startsWith('pr-')) {
      const value = cls.slice(3);
      const val = parseSpacing(value);
      if (val !== undefined) styles.paddingRight = val;
    }
    else if (cls.startsWith('pb-')) {
      const value = cls.slice(3);
      const val = parseSpacing(value);
      if (val !== undefined) styles.paddingBottom = val;
    }
    else if (cls.startsWith('pl-')) {
      const value = cls.slice(3);
      const val = parseSpacing(value);
      if (val !== undefined) styles.paddingLeft = val;
    }
    else if (cls.startsWith('p-')) {
      const value = cls.slice(2);
      const val = parseSpacing(value);
      if (val !== undefined) {
        styles.paddingTop = val;
        styles.paddingRight = val;
        styles.paddingBottom = val;
        styles.paddingLeft = val;
      }
    }

    // Margins
    else if (cls.startsWith('mx-')) {
      const value = cls.slice(3);
      const val = parseSpacing(value);
      if (val !== undefined) {
        styles.marginRight = val;
        styles.marginLeft = val;
      }
    }
    else if (cls.startsWith('my-')) {
      const value = cls.slice(3);
      const val = parseSpacing(value);
      if (val !== undefined) {
        styles.marginTop = val;
        styles.marginBottom = val;
      }
    }
    else if (cls.startsWith('mt-')) {
      const value = cls.slice(3);
      const val = parseSpacing(value);
      if (val !== undefined) styles.marginTop = val;
    }
    else if (cls.startsWith('mr-')) {
      const value = cls.slice(3);
      const val = parseSpacing(value);
      if (val !== undefined) styles.marginRight = val;
    }
    else if (cls.startsWith('mb-')) {
      const value = cls.slice(3);
      const val = parseSpacing(value);
      if (val !== undefined) styles.marginBottom = val;
    }
    else if (cls.startsWith('ml-')) {
      const value = cls.slice(3);
      const val = parseSpacing(value);
      if (val !== undefined) styles.marginLeft = val;
    }
    else if (cls.startsWith('m-')) {
      const value = cls.slice(2);
      const val = parseSpacing(value);
      if (val !== undefined) {
        styles.marginTop = val;
        styles.marginRight = val;
        styles.marginBottom = val;
        styles.marginLeft = val;
      }
    }

    // Background color (with optional opacity like bg-secondary/30)
    else if (cls.startsWith('bg-')) {
      const colorPart = cls.slice(3);
      // Check for opacity notation
      const opacityMatch = colorPart.match(/^(.+)\/(\d+)$/);
      if (opacityMatch) {
        const colorName = opacityMatch[1];
        const opacityValue = parseInt(opacityMatch[2]) / 100;
        const color = parseColor(colorName, customColors);
        if (color) {
          styles.backgroundColor = color;
          styles.backgroundOpacity = opacityValue;
        }
      } else {
        const color = parseColor(colorPart, customColors);
        if (color) styles.backgroundColor = color;
      }
    }


    // Text color
    else if (cls.startsWith('text-') && !cls.startsWith('text-left') && !cls.startsWith('text-center') && !cls.startsWith('text-right')) {
      const value = cls.slice(5);
      // Check if it's a font size
      if (FONT_SIZES[value]) {
        styles.fontSize = FONT_SIZES[value].size;
        styles.lineHeight = FONT_SIZES[value].lineHeight;
      } else {
        // It's a color
        const color = parseColor(value, customColors);
        if (color) styles.textColor = color;
      }
    }

    // Text alignment
    else if (cls === 'text-left') styles.textAlign = 'LEFT';
    else if (cls === 'text-center') styles.textAlign = 'CENTER';
    else if (cls === 'text-right') styles.textAlign = 'RIGHT';
    else if (cls === 'text-justify') styles.textAlign = 'JUSTIFIED';

    // Font weight
    else if (cls.startsWith('font-')) {
      const weight = cls.slice(5);
      if (FONT_WEIGHTS[weight]) {
        styles.fontWeight = FONT_WEIGHTS[weight];
      }
    }

    // Border color
    else if (cls.startsWith('border-') && !cls.startsWith('border-t-') && !cls.startsWith('border-r-') && !cls.startsWith('border-b-') && !cls.startsWith('border-l-')) {
      const value = cls.slice(7);
      // Check if it's a border width number
      if (['0', '2', '4', '8'].includes(value)) {
        styles.borderWidth = parseInt(value);
      } else {
        // It's a color
        const color = parseColor(value, customColors);
        if (color) styles.borderColor = color;
      }
    }
    else if (cls === 'border') {
      styles.borderWidth = 1;
    }

    // Border radius
    else if (cls === 'rounded') {
      styles.borderRadius = BORDER_RADIUS['DEFAULT'];
    }
    else if (cls === 'rounded-none') {
      styles.borderRadius = 0;
    }
    else if (cls.startsWith('rounded-') && !cls.includes('-t-') && !cls.includes('-r-') && !cls.includes('-b-') && !cls.includes('-l-') && !cls.includes('-tl-') && !cls.includes('-tr-') && !cls.includes('-br-') && !cls.includes('-bl-')) {
      const value = cls.slice(8);
      if (BORDER_RADIUS[value] !== undefined) {
        styles.borderRadius = BORDER_RADIUS[value];
      }
    }
    // Specific corner radius
    else if (cls.startsWith('rounded-tl-')) {
      const value = cls.slice(11);
      if (BORDER_RADIUS[value] !== undefined) {
        styles.borderRadiusTL = BORDER_RADIUS[value];
      }
    }
    else if (cls.startsWith('rounded-tr-')) {
      const value = cls.slice(11);
      if (BORDER_RADIUS[value] !== undefined) {
        styles.borderRadiusTR = BORDER_RADIUS[value];
      }
    }
    else if (cls.startsWith('rounded-br-')) {
      const value = cls.slice(11);
      if (BORDER_RADIUS[value] !== undefined) {
        styles.borderRadiusBR = BORDER_RADIUS[value];
      }
    }
    else if (cls.startsWith('rounded-bl-')) {
      const value = cls.slice(11);
      if (BORDER_RADIUS[value] !== undefined) {
        styles.borderRadiusBL = BORDER_RADIUS[value];
      }
    }
    // Edge radius (top, right, bottom, left)
    else if (cls.startsWith('rounded-t-')) {
      const value = cls.slice(10);
      if (BORDER_RADIUS[value] !== undefined) {
        styles.borderRadiusTL = BORDER_RADIUS[value];
        styles.borderRadiusTR = BORDER_RADIUS[value];
      }
    }
    else if (cls.startsWith('rounded-r-')) {
      const value = cls.slice(10);
      if (BORDER_RADIUS[value] !== undefined) {
        styles.borderRadiusTR = BORDER_RADIUS[value];
        styles.borderRadiusBR = BORDER_RADIUS[value];
      }
    }
    else if (cls.startsWith('rounded-b-')) {
      const value = cls.slice(10);
      if (BORDER_RADIUS[value] !== undefined) {
        styles.borderRadiusBR = BORDER_RADIUS[value];
        styles.borderRadiusBL = BORDER_RADIUS[value];
      }
    }
    else if (cls.startsWith('rounded-l-')) {
      const value = cls.slice(10);
      if (BORDER_RADIUS[value] !== undefined) {
        styles.borderRadiusTL = BORDER_RADIUS[value];
        styles.borderRadiusBL = BORDER_RADIUS[value];
      }
    }

    // Shadow
    else if (cls === 'shadow') {
      styles.shadows = SHADOWS['DEFAULT'];
    }
    else if (cls.startsWith('shadow-')) {
      const value = cls.slice(7);
      if (SHADOWS[value]) {
        styles.shadows = SHADOWS[value];
      }
    }

    // Opacity
    else if (cls.startsWith('opacity-')) {
      const value = parseInt(cls.slice(8));
      if (!isNaN(value)) {
        styles.opacity = value / 100;
      }
    }

    // Grid layout
    else if (cls === 'grid') {
      styles.display = 'grid';
      styles.flexWrap = 'WRAP';
    }
    else if (cls.startsWith('grid-cols-')) {
      const cols = parseInt(cls.slice(10));
      if (!isNaN(cols)) {
        styles.gridCols = cols;
      }
    }

    // Justify around (approximate with space-between)
    else if (cls === 'justify-around') {
      styles.justifyContent = 'SPACE_BETWEEN';
    }

    // Flex shrink
    else if (cls === 'flex-shrink-0') {
      styles.flexShrink = 0;
    }
    else if (cls === 'flex-shrink') {
      styles.flexShrink = 1;
    }

    // Overflow
    else if (cls === 'overflow-hidden') {
      styles.overflow = 'hidden';
    }
    else if (cls === 'overflow-visible' || cls === 'overflow-auto' || cls === 'overflow-x-auto' || cls === 'overflow-y-auto') {
      styles.overflow = 'visible';
    }

    // Object fit
    else if (cls === 'object-cover') {
      styles.objectFit = 'cover';
    }
    else if (cls === 'object-contain') {
      styles.objectFit = 'contain';
    }
    else if (cls === 'object-fill') {
      styles.objectFit = 'fill';
    }

    // Whitespace
    else if (cls === 'whitespace-nowrap') {
      styles.whiteSpace = 'nowrap';
    }
    else if (cls === 'whitespace-normal') {
      styles.whiteSpace = 'normal';
    }

    // Line height variants
    else if (cls === 'leading-relaxed') {
      styles.lineHeight = 1.625 * (styles.fontSize || 16);
    }
    else if (cls === 'leading-loose') {
      styles.lineHeight = 2 * (styles.fontSize || 16);
    }
    else if (cls === 'leading-tight') {
      styles.lineHeight = 1.25 * (styles.fontSize || 16);
    }
    else if (cls === 'leading-snug') {
      styles.lineHeight = 1.375 * (styles.fontSize || 16);
    }
    else if (cls === 'leading-normal') {
      styles.lineHeight = 1.5 * (styles.fontSize || 16);
    }

    // Font family
    else if (cls === 'font-serif') {
      styles.fontFamily = 'serif';
    }
    else if (cls === 'font-sans') {
      styles.fontFamily = 'sans';
    }
    else if (cls === 'font-mono') {
      styles.fontFamily = 'mono';
    }
  }


  return styles;
}

// ============================================================================
// FIGMA NODE BUILDER
// ============================================================================

// Helper to apply sizing constraints (FILL/HUG/FIXED)
function applySizingConstraints(node: SceneNode, styles: ResolvedStyles, parentLayoutMode: string) {
  if (node.type === 'FRAME' || node.type === 'TEXT') {
    // Width
    if (styles.width === 'FILL') {
      if (parentLayoutMode !== 'NONE') {
        node.layoutSizingHorizontal = 'FILL';
      } else {
        // Fallback for non-AL parent: cannot use FILL
        // Default to a reasonably small width if not set, or let it be (Fixed)
        if (node.type === 'FRAME' && node.layoutMode !== 'NONE') {
          node.layoutSizingHorizontal = 'HUG';
        }
      }
    } else if (styles.width === 'HUG') {
      if (node.type === 'FRAME' && node.layoutMode !== 'NONE') {
        node.layoutSizingHorizontal = 'HUG';
      } else if (node.type === 'TEXT') {
        node.textAutoResize = 'WIDTH_AND_HEIGHT'; // Equivalent to HUG for single line, or Auto Width
      }
    } else if (typeof styles.width === 'number') {
      node.resize(styles.width, node.height);
      node.layoutSizingHorizontal = 'FIXED';
    } else {
      // Default Width Behavior (Unspecified)
      if (node.type === 'FRAME') {
        // Block-like elements default to FILL if inside AL
        if (parentLayoutMode === 'VERTICAL') {
          node.layoutSizingHorizontal = 'FILL';
        } else if (parentLayoutMode === 'HORIZONTAL') {
          // Inside flex row, default to HUG unless flex-grow is set
          node.layoutSizingHorizontal = styles.flexGrow === 1 ? 'FILL' : 'HUG';
        }
      } else if (node.type === 'TEXT') {
        // Text defaults to HUG (Auto Width)
        node.textAutoResize = 'WIDTH_AND_HEIGHT';
      }
    }

    // Height
    if (styles.height === 'FILL') {
      if (parentLayoutMode !== 'NONE') {
        node.layoutSizingVertical = 'FILL';
      } else {
        if (node.type === 'FRAME' && node.layoutMode !== 'NONE') {
          node.layoutSizingVertical = 'HUG';
        }
      }
    } else if (styles.height === 'HUG') {
      if (node.type === 'FRAME' && node.layoutMode !== 'NONE') {
        node.layoutSizingVertical = 'HUG';
      }
    } else if (typeof styles.height === 'number') {
      node.resize(node.width, styles.height);
      node.layoutSizingVertical = 'FIXED';
    } else {
      // Default Height: 1 instead of Figma's 100 default for non-layout containers
      if (node.type === 'TEXT') {
        // Text nodes should always hug their content height by default
        node.layoutSizingVertical = 'HUG';
      } else if (node.type === 'FRAME' && node.layoutMode !== 'NONE') {
        node.layoutSizingVertical = 'HUG';
      } else {
        node.resize(node.width, 1);
        node.layoutSizingVertical = 'FIXED';
      }
    }
  }
}

// Helper to wrap node with margin frame if needed
function wrapWithMargin(node: SceneNode, styles: ResolvedStyles): { node: SceneNode, styles: ResolvedStyles } {
  const hasMargin = styles.marginTop || styles.marginRight || styles.marginBottom || styles.marginLeft;
  if (!hasMargin) return { node, styles };

  const wrapper = figma.createFrame();
  wrapper.name = 'margin-wrapper';
  wrapper.fills = []; // Transparent
  wrapper.layoutMode = 'VERTICAL';

  if (styles.marginTop) wrapper.paddingTop = styles.marginTop;
  if (styles.marginRight) wrapper.paddingRight = styles.marginRight;
  if (styles.marginBottom) wrapper.paddingBottom = styles.marginBottom;
  if (styles.marginLeft) wrapper.paddingLeft = styles.marginLeft;

  wrapper.appendChild(node);

  // Apply inner constraints to original node
  applySizingConstraints(node, styles, 'VERTICAL');

  // Determine wrapper styles for external caller
  const wrapperStyles = { ...styles };

  // If fixed dimension, wrapper should HUG to contain it + margin
  if (typeof styles.width === 'number') {
    wrapperStyles.width = 'HUG';
  }
  if (typeof styles.height === 'number') {
    wrapperStyles.height = 'HUG';
  }

  return { node: wrapper, styles: wrapperStyles };
}

// Helper to apply auto layout constraints (min/max dimensions)
function applyLayoutConstraints(node: SceneNode, styles: ResolvedStyles, parentLayoutMode: string) {
  // Min/Max can only be set if node is in AL Frame OR node is an AL Frame
  const canSetConstraints = (node.type === 'FRAME' && node.layoutMode !== 'NONE') || parentLayoutMode !== 'NONE';

  if (canSetConstraints) {
    if (node.type === 'FRAME' || node.type === 'TEXT') {
      if (styles.minWidth !== undefined) node.minWidth = styles.minWidth;
      if (styles.maxWidth !== undefined) node.maxWidth = styles.maxWidth;
      if (styles.minHeight !== undefined) node.minHeight = styles.minHeight;
      if (styles.maxHeight !== undefined) node.maxHeight = styles.maxHeight;
    }
  }
}

interface BuildResult {
  node: SceneNode;
  styles: ResolvedStyles;
}

async function buildFigmaNode(element: ParsedElement, customColors: Record<string, string>, iconMap: Record<string, string>, availableWidth?: number, screenWidth?: number, inheritedStyles: ResolvedStyles = {}): Promise<BuildResult | null> {
  const styles = resolveClasses(element.classes, customColors);

  // Font Awesome icon detection
  const hasFa = element.classes.includes('fa') || element.classes.includes('fas') || element.classes.includes('far') || element.classes.includes('fab');
  if (hasFa) {
    // Extract icon name from classes like fa-search, fa-home, etc.
    const iconClass = element.classes.find(c => c.startsWith('fa-') && c !== 'fa-solid' && c !== 'fa-regular' && c !== 'fa-brands');
    if (iconClass) {
      const iconName = iconClass.slice(3); // Remove 'fa-' prefix

      // Determine icon style
      let iconStyle = 'fa4'; // Default to FA4 style
      if (element.classes.includes('fas') || element.classes.includes('fa-solid')) iconStyle = 'solid';
      else if (element.classes.includes('far') || element.classes.includes('fa-regular')) iconStyle = 'regular';
      else if (element.classes.includes('fab') || element.classes.includes('fa-brands')) iconStyle = 'brands';
      else if (element.classes.includes('fal') || element.classes.includes('fa-light')) iconStyle = 'light';
      else if (element.classes.includes('fat') || element.classes.includes('fa-thin')) iconStyle = 'thin';

      let iconKey = `${iconStyle}/${iconName}`;
      let svgContent = iconMap[iconKey];

      // Fallback: If not found, try fa4 or solid as alternate prefixes
      if (!svgContent) {
        const fallbackKeys = [`fa4/${iconName}`, `solid/${iconName}`, `regular/${iconName}`, `brands/${iconName}`];
        for (const k of fallbackKeys) {
          if (iconMap[k]) {
            svgContent = iconMap[k];
            break;
          }
        }
      }

      if (svgContent) {
        // Apply color to SVG if text color is specified
        if (styles.textColor) {
          const hexColor = `#${Math.round(styles.textColor.r * 255).toString(16).padStart(2, '0')}${Math.round(styles.textColor.g * 255).toString(16).padStart(2, '0')}${Math.round(styles.textColor.b * 255).toString(16).padStart(2, '0')}`;
          // Replace all occurrences of <path to ensure multi-path icons are colored
          svgContent = svgContent.replace(/<path/g, `<path fill="${hexColor}"`);
          // Also handle cases where fill might already exist
          svgContent = svgContent.replace(/fill="[^"]*"/g, `fill="${hexColor}"`);
        }

        const svgNode = figma.createNodeFromSvg(svgContent);
        svgNode.name = `fa-${iconName}`;

        // Apply sizing - use fontSize from text- classes if available, otherwise default
        const size = styles.fontSize || 16;
        svgNode.resize(size, size);

        // Crucial: Set styles.width and styles.height to match icon size
        // This prevents applySizingConstraints from overriding the size to 1px
        styles.width = size;
        styles.height = size;

        return { node: svgNode, styles };
      }
    }
  }

  // Handle text nodes specially
  if (element.tagName === '#text') {
    const text = figma.createText();

    // Use inherited styles for text properties
    const combinedStyles = { ...inheritedStyles, ...styles };

    const fontWeight = combinedStyles.fontWeight || 'Regular';
    try {
      await figma.loadFontAsync({ family: 'Inter', style: fontWeight });
    } catch {
      await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
    }

    text.fontName = { family: 'Inter', style: fontWeight };
    text.characters = element.textContent;

    if (combinedStyles.fontSize) text.fontSize = combinedStyles.fontSize;
    if (combinedStyles.lineHeight) {
      text.lineHeight = { value: combinedStyles.lineHeight, unit: 'PIXELS' };
    }
    if (combinedStyles.textColor) {
      text.fills = [{ type: 'SOLID', color: combinedStyles.textColor }];
    }
    if (combinedStyles.textAlign) {
      text.textAlignHorizontal = combinedStyles.textAlign;
    }
    if (combinedStyles.opacity !== undefined) {
      text.opacity = combinedStyles.opacity;
    }

    // Text nodes are just returned directly, NO generic wrapper unless margin?
    // Text nodes technically can't have margin in Figma in the same way, but we can wrap it.
    // However, #text nodes from HTML text usually don't have classes, so 'styles' (from logic below) will be empty.
    // So wrapWithMargin will effectively do nothing.
    return { node: text, styles: combinedStyles };
  }

  const isTextElement = ['p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'label', 'strong', 'em', 'b', 'i'].includes(element.tagName);
  const hasOnlyText = element.children.length === 0 && element.textContent.trim();
  // Note: hasOnlyText will be false if text was converted to #text children by parseHTML.
  // So the block below is largely legacy now, but we'll keep it for safety if parseHTML behavior varies?
  // Actually, if we use the new parseHTML, hasOnlyText will effectively be false for non-empty text
  // unless we revert to property-based.
  // BUT: element.textContent is init to '' in parseHTML and never appended to. So hasOnlyText is ALWAYS false now.
  // So we can remove the 'isTextElement && hasOnlyText' block entirely or leave it dead.
  // I will remove it to avoid confusion.

  // Container elements - create frame
  const frame = figma.createFrame();
  frame.resize(frame.width, 1); // Set default height to 1 instead of 100

  // Clean frame name: tag + meaningful classes (exclude utilities)
  const meaningfulClasses = element.classes.filter(c =>
    !c.startsWith('p-') && !c.startsWith('px-') && !c.startsWith('py-') &&
    !c.startsWith('m-') && !c.startsWith('mx-') && !c.startsWith('my-') &&
    !c.startsWith('w-') && !c.startsWith('h-') && !c.startsWith('min-') && !c.startsWith('max-') &&
    !c.startsWith('flex-') && !c.startsWith('gap-') && !c.startsWith('bg-') && !c.startsWith('text-') &&
    !c.startsWith('rounded-') && !c.startsWith('border-') && !c.startsWith('shadow-') &&
    !['flex', 'container', 'items-center', 'justify-between', 'justify-around'].includes(c)
  );

  frame.name = element.tagName + (meaningfulClasses.length ? '.' + meaningfulClasses.slice(0, 2).join('.') : '');

  // Reset default fills
  frame.fills = [];

  // Default to Auto Layout (Vertical) unless explicitly set otherwise
  // This helps ensure most containers behave like blocks
  if (styles.display === 'flex') {
    frame.layoutMode = styles.flexDirection || 'HORIZONTAL'; // Default flex is row in Tailwind
  } else if (styles.display === 'grid') {
    frame.layoutMode = 'HORIZONTAL'; // Grid simulation requires horizontal wrapping
  } else {
    // Default block behavior = vertical auto layout
    frame.layoutMode = 'VERTICAL';
  }

  // Apply Auto Layout Properties
  if (frame.layoutMode === 'HORIZONTAL') {
    frame.itemSpacing = styles.gapX ?? styles.gap ?? 0;
    if (styles.flexWrap === 'WRAP') {
      frame.counterAxisSpacing = styles.gapY ?? styles.gap ?? 0;
    }
  } else if (frame.layoutMode === 'VERTICAL') {
    frame.itemSpacing = styles.gapY ?? styles.gap ?? 0;
    if (styles.flexWrap === 'WRAP') {
      frame.counterAxisSpacing = styles.gapX ?? styles.gap ?? 0;
    }
  }

  if (styles.paddingTop !== undefined) frame.paddingTop = styles.paddingTop;
  if (styles.paddingRight !== undefined) frame.paddingRight = styles.paddingRight;
  if (styles.paddingBottom !== undefined) frame.paddingBottom = styles.paddingBottom;
  if (styles.paddingLeft !== undefined) frame.paddingLeft = styles.paddingLeft;

  // Primary axis alignment
  if (styles.justifyContent) {
    frame.primaryAxisAlignItems = styles.justifyContent;
  }

  // Counter axis alignment
  // For block (VERTICAL), align items defaults to stretch or min
  if (styles.alignItems) {
    frame.counterAxisAlignItems = styles.alignItems === 'STRETCH' ? 'MIN' : styles.alignItems;
  } else {
    // Default alignment
    frame.counterAxisAlignItems = 'MIN';
  }

  // Wrap (also used for grid simulation)
  if ((styles.flexWrap === 'WRAP' || styles.display === 'grid') && frame.layoutMode === 'HORIZONTAL') {
    frame.layoutWrap = 'WRAP';
  }

  // Background color (with optional opacity)
  if (styles.backgroundColor) {
    const opacity = styles.backgroundOpacity ?? 1;
    frame.fills = [{ type: 'SOLID', color: styles.backgroundColor, opacity }];
  }

  // Overflow hidden
  if (styles.overflow === 'hidden') {
    frame.clipsContent = true;
  }


  // Border
  if (styles.borderWidth) {
    frame.strokeWeight = styles.borderWidth;
    frame.strokes = [{ type: 'SOLID', color: styles.borderColor || { r: 0.8, g: 0.8, b: 0.8 } }];
  }

  // Border radius
  if (styles.borderRadius !== undefined) {
    frame.cornerRadius = styles.borderRadius;
  }
  if (styles.borderRadiusTL !== undefined) frame.topLeftRadius = styles.borderRadiusTL;
  if (styles.borderRadiusTR !== undefined) frame.topRightRadius = styles.borderRadiusTR;
  if (styles.borderRadiusBR !== undefined) frame.bottomRightRadius = styles.borderRadiusBR;
  if (styles.borderRadiusBL !== undefined) frame.bottomLeftRadius = styles.borderRadiusBL;

  // Shadow
  if (styles.shadows) {
    frame.effects = styles.shadows;
  }

  // Opacity
  if (styles.opacity !== undefined) {
    frame.opacity = styles.opacity;
  }

  // Handle inline text content (childless text container) - REMOVED as text is now child nodes
  // Logic moved to #text handling above.

  // Handle placeholder for input/textarea
  if ((element.tagName === 'input' || element.tagName === 'textarea') && element.attributes['placeholder']) {
    const placeholderText = figma.createText();
    try {
      await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
    } catch {
      // fallback
    }
    placeholderText.fontName = { family: 'Inter', style: 'Regular' };
    placeholderText.characters = element.attributes['placeholder'];
    placeholderText.fontSize = styles.fontSize || 14;
    placeholderText.fills = [{ type: 'SOLID', color: { r: 0.6, g: 0.6, b: 0.6 } }]; // Gray placeholder color
    frame.appendChild(placeholderText);
  }

  // CALCULATE RESOLVED WIDTH FOR CHILDREN
  let resolvedWidth: number | undefined;
  if (typeof styles.width === 'number') {
    resolvedWidth = styles.width;
  } else if (styles.width === 'FILL') {
    resolvedWidth = availableWidth; // If parent has width, fill implies we take it
  }
  // Adjust for padding if we resolved a width
  let innerWidth = resolvedWidth;
  if (innerWidth !== undefined) {
    const pl = styles.paddingLeft || 0;
    const pr = styles.paddingRight || 0;
    const border = styles.borderWidth || 0;
    innerWidth = innerWidth - pl - pr - (border * 2);
  }

  const absoluteChildren: { node: SceneNode, styles: ResolvedStyles }[] = [];

  // Build children recursively
  for (const child of element.children) {
    // Extract inheritable styles to pass down
    const childInheritedStyles: ResolvedStyles = {
      textColor: styles.textColor || inheritedStyles.textColor,
      fontSize: styles.fontSize || inheritedStyles.fontSize,
      fontWeight: styles.fontWeight || inheritedStyles.fontWeight,
      fontFamily: styles.fontFamily || inheritedStyles.fontFamily,
      textAlign: styles.textAlign || inheritedStyles.textAlign,
      lineHeight: styles.lineHeight || inheritedStyles.lineHeight, // lineHeight is number | undefined
    };

    const childResult = await buildFigmaNode(child, customColors, iconMap, innerWidth, screenWidth, childInheritedStyles);
    if (childResult) {
      if (childResult.styles.position === 'ABSOLUTE') {
        absoluteChildren.push(childResult);
      } else {
        frame.appendChild(childResult.node);

        // Now that child is inside frame, we can apply constraints based on frame's layout mode
        applySizingConstraints(childResult.node, childResult.styles, frame.layoutMode);
        applyLayoutConstraints(childResult.node, childResult.styles, frame.layoutMode);
      }
    }
  }

  // JUSTIFY-AROUND LOGIC (Post-Children)
  // If we have justify-around, we need to manually offset padding L/R to simulate it
  // because Figma only supports Packed, Space Between.
  if (element.classes.includes('justify-around') &&
    frame.layoutMode === 'HORIZONTAL' &&
    frame.layoutWrap === 'NO_WRAP' &&
    frame.children.length > 0) {
    // Need a known container width to calculate free space
    // If width is FIXED (number), we know it.
    // If width is FILL, we rely on 'availableWidth' passed from parent.
    // If neither, we fallback to screenWidth (as per user request)
    const containerWidth = (typeof styles.width === 'number' ? styles.width : availableWidth) || screenWidth;

    if (containerWidth) {
      const pl = styles.paddingLeft || 0;
      const pr = styles.paddingRight || 0;
      const totalInitialPadding = pl + pr;

      // Calculate total children width
      let childrenTotalWidth = 0;
      for (const childNode of frame.children) {
        childrenTotalWidth += childNode.width;
      }

      // Calculate free space
      const freeSpace = containerWidth - totalInitialPadding - childrenTotalWidth;

      if (freeSpace > 0) {
        // Justify around:
        // Gap is X.
        // Edge spacing is X/2.
        // N items. N-1 gaps between items. 2 edge spaces.
        // Total Space = (N-1)*X + 2*(X/2) = (N-1)*X + X = N*X
        // So each 'gap unit' X = FreeSpace / N
        // But Figma SpaceBetween distributes FreeSpace into N-1 gaps.
        // We want edge padding to be X/2.

        const N = frame.children.length;
        const gapUnit = freeSpace / N;
        const edgePadding = gapUnit / 2; // This is what we want on edges

        // Apply this extra padding to existing padding
        frame.paddingLeft = pl + edgePadding;
        frame.paddingRight = pr + edgePadding;

        // Figma's PrimaryAxisAlignItems = 'SPACE_BETWEEN' triggers distribution of remaining space.
        // Remaining space after our padding = FreeSpace - 2*edgePadding = FreeSpace - gapUnit = (N-1)*gapUnit.
        // SpaceBetween splits this into N-1 gaps of size `gapUnit`.
        // Perfect!
        // The resolveClasses function already sets 'SPACE_BETWEEN' for justify-around.
      }
    }
  }

  // Initial size check
  // If frame has no children and is zero size, give it some default size or padding
  if (frame.children.length === 0 && (frame.width === 0 || frame.height === 0)) {
    // Auto layout with no children might collapse, ensure it has min size if padding is set
    // or if it has explicit size
    // If generic text node with just padding, it should be fine.
  }
  // PROCESS ABSOLUTE CHILDREN
  if (absoluteChildren.length > 0) {
    for (const absChild of absoluteChildren) {
      frame.appendChild(absChild.node);
      // layoutPositioning exists on Frame, Text, etc.
      (absChild.node as any).layoutPositioning = 'ABSOLUTE';

      const absStyles = absChild.styles;
      // Intersection of mixins for TS to be happy about constraints, resize, x, y
      const node = absChild.node as any;

      // Determine X (Horizontal)
      if (absStyles.left !== undefined && absStyles.right !== undefined) {
        // Left + Right set = Stretch
        node.constraints = { horizontal: 'STRETCH', vertical: node.constraints.vertical };
        node.x = absStyles.left;
        node.resize(frame.width - absStyles.left - absStyles.right, node.height);
      } else if (absStyles.left !== undefined) {
        node.constraints = { horizontal: 'MIN', vertical: node.constraints.vertical };
        node.x = absStyles.left;
      } else if (absStyles.right !== undefined) {
        node.constraints = { horizontal: 'MAX', vertical: node.constraints.vertical };
        node.x = frame.width - node.width - absStyles.right;
      } else {
        // Default Left
        node.constraints = { horizontal: 'MIN', vertical: node.constraints.vertical };
        node.x = 0;
      }

      // Determine Y (Vertical)
      if (absStyles.top !== undefined && absStyles.bottom !== undefined) {
        // Top + Bottom set = Stretch
        node.constraints = { horizontal: node.constraints.horizontal, vertical: 'STRETCH' };
        node.y = absStyles.top;
        node.resize(node.width, frame.height - absStyles.top - absStyles.bottom);
      } else if (absStyles.top !== undefined) {
        node.constraints = { horizontal: node.constraints.horizontal, vertical: 'MIN' };
        node.y = absStyles.top;
      } else if (absStyles.bottom !== undefined) {
        node.constraints = { horizontal: node.constraints.horizontal, vertical: 'MAX' };
        node.y = frame.height - node.height - absStyles.bottom;
      } else {
        // Default Top
        node.constraints = { horizontal: node.constraints.horizontal, vertical: 'MIN' };
        node.y = 0;
      }
    }
  }

  return wrapWithMargin(frame, styles);
}

// ============================================================================
// MAIN PLUGIN CODE
// ============================================================================

figma.showUI(__html__, { width: 400, height: 560 });

// Handle initial settings load
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
      // Parse tailwind config for custom colors
      const customColors = parseTailwindConfig(msg.html);

      // Parse HTML
      const elements = parseHTML(msg.html);

      console.log('Parsed Elements:', elements);

      if (elements.length === 0) {
        figma.notify('No HTML elements found to convert.');
        return;
      }

      // Build Figma nodes
      const nodes: SceneNode[] = [];
      let xOffset = 0;

      // Look for body tag (recursive)
      function findBody(els: ParsedElement[]): ParsedElement | undefined {
        for (const el of els) {
          if (el.tagName === 'body') return el;
          if (el.children && el.children.length > 0) {
            // Only search inside html wrapper to verify it's the main body
            if (el.tagName === 'html') {
              const found = findBody(el.children);
              if (found) return found;
            }
          }
        }
        return undefined;
      }

      // Look for title tag (recursive)
      function findTitle(els: ParsedElement[]): string | undefined {
        for (const el of els) {
          if (el.tagName === 'title') {
            return el.children
              .filter(child => child.tagName === '#text')
              .map(child => child.textContent)
              .join(' ')
              .trim();
          }
          if (el.children && el.children.length > 0) {
            const found = findTitle(el.children);
            if (found) return found;
          }
        }
        return undefined;
      }

      const pageTitle = findTitle(elements) || 'Web Page';
      let targetElements = elements;
      const bodyElement = findBody(elements);
      if (bodyElement) {
        targetElements = bodyElement.children;
      }

      // Determine artboard settings based on viewport
      const isDesktop = msg.viewport === 'desktop';
      const artboardWidth = isDesktop ? 1440 : 375;

      // Create main artboard/wrapper frame
      const artboard = figma.createFrame();
      artboard.name = pageTitle;
      artboard.layoutMode = 'VERTICAL';
      // Desktop/Mobile fixed width
      artboard.resize(artboardWidth, artboard.height);
      artboard.layoutSizingHorizontal = 'FIXED';
      artboard.layoutSizingVertical = 'HUG';

      artboard.itemSpacing = 0; // Default spacing 0 for block layout
      // Use 0 padding for cleaner web-like defaults, or keep small padding
      artboard.paddingTop = 0;
      artboard.paddingRight = 0;
      artboard.paddingBottom = 0;
      artboard.paddingLeft = 0;

      artboard.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }]; // White background default
      figma.currentPage.appendChild(artboard);

      for (const element of targetElements) {
        // Pass artboardWidth as the initial availableWidth, AND as screenWidth
        const result = await buildFigmaNode(element, customColors, iconMap, artboardWidth, artboardWidth);
        if (result) {
          artboard.appendChild(result.node);
          nodes.push(result.node);

          // Apply constraints for nodes inside the artboard (Vertical Auto Layout)
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
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error(error); // Log to console for debugging
      figma.notify(`Error: ${message}`, { error: true });
    }
  }
};
