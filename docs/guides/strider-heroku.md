# Continuous Deployment to Heroku

At Future Studio we use Strider in production to test our code and deploy it right away when all lights are green. The deployment from Strider to Heroku can be done easily using the plugin to connect both plattforms.

Before we start, let’s have a look at other articles in this series of Strider posts.

—
**TODO**: add outline
—

## Create Heroku API Client
Access and deploy projects to Heroku requires either the command line interface or an application. We use the second and deploy the projects code from Strider right after successful integration.

First, go to your Heroku Profile settings and click the tab [**Applications**](https://dashboard.heroku.com/account/applications). Create a new API Client by clicking the button **Register New API Client**.

![Heroku Application Settings — Register New API Client]()

Type your application name and callback url. The callback url is your Strider domain concatenated with `ext/heroku/oauth/callback`. Complete example

	https://your.strider.url/ext/heroku/oauth/callback

![Heroku Create New API Client]()

Creating the API client provides a **client id** and **client secret**. Both information are needed in the server configuration part of this guide.


## Create Heroku Application
The Heroku API client is the first step. Second, we need to create a new heroku application, the one that finally is available through the internet. Visit to the [Heroku application overview](https://dashboard.heroku.com/apps) and click the **+** (plus) icon in the upper right corner.

![Heroku — Create Application]()

Type the application name and deployment region and click **Create App**. 

That’s the Heroku part. We’ve created an API client for later access of your applications. Additionally, we’ve created a new application to deploy our code to the app.


## Configure Strider Server
In our previous post about Strider’s configuration options we showed you how to add new values to the platform and its plugins. If you read the integration guide for GitHub or BitBucket, you already know the steps to take for Heroku configuration. If not, don’t worry, we’ve got you covered.

The [strider-heroku](https://github.com/Strider-CD/strider-heroku) plugin doesn’t recognize the configuration options from `.striderrc` file. You have to provide them via environment variables.

The Heroku plugin uses variables `PLUGIN_HEROKU_CLIENT_ID` and `PLUGIN_HEROKU_CLIENT_SECRET` for configuration.

![Heroku Application Details — Client ID and Client Secret]()

Stop your Strider server, change your existing configuration and add both fields for Heroku:

	…
	export PLUGIN_HEROKU_CLIENT_ID=„your-heroku-client-id
	export PLUGIN_HEROKU_CLIENT_SECRET=„your-heroku-client-secret“

Now start strider and the Heroku plugin will detect the newly set configuration values.

Your Strider server is configured, now we head over to install the Heroku plugin and add your Heroku account.


## Install Strider-Heroku Plugin
To install the [strider-heroku](https://github.com/Strider-CD/strider-heroku) plugin, head over to the plugin   section in Strider’s admin panel.

![Strider Plugin Overview]()

Search for **Heroku** and click **Install** if the plugin isn’t already installed.


## Connect Strider with Heroku
To enable Heroku deployments you have to allow Strider to access your Heroku applications. To do so, visit your account page and click the **Heroku** tab in the left sidebar. Now connect your Heroku account by clicking the **Add a Heroku Account** button.

![Add Heroku Account to Strider]()

You’ll be asked by Heroku to allow **My Strider Client** access for your Heroku applications. Strider will get full read and write access to your apps.

![Heroku API Authorization for Strider]()

Click **Allow** and you’ll be redirected to your Strider account and Heroku tab. The overview shows the SSH keys which got added to Heroku and are authorized for deployments.

![Strider Account — Heroku Overview]()


## Continuous Deployment to Heroku
We’re almost done, just another configuration to finally enable Heroku deployments for your project.

Visit the configuration page of the project you want to deploy to Heroku. Drag and drop the Heroku plugin from from **Available Plugins** to **Active Plugins**.

![Active Heroku Plugin]()

Now click the new **Heroku** link in the left sidebar to show available options. We already connected Strider with Heroku so you’ll see the email address of your connected account in the **Linked Account** dropdown. If you want to deploy to a Heroku application hosted with another account, you can add the account right away.

Select the created app in the **Apps** dropdown. We previously created the **futurestudio-strider** app, which we use for demo purposes. The name is lame, we should have generated a name by Heroku. Now we’re almost done, no way back and no naming fun … Sorry.

![Define Heroku Deployment Options]()

Click save and that’s it. All the configuration is done and we can test if everything works fine.


## Test the Strider-Heroku-Deployment Pipeline
We can manually start an integration and deployment process from Strider’s dashboard. Click the arrow-up cloud **Test and Deploy** button to kickoff the loop.

![Strider Dashboard — Start Integration and Deployment]()

Strider walks through the integration steps and if tests pass successfully, the deployment starts right away.

![Heroku Deployment from Strider]()

If everything went smooth, you can view your project right after the deployment finished. Visit your Heroku app domain to check the health state. 

![Deployed App on Heroku]()


## What Comes Next
We did it! What a great feeling to have a complete continuous integration and deployment pipleline. With the previously published blog posts, you’re able to connect Strider with your git repositories and this guide walks you through the process to setup Strider with Heroku. 

The next post shows you how to deploy your project via SSH to any server.

Please keep in mind: use the comments or shoot us [@futurestud_io](https://twitter.com/futurestud_io) if you run into problems.