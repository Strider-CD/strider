
## Why does Strider need my Heroku API Key?

Strider uses your Heroku API key to perform the following tasks:

- Pull in your list of existing Heroku apps
- Create a new Heroku app
- Setup a deploy key so that Strider can push code changes to Heroku

We will soon be adding additional functionality to automatically run db migrations on each push for projects using PostgreSQL. This will also be done via the Heroku API.

Strider will never access or modify your Heroku account or any of the associated Heroku apps without your permission. Nevertheless, for additional security, it is possible to limit Strider's access to only one app. To do this, create a new Heroku account (if you use gmail and your email addr is example@gmail.com, you can take advantage of gmails '+' functionality and use example+appname@gmail.com). Then add that account as a collaborator on your app via Heroku Toolbelt:

    heroku sharing:add example+appname@gmail.com

Now that you have added example+appname@gmail.com as a collaborator, login to Heroku as example+appname@gmail.com and use that API key with Strider.

_See the Heroku doc [Collaborating with Others](https://devcenter.heroku.com/articles/sharing) for more information on Heroku's collaboration functionality._
