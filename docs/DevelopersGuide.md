# Developer's Guide

[This document is also on the wiki.](../../../wiki/Developer's-Guide/)

# Clone

```bash
$> git clone git@github.com:ronyeh/simple-typescript-library.git
Cloning into 'simple-typescript-library'...
...
Receiving objects: 100%, done.

$> cd simple-typescript-library/

# Choose either gulp or grunt. This project works with either one!

# Install gulp
npm install --global gulp-cli

# Install grunt
npm install --global grunt-cli
```

This project exports a ES module, so our gulpfile / gruntfile use the `.cjs` file extension to indicate that it is a Common JS script.

As a result, we need to use our bash scripts `./grunt` and `./gulp` to provide the correct path to the config file.

# Build

`npm run grunt compile` to compile the TypeScript files and output them to `dist/`.

Or you can use `./grunt` or `./gulp` to run a build and watch task, which allows you to develop your code and test the demos with a localhost web server.

# Test

You can view the demo HTML files directly on unpkg.com.

https://unpkg.com/simple-typescript-library@0.0.7/index.html

https://unpkg.com/simple-typescript-library@0.0.7/demos/esm/index.html

# Use [release-it](https://www.npmjs.com/package/release-it) to Publish to NPM and GitHub

To automatically release to GitHub, you need to have a personal access token with **repo** rights.

Generate one here: https://github.com/settings/tokens/new?scopes=repo&description=release-it

If you have 2FA enabled for NPM, you will need to provide a one time password to publish to NPM.

```bash
$> GITHUB_TOKEN=__YOUR_PERSONAL_ACCESS_TOKEN__   npm run release

> simple-typescript-library@0.0.6 release
> release-it

🚀 Let's release simple-typescript-library (currently at 0.0.6)

Empty changelog

? Select increment (next version): patch (0.0.7)
✔ npm run grunt compile
✔ npm run test
✔ echo add dist/ folder
✔ git add -f dist/
✔ git commit -m 'Add dist/ for the release.'

Changeset:
 M package-lock.json
 M package.json

? Publish simple-typescript-library to npm? Yes
? Please enter OTP for npm: __YOUR_ONE_TIME_PASSWORD__
? Commit (release simple-typescript-library version 0.0.7)? Yes
? Tag (0.0.7)? Yes
? Push? Yes
? Create a release on GitHub (Release 0.0.7)? Yes
✔ echo Successfully released simple-typescript-library v0.0.7 to ronyeh/simple-typescript-library.
✔ echo remove dist/ folder
✔ git rm -r dist/
✔ git commit -m 'Remove dist/ after the release.'
🔗 https://www.npmjs.com/package/simple-typescript-library
🔗 https://github.com/ronyeh/simple-typescript-library/releases/tag/0.0.7
🏁 Done (in 33s.)

```

# Pre-Release [ alpha | beta | rc ]

The package.json defines the following scripts:

```
npm run release-dry-run
npm run release-alpha
npm run release-beta
npm run release-rc
npm run release
```

`release-dry-run` only walks you through the steps, but does not actually publish anything.

You can run a pre-release multiple times, and it will increment the pre-release number as follows:

-
-

https://www.npmjs.com/package/simple-typescript-library?activeTab=versions

# Manually Publish to NPM

Before publishing, you can run a sanity check with `npm pack`. This creates a _.tgz file that you can inspect. The _.tgz file can also be uploaded to a test server, and others can install it with `npm install https://test-server.com/simple-typescript-library-0.0.7.tgz`.

If everything looks great, we can 1) bump the version number 2) tag the version and 3) commit the updated package.json to the repository with a single call to: `npm version`.

```
npm version major
npm version minor
npm version patch
npm version prelease --preid=alpha
npm version prelease --preid=beta
npm version prelease --preid=rc
npm version 10.1.6
```

When you are finally ready, you can run `npm publish`. The output will look something like this:

```
$> npm publish

npm notice 📦  simple-typescript-library@0.0.1
npm notice === Tarball Contents ===
...
npm notice 192B  dist/a.js
npm notice 192B  dist/b.js
npm notice 320B  dist/index.js
npm notice 347B  index.html
npm notice 1.0kB package.json
npm notice === Tarball Details ===
npm notice name:          simple-typescript-library
npm notice version:       0.0.1
npm notice filename:      simple-typescript-library-0.0.1.tgz
...

This operation requires a one-time password.
Enter OTP: XXXXXXX
+ simple-typescript-library@0.0.1
```

The package is now available on npm:
https://www.npmjs.com/package/simple-typescript-library

# Manually Release to GitHub

Click the "Draft a New Release" button, which takes you to:

https://github.com/ronyeh/simple-typescript-library/releases/new

Choose a recently pushed tag, e.g., 0.0.7.

Fill in the title and description.

Attach zip / tgz files of the source code.

Check the "This is a pre-release" checkbox if you are publishing a beta or alpha version.

Click **Publish Release**.
