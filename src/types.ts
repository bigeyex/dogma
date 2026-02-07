export interface ParsedElement {
    tagName: string;
    classes: string[];
    attributes: Record<string, string>;
    textContent: string;
    children: ParsedElement[];
}

export interface ResolvedStyles {
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

    // Gradient
    gradient?: {
        type: 'LINEAR';
        direction: 'to-t' | 'to-tr' | 'to-r' | 'to-br' | 'to-b' | 'to-bl' | 'to-l' | 'to-tl';
        from?: RGB;
        via?: RGB;
        to?: RGB;
        fromOpacity?: number;
        viaOpacity?: number;
        toOpacity?: number;
    };
}
