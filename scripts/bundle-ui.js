const fs = require('fs');
const path = require('path');

const UI_HTML_TEMPLATE = path.join(__dirname, '../src/ui/ui.html');
const UI_JS_BUNDLED = path.join(__dirname, '../ui.js');
const UI_CSS = path.join(__dirname, '../src/ui/ui.css');
const OUTPUT_HTML = path.join(__dirname, '../ui.html');

function bundle() {
    let template = fs.readFileSync(UI_HTML_TEMPLATE, 'utf8');
    const js = fs.readFileSync(UI_JS_BUNDLED, 'utf8');
    const css = fs.readFileSync(UI_CSS, 'utf8');

    template = template.replace('/* INJECT_CSS */', css);
    template = template.replace('/* INJECT_JS */', js);

    fs.writeFileSync(OUTPUT_HTML, template);
    console.log('✓ UI bundled successfully into ui.html');
}

bundle();
