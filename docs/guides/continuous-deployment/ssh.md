# Strider — Continuous Deployment to any Server via SSH

The Future Studio team uses Strider to automatically test and deploy the code for our homepage and blog theme. Even though we rely on Ghost for our blog, we keep our theme in a git repository and trigger the deployment right away after every push.

Previously published articles in this series explain how to connect with git hosting services and trigger automatic tests in Strider.

—
TODO outline
—

## Install Strider-SSH-Deploy Plugin

Strider offers the [strider-ssh-deploy]() plugin for continuous deployment via SSH to any server. Install the plugin via Strider’s admin panel if it isn’t already installed.

![Strider Admin Panel — Plugin Overview]()

Search for **SSH Deploy** and and make sure the plugin is installed. If not, click the **Install** button.

## Continuous Deployment via SSH

Head over to the settings page for the project you want to deploy via SSH. Click the **Plugins** option in the left sidebar. Now drag and drop **SSH Deploy** from **Available Plugins** into **Active Plugins**.

![Strider Project’s Plugin Settings]()

Pushing the **SSH Deploy** card into available plugins adds the plugin settings in Strider’s left sidebar. Click the newly available **SSH Deploy** settings link to define necessary deployment settings.

![SSH Deploy Settings]()

### SSH Deploy Plugin Configuration

First, type the username of the destination host user. This is the user we use to log in via SSH and execute the final deployment. The example above uses the boring `ssh-deploy-user`, please use a more precise username on your host.

Second, specifiy the destination host url with SSH port. The port is optionally if the SSH server on your destination host uses the default port 22. The SSH server on our examplary `yourhost.url` runs on port `1234`.

Third, define the commands to be executed on destination host. You can check the **Transfer bundle** option to move a `.tar.gz` to the remote host. This bundle contains the repositories code as a compressed tarball.

The screen above illustrates code to execute on the remote system. We `cd` into the transfered and uncompressed bundle folder, `pwd` the current working directory, install dependencies with `npm install` and start the node server with `pm2` node process monitor.

### Authorize Strider SSH Public Key for Deployment

In order to authorize the provided SSH user on destination host, we need to make our project’s public key available in the `authorized_keys` file.

Visit the projects settings. This will show you private and public SSH keys for the repository. Strider will use this keys for authorization to other hosts and services.

![Strider Project Settings]()

Copy the public key.

Now use your shell and SSH into your destination host, switch the the user to the specified one in Strider for SSH deployment. From here, change the directory to the system users SSH folder (usually `~/.ssh`).

Edit or create (if not existing) the `authorized_keys` file in the SSH folder. Paste the copied Strider SSH public key into the `authorized_keys` file. This allows Strider to connect to your destination host with the help of the corresponding private key.

The configuration is done. Now we can test the deployment pipeline :)

## Test the Deployment Pipeline via SSH

If you currently don’t have any code to push into the repository and trigger an automated build process, we can start the integration and deployment manuall from Strider’s dashboard.

![Strider Dashboard — Trigger Test & Deploy]()

Strider initiates the test process and performs the known integration. The difference to previous integrations: the **deploy** step performs your SSH deployment.

![Strider Integration and Deployment]()

If everything went smooth, the deployment is available right after tests and deployment finish sucessfully. Visit the url of your server and check your deployed app.

![Running App after Strider SSH Deployment]()
