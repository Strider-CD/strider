

# Upcoming Releases

## 1.5.1

- Docker support in core.


# Changelog / Past releases

## 1.5.0 - 2014-08-18

- Many bugfixes and improvements.
- New plugin: strider-ssh-deploy. Continuously deploy your code to servers over SSH. [ https://github.com/Strider-CD/strider-ssh-deploy ]
- New plugin: strider-slack: SlackHQ integration [ https://github.com/Strider-CD/strider-slack ]
- New Plugin: strider-metadata: Add job metadata to environment [ https://github.com/Strider-CD/strider-metadata ]


## 1.4.5

Bugfix release for 1.4. Fixes bugs in email notifications, github and bitbucket.

## 1.4.4

Bugfix release for 1.4. Adds Windows support, many fixes and small improvements.

## 1.4.3 - [milestone](https://github.com/Strider-CD/strider/issues?milestone=10&state=open)

Bugfix release for 1.4. No major new features.

Fixes include:

- [#286](https://github.com/Strider-CD/strider/issues/286) strider crash on large github webhook post body

## 1.4.2 - [milestone](https://github.com/Strider-CD/strider/issues?milestone=10&state=open)

Bugfix release for 1.4. No major new features.

Fixes include:

- [#296](https://github.com/Strider-CD/strider/issues/296) encoding / LOCALE issues
- [#289 / #281](https://github.com/Strider-CD/strider/issues/289) getTime() crash
- [#287](https://github.com/Strider-CD/strider/issues/287) unable to add environment variables

## 1.4.1 - [milestone](https://github.com/Strider-CD/strider/issues?milestone=9&state=open)

Bugfix release for 1.4. No major new features.

Fixes include:

- [#210](https://github.com/Strider-CD/strider/issues/210) collaborator acces level issue
- [#278](https://github.com/Strider-CD/strider/issues/278) failed to load plugins when running as non-root user
- [#280](https://github.com/Strider-CD/strider/issues/280) move plugin aggregation to dynamic route
- [#274](https://github.com/Strider-CD/strider/issues/274) error when promoting user to admin
- [#284](https://github.com/Strider-CD/strider/issues/284) safari displays logged-in cache of / despite logout

## 1.4 - [track progress](https://github.com/Strider-CD/strider/issues/197), [milestone](https://github.com/Strider-CD/strider/issues?milestone=3)

Released Nov 16th 2013

Major refactor, almost everything has changed:

- Pluggable VCS providers enable:
  + Git
  + Github Enterprise
  + BitBucket
  + Generic Git
  + 3rd party projects working on Gitlab

- Per-branch repos and config. E.g. "release" branch can have different config from "master" branch.
- Testing of Pull Requests.
- Per-projet plugin configuration. Plugins can be ordered and configured entirely through the web UI.

## 1.3 [milestone](https://github.com/Strider-CD/strider/issues?milestone=2)
- This seems like ages ago...
- Records are blurry back here - look at the git log for information.

