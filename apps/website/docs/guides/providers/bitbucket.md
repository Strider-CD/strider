# How to Connect with BitBucket and Run Tests Automatically

You noticed that Strider connects with multiple services to integrate code testing in your build and deployment pipeline. Besides GitHub and Gitlab, Strider integrates Bitbucket. This guide shows you how to seamless combine both platforms.

## Install Strider-Bitbucket Plugin

The first thing to do is the installation of [Strider’s Bitbucket plugin](https://github.com/Strider-CD/strider-bitbucket). Head over to the plugin section in Strider’s admin panel and click the `Install` button if the plugin isn’t already installed.

![Strider Plugin Overview]()

## Register Bitbucket Application

Access to Bitbucket repositories for third-party applications is restricted to applications. You need to create a new application to access your repositories. Navigate to your Bitbucket profile settings page and click on **OAuth**. You can go directly by replacing `your-username` with your Bitbucket username in this link [https://bitbucket.org/account/user/your-username/api](https://bitbucket.org/account/user/your-username/api)

![Create New Bitbucket OAuth Consumer]()

You can create a new Bitbucket Application by clicking on **Add consumer**. Within the opening modal dialog, provide the information for your app: **name**, **description** and an optional **url**.

Creating the application provides the required information about your **Client Key** and **Client Secret**.

![Bitbucket Application Information]()

We need both values (client key and secret) to configure the Strider server for correct access to your Bitbucket repositories.

## Configure Strider Server

Stop the currently running Strider server and use the configuration option of your choice to set the environment.

    # add this configuration to the previously defined Strider config
    export PLUGIN_BITBUCKET_APP_KEY="appkey"
    export PLUGIN_BITBUCKET_APP_SECRET="appsecret"

Now start your Strider server with the additional Bitbucket configuration. The next part describes how to connect Strider with Bitbucket.

## Connect Strider With Bitbucket

If you didn’t add any project to Strider yet, you can use the **Bitbucket** button in Strider’s dashboard. Additionally, you can navigate to the project overview and click the **Bitbucket** button. Strider redirects you to the access overview page.

![Bitbucket Access Overview]()

You can review the requested access. Click the **Grant access** button to allow Strider access to your repositories hosted on Bitbucket. You’ll be redirected to the Strider project overview with your Bitbucket projects.

## Add Bitbucket Repositories to Strider

Select the project of your choice and click the **Add** button. Choose the project type and decide if you want to run the first project test right away.

![Strider Add Project]()

Strider offers the options to start the first test or configure the project after adding it to the platform.

## Run Tests Automatically

Strider automatically adds the required webhooks for Bitbucket to get notified about any repository changes. These changes just include new pushes to the repository and pull requests.

Make sure the hooks have been successfully created in Bitbucket. To do so, navigate to the Bitbucket project page and open the projects settings. In the settings navigation, select **Hooks**.

![Bitbucket Project Settings]()

Verify that the overview lists two hooks: **POST** and **Pull Request POST**. If everything both `POST` hooks exist, you’re done and Strider is correctly connected with Bitbucket.

## Conclusion

Strider offers plugins to integrate the platform with multiple services. Bitbucket is one of the platforms and connects seamless with the [strider-bitbucket]() plugin. Register your app on Bitbucket, configure your server with app key and app secret to authorize Strider with Bitbucket and you’re good to go.
