// Saves the build information to vexflow/src/version.ts

const path = require("path");
const fs = require("fs");
const { execSync } = require("child_process");

const outputFile = path.join(__dirname, "../src/version.ts");

const PACKAGE_JSON = JSON.parse(fs.readFileSync("package.json"));
const APP_VERSION = PACKAGE_JSON.version;
const GIT_COMMIT_ID = execSync("git rev-parse HEAD").toString().trim();
const DATE = new Date().toISOString();

const V = `export const VERSION = '${APP_VERSION}';`;
const I = `export const ID = '${GIT_COMMIT_ID}';`;
const D = `export const DATE = '${DATE}';`;

fs.writeFileSync(outputFile, `${V}\n${I}\n${D}`);

module.exports = {
    VERSION: APP_VERSION,
    ID: GIT_COMMIT_ID,
    DATE: DATE,
};
