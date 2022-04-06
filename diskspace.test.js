const test = require("ava");

const execSync = require("child_process").execSync;
const path = require("path");

const action = "node " + path.join(__dirname, "index.js");

const realHost = process.env.INTEGRATION_HOST;

if (realHost) {
    test("test enough space via internet", (t) => {
        try {
            const threshold = 100;
            process.env["INPUT_THRESHOLD"] = threshold;
            process.env["INPUT_HOST"] = realHost;
            process.env["INPUT_USER"] = "ec2-user";
            process.env["INPUT_SSH"] = process.env.INTEGRATION_SSH || "ssh";

            const result = execSync(action, { env: process.env }).toString();
            const re = `::notice::threshold\\(${threshold}\\) <= avail\\(\\d+\\)`;
            const match = result.match(new RegExp(re));
            t.truthy(match, JSON.stringify({ result, re, match }, null, 2));
        } catch (e) {
            t.fail(error instanceof Error ? error.stdout.toString() : error);
        }
    });

    test("test not enough space via internet", (t) => {
        const threshold = 1024 * 1024;
        process.env["INPUT_THRESHOLD"] = threshold;
        process.env["INPUT_HOST"] = realHost;
        process.env["INPUT_USER"] = "ec2-user";
        process.env["INPUT_SSH"] = process.env.INTEGRATION_SSH || "ssh";
        const error = t.throws(() => execSync(action, { env: process.env }), {
            instanceOf: Error,
        });
        const result = error.stdout.toString();
        const re = `::warning::threshold\\(${threshold}\\) > avail\\(\\d+\\)`;
        const match = result.match(new RegExp(re));
        t.truthy(match, JSON.stringify({ result, re, match }, null, 2));
    });
}

test("test enough space", (t) => {
    process.env["INPUT_THRESHOLD"] = 100;
    process.env["INPUT_HOST"] = "-host-";
    process.env["INPUT_USER"] = "-user-";
    process.env["INPUT_SSH"] = "node " + path.join(__dirname, "echo.js");
    process.env["INPUT_CMD"] = "Avail 300";
    process.env["INPUT_PATTERN"] = "[0-9]+";

    try {
        const result = execSync(action, { env: process.env }).toString();
        const needle = "::notice::threshold(100) <= avail(300)";
        const found = result.includes(needle);
        t.truthy(found, JSON.stringify({ result, needle }, null, 2));
    } catch (error) {
        t.fail(error instanceof Error ? error.stdout.toString() : error);
    }
});

test("test not enough space", (t) => {
    process.env["INPUT_THRESHOLD"] = 100;
    process.env["INPUT_HOST"] = "-host-";
    process.env["INPUT_USER"] = "-user-";
    process.env["INPUT_SSH"] = "node " + path.join(__dirname, "echo.js");
    process.env["INPUT_CMD"] = "Avail 30";
    process.env["INPUT_PATTERN"] = "[0-9]+";

    const error = t.throws(() => execSync(action, { env: process.env }), {
        instanceOf: Error,
    });
    const result = error.stdout.toString();
    const needle = "::warning::threshold(100) > avail(30)";
    const found = result.includes(needle);
    t.truthy(found, JSON.stringify({ result, needle }, null, 2));
});

test("test custom settings", (t) => {
    process.env["INPUT_THRESHOLD"] = 123;
    process.env["INPUT_HOST"] = "-host-";
    process.env["INPUT_USER"] = "-user-";
    process.env["INPUT_SSH"] = "node " + path.join(__dirname, "echo.js");
    process.env["INPUT_CMD"] = "=cmd= _321_";
    process.env["INPUT_PATTERN"] = "-l,-user-,-host-,=cmd=,_([0-9]+)_";

    try {
        const result = execSync(action, { env: process.env }).toString();
        const re = /::notice::threshold\(123\) <= avail\(321\)/;
        const match = result.match(re);
        t.truthy(match, JSON.stringify({ result, re, match }, null, 2));
    } catch (error) {
        t.fail(error instanceof Error ? error.stdout.toString() : error);
    }
});

test("test custom pattern only", (t) => {
    process.env["INPUT_THRESHOLD"] = 123;
    process.env["INPUT_HOST"] = "-host-";
    process.env["INPUT_USER"] = "-user-";
    process.env["INPUT_PATTERN"] = "321";

    try {
        const result = execSync(action, { env: process.env }).toString();
        const needle = "::notice::threshold(123) <= avail(321)";
        t.truthy(
            result.includes(needle),
            JSON.stringify({ result, needle }, null, 2)
        );
    } catch (error) {
        t.fail(error instanceof Error ? error.stdout.toString() : error);
    }
});
