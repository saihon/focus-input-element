# focus-input-element

Overview:

Pressing the shortcut key moves the cursor to the text box on the Web page.


The default shortcut keys:

- Next input box: F2
- Previous input box: Shift+F2
- Unfocus: F4
- First input box: Default unspecified
- Last input box: Default unspecified


Features:

- Press the key repeatedly to move to the next or previous input box.
- Focus is available on the nearest input box in the active area of the scrolled page.
- Markers allow you to locate the input box.
- These settings can be changed on the Options page.

<br/>

# Install

Installation via ADD-ONS Mozilla  
https://addons.mozilla.org/en-US/firefox/addon/focus-input-element/

Installation via Chrome Web Store  
https://chrome.google.com/webstore/detail/focus-input-element/pehdagiekdjhnojgbbcnckoojejiojgn

<br/>

# Development

<br/>

### Build

- Download dependencies

   ```
   npm install
   ```

- Build for FireFox

   ```
   npm run build-firefox
   ```

- Build for Chrome
   ```
   npm run build-chrome
   ```

<br/>

### Debug

- Download dependencies

  ```
  npm install
  ```

- Run webpack

  ```
  npx webpack --watch
  ```

- Debugging
  ```
  npx web-ext run -s ./dist
  ```
