# ![Strider][logo]

[![NPM][npm-badge-img]][npm-badge-link]  
[![Code Climate][cc-badge]][cc-badge-link] [![Dependency Status][david-badge]][david-badge-link] [![Build Status][travis-badge]][travis-badge-link]

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

## README Contents

- [General requirements](#general-requirements)
- [Running on Infrastructure](#running-on-infrastructure)
    - [Configuring](#configuring)
    - [Adding Users](#adding-initial-admin-user)
    - [Starting Strider](#starting-strider)
    - [Heroku](#strider-on-heroku)
    - [Docker](#strider-in-docker)
- [Advanced Topics](#advanced-topics)
- [Support & Help](#support--help)
- [Roadmap / Changelog][roadmap]

## General Requirements

- [nodejs] >= v0.10
- [npm] >= 2.0
- [git] >= 2.0
- [mongodb][mongo-download] (local or remote)
- [node-gyp]

_Note: Installing on OS X might require XCode to be installed._


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

  - `SERVER_NAME` - Required; Address at which server will be accessible on the Internet. E.g. `https://strider.example.com` (note: no trailing slash)
  - `HOST` - Host where strider listens, optional (defaults to 0.0.0.0).
  - `PORT` - Port that strider runs on, optional (defaults to 3000).
  - `DB_URI` - MongoDB DB URI if not localhost (you can safely use [MongoLab free plan][mongolab] - works great)
  - `HTTP_PROXY` - Proxy support, optional (defaults to null)
  - If you want email notifications, configure an SMTP server (we recommend [Mailgun] for SMTP if you need a server - free account gives 200 emails / day):
    - `SMTP_HOST` - SMTP server hostname e.g. smtp.example.com
    - `SMTP_PORT` - SMTP server port e.g. 587 (default)
    - `SMTP_USER` - SMTP auth username e.g. "myuser"
    - `SMTP_PASS` - SMTP auth password e.g. "supersecret"
    - `SMTP_FROM` - Default FROM address e.g. "Strider <noreply@stridercd.com>" (default)

#### Additional Configurations

- `BODY_PARSER_LIMIT` - Increase the maximum payload size that our [body parser][body-parser] will attempt to parse. Useful for github web hooks.

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

- [Strider on DigitalOcean][resource-digitalocean] - Covers setting up an Ubuntu machine with Strider using upstart.
- [Strider plugin template][resource-plugin-template] - Simple setup for getting started with your own plugin.
- [Panamax Strider template][resource-panamax-template] - Strider template for use with Panamax.


## Advanced Topics

Advanced topics are located in the [Wiki](https://github.com/Strider-CD/strider/wiki), here's a small
subset of what's covered:

- [Requiring Strider](https://github.com/Strider-CD/strider/wiki/Requiring-Strider)
- [Managing Plugins](https://github.com/Strider-CD/strider/wiki/Managing-Plugins)

## Support & Help

We are very responsive to Github Issues - please think of them as a message board for the project!

### IRC Channel

You can find us on [irc.freenode.net in #strider][irc].

If nobody is responding, don't leave immediately. Someone will eventually respond. If you don't want to wait please create a Github issue! Many Strider contributors don't use IRC at all, but will respond pretty quickly to new Github Issues.

For a view of what's going on with the project, check out our boards by setting up [ZenBoard] and visiting the "Boards" page.

### Commercial Support

Strider is maintained and supported by [FrozenRidge,
LLC][maintainer]. For commercial support, customization, integration
& hosting enquiries please email hi@frozenridge.co.


[logo]: https://raw.github.com/Strider-CD/strider/master/public/images/top_github.png
[build-img]: http://public-ci.stridercd.com/Strider-CD/strider/badge
[build-link]: https://public-ci.stridercd.com/Strider-CD/strider
[dep-img]: https://david-dm.org/Strider-CD/strider.svg
[dep-link]: https://david-dm.org/Strider-CD/strider
[dev-dep-img]: https://david-dm.org/Strider-CD/strider/dev-status.svg
[dev-dep-link]: https://david-dm.org/Strider-CD/strider#info=devDependencies
[npm-badge-img]: https://nodei.co/npm/strider.svg?downloads=true&stars=true
[npm-badge-link]: https://nodei.co/npm/strider/
[screenshot]: /docs/screenshots/dashboard.jpg?raw=true
[more-screenshots]: https://github.com/Strider-CD/strider/wiki/Screenshots
[mongolab]: https://mongolab.com/plans/pricing/
[mailgun]: http://www.mailgun.com/pricing
[book-intro]: http://strider.readthedocs.org/en/latest/intro.html
[roadmap]: https://github.com/Strider-CD/strider/blob/master/ROADMAP.md
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
[ZenBoard]: https://www.zenhub.io/
[irc]: https://www.irccloud.com/#!/ircs://irc.freenode.net:6697/%23strider
[travis-badge]: https://travis-ci.org/Strider-CD/strider.svg
[travis-badge-link]: https://travis-ci.org/Strider-CD/strider
