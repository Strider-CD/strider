![Strider Screenshot](http://unworkable.org/~niallo/strider3.png)

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
* Coming soon: Ruby/Rails, JVM languages, PHP and more

## README Contents

- [Manual Install to Heroku](#heroku)
    - [Sample Heroku Deploy](#heroku-sample)
- [Running on Infrastructure](#infrastructure)
    - [Configuring](#configuring)
    - [Adding Users](#adduser)
    - [Starting Strider](#startup)
- [Support & Help](#support)
- [Getting Started with Strider Guide](#gettingstarted)
    - [Node.js: Continuous Integration](#getting-started-continuous-integration-for-nodejs)
    - [Node.js: Continuous Deployment to Heroku (+ MongoLab/MongoDB)](#getting-started-continuous-deployment-for-nodejs)

<a name="heroku" />
Manual install to Heroku
========================

Alternatively if you don't want to use the web installer, `Strider` can be
deployed to Heroku easily, with minimal configuration, using a free MongoDB
database add-on from MongoLab and a free SMTP server add-on from SendGrid or
MailGun. 

**Note**: At this this time due to Heroku platform
restrictions, Sauce Labs tests can not run correctly when Strider is deployed
on Heroku. Heroku have a fix which removes this restriction, but it is unknown
when they will make it available to the general public.

- Register for a free Heroku account at http://heroku.com
- Install the Heroku toolbelt on your machine from https://toolbelt.heroku.com
- Clone this repository:
  `git clone https://github.com/Strider-CD/strider.git`
- `cd` into the clone and log into Heroku:
    `heroku login`
- Create a new Heroku app w/ custom buildpack (enables native NPM modules to be built) for Strider:
    `heroku create --stack cedar --buildpack https://github.com/Strider-CD/heroku-buildpack-nodejs`
- Export environment variables for the following values:
  - Server name. Address at which server will be accessible on the Internet. E.g. https://mystrider.herokuapp.com/
  - Github app id & secret for your Heroku app - you can register a new one 
  at https://github.com/settings/applications/new - the Main URL should be the same as server name above,
  and the callback URL should be server name with the path /auth/github/callback.
  E.g. https://mystrider.herokuapp.com/auth/github/callback
- Provision a free MongoDB database:
    `heroku addons:add mongolab:starter`
- Provision a free SendGrid SMTP server:
    `heroku addons:add sendgrid:starter`
- Deploy Strider:
    `git push heroku master`
- Add an initial (admin) user:
    `heroku run bin/node bin/strider adduser`
- Your personal Strider instance is now running on the Internet! Visit it and log in with the email & password you just created an account for.

<a name="heroku-sample" />
Example session:

```bash

$ git clone https://github.com/Strider-CD/strider.git
Cloning into 'strider'...
remote: Counting objects: 558, done.
remote: Compressing objects: 100% (409/409), done.
remote: Total 558 (delta 211), reused 480 (delta 133)
Receiving objects: 100% (558/558), 546.24 KiB | 630 KiB/s, done.
Resolving deltas: 100% (211/211), done.
$ cd strider/
$ heroku login
Enter your Heroku credentials.
Email: foo@example.com
Password (typing will be hidden): 
Authentication successful.
$ heroku create --stack cedar --buildpack https://github.com/Strider-CD/heroku-buildpack-nodejs
Creating intense-reef-4414... done, stack is cedar
http://intense-reef-4414.herokuapp.com/ | git@heroku.com:intense-reef-4414.git
Git remote heroku added
$ export DB_URI="mongodb://foo:bar@mongoserver"
$ heroku addons:add mongolab:starter
Adding mongolab:starter on intense-reef-4414... done, v2 (free)
Welcome to MongoLab.
Use `heroku addons:docs mongolab:starter` to view documentation.
$ heroku addons:add sendgrid:starter
Adding sendgrid:starter on intense-reef-4414... done, v3 (free)
Use `heroku addons:docs sendgrid:starter` to view documentation.
$ git push heroku master
<... lots of deploy output ... >
-----> Building runtime environment
-----> Discovering process types
       Procfile declares types -> web
-----> Compiled slug size is 32.7MB
-----> Launching... done, v5
       http://intense-reef-4414.herokuapp.com deployed to Heroku

To git@heroku.com:intense-reef-4414.git
 * [new branch]      master -> master
$ heroku run bin/node bin/strider adduser
Running `bin/node bin/strider adduser` attached to terminal... up, run.1
Enter email []: niallo@example.com
Is admin? (y/n) [n]: y
Enter password []: *******

Email:		niallo@example.com
Password:	****
isAdmin:	true
OK? (y/n) [y]:
23 Oct 04:00:18 - info: Connecting to MongoDB URL: mongodb://heroku_app:secret@dsfoo.mongolab.com:39707/heroku_app8501609
23 Oct 04:00:18 - info: User added successfully! Enjoy.
```


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
  - `SERVER_NAME` : Address at which server will be accessible on the Internet. E.g. https://strider.example.com/
  - `GITHUB_APP_ID`, `GITHUB_APP_SECRET`: Github app ID & secret (assuming not running on localhost:3000) - you can register a new one 
  at https://github.com/settings/applications/new - the Main URL should be the same as server name above,
  and the callback URL should be server name with the path /auth/github/callback.
  E.g. https://strider.example.com/auth/github/callback
  
  If you want email notifications, configure an SMTP server (we recommend Mailgun for SMTP if you need a server - free account gives 200 emails / day):
  - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`


<a name="adduser" />
Adding Initial Admin User
=========================


`Strider` isn't much use without an account to login with. Once you create an administrative user, you can invite as many
other people as you like to your instance. There is a simple CLI subcommand to help you create the initial user:

    node bin/strider adduser

Example run:

```bash
$ node bin/strider adduser
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

<a name="support" />
Support & Help
==============


IRC: irc.freenode.net #strider

Google Group: https://groups.google.com/d/forum/strider-users

For commercial support & hosting enquiries please email hello@stridercd.com

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
