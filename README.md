# focus-input-element

Overview:
Press a shortcut key to focus on the input field on the web page.

The default shortcut key:

- Next input field: F2
- Previous input field: Shift+F2
- Unfocus: F4

Feature:

- You can press it repeatedly to move to the next or previous field.
- You can focus the closest input field in the active area.
- You can check the location of the field with marker.
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

1. Download dependencides

   ```
   npm i
   ```

2. Build for FireFox

   ```
   npm run build-firefox
   ```

2. Build for Chrome
   ```
   npm run build-chrome
   ```

<br/>

### Debug

- Download dependencides

  ```
  npm i
  ```

- Run webpack --watch

  ```
  npx webpack --watch
  ```

- Debugging (on FireFox)
  ```
  npm run debug
  ```
