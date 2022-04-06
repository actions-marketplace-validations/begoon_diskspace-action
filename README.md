# GitHub action "diskspace"

This GitHub action checks available disk space on a remote host.

## Requirements

`ssh` must be installed on the runner and ssh keys must be configured.

Usually, linux hosts provide `ssh` by default, and the
<https://github.com/shimataro/ssh-key-action> action can be used to configure
the keys.

## Inputs

| Variable | Default |Description | Required |
| --- | --- | --- | --- |
| debug | - | When set, the action prints detailed debug information. | NO |
| threshold | - | Minimum available disk space in megabytes. | YES |
| host | - | Remote host to check. | YES |
| user | - | Remote host user. | YES |
| ssh | `ssh` | SSH command to run the command on the remote host ([note 2](#note-2)). | NO |
| cmd | [note 1](#note-1) | Command to run on the remote host. | NO |
| pattern | `(\\d+)` | Regular expression to find the available disk space in the output of the command. | No |

### Note 1

The default values for `cmd` is `df -BM --output=avail /dev/xvda1`.

### Note 2

If necessary to add options or flags for the `ssh` command, they can be appended
to the `ssh` variable. For example, `ssh -i path/to/key`.

## Example usage

    uses: begoon/diskspace-action@v1
    with:
        host: 1.1.1.1
        threshold: 1000
