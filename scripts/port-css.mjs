// Splits the reference's compiled stylesheet into readable source files.
// Tailwind regenerates its own utilities at build time, so only the hand-written
// component and scene rules are kept here.
// Usage: node scripts/port-css.mjs <crawl-dir>/<stylesheet>.css
import fs from 'node:fs';
import path from 'node:path';
import prettier from 'prettier';

const css = fs.readFileSync(process.argv[2], 'utf8');

function layerBody(name) {
  const at = css.indexOf(`@layer ${name}{`);
  const start = css.indexOf('{', at);
  let depth = 0;
  for (let i = start; i < css.length; i++) {
    if (css[i] === '{') depth++;
    else if (css[i] === '}' && --depth === 0) return { body: css.slice(start + 1, i), end: i + 1 };
  }
  throw new Error(`Unterminated layer ${name}`);
}

// Drops top-level rules whose selector matches, so admin-only styles are not carried over.
function dropRules(source, test) {
  let out = '';
  let i = 0;
  while (i < source.length) {
    const open = source.indexOf('{', i);
    if (open < 0) break;
    let depth = 0;
    let j = open;
    for (; j < source.length; j++) {
      if (source[j] === '{') depth++;
      else if (source[j] === '}' && --depth === 0) break;
    }
    const selector = source.slice(i, open);
    if (!test(selector)) out += source.slice(i, j + 1);
    i = j + 1;
  }
  return out;
}

const components = dropRules(layerBody('components').body, (s) => /\.adm-|textarea\.adm/.test(s));
const { end } = layerBody('utilities');
const scenes = css.slice(end);

const write = async (file, header, text) => {
  const pretty = await prettier.format(text, { parser: 'css' });
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${header}\n${pretty}`);
  console.log(file, pretty.split('\n').length, 'lines');
};

await write('src/styles/components.css', '/* Shared components: buttons, boards, paper, trails, letters. */', `@layer components{${components}}`);
await write('src/styles/scenes.css', '/* Page scenes and motion. Unlayered on purpose so these rules win over utilities. */', scenes);
