# How to Connect with GitLab and Run Tests Automatically

This week we guide you on how to connect Strider with GitLab. Doesn’t matter if you’re connecting to a self-hosted GitLab instance or official [GitLab](https://gitlab.com) repositories.

## Introduction

Strider integrates with multiple services and one of them is GitLab. Since version 6.2, the GitLab API offers functionality to integrate seamless with other services. To connect both platforms, we need to install Striders GitLab plugin, configure your user account with your GitLab API key and then add repositories.

Connecting Strider with GitLab requires the following minimum app versions:

- Strider 1.4
- GitLab 6.2

## Install Strider-GitLab Plugin

The first thing to do is the installation of Strider’s [GitLab plugin](https://github.com/Strider-CD/strider-gitlab). Head over to the plugin section in admin panel and click the `Install` button if the plugin isn’t already installed.

![Strider Plugin Overview]()

## Configure GitLab in Your Strider Account

Strider doesn’t offer GitLab as source for repositories in the projects overview by default. You have to configure GitLab access first in your Strider profile to enable this feature.

![Strider GitLab Configuration]()

Navigate to your GitLab account settings and click the **Add Account** button. Provide a **title** and pass your GitLab API url. GitLabs API url is composed of your default url to access GitLab via browser and `/api/v3`. Hosting your repositories on [gitlab.com](https://gitlab.com) results in the following API url

    https://gitlab.com/api/v3

Your own GitLab deployment will look like

    https://gitlab.my.url/api/v3

The **private token** is located in your GitLab profile. Go to **Account** and copy your private token.

![GitLab Account Settings]()

Press **save** to add this account.

**Attention:** providing wrong credentials will result in misfunction of Strider. The projects overview won’t work anymore. You can fix this issue by uninstalling Striders GitLab plugin via admin panel. If you can’t access the admin panel anymore, uninstall and install the strider-gitlab plugin via command line (with the help of `npm`).

## Add GitLab Repositories to Strider

If you finished the previously describes steps, your GitLab repositories will show in the projects overview.

![Strider GitLab Project Overview]()

Select a project, click **Add** and specify the project type. Strider offers the options to directly test the project or configure it. You can test your code right away or make configuration changes :)

## Run Tests Automatically

Adding a GitLab repository to Strider doesn’t automatically create any webhook to trigger notifications regarding repository changes automatically. To add the webhook navigate to Strider server and open the project detail view of the just added repository. Copy the url with looks like

    https://my.strider.url/username/project-name

Now open another tab in your browser and navigate to your GitLab server. Go to the project settings of the repository you just added to Strider. Open **Web Hooks** and paste the Strider project url into the `URL` input field. Additionally, add `/api/gitlab/webhook` to the url to request the correct Strider webhook url for the specified project.

Your final webhook url looks like

    https://my.strider.url/username/project-name/api/gitlab/webhook

Check your desired `Trigger` types and click **Add Web Hook**.

![GitLab Web Hook Overview]()

GitLab adds a box with provided webhook urls below the add webhook panel. You can test the hook right away by clicking **Test Hook**.

## Conclusion

That’s it. Your Strider deployment is connected with your GitLab profile. You can add GitLab repositories and test them automatically.

Having trouble? Please don’t hesitate to contact us via comments or [@futurestud_io](https://twitter.com/futurestud_io)!
