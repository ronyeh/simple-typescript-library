// grunt --gruntfile gruntfile.cjs

const { exec, execSync, spawnSync } = require("child_process");
const fs = require("fs");
const release = require("release-it");

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        watch: {
            options: {
                atBegin: true,
            },
            scripts: {
                files: ["./src/**/*.ts"],
                tasks: ["compile", "test"],
                options: { spawn: false },
            },
        },
    });

    grunt.loadNpmTasks("grunt-contrib-watch");

    grunt.registerTask("greet", () => {
        const output = execSync("echo Using GRUNT").toString();
        console.log(output);
    });

    grunt.registerTask("server", () => {
        console.log("Start HTTP server. Browse to http://localhost:8080/");
        exec("npx http-server", (err, stdout, stderr) => {});
    });

    grunt.registerTask("compile", () => {
        console.log("Compiling TS files...");
        try {
            const buildInfo = require("./tools/generate_version_file.cjs");
            console.log(buildInfo);
            const output = execSync("tsc").toString();
            console.log(output);
        } catch (err) {
            console.log(err.output[1].toString());
        }
    });

    grunt.registerTask("test", () => {
        console.log("Running tests...");
        spawnSync("npm", ["test"], { stdio: "inherit" });
    });

    grunt.registerTask("default", ["greet", "server", "watch"]);

    grunt.registerTask("clean", "Remove 'dist/' directory.", () => {
        console.log("Cleaning dist/ directory...");
        execSync("rm -rf dist/");
    });

    // grunt release
    // GITHUB_TOKEN=XYZ grunt build-test-release
    // GITHUB_TOKEN=XYZ grunt build-test-release:alpha
    // GITHUB_TOKEN=XYZ grunt build-test-release:beta
    // GITHUB_TOKEN=XYZ grunt build-test-release:rc
    // GITHUB_TOKEN=XYZ grunt build-test-release:rc:dry-run
    grunt.registerTask("release-it", "Release to npm and GitHub with the release-it lib.", function (...args) {
        const done = this.async();
        const options = {
            verbose: 1,
            hooks: {
                "before:init": ["echo before:init", "npm run grunt clean"],
                "after:bump": [
                    //
                    "echo after:bump",
                    "cat package.json",
                    "npm run grunt compile",
                    "npm run test",
                    "echo add dist/ folder",
                    "git add -f dist/",
                    "git commit -m 'Add dist/ for release version ${version}.'",
                ],
                "after:npm:release": ["echo after npm:release"],
                "after:git:release": ["echo after git:release"],
                "after:github:release": ["echo after github:release"],
                "after:release": [
                    "echo after:release",
                    "echo Successfully released ${name} ver ${version} to ${repo.repository}.",
                    "echo remove dist/ folder",
                    "git rm -r dist/",
                    "git commit -m 'Remove dist/ after releasing version ${version}.'",
                    "git push",
                ],
            },
            git: {
                changelog: false,
                commitMessage: "Release simple-typescript-library ${version}",
                requireCleanWorkingDir: false,
                commit: true,
                tag: true,
                push: true,
            },
            github: {
                release: true,
            },
            npm: {
                ignoreVersion: true,
                publish: true,
            },
        };

        if (args.includes("dry-run")) {
            options["dry-run"] = true;
            console.log("====== DRY RUN MODE ======");
        }
        // Handle preRelease tags: alpha | beta | rc.
        if (args.includes("alpha")) {
            options["preRelease"] = "alpha";
        }
        if (args.includes("beta")) {
            options["preRelease"] = "beta";
        }
        if (args.includes("rc")) {
            options["preRelease"] = "rc";
        }

        release(options).then((output) => {
            // console.log(output);
            // { version, latestVersion, name, changelog }
            done();
        });
    });

    // An alternative to the 'release-it' task.
    // type == major | minor | patch
    grunt.registerTask("release", "", function (type) {
        if (!type) {
            type = "patch";
        }
        spawnSync("npm", ["version", type, "-m", '"Bump version to %s"'], { stdio: "inherit" });
    });

    grunt.registerTask("releaseBeta", "", function () {
        const done = this.async();
        spawnSync("npm", ["version", "prerelease", "--preid=beta", "-m", "Bump version to %s"], { stdio: "inherit" });
    });

    // The exact order of execution is as follows:
    // Check to make sure the git working directory is clean before we get started. Your scripts may add files to the commit in future steps. This step is skipped if the --force flag is set.
    // Run the preversion script. These scripts have access to the old version in package.json. A typical use would be running your full test suite before deploying. Any files you want added to the commit should be explicitly added using git add.
    // Bump version in package.json as requested (patch, minor, major, etc).
    // Run the version script. These scripts have access to the new version in package.json (so they can incorporate it into file headers in generated files for example). Again, scripts should explicitly add generated files to the commit using git add.
    // Commit and tag.
    // Run the postversion script. Use it to clean up the file system or automatically push the commit and/or tag.
    grunt.registerTask("release:preversion", "", function () {
        console.log("PREVERSION");
        grunt.task.run("clean");
    });

    grunt.registerTask("release:version", "", function () {
        console.log("VERSION");
        grunt.task.run("compile");
        grunt.task.run("test");
        grunt.task.run("release:addDistDir");
    });

    grunt.registerTask("release:addDistDir", "", function () {
        console.log("add dist/ folder");
        const output = execSync("git add -f dist/").toString();
        console.log(output);
    });

    grunt.registerTask("release:postversion", "", function () {
        console.log("POSTVERSION");
        const PACKAGE_JSON = JSON.parse(fs.readFileSync("package.json"));
        const APP_VERSION = PACKAGE_JSON.version;
        console.log("New version is: " + APP_VERSION);

        spawnSync("npm", ["run", "grunt", "releaseToGitHub"], { stdio: "inherit" });

        const publishArgs = ["publish"];
        if (APP_VERSION.includes("alpha")) {
            publishArgs.push("--tag");
            publishArgs.push("alpha");
        } else if (APP_VERSION.includes("beta")) {
            publishArgs.push("--tag");
            publishArgs.push("beta");
        } else if (APP_VERSION.includes("rc")) {
            publishArgs.push("--tag");
            publishArgs.push("rc");
        }
        spawnSync("npm", publishArgs, { stdio: "inherit" });
        console.log(`https://www.npmjs.com/package/simple-typescript-library/v/${APP_VERSION}`);

        spawnSync("git", ["rm", "-r", "dist/"], { stdio: "inherit" });
        spawnSync("git", ["commit", "-m", `Remove dist/ after releasing version ${APP_VERSION}.`], { stdio: "inherit" });
        spawnSync("git", ["push"], { stdio: "inherit" });
    });

    grunt.registerTask("releaseToGitHub", "Release to GitHub.", function (...args) {
        const done = this.async();
        const options = {
            verbose: 1,
            increment: false,
            hooks: {
                "after:bump": ["cat package.json"],
                "after:npm:release": [],
                "after:git:release": [],
                "after:github:release": ["echo after github:release"],
                "after:release": ["echo after:release", "echo Successfully released ${name} ver ${version} to https://github.com/${repo.repository}."],
            },
            git: {
                changelog: false,
                commitMessage: "Release simple-typescript-library ${version}",
                requireCleanWorkingDir: false,
                commit: false,
                tag: false,
                push: false,
            },
            github: { release: true },
            npm: {
                publish: false,
            },
        };

        if (args.includes("dry-run")) {
            options["dry-run"] = true;
            console.log("====== DRY RUN MODE ======");
        }
        // Handle preRelease tags: alpha | beta | rc.
        if (args.includes("alpha")) {
            options["preRelease"] = "alpha";
        }
        if (args.includes("beta")) {
            options["preRelease"] = "beta";
        }
        if (args.includes("rc")) {
            options["preRelease"] = "rc";
        }

        release(options).then((output) => {
            // console.log(output);
            // { version, latestVersion, name, changelog }
            done();
        });
    });
};
