# Strider — Manually Add Repository

You're probably reading this article, because you want to keep ownership of your code, host and run your own continous integration and deployment tool. [Strider](https://github.com/Strider-CD/strider) is an open source platform doing exactly this job. It's written in Node.JS and depends on MongoDB as data store.

![Strider Open Source Continuous Integration & Deployment Server]()

Strider is highly extensible and offers many plugins to enhance the platforms functionality. The platform integrates and composes of plugins. You can find more information about the [Strider Extension Loader](https://github.com/Strider-CD/strider-extension-loader) GitHub repository.


## Installation & Requirements
The [Strider repository describes the platfor m setup](https://github.com/Strider-CD/strider#general-requirements) very well. If you're interested to install Strider, just head over to the repository and follow the steps.

We're skipping the how to guide for initial Strider installation process and start with a ready-to-go platform.


## Integration with Services via Plugins
Strider integrates seamless with **GitHub**, **GitHub Enterprise**, **Bitbucket**, **GitLab**, **Heroku**, **Slack**, and many more. You can connect your GitHub and Bitbucket accounts to Strider and test your hosted repositories. Deploy you successfully tested code to Heroku and get notified in your Slack chat afterwards.

All plugins are [available on GitHub](https://github.com/Strider-CD) and you can, of course, add your own.


## How to Manually Add a Repository
Even though Strider integrates code hosting platforms like GitHub, Bitbucket and GitLab, you might want to add a personal repository hosted on another platform or your own server. You find the add repository view when navigating to `Projects -> Manuall Add` (the screenshot below shows the view). Strider asks for some information while adding your repository:

- URL to the repository (if available)
- Namespace (GitHub style like `username/repository-name`)
- Repository URL (SSH or HTTPS)
- Auth type: SSH or HTTPS

In case you provide an SSH url to your repository, you can define private and public key. Strider automatically generates project specific keys if you leave the input fields empty.

Adding a HTTP(S) url requires you to add username and password so Strider can authenticate correctly for the repository.

![Strider Manual Add a Repository]()


## Authentication Issues
Strider prints bash output for every job. Testing your repository with wrong credentials or missing SSH keys for the repository will end in an `Error: Git clone failed with code 500` error. The output will look like this

	git clone --recursive git@url.to:your/repo.git . -b master

	Cloning into '.'...
	Permission denied, please try again.
	Permission denied, please try again.
	Permission denied (publickey,password).
	fatal: Could not read from remote repository.
	
	Please make sure you have the correct access rights
	and the repository exists.

Solve this problem by either provide the correct user credentials or add the SSH public key to the user that has access to the git repository.

A good way to run integrations is a **buildbot**. Concretely, add a **buildbot** user to your git server and add the given SSH public key for the repository you want to test.

