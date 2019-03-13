const mume = require('@shd101wyy/mume');

const config = {
  // Enable this option will render markdown by pandoc instead of markdown-it.
  usePandocParser: false,

  // In Markdown, a single newline character doesn't cause a line break in the generated HTML. In
  // GitHub Flavored Markdown, that is not true. Enable this config option to insert line breaks in
  // rendered HTML for single newlines in Markdown source.
  breakOnSingleNewLine: true,

  // Enable smartypants and other sweet transforms.
  enableTypographer: false,

  // Enable emoji & font-awesome plugin. This only works for markdown-it parser, but not pandoc parser.
  enableEmojiSyntax: true,

  // Enable extended table syntax to support merging table cells.
  enableExtendedTableSyntax: false,

  // Enable CriticMarkup syntax. Only works with markdown-it parser.
  // Please check http://criticmarkup.com/users-guide.php for more information.
  enableCriticMarkupSyntax: false,

  // Front matter rendering option
  frontMatterRenderingOption: 'table', // 'table' | 'code block' | 'none'

  // Mermaid theme
  mermaidTheme: 'mermaid.css', // 'mermaid.css' | 'mermaid.dark.css' | 'mermaid.forest.css'

  // Code Block theme
  // If `auto.css` is chosen, then the code block theme that best matches the current preview theme will be picked.
  codeBlockTheme: 'atom-dark.css',
  // 'auto.css', 'default.css', 'atom-dark.css', 'atom-light.css', 'atom-material.css', 'coy.css',
  // 'darcula.css', 'dark.css', 'funky.css', 'github.css', 'hopscotch.css', 'monokai.css',
  // 'okaidia.css', 'one-dark.css', 'one-light.css', 'pen-paper-coffee.css', 'pojoaque.css',
  // 'solarized-dark.css', 'solarized-light.css', 'twilight.css', 'vue.css' 'vs.css', 'xonokai.css'

  // Preview theme
  previewTheme: 'github-light.css',
  // 'atom-dark.css', 'atom-light.css', 'atom-material.css', 'github-dark.css', 'github-light.css',
  // 'gothic.css', 'medium.css', 'monokai.css', 'newsprint.css', 'night.css', 'none.css',
  // 'one-dark.css', 'one-light.css', 'solarized-dark.css', 'solarized-light.css', 'vue.css'

  // Revealjs presentation theme
  revealjsTheme: 'white.css',
  // 'beige.css', 'black.css', 'blood.css', 'league.css', 'moon.css', 'night.css', 'serif.css',
  // 'simple.css', 'sky.css', 'solarized.css', 'white.css', 'none.css'

  // Accepted protocols followed by `://` for links.
  protocolsWhiteList: 'http, https, atom, file',

  // Whether to print background for file export or not. If set to `false`, then `github-light`
  // preview theme will b  used. You can also set `print_background` in front-matter for individual files.
  printBackground: false,

  // Pandoc executable path
  pandocPath: 'pandoc',

  // Pandoc markdown flavor
  pandocMarkdownFlavor: 'markdown-raw_tex+tex_math_single_backslash',

  // Pandoc arguments e.g. ['--smart', '--filter=/bin/exe']. Please use long argument names.
  pandocArguments: [],

  // Default latex engine for Pandoc export and latex code chunk.
  latexEngine: 'pdflatex',

  // Whether to enable script execution.
  // Disabling this will prevent executing code chunks and importing javascript files.
  enableScriptExecution: true
};

async function main() {
  await mume.init();

  const engine = new mume.MarkdownEngine({
    filePath: './graphql.md',
    config,
  });

  // open in browser
  // await engine.openInBrowser({ runAllCodeChunks: true });

  // html export
  const foo = await engine.htmlExport({ offline: false, runAllCodeChunks: true });

  // chrome (puppeteer) export
  // await engine.chromeExport({ fileType: 'pdf', runAllCodeChunks: true }); // fileType = 'pdf'|'png'|'jpeg'

  // phantomjs export
  // await engine.phantomjsExport({ fileType: 'pdf', runAllCodeChunks: true }); // fileType = 'pdf'|'png'|'jpeg'

  // prince export
  // await engine.princeExport({ runAllCodeChunks: true });

  // ebook export
  // await engine.eBookExport({ fileType: 'epub' }); // fileType=`epub`|`pdf`|`mobi`|`html`

  // pandoc export
  // await engine.pandocExport({ runAllCodeChunks: true });

  // markdown(gfm) export
  // await engine.markdownExport({ runAllCodeChunks: true });

  const replace = require('replace-in-file');
  const options = {
    files: 'graphql.html',
    from: [/reveal.js\/3.4.1/g, /\\n/g, /..\/..\/lib\/font\/source-sans-pro\/source-sans-pro.css/g, /assets\\/],
    to: ['reveal.js/3.7.0', '\n', 'https://fonts.googleapis.com/css?family=Source+Sans+Pro', 'assets/'],
  };
  console.log('TODO Update the version of reveal.js and change <br/>\\n to <br/>', foo);

  try {
    const changes = await replace(options)
    console.log('Modified files:', changes.join(', '));
  }
  catch (error) {
    console.error('Error occurred:', error);
  }

  return process.exit();
}

main();

