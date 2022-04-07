[![GitHub Action][test-badge]][test-pipeline]
[![GitHub Action][integration-badge]][integration-pipeline]

[test-badge]: https://github.com/begoon/diskspace-action/actions/workflows/test.yaml/badge.svg
[test-pipeline]: https://github.com/begoon/diskspace-action/actions/workflows/test.yaml
[integration-badge]: https://github.com/begoon/diskspace-action/actions/workflows/integration_test.yaml/badge.svg
[integration-pipeline]: https://github.com/begoon/diskspace-action/actions/workflows/integration_test.yaml

# GitHub action "diskspace"

This GitHub action checks available disk space on a remote host.

## Requirements

`ssh` must be installed on the runner and ssh keys must be configured.

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
