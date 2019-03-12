# GraphQL presentation

## Viewing the presentation

Open `graphql.html` in your favorite browser (tested in Chrome)

The presentation is a web page that uses [reveal.js](http://revealjs.com/) and as such works like a normal website.

_Use arrow keys to navigate._

Press `?` for some help

## Presenter mode

To access the presenter mode you can press `s`. To get the timing to work you will have to take some additional steps:

1. Execute `yarn` to install dependencies
2. Execute `yarn start` or `yarn serve`
3. Open http://localhost:1234/graphql.html in your browser
4. Press `s` to see the presenter mode

Click on the timer to reset it.

## Editing the presentation

The source file for the presentation is a Markdown file called `graphql.md`. To make change to it you need to take the following steps:

1. Edit the `graphql.md` file to reflect your changes
2. Execute `yarn` to install dependencies
3. Execute `yarn start` or `yarn serve`
4. Open http://localhost:1234/graphql.html in your browser
5. Press `s` to see the presenter mode

You can also use the `Markdown Preview Enhanced` plugin for Atom or VSCode (but it will not reflect your CSS in the editor)

### How it works

The index.js file uses the same backend as `Markdown Preview Enhanced` (`@shd101wyy/mume`) to create the `reveal.js` presentation from the Markdown file.

The resulting file contains two bugs:
1. It uses an old version of reveal.js with a bug / notes.html contains a bug
2. It does not handle newlines nicely in the notes section so I have added a workaround for it.

See `index.js` for more details.
