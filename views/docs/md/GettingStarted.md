## Getting Started with Strider

Getting up and running on Strider is very easy. After you create your account, follow the prompts to link your Github account using OAuth2. Strider will then fetch the list of Github repositories for which you have admin rights. Select the initial Github repository that you would like to test (and optionally deploy) with Strider. On the next screen you can add any additional members of the team to the project.

If you would like Strider to deploy to Heroku automatically when tests pass (AKA deploy-on-green), click 'continue to deployment configuration'. You will then need to enter your Heroku API key. You can find your API key about halfway down the '[My Account](https://api.heroku.com/account)' page on Heroku ([why do we need your Heroku API key?](why_heroku_api_key)). Then select from an existing Heroku app or enter the name for a new app. 

The final step is to modify your project so that it will work properly with Strider. This won't take long but is specific to your language and framework, so please click on the appropriate link below.

### I would like to configure my project for...
<br/>

- [Node.js: Continuous Integration](#ci_nodejs)

- [Node.js: Continuous Deployment to Heroku (+ MongoLab/MongoDB)](#cd_nodejs)


- [Django: Continuous Integration](#ci_django)

- [Django: Continuous Deployment to Heroku](#cd_django)


- [Python: Continuous Integration (non-Django)](#ci_python)

- [Python: Continuous Deployment (non-Django) to Heroku](#cd_python)


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

Strider currently supports MongoDB, Redis, PostgreSQL, and SQLite. When your tests run, Strider exports a number of UNIX environment variables which you can use to connect to the test database.

_Note: if your app runs on Heroku and uses Heroku's PostgreSQL service, MongoLab, or Redis To Go, it should run properly on Strider without any modifications as Strider also exports Heroku-compatible environment variables._

Each database is completely private to you, is not shared, and is wiped after each test run.

#### MongoDB:

Here is example code for MongoDB where we check for the presence of a Strider MongoDB environment variable, and if it does not exist, we use the URI value from the config file:

<pre class="prettyprint">
var db_uri = process.env.MONGODB_URI || config.default_db_uri;
</pre>

_MONGOLAB_URI is the Heroku/MongoLab equivalent of Strider's MONGODB_URI. MONGOLAB_URI will also work on Strider._

#### Sample MongoDB Apps
If you aren't sure how to create a database connection from a database URI, have a look at one of our sample apps:

- [BeyondFog/strider-nodejs-mongodb-test](https://github.com/BeyondFog/strider-nodejs-mongodb-test/blob/master/test/test_mongodb.js) - very simple app that connects to MongoDB in the test script 
- [BeyondFog/Poang](https://github.com/BeyondFog/Poang) - sample node.js app built with MongoDB using Express web framework, Mongoose ODM and Everyauth authentication/account plugin.

#### PostgreSQL:

Here is example code for PostgreSQL where we check for the presence of a Strider PostgreSQL environment variable, and if it does not exist, we use the URI value from the config file:

<pre class="prettyprint">
var db_uri = process.env.POSTGRESQL_URI || config.default_db_uri;
</pre>

_DATABASE_URI is the Heroku equivalent of Strider's POSTGRESQL_URI. DATABASE_URI will also work on Strider_

#### Sample PostgreSQL App
If you aren't sure how to create a database connection from a database URI, have a look at the sample app:

- [BeyondFog/strider-nodejs-postgresql-test](https://github.com/BeyondFog/strider-nodejs-mongodb-test/blob/master/test/test_postgresql.js) - very simple app that connects to PostgreSQL in the test script

#### Redis:

Here is example code for Redis where we check for the presence of a Strider Redis environment variable, and if it does not exist, we use the URI value from the config file:

<pre class="prettyprint">
var db_uri = process.env.REDIS_URI || config.default_db_uri;
</pre>

_REDISTOGO_URL is the Heroku equivalent of Strider's REDIS_URL. REDISTOGO_URL will also work on Strider_

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
    
### Database Connectivity

We have provided the Heroku environment variables to connect to each type of database. Your app needs to use those environment variables in order to run properly on Heroku.


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

<h2 id="ci_django" class="docs-section">Getting Started: Continuous Integration for Django</h2>

### VirtualEnv

Strider creates a new VirtualEnv environment for each test run. Package dependencies are installed into the fresh VirtualEnv via pip.

### requirements.txt

Strider will run 'pip install -r requirements.txt' to install all of the required Python modules for your project. If you don't yet have a requirements.txt file, run 'pip freeze > requirements.txt' to create one.

### manage.py test

Strider will kick off your tests by executing the standard Django command: 'python manage.py test'. 

## Database Connectivity

### PostgreSQL & SQLite

Most Django projects use a relational database such as PostgreSQL or SQLite. If your project uses one or both of these databases, the easiest way to modify your project to work with Strider is to use [Kenneth Reitz](http://kennethreitz.com/)'s excellent module [dj-database-url](https://crate.io/packages/dj-database-url/) ([github](https://github.com/kennethreitz/dj-database-url)). 

Add the following to your settings.py file:

<pre class="prettyprint">
import dj_database_url
DATABASES = {'default': dj_database_url.config(default='postgres://localhost')}
</pre>

If you use SQLite on your dev box, you can use the following format for the default db location:

<pre class="prettyprint">
sqlite:////full/path/to/your/database/file.sqlite
</pre>

### MongoDB and Redis

Strider also supports the use of MongoDB or Redis with Django. For these databases, you will generally want to use a 'try' block with the env variables and then an 'except' block for the default values if the env variables are not present. 

Are you using MongoDB or Redis with Django and need help configuring your project for use with Strider? Email us at support@striderapp.com and we will get you up and running as quickly as possible.

<h2 id="cd_django" class="docs-section">Getting Started: Continuous Deployment for Django</h2>

Once you have finished setting up your Django Project for continuous integration with Strider, you are only a few steps away from continuous deployment to Heroku.

### Production-ready Webserver

Heroku recommends that you use gunicorn as a production webserver. In order to use gunicorn, you will need to:

1. Add gunicorn to requirements.txt
2. Update dependencies with 'pip install -r requirements.txt'
3. Add to 'INSTALLED_APPS' in 'settings.py': 'guincorn',
4. Create a Procfile with the following text:


<pre class="prettyprint">
web: gunicorn [djangoprojectname].wsgi -b 0.0.0.0:$PORT
</pre>

### SyncDB & Migrate

Strider will automatically run 'syncdb' and 'migrate' after each push to Heroku.

### Sample Project: Klingsbo

Klingsbo ([github](https://github.com/beyondfog/Klingsbo)) is a very basic Django project that works with Strider and Heroku. 

### Deploy on Green

Once you have added a Procfile and have setup dj_database_url (or properly configured your project with the env variables for MongoDB or Redis), your project should be ready to go for continuous deployment to Heroku. By default, Strider will deploy to Heroku on green, ie if all of the tests pass.

If you would prefer to only deploy to Heroku on demand, you can turn off 'deploy on green' in the project configuration settings.

Once you turn off 'deploy on green', Strider will deploy the project to Heroku ONLY when you manually trigger a 'test and deploy' job from the Strider interface.

### More Information

For more information on how to configure a Django project to work with Heroku, see [Getting Started with Django on Heroku/Cedar](https://devcenter.heroku.com/articles/django).


<h2 id="ci_python" class="docs-section">Getting Started: Continuous Integration for Python (non-Django projects)</h2>

### setup.py test

Strider will kick off your tests by executing the standard Python command: 'python setup.py test'.

### Database Connectivity:

Strider currently supports MongoDB, Redis, PostgreSQL, and SQLite. When your tests run, Strider exports a number of UNIX environment variables which you can use to connect to the test database.

_Note: if your app runs on Heroku and uses Heroku's PostgreSQL service, MongoLab, or Redis To Go, if your app already connects to one of these databases on Heroku, it should run properly on Strider without any modifications as Strider also exports Heroku-compatible environment variables._

Each database is completely private to you, is not shared, and is wiped after each test run.

#### MongoDB:

Here is example code for MongoDB where we check for the presence of a Strider MongoDB environment variable, and if it does not exist, we use the URI value from the config file:

<pre class="prettyprint">
mongodb_uri = os.getenv('MONGODB_URI', "mongodb://localhost/testdb");
</pre>

_MONGOLAB_URI is the Heroku/MongoLab equivalent of Strider's MONGODB_URI. MONGOLAB_URI will also work on Strider._

If you aren't sure how to create a database connection from a database URI, have a look at the sample app:

- [BeyondFog/strider-python-mongodb-test](https://github.com/BeyondFog/strider-python-mongodb-test) - very simple app that connects to MongoDB in the test script

#### PostgreSQL:

Here is example code for PostgreSQL where we check for the presence of a Strider PostgreSQL environment variable, and if it does not exist, we use the URI value from the config file:

<pre class="prettyprint">
database_uri = os.getenv('POSTGRESQL_URI', "postgres://localhost/testdb");
</pre>

_DATABASE_URI is the Heroku equivalent of Strider's POSTGRESQL_URI. DATABASE_URI will also work on Strider_


#### Redis:

Here is example code for Redis where we check for the presence of a Strider Redis environment variable, and if it does not exist, we use the URI value from the config file:

<pre class="prettyprint">
redisdb_uri = os.getenv('REDIS_URI', "redis://localhost/testdb");
</pre>

_REDISTOGO_URL is the Heroku equivalent of Strider's REDIS_URL. REDISTOGO_URL will also work on Strider_

<h2 id="cd_python" class="docs-section">Getting Started: Continuous Deployment for Python (non-Django projects)</h2>

Once you have finished setting up your Python app for continuous integration with Strider, you are only a few steps away from continuous deployment to Heroku.

### Procfile

Heroku requires that you have a Procfile with the command to start your web app. It should look like this:

<pre class="prettyprint">
web: python app.py
</pre>

### Production-ready Webserver

Heroku recommends that you use gunicorn as a production webserver. In order to use gunicorn, you will need to add it to requirements.txt and modify the procfile to the following:

<pre class="prettyprint">
web: gunicorn app:app -b 0.0.0.0:$PORT -w 3
</pre>

### Deploy on Green

Once you have added a Procfile and confirmed that you are using the Heroku environment variables, your app should be ready to go for continuous deployment to Heroku. By default, Strider will deploy to Heroku on green, ie if all of the tests pass.

If you would prefer to only deploy to Heroku on demand, you can turn off 'deploy on green' in the project configuration settings.

Once you turn off 'deploy on green', Strider will deploy the project to Heroku ONLY when you manually trigger a 'test and deploy' job from the Strider interface.

### More Information

For more information on how to configure a Python project to work with Heroku, see [Getting Started with Python on Heroku/Cedar](https://devcenter.heroku.com/articles/python).
