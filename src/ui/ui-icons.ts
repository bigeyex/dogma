export const getIconsMap = async (html: string): Promise<Record<string, string>> => {
    const iconMap: Record<string, string> = {};
    // Matches class="..." fa fa-icon ..." or class="... fa-icon ..."
    const faRegex = /class=["']([^"']*\bfa[-a-z0-9]*\b[^"']*)["']/g;
    const matches = Array.from(html.matchAll(faRegex)) as RegExpExecArray[];

    const fetchIcon = async (className: string) => {
        const iconMatches = Array.from(className.matchAll(/\bfa-([a-z0-9-]+)\b/g)) as RegExpExecArray[];

        for (const iconMatch of iconMatches) {
            const iconName = iconMatch[1];
            // Filter out utility classes
            if (['fa', 'solid', 'regular', 'brands', 'light', 'thin', 'duotone', 'xs', 'sm', 'lg', 'xl', '2xl', 'fw', '2xs', '3x', '4x', '5x', '6x', '7x', '8x', '9x', '10x', 'spin', 'pulse', 'stack', 'inverse'].includes(iconName)) continue;

            // Detect style for THIS specific icon or attribute
            let version = "4.7.0";
            let style = "solid";

            if (className.includes('fa-solid') || className.includes('fas')) { style = 'solid'; version = '6.x'; }
            else if (className.includes('fa-regular') || className.includes('far')) { style = 'regular'; version = '6.x'; }
            else if (className.includes('fa-brands') || className.includes('fab')) { style = 'brands'; version = '6.x'; }
            else if (className.includes('fa-light') || className.includes('fal')) { style = 'light'; version = '6.x'; }
            else if (className.includes('fa-thin') || className.includes('fat')) { style = 'thin'; version = '6.x'; }

            const key = version === '4.7.0' ? `fa4/${iconName}` : `${style}/${iconName}`;
            if (iconMap[key]) continue;

            try {
                let url;
                if (version === '4.7.0') {
                    url = `https://raw.githubusercontent.com/encharm/font-awesome-svg-png/master/black/svg/${iconName}.svg`;
                } else {
                    url = `https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/${style}/${iconName}.svg`;
                }

                const response = await fetch(url);
                if (response.ok) {
                    iconMap[key] = await response.text();
                } else if (version === '6.x' && style !== 'solid') {
                    // Fallback to solid for FA6
                    const fallbackUrl = `https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/${iconName}.svg`;
                    const fallbackRes = await fetch(fallbackUrl);
                    if (fallbackRes.ok) {
                        iconMap[key] = await fallbackRes.text();
                    }
                } else if (version === '4.7.0') {
                    // Compatibility: If FA4 search fails, try FA6 solid
                    const fallbackUrl = `https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/${iconName}.svg`;
                    const fallbackRes = await fetch(fallbackUrl);
                    if (fallbackRes.ok) {
                        iconMap[key] = await fallbackRes.text();
                    }
                }
            } catch (e) { console.error(`Failed to fetch icon ${iconName}:`, e); }
        }
    };

    await Promise.all(matches.map((match: RegExpExecArray) => fetchIcon(match[1])));
    return iconMap;
};
