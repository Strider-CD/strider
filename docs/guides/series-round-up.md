# Strider — Series Round-Up

This is the last post in our series of Strider articles. During the last months we’ve published at least one article per week to show you most important and common use cases of Strider, the open source continuous integration platform. We truely hope you hope you learned a lot. Actually, we did too. Especially the deployment and notifications articles are very useful for our internal setup. Learning by doing :)


## Overview of Strider Posts
All posts in this Strider series can be grouped to a specific topic. Let’s refresh our memory and recap the posts to get an overview of covered topics.


### Getting Started, Install and Configure the Platform
The series starts out with a platform overview introducing Strider and showing supported programming langues. Further, we walk you through the installation process of Strider and how to add plugins via Strider’s admin panel. Besides the general installation process, we have a closer look at configuration options to customize your Strider installation and add OAuth keys and secrets for plugins.

- [Getting Started and Platform Overview](https://futurestud.io/blog/strider-getting-started-platform-overview/)
- [How to Install the Platform and Plugins](https://futurestud.io/blog/strider-how-to-install-the-platform-and-plugins/)
- [Configuration Guide and Available Options](https://futurestud.io/blog/strider-configuration-guide-and-available-options/)


### Connect Git Repositories and Run Tests Automatically
Using continuous integration requires you to connect Strider with Git hosting servies like GitHub, GitLab, Bitbucket, Gogs or just a plain Git repository on your private server. Each guide shows you how to connect from Strider to the services and additionally, how to run tests automatically with every push to the repository.

- [How to Connect With GitHub and Run Tests Automatically](https://futurestud.io/blog/strider-how-to-connect-with-github-and-run-tests-automatically/)
- [How to Connect With GitLab and Run Tests Automatically](https://futurestud.io/blog/strider-how-to-connect-with-gitlab-and-run-tests-automatically/)
- [How to Connect With Bitbucket and Run Tests Automatically](https://futurestud.io/blog/strider-how-to-connect-with-bitbucket-and-run-tests-automatically/)
- [How to Manually Add Git or Gogs Repository and Run Tests Automatically](https://futurestud.io/blog/strider-how-to-manually-add-git-or-gogs-repository-and-run-tests-automatically/)


### Continuous Deployments
To complete your continuous integration pipeline, you can of course add the deployment step right after successful builds. Our series covers two most common deployment scenarios: Heroku and private Server via SSH. Both guides explain and illustrate with screenshots the steps to your successful deployment.

- [Continuous Deployment to Heroku](https://futurestud.io/blog/strider-continuous-deployment-to-heroku/)
- [Continuous Deployment to any Server via SSH](https://futurestud.io/blog/strider-continuous-deployment-to-any-server-via-ssh/)


### Send Notifcations
Notifications for your build and deployment processes may be an essential part of your mental health. Strider offers more than just plain email. You can hook Strider with Slack and HipChat and notify your channels or rooms about succesful or failed integrations.

- [Configure and Activate Email Notifications]()
- [Integrate and Notify with Slack]()
- [Integrate and Notify with HipChat]()


### GitHub Build Status and Strider Webhooks
GitHub’s API is powerful and also provides an endpoint to send build status updates. You can configure GitHub webhooks to start a build process at Strider and report the final result back to GitHub. Furthermore, Strider integrates a webhook plugin which can be configured to send build results to a desired url. 

- [Report Build Status to GitHub]()
- [Configure and Use Strider Webhooks]()


### Create Your Own Plugin
Strider’s modularity allows everyone to add favored functionality. The [ecosystem](https://github.com/Strider-CD/) offers a lot plugins to connect with third-party services or just extend Strider’s functionality. Our guide helps you where to start when writing your own plugin.

- [How to Create Your Own Plugin]()


## Finishing Up
Strider is a powerful continuous integration and deployment platform due to its composition of plugins. Extending the server is straight foward with the help of plugins. 
We hope you enjoyed and learned a lot in this series!

This is the currenly last planned post in this series. We love to get feedback: what did you like? What is missing? Get in touch via [@futurestud_io](https://twitter.com/futurestud_io) or use the comments below.