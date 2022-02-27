# focus-input-element

A browser extension that focuses on the next or previous HTML input element when the shortcut key is pressed.

Default shortcut-keys:
* Focus on the next input elements: F2
* Focus on the previous input elements: Shift+F2
* Remove focus: F4

Feature:
* Focus on the closest input element.
* Marks the focused element.

These can be changed on the Options page.

<br/>

# Install

Installation via ADD-ONS Mozilla  
https://addons.mozilla.org/en-US/firefox/addon/focus-input-element/

<br/>

# Development

<br/>

### Build

1. Download dependencides
    ```
    npm i
    ```

2. Run webpack
    ```
    npm run webpack
    ```

3. Build (pack to *.xip or *.zip)
    ```
    npm run build-all
    ```

<br/>

### Debug

* Download dependencides
    ```
    npm i
    ```

* Run webpack --watch
    ```
    npm run webpack-watch
    ```

* Debug (on FireFox)
    ```
    npm run debug
    ```
