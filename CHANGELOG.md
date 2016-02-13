# Changelog / Past releases

## 1.7.7 - 2016-02-12

- Update moment to a secure version
- Add option to disable deploy on PR ([#908](https://github.com/Strider-CD/strider/pull/908))
- Update everypaas
- Update github provider
- Fix strider.json fetch for Github provider ([#914](https://github.com/Strider-CD/strider/pull/914))

## 1.7.6 - 2016-01-29

- Update dependencies
- Delete unused dependencies and files
- Add strider-gitlab as dep
- Invite code checks email
- Update angular and router
- Fix module usage for ecosystem client
- Case-sensitive emails
- Fix provider accounts title
- Fix tab switching error
- Project branch cloning
- Github config more explicit
- Fix accesslevel for new projects with no jobs
- Error on malformed projects
- Fix codemirror refresh
- Add save button to branch settings page
- Sort build history by created date

## 1.7.5 - 2015-10-2

- Client fixes in config and job pages

## 1.7.4 - 2015-08-31

- Add missing client build

## 1.7.3 - 2015-08-31

- Update strider dependencies
- ANSI fixes ([#848](https://github.com/Strider-CD/strider/pull/848))
- Fix job aborting if strider.json not found ([#849](https://github.com/Strider-CD/strider/pull/849))
- Fix job model location ([#847](https://github.com/Strider-CD/strider/pull/847))
- Fix crash if plugin missing ([#845](https://github.com/Strider-CD/strider/pull/845))
- Update fonts and styles
- Cleanup of main.js, move to utils

## 1.7.2 - 2015-08-11

- Test fixes for travis ([#843](https://github.com/Strider-CD/strider/pull/843))
- Fix invite code render ([#842](https://github.com/Strider-CD/strider/pull/842))
- Project access levels for sockets ([#839](https://github.com/Strider-CD/strider/pull/839))
- Dropdown fix and new plugin blocks ([#841](https://github.com/Strider-CD/strider/pull/841))
- Fix user invite email ([#840](https://github.com/Strider-CD/strider/pull/840))
- Update jquery to 2.x
- JSHint updates

## 1.7.1 - 2015-08-03

- Fix plugin template registration ([#838](https://github.com/Strider-CD/strider/pull/838))

## 1.7.0 - 2015-07-23

- Upgrade all plugins ([#671](https://github.com/Strider-CD/strider/issues/671))
- Fix config in Firefox ([#717](https://github.com/Strider-CD/strider/issues/717))
- Easier install (no bower issues) ([#764](https://github.com/Strider-CD/strider/issues/764))
- Many more bugs fixed, see the diff [2e3106a4...402c1d6](https://github.com/Strider-CD/strider/compare/2e3106a4bb228537727e8953c93efd7d754fcc56...402c1d6)

## 1.6.5 - 2015-03-27

- [FEATURE] Corporate Proxy Support ([#741](https://github.com/Strider-CD/strider/pull/741))
- [ENHANCEMENT] io.js support ([commit](https://github.com/Strider-CD/strider/commit/d7f25263e89fb0d84cb43d86c981b84ac7a6f373))
- [ENHANCEMENT] Make configure button more obvious on build page ([commit](https://github.com/Strider-CD/strider/commit/f271df1ebaeefaa41a97bfb42ce8789db2d3a86f))
- [BUGFIX] mongoose version issues ([#752](https://github.com/Strider-CD/strider/issues/752))
- [BUGFIX] Fix issue with mission critical routes ([#748](https://github.com/Strider-CD/strider/issues/748))
- Readme updates

## 1.6.0 - 2015-01-10

- Docker support in core.
- Bring back password reset.
- addUser retry if email taken.
- `strider addUser -f` for overwritting user.
- New project config page layout, see #629
- Plugin manager
- Invite revoke
- Layout/Style fixes
- Plugin dependency updates
- Bug fixes
- Modular client-side (browserify)
- Major cleanup of client-side code
- strider-cli moved out
- etc..


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

