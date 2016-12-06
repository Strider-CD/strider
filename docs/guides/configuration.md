# Strider — Configuration Guide and Available Options

The first two posts in this Strider series give you an understanding of the platform itself and walk you through the installation process of Strider on your own infrastructure. This article describes and explain Strider’s configuration options. 

You may be interested in the previously published articles as well. The list below outlines the other parts within this series.

---

## Strider Series Overview
1. [Platform Overview and Getting Started](http://futurestud.io/blog/strider-getting-started-platform-overview)
2. [How to Install Strider and Plugins](http://futurestud.io/blog/strider-how-to-install-the-platform-and-plugins)
3. Configuration Guide and Available Options
4. [How to Connect with GitHub and Run Tests Automatically](https://futurestud.io/blog/strider-how-to-connect-with-github-and-run-tests-automatically/)
5. [How to Connect with GitLab and Run Tests Automatically](https://futurestud.io/blog/strider-how-to-connect-with-gitlab-and-run-tests-automatically/)
6. [How to Connect with Bitbucket and Run Tests Automatically](https://futurestud.io/blog/strider-how-to-connect-with-bitbucket-and-run-tests-automatically/)
7. [How to Manually Add Git or Gogs Repository and Run Tests Automatically](https://futurestud.io/blog/strider-how-to-manually-add-git-or-gogs-repository-and-run-tests-automatically/)
9. [Continuous Deployment to Heroku](https://futurestud.io/blog/strider-continuous-deployment-to-heroku/)
10. [Continuous Deployment to any Server via SSH](https://futurestud.io/blog/strider-continuous-deployment-to-any-server-via-ssh/)
11. [Configure and Activate Email Notifications](https://futurestud.io/blog/strider-configure-and-activate-email-notifications/)
12. [Integrate and Notify with Slack](https://futurestud.io/blog/strider-integrate-and-notify-with-slack/)
13. [Integrate and Notify with HipChat](https://futurestud.io/blog/strider-integrate-and-notify-with-hipchat/)
14. [Report Build Status to GitHub](https://futurestud.io/blog/strider-report-build-status-to-github/)
14. [Configure and Use Strider Webhooks](https://futurestud.io/blog/strider-configure-and-use-webhooks/)
15. [How to Create Your Own Plugin](https://futurestud.io/blog/strider-how-to-create-your-own-plugin/)
16. [Series Round-Up](https://futurestud.io/blog/strider-series-round-up/)

---

## Configuration Options
Strider’s default configurations are sufficient to run the platform for testing purposes on your local machine. Production environments (internet-reachable deployments) require configuration to work correctly with services like GitHub, GitLab, Heroku, Email Notifications, and many more.

You can get an overview of Strider’s configuration options in the [GitHub repository](https://github.com/Strider-CD/strider#configuring). The list below describes them as well:

- `SERVER_NAME`: URL on which your server is accessible on the internet: e.g `https://strider.yourdomain.com` (**without trailing slash**)
- `HOST`: Host address where the strider server listens. Defaults to `0.0.0.0`. **Remember:** this binds to the public IP address and makes Strider internet-accessable if your server has Internet connection.
- `PORT`: Port where strider listens. Defaults to `3000`
- `DB_URI`: MongoDB connection string. If not running MongoDB on localhost without authentication, you need to define this option. MongoDB provides an [extensive reference](http://docs.mongodb.org/manual/reference/connection-string/) about the connection string and available options. 
- `HTTP_PROXY`: Specify your proxy. Defaults to `null`
- Email notifications require SMTP server configuration. Of course, you can use any SMTP server. Services like [Mailgun](http://www.mailgun.com/), [Mandrill](https://mandrill.com/), and [Postmark](https://postmarkapp.com/) offer free plans sending a limited amount of mails per month.
    - `SMTP_HOST`: SMTP server hostname (e.g smtp.mailgun.org)
    - `SMTP_PORT`: SMTP server port. Defaults to `587`
    - `SMTP_USER`: SMTP server auth username
    - `SMTP_PASS`: SMTP server auth password
    - `SMTP_FROM`: from address of any notifcation email. Defaults to `Strider noreply@stridercd.com`

**The Strider configuration has to be defined before server start.** Strider loads the config values during its startup phase and and cannot be configured afterwards.

Changing configuration values requires a server restart.


## Load Defined Strider Configuration
Strider offers two ways for configuration. You can either use environment variables or a configuration file. Both options are explained in more detail in the following paragraphs.


### Configuration from Environment Variables
Strider can load its configuration from environment variables. These variables can be passed as system-wide environment or process-affine variables.

Let’s look at Strider configuration with **system-wide environment variables**.

    # set configuration
    export SERVER_NAME="https://stsrider.yourexample.com"
    export PORT=4444
    
    # start Strider
    npm start

The code above illustrates how to define system-wide environment variables via `export KEY=VALUE`.

Another configuration option are **process-wide environment variables**. In contrast to system-wide variables, process-wide variables are only passed to the process during command execution. The configuration values are not available for any other process.

    # configuration and start Strider
    SERVER_NAME="https://stsrider.yourexample.com" PORT=4444 npm start

The process specific values are directly stated before Strider’s start command. 


### Configuration from File
Strider offers an additional option to define and load the platform configuration: via config file. The configuration file `.striderrc` has to be located in Strider’s base directory.

The config files content is stated as JSON. The same options are allowed as stated above. The example snippet below illustrates how the file looks like.

    {
        "server_name": "https://stsrider.yourexample.com",
        "port": "4444"
    }

Strider recognizes the file during startup, parses the content and loads the configuration.

**Keep in mind:** the `.striderrc` config file can only be used for the configuration of Strider itself. Plugins like GitHub, Bitbucket, etc. won’t recognize the options defined. You need to set (separate) environment variables for the plugins.


### Multiple Configuration Options Defined: What Happens?
Environment variables win over configuration file. Strider favors environment variables (both, system- and process-wide) and ignores the configuration file definitions if there is the same config already passed through the environment. 


## What Comes Next
Strider offers abilities to configure your server and integrates with different services. Additionally you're able to choose your preferred configuration option via environment variables or configuration file (`.striderrc`).

The next post in this series describes how to connect Strider with GitHub and add a GitHub repository for automated testing.

If you have any questions or comment, you can reach out to us via the comments below or [@futurestud_io](https://twitter.com/futurestud_io).
