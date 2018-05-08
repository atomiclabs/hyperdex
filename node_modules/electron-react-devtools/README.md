# React DevTools Extension for Electron

[![NPM](https://nodei.co/npm/electron-react-devtools.png)](https://nodei.co/npm/electron-react-devtools/)

Unfortunately, [React DevTools](https://github.com/facebook/react-devtools)
is not working with [Electron](http://electron.atom.io/)(<=v1.2.0). Because not implemented
`chrome.runtime*` APIs and not support `Background Pages` in Electron. So I fix
the source of "React DevTools" for Electron.

![](/devtools-full.gif)

## Installing

```sh
npm install --save-dev electron-react-devtools
or
npm install --save-dev firejune/electron-react-devtools
```

You will still see the React DevTools message('Download the React DevTools
and ...') in `Console` tab.

Then execute the following from the Console tab of your running Electron app's
developer tools:

```js
require('electron-react-devtools').install()
```

And than refresh or restart the renderer process, you can see a `React` tab added.

## To hack on the plugin

- run `npm install`
- run `npm run build` in this directory
- run `webpack` or `webpack --watch` in this directory
- Go to `chrome://extensions`, check "developer mode", and click "Load
  unpacked extension", and select this directory
- Hack away!

Generally, changes to the UI will auto-propagate if you have `webpack --watch`
on (close devtools and re-open them). If you change the background script or
injector, you might have to reload the extension from the extensions page.

## Insulating the environment

React Devtools has part of the code (the backend + agent) running in the same
javascript context as the inspected page, which makes the code vulnerable to
environmental inconsistencies. For example, the backend uses the es6 `Map`
class and normally expects it to be available in the global scope. If a user
script has overridden this, the backend breaks.

To prevent this, the content script [`src/GlobalHook.js`](src/GlobalHook.js),
which runs before any user js, saves the native values we depend on to the
`__REACT_DEVTOOLS_GLOBAL_HOOK__` global. These are:

- Set
- Map
- WeakMap
- Object.create

Then in `webpack.backend.js`, these saved values are substituted for the
globally referenced name (e.g. `Map` gets replaced with
`window.__REACT_DEVTOOLS_GLOBAL_HOOK__.nativeMap`).

## Fixing document.create

React Native sets `document.createElement` to `null` in order to convince js
libs that they are not running in a browser environment while `debug in
chrome` is enabled.

To deal with this, [`src/inject.js`](src/inject.js) calls
`document.constructor.prototype.createElement` when it needs to create a
`<script>` tag.
