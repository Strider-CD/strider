# Strider — How to Manually Add Git or Gogs Repository and Run Tests Automatically

We already walked you through the processes of connecting Strider with GitHub, GitLab and Bitbucket to access your repositories for testing. In case you don’t host your git repositories on either of the mentioned services, don’t become panicky. This guide is exactly for you!

## Gogs or Git Repository

At first we wanted to separate this article into separate posts. The problem: Gogs API functionality is very limited and we cannot connect seamlessly from Strider to access the hosted repositories. That’s the reason why we treat Gogs repositories as normal git repositories.

## Install Strider-Git Plugin

First things first: install the required [strider-git]() plugin to manually add git repositories to Strider. Visit the plugin section in admin panel and search for “Git”.

![Strider Plugin Overview]()

Click the **Install** button if the plugin isn’t already installed.

## Add Git Repository to Strider

Strider offers the ability to manually add git repositories besides integrations with git hosting services. Go to the Project overview and click the **Manual Add** tab on the right.

![Projects Overview]()

The manual add view offers multiple options and fields to define for your personal git respository.

First, decide whether the integration tests should be visible by others. If you decide yes, click the **Public** button to activate.

Second, paste a link to your repository. Strider will link your project on the dashboard and uses the provided value. If you don’t have any link, just leave the field empty.

Third, fill a GitHub-style name like `namespace/repository-name`. You’re free to use any name as long as it is in the correct format.

Fourth, fill the clone url of your repository. Make sure you add either an SSH or HTTP(S) url for your repository. In case you add an SSH url, keep in mind to add Strider’s SSH keys to your git repository access list.

Fifth, select the authentication type which Strider should use to access the repository. This type depends on the clone url provided in the field above. For HTTP(S) addresses, you need to specify a username and password. For SSH, you can optionally specify your keys. Strider will generate keys for the project when leaving the fields blank.

**Attention:** we had problems with Strider access the repository using passwords which include a question or exclamation mark. In case you run into auth issues during test runs, double check the respective Strider output.

Finally, click **Create New** to add the repository to Strider.

## Run Your First Test

Make sure Strider can access your repository. Go to Strider’s dashboard and click the **Retest** button. Afterwards, check the test details.

Awesome! Just go ahead to the next section (Run Tests Automatically).

Things went south? Check the output of the test run and correct your provided settings. In case you’ve access problems, you can verify and correct the provided values in the project settings.

![Strider Project’s Provider Settings]()

Double check your values for clone url and authorization. If you chose SSH as authentication method, make sure you either provide your desired keys in the provider settings or add Strider’s generated keys to your user’s `authorized_keys` file on the server hosting your repository.

Strider’s SSH keys are accessable in the project settings.

![Strider Project Settings]()

## Run Tests Automatically

At this point, you added your repository to Strider and manually tested your repository. The next step is to find a method for automatically run code integrations with every push to the repository.

We use git hooks to notify Strider and start test runs via webhook url. This Strider url requires authentication and the branch you want to test.

Let’s get our hands dirty. SSH into your server hosting the git repository you recently added to Strider. `cd` into the repositories folder and further into the specific projects `.git` folder.

    cd /path/to/git-or-gogs-repositories/namespace/repo.git/

We need to edit the **update** git hook. Use the editor of your choice and open the `update` file in git’s hook folder. We use `nano` for editing.

    nano hooks/update

The content of the `update` file may look like this (this is the default gogs update hook):

    #!/usr/bin/env bash
    "/home/system/git/gogs/gogs" update $1 $2 $3

Copy the following lines and paste them into the `update` file you’re currently editing.

```
branch=$(git rev-parse —symbolic —abbrev-ref $1)
if [ "$branch" == "master" ] || [ "$branch" == "staging" ]; then
  echo "Queuing Strider build for ${branch}."
  curl \
    -k \
    -H "Content-Type: application/json" \
    -d "{\"branch\":\"$branch\", \"type\":\"TEST_AND_DEPLOY\"}" \
    -u "YourStriderEmail@Domain.com:YourStriderPassword" \
    -X POST \
    https://YourStriderHost.com/some/repository/start
else
  echo "Skipping Strider build for ${branch}."
fi
```

At first, this snippet parses the branch to which we pushed our code. Second, if the branch matches `master` or `staging`, we perform the Strider notification with the help of **curl**. Please install **curl** on your server.

To perform the start of test runs for this repository, we send a `POST` request to Strider. You have to edit the user data field `„YourStriderEmail@Domain.com:YourStriderPassword“` and the Strider url `https://YourStriderHost.com/some/repository/start`.

Save the `update` file. Push code changes to your local repository to either of the branches which are „allowed“ to trigger the Strider build. You will see an additional output in your command line. The reason for this: the curl command we added to contact Strider and its response.

Check Strider if the build started successfully.

![Strider Build Details]()

The snippet above also sets the Strider test `type` to `TEST_AND_DEPLOY`. Since we didn’t configure any deployment process yet, nothing happens. You can remove the `type` value or change it to `TEST_ONLY` to skip the deployment process.

#### Additional Ressources

- [Gogs Issue: Integrate CI/CD status with hook](https://github.com/gogits/gogs/issues/813)
- [Gogs Issue: Generic Template for Webhook Providers](https://github.com/gogits/gogs/issues/793)
