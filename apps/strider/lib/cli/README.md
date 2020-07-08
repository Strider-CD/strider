# cli

CLI for Strider

## Available Options

```no-highlight
Usage: node strider [command] [options]

command
  addUser       Create a Strider user
  restart       Restart strider (touch .strider)
  list          List local plugins. Use --all to fetch all.
  install       Install a plugin from the ecosystem.
  uninstall     Uninstall a plugin
  upgrade       Replace a plugin with the latest version
  init          Initialize a new plugin for development
  runTest       Run a test and optionally deploy
  pruneJobs     Cleanup all jobs except for the latest 20 or custom

Options:
   -v, --version       Print version and exit
   -m, --plugin_path   Specify path to plugins (defaults to node_modules)
```

## Command Descriptions and options

### addUser

Create a Strider user

```
Options:
  -l User's email address
  -p User's password
  -a Specify if this is an admin (flag) (default: false)
  -f Force create user, existing users with the same email address get updated (flag) (default: false)
```

If a user exists with the given email address, you will have an option to update
that user, or cancel the process.

### restart

Restart strider (touch .strider)

### list

Include remote plugins available for install

```
Options:
  -a Include remote plugins available for install
```

### install

Install a plugin from the ecosystem.

i.e. `$ strider install plugin-name`

_Note: `plugin-name` comes from the [ecosystem index](https://github.com/Strider-CD/ecosystem-index/blob/master/plugins.yml),
the plugin name is the top level id, e.g. 'buildbadge'._

### uninstall

Uninstall a plugin

i.e. `$ strider uninstall plugin-name`

### upgrade

Replace a plugin with the latest version

i.e. `$ strider upgrade plugin-name`

### init

Initialize a new plugin for development

### runTest

Run a test and optionally deploy

```
Options:
  -l User's email address
  -p User's password
  -j Project name (include organization name i.e. org/repo-name)
  -b Branch name (default: master)
  -m Job message (optional)
  -d Deploy on green (optional) (flag)
```

### pruneJobs

Cleanup/prune all jobs except for the latest 20 or custom (use `-k [your number]`)

```
Options:
  -k Number of latest jobs to keep, defaults to 20
  -p Project to target, defaults to all projects
  -d Just print stats about what will be removed, but do not remove any jobs
```
