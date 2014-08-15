# DOCKER-VERSION 1.0.0

from ubuntu:14.04
maintainer Niall O'Higgins <niallo@frozenridge.co>

# create strider user
run useradd -m strider

# update package cache and install some packages
run apt-get -y update
run apt-get -y install nodejs npm git make build-essential openssh-server mongodb-server supervisor libssl-dev python python-dev git default-jre-headless

# create a link to nodejs called node
run update-alternatives --install /usr/bin/node node /usr/bin/nodejs 10

# create some directories for the database, ssh, and supervisor logs
run mkdir -p /data/db && chown -R strider /data
run mkdir -p /var/log/supervisor
run mkdir -p /var/run/sshd

# turn off pam otherwise the ssh login will not work
run sed -ri 's/UsePAM yes/#UsePAM yes/g' /etc/ssh/sshd_config
run sed -ri 's/#UsePAM no/UsePAM no/g' /etc/ssh/sshd_config

workdir /tmp

# clone the strider repository
run git clone -b master https://github.com/Strider-CD/strider.git strider-src

# you can also use the strider repo existing on disc by commenting the git clone command
# and uncommenting the add command below
#add ./ /tmp/strider-src

run npm install -g strider-src

# copy the supervisor config and the strider start script used by it
run cp strider-src/docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
run cp strider-src/docker/start-strider.sh /usr/local/bin/start-strider.sh

# remove the source again
run rm -rf strider-src

# create a database and admin account.
# WARNING: If you are using this image for production do not forget to remove this account.
run /usr/bin/mongod --smallfiles --fork --logpath /data/mongo.log --dbpath /data/db && \
    /usr/local/bin/strider addUser --email test@example.com --password dontlook --admin true  && \
    /usr/bin/mongod --shutdown

# change the root and strider password so we can login via ssh
# Root access is prohibited by default through ssh. To get root access login as strider and su to root.
run echo 'strider:str!der\nroot:str!der' | chpasswd

# start strider on run
cmd ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]

# 22 is ssh server
# 3000 is strider
# You can find out what ports they are mapped to on your host by running `docker ps`
expose 22 3000
