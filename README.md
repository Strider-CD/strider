# ![Strider][logo]

[![NPM][npm-badge-img]][npm-badge-link]
---


### Brilliant Continuous Deployment

![Strider Screenshot][screenshot]
[more screenshots][more-screenshots]


Overview
========

`Strider` is an Open Source Continuous Deployment / Continuous Integration
platform. It is written in Node.JS / JavaScript and uses MongoDB as a backing
store. It is published under the BSD license.

For more details, including features and more, check out the 
[introductory chapter of the Strider Book][book-intro]


## README Contents

- [General requirements](#general-requirements)
- [Docker quickstart](#docker-quickstart)
- [Running on Infrastructure](#running-on-infrastructure)
    - [Configuring](#configuring)
    - [Adding Users](#adding-initial-admin-user)
    - [Starting Strider](#starting-strider)
    - [Heroku](#strider-on-heroku)
- [Require()'ing Strider](#requireing-strider)
- [Extension & plugin guide](#extending--customizing-strider)
- [Support & Help](#support--help)
- [Roadmap / Changelog][roadmap]

## General Requirements

- nodejs, v0.8 or v0.10
- mongodb (local or remote)
- git >= 1.7.10

## Docker Quickstart

`docker pull niallo/strider`

For a fully self-contained and pre-built strider installation, check out
the [Strider Trusted Build][pre-built].

There's a walkthrough of setting it up [on our blog][blog-walkthrough].


## Running on Infrastructure

Make sure you have MongoDB installed on your system. You can get the latest version at [mongodb.org][mongo-download].

Next you will need Node.JS. You can get binary packages for most platforms at [nodejs.org][nodejs].

Once you have Node.JS on your system, you can fetch & install all the dependencies for your Strider clone
by executing the following command in the project root:

```no-highlight
npm install
```

### Configuring

`Strider` configuration comes from environment variables. Most of the default
values should work fine for running on localhost, however for an
Internet-accessible deployment the following variables will need to be exported:

  - `DB_URI` : MongoDB DB URI if not localhost (you can safely use MongoLab free plan - works great)
  - `SERVER_NAME` : Address at which server will be accessible on the Internet. E.g. `https://strider.example.com` (note: no trailing slash)
  - `PLUGIN_GITHUB_APP_ID`, `PLUGIN_GITHUB_APP_SECRET`: Github app ID & secret (assuming not running on localhost:3000) - you can register a new one
  at https://github.com/settings/applications/new - the Main URL should be the same as server name above,
  and the callback URL should be server name with the path /auth/github/callback.
  E.g. https://strider.example.com/auth/github/callback
  - `PLUGIN_BITBUCKET_APP_KEY`, `PLUGIN_BITBUCKET_APP_SECRET`, `PLUGIN_BITBBUCKET_HOSTNAME`: BitBucket app key, secret & server hostname. Needed if you're using BitBucket provider. More info at https://github.com/Strider-CD/strider-bitbucket.

  - If you want email notifications, configure an SMTP server (we recommend Mailgun for SMTP if you need a server - free account gives 200 emails / day):
    - `SMTP_HOST`: SMTP server hostname e.g. smtp.example.com
    - `SMTP_PORT`: SMTP server port e.g. 587 (default)
    - `SMTP_USER`: SMTP auth username e.g. "myuser"
    - `SMTP_PASS`: SMTP auth password e.g. "supersecret"
    - `SMTP_FROM`: Default FROM address e.g. "Strider <noreply@stridercd.com>" (default)


### Adding Initial Admin User

`Strider` isn't much use without an account to login with. Once you create an administrative user, you can invite as many
other people as you like to your instance. There is a simple CLI subcommand to help you create the initial user:

```no-highlight
node bin/strider addUser
```

Example run:

```bash
$ node bin/strider addUser
Enter email []: strider@example.com
Is admin? (y/n) [n]: y
Enter password []: *******

Email:		strider@example.com
Password:	****
isAdmin:	true
OK? (y/n) [y]:
22 Oct 21:21:01 - info: Connecting to MongoDB URL: mongodb://localhost/strider-foss
22 Oct 21:21:01 - info: User added successfully! Enjoy.
```


### Starting Strider

Once `Strider` has been installed and configured, it can be started with:

```no-highlight
node bin/strider
```

### Strider on Heroku

To get up and running quickly on Heroku, you can create a new app and use the
MongoLab free plan.

```no-highlight
heroku create
heroku addons:add mongolab
git push heroku master
heroku open
```

If you want support for languages other than Node.js and Python, you'll need to
set the buildpack for your app. Currently this enables support for Ruby 2.0.0.

```no-highlight
heroku config:add BUILDPACK_URL=https://github.com/ddollar/heroku-buildpack-multi.git
```

## Require()'ing Strider

Strider can be `require()`-ed like any other NPM module. This is particularly useful when you want to

- Make Strider a dependency at a specific version
- Choose exactly which plugins to install
- Customize configuration
- Do other crazy stuff

For example, you could have a project with its own `package.json` that depends
on `strider` at a specific version, along with any other extensions you choose
loaded from a particular filesystem location. Then you could write a simple
initialization shim like the following:

```JavaScript
var strider = require('strider')

var instance = strider("/path/to/extensions/dir", config, function(err, initialized, appInstance) {
    console.log("Strider is now running")
})
```


## Extending & Customizing Strider

Strider is extremely customizable and extensible through plugins. Plugins can add hooks to perform arbitrary actions
during build. They can modify the database schema to add custom fields. They can also register their own HTTP routes. Even
the front-end is highly customizable through template extensions.

For documentation on extending Strider, see [strider-extension-loader][extending]'s README.


## Resources

- [Strider on DigitalOcean][resource-digitalocean] - Covers setting up an Ubuntu machine with Strider using upstart.

## Support & Help

IRC: irc.freenode.net #strider

We are very responsive to Github Issues - please think of them as a message board for the project!

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
[book-intro]: http://strider.readthedocs.org/en/latest/intro.html
[roadmap]: https://github.com/Strider-CD/strider/blob/master/ROADMAP.md
[pre-built]: https://index.docker.io/u/niallo/strider/
[blog-walkthrough]: http://blog.frozenridge.co/docker-and-stridercd-brilliant-continuous-integration-in-a-box/
[mongo-download]: http://www.mongodb.org/downloads
[nodejs]: http://nodejs.org
[resource-digitalocean]: http://fosterelli.co/creating-a-private-ci-with-strider.html
[extending]: https://github.com/Strider-CD/strider-extension-loader
[maintainer]: http://frozenridge.co
