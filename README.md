# ![Strider][logo]

[![NPM][npm-badge-img]][npm-badge-link] [![Code Climate][cc-badge]][cc-badge-link] [![Dependency Status][david-badge]][david-badge-link] [![Build Status][travis-badge]][travis-badge-link]  
[![Gitter][gitter-badge]][gitter-badge-link]
[![Backers on Open Collective][backers-badge-img]](#backers)
[![Sponsors on Open Collective][sponsors-badge-img]](#sponsors)

---

### Brilliant Continuous Deployment

![Strider Screenshot][screenshot]
[more screenshots][more-screenshots]


Overview
========

`Strider` is an Open Source Continuous Deployment / Continuous Integration
platform. It is written in Node.JS / JavaScript and uses MongoDB as a backing
store. It is published under the BSD license.

Strider is extremely customizable through plugins. Plugins can 

- add hooks to perform arbitrary actions during build.
- modify the database schema to add custom fields.
- register their own HTTP routes.
- subscribe to and emit socket events.
- create or modify user interfaces within Strider.
- so much more! just use your imagination!

## General Requirements

- [nodejs] >= 4.2
- [git] >= 2.0
- [mongodb][mongo-download] (local or remote)
- [node-gyp]

_Note: Installing on OS X might require XCode to be installed._

- The package `krb5-devel`/`libkrb5-dev` might have to be installed to resolve Kerberos related build issues on some systems.


## Running on Infrastructure

Make sure you have MongoDB installed on your system. You can get the latest version at [mongodb.org][mongo-download].

Next you will need Node.JS. You can get binary packages for most platforms at [nodejs.org][nodejs].

Once you have Node.JS on your system, you can fetch & install all the dependencies for your Strider clone
by executing the following command in the project root:

```no-highlight
npm install
```

> Note: Sometimes there are issues with permissions and installing global modules, in those cases run `npm config set prefix ~/npm` to set your global modules directory to '~/npm'. You will also have to add `~/npm/bin` to your `PATH` environment variable.

### Configuring

`Strider` configuration comes from environment variables. Most of the default
values should work fine for running on localhost, however for an
Internet-accessible deployment the following variables will need to be exported:

  - `SERVER_NAME` - **Required**; Address at which server will be accessible on the Internet. E.g. `https://strider.example.com` (note: no trailing slash, and included protocol)
  - `HOST` - Host where strider listens, optional (defaults to 0.0.0.0).
  - `PORT` - Port that strider runs on, optional (defaults to 3000).
  - `CONCURRENT_JOBS` - How many jobs to run concurrently (defaults to 1). Concurrency only works across different project and branch combinations. So if two jobs come in for the same project and branch, concurrency will always be 1.
  - `STRIDER_CLONE_DEST` - Where the repositories are cloned to (defaults to ~/.strider)
  - `DB_URI` - MongoDB DB URI if not localhost (you can safely use [MongoLab free plan][mongolab] - works great)
  - `HTTP_PROXY` - Proxy support, optional (defaults to null)
  - If you want email notifications, configure an SMTP server (we recommend [Mailgun] for SMTP if you need a server - free account gives 200 emails / day):
    - `SMTP_HOST` - SMTP server hostname e.g. smtp.example.com
    - `SMTP_PORT` - SMTP server port e.g. 587 (default)
    - `SMTP_SECURE` - SMTP server TLS or SSL ("true" or "false")
    - `SMTP_USER` - SMTP auth username e.g. "myuser"
    - `SMTP_PASS` - SMTP auth password e.g. "supersecret"
    - `SMTP_FROM` - Default FROM address e.g. "Strider <noreply@stridercd.com>" (default)

#### Additional Configurations

- `BODY_PARSER_LIMIT` - Increase the maximum payload size that our [body parser][body-parser] will attempt to parse. Useful for github web hooks.
- `DEBUG` - Set this to `strider*` to enable all debug output. This is very helpful when troubleshooting issues or finding the cause of bugs in Strider. For more information see https://www.npmjs.com/package/debug

You might need to follow these instructions if you use any of these, please do so before filing issues.

- [Github][github-config]  
- [Bitbucket][bitbucket-config]  
- [Gitlab][gitlab-config]  
- [Heroku][heroku-config]  

### Adding Initial Admin User

`Strider` isn't much use without an account to login with. Once you create an administrative user, you can invite as many
other people as you like to your instance. There is a simple CLI subcommand to help you create the initial user:

```no-highlight
node bin/strider addUser
```

Example run:

```no-highlight
$ node bin/strider addUser
Enter email []: strider@example.com
Is admin? (y/n) [n]: y
Enter password []: *******

Email:    strider@example.com
Password: ****
isAdmin:  true
OK? (y/n) [y]:
22 Oct 21:21:01 - info: Connecting to MongoDB URL: mongodb://localhost/strider-foss
22 Oct 21:21:01 - info: User added successfully! Enjoy.
```

See the [strider-cli] for more details.  

If you want to connect to your ldap server to authorization  
you can also add the `ldap.json` config file to project root  
the config like so:  

```javascript
 {
    "url": ldap://host:port,
    "baseDN": dnString,
    "username": username,
    "password": password,
    // If you want to set a admin group
    "adminDN": dnString
 }
```

### Starting Strider

Once `Strider` has been installed and configured, it can be started with:

```no-highlight
NODE_ENV=production npm start
```

### Strider on Heroku

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

To get up and running quickly on Heroku, you can simply use the button above.
If you run into any issues, see the [wiki entry](https://github.com/Strider-CD/strider/wiki/Strider-on-Heroku).


### Strider in Docker

Many users like to run Strider within a Docker container.
Although this works well, supporting it is outside the scope of the Strider project.

We recommend using [docker-strider](https://github.com/Strider-CD/docker-strider) as a base image when designing your Docker-based Strider installation.
Please post related issues in the [issues section](https://github.com/Strider-CD/docker-strider/issues) for that repository.


## Resources

- [Strider Tutorial Series][resource-strider-futurestudio-tutorials] - Extensive guides about Strider covering platform setup, 3rd party integrations (GitHub, GitLab, etc), continuous deployments (Heroku, SSH), notifications (email, Slack, HipChat), how to create your own Strider plugin and many more.
- [Strider on DigitalOcean][resource-digitalocean] - Covers setting up an Ubuntu machine with Strider using upstart.
- [Strider plugin template][resource-plugin-template] - Simple setup for getting started with your own plugin.
- [Panamax Strider template][resource-panamax-template] - Strider template for use with Panamax.


## Advanced Topics

Advanced topics are located in the [Wiki](https://github.com/Strider-CD/strider/wiki), here's a small
subset of what's covered:

- [Advanced Configuration](https://github.com/Strider-CD/strider/wiki/Advanced-Configuration)
- [Requiring Strider](https://github.com/Strider-CD/strider/wiki/Requiring-Strider)
- [Managing Plugins](https://github.com/Strider-CD/strider/wiki/Managing-Plugins)

## API Documentation

An effort has been started to document the existing REST API, and to have versioned documentation going forward.
We use [apiDoc] for the documentation.

To build the documentation run `npm run docs` and the documentation will be accessable from `apidocs/index.html`.

**[View Strider API Docs](http://strider-api-docs.surge.sh/)**

## Backers

Support us with a monthly donation and help us continue our activities. [[Become a backer](https://opencollective.com/strider#backer)]

<a href="https://opencollective.com/strider/backer/0/website" target="_blank"><img src="https://opencollective.com/strider/backer/0/avatar.svg"></a>
<a href="https://opencollective.com/strider/backer/1/website" target="_blank"><img src="https://opencollective.com/strider/backer/1/avatar.svg"></a>
<a href="https://opencollective.com/strider/backer/2/website" target="_blank"><img src="https://opencollective.com/strider/backer/2/avatar.svg"></a>
<a href="https://opencollective.com/strider/backer/3/website" target="_blank"><img src="https://opencollective.com/strider/backer/3/avatar.svg"></a>
<a href="https://opencollective.com/strider/backer/4/website" target="_blank"><img src="https://opencollective.com/strider/backer/4/avatar.svg"></a>
<a href="https://opencollective.com/strider/backer/5/website" target="_blank"><img src="https://opencollective.com/strider/backer/5/avatar.svg"></a>
<a href="https://opencollective.com/strider/backer/6/website" target="_blank"><img src="https://opencollective.com/strider/backer/6/avatar.svg"></a>
<a href="https://opencollective.com/strider/backer/7/website" target="_blank"><img src="https://opencollective.com/strider/backer/7/avatar.svg"></a>
<a href="https://opencollective.com/strider/backer/8/website" target="_blank"><img src="https://opencollective.com/strider/backer/8/avatar.svg"></a>
<a href="https://opencollective.com/strider/backer/9/website" target="_blank"><img src="https://opencollective.com/strider/backer/9/avatar.svg"></a>
<a href="https://opencollective.com/strider/backer/10/website" target="_blank"><img src="https://opencollective.com/strider/backer/10/avatar.svg"></a>
<a href="https://opencollective.com/strider/backer/11/website" target="_blank"><img src="https://opencollective.com/strider/backer/11/avatar.svg"></a>
<a href="https://opencollective.com/strider/backer/12/website" target="_blank"><img src="https://opencollective.com/strider/backer/12/avatar.svg"></a>
<a href="https://opencollective.com/strider/backer/13/website" target="_blank"><img src="https://opencollective.com/strider/backer/13/avatar.svg"></a>
<a href="https://opencollective.com/strider/backer/14/website" target="_blank"><img src="https://opencollective.com/strider/backer/14/avatar.svg"></a>
<a href="https://opencollective.com/strider/backer/15/website" target="_blank"><img src="https://opencollective.com/strider/backer/15/avatar.svg"></a>
<a href="https://opencollective.com/strider/backer/16/website" target="_blank"><img src="https://opencollective.com/strider/backer/16/avatar.svg"></a>
<a href="https://opencollective.com/strider/backer/17/website" target="_blank"><img src="https://opencollective.com/strider/backer/17/avatar.svg"></a>
<a href="https://opencollective.com/strider/backer/18/website" target="_blank"><img src="https://opencollective.com/strider/backer/18/avatar.svg"></a>
<a href="https://opencollective.com/strider/backer/19/website" target="_blank"><img src="https://opencollective.com/strider/backer/19/avatar.svg"></a>
<a href="https://opencollective.com/strider/backer/20/website" target="_blank"><img src="https://opencollective.com/strider/backer/20/avatar.svg"></a>
<a href="https://opencollective.com/strider/backer/21/website" target="_blank"><img src="https://opencollective.com/strider/backer/21/avatar.svg"></a>
<a href="https://opencollective.com/strider/backer/22/website" target="_blank"><img src="https://opencollective.com/strider/backer/22/avatar.svg"></a>
<a href="https://opencollective.com/strider/backer/23/website" target="_blank"><img src="https://opencollective.com/strider/backer/23/avatar.svg"></a>
<a href="https://opencollective.com/strider/backer/24/website" target="_blank"><img src="https://opencollective.com/strider/backer/24/avatar.svg"></a>
<a href="https://opencollective.com/strider/backer/25/website" target="_blank"><img src="https://opencollective.com/strider/backer/25/avatar.svg"></a>
<a href="https://opencollective.com/strider/backer/26/website" target="_blank"><img src="https://opencollective.com/strider/backer/26/avatar.svg"></a>
<a href="https://opencollective.com/strider/backer/27/website" target="_blank"><img src="https://opencollective.com/strider/backer/27/avatar.svg"></a>
<a href="https://opencollective.com/strider/backer/28/website" target="_blank"><img src="https://opencollective.com/strider/backer/28/avatar.svg"></a>
<a href="https://opencollective.com/strider/backer/29/website" target="_blank"><img src="https://opencollective.com/strider/backer/29/avatar.svg"></a>


## Sponsors

Become a sponsor and get your logo on our README on Github with a link to your site. [[Become a sponsor](https://opencollective.com/strider#sponsor)]

<a href="https://opencollective.com/strider/sponsor/0/website" target="_blank"><img src="https://opencollective.com/strider/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/strider/sponsor/1/website" target="_blank"><img src="https://opencollective.com/strider/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/strider/sponsor/2/website" target="_blank"><img src="https://opencollective.com/strider/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/strider/sponsor/3/website" target="_blank"><img src="https://opencollective.com/strider/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/strider/sponsor/4/website" target="_blank"><img src="https://opencollective.com/strider/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/strider/sponsor/5/website" target="_blank"><img src="https://opencollective.com/strider/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/strider/sponsor/6/website" target="_blank"><img src="https://opencollective.com/strider/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/strider/sponsor/7/website" target="_blank"><img src="https://opencollective.com/strider/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/strider/sponsor/8/website" target="_blank"><img src="https://opencollective.com/strider/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/strider/sponsor/9/website" target="_blank"><img src="https://opencollective.com/strider/sponsor/9/avatar.svg"></a>
<a href="https://opencollective.com/strider/sponsor/10/website" target="_blank"><img src="https://opencollective.com/strider/sponsor/10/avatar.svg"></a>
<a href="https://opencollective.com/strider/sponsor/11/website" target="_blank"><img src="https://opencollective.com/strider/sponsor/11/avatar.svg"></a>
<a href="https://opencollective.com/strider/sponsor/12/website" target="_blank"><img src="https://opencollective.com/strider/sponsor/12/avatar.svg"></a>
<a href="https://opencollective.com/strider/sponsor/13/website" target="_blank"><img src="https://opencollective.com/strider/sponsor/13/avatar.svg"></a>
<a href="https://opencollective.com/strider/sponsor/14/website" target="_blank"><img src="https://opencollective.com/strider/sponsor/14/avatar.svg"></a>
<a href="https://opencollective.com/strider/sponsor/15/website" target="_blank"><img src="https://opencollective.com/strider/sponsor/15/avatar.svg"></a>
<a href="https://opencollective.com/strider/sponsor/16/website" target="_blank"><img src="https://opencollective.com/strider/sponsor/16/avatar.svg"></a>
<a href="https://opencollective.com/strider/sponsor/17/website" target="_blank"><img src="https://opencollective.com/strider/sponsor/17/avatar.svg"></a>
<a href="https://opencollective.com/strider/sponsor/18/website" target="_blank"><img src="https://opencollective.com/strider/sponsor/18/avatar.svg"></a>
<a href="https://opencollective.com/strider/sponsor/19/website" target="_blank"><img src="https://opencollective.com/strider/sponsor/19/avatar.svg"></a>
<a href="https://opencollective.com/strider/sponsor/20/website" target="_blank"><img src="https://opencollective.com/strider/sponsor/20/avatar.svg"></a>
<a href="https://opencollective.com/strider/sponsor/21/website" target="_blank"><img src="https://opencollective.com/strider/sponsor/21/avatar.svg"></a>
<a href="https://opencollective.com/strider/sponsor/22/website" target="_blank"><img src="https://opencollective.com/strider/sponsor/22/avatar.svg"></a>
<a href="https://opencollective.com/strider/sponsor/23/website" target="_blank"><img src="https://opencollective.com/strider/sponsor/23/avatar.svg"></a>
<a href="https://opencollective.com/strider/sponsor/24/website" target="_blank"><img src="https://opencollective.com/strider/sponsor/24/avatar.svg"></a>
<a href="https://opencollective.com/strider/sponsor/25/website" target="_blank"><img src="https://opencollective.com/strider/sponsor/25/avatar.svg"></a>
<a href="https://opencollective.com/strider/sponsor/26/website" target="_blank"><img src="https://opencollective.com/strider/sponsor/26/avatar.svg"></a>
<a href="https://opencollective.com/strider/sponsor/27/website" target="_blank"><img src="https://opencollective.com/strider/sponsor/27/avatar.svg"></a>
<a href="https://opencollective.com/strider/sponsor/28/website" target="_blank"><img src="https://opencollective.com/strider/sponsor/28/avatar.svg"></a>
<a href="https://opencollective.com/strider/sponsor/29/website" target="_blank"><img src="https://opencollective.com/strider/sponsor/29/avatar.svg"></a>


## Support & Help

We are responsive to Github Issues - please don't hesitate submitting your issues here!

For live help check out Strider's [Gitter].

[logo]: https://raw.github.com/Strider-CD/strider/master/public/images/top_github.png
[build-img]: http://public-ci.stridercd.com/Strider-CD/strider/badge
[build-link]: https://public-ci.stridercd.com/Strider-CD/strider
[dep-img]: https://david-dm.org/Strider-CD/strider.svg
[dep-link]: https://david-dm.org/Strider-CD/strider
[dev-dep-img]: https://david-dm.org/Strider-CD/strider/dev-status.svg
[dev-dep-link]: https://david-dm.org/Strider-CD/strider#info=devDependencies
[npm-badge-img]: https://badge.fury.io/js/strider.svg
[npm-badge-link]: http://badge.fury.io/js/strider
[backers-badge-img]: https://opencollective.com/strider/backers/badge.svg
[sponsors-badge-img]: https://opencollective.com/strider/sponsors/badge.svg
[screenshot]: /docs/screenshots/dashboard.jpg
[more-screenshots]: https://github.com/Strider-CD/strider/wiki/Screenshots
[mongolab]: https://mongolab.com/plans/pricing/
[mailgun]: http://www.mailgun.com/pricing
[book-intro]: http://strider.readthedocs.org/en/latest/intro.html
[changelog]: https://github.com/Strider-CD/strider/blob/master/CHANGELOG.md
[mongo-download]: http://www.mongodb.org/downloads
[resource-digitalocean]: http://fosterelli.co/creating-a-private-ci-with-strider.html
[resource-plugin-template]: https://github.com/bitwit/strider-template
[resource-panamax-template]: https://github.com/CenturyLinkLabs/panamax-contest-templates/blob/master/stridercd_mrsmith.pmx
[extending]: https://github.com/Strider-CD/strider-extension-loader
[maintainer]: http://frozenridge.co
[strider-cli]: https://github.com/Strider-CD/strider-cli
[github-config]: https://github.com/Strider-CD/strider-github#required-configuration
[bitbucket-config]: https://github.com/Strider-CD/strider-bitbucket#configuration
[gitlab-config]: https://github.com/Strider-CD/strider-gitlab#setup
[heroku-config]: https://github.com/Strider-CD/strider-heroku#important-config
[cc-badge]: https://codeclimate.com/github/Strider-CD/strider/badges/gpa.svg
[cc-badge-link]: https://codeclimate.com/github/Strider-CD/strider
[david-badge]: https://david-dm.org/Strider-CD/strider.svg
[david-badge-link]: https://david-dm.org/Strider-CD/strider
[body-parser]: https://github.com/expressjs/body-parser
[node-gyp]: https://github.com/TooTallNate/node-gyp#installation
[git]: http://git-scm.com/
[nodejs]: http://nodejs.org/
[npm]: https://docs.npmjs.com/getting-started/installing-node
[Gitter]: https://gitter.im/Strider-CD
[travis-badge]: https://travis-ci.org/Strider-CD/strider.svg?branch=master
[travis-badge-link]: https://travis-ci.org/Strider-CD/strider
[gitter-badge]: https://img.shields.io/badge/GITTER-join%20chat-green.svg
[gitter-badge-link]: https://gitter.im/Strider-CD
[apiDoc]: http://apidocjs.com/#getting-started
[resource-strider-futurestudio-tutorials]: https://futurestud.io/blog/strider-getting-started-platform-overview/


