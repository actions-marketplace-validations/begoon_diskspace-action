debug = process.env.DEBUG;

function setting(name, default_ = undefined) {
    value = process.env[name];
    if (value === undefined) {
        if (default_ === undefined) {
            console.log(`! ${name} must be set`);
            process.exit(1);
        }
        value = default_;
    }
    if (debug) {
        console.log(`${name}=${value}`);
    }
    return value;
}

threshold = setting("THRESHOLD");
host = setting("HOST");

ssh = setting("SSH", "ssh");
cmd = setting("CMD", "df -BM --output=avail /dev/xvda1");
pattern = setting("PATTERN", "(\\d+)");
let exec = require("child_process").exec;

re = new RegExp(pattern, "g");

ssh_cmd = `${ssh} ${host} ${cmd}`;
if (debug) {
    console.log(`RUNNING [${ssh_cmd}]`);
}
exec(ssh_cmd, function callback(error, stdout, stderr) {
    if (debug) {
        console.log("-".repeat(10));
        console.log(stdout);
        console.log("-".repeat(10));
    }
    matches = [...stdout.matchAll(re)];
    if (debug) {
        console.log(matches);
    }
    avail = matches[0][0];
    if (debug) {
        console.log("avail =", avail);
        console.log("threshold =", threshold);
    }
    enough_space = +avail <= +threshold;
    if (debug) {
        console.log("enough space =", enough_space);
    }
    process.exit(enough_space ? 0 : 1);
});
