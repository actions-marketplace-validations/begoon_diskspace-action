const core = require("@actions/core");

const default_ssh = "ssh";
const default_command = "df -BM --output=avail,source /dev/xvda1";
const default_pattern = "[0-9]+";

async function diskspace(exec) {
    function setting(name, options = {}) {
        const required = !options.default;
        const value =
            core.getInput(name, { required: required }) || options.default;
        core.info(`${name}=${value}`);
        return value;
    }

    const threshold = setting("threshold");
    const host = setting("host");
    const user = setting("user");

    const ssh = setting("ssh", { default: default_ssh });
    const cmd = setting("cmd", { default: default_command });
    const pattern = setting("pattern", { default: default_pattern });

    const re = new RegExp(pattern);

    const sshCmd = `${ssh} -l ${user} ${host} ${cmd}`;

    let output = "";
    await exec(sshCmd, [], {
        listeners: {
            stdline: (data) => {
                output = data.toString();
            },
        },
    });

    const match = output.match(re);
    core.info(`match ${JSON.stringify(match)}`);

    if (!match) {
        core.setFailed(`Could not find then pattern ${pattern} in output.`);
        return;
    }
    const avail = match.length == 1 ? match[0] : match[1];
    const enoughSpace = +threshold <= +avail;

    const comparison = +threshold <= +avail ? "<=" : ">";
    const print = enoughSpace ? core.notice : core.warning;

    print(`threshold(${threshold}) ${comparison} avail(${avail})`);
    if (!enoughSpace) core.setFailed(`Not enough disk space on ${host}.`);
}

module.exports = diskspace;
