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
* An emphasis on extensibility
* Out-of-the-box support for Node.JS, Python/Django projects and Selenium/Sauce Labs tests
* Commercial support, consulting & hosting available


Running on Heroku
=================

`Strider` can be deployed to Heroku easily, with minimal configuration, using a
free MongoDB database add-on from MongoLab and a free SMTP server add-on from
SendGrid or MailGun.

- Register for a free Heroku account at http://heroku.com
- Install the Heroku toolbelt on your machine from https://toolbelt.heroku.com
- Clone this repository
- `cd` into the clone and log into Heroku:
    `heroku login`
- Create a new Heroku app for Strider:
    `heroku create`
- Edit `config.js` and set the following values:
  - Server name. Address at which server will be accessible on the Internet. E.g. https://mystrider.herokuapp.com/
  - Github app id & secret for your Heroku app - you can register a new one 
  at https://github.com/settings/applications/new - the Main URL should be the same as server name above,
  and the callback URL should be server name with the path /auth/github/callback.
  E.g. https://mystrider.herokuapp.com/auth/github/callback
- Commit the `config.js` changes locally:
    `git commit -m'add my config' config.js`
- Provision a free MongoDB database:
    `heroku addons:add mongolab:starter`
- Provision a free SendGrid SMTP server:
    `heroku addons:add sendgrid:starter`
- Deploy Strider:
    `git push heroku master`
- Your personal Strider instance is now running on the Internet! Visit it.

Example session:

```bash

$ git clone git@github.com:Strider-CD/strider.git
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
$ heroku create
Creating intense-reef-4414... done, stack is cedar
http://intense-reef-4414.herokuapp.com/ | git@heroku.com:intense-reef-4414.git
Git remote heroku added
$ vim config.js
$ commit -m'add my config' config.js
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
```


Running on Infrastructure
=========================

Make sure you have MongoDB installed on your system. You can get the latest version at
http://www.mongodb.org/downloads

Next you will need Node.JS. You can get binary packages for most platforms at
http://nodejs.org

Once you have Node.JS on your system, you can fetch & install all the dependencies for Strider
by executing::

    npm install


Configuring
===========

`Strider` configuration is stored in the `config.js` file. Most of the default
values should work fine for running on localhost, however for an
Internet-accessible deployment the following values will need to be configured:

- In `config.js` file you'll need to set:

  - MongoDB DB URI if not localhost (you can safely use MongoLab free plan - works great)
  - Server name. Address at which server will be accessible on the Internet. E.g. https://strider.example.com/
  - Github app id & secret (assuming not running on localhost:3000) - you can register a new one 
  at https://github.com/settings/applications/new - the Main URL should be the same as server name above,
  and the callback URL should be server name with the path /auth/github/callback.
  E.g. https://strider.example.com/auth/github/callback
  - Sendgrid credentials (for SMTP - free account is fine). Soon you will be able to specify any SMTP server, not just Sendgrid.

Executing
=========

Once `Strider` has been installed and configured, it can be started with::

    node bin/strider

Support & Help
==============

IRC: irc.freenode.org #strider

Google Group: https://groups.google.com/d/forum/strider-users

For commercial support & hosting enquiries please email sales@beyondfog.com

Tests
=====

`Strider` tests live in the `test` subdirectory. They are written using `should.js`
BDD-style and utilize the Mocha test framework and `sinon.js` test library.

http://visionmedia.github.com/mocha/

http://sinonjs.org

To start the tests, just run::

    npm test

