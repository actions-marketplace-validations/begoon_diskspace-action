# GitHub action "diskspace"

This GitHub action checks available disk space on a remote host.

## Requirements

`ssh` must be installed on the runner and ssh keys must be configured.

## Environment variables

| Variable | Default |Description | Required | 
| --- | --- | --- | --- |
| debug | - | When set, the action prints detailed debug information. | NO |
| threshold | - | Minimum available disk space in megabytes. | YES |
| host | - | Remote host to check. | YES |
| ssh | `ssh` | SSH command to run the command on the remote host. | NO |
| cmd | *See below* | Command to run on the remote host. | NO |
| pattern | `(\\d+)` | Regular expression to find the available disk space in the output of the command. | No |

**NOTE**

The default values for `cmd` is `df -BM --output=avail /dev/xvda1`.

**NOTE**

If necessary to add options or flags for the `ssh` command, they can be appended
to the `ssh` variable. For example, `ssh -i path/to/key`.
