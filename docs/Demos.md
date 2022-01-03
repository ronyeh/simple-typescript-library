# Demos

Demos are stored in the /demos/ folder. To run the demo, take the github.com URL and replace `https://github.com` with `https://codesandbox.io/s/github`.

## Hello World

https://codesandbox.io/s/github/ronyeh/simple-typescript-library/tree/main/demos/hello/

The above demo is [generated from these files](/demos/hello/).

## Skypack

https://codesandbox.io/s/github/ronyeh/simple-typescript-library/tree/main/demos/skypack/

The above demo is [generated from these files](/demos/skypack/).

## ES Module

The [ESM demo](/demos/esm/) does not work on codesandbox.io, because it directly references the build file `"../../dist/index.js"`.

However, it does work on unpkg.com: https://unpkg.com/simple-typescript-library/demos/esm/index.html

To run it locally, you will need to start a web server `npx http-server` and then navigate to the /demos/esm/ folder.
