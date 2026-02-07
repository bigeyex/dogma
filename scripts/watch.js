const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');
const { bundle } = require('./bundle-ui');

const UI_CSS_PATH = path.join(__dirname, '../src/ui/ui.css');
const UI_HTML_PATH = path.join(__dirname, '../src/ui/ui.html');

async function watch() {
    console.log('🚀 Starting watch mode...');

    // 1. Context for Plugin (code.ts)
    const pluginCtx = await esbuild.context({
        entryPoints: ['src/code.ts'],
        bundle: true,
        outfile: 'code.js',
        target: 'es2015',
    });

    // 2. Context for UI (main.ts)
    const uiCtx = await esbuild.context({
        entryPoints: ['src/ui/main.ts'],
        bundle: true,
        outfile: 'ui.js',
        target: 'es2015',
        plugins: [{
            name: 'rebuild-notify',
            setup(build) {
                build.onEnd(result => {
                    if (result.errors.length === 0) {
                        bundle();
                    }
                });
            },
        }],
    });

    // Start watching
    await pluginCtx.watch();
    await uiCtx.watch();

    // 3. Watch CSS and HTML manually since they aren't entry points for esbuild
    fs.watch(UI_CSS_PATH, (event) => {
        if (event === 'change') {
            console.log('🎨 CSS changed, rebundling...');
            bundle();
        }
    });

    fs.watch(UI_HTML_PATH, (event) => {
        if (event === 'change') {
            console.log('📄 UI Template changed, rebundling...');
            bundle();
        }
    });

    console.log('👀 Watching for changes in src/...\n');
}

watch().catch(err => {
    console.error('Build failed:', err);
    process.exit(1);
});
