# GitHub action "diskspace"

[![GitHub Action][test-badge]][test-pipeline]
[![GitHub Action][integration-badge]][integration-pipeline]

[test-badge]: https://github.com/begoon/diskspace-action/actions/workflows/test.yaml/badge.svg
[test-pipeline]: https://github.com/begoon/diskspace-action/actions/workflows/test.yaml
[integration-badge]: https://github.com/begoon/diskspace-action/actions/workflows/integration_test.yaml/badge.svg
[integration-pipeline]: https://github.com/begoon/diskspace-action/actions/workflows/integration_test.yaml

This GitHub action checks available disk space on a remote host. It can
be convinient when you deploy to a remote host from the GitHub action,
and you want to make sure that there is enough disk space there.

With this action, you can specify the host and the threshold. The action
will connect to the host and check that the available disk space is more
than the threshold. If it is less than the threshold, the action will fail.

The action uses `ssh` to connect to the remote host. The action executes
a command to print the available disk space. By default, the `df` command
is used with some flags. Then a regular expression is used to find the
number representing the available diskspace.

If the number is found, it is compared to the `threshold`. If the
available disk space is less then the `threshold`, the action will fail.
Otherwise, the action will succeed.

If the number representing the available disk is not found by the regular
expression, the action will fail as well.

## Requirements

`ssh` must be available on the runner, and ssh keys must be configured.

Usually, linux hosts provide `ssh` by default, and the
[@shimataro/ssh-key-action](https://github.com/shimataro/ssh-key-action)
action can be used to configure the keys.

## Inputs

| Variable | Default |Description | Required |
| --- | --- | --- | --- |
| threshold | - | Minimum available disk space in megabytes. For example, `1000`, which means that 1000 megabytes are required. | Yes |
| host | - | Remote host to check. For example, `1.1.1.1`. | Yes |
| user | - | Remote host user. For example, `ec2-user`.| Yes |
| ssh | `ssh` | SSH command to run the command on the remote host. If necessary to add options or flags for the `ssh` command, they can be appended to the `ssh` variable. For example, `ssh -q`. | No |
| cmd | [note 1](#note-1) | Command to run on the remote host. | No |
| pattern | `\d+` | Regular expression to find the available disk space in the output of the command. If the regular expression has groups (`()` are used), the first captured group will be used as the result. | No |

### Note 1

The default values for `cmd` is `df -BM --output=avail /dev/xvda1`.

On Amazon Linux this command prints something like:

```text
 Avail
16813M
```

The default regular expression `\d+` matches the sequence of digits.

## Example usage

    - uses: shimataro/ssh-key-action@v2
      with:
        key: ${{ secrets.EC2_SSH_PRIVATE_KEY }}
        known_hosts: "anything"

    - run: ssh-keyscan -H ${{ secrets.EC2_SSH_HOST }} >> ~/.ssh/known_hosts    
  
    - uses: begoon/diskspace-action@v1
      with:
          host: ${{ secrets.EC2_SSH_HOST }}
          user: ec2-user
          threshold: 1000
