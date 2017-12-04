# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="1.10.0"></a>
# [1.10.0](https://github.com/Strider-CD/strider/compare/v1.9.6...v1.10.0) (2017-12-04)


### Bug Fixes

* button style fixes ([c9fbca1](https://github.com/Strider-CD/strider/commit/c9fbca1))
* mongoose open() deprecation, resolves [#1044](https://github.com/Strider-CD/strider/issues/1044) ([5484c31](https://github.com/Strider-CD/strider/commit/5484c31))
* revert jquery update, bootstrap2 doesn't play well with it ([7f1adea](https://github.com/Strider-CD/strider/commit/7f1adea))
* update request to prevent vulnerability ([5664403](https://github.com/Strider-CD/strider/commit/5664403))
* **security:** update jquery to 3.x, probably about time any way ([9d34ad9](https://github.com/Strider-CD/strider/commit/9d34ad9))
* **security:** update vulnerable packages ([4766749](https://github.com/Strider-CD/strider/commit/4766749))
* **styles:** add margin to bottom of wrapper ([7aa49ef](https://github.com/Strider-CD/strider/commit/7aa49ef))
* **styles:** another footer fix ([dac61ca](https://github.com/Strider-CD/strider/commit/dac61ca))
* **styles:** button icons moving out of buttons ([0001bdf](https://github.com/Strider-CD/strider/commit/0001bdf))
* **styles:** job-title margin ([eea4f43](https://github.com/Strider-CD/strider/commit/eea4f43))
* **styles:** wrapper footer being too high up in desktop size ([d9d6874](https://github.com/Strider-CD/strider/commit/d9d6874))


### Features

* make build deploy/test header more obvious ([1053557](https://github.com/Strider-CD/strider/commit/1053557))
* move cancel out of dropdown ([098f8dd](https://github.com/Strider-CD/strider/commit/098f8dd))



<a name="1.9.6"></a>
## [1.9.6](https://github.com/Strider-CD/strider/compare/v1.9.5...v1.9.6) (2017-03-21)


### Bug Fixes

* Name of project should link to config page ([7a7e9d9](https://github.com/Strider-CD/strider/commit/7a7e9d9))
* Use correct name for project deletions. ([dc4ccb2](https://github.com/Strider-CD/strider/commit/dc4ccb2))
* wording for error message ([0ce4b92](https://github.com/Strider-CD/strider/commit/0ce4b92))



<a name="1.9.5"></a>
## [1.9.5](https://github.com/Strider-CD/strider/compare/v1.9.3...v1.9.5) (2017-02-20)


### Bug Fixes

* cli use strict and semi ([a76bb0b](https://github.com/Strider-CD/strider/commit/a76bb0b))
* context server name was undefined ([8e5cb5c](https://github.com/Strider-CD/strider/commit/8e5cb5c))
* log error if bad mongo connection, resolves [#997](https://github.com/Strider-CD/strider/issues/997) ([04cdefb](https://github.com/Strider-CD/strider/commit/04cdefb))



# Changelog / Past releases

## 1.9.2 - 2016-09-13

- [BUGFIX] HAve server us it's own version of ansi.js, see ([#991](https://github.com/Strider-CD/strider/pull/991))

## 1.9.1 - 2016-09-09

- [BUGFIX] Fix collaborator router returning 404, see ([#990](https://github.com/Strider-CD/strider/pull/990))
- [UI] Build Metadata: Move progress bar to the bottom
- [UI] History Row: Hide took and / in certain states
- [DEV] Build client scripts on prepublish

## 1.9.0 - 2016-09-07

The biggest change in this release is that Strider expects to be run with Node.js version greater
or equal to 4.2.

Range: https://github.com/Strider-CD/strider/compare/b211c45...fd0cd66

- Expect Node >= 4.2
- Update dependencies
- Fix tests
- Fix config merge behavior
- Fix express deprecations
- Order plugins alphabetically
- Convert more routes to express router syntax
- Don't create default config for runner plugins
- Fix duplicate job listings
- Jade to Pug deprecation fix
- Improved logging, use `DEBUG=strider*` env
- Dashboard & Build Page UI refresh ([#988](https://github.com/Strider-CD/strider/pull/988))

## 1.8.0 - 2016-07-20

Range: https://github.com/Strider-CD/strider/compare/4ed868a6be4411507c6c1b75b2ae6fd242d08f58...f5051ab79fda22043773b19ac2713d8b10ab0f32

- Update moment again for security
- Remove Heroku XHR polling ([#920](https://github.com/Strider-CD/strider/pull/920))
- Document concurrent jobs env
- Fix login redirects ([#923](https://github.com/Strider-CD/strider/pull/923))
- Add plugin blocks for login form ([#924](https://github.com/Strider-CD/strider/pull/924))
- Cleanup travis config
- Lock in Angular version
- Update plugin dependencies
- Set name of local plugins ([#932](https://github.com/Strider-CD/strider/pull/932))
- Add SMTP_SECURE config ([#933](https://github.com/Strider-CD/strider/pull/933))
- Fix dev.sh script ([#943](https://github.com/Strider-CD/strider/pull/943))
- Fix performance issues when viewing failed builds ([#952](https://github.com/Strider-CD/strider/pull/952))
- Fix hard-coded admin notification email address ([#951](https://github.com/Strider-CD/strider/pull/951))
- Fix ESLint usage ([#954](https://github.com/Strider-CD/strider/pull/954))
- Fix footer being scrolled out of view
- Go to hash-targetted tab
- Add IntelliJ code style definition
- Replace ssh-keypair with native JS solution (win support)
- Allow strider.json to set runner
- Add more `debug` instances for logging
- Replace Makefile with npm scripts

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
