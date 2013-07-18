# ![Strider Logo](https://raw.github.com/Strider-CD/strider/passportAuth/public/images/logo-100x100.png) Strider

[![Build Status](https://travis-ci.org/Strider-CD/strider.png)](https://travis-ci.org/Strider-CD/strider)
[![Dependency Status](https://david-dm.org/Strider-CD/strider.png)](https://david-dm.org/Strider-CD/strider)
[![devDependency Status](https://david-dm.org/Strider-CD/strider/dev-status.png)](https://david-dm.org/Strider-CD/strider#info=devDependencies)

---


![Strider Screenshot](http://unworkable.org/~niallo/strider3.png)
[![NPM](https://nodei.co/npm/strider.png)](https://nodei.co/npm/strider/)

Overview
========

`Strider` is an Open Source Continuous Deployment / Continuous Integration
platform. It is written in Node.JS / JavaScript and uses MongoDB as a backing
store. It is published under the BSD license.

`Strider` is conceptually similar to Travis-CI or Jenkins with the following
major differences:

* A focus on Continuous Deployment rather than just Continuous Integration
* Designed to be easy to install & setup
* Deployable & usable on Heroku free plan
* Intended for deployment on private infrastructure
* An emphasis on extensibility. Plugins are powerful, easy to write and simple to install.
* Out-of-the-box support for projects written in Node.JS, Python (generic and Django/Pyramid) and Selenium/Sauce Labs tests
* Commercial support, consulting & hosting available

## README Contents

- [Docker quickstart](#docker-quickstart)
- [Running on Infrastructure](#infrastructure)
    - [Configuring](#configuring)
    - [Adding Users](#adduser)
    - [Starting Strider](#startup)
- [Require()'ing Strider](#library)
- [Extension & plugin guide](#extensions)
- [Support & Help](#support)
- [Getting Started with Strider Guide](#gettingstarted)
    - [Node.js: Continuous Integration](#getting-started-continuous-integration-for-nodejs)
    - [Node.js: Continuous Deployment to Heroku (+ MongoLab/MongoDB)](#getting-started-continuous-deployment-for-nodejs)
    - [strider-custom.json configuration](#strider-customjson-configuration)

<a name="docker-quickstart" />
## Docker Quickstart
For a fully self-contained and pre-built strider installation, check out [Strider in a box](https://github.com/Strider-CD/strider-dockerfile#docker--strider--winning), made possible by the incredible [docker](http://docker.io) project.


<a name="infrastructure" />
Running on Infrastructure
=========================

Make sure you have MongoDB installed on your system. You can get the latest version at
http://www.mongodb.org/downloads

Next you will need Node.JS. You can get binary packages for most platforms at
http://nodejs.org

Once you have Node.JS on your system, you can fetch & install all the dependencies for your Strider clone
by executing the following command in the project root:

    npm install

<a name="configuring" />
Configuring
===========

`Strider` configuration comes from environment variables. Most of the default
values should work fine for running on localhost, however for an
Internet-accessible deployment the following variables will need to be exported:

  - `DB_URI` : MongoDB DB URI if not localhost (you can safely use MongoLab free plan - works great)
  - `SERVER_NAME` : Address at which server will be accessible on the Internet. E.g. `https://strider.example.com` (note: no trailing slash)
  - `GITHUB_APP_ID`, `GITHUB_APP_SECRET`: Github app ID & secret (assuming not running on localhost:3000) - you can register a new one 
  at https://github.com/settings/applications/new - the Main URL should be the same as server name above,
  and the callback URL should be server name with the path /auth/github/callback.
  E.g. https://strider.example.com/auth/github/callback
  
  - If you want email notifications, configure an SMTP server (we recommend Mailgun for SMTP if you need a server - free account gives 200 emails / day):
    - `SMTP_HOST`: SMTP server hostname e.g. smtp.example.com
    - `SMTP_PORT`: SMTP server port e.g. 587 (default)
    - `SMTP_USER`: SMTP auth username e.g. "myuser"
    - `SMTP_PASS`: SMTP auth password e.g. "supersecret"


<a name="adduser" />
Adding Initial Admin User
=========================

`Strider` isn't much use without an account to login with. Once you create an administrative user, you can invite as many
other people as you like to your instance. There is a simple CLI subcommand to help you create the initial user:

    node bin/strider addUser

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


<a name="startup" />
Starting Strider
================


Once `Strider` has been installed and configured, it can be started with:

    node bin/strider

<a name="library" />
Require()'ing Strider 
=====================

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

<a name="extensions" />
Extending & Customizing Strider 
===============================

Strider is extremely customizable and extensible through plugins. Plugins can add hooks to perform arbitrary actions
during build. They can modify the database schema to add custom fields. They can also register their own HTTP routes. Even
the front-end is highly customizable through template extensions.

For documentation on extending Strider, see [strider-extension-loader](https://github.com/Strider-CD/strider-extension-loader)'s README.

<a name="support" />
Support & Help
==============


IRC: irc.freenode.net #strider

We are very responsive to Github Issues - please think of them as a message board for the project!

Strider is maintained and supported by [FrozenRidge,
LLC](http://frozenridge.co). For commercial support, customization, integration
& hosting enquiries please email hi@frozenridge.co.


<a name="gettingstarted" />
Getting Started With Strider
============================

Getting a project up and running on Strider is very easy. After you create your account, follow the prompts to link your Github account using OAuth2. Strider will then fetch the list of Github repositories for which you have admin rights. Select the initial Github repository that you would like to test (and optionally deploy) with Strider. On the next screen you can add any additional members of the team to the project.

If you would like Strider to deploy to Heroku automatically when tests pass (AKA deploy-on-green), click 'continue to deployment configuration'. You will then need to enter your Heroku API key. You can find your API key about halfway down the '[My Account](https://api.heroku.com/account)' page on Heroku. Then select from an existing Heroku app or enter the name for a new app. 

The final step is to modify your project so that it will work properly with Strider. This won't take long but is specific to your language and framework, so please click on the appropriate link below.

### I would like to configure my project for...

- [Node.js: Continuous Integration](#getting-started-continuous-integration-for-nodejs)

- [Node.js: Continuous Deployment to Heroku (+ MongoLab/MongoDB)](#getting-started-continuous-deployment-for-nodejs)

<h2 id="ci_nodejs" class="docs-section">Getting Started: Continuous Integration for node.js</h2>

### npm install

Strider will run ['npm install'](http://npmjs.org/doc/install.html) to install all of your packages as specified in [package.json](http://npmjs.org/doc/json.html) and [npm-shrinkwrap.json](http://npmjs.org/doc/shrinkwrap.html) (if present).

### npm test / package.json

Once all of the modules are installed, Strider will run the command ['npm test'](http://npmjs.org/doc/test.html) to execute your node.js automated tests. npm will look for a [scripts key](http://npmjs.org/doc/scripts.html) in packages.json that should look something like this:

<pre class="prettyprint">
"scripts": {
  "test": "node_modules/mocha/bin/mocha -R tap"
} 
</pre>

We are using [Mocha](http://visionmedia.github.com/mocha/) in this example but any test framework will work as long as it can be called from the command line.

### Database Connectivity

When your tests run, Strider exports a number of UNIX environment variables which you can use to connect to the test database. Strider supports setting environment variables per-project. Simply browse to the "Environment" tab on the project config page to set these:

![Strider Environment Config Screenshot](http://unworkable.org/~niallo/strider4.png)

#### MongoDB:

Specify the url with the environment variable `DB_URI`

#### Sample MongoDB Apps
If you aren't sure how to create a database connection from a database URI, have a look at one of our sample apps:

- [BeyondFog/strider-nodejs-mongodb-test](https://github.com/BeyondFog/strider-nodejs-mongodb-test/blob/master/test/test_mongodb.js) - very simple app that connects to MongoDB in the test script 
- [BeyondFog/Poang](https://github.com/BeyondFog/Poang) - sample node.js app built with MongoDB using Express web framework, Mongoose ODM and Everyauth authentication/account plugin.


#### Sample PostgreSQL App

If you aren't sure how to create a database connection from a database URI, have a look at the sample app:

- [BeyondFog/strider-nodejs-postgresql-test](https://github.com/BeyondFog/strider-nodejs-mongodb-test/blob/master/test/test_postgresql.js) - very simple app that connects to PostgreSQL in the test script

#### Sample Redis App
If you aren't sure how to create a database connection from a database URI, have a look at this sample app:

- [BeyondFog/strider-nodejs-redis-test](https://github.com/BeyondFog/strider-nodejs-mongodb-test/blob/master/test/test_redis.js) - very simple app that connects to Redis in the test script

<h2 id="cd_nodejs" class="docs-section">Getting Started: Continuous Deployment for node.js</h2>

Once you have finished setting up your node.js app for continuous integration with Strider, you are only a few steps away from continuous deployment to [Heroku](http://heroku.com).

### Procfile

Heroku requires that you have a [Procfile](https://devcenter.heroku.com/articles/procfile) with the command to start your web app. It should look like this:

<pre class="prettyprint">
web: node app.js
</pre>
    
### MongoLab Addon (MongoDB in Heroku)

If you would like to use the (free) [MongoLab addon](https://addons.heroku.com/mongolab) with your app, you will need to use the [Heroku Toolbelt](https://toolbelt.heroku.com/) from your command line to add it to your project. After the Heroku app has been created (either by Strider or via the command line), run the following command:

<pre class="prettyprint">
heroku addons:add mongolab:starter --app [your_app_name]
</pre>
    
### Deploy on Green

Once you have added a Procfile and confirmed that you are using the Heroku environment variables, your app should be ready to go for continuous deployment to Heroku. By default, Strider will deploy to Heroku on green, ie if all of the tests pass.

If you would prefer to only deploy to Heroku on demand, you can turn off 'deploy on green' in the project configuration settings.

Once you turn off 'deploy on green', Strider will deploy the project to Heroku ONLY when you manually trigger a 'test and deploy' job from the Strider interface.

## More Information

For more information on how to configure a node.js app to work on Heroku, see [Getting Started with Node.js on Heroku/Cedar](https://devcenter.heroku.com/articles/nodejs).

<h2 id="cd_nodejs" class="docs-section">strider-custom.json configuration</h2>
[Strider-custom](https://github.com/Strider-CD/strider-custom) is a plugin that comes bundled with strider and allows you to specify custom prepare, test, and deploy scripts via a `strider-custom.json` file in your project, similar to a `.travis.yml` file for travis-ci.

Example:

```json
{
  "prepare": "echo executed prepare statement!",
  "test": "echo executed deploy statement!",
  "deploy": "echo deploy && git push heroku master --force"
}
```

