# DOCKER-VERSION 0.4.8

from  strider/strider:base

# Root password
run  echo 'root:str!der' | chpasswd

# Add an admin user
run  /usr/bin/mongod --smallfiles --fork --logpath ./mongo.log > /dev/null; sleep 2; /src/bin/strider addUser --email test@example.com --password dontlook --admin true; /usr/bin/mongod --shutdown
# Make sure it was added
run  /usr/bin/mongod --smallfiles --fork --logpath mongo.log > /dev/null; sleep 2; echo "db.users.find()" | mongo localhost/strider-foss | grep test@example.com

add  supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# supervisord will run mongo, ssh, and strider, and restart them if they crash
cmd  ["/usr/bin/supervisord", "-n"]

# 27017 is your local mongodb instance
# 22 is ssh server
# 3000 is strider
# You can find out what ports they are mapped to on your host by running `docker ps`
expose  27017 22 3000
