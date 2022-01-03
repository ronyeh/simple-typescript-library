// gulp --gulpfile gulpfile.cjs

const gulp = require("gulp");
const { series, watch } = gulp;
const { exec, execSync, spawn } = require("child_process");

gulp.task("greet", (done) => {
    const output = execSync("echo Launching GULP...").toString();
    console.log(output);
    done();
});

gulp.task("server", (done) => {
    console.log("Start HTTP server.\nBrowse to http://localhost:8080/");
    exec("npx http-server", (err, stdout, stderr) => {});
    done();
});

function compileAndTest() {
    compile();
    test();
}

function compile(done) {
    console.log("Compiling TS files...");
    try {
        const output = execSync("tsc").toString();
        console.log(output);
    } catch (err) {
        console.log(err.output[1].toString());
    }
    if (done) done();
}

function test(done) {
    console.log("Running tests...");
    spawn("npm", ["test"], { stdio: "inherit" });
    if (done) done();
}

gulp.task("compile", compile);
gulp.task("test", test);

gulp.task("watch", (done) => {
    const watcher = watch(["./src/**/*.ts"]);
    watcher.on("change", (path, stats) => {
        console.log(`File ${path} was changed`);
        compileAndTest();
    });

    compileAndTest();

    done();
});

const defaultTask = gulp.task("default", series("greet", "server", "watch"));

exports.default = defaultTask;
