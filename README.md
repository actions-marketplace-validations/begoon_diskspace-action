# GitHub action "diskspace"

This GitHub action checks available disk space on a remote host.

## Requirements

`ssh` must be installed on the runner and ssh keys must be configured.

## Environment variables

### THRESHOLD

Minimum available disk space in megabytes.

This variable is **required**.

### HOST

Remote host to check.

This variable is **required**.

### SSH

SSH command to use.

Default: `ssh`.

Add nessesary `ssh` options and flags to in this command. For example,

    SSH=ssh -i path/to/key

### CMD

Command to run on the remote host.

Default: `df -BM --output=avail /dev/xvda1`

### PATTERN

Regular expression to find the available disk space in the output of the command.

Default: `(\\d+)`
