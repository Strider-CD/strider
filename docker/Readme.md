[![Strider logo](http://stridercd.com/img/logo.png)](http://stridercd.com)

# [Docker](http://docker.io) + [Strider](http://stridercd.com) = winning

[In the Docker Index](https://index.docker.io/u/strider/strider/)

# 0. Install Docker

In order to use `strider-dockerfile` you need to have Docker [installed on your machine](http://www.docker.io/gettingstarted/#anchor-0).

# 1. Install the image

#### Pre-built (fastest)

```bash
sudo docker pull strider/strider:latest
```
# 2. Start it

If you rolled your own, use `my/strider` (or whatever tag you chose) in place
of `strider/strider`.

#### Manual port mapping

By default, Docker does not map any ports inside the container to the public ports on the host machine. This means you won't be able to connect to the Strider instance outside the container. Fortunately, Docker provides a convenient port mapping option with `-p`.

To run Strider in Docker with the Strider webapp mapped to port 3000:

```bash
CID=$(sudo docker run -d -p 3000:3000 strider/strider)
```

For debugging or configuration purposes, you may also like to map MongoDB and SSHd from inside the container. For example, use the following flags to have the internal MongoDB mapped to port 27000 and and the internal SSHd mapped to port 44:

`-p 27000:27017 -p 44:22 strider/strider`

# 3. Enjoy your fully self-contained strider install!

```bash
google-chrome http://localhost:$(sudo docker port $CID 3000)
```

# Security

## Setup SSH keys

The default root password is `str!der`. The following command assumes you have
an ssh key already. If not, run `ssh-keygen`. Github has a pretty good how-to
for ssh keys [here](https://help.github.com/articles/generating-ssh-keys).

```bash
ssh-copy-id "root@localhost -p $(sudo docker port $CID 22)"
```

## Change the root password

```bash
ssh root@localhost -p $(sudo docker port $CID 22) passwd
```

## Logs

Strider's log can be found (inside the docker container) at
`/etc/logs/supervisor/node.log`. To get at this, just ssh in.

## Supervisord

[Supervisord](http://supervisord.org/) is used to manage mongo, ssh, and
strider, taking care of their logs, and restarting them if they crash.

You can control supervisor with `supervisorctl`, which again would be through ssh

```bash
ssh root@localhost -p $(sudo docker port $CID 22) supervisorctl
```

More info at http://supervisord.org/running.html#running-supervisorctl

# Build from scratch

This could take several minutes since it has to setup a whole new environment
including installing several packages. If you just want to change some of the ways
things are configured, jump down to [roll your own](#roll-your-own); you can still
take advantage of several of the prebuilt docker images, saving you lots of time.

```bash
git clone https://github.com/Strider-CD/strider-dockerfile.git
cd strider-dockerfile
make all
```

### Shortcut with 'strider:base'

`strider/strider:base` gives you a great starting point with all of the
necessary packages for running strider, while also giving you the power to:

- add custom strider extensions
- set the default root password & admin user information
- use an external mongo server
- set ENV variables for strider
- do whatever you want, really.

Just clone the `strider-dockerfile` repo, make whatever changes you like to the `custom/Dockerfile`,
and `custom/supervisord.conf` and build!

```bash
cd custom
docker build -t my/strider .
```

### Example: External MongoDB server

As an example of a custom strider build, check out the `nomongo` directory,
which gives you a docker image without a local mongo database; instead you
enter the mongouri as an ENV variable in `supervisord.conf`.

Go ahead and set up a free database with [mongohq](http://mongohq.com) or
[mongolab](http://mongolab.com), enter the `mongouri` into `supervisord.conf`
and you're ready to build!

```bash
cd nomongo
docker build -t my/strider .
```

### How does this work?

- `strider/strider:preclone` contains all of the Ubuntu packages you need to run
a CD server (things like `make`, `g++`, `mongodb`, `ssh-server`, etc.) preinstalled.
- `strider/strider:base` just takes `preclone`, grabs the [Strider repo](https://github.com/Strider-CD/strider),
and runs `npm install`.

If you make your custom Docker image `from strider/strider:base` you don't have to
go through installing all of the packages; it's just bundled for you. you can then
do any setup and configuration you like by adding Docker commands and modifying the
`supervisord.conf`.

# Questions, thoughts, concerns

Please use the github issues to ask any questions or make suggestions.

# License

MIT

