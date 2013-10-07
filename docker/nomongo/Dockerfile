# DOCKER-VERSION 0.4.8

from strider/strider:base

# You can install your custom plugins here; such as:
# run  cd /src; npm install https://github.com/Strider-CD/strider-travis.git

# expose the ports you will use (these are the defaults for ssh, and strider)
expose  22 3000

# supervisord will run ssh and strider, and restart them if they crash
cmd  ["/usr/bin/supervisord", "-n"]

# Set your default root password
run  echo 'root:str!der' | chpasswd

# Create an admin user
run  /src/bin/strider addUser --email test@example.com --password dontlook --admin true

add  supervisord.conf /etc/supervisor/conf.d/supervisord.conf

