# Strider — Platform Overview

You're probably reading this article, because you want to keep ownership of your code, host and run your own continous integration and deployment tool. [Strider](https://github.com/Strider-CD/strider) is an open source platform doing exactly this job.

![Strider Open Source Continuous Integration & Deployment Server](http://futurestud.io/blog/content/images/2015/03/strider-logo.png)

This is the first post in our series of blogposts about **Strider**. We’ll look into various topics around the platform. Starting at how to install and configure Strider, going to service integrations with GitHub, GitLab, Bitbucket, Gogs, Heroku, Slack and HipChat. Additionally, we have you covered with the configuration and activation of email notification for build statuses, GitHub build status reports and how to configure Strider webhooks.

---

## Strider Series Overview
1. Platform Overview and Getting Started
2. How to Install Strider
3. Configuration Guide and Available Options
4. How to Connect with GitHub and Run Tests Automatically
5. How to Connect with GitLab and Run Tests Automatically
6. How to Connect with Bitbucket and Run Tests Automatically
7. How to Connect with Gogs and Run Tests Automatically
8. How to Manually Add a Git Repository
9. Configure and Activate Email Notifications
10. Continuous Deployment to Heroku
11. Continuous Deployment to any Server via SSH
12. Integrate and Notify with Slack
13. Integrate and Notify with HipChat
14. Report Build Status to GitHub
15. Configure and Use Strider Webhooks
16. Series Round-Up

---


Strider is highly extensible and offers many plugins to enhance the platforms functionality. The platform integrates and is composed of plugins. You can find more information about the [Strider Extension Loader](https://github.com/Strider-CD/strider-extension-loader) in the GitHub repository.


## Integration with Services via Plugins
Strider is build around a substantial extension loader. Strider integrates seamless with **GitHub**, **GitHub Enterprise**, **Bitbucket**, **GitLab**, **Heroku**, **Slack**, and many more. You can connect your GitHub and Bitbucket accounts to Strider and test your hosted repositories. Deploy your successfully tested code to Heroku and get notified in your Slack chat afterwards.

Some plugins are [available on GitHub](https://github.com/Strider-CD) and you can, of course, add your own. Strider plugins are NodeJS libraries and you can just install them via `npm install` in striders project repository. Actually, each plugin contains a `strider.json` metadata file to expose information about the plugin. And Strider knows how to handle the plugin and which JavaScript files should be initialized and loaded to work correctly.  


## Mighty Plugins
Strider is highly customizable through plugins. They provide many features and massively extend the platform. 

**Plugins can**

- register their own custom HTTP routes
- add hooks to execute arbitrary build actions
- extend the database schema with custom fields
- publish and subscribe to socket events
- create and modify Striders user interfaces



### Strider Environments — Webapp vs. Worker
Strider separates plugins in two environments and loads them separately: webapp and worker.

### Webapp Environment
The webapp is Striders UI you can visit via Browser and configure the platform. Plugins expose options to manipulate via the webapp. You can define your templates, request manual configuration, serve files, listen to global Strider events and many more.  


### Worker Environment
The worker code is loaded for each job running with Strider. Using the `strider-simple-runner` plugin your code gets tested on the same process as your webapp. Worker plugins stick to the exposed extension loader methods to plug their functionality into Strider and make it available to the platform. Worker may load plugin specific configuration from the webapp like paths to SDKs, which branches should be tested or framework versions to test against.


## Supported Programming Languages
The default Strider deployment ships with support for the following programming languages

- NodeJS
- Ruby
- Python

You probably know, we just want to be clear: testing code requires you to have the programming languages installed on the machine running Strider.

You can add support for additional languages or framework by creating a new plugin. 


## Create Your Own Plugin
You can extend Strider with custom functionality via plugins. Strider provides (at least) two ways to create your own plugin. Fist: via template. Second: via command line.

### Create a Plugin from Template
The [strider-template](https://github.com/bitwit/strider-template) repository on GitHub illustrates the basic structure for a strider plugin. The required plugin metadata information is located the `package.json` file.

Clone or fork this repository and add your desired functionality.


### Create a Plugin from Command Line
Strider ships with a command line tool located in `bin/strider`. To create a new plugin, run [`bin/strider init`](https://github.com/Strider-CD/strider/wiki/Managing-Plugins#creating-new-plugins=).

This will ask for the plugin name, description and author.

    plugin: name:  strider-new-plugin
    plugin: description: This will be cool stuff!
    plugin: author: marcus
    Cloning into …
    
    remote: Counting objects: 20, done.
    remote: Total 20 (delta 0), reused 0 (delta 0)
    Unpacking objects: 100% (20/20), done.
    Checking connectivity... done.

    …

Please note that all Strider plugins are named with **strider-** prepend. Of course you can use a name of your choice. It just would be good manner to lean on the official project style.


### Strider.json
Strider plugins require either a [`strider.json`](https://github.com/Strider-CD/strider-extension-loader#striderjson) file in the plugin base directory or a `strider` section in `package.json` file. The information defined is used by Strider to load the plugin code correctly and show users information about it. 

The schema looks like:

    {
      "id": "mycoolplugin", // must be unique.
      "title": "Human Readable Title",
      "icon": "icon.png", // relative to the plugin's `static` directory
      "type": "runner | provider | job | basic", // defaults to basic
      "webapp": "filename.js", // loaded in the webapp environment
      "worker": "filename.js", // loaded in the worker environment
      "templates": {
        "tplname": "<div>Hello {{ name }}</div>", // either HTML or a path to HTML file
        "tplname": "path/to/tpl.html"
      },
      "config": { // project-specific configuration
        "controller": // defaults to "Config.JobController" for job plugins, "Config.ProviderController", etc.
        "script":     // path where the js should be loaded from. Path defaults to "config/config.js"
        "style":      // defaults to "config/config.less". Can be less or css
        "template":   // defaults to "config/config.html"
      }
      // other configurations you need
    }

Static files located in a plugins `/static/` directory are available via url path `/ex/:pluginid`.

---

#### Additional Resources
- [Strider](https://github.com/Strider-CD/) on GitHub
- [Strider Extension Loader](https://github.com/Strider-CD/strider-extension-loader)
- [Strider Plugin Template](https://github.com/bitwit/strider-template)
